'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { User, Profile, Company, Role } from '@/lib/types';
import { ChevronDown, Briefcase, UserCheck, ShieldCheck, GraduationCap, Check, LogOut, ArrowRight, Sparkles, Crown, Zap } from 'lucide-react';

interface NavbarProps {
  currentUser: User | null;
  profile?: Profile;
  company?: Company;
  activeView: 'landing' | 'jobs' | 'matches' | 'applications' | 'employer' | 'admin';
  setActiveView: (view: 'landing' | 'jobs' | 'matches' | 'applications' | 'employer' | 'admin') => void;
  onOpenAcademicDeck: () => void;
  onOpenProfile: () => void;
  onOpenAuth: (mode: 'signin' | 'signup', role?: Role) => void;
  onSwitchUser: (userId: string) => void;
  onLogout: () => void;
  onOpenAiAssistant?: () => void;
  onOpenPricing?: () => void;
}

export default function Navbar({
  currentUser,
  profile,
  company,
  activeView,
  setActiveView,
  onOpenAcademicDeck,
  onOpenProfile,
  onOpenAuth,
  onSwitchUser,
  onLogout,
  onOpenAiAssistant,
  onOpenPricing,
}: NavbarProps) {
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const demoPersonas = [
    {
      id: 'user_seeker_1',
      role: 'SEEKER' as Role,
      name: 'Sarah Chen',
      title: 'Candidate · Senior Full-Stack Engineer',
      avatar: '/images/avatar_candidate_engineer_1790927054479.jpg',
      icon: UserCheck,
    },
    {
      id: 'user_employer_1',
      role: 'EMPLOYER' as Role,
      name: 'CloudScale Labs',
      title: 'Employer · Hiring Director',
      avatar: '/images/avatar_employer_lead_1790927065183.jpg',
      icon: Briefcase,
    },
    {
      id: 'user_admin_1',
      role: 'ADMIN' as Role,
      name: 'Dr. Elena Rostova',
      title: 'Administrator · System & Moderation',
      avatar: '',
      icon: ShieldCheck,
    },
  ];

  const currentPersona = demoPersonas.find((p) => p.id === currentUser?.id) || demoPersonas[0];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-sky-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Zone 1: Brand Zone */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            onClick={(e) => {
              e.preventDefault();
              setActiveView('landing');
            }}
            className="text-xl font-bold tracking-tight text-sky-700 hover:text-sky-900 transition-colors"
          >
            GlobalHire
          </Link>

          {/* Academic Project Presentation Link */}
          <button
            onClick={onOpenAcademicDeck}
            className="hidden lg:flex items-center gap-1.5 text-xs font-medium text-sky-700 hover:text-sky-900 py-1 px-2.5 rounded-md hover:bg-sky-50 transition-colors"
          >
            <GraduationCap className="w-3.5 h-3.5 text-sky-600" />
            <span>Final Year Project (Slides & Viva Mode)</span>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
          <button
            onClick={() => setActiveView('landing')}
            className={`transition-colors hover:text-sky-700 py-1 ${
              activeView === 'landing' ? 'text-sky-700 border-b-2 border-sky-600' : ''
            }`}
          >
            Overview
          </button>

          <button
            onClick={() => setActiveView('jobs')}
            className={`transition-colors hover:text-sky-700 py-1 ${
              activeView === 'jobs' ? 'text-sky-700 border-b-2 border-sky-600' : ''
            }`}
          >
            Explore Jobs
          </button>

          {/* Seeker Links */}
          {currentUser && currentUser.role === 'SEEKER' && (
            <>
              <button
                onClick={() => setActiveView('matches')}
                className={`transition-colors hover:text-sky-700 py-1 ${
                  activeView === 'matches' ? 'text-sky-700 border-b-2 border-sky-600' : ''
                }`}
              >
                Smart Matches
              </button>

              <button
                onClick={() => setActiveView('applications')}
                className={`transition-colors hover:text-sky-700 py-1 ${
                  activeView === 'applications' ? 'text-sky-700 border-b-2 border-sky-600' : ''
                }`}
              >
                My Applications
              </button>
            </>
          )}

          {/* Employer Link */}
          {currentUser && (currentUser.role === 'EMPLOYER' || currentUser.role === 'ADMIN') && (
            <button
              onClick={() => setActiveView('employer')}
              className={`transition-colors hover:text-sky-700 py-1 ${
                activeView === 'employer' ? 'text-sky-700 border-b-2 border-sky-600' : ''
              }`}
            >
              Employer ATS
            </button>
          )}

          {/* Admin Link */}
          {currentUser && currentUser.role === 'ADMIN' && (
            <button
              onClick={() => setActiveView('admin')}
              className={`transition-colors hover:text-sky-700 py-1 ${
                activeView === 'admin' ? 'text-sky-700 border-b-2 border-sky-600' : ''
              }`}
            >
              Admin Console
            </button>
          )}
          {/* AI Assistant Link */}
          {onOpenAiAssistant && (
            <button
              onClick={onOpenAiAssistant}
              className="transition-colors text-indigo-700 hover:text-indigo-900 font-bold py-1 flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>AI Assistant</span>
            </button>
          )}

          {/* Pricing link if seeker */}
          {currentUser && currentUser.role === 'SEEKER' && onOpenPricing && (
            <button
              onClick={onOpenPricing}
              className="transition-colors hover:text-neutral-900 py-1 text-neutral-600 flex items-center gap-1"
            >
              <Zap className="w-3 h-3 text-amber-500" />
              <span>Pro Pricing</span>
            </button>
          )}
        </nav>

        {/* Zone 3: Actions & Auth */}
        <div className="flex items-center gap-3">
          {!currentUser ? (
            // Public unauthenticated state
            <div className="flex items-center gap-2">
              {onOpenPricing && (
                <button
                  onClick={onOpenPricing}
                  className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-neutral-600 hover:text-neutral-900 px-3 py-1.5"
                >
                  <Zap className="w-3 h-3 text-amber-500" />
                  <span>Pro Plans</span>
                </button>
              )}
              <button
                onClick={() => onOpenAuth('signin')}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-sky-700 rounded-lg hover:bg-sky-50 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => onOpenAuth('signup')}
                className="px-4 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            // Authenticated state with Persona switch & Logout
            <div className="flex items-center gap-2.5">
              {/* Pro Badge or Upgrade trigger */}
              {currentUser.role === 'SEEKER' && (
                <>
                  {profile?.subscriptionTier === 'PRO' || profile?.subscriptionTier === 'FREELANCE_PRO' ? (
                    <button
                      onClick={onOpenPricing}
                      className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-400 text-neutral-950 font-bold text-[10px] font-mono shadow-2xs hover:bg-amber-300 transition-all"
                    >
                      <Crown className="w-3 h-3" />
                      <span>{profile.subscriptionTier === 'FREELANCE_PRO' ? 'FREELANCE PRO' : 'GLOBAL PRO'}</span>
                    </button>
                  ) : onOpenPricing ? (
                    <button
                      onClick={onOpenPricing}
                      className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-neutral-950 font-bold text-xs shadow-2xs transition-all"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Upgrade Pro</span>
                    </button>
                  ) : null}

                  {onOpenAiAssistant && (
                    <button
                      onClick={onOpenAiAssistant}
                      className="hidden md:inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 px-3 py-1.5 rounded-xl transition-all shadow-2xs"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>AI Assistant</span>
                    </button>
                  )}

                  <button
                    onClick={onOpenProfile}
                    className="text-xs font-medium text-neutral-700 hover:text-neutral-900 px-3 py-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors hidden sm:inline-flex"
                  >
                    Profile & CV
                  </button>
                </>
              )}

              {/* Persona Switcher Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 transition-all text-left"
                  aria-label="Switch User Persona"
                >
                  <div className="w-7 h-7 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs font-semibold overflow-hidden">
                    {profile?.avatarUrl || (company ? company.logoUrl : null) ? (
                      <img
                        src={profile?.avatarUrl || company?.logoUrl || '/images/avatar_candidate_engineer_1790927054479.jpg'}
                        alt="User"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span>{(profile?.fullName || company?.name || currentUser.email).charAt(0)}</span>
                    )}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-semibold text-neutral-900 leading-tight">
                      {profile?.fullName || company?.name || currentUser.email.split('@')[0]}
                    </p>
                    <p className="text-[10px] text-neutral-500 font-mono leading-tight">
                      {currentUser.role}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                </button>

                {roleMenuOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-neutral-200 py-2 z-50">
                    <div className="px-3 py-1.5 border-b border-neutral-100 text-[10px] font-semibold text-neutral-400 tracking-wider">
                      SWITCH TEST PERSONA (VIVA EVALUATION)
                    </div>

                    {demoPersonas.map((persona) => {
                      const isSelected = persona.id === currentUser.id;
                      const Icon = persona.icon;
                      return (
                        <button
                          key={persona.id}
                          onClick={() => {
                            onSwitchUser(persona.id);
                            setRoleMenuOpen(false);
                            if (persona.role === 'SEEKER') setActiveView('jobs');
                            else if (persona.role === 'EMPLOYER') setActiveView('employer');
                            else if (persona.role === 'ADMIN') setActiveView('admin');
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-neutral-50 transition-colors ${
                            isSelected ? 'bg-neutral-50' : ''
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-700">
                              <Icon className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-neutral-900">{persona.name}</p>
                              <p className="text-[11px] text-neutral-500">{persona.title}</p>
                            </div>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-neutral-900" />}
                        </button>
                      );
                    })}

                    <div className="border-t border-neutral-100 mt-1 pt-1 px-2 space-y-0.5">
                      <button
                        onClick={() => {
                          setRoleMenuOpen(false);
                          onOpenAcademicDeck();
                        }}
                        className="w-full text-left px-2 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 rounded-lg hover:bg-neutral-50 flex items-center gap-2"
                      >
                        <GraduationCap className="w-3.5 h-3.5 text-neutral-500" />
                        <span>Academic Viva Deck (Slides 1–7)</span>
                      </button>

                      <button
                        onClick={() => {
                          setRoleMenuOpen(false);
                          onLogout();
                        }}
                        className="w-full text-left px-2 py-1.5 text-xs text-red-600 hover:text-red-700 rounded-lg hover:bg-red-50 flex items-center gap-2 font-medium"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Log Out to Landing Page</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
