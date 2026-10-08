import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useShifts } from '../../context/ShiftContext';
import { useAuth } from '../../context/AuthContext';
import {
  Zap,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Trash2,
  Users,
  Building,
  QrCode,
  ShieldCheck,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const WorkflowHelper: React.FC = () => {
  const { shifts, workers, clearAllData, addWorker } = useShifts();
  const { switchDemoUser } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  // Workflow step detection
  const hasWorkers = workers.length > 0;
  const hasShifts = shifts.length > 0;
  const cascadingShift = shifts.find((s) => s.status === 'cascading');
  const assignedShift = shifts.find((s) => s.status === 'assigned');
  const inProgressShift = shifts.find((s) => s.status === 'in_progress');
  const completedShift = shifts.find((s) => s.status === 'completed');

  const handleQuickSeedScenario = () => {
    clearAllData();

    // 1. Add 3 realistic workers
    const w1 = addWorker({
      name: 'Jordan Rivera',
      role: 'Senior Barista & Shift Lead',
      skills: ['Barista', 'POS Operations', 'Latte Art', 'Espresso Calibration'],
      experienceYears: 4,
      reliabilityScore: 98.4,
      hourlyRate: 350,
      availabilityStatus: 'Available Now',
      isAvailable: true,
      location: { latitude: 12.9785, longitude: 77.6402, address: 'Indiranagar (0.8 km)' },
    });

    const w2 = addWorker({
      name: 'Maya Chen',
      role: 'Barista & Register Specialist',
      skills: ['Barista', 'POS Operations', 'Customer Service'],
      experienceYears: 2.5,
      reliabilityScore: 94.0,
      hourlyRate: 300,
      availabilityStatus: 'Available Now',
      isAvailable: true,
      location: { latitude: 12.9352, longitude: 77.6245, address: 'Koramangala (1.2 km)' },
    });

    const w3 = addWorker({
      name: 'Marcus Vance',
      role: 'Kitchen & Line Prep',
      skills: ['Line Cook', 'Food Prep', 'ServSafe Certified'],
      experienceYears: 3,
      reliabilityScore: 96.0,
      hourlyRate: 320,
      availabilityStatus: 'Available Now',
      isAvailable: true,
      location: { latitude: 12.9121, longitude: 77.6446, address: 'HSR Layout (1.8 km)' },
    });

    switchDemoUser('user-b1');
  };

  return (
    <div className="bg-slate-900 border-b border-indigo-900/60 text-white text-xs">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1 bg-blue-500/20 text-blue-400 rounded-md border border-blue-500/30">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-slate-200">
            Interactive MVP Workflow Guide:
          </span>
          <span className="text-slate-400 hidden md:inline">
            Follow the active step to test the full matching, cascade, QR check-in & payout lifecycle.
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleQuickSeedScenario}
            className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] flex items-center gap-1 transition-all shadow-xs"
            title="Populate test workers with zero dummy shift locks"
          >
            <RefreshCw className="w-3 h-3" />
            1-Click Load Test Workers
          </button>

          <button
            onClick={() => {
              if (window.confirm('Clear all shifts, workers, and attendance for a 100% clean empty state?')) {
                clearAllData();
              }
            }}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-slate-300 hover:text-rose-200 font-bold text-[11px] flex items-center gap-1 border border-slate-700 transition-all"
            title="Wipe database to test empty state onboarding"
          >
            <Trash2 className="w-3 h-3" />
            Clear All Data
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 text-slate-400 hover:text-white"
          >
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="bg-slate-950 px-4 py-3 border-t border-slate-800">
          <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {/* Step 1 */}
            <Link
              to="/create-shift"
              className={`p-2.5 rounded-xl border flex flex-col justify-between transition-all ${
                !hasShifts
                  ? 'bg-blue-900/40 border-blue-400 text-white font-bold ring-2 ring-blue-500/30'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-blue-400">Step 1</span>
                {hasShifts && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
              </div>
              <span className="text-xs font-semibold text-white mt-1">1. Post Shift</span>
              <span className="text-[10px] text-slate-400">Create role & skills</span>
            </Link>

            {/* Step 2 */}
            <Link
              to={shifts[0] ? `/smart-match/${shifts[0].id}` : '/create-shift'}
              className={`p-2.5 rounded-xl border flex flex-col justify-between transition-all ${
                hasShifts && !cascadingShift && !assignedShift && !inProgressShift
                  ? 'bg-blue-900/40 border-blue-400 text-white font-bold ring-2 ring-blue-500/30'
                  : hasShifts
                  ? 'bg-slate-900/80 border-slate-800 text-slate-400'
                  : 'bg-slate-900/40 border-slate-800/40 text-slate-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-indigo-400">Step 2</span>
                {(cascadingShift || assignedShift || inProgressShift) && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
              </div>
              <span className="text-xs font-semibold text-white mt-1">2. Smart Match</span>
              <span className="text-[10px] text-slate-400">5-factor rank scores</span>
            </Link>

            {/* Step 3 */}
            <Link
              to="/shift-offers"
              onClick={() => switchDemoUser('user-w1')}
              className={`p-2.5 rounded-xl border flex flex-col justify-between transition-all ${
                cascadingShift
                  ? 'bg-amber-900/40 border-amber-400 text-white font-bold ring-2 ring-amber-500/30 animate-pulse'
                  : assignedShift || inProgressShift
                  ? 'bg-slate-900/80 border-slate-800 text-slate-400'
                  : 'bg-slate-900/40 border-slate-800/40 text-slate-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-amber-400">Step 3</span>
                {(assignedShift || inProgressShift) && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
              </div>
              <span className="text-xs font-semibold text-white mt-1">3. Offer Cascade</span>
              <span className="text-[10px] text-slate-400">2-min timer & Accept</span>
            </Link>

            {/* Step 4 */}
            <Link
              to={shifts[0] ? `/live-shift/${shifts[0].id}` : '/active-shifts'}
              className={`p-2.5 rounded-xl border flex flex-col justify-between transition-all ${
                assignedShift
                  ? 'bg-emerald-900/40 border-emerald-400 text-white font-bold ring-2 ring-emerald-500/30'
                  : inProgressShift
                  ? 'bg-slate-900/80 border-slate-800 text-slate-400'
                  : 'bg-slate-900/40 border-slate-800/40 text-slate-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-emerald-400">Step 4</span>
                {inProgressShift && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
              </div>
              <span className="text-xs font-semibold text-white mt-1">4. QR Check-In</span>
              <span className="text-[10px] text-slate-400">Primary + Backup locked</span>
            </Link>

            {/* Step 5 */}
            <Link
              to="/attendance"
              className={`p-2.5 rounded-xl border flex flex-col justify-between transition-all ${
                inProgressShift
                  ? 'bg-blue-900/40 border-blue-400 text-white font-bold ring-2 ring-blue-500/30'
                  : completedShift
                  ? 'bg-slate-900/80 border-slate-800 text-slate-400'
                  : 'bg-slate-900/40 border-slate-800/40 text-slate-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-teal-400">Step 5</span>
                {completedShift && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
              </div>
              <span className="text-xs font-semibold text-white mt-1">5. Live Shift & Pay</span>
              <span className="text-[10px] text-slate-400">Scan Check-Out QR</span>
            </Link>

            {/* Step 6 */}
            <Link
              to="/skill-passport"
              className={`p-2.5 rounded-xl border flex flex-col justify-between transition-all ${
                completedShift
                  ? 'bg-purple-900/40 border-purple-400 text-white font-bold ring-2 ring-purple-500/30'
                  : 'bg-slate-900/40 border-slate-800/40 text-slate-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-purple-400">Step 6</span>
                {completedShift && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
              </div>
              <span className="text-xs font-semibold text-white mt-1">6. Rating & Passport</span>
              <span className="text-[10px] text-slate-400">Score recalibrated</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
