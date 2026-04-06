import { useTodayInHistory } from '../../hooks/useTodayInHistory'
import './TodayInHistory.css'

export default function TodayInHistory() {
  const { events, loading } = useTodayInHistory()

  const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Edmonton' }))
  const monthName = now.toLocaleString('en-US', { month: 'long', timeZone: 'America/Edmonton' })
  const day = now.getDate()

  return (
    <div className="history-section">
      <div className="history-header">
        <span className="history-icon">📜</span>
        <h2>today in history</h2>
      </div>
      <p className="history-date">{monthName} {day}</p>

      {loading ? (
        <p className="history-loading">digging through the archives...</p>
      ) : events.length === 0 ? (
        <p className="history-loading">no events found for today</p>
      ) : (
        <div className="history-events">
          {events.map((event, i) => (
            <div key={i} className="history-event">
              <span className="history-year">{event.year}</span>
              <p className="history-text">
                {event.text}
                {event.pageUrl && (
                  <a
                    href={event.pageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="history-link"
                  >
                    read more
                  </a>
                )}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
