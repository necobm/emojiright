# Right Emoji - AI Agent Instructions

## Project Overview
Right Emoji is a React SPA that suggests contextually appropriate emojis for user phrases using AI providers (OpenAI, Gemini). The app sends a phrase like "Some ideas to work on" to an AI API and displays emoji suggestions (e.g., 💡) with explanations.

## Architecture & Structure

### Core Components
- **`src/App.jsx`** - Main application shell with header, footer, and layout
- **`src/components/EmojiSuggester.jsx`** - Primary feature component handling user input, API calls, and emoji display
- **`src/components/ThemeToggle.jsx`** - Light/dark theme switcher with localStorage persistence
- **`src/components/Toast.jsx`** - Notification system for user feedback (copy confirmations)
- **`src/services/aiService.js`** - AI provider abstraction layer with OpenAI and Gemini implementations

### Service Layer Pattern
All AI provider interactions go through `aiService.js` which:
- Exports `getEmojiSuggestions(phrase)` as the main interface
- Routes requests based on `VITE_AI_PROVIDER` env var ('openai' or 'gemini')
- Returns array format: `[{emoji: '💡', reason: 'Represents ideas'}]`
- **Fully implemented** with OpenAI GPT-3.5-turbo and Google Gemini integration
- Handles JSON parsing, markdown cleanup, and error scenarios

### Data Flow
1. User enters phrase → `EmojiSuggester` component
2. `handleSubmit()` calls `getEmojiSuggestions(phrase)` 
3. Service routes to provider function (OpenAI/Gemini)
4. Response parsed and displayed in suggestion cards
5. Click emoji → copy to clipboard

## Development Workflow

### Setup & Run
```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your API keys
# VITE_AI_PROVIDER=openai
# VITE_OPENAI_API_KEY=sk-...

# Start dev server (opens at localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Key Commands
- `npm run lint` - ESLint checks for code quality

## Implemented Features

### ✅ AI Provider Integration
Both OpenAI and Gemini are fully integrated with production-ready implementations:

#### OpenAI Integration (`src/services/aiService.js`)
- Uses GPT-3.5-turbo model for cost-effectiveness
- Full error handling for rate limits, invalid keys, network errors
- JSON parsing with markdown block removal
- Response validation and filtering
- Returns 5 emoji suggestions per request

#### Gemini Integration (`src/services/aiService.js`)
- Uses gemini-2.5-flash-lite model (free tier available)
- Safety filter handling with clear error messages
- JSON parsing with markdown block removal  
- Response validation and filtering
- Returns 4 emoji suggestions per request

### Prompt Engineering (Implemented)
The AI prompts are optimized for consistent JSON responses:
### Prompt Engineering (Implemented)
The AI prompts are optimized for consistent JSON responses:
- Request exact number of emoji suggestions (5 for OpenAI, 4 for Gemini)
- Require JSON-only responses with explicit "no markdown" instruction
- Include example format in every prompt
- Temperature set to 0.7 for balanced creativity
- Robust handling when AI returns markdown-wrapped JSON

## Code Conventions

### Component Patterns
- Use functional components with hooks
- Keep state local unless shared across components
- Follow the single responsibility principle (separate UI from logic)
- Component files include their own CSS (e.g., `EmojiSuggester.jsx` + `EmojiSuggester.css`)

### State Management
- Local state with `useState` for component-specific data
- No global state library needed (simple app)
- Loading states (`loading`) for async operations
- Error states (`error`) for user feedback

### Styling Approach
- CSS Modules pattern (component-specific stylesheets)
- Gradient theme: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- Responsive design with mobile breakpoint at 768px
- **Light/Dark theme support** via CSS custom properties (--bg-color, --text-color, etc.)
- Theme state persisted in localStorage
- Smooth transitions between theme changes

### Error Handling
- Service layer throws descriptive errors
- UI catches and displays in `error-message` div
- Validate API keys before making requests
- Log errors to console for debugging

## Environment Configuration

### Required Variables
Create `.env` file from `.env.example`:
```bash
VITE_AI_PROVIDER=openai          # or 'gemini'
VITE_OPENAI_API_KEY=sk-...       # OpenAI API key
VITE_GEMINI_API_KEY=...          # Google AI API key
```

**Security Note**: Never commit `.env` to version control (already in `.gitignore`)

## Testing Strategy (Future)
When adding tests:
- Mock `aiService.js` for component tests
- Test API error scenarios (rate limits, invalid keys, network errors)
- Validate emoji suggestion format
- Test clipboard functionality

## Common Issues & Solutions

### "API key not configured" Error
- Ensure `.env` file exists and has correct key format
- Restart dev server after `.env` changes (Vite requirement)
- Verify key doesn't contain spaces or quotes

### Empty Suggestions Array
- Check browser console for API errors
- Validate AI provider response format matches expected structure
- Ensure AI returns valid JSON (not markdown-wrapped)

### CORS Errors
- Should not occur (APIs support CORS)
- If issues arise, consider backend proxy for API calls

## File Organization
```
right-emoji/
├── src/
│   ├── components/        # React components with dedicated CSS
│   │   ├── EmojiSuggester.jsx
│   │   ├── EmojiSuggester.css
│   │   ├── ThemeToggle.jsx
│   │   ├── ThemeToggle.css
│   │   ├── Toast.jsx
│   │   └── Toast.css
│   ├── services/          # External API integrations
│   │   └── aiService.js   # ✅ OpenAI & Gemini implemented
│   ├── App.jsx            # Main app component
│   ├── App.css
│   ├── main.jsx           # React entry point
│   └── index.css          # Global styles with theme support
├── public/                # Static assets
├── .env                   # Local environment config (gitignored)
├── .env.example           # Template for environment variables
└── vite.config.js         # Vite bundler config
```

## Next Steps for AI Agents
1. ✅ **Implement OpenAI API integration** - COMPLETED with full error handling and JSON parsing
2. ✅ **Implement Gemini API integration** - COMPLETED with safety filter handling  
3. ✅ **Add response parsing** - COMPLETED for both providers with markdown removal
4. ✅ **Error handling** - COMPLETED with descriptive user messages
5. ✅ **Add loading indicators** - COMPLETED (spinner in submit button)
6. ✅ **Toast notifications** - COMPLETED (shows when emoji copied to clipboard)

