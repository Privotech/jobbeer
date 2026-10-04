'use client';

import React, { useState } from 'react';
import {
  GraduationCap,
  X,
  ChevronLeft,
  ChevronRight,
  Database,
  ShieldCheck,
  Server,
  Layers,
  CheckCircle2,
  Copy,
  Check,
} from 'lucide-react';

interface AcademicPresentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AcademicPresentationModal({
  isOpen,
  onClose,
}: AcademicPresentationModalProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'slides' | 'architecture' | 'schema'>('slides');
  const [copiedSQL, setCopiedSQL] = useState(false);

  if (!isOpen) return null;

  const slides = [
    {
      number: 1,
      title: 'A Smart Job-Finding Full-Stack Application for Global Employment',
      tagline: 'Course: Computer Science / Information Technology — Final Year Project',
      badge: 'SLIDE 1 · Title & Overview',
      content: (
        <div className="space-y-6">
          <div className="p-6 bg-neutral-900 text-white rounded-2xl space-y-4">
            <span className="text-xs font-mono uppercase text-emerald-400 tracking-wider">
              Undergraduate Final Year Capstone Project
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              A Smart Job-Finding Full-Stack Application for Global Employment
            </h1>
            <p className="text-sm text-neutral-300 leading-relaxed">
              A full-stack web application that connects job seekers and employers worldwide using intelligent matching,
              secure authentication, and a cloud-backed data platform.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-white border border-neutral-200 rounded-xl">
              <span className="font-semibold text-neutral-900 block mb-1">Academic Domain</span>
              <p className="text-neutral-600">Full-Stack Distributed Systems & Contextual Recommendation Engines</p>
            </div>
            <div className="p-4 bg-white border border-neutral-200 rounded-xl">
              <span className="font-semibold text-neutral-900 block mb-1">Production Architecture</span>
              <p className="text-neutral-600">Next.js 16 + TypeScript + Prisma ORM 7.8.0 + MySQL Database</p>
            </div>
            <div className="p-4 bg-white border border-neutral-200 rounded-xl">
              <span className="font-semibold text-neutral-900 block mb-1">Key Innovation</span>
              <p className="text-neutral-600">Multi-attribute scoring factoring skill overlap, seniority, and timezone overlap</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      number: 2,
      title: 'Introduction & Background',
      tagline: 'Market Context, Platform Gaps & Value Proposition',
      badge: 'SLIDE 2 · Problem Analysis',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-5 bg-white border border-neutral-200 rounded-xl space-y-2">
              <span className="text-[11px] font-mono font-semibold uppercase text-neutral-400">01. CONTEXT</span>
              <h3 className="text-sm font-bold text-neutral-900">Market Context</h3>
              <p className="text-neutral-600 leading-relaxed">
                Remote work growth and cross-border hiring have expanded demand for platforms that can match talent with global opportunities across timezones.
              </p>
            </div>

            <div className="p-5 bg-white border border-neutral-200 rounded-xl space-y-2">
              <span className="text-[11px] font-mono font-semibold uppercase text-amber-600">02. THE GAP</span>
              <h3 className="text-sm font-bold text-neutral-900">Gap in Existing Platforms</h3>
              <p className="text-neutral-600 leading-relaxed">
                Many job sites lack personalization and context-aware recommendations, leading to low quality matches and long hiring cycles.
              </p>
            </div>

            <div className="p-5 bg-white border border-neutral-200 rounded-xl space-y-2">
              <span className="text-[11px] font-mono font-semibold uppercase text-emerald-600">03. VALUE</span>
              <h3 className="text-sm font-bold text-neutral-900">Our Value Proposition</h3>
              <p className="text-neutral-600 leading-relaxed">
                The system offers intelligent filtering, personalized recommendations, and streamlined application workflows to improve match quality and hiring efficiency.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      number: 3,
      title: 'Aim & Objectives',
      tagline: 'Four Foundational Engineering Pillars',
      badge: 'SLIDE 3 · Project Objectives',
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-5 bg-white border border-neutral-200 rounded-xl space-y-2">
            <span className="w-6 h-6 rounded-md bg-neutral-900 text-white flex items-center justify-center font-mono font-bold text-xs">1</span>
            <h3 className="text-sm font-bold text-neutral-900">Primary Aim</h3>
            <p className="text-neutral-600 leading-relaxed">
              Design and implement a smart global job-finding web application that reliably matches candidates with relevant roles.
            </p>
          </div>

          <div className="p-5 bg-white border border-neutral-200 rounded-xl space-y-2">
            <span className="w-6 h-6 rounded-md bg-neutral-900 text-white flex items-center justify-center font-mono font-bold text-xs">2</span>
            <h3 className="text-sm font-bold text-neutral-900">User Experience</h3>
            <p className="text-neutral-600 leading-relaxed">
              Develop an intuitive, accessible search interface with resume upload and one-click applications.
            </p>
          </div>

          <div className="p-5 bg-white border border-neutral-200 rounded-xl space-y-2">
            <span className="w-6 h-6 rounded-md bg-neutral-900 text-white flex items-center justify-center font-mono font-bold text-xs">3</span>
            <h3 className="text-sm font-bold text-neutral-900">Global Support</h3>
            <p className="text-neutral-600 leading-relaxed">
              Enable worldwide job posting and applications with location-aware filters and time-zone handling.
            </p>
          </div>

          <div className="p-5 bg-white border border-neutral-200 rounded-xl space-y-2">
            <span className="w-6 h-6 rounded-md bg-neutral-900 text-white flex items-center justify-center font-mono font-bold text-xs">4</span>
            <h3 className="text-sm font-bold text-neutral-900">Smart Recommendations & Security</h3>
            <p className="text-neutral-600 leading-relaxed">
              Implement recommendation algorithms and secure user authentication to protect profiles and data.
            </p>
          </div>
        </div>
      ),
    },
    {
      number: 4,
      title: 'System Features & Modules',
      tagline: 'Tri-Partite Role-Based Access Control Architecture',
      badge: 'SLIDE 4 · Functional Modules',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-5 bg-white border border-neutral-200 rounded-xl space-y-2.5">
            <h3 className="text-sm font-bold text-neutral-900">Job Seeker Module</h3>
            <ul className="space-y-1.5 text-neutral-600">
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Registration & Authentication</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Profile and CV upload</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Advanced search with filters</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Saved jobs bookmarks</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> One-click apply workflow</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Contextual recommendations</li>
            </ul>
          </div>

          <div className="p-5 bg-white border border-neutral-200 rounded-xl space-y-2.5">
            <h3 className="text-sm font-bold text-neutral-900">Employer Module</h3>
            <ul className="space-y-1.5 text-neutral-600">
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Company registration & profile</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Job posting templates</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Applicant tracking system (ATS)</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Shortlisted candidates pipeline</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Interview scheduling & Meet links</li>
            </ul>
          </div>

          <div className="p-5 bg-white border border-neutral-200 rounded-xl space-y-2.5">
            <h3 className="text-sm font-bold text-neutral-900">Admin Module</h3>
            <ul className="space-y-1.5 text-neutral-600">
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> User account authorization</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Job listing moderation & flags</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> System health monitoring</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Audit logs for compliance</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      number: 5,
      title: 'Technologies Used',
      tagline: 'Updated Technology Stack Specification',
      badge: 'SLIDE 5 · Technology Stack',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-5 bg-white border border-neutral-200 rounded-xl space-y-2">
            <span className="font-semibold text-neutral-900 block">Frontend</span>
            <p className="text-neutral-700 font-medium">Next.js 16.2.6 with TypeScript</p>
            <p className="text-neutral-500 leading-relaxed">
              Responsive UI, server/client application architecture, accessible components, and modern App Router full-stack routing.
            </p>
          </div>

          <div className="p-5 bg-white border border-neutral-200 rounded-xl space-y-2">
            <span className="font-semibold text-neutral-900 block">Backend</span>
            <p className="text-neutral-700 font-medium">Next.js with TypeScript</p>
            <p className="text-neutral-500 leading-relaxed">
              Server-side logic, API routes, input validation, matching algorithm, session and token management.
            </p>
          </div>

          <div className="p-5 bg-white border border-neutral-200 rounded-xl space-y-2">
            <span className="font-semibold text-neutral-900 block">Database & Cloud</span>
            <p className="text-neutral-700 font-medium">MySQL with Prisma ORM 7.8.0</p>
            <p className="text-neutral-500 leading-relaxed">
              Relational data storage, type-safe database access, automated migrations, composite indexes for search, and structured data management.
            </p>
          </div>
        </div>
      ),
    },
    {
      number: 6,
      title: 'System Architecture',
      tagline: 'End-to-End Architectural Layering & Data Flow',
      badge: 'SLIDE 6 · System Architecture',
      content: (
        <div className="space-y-4 text-xs">
          <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl space-y-3">
            <div className="grid grid-cols-4 gap-2 text-center font-semibold text-neutral-800">
              <div className="p-3 bg-white border border-neutral-300 rounded-lg">
                <span className="block text-emerald-700">Security</span>
                <span className="text-[10px] text-neutral-500 font-normal">JWT & Hashing</span>
              </div>
              <div className="p-3 bg-white border border-neutral-300 rounded-lg">
                <span className="block text-blue-700">Client</span>
                <span className="text-[10px] text-neutral-500 font-normal">Next.js React UI</span>
              </div>
              <div className="p-3 bg-white border border-neutral-300 rounded-lg">
                <span className="block text-purple-700">REST API</span>
                <span className="text-[10px] text-neutral-500 font-normal">Server Routes</span>
              </div>
              <div className="p-3 bg-white border border-neutral-300 rounded-lg">
                <span className="block text-neutral-900">Database</span>
                <span className="text-[10px] text-neutral-500 font-normal">Prisma + MySQL</span>
              </div>
            </div>
            <p className="text-neutral-600 leading-relaxed pt-1">
              The application follows a modern full-stack architecture. The Next.js application handles the user interface and server-side functionality, while Prisma ORM provides type-safe access to the MySQL database. MySQL stores user profiles, job postings, and application records. Security measures include JWT-based authentication, salted password hashing, server-side validation, and role-based access control.
            </p>
          </div>
        </div>
      ),
    },
    {
      number: 7,
      title: 'Conclusion & Future Enhancements',
      tagline: 'Evaluation, Project Impact & Scalability Roadmap',
      badge: 'SLIDE 7 · Conclusion',
      content: (
        <div className="space-y-4 text-xs">
          <div className="p-4 bg-white border border-neutral-200 rounded-xl space-y-2">
            <h4 className="font-bold text-neutral-900">Project Outcome</h4>
            <p className="text-neutral-600 leading-relaxed">
              A reliable platform that improves recruitment efficiency and broadens access to global job opportunities through intelligent matching and streamlined workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-white border border-neutral-200 rounded-xl space-y-1.5">
              <h4 className="font-bold text-neutral-900">Near-Term Enhancements</h4>
              <p className="text-neutral-600 leading-relaxed">
                AI resume screening, real-time job alerts, push notifications, and a native mobile application for iOS & Android.
              </p>
            </div>
            <div className="p-4 bg-white border border-neutral-200 rounded-xl space-y-1.5">
              <h4 className="font-bold text-neutral-900">Long-Term Vision</h4>
              <p className="text-neutral-600 leading-relaxed">
                Multi-language support, advanced bias-mitigation in recommendations, richer analytics for employers, and federation with third-party HR systems.
              </p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const currentSlide = slides[currentSlideIndex];

  const rawSQLPreview = `-- GlobalHire: MySQL Database Migration Script
-- Computer Science Final Year Project
-- DBMS: MySQL 8.0+

CREATE DATABASE IF NOT EXISTS \`globalhire_db\`;
USE \`globalhire_db\`;

CREATE TABLE IF NOT EXISTS \`User\` (
  \`id\` VARCHAR(191) NOT NULL PRIMARY KEY,
  \`email\` VARCHAR(191) NOT NULL UNIQUE,
  \`passwordHash\` VARCHAR(255) NOT NULL,
  \`role\` ENUM('SEEKER', 'EMPLOYER', 'ADMIN') NOT NULL DEFAULT 'SEEKER',
  \`status\` ENUM('ACTIVE', 'SUSPENDED') NOT NULL DEFAULT 'ACTIVE',
  \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
);

CREATE TABLE IF NOT EXISTS \`Profile\` (
  \`id\` VARCHAR(191) NOT NULL PRIMARY KEY,
  \`userId\` VARCHAR(191) NOT NULL UNIQUE,
  \`fullName\` VARCHAR(191) NOT NULL,
  \`location\` VARCHAR(191) NOT NULL,
  \`timezone\` VARCHAR(50) NOT NULL,
  \`utcOffset\` DOUBLE NOT NULL DEFAULT 0.0,
  \`skills\` JSON NOT NULL,
  \`experienceYears\` INT NOT NULL DEFAULT 0,
  CONSTRAINT \`fk_profile_user\` FOREIGN KEY (\`userId\`) REFERENCES \`User\`(\`id\`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS \`Job\` (
  \`id\` VARCHAR(191) NOT NULL PRIMARY KEY,
  \`companyId\` VARCHAR(191) NOT NULL,
  \`title\` VARCHAR(191) NOT NULL,
  \`skills\` JSON NOT NULL,
  \`salaryMin\` INT NOT NULL,
  \`salaryMax\` INT NOT NULL,
  \`isRemote\` BOOLEAN NOT NULL DEFAULT TRUE,
  INDEX \`idx_job_remote\` (\`isRemote\`)
);

CREATE TABLE IF NOT EXISTS \`Application\` (
  \`id\` VARCHAR(191) NOT NULL PRIMARY KEY,
  \`jobId\` VARCHAR(191) NOT NULL,
  \`seekerId\` VARCHAR(191) NOT NULL,
  \`status\` ENUM('SUBMITTED', 'UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEW_SCHEDULED', 'REJECTED', 'HIRED') NOT NULL,
  \`matchScore\` DOUBLE NOT NULL,
  \`matchBreakdown\` JSON NOT NULL,
  UNIQUE KEY \`uk_job_seeker\` (\`jobId\`, \`seekerId\`)
);`;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-neutral-100 rounded-2xl shadow-2xl border border-neutral-300 overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-5 bg-white border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-neutral-900 tracking-tight">
                Academic Project Defense / Viva Presentation Deck
              </h2>
              <p className="text-[11px] text-neutral-500">
                Computer Science & IT Final Year Project · Slides 1–7 & Architecture
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-lg text-xs">
              <button
                onClick={() => setActiveTab('slides')}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  activeTab === 'slides' ? 'bg-white text-neutral-900 shadow-2xs font-semibold' : 'text-neutral-600'
                }`}
              >
                7 Slides
              </button>
              <button
                onClick={() => setActiveTab('architecture')}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  activeTab === 'architecture' ? 'bg-white text-neutral-900 shadow-2xs font-semibold' : 'text-neutral-600'
                }`}
              >
                System Architecture
              </button>
              <button
                onClick={() => setActiveTab('schema')}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  activeTab === 'schema' ? 'bg-white text-neutral-900 shadow-2xs font-semibold' : 'text-neutral-600'
                }`}
              >
                MySQL / Prisma Schema
              </button>
            </div>

            <button onClick={onClose} className="p-2 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'slides' && (
            <div className="space-y-6">
              {/* Slide Meta Banner */}
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span className="font-mono uppercase font-semibold text-neutral-700">
                  {currentSlide.badge}
                </span>
                <span className="font-mono tabular-nums">
                  Slide {currentSlideIndex + 1} of {slides.length}
                </span>
              </div>

              {/* Slide Content Area */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200/90 shadow-sm min-h-[380px] flex flex-col justify-between">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
                    {currentSlide.title}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1 mb-6">
                    {currentSlide.tagline}
                  </p>
                  {currentSlide.content}
                </div>

                {/* Slide Navigation */}
                <div className="pt-8 border-t border-neutral-100 flex items-center justify-between">
                  <button
                    onClick={() => setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))}
                    disabled={currentSlideIndex === 0}
                    className="px-3.5 py-1.5 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 disabled:opacity-30 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous Slide</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    {slides.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentSlideIndex(i)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          currentSlideIndex === i ? 'w-6 bg-neutral-900' : 'bg-neutral-300'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => setCurrentSlideIndex(Math.min(slides.length - 1, currentSlideIndex + 1))}
                    disabled={currentSlideIndex === slides.length - 1}
                    className="px-3.5 py-1.5 text-xs font-medium text-white bg-neutral-900 hover:bg-neutral-800 disabled:opacity-30 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <span>Next Slide</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="space-y-6 bg-white p-6 rounded-2xl border border-neutral-200">
              <div>
                <h3 className="text-lg font-bold text-neutral-900">System Architecture (Slide 6 Details)</h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Multi-tier decoupled architecture: Client, REST API, Database ORM, and Security Enforcement
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>1. Security Layer</span>
                  </div>
                  <ul className="space-y-1 text-emerald-950">
                    <li>· JWT token-based sessions</li>
                    <li>· Salted password hashing</li>
                    <li>· Role-Based Access Control (RBAC)</li>
                    <li>· Input sanitization & validation</li>
                  </ul>
                </div>

                <div className="p-4 bg-blue-50/50 border border-blue-200 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-blue-900 font-bold">
                    <Layers className="w-4 h-4 text-blue-700" />
                    <span>2. Client Presentation</span>
                  </div>
                  <ul className="space-y-1 text-blue-950">
                    <li>· Next.js 16 App Router</li>
                    <li>· Responsive Tailwind styling</li>
                    <li>· Accessible form inputs</li>
                    <li>· Live match score indicators</li>
                  </ul>
                </div>

                <div className="p-4 bg-purple-50/50 border border-purple-200 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-purple-900 font-bold">
                    <Server className="w-4 h-4 text-purple-700" />
                    <span>3. REST API & Services</span>
                  </div>
                  <ul className="space-y-1 text-purple-950">
                    <li>· Matching algorithm engine</li>
                    <li>· ATS status transition logic</li>
                    <li>· Interview scheduler service</li>
                    <li>· Moderation & compliance audit</li>
                  </ul>
                </div>

                <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-neutral-900 font-bold">
                    <Database className="w-4 h-4 text-neutral-700" />
                    <span>4. Data Persistence</span>
                  </div>
                  <ul className="space-y-1 text-neutral-800">
                    <li>· MySQL 8.0+ Relational DB</li>
                    <li>· Prisma ORM 7.8.0 type safety</li>
                    <li>· Composite indexing on searches</li>
                    <li>· Foreign key cascade constraints</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'schema' && (
            <div className="space-y-4 bg-white p-6 rounded-2xl border border-neutral-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-neutral-900">Database Schema (MySQL with Prisma ORM 7.8.0)</h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Relational schema DDL stored at <code className="font-mono bg-neutral-100 px-1 rounded">prisma/schema.prisma</code> and <code className="font-mono bg-neutral-100 px-1 rounded">prisma/migrations/init.sql</code>
                  </p>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(rawSQLPreview);
                    setCopiedSQL(true);
                    setTimeout(() => setCopiedSQL(false), 2000);
                  }}
                  className="px-3 py-1.5 text-xs font-medium text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  {copiedSQL ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSQL ? 'Copied SQL' : 'Copy DDL'}</span>
                </button>
              </div>

              <div className="bg-neutral-900 text-neutral-200 p-4 rounded-xl overflow-x-auto text-xs font-mono max-h-80">
                <pre>{rawSQLPreview}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
