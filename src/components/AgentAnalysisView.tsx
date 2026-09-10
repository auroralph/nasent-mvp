import React, { useState } from 'react';
import {
  Cpu,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  DollarSign,
  Clock,
  ShieldAlert,
  ShieldCheck,
  Truck,
  Sparkles,
  Info,
  Server,
  FileCheck,
  XCircle,
  AlertCircle,
  HelpCircle,
  Play
} from 'lucide-react';
import { AgentAnalysisResponse, TransferProposal, WorkflowStage } from '../types';

interface AgentAnalysisViewProps {
  analysis: AgentAnalysisResponse | null;
  loading: boolean;
  onRunAnalysis: () => void;
  onApproveProposal: () => Promise<void>;
  onRejectProposal: () => Promise<void>;
  onEscalateProposal: () => Promise<void>;
  activeProposal: TransferProposal | null;
  isDemoMode: boolean;
}

const STAGES: { id: WorkflowStage; label: string; desc: string }[] = [
  { id: 'OBSERVE', label: '1. OBSERVE', desc: 'Read inventory, batch expiry, demand, and route telemetry' },
  { id: 'DETECT', label: '2. DETECT', desc: 'Identify expiry surplus at WH-A & stockout vulnerability at WH-B' },
  { id: 'INVESTIGATE', label: '3. INVESTIGATE', desc: 'Calculate usable surplus (900u) & deficit (550u) with route transit' },
  { id: 'PLAN', label: '4. PLAN', desc: 'Formulate alternatives: Status Quo, FEFO Transfer, PO, Disposal' },
  { id: 'EVALUATE', label: '5. EVALUATE', desc: 'Evaluate trade-off matrix: Cost, lead time, risk & shelf-life' },
  { id: 'ACT', label: '6. ACT', desc: 'Create transfer proposal in PENDING_APPROVAL state' },
  { id: 'VERIFY', label: '7. VERIFY', desc: 'Simulate post-transfer state: stockout eliminated, loss avoided' },
  { id: 'ESCALATE_OR_CLOSE', label: '8. ESCALATE / CLOSE', desc: 'Require human planner approval before mock SAP dispatch' }
];

export const AgentAnalysisView: React.FC<AgentAnalysisViewProps> = ({
  analysis,
  loading,
  onRunAnalysis,
  onApproveProposal,
  onRejectProposal,
  onEscalateProposal,
  activeProposal,
  isDemoMode
}) => {
  const [activeStageIndex, setActiveStageIndex] = useState<number>(7); // Completed all 8 stages by default when loaded
  const [isApproving, setIsApproving] = useState(false);
  const [approvalMessage, setApprovalMessage] = useState<string | null>(null);

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      await onApproveProposal();
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    setIsApproving(true);
    try {
      await onRejectProposal();
      setApprovalMessage('Proposal REJECTED by human supervisor. Logged in audit trail.');
    } finally {
      setIsApproving(false);
    }
  };

  const handleEscalate = async () => {
    setIsApproving(true);
    try {
      await onEscalateProposal();
      setApprovalMessage('Exception ESCALATED to Central Logistics Director. Logged in audit trail.');
    } finally {
      setIsApproving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Analysis Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">Nasent Agentic Reasoning & FEFO Engine</h1>
            {analysis?.isDemoMode ? (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                Demo Mode: deterministic fallback response
              </span>
            ) : (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                Gemini 3.8-Flash Reasoning
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Autonomous multi-echelon investigation with deterministic FEFO bounds and mandatory human approval
          </p>
        </div>

        <button
          id="reanalyze-btn"
          onClick={onRunAnalysis}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Running 8-Stage Workflow...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5" />
              <span>Re-Run Agent Analysis</span>
            </>
          )}
        </button>
      </div>

      {/* 8-Stage Agentic Workflow Tracker */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Agentic Cold-Chain Workflow Pipeline (8 Deterministic Stages)
            </h2>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded border border-emerald-800">
            Pipeline Status: Complete (Human In The Loop)
          </span>
        </div>

        {/* Stages Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {STAGES.map((stg, idx) => {
            const isDone = true;
            return (
              <div
                key={stg.id}
                onClick={() => setActiveStageIndex(idx)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  activeStageIndex === idx
                    ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-xs'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span>{stg.label}</span>
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                </div>
                <div className="text-[10px] text-slate-400 line-clamp-2 mt-1 leading-tight">
                  {stg.desc}
                </div>
              </div>
            );
          })}
        </div>

        {/* Active Stage Highlight Detail */}
        <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs flex items-start gap-2.5">
          <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-semibold text-emerald-300">
              Stage Detail: {STAGES[activeStageIndex].label}
            </span>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              {analysis?.decisionTrace[activeStageIndex]?.summary || STAGES[activeStageIndex].desc}
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3">
          <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-800">Agent Ingesting Telemetry & Computing FEFO Equations...</p>
          <p className="text-xs text-slate-500">Checking inventory batches, shelf-life horizons, and route capacities</p>
        </div>
      ) : analysis ? (
        <div className="space-y-6">
          {/* Exception Summary & Deterministic Tools Executed */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Exception Summary Card */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-red-500" />
                  Operational Problem Synthesis
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
                  {analysis.riskLevel} RISK LEVEL
                </span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200 font-medium">
                {analysis.exceptionSummary}
              </p>

              {/* Observed Facts */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Observed Telemetry Facts (Ground Truth)
                </span>
                <ul className="space-y-1 text-xs text-slate-600">
                  {analysis.observedFacts.map((fact, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Deterministic Tool Activity Timeline */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Server className="w-4 h-4 text-blue-500" />
                  Deterministic Tools
                </span>
                <span className="text-[10px] font-mono text-slate-400">All Passed</span>
              </div>

              <div className="space-y-2">
                {analysis.toolActivity?.map((tool, i) => (
                  <div key={i} className="p-2 rounded-lg bg-slate-50 border border-slate-150 text-[11px] space-y-0.5">
                    <div className="flex items-center justify-between font-mono font-semibold text-slate-800">
                      <span className="truncate max-w-[170px]">{tool.name}</span>
                      <span className="text-emerald-600 text-[10px] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        {tool.status}
                      </span>
                    </div>
                    <div className="text-slate-500 text-[10px] leading-tight">{tool.detail}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Key Deterministic Calculations Table */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingDown className="w-4 h-4 text-emerald-600" />
              Verified Deterministic Calculations
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {analysis.calculations.map((calc, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[11px] font-medium text-slate-500 block">{calc.metric}</span>
                  <div className="text-sm font-bold text-slate-900">{calc.value}</div>
                  <p className="text-[11px] text-slate-600 leading-tight pt-1 border-t border-slate-200">
                    {calc.meaning}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Alternatives Comparison Matrix (Crucial Step) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-blue-600" />
                Comparison of Feasible Supply-Chain Alternatives
              </h3>
              <span className="text-xs text-slate-500">Evaluated against cost, risk & availability</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {analysis.alternatives.map((alt, i) => {
                const isSelected = alt.action.includes('FEFO Inter-Warehouse Transfer');
                return (
                  <div
                    key={i}
                    className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 transition-all ${
                      isSelected
                        ? 'bg-emerald-50/50 border-emerald-300 ring-2 ring-emerald-500/20'
                        : 'bg-slate-50/60 border-slate-200'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-1">
                        <span className="font-bold text-xs text-slate-900 leading-tight">{alt.action}</span>
                        {isSelected && (
                          <span className="px-1.5 py-0.2 rounded bg-emerald-600 text-white text-[10px] font-bold shrink-0">
                            BEST
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] space-y-1 py-1 border-y border-slate-200">
                        <div className="flex justify-between">
                          <span className="text-slate-500 font-medium">Cost:</span>
                          <span className="font-semibold text-slate-800 text-right">{alt.cost}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500 font-medium">Lead Time:</span>
                          <span className="font-semibold text-slate-800">{alt.leadTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500 font-medium">Risk:</span>
                          <span className={`font-bold ${alt.risk === 'LOW' ? 'text-emerald-700' : 'text-red-700'}`}>
                            {alt.risk}
                          </span>
                        </div>
                      </div>

                      {/* Pros & Cons */}
                      <div className="space-y-1.5 text-[10px]">
                        <div>
                          <span className="font-bold text-emerald-800 block mb-0.5">Pros:</span>
                          <ul className="space-y-0.5 text-slate-600 list-disc list-inside">
                            {alt.pros.map((p, pi) => (
                              <li key={pi} className="line-clamp-2">{p}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <span className="font-bold text-red-800 block mb-0.5">Cons:</span>
                          <ul className="space-y-0.5 text-slate-600 list-disc list-inside">
                            {alt.cons.map((c, ci) => (
                              <li key={ci} className="line-clamp-2">{c}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Action & Human Approval Panel (Mandated Section 5) */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl p-6 border border-slate-800 shadow-md space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Recommended Action: Human Approval Gate
                  </h3>
                  <p className="text-xs text-slate-400">Strict supervisory governance before ERP execution</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 self-start sm:self-auto">
                APPROVAL REQUIRED
              </span>
            </div>

            {/* Action Statement */}
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-3">
              <div className="text-base sm:text-lg font-extrabold text-emerald-300">
                “{analysis.selectedAction.action}”
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {analysis.selectedAction.reason}
              </p>

              {/* Action Parameter Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-700/80 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Quantity</span>
                  <span className="font-bold text-white">700 Units</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Batch</span>
                  <span className="font-mono font-bold text-white">BATCH-042</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Logistics Cost</span>
                  <span className="font-bold text-white">IDR 350,000</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Transit Duration</span>
                  <span className="font-bold text-white">2 Days (Route AB-01)</span>
                </div>
              </div>
            </div>

            {/* Approval Warning & Guardrail */}
            <div className="p-3.5 bg-amber-950/40 border border-amber-800/50 rounded-xl text-xs text-amber-200 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block mb-0.5">Supervisory Guardrail Warning:</span>
                {analysis.approvalReason}
              </div>
            </div>

            {/* Expected Impact Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
              <div>
                <span className="text-slate-400 text-[10px] block">Expiry Risk Exposure</span>
                <span className="font-bold text-emerald-400">{analysis.expectedImpact.expiryRisk}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Stockout Risk Exposure</span>
                <span className="font-bold text-emerald-400">{analysis.expectedImpact.stockoutRisk}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Avoided Loss</span>
                <span className="font-bold text-emerald-400">{analysis.expectedImpact.estimatedAvoidedLoss}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Decision Resolution Time</span>
                <span className="font-bold text-emerald-400">{analysis.expectedImpact.decisionTime}</span>
              </div>
            </div>

            {/* Notification / Status Message if already approved or acted */}
            {activeProposal && activeProposal.status === 'PENDING_EXECUTION' && (
              <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-xs text-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>
                    Proposal <strong>{activeProposal.proposal_id}</strong> is APPROVED & dispatched to SAP OData mock interface!
                  </span>
                </div>
                <span className="font-mono text-[10px] bg-emerald-900/60 px-2 py-0.5 rounded border border-emerald-700">
                  PENDING_EXECUTION
                </span>
              </div>
            )}

            {approvalMessage && (
              <div className="p-3 rounded-xl bg-slate-800 text-xs text-slate-200">
                {approvalMessage}
              </div>
            )}

            {/* Approval Buttons */}
            <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
              <button
                id="reject-proposal-btn"
                onClick={handleReject}
                disabled={isApproving || (activeProposal?.status === 'PENDING_EXECUTION')}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer"
              >
                Reject Proposal
              </button>

              <button
                id="escalate-proposal-btn"
                onClick={handleEscalate}
                disabled={isApproving || (activeProposal?.status === 'PENDING_EXECUTION')}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer"
              >
                Escalate to Director
              </button>

              <button
                id="approve-fefo-transfer-btn"
                onClick={handleApprove}
                disabled={isApproving || (activeProposal?.status === 'PENDING_EXECUTION')}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-700/30 transition-all disabled:opacity-50 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {activeProposal?.status === 'PENDING_EXECUTION'
                    ? 'Transfer Proposal Approved'
                    : 'Approve FEFO Transfer'}
                </span>
              </button>
            </div>
          </div>

          {/* Data Limitations Footnote */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 space-y-1">
            <span className="font-semibold text-slate-700 block">Data Limitations & Pilot Constraints:</span>
            <ul className="list-disc list-inside space-y-0.5">
              {analysis.dataLimitations.map((lim, i) => (
                <li key={i}>{lim}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
};
