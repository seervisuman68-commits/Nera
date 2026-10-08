import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, ShieldCheck, HeartHandshake, PhoneCall, Clock, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Zap className="w-4 h-4 fill-white" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">NERA</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              "A Helping Hand When You Need One" — The emergency shift-replacement platform for hospitality, retail, and local businesses.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/50 border border-emerald-800/40 px-3 py-1.5 rounded-lg w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              98.2% Avg Shift Rescue Rate
            </div>
          </div>

          {/* Col 2: For Businesses */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">For Businesses</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/create-shift" className="hover:text-blue-400 transition-colors">
                  Post Emergency Shift
                </Link>
              </li>
              <li>
                <Link to="/business-dashboard" className="hover:text-blue-400 transition-colors">
                  Live Shift Monitoring
                </Link>
              </li>
              <li>
                <Link to="/active-shifts" className="hover:text-blue-400 transition-colors">
                  Cascade Offer Tracking
                </Link>
              </li>
              <li>
                <Link to="/attendance" className="hover:text-blue-400 transition-colors">
                  QR Code Check-In
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: For Workers */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">For Workers</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/worker-dashboard" className="hover:text-emerald-400 transition-colors">
                  Worker Dashboard
                </Link>
              </li>
              <li>
                <Link to="/skill-passport" className="hover:text-emerald-400 transition-colors">
                  Skill Passport & Badges
                </Link>
              </li>
              <li>
                <Link to="/shift-offers" className="hover:text-emerald-400 transition-colors">
                  Immediate Shift Offers
                </Link>
              </li>
              <li>
                <Link to="/earnings" className="hover:text-emerald-400 transition-colors">
                  Instant Payouts & Earnings
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform Engine */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Autonomous Engine</h4>
            <p className="text-xs text-slate-400">
              Powered by a 5-factor weighted smart matching algorithm, sequential 2-min offer cascade, and backup worker auto-reserve.
            </p>
            <div className="pt-1 flex items-center gap-2">
              <span className="text-[11px] bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md border border-slate-700">
                10% Commission Fee
              </span>
              <span className="text-[11px] bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md border border-slate-700">
                Zero Standby Loss
              </span>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 NERA Platform Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Emergency Hotline</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
