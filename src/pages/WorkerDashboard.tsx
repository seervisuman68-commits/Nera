import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useShifts } from '../context/ShiftContext';
import { AvailabilityStatus, Shift } from '../types';
import { QRScannerModal } from '../components/qr/QRScannerModal';
import { AddWorkerModal } from '../components/workers/AddWorkerModal';
import { formatINR, formatHourlyINR } from '../utils/currency';
import {
  UserCheck,
  Zap,
  ShieldCheck,
  Clock,
  Award,
  QrCode,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Bell,
  ArrowRight,
  TrendingUp,
  Star,
  UserPlus
} from 'lucide-react';

export const WorkerDashboard: React.FC = () => {
  const { currentWorker, updateWorkerAvailability } = useAuth();
  const { shifts, activeOfferForWorker } = useShifts();

  const [scannerShift, setScannerShift] = useState<{ shift: Shift; mode: 'check_in' | 'check_out' } | null>(null);
  const [showAddWorker, setShowAddWorker] = useState(false);

  const activeOffer = currentWorker ? activeOfferForWorker(currentWorker.id) : null;
  const activeAssignedShift = currentWorker
    ? shifts.find(
        (s) => (s.assignedWorkerId === currentWorker.id || s.backupWorkerId === currentWorker.id) && ['assigned', 'in_progress'].includes(s.status)
      )
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Action Bar */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowAddWorker(true)}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
        >
          <UserPlus className="w-4 h-4" />
          + Register New Test Worker
        </button>
      </div>

      {/* Incoming Urgent Offer Banner */}
      {activeOffer && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-600 via-amber-600 to-rose-700 text-white shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <Bell className="w-6 h-6 text-white animate-bounce" />
            </div>
            <div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 uppercase tracking-wider">
                Emergency Shift Cascade • 2-Min Response Window
              </span>
              <h2 className="text-lg sm:text-xl font-black mt-0.5">
                Urgent Offer: {activeOffer.shift.role} at {activeOffer.shift.businessName}
              </h2>
              <p className="text-xs text-rose-100">
                💰 {formatINR(activeOffer.shift.payAmount)} ({formatHourlyINR(activeOffer.shift.hourlyRate)}) • 📍 {activeOffer.shift.location.address}
              </p>
            </div>
          </div>

          <Link
            to="/shift-offers"
            className="px-6 py-3 rounded-2xl bg-white text-rose-700 font-black text-sm shadow-lg hover:bg-rose-50 transition-all shrink-0 flex items-center gap-2"
          >
            <span>Review & Accept ({formatINR(activeOffer.shift.payAmount)})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Top Profile Banner */}
      {currentWorker ? (
        <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="relative">
              <img
                src={currentWorker.avatar}
                alt={currentWorker.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-emerald-400 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 rounded-full border-2 border-slate-900">
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-white">{currentWorker.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Verified Passport ✅
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">{currentWorker.role}</p>

              <div className="flex flex-wrap gap-1.5 mt-3">
                {currentWorker.badges.slice(0, 3).map((b) => (
                  <span key={b} className="text-[11px] font-semibold bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-lg border border-slate-700">
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-800/90 rounded-2xl border border-slate-700 space-y-2 w-full md:w-auto">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Real-Time Availability Status
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(['Available Now', 'Available Later', 'Unavailable'] as AvailabilityStatus[]).map((status) => {
                const active = currentWorker.availabilityStatus === status;
                return (
                  <button
                    key={status}
                    onClick={() => updateWorkerAvailability(status)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      active
                        ? status === 'Available Now'
                          ? 'bg-emerald-500 text-white shadow-md'
                          : status === 'Available Later'
                          ? 'bg-amber-500 text-slate-900 shadow-md'
                          : 'bg-rose-500 text-white shadow-md'
                        : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                    }`}
                  >
                    {status === 'Available Now' && '🟢 '}
                    {status === 'Available Later' && '🟡 '}
                    {status === 'Unavailable' && '🔴 '}
                    {status}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 bg-white rounded-3xl border border-dashed border-slate-300 text-center space-y-3">
          <p className="text-sm font-bold text-slate-800">No Worker Profile Active</p>
          <button
            onClick={() => setShowAddWorker(true)}
            className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
          >
            Create Your Worker Profile Now
          </button>
        </div>
      )}

      {/* Key Metric Cards */}
      {currentWorker && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase">Reliability Score</span>
              <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600 font-bold">
                <ShieldCheck className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl font-black text-emerald-600 mt-2">{currentWorker.reliabilityScore}%</div>
            <div className="text-[11px] text-slate-500 mt-1">Elite Tier Candidate</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase">Shifts Completed</span>
              <span className="p-2 rounded-xl bg-blue-50 text-blue-600 font-bold">
                <CheckCircle2 className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2">{currentWorker.totalShiftsCompleted}</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1">100% Completion Rate</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase">Punctuality</span>
              <span className="p-2 rounded-xl bg-amber-50 text-amber-600 font-bold">
                <Clock className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2">{currentWorker.punctualityRate}%</div>
            <div className="text-[11px] text-slate-500 mt-1">On-Time Check-Ins</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase">Total Earnings</span>
              <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600 font-bold">
                <TrendingUp className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2">{formatINR(currentWorker.earningsTotal)}</div>
            <div className="text-[11px] text-slate-500 mt-1">Instant Payouts Eligible</div>
          </div>
        </div>
      )}

      {/* Active Shift Card if assigned */}
      {activeAssignedShift && currentWorker && (
        <div className="bg-white rounded-3xl border-2 border-blue-500 p-6 shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                ACTIVE ASSIGNED SHIFT
              </span>
              <h2 className="text-xl font-black text-slate-900 mt-2">{activeAssignedShift.role}</h2>
              <p className="text-xs text-slate-500 font-medium">
                {activeAssignedShift.businessName} • 📍 {activeAssignedShift.location.address}
              </p>
            </div>

            <div className="text-right">
              <span className="text-2xl font-black text-emerald-600">{formatINR(activeAssignedShift.payAmount)}</span>
              <span className="block text-xs text-slate-400">Guaranteed Pay</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs p-4 bg-slate-50 rounded-2xl">
            <div>
              <span className="text-slate-400 block">Shift Timing:</span>
              <span className="font-bold text-slate-800">{activeAssignedShift.date} ({activeAssignedShift.startTime} - {activeAssignedShift.endTime})</span>
            </div>
            <div>
              <span className="text-slate-400 block">Your Assignment Role:</span>
              <span className="font-bold text-blue-700">
                {activeAssignedShift.assignedWorkerId === currentWorker.id ? 'Primary On-Site Worker' : 'Backup Worker (Standby)'}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <Link
              to={`/live-shift/${activeAssignedShift.id}`}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              View Shift Mission Control →
            </Link>

            {activeAssignedShift.status === 'assigned' ? (
              <button
                onClick={() => setScannerShift({ shift: activeAssignedShift, mode: 'check_in' })}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-emerald-500/20"
              >
                <QrCode className="w-4 h-4" />
                Scan Business QR to Check-In
              </button>
            ) : (
              <button
                onClick={() => setScannerShift({ shift: activeAssignedShift, mode: 'check_out' })}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-blue-500/20"
              >
                <QrCode className="w-4 h-4" />
                Scan QR to Complete Shift & Get Paid
              </button>
            )}
          </div>
        </div>
      )}

      {/* Quick Links Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/shift-offers"
          className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-blue-400 transition-all space-y-2 group"
        >
          <div className="p-3 bg-blue-50 rounded-xl w-fit text-blue-600 group-hover:scale-110 transition-transform">
            <Bell className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Shift Offers & Cascade</h3>
          <p className="text-xs text-slate-500">
            View pending offers, respond within 2 minutes, and lock in emergency pay.
          </p>
        </Link>

        <Link
          to="/skill-passport"
          className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-emerald-400 transition-all space-y-2 group"
        >
          <div className="p-3 bg-emerald-50 rounded-xl w-fit text-emerald-600 group-hover:scale-110 transition-transform">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Verified Skill Passport</h3>
          <p className="text-xs text-slate-500">
            View endorsements, punctuality score breakdown, and digital badges.
          </p>
        </Link>

        <Link
          to="/earnings"
          className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-indigo-400 transition-all space-y-2 group"
        >
          <div className="p-3 bg-indigo-50 rounded-xl w-fit text-indigo-600 group-hover:scale-110 transition-transform">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Earnings & Payouts</h3>
          <p className="text-xs text-slate-500">
            Track gross hourly income and simulate instant bank withdrawals.
          </p>
        </Link>
      </div>

      {/* QR Scanner Modal */}
      {scannerShift && currentWorker && (
        <QRScannerModal
          shift={scannerShift.shift}
          worker={currentWorker}
          mode={scannerShift.mode}
          isOpen={!!scannerShift}
          onClose={() => setScannerShift(null)}
        />
      )}

      {/* Add Worker Modal */}
      {showAddWorker && (
        <AddWorkerModal
          isOpen={showAddWorker}
          onClose={() => setShowAddWorker(false)}
        />
      )}
    </div>
  );
};
