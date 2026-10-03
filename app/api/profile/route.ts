import { NextRequest, NextResponse } from 'next/server';
import { repository } from '@/lib/repository';

export async function GET() {
  const current = repository.getCurrentUser();
  return NextResponse.json({
    user: current.user,
    profile: current.profile,
  });
}

export async function PUT(req: NextRequest) {
  try {
    const current = repository.getCurrentUser();
    if (!current.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await req.json();

    const updatedProfile = repository.updateProfile(current.user.id, body);
    return NextResponse.json({ profile: updatedProfile });
  } catch {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
