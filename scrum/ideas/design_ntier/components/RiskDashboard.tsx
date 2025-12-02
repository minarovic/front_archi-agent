import React from 'react';
import { RiskData, RISK_COLORS, RISK_ICONS } from '@/src/types/risk';
import { NarrativeCard } from './NarrativeCard';

interface RiskDashboardProps {
  data: RiskData;
}

export default function RiskDashboard({ data }: RiskDashboardProps) {
  // Generate warnings from compliance data
  const warnings: string[] = [];
  if (data.compliance_status.sanctioned) {
    warnings.push('⚠️ Entity is sanctioned');
  }
  if (data.compliance_status.high_risk_jurisdiction) {
    warnings.push('⚠️ Operating in high-risk jurisdiction');
  }

  return (
    <div className="space-y-6">
      {/* MCOP-031: LLM Recommendations Card */}
      {data.recommendations && (
        <NarrativeCard
          title="Risk Assessment"
          content={data.recommendations}
          icon="🛡️"
        />
      )}

      {/* Unified Header with Gradient */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden border-t-4 border-[#4BA82E]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0E3A2F] to-[#1a5a42] px-8 py-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-white mb-2">
                {data.entity_name}
              </h2>
              <p className="text-[#78FAAE] text-base font-medium">
                Entity ID: {data.entity_id} • Risk Assessment
              </p>
            </div>
            {/* Risk Level Badge */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3 border border-white/20">
              <p className="text-[#78FAAE] text-xs uppercase tracking-wide mb-1">Risk Level</p>
              <p className="text-white text-2xl font-bold uppercase">{data.risk_level}</p>
            </div>
          </div>
        </div>

        {/* Main Metrics Grid */}
        <div className="grid grid-cols-3 divide-x divide-gray-200">
          <div className="p-6 text-center">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Composite Score</p>
            <p className="text-4xl font-bold text-[#4BA82E] mb-1">{data.composite_score.toFixed(1)}</p>
            <p className="text-xs text-gray-400">out of 100</p>
          </div>
          <div className="p-6 text-center">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Financial Stability</p>
            <p className="text-4xl font-bold text-[#4BA82E]">{data.financial_stability_score.toFixed(1)}</p>
            <p className="text-xs text-gray-400">Stability Index</p>
          </div>
          <div className="p-6 text-center">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Credit Rating</p>
            <p className="text-4xl font-bold text-gray-900">{data.credit_rating}</p>
            <p className="text-xs text-gray-400">Current Grade</p>
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-[#4BA82E]">
          <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">Payment Delays</p>
          <p className="text-3xl font-bold text-gray-900">{data.payment_delays_avg_days}</p>
          <p className="text-sm text-gray-600 mt-1">Average Days</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-[#4BA82E]">
          <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">Debt/Equity Ratio</p>
          <p className="text-3xl font-bold text-gray-900">{data.debt_to_equity_ratio.toFixed(2)}</p>
          <p className="text-sm text-gray-600 mt-1">Financial Leverage</p>
        </div>
      </div>

      {/* Risk Factors */}
      <div className="bg-white p-6 rounded-lg shadow border-l-4 border-orange-500">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Risk Factors</h3>
        <ul className="space-y-3">
          {data.risk_factors.map((factor: string, idx: number) => (
            <li key={idx} className="flex items-start gap-3">
              <span className="text-orange-500 font-bold text-lg mt-0.5">•</span>
              <span className="text-gray-700 text-base">{factor}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Warnings (if any) */}
      {warnings.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-red-800 mb-4">Critical Warnings</h3>
          <ul className="space-y-3">
            {warnings.map((warning: string, idx: number) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="text-red-500 font-bold text-lg mt-0.5">•</span>
                <span className="text-red-700 text-base">{warning.replace(/⚠️\s?/g, '')}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Compliance Status */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Compliance Status</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ComplianceBadge
              label="Sanctioned"
              value={data.compliance_status.sanctioned}
            />
            <ComplianceBadge
              label="High Risk Jurisdiction"
              value={data.compliance_status.high_risk_jurisdiction}
            />
          </div>
          {data.compliance_status.compliance_flags.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Compliance Flags</p>
              <div className="flex flex-wrap gap-2">
                {data.compliance_status.compliance_flags.map((flag: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-md text-sm font-medium shadow-sm"
                  >
                    {flag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper component: Compliance Badge
interface ComplianceBadgeProps {
  label: string;
  value: boolean;
}

function ComplianceBadge({ label, value }: ComplianceBadgeProps) {
  return (
    <div
      className={`p-4 rounded-lg border-2 ${
        value
          ? 'bg-red-50 border-red-300'
          : 'bg-green-50 border-green-300'
      }`}
    >
      <p className="text-sm font-medium text-gray-700">{label}</p>
      <p
        className={`text-lg font-bold mt-1 ${
          value ? 'text-red-800' : 'text-green-800'
        }`}
      >
        {value ? 'YES' : 'NO'}
      </p>
    </div>
  );
}
