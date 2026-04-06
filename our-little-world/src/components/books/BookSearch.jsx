import { useState } from 'react'
import './BookSearch.css'

export default function BookSearch({ value, onChange }) {
  const [focused, setFocused] = useState(false)

  return (
    <div className={`book-search ${focused ? 'focused' : ''}`}>
      <svg className="book-search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        type="text"
        className="book-search-input"
        placeholder="Search by title or author..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {value && (
        <button className="book-search-clear" onClick={() => onChange('')}>
          ×
        </button>
      )}
    </div>
  )
}
