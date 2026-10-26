'use client';

import React from 'react';
import { Application, Job } from '@/lib/types';
import { Sparkles, Calendar, Video, Clock, CheckCircle2, AlertCircle, FileText, ArrowRight } from 'lucide-react';

interface ApplicationsTrackerProps {
  applications: Application[];
  onSelectJob: (job: Job) => void;
}

export default function ApplicationsTracker({ applications, onSelectJob }: ApplicationsTrackerProps) {
  const getStatusBadge = (status: Application['status']) => {
    switch (status) {
      case 'SUBMITTED':
        return { label: 'Application Submitted', style: 'bg-neutral-100 text-neutral-800' };
      case 'UNDER_REVIEW':
        return { label: 'Under Review', style: 'bg-blue-50 text-blue-800' };
      case 'SHORTLISTED':
        return { label: 'Shortlisted by Hiring Team', style: 'bg-emerald-50 text-emerald-800' };
      case 'INTERVIEW_SCHEDULED':
        return { label: 'Interview Scheduled', style: 'bg-purple-50 text-purple-800' };
      case 'HIRED':
        return { label: 'Offer Extended', style: 'bg-emerald-100 text-emerald-900 font-semibold' };
      case 'REJECTED':
        return { label: 'Not Selected', style: 'bg-neutral-100 text-neutral-500' };
      default:
        return { label: status, style: 'bg-neutral-100 text-neutral-800' };
    }
  };

  const stages: Application['status'][] = ['SUBMITTED', 'UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEW_SCHEDULED'];

  const getStageIndex = (status: Application['status']) => {
    switch (status) {
      case 'SUBMITTED':
        return 0;
      case 'UNDER_REVIEW':
        return 1;
      case 'SHORTLISTED':
        return 2;
      case 'INTERVIEW_SCHEDULED':
        return 3;
      case 'HIRED':
        return 4;
      default:
        return 0;
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight">My Active Applications</h2>
          <p className="text-xs text-neutral-500 mt-1">
            Real-time status tracking for positions you applied to across global employers.
          </p>
        </div>
        <div className="text-xs font-mono text-neutral-600 bg-neutral-50 px-3 py-1.5 rounded-lg border border-neutral-200">
          <span className="font-semibold text-neutral-900">{applications.length}</span> Total Applications
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-2xl p-12 text-center space-y-3">
          <div className="w-10 h-10 rounded-full bg-neutral-100 text-neutral-400 mx-auto flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-neutral-900">No applications submitted yet</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Browse open positions, check your smart match compatibility, and apply in one click.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => {
            const badge = getStatusBadge(app.status);
            const currentStageIdx = getStageIndex(app.status);

            return (
              <div
                key={app.id}
                className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs space-y-5"
              >
                {/* Job & Company summary */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-neutral-500 mb-1">
                      <span className="font-semibold text-neutral-800">{app.job?.company?.name || 'Employer'}</span>
                      <span aria-hidden="true">·</span>
                      <span>{app.job?.department}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">
                        Applied {new Date(app.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h3
                      onClick={() => app.job && onSelectJob(app.job)}
                      className="text-base font-semibold text-neutral-900 hover:text-neutral-700 cursor-pointer transition-colors"
                    >
                      {app.job?.title || 'Open Position'}
                    </h3>

                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-xs px-2.5 py-0.5 rounded-md font-medium ${badge.style}`}>
                        {badge.label}
                      </span>
                      <div className="flex items-center gap-1 text-xs font-mono font-medium text-neutral-700 bg-neutral-50 px-2 py-0.5 rounded-md border border-neutral-200">
                        <Sparkles className="w-3 h-3 text-neutral-700" />
                        <span>{app.matchScore}% Match Score</span>
                      </div>
                    </div>
                  </div>

                  {app.job && (
                    <button
                      onClick={() => onSelectJob(app.job!)}
                      className="px-3 py-1.5 text-xs font-medium text-neutral-700 bg-neutral-50 hover:bg-neutral-100 rounded-lg border border-neutral-200 transition-colors self-start inline-flex items-center gap-1"
                    >
                      <span>View Job Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Visual Pipeline Progress */}
                <div className="pt-2">
                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    {stages.map((stage, idx) => {
                      const isComplete = currentStageIdx >= idx;
                      const isCurrent = currentStageIdx === idx;
                      const labels = ['Submitted', 'Under Review', 'Shortlisted', 'Interview'];
                      return (
                        <div key={stage} className="space-y-1.5">
                          <div
                            className={`h-1.5 rounded-full transition-all ${
                              isComplete ? 'bg-neutral-900' : 'bg-neutral-200'
                            }`}
                          />
                          <p
                            className={`text-[11px] ${
                              isCurrent
                                ? 'font-bold text-neutral-900'
                                : isComplete
                                ? 'text-neutral-700 font-medium'
                                : 'text-neutral-400'
                            }`}
                          >
                            {labels[idx]}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Interview Invitation Card if scheduled */}
                {app.interviews && app.interviews.length > 0 && (
                  <div className="p-4 bg-purple-50/70 border border-purple-200/80 rounded-xl space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-purple-900 font-semibold">
                        <Video className="w-4 h-4 text-purple-700" />
                        <span>Interview Scheduled with Hiring Lead</span>
                      </div>
                      <span className="font-mono text-purple-700 font-medium">
                        {app.interviews[0].status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-purple-950 pt-1">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-purple-700" />
                        <span className="font-mono tabular-nums">
                          {new Date(app.interviews[0].scheduledAt).toLocaleString(undefined, {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-purple-700" />
                        <span>Duration: {app.interviews[0].durationMinutes} mins · {app.interviews[0].timezone}</span>
                      </div>
                    </div>

                    {app.interviews[0].notes && (
                      <p className="text-[11px] text-purple-900 bg-white/60 p-2 rounded border border-purple-200/50">
                        <span className="font-medium">Agenda: </span>
                        {app.interviews[0].notes}
                      </p>
                    )}

                    <div className="pt-1">
                      <a
                        href={app.interviews[0].meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded-lg font-medium text-xs transition-colors"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Join {app.interviews[0].meetingPlatform} Meeting</span>
                      </a>
                    </div>
                  </div>
                )}

                {/* Match Rationale Pill */}
                {app.matchBreakdown && (
                  <div className="text-[11px] text-neutral-500 border-t border-neutral-100 pt-3 flex items-center justify-between">
                    <span>Smart Match breakdown: {app.matchBreakdown.rationale}</span>
                    <span className="font-mono tabular-nums font-medium text-neutral-700">
                      {app.matchBreakdown.overlapHours}h daily overlap
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
