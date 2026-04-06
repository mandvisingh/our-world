/**
 * Agent Memory — localStorage-backed memory system.
 * Each agent has its own namespace. Stores recent actions, mood, and context.
 * Can be migrated to Supabase later.
 */

const PREFIX = 'agent-mem'

function key(agent, k) {
  return `${PREFIX}:${agent}:${k}`
}

export function readMemory(agent, k) {
  try {
    const raw = localStorage.getItem(key(agent, k))
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function writeMemory(agent, k, value) {
  localStorage.setItem(key(agent, k), JSON.stringify(value))
}

export function getMood(agent) {
  return readMemory(agent, 'mood') || 'neutral'
}

export function setMood(agent, mood) {
  writeMemory(agent, 'mood', mood)
}

export function getRecentActions(agent, limit = 8) {
  const actions = readMemory(agent, 'recent_actions') || []
  return actions.slice(-limit)
}

export function addAction(agent, action) {
  const actions = readMemory(agent, 'recent_actions') || []
  actions.push({
    ...action,
    timestamp: Date.now(),
  })
  // keep last 20
  writeMemory(agent, 'recent_actions', actions.slice(-20))
}

export function getLastToolUse(agent, toolName) {
  const actions = getRecentActions(agent, 20)
  for (let i = actions.length - 1; i >= 0; i--) {
    if (actions[i].tool === toolName) return actions[i].timestamp
  }
  return null
}

export function getConversationHistory(limit = 20) {
  const history = readMemory('shared', 'conversation') || []
  return history.slice(-limit)
}

export function addToConversation(message) {
  const history = readMemory('shared', 'conversation') || []
  history.push({ ...message, timestamp: Date.now() })
  // keep last 50 messages
  writeMemory('shared', 'conversation', history.slice(-50))
}

export function getThoughts(agent, limit = 10) {
  const thoughts = readMemory(agent, 'thoughts') || []
  return thoughts.slice(-limit)
}

export function addThought(agent, thought) {
  const thoughts = readMemory(agent, 'thoughts') || []
  thoughts.push({ text: thought, timestamp: Date.now() })
  writeMemory(agent, 'thoughts', thoughts.slice(-20))
}
