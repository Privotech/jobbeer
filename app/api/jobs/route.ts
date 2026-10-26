import { NextRequest, NextResponse } from 'next/server';
import { repository } from '@/lib/repository';
import { calculateMatchScore } from '@/lib/matching-algorithm';
import { JobFilterParams } from '@/lib/types';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query') || undefined;
  const isRemote = searchParams.get('isRemote') || undefined;
  const employmentType = searchParams.get('employmentType') || undefined;
  const experienceLevel = searchParams.get('experienceLevel') || undefined;
  const minSalary = searchParams.get('minSalary') ? parseInt(searchParams.get('minSalary')!) : undefined;
  const maxSalary = searchParams.get('maxSalary') ? parseInt(searchParams.get('maxSalary')!) : undefined;
  const companyId = searchParams.get('companyId') || undefined;
  const includeModeration = searchParams.get('includeModeration') === 'true';

  const filterParams: JobFilterParams = {
    query,
    isRemote,
    employmentType,
    experienceLevel,
    minSalary,
    maxSalary,
    moderationStatus: includeModeration ? undefined : 'APPROVED',
  };

  let jobs = repository.getJobs(filterParams);

  if (companyId) {
    jobs = jobs.filter((j) => j.companyId === companyId);
  }

  // If candidate is logged in, attach their smart match computation to each job!
  const current = repository.getCurrentUser();
  if (current.profile && current.user) {
    const jobsWithScores = jobs.map((job) => {
      const match = calculateMatchScore(current.profile!, job);
      return {
        ...job,
        matchScore: match.overallScore,
        matchBreakdown: match,
        isSaved: repository.isJobSaved(current.user!.id, job.id),
      };
    });

    return NextResponse.json({ jobs: jobsWithScores });
  }

  return NextResponse.json({ jobs });
}

export async function POST(req: NextRequest) {
  try {
    const current = repository.getCurrentUser();
    if (!current.user || (current.user.role !== 'EMPLOYER' && current.user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Only employers or administrators can post jobs.' }, { status: 403 });
    }

    const body = await req.json();
    const {
      title,
      department,
      description,
      requirements,
      niceToHave,
      skills,
      employmentType,
      experienceLevel,
      location,
      isRemote,
      timezoneRequirement,
      targetUtcOffset,
      minOverlapHours,
      salaryMin,
      salaryMax,
      currency,
    } = body;

    if (!title || !description || !skills || skills.length === 0) {
      return NextResponse.json({ error: 'Title, description, and at least one skill are required.' }, { status: 400 });
    }

    const companyId = current.company?.id || 'comp_cloudscale';

    const newJob = repository.createJob(
      {
        companyId,
        title,
        department: department || 'Engineering',
        description,
        requirements: Array.isArray(requirements) ? requirements : [requirements],
        niceToHave: Array.isArray(niceToHave) ? niceToHave : [],
        skills: Array.isArray(skills) ? skills : [skills],
        employmentType: employmentType || 'FULL_TIME',
        experienceLevel: experienceLevel || 'MID',
        location: location || 'Remote',
        isRemote: isRemote ?? true,
        timezoneRequirement: timezoneRequirement || 'Flexible',
        targetUtcOffset: targetUtcOffset ?? (current.profile?.utcOffset || 0),
        minOverlapHours: minOverlapHours ?? 4,
        salaryMin: Number(salaryMin) || 80000,
        salaryMax: Number(salaryMax) || 120000,
        currency: currency || 'USD',
        status: 'OPEN',
        moderationStatus: 'APPROVED',
        featured: false,
      },
      current.user.email
    );

    return NextResponse.json({ job: newJob }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create job posting' }, { status: 500 });
  }
}
