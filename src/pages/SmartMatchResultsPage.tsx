import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useShifts } from '../context/ShiftContext';
import { rankWorkersForShift } from '../utils/matchingEngine';
import { formatINR, formatHourlyINR } from '../utils/currency';
import {
  Zap,
  ShieldCheck,
  MapPin,
  Clock,
  Sparkles,
  Award,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Flame,
  UserCheck,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const SmartMatchResultsPage: React.FC = () => {
  const { shiftId } = useParams<{ shiftId: string }>();
  const { shifts, workers, startOfferCascade } = useShifts();
  const navigate = useNavigate();

  const shift = shifts.find((s) => s.id === shiftId) || shifts[0];
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<string[]>([]);
  const [cascadeLaunched, setCascadeLaunched] = useState(false);

  if (!shift) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-800">No shift found</h2>
        <Link to="/create-shift" className="mt-4 inline-block text-sm text-blue-600 font-bold">
          Create a new shift
        </Link>
      </div>
    );
  }

  // Calculate weighted matches
  const rankedCandidates = rankWorkersForShift(workers, shift);

  const handleLaunchCascade = () => {
    startOfferCascade(shift.id, selectedCandidateIds.length > 0 ? selectedCandidateIds : undefined);
    setCascadeLaunched(true);
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2563eb', '#3b82f6', '#10b981', '#f59e0b'],
      });
    } catch {}

    setTimeout(() => {
      navigate(`/live-shift/${shift.id}`);
    }, 1200);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-widest mb-1.5">
            <Zap className="w-4 h-4 fill-blue-400" />
            <span>Smart Match Results • Weighted 5-Factor Ranking</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Top Verified Candidates for {shift.role}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            📍 {shift.location.address} • ⏰ {shift.startTime} - {shift.endTime} • 💰 {formatINR(shift.payAmount)}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleLaunchCascade}
            disabled={cascadeLaunched}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-sm shadow-xl shadow-emerald-500/20 hover:scale-105 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            <span>{cascadeLaunched ? 'Cascading Offers...' : 'Launch Offer Cascade (2-Min Timer)'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Algorithm Formula Legend */}
      <div className="bg-slate-900 text-slate-300 p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <span className="font-bold text-white flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
          Matching Formula:
        </span>
        <div className="flex flex-wrap items-center gap-3 font-mono text-[11px]">
          <span className="text-blue-400">30% Availability</span>
          <span>+</span>
          <span className="text-indigo-400">25% Skill Match</span>
          <span>+</span>
          <span className="text-teal-400">20% Distance (&lt;20km)</span>
          <span>+</span>
          <span className="text-emerald-400">15% Reliability</span>
          <span>+</span>
          <span className="text-amber-400">10% Experience</span>
        </div>
      </div>

      {/* Candidates List */}
      <div className="space-y-4">
        {rankedCandidates.map((cand, idx) => {
          const w = cand.worker;
          const isTopCandidate = idx === 0;

          return (
            <div
              key={w.id}
              className={`p-6 rounded-2xl border transition-all ${
                isTopCandidate
                  ? 'bg-white border-blue-400 shadow-lg ring-2 ring-blue-500/20'
                  : 'bg-white border-slate-200 shadow-xs hover:border-slate-300'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                {/* Left Profile Details */}
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <img
                      src={w.avatar}
                      alt={w.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-200"
                    />
                    <span className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                      #{idx + 1}
                    </span>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-black text-lg text-slate-900">{w.name}</h3>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {w.verificationStatus.toUpperCase()} PASSPORT
                      </span>
                      {isTopCandidate && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-200">
                          PRIMARY CASCADE CANDIDATE #1
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      {w.role} • {w.experienceYears} Years Exp • {w.totalShiftsCompleted} Shifts Done
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 mt-2">
                      <span className="flex items-center gap-1 font-semibold text-slate-700">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {cand.distanceKm} km away ({w.location.address})
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-emerald-700">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        {w.reliabilityScore}% Reliability ({w.punctualityRate}% On-Time)
                      </span>
                      <span className="font-semibold text-slate-800">
                        {formatHourlyINR(w.hourlyRate)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Total Score Badge & Score Breakdown */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 border-t lg:border-t-0 pt-4 lg:pt-0">
                  {/* Detailed Scores Matrix */}
                  <div className="grid grid-cols-5 gap-2 text-center">
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-bold block">Avail (30%)</span>
                      <span className="text-xs font-bold text-blue-600">{cand.availabilityScore}%</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-bold block">Skill (25%)</span>
                      <span className="text-xs font-bold text-indigo-600">{cand.skillScore}%</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-bold block">Dist (20%)</span>
                      <span className="text-xs font-bold text-teal-600">{cand.distanceScore}%</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-bold block">Rel (15%)</span>
                      <span className="text-xs font-bold text-emerald-600">{cand.reliabilityScore}%</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-bold block">Exp (10%)</span>
                      <span className="text-xs font-bold text-amber-600">{cand.experienceScore}%</span>
                    </div>
                  </div>

                  {/* Composite Match Badge */}
                  <div className="text-center min-w-[110px] p-3 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white shadow-md">
                    <span className="text-[10px] font-bold text-indigo-300 uppercase block">Composite</span>
                    <span className="text-2xl font-black text-emerald-400">{cand.totalScore}%</span>
                    <span className="text-[10px] text-slate-300 block font-medium">Match Score</span>
                  </div>
                </div>
              </div>

              {/* Skills breakdown tags */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="font-bold text-slate-600">Matching Skills:</span>
                  {cand.matchingSkills.map((sk) => (
                    <span
                      key={sk}
                      className="px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200"
                    >
                      ✓ {sk}
                    </span>
                  ))}
                  {cand.missingSkills.map((sk) => (
                    <span
                      key={sk}
                      className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-400 text-xs font-medium"
                    >
                      Missing: {sk}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  {w.badges.slice(0, 2).map((b) => (
                    <span key={b} className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
