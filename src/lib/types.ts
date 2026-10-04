export type Role = 'SEEKER' | 'EMPLOYER' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION';
export type JobType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'FREELANCE' | 'INTERNSHIP';
export type ExperienceLevel = 'ENTRY' | 'MID' | 'SENIOR' | 'LEAD' | 'EXECUTIVE';
export type WorkPreference = 'REMOTE' | 'HYBRID' | 'ONSITE';
export type JobStatus = 'OPEN' | 'CLOSED' | 'DRAFT';
export type ModerationStatus = 'APPROVED' | 'PENDING' | 'FLAGGED';
export type ApplicationStatus = 'SUBMITTED' | 'UNDER_REVIEW' | 'SHORTLISTED' | 'INTERVIEW_SCHEDULED' | 'REJECTED' | 'HIRED';
export type InterviewStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
export type SubscriptionTier = 'FREE' | 'PRO' | 'FREELANCE_PRO';

export interface User {
  id: string;
  email: string;
  role: Role;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Profile {
  id: string;
  userId: string;
  fullName: string;
  headline: string;
  bio: string;
  location: string;
  timezone: string; // e.g. "UTC+1 (Lagos / London)"
  utcOffset: number; // e.g. 1.0
  skills: string[];
  experienceYears: number;
  expectedSalary: number;
  currency: string;
  // Freelancer & Contractor Extensions
  isFreelancer?: boolean;
  hourlyRate?: number;
  contractAvailability?: 'IMMEDIATELY' | 'PART_TIME_20H' | 'FULL_TIME_CONTRACT' | 'NOT_AVAILABLE';
  portfolioUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  workPreference: WorkPreference;
  avatarUrl?: string;
  resumeUrl?: string;
  resumeFileName?: string;
  resumeParsedText?: string;
  // Paid Subscription & Monetization for Job Seekers / Freelancers
  subscriptionTier?: SubscriptionTier;
  subscriptionStatus?: 'ACTIVE' | 'INACTIVE';
  proExpiresAt?: string;
  aiCreditsRemaining?: number;
  applicationsCountThisMonth?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  id: string;
  userId: string;
  name: string;
  industry: string;
  headquarters: string;
  timezone: string;
  website?: string;
  logoUrl?: string;
  description: string;
  teamSize: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Job {
  id: string;
  companyId: string;
  company?: Company;
  title: string;
  department: string;
  description: string;
  requirements: string[];
  niceToHave?: string[];
  skills: string[];
  employmentType: JobType;
  experienceLevel: ExperienceLevel;
  location: string;
  isRemote: boolean;
  timezoneRequirement?: string; // e.g. "UTC-5 to UTC+2"
  targetUtcOffset?: number;
  minOverlapHours: number;
  salaryMin: number;
  salaryMax: number;
  currency: string;
  // Freelance & Gig Specifics
  rateType?: 'ANNUAL' | 'HOURLY' | 'FIXED_PROJECT';
  hourlyRateMin?: number;
  hourlyRateMax?: number;
  projectDuration?: string;
  weeklyHours?: number;
  isFreelanceGig?: boolean;
  status: JobStatus;
  moderationStatus: ModerationStatus;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  applicationCount?: number;
  matchScore?: number;
  matchBreakdown?: MatchBreakdown;
  isSaved?: boolean;
}

export interface MatchBreakdown {
  overallScore: number; // 0 to 100
  tier: 'High Match' | 'Good Match' | 'Moderate Match' | 'Low Match';
  skillScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  experienceScore: number;
  experienceDifference: number; // candidate years - job expected years
  timezoneScore: number;
  overlapHours: number;
  remoteScore: number;
  rationale: string;
}

export interface Application {
  id: string;
  jobId: string;
  job?: Job;
  seekerId: string;
  seeker?: {
    id: string;
    email: string;
    profile?: Profile;
  };
  status: ApplicationStatus;
  matchScore: number;
  matchBreakdown: MatchBreakdown;
  coverLetter?: string;
  resumeSnapshotUrl?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  interviews?: Interview[];
}

export interface Interview {
  id: string;
  applicationId: string;
  application?: Application;
  scheduledAt: string;
  durationMinutes: number;
  timezone: string;
  meetingLink: string;
  meetingPlatform: string;
  notes?: string;
  status: InterviewStatus;
  createdAt: string;
  updatedAt: string;
}

export interface SavedJob {
  id: string;
  userId: string;
  jobId: string;
  job?: Job;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  actorId?: string;
  actorEmail: string;
  action: string;
  entityType: 'JOB' | 'USER' | 'APPLICATION' | 'INTERVIEW' | 'AUTH';
  entityId: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  createdAt: string;
}

export interface JobFilterParams {
  query?: string;
  skills?: string[];
  employmentType?: string;
  experienceLevel?: string;
  isRemote?: boolean | string;
  location?: string;
  minSalary?: number;
  maxSalary?: number;
  userUtcOffset?: number;
  minOverlapHours?: number;
  minMatchScore?: number;
  status?: JobStatus;
  moderationStatus?: ModerationStatus;
}

// ----------------------------------------------------------------------
// AI CV & Job Assistant Interfaces
// ----------------------------------------------------------------------
export interface AICVReviewResult {
  atsScore: number; // 0 - 100
  summaryAssessment: string;
  strengths: string[];
  weaknesses: string[];
  missingKeywords: string[];
  improvedSummary: string;
  bulletPointEnhancements: Array<{
    original: string;
    improved: string;
    impactRationale: string;
  }>;
  freelancerTips?: string[];
}

export interface AICoverLetterResult {
  coverLetter: string;
  salutation: string;
  hookParagraph: string;
  skillsHighlightParagraph: string;
  timezoneAndCultureParagraph: string;
  callToAction: string;
  matchScoreRef: number;
}

export interface AIJobMatchDeepDive {
  overallVerdict: string;
  topStrengths: string[];
  growthOpportunities: string[];
  technicalInterviewQuestions: Array<{
    question: string;
    suggestedAnswerApproach: string;
    relevantCandidateSkill: string;
  }>;
  negotiationTips: string;
}

export interface AIFreelancePitchResult {
  proposalTitle: string;
  executivePitch: string;
  deliverableMilestones: Array<{
    phase: string;
    duration: string;
    deliverables: string;
    suggestedBudgetPct: number;
  }>;
  rateJustification: string;
  closingCallToAction: string;
}

// ----------------------------------------------------------------------
// Monetization / Paid Plans for Job Seekers & Freelancers
// ----------------------------------------------------------------------
export interface SubscriptionPlan {
  id: SubscriptionTier;
  name: string;
  badge: string;
  priceMonthly: number;
  priceYearly: number;
  popular?: boolean;
  tagline: string;
  features: string[];
  aiCreditsMonthly: number | 'UNLIMITED';
  applicationsMonthly: number | 'UNLIMITED';
  directEmployerChat: boolean;
  priorityATS: boolean;
  verifiedBadge: boolean;
}
