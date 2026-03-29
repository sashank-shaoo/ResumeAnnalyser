import { useLocation } from 'react-router-dom';
import styles from '../styles/Footer.module.css';

export default function Footer() {
  const { pathname } = useLocation();

  // Hide footer on auth pages and results (which has its own layout)
  if (pathname === '/login' || pathname === '/register' || pathname === '/results') return null;

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerBrand}>
          <h3><span className={styles.emerald}>✦</span> ResumeHub</h3>
          <p>The strategic engine for your next big career milestone.</p>
        </div>
        <div className={styles.footerLinks}>
          <div className={styles.linkColumn}>
            <h4>Platform</h4>
            <a href="#">AI Analysis</a>
            <a href="#">Job Matching</a>
            <a href="#">Executive Search</a>
          </div>
          <div className={styles.linkColumn}>
            <h4>Company</h4>
            <a href="#">About Us</a>
            <a href="#">Careers</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <p>© {new Date().getFullYear()} ExecutiveLens Global (ResumeHub). All rights reserved.</p>
      </div>
    </footer>
  );
}
