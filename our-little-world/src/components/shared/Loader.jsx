import './Loader.css'

export default function Loader({ message = 'loading...' }) {
  return (
    <div className="loader">
      <div className="loader-book">
        <div className="loader-page loader-page-1" />
        <div className="loader-page loader-page-2" />
        <div className="loader-page loader-page-3" />
        <div className="loader-spine" />
      </div>
      <span className="loader-text">{message}</span>
    </div>
  )
}
