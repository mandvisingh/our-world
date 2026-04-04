import { useState } from 'react'
import BackButton from '../components/shared/BackButton'
import WorldHeader from '../components/shared/WorldHeader'
import BookShelf from '../components/books/BookShelf'
import BookDetail from '../components/books/BookDetail'
import AddBookForm from '../components/books/AddBookForm'
import DrinkCard from '../components/shared/DrinkCard'
import { useBooks } from '../hooks/useBooks'
import { groupByShelf } from '../utils/books'
import { SHELF_ORDER, SHELF_LABELS } from '../constants/shelves'
import './HisWorld.css'

const HIS_DRINKS = [
  { name: 'Venti Dark Roast', detail: 'extra shot, cream and sugar', emoji: '☕' },
]

export default function HisWorld() {
  const { books, loading, addBook, moveBook, deleteBook } = useBooks('him')
  const [selectedBook, setSelectedBook] = useState(null)
  const [activeShelf, setActiveShelf] = useState('read')
  const [showAddForm, setShowAddForm] = useState(false)

  const shelves = groupByShelf(books, SHELF_ORDER)
  const currentBooks = shelves[activeShelf] || []
  const readCount = (shelves['read'] || []).length
  const readingCount = (shelves['currently-reading'] || []).length
  const toReadCount = (shelves['to-read'] || []).length

  return (
    <div className="his-world">
      <BackButton />

      <div className="his-layout">
        <aside className="his-sidebar-left">
          <DrinkCard drinks={HIS_DRINKS} />
        </aside>

        <div className="his-main">
          <WorldHeader
            avatarSrc="/him.svg"
            title="his world"
            subtitle="history, dark roast, and a crocheted dill pickle"
          />

          <div className="reading-stats">
            <div className="stat">
              <span className="stat-num">{readCount}</span>
              <span className="stat-label">read</span>
            </div>
            <div className="stat">
              <span className="stat-num">{readingCount}</span>
              <span className="stat-label">reading</span>
            </div>
            <div className="stat">
              <span className="stat-num">{toReadCount}</span>
              <span className="stat-label">want to read</span>
            </div>
          </div>

          <div className="shelf-bar">
            <div className="shelf-tabs">
              {SHELF_ORDER.map((key) => (
                <button
                  key={key}
                  className={`shelf-tab ${activeShelf === key ? 'active' : ''}`}
                  onClick={() => setActiveShelf(key)}
                >
                  {SHELF_LABELS[key]}
                </button>
              ))}
            </div>
            <button
              className="add-book-btn"
              onClick={() => setShowAddForm(true)}
              title="Add a book"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
              <span>Add book</span>
            </button>
          </div>

          <BookShelf
            books={currentBooks}
            loading={loading}
            onSelectBook={setSelectedBook}
          />
        </div>

        <aside className="his-sidebar-right" />
      </div>

      {selectedBook && (
        <BookDetail
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          onMove={moveBook}
          onDelete={deleteBook}
        />
      )}
      {showAddForm && (
        <AddBookForm
          onAdd={addBook}
          onClose={() => setShowAddForm(false)}
        />
      )}
    </div>
  )
}
