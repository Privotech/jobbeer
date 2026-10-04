'use client';

import React, { useState } from 'react';
import { Job, Profile, MatchBreakdown } from '@/lib/types';
import JobCard from './JobCard';
import {
  Search,
  MapPin,
  Sparkles,
  Zap,
  Crown,
  Briefcase,
  CheckCircle,
  FileText,
  DollarSign,
} from 'lucide-react';

interface JobSeekerDashboardProps {
  jobs: Array<Job & { matchBreakdown?: MatchBreakdown; matchScore?: number; isSaved?: boolean }>;
  profile?: Profile;
  initialSearchQuery?: string;
  onSelectJob: (job: Job) => void;
  onApplyJob: (job: Job) => void;
  onToggleSaveJob: (jobId: string) => void;
  onOpenProfile: () => void;
  onOpenAiAssistant?: (job?: Job, tab?: 'cv_optimizer' | 'cover_letter' | 'match_prep' | 'freelance_pitch') => void;
  onOpenPricing?: () => void;
}

export default function JobSeekerDashboard({
  jobs,
  profile,
  initialSearchQuery = '',
  onSelectJob,
  onApplyJob,
  onToggleSaveJob,
  onOpenProfile,
  onOpenAiAssistant,
  onOpenPricing,
}: JobSeekerDashboardProps) {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [locationQuery, setLocationQuery] = useState('');
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [filterSegment, setFilterSegment] = useState<'all' | 'high_match' | 'freelance' | 'remote' | 'saved'>('all');
  const [selectedExpLevel, setSelectedExpLevel] = useState<string>('ALL');

  const isPro = profile?.subscriptionTier === 'PRO' || profile?.subscriptionTier === 'FREELANCE_PRO';
  const isFreelancePro = profile?.subscriptionTier === 'FREELANCE_PRO';

  // Count gigs
  const freelanceCount = jobs.filter((j) => j.isFreelanceGig || j.employmentType === 'CONTRACT' || j.employmentType === 'FREELANCE').length;

  // Filter jobs based on active search criteria and segment
  const filteredJobs = jobs.filter((job) => {
    // Text search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = job.title.toLowerCase().includes(q);
      const matchDept = job.department.toLowerCase().includes(q);
      const matchComp = job.company?.name.toLowerCase().includes(q);
      const matchSkills = job.skills.some((s) => s.toLowerCase().includes(q));
      if (!matchTitle && !matchDept && !matchComp && !matchSkills) return false;
    }

    // Location
    if (locationQuery) {
      const lq = locationQuery.toLowerCase();
      if (!job.location.toLowerCase().includes(lq)) return false;
    }

    // Remote
    if (remoteOnly && !job.isRemote) return false;

    // Experience
    if (selectedExpLevel !== 'ALL' && job.experienceLevel !== selectedExpLevel) {
      return false;
    }

    // Segment filters
    if (filterSegment === 'high_match') {
      const score = job.matchScore ?? job.matchBreakdown?.overallScore ?? 0;
      if (score < 80) return false;
    } else if (filterSegment === 'freelance') {
      if (!job.isFreelanceGig && job.employmentType !== 'CONTRACT' && job.employmentType !== 'FREELANCE') return false;
    } else if (filterSegment === 'remote') {
      if (!job.isRemote) return false;
    } else if (filterSegment === 'saved') {
      if (!job.isSaved) return false;
    }

    return true;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-neutral-900 text-white rounded-3xl p-8 sm:p-12 border border-neutral-800 shadow-sm">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-neutral-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Intelligent Global Matching Engine Active</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">Full-Time & Freelance Gigs</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
            Connect With Global Roles & Gigs Matched To Your Skills.
          </h1>

          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-xl">
            A full-stack employment platform built for cross-border software engineers, independent contractors, and remote teams.
            Evaluate contextual skills, timezone overlap, and hourly rates in real time.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                const el = document.getElementById('search-anchor');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-5 py-2.5 text-xs font-semibold text-neutral-900 bg-white hover:bg-neutral-100 rounded-xl transition-colors shadow-xs"
            >
              Explore Open Roles & Gigs
            </button>
            {onOpenAiAssistant && (
              <button
                onClick={() => onOpenAiAssistant(undefined, 'cv_optimizer')}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-emerald-600 hover:opacity-90 rounded-xl transition-all shadow-xs flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>AI CV & Career Assistant</span>
              </button>
            )}
            <button
              onClick={onOpenProfile}
              className="px-4 py-2.5 text-xs font-semibold text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-xl border border-neutral-700 transition-colors"
            >
              Update Profile & Rate
            </button>
          </div>
        </div>

        {/* Hero Background Visual with Scrim Overlay */}
        <div className="absolute right-0 top-0 bottom-0 w-full sm:w-1/2 opacity-25 sm:opacity-40 pointer-events-none mix-blend-luminosity overflow-hidden">
          <img
            src="/images/hero_global_workforce_1790927043519.jpg"
            alt="Global distributed workforce collaboration"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </section>

      {/* PRO PLAN & FREELANCER TOOLKIT STATUS BAR */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-850 to-neutral-900 text-white rounded-2xl p-4 sm:p-5 border border-neutral-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-400 shrink-0">
            {isPro ? <Crown className="w-5 h-5 text-amber-400" /> : <Zap className="w-5 h-5 text-neutral-300" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white">
                {isFreelancePro
                  ? 'Freelancer & Contractor Pro Active'
                  : isPro
                  ? 'Global Pro Candidate Active'
                  : 'Starter Candidate Account'}
              </span>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                isPro ? 'bg-amber-400 text-neutral-950' : 'bg-neutral-800 text-neutral-400'
              }`}>
                {isPro ? 'UNLIMITED AI & PRIORITY' : 'FREE TIER'}
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              {profile?.isFreelancer && (
                <span className="text-indigo-300 font-medium mr-2">
                  Freelance Rate: ${profile.hourlyRate || 85}/hr ({profile.contractAvailability || 'Available immediately'}) · 0% platform fee
                </span>
              )}
              {isPro
                ? 'Unlimited AI CV optimizations, cover letters, and priority placement enabled'
                : `${profile?.aiCreditsRemaining ?? 5} free AI credits remaining. Upgrade for unlimited AI & top placement.`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onOpenAiAssistant && (
            <button
              type="button"
              onClick={() => onOpenAiAssistant(undefined, 'cv_optimizer')}
              className="px-4 py-2 text-xs font-semibold text-neutral-950 bg-white hover:bg-neutral-100 rounded-xl transition-all shadow-xs flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Open AI Assistant</span>
            </button>
          )}

          {!isPro && onOpenPricing && (
            <button
              type="button"
              onClick={onOpenPricing}
              className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 rounded-xl transition-all shadow-xs flex items-center gap-1.5"
            >
              <Crown className="w-3.5 h-3.5 text-neutral-950" />
              <span>Upgrade to Pro ($19/mo)</span>
            </button>
          )}
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div id="search-anchor" className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Keywords search */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by role, tech stack (e.g. Next.js, MySQL, Cloud), or company..."
              className="w-full text-xs pl-10 pr-4 py-2.5 bg-neutral-50 hover:bg-neutral-100/60 focus:bg-white border border-neutral-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-neutral-900 transition-all"
            />
          </div>

          {/* Location / Region search */}
          <div className="md:col-span-4 relative">
            <MapPin className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              placeholder="Location or timezone (e.g. London, Remote)..."
              className="w-full text-xs pl-10 pr-4 py-2.5 bg-neutral-50 hover:bg-neutral-100/60 focus:bg-white border border-neutral-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-neutral-900 transition-all"
            />
          </div>

          {/* Experience level selector */}
          <div className="md:col-span-2">
            <select
              value={selectedExpLevel}
              onChange={(e) => setSelectedExpLevel(e.target.value)}
              className="w-full text-xs px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-neutral-900"
            >
              <option value="ALL">All Levels</option>
              <option value="ENTRY">Entry Level</option>
              <option value="MID">Mid Level</option>
              <option value="SENIOR">Senior Level</option>
              <option value="LEAD">Lead / Architect</option>
            </select>
          </div>
        </div>

        {/* Secondary Filter Row: Segmented Tab Controls + Remote toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-neutral-100">
          {/* Segmented controls (Buttons allowed per Constitution) */}
          <div className="flex flex-wrap items-center gap-1 p-1 bg-neutral-100 rounded-xl">
            <button
              onClick={() => setFilterSegment('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                filterSegment === 'all'
                  ? 'bg-white text-neutral-900 shadow-2xs font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              All Roles ({jobs.length})
            </button>
            <button
              onClick={() => setFilterSegment('freelance')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                filterSegment === 'freelance'
                  ? 'bg-white text-indigo-900 shadow-2xs font-bold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
              <span>Freelance & Contracts ({freelanceCount})</span>
            </button>
            <button
              onClick={() => setFilterSegment('high_match')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1 ${
                filterSegment === 'high_match'
                  ? 'bg-white text-neutral-900 shadow-2xs font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-neutral-800" />
              <span>Smart Matches (≥ 80%)</span>
            </button>
            <button
              onClick={() => setFilterSegment('remote')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                filterSegment === 'remote'
                  ? 'bg-white text-neutral-900 shadow-2xs font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Worldwide Remote
            </button>
            <button
              onClick={() => setFilterSegment('saved')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                filterSegment === 'saved'
                  ? 'bg-white text-neutral-900 shadow-2xs font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Saved ({jobs.filter((j) => j.isSaved).length})
            </button>
          </div>

          {/* Quick Remote Toggle */}
          <label className="flex items-center gap-2 text-xs text-neutral-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={remoteOnly}
              onChange={(e) => setRemoteOnly(e.target.checked)}
              className="w-4 h-4 rounded text-neutral-900 focus:ring-neutral-900 border-neutral-300"
            />
            <span>Worldwide remote only</span>
          </label>
        </div>
      </div>

      {/* Active Candidate Match Profile Summary Banner */}
      {profile && (
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-neutral-100 overflow-hidden shrink-0 border border-neutral-200">
              <img
                src={profile.avatarUrl || '/images/avatar_candidate_engineer_1790927054479.jpg'}
                alt={profile.fullName}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-neutral-900">{profile.fullName}</span>
                {profile.isFreelancer && (
                  <span className="px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 text-[10px] font-mono font-bold">
                    VERIFIED FREELANCER
                  </span>
                )}
                <span className="text-xs text-neutral-500">·</span>
                <span className="text-xs text-neutral-600 font-mono">{profile.timezone}</span>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                Skills: {profile.skills.slice(0, 5).join(', ')} (+{Math.max(0, profile.skills.length - 5)} more)
                {profile.hourlyRate && <span className="ml-2 font-mono text-neutral-700 font-bold">· ${profile.hourlyRate}/hr</span>}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-neutral-500 font-mono tabular-nums">
              Showing {filteredJobs.length} tailored opportunities
            </span>
            <button
              onClick={onOpenProfile}
              className="px-3 py-1.5 text-xs font-medium text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
            >
              Adjust Preferences
            </button>
          </div>
        </div>
      )}

      {/* Jobs Feed Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-neutral-500 px-1">
          <span className="font-mono tabular-nums">
            {filteredJobs.length} {filteredJobs.length === 1 ? 'position available' : 'positions available'}
          </span>
          <span>Sorted by Smart Match Compatibility & Recency</span>
        </div>

        {filteredJobs.length === 0 ? (
          <div className="bg-white border border-neutral-200 rounded-2xl p-12 text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-neutral-100 text-neutral-400 mx-auto flex items-center justify-center">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-neutral-900">No jobs match your current filters</h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              Try broadening your search keywords or switching back to &apos;All Roles&apos; to view all worldwide openings.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setLocationQuery('');
                setRemoteOnly(false);
                setFilterSegment('all');
                setSelectedExpLevel('ALL');
              }}
              className="mt-2 px-4 py-2 text-xs font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors inline-block"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onSelect={onSelectJob}
                onApply={onApplyJob}
                onToggleSave={onToggleSaveJob}
                onOpenAiAssistant={(j, tab) => onOpenAiAssistant?.(j, tab)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
