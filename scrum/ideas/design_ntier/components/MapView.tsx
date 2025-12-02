'use client';

import React, { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import DistanceTable from './DistanceTable';
import type { MapViewData } from '@/src/types/api';

// Dynamic import for Leaflet (client-side only)
const LeafletMap = dynamic(() => import('./LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <div className="text-gray-500">Loading map...</div>
    </div>
  ),
});

interface Props {
  data: MapViewData;
}

export default function MapView({ data }: Props) {
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null);

  // Transform backend data to LeafletMap format
  const visualization = useMemo(() => {
    const markers = [
      // Škoda HQ marker
      {
        name: 'Škoda Auto HQ',
        latitude: data.skoda_hq.lat,
        longitude: data.skoda_hq.lng,
        tier_level: 0,
        color: 'green' as const,
        label: 'HQ',
      },
      // Tier 1 supplier marker
      {
        name: data.tier1_name,
        latitude: data.tier1_location.lat,
        longitude: data.tier1_location.lng,
        tier_level: 1,
        color: 'green' as const,
        label: 'T1',
      },
      // Tier 2 suppliers
      ...data.tier2_suppliers.map(supplier => ({
        name: supplier.name,
        latitude: supplier.location.lat,
        longitude: supplier.location.lng,
        tier_level: 2,
        color: (supplier.stability_score >= 70 ? 'green' : supplier.stability_score >= 50 ? 'yellow' : 'red') as 'green' | 'yellow' | 'red',
        label: 'T2',
      })),
    ];

    // Center on Škoda HQ
    return {
      center: { lat: data.skoda_hq.lat, lng: data.skoda_hq.lng },
      zoom: 5,
      markers,
    };
  }, [data]);

  // Transform suppliers for DistanceTable
  const tableSuppliers = useMemo(() => {
    return data.tier2_suppliers
      .map(supplier => ({
        entity_id: supplier.entity_id,
        name: supplier.name,
        tier_level: 2,
        country: supplier.country,
        city: supplier.location.city,
        distance_km: supplier.distance_from_skoda_km,
        stability_score: supplier.stability_score,
        credit_rating: null,
        marker_color: (supplier.stability_score >= 70 ? 'green' : supplier.stability_score >= 50 ? 'yellow' : 'red') as 'green' | 'yellow' | 'red',
      }))
      .sort((a, b) => a.distance_km - b.distance_km);
  }, [data]);

  // Extract unique countries
  const countries = data.metadata.countries;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-[#4BA82E]">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-[#0E3A2F] mb-2">
              {data.tier1_name}
            </h1>
            <p className="text-sm text-gray-600">
              {data.tier1_location.city}, {data.tier1_country} • Tier 1 Supplier
            </p>
          </div>

          {/* Quick stats */}
          <div className="flex gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#4BA82E]">{data.metadata.tier2_count}</div>
              <div className="text-xs text-gray-500">Tier 2</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#4BA82E]">{countries.length}</div>
              <div className="text-xs text-gray-500">Countries</div>
            </div>
          </div>
        </div>

        {/* Countries list */}
        <div className="mt-4 flex flex-wrap gap-2">
          {countries.map((country, idx) => (
            <span
              key={idx}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
            >
              {country}
            </span>
          ))}
        </div>

        {/* Metadata */}
        <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-600">
          <p>
            <span className="font-semibold">Average Distance:</span> {Math.round(data.metadata.avg_distance_km)} km
            {data.metadata.furthest_supplier && (
              <>
                {' • '}
                <span className="font-semibold">Furthest:</span> {data.metadata.furthest_supplier}
              </>
            )}
            {data.metadata.closest_supplier && (
              <>
                {' • '}
                <span className="font-semibold">Closest:</span> {data.metadata.closest_supplier}
              </>
            )}
          </p>
        </div>
      </div>

      {/* Map and Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Map section (60%) */}
        <div className="h-[500px] border-b border-gray-200">
          <LeafletMap
            visualization={visualization}
            selectedSupplierId={selectedSupplierId}
            onMarkerClick={(name) => setSelectedSupplierId(name)}
          />
        </div>

        {/* Distance table section (40%) */}
        <div className="p-6">
          <DistanceTable
            suppliers={tableSuppliers}
            selectedSupplierId={selectedSupplierId}
            onSupplierSelect={(name) => setSelectedSupplierId(name)}
            showStabilityColumn={true}
          />
        </div>
      </div>
    </div>
  );
}
