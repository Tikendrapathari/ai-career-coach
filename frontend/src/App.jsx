import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { Toaster } from 'react-hot-toast';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import MockInterview from './pages/MockInterview';
import CodingInterview from './pages/CodingInterview';
import CareerMentor from './pages/CareerMentor';
import RoadmapGenerator from './pages/RoadmapGenerator';
import JobMatching from './pages/JobMatching';
import CompanyPrep from './pages/CompanyPrep';
import Report from './pages/Report';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) return <Navigate to="/login" />;
    return children;
  };

  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1f2937',
                color: '#fff',
                borderRadius: '10px',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/resume-analyzer" element={
              <ProtectedRoute>
                <ResumeAnalyzer />
              </ProtectedRoute>
            } />
            <Route path="/mock-interview" element={
              <ProtectedRoute>
                <MockInterview />
              </ProtectedRoute>
            } />
            <Route path="/coding-interview" element={
              <ProtectedRoute>
                <CodingInterview />
              </ProtectedRoute>
            } />
            <Route path="/career-mentor" element={
              <ProtectedRoute>
                <CareerMentor />
              </ProtectedRoute>
            } />
            <Route path="/roadmap" element={
              <ProtectedRoute>
                <RoadmapGenerator />
              </ProtectedRoute>
            } />
            <Route path="/job-matching" element={
              <ProtectedRoute>
                <JobMatching />
              </ProtectedRoute>
            } />
            <Route path="/company-prep" element={
              <ProtectedRoute>
                <CompanyPrep />
              </ProtectedRoute>
            } />
            <Route path="/company-prep/:company" element={
              <ProtectedRoute>
                <CompanyPrep />
              </ProtectedRoute>
            } />
            <Route path="/report" element={
              <ProtectedRoute>
                <Report />
              </ProtectedRoute>
            } />
          </Routes>
        </SocketProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;