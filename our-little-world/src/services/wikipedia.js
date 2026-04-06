const CACHE_KEY = 'today-in-history'
const CACHE_TTL = 4 * 60 * 60 * 1000 // 4 hours

function getCached() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const { events, timestamp } = JSON.parse(raw)
    if (Date.now() - timestamp > CACHE_TTL) return null
    return events
  } catch {
    return null
  }
}

function setCache(events) {
  localStorage.setItem(CACHE_KEY, JSON.stringify({ events, timestamp: Date.now() }))
}

export async function fetchTodayInHistory() {
  const cached = getCached()
  if (cached) return cached

  const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Edmonton' }))
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')

  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/${month}/${day}`,
      { headers: { 'Accept': 'application/json' } }
    )
    if (!res.ok) return []

    const data = await res.json()
    if (!data.events) return []

    // pick 5 interesting events, prefer ones with longer descriptions
    const events = data.events
      .filter(e => e.text && e.year)
      .sort((a, b) => b.text.length - a.text.length)
      .slice(0, 8)
      .sort((a, b) => a.year - b.year)
      .map(e => ({
        year: e.year,
        text: e.text,
        page: e.pages?.[0]?.normalizedtitle || null,
        pageUrl: e.pages?.[0]?.content_urls?.desktop?.page || null,
      }))

    setCache(events)
    return events
  } catch {
    return []
  }
}
