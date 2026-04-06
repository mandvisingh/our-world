import { useState, useEffect } from 'react'
import { getRecentActions } from '../../agents/memory'
import './AgentActivity.css'

const TOOL_LABELS = {
  check_time: '🕐 checked the time',
  check_weather: '🌤️ checked the weather',
  search_books: '📚 browsing books',
  get_book_details: '📖 reading about a book',
  get_today_in_history: '📜 looking up history',
  search_recipes: '🍳 looking for recipes',
  search_random_recipe: '🎲 random recipe inspiration',
  send_message: '💬 sent a message',
  do_nothing: '😌 chilling',
}

export default function AgentActivity({ agent }) {
  const [actions, setActions] = useState([])

  useEffect(() => {
    // poll memory every 5 seconds for updates
    function refresh() {
      setActions(getRecentActions(agent, 5))
    }
    refresh()
    const id = setInterval(refresh, 5000)
    return () => clearInterval(id)
  }, [agent])

  if (actions.length === 0) return null

  return (
    <div className="activity-section">
      <div className="activity-header">
        <span className="activity-icon">⚡</span>
        <h3>what {agent === 'her' ? "she's" : "he's"} been up to</h3>
      </div>
      <div className="activity-list">
        {[...actions].reverse().map((a, i) => (
          <div key={i} className="activity-item">
            <span className="activity-label">
              {TOOL_LABELS[a.tool] || a.tool}
            </span>
            {a.mood && (
              <span className="activity-mood">feeling {a.mood}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
