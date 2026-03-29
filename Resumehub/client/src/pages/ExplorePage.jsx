import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getExploreJobs } from "../services/api";
import { useAuth } from "../hooks/useAuth";
import styles from "../styles/ExplorePage.module.css";
import { useIsMobile } from "../hooks/useIsMobile";
import MobileExplorePage from "./mobile/MobileExplorePage";

// SVGs for UI
const FilterIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
  </svg>
);
const BuildingIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
    <path d="M9 22v-4h6v4"></path>
    <path d="M8 6h.01"></path>
    <path d="M16 6h.01"></path>
    <path d="M12 6h.01"></path>
    <path d="M12 10h.01"></path>
    <path d="M12 14h.01"></path>
    <path d="M16 10h.01"></path>
    <path d="M16 14h.01"></path>
    <path d="M8 10h.01"></path>
    <path d="M8 14h.01"></path>
  </svg>
);
const GlobeIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
  </svg>
);
const LockIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
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

    if (
      catLower.includes("engineer") ||
      catLower.includes("it") ||
      catLower.includes("software")
    )
      return "linear-gradient(135deg, #10B981, #3B82F6)"; // Emerald to Blue
    if (catLower.includes("product") || catLower.includes("management"))
      return "linear-gradient(135deg, #8B5CF6, #EC4899)"; // Purple to Pink
    if (catLower.includes("sale") || catLower.includes("business"))
      return "linear-gradient(135deg, #F59E0B, #EF4444)"; // Amber to Red
    if (catLower.includes("market") || catLower.includes("creative"))
      return "linear-gradient(135deg, #3B82F6, #8B5CF6)"; // Blue to Purple
    if (
      catLower.includes("data") ||
      catLower.includes("analyst") ||
      catLower.includes("science")
    )
      return "linear-gradient(135deg, #06B6D4, #10B981)"; // Cyan to Emerald
    if (
      catLower.includes("design") ||
      catLower.includes("ui") ||
      catLower.includes("ux")
    )
      return "linear-gradient(135deg, #F43F5E, #FB923C)"; // Rose to Orange
    if (
      catLower.includes("hr") ||
      catLower.includes("people") ||
      catLower.includes("talent")
    )
      return "linear-gradient(135deg, #6366F1, #A855F7)"; // Indigo to Purple

    // Default fallback
    return "linear-gradient(135deg, #10B981, #3B82F6)";
  };

  if (authLoading || loading) {
    return (
      <div className={styles.loadingContainer}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          className={styles.loader}
        />
        <p>Analyzing Global Opportunities...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorState}>
        <h2>Exploration Halted</h2>
        <p>{error}</p>
        <button
          className={styles.btnNav}
          onClick={() => window.location.reload()}>
          Retry Search
        </button>
      </div>
    );
  }

  return (
    <div className={styles.explorePage}>
      <div className={styles.container}>
        {/* ── Fixed Left Sidebar ── */}
        <motion.aside
          className={styles.sidebar}
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
          <div className={styles.sidebarHeader}>
            <div className={styles.avatarDesktop}>
              <span>{getFirstLetter(user?.name)}</span>
            </div>
            <h2 className={styles.sidebarName}>
              {user?.name || "Executive Guest"}
            </h2>
            <div className={styles.sidebarStatus}>
              <span
                className={
                  canApply ? styles.statusVerified : styles.statusUnverified
                }>
                {canApply ? "Verified Access" : "Limited Access"}
              </span>
            </div>
          </div>

          <div className={styles.sidebarContent}>
            <div className={styles.filterSection}>
              <div className={styles.filterHeader}>
                <FilterIcon />
                <h3>Strategic Filters</h3>
              </div>

              <div className={styles.filterItem}>
                <label className={styles.filterLabel}>Seniority</label>
                <select disabled className={styles.filterSelect}>
                  <option>Executive / C-Suite</option>
                  <option>Director / VP</option>
                  <option>Senior Management</option>
                </select>
              </div>

              <div className={styles.filterItem}>
                <label className={styles.filterLabel}>Work Modality</label>
                <select disabled className={styles.filterSelect}>
                  <option>Remote Preferred</option>
                  <option>Hybrid / On-site</option>
                </select>
              </div>
            </div>

            <div className={styles.upsellBox}>
              <h4>Premium Intelligence</h4>
              <p>
                Gain priority access to unlisted C-suite roles and personalized
                matching.
              </p>
              <button className={styles.btnUpgrade}>Upgrade Access</button>
            </div>
          </div>

          <div className={styles.sidebarFooter}>
            <p>&copy; {new Date().getFullYear()} ExecutiveLens Global.</p>
          </div>
        </motion.aside>

        {/* ── Main Listings Area ── */}
        <main className={styles.mainContent}>
          <motion.header
            className={styles.header}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}>
            <span className={styles.eyebrow}>Global Exploration</span>
            <h1 className={styles.pageTitle}>Elite Opportunities</h1>
            <p className={styles.pageSubtitle}>
              Curated leadership roles matched to your professional trajectory.
              {!canApply && (
                <span className={styles.unverifiedNote}>
                  {" "}
                  Verify account to unlock full application range.
                </span>
              )}
            </p>
          </motion.header>

          <div className={styles.layout}>
            {categories.map((cat, idx) => (
              <section key={idx} className={styles.categorySection}>
                <div className={styles.categoryHeader}>
                  <div className={styles.categoryBrand}>
                    <div
                      className={styles.categoryInitial}
                      style={{ background: getCategoryGradient(cat.category) }}>
                      {cat.category.charAt(0)}
                    </div>
                    <h2 className={styles.categoryTitle}>{cat.category}</h2>
                  </div>
                  <a
                    href={cat.seeMoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.seeMoreLink}>
                    View Adzuna Index &rarr;
                  </a>
                </div>

                <div className={styles.jobsList}>
                  {cat.jobs.map((job) => (
                    <motion.div
                      key={job.id}
                      className={styles.jobCard}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}>
                      <div className={styles.jobCardMain}>
                        <div className={styles.jobInfo}>
                          <h3 className={styles.jobTitle}>{job.title}</h3>
                          <div className={styles.jobMetaRow}>
                            <span className={styles.jobCompany}>
                              <BuildingIcon /> {job.company}
                            </span>
                            <span className={styles.jobLocation}>
                              <GlobeIcon /> {job.location}
                            </span>
                            {job.salary && (
                              <span className={styles.jobSalary}>
                                {job.salary}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className={styles.jobActions}>
                          {canApply ? (
                            <a
                              href={job.applyUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.btnApply}>
                              Apply Now
                            </a>
                          ) : (
                            <button
                              disabled
                              className={styles.btnLocked}
                              title="Please verify account to apply.">
                              <LockIcon /> Locked
                            </button>
                          )}
                        </div>
                      </div>

                      <p className={styles.jobDescription}>{job.description}</p>
                    </motion.div>
                  ))}
                  {cat.jobs.length === 0 && (
                    <div className={styles.emptyState}>
                      No active listings found for this segment.
                    </div>
                  )}
                </div>
              </section>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
