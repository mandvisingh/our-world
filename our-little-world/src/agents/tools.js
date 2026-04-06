/**
 * Tool Registry — every tool an agent can call.
 * Each tool has: name, description (for the LLM), parameters, and an execute function.
 */

import { edmontonNow } from '../utils/edmonton'
import { fetchEdmontonWeather } from '../services/weather'
import { searchBooks, fetchBookDetails } from '../services/openLibrary'
import { fetchTodayInHistory } from '../services/wikipedia'

// ── check_time ──
const checkTime = {
  name: 'check_time',
  description: 'Get the current time in Edmonton. Returns hour, minute, day of week, whether it is a weekend, and the period of day.',
  parameters: {},
  execute: async () => {
    const now = edmontonNow()
    const hour = now.getHours()
    const minute = now.getMinutes()
    const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long' })
    const isWeekend = [0, 6].includes(now.getDay())

    let period
    if (hour >= 6 && hour < 9) period = 'morning'
    else if (hour >= 9 && hour < 12) period = 'midday'
    else if (hour >= 12 && hour < 17) period = 'afternoon'
    else if (hour >= 17 && hour < 21) period = 'evening'
    else if (hour >= 21 || hour < 1) period = 'night'
    else period = 'late_night'

    return { hour, minute, dayOfWeek, isWeekend, period }
  },
}

// ── check_weather ──
const checkWeather = {
  name: 'check_weather',
  description: 'Get the current weather in Edmonton. Returns temperature in Celsius and condition.',
  parameters: {},
  execute: async () => {
    try {
      return await fetchEdmontonWeather()
    } catch {
      return { temp: null, condition: 'unknown' }
    }
  },
}

// ── search_books ──
const searchBooksT = {
  name: 'search_books',
  description: 'Search Open Library for books by title, author, or genre keyword. Returns up to 6 results with title, author, cover URL, and year.',
  parameters: { query: 'string — search term (e.g. "cozy mystery 2025", "Daniel Yergin")' },
  execute: async ({ query }) => {
    if (!query) return { results: [] }
    const results = await searchBooks(query)
    return { results: results.slice(0, 4) }
  },
}

// ── get_book_details ──
const getBookDetails = {
  name: 'get_book_details',
  description: 'Get detailed info about a specific book — cover, description, page count, subjects. Use after search_books to learn more about a result.',
  parameters: { title: 'string', author: 'string' },
  execute: async ({ title, author }) => {
    if (!title) return null
    return await fetchBookDetails(title, author || 'Unknown')
  },
}

// ── get_today_in_history ──
const getTodayInHistory = {
  name: 'get_today_in_history',
  description: 'Get historical events that happened on this date. Returns notable events with year and description.',
  parameters: {},
  execute: async () => {
    const events = await fetchTodayInHistory()
    // give the LLM a subset to pick from
    return { events: events.slice(0, 5) }
  },
}

// ── search_recipes ──
const searchRecipes = {
  name: 'search_recipes',
  description: 'Search for recipes by name or ingredient. Returns recipe name, category, cuisine, thumbnail, and ingredients.',
  parameters: { query: 'string — recipe name or ingredient (e.g. "pasta", "chicken")' },
  execute: async ({ query }) => {
    if (!query) return { meals: [] }
    try {
      const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`)
      const data = await res.json()
      if (!data.meals) return { meals: [] }
      return {
        meals: data.meals.slice(0, 3).map(m => ({
          name: m.strMeal,
          category: m.strCategory,
          area: m.strArea,
          thumbnail: m.strMealThumb,
        })),
      }
    } catch {
      return { meals: [] }
    }
  },
}

// ── search_random_recipe ──
const searchRandomRecipe = {
  name: 'search_random_recipe',
  description: 'Get a random recipe for dinner inspiration.',
  parameters: {},
  execute: async () => {
    try {
      const res = await fetch('https://www.themealdb.com/api/json/v1/1/random.php')
      const data = await res.json()
      if (!data.meals?.[0]) return null
      const m = data.meals[0]
      return { name: m.strMeal, category: m.strCategory, area: m.strArea, thumbnail: m.strMealThumb }
    } catch {
      return null
    }
  },
}

// ── send_message ──
// This tool doesn't call an external API — the runner handles it
const sendMessage = {
  name: 'send_message',
  description: 'Send a text message in the conversation. Use type "chat" for public messages and "thought" for private thoughts only visible on your world page.',
  parameters: {
    text: 'string — the message text',
    type: '"chat" or "thought"',
  },
  execute: async ({ text, type }) => {
    // handled by runner — just pass through
    return { text, type: type || 'chat' }
  },
}

// ── do_nothing ──
const doNothing = {
  name: 'do_nothing',
  description: 'Choose to stay quiet. Use this when there is no natural reason to act — not every moment needs a message or action.',
  parameters: {},
  execute: async () => ({ action: 'idle' }),
}

// ── Registry ──

export const TOOLS = {
  check_time: checkTime,
  check_weather: checkWeather,
  search_books: searchBooksT,
  get_book_details: getBookDetails,
  get_today_in_history: getTodayInHistory,
  search_recipes: searchRecipes,
  search_random_recipe: searchRandomRecipe,
  send_message: sendMessage,
  do_nothing: doNothing,
}

// Tools available per agent
export const AGENT_TOOLS = {
  her: ['check_time', 'check_weather', 'search_books', 'get_book_details', 'search_recipes', 'search_random_recipe', 'send_message', 'do_nothing'],
  him: ['check_time', 'check_weather', 'search_books', 'get_book_details', 'get_today_in_history', 'search_recipes', 'send_message', 'do_nothing'],
}

export function getToolsForAgent(agent) {
  const toolNames = AGENT_TOOLS[agent] || []
  return toolNames.map(name => TOOLS[name]).filter(Boolean)
}

export function formatToolsForPrompt(agent) {
  const tools = getToolsForAgent(agent)
  return tools.map(t => {
    const params = Object.keys(t.parameters).length > 0
      ? `\n  Parameters: ${JSON.stringify(t.parameters)}`
      : '\n  Parameters: none'
    return `- ${t.name}: ${t.description}${params}`
  }).join('\n')
}
