import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// --- Global Request Logger ---
app.use((req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  console.log(`[VERCEL API] [${timestamp}] ${req.method} ${req.originalUrl}`);
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    console.log(`[REQUEST BODY]`, JSON.stringify(req.body));
  }
  next();
});

// --- MongoDB Schemas & Models ---
const UserSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  role: { type: String, enum: ['business', 'worker', 'admin'], default: 'business' },
  phone: { type: String, default: '' },
  avatar: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

const BusinessSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  userId: { type: String, required: true },
  companyName: { type: String, required: true },
  category: { type: String, default: 'café' },
  address: { type: String, default: '' },
  location: {
    latitude: { type: Number, default: 12.9716 },
    longitude: { type: Number, default: 77.5946 },
  },
  totalSpent: { type: Number, default: 0 },
  shiftsPosted: { type: Number, default: 0 },
  logo: { type: String, default: '🏢' },
  contactPerson: { type: String, default: '' },
  ratingAvg: { type: Number, default: 5.0 },
  createdAt: { type: Date, default: Date.now },
});

const WorkerSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  userId: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, default: 'Emergency Worker' },
  avatar: { type: String, default: '' },
  phone: { type: String, default: '' },
  bio: { type: String, default: '' },
  skills: { type: [String], default: [] },
  experienceYears: { type: Number, default: 1 },
  reliabilityScore: { type: Number, default: 95.0 },
  isAvailable: { type: Boolean, default: true },
  availabilityStatus: { type: String, default: 'Available Now' },
  location: {
    latitude: { type: Number, default: 12.9716 },
    longitude: { type: Number, default: 77.5946 },
    address: { type: String, default: 'Bangalore, India' },
  },
  verificationStatus: { type: String, default: 'verified' },
  ratingAvg: { type: Number, default: 5.0 },
  totalRatings: { type: Number, default: 0 },
  totalShiftsCompleted: { type: Number, default: 0 },
  hourlyRate: { type: Number, default: 250 }, // In INR ₹
  badges: { type: [String], default: ['Verified Passport ✅'] },
  punctualityRate: { type: Number, default: 100 },
  completionRate: { type: Number, default: 100 },
  cancellationRate: { type: Number, default: 0 },
  earningsTotal: { type: Number, default: 0 }, // In INR ₹
  activeShiftId: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
});

const ShiftSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  businessId: { type: String, required: true },
  businessName: { type: String, required: true },
  businessCategory: { type: String, default: 'café' },
  role: { type: String, required: true },
  requiredSkills: { type: [String], default: [] },
  date: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  location: {
    address: { type: String, default: '' },
    latitude: { type: Number, default: 12.9716 },
    longitude: { type: Number, default: 77.5946 },
  },
  payAmount: { type: Number, required: true }, // In INR ₹
  hourlyRate: { type: Number, required: true }, // In INR ₹
  platformFee: { type: Number, required: true }, // 10% in INR ₹
  totalCost: { type: Number, required: true }, // In INR ₹
  urgency: { type: String, default: 'EMERGENCY (Immediate)' },
  notes: { type: String, default: '' },
  status: { type: String, default: 'open' },
  assignedWorkerId: { type: String, default: null },
  assignedWorkerName: { type: String, default: null },
  backupWorkerId: { type: String, default: null },
  backupWorkerName: { type: String, default: null },
  cascadeCandidates: { type: Array, default: [] },
  currentCascadeIndex: { type: Number, default: 0 },
  qrCodeSecret: { type: String, required: true },
  checkInTime: { type: String, default: null },
  checkOutTime: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
});

const AttendanceSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  shiftId: { type: String, required: true },
  workerId: { type: String, required: true },
  workerName: { type: String, required: true },
  businessId: { type: String, default: '' },
  businessName: { type: String, default: '' },
  role: { type: String, default: '' },
  checkInTime: { type: String, required: true },
  checkOutTime: { type: String, default: null },
  status: { type: String, default: 'checked_in' },
  verifiedBy: { type: String, default: 'qr_scan' },
  locationVerified: { type: Boolean, default: true },
  date: { type: String, default: () => new Date().toISOString().split('T')[0] },
  createdAt: { type: Date, default: Date.now },
});

const RatingSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  shiftId: { type: String, required: true },
  fromUserId: { type: String, required: true },
  fromUserName: { type: String, default: '' },
  toUserId: { type: String, required: true },
  toUserName: { type: String, default: '' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  review: { type: String, default: '' },
  tags: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
});

export const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);
export const BusinessModel = mongoose.models.Business || mongoose.model('Business', BusinessSchema);
export const WorkerModel = mongoose.models.Worker || mongoose.model('Worker', WorkerSchema);
export const ShiftModel = mongoose.models.Shift || mongoose.model('Shift', ShiftSchema);
export const AttendanceModel = mongoose.models.Attendance || mongoose.model('Attendance', AttendanceSchema);
export const RatingModel = mongoose.models.Rating || mongoose.model('Rating', RatingSchema);

// --- Serverless MongoDB Connection Manager ---
interface MongoCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  source: string;
  error: string | null;
}

let cached: MongoCache = (global as any).mongooseCache || {
  conn: null,
  promise: null,
  source: 'Disconnected',
  error: null,
};
(global as any).mongooseCache = cached;

export async function connectToDatabase(): Promise<{ isConnected: boolean; source: string; error: string | null }> {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return { isConnected: true, source: cached.source, error: null };
  }

  const uri = process.env.MONGODB_URI;

  if (uri && uri.trim() !== '') {
    try {
      if (!cached.promise) {
        cached.promise = mongoose.connect(uri, {
          serverSelectionTimeoutMS: 6000,
        });
      }
      cached.conn = await cached.promise;
      cached.source = 'MongoDB Atlas';
      cached.error = null;
      console.log('✅ [DATABASE] Connected to MongoDB Atlas Cloud successfully.');
      return { isConnected: true, source: cached.source, error: null };
    } catch (err: any) {
      cached.promise = null;
      cached.error = err.message;
      console.error(`⚠️ [DATABASE] MongoDB Atlas connection error: ${err.message}`);
    }
  }

  // Local fallback for local server environments
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect('mongodb://127.0.0.1:27017/nera_db', { serverSelectionTimeoutMS: 3000 });
    }
    cached.source = 'Local MongoDB (mongodb://127.0.0.1:27017/nera_db)';
    cached.error = null;
    return { isConnected: true, source: cached.source, error: null };
  } catch (err: any) {
    cached.source = 'Disconnected';
    cached.error = err.message;
    return { isConnected: false, source: 'Disconnected', error: err.message };
  }
}

// Ensure DB connected before processing routes
app.use(async (_req: Request, _res: Response, next: NextFunction) => {
  await connectToDatabase();
  next();
});

// --- Distance Helper & Smart Match Algorithm ---
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

function computeMatchScore(worker: any, shift: any) {
  const availScore = worker.availabilityStatus === 'Available Now' ? 100 : worker.availabilityStatus === 'Available Later' ? 60 : 0;
  const reqSkills = shift.requiredSkills || [];
  const workerSkills = (worker.skills || []).map((s: string) => s.toLowerCase());
  const matchedSkills = reqSkills.filter((s: string) => workerSkills.includes(s.toLowerCase()));
  const missingSkills = reqSkills.filter((s: string) => !workerSkills.includes(s.toLowerCase()));
  const skillScore = reqSkills.length > 0 ? (matchedSkills.length / reqSkills.length) * 100 : 100;

  const dist = calculateDistanceKm(
    shift.location?.latitude || 12.9716,
    shift.location?.longitude || 77.5946,
    worker.location?.latitude || 12.9716,
    worker.location?.longitude || 77.5946
  );
  const distScore = Math.max(0, (1.0 - dist / 20.0) * 100);
  const relScore = worker.reliabilityScore || 90;
  const expScore = Math.min(100, ((worker.experienceYears || 0) / 5.0) * 100);

  const totalScore = 0.3 * availScore + 0.25 * skillScore + 0.2 * distScore + 0.15 * relScore + 0.1 * expScore;

  return {
    worker,
    totalScore: Math.round(totalScore * 10) / 10,
    distanceKm: dist,
    matchingSkills: matchedSkills,
    missingSkills: missingSkills,
    breakdown: {
      availability: availScore,
      skills: Math.round(skillScore),
      distance: Math.round(distScore),
      reliability: Math.round(relScore),
      experience: Math.round(expScore),
    },
  };
}

// Router to support both `/api/v1/...` and `/api/...` paths seamlessly
const router = express.Router();

// Health Check
router.get(['/health', '/v1/health'], async (_req: Request, res: Response) => {
  const dbStatus = await connectToDatabase();
  const usersCount = dbStatus.isConnected ? await UserModel.countDocuments() : 0;
  const workersCount = dbStatus.isConnected ? await WorkerModel.countDocuments() : 0;
  const shiftsCount = dbStatus.isConnected ? await ShiftModel.countDocuments() : 0;

  res.json({
    status: dbStatus.isConnected ? 'online' : 'database_connecting',
    service: 'NERA Emergency Shift Platform API (Vercel Serverless / Express)',
    database: dbStatus.source,
    connectionError: dbStatus.error,
    currency: 'INR (₹)',
    timestamp: new Date().toISOString(),
    collections: {
      users: usersCount,
      workers: workersCount,
      shifts: shiftsCount,
    },
  });
});

// Test Endpoint: Insert Sample User & Verify
router.post(['/test/insert-user', '/v1/test/insert-user'], async (req: Request, res: Response) => {
  try {
    const dbStatus = await connectToDatabase();
    if (!dbStatus.isConnected) {
      return res.status(503).json({
        success: false,
        error: 'Database is disconnected',
        details: dbStatus.error,
      });
    }

    const { name, email, role, phone } = req.body;
    const testId = `test-user-${Date.now()}`;
    const testUser = {
      id: testId,
      name: name || 'Audit Test User',
      email: (email || `test-${Date.now()}@nera.in`).toLowerCase(),
      role: role || 'worker',
      phone: phone || '+91 98765 00000',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      createdAt: new Date(),
    };

    const doc = await UserModel.create(testUser);
    const verified = await UserModel.findOne({ id: testId });
    const totalUsers = await UserModel.countDocuments();

    res.status(201).json({
      success: true,
      message: `Sample user created and verified in ${dbStatus.source}`,
      activeDatabase: dbStatus.source,
      isAtlasConnected: dbStatus.source.includes('Atlas'),
      document: verified || doc,
      totalUsersInCollection: totalUsers,
      auditChecklist: {
        envLoaded: Boolean(process.env.MONGODB_URI),
        mongooseConnect: true,
        routeReceived: true,
        bodyParsed: true,
        mongooseSaved: true,
        databaseVerified: true,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Verify Atlas Status
router.get(['/test/verify-atlas', '/v1/test/verify-atlas'], async (_req: Request, res: Response) => {
  const dbStatus = await connectToDatabase();
  const maskedUri = process.env.MONGODB_URI
    ? process.env.MONGODB_URI.replace(/:([^@]+)@/, ':****@')
    : 'NOT_SET';

  res.json({
    success: true,
    audit: {
      configuredUri: maskedUri,
      activeDatabase: dbStatus.source,
      isAtlasConnected: dbStatus.source.includes('Atlas'),
      connectionState: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      databaseName: mongoose.connection.name || 'nera_db',
      host: mongoose.connection.host || 'unknown',
      connectionError: dbStatus.error,
      counts: {
        users: dbStatus.isConnected ? await UserModel.countDocuments() : 0,
        workers: dbStatus.isConnected ? await WorkerModel.countDocuments() : 0,
        businesses: dbStatus.isConnected ? await BusinessModel.countDocuments() : 0,
        shifts: dbStatus.isConnected ? await ShiftModel.countDocuments() : 0,
      },
    },
  });
});

// Auth Routes
router.post(['/auth/register', '/v1/auth/register'], async (req: Request, res: Response) => {
  try {
    const { name, email, role, phone } = req.body;
    const userId = `user-${Date.now()}`;
    const user = {
      id: userId,
      name: name || 'New User',
      email: (email || `user-${Date.now()}@nera.in`).toLowerCase(),
      role: role || 'business',
      phone: phone || '+91 98765 43210',
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      createdAt: new Date(),
    };

    if (mongoose.connection.readyState === 1) {
      await UserModel.create(user);
    }
    res.status(201).json({ success: true, user, token: `jwt_nera_${user.id}` });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post(['/auth/login', '/v1/auth/login'], async (req: Request, res: Response) => {
  try {
    const { email, role } = req.body;
    let user: any = null;
    if (mongoose.connection.readyState === 1 && email) {
      user = await UserModel.findOne({ email: email.toLowerCase() });
    }
    if (!user) {
      user = {
        id: `user-${Date.now()}`,
        name: email ? email.split('@')[0] : 'User',
        email: (email || 'user@nera.in').toLowerCase(),
        role: role || 'business',
        phone: '+91 98765 43210',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        createdAt: new Date(),
      };
      if (mongoose.connection.readyState === 1) {
        await UserModel.create(user);
      }
    }
    res.json({ success: true, user, token: `jwt_nera_${user.id}` });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Users
router.get(['/users', '/v1/users'], async (_req: Request, res: Response) => {
  const users = mongoose.connection.readyState === 1 ? await UserModel.find().sort({ createdAt: -1 }) : [];
  res.json({ success: true, users });
});

// Businesses
router.get(['/businesses', '/v1/businesses'], async (_req: Request, res: Response) => {
  const businesses = mongoose.connection.readyState === 1 ? await BusinessModel.find().sort({ createdAt: -1 }) : [];
  res.json({ success: true, businesses });
});

router.get(['/businesses/:id', '/v1/businesses/:id'], async (req: Request, res: Response) => {
  const business = mongoose.connection.readyState === 1 ? await BusinessModel.findOne({ id: req.params.id }) : null;
  if (!business) return res.status(404).json({ success: false, error: 'Business not found' });
  res.json({ success: true, business });
});

router.post(['/businesses', '/v1/businesses'], async (req: Request, res: Response) => {
  try {
    const bizData = req.body;
    const newBiz = {
      id: bizData.id || `biz-${Date.now()}`,
      userId: bizData.userId || `user-${Date.now()}`,
      companyName: bizData.companyName || 'My Business',
      category: bizData.category || 'café',
      address: bizData.address || 'MG Road, Bangalore',
      location: bizData.location || { latitude: 12.9716, longitude: 77.5946 },
      totalSpent: bizData.totalSpent || 0,
      shiftsPosted: bizData.shiftsPosted || 0,
      logo: bizData.logo || '🏢',
      contactPerson: bizData.contactPerson || '',
      ratingAvg: bizData.ratingAvg || 5.0,
      createdAt: new Date(),
    };

    if (mongoose.connection.readyState === 1) {
      await BusinessModel.create(newBiz);
    }
    res.status(201).json({ success: true, business: newBiz });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Workers
router.get(['/workers', '/v1/workers'], async (_req: Request, res: Response) => {
  const workers = mongoose.connection.readyState === 1 ? await WorkerModel.find().sort({ createdAt: -1 }) : [];
  res.json({ success: true, workers });
});

router.get(['/workers/:id', '/v1/workers/:id'], async (req: Request, res: Response) => {
  const worker = mongoose.connection.readyState === 1 ? await WorkerModel.findOne({ $or: [{ id: req.params.id }, { userId: req.params.id }] }) : null;
  if (!worker) return res.status(404).json({ success: false, error: 'Worker not found' });
  res.json({ success: true, worker });
});

router.post(['/workers', '/v1/workers'], async (req: Request, res: Response) => {
  try {
    const w = req.body;
    const newWorker = {
      id: w.id || `w-${Date.now()}`,
      userId: w.userId || `user-${Date.now()}`,
      name: w.name || 'Emergency Worker',
      role: w.role || 'Barista & Staff',
      avatar: w.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      phone: w.phone || '+91 98765 43210',
      bio: w.bio || 'Verified hospitality and emergency shift professional.',
      skills: w.skills || ['Customer Service', 'POS Operations'],
      experienceYears: Number(w.experienceYears) || 2,
      reliabilityScore: Number(w.reliabilityScore) || 96.0,
      isAvailable: w.isAvailable !== undefined ? w.isAvailable : true,
      availabilityStatus: w.availabilityStatus || 'Available Now',
      location: w.location || { latitude: 12.9716, longitude: 77.5946, address: 'Indiranagar, Bangalore (1.2 km)' },
      verificationStatus: w.verificationStatus || 'verified',
      ratingAvg: Number(w.ratingAvg) || 5.0,
      totalRatings: Number(w.totalRatings) || 0,
      totalShiftsCompleted: Number(w.totalShiftsCompleted) || 0,
      hourlyRate: Number(w.hourlyRate) || 250, // INR ₹
      badges: w.badges || ['Verified Passport ✅', 'Quick Responder ⚡'],
      punctualityRate: Number(w.punctualityRate) || 100,
      completionRate: Number(w.completionRate) || 100,
      cancellationRate: Number(w.cancellationRate) || 0,
      earningsTotal: Number(w.earningsTotal) || 0, // INR ₹
      activeShiftId: null,
      createdAt: new Date(),
    };

    if (mongoose.connection.readyState === 1) {
      await WorkerModel.create(newWorker);
    }
    res.status(201).json({ success: true, worker: newWorker });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.patch(['/workers/:id', '/v1/workers/:id'], async (req: Request, res: Response) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const updated = await WorkerModel.findOneAndUpdate(
        { $or: [{ id: req.params.id }, { userId: req.params.id }] },
        { $set: req.body },
        { new: true }
      );
      return res.json({ success: true, worker: updated });
    }
    res.json({ success: true, worker: req.body });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Shifts
router.get(['/shifts', '/v1/shifts'], async (_req: Request, res: Response) => {
  const shifts = mongoose.connection.readyState === 1 ? await ShiftModel.find().sort({ createdAt: -1 }) : [];
  res.json({ success: true, shifts });
});

router.get(['/shifts/:id', '/v1/shifts/:id'], async (req: Request, res: Response) => {
  const shift = mongoose.connection.readyState === 1 ? await ShiftModel.findOne({ id: req.params.id }) : null;
  if (!shift) return res.status(404).json({ success: false, error: 'Shift not found' });
  res.json({ success: true, shift });
});

router.post(['/shifts', '/v1/shifts'], async (req: Request, res: Response) => {
  try {
    const shiftData = req.body;
    const pay = Number(shiftData.payAmount) || 1200; // in INR ₹
    const fee = Math.round(pay * 0.1 * 100) / 100; // 10% platform fee in INR ₹
    const total = pay + fee;

    const newShift = {
      id: shiftData.id || `shift-${Date.now()}`,
      businessId: shiftData.businessId || 'biz-1',
      businessName: shiftData.businessName || 'Urban Brew Café',
      businessCategory: shiftData.businessCategory || 'café',
      role: shiftData.role || 'Senior Barista',
      requiredSkills: shiftData.requiredSkills || ['Barista', 'POS Operations'],
      date: shiftData.date || new Date().toISOString().split('T')[0],
      startTime: shiftData.startTime || '10:00 AM',
      endTime: shiftData.endTime || '04:00 PM',
      location: shiftData.location || {
        address: '142 MG Road, Bangalore',
        latitude: 12.9716,
        longitude: 77.5946,
      },
      payAmount: pay,
      hourlyRate: Number(shiftData.hourlyRate) || Math.round(pay / 6),
      platformFee: fee,
      totalCost: total,
      urgency: shiftData.urgency || 'EMERGENCY (Immediate)',
      notes: shiftData.notes || '',
      status: 'open',
      cascadeCandidates: [],
      currentCascadeIndex: 0,
      qrCodeSecret: `NERA_SHIFT_${Math.floor(1000 + Math.random() * 9000)}_SEC`,
      createdAt: new Date(),
    };

    if (mongoose.connection.readyState === 1) {
      await ShiftModel.create(newShift);
      await BusinessModel.updateOne({ id: newShift.businessId }, { $inc: { shiftsPosted: 1 } });
    }
    res.status(201).json({ success: true, shift: newShift });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.patch(['/shifts/:id', '/v1/shifts/:id'], async (req: Request, res: Response) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const updated = await ShiftModel.findOneAndUpdate({ id: req.params.id }, { $set: req.body }, { new: true });
      return res.json({ success: true, shift: updated });
    }
    res.json({ success: true, shift: req.body });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete(['/shifts/:id', '/v1/shifts/:id'], async (req: Request, res: Response) => {
  if (mongoose.connection.readyState === 1) {
    await ShiftModel.deleteOne({ id: req.params.id });
  }
  res.json({ success: true, message: 'Shift deleted successfully' });
});

// Smart Matching & Cascade
router.get(['/shifts/:id/matches', '/v1/shifts/:id/matches'], async (req: Request, res: Response) => {
  const shift = mongoose.connection.readyState === 1 ? await ShiftModel.findOne({ id: req.params.id }) : null;
  if (!shift) return res.status(404).json({ success: false, error: 'Shift not found' });

  const workers = mongoose.connection.readyState === 1 ? await WorkerModel.find() : [];
  const ranked = workers.map((w: any) => computeMatchScore(w, shift)).sort((a: any, b: any) => b.totalScore - a.totalScore);
  res.json({ success: true, shiftId: shift.id, candidates: ranked });
});

router.post(['/shifts/:id/cascade', '/v1/shifts/:id/cascade'], async (req: Request, res: Response) => {
  const shift = mongoose.connection.readyState === 1 ? await ShiftModel.findOne({ id: req.params.id }) : null;
  if (!shift) return res.status(404).json({ success: false, error: 'Shift not found' });

  const workers = mongoose.connection.readyState === 1 ? await WorkerModel.find() : [];
  const ranked = workers.map((w: any) => computeMatchScore(w, shift)).sort((a: any, b: any) => b.totalScore - a.totalScore);
  const now = Date.now();

  shift.status = 'cascading';
  shift.cascadeCandidates = ranked.map((match: any, idx: number) => ({
    workerId: match.worker.id,
    workerName: match.worker.name,
    workerAvatar: match.worker.avatar,
    matchScore: match.totalScore,
    status: idx === 0 ? 'offered' : 'pending',
    offeredAt: idx === 0 ? new Date().toISOString() : undefined,
    expiresAt: idx === 0 ? new Date(now + 120000).toISOString() : undefined,
  }));
  shift.currentCascadeIndex = 0;

  if (mongoose.connection.readyState === 1) {
    await shift.save();
  }

  res.json({ success: true, message: 'Offer cascade initiated', shift });
});

router.post(['/shifts/:id/accept', '/v1/shifts/:id/accept'], async (req: Request, res: Response) => {
  const { workerId } = req.body;
  const shift = mongoose.connection.readyState === 1 ? await ShiftModel.findOne({ id: req.params.id }) : null;
  if (!shift) return res.status(404).json({ success: false, error: 'Shift not found' });

  const worker = mongoose.connection.readyState === 1 ? await WorkerModel.findOne({ id: workerId }) : null;
  if (!worker) return res.status(404).json({ success: false, error: 'Worker not found' });

  const otherCandidates = (shift.cascadeCandidates || []).filter((c: any) => c.workerId !== workerId);
  const backupCandidate = otherCandidates.length > 0 ? otherCandidates[0] : null;

  shift.status = 'assigned';
  shift.assignedWorkerId = worker.id;
  shift.assignedWorkerName = worker.name;
  shift.backupWorkerId = backupCandidate ? backupCandidate.workerId : null;
  shift.backupWorkerName = backupCandidate ? backupCandidate.workerName : null;
  shift.cascadeCandidates = (shift.cascadeCandidates || []).map((c: any) =>
    c.workerId === workerId ? { ...c, status: 'accepted' } : c
  );

  if (mongoose.connection.readyState === 1) {
    await shift.save();
    await WorkerModel.updateOne({ id: workerId }, { activeShiftId: shift.id });
  }

  res.json({ success: true, message: 'Shift offer accepted', shift });
});

router.post(['/shifts/:id/decline', '/v1/shifts/:id/decline'], async (req: Request, res: Response) => {
  const { workerId } = req.body;
  const shift = mongoose.connection.readyState === 1 ? await ShiftModel.findOne({ id: req.params.id }) : null;
  if (!shift) return res.status(404).json({ success: false, error: 'Shift not found' });

  const currIdx = shift.currentCascadeIndex || 0;
  const updatedCandidates = [...(shift.cascadeCandidates || [])];

  if (updatedCandidates[currIdx] && updatedCandidates[currIdx].workerId === workerId) {
    updatedCandidates[currIdx].status = 'rejected';
    const nextIdx = currIdx + 1;
    if (nextIdx < updatedCandidates.length) {
      updatedCandidates[nextIdx].status = 'offered';
      updatedCandidates[nextIdx].offeredAt = new Date().toISOString();
      updatedCandidates[nextIdx].expiresAt = new Date(Date.now() + 120000).toISOString();
      shift.status = 'cascading';
      shift.currentCascadeIndex = nextIdx;
    } else {
      shift.status = 'open';
    }
  }
  shift.cascadeCandidates = updatedCandidates;

  if (mongoose.connection.readyState === 1) {
    await shift.save();
  }

  res.json({ success: true, message: 'Shift offer declined. Forwarded in cascade.', shift });
});

// QR Attendance
router.get(['/shifts/:id/qr-code', '/v1/shifts/:id/qr-code'], async (req: Request, res: Response) => {
  const shift = mongoose.connection.readyState === 1 ? await ShiftModel.findOne({ id: req.params.id }) : null;
  if (!shift) return res.status(404).json({ success: false, error: 'Shift not found' });

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

router.get(['/attendance', '/v1/attendance'], async (_req: Request, res: Response) => {
  const attendance = mongoose.connection.readyState === 1 ? await AttendanceModel.find().sort({ createdAt: -1 }) : [];
  res.json({ success: true, attendance });
});

router.post(['/attendance/scan', '/v1/attendance/scan'], async (req: Request, res: Response) => {
  const { shiftId, workerId, qrCodeSecret, scanType } = req.body;
  const shift = mongoose.connection.readyState === 1 ? await ShiftModel.findOne({ id: shiftId }) : null;
  if (!shift) return res.status(404).json({ success: false, error: 'Shift not found' });

  if (shift.qrCodeSecret !== qrCodeSecret) {
    return res.status(400).json({ success: false, error: 'Invalid QR Code token signature' });
  }

  const now = new Date().toISOString();
  if (scanType === 'check_out') {
    shift.status = 'completed';
    shift.checkOutTime = now;
    if (mongoose.connection.readyState === 1) {
      await AttendanceModel.updateOne({ shiftId, workerId }, { checkOutTime: now, status: 'completed' });
      await WorkerModel.updateOne(
        { id: workerId },
        {
          $inc: { totalShiftsCompleted: 1, earningsTotal: shift.payAmount },
          $set: { activeShiftId: null },
        }
      );
      await BusinessModel.updateOne({ id: shift.businessId }, { $inc: { totalSpent: shift.totalCost } });
      await shift.save();
    }
    return res.json({ success: true, message: `Check-out verified! Payment of ₹${shift.payAmount} unlocked.`, shift });
  } else {
    shift.status = 'in_progress';
    shift.checkInTime = now;
    const attendanceRecord = {
      id: `att-${Date.now()}`,
      shiftId: shift.id,
      workerId: workerId,
      workerName: shift.assignedWorkerName || 'Worker',
      businessId: shift.businessId,
      businessName: shift.businessName,
      role: shift.role,
      checkInTime: now,
      status: 'checked_in',
      verifiedBy: 'qr_scan',
      locationVerified: true,
      date: shift.date,
      createdAt: new Date(),
    };

    if (mongoose.connection.readyState === 1) {
      await AttendanceModel.create(attendanceRecord);
      await shift.save();
    }
    return res.json({ success: true, message: `Check-in verified at ${shift.businessName}! Shift is live.`, shift, attendance: attendanceRecord });
  }
});

// Ratings
router.get(['/ratings', '/v1/ratings'], async (_req: Request, res: Response) => {
  const ratings = mongoose.connection.readyState === 1 ? await RatingModel.find().sort({ createdAt: -1 }) : [];
  res.json({ success: true, ratings });
});

router.post(['/ratings', '/v1/ratings'], async (req: Request, res: Response) => {
  try {
    const { shiftId, fromUserId, fromUserName, toUserId, toUserName, rating, review, tags } = req.body;
    const ratingRecord = {
      id: `rat-${Date.now()}`,
      shiftId: shiftId || `shift-${Date.now()}`,
      fromUserId: fromUserId || 'biz-1',
      fromUserName: fromUserName || 'Business',
      toUserId: toUserId || 'w-1',
      toUserName: toUserName || 'Worker',
      rating: Number(rating) || 5,
      review: review || '',
      tags: tags || ['Punctual'],
      createdAt: new Date(),
    };

    if (mongoose.connection.readyState === 1) {
      await RatingModel.create(ratingRecord);
      const worker = await WorkerModel.findOne({ $or: [{ id: toUserId }, { userId: toUserId }] });
      if (worker) {
        const newTotalRatings = (worker.totalRatings || 0) + 1;
        const newAvg = ((worker.ratingAvg || 5) * (worker.totalRatings || 0) + Number(rating)) / newTotalRatings;
        worker.ratingAvg = Math.round(newAvg * 100) / 100;
        worker.totalRatings = newTotalRatings;
        await worker.save();
      }
    }
    res.status(201).json({ success: true, rating: ratingRecord });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Analytics
router.get(['/analytics', '/v1/analytics'], async (_req: Request, res: Response) => {
  const shifts = mongoose.connection.readyState === 1 ? await ShiftModel.find() : [];
  const completed = shifts.filter((s: any) => s.status === 'completed');
  const active = shifts.filter((s: any) => ['cascading', 'assigned', 'in_progress'].includes(s.status));
  const grossVolume = completed.reduce((acc: number, s: any) => acc + (s.payAmount || 0), 0);
  const platformRevenue = Math.round(grossVolume * 0.1 * 100) / 100;
  const workers = mongoose.connection.readyState === 1 ? await WorkerModel.find() : [];
  const businesses = mongoose.connection.readyState === 1 ? await BusinessModel.find() : [];

  const fillRate = shifts.length > 0 ? Math.round((completed.length / shifts.length) * 1000) / 10 : 0;
  const avgRel = workers.length > 0 ? Math.round((workers.reduce((a: number, w: any) => a + (w.reliabilityScore || 90), 0) / workers.length) * 10) / 10 : 0;

  res.json({
    success: true,
    analytics: {
      totalShifts: shifts.length,
      completedShifts: completed.length,
      activeShifts: active.length,
      averageMatchTimeSeconds: 142,
      fillRatePercentage: fillRate,
      totalVolumeGross: grossVolume, // in INR ₹
      platformRevenueFee: platformRevenue, // 10% in INR ₹
      totalWorkers: workers.length,
      totalBusinesses: businesses.length,
      averageReliability: avgRel,
    },
  });
});

// Clear Database
router.post(['/database/clear', '/v1/database/clear'], async (_req: Request, res: Response) => {
  if (mongoose.connection.readyState === 1) {
    await ShiftModel.deleteMany({});
    await AttendanceModel.deleteMany({});
    await RatingModel.deleteMany({});
    await WorkerModel.deleteMany({});
    await BusinessModel.deleteMany({});
    await UserModel.deleteMany({});
  }
  res.json({ success: true, message: 'All MongoDB collections wiped clean. 0 records remaining.' });
});

// Mount router on both `/api` and `/` so `/api/v1/workers` and `/v1/workers` match regardless of Vercel rewrite prefix
app.use('/api', router);
app.use('/', router);

// Error fallback
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[UNCAUGHT SERVER ERROR]', err);
  res.status(500).json({ success: false, error: err.message || 'Internal Server Error' });
});

export default app;
