import { useState, useEffect } from 'react'
import { fetchBookDetails } from '../../services/openLibrary'
import { spineColor } from '../../utils/books'
import './BookCard.css'

export default function BookCard({ book, onClick }) {
  const [coverUrl, setCoverUrl] = useState(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetchBookDetails(book.title, book.author).then((details) => {
      if (!cancelled && details?.coverUrl) {
        setCoverUrl(details.coverUrl)
      }
      if (!cancelled) setLoaded(true)
    })
    return () => { cancelled = true }
  }, [book.title, book.author])

  const bg = spineColor(book.title)

  return (
    <button className="book-card" onClick={() => onClick(book)}>
      <div className="book-card-cover">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={book.title}
            className="book-card-img"
            loading="lazy"
          />
        ) : (
          <div className="book-card-placeholder" style={{ backgroundColor: bg }}>
            {!loaded && <span className="book-card-loading">...</span>}
            {loaded && <span className="book-card-fallback-title">{book.title}</span>}
          </div>
        )}
      </div>
      <div className="book-card-info">
        <span className="book-card-title">{book.title}</span>
        <span className="book-card-author">{book.author}</span>
      </div>
    </button>
  )
}
