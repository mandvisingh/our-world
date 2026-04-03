import { useState, useCallback } from 'react'
import { DEFAULT_RECOMMENDATIONS } from '../constants/defaults'

const STORAGE_KEY = 'her-recommendations'

function loadRecs() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : DEFAULT_RECOMMENDATIONS
  } catch {
    return DEFAULT_RECOMMENDATIONS
  }
}

export function useRecommendations() {
  const [recs, setRecs] = useState(loadRecs)

  const updateRec = useCallback((index, updated) => {
    setRecs((prev) => {
      const next = [...prev]
      next[index] = updated
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  return { recs, updateRec }
}
