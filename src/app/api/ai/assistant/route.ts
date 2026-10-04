import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { repository } from '@/lib/repository';
import { Job, Profile } from '@/lib/types';

// Initialize Gemini SDK with server-side key
const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export async function POST(req: NextRequest) {
  try {
    const current = repository.getCurrentUser();
    if (!current.user) {
      return NextResponse.json({ error: 'Please sign in to access the AI Career Assistant.' }, { status: 401 });
    }

    const body = await req.json();
    const { action, job, customInstructions } = body as {
      action: 'OPTIMIZE_CV' | 'GENERATE_COVER_LETTER' | 'JOB_MATCH_DEEPDIVE' | 'FREELANCE_PITCH';
      job?: Job;
      customInstructions?: string;
    };

    const profile = current.profile;
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found. Please complete your profile first.' }, { status: 400 });
    }

    // Check credits for Free Tier users
    if (profile.subscriptionTier === 'FREE') {
      const creditResult = repository.useAICredit(current.user.id);
      if (!creditResult.success) {
        return NextResponse.json(
          {
            error: 'You have reached your free AI Assistant credits limit (5 credits). Upgrade to Global Pro to enjoy unlimited AI optimizations.',
            upgradeRequired: true,
          },
          { status: 403 }
        );
      }
    }

    const ai = getAiClient();

    switch (action) {
      case 'OPTIMIZE_CV': {
        const result = await handleOptimizeCV(ai, profile, customInstructions);
        return NextResponse.json({ success: true, result });
      }

      case 'GENERATE_COVER_LETTER': {
        if (!job) {
          return NextResponse.json({ error: 'Target job is required to generate a tailored cover letter.' }, { status: 400 });
        }
        const result = await handleGenerateCoverLetter(ai, profile, job, customInstructions);
        return NextResponse.json({ success: true, result });
      }

      case 'JOB_MATCH_DEEPDIVE': {
        if (!job) {
          return NextResponse.json({ error: 'Target job is required for match deep dive.' }, { status: 400 });
        }
        const result = await handleJobMatchDeepDive(ai, profile, job);
        return NextResponse.json({ success: true, result });
      }

      case 'FREELANCE_PITCH': {
        if (!job) {
          return NextResponse.json({ error: 'Target gig or contract is required for freelance pitch.' }, { status: 400 });
        }
        const result = await handleFreelancePitch(ai, profile, job, customInstructions);
        return NextResponse.json({ success: true, result });
      }

      default:
        return NextResponse.json({ error: 'Unsupported AI assistant action.' }, { status: 400 });
    }
  } catch (err: any) {
    console.error('AI Assistant Route Error:', err);
    return NextResponse.json({ error: err?.message || 'AI Assistant service unavailable.' }, { status: 500 });
  }
}

// ----------------------------------------------------------------------
// 1. AI CV & ATS OPTIMIZER
// ----------------------------------------------------------------------
async function handleOptimizeCV(ai: GoogleGenAI | null, profile: Profile, customInstructions?: string) {
  if (ai) {
    try {
      const prompt = `
You are an expert global tech career consultant and ATS (Applicant Tracking System) optimization algorithm specialist.
Review this candidate profile and CV content for international remote and freelance tech positions.

CANDIDATE PROFILE:
- Name: ${profile.fullName}
- Headline: ${profile.headline}
- Experience: ${profile.experienceYears} years
- Location: ${profile.location} (${profile.timezone})
- Skills: ${profile.skills.join(', ')}
- Freelancer: ${profile.isFreelancer ? 'Yes (Hourly rate: $' + (profile.hourlyRate || 80) + '/hr)' : 'No'}
- Bio: ${profile.bio}
- Resume Parsed Text: ${profile.resumeParsedText || 'N/A'}
${customInstructions ? `Special Candidate Note: ${customInstructions}` : ''}

Respond ONLY with valid JSON in this exact structure:
{
  "atsScore": number (between 70 and 96 based on quality),
  "summaryAssessment": "1-2 sentence executive assessment of resume strength",
  "strengths": ["string", "string", "string"],
  "weaknesses": ["string", "string", "string"],
  "missingKeywords": ["string", "string", "string", "string"],
  "improvedSummary": "A punchy, metric-driven executive bio tailored for global hiring managers and contract clients",
  "bulletPointEnhancements": [
    {
      "original": "string representing a standard vague bullet point",
      "improved": "quantified, impact-driven bullet point with specific technologies and metrics",
      "impactRationale": "why this revision converts better"
    },
    {
      "original": "string",
      "improved": "string",
      "impactRationale": "string"
    }
  ],
  "freelancerTips": ["tip 1 on positioning", "tip 2 on rates and contracts", "tip 3 on portfolio"]
}
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      if (response.text) {
        return JSON.parse(response.text);
      }
    } catch (e) {
      console.warn('Gemini API call failed, falling back to smart heuristic:', e);
    }
  }

  // Smart Heuristic Fallback
  return {
    atsScore: 88,
    summaryAssessment: `${profile.fullName} possesses a robust technical foundation with ${profile.experienceYears}+ years in modern stacks (${profile.skills.slice(0, 3).join(', ')}). ATS keyword density is solid with opportunities to quantify throughput metrics.`,
    strengths: [
      `Strong core alignment in ${profile.skills.slice(0, 4).join(', ')} with verified full-stack capability`,
      `Clear timezone positioning in ${profile.timezone} suitable for international cross-border teams`,
      profile.isFreelancer ? `Versatile positioning as both contract specialist ($${profile.hourlyRate || 85}/hr) and senior engineering contributor` : 'Clean progression across multi-year engineering roles',
    ],
    weaknesses: [
      'Resume bullets could feature stronger quantified business impact metrics (e.g. latency reduction %, throughput scaling, revenue impacted)',
      'Include explicit mention of cloud infrastructure monitoring and automated CI/CD testing coverage',
      'Emphasize asynchronous international team communication practices',
    ],
    missingKeywords: ['System Architecture', 'CI/CD Pipelines', 'Performance Optimization', 'Security Compliance', 'Cloud Cost Reduction'],
    improvedSummary: `${profile.headline}. Engineered scalable distributed cloud solutions and high-traffic web applications with ${profile.skills.slice(0, 4).join(', ')}. Demonstrated success delivering high-availability milestones, reducing deployment latency, and driving reliable outcomes across distributed global teams.`,
    bulletPointEnhancements: [
      {
        original: 'Worked on web applications and updated database queries using TypeScript and MySQL.',
        improved: 'Architected relational MySQL data schemas with Prisma ORM and Next.js, serving 500k+ monthly requests with sub-50ms query response times.',
        impactRationale: 'Introduces clear scale metrics (500k+ requests, sub-50ms) and high-value tech keywords that ATS parsers flag positively.',
      },
      {
        original: 'Helped migrate existing company website to a modern tech stack.',
        improved: 'Spearheaded full migration of legacy frontend architecture to Next.js 16 App Router and Tailwind CSS, reducing Largest Contentful Paint (LCP) by 42%.',
        impactRationale: 'Highlights technical leadership (Spearheaded) and industry-standard benchmark (LCP -42%).',
      },
    ],
    freelancerTips: [
      'Package your skills into explicit client outcomes (e.g. "3-Week Next.js 16 Migration" rather than generic hourly labor).',
      'Maintain an active GitHub portfolio with live production demonstrations for rapid employer confidence.',
      'Highlight timezone overlap hours up-front to eliminate remote collaboration hesitations.',
    ],
  };
}

// ----------------------------------------------------------------------
// 2. AI TAILORED COVER LETTER GENERATOR
// ----------------------------------------------------------------------
async function handleGenerateCoverLetter(
  ai: GoogleGenAI | null,
  profile: Profile,
  job: Job,
  customInstructions?: string
) {
  if (ai) {
    try {
      const prompt = `
You are a senior tech recruiter and executive career coach.
Write a personalized, compelling, non-generic cover letter for this candidate applying to this specific job.

CANDIDATE:
- Name: ${profile.fullName}
- Title: ${profile.headline}
- Experience: ${profile.experienceYears} years
- Location & Timezone: ${profile.location} (${profile.timezone})
- Skills: ${profile.skills.join(', ')}

TARGET JOB:
- Title: ${job.title}
- Company: ${job.company?.name || 'Hiring Team'}
- Department: ${job.department}
- Employment Type: ${job.employmentType}
- Location / Remote: ${job.isRemote ? 'Remote' : job.location}
- Timezone Requirement: ${job.timezoneRequirement || 'Flexible'}
- Requirements: ${job.requirements.join('; ')}
- Required Skills: ${job.skills.join(', ')}
${customInstructions ? `Candidate Custom Notes: ${customInstructions}` : ''}

Respond ONLY with valid JSON in this exact structure:
{
  "salutation": "Dear Hiring Team at [Company Name],",
  "hookParagraph": "Engaging opening paragraph stating why this role is the ideal intersection of skills and company mission.",
  "skillsHighlightParagraph": "Paragraph demonstrating exact alignment with key requirements (${job.skills.slice(0, 3).join(', ')}), with concrete examples of past impact.",
  "timezoneAndCultureParagraph": "Paragraph discussing seamless remote collaboration, timezone alignment, and proactive communication.",
  "callToAction": "Confident closing statement inviting a technical interview or milestone review.",
  "coverLetter": "Full consolidated letter including all paragraphs formatted cleanly.",
  "matchScoreRef": 92
}
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      if (response.text) {
        return JSON.parse(response.text);
      }
    } catch (e) {
      console.warn('Gemini cover letter generation failed, using heuristic fallback:', e);
    }
  }

  // Heuristic Fallback
  const companyName = job.company?.name || 'the engineering team';
  const salutation = `Dear Hiring Team at ${companyName},`;
  const hookParagraph = `I am writing to express my strong enthusiasm for the ${job.title} position at ${companyName}. With over ${profile.experienceYears} years of hands-on experience building high-throughput web systems with ${profile.skills.slice(0, 3).join(', ')}, I have followed ${companyName}'s work in ${job.department} and am eager to contribute immediately to your product goals.`;
  const skillsHighlightParagraph = `In reviewing your technical requirements, my background aligns closely with your core stack. I have extensive experience with ${job.skills.slice(0, 4).join(', ')}, specifically architecting resilient APIs and responsive frontend applications that prioritize reliability and developer velocity. In my recent projects, I spearheaded performance optimizations that cut latency by over 40% while ensuring strict type safety and modular maintainability.`;
  const timezoneAndCultureParagraph = `Operating from ${profile.location} (${profile.timezone}), I provide an uninterrupted ${job.minOverlapHours || 4}+ hours of daily working overlap with your core team. Having collaborated asynchronously across international boundaries, I bring disciplined documentation, clean PR workflows, and dependable milestone delivery.`;
  const callToAction = `I welcome the opportunity to discuss how my technical background and proactive delivery approach can accelerate ${companyName}'s roadmap. Thank you for your time and consideration.`;

  const coverLetter = `${salutation}\n\n${hookParagraph}\n\n${skillsHighlightParagraph}\n\n${timezoneAndCultureParagraph}\n\n${callToAction}\n\nWarm regards,\n${profile.fullName}\n${profile.headline}\n${profile.location}`;

  return {
    salutation,
    hookParagraph,
    skillsHighlightParagraph,
    timezoneAndCultureParagraph,
    callToAction,
    coverLetter,
    matchScoreRef: job.matchScore || 90,
  };
}

// ----------------------------------------------------------------------
// 3. AI JOB MATCH DEEP DIVE & INTERVIEW PREP
// ----------------------------------------------------------------------
async function handleJobMatchDeepDive(ai: GoogleGenAI | null, profile: Profile, job: Job) {
  if (ai) {
    try {
      const prompt = `
Analyze the compatibility between this candidate and job listing. Provide actionable technical interview preparation questions with suggested answer strategies.

CANDIDATE:
- Name: ${profile.fullName}
- Skills: ${profile.skills.join(', ')}
- Experience: ${profile.experienceYears} years

JOB:
- Title: ${job.title}
- Company: ${job.company?.name || 'Company'}
- Skills Required: ${job.skills.join(', ')}
- Description: ${job.description}

Respond ONLY with valid JSON in this exact structure:
{
  "overallVerdict": "Concise summary of candidate's competitive advantage for this position",
  "topStrengths": ["strength 1", "strength 2", "strength 3"],
  "growthOpportunities": ["potential gap or area to review prior to interview"],
  "technicalInterviewQuestions": [
    {
      "question": "Realistic, high-level technical interview question company is likely to ask",
      "suggestedAnswerApproach": "How the candidate should structure their answer using STAR method and their verified skills",
      "relevantCandidateSkill": "TypeScript / Next.js / etc."
    },
    {
      "question": "Architecture or timezone/remote collaboration question",
      "suggestedAnswerApproach": "Specific advice",
      "relevantCandidateSkill": "Remote Collaboration"
    },
    {
      "question": "Scenario-based debugging or performance challenge",
      "suggestedAnswerApproach": "Specific advice",
      "relevantCandidateSkill": "Database / Performance"
    }
  ],
  "negotiationTips": "Advice on salary or hourly rate positioning based on candidate skills"
}
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      if (response.text) {
        return JSON.parse(response.text);
      }
    } catch (e) {
      console.warn('Gemini match deep dive failed, falling back:', e);
    }
  }

  // Heuristic Fallback
  return {
    overallVerdict: `Strong match (${profile.skills.filter((s) => job.skills.includes(s)).length}/${job.skills.length} core competencies matched). Candidate's ${profile.experienceYears} years experience meets or exceeds the required threshold with excellent timezone overlap.`,
    topStrengths: [
      `Direct proficiency in ${job.skills.slice(0, 3).join(', ')}`,
      `Working hours compatibility ensuring ≥ ${job.minOverlapHours || 4} hours shared daily presence`,
      'Proven background in type-safe development and production deployments',
    ],
    growthOpportunities: [
      `Prepare to discuss edge cases in ${job.skills[job.skills.length - 1] || 'distributed caching'}`,
      'Review system design trade-offs between monolithic API routes and decoupled microservices',
    ],
    technicalInterviewQuestions: [
      {
        question: `How do you structure Server Components vs Client Components in Next.js to minimize bundle size and prevent layout shift?`,
        suggestedAnswerApproach: `Explain keeping data-fetching on the server, pushing client boundaries to leaf interactive buttons, and utilizing Suspense fallbacks.`,
        relevantCandidateSkill: 'Next.js & React',
      },
      {
        question: `Can you walk us through a scenario where a database query caused a latency spike in production and how you identified and resolved it?`,
        suggestedAnswerApproach: `Mention analyzing query execution plans (EXPLAIN), reviewing missing composite indices, and adding an in-memory Redis cache layer.`,
        relevantCandidateSkill: 'MySQL & Databases',
      },
      {
        question: `How do you manage communication and deliverable velocity when working across a multi-hour timezone delta?`,
        suggestedAnswerApproach: `Highlight clear written async updates, unambiguous pull request descriptions, and scheduling overlapping sync hours for unblocking blockers.`,
        relevantCandidateSkill: 'Global Remote Teamwork',
      },
    ],
    negotiationTips: `Given the global demand for ${job.skills.slice(0, 2).join(' & ')}, target the upper quartile of the posted band ($${(job.salaryMax / 1000).toFixed(0)}k or $${job.hourlyRateMax || 110}/hr). Highlight your immediate onboarding readiness.`,
  };
}

// ----------------------------------------------------------------------
// 4. AI FREELANCE PROPOSAL & PITCH GENERATOR
// ----------------------------------------------------------------------
async function handleFreelancePitch(
  ai: GoogleGenAI | null,
  profile: Profile,
  job: Job,
  customInstructions?: string
) {
  if (ai) {
    try {
      const prompt = `
You are a top freelance contractor coach. Create a high-converting Freelance Statement of Work (SOW) Proposal and pitch for this contract gig.

FREELANCER:
- Name: ${profile.fullName}
- Hourly Rate: $${profile.hourlyRate || 85}/hr
- Core Skills: ${profile.skills.join(', ')}
- Availability: ${profile.contractAvailability || 'Immediate'}

CLIENT CONTRACT GIG:
- Title: ${job.title}
- Company: ${job.company?.name || 'Client'}
- Project Duration: ${job.projectDuration || '3 Months'}
- Budget / Rate: ${job.rateType === 'HOURLY' ? `$${job.hourlyRateMin || 75} - $${job.hourlyRateMax || 110}/hr` : `$${job.salaryMin} - $${job.salaryMax} Fixed`}
- Scope: ${job.description}
- Key Skills: ${job.skills.join(', ')}
${customInstructions ? `Freelancer Note: ${customInstructions}` : ''}

Respond ONLY with valid JSON in this exact structure:
{
  "proposalTitle": "Clear, outcomes-oriented proposal title",
  "executivePitch": "Crisp 2-paragraph value proposition explaining how the freelancer will execute this scope on time and under budget",
  "deliverableMilestones": [
    {
      "phase": "Milestone 1: Discovery & Architecture Blueprint",
      "duration": "1-2 Weeks",
      "deliverables": "Audit existing system, define API contracts, deliver proof-of-concept PR",
      "suggestedBudgetPct": 25
    },
    {
      "phase": "Milestone 2: Core Implementation & Integrations",
      "duration": "3-5 Weeks",
      "deliverables": "Build core functional components, automated tests, and staging deploy",
      "suggestedBudgetPct": 50
    },
    {
      "phase": "Milestone 3: Performance Hardening & Handover",
      "duration": "1-2 Weeks",
      "deliverables": "Load testing, comprehensive documentation, and production launch support",
      "suggestedBudgetPct": 25
    }
  ],
  "rateJustification": "Clear justification for hourly or fixed fee positioning based on speed and lack of oversight needed",
  "closingCallToAction": "Direct invitation to schedule a 15-minute alignment call"
}
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      if (response.text) {
        return JSON.parse(response.text);
      }
    } catch (e) {
      console.warn('Gemini freelance pitch failed, using fallback:', e);
    }
  }

  // Heuristic Fallback
  return {
    proposalTitle: `Technical Proposal: High-Velocity Execution for ${job.title}`,
    executivePitch: `I am pleased to submit my proposal for ${job.title}. With specialized expertise in ${job.skills.slice(0, 3).join(', ')} and a proven record of shipping milestone contracts on schedule, I am equipped to take ownership of this scope with minimal onboarding overhead.\n\nMy approach focuses on rapid incremental delivery: establishing working prototypes in Sprint 1, automating regression tests, and maintaining open asynchronous communication throughout the engagement.`,
    deliverableMilestones: [
      {
        phase: 'Milestone 1: Technical Discovery & Architecture Blueprint',
        duration: '1-2 Weeks',
        deliverables: `System audit, interface contract specification for ${job.skills[0] || 'core modules'}, and baseline CI/CD setup.`,
        suggestedBudgetPct: 25,
      },
      {
        phase: 'Milestone 2: Core Engineering & Feature Delivery',
        duration: '3-4 Weeks',
        deliverables: `Full implementation of primary requirements, end-to-end integration tests, and weekly staging milestone demos.`,
        suggestedBudgetPct: 50,
      },
      {
        phase: 'Milestone 3: Production Hardening, Audit & Handover',
        duration: '1-2 Weeks',
        deliverables: `Performance profiling, documentation of system invariants, and knowledge transfer to internal engineers.`,
        suggestedBudgetPct: 25,
      },
    ],
    rateJustification: `My proposed rate of $${profile.hourlyRate || 85}/hr reflects senior-level independent execution. You gain an engineer who requires zero micromanagement, delivers clean type-safe code, and meets contract deadlines.`,
    closingCallToAction: `I am available to start immediately and would love to schedule a brief 15-minute call to review your milestone goals and answer any technical questions.`,
  };
}
