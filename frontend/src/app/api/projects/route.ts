// frontend/src/app/api/projects/route.ts
// frontend/src/app/types/project.d.ts
import { NextResponse } from 'next/server';
import type { Project } from '../../../types/project.d.ts'; // Import the shared type

// In production, this would be your deployed Cloud Function URL:
// `https://us-central1-<your-firebase-project-id>.cloudfunctions.net/api`
// For local development, use your Firebase Emulator or local Node.js server URL.
// Ensure this URL is correctly configured in your .env.local or environment variables.
const BACKEND_API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5001/academico-ai/us-central1/api';
// If your backend is running via `node server.js` on port 5000:
// const BACKEND_API_BASE_URL = 'http://localhost:5000/api';

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_API_BASE_URL}/projects`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Backend fetch failed: ${response.statusText} - ${errorData.message || ''}`);
    }

    const projects: Project[] = await response.json();
    return NextResponse.json(projects, { status: 200 });
  } catch (error: unknown) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch projects',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json(); // Get the request body (e.g., { title: 'New Project' })
    // this parses the imcoming request body from the frontend

    const response = await fetch(`${BACKEND_API_BASE_URL}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Backend POST failed: ${response.statusText} - ${errorData.message || ''}`);
    }
    const newProject: Project = await response.json();
    return NextResponse.json(newProject, { status: 201 });
  } catch (error: unknown) {
    console.error('Error adding project:', error);
    return NextResponse.json(
      {
        error: 'Failed to add project',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
