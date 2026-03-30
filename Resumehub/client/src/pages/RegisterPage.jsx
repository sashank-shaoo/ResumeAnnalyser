import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGoogleLogin } from '@react-oauth/google';
import styles from '../styles/Auth.module.css';
import { useAuth } from '../hooks/useAuth';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { register, googleLogin } = useAuth();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const data = await register(name, email, password);
      if (data.success) {
        navigate('/verify-otp');
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to register');
    }
  };

  const gLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const data = await googleLogin(tokenResponse.access_token);
        if (data.success) {
          if (data.isNewUser) {
            navigate('/onboarding');
          } else {
            navigate('/profile');
          }
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError(err.response?.data?.error || 'Google login failed');
      }
    },
    onError: () => setError('Google Registration Failed'),
  });

  return (
    <div className={styles.container}>
      <motion.div 
        className={styles.authBox}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className={styles.eyebrow}>Professional Enrollment</span>
        <h1 className={styles.title}>Join the Lens</h1>
        <p className={styles.subtitle}>Begin your journey toward an automated, elite professional presence.</p>
        
        {error && <div className={styles.errorMsg}>{error}</div>}

        <form className={styles.form} onSubmit={handleRegister}>
          <div className={styles.inputGroup}>
            <label htmlFor="name">Preferred Identity</label>
            <input 
              type="text" 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="e.g. Alex Rivera"
              required 
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Professional Email</label>
            <input 
              type="email" 
              id="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="name@company.com"
              required 
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Security Key</label>
            <input 
              type="password" 
              id="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Minimum 6 characters"
              required 
              minLength="6"
            />
          </div>
          <button type="submit" className={styles.submitBtn}>Initialize Account</button>
        </form>

        <div className={styles.divider}>Strategic Onboarding</div>

        <button onClick={() => gLogin()} className={styles.googleBtn}>
          <svg className={styles.googleIcon} viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Enroll with Google
        </button>

        <div className={styles.footer}>
          Already recognized? <Link to="/login" className={styles.link}>Access Dashboard</Link>
        </div>
      </motion.div>
    </div>
  );
}
