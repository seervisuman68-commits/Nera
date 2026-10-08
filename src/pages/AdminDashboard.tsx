import React, { useState } from 'react';
import { useShifts } from '../context/ShiftContext';
import { formatINR } from '../utils/currency';
import {
  ShieldCheck,
  TrendingUp,
  Users,
  Zap,
  CheckCircle2,
  XCircle,
  Building,
  Clock,
  Database,
  BarChart3,
  Award,
  Sparkles
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { workers, shifts, analytics, updateWorkerVerification } = useShifts();
  const [selectedTab, setSelectedTab] = useState<'workers' | 'shifts' | 'database'>('workers');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-purple-900/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-widest mb-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>NERA Master Operations Center</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white">Platform Administration</h1>
          <p className="text-xs sm:text-sm text-purple-200 mt-1">
            Global shift health, 10% commission revenue tracking, and worker passport verifications.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-900/50 rounded-2xl border border-purple-700/50 text-center">
            <span className="text-[10px] uppercase font-bold text-purple-300 block">NERA 10% Commission</span>
            <span className="text-xl font-black text-emerald-400">{formatINR(analytics.platformRevenueFee)}</span>
          </div>
        </div>
      </div>

      {/* Top Level Metric KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase">Gross Platform Volume</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{formatINR(analytics.totalVolumeGross)}</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">10% Platform Cut Unlocked</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase">Emergency Fill Rate</span>
          <div className="text-2xl font-black text-blue-600 mt-1">{analytics.fillRatePercentage}%</div>
          <div className="text-[11px] text-slate-500 mt-1">Avg 2.3 min match speed</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase">Verified Workers</span>
          <div className="text-2xl font-black text-indigo-600 mt-1">{analytics.totalWorkers}</div>
          <div className="text-[11px] text-slate-500 mt-1">{analytics.averageReliability}% avg reliability</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase">Active Rescues</span>
          <div className="text-2xl font-black text-amber-500 mt-1">{analytics.activeShifts} Shifts</div>
          <div className="text-[11px] text-slate-500 mt-1">Under 2-min cascade</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit">
        <button
          onClick={() => setSelectedTab('workers')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            selectedTab === 'workers' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          🧑‍🍳 Worker Passport Verifications ({workers.length})
        </button>
        <button
          onClick={() => setSelectedTab('shifts')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            selectedTab === 'shifts' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          ⚡ Global Shifts Oversight ({shifts.length})
        </button>
        <button
          onClick={() => setSelectedTab('database')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            selectedTab === 'database' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          🗄️ MongoDB Atlas Collections & Schema
        </button>
      </div>

      {/* Tab 1: Worker Verifications */}
      {selectedTab === 'workers' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-lg font-black text-slate-900">Worker Verification & Passport Moderation</h3>
              <p className="text-xs text-slate-500">Approve or update skill passports and reliability standing</p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {workers.map((w) => (
              <div key={w.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <img
                    src={w.avatar}
                    alt={w.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900">{w.name}</h4>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          w.verificationStatus === 'verified'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {w.verificationStatus.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{w.role} • {w.experienceYears} Years Exp</p>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {w.skills.map((s) => (
                        <span key={s} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right text-xs">
                    <span className="font-bold text-emerald-600 block">{w.reliabilityScore}% Reliability</span>
                    <span className="text-slate-400">{w.totalShiftsCompleted} Completed</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {w.verificationStatus !== 'verified' ? (
                      <button
                        onClick={() => updateWorkerVerification(w.id, 'verified')}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700"
                      >
                        Approve Passport
                      </button>
                    ) : (
                      <button
                        onClick={() => updateWorkerVerification(w.id, 'rejected')}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 font-bold text-xs"
                      >
                        Revoke
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Shifts Oversight */}
      {selectedTab === 'shifts' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
          <h3 className="text-lg font-black text-slate-900">All System Shifts</h3>
          {shifts.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No shifts created in MongoDB yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="p-3">Shift ID</th>
                    <th className="p-3">Business</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Worker Assigned</th>
                    <th className="p-3">Gross Pay</th>
                    <th className="p-3">10% Fee</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {shifts.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/80">
                      <td className="p-3 font-mono font-bold text-slate-900">{s.id}</td>
                      <td className="p-3 font-semibold text-slate-800">{s.businessName}</td>
                      <td className="p-3">{s.role}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 capitalize">
                          {s.status}
                        </span>
                      </td>
                      <td className="p-3 font-semibold text-emerald-700">{s.assignedWorkerName || 'Cascading...'}</td>
                      <td className="p-3 font-bold">{formatINR(s.payAmount)}</td>
                      <td className="p-3 font-bold text-purple-700">{formatINR(s.platformFee)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: MongoDB Atlas Collections & Schema Reference */}
      {selectedTab === 'database' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h3 className="text-lg font-black text-slate-900">MongoDB Atlas Architecture & Database Collections</h3>
            <p className="text-xs text-slate-500">Live Mongoose schema mappings synchronized across React frontend and REST API backend (/api/v1)</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            {[
              { col: 'users', count: 'Live Collection', desc: 'id, name, email, role (business/worker/admin), phone, avatar, createdAt' },
              { col: 'businesses', count: 'Live Collection', desc: 'id, userId, companyName, category, address, location {latitude, longitude}, totalSpent, shiftsPosted' },
              { col: 'workers', count: `${workers.length} documents`, desc: 'id, userId, name, skills[], experienceYears, reliabilityScore, availabilityStatus, location, verificationStatus' },
              { col: 'shifts', count: `${shifts.length} documents`, desc: 'id, businessId, role, requiredSkills[], startTime, endTime, payAmount, platformFee (10%), status, assignedWorkerId, backupWorkerId, qrCodeSecret' },
              { col: 'attendance', count: 'Live Collection', desc: 'id, shiftId, workerId, checkInTime, checkOutTime, status, verifiedBy (qr_scan), locationVerified' },
              { col: 'ratings', count: 'Live Collection', desc: 'id, shiftId, fromUserId, toUserId, rating (1-5), review, tags[], createdAt' },
            ].map((item) => (
              <div key={item.col} className="p-4 rounded-2xl bg-slate-900 text-slate-200 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-blue-400 font-bold">
                  <span>db.collection('{item.col}')</span>
                  <span className="text-xs text-emerald-400">{item.count}</span>
                </div>
                <p className="text-[11px] text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
