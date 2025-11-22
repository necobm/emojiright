# Right Emoji ✨

AI-powered emoji suggestion app that helps you find the perfect emoji for any phrase.

## Features

- 🎯 Context-aware emoji suggestions
- 🤖 Multiple AI provider support (OpenAI, Google Gemini)
- 📋 One-click emoji copying
- 🎨 Modern, responsive UI
- ⚡ Built with React + Vite

## Quick Start

### Prerequisites

- Node.js 16+ and npm

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
```

Edit `.env` and add your API keys:
```env
VITE_AI_PROVIDER=openai
VITE_OPENAI_API_KEY=sk-your-key-here
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Enter a phrase (e.g., "Some ideas to work on")
2. Click "Get Emojis"
3. Browse AI-generated emoji suggestions
4. Click any emoji to copy it to your clipboard

## Configuration

The app supports two AI providers:

### OpenAI
```env
VITE_AI_PROVIDER=openai
VITE_OPENAI_API_KEY=sk-...
```

### Google Gemini
```env
VITE_AI_PROVIDER=gemini
VITE_GEMINI_API_KEY=...
```

## Project Structure

```
right-emoji/
├── src/
│   ├── components/
│   │   ├── EmojiSuggester.jsx    # Main emoji input & display
│   │   └── EmojiSuggester.css
│   ├── services/
│   │   └── aiService.js          # AI provider abstraction
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── public/
│   └── emoji.svg
├── .env.example
└── package.json
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Implement AI provider integration (see instructions)
4. Submit a pull request

## License

MIT

## Next Steps

- [ ] Add toast notifications for copy actions
- [ ] Add settings panel for runtime provider switching
- [ ] Add tests for components and services
