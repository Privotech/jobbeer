'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Job } from '@/lib/types';
import {
  Search,
  X,
  ArrowRight,
  Sparkles,
  Layers,
  Cloud,
  Brain,
  Database,
  Layout,
  Briefcase,
  MapPin,
  TrendingUp,
} from 'lucide-react';

interface JobCategory {
  id: string;
  name: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  keywords: string[];
  description: string;
}

const POPULAR_CATEGORIES: JobCategory[] = [
  {
    id: 'fullstack',
    name: 'Full-Stack & Web Engineering',
    badge: 'Popular',
    icon: Layers,
    keywords: ['Next.js', 'TypeScript', 'React', 'Node.js', 'Full-Stack', 'Full Stack', 'Web'],
    description: 'Modern App Router, server-side APIs, and responsive design systems',
  },
  {
    id: 'cloud-devops',
    name: 'Cloud, Infrastructure & DevOps',
    badge: 'High Demand',
    icon: Cloud,
    keywords: ['DevOps', 'Cloud', 'Kubernetes', 'Docker', 'AWS', 'SRE', 'Infrastructure'],
    description: 'Container orchestration, CI/CD automation, and multi-region scalability',
  },
  {
    id: 'ai-ml',
    name: 'AI & Machine Learning Engineering',
    badge: 'Emerging',
    icon: Brain,
    keywords: ['AI', 'Machine Learning', 'Python', 'LLM', 'PyTorch', 'FastAPI', 'Neural'],
    description: 'Generative interfaces, algorithmic models, and real-time inference',
  },
  {
    id: 'distributed-backend',
    name: 'Distributed Systems & Data Engineering',
    badge: 'Core',
    icon: Database,
    keywords: ['Backend', 'MySQL', 'Prisma', 'PostgreSQL', 'Redis', 'Database', 'SQL'],
    description: 'Relational data modeling, ACID transactions, and high-throughput pipelines',
  },
  {
    id: 'frontend-design',
    name: 'Frontend & UI Architecture',
    badge: 'Active',
    icon: Layout,
    keywords: ['Frontend', 'UI', 'Tailwind', 'CSS', 'JavaScript', 'Design Systems'],
    description: 'Accessible client-side architecture, micro-interactions, and design tokens',
  },
  {
    id: 'freelance-contract',
    name: 'Freelance & Contract Gigs',
    badge: 'Hourly & Gigs',
    icon: Briefcase,
    keywords: ['Freelance', 'Contract', 'Gig', 'Contractor', 'Hourly', 'Consulting'],
    description: 'Milestone projects, hourly consulting ($/hr), and independent contractor contracts',
  },
];

const TRENDING_KEYWORDS = [
  'Freelance Gigs',
  'Next.js 16',
  'TypeScript',
  'MySQL & Prisma',
  'Cloud DevOps',
  'AI Engineer',
  'Remote Worldwide',
];

interface PredictiveSearchBarProps {
  jobs: Job[];
  onSearch: (query: string) => void;
  onSelectJob?: (job: Job) => void;
  className?: string;
}

export default function PredictiveSearchBar({
  jobs,
  onSearch,
  onSelectJob,
  className = '',
}: PredictiveSearchBarProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter Categories matching user query
  const matchingCategories = useMemo(() => {
    if (!query.trim()) {
      return POPULAR_CATEGORIES;
    }
    const q = query.toLowerCase().trim();
    return POPULAR_CATEGORIES.filter((cat) => {
      const matchName = cat.name.toLowerCase().includes(q);
      const matchDesc = cat.description.toLowerCase().includes(q);
      const matchKey = cat.keywords.some((k) => k.toLowerCase().includes(q));
      return matchName || matchDesc || matchKey;
    });
  }, [query]);

  // Real-time matching jobs from props
  const matchingJobs = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return jobs
      .filter((j) => {
        const matchTitle = j.title.toLowerCase().includes(q);
        const matchDept = j.department.toLowerCase().includes(q);
        const matchComp = j.company?.name.toLowerCase().includes(q);
        const matchSkills = j.skills.some((s) => s.toLowerCase().includes(q));
        return matchTitle || matchDept || matchComp || matchSkills;
      })
      .slice(0, 3);
  }, [query, jobs]);

  // Compute job count per category
  const getCategoryCount = (category: JobCategory) => {
    return jobs.filter((j) => {
      return category.keywords.some(
        (kw) =>
          j.title.toLowerCase().includes(kw.toLowerCase()) ||
          j.department.toLowerCase().includes(kw.toLowerCase()) ||
          j.skills.some((s) => s.toLowerCase().includes(kw.toLowerCase()))
      );
    }).length;
  };

  const handleSelectCategory = (category: JobCategory) => {
    setQuery(category.name);
    setIsOpen(false);
    onSearch(category.name);
  };

  const handleSelectKeyword = (keyword: string) => {
    setQuery(keyword);
    setIsOpen(false);
    onSearch(keyword);
  };

  const handleSelectSpecificJob = (job: Job) => {
    setIsOpen(false);
    if (onSelectJob) {
      onSelectJob(job);
    } else {
      onSearch(job.title);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOpen(false);
    onSearch(query);
  };

  return (
    <div ref={containerRef} className={`relative w-full max-w-2xl ${className}`}>
      {/* Search Input Bar */}
      <form onSubmit={handleFormSubmit} className="relative z-30">
        <div className="relative flex items-center bg-white rounded-2xl border border-neutral-300 hover:border-neutral-400 focus-within:border-neutral-900 focus-within:ring-2 focus-within:ring-neutral-900/10 shadow-sm transition-all duration-200">
          <div className="pl-4 pr-2 text-neutral-400">
            <Search className="w-4 h-4" />
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (!isOpen) setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Search roles, skills, or global tech stacks (e.g. Next.js, Cloud, AI)..."
            className="w-full py-3.5 pr-20 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 bg-transparent border-0 focus:outline-hidden focus:ring-0"
          />

          {/* Clear Button */}
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setIsOpen(true);
              }}
              className="p-1.5 mr-1 text-neutral-400 hover:text-neutral-700 rounded-md transition-colors"
              aria-label="Clear search input"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Submit Action Button */}
          <div className="pr-1.5">
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl transition-all shadow-xs flex items-center gap-1.5 shrink-0"
            >
              <span>Explore</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </form>

      {/* Predictive Suggestions Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 z-40 bg-white rounded-2xl border border-neutral-200/90 shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 text-xs divide-y divide-neutral-100 max-h-[440px] overflow-y-auto">
          
          {/* SECTION 1: POPULAR / MATCHING CATEGORIES */}
          <div className="p-3">
            <div className="flex items-center justify-between px-2 pb-2 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider font-mono">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-neutral-500" />
                <span>{query ? 'Matching Categories' : 'Popular Job Categories'}</span>
              </span>
              <span>{matchingCategories.length} categories</span>
            </div>

            <div className="space-y-1">
              {matchingCategories.map((category) => {
                const Icon = category.icon;
                const count = getCategoryCount(category);
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => handleSelectCategory(category)}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-neutral-50 border border-transparent hover:border-neutral-200/70 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-neutral-100 group-hover:bg-neutral-900 group-hover:text-white transition-colors flex items-center justify-center text-neutral-700 shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-neutral-900 group-hover:text-neutral-950">
                            {category.name}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-600 font-mono">
                            {category.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-500 line-clamp-1 mt-0.5">
                          {category.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pl-2 shrink-0">
                      <span className="text-[11px] font-mono text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-md">
                        {count} {count === 1 ? 'role' : 'roles'}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-neutral-300 group-hover:text-neutral-800 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </button>
                );
              })}

              {matchingCategories.length === 0 && (
                <div className="py-4 text-center text-neutral-500 text-xs">
                  No predefined category found. Press Enter to search custom keyword &ldquo;{query}&rdquo;.
                </div>
              )}
            </div>
          </div>

          {/* SECTION 2: LIVE MATCHING POSITIONS (IF QUERY ENTERED) */}
          {query.trim().length > 1 && matchingJobs.length > 0 && (
            <div className="p-3 bg-neutral-50/50">
              <div className="flex items-center justify-between px-2 pb-2 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider font-mono">
                <span className="flex items-center gap-1.5">
                  <Briefcase className="w-3 h-3 text-neutral-500" />
                  <span>Direct Role Matches</span>
                </span>
                <span>{matchingJobs.length} live roles</span>
              </div>

              <div className="space-y-1.5">
                {matchingJobs.map((job) => (
                  <button
                    key={job.id}
                    type="button"
                    onClick={() => handleSelectSpecificJob(job)}
                    className="w-full text-left p-2.5 bg-white rounded-xl border border-neutral-200/80 hover:border-neutral-900 transition-all flex items-center justify-between group"
                  >
                    <div>
                      <div className="font-semibold text-neutral-900">{job.title}</div>
                      <div className="flex items-center gap-2 text-[11px] text-neutral-500 mt-0.5">
                        <span className="font-medium text-neutral-700">{job.company?.name}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{job.isRemote ? 'Worldwide Remote' : job.location}</span>
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0 pl-3">
                      <span className="font-mono text-xs font-semibold text-neutral-900">
                        ${(job.salaryMin / 1000).toFixed(0)}k – ${(job.salaryMax / 1000).toFixed(0)}k
                      </span>
                      <span className="block text-[10px] text-emerald-700 font-medium">View vacancy</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 3: TRENDING TECHNOLOGIES */}
          <div className="p-3 bg-white">
            <div className="px-2 pb-2 flex items-center gap-1.5 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider font-mono">
              <TrendingUp className="w-3 h-3 text-neutral-500" />
              <span>Trending Tech Stacks & Filters</span>
            </div>
            <div className="flex flex-wrap gap-1.5 px-2">
              {TRENDING_KEYWORDS.map((kw) => (
                <button
                  key={kw}
                  type="button"
                  onClick={() => handleSelectKeyword(kw)}
                  className="px-2.5 py-1 text-xs font-mono text-neutral-700 bg-neutral-100 hover:bg-neutral-900 hover:text-white rounded-lg transition-colors"
                >
                  {kw}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* QUICK SUGGESTION PILLS BELOW THE SEARCH BAR */}
      <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-xs text-neutral-500">
        <span className="font-medium text-neutral-400 text-[11px]">Popular:</span>
        {['Full-Stack Next.js', 'Cloud SRE', 'AI Interface', 'MySQL & Prisma'].map((label) => (
          <button
            key={label}
            type="button"
            onClick={() => {
              setQuery(label);
              onSearch(label);
            }}
            className="text-[11px] font-medium text-neutral-600 hover:text-neutral-950 underline underline-offset-2 transition-colors"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
