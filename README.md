# 🪶 Mardi Studio Pro — Product Documentation

**Last Updated:** November 4, 2025  
**Status:** Ready for Development

---

## 📋 Overview

**Mardi Studio Pro** is a next-generation design platform that blends AI precision with human artistry to create luxury, fully-custom wedding stationery. Every design is powered by artist-trained AI models, enabling brides, planners, and artists to craft stunning wedding suites that look hand-painted and are ready for high-end print production.

**Tagline:** *"Designed by artists. Perfected by AI."*

---

## 📚 Documentation Index

This repository contains four comprehensive documents:

### 1. [Architecture Document](./arcitecture.md)
**System Architecture Design (v0.1)**

A complete technical architecture specification including:
- High-level system architecture
- Service decomposition (12 core services)
- Data flows and sequence diagrams
- Non-functional requirements (security, scalability, performance)
- Technology stack recommendations
- Deployment and DevOps strategy

**Key Highlights:**
- Microservices architecture with clean boundaries
- AI training + inference separation
- Print-grade preflight automation
- Artist IP protection via KMS encryption
- 99.9% uptime SLOs

---

### 2. [Architecture Review](./ARCHITECTURE_REVIEW.md)
**Independent Technical Assessment**

A thorough review and validation of the proposed architecture:
- ✅ **Overall Assessment:** APPROVED for implementation
- Detailed strengths analysis
- 15+ specific recommendations for optimization
- Security audit and threat model
- Scalability projections and cost modeling
- Build roadmap validation

**Key Recommendations:**
- Multi-stage rendering (preview → proof → print)
- Rate limiting tiers (free, bride, planner, artist)
- WebSocket resilience with Redis Pub/Sub
- GPU cost optimization (spot instances, caching, batching)

**Architecture Grade:** A- (Excellent with minor refinements)

---

### 3. [User Stories](./USER_STORIES.md)
**Complete User Story Library (73 Stories)**

Comprehensive user stories for all personas:

| Persona | Stories | Priority Distribution |
|---------|---------|----------------------|
| 👰‍♀️ Bride/Couple | 18 stories | 6 P0, 7 P1, 5 P2 |
| 🧑‍💼 Wedding Planner | 12 stories | 3 P0, 7 P1, 2 P2 |
| 🎨 Artist | 17 stories | 6 P0, 5 P1, 5 P2, 1 P3 |
| 🖨️ Stationer/Print Shop | 11 stories | 3 P0, 7 P1, 1 P2 |
| 👨‍💻 Platform Admin | 12 stories | 2 P0, 10 P1, 0 P2 |
| 💌 Guest (Recipient) | 3 stories | 0 P0, 0 P1, 2 P2, 1 P3 |

**Total Effort:** ~450 story points (9-12 months, 3-4 engineers)  
**MVP Scope:** ~140 points (3-4 months, 2 engineers)

**Format:** Each story includes:
- User role, action, benefit
- Detailed acceptance criteria
- Priority (P0-P3)
- Effort estimation
- Technical dependencies

---

### 4. [Product Requirements Document](./PRD_MARDI_STUDIO_PRO.md)
**Complete PRD (15 Sections, 25,000+ Words)**

The definitive product specification covering:

#### Business Foundation
1. **Executive Summary** — Vision, value prop, target market
2. **Product Vision & Mission** — Brand positioning and principles
3. **Problem Statement** — Market pain points and why now
4. **Target Market** — 3 detailed personas (Sarah, Jessica, Maria)

#### Product Specification
5. **Product Overview** — 4 modules, 3 detailed workflows
6. **Core Features** — MVP (6 features) + Post-MVP (4 features) + Future
7. **User Experience** — Design principles, visual language, IA, accessibility
8. **Technical Requirements** — Functional + non-functional requirements, tech stack

#### Business Strategy
9. **Business Model** — 3 revenue streams, unit economics (LTV:CAC = 19:1)
10. **Success Metrics** — North Star metric, product KPIs, OKRs (Year 1)
11. **Go-to-Market** — 5 acquisition channels, sales playbook, artist recruitment
12. **Roadmap** — MVP (M0-M3), Post-MVP (M4-M6), Growth (M7-M12)

#### Risk & Planning
13. **Risks & Mitigation** — 11 risks with mitigation strategies
14. **Open Questions** — 13 decisions needed before launch
15. **Appendices** — Competitive analysis, user research, glossary

**Key Financials:**
- **Year 1 Target:** $1M ARR, 1,200 orders, 65% gross margin
- **Unit Economics:** Bride LTV $960, CAC $50 → LTV:CAC = 19:1
- **Break-even:** 185 orders/month @ $700 AOV

---

## 🎯 Quick Start Guide

### For Product Managers
1. Read: **PRD (Executive Summary + Problem Statement)**
2. Prioritize: **User Stories (P0 for MVP)**
3. Track: **Roadmap milestones** (M0-M3 for launch)

### For Engineers
1. Read: **Architecture Document (High-Level + Service Specs)**
2. Review: **Architecture Review (Recommendations)**
3. Implement: **User Stories (start with P0)**

### For Designers
1. Read: **PRD (User Experience Section)**
2. Map: **User workflows** (Bride, Planner, Artist)
3. Design: **UI for User Stories (P0 first)**

### For Stakeholders
1. Read: **PRD (Executive Summary + Business Model)**
2. Review: **Success Metrics (OKRs, KPIs)**
3. Track: **Go-to-Market Strategy**

---

## 🚀 MVP Scope (M0-M3)

### Core Features (Must-Have)
- ✅ AI Suite Generator (10s generation time)
- ✅ Web-Based Design Editor (text, colors, layout)
- ✅ Preflight & PDF/X-1a Export
- ✅ Print Ordering & Checkout (Stripe)
- ✅ Artist Upload & Model Training
- ✅ Artist Earnings Dashboard

### Launch Criteria
- [ ] 1-3 artist models live
- [ ] 10 beta customers (feedback incorporated)
- [ ] < 5% preflight failure rate
- [ ] < 10s AI generation (P95)
- [ ] Manual print handoff (email to partner)

### Success Metrics (M3)
- 50 paid orders
- $40K revenue
- NPS > 40
- 3 artist models

---

## 📊 Key Metrics Dashboard

### North Star Metric
**Completed Orders per Month** — Measures product-market fit and revenue

### Critical KPIs
- **Acquisition:** Website visitors, signup conversion
- **Activation:** Signup → first design (< 7 days)
- **Monetization:** Orders/month, AOV ($700-1,200)
- **Retention:** Reorder rate (target: 20%)
- **Quality:** Preflight pass rate (> 95%), defect rate (< 0.5%)

### Business Health
- **MRR/ARR**
- **Gross Margin** (target: 60%+)
- **LTV:CAC** (target: > 3:1)
- **Burn Rate & Runway**

---

## 💰 Business Model at a Glance

### Revenue Streams
1. **Bride/Couple Orders:** $500 design + $200-700 print → **$200-350 margin**
2. **Planner Subscriptions:** $99-499/month → **85%+ margin**
3. **À La Carte:** Rush orders, hard proofs, custom illustrations

### Cost Structure (per order)
| Item | Cost |
|------|------|
| AI Generation | $0.50 |
| Storage & Bandwidth | $0.15 |
| Print (wholesale) | $150 |
| Shipping | $15 |
| Payment Processing | $15.30 |
| Artist Royalty | $200 |
| **Total COGS** | **$380.95** |

**Revenue:** $700  
**Gross Profit:** $319.05  
**Gross Margin:** 45.6% (62% at $1,000 AOV)

### Unit Economics
- **Bride LTV:** $960 (1.2 orders)
- **CAC:** $50 (Instagram ads, SEO, referrals)
- **LTV:CAC:** 19.2:1 ✅
- **Payback:** 1 month

---

## 🎨 Product Differentiators

| Feature | Mardi Studio Pro | Competitors |
|---------|------------------|-------------|
| **AI-Generated** | ✅ Artist-trained models | ❌ Templates |
| **Print-Perfect** | ✅ PDF/X-1a, CMYK, foil plates | ⚠️ Varies |
| **Turnaround** | 7-10 days | 10-14 days (Minted), 4-8 weeks (custom) |
| **Price** | $500-$800 | $800-1,200 (Minted), $3K-10K (custom) |
| **Artist Royalties** | 40% | 10-20% (Minted), 0% (Canva) |
| **Planner Tools** | ✅ Full SaaS platform | ❌ Not available |

---

## 🛣️ Roadmap Overview

### Phase 1: MVP (M0-M3)
**Goal:** Prove product-market fit

- Editor + Preflight + Manual Print
- Artist Upload → Training → Inference
- Stripe Checkout + Royalty Splits
- **Milestone:** 50 paid orders

### Phase 2: Scale (M4-M6)
**Goal:** Achieve product-channel fit

- Planner Workspaces
- Public Marketplace
- Print Router v1 (API-based)
- **Milestone:** $10K MRR (80 orders/month)

### Phase 3: Expand (M7-M12)
**Goal:** Hit $100K MRR, profitability

- Multi-partner routing (2-3 partners)
- Advanced editor (layers, filters)
- International (UK/EU)
- Analytics dashboard
- **Milestone:** $100K MRR, 10 artists, 20 planners

---

## 🔐 Security & Compliance

### Data Protection
- **Encryption:** At-rest (KMS), in-transit (TLS 1.3)
- **Backups:** PITR (5-min intervals), cross-region replication
- **Artist IP:** Per-tenant encryption keys, signed artifacts

### Compliance
- **PCI DSS:** Delegated to Stripe (no card storage)
- **GDPR:** User deletion within 30 days, consent management
- **Accessibility:** WCAG 2.1 AA compliance

### Audit & Monitoring
- **Audit Logs:** All model access, exports, order changes
- **Monitoring:** OpenTelemetry, Prometheus, Grafana
- **Alerts:** Uptime (99.9%), latency, GPU queue depth

---

## 👥 Target Users

### Primary: Sarah — The Style-Conscious Bride
- **Age:** 27-32, $75K-150K household income
- **Pain:** "I can't afford a $3K designer, but templates feel generic"
- **Goal:** Luxury invites for $500-800, delivered in 10 days

### Secondary: Jessica — The Wedding Planner
- **Age:** 32-45, 15-30 weddings/year, $200K-500K revenue
- **Pain:** "Stationery is always the bottleneck in my timeline"
- **Goal:** Same-day proofs, scale to 50% more clients

### Tertiary: Maria — The Watercolor Artist
- **Age:** 28-40, 5K-50K Instagram followers, $30K-60K income
- **Pain:** "Wedding season is feast-or-famine"
- **Goal:** $2K-5K/month passive income from art licensing

---

## 📈 Success Criteria (Year 1)

### Financial
- ✅ $1M ARR
- ✅ 65%+ gross margin
- ✅ CAC payback < 2 months

### Product
- ✅ 1,200 paid orders (100/month avg)
- ✅ 10 artist models in marketplace
- ✅ 20+ planner accounts
- ✅ < 0.5% print defect rate

### Customer
- ✅ NPS > 50 (brides), > 60 (artists)
- ✅ 20% reorder rate (brides)
- ✅ < 5% planner churn/month

---

## 🚨 Critical Risks & Mitigations

### Top 3 Risks

1. **AI Quality Not Good Enough**
   - Mitigation: 500+ scans per artist, human QA, A/B testing, "Artist Touch-Up" service

2. **Print Defects**
   - Mitigation: Rigorous 18+ preflight checks, test orders, defect feedback loop, hard proofs

3. **Slow Artist Recruitment**
   - Mitigation: $500 advance, success stories, art school partnerships, founder-created models

---

## 🤝 Next Steps

### Immediate Actions (Week 1)
1. [ ] Set up GCP project + billing
2. [ ] Provision GKE cluster (dev + staging)
3. [ ] Create GitHub repo (monorepo: `/frontend`, `/backend`, `/ai`)
4. [ ] Set up CI/CD (GitHub Actions)
5. [ ] Design system implementation (Tailwind + shadcn/ui)

### Sprint 1 (Week 2-3)
1. [ ] Auth service (Clerk integration)
2. [ ] Landing page + waitlist
3. [ ] Web editor foundation (Fabric.js)
4. [ ] AI inference service (SDXL + 1 LoRA model)

### Sprint 2 (Week 4-5)
1. [ ] Preflight validator
2. [ ] Stripe checkout
3. [ ] Artist upload pipeline
4. [ ] Order management

### Sprint 3 (Week 6-8)
1. [ ] Beta cohort (10 brides)
2. [ ] Training orchestrator
3. [ ] Royalty splitter
4. [ ] Manual print handoff

---

## 📞 Contact & Support

**Product Owner:** Conor Andrle  
**Repository:** `/Users/conorandrle/Documents/Coding/ArtAI`  
**Last Updated:** November 4, 2025

---

## 📄 Document Versions

| Document | Version | Status | Last Updated |
|----------|---------|--------|--------------|
| Architecture | v0.1 | Draft | Nov 3, 2025 |
| Architecture Review | v1.0 | Approved | Nov 4, 2025 |
| User Stories | v1.0 | Draft | Nov 4, 2025 |
| PRD | v1.0 | Approved | Nov 4, 2025 |

---

**Next Review Date:** December 1, 2025

---

## 🎉 Let's Build Something Beautiful

Mardi Studio Pro isn't just a product — it's a movement to democratize luxury design, empower artists, and bring joy to millions of couples celebrating their love stories.

**Let's ship it.** 🚀

---

**README End**

