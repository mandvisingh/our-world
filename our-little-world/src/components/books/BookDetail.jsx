import { useEffect } from 'react'
import Modal from '../shared/Modal'
import { useBookDetails } from '../../hooks/useBookDetails'
import { spineColor } from '../../utils/books'
import { SHELVES, shelfLabel } from '../../constants/shelves'
import './BookDetail.css'

export default function BookDetail({ book, onClose, onMove, onDelete }) {
  const { details, loading, fetchDetails, clear } = useBookDetails()

  useEffect(() => {
    fetchDetails(book.title, book.author)
    return clear
  }, [book.title, book.author, fetchDetails, clear])

  const coverUrl = details?.coverUrl
  const hasCover = coverUrl && !loading

  return (
    <Modal onClose={onClose}>
      <div className="book-detail-inner">
        <div className="detail-header">
          {hasCover ? (
            <img src={coverUrl} alt={book.title} className="detail-cover-img" />
          ) : (
            <div
              className="detail-cover"
              style={{ backgroundColor: spineColor(book.title) }}
            >
              {loading ? (
                <span className="detail-cover-loading">...</span>
              ) : (
                <span className="detail-cover-title">{book.title}</span>
              )}
            </div>
          )}
          <div className="detail-info">
            <h3 className="detail-title">{book.title}</h3>
            <p className="detail-author">{book.author}</p>
            {details?.firstPublished && (
              <p className="detail-meta">First published {details.firstPublished}</p>
            )}
            {details?.pages && (
              <p className="detail-meta">{details.pages} pages</p>
            )}
            {book.dateRead && (
              <p className="detail-date">Finished {book.dateRead}</p>
            )}
            <span className={`detail-shelf shelf-${book.shelf}`}>
              {shelfLabel(book.shelf)}
            </span>
          </div>
        </div>

        {details?.description && (
          <p className="detail-description">
            {details.description.length > 300
              ? details.description.slice(0, 300) + '…'
              : details.description}
          </p>
        )}

        {details?.subjects?.length > 0 && (
          <div className="detail-subjects">
            {details.subjects.map((s, i) => (
              <span key={i} className="subject-tag">{s}</span>
            ))}
          </div>
        )}

        <div className="detail-actions">
          <label className="move-label">Move to:</label>
          <div className="move-options">
            {SHELVES.filter((s) => s.key !== book.shelf).map((s) => (
              <button
                key={s.key}
                className="move-btn"
                onClick={() => { onMove(book.id, s.key); onClose() }}
              >
                {s.label}
              </button>
            ))}
          </div>
          <button
            className="delete-btn"
            onClick={() => { onDelete(book.id); onClose() }}
          >
            Remove from library
          </button>
        </div>
      </div>
    </Modal>
  )
}
