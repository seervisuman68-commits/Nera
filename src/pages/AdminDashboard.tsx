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
  Sparkles,
  QrCode,
  UserCheck,
  RefreshCw,
  MapPin,
  AlertTriangle
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { workers, shifts, attendanceLogs, analytics, updateWorkerVerification, refreshData, dbError } = useShifts();
  const [selectedTab, setSelectedTab] = useState<'attendance' | 'workers' | 'shifts' | 'database'>('attendance');
  const [attendanceFilter, setAttendanceFilter] = useState<'all' | 'checked_in' | 'completed'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    setIsRefreshing(false);
  };

  const filteredLogs = attendanceLogs.filter((log) => {
    if (attendanceFilter === 'all') return true;
    return log.status === attendanceFilter;
  });

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
            onClick={handleManualRefresh}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shrink-0 shadow-sm transition-all"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-purple-900/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-widest mb-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>NERA Master Operations Center</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white">Platform Administration</h1>
          <p className="text-xs sm:text-sm text-purple-200 mt-1">
            Global shift health, 10% commission revenue tracking, QR attendance validation, and worker passport verifications.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="p-3 bg-purple-900/40 hover:bg-purple-800/60 rounded-2xl border border-purple-700/50 text-white text-xs font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Sync MongoDB</span>
          </button>
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
          <div className="text-2xl font-black text-indigo-600 mt-1">{workers.length}</div>
          <div className="text-[11px] text-slate-500 mt-1">{analytics.averageReliability}% avg reliability</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase">Attendance Logs</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">{attendanceLogs.length} Records</div>
          <div className="text-[11px] text-slate-500 mt-1">100% QR & GPS Verified</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit">
        <button
          onClick={() => setSelectedTab('attendance')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            selectedTab === 'attendance' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          📋 Live Attendance Logs ({attendanceLogs.length})
        </button>
        <button
          onClick={() => setSelectedTab('workers')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            selectedTab === 'workers' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          🧑‍🍳 Worker Passport Pool ({workers.length})
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
          🗄️ MongoDB Atlas Architecture
        </button>
      </div>

      {/* Tab 1: Live Attendance Records */}
      {selectedTab === 'attendance' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-slate-900">Attendance & Verification Hub</h3>
              <p className="text-xs text-slate-500">Real-time geofenced QR scan records and departure logs from MongoDB</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400">Filter:</span>
              <div className="flex bg-slate-100 p-1 rounded-xl text-[11px] font-bold">
                <button
                  onClick={() => setAttendanceFilter('all')}
                  className={`px-2.5 py-1 rounded-lg ${attendanceFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
                >
                  All ({attendanceLogs.length})
                </button>
                <button
                  onClick={() => setAttendanceFilter('checked_in')}
                  className={`px-2.5 py-1 rounded-lg ${attendanceFilter === 'checked_in' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500'}`}
                >
                  Live ({attendanceLogs.filter(a => a.status === 'checked_in').length})
                </button>
                <button
                  onClick={() => setAttendanceFilter('completed')}
                  className={`px-2.5 py-1 rounded-lg ${attendanceFilter === 'completed' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-500'}`}
                >
                  Completed ({attendanceLogs.filter(a => a.status === 'completed').length})
                </button>
              </div>
            </div>
          </div>

          {filteredLogs.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-slate-200 rounded-2xl space-y-2">
              <QrCode className="w-8 h-8 text-slate-300 mx-auto" />
              {dbError ? (
                <>
                  <h4 className="font-bold text-sm text-rose-700">Database connection failed</h4>
                  <p className="text-xs text-rose-500 max-w-sm mx-auto">
                    Unable to load attendance records. Check <code className="bg-rose-100 px-1 py-0.5 rounded font-bold">MONGODB_URI</code> in Vercel settings.
                  </p>
                  <button
                    onClick={handleManualRefresh}
                    className="mt-2 px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold"
                  >
                    Retry Connection
                  </button>
                </>
              ) : (
                <>
                  <h4 className="font-bold text-sm text-slate-700">No Attendance Records Found</h4>
                  <p className="text-xs text-slate-400">When workers scan the QR check-in code at venues, records appear here immediately.</p>
                </>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="p-3">Log ID</th>
                    <th className="p-3">Worker Name</th>
                    <th className="p-3">Business Venue</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Check-In Time</th>
                    <th className="p-3">Check-Out Time</th>
                    <th className="p-3">Verification Method</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/80">
                      <td className="p-3 font-mono font-bold text-slate-900">{log.id}</td>
                      <td className="p-3 font-bold text-slate-800 flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{log.workerName}</span>
                      </td>
                      <td className="p-3 font-medium text-slate-700">{log.businessName}</td>
                      <td className="p-3">{log.role}</td>
                      <td className="p-3 font-mono text-emerald-700 font-bold">
                        {new Date(log.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="p-3 font-mono text-slate-600">
                        {log.checkOutTime
                          ? new Date(log.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          : <span className="text-amber-600 font-bold">In Progress ⏱️</span>}
                      </td>
                      <td className="p-3">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          <QrCode className="w-3 h-3" />
                          QR + GPS
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          log.status === 'completed'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-emerald-100 text-emerald-800 animate-pulse'
                        }`}>
                          {log.status.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Worker Verifications */}
      {selectedTab === 'workers' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-lg font-black text-slate-900">Worker Verification & Passport Moderation</h3>
              <p className="text-xs text-slate-500">Approve or update skill passports and reliability standing</p>
            </div>
            <span className="text-xs font-bold text-slate-400">{workers.length} Registered</span>
          </div>

          {workers.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-slate-200 rounded-2xl space-y-2">
              <Users className="w-8 h-8 text-slate-300 mx-auto" />
              {dbError ? (
                <>
                  <h4 className="font-bold text-sm text-rose-700">Database connection failed</h4>
                  <p className="text-xs text-rose-500 max-w-sm mx-auto">
                    Unable to load workers from MongoDB. Ensure <code className="bg-rose-100 px-1 py-0.5 rounded font-bold">MONGODB_URI</code> is set in Vercel.
                  </p>
                  <button
                    onClick={handleManualRefresh}
                    className="mt-2 px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold"
                  >
                    Retry Connection
                  </button>
                </>
              ) : (
                <>
                  <h4 className="font-bold text-sm text-slate-700">No Workers Registered Yet</h4>
                  <p className="text-xs text-slate-400">Worker profiles registered across the platform will appear here.</p>
                </>
              )}
            </div>
          ) : (
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
                      <p className="text-xs text-slate-500">{w.role} • {w.experienceYears} Years Exp • {formatINR(w.hourlyRate)}/hr</p>
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
                          className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Approve
                        </button>
                      ) : (
                        <button
                          onClick={() => updateWorkerVerification(w.id, 'rejected')}
                          className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-rose-50 hover:text-rose-600 transition-colors"
                        >
                          Suspend
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Global Shifts Oversight */}
      {selectedTab === 'shifts' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-lg font-black text-slate-900">All Platform Emergency Shifts</h3>
              <p className="text-xs text-slate-500">Live operational status across all business venues</p>
            </div>
            <span className="text-xs font-bold text-slate-400">{shifts.length} Total Shifts</span>
          </div>

          {shifts.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-slate-200 rounded-2xl space-y-2">
              <Clock className="w-8 h-8 text-slate-300 mx-auto" />
              {dbError ? (
                <>
                  <h4 className="font-bold text-sm text-rose-700">Database connection failed</h4>
                  <p className="text-xs text-rose-500 max-w-sm mx-auto">
                    Unable to load shifts from MongoDB. Ensure <code className="bg-rose-100 px-1 py-0.5 rounded font-bold">MONGODB_URI</code> is set in Vercel.
                  </p>
                </>
              ) : (
                <>
                  <h4 className="font-bold text-sm text-slate-700">No Shifts Posted Yet</h4>
                  <p className="text-xs text-slate-400">Emergency shifts created across venues will appear here.</p>
                </>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="p-3">Shift ID</th>
                    <th className="p-3">Business</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Date & Time</th>
                    <th className="p-3">Payout</th>
                    <th className="p-3">Assigned Worker</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {shifts.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/80">
                      <td className="p-3 font-mono font-bold text-slate-900">{s.id}</td>
                      <td className="p-3 font-bold text-slate-800">{s.businessName}</td>
                      <td className="p-3">{s.role}</td>
                      <td className="p-3">{s.date} ({s.startTime})</td>
                      <td className="p-3 font-bold text-slate-900">{formatINR(s.payAmount)}</td>
                      <td className="p-3 text-slate-700">
                        {s.assignedWorkerName || <span className="text-slate-400 italic">None yet</span>}
                      </td>
                      <td className="p-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          s.status === 'completed'
                            ? 'bg-blue-100 text-blue-800'
                            : s.status === 'in_progress'
                            ? 'bg-emerald-100 text-emerald-800'
                            : s.status === 'assigned'
                            ? 'bg-indigo-100 text-indigo-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: MongoDB Atlas Collections & Architecture */}
      {selectedTab === 'database' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h3 className="text-lg font-black text-slate-900">MongoDB Atlas Single Source of Truth</h3>
            <p className="text-xs text-slate-500">Live Mongoose schema mappings synchronized across React frontend and REST API backend (/api/v1)</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            {[
              { col: 'users', count: 'Live Collection', desc: 'id, name, email, role (business/worker/admin), phone, avatar, createdAt' },
              { col: 'businesses', count: 'Live Collection', desc: 'id, userId, companyName, category, address, location {latitude, longitude}, totalSpent, shiftsPosted' },
              { col: 'workers', count: `${workers.length} documents`, desc: 'id, userId, name, skills[], experienceYears, reliabilityScore, availabilityStatus, location, verificationStatus' },
              { col: 'shifts', count: `${shifts.length} documents`, desc: 'id, businessId, role, requiredSkills[], startTime, endTime, payAmount, platformFee (10%), status, assignedWorkerId, backupWorkerId, qrCodeSecret' },
              { col: 'attendance', count: `${attendanceLogs.length} documents`, desc: 'id, shiftId, workerId, checkInTime, checkOutTime, status, verifiedBy (qr_scan), locationVerified' },
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
