import './WorldHeader.css'

export default function WorldHeader({ avatarSrc, title, subtitle }) {
  return (
    <header className="world-header">
      <div className="world-avatar">
        <img src={avatarSrc} alt={title} />
      </div>
      <div className="world-header-text">
        <h1>{title}</h1>
        <p className="world-subtitle">{subtitle}</p>
      </div>
    </header>
  )
}
