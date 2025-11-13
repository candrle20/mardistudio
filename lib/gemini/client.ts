type AspectRatio = '1:1' | '3:4' | '4:3' | '16:9' | '9:16';

export interface GenerateImageOptions {
  prompt: string;
  aspectRatio?: AspectRatio;
  negativePrompt?: string;
  references?: Array<{ mimeType: string; dataBase64: string }>;
  baseImageBase64?: string;
  baseImageMimeType?: string;
  maskBase64?: string;
  maskMimeType?: string;
}

export interface EditImageOptions extends GenerateImageOptions {
  baseImageBase64: string;
}

export interface GeminiImageResult {
  imageData: string;
  mimeType: string;
}

const MODEL_NAME = 'gemini-2.0-flash-preview-image-generation';
const API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models';

function getApiKey(): string {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GOOGLE_GEMINI_API_KEY is not set');
  }
  return apiKey;
}

function buildPartsFromOptions(options: GenerateImageOptions | EditImageOptions) {
  const parts: Array<{ text?: string; inlineData?: { data: string; mimeType: string } }> = [];

  // Add reference images first
  if ('references' in options && Array.isArray(options.references)) {
    for (const reference of options.references) {
      parts.push({
        inlineData: {
          data: reference.dataBase64,
          mimeType: reference.mimeType,
        },
      });
    }
  }

  // Add base image for editing
  if ('baseImageBase64' in options && options.baseImageBase64) {
    parts.push({
      inlineData: {
        data: options.baseImageBase64,
        mimeType: options.baseImageMimeType ?? 'image/png',
      },
    });
  }

  // Add mask for inpainting
  if ('maskBase64' in options && options.maskBase64) {
    parts.push({
      inlineData: {
        data: options.maskBase64,
        mimeType: options.maskMimeType ?? 'image/png',
      },
    });
  }

  // Add text prompt with negative prompt
  const defaultNegativePrompt = 'text, typography, letters, words, blurry, low quality, watermark';
  const negativePrompt =
    'negativePrompt' in options && options.negativePrompt
      ? `${options.negativePrompt}, ${defaultNegativePrompt}`
      : defaultNegativePrompt;

  parts.push({
    text: `${options.prompt}\nAvoid: ${negativePrompt}`,
  });

  return parts;
}

export async function generateImage(options: GenerateImageOptions): Promise<GeminiImageResult> {
  const apiKey = getApiKey();
  const parts = buildPartsFromOptions(options);

  // Build the request payload for the REST API
  const requestBody = {
    contents: [
      {
        role: 'user',
        parts,
      },
    ],
    generationConfig: {
      responseModalities: ['image', 'text'],
    },
  };

  const url = `${API_ENDPOINT}/${MODEL_NAME}:generateContent?key=${apiKey}`;

  let response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
  } catch (fetchError) {
    console.error('[Gemini] Fetch error:', fetchError);
    throw new Error(`Network error calling Gemini API: ${fetchError instanceof Error ? fetchError.message : 'Unknown error'}`);
  }

  if (!response.ok) {
    let errorText;
    try {
      errorText = await response.text();
    } catch (e) {
      errorText = 'Unable to read error response';
    }
    console.error('[Gemini] API error response:', errorText);
    throw new Error(`Gemini API error [${response.status}]: ${errorText}`);
  }

  let data;
  try {
    data = await response.json();
  } catch (jsonError) {
    console.error('[Gemini] JSON parse error:', jsonError);
    throw new Error('Failed to parse Gemini API response');
  }

  // Extract the image from the response
  const imagePart = data.candidates?.[0]?.content?.parts?.find(
    (part: any) => part.inlineData
  );

  if (!imagePart?.inlineData?.data || !imagePart.inlineData.mimeType) {
    console.error('[Gemini] No image data in response:', JSON.stringify(data).slice(0, 500));
    throw new Error('Gemini image generation returned no image data');
  }

  return {
    imageData: imagePart.inlineData.data,
    mimeType: imagePart.inlineData.mimeType,
  };
}

export async function editImage(options: EditImageOptions): Promise<GeminiImageResult> {
  if (!options.baseImageBase64) {
    throw new Error('editImage requires baseImageBase64');
  }

  return generateImage(options);
}

