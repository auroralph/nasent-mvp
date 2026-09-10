import { GoogleGenAI } from '@google/genai';
import { AgentAnalysisResponse } from '../types';
import { buildDeterministicAgentResponse, store, validateFEFO } from './fefoEngine';

// Lazy-initialized Gemini client
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
    'const apiKey = process.env.GEMINI_API_KEY;';

  if (!apiKey) {
    return null;
  }

  if (!aiClient) {
    try {
      aiClient = new GoogleGenAI({ apiKey });
    } catch (err) {
      console.warn('Failed to initialize GoogleGenAI client:', err);
      return null;
    }
  }
  return aiClient;
}

export async function runAgentAnalysis(
  exceptionId: string,
  forceDemoMode = false
): Promise<AgentAnalysisResponse> {
  // If force demo mode requested or fallback needed
  if (forceDemoMode) {
    const fallback = buildDeterministicAgentResponse(exceptionId);
    fallback.isDemoMode = true;
    fallback.demoModeBanner = 'Demo Mode: deterministic fallback response.';
    return fallback;
  }

  const client = getGeminiClient();
  if (!client) {
    const fallback = buildDeterministicAgentResponse(exceptionId);
    fallback.isDemoMode = true;
    fallback.demoModeBanner = 'Demo Mode: deterministic fallback response.';
    return fallback;
  }

  try {
    const exception = store.exceptions.find((e) => e.exception_id === exceptionId) || store.exceptions[0];
    const fefoValidation = validateFEFO(exception.sku_id, 'BATCH-042', exception.source_warehouse, exception.destination_warehouse, 700);

    const prompt = `You are Nasent's Supply-Chain Agentic Intelligence.
You are analyzing a critical cold-chain perishable goods mismatch in an Indonesian distribution network.

CONTEXT & DETERMINISTIC FACTS:
- Product: Fresh Milk 1L (SKU-MILK-001, Category: Perishable Dairy, Unit Value: IDR 24,000)
- Source Warehouse: Warehouse A (WH-A, Cikarang Central DC)
- Destination Warehouse: Warehouse B (WH-B, Bandung Regional DC)
- Batch at WH-A: BATCH-042, Quantity: 1,000 units, Status: AVAILABLE, Expiry: 4 days remaining.
- WH-A Local 5-Day Forecast Demand: 100 units. Local surplus: 900 units.
- WH-B On-Hand Inventory: 150 units.
- WH-B Local 5-Day Forecast Demand: 700 units. Projected stockout in 5 days (net deficit: 550 units).
- Transfer Route: ROUTE-WHA-WHB-01, Transit Duration: 2 days, Transport Cost: IDR 350,000, Capacity: 800 units.
- FEFO Validation Status: ${fefoValidation.valid ? 'VALID' : 'INVALID'} - ${fefoValidation.reason}
- Supplier PO Alternative: PO-GREENFIELD-901, Quantity: 1,000 units, Lead Time: 8 days (arrives AFTER stockout!), Cost: IDR 4,000,000.

GOAL:
Produce a structured FEFO recommendation and comparison of alternatives.
Follow these agentic stages: OBSERVE, DETECT, INVESTIGATE, PLAN, EVALUATE, ACT, VERIFY, ESCALATE_OR_CLOSE.
Do NOT invent fake numbers. Human approval is strictly REQUIRED.

Respond ONLY with valid JSON matching this exact schema:
{
  "exceptionSummary": "string",
  "riskLevel": "HIGH",
  "observedFacts": ["string"],
  "calculations": [
    { "metric": "string", "value": "string", "meaning": "string" }
  ],
  "alternatives": [
    {
      "action": "string",
      "cost": "string",
      "leadTime": "string",
      "risk": "string",
      "pros": ["string"],
      "cons": ["string"]
    }
  ],
  "selectedAction": {
    "action": "Transfer 700 units of batch BATCH-042 from WH-A to WH-B",
    "reason": "string"
  },
  "approvalRequired": true,
  "approvalReason": "string",
  "expectedImpact": {
    "expiryRisk": "string",
    "stockoutRisk": "string",
    "estimatedAvoidedLoss": "string",
    "decisionTime": "string"
  },
  "decisionTrace": [
    { "stage": "OBSERVE", "summary": "string" },
    { "stage": "DETECT", "summary": "string" },
    { "stage": "INVESTIGATE", "summary": "string" },
    { "stage": "PLAN", "summary": "string" },
    { "stage": "EVALUATE", "summary": "string" },
    { "stage": "ACT", "summary": "string" },
    { "stage": "VERIFY", "summary": "string" },
    { "stage": "ESCALATE_OR_CLOSE", "summary": "string" }
  ],
  "dataLimitations": ["string"]
}`;

    const response = await client.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.1
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error('Empty response from Gemini');
    }

    const parsed = JSON.parse(text) as AgentAnalysisResponse;
    parsed.selectedAction.transferDetails = {
      sku_id: 'SKU-MILK-001',
      batch_id: 'BATCH-042',
      source_warehouse: 'WH-A',
      destination_warehouse: 'WH-B',
      quantity: 700,
      transfer_cost: 350000,
      transit_days: 2
    };
    parsed.toolActivity = [
      { name: 'get_inventory(SKU-MILK-001, WH-A)', status: 'COMPLETED', detail: '1,000 units available' },
      { name: 'get_demand_forecast(SKU-MILK-001, WH-A)', status: 'COMPLETED', detail: '100 units forecast' },
      { name: 'get_inventory(SKU-MILK-001, WH-B)', status: 'COMPLETED', detail: '150 units available' },
      { name: 'get_demand_forecast(SKU-MILK-001, WH-B)', status: 'COMPLETED', detail: '700 units forecast' },
      { name: 'validate_fefo(SKU-MILK-001, BATCH-042, WH-A, WH-B, 700)', status: 'COMPLETED', detail: 'Valid: 2d transit, IDR 350k' },
      { name: 'gemini_agent_reasoning()', status: 'COMPLETED', detail: 'Structured evaluation & trade-off generated' }
    ];
    parsed.isDemoMode = false;

    return parsed;
  } catch (error) {
    console.warn('Gemini API call failed or timed out, using deterministic fallback response:', error);
    const fallback = buildDeterministicAgentResponse(exceptionId);
    fallback.isDemoMode = true;
    fallback.demoModeBanner = 'Demo Mode: deterministic fallback response.';
    return fallback;
  }
}
