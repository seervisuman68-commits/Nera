import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useShifts } from '../context/ShiftContext';
import { useAuth } from '../context/AuthContext';
import { QRGeneratorModal } from '../components/qr/QRGeneratorModal';
import { RatingModal } from '../components/rating/RatingModal';
import { CascadeStatusWidget } from '../components/cascade/CascadeStatusWidget';
import {
  ShieldCheck,
  Zap,
  Clock,
  CheckCircle2,
  PhoneCall,
  QrCode,
  MapPin,
  AlertTriangle,
  Star,
  Users,
  Building,
  RefreshCw,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const LiveShiftMonitorPage: React.FC = () => {
  const { shiftId } = useParams<{ shiftId: string }>();
  const { shifts, workers, checkOutWorkerQR } = useShifts();
  const { currentUser } = useAuth();

  const [showQR, setShowQR] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(1420); // Demo elapsed timer

  const shift = shifts.find((s) => s.id === shiftId) || shifts[0];

  useEffect(() => {
    if (shift?.status === 'in_progress') {
      const timer = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [shift?.status]);

  if (!shift) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-800">Shift not found</h2>
        <Link to="/active-shifts" className="text-sm font-bold text-blue-600 mt-3 inline-block">
          Return to active shifts
        </Link>
      </div>
    );
  }

  const primaryWorker = workers.find((w) => w.id === shift.assignedWorkerId);
  const backupWorker = workers.find((w) => w.id === shift.backupWorkerId);

  const formatTimer = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs > 0 ? `${hrs}h ` : ''}${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  const handleManualComplete = () => {
    if (shift.assignedWorkerId) {
      checkOutWorkerQR(shift.id, shift.assignedWorkerId);
      try {
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
      } catch {}
      setShowRating(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner Control Room */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Live Mission Control Room • Shift #{shift.id}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white">{shift.role} Replacement</h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1">
            {shift.businessName} • 📍 {shift.location.address} • 📅 {shift.date}
          </p>
        </div>

        {/* Live Timer & QR Action */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700 text-center min-w-[130px]">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Shift Timer</span>
            <span className="text-lg font-mono font-bold text-emerald-400">
              {shift.status === 'in_progress' ? formatTimer(elapsedSeconds) : shift.status.toUpperCase()}
            </span>
          </div>

          <button
            onClick={() => setShowQR(true)}
            className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all"
          >
            <QrCode className="w-4 h-4" />
            <span>Generate Check-in QR</span>
          </button>
        </div>
      </div>

      {/* Offer Cascade Status if cascading */}
      {shift.status === 'cascading' && (
        <div>
          <CascadeStatusWidget shift={shift} />
        </div>
      )}

      {/* Shift Lifecycle Pipeline */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
          Emergency Shift Progression
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[
            {
              step: '1. Match & Cascade',
              done: ['cascading', 'assigned', 'in_progress', 'completed'].includes(shift.status),
              active: shift.status === 'cascading',
            },
            {
              step: '2. Worker Confirmed',
              done: ['assigned', 'in_progress', 'completed'].includes(shift.status),
              active: shift.status === 'assigned',
            },
            {
              step: '3. QR Check-In (Live)',
              done: ['in_progress', 'completed'].includes(shift.status),
              active: shift.status === 'in_progress',
            },
            {
              step: '4. Completed & Paid',
              done: shift.status === 'completed',
              active: shift.status === 'completed',
            },
          ].map((s, idx) => (
            <div
              key={s.step}
              className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
                s.active
                  ? 'bg-blue-50 border-blue-400 text-blue-900 font-bold shadow-xs'
                  : s.done
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-slate-50 border-slate-200 text-slate-400'
              }`}
            >
              {s.done ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-slate-300 text-slate-500 flex items-center justify-center text-[10px] font-bold">
                  {idx + 1}
                </div>
              )}
              <span className="text-xs">{s.step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Two-Column Staff Grid: Primary Worker vs Backup Worker */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Primary Worker Card */}
        <div className="bg-white rounded-3xl border-2 border-emerald-400 p-6 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              ⚡ PRIMARY ON-SITE WORKER
            </span>
            <span className="text-xs font-bold text-emerald-600">
              {shift.status === 'in_progress' ? '🟢 Checked-In' : 'Assigned (En Route)'}
            </span>
          </div>

          {primaryWorker ? (
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <img
                  src={primaryWorker.avatar}
                  alt={primaryWorker.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-400 shadow-xs"
                />
                <div>
                  <h3 className="text-lg font-black text-slate-900">{primaryWorker.name}</h3>
                  <p className="text-xs text-slate-500 font-medium">{primaryWorker.role}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-600 mt-1">
                    <span className="flex items-center gap-1 font-bold text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      {primaryWorker.ratingAvg} ({primaryWorker.totalRatings} Reviews)
                    </span>
                    <span>•</span>
                    <span className="text-emerald-700 font-bold">
                      {primaryWorker.reliabilityScore}% Reliability
                    </span>
                  </div>
                </div>
              </div>

              {/* Skills and Badges */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Verified Skills:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {primaryWorker.skills.map((sk) => (
                    <span key={sk} className="text-xs px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-medium">
                      ✓ {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Live Shift Actions */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <a
                  href={`tel:${primaryWorker.phone}`}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
                  Call Worker ({primaryWorker.phone})
                </a>

                {shift.status === 'in_progress' ? (
                  <button
                    onClick={handleManualComplete}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Complete Shift & Rate
                  </button>
                ) : (
                  <button
                    onClick={() => setShowQR(true)}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    Scan Check-In QR
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 space-y-2 text-slate-400">
              <Users className="w-8 h-8 mx-auto" />
              <p className="text-xs">Waiting for cascade acceptance...</p>
            </div>
          )}
        </div>

        {/* Backup Worker Card */}
        <div className="bg-white rounded-3xl border border-indigo-200 p-6 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
              🛡️ AUTO-RESERVED BACKUP WORKER
            </span>
            <span className="text-xs font-semibold text-slate-500">Standby Protection</span>
          </div>

          {backupWorker ? (
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <img
                  src={backupWorker.avatar}
                  alt={backupWorker.name}
                  className="w-16 h-16 rounded-2xl object-cover border border-slate-200"
                />
                <div>
                  <h3 className="text-lg font-black text-slate-900">{backupWorker.name}</h3>
                  <p className="text-xs text-slate-500 font-medium">{backupWorker.role}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-600 mt-1">
                    <span className="text-indigo-700 font-bold">
                      {backupWorker.reliabilityScore}% Reliability Score
                    </span>
                    <span>•</span>
                    <span className="text-slate-500">0.9 km distance</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-100 text-xs text-indigo-900 leading-relaxed">
                ℹ️ If the primary worker experiences a transit delay or emergency, 1-click swap instantly activates <strong>{backupWorker.name}</strong> with zero search delay.
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => alert(`Simulated swap: ${backupWorker.name} promoted to Primary Worker!`)}
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Swap to Backup Worker (Emergency Override)
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 space-y-2 text-slate-400">
              <ShieldCheck className="w-8 h-8 mx-auto" />
              <p className="text-xs">Backup worker assigned once cascade completes.</p>
            </div>
          )}
        </div>
      </div>

      {/* QR Generator Modal */}
      {showQR && (
        <QRGeneratorModal shift={shift} isOpen={showQR} onClose={() => setShowQR(false)} />
      )}

      {/* Rating Modal */}
      {showRating && (
        <RatingModal shift={shift} isOpen={showRating} onClose={() => setShowRating(false)} />
      )}
    </div>
  );
};
