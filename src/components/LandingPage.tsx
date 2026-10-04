'use client';

import React from 'react';
import { Job, Role } from '@/lib/types';
import {
  Sparkles,
  ArrowRight,
  Globe,
  Clock,
  CheckCircle2,
  Briefcase,
  UserCheck,
  GraduationCap,
  Layers,
  MapPin,
  Check,
  ShieldCheck,
  Zap,
} from 'lucide-react';

import PredictiveSearchBar from './PredictiveSearchBar';

interface LandingPageProps {
  featuredJobs: Job[];
  onOpenAuth: (mode: 'signin' | 'signup', role?: Role) => void;
  onOpenAcademicDeck: () => void;
  onExploreJobs: (filterQuery?: string) => void;
  onSelectJob: (job: Job) => void;
  onOpenPricing?: () => void;
  onOpenAiAssistant?: () => void;
}

export default function LandingPage({
  featuredJobs,
  onOpenAuth,
  onOpenAcademicDeck,
  onExploreJobs,
  onSelectJob,
  onOpenPricing,
  onOpenAiAssistant,
}: LandingPageProps) {
  const formatCompensation = (job: Job) => {
    const symbol = job.currency === 'EUR' ? '€' : job.currency === 'GBP' ? '£' : '$';
    if (job.rateType === 'HOURLY') {
      return `${symbol}${job.hourlyRateMin || job.salaryMin} – ${symbol}${job.hourlyRateMax || job.salaryMax}/hr`;
    }
    if (job.rateType === 'FIXED_PROJECT') {
      return `${symbol}${(job.salaryMin / 1000).toFixed(0)}k – ${symbol}${(job.salaryMax / 1000).toFixed(0)}k Fixed`;
    }
    return `${symbol}${(job.salaryMin / 1000).toFixed(0)}k – ${symbol}${(job.salaryMax / 1000).toFixed(0)}k/yr`;
  };

  return (
    <div className="space-y-16 pb-16">
      {/* MODERN REFINED HERO SECTION WITH SUBTLE MESH GRADIENT & REFINED TYPOGRAPHY */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-50 via-white to-indigo-50 text-slate-950 border border-sky-100 shadow-sm">
        {/* Subtle Ambient Radial Lighting & Grid Matrix */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-15%,rgba(99,102,241,0.07),rgba(255,255,255,0))] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#6366f110_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        
        {/* Soft Ambient Light Glow Orbs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-200/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-100/35 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 px-6 sm:px-10 lg:px-14 py-16 sm:py-20 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Headline, Value Proposition, Action CTAs */}
          <div className="lg:col-span-7 space-y-6">
            {/* Project Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-mono text-slate-600 border border-sky-100 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Final Year Computer Science / IT Project</span>
              <span aria-hidden="true" className="text-slate-400">·</span>
              <span className="text-sky-700 font-medium">GlobalHire</span>
            </div>

            {/* Headline with Increased Line Height for Legibility */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-950 leading-[1.2] sm:leading-[1.22] lg:leading-[1.24] text-balance">
              Global Tech Talent. <br />
              <span className="text-sky-700 font-semibold">Algorithmic Precision.</span>
            </h1>

            {/* Body */}
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl text-balance">
              A high-throughput full-stack employment platform connecting international developers and employers using
              multi-attribute skill scoring, timezone overlap calculations, and automated ATS workflows.
            </p>

            {/* Predictive Interactive Search Bar Component */}
            <div className="pt-2">
              <PredictiveSearchBar
                jobs={featuredJobs}
                onSearch={(q) => onExploreJobs(q)}
                onSelectJob={(j) => onSelectJob(j)}
              />
            </div>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onOpenAuth('signup', 'SEEKER')}
                className="px-6 py-3 text-xs font-semibold text-white bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 rounded-xl transition-all shadow-sm hover:shadow-md flex items-center gap-2"
              >
                <span>Find Matched Roles</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onOpenAuth('signup', 'EMPLOYER')}
                className="px-6 py-3 text-xs font-semibold text-slate-800 bg-white hover:bg-sky-50 rounded-xl border border-sky-200 shadow-sm transition-all flex items-center gap-2"
              >
                <Briefcase className="w-3.5 h-3.5 text-sky-600" />
                <span>Hire Global Developers</span>
              </button>

              <button
                onClick={onOpenAcademicDeck}
                className="px-3.5 py-3 text-xs font-medium text-slate-600 hover:text-sky-700 transition-colors flex items-center gap-1.5"
              >
                <GraduationCap className="w-4 h-4 text-sky-600" />
                <span>Viva Defense Slides</span>
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="pt-6 border-t border-sky-100 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono text-slate-500">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-900 tabular-nums">Next.js 16</span>
                <span className="text-slate-400">/</span>
                <span>TypeScript</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-900 tabular-nums">Prisma 7.8</span>
                <span className="text-slate-400">/</span>
                <span>MySQL</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-600 font-semibold tabular-nums">4-Pillar</span>
                <span>Matching Engine</span>
              </div>
            </div>
          </div>

          {/* Right Column: Sleek Glassmorphic Live Matching Simulation Card */}
          <div className="lg:col-span-5">
            <div className="relative bg-white/95 backdrop-blur-xl border border-neutral-200/90 rounded-2xl p-5 sm:p-6 shadow-md space-y-4">
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-bold text-neutral-900">Live Algorithmic Match</span>
                </div>
                <span className="text-[11px] font-mono text-emerald-800 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md tabular-nums">
                  94% Compatibility
                </span>
              </div>

              {/* Match Entities */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-neutral-950">Sarah Chen (Senior Full-Stack)</span>
                  <span className="text-neutral-500 font-mono">London, UTC+1</span>
                </div>
                <div className="flex items-center justify-between text-xs text-neutral-500">
                  <span>CloudScale Labs (Core Platform Lead)</span>
                  <span className="font-mono text-neutral-400">Berlin, UTC+2</span>
                </div>
              </div>

              {/* 4 Multi-Attribute Dimensions Breakdown */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div className="bg-neutral-50 border border-neutral-200/60 rounded-xl p-2.5">
                  <div className="text-[11px] text-neutral-500">Skills Overlap (45%)</div>
                  <div className="font-mono text-neutral-900 font-semibold mt-0.5">7/7 Required Matched</div>
                </div>
                <div className="bg-neutral-50 border border-neutral-200/60 rounded-xl p-2.5">
                  <div className="text-[11px] text-neutral-500">Timezone Overlap (20%)</div>
                  <div className="font-mono text-neutral-900 font-semibold mt-0.5">7h Daily Working Overlap</div>
                </div>
                <div className="bg-neutral-50 border border-neutral-200/60 rounded-xl p-2.5">
                  <div className="text-[11px] text-neutral-500">Experience Alignment (20%)</div>
                  <div className="font-mono text-neutral-900 font-semibold mt-0.5">5y Verified (Senior Level)</div>
                </div>
                <div className="bg-neutral-50 border border-neutral-200/60 rounded-xl p-2.5">
                  <div className="text-[11px] text-neutral-500">Work Mode (15%)</div>
                  <div className="font-mono text-emerald-700 font-semibold mt-0.5">100% Worldwide Remote</div>
                </div>
              </div>

              {/* Verified Technical Tags */}
              <div className="pt-2 border-t border-neutral-100 flex flex-wrap gap-1.5">
                {['TypeScript', 'Next.js', 'React', 'Prisma', 'MySQL', 'Docker'].map((tag) => (
                  <span key={tag} className="text-[11px] font-mono px-2 py-0.5 bg-neutral-100 text-neutral-700 rounded border border-neutral-200/50">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Action Callout */}
              <div className="bg-emerald-50 border border-emerald-200/70 rounded-xl p-2.5 flex items-center justify-between text-xs text-emerald-950">
                <span className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="font-medium">Ranked #1 Candidate in ATS Pipeline</span>
                </span>
                <span className="font-mono text-[11px] text-emerald-800 font-bold">Ready to Apply</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 ROLE PATHWAYS - CLEAN, LESS BULKY, HIGH-INTENT CARDS */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1.5">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
            Dedicated Workspaces by Role
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500">
            Sign up or sign in to route straight into your personalized workspace.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Pathway 1: Seeker & Freelancer */}
          <div className="group bg-white border border-neutral-200/80 hover:border-neutral-400 rounded-2xl p-6 transition-all duration-200 shadow-2xs hover:shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-neutral-100 group-hover:bg-neutral-900 group-hover:text-white transition-colors flex items-center justify-center text-neutral-800">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-neutral-900">Job Seeker & Freelancer Portal</h3>
                <p className="text-xs text-neutral-500 mt-1">For software engineers, contract developers & talent</p>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Optimize your CV with AI ATS parsing, set your hourly contractor rate ($/hr), and discover remote roles and gigs filtered by your timezone overlap.
              </p>
              <ul className="space-y-1.5 text-xs text-neutral-500 pt-1">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Real-time match % & timezone overlap indicators</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>AI CV Optimizer & instant tailored cover letters</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Freelance contract gigs with 0% platform fee</span>
                </li>
              </ul>
            </div>

            <div className="space-y-2 pt-2 border-t border-neutral-100">
              <button
                onClick={() => onOpenAuth('signup', 'SEEKER')}
                className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Enter as Candidate / Freelancer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onOpenAuth('signin', 'SEEKER')}
                className="w-full py-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-900 text-center"
              >
                Existing account? Sign in
              </button>
            </div>
          </div>

          {/* Pathway 2: Employer */}
          <div className="group bg-white border border-neutral-200/80 hover:border-neutral-400 rounded-2xl p-6 transition-all duration-200 shadow-2xs hover:shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-neutral-100 group-hover:bg-neutral-900 group-hover:text-white transition-colors flex items-center justify-center text-neutral-800">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-neutral-900">Employer ATS</h3>
                <p className="text-xs text-neutral-500 mt-1">For hiring directors & engineering teams</p>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Post international vacancies using fast-start role templates, inspect candidate compatibility scores, and schedule Google Meet interviews directly.
              </p>
              <ul className="space-y-1.5 text-xs text-neutral-500 pt-1">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Pre-built Next.js, Cloud & AI templates</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Applicants ranked by match score</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>One-click Google Meet interview invite</span>
                </li>
              </ul>
            </div>

            <div className="space-y-2 pt-2 border-t border-neutral-100">
              <button
                onClick={() => onOpenAuth('signup', 'EMPLOYER')}
                className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Enter as Employer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onOpenAuth('signin', 'EMPLOYER')}
                className="w-full py-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-900 text-center"
              >
                Employer sign in
              </button>
            </div>
          </div>

          {/* Pathway 3: Admin */}
          <div className="group bg-white border border-neutral-200/80 hover:border-neutral-400 rounded-2xl p-6 transition-all duration-200 shadow-2xs hover:shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-neutral-100 group-hover:bg-neutral-900 group-hover:text-white transition-colors flex items-center justify-center text-neutral-800">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-neutral-900">Admin & Compliance</h3>
                <p className="text-xs text-neutral-500 mt-1">For platform auditors & evaluators</p>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Review system health metrics, moderate job listings, authorize employer credentials, and query immutable compliance audit trails.
              </p>
              <ul className="space-y-1.5 text-xs text-neutral-500 pt-1">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Listing moderation: approve or flag</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>User account suspend & activate</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Real-time compliance audit logs</span>
                </li>
              </ul>
            </div>

            <div className="space-y-2 pt-2 border-t border-neutral-100">
              <button
                onClick={() => onOpenAuth('signin', 'ADMIN')}
                className="w-full py-2.5 px-4 text-xs font-semibold text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Enter Admin Console</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onOpenAcademicDeck}
                className="w-full py-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-900 text-center"
              >
                Review Viva Project Slides
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* HOW INTELLIGENT MATCHING WORKS */}
      <section className="bg-white border border-neutral-200 rounded-3xl p-8 sm:p-10 space-y-6 shadow-xs">
        <div className="max-w-xl space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-500">
            <Sparkles className="w-3.5 h-3.5 text-neutral-700" />
            <span>ALGORITHMIC SPECIFICATION (SLIDE 3 & 4)</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
            Multi-Attribute Contextual Matching
          </h2>
          <p className="text-xs text-neutral-500 leading-relaxed">
            Unlike traditional job boards with basic keyword search, GlobalHire calculates match alignment across 4 quantitative dimensions:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4.5 bg-neutral-50 border border-neutral-200/70 rounded-2xl space-y-1.5">
            <div className="flex items-center justify-between font-mono">
              <span className="font-bold text-neutral-900 text-sm">45% Weight</span>
              <span className="text-[11px] text-neutral-400">Core</span>
            </div>
            <h4 className="font-bold text-neutral-900">Technical Skill Vector</h4>
            <p className="text-neutral-600 leading-relaxed text-[11px]">
              Jaccard similarity matching required and bonus technical tags against candidate profile competencies.
            </p>
          </div>

          <div className="p-4.5 bg-neutral-50 border border-neutral-200/70 rounded-2xl space-y-1.5">
            <div className="flex items-center justify-between font-mono">
              <span className="font-bold text-neutral-900 text-sm">20% Weight</span>
              <span className="text-[11px] text-neutral-400">Global</span>
            </div>
            <h4 className="font-bold text-neutral-900">Timezone Overlap</h4>
            <p className="text-neutral-600 leading-relaxed text-[11px]">
              Simulates standard 8-hour workday overlap across candidate and company UTC offsets (e.g. requires ≥ 4 hours).
            </p>
          </div>

          <div className="p-4.5 bg-neutral-50 border border-neutral-200/70 rounded-2xl space-y-1.5">
            <div className="flex items-center justify-between font-mono">
              <span className="font-bold text-neutral-900 text-sm">20% Weight</span>
              <span className="text-[11px] text-neutral-400">Seniority</span>
            </div>
            <h4 className="font-bold text-neutral-900">Experience Alignment</h4>
            <p className="text-neutral-600 leading-relaxed text-[11px]">
              Measures candidate verified years of experience against target seniority thresholds (Entry, Mid, Senior, Lead).
            </p>
          </div>

          <div className="p-4.5 bg-neutral-50 border border-neutral-200/70 rounded-2xl space-y-1.5">
            <div className="flex items-center justify-between font-mono">
              <span className="font-bold text-neutral-900 text-sm">15% Weight</span>
              <span className="text-[11px] text-neutral-400">Work Mode</span>
            </div>
            <h4 className="font-bold text-neutral-900">Work Preference</h4>
            <p className="text-neutral-600 leading-relaxed text-[11px]">
              Evaluates worldwide remote compatibility, hybrid geographic proximity, or on-site relocation constraints.
            </p>
          </div>
        </div>
      </section>

      {/* FEATURED ROLES PREVIEW */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight text-neutral-900">Featured Global Roles</h2>
            <p className="text-xs text-neutral-500">
              Live sample listings with verified international employers
            </p>
          </div>
          <button
            onClick={() => onExploreJobs()}
            className="text-xs font-semibold text-neutral-900 hover:text-neutral-700 flex items-center gap-1"
          >
            <span>View all positions ({featuredJobs.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {featuredJobs.slice(0, 4).map((job) => (
            <div
              key={job.id}
              onClick={() => onSelectJob(job)}
              className="bg-white border border-neutral-200/80 hover:border-neutral-400 rounded-2xl p-5 transition-all cursor-pointer shadow-2xs hover:shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-xs text-neutral-500 flex items-center gap-1.5">
                    <span className="font-semibold text-neutral-800">{job.company?.name}</span>
                    <span>·</span>
                    <span>{job.department}</span>
                    {(job.isFreelanceGig || job.employmentType === 'CONTRACT' || job.employmentType === 'FREELANCE') && (
                      <span className="px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 font-mono text-[10px] font-bold">
                        {job.employmentType === 'FREELANCE' ? 'FREELANCE' : 'CONTRACT'}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-neutral-900 mt-1">{job.title}</h3>
                </div>
                <span className="font-mono tabular-nums text-xs font-bold text-neutral-900 bg-neutral-100 px-2.5 py-1 rounded-md shrink-0">
                  {formatCompensation(job)}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-500">
                <span className="flex items-center gap-1 font-medium text-neutral-700">
                  <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{job.isRemote ? 'Worldwide Remote' : job.location}</span>
                </span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{job.projectDuration || job.timezoneRequirement || 'Flexible'}</span>
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {job.skills.slice(0, 4).map((skill) => (
                  <span key={skill} className="text-xs px-2 py-0.5 bg-neutral-100 text-neutral-700 rounded font-mono">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* GLOBALHIRE PRO: WHY CANDIDATES & FREELANCERS PAY */}
      <section className="bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 text-white rounded-3xl p-8 sm:p-10 border border-neutral-800 shadow-xl space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/10 border border-amber-400/20 rounded-full text-xs font-mono text-amber-400">
              <Zap className="w-3.5 h-3.5" />
              <span>GlobalHire Pro & Freelancer Tier</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Why Global Developers & Contractors Choose Pro
            </h2>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Job seekers and remote contractors subscribe to accelerate international callbacks, unlock unlimited AI ATS optimizations, and close high-rate freelance contracts with 0% platform take rates.
            </p>
          </div>

          {onOpenPricing && (
            <button
              onClick={onOpenPricing}
              className="px-6 py-3 text-xs font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-md flex items-center gap-2 shrink-0"
            >
              <span>View Plans ($19/mo)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-white">Unlimited AI CV & ATS Optimization</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Continuous parsing against global job criteria, automated keyword injection, and impact-driven metric bullet point rewrites.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-400/10 text-emerald-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-white">#1 Priority ATS Placement</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Bypass high-volume applicant queues. Pro candidate profiles are highlighted and ranked first in employer ATS pipelines.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-400/10 text-indigo-400 flex items-center justify-center font-bold">
              <Briefcase className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-white">Verified Freelance & 0% Fees</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Display verified hourly contractor badges ($/hr), generate AI milestone statement of work proposals, and keep 100% of contract earnings.
            </p>
          </div>
        </div>
      </section>

      {/* ACADEMIC PRESENTATION BANNER */}
      <section className="bg-neutral-100/80 border border-neutral-200 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-2xl bg-neutral-900 text-white flex items-center justify-center shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <h3 className="text-base font-bold text-neutral-900">
              Computer Science & IT Final Year Project · Viva Defense Mode
            </h3>
            <p className="text-xs text-neutral-500 max-w-xl leading-relaxed">
              Explore the 7 academic slides, MySQL Prisma ORM schema specifications, relational entity models, and system architecture directly in presentation mode.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenAcademicDeck}
          className="px-5 py-2.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl transition-colors shrink-0 shadow-xs flex items-center gap-2"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Launch 7-Slide Deck</span>
        </button>
      </section>
    </div>
  );
}
