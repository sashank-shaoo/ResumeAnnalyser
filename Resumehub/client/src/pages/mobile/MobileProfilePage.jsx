import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '../../hooks/useAuth';
import {
  getUserById, updateUser, getSavedJobs, deleteSavedJob,
  uploadResume, analyseResume
} from '../../services/api';
import toast from 'react-hot-toast';
import styles from '../../styles/mobile/MobileProfilePage.module.css';

// ── SVG Icons ─────────────────────────────────────────────
const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
  </svg>
);
const GithubIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
  </svg>
);
const GlobeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);
const UploadIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);
const FileIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
    <polyline points="14.5 2 14.5 7 20 7"/>
  </svg>
);

// ── Tab Icon SVGs ──────────────────────────────────────────
const NarrativeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
  </svg>
);
const TimelineIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/>
    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
    <line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/>
    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
  </svg>
);
const SavedIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const PrefsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);

const tabs = [
  { id: 'narrative', label: 'Narrative', Icon: NarrativeIcon },
  { id: 'timeline',  label: 'Timeline',  Icon: TimelineIcon  },
  { id: 'saved',     label: 'Saved',     Icon: SavedIcon     },
  { id: 'prefs',     label: 'Prefs',     Icon: PrefsIcon     },
];

export default function MobileProfilePage() {
  const { user: authUser, loading: authLoading } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savedJobs, setSavedJobs] = useState([]);
  const [activeTab, setActiveTab] = useState('narrative');
  const [saving, setSaving] = useState(false);

  // Edit states
  const [isEditingNarrative, setIsEditingNarrative] = useState(false);
  const [isEditingLinks, setIsEditingLinks] = useState(false);

  // Timeline states
  const [isUploadingTimeline, setIsUploadingTimeline] = useState(false);
  const [isProcessingTimeline, setIsProcessingTimeline] = useState(false);
  const [timelineFile, setTimelineFile] = useState(null);
  const [timelineError, setTimelineError] = useState('');

  // Form states
  const [profileForm, setProfileForm] = useState({
    name: '', preferredLocation: '', preferredIndustry: '', experienceLevel: '', bio: '', skills: ''
  });
  const [linksForm, setLinksForm] = useState({ linkedin: '', github: '', portfolio: '' });

  useEffect(() => {
    if (authLoading) return;
    if (!authUser) { setError('Not logged in.'); setLoading(false); return; }

    const fetchUser = async () => {
      try {
        const [userRes, savedRes] = await Promise.all([
          getUserById(authUser.id),
          getSavedJobs(authUser.id)
        ]);
        if (userRes.data.success) setUser(userRes.data.user);
        else setError(userRes.data.error || 'Failed to load user.');
        if (savedRes.data.success) setSavedJobs(savedRes.data.jobs);
      } catch { setError('An error occurred.'); }
      finally { setLoading(false); }
    };
    fetchUser();
  }, [authUser, authLoading]);

  useEffect(() => {
    if (!user) return;
    setProfileForm({
      name: user.name || '', preferredLocation: user.preferredLocation || '',
      preferredIndustry: user.preferredIndustry || '', experienceLevel: user.experienceLevel || '',
      bio: user.bio || '', skills: user.skills ? user.skills.join(', ') : ''
    });
    setLinksForm({ linkedin: user.linkedin || '', github: user.github || '', portfolio: user.portfolio || '' });
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const skillsArray = profileForm.skills.split(',').map(s => s.trim()).filter(Boolean);
      const res = await updateUser(user.id, { ...profileForm, skills: skillsArray });
      if (res.data.success) { setUser(res.data.user); setIsEditingNarrative(false); toast.success('Updated!'); }
      else toast.error(res.data.error || 'Update failed');
    } catch { toast.error('Update failed'); }
    finally { setSaving(false); }
  };

  const handleLinksSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const res = await updateUser(user.id, linksForm);
      if (res.data.success) { setUser(res.data.user); setIsEditingLinks(false); toast.success('Links updated!'); }
      else toast.error(res.data.error || 'Update failed');
    } catch { toast.error('Update failed'); }
    finally { setSaving(false); }
  };

  const handleRemoveSavedJob = async (jobId) => {
    try {
      const res = await deleteSavedJob(jobId);
      if (res.data.success) { setSavedJobs(prev => prev.filter(j => j.id !== jobId)); toast.success('Removed'); }
    } catch { toast.error('Failed to remove'); }
  };

  const onTimelineDrop = useCallback((accepted, rejected) => {
    setTimelineError('');
    if (rejected.length > 0) { setTimelineError('Please upload a valid PDF or DOCX file (under 5MB).'); return; }
    setTimelineFile(accepted[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onTimelineDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1, maxSize: 5 * 1024 * 1024,
  });

  const submitTimeline = async () => {
    if (!timelineFile) return;
    setIsProcessingTimeline(true); setTimelineError('');
    try {
      const uploadRes = await uploadResume(timelineFile);
      const personalization = JSON.parse(sessionStorage.getItem('personalization') || '{}');
      await analyseResume(uploadRes.data.text, personalization, user.id, timelineFile.name);
      const freshUser = await getUserById(user.id);
      if (freshUser.data.success) { setUser(freshUser.data.user); toast.success('Timeline updated!'); }
      setIsUploadingTimeline(false); setTimelineFile(null);
    } catch (e) {
      setTimelineError(e?.response?.data?.error || 'Processing failed. Try again.');
    } finally { setIsProcessingTimeline(false); }
  };

  const getFirstLetter = (name) => name ? name.charAt(0).toUpperCase() : '?';

  // ── Loading & Error ──────────────────────────────────────
  if (loading || authLoading) {
    return (
      <div className={styles.loadingPage}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
          className={styles.loader}
        />
        <p>Loading Profile...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className={styles.loadingPage}>
        <p>{error || 'Profile not found.'}</p>
        <Link to="/" style={{ color: '#10b981', marginTop: 12 }}>Go Home</Link>
      </div>
    );
  }

  // ── Render sections ──────────────────────────────────────
  const renderNarrative = () => (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.cardTitle}>Narrative</span>
        {!isEditingNarrative && (
          <button className={styles.editBtn} onClick={() => setIsEditingNarrative(true)}>Edit</button>
        )}
      </div>

      {isEditingNarrative ? (
        <form onSubmit={handleProfileSubmit} className={styles.form}>
          <div>
            <label className={styles.label}>Full Name</label>
            <input className={styles.input} value={profileForm.name}
              onChange={e => setProfileForm({ ...profileForm, name: e.target.value })} required />
          </div>
          <div>
            <label className={styles.label}>Executive Summary</label>
            <textarea className={styles.textarea} value={profileForm.bio}
              onChange={e => setProfileForm({ ...profileForm, bio: e.target.value })}
              placeholder="Your professional narrative..." />
          </div>
          <div>
            <label className={styles.label}>Location</label>
            <input className={styles.input} value={profileForm.preferredLocation}
              onChange={e => setProfileForm({ ...profileForm, preferredLocation: e.target.value })} />
          </div>
          <div>
            <label className={styles.label}>Industry</label>
            <input className={styles.input} value={profileForm.preferredIndustry}
              onChange={e => setProfileForm({ ...profileForm, preferredIndustry: e.target.value })} />
          </div>
          <div>
            <label className={styles.label}>Seniority Level</label>
            <select className={styles.select} value={profileForm.experienceLevel}
              onChange={e => setProfileForm({ ...profileForm, experienceLevel: e.target.value })}>
              <option value="Entry">Entry</option>
              <option value="Mid">Mid-Level</option>
              <option value="Senior">Senior</option>
              <option value="Executive">Executive</option>
            </select>
          </div>
          <div>
            <label className={styles.label}>Top Skills (comma separated)</label>
            <input className={styles.input} value={profileForm.skills}
              onChange={e => setProfileForm({ ...profileForm, skills: e.target.value })} />
          </div>
          <div className={styles.formActions}>
            <button type="button" className={styles.btnCancel} onClick={() => setIsEditingNarrative(false)}>Cancel</button>
            <button type="submit" className={styles.btnSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      ) : (
        <>
          <p className={styles.bioText}>{user.bio || 'Add your professional summary...'}</p>
          <div className={styles.metaGrid}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Location</span>
              <span className={styles.metaValue}>{user.preferredLocation || '—'}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Industry</span>
              <span className={styles.metaValue}>{user.preferredIndustry || '—'}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Seniority</span>
              <span className={styles.metaValue}>{user.experienceLevel || '—'}</span>
            </div>
          </div>
          {user.skills?.length > 0 && (
            <div className={styles.skillsCloud}>
              {user.skills.map((s, i) => <span key={i} className={styles.skillBadge}>{s}</span>)}
            </div>
          )}
        </>
      )}
    </div>
  );

  const renderTimeline = () => (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.cardTitle}>Timeline</span>
        {!isUploadingTimeline && !isProcessingTimeline && (
          <button className={styles.editBtn} onClick={() => setIsUploadingTimeline(true)}>Update</button>
        )}
      </div>

      {isProcessingTimeline ? (
        <div className={styles.processingState}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
            className={styles.loader}
          />
          <p className={styles.processingText}>Synthesizing Narrative...</p>
        </div>
      ) : isUploadingTimeline ? (
        <>
          <div
            {...getRootProps()}
            className={`${styles.dropzone} ${isDragActive ? styles.dragActive : ''} ${timelineFile ? styles.hasFile : ''}`}
          >
            <input {...getInputProps()} />
            <AnimatePresence mode="wait">
              {!timelineFile ? (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <UploadIcon className={styles.dropIcon} />
                  <p className={styles.dropText}>{isDragActive ? 'Drop file here' : 'Drag & drop resume'}</p>
                  <p className={styles.dropOr}>or tap to browse</p>
                </motion.div>
              ) : (
                <motion.div key="file" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <FileIcon className={styles.dropIcon} />
                  <p className={styles.fileName}>{timelineFile.name}</p>
                  <button className={styles.removeBtn} onClick={e => { e.stopPropagation(); setTimelineFile(null); }}>
                    Remove
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {timelineError && <p className={styles.errorText}>⚠️ {timelineError}</p>}
          <div className={styles.formActions}>
            <button className={styles.btnCancel} onClick={() => { setIsUploadingTimeline(false); setTimelineFile(null); }}>
              Cancel
            </button>
            <button className={styles.btnSave} onClick={submitTimeline} disabled={!timelineFile}>
              Submit
            </button>
          </div>
        </>
      ) : (
        <>
          {user.analyses?.[0]?.inferredProfile?.experience?.length > 0 ? (
            <div className={styles.timelineList}>
              {user.analyses[0].inferredProfile.experience.map((item, idx) => (
                <div key={idx} className={styles.timelineItem}>
                  <div className={styles.timelineDot}><div className={styles.timelineDotInner} /></div>
                  <div className={styles.timelineBody}>
                    <h3 className={styles.timelineRole}>{item.role}</h3>
                    <p className={styles.timelineCompany}>{item.company}</p>
                    <span className={styles.timelineDuration}>{item.duration}</span>
                    <ul className={styles.timelineHighlights}>
                      {item.highlights?.map((h, i) => <li key={i}>{h}</li>)}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.emptyText}>Upload a resume to populate your strategic timeline.</p>
          )}
        </>
      )}
    </div>
  );

  const renderSaved = () => (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.cardTitle}>Saved Jobs</span>
      </div>
      {savedJobs.length > 0 ? (
        savedJobs.map(job => (
          <div key={job.id} className={styles.savedCard}>
            <h3 className={styles.savedTitle}>{job.title}</h3>
            <div className={styles.savedMeta}>
              <span>{job.company}</span>
              <span className={styles.dot} />
              <span>{job.location}</span>
            </div>
            <div className={styles.savedActions}>
              <a href={job.applyUrl} target="_blank" rel="noopener noreferrer" className={styles.applyBtn}>Apply ↗</a>
              <button className={styles.removeSavedBtn} onClick={() => handleRemoveSavedJob(job.id)}>Remove</button>
            </div>
          </div>
        ))
      ) : (
        <p className={styles.emptyText}>Explore jobs to build your saved list.</p>
      )}
    </div>
  );

  const renderPrefs = () => (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.cardTitle}>Preferences</span>
        {!isEditingLinks && (
          <button className={styles.editBtn} onClick={() => setIsEditingLinks(true)}>Edit</button>
        )}
      </div>

      {isEditingLinks ? (
        <form onSubmit={handleLinksSubmit} className={styles.form}>
          <div>
            <label className={styles.label}>LinkedIn URL</label>
            <input type="url" className={styles.input} value={linksForm.linkedin}
              onChange={e => setLinksForm({ ...linksForm, linkedin: e.target.value })}
              placeholder="https://linkedin.com/in/..." />
          </div>
          <div>
            <label className={styles.label}>GitHub URL</label>
            <input type="url" className={styles.input} value={linksForm.github}
              onChange={e => setLinksForm({ ...linksForm, github: e.target.value })}
              placeholder="https://github.com/..." />
          </div>
          <div>
            <label className={styles.label}>Portfolio URL</label>
            <input type="url" className={styles.input} value={linksForm.portfolio}
              onChange={e => setLinksForm({ ...linksForm, portfolio: e.target.value })}
              placeholder="https://..." />
          </div>
          <div className={styles.formActions}>
            <button type="button" className={styles.btnCancel} onClick={() => setIsEditingLinks(false)}>Cancel</button>
            <button type="submit" className={styles.btnSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      ) : (
        <>
          <div className={styles.linkRow}>
            <span className={styles.linkLabel}>LinkedIn</span>
            <span className={styles.linkValue}>{user.linkedin || 'Not linked'}</span>
          </div>
          <div className={styles.linkRow}>
            <span className={styles.linkLabel}>GitHub</span>
            <span className={styles.linkValue}>{user.github || 'Not linked'}</span>
          </div>
          <div className={styles.linkRow}>
            <span className={styles.linkLabel}>Portfolio</span>
            <span className={styles.linkValue}>{user.portfolio || 'Not linked'}</span>
          </div>
        </>
      )}
    </div>
  );

  // ── Main Render ──────────────────────────────────────────
  return (
    <div className={styles.page}>
      {/* Hero Identity Strip */}
      <div className={styles.heroStrip}>
        <div className={styles.avatar}>{getFirstLetter(user.name)}</div>
        <h1 className={styles.heroName}>{user.name}</h1>
        <p className={styles.heroTitle}>
          {user.experienceLevel ? `${user.experienceLevel} Level` : 'Professional'}
          {user.preferredIndustry ? ` · ${user.preferredIndustry}` : ''}
        </p>
        <span className={styles.emailBadge}>{user.email}</span>
        {(user.linkedin || user.github || user.portfolio) && (
          <div className={styles.socials}>
            {user.linkedin && (
              <a href={user.linkedin} target="_blank" rel="noreferrer" className={styles.socialBtn}><LinkedinIcon /></a>
            )}
            {user.github && (
              <a href={user.github} target="_blank" rel="noreferrer" className={styles.socialBtn}><GithubIcon /></a>
            )}
            {user.portfolio && (
              <a href={user.portfolio} target="_blank" rel="noreferrer" className={styles.socialBtn}><GlobeIcon /></a>
            )}
          </div>
        )}
      </div>

      {/* Scrollable content */}
      <div className={styles.scrollArea}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'narrative' && renderNarrative()}
            {activeTab === 'timeline'  && renderTimeline()}
            {activeTab === 'saved'     && renderSaved()}
            {activeTab === 'prefs'     && renderPrefs()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Tab Bar */}
      <nav className={styles.tabBar}>
        {tabs.map(({ id, label, Icon }) => (
          <button
            key={id}
            className={`${styles.tabItem} ${activeTab === id ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(id)}
          >
            <span className={styles.tabIcon}><Icon /></span>
            <span className={styles.tabLabel}>{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
