import { useState, useEffect, useCallback } from 'react'
import { fetchEdmontonWeather } from '../services/weather'

const REFRESH_INTERVAL = 5 * 60 * 1000

export function useWeather() {
  const [weather, setWeather] = useState(null)

  const refresh = useCallback(async () => {
    try {
      const data = await fetchEdmontonWeather()
      setWeather(data)
    } catch {
      /* retry next interval */
    }
  }, [])

  useEffect(() => {
    refresh()
    const id = setInterval(refresh, REFRESH_INTERVAL)
    return () => clearInterval(id)
  }, [refresh])

  return weather
}
