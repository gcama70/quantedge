// api/analyze.js — Vercel Serverless Function
// Your ANTHROPIC_API_KEY is stored securely in Vercel environment variables.
// It is NEVER sent to the browser.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { ticker } = req.body;
  if (!ticker) return res.status(400).json({ error: "Missing ticker" });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "API key not configured" });

  const prompt = `You are a professional financial analyst specializing in technology stocks. Analyze the stock ${ticker} based on the most current information available using web search.

Please provide a comprehensive analysis including:
1. Current price and recent performance (% change today, week, month if available)
2. Key financial metrics (P/E ratio, market cap, revenue growth if available)
3. Recent news and catalysts (last 1-2 weeks)
4. Analyst sentiment and consensus
5. Technical outlook (support/resistance, momentum)
6. Your final verdict: BUY, HOLD, or SELL
7. Confidence level: HIGH, MEDIUM, or LOW
8. 3-5 key signals (bullish or bearish)

Respond ONLY with a valid JSON object — no markdown, no backticks, no preamble — in this exact structure:
{
  "ticker": "${ticker}",
  "companyName": "Full company name",
  "currentPrice": "$XXX.XX or N/A",
  "priceChange": "+/-X.XX%",
  "weekChange": "+/-X.XX%",
  "marketCap": "$XXB or N/A",
  "peRatio": "XX.X or N/A",
  "verdict": "BUY",
  "confidence": "HIGH",
  "summary": "2-3 sentence overall analysis",
  "signals": [
    {"type": "positive", "text": "signal description"},
    {"type": "negative", "text": "signal description"},
    {"type": "neutral", "text": "signal description"}
  ],
  "catalysts": "Key near-term catalysts to watch"
}`;

  try {
    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        tools: [{ type: "web_search_20250305", name: "web_search" }],
        messages: [{ role: "user", content: prompt }]
      })
    });

    if (!anthropicRes.ok) {
      const err = await anthropicRes.text();
      return res.status(502).json({ error: `Anthropic API error: ${err}` });
    }

    const data = await anthropicRes.json();
    const textBlock = data.content.find(b => b.type === "text");
    if (!textBlock) return res.status(502).json({ error: "No text in API response" });

    let raw = textBlock.text.trim().replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(raw);
    return res.status(200).json(parsed);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
