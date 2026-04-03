import { useNavigate } from 'react-router-dom'
import { useEdmontonClock } from '../hooks/useEdmontonClock'
import { useWeather } from '../hooks/useWeather'
import { formatTime, formatDate, isDayTime } from '../utils/edmonton'
import './Landing.css'

const backyardDay = '/backyard-day.svg'
const backyardNight = '/backyard-night.svg'

export default function Landing() {
  const navigate = useNavigate()
  const time = useEdmontonClock()
  const weather = useWeather()
  const isDay = isDayTime(time)

  return (
    <div className={`scene ${isDay ? 'day' : 'night'}`}>
      <img src={backyardDay} alt="" className={`scene-bg ${isDay ? 'visible' : ''}`} />
      <img src={backyardNight} alt="" className={`scene-bg ${!isDay ? 'visible' : ''}`} />

      <h1 className="title">our little corner of the world</h1>
      <div className="badge">{isDay ? '☀️ day' : '🌙 night'}</div>

      <div className="avatars">
        <button className="avatar-btn" onClick={() => navigate('/her')}>
          <img src="/her.svg" alt="Her" className="avatar-img" />
          <span className="avatar-label">her world</span>
        </button>
        <button className="avatar-btn" onClick={() => navigate('/his')}>
          <img src="/him.svg" alt="Him" className="avatar-img" />
          <span className="avatar-label">his world</span>
        </button>
      </div>

      <div className="bottom-fade" />

      <div className="info-left">
        <span className="clock">{formatTime(time)}</span>
        <span className="date">{formatDate(time)}</span>
      </div>

      <div className="info-right">
        {weather ? (
          <>
            <span className="temp">{weather.temp}°C</span>
            <span className="condition">{weather.condition}</span>
          </>
        ) : (
          <span className="condition">loading…</span>
        )}
      </div>
    </div>
  )
}
