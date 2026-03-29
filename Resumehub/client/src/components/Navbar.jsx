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
