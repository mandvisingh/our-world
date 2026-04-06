import DrinkCard from './DrinkCard'
import './AboutSection.css'

export default function AboutSection({ avatarSrc, title, jobTitle, subtitle, drinks, drinkLabel }) {
  return (
    <div className="about-section">
      <div className="about-profile">
        <div className="about-avatar">
          <img src={avatarSrc} alt={title} />
        </div>
        <div className="about-info">
          <h2>{title}</h2>
          <span className="about-job">{jobTitle}</span>
          <p className="about-subtitle">{subtitle}</p>
        </div>
      </div>
      <div className="about-drink">
        <DrinkCard drinks={drinks} label={drinkLabel} />
      </div>
    </div>
  )
}
