import { uploadImageToGCS, uploadJsonToGCS } from './gcs';
import { saveImageLocally, saveMetadataLocally } from './local';

const hasGcsConfig =
  Boolean(process.env.GCS_BUCKET) && Boolean(process.env.GCS_BUCKET_PUBLIC_URL);

export interface StoredImageResult {
  imageUrl: string;
  thumbnailUrl: string;
}

export interface StoredMetadataResult {
  metadataUrl: string;
}

export async function storeGeneratedImage(
  buffer: Buffer,
  filename: string
): Promise<StoredImageResult> {
  if (hasGcsConfig) {
    return uploadImageToGCS(buffer, filename);
  }

  return saveImageLocally(buffer, filename);
}

export async function storeGeneratedMetadata(
  data: unknown,
  filename: string
): Promise<StoredMetadataResult> {
  if (hasGcsConfig) {
    return uploadJsonToGCS(data, filename);
  }

  return saveMetadataLocally(data, filename);
}

