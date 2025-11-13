# AI Generation (Gemini/Imagen) Overview

This document tracks the Gemini-based image generation stack.

## API Endpoints

- `POST /api/generate` — text + optional references → image URL/thumbnail
- `POST /api/generate/edit` — base image + optional mask → edited image
- `POST /api/export/pdf` — (placeholder) print-ready export pipeline

## Environment Variables

See `.env.example` for required configuration:

- `GOOGLE_GEMINI_API_KEY`
- `GOOGLE_APPLICATION_CREDENTIALS` (optional, for service accounts)
- `GCS_BUCKET`, `GCS_BUCKET_PUBLIC_URL`
- `MAX_REQUESTS_PER_MINUTE`, `GENERATION_TIMEOUT_MS`

## Testing

- TODO: add integration tests for `/api/generate` once test runner is configured.
- TODO: add unit tests for `lib/gemini/client`.

## Future Enhancements

- PDF/X-1a generation with CMYK conversion, bleed, and crop marks.
- Automated mask creation from canvas text objects.
- Artist-style analytics and quality metrics.


