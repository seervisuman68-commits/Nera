# NERA — Emergency Shift-Replacement Platform
> **"A Helping Hand When You Need One"**

NERA is an emergency shift-replacement platform that helps cafés, restaurants, retail stores, salons, and small businesses instantly find verified nearby workers when an employee suddenly becomes unavailable.

---

## ⚡ Core Highlights & Innovations

1. **5-Factor Scientific Smart Match Engine**
   - $\text{Match Score} = (0.30 \times \text{Availability}) + (0.25 \times \text{Skill Match}) + (0.20 \times \text{Distance}) + (0.15 \times \text{Reliability}) + (0.10 \times \text{Experience})$
   - Ranks local verified candidates in real-time with zero search latency.

2. **Sequential 2-Minute Offer Cascade**
   - Notifies Candidate #1 with a 2-minute countdown timer.
   - If Candidate #1 declines or does not respond within 2 minutes, NERA automatically forwards the offer to Candidate #2, then Candidate #3, until filled.

3. **Autonomous Backup Worker System**
   - When the primary worker accepts, the system automatically assigns the next highest-scoring candidate as a **Backup Worker (Standby)**, offering 100% protection against last-minute disruptions.

4. **Geofenced Dynamic QR Attendance**
   - Business generates encrypted, timestamped QR code tokens.
   - Workers scan QR codes on arrival (Check-In) and departure (Check-Out) to verify physical presence and unlock payment.

5. **Verified Skill Passport & Reliability Scoring**
   - Transparent performance credentials calculated from real completion rates, punctuality, and cancellation history.

6. **10% Commission Revenue Model**
   - Transparent escrow calculation with platform fee covered by businesses.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS, React Router v7, Lucide Icons, Canvas Confetti, QRCode SVG.
- **Backend & Database:** Firebase Authentication & Cloud Firestore Database (with automatic fallback to isomorphic state).
- **Tooling:** Vite, TypeScript.

---

## 📂 Project Structure

```
nera/
├── src/
│   ├── components/
│   │   ├── cascade/
│   │   │   └── CascadeStatusWidget.tsx   # Live candidate ladder & countdown
│   │   ├── common/
│   │   │   ├── Navbar.tsx                # Role navigation + 1-Click Demo Persona Switcher
│   │   │   └── Footer.tsx
│   │   ├── qr/
│   │   │   ├── QRGeneratorModal.tsx      # Business dynamic QR code generator
│   │   │   └── QRScannerModal.tsx        # Worker interactive QR scanner
│   │   └── rating/
│   │       └── RatingModal.tsx           # Rating submission & reliability updater
│   ├── config/
│   │   └── firebase.ts                   # Firebase Auth & Firestore configuration
│   ├── context/
│   │   ├── AuthContext.tsx               # Multi-role authentication & demo switching
│   │   └── ShiftContext.tsx              # Core engine, cascade timer, QR & ratings
│   ├── data/
│   │   └── mockData.ts                   # Realistic seed data for immediate demo
│   ├── pages/
│   │   ├── LandingPage.tsx               # High-converting landing page
│   │   ├── LoginPage.tsx                 # Login with 1-click persona quick-fill
│   │   ├── RegisterPage.tsx              # Business & Worker onboarding
│   │   ├── BusinessDashboard.tsx         # Business overview & live shift tracking
│   │   ├── CreateShiftPage.tsx           # Emergency shift creator & fee estimator
│   │   ├── SmartMatchResultsPage.tsx     # 5-factor candidate scores & cascade launch
│   │   ├── ActiveShiftsPage.tsx          # Shift filtering & management
│   │   ├── LiveShiftMonitorPage.tsx      # Real-time shift control room
│   │   ├── WorkerDashboard.tsx           # Worker availability toggle & shift alerts
│   │   ├── ShiftOfferPage.tsx            # Cascade offer response & 2-min timer
│   │   ├── SkillPassportPage.tsx         # Digital verified skill passport
│   │   ├── EarningsPage.tsx              # Payouts & financial overview
│   │   ├── AdminDashboard.tsx            # Platform stats, 10% cut & verifications
│   │   ├── AttendancePage.tsx            # QR check-in / check-out history
│   │   └── AnalyticsPage.tsx             # Dispatch speed & industry charts
│   ├── types/
│   │   └── index.ts                      # TypeScript definitions
│   ├── utils/
│   │   ├── matchingEngine.ts             # Weighted matching algorithm
│   │   └── reliabilityScore.ts           # Reliability scoring math & tiers
│   ├── App.tsx                           # Route configurations
│   ├── index.css                         # Tailwind CSS styling & animations
│   └── main.tsx                          # React DOM entry
├── package.json
└── vite.config.ts
```

---

## 🚀 Running the Project

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start Development Server:**
   ```bash
   npm run dev
   ```

3. **Build for Production:**
   ```bash
   npm run build
   ```

---

## 🎭 1-Click Demo Personas

The navigation bar includes a **Quick Demo Persona Switcher** at the top of every screen:
- **☕ Alex (Business Owner):** Post shifts, view cascade progress, generate check-in QR codes, rate workers.
- **🌟 Jordan (Worker - 98.4% Match):** Toggle availability (Available Now), receive cascade offers, scan QR check-in, view Skill Passport & Earnings.
- **🌿 Maya (Candidate 2):** Test offer forwarding when Candidate 1 declines or times out.
- **🛡️ Platform Admin:** Monitor 10% commission revenue, verify workers, oversee platform metrics.
