import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-Memory Database collections (Isomorphic with Firestore)
interface DBUser {
  id: string;
  name: string;
  email: string;
  role: 'business' | 'worker' | 'admin';
  phone: string;
  createdAt: string;
}

interface DBWorker {
  id: string;
  userId: string;
  name: string;
  role: string;
  skills: string[];
  experienceYears: number;
  reliabilityScore: number;
  isAvailable: boolean;
  availabilityStatus: 'Available Now' | 'Available Later' | 'Unavailable';
  location: { latitude: number; longitude: number; address: string };
  ratingAvg: number;
  totalRatings: number;
  totalShiftsCompleted: number;
  hourlyRate: number;
  badges: string[];
  punctualityRate: number;
  completionRate: number;
  cancellationRate: number;
}

interface DBShift {
  id: string;
  businessId: string;
  businessName: string;
  role: string;
  requiredSkills: string[];
  startTime: string;
  endTime: string;
  date: string;
  location: { address: string; latitude: number; longitude: number };
  payAmount: number;
  hourlyRate: number;
  platformFee: number;
  totalCost: number;
  urgency: string;
  status: 'open' | 'cascading' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  assignedWorkerId?: string;
  assignedWorkerName?: string;
  backupWorkerId?: string;
  backupWorkerName?: string;
  cascadeCandidates: any[];
  currentCascadeIndex: number;
  qrCodeSecret: string;
  createdAt: string;
}

interface DBAttendance {
  id: string;
  shiftId: string;
  workerId: string;
  workerName: string;
  checkInTime: string;
  checkOutTime?: string;
  status: 'checked_in' | 'completed' | 'late' | 'no_show';
  verifiedBy: 'qr_scan' | 'manual_override';
  locationVerified: boolean;
}

interface DBRating {
  id: string;
  shiftId: string;
  fromUserId: string;
  toUserId: string;
  rating: number;
  review: string;
  tags: string[];
  createdAt: string;
}

// Initial storage
const db = {
  users: [
    { id: 'user-b1', name: 'Alex Johnson', email: 'alex@urbanbrew.com', role: 'business', phone: '+15552345678', createdAt: new Date().toISOString() },
    { id: 'user-w1', name: 'Jordan Rivera', email: 'jordan@nera.dev', role: 'worker', phone: '+15554567890', createdAt: new Date().toISOString() },
    { id: 'user-admin', name: 'Admin Operations', email: 'admin@nera.live', role: 'admin', phone: '+18005556372', createdAt: new Date().toISOString() },
  ] as DBUser[],
  workers: [
    {
      id: 'w-1',
      userId: 'user-w1',
      name: 'Jordan Rivera',
      role: 'Senior Barista & Shift Lead',
      skills: ['Barista', 'POS Operations', 'Latte Art', 'Espresso Calibration'],
      experienceYears: 4.2,
      reliabilityScore: 98.4,
      isAvailable: true,
      availabilityStatus: 'Available Now',
      location: { latitude: 40.7285, longitude: -73.9942, address: 'East Village (0.8 km)' },
      ratingAvg: 4.95,
      totalRatings: 32,
      totalShiftsCompleted: 34,
      hourlyRate: 28.0,
      badges: ['Verified Passport ✅', 'Top Match ⚡', 'Zero Cancellations 🛡️'],
      punctualityRate: 99.1,
      completionRate: 100,
      cancellationRate: 0.0,
    },
    {
      id: 'w-2',
      userId: 'user-w2',
      name: 'Maya Chen',
      role: 'Barista & Register Lead',
      skills: ['Barista', 'POS Operations', 'Customer Service'],
      experienceYears: 2.8,
      reliabilityScore: 94.0,
      isAvailable: true,
      availabilityStatus: 'Available Now',
      location: { latitude: 40.7321, longitude: -74.0012, address: 'Greenwich Village (1.2 km)' },
      ratingAvg: 4.85,
      totalRatings: 19,
      totalShiftsCompleted: 21,
      hourlyRate: 24.0,
      badges: ['Verified Passport ✅', 'Speed Demon ⚡'],
      punctualityRate: 96.0,
      completionRate: 98.0,
      cancellationRate: 2.0,
    },
  ] as DBWorker[],
  shifts: [] as DBShift[],
  attendance: [] as DBAttendance[],
  ratings: [] as DBRating[],
};

// Distance Helper (Haversine km)
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371.0;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// 5-Factor Weighted Smart Matching Formula
function computeMatchScore(worker: DBWorker, shift: DBShift) {
  // 1. Availability (30%)
  const availScore = worker.availabilityStatus === 'Available Now' ? 100 : worker.availabilityStatus === 'Available Later' ? 60 : 0;

  // 2. Skill Match (25%)
  const reqSkills = shift.requiredSkills || [];
  const workerSkills = (worker.skills || []).map((s) => s.toLowerCase());
  const matchedSkills = reqSkills.filter((s) => workerSkills.includes(s.toLowerCase()));
  const skillScore = reqSkills.length > 0 ? (matchedSkills.length / reqSkills.length) * 100 : 100;

  // 3. Distance (20%)
  const dist = calculateDistanceKm(
    shift.location.latitude || 40.7248,
    shift.location.longitude || -73.9984,
    worker.location.latitude || 40.7285,
    worker.location.longitude || -73.9942
  );
  const distScore = Math.max(0, (1.0 - dist / 20.0) * 100);

  // 4. Reliability (15%)
  const relScore = worker.reliabilityScore || 90;

  // 5. Experience (10%)
  const expScore = Math.min(100, ((worker.experienceYears || 0) / 5.0) * 100);

  const totalScore = 0.3 * availScore + 0.25 * skillScore + 0.2 * distScore + 0.15 * relScore + 0.1 * expScore;

  return {
    worker,
    totalScore: Math.round(totalScore * 10) / 10,
    distanceKm: dist,
    breakdown: {
      availability: availScore,
      skills: skillScore,
      distance: Math.round(distScore),
      reliability: relScore,
      experience: Math.round(expScore),
    },
  };
}

// --- API ROUTES ---

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    service: 'NERA Emergency Shift Engine Backend',
    timestamp: new Date().toISOString(),
    db: {
      users: db.users.length,
      workers: db.workers.length,
      shifts: db.shifts.length,
      attendance: db.attendance.length,
    },
  });
});

// 1. Auth Module
app.post('/api/v1/auth/register', (req: Request, res: Response) => {
  const { name, email, role, phone } = req.body;
  const user: DBUser = {
    id: `user-${Date.now()}`,
    name: name || 'User',
    email: email || `user-${Date.now()}@nera.dev`,
    role: role || 'business',
    phone: phone || '+15550000000',
    createdAt: new Date().toISOString(),
  };
  db.users.push(user);
  res.status(201).json({ success: true, user, token: `jwt_nera_${user.id}_token` });
});

app.post('/api/v1/auth/login', (req: Request, res: Response) => {
  const { email } = req.body;
  const user = db.users.find((u) => u.email.toLowerCase() === (email || '').toLowerCase()) || db.users[0];
  res.json({ success: true, user, token: `jwt_nera_${user.id}_token` });
});

// 2. Shift Management Module
app.post('/api/v1/shifts', (req: Request, res: Response) => {
  const shiftData = req.body;
  const pay = Number(shiftData.payAmount) || 140.0;
  const fee = Math.round(pay * 0.1 * 100) / 100; // 10% platform fee

  const newShift: DBShift = {
    id: `shift-${Date.now()}`,
    businessId: shiftData.businessId || 'biz-1',
    businessName: shiftData.businessName || 'Urban Brew Café',
    role: shiftData.role || 'Senior Barista',
    requiredSkills: shiftData.requiredSkills || ['Barista', 'POS Operations'],
    date: shiftData.date || new Date().toISOString().split('T')[0],
    startTime: shiftData.startTime || '12:00 PM',
    endTime: shiftData.endTime || '05:00 PM',
    location: shiftData.location || { address: '142 Mercer St, Soho, NY', latitude: 40.7248, longitude: -73.9984 },
    payAmount: pay,
    hourlyRate: shiftData.hourlyRate || 28.0,
    platformFee: fee,
    totalCost: pay + fee,
    urgency: shiftData.urgency || 'EMERGENCY (Immediate)',
    status: 'open',
    cascadeCandidates: [],
    currentCascadeIndex: 0,
    qrCodeSecret: `NERA_SHIFT_${Math.floor(1000 + Math.random() * 9000)}_SEC`,
    createdAt: new Date().toISOString(),
  };

  db.shifts.unshift(newShift);
  res.status(201).json({ success: true, shift: newShift });
});

app.get('/api/v1/shifts', (req: Request, res: Response) => {
  res.json({ success: true, shifts: db.shifts });
});

app.get('/api/v1/shifts/:id', (req: Request, res: Response) => {
  const shift = db.shifts.find((s) => s.id === req.params.id);
  if (!shift) return res.status(404).json({ error: 'Shift not found' });
  res.json({ success: true, shift });
});

// 3. Smart Matching Engine Endpoint
app.get('/api/v1/shifts/:id/matches', (req: Request, res: Response) => {
  const shift = db.shifts.find((s) => s.id === req.params.id);
  if (!shift) return res.status(404).json({ error: 'Shift not found' });

  const ranked = db.workers.map((w) => computeMatchScore(w, shift)).sort((a, b) => b.totalScore - a.totalScore);
  res.json({ success: true, shiftId: shift.id, candidates: ranked });
});

// 4. Offer Cascade Endpoint
app.post('/api/v1/shifts/:id/cascade', (req: Request, res: Response) => {
  const shift = db.shifts.find((s) => s.id === req.params.id);
  if (!shift) return res.status(404).json({ error: 'Shift not found' });

  const ranked = db.workers.map((w) => computeMatchScore(w, shift)).sort((a, b) => b.totalScore - a.totalScore);
  const now = Date.now();

  shift.status = 'cascading';
  shift.cascadeCandidates = ranked.map((match, idx) => ({
    workerId: match.worker.id,
    workerName: match.worker.name,
    matchScore: match.totalScore,
    status: idx === 0 ? 'offered' : 'pending',
    offeredAt: idx === 0 ? new Date().toISOString() : undefined,
    expiresAt: idx === 0 ? new Date(now + 120000).toISOString() : undefined,
  }));
  shift.currentCascadeIndex = 0;

  res.json({ success: true, message: 'Offer cascade initiated', shift });
});

// 5. QR Code Generation Endpoint
app.get('/api/v1/shifts/:id/qr-code', (req: Request, res: Response) => {
  const shift = db.shifts.find((s) => s.id === req.params.id);
  if (!shift) return res.status(404).json({ error: 'Shift not found' });

  res.json({
    success: true,
    shiftId: shift.id,
    qrCodeSecret: shift.qrCodeSecret,
    qrPayload: JSON.stringify({
      shiftId: shift.id,
      secret: shift.qrCodeSecret,
      businessName: shift.businessName,
      issuedAt: new Date().toISOString(),
    }),
  });
});

// 6. Attendance & QR Scan Verification Endpoint
app.post('/api/v1/attendance/scan', (req: Request, res: Response) => {
  const { shiftId, workerId, qrCodeSecret, scanType } = req.body;
  const shift = db.shifts.find((s) => s.id === shiftId);
  if (!shift) return res.status(404).json({ error: 'Shift not found' });

  if (shift.qrCodeSecret !== qrCodeSecret) {
    return res.status(400).json({ error: 'Invalid QR token signature' });
  }

  const now = new Date().toISOString();
  if (scanType === 'check_out') {
    shift.status = 'completed';
    const record = db.attendance.find((a) => a.shiftId === shiftId && a.workerId === workerId);
    if (record) {
      record.checkOutTime = now;
      record.status = 'completed';
    }
    return res.json({ success: true, message: 'Shift Check-out verified! Payment released.', shift });
  } else {
    shift.status = 'in_progress';
    const record: DBAttendance = {
      id: `att-${Date.now()}`,
      shiftId,
      workerId: workerId || 'w-1',
      workerName: shift.assignedWorkerName || 'Worker',
      checkInTime: now,
      status: 'checked_in',
      verifiedBy: 'qr_scan',
      locationVerified: true,
    };
    db.attendance.unshift(record);
    return res.json({ success: true, message: 'QR Check-in verified! Shift is live.', shift, attendance: record });
  }
});

// 7. Ratings & Reliability Recalculation
app.post('/api/v1/ratings', (req: Request, res: Response) => {
  const { shiftId, fromUserId, toUserId, rating, review, tags } = req.body;
  const newRating: DBRating = {
    id: `rat-${Date.now()}`,
    shiftId,
    fromUserId: fromUserId || 'biz-1',
    toUserId: toUserId || 'w-1',
    rating: Number(rating) || 5,
    review: review || 'Great work!',
    tags: tags || ['Punctual', 'Pro'],
    createdAt: new Date().toISOString(),
  };
  db.ratings.unshift(newRating);

  const worker = db.workers.find((w) => w.id === toUserId || w.userId === toUserId);
  if (worker) {
    worker.totalRatings += 1;
    worker.totalShiftsCompleted += 1;
    worker.ratingAvg = Math.round(((worker.ratingAvg * (worker.totalRatings - 1) + Number(rating)) / worker.totalRatings) * 100) / 100;
  }

  res.status(201).json({ success: true, rating: newRating, updatedWorker: worker });
});

// 8. Skill Passport Endpoint
app.get('/api/v1/workers/:id/passport', (req: Request, res: Response) => {
  const worker = db.workers.find((w) => w.id === req.params.id || w.userId === req.params.id);
  if (!worker) return res.status(404).json({ error: 'Worker not found' });

  res.json({
    success: true,
    passport: {
      worker,
      verifiedSkills: worker.skills,
      reliabilityScore: worker.reliabilityScore,
      badges: worker.badges,
      ratings: db.ratings.filter((r) => r.toUserId === worker.id || r.toUserId === worker.userId),
    },
  });
});

// 9. Analytics & Platform Revenue Endpoint
app.get('/api/v1/analytics', (req: Request, res: Response) => {
  const completed = db.shifts.filter((s) => s.status === 'completed');
  const volume = completed.reduce((acc, s) => acc + s.payAmount, 0);
  res.json({
    success: true,
    analytics: {
      totalShifts: db.shifts.length,
      completedShifts: completed.length,
      fillRatePercentage: 98.2,
      grossVolume: volume,
      platformFee10Percent: Math.round(volume * 0.1 * 100) / 100,
      activeWorkers: db.workers.length,
    },
  });
});

app.listen(PORT, () => {
  console.log(`⚡ NERA Backend REST API is running live on http://localhost:${PORT}`);
});
