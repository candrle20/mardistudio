import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import mime from 'mime';

export async function GET(
  request: Request,
  { params }: { params: { path: string[] } }
) {
  try {
    const filename = params.path.join('/');
    const filepath = join(process.cwd(), 'uploads', filename);

    if (!existsSync(filepath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const fileBuffer = await readFile(filepath);
    const mimeType = mime.getType(filepath) || 'application/octet-stream';

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': mimeType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('File serve error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

