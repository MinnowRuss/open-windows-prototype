import styles from './StatusBadge.module.css';

const CONFIG = {
  delivered:     { label: 'Delivered',     cls: 'delivered' },
  scheduled:     { label: 'Scheduled',     cls: 'scheduled' },
  not_scheduled: { label: 'Not Yet Scheduled', cls: 'pending' },
  'in-progress': { label: 'In Progress',   cls: 'scheduled' },
  achieved:      { label: 'Achieved',      cls: 'delivered' },
  pending:       { label: 'Pending',       cls: 'pending' },
};

export default function StatusBadge({ status }) {
  const cfg = CONFIG[status] || { label: status, cls: 'pending' };
  return (
    <span className={`${styles.badge} ${styles[cfg.cls]}`} aria-label={`Status: ${cfg.label}`}>
      {cfg.label}
    </span>
  );
}
