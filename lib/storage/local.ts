import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const GENERATED_DIR = path.join(process.cwd(), 'public', 'generated');
const THUMBS_DIR = path.join(GENERATED_DIR, 'thumbs');
const METADATA_DIR = path.join(GENERATED_DIR, 'metadata');

async function ensureDirectories() {
  await fs.mkdir(GENERATED_DIR, { recursive: true });
  await fs.mkdir(THUMBS_DIR, { recursive: true });
  await fs.mkdir(METADATA_DIR, { recursive: true });
}

export interface LocalUploadResult {
  imageUrl: string;
  thumbnailUrl: string;
}

export async function saveImageLocally(buffer: Buffer, filename: string): Promise<LocalUploadResult> {
  await ensureDirectories();

  const imagePath = path.join(GENERATED_DIR, filename);
  await fs.writeFile(imagePath, buffer);

  const thumbnailBuffer = await sharp(buffer)
    .resize(320, 480, { fit: 'cover' })
    .png()
    .toBuffer();

  const thumbPath = path.join(THUMBS_DIR, filename);
  await fs.writeFile(thumbPath, thumbnailBuffer);

  return {
    imageUrl: `/generated/${filename}`,
    thumbnailUrl: `/generated/thumbs/${filename}`,
  };
}

export interface LocalMetadataResult {
  metadataUrl: string;
}

export async function saveMetadataLocally(data: unknown, filename: string): Promise<LocalMetadataResult> {
  await ensureDirectories();
  const metadataPath = path.join(METADATA_DIR, filename);
  await fs.writeFile(metadataPath, JSON.stringify(data, null, 2), 'utf-8');

  return {
    metadataUrl: `/generated/metadata/${filename}`,
  };
}

