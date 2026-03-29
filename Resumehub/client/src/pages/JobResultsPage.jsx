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
