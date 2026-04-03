import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { books as localBooks } from '../data/books'

export function useBooks() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const isLocal = !supabase

  const fetchBooks = useCallback(async () => {
    setLoading(true)
    if (isLocal) {
      setBooks(localBooks.map((b, i) => ({ ...b, id: `local-${i}` })))
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('user_id', 'her')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Failed to fetch books:', error.message)
      setBooks(localBooks.map((b, i) => ({ ...b, id: `local-${i}` })))
    } else {
      setBooks(
        data.map((b) => ({
          id: b.id,
          title: b.title,
          author: b.author,
          shelf: b.shelf,
          dateRead: b.date_read,
        }))
      )
    }
    setLoading(false)
  }, [isLocal])

  useEffect(() => {
    fetchBooks()
  }, [fetchBooks])

  const addBook = useCallback(
    async ({ title, author, shelf }) => {
      if (isLocal) {
        setBooks((prev) => [
          { id: `local-${Date.now()}`, title, author, shelf, dateRead: null },
          ...prev,
        ])
        return
      }

      const { data, error } = await supabase
        .from('books')
        .insert({ title, author, shelf, user_id: 'her' })
        .select()
        .single()

      if (error) {
        console.error('Failed to add book:', error.message)
        return
      }

      setBooks((prev) => [
        {
          id: data.id,
          title: data.title,
          author: data.author,
          shelf: data.shelf,
          dateRead: data.date_read,
        },
        ...prev,
      ])
    },
    [isLocal]
  )

  const moveBook = useCallback(
    async (bookId, newShelf) => {
      const dateRead =
        newShelf === 'read'
          ? new Date().toLocaleDateString('en-US', {
              month: 'short',
              day: '2-digit',
              year: 'numeric',
            })
          : undefined

      if (isLocal) {
        setBooks((prev) =>
          prev.map((b) =>
            b.id === bookId
              ? { ...b, shelf: newShelf, ...(dateRead ? { dateRead } : {}) }
              : b
          )
        )
        return
      }

      const updates = { shelf: newShelf }
      if (dateRead) updates.date_read = dateRead

      const { error } = await supabase
        .from('books')
        .update(updates)
        .eq('id', bookId)

      if (error) {
        console.error('Failed to move book:', error.message)
        return
      }

      setBooks((prev) =>
        prev.map((b) =>
          b.id === bookId
            ? { ...b, shelf: newShelf, ...(dateRead ? { dateRead } : {}) }
            : b
        )
      )
    },
    [isLocal]
  )

  const deleteBook = useCallback(
    async (bookId) => {
      if (isLocal) {
        setBooks((prev) => prev.filter((b) => b.id !== bookId))
        return
      }

      const { error } = await supabase.from('books').delete().eq('id', bookId)

      if (error) {
        console.error('Failed to delete book:', error.message)
        return
      }

      setBooks((prev) => prev.filter((b) => b.id !== bookId))
    },
    [isLocal]
  )

  return { books, loading, addBook, moveBook, deleteBook, refetch: fetchBooks }
}
