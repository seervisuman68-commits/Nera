import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useShifts } from '../context/ShiftContext';
import { Shift, Worker } from '../types';
import { CascadeStatusWidget } from '../components/cascade/CascadeStatusWidget';
import { QRGeneratorModal } from '../components/qr/QRGeneratorModal';
import { RatingModal } from '../components/rating/RatingModal';
import { formatINR, formatHourlyINR } from '../utils/currency';
import {
  PlusCircle,
  Zap,
  Clock,
  CheckCircle2,
  Users,
  QrCode,
  Star,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Building,
  TrendingUp,
  MapPin
} from 'lucide-react';

export const BusinessDashboard: React.FC = () => {
  const { currentBusiness } = useAuth();
  const { shifts, attendanceLogs, ratings, workers } = useShifts();
  const navigate = useNavigate();

  const [selectedShiftForQR, setSelectedShiftForQR] = useState<Shift | null>(null);
  const [selectedShiftForRating, setSelectedShiftForRating] = useState<Shift | null>(null);

  const businessShifts = shifts.filter(
    (s) => !currentBusiness || s.businessId === currentBusiness.id || s.businessName.includes('Urban')
  );

  const activeShifts = businessShifts.filter((s) => ['open', 'cascading', 'assigned', 'in_progress'].includes(s.status));
  const completedShifts = businessShifts.filter((s) => s.status === 'completed');

  const totalSpent = completedShifts.reduce((acc, s) => acc + s.totalCost, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner & Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden border border-slate-800">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">
            <Building className="w-4 h-4" />
            <span>{currentBusiness?.companyName || 'Urban Brew Café'} Control Center</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white">Emergency Shift Hub</h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
            Auto-cascade open shifts, monitor primary & backup workers, and issue instant QR attendance check-ins.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap gap-3">
          <Link
            to="/create-shift"
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold text-sm shadow-lg shadow-blue-500/30 hover:scale-105 transition-all flex items-center gap-2"
          >
            <PlusCircle className="w-5 h-5" />
            Post Emergency Shift
          </Link>
          <Link
            to="/analytics"
            className="px-4 py-3 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-sm font-semibold border border-slate-700 transition-colors"
          >
            View Spending
          </Link>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Active Rescues</span>
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600 font-bold">
              <Zap className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{activeShifts.length}</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            100% Cascade Automation
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Completed Shifts</span>
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600 font-bold">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{completedShifts.length}</div>
          <div className="text-[11px] text-slate-500 mt-1">Zero shift abandonment</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Total Shift Spend</span>
            <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600 font-bold">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{formatINR(totalSpent)}</div>
          <div className="text-[11px] text-slate-500 mt-1">Includes 10% platform fee</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Available Nearby</span>
            <span className="p-2 rounded-xl bg-amber-50 text-amber-600 font-bold">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {workers.filter((w) => w.availabilityStatus === 'Available Now').length} Verified
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">Avg 0.9 km distance</div>
        </div>
      </div>

      {/* Active Shifts with Live Cascade Engine */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900">Active & Cascading Shifts</h2>
            <p className="text-xs text-slate-500">Live monitoring of worker assignments and QR check-in codes</p>
          </div>
          <Link to="/active-shifts" className="text-xs font-bold text-blue-600 hover:underline">
            View All Shifts →
          </Link>
        </div>

        {activeShifts.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-dashed border-slate-300 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Clock className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-800 text-sm">No Active Emergency Shifts Right Now</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Need coverage today? Click below to immediately match verified workers in under 15 minutes.
            </p>
            <Link
              to="/create-shift"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
            >
              <PlusCircle className="w-4 h-4" />
              Post Emergency Shift
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {activeShifts.map((shift) => (
              <div
                key={shift.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 hover:border-blue-300 transition-colors"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200">
                        {shift.urgency}
                      </span>
                      <h3 className="font-bold text-base text-slate-900">{shift.role}</h3>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      📅 {shift.date} • ⏱️ {shift.startTime} - {shift.endTime} • 💰 {formatINR(shift.payAmount)} ({formatHourlyINR(shift.hourlyRate)})
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedShiftForQR(shift)}
                      className="px-3.5 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                    >
                      <QrCode className="w-4 h-4" />
                      Show Check-in QR
                    </button>
                    <Link
                      to={`/live-shift/${shift.id}`}
                      className="px-3.5 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                    >
                      <span>Control Room</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Offer Cascade Visualization */}
                <CascadeStatusWidget shift={shift} />

                {/* Requirements & Notes */}
                <div className="flex flex-wrap items-center justify-between text-xs text-slate-600 pt-1 gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-semibold text-slate-700">Required:</span>
                    {shift.requiredSkills.map((sk) => (
                      <span key={sk} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px]">
                        {sk}
                      </span>
                    ))}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Shift ID: <span className="font-mono">{shift.id}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Shifts & Rate Worker History */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-black text-base text-slate-900">Shift History & Worker Performance</h3>
            <p className="text-xs text-slate-500">Verified completed shifts and submitted ratings</p>
          </div>
          <span className="text-xs font-bold text-slate-400">{completedShifts.length} Shifts Done</span>
        </div>

        {completedShifts.length === 0 ? (
          <p className="text-xs text-slate-400 py-4">No completed shifts yet.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {completedShifts.map((s) => {
              const ratingForShift = ratings.find((r) => r.shiftId === s.id);
              return (
                <div key={s.id} className="py-4 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{s.role}</h4>
                      <p className="text-xs text-slate-500">
                        Completed by <strong className="text-slate-700">{s.assignedWorkerName}</strong> on {s.date}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-sm font-bold text-slate-900">{formatINR(s.payAmount)}</span>
                      <span className="block text-[10px] text-slate-400 font-mono">Paid ({formatINR(s.platformFee)} Fee)</span>
                    </div>

                    {ratingForShift ? (
                      <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                        <span>{ratingForShift.rating}.0 Rated</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedShiftForRating(s)}
                        className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1"
                      >
                        <Star className="w-3.5 h-3.5 fill-white" />
                        Rate Worker
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* QR Code Modal for Business */}
      {selectedShiftForQR && (
        <QRGeneratorModal
          shift={selectedShiftForQR}
          isOpen={!!selectedShiftForQR}
          onClose={() => setSelectedShiftForQR(null)}
        />
      )}

      {/* Rating & Review Modal */}
      {selectedShiftForRating && (
        <RatingModal
          shift={selectedShiftForRating}
          isOpen={!!selectedShiftForRating}
          onClose={() => setSelectedShiftForRating(null)}
        />
      )}
    </div>
  );
};
