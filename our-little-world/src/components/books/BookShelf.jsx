import BookSpine from './BookSpine'
import Loader from '../shared/Loader'
import './BookShelf.css'

export default function BookShelf({ books, loading, onSelectBook }) {
  return (
    <div className="bookshelf">
      {loading ? (
        <Loader message="fetching books..." />
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
