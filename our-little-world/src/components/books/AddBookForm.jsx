import { useState } from 'react'
import Modal from '../shared/Modal'
import { SHELVES } from '../../constants/shelves'
import './AddBookForm.css'

export default function AddBookForm({ onAdd, onClose }) {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [shelf, setShelf] = useState('to-read')

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
        <input
          className="form-input"
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
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
