import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Shift, Worker } from '../../types';
import { useShifts } from '../../context/ShiftContext';
import { QrCode, Camera, CheckCircle2, AlertCircle, X, Sparkles, MapPin, Building } from 'lucide-react';

interface QRScannerModalProps {
  shift: Shift;
  worker: Worker;
  mode: 'check_in' | 'check_out';
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  shift,
  worker,
  mode,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { checkInWorkerQR, checkOutWorkerQR } = useShifts();
  const [manualCode, setManualCode] = useState(shift.qrCodeSecret);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  if (!isOpen) return null;

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6'],
      });
    } catch {
      // ignore
    }
  };

  const handleScanAction = () => {
    setIsScanning(true);
    setStatusMsg(null);

    setTimeout(async () => {
      setIsScanning(false);
      if (mode === 'check_in') {
        const result = await checkInWorkerQR(shift.id, worker.id, manualCode.trim());
        if (result.success) {
          triggerConfetti();
          setStatusMsg({ type: 'success', text: result.message });
          if (onSuccess) setTimeout(onSuccess, 1500);
        } else {
          setStatusMsg({ type: 'error', text: result.message });
        }
      } else {
        const result = await checkOutWorkerQR(shift.id, worker.id);
        if (result.success) {
          triggerConfetti();
          setStatusMsg({ type: 'success', text: result.message });
          if (onSuccess) setTimeout(onSuccess, 1500);
        } else {
          setStatusMsg({ type: 'error', text: result.message });
        }
      }
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100">
        {/* Header */}
        <div className={`px-6 py-4 text-white flex items-center justify-between ${
          mode === 'check_in' ? 'bg-gradient-to-r from-emerald-600 to-teal-700' : 'bg-gradient-to-r from-blue-600 to-indigo-700'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-lg">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                {mode === 'check_in' ? 'Worker QR Check-in' : 'Worker QR Check-out'}
              </h3>
              <p className="text-xs text-emerald-100">Verify attendance at physical venue</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scanner Viewfinder Box */}
        <div className="p-6 text-center">
          <div className="relative w-64 h-64 mx-auto rounded-2xl bg-slate-950 flex flex-col items-center justify-center overflow-hidden border-4 border-slate-800 shadow-inner">
            {/* Viewfinder overlay corners */}
            <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-emerald-400 rounded-tl-lg pointer-events-none"></div>
            <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-emerald-400 rounded-tr-lg pointer-events-none"></div>
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-emerald-400 rounded-bl-lg pointer-events-none"></div>
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-emerald-400 rounded-br-lg pointer-events-none"></div>

            {/* Laser scanning bar animation */}
            {isScanning && (
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-pulse shadow-[0_0_12px_#34d399]"></div>
            )}

            <div className="flex flex-col items-center gap-2 text-slate-400 z-10 px-4">
              <QrCode className={`w-14 h-14 ${isScanning ? 'text-emerald-400 animate-spin' : 'text-slate-500'}`} />
              <span className="text-xs font-semibold text-slate-300">
                {isScanning ? 'Decoding QR Signature...' : 'Align Business QR Code in Frame'}
              </span>
              <span className="text-[10px] text-slate-500">
                GPS Geofence: 0.1 km (Verified)
              </span>
            </div>
          </div>

          {/* Business & Shift context */}
          <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-left">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <Building className="w-4 h-4 text-blue-600" />
              {shift.businessName}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {shift.location.address}
            </div>
          </div>

          {/* Feedback messages */}
          {statusMsg && (
            <div
              className={`mt-3 p-3 rounded-xl text-xs font-semibold flex items-center gap-2 text-left ${
                statusMsg.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {statusMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{statusMsg.text}</span>
            </div>
          )}

          {/* 1-Click Scan / Simulate Button */}
          <div className="mt-5 space-y-2">
            <button
              onClick={handleScanAction}
              disabled={isScanning}
              className={`w-full py-3 px-4 rounded-xl text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all ${
                mode === 'check_in'
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'
                  : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              {isScanning ? 'Processing QR Verification...' : mode === 'check_in' ? 'Scan & Confirm Check-In' : 'Scan & Confirm Shift Completion'}
            </button>
            <p className="text-[11px] text-slate-400">
              Demo mode pre-populates the correct QR signature token ({shift.qrCodeSecret}).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
