import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { saveJob, deleteSavedJob } from '../../services/api.js';
import { useAuth } from '../../hooks/useAuth.js';
import styles from '../../styles/mobile/MobileJobResultsPage.module.css';

const getCategoryGradient = (category) => {
  const cat = (category || '').toLowerCase();
  if (cat.includes('engineer') || cat.includes('tech') || cat.includes('data'))
    return 'linear-gradient(135deg, #3b82f6 0%, #2dd4bf 100%)';
  if (cat.includes('product') || cat.includes('design') || cat.includes('creative'))
    return 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)';
  if (cat.includes('sale') || cat.includes('market') || cat.includes('growth'))
    return 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)';
  if (cat.includes('finance') || cat.includes('legal') || cat.includes('consult'))
    return 'linear-gradient(135deg, #64748b 0%, #334155 100%)';
  if (cat.includes('exec') || cat.includes('manage') || cat.includes('lead'))
    return 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
  return 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)';
};

const ChevronDown = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

function MobileJobCard({ job, index, userId }) {
  const [saved, setSaved] = useState(false);
  const [savedId, setSavedId] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!userId) { alert('Please log in to save jobs.'); return; }
    setSaving(true);
    try {
      if (saved && savedId) {
        await deleteSavedJob(savedId);
        setSaved(false); setSavedId(null);
      } else {
        const res = await saveJob({
          userId, jobId: String(job.id),
          title: job.title, company: job.company,
          location: job.location, salary: job.salary, applyUrl: job.applyUrl,
        });
        setSaved(true); setSavedId(res.data.savedJob.id);
      }
    } catch { /* ignore */ }
    setSaving(false);
  };

  const scoreClass = job.matchScore >= 75 ? styles.matchScoreHigh : styles.matchScoreMid;

  return (
    <motion.div
      className={styles.jobCard}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className={styles.categoryBadge} style={{ background: getCategoryGradient(job.title) }}>
        {job.title.split(' ')[0]}
      </span>

      <div className={styles.jobCardTop}>
        <div style={{ flex: 1 }}>
          <h3 className={styles.jobTitle}>{job.title}</h3>
          <div className={styles.jobMeta}>
            <span className={styles.company}>{job.company}</span>
            <span className={styles.metaDot} />
            <span className={styles.metaText}>{job.location}</span>
            {job.salary !== 'Not specified' && (
              <>
                <span className={styles.metaDot} />
                <span className={styles.salary}>{job.salary}</span>
              </>
            )}
          </div>
        </div>
        <div className={styles.matchBadge}>
          <span className={`${styles.matchScore} ${scoreClass}`}>{job.matchScore}%</span>
          <span className={styles.matchLabel}>Match</span>
        </div>
      </div>

      <p className={styles.jobDesc}>
        {job.description.split('...')[0]}...
      </p>

      <div className={styles.jobActions}>
        <a href={job.applyUrl} target="_blank" rel="noopener noreferrer" className={styles.applyBtn}>
          Apply ↗
        </a>
        <button
          className={`${styles.saveBtn} ${saved ? styles.saveBtnActive : ''}`}
          onClick={handleSave}
          disabled={saving}
        >
          {saved ? '✓ Saved' : 'Save'}
        </button>
      </div>
    </motion.div>
  );
}

export default function MobileJobResultsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [filter, setFilter] = useState('All');

  const getSessionData = (key, fallback) => {
    try { const d = sessionStorage.getItem(key); return d ? JSON.parse(d) : fallback; }
    catch { return fallback; }
  };

  const profile = getSessionData('profile', {});
  const allJobs = getSessionData('jobs', []);
  const userId = user?.id || sessionStorage.getItem('userId');

  const filters = [
    { label: 'All',      key: 'All'     },
    { label: '75%+ Match', key: 'High'  },
    { label: '45%+ Match', key: 'Mid'   },
  ];

  const filtered = allJobs.filter(j => {
    if (filter === 'High') return j.matchScore >= 75;
    if (filter === 'Mid')  return j.matchScore >= 45;
    return true;
  });

  if (!allJobs.length) {
    return (
      <div className={styles.emptyState}>
        <p className={styles.emptyText}>No results in current session.</p>
        <button className={styles.reanalyseBtn2} onClick={() => navigate('/upload')}>
          Analyse Resume
        </button>
      </div>
    );
  }

  return (
    <div className={styles.page}>

      {/* ── AI Panel (collapsible) ── */}
      <div className={styles.aiPanel}>
        <button
          className={styles.aiPanelToggle}
          onClick={() => setAiPanelOpen(o => !o)}
          aria-expanded={aiPanelOpen}
        >
          <div className={styles.aiPanelToggleLeft}>
            <span className={styles.aiPanelLabel}>AI Insights</span>
            <span className={styles.aiPanelTitle}>The Inferred Narrative</span>
          </div>
          <span className={`${styles.chevron} ${aiPanelOpen ? styles.chevronOpen : ''}`}>
            <ChevronDown />
          </span>
        </button>

        <AnimatePresence>
          {aiPanelOpen && (
            <motion.div
              className={styles.aiPanelBody}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{ overflow: 'hidden' }}
            >
              {profile.summary && <p className={styles.aiSummary}>{profile.summary}</p>}

              <div className={styles.aiMeta}>
                <div className={styles.aiMetaItem}>
                  <span className={styles.aiMetaLabel}>Seniority</span>
                  <span className={styles.aiMetaValue}>{profile.seniority || '—'}</span>
                </div>
                <div className={styles.aiMetaItem}>
                  <span className={styles.aiMetaLabel}>Domain</span>
                  <span className={styles.aiMetaValue}>{profile.inferredDomain || '—'}</span>
                </div>
                <div className={styles.aiMetaItem}>
                  <span className={styles.aiMetaLabel}>Experience</span>
                  <span className={styles.aiMetaValue}>{profile.yearsOfExperience ? `${profile.yearsOfExperience}y` : '—'}</span>
                </div>
              </div>

              {profile.inferredJobTitles?.length > 0 && (
                <div className={styles.aiSection}>
                  <p className={styles.aiSectionLabel}>Strategic Persona</p>
                  <div className={styles.tags}>
                    {profile.inferredJobTitles.map(t => (
                      <span key={t} className={styles.titleTag}>{t}</span>
                    ))}
                  </div>
                </div>
              )}

              {profile.topSkills?.length > 0 && (
                <div className={styles.aiSection}>
                  <p className={styles.aiSectionLabel}>Core Skills</p>
                  <div className={styles.tags}>
                    {profile.topSkills.map(s => (
                      <span key={s} className={styles.skillTag}>{s}</span>
                    ))}
                  </div>
                </div>
              )}

              <button className={styles.reanalyseBtn} onClick={() => navigate('/upload')}>
                Analyse Alternative Resume
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Results Header ── */}
      <div className={styles.resultsHeader}>
        <h1 className={styles.resultsTitle}>
          {filtered.length} <span className={styles.gradientText}>Strategic</span> Alignments
        </h1>
      </div>

      {/* ── Filter Pills ── */}
      <div className={styles.filterScroll}>
        <div className={styles.filterRow}>
          {filters.map(f => (
            <button
              key={f.key}
              className={`${styles.filterPill} ${filter === f.key ? styles.filterPillActive : ''}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Job Cards ── */}
      <div className={styles.jobList}>
        <AnimatePresence>
          {filtered.map((job, i) => (
            <MobileJobCard key={job.id || i} job={job} index={i} userId={userId} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
