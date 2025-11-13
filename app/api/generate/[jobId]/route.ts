import { NextResponse } from 'next/server';

// Placeholder API route for checking generation status
export async function GET(
  request: Request,
  { params }: { params: { jobId: string } }
) {
  const { jobId } = params;
  // TODO: Check actual generation status
  // Mock response for now
  return NextResponse.json({
    jobId,
    status: 'completed',
    progress: 100,
    imageUrl: 'https://via.placeholder.com/1500x2100',
  });
}

