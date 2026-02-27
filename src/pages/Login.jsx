import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import styles from './Login.module.css';

export default function Login() {
  const { login } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const canSubmit = email.trim() !== '' && password !== '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setError('');
    try {
      const result = await login(email, password);
      if (result.success) navigate('/');
    } catch {
      setError('We couldn\'t sign you in. Please check your email and password and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <button
        onClick={toggleDarkMode}
        className={`btn btn-ghost btn-sm ${styles.themeToggle}`}
        aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {darkMode ? <SunIcon /> : <MoonIcon />}
      </button>

      <div className={styles.left} aria-hidden="true">
        <div className={styles.leftInner}>
          <div className={styles.logo}>
            <svg width="48" height="48" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="rgba(255,255,255,0.15)"/>
              <path d="M8 10 L16 6 L24 10 L24 22 L16 26 L8 22 Z" stroke="#fff" strokeWidth="1.5" fill="none"/>
              <path d="M16 6 L16 26" stroke="#fff" strokeWidth="1" opacity="0.5"/>
            </svg>
            <span>Open Windows</span>
          </div>
          <blockquote className={styles.quote}>
            "The measure of life is not its duration, but its donation."
            <cite>— Peter Marshall</cite>
          </blockquote>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.formWrap}>
          <div className={styles.formHeader}>
            <div className={styles.formLogo}>
              <svg width="36" height="36" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="8" fill="var(--accent-primary)"/>
                <path d="M8 10 L16 6 L24 10 L24 22 L16 26 L8 22 Z" stroke="#fff" strokeWidth="1.5" fill="none"/>
                <path d="M16 6 L16 26" stroke="#fff" strokeWidth="1" opacity="0.5"/>
              </svg>
              <span className={styles.formLogoText}>Open Windows</span>
            </div>
            <h1 className={styles.title}>Welcome back</h1>
            <p className={styles.subtitle}>Sign in to view your care information.</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {error && (
              <div className={styles.errorBanner} role="alert">
                <AlertIcon />
                <span>{error}</span>
              </div>
            )}

            <div className={styles.fields}>
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email address</label>
                <input
                  id="email"
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(''); }}
                  autoComplete="email"
                  placeholder="you@example.com"
                  required
                  aria-required="true"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  id="password"
                  type="password"
                  className="form-input"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  required
                  aria-required="true"
                />
              </div>
            </div>

            <button
              type="submit"
              className={`btn btn-primary ${styles.submitBtn}`}
              disabled={!canSubmit || loading}
              aria-busy={loading}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>

            <div className={styles.forgotWrap}>
              <a href="#forgot" className={styles.forgotLink} onClick={e => e.preventDefault()}>
                Forgot your password?
              </a>
            </div>
          </form>

          <p className={styles.helpText}>
            Need help? Call your care team or contact us at{' '}
            <a href="tel:+16175550100">(617) 555-0100</a>.
          </p>
        </div>
      </div>
    </div>
  );
}

function AlertIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  );
}
