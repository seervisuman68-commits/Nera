/**
 * Reliability Score Engine for NERA
 * Calculates worker reliability percentage based on real historical performance:
 * - Attendance & Completion (40% weight)
 * - Punctuality & On-Time arrivals (35% weight)
 * - Low Cancellation Rate (25% weight)
 */

export interface ReliabilityFactors {
  totalCompletedShifts: number;
  totalAssignedShifts: number;
  onTimeArrivals: number;
  cancellations: number;
  lateArrivals: number;
  noShows: number;
}

export function calculateReliabilityScore(factors: ReliabilityFactors): number {
  if (factors.totalAssignedShifts === 0) return 95.0; // Baseline initial score for new verified worker

  // 1. Completion Ratio (0 - 100)
  const completionRatio = Math.max(0, (factors.totalCompletedShifts / factors.totalAssignedShifts) * 100);

  // 2. Punctuality Ratio (0 - 100)
  const punctualityRatio =
    factors.totalCompletedShifts > 0
      ? Math.max(0, (factors.onTimeArrivals / factors.totalCompletedShifts) * 100)
      : 100;

  // 3. Penalty for cancellations & no-shows
  const cancellationPenalty = (factors.cancellations * 10) + (factors.noShows * 25);
  const cancellationFactor = Math.max(0, 100 - cancellationPenalty);

  const weightedScore =
    0.40 * completionRatio +
    0.35 * punctualityRatio +
    0.25 * cancellationFactor;

  return Math.min(100, Math.max(10, Math.round(weightedScore * 10) / 10));
}

export function getReliabilityTier(score: number): {
  tier: 'Elite' | 'High' | 'Good' | 'Needs Improvement';
  color: string;
  badge: string;
} {
  if (score >= 95) {
    return { tier: 'Elite', color: 'emerald', badge: 'Verified Elite ⚡' };
  } else if (score >= 88) {
    return { tier: 'High', color: 'blue', badge: 'High Reliability 🛡️' };
  } else if (score >= 75) {
    return { tier: 'Good', color: 'amber', badge: 'Good Standing 👍' };
  } else {
    return { tier: 'Needs Improvement', color: 'rose', badge: 'Under Review ⚠️' };
  }
}
