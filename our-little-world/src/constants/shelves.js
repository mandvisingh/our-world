export const SHELVES = [
  { key: 'currently-reading', label: 'Reading Now' },
  { key: 'read', label: 'Read' },
  { key: 'to-read', label: 'Want to Read' },
  { key: 'paused', label: 'Paused' },
  { key: 'dnf', label: 'Did Not Finish' },
]

export const SHELF_ORDER = ['currently-reading', 'read', 'to-read']

export const SHELF_LABELS = {
  'currently-reading': 'Currently Reading',
  'read': 'Read',
  'to-read': 'Want to Read',
}

export function shelfLabel(key) {
  return SHELVES.find((s) => s.key === key)?.label || key
}
