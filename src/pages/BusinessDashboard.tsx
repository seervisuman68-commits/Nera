import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useShifts } from '../context/ShiftContext';
import { Shift, Worker } from '../types';
import { CascadeStatusWidget } from '../components/cascade/CascadeStatusWidget';
import { QRGeneratorModal } from '../components/qr/QRGeneratorModal';
import { RatingModal } from '../components/rating/RatingModal';
import { AddWorkerModal } from '../components/workers/AddWorkerModal';
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
  MapPin,
  Sparkles,
  UserPlus
} from 'lucide-react';

export const BusinessDashboard: React.FC = () => {
  const { currentBusiness } = useAuth();
  const { shifts, attendanceLogs, ratings, workers, refreshData, dbError, isDbConnected } = useShifts();
  const navigate = useNavigate();

  const [selectedShiftForQR, setSelectedShiftForQR] = useState<Shift | null>(null);
  const [selectedShiftForRating, setSelectedShiftForRating] = useState<Shift | null>(null);
  const [isAddWorkerOpen, setIsAddWorkerOpen] = useState<boolean>(false);

  // Filter shifts: if business has posted shifts, show them; otherwise show active platform shifts
  const myShifts = currentBusiness
    ? shifts.filter((s) => s.businessId === currentBusiness.id || s.businessName === currentBusiness.companyName)
    : shifts;
  const businessShifts = myShifts.length > 0 ? myShifts : shifts;

  const activeShifts = businessShifts.filter((s) => ['open', 'cascading', 'assigned', 'in_progress'].includes(s.status));
  const completedShifts = businessShifts.filter((s) => s.status === 'completed');
  const availableWorkers = workers.filter((w) => w.availabilityStatus === 'Available Now');
  const totalSpent = completedShifts.reduce((acc, s) => acc + s.totalCost, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Database Connection Error Banner */}
      {dbError && (
        <div className="bg-rose-50 border-2 border-rose-300 rounded-3xl p-5 text-rose-900 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-rose-100 rounded-2xl text-rose-600 shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-sm text-rose-950">Database connection failed</h3>
              <p className="text-xs text-rose-800 mt-0.5">{dbError}</p>
              <p className="text-[11px] text-rose-700 mt-1 font-semibold">
                Add <span className="font-mono bg-rose-200/80 px-1.5 py-0.5 rounded text-rose-900">MONGODB_URI</span> in Vercel → Project → Settings → Environment Variables and trigger a Redeployment.
              </p>
            </div>
          </div>
          <button
            onClick={() => refreshData()}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shrink-0 shadow-sm transition-all"
          >
            Retry Connection
          </button>
        </div>
      )}

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
          <button
            onClick={() => setIsAddWorkerOpen(true)}
            className="px-4 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold flex items-center gap-2 shadow-md shadow-emerald-600/20 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Worker to Pool</span>
          </button>
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
            {availableWorkers.length} Verified
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">Total {workers.length} in DB Pool</div>
        </div>
      </div>

      {/* Verified Worker Pool from Persistent MongoDB */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-black text-slate-900">Verified Nearby Worker Pool</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                {workers.length} Total Workers in MongoDB
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Real-time candidate pool available for immediate 5-factor smart matching & dispatch
            </p>
          </div>
          <button
            onClick={() => setIsAddWorkerOpen(true)}
            className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Register New Worker</span>
          </button>
        </div>

        {workers.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-slate-200 rounded-2xl space-y-2">
            <Users className="w-8 h-8 text-slate-300 mx-auto" />
            {dbError ? (
              <>
                <h4 className="font-bold text-sm text-rose-700">Database connection failed</h4>
                <p className="text-xs text-rose-500 max-w-sm mx-auto">
                  Unable to connect to MongoDB Atlas. Ensure <code className="bg-rose-100 px-1 py-0.5 rounded font-bold">MONGODB_URI</code> is configured in Vercel.
                </p>
                <button
                  onClick={() => refreshData()}
                  className="mt-2 px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold"
                >
                  Retry Connection
                </button>
              </>
            ) : (
              <>
                <h4 className="font-bold text-sm text-slate-700">No Workers Registered Yet</h4>
                <p className="text-xs text-slate-400">Click below to register the first worker to the MongoDB database pool.</p>
                <button
                  onClick={() => setIsAddWorkerOpen(true)}
                  className="mt-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
                >
                  + Register Worker
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workers.map((w) => (
              <div
                key={w.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-emerald-300 transition-all space-y-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={w.avatar}
                    alt={w.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="font-bold text-sm text-slate-900 truncate">{w.name}</h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        w.availabilityStatus === 'Available Now'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {w.availabilityStatus === 'Available Now' ? '🟢 Ready' : '🟡 Later'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 truncate">{w.role}</p>
                    <p className="text-[11px] font-bold text-emerald-600 mt-0.5">
                      {formatHourlyINR(w.hourlyRate)} • {w.reliabilityScore}% Rel.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {w.skills.slice(0, 3).map((s) => (
                    <span key={s} className="text-[10px] bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded-md">
                      {s}
                    </span>
                  ))}
                  {w.skills.length > 3 && (
                    <span className="text-[10px] text-slate-400 font-bold px-1 py-0.5">+{w.skills.length - 3}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
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
            {dbError ? (
              <>
                <h4 className="font-bold text-rose-800 text-sm">Database connection failed</h4>
                <p className="text-xs text-rose-600 max-w-sm mx-auto">
                  Unable to load shifts from MongoDB. Check <code className="bg-rose-100 px-1 py-0.5 rounded font-bold">MONGODB_URI</code> in Vercel environment settings.
                </p>
              </>
            ) : (
              <>
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
              </>
            )}
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
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        shift.status === 'in_progress'
                          ? 'bg-emerald-100 text-emerald-800 animate-pulse'
                          : shift.status === 'assigned'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {shift.status === 'in_progress' ? '🟢 Live / Checked In' : shift.status.toUpperCase()}
                      </span>
                      <h3 className="font-bold text-base text-slate-900">{shift.role}</h3>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      📍 {shift.businessName} • 📅 {shift.date} • ⏱️ {shift.startTime} - {shift.endTime} • 💰 {formatINR(shift.payAmount)} ({formatHourlyINR(shift.hourlyRate)})
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

                {/* Assigned Worker / Candidate status */}
                {shift.assignedWorkerName && (
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs text-emerald-900">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Assigned Worker: <strong>{shift.assignedWorkerName}</strong></span>
                    </div>
                    <span className="font-bold text-emerald-700">
                      {shift.status === 'in_progress' ? `Checked In: ${new Date(shift.checkInTime || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Confirmed Ready'}
                    </span>
                  </div>
                )}

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

      {/* Register Worker Modal */}
      <AddWorkerModal
        isOpen={isAddWorkerOpen}
        onClose={() => setIsAddWorkerOpen(false)}
        onAdded={() => refreshData()}
      />
    </div>
  );
};
