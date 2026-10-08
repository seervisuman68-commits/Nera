import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useShifts } from '../context/ShiftContext';
import { Shift, ShiftStatus } from '../types';
import { QRGeneratorModal } from '../components/qr/QRGeneratorModal';
import { RatingModal } from '../components/rating/RatingModal';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  Star,
  PlusCircle,
  Users,
  Building,
  ArrowRight,
  ShieldCheck,
  Zap,
  Filter
} from 'lucide-react';

export const ActiveShiftsPage: React.FC = () => {
  const { shifts } = useShifts();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedShiftForQR, setSelectedShiftForQR] = useState<Shift | null>(null);
  const [selectedShiftForRating, setSelectedShiftForRating] = useState<Shift | null>(null);

  const filteredShifts = shifts.filter((s) => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'active') return ['open', 'cascading', 'assigned', 'in_progress'].includes(s.status);
    return s.status === statusFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Shift Management & Tracking</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time status of all emergency replacements, cascades, and active venue attendance
          </p>
        </div>
        <Link
          to="/create-shift"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          Post New Shift
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit">
        {[
          { id: 'all', label: 'All Shifts' },
          { id: 'active', label: '⚡ Active / Cascading' },
          { id: 'assigned', label: 'Assigned' },
          { id: 'in_progress', label: 'In Progress' },
          { id: 'completed', label: 'Completed' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              statusFilter === tab.id
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Shifts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredShifts.map((shift) => (
          <div
            key={shift.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    shift.status === 'cascading'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200 animate-pulse'
                      : shift.status === 'assigned'
                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                      : shift.status === 'in_progress'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : shift.status === 'completed'
                      ? 'bg-slate-100 text-slate-700'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {shift.status.replace('_', ' ')}
                </span>
                <span className="text-xs font-bold text-slate-900">${shift.payAmount}</span>
              </div>

              <div>
                <h3 className="font-bold text-base text-slate-900">{shift.role}</h3>
                <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  {shift.businessName}
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">Date & Time:</span>
                  <span className="font-semibold text-slate-800">{shift.date} • {shift.startTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Primary Worker:</span>
                  <span className="font-bold text-emerald-700">
                    {shift.assignedWorkerName || 'Matching In Progress...'}
                  </span>
                </div>
                {shift.backupWorkerName && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Backup Worker:</span>
                    <span className="font-semibold text-indigo-600">{shift.backupWorkerName}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => setSelectedShiftForQR(shift)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 transition-colors"
              >
                <QrCode className="w-3.5 h-3.5" />
                QR Code
              </button>

              <Link
                to={`/live-shift/${shift.id}`}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1 transition-colors shadow-2xs"
              >
                <span>Live Monitor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* QR Code Modal */}
      {selectedShiftForQR && (
        <QRGeneratorModal
          shift={selectedShiftForQR}
          isOpen={!!selectedShiftForQR}
          onClose={() => setSelectedShiftForQR(null)}
        />
      )}

      {/* Rating Modal */}
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
