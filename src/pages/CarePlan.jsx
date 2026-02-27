import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import StatusBadge from '../components/StatusBadge';
import styles from './CarePlan.module.css';

function GoalCard({ goal, index }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.goalCard}>
      <button
        className={styles.goalBtn}
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <div className={styles.goalLeft}>
          <div className={styles.goalNumber} aria-hidden="true">{String(index + 1).padStart(2, '0')}</div>
          <div className={styles.goalMid}>
            <div className={styles.goalText}>{goal.goal}</div>
            <div className={styles.progressRow}>
              <div className="progress-bar" style={{ flex: 1 }}>
                <div
                  className={`progress-bar-fill ${goal.status === 'achieved' ? 'emerald' : ''}`}
                  style={{ width: `${goal.progress ?? 0}%` }}
                />
              </div>
              <span className={styles.progressPct}>{goal.progress ?? 0}%</span>
            </div>
          </div>
        </div>
        <div className={styles.goalRight}>
          <StatusBadge status={goal.status} />
          <ChevronIcon open={open} />
        </div>
      </button>
      {open && (
        <div className={styles.goalNotes}>
          <p>{goal.notes}</p>
        </div>
      )}
    </div>
  );
}

export default function CarePlan() {
  const { user } = useAuth();
  const [plan, setPlan]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [adOpen, setAdOpen]   = useState(false);

  useEffect(() => {
    if (!user?.patient?.id) { setLoading(false); return; }

    const fetchCarePlan = async () => {
      const { data, error } = await supabase
        .from('care_plans')
        .select('*')
        .eq('patient_id', user.patient.id)
        .maybeSingle();

      if (error) {
        setError('We couldn\'t load your care plan. Please refresh the page.');
        console.error('CarePlan fetch error:', error);
      } else {
        setPlan(data);
      }
      setLoading(false);
    };

    fetchCarePlan();
  }, [user?.patient?.id]);

  if (loading) {
    return (
      <div className={`page-enter ${styles.page}`}>
        <div className={styles.header}>
          <h1 className={styles.title}>Care Plan</h1>
          <p className={styles.updated}>Loading your care plan…</p>
        </div>
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className={`page-enter ${styles.page}`}>
        <div className={styles.header}>
          <h1 className={styles.title}>Care Plan</h1>
          <p className={styles.updated}>{error || 'Your care plan isn\'t available yet. Your care team will add it soon.'}</p>
        </div>
      </div>
    );
  }

  const comfortGoals = plan.comfort_goals || [];
  const medicalGoals = plan.medical_goals || [];
  const lastUpdated  = plan.updated_at;
  const lastUpdatedBy = plan.last_updated_by;

  const advanceDirective = plan.advance_directive_text ? {
    text:                 plan.advance_directive_text,
    signedDate:           plan.advance_directive_signed_at,
    healthcareProxyName:  plan.healthcare_proxy_name,
  } : null;

  return (
    <div className={`page-enter ${styles.page}`}>
      <div className={styles.header}>
        <h1 className={styles.title}>Care Plan</h1>
        {lastUpdated && (
          <p className={styles.updated}>
            Last updated {new Date(lastUpdated).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            {lastUpdatedBy && ` by ${lastUpdatedBy}`}
          </p>
        )}
      </div>

      {comfortGoals.length > 0 && (
        <section className={styles.section} aria-labelledby="comfort-heading">
          <h2 id="comfort-heading" className={styles.sectionTitle}>
            <span className={styles.sectionIcon} aria-hidden="true">♡</span>
            Comfort Goals
          </h2>
          <p className={styles.sectionDesc}>These are the personal goals that focus on your quality of life and how you feel each day.</p>
          <div className={styles.goalList}>
            {comfortGoals.map((g, i) => <GoalCard key={g.id || i} goal={g} index={i} />)}
          </div>
        </section>
      )}

      {medicalGoals.length > 0 && (
        <section className={styles.section} aria-labelledby="medical-heading">
          <h2 id="medical-heading" className={styles.sectionTitle}>
            <span className={styles.sectionIcon} aria-hidden="true">⊕</span>
            Medical Goals
          </h2>
          <p className={styles.sectionDesc}>These are the medical goals your care team is working toward to keep you stable and comfortable.</p>
          <div className={styles.goalList}>
            {medicalGoals.map((g, i) => <GoalCard key={g.id || i} goal={g} index={i} />)}
          </div>
        </section>
      )}

      {advanceDirective && (
        <section className={styles.section} aria-labelledby="ad-heading">
          <h2 id="ad-heading" className={styles.sectionTitle}>
            <span className={styles.sectionIcon} aria-hidden="true">✦</span>
            Advance Directive
          </h2>
          <div className={`card ${styles.adCard}`}>
            <div className={styles.adMeta}>
              {advanceDirective.signedDate && (
                <div className={styles.adMetaItem}>
                  <span className={styles.adLabel}>Signed</span>
                  <span className={styles.adValue}>
                    {new Date(advanceDirective.signedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              )}
              {advanceDirective.healthcareProxyName && (
                <div className={styles.adMetaItem}>
                  <span className={styles.adLabel}>Healthcare Proxy</span>
                  <span className={styles.adValue}>{advanceDirective.healthcareProxyName}</span>
                </div>
              )}
            </div>

            <button
              className={styles.adToggle}
              onClick={() => setAdOpen(o => !o)}
              aria-expanded={adOpen}
            >
              {adOpen ? 'Hide document' : 'Read my advance directive'}
              <ChevronIcon open={adOpen} />
            </button>

            {adOpen && (
              <div className={styles.adText} aria-label="Advance directive text">
                {advanceDirective.text.split('\n\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
                <p className={styles.adReadOnly}><em>This document is read-only. Contact your care team if you need to make changes.</em></p>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

function ChevronIcon({ open }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
      style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 200ms ease' }}>
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  );
}
