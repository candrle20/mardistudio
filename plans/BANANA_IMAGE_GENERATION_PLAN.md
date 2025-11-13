# Google Gemini Image Generation Implementation Plan

**Version:** 2.0  
**Date:** November 8, 2025  
**Status:** Ready for Implementation  
**Author:** Development Team  
**API Provider:** Google Gemini (Imagen)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Google Gemini/Imagen Overview](#2-google-geminimagen-overview)
3. [Current State Analysis](#3-current-state-analysis)
4. [Architecture Design](#4-architecture-design)
   - 4.4 [Multimodal Inputs & Controlled Generation](#44-multimodal-inputs--controlled-generation)
   - 4.5 [Print-Ready Export Pipeline](#45-print-ready-export-pipeline)
5. [Implementation Phases](#5-implementation-phases)
6. [Technical Specifications](#6-technical-specifications)
7. [API Integration Details (Gemini)](#7-api-integration-details-gemini)
8. [Testing Strategy](#8-testing-strategy)
9. [Cost Analysis](#9-cost-analysis)
10. [Security & Best Practices](#10-security--best-practices)
11. [Monitoring & Analytics](#11-monitoring--analytics)
12. [Rollback Plan](#12-rollback-plan)
13. [Future Enhancements](#13-future-enhancements)

---

## 1. Executive Summary

### 1.1 Objective
Implement production-ready AI image generation for Mardi Studio Pro using Google's Gemini API (Imagen 3). This will enable users to generate high-quality, artist-style wedding stationery designs with exceptional quality and safety filters.

### 1.2 Key Goals
- ✅ Generate 5×7" invitations in < 5 seconds (P95)
- ✅ Support multiple artist styles via prompt engineering
- ✅ Handle concurrent users with Google's auto-scaling
- ✅ Maintain < $0.04/generation cost
- ✅ Leverage Google's built-in safety filters
- ✅ Integrate seamlessly with GCP infrastructure

### 1.3 Timeline
- **Phase 1 (Week 1):** Setup & Basic Integration - 3 days
- **Phase 2 (Week 1):** Production Features - 2 days
- **Phase 3 (Week 2):** Testing & Optimization - 3 days
- **Phase 4 (Week 2):** Launch & Monitoring - 2 days

**Total: 10 days** (vs 4 weeks with Banana.dev)

### 1.4 Success Metrics
- Generation latency P95 < 5s
- 99.9% success rate
- Zero exposed API keys
- Cost per generation < $0.04
- User satisfaction > 4.5/5

---

## 2. Google Gemini/Imagen Overview

### 2.1 What is Google Gemini/Imagen?
Google's Imagen 3 is a state-of-the-art text-to-image model available through:
- **Gemini API** (imagen-3.0-generate-001) - Simplified REST API
- **Vertex AI** - Enterprise features with fine-tuning support
- **Built-in Features:**
  - High-quality image generation
  - Automatic safety filtering
  - Style transfer capabilities
  - Multiple aspect ratios
  - Watermark detection
  - Integrated with Google Cloud

### 2.2 Why Gemini/Imagen for Mardi Studio Pro?
| Feature | Gemini/Imagen | Banana.dev | Replicate |
|---------|--------------|------------|-----------|
| **Cost** | $0.02-0.04/image | $0.08-0.10/image | $0.10-0.15/image |
| **Latency** | 3-5s | 8-15s (warm) | 5-10s |
| **Setup Time** | < 1 hour | 2-3 days | 1 day |
| **Custom Models** | Style prompts | Full control | Limited |
| **Safety Filters** | Built-in ✅ | Manual | Manual |
| **GCP Integration** | Native ✅ | External | External |
| **Scaling** | Automatic ✅ | Manual config | Automatic |

**Decision:** Gemini/Imagen offers faster setup, lower cost, better integration, and enterprise-grade reliability.

### 2.3 Gemini Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                      Mardi Studio Pro                       │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Next.js Frontend  →  API Route  →  Gemini SDK       │  │
│  └───────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────┘
                             │ HTTPS POST
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                    Google Cloud Platform                     │
│  ┌────────────────┐  ┌────────────────┐  ┌───────────────┐ │
│  │  Gemini API    │→ │  Imagen Model  │→ │  Cloud Storage│ │
│  │  Gateway       │  │  (Managed)     │  │  (GCS)        │ │
│  └────────────────┘  └────────────────┘  └───────────────┘ │
│                             │                                │
│                             │ Synchronous Response (3-5s)    │
│                             ▼                                │
│  ┌─────────────────────────────────────────────────────────┐│
│  │         Return: { imageUrl, base64 }                    ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Current State Analysis

### 3.1 Existing Components
From the codebase review, we have:
- ✅ **AIGenerationPanel** (`components/ai/AIGenerationPanel.tsx`) - UI ready
- ✅ **ai-store** (`stores/ai-store.ts`) - State management (can be simplified - no polling needed!)
- ⚠️ **API Route** (`app/api/generate/route.ts`) - Placeholder only
- ❌ **Gemini Integration** - Not implemented
- ✅ **GCP Infrastructure** - Already mentioned in architecture docs

### 3.2 Gaps to Address
1. **No actual AI inference** - Mock jobId returned
2. **No image storage** - Need GCS bucket setup
3. **No artist style prompts** - Prompt engineering for styles
4. **No error handling** - Retries, safety filter handling
5. **No cost tracking** - API usage monitoring
6. **Job tracking simplified** - Gemini is synchronous (3-5s), no async jobs needed!

### 3.3 Dependencies Required
```json
{
  "@google/generative-ai": "^0.1.3",  // Gemini SDK (lightweight)
  "@google-cloud/storage": "^7.7.0",   // GCS for image storage
  "uuid": "^9.0.0",
  "sharp": "^0.32.0"  // Image processing/optimization
}
```

**Advantages of Gemini:**
- ✅ **No database needed** for job tracking (synchronous responses)
- ✅ **No webhooks needed** (direct response)
- ✅ **Simpler architecture** (fewer moving parts)
- ✅ **Faster implementation** (10 days vs 4 weeks)

---

## 4. Architecture Design

### 4.1 System Flow (Simplified with Gemini!)

```
┌────────────────────────────────────────────────────────────┐
│                      User Journey                          │
└────────────────────────────────────────────────────────────┘

1. User enters prompt + selects style → AIGenerationPanel
2. Frontend calls: POST /api/generate
3. API route:
   - Validates input
   - Constructs style-enhanced prompt
   - Calls Gemini API (synchronous, 3-5s wait)
   - Receives base64 image directly
   - Uploads to GCS
   - Returns imageUrl immediately
4. Frontend displays image, adds to canvas

✅ No polling needed!
✅ No database jobs table needed!
✅ No webhooks needed!
```

### 4.2 Database Schema (Optional - for analytics only)

```sql
-- Optional: Track generations for analytics and cost monitoring
CREATE TABLE generation_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) NOT NULL,
  project_id UUID REFERENCES projects(id),
  
  -- Input
  prompt TEXT NOT NULL,
  style_id VARCHAR(255) NOT NULL,
  aspect_ratio VARCHAR(10) DEFAULT '5x7',
  
  -- Results
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  
  -- Metadata
  generation_time_ms INT,
  cost_usd DECIMAL(10, 4),
  model_version VARCHAR(50) DEFAULT 'imagen-3.0',
  safety_filtered BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_history_user_id ON generation_history(user_id);
CREATE INDEX idx_history_created_at ON generation_history(created_at);

-- This table is OPTIONAL - only for analytics!
```

### 4.3 Environment Variables

```bash
# Google Gemini/Imagen Configuration
GOOGLE_GEMINI_API_KEY=your_api_key_here  # From Google AI Studio
# Or use service account (recommended for production):
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
GOOGLE_CLOUD_PROJECT=mardi-studio-pro

# Storage Configuration (GCS)
GCS_BUCKET=mardi-studio-generations
GCS_BUCKET_PUBLIC_URL=https://storage.googleapis.com/mardi-studio-generations

# App Configuration
NEXT_PUBLIC_APP_URL=https://mardistudio.pro
MAX_REQUESTS_PER_MINUTE=60  # Gemini rate limit
GENERATION_TIMEOUT_MS=10000  # 10 seconds max

# Artist Style Library (optional)
STYLE_PROMPTS_PATH=./config/artist-styles.json
```

---

### 4.4 Multimodal Inputs & Controlled Generation

We support three input modes to create perfectly designed stationery:

1) Text-only prompting (fastest)
- Input: user prompt + selected style
- Output: new background/artwork image honoring style + aspect ratio
- Use: exploration and quick ideation

2) Prompt + reference images (style/palette guidance)
- Input: user prompt + 1–3 reference images (color palette, florals, motifs)
- Output: image guided by references (style and palette consistency)
- Use: match brand colors, incorporate artist motifs

3) Image-to-image edit with canvas masks (layout-safe refinement)
- Input: base image (from current canvas export), optional mask derived from canvas “protected zones” (text boxes, logos), plus prompt
- Output: edited image preserving masked regions; only background/art flourishes are changed
- Use: preserve text/layout while improving background artwork

Mask generation from canvas (server-side helper):
- Export current canvas JSON
- Compute “protected areas” from text/image objects (expand by 8–16 px padding for safety)
- Build binary PNG mask: white = editable, black = preserved; holes for text regions
- Pass mask + base image to Imagen Edit endpoint

Safeguards:
- Enforce max input image size (e.g., 2048 px) to control latency/cost
- Validate reference images (type, size, content)
- Fallback to text-only if references are invalid or safety-filtered

---

### 4.5 Print-Ready Export Pipeline

Goal: guarantee printer-ready output with professional prepress standards.

Pipeline:
1. Canvas composition (client)
- Place generated image as locked background layer
- Keep text layers vector-like in canvas model

2. High-DPI render (server)
- Upload canvas JSON + assets to /api/export/pdf
- Reconstruct layout at target DPI (300 DPI at final trim size + 0.125" bleed)
- Convert RGB artwork to CMYK with ICC profile (e.g., GRACoL)
- Embed fonts (subset) and convert strokes to outlines where required

3. Preflight checks (server)
- DPI ≥ 300
- CMYK only (no RGB/Lab)
- Bleed present on all edges (0.125")
- Safe zone respected (0.25")
- Fonts embedded/subsetted
- Optional: generate foil/letterpress spot plates

4. Output artifacts
- PDF/X-1a compliant file with crop marks
- Optional ZIP bundle: PDF + plates + low-res proof

Implementation notes:
- Node path: pdf-lib + sharp for light MVP; consider Python microservice for strict PDF/X-1a compliance (Ghostscript, pikepdf) post-MVP
- Color: apply CMYK transform with ICC profiles; flag out-of-gamut colors with warnings
- Metadata: embed generation lineage (prompt, styleId, model version) for QA and royalties

---

## 5. Implementation Phases

### Phase 1: Setup & Basic Integration (Days 1-3)

#### Day 1: Google Cloud Setup (2 hours)
**Tasks:**
- [ ] Enable Vertex AI API in GCP console
- [ ] Create GCS bucket for image storage
- [ ] Set up service account with appropriate permissions
- [ ] Get Gemini API key from Google AI Studio
- [ ] Test API access via curl/Postman

**Deliverables:**
- API key or service account credentials
- GCS bucket configured with public read access
- Test image generation via Vertex AI console

**Commands:**
```bash
# Enable APIs
gcloud services enable aiplatform.googleapis.com storage.googleapis.com

# Create GCS bucket
gsutil mb -p mardi-studio-pro -c STANDARD -l us-central1 gs://mardi-studio-generations

# Make bucket publicly readable
gsutil iam ch allUsers:objectViewer gs://mardi-studio-generations

# Create service account
gcloud iam service-accounts create imagen-generator \
  --display-name="Imagen Generator Service Account"

# Grant permissions
gcloud projects add-iam-policy-binding mardi-studio-pro \
  --member="serviceAccount:imagen-generator@mardi-studio-pro.iam.gserviceaccount.com" \
  --role="roles/aiplatform.user"
```

**Estimated Time:** 2 hours

---

#### Day 1 (continued): Dependencies & Basic Structure (3 hours)
**Tasks:**
- [ ] Install dependencies (`@google/generative-ai`, `@google-cloud/storage`)
- [ ] Create Gemini client wrapper
- [ ] Create GCS storage utilities
- [ ] Set up environment variables
- [ ] Create artist style prompt library

**Files to Create:**
```
lib/gemini/client.ts  (Gemini API wrapper)
lib/storage/gcs.ts    (GCS upload utilities)
config/artist-styles.json  (Style prompt templates)
```

**Code Example - Gemini Client:**
```typescript
// lib/gemini/client.ts
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

interface GenerateImageParams {
  prompt: string;
  aspectRatio?: '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
  negativePrompt?: string;
}

export class GeminiImageGenerator {
  async generateImage(params: GenerateImageParams): Promise<{
    imageData: string; // base64
    mimeType: string;
  }> {
    const model = genAI.getGenerativeModel({ 
      model: "imagen-3.0-generate-001" 
    });
    
    const result = await model.generateContent({
      contents: [{
        role: 'user',
        parts: [{
          text: `Generate an image: ${params.prompt}. 
                 ${params.negativePrompt ? `Avoid: ${params.negativePrompt}` : ''}`
        }]
      }],
      generationConfig: {
        aspectRatio: params.aspectRatio || '3:4',  // 5x7 invitation ratio
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
    });
    
    const response = result.response;
    const image = response.candidates[0].content.parts[0].inlineData;
    
    return {
      imageData: image.data,
      mimeType: image.mimeType,
    };
  }
}

export const geminiClient = new GeminiImageGenerator();
```

**Estimated Time:** 3 hours

---

#### Day 2: API Route Implementation (5 hours)
**Tasks:**
- [ ] Implement POST /api/generate
- [ ] Add input validation (Zod schema)
- [ ] Integrate Gemini client
- [ ] Upload generated images to GCS
- [ ] Handle errors and safety filters
- [ ] Add rate limiting
- [ ] Test end-to-end flow

**Files to Create/Update:**
```
app/api/generate/route.ts  (full implementation)
lib/validation/generation.ts  (Zod schemas)
lib/rate-limit.ts  (rate limiting middleware)
```

**Code Example - API Route:**
```typescript
// app/api/generate/route.ts
import { NextResponse } from 'next/server';
import { geminiClient } from '@/lib/gemini/client';
import { uploadImageToGCS } from '@/lib/storage/gcs';
import { enhancePromptWithStyle } from '@/lib/prompts/styles';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

const GenerateSchema = z.object({
  prompt: z.string().min(5).max(500),
  styleId: z.string(),
  aspectRatio: z.enum(['5x7', '4x6', 'square']).default('5x7'),
});

export async function POST(request: Request) {
  try {
    // 1. Parse and validate input
    const body = await request.json();
    const { prompt, styleId, aspectRatio } = GenerateSchema.parse(body);
    
    // 2. Enhance prompt with artist style
    const enhancedPrompt = enhancePromptWithStyle(prompt, styleId);
    
    // 3. Generate image with Gemini
    const startTime = Date.now();
    const { imageData, mimeType } = await geminiClient.generateImage({
      prompt: enhancedPrompt,
      aspectRatio: aspectRatio === '5x7' ? '3:4' : aspectRatio === '4x6' ? '2:3' : '1:1',
      negativePrompt: 'blurry, low quality, distorted, text, watermark, logo',
    });
    const generationTime = Date.now() - startTime;
    
    // 4. Convert base64 to buffer
    const imageBuffer = Buffer.from(imageData, 'base64');
    
    // 5. Upload to GCS
    const filename = `${uuidv4()}.png`;
    const { imageUrl, thumbnailUrl } = await uploadImageToGCS(imageBuffer, filename);
    
    // 6. Return result immediately (no polling needed!)
    return NextResponse.json({
      success: true,
      imageUrl,
      thumbnailUrl,
      generationTime,
      cost: 0.02,  // Imagen pricing
    });
    
  } catch (error: any) {
    console.error('Generation error:', error);
    
    // Handle safety filter blocks
    if (error.message?.includes('SAFETY')) {
      return NextResponse.json({
        error: 'Content filtered by safety systems. Please rephrase your prompt.',
      }, { status: 400 });
    }
    
    return NextResponse.json({
      error: 'Generation failed. Please try again.',
    }, { status: 500 });
  }
}
```

**Estimated Time:** 5 hours

---

#### Day 3: Frontend Integration & Artist Styles (6 hours)
**Tasks:**
- [ ] Update ai-store to remove polling logic
- [ ] Simplify generation flow (direct response)
- [ ] Create artist style prompt library
- [ ] Add error handling for safety filters
- [ ] Add loading states (simpler now!)
- [ ] Test with multiple style variations
- [ ] Add reference image uploader (drag/drop up to 3 images)
- [ ] Add “Use current canvas as base” toggle
- [ ] Generate/preview mask from canvas text boxes (protected zones)
- [ ] Controls: quality (preview/proof/print), aspect ratio sync with canvas tab

**Files to Update:**
```
stores/ai-store.ts
components/ai/AIGenerationPanel.tsx
config/artist-styles.json
lib/prompts/styles.ts
```

**Artist Styles Library:**
```json
// config/artist-styles.json
{
  "watercolor-floral": {
    "name": "Watercolor Floral",
    "artistName": "Maria Rodriguez",
    "promptModifier": "in a soft watercolor style with delicate pink roses, botanical elements, flowing brushstrokes, romantic pastel colors, hand-painted aesthetic, elegant and dreamy",
    "negativePrompt": "digital art, photograph, 3d render, harsh lines, neon colors"
  },
  "modern-minimalist": {
    "name": "Modern Minimalist",
    "artistName": "Sarah Chen",
    "promptModifier": "in a modern minimalist style with clean geometric shapes, gold accents, simple lines, contemporary design, elegant typography, white space, luxury aesthetic",
    "negativePrompt": "cluttered, busy, vintage, ornate, floral"
  },
  "botanical-illustration": {
    "name": "Botanical Illustration",
    "artistName": "Emma Thompson",
    "promptModifier": "in a detailed botanical illustration style with eucalyptus leaves, scientific accuracy, fine linework, natural green tones, vintage botanical print aesthetic, hand-drawn details",
    "negativePrompt": "cartoonish, simplified, abstract, colorful, modern"
  }
}
```

**Prompt Enhancement:**
```typescript
// lib/prompts/styles.ts
import artistStyles from '@/config/artist-styles.json';

export function enhancePromptWithStyle(userPrompt: string, styleId: string): string {
  const style = artistStyles[styleId];
  if (!style) return userPrompt;
  
  return `${userPrompt}, ${style.promptModifier}. 
          Design for a 5x7 inch wedding invitation. 
          High quality, print-ready, professional.`;
}

export function getNegativePrompt(styleId: string): string {
  const style = artistStyles[styleId];
  return style?.negativePrompt || 'blurry, low quality, distorted';
}
```

**Simplified Store:**
```typescript
// stores/ai-store.ts (simplified)
export const useAIStore = create<AIStore>((set) => ({
  isGenerating: false,
  
  generate: async (prompt: string, styleId: string) => {
    set({ isGenerating: true });
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, styleId }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Generation failed');
      }
      
      set({ isGenerating: false });
      return data.imageUrl;  // Done! No polling needed!
      
    } catch (error) {
      set({ isGenerating: false });
      throw error;
    }
  },
}));
```

**Estimated Time:** 6 hours

---

### Phase 2: Production Features (Days 4-5)

#### Day 4: Multi-Resolution & Optimization (5 hours)
**Tasks:**
- [ ] Add quality parameter (preview/proof/print)
- [ ] Implement image optimization with Sharp
- [ ] Add thumbnail generation
- [ ] Add image metadata (dimensions, file size)
- [ ] Test different aspect ratios
- [ ] Optimize GCS upload performance

**Quality Configurations:**
```typescript
type ImageQuality = 'preview' | 'proof' | 'print';

const QUALITY_CONFIGS = {
  preview: {
    aspectRatio: '3:4',
    targetWidth: 512,
    description: 'Fast preview (3s, $0.02)',
  },
  proof: {
    aspectRatio: '3:4',
    targetWidth: 1024,
    description: 'High quality proof (4s, $0.03)',
  },
  print: {
    aspectRatio: '3:4',
    targetWidth: 2048,
    description: 'Print-ready (5s, $0.04)',
  },
};
```

**Estimated Time:** 5 hours

---

#### Day 5: Error Handling & Rate Limiting (6 hours)
**Tasks:**
- [ ] Add retry logic (3 attempts with exponential backoff)
- [ ] Handle Gemini rate limits (60 RPM)
- [ ] Add user-friendly error messages
- [ ] Implement per-user rate limiting (10/day free tier)
- [ ] Add cost tracking
- [ ] Log errors to Sentry
- [ ] Create admin dashboard for monitoring

**Rate Limiting:**
```typescript
// lib/rate-limit.ts
const RATE_LIMITS = {
  free: { requests: 10, period: 86400 },  // 10/day
  bride: { requests: 50, period: 86400 },  // 50/day
  planner: { requests: 200, period: 2592000 },  // 200/month
};

export async function checkRateLimit(userId: string, tier: string = 'free'): Promise<boolean> {
  const limit = RATE_LIMITS[tier];
  // Implementation using Redis or in-memory cache
}
```

**Estimated Time:** 6 hours

---

### Phase 3: Testing & Optimization (Days 6-8)

#### Day 6-7: Testing (8 hours total)
**Tasks:**
- [ ] Unit tests for API routes
- [ ] Test Gemini client wrapper
- [ ] Test GCS storage operations
- [ ] Integration tests (end-to-end generation)
- [ ] Test error scenarios (safety filters, timeouts)
- [ ] Test rate limiting
- [ ] Performance testing (latency measurements)
- [ ] Test multiple style variations

**Test Coverage Goals:**
- API routes: 90%+
- Utility functions: 95%+
- Error handling: 100%

**Estimated Time:** 8 hours

---

#### Day 8: Documentation & Optimization (5 hours)
**Tasks:**
- [ ] Write API documentation
- [ ] Create troubleshooting guide
- [ ] Document Gemini setup process
- [ ] Optimize image processing pipeline
- [ ] Add monitoring and logging
- [ ] Update README

**Estimated Time:** 5 hours

---

### Phase 4: Launch & Monitoring (Days 9-10)

#### Day 9: Staging Deployment (5 hours)
**Tasks:**
- [ ] Deploy to staging environment
- [ ] Test with real Gemini API
- [ ] Invite beta users (5-10)
- [ ] Monitor for errors
- [ ] Collect feedback
- [ ] Fix critical bugs

**Estimated Time:** 5 hours

---

#### Day 10: Production Launch (4 hours)
**Tasks:**
- [ ] Deploy to production
- [ ] Enable monitoring (Sentry, Datadog)
- [ ] Set up alerts
- [ ] Monitor costs
- [ ] Announce launch

**Estimated Time:** 4 hours

---

## 6. Technical Specifications

### 6.1 API Endpoint: POST /api/generate

**Request:**
```typescript
POST /api/generate
Content-Type: application/json
Authorization: Bearer {jwt_token}

{
  "prompt": "Elegant watercolor floral design with soft pink roses",
  "styleId": "watercolor-floral",
  "aspectRatio": "5x7",  // or "4x6", "square"
  "quality": "proof"  // "preview" | "proof" | "print"
}
```

**Response (Success):**
```json
{
  "success": true,
  "imageUrl": "https://storage.googleapis.com/mardi-studio-generations/uuid.png",
  "thumbnailUrl": "https://storage.googleapis.com/mardi-studio-generations/thumbs/uuid.png",
  "generationTime": 3200,
  "cost": 0.02,
  "dimensions": {
    "width": 1024,
    "height": 1536
  }
}
```

**Response (Rate Limited):**
```json
{
  "error": "Rate limit exceeded",
  "message": "You have used 10/10 free generations today. Upgrade to continue.",
  "resetAt": "2025-11-09T00:00:00Z"
}
```

**Response (Safety Filter):**
```json
{
  "error": "Content filtered",
  "message": "Your prompt was flagged by safety filters. Please rephrase and try again."
}
```

---

### 6.2 Gemini Image Generation Flow

```typescript
// Complete flow with all features
async function generateWeddingInvitation(
  prompt: string,
  styleId: string,
  quality: 'preview' | 'proof' | 'print' = 'proof'
): Promise<GenerationResult> {
  // 1. Enhance prompt with style
  const enhancedPrompt = enhancePromptWithStyle(prompt, styleId);
  
  // 2. Call Gemini API
  const { imageData, mimeType } = await geminiClient.generateImage({
    prompt: enhancedPrompt,
    aspectRatio: '3:4',
    negativePrompt: getNegativePrompt(styleId),
  });
  
  // 3. Process image (optimize, resize, create thumbnail)
  const processedImage = await processImage(imageData, quality);
  
  // 4. Upload to GCS
  const urls = await uploadToGCS(processedImage);
  
  // 5. Track analytics (optional)
  await trackGeneration({
    userId,
    prompt,
    styleId,
    cost: PRICING[quality],
  });
  
  return urls;
}
```

#### Day 11: Unit Tests
**Tasks:**
- [ ] Test API routes (generate, status, webhook)
- [ ] Test Banana client wrapper
- [ ] Test database operations
- [ ] Test storage upload/download
- [ ] Test rate limiting logic

**Test Files:**
```
__tests__/api/generate.test.ts
__tests__/lib/banana.test.ts
__tests__/lib/storage.test.ts
```

**Estimated Time:** 6 hours

---

#### Day 12: Integration Tests
**Tasks:**
- [ ] End-to-end generation flow
- [ ] Webhook delivery and processing
- [ ] LoRA adapter loading
- [ ] Multi-user concurrent generation
- [ ] Error scenarios (timeout, failure, invalid input)

**Estimated Time:** 6 hours

---

#### Day 13: Performance Testing
**Tasks:**
- [ ] Load test with 100 concurrent users
- [ ] Measure P50, P95, P99 latencies
- [ ] Test cold start times
- [ ] Optimize slow queries
- [ ] Add database indexes
- [ ] Configure Banana auto-scaling

**Performance Targets:**
- P95 generation time: < 10s (warm)
- P95 generation time: < 30s (cold start)
- API latency: < 200ms
- Webhook processing: < 1s

**Estimated Time:** 6 hours

---

#### Day 14: Security Audit
**Tasks:**
- [ ] Rotate API keys
- [ ] Add webhook signature verification
- [ ] Sanitize user inputs (prevent prompt injection)
- [ ] Add CORS restrictions
- [ ] Test for SQL injection
- [ ] Add CSP headers
- [ ] Encrypt sensitive data at rest

**Security Checklist:**
- ✅ API keys in environment variables (not code)
- ✅ Webhook signatures verified
- ✅ User input sanitized
- ✅ Rate limiting enabled
- ✅ HTTPS only
- ✅ Database connections encrypted

**Estimated Time:** 4 hours

---

#### Day 15: Documentation & Handoff
**Tasks:**
- [ ] Write API documentation
- [ ] Create troubleshooting guide
- [ ] Document Banana.dev setup process
- [ ] Create runbook for common issues
- [ ] Record demo video
- [ ] Update README

**Documentation Files:**
```
docs/API.md  (API endpoints)
docs/BANANA_SETUP.md  (Banana.dev config)
docs/TROUBLESHOOTING.md  (Common issues)
docs/RUNBOOK.md  (Operations guide)
```

**Estimated Time:** 4 hours

---

### Phase 4: Launch & Monitoring (Week 4: Days 16-17)

#### Day 16: Staging Deployment
**Tasks:**
- [ ] Deploy to staging environment
- [ ] Test with real Banana.dev account
- [ ] Invite beta users (5-10)
- [ ] Monitor for errors
- [ ] Collect feedback
- [ ] Fix critical bugs

**Estimated Time:** 6 hours

---

#### Day 17: Production Launch
**Tasks:**
- [ ] Deploy to production
- [ ] Enable monitoring (Sentry, Datadog)
- [ ] Set up alerts (latency > 30s, errors > 5%)
- [ ] Monitor GPU costs
- [ ] Announce launch
- [ ] On-call rotation

**Monitoring Dashboards:**
- Generation volume (requests/hour)
- Success rate (%)
- Average latency (P50, P95)
- Cost per generation
- Error rate by type

**Estimated Time:** 4 hours

---

 

## 7. API Integration Details (Gemini)

### 7.1 Text-to-Image (Generate)
```typescript
// app/api/generate/route.ts (core flow excerpt)
const { imageData, mimeType } = await geminiClient.generateImage({
  prompt: enhancedPrompt,
  aspectRatio: '3:4',
  negativePrompt: getNegativePrompt(styleId),
});
const buffer = Buffer.from(imageData, 'base64');
const { imageUrl, thumbnailUrl } = await uploadImageToGCS(buffer, `${uuidv4()}.png`);
```

### 7.2 Image-to-Image Edit (Base + Mask)
```typescript
// app/api/generate/edit/route.ts (new)
// Inputs: baseImageUrl, maskPngUrl (white=editable, black=preserve), prompt, styleId
import { geminiEditImage } from '@/lib/gemini/edit';

export async function POST(request: Request) {
  const { baseImageUrl, maskUrl, prompt, styleId } = await request.json();
  const baseImage = await fetchAsBase64(baseImageUrl);
  const maskImage = await fetchAsBase64(maskUrl); // PNG mask

  const enhancedPrompt = enhancePromptWithStyle(prompt, styleId);
  const { imageData } = await geminiEditImage({
    baseImageBase64: baseImage,
    maskBase64: maskImage,
    prompt: enhancedPrompt,
  });

  const buffer = Buffer.from(imageData, 'base64');
  const { imageUrl } = await uploadImageToGCS(buffer, `${uuidv4()}.png`);
  return NextResponse.json({ imageUrl });
}
```

### 7.3 Style Reference Guidance (Prompt + References)
```typescript
// lib/gemini/client.ts (support references)
async generateWithReferences({ prompt, references }: {
  prompt: string;
  references: Array<{ mimeType: string; dataBase64: string }>;
}) {
  const model = genAI.getGenerativeModel({ model: 'imagen-3.0-generate-001' });
  const parts = [
    ...references.map(r => ({ inlineData: { data: r.dataBase64, mimeType: r.mimeType } })),
    { text: prompt },
  ];
  const res = await model.generateContent({ contents: [{ role: 'user', parts }] });
  const image = res.response.candidates[0].content.parts[0].inlineData;
  return { imageData: image.data, mimeType: image.mimeType };
}
```

### 7.4 Storage (GCS)
```typescript
// lib/storage/gcs.ts
import { Storage } from '@google-cloud/storage';
import sharp from 'sharp';

const storage = new Storage();
const bucketName = process.env.GCS_BUCKET!;
const publicBase = process.env.GCS_BUCKET_PUBLIC_URL!;

export async function uploadImageToGCS(buffer: Buffer, filename: string) {
  const bucket = storage.bucket(bucketName);

  // Upload original
  const [file] = await bucket.file(`generations/${filename}`).save(buffer, {
    contentType: 'image/png',
    resumable: false,
    public: true,
  });

  // Thumbnail
  const thumb = await sharp(buffer).resize(300, 450, { fit: 'cover' }).png().toBuffer();
  await bucket.file(`generations/thumbs/${filename}`).save(thumb, {
    contentType: 'image/png',
    resumable: false,
    public: true,
  });

  return {
    imageUrl: `${publicBase}/generations/${filename}`,
    thumbnailUrl: `${publicBase}/generations/thumbs/${filename}`,
  };
}
```

---

## 8. Testing Strategy

### 8.1 Unit Tests

```typescript
// __tests__/lib/gemini.test.ts
import { geminiClient } from '@/lib/gemini/client';

describe('GeminiClient', () => {
  it('should generate image with valid params', async () => {
    const result = await geminiClient.generateImage({ prompt: 'Test prompt', aspectRatio: '3:4' });
    
    expect(result).toHaveProperty('imageData');
    expect(result).toHaveProperty('mimeType');
  });
  
  it('should handle timeout errors', async () => {
    // Mock timeout scenario
    jest.setTimeout(150000);
    
    await expect(
      geminiClient.generateImage({ prompt: 'Complex prompt', aspectRatio: '3:4' })
    ).rejects.toThrow('Timeout');
  });
});
```

---

### 8.2 Integration Tests

```typescript
// __tests__/api/generate.integration.test.ts
describe('POST /api/generate', () => {
  it('should return imageUrl on success', async () => {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test_token',
      },
      body: JSON.stringify({
        prompt: 'Watercolor roses',
        styleId: 'watercolor-floral',
        aspectRatio: '5x7',
      }),
    });
    
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data).toHaveProperty('imageUrl');
  });
  
  it('should enforce rate limits', async () => {
    // Make 11 requests (over limit)
    for (let i = 0; i < 11; i++) {
      const response = await fetch('/api/generate', {
        method: 'POST',
        // ... same as above
      });
      
      if (i === 10) {
        expect(response.status).toBe(429);
      }
    }
  });
});
```

---

### 8.3 Load Tests (using k6)

```javascript
// load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 10 },   // Ramp up to 10 users
    { duration: '5m', target: 50 },   // Sustain 50 users
    { duration: '2m', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<30000'], // 95% under 30s
    http_req_failed: ['rate<0.05'],     // < 5% failure rate
  },
};

export default function () {
  const payload = JSON.stringify({
    prompt: 'Elegant wedding invitation',
    styleId: 'watercolor-floral',
    quality: 'preview',
  });
  
  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer test_token',
    },
  };
  
  const res = http.post('https://staging.mardistudio.pro/api/generate', payload, params);
  
  check(res, {
    'status is 200': (r) => r.status === 200,
    'has jobId': (r) => JSON.parse(r.body).jobId !== undefined,
  });
  
  sleep(1);
}
```

---

## 9. Cost Analysis

### 9.1 Gemini/Imagen Pricing (est.)
- Imagen 3 via Gemini API: ~$0.02–$0.04 per image (region and usage dependent)
- No cold start complexity (managed); latency typically 3–5s

### 9.2 Cost Per Generation (Assumptions)
- Preview (512–768 px): ~$0.02
- Proof (1024–1536 px): ~$0.03
- Print (≈2048 px background, then vector text in PDF): ~$0.04

Note: For print, we keep AI output as background art at ~2K px and render final PDF at 300 DPI with vector text and CMYK transform; we avoid 6K px AI output to control cost/latency.

### 9.3 Monthly Cost Estimates

Scenario: 1,000 orders/month
- 10 previews/order: 10,000 × $0.02 = $200
- 2 proofs/order: 2,000 × $0.03 = $60
- 1 print background/order: 1,000 × $0.04 = $40
- Storage (GCS): ~20GB/month ≈ $0.48 + egress (low)
- Total: ≈ $300–$320/month

Per-order AI cost: ~$0.30–$0.32 (still negligible vs AOV $700+)

---

## 10. Security & Best Practices

### 10.1 API Key Management
```bash
# NEVER commit to Git
.env
.env.local
.env.production

# Store in environment (local dev)
GOOGLE_GEMINI_API_KEY=sk_xxxxxxxxxxxxx
GOOGLE_APPLICATION_CREDENTIALS=./service-account.json

# For production, use secret managers
# GCP Secret Manager, Vercel Env Vars
```

### 10.2 Input Sanitization
```typescript
import { z } from 'zod';

const GenerationSchema = z.object({
  prompt: z.string()
    .min(5, 'Prompt too short')
    .max(500, 'Prompt too long')
    .regex(/^[a-zA-Z0-9\s,.'!-]+$/, 'Invalid characters'),
  styleId: z.string(),
  quality: z.enum(['preview', 'proof', 'print']),
});

// In API route:
try {
  const validated = GenerationSchema.parse(body);
} catch (error) {
  return Response.json({ error: 'Invalid input' }, { status: 400 });
}
```

### 10.3 Rate Limiting (per user)
```typescript
// Tiers
const RATE_LIMITS = {
  free: 10,      // 10/day
  bride: 50,     // 50/order
  planner: 200,  // 200/month
  unlimited: Infinity,
};
```

### 10.4 Webhook Security
N/A for core Gemini flow (synchronous). If webhooks are added (e.g., for other services):
- Verify signatures
- HTTPS only
- Idempotency keys
- Short TTL on webhook URLs

---

## 11. Monitoring & Analytics

### 11.1 Key Metrics

**Business Metrics:**
- Generations per day
- Success rate (%)
- Average time to first generation (user activation)
- Cost per generation
- Revenue per generation

**Technical Metrics:**
- P50, P95, P99 latency
- Cold start rate (%)
- Error rate by type
- Queue depth
- GPU utilization

**User Metrics:**
- Regeneration rate (how often users retry)
- Prompt length distribution
- Most popular styles
- Time of day usage patterns

### 11.2 Alerting

```yaml
alerts:
  - name: High Error Rate
    condition: error_rate > 5%
    window: 5m
    severity: critical
    
  - name: Slow Generation
    condition: p95_latency > 30s
    window: 10m
    severity: warning
    
  - name: High GPU Cost
    condition: daily_cost > $100
    window: 1d
    severity: warning
    
  - name: Queue Overflow
    condition: queue_depth > 50
    window: 5m
    severity: critical
```

### 11.3 Dashboards

**Operations Dashboard:**
- Generation volume (24h, 7d, 30d)
- Success/failure breakdown
- Average latency trends
- Cost trends
- Top errors

**User Dashboard:**
- Active users
- New user activation rate
- User satisfaction (ratings)
- Feature usage (styles, quality levels)

---

## 12. Rollback Plan

### 12.1 Rollback Triggers
- Error rate > 10%
- P95 latency > 60s
- Gemini/Imagen service outage
- Database issues
- Security incident

### 12.2 Rollback Steps
1. **Immediate:** Revert API route to previous version
2. **Graceful degradation:** Show "AI generation temporarily unavailable"
3. **Fallback:** Allow manual image upload
4. **Communication:** Notify users via banner
5. **Post-mortem:** Document issue, root cause, prevention

### 12.3 Fallback Mode
```typescript
// Feature flag
const AI_GENERATION_ENABLED = process.env.FEATURE_AI_GENERATION === 'true';

if (!AI_GENERATION_ENABLED) {
  return Response.json({
    error: 'Service temporarily unavailable',
    fallback: 'upload',  // Show upload button
  }, { status: 503 });
}
```

---

## 13. Future Enhancements

### 13.1 Phase 5: Advanced Features (M4-M6)

1. **Style Mixing**
   - Blend 2+ artist styles
   - Weight control (70% watercolor + 30% modern)

2. **ControlNet Integration**
   - Provide sketch/wireframe for layout control
   - Pose control for illustrated characters

3. **Inpainting**
   - Edit specific regions of generated image
   - "Change the flowers to blue"

4. **Real-time Preview**
   - Show generation progress (intermediate steps)
   - Preview at step 10, 20, 30

5. **Batch Generation**
   - Generate 4-10 variations at once
   - Side-by-side comparison

6. **Custom Training**
   - Users upload their own photos
   - Train personalized LoRA (couple's photos)

7. **Video Generation**
   - Animated invitations (MP4)
   - Zoom/pan effects

### 13.2 Alternative Providers

If Banana.dev doesn't meet needs, consider:
- **Replicate** - Easy setup, higher cost
- **Modal** - Great developer experience
- **RunPod** - Lowest cost, more setup
- **Baseten** - Enterprise features
- **Self-hosted** - Max control, high ops burden

---

## 14. Success Criteria

### 14.1 Technical Success
- ✅ 99.5% uptime
- ✅ P95 latency < 10s
- ✅ < 2% error rate
- ✅ Cost per generation < $0.10
- ✅ Zero security incidents

### 14.2 Business Success
- ✅ 100 generations in first week
- ✅ 1,000 generations in first month
- ✅ User rating > 4.5/5
- ✅ 80%+ users complete generation flow
- ✅ < 5% refund/complaint rate

### 14.3 User Success
- ✅ Generation complete in < 15 seconds
- ✅ "Easy to use" rating > 4/5
- ✅ 70%+ users generate 2+ variations
- ✅ 50%+ users add image to canvas
- ✅ 30%+ users order prints

---

## 15. Timeline Summary

| Week | Phase | Focus | Deliverables |
|------|-------|-------|-------------|
| **Week 1** | Phase 1 | Setup & Integration | Basic generation working |
| **Week 2** | Phase 2 | Production Features | LoRA, multi-res, retry |
| **Week 3** | Phase 3 | Testing & Optimization | Tests, performance, security |
| **Week 4** | Phase 4 | Launch | Staging → Production |

**Total Effort:** ~80-100 hours (2-3 weeks for 1 full-time developer)

---

## 16. Next Steps

### Immediate Actions (Week 1, Day 1)
1. [ ] Enable Vertex AI and set up Gemini API key (or service account)
2. [ ] Create GCS bucket and configure public read (objects)
3. [ ] Install dependencies (`@google/generative-ai`, `@google-cloud/storage`, `sharp`)
4. [ ] Implement POST `/api/generate` (text-to-image)
5. [ ] Add artist style prompt library (`config/artist-styles.json`)
6. [ ] Wire AIGenerationPanel to new endpoint (remove polling)

### Weekly Checkpoints
- **End of Week 1:** Text-to-image live; references and edit endpoint prototyped
- **End of Week 2:** Multimodal (references + edit with mask) and print export complete
- **End of Week 3:** Tests passing, security audited
- **End of Week 4:** Live in production with monitoring

---

## 17. Contacts & Resources

### Google Resources
- **Gemini API (Imagen) Docs:** https://ai.google.dev/docs
- **Vertex AI Imagen:** https://cloud.google.com/vertex-ai/docs/generative-ai/image
- **Google Cloud Storage:** https://cloud.google.com/storage/docs
- **AI Studio:** https://aistudio.google.com

### Internal Resources
- **Project Lead:** [Name]
- **Backend Engineer:** [Name]
- **DevOps:** [Name]
- **On-call Rotation:** [Link to PagerDuty]

---

## Appendix A: Banana.dev Docker Setup
This section intentionally removed. Gemini/Imagen is fully managed; no custom Docker required.

---

## Appendix B: Environment Variables Template

```bash
# .env.local (Development)
# Copy this to .env.local and fill in values

# Gemini/Imagen
GOOGLE_GEMINI_API_KEY=your_api_key_here
GOOGLE_APPLICATION_CREDENTIALS=./service-account.json
GOOGLE_CLOUD_PROJECT=mardi-studio-pro

# Google Cloud Storage
GCS_BUCKET=mardi-studio-dev
GCS_BUCKET_PUBLIC_URL=https://storage.googleapis.com/mardi-studio-dev

# Database (if using external DB)
DATABASE_URL=postgresql://user:pass@localhost:5432/mardi_studio

# Redis (for rate limiting)
UPSTASH_REDIS_URL=your_redis_url
UPSTASH_REDIS_TOKEN=your_redis_token

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
MAX_REQUESTS_PER_MINUTE=60
GENERATION_TIMEOUT_MS=10000

# Monitoring
SENTRY_DSN=your_sentry_dsn
SENTRY_ENV=development
```

---

## Document End

**Status:** Ready for Implementation  
**Next Review:** Weekly during implementation  
**Questions?** Contact project lead

---

**Good luck with the build! 🚀🍌**

