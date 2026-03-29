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
