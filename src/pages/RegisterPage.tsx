import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Zap, Building, UserCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState<'business' | 'worker'>('business');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [category, setCategory] = useState<'café' | 'restaurant' | 'retail' | 'salon'>('café');
  const [workerRole, setWorkerRole] = useState('Barista & Shift Lead');
  const [skills, setSkills] = useState<string[]>(['Barista', 'POS Operations']);

  const availableSkillsList = [
    'Barista',
    'POS Operations',
    'Latte Art',
    'Line Cook',
    'Food Prep',
    'ServSafe Certified',
    'Retail Sales',
    'Inventory',
    'Customer Service',
    'Server',
    'Salon Assist',
  ];

  const toggleSkill = (skill: string) => {
    if (skills.includes(skill)) {
      setSkills(skills.filter((s) => s !== skill));
    } else {
      setSkills([...skills, skill]);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    await signup({
      name: name || (role === 'business' ? 'New Business Manager' : 'New Worker'),
      email: email || `user-${Date.now()}@nera.dev`,
      role,
      phone: '+1 (555) 987-6543',
    });

    if (role === 'business') {
      navigate('/business-dashboard');
    } else {
      navigate('/worker-dashboard');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-xl w-full bg-white p-8 rounded-3xl shadow-xl border border-slate-200/80">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white mx-auto shadow-md">
            <Zap className="w-6 h-6 fill-white" />
          </div>
          <h2 className="mt-3 text-2xl font-black text-slate-900 tracking-tight">Create NERA Account</h2>
          <p className="text-xs text-slate-500 mt-1">Instant Onboarding for Businesses & Verified Workers</p>
        </div>

        {/* Role toggle tabs */}
        <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => setRole('business')}
            className={`py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              role === 'business'
                ? 'bg-white text-blue-700 shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building className="w-4 h-4" />
            I'm a Business Owner
          </button>
          <button
            type="button"
            onClick={() => setRole('worker')}
            className={`py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              role === 'worker'
                ? 'bg-white text-emerald-700 shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            I'm a Nearby Worker
          </button>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Johnson"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@urbanbrew.com"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {role === 'business' ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Business / Store Name
                  </label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Urban Brew Café Soho"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Industry Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="café">☕ Café / Coffee Shop</option>
                    <option value="restaurant">🍽️ Restaurant / Bistro</option>
                    <option value="retail">🛍️ Retail / Boutique</option>
                    <option value="salon">✂️ Salon / Spa</option>
                  </select>
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Primary Role Title
                </label>
                <input
                  type="text"
                  required
                  value={workerRole}
                  onChange={(e) => setWorkerRole(e.target.value)}
                  placeholder="Senior Barista & Shift Lead"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Your Verified Skills
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableSkillsList.map((skill) => {
                    const isSelected = skills.includes(skill);
                    return (
                      <button
                        type="button"
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        className={`text-xs px-3 py-1.5 rounded-xl font-semibold border transition-all ${
                          isSelected
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {skill}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            className={`w-full py-3.5 px-4 rounded-xl text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 mt-4 ${
              role === 'business'
                ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
                : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'
            }`}
          >
            <span>Complete Registration</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-blue-600 hover:underline">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
};
