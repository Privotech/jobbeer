import { NextResponse } from 'next/server';

export async function GET() {
  const academicDeck = {
    title: 'A Smart Job-Finding Full-Stack Application for Global Employment',
    course: 'Computer Science / Information Technology — Final Year Project',
    summary: 'A full-stack web application that connects job seekers and employers worldwide using intelligent matching, secure authentication, and a cloud-backed data platform.',
    slides: [
      {
        number: 1,
        title: 'Project Title & Scope',
        subtitle: 'A Smart Job-Finding Full-Stack Application for Global Employment',
        category: 'Final Year Project',
        points: [
          'Course: Computer Science / Information Technology — Final Year Project',
          'Domain: Global Remote Employment, Full-Stack Architecture, Intelligent Recommendation Systems',
          'High-throughput web application connecting talent with international employers',
        ],
      },
      {
        number: 2,
        title: 'Introduction & Background',
        subtitle: 'Problem Statement & Value Proposition',
        category: 'Market Context',
        points: [
          'Market Context: Remote work growth and cross-border hiring have expanded demand for platforms that can match talent with global opportunities across timezones.',
          'Gap in Existing Platforms: Many job sites lack personalization and context-aware recommendations, leading to low-quality matches and long hiring cycles.',
          'Our Value Proposition: Intelligent filtering, personalized recommendations, and streamlined application workflows to improve match quality and hiring efficiency.',
        ],
      },
      {
        number: 3,
        title: 'Aim & Objectives',
        subtitle: 'Four Core Pillars of the Research Project',
        category: 'Project Objectives',
        points: [
          '1. Primary Aim: Design and implement a smart global job-finding web application that reliably matches candidates with relevant roles.',
          '2. User Experience: Develop an intuitive, accessible search interface with resume upload and one-click applications.',
          '3. Global Support: Enable worldwide job posting and applications with location-aware filters and time-zone handling.',
          '4. Smart Recommendations & Security: Implement recommendation algorithms and secure user authentication to protect profiles and data.',
        ],
      },
      {
        number: 4,
        title: 'System Features & Modules',
        subtitle: 'Tri-Partite Modular Architecture',
        category: 'Functional Modules',
        points: [
          'Job Seeker Module: Registration, profile and CV upload, advanced search with filters, saved jobs, one-click apply, and recommendations.',
          'Employer Module: Company registration, job posting templates, applicant tracking, shortlisted candidates, and interview scheduling.',
          'Admin Module: User management, job listing moderation, system health monitoring, and audit logs for compliance.',
        ],
      },
      {
        number: 5,
        title: 'Technologies Used',
        subtitle: 'Modern Full-Stack Technical Stack',
        category: 'Technology Stack',
        points: [
          'Frontend: Next.js 16.2.6 with TypeScript — responsive UI, server/client application architecture, and modern full-stack routing.',
          'Backend: Next.js with TypeScript — server-side logic, API routes, input validation, business logic, session and token management.',
          'Database & Cloud: MySQL with Prisma ORM 7.8.0 — relational data storage, type-safe database access, migrations, indexes for fast search, and structured data management.',
        ],
      },
      {
        number: 6,
        title: 'System Architecture',
        subtitle: 'Layered End-to-End Architectural Flow',
        category: 'System Design',
        points: [
          'Security: JWT-based authentication, salted password hashing, server-side validation, and role-based access control (RBAC).',
          'Database: MySQL relational schema accessed through Prisma ORM 7.8.0 type-safe client with indexes on search queries and applicant statuses.',
          'REST API: Next.js API Routes handling authentication, job search filters, ATS candidate pipeline transitions, and interview scheduling.',
          'Client: Accessible, modern Next.js client components using Tailwind CSS and Motion for fluid interactions.',
        ],
      },
      {
        number: 7,
        title: 'Conclusion & Future Enhancements',
        subtitle: 'Evaluation, Impact & Roadmap',
        category: 'Future Roadmap',
        points: [
          'Project Outcome: A reliable platform that improves recruitment efficiency and broadens access to global job opportunities through intelligent matching and streamlined workflows.',
          'Near-Term Enhancements: AI resume screening, real-time job alerts, push notifications, and native mobile applications for iOS & Android.',
          'Long-Term Vision: Multi-language support, advanced bias-mitigation in recommendations, richer analytics for employers, and federation with third-party HR systems.',
          'Next Steps: Prototype evaluation with pilot users, performance testing, and integration of machine learning models for recommendation tuning followed by beta launch.',
        ],
      },
    ],
  };

  return NextResponse.json(academicDeck);
}
