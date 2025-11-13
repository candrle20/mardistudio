Mardi Studio Pro — System Architecture Design (v0.1)

Last updated: Nov 3, 2025

0. Executive Summary

Mardi Studio Pro is a vertical creative-AI platform for luxury wedding stationery. It provides: (1) AI models fine‑tuned on individual artists’ styles; (2) a professional, browser-based layout editor; (3) automated prepress and premium print fulfillment; and (4) an artist monetization & licensing layer.

This document specifies the high‑level architecture, runtime components, data flows, and non‑functional requirements.

⸻

1. High-Level Architecture

[ Client (Web) ]
   |  HTTPS (GraphQL/REST, WebSocket)
   v
[ API Gateway ] ——→ [Auth Service] ——→ [Identity & RBAC]
   |                    |
   |                    └→ [Stripe Connect]
   |
   ├→ [Design Studio Service] ——→ [Asset Store (S3/GCS)]
   |          |                     |
   |          ├→ [Template & Layout Engine]
   |          └→ [Preflight Validator]
   |
   ├→ [AI Inference Service] ——→ [Model Registry] ——→ [Model Store]
   |          |                         |
   |          └→ [GPU Inference Pool]   └→ [Feature/Prompt Store]
   |
   ├→ [AI Training Orchestrator] ——→ [Training Workers (GPU)]
   |          |                                  |
   |          └→ [Dataset Curation] ———→ [Vector DB (embeddings)]
   |
   ├→ [Order Management] ——→ [Print Router] ——→ [Print Partners]
   |          |                    |                  |
   |          └→ [Shipping & Tracking]  ←——— Webhooks ┘
   |
   ├→ [Payments & Billing] (Stripe) —→ [Royalty Splitter]
   |
   ├→ [Notifications] (Email/SMS/Push)
   |
   └→ [Analytics & Events] ——→ [Data Lake / Warehouse] ——→ [BI]

Infra: CDN (edge), WAF, Kubernetes, Service Mesh, Secrets Manager, Observability (logs, traces, metrics).


⸻

2. Core Services

2.1 API Gateway & Edge
	•	Responsibilities: request routing, rate limiting, JWT verification, versioning, CORS, WAF.
	•	Tech: Cloud CDN, API Gateway or NGINX Ingress + Kong/Envoy; Cloud Armor/WAF.
	•	Protocols: REST for transactional endpoints; GraphQL for UI aggregation; WebSocket for job status.

2.2 Auth & RBAC
	•	Identity: Users (brides/couples), Planners, Artists, Admins.
	•	AuthN: OIDC (Clerk/Auth0/Supabase). MFA for Artists/Admins.
	•	AuthZ: Role- and tenant-based (per-artist model isolation). Resource-level policies via OPA.
	•	Commerce: Stripe Connect (platform + artist payouts).

2.3 Design Studio Service
	•	Canvas/Editor: React-based editor (Fabric.js/Konva/WebGL). Layout constraints (bleed, trim, safe zones).
	•	Template Engine: JSON schemas define suite items (invite, RSVP, menu, signage) with typographic scales, grids, and lockable regions.
	•	AI Assist: layout suggestions, palette harmonization, adaptive typography.
	•	Preflight: CMYK gamut check, font embedding, overprint/spot-color flags, min line/foil thickness checks, PDF/X-1a compliance.
	•	Outputs: Layered PSD/SVG for editing; PDF/X-1a with 0.125” bleed for print; optional vector plates for foil/letterpress.

2.4 AI Inference Service
	•	Models: SDXL/Flux base + artist‑specific LoRA adapters; ControlNet/conditioning for layout.
	•	Runtime: GPU pool (A10/A100/L4), autoscaling; batched inference; deterministic seeds for reproducibility.
	•	API: /generate (prompt + layout mask + style adapter) → layered render; /variations; /upscale; /vectorize-mask.
	•	Content Safety: prompt sanitization; rate caps; artist IP constraints (no cross‑artist mixing unless allowed).

2.5 AI Training Orchestrator
	•	Data Intake: artist uploads (300–500 hi‑res scans), consent/license capture, EXIF/ICC validation.
	•	Curation: deduplication, quality scoring, metadata tagging (motif, medium, palette), background removal when needed.
	•	Training: LoRA/adapter fine‑tuning; hyperparam sweeps; early stopping; automated eval set.
	•	Registry: versioned models with metrics (FID/CLIP score + subjective panel scores), immutable digests, rollback.
	•	IP & Isolation: per‑artist buckets, KMS-encrypted; models/weights never shared across tenants without explicit opt‑in.

2.6 Order Management & Print Router
	•	Catalog: paper stocks (cotton 300–400gsm), finishes (foil, letterpress, emboss), envelopes, deckled edges.
	•	Pricing: BOM + markup; live cost estimator (inc. estimated postage).
	•	Routing: rules by geography, capability (foil/letterpress), SLA, and historical defect rate.
	•	Integrations: Gelato/Thikit/Mama Sauce APIs; webhook listeners for job status.
	•	Ship/Track: carriers (UPS/USPS/DHL), label creation, tracking events → Notifications.

2.7 Payments & Royalty Splitter
	•	Checkout: Stripe (PaymentIntent); tax/VAT handling.
	•	Revenue Share: per‑order split to artist(s) (Connect Transfers), with statements and dispute workflow.
	•	Subscriptions: Planner/Studio plans; seat management; usage quotas (inference minutes).

2.8 Notifications
	•	Transactional emails (proof ready, print approved, shipped), SMS optional; in‑app inbox.

2.9 Analytics
	•	Event Bus: Kafka/PubSub topics for design events, inference jobs, orders, print statuses.
	•	Warehouse: BigQuery/Snowflake; dbt models; dashboards (Looker/Metabase).
	•	KPIs: design→purchase conversion, AOV, print defect rate, artist earnings, GPU cost/inference.

⸻

3. Data Stores
	•	PostgreSQL: users, orgs/tenants, projects, orders, pricing, royalties, audit logs.
	•	Object Storage (S3/GCS): uploads, generated assets, PDFs, model weights; versioned; lifecycle policies.
	•	Redis: job queues, session cache, rate limits, WebSocket presence.
	•	Vector DB (pgvector/Weaviate): embeddings for motif search and style retrieval.
	•	Model Store: artifact registry (Weights, LoRA adapters, tokenizer configs) with checksums; encryption at rest (KMS).
	•	Data Lake: raw events, render metrics, cost logs, print QC images.

⸻

4. Key Data Flows (Sequence Sketches)

4.1 Bride: “Create & Order Suite”
	1.	User selects style → enters wedding details.
	2.	Client calls GenerateSuite (GraphQL): passes layout schema + palette + style adapter id.
	3.	Inference service generates layered comps; returns preview URLs.
	4.	User edits in editor; saves design → assets persisted to S3; metadata in Postgres.
	5.	User requests proof; preflight runs → PDF/X produced → soft proof generated.
	6.	Checkout: payment → order created; print router selects partner; assets + job ticket sent.
	7.	Webhook status updates → notifications; tracking added to order.

4.2 Artist: “Upload & Train Model”
	1.	Artist uploads scans (CMYK, 300–600 DPI) with consent/license.
	2.	Curation pipeline tags, dedups, validates ICC profiles.
	3.	Training orchestrator spins a GPU job; logs metrics; registers artist-model:vX.
	4.	QA review (human-in-the-loop) approves model for marketplace; royalty terms applied.

4.3 Planner: “Workspace & Proofs”
	1.	Planner creates client workspace; invites collaborators.
	2.	Edits templates; shares secure proof link (expiring URL).
	3.	Client approves; planner chooses print config; proceeds to payment or client paylink.

⸻

5. Non‑Functional Requirements
	•	Security:
	•	Tenant isolation; all assets & models encrypted (KMS).
	•	Signed URLs for asset access; short TTL.
	•	Audit logs for model access, exports, and order changes.
	•	Privacy & IP:
	•	Per‑artist opt‑in/out for model discoverability.
	•	No cross‑pollination of weights unless explicit collab license.
	•	Content moderation for prompts; brand‑safety filters.
	•	Reliability & Scale:
	•	99.9% API uptime goals; blue/green deploys; canary on GPU pool.
	•	Autoscaling inference/train clusters; queue backpressure.
	•	Performance:
	•	P95 suite preview < 8s on L4/A10; PDF export < 20s.
	•	Observability:
	•	Tracing (OpenTelemetry), metrics (Prometheus), logs (ELK/Grafana), GPU utilization.

⸻

6. API Surface (Illustrative)
	•	POST /v1/auth/login
	•	POST /v1/models/{artistId}/train
	•	POST /v1/generate  (styleAdapterId, layoutSchema, seed)
	•	POST /v1/renders/{id}/preflight
	•	POST /v1/orders  (printConfig)
	•	POST /v1/orders/{id}/approve
	•	POST /v1/royalties/payout
	•	GET  /v1/prints/webhook

GraphQL (UI): GenerateSuite, SaveDesign, GetProof, CreateOrder, GetOrderStatus.

⸻

7. Schema Highlights (ERD Sketch)

User (id, role, org_id, …)
Org  (id, type[b2c,planner,artist])
Artist (id, org_id, payout_account_id)
Model (id, artist_id, version, status, checksum, license)
Asset (id, project_id, type[scan,render,pdf], url, icc_profile)
Project (id, user_id, model_id, style_id, status)
Order (id, project_id, price, status, print_partner_id)
OrderItem (id, order_id, sku, qty, config)
Royalty (id, order_id, artist_id, amount, status)
Event (id, type, payload, ts)


⸻

8. Deployment & DevOps
	•	Kubernetes (GKE/EKS/AKS); separate node pools for GPU/CPU.
	•	CI/CD: GitHub Actions; IaC via Terraform; image registry; SBOM & supply‑chain scanning.
	•	Secrets: cloud KMS + Secret Manager; short‑lived creds (IAM).
	•	Backups: PITR for Postgres; versioned buckets; disaster recovery runbooks.

⸻

9. Print Quality & Prepress Specifications
	•	Color: CMYK with ICC profiles (FOGRA39/GRACoL). Spot colors for foil plates.
	•	Resolution: 300–600 DPI minimal; vector text/line art preferred.
	•	Bleed/Trim: 0.125” bleed; min foil line 0.4pt; min letterpress stroke 0.3mm.
	•	Fonts: embedded subsets; license tracking per project.
	•	Proofing: soft proof with paper texture simulation; hard proof optional.

⸻

10. Security & Compliance
	•	PII: minimal retention; DSGVO/GDPR-ready; user deletion workflows.
	•	Payments: PCI via Stripe; no card storage on platform.
	•	Audit: immutable logs for access to models/assets.

⸻

11. Risks & Mitigations
	•	Model leakage / IP misuse: per‑tenant encryption, signed adapters, watermarking, legal agreements.
	•	Print defects: rigorous preflight + vendor QC loop; defect scoring feeds router.
	•	GPU costs: caching, batching, guidance distillation, cheaper L4 for previews, A100 for batch HQ renders.
	•	Vendor lock‑in: abstraction layer for printers; feature flags per integration.

⸻

12. Roadmap Links (Build Order)
	1.	Editor + Preflight + Manual Print Handoff
	2.	Artist Upload → LoRA Training v1 → Model Registry
	3.	Inference API + Suite Generator
	4.	Stripe Connect + Royalty Splits + Orders
	5.	Print Router v1 (single partner) → v2 (multi‑partner)
	6.	Analytics + Planner Subscriptions

⸻

13. Appendix
	•	Style Prompt Schema (JSON) for reproducible suites
	•	Layout Mask Format (PNG/SVG) for ControlNet guidance
	•	Preflight Check Matrix (rules per finish/partner)
	•	SLOs & Alerts (runtime thresholds)

⸻

14. Sequence Diagrams

14.1 Bride — Create & Order Suite

sequenceDiagram
  autonumber
  actor Bride as Bride
  participant Web as Web App (Editor)
  participant API as API Gateway
  participant INF as AI Inference Service
  participant PRE as Preflight/Export
  participant ORD as Order Mgmt
  participant PAY as Payments (Stripe)
  participant PRN as Print Router/Partner

  Bride->>Web: Select style, enter details
  Web->>API: GenerateSuite(layout, palette, styleAdapterId)
  API->>INF: /generate (masked layout + LoRA)
  INF-->>API: Layered previews (URLs)
  API-->>Web: Preview refs
  Bride->>Web: Edit text/colors/layout
  Web->>PRE: Request soft proof
  PRE-->>Web: PDF soft proof + issues (if any)
  Bride->>Web: Approve proof
  Web->>PAY: Create PaymentIntent ($500 + print est.)
  PAY-->>Web: Client secret
  Bride->>PAY: Confirm payment
  PAY-->>API: Webhook payment_succeeded
  API->>ORD: Create order + BOM
  ORD->>PRN: Route job (capability, SLA)
  PRN-->>ORD: Job accepted + ETA
  ORD-->>Web: Order status + tracking
  PRN-->>ORD: Webhooks (in production → shipped)
  ORD-->>Web: Update timeline & tracking

14.2 Artist — Upload & Train Model

sequenceDiagram
  autonumber
  actor Artist
  participant Web as Artist Console
  participant API as API Gateway
  participant CUR as Curation Pipeline
  participant TRN as Training Orchestrator (GPU)
  participant REG as Model Registry
  participant QA as Human QA

  Artist->>Web: Upload scans (300–600 DPI, ICC)
  Web->>API: Register assets (metadata, license)
  API->>CUR: Run validation, dedupe, tagging
  CUR-->>API: Curated dataset summary
  API->>TRN: Start fine-tune (LoRA params)
  TRN-->>REG: model:vX artifacts + metrics
  REG-->>API: Version registered
  API->>QA: Review sample generations
  QA-->>API: Approve/Reject with notes
  API-->>Web: Model ready → publish collection

14.3 Planner — Workspace & Proofs

sequenceDiagram
  autonumber
  actor Planner
  participant Web as Web App (Planner)
  participant API as API Gateway
  participant INF as AI Inference
  participant PRE as Preflight/Export
  participant ORD as Order Mgmt

  Planner->>Web: Create client workspace
  Web->>API: CreateProject(clientId, modelId)
  Planner->>Web: Input client details
  Web->>API: GenerateSuite(...)
  API->>INF: /generate
  INF-->>API: Previews
  API-->>Web: Previews
  Planner->>Web: Edit + Save versions
  Web->>PRE: Generate proof PDF
  PRE-->>Web: Proof URL
  Planner->>Web: Share proof link
  Planner->>Web: Approve & configure print
  Web->>ORD: Create order (invoice or paylink)
  ORD-->>Web: Status updates


⸻

15. Investor One-Pager (Draft)

Company: Mardi Studio Pro
Tagline: Designed by artists. Perfected by AI.

Problem
Luxury wedding stationery is slow (weeks), expensive ($1.5k–$10k), and capacity‑constrained by human studios. Generic AI tools generate web art—not print-ready, not luxury.

Solution
A vertical creative-AI platform that trains artist‑specific models and outputs production‑ready, CMYK‑accurate wedding suites in minutes. Brides and planners design in a pro web editor; artists monetize their styles via royalties; printing is automated via premium partners.

Product
	•	AI style‑locked generator (artist LoRAs) → layout‑aware compositions.
	•	Pro editor (bleed/safe zones, typography, spot/foil plates).
	•	Prepress automation (PDF/X‑1a, ICC).
	•	Print router to boutique partners; tracking & QA.
	•	Artist console for dataset upload, training, collections, royalties.

Why Now
Diffusion models are good enough to capture watercolor/calligraphy textures; GPUs & LoRA make personalized models feasible. Couples demand bespoke aesthetics with faster turnaround.

Market
~2.1M U.S. weddings/year; stationery TAM ≈ $1.5B U.S. (mid + luxury). Global expansion to U.K./EU/ANZ. Initial wedge: high‑end wedding suites → expand to event stationery & boutique branding.

Business Model
$500 design fee + print margin, Planner SaaS ($99–$499/mo), 40% artist royalty share (platform cut). Projected 60%+ blended gross margin.

Traction (Planned Milestones)
	•	M0–M3: MVP, first paid brides, printer integration.
	•	M4–M6: 50+ paid orders/month, 3 print partners, first planner accounts.
	•	M7–M12: 10 artists onboarded, 100+ orders/month, $1M ARR run-rate.

Defensibility
	•	Proprietary artist datasets & LoRA weights (IP).
	•	Print-grade pipeline (color management, foil/letterpress support).
	•	Vendor network & QC data flywheel (router improves over time).

Team
Founder/CEO (product & GTM), CTO (gen‑AI + prepress), Head of Print Ops, Artist Partnerships.

Use of Funds (illustrative)
60% engineering (AI, editor, infra); 20% print ops & QA; 20% GTM/artist acquisition.

Risks & Mitigations
IP leakage → per‑tenant encryption + legal; GPU costs → caching/batching/distillation; print defects → stringent preflight + vendor scoring.

Ask
$X seed to reach $1M ARR swithin 12 months; target 60%+ GM, CAC payback < 2 months.s