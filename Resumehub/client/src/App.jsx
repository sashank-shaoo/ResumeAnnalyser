import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import VerifyOtpPage from './pages/VerifyOtpPage.jsx';
import LandingPage from './pages/LandingPage.jsx';
import UploadPage from './pages/UploadPage.jsx';
import ProcessingPage from './pages/ProcessingPage.jsx';
import JobResultsPage from './pages/JobResultsPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import ExplorePage from './pages/ExplorePage.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './hooks/useAuth.js';

function AppContent() {
  const { loading } = useAuth();
  const location = useLocation();

  return (
    <>
      <Toaster position="top-center" />
      
      {/* Global Initial Load Overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(5, 5, 5, 0.85)',
              backdropFilter: 'blur(10px)',
              zIndex: 999999,
              display: 'flex', flexDirection: 'column',
              justifyContent: 'center', alignItems: 'center',
              pointerEvents: 'all' // Absolutely prevents all clicking beneath it
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              style={{
                width: '60px', height: '60px',
                border: '4px solid rgba(255,255,255,0.1)',
                borderTopColor: '#00f2fe',
                borderRadius: '50%',
                marginBottom: '1rem'
              }}
            />
            <motion.p
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
              style={{ color: '#00f2fe', fontWeight: 600, letterSpacing: '2px', fontSize: '0.9rem' }}
            >
              INITIALIZING...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <Navbar />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-otp" element={<VerifyOtpPage />} />
          <Route path="/upload" element={<ProtectedRoute><UploadPage /></ProtectedRoute>} />
          <Route path="/processing" element={<ProtectedRoute><ProcessingPage /></ProtectedRoute>} />
          <Route path="/results" element={<ProtectedRoute><JobResultsPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        </Routes>
      </AnimatePresence>
      {location.pathname === '/' && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
