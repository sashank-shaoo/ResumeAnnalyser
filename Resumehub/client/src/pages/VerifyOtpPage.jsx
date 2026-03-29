import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import styles from '../styles/Auth.module.css';

export default function VerifyOtpPage() {
  const { user, verifyOtp, resendOtp } = useContext(AuthContext);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState(null);
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // If user is already verified or not logged in at all, we shouldn't really be here,
  // but let's handle the simple case: if user is logged in AND verified, go home.
  if (user && user.isVerified) {
    navigate('/');
    return null;
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMsg(null);
    setLoading(true);

    try {
      const res = await verifyOtp(user.email, otp);
      if (res.success) {
        setMsg('Successfully verified! Redirecting...');
        setTimeout(() => navigate('/dashboard'), 1500); // Or wherever they should go
      } else {
        setError(res.error || 'Verification failed');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError(null);
    setMsg(null);
    try {
      const res = await resendOtp(user.email);
      if (res.success) {
        setMsg('A new OTP has been sent to your email.');
      } else {
        setError(res.error || 'Failed to resend OTP.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to resend OTP.');
    }
  };

  return (
    <div className={styles.container}>
      <motion.div 
        className={styles.authBox}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className={styles.eyebrow}>Security Verification</span>
        <h1 className={styles.title}>Validate Identity</h1>
        <p className={styles.subtitle}>
          Secure access required. Enter the 6-digit credential sent to <br />
          <strong style={{ color: '#fff' }}>{user.email}</strong>
        </p>

        {error && <div className={styles.errorMsg}>{error}</div>}
        {msg && <div style={{ color: 'var(--color-emerald)', fontSize: '0.85rem', marginBottom: '1.5rem', fontWeight: 600 }}>{msg}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="otp">Verification Code</label>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="000000"
              style={{ textAlign: 'center', letterSpacing: '0.5em', fontSize: '1.25rem', fontWeight: 800 }}
              required
              maxLength={6}
            />
          </div>

          <button type="submit" disabled={loading} className={styles.submitBtn}>
            {loading ? 'Authenticating...' : 'Establish Connection'}
          </button>
        </form>

        <div className={styles.footer}>
          Didn't receive the code?{' '}
          <button type="button" onClick={handleResend} className={styles.link}>
            Request New Code
          </button>
        </div>
      </motion.div>
    </div>
  );
}
