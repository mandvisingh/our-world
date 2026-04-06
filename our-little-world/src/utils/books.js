const SPINE_COLORS = [
  '#8B4513', '#2F4F4F', '#8B0000', '#2E4057', '#4A5A3C',
  '#6B3A5D', '#3C1518', '#1B4332', '#3D405B', '#7C3626',
  '#2C3E50', '#5B2C6F', '#1A3C40', '#6E2C00', '#283747',
  '#4A235A', '#0E4D45', '#5D4037', '#1B2631', '#6B4226',
]

export function spineColor(title) {
  let hash = 0
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash)
  }
  return SPINE_COLORS[Math.abs(hash) % SPINE_COLORS.length]
}

export function spineWidth(title) {
  const len = title.length
  if (len < 10) return 34
  if (len < 20) return 42
  if (len < 30) return 50
  if (len < 45) return 58
  return 64
}

// map legacy shelf names to new ones
const SHELF_ALIASES = {
  'read': 'finished',
  'to-read': 'want-to-pick-up',
  'to-listen': 'want-to-pick-up',
}

export function normalizeShelf(shelf) {
  return SHELF_ALIASES[shelf] || shelf
}

export function groupByShelf(books, validShelves) {
  const shelves = {}
  for (const s of validShelves) shelves[s] = []
  for (const b of books) {
    const mapped = normalizeShelf(b.shelf)
    const key = validShelves.includes(mapped) ? mapped : 'finished'
    if (!shelves[key]) shelves[key] = []
    shelves[key].push({ ...b, shelf: key })
  }
  return shelves
}
