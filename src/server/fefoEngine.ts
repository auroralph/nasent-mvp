import {
  InventoryBatch,
  DemandForecast,
  TransferRoute,
  PurchaseOrder,
  SupplyChainException,
  TransferProposal,
  AuditLog,
  AgentAnalysisResponse
} from '../types';
import {
  INITIAL_BATCHES,
  INITIAL_DEMAND_FORECASTS,
  INITIAL_TRANSFER_ROUTES,
  INITIAL_PURCHASE_ORDERS,
  INITIAL_EXCEPTIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_PRODUCTS,
  INITIAL_WAREHOUSES
} from '../data/mockData';

// In-Memory state for the prototype session
class StateStore {
  batches: InventoryBatch[] = JSON.parse(JSON.stringify(INITIAL_BATCHES));
  demands: DemandForecast[] = JSON.parse(JSON.stringify(INITIAL_DEMAND_FORECASTS));
  routes: TransferRoute[] = JSON.parse(JSON.stringify(INITIAL_TRANSFER_ROUTES));
  purchaseOrders: PurchaseOrder[] = JSON.parse(JSON.stringify(INITIAL_PURCHASE_ORDERS));
  exceptions: SupplyChainException[] = JSON.parse(JSON.stringify(INITIAL_EXCEPTIONS));
  proposals: TransferProposal[] = [];
  auditLogs: AuditLog[] = JSON.parse(JSON.stringify(INITIAL_AUDIT_LOGS));

  reset() {
    this.batches = JSON.parse(JSON.stringify(INITIAL_BATCHES));
    this.demands = JSON.parse(JSON.stringify(INITIAL_DEMAND_FORECASTS));
    this.routes = JSON.parse(JSON.stringify(INITIAL_TRANSFER_ROUTES));
    this.purchaseOrders = JSON.parse(JSON.stringify(INITIAL_PURCHASE_ORDERS));
    this.exceptions = JSON.parse(JSON.stringify(INITIAL_EXCEPTIONS));
    this.proposals = [];
    this.auditLogs = JSON.parse(JSON.stringify(INITIAL_AUDIT_LOGS));
  }
}

export const store = new StateStore();

export function getBatches(sku_id?: string, warehouse_id?: string): InventoryBatch[] {
  return store.batches.filter((b) => {
    if (sku_id && b.sku_id !== sku_id) return false;
    if (warehouse_id && b.warehouse_id !== warehouse_id) return false;
    return true;
  });
}

export function getInventory(sku_id: string, warehouse_id: string) {
  const batches = getBatches(sku_id, warehouse_id);
  const totalQuantity = batches.reduce((sum, b) => sum + b.quantity, 0);
  const availableBatches = batches.filter((b) => b.status === 'AVAILABLE');
  const availableQuantity = availableBatches.reduce((sum, b) => sum + b.quantity, 0);
  const blockedQuantity = batches
    .filter((b) => b.status === 'BLOCKED' || b.status === 'QUARANTINED')
    .reduce((sum, b) => sum + b.quantity, 0);
  const expiredQuantity = batches
    .filter((b) => b.status === 'EXPIRED')
    .reduce((sum, b) => sum + b.quantity, 0);

  return {
    sku_id,
    warehouse_id,
    totalQuantity,
    availableQuantity,
    blockedQuantity,
    expiredQuantity,
    batches
  };
}

export function getDemandForecast(sku_id: string, warehouse_id: string): DemandForecast | undefined {
  return store.demands.find((d) => d.sku_id === sku_id && d.warehouse_id === warehouse_id);
}

export function calculateExpiryRisk(batch: InventoryBatch, localDemand: number) {
  const surplus = Math.max(0, batch.quantity - localDemand);
  const isCloseToExpiry = (batch.days_to_expiry ?? 0) <= 5;
  const isHighRisk = isCloseToExpiry && surplus > 0;

  return {
    batch_id: batch.batch_id,
    quantity: batch.quantity,
    localDemand,
    surplusAtRisk: surplus,
    daysToExpiry: batch.days_to_expiry ?? 0,
    isCloseToExpiry,
    riskLevel: isHighRisk ? 'HIGH' : isCloseToExpiry ? 'MEDIUM' : 'LOW'
  };
}

export function calculateStockoutRisk(availableQuantity: number, forecastDemand: number) {
  const deficit = Math.max(0, forecastDemand - availableQuantity);
  const isStockoutImminent = deficit > 0;

  return {
    availableQuantity,
    forecastDemand,
    deficit,
    projectedStockoutDays: 5, // based on 5-day cycle forecast
    riskLevel: deficit > 300 ? 'HIGH' : deficit > 0 ? 'MEDIUM' : 'LOW'
  };
}

export interface FEFOValidationResult {
  valid: boolean;
  reason: string;
  sourceSurplus: number;
  transferQuantity: number;
  routeTransitDays: number;
  arrivalRemainingShelfLife: number;
  transferCost: number;
  batch?: InventoryBatch;
  route?: TransferRoute;
}

export function validateFEFO(
  sku_id: string,
  batch_id: string,
  source_wh: string,
  dest_wh: string,
  requestedQuantity?: number
): FEFOValidationResult {
  const batch = store.batches.find(
    (b) => b.batch_id === batch_id && b.sku_id === sku_id && b.warehouse_id === source_wh
  );

  if (!batch) {
    return {
      valid: false,
      reason: `Batch ${batch_id} for SKU ${sku_id} not found at source warehouse ${source_wh}.`,
      sourceSurplus: 0,
      transferQuantity: 0,
      routeTransitDays: 0,
      arrivalRemainingShelfLife: 0,
      transferCost: 0
    };
  }

  // Rule 1 & 2: Only AVAILABLE batches allowed. Blocked/quarantined/expired rejected.
  if (batch.status !== 'AVAILABLE') {
    return {
      valid: false,
      reason: `Batch ${batch_id} has status '${batch.status}' (non-available). Excluded by FEFO compliance rule.`,
      sourceSurplus: 0,
      transferQuantity: 0,
      routeTransitDays: 0,
      arrivalRemainingShelfLife: 0,
      transferCost: 0,
      batch
    };
  }

  // Find route
  const route = store.routes.find(
    (r) => r.source_warehouse === source_wh && r.destination_warehouse === dest_wh
  );
  if (!route) {
    return {
      valid: false,
      reason: `No established cold-chain transfer route found between ${source_wh} and ${dest_wh}.`,
      sourceSurplus: 0,
      transferQuantity: 0,
      routeTransitDays: 0,
      arrivalRemainingShelfLife: 0,
      transferCost: 0,
      batch
    };
  }

  // Demand calculations
  const sourceDemand = getDemandForecast(sku_id, source_wh)?.expected_demand ?? 0;
  const destDemand = getDemandForecast(sku_id, dest_wh)?.expected_demand ?? 0;
  const destAvailable = getInventory(sku_id, dest_wh).availableQuantity;
  const destNetNeed = Math.max(0, destDemand - destAvailable); // 700 - 150 = 550 minimum, or full demand of 700 for replenishment

  const sourceSurplus = Math.max(0, batch.quantity - sourceDemand); // 1000 - 100 = 900
  const qtyToTransfer = requestedQuantity ?? 700;

  // Rule 5: Check quantity bounds
  if (qtyToTransfer > batch.quantity) {
    return {
      valid: false,
      reason: `Requested transfer quantity (${qtyToTransfer}) exceeds available batch quantity (${batch.quantity}).`,
      sourceSurplus,
      transferQuantity: qtyToTransfer,
      routeTransitDays: route.transit_days,
      arrivalRemainingShelfLife: (batch.days_to_expiry ?? 0) - route.transit_days,
      transferCost: route.transfer_cost,
      batch,
      route
    };
  }

  if (qtyToTransfer > sourceSurplus) {
    return {
      valid: false,
      reason: `Requested transfer (${qtyToTransfer}) exceeds source surplus (${sourceSurplus}) after local demand (${sourceDemand}).`,
      sourceSurplus,
      transferQuantity: qtyToTransfer,
      routeTransitDays: route.transit_days,
      arrivalRemainingShelfLife: (batch.days_to_expiry ?? 0) - route.transit_days,
      transferCost: route.transfer_cost,
      batch,
      route
    };
  }

  if (qtyToTransfer > route.capacity) {
    return {
      valid: false,
      reason: `Requested transfer quantity (${qtyToTransfer}) exceeds route cold-chain capacity (${route.capacity}).`,
      sourceSurplus,
      transferQuantity: qtyToTransfer,
      routeTransitDays: route.transit_days,
      arrivalRemainingShelfLife: (batch.days_to_expiry ?? 0) - route.transit_days,
      transferCost: route.transfer_cost,
      batch,
      route
    };
  }

  // Rule 4 & 6: Shelf life and transit arrival
  const daysToExpiry = batch.days_to_expiry ?? 0;
  const arrivalRemainingShelfLife = daysToExpiry - route.transit_days;

  if (arrivalRemainingShelfLife <= 0) {
    return {
      valid: false,
      reason: `Insufficient shelf life: batch arrives with ${arrivalRemainingShelfLife} days remaining (expired in transit).`,
      sourceSurplus,
      transferQuantity: qtyToTransfer,
      routeTransitDays: route.transit_days,
      arrivalRemainingShelfLife,
      transferCost: route.transfer_cost,
      batch,
      route
    };
  }

  // Check arrival vs projected stockout
  const projectedStockoutDays = 5;
  if (route.transit_days > projectedStockoutDays) {
    return {
      valid: false,
      reason: `Route transit time (${route.transit_days} days) exceeds destination stockout horizon (${projectedStockoutDays} days).`,
      sourceSurplus,
      transferQuantity: qtyToTransfer,
      routeTransitDays: route.transit_days,
      arrivalRemainingShelfLife,
      transferCost: route.transfer_cost,
      batch,
      route
    };
  }

  return {
    valid: true,
    reason: `Complies with FEFO rules. Batch arrives in ${route.transit_days} days with ${arrivalRemainingShelfLife} days shelf life intact before destination stockout.`,
    sourceSurplus,
    transferQuantity: qtyToTransfer,
    routeTransitDays: route.transit_days,
    arrivalRemainingShelfLife,
    transferCost: route.transfer_cost,
    batch,
    route
  };
}

export function writeAuditLog(
  exception_id: string,
  stage: AuditLog['stage'],
  summary: string,
  actor: string
): AuditLog {
  const event: AuditLog = {
    event_id: `AUD-${Date.now().toString().slice(-4)}`,
    exception_id,
    stage,
    summary,
    actor,
    timestamp: new Date().toISOString()
  };
  store.auditLogs.unshift(event);
  return event;
}

export function createTransferProposal(
  sku_id: string,
  batch_id: string,
  source_warehouse: string,
  destination_warehouse: string,
  quantity: number,
  reason: string,
  estimated_cost: number
): TransferProposal {
  // Prevent duplicate active proposals for same SKU & batch
  const existing = store.proposals.find(
    (p) =>
      p.sku_id === sku_id &&
      p.batch_id === batch_id &&
      p.source_warehouse === source_warehouse &&
      p.destination_warehouse === destination_warehouse &&
      (p.status === 'PENDING_APPROVAL' || p.status === 'APPROVED' || p.status === 'PENDING_EXECUTION')
  );

  if (existing) {
    return existing;
  }

  const proposal: TransferProposal = {
    proposal_id: `STP-NASENT-${String(store.proposals.length + 1).padStart(4, '0')}`,
    sku_id,
    batch_id,
    source_warehouse,
    destination_warehouse,
    quantity,
    reason,
    status: 'PENDING_APPROVAL',
    estimated_cost,
    created_at: new Date().toISOString()
  };

  store.proposals.unshift(proposal);

  writeAuditLog(
    'EXP-2026-001',
    'ACT',
    `Created FEFO transfer proposal ${proposal.proposal_id} for ${quantity} units of ${sku_id} (${batch_id}) from ${source_warehouse} to ${destination_warehouse}. Status: PENDING_APPROVAL.`,
    'NASENT_AGENT'
  );

  return proposal;
}

export function buildDeterministicAgentResponse(exceptionId: string): AgentAnalysisResponse {
  const exception = store.exceptions.find((e) => e.exception_id === exceptionId) || store.exceptions[0];
  const sku = exception.sku_id;
  const sourceWh = exception.source_warehouse;
  const destWh = exception.destination_warehouse;

  const fefoValidation = validateFEFO(sku, 'BATCH-042', sourceWh, destWh, 700);

  // Tools executed trace
  writeAuditLog(
    exceptionId,
    'INVESTIGATE',
    'Calculated net local surplus (900 units) at WH-A and stockout deficit (550 units) at WH-B. Validated cold-chain route ROUTE-WHA-WHB-01.',
    'DETERMINISTIC_FEFO_ENGINE'
  );

  writeAuditLog(
    exceptionId,
    'PLAN',
    'Generated and compared 4 feasible options: Do Nothing, FEFO Inter-Warehouse Transfer, New Procurement PO, and Emergency Disposal.',
    'DETERMINISTIC_FEFO_ENGINE'
  );

  writeAuditLog(
    exceptionId,
    'EVALUATE',
    'Evaluated trade-off matrix: FEFO transfer arrives in 2 days (cost IDR 350,000) vs PO arrival in 8 days (cost IDR 4,000,000, missing stockout deadline).',
    'DETERMINISTIC_FEFO_ENGINE'
  );

  const response: AgentAnalysisResponse = {
    exceptionSummary:
      'WH-A has 1,000 units of Fresh Milk (BATCH-042) expiring in 4 days with only 100 units local demand (900 surplus at risk of spoilage). Simultaneously, WH-B has 150 units on hand with 700 units forecast demand, triggering a critical stockout in 5 days.',
    riskLevel: 'HIGH',
    observedFacts: [
      'Warehouse A (WH-A) holds 1,000 units of Fresh Milk 1L in BATCH-042 expiring in 4 days.',
      'Warehouse A local forecast demand over the next 5 days is only 100 units, leaving a surplus of 900 units.',
      'Warehouse B (WH-B) holds only 150 units on hand against projected demand of 700 units (deficit of 550 units).',
      'Route ROUTE-WHA-WHB-01 offers 2-day refrigerated transit with capacity of 800 units at a fixed cost of IDR 350,000.',
      'Existing purchase order PO-GREENFIELD-901 requires 8 days lead time at an estimated cost of IDR 4,000,000, arriving 3 days after WH-B stocks out.'
    ],
    calculations: [
      {
        metric: 'WH-A Usable Surplus',
        value: '900 units',
        meaning: 'Available quantity (1,000) minus local demand (100). Safe to transfer without risking WH-A fulfillment.'
      },
      {
        metric: 'WH-B Stockout Deficit',
        value: '550 units',
        meaning: 'Forecast demand (700) minus on-hand inventory (150). Replenishment of 700 units fully secures the distribution window.'
      },
      {
        metric: 'Transit vs Expiry Window',
        value: '2 days transit / 2 days post-arrival shelf life',
        meaning: 'Batch arrives on Day 2 with 2 remaining days for immediate retail distribution before Day 4 expiry.'
      },
      {
        metric: 'Cost Comparison',
        value: 'IDR 350,000 (Transfer) vs IDR 4,000,000 (PO)',
        meaning: 'FEFO transfer is 91.25% less expensive than expedited emergency procurement.'
      },
      {
        metric: 'Avoided Expiry Loss',
        value: 'IDR 4,200,000',
        meaning: 'Preserves 700 perishable units @ IDR 24,000 retail valuation minus IDR 350,000 redistribution logistics cost.'
      }
    ],
    alternatives: [
      {
        action: 'Option 1: Do Nothing (Status Quo)',
        cost: 'IDR 0 upfront (Loss: IDR 16,800,000 in expired stock + lost WH-B sales)',
        leadTime: 'Immediate',
        risk: 'CRITICAL',
        pros: ['No immediate logistics coordination required'],
        cons: [
          '900 units expire unsold at WH-A',
          'WH-B experiences severe stockout at Day 5',
          'Breaches customer SLA and brand trust'
        ]
      },
      {
        action: 'Option 2: FEFO Inter-Warehouse Transfer (Recommended)',
        cost: 'IDR 350,000',
        leadTime: '2 days',
        risk: 'LOW',
        pros: [
          'Arrives 3 days before WH-B projected stockout',
          'Redistributes 700 units of near-expiry inventory for immediate retail sale',
          'Saves IDR 4.2M net product value with minimal transport overhead',
          'Complies with cold-chain transit protocols'
        ],
        cons: [
          'Requires human approval and warehouse dispatch coordination',
          'Tight 2-day remaining shelf life upon arrival at destination'
        ]
      },
      {
        action: 'Option 3: Expedited Supplier Procurement (PO-GREENFIELD-901)',
        cost: 'IDR 4,000,000',
        leadTime: '8 days',
        risk: 'HIGH',
        pros: ['Provides fresh inventory with full 14-day shelf life'],
        cons: [
          'Arrives 3 days after WH-B stockout has already occurred',
          'Does not prevent BATCH-042 expiry at WH-A',
          '11.4x higher financial cost than inter-warehouse redistribution'
        ]
      },
      {
        action: 'Option 4: Write-Off & Disposal at WH-A',
        cost: 'IDR 500,000 (Bio-waste hazardous food disposal)',
        leadTime: '1 day',
        risk: 'CRITICAL',
        pros: ['Clears WH-A warehouse racking capacity immediately'],
        cons: [
          'Complete write-off of usable food assets',
          'Contravenes national Bappenas food-waste reduction targets',
          'Leaves WH-B stockout completely unaddressed'
        ]
      }
    ],
    selectedAction: {
      action: 'Transfer 700 units of batch BATCH-042 from WH-A to WH-B',
      reason:
        'FEFO transfer resolves the dual mismatch: it liquidates near-expiry surplus at WH-A before spoilage while replenishing WH-B before its day-5 stockout date. Arrival in 2 days ensures continuous service level at lowest net cost (IDR 350,000).',
      transferDetails: {
        sku_id: 'SKU-MILK-001',
        batch_id: 'BATCH-042',
        source_warehouse: 'WH-A',
        destination_warehouse: 'WH-B',
        quantity: 700,
        transfer_cost: 350000,
        transit_days: 2
      }
    },
    approvalRequired: true,
    approvalReason:
      'Human approval is mandatory before dispatching cold-chain transfer proposals to SAP S/4HANA to maintain strict supervisory auditability and prevent unauthorized inventory movements.',
    expectedImpact: {
      expiryRisk: 'Reduced from 900 units at risk to 200 units (78% reduction)',
      stockoutRisk: 'Eliminated (WH-B stock coverage extended from 1 day to 6 days)',
      estimatedAvoidedLoss: 'IDR 4,200,000 net value preserved',
      decisionTime: '< 5 minutes (down from ~2 hours manual planner investigation)'
    },
    decisionTrace: [
      {
        stage: 'OBSERVE',
        summary: 'Ingested batch BATCH-042 (1,000 units, exp 4d), WH-A demand (100 units), WH-B demand (700 units), and Route AB-01 telemetry.'
      },
      {
        stage: 'DETECT',
        summary: 'Flagged concurrent expiration anomaly at WH-A and stockout vulnerability at WH-B for SKU-MILK-001.'
      },
      {
        stage: 'INVESTIGATE',
        summary: 'Verified WH-A net surplus (900 units) and WH-B coverage gap (550 units). Checked refrigerated transit duration (2 days).'
      },
      {
        stage: 'PLAN',
        summary: 'Formulated 4 distinct courses of action: Status Quo, FEFO Transfer, New PO, and Local Disposal.'
      },
      {
        stage: 'EVALUATE',
        summary: 'Compared financial cost, arrival deadlines, and shelf life. FEFO transfer satisfies both availability and waste mitigation goals.'
      },
      {
        stage: 'ACT',
        summary: 'Prepared SAP-compatible transfer proposal STP-NASENT-0001 in PENDING_APPROVAL status.'
      },
      {
        stage: 'VERIFY',
        summary: 'Simulated post-transfer state: WH-A retains 300 units (100 demand + 200 buffer), WH-B receives 700 units, mitigating stockout.'
      },
      {
        stage: 'ESCALATE_OR_CLOSE',
        summary: 'Routed proposal to Distribution Center Planner approval queue with deterministic safety guardrails.'
      }
    ],
    dataLimitations: [
      'Simulated pilot scenario based on synthetic warehouse telemetry and static 5-day demand forecasts.',
      'Transit route assumes normal highway transit conditions between Cikarang and Bandung without unexpected road closures.',
      'Temperature monitoring inside refrigerated reefer assumes continuous 2°C–4°C cold-chain integrity.'
    ],
    toolActivity: [
      { name: 'get_inventory(SKU-MILK-001, WH-A)', status: 'COMPLETED', detail: '1,000 units total (1,000 available, 0 blocked)' },
      { name: 'get_demand_forecast(SKU-MILK-001, WH-A)', status: 'COMPLETED', detail: '100 units 5-day forecast' },
      { name: 'get_inventory(SKU-MILK-001, WH-B)', status: 'COMPLETED', detail: '150 units available (100 quarantined)' },
      { name: 'get_demand_forecast(SKU-MILK-001, WH-B)', status: 'COMPLETED', detail: '700 units 5-day forecast (stockout risk: HIGH)' },
      { name: 'validate_fefo(SKU-MILK-001, BATCH-042, WH-A, WH-B, 700)', status: 'COMPLETED', detail: 'Valid: 2d transit, 2d post-arrival shelf life, IDR 350,000' },
      { name: 'evaluate_alternatives(FEFO, PO, DoNothing)', status: 'COMPLETED', detail: 'FEFO transfer ranked #1 (optimal feasibility and lowest cost)' }
    ]
  };

  return response;
}
