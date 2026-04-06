# Alive — AI Desktop Pets with Personality

**Tagline:** Little characters that live on your desktop, think for themselves, and never do the same thing twice.

---

## What Is This

A desktop app where 1-4 AI-powered characters live on your screen as an always-on overlay. They walk around, interact with each other, use real tools (weather, news, books, recipes), develop memories, and act autonomously — all powered by a local Ollama model. No cloud dependency, no subscription required.

Users pick their characters, write personalities in plain English, and watch them come to life.

---

## Why This Doesn't Exist Yet

| What exists | What's missing |
|---|---|
| Shimeji, Desktop Goose, eSheep | No brain — scripted loops, same 12 behaviors forever |
| Character.ai, Replika | No spatial presence — trapped in a chat window, waits for you to talk |
| LLM chat apps | No autonomy — they respond, they don't *initiate* |
| Tamagotchi, virtual pets | No real intelligence, no tool use, no memory |

**Alive** sits in the gap: spatially present, autonomous, intelligent, and personal.

---

## Core Experience

You install the app. You create your first pet — say, a cat named Bean. You describe Bean: "chaotic, knocks things over, obsessed with fish, judges everyone." You pick a sprite style (pixel art cat). You hit start.

Bean appears on your desktop. Bean walks along the bottom of your screen. After a minute, Bean checks the weather and curls up because it's cold outside. Ten minutes later, Bean knocks a virtual object off the edge of your screen. An hour later, Bean finds a fish recipe and shares it in the activity log. You glance at Bean's thought bubble: "the human hasn't moved their mouse in 20 minutes... are they okay?"

Bean remembers yesterday. Bean won't repeat the same joke. Bean has opinions.

Now add a second pet — a fox named Mochi. Mochi is sweet, shy, loves space facts. Bean and Mochi interact. Bean judges Mochi. Mochi shares a space fact. Bean doesn't care. This happens on your desktop while you work.

That's the product.

---

## Architecture

```
┌──────────────────────────────────────────┐
│            Tauri v2 Shell                │
│    (transparent, always-on-top overlay)  │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │         React Frontend             │  │
│  │                                    │  │
│  │  Character renderer (Rive/Lottie)  │  │
│  │  Speech/thought bubbles            │  │
│  │  Click interaction zones           │  │
│  │  Settings panel (non-overlay)      │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │        Agent Engine (Rust)         │  │
│  │                                    │  │
│  │  Per-character agent loops         │  │
│  │  Ollama client                     │  │
│  │  Tool executor                     │  │
│  │  Memory manager                    │  │
│  │  Inter-character interaction queue │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │     SQLite (local persistence)     │  │
│  │                                    │  │
│  │  character_config                  │  │
│  │  character_memory                  │  │
│  │  character_actions                 │  │
│  │  conversations                     │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
              │
              ▼
        ┌───────────┐
        │  Ollama    │  (user-installed, local)
        │  3B model  │
        └───────────┘
```

### Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Shell | Tauri v2 | ~15MB RAM, transparent window support, Rust backend for agent engine |
| Frontend | React + Vite | Fast iteration, component model fits character rendering |
| Animation | Rive | State machine built in — define walk/idle/sleep/talk transitions visually |
| Local DB | SQLite (via Tauri SQL plugin) | Zero setup, embedded, fast |
| AI | Ollama (local) | Free, private, no network dependency for core behavior |
| Language model | llama3.2:3b or gemma2:2b | Small enough to run constantly, fast enough for 30s loops |

---

## Characters

### Character Creation

Users create characters through a simple form:

```
Name:           Bean
Species:        Cat          [Cat | Dog | Fox | Bird | Dragon | Robot | Bunny | Custom]
Personality:    "chaotic, knocks things over, obsessed with fish, judges 
                everyone, sleeps 18 hours a day, hates Mondays"
Voice style:    "short sentences, lots of '...', never uses exclamation marks"
Interests:      [Food, Weather, Chaos]        (maps to tool access)
Activity level: High                          [Low | Medium | High | Unhinged]
```

That's it. No JSON. No config files. The app converts this into a system prompt for Ollama.

### Species = Sprite Pack + Default Behaviors

Each species comes with:
- **Sprite animations** — idle, walk, sleep, talk, react, unique action (cats knock things, dogs fetch, dragons breathe fire animation)
- **Base behavior hints** — cats sleep more, dogs are more social, dragons are dramatic. These are soft defaults the personality can override
- **Unique interaction style** — cats ignore you, dogs follow your cursor, birds perch on window edges

### Character Limits

- **Free:** 1-2 characters
- **Paid:** Up to 4 active characters (more gets noisy and resource-heavy)

### Pre-built Characters (Starter Pack)

For users who don't want to write personalities, ship 4-6 ready-to-go characters:

| Name | Species | Personality | Vibe |
|---|---|---|---|
| Bean | Cat | Chaotic, judgmental, food-obsessed | George Costanza as a cat |
| Mochi | Fox | Sweet, shy, loves space and science | Wholesome nerd |
| Grump | Dog | Old soul, dry humor, hates mornings | Ron Swanson energy |
| Pixel | Robot | Overly literal, accidentally funny, loves data | Helpful but confused |
| Sage | Dragon | Dramatic, poetic, treats everything like an epic quest | Fantasy main character |
| Boba | Bunny | Anxious, overthinks everything, very kind | Relatable introvert |

Users can use these as-is or fork them and edit the personality.

---

## Tool System

Tools are what make characters feel alive rather than just animated. Each tool is a real API call or system interaction.

### Tool Registry

| Tool | API | Auth | What it does |
|---|---|---|---|
| `check_weather` | Open-Meteo | None | Gets local weather. Characters react to it |
| `check_time` | System clock | None | Time-aware behavior (morning, night, weekends) |
| `search_books` | Open Library | None | Browse and recommend books |
| `search_recipes` | TheMealDB | None | Find recipes, suggest meals |
| `today_in_history` | Wikipedia On This Day | None | Share historical facts |
| `search_news` | RSS / NewsData.io | Free key | Summarize headlines |
| `random_fact` | Useless Facts API / Numbers API | None | Random trivia |
| `search_music` | ListenBrainz / MusicBrainz | None | Discover and share music |
| `tell_joke` | Internal (LLM generates) | None | Personality-flavored humor |
| `interact_with` | Internal | None | Talk to another character |
| `react_to` | Internal | None | React to what another character did |
| `think` | Internal | None | Private thought bubble |
| `manipulate_desktop` | Internal | None | Knock things, claim spots, walk across screen |
| `check_mouse_activity` | System | None | Notice if user is idle/active, react accordingly |
| `remember` | SQLite | None | Save something to memory |
| `recall` | SQLite | None | Check what they've done recently |

### Tool Access by Interest

When a user picks interests during character creation, it maps to tools:

| Interest tag | Tools unlocked |
|---|---|
| Weather | `check_weather` |
| Food | `search_recipes` |
| Books | `search_books` |
| History | `today_in_history` |
| News | `search_news` |
| Trivia | `random_fact` |
| Music | `search_music` |
| Chaos | `manipulate_desktop` |
| Social | `interact_with`, `react_to` |

All characters always have: `check_time`, `think`, `remember`, `recall`, `check_mouse_activity`.

---

## Agent Loop

Each character runs an independent agent loop. The loop is the heartbeat of the app.

### Loop Cycle

```
Every [30-90 seconds, based on activity_level]:

1. OBSERVE
   - What time is it? What's the weather?
   - What did other characters do recently?
   - Is the user active or idle?
   - What have I done recently? (check memory to avoid repetition)

2. DECIDE (Ollama call)
   Prompt:
     "You are {name}, a {species}. {personality_description}.
      Your voice style: {voice_style}.
      
      Current context:
      - Time: 2:30pm, Tuesday
      - Weather: Snowy, -12C
      - Your mood: sleepy
      - Last 5 things you did: [...]
      - Other characters recently: [Bean knocked a book, Mochi shared a space fact]
      - User: idle for 15 minutes
      
      Available tools: [list with descriptions]
      
      What do you do next? Respond as JSON:
      {action, tool, input, thought, mood_update, movement}"

3. ACT
   - Execute the tool call (if any)
   - Update animation state (walk, sleep, react, talk)
   - Show speech/thought bubble
   - Move character on screen (if movement specified)

4. REMEMBER
   - Save action to character_actions
   - Update memory (mood, last_action, cooldowns)
   - Notify other characters (so they can react next cycle)
```

### Throttling & Resource Management

| Setting | Low activity | Medium | High | Unhinged |
|---|---|---|---|---|
| Loop interval | 90s | 60s | 30s | 15s |
| Ollama calls/hour | ~40 | ~60 | ~120 | ~240 |
| Idle behavior | Mostly sleeps | Occasional action | Regular actions | Never stops |
| Night mode (12am-7am) | Off | Rare actions | Some actions | ZOOMIES |

When Ollama is busy (processing another character's request), queue the call. Never run more than 1 Ollama call concurrently (most machines can't handle parallel inference on a 3B model).

### Inter-Character Interactions

Characters can see each other's recent actions and react:

- Bean knocks something → Mochi: "...why are you like this"
- Mochi shares a space fact → Grump: "nobody asked"
- Grump complains about mornings → Bean: *judges silently*

This happens naturally through the agent loop — each character sees what others did and the LLM decides whether to react based on personality.

---

## Desktop Behavior

### Movement System

Characters exist on a 2D plane overlaid on the desktop:

- **Walk zone:** Bottom 200px of the screen (adjustable). Characters walk left/right along this strip
- **Rest spots:** Characters can "sit" on the taskbar/dock area, on window title bars, or on screen edges
- **Interaction zones:** When two characters are within 100px, they're "near each other" and more likely to interact
- **Multi-monitor:** Characters can walk between monitors (stretch goal)

### Click Interactions

The overlay is click-through everywhere **except** on character hitboxes:

- **Click a character** → Small popup with:
  - Recent activity log (last 5 actions)
  - Current mood
  - "Talk to {name}" → Opens a mini chat window with that character
  - "Shoo" → Character walks away dramatically
- **Right-click a character** → Edit personality, change sprite, pause this character
- **Drag a character** → Pick them up and place them somewhere (they may walk back)

### Desktop Manipulation (Chaos Tool)

Characters with the Chaos interest can:

| Action | Visual effect |
|---|---|
| `knock_object` | A small virtual object (book, cup, plant) appears on screen edge, character pushes it off with a falling animation |
| `claim_spot` | Character sits on a specific screen location and refuses to move for a while |
| `walk_across` | Character walks across the full screen width, ignoring the normal walk zone |
| `paw_at_cursor` | Character follows and bats at the user's cursor for 10 seconds |
| `leave_gift` | A small item (dead mouse, fish, flower depending on species) appears near the character |

These happen infrequently (1-3 times per hour max) so they stay delightful, not annoying.

---

## Data Model (SQLite)

```sql
-- user's characters
CREATE TABLE characters (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  species TEXT NOT NULL,
  personality TEXT NOT NULL,
  voice_style TEXT,
  interests TEXT NOT NULL,         -- JSON array: ["food", "weather", "chaos"]
  activity_level TEXT DEFAULT 'medium',
  sprite_pack TEXT NOT NULL,       -- which animation set to use
  is_active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- persistent memory per character
CREATE TABLE character_memory (
  id TEXT PRIMARY KEY,
  character_id TEXT NOT NULL REFERENCES characters(id),
  key TEXT NOT NULL,
  value TEXT NOT NULL,             -- JSON
  updated_at TEXT DEFAULT (datetime('now')),
  UNIQUE(character_id, key)
);

-- action log
CREATE TABLE character_actions (
  id TEXT PRIMARY KEY,
  character_id TEXT NOT NULL REFERENCES characters(id),
  action_type TEXT NOT NULL,       -- 'tool_call' | 'chat' | 'thought' | 'movement' | 'interaction'
  tool_name TEXT,
  tool_input TEXT,                 -- JSON
  tool_output TEXT,                -- JSON
  content TEXT,                    -- human-readable: what the character said/did
  mood TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- conversations between characters
CREATE TABLE conversations (
  id TEXT PRIMARY KEY,
  from_character TEXT NOT NULL REFERENCES characters(id),
  to_character TEXT,               -- NULL = broadcast / thought
  message_type TEXT NOT NULL,      -- 'chat' | 'thought' | 'reaction'
  content TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

-- user preferences
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL               -- JSON
);
```

---

## UI Screens

### 1. Desktop Overlay (primary experience)
- Transparent, always-on-top, click-through
- Characters rendered with Rive/Lottie
- Speech bubbles (auto-dismiss after 8 seconds)
- Thought bubbles (smaller, translucent, auto-dismiss after 5 seconds)
- Virtual objects for chaos interactions

### 2. Control Panel (system tray → open)
- **My Characters** — list of all characters, create/edit/pause/delete
- **Activity Feed** — scrollable log of everything all characters have done today
- **Character Detail** — click a character to see their memory, mood history, stats
- **Settings:**
  - Ollama model selection (detect installed models)
  - Walk zone height
  - Global activity level
  - Mute bubbles / notifications
  - Launch at startup
  - Character size (small / medium / large)
  - Enable/disable specific tool categories

### 3. Character Creator
- Name field
- Species picker (visual grid of sprite previews)
- Personality textarea with placeholder examples
- Voice style textarea
- Interest tags (toggle chips)
- Activity level slider
- Preview: see the character do a walk cycle with a sample speech bubble

### 4. First-Run Experience
- "Welcome to Alive"
- Check if Ollama is installed → if not, link to install guide
- Check if a model is pulled → if not, offer to run `ollama pull llama3.2:3b`
- Pick a starter character or create your own
- Character appears on desktop → first action: introduces themselves

---

## Ollama Integration

### Detection & Setup

On launch:
1. Check if Ollama is running (`GET http://localhost:11434/api/tags`)
2. If not running → prompt: "Alive needs Ollama to give your characters a brain. [Install Ollama] [I already have it → Start Ollama]"
3. If running → check available models
4. If no suitable model → prompt: "Pulling a small model for your characters..." → run `ollama pull llama3.2:3b`
5. Let user pick from available models if they have preferences

### Model Requirements

- Must support JSON output
- Should be 1B-7B parameters (balance of speed and quality)
- Recommended: `llama3.2:3b`, `gemma2:2b`, `phi-3-mini`
- Advanced users can use larger models if they have the hardware

### Prompt Structure

```
System: You are {name}, a {species} living on someone's desktop.

Personality: {personality}
Voice: {voice_style}

Rules:
- Stay in character at all times
- Keep responses under 30 words (you're a desktop pet, not an essay writer)
- You can only use tools from your available list
- Don't repeat what you did in your last 3 actions
- React to other characters naturally based on your personality
- Your mood affects your behavior

Context:
- Time: {time}, {day_of_week}
- Weather: {weather} (user's location)
- Your mood: {current_mood}
- Your recent actions: {last_5_actions}
- Other characters nearby: {nearby_characters}
- Their recent actions: {their_recent_actions}
- User activity: {idle_time}

Available tools:
{tool_descriptions}

Respond with JSON:
{
  "thought": "your internal reasoning (shown as thought bubble or hidden)",
  "action": "tool_name" | "idle" | "move" | "sleep",
  "tool_input": {},
  "say": "what you say out loud (speech bubble)" | null,
  "mood": "your mood after this action",
  "movement": "walk_left" | "walk_right" | "sit" | "sleep_pose" | "none"
}
```

### Graceful Degradation

If Ollama is unavailable (crashed, not installed, model too slow):
- Characters fall back to scripted idle behavior (walk, sleep, sit)
- No speech/thought bubbles
- Status indicator in system tray: "Characters are napping (AI offline)"
- Retry connection every 60 seconds

---

## Memory System

### What Characters Remember

| Memory key | Example | Purpose |
|---|---|---|
| `mood` | `"sleepy"` | Carries across loops |
| `last_action` | `"shared a recipe"` | Prevents immediate repetition |
| `last_tool_{name}` | `"2024-01-15T14:30:00"` | Cooldown per tool |
| `recent_topics` | `["weather", "recipe", "space"]` | Topic variety |
| `relationship_{name}` | `"Bean is annoying but funny"` | How they feel about other characters |
| `favorite_things` | `["fish", "sunny days"]` | Emergent preferences from actions |
| `times_knocked_things` | `7` | Running counters for personality quirks |

### Memory Pruning

- Keep last 100 actions per character (older ones archived/deleted)
- Memory entries updated in place (upsert on character_id + key)
- Conversations older than 7 days pruned to save space
- Total DB size should stay under 50MB even with heavy use

---

## Performance Budget

| Resource | Target | Hard limit |
|---|---|---|
| RAM (app) | 50MB | 100MB |
| RAM (Ollama, 3B model) | ~2GB | User's choice of model |
| CPU (app, idle) | <1% | 3% |
| CPU (Ollama, during inference) | 30-50% spike for ~2s | Queued, never parallel |
| Disk (app + assets) | 100MB | 200MB |
| Disk (SQLite) | 10MB typical | 50MB max |
| Battery impact | Minimal | Must not be noticeable |

### Optimizations

- Pause agent loops when laptop is on battery (optional setting)
- Reduce animation framerate when characters are idle (30fps → 10fps)
- Batch Ollama calls: if 3 characters are due at the same time, stagger by 5 seconds
- Skip Ollama call if character is sleeping and it's nighttime — just continue sleeping
- Cache weather/time data — don't re-fetch on every loop, refresh every 10 minutes

---

## Build Phases

### Phase 1 — Walking Skeleton
- [ ] Tauri v2 app with transparent overlay window
- [ ] One character with pixel art sprite (idle + walk animations)
- [ ] Character walks along bottom of screen
- [ ] Ollama integration (detect, connect, single prompt/response)
- [ ] Basic agent loop: observe time → decide via Ollama → show speech bubble
- [ ] SQLite setup with characters + character_actions tables
- [ ] System tray icon with quit option
- [ ] Click character → show small info popup

### Phase 2 — Real Personality
- [ ] Character creator form (name, species, personality, interests)
- [ ] Full prompt engineering with personality injection
- [ ] Tool system: `check_weather`, `check_time`, `random_fact`
- [ ] Memory system (remember last actions, avoid repetition)
- [ ] Mood system (changes across the day, affected by weather/events)
- [ ] Thought bubbles vs speech bubbles
- [ ] Multiple animation states (idle, walk, sleep, talk, react)
- [ ] Save/load characters from SQLite

### Phase 3 — Social Characters
- [ ] Support 2-4 characters simultaneously
- [ ] Inter-character interactions (react to each other's actions)
- [ ] Relationship memory ("Bean is chaotic, I like them" / "Grump is boring")
- [ ] Proximity-based interaction (characters near each other talk more)
- [ ] `interact_with` and `react_to` tools
- [ ] Conversation log in control panel

### Phase 4 — Rich Tools
- [ ] `search_books`, `search_recipes`, `today_in_history`, `search_news`
- [ ] `manipulate_desktop` (knock, claim, walk across, paw cursor)
- [ ] `check_mouse_activity` (react to user idle/active)
- [ ] Tool results shown in speech bubbles ("found this cool recipe!")
- [ ] Activity feed in control panel

### Phase 5 — Polish & Ship
- [ ] 6 species sprite packs (cat, dog, fox, bird, dragon, robot) with all animation states
- [ ] Pre-built starter characters (Bean, Mochi, Grump, Pixel, Sage, Boba)
- [ ] First-run experience + Ollama setup wizard
- [ ] Settings panel (activity level, walk zone, size, startup, battery mode)
- [ ] Character export/import (share your character as a JSON file)
- [ ] Performance profiling and optimization pass
- [ ] Package for macOS, Windows, Linux
- [ ] Landing page / website

### Phase 6 — Growth (Post-Launch)
- [ ] Community sprite packs (users submit character art)
- [ ] Character sharing (import from URL or code)
- [ ] Plugin tools (users write custom tools in JS/Python)
- [ ] Cloud AI option (for users without Ollama — paid tier)
- [ ] Multi-monitor support
- [ ] Screen-aware behavior (characters react to active window — stretch goal)
- [ ] Mobile companion app (see what your pets are doing from your phone)

---

## Distribution

| Platform | Method |
|---|---|
| macOS | DMG on website + Homebrew cask |
| Windows | MSI/NSIS installer on website + winget |
| Linux | AppImage + Flatpak |
| All | Steam (best for discovery + auto-updates) |

### Pricing (Recommended)

- **Free tier:** 1 character, basic species (cat/dog), core tools
- **One-time purchase ($12-15):** Up to 4 characters, all species, all tools, all starter characters
- **Steam:** Single SKU at $12.99, all features included

No subscriptions. The AI runs locally. There's no ongoing cost to you, so there shouldn't be one to the user.

---

## Success Metrics

| Metric | Target (3 months post-launch) |
|---|---|
| Downloads | 10,000 |
| Daily active (app running) | 30% of installs |
| Week 2 retention | 40% |
| Characters created per user | 2.3 average |
| Avg daily runtime | 4+ hours |
| Steam review score | 85%+ positive |

The key retention question: **do people leave it running?** If average daily runtime is high, the product works. If people open it, play for 20 minutes, and close it — the characters aren't compelling enough.

---

## Design Principles

1. **Alive, not annoying** — characters should enhance your desktop, not interrupt your work. Bubbles dismiss themselves. Chaos is infrequent. There's always a mute button.
2. **Personal, not generic** — every user's desktop should feel different. The personality you write is the personality you get.
3. **Local-first** — no accounts, no cloud, no tracking. Your characters and their memories live on your machine.
4. **Charming over impressive** — a pixel art cat that says something funny beats a photorealistic avatar that says something mid.
5. **Emergent over scripted** — the magic is when characters do something you didn't expect. The LLM + personality + memory + tools should produce surprise.
