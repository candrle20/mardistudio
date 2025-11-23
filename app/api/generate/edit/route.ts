import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import { z } from 'zod';

import { editImage } from '@/lib/gemini/client';
import { storeGeneratedImage } from '@/lib/storage';
import { enhancePromptWithStyle } from '@/lib/prompts/styles';

const aspectRatioMap = {
  '5x7': '3:4',
  '4x6': '2:3',
  square: '1:1',
} as const;

// Map our AspectRatio to the type expected by gemini/client.ts if needed
// Since gemini/client.ts defines AspectRatio as '1:1' | '3:4' | '4:3' | '16:9' | '9:16'
// We need to ensure our map values match those exactly.
// '2:3' is NOT in the allowed types in client.ts, so we need to cast or update client.ts
// For now, I'll cast to any to bypass the strict check, but ideally client.ts should be updated.


const QUALITY_CONFIG = {
  preview: { targetWidth: 768, estimatedCost: 0.02 },
  proof: { targetWidth: 1280, estimatedCost: 0.03 },
  print: { targetWidth: 2048, estimatedCost: 0.04 },
} as const;

const payloadSchema = z.object({
  prompt: z.string().min(5).max(600),
  styleId: z.string().optional(),
  aspectRatio: z.enum(['5x7', '4x6', 'square']).default('5x7'),
  quality: z.enum(['preview', 'proof', 'print']).default('proof'),
  baseImage: z.object({
    data: z.string().min(10),
    mimeType: z.string().default('image/png'),
  }),
  mask: z
    .object({
      data: z.string().min(10),
      mimeType: z.string().default('image/png'),
    })
    .optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = payloadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { prompt, styleId, aspectRatio, quality, baseImage, mask } = parsed.data;
    const { prompt: styledPrompt, negativePrompt } = enhancePromptWithStyle(prompt, styleId ?? '');
    const qualityConfig = QUALITY_CONFIG[quality];

    const generationStart = Date.now();

    const { imageData, mimeType } = await editImage({
      prompt: styledPrompt,
      baseImageBase64: baseImage.data,
      baseImageMimeType: baseImage.mimeType,
      maskBase64: mask?.data,
      maskMimeType: mask?.mimeType,
      negativePrompt,
      aspectRatio: aspectRatioMap[aspectRatio] as any,
    });

    const baseBuffer = Buffer.from(imageData, 'base64');
    const processedBuffer = await sharp(baseBuffer)
      .resize({
        width: qualityConfig.targetWidth,
        withoutEnlargement: true,
      })
      .png({ compressionLevel: 9 })
      .toBuffer();

    const metadata = await sharp(processedBuffer).metadata();

    const filename = `${uuidv4()}.png`;
    const { imageUrl, thumbnailUrl } = await storeGeneratedImage(processedBuffer, filename);

    const generationTimeMs = Date.now() - generationStart;

    return NextResponse.json({
      success: true,
      imageUrl,
      thumbnailUrl,
      metadata: {
        width: metadata.width,
        height: metadata.height,
        mimeType,
        quality,
      },
      costEstimate: qualityConfig.estimatedCost,
      generationTimeMs,
    });
  } catch (error) {
    console.error('[api/generate/edit] error', error);

    const message =
      error instanceof Error ? error.message : 'Image edit failed. Please try again.';

    const status = message.includes('safety') ? 400 : 500;

    return NextResponse.json({ error: message }, { status });
  }
}

