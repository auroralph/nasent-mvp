import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import {
  store,
  getInventory,
  getBatches,
  getDemandForecast,
  validateFEFO,
  createTransferProposal,
  writeAuditLog
} from './src/server/fefoEngine';
import { runAgentAnalysis } from './src/server/geminiService';
import {
  INITIAL_PRODUCTS,
  INITIAL_WAREHOUSES,
  INITIAL_TRANSFER_ROUTES,
  INITIAL_PURCHASE_ORDERS
} from './src/data/mockData';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API ROUTES

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'Nasent Supply-Chain Agent' });
  });

  // GET /api/scenario - High level overview of the fixed supply-chain scenario
  app.get('/api/scenario', (req, res) => {
    res.json({
      scenario_name: 'FEFO Perishable Redistribution Pilot',
      region: 'Indonesia (West Java Core to Highlands)',
      primaryProduct: INITIAL_PRODUCTS[0],
      products: INITIAL_PRODUCTS,
      warehouses: INITIAL_WAREHOUSES,
      routes: INITIAL_TRANSFER_ROUTES,
      purchaseOrders: INITIAL_PURCHASE_ORDERS,
      sourceWarehouse: 'WH-A',
      destinationWarehouse: 'WH-B',
      primaryBatch: 'BATCH-042',
      scenarioSummary:
        'Warehouse A (Cikarang) has 1,000 units of Fresh Milk (BATCH-042) expiring in 4 days with only 100 units local demand. Warehouse B (Bandung) faces a projected stockout of 700 units in 5 days with only 150 units on hand.'
    });
  });

  // GET /api/exceptions - Return exception queue
  app.get('/api/exceptions', (req, res) => {
    res.json({
      exceptions: store.exceptions,
      count: store.exceptions.length,
      highPriorityCount: store.exceptions.filter((e) => e.severity === 'HIGH').length
    });
  });

  // GET /api/inventory - Inventory summary by warehouse
  app.get('/api/inventory', (req, res) => {
    const sku = (req.query.sku_id as string) || 'SKU-MILK-001';
    const whA = getInventory(sku, 'WH-A');
    const whB = getInventory(sku, 'WH-B');
    const whC = getInventory(sku, 'WH-C');

    res.json({
      sku_id: sku,
      warehouses: [whA, whB, whC]
    });
  });

  // GET /api/batches - Batches list with FEFO ordering
  app.get('/api/batches', (req, res) => {
    const sku = req.query.sku_id as string | undefined;
    const wh = req.query.warehouse_id as string | undefined;
    const batches = getBatches(sku, wh);
    res.json({ batches });
  });

  // GET /api/demand - Demand forecasts
  app.get('/api/demand', (req, res) => {
    res.json({ forecasts: store.demands });
  });

  // POST /api/analyze - Run agentic analysis
  app.post('/api/analyze', async (req, res) => {
    try {
      const { exception_id, force_demo_mode } = req.body;
      const targetExceptionId = exception_id || 'EXP-2026-001';

      writeAuditLog(
        targetExceptionId,
        'OBSERVE',
        'Distribution Center Planner requested automated FEFO redistribution analysis.',
        'USER_PLANNER'
      );

      const analysis = await runAgentAnalysis(targetExceptionId, Boolean(force_demo_mode));

      // Update exception status to ANALYZED
      const exception = store.exceptions.find((e) => e.exception_id === targetExceptionId);
      if (exception && exception.status === 'DETECTED') {
        exception.status = 'ACTION_PROPOSED';
      }

      res.json(analysis);
    } catch (err: any) {
      console.error('Analysis error:', err);
      res.status(500).json({
        error: 'Failed to complete agent analysis',
        message: err.message
      });
    }
  });

  // POST /api/transfer-proposals - Create or validate FEFO transfer proposal
  app.post('/api/transfer-proposals', (req, res) => {
    try {
      const { sku_id, batch_id, source_warehouse, destination_warehouse, quantity, reason } = req.body;

      if (!sku_id || !batch_id || !source_warehouse || !destination_warehouse || !quantity) {
        return res.status(400).json({ error: 'Missing required transfer proposal fields' });
      }

      // Run deterministic FEFO validation
      const validation = validateFEFO(sku_id, batch_id, source_warehouse, destination_warehouse, quantity);
      if (!validation.valid) {
        return res.status(422).json({
          error: 'FEFO Validation Failed',
          reason: validation.reason
        });
      }

      const proposal = createTransferProposal(
        sku_id,
        batch_id,
        source_warehouse,
        destination_warehouse,
        quantity,
        reason || 'FEFO expiry-risk mitigation & stockout prevention',
        validation.transferCost
      );

      res.json({
        proposal,
        validation,
        sapMockResponse: {
          proposalId: proposal.proposal_id,
          status: proposal.status,
          integration: 'SAP-compatible mock OData API',
          message: 'SAP-compatible transfer proposal created. This prototype simulates the integration boundary. A production version would connect the action to SAP BTP and SAP S/4HANA/EWM services.'
        }
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // POST /api/approvals - Human approval of proposed action
  app.post('/api/approvals', (req, res) => {
    try {
      const { proposal_id, decision, actor, notes } = req.body;

      if (!proposal_id || !decision) {
        return res.status(400).json({ error: 'Proposal ID and decision (APPROVED | REJECTED | ESCALATED) are required.' });
      }

      let proposal = store.proposals.find((p) => p.proposal_id === proposal_id);
      if (!proposal) {
        // If not in proposals yet, create standard one from primary scenario
        proposal = createTransferProposal(
          'SKU-MILK-001',
          'BATCH-042',
          'WH-A',
          'WH-B',
          700,
          'FEFO expiry-risk mitigation',
          350000
        );
      }

      const planner = actor || 'DC_PLANNER_USER';

      if (decision === 'APPROVED') {
        proposal.status = 'PENDING_EXECUTION';
        proposal.approved_by = planner;
        proposal.approved_at = new Date().toISOString();

        writeAuditLog(
          'EXP-2026-001',
          'ACT',
          `Human Planner (${planner}) APPROVED proposal ${proposal_id}: Transfer 700 units of BATCH-042 from WH-A to WH-B. Sent to mock SAP OData endpoint.`,
          planner
        );

        writeAuditLog(
          'EXP-2026-001',
          'VERIFY',
          'Post-approval state verified: Projected stockout resolved, avoided loss estimated at IDR 4,200,000.',
          'NASENT_AGENT'
        );

        writeAuditLog(
          'EXP-2026-001',
          'ESCALATE_OR_CLOSE',
          'Exception EXP-2026-001 marked RESOLVED upon dispatch of transfer proposal.',
          'NASENT_AGENT'
        );

        const exp = store.exceptions.find((e) => e.exception_id === 'EXP-2026-001');
        if (exp) exp.status = 'APPROVED';

        return res.json({
          success: true,
          status: 'PENDING_EXECUTION',
          proposal,
          sapMockResponse: {
            proposalId: proposal.proposal_id,
            status: 'PENDING_EXECUTION',
            integration: 'SAP-compatible mock OData API',
            message:
              'SAP-compatible transfer proposal created. This prototype simulates the integration boundary. A production version would connect the action to SAP BTP and SAP S/4HANA/EWM services.',
            timestamp: new Date().toISOString()
          }
        });
      } else if (decision === 'REJECTED') {
        proposal.status = 'REJECTED';
        writeAuditLog(
          'EXP-2026-001',
          'ESCALATE_OR_CLOSE',
          `Human Planner (${planner}) REJECTED proposal ${proposal_id}. Reason: ${notes || 'Planner override'}`,
          planner
        );
        const exp = store.exceptions.find((e) => e.exception_id === 'EXP-2026-001');
        if (exp) exp.status = 'REJECTED';

        return res.json({ success: true, status: 'REJECTED', proposal });
      } else {
        writeAuditLog(
          'EXP-2026-001',
          'ESCALATE_OR_CLOSE',
          `Human Planner (${planner}) ESCALATED exception to Central Logistics Director.`,
          planner
        );
        return res.json({ success: true, status: 'ESCALATED', proposal });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // POST /api/mock-sap/stock-transfer-proposals - Explicit SAP OData mock API
  app.post('/api/mock-sap/stock-transfer-proposals', (req, res) => {
    const { material, batch, sourceWarehouse, destinationWarehouse, quantity, reason } = req.body;

    const proposalId = `STP-NASENT-${Date.now().toString().slice(-4)}`;

    res.json({
      proposalId,
      status: 'PENDING_EXECUTION',
      material: material || 'SKU-MILK-001',
      batch: batch || 'BATCH-042',
      sourceWarehouse: sourceWarehouse || 'WH-A',
      destinationWarehouse: destinationWarehouse || 'WH-B',
      quantity: quantity || 700,
      reason: reason || 'FEFO expiry-risk mitigation',
      integration: 'SAP-compatible mock OData API',
      message: 'Proposal created for demonstration only. No physical inventory was moved.',
      timestamp: new Date().toISOString()
    });
  });

  // GET /api/audit-logs - Return immutable audit trail
  app.get('/api/audit-logs', (req, res) => {
    res.json({
      logs: store.auditLogs,
      count: store.auditLogs.length
    });
  });

  // POST /api/reset-demo - Reset state back to initial state for judges demo
  app.post('/api/reset-demo', (req, res) => {
    store.reset();
    res.json({ success: true, message: 'Demo state reset successfully to baseline scenario.' });
  });

  // Vite middleware in dev / Static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Nasent FEFO Intelligence Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
