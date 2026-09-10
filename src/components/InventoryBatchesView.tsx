import React, { useState } from 'react';
import {
  Boxes,
  CheckCircle2,
  AlertCircle,
  Ban,
  Clock,
  Filter,
  ShieldCheck,
  TrendingDown,
  Warehouse as WarehouseIcon,
  Info
} from 'lucide-react';
import { InventoryBatch } from '../types';

interface InventoryBatchesViewProps {
  batches: InventoryBatch[];
  onTriggerAnalysis: () => void;
}

export const InventoryBatchesView: React.FC<InventoryBatchesViewProps> = ({
  batches,
  onTriggerAnalysis
}) => {
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  const filteredBatches = batches.filter((b) => {
    if (selectedWarehouse !== 'ALL' && b.warehouse_id !== selectedWarehouse) return false;
    if (selectedStatus !== 'ALL' && b.status !== selectedStatus) return false;
    return true;
  });

  const getStatusBadge = (status: InventoryBatch['status']) => {
    switch (status) {
      case 'AVAILABLE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            AVAILABLE
          </span>
        );
      case 'BLOCKED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <AlertCircle className="w-3 h-3 text-amber-600" />
            BLOCKED
          </span>
        );
      case 'QUARANTINED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-100 text-orange-800 border border-orange-200">
            <AlertCircle className="w-3 h-3 text-orange-600" />
            QUARANTINED
          </span>
        );
      case 'EXPIRED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-800 border border-red-200">
            <Ban className="w-3 h-3 text-red-600" />
            EXPIRED
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Perishable Inventory & Batch Determination</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              FEFO Priority Engine
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time multi-echelon stock levels, shelf-life countdowns, and cold-chain compliance status
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
            <WarehouseIcon className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedWarehouse}
              onChange={(e) => setSelectedWarehouse(e.target.value)}
              className="bg-transparent border-none text-slate-700 font-medium focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">All Warehouses</option>
              <option value="WH-A">WH-A (Cikarang Central DC)</option>
              <option value="WH-B">WH-B (Bandung Regional DC)</option>
              <option value="WH-C">WH-C (Surabaya East DC)</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-transparent border-none text-slate-700 font-medium focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="AVAILABLE">AVAILABLE Only</option>
              <option value="BLOCKED">BLOCKED</option>
              <option value="QUARANTINED">QUARANTINED</option>
              <option value="EXPIRED">EXPIRED</option>
            </select>
          </div>
        </div>
      </div>

      {/* FEFO Deterministic Guardrails Notice */}
      <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-900 flex items-start gap-3">
        <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold block">Deterministic FEFO Rule Enforcement</span>
          <p className="text-emerald-800 leading-relaxed">
            Only inventory with status <span className="font-semibold underline">AVAILABLE</span> is eligible for redistribution. Non-available stock (such as Quality Hold BATCH-BLK-09 or temperature excursion BATCH-QUAR-03) is strictly excluded by deterministic code before any AI evaluation. Batches are sorted strictly by earliest expiry date.
          </p>
        </div>
      </div>

      {/* Batches Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Batch ID</th>
                <th className="py-3.5 px-4">Product / SKU</th>
                <th className="py-3.5 px-4">Warehouse</th>
                <th className="py-3.5 px-4">Quantity</th>
                <th className="py-3.5 px-4">Expiry Date</th>
                <th className="py-3.5 px-4">Days Remaining</th>
                <th className="py-3.5 px-4">Inventory Status</th>
                <th className="py-3.5 px-4">FEFO Rank</th>
                <th className="py-3.5 px-4">Local Demand</th>
                <th className="py-3.5 px-4">Position Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150">
              {filteredBatches.map((batch) => {
                const daysRemaining = batch.days_to_expiry ?? 0;
                const isUrgent = daysRemaining <= 4 && daysRemaining > 0;
                const isWhA = batch.warehouse_id === 'WH-A';
                const isWhB = batch.warehouse_id === 'WH-B';
                const localDemand = isWhA ? 100 : isWhB ? 700 : 250;
                const netBalance = batch.quantity - localDemand;

                return (
                  <tr
                    key={batch.batch_id}
                    className={`transition-colors ${
                      batch.batch_id === 'BATCH-042'
                        ? 'bg-amber-50/40 hover:bg-amber-50/60'
                        : 'hover:bg-slate-50/70'
                    }`}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      <div className="flex items-center gap-1.5">
                        <span>{batch.batch_id}</span>
                        {batch.batch_id === 'BATCH-042' && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-200 text-amber-900 text-[10px] font-bold">
                            TARGET
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">Fresh Milk 1L</div>
                      <div className="font-mono text-[11px] text-slate-500">{batch.sku_id}</div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-semibold text-slate-800">{batch.warehouse_id}</span>
                      <span className="text-slate-400 block text-[10px]">
                        {batch.warehouse_id === 'WH-A'
                          ? 'Cikarang DC'
                          : batch.warehouse_id === 'WH-B'
                          ? 'Bandung DC'
                          : 'Surabaya DC'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-bold text-slate-900">{batch.quantity.toLocaleString()}</span> units
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-700 whitespace-nowrap">
                      {batch.expiry_date}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Clock className={`w-3.5 h-3.5 ${isUrgent ? 'text-red-500 animate-pulse' : 'text-slate-400'}`} />
                        <span
                          className={`font-bold ${
                            daysRemaining < 0
                              ? 'text-red-600'
                              : isUrgent
                              ? 'text-amber-700'
                              : 'text-emerald-700'
                          }`}
                        >
                          {daysRemaining < 0 ? 'EXPIRED' : `${daysRemaining} days`}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getStatusBadge(batch.status)}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {batch.status === 'AVAILABLE' && batch.fefo_rank ? (
                        <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          #{batch.fefo_rank} (Dispatch Priority)
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Excluded</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-semibold text-slate-800">{localDemand}</span> units / 5d
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {netBalance > 0 ? (
                        <span className="font-bold text-emerald-700">+{netBalance} Surplus</span>
                      ) : (
                        <span className="font-bold text-red-700">{netBalance} Shortage</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
