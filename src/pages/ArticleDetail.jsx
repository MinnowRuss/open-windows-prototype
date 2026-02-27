import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import styles from './ArticleDetail.module.css';

function normalizeArticle(a) {
  return {
    id:            a.id,
    title:         a.title,
    category:      a.category,
    summary:       a.summary,
    content:       a.content_text,
    readingTime:   a.reading_time_minutes,
    publishedDate: a.published_date,
  };
}

// Render plain-text article content stored in DB.
// Paragraphs are separated by double-newlines.
// Short paragraphs without trailing period = section headings.
// Lines starting with "-" = list items.
function renderContent(text) {
  if (!text) return null;
  return text.split('\n\n').map((para, i) => {
    const trimmed = para.trim();
    if (!trimmed) return null;

    // Detect a heading: short, no trailing period, no embedded newlines
    const isHeading = trimmed.length <= 80 && !trimmed.endsWith('.') && !trimmed.includes('\n');
    if (isHeading) {
      return <h3 key={i} className={styles.paraHeading}>{trimmed}</h3>;
    }

    // Detect a bullet list
    const lines = trimmed.split('\n');
    const isList = lines.length > 1 && lines.every(l => /^[-•]/.test(l.trim()));
    if (isList) {
      return (
        <ul key={i} className={styles.contentList}>
          {lines.map((l, j) => (
            <li key={j} className={styles.contentListItem}>{l.replace(/^[-•]\s*/, '')}</li>
          ))}
        </ul>
      );
    }

    return <p key={i} className={styles.para}>{trimmed}</p>;
  });
}

export default function ArticleDetail() {
  const { id } = useParams();
  const [article, setArticle]     = useState(null);
  const [loading, setLoading]     = useState(true);
  const [notFound, setNotFound]   = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      const { data, error } = await supabase
        .from('educational_content')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('ArticleDetail fetch error:', error);
        setNotFound(true);
      } else if (!data) {
        setNotFound(true);
      } else {
        setArticle(normalizeArticle(data));
      }
      setLoading(false);
    };

    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <div className={styles.page}>
        <Link to="/education" className={styles.backLink}>
          <ArrowLeftIcon /> Back to articles
        </Link>
        <p style={{ padding: 'var(--space-8)' }}>Loading article…</p>
      </div>
    );
  }

  if (notFound || !article) {
    return (
      <div className={styles.notFound}>
        <p>Article not found.</p>
        <Link to="/education" className="btn btn-secondary">← Back to articles</Link>
      </div>
    );
  }

  return (
    <div className={`page-enter ${styles.page}`}>
      <Link to="/education" className={styles.backLink}>
        <ArrowLeftIcon /> Back to articles
      </Link>

      <div className={styles.hero}>
        <span className={styles.category}>{article.category}</span>
        <h1 className={styles.title}>{article.title}</h1>
        <div className={styles.meta}>
          {article.publishedDate && (
            <>
              <span>{new Date(article.publishedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              <span className={styles.dot} aria-hidden="true">·</span>
            </>
          )}
          <span>{article.readingTime} min read</span>
        </div>
      </div>

      <div className={styles.content} aria-label="Article content">
        {renderContent(article.content)}
      </div>
    </div>
  );
}

function ArrowLeftIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>;
}
