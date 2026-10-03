import { NextRequest, NextResponse } from 'next/server';
import { repository } from '@/lib/repository';
import { ApplicationStatus } from '@/lib/types';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const current = repository.getCurrentUser();
    if (!current.user || (current.user.role !== 'EMPLOYER' && current.user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized to change application status' }, { status: 403 });
    }

    const body = await req.json();
    const { status, notes } = body;

    const validStatuses: ApplicationStatus[] = [
      'SUBMITTED',
      'UNDER_REVIEW',
      'SHORTLISTED',
      'INTERVIEW_SCHEDULED',
      'REJECTED',
      'HIRED',
    ];

    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid application status value' }, { status: 400 });
    }

    const updated = repository.updateApplicationStatus(
      id,
      status,
      current.user.email,
      notes
    );

    if (!updated) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    return NextResponse.json({ application: updated });
  } catch {
    return NextResponse.json({ error: 'Failed to update application status' }, { status: 500 });
  }
}
