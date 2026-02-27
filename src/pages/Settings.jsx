import { useTheme } from '../context/ThemeContext';
import styles from './Settings.module.css';

const TEXT_SIZES = [
  { value: 'small',       label: 'Small',       desc: 'Smaller text, more fits on screen' },
  { value: 'medium',      label: 'Medium',       desc: 'Default size — works for most people' },
  { value: 'large',       label: 'Large',        desc: 'Easier to read for most people' },
  { value: 'extra-large', label: 'Extra Large',  desc: 'Best for vision challenges or large screens' },
];

export default function Settings() {
  const { darkMode, toggleDarkMode, textSize, setTextSize } = useTheme();

  return (
    <div className={`page-enter ${styles.page}`}>
      <div className={styles.header}>
        <h1 className={styles.title}>Settings</h1>
        <p className={styles.subtitle}>Adjust the app to be comfortable for you.</p>
      </div>

      <div className={styles.sections}>
        {/* Dark Mode */}
        <section className={`card ${styles.section}`} aria-labelledby="dark-mode-heading">
          <div className={styles.sectionHeader}>
            <div>
              <h2 id="dark-mode-heading" className={styles.sectionTitle}>Display Mode</h2>
              <p className={styles.sectionDesc}>Choose how the app looks. Dark mode is easier on the eyes at night.</p>
            </div>
            <button
              role="switch"
              aria-checked={darkMode}
              onClick={toggleDarkMode}
              className={`${styles.toggle} ${darkMode ? styles.toggleOn : ''}`}
              aria-label={darkMode ? 'Dark mode is on. Click to switch to light mode.' : 'Light mode is on. Click to switch to dark mode.'}
            >
              <span className={styles.toggleThumb} aria-hidden="true" />
              <span className="sr-only">{darkMode ? 'Dark mode on' : 'Light mode on'}</span>
            </button>
          </div>
          <div className={styles.modePreview}>
            <div className={`${styles.modeOption} ${!darkMode ? styles.modeActive : ''}`}>
              <span className={styles.modeIcon} aria-hidden="true">☀</span>
              <span>Light</span>
            </div>
            <div className={`${styles.modeOption} ${darkMode ? styles.modeActive : ''}`}>
              <span className={styles.modeIcon} aria-hidden="true">☾</span>
              <span>Dark</span>
            </div>
          </div>
        </section>

        {/* Text Size */}
        <section className={`card ${styles.section}`} aria-labelledby="text-size-heading">
          <h2 id="text-size-heading" className={styles.sectionTitle}>Text Size</h2>
          <p className={styles.sectionDesc}>Make text larger or smaller across the whole app.</p>

          <div className={styles.textSizePreview} aria-hidden="true">
            The quick brown fox
          </div>

          <div className={styles.sizeOptions} role="radiogroup" aria-labelledby="text-size-heading">
            {TEXT_SIZES.map(({ value, label, desc }) => (
              <button
                key={value}
                role="radio"
                aria-checked={textSize === value}
                onClick={() => setTextSize(value)}
                className={`${styles.sizeOption} ${textSize === value ? styles.sizeOptionActive : ''}`}
              >
                <div className={styles.sizeOptionTop}>
                  <span className={styles.sizeLabel}>{label}</span>
                  {textSize === value && <span className={styles.sizeCheck} aria-hidden="true">✓</span>}
                </div>
                <span className={styles.sizeDesc}>{desc}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Help */}
        <section className={`card ${styles.section}`} aria-labelledby="help-heading">
          <h2 id="help-heading" className={styles.sectionTitle}>Need Help?</h2>
          <p className={styles.sectionDesc}>
            If you're having trouble with the app, your care team is here to help.
            You can also reach our support line at any time.
          </p>
          <div className={styles.helpLinks}>
            <a href="tel:+16175550100" className="btn btn-secondary">
              <PhoneIcon /> Call support: (617) 555-0100
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}

function PhoneIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z"/></svg>;
}
