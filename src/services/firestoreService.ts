import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebase';
import type { User, Business, Worker, Shift, AttendanceRecord, Rating } from '../types';

// Generic collection references
export const COLLECTIONS = {
  USERS: 'users',
  BUSINESSES: 'businesses',
  WORKERS: 'workers',
  SHIFTS: 'shifts',
  ATTENDANCE: 'attendance',
  RATINGS: 'ratings',
} as const;

// 1. Users Service
export async function createFirestoreUser(user: User): Promise<void> {
  if (!db || !isFirebaseConfigured) return;
  await setDoc(doc(db, COLLECTIONS.USERS, user.id), user);
}

export async function getFirestoreUsers(): Promise<User[]> {
  if (!db || !isFirebaseConfigured) return [];
  const snapshot = await getDocs(collection(db, COLLECTIONS.USERS));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as User));
}

// 2. Businesses Service
export async function createFirestoreBusiness(biz: Business): Promise<void> {
  if (!db || !isFirebaseConfigured) return;
  await setDoc(doc(db, COLLECTIONS.BUSINESSES, biz.id), biz);
}

export async function getFirestoreBusinesses(): Promise<Business[]> {
  if (!db || !isFirebaseConfigured) return [];
  const snapshot = await getDocs(collection(db, COLLECTIONS.BUSINESSES));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Business));
}

// 3. Workers Service
export async function createFirestoreWorker(worker: Worker): Promise<void> {
  if (!db || !isFirebaseConfigured) return;
  await setDoc(doc(db, COLLECTIONS.WORKERS, worker.id), worker);
}

export async function updateFirestoreWorker(workerId: string, data: Partial<Worker>): Promise<void> {
  if (!db || !isFirebaseConfigured) return;
  await updateDoc(doc(db, COLLECTIONS.WORKERS, workerId), data);
}

export async function getFirestoreWorkers(): Promise<Worker[]> {
  if (!db || !isFirebaseConfigured) return [];
  const snapshot = await getDocs(collection(db, COLLECTIONS.WORKERS));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Worker));
}

// 4. Shifts Service
export async function createFirestoreShift(shift: Shift): Promise<void> {
  if (!db || !isFirebaseConfigured) return;
  await setDoc(doc(db, COLLECTIONS.SHIFTS, shift.id), shift);
}

export async function updateFirestoreShift(shiftId: string, data: Partial<Shift>): Promise<void> {
  if (!db || !isFirebaseConfigured) return;
  await updateDoc(doc(db, COLLECTIONS.SHIFTS, shiftId), data);
}

export async function getFirestoreShifts(): Promise<Shift[]> {
  if (!db || !isFirebaseConfigured) return [];
  const snapshot = await getDocs(collection(db, COLLECTIONS.SHIFTS));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Shift));
}

// 5. Attendance Service
export async function recordFirestoreAttendance(record: AttendanceRecord): Promise<void> {
  if (!db || !isFirebaseConfigured) return;
  await setDoc(doc(db, COLLECTIONS.ATTENDANCE, record.id), record);
}

export async function getFirestoreAttendance(): Promise<AttendanceRecord[]> {
  if (!db || !isFirebaseConfigured) return [];
  const snapshot = await getDocs(collection(db, COLLECTIONS.ATTENDANCE));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as AttendanceRecord));
}

// 6. Ratings Service
export async function createFirestoreRating(rating: Rating): Promise<void> {
  if (!db || !isFirebaseConfigured) return;
  await setDoc(doc(db, COLLECTIONS.RATINGS, rating.id), rating);
}

export async function getFirestoreRatings(): Promise<Rating[]> {
  if (!db || !isFirebaseConfigured) return [];
  const snapshot = await getDocs(collection(db, COLLECTIONS.RATINGS));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Rating));
}
