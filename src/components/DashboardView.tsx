import React from 'react';
import {
  AlertTriangle,
  TrendingDown,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Flame,
  Boxes,
  Zap,
  DollarSign,
  Cpu,
  Truck,
  FileCheck
} from 'lucide-react';
import { SupplyChainException, TransferProposal, AuditLog } from '../types';

interface DashboardViewProps {
  exceptions: SupplyChainException[];
  recentProposals: TransferProposal[];
  recentAuditLogs: AuditLog[];
  onNavigateToExceptions: () => void;
  onNavigateToAnalysis: () => void;
  onNavigateToAudit: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  exceptions,
  recentProposals,
  recentAuditLogs,
  onNavigateToExceptions,
  onNavigateToAnalysis,
  onNavigateToAudit
}) => {
  const highPriorityCount = exceptions.filter((e) => e.severity === 'HIGH').length;
  const isResolved = exceptions.some((e) => e.status === 'APPROVED');

  return (
    <div className="space-y-6">
      {/* Product Hero Banner / Core Value Statement */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 text-white shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-emerald-950/20 to-transparent pointer-events-none"></div>

        <div className="max-w-3xl relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            Active FEFO Cold-Chain Sentry
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
            Prevent Expiry. Protect Availability.
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            “Nasent prevents perishable products from being wasted in one warehouse while another warehouse runs out of stock. It detects the problem, compares possible actions, and recommends moving the right batch to the right warehouse before expiry or stockout occurs.”
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              id="dashboard-launch-analysis-btn"
              onClick={onNavigateToAnalysis}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-emerald-700/20 transition-all cursor-pointer"
            >
              <Cpu className="w-4 h-4 text-emerald-100" />
              <span>Analyze Active Exception with Nasent</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="dashboard-view-exceptions-btn"
              onClick={onNavigateToExceptions}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-medium text-xs sm:text-sm transition-all"
            >
              <Flame className="w-4 h-4 text-red-400" />
              <span>Inspect Exception Queue ({exceptions.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Control Tower KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* High-Priority Exceptions */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">
              High-Priority Exceptions
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-slate-900">
                {isResolved ? 0 : highPriorityCount}
              </span>
              <span className={`text-xs font-semibold ${isResolved ? 'text-emerald-600' : 'text-red-600'}`}>
                {isResolved ? 'Resolved' : 'Immediate Action Required'}
              </span>
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              SKU-MILK-001 (WH-A ↔ WH-B)
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 border border-red-100 flex items-center justify-center shrink-0">
            <Flame className="w-5 h-5" />
          </div>
        </div>

        {/* At-Risk Perishable Inventory */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">
              At-Risk Inventory Value
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-slate-900">
                {isResolved ? 'IDR 4.8M' : 'IDR 24.0M'}
              </span>
              <span className="text-xs font-semibold text-amber-600">
                {isResolved ? 'Buffer Only' : '1,000 Units Near Expiry'}
              </span>
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Batch BATCH-042 (4 days shelf life)
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center shrink-0">
            <Boxes className="w-5 h-5" />
          </div>
        </div>

        {/* Projected Stockout Incidents */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">
              Projected Stockout Count
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-slate-900">
                {isResolved ? '0' : '1'}
              </span>
              <span className={`text-xs font-semibold ${isResolved ? 'text-emerald-600' : 'text-red-600'}`}>
                {isResolved ? 'Fully Covered' : 'Critical (5-Day Horizon)'}
              </span>
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              WH-B (Demand: 700 / Stock: 150)
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>

        {/* Estimated Avoided Loss */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">
              Estimated Avoided Loss
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-emerald-700">
                IDR 4,200,000
              </span>
              <span className="text-xs font-semibold text-emerald-700">
                Net Saved
              </span>
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              700 Units Redistributed vs Spoiled
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Before-and-After Comparison Panel (Mandated Requirement) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Simulated Demonstration Scenario: Before vs. After Transfer
            </h2>
            <p className="text-xs text-slate-500">
              Direct impact comparison of manual resolution vs. Nasent agentic FEFO recommendation
            </p>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200 self-start sm:self-auto">
            Simulated demonstration scenario
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Before State */}
          <div className="p-4 rounded-xl bg-red-50/70 border border-red-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-red-900 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                Before: Manual Unsynchronized Operations
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-red-200/70 text-red-900">
                Status Quo
              </span>
            </div>

            <div className="space-y-2 text-xs text-slate-700">
              <div className="flex justify-between py-1 border-b border-red-100">
                <span className="text-slate-600 font-medium">Expiry-Risk Quantity at WH-A:</span>
                <span className="font-bold text-red-700">900 units (Surplus)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-red-100">
                <span className="text-slate-600 font-medium">Destination (WH-B) Stockout Risk:</span>
                <span className="font-bold text-red-700">HIGH (Runs out in 1 day)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-red-100">
                <span className="text-slate-600 font-medium">Decision Process:</span>
                <span className="font-medium text-slate-800">Manual siloed spreadsheets</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-600 font-medium">Planner Investigation Time:</span>
                <span className="font-bold text-slate-800">~2 hours across multiple ERP screens</span>
              </div>
            </div>
          </div>

          {/* After State */}
          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                After: Recommended FEFO Transfer
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-200/70 text-emerald-900">
                Nasent Optimized
              </span>
            </div>

            <div className="space-y-2 text-xs text-slate-700">
              <div className="flex justify-between py-1 border-b border-emerald-100">
                <span className="text-slate-600 font-medium">Expiry-Risk Quantity at WH-A:</span>
                <span className="font-bold text-emerald-700">200 units buffer (78% reduction)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-emerald-100">
                <span className="text-slate-600 font-medium">Destination (WH-B) Stockout Risk:</span>
                <span className="font-bold text-emerald-700">LOW (Covered for 6 days)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-emerald-100">
                <span className="text-slate-600 font-medium">Decision Process:</span>
                <span className="font-medium text-emerald-800">Agent-assisted with human approval</span>
              </div>
              <div className="flex justify-between py-1 border-b border-emerald-100">
                <span className="text-slate-600 font-medium">Decision Resolution Time:</span>
                <span className="font-bold text-emerald-800">&lt; 5 minutes</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-600 font-medium">Transfer Cost vs Net Avoided Loss:</span>
                <span className="font-bold text-emerald-800">Cost: IDR 350k / Net Saved: IDR 4.2M</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Simulated Pilot Targets Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Simulated Pilot KPI Performance Targets
            </h2>
            <p className="text-xs text-slate-500">
              Quantified benchmark goals established for the Indonesian perishable distribution pilot
            </p>
          </div>
          <span className="text-xs text-slate-400">Target metrics (simulated)</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-150">
            <span className="text-slate-500 block mb-1">Avoidable Expired Inventory</span>
            <span className="text-base font-bold text-slate-900">10–20%</span>
            <span className="text-[11px] text-emerald-600 font-medium block mt-0.5">reduction target</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-150">
            <span className="text-slate-500 block mb-1">Stockout Incidents</span>
            <span className="text-base font-bold text-slate-900">15–25%</span>
            <span className="text-[11px] text-emerald-600 font-medium block mt-0.5">reduction target</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-150">
            <span className="text-slate-500 block mb-1">Order-Fill Service Level</span>
            <span className="text-base font-bold text-slate-900">+5–10%</span>
            <span className="text-[11px] text-emerald-600 font-medium block mt-0.5">percentage-point gain</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-150">
            <span className="text-slate-500 block mb-1">Manual Investigation Time</span>
            <span className="text-base font-bold text-slate-900">50–70%</span>
            <span className="text-[11px] text-emerald-600 font-medium block mt-0.5">reduction target</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-150">
            <span className="text-slate-500 block mb-1">Exception Resolution Time</span>
            <span className="text-base font-bold text-slate-900">&lt; 5 min</span>
            <span className="text-[11px] text-emerald-600 font-medium block mt-0.5">per exception target</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-150">
            <span className="text-slate-500 block mb-1">Recommendation Precision</span>
            <span className="text-base font-bold text-slate-900">≥ 85%</span>
            <span className="text-[11px] text-emerald-600 font-medium block mt-0.5">in controlled tests</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-150 col-span-2 sm:col-span-1 lg:col-span-2">
            <span className="text-slate-500 block mb-1">Unauthorized Critical Transactions</span>
            <span className="text-base font-bold text-emerald-700">0 (Zero)</span>
            <span className="text-[11px] text-slate-500 block mt-0.5">Strict human approval required</span>
          </div>
        </div>
      </div>

      {/* Two Column: Active Exceptions & Recent Agent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Exceptions Preview */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-red-500" />
              <h3 className="text-sm font-bold text-slate-900">Active Supply Chain Exceptions</h3>
            </div>
            <button
              onClick={onNavigateToExceptions}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {exceptions.map((exc) => (
              <div
                key={exc.exception_id}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-900">{exc.exception_id}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800 border border-red-200">
                    {exc.severity} SEVERITY
                  </span>
                </div>

                <div className="text-xs text-slate-700 font-medium">
                  {exc.product_name} ({exc.sku_id})
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-1 border-t border-slate-200">
                  <div>
                    <span className="text-slate-400 block">Route Mismatch:</span>
                    <span className="font-semibold text-slate-800">{exc.source_warehouse} ➔ {exc.destination_warehouse}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Critical Timeline:</span>
                    <span className="font-semibold text-amber-700">Expiry: {exc.days_to_expiry}d | Stockout: {exc.projected_stockout_days}d</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={onNavigateToAnalysis}
                    className="text-xs font-semibold px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1 transition-colors"
                  >
                    <span>Analyze with Nasent</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Audit / Decision Trace Preview */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" />
              <h3 className="text-sm font-bold text-slate-900">Recent Immutable Audit Events</h3>
            </div>
            <button
              onClick={onNavigateToAudit}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>Full Audit Trail</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {recentAuditLogs.slice(0, 4).map((log) => (
              <div
                key={log.event_id}
                className="p-2.5 rounded-lg border border-slate-150 bg-slate-50 text-xs space-y-1"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-mono">
                    {log.stage}
                  </span>
                  <span className="text-slate-400 font-mono">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-slate-700 text-[11px] leading-relaxed line-clamp-2">
                  {log.summary}
                </p>
                <div className="text-[10px] text-slate-400 font-medium">
                  Actor: <span className="text-slate-600">{log.actor}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
