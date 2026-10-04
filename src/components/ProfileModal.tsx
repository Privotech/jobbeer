'use client';

import React, { useState } from 'react';
import { Profile } from '@/lib/types';
import { X, Upload, Check, Plus, Trash2, FileText, Sparkles } from 'lucide-react';

interface ProfileModalProps {
  profile?: Profile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Profile>) => Promise<void>;
}

export default function ProfileModal({ profile, isOpen, onClose, onSave }: ProfileModalProps) {
  const [fullName, setFullName] = useState(profile?.fullName || 'Sarah Chen');
  const [headline, setHeadline] = useState(profile?.headline || 'Senior Full-Stack Engineer');
  const [bio, setBio] = useState(profile?.bio || '');
  const [location, setLocation] = useState(profile?.location || 'London, United Kingdom');
  const [timezone, setTimezone] = useState(profile?.timezone || 'UTC+1 (BST / GMT+1)');
  const [utcOffset, setUtcOffset] = useState<number>(profile?.utcOffset ?? 1.0);
  const [experienceYears, setExperienceYears] = useState<number>(profile?.experienceYears ?? 5);
  const [expectedSalary, setExpectedSalary] = useState<number>(profile?.expectedSalary ?? 110000);
  const [currency, setCurrency] = useState(profile?.currency || 'USD');
  const [workPreference, setWorkPreference] = useState<'REMOTE' | 'HYBRID' | 'ONSITE'>(
    profile?.workPreference || 'REMOTE'
  );
  const [skills, setSkills] = useState<string[]>(profile?.skills || ['TypeScript', 'Next.js', 'React', 'Node.js', 'MySQL', 'Docker']);
  const [newSkill, setNewSkill] = useState('');
  const [isFreelancer, setIsFreelancer] = useState<boolean>(profile?.isFreelancer ?? true);
  const [hourlyRate, setHourlyRate] = useState<number>(profile?.hourlyRate ?? 85);
  const [contractAvailability, setContractAvailability] = useState<string>(profile?.contractAvailability || 'IMMEDIATELY');
  const [portfolioUrl, setPortfolioUrl] = useState<string>(profile?.portfolioUrl || 'https://sarahchen.me');
  const [resumeFileName, setResumeFileName] = useState(profile?.resumeFileName || 'Sarah_Chen_Resume.pdf');
  const [isUploading, setIsUploading] = useState(false);
  const [parseNotification, setParseNotification] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const timezoneOptions = [
    { label: 'UTC-8 (Pacific / San Francisco, Vancouver)', offset: -8.0 },
    { label: 'UTC-5 (Eastern / New York, Toronto)', offset: -5.0 },
    { label: 'UTC+0 (GMT / London, Dublin, Lisbon)', offset: 0.0 },
    { label: 'UTC+1 (BST/CET / London summer, Berlin, Lagos, Paris)', offset: 1.0 },
    { label: 'UTC+2 (EET / Cairo, Athens, Helsinki)', offset: 2.0 },
    { label: 'UTC+3 (MSK/AST / Nairobi, Riyadh, Istanbul)', offset: 3.0 },
    { label: 'UTC+5:30 (IST / Mumbai, New Delhi, Bengaluru)', offset: 5.5 },
    { label: 'UTC+8 (SGT/CST / Singapore, Hong Kong, Perth)', offset: 8.0 },
    { label: 'UTC+9 (JST / Tokyo, Seoul)', offset: 9.0 },
  ];

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSimulateResumeUpload = (file: File) => {
    setIsUploading(true);
    setTimeout(() => {
      setResumeFileName(file.name);
      setIsUploading(false);

      // Intelligent parser simulation extracting relevant tech tags
      const autoExtracted = ['PostgreSQL', 'Tailwind CSS', 'Redis', 'CI/CD Pipelines'];
      const merged = Array.from(new Set([...skills, ...autoExtracted]));
      setSkills(merged);
      setParseNotification('Resume parsed successfully! Extracted 4 additional tech skills into your profile.');
    }, 1200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave({
        fullName,
        headline,
        bio,
        location,
        timezone,
        utcOffset,
        skills,
        experienceYears,
        expectedSalary,
        currency,
        workPreference,
        isFreelancer,
        hourlyRate,
        contractAvailability: contractAvailability as any,
        portfolioUrl,
        resumeFileName,
      });
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-neutral-900 tracking-tight">Candidate Profile & CV</h2>
            <p className="text-xs text-neutral-500">Configure your skills and timezone for smart job matching</p>
          </div>
          <button onClick={onClose} className="p-2 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Resume Upload Box */}
          <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl space-y-2">
            <label className="text-xs font-semibold text-neutral-900 block">CV / Resume File</label>
            <div className="border-2 border-dashed border-neutral-300 hover:border-neutral-400 rounded-lg p-4 text-center bg-white transition-colors">
              <input
                type="file"
                id="resumeFileInput"
                className="hidden"
                accept=".pdf,.doc,.docx"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleSimulateResumeUpload(e.target.files[0]);
                  }
                }}
              />
              <label htmlFor="resumeFileInput" className="cursor-pointer block">
                <div className="w-9 h-9 rounded-full bg-neutral-100 mx-auto flex items-center justify-center text-neutral-600 mb-2">
                  {isUploading ? <Upload className="w-4 h-4 animate-bounce" /> : <FileText className="w-4 h-4" />}
                </div>
                <p className="text-xs font-medium text-neutral-800">
                  {isUploading ? 'Parsing Resume with Smart OCR...' : resumeFileName}
                </p>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  Click to replace CV (PDF or DOCX). Skills will automatically populate below.
                </p>
              </label>
            </div>

            {parseNotification && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{parseNotification}</span>
              </div>
            )}
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full text-xs p-2.5 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-neutral-900"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Professional Headline</label>
              <input
                type="text"
                required
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full text-xs p-2.5 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-neutral-900"
              />
            </div>
          </div>

          {/* Timezone & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Location (City, Country)</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full text-xs p-2.5 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-neutral-900"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Primary Timezone & UTC Offset</label>
              <select
                value={utcOffset}
                onChange={(e) => {
                  const off = parseFloat(e.target.value);
                  setUtcOffset(off);
                  const opt = timezoneOptions.find((o) => o.offset === off);
                  if (opt) setTimezone(opt.label);
                }}
                className="w-full text-xs p-2.5 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-neutral-900"
              >
                {timezoneOptions.map((opt) => (
                  <option key={opt.offset} value={opt.offset}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Experience & Salary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Years of Experience</label>
              <input
                type="number"
                min={0}
                max={40}
                value={experienceYears}
                onChange={(e) => setExperienceYears(parseInt(e.target.value) || 0)}
                className="w-full text-xs p-2.5 border border-neutral-300 rounded-lg font-mono tabular-nums focus:ring-1 focus:ring-neutral-900"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Expected Salary (Annual)</label>
              <input
                type="number"
                step={1000}
                value={expectedSalary}
                onChange={(e) => setExpectedSalary(parseInt(e.target.value) || 0)}
                className="w-full text-xs p-2.5 border border-neutral-300 rounded-lg font-mono tabular-nums focus:ring-1 focus:ring-neutral-900"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Work Preference</label>
              <select
                value={workPreference}
                onChange={(e) => setWorkPreference(e.target.value as 'REMOTE' | 'HYBRID' | 'ONSITE')}
                className="w-full text-xs p-2.5 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-neutral-900"
              >
                <option value="REMOTE">Worldwide Remote</option>
                <option value="HYBRID">Hybrid</option>
                <option value="ONSITE">On-Site</option>
              </select>
            </div>
          </div>

          {/* Freelancer & Independent Contractor Settings */}
          <div className="p-4 bg-indigo-50/40 border border-indigo-100/80 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-neutral-900">Freelance & Independent Contractor Status</span>
                <p className="text-[11px] text-neutral-500">Allow international clients to hire you for contract gigs with 0% platform commission</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFreelancer}
                  onChange={(e) => setIsFreelancer(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-neutral-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-neutral-900" />
              </label>
            </div>

            {isFreelancer && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-indigo-100">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Target Rate ($ / hour)</label>
                  <input
                    type="number"
                    min={20}
                    max={500}
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(parseInt(e.target.value) || 80)}
                    className="w-full text-xs p-2 bg-white border border-neutral-300 rounded-lg font-mono tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Contract Availability</label>
                  <select
                    value={contractAvailability}
                    onChange={(e) => setContractAvailability(e.target.value)}
                    className="w-full text-xs p-2 bg-white border border-neutral-300 rounded-lg"
                  >
                    <option value="IMMEDIATELY">Available Immediately</option>
                    <option value="PART_TIME_20H">Part-Time (≤ 20 hrs/wk)</option>
                    <option value="FULL_TIME_CONTRACT">Full-Time Contract (40 hrs/wk)</option>
                    <option value="NOT_AVAILABLE">Not Currently Available</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Portfolio / GitHub Link</label>
                  <input
                    type="url"
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full text-xs p-2 bg-white border border-neutral-300 rounded-lg"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Skills Management */}
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Technical Skills (Used by Smart Match Algorithm)
            </label>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="e.g. Next.js, MySQL, GraphQL"
                className="flex-1 text-xs p-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-neutral-900"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-3 py-2 text-xs font-medium text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 p-3 bg-neutral-50 border border-neutral-200 rounded-lg min-h-[50px]">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-neutral-200 text-xs font-mono text-neutral-800 rounded-md shadow-2xs"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-neutral-400 hover:text-neutral-800 ml-0.5"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">Professional Summary / Bio</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full text-xs p-2.5 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-neutral-900"
              placeholder="Brief overview of your experience and interests..."
            />
          </div>

          {/* Footer Actions */}
          <div className="border-t border-neutral-100 pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-neutral-600 hover:text-neutral-900 rounded-lg border border-neutral-200 hover:bg-neutral-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 text-xs font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg shadow-xs flex items-center gap-1.5 disabled:opacity-50"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving Changes...' : 'Save Profile'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
