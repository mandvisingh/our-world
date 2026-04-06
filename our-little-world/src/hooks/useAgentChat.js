import { useState, useEffect, useRef } from 'react'
import { generateBatch } from '../services/gemini'

const DELAY_MIN = 5000
const DELAY_MAX = 10000
const MAX_VISIBLE = 5
const CACHE_KEY = 'agent-chat-queue'

function randomDelay() {
  return DELAY_MIN + Math.random() * (DELAY_MAX - DELAY_MIN)
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function loadCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const { queue, context, timestamp } = JSON.parse(raw)
    // cache valid for 1 hour
    if (Date.now() - timestamp > 60 * 60 * 1000) return null
    if (!queue || queue.length === 0) return null
    return { queue, context: context || [] }
  } catch {
    return null
  }
}

function saveCache(queue, context) {
  localStorage.setItem(CACHE_KEY, JSON.stringify({
    queue,
    context: context.slice(-6),
    timestamp: Date.now(),
  }))
}

export function useAgentChat() {
  const [messages, setMessages] = useState([])
  const [typing, setTyping] = useState(null)
  const activeRef = useRef(true)
  const queueRef = useRef([])
  const contextRef = useRef([])
  const fetchingRef = useRef(false)
  const shownRef = useRef(0)

  useEffect(() => {
    activeRef.current = true
    startChat()
    return () => { activeRef.current = false }
  }, [])

  async function fetchMore() {
    if (fetchingRef.current) return
    fetchingRef.current = true
    const batch = await generateBatch(contextRef.current.slice(-6))
    fetchingRef.current = false
    if (batch && batch.length > 0) {
      queueRef.current = [...queueRef.current, ...batch]
      saveCache(queueRef.current, contextRef.current)
    }
  }

  async function startChat() {
    // try loading from cache first (saves an API call on refresh)
    const cached = loadCache()
    if (cached) {
      queueRef.current = cached.queue
      contextRef.current = cached.context
    } else {
      await fetchMore()
    }
    if (!activeRef.current) return
    showNext()
  }

  async function showNext() {
    if (!activeRef.current) return

    // if queue is empty, fetch more
    if (queueRef.current.length === 0) {
      await fetchMore()
      if (!activeRef.current || queueRef.current.length === 0) return
    }

    const msg = queueRef.current.shift()
    const speaker = msg.from

    // save remaining queue to cache
    saveCache(queueRef.current, contextRef.current)

    setTyping(speaker)
    await sleep(1500 + Math.random() * 1500)
    if (!activeRef.current) return

    setTyping(null)
    contextRef.current = [...contextRef.current, msg]

    setMessages(prev => {
      const next = [...prev, msg]
      return next.length > MAX_VISIBLE ? next.slice(-MAX_VISIBLE) : next
    })

    shownRef.current++

    // prefetch next batch when running low
    if (queueRef.current.length <= 5 && !fetchingRef.current) {
      fetchMore()
    }

    await sleep(randomDelay())
    if (!activeRef.current) return
    showNext()
  }

  return { messages, typing }
}
