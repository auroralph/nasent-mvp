import {
  Product,
  Warehouse,
  InventoryBatch,
  DemandForecast,
  TransferRoute,
  PurchaseOrder,
  SupplyChainException,
  AuditLog
} from '../types';

export const SCENARIO_DATE = '2026-09-10';

export const INITIAL_PRODUCTS: Product[] = [
  {
    sku_id: 'SKU-MILK-001',
    product_name: 'Fresh Milk 1L (Pasteurized)',
    category: 'Perishable Dairy',
    unit_value: 24000, // IDR 24,000
    shelf_life_days: 14
  },
  {
    sku_id: 'SKU-YOGURT-002',
    product_name: 'Greek Yogurt 500g',
    category: 'Perishable Dairy',
    unit_value: 38000,
    shelf_life_days: 21
  },
  {
    sku_id: 'SKU-CHEESE-003',
    product_name: 'Natural Cheddar Block 250g',
    category: 'Chilled Dairy',
    unit_value: 45000,
    shelf_life_days: 60
  }
];

export const INITIAL_WAREHOUSES: Warehouse[] = [
  {
    warehouse_id: 'WH-A',
    warehouse_name: 'Warehouse A (Cikarang Central DC)',
    city: 'Cikarang / Bekasi',
    region: 'West Java Core',
    capacity: 50000
  },
  {
    warehouse_id: 'WH-B',
    warehouse_name: 'Warehouse B (Bandung Regional DC)',
    city: 'Bandung',
    region: 'West Java Highlands',
    capacity: 30000
  },
  {
    warehouse_id: 'WH-C',
    warehouse_name: 'Warehouse C (Surabaya East DC)',
    city: 'Surabaya',
    region: 'East Java',
    capacity: 45000
  }
];

export const INITIAL_BATCHES: InventoryBatch[] = [
  // PRIMARY SCENARIO BATCH: WH-A has 1,000 units expiring in 4 days with low local demand (100)
  {
    batch_id: 'BATCH-042',
    sku_id: 'SKU-MILK-001',
    warehouse_id: 'WH-A',
    quantity: 1000,
    received_date: '2026-08-31',
    expiry_date: '2026-09-14', // 4 days from scenario date
    status: 'AVAILABLE',
    temperature_status: 'OPTIMAL',
    days_to_expiry: 4,
    fefo_rank: 1
  },
  // Secondary fresh batch at WH-A
  {
    batch_id: 'BATCH-088',
    sku_id: 'SKU-MILK-001',
    warehouse_id: 'WH-A',
    quantity: 500,
    received_date: '2026-09-08',
    expiry_date: '2026-09-22', // 12 days from scenario date
    status: 'AVAILABLE',
    temperature_status: 'OPTIMAL',
    days_to_expiry: 12,
    fefo_rank: 2
  },
  // Quality blocked stock at WH-A (MUST BE EXCLUDED BY FEFO)
  {
    batch_id: 'BATCH-BLK-09',
    sku_id: 'SKU-MILK-001',
    warehouse_id: 'WH-A',
    quantity: 200,
    received_date: '2026-09-02',
    expiry_date: '2026-09-16',
    status: 'BLOCKED',
    temperature_status: 'WARNING',
    days_to_expiry: 6,
    fefo_rank: undefined
  },
  // PRIMARY SCENARIO DESTINATION: WH-B has only 150 units expiring in 2 days, demand is 700!
  {
    batch_id: 'BATCH-019',
    sku_id: 'SKU-MILK-001',
    warehouse_id: 'WH-B',
    quantity: 150,
    received_date: '2026-08-29',
    expiry_date: '2026-09-12', // 2 days from scenario date
    status: 'AVAILABLE',
    temperature_status: 'OPTIMAL',
    days_to_expiry: 2,
    fefo_rank: 1
  },
  // Quarantined stock at WH-B (MUST BE EXCLUDED)
  {
    batch_id: 'BATCH-QUAR-03',
    sku_id: 'SKU-MILK-001',
    warehouse_id: 'WH-B',
    quantity: 100,
    received_date: '2026-09-01',
    expiry_date: '2026-09-18',
    status: 'QUARANTINED',
    temperature_status: 'EXCURSION',
    days_to_expiry: 8,
    fefo_rank: undefined
  },
  // Expired stock at WH-C
  {
    batch_id: 'BATCH-EXP-01',
    sku_id: 'SKU-MILK-001',
    warehouse_id: 'WH-C',
    quantity: 80,
    received_date: '2026-08-20',
    expiry_date: '2026-09-09',
    status: 'EXPIRED',
    temperature_status: 'OPTIMAL',
    days_to_expiry: -1,
    fefo_rank: undefined
  }
];

export const INITIAL_DEMAND_FORECASTS: DemandForecast[] = [
  {
    forecast_id: 'FC-WHA-MILK-01',
    sku_id: 'SKU-MILK-001',
    warehouse_id: 'WH-A',
    forecast_date: '2026-09-10 to 2026-09-15',
    expected_demand: 100,
    period_days: 5
  },
  {
    forecast_id: 'FC-WHB-MILK-01',
    sku_id: 'SKU-MILK-001',
    warehouse_id: 'WH-B',
    forecast_date: '2026-09-10 to 2026-09-15',
    expected_demand: 700,
    period_days: 5
  },
  {
    forecast_id: 'FC-WHC-MILK-01',
    sku_id: 'SKU-MILK-001',
    warehouse_id: 'WH-C',
    forecast_date: '2026-09-10 to 2026-09-15',
    expected_demand: 250,
    period_days: 5
  }
];

export const INITIAL_TRANSFER_ROUTES: TransferRoute[] = [
  {
    route_id: 'ROUTE-WHA-WHB-01',
    source_warehouse: 'WH-A',
    destination_warehouse: 'WH-B',
    transit_days: 2,
    transfer_cost: 350000, // IDR 350,000
    capacity: 800 // units
  },
  {
    route_id: 'ROUTE-WHC-WHB-01',
    source_warehouse: 'WH-C',
    destination_warehouse: 'WH-B',
    transit_days: 4,
    transfer_cost: 950000,
    capacity: 600
  }
];

export const INITIAL_PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    po_id: 'PO-GREENFIELD-901',
    sku_id: 'SKU-MILK-001',
    supplier_name: 'PT Greenfield Dairy Nusantara',
    quantity: 1000,
    expected_arrival_days: 8,
    expected_arrival_date: '2026-09-18',
    estimated_cost: 4000000, // IDR 4,000,000
    status: 'PLANNED'
  }
];

export const INITIAL_EXCEPTIONS: SupplyChainException[] = [
  {
    exception_id: 'EXP-2026-001',
    sku_id: 'SKU-MILK-001',
    product_name: 'Fresh Milk 1L (Pasteurized)',
    source_warehouse: 'WH-A',
    destination_warehouse: 'WH-B',
    exception_type: 'FEFO_EXPIRY_STOCKOUT_MISMATCH',
    severity: 'HIGH',
    status: 'DETECTED',
    created_at: '2026-09-10T07:15:00Z',
    days_to_expiry: 4,
    projected_stockout_days: 5
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    event_id: 'AUD-001',
    exception_id: 'EXP-2026-001',
    stage: 'OBSERVE',
    summary: 'Automated telemetry ingested inventory batch BATCH-042 at WH-A and forward demand forecast at WH-B.',
    actor: 'SYSTEM_SCHEDULER',
    timestamp: '2026-09-10T07:00:00Z'
  },
  {
    event_id: 'AUD-002',
    exception_id: 'EXP-2026-001',
    stage: 'DETECT',
    summary: 'Detected critical mismatch: WH-A batch BATCH-042 expires in 4 days with 900-unit local surplus; WH-B projected stockout of 550 units in 5 days.',
    actor: 'NASENT_AGENT',
    timestamp: '2026-09-10T07:15:00Z'
  }
];
