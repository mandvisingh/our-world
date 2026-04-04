const cache = new Map()

function cacheKey(title, author) {
  return `${title}::${author}`
}

export async function searchBooks(query) {
  if (!query || query.length < 2) return []

  try {
    const q = encodeURIComponent(query)
    const res = await fetch(`https://openlibrary.org/search.json?q=${q}&limit=6&fields=title,author_name,cover_i,first_publish_year,key`)
    const data = await res.json()

    if (!data.docs) return []

    return data.docs.map((doc) => ({
      title: doc.title,
      author: doc.author_name?.[0] || 'Unknown',
      coverUrl: doc.cover_i
        ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-S.jpg`
        : null,
      year: doc.first_publish_year || null,
    }))
  } catch {
    return []
  }
}

export async function fetchBookDetails(title, author) {
  const key = cacheKey(title, author)
  if (cache.has(key)) return cache.get(key)

  const emptyResult = {
    coverUrl: null,
    description: null,
    pages: null,
    firstPublished: null,
    subjects: [],
  }

  try {
    const q = `title=${encodeURIComponent(title)}&author=${encodeURIComponent(author)}&limit=1`
    const res = await fetch(`https://openlibrary.org/search.json?${q}`)
    const data = await res.json()

    if (!data.docs || data.docs.length === 0) {
      cache.set(key, emptyResult)
      return emptyResult
    }

    const doc = data.docs[0]
    const coverId = doc.cover_i
    const coverUrl = coverId
      ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
      : null

    let description = null
    if (doc.key) {
      try {
        const workRes = await fetch(`https://openlibrary.org${doc.key}.json`)
        const workData = await workRes.json()
        if (workData.description) {
          description =
            typeof workData.description === 'string'
              ? workData.description
              : workData.description.value
        }
      } catch {
        /* description is optional */
      }
    }

    const result = {
      coverUrl,
      description,
      pages: doc.number_of_pages_median || null,
      firstPublished: doc.first_publish_year || null,
      subjects: (doc.subject || []).slice(0, 5),
    }

    cache.set(key, result)
    return result
  } catch {
    cache.set(key, emptyResult)
    return emptyResult
  }
}
