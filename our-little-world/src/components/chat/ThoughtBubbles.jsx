import './ThoughtBubbles.css'

export default function ThoughtBubbles({ thoughts }) {
  if (!thoughts || thoughts.length === 0) return null

  return (
    <div className="thoughts-section">
      <div className="thoughts-header">
        <span className="thoughts-icon">💭</span>
        <h3>private thoughts</h3>
      </div>
      <div className="thoughts-list">
        {thoughts.map((t, i) => (
          <div key={i} className="thought-bubble">
            <p className="thought-text">{t.text}</p>
            <span className="thought-time">
              {new Date(t.timestamp).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
                timeZone: 'America/Edmonton',
              })}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
