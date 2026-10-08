import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useShifts } from '../context/ShiftContext';
import { formatINR, formatHourlyINR } from '../utils/currency';
import {
  Bell,
  Clock,
  MapPin,
  Building,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Zap,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ShiftOfferPage: React.FC = () => {
  const { currentWorker, switchDemoUser } = useAuth();
  const { shifts, acceptShiftOffer, declineShiftOffer, activeOfferForWorker } = useShifts();
  const navigate = useNavigate();

  const [remainingSec, setRemainingSec] = useState(120);

  const activeOffer = currentWorker ? activeOfferForWorker(currentWorker.id) : null;
  const currentShift = activeOffer?.shift;

  useEffect(() => {
    if (!activeOffer || !activeOffer.candidate.expiresAt) return;

    const timer = setInterval(() => {
      const exp = new Date(activeOffer.candidate.expiresAt!).getTime();
      const diff = Math.max(0, Math.floor((exp - Date.now()) / 1000));
      setRemainingSec(diff);
    }, 1000);

    return () => clearInterval(timer);
  }, [activeOffer]);

  if (!currentWorker) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-800">Please switch to a worker persona to view offers</h2>
        <button
          onClick={() => switchDemoUser('user-w1')}
          className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
        >
          Switch to Jordan (Worker)
        </button>
      </div>
    );
  }

  const handleAccept = async () => {
    if (!currentShift) return;
    try {
      await acceptShiftOffer(currentShift.id, currentWorker.id);
      try {
        confetti({
          particleCount: 110,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#10b981', '#2563eb', '#f59e0b', '#8b5cf6'],
        });
      } catch {}

      setTimeout(() => {
        navigate('/worker-dashboard');
      }, 800);
    } catch (err) {
      console.error('Accept offer error:', err);
    }
  };

  const handleDecline = async () => {
    if (!currentShift) return;
    try {
      await declineShiftOffer(currentShift.id, currentWorker.id);
      navigate('/worker-dashboard');
    } catch (err) {
      console.error('Decline offer error:', err);
    }
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
          Instant Job Dispatch
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
          Emergency Shift Offer
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          NERA's Smart Match engine prioritized you for this urgent shift replacement.
        </p>
      </div>

      {!currentShift ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Bell className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No Pending Shift Offers For You</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You are currently on standby with status: <strong className="text-emerald-600">{currentWorker.availabilityStatus}</strong>.
            New emergency shifts will ping you immediately.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <Link
              to="/create-shift"
              onClick={() => switchDemoUser('user-b1')}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
            >
              Post Shift as Business to Test Offer Cascade →
            </Link>
            <Link
              to="/worker-dashboard"
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border-2 border-rose-500 shadow-2xl overflow-hidden animate-scale-up">
          {/* Top Live Countdown Banner */}
          <div className="bg-gradient-to-r from-rose-600 via-amber-600 to-rose-700 px-6 py-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 animate-spin" />
              <span className="font-bold text-sm">Response Window Countdown:</span>
            </div>
            <div className="px-3 py-1 rounded-xl bg-white/20 text-white font-mono font-black text-base tracking-wider">
              {formatTimer(remainingSec)}
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Business & Role Summary */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
              <div>
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                  {currentShift.urgency}
                </span>
                <h2 className="text-2xl font-black text-slate-900 mt-2">{currentShift.role}</h2>
                <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-1">
                  <Building className="w-4 h-4 text-blue-600" />
                  <span>{currentShift.businessName}</span>
                </p>
              </div>

              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-right sm:text-right">
                <span className="text-[10px] uppercase font-bold text-emerald-800 block">Total Shift Compensation</span>
                <span className="text-3xl font-black text-emerald-600">{formatINR(currentShift.payAmount)}</span>
                <span className="block text-xs font-semibold text-emerald-700 mt-0.5">
                  ({formatHourlyINR(currentShift.hourlyRate)} • Guaranteed)
                </span>
              </div>
            </div>

            {/* Shift Logistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">Shift Schedule</span>
                <div className="font-bold text-sm text-slate-800">
                  📅 {currentShift.date}
                </div>
                <div className="text-xs text-slate-600 font-semibold">
                  ⏱️ {currentShift.startTime} - {currentShift.endTime}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">Venue Location</span>
                <div className="font-bold text-sm text-slate-800 flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-rose-500" />
                  <span>0.8 km from you</span>
                </div>
                <div className="text-xs text-slate-600 truncate">
                  {currentShift.location.address}
                </div>
              </div>
            </div>

            {/* Required Skills Match */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Required Shift Capabilities:
              </span>
              <div className="flex flex-wrap gap-2">
                {currentShift.requiredSkills.map((sk) => (
                  <span
                    key={sk}
                    className="px-3 py-1 rounded-xl bg-blue-50 text-blue-800 font-bold text-xs border border-blue-200 flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            {/* Manager Instructions */}
            {currentShift.notes && (
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 leading-relaxed">
                <strong className="block font-bold text-amber-950 mb-1">Manager Instructions:</strong>
                {currentShift.notes}
              </div>
            )}

            {/* Action Buttons: Accept / Decline */}
            <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={handleAccept}
                className="w-full sm:flex-1 py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 hover:scale-[1.02] transition-all"
              >
                <Sparkles className="w-5 h-5" />
                <span>Accept Shift ({formatINR(currentShift.payAmount)})</span>
              </button>

              <button
                onClick={handleDecline}
                className="w-full sm:w-auto py-4 px-6 rounded-2xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 font-bold text-sm border border-slate-200 hover:border-rose-300 transition-all flex items-center justify-center gap-2"
              >
                <XCircle className="w-4 h-4" />
                <span>Decline & Pass to Next Candidate</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
