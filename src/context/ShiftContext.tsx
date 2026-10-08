import React, { createContext, useContext, useState, useEffect, useTransition } from 'react';
import type { Shift, Worker, AttendanceRecord, Rating, PlatformAnalytics, CascadeCandidate, ShiftStatus } from '../types';
import { rankWorkersForShift } from '../utils/matchingEngine';
import { calculateReliabilityScore } from '../utils/reliabilityScore';
import {
  createFirestoreShift,
  updateFirestoreShift,
  createFirestoreWorker,
  updateFirestoreWorker,
  recordFirestoreAttendance,
  createFirestoreRating,
} from '../services/firestoreService';

interface ShiftContextType {
  shifts: Shift[];
  workers: Worker[];
  attendanceLogs: AttendanceRecord[];
  ratings: Rating[];
  analytics: PlatformAnalytics;
  createShift: (shiftData: Partial<Shift>) => Shift;
  addWorker: (workerData: Partial<Worker>) => Worker;
  deleteShift: (shiftId: string) => void;
  clearAllData: () => void;
  startOfferCascade: (shiftId: string, candidateWorkerIds?: string[]) => void;
  acceptShiftOffer: (shiftId: string, workerId: string) => void;
  declineShiftOffer: (shiftId: string, workerId: string) => void;
  checkInWorkerQR: (shiftId: string, workerId: string, qrCodeSecret: string) => { success: boolean; message: string };
  checkOutWorkerQR: (shiftId: string, workerId: string) => { success: boolean; message: string };
  submitShiftRating: (shiftId: string, rating: number, review: string, tags: string[]) => void;
  getShiftById: (id: string) => Shift | undefined;
  getWorkerById: (id: string) => Worker | undefined;
  updateWorkerVerification: (workerId: string, status: 'verified' | 'rejected') => void;
  activeOfferForWorker: (workerId: string) => { shift: Shift; candidate: CascadeCandidate } | null;
  advanceCascadeTimerManually: (shiftId: string) => void;
}

const ShiftContext = createContext<ShiftContextType | undefined>(undefined);

export const ShiftProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [shifts, setShifts] = useState<Shift[]>(() => {
    const saved = localStorage.getItem('nera_shifts');
    return saved ? JSON.parse(saved) : [];
  });

  const [workers, setWorkers] = useState<Worker[]>(() => {
    const saved = localStorage.getItem('nera_workers');
    return saved ? JSON.parse(saved) : [];
  });

  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('nera_attendance');
    return saved ? JSON.parse(saved) : [];
  });

  const [ratings, setRatings] = useState<Rating[]>(() => {
    const saved = localStorage.getItem('nera_ratings');
    return saved ? JSON.parse(saved) : [];
  });

  const [, startTransition] = useTransition();

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('nera_shifts', JSON.stringify(shifts));
  }, [shifts]);

  useEffect(() => {
    localStorage.setItem('nera_workers', JSON.stringify(workers));
  }, [workers]);

  useEffect(() => {
    localStorage.setItem('nera_attendance', JSON.stringify(attendanceLogs));
  }, [attendanceLogs]);

  useEffect(() => {
    localStorage.setItem('nera_ratings', JSON.stringify(ratings));
  }, [ratings]);

  // Offer cascade timer tick
  useEffect(() => {
    const interval = setInterval(() => {
      setShifts((prevShifts): Shift[] => {
        let changed = false;
        const now = Date.now();

        const updated: Shift[] = prevShifts.map((shift): Shift => {
          if (shift.status === 'cascading' && shift.cascadeCandidates.length > 0) {
            const currentIndex = shift.currentCascadeIndex;
            const currentCandidate = shift.cascadeCandidates[currentIndex];

            if (currentCandidate && currentCandidate.status === 'offered' && currentCandidate.expiresAt) {
              const expiresAtMs = new Date(currentCandidate.expiresAt).getTime();
              if (now >= expiresAtMs) {
                changed = true;
                const updatedCandidates: CascadeCandidate[] = [...shift.cascadeCandidates];
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
                    status: 'cascading' as ShiftStatus,
                    cascadeCandidates: updatedCandidates,
                    currentCascadeIndex: nextIndex,
                  };
                } else {
                  return {
                    ...shift,
                    status: 'open' as ShiftStatus,
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

  const createShift = (shiftData: Partial<Shift>): Shift => {
    const pay = shiftData.payAmount || 120.0;
    const fee = Math.round(pay * 0.10 * 100) / 100;
    const total = pay + fee;

    const newShift: Shift = {
      id: `shift-${Date.now()}`,
      businessId: shiftData.businessId || `biz-${Date.now()}`,
      businessName: shiftData.businessName || 'My Business',
      businessCategory: shiftData.businessCategory || 'café',
      role: shiftData.role || 'Shift Role',
      requiredSkills: shiftData.requiredSkills || ['Customer Service'],
      date: shiftData.date || new Date().toISOString().split('T')[0],
      startTime: shiftData.startTime || '09:00 AM',
      endTime: shiftData.endTime || '05:00 PM',
      location: shiftData.location || {
        address: '123 Main Street',
        latitude: 40.7248,
        longitude: -73.9984,
      },
      payAmount: pay,
      hourlyRate: shiftData.hourlyRate || Math.round(pay / 5),
      platformFee: fee,
      totalCost: total,
      urgency: shiftData.urgency || 'EMERGENCY (Immediate)',
      notes: shiftData.notes || '',
      status: 'open',
      cascadeCandidates: [],
      currentCascadeIndex: 0,
      qrCodeSecret: `NERA_SHIFT_${Math.floor(1000 + Math.random() * 9000)}_SEC`,
      createdAt: new Date().toISOString(),
    };

    startTransition(() => {
      setShifts((prev) => [newShift, ...prev]);
    });

    createFirestoreShift(newShift).catch(console.warn);

    return newShift;
  };

  const addWorker = (workerData: Partial<Worker>): Worker => {
    const newWorker: Worker = {
      id: `worker-${Date.now()}`,
      userId: workerData.userId || `user-${Date.now()}`,
      name: workerData.name || 'New Worker',
      role: workerData.role || 'Staff',
      avatar: workerData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      phone: workerData.phone || '+1 (555) 000-0000',
      bio: workerData.bio || 'Verified professional.',
      skills: workerData.skills || ['Customer Service'],
      experienceYears: workerData.experienceYears || 2,
      reliabilityScore: workerData.reliabilityScore || 96.0,
      isAvailable: workerData.isAvailable !== undefined ? workerData.isAvailable : true,
      availabilityStatus: workerData.availabilityStatus || 'Available Now',
      location: workerData.location || {
        latitude: 40.7285,
        longitude: -73.9942,
        address: 'Downtown (1.0 km away)',
      },
      verificationStatus: workerData.verificationStatus || 'verified',
      ratingAvg: workerData.ratingAvg || 5.0,
      totalRatings: workerData.totalRatings || 1,
      totalShiftsCompleted: workerData.totalShiftsCompleted || 0,
      hourlyRate: workerData.hourlyRate || 25.0,
      badges: workerData.badges || ['Verified Passport ✅', 'Quick Responder ⚡'],
      punctualityRate: workerData.punctualityRate || 100,
      completionRate: workerData.completionRate || 100,
      cancellationRate: workerData.cancellationRate || 0,
      earningsTotal: workerData.earningsTotal || 0,
    };

    setWorkers((prev) => [newWorker, ...prev]);
    createFirestoreWorker(newWorker).catch(console.warn);

    return newWorker;
  };

  const deleteShift = (shiftId: string) => {
    setShifts((prev) => prev.filter((s) => s.id !== shiftId));
  };

  const clearAllData = () => {
    setShifts([]);
    setWorkers([]);
    setAttendanceLogs([]);
    setRatings([]);
    localStorage.removeItem('nera_shifts');
    localStorage.removeItem('nera_workers');
    localStorage.removeItem('nera_attendance');
    localStorage.removeItem('nera_ratings');
  };

  const startOfferCascade = (shiftId: string, candidateWorkerIds?: string[]) => {
    setShifts((prevShifts): Shift[] => {
      return prevShifts.map((shift): Shift => {
        if (shift.id === shiftId) {
          let rankedCandidates: CascadeCandidate[] = [];

          if (candidateWorkerIds && candidateWorkerIds.length > 0) {
            rankedCandidates = candidateWorkerIds.map((wId, idx) => {
              const worker = workers.find((w) => w.id === wId);
              return {
                workerId: wId,
                workerName: worker?.name || 'Candidate',
                workerAvatar: worker?.avatar || '',
                matchScore: 95 - idx * 5,
                status: (idx === 0 ? 'offered' : 'pending') as CascadeCandidate['status'],
                offeredAt: idx === 0 ? new Date().toISOString() : undefined,
                expiresAt: idx === 0 ? new Date(Date.now() + 120000).toISOString() : undefined,
              };
            });
          } else {
            const ranked = rankWorkersForShift(workers, shift);
            rankedCandidates = ranked.map((match, idx) => ({
              workerId: match.worker.id,
              workerName: match.worker.name,
              workerAvatar: match.worker.avatar,
              matchScore: match.totalScore,
              status: (idx === 0 ? 'offered' : 'pending') as CascadeCandidate['status'],
              offeredAt: idx === 0 ? new Date().toISOString() : undefined,
              expiresAt: idx === 0 ? new Date(Date.now() + 120000).toISOString() : undefined,
            }));
          }

          const updatedShift: Shift = {
            ...shift,
            status: 'cascading' as ShiftStatus,
            cascadeCandidates: rankedCandidates,
            currentCascadeIndex: 0,
          };

          updateFirestoreShift(shiftId, updatedShift).catch(console.warn);

          return updatedShift;
        }
        return shift;
      });
    });
  };

  const acceptShiftOffer = (shiftId: string, workerId: string) => {
    const worker = workers.find((w) => w.id === workerId);
    if (!worker) return;

    setShifts((prevShifts): Shift[] => {
      return prevShifts.map((shift): Shift => {
        if (shift.id === shiftId) {
          const updatedCandidates: CascadeCandidate[] = shift.cascadeCandidates.map((c) => {
            if (c.workerId === workerId) {
              return { ...c, status: 'accepted' as const };
            }
            return c;
          });

          const otherCandidates = shift.cascadeCandidates.filter((c) => c.workerId !== workerId);
          const backupWorker = otherCandidates.length > 0 ? workers.find((w) => w.id === otherCandidates[0].workerId) : undefined;

          const updatedShift: Shift = {
            ...shift,
            status: 'assigned' as ShiftStatus,
            assignedWorkerId: worker.id,
            assignedWorkerName: worker.name,
            backupWorkerId: backupWorker?.id,
            backupWorkerName: backupWorker?.name,
            cascadeCandidates: updatedCandidates,
          };

          updateFirestoreShift(shiftId, updatedShift).catch(console.warn);

          return updatedShift;
        }
        return shift;
      });
    });

    setWorkers((prevWorkers) =>
      prevWorkers.map((w) => (w.id === workerId ? { ...w, activeShiftId: shiftId } : w))
    );
  };

  const declineShiftOffer = (shiftId: string, workerId: string) => {
    setShifts((prevShifts): Shift[] => {
      return prevShifts.map((shift): Shift => {
        if (shift.id === shiftId && shift.status === 'cascading') {
          const updatedCandidates = [...shift.cascadeCandidates];
          const currIdx = shift.currentCascadeIndex;

          if (updatedCandidates[currIdx] && updatedCandidates[currIdx].workerId === workerId) {
            updatedCandidates[currIdx] = {
              ...updatedCandidates[currIdx],
              status: 'rejected',
            };

            const nextIdx = currIdx + 1;
            if (nextIdx < updatedCandidates.length) {
              updatedCandidates[nextIdx] = {
                ...updatedCandidates[nextIdx],
                status: 'offered',
                offeredAt: new Date().toISOString(),
                expiresAt: new Date(Date.now() + 120000).toISOString(),
              };
              return {
                ...shift,
                status: 'cascading' as ShiftStatus,
                cascadeCandidates: updatedCandidates,
                currentCascadeIndex: nextIdx,
              };
            } else {
              return {
                ...shift,
                status: 'open' as ShiftStatus,
                cascadeCandidates: updatedCandidates,
              };
            }
          }
        }
        return shift;
      });
    });
  };

  const advanceCascadeTimerManually = (shiftId: string) => {
    setShifts((prevShifts): Shift[] => {
      return prevShifts.map((shift): Shift => {
        if (shift.id === shiftId && shift.status === 'cascading') {
          const currIdx = shift.currentCascadeIndex;
          const updatedCandidates = [...shift.cascadeCandidates];

          if (updatedCandidates[currIdx]) {
            updatedCandidates[currIdx] = {
              ...updatedCandidates[currIdx],
              status: 'expired',
            };
          }

          const nextIdx = currIdx + 1;
          if (nextIdx < updatedCandidates.length) {
            updatedCandidates[nextIdx] = {
              ...updatedCandidates[nextIdx],
              status: 'offered',
              offeredAt: new Date().toISOString(),
              expiresAt: new Date(Date.now() + 120000).toISOString(),
            };
            return {
              ...shift,
              status: 'cascading' as ShiftStatus,
              cascadeCandidates: updatedCandidates,
              currentCascadeIndex: nextIdx,
            };
          } else {
            return {
              ...shift,
              status: 'open' as ShiftStatus,
              cascadeCandidates: updatedCandidates,
            };
          }
        }
        return shift;
      });
    });
  };

  const checkInWorkerQR = (shiftId: string, workerId: string, qrCodeSecret: string) => {
    const shift = shifts.find((s) => s.id === shiftId);
    if (!shift) return { success: false, message: 'Shift not found' };

    if (shift.qrCodeSecret !== qrCodeSecret) {
      return { success: false, message: 'Invalid QR Code secret. Please scan the official business QR.' };
    }

    const worker = workers.find((w) => w.id === workerId);
    const nowIso = new Date().toISOString();

    setShifts((prev) =>
      prev.map((s) => (s.id === shiftId ? { ...s, status: 'in_progress', checkInTime: nowIso } : s))
    );

    const newAttendance: AttendanceRecord = {
      id: `att-${Date.now()}`,
      shiftId: shift.id,
      workerId: workerId,
      workerName: worker?.name || 'Worker',
      businessId: shift.businessId,
      businessName: shift.businessName,
      role: shift.role,
      checkInTime: nowIso,
      status: 'checked_in',
      verifiedBy: 'qr_scan',
      locationVerified: true,
      date: shift.date,
    };

    setAttendanceLogs((prev) => [newAttendance, ...prev]);
    recordFirestoreAttendance(newAttendance).catch(console.warn);

    return { success: true, message: `Check-in verified at ${shift.businessName}! Shift is now live.` };
  };

  const checkOutWorkerQR = (shiftId: string, workerId: string) => {
    const shift = shifts.find((s) => s.id === shiftId);
    if (!shift) return { success: false, message: 'Shift not found' };

    const nowIso = new Date().toISOString();

    setShifts((prev) =>
      prev.map((s) => (s.id === shiftId ? { ...s, status: 'completed', checkOutTime: nowIso } : s))
    );

    setAttendanceLogs((prev) =>
      prev.map((log) =>
        log.shiftId === shiftId && log.workerId === workerId
          ? { ...log, checkOutTime: nowIso, status: 'completed' }
          : log
      )
    );

    setWorkers((prevWorkers) =>
      prevWorkers.map((w) => {
        if (w.id === workerId) {
          const totalShifts = w.totalShiftsCompleted + 1;
          const newEarnings = w.earningsTotal + shift.payAmount;
          const updated = {
            ...w,
            totalShiftsCompleted: totalShifts,
            earningsTotal: newEarnings,
            activeShiftId: undefined,
          };
          updateFirestoreWorker(workerId, updated).catch(console.warn);
          return updated;
        }
        return w;
      })
    );

    return { success: true, message: `Shift successfully completed! Payment of $${shift.payAmount} unlocked.` };
  };

  const submitShiftRating = (shiftId: string, rating: number, review: string, tags: string[]) => {
    const shift = shifts.find((s) => s.id === shiftId);
    if (!shift || !shift.assignedWorkerId) return;

    const newRating: Rating = {
      id: `rat-${Date.now()}`,
      shiftId,
      fromUserId: shift.businessId,
      fromUserName: shift.businessName,
      toUserId: shift.assignedWorkerId,
      toUserName: shift.assignedWorkerName || 'Worker',
      rating,
      review,
      tags,
      createdAt: new Date().toISOString(),
    };

    setRatings((prev) => [newRating, ...prev]);
    createFirestoreRating(newRating).catch(console.warn);

    setWorkers((prevWorkers) =>
      prevWorkers.map((w) => {
        if (w.id === shift.assignedWorkerId) {
          const newTotalRatings = w.totalRatings + 1;
          const newAvg = (w.ratingAvg * w.totalRatings + rating) / newTotalRatings;
          
          const newReliability = calculateReliabilityScore({
            totalCompletedShifts: w.totalShiftsCompleted,
            totalAssignedShifts: w.totalShiftsCompleted,
            onTimeArrivals: w.totalShiftsCompleted,
            cancellations: 0,
            lateArrivals: 0,
            noShows: 0,
          });

          const updatedWorker = {
            ...w,
            ratingAvg: Math.round(newAvg * 100) / 100,
            totalRatings: newTotalRatings,
            reliabilityScore: newReliability,
          };

          updateFirestoreWorker(w.id, updatedWorker).catch(console.warn);

          return updatedWorker;
        }
        return w;
      })
    );
  };

  const updateWorkerVerification = (workerId: string, status: 'verified' | 'rejected') => {
    setWorkers((prev) =>
      prev.map((w) => (w.id === workerId ? { ...w, verificationStatus: status } : w))
    );
    updateFirestoreWorker(workerId, { verificationStatus: status }).catch(console.warn);
  };

  const getShiftById = (id: string) => shifts.find((s) => s.id === id);
  const getWorkerById = (id: string) => workers.find((w) => w.id === id);

  const activeOfferForWorker = (workerId: string) => {
    for (const s of shifts) {
      if (s.status === 'cascading') {
        const candidate = s.cascadeCandidates[s.currentCascadeIndex];
        if (candidate && candidate.workerId === workerId && candidate.status === 'offered') {
          return { shift: s, candidate };
        }
      }
    }
    return null;
  };

  const totalVolumeGross = shifts.reduce((acc, s) => acc + (s.status === 'completed' ? s.payAmount : 0), 0);
  const platformRevenueFee = Math.round(totalVolumeGross * 0.10 * 100) / 100;
  const completedCount = shifts.filter((s) => s.status === 'completed').length;
  const activeCount = shifts.filter((s) => ['cascading', 'assigned', 'in_progress'].includes(s.status)).length;
  const avgRel = workers.length > 0 ? workers.reduce((acc, w) => acc + w.reliabilityScore, 0) / workers.length : 95.0;

  const analytics: PlatformAnalytics = {
    totalShifts: shifts.length,
    completedShifts: completedCount,
    activeShifts: activeCount,
    averageMatchTimeSeconds: 142,
    fillRatePercentage: 98.2,
    totalVolumeGross,
    platformRevenueFee,
    totalWorkers: workers.length,
    totalBusinesses: 12,
    averageReliability: Math.round(avgRel * 10) / 10,
  };

  return (
    <ShiftContext.Provider
      value={{
        shifts,
        workers,
        attendanceLogs,
        ratings,
        analytics,
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
