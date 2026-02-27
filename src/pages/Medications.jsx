import { useState } from 'react';
import { Link } from 'react-router-dom';
import { medications } from '../data/mockData';
import StatusBadge from '../components/StatusBadge';
import styles from './Medications.module.css';

const TIME_ORDER = { morning: 0, afternoon: 1, evening: 2, 'as-needed': 3 };
const sorted = [...medications].sort((a, b) => (TIME_ORDER[a.timeOfDay] ?? 9) - (TIME_ORDER[b.timeOfDay] ?? 9));

export default function Medications() {
  const [expanded, setExpanded] = useState(null);

  const toggle = (id) => setExpanded(prev => prev === id ? null : id);

  return (
    <div className={`page-enter ${styles.page}`}>
      <div className={styles.header}>
        <h1 className={styles.title}>Your Medications</h1>
        <p className={styles.subtitle}>
          {medications.length} current medications, sorted by time of day.
        </p>
      </div>

      <div className={styles.list} role="list">
        {sorted.map(med => (
          <article key={med.id} className={`card ${styles.medCard}`} role="listitem">
            <div className={styles.medTop}>
              <div className={styles.medInfo}>
                <div className={styles.medMeta}>
                  <span className={styles.timeTag}>{med.timeOfDay === 'as-needed' ? 'As needed' : med.timeOfDay.charAt(0).toUpperCase() + med.timeOfDay.slice(1)}</span>
                  <StatusBadge status={med.status} />
                </div>
                <h2 className={styles.medName}>{med.name}</h2>
                <div className={styles.medDose}>
                  <span className={styles.dosageNum}>{med.dosage}{med.unit}</span>
                  <span className={styles.separator}>·</span>
                  <span>{med.frequency}</span>
                </div>
              </div>
              <div className={styles.medActions}>
                <Link to={`/medications/${med.id}`} className="btn btn-secondary btn-sm">
                  Details
                </Link>
                <button
                  className={`btn btn-ghost btn-sm ${styles.expandBtn}`}
                  onClick={() => toggle(med.id)}
                  aria-expanded={expanded === med.id}
                  aria-controls={`med-detail-${med.id}`}
                >
                  {expanded === med.id ? <ChevronUpIcon /> : <ChevronDownIcon />}
                  <span className="sr-only">{expanded === med.id ? 'Collapse' : 'Expand'} {med.name}</span>
                </button>
              </div>
            </div>

            {expanded === med.id && (
              <div id={`med-detail-${med.id}`} className={styles.medExpanded}>
                <div className={styles.divider} />
                <div className={styles.expandedGrid}>
                  <div className={styles.expandedItem}>
                    <span className={styles.expandedLabel}>Route</span>
                    <span className={styles.expandedValue}>{med.route}</span>
                  </div>
                  <div className={styles.expandedItem}>
                    <span className={styles.expandedLabel}>Prescribed by</span>
                    <span className={styles.expandedValue}>{med.prescriber}</span>
                  </div>
                </div>
                <div className={styles.purposeBlock}>
                  <span className={styles.expandedLabel}>What it does</span>
                  <p className={styles.purposeText}>{med.purpose}</p>
                </div>
                {med.sideEffects?.length > 0 && (
                  <div className={styles.sideEffectsBlock}>
                    <span className={styles.expandedLabel}>Things to know</span>
                    <ul className={styles.sideEffectsList}>
                      {med.sideEffects.map((se, i) => (
                        <li key={i} className={styles.sideEffectItem}>
                          <span className={styles.bullet} aria-hidden="true">·</span>
                          {se}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}

function ChevronDownIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>;
}
function ChevronUpIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="18 15 12 9 6 15"/></svg>;
}
