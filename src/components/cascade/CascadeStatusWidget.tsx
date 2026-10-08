import React, { useState, useEffect } from 'react';
import { Shift, CascadeCandidate } from '../../types';
import { useShifts } from '../../context/ShiftContext';
import { Clock, UserCheck, AlertTriangle, ArrowRight, FastForward, CheckCircle2, XCircle, ShieldAlert } from 'lucide-react';

interface CascadeStatusWidgetProps {
  shift: Shift;
}

export const CascadeStatusWidget: React.FC<CascadeStatusWidgetProps> = ({ shift }) => {
  const { advanceCascadeTimerManually, workers } = useShifts();
  const [remainingSec, setRemainingSec] = useState<number>(120);

  const activeCandidate = shift.cascadeCandidates[shift.currentCascadeIndex];

  useEffect(() => {
    if (shift.status !== 'cascading' || !activeCandidate || !activeCandidate.expiresAt) {
      return;
    }

    const updateTimer = () => {
      const expires = new Date(activeCandidate.expiresAt!).getTime();
      const diff = Math.max(0, Math.floor((expires - Date.now()) / 1000));
      setRemainingSec(diff);
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [shift, activeCandidate]);

  if (!shift.cascadeCandidates || shift.cascadeCandidates.length === 0) {
    return null;
  }

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = Math.min(100, Math.max(0, ((120 - remainingSec) / 120) * 100));

  return (
    <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-5 shadow-xl border border-indigo-900/50">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 animate-pulse">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-white">Live Offer Cascade Engine</h4>
            <p className="text-xs text-indigo-300">
              {shift.status === 'cascading'
                ? `Cascade active: Candidate #${shift.currentCascadeIndex + 1} being notified`
                : shift.status === 'assigned'
                ? 'Offer Accepted! Primary & Backup Workers Locked'
                : 'Shift Matching Engine'}
            </p>
          </div>
        </div>

        {/* Live Countdown badge */}
        {shift.status === 'cascading' && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold">
              <Clock className="w-4 h-4 animate-spin" />
              <span>{formatTime(remainingSec)}</span>
            </div>
            <button
              onClick={() => advanceCascadeTimerManually(shift.id)}
              className="px-2.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1 transition-colors shadow-xs"
              title="Skip 2-minute timeout for instant presentation demo"
            >
              <FastForward className="w-3.5 h-3.5" />
              Skip Timeout (Demo)
            </button>
          </div>
        )}
      </div>

      {/* Progress countdown bar */}
      {shift.status === 'cascading' && (
        <div className="w-full bg-slate-800 rounded-full h-1.5 mb-5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-400 via-amber-400 to-rose-500 h-1.5 transition-all duration-1000 ease-linear"
            style={{ width: `${100 - progressPercent}%` }}
          ></div>
        </div>
      )}

      {/* Sequential Candidate Ladder */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {shift.cascadeCandidates.map((candidate, idx) => {
          const isCurrent = shift.status === 'cascading' && shift.currentCascadeIndex === idx;
          const isPastExpired = candidate.status === 'expired' || candidate.status === 'rejected';
          const isAccepted = candidate.status === 'accepted';
          const workerData = workers.find((w) => w.id === candidate.workerId);

          return (
            <div
              key={candidate.workerId}
              className={`p-3.5 rounded-xl border transition-all ${
                isAccepted
                  ? 'bg-emerald-950/60 border-emerald-500/50 shadow-emerald-500/10'
                  : isCurrent
                  ? 'bg-blue-900/40 border-blue-400/60 shadow-lg shadow-blue-500/10 ring-2 ring-blue-400/30'
                  : isPastExpired
                  ? 'bg-slate-900/40 border-slate-800 opacity-60'
                  : 'bg-slate-800/40 border-slate-700/60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">
                  Candidate #{idx + 1}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isAccepted
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : isCurrent
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                      : isPastExpired
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  {isAccepted
                    ? 'PRIMARY WORKER'
                    : isCurrent
                    ? 'OFFER SENT (2m)'
                    : isPastExpired
                    ? 'DECLINED/EXPIRED'
                    : 'ON DECK (NEXT)'}
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <img
                  src={candidate.workerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&auto=format&fit=crop&q=80'}
                  alt={candidate.workerName}
                  className="w-9 h-9 rounded-full object-cover border border-indigo-400/30"
                />
                <div className="overflow-hidden">
                  <h5 className="font-bold text-xs text-white truncate">{candidate.workerName}</h5>
                  <div className="flex items-center gap-1.5 text-[11px] text-indigo-200">
                    <span className="text-emerald-400 font-bold">{candidate.matchScore}% Match</span>
                    <span>•</span>
                    <span className="text-slate-300">{workerData?.reliabilityScore || 95}% Rel.</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Backup Worker Assurance Box */}
      {shift.assignedWorkerId && (
        <div className="mt-4 p-3 rounded-xl bg-emerald-900/30 border border-emerald-500/30 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <span className="font-bold text-white">Primary Confirmed:</span>{' '}
              <span className="text-emerald-300">{shift.assignedWorkerName}</span>
              {shift.backupWorkerName && (
                <span className="text-slate-300 ml-2">
                  | <strong className="text-indigo-300">Backup Reserved:</strong> {shift.backupWorkerName}
                </span>
              )}
            </div>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-bold">
            100% Shift Protection
          </span>
        </div>
      )}
    </div>
  );
};
