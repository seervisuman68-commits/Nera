import React, { useState } from 'react';
import { useShifts } from '../context/ShiftContext';
import { useAuth } from '../context/AuthContext';
import { QRScannerModal } from '../components/qr/QRScannerModal';
import { QRGeneratorModal } from '../components/qr/QRGeneratorModal';
import {
  QrCode,
  CheckCircle2,
  Clock,
  MapPin,
  Building,
  UserCheck,
  ShieldCheck,
  Camera,
  Search,
  Sparkles,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';

export const AttendancePage: React.FC = () => {
  const { attendanceLogs, shifts, workers, refreshData, dbError } = useShifts();
  const { currentUser, currentWorker } = useAuth();

  const [activeShiftScanner, setActiveShiftScanner] = useState<any | null>(null);
  const [activeShiftQR, setActiveShiftQR] = useState<any | null>(null);
  const [filter, setFilter] = useState<'all' | 'checked_in' | 'completed'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    setIsRefreshing(false);
  };

  const activeShift = shifts.find((s) => ['assigned', 'in_progress'].includes(s.status));

  const filteredLogs = attendanceLogs.filter((log) => {
    if (filter === 'all') return true;
    return log.status === filter;
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
            Attendance & Verification Hub
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            QR Check-In & Attendance Records
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Zero-friction geofenced QR scanning with anti-spoof check-in & check-out validation in MongoDB.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border border-slate-200 shadow-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Sync Live Records</span>
          </button>

          {activeShift && currentUser?.role === 'worker' && currentWorker && (
            <button
              onClick={() => setActiveShiftScanner({ shift: activeShift, mode: activeShift.status === 'assigned' ? 'check_in' : 'check_out' })}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-emerald-500/20"
            >
              <Camera className="w-4 h-4" />
              <span>Launch QR Scanner (Active Shift)</span>
            </button>
          )}

          {activeShift && currentUser?.role === 'business' && (
            <button
              onClick={() => setActiveShiftQR(activeShift)}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-blue-500/20"
            >
              <QrCode className="w-4 h-4" />
              <span>Generate Venue QR Code</span>
            </button>
          )}
        </div>
      </div>

      {/* QR Flow Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start gap-4">
          <div className="p-3 rounded-xl bg-blue-50 text-blue-600 font-bold">1</div>
          <div>
            <h4 className="font-bold text-sm text-slate-900">Venue QR Display</h4>
            <p className="text-xs text-slate-500 mt-1">
              Store manager opens dynamic check-in QR code on counter tablet or phone.
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start gap-4">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 font-bold">2</div>
          <div>
            <h4 className="font-bold text-sm text-slate-900">Worker Arrival Scan</h4>
            <p className="text-xs text-slate-500 mt-1">
              Worker scans QR code upon arrival. GPS coordinates & timestamp recorded instantly in MongoDB.
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start gap-4">
          <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 font-bold">3</div>
          <div>
            <h4 className="font-bold text-sm text-slate-900">Shift Pay Starts</h4>
            <p className="text-xs text-slate-500 mt-1">
              Shift is marked live. Check-out scan automatically triggers payment release and reliability score update.
            </p>
          </div>
        </div>
      </div>

      {/* Verified Attendance Logs Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-black text-slate-900">Live Attendance History</h3>
            <p className="text-xs text-slate-500">Verified arrival timestamps and departure logs from MongoDB Atlas</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">Filter:</span>
            <div className="flex bg-slate-100 p-1 rounded-xl text-[11px] font-bold">
              <button
                onClick={() => setFilter('all')}
                className={`px-2.5 py-1 rounded-lg ${filter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
              >
                All ({attendanceLogs.length})
              </button>
              <button
                onClick={() => setFilter('checked_in')}
                className={`px-2.5 py-1 rounded-lg ${filter === 'checked_in' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500'}`}
              >
                Live ({attendanceLogs.filter(a => a.status === 'checked_in').length})
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-2.5 py-1 rounded-lg ${filter === 'completed' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-500'}`}
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
                  Unable to load attendance logs from MongoDB. Please check <code className="bg-rose-100 px-1 py-0.5 rounded font-bold">MONGODB_URI</code> in Vercel settings.
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
                <h4 className="font-bold text-sm text-slate-700">No Attendance Records</h4>
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
                        : <span className="text-amber-600 font-bold">Shift in Progress ⏱️</span>}
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

      {/* QR Scanner Modal */}
      {activeShiftScanner && currentWorker && (
        <QRScannerModal
          shift={activeShiftScanner.shift}
          worker={currentWorker}
          mode={activeShiftScanner.mode}
          isOpen={!!activeShiftScanner}
          onClose={() => setActiveShiftScanner(null)}
          onSuccess={() => refreshData()}
        />
      )}

      {/* QR Generator Modal */}
      {activeShiftQR && (
        <QRGeneratorModal
          shift={activeShiftQR}
          isOpen={!!activeShiftQR}
          onClose={() => setActiveShiftQR(null)}
        />
      )}
    </div>
  );
};
