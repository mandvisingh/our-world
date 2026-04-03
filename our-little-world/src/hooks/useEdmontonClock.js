import { useState, useEffect } from 'react'
import { edmontonNow } from '../utils/edmonton'

export function useEdmontonClock() {
  const [time, setTime] = useState(edmontonNow)

  useEffect(() => {
    const id = setInterval(() => setTime(edmontonNow()), 1000)
    return () => clearInterval(id)
  }, [])

  return time
}
