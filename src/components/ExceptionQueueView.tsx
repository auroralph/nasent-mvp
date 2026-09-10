import React from 'react';
import {
  Flame,
  AlertTriangle,
  ArrowRight,
  Clock,
  Warehouse,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Info
} from 'lucide-react';
import { SupplyChainException } from '../types';

interface ExceptionQueueViewProps {
  exceptions: SupplyChainException[];
  onAnalyzeException: (exceptionId: string) => void;
}

export const ExceptionQueueView: React.FC<ExceptionQueueViewProps> = ({
  exceptions,
  onAnalyzeException
}) => {
  return (
    <div className="space-y-6">
      {/* Header & Overview */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Perishable Goods Exception Queue</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
              {exceptions.filter((e) => e.severity === 'HIGH').length} Critical
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time feed of multi-echelon inventory mismatches requiring automated agentic FEFO evaluation
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
          <Info className="w-4 h-4 text-slate-400 shrink-0" />
          <span>Primary target: Expiry Risk (WH-A) vs. Projected Stockout (WH-B)</span>
        </div>
      </div>

      {/* Exceptions Table / Cards */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Exception ID</th>
                <th className="py-3.5 px-4">Product & SKU</th>
                <th className="py-3.5 px-4">Origin / Dest</th>
                <th className="py-3.5 px-4">Exception Type</th>
                <th className="py-3.5 px-4">Severity</th>
                <th className="py-3.5 px-4">Expiry Horizon</th>
                <th className="py-3.5 px-4">Stockout Horizon</th>
                <th className="py-3.5 px-4">Workflow Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150">
              {exceptions.map((exc) => (
                <tr key={exc.exception_id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                    {exc.exception_id}
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-semibold text-slate-900">{exc.product_name}</div>
                    <div className="font-mono text-[11px] text-slate-500">{exc.sku_id}</div>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 font-medium text-slate-800">
                      <span>{exc.source_warehouse}</span>
                      <span className="text-slate-400">➔</span>
                      <span>{exc.destination_warehouse}</span>
                    </div>
                    <div className="text-[10px] text-slate-500">Cikarang DC ➔ Bandung DC</div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-mono text-[11px] bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200">
                      {exc.exception_type}
                    </span>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
                      <Flame className="w-3 h-3 text-red-600" />
                      {exc.severity}
                    </span>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="font-bold text-amber-700">{exc.days_to_expiry} Days</div>
                    <div className="text-[10px] text-slate-500">Batch BATCH-042</div>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="font-bold text-red-700">{exc.projected_stockout_days} Days</div>
                    <div className="text-[10px] text-slate-500">Deficit: 550 units</div>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                      exc.status === 'APPROVED'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : exc.status === 'ACTION_PROPOSED'
                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}>
                      {exc.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right whitespace-nowrap">
                    <button
                      id={`analyze-btn-${exc.exception_id}`}
                      onClick={() => onAnalyzeException(exc.exception_id)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-xs transition-colors cursor-pointer"
                    >
                      <Cpu className="w-3.5 h-3.5" />
                      <span>Analyze with Nasent</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Operational Problem Explainer Box */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-xs text-slate-700 space-y-2">
        <h3 className="font-bold text-slate-900 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          Primary Operational Problem Context
        </h3>
        <p className="leading-relaxed">
          Warehouse A (Cikarang Central DC) holds 1,000 units of Fresh Milk with 4 days until shelf-life expiry, but local consumer demand over the next 5 days is only 100 units (900 units surplus at imminent risk of total spoilage). Simultaneously, Warehouse B (Bandung Regional DC) has only 150 units in stock with projected demand of 700 units, guaranteeing a complete stockout in 5 days. Nasent tests whether FEFO inter-warehouse redistribution (2 days transit, IDR 350,000 cost) is safer and more economical than waiting for a new purchase order (8 days lead time, IDR 4,000,000).
        </p>
      </div>
    </div>
  );
};
