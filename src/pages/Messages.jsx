import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import styles from './Messages.module.css';

function formatTime(iso) {
  const d = new Date(iso);
  const today = new Date();
  const isToday = d.toDateString() === today.toDateString();
  if (isToday) return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' · ' +
    d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

// Map Supabase row → shape the UI expects
function normalizeMessage(m) {
  return {
    id:            m.id,
    senderName:    m.sender_name,
    senderRole:    m.sender_role,
    isFromPatient: m.is_from_patient,
    text:          m.message_text,
    sentAt:        m.sent_at,
    readAt:        m.read_at,
  };
}

export default function Messages() {
  const { user } = useAuth();
  const [msgs, setMsgs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [draft, setDraft]     = useState('');
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(null);
  const bottomRef = useRef(null);

  // ── Fetch messages ──────────────────────────────────────────
  useEffect(() => {
    if (!user?.patient?.id) { setLoading(false); return; }

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('patient_id', user.patient.id)
        .order('sent_at');

      if (error) {
        setError('We couldn\'t load your messages. Please refresh the page.');
        console.error('Messages fetch error:', error);
      } else {
        // Mark incoming messages as visually read (optimistic — no UPDATE RLS needed)
        setMsgs((data || []).map(m =>
          normalizeMessage(!m.is_from_patient && !m.read_at
            ? { ...m, read_at: new Date().toISOString() }
            : m
          )
        ));
      }
      setLoading(false);
    };

    fetchMessages();
  }, [user?.patient?.id]);

  // ── Auto-scroll to bottom ───────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs]);

  // ── Send message ────────────────────────────────────────────
  const send = async () => {
    if (!draft.trim() || !user?.patient?.id) return;
    setSending(true);
    setSendError(null);

    const senderName = user.patient.firstName && user.patient.lastName
      ? `${user.patient.firstName} ${user.patient.lastName}`
      : 'Patient';

    const newRow = {
      patient_id:     user.patient.id,
      sender_name:    senderName,
      sender_role:    null,
      recipient_type: 'team',
      message_text:   draft.trim(),
      is_from_patient: true,
    };

    const { data, error } = await supabase
      .from('messages')
      .insert(newRow)
      .select()
      .single();

    if (error) {
      setSendError('Your message couldn\'t be sent. Please try again.');
      console.error('Message send error:', error);
    } else {
      setMsgs(prev => [...prev, normalizeMessage(data)]);
      setDraft('');
    }

    setSending(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  if (loading) {
    return (
      <div className={`page-enter ${styles.page}`}>
        <div className={styles.header}>
          <h1 className={styles.title}>Messages</h1>
          <p className={styles.subtitle}>Loading your messages…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`page-enter ${styles.page}`}>
        <div className={styles.header}>
          <h1 className={styles.title}>Messages</h1>
          <p className={styles.subtitle}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`page-enter ${styles.page}`}>
      <div className={styles.header}>
        <h1 className={styles.title}>Messages</h1>
        <p className={styles.subtitle}>Your conversations with the care team</p>
      </div>

      <div className={styles.conversation} role="log" aria-label="Message conversation" aria-live="polite">
        {msgs.length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--color-slate-500)', padding: 'var(--space-8)' }}>
            No messages yet. Send a message to your care team below.
          </p>
        )}
        {msgs.map((msg, i) => {
          const showDate = i === 0 ||
            new Date(msg.sentAt).toDateString() !== new Date(msgs[i - 1].sentAt).toDateString();
          return (
            <div key={msg.id}>
              {showDate && (
                <div className={styles.dateDivider} aria-label={`Messages from ${new Date(msg.sentAt).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}`}>
                  <span>{new Date(msg.sentAt).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                </div>
              )}
              <div className={`${styles.bubble} ${msg.isFromPatient ? styles.outgoing : styles.incoming}`}>
                {!msg.isFromPatient && (
                  <div className={styles.senderInfo}>
                    <span className={styles.senderName}>{msg.senderName}</span>
                    {msg.senderRole && <span className={styles.senderRole}>{msg.senderRole}</span>}
                  </div>
                )}
                <div className={styles.bubbleBody}>
                  <p className={styles.bubbleText}>{msg.text}</p>
                  <span className={styles.timestamp}>{formatTime(msg.sentAt)}</span>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className={styles.composeArea}>
        <div className={styles.composeCard}>
          {sendError && (
            <p style={{ color: 'var(--color-rose-600)', fontSize: 'var(--text-sm)', margin: '0 0 var(--space-2)' }}>
              {sendError}
            </p>
          )}
          <label htmlFor="message-input" className="sr-only">Write a message to your care team</label>
          <textarea
            id="message-input"
            className={styles.textarea}
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write a message to your care team…"
            rows={3}
            aria-label="Message to care team"
          />
          <div className={styles.composeFooter}>
            <span className={styles.composeHint}>Press Enter to send · Shift+Enter for new line</span>
            <button
              className={`btn btn-primary btn-sm ${styles.sendBtn}`}
              onClick={send}
              disabled={!draft.trim() || sending}
              aria-label="Send message"
              aria-busy={sending}
            >
              {sending ? 'Sending…' : <><SendIcon /> Send</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SendIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>;
}
