import { Worker, Shift, MatchBreakdown } from '../types';

/**
 * Calculates Great-circle distance between two geographic coordinates using Haversine formula (km)
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371.0; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Computes individual component scores and final weighted match score
 * Formula:
 * Match Score = (0.30 * Availability) + (0.25 * Skill Match) + (0.20 * Distance) + (0.15 * Reliability) + (0.10 * Experience)
 */
export function computeMatchScore(worker: Worker, shift: Partial<Shift>): MatchBreakdown {
  // 1. Availability Score (0 - 100)
  let availabilityScore = 0;
  if (worker.availabilityStatus === 'Available Now') {
    availabilityScore = 100;
  } else if (worker.availabilityStatus === 'Available Later') {
    availabilityScore = 60;
  } else {
    availabilityScore = 0;
  }

  // 2. Skill Match Score (Percentage of required skills matched)
  const reqSkills = shift.requiredSkills || [];
  const workerSkillsLower = (worker.skills || []).map((s) => s.toLowerCase());
  
  const matchingSkills: string[] = [];
  const missingSkills: string[] = [];

  if (reqSkills.length > 0) {
    reqSkills.forEach((skill) => {
      if (workerSkillsLower.includes(skill.toLowerCase())) {
        matchingSkills.push(skill);
      } else {
        missingSkills.push(skill);
      }
    });
    var skillScore = (matchingSkills.length / reqSkills.length) * 100;
  } else {
    var skillScore = 100;
  }

  // 3. Distance Score (100 at 0km, scaling linearly to 0 at 20km radius)
  const shiftLat = shift.location?.latitude ?? 40.748817;
  const shiftLon = shift.location?.longitude ?? -73.985130;
  const workerLat = worker.location?.latitude ?? 40.745817;
  const workerLon = worker.location?.longitude ?? -73.981130;

  const distanceKm = calculateDistanceKm(shiftLat, shiftLon, workerLat, workerLon);
  const maxRadiusKm = 20.0;
  const distanceScore = Math.max(0, (1.0 - distanceKm / maxRadiusKm) * 100);

  // 4. Reliability Score (0 - 100)
  const reliabilityScore = Math.min(100, Math.max(0, worker.reliabilityScore || 90));

  // 5. Experience Score (Cap at 5 years = 100%)
  const experienceYears = worker.experienceYears || 0;
  const experienceScore = Math.min(100, (experienceYears / 5.0) * 100);

  // Weighted Composite Score
  const totalScore =
    0.30 * availabilityScore +
    0.25 * skillScore +
    0.20 * distanceScore +
    0.15 * reliabilityScore +
    0.10 * experienceScore;

  return {
    worker,
    totalScore: Math.round(totalScore * 10) / 10,
    availabilityScore: Math.round(availabilityScore),
    skillScore: Math.round(skillScore),
    distanceScore: Math.round(distanceScore),
    reliabilityScore: Math.round(reliabilityScore),
    experienceScore: Math.round(experienceScore),
    distanceKm,
    matchingSkills,
    missingSkills,
  };
}

/**
 * Rank all workers for a specific shift in descending order of match score
 */
export function rankWorkersForShift(workers: Worker[], shift: Partial<Shift>): MatchBreakdown[] {
  const scored = workers.map((worker) => computeMatchScore(worker, shift));
  return scored.sort((a, b) => b.totalScore - a.totalScore);
}
