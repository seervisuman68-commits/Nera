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
  Sparkles
} from 'lucide-react';

export const AttendancePage: React.FC = () => {
  const { attendanceLogs, shifts, workers } = useShifts();
  const { currentUser, currentWorker } = useAuth();

  const [activeShiftScanner, setActiveShiftScanner] = useState<any | null>(null);
  const [activeShiftQR, setActiveShiftQR] = useState<any | null>(null);

  const activeShift = shifts.find((s) => ['assigned', 'in_progress'].includes(s.status));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
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
            Zero-friction geofenced QR scanning with anti-spoof check-in & check-out validation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
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
              Worker scans QR code upon arrival. GPS coordinates & timestamp recorded instantly.
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
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-900">Live Attendance History</h3>
            <p className="text-xs text-slate-500">Verified arrival timestamps and departure logs</p>
          </div>
          <span className="text-xs font-bold text-slate-400">{attendanceLogs.length} Records</span>
        </div>

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
              {attendanceLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80">
                  <td className="p-3 font-mono font-bold text-slate-900">{log.id}</td>
                  <td className="p-3 font-bold text-slate-800 flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{log.workerName}</span>
                  </td>
                  <td className="p-3 font-medium text-slate-700">{log.businessName}</td>
                  <td className="p-3">{log.role}</td>
                  <td className="p-3 font-mono text-emerald-700">
                    {new Date(log.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="p-3 font-mono text-slate-600">
                    {log.checkOutTime
                      ? new Date(log.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : 'Shift in Progress...'}
                  </td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      <QrCode className="w-3 h-3" />
                      QR Signature GPS
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 capitalize">
                      {log.status.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* QR Scanner Modal */}
      {activeShiftScanner && currentWorker && (
        <QRScannerModal
          shift={activeShiftScanner.shift}
          worker={currentWorker}
          mode={activeShiftScanner.mode}
          isOpen={!!activeShiftScanner}
          onClose={() => setActiveShiftScanner(null)}
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
