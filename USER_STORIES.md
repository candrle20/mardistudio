# Mardi Studio Pro — User Stories

**Version:** 1.0  
**Date:** November 4, 2025  
**Status:** Draft

---

## Table of Contents

1. [Bride/Couple Persona](#1-bridecouple-persona)
2. [Wedding Planner Persona](#2-wedding-planner-persona)
3. [Artist Persona](#3-artist-persona)
4. [Stationer/Print Shop Persona](#4-stationerprint-shop-persona)
5. [Platform Admin Persona](#5-platform-admin-persona)
6. [Guest (Recipient) Persona](#6-guest-recipient-persona)

---

## Persona Definitions

### 👰‍♀️ Bride/Couple
**Profile:** Sarah, 29, San Francisco, planning a $60K wedding  
**Pain Point:** Wants unique, luxury invites but $3K+ design fees are too high  
**Tech Savvy:** Moderate (uses Canva, Pinterest, Instagram)  
**Budget:** $400-$800 for invites + stationery suite

### 🧑‍💼 Wedding Planner
**Profile:** Jessica, 35, manages 25+ weddings/year  
**Pain Point:** Needs custom designs quickly, frustrated by slow turnarounds  
**Tech Savvy:** High (uses project management tools, design software)  
**Budget:** SaaS subscription ($99-$499/mo), passes design cost to clients

### 🎨 Artist
**Profile:** Maria, 31, watercolor illustrator with 15K Instagram followers  
**Pain Point:** Wants passive income from art, but licensing is opaque  
**Tech Savvy:** Moderate (posts on Instagram, uses Etsy/Shopify)  
**Revenue Goal:** $2K-$5K/month in royalties

### 🖨️ Stationer/Print Shop
**Profile:** Tom, 42, runs boutique letterpress studio  
**Pain Point:** Receives poor-quality files, spends hours fixing prepress  
**Tech Savvy:** High (Adobe Suite expert, knows print specs)  
**Business Model:** Wholesale pricing for print-ready files

### 👨‍💻 Platform Admin
**Profile:** Internal operations team  
**Goal:** Monitor system health, resolve artist/customer issues  
**Tech Savvy:** Very high (engineers, support specialists)

### 💌 Guest (Recipient)
**Profile:** Anyone receiving a wedding invitation  
**Goal:** RSVP easily, view event details  
**Tech Savvy:** Varies (wide demographic)

---

## 1. Bride/Couple Persona

### 1.1 Discovery & Exploration

#### US-B1: Browse Design Styles
**As a** bride,  
**I want to** browse different artistic styles (watercolor, botanical, modern calligraphy),  
**So that** I can find a style that matches my wedding aesthetic.

**Acceptance Criteria:**
- [ ] Homepage displays curated style collections
- [ ] Each style shows 3-5 example designs
- [ ] Clicking a style opens a gallery with more examples
- [ ] Filter by: season, formality, color palette, theme
- [ ] "Favorite" styles are saved to profile

**Priority:** P0 (MVP)  
**Effort:** 5 points  
**Dependencies:** Artist models trained

---

#### US-B2: See Pricing Upfront
**As a** bride,  
**I want to** see transparent pricing before starting,  
**So that** I know if it fits my budget.

**Acceptance Criteria:**
- [ ] Pricing page shows: base design fee + per-invite cost
- [ ] Calculator: enter guest count → see total estimate
- [ ] Compare: standard vs premium paper, foil options
- [ ] No hidden fees displayed clearly
- [ ] Free trial: generate 1 design, pay only if ordering

**Priority:** P0 (MVP)  
**Effort:** 3 points

---

#### US-B3: View Sample Suites
**As a** bride,  
**I want to** see full suite examples (invitation, RSVP, menu, signage),  
**So that** I understand what's included.

**Acceptance Criteria:**
- [ ] Suite preview shows all pieces side-by-side
- [ ] Zoom into each piece for detail
- [ ] Toggle between digital mockup and printed photo
- [ ] List of included items (e.g., 5×7 invite, 4×6 RSVP, envelope liners)

**Priority:** P1  
**Effort:** 5 points

---

### 1.2 Design Creation

#### US-B4: Input Wedding Details
**As a** bride,  
**I want to** enter wedding details (names, date, venue, colors),  
**So that** the AI can generate personalized designs.

**Acceptance Criteria:**
- [ ] Form fields: bride/groom names, date, venue, dress code
- [ ] Color picker or palette suggestions
- [ ] Tone selector: formal, casual, romantic, modern
- [ ] Optional: upload inspiration images (Pinterest board)
- [ ] Save as draft (resume later)

**Priority:** P0 (MVP)  
**Effort:** 5 points

---

#### US-B5: Generate AI Design Suite
**As a** bride,  
**I want to** generate a complete stationery suite with one click,  
**So that** I don't have to design each piece manually.

**Acceptance Criteria:**
- [ ] Click "Generate Suite" → loading state (8-10s)
- [ ] Preview all pieces (invite, RSVP, menu, thank-you card)
- [ ] Designs are cohesive (same style, palette, motifs)
- [ ] If unsatisfied, "Regenerate" creates new version
- [ ] Limit: 10 free generations, then $5/additional generation

**Priority:** P0 (MVP)  
**Effort:** 8 points  
**Dependencies:** AI Inference Service

---

#### US-B6: Edit Text & Layout
**As a** bride,  
**I want to** edit text, fonts, and layout in a web editor,  
**So that** I can customize details without losing the design.

**Acceptance Criteria:**
- [ ] Click any text → inline editing
- [ ] Font selector (5-10 wedding-appropriate fonts)
- [ ] Adjust text size, alignment, kerning
- [ ] Move elements (drag & drop)
- [ ] Undo/redo history
- [ ] Changes auto-save every 10 seconds

**Priority:** P0 (MVP)  
**Effort:** 13 points  
**Dependencies:** Design Studio Service

---

#### US-B7: Adjust Colors
**As a** bride,  
**I want to** change colors in the design,  
**So that** it matches my wedding palette.

**Acceptance Criteria:**
- [ ] Color picker for primary, secondary, accent colors
- [ ] AI suggests harmonious palettes
- [ ] Preview changes in real-time
- [ ] Reset to original palette option
- [ ] Warning if colors are out of CMYK gamut (with auto-correction)

**Priority:** P1  
**Effort:** 8 points

---

#### US-B8: Add Custom Elements
**As a** bride,  
**I want to** add my own photos or illustrations,  
**So that** I can personalize the design further.

**Acceptance Criteria:**
- [ ] Upload images (PNG, JPG, SVG)
- [ ] Drag to position, resize, rotate
- [ ] AI removes background if needed
- [ ] Clip to safe zone (no text/photos in bleed)
- [ ] Max file size: 10MB per image

**Priority:** P2 (Post-MVP)  
**Effort:** 8 points

---

### 1.3 Review & Approval

#### US-B9: Request Digital Proof
**As a** bride,  
**I want to** see a high-resolution proof before ordering,  
**So that** I can verify every detail.

**Acceptance Criteria:**
- [ ] Click "Request Proof" → generates PDF (20s)
- [ ] PDF includes bleed marks, color bars (if requested)
- [ ] Download or view in browser
- [ ] Share link with partner/planner (expiring URL)
- [ ] Preflight report shows any issues (low resolution, missing fonts)

**Priority:** P0 (MVP)  
**Effort:** 8 points  
**Dependencies:** Preflight Service

---

#### US-B10: Share for Feedback
**As a** bride,  
**I want to** share my design with my fiancé or family,  
**So that** I can get their input before ordering.

**Acceptance Criteria:**
- [ ] "Share" button generates a link
- [ ] Recipients can view, comment, but not edit
- [ ] Comments appear as annotations on design
- [ ] Bride approves/dismisses comments
- [ ] Link expires after 7 days

**Priority:** P1  
**Effort:** 5 points

---

#### US-B11: Compare Versions
**As a** bride,  
**I want to** see version history of my designs,  
**So that** I can revert if I change my mind.

**Acceptance Criteria:**
- [ ] "History" panel shows thumbnails of each save
- [ ] Click thumbnail → preview full design
- [ ] "Restore this version" button
- [ ] Max 20 versions saved

**Priority:** P2 (Post-MVP)  
**Effort:** 5 points

---

### 1.4 Printing & Ordering

#### US-B12: Select Print Options
**As a** bride,  
**I want to** choose paper type, finishes, and quantities,  
**So that** I get the exact physical product I envision.

**Acceptance Criteria:**
- [ ] Paper selector: cotton 300gsm, 400gsm, textured linen
- [ ] Finish: matte, pearl, foil (gold/silver/rose gold)
- [ ] Special options: letterpress, embossing, deckled edges
- [ ] Envelope options: A7, Euro flap, lined
- [ ] Quantity input with bulk discounts (100+, 200+)
- [ ] Real-time price updates

**Priority:** P0 (MVP)  
**Effort:** 8 points

---

#### US-B13: Order Printed Invites
**As a** bride,  
**I want to** place an order and pay securely,  
**So that** I receive professional printed invitations.

**Acceptance Criteria:**
- [ ] Checkout flow: review design → print options → shipping → payment
- [ ] Stripe payment (card, Apple Pay, Google Pay)
- [ ] Order confirmation email with summary
- [ ] Estimated delivery: 7-10 business days (standard), 3-5 (rush)
- [ ] Order tracking link

**Priority:** P0 (MVP)  
**Effort:** 8 points  
**Dependencies:** Order Management Service, Stripe

---

#### US-B14: Track Order Status
**As a** bride,  
**I want to** see real-time order status,  
**So that** I know when to expect my invitations.

**Acceptance Criteria:**
- [ ] Order dashboard shows: confirmed → in production → shipped → delivered
- [ ] Email/SMS notifications at each stage
- [ ] Carrier tracking link (UPS/USPS)
- [ ] Estimated delivery date updates if delayed

**Priority:** P1  
**Effort:** 5 points

---

#### US-B15: Request Changes After Order
**As a** bride,  
**I want to** contact support to change my order (if not yet printed),  
**So that** I can fix mistakes or update details.

**Acceptance Criteria:**
- [ ] "Request Change" button (only if status = confirmed, not in production)
- [ ] In-app chat or email to support
- [ ] Support can edit design on bride's behalf
- [ ] Bride re-approves proof
- [ ] If in production, offer reprint at 50% discount

**Priority:** P2 (Post-MVP)  
**Effort:** 8 points

---

### 1.5 Post-Order

#### US-B16: Reorder Additional Invites
**As a** bride,  
**I want to** reorder the same design easily,  
**So that** I can invite last-minute guests.

**Acceptance Criteria:**
- [ ] "Reorder" button on order history
- [ ] Same design, same print options
- [ ] Update quantity only
- [ ] No design fee (just print cost + shipping)

**Priority:** P1  
**Effort:** 3 points

---

#### US-B17: Download Digital Files
**As a** bride,  
**I want to** download my design files after ordering,  
**So that** I can use them for matching day-of signage.

**Acceptance Criteria:**
- [ ] Download button available after payment
- [ ] Formats: PDF (print-ready), PNG (web), PSD (editable)
- [ ] License: personal use only (no commercial resale)
- [ ] Files available for 1 year after order

**Priority:** P2 (Post-MVP)  
**Effort:** 3 points

---

#### US-B18: Leave a Review
**As a** bride,  
**I want to** rate my experience and upload photos of printed invites,  
**So that** other brides can see real results.

**Acceptance Criteria:**
- [ ] Email prompt 2 weeks after delivery
- [ ] Star rating (1-5) + text review
- [ ] Upload photos of printed product
- [ ] Review appears on homepage/style gallery (with permission)
- [ ] 10% discount code for next order as thank-you

**Priority:** P2 (Post-MVP)  
**Effort:** 5 points

---

## 2. Wedding Planner Persona

### 2.1 Account Setup

#### US-P1: Create Planner Account
**As a** wedding planner,  
**I want to** sign up for a professional account,  
**So that** I can manage multiple clients.

**Acceptance Criteria:**
- [ ] Registration form: name, business name, email, phone
- [ ] Verify email
- [ ] Select plan: Starter ($99/mo), Pro ($249/mo), Studio ($499/mo)
- [ ] 14-day free trial (no credit card required)

**Priority:** P0 (MVP)  
**Effort:** 5 points

---

#### US-P2: Add Team Members
**As a** planner,  
**I want to** invite assistants to my account,  
**So that** they can help design for clients.

**Acceptance Criteria:**
- [ ] "Team" settings page
- [ ] Invite by email → recipient creates sub-account
- [ ] Role assignment: admin, designer, viewer
- [ ] Seat-based billing: +$29/seat/month
- [ ] Remove team members

**Priority:** P1  
**Effort:** 5 points

---

### 2.2 Client Management

#### US-P3: Create Client Workspaces
**As a** planner,  
**I want to** create a workspace for each client,  
**So that** designs are organized and private.

**Acceptance Criteria:**
- [ ] "New Client" button → form (client name, wedding date, notes)
- [ ] Each workspace has its own projects/designs
- [ ] Search/filter clients by date, name, status
- [ ] Archive completed clients

**Priority:** P0 (MVP)  
**Effort:** 5 points

---

#### US-P4: Invite Clients to Collaborate
**As a** planner,  
**I want to** invite my client to view/comment on designs,  
**So that** they can give feedback directly.

**Acceptance Criteria:**
- [ ] "Invite Client" → sends email with secure link
- [ ] Client can: view designs, leave comments, approve proofs
- [ ] Client cannot: edit designs, see pricing, access other clients
- [ ] Planner sees all client activity

**Priority:** P1  
**Effort:** 5 points

---

#### US-P5: Manage Multiple Projects Per Client
**As a** planner,  
**I want to** create multiple design projects (invites, programs, menus),  
**So that** I can handle the entire stationery suite.

**Acceptance Criteria:**
- [ ] Client workspace has "Projects" tab
- [ ] Create project: type (invite, RSVP, menu, signage), status
- [ ] Projects share the same style/palette (optional)
- [ ] Bulk actions: duplicate, archive, delete

**Priority:** P1  
**Effort:** 5 points

---

### 2.3 Design Workflow

#### US-P6: Use Brand Templates
**As a** planner,  
**I want to** save my own template presets (fonts, layouts),  
**So that** I can apply my brand to all client projects.

**Acceptance Criteria:**
- [ ] "My Templates" library
- [ ] Save current design as template
- [ ] Apply template to new project
- [ ] Templates include: layout, fonts, color scheme, lockable elements

**Priority:** P2 (Post-MVP)  
**Effort:** 8 points

---

#### US-P7: Bulk Generate Designs
**As a** planner,  
**I want to** generate designs for multiple clients at once,  
**So that** I can work more efficiently.

**Acceptance Criteria:**
- [ ] Select multiple clients → "Batch Generate"
- [ ] Upload CSV with wedding details (names, dates, venues)
- [ ] Generates designs for all clients (queued)
- [ ] Email notification when batch is complete
- [ ] Review each design individually

**Priority:** P2 (Post-MVP)  
**Effort:** 13 points

---

#### US-P8: Export Client-Branded Proofs
**As a** planner,  
**I want to** add my logo to proof PDFs,  
**So that** clients see my branding.

**Acceptance Criteria:**
- [ ] Upload logo in settings
- [ ] Logo appears on proof cover page or footer
- [ ] Optional: custom proof template (letterhead style)

**Priority:** P2 (Post-MVP)  
**Effort:** 5 points

---

### 2.4 Billing & Payments

#### US-P9: Bill Clients Directly
**As a** planner,  
**I want to** generate invoices for clients,  
**So that** I can mark up design + print costs.

**Acceptance Criteria:**
- [ ] Set markup percentage (e.g., 20% on top of base cost)
- [ ] Generate invoice with line items (design, printing, shipping)
- [ ] Send invoice via email or shareable link
- [ ] Client pays directly (Stripe link)
- [ ] Funds go to planner's Stripe account (not platform)

**Priority:** P1  
**Effort:** 8 points  
**Dependencies:** Stripe Connect

---

#### US-P10: Track Subscription Usage
**As a** planner,  
**I want to** see my monthly usage (designs, prints, storage),  
**So that** I know if I need to upgrade my plan.

**Acceptance Criteria:**
- [ ] Dashboard shows: designs this month, print orders, team seats
- [ ] Progress bars for plan limits
- [ ] "Upgrade Plan" button if nearing limits
- [ ] Usage history (past 12 months)

**Priority:** P1  
**Effort:** 5 points

---

### 2.5 Collaboration

#### US-P11: Leave Internal Notes
**As a** planner,  
**I want to** add private notes to client workspaces,  
**So that** my team has context (without clients seeing).

**Acceptance Criteria:**
- [ ] "Notes" panel (visible to team, not clients)
- [ ] Rich text editor (bold, lists, links)
- [ ] @mention team members
- [ ] Timestamped (who wrote what)

**Priority:** P2 (Post-MVP)  
**Effort:** 5 points

---

#### US-P12: Receive Approval Notifications
**As a** planner,  
**I want to** get notified when a client approves a proof,  
**So that** I can proceed to ordering.

**Acceptance Criteria:**
- [ ] In-app notification badge
- [ ] Email notification (configurable)
- [ ] Notification shows: client name, project, timestamp
- [ ] Click → opens project

**Priority:** P1  
**Effort:** 3 points

---

## 3. Artist Persona

### 3.1 Onboarding

#### US-A1: Apply to Artist Program
**As an** artist,  
**I want to** apply to become a Mardi Studio Pro artist,  
**So that** I can monetize my work.

**Acceptance Criteria:**
- [ ] Application form: name, portfolio URL, Instagram, style description
- [ ] Upload 5-10 sample images
- [ ] Agree to terms (IP licensing, royalty split)
- [ ] Admin reviews application (3-5 business days)
- [ ] Approval email with onboarding instructions

**Priority:** P0 (MVP)  
**Effort:** 5 points

---

#### US-A2: Complete Artist Profile
**As an** artist,  
**I want to** create a public profile,  
**So that** brides can discover my work.

**Acceptance Criteria:**
- [ ] Profile fields: bio, website, Instagram, artistic statement
- [ ] Upload profile photo and cover image
- [ ] Select tags: watercolor, botanical, modern, vintage, etc.
- [ ] Set availability: open for commissions, limited slots, waitlist
- [ ] Profile page URL: mardistudio.pro/artists/{username}

**Priority:** P1  
**Effort:** 5 points

---

### 3.2 Model Training

#### US-A3: Upload Artwork for Training
**As an** artist,  
**I want to** upload high-resolution scans of my art,  
**So that** the AI can learn my style.

**Acceptance Criteria:**
- [ ] Bulk upload: drag & drop or file picker (up to 500 images)
- [ ] File requirements: 300-600 DPI, CMYK or RGB, PNG/JPG/TIFF
- [ ] Progress bar for uploads
- [ ] Thumbnail gallery of uploaded images
- [ ] Edit metadata: title, medium, year, private/public
- [ ] Min requirement: 100 images (suggested: 300-500)

**Priority:** P0 (MVP)  
**Effort:** 8 points  
**Dependencies:** Asset Storage

---

#### US-A4: Review Curated Dataset
**As an** artist,  
**I want to** see which images the AI selected for training,  
**So that** I can approve or reject them.

**Acceptance Criteria:**
- [ ] Curation pipeline auto-tags: quality score, colors, motifs
- [ ] Artist reviews: approve, reject, flag for removal
- [ ] Reasons for rejection: low quality, not my style, copyright issue
- [ ] Re-run curation if needed

**Priority:** P1  
**Effort:** 8 points  
**Dependencies:** Curation Pipeline

---

#### US-A5: Train My AI Model
**As an** artist,  
**I want to** initiate model training,  
**So that** my style can be used for generating designs.

**Acceptance Criteria:**
- [ ] "Start Training" button (disabled until 100+ images approved)
- [ ] Training takes 2-6 hours (progress updates via email)
- [ ] Receive sample generations for review
- [ ] Approve or request re-training (if results are poor)
- [ ] Model version: v1.0

**Priority:** P0 (MVP)  
**Effort:** 13 points  
**Dependencies:** Training Orchestrator

---

#### US-A6: Test My Model
**As an** artist,  
**I want to** generate test designs using my model,  
**So that** I can verify quality before going live.

**Acceptance Criteria:**
- [ ] "Playground" mode: enter prompts, see generations
- [ ] Adjust settings: style strength, color palette, composition
- [ ] Download test images
- [ ] Unlimited free test generations (before publishing)
- [ ] Feedback form to report issues

**Priority:** P1  
**Effort:** 5 points

---

#### US-A7: Publish Model to Marketplace
**As an** artist,  
**I want to** publish my model to the public marketplace,  
**So that** brides can use my style for their invitations.

**Acceptance Criteria:**
- [ ] Admin QA approval required (5-10 test generations reviewed)
- [ ] Set royalty terms: 40% default (negotiable for exclusive contracts)
- [ ] Choose visibility: public marketplace, private (planners only), exclusive (one client)
- [ ] Launch date: immediate or scheduled
- [ ] Publish announcement (email to waitlist, social media)

**Priority:** P0 (MVP)  
**Effort:** 5 points

---

### 3.3 Model Management

#### US-A8: Update My Model
**As an** artist,  
**I want to** re-train my model with new artwork,  
**So that** it stays current with my evolving style.

**Acceptance Criteria:**
- [ ] Upload additional images (incremental training)
- [ ] Train new version (v1.1, v1.2, etc.)
- [ ] A/B test: v1.0 vs v1.1 (platform assigns traffic randomly)
- [ ] Choose to rollback if new version performs worse
- [ ] Version history with metrics (usage, revenue, ratings)

**Priority:** P2 (Post-MVP)  
**Effort:** 8 points

---

#### US-A9: Set Usage Restrictions
**As an** artist,  
**I want to** control how my model is used,  
**So that** I protect my brand.

**Acceptance Criteria:**
- [ ] Blacklist keywords (e.g., "Halloween," "political")
- [ ] Approve/reject specific use cases (weddings OK, corporate no)
- [ ] Watermark option for non-purchased designs
- [ ] Collaboration opt-in: allow mixing with other artists' models

**Priority:** P2 (Post-MVP)  
**Effort:** 5 points

---

#### US-A10: Pause or Unpublish Model
**As an** artist,  
**I want to** temporarily unpublish my model,  
**So that** I can take a break or update my portfolio.

**Acceptance Criteria:**
- [ ] "Pause" button → model hidden from marketplace
- [ ] Existing projects can still use it (grandfathered)
- [ ] New projects cannot select it
- [ ] "Unpublish" → full removal (requires admin approval)
- [ ] Re-publish anytime

**Priority:** P2 (Post-MVP)  
**Effort:** 3 points

---

### 3.4 Earnings & Analytics

#### US-A11: View Earnings Dashboard
**As an** artist,  
**I want to** see how much I've earned,  
**So that** I can track my passive income.

**Acceptance Criteria:**
- [ ] Dashboard shows: total earnings, this month, pending, paid out
- [ ] Chart: earnings over time (last 12 months)
- [ ] Breakdown by project/client (anonymized)
- [ ] Estimated next payout date

**Priority:** P0 (MVP)  
**Effort:** 8 points

---

#### US-A12: Understand Royalty Splits
**As an** artist,  
**I want to** see how royalties are calculated,  
**So that** I understand my compensation.

**Acceptance Criteria:**
- [ ] Royalty calculator: bride pays $500 → you earn $200 (40%)
- [ ] Detailed breakdown per order: design fee, print cost, artist share, platform fee
- [ ] Explanation of split percentages
- [ ] Special rates for collaborations (split with other artists)

**Priority:** P1  
**Effort:** 3 points

---

#### US-A13: Request Payout
**As an** artist,  
**I want to** withdraw my earnings,  
**So that** I can transfer money to my bank account.

**Acceptance Criteria:**
- [ ] Payout threshold: $50 minimum
- [ ] Connect Stripe account (or provide bank details)
- [ ] "Request Payout" → funds transfer in 2-5 business days
- [ ] Payout history with transaction IDs
- [ ] 1099 tax forms generated annually (US artists)

**Priority:** P0 (MVP)  
**Effort:** 8 points  
**Dependencies:** Stripe Connect

---

#### US-A14: View Usage Analytics
**As an** artist,  
**I want to** see how often my model is used,  
**So that** I can understand my popularity.

**Acceptance Criteria:**
- [ ] Metrics: total generations, unique users, designs ordered (vs abandoned)
- [ ] Top keywords used with my model
- [ ] Customer satisfaction: ratings/reviews mentioning my style
- [ ] Compare my model to platform average

**Priority:** P1  
**Effort:** 5 points

---

### 3.5 Community & Marketing

#### US-A15: Showcase My Work
**As an** artist,  
**I want to** feature my best designs on my profile,  
**So that** I attract more customers.

**Acceptance Criteria:**
- [ ] Pin favorite designs to profile (up to 10)
- [ ] Add case studies: "Featured in [client] wedding"
- [ ] Embed Instagram posts
- [ ] Share profile link on social media (custom OG image)

**Priority:** P2 (Post-MVP)  
**Effort:** 5 points

---

#### US-A16: Collaborate with Other Artists
**As an** artist,  
**I want to** co-create models with other artists,  
**So that** we can offer unique blended styles.

**Acceptance Criteria:**
- [ ] Invite another artist to collaboration
- [ ] Both upload images → combined training dataset
- [ ] Royalty split: 50/50 default (adjustable)
- [ ] Both artists must approve to publish
- [ ] Joint profile page for collaboration

**Priority:** P3 (Future)  
**Effort:** 13 points

---

#### US-A17: Receive Customer Testimonials
**As an** artist,  
**I want to** see what brides say about my style,  
**So that** I can use testimonials for marketing.

**Acceptance Criteria:**
- [ ] Brides can tag artist in reviews
- [ ] Testimonials appear on artist profile
- [ ] Artist can request permission to reshare on Instagram
- [ ] Export testimonials as images (social media templates)

**Priority:** P2 (Post-MVP)  
**Effort:** 5 points

---

## 4. Stationer/Print Shop Persona

### 4.1 Integration

#### US-S1: Connect My Print Shop
**As a** print shop owner,  
**I want to** integrate with Mardi Studio Pro,  
**So that** I can receive orders automatically.

**Acceptance Criteria:**
- [ ] API key generation in partner portal
- [ ] Webhook URL configuration (order notifications)
- [ ] Test mode: send sample orders to verify integration
- [ ] Documentation: API specs, file format requirements

**Priority:** P1  
**Effort:** 8 points

---

#### US-S2: Specify My Capabilities
**As a** print shop,  
**I want to** list my printing capabilities (foil, letterpress, paper types),  
**So that** I only receive orders I can fulfill.

**Acceptance Criteria:**
- [ ] Capability checklist: digital, offset, letterpress, foil stamping, embossing
- [ ] Paper stock inventory: cotton 300gsm, 400gsm, textured, etc.
- [ ] Geographic coverage: regions served
- [ ] Lead times: standard (7-10 days), rush (3-5 days)
- [ ] Max/min order quantities

**Priority:** P1  
**Effort:** 5 points

---

#### US-S3: Set Pricing
**As a** print shop,  
**I want to** submit wholesale pricing,  
**So that** the platform can route profitable orders to me.

**Acceptance Criteria:**
- [ ] Price sheet upload (CSV or API)
- [ ] Pricing by: quantity, paper type, finishes
- [ ] Volume discounts: 100+, 200+, 500+
- [ ] Shipping rates by zone
- [ ] Price update frequency: weekly or on-demand

**Priority:** P1  
**Effort:** 5 points

---

### 4.2 Order Fulfillment

#### US-S4: Receive Print-Ready Files
**As a** print shop,  
**I want to** receive PDF/X-1a files with bleed and trim marks,  
**So that** I don't have to fix prepress issues.

**Acceptance Criteria:**
- [ ] Files delivered via secure download link (S3 signed URL)
- [ ] PDF/X-1a compliance verified by platform
- [ ] ICC profiles embedded (FOGRA39/GRACoL)
- [ ] Separate files for: CMYK base, foil plates (if applicable)
- [ ] Job ticket (JSON): quantity, paper, finishes, shipping address

**Priority:** P0 (MVP)  
**Effort:** 8 points  
**Dependencies:** Preflight Service

---

#### US-S5: Report Print Issues
**As a** print shop,  
**I want to** flag files with problems,  
**So that** the platform can fix them before I print.

**Acceptance Criteria:**
- [ ] Issue categories: color out-of-gamut, low resolution, missing bleed
- [ ] Upload screenshot of issue
- [ ] Platform auto-fixes (if possible) and re-sends file
- [ ] If unfixable, order is paused → customer notified
- [ ] Track issue frequency (impacts routing score)

**Priority:** P1  
**Effort:** 5 points

---

#### US-S6: Update Order Status
**As a** print shop,  
**I want to** send status updates (in production, shipped),  
**So that** customers can track their orders.

**Acceptance Criteria:**
- [ ] API or portal to update status: confirmed, in production, QC passed, shipped
- [ ] Upload tracking number (UPS/USPS/FedEx)
- [ ] Estimated delivery date
- [ ] Webhook triggers notifications to customer

**Priority:** P1  
**Effort:** 5 points

---

#### US-S7: Handle Reprints
**As a** print shop,  
**I want to** initiate reprints for defective orders,  
**So that** I can maintain quality standards.

**Acceptance Criteria:**
- [ ] Mark order as "defect" with reason (color mismatch, damage)
- [ ] Upload photos of defect
- [ ] Reprint at no extra cost (shop absorbs cost)
- [ ] Platform tracks defect rate per shop (impacts routing)

**Priority:** P1  
**Effort:** 5 points

---

### 4.3 Invoicing & Payments

#### US-S8: Submit Invoices
**As a** print shop,  
**I want to** send invoices to the platform,  
**So that** I get paid for completed orders.

**Acceptance Criteria:**
- [ ] Auto-generated invoice (based on order + pricing)
- [ ] Manual invoice upload (PDF) for custom orders
- [ ] Payment terms: Net 15, Net 30
- [ ] Batch invoicing (weekly or monthly)

**Priority:** P1  
**Effort:** 5 points

---

#### US-S9: Track Payments
**As a** print shop,  
**I want to** see payment status for my invoices,  
**So that** I know when to expect funds.

**Acceptance Criteria:**
- [ ] Dashboard: pending invoices, paid, overdue
- [ ] Payment history with transaction IDs
- [ ] Automated reminders for overdue payments
- [ ] Export for accounting (CSV, QuickBooks integration)

**Priority:** P1  
**Effort:** 5 points

---

### 4.4 Analytics

#### US-S10: View Order Volume
**As a** print shop,  
**I want to** see my order trends,  
**So that** I can forecast capacity.

**Acceptance Criteria:**
- [ ] Chart: orders per week/month
- [ ] Breakdown by: paper type, finishes, quantity
- [ ] Seasonal trends (wedding season spikes)
- [ ] Projected orders (based on platform growth)

**Priority:** P2 (Post-MVP)  
**Effort:** 5 points

---

#### US-S11: Track Quality Metrics
**As a** print shop,  
**I want to** see my defect rate and customer satisfaction,  
**So that** I can improve quality.

**Acceptance Criteria:**
- [ ] Metrics: defect rate, on-time delivery, customer ratings
- [ ] Compare to platform average
- [ ] Alerts if metrics drop below threshold
- [ ] Access to customer feedback (anonymized)

**Priority:** P2 (Post-MVP)  
**Effort:** 5 points

---

## 5. Platform Admin Persona

### 5.1 User Management

#### US-AD1: Review Artist Applications
**As an** admin,  
**I want to** review and approve artist applications,  
**So that** we maintain quality standards.

**Acceptance Criteria:**
- [ ] Queue of pending applications
- [ ] View portfolio, samples, bio
- [ ] Approve, reject (with reason), or request more info
- [ ] Email notification sent to artist
- [ ] Track approval rate, avg review time

**Priority:** P0 (MVP)  
**Effort:** 5 points

---

#### US-AD2: Moderate Content
**As an** admin,  
**I want to** review flagged designs,  
**So that** I can remove inappropriate content.

**Acceptance Criteria:**
- [ ] Flag categories: copyright violation, offensive, low quality
- [ ] Review interface: see design, user info, flag reason
- [ ] Actions: approve, remove, warn user, ban user
- [ ] Log all moderation actions (audit trail)

**Priority:** P1  
**Effort:** 5 points

---

#### US-AD3: Manage User Accounts
**As an** admin,  
**I want to** view and edit user accounts,  
**So that** I can resolve support issues.

**Acceptance Criteria:**
- [ ] Search users by email, name, order ID
- [ ] View user profile: projects, orders, payment history
- [ ] Edit details (change email, reset password)
- [ ] Refund orders, issue credits
- [ ] Ban/suspend accounts (with reason logged)

**Priority:** P1  
**Effort:** 5 points

---

### 5.2 Model Management

#### US-AD4: QA Artist Models
**As an** admin,  
**I want to** review trained models before they go live,  
**So that** we ensure quality.

**Acceptance Criteria:**
- [ ] Queue of models pending QA
- [ ] Generate 10 test samples with diverse prompts
- [ ] Rate quality: composition, style fidelity, print-readiness
- [ ] Approve, reject (with feedback to artist), or request re-training
- [ ] Track QA metrics: avg review time, approval rate

**Priority:** P0 (MVP)  
**Effort:** 8 points

---

#### US-AD5: Monitor Model Performance
**As an** admin,  
**I want to** see metrics for all models,  
**So that** I can identify underperforming ones.

**Acceptance Criteria:**
- [ ] Model leaderboard: sorted by usage, revenue, ratings
- [ ] Filters: date range, artist, style
- [ ] Alerts: model with < 3-star rating, zero usage in 30 days
- [ ] Recommendations: suggest artists for re-training

**Priority:** P1  
**Effort:** 5 points

---

### 5.3 Order Management

#### US-AD6: View All Orders
**As an** admin,  
**I want to** see all platform orders,  
**So that** I can monitor fulfillment.

**Acceptance Criteria:**
- [ ] Order dashboard: filters by status, date, print partner
- [ ] Search by order ID, customer name
- [ ] Export to CSV
- [ ] Metrics: total orders, avg order value, fulfillment rate

**Priority:** P1  
**Effort:** 5 points

---

#### US-AD7: Resolve Order Issues
**As an** admin,  
**I want to** manually intervene on problematic orders,  
**So that** I can ensure customer satisfaction.

**Acceptance Criteria:**
- [ ] Actions: change print partner, expedite shipping, issue refund
- [ ] Contact customer directly (in-app messaging)
- [ ] Log all interventions (audit trail)
- [ ] Escalate to print partner if needed

**Priority:** P1  
**Effort:** 5 points

---

### 5.4 Print Partner Management

#### US-AD8: Onboard Print Partners
**As an** admin,  
**I want to** add new print partners,  
**So that** we expand capacity.

**Acceptance Criteria:**
- [ ] Partner profile: name, contact, capabilities, pricing
- [ ] API integration setup (test mode)
- [ ] Send test order to verify workflow
- [ ] Activate partner for production traffic
- [ ] Set initial routing weight (% of orders)

**Priority:** P1  
**Effort:** 8 points

---

#### US-AD9: Monitor Partner Performance
**As an** admin,  
**I want to** track print partner metrics,  
**So that** I can optimize routing.

**Acceptance Criteria:**
- [ ] Metrics per partner: on-time rate, defect rate, cost
- [ ] Compare partners side-by-side
- [ ] Adjust routing rules based on performance
- [ ] Pause partner if metrics drop below threshold

**Priority:** P1  
**Effort:** 8 points

---

### 5.5 Platform Analytics

#### US-AD10: View Revenue Dashboard
**As an** admin,  
**I want to** see platform revenue metrics,  
**So that** I can track business health.

**Acceptance Criteria:**
- [ ] Metrics: MRR, ARR, GMV, gross margin, COGS
- [ ] Charts: revenue over time, cohort retention
- [ ] Breakdown: bride vs planner revenue, artist royalties
- [ ] Projections: run-rate, growth rate

**Priority:** P1  
**Effort:** 8 points

---

#### US-AD11: Track Operational Metrics
**As an** admin,  
**I want to** monitor system performance,  
**So that** I can ensure uptime and speed.

**Acceptance Criteria:**
- [ ] Metrics: API latency, GPU queue depth, error rates
- [ ] Alerts: service downtime, slow response times
- [ ] Cost tracking: GPU spend, storage, CDN
- [ ] Logs: recent errors, webhook failures

**Priority:** P1  
**Effort:** 8 points

---

#### US-AD12: Generate Reports
**As an** admin,  
**I want to** export custom reports,  
**So that** I can share with stakeholders.

**Acceptance Criteria:**
- [ ] Report builder: select metrics, date range, filters
- [ ] Export formats: CSV, PDF, Google Sheets
- [ ] Scheduled reports (weekly, monthly)
- [ ] Email delivery to team

**Priority:** P2 (Post-MVP)  
**Effort:** 8 points

---

## 6. Guest (Recipient) Persona

### 6.1 Receiving Invitation

#### US-G1: Scan QR Code to RSVP
**As a** wedding guest,  
**I want to** scan a QR code on my invitation,  
**So that** I can RSVP online easily.

**Acceptance Criteria:**
- [ ] QR code on invitation → mobile-friendly RSVP page
- [ ] Auto-populated: guest name, event details
- [ ] Form: attending yes/no, dietary restrictions, plus-one
- [ ] Submit → confirmation email

**Priority:** P2 (Post-MVP)  
**Effort:** 8 points

---

#### US-G2: View Event Details
**As a** wedding guest,  
**I want to** see venue, directions, and schedule,  
**So that** I know where and when to go.

**Acceptance Criteria:**
- [ ] Event page: date, time, venue name, map
- [ ] Directions link (Google Maps, Apple Maps)
- [ ] Schedule: ceremony, cocktail hour, reception
- [ ] Dress code, parking info, hotel recommendations

**Priority:** P2 (Post-MVP)  
**Effort:** 5 points

---

#### US-G3: Add Event to Calendar
**As a** wedding guest,  
**I want to** save the event to my calendar,  
**So that** I don't forget.

**Acceptance Criteria:**
- [ ] "Add to Calendar" button
- [ ] Formats: Apple Calendar, Google Calendar, Outlook
- [ ] Calendar event includes: date, time, location, notes

**Priority:** P3 (Future)  
**Effort:** 3 points

---

---

## Summary Statistics

### By Persona
- **Bride/Couple:** 18 user stories
- **Wedding Planner:** 12 user stories
- **Artist:** 17 user stories
- **Stationer/Print Shop:** 11 user stories
- **Platform Admin:** 12 user stories
- **Guest:** 3 user stories

**Total:** 73 user stories

### By Priority
- **P0 (MVP):** 23 stories
- **P1:** 31 stories
- **P2 (Post-MVP):** 17 stories
- **P3 (Future):** 2 stories

### Estimated Effort
- **Total Story Points:** ~450 points (assuming 1 point = 1 dev-day)
- **MVP Scope:** ~140 points (3-4 months with 2 engineers)
- **Full Platform:** ~450 points (9-12 months with 3-4 engineers)

---

## Appendix: User Story Template

```markdown
#### US-{PERSONA}{NUMBER}: {Title}
**As a** {persona},  
**I want to** {action},  
**So that** {benefit}.

**Acceptance Criteria:**
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

**Priority:** P0/P1/P2/P3  
**Effort:** {story points}  
**Dependencies:** {service/feature}
```

---

**Document Maintained By:** Product Team  
**Last Review:** November 4, 2025  
**Next Review:** December 1, 2025

