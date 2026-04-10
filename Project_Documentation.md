# ResumeAnnalyser - Comprehensive Project Documentation

This document provides a detailed overview of the ResumeAnnalyser project, including its architecture, dependencies, and full source code for every page.

---

## 1. Project Overview

**ResumeAnnalyser** is an AI-powered career intelligence platform. It analyzes resumes (PDF/DOCX) using Google Gemini, extracts strategic professional narratives, and matches users with elite job opportunities using the Adzuna API.

**Core Features:**
-   **AI Analysis**: Deep-context analysis of resumes to infer job titles, skills, and seniority.
-   **Strategic Job Matching**: Personalized job recommendations based on the AI-inferred profile.
-   **Executive Dashboard**: A premium UI for managing professional narratives and saved opportunities.
-   **Mobile-First Design**: Fully responsive pages with dedicated mobile-specific layouts.

---

## 2. Client-Side Documentation (`Resumehub/client`)

The client is built using **React** with **Vite**. Features include **Framer Motion** for animations, **CSS Modules** for styling, and **React Context** for state management.

### 2.1 Dependencies (`package.json`)

**Purpose**: Manages project metadata, build scripts, and dependencies.

<details>
<summary>package.json Code</summary>

```json
{
  "name": "resumehub-client",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@react-oauth/google": "^0.13.4",
    "axios": "^1.7.2",
    "framer-motion": "^11.3.8",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-dropzone": "^14.2.3",
    "react-hook-form": "^7.52.1",
    "react-hot-toast": "^2.6.0",
    "react-router-dom": "^6.26.0",
    "vite": "^5.3.4",
    "@vitejs/plugin-react": "^4.3.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0"
  }
}
```
</details>

### 2.2 Environment Variables (`.env`)

**Purpose**: Stores configuration for the backend API and external services.

<details>
<summary>.env Code</summary>

```bash
# ── Backend API Base URL ──────────────────────────────────────
VITE_API_BASE_URL=http://localhost:5000

# ── Google OAuth Client ID ─────────────────────────────────────
VITE_GOOGLE_CLIENT_ID=325692469000-e5g8i9e9fioshtlqvg4i5ipvcgqe53o0.apps.googleusercontent.com
```
</details>

### 2.3 Core Architecture

#### 1. Entry Point (`src/main.jsx`)
- **Purpose**: Initializes the React application, sets up Google OAuth, and wraps the app in the `AuthProvider`.

<details>
<summary>main.jsx Code</summary>

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/globals.css';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || 'dummy'}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
```
</details>

#### 2. Root Component (`src/App.jsx`)
- **Purpose**: Defines global navigation, route protection, and layout animations.

<details>
<summary>App.jsx Code</summary>

```jsx
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
import OnboardingPage from './pages/OnboardingPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
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
              pointerEvents: 'all'
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
          <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
          <Route path="/upload" element={<ProtectedRoute><UploadPage /></ProtectedRoute>} />
          <Route path="/processing" element={<ProtectedRoute><ProcessingPage /></ProtectedRoute>} />
          <Route path="/results" element={<ProtectedRoute><JobResultsPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="*" element={<NotFoundPage />} />
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
```
</details>

#### 3. Authentication Context (`src/context/AuthContext.jsx`)
- **Purpose**: Global state for user authentication, Google OAuth integration, and API interceptors.

<details>
<summary>AuthContext.jsx Code</summary>

```jsx
import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  const api = axios.create({
    baseURL: import.meta.env.PROD ? '/api' : (import.meta.env.VITE_API_BASE_URL ? `${import.meta.env.VITE_API_BASE_URL}/api` : 'http://localhost:5000/api'),
  });

  api.interceptors.request.use((config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, error => Promise.reject(error));

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      fetchUser();
    } else {
      localStorage.removeItem('token');
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const { data } = await api.get('/auth/me');
      if (data.success) {
        setUser(data.user);
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    if (data.success) {
      setToken(data.token);
      setUser(data.user);
    }
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    if (data.success) {
      setToken(data.token);
      setUser(data.user);
    }
    return data;
  };

  const googleLogin = async (googleToken) => {
    const { data } = await api.post('/auth/google', { token: googleToken });
    if (data.success) {
      setToken(data.token);
      setUser(data.user);
    }
    return data;
  };

  const verifyOtp = async (email, otp) => {
    const { data } = await api.post('/auth/verify-otp', { email, otp });
    if (data.success) {
      setUser(data.user);
    }
    return data;
  };

  const resendOtp = async (email) => {
    const { data } = await api.post('/auth/resend-otp', { email });
    return data;
  };

  const logout = () => {
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, googleLogin, logout, verifyOtp, resendOtp, api }}>
      {children}
    </AuthContext.Provider>
  );
};
```
</details>

### 2.4 Hooks & Services

#### 1. API Service Layer (`src/services/api.js`)
- **Purpose**: Centralized Axios instance for communicating with the ResumeAnnalyser Backend.

<details>
<summary>api.js Code</summary>

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.PROD ? '' : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'),
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' },
});

export const uploadResume = (file) => {
  const formData = new FormData();
  formData.append('resume', file);
  return api.post('/api/resume/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const analyseResume = (resumeText, personalization, userId, fileName) =>
  api.post('/api/resume/analyse', { resumeText, personalization, userId, fileName });

export const searchJobs = (jobProfile) =>
  api.post('/api/jobs/search', jobProfile);

export const createUser = (data) =>
  api.post('/api/users', data);

export const getUserById = (id) =>
  api.get(`/api/users/${id}`);

export const updateUser = (id, data) =>
  api.put(`/api/users/${id}`, data);
  
export const verifyOtp = (email, otp) =>
  api.post('/api/auth/verify-otp', { email, otp });

export const resendOtp = (email) =>
  api.post('/api/auth/resend-otp', { email });

export const saveJob = (data) =>
  api.post('/api/saved-jobs', data);

export const getExploreJobs = () => api.get('/api/jobs/explore');

export const getSavedJobs = (userId) =>
  api.get(`/api/saved-jobs/${userId}`);

export const deleteSavedJob = (id) =>
  api.delete(`/api/saved-jobs/${id}`);

export default api;
```
</details>

#### 2. Custom Hooks
- **useAuth.js**: Consumption hook for the `AuthContext`.
- **useIsMobile.js**: Reactive viewport detection with debouncing.

<details>
<summary>useAuth.js Code</summary>

```javascript
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
  return useContext(AuthContext);
};
```
</details>

<details>
<summary>useIsMobile.js Code</summary>

```javascript
import { useState, useEffect } from 'react';

const MOBILE_BREAKPOINT = 900;

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    () => window.innerWidth < MOBILE_BREAKPOINT
  );

  useEffect(() => {
    let timer;
    const handler = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
      }, 100);
    };

    window.addEventListener('resize', handler);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handler);
    };
  }, []);

  return isMobile;
}
```
</details>

### 2.5 Page Documentation & Source Code

#### 1. LandingPage (`src/pages/LandingPage.jsx`)
-   **Purpose**: The gateway to the platform. Introduces the "Executive Lens" value proposition.
-   **Usage**: Default route (`/`).
-   **Features**:
    -   Hero section with premium animations.
    -   CTAs for "Analyse My Resume" (Upload) and "Explore Jobs".
    -   "Trusted By" brand section.
    -   Detailed explanation of the analysis pipeline.

<details>
<summary>LandingPage Code</summary>

```jsx
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/LandingPage.module.css';

const tools = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
      </svg>
    ),
    label: 'AI Resume Analysis',
    desc: 'Get deep-dive audits on keyword density, leadership markers, and ATS compatibility using our proprietary executive scorecards.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/>
      </svg>
    ),
    label: 'Career Coaching',
    desc: 'Synthetic coaching sessions that simulate high-stakes interviews and provide real-time feedback on your executive presence.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
      </svg>
    ),
    label: 'Job Matching',
    desc: "We don't just find jobs; we find 'The Fit'. Our engine scouts opportunities that align with your specific trajectory and values.",
  },
];

const brands = ['Google', 'McKinsey', 'Goldman Sachs', 'Amazon', 'Deloitte', 'Microsoft'];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay },
});

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { duration: 0.55, delay },
});

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className={styles.hero}>
        {/* Background gradient mesh */}
        <div className={styles.heroBg} aria-hidden="true">
          <div className={styles.heroBgGlow1} />
          <div className={styles.heroBgGlow2} />
        </div>

        <div className={styles.heroInner}>
          {/* Left column — copy */}
          <motion.div className={styles.heroCopy} {...fadeUp(0)}>
            <span className={styles.eyebrow}>AI-Powered Career Intelligence</span>

            <h1 className={styles.heroTitle}>
              Unlock Your<br />
              <span className={styles.heroTitleAccent}>Career Potential</span><br />
              with AI.
            </h1>

            <p className={styles.heroSubtitle}>
              A bespoke intelligence layer for the modern professional. We combine
              proprietary recruitment logic with advanced LLMs to curate your next
              professional chapter.
            </p>

            <div className={styles.heroCta}>
              <button
                className={styles.btnPrimary}
                onClick={() => navigate('/upload')}
              >
                Analyse My Resume
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 8h10M9 4l4 4-4 4"/>
                </svg>
              </button>
              <button
                className={styles.btnGhost}
                onClick={() => navigate('/explore')}
              >
                Explore Jobs
              </button>
            </div>

            <p className={styles.heroNote}>Free to start · No credit card</p>
          </motion.div>

          {/* Right column — floating card */}
          <motion.div
            className={styles.heroCard}
            {...fadeUp(0.2)}
          >
            {/* Top card — AI match score */}
            <div className={styles.matchCard}>
              <div className={styles.matchHeader}>
                <div className={styles.matchIcon}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div>
                  <p className={styles.matchRole}>Chief Operations Officer</p>
                  <p className={styles.matchCompany}>Fortune 500 · Remote</p>
                </div>
                <div className={styles.matchBadge}>94%</div>
              </div>
              <div className={styles.matchBar}>
                <div className={styles.matchBarFill} style={{ width: '94%' }} />
              </div>
              <p className={styles.matchInsight}>
                "Executive presence detected. Strengthen quantifiable growth metrics in section 3."
              </p>
            </div>

            {/* Stats row */}
            <div className={styles.statsRow}>
              {[
                { value: '15K+', label: 'Leaders Placed' },
                { value: '94%',  label: 'Match Rate'    },
                { value: '30s',  label: 'Avg. Analysis' },
              ].map((s) => (
                <div key={s.label} className={styles.statCell}>
                  <span className={styles.statValue}>{s.value}</span>
                  <span className={styles.statLabel}>{s.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Trusted by ───────────────────────────────────── */}
      <section className={styles.trustedSection}>
        <div className={styles.container}>
          <p className={styles.trustedLabel}>Trusted by leaders at</p>
          <div className={styles.brandRow}>
            {brands.map((b) => (
              <span key={b} className={styles.brandName}>{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Precision Engineered Tools ───────────────────── */}
      <section className={styles.toolsSection}>
        <div className={styles.container}>
          <motion.div className={styles.sectionHead} {...fadeIn()}>
            <span className={styles.eyebrow}>What We Offer</span>
            <h2 className={styles.sectionTitle}>Precision Engineered Tools.</h2>
            <p className={styles.sectionSub}>
              We've deconstructed the black box of executive recruitment. By mapping
              elite recruitment logic against state-of-the-art LLMs, we provide
              feedback that isn't just data — it's strategy.
            </p>
          </motion.div>

          {/* Processing diagram pill */}
          <motion.div className={styles.enginePill} {...fadeIn(0.1)}>
            <span className={styles.engineTag}>Recruitment Logic</span>
            <div className={styles.engineArrow}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>
            <span className={styles.engineTag}>LLM Processing</span>
            <div className={styles.engineArrow}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>
            <span className={`${styles.engineTag} ${styles.engineTagAccent}`}>Your Career Edge</span>
          </motion.div>

          <div className={styles.toolsGrid}>
            {tools.map((t, i) => (
              <motion.div
                key={t.label}
                className={styles.toolCard}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className={styles.toolIconWrap}>{t.icon}</div>
                <h3 className={styles.toolTitle}>{t.label}</h3>
                <p className={styles.toolDesc}>{t.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────── */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <motion.div
            className={styles.ctaCard}
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className={styles.ctaGlow} aria-hidden="true" />
            <span className={styles.eyebrow}>Limited Seats Available</span>
            <h2 className={styles.ctaTitle}>Ready to Command Your Next Role?</h2>
            <p className={styles.ctaSub}>
              Join 15,000+ high-performers who have upgraded their career search with ResumeHub.
            </p>
            <button className={styles.btnPrimary} onClick={() => navigate('/register')}>
              Get Started Free
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 8h10M9 4l4 4-4 4"/>
              </svg>
            </button>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
```
</details>

#### 2. RegisterPage (`src/pages/RegisterPage.jsx`)
-   **Purpose**: Strategic enrollment portal. Supports traditional registration and Google OAuth.
-   **Usage**: Route (`/register`).

<details>
<summary>RegisterPage Code</summary>

```jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGoogleLogin } from '@react-oauth/google';
import styles from '../styles/Auth.module.css';
import { useAuth } from '../hooks/useAuth';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { register, googleLogin } = useAuth();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const data = await register(name, email, password);
      if (data.success) {
        navigate('/verify-otp');
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to register');
    }
  };

  const gLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const data = await googleLogin(tokenResponse.access_token);
        if (data.success) {
          if (data.isNewUser) {
            navigate('/onboarding');
          } else {
            navigate('/profile');
          }
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError(err.response?.data?.error || 'Google login failed');
      }
    },
    onError: () => setError('Google Registration Failed'),
  });

  return (
    <div className={styles.container}>
      <motion.div 
        className={styles.authBox}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className={styles.eyebrow}>Professional Enrollment</span>
        <h1 className={styles.title}>Join the Lens</h1>
        <p className={styles.subtitle}>Begin your journey toward an automated, elite professional presence.</p>
        
        {error && <div className={styles.errorMsg}>{error}</div>}

        <form className={styles.form} onSubmit={handleRegister}>
          <div className={styles.inputGroup}>
            <label htmlFor="name">Preferred Identity</label>
            <input 
              type="text" 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="e.g. Alex Rivera"
              required 
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Professional Email</label>
            <input 
              type="email" 
              id="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="name@company.com"
              required 
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Security Key</label>
            <input 
              type="password" 
              id="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Minimum 6 characters"
              required 
              minLength="6"
            />
          </div>
          <button type="submit" className={styles.submitBtn}>Initialize Account</button>
        </form>

        <div className={styles.divider}>Strategic Onboarding</div>

        <button onClick={() => gLogin()} className={styles.googleBtn}>
          <svg className={styles.googleIcon} viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Enroll with Google
        </button>

        <div className={styles.footer}>
          Already recognized? <Link to="/login" className={styles.link}>Access Dashboard</Link>
        </div>
      </motion.div>
    </div>
  );
}
```
</details>

#### 3. LoginPage (`src/pages/LoginPage.jsx`)
-   **Purpose**: Strategic access point. Supports traditional login and Google OAuth.
-   **Usage**: Route (`/login`).

<details>
<summary>LoginPage Code</summary>

```jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGoogleLogin } from '@react-oauth/google';
import styles from '../styles/Auth.module.css';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [showResendBtn, setShowResendBtn] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState(null);
  
  const navigate = useNavigate();
  const { login, googleLogin, resendOtp } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setShowResendBtn(false);
    try {
      const data = await login(email, password);
      if (data.success) {
        if (!data.user.isVerified) {
          toast.error("Account not verified yet.");
          setUnverifiedEmail(email);
          setShowResendBtn(true);
        } else {
          toast.success("Welcome back!");
          navigate('/profile');
        }
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to login');
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    setError(null);
    try {
      const res = await resendOtp(unverifiedEmail);
      if (res.success) {
        toast.success("A new OTP has been sent to your email!");
        navigate('/verify-otp');
      } else {
        setError(res.error || 'Failed to resend OTP');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to resend OTP');
    } finally {
      setResendLoading(false);
    }
  };

  const gLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const data = await googleLogin(tokenResponse.access_token);
        if (data.success) {
          if (data.isNewUser) {
            navigate('/onboarding');
          } else {
            toast.success("Welcome back!");
            navigate('/profile');
          }
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError(err.response?.data?.error || 'Google login failed');
      }
    },
    onError: () => setError('Google Login Failed'),
  });

  return (
    <div className={styles.container}>
      <motion.div 
        className={styles.authBox}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className={styles.eyebrow}>Executive Intelligence</span>
        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.subtitle}>Consolidate your career trajectory and manage your elite profile.</p>
        
        {error && <div className={styles.errorMsg}>{error}</div>}

        <form className={styles.form} onSubmit={handleLogin}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Professional Email</label>
            <input 
              type="email" 
              id="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="e.g. name@company.com"
              required 
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Security Key</label>
            <input 
              type="password" 
              id="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••"
              required 
            />
          </div>
          <button type="submit" className={styles.submitBtn}>Access Dashboard</button>
          
          {showResendBtn && (
            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
              <button 
                type="button" 
                onClick={handleResendOtp} 
                disabled={resendLoading}
                className={styles.submitBtn}
                style={{ background: 'rgba(255,255,255,0.05)', color: '#fff' }}
              >
                {resendLoading ? 'Sending...' : 'Resend Verification Code'}
              </button>
              <Link to="/verify-otp" className={styles.link}>
                Already have a code? Enter it here.
              </Link>
            </div>
          )}
        </form>

        {!showResendBtn && (
          <>
            <div className={styles.divider}>Strategic Access</div>

            <button onClick={() => gLogin()} className={styles.googleBtn}>
              <svg className={styles.googleIcon} viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>
          </>
        )}

        <div className={styles.footer}>
          New to the Lens? <Link to="/register" className={styles.link}>Create Account</Link>
        </div>
      </motion.div>
    </div>
  );
}
```
</details>

#### 4. UploadPage (`src/pages/UploadPage.jsx`)
-   **Purpose**: The central input mechanism for resuming analysis.

<details>
<summary>UploadPage Code</summary>

```jsx
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/UploadPage.module.css';

// SVGs for high-fidelity UI
const UploadIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const FileIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14.5 2 14.5 7 20 7" />
  </svg>
);

const ChevronRight = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

export default function UploadPage() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  const onDrop = useCallback((accepted, rejected) => {
    setError('');
    if (rejected.length > 0) {
      setError('Please upload a valid PDF or DOCX file (under 5MB).');
      return;
    }
    setFile(accepted[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 
      'application/pdf': ['.pdf'], 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] 
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
  });

  const handleAnalyse = async () => {
    if (!file) return;
    navigate('/processing', { state: { file } });
  };

  return (
    <div className={styles.page}>
      <div className={styles.wrapper}>
        
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className={styles.header}
        >
          <span className={styles.eyebrow}>AI-Driven Intelligence</span>
          <h1 className={styles.title}>Construct Strategic <br />Career Narrative</h1>
          <p className={styles.subtitle}>
            Upload your professional brief to begin a deep-context analysis against elite industry benchmarks.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className={styles.card}
        >
          <div
            {...getRootProps()}
            className={`${styles.dropzone} ${isDragActive ? styles.dragActive : ''} ${file ? styles.hasFile : ''}`}
          >
            <input {...getInputProps()} />
            
            <AnimatePresence mode="wait">
              {!file ? (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
                >
                  <UploadIcon className={styles.uploadIcon} />
                  <p className={styles.dropText}>
                    {isDragActive ? 'Release to Deposit' : 'Drag & drop professional brief'}
                  </p>
                  <p className={styles.dropOr}>or</p>
                  <button type="button" className={styles.browseBtn}>
                    Browse Local System
                  </button>
                </motion.div>
              ) : (
                <motion.div 
                  key="file"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                >
                  <div className={styles.fileIconWrapper}>
                    <FileIcon style={{ width: 32, height: 32 }} />
                  </div>
                  <p className={styles.fileName}>{file.name}</p>
                  <p className={styles.fileSize}>{(file.size / 1024).toFixed(0)} KB · Ready for Synthesis</p>
                  <button className={styles.removeBtn} onClick={(e) => { e.stopPropagation(); setFile(null); }}>
                    Discard Brief
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {error && <p className={styles.error}>⚠️ {error}</p>}

          <motion.button
            className={styles.submitBtn}
            disabled={!file}
            onClick={handleAnalyse}
            whileHover={file ? { scale: 1.01 } : {}}
            whileTap={file ? { scale: 0.99 } : {}}
          >
            Commence Analysis
            <ChevronRight />
          </motion.button>
        </motion.div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className={styles.footerNote}
        >
          Encrypted Processing · Executive Lens v5
        </motion.p>

      </div>
    </div>
  );
}
```
</details>

#### 5. VerifyOtpPage (`src/pages/VerifyOtpPage.jsx`)
-   **Purpose**: Security layer to validate user identity via email OTP.
-   **Usage**: Route (`/verify-otp`).

<details>
<summary>VerifyOtpPage Code</summary>

```jsx
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import styles from '../styles/Auth.module.css';

export default function VerifyOtpPage() {
  const { user, verifyOtp, resendOtp } = useContext(AuthContext);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState(null);
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (user && user.isVerified) {
    navigate('/');
    return null;
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMsg(null);
    setLoading(true);

    try {
      const res = await verifyOtp(user.email, otp);
      if (res.success) {
        setMsg('Successfully verified! Redirecting...');
        setTimeout(() => navigate('/onboarding'), 1500);
      } else {
        setError(res.error || 'Verification failed');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError(null);
    setMsg(null);
    try {
      const res = await resendOtp(user.email);
      if (res.success) {
        setMsg('A new OTP has been sent to your email.');
      } else {
        setError(res.error || 'Failed to resend OTP.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to resend OTP.');
    }
  };

  return (
    <div className={styles.container}>
      <motion.div 
        className={styles.authBox}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className={styles.eyebrow}>Security Verification</span>
        <h1 className={styles.title}>Validate Identity</h1>
        <p className={styles.subtitle}>
          Secure access required. Enter the 6-digit credential sent to <br />
          <strong style={{ color: '#fff' }}>{user.email}</strong>
        </p>

        {error && <div className={styles.errorMsg}>{error}</div>}
        {msg && <div style={{ color: 'var(--color-emerald)', fontSize: '0.85rem', marginBottom: '1.5rem', fontWeight: 600 }}>{msg}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="otp">Verification Code</label>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="000000"
              style={{ textAlign: 'center', letterSpacing: '0.5em', fontSize: '1.25rem', fontWeight: 800 }}
              required
              maxLength={6}
            />
          </div>

          <button type="submit" disabled={loading} className={styles.submitBtn}>
            {loading ? 'Authenticating...' : 'Establish Connection'}
          </button>
        </form>

        <div className={styles.footer}>
          Didn't receive the code?{' '}
          <button type="button" onClick={handleResend} className={styles.link}>
            Request New Code
          </button>
        </div>
      </motion.div>
    </div>
  );
}
```
</details>

#### 6. OnboardingPage (`src/pages/OnboardingPage.jsx`)
-   **Purpose**: Multi-step configuration to calibrate the user's career goals.
-   **Usage**: Route (`/onboarding`).

<details>
<summary>OnboardingPage Code</summary>

```jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { createUser } from '../services/api.js';
import styles from '../styles/OnboardingPage.module.css';

const STEPS = [
  { id: 1, label: 'Strategic Profile' },
  { id: 2, label: 'Target Environment' },
  { id: 3, label: 'Seniority Tier' },
];

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
};

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [dir, setDir] = useState(1);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const goNext = () => { setDir(1); setStep((s) => s + 1); };
  const goPrev = () => { setDir(-1); setStep((s) => s - 1); };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Create / upsert user in DB and get userId
      const res = await createUser(data);
      const userId = res.data.user.id;
      sessionStorage.setItem('userId', userId);
    } catch {
      // Non-blocking — continue without persisting userId
      sessionStorage.removeItem('userId');
    } finally {
      sessionStorage.setItem('personalization', JSON.stringify(data));
      setLoading(false);
      navigate('/upload');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.wrapper}>
        {/* Stepper */}
        <div className={styles.stepper}>
          {STEPS.map((s, i) => (
            <div key={s.id} className={styles.stepItem}>
              <div className={`${styles.stepCircle} ${step === s.id ? styles.stepActive : ''} ${step > s.id ? styles.stepCompleted : ''}`}>
                {step > s.id ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : s.id}
              </div>
              <span className={styles.stepLabel} style={{ opacity: step === s.id ? 1 : 0.5 }}>{s.label}</span>
              {i < STEPS.length - 1 && (
                <div className={`${styles.stepLine} ${step > s.id ? styles.stepLineActive : ''}`} />
              )}
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div className={styles.card}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait" custom={dir}>
              {step === 1 && (
                <motion.div key="step1" custom={dir} variants={slideVariants}
                  initial="enter" animate="center" exit="exit"
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <h2 className={styles.stepTitle}>Strategic Profiling</h2>
                  <p className={styles.stepDesc}>Establish your professional identity for precise AI alignment.</p>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Full Name</label>
                    <input className={styles.inputField} placeholder="e.g. John Doe"
                      {...register('name', { required: 'Name is required' })} />
                    {errors.name && <span className={styles.error}>{errors.name.message}</span>}
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Email Address (Optional)</label>
                    <input className={styles.inputField} type="email" placeholder="john@example.com"
                      {...register('email')} />
                  </div>

                  <div className={styles.btnRow}>
                    <button type="button" className={styles.btnPrimary} onClick={handleSubmit(goNext)}>
                      Initialize Profile →
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" custom={dir} variants={slideVariants}
                  initial="enter" animate="center" exit="exit"
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <h2 className={styles.stepTitle}>Target Environment</h2>
                  <p className={styles.stepDesc}>Define the domain and locale for your next strategic move.</p>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Operational Locale</label>
                    <select className={styles.selectField}
                      {...register('preferredLocation', { required: true })}>
                      <option value="">Select Baseline...</option>
                      <option value="Remote">Remote</option>
                      <option value="Hybrid">Hybrid Workspace</option>
                      <option value="On-site">On-site Executive</option>
                      <option value="Mumbai">Mumbai Hub</option>
                      <option value="Bangalore">Bangalore Hub</option>
                      <option value="Delhi">Delhi Hub</option>
                      <option value="Any">Global Agnostic</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Primary Domain</label>
                    <select className={styles.selectField}
                      {...register('preferredIndustry')}>
                      <option value="">Select Sector...</option>
                      <option value="Tech">Technology & SaaS</option>
                      <option value="Finance">Fintech & Banking</option>
                      <option value="Healthcare">Healthcare Operations</option>
                      <option value="Design">Product Design</option>
                      <option value="Marketing">Growth & Marketing</option>
                      <option value="Executive">Executive Leadership</option>
                    </select>
                  </div>

                  <div className={styles.btnRow}>
                    <button type="button" className={styles.btnSecondary} onClick={goPrev}>
                      ← Revise
                    </button>
                    <button type="button" className={styles.btnPrimary} onClick={goNext}>
                      Confirm Parameters →
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" custom={dir} variants={slideVariants}
                  initial="enter" animate="center" exit="exit"
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <h2 className={styles.stepTitle}>Seniority Tier</h2>
                  <p className={styles.stepDesc}>Calibrate your experience level for appropriate alignments.</p>

                  <div className={styles.levelGrid}>
                    {['Associate', 'Mid-level', 'Senior', 'Director/VP'].map((level) => (
                      <label key={level} className={styles.levelCard}>
                        <input type="radio" value={level}
                          {...register('experienceLevel', { required: true })} />
                        <span className={styles.levelLabel}>{level}</span>
                      </label>
                    ))}
                  </div>
                  {errors.experienceLevel && (
                    <span className={styles.error}>A seniority tier is required to proceed.</span>
                  )}

                  <div className={styles.btnRow}>
                    <button type="button" className={styles.btnSecondary} onClick={goPrev}>
                      ← Revise
                    </button>
                    <button type="submit" className={styles.btnPrimary} disabled={loading}>
                      {loading ? 'Finalizing...' : 'Commence Analysis →'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </div>
    </div>
  );
}
```
</details>

#### 7. ProcessingPage (`src/pages/ProcessingPage.jsx`)
-   **Purpose**: Orchestrates the multi-stage analysis pipeline, handling file upload, LLM analysis, and job searching sequentially.
-   **Usage**: Transition route during the 15-30s analysis phase.

<details>
<summary>ProcessingPage Code</summary>

```jsx
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { uploadResume, analyseResume, searchJobs } from '../services/api.js';
import { useAuth } from '../hooks/useAuth.js';
import styles from '../styles/ProcessingPage.module.css';

const MESSAGES = [
  'Commencing deep-context analysis...',
  'Deciphering strategic career trajectory...',
  'Synthesizing professional narrative...',
  'Isolating core industry competencies...',
  'Calibrating global market matches...',
  'Deep-indexing Adzuna benchmarks...',
  'Ranking elite opportunities...',
];

export default function ProcessingPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { user, loading: authLoading } = useAuth();
  const [msgIndex, setMsgIndex] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % MESSAGES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const run = async () => {
      if (authLoading) return;
      try {
        const personalization = JSON.parse(sessionStorage.getItem('personalization') || '{}');
        const userId = user?.id || sessionStorage.getItem('userId') || null;
        const file = state?.file;
        if (!file) { navigate('/upload'); return; }

        // 1. Upload & parse
        const uploadRes = await uploadResume(file);
        const resumeText = uploadRes.data.text;

        // 2. Analyse with LLM — pass null for userId/fileName to PREVENT saving to DB timeline
        const analyseRes = await analyseResume(resumeText, personalization, null, null);
        const profile = analyseRes.data.profile;

        // 3. Search jobs
        const jobsRes = await searchJobs(profile);
        const jobs = jobsRes.data.jobs;

        // Store results and navigate
        sessionStorage.setItem('profile', JSON.stringify(profile));
        sessionStorage.setItem('jobs', JSON.stringify(jobs));
        navigate('/results');
      } catch (e) {
        setError(e?.response?.data?.error || 'Analysis failed. Please try again.');
      }
    };
    run();
  }, []);

  return (
    <div className={styles.page}>
      
      {/* Ambient background orbs managed by CSS radial layout */}
      <div className={styles.wrapper}>
        
        {/* Orbital animation — "The Executive Scanner" */}
        <div className={styles.orbitalContainer}>
          <div className={styles.ring1} />
          <div className={styles.ring2} />
          <div className={styles.ring3} />
          <div className={styles.core}>✦</div>
        </div>

        {/* Status text */}
        <div style={{ minHeight: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <AnimatePresence mode="wait">
            <motion.p
              key={msgIndex}
              className={styles.message}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {MESSAGES[msgIndex]}
            </motion.p>
          </AnimatePresence>
          
          <motion.p 
            className={styles.hint}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            Synthesis in progress · Est. 15–30s
          </motion.p>
        </div>

        {error && (
          <motion.div 
            className={styles.error}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p>{error}</p>
            <button className="btn-secondary" onClick={() => navigate('/upload')}>
              Retry Submission
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
```
</details>

#### 8. JobResultsPage (`src/pages/JobResultsPage.jsx`)
-   **Purpose**: Displays matched job opportunities ranked by "Executive Fit", featuring AI-inferred insights.
-   **Usage**: Final destination after resume analysis.

<details>
<summary>JobResultsPage Code</summary>

```jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { saveJob, deleteSavedJob } from '../services/api.js';
import { useAuth } from '../hooks/useAuth.js';
import styles from '../styles/JobResultsPage.module.css';
import { useIsMobile } from '../hooks/useIsMobile.js';
import MobileJobResultsPage from './mobile/MobileJobResultsPage.jsx';

// Categorical Gradient Mapping (Mirroring Explore Page for Consistency)
const getCategoryGradient = (category) => {
  const cat = (category || '').toLowerCase();
  if (cat.includes('engineer') || cat.includes('tech') || cat.includes('data')) 
    return 'linear-gradient(135deg, #3b82f6 0%, #2dd4bf 100%)'; // Blue to Teal
  if (cat.includes('product') || cat.includes('design') || cat.includes('creative')) 
    return 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)'; // Pink to Purple
  if (cat.includes('sale') || cat.includes('market') || cat.includes('growth')) 
    return 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)'; // Amber to Orange
  if (cat.includes('finance') || cat.includes('legal') || cat.includes('consult')) 
    return 'linear-gradient(135deg, #64748b 0%, #334155 100%)'; // Slate/Deep Navy
  if (cat.includes('exec') || cat.includes('manage') || cat.includes('lead')) 
    return 'linear-gradient(135deg, #10b981 0%, #059669 100%)'; // Emerald Solid
  return 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)'; // Default Emerald-Blue
};

function MatchPill({ score }) {
  const color = score >= 75 ? 'var(--color-emerald)' : '#64748b';
  return (
    <div className={styles.matchContainer}>
      <span className={styles.scorePill} style={{ color }}>{score}%</span>
      <span className={styles.matchLabel}>Match Score</span>
    </div>
  );
}

function JobCard({ job, index, userId }) {
  const [saved, setSaved] = useState(false);
  const [savedId, setSavedId] = useState(null);
  const [saving, setSaving] = useState(false);

  // Inferred category for branding
  const category = job.title;

  const handleSave = async () => {
    if (!userId) { alert('Access Denied. Please authenticate to preserve your narrative.'); return; }
    setSaving(true);
    try {
      if (saved && savedId) {
        await deleteSavedJob(savedId);
        setSaved(false);
        setSavedId(null);
      } else {
        const res = await saveJob({
          userId,
          jobId: String(job.id),
          title: job.title,
          company: job.company,
          location: job.location,
          salary: job.salary,
          applyUrl: job.applyUrl,
        });
        setSaved(true);
        setSavedId(res.data.savedJob.id);
      }
    } catch { /* ignore */ }
    setSaving(false);
  };

  return (
    <motion.div
      className={styles.jobCard}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className={styles.jobTop}>
        <div className={styles.jobInfo}>
          <span className={styles.categoryBadge} style={{ background: getCategoryGradient(category) }}>
            {category.split(' ')[0]} / Analytical Alignment
          </span>
          <h3 className={styles.jobTitle}>{job.title}</h3>
          <div className={styles.jobMeta}>
            <span className={styles.company}>{job.company}</span>
            <div className={styles.dot} />
            <span>{job.location}</span>
            {job.salary !== 'Not specified' && (
              <>
                <div className={styles.dot} />
                <span className={styles.salary}>{job.salary}</span>
              </>
            )}
          </div>
        </div>
        <MatchPill score={job.matchScore} />
      </div>

      <p className={styles.jobDesc}>
        {job.description.split('...')[0]}...
        <span style={{ opacity: 0.5 }}> Analysis of strategic requirement continues below.</span>
      </p>

      <div className={styles.jobActions}>
        <a href={job.applyUrl} target="_blank" rel="noopener noreferrer" className={styles.applyBtn}>
          View Engagement Details ↗
        </a>
        <button
          className={`${styles.saveBtn} ${saved ? styles.saveBtnActive : ''}`}
          onClick={handleSave}
          disabled={saving}
        >
          {saved ? '✓ Strategic Asset' : 'Preserve Strategy'}
        </button>
      </div>
    </motion.div>
  );
}

export default function JobResultsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isMobile = useIsMobile();

  // ── Mobile swap ──────────────────────────────────────────
  if (isMobile) return <MobileJobResultsPage />;

  const getSessionData = (key, fallback) => {
    try {
      const data = sessionStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch { return fallback; }
  };

  const profile = getSessionData('profile', {});
  const allJobs = getSessionData('jobs', []);
  const userId = user?.id || sessionStorage.getItem('userId');
  const [filter, setFilter] = useState('All Content');

  const filters = ['All Content', 'High Match (75%+)', 'Mid Match (45%+)'];
  
  const filtered = allJobs.filter((j) => {
    if (filter === 'High Match (75%+)') return j.matchScore >= 75;
    if (filter === 'Mid Match (45%+)') return j.matchScore >= 45;
    return true;
  });

  if (!allJobs.length) {
    return (
      <div className={styles.empty}>
        <p>No analytical results found in current session.</p>
        <button className={styles.applyBtn} onClick={() => navigate('/upload')}>Re-Analyse Briefing</button>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.layout}>
        
        {/* ── Left Sidebar: The Inferred Narrative ── */}
        <aside className={styles.sidebar}>
          <motion.div
            className={styles.sideCard}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className={styles.sideHeader}>
              <span className={styles.eyebrow}>AI-Driven Insights</span>
              <h2 className={styles.sideTitle}>The Inferred Narrative</h2>
            </div>

            {profile.summary && <p className={styles.sideSummary}>{profile.summary}</p>}

            <div className={styles.sideSection}>
              <p className={styles.sideLabel}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                Strategic Persona
              </p>
              <div className={styles.tags}>
                {(profile.inferredJobTitles || []).map((t) => (
                  <span key={t} className={styles.titleTag}>{t}</span>
                ))}
              </div>
            </div>

            <div className={styles.sideSection}>
              <p className={styles.sideLabel}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
                Core Competencies
              </p>
              <div className={styles.tags}>
                {(profile.topSkills || []).map((s) => (
                  <span key={s} className={styles.skillTag}>{s}</span>
                ))}
              </div>
            </div>

            <div className={styles.sideMeta}>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Seniority Tier</span>
                <span className={styles.metaValue}>{profile.seniority || '—'}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Domain Focus</span>
                <span className={styles.metaValue}>{profile.inferredDomain || '—'}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Experience Score</span>
                <span className={styles.metaValue}>{profile.yearsOfExperience ? `${profile.yearsOfExperience} years` : '—'}</span>
              </div>
            </div>

            <button className={styles.secondaryBtn} onClick={() => navigate('/upload')}>
              Analyse Alternative Briefing
            </button>
          </motion.div>
        </aside>

        {/* ── Right: Strategic Matches ── */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <main className={styles.main}>
            <div className={styles.resultsHeader}>
              <h1 className={styles.resultsTitle}>
                {filtered.length} <span className={styles.gradientText}>Strategic</span> Career Alignments
              </h1>
              <div className={styles.filterBar}>
                {filters.map((f) => (
                  <button
                    key={f}
                    className={`${styles.filterBtn} ${filter === f ? styles.filterActive : ''}`}
                    onClick={() => setFilter(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.jobList}>
              <AnimatePresence>
                {filtered.map((job, i) => (
                  <JobCard key={job.id || i} job={job} index={i} userId={userId} />
                ))}
              </AnimatePresence>
            </div>
          </main>

        </div>

      </div>
    </div>
  );
}
```
</details>

#### 9. ProfilePage (`src/pages/ProfilePage.jsx`)
-   **Purpose**: Persisted professional hub for the user. Displays AI-extracted timeline, narrative, and saved jobs.
-   **Usage**: Route (`/profile`).

<details>
<summary>ProfilePage Code</summary>

```jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '../hooks/useAuth';
import { getUserById, updateUser, getSavedJobs, deleteSavedJob, uploadResume, analyseResume } from '../services/api';
import toast from 'react-hot-toast';
import styles from '../styles/ProfilePage.module.css';

// --- Icons ---
const EditIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
);
const TrashIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
);
const PlusIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);
const CheckIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

export default function ProfilePage() {
    const { user, login } = useAuth();
    const [profile, setProfile] = useState(null);
    const [savedJobs, setSavedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('narrative');

    // Editing States
    const [editMode, setEditMode] = useState(null); // 'bio', 'skills', etc.
    const [tempBio, setTempBio] = useState('');
    const [tempSkills, setTempSkills] = useState('');

    const fetchData = useCallback(async () => {
        if (!user?.id) return;
        try {
            const [uRes, jRes] = await Promise.all([
                getUserById(user.id),
                getSavedJobs(user.id)
            ]);
            setProfile(uRes.data.user);
            setSavedJobs(jRes.data.savedJobs || []);
            setTempBio(uRes.data.user.bio || '');
            setTempSkills((uRes.data.user.skills || []).join(', '));
        } catch (err) {
            toast.error("Failed to sync profile markers.");
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleProfileUpdate = async (field, value) => {
        try {
            const data = field === 'skills'
                ? { skills: value.split(',').map(s => s.trim()).filter(s => s) }
                : { [field]: value };

            const res = await updateUser(user.id, data);
            if (res.data.success) {
                setProfile(res.data.user);
                setEditMode(null);
                toast.success("Marker updated.");
            }
        } catch (err) {
            toast.error("Update failed.");
        }
    };

    const handleDeleteJob = async (id) => {
        try {
            await deleteSavedJob(id);
            setSavedJobs(s => s.filter(j => j.id !== id));
            toast.success("Engagement removed.");
        } catch (err) {
            toast.error("Process failed.");
        }
    };

    // --- Resume Pipeline within Profile ---
    const [isUploading, setIsUploading] = useState(false);
    const onDrop = useCallback(async (accepted) => {
        if (!accepted.length) return;
        setIsUploading(true);
        const tid = toast.loading("Synthesizing new briefcase...");
        try {
            const f = accepted[0];
            const upRes = await uploadResume(f);
            const text = upRes.data.text;
            // Pass user id to save it to DB timeline!
            await analyseResume(text, {}, user.id, f.name);
            toast.success("Briefcase integrated into timeline.", { id: tid });
            fetchData(); // Refresh to see new analysis
        } catch (err) {
            toast.error("Integration failed.", { id: tid });
        } finally {
            setIsUploading(false);
        }
    }, [user?.id, fetchData]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] },
        maxFiles: 1
    });

    if (loading) return (
        <div className={styles.loading}>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className={styles.loader} />
            <p>Syncing Professional Persona...</p>
        </div>
    );

    return (
        <div className={styles.page}>
            <div className={styles.container}>

                {/* --- Left Sidebar: Identity --- */}
                <aside className={styles.sidebar}>
                    <div className={styles.profileHeader}>
                        <div className={styles.avatar}>
                            {profile?.name?.charAt(0) || 'U'}
                        </div>
                        <h1 className={styles.name}>{profile?.name}</h1>
                        <p className={styles.email}>{profile?.email}</p>
                        <div className={styles.badge}>
                            {profile?.experienceLevel || 'Professional Tier'}
                        </div>
                    </div>

                    <div className={styles.briefcaseSection}>
                        <div {...getRootProps()} className={`${styles.dropzone} ${isDragActive ? styles.dropActive : ''}`}>
                            <input {...getInputProps()} />
                            <PlusIcon />
                            <span>{isUploading ? 'Integrating...' : 'Add Strategic Brief'}</span>
                        </div>
                    </div>

                    <nav className={styles.nav}>
                        <button
                            className={`${styles.navBtn} ${activeTab === 'narrative' ? styles.navActive : ''}`}
                            onClick={() => setActiveTab('narrative')}
                        >
                            Professional Narrative
                        </button>
                        <button
                            className={`${styles.navBtn} ${activeTab === 'timeline' ? styles.navActive : ''}`}
                            onClick={() => setActiveTab('timeline')}
                        >
                            Career Timeline
                        </button>
                        <button
                            className={`${styles.navBtn} ${activeTab === 'saved' ? styles.navActive : ''}`}
                            onClick={() => setActiveTab('saved')}
                        >
                            Saved Engagements
                        </button>
                    </nav>
                </aside>

                {/* --- Main Content --- */}
                <main className={styles.content}>
                    <AnimatePresence mode="wait">

                        {activeTab === 'narrative' && (
                            <motion.section
                                key="narrative"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className={styles.section}
                            >
                                <div className={styles.sectionHead}>
                                    <h2 className={styles.sectionTitle}>Strategic Summary</h2>
                                    {editMode !== 'bio' && (
                                        <button onClick={() => setEditMode('bio')} className={styles.editBtn}><EditIcon /></button>
                                    )}
                                </div>

                                {editMode === 'bio' ? (
                                    <div className={styles.editBox}>
                                        <textarea
                                            value={tempBio}
                                            onChange={(e) => setTempBio(e.target.value)}
                                            className={styles.textarea}
                                            placeholder="Synthesize your professional value proposition..."
                                        />
                                        <div className={styles.editActions}>
                                            <button onClick={() => setEditMode(null)} className={styles.cancelBtn}>Cancel</button>
                                            <button onClick={() => handleProfileUpdate('bio', tempBio)} className={styles.saveBtn}><CheckIcon /> Commit</button>
                                        </div>
                                    </div>
                                ) : (
                                    <p className={styles.bioText}>
                                        {profile?.bio || "No strategic narrative established yet. Upload a resume to generate one via AI."}
                                    </p>
                                )}

                                <div className={styles.divider} />

                                <div className={styles.sectionHead}>
                                    <h2 className={styles.sectionTitle}>Core Competencies</h2>
                                    {editMode !== 'skills' && (
                                        <button onClick={() => setEditMode('skills')} className={styles.editBtn}><EditIcon /></button>
                                    )}
                                </div>

                                {editMode === 'skills' ? (
                                    <div className={styles.editBox}>
                                        <input
                                            value={tempSkills}
                                            onChange={(e) => setTempSkills(e.target.value)}
                                            className={styles.input}
                                            placeholder="Skill, Skill, Skill..."
                                        />
                                        <div className={styles.editActions}>
                                            <button onClick={() => setEditMode(null)} className={styles.cancelBtn}>Cancel</button>
                                            <button onClick={() => handleProfileUpdate('skills', tempSkills)} className={styles.saveBtn}><CheckIcon /> Commit</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={styles.skillCloud}>
                                        {(profile?.skills || []).length > 0 ? (
                                            profile.skills.map(s => <span key={s} className={styles.skillTag}>{s}</span>)
                                        ) : (
                                            <p className={styles.emptyText}>No competencies indexed.</p>
                                        )}
                                    </div>
                                )}
                            </motion.section>
                        )}

                        {activeTab === 'timeline' && (
                            <motion.section
                                key="timeline"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className={styles.section}
                            >
                                <h2 className={styles.sectionTitle}>Analysis History</h2>
                                <div className={styles.timeline}>
                                    {(profile?.analyses || []).length > 0 ? (
                                        [...profile.analyses].reverse().map((a, i) => (
                                            <div key={a.id} className={styles.timelineItem}>
                                                <div className={styles.timelineMarker} />
                                                <div className={styles.timelineContent}>
                                                    <div className={styles.timelineHeader}>
                                                        <h3 className={styles.timelineTitle}>{a.inferredProfile?.inferredJobTitles?.[0] || 'Strategic Brief'}</h3>
                                                        <span className={styles.timelineDate}>{new Date(a.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                    <p className={styles.timelineDesc}>{a.inferredProfile?.summary?.substring(0, 120)}...</p>
                                                    <div className={styles.timelineTags}>
                                                        {a.inferredProfile?.topSkills?.slice(0, 3).map(s => <span key={s} className={styles.miniTag}>{s}</span>)}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className={styles.emptyTimeline}>
                                            <p>No historical briefings detected.</p>
                                        </div>
                                    )}
                                </div>
                            </motion.section>
                        )}

                        {activeTab === 'saved' && (
                            <motion.section
                                key="saved"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className={styles.section}
                            >
                                <h2 className={styles.sectionTitle}>Reserved Engagements</h2>
                                <div className={styles.jobGrid}>
                                    {savedJobs.length > 0 ? (
                                        savedJobs.map(j => (
                                            <div key={j.id} className={styles.jobCard}>
                                                <div className={styles.jobInfo}>
                                                    <h3 className={styles.jobName}>{j.title}</h3>
                                                    <p className={styles.jobCompany}>{j.company} · {j.location}</p>
                                                </div>
                                                <div className={styles.jobActions}>
                                                    <a href={j.applyUrl} target="_blank" rel="noreferrer" className={styles.viewBtn}>Details</a>
                                                    <button onClick={() => handleDeleteJob(j.id)} className={styles.deleteBtn}><TrashIcon /></button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className={styles.emptyJobs}>
                                            <p>No roles reserved for future engagement.</p>
                                            <Link to="/explore" className={styles.exploreLink}>Explore Global Index</Link>
                                        </div>
                                    )}
                                </div>
                            </motion.section>
                        )}

                    </AnimatePresence>
                </main>

            </div>
        </div>
    );
}
```
</details>

#### 10. ExplorePage (`src/pages/ExplorePage.jsx`)
-   **Purpose**: Browse categorized job listings without a resume analysis.
-   **Usage**: Route (`/explore`).

<details>
<summary>ExplorePage Code</summary>

```jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getExploreJobs } from "../services/api";
import { useAuth } from "../hooks/useAuth";
import styles from "../styles/ExplorePage.module.css";
import { useIsMobile } from "../hooks/useIsMobile";
import MobileExplorePage from "./mobile/MobileExplorePage";

// SVGs for UI
const FilterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
  </svg>
);
const BuildingIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
    <path d="M9 22v-4h6v4"></path>
    <path d="M8 6h.01"></path><path d="M16 6h.01"></path><path d="M12 6h.01"></path>
    <path d="M12 10h.01"></path><path d="M12 14h.01"></path><path d="M16 10h.01"></path>
    <path d="M16 14h.01"></path><path d="M8 10h.01"></path><path d="M8 14h.01"></path>
  </svg>
);
const GlobeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
  </svg>
);
const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

export default function ExplorePage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, loading: authLoading } = useAuth();
  const isMobile = useIsMobile();

  // ── Mobile swap ──────────────────────────────────────────
  if (isMobile) return <MobileExplorePage />;

  const canApply = user?.isVerified;

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await getExploreJobs();
        if (res.data.success) {
          setCategories(res.data.categories);
        } else {
          setError(res.data.error || "Failed to fetch explore jobs.");
        }
      } catch (err) {
        setError("Error fetching generic jobs.");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const getFirstLetter = (name) => {
    if (!name) return "?";
    return name.charAt(0).toUpperCase();
  };

  const getCategoryGradient = (category) => {
    const catLower = category.toLowerCase();
    if (catLower.includes("engineer") || catLower.includes("it") || catLower.includes("software"))
      return "linear-gradient(135deg, #10B981, #3B82F6)"; 
    if (catLower.includes("product") || catLower.includes("management"))
      return "linear-gradient(135deg, #8B5CF6, #EC4899)"; 
    if (catLower.includes("sale") || catLower.includes("business"))
      return "linear-gradient(135deg, #F59E0B, #EF4444)"; 
    if (catLower.includes("market") || catLower.includes("creative"))
      return "linear-gradient(135deg, #3B82F6, #8B5CF6)"; 
    return "linear-gradient(135deg, #10B981, #3B82F6)";
  };

  if (authLoading || loading) {
    return (
      <div className={styles.loadingContainer}>
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} className={styles.loader} />
        <p>Analyzing Global Opportunities...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorState}>
        <h2>Exploration Halted</h2>
        <p>{error}</p>
        <button className={styles.btnNav} onClick={() => window.location.reload()}>Retry Search</button>
      </div>
    );
  }

  return (
    <div className={styles.explorePage}>
      <div className={styles.container}>
        {/* ── Fixed Left Sidebar ── */}
        <motion.aside className={styles.sidebar} initial={{ x: -300 }} animate={{ x: 0 }}>
          <div className={styles.sidebarHeader}>
            <div className={styles.avatarDesktop}><span>{getFirstLetter(user?.name)}</span></div>
            <h2 className={styles.sidebarName}>{user?.name || "Executive Guest"}</h2>
            <div className={styles.sidebarStatus}>
              <span className={canApply ? styles.statusVerified : styles.statusUnverified}>
                {canApply ? "Verified Access" : "Limited Access"}
              </span>
            </div>
          </div>
          <div className={styles.sidebarContent}>
            <div className={styles.filterSection}>
              <div className={styles.filterHeader}><FilterIcon /><h3>Strategic Filters</h3></div>
              <div className={styles.filterItem}>
                <label className={styles.filterLabel}>Seniority</label>
                <select disabled className={styles.filterSelect}><option>Executive / C-Suite</option></select>
              </div>
            </div>
            <div className={styles.upsellBox}>
              <h4>Premium Intelligence</h4>
              <p>Gain priority access to unlisted C-suite roles and personalized matching.</p>
              <button className={styles.btnUpgrade}>Upgrade Access</button>
            </div>
          </div>
          <div className={styles.sidebarFooter}><p>&copy; {new Date().getFullYear()} ExecutiveLens Global.</p></div>
        </motion.aside>

        {/* ── Main Listings Area ── */}
        <main className={styles.mainContent}>
          <motion.header className={styles.header} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <span className={styles.eyebrow}>Global Exploration</span>
            <h1 className={styles.pageTitle}>Elite Opportunities</h1>
            <p className={styles.pageSubtitle}>Curated leadership roles matched to your professional trajectory.</p>
          </motion.header>

          <div className={styles.layout}>
            {categories.map((cat, idx) => (
              <section key={idx} className={styles.categorySection}>
                <div className={styles.categoryHeader}>
                  <div className={styles.categoryBrand}>
                    <div className={styles.categoryInitial} style={{ background: getCategoryGradient(cat.category) }}>{cat.category.charAt(0)}</div>
                    <h2 className={styles.categoryTitle}>{cat.category}</h2>
                  </div>
                  <a href={cat.seeMoreUrl} target="_blank" rel="noopener noreferrer" className={styles.seeMoreLink}>View Index &rarr;</a>
                </div>
                <div className={styles.jobsList}>
                  {cat.jobs.map((job) => (
                    <motion.div key={job.id} className={styles.jobCard} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                      <div className={styles.jobCardMain}>
                        <div className={styles.jobInfo}>
                          <h3 className={styles.jobTitle}>{job.title}</h3>
                          <div className={styles.jobMetaRow}>
                            <span className={styles.jobCompany}><BuildingIcon /> {job.company}</span>
                            <span className={styles.jobLocation}><GlobeIcon /> {job.location}</span>
                          </div>
                        </div>
                        <div className={styles.jobActions}>
                          {canApply ? (
                            <a href={job.applyUrl} target="_blank" rel="noopener noreferrer" className={styles.btnApply}>Apply Now</a>
                          ) : (
                            <button disabled className={styles.btnLocked} title="Please verify account to apply."><LockIcon /> Locked</button>
                          )}
                        </div>
                      </div>
                      <p className={styles.jobDescription}>{job.description}</p>
                    </motion.div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
```
</details>

#### 11. NotFoundPage (`src/pages/NotFoundPage.jsx`)
-   **Purpose**: Graceful handling of invalid route navigation.
-   **Usage**: Fallback route.

<details>
<summary>NotFoundPage Code</summary>

```jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from '../styles/NotFoundPage.module.css';

const NotFoundPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.glow} />
      <motion.div 
        className={styles.content}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className={styles.errorCode}>404</div>
        <h1 className={styles.title}>Strategic Deviation Detected</h1>
        <p className={styles.description}>
          You have navigated beyond the established parameters of the platform. 
          The requested coordinate does not contain any valid professional assets.
        </p>
        <Link to="/" className={styles.homeBtn}>Return to Base Command</Link>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
```
</details>

### 2.6 Dedicated Mobile Layouts

Mobile-specific views optimized for smaller viewports, utilizing tab-based navigation and accordion layouts.

#### 1. MobileProfilePage (`src/pages/mobile/MobileProfilePage.jsx`)
<details>
<summary>MobileProfilePage Code</summary>

```jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { getUserById, getSavedJobs, deleteSavedJob } from '../../services/api';
import styles from '../../styles/mobile/MobileProfile.module.css';

export default function MobileProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [savedJobs, setSavedJobs] = useState([]);
  const [activeTab, setActiveTab] = useState('narrative');

  useEffect(() => {
    if (user?.id) {
      getUserById(user.id).then(res => setProfile(res.data.user));
      getSavedJobs(user.id).then(res => setSavedJobs(res.data.savedJobs || []));
    }
  }, [user?.id]);

  return (
    <div className={styles.mobilePage}>
      <header className={styles.header}>
        <div className={styles.avatar}>{profile?.name?.charAt(0)}</div>
        <h1 className={styles.name}>{profile?.name}</h1>
      </header>
      <nav className={styles.tabs}>
        <button onClick={() => setActiveTab('narrative')} className={activeTab === 'narrative' ? styles.active : ''}>Identity</button>
        <button onClick={() => setActiveTab('timeline')} className={activeTab === 'timeline' ? styles.active : ''}>History</button>
        <button onClick={() => setActiveTab('saved')} className={activeTab === 'saved' ? styles.active : ''}>Saved</button>
      </nav>
      {/* ... simplified for documentation ... */}
      <div className={styles.content}>
        {activeTab === 'narrative' && <p>{profile?.bio}</p>}
      </div>
    </div>
  );
}
```
</details>

#### 2. MobileJobResultsPage (`src/pages/mobile/MobileJobResultsPage.jsx`)
<details>
<summary>MobileJobResultsPage Code</summary>

```jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from '../../styles/mobile/MobileResults.module.css';

export default function MobileJobResultsPage() {
  const [jobs, setJobs] = useState([]);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    setJobs(JSON.parse(sessionStorage.getItem('jobs') || '[]'));
    setProfile(JSON.parse(sessionStorage.getItem('profile') || '{}'));
  }, []);

  return (
    <div className={styles.mobileResults}>
      <h2 className={styles.title}>Top Alignments</h2>
      {jobs.map(job => (
        <div key={job.id} className={styles.jobCard}>
          <h3>{job.title}</h3>
          <p>{job.company}</p>
        </div>
      ))}
    </div>
  );
}
```
</details>

#### 3. MobileExplorePage (`src/pages/mobile/MobileExplorePage.jsx`)
<details>
<summary>MobileExplorePage Code</summary>

```jsx
import React, { useState, useEffect } from 'react';
import { getExploreJobs } from '../../services/api';
import styles from '../../styles/mobile/MobileExplore.module.css';

export default function MobileExplorePage() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getExploreJobs().then(res => setCategories(res.data.categories));
  }, []);

  return (
    <div className={styles.mobileExplore}>
      {categories.map(cat => (
        <div key={cat.category} className={styles.category}>
          <h3>{cat.category}</h3>
        </div>
      ))}
    </div>
  );
}
```
</details>

### 2.7 Shared UI Components

These components are reused across multiple pages to maintain consistent navigation and security.

#### 1. Navbar (`src/components/Navbar.jsx`)
<details>
<summary>Navbar Code</summary>

```jsx
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from '../styles/Navbar.module.css';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  if (pathname === '/login' || pathname === '/register') return null;

  const close = () => setMenuOpen(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    close();
  };

  return (
    <>
      <nav className={styles.navbar}>
        <Link to="/" className={styles.logo} onClick={close}>
          <span className={styles.logoIcon}>✦</span>
          <span className={styles.logoText}>ResumeHub</span>
        </Link>

        {/* Desktop links */}
        <div className={styles.navLinks}>
          <Link to="/explore" className={`${styles.navLink} ${pathname === '/explore' ? styles.navLinkActive : ''}`}>
            Explore Jobs
          </Link>
          <Link to="/upload" className={`${styles.navLink} ${pathname === '/upload' ? styles.navLinkActive : ''}`}>
            Analyse Resume
          </Link>

          {(pathname === '/results') && (
            <>
              <Link to="/results" className={`${styles.navLink} ${pathname === '/results' ? styles.navLinkActive : ''}`}>
                Results
              </Link>
            </>
          )}

          {user ? (
            <>
              <Link to="/profile" className={`${styles.navLink} ${pathname === '/profile' ? styles.navLinkActive : ''}`}>
                Profile
              </Link>
              <button onClick={handleLogout} className={styles.navLink}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.navLink}>Login</Link>
              <Link to="/register" className={styles.navCta}>Sign Up</Link>
            </>
          )}
        </div>

        {/* Hamburger button (mobile only) */}
        <button
          className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ''}`}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className={styles.drawer}>
          <div className={styles.drawerInner}>
            <Link to="/explore" className={styles.drawerLink} onClick={close}>Explore Jobs</Link>
            <Link to="/upload" className={styles.drawerLink} onClick={close}>Analyse Resume</Link>

            {user ? (
              <>
                <Link to="/profile" className={styles.drawerLink} onClick={close}>Profile</Link>
                <button onClick={handleLogout} className={styles.drawerLink}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className={styles.drawerLink} onClick={close}>Login</Link>
                <Link to="/register" className={`${styles.drawerLink} ${styles.drawerCta}`} onClick={close}>Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
```
</details>

#### 2. Footer (`src/components/Footer.jsx`)
<details>
<summary>Footer Code</summary>

```jsx
import { useLocation } from 'react-router-dom';
import styles from '../styles/Footer.module.css';

export default function Footer() {
  const { pathname } = useLocation();

  // Hide footer on auth pages and results (which has its own layout)
  if (pathname === '/login' || pathname === '/register' || pathname === '/results') return null;

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerBrand}>
          <h3><span className={styles.emerald}>✦</span> ResumeHub</h3>
          <p>The strategic engine for your next big career milestone.</p>
        </div>
        <div className={styles.footerLinks}>
          <div className={styles.linkColumn}>
            <h4>Platform</h4>
            <a href="#">AI Analysis</a>
            <a href="#">Job Matching</a>
            <a href="#">Executive Search</a>
          </div>
          <div className={styles.linkColumn}>
            <h4>Company</h4>
            <a href="#">About Us</a>
            <a href="#">Careers</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <p>© {new Date().getFullYear()} ExecutiveLens Global (ResumeHub). All rights reserved.</p>
      </div>
    </footer>
  );
}
```
</details>

#### 3. ProtectedRoute (`src/components/ProtectedRoute.jsx`)
<details>
<summary>ProtectedRoute Code</summary>

```jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';

export default function ProtectedRoute({ children }) {
  const { user, token, loading } = useAuth();
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [redirectPath, setRedirectPath] = useState('/login');

  useEffect(() => {
    if (!loading) {
      if (!token && !user) {
        toast.error("You must be logged in to view this page.", { id: 'unauth' });
        setRedirectPath('/login');
        setShouldRedirect(true);
      } else if (user && !user.isVerified) {
        setRedirectPath('/verify-otp');
        setShouldRedirect(true);
      }
    }
  }, [user, token, loading]);

  if (loading) {
    return null; // Global loader active in App.jsx handles visual
  }

  if (shouldRedirect) {
    return <Navigate to={redirectPath} replace />;
  }

  if (!user || (!user.isVerified)) {
    return null; // Render nothing while the layout calculates the effect and triggers redirect
  }

  return children;
}
```
</details>

### 2.8 Design System & Styling

The platform uses a "Midnight Professional" aesthetic defined by the following global tokens.

#### 1. Global Variables (`src/styles/globals.css`)
<details>
<summary>globals.css Code</summary>

```css
:root {
  /* Core Palette */
  --bg-primary: #05070a;
  --bg-secondary: #0d1117;
  --bg-tertiary: #161b22;
  
  --text-primary: #f0f6fc;
  --text-secondary: #8b949e;
  --text-tertiary: #484f58;

  --accent-primary: #10b981; /* Emerald */
  --accent-secondary: #3b82f6; /* Blue */
  --accent-glow: rgba(16, 185, 129, 0.15);

  --border-subtle: rgba(240, 246, 252, 0.1);
  --border-active: rgba(16, 185, 129, 0.4);

  /* Glassmorphism */
  --glass-bg: rgba(13, 17, 23, 0.8);
  --glass-border: rgba(255, 255, 255, 0.08);
  --blur-amount: 12px;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: var(--bg-primary);
}
::-webkit-scrollbar-thumb {
  background: var(--bg-tertiary);
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--text-tertiary);
}
```
</details>

---

## 3. Server-Side Documentation (`Resumehub/server`)

The backend is built with **Node.js** and **Express**, using **Prisma** as the ORM for **PostgreSQL**.

### 3.1 Dependencies (`package.json`)

```json
{
  "name": "resumehub-server",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "dev": "nodemon server.js",
    "start": "node server.js",
    "prisma:generate": "prisma generate"
  },
  "dependencies": {
    "@google/generative-ai": "^0.24.0",
    "@prisma/client": "^5.22.0",
    "axios": "^1.7.2",
    "bcryptjs": "^3.0.3",
    "express": "^4.19.2",
    "jsonwebtoken": "^9.0.3",
    "mammoth": "^1.7.2",
    "multer": "^1.4.5-lts.1",
    "pdfjs-dist": "^5.5.207",
    "prisma": "^5.22.0"
  }
}
```

### 3.2 Environment Variables (`.env`)

```bash
PORT=5000
CLIENT_URL=http://localhost:5173
GEMINI_API_KEY=********
ADZUNA_APP_ID=********
ADZUNA_APP_KEY=********
DATABASE_URL=postgresql://********
JWT_SECRET=********
```

### 3.3 Database Schema (`prisma/schema.prisma`)

**Purpose**: Defines the data models for Users, Resume Analyses, and Saved Jobs.

```prisma
model User {
  id                String           @id @default(uuid())
  name              String
  email             String?          @unique
  experienceLevel   String?
  bio               String?
  skills            String[]         @default([])
  analyses          ResumeAnalysis[]
  savedJobs         SavedJob[]
}

model ResumeAnalysis {
  id             String   @id @default(uuid())
  userId         String
  inferredProfile Json
  createdAt      DateTime @default(now())
  user           User     @relation(fields: [userId], references: [id])
}

model SavedJob {
  id       String   @id @default(uuid())
  userId   String
  title    String
  company  String
  applyUrl String
  user     User     @relation(fields: [userId], references: [id])
}
```

### 3.4 Main Server Entry Point (`server.js`)

**Purpose**: Initializes the Express server and starts listening on the configured port.

```javascript
import 'dotenv/config';
import app from './src/app.js';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[ResumeHub Server] Operational on port ${PORT}`);
});
```

### 3.5 App Configuration (`src/app.js`)

**Purpose**: Configures middleware (CORS, Helmet, Rate Limiting) and mounts API routes.

```javascript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/authRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import jobRoutes from './routes/jobRoutes.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);

app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/jobs', jobRoutes);

export default app;
```

### 3.6 Core Services Logic (Raw Code)

#### 1. Gemini Analysis Service (`src/services/llmService.js`)
- **Purpose**: Communicates with Google Gemini to analyze resume text.

<details>
<summary>llmService Code</summary>

```javascript
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// gemini-2.5-flash: Has quota on this API key and supports JSON schema
const model = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash',
  generationConfig: {
    temperature: 0.3,
    responseMimeType: 'application/json',
  },
});

/**
 * Sends resume text + personalization to Gemini and returns a structured job profile.
 * @param {string} resumeText
 * @param {Object} personalization
 * @returns {Promise<Object>} Inferred job profile
 */
export async function analyseResumeWithLLM(resumeText, personalization) {
  const prompt = `You are an expert career advisor and resume analyst.
Analyse the provided resume text and personalization preferences, then return a JSON object with EXACTLY these fields:
{
  "inferredJobTitles": string[],
  "topSkills": string[],
  "seniority": string,
  "inferredDomain": string,
  "preferredLocation": string,
  "yearsOfExperience": number,
  "summary": string,
  "experience": [
    {
      "company": string,
      "role": string,
      "duration": string,
      "highlights": string[]
    }
  ]
}

Rules:
- inferredJobTitles: 3-5 best matching job titles
- topSkills: top 8-10 technical and soft skills extracted from the resume
- seniority: one of "Junior" | "Mid-level" | "Senior" | "Lead" | "Executive"
- inferredDomain: e.g. "Software Engineering", "Data Science", "Design"
- preferredLocation: from personalization, or inferred from resume
- yearsOfExperience: estimated number from resume
- summary: 1-2 sentence professional summary
- experience: A list of 3-5 most recent roles with company, role name, duration (e.g. "2021 - Present"), and 2-3 key strategic highlights.

Return ONLY valid JSON. No markdown, no code fences, no explanation.

Resume Text:
${resumeText}

User Preferences:
- Preferred Location: ${personalization.preferredLocation || 'Any'}
- Preferred Industry: ${personalization.preferredIndustry || 'Any'}
- Seniority Level: ${personalization.experienceLevel || 'Not specified'}`;

  const result = await model.generateContent(prompt);
  const raw = result.response.text().replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
  return JSON.parse(raw);
}
```
</details>

#### 2. Job Search Service (`src/services/jobSearchService.js`)
- **Purpose**: Queries Adzuna API for live vacancies.

<details>
<summary>jobSearchService Code</summary>

```javascript
import axios from 'axios';

const ADZUNA_BASE = 'https://api.adzuna.com/v1/api/jobs';

/**
 * Searches Adzuna for jobs matching the inferred job profile.
 * @param {Object} jobProfile - Output from llmService.analyseResumeWithLLM
 * @returns {Promise<Array>} Ranked list of job objects
 */
export async function searchJobs(jobProfile) {
  const { inferredJobTitles = [], topSkills = [], preferredLocation = '', inferredDomain = '' } = jobProfile;

  const initialLocation = preferredLocation.toLowerCase() === 'remote' ? '' : preferredLocation;
  const country = (process.env.ADZUNA_COUNTRY || 'gb').replace(/[\r\n\s]/g, '');

  const getParams = (keyword, loc) => ({
    app_id: (process.env.ADZUNA_APP_ID || '').trim(),
    app_key: (process.env.ADZUNA_APP_KEY || '').trim(),
    results_per_page: 20,
    what: keyword,
    where: loc,
    'content-type': 'application/json',
  });

  let jobs = [];
  
  // Create a priority list of keywords to try
  const keywordsToTry = [...inferredJobTitles, inferredDomain, 'professional'].filter(Boolean);
  
  // Try with location first, then without location
  const locationsToTry = initialLocation ? [initialLocation, ''] : [''];

  searchLoop: for (const loc of locationsToTry) {
    for (const keyword of keywordsToTry) {
      try {
        const response = await axios.get(`${ADZUNA_BASE}/${country}/search/1`, { params: getParams(keyword, loc) });
        jobs = response.data.results || [];
        if (jobs.length > 0) {
          break searchLoop; // Found jobs, exit both loops!
        }
      } catch (error) {
        console.error(`[Adzuna API Error] keyword: "${keyword}", loc: "${loc}" -`, error.response?.data || error.message);
      }
    }
  }

  // Score and rank each job
  const scored = jobs.map((job) => ({
    id: job.id,
    title: job.title,
    company: job.company?.display_name || 'Unknown Company',
    location: job.location?.display_name || 'Unknown',
    salary:
      job.salary_min && job.salary_max
        ? `£${Math.round(job.salary_min / 1000)}k – £${Math.round(job.salary_max / 1000)}k`
        : 'Not specified',
    description: job.description?.slice(0, 300) + '...' || '',
    applyUrl: job.redirect_url,
    postedAt: job.created,
    matchScore: computeMatchScore(job, jobProfile),
  }));

  return scored.sort((a, b) => b.matchScore - a.matchScore);
}

/**
 * Simple match score: counts how many user skills appear in the job description.
 */
function computeMatchScore(job, jobProfile) {
  const jobText = `${job.title} ${job.description}`.toLowerCase();
  const { topSkills, inferredJobTitles } = jobProfile;

  let hits = 0;
  const total = topSkills.length + inferredJobTitles.length;

  for (const skill of topSkills) {
    if (jobText.includes(skill.toLowerCase())) hits++;
  }
  for (const title of inferredJobTitles) {
    if (jobText.includes(title.toLowerCase())) hits++;
  }

  return Math.round((hits / total) * 100);
}

/**
 * Fetches generic job categories for the Explore page.
 */
export async function getExploreJobs() {
  const categories = [
    { title: 'Software Engineering', keyword: 'Software Engineer' },
    { title: 'Data & Analytics', keyword: 'Data Analyst' },
    { title: 'Design & UI/UX', keyword: 'UI UX Designer' },
    { title: 'Marketing & Sales', keyword: 'Marketing Manager' }
  ];

  const country = (process.env.ADZUNA_COUNTRY || 'gb').replace(/[\r\n\s]/g, '');
  const baseParams = {
    app_id: (process.env.ADZUNA_APP_ID || '').trim(),
    app_key: (process.env.ADZUNA_APP_KEY || '').trim(),
    results_per_page: 5,
    sort_by: 'date',
    'content-type': 'application/json',
  };

  const exploreData = [];
  for (const cat of categories) {
    try {
      const res = await axios.get(`${ADZUNA_BASE}/${country}/search/1`, {
        params: { ...baseParams, what: cat.keyword }
      });
      const jobs = (res.data.results || []).map(job => ({
        id: job.id,
        title: job.title,
        company: job.company?.display_name || 'Unknown Company',
        location: job.location?.display_name || 'Unknown',
        salary:
          job.salary_min && job.salary_max
            ? `£${Math.round(job.salary_min / 1000)}k – £${Math.round(job.salary_max / 1000)}k`
            : 'Not specified',
        description: job.description?.slice(0, 150) + '...' || '',
        applyUrl: job.redirect_url,
        postedAt: job.created,
      }));
      
      exploreData.push({ category: cat.title, jobs });
    } catch (err) {
      exploreData.push({ category: cat.title, jobs: [] });
    }
  }
  return exploreData;
}
```
</details>

#### 3. Resume Parser Service (`src/services/resumeParserService.js`)
- **Purpose**: Extracts text from PDF and DOCX.

<details>
<summary>resumeParserService Code</summary>

```javascript
import fs from 'fs/promises';
import { createRequire } from 'module';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import mammoth from 'mammoth';

// ── Worker setup for Node.js ──
const require = createRequire(import.meta.url);
const workerPath = require.resolve('pdfjs-dist/legacy/build/pdf.worker.mjs');
pdfjsLib.GlobalWorkerOptions.workerSrc = `file:///${workerPath.replace(/\\/g, '/')}`;

/**
 * Extracts plain text from a PDF or DOCX file.
 */
export async function extractTextFromResume(filePath, mimetype) {
  const buffer = await fs.readFile(filePath);

  if (mimetype === 'application/pdf') {
    return extractTextFromPDF(buffer);
  }

  if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  throw new Error('Unsupported file type. Please upload a PDF or DOCX.');
}

async function extractTextFromPDF(buffer) {
  const uint8Array = new Uint8Array(buffer);
  const loadingTask = pdfjsLib.getDocument({
    data: uint8Array,
    stopAtErrors: false,
    disableRange: true,
    disableStream: true,
  });

  const pdf = await loadingTask.promise;
  const textParts = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    const pageText = content.items.map((item) => item.str).join(' ');
    textParts.push(pageText);
  }

  return textParts.join('\n').trim();
}

export async function deleteUploadedFile(filePath) {
  try {
    await fs.unlink(filePath);
  } catch {
    console.warn(`[ResumeParser] Could not delete temp file: ${filePath}`);
  }
}
```
</details>

### 3.6 Backend Core Utilities & Middleware

Essential functions and middleware that handle the plumbing of the server.

#### 1. Middleware (`src/middleware/`)
<details>
<summary>Auth, Upload, and Error Middleware</summary>

```javascript
// authMiddleware.js
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';

export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretfallback');
      req.user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, name: true, email: true, isVerified: true },
      });
      next();
    } catch (error) {
      return res.status(401).json({ success: false, error: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ success: false, error: 'Not authorized, no token' });
  }
};

// uploadMiddleware.js
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, 'uploads/'),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `resume-${unique}${path.extname(file.originalname)}`);
  },
});

export const uploadMiddleware = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
}).single('resume');

// errorMiddleware.js
export const errorMiddleware = (err, _req, res, _next) => {
  const statusCode = err.status || 500;
  res.status(statusCode).json({ success: false, error: err.message });
};
```
</details>

#### 2. Library Utilities (`src/lib/`)
<details>
<summary>ORM, JWT, and Email Utils</summary>

```javascript
// prisma.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export default prisma;

// jwt.js
import jwt from 'jsonwebtoken';
export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
};

// email.js (Brevo API)
export const sendEmail = async ({ to, subject, html }) => {
  return fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': process.env.BREVO_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sender: { name: 'ResumeHub', email: process.env.FROM_EMAIL },
      to: [{ email: to }],
      subject,
      htmlContent: html
    })
  });
};
```
</details>

### 3.7 Controllers (Full Source Code)

Controllers handle the business logic for each API domain.

#### 1. Auth Controller (`src/controllers/authController.js`)
<details>
<summary>Full AuthController Code</summary>

```javascript
import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma.js';
import { generateToken } from '../lib/jwt.js';
import { sendEmail } from '../lib/email.js';

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, isVerified: false, otp }
    });

    sendEmail({
      to: email,
      subject: 'Verify your ResumeHub account',
      html: `Your code is: ${otp}`
    });

    res.status(201).json({ success: true, token: generateToken(user.id), user });
  } catch (err) { next(err); }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (user && await bcrypt.compare(password, user.password)) {
      res.json({ success: true, token: generateToken(user.id), user });
    } else {
      res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
  } catch (err) { next(err); }
};

export const verifyOtp = async (req, res, next) => {
  const { email, otp } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (user && user.otp === otp) {
    await prisma.user.update({ where: { email }, data: { isVerified: true, otp: null } });
    res.json({ success: true, message: 'Verified' });
  } else {
    res.status(400).json({ success: false, error: 'Invalid OTP' });
  }
};
```
</details>

#### 2. Resume Controller (`src/controllers/resumeController.js`)
<details>
<summary>Full ResumeController Code</summary>

```javascript
import { extractTextFromResume, deleteUploadedFile } from '../services/resumeParserService.js';
import { analyseResumeWithLLM } from '../services/llmService.js';
import prisma from '../lib/prisma.js';

export async function uploadResume(req, res, next) {
  try {
    const text = await extractTextFromResume(req.file.path, req.file.mimetype);
    await deleteUploadedFile(req.file.path);
    res.json({ success: true, text });
  } catch (err) { next(err); }
}

export async function analyseResume(req, res, next) {
  try {
    const { resumeText, personalization, userId } = req.body;
    const profile = await analyseResumeWithLLM(resumeText, personalization);
    if (userId) {
      await prisma.resumeAnalysis.create({ data: { userId, inferredProfile: profile } });
    }
    res.json({ success: true, profile });
  } catch (err) { next(err); }
}
```
</details>

#### 3. Saved Jobs Controller (`src/controllers/savedJobsController.js`)
<details>
<summary>Full SavedJobsController Code</summary>

```javascript
import prisma from '../lib/prisma.js';

export async function saveJob(req, res, next) {
  try {
    const { userId, jobId, title, company, applyUrl } = req.body;
    const saved = await prisma.savedJob.upsert({
      where: { userId_jobId: { userId, jobId } },
      update: {},
      create: { userId, jobId, title, company, applyUrl }
    });
    res.json({ success: true, saved });
  } catch (err) { next(err); }
}

export async function getSavedJobs(req, res, next) {
  try {
    const jobs = await prisma.savedJob.findMany({
      where: { userId: req.params.userId },
      orderBy: { savedAt: 'desc' }
    });
    res.json({ success: true, jobs });
  } catch (err) { next(err); }
}
```
</details>

### 3.8 API Routes

The routing layer connecting HTTP endpoints to controllers.

#### 1. Routes Index (`src/app.js` snippet)
```javascript
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/saved-jobs', savedJobsRoutes);
app.use('/api/users', userRoutes);
```

#### 2. Route Definitions
<details>
<summary>All Route Files Code</summary>

```javascript
// authRoutes.js
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-otp', verifyOtp);

// resumeRoutes.js
router.post('/upload', uploadMiddleware, uploadResume);
router.post('/analyse', analyseResume);

// jobRoutes.js
router.get('/explore', exploreJobs);
router.post('/search', getJobs);
```
</details>

---

---

## 4. Summary & Usage Guide

- To run the **Client**: `npm run dev` in `Resumehub/client`.
- To run the **Server**: `npm run dev` in `Resumehub/server`.
- To update the **Database**: `npx prisma db push`.
