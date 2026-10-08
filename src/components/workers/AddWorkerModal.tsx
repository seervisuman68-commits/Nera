import React, { useState } from 'react';
import { useShifts } from '../../context/ShiftContext';
import { Worker, AvailabilityStatus } from '../../types';
import { UserPlus, X, CheckCircle2, Sparkles, MapPin, DollarSign, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AddWorkerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdded?: (worker: Worker) => void;
}

export const AddWorkerModal: React.FC<AddWorkerModalProps> = ({ isOpen, onClose, onAdded }) => {
  const { addWorker } = useShifts();

  const [name, setName] = useState('');
  const [role, setRole] = useState('Specialty Barista');
  const [hourlyRate, setHourlyRate] = useState<number>(28);
  const [experienceYears, setExperienceYears] = useState<number>(3);
  const [reliabilityScore, setReliabilityScore] = useState<number>(98);
  const [address, setAddress] = useState('Soho, New York (0.5 km)');
  const [availabilityStatus, setAvailabilityStatus] = useState<AvailabilityStatus>('Available Now');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['Barista', 'POS Operations', 'Latte Art']);

  if (!isOpen) return null;

  const availableSkillOptions = [
    'Barista',
    'POS Operations',
    'Latte Art',
    'Espresso Calibration',
    'Line Cook',
    'Food Prep',
    'ServSafe Certified',
    'Retail Sales',
    'Customer Service',
    'Server',
    'Host / Seating',
  ];

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const created = addWorker({
      name: name || 'Test Worker',
      role,
      hourlyRate,
      experienceYears,
      reliabilityScore,
      availabilityStatus,
      isAvailable: availabilityStatus === 'Available Now',
      skills: selectedSkills,
      location: {
        latitude: 40.7248,
        longitude: -73.9984,
        address,
      },
      avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 500)}?w=150&auto=format&fit=crop&q=80`,
    });

    try {
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
    } catch {}

    if (onAdded) onAdded(created);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-white" />
            <h3 className="font-bold text-base">Register Real Test Worker</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-white/80 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Worker Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sam Rivera"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Role Title
              </label>
              <input
                type="text"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Senior Barista"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Hourly Pay ($/hr)
              </label>
              <input
                type="number"
                min={15}
                max={100}
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Years Exp
              </label>
              <input
                type="number"
                min={0}
                max={15}
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Reliability %
              </label>
              <input
                type="number"
                min={50}
                max={100}
                value={reliabilityScore}
                onChange={(e) => setReliabilityScore(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold text-emerald-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Availability Status
            </label>
            <select
              value={availabilityStatus}
              onChange={(e) => setAvailabilityStatus(e.target.value as any)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm bg-white"
            >
              <option value="Available Now">🟢 Available Now (100% Availability Score)</option>
              <option value="Available Later">🟡 Available Later (60% Availability Score)</option>
              <option value="Unavailable">🔴 Unavailable (0% Score)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Skills
            </label>
            <div className="flex flex-wrap gap-1.5">
              {availableSkillOptions.map((sk) => {
                const sel = selectedSkills.includes(sk);
                return (
                  <button
                    type="button"
                    key={sk}
                    onClick={() => toggleSkill(sk)}
                    className={`text-xs px-2.5 py-1 rounded-lg font-semibold border transition-all ${
                      sel
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {sel ? '✓ ' : '+ '}
                    {sk}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              Register Worker to Pool
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
