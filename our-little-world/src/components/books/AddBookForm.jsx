import { useState, useEffect, useRef } from 'react'
import Modal from '../shared/Modal'
import { SHELVES } from '../../constants/shelves'
import { searchBooks } from '../../services/openLibrary'
import './AddBookForm.css'

export default function AddBookForm({ onAdd, onClose }) {
  const [query, setQuery] = useState('')
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [shelf, setShelf] = useState('to-read')
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [picked, setPicked] = useState(false)
  const debounceRef = useRef(null)

  useEffect(() => {
    if (picked || query.length < 2) {
      setResults([])
      return
    }

    setSearching(true)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      const data = await searchBooks(query)
      setResults(data)
      setSearching(false)
    }, 400)

    return () => clearTimeout(debounceRef.current)
  }, [query, picked])

  const handlePick = (book) => {
    setTitle(book.title)
    setAuthor(book.author)
    setQuery(book.title)
    setResults([])
    setPicked(true)
  }

  const handleQueryChange = (val) => {
    setQuery(val)
    setPicked(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim() || !author.trim()) return
    onAdd({ title: title.trim(), author: author.trim(), shelf })
    onClose()
  }

  return (
    <Modal onClose={onClose}>
      <h3 className="form-title">Add a book</h3>
      <form onSubmit={handleSubmit}>
        {/* search input */}
        <div className="search-wrapper">
          <input
            className="form-input"
            type="text"
            placeholder="Search for a book..."
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            autoFocus
          />
          {searching && <span className="search-spinner" />}

          {results.length > 0 && (
            <div className="search-results">
              {results.map((book, i) => (
                <button
                  key={i}
                  type="button"
                  className="search-result"
                  onClick={() => handlePick(book)}
                >
                  {book.coverUrl ? (
                    <img src={book.coverUrl} alt="" className="result-cover" />
                  ) : (
                    <div className="result-cover-placeholder" />
                  )}
                  <div className="result-info">
                    <span className="result-title">{book.title}</span>
                    <span className="result-author">
                      {book.author}
                      {book.year ? ` · ${book.year}` : ''}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* filled fields (editable after pick or manual) */}
        <input
          className="form-input"
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="form-input"
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <div className="form-shelf-picker">
          {SHELVES.slice(0, 3).map((s) => (
            <button
              key={s.key}
              type="button"
              className={`shelf-pick-btn ${shelf === s.key ? 'active' : ''}`}
              onClick={() => setShelf(s.key)}
            >
              {s.label}
            </button>
          ))}
        </div>
        <button
          type="submit"
          className="form-submit"
          disabled={!title.trim() || !author.trim()}
        >
          Add to shelf
        </button>
      </form>
    </Modal>
  )
}
