import { useState, useEffect } from 'react'
import { fetchTodayInHistory } from '../services/wikipedia'

export function useTodayInHistory() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTodayInHistory().then((result) => {
      setEvents(result)
      setLoading(false)
    })
  }, [])

  return { events, loading }
}
