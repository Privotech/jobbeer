'use client';

import React from 'react';
import { Job, MatchBreakdown } from '@/lib/types';
import { Bookmark, Sparkles, MapPin, Clock, DollarSign, ArrowUpRight, Briefcase } from 'lucide-react';

interface JobCardProps {
  job: Job & { matchBreakdown?: MatchBreakdown; matchScore?: number; isSaved?: boolean };
  onSelect: (job: Job) => void;
  onApply: (job: Job) => void;
  onToggleSave: (jobId: string) => void;
  onOpenAiAssistant?: (job: Job, tab: 'cover_letter' | 'freelance_pitch') => void;
}

export default function JobCard({ job, onSelect, onApply, onToggleSave, onOpenAiAssistant }: JobCardProps) {
  const match = job.matchBreakdown;
  const matchScore = job.matchScore ?? match?.overallScore;
  const isFreelance = job.isFreelanceGig || job.employmentType === 'CONTRACT' || job.employmentType === 'FREELANCE';

  // Format compensation
  const formatCompensation = () => {
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
    <div
      onClick={() => onSelect(job)}
      className="group relative bg-white border border-neutral-200/80 hover:border-neutral-400/90 rounded-2xl p-5 transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-4">
        {/* Main Info */}
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <span className="font-semibold text-neutral-800">{job.company?.name || 'Global Employer'}</span>
            <span aria-hidden="true">·</span>
            <span>{job.department}</span>
            {isFreelance && (
              <>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                  <Briefcase className="w-2.5 h-2.5" />
                  <span>{job.employmentType === 'FREELANCE' ? 'FREELANCE GIG' : 'CONTRACT'}</span>
                </span>
              </>
            )}
            {job.company?.verified && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-700 font-medium">Verified Employer</span>
              </>
            )}
          </div>

          <h3 className="text-base font-bold text-neutral-900 group-hover:text-neutral-700 transition-colors truncate">
            {job.title}
          </h3>

          {/* Unboxed Metadata (Zero-Pill Rule) */}
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-neutral-500 pt-0.5">
            <span className="flex items-center gap-1 font-medium text-neutral-700">
              <MapPin className="w-3.5 h-3.5 text-neutral-400" />
              <span>{job.isRemote ? 'Worldwide Remote' : job.location}</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-neutral-400" />
              <span>{job.projectDuration || job.timezoneRequirement || 'Flexible Hours'}</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1 font-mono tabular-nums text-neutral-900 font-bold">
              <DollarSign className="w-3.5 h-3.5 text-neutral-400" />
              <span>{formatCompensation()}</span>
            </span>
            <span aria-hidden="true">·</span>
            <span>{job.experienceLevel} Level</span>
          </div>
        </div>

        {/* Action icons & Match Score */}
        <div className="flex flex-col items-end gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onToggleSave(job.id)}
              className="p-1.5 text-neutral-400 hover:text-neutral-800 rounded-lg hover:bg-neutral-100 transition-colors"
              title={job.isSaved ? 'Remove from saved' : 'Save job'}
            >
              <Bookmark className={`w-4 h-4 ${job.isSaved ? 'fill-neutral-900 text-neutral-900' : ''}`} />
            </button>
            <button
              onClick={() => onApply(job)}
              className="px-3.5 py-1.5 text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl transition-colors whitespace-nowrap inline-flex items-center gap-1 shadow-2xs"
            >
              <span>{isFreelance ? 'Propose' : 'Apply'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {matchScore !== undefined && (
            <div
              className={`flex items-center gap-1 text-xs font-mono tabular-nums font-semibold px-2 py-0.5 rounded-md ${
                matchScore >= 85
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/60'
                  : matchScore >= 70
                  ? 'bg-blue-50 text-blue-800 border border-blue-200/60'
                  : 'bg-neutral-100 text-neutral-700 border border-neutral-200/60'
              }`}
              title={match?.rationale || `${matchScore}% Match Score`}
            >
              <Sparkles className="w-3 h-3" />
              <span>{matchScore}% Match</span>
            </div>
          )}
        </div>
      </div>

      {/* Description Snippet */}
      <p className="mt-3 text-xs text-neutral-600 line-clamp-2 leading-relaxed">
        {job.description}
      </p>

      {/* Skills list & AI Quick Assistant */}
      <div className="mt-3.5 pt-3 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-medium text-neutral-400 mr-1">Skills:</span>
          {job.skills.map((skill) => {
            const isMatched = match?.matchedSkills.includes(skill.toLowerCase());
            return (
              <span
                key={skill}
                className={`text-xs px-2 py-0.5 rounded font-mono ${
                  isMatched
                    ? 'bg-neutral-100 text-neutral-900 font-medium'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {skill}
              </span>
            );
          })}
        </div>

        {onOpenAiAssistant && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenAiAssistant(job, isFreelance ? 'freelance_pitch' : 'cover_letter');
            }}
            className="text-[11px] font-semibold text-neutral-700 hover:text-neutral-950 flex items-center gap-1 hover:underline"
          >
            <Sparkles className="w-3 h-3 text-emerald-600" />
            <span>{isFreelance ? 'AI Pitch' : 'AI Cover Letter'}</span>
          </button>
        )}
      </div>
    </div>
  );
}
