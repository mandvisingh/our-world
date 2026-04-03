import { useEffect } from 'react'
import { useBookDetails } from '../../hooks/useBookDetails'
import { spineColor } from '../../utils/books'
import './RecommendationsPanel.css'

function RecCard({ rec, onEdit }) {
  const { details, fetchDetails } = useBookDetails()

  useEffect(() => {
    fetchDetails(rec.title, rec.author)
  }, [rec.title, rec.author, fetchDetails])

  return (
    <div className="rec-card" onClick={() => onEdit(rec)}>
      {details?.coverUrl ? (
        <img src={details.coverUrl} alt={rec.title} className="rec-cover-img" />
      ) : (
        <div className="rec-cover" style={{ backgroundColor: spineColor(rec.title) }}>
          <span className="rec-cover-text">{rec.title}</span>
        </div>
      )}
      <div className="rec-info">
        <span className="rec-title">{rec.title}</span>
        <span className="rec-author">{rec.author}</span>
      </div>
    </div>
  )
}

export default function RecommendationsPanel({ recs, onEditRec }) {
  return (
    <div className="recs-section">
      <div className="recs-header">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C9A48E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
        <h2>she recommends</h2>
      </div>
      <p className="recs-sub">her current top 3 — click to edit</p>
      <div className="recs-list">
        {recs.map((rec, i) => (
          <RecCard
            key={`${rec.title}-${i}`}
            rec={rec}
            onEdit={() => onEditRec(i, rec)}
          />
        ))}
      </div>
    </div>
  )
}
