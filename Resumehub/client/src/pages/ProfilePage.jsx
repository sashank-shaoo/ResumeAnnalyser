import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '../hooks/useAuth';
import { getUserById, updateUser, getSavedJobs, deleteSavedJob, uploadResume, analyseResume } from '../services/api';
import toast from 'react-hot-toast';
import styles from '../styles/ProfilePage.module.css';
import { useIsMobile } from '../hooks/useIsMobile';
import MobileProfilePage from './mobile/MobileProfilePage';

// SVG Icons
const LinkIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
);
const LinkedinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
);
const GithubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
);
const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
);
const GlobeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
);
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

const ProfileSection = ({ title, children, editable, onEdit }) => (
  <div className={styles.section}>
    <div className={styles.sectionHeader}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      {editable && (
        <button 
          className={styles.editButton}
          onClick={onEdit}
          aria-label={`Edit ${title}`}
        >
          <EditIcon />
        </button>
      )}
    </div>
    {children}
  </div>
);

export default function ProfilePage() {
  const { user: authUser, loading: authLoading } = useAuth();
  const isMobile = useIsMobile();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savedJobs, setSavedJobs] = useState([]);
  const [loadingSaved, setLoadingSaved] = useState(true);

  // Editing states
  const [isEditingLinks, setIsEditingLinks] = useState(false);
  const [isEditingNarrative, setIsEditingNarrative] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('narrative');

  // Timeline specific states
  const [isUploadingTimeline, setIsUploadingTimeline] = useState(false);
  const [isProcessingTimeline, setIsProcessingTimeline] = useState(false);
  const [timelineFile, setTimelineFile] = useState(null);
  const [timelineError, setTimelineError] = useState('');

  // Form states
  const [profileForm, setProfileForm] = useState({ 
    name: '', 
    preferredLocation: '', 
    preferredIndustry: '', 
    experienceLevel: '', 
    bio: '', 
    skills: '' 
  });
  
  const [linksForm, setLinksForm] = useState({ 
    linkedin: '', 
    github: '', 
    portfolio: '' 
  });

  useEffect(() => {
    if (authLoading) return;
    if (!authUser) {
      setError('Not logged in.');
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const [userRes, savedRes] = await Promise.all([
          getUserById(authUser.id),
          getSavedJobs(authUser.id)
        ]);

        if (userRes.data.success) {
          setUser(userRes.data.user);
        } else {
          setError(userRes.data.error || 'Failed to load user.');
        }

        if (savedRes.data.success) {
          setSavedJobs(savedRes.data.jobs);
        }
      } catch (err) {
        setError('An error occurred while fetching user data.');
      } finally {
        setLoading(false);
        setLoadingSaved(false);
      }
    };
    fetchUser();
  }, [authUser, authLoading]);

  // Sync forms with user data
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        preferredLocation: user.preferredLocation || '',
        preferredIndustry: user.preferredIndustry || '',
        experienceLevel: user.experienceLevel || '',
        bio: user.bio || '',
        skills: user.skills ? user.skills.join(', ') : ''
      });
      setLinksForm({
        linkedin: user.linkedin || '',
        github: user.github || '',
        portfolio: user.portfolio || ''
      });
    }
  }, [user]);

  const handleProfileSubmit = async (e, section) => {
    e.preventDefault();
    setSaving(true);
    try {
      const skillsArray = profileForm.skills.split(',').map(s => s.trim()).filter(Boolean);
      const data = { ...profileForm, skills: skillsArray };
      const res = await updateUser(user.id, data);
      if (res.data.success) {
        setUser(res.data.user);
        setIsEditingNarrative(false);
        toast.success('Updated successfully!');
      } else {
        toast.error(res.data.error || 'Failed to update');
      }
    } catch (err) {
      toast.error('An error occurred during update');
    } finally {
      setSaving(false);
    }
  };

  const handleLinksSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await updateUser(user.id, linksForm);
      if (res.data.success) {
        setUser(res.data.user);
        setIsEditingLinks(false);
        toast.success('Links updated!');
      } else {
        toast.error(res.data.error || 'Failed to update links');
      }
    } catch (err) {
      toast.error('An error occurred during update');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveSavedJob = async (jobId) => {
    try {
      const res = await deleteSavedJob(jobId);
      if (res.data.success) {
        setSavedJobs(prev => prev.filter(job => job.id !== jobId));
        toast.success('Job removed from saved list');
      } else {
        toast.error(res.data.error || 'Failed to remove job from saved list');
      }
    } catch (err) {
      toast.error('An error occurred while removing the job');
    }
  };

  const onTimelineDrop = useCallback((accepted, rejected) => {
    setTimelineError('');
    if (rejected.length > 0) {
      setTimelineError('Please upload a valid PDF or DOCX file (under 5MB).');
      return;
    }
    setTimelineFile(accepted[0]);
  }, []);

  const { getRootProps: getDropProps, getInputProps: getDropInputProps, isDragActive: isTimelineDragActive } = useDropzone({
    onDrop: onTimelineDrop,
    accept: { 
      'application/pdf': ['.pdf'], 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] 
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
  });

  const submitTimelineUpdate = async () => {
    if (!timelineFile) return;
    setIsProcessingTimeline(true);
    setTimelineError('');
    try {
      // 1. Upload & parse
      const uploadRes = await uploadResume(timelineFile);
      const resumeText = uploadRes.data.text;

      // 2. Analyse with LLM to update profile
      const personalization = JSON.parse(sessionStorage.getItem('personalization') || '{}');
      await analyseResume(resumeText, personalization, user.id, timelineFile.name);

      // 3. Fetch fresh user data
      const freshUser = await getUserById(user.id);
      if (freshUser.data.success) {
        setUser(freshUser.data.user);
        toast.success('Strategic Timeline updated seamlessly!');
      }
      setIsUploadingTimeline(false);
      setTimelineFile(null);
    } catch (e) {
      setTimelineError(e?.response?.data?.error || 'Timeline processing failed. Please try again.');
    } finally {
      setIsProcessingTimeline(false);
    }
  };

  // ── Mobile swap ──────────────────────────────────────────
  if (isMobile) return <MobileProfilePage />;

  if (loading) {
    return (
      <div className={styles.profilePage}>
        <div className={styles.container}>
          <div className={styles.loadingState}>
            <div className={styles.loaderArea}>
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className={styles.loader}
              />
            </div>
            <p className={styles.loadingText}>Gathering Executive Insights...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className={styles.profilePage}>
        <div className={styles.container}>
          <div className={styles.errorState}>
            <h2>Access Error</h2>
            <p>{error || 'Executive profile not found.'}</p>
            <Link to="/" className={styles.editBtn}>Return to Command Center</Link>
          </div>
        </div>
      </div>
    );
  }


  const getFirstLetter = (name) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className={styles.profilePage}>
      <div className={styles.container}>
        
        {/* ── Fixed Left Sidebar ── */}
        <motion.aside 
          className={styles.sidebar}
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className={styles.sidebarHeader}>
            <div className={styles.avatarDesktop}>
              <span>{getFirstLetter(user.name)}</span>
            </div>
            <h1 className={styles.name}>{user.name}</h1>
            <p className={styles.title}>
              {user.experienceLevel ? `${user.experienceLevel} Level` : 'Professional'}
              {user.preferredIndustry ? ` · ${user.preferredIndustry}` : ''}
            </p>
            <div className={styles.contactInfo}>
              <span className={styles.emailBadge}>{user.email}</span>
            </div>
            {(user.linkedin || user.github || user.portfolio) && (
              <div className={styles.sidebarSocials}>
                {user.linkedin && (
                  <a href={user.linkedin} target="_blank" rel="noreferrer" className={styles.socialIconBtn} title="LinkedIn">
                    <LinkedinIcon />
                  </a>
                )}
                {user.github && (
                  <a href={user.github} target="_blank" rel="noreferrer" className={styles.socialIconBtn} title="GitHub">
                    <GithubIcon />
                  </a>
                )}
                {user.portfolio && (
                  <a href={user.portfolio} target="_blank" rel="noreferrer" className={styles.socialIconBtn} title="Portfolio">
                    <GlobeIcon />
                  </a>
                )}
              </div>
            )}
          </div>

          <nav className={styles.navMenu}>
            <button 
              className={`${styles.navItem} ${activeSection === 'narrative' ? styles.activeNavItem : ''}`}
              onClick={() => setActiveSection('narrative')}
            >
              Professional Narrative
            </button>
            <button 
              className={`${styles.navItem} ${activeSection === 'timeline' ? styles.activeNavItem : ''}`}
              onClick={() => setActiveSection('timeline')}
            >
              Strategic Timeline
            </button>
            <button 
              className={`${styles.navItem} ${activeSection === 'saved' ? styles.activeNavItem : ''}`}
              onClick={() => setActiveSection('saved')}
            >
              Saved Opportunity
            </button>
            <button 
              className={`${styles.navItem} ${activeSection === 'preferences' ? styles.activeNavItem : ''}`}
              onClick={() => setActiveSection('preferences')}
            >
              Global Preference
            </button>
          </nav>
 
        </motion.aside>

        {/* ── Main Content Area ── */}
        <main className={styles.mainContent}>
          <AnimatePresence mode="wait">
            {activeSection === 'narrative' && (
              <motion.div 
                key="narrative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={styles.contentCard}
              >
                <div className={styles.sectionHeaderWrap}>
                  <h2 className={styles.sectionTitle}>Professional Narrative</h2>
                  {!isEditingNarrative && (
                    <button className={styles.editBtn} onClick={() => setIsEditingNarrative(true)}>
                      Edit Narrative
                    </button>
                  )}
                </div>

                {isEditingNarrative ? (
                  <form onSubmit={(e) => handleProfileSubmit(e, 'narrative')} className={styles.mainEditForm}>
                    <div className={styles.editFormGrid}>
                      <div className={styles.inputGroupTop}>
                        <label className={styles.label}>Full Name</label>
                        <input 
                          className={styles.input} 
                          value={profileForm.name} 
                          onChange={e => setProfileForm({...profileForm, name: e.target.value})} 
                          required 
                        />
                      </div>
                      
                      <div className={styles.inputGroupTop}>
                        <label className={styles.label}>Executive Summary</label>
                        <textarea 
                          className={styles.textarea} 
                          value={profileForm.bio} 
                          onChange={e => setProfileForm({...profileForm, bio: e.target.value})} 
                          placeholder="Professional narrative..."
                        />
                      </div>

                      <div className={styles.careerGridEdit}>
                        <div className={styles.inputGroup}>
                          <label className={styles.label}>Location</label>
                          <input className={styles.input} value={profileForm.preferredLocation} onChange={e => setProfileForm({...profileForm, preferredLocation: e.target.value})} />
                        </div>
                        <div className={styles.inputGroup}>
                          <label className={styles.label}>Industry</label>
                          <input className={styles.input} value={profileForm.preferredIndustry} onChange={e => setProfileForm({...profileForm, preferredIndustry: e.target.value})} />
                        </div>
                        <div className={styles.inputGroup}>
                          <label className={styles.label}>Seniority Level</label>
                          <select className={styles.input} value={profileForm.experienceLevel} onChange={e => setProfileForm({...profileForm, experienceLevel: e.target.value})}>
                            <option value="Entry">Entry</option>
                            <option value="Mid">Mid-Level</option>
                            <option value="Senior">Senior</option>
                            <option value="Executive">Executive</option>
                          </select>
                        </div>
                      </div>

                      <div className={styles.inputGroupTop}>
                        <label className={styles.label}>Top Skills (comma separated)</label>
                        <input 
                          className={styles.input} 
                          value={profileForm.skills} 
                          onChange={e => setProfileForm({...profileForm, skills: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className={styles.formActionsFull}>
                      <button type="button" onClick={() => setIsEditingNarrative(false)} className={styles.btnCancel}>Cancel</button>
                      <button type="submit" disabled={saving} className={styles.btnSave}>{saving ? 'Saving...' : 'Save Narrative'}</button>
                    </div>
                  </form>
                ) : (
                  <div className={styles.openNarrativeView}>
                    <div className={styles.identityPart}>
                      <h3 className={styles.displayValue}>{user.name}</h3>
                    </div>

                    <div className={styles.bioPart}>
                      <p className={styles.bioText}>{user.bio || 'Provide your executive narrative...'}</p>
                    </div>

                    <div className={styles.metadataGridOpen}>
                      <div className={styles.metaItem}>
                        <span className={styles.metaLabel}>Base Operation</span>
                        <span className={styles.metaValue}>{user.preferredLocation || 'Undisclosed'}</span>
                      </div>
                      <div className={styles.metaItem}>
                        <span className={styles.metaLabel}>Sector</span>
                        <span className={styles.metaValue}>{user.preferredIndustry || 'Cross-industry'}</span>
                      </div>
                      <div className={styles.metaItem}>
                        <span className={styles.metaLabel}>Seniority</span>
                        <span className={styles.metaValue}>{user.experienceLevel || 'Expert'}</span>
                      </div>
                    </div>

                    <div className={styles.skillsPart}>
                      <h4 className={styles.partLabel}>Core Competencies</h4>
                      <div className={styles.skillsCloudMain}>
                        {user.skills && user.skills.length > 0 ? (
                          user.skills.map((skill, i) => (
                            <span key={i} className={styles.skillBadgeLarge}>{skill}</span>
                          ))
                        ) : (
                          <p className={styles.emptyText}>Add your primary skills...</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeSection === 'preferences' && (
              <motion.div 
                key="preferences"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={styles.contentCard}
              >
                <div className={styles.sectionHeaderWrap}>
                  <h2 className={styles.sectionTitle}>Global Preference</h2>
                  {!isEditingLinks && (
                    <button className={styles.editBtn} onClick={() => setIsEditingLinks(true)}>
                      Edit Global Preference
                    </button>
                  )}
                </div>

                {isEditingLinks ? (
                  <form onSubmit={handleLinksSubmit} className={styles.editFormMain}>
                    <div className={styles.formGrid}>
                      <div className={styles.inputGroup}>
                        <label className={styles.label}>LinkedIn URL</label>
                        <input type="url" className={styles.input} value={linksForm.linkedin} onChange={e => setLinksForm({...linksForm, linkedin: e.target.value})} placeholder="https://linkedin.com/in/..." />
                      </div>
                      <div className={styles.inputGroup}>
                        <label className={styles.label}>GitHub URL</label>
                        <input type="url" className={styles.input} value={linksForm.github} onChange={e => setLinksForm({...linksForm, github: e.target.value})} placeholder="https://github.com/..." />
                      </div>
                      <div className={styles.inputGroup}>
                        <label className={styles.label}>Portfolio URL</label>
                        <input type="url" className={styles.input} value={linksForm.portfolio} onChange={e => setLinksForm({...linksForm, portfolio: e.target.value})} placeholder="https://..." />
                      </div>
                    </div>
                    <div className={styles.formActionsMain}>
                      <button type="button" onClick={() => setIsEditingLinks(false)} className={styles.btnCancel}>Cancel</button>
                      <button type="submit" disabled={saving} className={styles.btnSavePrimary}>Save Links</button>
                    </div>
                  </form>
                ) : (
                  <div className={styles.linksViewLarge}>
                    <h3 className={styles.blockTitle}>Professional URLs</h3>
                    <div className={styles.urlList}>
                      <div className={styles.urlItem}>
                        <span className={styles.urlLabel}>LinkedIn</span>
                        <span className={styles.urlValue}>{user.linkedin || 'Not linked'}</span>
                      </div>
                      <div className={styles.urlItem}>
                        <span className={styles.urlLabel}>GitHub</span>
                        <span className={styles.urlValue}>{user.github || 'Not linked'}</span>
                      </div>
                      <div className={styles.urlItem}>
                        <span className={styles.urlLabel}>Portfolio</span>
                        <span className={styles.urlValue}>{user.portfolio || 'Not linked'}</span>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeSection === 'timeline' && (
              <motion.div 
                key="timeline"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={styles.contentCard}
              >
                <div className={styles.sectionHeaderWrap}>
                  <h2 className={styles.sectionTitle}>Strategic Timeline</h2>
                  {(!isUploadingTimeline && !isProcessingTimeline) && (
                    <button onClick={() => setIsUploadingTimeline(true)} className={styles.editBtn}>Update Experience</button>
                  )}
                </div>
                
                {isProcessingTimeline ? (
                  <div className={styles.inlineOrbitalContainer}>
                    <div className={styles.inlineOrbitalTitle}>Synthesizing Narrative...</div>
                    <div className={styles.loaderArea}>
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                        className={styles.loader} 
                      />
                    </div>
                  </div>
                ) : isUploadingTimeline ? (
                  <div className={styles.inlineDropzoneWrap}>
                    <div
                      {...getDropProps()}
                      className={`${styles.dropzone} ${isTimelineDragActive ? styles.dragActive : ''} ${timelineFile ? styles.hasFile : ''}`}
                    >
                      <input {...getDropInputProps()} />
                      <AnimatePresence mode="wait">
                        {!timelineFile ? (
                          <motion.div 
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className={styles.dropInner}
                          >
                            <UploadIcon className={styles.uploadIcon} />
                            <p className={styles.dropText}>
                              {isTimelineDragActive ? 'Release to Deposit' : 'Drag & drop professional brief'}
                            </p>
                            <p className={styles.dropOr}>or browse files</p>
                          </motion.div>
                        ) : (
                          <motion.div 
                            key="file"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className={styles.fileInner}
                          >
                            <FileIcon className={styles.fileIcon} style={{ width: 32, height: 32 }} />
                            <p className={styles.fileName}>{timelineFile.name}</p>
                            <button className={styles.removeBtn} onClick={(e) => { e.stopPropagation(); setTimelineFile(null); }}>
                              Discard
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {timelineError && <p className={styles.errorText}>⚠️ {timelineError}</p>}

                    <div className={styles.formActionsFull}>
                      <button type="button" onClick={() => { setIsUploadingTimeline(false); setTimelineFile(null); }} className={styles.btnCancel}>Cancel</button>
                      <button type="button" onClick={submitTimelineUpdate} disabled={!timelineFile} className={styles.btnSavePrimary}>Submit Timeline</button>
                    </div>
                  </div>
                ) : (
                  <div className={styles.timelineContainer}>
                    <div className={styles.timelineThread} />
                  {user.analyses?.[0]?.inferredProfile?.experience?.length > 0 ? (
                    user.analyses[0].inferredProfile.experience.map((item, idx) => (
                      <div key={idx} className={styles.timelineItem}>
                        <div className={styles.timelineNode}>
                          <div className={styles.nodeInner} />
                        </div>
                        <div className={styles.timelineContent}>
                          <div className={styles.timelineHeader}>
                            <h3 className={styles.experienceRole}>{item.role}</h3>
                            <span className={styles.experienceDuration}>{item.duration}</span>
                          </div>
                          <p className={styles.experienceCompany}>{item.company}</p>
                          <ul className={styles.experienceHighlights}>
                            {item.highlights?.map((h, i) => <li key={i}>{h}</li>)}
                          </ul>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className={styles.emptyText}>No experience data found. Upload a resume to populate your strategic timeline.</p>
                  )}
                  </div>
                )}
              </motion.div>
            )}

            {activeSection === 'saved' && (
              <motion.div 
                key="saved"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={styles.contentCard}
              >
                <h2 className={styles.sectionTitle}>Saved Opportunities</h2>
                <div className={styles.savedList}>
                  {savedJobs.length > 0 ? (
                    savedJobs.map(job => (
                      <div key={job.id} className={styles.savedCard}>
                        <div className={styles.savedCardContent}>
                          <h3 className={styles.savedJobTitle}>{job.title}</h3>
                          <div className={styles.savedJobMeta}>
                            <span>{job.company}</span>
                            <span className={styles.dot} />
                            <span>{job.location}</span>
                          </div>
                        </div>
                        <div className={styles.savedCardActions}>
                          <a href={job.applyUrl} target="_blank" rel="noopener noreferrer" className={styles.applyBtn}>Apply ↗</a>
                          <button onClick={() => handleRemoveSavedJob(job.id)} className={styles.removeBtn}>Remove</button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className={styles.emptyText}>Search for jobs in "Explore" to build your target list.</p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
