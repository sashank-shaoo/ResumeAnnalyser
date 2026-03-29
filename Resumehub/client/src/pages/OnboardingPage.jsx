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
