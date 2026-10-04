import { NextRequest, NextResponse } from 'next/server';
import { repository, store } from '@/lib/repository';

export async function GET() {
  const current = repository.getCurrentUser();
  const availableDemoAccounts = store.users.map((u) => {
    const profile = store.profiles.find((p) => p.userId === u.id);
    const company = store.companies.find((c) => c.userId === u.id);
    return {
      id: u.id,
      email: u.email,
      role: u.role,
      name: profile?.fullName || company?.name || u.email.split('@')[0],
      headline: profile?.headline || company?.industry || 'System Administrator',
    };
  });

  return NextResponse.json({
    user: current.user,
    profile: current.profile,
    company: current.company,
    demoAccounts: availableDemoAccounts,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, userId, email, fullName, role, headline, location, timezone, utcOffset, skills } = body;

    if (action === 'SWITCH_USER' && userId) {
      const switched = repository.switchUser(userId);
      return NextResponse.json({
        success: true,
        user: switched.user,
        profile: switched.profile,
        company: switched.company,
      });
    }

    if (action === 'SIGN_IN') {
      if (!email) {
        return NextResponse.json({ error: 'Email is required' }, { status: 400 });
      }
      const loggedIn = repository.loginUser(email);
      if (!loggedIn) {
        return NextResponse.json({ error: 'User account not found with this email' }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        user: loggedIn.user,
        profile: loggedIn.profile,
        company: loggedIn.company,
      });
    }

    if (action === 'SIGN_UP') {
      if (!email || !fullName || !role) {
        return NextResponse.json({ error: 'Full name, email, and role are required' }, { status: 400 });
      }
      const signedUp = repository.signupUser({
        fullName,
        email,
        role,
        headline,
        location,
        timezone,
        utcOffset,
        skills,
      });
      return NextResponse.json({
        success: true,
        user: signedUp.user,
        profile: signedUp.profile,
        company: signedUp.company,
      });
    }

    if (action === 'LOGOUT') {
      repository.logout();
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid auth action' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'Failed to process auth request' }, { status: 500 });
  }
}
