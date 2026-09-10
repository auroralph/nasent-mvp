import React from 'react';
import { BookOpen, ExternalLink, FileText, CheckCircle2, Bookmark } from 'lucide-react';

export const ReferencesView: React.FC = () => {
  const references = [
    {
      title: 'Bappenas & LCDI: Food Loss and Food Waste in Indonesia Study',
      authority: 'Kementerian PPN / Bappenas (Low Carbon Development Indonesia)',
      year: '2021',
      summary:
        'National benchmark study documenting that 23–48 million tons of food are wasted annually in Indonesia, representing 4–5% of national GDP. Highlights post-harvest logistics inefficiencies and cold-chain mismatches as primary drivers of dairy and perishable waste.',
      scope: 'National Food Security & Sustainability Target',
      urlPlaceholder: 'https://lcdi-indonesia.id/food-loss-and-waste/ [URL placeholder to be verified by developer]'
    },
    {
      title: 'Badan Pangan Nasional (National Food Agency): Perishable Logistics & Inter-Regional Redistribution Directives',
      authority: 'Badan Pangan Nasional Republik Indonesia',
      year: '2022–2024',
      summary:
        'Regulatory frameworks governing perishable commodities price stabilization and cold-chain redistribution between Java production centers and high-demand consumption regions.',
      scope: 'Regulatory Compliance & Food Availability',
      urlPlaceholder: 'https://badanpangan.go.id/ [URL placeholder to be verified by developer]'
    },
    {
      title: 'Amazon Bedrock Agents & Action Groups Architecture Guide',
      authority: 'Amazon Web Services (AWS)',
      year: '2024',
      summary:
        'Official architectural documentation on orchestrating foundation model reasoning with deterministic AWS Lambda tools and OpenAPI schemas for enterprise business logic enforcement.',
      scope: 'Target Cloud Orchestration Layer',
      urlPlaceholder: 'https://docs.aws.amazon.com/bedrock/latest/userguide/agents.html'
    },
    {
      title: 'SAP S/4HANA & SAP EWM: Batch Determination (LO-BM) and Minimum Remaining Shelf Life (SLED)',
      authority: 'SAP SE Help Portal',
      year: '2023–2024',
      summary:
        'Technical specifications for First-Expired-First-Out (FEFO) strategy implementation, Shelf Life Expiration Date (SLED) calculations, and Stock Transport Order (STO) creation via SAP BTP API Management.',
      scope: 'Target ERP Inventory Integration',
      urlPlaceholder: 'https://help.sap.com/docs/SAP_S4HANA_ON-PREMISE/ [URL placeholder to be verified by developer]'
    },
    {
      title: 'AWS Prescriptive Guidance: Modernizing SAP Workflows with AWS Serverless and Generative AI',
      authority: 'AWS Solutions Architecture for SAP',
      year: '2024',
      summary:
        'Reference architecture for securely integrating SAP S/4HANA on AWS with Amazon Bedrock, EventBridge, and AWS Lambda using SAP Cloud Connector and OData APIs.',
      scope: 'Enterprise Hybrid Architecture Reference',
      urlPlaceholder: 'https://docs.aws.amazon.com/prescriptive-guidance/ [URL placeholder to be verified by developer]'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Research Grounding & Technical References</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Authoritative industry studies, Indonesian governmental directives, and cloud architectural citations
            </p>
          </div>
        </div>
      </div>

      {/* Citations List */}
      <div className="space-y-4">
        {references.map((ref, idx) => (
          <div
            key={idx}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2.5 transition-colors hover:border-slate-300"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-emerald-600 shrink-0" />
                {ref.title}
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 self-start sm:self-auto">
                {ref.scope}
              </span>
            </div>

            <div className="text-[11px] text-slate-500 font-medium">
              Source: <span className="text-slate-700">{ref.authority}</span> ({ref.year})
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {ref.summary}
            </p>

            <div className="pt-2 border-t border-slate-150 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span className="truncate max-w-md">{ref.urlPlaceholder}</span>
              <span className="text-[10px] text-slate-400 italic">Citation Placeholder</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
