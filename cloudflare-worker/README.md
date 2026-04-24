# Cloudflare Worker Deployment Guide

This directory contains the Cloudflare Worker that securely handles API requests to OpenAI and Gemini.

## Setup Steps

### 1. Install Wrangler CLI

```bash
npm install -g wrangler
```

### 2. Login to Cloudflare

```bash
wrangler login
```

### 3. Create wrangler.toml Configuration

Create `wrangler.toml` in this directory:

```toml
name = "right-emoji-api"
main = "worker.js"
compatibility_date = "2025-11-22"

[vars]
# Public variables (optional)

# Add your API keys as secrets (not in this file!)
# Use: wrangler secret put OPENAI_API_KEY
# Use: wrangler secret put GEMINI_API_KEY
```

### 4. Add API Keys as Secrets

**Never commit API keys!** Store them as encrypted secrets:

```bash
# In the cloudflare-worker directory
wrangler secret put OPENAI_API_KEY
# Paste your OpenAI key when prompted

wrangler secret put GEMINI_API_KEY
# Paste your Gemini key when prompted
```

### 5. Deploy the Worker

```bash
wrangler deploy
```

This will output your worker URL, something like:
```
https://right-emoji-api.YOUR-SUBDOMAIN.workers.dev
```

### 6. Update Frontend Configuration

Copy the worker URL and update your frontend's `.env.local` or build configuration:

```env
VITE_API_URL=https://right-emoji-api.YOUR-SUBDOMAIN.workers.dev
```

### 7. Test the Worker

```bash
curl -X POST https://right-emoji-api.YOUR-SUBDOMAIN.workers.dev \
  -H "Content-Type: application/json" \
  -d '{"phrase": "test idea", "provider": "gemini"}'
```

## Security Notes

1. **CORS Configuration**: Update `Access-Control-Allow-Origin` in `worker.js` to your domain:
   ```javascript
   'Access-Control-Allow-Origin': 'https://yourdomain.com'
   ```

2. **Rate Limiting**: Consider adding rate limiting to prevent abuse

3. **Secrets**: API keys are stored as encrypted secrets, never in code

## Cloudflare Dashboard

View logs and analytics:
https://dash.cloudflare.com/workers

## Local Development

Test locally before deploying:

```bash
wrangler dev
```

This starts a local server at `http://localhost:8787`

## Update Deployment

After making changes:

```bash
wrangler deploy
```

## Free Tier Limits

- 100,000 requests/day
- 10ms CPU time per request
- Plenty for personal projects!
