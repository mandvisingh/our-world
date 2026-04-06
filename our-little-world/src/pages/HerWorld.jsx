import { useState } from 'react'
import BackButton from '../components/shared/BackButton'
import WorldNav from '../components/shared/WorldNav'
import BookShelf from '../components/books/BookShelf'
import BookDetail from '../components/books/BookDetail'
import AddBookForm from '../components/books/AddBookForm'
import EditBookForm from '../components/books/EditBookForm'
import RecommendationsPanel from '../components/books/RecommendationsPanel'
import BookSearch from '../components/books/BookSearch'
import DrinkCard from '../components/shared/DrinkCard'
import ThoughtBubbles from '../components/chat/ThoughtBubbles'
import AgentActivity from '../components/chat/AgentActivity'
import { useAgents } from '../agents/AgentContext'
import { useBooks } from '../hooks/useBooks'
import { useRecommendations } from '../hooks/useRecommendations'
import { groupByShelf } from '../utils/books'
import { SHELF_ORDER, SHELF_LABELS, STATS_CONFIG } from '../constants/shelves'
import './HerWorld.css'

const TABS = [
  { key: 'books', label: 'Books', icon: '📚' },
  { key: 'recs', label: 'Recommendations', icon: '💌' },
  { key: 'activity', label: 'Activity', icon: '⚡' },
]

export default function HerWorld() {
  const { herThoughts } = useAgents()
  const { books, loading, addBook, moveBook, deleteBook } = useBooks()
  const { recs, updateRec } = useRecommendations()
  const [selectedBook, setSelectedBook] = useState(null)
  const [activeShelf, setActiveShelf] = useState('currently-reading')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingRec, setEditingRec] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('books')

  const shelves = groupByShelf(books, SHELF_ORDER)

  const isSearching = searchQuery.trim().length > 0
  const q = searchQuery.toLowerCase()
  const currentBooks = isSearching
    ? books.filter(b => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q))
    : (shelves[activeShelf] || [])

  return (
    <div className="her-world">
      <BackButton />

      <div className="world-page">
        <div className="world-header-bar">
          <div className="avatar-thought-wrapper">
            <img src="/her.svg" alt="Her" className="world-title-avatar" />
            {herThoughts.length > 0 && (
              <div className="avatar-thought-bubble">
                {herThoughts[herThoughts.length - 1].text}
              </div>
            )}
          </div>
          <div className="world-header-info">
            <h1 className="world-title">her world</h1>
            <div className="world-header-meta">
              <span className="world-header-job">Software Developer</span>
              <span className="world-header-sub">books, matcha, and two very opinionated cats</span>
            </div>
          </div>
          <div className="world-header-drink">
            <DrinkCard />
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

          {activeTab === 'recs' && (
            <div className="section-full">
              <RecommendationsPanel
                recs={recs}
                onEditRec={(index, rec) => setEditingRec({ index, rec })}
              />
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="section-full">
              <AgentActivity agent="her" />
              <ThoughtBubbles thoughts={herThoughts} />
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
      {editingRec && (
        <EditBookForm
          title={editingRec.rec.title}
          author={editingRec.rec.author}
          formTitle="Edit recommendation"
          onSave={(updated) => updateRec(editingRec.index, updated)}
          onClose={() => setEditingRec(null)}
        />
      )}
    </div>
  )
}
