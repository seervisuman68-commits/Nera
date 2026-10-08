import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useShifts } from '../context/ShiftContext';
import { ShiftUrgency } from '../types';
import { formatINR } from '../utils/currency';
import {
  Zap,
  Clock,
  MapPin,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Building,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

export const CreateShiftPage: React.FC = () => {
  const { currentBusiness } = useAuth();
  const { createShift } = useShifts();
  const navigate = useNavigate();

  const [role, setRole] = useState('Senior Barista');
  const [urgency, setUrgency] = useState<ShiftUrgency>('EMERGENCY (Immediate)');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('01:00 PM');
  const [endTime, setEndTime] = useState('06:00 PM');
  const [address, setAddress] = useState(currentBusiness?.address || '12th Main Road, Indiranagar, Bengaluru, Karnataka 560038');
  const [latitude, setLatitude] = useState<number>(currentBusiness?.location.latitude || 12.9716);
  const [longitude, setLongitude] = useState<number>(currentBusiness?.location.longitude || 77.5946);
  const [hourlyRate, setHourlyRate] = useState<number>(350);
  const [hours, setHours] = useState<number>(5);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['Barista', 'POS Operations', 'Latte Art']);
  const [notes, setNotes] = useState('Morning barista had a family emergency. Need an experienced espresso pro for the midday rush.');

  const rolePresets: Record<string, { skills: string[]; defaultRate: number }> = {
    'Senior Barista': {
      skills: ['Barista', 'POS Operations', 'Latte Art', 'Espresso Calibration'],
      defaultRate: 350,
    },
    'Line Cook': {
      skills: ['Line Cook', 'Food Prep', 'ServSafe Certified', 'Grill & Fryer'],
      defaultRate: 300,
    },
    'Retail Specialist': {
      skills: ['Retail Sales', 'POS Operations', 'Customer Service', 'Inventory Count'],
      defaultRate: 250,
    },
    'Server / Host': {
      skills: ['Server', 'Table Service', 'Toast POS', 'Wine Knowledge'],
      defaultRate: 250,
    },
    'Salon Assistant': {
      skills: ['Salon Assist', 'Customer Service', 'Sanitation', 'Appointment Desk'],
      defaultRate: 220,
    },
  };

  const handleRoleChange = (newRole: string) => {
    setRole(newRole);
    if (rolePresets[newRole]) {
      setSelectedSkills(rolePresets[newRole].skills);
      setHourlyRate(rolePresets[newRole].defaultRate);
    }
  };

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const shiftPay = hourlyRate * hours;
  const platformFee = Math.round(shiftPay * 0.10 * 100) / 100; // 10% Platform fee
  const totalCost = shiftPay + platformFee;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const created = await createShift({
        businessId: currentBusiness?.id || 'biz-1',
        businessName: currentBusiness?.companyName || 'Urban Brew Café',
        businessCategory: currentBusiness?.category || 'café',
        role,
        requiredSkills: selectedSkills,
        date,
        startTime,
        endTime,
        location: {
          address,
          latitude,
          longitude,
        },
        hourlyRate,
        payAmount: shiftPay,
        platformFee,
        totalCost,
        urgency,
        notes,
      });

      // Navigate to Smart Match Results Page with the newly created shift ID
      navigate(`/smart-match/${created.id}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to create shift in MongoDB');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
          Step 1 of 2: Create Request
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
          Post an Emergency Shift
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Our 5-factor matching algorithm will immediately rank and cascade offers to verified nearby staff.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Urgency Level Selector */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Urgency Level
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                id: 'EMERGENCY (Immediate)',
                label: '⚡ EMERGENCY (Immediate)',
                sub: 'Cascade candidates now (under 15 min)',
                badgeBg: 'bg-rose-50 border-rose-200 text-rose-800',
              },
              {
                id: 'Today',
                label: '📅 Today (Later)',
                sub: 'Shift starts within 2-6 hours',
                badgeBg: 'bg-amber-50 border-amber-200 text-amber-800',
              },
              {
                id: 'Tomorrow',
                label: '🌅 Tomorrow',
                sub: 'Advance booking replacement',
                badgeBg: 'bg-blue-50 border-blue-200 text-blue-800',
              },
            ].map((u) => (
              <button
                type="button"
                key={u.id}
                onClick={() => setUrgency(u.id as any)}
                className={`p-4 rounded-xl text-left border transition-all ${
                  urgency === u.id
                    ? `${u.badgeBg} border-2 font-bold shadow-xs scale-[1.02]`
                    : 'bg-slate-50/70 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="text-xs font-bold">{u.label}</div>
                <div className="text-[11px] text-slate-500 mt-1">{u.sub}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Shift Role & Category */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">1. Role & Venue Details</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Role Needed
              </label>
              <select
                value={role}
                onChange={(e) => handleRoleChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="Senior Barista">☕ Senior Barista</option>
                <option value="Line Cook">🍳 Line Cook</option>
                <option value="Retail Specialist">🛍️ Retail Specialist</option>
                <option value="Server / Host">🍷 Server / Host</option>
                <option value="Salon Assistant">✂️ Salon Assistant</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Venue / Business Name
              </label>
              <input
                type="text"
                disabled
                value={currentBusiness?.companyName || 'Urban Brew Café'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-600 font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Venue Physical Address (for GPS Distance & Geofencing)
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Time, Pay & Fee Breakdown */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">2. Schedule & Compensation</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Start Time
              </label>
              <input
                type="text"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                placeholder="12:00 PM"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                End Time
              </label>
              <input
                type="text"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                placeholder="05:00 PM"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Hourly Worker Pay (₹/hr)
              </label>
              <input
                type="number"
                min={150}
                max={2500}
                step={25}
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Estimated Shift Duration (Hours)
              </label>
              <input
                type="number"
                min={1}
                max={16}
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Pricing & 10% Commission Summary Box */}
          <div className="p-4 rounded-2xl bg-slate-950 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[11px] text-slate-400 font-medium">Automatic Escrow Calculation:</span>
              <div className="text-xs text-slate-300">
                Worker Pay: <strong className="text-white">{formatINR(shiftPay)}</strong> + JEERA Fee (10%):{' '}
                <strong className="text-indigo-300">{formatINR(platformFee)}</strong>
              </div>
            </div>
            <div className="text-center sm:text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Shift Budget</span>
              <span className="text-2xl font-black text-emerald-400">{formatINR(totalCost)}</span>
            </div>
          </div>
        </div>

        {/* Required Skills Checklist */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            3. Required Skills for Matching
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              'Barista',
              'POS Operations',
              'Latte Art',
              'Espresso Calibration',
              'Line Cook',
              'Food Prep',
              'ServSafe Certified',
              'Retail Sales',
              'Inventory Count',
              'Customer Service',
              'Server',
              'Toast POS',
            ].map((skill) => {
              const isSelected = selectedSkills.includes(skill);
              return (
                <button
                  type="button"
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={`text-xs px-3.5 py-1.5 rounded-xl font-bold border transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs scale-105'
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

        {/* Shift Notes */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            4. Emergency Shift Notes for Candidate
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500"
            placeholder="E.g. What station, dress code, store manager contact on arrival..."
          />
        </div>

        {errorMessage && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm font-semibold rounded-2xl flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Submit & Match Button */}
        <div className="flex items-center justify-end gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-black text-base shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2 hover:scale-[1.02] transition-all disabled:opacity-50"
          >
            <Zap className="w-5 h-5 fill-white" />
            <span>{isSubmitting ? 'Posting & Saving to MongoDB...' : 'Find Smart Matches & Launch Cascade'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
