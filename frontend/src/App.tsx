import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

import { HomePage } from './pages/HomePage';
import { JobsPage } from './pages/JobsPage';
import { JobDetailsPage } from './pages/JobDetailsPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ApplicationFlowPage } from './pages/ApplicationFlowPage';
import { CandidateDashboardPage } from './pages/CandidateDashboardPage';
import { CandidateProfilePage } from './pages/CandidateProfilePage';
import { CandidateApplicationsPage } from './pages/CandidateApplicationsPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/jobs" element={<JobsPage />} />
              <Route path="/jobs/:id" element={<JobDetailsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/apply/:jobId" element={<ApplicationFlowPage />} />
              <Route path="/candidate/dashboard" element={<CandidateDashboardPage />} />
              <Route path="/candidate/profile" element={<CandidateProfilePage />} />
              <Route path="/candidate/applications" element={<CandidateApplicationsPage />} />
              <Route path="/admin" element={<AdminDashboardPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
