'use client';

import React, { useState } from 'react';
import type { ComparisonResponse } from '@/src/types/comparison';
import ComparisonGraph from './ComparisonGraph';
import { NarrativeCard } from './NarrativeCard';

interface ComparisonViewProps {
  data: ComparisonResponse['data'];
}

export default function ComparisonView({ data }: ComparisonViewProps) {
  const [viewMode, setViewMode] = useState<'table' | 'graph'>('table');
  const [companyA, companyB] = data.companies;

  // Tier 2 data flags
  const hasCommon = data.common_count > 0;
  const hasUniqueA = data.unique_to_a.length > 0;
  const hasUniqueB = data.unique_to_b.length > 0;

  // Winner calculation for quick metrics
  const uniqueWinner = data.unique_to_a.length > data.unique_to_b.length ? 'A' :
                       data.unique_to_b.length > data.unique_to_a.length ? 'B' : 'TIE';
  const uniqueGap = Math.abs(data.unique_to_a.length - data.unique_to_b.length);
  const uniqueGapPct = data.unique_to_a.length > 0 || data.unique_to_b.length > 0
    ? ((uniqueGap / Math.max(data.unique_to_a.length, data.unique_to_b.length)) * 100).toFixed(0)
    : '0';

  // Tier 3 data flags (MCOP-029)
  const hasTier3Common = data.tier3_common.length > 0;
  const hasTier3UniqueA = data.tier3_unique_to_a.length > 0;
  const hasTier3UniqueB = data.tier3_unique_to_b.length > 0;
  const hasHighRiskSuppliers = data.high_risk_shared_suppliers && data.high_risk_shared_suppliers.length > 0;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* MCOP-031: LLM Narrative Card */}
      {data.narrative && (
        <NarrativeCard
          title="AI Comparison Analysis"
          content={data.narrative}
          icon="📊"
        />
      )}

      {/* Unified Header - Flat design */}
      <div className="bg-white border border-gray-200 border-t-4 border-t-[#4BA82E]">
        <div className="bg-[#0E3A2F] px-8 py-6">
          <h1 className="text-3xl font-bold text-white">
            {companyA} <span className="text-[#78FAAE]">vs</span> {companyB}
          </h1>
          <p className="text-[#78FAAE] text-base font-medium mt-2">
            Supply Chain Comparison Analysis
          </p>
        </div>
      </div>

      {/* MCOP-041: Decision Scoreboard Widget (Executive Summary) */}
      <div className="bg-white border border-gray-200">
        <div className="bg-[#0E3A2F] px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-white">Decision Scoreboard</h2>
          <p className="text-[#78FAAE] text-sm mt-1">Executive comparison at a glance</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* Criteria 1: Supply Chain Overlap */}
            <div className="bg-gray-50 p-4 border border-gray-200">
              <div className="text-xs text-gray-500 uppercase mb-2">Overlap</div>
              <div className="text-2xl font-bold text-[#4BA82E] mb-2">
                {data.overlap_percentage.toFixed(0)}%
              </div>
              <div className="text-xs text-gray-600">Tier 2 shared</div>
            </div>

            {/* Criteria 2: Unique Suppliers */}
            <div className={`p-4 border ${
              uniqueWinner === 'A' ? 'bg-green-50 border-[#4BA82E]' :
              uniqueWinner === 'B' ? 'bg-green-50 border-[#4BA82E]' :
              'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs text-gray-500 uppercase">Diversification</div>
                {uniqueWinner !== 'TIE' && <span className="text-[#4BA82E] text-lg font-bold">✓</span>}
              </div>
              <div className="text-lg font-bold text-gray-900">
                {uniqueWinner === 'A' ? companyA : uniqueWinner === 'B' ? companyB : 'Tie'}
              </div>
              {uniqueWinner !== 'TIE' && (
                <div className="text-xs text-gray-600 mt-1">
                  +{uniqueGap} suppliers ({uniqueGapPct}%)
                </div>
              )}
            </div>

            {/* Criteria 3: Tier 3 Coverage */}
            <div className="bg-gray-50 p-4 border border-gray-200">
              <div className="text-xs text-gray-500 uppercase mb-2">Tier 3 Coverage</div>
              <div className="text-2xl font-bold text-[#4BA82E] mb-2">
                {data.tier3_common.length + data.tier3_unique_to_a.length + data.tier3_unique_to_b.length}
              </div>
              <div className="text-xs text-gray-600">Total suppliers</div>
            </div>

            {/* Criteria 4: Risk (High-Risk Shared) */}
            <div className={`p-4 border ${
              data.high_risk_shared_suppliers && data.high_risk_shared_suppliers.length > 0
                ? 'bg-red-50 border-red-500'
                : 'bg-green-50 border-[#4BA82E]'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs text-gray-500 uppercase">Risk</div>
                {(!data.high_risk_shared_suppliers || data.high_risk_shared_suppliers.length === 0) &&
                  <span className="text-[#4BA82E] text-lg font-bold">✓</span>
                }
              </div>
              <div className="text-lg font-bold text-gray-900">
                {data.high_risk_shared_suppliers && data.high_risk_shared_suppliers.length > 0
                  ? `${data.high_risk_shared_suppliers.length} Critical`
                  : 'Low Risk'
                }
              </div>
              <div className="text-xs text-gray-600 mt-1">
                Shared suppliers
              </div>
            </div>

            {/* Criteria 5: Resilience (placeholder - requires backend) */}
            <div className="bg-gray-50 p-4 border border-gray-200">
              <div className="text-xs text-gray-500 uppercase mb-2">Resilience</div>
              <div className="text-sm text-gray-500 font-medium">
                Coming Soon
              </div>
              <div className="text-xs text-gray-600 mt-1">Multi-factor score</div>
            </div>

            {/* Criteria 6: ESG (placeholder - requires backend) */}
            <div className="bg-gray-50 p-4 border border-gray-200">
              <div className="text-xs text-gray-500 uppercase mb-2">ESG</div>
              <div className="text-sm text-gray-500 font-medium">
                Coming Soon
              </div>
              <div className="text-xs text-gray-600 mt-1">Sustainability</div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              <strong>Overall:</strong> Based on available data, both companies show comparable supply chain characteristics.
              {uniqueWinner !== 'TIE' && (
                <> {uniqueWinner === 'A' ? companyA : companyB} has better diversification with {uniqueGap} more unique suppliers.</>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* MCOP-041: Quick Metrics Row with Winner Badges */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Card 1: Overlap Percentage */}
        <div className="bg-white p-5 shadow border-l-4 border-[#4BA82E]">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-700">Supply Chain Overlap</p>
            <span className="text-xl">🔗</span>
          </div>
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-[#4BA82E]">
                {data.overlap_percentage.toFixed(1)}%
              </span>
              <span className="text-xs text-gray-500">Tier 2</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-[#4BA82E]">
                {data.tier3_overlap_pct.toFixed(1)}%
              </span>
              <span className="text-xs text-gray-500">Tier 3</span>
            </div>
          </div>
        </div>

        {/* Card 2: Common Suppliers */}
        <div className="bg-white p-5 shadow border-l-4 border-[#4BA82E]">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-700">Common Suppliers</p>
            <span className="text-xl">🤝</span>
          </div>
          <p className="text-4xl font-bold text-[#4BA82E] mb-1">
            {data.common_count}
          </p>
          <p className="text-xs text-gray-500">Shared Tier 2 suppliers</p>
        </div>

        {/* Card 3: Unique Suppliers with Winner Badge */}
        <div className={`p-5 shadow border-l-4 ${
          uniqueWinner === 'A' ? 'bg-green-50 border-green-500' :
          uniqueWinner === 'B' ? 'bg-green-50 border-green-500' :
          'bg-white border-gray-300'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-700">Unique Suppliers</p>
            <div className="flex items-center gap-1">
              <span className="text-xl">🌍</span>
              {uniqueWinner !== 'TIE' && <span className="text-green-600 text-xl">🏆</span>}
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <p className="text-2xl font-bold text-gray-900">
              {data.unique_to_a.length}
            </p>
            <span className="text-gray-400 text-xl">+</span>
            <p className="text-2xl font-bold text-gray-900">
              {data.unique_to_b.length}
            </p>
          </div>
          {uniqueWinner !== 'TIE' ? (
            <p className="text-xs font-medium text-green-700">
              🏆 {uniqueWinner === 'A' ? companyA : companyB} leads by {uniqueGap} (+{uniqueGapPct}%)
            </p>
          ) : (
            <p className="text-xs text-gray-500">Equal distribution</p>
          )}
        </div>

        {/* Card 4: Risk Distribution */}
        <div className={`p-5 shadow border-l-4 ${
          data.high_risk_shared_suppliers && data.high_risk_shared_suppliers.length > 0
            ? 'bg-red-50 border-red-500'
            : 'bg-green-50 border-green-500'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-700">Risk Status</p>
            <span className="text-xl">
              {data.high_risk_shared_suppliers && data.high_risk_shared_suppliers.length > 0 ? '⚠️' : '🛡️'}
            </span>
          </div>
          <p className={`text-4xl font-bold mb-1 ${
            data.high_risk_shared_suppliers && data.high_risk_shared_suppliers.length > 0
              ? 'text-red-600'
              : 'text-green-600'
          }`}>
            {data.high_risk_shared_suppliers && data.high_risk_shared_suppliers.length > 0
              ? data.high_risk_shared_suppliers.length
              : '0'
            }
          </p>
          <p className={`text-xs font-medium ${
            data.high_risk_shared_suppliers && data.high_risk_shared_suppliers.length > 0
              ? 'text-red-700'
              : 'text-green-700'
          }`}>
            {data.high_risk_shared_suppliers && data.high_risk_shared_suppliers.length > 0
              ? 'High-risk critical suppliers'
              : '✓ No high-risk overlap detected'
            }
          </p>
        </div>
      </div>

      {/* MCOP-041: Resilience Scorecard - Visual Battle */}
      <div className="bg-white border border-gray-200">
        <div className="bg-[#0E3A2F] px-6 py-4">
          <h2 className="text-xl font-bold text-white">Resilience Scorecard</h2>
          <p className="text-[#78FAAE] text-sm mt-1">Side-by-side comparison of supply chain robustness</p>
        </div>
        <div className="p-6">
          {(() => {
            // Calculate mock resilience metrics from available data
            const countriesA = new Set(data.unique_to_a.map(s => s.country)).size;
            const countriesB = new Set(data.unique_to_b.map(s => s.country)).size;
            const commonCountries = new Set(data.common_suppliers.map(s => s.country)).size;
            const geoScoreA = Math.min(100, (countriesA + commonCountries) * 8);
            const geoScoreB = Math.min(100, (countriesB + commonCountries) * 8);

            const redundancyA = data.unique_to_a.length > 0 ? Math.min(100, (data.unique_to_a.length / (data.common_count || 1)) * 30) : 50;
            const redundancyB = data.unique_to_b.length > 0 ? Math.min(100, (data.unique_to_b.length / (data.common_count || 1)) * 30) : 50;

            const tier3ScoreA = Math.min(100, (data.tier3_unique_to_a.length + data.tier3_common.length) * 2);
            const tier3ScoreB = Math.min(100, (data.tier3_unique_to_b.length + data.tier3_common.length) * 2);

            const riskScoreA = data.high_risk_shared_suppliers ? Math.max(0, 100 - (data.high_risk_shared_suppliers.length * 15)) : 100;
            const riskScoreB = riskScoreA; // Same for both (shared risk)

            const totalScoreA = ((geoScoreA + redundancyA + tier3ScoreA + riskScoreA) / 4).toFixed(0);
            const totalScoreB = ((geoScoreB + redundancyB + tier3ScoreB + riskScoreB) / 4).toFixed(0);

            const metrics = [
              { name: 'Geographic Diversity', scoreA: geoScoreA, scoreB: geoScoreB, maxScore: 100, icon: '🌍' },
              { name: 'Supplier Redundancy', scoreA: redundancyA, scoreB: redundancyB, maxScore: 100, icon: '🔄' },
              { name: 'Tier 3 Coverage', scoreA: tier3ScoreA, scoreB: tier3ScoreB, maxScore: 100, icon: '📊' },
              { name: 'Risk Mitigation', scoreA: riskScoreA, scoreB: riskScoreB, maxScore: 100, icon: '🛡️' },
            ];

            const winsA = metrics.filter(m => m.scoreA > m.scoreB).length;
            const winsB = metrics.filter(m => m.scoreB > m.scoreA).length;
            const ties = metrics.filter(m => m.scoreA === m.scoreB).length;

            return (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                  {metrics.map((metric, idx) => {
                    const winnerA = metric.scoreA > metric.scoreB;
                    const winnerB = metric.scoreB > metric.scoreA;
                    const tie = metric.scoreA === metric.scoreB;
                    const maxHeight = 140;
                    const heightA = (metric.scoreA / metric.maxScore) * maxHeight;
                    const heightB = (metric.scoreB / metric.maxScore) * maxHeight;

                    return (
                      <div key={idx} className="text-center">
                        <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-6">
                          {metric.name}
                        </p>

                        {/* Side-by-side vertical bars - Flat design */}
                        <div className="flex items-end justify-center gap-4 mb-4" style={{ height: `${maxHeight}px` }}>
                          {/* Company A Bar */}
                          <div className="flex flex-col items-center">
                            <div className={`w-12 border-2 ${
                              winnerA ? 'bg-[#4BA82E] border-[#4BA82E]' : tie ? 'bg-gray-200 border-gray-300' : 'bg-gray-100 border-gray-200'
                            }`} style={{ height: `${heightA}px` }}>
                            </div>
                            <p className="text-base font-bold text-gray-900 mt-3">{metric.scoreA.toFixed(0)}</p>
                            <p className="text-xs text-gray-500 truncate max-w-[4rem] mt-1" title={companyA}>
                              {companyA.split(' ')[0]}
                            </p>
                            {winnerA && (
                              <div className="text-[#4BA82E] text-sm font-bold mt-1">✓</div>
                            )}
                          </div>

                          {/* Company B Bar */}
                          <div className="flex flex-col items-center">
                            <div className={`w-12 border-2 ${
                              winnerB ? 'bg-[#4BA82E] border-[#4BA82E]' : tie ? 'bg-gray-200 border-gray-300' : 'bg-gray-100 border-gray-200'
                            }`} style={{ height: `${heightB}px` }}>
                            </div>
                            <p className="text-base font-bold text-gray-900 mt-3">{metric.scoreB.toFixed(0)}</p>
                            <p className="text-xs text-gray-500 truncate max-w-[4rem] mt-1" title={companyB}>
                              {companyB.split(' ')[0]}
                            </p>
                            {winnerB && (
                              <div className="text-[#4BA82E] text-sm font-bold mt-1">✓</div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Overall Summary - Flat cards */}
                <div className="pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left: Summary text */}
                    <div className="bg-gray-50 border border-gray-200 p-5">
                      <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">Overall Result</p>
                      <p className="text-base font-semibold text-gray-900">
                        {winsA > winsB ? (
                          <><span className="text-[#4BA82E]">{companyA}</span> wins {winsA}-{winsB}</>
                        ) : winsB > winsA ? (
                          <><span className="text-[#4BA82E]">{companyB}</span> wins {winsB}-{winsA}</>
                        ) : (
                          <>Tie {winsA}-{winsB}{ties > 0 ? `-${ties}` : ''}</>
                        )}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">Based on 4 resilience metrics</p>
                    </div>

                    {/* Right: Score comparison */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 border border-gray-200 p-5 text-center">
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                          {companyA.split(' ')[0]}
                        </p>
                        <p className="text-4xl font-bold text-[#4BA82E]">{totalScoreA}</p>
                        <p className="text-xs text-gray-500 mt-1">Avg. Score</p>
                      </div>
                      <div className="bg-gray-50 border border-gray-200 p-5 text-center">
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                          {companyB.split(' ')[0]}
                        </p>
                        <p className="text-4xl font-bold text-[#4BA82E]">{totalScoreB}</p>
                        <p className="text-xs text-gray-500 mt-1">Avg. Score</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      </div>

      {/* High-Risk Warning Banner (MCOP-029) */}
      {hasHighRiskSuppliers && (
        <div className="bg-amber-50 border border-amber-500 border-l-4 p-6">
          <div>
            <p className="text-amber-900 font-bold text-lg">
              {data.high_risk_shared_suppliers!.length} High-Risk Critical Supplier{data.high_risk_shared_suppliers!.length > 1 ? 's' : ''} Detected
            </p>
            <p className="text-amber-800 text-base mt-2">
              Shared Tier 3 suppliers with high criticality scores detected. Review risk concentration in common supply chain network.
            </p>
          </div>
        </div>
      )}

      {/* Toggle Button for Graph/Table View */}
      <div className="bg-white border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Supply Chain Visualization</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('table')}
              className={`px-4 py-2 text-sm font-medium border transition-all duration-200 ${
                viewMode === 'table'
                  ? 'bg-[#0E3A2F] text-white border-[#0E3A2F]'
                  : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
            >
              📊 Table View
            </button>
            <button
              onClick={() => setViewMode('graph')}
              className={`px-4 py-2 text-sm font-medium border transition-all duration-200 ${
                viewMode === 'graph'
                  ? 'bg-[#0E3A2F] text-white border-[#0E3A2F]'
                  : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
            >
              🔗 Graph View
            </button>
          </div>
        </div>
      </div>

      {/* Graph View */}
      {viewMode === 'graph' && (
        <ComparisonGraph data={data} />
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <>
          {/* Tier 2 Analysis Section */}
          <div className="pt-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Tier 2 Analysis</h2>
          </div>

      {/* Common Suppliers Table */}
      {hasCommon && (
        <div className="bg-white border border-gray-200 overflow-hidden">
          <div className="bg-[#4BA82E] px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-white">
              Common Suppliers ({data.common_count})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Country
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tier Level
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.common_suppliers.map((supplier, index) => (
                  <tr key={index} className="hover:bg-[#E8F5E3] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {supplier.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                        {supplier.country}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#E8F5E3] text-[#2D7A1C]">
                        Tier {supplier.tier_level}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!hasCommon && (
        <div className="bg-yellow-50 border border-yellow-200 p-6">
          <p className="text-yellow-800 font-semibold">No common suppliers found</p>
          <p className="text-yellow-700 text-sm mt-1">
            {companyA} and {companyB} have completely separate supply chains.
          </p>
        </div>
      )}

      {/* Unique to Company A Table */}
      {hasUniqueA && (
        <div className="bg-white border border-gray-200 overflow-hidden">
          <div className="bg-blue-600 px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-white">
              Unique to {companyA} ({data.unique_to_a.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Country
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tier Level
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.unique_to_a.map((supplier, index) => (
                  <tr key={index} className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {supplier.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                        {supplier.country}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Tier {supplier.tier_level}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Unique to Company B Table */}
      {hasUniqueB && (
        <div className="bg-white border border-gray-200 overflow-hidden">
          <div className="bg-orange-600 px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-white">
              Unique to {companyB} ({data.unique_to_b.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Country
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tier Level
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.unique_to_b.map((supplier, index) => (
                  <tr key={index} className="hover:bg-orange-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {supplier.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                        {supplier.country}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        Tier {supplier.tier_level}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tier 3 Analysis Section (MCOP-029) */}
      <div className="pt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Tier 3 Analysis</h2>
      </div>

      {/* Tier 3 Common Suppliers Table */}
      {hasTier3Common && (
        <div className="bg-white border border-gray-200 overflow-hidden">
          <div className="bg-[#4BA82E] px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-white">
              Tier 3 Common Suppliers ({data.tier3_common.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Country
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tier Level
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.tier3_common.map((supplier, index) => {
                  const isHighRisk = data.high_risk_shared_suppliers?.includes(supplier.name) || false;
                  return (
                    <tr
                      key={index}
                      className={`${
                        isHighRisk
                          ? 'bg-red-50 hover:bg-red-100'
                          : 'hover:bg-[#E8F5E3]'
                      } transition-colors`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {index + 1}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                        isHighRisk ? 'text-red-700' : 'text-gray-900'
                      }`}>
                        {supplier.name}
                        {isHighRisk && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                            HIGH RISK
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                          {supplier.country}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          isHighRisk
                            ? 'bg-red-100 text-red-800'
                            : 'bg-[#E8F5E3] text-[#2D7A1C]'
                        }`}>
                          Tier {supplier.tier_level}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!hasTier3Common && (
        <div className="bg-yellow-50 border border-yellow-200 p-6">
          <p className="text-yellow-800 font-semibold">No common Tier 3 suppliers found</p>
          <p className="text-yellow-700 text-sm mt-1">
            {companyA} and {companyB} have completely separate Tier 3 networks.
          </p>
        </div>
      )}

      {/* Tier 3 Unique to Company A Table */}
      {hasTier3UniqueA && (
        <div className="bg-white border border-gray-200 overflow-hidden">
          <div className="bg-blue-600 px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-white">
              Tier 3 Unique to {companyA} ({data.tier3_unique_to_a.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Country
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tier Level
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.tier3_unique_to_a.map((supplier, index) => (
                  <tr key={index} className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {supplier.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                        {supplier.country}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Tier {supplier.tier_level}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tier 3 Unique to Company B Table */}
      {hasTier3UniqueB && (
        <div className="bg-white border border-gray-200 overflow-hidden">
          <div className="bg-orange-600 px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-white">
              Tier 3 Unique to {companyB} ({data.tier3_unique_to_b.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Country
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tier Level
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.tier3_unique_to_b.map((supplier, index) => (
                  <tr key={index} className="hover:bg-orange-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {supplier.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                        {supplier.country}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        Tier {supplier.tier_level}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

          {/* Key Insights */}
          {data.insights && data.insights.length > 0 && (
            <div className="bg-white border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Key Insights</h2>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  {data.insights.map((insight, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-[#4BA82E] font-bold text-lg mt-0.5">•</span>
                      <span className="text-gray-700 text-base">{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
