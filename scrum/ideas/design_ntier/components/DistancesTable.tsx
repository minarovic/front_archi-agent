'use client';

import { DistanceResult } from '@/src/types/api';

interface Props {
  data: DistanceResult[];
}

/**
 * MCOP-124: Table component for displaying distance calculations
 * Rendered when Explorer Agent's calculate_distance_* tools return data
 */
export default function DistancesTable({ data }: Props) {
  if (!data || data.length === 0) {
    return (
      <div className="border border-blue-200 rounded-lg px-4 py-6 text-center text-gray-600 text-sm bg-blue-50">
        No distance calculations available
      </div>
    );
  }

  return (
    <div className="border border-blue-200 rounded-lg overflow-hidden bg-blue-50" data-testid="distances-table">
      {/* Header */}
      <div className="bg-blue-600 text-white px-4 py-2 flex items-center gap-2">
        <span className="text-lg">📏</span>
        <h3 className="text-sm font-semibold">
          Distance Calculations ({data.length})
        </h3>
      </div>

      {/* Distance rows */}
      <div className="divide-y divide-blue-200">
        {data.map((distance, idx) => (
          <div
            key={idx}
            className="px-4 py-3 flex items-center justify-between hover:bg-blue-100"
          >
            {/* Route */}
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">
                {distance.from_entity} → {distance.to_entity}
              </div>
              <div className="text-xs text-gray-600 mt-0.5">
                {distance.from_city ?? 'Unknown'} → {distance.to_city ?? 'Unknown'}
              </div>
            </div>

            {/* Distance badge */}
            <div className="ml-4 px-3 py-1 bg-blue-600 text-white rounded-full">
              <span className="text-sm font-bold">
                {Math.round(distance.distance_km)} km
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
