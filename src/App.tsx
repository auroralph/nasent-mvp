import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { ExceptionQueueView } from './components/ExceptionQueueView';
import { InventoryBatchesView } from './components/InventoryBatchesView';
import { AgentAnalysisView } from './components/AgentAnalysisView';
import { AuditTrailView } from './components/AuditTrailView';
import { ArchitectureView } from './components/ArchitectureView';
import { ReferencesView } from './components/ReferencesView';
import { DemoGuideModal } from './components/DemoGuideModal';
import { SapProposalModal } from './components/SapProposalModal';
import {
  SupplyChainException,
  InventoryBatch,
  AuditLog,
  TransferProposal,
  AgentAnalysisResponse
} from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [isDemoGuideOpen, setIsDemoGuideOpen] = useState<boolean>(false);
  const [isSapModalOpen, setIsSapModalOpen] = useState<boolean>(false);

  const [exceptions, setExceptions] = useState<SupplyChainException[]>([]);
  const [batches, setBatches] = useState<InventoryBatch[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [activeProposal, setActiveProposal] = useState<TransferProposal | null>(null);
  const [analysis, setAnalysis] = useState<AgentAnalysisResponse | null>(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Load telemetry data from server
  const loadData = async () => {
    try {
      const [excRes, batchRes, auditRes] = await Promise.all([
        fetch('/api/exceptions').then((r) => r.json()),
        fetch('/api/batches').then((r) => r.json()),
        fetch('/api/audit-logs').then((r) => r.json())
      ]);

      if (excRes?.exceptions) setExceptions(excRes.exceptions);
      if (batchRes?.batches) setBatches(batchRes.batches);
      if (auditRes?.logs) setAuditLogs(auditRes.logs);
    } catch (err: any) {
      console.error('Failed to load initial data:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Run agentic analysis
  const handleRunAnalysis = async (targetExceptionId = 'EXP-2026-001') => {
    setLoadingAnalysis(true);
    setApiError(null);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exception_id: targetExceptionId,
          force_demo_mode: isDemoMode
        })
      });

      if (!res.ok) {
        throw new Error(`Analysis failed with HTTP ${res.status}`);
      }

      const data = (await res.json()) as AgentAnalysisResponse;
      setAnalysis(data);
      if (data.isDemoMode !== undefined) {
        setIsDemoMode(data.isDemoMode);
      }
      // Refresh audit logs & exception status
      loadData();
    } catch (err: any) {
      console.error('Agent analysis request error:', err);
      setApiError(err.message || 'Failed to complete agent analysis');
    } finally {
      setLoadingAnalysis(false);
    }
  };

  // Human approval handler
  const handleApproveProposal = async () => {
    try {
      const res = await fetch('/api/approvals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proposal_id: 'STP-NASENT-0001',
          decision: 'APPROVED',
          actor: 'DC_PLANNER_USER',
          notes: 'Approved FEFO redistribution after review of shelf-life safety bounds.'
        })
      });

      const data = await res.json();
      if (data.proposal) {
        setActiveProposal(data.proposal);
        setIsSapModalOpen(true);
      }
      await loadData();
    } catch (err) {
      console.error('Approval failed:', err);
    }
  };

  // Reject proposal handler
  const handleRejectProposal = async () => {
    try {
      const res = await fetch('/api/approvals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proposal_id: 'STP-NASENT-0001',
          decision: 'REJECTED',
          actor: 'DC_PLANNER_USER',
          notes: 'Supervisor rejected redistribution due to local priority.'
        })
      });
      const data = await res.json();
      if (data.proposal) {
        setActiveProposal(data.proposal);
      }
      await loadData();
    } catch (err) {
      console.error('Rejection failed:', err);
    }
  };

  // Escalate proposal handler
  const handleEscalateProposal = async () => {
    try {
      await fetch('/api/approvals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proposal_id: 'STP-NASENT-0001',
          decision: 'ESCALATED',
          actor: 'DC_PLANNER_USER',
          notes: 'Escalated to Central Logistics Director for network-level review.'
        })
      });
      await loadData();
    } catch (err) {
      console.error('Escalation failed:', err);
    }
  };

  // Reset demo state for judges
  const handleResetDemo = async () => {
    try {
      await fetch('/api/reset-demo', { method: 'POST' });
      setActiveProposal(null);
      setAnalysis(null);
      await loadData();
    } catch (err) {
      console.error('Reset failed:', err);
    }
  };

  const handleJumpToDemoStep = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        setActiveTab('exceptions');
        break;
      case 2:
        setActiveTab('analysis');
        if (!analysis) handleRunAnalysis();
        break;
      case 3:
        setActiveTab('inventory');
        break;
      case 4:
      case 5:
      case 6:
        setActiveTab('analysis');
        if (!analysis) handleRunAnalysis();
        break;
      case 7:
        setActiveTab('audit');
        break;
      case 8:
        setActiveTab('dashboard');
        break;
      default:
        setActiveTab('dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/60 text-slate-900 font-sans flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Top Header & Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        exceptionCount={exceptions.filter((e) => e.severity === 'HIGH').length}
        isDemoMode={isDemoMode}
        setIsDemoMode={setIsDemoMode}
        onResetDemo={handleResetDemo}
        onOpenDemoGuide={() => setIsDemoGuideOpen(true)}
        hasActiveProposal={Boolean(activeProposal)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {apiError && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center justify-between">
            <span>{apiError}</span>
            <button
              onClick={() => setApiError(null)}
              className="text-red-600 hover:text-red-900 font-bold ml-4"
            >
              Dismiss
            </button>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <DashboardView
            exceptions={exceptions}
            recentProposals={activeProposal ? [activeProposal] : []}
            recentAuditLogs={auditLogs}
            onNavigateToExceptions={() => setActiveTab('exceptions')}
            onNavigateToAnalysis={() => {
              setActiveTab('analysis');
              if (!analysis) handleRunAnalysis();
            }}
            onNavigateToAudit={() => setActiveTab('audit')}
          />
        )}

        {activeTab === 'exceptions' && (
          <ExceptionQueueView
            exceptions={exceptions}
            onAnalyzeException={(excId) => {
              setActiveTab('analysis');
              handleRunAnalysis(excId);
            }}
          />
        )}

        {activeTab === 'inventory' && (
          <InventoryBatchesView
            batches={batches}
            onTriggerAnalysis={() => {
              setActiveTab('analysis');
              if (!analysis) handleRunAnalysis();
            }}
          />
        )}

        {activeTab === 'analysis' && (
          <AgentAnalysisView
            analysis={analysis}
            loading={loadingAnalysis}
            onRunAnalysis={() => handleRunAnalysis()}
            onApproveProposal={handleApproveProposal}
            onRejectProposal={handleRejectProposal}
            onEscalateProposal={handleEscalateProposal}
            activeProposal={activeProposal}
            isDemoMode={isDemoMode}
          />
        )}

        {activeTab === 'audit' && <AuditTrailView logs={auditLogs} />}

        {activeTab === 'architecture' && <ArchitectureView />}

        {activeTab === 'references' && <ReferencesView />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span className="font-semibold text-slate-700">Nasent FEFO Intelligence</span> — Prevent Expiry. Protect Availability.
          </div>
          <div className="text-[11px] text-slate-400">
            Simulated demonstration scenario • SAP-compatible mock integration boundary
          </div>
        </div>
      </footer>

      {/* Modals */}
      <DemoGuideModal
        isOpen={isDemoGuideOpen}
        onClose={() => setIsDemoGuideOpen(false)}
        onJumpToStep={handleJumpToDemoStep}
      />

      <SapProposalModal
        proposal={activeProposal}
        isOpen={isSapModalOpen}
        onClose={() => setIsSapModalOpen(false)}
        onViewAuditTrail={() => setActiveTab('audit')}
      />
    </div>
  );
}
