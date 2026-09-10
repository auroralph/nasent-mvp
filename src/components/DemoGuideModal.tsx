import React from 'react';
import { X, Play, CheckCircle, ArrowRight, ShieldCheck, Database, FileText } from 'lucide-react';

interface DemoGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJumpToStep: (stepNumber: number) => void;
}

export const DemoGuideModal: React.FC<DemoGuideModalProps> = ({
  isOpen,
  onClose,
  onJumpToStep
}) => {
  if (!isOpen) return null;

  const steps = [
    {
      step: 1,
      title: 'Control Tower & Exception Detection',
      desc: 'Inspect high-priority mismatch: WH-A has 1,000 units expiring in 4 days with low local demand, while WH-B faces a stockout in 5 days.',
      actionLabel: 'Go to Exception Queue',
      tab: 'exceptions'
    },
    {
      step: 2,
      title: 'Launch Agentic Analysis',
      desc: 'Trigger "Analyze with Nasent". Watch the 8-stage cold-chain workflow (Observe → Detect → Investigate → Plan → Evaluate → Act → Verify → Escalate/Close).',
      actionLabel: 'Open Analysis',
      tab: 'analysis'
    },
    {
      step: 3,
      title: 'FEFO Deterministic Verification',
      desc: 'Confirm that deterministic rules exclude blocked batches (BATCH-BLK-09) and prioritize BATCH-042, checking transit lead time vs expiry.',
      actionLabel: 'View Inventory & Batches',
      tab: 'inventory'
    },
    {
      step: 4,
      title: 'Alternative Trade-off Matrix',
      desc: 'Compare FEFO Transfer (IDR 350,000, 2-day lead time) against PO-GREENFIELD-901 (IDR 4,000,000, 8 days lead time, arriving after stockout).',
      actionLabel: 'Review Alternatives',
      tab: 'analysis'
    },
    {
      step: 5,
      title: 'Human-in-the-Loop Approval',
      desc: 'Enforce human approval before dispatching critical transactions to simulated ERP. Click "Approve FEFO Transfer".',
      actionLabel: 'Go to Approval Panel',
      tab: 'analysis'
    },
    {
      step: 6,
      title: 'SAP-Compatible Transfer Proposal',
      desc: 'Inspect the generated STP-NASENT-0001 proposal simulating SAP BTP / S/4HANA OData boundary.',
      actionLabel: 'View Proposal Result',
      tab: 'analysis'
    },
    {
      step: 7,
      title: 'Immutable Audit Trail',
      desc: 'Review recorded telemetry, calculation runs, planner approval timestamp, and verification logs.',
      actionLabel: 'Examine Audit Trail',
      tab: 'audit'
    },
    {
      step: 8,
      title: 'Before & After Impact Metrics',
      desc: 'Review simulated pilot outcome: 78% reduction in at-risk inventory, eliminated stockout, IDR 4.2M preserved value, < 5 min resolution.',
      actionLabel: 'View Control Tower Metrics',
      tab: 'dashboard'
    }
  ];

  return (
    <div
      id="demo-guide-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div
        id="demo-guide-modal"
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col border border-slate-200 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Play className="w-4 h-4 fill-emerald-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Judge & Evaluator Demo Script</h3>
              <p className="text-xs text-slate-400">Step-by-step walkthrough of the Nasent FEFO Redistribution MVP</p>
            </div>
          </div>
          <button
            id="close-demo-guide-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-3 divide-y divide-slate-100">
          {steps.map((s) => (
            <div key={s.step} className="pt-3 first:pt-0 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {s.step}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">{s.title}</h4>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{s.desc}</p>
                </div>
              </div>
              <button
                id={`demo-step-${s.step}-btn`}
                onClick={() => {
                  onJumpToStep(s.step);
                  onClose();
                }}
                className="shrink-0 text-xs font-medium text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200/60 transition-colors flex items-center gap-1"
              >
                <span>{s.actionLabel}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>All values and metrics represent simulated pilot test scenarios.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            Got it, Let's Begin
          </button>
        </div>
      </div>
    </div>
  );
};
