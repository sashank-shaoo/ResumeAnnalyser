import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getExploreJobs } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import styles from '../../styles/mobile/MobileExplorePage.module.css';

// ── Icons ─────────────────────────────────────────────────
const BuildingIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/>
    <path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/>
    <path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/>
    <path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/>
  </svg>
);
const GlobeIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);
const LockIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const ChevronDown = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

const getCategoryGradient = (category) => {
  const cat = category.toLowerCase();
  if (cat.includes('engineer') || cat.includes('it') || cat.includes('software'))
    return 'linear-gradient(135deg, #10B981, #3B82F6)';
  if (cat.includes('product') || cat.includes('management'))
    return 'linear-gradient(135deg, #8B5CF6, #EC4899)';
  if (cat.includes('sale') || cat.includes('business'))
    return 'linear-gradient(135deg, #F59E0B, #EF4444)';
  if (cat.includes('market') || cat.includes('creative'))
    return 'linear-gradient(135deg, #3B82F6, #8B5CF6)';
  if (cat.includes('data') || cat.includes('analyst') || cat.includes('science'))
    return 'linear-gradient(135deg, #06B6D4, #10B981)';
  if (cat.includes('design') || cat.includes('ui') || cat.includes('ux'))
    return 'linear-gradient(135deg, #F43F5E, #FB923C)';
  if (cat.includes('hr') || cat.includes('people') || cat.includes('talent'))
    return 'linear-gradient(135deg, #6366F1, #A855F7)';
  return 'linear-gradient(135deg, #10B981, #3B82F6)';
};

// ── Category Accordion Component ──────────────────────────
function CategoryAccordion({ cat, canApply, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={styles.categoryAccordion}>
      <button
        className={styles.categoryToggle}
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <div
          className={styles.categoryInitial}
          style={{ background: getCategoryGradient(cat.category) }}
        >
          {cat.category.charAt(0)}
        </div>
        <div className={styles.categoryInfo}>
          <span className={styles.categoryName}>{cat.category}</span>
          <span className={styles.categoryCount}>{cat.jobs.length} listings</span>
        </div>
        {cat.seeMoreUrl && (
          <a
            href={cat.seeMoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.categoryHeaderLink}
            onClick={e => e.stopPropagation()}
          >
            View all →
          </a>
        )}
        <span className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}>
          <ChevronDown />
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className={styles.categoryBody}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div className={styles.jobsInner}>
              {cat.jobs.length === 0 ? (
                <p className={styles.emptyCategory}>No active listings in this category.</p>
              ) : (
                cat.jobs.map((job) => (
                  <motion.div
                    key={job.id}
                    className={styles.jobCard}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <h3 className={styles.jobTitle}>{job.title}</h3>
                    <div className={styles.jobMetaRow}>
                      <span className={styles.jobCompany}><BuildingIcon /> {job.company}</span>
                      <span className={styles.jobLocation}><GlobeIcon /> {job.location}</span>
                      {job.salary && (
                        <span className={styles.jobSalary}>{job.salary}</span>
                      )}
                    </div>
                    <p className={styles.jobDescription}>{job.description}</p>
                    <div className={styles.jobActions}>
                      {canApply ? (
                        <a
                          href={job.applyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.btnApply}
                        >
                          Apply Now
                        </a>
                      ) : (
                        <button disabled className={styles.btnLocked} title="Verify account to apply">
                          <LockIcon /> Locked
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────
export default function MobileExplorePage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, loading: authLoading } = useAuth();

  const canApply = user?.isVerified;

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await getExploreJobs();
        if (res.data.success) setCategories(res.data.categories);
        else setError(res.data.error || 'Failed to fetch jobs.');
      } catch { setError('Error fetching jobs.'); }
      finally { setLoading(false); }
    };
    fetchJobs();
  }, []);

  const getFirstLetter = (name) => name ? name.charAt(0).toUpperCase() : '?';

  if (authLoading || loading) {
    return (
      <div className={styles.loadingContainer}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
          className={styles.loader}
        />
        <p>Analyzing Global Opportunities...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorState}>
        <h2 className={styles.errorTitle}>Exploration Halted</h2>
        <p className={styles.errorMsg}>{error}</p>
        <button className={styles.retryBtn} onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={styles.page}>

      {/* ── Header ── */}
      <header className={styles.pageHeader}>
        <span className={styles.eyebrow}>Global Exploration</span>
        <h1 className={styles.pageTitle}>Elite Opportunities</h1>
        <p className={styles.pageSubtitle}>
          Curated leadership roles matched to your trajectory.
          {!canApply && (
            <span className={styles.unverifiedNote}>
              Verify your account to unlock applications.
            </span>
          )}
        </p>
      </header>

      {/* ── User Status Card ── */}
      {user && (
        <div className={styles.statusCard}>
          <div className={styles.avatar}>{getFirstLetter(user.name)}</div>
          <div className={styles.statusInfo}>
            <p className={styles.statusName}>{user.name || 'Executive Guest'}</p>
            <span className={`${styles.statusBadge} ${canApply ? styles.statusVerified : styles.statusUnverified}`}>
              {canApply ? 'Verified Access' : 'Limited Access'}
            </span>
          </div>
        </div>
      )}

      {/* ── Category Accordions ── */}
      <div className={styles.categoryList}>
        {categories.map((cat, idx) => (
          <CategoryAccordion
            key={idx}
            cat={cat}
            canApply={canApply}
            defaultOpen={idx === 0} // First category open by default
          />
        ))}
      </div>
    </div>
  );
}
