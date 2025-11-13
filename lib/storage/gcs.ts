import { Storage } from '@google-cloud/storage';
import sharp from 'sharp';

const bucketName = process.env.GCS_BUCKET;
const publicBase = process.env.GCS_BUCKET_PUBLIC_URL;

let storage: Storage | null = null;

function getStorage(): Storage {
  if (!storage) {
    storage = new Storage();
  }
  return storage;
}

export interface UploadResult {
  imageUrl: string;
  thumbnailUrl: string;
}

export interface UploadMetadataResult {
  metadataUrl: string;
}

export async function uploadImageToGCS(buffer: Buffer, filename: string): Promise<UploadResult> {
  if (!bucketName || !publicBase) {
    throw new Error('GCS configuration is missing');
  }

  const storageClient = getStorage();
  const bucket = storageClient.bucket(bucketName);
  
  const file = bucket.file(`generations/${filename}`);
  await file.save(buffer, {
    contentType: 'image/png',
    resumable: false,
    public: true,
    metadata: {
      cacheControl: 'public, max-age=31536000, immutable',
    },
  });

  const thumbnailBuffer = await sharp(buffer)
    .resize(320, 480, { fit: 'cover' })
    .png()
    .toBuffer();

  const thumbFile = bucket.file(`generations/thumbs/${filename}`);
  await thumbFile.save(thumbnailBuffer, {
    contentType: 'image/png',
    resumable: false,
    public: true,
    metadata: {
      cacheControl: 'public, max-age=86400',
    },
  });

  return {
    imageUrl: `${publicBase}/generations/${filename}`,
    thumbnailUrl: `${publicBase}/generations/thumbs/${filename}`,
  };
}

export async function uploadJsonToGCS(data: unknown, filename: string): Promise<UploadMetadataResult> {
  if (!bucketName || !publicBase) {
    throw new Error('GCS configuration is missing');
  }

  const storageClient = getStorage();
  const bucket = storageClient.bucket(bucketName);
  const file = bucket.file(`generations/metadata/${filename}`);

  await file.save(JSON.stringify(data, null, 2), {
    contentType: 'application/json',
    resumable: false,
    public: true,
    metadata: {
      cacheControl: 'public, max-age=300',
    },
  });

  return {
    metadataUrl: `${publicBase}/generations/metadata/${filename}`,
  };
}

