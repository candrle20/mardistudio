import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export async function GET(_: Request, { params }: { params: { jobId: string } }) {
  const metadataPath = path.join(process.cwd(), 'public', 'generated', 'metadata', `${params.jobId}.json`);
  try {
    const file = await fs.readFile(metadataPath, 'utf-8');
    const data = JSON.parse(file);
    return NextResponse.json(data);
  } catch (error) {
    console.error('[metadata] Failed to read metadata file:', error);
    return NextResponse.json({ error: 'Metadata not found' }, { status: 404 });
  }
}

