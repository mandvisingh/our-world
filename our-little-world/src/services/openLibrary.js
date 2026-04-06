import { supabase } from '../lib/supabase'

/* ── in-memory cache (session-level, avoids redundant reads) ── */
const memCache = new Map()

function makeCacheKey(title, author) {
  return `${title.toLowerCase().trim()}::${author.toLowerCase().trim()}`
}

const EMPTY_RESULT = Object.freeze({
  coverUrl: null,
  description: null,
  pages: null,
  firstPublished: null,
  subjects: [],
})

/* ── DB cache: read ── */
async function readFromDbCache(key) {
  if (!supabase) return null
  try {
    const { data } = await supabase
      .from('book_details_cache')
      .select('*')
      .eq('cache_key', key)
      .single()

    if (!data) return null

    return {
      coverUrl: data.cover_url,
      description: data.description,
      pages: data.pages,
      firstPublished: data.first_published,
      subjects: data.subjects || [],
    }
  } catch {
    return null
  }
}

/* ── DB cache: write (fire-and-forget) ── */
function writeToDbCache(key, result) {
  if (!supabase) return
  supabase
    .from('book_details_cache')
    .upsert({
      cache_key: key,
      cover_url: result.coverUrl,
      description: result.description,
      pages: result.pages,
      first_published: result.firstPublished,
      subjects: result.subjects,
      fetched_at: new Date().toISOString(),
    }, { onConflict: 'cache_key' })
    .then(({ error }) => {
      if (error) console.warn('Cache write failed:', error.message)
    })
}

/* ── Open Library API fetch ── */
async function fetchFromOpenLibrary(title, author) {
  const q = `title=${encodeURIComponent(title)}&author=${encodeURIComponent(author)}&limit=1`
  const res = await fetch(`https://openlibrary.org/search.json?${q}`)
  const data = await res.json()

  if (!data.docs || data.docs.length === 0) return EMPTY_RESULT

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

  return {
    coverUrl,
    description,
    pages: doc.number_of_pages_median || null,
    firstPublished: doc.first_publish_year || null,
    subjects: (doc.subject || []).slice(0, 5),
  }
}

/* ── public API ── */

export async function searchBooks(query) {
  if (!query || query.length < 2) return []

  try {
    const q = encodeURIComponent(query)
    const res = await fetch(
      `https://openlibrary.org/search.json?q=${q}&limit=6&fields=title,author_name,cover_i,first_publish_year,key`
    )
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
  const key = makeCacheKey(title, author)

  // 1. in-memory cache (instant)
  if (memCache.has(key)) return memCache.get(key)

  // 2. database cache (fast, no external API call)
  const dbResult = await readFromDbCache(key)
  if (dbResult) {
    memCache.set(key, dbResult)
    return dbResult
  }

  // 3. Open Library API (slow, external)
  try {
    const apiResult = await fetchFromOpenLibrary(title, author)
    memCache.set(key, apiResult)
    writeToDbCache(key, apiResult) // persist for next time
    return apiResult
  } catch {
    memCache.set(key, EMPTY_RESULT)
    return EMPTY_RESULT
  }
}
