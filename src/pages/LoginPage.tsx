import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Zap, ShieldCheck, UserCheck, Building, Mail, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, switchDemoUser } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'business' | 'worker' | 'admin'>('business');
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(email || 'demo@nera.live', role);
    setLoading(false);
    if (success) {
      if (role === 'business') navigate('/business-dashboard');
      else if (role === 'worker') navigate('/worker-dashboard');
      else navigate('/admin-dashboard');
    }
  };

  const handleQuickDemoSelect = (userId: string, targetPath: string) => {
    switchDemoUser(userId);
    navigate(targetPath);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl shadow-xl border border-slate-200/80">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white mx-auto shadow-md">
            <Zap className="w-6 h-6 fill-white" />
          </div>
          <h2 className="mt-4 text-2xl font-black text-slate-900 tracking-tight">Log in to NERA</h2>
          <p className="text-xs text-slate-500 mt-1">A Helping Hand When You Need One</p>
        </div>

        {/* 1-Click Demo Login Box */}
        <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-800 block mb-2 text-center">
            ⚡ Instant 1-Click Demo Access
          </span>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => handleQuickDemoSelect('user-b1', '/business-dashboard')}
              className="w-full py-2 px-3 rounded-xl bg-white hover:bg-blue-600 hover:text-white border border-blue-200 text-xs font-bold text-slate-800 flex items-center justify-between transition-all group shadow-xs"
            >
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-blue-600 group-hover:text-white" />
                <span>Alex (Urban Brew Café)</span>
              </div>
              <span className="text-[10px] uppercase font-bold text-blue-600 group-hover:text-blue-100">Business Owner →</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoSelect('user-w1', '/worker-dashboard')}
              className="w-full py-2 px-3 rounded-xl bg-white hover:bg-emerald-600 hover:text-white border border-emerald-200 text-xs font-bold text-slate-800 flex items-center justify-between transition-all group shadow-xs"
            >
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-600 group-hover:text-white" />
                <span>Jordan Rivera (98.4% Rel.)</span>
              </div>
              <span className="text-[10px] uppercase font-bold text-emerald-600 group-hover:text-emerald-100">Worker →</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoSelect('user-admin', '/admin-dashboard')}
              className="w-full py-2 px-3 rounded-xl bg-white hover:bg-purple-600 hover:text-white border border-purple-200 text-xs font-bold text-slate-800 flex items-center justify-between transition-all group shadow-xs"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-600 group-hover:text-white" />
                <span>NERA Admin Operations</span>
              </div>
              <span className="text-[10px] uppercase font-bold text-purple-600 group-hover:text-purple-100">Platform Admin →</span>
            </button>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 w-full"></div>
          <span className="bg-white px-3 text-[11px] font-bold text-slate-400 uppercase">Or sign in with email</span>
          <div className="border-t border-slate-200 w-full"></div>
        </div>

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Select Role</label>
            <div className="grid grid-cols-3 gap-2">
              {(['business', 'worker', 'admin'] as const).map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setRole(r)}
                  className={`py-2 text-xs font-bold rounded-xl border capitalize transition-all ${
                    role === r
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={role === 'business' ? 'alex@urbanbrew.com' : 'jordan.rivera@nera.dev'}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-blue-600 hover:underline">
            Register your business or worker profile
          </Link>
        </p>
      </div>
    </div>
  );
};
