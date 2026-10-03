import { NextRequest, NextResponse } from 'next/server';
import { repository } from '@/lib/repository';
import { calculateMatchScore } from '@/lib/matching-algorithm';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const job = repository.getJobById(id);
  if (!job) {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 });
  }

  const current = repository.getCurrentUser();
  let matchBreakdown = null;
  let isSaved = false;

  if (current.profile && current.user) {
    matchBreakdown = calculateMatchScore(current.profile, job);
    isSaved = repository.isJobSaved(current.user.id, job.id);
  }

  return NextResponse.json({
    job: {
      ...job,
      matchBreakdown,
      matchScore: matchBreakdown?.overallScore,
      isSaved,
    },
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const current = repository.getCurrentUser();
  if (!current.user || (current.user.role !== 'EMPLOYER' && current.user.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const success = repository.deleteJob(id, current.user.email);
  if (!success) {
    return NextResponse.json({ error: 'Job not found or could not be deleted' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
