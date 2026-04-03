import { spineColor, spineWidth } from '../../utils/books'
import './BookSpine.css'

export default function BookSpine({ book, onClick }) {
  const bg = spineColor(book.title)
  const w = spineWidth(book.title)
  return (
    <button
      className="book-spine"
      style={{ backgroundColor: bg, width: `${w}px` }}
      onClick={() => onClick(book)}
      title={`${book.title} — ${book.author}`}
    >
      <span className="spine-text">{book.title}</span>
    </button>
  )
}
