import { NextResponse } from 'next/server';

// Placeholder API route for projects
export async function GET(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  const { projectId } = params;
  // TODO: Implement actual project loading from database
  return NextResponse.json({
    id: projectId,
    name: 'Untitled Project',
    canvas: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  const { projectId } = params;
  const body = await request.json();
  // TODO: Save project to database
  return NextResponse.json({ success: true, projectId });
}

