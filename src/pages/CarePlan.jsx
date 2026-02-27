import { useState } from 'react';
import { carePlan } from '../data/mockData';
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
                  style={{ width: `${goal.progress}%` }}
                />
              </div>
              <span className={styles.progressPct}>{goal.progress}%</span>
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
  const { comfortGoals, medicalGoals, advanceDirective, lastUpdated, lastUpdatedBy } = carePlan;
  const [adOpen, setAdOpen] = useState(false);

  return (
    <div className={`page-enter ${styles.page}`}>
      <div className={styles.header}>
        <h1 className={styles.title}>Care Plan</h1>
        <p className={styles.updated}>
          Last updated {new Date(lastUpdated).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} by {lastUpdatedBy}
        </p>
      </div>

      <section className={styles.section} aria-labelledby="comfort-heading">
        <h2 id="comfort-heading" className={styles.sectionTitle}>
          <span className={styles.sectionIcon} aria-hidden="true">♡</span>
          Comfort Goals
        </h2>
        <p className={styles.sectionDesc}>These are the personal goals that focus on your quality of life and how you feel each day.</p>
        <div className={styles.goalList}>
          {comfortGoals.map((g, i) => <GoalCard key={g.id} goal={g} index={i} />)}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="medical-heading">
        <h2 id="medical-heading" className={styles.sectionTitle}>
          <span className={styles.sectionIcon} aria-hidden="true">⊕</span>
          Medical Goals
        </h2>
        <p className={styles.sectionDesc}>These are the medical goals your care team is working toward to keep you stable and comfortable.</p>
        <div className={styles.goalList}>
          {medicalGoals.map((g, i) => <GoalCard key={g.id} goal={g} index={i} />)}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="ad-heading">
        <h2 id="ad-heading" className={styles.sectionTitle}>
          <span className={styles.sectionIcon} aria-hidden="true">✦</span>
          Advance Directive
        </h2>
        <div className={`card ${styles.adCard}`}>
          <div className={styles.adMeta}>
            <div className={styles.adMetaItem}>
              <span className={styles.adLabel}>Signed</span>
              <span className={styles.adValue}>
                {new Date(advanceDirective.signedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <div className={styles.adMetaItem}>
              <span className={styles.adLabel}>Healthcare Proxy</span>
              <span className={styles.adValue}>{advanceDirective.healthcareProxyName}</span>
            </div>
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
