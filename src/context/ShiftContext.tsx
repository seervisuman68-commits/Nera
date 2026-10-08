import React, { createContext, useContext, useState, useEffect, useTransition } from 'react';
import type { Shift, Worker, AttendanceRecord, Rating, PlatformAnalytics, CascadeCandidate } from '../types';
import { api } from '../services/api';

interface ShiftContextType {
  shifts: Shift[];
  workers: Worker[];
  attendanceLogs: AttendanceRecord[];
  ratings: Rating[];
  analytics: PlatformAnalytics;
  isLoading: boolean;
  dbError: string | null;
  isDbConnected: boolean;
  refreshData: () => Promise<void>;
  createShift: (shiftData: Partial<Shift>) => Promise<Shift>;
  addWorker: (workerData: Partial<Worker>) => Promise<Worker>;
  deleteShift: (shiftId: string) => Promise<void>;
  clearAllData: () => Promise<void>;
  startOfferCascade: (shiftId: string, candidateWorkerIds?: string[]) => Promise<void>;
  acceptShiftOffer: (shiftId: string, workerId: string) => Promise<void>;
  declineShiftOffer: (shiftId: string, workerId: string) => Promise<void>;
  checkInWorkerQR: (shiftId: string, workerId: string, qrCodeSecret: string) => Promise<{ success: boolean; message: string; attendance?: AttendanceRecord }>;
  checkOutWorkerQR: (shiftId: string, workerId: string) => Promise<{ success: boolean; message: string; attendance?: AttendanceRecord }>;
  submitShiftRating: (data: { shiftId: string; fromUserId: string; fromUserName: string; toUserId: string; toUserName: string; rating: number; review: string; tags: string[] }) => Promise<void>;
  getShiftById: (id: string) => Shift | undefined;
  getWorkerById: (id: string) => Worker | undefined;
  updateWorkerVerification: (workerId: string, status: 'verified' | 'rejected') => Promise<void>;
  activeOfferForWorker: (workerId: string) => { shift: Shift; candidate: CascadeCandidate } | null;
  advanceCascadeTimerManually: (shiftId: string) => Promise<void>;
}

const ShiftContext = createContext<ShiftContextType | undefined>(undefined);

export const ShiftProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceRecord[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);
  const [isDbConnected, setIsDbConnected] = useState<boolean>(true);
  const [, startTransition] = useTransition();

  // Load live data from MongoDB Atlas / API as Single Source of Truth
  const refreshData = async () => {
    try {
      const [shiftsRes, workersRes, attendanceRes, ratingsRes] = await Promise.all([
        api.getShifts(),
        api.getWorkers(),
        api.getAttendanceLogs(),
        api.getRatings(),
      ]);

      startTransition(() => {
        setDbError(null);
        setIsDbConnected(true);
        setShifts(shiftsRes?.shifts || []);
        setWorkers(workersRes?.workers || []);
        setAttendanceLogs(attendanceRes?.attendance || []);
        setRatings(ratingsRes?.ratings || []);
      });
    } catch (err: any) {
      console.warn('❌ [ShiftContext] Database connection error during live sync:', err.message);
      const errMsg = err?.message || 'Database connection failed';
      startTransition(() => {
        setDbError(errMsg);
        setIsDbConnected(false);
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    refreshData();
  }, []);

  // Periodic real-time background sync (every 3.5 seconds) to ensure all dashboards stay synchronized
  useEffect(() => {
    const syncTimer = setInterval(() => {
      refreshData();
    }, 3500);
    return () => clearInterval(syncTimer);
  }, []);

  // Offer cascade timer: auto-expire pending candidate after 2 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setShifts((prevShifts) => {
        let changed = false;
        const now = Date.now();

        const updated = prevShifts.map((shift) => {
          if (shift.status === 'cascading' && shift.cascadeCandidates && shift.cascadeCandidates.length > 0) {
            const currentIndex = shift.currentCascadeIndex || 0;
            const currentCandidate = shift.cascadeCandidates[currentIndex];

            if (currentCandidate && currentCandidate.status === 'offered' && currentCandidate.expiresAt) {
              const expiresAtMs = new Date(currentCandidate.expiresAt).getTime();
              if (now >= expiresAtMs) {
                changed = true;
                const updatedCandidates = [...shift.cascadeCandidates];
                updatedCandidates[currentIndex] = {
                  ...currentCandidate,
                  status: 'expired',
                };

                const nextIndex = currentIndex + 1;
                if (nextIndex < updatedCandidates.length) {
                  const nextExpires = new Date(now + 120000).toISOString();
                  updatedCandidates[nextIndex] = {
                    ...updatedCandidates[nextIndex],
                    status: 'offered',
                    offeredAt: new Date().toISOString(),
                    expiresAt: nextExpires,
                  };
                  return {
                    ...shift,
                    status: 'cascading' as const,
                    cascadeCandidates: updatedCandidates,
                    currentCascadeIndex: nextIndex,
                  };
                } else {
                  return {
                    ...shift,
                    status: 'open' as const,
                    cascadeCandidates: updatedCandidates,
                  };
                }
              }
            }
          }
          return shift;
        });

        return changed ? updated : prevShifts;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const createShift = async (shiftData: Partial<Shift>): Promise<Shift> => {
    const pay = Number(shiftData.payAmount) || 1200; // in INR ₹
    const fee = Math.round(pay * 0.10 * 100) / 100;
    const total = pay + fee;

    const payload: Partial<Shift> = {
      ...shiftData,
      payAmount: pay,
      hourlyRate: Number(shiftData.hourlyRate) || Math.round(pay / 6),
      platformFee: fee,
      totalCost: total,
      urgency: shiftData.urgency || 'EMERGENCY (Immediate)',
      status: 'open',
    };

    const res = await api.createShift(payload);
    const newShift = res.shift;
    setShifts((prev) => [newShift, ...prev.filter(s => s.id !== newShift.id)]);
    await refreshData();
    return newShift;
  };

  const addWorker = async (workerData: Partial<Worker>): Promise<Worker> => {
    const res = await api.createWorker(workerData);
    const newWorker = res.worker;
    setWorkers((prev) => [newWorker, ...prev.filter(w => w.id !== newWorker.id)]);
    await refreshData();
    return newWorker;
  };

  const deleteShift = async (shiftId: string): Promise<void> => {
    await api.deleteShift(shiftId);
    setShifts((prev) => prev.filter((s) => s.id !== shiftId));
    await refreshData();
  };

  const clearAllData = async (): Promise<void> => {
    await api.clearDatabase();
    setShifts([]);
    setWorkers([]);
    setAttendanceLogs([]);
    setRatings([]);
  };

  const startOfferCascade = async (shiftId: string, candidateWorkerIds?: string[]): Promise<void> => {
    const res = await api.launchCascade(shiftId, candidateWorkerIds);
    setShifts((prev) => prev.map((s) => (s.id === shiftId ? res.shift : s)));
    await refreshData();
  };

  const acceptShiftOffer = async (shiftId: string, workerId: string): Promise<void> => {
    const res = await api.acceptShift(shiftId, workerId);
    setShifts((prev) => prev.map((s) => (s.id === shiftId ? res.shift : s)));
    setWorkers((prev) => prev.map((w) => (w.id === workerId ? { ...w, activeShiftId: shiftId } : w)));
    await refreshData();
  };

  const declineShiftOffer = async (shiftId: string, workerId: string): Promise<void> => {
    const res = await api.declineShift(shiftId, workerId);
    setShifts((prev) => prev.map((s) => (s.id === shiftId ? res.shift : s)));
    await refreshData();
  };

  const advanceCascadeTimerManually = async (shiftId: string): Promise<void> => {
    const shift = shifts.find((s) => s.id === shiftId);
    if (!shift || !shift.cascadeCandidates) return;

    const currIdx = shift.currentCascadeIndex || 0;
    const currentCandidate = shift.cascadeCandidates[currIdx];
    if (currentCandidate) {
      await declineShiftOffer(shiftId, currentCandidate.workerId);
    }
  };

  const checkInWorkerQR = async (shiftId: string, workerId: string, qrCodeSecret: string) => {
    try {
      const res = await api.scanQRCode({
        shiftId,
        workerId,
        qrCodeSecret,
        scanType: 'check_in',
      });
      setShifts((prev) => prev.map((s) => (s.id === shiftId ? res.shift : s)));
      if (res.attendance) {
        setAttendanceLogs((prev) => [res.attendance!, ...prev.filter(a => a.id !== res.attendance!.id)]);
      }
      await refreshData();
      return { success: true, message: res.message, attendance: res.attendance };
    } catch (err: any) {
      return { success: false, message: err.message || 'QR Check-in verification failed' };
    }
  };

  const checkOutWorkerQR = async (shiftId: string, workerId: string) => {
    try {
      const shift = shifts.find((s) => s.id === shiftId);
      const res = await api.scanQRCode({
        shiftId,
        workerId,
        qrCodeSecret: shift?.qrCodeSecret || '',
        scanType: 'check_out',
      });
      setShifts((prev) => prev.map((s) => (s.id === shiftId ? res.shift : s)));
      if (res.attendance) {
        setAttendanceLogs((prev) => [res.attendance!, ...prev.filter(a => a.id !== res.attendance!.id)]);
      }
      await refreshData();
      return { success: true, message: res.message, attendance: res.attendance };
    } catch (err: any) {
      return { success: false, message: err.message || 'QR Check-out verification failed' };
    }
  };

  const submitShiftRating = async (data: {
    shiftId: string;
    fromUserId: string;
    fromUserName: string;
    toUserId: string;
    toUserName: string;
    rating: number;
    review: string;
    tags: string[];
  }) => {
    const res = await api.submitRating(data);
    setRatings((prev) => [res.rating, ...prev]);
    await refreshData();
  };

  const updateWorkerVerification = async (workerId: string, status: 'verified' | 'rejected') => {
    const res = await api.updateWorker(workerId, { verificationStatus: status });
    setWorkers((prev) => prev.map((w) => (w.id === workerId ? res.worker : w)));
    await refreshData();
  };

  const getShiftById = (id: string) => shifts.find((s) => s.id === id);
  const getWorkerById = (id: string) => workers.find((w) => w.id === id || w.userId === id);

  const activeOfferForWorker = (workerId: string) => {
    for (const s of shifts) {
      if (s.status === 'cascading' && s.cascadeCandidates) {
        const candidate = s.cascadeCandidates[s.currentCascadeIndex || 0];
        if (candidate && (candidate.workerId === workerId || candidate.workerId === workerId) && candidate.status === 'offered') {
          return { shift: s, candidate };
        }
      }
    }
    return null;
  };

  // Real-time Analytics from MongoDB data
  const completedCount = shifts.filter((s) => s.status === 'completed').length;
  const activeCount = shifts.filter((s) => ['cascading', 'assigned', 'in_progress'].includes(s.status)).length;
  const totalVolumeGross = shifts.reduce((acc, s) => acc + (s.status === 'completed' ? s.payAmount : 0), 0);
  const platformRevenueFee = Math.round(totalVolumeGross * 0.10 * 100) / 100;
  const fillRate = shifts.length > 0 ? Math.round((completedCount / shifts.length) * 1000) / 10 : 0;
  const avgRel = workers.length > 0 ? Math.round((workers.reduce((acc, w) => acc + (w.reliabilityScore || 95), 0) / workers.length) * 10) / 10 : 0;

  const analytics: PlatformAnalytics = {
    totalShifts: shifts.length,
    completedShifts: completedCount,
    activeShifts: activeCount,
    averageMatchTimeSeconds: 142,
    fillRatePercentage: fillRate,
    totalVolumeGross, // In INR ₹
    platformRevenueFee, // 10% in INR ₹
    totalWorkers: workers.length,
    totalBusinesses: Array.from(new Set(shifts.map((s) => s.businessId))).length,
    averageReliability: avgRel,
  };

  return (
    <ShiftContext.Provider
      value={{
        shifts,
        workers,
        attendanceLogs,
        ratings,
        analytics,
        isLoading,
        dbError,
        isDbConnected,
        refreshData,
        createShift,
        addWorker,
        deleteShift,
        clearAllData,
        startOfferCascade,
        acceptShiftOffer,
        declineShiftOffer,
        checkInWorkerQR,
        checkOutWorkerQR,
        submitShiftRating,
        getShiftById,
        getWorkerById,
        updateWorkerVerification,
        activeOfferForWorker,
        advanceCascadeTimerManually,
      }}
    >
      {children}
    </ShiftContext.Provider>
  );
};

export const useShifts = () => {
  const context = useContext(ShiftContext);
  if (!context) {
    throw new Error('useShifts must be used within a ShiftProvider');
  }
  return context;
};
