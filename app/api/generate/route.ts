import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import { z } from 'zod';

import { generateImage } from '@/lib/gemini/client';
import { storeGeneratedImage } from '@/lib/storage';
import { processGeneratedImage } from '@/lib/processing/image-processor';
import { enhancePromptWithStyle } from '@/lib/prompts/styles';

const aspectRatioMap = {
  '5x7': '3:4',
  '4x6': '2:3',
  square: '1:1',
} as const;

const QUALITY_CONFIG = {
  preview: { targetWidth: 768, estimatedCost: 0.02 },
  proof: { targetWidth: 1280, estimatedCost: 0.03 },
  print: { targetWidth: 2048, estimatedCost: 0.04 },
} as const;

const TEMPLATE_TYPE_ENUM = z.enum([
  'invitation',
  'rsvp',
  'menu',
  'program',
  'thank-you',
  'envelope',
  'sign',
  'blank',
]);

const MAX_RENDER_DIMENSION = 4096;
const QUALITY_MULTIPLIER = {
  preview: 1,
  proof: 1.35,
  print: 1.75,
} as const;

const GenerateSchema = z.object({
  prompt: z.string().min(5).max(2000),
  styleId: z.string().optional(),
  aspectRatio: z.enum(['5x7', '4x6', 'square']).default('5x7'),
  quality: z.enum(['preview', 'proof', 'print']).default('proof'),
  templateType: TEMPLATE_TYPE_ENUM.optional(),
  templateName: z.string().max(120).optional(),
  templateSize: z
    .object({
      width: z.number().min(100).max(MAX_RENDER_DIMENSION),
      height: z.number().min(100).max(MAX_RENDER_DIMENSION),
    })
    .optional(),
  references: z
    .array(
      z.object({
        data: z.string().min(10),
        mimeType: z.string().default('image/png'),
      })
    )
    .optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = GenerateSchema.safeParse(body);

    if (!parsed.success) {
      console.error('[api/generate] validation error', parsed.error.flatten());
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const {
      prompt,
      styleId,
      aspectRatio,
      quality,
      references,
      templateSize,
      templateType,
      templateName,
    } = parsed.data;
    const { prompt: styledPrompt, negativePrompt } = enhancePromptWithStyle(prompt, styleId ?? '');

    const generationStart = Date.now();

    const { imageData, mimeType } = await generateImage({
      prompt: styledPrompt,
      negativePrompt,
      aspectRatio: aspectRatioMap[aspectRatio],
      references: references?.map((ref) => ({
        dataBase64: ref.data,
        mimeType: ref.mimeType,
      })),
    });

    const baseBuffer = Buffer.from(imageData, 'base64');
    const qualityConfig = QUALITY_CONFIG[quality];

    let targetWidth = qualityConfig.targetWidth;
    let targetHeight: number | undefined;

    if (templateSize) {
      targetWidth = Math.min(Math.round(templateSize.width), MAX_RENDER_DIMENSION);
      targetHeight = Math.min(Math.round(templateSize.height), MAX_RENDER_DIMENSION);
    } else {
      const multiplier = QUALITY_MULTIPLIER[quality];
      targetWidth = Math.round(targetWidth * multiplier);
    }

    const resizeOptions: sharp.ResizeOptions = {
      width: targetWidth,
      fit: templateSize ? 'cover' : 'inside',
      position: 'centre',
      withoutEnlargement: !templateSize,
    };

    if (targetHeight) {
      resizeOptions.height = targetHeight;
    }

    const processedBuffer = await sharp(baseBuffer)
      .resize(resizeOptions)
      .png({ compressionLevel: 9 })
      .toBuffer();

    const metadata = await sharp(processedBuffer).metadata();

    const filename = `${uuidv4()}.png`;
    const { imageUrl, thumbnailUrl } = await storeGeneratedImage(processedBuffer, filename);

    const processingResult = await processGeneratedImage({
      filename,
      buffer: processedBuffer,
      source: {
        filename,
        imageUrl,
        thumbnailUrl,
        width: metadata.width,
        height: metadata.height,
        mimeType,
      },
      template: {
        type: templateType,
        name: templateName,
        width: templateSize?.width,
        height: templateSize?.height,
      },
    });

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
      processing: {
        metadataUrl: processingResult.metadataUrl,
        status: processingResult.status,
      },
    });
  } catch (error) {
    console.error('[api/generate] error', error);

    const message =
      error instanceof Error ? error.message : 'Image generation failed. Please try again.';

    const status = message.includes('safety') ? 400 : 500;

    return NextResponse.json(
      {
        error: message,
      },
      { status }
    );
  }
}