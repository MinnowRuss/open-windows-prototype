import { useParams, Link } from 'react-router-dom';
import { articles } from '../data/mockData';
import styles from './ArticleDetail.module.css';

export default function ArticleDetail() {
  const { id } = useParams();
  const article = articles.find(a => a.id === id);

  if (!article) {
    return (
      <div className={styles.notFound}>
        <p>Article not found.</p>
        <Link to="/education" className="btn btn-secondary">← Back to articles</Link>
      </div>
    );
  }

  const related = articles.filter(a => article.relatedArticleIds?.includes(a.id));

  const renderContent = (text) => {
    return text.split('\n\n').map((para, i) => {
      if (para.startsWith('**') && para.endsWith('**')) {
        return <h3 key={i} className={styles.paraHeading}>{para.slice(2, -2)}</h3>;
      }
      // Handle bold within paragraphs
      const parts = para.split(/(\*\*[^*]+\*\*)/g);
      return (
        <p key={i} className={styles.para}>
          {parts.map((part, j) =>
            part.startsWith('**') && part.endsWith('**')
              ? <strong key={j}>{part.slice(2, -2)}</strong>
              : part.startsWith('*') && part.endsWith('*')
              ? <em key={j}>{part.slice(1, -1)}</em>
              : part
          )}
        </p>
      );
    });
  };

  return (
    <div className={`page-enter ${styles.page}`}>
      <Link to="/education" className={styles.backLink}>
        <ArrowLeftIcon /> Back to articles
      </Link>

      <div className={styles.hero}>
        <span className={styles.category}>{article.category}</span>
        <h1 className={styles.title}>{article.title}</h1>
        <div className={styles.meta}>
          <span>{new Date(article.publishedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          <span className={styles.dot} aria-hidden="true">·</span>
          <span>{article.readingTime} min read</span>
        </div>
      </div>

      <div className={styles.content} aria-label="Article content">
        {renderContent(article.content)}
      </div>

      {related.length > 0 && (
        <section className={styles.related} aria-labelledby="related-heading">
          <h2 id="related-heading" className={styles.relatedTitle}>Related articles</h2>
          <div className={styles.relatedList}>
            {related.map(rel => (
              <Link key={rel.id} to={`/education/${rel.id}`} className={`card ${styles.relatedCard}`}>
                <span className={styles.relatedCat}>{rel.category}</span>
                <span className={styles.relatedArticleTitle}>{rel.title}</span>
                <span className={styles.relatedTime}>{rel.readingTime} min →</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function ArrowLeftIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>;
}
