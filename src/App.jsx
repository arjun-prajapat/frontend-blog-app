import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';

// Components
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuthStore();
  
  if (isLoading) return <div>Loading...</div>;
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const { fetchProfile } = useAuthStore();

  useEffect(() => {
    // If token exists, try to fetch the profile to maintain session
    if (localStorage.getItem('token')) {
      fetchProfile();
    }
  }, [fetchProfile]);

  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground font-sans">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
