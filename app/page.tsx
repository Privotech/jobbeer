'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import LandingPage from '@/components/LandingPage';
import JobSeekerDashboard from '@/components/JobSeekerDashboard';
import ApplicationsTracker from '@/components/ApplicationsTracker';
import EmployerDashboard from '@/components/EmployerDashboard';
import AdminDashboard from '@/components/AdminDashboard';
import JobDetailModal from '@/components/JobDetailModal';
import ProfileModal from '@/components/ProfileModal';
import AuthModal from '@/components/AuthModal';
import PricingModal from '@/components/PricingModal';
import AICVAssistantModal from '@/components/AICVAssistantModal';
import { User, Profile, Company, Job, Application, AuditLog, ApplicationStatus, ModerationStatus, UserStatus, Role } from '@/lib/types';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function HomePage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | undefined>(undefined);
  const [company, setCompany] = useState<Company | undefined>(undefined);

  const [activeView, setActiveView] = useState<'landing' | 'jobs' | 'matches' | 'applications' | 'employer' | 'admin'>('landing');
  const [landingSearchQuery, setLandingSearchQuery] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [adminData, setAdminData] = useState<{
    metrics: any;
    users: any[];
    jobs: Job[];
    auditLogs: AuditLog[];
  } | null>(null);

  // Modals
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [aiAssistantConfig, setAiAssistantConfig] = useState<{
    isOpen: boolean;
    job?: Job | null;
    initialTab?: 'cv_optimizer' | 'cover_letter' | 'match_prep' | 'freelance_pitch';
  }>({
    isOpen: false,
    job: null,
    initialTab: 'cv_optimizer',
  });
  const [authModalConfig, setAuthModalConfig] = useState<{
    isOpen: boolean;
    mode: 'signin' | 'signup';
    role: Role;
  }>({
    isOpen: false,
    mode: 'signin',
    role: 'SEEKER',
  });

  // Toast notifications
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Fetch Auth & Session
  const fetchAuth = useCallback(async () => {
    try {
      const res = await fetch('/api/auth');
      const data = await res.json();
      setCurrentUser(data.user);
      setProfile(data.profile);
      setCompany(data.company);
      if (data.user) {
        if (data.user.role === 'SEEKER') setActiveView('jobs');
        else if (data.user.role === 'EMPLOYER') setActiveView('employer');
        else if (data.user.role === 'ADMIN') setActiveView('admin');
      } else {
        setActiveView('landing');
      }
    } catch (e) {
      console.error('Failed to load session', e);
    }
  }, []);

  // Fetch Jobs
  const fetchJobs = useCallback(async () => {
    try {
      const res = await fetch('/api/jobs');
      const data = await res.json();
      if (data.jobs) {
        setJobs(data.jobs);
      }
    } catch (e) {
      console.error('Failed to load jobs', e);
    }
  }, []);

  // Fetch Applications
  const fetchApplications = useCallback(async () => {
    try {
      const res = await fetch('/api/applications');
      const data = await res.json();
      if (data.applications) {
        setApplications(data.applications);
      }
    } catch (e) {
      console.error('Failed to load applications', e);
    }
  }, []);

  // Fetch Admin Data
  const fetchAdminData = useCallback(async () => {
    try {
      const res = await fetch('/api/admin');
      if (res.ok) {
        const data = await res.json();
        setAdminData(data);
      }
    } catch (e) {
      console.error('Failed to load admin metrics', e);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    async function loadInitial() {
      try {
        const [authRes, jobsRes] = await Promise.all([
          fetch('/api/auth').then((r) => r.json()),
          fetch('/api/jobs').then((r) => r.json()),
        ]);
        if (isMounted) {
          if (authRes.user) {
            setCurrentUser(authRes.user);
            setProfile(authRes.profile);
            setCompany(authRes.company);
            if (authRes.user.role === 'SEEKER') setActiveView('jobs');
            else if (authRes.user.role === 'EMPLOYER') setActiveView('employer');
            else if (authRes.user.role === 'ADMIN') setActiveView('admin');
          } else {
            setActiveView('landing');
          }
          if (jobsRes.jobs) setJobs(jobsRes.jobs);
        }
      } catch (err) {
        console.error('Initial load error', err);
      }
    }
    loadInitial();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    if (activeView === 'admin' || currentUser?.role === 'ADMIN') {
      fetch('/api/admin')
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (isMounted && data?.metrics) setAdminData(data);
        })
        .catch((err) => console.error('Admin load error', err));
    }
    if (currentUser) {
      fetch('/api/applications')
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (isMounted && data?.applications) setApplications(data.applications);
        })
        .catch((err) => console.error('Applications load error', err));
    }
    return () => {
      isMounted = false;
    };
  }, [activeView, currentUser]);

  // Auth Success Callback: Route directly into the appropriate role section!
  const handleAuthSuccess = (authData: { user: User; profile?: Profile; company?: Company }) => {
    setCurrentUser(authData.user);
    setProfile(authData.profile);
    setCompany(authData.company);
    fetchJobs();
    fetchApplications();

    if (authData.user.role === 'SEEKER') {
      setActiveView('jobs');
      showNotification(`Welcome, ${authData.profile?.fullName || 'Job Seeker'}! Viewing jobs tailored to your skills.`);
    } else if (authData.user.role === 'EMPLOYER') {
      setActiveView('employer');
      showNotification(`Welcome, ${authData.company?.name || 'Hiring Lead'}! Employer ATS workspace loaded.`);
    } else if (authData.user.role === 'ADMIN') {
      setActiveView('admin');
      fetchAdminData();
      showNotification('Administrator console authenticated. System telemetry active.');
    }
  };

  // Sign out
  const handleLogout = async () => {
    try {
      await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'LOGOUT' }),
      });
      setCurrentUser(null);
      setProfile(undefined);
      setCompany(undefined);
      setActiveView('landing');
      showNotification('Signed out successfully. Returned to landing page.');
      fetchJobs();
    } catch {
      showNotification('Failed to log out', 'error');
    }
  };

  // Switch demo user
  const handleSwitchUser = async (userId: string) => {
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'SWITCH_USER', userId }),
      });
      const data = await res.json();
      if (data.success) {
        handleAuthSuccess(data);
      }
    } catch {
      showNotification('Failed to switch user persona', 'error');
    }
  };

  // Submit Job Application
  const handleSubmitApplication = async (jobId: string, coverLetter: string) => {
    if (!currentUser) {
      setSelectedJob(null);
      setAuthModalConfig({ isOpen: true, mode: 'signup', role: 'SEEKER' });
      showNotification('Please sign in or create a Job Seeker account to apply', 'error');
      return;
    }

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId, coverLetter }),
      });
      const data = await res.json();
      if (res.ok) {
        showNotification('Application submitted successfully with smart score matching!');
        fetchApplications();
        fetchJobs();
      } else {
        showNotification(data.error || 'Failed to submit application', 'error');
      }
    } catch {
      showNotification('Application failed to send', 'error');
    }
  };

  // Save profile updates
  const handleSaveProfile = async (updatedData: Partial<Profile>) => {
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      const data = await res.json();
      if (data.profile) {
        setProfile(data.profile);
        showNotification('Profile updated! Re-evaluating smart match scores...');
        fetchJobs();
      }
    } catch {
      showNotification('Failed to save profile', 'error');
    }
  };

  // Toggle Save Job
  const handleToggleSaveJob = async (jobId: string) => {
    if (!currentUser) {
      setAuthModalConfig({ isOpen: true, mode: 'signin', role: 'SEEKER' });
      showNotification('Sign in to bookmark jobs to your profile', 'error');
      return;
    }
    try {
      const res = await fetch('/api/saved-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId }),
      });
      const data = await res.json();
      setJobs((prev) =>
        prev.map((j) => (j.id === jobId ? { ...j, isSaved: data.saved } : j))
      );
      showNotification(data.saved ? 'Job saved to your bookmarks' : 'Job removed from bookmarks');
    } catch {
      showNotification('Failed to update bookmark', 'error');
    }
  };

  // Employer Post Job
  const handlePostJob = async (jobData: Record<string, unknown>) => {
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData),
      });
      const data = await res.json();
      if (res.ok) {
        showNotification('New global job vacancy posted successfully!');
        fetchJobs();
      } else {
        showNotification(data.error || 'Failed to post job', 'error');
      }
    } catch {
      showNotification('Failed to post job vacancy', 'error');
    }
  };

  // ATS Application Status Update
  const handleUpdateAppStatus = async (applicationId: string, status: ApplicationStatus, notes?: string) => {
    try {
      const res = await fetch(`/api/applications/${applicationId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes }),
      });
      if (res.ok) {
        showNotification(`Application status updated to ${status}`);
        fetchApplications();
      }
    } catch {
      showNotification('Failed to update status', 'error');
    }
  };

  // Schedule Interview
  const handleScheduleInterview = async (interviewData: any) => {
    try {
      const res = await fetch('/api/interviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(interviewData),
      });
      if (res.ok) {
        showNotification('Interview successfully scheduled and invitation created!');
        fetchApplications();
      }
    } catch {
      showNotification('Failed to schedule interview', 'error');
    }
  };

  // Admin Moderate Job
  const handleModerateJob = async (jobId: string, moderationStatus: ModerationStatus) => {
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'MODERATE_JOB', jobId, moderationStatus }),
      });
      if (res.ok) {
        showNotification(`Job moderation status set to ${moderationStatus}`);
        fetchAdminData();
        fetchJobs();
      }
    } catch {
      showNotification('Failed to moderate job', 'error');
    }
  };

  // Admin Update User Status
  const handleUpdateUserStatus = async (userId: string, userStatus: UserStatus) => {
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'UPDATE_USER_STATUS', userId, userStatus }),
      });
      if (res.ok) {
        showNotification(`User account status updated to ${userStatus}`);
        fetchAdminData();
      }
    } catch {
      showNotification('Failed to update user', 'error');
    }
  };

  // Delete Job
  const handleDeleteJob = async (jobId: string) => {
    try {
      const res = await fetch(`/api/jobs/${jobId}`, { method: 'DELETE' });
      if (res.ok) {
        showNotification('Job listing deleted');
        fetchJobs();
        if (adminData) fetchAdminData();
      }
    } catch {
      showNotification('Failed to delete job', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col font-sans selection:bg-neutral-900 selection:text-white">
      {/* Toast Notification Banner */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div
            className={`p-3.5 px-4 rounded-xl shadow-lg border text-xs font-medium flex items-center gap-2.5 ${
              notification.type === 'success'
                ? 'bg-neutral-900 text-white border-neutral-800'
                : 'bg-red-50 text-red-900 border-red-200'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-500" />
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Top Bar Navigation */}
      <Navbar
        currentUser={currentUser}
        profile={profile}
        company={company}
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenAuth={(mode, role) => setAuthModalConfig({ isOpen: true, mode, role: role || 'SEEKER' })}
        onSwitchUser={handleSwitchUser}
        onLogout={handleLogout}
        onOpenAiAssistant={() => setAiAssistantConfig({ isOpen: true, job: selectedJob || jobs[0], initialTab: 'cv_optimizer' })}
        onOpenPricing={() => setIsPricingModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* VIEW 0: Public Landing Page */}
        {activeView === 'landing' && (
          <LandingPage
            featuredJobs={jobs}
            onOpenAuth={(mode, role) => setAuthModalConfig({ isOpen: true, mode, role: role || 'SEEKER' })}
            onExploreJobs={(filterQuery) => {
              if (filterQuery) {
                setLandingSearchQuery(filterQuery);
              }
              setActiveView('jobs');
            }}
            onSelectJob={(j) => setSelectedJob(j)}
            onOpenPricing={() => setIsPricingModalOpen(true)}
            onOpenAiAssistant={() => setAiAssistantConfig({ isOpen: true, job: jobs[0], initialTab: 'cv_optimizer' })}
          />
        )}

        {/* VIEW 1: Find Jobs / Smart Matches (Job Seeker Workspace) */}
        {(activeView === 'jobs' || activeView === 'matches') && (
          <JobSeekerDashboard
            jobs={
              activeView === 'matches'
                ? jobs.filter((j) => (j.matchScore ?? j.matchBreakdown?.overallScore ?? 0) >= 80)
                : jobs
            }
            profile={profile}
            initialSearchQuery={landingSearchQuery}
            onSelectJob={(j) => setSelectedJob(j)}
            onApplyJob={(j) => {
              if (!currentUser) {
                setAuthModalConfig({ isOpen: true, mode: 'signup', role: 'SEEKER' });
              } else {
                setSelectedJob(j);
              }
            }}
            onToggleSaveJob={handleToggleSaveJob}
            onOpenProfile={() => setIsProfileModalOpen(true)}
            onOpenAiAssistant={(job, tab) =>
              setAiAssistantConfig({ isOpen: true, job: job || jobs[0], initialTab: tab || 'cv_optimizer' })
            }
            onOpenPricing={() => setIsPricingModalOpen(true)}
          />
        )}

        {/* VIEW 2: My Applications */}
        {activeView === 'applications' && (
          <ApplicationsTracker
            applications={applications}
            onSelectJob={(j) => setSelectedJob(j)}
          />
        )}

        {/* VIEW 3: Employer ATS & Postings */}
        {activeView === 'employer' && (
          <EmployerDashboard
            company={company}
            jobs={jobs.filter((j) => !company || j.companyId === company.id || currentUser?.role === 'ADMIN')}
            applications={applications}
            onPostJob={handlePostJob}
            onUpdateStatus={handleUpdateAppStatus}
            onScheduleInterview={handleScheduleInterview}
          />
        )}

        {/* VIEW 4: Admin Console */}
        {activeView === 'admin' && adminData && (
          <AdminDashboard
            metrics={adminData.metrics}
            users={adminData.users}
            jobs={adminData.jobs}
            auditLogs={adminData.auditLogs}
            onModerateJob={handleModerateJob}
            onUpdateUserStatus={handleUpdateUserStatus}
            onDeleteJob={handleDeleteJob}
          />
        )}
      </main>

      {/* Auth Modal (Sign in / Sign up with Role selection) */}
      <AuthModal
        isOpen={authModalConfig.isOpen}
        initialMode={authModalConfig.mode}
        initialRole={authModalConfig.role}
        onClose={() => setAuthModalConfig((prev) => ({ ...prev, isOpen: false }))}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Job Detail Modal */}
      <JobDetailModal
        job={selectedJob}
        profile={profile}
        onClose={() => setSelectedJob(null)}
        onSubmitApplication={handleSubmitApplication}
        onOpenAiAssistant={(job, tab) =>
          setAiAssistantConfig({ isOpen: true, job, initialTab: tab || 'cover_letter' })
        }
      />

      {/* Profile & CV Modal */}
      <ProfileModal
        profile={profile}
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onSave={handleSaveProfile}
      />

      {/* Pro & Freelancer Subscription Pricing Modal */}
      <PricingModal
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
        profile={profile}
        onSubscriptionUpdated={(newProfile) => {
          setProfile(newProfile);
          showNotification(`Account successfully upgraded to ${newProfile.subscriptionTier === 'FREELANCE_PRO' ? 'Freelance & Contractor Pro' : 'Global Pro Candidate'}!`);
        }}
      />

      {/* AI CV & Job Assistant Modal */}
      <AICVAssistantModal
        key={`${aiAssistantConfig.job?.id || 'none'}-${aiAssistantConfig.initialTab || 'cv'}-${aiAssistantConfig.isOpen}`}
        isOpen={aiAssistantConfig.isOpen}
        onClose={() => setAiAssistantConfig((prev) => ({ ...prev, isOpen: false }))}
        profile={profile}
        jobs={jobs}
        initialJob={aiAssistantConfig.job}
        initialTab={aiAssistantConfig.initialTab}
        onProfileUpdated={(updated) => setProfile(updated)}
        onOpenPricing={() => {
          setAiAssistantConfig((prev) => ({ ...prev, isOpen: false }));
          setIsPricingModalOpen(true);
        }}
      />

      {/* Platform Production Footer */}
      <footer className="border-t border-neutral-200/80 bg-white py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-neutral-900">GlobalHire</span>
            <span aria-hidden="true">·</span>
            <span>Intelligent Global Tech Employment & Freelance Platform</span>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <button
              onClick={() => setActiveView('jobs')}
              className="text-neutral-600 hover:text-neutral-900 transition-colors font-medium"
            >
              Explore Jobs
            </button>
            <button
              onClick={() => setIsPricingModalOpen(true)}
              className="text-neutral-600 hover:text-neutral-900 transition-colors font-medium"
            >
              Pro Pricing
            </button>
            <button
              onClick={() => setActiveView('employer')}
              className="text-neutral-600 hover:text-neutral-900 transition-colors font-medium"
            >
              Employers & ATS
            </button>
            <span aria-hidden="true" className="text-neutral-300">·</span>
            <span>© 2026 GlobalHire Technologies Inc. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
