export type BatchStatus = 'AVAILABLE' | 'BLOCKED' | 'QUARANTINED' | 'EXPIRED';
export type TemperatureStatus = 'OPTIMAL' | 'WARNING' | 'EXCURSION';
export type ExceptionSeverity = 'HIGH' | 'MEDIUM' | 'LOW';
export type ExceptionStatus = 'DETECTED' | 'ANALYZED' | 'ACTION_PROPOSED' | 'APPROVED' | 'REJECTED' | 'RESOLVED';
export type ProposalStatus = 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'PENDING_EXECUTION';
export type WorkflowStage = 'OBSERVE' | 'DETECT' | 'INVESTIGATE' | 'PLAN' | 'EVALUATE' | 'ACT' | 'VERIFY' | 'ESCALATE_OR_CLOSE';

export interface Product {
  sku_id: string;
  product_name: string;
  category: string;
  unit_value: number; // in IDR
  shelf_life_days: number;
}

export interface Warehouse {
  warehouse_id: string;
  warehouse_name: string;
  city: string;
  region: string;
  capacity: number;
}

export interface InventoryBatch {
  batch_id: string;
  sku_id: string;
  warehouse_id: string;
  quantity: number;
  received_date: string;
  expiry_date: string;
  status: BatchStatus;
  temperature_status: TemperatureStatus;
  days_to_expiry?: number;
  fefo_rank?: number;
}

export interface DemandForecast {
  forecast_id: string;
  sku_id: string;
  warehouse_id: string;
  forecast_date: string;
  expected_demand: number;
  period_days: number;
}

export interface TransferRoute {
  route_id: string;
  source_warehouse: string;
  destination_warehouse: string;
  transit_days: number;
  transfer_cost: number; // in IDR
  capacity: number;
}

export interface PurchaseOrder {
  po_id: string;
  sku_id: string;
  supplier_name: string;
  quantity: number;
  expected_arrival_days: number;
  expected_arrival_date: string;
  estimated_cost: number; // in IDR
  status: 'ORDERED' | 'IN_TRANSIT' | 'PLANNED';
}

export interface SupplyChainException {
  exception_id: string;
  sku_id: string;
  source_warehouse: string;
  destination_warehouse: string;
  exception_type: string;
  severity: ExceptionSeverity;
  status: ExceptionStatus;
  created_at: string;
  days_to_expiry: number;
  projected_stockout_days: number;
  product_name?: string;
}

export interface TransferProposal {
  proposal_id: string;
  sku_id: string;
  batch_id: string;
  source_warehouse: string;
  destination_warehouse: string;
  quantity: number;
  reason: string;
  status: ProposalStatus;
  estimated_cost: number;
  created_at: string;
  approved_by?: string;
  approved_at?: string;
}

export interface AuditLog {
  event_id: string;
  exception_id: string;
  stage: WorkflowStage;
  summary: string;
  actor: string;
  timestamp: string;
}

export interface AgentCalculation {
  metric: string;
  value: string;
  meaning: string;
}

export interface AgentAlternative {
  action: string;
  cost: string;
  leadTime: string;
  risk: string;
  pros: string[];
  cons: string[];
}

export interface DecisionTraceStep {
  stage: WorkflowStage;
  summary: string;
}

export interface AgentAnalysisResponse {
  exceptionSummary: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  observedFacts: string[];
  calculations: AgentCalculation[];
  alternatives: AgentAlternative[];
  selectedAction: {
    action: string;
    reason: string;
    transferDetails?: {
      sku_id: string;
      batch_id: string;
      source_warehouse: string;
      destination_warehouse: string;
      quantity: number;
      transfer_cost: number;
      transit_days: number;
    };
  };
  approvalRequired: boolean;
  approvalReason: string;
  expectedImpact: {
    expiryRisk: string;
    stockoutRisk: string;
    estimatedAvoidedLoss: string;
    decisionTime: string;
  };
  decisionTrace: DecisionTraceStep[];
  dataLimitations: string[];
  isDemoMode?: boolean;
  demoModeBanner?: string;
  toolActivity?: {
    name: string;
    status: 'COMPLETED' | 'PENDING';
    detail: string;
  }[];
}

export interface MockSapProposalResponse {
  proposalId: string;
  status: string;
  material: string;
  batch: string;
  sourceWarehouse: string;
  destinationWarehouse: string;
  quantity: number;
  reason: string;
  integration: string;
  message: string;
  timestamp: string;
}
