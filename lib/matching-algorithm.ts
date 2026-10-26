import { Job, Profile, MatchBreakdown } from './types';

/**
 * Calculates working hours overlap between two UTC offsets.
 * Assumes a standard 8-hour workday (09:00 - 17:00 local time).
 */
export function calculateWorkingHoursOverlap(offsetA: number, offsetB: number): number {
  // Candidate work hours in UTC: [9 - offsetA, 17 - offsetA]
  const startA = (9 - offsetA + 24) % 24;
  const endA = startA + 8; // could extend past 24

  // Team work hours in UTC: [9 - offsetB, 17 - offsetB]
  const startB = (9 - offsetB + 24) % 24;
  const endB = startB + 8;

  // Check overlap across a 24-hour cycle
  let overlapCount = 0;
  for (let hour = 0; hour < 24; hour++) {
    const inA = (startA <= endA)
      ? (hour >= startA && hour < endA)
      : (hour >= startA || hour < (endA % 24));

    const inB = (startB <= endB)
      ? (hour >= startB && hour < endB)
      : (hour >= startB || hour < (endB % 24));

    if (inA && inB) {
      overlapCount++;
    }
  }

  return overlapCount;
}

/**
 * Maps experience levels to approximate baseline required years.
 */
function getTargetYearsForLevel(level: string): number {
  switch (level) {
    case 'ENTRY':
      return 1;
    case 'MID':
      return 3;
    case 'SENIOR':
      return 5;
    case 'LEAD':
      return 8;
    case 'EXECUTIVE':
      return 10;
    default:
      return 3;
  }
}

/**
 * Core Intelligent Recommendation Engine
 * Computes multi-attribute weighted match score between candidate profile and job requirements.
 * 
 * Weights:
 * - Skill match: 45%
 * - Experience fit: 20%
 * - Timezone overlap: 20%
 * - Work mode / remote fit: 15%
 */
export function calculateMatchScore(profile: Profile, job: Job): MatchBreakdown {
  // Normalize candidate skills
  const candidateSkills = (profile.skills || []).map((s) => s.trim().toLowerCase());
  const requiredSkills = (job.skills || []).map((s) => s.trim().toLowerCase());
  const niceToHaveSkills = (job.niceToHave || []).map((s) => s.trim().toLowerCase());

  // 1. Skill Matching (45% weight)
  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  for (const req of requiredSkills) {
    const hasSkill = candidateSkills.some(
      (c) => c === req || c.includes(req) || req.includes(c)
    );
    if (hasSkill) {
      matchedSkills.push(req);
    } else {
      missingSkills.push(req);
    }
  }

  const niceToHaveMatched = niceToHaveSkills.filter((nth) =>
    candidateSkills.some((c) => c === nth || c.includes(nth) || nth.includes(c))
  );

  const reqScore = requiredSkills.length > 0 ? (matchedSkills.length / requiredSkills.length) * 100 : 100;
  const bonusScore = niceToHaveSkills.length > 0 ? (niceToHaveMatched.length / niceToHaveSkills.length) * 15 : 0;
  const rawSkillScore = Math.min(100, Math.round(reqScore * 0.9 + bonusScore));

  // 2. Experience Fit (20% weight)
  const targetYears = getTargetYearsForLevel(job.experienceLevel);
  const candYears = profile.experienceYears || 0;
  const expDiff = candYears - targetYears;

  let experienceScore = 100;
  if (expDiff >= 0) {
    // Meets or exceeds requirement
    experienceScore = 100;
  } else if (expDiff === -1) {
    experienceScore = 80;
  } else if (expDiff === -2) {
    experienceScore = 60;
  } else {
    experienceScore = Math.max(30, 100 - Math.abs(expDiff) * 20);
  }

  // 3. Timezone Overlap (20% weight)
  const candidateOffset = profile.utcOffset ?? 0;
  const teamOffset = job.targetUtcOffset ?? 0;
  const overlapHours = calculateWorkingHoursOverlap(candidateOffset, teamOffset);
  const minRequiredOverlap = job.minOverlapHours || 4;

  let timezoneScore = 100;
  if (overlapHours >= minRequiredOverlap + 2) {
    timezoneScore = 100;
  } else if (overlapHours >= minRequiredOverlap) {
    timezoneScore = 90;
  } else if (overlapHours >= minRequiredOverlap - 2) {
    timezoneScore = 70;
  } else {
    timezoneScore = Math.max(25, (overlapHours / minRequiredOverlap) * 60);
  }

  // 4. Remote / Location Fit (15% weight)
  let remoteScore = 100;
  if (job.isRemote) {
    remoteScore = 100; // Global remote friendly
  } else {
    // If onsite or hybrid, check if locations match
    const locMatch = profile.location.toLowerCase().includes(job.location.toLowerCase()) ||
                     job.location.toLowerCase().includes(profile.location.toLowerCase());
    if (locMatch) {
      remoteScore = 100;
    } else if (profile.workPreference === 'REMOTE') {
      remoteScore = 30; // Candidate prefers remote but job is location-locked
    } else {
      remoteScore = 50;
    }
  }

  // Compute composite score
  const composite = (rawSkillScore * 0.45) +
                    (experienceScore * 0.20) +
                    (timezoneScore * 0.20) +
                    (remoteScore * 0.15);

  const overallScore = Math.min(99, Math.max(35, Math.round(composite)));

  let tier: 'High Match' | 'Good Match' | 'Moderate Match' | 'Low Match' = 'Moderate Match';
  if (overallScore >= 85) tier = 'High Match';
  else if (overallScore >= 70) tier = 'Good Match';
  else if (overallScore >= 50) tier = 'Moderate Match';
  else tier = 'Low Match';

  // Build qualitative rationale
  const rationaleParts: string[] = [];
  if (matchedSkills.length === requiredSkills.length && requiredSkills.length > 0) {
    rationaleParts.push(`All ${requiredSkills.length} core technical requirements matched`);
  } else {
    rationaleParts.push(`${matchedSkills.length}/${requiredSkills.length} required skills matched`);
  }

  if (overlapHours >= minRequiredOverlap) {
    rationaleParts.push(`${overlapHours}h daily timezone overlap (requires ≥${minRequiredOverlap}h)`);
  } else {
    rationaleParts.push(`${overlapHours}h timezone overlap (limited window)`);
  }

  if (expDiff >= 0) {
    rationaleParts.push(`${candYears}y experience aligns with ${job.experienceLevel} level`);
  }

  return {
    overallScore,
    tier,
    skillScore: rawSkillScore,
    matchedSkills,
    missingSkills,
    experienceScore,
    experienceDifference: expDiff,
    timezoneScore: Math.round(timezoneScore),
    overlapHours,
    remoteScore,
    rationale: rationaleParts.join(' · '),
  };
}
