import { useState } from 'react'
import BackButton from '../components/shared/BackButton'
import WorldNav from '../components/shared/WorldNav'
import BookShelf from '../components/books/BookShelf'
import BookDetail from '../components/books/BookDetail'
import AddBookForm from '../components/books/AddBookForm'
import BookSearch from '../components/books/BookSearch'
import TodayInHistory from '../components/history/TodayInHistory'
import DrinkCard from '../components/shared/DrinkCard'
import ThoughtBubbles from '../components/chat/ThoughtBubbles'
import AgentActivity from '../components/chat/AgentActivity'
import { useAgents } from '../agents/AgentContext'
import { useBooks } from '../hooks/useBooks'
import { groupByShelf } from '../utils/books'
import { SHELF_ORDER, SHELF_LABELS, STATS_CONFIG } from '../constants/shelves'
import './HisWorld.css'

const TABS = [
  { key: 'books', label: 'Books', icon: '📚' },
  { key: 'history', label: 'History', icon: '📜' },
  { key: 'activity', label: 'Activity', icon: '⚡' },
]

const HIS_DRINKS = [
  { name: 'Venti Dark Roast', detail: '3 shots of espresso, cream and sugar', emoji: '☕' },
  { name: 'Iced Latte', detail: 'extra espresso shot', emoji: '🧊' },
]

export default function HisWorld() {
  const { hisThoughts } = useAgents()
  const { books, loading, addBook, moveBook, deleteBook } = useBooks('him')
  const [selectedBook, setSelectedBook] = useState(null)
  const [activeShelf, setActiveShelf] = useState('finished')
  const [showAddForm, setShowAddForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('books')

  const shelves = groupByShelf(books, SHELF_ORDER)

  const isSearching = searchQuery.trim().length > 0
  const q = searchQuery.toLowerCase()
  const currentBooks = isSearching
    ? books.filter(b => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q))
    : (shelves[activeShelf] || [])

  return (
    <div className="his-world">
      <BackButton />

      <div className="world-page">
        <div className="world-header-bar">
          <img src="/him.svg" alt="Him" className="world-title-avatar" />
          <div className="world-header-info">
            <h1 className="world-title">his world</h1>
            <div className="world-header-meta">
              <span className="world-header-job">Government Administrator</span>
              <span className="world-header-sub">history, dark roast, and a crocheted dill pickle</span>
            </div>
            {hisThoughts.length > 0 && (
              <p className="world-header-thought">
                💭 {hisThoughts[hisThoughts.length - 1].text}
              </p>
            )}
          </div>
          <div className="world-header-drink">
            <DrinkCard drinks={HIS_DRINKS} label="his usual" />
          </div>
        </div>

        <WorldNav tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="world-content">
          {activeTab === 'books' && (
            <>
              <div className="reading-stats">
                {STATS_CONFIG.map(({ key, emoji, label }) => (
                  <div className="stat" key={key}>
                    <span className="stat-emoji">{emoji}</span>
                    <span className="stat-num">{(shelves[key] || []).length}</span>
                    <span className="stat-label">{label}</span>
                  </div>
                ))}
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

              <BookSearch value={searchQuery} onChange={setSearchQuery} />

              <BookShelf
                books={currentBooks}
                loading={loading}
                onSelectBook={setSelectedBook}
              />
            </>
          )}

          {activeTab === 'history' && (
            <div className="section-full">
              <TodayInHistory />
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="section-full">
              <AgentActivity agent="him" />
              <ThoughtBubbles thoughts={hisThoughts} />
            </div>
          )}

        </div>
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
