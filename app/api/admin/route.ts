import { NextRequest, NextResponse } from 'next/server';
import { repository, store } from '@/lib/repository';

export async function GET() {
  const current = repository.getCurrentUser();
  if (!current.user || current.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  }

  const metrics = repository.getSystemMetrics();
  const allUsers = repository.getAllUsers();
  const allJobs = store.jobs.map((j) => ({
    ...j,
    company: repository.getCompanyById(j.companyId),
    applicationCount: store.applications.filter((a) => a.jobId === j.id).length,
  }));
  const auditLogs = repository.getAuditLogs(60);

  return NextResponse.json({
    metrics,
    users: allUsers,
    jobs: allJobs,
    auditLogs,
  });
}

export async function POST(req: NextRequest) {
  try {
    const current = repository.getCurrentUser();
    if (!current.user || current.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await req.json();
    const { action, jobId, userId, moderationStatus, userStatus } = body;

    if (action === 'MODERATE_JOB' && jobId && moderationStatus) {
      const updatedJob = repository.updateJobModeration(jobId, moderationStatus, current.user.email);
      return NextResponse.json({ job: updatedJob });
    }

    if (action === 'UPDATE_USER_STATUS' && userId && userStatus) {
      const updatedUser = repository.updateUserStatus(userId, userStatus, current.user.email);
      return NextResponse.json({ user: updatedUser });
    }

    return NextResponse.json({ error: 'Invalid admin action' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'Failed to process admin action' }, { status: 500 });
  }
}
