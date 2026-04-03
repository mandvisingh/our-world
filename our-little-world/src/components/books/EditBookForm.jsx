import { useState } from 'react'
import Modal from '../shared/Modal'
import './AddBookForm.css'

export default function EditBookForm({ title: initTitle, author: initAuthor, formTitle = 'Edit recommendation', submitLabel = 'Save', onSave, onClose }) {
  const [title, setTitle] = useState(initTitle)
  const [author, setAuthor] = useState(initAuthor)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim() || !author.trim()) return
    onSave({ title: title.trim(), author: author.trim() })
    onClose()
  }

  return (
    <Modal onClose={onClose}>
      <h3 className="form-title">{formTitle}</h3>
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
        <button
          type="submit"
          className="form-submit"
          disabled={!title.trim() || !author.trim()}
        >
          {submitLabel}
        </button>
      </form>
    </Modal>
  )
}
