import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useShifts } from '../context/ShiftContext';
import { getReliabilityTier } from '../utils/reliabilityScore';
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  Star,
  Clock,
  Briefcase,
  Share2,
  Download,
  Zap,
  Sparkles,
  MapPin,
  Building
} from 'lucide-react';

export const SkillPassportPage: React.FC = () => {
  const { currentWorker } = useAuth();
  const { ratings, attendanceLogs } = useShifts();

  if (!currentWorker) return null;

  const reliabilityTier = getReliabilityTier(currentWorker.reliabilityScore);
  const workerRatings = ratings.filter((r) => r.toUserId === currentWorker.id);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
            Digital Worker Credential
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Verified Skill Passport & Reliability
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Cryptographically signed attendance history, skill endorsements, and reliability metrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Digital Passport ID exported to clipboard / PDF summary!')}
            className="px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center gap-2 hover:bg-slate-800 transition-colors shadow-xs"
          >
            <Download className="w-4 h-4" />
            Export Passport
          </button>
        </div>
      </div>

      {/* Main Digital Passport Card */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-indigo-900/60 relative overflow-hidden">
        {/* Passport holographic watermark badge */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-gradient-to-br from-blue-500/10 to-teal-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-indigo-900/60 pb-8">
          <div className="flex items-start sm:items-center gap-5">
            <img
              src={currentWorker.avatar}
              alt={currentWorker.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-indigo-500/40 shadow-xl"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl sm:text-3xl font-black text-white">{currentWorker.name}</h2>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  {reliabilityTier.badge}
                </span>
              </div>
              <p className="text-sm text-indigo-200 mt-1 font-medium">{currentWorker.role}</p>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                {currentWorker.location.address}
              </p>
            </div>
          </div>

          {/* Big Reliability Score */}
          <div className="flex items-center gap-6 bg-slate-900/80 p-5 rounded-2xl border border-indigo-900/80">
            <div className="text-center">
              <span className="text-[10px] uppercase font-bold text-indigo-300 block">Reliability Score</span>
              <span className="text-4xl font-black text-emerald-400">{currentWorker.reliabilityScore}%</span>
              <span className="text-[10px] text-slate-400 block font-medium">Platform Calibrated</span>
            </div>
            <div className="w-px h-12 bg-indigo-900"></div>
            <div className="text-center">
              <span className="text-[10px] uppercase font-bold text-indigo-300 block">Avg Rating</span>
              <span className="text-4xl font-black text-amber-400 flex items-center justify-center gap-1">
                {currentWorker.ratingAvg}
                <Star className="w-5 h-5 fill-amber-400" />
              </span>
              <span className="text-[10px] text-slate-400 block font-medium">
                {currentWorker.totalRatings} Reviews
              </span>
            </div>
          </div>
        </div>

        {/* 3 Core Reliability Breakdown Factors */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-300">Shift Completion</span>
              <span className="text-emerald-400">{currentWorker.completionRate}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${currentWorker.completionRate}%` }}></div>
            </div>
            <p className="text-[10px] text-slate-400">40% weight in algorithm calculation</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-300">Punctuality Rate</span>
              <span className="text-blue-400">{currentWorker.punctualityRate}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${currentWorker.punctualityRate}%` }}></div>
            </div>
            <p className="text-[10px] text-slate-400">35% weight (QR check-in timestamped)</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-300">Zero-Cancellation</span>
              <span className="text-indigo-400">100%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '100%' }}></div>
            </div>
            <p className="text-[10px] text-slate-400">25% weight (No sudden abandonments)</p>
          </div>
        </div>
      </div>

      {/* Verified Skills & Badges */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h3 className="text-lg font-black text-slate-900">Verified Competencies & Endorsements</h3>
          <p className="text-xs text-slate-500">Skills validated by business owners during live shifts</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {currentWorker.skills.map((skill) => (
            <div
              key={skill}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span className="text-xs font-bold text-slate-800">{skill}</span>
              </div>
              <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                Verified
              </span>
            </div>
          ))}
        </div>

        {/* Verification Badges showcase */}
        <div className="pt-4 border-t border-slate-100">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
            Earned Platform Badges
          </span>
          <div className="flex flex-wrap gap-2">
            {currentWorker.badges.map((b) => (
              <div
                key={b}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-xs font-bold text-slate-800 flex items-center gap-1.5 shadow-2xs"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>{b}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Business Owner Reviews */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-900">Manager Reviews & Shift Endorsements</h3>
            <p className="text-xs text-slate-500">Feedback left after emergency shift completions</p>
          </div>
          <span className="text-xs font-bold text-slate-500">{workerRatings.length} Endorsements</span>
        </div>

        <div className="space-y-4">
          {workerRatings.map((r) => (
            <div key={r.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs">
                    <Building className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">{r.fromUserName}</h4>
                    <span className="text-[10px] text-slate-400">{new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
              </div>

              <p className="text-xs text-slate-700 italic">"{r.review}"</p>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {r.tags.map((tag) => (
                  <span key={tag} className="text-[10px] font-semibold bg-white text-slate-600 px-2 py-0.5 rounded-md border border-slate-200">
                    🏷️ {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
