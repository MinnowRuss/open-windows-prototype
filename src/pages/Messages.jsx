import { useState, useEffect, useRef } from 'react';
import { messages as initialMessages } from '../data/mockData';
import styles from './Messages.module.css';

function formatTime(iso) {
  const d = new Date(iso);
  const today = new Date();
  const isToday = d.toDateString() === today.toDateString();
  if (isToday) return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' · ' +
    d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export default function Messages() {
  const [msgs, setMsgs] = useState(() =>
    [...initialMessages].sort((a, b) => new Date(a.sentAt) - new Date(b.sentAt))
  );
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  // Mark team messages as read when page loads
  useEffect(() => {
    setMsgs(prev => prev.map(m => (!m.isFromPatient && !m.readAt) ? { ...m, readAt: new Date().toISOString() } : m));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs]);

  const send = async () => {
    if (!draft.trim()) return;
    setSending(true);
    await new Promise(r => setTimeout(r, 600));
    const newMsg = {
      id: `msg-new-${Date.now()}`,
      senderName: 'Margaret Chen',
      senderRole: null,
      isFromPatient: true,
      text: draft.trim(),
      sentAt: new Date().toISOString(),
      readAt: null,
    };
    setMsgs(prev => [...prev, newMsg]);
    setDraft('');
    setSending(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <div className={`page-enter ${styles.page}`}>
      <div className={styles.header}>
        <h1 className={styles.title}>Messages</h1>
        <p className={styles.subtitle}>Your conversations with the care team</p>
      </div>

      <div className={styles.conversation} role="log" aria-label="Message conversation" aria-live="polite">
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
