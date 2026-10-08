import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useShifts } from '../../context/ShiftContext';
import {
  Zap,
  Briefcase,
  UserCheck,
  ShieldCheck,
  PlusCircle,
  QrCode,
  Award,
  DollarSign,
  BarChart3,
  LogOut,
  Bell,
  CheckCircle2,
  Menu,
  X
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentUser, switchDemoUser, logout, currentWorker, updateWorkerAvailability } = useAuth();
  const { activeOfferForWorker, shifts } = useShifts();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeOffer = currentWorker ? activeOfferForWorker(currentWorker.id) : null;
  const activeCascadingCount = shifts.filter((s) => s.status === 'cascading').length;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Demo Helper Bar for Hackathon / Judges */}
      <div className="bg-slate-900 text-slate-200 px-4 py-1.5 text-xs flex flex-wrap items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
            ⚡ Quick Demo Persona Switcher:
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <button
              onClick={() => switchDemoUser('user-b1')}
              className={`px-2.5 py-0.5 rounded transition-all flex items-center gap-1 ${
                currentUser?.id === 'user-b1'
                  ? 'bg-blue-600 text-white font-medium shadow-xs'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              ☕ Alex (Business Owner)
            </button>
            <button
              onClick={() => switchDemoUser('user-w1')}
              className={`px-2.5 py-0.5 rounded transition-all flex items-center gap-1 ${
                currentUser?.id === 'user-w1'
                  ? 'bg-emerald-600 text-white font-medium shadow-xs'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              🌟 Jordan (Worker - 98.4% Match)
            </button>
            <button
              onClick={() => switchDemoUser('user-w2')}
              className={`px-2.5 py-0.5 rounded transition-all flex items-center gap-1 ${
                currentUser?.id === 'user-w2'
                  ? 'bg-indigo-600 text-white font-medium shadow-xs'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              🌿 Maya (Candidate 2)
            </button>
            <button
              onClick={() => switchDemoUser('user-admin')}
              className={`px-2.5 py-0.5 rounded transition-all flex items-center gap-1 ${
                currentUser?.role === 'admin'
                  ? 'bg-purple-600 text-white font-medium shadow-xs'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              🛡️ Platform Admin
            </button>
          </div>
        </div>

        {/* Worker quick availability toggle */}
        {currentUser?.role === 'worker' && currentWorker && (
          <div className="flex items-center gap-2 mt-1 sm:mt-0">
            <span className="text-slate-400">Availability:</span>
            <select
              value={currentWorker.availabilityStatus}
              onChange={(e) => updateWorkerAvailability(e.target.value as any)}
              className={`text-xs px-2 py-0.5 rounded font-medium ${
                currentWorker.availabilityStatus === 'Available Now'
                  ? 'bg-emerald-500 text-white'
                  : currentWorker.availabilityStatus === 'Available Later'
                  ? 'bg-amber-500 text-slate-900'
                  : 'bg-slate-700 text-slate-300'
              }`}
            >
              <option value="Available Now">🟢 Available Now</option>
              <option value="Available Later">🟡 Available Later</option>
              <option value="Unavailable">🔴 Unavailable</option>
            </select>
          </div>
        )}
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                <Zap className="w-5 h-5 fill-white" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-2xl font-black tracking-tight text-slate-900 font-sans">NERA</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
                    MVP
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-medium tracking-tight -mt-1 hidden sm:inline">
                  A Helping Hand When You Need One
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1">
              {currentUser?.role === 'business' && (
                <>
                  <Link
                    to="/business-dashboard"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === '/business-dashboard'
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/active-shifts"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors relative ${
                      location.pathname === '/active-shifts'
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    Active Shifts
                    {activeCascadingCount > 0 && (
                      <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-white font-bold animate-pulse">
                        {activeCascadingCount}
                      </span>
                    )}
                  </Link>
                  <Link
                    to="/attendance"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === '/attendance'
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    Attendance Logs
                  </Link>
                  <Link
                    to="/analytics"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === '/analytics'
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    Analytics
                  </Link>
                </>
              )}

              {currentUser?.role === 'worker' && (
                <>
                  <Link
                    to="/worker-dashboard"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === '/worker-dashboard'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/shift-offers"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors relative ${
                      location.pathname === '/shift-offers'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    Shift Offers
                    {activeOffer && (
                      <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] bg-rose-500 text-white font-bold animate-bounce">
                        NEW
                      </span>
                    )}
                  </Link>
                  <Link
                    to="/skill-passport"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === '/skill-passport'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    Skill Passport
                  </Link>
                  <Link
                    to="/earnings"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === '/earnings'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    Earnings
                  </Link>
                  <Link
                    to="/attendance"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === '/attendance'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    QR Scan
                  </Link>
                </>
              )}

              {currentUser?.role === 'admin' && (
                <>
                  <Link
                    to="/admin-dashboard"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === '/admin-dashboard'
                        ? 'bg-purple-50 text-purple-700'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    Admin Control
                  </Link>
                  <Link
                    to="/active-shifts"
                    className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100"
                  >
                    All Shifts
                  </Link>
                  <Link
                    to="/analytics"
                    className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100"
                  >
                    Revenue & Analytics
                  </Link>
                </>
              )}
            </nav>
          </div>

          {/* Right Action Items */}
          <div className="flex items-center gap-3">
            {currentUser?.role === 'business' && (
              <Link
                to="/create-shift"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold shadow-md shadow-blue-500/20 hover:shadow-lg transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                Post Emergency Shift
              </Link>
            )}

            {currentUser?.role === 'worker' && activeOffer && (
              <Link
                to="/shift-offers"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md animate-pulse"
              >
                <Bell className="w-3.5 h-3.5" />
                Urgent Offer Waiting!
              </Link>
            )}

            {/* Profile Dropdown / Info */}
            {currentUser ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-9 h-9 rounded-full object-cover border border-slate-300 ring-2 ring-blue-500/20"
                />
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-900 leading-tight">{currentUser.name}</span>
                  <span className="text-[10px] font-medium text-slate-500 capitalize">{currentUser.role}</span>
                </div>
                <button
                  onClick={logout}
                  title="Logout"
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-1"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 text-sm font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-2">
          {currentUser?.role === 'business' && (
            <>
              <Link
                to="/business-dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
              >
                Dashboard
              </Link>
              <Link
                to="/create-shift"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-semibold text-blue-600 hover:bg-blue-50"
              >
                + Post Emergency Shift
              </Link>
              <Link
                to="/active-shifts"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
              >
                Active Shifts
              </Link>
              <Link
                to="/attendance"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
              >
                Attendance Logs
              </Link>
              <Link
                to="/analytics"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
              >
                Analytics
              </Link>
            </>
          )}

          {currentUser?.role === 'worker' && (
            <>
              <Link
                to="/worker-dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
              >
                Dashboard
              </Link>
              <Link
                to="/shift-offers"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-semibold text-emerald-600 hover:bg-emerald-50"
              >
                Shift Offers
              </Link>
              <Link
                to="/skill-passport"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
              >
                Skill Passport
              </Link>
              <Link
                to="/earnings"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
              >
                Earnings
              </Link>
              <Link
                to="/attendance"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
              >
                QR Check-in Scanner
              </Link>
            </>
          )}

          {currentUser?.role === 'admin' && (
            <>
              <Link
                to="/admin-dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
              >
                Admin Control
              </Link>
              <Link
                to="/active-shifts"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
              >
                All Shifts
              </Link>
              <Link
                to="/analytics"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
              >
                Analytics & Revenue
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};
