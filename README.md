# Right Emoji ✨

AI-powered emoji suggestion app that helps you find the perfect emoji for any phrase.

## Features

- 🎯 Context-aware emoji suggestions powered by AI
- 🤖 Multiple AI provider support (OpenAI GPT-3.5, Google Gemini)
- 🔒 Secure backend via Cloudflare Workers (API keys never exposed)
- 📋 One-click emoji copying with toast notifications
- 🌓 Light/Dark theme support
- 🎨 Modern, responsive UI
- ⚡ Built with React + Vite

## Architecture

```
User → React Frontend → Cloudflare Worker → OpenAI/Gemini APIs
                        (API keys secure)
```

The app uses a Cloudflare Worker backend to securely proxy AI requests, keeping API keys server-side and never exposing them in the frontend bundle.

## Quick Start

### Prerequisites

- Node.js 16+ and npm
- Cloudflare account (free tier works!)

### 1. Deploy Cloudflare Worker (Backend)

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

```bash
# Install Wrangler CLI
npm install -g wrangler

# Login and deploy
cd cloudflare-worker
wrangler login
wrangler deploy

# Add your API keys as encrypted secrets
wrangler secret put OPENAI_API_KEY
wrangler secret put GEMINI_API_KEY
```

You'll get a worker URL like: `https://right-emoji-api.YOUR-SUBDOMAIN.workers.dev`

### 2. Setup Frontend

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
```

Edit `.env.local` with your worker URL:
```env
VITE_AI_PROVIDER=gemini
VITE_API_URL=https://right-emoji-api.YOUR-SUBDOMAIN.workers.dev
```

### 3. Run Development Server

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

### AI Provider Selection

Choose between OpenAI or Gemini in `.env.local`:

```env
VITE_AI_PROVIDER=gemini  # or 'openai'
VITE_API_URL=https://your-worker.workers.dev
```

### API Keys (Cloudflare Worker Secrets)

API keys are stored as encrypted secrets in Cloudflare Workers, never in your code:

```bash
cd cloudflare-worker
wrangler secret put OPENAI_API_KEY   # For OpenAI
wrangler secret put GEMINI_API_KEY   # For Gemini (FREE tier!)
```

### Cost

- **Cloudflare Worker**: FREE (100k requests/day)
- **OpenAI GPT-3.5**: ~$0.002 per request
- **Google Gemini**: FREE (15 requests/minute)

## Deployment

### Production Build

```bash
npm run build
```

The `dist/` folder contains your static site with **NO API keys** exposed! 🔒

### Deploy Frontend

Upload `dist/` contents to any static hosting:
- Netlify
- Vercel
- GitHub Pages
- Your own server

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete instructions.

## Project Structure

```
right-emoji/
├── cloudflare-worker/         # Backend API (Cloudflare Worker)
│   ├── worker.js             # Worker code with AI proxy logic
│   ├── wrangler.toml         # Cloudflare config
│   └── README.md             # Worker deployment guide
├── src/                       # Frontend React app
│   ├── components/
│   │   ├── EmojiSuggester.jsx
│   │   ├── ThemeToggle.jsx
│   │   └── Toast.jsx
│   ├── services/
│   │   └── aiService.js      # Calls Cloudflare Worker
│   ├── App.jsx
│   └── main.jsx
├── DEPLOYMENT.md              # Detailed deployment guide
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

## Implemented Features

- ✅ OpenAI & Gemini AI integration
- ✅ Secure backend with Cloudflare Workers
- ✅ Toast notifications for copy feedback
- ✅ Light/Dark theme switcher
- ✅ Responsive design
- ✅ Error handling & loading states

## Future Enhancements

- [ ] Settings panel for runtime provider switching
- [ ] Rate limiting on worker
- [ ] Request caching for repeated phrases
- [ ] Emoji history/favorites
- [ ] Tests for components and services
