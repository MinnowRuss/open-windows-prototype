import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Nav from './Nav';
import styles from './Layout.module.css';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <div className={styles.shell}>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Nav />
      <div className={styles.body}>
        <header className={styles.header}>
          <div className={styles.headerInner}>
            {/* Mobile logo */}
            <div className={styles.mobileLogo}>
              <svg width="24" height="24" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                <rect width="32" height="32" rx="8" fill="var(--accent-primary)"/>
                <path d="M8 10 L16 6 L24 10 L24 22 L16 26 L8 22 Z" stroke="#fff" strokeWidth="1.5" fill="none"/>
                <path d="M16 6 L16 26" stroke="#fff" strokeWidth="1" opacity="0.5"/>
              </svg>
              <span className={styles.mobileLogoText}>Open Windows</span>
            </div>

            <div className={styles.headerRight}>
              {user && (
                <span className={styles.patientName}>
                  {user.patient.firstName} {user.patient.lastName}
                </span>
              )}

              <button
                onClick={toggleDarkMode}
                className={`btn btn-ghost btn-sm ${styles.iconBtn}`}
                aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                title={darkMode ? 'Light mode' : 'Dark mode'}
              >
                {darkMode ? <SunIcon /> : <MoonIcon />}
              </button>

              <button
                onClick={logout}
                className={`btn btn-ghost btn-sm`}
                aria-label="Sign out"
              >
                Sign out
              </button>
            </div>
          </div>
        </header>

        <main id="main-content" className={styles.main}>
          {children}
        </main>
      </div>
    </div>
  );
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  );
}
