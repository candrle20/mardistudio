# 🪶 Mardi Studio Pro — Product Requirements Document (PRD)

**Version:** 1.0  
**Date:** November 4, 2025  
**Status:** Approved for Development  
**Author:** Product Team  
**Stakeholders:** Engineering, Design, Operations, Marketing

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Product Vision & Mission](#2-product-vision--mission)
3. [Problem Statement](#3-problem-statement)
4. [Target Market & User Personas](#4-target-market--user-personas)
5. [Product Overview](#5-product-overview)
6. [Core Features & Requirements](#6-core-features--requirements)
7. [User Experience & Design](#7-user-experience--design)
8. [Technical Requirements](#8-technical-requirements)
9. [Business Model & Monetization](#9-business-model--monetization)
10. [Success Metrics & KPIs](#10-success-metrics--kpis)
11. [Go-to-Market Strategy](#11-go-to-market-strategy)
12. [Roadmap & Milestones](#12-roadmap--milestones)
13. [Risks & Mitigation](#13-risks--mitigation)
14. [Open Questions & Decisions](#14-open-questions--decisions)
15. [Appendices](#15-appendices)

---

## 1. Executive Summary

### 1.1 Product Name
**Mardi Studio Pro** — *Designed by artists. Perfected by AI.*

### 1.2 Product Type
Vertical creative-AI SaaS platform for luxury wedding stationery

### 1.3 Core Value Proposition
Mardi Studio Pro combines the elegance of hand-painted wedding stationery with the speed and affordability of AI generation. Every design is powered by artist-trained models, delivering bespoke aesthetics at a fraction of traditional costs.

**Key Differentiators:**
- ✨ **Artist-Quality:** AI trained on real watercolor, calligraphy, and illustration work
- 🖨️ **Print-Perfect:** Professional prepress with CMYK accuracy, bleed, and foil plates
- ⚡ **Fast Turnaround:** Complete suites in minutes, printed in 7-10 days
- 💰 **Accessible Luxury:** $500 vs $3,000+ traditional design fees
- 🎨 **Artist Monetization:** 40% royalties empower creatives

### 1.4 Target Users
1. **Brides & Couples** — Seeking unique, luxury invites without designer fees
2. **Wedding Planners** — Needing fast, consistent custom designs for clients
3. **Artists** — Looking to monetize their style through AI licensing
4. **Print Partners** — Wanting print-ready files without prepress headaches

### 1.5 Market Opportunity
- **U.S. Wedding Market:** 2.1M weddings/year, $1.5B stationery TAM
- **Luxury Segment:** 15-20% of market ($225-300M), avg spend $1,500-$5,000
- **Addressable Market:** Couples willing to pay $500-$1,000 for AI-designed luxury suites
- **Expansion:** Events, branding, holiday cards (+$500M TAM)

### 1.6 Business Model
- **Brides/Couples:** $500 design fee + print cost (avg total: $500-$1,200)
- **Planners:** SaaS subscription ($99-$499/mo) + client billing markup
- **Artists:** 40% royalty on every design using their model
- **Platform:** 30% revenue share + print margin

### 1.7 Success Criteria (Year 1)
- 1,200 paid orders (100/month avg)
- 10 artist models in marketplace
- 20+ planner accounts
- $1M ARR
- 65%+ gross margin
- < 0.5% print defect rate

---

## 2. Product Vision & Mission

### 2.1 Vision Statement
> *To democratize luxury design by empowering every couple to have stationery as unique as their love story, while creating sustainable income for artists worldwide.*

### 2.2 Mission Statement
> *Mardi Studio Pro is the intersection of artistry and technology — where human creativity trains AI to produce wedding stationery that feels hand-crafted, looks stunning in print, and arrives in days instead of months.*

### 2.3 Product Principles
1. **Artist-First:** Every model is trained on real art, with fair compensation
2. **Print-Perfect:** No compromises on CMYK accuracy, resolution, or finishing options
3. **Effortless Editing:** Brides and planners can customize without design expertise
4. **Transparent Pricing:** No hidden fees, upfront cost calculators
5. **Quality Over Speed:** Fast generation, but never at the expense of quality
6. **Privacy & IP:** Artist models are isolated, encrypted, and protected

### 2.4 Brand Positioning
**Mardi Studio Pro** sits at the premium end of the wedding tech market:

| Brand | Positioning |
|-------|-------------|
| **Paperless Post** | Mass-market digital invites, templates |
| **Minted** | Crowdsourced designs, good quality, $800-1,500 |
| **Artifact Uprising** | Premium printed goods, limited customization |
| **Custom Studios** | Bespoke hand-painted, $3K-10K, 4-8 weeks |
| **→ Mardi Studio Pro** | AI-powered bespoke, print-perfect, $500-1,200, 10 days |

---

## 3. Problem Statement

### 3.1 Current Market Problems

#### Problem 1: High Cost of Custom Design
**Who It Affects:** Brides, Couples  
**Current State:**
- Custom wedding stationery from professional studios costs $1,500-$10,000
- Average timeline: 4-8 weeks from first consultation to printed product
- Most couples compromise on uniqueness due to cost

**Impact:**
- Only 5-10% of couples can afford truly custom designs
- 60% of couples use template-based services (Minted, Zola)
- 30% use DIY tools (Canva, Etsy templates) → inconsistent quality

#### Problem 2: Slow Turnaround for Planners
**Who It Affects:** Wedding Planners  
**Current State:**
- Planners manage 15-30 clients simultaneously
- Each client needs stationery: save-the-dates, invites, programs, menus, signage
- Traditional designers: 2-3 week lead time per item
- Revisions add 5-7 days per round

**Impact:**
- Planners become bottlenecks, limiting how many clients they can serve
- Rush orders cost 50-100% premium
- Clients delay sending invites (etiquette: 8-12 weeks before wedding)

#### Problem 3: Artist Income Inconsistency
**Who It Affects:** Watercolor/Calligraphy Artists  
**Current State:**
- Stationery commissions are seasonal (Feb-Aug peak)
- Pricing is challenging: undercharge (burnout) vs overcharge (lose clients)
- One-time sales: no recurring revenue from past work
- Licensing is opaque: Minted/Spoonflower take 60-90% of revenue

**Impact:**
- Artists can't rely on stationery as primary income
- Talented creatives leave the field
- Limited diversity in available styles

#### Problem 4: Print Quality Issues
**Who It Affects:** Print Shops, Brides  
**Current State:**
- Files from Canva, Etsy are often RGB, low-res, or missing bleed
- Print shops spend 30-60 min per file fixing prepress
- Color mismatches lead to reprints (5-10% defect rate)
- Foil/letterpress requires manual plate creation

**Impact:**
- Higher costs passed to customers
- Delays in fulfillment
- Customer dissatisfaction ("It didn't look like this online")

### 3.2 Why Now?
**Technology Enablers:**
1. **Diffusion Models (2023-2025):** SDXL/Flux can capture watercolor textures, calligraphy nuances
2. **LoRA Fine-Tuning:** Personalized models trainable in 2-6 hours on A100
3. **Web Canvas APIs:** Fabric.js/Konva enable pro-level editing in browsers
4. **Print API Maturity:** Gelato, Thikit offer boutique-quality via API

**Market Shifts:**
1. **DIY Fatigue:** Brides tired of spending 20+ hours on Canva
2. **AI Acceptance:** 73% of Gen Z/Millennials comfortable with AI-generated art (2024 survey)
3. **Print Renaissance:** Tangible goods valued in digital age (wedding invites as keepsakes)

---

## 4. Target Market & User Personas

### 4.1 Primary Persona: Sarah — The Style-Conscious Bride

**Demographics:**
- Age: 27-32
- Income: $75K-$150K household
- Location: Urban/suburban (SF, NYC, LA, Austin, Seattle)
- Wedding Budget: $40K-$80K

**Psychographics:**
- Values: Sustainability, uniqueness, aesthetics
- Influences: Pinterest (3+ boards), Instagram (follows wedding accounts)
- Tech Savvy: High (uses apps for everything)
- Priorities: Wants luxury look without luxury price

**Pain Points:**
1. "I can't afford a custom designer, but templates feel generic"
2. "I spent 15 hours on Canva and it still doesn't look professional"
3. "I'm worried the colors won't print correctly"
4. "I need invites in 6 weeks, most designers are booked"

**Goals:**
- Stationery that wows guests and photographs beautifully
- Reflects personal style (boho, modern, garden, vintage)
- Stays under $1,000 for full suite
- Minimal time investment (< 2 hours)

**Jobs to Be Done:**
- Generate unique designs quickly
- Customize text, colors, layout
- Ensure print quality
- Order with confidence (what I see = what I get)

**Quote:**
> *"I want my invitations to feel like a designer made them just for me, but I don't have $3,000 or 8 weeks to wait."*

---

### 4.2 Secondary Persona: Jessica — The Wedding Planner

**Demographics:**
- Age: 32-45
- Business: Solo or 2-5 person team
- Annual Revenue: $200K-$500K
- Clients: 15-30 weddings/year, avg budget $60K

**Psychographics:**
- Values: Efficiency, consistency, client satisfaction
- Tools: Aisle Planner, HoneyBook, Asana
- Tech Savvy: Very high (early adopter)
- Business Model: Flat fee ($3K-8K) or % of budget

**Pain Points:**
1. "Stationery is always the bottleneck in my timeline"
2. "I need different styles for different clients (boho vs black-tie)"
3. "Revisions take forever — clients want to see options NOW"
4. "I can't scale beyond 25 clients because of manual design work"

**Goals:**
- Fast turnaround (same-day proofs)
- Consistent quality across all clients
- White-label designs (my branding on proofs)
- Profitable: mark up design + print fees

**Jobs to Be Done:**
- Manage multiple client projects
- Generate diverse styles (not cookie-cutter)
- Collaborate with clients (share proofs, get feedback)
- Streamline ordering (bulk, recurring)

**Quote:**
> *"If I could generate custom designs in 10 minutes instead of 10 days, I could take on 50% more clients."*

---

### 4.3 Tertiary Persona: Maria — The Watercolor Artist

**Demographics:**
- Age: 28-40
- Followers: 5K-50K (Instagram, TikTok)
- Income: $30K-$60K (freelance + side hustles)
- Art Medium: Watercolor, gouache, digital illustration

**Psychographics:**
- Values: Creative control, fair compensation, community
- Platforms: Instagram (portfolio), Etsy (originals), Patreon (supporters)
- Tech Savvy: Moderate (posts online, basic e-commerce)
- Revenue Mix: Commissions (60%), prints (25%), teaching (15%)

**Pain Points:**
1. "Wedding season is feast-or-famine — I need consistent income"
2. "I undercharge for custom work because I don't know my worth"
3. "Licensing to Minted pays pennies per design"
4. "I want passive income but don't know how to scale"

**Goals:**
- Monetize existing art (scans, unused paintings)
- Earn royalties without ongoing work
- Maintain artistic integrity (control over usage)
- Reach wider audience (brides find me via platform)

**Jobs to Be Done:**
- Upload art portfolio
- Train AI model on my style
- Set usage terms and pricing
- Track earnings and withdraw funds
- Showcase work to attract commissions

**Quote:**
> *"I've painted hundreds of floral pieces — if AI could turn those into infinite variations and I got paid every time, that would be a dream."*

---

### 4.4 Market Segmentation

| Segment | Size (U.S.) | TAM | Acquisition Strategy |
|---------|-------------|-----|----------------------|
| **DIY Brides** (Canva, Etsy) | 600K/year | $300M | SEO, Pinterest ads, influencer |
| **Mid-Tier Brides** (Minted, Zola) | 400K/year | $400M | Comparison pages, Reddit, TikTok |
| **Luxury Aspirational** | 150K/year | $225M | Instagram, bridal shows, planners |
| **Wedding Planners** | 20K active | $100M | Direct sales, Aisle Planner integration |
| **Artists** | 5K-10K | N/A (supply side) | Instagram DMs, artist communities |

**Initial Wedge:** DIY + Mid-Tier brides (1M addressable, $700M TAM)

---

## 5. Product Overview

### 5.1 Product Components

Mardi Studio Pro consists of four integrated modules:

```
┌─────────────────────────────────────────────────────────────┐
│                    MARDI STUDIO PRO                         │
├─────────────────────────────────────────────────────────────┤
│  1. DESIGN STUDIO       │  2. ARTIST CONSOLE                │
│  - AI Suite Generator    │  - Upload Art                     │
│  - Web Editor (Canvas)   │  - Train Models                   │
│  - Preflight & Export    │  - Earnings Dashboard             │
│  - Print Ordering        │  - Royalty Payouts                │
├─────────────────────────┼───────────────────────────────────┤
│  3. PRINT ROUTER        │  4. MARKETPLACE                   │
│  - Partner Integration   │  - Browse Styles                  │
│  - Order Management      │  - Artist Profiles                │
│  - Tracking & QC         │  - Inspiration Gallery            │
│  - Fulfillment           │  - Reviews & Ratings              │
└─────────────────────────┴───────────────────────────────────┘
```

### 5.2 User Workflows

#### Workflow 1: Bride Creates & Orders Suite

```
1. DISCOVER
   - Browse marketplace by style (watercolor, modern, vintage)
   - View artist portfolios, sample suites
   - Read reviews from other brides

2. CUSTOMIZE
   - Select style → enter wedding details (names, date, venue)
   - AI generates full suite (invite, RSVP, menu, thank-you)
   - Edit text, colors, layout in web editor
   - Regenerate if unsatisfied (up to 10 free iterations)

3. PROOF
   - Request soft proof (PDF with bleed marks)
   - Share with fiancé/family for feedback
   - Receive preflight report (any issues flagged)

4. ORDER
   - Select print options (paper, foil, quantity)
   - See total price (design + print + shipping)
   - Checkout via Stripe
   - Receive order confirmation

5. FULFILL
   - Order routed to print partner (automated)
   - Status updates: confirmed → in production → shipped
   - Tracking link delivered via email/SMS
   - Invites arrive in 7-10 days

6. POST-ORDER
   - Rate experience (5 stars)
   - Upload photos of printed invites
   - Reorder for late additions
   - Download digital files for signage
```

**Time Investment:** 1-2 hours (vs 20+ hours DIY or 4-8 weeks custom studio)

---

#### Workflow 2: Artist Monetizes Style

```
1. APPLY
   - Fill out artist application (portfolio, Instagram, style)
   - Platform reviews (3-5 days)
   - Accepted → onboarding email

2. UPLOAD
   - Upload 300-500 high-res scans (watercolor, calligraphy, motifs)
   - Add metadata: medium, year, themes
   - Platform curates dataset (auto-tags colors, quality)

3. TRAIN
   - Initiate model training (2-6 hours)
   - Receive test generations for review
   - Approve or request re-training

4. QA
   - Platform QA team generates 10 samples
   - Artist + platform approve quality
   - Model published to marketplace

5. EARN
   - Brides discover and use artist's style
   - Artist earns 40% royalty per order
   - View earnings dashboard (real-time)
   - Request payout (Stripe Connect, $50 min)

6. GROW
   - Track usage analytics (generations, orders, ratings)
   - Update model with new art (v1.1, v1.2)
   - Showcase featured designs on profile
   - Receive testimonials from happy brides
```

**Time Investment:** 10-15 hours upfront, then passive income

---

#### Workflow 3: Planner Manages Clients

```
1. SUBSCRIBE
   - Sign up for planner account ($99-$499/mo)
   - Select plan: Starter (5 clients), Pro (15 clients), Studio (unlimited)
   - 14-day free trial

2. ONBOARD CLIENTS
   - Create client workspace (name, wedding date, notes)
   - Invite client to collaborate (view/comment only)
   - Import wedding details from Aisle Planner (integration)

3. DESIGN
   - Generate multiple style options for client
   - Client reviews and selects favorite
   - Planner refines in web editor
   - Save versions (A/B testing)

4. PROOF & APPROVE
   - Generate client-branded proof (planner logo)
   - Share secure link with client
   - Client approves via in-app button
   - Proceed to print configuration

5. BILL
   - Generate invoice (design + print + markup)
   - Send to client via email or paylink
   - Client pays → funds to planner's Stripe account
   - Platform fulfills order

6. SCALE
   - Manage 15-30 clients concurrently
   - Reuse templates for similar styles
   - Bulk generate designs for multiple clients
   - Track usage (stay within plan limits)
```

**Time Investment:** 30 min per client (vs 5-10 hours traditional)

---

### 5.3 Product Differentiators

| Feature | Mardi Studio Pro | Minted | Canva | Custom Studio |
|---------|------------------|--------|-------|---------------|
| **AI-Generated** | ✅ Artist-trained | ❌ Templates | ❌ Templates | ❌ Manual |
| **Print-Ready** | ✅ PDF/X-1a, CMYK | ✅ Good | ⚠️ RGB often | ✅ Perfect |
| **Foil/Letterpress** | ✅ Yes | ✅ Yes | ❌ No | ✅ Yes |
| **Turnaround** | 7-10 days | 10-14 days | Self-print | 4-8 weeks |
| **Price (100 invites)** | $500-$800 | $800-$1,200 | $200 (DIY) | $3K-$10K |
| **Customization** | ✅ Full control | ⚠️ Limited | ✅ Full | ✅ Full |
| **Artist Royalties** | ✅ 40% | ⚠️ 10-20% | ❌ No | ❌ No |
| **Planner Tools** | ✅ SaaS platform | ❌ No | ⚠️ Teams | ❌ No |
| **Web Editor** | ✅ Pro-level | ⚠️ Basic | ✅ Great | ❌ Email revisions |

**Key Advantages:**
1. **Bespoke at Scale:** Unique designs without designer fees
2. **Print Perfection:** CMYK, bleed, foil plates automated
3. **Fair Artist Compensation:** 40% vs industry 10-20%
4. **Planner Efficiency:** 10x faster than traditional workflow

---

## 6. Core Features & Requirements

### 6.1 MVP Features (M0-M3, Launch)

#### Feature 1: AI Suite Generator
**Description:** Generate complete wedding stationery suite from text prompts + wedding details.

**Requirements:**
- Input: Names, date, venue, color palette, style selection
- Output: Invitation (5×7), RSVP card (4×6), thank-you card (4×6)
- Generation time: < 10 seconds (P95)
- Models: 1-3 artist styles available at launch
- Free generations: 10 per user
- Additional: $5/generation after limit

**User Stories:** US-B4, US-B5  
**Priority:** P0 (MVP blocker)  
**Dependencies:** AI Inference Service, Model Registry

---

#### Feature 2: Web-Based Design Editor
**Description:** Browser-based canvas editor for customizing AI-generated designs.

**Requirements:**
- Text editing: inline editing, font selector (5 fonts), size/alignment
- Color editing: palette picker, real-time preview, CMYK warnings
- Layout: drag-and-drop elements, snap-to-grid, undo/redo
- Save: auto-save every 10s, manual "Save Version"
- Export: PDF preview, print-ready PDF/X-1a

**Technical:**
- Framework: React + Fabric.js or Konva
- Canvas: support 300 DPI output
- Fonts: embed via Google Fonts or self-hosted
- File size: max 50MB project file

**User Stories:** US-B6, US-B7  
**Priority:** P0 (MVP blocker)  
**Dependencies:** Design Studio Service

---

#### Feature 3: Preflight & Print-Ready Export
**Description:** Automated preflight checks and PDF/X-1a generation.

**Requirements:**
- Checks: CMYK only, 300+ DPI, fonts embedded, 0.125" bleed, safe zones
- Warnings: out-of-gamut colors, low-res images, missing bleed
- Output: PDF/X-1a with crop marks, color bars (optional)
- Foil plates: separate spot-color plates for foil (gold/silver/rose gold)
- Download: ZIP with PDF + foil plates

**Technical:**
- Library: PyPDF2, pypdfium2, or GhostScript
- ICC profiles: FOGRA39 (Europe), GRACoL (U.S.)
- Validation: PDF/X-1a compliance test

**User Stories:** US-B9  
**Priority:** P0 (MVP blocker)  
**Dependencies:** Preflight Service

---

#### Feature 4: Print Ordering & Checkout
**Description:** E-commerce flow for ordering printed stationery.

**Requirements:**
- Print options: paper (cotton 300gsm, 400gsm), finish (matte, foil), envelope
- Quantity: min 25, bulk discounts at 100+, 200+
- Pricing: real-time calculator (quantity × paper × finish + shipping)
- Checkout: Stripe integration (card, Apple Pay, Google Pay)
- Order confirmation: email with summary, tracking link (once shipped)

**Technical:**
- Payment: Stripe PaymentIntent API
- Tax: Stripe Tax or TaxJar integration
- Shipping: calculate via carrier APIs (UPS, USPS)

**User Stories:** US-B12, US-B13  
**Priority:** P0 (MVP blocker)  
**Dependencies:** Order Management Service, Stripe

---

#### Feature 5: Artist Upload & Model Training
**Description:** Artists upload artwork, platform trains LoRA model.

**Requirements:**
- Upload: bulk uploader, drag-and-drop, progress bar
- File formats: PNG, JPG, TIFF, PSD
- Min files: 100 images (recommended: 300-500)
- File size: max 50MB per image, 300-600 DPI
- Curation: platform auto-selects best images (quality, diversity)
- Training: initiate training, estimated time (2-6 hours), email notification
- Approval: artist reviews test generations, approves to publish

**Technical:**
- Storage: S3/GCS with versioning
- Training: SDXL + LoRA adapters, A100 GPU
- Model registry: immutable artifact storage, checksums

**User Stories:** US-A3, US-A5  
**Priority:** P0 (MVP blocker)  
**Dependencies:** Training Orchestrator, Model Registry

---

#### Feature 6: Artist Earnings Dashboard
**Description:** Real-time earnings tracking and payout management.

**Requirements:**
- Metrics: total earnings, this month, pending, paid out
- Breakdown: per-order (anonymized customer), per-model (if multiple)
- Royalty split: 40% of design fee (transparent calculation)
- Payout: Stripe Connect, $50 minimum, 2-5 day transfer
- Tax: 1099 generation for U.S. artists (annual)

**Technical:**
- Database: Royalty table (order_id, artist_id, amount, status)
- Payments: Stripe Connect Transfers
- Reporting: CSV export, annual statements

**User Stories:** US-A11, US-A13  
**Priority:** P0 (MVP blocker)  
**Dependencies:** Royalty Splitter, Stripe Connect

---

### 6.2 Post-MVP Features (M4-M6)

#### Feature 7: Planner Workspaces
**Description:** Multi-client project management for planners.

**Requirements:**
- Client workspaces: create, invite collaborators, archive
- Projects: multiple per client (invites, programs, menus)
- Team seats: add assistants, role-based permissions
- Billing: invoice generation, markup on design + print
- Usage tracking: designs per month, storage quota

**Priority:** P1 (Post-MVP)  
**Effort:** 3 weeks  
**User Stories:** US-P3, US-P4, US-P5, US-P9

---

#### Feature 8: Marketplace & Discovery
**Description:** Public marketplace for browsing artist styles.

**Requirements:**
- Homepage: featured styles, trending, new arrivals
- Filters: style (watercolor, modern, vintage), color, theme, price
- Artist profiles: bio, portfolio, testimonials, contact
- Reviews: brides rate styles, upload photos of printed invites
- Search: keyword search, semantic search (e.g., "boho floral")

**Priority:** P1 (Post-MVP)  
**Effort:** 4 weeks  
**User Stories:** US-B1, US-B3

---

#### Feature 9: Advanced Editor Tools
**Description:** Pro-level editing features for power users.

**Requirements:**
- Layers: foreground, background, text, decorative elements
- Blend modes: multiply, overlay, screen (for textures)
- Filters: brightness, contrast, hue shift
- Custom uploads: bride's engagement photos, venue illustrations
- Templates: save as reusable template (planners)

**Priority:** P2 (Post-MVP)  
**Effort:** 5 weeks  
**User Stories:** US-B8, US-P6

---

#### Feature 10: Print Partner Portal
**Description:** Self-service portal for print partners.

**Requirements:**
- Onboarding: capability matrix, pricing upload, API integration
- Order management: view incoming orders, update status, upload tracking
- File delivery: download print-ready PDFs, job tickets
- Invoicing: submit invoices, track payments
- Analytics: order volume, defect rate, performance score

**Priority:** P1 (Post-MVP)  
**Effort:** 6 weeks  
**User Stories:** US-S1, US-S2, US-S4, US-S6

---

### 6.3 Future Features (M7-M12)

- **Real-time Collaboration:** Multiple users editing same design (CRDT-based)
- **Video Invitations:** Animated MP4 exports for digital sharing
- **Guest Management:** RSVP tracking, meal preferences, seating charts
- **Mobile App:** iOS/Android for on-the-go editing
- **International Expansion:** Multi-language, currency, paper sizes (A5, DL)
- **Expanded Product Lines:** Holiday cards, birthday invites, branding materials

---

## 7. User Experience & Design

### 7.1 Design Principles

1. **Elegance Over Complexity**
   - Clean interfaces, minimal UI chrome
   - Typography-first design (serif headlines, sans body)
   - Generous whitespace

2. **Instant Gratification**
   - Show previews within 10 seconds
   - Real-time updates (color changes, text edits)
   - Optimistic UI (assume success, rollback if error)

3. **Confidence Building**
   - Clear pricing (no surprises at checkout)
   - Proof before purchase (PDF download)
   - Testimonials, reviews, real photos

4. **Artist Celebration**
   - Artist names/profiles visible on designs
   - "Powered by [Artist Name]" badges
   - Artist stories in blog/newsletter

### 7.2 Visual Design Language

**Color Palette:**
- Primary: Deep teal (#1A4D4D) — elegance, trust
- Secondary: Rose gold (#D4A373) — luxury, warmth
- Accent: Soft blush (#F4E8E8) — romance, softness
- Neutral: Charcoal (#2D2D2D), Off-white (#FAF9F6)

**Typography:**
- Headings: Playfair Display (serif, romantic)
- Body: Inter (sans-serif, clean, legible)
- Display: Cormorant Garamond (luxury touch)

**Imagery:**
- Hero: Watercolor textures, calligraphy close-ups
- Product shots: Styled flat-lays, invitation mockups
- Artist photos: Studio shots, behind-the-scenes

**Components:**
- Buttons: Rounded corners (8px), subtle shadows
- Cards: 12px border-radius, 1px border, soft drop shadow
- Forms: Inline validation, friendly error messages

### 7.3 Information Architecture

```
Homepage
├── Hero: "Designed by artists. Perfected by AI."
├── How It Works (3 steps)
├── Featured Styles (carousel)
├── Artist Spotlight
├── Pricing Calculator
├── Testimonials
└── CTA: "Start Designing" / "Join as Artist"

Marketplace
├── Filters (style, color, theme, price)
├── Grid of style cards (thumbnail + artist name)
├── Sorting (trending, new, price, rating)
└── Style detail page → "Use This Style" CTA

Design Studio
├── Sidebar: Style selector, wedding details form
├── Canvas: Live preview of design
├── Toolbar: Text, colors, layout, layers
├── Bottom bar: Save, Export, Order
└── Right panel: Element properties, history

Artist Console
├── Dashboard: Earnings, usage stats, notifications
├── Portfolio: Uploaded art, manage images
├── Models: Training status, test generations, publish
├── Earnings: Payouts, royalty breakdown, export
└── Profile: Public profile, bio, contact

Planner Workspace
├── Clients list: Active, completed, archived
├── Client detail: Projects, proofs, orders, notes
├── Design studio (same as bride view)
├── Billing: Invoice generator, payment tracking
└── Settings: Team, subscription, templates
```

### 7.4 Responsive Design

- **Desktop (1280px+):** Full editor, side-by-side panels
- **Tablet (768-1279px):** Stacked panels, touch-friendly controls
- **Mobile (< 768px):** Simplified editor, focus on text/color edits (complex layout edits encourage desktop)

### 7.5 Accessibility (WCAG 2.1 AA)

- **Contrast ratios:** 4.5:1 for body text, 3:1 for large text
- **Keyboard navigation:** All interactive elements focusable, logical tab order
- **Screen readers:** Semantic HTML, ARIA labels, alt text for images
- **Forms:** Clear labels, error messages, inline validation

---

## 8. Technical Requirements

### 8.1 Functional Requirements

#### FR-1: AI Generation
- **FR-1.1:** System shall generate 5×7" invite, 4×6" RSVP, 4×6" thank-you card from single prompt
- **FR-1.2:** Generation shall complete within 10 seconds (P95) on L4/A10 GPUs
- **FR-1.3:** Designs shall use artist-specific LoRA adapters (no base model alone)
- **FR-1.4:** User may regenerate up to 10 times (free tier) before additional charges

#### FR-2: Design Editor
- **FR-2.1:** Editor shall support text editing (font, size, color, alignment, kerning)
- **FR-2.2:** Editor shall support color palette changes with CMYK gamut warnings
- **FR-2.3:** Editor shall auto-save every 10 seconds to prevent data loss
- **FR-2.4:** Editor shall support undo/redo (20 history states)
- **FR-2.5:** Editor shall export to PDF/X-1a with 0.125" bleed

#### FR-3: Preflight
- **FR-3.1:** System shall validate CMYK color space (no RGB)
- **FR-3.2:** System shall validate minimum 300 DPI resolution
- **FR-3.3:** System shall validate font embedding (all fonts subsetted)
- **FR-3.4:** System shall validate bleed (0.125" on all sides)
- **FR-3.5:** System shall flag out-of-gamut colors with auto-correction suggestion

#### FR-4: Payments
- **FR-4.1:** System shall support Stripe (card, Apple Pay, Google Pay)
- **FR-4.2:** System shall calculate tax via Stripe Tax or TaxJar
- **FR-4.3:** System shall split royalties (40% artist, 30% print, 30% platform)
- **FR-4.4:** System shall transfer artist royalties within 2-5 business days of order completion

#### FR-5: Print Routing
- **FR-5.1:** System shall route orders to print partners based on capability, geography, SLA
- **FR-5.2:** System shall send job ticket (JSON) + PDF files via webhook or API
- **FR-5.3:** System shall track order status: confirmed → in production → shipped → delivered
- **FR-5.4:** System shall send email/SMS notifications at each status change

### 8.2 Non-Functional Requirements

#### NFR-1: Performance
- **NFR-1.1:** API latency: P95 < 500ms (excluding AI generation)
- **NFR-1.2:** AI generation: P95 < 10s (preview), P95 < 20s (print PDF)
- **NFR-1.3:** Page load time: P95 < 2s (initial load), < 500ms (subsequent navigations)
- **NFR-1.4:** Editor responsiveness: < 100ms for text edits, < 500ms for color changes

#### NFR-2: Availability
- **NFR-2.1:** System uptime: 99.9% (43 minutes downtime/month allowed)
- **NFR-2.2:** Planned maintenance: < 4 hours/month, during off-peak (2-6 AM PT)
- **NFR-2.3:** Degraded mode: If AI service down, allow manual upload of designs

#### NFR-3: Scalability
- **NFR-3.1:** Support 100 concurrent users (MVP), 10,000 concurrent users (Year 1)
- **NFR-3.2:** GPU pool: auto-scale from 2 nodes (baseline) to 20 nodes (peak)
- **NFR-3.3:** Database: support 100K users, 10K orders/month (MVP); 1M users, 100K orders/month (Year 1)

#### NFR-4: Security
- **NFR-4.1:** Authentication: OIDC (Auth0/Clerk), MFA for artists/admins
- **NFR-4.2:** Authorization: RBAC with resource-level policies (OPA)
- **NFR-4.3:** Data encryption: At-rest (KMS), in-transit (TLS 1.3)
- **NFR-4.4:** Artist isolation: Per-tenant encryption keys, no cross-pollination of models

#### NFR-5: Compliance
- **NFR-5.1:** PCI DSS: Delegated to Stripe (no card storage on platform)
- **NFR-5.2:** GDPR: User data deletion within 30 days, consent management
- **NFR-5.3:** Copyright: DMCA takedown process, artist IP protection
- **NFR-5.4:** Accessibility: WCAG 2.1 AA compliance

### 8.3 Technology Stack

**Frontend:**
- Framework: Next.js 14 (App Router)
- Language: TypeScript
- Canvas: Fabric.js (print-quality rendering)
- State: Zustand + React Query
- UI: shadcn/ui + Tailwind CSS
- Auth: Clerk or Auth0

**Backend:**
- API Gateway: Envoy/Kong (Go-based)
- Services: Python (FastAPI) for AI/design, Go for high-throughput
- AI: PyTorch, Diffusers, SDXL + LoRA
- Training: Hugging Face Trainer + Accelerate
- Database: PostgreSQL (Cloud SQL)
- Cache: Redis (Memorystore)
- Queue: Celery (Redis backend) or Cloud Tasks

**Infrastructure:**
- Platform: Google Cloud Platform (GCP)
- Orchestration: GKE (Kubernetes)
- GPU: GCE with A100 (training), L4 (inference)
- Storage: Cloud Storage (assets, models)
- CDN: Cloud CDN + Cloudflare
- Monitoring: Cloud Ops Suite, Prometheus, Grafana

**Third-Party Services:**
- Payments: Stripe (checkout, Connect)
- Email: SendGrid or Postmark
- SMS: Twilio
- Analytics: Mixpanel + Amplitude
- Error tracking: Sentry
- Print partners: Gelato, Thikit, Mama Sauce (APIs)

### 8.4 Data Model (Core Entities)

```sql
-- Users
users (id, email, role, org_id, created_at)
orgs (id, type, name, stripe_account_id)

-- Artists
artists (id, user_id, bio, instagram, status)
artworks (id, artist_id, url, metadata, quality_score)
models (id, artist_id, version, status, checksum, metrics)

-- Designs
projects (id, user_id, model_id, style_id, status, settings)
assets (id, project_id, type, url, icc_profile, resolution)

-- Orders
orders (id, project_id, user_id, total, status, print_partner_id)
order_items (id, order_id, sku, qty, config, unit_price)
royalties (id, order_id, artist_id, amount, status, paid_at)

-- Subscriptions (Planners)
subscriptions (id, org_id, plan, seats, status, stripe_subscription_id)

-- Print Partners
print_partners (id, name, capabilities, pricing, defect_rate)
print_jobs (id, order_id, partner_id, status, tracking_number)
```

### 8.5 API Design

**RESTful Endpoints:**
```
POST   /v1/auth/login
POST   /v1/auth/signup
GET    /v1/users/me

POST   /v1/artists/apply
POST   /v1/artists/{id}/artworks
POST   /v1/artists/{id}/models/train

POST   /v1/generate (styleId, prompt, layout) → job_id
GET    /v1/jobs/{id} → status, result_urls

POST   /v1/projects
GET    /v1/projects/{id}
PATCH  /v1/projects/{id}
POST   /v1/projects/{id}/preflight → pdf_url

POST   /v1/orders (projectId, printConfig)
GET    /v1/orders/{id}
POST   /v1/orders/{id}/approve

GET    /v1/royalties
POST   /v1/royalties/payout
```

**GraphQL (UI Aggregation):**
```graphql
query GetProject($id: ID!) {
  project(id: $id) {
    id
    status
    model {
      id
      artist { name, profileUrl }
    }
    assets { url, type }
    order { status, tracking }
  }
}

mutation GenerateSuite($input: GenerateSuiteInput!) {
  generateSuite(input: $input) {
    jobId
    estimatedTime
  }
}
```

**WebSockets (Real-time Updates):**
```
/ws/jobs/{job_id} → status updates for AI generation
/ws/orders/{order_id} → order status changes
```

---

## 9. Business Model & Monetization

### 9.1 Revenue Streams

#### Revenue Stream 1: Bride/Couple Orders
**Model:** Transaction fee (design) + margin on print

**Pricing:**
- Design fee: $500 (includes 10 generations, unlimited edits)
- Print cost: $200-$700 (depending on quantity, paper, finishes)
- Total to customer: $700-$1,200

**Split:**
- Artist royalty: $200 (40% of design fee)
- Print cost: $150-$500 (wholesale to partner)
- Platform revenue: $150 design + $50-200 print margin = **$200-350 per order**

**Gross Margin:** 60-65%

---

#### Revenue Stream 2: Planner Subscriptions
**Model:** SaaS subscription (seat-based)

**Plans:**
| Plan | Price | Clients | Seats | Generations | Storage |
|------|-------|---------|-------|-------------|---------|
| **Starter** | $99/mo | 5 | 1 | 50/mo | 10 GB |
| **Pro** | $249/mo | 15 | 3 | 200/mo | 50 GB |
| **Studio** | $499/mo | Unlimited | 10 | Unlimited | 200 GB |

**Additional:**
- Extra seat: +$29/seat/month
- Overages: $5/generation beyond plan limit

**Gross Margin:** 85%+ (low COGS)

---

#### Revenue Stream 3: À La Carte Services
**Model:** One-time fees for premium features

**Options:**
- Rush printing (3-5 days): +$100
- Hard proof (physical sample): $50
- Custom illustration (add photo): $50
- Additional generations (after 10 free): $5/generation
- Template library (planners): $29/template

---

### 9.2 Cost Structure

**Cost of Goods Sold (per order):**
| Item | Cost |
|------|------|
| AI generation (10 iterations × $0.05) | $0.50 |
| Storage (10 GB, 1 year) | $0.10 |
| Bandwidth (PDF delivery) | $0.05 |
| Print cost (wholesale) | $150 |
| Shipping (avg) | $15 |
| Payment processing (2.9% + $0.30) | $15.30 |
| Artist royalty | $200 |
| **Total COGS** | **$380.95** |

**Revenue per order:** $700  
**Gross profit:** $319.05  
**Gross margin:** **45.6%**

(Note: With higher AOV of $1,000, margin improves to 62%)

---

**Monthly Operating Expenses (estimate):**
| Category | Cost |
|----------|------|
| Infrastructure (GCP) | $2,000 |
| GPU compute (spot) | $1,500 |
| Third-party SaaS | $500 |
| Salaries (3 FTE) | $50,000 |
| Marketing (ads, SEO) | $5,000 |
| **Total OpEx** | **$59,000/mo** |

**Break-even:** 185 orders/month @ $700 avg AOV

---

### 9.3 Unit Economics

**Customer Lifetime Value (LTV):**
- **Bride:** 1.2 orders/lifetime (initial + reorders), $800 avg → **LTV: $960**
- **Planner:** 18 months avg tenure, $249/mo → **LTV: $4,482**

**Customer Acquisition Cost (CAC):**
- **Bride:** $50 (Instagram ads, SEO, referrals)
- **Planner:** $500 (direct sales, partnerships, trade shows)

**LTV:CAC Ratio:**
- **Bride:** 19.2:1 ✅ Excellent
- **Planner:** 9:1 ✅ Strong

**Payback Period:**
- **Bride:** 1 month (immediate)
- **Planner:** 2 months

---

### 9.4 Revenue Projections (Year 1)

**Assumptions:**
- Launch: Month 0 (MVP complete)
- Ramp: 20% MoM growth in orders
- AOV: $800 (mix of low and high quantities)
- Planner growth: +2 accounts/month

| Month | Bride Orders | Planner MRR | Total Revenue |
|-------|--------------|-------------|---------------|
| M1 | 10 | $0 | $8,000 |
| M3 | 17 | $500 | $14,100 |
| M6 | 36 | $2,000 | $30,800 |
| M9 | 75 | $4,500 | $64,500 |
| M12 | 156 | $8,000 | $132,800 |

**Year 1 ARR:** ~$1.0M  
**Year 1 Gross Profit:** ~$620K (62% margin)  
**Year 1 OpEx:** ~$700K  
**Year 1 Net:** -$80K (near break-even)

**Year 2 Projection:** $3.5M ARR, profitable

---

## 10. Success Metrics & KPIs

### 10.1 North Star Metric
**Completed Orders per Month** — Measures product-market fit and revenue

### 10.2 Product Metrics

**Acquisition:**
- Website visitors/month
- Conversion rate (visitor → signup)
- Signup → first design started (activation)
- Artist applications/month

**Engagement:**
- Designs generated per user
- Edit sessions per design (avg 3-5 = healthy)
- Proof requests per design
- Time to first order (target: < 7 days from signup)

**Monetization:**
- Orders per month
- Average order value (AOV)
- Bride LTV, Planner LTV
- Artist royalties paid/month

**Retention:**
- Reorder rate (brides: target 20%)
- Planner churn (target < 5%/month)
- Artist active models (% generating revenue)

**Quality:**
- Preflight failure rate (target < 5%)
- Print defect rate (target < 0.5%)
- Customer satisfaction (NPS target: 50+)
- Artist satisfaction (NPS target: 60+)

### 10.3 Business Metrics

**Financial:**
- MRR, ARR
- Gross margin (target: 60%+)
- CAC, LTV, LTV:CAC ratio (target: > 3:1)
- Payback period (target: < 3 months)
- Burn rate, runway

**Operational:**
- GPU utilization (target: 70%+)
- API uptime (target: 99.9%)
- Support tickets per 100 orders (target: < 5)
- Time to fulfill order (target: 7-10 days)

### 10.4 OKRs (Year 1)

**Q1: Launch & Validate**
- Objective: Prove product-market fit
  - KR1: 50 paid orders
  - KR2: NPS > 40
  - KR3: 3 artist models live

**Q2: Scale & Iterate**
- Objective: Achieve product-channel fit
  - KR1: 200 paid orders
  - KR2: $50 CAC (paid ads)
  - KR3: 5 planner accounts

**Q3: Expand & Optimize**
- Objective: Hit $50K MRR
  - KR1: 500 paid orders (cumulative)
  - KR2: 10 artist models
  - KR3: < 1% defect rate

**Q4: Accelerate Growth**
- Objective: Reach $100K MRR, profitability path
  - KR1: 1,000 paid orders (cumulative)
  - KR2: 20 planner accounts
  - KR3: 65% gross margin

---

## 11. Go-to-Market Strategy

### 11.1 Launch Plan

**Pre-Launch (M-3 to M0):**
1. **Landing page** (waitlist, email capture)
2. **Content marketing** (blog: "How to Design Wedding Invites")
3. **SEO foundation** (target keywords: "custom wedding invites", "AI wedding stationery")
4. **Beta cohort** (invite 10 brides, 2 planners, 3 artists for feedback)

**Launch (M0):**
1. **Product Hunt launch** (goal: Top 5 Product of the Day)
2. **Press release** (TechCrunch, The Knot, Brides Magazine)
3. **Influencer gifting** (send free invites to 20 wedding influencers)
4. **Instagram ads** (carousel: before/after, testimonials)

**Post-Launch (M1-M3):**
1. **Referral program** (bride refers bride: both get $50 credit)
2. **Planner outreach** (direct sales, LinkedIn, trade shows)
3. **Artist recruitment** (DM top watercolor artists on Instagram)
4. **Content flywheel** (blog → Pinterest → SEO → signups)

---

### 11.2 Customer Acquisition Channels

#### Channel 1: Organic (SEO + Content)
**Target:** DIY brides searching "custom wedding invites"

**Tactics:**
- Blog posts: "10 Watercolor Invite Ideas", "How to Choose Wedding Colors"
- Pinterest boards: 100+ pins linking to marketplace
- YouTube: "Behind the Scenes: AI-Generated Invites"
- Guest posts on wedding blogs (The Knot, WeddingWire)

**Cost:** Low (time investment)  
**Volume:** 500-1,000 visitors/month by M6  
**Conversion:** 3-5% (sign-up), 20% (sign-up → order)

---

#### Channel 2: Paid Social (Instagram/Facebook)
**Target:** Engaged women, 25-35, interested in weddings

**Tactics:**
- Carousel ads: "See how Sarah got luxury invites for $700"
- Video ads: Time-lapse of AI generating design
- Retargeting: visitors who viewed styles but didn't order

**Cost:** $50 CAC (bride), $500 CAC (planner)  
**Volume:** 50-100 orders/month by M6  
**Conversion:** 2-3% (ad → order)

---

#### Channel 3: Partnerships (Wedding Planners)
**Target:** Established planners with 15+ weddings/year

**Tactics:**
- Affiliate program: 10% commission per bride referral
- Co-marketing: planner showcases designs, we provide templates
- Trade show booth: WeddingPro Edu, Engage Summit

**Cost:** $500 CAC (planner), 10% commission (bride)  
**Volume:** 2-3 new planners/month  
**Conversion:** Planner refers 5-10 brides/year

---

#### Channel 4: Influencer Marketing
**Target:** Micro-influencers (10K-100K followers) in wedding niche

**Tactics:**
- Gift invites (free designs + print)
- Promo code (BRIDE15 for 15% off)
- Unboxing videos, styled shoots

**Cost:** $200/influencer (gift) + 15% discount  
**Volume:** 5-10 orders per influencer  
**Conversion:** 1-2% (follower → order)

---

#### Channel 5: Artist Community
**Target:** Watercolor/calligraphy artists with 5K+ followers

**Tactics:**
- Artist showcase on homepage
- Revenue share pitch: "Earn $2K-5K/month passively"
- Featured artist spotlight (blog, newsletter)

**Cost:** $0 CAC (inbound applications)  
**Volume:** 10 artists by M12  
**Conversion:** Each artist drives 5-10 orders/month

---

### 11.3 Sales Strategy (Planners)

**Funnel:**
1. **Awareness:** LinkedIn ads, trade shows, referrals
2. **Interest:** Free trial (14 days, no card required)
3. **Evaluation:** Demo call (30 min), ROI calculator
4. **Decision:** Pilot with 1-2 clients
5. **Purchase:** Subscribe to Starter/Pro/Studio plan

**Sales Playbook:**
- Target: Planners with 15+ weddings/year, $200K+ revenue
- Pain point: "Stationery is your bottleneck — we 10x your speed"
- ROI: "Save 5 hours per client → serve 50% more clients"
- Pricing: Frame as cost-of-doing-business ($249/mo vs $5K+ in time saved)

**Compensation:**
- Founder-led sales (M0-M6)
- First sales hire (M7): $60K base + $40K commission

---

### 11.4 Artist Recruitment

**Sourcing:**
1. Instagram DMs (target: 5K-50K followers, wedding art focus)
2. Artist communities (Skillshare, Patreon, Reddit r/watercolor)
3. Art school partnerships (RISD, Parsons, SCAD)

**Pitch:**
> "Turn your art into passive income. Upload your portfolio, we train an AI model on your style, and you earn 40% royalties every time a bride uses your designs. Zero ongoing work."

**Onboarding:**
1. Application (portfolio, Instagram, style)
2. Approval call (15 min, explain process)
3. Upload art (300-500 scans)
4. Training (2-6 hours, we handle)
5. QA + publish (artist reviews samples)
6. Launch announcement (feature on homepage, social media)

**Goals:**
- M3: 3 artists
- M6: 6 artists
- M12: 10 artists

---

## 12. Roadmap & Milestones

### 12.1 MVP Roadmap (M0-M3)

**Month 0: Foundation**
- [ ] Set up GCP project, GKE cluster
- [ ] Implement auth service (Clerk/Auth0)
- [ ] Design system (Tailwind + shadcn/ui)
- [ ] Landing page + waitlist

**Month 1: Core Features**
- [ ] Web editor (Fabric.js, text/color editing)
- [ ] AI inference service (SDXL + 1 LoRA model)
- [ ] Preflight validator (CMYK, DPI, bleed checks)
- [ ] Stripe checkout integration

**Month 2: Print & Artists**
- [ ] Print partner integration (manual, email-based)
- [ ] Artist upload + training pipeline
- [ ] Royalty split logic (Stripe Connect)
- [ ] Order management (status tracking)

**Month 3: Launch & Iterate**
- [ ] Beta cohort (10 brides, feedback)
- [ ] Public launch (Product Hunt, Instagram)
- [ ] First 50 paid orders
- [ ] 3 artist models live

---

### 12.2 Post-MVP Roadmap (M4-M6)

**Month 4: Planner Tools**
- [ ] Planner workspaces (multi-client)
- [ ] Team seats + permissions
- [ ] Invoice generation
- [ ] Usage tracking

**Month 5: Marketplace**
- [ ] Public marketplace (browse styles)
- [ ] Artist profiles
- [ ] Reviews & ratings
- [ ] Semantic search

**Month 6: Print Automation**
- [ ] Print router v1 (single partner, API-based)
- [ ] Webhook listeners (status updates)
- [ ] Automated job ticket generation
- [ ] Tracking integration (UPS/USPS)

---

### 12.3 Growth Roadmap (M7-M12)

**Month 7-9: Scale**
- [ ] Multi-partner print routing (2-3 partners)
- [ ] Advanced editor (layers, filters, custom uploads)
- [ ] Mobile-responsive editor
- [ ] Referral program

**Month 10-12: Expand**
- [ ] International (UK/EU: A5, DL sizes, VAT)
- [ ] Additional products (programs, menus, signage)
- [ ] Real-time collaboration (CRDT)
- [ ] Analytics dashboard (planners)

---

### 12.4 Key Milestones

| Milestone | Target Date | Metric |
|-----------|-------------|--------|
| **MVP Launch** | M0 | Product live, 10 beta users |
| **First Paid Order** | M1 | Revenue validation |
| **50 Paid Orders** | M3 | Product-market fit signal |
| **First Planner Account** | M4 | B2B validation |
| **$10K MRR** | M6 | 80 orders/month @ $800 avg |
| **10 Artist Models** | M9 | Marketplace depth |
| **$50K MRR** | M9 | 400 orders/month |
| **Profitability** | M12 | Revenue > OpEx |
| **$100K MRR** | M15 | Series A ready |

---

## 13. Risks & Mitigation

### 13.1 Product Risks

#### Risk 1: AI Quality Not Good Enough
**Description:** Generated designs look "AI-ish", not hand-crafted  
**Probability:** Medium  
**Impact:** High (brides reject, no orders)

**Mitigation:**
- Train on 500+ high-quality scans per artist (not 100)
- Use ControlNet for layout consistency
- Human QA before publishing models
- A/B test models (champion vs challenger)
- Offer "Artist Touch-Up" service ($100, artist manually refines)

---

#### Risk 2: Preflight Failures in Production
**Description:** PDFs fail at print shop despite passing checks  
**Probability:** Medium  
**Impact:** High (reprints, customer dissatisfaction)

**Mitigation:**
- Rigorous preflight checklist (18+ checks)
- Test orders with each print partner (validate output)
- Defect feedback loop (print partner reports issues → improve validator)
- Hard proof option ($50, customer sees sample before full run)

---

#### Risk 3: Editor Too Complex for Non-Designers
**Description:** Brides abandon editor, frustrated by tools  
**Probability:** Medium  
**Impact:** High (low conversion)

**Mitigation:**
- User testing (5 brides, observe where they struggle)
- Simplified mode (text + colors only, hide layers/filters)
- Tooltips, onboarding tour
- "Request Help" → platform designs for them ($50 fee)

---

### 13.2 Business Risks

#### Risk 4: Artist Recruitment Slower Than Expected
**Description:** Only 3 artists by M6 (target: 6)  
**Probability:** High  
**Impact:** Medium (limited style diversity)

**Mitigation:**
- Pay upfront ($500 advance against royalties)
- Highlight success stories (featured artist earning $3K/month)
- Partnerships with art schools (RISD, Parsons)
- If slow: use founder-created models + licensed stock art (temporary)

---

#### Risk 5: Print Partner Capacity Constraints
**Description:** Partner can't handle 100+ orders/month  
**Probability:** Medium  
**Impact:** High (delays, cancellations)

**Mitigation:**
- Onboard 2-3 partners by M6 (redundancy)
- Monitor order volume per partner (cap at 80% capacity)
- Build print partner queue (5+ in pipeline)
- If bottleneck: raise prices to slow demand, rush onboarding

---

#### Risk 6: High CAC, Low LTV
**Description:** Brides cost $100 to acquire, only order once ($700)  
**Probability:** Medium  
**Impact:** High (unprofitable unit economics)

**Mitigation:**
- Optimize ads (test 10+ creatives, target 3% CTR)
- Referral program (viral coefficient > 0.5)
- Reorder incentives (10% off, 60 days post-wedding)
- Expand to planners (higher LTV, lower CAC amortized)

---

### 13.3 Technical Risks

#### Risk 7: GPU Costs Spiral
**Description:** GPU spend > $5K/month, erodes margins  
**Probability:** Medium  
**Impact:** High (gross margin drops below 50%)

**Mitigation:**
- Use spot instances (L4 at $0.50/hr vs on-demand $1.20/hr)
- Caching: cache common prompts (10% of requests are duplicates)
- Batching: queue requests, run batches every 30s
- Distillation: train smaller models for previews (512px, fast)
- Dynamic pricing: charge $10/generation during peak (discourage abuse)

---

#### Risk 8: Data Loss or Breach
**Description:** User designs lost, or artist models leaked  
**Probability:** Low  
**Impact:** Critical (legal, reputational)

**Mitigation:**
- Backups: PITR (5-min intervals), cross-region replication
- Encryption: KMS for models, signed URLs for assets
- Access logs: audit all model access, alert on anomalies
- Incident response plan: 24-hour response SLA, legal counsel on retainer

---

#### Risk 9: Third-Party API Failures
**Description:** Stripe, print partner, or Clerk outage  
**Probability:** Medium  
**Impact:** Medium (service degraded)

**Mitigation:**
- Retry logic: exponential backoff, circuit breakers
- Fallbacks: manual print handoff if partner API down
- Status page: communicate outages to users
- Redundancy: multi-provider for critical services (e.g., SendGrid + Postmark)

---

### 13.4 Legal & IP Risks

#### Risk 10: Copyright Infringement Claims
**Description:** Artist uploads copyrighted work (e.g., Disney)  
**Probability:** Low  
**Impact:** High (lawsuit, takedown)

**Mitigation:**
- Terms of service: artist certifies ownership
- Manual review: admin QA checks for obvious violations
- DMCA process: takedown within 24 hours
- Insurance: $1M E&O policy

---

#### Risk 11: Model Weight Theft
**Description:** Competitor extracts artist LoRA weights  
**Probability:** Low  
**Impact:** High (IP loss, artist trust)

**Mitigation:**
- Encrypted storage (KMS, per-tenant keys)
- No model downloads (inference only via API)
- Watermarking (embed artist signature in generations)
- Legal: NDA with print partners, breach penalties

---

## 14. Open Questions & Decisions

### 14.1 Product Decisions

- [ ] **Minimum Order Quantity:** 25? 50? 100? (Impact: pricing, target customer)
- [ ] **File Ownership:** Do brides get PSD/AI files after ordering? (Impact: retention, upsell)
- [ ] **Rush Orders:** Offer 48-hour printing for +$150? (Impact: partner capacity, margin)
- [ ] **Envelope Addressing:** Offer AI calligraphy for envelopes ($100)? (Impact: scope, timeline)
- [ ] **Digital Invites:** Export MP4 animations for social media? (Impact: differentiation, dev time)

### 14.2 Business Decisions

- [ ] **Pricing Experiment:** Test $399, $499, $599 design fee (Impact: conversion, revenue)
- [ ] **Planner Commission:** Offer 10% or 20% affiliate commission? (Impact: CAC, margin)
- [ ] **Artist Exclusivity:** Pay artists 60% for exclusive models? (Impact: differentiation, cost)
- [ ] **Freemium vs Paid:** Offer free tier (1 design, watermarked) to drive SEO? (Impact: brand perception)

### 14.3 Technical Decisions

- [ ] **Model Architecture:** SDXL vs Flux vs Stable Cascade? (Impact: quality, cost, speed)
- [ ] **Editor Library:** Fabric.js vs Konva vs custom WebGL? (Impact: performance, flexibility)
- [ ] **Print Partner Priority:** Gelato (global) vs Thikit (boutique) vs both? (Impact: quality, cost)
- [ ] **Hosting:** GCP vs AWS vs hybrid? (Impact: GPU availability, cost, lock-in)

---

## 15. Appendices

### 15.1 Competitive Analysis

| Competitor | Strengths | Weaknesses | Our Advantage |
|------------|-----------|------------|---------------|
| **Minted** | Strong brand, quality, marketplace | Templates only, expensive | AI bespoke, faster |
| **Paperless Post** | Digital-first, easy, free tier | Not luxury, no print | Tangible, print-perfect |
| **Zola** | Integrated (invites + registry) | Generic designs, basic | Artist quality |
| **Greenvelope** | Digital + sustainable | No physical, limited styles | Hybrid (digital proof, physical print) |
| **Custom Studios** | True bespoke, hand-painted | $3K-10K, 8 weeks | Same quality, $500, 10 days |

---

### 15.2 User Research Insights

**Key Findings (10 bride interviews, Aug 2024):**

1. **Pain Point #1:** "I spent 20 hours on Canva and it still looks amateur"
2. **Pain Point #2:** "I don't know if the colors will print correctly"
3. **Desire #1:** "I want something no one else has"
4. **Desire #2:** "I want to support artists, not big corporations"
5. **Willingness to Pay:** $500-$800 is sweet spot (Minted costs $800-1,200, so we're competitive)

**Key Findings (5 artist interviews, Sep 2024):**

1. **Pain Point #1:** "Wedding season is feast-or-famine"
2. **Pain Point #2:** "I undercharge because I don't know my worth"
3. **Desire #1:** "I want passive income from my art"
4. **Concern #1:** "Will AI dilute my brand?" → Mitigate: artist name prominent, "powered by [Artist]"
5. **Willingness to Participate:** 40% royalty is fair (vs Minted's 10-20%)

---

### 15.3 Glossary

- **Bleed:** Extra 0.125" of design extending beyond trim line (prevents white edges)
- **CMYK:** Cyan, Magenta, Yellow, Black (print color model)
- **ControlNet:** AI technique for guiding layout/composition
- **Foil:** Metallic finish (gold, silver, rose gold) applied via stamping
- **ICC Profile:** Color space definition (e.g., FOGRA39, GRACoL)
- **Letterpress:** Printing method where design is pressed into paper (tactile)
- **LoRA:** Low-Rank Adaptation (efficient model fine-tuning)
- **PDF/X-1a:** Print-ready PDF standard (CMYK, fonts embedded, etc.)
- **Preflight:** Pre-press validation (checks for print-readiness)
- **Safe Zone:** 0.25" margin where no critical elements (text, logos) should appear
- **SDXL:** Stable Diffusion XL (generative AI model)
- **Trim Line:** Where paper is cut (final size)

---

### 15.4 References

1. **Wedding Industry Stats:** The Knot 2024 Real Weddings Study
2. **AI Adoption:** Pew Research "Gen Z and AI" (2024)
3. **Print Market:** IBISWorld "Wedding Services in the US" (2024)
4. **Diffusion Models:** "High-Resolution Image Synthesis with Latent Diffusion Models" (Rombach et al.)
5. **LoRA Fine-Tuning:** "LoRA: Low-Rank Adaptation of Large Language Models" (Hu et al.)

---

## Document Control

**Version History:**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1 | Nov 3, 2025 | Product Team | Initial draft |
| 1.0 | Nov 4, 2025 | Product Team | Complete PRD approved |

**Approvals:**

- [ ] CEO (Product Vision)
- [ ] CTO (Technical Feasibility)
- [ ] Head of Design (UX/UI)
- [ ] Head of Operations (Print/Fulfillment)
- [ ] Head of Marketing (GTM Strategy)

**Next Review:** December 1, 2025

---

**Document End**

