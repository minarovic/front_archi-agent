'use client';

import { useState, useMemo } from 'react';
import type { SupplierDetail } from '@/src/types/api';

type SortField = 'name' | 'country' | 'stability';
type SortOrder = 'asc' | 'desc';

interface SupplierTableProps {
  suppliers: SupplierDetail[];
}

// Risk alert helpers
function getRiskLevel(score: number | undefined | null): 'high' | 'medium' | 'stable' | 'unknown' {
  if (score === null || score === undefined) return 'unknown';
  if (score < 50) return 'high';
  if (score < 70) return 'medium';
  return 'stable';
}

function getRiskBadge(score: number | undefined | null) {
  const level = getRiskLevel(score);

  switch (level) {
    case 'high':
      return {
        icon: '🔴',
        text: 'HIGH RISK',
        bgColor: 'bg-red-50',
        textColor: 'text-red-800',
        borderColor: 'border-red-200'
      };
    case 'medium':
      return {
        icon: '⚠️',
        text: 'MEDIUM RISK',
        bgColor: 'bg-yellow-50',
        textColor: 'text-yellow-800',
        borderColor: 'border-yellow-200'
      };
    case 'stable':
      return {
        icon: '✅',
        text: 'STABLE',
        bgColor: 'bg-green-50',
        textColor: 'text-green-800',
        borderColor: 'border-green-200'
      };
    default:
      return null;
  }
}

export default function SupplierTable({ suppliers }: SupplierTableProps) {
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const sortedSuppliers = useMemo(() => {
    const sorted = [...suppliers].sort((a, b) => {
      if (sortField === 'stability') {
        const aScore = a.financial_stability_score ?? -1;
        const bScore = b.financial_stability_score ?? -1;
        return sortOrder === 'asc' ? aScore - bScore : bScore - aScore;
      }

      const aVal = a[sortField];
      const bVal = b[sortField];

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [suppliers, sortField, sortOrder]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return '⇅';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              #
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => toggleSort('name')}
            >
              <div className="flex items-center gap-2">
                Company Name
                <span className="text-[#4BA82E]">{getSortIcon('name')}</span>
              </div>
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => toggleSort('country')}
            >
              <div className="flex items-center gap-2">
                Country
                <span className="text-[#4BA82E]">{getSortIcon('country')}</span>
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tier Level
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => toggleSort('stability')}
            >
              <div className="flex items-center gap-2">
                Stability Score
                <span className="text-[#4BA82E]">{getSortIcon('stability')}</span>
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Risk Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {sortedSuppliers.map((supplier, index) => {
            const riskBadge = getRiskBadge(supplier.financial_stability_score);
            const stabilityScore = supplier.financial_stability_score;

            return (
              <tr
                key={`${supplier.name}-${index}`}
                className="hover:bg-[#E8F5E3] transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {supplier.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  <span className="inline-flex items-center gap-2">
                    <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                      {supplier.country}
                    </span>
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#E8F5E3] text-[#2D7A1C]">
                    Tier {supplier.tier_level}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {stabilityScore !== null && stabilityScore !== undefined ? (
                    <span className={`font-semibold ${
                      stabilityScore < 50 ? 'text-red-600' :
                      stabilityScore < 70 ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                      {stabilityScore.toFixed(1)}/100
                    </span>
                  ) : (
                    <span className="text-gray-400">N/A</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {riskBadge ? (
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${riskBadge.bgColor} ${riskBadge.textColor} ${riskBadge.borderColor}`}>
                      <span>{riskBadge.icon}</span>
                      <span>{riskBadge.text}</span>
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">-</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
