import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGoogleLogin } from '@react-oauth/google';
import styles from '../styles/Auth.module.css';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [showResendBtn, setShowResendBtn] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState(null);
  
  const navigate = useNavigate();
  const { login, googleLogin, resendOtp } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setShowResendBtn(false);
    try {
      const data = await login(email, password);
      if (data.success) {
        if (!data.user.isVerified) {
          toast.error("Account not verified yet.");
          setUnverifiedEmail(email);
          setShowResendBtn(true);
        } else {
          toast.success("Welcome back!");
          navigate('/profile');
        }
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to login');
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    setError(null);
    try {
      const res = await resendOtp(unverifiedEmail);
      if (res.success) {
        toast.success("A new OTP has been sent to your email!");
        navigate('/verify-otp');
      } else {
        setError(res.error || 'Failed to resend OTP');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to resend OTP');
    } finally {
      setResendLoading(false);
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
            toast.success("Welcome back!");
            navigate('/profile');
          }
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError(err.response?.data?.error || 'Google login failed');
      }
    },
    onError: () => setError('Google Login Failed'),
  });

  return (
    <div className={styles.container}>
      <motion.div 
        className={styles.authBox}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className={styles.eyebrow}>Executive Intelligence</span>
        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.subtitle}>Consolidate your career trajectory and manage your elite profile.</p>
        
        {error && <div className={styles.errorMsg}>{error}</div>}

        <form className={styles.form} onSubmit={handleLogin}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Professional Email</label>
            <input 
              type="email" 
              id="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="e.g. name@company.com"
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
              placeholder="••••••••"
              required 
            />
          </div>
          <button type="submit" className={styles.submitBtn}>Access Dashboard</button>
          
          {showResendBtn && (
            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
              <button 
                type="button" 
                onClick={handleResendOtp} 
                disabled={resendLoading}
                className={styles.submitBtn}
                style={{ background: 'rgba(255,255,255,0.05)', color: '#fff' }}
              >
                {resendLoading ? 'Sending...' : 'Resend Verification Code'}
              </button>
              <Link to="/verify-otp" className={styles.link}>
                Already have a code? Enter it here.
              </Link>
            </div>
          )}
        </form>

        {!showResendBtn && (
          <>
            <div className={styles.divider}>Strategic Access</div>

            <button onClick={() => gLogin()} className={styles.googleBtn}>
              <svg className={styles.googleIcon} viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>
          </>
        )}

        <div className={styles.footer}>
          New to the Lens? <Link to="/register" className={styles.link}>Create Account</Link>
        </div>
      </motion.div>
    </div>
  );
}
