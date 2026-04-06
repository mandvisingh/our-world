/**
 * Agent Runner — the observe/decide/act/remember loop.
 *
 * Each tick:
 *  1. OBSERVE  — gather context (time, weather, recent actions, conversation)
 *  2. DECIDE   — send context to Gemini, get a tool call decision
 *  3. ACT      — execute the tool
 *  4. REMEMBER — store the action and result in memory
 */

import { TOOLS } from './tools'
import { buildSystemPrompt } from './prompts'
import {
  getMood,
  setMood,
  getRecentActions,
  addAction,
  getConversationHistory,
  addToConversation,
  addThought,
} from './memory'

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const MODEL = 'gemini-3.1-flash-lite-preview'
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`

/**
 * Run one tick of the agent loop.
 * Returns { action, message?, thought? } or null if agent chose to do nothing.
 */
export async function runAgentTick(agent) {
  if (!API_KEY) return null

  // ── 1. OBSERVE ──
  const context = buildContext(agent)

  // ── 2. DECIDE ──
  const decision = await askGemini(agent, context)
  if (!decision || decision.tool === 'do_nothing') {
    return null
  }

  // ── 3. ACT ──
  const result = await executeTool(decision.tool, decision.input || {})

  // ── 4. REMEMBER ──
  if (decision.mood) {
    setMood(agent, decision.mood)
  }

  addAction(agent, {
    tool: decision.tool,
    input: decision.input,
    result: summarizeResult(result),
    thought: decision.thought,
    mood: decision.mood,
  })

  // Handle message outputs
  let message = null
  let thought = null

  if (decision.tool === 'send_message' && decision.input?.text) {
    const msg = {
      from: agent,
      text: decision.input.text,
      type: decision.input.type || 'chat',
    }

    if (msg.type === 'thought') {
      addThought(agent, msg.text)
      thought = msg
    } else {
      addToConversation(msg)
      message = msg
    }
  }

  // The LLM's internal "thought" field is always interesting — surface it as a thought bubble
  if (!thought && decision.thought) {
    addThought(agent, decision.thought)
    thought = { from: agent, text: decision.thought, type: 'thought' }
  }

  return {
    action: decision,
    result,
    message,
    thought,
  }
}

function buildContext(agent) {
  const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Edmonton' }))
  const hour = now.getHours()
  const minute = now.getMinutes()
  const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long' })

  let period
  if (hour >= 6 && hour < 9) period = 'morning'
  else if (hour >= 9 && hour < 12) period = 'midday'
  else if (hour >= 12 && hour < 17) period = 'afternoon'
  else if (hour >= 17 && hour < 21) period = 'evening'
  else if (hour >= 21 || hour < 1) period = 'night'
  else period = 'late_night'

  const mood = getMood(agent)
  const recentActions = getRecentActions(agent, 5)
  const conversation = getConversationHistory(10)

  const otherAgent = agent === 'her' ? 'him' : 'her'
  const otherActions = getRecentActions(otherAgent, 3)

  return `CURRENT CONTEXT:
- Time: ${hour}:${String(minute).padStart(2, '0')} ${dayOfWeek} (${period})
- Your mood: ${mood}

YOUR RECENT ACTIONS (don't repeat these):
${recentActions.length === 0 ? '(none yet)' : recentActions.map(a => `- [${a.tool}] ${a.thought || ''}`).join('\n')}

${otherAgent.toUpperCase()}'S RECENT ACTIONS:
${otherActions.length === 0 ? '(nothing recent)' : otherActions.map(a => `- [${a.tool}] ${a.thought || ''}`).join('\n')}

RECENT CONVERSATION:
${conversation.length === 0 ? '(no messages yet)' : conversation.map(m => `${m.from}: ${m.text}`).join('\n')}

Based on the time, your mood, and what's happening, decide what to do next. Pick ONE tool.`
}

async function askGemini(agent, context) {
  const systemPrompt = buildSystemPrompt(agent)

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `${systemPrompt}\n\n${context}` }] }],
        generationConfig: {
          temperature: 0.9,
          maxOutputTokens: 200,
        },
      }),
    })

    if (!res.ok) return null

    const data = await res.json()
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text
    if (!raw) return null

    // parse JSON from response
    const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    return JSON.parse(cleaned)
  } catch {
    return null
  }
}

async function executeTool(toolName, input) {
  const tool = TOOLS[toolName]
  if (!tool) return { error: `Unknown tool: ${toolName}` }

  try {
    return await tool.execute(input)
  } catch (err) {
    return { error: err.message }
  }
}

function summarizeResult(result) {
  if (!result) return null
  // keep stored results small
  const str = JSON.stringify(result)
  if (str.length > 300) return str.slice(0, 300) + '...'
  return result
}
