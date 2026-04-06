import { useState } from 'react'
import BookSpine from './BookSpine'
import BookCard from './BookCard'
import Loader from '../shared/Loader'
import './BookShelf.css'

export default function BookShelf({ books, loading, onSelectBook }) {
  const [view, setView] = useState('grid')

  return (
    <div className="bookshelf">
      <div className="view-toggle">
        <button
          className={`view-btn ${view === 'grid' ? 'active' : ''}`}
          onClick={() => setView('grid')}
          title="Cover view"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
        </button>
        <button
          className={`view-btn ${view === 'spine' ? 'active' : ''}`}
          onClick={() => setView('spine')}
          title="Spine view"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="4" y="2" width="3" height="20" rx="1" />
            <rect x="10" y="4" width="3" height="18" rx="1" />
            <rect x="16" y="2" width="3" height="20" rx="1" />
          </svg>
        </button>
      </div>

      {loading ? (
        <Loader message="fetching books..." />
      ) : books.length === 0 ? (
        <p className="shelf-empty">No books on this shelf yet</p>
      ) : view === 'grid' ? (
        <div className="shelf-grid">
          {books.map((book) => (
            <BookCard key={book.id} book={book} onClick={onSelectBook} />
          ))}
        </div>
      ) : (
        <>
          <div className="shelf-row">
            {books.map((book) => (
              <BookSpine key={book.id} book={book} onClick={onSelectBook} />
            ))}
          </div>
          <div className="shelf-board" />
        </>
      )}
    </div>
  )
}
