const SPINE_COLORS = [
  '#C9A48E', '#7A9E6E', '#D4956A', '#A67B9B', '#6B8EAD',
  '#C47A7A', '#8B7355', '#B5838D', '#6B9080', '#C4A35A',
  '#D4A574', '#9B8EC4', '#7EB09B', '#C9786C', '#A0855B',
  '#8BA4B8', '#C49B7A', '#7A8B6E', '#B88BA2', '#6E8F7A',
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
  if (len < 10) return 28
  if (len < 20) return 34
  if (len < 30) return 40
  if (len < 45) return 48
  return 54
}

export function groupByShelf(books, validShelves) {
  const shelves = {}
  for (const b of books) {
    const key = validShelves.includes(b.shelf) ? b.shelf : 'read'
    if (!shelves[key]) shelves[key] = []
    shelves[key].push(b)
  }
  return shelves
}
