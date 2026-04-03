import BookSpine from './BookSpine'
import './BookShelf.css'

export default function BookShelf({ books, loading, onSelectBook }) {
  return (
    <div className="bookshelf">
      {loading ? (
        <p className="shelf-loading">loading books...</p>
      ) : books.length === 0 ? (
        <p className="shelf-empty">No books on this shelf yet</p>
      ) : (
        <div className="shelf-row">
          {books.map((book) => (
            <BookSpine key={book.id} book={book} onClick={onSelectBook} />
          ))}
        </div>
      )}
      <div className="shelf-board" />
    </div>
  )
}
