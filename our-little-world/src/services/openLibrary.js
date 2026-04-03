const cache = new Map()

function cacheKey(title, author) {
  return `${title}::${author}`
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
