type AspectRatio = '1:1' | '3:4' | '4:3' | '16:9' | '9:16';

export interface GenerateImageOptions {
  prompt: string;
  aspectRatio?: AspectRatio;
  negativePrompt?: string;
  // Old flat list support for backward compatibility or generic generation
  references?: Array<{ mimeType: string; dataBase64: string }>;
  // New structured inputs
  layoutReference?: { mimeType: string; dataBase64: string };
  elementReferences?: Array<{ mimeType: string; dataBase64: string }>;

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

const MODEL_NAME = 'nano-banana-pro-preview';
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

  // 1. SYSTEM / PERSONA CONTEXT
  parts.push({
    text: `You are Nano Banana, an expert wedding stationery designer. Your goal is to design high-end, print-ready stationery (invitations, menus, save-the-dates) by synthesizing a Layout Reference with specific Decorative Elements.`
  });

  // 2. LAYOUT REFERENCE (The "Inspiration")
  if (options.layoutReference) {
    parts.push({
      text: `LAYOU & STYLE REFERENCE: Use the following image to define the overall composition, border structure, color palette, and artistic vibe (e.g., watercolor, foil, minimal). Mimic its layout structure.`
    });
    parts.push({
      inlineData: {
        data: options.layoutReference.dataBase64,
        mimeType: options.layoutReference.mimeType,
      },
    });
  }

  // 3. ELEMENT REFERENCES (The "Ingredients")
  if (options.elementReferences && options.elementReferences.length > 0) {
    parts.push({
      text: `DECORATIVE ELEMENTS: You MUST incorporate the following specific design elements into the layout defined above. Do not just paste them; blend them artistically into the border/frame design. Match the style of the Layout Reference.`
    });
    
    for (const element of options.elementReferences) {
      parts.push({
        inlineData: {
          data: element.dataBase64,
          mimeType: element.mimeType,
        },
      });
    }
  }

  // 4. LEGACY / GENERIC REFERENCES (Fallback)
  if (options.references && options.references.length > 0) {
    parts.push({ text: `ADDITIONAL VISUAL REFERENCES:` });
    for (const reference of options.references) {
      parts.push({
        inlineData: {
          data: reference.dataBase64,
          mimeType: reference.mimeType,
        },
      });
    }
  }

  // 5. EDITING INPUTS (Base Image + Mask)
  if ('baseImageBase64' in options && options.baseImageBase64) {
    parts.push({ text: `BASE IMAGE FOR EDITING:` });
    parts.push({
      inlineData: {
        data: options.baseImageBase64,
        mimeType: options.baseImageMimeType ?? 'image/png',
      },
    });
  }

  if ('maskBase64' in options && options.maskBase64) {
    parts.push({ text: `MASK (Edit only white areas):` });
    parts.push({
      inlineData: {
        data: options.maskBase64,
        mimeType: options.maskMimeType ?? 'image/png',
      },
    });
  }

  // 6. FINAL PROMPT & NEGATIVE PROMPT
  const defaultNegativePrompt = 'text, typography, letters, words, blurry, low quality, watermark, distorted, ugly, pixelated';
  const negativePrompt =
    'negativePrompt' in options && options.negativePrompt
      ? `${options.negativePrompt}, ${defaultNegativePrompt}`
      : defaultNegativePrompt;

  parts.push({
    text: `DESIGN INSTRUCTIONS:\n${options.prompt}\n\nIMPORTANT: Keep the center of the design BLANK white or very light color for text placement. Do not generate text.\n\nAvoid: ${negativePrompt}`,
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
