import { NextResponse } from 'next/server';

// Placeholder API route for creating projects
export async function POST(request: Request) {
  const body = await request.json();
  // TODO: Create project in database
  return NextResponse.json({
    id: `project-${Date.now()}`,
    name: body.name || 'Untitled Project',
    canvas: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}

