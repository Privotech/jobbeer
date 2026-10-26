'use client';

import React, { useState } from 'react';
import { Job, Profile } from '@/lib/types';
import {
  X,
  Sparkles,
  Zap,
  Check,
  Copy,
  ArrowRight,
  FileText,
  Briefcase,
  HelpCircle,
  TrendingUp,
  AlertCircle,
  Plus,
  RefreshCw,
  Layers,
  Crown,
} from 'lucide-react';

interface AICVAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile?: Profile;
  jobs: Job[];
  initialJob?: Job | null;
  initialTab?: 'cv_optimizer' | 'cover_letter' | 'match_prep' | 'freelance_pitch';
  onProfileUpdated: (updated: Profile) => void;
  onOpenPricing: () => void;
}

export default function AICVAssistantModal({
  isOpen,
  onClose,
  profile,
  jobs,
  initialJob,
  initialTab = 'cv_optimizer',
  onProfileUpdated,
  onOpenPricing,
}: AICVAssistantModalProps) {
  const [activeTab, setActiveTab] = useState<'cv_optimizer' | 'cover_letter' | 'match_prep' | 'freelance_pitch'>(initialTab);
  const [selectedJobId, setSelectedJobId] = useState<string>(initialJob?.id || jobs[0]?.id || '');
  const [isLoading, setIsLoading] = useState(false);
  const [customInstructions, setCustomInstructions] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Results State
  const [cvResult, setCvResult] = useState<any>(null);
  const [coverLetterResult, setCoverLetterResult] = useState<any>(null);
  const [matchPrepResult, setMatchPrepResult] = useState<any>(null);
  const [freelancePitchResult, setFreelancePitchResult] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const selectedJob = jobs.find((j) => j.id === selectedJobId) || jobs[0];
  const isPro = profile?.subscriptionTier === 'PRO' || profile?.subscriptionTier === 'FREELANCE_PRO';

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Run AI action
  const handleRunAi = async (action: 'OPTIMIZE_CV' | 'GENERATE_COVER_LETTER' | 'JOB_MATCH_DEEPDIVE' | 'FREELANCE_PITCH') => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          job: selectedJob,
          customInstructions,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.upgradeRequired) {
          setErrorMessage(data.error);
          onOpenPricing();
        } else {
          setErrorMessage(data.error || 'AI generation failed.');
        }
        return;
      }

      if (action === 'OPTIMIZE_CV') setCvResult(data.result);
      if (action === 'GENERATE_COVER_LETTER') setCoverLetterResult(data.result);
      if (action === 'JOB_MATCH_DEEPDIVE') setMatchPrepResult(data.result);
      if (action === 'FREELANCE_PITCH') setFreelancePitchResult(data.result);
    } catch {
      setErrorMessage('Failed to connect to AI Assistant. Please check your network.');
    } finally {
      setIsLoading(false);
    }
  };

  // Apply improved summary directly to profile
  const handleApplySummary = async (newSummary: string) => {
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bio: newSummary }),
      });
      const data = await res.json();
      if (res.ok && data.profile) {
        onProfileUpdated(data.profile);
        alert('Executive bio successfully updated in your profile!');
      }
    } catch {
      alert('Failed to update profile.');
    }
  };

  // Add missing keyword directly to profile skills
  const handleAddSkill = async (skill: string) => {
    if (!profile) return;
    if (profile.skills.includes(skill)) return;
    const newSkills = [...profile.skills, skill];
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skills: newSkills }),
      });
      const data = await res.json();
      if (res.ok && data.profile) {
        onProfileUpdated(data.profile);
      }
    } catch {
      // silent
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-neutral-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl border border-neutral-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-neutral-100 bg-neutral-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-emerald-400 text-neutral-950 flex items-center justify-center font-bold shadow-xs">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">AI CV & Job Discovery Assistant</h2>
                {isPro ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400 text-neutral-950 text-[10px] font-bold font-mono">
                    <Crown className="w-3 h-3" />
                    <span>UNLIMITED PRO</span>
                  </span>
                ) : (
                  <span className="text-[11px] font-mono text-neutral-400">
                    {profile?.aiCreditsRemaining ?? 5} credits left
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-300">
                AI-powered resume optimization, tailored cover letters, and freelance proposal pitch generation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isPro && (
              <button
                type="button"
                onClick={onOpenPricing}
                className="px-3 py-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 bg-neutral-800 rounded-lg border border-amber-400/30 flex items-center gap-1 transition-all"
              >
                <Zap className="w-3 h-3" />
                <span>Upgrade</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-neutral-200/80 bg-neutral-50/70 overflow-x-auto text-xs font-semibold text-neutral-600">
          <button
            type="button"
            onClick={() => setActiveTab('cv_optimizer')}
            className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'cv_optimizer'
                ? 'border-brand-primary text-brand-primary font-bold'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>AI CV & ATS Optimizer</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('cover_letter')}
            className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'cover_letter'
                ? 'border-brand-primary text-brand-primary font-bold'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Tailored Cover Letter</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('match_prep')}
            className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'match_prep'
                ? 'border-brand-primary text-brand-primary font-bold'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-blue-600" />
            <span>Interview Prep & Match Deep Dive</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('freelance_pitch')}
            className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'freelance_pitch'
                ? 'border-brand-primary text-brand-primary font-bold'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <Briefcase className="w-4 h-4 text-indigo-600" />
            <span>Freelance & Milestone Pitch</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs text-neutral-700">
          
          {errorMessage && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 1: AI CV & ATS OPTIMIZER */}
          {/* ================================================================= */}
          {activeTab === 'cv_optimizer' && (
            <div className="space-y-6">
              {/* Launcher Card */}
              <div className="p-5 bg-gradient-to-br from-neutral-50 to-indigo-50/30 border border-neutral-200/90 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-neutral-900 flex items-center gap-2">
                    <span>Evaluate & Supercharge Your Global Resume</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                      ATS Benchmark Ready
                    </span>
                  </h3>
                  <p className="text-neutral-500 text-xs max-w-xl">
                    Our AI models parse your competencies against international hiring criteria, identify high-yield missing keywords, and rewrite vague bullet points into quantifiable metrics.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleRunAi('OPTIMIZE_CV')}
                  disabled={isLoading}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl transition-all shadow-xs flex items-center gap-2 shrink-0"
                >
                  {isLoading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  )}
                  <span>{isLoading ? 'Analyzing Resume...' : 'Analyze & Optimize CV'}</span>
                </button>
              </div>

              {/* Result Render */}
              {cvResult ? (
                <div className="space-y-6 animate-in fade-in duration-150">
                  {/* Score & Assessment */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="p-5 bg-neutral-900 text-white rounded-2xl flex flex-col justify-between space-y-3">
                      <div className="text-[11px] font-mono text-neutral-400 uppercase">ATS Compatibility</div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-extrabold text-emerald-400 tabular-nums font-mono">
                          {cvResult.atsScore}
                        </span>
                        <span className="text-sm text-neutral-400">/ 100</span>
                      </div>
                      <div className="text-[11px] text-neutral-300">
                        {cvResult.atsScore >= 85 ? 'Top 10% ATS Parseability' : 'Good Base · Optimize Keywords'}
                      </div>
                    </div>

                    <div className="md:col-span-3 p-5 bg-neutral-50 border border-neutral-200/90 rounded-2xl space-y-2 flex flex-col justify-center">
                      <div className="text-[11px] font-mono text-neutral-500 uppercase font-semibold">
                        Executive AI Assessment
                      </div>
                      <p className="text-xs text-neutral-700 leading-relaxed font-medium">
                        {cvResult.summaryAssessment}
                      </p>
                    </div>
                  </div>

                  {/* Missing Keywords (Interactive 1-Click Add) */}
                  <div className="p-5 bg-white border border-neutral-200/80 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-neutral-900 text-xs uppercase tracking-wider font-mono">
                        Missing High-Value Keywords for Global Roles
                      </h4>
                      <span className="text-[11px] text-neutral-500">Click to add to your profile skills</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {cvResult.missingKeywords.map((kw: string) => {
                        const hasSkill = profile?.skills.includes(kw);
                        return (
                          <button
                            key={kw}
                            type="button"
                            onClick={() => handleAddSkill(kw)}
                            disabled={hasSkill}
                            className={`px-3 py-1 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all ${
                              hasSkill
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                                : 'bg-neutral-100 hover:bg-neutral-900 hover:text-white text-neutral-800 border border-neutral-200/80'
                            }`}
                          >
                            {hasSkill ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                            <span>{kw}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Bullet Point Improvements Side-by-Side */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-neutral-900 text-xs uppercase tracking-wider font-mono">
                      Quantified Bullet Point Transformations
                    </h4>

                    <div className="space-y-3">
                      {cvResult.bulletPointEnhancements.map((bp: any, idx: number) => (
                        <div key={idx} className="p-4 bg-white border border-neutral-200/90 rounded-2xl space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="p-3 bg-red-50/40 border border-red-200/50 rounded-xl space-y-1">
                              <span className="text-[10px] font-mono text-red-600 font-bold uppercase">Original (Vague)</span>
                              <p className="text-xs text-neutral-600 italic">&ldquo;{bp.original}&rdquo;</p>
                            </div>

                            <div className="p-3 bg-emerald-50/50 border border-emerald-200/70 rounded-xl space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-mono text-emerald-700 font-bold uppercase">
                                  AI Impact Rewrite
                                </span>
                                <button
                                  type="button"
                                  onClick={() => copyToClipboard(bp.improved, `bp_${idx}`)}
                                  className="text-[10px] font-mono text-emerald-800 hover:underline flex items-center gap-1"
                                >
                                  {copiedKey === `bp_${idx}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                  <span>{copiedKey === `bp_${idx}` ? 'Copied' : 'Copy'}</span>
                                </button>
                              </div>
                              <p className="text-xs text-neutral-900 font-medium">&ldquo;{bp.improved}&rdquo;</p>
                            </div>
                          </div>

                          <div className="text-[11px] text-neutral-500 font-mono">
                            <span className="font-semibold text-neutral-700">Rationale: </span>
                            {bp.impactRationale}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Improved Summary */}
                  <div className="p-5 bg-neutral-50 border border-neutral-200/80 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-neutral-900 text-xs uppercase tracking-wider font-mono">
                        Target Executive Bio & Summary
                      </h4>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => copyToClipboard(cvResult.improvedSummary, 'summary')}
                          className="px-2.5 py-1 text-xs font-mono bg-white border border-neutral-200 rounded-lg hover:bg-neutral-100 flex items-center gap-1"
                        >
                          {copiedKey === 'summary' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedKey === 'summary' ? 'Copied' : 'Copy Bio'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApplySummary(cvResult.improvedSummary)}
                          className="px-3 py-1 text-xs font-semibold bg-neutral-900 text-white rounded-lg hover:bg-neutral-800"
                        >
                          Apply to My Profile
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-neutral-800 leading-relaxed font-sans bg-white p-3.5 rounded-xl border border-neutral-200/60">
                      {cvResult.improvedSummary}
                    </p>
                  </div>

                  {/* Freelancer Tips */}
                  {cvResult.freelancerTips && (
                    <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl space-y-2">
                      <div className="flex items-center gap-2 font-bold text-xs text-indigo-950 font-mono">
                        <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Freelance & Contractor Positioning Recommendations</span>
                      </div>
                      <ul className="space-y-1 text-xs text-indigo-900 list-disc list-inside">
                        {cvResult.freelancerTips.map((tip: string, i: number) => (
                          <li key={i}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-12 text-center space-y-3 border-2 border-dashed border-neutral-200 rounded-3xl">
                  <div className="w-12 h-12 rounded-2xl bg-neutral-100 text-neutral-400 mx-auto flex items-center justify-center">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <div className="font-semibold text-sm text-neutral-800">No CV Analysis Generated Yet</div>
                    <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                      Click the &ldquo;Analyze & Optimize CV&rdquo; button above to benchmark your skills and bullet points.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 2: AI TAILORED COVER LETTER */}
          {/* ================================================================= */}
          {activeTab === 'cover_letter' && (
            <div className="space-y-6">
              {/* Job Selector & Trigger */}
              <div className="p-5 bg-neutral-50 border border-neutral-200/90 rounded-2xl space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-neutral-800 mb-1">Target Job or Contract Role</label>
                    <select
                      value={selectedJobId}
                      onChange={(e) => setSelectedJobId(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-neutral-300 focus:outline-hidden focus:ring-1 focus:ring-neutral-900 font-medium"
                    >
                      {jobs.map((j) => (
                        <option key={j.id} value={j.id}>
                          {j.title} — {j.company?.name} ({j.employmentType} · {j.location})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-800 mb-1">Optional Candidate Note</label>
                    <input
                      type="text"
                      placeholder="e.g. emphasize Next.js App Router experience"
                      value={customInstructions}
                      onChange={(e) => setCustomInstructions(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-neutral-300 focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="text-xs text-neutral-500">
                    Targeting: <span className="font-semibold text-neutral-900">{selectedJob.title}</span> at {selectedJob.company?.name}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRunAi('GENERATE_COVER_LETTER')}
                    disabled={isLoading}
                    className="px-5 py-2.5 text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl transition-all shadow-xs flex items-center gap-2"
                  >
                    {isLoading ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                    <span>{isLoading ? 'Drafting Tailored Letter...' : 'Generate Tailored Cover Letter'}</span>
                  </button>
                </div>
              </div>

              {/* Cover Letter Output */}
              {coverLetterResult ? (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-neutral-900 text-xs font-mono uppercase">
                        AI Generated Cover Letter
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
                        Tailored to {selectedJob.company?.name}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => copyToClipboard(coverLetterResult.coverLetter, 'letter')}
                      className="px-3 py-1.5 text-xs font-semibold bg-white border border-neutral-300 hover:border-neutral-900 rounded-xl transition-all flex items-center gap-1.5 shadow-2xs"
                    >
                      {copiedKey === 'letter' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'letter' ? 'Copied to Clipboard!' : 'Copy Full Cover Letter'}</span>
                    </button>
                  </div>

                  <div className="p-6 bg-white border border-neutral-200 rounded-2xl shadow-xs space-y-4 leading-relaxed whitespace-pre-line text-neutral-800 font-sans text-xs">
                    {coverLetterResult.coverLetter}
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center space-y-3 border-2 border-dashed border-neutral-200 rounded-3xl">
                  <div className="w-12 h-12 rounded-2xl bg-neutral-100 text-neutral-400 mx-auto flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-neutral-400" />
                  </div>
                  <div className="space-y-1">
                    <div className="font-semibold text-sm text-neutral-800">Select a Job & Click Generate</div>
                    <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                      AI will analyze the job&apos;s required skills, timezone constraints, and match them with your profile achievements.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 3: AI MATCH DEEP DIVE & INTERVIEW PREP */}
          {/* ================================================================= */}
          {activeTab === 'match_prep' && (
            <div className="space-y-6">
              {/* Job Selector */}
              <div className="p-5 bg-neutral-50 border border-neutral-200/90 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-neutral-800 mb-1">Target Position for Interview Prep</label>
                  <select
                    value={selectedJobId}
                    onChange={(e) => setSelectedJobId(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-neutral-300 font-medium"
                  >
                    {jobs.map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.title} — {j.company?.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => handleRunAi('JOB_MATCH_DEEPDIVE')}
                  disabled={isLoading}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl transition-all shadow-xs flex items-center gap-2 shrink-0"
                >
                  {isLoading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
                  )}
                  <span>{isLoading ? 'Analyzing Questions...' : 'Generate Interview Questions & Prep'}</span>
                </button>
              </div>

              {matchPrepResult ? (
                <div className="space-y-5 animate-in fade-in duration-150">
                  {/* Verdict & Strengths */}
                  <div className="p-5 bg-white border border-neutral-200/90 rounded-2xl space-y-3">
                    <h4 className="font-bold text-neutral-900 text-xs uppercase font-mono tracking-wider">
                      Strategic Compatibility Analysis
                    </h4>
                    <p className="text-xs text-neutral-800 leading-relaxed font-medium">
                      {matchPrepResult.overallVerdict}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                      <div className="p-3 bg-emerald-50/50 border border-emerald-200/60 rounded-xl space-y-1">
                        <span className="text-[10px] font-mono text-emerald-800 font-bold uppercase">Competitive Edges</span>
                        <ul className="space-y-1 text-[11px] text-neutral-700 list-disc list-inside">
                          {matchPrepResult.topStrengths.map((s: string, i: number) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-3 bg-amber-50/50 border border-amber-200/60 rounded-xl space-y-1">
                        <span className="text-[10px] font-mono text-amber-800 font-bold uppercase">Areas to Review</span>
                        <ul className="space-y-1 text-[11px] text-neutral-700 list-disc list-inside">
                          {matchPrepResult.growthOpportunities.map((g: string, i: number) => (
                            <li key={i}>{g}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Technical Questions List */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-neutral-900 text-xs uppercase font-mono tracking-wider">
                      Predicted Technical Interview Questions & STAR Frameworks
                    </h4>

                    <div className="space-y-3">
                      {matchPrepResult.technicalInterviewQuestions.map((q: any, idx: number) => (
                        <div key={idx} className="p-4.5 bg-white border border-neutral-200/90 rounded-2xl space-y-2.5">
                          <div className="flex items-start justify-between gap-3">
                            <div className="font-bold text-neutral-900 text-xs flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-neutral-100 flex items-center justify-center font-mono text-[10px] text-neutral-700 shrink-0">
                                {idx + 1}
                              </span>
                              <span>{q.question}</span>
                            </div>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-medium shrink-0">
                              {q.relevantCandidateSkill}
                            </span>
                          </div>

                          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/60 space-y-1">
                            <span className="text-[10px] font-mono text-neutral-500 font-bold uppercase">
                              Recommended STAR Answer Strategy:
                            </span>
                            <p className="text-xs text-neutral-700 leading-relaxed">
                              {q.suggestedAnswerApproach}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Negotiation Advice */}
                  <div className="p-4 bg-emerald-50/50 border border-emerald-200/70 rounded-2xl flex items-start gap-3">
                    <TrendingUp className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-emerald-950 font-mono text-xs">Salary / Rate Negotiation Insight: </span>
                      <span className="text-xs text-emerald-900">{matchPrepResult.negotiationTips}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center space-y-3 border-2 border-dashed border-neutral-200 rounded-3xl">
                  <div className="w-12 h-12 rounded-2xl bg-neutral-100 text-neutral-400 mx-auto flex items-center justify-center">
                    <HelpCircle className="w-6 h-6 text-neutral-400" />
                  </div>
                  <div className="space-y-1">
                    <div className="font-semibold text-sm text-neutral-800">Prepare for Your Technical Interview</div>
                    <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                      Click the button above to generate personalized questions and battle-tested answer frameworks.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 4: AI FREELANCE PROPOSAL & PITCH */}
          {/* ================================================================= */}
          {activeTab === 'freelance_pitch' && (
            <div className="space-y-6">
              {/* Trigger */}
              <div className="p-5 bg-indigo-50/40 border border-indigo-100 rounded-2xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm text-neutral-900 flex items-center gap-2">
                      <span>Freelance & Contractor Milestone Proposal Generator</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-bold">
                        0% Commission
                      </span>
                    </h3>
                    <p className="text-neutral-500 text-xs max-w-xl">
                      Instantly turn any contract vacancy or freelance gig into an actionable Statement of Work (SOW) with milestone deliverable phases and rate justification.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRunAi('FREELANCE_PITCH')}
                    disabled={isLoading}
                    className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-xs flex items-center gap-2 shrink-0"
                  >
                    {isLoading ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Briefcase className="w-3.5 h-3.5" />
                    )}
                    <span>{isLoading ? 'Drafting Proposal...' : 'Generate Freelance Pitch'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 border-t border-indigo-100/80">
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Contract Vacancy or Client Gig</label>
                    <select
                      value={selectedJobId}
                      onChange={(e) => setSelectedJobId(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-neutral-300 font-medium"
                    >
                      {jobs.map((j) => (
                        <option key={j.id} value={j.id}>
                          {j.title} — {j.company?.name} ({j.rateType === 'HOURLY' ? `$${j.hourlyRateMin}-$${j.hourlyRateMax}/hr` : `$${j.salaryMin}-$${j.salaryMax}`})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Your Hourly/Contract Rate Target</label>
                    <div className="flex items-center gap-2">
                      <div className="px-3 py-2 bg-white rounded-xl border border-neutral-300 font-mono text-xs font-bold text-neutral-900 flex-1">
                        ${profile?.hourlyRate || 85} USD / hour
                      </div>
                      <span className="text-[11px] text-neutral-500">
                        {profile?.contractAvailability || 'Available immediately'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pitch Output */}
              {freelancePitchResult ? (
                <div className="space-y-5 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-neutral-900 text-sm">
                        {freelancePitchResult.proposalTitle}
                      </h4>
                      <p className="text-[11px] text-neutral-500">Milestone-based proposal ready to send to client</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const fullText = `${freelancePitchResult.proposalTitle}\n\n${freelancePitchResult.executivePitch}\n\nMILESTONES:\n${freelancePitchResult.deliverableMilestones
                          .map((m: any) => `${m.phase} (${m.duration}, ${m.suggestedBudgetPct}% budget):\n- ${m.deliverables}`)
                          .join('\n\n')}\n\nRATE JUSTIFICATION:\n${freelancePitchResult.rateJustification}\n\n${freelancePitchResult.closingCallToAction}`;
                        copyToClipboard(fullText, 'pitch');
                      }}
                      className="px-3 py-1.5 text-xs font-semibold bg-white border border-neutral-300 hover:border-neutral-900 rounded-xl transition-all flex items-center gap-1.5 shadow-2xs"
                    >
                      {copiedKey === 'pitch' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'pitch' ? 'Copied Pitch!' : 'Copy Full Proposal'}</span>
                    </button>
                  </div>

                  {/* Executive Pitch */}
                  <div className="p-5 bg-white border border-neutral-200/90 rounded-2xl space-y-2">
                    <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase">Executive Pitch</span>
                    <p className="text-xs text-neutral-800 leading-relaxed whitespace-pre-line">
                      {freelancePitchResult.executivePitch}
                    </p>
                  </div>

                  {/* Milestones */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase">
                      Deliverable Milestones & Suggested Budget Allocation
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {freelancePitchResult.deliverableMilestones.map((m: any, idx: number) => (
                        <div key={idx} className="p-4 bg-white border border-neutral-200/90 rounded-2xl space-y-2 flex flex-col justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 font-bold">
                                {m.duration}
                              </span>
                              <span className="font-mono text-xs font-bold text-neutral-900 tabular-nums">
                                {m.suggestedBudgetPct}%
                              </span>
                            </div>
                            <h5 className="font-bold text-xs text-neutral-900 pt-1">{m.phase}</h5>
                            <p className="text-[11px] text-neutral-600 leading-relaxed">{m.deliverables}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Rate Justification & CTA */}
                  <div className="p-4.5 bg-neutral-50 border border-neutral-200/80 rounded-2xl space-y-2">
                    <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase">Rate Justification</span>
                    <p className="text-xs text-neutral-700 leading-relaxed">{freelancePitchResult.rateJustification}</p>
                    <div className="pt-2 text-xs font-semibold text-neutral-900 flex items-center gap-1.5">
                      <ArrowRight className="w-3.5 h-3.5 text-neutral-500" />
                      <span>{freelancePitchResult.closingCallToAction}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center space-y-3 border-2 border-dashed border-neutral-200 rounded-3xl">
                  <div className="w-12 h-12 rounded-2xl bg-neutral-100 text-neutral-400 mx-auto flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-neutral-400" />
                  </div>
                  <div className="space-y-1">
                    <div className="font-semibold text-sm text-neutral-800">Generate a Winning Freelance Proposal</div>
                    <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                      AI crafts a professional Statement of Work (SOW) with deliverable phases and rate justification.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
