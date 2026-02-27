import { NavLink } from 'react-router-dom';
import { messages } from '../data/mockData';
import styles from './Nav.module.css';

const unreadCount = messages.filter(m => !m.isFromPatient && !m.readAt).length;

const NAV_ITEMS = [
  { to: '/',           label: 'Home',       icon: HomeIcon },
  { to: '/medications',label: 'Medications',icon: PillIcon },
  { to: '/care-plan',  label: 'Care Plan',  icon: ClipboardIcon },
  { to: '/care-team',  label: 'Care Team',  icon: TeamIcon },
  { to: '/messages',   label: 'Messages',   icon: MessageIcon, badge: unreadCount },
  { to: '/education',  label: 'Education',  icon: BookIcon },
];

export default function Nav() {
  return (
    <>
      {/* Desktop side nav */}
      <nav className={styles.sideNav} aria-label="Main navigation">
        <div className={styles.sideNavLogo}>
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <rect width="32" height="32" rx="8" fill="var(--accent-primary)"/>
            <path d="M8 10 L16 6 L24 10 L24 22 L16 26 L8 22 Z" stroke="#fff" strokeWidth="1.5" fill="none"/>
            <path d="M16 6 L16 26" stroke="#fff" strokeWidth="1" opacity="0.5"/>
          </svg>
          <span className={styles.sideNavLogoText}>Open Windows</span>
        </div>
        <ul className={styles.sideNavList}>
          {NAV_ITEMS.map(({ to, label, icon: Icon, badge }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `${styles.sideNavItem} ${isActive ? styles.active : ''}`
                }
                aria-label={badge ? `${label} — ${badge} unread` : label}
              >
                <span className={styles.sideNavIcon}>
                  <Icon />
                  {badge > 0 && (
                    <span className={styles.badge} aria-hidden="true">{badge}</span>
                  )}
                </span>
                <span className={styles.sideNavLabel}>{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile bottom tab bar */}
      <nav className={styles.bottomNav} aria-label="Main navigation">
        <ul className={styles.bottomNavList}>
          {NAV_ITEMS.map(({ to, label, icon: Icon, badge }) => (
            <li key={to} className={styles.bottomNavItem}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `${styles.bottomNavLink} ${isActive ? styles.active : ''}`
                }
                aria-label={badge ? `${label} — ${badge} unread` : label}
              >
                <span className={styles.bottomNavIconWrap}>
                  <Icon />
                  {badge > 0 && (
                    <span className={styles.badge} aria-hidden="true">{badge}</span>
                  )}
                </span>
                <span className={styles.bottomNavLabel}>{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}

// ---- Icons ----
function HomeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  );
}

function PillIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10.5 20H4a2 2 0 01-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 011.66.9l.82 1.2a2 2 0 001.66.9H20a2 2 0 012 2v2"/>
      <circle cx="17" cy="17" r="5"/>
      <path d="M14 17h6"/>
    </svg>
  );
}

function ClipboardIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/>
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
      <line x1="9" y1="12" x2="15" y2="12"/>
      <line x1="9" y1="16" x2="15" y2="16"/>
    </svg>
  );
}

function TeamIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 00-3-3.87"/>
      <path d="M16 3.13a4 4 0 010 7.75"/>
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
    </svg>
  );
}

function BookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
    </svg>
  );
}
