import { NextRequest, NextResponse } from 'next/server';
import { repository } from '@/lib/repository';
import { SubscriptionPlan, SubscriptionTier } from '@/lib/types';

const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'FREE',
    name: 'Standard Job Seeker',
    badge: 'Basic',
    priceMonthly: 0,
    priceYearly: 0,
    tagline: 'Ideal for casual job browsing and manual applications',
    features: [
      'Up to 3 job applications per month',
      'Basic skill matching percentages',
      'Public profile listing',
      'Standard email notifications',
      '5 AI Assistant credits to test CV optimization',
    ],
    aiCreditsMonthly: 5,
    applicationsMonthly: 3,
    directEmployerChat: false,
    priorityATS: false,
    verifiedBadge: false,
  },
  {
    id: 'PRO',
    name: 'Global Pro Candidate',
    badge: 'Most Popular',
    popular: true,
    priceMonthly: 19,
    priceYearly: 149,
    tagline: 'Accelerate your global tech job search with unlimited AI & priority placement',
    features: [
      'Unlimited global job applications',
      'Priority ATS placement (ranked top of employer queue)',
      'Unlimited AI CV optimizer & ATS parseability audit',
      'Instant AI tailored cover letters for every role',
      'AI Match Explainer & Technical Interview Prep Q&A',
      'Timezone salary benchmark calculator',
      'Verified Global Tech Candidate checkmark',
    ],
    aiCreditsMonthly: 'UNLIMITED',
    applicationsMonthly: 'UNLIMITED',
    directEmployerChat: true,
    priorityATS: true,
    verifiedBadge: true,
  },
  {
    id: 'FREELANCE_PRO',
    name: 'Freelancer & Contractor Pro',
    badge: 'For Contractors',
    priceMonthly: 29,
    priceYearly: 229,
    tagline: 'Designed for independent developers, contract engineers, and remote freelancers',
    features: [
      'Everything in Global Pro Candidate',
      'Verified Freelance Contractor profile badge',
      'Unlimited freelance gig & contract proposals',
      'AI Milestone Proposal & Statement of Work generator',
      'Direct client messaging & rate negotiation assistant',
      'Hourly rate market insights & currency conversions',
      '0% platform commission on direct contract hires',
    ],
    aiCreditsMonthly: 'UNLIMITED',
    applicationsMonthly: 'UNLIMITED',
    directEmployerChat: true,
    priorityATS: true,
    verifiedBadge: true,
  },
];

export async function GET() {
  const current = repository.getCurrentUser();
  return NextResponse.json({
    plans: SUBSCRIPTION_PLANS,
    currentTier: current.profile?.subscriptionTier || 'FREE',
    subscriptionStatus: current.profile?.subscriptionStatus || 'INACTIVE',
    aiCreditsRemaining: current.profile?.aiCreditsRemaining ?? (current.profile?.subscriptionTier === 'FREE' ? 5 : 999),
  });
}

export async function POST(req: NextRequest) {
  try {
    const current = repository.getCurrentUser();
    if (!current.user) {
      return NextResponse.json({ error: 'You must be logged in to upgrade.' }, { status: 401 });
    }

    const body = await req.json();
    const { tier, billingCycle, paymentDetails } = body as {
      tier: SubscriptionTier;
      billingCycle?: 'monthly' | 'yearly';
      paymentDetails?: { cardNumber?: string; nameOnCard?: string };
    };

    if (!tier || !['FREE', 'PRO', 'FREELANCE_PRO'].includes(tier)) {
      return NextResponse.json({ error: 'Invalid subscription tier selected.' }, { status: 400 });
    }

    const plan = SUBSCRIPTION_PLANS.find((p) => p.id === tier);
    if (!plan) {
      return NextResponse.json({ error: 'Plan not found.' }, { status: 404 });
    }

    // Simulate secure payment processing
    const { profile } = repository.upgradeSubscription(current.user.id, tier);

    const transactionId = `txn_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
    const amount = billingCycle === 'yearly' ? plan.priceYearly : plan.priceMonthly;

    return NextResponse.json({
      success: true,
      message: `Successfully upgraded to ${plan.name}!`,
      profile,
      receipt: {
        transactionId,
        tier: plan.name,
        amount,
        currency: 'USD',
        billingCycle: billingCycle || 'monthly',
        date: new Date().toISOString(),
        lastFour: paymentDetails?.cardNumber ? paymentDetails.cardNumber.slice(-4) : '4242',
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Payment processing failed.' }, { status: 500 });
  }
}
