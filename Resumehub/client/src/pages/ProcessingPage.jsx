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
