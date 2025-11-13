# Mardi Studio Pro — Architecture Review

**Reviewer:** AI Assistant  
**Review Date:** November 4, 2025  
**Architecture Version:** v0.1

---

## Executive Summary

The proposed architecture for Mardi Studio Pro is **production-ready and well-designed** for a luxury wedding stationery platform. The system demonstrates strong technical foundations with appropriate service decomposition, security considerations, and scalability patterns.

**Overall Assessment:** ✅ **APPROVED** with minor recommendations

---

## 1. Strengths

### 1.1 Clear Service Boundaries
- **Well-defined microservices** with single responsibilities
- Clean separation between AI Training, Inference, and Business Logic
- Proper isolation of payment/billing concerns via Stripe

### 1.2 Security & Compliance
- Strong tenant isolation model (per-artist encryption, KMS)
- Comprehensive audit logging
- PCI compliance via Stripe delegation
- GDPR/privacy considerations addressed

### 1.3 Print Production Excellence
- Industry-standard prepress validation (PDF/X-1a, CMYK, ICC profiles)
- Bleed/trim/safe zone handling
- Professional finishing options (foil, letterpress, emboss)
- Multi-vendor routing with QC feedback loop

### 1.4 AI Infrastructure
- Appropriate model architecture (SDXL/Flux + LoRA adapters)
- GPU autoscaling and cost optimization strategies
- Model versioning and registry pattern
- Content safety and moderation

### 1.5 Artist-Centric IP Protection
- Per-artist model isolation
- Opt-in collaboration model
- Immutable artifact storage with checksums
- Clear royalty distribution mechanism

---

## 2. Recommendations

### 2.1 Critical Path Items

#### A. WebSocket State Management
**Current:** WebSocket for job status  
**Recommendation:** Add resilience layer
- Implement reconnection logic with exponential backoff
- Consider long-polling fallback for environments that block WS
- Use Redis Pub/Sub for horizontal WS scalability
- Store job state in Redis with TTL for recovery

#### B. Asset Storage Lifecycle
**Current:** S3/GCS with lifecycle policies  
**Recommendation:** Define explicit retention policies
```
- Active projects: Retain all assets
- Completed orders: Retain render/PDF for 2 years (legal/reprint)
- Abandoned projects: Archive after 90 days, delete after 1 year
- Training datasets: Retain indefinitely (artist contract requirement)
```

#### C. Rate Limiting Strategy
**Current:** Rate limiting at API Gateway  
**Recommendation:** Implement tiered limits
- Free tier: 10 generations/day, 1 active project
- Bride tier: 50 generations/order, 3 active projects
- Planner tier: Unlimited generations, seat-based
- Artist tier: Unlimited (own models)

### 2.2 Performance Optimizations

#### A. Image Generation Pipeline
**Recommendation:** Multi-stage rendering
```
1. Preview (512x512, L4 GPU): ~2-3s → immediate feedback
2. Proof (1024x1536, A10 GPU): ~5-6s → soft proof
3. Print (4096x6144, A100 GPU): ~15-20s → final PDF
```

#### B. Asset CDN Strategy
**Current:** Cloud CDN  
**Recommendation:** Edge caching rules
- Public assets (marketplace): Cache 7 days
- Private previews: Signed URLs, cache 1 hour
- Print PDFs: No CDN cache (always fresh)
- Fonts/templates: Cache 30 days

#### C. Database Query Patterns
**Recommendation:** Add read replicas
- Route analytics queries → read replica
- Route transactional writes → primary
- Consider GraphQL DataLoader pattern to prevent N+1

### 2.3 Operational Excellence

#### A. Monitoring & Alerting
**Add these SLIs/SLOs:**
- **Generation Latency:** P95 < 8s (goal met)
- **Print PDF Export:** P95 < 20s (goal met)
- **API Availability:** 99.9% uptime
- **Payment Success Rate:** > 99.5%
- **Print Defect Rate:** < 0.5%
- **Model Training Success:** > 95%

**Critical Alerts:**
- GPU queue depth > 50
- Inference service P99 > 30s
- Preflight failure rate > 5%
- Stripe webhook delays > 5 min
- Print partner API downtime

#### B. Disaster Recovery
**Recommendation:** Define RPO/RTO targets
- **Database:** PITR with 5-min intervals, RTO: 1 hour
- **Model Registry:** Cross-region replication, RTO: 15 min
- **Assets:** Versioned buckets with soft delete, RTO: 30 min
- **Training Data:** Dual-region backup, RTO: 4 hours

#### C. Cost Management
**Recommendation:** Implement cost tracking
- Tag GPU jobs by (user_tier, model_id, render_quality)
- Track COGS per order: GPU + print + payment fees
- Alert on per-generation cost > $2 threshold
- Monthly GPU budget caps with auto-scaling limits

### 2.4 API Design Enhancements

#### A. Versioning Strategy
**Current:** `/v1/` prefix  
**Recommendation:** Adopt sunset policy
- Support N and N-1 API versions concurrently
- Deprecation window: 6 months
- Use API Gateway for version routing
- GraphQL schema stitching for UI flexibility

#### B. Webhook Reliability
**Current:** Webhooks from print partners  
**Recommendation:** Implement idempotent webhook handler
```python
@webhook_handler("/v1/prints/webhook")
def handle_print_webhook(event):
    # 1. Verify signature (HMAC)
    # 2. Check idempotency key (dedupe retries)
    # 3. Update order status (atomic)
    # 4. Emit internal event to notification service
    # 5. Return 200 within 5s (ack)
```

#### C. Batch Operations
**Add endpoints:**
- `POST /v1/generate/batch` — bulk generation (planners)
- `POST /v1/orders/batch` — multi-client orders
- `GET /v1/projects/{id}/history` — version history
- `POST /v1/models/{id}/rollback` — model version rollback

---

## 3. Technical Deep Dives

### 3.1 AI Model Training Pipeline

**Architecture Assessment:** ✅ Strong foundation

**Enhancements:**
1. **Active Learning Loop**
   - Capture user edits after generation
   - Flag "good" vs "rejected" generations
   - Fine-tune models based on acceptance rate

2. **Model Quality Gates**
   - FID score < 30 (vs artist training set)
   - CLIP alignment > 0.85
   - Human eval panel: 3/5 judges approve
   - A/B test new versions (10% traffic)

3. **Training Optimization**
   - Use pre-computed CLIP embeddings
   - LoRA rank tuning: start at 16, optimize per artist
   - Mixed precision training (bf16)
   - Gradient checkpointing for larger batches

### 3.2 Print Preflight System

**Architecture Assessment:** ✅ Production-ready

**Additional Checks:**
```python
class PreflightValidator:
    def validate(self, pdf_path):
        checks = [
            self.check_cmyk_only(),           # No RGB/LAB
            self.check_bleed(0.125),          # 1/8" bleed
            self.check_resolution(300),       # Min 300 DPI
            self.check_fonts_embedded(),      # All fonts subset
            self.check_foil_plate_valid(),    # Min line weight
            self.check_overprint_flags(),     # Spot color rules
            self.check_icc_profile(),         # FOGRA39/GRACoL
            self.check_trim_marks(),          # Crop marks present
            self.check_safe_zone(0.25),       # 1/4" safe zone
        ]
        return all(checks)
```

### 3.3 Royalty Distribution

**Architecture Assessment:** ✅ Stripe Connect is correct choice

**Implementation Details:**
```
Order Flow:
1. Bride pays $500 → Mardi Studio Pro (platform)
2. Platform calculates split:
   - Artist royalty: $200 (40%)
   - Print cost: $150 (30%)
   - Platform fee: $150 (30%)
3. Stripe Connect Transfer: $200 → Artist account
4. Separate invoice to print partner
5. Record in Royalty table with status: [pending, paid, disputed]
```

**Edge Cases to Handle:**
- Multi-artist collaborations (split percentages)
- Chargebacks (reverse royalty transfer)
- Artist account payout failures (retry queue)
- Tax withholding (1099 reporting for US artists)

---

## 4. Security Audit

### 4.1 Threat Model

| Threat | Mitigation | Status |
|--------|-----------|--------|
| Model weight theft | KMS encryption, signed artifacts | ✅ |
| Prompt injection | Input sanitization, content filters | ✅ |
| SSRF via URLs | URL whitelist, no internal IPs | ⚠️ Add |
| Unauthorized API access | JWT + RBAC + OPA policies | ✅ |
| Payment fraud | Stripe Radar, 3DS | ✅ |
| Asset exfiltration | Signed URLs, short TTL | ✅ |
| XSS in editor | CSP, input sanitization | ⚠️ Verify |
| DDoS | WAF, rate limiting, CDN | ✅ |

### 4.2 Security Enhancements

**Add:**
1. **Content Security Policy (CSP)**
   ```
   Content-Security-Policy: 
     default-src 'self';
     script-src 'self' 'unsafe-inline' https://js.stripe.com;
     img-src 'self' data: https://*.cloudfront.net;
     connect-src 'self' https://api.mardistudio.pro;
   ```

2. **Secrets Rotation**
   - Rotate API keys quarterly
   - Rotate database credentials monthly
   - Rotate KMS keys annually

3. **Penetration Testing**
   - Annual external pentest
   - Quarterly internal security reviews
   - Bug bounty program (post-launch)

---

## 5. Scalability Analysis

### 5.1 Load Projections

**Year 1 Targets:**
- 100 orders/month → 1,200 orders/year
- 50 generations per order → 60,000 generations/year
- 10 artist models → 100GB model registry

**Scaling Triggers:**

| Metric | Threshold | Action |
|--------|-----------|--------|
| GPU queue depth | > 20 jobs | Scale GPU pool +2 nodes |
| API latency P95 | > 500ms | Scale API pods +50% |
| Database CPU | > 75% | Add read replica |
| Storage | > 80% capacity | Expand bucket quotas |
| Training queue | > 5 pending | Add training GPU |

### 5.2 Cost Modeling

**Per-Order COGS:**
```
Generation (avg 10 iterations): $0.50
Storage (10GB assets): $0.10
Bandwidth (PDF delivery): $0.05
Print cost (passthrough): $150
Payment fees (2.9% + $0.30): $15
---------------------------------------
Total COGS: ~$165.65
Revenue: $500
Gross Margin: 66.8%
```

**Monthly Infra Costs (100 orders):**
```
Kubernetes cluster (CPU): $500
GPU pool (L4, spot): $800
Database (managed): $200
Object storage: $100
CDN: $50
Monitoring/logs: $100
---------------------------------------
Total: $1,750/month
```

---

## 6. Build Roadmap Validation

**Proposed Order (from architecture doc):**
1. ✅ Editor + Preflight + Manual Print Handoff
2. ✅ Artist Upload → LoRA Training v1 → Model Registry
3. ✅ Inference API + Suite Generator
4. ✅ Stripe Connect + Royalty Splits + Orders
5. ✅ Print Router v1 → v2
6. ✅ Analytics + Planner Subscriptions

**Assessment:** Roadmap is **logical and risk-mitigated**

**Recommendation:** Consider parallel track for early revenue:
```
Track A (Technical): Editor → AI → Print automation
Track B (Go-to-Market): Landing page → waitlist → beta cohort
```

**MVP Definition (M0-M3):**
- [ ] Web editor with 5 template layouts
- [ ] 1 artist model (founder-created or partner artist)
- [ ] Manual preflight (human QA step)
- [ ] Manual print fulfillment (single partner, email coordination)
- [ ] Stripe Checkout (no royalty splits yet)
- [ ] **Goal:** 10 paying customers, validate product-market fit

---

## 7. Technology Stack Validation

### 7.1 Frontend
**Recommendation:** React + TypeScript + Fabric.js/Konva

| Component | Recommended Tech | Rationale |
|-----------|-----------------|-----------|
| Framework | Next.js 14 (App Router) | SSR, API routes, excellent DX |
| Canvas | Fabric.js | Print-quality canvas, extensive plugins |
| State | Zustand + React Query | Simple, performant, TS-first |
| UI Components | shadcn/ui + Tailwind | Modern, customizable, accessible |
| Forms | React Hook Form + Zod | Type-safe validation |
| Auth | Clerk or Auth0 | OIDC, MFA, social logins |

### 7.2 Backend
**Recommendation:** Python (FastAPI) + Go (high-throughput services)

| Service | Language | Framework | Rationale |
|---------|----------|-----------|-----------|
| API Gateway | Go | Envoy/Kong | High throughput, low latency |
| Auth Service | Node.js | Clerk SDK | Ecosystem fit |
| Design Studio | Python | FastAPI | PDF libs, ML ecosystem |
| AI Inference | Python | FastAPI + Ray Serve | PyTorch ecosystem |
| Training | Python | Hugging Face Trainer | Best-in-class tools |
| Order Mgmt | Go | Fiber/Gin | Concurrent workloads |
| Print Router | Python | FastAPI | API integrations |

### 7.3 Infrastructure
**Recommendation:** Google Cloud Platform (GCP)

| Component | GCP Service | Alternatives |
|-----------|-------------|--------------|
| Kubernetes | GKE Autopilot | AWS EKS, Azure AKS |
| Database | Cloud SQL (Postgres) | Supabase, Neon |
| Object Storage | Cloud Storage | AWS S3, R2 |
| GPU Compute | GCE with A100/L4 | AWS EC2, Lambda Labs |
| CDN | Cloud CDN | Cloudflare, Fastly |
| Secrets | Secret Manager | Vault, AWS Secrets |
| Monitoring | Cloud Ops Suite | Datadog, New Relic |

**Why GCP:**
- Excellent GPU availability and pricing
- Tight Kubernetes integration
- Strong ML/AI tooling (Vertex AI)
- Generous startup credits ($200k+ available)

---

## 8. Open Questions & Next Steps

### 8.1 Product Decisions Needed
- [ ] What is minimum order quantity? (MOQ: 25? 50? 100?)
- [ ] Do brides get design files after printing? (Ownership rights)
- [ ] Can artists veto specific usage of their models?
- [ ] What is refund/reprint policy for defects?
- [ ] Rush order pricing? (48hr turnaround)

### 8.2 Technical Spikes
- [ ] Preflight library selection (e.g., PyPDF2 vs pypdfium2 vs GhostScript)
- [ ] Canvas export to PDF/X-1a (browser → server pipeline)
- [ ] LoRA training time benchmarks (A100 vs L4)
- [ ] Print partner API evaluation (Gelato vs Thikit vs Mama Sauce)
- [ ] Real-time collaboration (if planner + client co-edit)

### 8.3 Go-to-Market
- [ ] Define ideal first 10 customers (brides? planners?)
- [ ] Artist recruitment strategy (DM on Instagram? Partnerships?)
- [ ] Pricing experiments ($399? $499? $599?)
- [ ] Print sample kits for marketing
- [ ] SEO/content strategy (wedding blog, Pinterest)

---

## 9. Final Recommendation

**Status:** ✅ **APPROVED FOR IMPLEMENTATION**

**Summary:**
The architecture is **production-ready** for an MVP launch. The system demonstrates:
- Strong separation of concerns
- Appropriate technology choices
- Robust security and privacy controls
- Clear path to scalability
- Thoughtful cost management

**Critical Path to MVP:**
1. Implement editor with 1 template (Week 1-2)
2. Integrate 1 trained LoRA model (Week 3)
3. Build preflight + manual print flow (Week 4)
4. Add Stripe checkout (Week 5)
5. Beta with 5 test customers (Week 6-8)
6. Iterate based on feedback (Week 9-12)

**Next Immediate Steps:**
1. Set up GCP project + billing
2. Provision GKE cluster (dev + staging)
3. Create GitHub repo with monorepo structure
4. Set up CI/CD pipeline (GitHub Actions)
5. Implement foundational services (Auth + API Gateway)

---

**Architecture Grade:** A- (Excellent with minor refinements)

**Confidence Level:** High — System is well-designed for the problem space

**Risk Level:** Low — No architectural red flags identified

