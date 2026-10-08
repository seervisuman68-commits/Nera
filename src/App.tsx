import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ShiftProvider } from './context/ShiftContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { BusinessDashboard } from './pages/BusinessDashboard';
import { CreateShiftPage } from './pages/CreateShiftPage';
import { SmartMatchResultsPage } from './pages/SmartMatchResultsPage';
import { ActiveShiftsPage } from './pages/ActiveShiftsPage';
import { LiveShiftMonitorPage } from './pages/LiveShiftMonitorPage';
import { WorkerDashboard } from './pages/WorkerDashboard';
import { ShiftOfferPage } from './pages/ShiftOfferPage';
import { SkillPassportPage } from './pages/SkillPassportPage';
import { EarningsPage } from './pages/EarningsPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { AttendancePage } from './pages/AttendancePage';
import { AnalyticsPage } from './pages/AnalyticsPage';

export function App() {
  return (
    <Router>
      <AuthProvider>
        <ShiftProvider>
          <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* 1. Landing Page */}
                <Route path="/" element={<LandingPage />} />

                {/* 2 & 3. Authentication */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* 4. Business Dashboard */}
                <Route path="/business-dashboard" element={<BusinessDashboard />} />

                {/* 5. Create Emergency Shift */}
                <Route path="/create-shift" element={<CreateShiftPage />} />

                {/* 6. Smart Match Results */}
                <Route path="/smart-match/:shiftId" element={<SmartMatchResultsPage />} />
                <Route path="/smart-match" element={<SmartMatchResultsPage />} />

                {/* 7. Active Shifts */}
                <Route path="/active-shifts" element={<ActiveShiftsPage />} />

                {/* 8. Live Shift Monitor */}
                <Route path="/live-shift/:shiftId" element={<LiveShiftMonitorPage />} />
                <Route path="/live-shift" element={<LiveShiftMonitorPage />} />

                {/* 9. Worker Dashboard */}
                <Route path="/worker-dashboard" element={<WorkerDashboard />} />

                {/* 10. Shift Offer Cascade Page */}
                <Route path="/shift-offers" element={<ShiftOfferPage />} />

                {/* 11. Skill Passport Page */}
                <Route path="/skill-passport" element={<SkillPassportPage />} />

                {/* 12. Earnings Page */}
                <Route path="/earnings" element={<EarningsPage />} />

                {/* 13. Admin Dashboard */}
                <Route path="/admin-dashboard" element={<AdminDashboard />} />

                {/* 14. Attendance Page */}
                <Route path="/attendance" element={<AttendancePage />} />

                {/* 15. Analytics Page */}
                <Route path="/analytics" element={<AnalyticsPage />} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </ShiftProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
