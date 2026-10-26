'use client';

import React, { useState } from 'react';
import { Job, Profile, MatchBreakdown } from '@/lib/types';
import { X, Sparkles, MapPin, Clock, DollarSign, CheckCircle2, AlertCircle, FileText, ArrowRight } from 'lucide-react';

interface JobDetailModalProps {
  job: (Job & { matchBreakdown?: MatchBreakdown; matchScore?: number; isSaved?: boolean }) | null;
  profile?: Profile;
  onClose: () => void;
  onSubmitApplication: (jobId: string, coverLetter: string) => Promise<void>;
  onOpenAiAssistant?: (job: Job, tab: 'cover_letter' | 'freelance_pitch') => void;
}

export default function JobDetailModal({
  job,
  profile,
  onClose,
  onSubmitApplication,
  onOpenAiAssistant,
}: JobDetailModalProps) {
  const isFreelance = job?.isFreelanceGig || job?.employmentType === 'CONTRACT' || job?.employmentType === 'FREELANCE';

  const [coverLetter, setCoverLetter] = useState(
    isFreelance
      ? `Hello client team,\n\nI am submitting my proposal for ${job?.title || 'this contract'}. As an independent contractor with ${profile?.experienceYears || 5}+ years specializing in ${profile?.skills?.slice(0, 3).join(', ') || 'modern stacks'}, I am available to execute your milestones at $${profile?.hourlyRate || 85}/hr with 0% platform overhead.`
      : `Hello hiring team,\n\nI am excited to apply for this ${job?.title || 'role'}. With my background in ${profile?.skills?.slice(0, 3).join(', ') || 'modern engineering'} and experience working in timezone ${profile?.timezone || 'UTC+1'}, I can deliver high-impact results from day one.`
  );
  const [isApplying, setIsApplying] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!job) return null;

  const match = job.matchBreakdown;
  const matchScore = job.matchScore ?? match?.overallScore;

  const handleApply = async () => {
    setIsApplying(true);
    try {
      await onSubmitApplication(job.id, coverLetter);
      setSubmitted(true);
    } finally {
      setIsApplying(false);
    }
  };

  const formatCompensation = () => {
    const symbol = job.currency === 'EUR' ? '€' : job.currency === 'GBP' ? '£' : '$';
    if (job.rateType === 'HOURLY') {
      return `${symbol}${job.hourlyRateMin || job.salaryMin} – ${symbol}${job.hourlyRateMax || job.salaryMax} / hr`;
    }
    if (job.rateType === 'FIXED_PROJECT') {
      return `${symbol}${(job.salaryMin / 1000).toFixed(0)}k – ${symbol}${(job.salaryMax / 1000).toFixed(0)}k Fixed`;
    }
    return `${symbol}${(job.salaryMin / 1000).toFixed(0)}k – ${symbol}${(job.salaryMax / 1000).toFixed(0)}k / year`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-neutral-100 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-neutral-500 mb-1">
              <span className="font-semibold text-neutral-800">{job.company?.name}</span>
              <span aria-hidden="true">·</span>
              <span>{job.department}</span>
              {job.company?.verified && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-emerald-700 font-medium">Verified Employer</span>
                </>
              )}
            </div>
            <h2 className="text-xl font-bold text-neutral-900 tracking-tight">{job.title}</h2>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-500 mt-2">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                <span>{job.isRemote ? 'Worldwide Remote' : job.location}</span>
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-neutral-400" />
                <span>{job.timezoneRequirement || 'Flexible'}</span>
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums font-bold text-neutral-900 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-neutral-400" />
                <span>{formatCompensation()}</span>
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Smart Match Breakdown Card */}
          {match && (
            <div className="bg-neutral-50 border border-neutral-200/80 rounded-xl p-4.5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-neutral-900 text-white flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-neutral-900">Intelligent Match Analysis</h4>
                    <p className="text-[11px] text-neutral-500">Algorithmic scoring against your candidate profile</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold font-mono tabular-nums text-neutral-900">
                    {matchScore}%
                  </span>
                  <p className="text-[10px] uppercase font-semibold tracking-wider text-neutral-500">
                    {match.tier}
                  </p>
                </div>
              </div>

              {/* Rationale */}
              <p className="text-xs text-neutral-700 bg-white p-2.5 rounded-lg border border-neutral-200/60 leading-relaxed">
                {match.rationale}
              </p>

              {/* 4 Dimension Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 text-xs">
                <div className="bg-white p-2.5 rounded-lg border border-neutral-200/50">
                  <span className="text-[11px] text-neutral-500 block">Skills Score</span>
                  <span className="font-mono tabular-nums font-semibold text-neutral-900">{match.skillScore}%</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-neutral-200/50">
                  <span className="text-[11px] text-neutral-500 block">Timezone Overlap</span>
                  <span className="font-mono tabular-nums font-semibold text-neutral-900">{match.overlapHours}h / day</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-neutral-200/50">
                  <span className="text-[11px] text-neutral-500 block">Seniority Fit</span>
                  <span className="font-mono tabular-nums font-semibold text-neutral-900">{match.experienceScore}%</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-neutral-200/50">
                  <span className="text-[11px] text-neutral-500 block">Work Mode</span>
                  <span className="font-mono tabular-nums font-semibold text-neutral-900">{match.remoteScore}%</span>
                </div>
              </div>

              {/* Matched & Missing Skills comparison */}
              <div className="space-y-1.5 pt-1 text-xs">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-medium text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Matched Skills:
                  </span>
                  {match.matchedSkills.map((s) => (
                    <span key={s} className="px-1.5 py-0.5 bg-emerald-50 text-emerald-800 rounded font-mono text-[11px]">
                      {s}
                    </span>
                  ))}
                  {match.matchedSkills.length === 0 && <span className="text-neutral-400">None yet</span>}
                </div>

                {match.missingSkills.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-medium text-amber-800 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                      Growth Opportunity:
                    </span>
                    {match.missingSkills.map((s) => (
                      <span key={s} className="px-1.5 py-0.5 bg-neutral-100 text-neutral-700 rounded font-mono text-[11px]">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <h4 className="text-sm font-semibold text-neutral-900 mb-2">Role Overview</h4>
            <p className="text-xs text-neutral-600 leading-relaxed whitespace-pre-line">
              {job.description}
            </p>
          </div>

          {/* Requirements */}
          <div>
            <h4 className="text-sm font-semibold text-neutral-900 mb-2">Key Requirements</h4>
            <ul className="space-y-2 text-xs text-neutral-600">
              {job.requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-1.5 shrink-0" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Nice to Have */}
          {job.niceToHave && job.niceToHave.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-neutral-900 mb-2">Bonus / Nice to Have</h4>
              <ul className="space-y-1.5 text-xs text-neutral-600">
                {job.niceToHave.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-300 mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Application Form Section */}
          <div className="border-t border-neutral-200 pt-5 space-y-4">
            <h4 className="text-sm font-semibold text-neutral-900">One-Click Application</h4>

            {submitted ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">Application Successfully Submitted!</p>
                  <p className="mt-1 text-emerald-800">
                    Your candidate profile, computed match score ({matchScore}%), and CV snapshot have been delivered directly to the employer ATS.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Profile Snapshot Preview */}
                <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-neutral-500" />
                    <div>
                      <span className="font-medium text-neutral-900">{profile?.fullName || 'Candidate Profile'}</span>
                      <span className="text-neutral-500 ml-2">({profile?.resumeFileName || 'Default Resume attached'})</span>
                    </div>
                  </div>
                  <span className="text-[11px] text-neutral-500 font-mono">
                    {profile?.skills?.length || 0} skills · {profile?.timezone || 'UTC+1'}
                  </span>
                </div>

                {/* Cover Note */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-neutral-800">
                      {isFreelance ? 'Freelance Proposal & SOW Pitch' : 'Custom Cover Note / Introduction'}
                    </label>
                    {onOpenAiAssistant && (
                      <button
                        type="button"
                        onClick={() => onOpenAiAssistant(job, isFreelance ? 'freelance_pitch' : 'cover_letter')}
                        className="text-[11px] font-semibold text-brand-primary hover:opacity-85 flex items-center gap-1 hover:underline"
                      >
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span>{isFreelance ? 'Draft Proposal with AI' : 'Draft Cover Letter with AI'}</span>
                      </button>
                    )}
                  </div>
                  <textarea
                    rows={4}
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    className="w-full text-xs p-3 border border-neutral-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-neutral-900"
                    placeholder="Tell the hiring manager why you're a good fit..."
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-medium text-neutral-600 hover:text-neutral-900 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleApply}
                    disabled={isApplying}
                    className="px-5 py-2 text-xs font-bold text-white bg-brand-primary hover:bg-brand-primary-hover rounded-xl transition-all flex items-center gap-1.5 shadow-brand disabled:opacity-50"
                  >
                    <span>{isApplying ? 'Submitting...' : 'Submit Application'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
