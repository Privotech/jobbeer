import { NextRequest, NextResponse } from 'next/server';
import { repository, store } from '@/lib/repository';

export async function GET(req: NextRequest) {
  const current = repository.getCurrentUser();
  const { searchParams } = new URL(req.url);
  const jobId = searchParams.get('jobId');

  if (jobId) {
    const apps = repository.getApplicationsByJob(jobId);
    return NextResponse.json({ applications: apps });
  }

  if (!current.user) {
    return NextResponse.json({ applications: [] });
  }

  if (current.user.role === 'SEEKER') {
    const apps = repository.getApplicationsBySeeker(current.user.id);
    return NextResponse.json({ applications: apps });
  } else if (current.user.role === 'EMPLOYER') {
    const companyId = current.company?.id || 'comp_cloudscale';
    const apps = repository.getApplicationsByCompany(companyId);
    return NextResponse.json({ applications: apps });
  } else {
    // Admin gets all
    const all = store.applications.map((app) => ({
      ...app,
      job: repository.getJobById(app.jobId),
      seeker: repository.getUserById(app.seekerId),
    }));
    return NextResponse.json({ applications: all });
  }
}

export async function POST(req: NextRequest) {
  try {
    const current = repository.getCurrentUser();
    if (!current.user || current.user.role !== 'SEEKER') {
      return NextResponse.json({ error: 'Only authenticated job seekers can submit applications.' }, { status: 403 });
    }

    const body = await req.json();
    const { jobId, coverLetter, resumeSnapshotUrl } = body;

    if (!jobId) {
      return NextResponse.json({ error: 'jobId is required.' }, { status: 400 });
    }

    const application = repository.submitApplication({
      jobId,
      seekerId: current.user.id,
      coverLetter,
      resumeSnapshotUrl,
      actorEmail: current.user.email,
    });

    return NextResponse.json({ application }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 });
  }
}
