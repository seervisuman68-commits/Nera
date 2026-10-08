import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Zap,
  ShieldCheck,
  Clock,
  Sparkles,
  QrCode,
  Users,
  Award,
  ArrowRight,
  CheckCircle2,
  Building,
  UserCheck,
  TrendingUp,
  Flame,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useShifts } from '../context/ShiftContext';

export const LandingPage: React.FC = () => {
  const { switchDemoUser } = useAuth();
  const { shifts, workers, analytics } = useShifts();

  const [selectedIndustry, setSelectedIndustry] = useState<'cafe' | 'restaurant' | 'retail' | 'salon'>('cafe');

  const industryProfiles = {
    cafe: {
      title: 'Cafés & Specialty Coffee',
      tagline: 'Never close your espresso bar during morning rush.',
      sampleRole: 'Senior Barista & Latte Artist',
      avgTime: '4.2 mins',
      rate: '₹350 - ₹500/hr',
      verifiedSkills: ['Espresso Calibration', 'Latte Art', 'Square / Toast POS', 'Rush Line Management'],
    },
    restaurant: {
      title: 'Bistros & Restaurants',
      tagline: 'Instant line cooks, prep staff & servers when absences hit.',
      sampleRole: 'Line Cook / Sauté Specialist',
      avgTime: '6.5 mins',
      rate: '₹300 - ₹450/hr',
      verifiedSkills: ['ServSafe Certified', 'Grill & Fryer', 'Food Safety', 'Prep Speed'],
    },
    retail: {
      title: 'Boutiques & Retail Stores',
      tagline: 'Reliable floor associates and cashier leads on-demand.',
      sampleRole: 'Retail Specialist & Cashier Lead',
      avgTime: '5.1 mins',
      rate: '₹250 - ₹350/hr',
      verifiedSkills: ['Shopify POS', 'Inventory Counting', 'Customer Success', 'Visual Merchandising'],
    },
    salon: {
      title: 'Salons & Wellness Spas',
      tagline: 'Fill assistant & receptionist gaps with pre-screened talent.',
      sampleRole: 'Salon Assistant / Receptionist',
      avgTime: '7.0 mins',
      rate: '₹220 - ₹300/hr',
      verifiedSkills: ['Appointment Scheduling', 'Client Reception', 'Sanitation', 'Blowout Assist'],
    },
  };

  const activeProfile = industryProfiles[selectedIndustry];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 selection:bg-blue-500 selection:text-white">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-blue-600/20 via-indigo-500/20 to-teal-400/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Urgent Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-semibold mb-6 shadow-xs animate-float">
              <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>The Emergency Shift-Rescue Platform for Local Businesses</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-tight">
              A Helping Hand When You <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-teal-300">Need One.</span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
              When an employee unexpectedly calls out, JEERA automatically finds, smart-matches, and deploys verified nearby workers in <strong className="text-white font-semibold">under 15 minutes</strong>.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/create-shift"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-600 to-blue-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold text-base shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5 fill-white" />
                Post Emergency Shift (Live Demo)
              </Link>
              <Link
                to="/worker-dashboard"
                onClick={() => switchDemoUser('user-w1')}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-800/90 hover:bg-slate-800 text-slate-200 hover:text-white font-bold text-base border border-slate-700 hover:border-slate-600 shadow-md transition-all flex items-center justify-center gap-2"
              >
                <UserCheck className="w-5 h-5 text-emerald-400" />
                Explore as Worker (Jordan)
              </Link>
            </div>

            {/* Quick Metrics Bar */}
            <div className="mt-14 pt-8 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-black text-white">{analytics.fillRatePercentage}%</div>
                <div className="text-xs text-slate-400 mt-1 font-medium">Shift Rescue Rate</div>
              </div>
              <div>
                <div className="text-3xl font-black text-blue-400">&lt; 15 mins</div>
                <div className="text-xs text-slate-400 mt-1 font-medium">Avg Arrival Time</div>
              </div>
              <div>
                <div className="text-3xl font-black text-emerald-400">{analytics.averageReliability}%</div>
                <div className="text-xs text-slate-400 mt-1 font-medium">Worker Reliability Avg</div>
              </div>
              <div>
                <div className="text-3xl font-black text-amber-400">100%</div>
                <div className="text-xs text-slate-400 mt-1 font-medium">Backup Worker Guarantee</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Interactive Matching & Cascade Simulation Teaser */}
      <section className="py-16 bg-slate-950 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs uppercase font-bold tracking-widest text-blue-400">
              Autonomous Shift Engine
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-2">
              How JEERA Fixes Urgent Staffing Gaps in Seconds
            </h2>
            <p className="text-slate-400 text-sm mt-3">
              No manual phone calls. No endless group chats. Our weighted engine matches candidates and cascades offers automatically.
            </p>
          </div>

          {/* 3 Step Workflow Diagram */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xl mb-4 group-hover:scale-110 transition-transform">
                01
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Emergency Shift Post</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Manager posts shift role (e.g. Barista), location coordinates, and required skills with 1-click emergency priority.
              </p>
              <div className="text-[11px] text-blue-300 font-semibold bg-blue-950/60 p-2.5 rounded-lg border border-blue-900/60">
                ⚡ Real-time Smart Match ranks candidates instantly
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xl mb-4 group-hover:scale-110 transition-transform">
                02
              </div>
              <h3 className="text-lg font-bold text-white mb-2">2-Minute Offer Cascade</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Candidate 1 receives instant alert with 2-minute countdown. If no response or declined, automatically cascades to Candidate 2.
              </p>
              <div className="text-[11px] text-indigo-300 font-semibold bg-indigo-950/60 p-2.5 rounded-lg border border-indigo-900/60">
                ⏱️ Zero business downtime or manual chasing
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xl mb-4 group-hover:scale-110 transition-transform">
                03
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Backup & QR Check-in</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Primary and Backup worker assigned. Worker scans business QR code upon arrival to verify GPS location & log check-in.
              </p>
              <div className="text-[11px] text-emerald-300 font-semibold bg-emerald-950/60 p-2.5 rounded-lg border border-emerald-900/60">
                🛡️ Backup worker ready if primary ever cancels
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industry Solutions Selector */}
      <section className="py-16 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl font-black text-white">Built for High-Pressure Industries</h2>
            <p className="text-slate-400 text-sm mt-2">
              Select your sector to view typical emergency replacement roles & verified badges.
            </p>

            {/* Industry Tabs */}
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {[
                { id: 'cafe', label: '☕ Cafés' },
                { id: 'restaurant', label: '🍽️ Restaurants' },
                { id: 'retail', label: '🛍️ Retail Stores' },
                { id: 'salon', label: '✂️ Salons & Spas' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedIndustry(tab.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedIndustry === tab.id
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Industry Showcase Card */}
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-slate-950 to-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Sector Focus</span>
                <h3 className="text-2xl font-black text-white mt-1">{activeProfile.title}</h3>
                <p className="text-slate-300 text-sm mt-2">{activeProfile.tagline}</p>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-xs text-slate-400">Typical Shift Role:</span>
                    <span className="text-xs font-bold text-white">{activeProfile.sampleRole}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-xs text-slate-400">Avg Rescue Speed:</span>
                    <span className="text-xs font-bold text-emerald-400">{activeProfile.avgTime}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-xs text-slate-400">Standard Shift Pay:</span>
                    <span className="text-xs font-bold text-amber-400">{activeProfile.rate}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Verified Skill Passport Standards
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {activeProfile.verifiedSkills.map((skill) => (
                    <div
                      key={skill}
                      className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between"
                    >
                      <span className="text-xs font-semibold text-slate-200">{skill}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Verified ✓
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <Link
                    to="/create-shift"
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                  >
                    Post Shift for {activeProfile.title}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Matching Algorithm Formula Card */}
      <section className="py-16 bg-slate-950 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">
                Scientific Matching Architecture
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white mt-2">
                5-Factor Smart Match Engine
              </h2>
              <p className="text-slate-400 text-sm mt-3 leading-relaxed">
                Rather than broadcasting spam notifications, JEERA calculates a precision weighted score for each nearby worker in real-time.
              </p>

              <div className="mt-8 space-y-4">
                {/* Score weights */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-300">🟢 Real-Time Availability</span>
                    <span className="text-blue-400">30% Weight</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-300">🎯 Required Skill Match</span>
                    <span className="text-indigo-400">25% Weight</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-300">📍 Distance & Arrival Radius (&lt;20km)</span>
                    <span className="text-teal-400">20% Weight</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div className="bg-teal-500 h-2 rounded-full" style={{ width: '20%' }}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-300">🛡️ Reliability & Punctuality Score</span>
                    <span className="text-emerald-400">15% Weight</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '15%' }}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-300">⭐ Relevant Experience (Capped at 5 yrs)</span>
                    <span className="text-amber-400">10% Weight</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div className="bg-amber-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Card Preview */}
            <div className="bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl relative">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80"
                    alt="Jordan Rivera"
                    className="w-12 h-12 rounded-full object-cover border-2 border-emerald-400"
                  />
                  <div>
                    <h4 className="font-bold text-white text-base">Jordan Rivera</h4>
                    <p className="text-xs text-slate-400">Senior Barista • 0.8 km away</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-emerald-400">98.4%</span>
                  <span className="block text-[10px] text-slate-400 uppercase font-bold">Match Score</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 my-5 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Reliability:</span>
                  <span className="font-bold text-emerald-400 text-sm">98.4% Elite ⚡</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Availability:</span>
                  <span className="font-bold text-emerald-400 text-sm">Available Now 🟢</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Matched Skills (100%):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {['Barista', 'POS Operations', 'Latte Art', 'Fast Rush Service'].map((sk) => (
                    <span key={sk} className="px-2.5 py-1 rounded-lg bg-blue-900/40 text-blue-300 text-xs font-semibold border border-blue-800/40">
                      ✓ {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Shift Guarantee Status:</span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  Candidate #1 in Cascade
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Ready Section */}
      <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-600 text-white shadow-2xl relative overflow-hidden">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
              Ready to eliminate shift disruptions?
            </h2>
            <p className="mt-4 text-base sm:text-lg text-blue-100 max-w-xl mx-auto">
              Experience the full MVP workflow right now. Post a shift as a Business, receive offers as a Worker, or oversee operations as Admin.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                to="/create-shift"
                className="px-8 py-3.5 rounded-xl bg-white text-blue-700 font-bold text-sm shadow-md hover:bg-blue-50 transition-all"
              >
                Create Emergency Shift
              </Link>
              <Link
                to="/admin-dashboard"
                onClick={() => switchDemoUser('user-admin')}
                className="px-8 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-white font-bold text-sm border border-white/20 transition-all"
              >
                Open Admin Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
