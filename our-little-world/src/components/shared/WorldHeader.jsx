import './WorldHeader.css'

export default function WorldHeader({ avatarSrc, title, subtitle, jobTitle }) {
  return (
    <header className="world-header">
      <div className="world-avatar">
        <img src={avatarSrc} alt={title} />
      </div>
      <div className="world-header-text">
        <h1>{title}</h1>
        {jobTitle && <span className="world-job">{jobTitle}</span>}
        <p className="world-subtitle">{subtitle}</p>
      </div>
    </header>
  )
}
