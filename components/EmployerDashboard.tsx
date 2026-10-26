'use client';

import React, { useState } from 'react';
import { Job, Application, Company, ApplicationStatus } from '@/lib/types';
import {
  Plus,
  Briefcase,
  Users,
  Sparkles,
  Calendar,
  CheckCircle2,
  XCircle,
  FileText,
  Clock,
  Video,
  ArrowRight,
  Filter,
} from 'lucide-react';

interface EmployerDashboardProps {
  company?: Company;
  jobs: Job[];
  applications: Application[];
  onPostJob: (jobData: Record<string, unknown>) => Promise<void>;
  onUpdateStatus: (applicationId: string, status: ApplicationStatus, notes?: string) => Promise<void>;
  onScheduleInterview: (data: {
    applicationId: string;
    scheduledAt: string;
    durationMinutes: number;
    timezone: string;
    meetingLink: string;
    meetingPlatform: string;
    notes?: string;
  }) => Promise<void>;
}

export default function EmployerDashboard({
  company,
  jobs,
  applications,
  onPostJob,
  onUpdateStatus,
  onScheduleInterview,
}: EmployerDashboardProps) {
  const [activeTab, setActiveTab] = useState<'applicants' | 'postings'>('applicants');
  const [selectedJobFilter, setSelectedJobFilter] = useState<string>('ALL');
  const [isPostingModalOpen, setIsPostingModalOpen] = useState(false);
  const [schedulingApp, setSchedulingApp] = useState<Application | null>(null);

  // New Job Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDept, setNewDept] = useState('Engineering');
  const [newDesc, setNewDesc] = useState('');
  const [newSkills, setNewSkills] = useState('TypeScript, Next.js, MySQL');
  const [newSalaryMin, setNewSalaryMin] = useState(100000);
  const [newSalaryMax, setNewSalaryMax] = useState(130000);
  const [newExpLevel, setNewExpLevel] = useState('SENIOR');
  const [newTimezoneReq, setNewTimezoneReq] = useState('UTC-4 to UTC+3');
  const [isSubmittingJob, setIsSubmittingJob] = useState(false);

  // Interview Form State
  const [interviewDate, setInterviewDate] = useState('2026-10-08T15:00');
  const [interviewDuration, setInterviewDuration] = useState(45);
  const [interviewTimezone, setInterviewTimezone] = useState('UTC+1 (BST)');
  const [interviewPlatform, setInterviewPlatform] = useState('Google Meet');
  const [interviewLink, setInterviewLink] = useState('https://meet.google.com/ais-hire-demo');
  const [interviewNotes, setInterviewNotes] = useState('Technical deep dive & system architecture discussion');
  const [isSubmittingInterview, setIsSubmittingInterview] = useState(false);

  // Job Templates (as specified in Slide 4)
  const jobTemplates = [
    {
      label: 'Full-Stack Next.js Lead',
      title: 'Lead Full-Stack Engineer (Next.js & TypeScript)',
      dept: 'Core Web Platform',
      skills: 'TypeScript, Next.js, React, Node.js, Prisma, MySQL, Docker',
      exp: 'LEAD',
      salaryMin: 125000,
      salaryMax: 160000,
      desc: 'Lead the architecture of our cloud web console with Next.js 16, server actions, and high-performance relational data querying.',
    },
    {
      label: 'Cloud DevOps / SRE',
      title: 'Senior Cloud & Reliability Engineer',
      dept: 'Infrastructure',
      skills: 'Kubernetes, Docker, AWS, Terraform, Prometheus, Linux',
      exp: 'SENIOR',
      salaryMin: 110000,
      salaryMax: 145000,
      desc: 'Build global multi-region infrastructure pipelines with automated failover and 99.99% uptime guarantees.',
    },
    {
      label: 'AI / ML Web Specialist',
      title: 'AI Interface & Systems Engineer',
      dept: 'Applied Intelligence',
      skills: 'Python, TypeScript, React, WebSockets, PyTorch, Docker',
      exp: 'MID',
      salaryMin: 95000,
      salaryMax: 130000,
      desc: 'Design real-time browser canvas interfaces for machine learning inference streaming and multimodal telemetry.',
    },
  ];

  const handleApplyTemplate = (tmpl: typeof jobTemplates[0]) => {
    setNewTitle(tmpl.title);
    setNewDept(tmpl.dept);
    setNewSkills(tmpl.skills);
    setNewExpLevel(tmpl.exp);
    setNewSalaryMin(tmpl.salaryMin);
    setNewSalaryMax(tmpl.salaryMax);
    setNewDesc(tmpl.desc);
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingJob(true);
    try {
      await onPostJob({
        title: newTitle,
        department: newDept,
        description: newDesc,
        requirements: [
          'Strong engineering fundamentals and code quality discipline',
          'Demonstrated experience with production web systems',
          'Strong communication skills for asynchronous remote collaboration',
        ],
        skills: newSkills.split(',').map((s) => s.trim()).filter(Boolean),
        salaryMin: newSalaryMin,
        salaryMax: newSalaryMax,
        experienceLevel: newExpLevel,
        timezoneRequirement: newTimezoneReq,
        isRemote: true,
        location: 'Global Remote',
      });
      setIsPostingModalOpen(false);
      setNewTitle('');
      setNewDesc('');
    } finally {
      setIsSubmittingJob(false);
    }
  };

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schedulingApp) return;
    setIsSubmittingInterview(true);
    try {
      await onScheduleInterview({
        applicationId: schedulingApp.id,
        scheduledAt: new Date(interviewDate).toISOString(),
        durationMinutes: interviewDuration,
        timezone: interviewTimezone,
        meetingLink: interviewLink,
        meetingPlatform: interviewPlatform,
        notes: interviewNotes,
      });
      setSchedulingApp(null);
    } finally {
      setIsSubmittingInterview(false);
    }
  };

  const filteredApplications = applications.filter((app) => {
    if (selectedJobFilter !== 'ALL' && app.jobId !== selectedJobFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Employer Banner */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-neutral-900 text-white flex items-center justify-center font-bold text-lg overflow-hidden shrink-0">
            {company?.logoUrl ? (
              <img
                src={company.logoUrl}
                alt={company.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span>{company?.name?.charAt(0) || 'C'}</span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-neutral-900 tracking-tight">
                {company?.name || 'CloudScale Labs'}
              </h2>
              <span className="text-xs px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded font-medium">
                Verified Global Employer
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              {company?.industry || 'Cloud Infrastructure'} · {company?.headquarters || 'London, UK'} · Team {company?.teamSize || '120-250'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPostingModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Post New Job Role</span>
          </button>
        </div>
      </div>

      {/* Navigation tabs: Applicants ATS vs Manage Postings */}
      <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-xl max-w-md">
        <button
          onClick={() => setActiveTab('applicants')}
          className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
            activeTab === 'applicants'
              ? 'bg-white text-neutral-900 shadow-2xs font-semibold'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Applicant Tracking ({applications.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('postings')}
          className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
            activeTab === 'postings'
              ? 'bg-white text-neutral-900 shadow-2xs font-semibold'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Active Postings ({jobs.length})</span>
        </button>
      </div>

      {/* ATS PIPELINE TAB */}
      {activeTab === 'applicants' && (
        <div className="space-y-4">
          {/* Job Filter selector */}
          <div className="flex items-center justify-between text-xs bg-white p-3 border border-neutral-200 rounded-xl">
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-neutral-400" />
              <span className="text-neutral-600 font-medium">Filter by Position:</span>
              <select
                value={selectedJobFilter}
                onChange={(e) => setSelectedJobFilter(e.target.value)}
                className="text-xs py-1 px-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:ring-1 focus:ring-neutral-900"
              >
                <option value="ALL">All Open Positions ({applications.length} applicants)</option>
                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.title}
                  </option>
                ))}
              </select>
            </div>
            <span className="text-neutral-500 font-mono tabular-nums">
              Ranked by Smart Match Compatibility
            </span>
          </div>

          {filteredApplications.length === 0 ? (
            <div className="bg-white border border-neutral-200 rounded-2xl p-12 text-center space-y-2">
              <Users className="w-8 h-8 text-neutral-400 mx-auto" />
              <h3 className="text-sm font-semibold text-neutral-900">No applicants found</h3>
              <p className="text-xs text-neutral-500">
                New candidate applications will appear here ranked by their skills & timezone match score.
              </p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {filteredApplications.map((app) => {
                const profile = app.seeker?.profile;
                return (
                  <div
                    key={app.id}
                    className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs space-y-4"
                  >
                    {/* Candidate Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex items-start gap-3.5">
                        <div className="w-10 h-10 rounded-full bg-neutral-100 overflow-hidden shrink-0 border border-neutral-200">
                          <img
                            src={profile?.avatarUrl || '/images/avatar_candidate_engineer_1790927054479.jpg'}
                            alt={profile?.fullName || 'Candidate'}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-neutral-900">
                              {profile?.fullName || 'Sarah Chen'}
                            </h4>
                            <span className="text-xs text-neutral-400">·</span>
                            <span className="text-xs text-neutral-500 font-mono">
                              {profile?.location || 'London, UK'} ({profile?.timezone || 'UTC+1'})
                            </span>
                          </div>
                          <p className="text-xs text-neutral-600 mt-0.5">
                            {profile?.headline || 'Senior Full-Stack Engineer'}
                          </p>
                          <p className="text-xs text-neutral-500 mt-0.5">
                            Applied for: <span className="font-semibold text-neutral-800">{app.job?.title}</span>
                          </p>
                        </div>
                      </div>

                      {/* Match Score Badge & Current Status */}
                      <div className="flex items-center gap-2 self-start">
                        <div className="flex items-center gap-1 text-xs font-mono font-bold bg-neutral-900 text-white px-2.5 py-1 rounded-lg">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{app.matchScore}% Match</span>
                        </div>
                        <span className="text-xs font-medium bg-neutral-100 text-neutral-800 px-2.5 py-1 rounded-lg border border-neutral-200">
                          {app.status}
                        </span>
                      </div>
                    </div>

                    {/* Match Breakdown Bar */}
                    {app.matchBreakdown && (
                      <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200/60 text-xs space-y-1.5">
                        <div className="flex items-center justify-between font-mono text-[11px] text-neutral-600">
                          <span>Skills Score: {app.matchBreakdown.skillScore}%</span>
                          <span>Timezone Overlap: {app.matchBreakdown.overlapHours}h / day</span>
                          <span>Experience Fit: {app.matchBreakdown.experienceScore}%</span>
                        </div>
                        <p className="text-neutral-700 text-[11px] leading-relaxed">
                          {app.matchBreakdown.rationale}
                        </p>
                      </div>
                    )}

                    {/* Candidate Cover Note */}
                    {app.coverLetter && (
                      <div className="text-xs text-neutral-600 bg-white p-3 rounded-lg border border-neutral-200 leading-relaxed whitespace-pre-line">
                        <span className="font-semibold text-neutral-800 block mb-1">Cover Note:</span>
                        {app.coverLetter}
                      </div>
                    )}

                    {/* ATS Pipeline Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-neutral-100 text-xs">
                      <div className="flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-neutral-400" />
                        <span className="text-neutral-500 font-mono">
                          {profile?.resumeFileName || 'Resume.pdf'} attached
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {app.status !== 'SHORTLISTED' && app.status !== 'INTERVIEW_SCHEDULED' && app.status !== 'HIRED' && (
                          <button
                            onClick={() => onUpdateStatus(app.id, 'SHORTLISTED')}
                            className="px-3 py-1.5 font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Shortlist</span>
                          </button>
                        )}

                        <button
                          onClick={() => setSchedulingApp(app)}
                          className="px-3 py-1.5 font-medium text-white bg-purple-700 hover:bg-purple-800 rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>Schedule Interview</span>
                        </button>

                        {app.status !== 'HIRED' && (
                          <button
                            onClick={() => onUpdateStatus(app.id, 'HIRED')}
                            className="px-3 py-1.5 font-medium text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
                          >
                            Extend Offer
                          </button>
                        )}

                        {app.status !== 'REJECTED' && (
                          <button
                            onClick={() => onUpdateStatus(app.id, 'REJECTED')}
                            className="px-2.5 py-1.5 text-neutral-400 hover:text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                            title="Decline applicant"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* JOB POSTINGS TAB */}
      {activeTab === 'postings' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3.5">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-neutral-500">
                    <span className="font-semibold text-neutral-800">{job.department}</span>
                    <span aria-hidden="true">·</span>
                    <span>{job.employmentType}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums font-medium text-neutral-700">
                      ${(job.salaryMin / 1000).toFixed(0)}k – ${(job.salaryMax / 1000).toFixed(0)}k
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-neutral-900">{job.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-neutral-500">
                    <span>{job.location}</span>
                    <span aria-hidden="true">·</span>
                    <span>Timezone: {job.timezoneRequirement || 'Flexible'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-base font-bold font-mono text-neutral-900 tabular-nums">
                      {applications.filter((a) => a.jobId === job.id).length}
                    </span>
                    <span className="text-xs text-neutral-500 block">Applicants</span>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedJobFilter(job.id);
                      setActiveTab('applicants');
                    }}
                    className="px-3.5 py-2 text-xs font-medium text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors inline-flex items-center gap-1"
                  >
                    <span>View Candidates</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: POST NEW JOB WITH TEMPLATES */}
      {isPostingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-neutral-900">Post New Global Role</h3>
                <p className="text-xs text-neutral-500">Publish worldwide vacancy with timezone & skill criteria</p>
              </div>
              <button
                onClick={() => setIsPostingModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 p-1"
              >
                ✕
              </button>
            </div>

            {/* Quick Templates selector */}
            <div className="p-4 bg-neutral-50 border-b border-neutral-200/80">
              <span className="text-[11px] font-semibold text-neutral-500 block mb-2">
                FAST-START TEMPLATES (SLIDE 4 COMPLIANT):
              </span>
              <div className="flex flex-wrap gap-2">
                {jobTemplates.map((tmpl) => (
                  <button
                    key={tmpl.label}
                    type="button"
                    onClick={() => handleApplyTemplate(tmpl)}
                    className="px-2.5 py-1 bg-white border border-neutral-300 hover:border-neutral-900 text-xs font-medium text-neutral-800 rounded-lg transition-colors"
                  >
                    + {tmpl.label}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleCreateJob} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              <div>
                <label className="block font-medium text-neutral-700 mb-1">Job Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Senior Full-Stack Engineer"
                  className="w-full p-2.5 border border-neutral-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="w-full p-2.5 border border-neutral-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Experience Level</label>
                  <select
                    value={newExpLevel}
                    onChange={(e) => setNewExpLevel(e.target.value)}
                    className="w-full p-2.5 border border-neutral-300 rounded-lg text-xs"
                  >
                    <option value="ENTRY">Entry Level (1-2 yrs)</option>
                    <option value="MID">Mid Level (3-4 yrs)</option>
                    <option value="SENIOR">Senior Level (5-7 yrs)</option>
                    <option value="LEAD">Lead / Architect (8+ yrs)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-neutral-700 mb-1">
                  Required Skills (Comma separated for Smart Matching)
                </label>
                <input
                  type="text"
                  required
                  value={newSkills}
                  onChange={(e) => setNewSkills(e.target.value)}
                  placeholder="TypeScript, Next.js, MySQL, Docker"
                  className="w-full p-2.5 border border-neutral-300 rounded-lg text-xs font-mono"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Min Salary ($)</label>
                  <input
                    type="number"
                    step={5000}
                    value={newSalaryMin}
                    onChange={(e) => setNewSalaryMin(parseInt(e.target.value) || 0)}
                    className="w-full p-2.5 border border-neutral-300 rounded-lg text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Max Salary ($)</label>
                  <input
                    type="number"
                    step={5000}
                    value={newSalaryMax}
                    onChange={(e) => setNewSalaryMax(parseInt(e.target.value) || 0)}
                    className="w-full p-2.5 border border-neutral-300 rounded-lg text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Timezone Overlap Req</label>
                  <input
                    type="text"
                    value={newTimezoneReq}
                    onChange={(e) => setNewTimezoneReq(e.target.value)}
                    placeholder="UTC-4 to UTC+3"
                    className="w-full p-2.5 border border-neutral-300 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-neutral-700 mb-1">Role Description</label>
                <textarea
                  rows={4}
                  required
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Describe key responsibilities and mission..."
                  className="w-full p-2.5 border border-neutral-300 rounded-lg text-xs"
                />
              </div>

              <div className="pt-3 border-t border-neutral-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPostingModalOpen(false)}
                  className="px-4 py-2 border border-neutral-200 rounded-lg text-neutral-700 hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingJob}
                  className="px-5 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 disabled:opacity-50"
                >
                  {isSubmittingJob ? 'Publishing...' : 'Publish Job Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: INTERVIEW SCHEDULER */}
      {schedulingApp && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden">
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-neutral-900">Schedule Interview</h3>
                <p className="text-xs text-neutral-500">
                  Candidate: {schedulingApp.seeker?.profile?.fullName || 'Sarah Chen'} · {schedulingApp.job?.title}
                </p>
              </div>
              <button onClick={() => setSchedulingApp(null)} className="text-neutral-400 hover:text-neutral-700 p-1">
                ✕
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-neutral-700 mb-1">Date & Time</label>
                <input
                  type="datetime-local"
                  required
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  className="w-full p-2.5 border border-neutral-300 rounded-lg font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Duration (Minutes)</label>
                  <input
                    type="number"
                    value={interviewDuration}
                    onChange={(e) => setInterviewDuration(parseInt(e.target.value) || 45)}
                    className="w-full p-2.5 border border-neutral-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Timezone</label>
                  <input
                    type="text"
                    value={interviewTimezone}
                    onChange={(e) => setInterviewTimezone(e.target.value)}
                    className="w-full p-2.5 border border-neutral-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-neutral-700 mb-1">Meeting Link</label>
                <input
                  type="url"
                  required
                  value={interviewLink}
                  onChange={(e) => setInterviewLink(e.target.value)}
                  className="w-full p-2.5 border border-neutral-300 rounded-lg font-mono text-neutral-800"
                />
              </div>

              <div>
                <label className="block font-medium text-neutral-700 mb-1">Agenda & Notes for Candidate</label>
                <textarea
                  rows={3}
                  value={interviewNotes}
                  onChange={(e) => setInterviewNotes(e.target.value)}
                  className="w-full p-2.5 border border-neutral-300 rounded-lg"
                />
              </div>

              <div className="pt-2 border-t border-neutral-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSchedulingApp(null)}
                  className="px-3.5 py-2 border border-neutral-200 rounded-lg text-neutral-700 hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingInterview}
                  className="px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 disabled:opacity-50 font-medium"
                >
                  {isSubmittingInterview ? 'Confirming...' : 'Confirm & Send Invitation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
