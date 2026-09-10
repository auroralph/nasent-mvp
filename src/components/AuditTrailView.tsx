import React, { useState } from 'react';
import {
  History,
  ShieldCheck,
  User,
  Cpu,
  Server,
  Filter,
  ArrowDownUp,
  Download,
  CheckCircle2
} from 'lucide-react';
import { AuditLog, WorkflowStage } from '../types';

interface AuditTrailViewProps {
  logs: AuditLog[];
}

export const AuditTrailView: React.FC<AuditTrailViewProps> = ({ logs }) => {
  const [selectedStage, setSelectedStage] = useState<string>('ALL');
  const [selectedActor, setSelectedActor] = useState<string>('ALL');

  const filteredLogs = logs.filter((log) => {
    if (selectedStage !== 'ALL' && log.stage !== selectedStage) return false;
    if (selectedActor !== 'ALL' && log.actor !== selectedActor) return false;
    return true;
  });

  const getActorIcon = (actor: string) => {
    if (actor.includes('PLANNER') || actor.includes('USER')) {
      return <User className="w-3.5 h-3.5 text-purple-600" />;
    } else if (actor.includes('AGENT') || actor.includes('NASENT')) {
      return <Cpu className="w-3.5 h-3.5 text-blue-600" />;
    } else {
      return <Server className="w-3.5 h-3.5 text-slate-600" />;
    }
  };

  const getStageBadgeColor = (stage: WorkflowStage) => {
    switch (stage) {
      case 'OBSERVE':
        return 'bg-slate-100 text-slate-800 border-slate-200';
      case 'DETECT':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'INVESTIGATE':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PLAN':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'EVALUATE':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'ACT':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'VERIFY':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'ESCALATE_OR_CLOSE':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Immutable Cold-Chain Audit Trail</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              {logs.length} Logged Events
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Chronological forensic record of all agent telemetry ingestion, deterministic calculations, and planner authorizations
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="bg-transparent border-none text-slate-700 font-medium focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">All Stages</option>
              <option value="OBSERVE">OBSERVE</option>
              <option value="DETECT">DETECT</option>
              <option value="INVESTIGATE">INVESTIGATE</option>
              <option value="PLAN">PLAN</option>
              <option value="EVALUATE">EVALUATE</option>
              <option value="ACT">ACT</option>
              <option value="VERIFY">VERIFY</option>
              <option value="ESCALATE_OR_CLOSE">ESCALATE_OR_CLOSE</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedActor}
              onChange={(e) => setSelectedActor(e.target.value)}
              className="bg-transparent border-none text-slate-700 font-medium focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">All Actors</option>
              <option value="NASENT_AGENT">NASENT_AGENT</option>
              <option value="DETERMINISTIC_FEFO_ENGINE">FEFO ENGINE</option>
              <option value="SYSTEM_SCHEDULER">SYSTEM_SCHEDULER</option>
              <option value="USER_PLANNER">USER_PLANNER</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audit Trail Timeline */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Event ID</th>
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">Workflow Stage</th>
                <th className="py-3.5 px-4">Actor</th>
                <th className="py-3.5 px-4">Forensic Summary</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150">
              {filteredLogs.map((log) => (
                <tr key={log.event_id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                    {log.event_id}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap font-mono text-slate-500 text-[11px]">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border font-mono ${getStageBadgeColor(
                        log.stage
                      )}`}
                    >
                      {log.stage}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                      {getActorIcon(log.actor)}
                      <span>{log.actor}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-800 leading-relaxed max-w-xl">
                    {log.summary}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
