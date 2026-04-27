# QuantEdge · AI Stock Advisor
### Your personal AI-powered stock tracker, deployed as an iPhone app

---

## What you'll need
- A free [Vercel account](https://vercel.com) (no credit card needed)
- A free [GitHub account](https://github.com) (to host the code)
- An [Anthropic API key](https://console.anthropic.com) (~$5–10/month for personal use)
- About 10 minutes

---

## Step 1 — Upload to GitHub

1. Go to [github.com](https://github.com) → **New repository**
2. Name it `quantedge` → click **Create repository**
3. Upload all the files from this zip (drag & drop the whole folder into the GitHub UI)
4. Click **Commit changes**

---

## Step 2 — Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Click **Import** next to your `quantedge` GitHub repo
3. Leave all settings as default → click **Deploy**
4. Wait ~60 seconds — your app is now live at a URL like `https://quantedge-xxx.vercel.app`

---

## Step 3 — Add your Anthropic API Key (secure, server-side)

1. In Vercel, go to your project → **Settings** → **Environment Variables**
2. Add:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** your key from [console.anthropic.com](https://console.anthropic.com)
3. Click **Save** → go to **Deployments** → click **Redeploy**

Your API key is now stored securely on the server — it will never be visible to anyone.

---

## Step 4 — Install on your iPhone

1. Open **Safari** on your iPhone (must be Safari, not Chrome)
2. Go to your Vercel URL (e.g. `https://quantedge-xxx.vercel.app`)
3. Tap the **Share** button (rectangle with arrow pointing up)
4. Scroll down → tap **"Add to Home Screen"**
5. Tap **Add** in the top right

✅ **QuantEdge is now on your iPhone home screen!**
It will open full-screen, with no browser bar — just like a native app.

---

## Running locally (optional, for development)

```bash
npm install
npm run dev
```

Then open http://localhost:5173

For local development, create a `.env` file:
```
ANTHROPIC_API_KEY=your_key_here
```

---

## Cost estimate

- **Vercel hosting:** Free (Hobby plan)
- **GitHub:** Free
- **Anthropic API:** ~$0.005 per stock analysis (Claude Sonnet)
  - Analyzing 5 stocks = ~$0.025 (less than 3 cents)
  - Daily use of 10 analyses = ~$0.05/day → ~$1.50/month

---

## Tips for daily use

- **Add your key stocks once** — they save automatically between sessions
- **Tap ↻ Refresh** each morning to get the latest AI analysis
- The app works offline for viewing saved analyses (no internet needed to view)
- New analyses require an internet connection

---

*Not financial advice. Always do your own research.*
