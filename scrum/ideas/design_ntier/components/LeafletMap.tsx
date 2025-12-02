'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getTierMarkerIcon, getSkodaHQIcon } from '@/src/utils/mapMarkers';

interface MapMarker {
  name: string;
  latitude: number;
  longitude: number;
  tier_level: number; // 0 for HQ, 1-3 for tiers
  color: "green" | "yellow" | "red";
  label: string;
}

interface Props {
  visualization: {
    center: { lat: number; lng: number };
    zoom: number;
    markers: MapMarker[];
  };
  selectedSupplierId?: string | null;
  onMarkerClick?: (supplierId: string) => void;
}

export default function LeafletMap({ visualization, selectedSupplierId, onMarkerClick }: Props) {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());

  useEffect(() => {
    if (!mapRef.current) {
      // Initialize map
      const map = L.map('leaflet-map').setView(
        [visualization.center.lat, visualization.center.lng],
        visualization.zoom
      );

      // Add tile layer (OpenStreetMap)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      // Add distance bands (concentric circles)
      const DISTANCE_BANDS = [200, 500, 1000, 1500]; // km
      const SKODA_HQ = { lat: 50.42418, lng: 14.9359808 };

      DISTANCE_BANDS.forEach((km, idx) => {
        L.circle([SKODA_HQ.lat, SKODA_HQ.lng], {
          radius: km * 1000, // meters
          color: idx === DISTANCE_BANDS.length - 1 ? '#dc2626' : '#64f2b0',
          weight: 2,
          opacity: 0.28,
          fillColor: idx === 0 ? 'rgba(100,242,176,0.12)' :
                     idx === 1 ? 'rgba(100,242,176,0.08)' :
                     idx === 2 ? 'rgba(100,242,176,0.05)' :
                     'rgba(220,38,38,0.05)',
          fillOpacity: 1,
        }).addTo(map);
      });

      mapRef.current = map;
    }

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current.clear();

    // Add markers
    visualization.markers.forEach(markerData => {
      const icon = markerData.tier_level === 0
        ? getSkodaHQIcon()
        : getTierMarkerIcon(markerData.tier_level, markerData.color);

      const marker = L.marker([markerData.latitude, markerData.longitude], { icon })
        .addTo(mapRef.current!)
        .bindPopup(`<strong>${markerData.name}</strong><br/>Tier ${markerData.tier_level}`);

      marker.on('click', () => {
        if (onMarkerClick && markerData.tier_level !== 0) {
          onMarkerClick(markerData.name);
        }
      });

      markersRef.current.set(markerData.name, marker);
    });

    // Highlight selected marker
    if (selectedSupplierId) {
      const marker = markersRef.current.get(selectedSupplierId);
      if (marker) {
        mapRef.current?.panTo(marker.getLatLng());
        marker.openPopup();
      }
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [visualization, selectedSupplierId, onMarkerClick]);

  return <div id="leaflet-map" className="w-full h-full" />;
}
