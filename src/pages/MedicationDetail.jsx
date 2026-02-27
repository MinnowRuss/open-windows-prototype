import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import StatusBadge from '../components/StatusBadge';
import styles from './MedicationDetail.module.css';

function formatDate(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function normalizeMed(m) {
  return {
    ...m,
    genericName:      m.name,
    sideEffects:      Array.isArray(m.side_effects) ? m.side_effects : [],
    deliveryDate:     m.delivery_date,
    expectedDelivery: m.expected_delivery,
  };
}

export default function MedicationDetail() {
  const { id } = useParams();
  const [med, setMed]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchMed = async () => {
      const { data, error } = await supabase
        .from('medications')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('MedicationDetail fetch error:', error);
        setNotFound(true);
      } else if (!data) {
        setNotFound(true);
      } else {
        setMed(normalizeMed(data));
      }
      setLoading(false);
    };

    fetchMed();
  }, [id]);

  if (loading) {
    return (
      <div className={styles.page}>
        <Link to="/medications" className={styles.backLink}>
          <ArrowLeftIcon /> Back to all medications
        </Link>
        <p style={{ padding: 'var(--space-8)' }}>Loading medication details…</p>
      </div>
    );
  }

  if (notFound || !med) {
    return (
      <div className={styles.notFound}>
        <p>Medication not found.</p>
        <Link to="/medications" className="btn btn-secondary">← Back to medications</Link>
      </div>
    );
  }

  return (
    <div className={`page-enter ${styles.page}`}>
      <Link to="/medications" className={styles.backLink}>
        <ArrowLeftIcon /> Back to all medications
      </Link>

      <div className={styles.hero}>
        <div className={styles.heroMeta}>
          <StatusBadge status={med.status} />
          {med.route && <span className={styles.route}>{med.route}</span>}
        </div>
        <h1 className={styles.name}>{med.genericName || med.name}</h1>
        <div className={styles.dosageRow}>
          <span className={styles.dosage}>{med.dosage}{med.unit}</span>
          <span className={styles.sep}>·</span>
          <span className={styles.frequency}>{med.frequency}</span>
        </div>
      </div>

      <div className={styles.sections}>
        {med.purpose && (
          <section className={`card ${styles.section}`} aria-labelledby="purpose-heading">
            <h2 id="purpose-heading" className={styles.sectionTitle}>What this medication does</h2>
            <p className={styles.sectionText}>{med.purpose}</p>
          </section>
        )}

        {med.sideEffects.length > 0 && (
          <section className={`card ${styles.section}`} aria-labelledby="side-effects-heading">
            <h2 id="side-effects-heading" className={styles.sectionTitle}>Things to know</h2>
            <ul className={styles.sideEffectsList}>
              {med.sideEffects.map((se, i) => (
                <li key={i} className={styles.sideEffectItem}>
                  <span className={styles.bullet} aria-hidden="true">·</span>
                  <span>{se}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className={`card ${styles.section}`} aria-labelledby="delivery-heading">
          <h2 id="delivery-heading" className={styles.sectionTitle}>Delivery status</h2>
          <div className={styles.deliveryGrid}>
            <div className={styles.deliveryItem}>
              <span className={styles.deliveryLabel}>Status</span>
              <StatusBadge status={med.status} />
            </div>
            {med.deliveryDate && (
              <div className={styles.deliveryItem}>
                <span className={styles.deliveryLabel}>Delivered on</span>
                <span className={styles.deliveryValue}>{formatDate(med.deliveryDate)}</span>
              </div>
            )}
            {med.expectedDelivery && !med.deliveryDate && (
              <div className={styles.deliveryItem}>
                <span className={styles.deliveryLabel}>Expected</span>
                <span className={styles.deliveryValue}>{med.expectedDelivery}</span>
              </div>
            )}
            {med.prescriber && (
              <div className={styles.deliveryItem}>
                <span className={styles.deliveryLabel}>Prescribed by</span>
                <span className={styles.deliveryValue}>{med.prescriber}</span>
              </div>
            )}
          </div>
        </section>
      </div>

      <div className={styles.footer}>
        <Link to="/messages" className="btn btn-secondary">
          Message your care team with questions
        </Link>
      </div>
    </div>
  );
}

function ArrowLeftIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>;
}
