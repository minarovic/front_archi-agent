'use client';

import { AlternativeEntity } from '@/src/types/api';

interface Props {
  data: AlternativeEntity[];
}

/**
 * MCOP-124: Table component for displaying alternative suppliers
 * Rendered when Explorer Agent's find_alternatives_by_hs_code tool returns data
 */
export default function AlternativesTable({ data }: Props) {
  // Helper: Color coding for stability score
  const getStabilityColor = (score: number | null) => {
    if (score === null) return 'text-gray-400';
    if (score >= 70) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!data || data.length === 0) {
    return (
      <div className="border border-gray-200 rounded-lg px-4 py-8 text-center text-gray-500 text-sm bg-gray-50">
        No alternative suppliers found
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden" data-testid="alternatives-table">
      {/* Header */}
      <div className="bg-[#0E3A2F] text-white px-4 py-2 flex items-center gap-2">
        <span className="text-lg">🔍</span>
        <h3 className="text-sm font-semibold">
          Alternative Suppliers ({data.length})
        </h3>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">
                Supplier Name
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">
                Country
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">
                Tier
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">
                Stability
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">
                Distance from Škoda
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((supplier, idx) => (
              <tr
                key={supplier.entity_id || idx}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="px-4 py-3 font-medium text-gray-900">
                  {supplier.name}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {supplier.country}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  Tier {supplier.tier_level}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-sm font-semibold ${getStabilityColor(supplier.stability_score)}`}>
                    {supplier.stability_score !== null
                      ? `${supplier.stability_score}/100`
                      : 'N/A'}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {supplier.distance_from_skoda_km !== null
                    ? `${Math.round(supplier.distance_from_skoda_km)} km`
                    : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
