import { NextResponse } from 'next/server';

// Placeholder API route for styles
export async function GET() {
  // TODO: Fetch from database
  // Mock styles for development
  return NextResponse.json([
    {
      id: 'watercolor-floral',
      name: 'Watercolor Floral',
      artistName: 'Maria Rodriguez',
      thumbnailUrl: 'https://via.placeholder.com/200x200',
      description: 'Soft watercolor florals with romantic pink tones',
    },
    {
      id: 'modern-minimalist',
      name: 'Modern Minimalist',
      artistName: 'Sarah Chen',
      thumbnailUrl: 'https://via.placeholder.com/200x200',
      description: 'Clean geometric patterns with gold accents',
    },
    {
      id: 'botanical-illustration',
      name: 'Botanical Illustration',
      artistName: 'Emma Thompson',
      thumbnailUrl: 'https://via.placeholder.com/200x200',
      description: 'Detailed botanical drawings with eucalyptus',
    },
  ]);
}

