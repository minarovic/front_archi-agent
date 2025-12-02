import React, { useEffect, useRef } from 'react';

interface Supplier {
  entity_id: string;
  name: string;
  tier_level: number;
  country: string;
  city: string | null;
  distance_km: number;
  stability_score: number | null;
  credit_rating: string | null;
  marker_color: "green" | "yellow" | "red";
}

interface Props {
  suppliers: Supplier[];
  selectedSupplierId?: string | null;
  onSupplierSelect?: (supplierId: string) => void;
  showStabilityColumn?: boolean;
}

export default function DistanceTable({
  suppliers,
  selectedSupplierId,
  onSupplierSelect,
  showStabilityColumn = false
}: Props) {
  const tableRef = useRef<HTMLTableElement>(null);

  // Scroll to selected row
  useEffect(() => {
    if (selectedSupplierId && tableRef.current) {
      const row = tableRef.current.querySelector(`[data-supplier-id="${selectedSupplierId}"]`);
      if (row) {
        row.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [selectedSupplierId]);

  const getTierBadgeColor = (tier: number): string => {
    switch (tier) {
      case 1: return 'bg-blue-100 text-blue-800';
      case 2: return 'bg-orange-100 text-orange-800';
      case 3: return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStabilityColor = (score: number | null): string => {
    if (score === null) return 'text-gray-500';
    if (score >= 70) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white" data-testid="distance-table">
      {/* Header */}
      <div className="bg-[#0E3A2F] text-white px-4 py-2 flex items-center gap-2">
        <span className="text-lg">📏</span>
        <h3 className="text-sm font-semibold">
          Nearest Suppliers ({suppliers.length}) - Sorted by Distance
        </h3>
      </div>

      {/* Table */}
      <div className="overflow-x-auto max-h-96">
        <table ref={tableRef} className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">
                Supplier Name
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">
                Location
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">
                Tier
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">
                Distance (km)
              </th>
              {showStabilityColumn && (
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">
                  Stability
                </th>
              )}
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier) => (
              <tr
                key={supplier.entity_id}
                data-supplier-id={supplier.name}
                className={`border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                  selectedSupplierId === supplier.name ? 'bg-green-50' : ''
                }`}
                onClick={() => onSupplierSelect?.(supplier.name)}
              >
                <td className="px-4 py-3 font-medium text-gray-900">
                  {supplier.name}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {supplier.city ? `${supplier.city}, ` : ''}{supplier.country}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs font-semibold rounded ${getTierBadgeColor(supplier.tier_level)}`}>
                    Tier {supplier.tier_level}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm font-bold text-gray-900">
                  {Math.round(supplier.distance_km)} km
                </td>
                {showStabilityColumn && (
                  <td className="px-4 py-3">
                    <span className={`text-sm font-semibold ${getStabilityColor(supplier.stability_score)}`}>
                      {supplier.stability_score !== null
                        ? `${supplier.stability_score}/100`
                        : 'N/A'}
                    </span>
                  </td>
                )}
                <td className="px-4 py-3">
                  <button
                    className="text-xs text-[#0E3A2F] hover:underline"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Future: trigger canvas switch to supplier detail
                      console.log('Detail clicked:', supplier.name);
                    }}
                  >
                    Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty state */}
      {suppliers.length === 0 && (
        <div className="px-4 py-8 text-center text-gray-500 text-sm">
          No suppliers found
        </div>
      )}
    </div>
  );
}
