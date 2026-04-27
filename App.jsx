import { useState, useCallback, useEffect } from "react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { height: 100%; }
  body {
    background: #050a0e;
    color: #c8d8e4;
    font-family: 'IBM Plex Sans', sans-serif;
    -webkit-font-smoothing: antialiased;
    overscroll-behavior: none;
  }
  :root {
    --bg: #050a0e;
    --surface: #0b1520;
    --surface2: #101e2e;
    --border: #1a2f45;
    --accent: #00c4ff;
    --green: #00e676;
    --red: #ff3d5a;
    --amber: #ffb300;
    --text: #c8d8e4;
    --muted: #4a6478;
    --mono: 'IBM Plex Mono', monospace;
    --safe-top: env(safe-area-inset-top, 0px);
    --safe-bottom: env(safe-area-inset-bottom, 0px);
  }
  .app {
    min-height: 100dvh;
    background: var(--bg);
    background-image: radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0,196,255,0.06) 0%, transparent 60%);
    padding-bottom: calc(24px + var(--safe-bottom));
  }
  .header {
    border-bottom: 1px solid var(--border);
    padding: calc(var(--safe-top) + 14px) 20px 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(11,21,32,0.92);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    position: sticky;
    top: 0;
    z-index: 10;
  }
  .logo { display: flex; align-items: center; gap: 10px; }
  .logo-icon {
    width: 34px; height: 34px;
    background: linear-gradient(135deg, #00c4ff, #0052cc);
    border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    font-size: 17px; font-weight: 700; color: white;
    font-family: var(--mono);
  }
  .logo-text { font-family: var(--mono); font-size: 15px; font-weight: 600; color: var(--accent); letter-spacing: 0.05em; }
  .logo-sub { font-size: 10px; color: var(--muted); letter-spacing: 0.1em; text-transform: uppercase; }
  .live-dot { display: flex; align-items: center; gap: 5px; font-size: 10px; color: var(--green); font-family: var(--mono); }
  .live-dot::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: var(--green); animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
  .main { max-width: 680px; margin: 0 auto; padding: 20px 16px; }
  .add-panel { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 18px; margin-bottom: 24px; }
  .add-panel h2 { font-size: 10px; font-family: var(--mono); color: var(--muted); letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 12px; }
  .add-row { display: flex; gap: 8px; }
  .ticker-input {
    flex: 1;
    background: var(--bg); border: 1px solid var(--border); border-radius: 10px;
    padding: 12px 14px; color: var(--text);
    font-family: var(--mono); font-size: 16px; font-weight: 600;
    letter-spacing: 0.1em; text-transform: uppercase; outline: none;
    transition: border-color 0.2s;
    -webkit-appearance: none;
  }
  .ticker-input:focus { border-color: var(--accent); }
  .ticker-input::placeholder { color: var(--muted); font-weight: 400; }
  .btn-primary {
    padding: 12px 18px; border-radius: 10px; border: none; cursor: pointer;
    font-family: var(--mono); font-size: 12px; font-weight: 600;
    letter-spacing: 0.08em; text-transform: uppercase;
    background: var(--accent); color: #050a0e;
    transition: all 0.15s; white-space: nowrap;
  }
  .btn-primary:active { transform: scale(0.97); }
  .btn-primary:disabled { opacity: 0.35; cursor: not-allowed; }
  .quick-add { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 12px; }
  .quick-chip {
    padding: 5px 10px; background: transparent; border: 1px solid var(--border);
    border-radius: 20px; color: var(--muted); font-family: var(--mono); font-size: 11px;
    cursor: pointer; transition: all 0.15s;
  }
  .quick-chip:active { border-color: var(--accent); color: var(--accent); }
  .quick-chip:disabled { opacity: 0.3; cursor: not-allowed; }
  .stocks-grid { display: grid; gap: 16px; }
  .stock-card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; overflow: hidden; transition: border-color 0.2s; }
  .stock-card.loading { border-color: rgba(0,196,255,0.2); }
  .card-header { padding: 16px 18px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border); background: var(--surface2); }
  .ticker-badge { display: flex; align-items: center; gap: 10px; }
  .ticker-name { font-family: var(--mono); font-size: 18px; font-weight: 600; color: white; letter-spacing: 0.05em; }
  .company-name { font-size: 11px; color: var(--muted); margin-top: 2px; }
  .card-actions { display: flex; align-items: center; gap: 8px; }
  .btn-analyze {
    padding: 7px 13px; background: rgba(0,196,255,0.1); border: 1px solid rgba(0,196,255,0.3);
    border-radius: 8px; color: var(--accent); font-family: var(--mono); font-size: 11px;
    font-weight: 600; cursor: pointer; letter-spacing: 0.06em; text-transform: uppercase; transition: all 0.15s;
  }
  .btn-analyze:active { background: rgba(0,196,255,0.2); }
  .btn-analyze:disabled { opacity: 0.35; cursor: not-allowed; }
  .btn-remove {
    width: 30px; height: 30px; background: transparent; border: 1px solid var(--border);
    border-radius: 8px; color: var(--muted); cursor: pointer;
    display: flex; align-items: center; justify-content: center; font-size: 16px; transition: all 0.15s;
  }
  .btn-remove:active { border-color: var(--red); color: var(--red); }
  .card-body { padding: 18px; }
  .verdict-banner { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-radius: 10px; margin-bottom: 16px; }
  .verdict-banner.BUY { background: rgba(0,230,118,0.08); border: 1px solid rgba(0,230,118,0.25); }
  .verdict-banner.SELL { background: rgba(255,61,90,0.08); border: 1px solid rgba(255,61,90,0.25); }
  .verdict-banner.HOLD { background: rgba(255,179,0,0.08); border: 1px solid rgba(255,179,0,0.25); }
  .verdict-pill { padding: 5px 14px; border-radius: 20px; font-family: var(--mono); font-size: 12px; font-weight: 600; letter-spacing: 0.12em; flex-shrink: 0; }
  .verdict-pill.BUY { background: var(--green); color: #050a0e; }
  .verdict-pill.SELL { background: var(--red); color: white; }
  .verdict-pill.HOLD { background: var(--amber); color: #050a0e; }
  .verdict-confidence { font-size: 11px; color: var(--muted); font-family: var(--mono); }
  .verdict-confidence span { color: var(--text); font-weight: 500; }
  .price-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 16px; }
  .price-stat { background: var(--bg); border: 1px solid var(--border); border-radius: 10px; padding: 10px 12px; }
  .price-stat-label { font-size: 9px; color: var(--muted); font-family: var(--mono); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 4px; }
  .price-stat-value { font-family: var(--mono); font-size: 14px; font-weight: 600; color: white; }
  .price-stat-value.positive { color: var(--green); }
  .price-stat-value.negative { color: var(--red); }
  .price-row-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-bottom: 16px; }
  .section-title { font-size: 9px; color: var(--muted); font-family: var(--mono); letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 8px; margin-top: 14px; }
  .analysis-text { font-size: 13px; line-height: 1.7; color: #8fafc4; }
  .signals-list { display: flex; flex-direction: column; gap: 6px; }
  .signal-item { display: flex; align-items: flex-start; gap: 8px; font-size: 13px; color: #8fafc4; line-height: 1.5; }
  .signal-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; margin-top: 6px; }
  .signal-dot.positive { background: var(--green); }
  .signal-dot.negative { background: var(--red); }
  .signal-dot.neutral { background: var(--muted); }
  .loading-state { padding: 28px; text-align: center; color: var(--muted); font-family: var(--mono); font-size: 12px; }
  .loading-bar { width: 100%; height: 2px; background: var(--border); border-radius: 2px; overflow: hidden; margin-bottom: 12px; }
  .loading-bar-fill { height: 100%; background: linear-gradient(90deg, transparent, var(--accent), transparent); animation: loading 1.5s ease-in-out infinite; width: 60%; }
  @keyframes loading { 0% { transform: translateX(-100%); } 100% { transform: translateX(250%); } }
  .empty-state { text-align: center; padding: 60px 20px; color: var(--muted); font-family: var(--mono); font-size: 13px; line-height: 2; }
  .empty-icon { font-size: 40px; margin-bottom: 16px; opacity: 0.25; }
  .updated-at { font-size: 10px; color: var(--muted); font-family: var(--mono); margin-top: 12px; text-align: right; }
  .error-msg { padding: 12px 16px; background: rgba(255,61,90,0.08); border: 1px solid rgba(255,61,90,0.2); border-radius: 10px; font-size: 13px; color: #ff8fa0; font-family: var(--mono); }
  .disclaimer { margin-top: 32px; padding: 14px 16px; border: 1px solid var(--border); border-radius: 10px; font-size: 11px; color: var(--muted); line-height: 1.7; font-family: var(--mono); }
  .disclaimer strong { color: #4a6478; }
  .section-divider { display: flex; align-items: center; gap: 10px; margin: 20px 0 16px; }
  .section-divider-line { flex: 1; height: 1px; background: var(--border); }
  .section-divider-text { font-size: 10px; color: var(--muted); font-family: var(--mono); letter-spacing: 0.1em; }
`;

const POPULAR = ["AAPL", "NVDA", "MSFT", "TSLA", "GOOGL", "META", "AMZN", "AMD"];
const STORAGE_KEY = "quantedge_watchlist_v2";

function loadWatchlist() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveWatchlist(stocks) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stocks));
  } catch {}
}

async function fetchAnalysis(ticker) {
  const res = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ticker })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export default function App() {
  const [stocks, setStocks] = useState(() => loadWatchlist());
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState({});
  const [errors, setErrors] = useState({});

  // Persist watchlist whenever it changes
  useEffect(() => {
    saveWatchlist(stocks);
  }, [stocks]);

  const addStock = useCallback(async (ticker) => {
    const t = ticker.trim().toUpperCase();
    if (!t || stocks.some(s => s.ticker === t)) return;
    setInput("");

    const placeholder = { ticker: t, companyName: "", _loading: true };
    setStocks(prev => {
      const next = [placeholder, ...prev];
      saveWatchlist(next);
      return next;
    });
    setLoading(prev => ({ ...prev, [t]: true }));
    setErrors(prev => { const e = { ...prev }; delete e[t]; return e; });

    try {
      const result = await fetchAnalysis(t);
      result.updatedAt = new Date().toLocaleString();
      setStocks(prev => {
        const next = prev.map(s => s.ticker === t ? result : s);
        saveWatchlist(next);
        return next;
      });
    } catch (e) {
      setErrors(prev => ({ ...prev, [t]: e.message }));
      setStocks(prev => {
        const next = prev.map(s => s.ticker === t ? { ...s, _loading: false, _error: true } : s);
        saveWatchlist(next);
        return next;
      });
    } finally {
      setLoading(prev => { const l = { ...prev }; delete l[t]; return l; });
    }
  }, [stocks]);

  const removeStock = useCallback((ticker) => {
    setStocks(prev => {
      const next = prev.filter(s => s.ticker !== ticker);
      saveWatchlist(next);
      return next;
    });
    setErrors(prev => { const e = { ...prev }; delete e[ticker]; return e; });
  }, []);

  const reanalyze = useCallback(async (ticker) => {
    setStocks(prev => prev.map(s => s.ticker === ticker ? { ...s, _loading: true } : s));
    setLoading(prev => ({ ...prev, [ticker]: true }));
    setErrors(prev => { const e = { ...prev }; delete e[ticker]; return e; });
    try {
      const result = await fetchAnalysis(ticker);
      result.updatedAt = new Date().toLocaleString();
      setStocks(prev => {
        const next = prev.map(s => s.ticker === ticker ? result : s);
        saveWatchlist(next);
        return next;
      });
    } catch (e) {
      setErrors(prev => ({ ...prev, [ticker]: e.message }));
      setStocks(prev => prev.map(s => s.ticker === ticker ? { ...s, _loading: false } : s));
    } finally {
      setLoading(prev => { const l = { ...prev }; delete l[ticker]; return l; });
    }
  }, []);

  const isLoading = (t) => !!loading[t];

  return (
    <>
      <style>{STYLES}</style>
      <div className="app">
        <header className="header">
          <div className="logo">
            <div className="logo-icon">Q</div>
            <div>
              <div className="logo-text">QUANTEDGE</div>
              <div className="logo-sub">AI Stock Advisor</div>
            </div>
          </div>
          <div className="live-dot">LIVE</div>
        </header>

        <main className="main">
          <div className="add-panel">
            <h2>Add to Watchlist</h2>
            <div className="add-row">
              <input
                className="ticker-input"
                placeholder="Ticker (e.g. AAPL)"
                value={input}
                onChange={e => setInput(e.target.value.toUpperCase())}
                onKeyDown={e => e.key === "Enter" && addStock(input)}
                maxLength={8}
                autoCapitalize="characters"
                autoCorrect="off"
                spellCheck={false}
              />
              <button
                className="btn-primary"
                onClick={() => addStock(input)}
                disabled={!input.trim()}
              >
                + Analyze
              </button>
            </div>
            <div className="quick-add">
              {POPULAR.map(t => (
                <button
                  key={t}
                  className="quick-chip"
                  onClick={() => addStock(t)}
                  disabled={stocks.some(s => s.ticker === t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {stocks.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">📈</div>
              <div>Your watchlist is empty.</div>
              <div>Add a ticker above to get an AI-powered analysis.</div>
            </div>
          )}

          <div className="stocks-grid">
            {stocks.map(stock => (
              <div key={stock.ticker} className={`stock-card${isLoading(stock.ticker) ? " loading" : ""}`}>
                <div className="card-header">
                  <div className="ticker-badge">
                    <div>
                      <div className="ticker-name">{stock.ticker}</div>
                      {stock.companyName && <div className="company-name">{stock.companyName}</div>}
                    </div>
                    {stock.verdict && <div className={`verdict-pill ${stock.verdict}`}>{stock.verdict}</div>}
                  </div>
                  <div className="card-actions">
                    <button
                      className="btn-analyze"
                      onClick={() => reanalyze(stock.ticker)}
                      disabled={isLoading(stock.ticker)}
                    >
                      {isLoading(stock.ticker) ? "..." : "↻"}
                    </button>
                    <button className="btn-remove" onClick={() => removeStock(stock.ticker)}>×</button>
                  </div>
                </div>

                <div className="card-body">
                  {isLoading(stock.ticker) && (
                    <div className="loading-state">
                      <div className="loading-bar"><div className="loading-bar-fill" /></div>
                      Searching live data for {stock.ticker}…
                    </div>
                  )}

                  {!isLoading(stock.ticker) && errors[stock.ticker] && (
                    <div className="error-msg">⚠ {errors[stock.ticker]}</div>
                  )}

                  {!isLoading(stock.ticker) && stock.verdict && (
                    <>
                      <div className={`verdict-banner ${stock.verdict}`}>
                        <div className={`verdict-pill ${stock.verdict}`}>{stock.verdict}</div>
                        <div className="verdict-confidence">
                          Confidence: <span>{stock.confidence}</span>
                        </div>
                      </div>

                      <div className="price-row">
                        <div className="price-stat">
                          <div className="price-stat-label">Price</div>
                          <div className="price-stat-value">{stock.currentPrice}</div>
                        </div>
                        <div className="price-stat">
                          <div className="price-stat-label">Today</div>
                          <div className={`price-stat-value ${stock.priceChange?.startsWith("+") ? "positive" : "negative"}`}>{stock.priceChange}</div>
                        </div>
                        <div className="price-stat">
                          <div className="price-stat-label">Week</div>
                          <div className={`price-stat-value ${stock.weekChange?.startsWith("+") ? "positive" : "negative"}`}>{stock.weekChange}</div>
                        </div>
                      </div>
                      <div className="price-row-2">
                        <div className="price-stat">
                          <div className="price-stat-label">Market Cap</div>
                          <div className="price-stat-value">{stock.marketCap}</div>
                        </div>
                        <div className="price-stat">
                          <div className="price-stat-label">P/E Ratio</div>
                          <div className="price-stat-value">{stock.peRatio}</div>
                        </div>
                      </div>

                      <div className="section-title">Analysis</div>
                      <div className="analysis-text">{stock.summary}</div>

                      {stock.signals?.length > 0 && (
                        <>
                          <div className="section-title">Key Signals</div>
                          <div className="signals-list">
                            {stock.signals.map((sig, i) => (
                              <div key={i} className="signal-item">
                                <div className={`signal-dot ${sig.type}`} />
                                <span>{sig.text}</span>
                              </div>
                            ))}
                          </div>
                        </>
                      )}

                      {stock.catalysts && (
                        <>
                          <div className="section-title">Catalysts to Watch</div>
                          <div className="analysis-text">{stock.catalysts}</div>
                        </>
                      )}

                      {stock.updatedAt && (
                        <div className="updated-at">Updated: {stock.updatedAt}</div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {stocks.length > 0 && (
            <div className="disclaimer">
              <strong>⚠ Disclaimer:</strong> AI-generated analysis for informational purposes only. Not financial advice. Always consult a licensed financial advisor before investing.
            </div>
          )}
        </main>
      </div>
    </>
  );
}
