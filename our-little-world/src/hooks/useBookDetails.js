import { useState, useCallback } from 'react'
import { fetchBookDetails } from '../services/openLibrary'

export function useBookDetails() {
  const [details, setDetails] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchDetails = useCallback(async (title, author) => {
    setLoading(true)
    setDetails(null)
    const result = await fetchBookDetails(title, author)
    setDetails(result)
    setLoading(false)
  }, [])

  const clear = useCallback(() => {
    setDetails(null)
    setLoading(false)
  }, [])

  return { details, loading, fetchDetails, clear }
}
