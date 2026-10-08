import React from 'react';
import { useShifts } from '../context/ShiftContext';
import { formatINR } from '../utils/currency';
import {
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Users,
  Building,
  Award,
  Sparkles
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const { analytics, shifts, workers } = useShifts();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
          Intelligence & Operations
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
          Platform Metrics & Financial Analytics
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Real-time analysis of emergency shift dispatch efficiency, match speeds, and commission revenues.
        </p>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase">Avg Rescue Time</span>
            <Clock className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">2.3 mins</div>
          <div className="text-xs text-emerald-600 font-semibold mt-1">⚡ 8x faster than agency calls</div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase">Fill Rate Guarantee</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-3xl font-black text-emerald-600 mt-2">{analytics.fillRatePercentage}%</div>
          <div className="text-xs text-slate-500 mt-1">Backed by auto backup workers</div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase">Total Platform Volume</span>
            <TrendingUp className="w-5 h-5 text-indigo-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">{formatINR(analytics.totalVolumeGross)}</div>
          <div className="text-xs text-slate-500 mt-1">Gross worker compensation</div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase">NERA 10% Platform Fee</span>
            <Zap className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-indigo-600 mt-2">{formatINR(analytics.platformRevenueFee)}</div>
          <div className="text-xs text-emerald-600 font-semibold mt-1">100% automated revenue</div>
        </div>
      </div>

      {/* Industry Breakdown & Reliability Tier Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Industry Shift Volume Breakdown */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h3 className="text-lg font-black text-slate-900">Shift Volume by Industry</h3>
            <p className="text-xs text-slate-500">Breakdown of emergency shifts posted across sectors</p>
          </div>

          <div className="space-y-4">
            {[
              { label: '☕ Cafés & Specialty Coffee', pct: 44, count: '18 shifts', color: 'bg-amber-500' },
              { label: '🍽️ Bistros & Restaurants', pct: 32, count: '13 shifts', color: 'bg-rose-500' },
              { label: '🛍️ Boutiques & Retail', pct: 16, count: '7 shifts', color: 'bg-blue-500' },
              { label: '✂️ Salons & Wellness Spas', pct: 8, count: '3 shifts', color: 'bg-purple-500' },
            ].map((item) => (
              <div key={item.label} className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-800">{item.label}</span>
                  <span className="text-slate-500">{item.count} ({item.pct}%)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div className={`${item.color} h-3 rounded-full transition-all duration-1000`} style={{ width: `${item.pct}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Worker Reliability Distribution */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h3 className="text-lg font-black text-slate-900">Worker Reliability Distribution</h3>
            <p className="text-xs text-slate-500">Tier calibration across the active candidate pool</p>
          </div>

          <div className="space-y-4">
            {[
              { tier: 'Elite Standing (95% - 100%)', pct: 70, badge: '⚡ Priority Cascade', color: 'bg-emerald-500' },
              { tier: 'High Reliability (88% - 94%)', pct: 22, badge: '🛡️ Verified', color: 'bg-blue-500' },
              { tier: 'Good Standing (75% - 87%)', pct: 8, badge: '👍 Active', color: 'bg-amber-500' },
            ].map((item) => (
              <div key={item.tier} className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-800">{item.tier}</span>
                  <span className="text-slate-500">{item.pct}% of workers</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div className={`${item.color} h-3 rounded-full transition-all duration-1000`} style={{ width: `${item.pct}%` }}></div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              98.4% of shift matches arrive within 15 minutes of cascade acceptance.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
