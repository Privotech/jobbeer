import { NextRequest, NextResponse } from 'next/server';
import { repository } from '@/lib/repository';

export async function GET() {
  const current = repository.getCurrentUser();
  if (!current.user) {
    return NextResponse.json({ savedJobs: [] });
  }
  const jobs = repository.getSavedJobsByUser(current.user.id);
  return NextResponse.json({ savedJobs: jobs });
}

export async function POST(req: NextRequest) {
  try {
    const current = repository.getCurrentUser();
    if (!current.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await req.json();
    const { jobId } = body;

    if (!jobId) {
      return NextResponse.json({ error: 'jobId is required' }, { status: 400 });
    }

    const result = repository.toggleSaveJob(current.user.id, jobId);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: 'Failed to update saved job' }, { status: 500 });
  }
}
