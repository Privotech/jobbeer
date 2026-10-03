import { NextRequest, NextResponse } from 'next/server';
import { repository, store } from '@/lib/repository';

export async function GET() {
  const current = repository.getCurrentUser();
  if (!current.user) {
    return NextResponse.json({ interviews: [] });
  }

  if (current.user.role === 'SEEKER') {
    const userApps = store.applications.filter((a) => a.seekerId === current.user!.id);
    const appIds = new Set(userApps.map((a) => a.id));
    const interviews = store.interviews
      .filter((i) => appIds.has(i.applicationId))
      .map((i) => ({
        ...i,
        application: store.applications.find((a) => a.id === i.applicationId),
      }));
    return NextResponse.json({ interviews });
  }

  // Employer / Admin sees all company or platform interviews
  const interviews = store.interviews.map((i) => {
    const app = store.applications.find((a) => a.id === i.applicationId);
    return {
      ...i,
      application: app ? { ...app, job: repository.getJobById(app.jobId) } : undefined,
    };
  });

  return NextResponse.json({ interviews });
}

export async function POST(req: NextRequest) {
  try {
    const current = repository.getCurrentUser();
    if (!current.user || (current.user.role !== 'EMPLOYER' && current.user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Only employers or administrators can schedule interviews.' }, { status: 403 });
    }

    const body = await req.json();
    const { applicationId, scheduledAt, durationMinutes, timezone, meetingLink, meetingPlatform, notes } = body;

    if (!applicationId || !scheduledAt || !meetingLink) {
      return NextResponse.json({ error: 'applicationId, scheduledAt, and meetingLink are required.' }, { status: 400 });
    }

    const interview = repository.scheduleInterview({
      applicationId,
      scheduledAt,
      durationMinutes: Number(durationMinutes) || 45,
      timezone: timezone || 'UTC+0',
      meetingLink,
      meetingPlatform: meetingPlatform || 'Google Meet',
      notes,
      actorEmail: current.user.email,
    });

    return NextResponse.json({ interview }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to schedule interview' }, { status: 500 });
  }
}
