<<<<<<< HEAD
# Nasent: Agentic Cold-Chain Intelligence for FEFO Redistribution

> **Prevent expiry. Protect availability.**

“Nasent prevents perishable products from being wasted in one warehouse while another warehouse runs out of stock. It detects the problem, compares possible actions, and recommends moving the right batch to the right warehouse before expiry or stockout occurs.”

---

## 1. Project Overview

Nasent is an Agentic Cold-Chain Intelligence MVP addressing a critical multi-echelon supply-chain challenge in perishable goods distribution:
**Warehouse A (Cikarang Central DC)** holds 1,000 units of Fresh Milk 1L (`SKU-MILK-001`, `BATCH-042`) expiring in 4 days with local 5-day demand of only 100 units (900 units surplus at imminent risk of spoilage). Simultaneously, **Warehouse B (Bandung Regional DC)** faces a projected demand-driven stockout of 700 units in 5 days with only 150 units on hand.

Nasent executes an 8-stage agentic workflow (**OBSERVE → DETECT → INVESTIGATE → PLAN → EVALUATE → ACT → VERIFY → ESCALATE/CLOSE**) backed by deterministic FEFO rules and supervisory human-in-the-loop approval before dispatching an SAP-compatible Stock Transfer Proposal.

---

## 2. Architecture: Current Prototype vs. Target Enterprise Cloud

### Prototype vs. Target Boundary Statement
> “Current prototype: Gemini-based agentic workflow with synthetic data and SAP-compatible mock actions. Target production architecture: Amazon Bedrock Agents, AWS tools, SAP BTP API Management, and SAP OData/SAP EWM integration.”

```
[Synthetic Data / Seed Telemetry]
              ↓
  [Nasent Web Control Tower] (Deployed on AWS Amplify Hosting)
              ↓
     [Server-Side Agent API] (/api/analyze)
              ↓
[Gemini 3.8-Flash Prototype] ➔ [Target: Amazon Bedrock Agents]
              ↓
[Deterministic FEFO Supply-Chain Engine] (Target: AWS Lambda Functions)
              ↓
[Mandatory Human Approval Gate] (Zero unauthorized ERP mutations)
              ↓
[SAP-Compatible Transfer Proposal] (Mock OData Payload STP-NASENT-0001)
              ↓
[Future Target: SAP BTP / SAP S/4HANA / SAP EWM]
```

---

## 3. Local Setup Instructions

1. **Clone repository**:
   ```bash
   git clone <repository-url>
   cd nasent
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Copy environment configuration**:
   ```bash
   cp .env.example .env.local
   ```
4. **Add Google Gemini API Key in `.env.local`**:
   ```env
   GEMINI_API_KEY="AQ.YOUR_GEMINI_API_KEY"
   GOOGLE_GENERATIVE_AI_API_KEY="AQ.YOUR_GEMINI_API_KEY"
   ```
   *Note: If the key is missing or expires, Nasent automatically activates Demo Mode with deterministic reasoning.*
5. **Start development server**:
   ```bash
   npm run dev
   ```
6. **Open in browser**:
   Navigate to `http://localhost:3000`.

---

## 4. Deployment Instructions for AWS Amplify Hosting

1. **Push Code to Repository** (GitHub, GitLab, or AWS CodeCommit).
2. **Connect to AWS Amplify**:
   - Open the AWS Amplify Console.
   - Click **Deploy an app** and connect your repository.
3. **Build Settings (`amplify.yml`)**:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: dist
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```
4. **Environment Variables in Amplify Console**:
   - Under **App Settings > Environment Variables**, add:
     - `GEMINI_API_KEY`: `Your GEMINI API KEY`
     - `NODE_ENV`: `production`
5. **Security Warning**:
   Never check secret keys into Git repositories or client-side environment files (`NEXT_PUBLIC_` or `VITE_`). All AI reasoning and ERP mock endpoints run strictly server-side.

---

## 5. Judge & Evaluator Demo Script (10 Steps)

1. **Open Exception Queue**: View the flagged mismatch on `SKU-MILK-001` between WH-A and WH-B.
2. **Select High-Priority Exception**: Notice WH-A has 4 days to expiry; WH-B projected stockout is 5 days.
3. **Click "Analyze with Nasent"**: Initiates the agent pipeline.
4. **Observe the 8-Stage Workflow**: Trace `OBSERVE`, `DETECT`, `INVESTIGATE`, `PLAN`, `EVALUATE`, `ACT`, `VERIFY`, and `ESCALATE/CLOSE`.
5. **Examine Deterministic Tool Trace**: Confirm tools verified batch status, shelf-life, and route capacity.
6. **Compare Alternatives**: Notice FEFO transfer (IDR 350,000, 2-day lead time) compared against supplier purchase order (IDR 4,000,000, 8 days lead time, arriving after stockout).
7. **Inspect FEFO Recommendation**: Recommends transferring 700 units of `BATCH-042` from WH-A to WH-B.
8. **Approve the Transfer**: Click **Approve FEFO Transfer** in the supervisory approval panel.
9. **Inspect Mock SAP Proposal**: Review the generated SAP-compatible proposal `STP-NASENT-0001` with `PENDING_EXECUTION` status.
10. **Review Audit Trail & Impact Metrics**: Examine the immutable audit log and the Before/After impact metrics (78% at-risk stock reduction, IDR 4.2M net saved value).

---

## 6. Simulated Pilot Targets vs. Results

*All values represent simulated demonstration scenario benchmarks:*
- **Avoidable expired-inventory value**: 10–20% reduction target (Achieved: 78% in scenario).
- **Stockout incidents**: 15–25% reduction target (Stockout eliminated).
- **Order-fill service level**: 5–10 percentage-point improvement target.
- **Manual investigation time**: 50–70% reduction target (Reduced from ~2 hours to < 5 minutes).
- **Recommendation precision**: ≥ 85% in controlled test runs.
- **Unauthorized critical transactions**: 0 (Guaranteed via mandatory human approval gate).

---

## 7. Known Limitations & Scope Boundaries

- **Focused MVP Scope**: Focuses strictly on FEFO redistribution between dual warehouses. Does not include autonomous procurement, physical warehouse robotics, or live GPS telematic trackers.
- **Simulated Integration**: SAP OData and Amazon Bedrock integration boundaries are modeled through strict OpenAPI-compliant contracts.
- **Static Excursion Thresholds**: Assumes refrigerated reefer trucks maintain nominal 2°C–4°C temperature range during transit.
=======
# nasent-mvp
>>>>>>> 6ff5f178d11eacf67bda1c33ab340af6fe76152c
