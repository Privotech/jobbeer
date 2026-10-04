'use client';

import React, { useState } from 'react';
import { User, Profile, Company, Role } from '@/lib/types';
import { X, UserCheck, Briefcase, ShieldCheck, ArrowRight, Sparkles, Check } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'signin' | 'signup';
  initialRole?: Role;
  onClose: () => void;
  onAuthSuccess: (authData: { user: User; profile?: Profile; company?: Company }) => void;
}

export default function AuthModal({
  isOpen,
  initialMode = 'signin',
  initialRole = 'SEEKER',
  onClose,
  onAuthSuccess,
}: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [selectedRole, setSelectedRole] = useState<Role>(initialRole);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [headline, setHeadline] = useState('');
  const [location, setLocation] = useState('');
  const [skills, setSkills] = useState('TypeScript, Next.js, MySQL');
  const [timezone, setTimezone] = useState('UTC+1 (BST / CET)');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const demoAccounts = [
    {
      id: 'user_seeker_1',
      role: 'SEEKER' as Role,
      email: 'sarah.chen@globaltalent.dev',
      label: 'Sarah Chen (Senior Full-Stack Engineer)',
      tag: 'Candidate · London UTC+1',
    },
    {
      id: 'user_employer_1',
      role: 'EMPLOYER' as Role,
      email: 'hiring@cloudscalelabs.io',
      label: 'Marcus Vance (CloudScale Labs)',
      tag: 'Employer · ATS Lead',
    },
    {
      id: 'user_admin_1',
      role: 'ADMIN' as Role,
      email: 'admin.compliance@globalhire.org',
      label: 'Dr. Elena Rostova (Admin & Moderation)',
      tag: 'System Administrator',
    },
  ];

  const handleDemoLogin = async (acc: typeof demoAccounts[0]) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'SWITCH_USER', userId: acc.id }),
      });
      const data = await res.json();
      if (data.success) {
        onAuthSuccess({ user: data.user, profile: data.profile, company: data.company });
        onClose();
      } else {
        setErrorMsg('Failed to sign in with demo account');
      }
    } catch {
      setErrorMsg('Network error while signing in');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      if (mode === 'signin') {
        const res = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'SIGN_IN', email }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          onAuthSuccess({ user: data.user, profile: data.profile, company: data.company });
          onClose();
        } else {
          setErrorMsg(data.error || 'User not found. Try one-click demo login or sign up below.');
        }
      } else {
        // Sign up
        const res = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'SIGN_UP',
            email,
            fullName,
            role: selectedRole,
            headline: headline || (selectedRole === 'SEEKER' ? 'Software Engineer' : 'Technology Company'),
            location: location || 'Remote',
            timezone,
            utcOffset: 1.0,
            skills: skills.split(',').map((s) => s.trim()).filter(Boolean),
          }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          onAuthSuccess({ user: data.user, profile: data.profile, company: data.company });
          onClose();
        } else {
          setErrorMsg(data.error || 'Failed to create account');
        }
      }
    } catch {
      setErrorMsg('Failed to process authentication');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden my-6">
        
        {/* Top Header */}
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-neutral-900">
              {mode === 'signin' ? 'Sign In to GlobalHire' : 'Create GlobalHire Account'}
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              {mode === 'signin'
                ? 'Access your personalized matching portal and applications'
                : 'Select your role to route directly into your workspace'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle: Sign In vs Sign Up */}
        <div className="px-6 pt-4">
          <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-xl">
            <button
              onClick={() => {
                setMode('signin');
                setErrorMsg(null);
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === 'signin'
                  ? 'bg-white text-neutral-900 shadow-2xs'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMode('signup');
                setErrorMsg(null);
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === 'signup'
                  ? 'bg-white text-neutral-900 shadow-2xs'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-900 text-xs">
            {errorMsg}
          </div>
        )}

        {/* 1-Click Demo Evaluation Pills */}
        <div className="px-6 pt-4">
          <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block mb-2">
            1-Click Demo Personas (Instant Access):
          </span>
          <div className="space-y-1.5">
            {demoAccounts.map((acc) => (
              <button
                key={acc.id}
                type="button"
                onClick={() => handleDemoLogin(acc)}
                disabled={isLoading}
                className="w-full text-left p-2.5 px-3 rounded-xl border border-neutral-200 hover:border-neutral-900 hover:bg-neutral-50 transition-all flex items-center justify-between group text-xs"
              >
                <div>
                  <span className="font-semibold text-neutral-900 block">{acc.label}</span>
                  <span className="text-[11px] text-neutral-500">{acc.tag}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-900 group-hover:translate-x-0.5 transition-all" />
              </button>
            ))}
          </div>
        </div>

        <div className="relative my-4 px-6 flex items-center">
          <div className="flex-1 border-t border-neutral-200" />
          <span className="px-3 text-[11px] text-neutral-400 font-mono">OR USE CREDENTIALS</span>
          <div className="flex-1 border-t border-neutral-200" />
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4 text-xs">
          {mode === 'signup' && (
            <>
              {/* Role Selection Cards */}
              <div>
                <label className="block font-semibold text-neutral-800 mb-2">
                  Choose Your Account Role (Slide 4 Architecture):
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('SEEKER')}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                      selectedRole === 'SEEKER'
                        ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                        : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    <UserCheck className="w-4 h-4" />
                    <span className="font-bold text-xs">Job Seeker</span>
                    <span className={`text-[10px] ${selectedRole === 'SEEKER' ? 'text-neutral-300' : 'text-neutral-500'}`}>
                      Find & Apply
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRole('EMPLOYER')}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                      selectedRole === 'EMPLOYER'
                        ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                        : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    <Briefcase className="w-4 h-4" />
                    <span className="font-bold text-xs">Employer</span>
                    <span className={`text-[10px] ${selectedRole === 'EMPLOYER' ? 'text-neutral-300' : 'text-neutral-500'}`}>
                      Post & Hire
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRole('ADMIN')}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                      selectedRole === 'ADMIN'
                        ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                        : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span className="font-bold text-xs">Admin</span>
                    <span className={`text-[10px] ${selectedRole === 'ADMIN' ? 'text-neutral-300' : 'text-neutral-500'}`}>
                      Moderate & Audit
                    </span>
                  </button>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block font-medium text-neutral-700 mb-1">
                  {selectedRole === 'EMPLOYER' ? 'Company Name' : 'Full Name'}
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={selectedRole === 'EMPLOYER' ? 'e.g. Acme Cloud Corp' : 'e.g. Alex Morgan'}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-neutral-900"
                />
              </div>

              {/* Headline / Industry */}
              <div>
                <label className="block font-medium text-neutral-700 mb-1">
                  {selectedRole === 'EMPLOYER' ? 'Industry / Sector' : 'Professional Headline'}
                </label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder={selectedRole === 'EMPLOYER' ? 'Cloud Infrastructure' : 'Full-Stack Software Engineer'}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-neutral-900"
                />
              </div>

              {selectedRole === 'SEEKER' && (
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Skills (Comma-separated)</label>
                  <input
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="TypeScript, React, Next.js, MySQL"
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-mono focus:bg-white focus:ring-2 focus:ring-neutral-900"
                  />
                </div>
              )}
            </>
          )}

          {/* Email */}
          <div>
            <label className="block font-medium text-neutral-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-neutral-900"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block font-medium text-neutral-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-neutral-900"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            <span>
              {isLoading
                ? 'Processing...'
                : mode === 'signin'
                ? 'Sign In & Go to Workspace'
                : `Create Account as ${selectedRole === 'SEEKER' ? 'Job Seeker' : selectedRole === 'EMPLOYER' ? 'Employer' : 'Admin'}`}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
