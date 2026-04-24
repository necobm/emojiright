# 🚀 Quick Start: Deploy to Cloudflare Workers

## Step 1: Install Wrangler CLI

```bash
npm install -g wrangler
```

## Step 2: Login to Cloudflare

```bash
wrangler login
```

This opens your browser for authentication.

## Step 3: Deploy the Worker

```bash
cd cloudflare-worker
wrangler deploy
```

You'll get a URL like: `https://right-emoji-api.YOUR-SUBDOMAIN.workers.dev`

## Step 4: Add API Keys as Secrets

```bash
# Still in cloudflare-worker directory
wrangler secret put OPENAI_API_KEY
# Paste your OpenAI key when prompted

wrangler secret put GEMINI_API_KEY
# Paste your Gemini key when prompted
```

## Step 5: Update Frontend Configuration

Back in the main project directory, update your `.env`:

```bash
cd ..
cp .env.example .env.local
```

Edit `.env.local`:
```env
VITE_AI_PROVIDER=gemini
VITE_API_URL=https://right-emoji-api.YOUR-SUBDOMAIN.workers.dev
```

Replace `YOUR-SUBDOMAIN` with your actual Cloudflare Workers subdomain from Step 3.

## Step 6: Test Locally

```bash
# Terminal 1: Start worker locally
cd cloudflare-worker
wrangler dev

# Terminal 2: Start frontend
cd ..
npm run dev
```

Visit `http://localhost:3000` and test!

## Step 7: Build for Production

```bash
npm run build
```

Your `dist/` folder now has **NO API keys** in the code! 🎉

## Step 8: Deploy Frontend

Upload the `dist/` folder contents to your web server.

## Security Tips

1. **Update CORS**: In `worker.js`, change:
   ```javascript
   'Access-Control-Allow-Origin': '*'
   ```
   to:
   ```javascript
   'Access-Control-Allow-Origin': 'https://yourdomain.com'
   ```

2. **Monitor Usage**: Check Cloudflare dashboard for request counts

3. **Set Spending Limits**: In OpenAI/Gemini dashboards

## Troubleshooting

**Worker not responding?**
- Check worker logs: `wrangler tail`
- Verify secrets are set: Run secret put commands again

**CORS errors?**
- Make sure you updated the origin in `worker.js`
- Clear browser cache

**API errors?**
- Check you have credits in OpenAI/Gemini accounts
- Verify API keys are correct in Cloudflare secrets

## Cost

- Cloudflare: **FREE** (100k requests/day)
- OpenAI: ~$0.002 per emoji request
- Gemini: **FREE** (15 requests/min)
