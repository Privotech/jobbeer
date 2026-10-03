'use client';

import React, { useState } from 'react';
import { Profile, SubscriptionTier } from '@/lib/types';
import {
  X,
  Check,
  Sparkles,
  Zap,
  ShieldCheck,
  Briefcase,
  CreditCard,
  Lock,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile?: Profile;
  onSubscriptionUpdated: (newProfile: Profile) => void;
  initialSelectedTier?: SubscriptionTier;
}

export default function PricingModal({
  isOpen,
  onClose,
  profile,
  onSubscriptionUpdated,
  initialSelectedTier = 'PRO',
}: PricingModalProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>(initialSelectedTier);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'select' | 'checkout' | 'success'>('select');
  const [receipt, setReceipt] = useState<any>(null);

  // Form fields
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [nameOnCard, setNameOnCard] = useState(profile?.fullName || 'Sarah Chen');
  const [expiry, setExpiry] = useState('12/28');
  const [cvc, setCvc] = useState('888');

  if (!isOpen) return null;

  const handleUpgrade = async (tier: SubscriptionTier) => {
    setSelectedTier(tier);
    setPaymentStep('checkout');
  };

  const handleProcessPayment = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier: selectedTier,
          billingCycle,
          paymentDetails: { cardNumber, nameOnCard },
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setReceipt(data.receipt);
        setPaymentStep('success');
        onSubscriptionUpdated(data.profile);
      } else {
        alert(data.error || 'Payment failed. Please try again.');
      }
    } catch {
      alert('Network error while processing subscription upgrade.');
    } finally {
      setIsLoading(false);
    }
  };

  const plans = [
    {
      id: 'FREE' as SubscriptionTier,
      name: 'Starter Candidate',
      badge: 'Free Tier',
      priceMonthly: 0,
      priceYearly: 0,
      description: 'Standard exploration with manual applications',
      features: [
        '3 job applications per month',
        'Basic algorithmic match percentage',
        'Standard profile visibility',
        '5 Free AI CV & Cover Letter credits',
      ],
      cta: 'Current Plan',
      isCurrent: !profile?.subscriptionTier || profile?.subscriptionTier === 'FREE',
    },
    {
      id: 'PRO' as SubscriptionTier,
      name: 'Global Pro Candidate',
      badge: 'Most Popular',
      popular: true,
      priceMonthly: 19,
      priceYearly: 149,
      savings: 'Save $79/yr',
      description: 'Accelerate your global tech search with unlimited AI and top ATS ranking',
      features: [
        'Unlimited global job applications',
        'Priority ATS placement (#1 candidate tier)',
        'Unlimited AI CV ATS Optimizer & Rewriter',
        'Instant AI tailored cover letters for every role',
        'AI Match Explainer & Technical Interview Prep Q&A',
        'Verified Global Candidate Badge',
        'Direct messaging with hiring managers',
      ],
      cta: 'Upgrade to Pro',
      isCurrent: profile?.subscriptionTier === 'PRO',
    },
    {
      id: 'FREELANCE_PRO' as SubscriptionTier,
      name: 'Freelancer & Contractor Pro',
      badge: 'Contractors & Gigs',
      priceMonthly: 29,
      priceYearly: 229,
      savings: 'Save $119/yr',
      description: 'Built for independent developers, contract engineers, and remote freelancers',
      features: [
        'Everything in Global Pro Candidate',
        'Verified Freelance Contractor profile badge',
        'Unlimited freelance gig & contract proposals',
        'AI Statement of Work & Milestone Proposal generator',
        'Hourly rate benchmark intelligence ($/hr)',
        '0% platform commission on contracts',
        'Direct milestone delivery workspace',
      ],
      cta: 'Upgrade to Freelancer Pro',
      isCurrent: profile?.subscriptionTier === 'FREELANCE_PRO',
    },
  ];

  const currentPlanObj = plans.find((p) => p.id === selectedTier) || plans[1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl border border-neutral-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-neutral-100 bg-neutral-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center shadow-xs">
              <Zap className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-900">
                {paymentStep === 'select' && 'GlobalHire Pro & Freelancer Pass'}
                {paymentStep === 'checkout' && 'Secure Pro Checkout'}
                {paymentStep === 'success' && 'Upgrade Complete!'}
              </h2>
              <p className="text-xs text-neutral-500">
                {paymentStep === 'select' && 'Power your job search with unlimited AI, priority ATS ranking, and verified contractor status'}
                {paymentStep === 'checkout' && `Upgrading ${profile?.fullName || 'Candidate'} to ${currentPlanObj.name}`}
                {paymentStep === 'success' && 'Your Pro privileges and unlimited AI Assistant credits are now active.'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-700 rounded-xl hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">

          {/* STEP 1: PLAN SELECTION */}
          {paymentStep === 'select' && (
            <div className="space-y-6">
              {/* Billing Cycle Toggle */}
              <div className="flex items-center justify-center">
                <div className="p-1 bg-neutral-100 rounded-xl inline-flex items-center gap-1 border border-neutral-200/70">
                  <button
                    type="button"
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      billingCycle === 'monthly'
                        ? 'bg-white text-neutral-900 shadow-xs'
                        : 'text-neutral-500 hover:text-neutral-900'
                    }`}
                  >
                    Monthly Billing
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingCycle('yearly')}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                      billingCycle === 'yearly'
                        ? 'bg-neutral-900 text-white shadow-xs'
                        : 'text-neutral-500 hover:text-neutral-900'
                    }`}
                  >
                    <span>Annual Billing</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-400 text-neutral-950 font-bold">
                      Save 35%
                    </span>
                  </button>
                </div>
              </div>

              {/* Pricing Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {plans.map((plan) => {
                  const price = billingCycle === 'yearly' ? plan.priceYearly : plan.priceMonthly;
                  const isPro = plan.id === 'PRO';
                  const isFreelance = plan.id === 'FREELANCE_PRO';

                  return (
                    <div
                      key={plan.id}
                      className={`relative rounded-2xl p-6 transition-all flex flex-col justify-between space-y-5 ${
                        isPro
                          ? 'border-2 border-neutral-900 bg-neutral-900 text-white shadow-lg'
                          : isFreelance
                          ? 'border-2 border-indigo-500/40 bg-indigo-50/20 text-neutral-900 shadow-sm'
                          : 'border border-neutral-200 bg-white text-neutral-900'
                      }`}
                    >
                      {/* Popular Badge */}
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-400 text-neutral-950 text-[11px] font-bold font-mono uppercase tracking-wider shadow-xs">
                          {plan.badge}
                        </div>
                      )}
                      {isFreelance && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-indigo-600 text-white text-[11px] font-bold font-mono uppercase tracking-wider shadow-xs">
                          {plan.badge}
                        </div>
                      )}

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className={`font-bold text-base ${isPro ? 'text-white' : 'text-neutral-900'}`}>
                            {plan.name}
                          </h3>
                        </div>

                        <p className={`text-xs ${isPro ? 'text-neutral-300' : 'text-neutral-500'} leading-relaxed`}>
                          {plan.description}
                        </p>

                        <div className="pt-2">
                          <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-extrabold tracking-tight tabular-nums">
                              ${price}
                            </span>
                            <span className={`text-xs ${isPro ? 'text-neutral-400' : 'text-neutral-500'}`}>
                              /{billingCycle === 'yearly' ? 'year' : 'month'}
                            </span>
                          </div>
                          {plan.savings && billingCycle === 'yearly' && (
                            <span className="text-[11px] font-mono font-medium text-emerald-400 block mt-0.5">
                              {plan.savings}
                            </span>
                          )}
                        </div>

                        {/* Features List */}
                        <div className="pt-3 border-t border-neutral-200/20 space-y-2 text-xs">
                          {plan.features.map((feat) => (
                            <div key={feat} className="flex items-start gap-2">
                              <Check
                                className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${
                                  isPro ? 'text-emerald-400' : 'text-emerald-600'
                                }`}
                              />
                              <span className={isPro ? 'text-neutral-200' : 'text-neutral-600'}>{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* CTA Button */}
                      <button
                        type="button"
                        onClick={() => handleUpgrade(plan.id)}
                        disabled={plan.isCurrent}
                        className={`w-full py-2.5 px-4 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                          plan.isCurrent
                            ? 'bg-neutral-200 text-neutral-500 cursor-default'
                            : isPro
                            ? 'bg-white text-neutral-900 hover:bg-neutral-100 shadow-sm'
                            : isFreelance
                            ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
                            : 'bg-neutral-900 text-white hover:bg-neutral-800'
                        }`}
                      >
                        <span>{plan.isCurrent ? 'Current Tier' : plan.cta}</span>
                        {!plan.isCurrent && <ArrowRight className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Trust & Guarantee Banner */}
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-600">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>30-Day Money-Back Guarantee · Cancel anytime with 1 click · No hidden charges</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-400 font-mono text-[11px]">
                  <Lock className="w-3.5 h-3.5" />
                  <span>256-bit Encrypted Card Checkout</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: SIMULATED PAYMENT CHECKOUT */}
          {paymentStep === 'checkout' && (
            <div className="max-w-xl mx-auto space-y-6">
              <div className="p-5 rounded-2xl bg-neutral-900 text-white flex items-center justify-between">
                <div>
                  <div className="text-xs font-mono text-neutral-400 uppercase tracking-wider">Plan Summary</div>
                  <div className="text-lg font-bold text-white mt-0.5">{currentPlanObj.name}</div>
                  <div className="text-xs text-neutral-300">
                    Billed {billingCycle}: ${billingCycle === 'yearly' ? currentPlanObj.priceYearly : currentPlanObj.priceMonthly} USD
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPaymentStep('select')}
                  className="text-xs font-mono text-amber-400 hover:underline"
                >
                  Change plan
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">Name on Card</label>
                  <input
                    type="text"
                    value={nameOnCard}
                    onChange={(e) => setNameOnCard(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs text-neutral-900 bg-white rounded-xl border border-neutral-300 focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">Card Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs text-neutral-900 bg-white rounded-xl border border-neutral-300 focus:outline-hidden focus:ring-1 focus:ring-neutral-900 pr-10 font-mono"
                    />
                    <CreditCard className="w-4 h-4 text-neutral-400 absolute right-3.5 top-3" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">Expires (MM/YY)</label>
                    <input
                      type="text"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs text-neutral-900 bg-white rounded-xl border border-neutral-300 focus:outline-hidden focus:ring-1 focus:ring-neutral-900 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">CVC / Security Code</label>
                    <input
                      type="text"
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs text-neutral-900 bg-white rounded-xl border border-neutral-300 focus:outline-hidden focus:ring-1 focus:ring-neutral-900 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentStep('select')}
                  className="px-4 py-2.5 text-xs font-medium text-neutral-600 hover:text-neutral-900"
                >
                  Back to plans
                </button>
                <button
                  type="button"
                  onClick={handleProcessPayment}
                  disabled={isLoading}
                  className="px-6 py-2.5 text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl transition-all shadow-md flex items-center gap-2"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      <span>Authorizing Card...</span>
                    </span>
                  ) : (
                    <span>
                      Pay ${billingCycle === 'yearly' ? currentPlanObj.priceYearly : currentPlanObj.priceMonthly} & Unlock Pro
                    </span>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: SUCCESS & RECEIPT */}
          {paymentStep === 'success' && (
            <div className="max-w-md mx-auto text-center space-y-6 py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold text-neutral-900">Welcome to {currentPlanObj.name}!</h3>
                <p className="text-xs text-neutral-500">
                  Your Pro account is verified and ready. You now have unlimited AI Career Assistant privileges.
                </p>
              </div>

              {receipt && (
                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-left text-xs font-mono space-y-1.5 text-neutral-600">
                  <div className="flex justify-between">
                    <span>Transaction ID:</span>
                    <span className="text-neutral-900 font-bold">{receipt.transactionId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Plan:</span>
                    <span className="text-neutral-900">{receipt.tier} ({receipt.billingCycle})</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount Paid:</span>
                    <span className="text-neutral-900 font-bold">${receipt.amount} USD</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Method:</span>
                    <span className="text-neutral-900">Visa ending in {receipt.lastFour}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="text-emerald-600 font-bold">ACTIVE · PAID</span>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl transition-all shadow-md"
              >
                Start Using AI Assistant & Pro Features
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
