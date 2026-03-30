import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from '../styles/NotFoundPage.module.css';

const NotFoundPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.glow} />
      
      <motion.div 
        className={styles.content}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className={styles.errorCode}>404</div>
        <h1 className={styles.title}>Strategic Deviation Detected</h1>
        <p className={styles.description}>
          You have navigated beyond the established parameters of the ResumeHub platform. 
          The requested coordinate does not contain any valid professional assets.
        </p>
        
        <Link to="/" className={styles.homeBtn}>
          <svg 
            className={styles.svgIcon} 
            viewBox="0 0 24 24" 
            fill="none" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          Return to Base Command
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
