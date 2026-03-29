import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/UploadPage.module.css';

// SVGs for high-fidelity UI
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

const ChevronRight = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

export default function UploadPage() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  const onDrop = useCallback((accepted, rejected) => {
    setError('');
    if (rejected.length > 0) {
      setError('Please upload a valid PDF or DOCX file (under 5MB).');
      return;
    }
    setFile(accepted[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 
      'application/pdf': ['.pdf'], 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] 
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
  });

  const handleAnalyse = async () => {
    if (!file) return;
    navigate('/processing', { state: { file } });
  };

  return (
    <div className={styles.page}>
      <div className={styles.wrapper}>
        
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className={styles.header}
        >
          <span className={styles.eyebrow}>AI-Driven Intelligence</span>
          <h1 className={styles.title}>Construct Strategic <br />Career Narrative</h1>
          <p className={styles.subtitle}>
            Upload your professional brief to begin a deep-context analysis against elite industry benchmarks.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className={styles.card}
        >
          <div
            {...getRootProps()}
            className={`${styles.dropzone} ${isDragActive ? styles.dragActive : ''} ${file ? styles.hasFile : ''}`}
          >
            <input {...getInputProps()} />
            
            <AnimatePresence mode="wait">
              {!file ? (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
                >
                  <UploadIcon className={styles.uploadIcon} />
                  <p className={styles.dropText}>
                    {isDragActive ? 'Release to Deposit' : 'Drag & drop professional brief'}
                  </p>
                  <p className={styles.dropOr}>or</p>
                  <button type="button" className={styles.browseBtn}>
                    Browse Local System
                  </button>
                </motion.div>
              ) : (
                <motion.div 
                  key="file"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                >
                  <div className={styles.fileIconWrapper}>
                    <FileIcon style={{ width: 32, height: 32 }} />
                  </div>
                  <p className={styles.fileName}>{file.name}</p>
                  <p className={styles.fileSize}>{(file.size / 1024).toFixed(0)} KB · Ready for Synthesis</p>
                  <button className={styles.removeBtn} onClick={(e) => { e.stopPropagation(); setFile(null); }}>
                    Discard Brief
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {error && <p className={styles.error}>⚠️ {error}</p>}

          <motion.button
            className={styles.submitBtn}
            disabled={!file}
            onClick={handleAnalyse}
            whileHover={file ? { scale: 1.01 } : {}}
            whileTap={file ? { scale: 0.99 } : {}}
          >
            Commence Analysis
            <ChevronRight />
          </motion.button>
        </motion.div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className={styles.footerNote}
        >
          Encrypted Processing · Executive Lens v5
        </motion.p>

      </div>
    </div>
  );
}
