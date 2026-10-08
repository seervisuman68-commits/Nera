export type UserRole = 'business' | 'worker' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  avatar: string;
  createdAt: string;
}

export interface Business {
  id: string;
  userId: string;
  companyName: string;
  category: 'café' | 'restaurant' | 'retail' | 'warehouse' | 'salon' | 'other';
  address: string;
  location: {
    latitude: number;
    longitude: number;
  };
  totalSpent: number;
  shiftsPosted: number;
  logo: string;
  contactPerson: string;
  ratingAvg: number;
}

export type AvailabilityStatus = 'Available Now' | 'Available Later' | 'Unavailable';

export interface Worker {
  id: string;
  userId: string;
  name: string;
  role: string;
  avatar: string;
  phone: string;
  bio: string;
  skills: string[];
  experienceYears: number;
  reliabilityScore: number; // 0 - 100%
  isAvailable: boolean;
  availabilityStatus: AvailabilityStatus;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  verificationStatus: 'verified' | 'pending' | 'rejected';
  ratingAvg: number;
  totalRatings: number;
  totalShiftsCompleted: number;
  hourlyRate: number;
  badges: string[];
  punctualityRate: number; // e.g. 98%
  completionRate: number;  // e.g. 100%
  cancellationRate: number;// e.g. 0%
  earningsTotal: number;
  activeShiftId?: string;
}

export type ShiftStatus = 'open' | 'cascading' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
export type ShiftUrgency = 'EMERGENCY (Immediate)' | 'Today' | 'Tomorrow';

export interface CascadeCandidate {
  workerId: string;
  workerName: string;
  workerAvatar: string;
  matchScore: number;
  status: 'pending' | 'offered' | 'rejected' | 'accepted' | 'expired';
  offeredAt?: string;
  expiresAt?: string;
}

export interface Shift {
  id: string;
  businessId: string;
  businessName: string;
  businessCategory: string;
  role: string;
  requiredSkills: string[];
  date: string;
  startTime: string;
  endTime: string;
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  payAmount: number;
  hourlyRate: number;
  platformFee: number; // 10%
  totalCost: number;
  urgency: ShiftUrgency;
  notes: string;
  status: ShiftStatus;
  assignedWorkerId?: string;
  assignedWorkerName?: string;
  backupWorkerId?: string;
  backupWorkerName?: string;
  cascadeCandidates: CascadeCandidate[];
  currentCascadeIndex: number;
  qrCodeSecret: string;
  checkInTime?: string;
  checkOutTime?: string;
  createdAt: string;
}

export interface MatchBreakdown {
  worker: Worker;
  totalScore: number;
  availabilityScore: number; // 30%
  skillScore: number;        // 25%
  distanceScore: number;     // 20%
  reliabilityScore: number;  // 15%
  experienceScore: number;   // 10%
  distanceKm: number;
  matchingSkills: string[];
  missingSkills: string[];
}

export interface AttendanceRecord {
  id: string;
  shiftId: string;
  workerId: string;
  workerName: string;
  businessId: string;
  businessName: string;
  role: string;
  checkInTime: string;
  checkOutTime?: string;
  status: 'checked_in' | 'completed' | 'late' | 'no_show';
  verifiedBy: 'qr_scan' | 'manual_override';
  locationVerified: boolean;
  date: string;
}

export interface Rating {
  id: string;
  shiftId: string;
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  toUserName: string;
  rating: number; // 1-5
  review: string;
  tags: string[];
  createdAt: string;
}

export interface PlatformAnalytics {
  totalShifts: number;
  completedShifts: number;
  activeShifts: number;
  averageMatchTimeSeconds: number;
  fillRatePercentage: number;
  totalVolumeGross: number;
  platformRevenueFee: number; // 10%
  totalWorkers: number;
  totalBusinesses: number;
  averageReliability: number;
}
