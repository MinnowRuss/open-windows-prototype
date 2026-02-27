import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import styles from './Dashboard.module.css';

function formatDate(isoStr) {
  const d = new Date(isoStr);
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}
function formatTime(isoStr) {
  const d = new Date(isoStr);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}
function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

const INITIAL = {
  appointments: [],
  nextAppointment: null,
  medicationCount: 0,
  unreadMessageCount: 0,
  carePlanStatus: 'On Track',
  carePlanGoalsAchieved: 0,
  carePlanGoalsTotal: 0,
};

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(INITIAL);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.patient?.id) { setLoading(false); return; }
    const patientId = user.patient.id;

    const fetchDashboard = async () => {
      const now = new Date().toISOString();

      const [apptRes, medRes, msgRes, cpRes] = await Promise.all([
        supabase
          .from('appointments')
          .select('*, care_team_members(name)')
          .eq('patient_id', patientId)
          .gte('scheduled_at', now)
          .order('scheduled_at')
          .limit(3),
        supabase
          .from('medications')
          .select('id')
          .eq('patient_id', patientId),
        supabase
          .from('messages')
          .select('id')
          .eq('patient_id', patientId)
          .eq('is_from_patient', false)
          .is('read_at', null),
        supabase
          .from('care_plans')
          .select('comfort_goals, medical_goals')
          .eq('patient_id', patientId)
          .maybeSingle(),
      ]);

      const appointments = (apptRes.data || []).map(a => ({
        id:                 a.id,
        type:               a.appointment_type || 'Visit',
        careTeamMemberName: a.care_team_members?.name || 'Your care team',
        scheduledAt:        a.scheduled_at,
        durationMinutes:    a.duration_minutes,
        location:           a.location,
        notes:              a.notes,
        confirmed:          !!a.confirmed_at,
      }));

      const comfortGoals = cpRes.data?.comfort_goals || [];
      const medicalGoals = cpRes.data?.medical_goals || [];
      const allGoals = [...comfortGoals, ...medicalGoals];
      const goalsAchieved = allGoals.filter(g => g.status === 'achieved').length;

      setData({
        appointments,
        nextAppointment:        appointments[0] || null,
        medicationCount:        (medRes.data || []).length,
        unreadMessageCount:     (msgRes.data || []).length,
        carePlanStatus:         'On Track',
        carePlanGoalsAchieved:  goalsAchieved,
        carePlanGoalsTotal:     allGoals.length,
      });
      setLoading(false);
    };

    fetchDashboard();
  }, [user?.patient?.id]);

  const { nextAppointment, medicationCount, unreadMessageCount,
          carePlanStatus, carePlanGoalsAchieved, carePlanGoalsTotal,
          appointments } = data;

  const firstName = user?.patient?.firstName || 'there';

  return (
    <div className={`page-enter ${styles.page}`}>
      <div className={styles.welcomeBlock}>
        <h1 className={styles.greeting}>
          {greeting()}, <span>{firstName}.</span>
        </h1>
        <p className={styles.welcomeText}>
          Here's everything happening with your care today.
        </p>
      </div>

      <div className={styles.cards}>
        {/* Next Appointment */}
        <Link to="/appointments" className={`card ${styles.card} ${styles.cardAppointment}`} aria-label="Next appointment">
          <div className={styles.cardIcon} aria-hidden="true"><CalendarIcon /></div>
          <div className={styles.cardLabel}>Next Appointment</div>
          {loading ? (
            <div className={styles.cardValue}>—</div>
          ) : nextAppointment ? (
            <>
              <div className={styles.cardValue}>{nextAppointment.type}</div>
              <div className={styles.cardSub}>
                {formatDate(nextAppointment.scheduledAt)} at {formatTime(nextAppointment.scheduledAt)}
              </div>
              <div className={styles.cardMeta}>{nextAppointment.careTeamMemberName}</div>
            </>
          ) : (
            <>
              <div className={styles.cardValue}>None scheduled</div>
              <div className={styles.cardSub}>No upcoming appointments</div>
            </>
          )}
        </Link>

        {/* Medications */}
        <Link to="/medications" className={`card ${styles.card}`} aria-label={`${medicationCount} medications`}>
          <div className={styles.cardIcon} aria-hidden="true"><PillIcon /></div>
          <div className={styles.cardLabel}>Medications</div>
          <div className={styles.cardValue}>{loading ? '—' : medicationCount}</div>
          <div className={styles.cardSub}>current medications</div>
          <div className={styles.cardCta}>View all →</div>
        </Link>

        {/* Messages */}
        <Link to="/messages" className={`card ${styles.card} ${!loading && unreadMessageCount > 0 ? styles.cardUnread : ''}`} aria-label={`${unreadMessageCount} unread messages`}>
          <div className={styles.cardIcon} aria-hidden="true"><MessageIcon /></div>
          <div className={styles.cardLabel}>Messages</div>
          <div className={styles.cardValue}>
            {loading ? '—' : unreadMessageCount > 0
              ? <>{unreadMessageCount} <span className={styles.unreadDot} aria-hidden="true" /></>
              : 0}
          </div>
          <div className={styles.cardSub}>
            {!loading && unreadMessageCount > 0 ? 'unread messages from your team' : 'no new messages'}
          </div>
          <div className={styles.cardCta}>View messages →</div>
        </Link>

        {/* Care Plan */}
        <Link to="/care-plan" className={`card ${styles.card}`} aria-label="Care plan status">
          <div className={styles.cardIcon} aria-hidden="true"><ClipboardIcon /></div>
          <div className={styles.cardLabel}>Care Plan</div>
          <div className={styles.cardValue}>{loading ? '—' : carePlanStatus}</div>
          <div className={styles.cardSub}>
            {!loading && `${carePlanGoalsAchieved} of ${carePlanGoalsTotal} goals achieved`}
          </div>
          <div className={styles.cardCta}>View plan →</div>
        </Link>
      </div>

      {/* Today's schedule */}
      <section className={styles.section} aria-labelledby="schedule-heading">
        <h2 id="schedule-heading" className={styles.sectionTitle}>Upcoming Visits</h2>
        {loading ? (
          <p className={styles.loadingText}>Loading your schedule…</p>
        ) : appointments.length === 0 ? (
          <p className={styles.emptyText}>No upcoming visits scheduled.</p>
        ) : (
          <div className={styles.appointmentList}>
            {appointments.map(appt => (
              <div key={appt.id} className={styles.appointmentRow}>
                <div className={styles.apptDate}>
                  <span className={styles.apptDay}>
                    {new Date(appt.scheduledAt).toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                  <span className={styles.apptNum}>
                    {new Date(appt.scheduledAt).getDate()}
                  </span>
                </div>
                <div className={styles.apptInfo}>
                  <div className={styles.apptType}>{appt.type}</div>
                  <div className={styles.apptMember}>{appt.careTeamMemberName}</div>
                  <div className={styles.apptTime}>{formatTime(appt.scheduledAt)}</div>
                </div>
                {appt.confirmed && (
                  <span className={styles.confirmedBadge}>Confirmed</span>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Quick links */}
      <section className={styles.section} aria-labelledby="quick-links-heading">
        <h2 id="quick-links-heading" className={styles.sectionTitle}>Quick Access</h2>
        <div className={styles.quickLinks}>
          {[
            { to: '/care-team',  label: 'Contact your care team',       sub: 'Call or email your team' },
            { to: '/education',  label: 'Browse educational articles',  sub: 'Articles written for you' },
            { to: '/settings',   label: 'Adjust settings',              sub: 'Text size, dark mode' },
          ].map(link => (
            <Link key={link.to} to={link.to} className={styles.quickLink}>
              <span className={styles.quickLinkLabel}>{link.label}</span>
              <span className={styles.quickLinkSub}>{link.sub}</span>
              <span className={styles.quickLinkArrow} aria-hidden="true">→</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function CalendarIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
}
function PillIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M10.5 20H4a2 2 0 01-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 011.66.9l.82 1.2a2 2 0 001.66.9H20a2 2 0 012 2v2"/><circle cx="17" cy="17" r="5"/><path d="M14 17h6"/></svg>;
}
function MessageIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>;
}
function ClipboardIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="15" y2="16"/></svg>;
}
