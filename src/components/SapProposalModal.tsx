import React from 'react';
import { X, CheckCircle2, Server, ShieldCheck, ArrowRight, ExternalLink, Copy, Check } from 'lucide-react';
import { TransferProposal } from '../types';

interface SapProposalModalProps {
  proposal: TransferProposal | null;
  isOpen: boolean;
  onClose: () => void;
  onViewAuditTrail: () => void;
}

export const SapProposalModal: React.FC<SapProposalModalProps> = ({
  proposal,
  isOpen,
  onClose,
  onViewAuditTrail
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !proposal) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(proposal.proposal_id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      id="sap-proposal-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div
        id="sap-proposal-modal"
        className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-emerald-900 text-white p-5 flex items-center justify-between border-b border-emerald-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">SAP-Compatible Transfer Proposal</h3>
              <p className="text-xs text-emerald-200">Dispatched to SAP S/4HANA & EWM Integration Boundary</p>
            </div>
          </div>
          <button
            id="close-sap-proposal-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          {/* Required Notice Disclaimer */}
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed flex items-start gap-2.5">
            <Server className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block mb-0.5">Integration Boundary Simulation</span>
              SAP-compatible transfer proposal created. This prototype simulates the integration boundary. A production version would connect the action to SAP BTP and SAP S/4HANA/EWM services.
            </div>
          </div>

          {/* Proposal Details Table */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-2.5 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <span className="text-slate-500 font-medium">Proposal ID</span>
              <div className="flex items-center gap-1.5 font-mono font-bold text-slate-900">
                <span>{proposal.proposal_id}</span>
                <button
                  onClick={handleCopy}
                  className="p-1 hover:bg-slate-200 rounded text-slate-500 transition-colors"
                  title="Copy ID"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Transaction Status</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                {proposal.status}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Material / SKU</span>
              <span className="font-semibold text-slate-900">{proposal.sku_id} (Fresh Milk 1L)</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Batch Number</span>
              <span className="font-mono font-semibold text-slate-900">{proposal.batch_id}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Source Warehouse</span>
              <span className="font-semibold text-slate-900">{proposal.source_warehouse} (Cikarang Central DC)</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Destination Warehouse</span>
              <span className="font-semibold text-slate-900">{proposal.destination_warehouse} (Bandung Regional DC)</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Transfer Quantity</span>
              <span className="font-bold text-emerald-700 text-sm">{proposal.quantity.toLocaleString()} Units</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Estimated Logistics Cost</span>
              <span className="font-semibold text-slate-900">IDR {proposal.estimated_cost.toLocaleString()}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Dispatch Reason</span>
              <span className="text-slate-800 text-right max-w-xs truncate">{proposal.reason}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Approved Timestamp</span>
              <span className="text-slate-700">{proposal.approved_at ? new Date(proposal.approved_at).toLocaleString() : new Date().toLocaleString()}</span>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-slate-200">
              <span className="text-slate-500 font-medium">Integration Interface</span>
              <span className="font-mono text-[11px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                SAP OData StockTransferProposal API (Mock)
              </span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="bg-slate-100 p-4 border-t border-slate-200 flex items-center justify-between">
          <button
            id="modal-view-audit-trail-btn"
            onClick={() => {
              onViewAuditTrail();
              onClose();
            }}
            className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1.5"
          >
            <span>View in Audit Trail</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            id="modal-close-done-btn"
            onClick={onClose}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-medium transition-colors shadow-sm"
          >
            Close & Return to Analysis
          </button>
        </div>
      </div>
    </div>
  );
};
