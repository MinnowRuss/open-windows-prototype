import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import styles from './CareTeam.module.css';

// Derive a human-readable label from the stored role value
const ROLE_LABELS = {
  nurse:         'Registered Nurse',
  doctor:        'Hospice Physician',
  social_worker: 'Social Worker',
  chaplain:      'Chaplain',
  family:        'Family Contact',
  other:         'Care Team Member',
};

const ROLE_COLORS = {
  nurse:         { bg: '#dbeafe', text: '#1d4ed8', dark_bg: 'rgba(37,99,235,0.15)',   dark_text: '#93c5fd' },
  doctor:        { bg: '#fce7f3', text: '#9d174d', dark_bg: 'rgba(219,39,119,0.15)',  dark_text: '#f9a8d4' },
  social_worker: { bg: '#d1fae5', text: '#065f46', dark_bg: 'rgba(16,185,129,0.15)',  dark_text: '#6ee7b7' },
  chaplain:      { bg: '#fef3c7', text: '#92400e', dark_bg: 'rgba(217,119,6,0.15)',   dark_text: '#fcd34d' },
  family:        { bg: '#ede9fe', text: '#4c1d95', dark_bg: 'rgba(139,92,246,0.15)',  dark_text: '#c4b5fd' },
  other:         { bg: '#fff7ed', text: '#9a3412', dark_bg: 'rgba(234,88,12,0.15)',   dark_text: '#fdba74' },
};

const ROLE_ORDER = ['doctor', 'nurse', 'other', 'social_worker', 'chaplain', 'family'];

const INITIALS = (name) => name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

function MemberCard({ member }) {
  const colors = ROLE_COLORS[member.role] || ROLE_COLORS.other;
  const roleLabel = ROLE_LABELS[member.role] || 'Team Member';
  return (
    <article className={`card ${styles.memberCard}`}>
      <div
        className={styles.avatar}
        style={{ '--avatar-bg': colors.bg, '--avatar-text': colors.text, '--avatar-bg-dark': colors.dark_bg, '--avatar-text-dark': colors.dark_text }}
        aria-hidden="true"
      >
        {INITIALS(member.name)}
      </div>
      <div className={styles.memberInfo}>
        <div className={styles.memberHeader}>
          <h2 className={styles.memberName}>{member.name}</h2>
          <span
            className={styles.roleBadge}
            style={{ '--rb-bg': colors.bg, '--rb-text': colors.text, '--rb-bg-dark': colors.dark_bg, '--rb-text-dark': colors.dark_text }}
          >
            {roleLabel}
          </span>
        </div>
        {/* bio / visit_schedule not in DB schema — show if available */}
        {member.bio && <p className={styles.memberBio}>{member.bio}</p>}
        {member.visit_schedule && (
          <p className={styles.memberSchedule}>
            <CalendarIcon /> {member.visit_schedule}
          </p>
        )}
        <div className={styles.contactRow}>
          {member.phone && (
            <a
              href={`tel:${member.phone.replace(/\D/g, '')}`}
              className={`btn btn-secondary btn-sm ${styles.contactBtn}`}
              aria-label={`Call ${member.name} at ${member.phone}`}
            >
              <PhoneIcon /> {member.phone}
            </a>
          )}
          {member.email && (
            <a
              href={`mailto:${member.email}`}
              className={`btn btn-ghost btn-sm ${styles.contactBtn}`}
              aria-label={`Email ${member.name}`}
            >
              <MailIcon /> Email
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default function CareTeam() {
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [sortBy, setSortBy]   = useState('role');

  useEffect(() => {
    if (!user?.patient?.id) { setLoading(false); return; }

    const fetchTeam = async () => {
      const { data, error } = await supabase
        .from('care_team_members')
        .select('*')
        .eq('patient_id', user.patient.id);

      if (error) {
        setError('We couldn\'t load your care team. Please refresh the page.');
        console.error('CareTeam fetch error:', error);
      } else {
        setMembers(data || []);
      }
      setLoading(false);
    };

    fetchTeam();
  }, [user?.patient?.id]);

  const sorted = [...members].sort((a, b) =>
    sortBy === 'role'
      ? (ROLE_ORDER.indexOf(a.role) - ROLE_ORDER.indexOf(b.role))
      : a.name.localeCompare(b.name)
  );

  if (loading) {
    return (
      <div className={`page-enter ${styles.page}`}>
        <div className={styles.header}>
          <h1 className={styles.title}>Your Care Team</h1>
          <p className={styles.subtitle}>Loading your care team…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`page-enter ${styles.page}`}>
        <div className={styles.header}>
          <h1 className={styles.title}>Your Care Team</h1>
          <p className={styles.subtitle}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`page-enter ${styles.page}`}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Your Care Team</h1>
          <p className={styles.subtitle}>
            {members.length === 0
              ? 'No team members on file yet.'
              : `${members.length} ${members.length === 1 ? 'person' : 'people'} dedicated to your care`}
          </p>
        </div>
        {members.length > 1 && (
          <div className={styles.sortRow} role="group" aria-label="Sort care team by">
            <button className={`btn btn-sm ${sortBy === 'role' ? 'btn-secondary' : 'btn-ghost'}`} onClick={() => setSortBy('role')}>By role</button>
            <button className={`btn btn-sm ${sortBy === 'name' ? 'btn-secondary' : 'btn-ghost'}`} onClick={() => setSortBy('name')}>By name</button>
          </div>
        )}
      </div>

      <div className={styles.list}>
        {sorted.map(m => <MemberCard key={m.id} member={m} />)}
      </div>
    </div>
  );
}

function PhoneIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z"/></svg>; }
function MailIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>; }
function CalendarIcon() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>; }
