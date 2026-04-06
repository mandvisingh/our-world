import { useState, useEffect, useRef, useCallback } from 'react'
import { runAgentTick } from '../agents/runner'
import { getConversationHistory, getThoughts } from '../agents/memory'

const TICK_INTERVAL_MIN = 15000  // 15 seconds minimum between ticks
const TICK_INTERVAL_MAX = 30000  // 30 seconds max
const MAX_VISIBLE = 6

function randomInterval() {
  return TICK_INTERVAL_MIN + Math.random() * (TICK_INTERVAL_MAX - TICK_INTERVAL_MIN)
}

export function useAgentLoop() {
  const [messages, setMessages] = useState(() => {
    // restore conversation from memory on mount
    return getConversationHistory(MAX_VISIBLE)
  })
  const [herThoughts, setHerThoughts] = useState(() => getThoughts('her', 5))
  const [hisThoughts, setHisThoughts] = useState(() => getThoughts('him', 5))
  const [typing, setTyping] = useState(null)
  const [lastAction, setLastAction] = useState(null)
  const activeRef = useRef(true)
  const turnRef = useRef(Math.random() > 0.5 ? 'her' : 'him')

  const tick = useCallback(async () => {
    if (!activeRef.current) return

    const agent = turnRef.current
    setTyping(agent)

    const result = await runAgentTick(agent)

    if (!activeRef.current) return
    setTyping(null)

    if (result) {
      if (result.message) {
        setMessages(prev => {
          const next = [...prev, result.message]
          return next.length > MAX_VISIBLE ? next.slice(-MAX_VISIBLE) : next
        })
      }

      if (result.thought) {
        if (agent === 'her') {
          setHerThoughts(prev => [...prev.slice(-4), result.thought])
        } else {
          setHisThoughts(prev => [...prev.slice(-4), result.thought])
        }
      }

      setLastAction({
        agent,
        tool: result.action.tool,
        thought: result.action.thought,
        mood: result.action.mood,
      })
    }

    // alternate turns (80% chance), 20% same person goes again
    if (Math.random() > 0.2) {
      turnRef.current = agent === 'her' ? 'him' : 'her'
    }
  }, [])

  useEffect(() => {
    activeRef.current = true
    let timeoutId

    async function loop() {
      if (!activeRef.current) return
      await tick()
      if (!activeRef.current) return
      timeoutId = setTimeout(loop, randomInterval())
    }

    // start after a short delay
    timeoutId = setTimeout(loop, 2000)

    return () => {
      activeRef.current = false
      clearTimeout(timeoutId)
    }
  }, [tick])

  return {
    messages,
    herThoughts,
    hisThoughts,
    typing,
    lastAction,
  }
}
