const API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const MODEL = 'gemini-3.1-flash-lite-preview'
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`

import { CONVERSATION_SYSTEM } from '../data/personalities'

export async function generateBatch(previousContext = []) {
  if (!API_KEY) return null

  const contextStr = previousContext.length > 0
    ? `\n\nPrevious conversation for context (continue naturally from here):\n${previousContext.map(m => `${m.from === 'her' ? 'Her' : 'Him'}: ${m.text}`).join('\n')}`
    : ''

  const prompt = `${CONVERSATION_SYSTEM}${contextStr}

Generate exactly 30 messages of back-and-forth texting. Keep each message VERY short — max 8-10 words ideally, never more than 15 words. These are quick casual texts, not paragraphs.

Respond ONLY with a JSON array. Each item: {"from":"her","text":"message"} or {"from":"him","text":"message"}
No markdown, no code fences, just the JSON array.`

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 1.0,
        maxOutputTokens: 1200,
      },
    }),
  })

  if (!res.ok) return null

  const data = await res.json()
  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text
  if (!raw) return null

  try {
    const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    return JSON.parse(cleaned)
  } catch {
    return null
  }
}
