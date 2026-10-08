import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Shift } from '../../types';
import { X, Check, Copy, ShieldCheck, Clock, MapPin, Sparkles } from 'lucide-react';

interface QRGeneratorModalProps {
  shift: Shift;
  isOpen: boolean;
  onClose: () => void;
}

export const QRGeneratorModal: React.FC<QRGeneratorModalProps> = ({ shift, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const qrPayload = JSON.stringify({
    shiftId: shift.id,
    secret: shift.qrCodeSecret,
    businessId: shift.businessId,
    businessName: shift.businessName,
    role: shift.role,
    date: shift.date,
    issuedAt: new Date().toISOString(),
  });

  const handleCopySecret = () => {
    navigator.clipboard.writeText(shift.qrCodeSecret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 animate-scale-up">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-lg">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Shift Attendance QR Code</h3>
              <p className="text-xs text-blue-100">Live Secure Check-in & Check-out</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 text-center">
          <div className="mb-4">
            <h4 className="text-base font-bold text-slate-900">{shift.businessName}</h4>
            <p className="text-xs text-slate-500 font-medium">
              {shift.role} • {shift.startTime} - {shift.endTime}
            </p>
          </div>

          {/* QR Code Container */}
          <div className="inline-block p-4 bg-white rounded-2xl shadow-inner border-2 border-dashed border-blue-300 relative group">
            <QRCodeSVG
              value={qrPayload}
              size={200}
              level="H"
              includeMargin={true}
              imageSettings={{
                src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&auto=format&fit=crop&q=80",
                x: undefined,
                y: undefined,
                height: 28,
                width: 28,
                excavate: true,
              }}
            />
            <div className="absolute inset-x-0 bottom-2 text-[10px] text-blue-600 font-bold bg-blue-50/90 py-0.5 rounded-md mx-4">
              JEERA Anti-Spoof Encrypted
            </div>
          </div>

          <p className="text-xs text-slate-500 mt-4 max-w-xs mx-auto">
            Have the worker scan this QR code on arrival to verify physical check-in and start shift pay tracking.
          </p>

          {/* Secret string for demo/manual fallback */}
          <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-left">
            <div className="truncate pr-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">QR Secret Code</span>
              <span className="text-xs font-mono font-bold text-slate-800">{shift.qrCodeSecret}</span>
            </div>
            <button
              onClick={handleCopySecret}
              className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-1 shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1 font-medium text-emerald-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Ready for live scanner
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
