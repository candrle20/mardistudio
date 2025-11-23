import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import { z } from 'zod';
import { readFile } from 'fs/promises';
import { join } from 'path';

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
  inspirationUrl: z.string().optional(), // Relaxed: allows local paths
  elementUrls: z.array(z.string()).optional(), // Relaxed: allows local paths
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

async function fetchImageAsBase64(url: string): Promise<{ data: string; mimeType: string } | null> {
  try {
    // Handle data URLs directly
    if (url.startsWith('data:')) {
      const match = url.match(/^data:(.*?);base64,(.*)$/);
      if (match) {
        return { mimeType: match[1], data: match[2] };
      }
      return null;
    }

    // Handle local file uploads directly from disk
    if (url.startsWith('/api/uploads/')) {
      const filename = url.replace('/api/uploads/', '');
      // Prevent directory traversal
      const safeFilename = filename.replace(/^(\.\.[\/\\])+/, '');
      const filepath = join(process.cwd(), 'uploads', safeFilename);
      
      const fileBuffer = await readFile(filepath);
      // Simple mime type detection or default to png
      const mimeType = filename.endsWith('.jpg') || filename.endsWith('.jpeg') 
        ? 'image/jpeg' 
        : 'image/png';
        
      return {
        data: fileBuffer.toString('base64'),
        mimeType,
      };
    }

    // Handle external URLs
    const response = await fetch(url);
    if (!response.ok) return null;
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mimeType = response.headers.get('content-type') || 'image/png';
    return {
      data: buffer.toString('base64'),
      mimeType,
    };
  } catch (error) {
    console.error('Error fetching inspiration image:', error);
    return null;
  }
}

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
      inspirationUrl,
      elementUrls,
      aspectRatio,
      quality,
      references: existingReferences,
      templateSize,
      templateType,
      templateName,
    } = parsed.data;

    // We still use enhancePromptWithStyle for basic wedding context if styleId is missing,
    // or we can modify it to be more generic.
    // For now, passing empty styleId gives generic wedding context.
    const { prompt: styledPrompt, negativePrompt } = enhancePromptWithStyle(prompt, styleId ?? '');

    const generationStart = Date.now();

    // Process References - Split into Layout vs Elements
    let layoutReference: { dataBase64: string; mimeType: string } | undefined = undefined;
    const elementReferences: Array<{ dataBase64: string; mimeType: string }> = [];
    const genericReferences: Array<{ dataBase64: string; mimeType: string }> = [];

    // 1. Handle Inspiration URL -> Layout Reference
    if (inspirationUrl) {
      const ref = await fetchImageAsBase64(inspirationUrl);
      if (ref) {
        layoutReference = { dataBase64: ref.data, mimeType: ref.mimeType };
      }
    }

    // 2. Handle Element URLs -> Element References
    if (elementUrls && elementUrls.length > 0) {
      const elementPromises = elementUrls.map(url => fetchImageAsBase64(url));
      const elementRefs = await Promise.all(elementPromises);
      
      elementRefs.forEach(ref => {
        if (ref) {
          elementReferences.push({ dataBase64: ref.data, mimeType: ref.mimeType });
        }
      });
    }

    // 3. Handle generic user-uploaded references (Legacy)
    if (existingReferences) {
      existingReferences.forEach(ref => {
        genericReferences.push({ dataBase64: ref.data, mimeType: ref.mimeType });
      });
    }

    const { imageData, mimeType } = await generateImage({
      prompt: styledPrompt,
      negativePrompt,
      aspectRatio: aspectRatioMap[aspectRatio] as any,
      // Pass structured inputs
      layoutReference,
      elementReferences,
      references: genericReferences, // Pass generic/legacy refs separately
    });

    const baseBuffer = Buffer.from(imageData, 'base64');
    const qualityConfig = QUALITY_CONFIG[quality];

    let targetWidth: number = qualityConfig.targetWidth;
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
