# our little corner of the world

A living, breathing digital home for two people and their cats in Edmonton, AB. Features autonomous AI agents that text each other, browse books, check the weather, look up history, search recipes, and think private thoughts — all in real time.

Built as a portfolio piece demonstrating **agentic AI architecture**: tool use, memory, multi-agent coordination, and personality-driven decision-making.

## Live Demo

[Deployed on Vercel](https://our-little-world.vercel.app) (if deployed)

---

## Architecture

```
                         +------------------+
                         |   Landing Page   |
                         |  Backyard Scene  |
                         | Day/Night Switch |
                         | Chat Bubbles (AI)|
                         +--------+---------+
                                  |
                    +-------------+-------------+
                    |                           |
             +------+------+            +------+------+
             |  Her World  |            |  His World  |
             |  /her       |            |  /his       |
             +------+------+            +------+------+
                    |                           |
         +----------+----------+     +----------+----------+
         | Books  Recs  Agent  |     | Books History Agent |
         +---------------------+     +---------------------+


  +------------------------------------------------------------------+
  |                        Agent Framework                            |
  |                                                                    |
  |  +-----------+    +-----------+    +-----------+    +-----------+  |
  |  |  OBSERVE  | -> |  DECIDE   | -> |    ACT    | -> | REMEMBER  |  |
  |  |           |    |           |    |           |    |           |  |
  |  | Time      |    | Gemini    |    | Tool      |    | Memory    |  |
  |  | Weather   |    | 3.1 Flash |    | Registry  |    | Actions   |  |
  |  | Memory    |    | Lite      |    | (9 tools) |    | Mood      |  |
  |  | Other     |    |           |    |           |    | Convo     |  |
  |  | Agent     |    | Picks a   |    | Real API  |    | Thoughts  |  |
  |  | Actions   |    | tool +    |    | calls     |    |           |  |
  |  |           |    | input     |    |           |    |           |  |
  |  +-----------+    +-----------+    +-----------+    +-----------+  |
  +------------------------------------------------------------------+


  +------------------------------------------------------------------+
  |                         Tool Registry                              |
  |                                                                    |
  |  check_time          check_weather        search_books             |
  |  get_book_details    get_today_in_history  search_recipes           |
  |  search_random_recipe  send_message        do_nothing              |
  |                                                                    |
  |  Each tool: name, description, parameters, execute()               |
  |  Per-agent access control (her vs him)                             |
  +------------------------------------------------------------------+


  +------------------------------------------------------------------+
  |                        Data Layer                                  |
  |                                                                    |
  |  Supabase (Postgres + RLS)          localStorage                   |
  |  +------------------------+         +------------------------+     |
  |  | books (325 records)    |         | agent memory           |     |
  |  | recommendations        |         | conversation history   |     |
  |  | book_details_cache     |         | thought bubbles        |     |
  |  +------------------------+         | mood state             |     |
  |                                     +------------------------+     |
  +------------------------------------------------------------------+


  +------------------------------------------------------------------+
  |                      External APIs (all free)                      |
  |                                                                    |
  |  Gemini 3.1 Flash Lite  -  Agent reasoning + chat generation       |
  |  Open Library            -  Book search, covers, details           |
  |  Open-Meteo              -  Edmonton weather (no key)              |
  |  Wikipedia REST API      -  Today in history events (no key)       |
  |  TheMealDB              -  Recipe search (no key)                  |
  +------------------------------------------------------------------+
```

---

## How the Agents Work

Two AI agents (Her and Him) run autonomously every 15-30 seconds. Each tick:

1. **Observe** - Gather context: current Edmonton time, weather, mood, recent actions (both agents), conversation history
2. **Decide** - Send context + personality + available tools to Gemini. LLM returns a structured JSON decision: which tool to call, with what input, current mood
3. **Act** - Execute the chosen tool (real API call to Open Library, Wikipedia, TheMealDB, etc.)
4. **Remember** - Store the action in memory, update mood, add messages or thoughts

### Message Types

| Type | Where visible | Example |
|------|--------------|---------|
| **Chat** | Landing page + both worlds | "when are you coming homeee" |
| **Thought** | Only on that agent's world page | "maybe I should get her flowers..." |

### Agent Personalities

**Her**: Software developer, WFH. Texts with "hahahahaha", "noooo", "yeeeessss". Obsessed with cats (George & Jerry). Hates Greek food. Browses books and recipes. Asks him to come home after 5pm.

**Him**: Government administrator. Dry humor, deadpan. History and geopolitics nerd. Did bachelors in entomology. Teases her with "tiny face". Shares random historical facts. Checks Oilers scores.

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | React 19 + Vite 8 | Fast builds, modern React features |
| Styling | Plain CSS + CSS variables | Per-world theming without a framework |
| Routing | React Router v7 | SPA with `/`, `/her`, `/his` |
| Database | Supabase (Postgres + RLS) | Free tier, real-time capable |
| AI | Gemini 3.1 Flash Lite | Free tier, fast inference for agent loop |
| Books API | Open Library | Free, no key, covers + metadata |
| Weather API | Open-Meteo | Free, no key, Edmonton coordinates |
| Wikipedia | Wikimedia REST API | Free, no key, today-in-history events |
| Recipes | TheMealDB | Free, no key |
| Hosting | Vercel | Free tier, auto-deploy from git |

---

## Project Structure

```
src/
├── agents/                    # Agentic AI framework
│   ├── AgentContext.jsx       # React context (shared state across pages)
│   ├── memory.js              # localStorage-backed memory system
│   ├── prompts.js             # Per-agent personality + tool instructions
│   ├── runner.js              # Core loop: observe -> decide -> act -> remember
│   └── tools.js               # Tool registry (9 tools with execute functions)
│
├── components/
│   ├── books/                 # Book management UI
│   │   ├── BookCard.jsx       # Cover art grid card (Open Library covers)
│   │   ├── BookShelf.jsx      # Grid/spine toggle view
│   │   ├── BookSpine.jsx      # Classic spine view
│   │   ├── BookDetail.jsx     # Modal with cover, description, actions
│   │   ├── BookSearch.jsx     # Search across all shelves
│   │   ├── AddBookForm.jsx    # Open Library search-as-you-type
│   │   ├── EditBookForm.jsx   # Edit book/recommendation
│   │   └── RecommendationsPanel.jsx
│   ├── chat/                  # Agent conversation UI
│   │   ├── ChatBubbles.jsx    # Landing page chat (her/him bubbles)
│   │   ├── ThoughtBubbles.jsx # Private thoughts (world pages)
│   │   └── AgentActivity.jsx  # Tool use activity feed
│   ├── history/
│   │   └── TodayInHistory.jsx # Wikipedia on-this-day events
│   └── shared/                # Reusable components
│       ├── BackButton.jsx
│       ├── DrinkCard.jsx      # Coffee machine + drink rotation
│       ├── Loader.jsx
│       ├── Modal.jsx          # Bottom-sheet on mobile
│       ├── WorldHeader.jsx
│       └── WorldNav.jsx       # Tab navigation within worlds
│
├── constants/
│   ├── shelves.js             # Reading/Listening/Finished/Want to Pick Up
│   └── defaults.js            # Default recommendations
│
├── data/
│   ├── books.js               # Her 165 books (Supabase fallback)
│   ├── hisBooks.js            # His 160 books (Supabase fallback)
│   └── personalities.js       # Agent personality definitions
│
├── hooks/
│   ├── useAgentLoop.js        # Runs both agents, exposes messages/thoughts
│   ├── useBooks.js            # CRUD for books (Supabase + local fallback)
│   ├── useBookDetails.js      # Open Library details fetcher
│   ├── useEdmontonClock.js    # Live Edmonton time
│   ├── useRecommendations.js  # Her book recommendations
│   ├── useTodayInHistory.js   # Wikipedia events hook
│   └── useWeather.js          # Open-Meteo Edmonton weather
│
├── lib/
│   └── supabase.js            # Supabase client (graceful no-env fallback)
│
├── pages/
│   ├── Landing.jsx/css        # Backyard scene, day/night, chat bubbles
│   ├── HerWorld.jsx/css       # Books, recommendations, activity, thoughts
│   └── HisWorld.jsx/css       # Books, today-in-history, activity, thoughts
│
├── services/
│   ├── gemini.js              # Gemini API client (batch chat generation)
│   ├── openLibrary.js         # 3-tier cache: memory -> Supabase -> API
│   ├── weather.js             # Open-Meteo Edmonton weather
│   └── wikipedia.js           # On-this-day events with localStorage cache
│
└── utils/
    ├── books.js               # Spine colors, widths, shelf grouping, aliases
    └── edmonton.js            # Timezone helpers, weather codes
```

---

## Key Engineering Decisions

### 3-Tier Book Details Cache
Open Library is slow (~1-2s per request). To avoid redundant calls:
1. **In-memory Map** (instant, session-level)
2. **Supabase `book_details_cache` table** (fast, persists across sessions)
3. **Open Library API** (slow, only on cache miss)

Fire-and-forget upserts to Supabase so the UI never waits for a DB write.

### Agent Memory in localStorage
Agent actions, mood, conversation history, and thoughts are stored in localStorage instead of Supabase. This keeps agent ticks fast (no network latency) and avoids burning Supabase quota on high-frequency writes. Can be migrated to Supabase later for cross-device sync.

### Shelf Aliasing for Zero-Migration Updates
Shelf names evolved (`read` -> `finished`, `to-read` -> `want-to-pick-up`). Instead of migrating the database, `normalizeShelf()` maps legacy names at read time. The database stays untouched.

### CSS Variables for World Theming
Shared components (`BookShelf`, `BookSearch`, `WorldNav`) use CSS variables (`--accent`, `--heading`, `--muted`). Each world page sets these variables on its root, so all children theme automatically without props or conditional styles.

### Graceful Supabase Fallback
If no `.env` credentials are set, all hooks fall back to local data files (`src/data/books.js`, `src/data/hisBooks.js`). The app works fully offline for development.

---

## Run Locally

```bash
cd our-little-world
npm install
npm run dev
```

### With Supabase (optional)

Create a `.env` file:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_GEMINI_API_KEY=your_gemini_key
```

Run the schema in Supabase SQL Editor:
```bash
# In order:
supabase/schema.sql
supabase/seed.sql      # Her 165 books
supabase/seed-him.sql  # His 160 books
```

---

## What This Demonstrates

- **Agentic AI** - Autonomous agents with tool use, memory, personality, and inter-agent awareness
- **Tool Registry Pattern** - Same pattern as LangChain/CrewAI: named tools with descriptions, parameters, and execute functions; LLM selects which to call
- **Multi-Agent Coordination** - Two agents share conversation context, react to each other's actions, maintain independent memory and mood
- **Real-Time Data Integration** - Live weather, Wikipedia events, Open Library books, recipe search
- **3-Tier Caching** - Memory -> database -> API for external data
- **Graceful Degradation** - Works without Supabase, without Gemini key, without network
- **Mobile-First Responsive Design** - Three breakpoints (768px, 600px, 380px), touch targets, scrollable tabs
- **Component Architecture** - CSS variable theming, shared components, hooks for everything

---

Built with React, Supabase, Gemini, and love.
