import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import styles from './Education.module.css';

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

export default function Education() {
  const [articles, setArticles]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [category, setCategory]   = useState('All');
  const [search, setSearch]       = useState('');
  // Favorites are session-local (no DB column for this in MVP)
  const [favorites, setFavorites] = useState(() => {
    try { return new Set(JSON.parse(sessionStorage.getItem('ow-favorites') || '[]')); }
    catch { return new Set(); }
  });

  useEffect(() => {
    const fetchArticles = async () => {
      const { data, error } = await supabase
        .from('educational_content')
        .select('id, title, category, summary, content_text, reading_time_minutes, published_date')
        .eq('is_active', true)
        .order('published_date', { ascending: false });

      if (error) {
        setError('We couldn\'t load the articles. Please refresh the page.');
        console.error('Education fetch error:', error);
      } else {
        setArticles((data || []).map(normalizeArticle));
      }
      setLoading(false);
    };

    fetchArticles();
  }, []);

  const categories = ['All', ...new Set(articles.map(a => a.category))];

  const filtered = articles.filter(a => {
    const matchesCat    = category === 'All' || a.category === category;
    const matchesSearch = !search ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      (a.summary || '').toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const toggleFav = (id, e) => {
    e.preventDefault();
    setFavorites(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      sessionStorage.setItem('ow-favorites', JSON.stringify([...next]));
      return next;
    });
  };

  if (loading) {
    return (
      <div className={`page-enter ${styles.page}`}>
        <div className={styles.header}>
          <h1 className={styles.title}>Educational Resources</h1>
          <p className={styles.subtitle}>Loading articles…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`page-enter ${styles.page}`}>
        <div className={styles.header}>
          <h1 className={styles.title}>Educational Resources</h1>
          <p className={styles.subtitle}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`page-enter ${styles.page}`}>
      <div className={styles.header}>
        <h1 className={styles.title}>Educational Resources</h1>
        <p className={styles.subtitle}>Articles written for you — in plain language, at your own pace.</p>
      </div>

      <div className={styles.controls}>
        <div className={styles.searchWrap}>
          <SearchIcon />
          <input
            type="search"
            placeholder="Search articles…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={styles.searchInput}
            aria-label="Search articles"
          />
          {search && (
            <button className={styles.clearSearch} onClick={() => setSearch('')} aria-label="Clear search">✕</button>
          )}
        </div>

        <div className={styles.tabs} role="tablist" aria-label="Filter by category">
          {categories.map(cat => (
            <button
              key={cat}
              role="tab"
              aria-selected={category === cat}
              className={`${styles.tab} ${category === cat ? styles.tabActive : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <p>No articles match your search.</p>
          <button className="btn btn-ghost" onClick={() => { setSearch(''); setCategory('All'); }}>Clear filters</button>
        </div>
      ) : (
        <div className={styles.grid} role="list">
          {filtered.map(article => (
            <Link
              key={article.id}
              to={`/education/${article.id}`}
              className={`card ${styles.articleCard}`}
              role="listitem"
              aria-label={`Read: ${article.title}`}
            >
              <div className={styles.articleTop}>
                <span className={styles.articleCat}>{article.category}</span>
                <button
                  className={`${styles.favBtn} ${favorites.has(article.id) ? styles.favActive : ''}`}
                  onClick={(e) => toggleFav(article.id, e)}
                  aria-label={favorites.has(article.id) ? `Remove ${article.title} from bookmarks` : `Bookmark ${article.title}`}
                  aria-pressed={favorites.has(article.id)}
                >
                  <BookmarkIcon filled={favorites.has(article.id)} />
                </button>
              </div>
              <h2 className={styles.articleTitle}>{article.title}</h2>
              <p className={styles.articleSummary}>{article.summary}</p>
              <div className={styles.articleMeta}>
                <span className={styles.readTime}>{article.readingTime} min read</span>
                <span className={styles.readCta}>Read →</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function SearchIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
}

function BookmarkIcon({ filled }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
    </svg>
  );
}
