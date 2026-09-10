import React from 'react';
import {
  Network,
  Cpu,
  Server,
  ShieldCheck,
  ArrowDown,
  Database,
  Cloud,
  CheckCircle2,
  Lock,
  Layers,
  ArrowRight
} from 'lucide-react';

export const ArchitectureView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header & Mandated Statement */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center">
            <Network className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">System Architecture & Production Roadmap</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Clear boundary separation between the functional hackathon MVP and the enterprise cloud target
            </p>
          </div>
        </div>

        {/* Mandated Explicit Text Statement */}
        <div className="p-4 rounded-xl bg-slate-900 text-white border border-slate-800 text-xs space-y-1.5">
          <span className="text-emerald-400 font-bold uppercase tracking-wider block text-[11px]">
            Architecture Boundary Statement
          </span>
          <p className="text-slate-200 leading-relaxed font-medium">
            “Current prototype: Gemini-based agentic workflow with synthetic data and SAP-compatible mock actions. Target production architecture: Amazon Bedrock Agents, AWS tools, SAP BTP API Management, and SAP OData/SAP EWM integration.”
          </p>
        </div>
      </div>

      {/* Visual Architectural Dataflow Diagram */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-600" />
          Agentic Dataflow Architecture (Prototype ➔ Production Transition)
        </h2>

        {/* Diagram Flow Containers */}
        <div className="max-w-xl mx-auto space-y-2 py-4 text-xs font-mono">
          {/* Step 1 */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center font-bold text-slate-800 shadow-xs">
            1. Synthetic Data Store (Local Mock Telemetry)
            <div className="text-[11px] font-normal text-slate-500 font-sans mt-0.5">
              Target: SAP S/4HANA CDS Views & Amazon S3 Data Lake
            </div>
          </div>

          <div className="flex justify-center text-slate-400">
            <ArrowDown className="w-4 h-4" />
          </div>

          {/* Step 2 */}
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-center font-bold text-emerald-950 shadow-xs">
            2. Nasent Web Control Tower (Responsive Dashboard)
            <div className="text-[11px] font-normal text-emerald-800 font-sans mt-0.5">
              Deployed on AWS Amplify Hosting
            </div>
          </div>

          <div className="flex justify-center text-slate-400">
            <ArrowDown className="w-4 h-4" />
          </div>

          {/* Step 3 */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center font-bold text-slate-800 shadow-xs">
            3. Server-Side Agent API (/api/analyze)
            <div className="text-[11px] font-normal text-slate-500 font-sans mt-0.5">
              Target: Amazon API Gateway with IAM Authorization
            </div>
          </div>

          <div className="flex justify-center text-slate-400">
            <ArrowDown className="w-4 h-4" />
          </div>

          {/* Step 4 */}
          <div className="p-3 rounded-xl bg-blue-50 border border-blue-300 text-center font-bold text-blue-950 shadow-xs">
            4. Gemini 3.8-Flash Prototype / Target: Amazon Bedrock Agents
            <div className="text-[11px] font-normal text-blue-800 font-sans mt-0.5">
              Orchestrates multi-echelon reasoning & action group selection
            </div>
          </div>

          <div className="flex justify-center text-slate-400">
            <ArrowDown className="w-4 h-4" />
          </div>

          {/* Step 5 */}
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-center font-bold text-amber-950 shadow-xs">
            5. Deterministic Supply-Chain Tools (FEFO Engine)
            <div className="text-[11px] font-normal text-amber-800 font-sans mt-0.5">
              Prototype: fefoEngine.ts | Target: AWS Lambda Serverless Functions
            </div>
          </div>

          <div className="flex justify-center text-slate-400">
            <ArrowDown className="w-4 h-4" />
          </div>

          {/* Step 6 */}
          <div className="p-3 rounded-xl bg-purple-50 border border-purple-300 text-center font-bold text-purple-950 shadow-xs">
            6. Human Approval Gate (Mandatory Supervisory Review)
            <div className="text-[11px] font-normal text-purple-800 font-sans mt-0.5">
              Zero unauthorized critical transactions permitted
            </div>
          </div>

          <div className="flex justify-center text-slate-400">
            <ArrowDown className="w-4 h-4" />
          </div>

          {/* Step 7 */}
          <div className="p-3 rounded-xl bg-emerald-100 border border-emerald-400 text-center font-bold text-emerald-950 shadow-xs">
            7. SAP-Compatible Transfer Proposal (STP-NASENT-0001)
            <div className="text-[11px] font-normal text-emerald-800 font-sans mt-0.5">
              Mock OData Payload verifying ERP schema readiness
            </div>
          </div>

          <div className="flex justify-center text-slate-400">
            <ArrowDown className="w-4 h-4" />
          </div>

          {/* Step 8 */}
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center font-bold text-white shadow-xs">
            8. Target Integration: SAP BTP / SAP S/4HANA / SAP EWM
            <div className="text-[11px] font-normal text-slate-400 font-sans mt-0.5">
              Automated creation of Stock Transport Orders (STO) via SAP Cloud Connector
            </div>
          </div>
        </div>
      </div>

      {/* Side-by-Side Comparison: Current Prototype vs. Production Cloud Target */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Prototype Box */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Current Prototype Implementation
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
              FUNCTIONAL MVP
            </span>
          </div>

          <div className="space-y-2.5 text-xs text-slate-700">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-150">
              <span className="font-bold text-slate-900 block">Agent Reasoning:</span>
              <span>Google Gemini 3.8-Flash via official @google/genai SDK (server-side only) with deterministic fallback.</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-150">
              <span className="font-bold text-slate-900 block">Supply-Chain Math:</span>
              <span>Deterministic FEFO engine validating status, capacity, transit lead-times, and surplus.</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-150">
              <span className="font-bold text-slate-900 block">Data Tier:</span>
              <span>In-memory state initialized with realistic Indonesian dairy telemetry (Cikarang DC & Bandung DC).</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-150">
              <span className="font-bold text-slate-900 block">ERP Simulation:</span>
              <span>SAP-compatible mock OData endpoint (/api/mock-sap/stock-transfer-proposals).</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-150">
              <span className="font-bold text-slate-900 block">Hosting:</span>
              <span>AWS Amplify Hosting compatible (full-stack Node / Next.js / Vite build).</span>
            </div>
          </div>
        </div>

        {/* Target Production Architecture Box */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Cloud className="w-4 h-4 text-blue-600" />
              Target Enterprise Production Architecture
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">
              AWS + SAP TARGET
            </span>
          </div>

          <div className="space-y-2.5 text-xs text-slate-700">
            <div className="p-2.5 rounded-lg bg-blue-50/50 border border-blue-150">
              <span className="font-bold text-slate-900 block">Orchestration:</span>
              <span>Amazon Bedrock Agents utilizing Action Groups with OpenAPI schemas.</span>
            </div>
            <div className="p-2.5 rounded-lg bg-blue-50/50 border border-blue-150">
              <span className="font-bold text-slate-900 block">Deterministic Execution:</span>
              <span>AWS Lambda serverless functions for inventory lookup, FEFO bounds, and route validation.</span>
            </div>
            <div className="p-2.5 rounded-lg bg-blue-50/50 border border-blue-150">
              <span className="font-bold text-slate-900 block">Event & Telemetry Backbone:</span>
              <span>Amazon EventBridge for expiry exception routing; Amazon S3 for historical batch logs.</span>
            </div>
            <div className="p-2.5 rounded-lg bg-blue-50/50 border border-blue-150">
              <span className="font-bold text-slate-900 block">Monitoring & Security:</span>
              <span>Amazon CloudWatch for metric alarms; AWS IAM for least-privilege role boundaries.</span>
            </div>
            <div className="p-2.5 rounded-lg bg-blue-50/50 border border-blue-150">
              <span className="font-bold text-slate-900 block">SAP Integration:</span>
              <span>SAP BTP API Management, SAP Cloud Connector, SAP OData, SAP S/4HANA & SAP EWM.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
