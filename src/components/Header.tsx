import React from 'react';
import {
  ShieldAlert,
  Boxes,
  Cpu,
  History,
  Network,
  BookOpen,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  PlaySquare,
  Flame
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  exceptionCount: number;
  isDemoMode: boolean;
  setIsDemoMode: (val: boolean) => void;
  onResetDemo: () => void;
  onOpenDemoGuide: () => void;
  hasActiveProposal: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  exceptionCount,
  isDemoMode,
  setIsDemoMode,
  onResetDemo,
  onOpenDemoGuide,
  hasActiveProposal
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40">
      {/* Top Brand Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Product Identity */}
          <div className="flex items-center gap-3">
            <div
              id="nasent-logo-container"
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-md shadow-emerald-500/20 ring-1 ring-white/10"
            >
              {/* Connected cold-chain "N" / Shield glyph */}
              <svg
                className="w-6 h-6 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 4v16" />
                <path d="M4 7l16 10" />
                <path d="M20 4v16" />
                <circle cx="4" cy="7" r="2" fill="#34d399" />
                <circle cx="20" cy="17" r="2" fill="#38bdf8" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl tracking-tight text-white">Nasent</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Cold-Chain Sentinel
                </span>
                {isDemoMode ? (
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                    Demo Mode (Deterministic)
                  </span>
                ) : (
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-blue-400" />
              
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Agentic Cold-Chain Intelligence for FEFO Redistribution • <span className="text-emerald-400 font-medium">Prevent expiry. Protect availability.</span>
              </p>
            </div>
          </div>

          {/* Quick Actions & Mode Toggles */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Judge Demo Script Trigger */}
            <button
              id="header-demo-guide-btn"
              onClick={onOpenDemoGuide}
              className="flex items-center gap-1.5 text-xs font-medium bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-3 py-1.5 rounded-lg shadow-sm transition-colors border border-emerald-400/30"
            >
              <PlaySquare className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Judge</span> Demo Script
            </button>

            {/* Mode Switcher */}
            <button
              id="header-mode-toggle-btn"
              onClick={() => setIsDemoMode(!isDemoMode)}
              title="Toggle between Live Gemini AI calls and Deterministic Demo Fallback"
              className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              {isDemoMode ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  <span className="hidden lg:inline">Use AI</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden lg:inline">Use Demo Mode</span>
                </>
              )}
            </button>

            {/* Reset Demo State */}
            <button
              id="header-reset-demo-btn"
              onClick={onResetDemo}
              title="Reset data back to primary scenario state"
              className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Reset Demo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-slate-950/80 border-t border-slate-800/80 px-4 sm:px-6 lg:px-8 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex items-center gap-1 sm:gap-2 py-1.5">
          <button
            id="nav-dashboard-tab"
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            Control Tower
          </button>

          <button
            id="nav-exceptions-tab"
            onClick={() => setActiveTab('exceptions')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === 'exceptions'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-red-400" />
            <span>Exception Queue</span>
            {exceptionCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-red-500 text-white text-[10px] font-bold">
                {exceptionCount}
              </span>
            )}
          </button>

          <button
            id="nav-inventory-tab"
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === 'inventory'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Boxes className="w-3.5 h-3.5" />
            Inventory & Batches
          </button>

          <button
            id="nav-analysis-tab"
            onClick={() => setActiveTab('analysis')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === 'analysis'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-blue-400" />
            <span>Agent Analysis & Workflow</span>
            {hasActiveProposal && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            )}
          </button>

          <button
            id="nav-audit-tab"
            onClick={() => setActiveTab('audit')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === 'audit'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            Audit Trail
          </button>

          <button
            id="nav-architecture-tab"
            onClick={() => setActiveTab('architecture')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === 'architecture'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            Architecture & Roadmap
          </button>

          <button
            id="nav-references-tab"
            onClick={() => setActiveTab('references')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === 'references'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Research & Citations
          </button>
        </div>
      </div>
    </header>
  );
};
