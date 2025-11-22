# Right Emoji - AI Agent Instructions

## Project Overview
Right Emoji is a React SPA that suggests contextually appropriate emojis for user phrases using AI providers (OpenAI, Gemini). The app sends a phrase like "Some ideas to work on" to an AI API and displays emoji suggestions (e.g., 💡) with explanations.

## Architecture & Structure

### Core Components
- **`src/App.jsx`** - Main application shell with header, footer, and layout
- **`src/components/EmojiSuggester.jsx`** - Primary feature component handling user input, API calls, and emoji display
- **`src/services/aiService.js`** - AI provider abstraction layer (currently stub implementation)

### Service Layer Pattern
All AI provider interactions go through `aiService.js` which:
- Exports `getEmojiSuggestions(phrase)` as the main interface
- Routes requests based on `VITE_AI_PROVIDER` env var ('openai' or 'gemini')
- Returns array format: `[{emoji: '💡', reason: 'Represents ideas'}]`
- Currently uses keyword-based mock suggestions via `getMockSuggestions()`

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

## Critical Implementation Tasks

### 🚨 PRIORITY: AI Provider Integration
The app currently uses mock data. To enable real AI suggestions:

#### OpenAI Integration (`src/services/aiService.js`)
Uncomment and adapt the API call structure in `getOpenAISuggestions()`:
```javascript
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${OPENAI_API_KEY}`
  },
  body: JSON.stringify({
    model: 'gpt-3.5-turbo',
    messages: [{
      role: 'system',
      content: 'You are an emoji suggestion assistant. Respond with JSON only.'
    }, {
      role: 'user',
      content: `Given the phrase: "${phrase}", suggest 5 relevant emojis. Return ONLY a JSON array with format: [{"emoji": "💡", "reason": "Represents ideas"}]`
    }],
    temperature: 0.7
  })
})
```

**Important**: 
- Parse the JSON response from `data.choices[0].message.content`
- Handle rate limits and API errors gracefully
- Consider streaming responses for better UX

#### Gemini Integration (`src/services/aiService.js`)
Uncomment and adapt the API call structure in `getGeminiSuggestions()`:
```javascript
const response = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `Given the phrase: "${phrase}", suggest 5 relevant emojis. Return ONLY a JSON array with format: [{"emoji": "💡", "reason": "Represents ideas"}]`
        }]
      }]
    })
  }
)
```

**Important**:
- Parse the JSON from `data.candidates[0].content.parts[0].text`
- Handle content safety filters and quota limits
- Extract JSON from markdown code blocks if needed

### Prompt Engineering Guidelines
When implementing AI calls, optimize the prompt:
- Request exactly 5 emoji suggestions
- Require JSON-only responses (no markdown)
- Include example format in prompt
- Set appropriate temperature (0.7 recommended)
- Handle cases where AI returns text instead of JSON

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
- Dark mode by default with light mode media query

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
│   │   └── EmojiSuggester.css
│   ├── services/          # External API integrations
│   │   └── aiService.js   # 🚨 Needs AI provider implementation
│   ├── App.jsx            # Main app component
│   ├── App.css
│   ├── main.jsx           # React entry point
│   └── index.css          # Global styles
├── public/                # Static assets
├── .env                   # Local environment config (gitignored)
├── .env.example           # Template for environment variables
└── vite.config.js         # Vite bundler config
```

## Next Steps for AI Agents
1. **Implement OpenAI API integration** in `aiService.js` - uncomment and test the API call structure
2. **Implement Gemini API integration** in `aiService.js` - uncomment and test the API call structure
3. **Add response parsing** - handle both providers' unique JSON structures
4. **Error handling** - improve user messages for different failure scenarios
5. **Add loading indicators** - enhance UX during API calls
6. **Toast notifications** - confirm when emoji copied to clipboard
7. **Settings panel** - allow runtime provider switching without .env edits
