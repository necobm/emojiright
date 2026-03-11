# CLAUDE.md — Emoji Right

## Project
React 18 + Vite 5 SPA. No backend. AI calls are made directly from the browser.

## Dev Commands
```bash
npm run dev      # dev server on localhost:3000
npm run build    # production build
npm run lint     # ESLint
```

## Architecture

```
src/
  components/        # Each component has its own .jsx + .css file
    EmojiSuggester.jsx/css   # Main feature: input → emoji grid
    ThemeToggle.jsx/css      # Dark/light mode (persisted in localStorage)
    Toast.jsx/css            # Copy-to-clipboard feedback
  services/
    aiService.js     # AI provider abstraction — the only place that talks to AI APIs
  App.jsx / App.css
  main.jsx
  index.css          # Global styles + CSS custom properties for theming
```

## AI Service (`src/services/aiService.js`)
- **Single entry point:** `getEmojiSuggestions(phrase)` → `[{ emoji, reason }]`
- Provider selected via `VITE_AI_PROVIDER` env var: `'openai'` (default) or `'gemini'`
- OpenAI: `gpt-3.5-turbo`, returns 5 suggestions
- Gemini: `gemini-2.5-flash-lite`, returns 4 suggestions
- Both parse JSON and strip markdown code fences from AI responses
- **All new AI providers must be added here**, not in components

## Environment Variables
Copy `.env.example` → `.env` and fill in keys. Restart dev server after changes.
```
VITE_AI_PROVIDER=openai        # or 'gemini'
VITE_OPENAI_API_KEY=sk-...
VITE_GEMINI_API_KEY=...
```
Never commit `.env` (already gitignored).

## Code Conventions
- Functional components + hooks only; no class components
- State stays local unless shared — no global state library
- CSS co-located with each component (not CSS Modules, plain CSS files)
- Theme via CSS custom properties (`--bg-color`, `--text-color`, etc.) in `index.css`
- Mobile breakpoint: 768px
- Gradient: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`

## Key Constraints
- No tests exist yet — mock `aiService.js` when adding them
- No backend/proxy — API keys are exposed client-side (acceptable for local/demo use)
- Vite requires `VITE_` prefix for all env vars exposed to the browser
