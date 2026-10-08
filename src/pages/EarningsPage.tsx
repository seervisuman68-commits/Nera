import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useShifts } from '../context/ShiftContext';
import { formatINR, formatHourlyINR } from '../utils/currency';
import {
  TrendingUp,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Building,
  ShieldCheck,
  CreditCard,
  Sparkles,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const EarningsPage: React.FC = () => {
  const { currentWorker } = useAuth();
  const { shifts } = useShifts();

  const [payoutSuccess, setPayoutSuccess] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);

  if (!currentWorker) return null;

  const completedShifts = shifts.filter(
    (s) => s.assignedWorkerId === currentWorker.id && s.status === 'completed'
  );

  const availableBalance = currentWorker.earningsTotal;

  const handleInstantPayout = () => {
    setWithdrawing(true);
    setTimeout(() => {
      setWithdrawing(false);
      setPayoutSuccess(true);
      try {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      } catch {}
      setTimeout(() => setPayoutSuccess(false), 5000);
    }, 1200);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
          Financial Hub
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
          Worker Earnings & Instant Payouts
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          100% of hourly earnings paid directly to you with zero worker deductions.
        </p>
      </div>

      {/* Success banner */}
      {payoutSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between animate-fade-in shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Instant transfer of {formatINR(availableBalance)} dispatched to your linked bank account! (Demo)</span>
          </div>
          <span className="text-[10px] font-bold uppercase bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">
            Paid in 30s
          </span>
        </div>
      )}

      {/* Hero Earnings Card */}
      <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-emerald-900/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Available For Transfer</span>
          <div className="text-4xl sm:text-5xl font-black text-white mt-1">
            {formatINR(availableBalance)}
          </div>
          <p className="text-xs text-emerald-200 mt-2 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Guaranteed by NERA Escrow System</span>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <button
            onClick={handleInstantPayout}
            disabled={withdrawing || availableBalance === 0}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all hover:scale-105"
          >
            <Zap className="w-4 h-4 fill-slate-950" />
            <span>{withdrawing ? 'Processing Transfer...' : 'Instant Bank Payout'}</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase">Total Lifetime Paid</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{formatINR(currentWorker.earningsTotal)}</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">From {currentWorker.totalShiftsCompleted} shifts</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase">Avg Emergency Hourly Rate</span>
          <div className="text-2xl font-black text-blue-600 mt-1">{formatHourlyINR(currentWorker.hourlyRate)}</div>
          <div className="text-[11px] text-slate-500 mt-1">Premium emergency surge included</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase">Platform Worker Fee</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">0% (Free)</div>
          <div className="text-[11px] text-slate-500 mt-1">Business pays the 10% fee</div>
        </div>
      </div>

      {/* Payout History & Shift Breakdown */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-900">Completed Shift Earnings History</h3>
            <p className="text-xs text-slate-500">Itemized shift payouts and timestamps</p>
          </div>
          <span className="text-xs font-bold text-slate-400">{completedShifts.length} Payouts</span>
        </div>

        {completedShifts.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No completed shifts yet. Accept an emergency offer to see earnings here.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {completedShifts.map((s) => (
              <div key={s.id} className="py-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{s.role}</h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      <span>{s.businessName}</span>
                      <span>•</span>
                      <span>📅 {s.date}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-base font-black text-emerald-600">+{formatINR(s.payAmount)}</div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {s.startTime} - {s.endTime} ({formatHourlyINR(s.hourlyRate)})
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
