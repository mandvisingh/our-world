export const SHELVES = [
  { key: 'currently-reading', label: 'Reading' },
  { key: 'currently-listening', label: 'Listening' },
  { key: 'finished', label: 'Finished' },
  { key: 'want-to-pick-up', label: 'Want to Pick Up' },
  { key: 'paused', label: 'Paused' },
  { key: 'dnf', label: 'Did Not Finish' },
]

export const SHELF_ORDER = ['currently-reading', 'currently-listening', 'finished', 'want-to-pick-up']

export const SHELF_LABELS = {
  'currently-reading': 'Reading',
  'currently-listening': 'Listening',
  'finished': 'Finished',
  'want-to-pick-up': 'Want to Pick Up',
}

export const STATS_CONFIG = [
  { key: 'finished', emoji: '📚', label: 'finished' },
  { key: 'currently-reading', emoji: '📖', label: 'reading' },
  { key: 'currently-listening', emoji: '🎧', label: 'listening' },
  { key: 'want-to-pick-up', emoji: '✨', label: 'want to pick up' },
]

export function shelfLabel(key) {
  return SHELVES.find((s) => s.key === key)?.label || key
}
