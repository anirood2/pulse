// ═══════════════════════════════════════════
//  FLOATLOCK — INTEL Tab (AI Research Tools)
// ═══════════════════════════════════════════

const INTEL_TOOLS = [
  // ── FROM YOUR SCREENSHOTS ──
  {
    id:'hedge', num:'01', icon:'🛡', color:'var(--rose)',
    name:'Portfolio Hedging Strategy',
    desc:'Design an efficient hedge using live options data and inverse ETFs.',
    inputs:[{id:'hedge_sector',ph:'Sector or market (e.g. Tech, Consumer, S&P500)'}],
    btnColor:'rose',
    buildPrompt(inputs) {
      return `You are an expert portfolio risk manager. My portfolio is exposed to ${inputs[0]||'broad market equities'}.
Using current options data and available inverse ETFs, design an efficient hedge.
Provide:
1. Recommended instrument (specific ETF ticker or options structure)
2. Hedge size (% of portfolio to allocate)
3. Annualized cost of carry
4. The scenario/trigger that activates this hedge
5. Current implied volatility data sources to monitor

Be specific with tickers, costs, and scenarios. Search for current IV data and ETF options.`;
    }
  },
  {
    id:'instflow', num:'02', icon:'🏦', color:'var(--indigo)',
    name:'Institutional Positioning Analysis',
    desc:'13F-based sector accumulation/distribution by top 10 hedge funds this quarter.',
    inputs:[],
    btnColor:'indigo',
    buildPrompt() {
      return `You are a hedge fund analyst. Using recent 13F data from WhaleWisdom, Dataroma, and SEC EDGAR, 
analyze what the top 10 hedge funds are accumulating vs distributing this quarter vs last quarter.
Search for the latest 13F filings and present:
1. Top 3 sectors being accumulated (with specific fund names and new positions)
2. Top 3 sectors being exited (full exits from named funds)
3. Most significant position increases (fund name, ticker, % increase)
4. Overall market positioning shift
Include sources and filing dates.`;
    }
  },
  {
    id:'correlation', num:'03', icon:'🔗', color:'var(--amber)',
    name:'Crisis Correlation Map',
    desc:'Unusual asset correlations right now — and 3 trades to profit from normalization.',
    inputs:[],
    btnColor:'amber',
    buildPrompt() {
      return `You are a macro strategist. In the current macro environment, search for assets showing unusual correlations:
- Gold and equities moving together (risk-on/off confusion)
- Bonds and stocks falling simultaneously
- Dollar and equities diverging from historical norms
- Crypto correlating with risk assets in unusual ways

For each anomaly found:
1. Name the correlation anomaly
2. What it has historically signaled
3. One specific trade that profits from normalization back to historical correlations
4. The timeframe for the trade

Search for current market data and provide 3 concrete trades with entry/exit logic.`;
    }
  },
  {
    id:'divdanger', num:'04', icon:'⚠️', color:'var(--rose)',
    name:'Dividend Danger Radar',
    desc:'5 attractive-yield stocks with hidden cut risks — and safer alternatives.',
    inputs:[{id:'div_sector',ph:'Sector focus (optional, e.g. REITs, Energy, Utilities)'}],
    btnColor:'rose',
    buildPrompt(inputs) {
      return `You are a dividend analyst. Search for 5 companies with high dividend yields (>5%) but with warning signs suggesting a cut is likely.
Focus: ${inputs[0]||'any sector'}.

Warning signs to screen for: payout ratio >80%, negative or declining free cash flow, rising debt levels, revenue declining.

For each of the 5 companies provide:
- Ticker and current dividend yield
- Probability of a cut in next 12 months (Low/Medium/High) with reasoning
- The specific warning signs present
- 1-2 safer alternatives in the same sector with lower yield but sustainable payout
- Sources

Search for current financial data to validate.`;
    }
  },
  {
    id:'aiqueezer', num:'05', icon:'⚡', color:'var(--emerald)',
    name:'AI Squeeze Screener',
    desc:'5 current high-short-interest stocks with upcoming catalysts — beyond our curated list.',
    inputs:[],
    btnColor:'emerald',
    buildPrompt() {
      return `You are a short squeeze analyst using the AR SS Framework. Search Finviz, recent news, and market data to find 5 stocks with:
- Short interest >20% of float
- Elevated borrow rate (>5%)
- An upcoming catalyst in the next 30-90 days

For each ticker provide:
1. Ticker and company name
2. Short % of float and days to cover
3. The specific upcoming catalyst (earnings date, FDA decision, court ruling, etc.)
4. Entry strategy (technical level or event-driven trigger)
5. Risk of a failed squeeze (what would need to happen for shorts to win)
6. Source

Focus on names NOT in the standard GME/AMC/BBBY crowd — find the next CAR, not the last meme stock.`;
    }
  },
  {
    id:'macro', num:'06', icon:'🌐', color:'var(--sky)',
    name:'Top-Down Macro Analysis',
    desc:'Current macro regime → historically outperforming sectors → 3 historical analogs.',
    inputs:[],
    btnColor:'amber',
    buildPrompt() {
      return `You are a macro economist. Search the web for current macroeconomic data from Fed, ECB, BLS, and BEA:
- Current inflation rate (CPI/PCE)
- Current interest rates (Fed Funds rate)
- Latest GDP growth rate
- Unemployment rate trend

Based on this exact macro environment, tell me:
1. Which macro regime this most closely resembles historically
2. Which sectors/asset classes historically outperform in this specific regime
3. Three historical time periods with nearly identical macro conditions and what assets did best
4. Expected timeframe for regime change
5. Three specific investment ideas for this environment

Include sources and data dates.`;
    }
  },
  {
    id:'sentiment', num:'07', icon:'📡', color:'var(--violet)',
    name:'Sentiment vs. Fundamentals Arbitrage',
    desc:'6 stocks where bearish sentiment clearly diverges from strong underlying fundamentals.',
    inputs:[],
    btnColor:'violet',
    buildPrompt() {
      return `You are a contrarian investment analyst. Search for stocks where market sentiment (negative news coverage, bearish social media tone, recent analyst downgrades) clearly diverges from strong underlying fundamentals.

Return 6 investment ideas where:
- Sentiment is negative or neutral
- Fundamentals are genuinely strong (growing revenue, improving margins, strong FCF)

For each idea:
1. Ticker and company
2. Why sentiment is negative (specific reason — what narrative is hurting it)
3. Why the fundamentals contradict that narrative (specific data points)
4. Technical entry level (support zone or moving average)
5. Potential catalyst for rerating
6. Sources

Search for recent news and financial data to validate.`;
    }
  },

  // ── COMPANY DEEP DIVE TOOLS ──
  {
    id:'overview', num:'08', icon:'🏢', color:'var(--indigo)',
    name:'Company Deep Dive',
    desc:'Full business model, moat, financials, risks, valuation, and 12–24 month outlook.',
    inputs:[{id:'ov_ticker',ph:'Ticker (e.g. NVDA, AAPL, TSLA)'}],
    btnColor:'indigo',
    buildPrompt(inputs) {
      const t = inputs[0]||'NVDA';
      return `You are a senior equity analyst. Provide a comprehensive analysis of ${t} covering:
1. Business model and key revenue streams
2. Competitive advantages and economic moat
3. Industry trends affecting the company
4. Financial health: revenue growth rate, profit margins, debt levels, FCF
5. Key risks (top 3, ranked by severity)
6. Valuation vs. 3 direct competitors (P/E, P/S, EV/EBITDA)
7. Bull case, base case, and bear case scenarios for the stock
8. 12-24 month price outlook and key catalysts

Search for the latest financial data and analyst reports. Be specific with numbers and percentages.`;
    }
  },
  {
    id:'financials', num:'09', icon:'📊', color:'var(--emerald)',
    name:'Financial Health Breakdown',
    desc:'Revenue growth, net income trends, FCF, margins, debt, and ROE — all in one.',
    inputs:[{id:'fin_ticker',ph:'Ticker (e.g. MSFT, META, AMZN)'}],
    btnColor:'emerald',
    buildPrompt(inputs) {
      const t = inputs[0]||'MSFT';
      return `You are a financial analyst. Break down ${t}'s financial health using the most recent data available:

1. Revenue growth: Last 4 quarters YoY growth rate, trend direction
2. Net income trends: Last 4 quarters, margin expansion/contraction
3. Free cash flow: TTM FCF, FCF yield, FCF growth rate
4. Profit margins: Gross, operating, and net margin vs. historical average
5. Debt levels: Total debt, debt/equity, interest coverage ratio, debt maturity profile
6. Return on equity: ROE vs. industry peers, 3-year trend

Flag any red flags or standout strengths. Search for the most recent earnings data.`;
    }
  },
  {
    id:'moat', num:'10', icon:'🏰', color:'var(--amber)',
    name:'Competitive Moat Evaluator',
    desc:'Rate the moat from 1–10 across brand, network effects, switching costs, and IP.',
    inputs:[{id:'moat_ticker',ph:'Ticker (e.g. GOOGL, V, BRK.B)'}],
    btnColor:'amber',
    buildPrompt(inputs) {
      const t = inputs[0]||'GOOGL';
      return `You are a Morningstar-style moat analyst. Evaluate the competitive moat of ${t}:

Score each dimension 1-10:
1. Brand strength (consumer/enterprise recognition, pricing power)
2. Network effects (does the product get better as more users join?)
3. Switching costs (how painful is it to leave?)
4. Cost advantages (economies of scale, proprietary processes)
5. Patents or proprietary technology

Then:
- Compare to top 3 direct competitors on each dimension
- Give an OVERALL MOAT RATING: 1-10 with reasoning
- Identify the #1 moat threat in the next 3 years

Search for recent competitive landscape data.`;
    }
  },
  {
    id:'valuation', num:'11', icon:'💰', color:'var(--emerald)',
    name:'Valuation Analysis',
    desc:'P/E, DCF estimate, industry comps — undervalued or overvalued conclusion.',
    inputs:[{id:'val_ticker',ph:'Ticker (e.g. TSLA, NFLX, JPM)'}],
    btnColor:'emerald',
    buildPrompt(inputs) {
      const t = inputs[0]||'TSLA';
      return `You are an equity valuation specialist. Perform a full valuation of ${t}:

1. P/E ratio comparison: current P/E vs. 5-year average and 3 peer companies
2. DCF estimate: Use reasonable growth assumptions, explain your assumptions clearly, give a fair value range
3. P/S and EV/EBITDA vs. industry average
4. PEG ratio (P/E divided by growth rate)
5. Conclusion: Is ${t} undervalued, fairly valued, or overvalued? By what percentage?
6. The most important variable that could change this conclusion

Search for current price and financial data. Show your math.`;
    }
  },
  {
    id:'risks', num:'12', icon:'⚠️', color:'var(--rose)',
    name:'Risk Assessment',
    desc:'Comprehensive risk ranking — economic, regulatory, competitive, financial.',
    inputs:[{id:'risk_ticker',ph:'Ticker (e.g. BABA, INTC, AMC)'}],
    btnColor:'rose',
    buildPrompt(inputs) {
      const t = inputs[0]||'INTC';
      return `You are a risk analyst. Identify and rank the biggest risks of investing in ${t}:

Rank from most to least dangerous:
1. Economic risks (recession sensitivity, commodity exposure, rate sensitivity)
2. Industry disruption risks (technology shifts, new entrants)
3. Competitive threats (who is most likely to take market share and how)
4. Regulatory/legal threats (pending litigation, regulatory investigations)
5. Financial risks (debt levels, covenant risks, dilution risk)

For each risk:
- Severity: Critical/High/Medium/Low
- Probability of materializing in 12-24 months
- What would need to happen for this risk to cause a 30%+ drawdown

Search for recent news on regulatory and competitive developments.`;
    }
  },
  {
    id:'growth', num:'13', icon:'🚀', color:'var(--sky)',
    name:'Growth Potential Analysis',
    desc:'5-10 year growth estimate across TAM, expansion, new products, and AI leverage.',
    inputs:[{id:'growth_ticker',ph:'Ticker (e.g. PLTR, RKLB, IONQ)'}],
    btnColor:'amber',
    buildPrompt(inputs) {
      const t = inputs[0]||'PLTR';
      return `You are a growth equity analyst. Analyze the future growth potential of ${t} over the next 5-10 years:

1. Total addressable market (TAM): Current size, projected 2030 size, CAGR
2. Industry growth rate vs. company growth rate
3. Geographic expansion opportunities (untapped markets)
4. New products or service lines in development
5. AI or technology advantages that could accelerate growth
6. Management's own guidance and long-term targets

Estimate: What is a realistic revenue CAGR for the next 5 years? What would the stock price be at that growth rate with current multiples? With compressed multiples?

Search for the latest product roadmap and market data.`;
    }
  },
  {
    id:'institution', num:'14', icon:'🐋', color:'var(--violet)',
    name:'Hedge Fund Perspective',
    desc:'Why institutions would buy — or avoid — this stock. Full investment thesis.',
    inputs:[{id:'inst_ticker',ph:'Ticker (e.g. META, COIN, SNOW)'}],
    btnColor:'violet',
    buildPrompt(inputs) {
      const t = inputs[0]||'META';
      return `Act like a senior portfolio manager at a top-tier hedge fund evaluating ${t}:

Provide a balanced institutional perspective:

WHY INSTITUTIONS WOULD BUY:
- What makes this an attractive long? (catalysts, setup, thesis)
- What type of fund would own this? (value, growth, quant, event-driven?)
- At what price would it become a "screaming buy"?

WHY INSTITUTIONS WOULD AVOID:
- What are the institutional red flags?
- What risks make this uninvestable for some mandates?
- What would cause a forced sell?

KEY CATALYSTS: Top 3 events that could be inflection points

INVESTMENT THESIS: Write a 3-sentence thesis a PM would use in an IC meeting

Search for recent institutional ownership changes and analyst commentary.`;
    }
  },
  {
    id:'earnings', num:'15', icon:'📋', color:'var(--amber)',
    name:'Earnings Report Breakdown',
    desc:'Latest earnings: beats/misses, key metrics, guidance, and market reaction.',
    inputs:[{id:'earn_ticker',ph:'Ticker (e.g. AAPL, AMZN, GOOG)'}],
    btnColor:'amber',
    buildPrompt(inputs) {
      const t = inputs[0]||'AAPL';
      return `You are an earnings analyst. Explain the most recent earnings report for ${t}:

Search for the latest quarterly results and provide:
1. Revenue: Actual vs. consensus estimate (% beat or miss)
2. EPS: Actual vs. consensus estimate (% beat or miss)  
3. 3 key metrics specific to ${t}'s business (e.g. MAUs, GMV, margin, bookings)
4. Management guidance for next quarter vs. current consensus
5. Market reaction: How did the stock react in after-hours and next trading day?
6. The most important thing management said on the earnings call

Give a one-sentence verdict: Was this a good or bad quarter relative to expectations?`;
    }
  },
  {
    id:'debate', num:'16', icon:'⚔️', color:'var(--rose)',
    name:'Bull vs Bear Debate',
    desc:'Two analysts debate — one bullish, one bearish — with data-backed arguments.',
    inputs:[{id:'deb_ticker',ph:'Ticker to debate (e.g. TSLA, NVDA, DIS)'}],
    btnColor:'rose',
    buildPrompt(inputs) {
      const t = inputs[0]||'TSLA';
      return `Create a structured debate between two analysts about ${t}. Use current data.

BULL ANALYST argues why ${t} is a BUY:
- 3 data-backed arguments (specific numbers required)
- Key catalyst in the next 12 months
- Price target and rationale

BEAR ANALYST argues why ${t} is a SELL or AVOID:
- 3 data-backed counterarguments (specific numbers required)
- Key risk that could cause a significant decline
- Downside scenario and price target

MODERATOR'S BALANCED CONCLUSION:
- Which argument is stronger and why
- What single data point would settle the debate
- Final verdict: Buy, Hold, or Avoid with a one-year price range

Search for the most recent data to make the arguments current.`;
    }
  },
  {
    id:'verdict', num:'17', icon:'⚖️', color:'var(--emerald)',
    name:'Investment Verdict',
    desc:'Short-term and long-term outlook → Buy, Hold, or Avoid with conviction level.',
    inputs:[{id:'verd_ticker',ph:'Ticker (e.g. CRWD, ARM, SMCI)'}],
    btnColor:'emerald',
    buildPrompt(inputs) {
      const t = inputs[0]||'CRWD';
      return `You are a professional investor. Evaluate whether ${t} is a good investment today.

Search for current price, financials, and news, then provide:

SHORT-TERM OUTLOOK (1 year):
- What drives the stock in the next 12 months?
- Key upcoming catalysts and risk events
- Technical setup (is it oversold/overbought?)

LONG-TERM OUTLOOK (5+ years):
- Secular tailwinds supporting the thesis
- Biggest long-term risks to the thesis
- Comparable companies that succeeded/failed with similar setups

FINAL VERDICT:
- BUY / HOLD / AVOID
- Conviction level: High / Medium / Low
- Entry strategy: buy now, wait for pullback to $X, or avoid until Y happens
- One-sentence thesis

Be direct. Investors hate wishy-washy answers.`;
    }
  },
];

// ─── RESULT STATE ───────────────────────────
const intelResults = {};

function renderIntel() {
  const grid = document.getElementById('intelGrid');
  if (!grid) return;
  grid.innerHTML = INTEL_TOOLS.map((tool,i) => makeToolCard(tool,i)).join('');
}

function makeToolCard(tool, idx) {
  const hasResult = intelResults[tool.id];
  const inputsHtml = tool.inputs.map(inp => 
    `<input class="tool-inp" id="ti_${tool.id}_${inp.id}" placeholder="${inp.ph}">`
  ).join('');

  const colorMap = {
    rose:'var(--rose)', indigo:'var(--indigo)', amber:'var(--amber)',
    emerald:'var(--emerald)', sky:'var(--sky)', violet:'var(--violet)',
  };
  const btnBg = colorMap[tool.btnColor] || 'var(--indigo)';
  const isViolet = tool.btnColor === 'violet';

  return `
  <div class="tool-card" style="animation-delay:${Math.min(idx*.05,.5)}s">
    <div class="tool-hdr">
      <div class="tool-icon" style="background:${tool.color}15">${tool.icon}</div>
      <div class="tool-info">
        <div class="tool-num">TOOL ${tool.num}</div>
        <div class="tool-name">${tool.name}</div>
        <div class="tool-desc">${tool.desc}</div>
      </div>
    </div>
    ${tool.inputs.length ? `<div class="tool-inputs">${inputsHtml}</div>` : ''}
    <button class="tool-run-btn" id="trbtn_${tool.id}" 
      style="background:${btnBg};color:${tool.btnColor==='amber'?'var(--bg)':'white'};margin-bottom:${hasResult?'0':'14px'}"
      onclick="runTool('${tool.id}')">
      🤖 Run Analysis
    </button>
    <div class="tool-result${hasResult?' open':''}" id="tr_${tool.id}">
      ${hasResult ? renderToolResult(tool.id, hasResult) : ''}
    </div>
  </div>`;
}

async function runTool(toolId) {
  const tool = INTEL_TOOLS.find(t=>t.id===toolId);
  if (!tool) return;

  const btn = document.getElementById(`trbtn_${toolId}`);
  const resultDiv = document.getElementById(`tr_${toolId}`);
  if (!btn || !resultDiv) return;

  // Collect inputs
  const inputVals = tool.inputs.map(inp => {
    const el = document.getElementById(`ti_${tool.id}_${inp.id}`);
    return el ? el.value.trim().toUpperCase() : '';
  });

  btn.disabled = true; btn.innerHTML = '<div class="think-spinner"></div> Analyzing…';
  resultDiv.style.maxHeight = '200px';
  resultDiv.innerHTML = `
    <div class="ai-thinking">
      <div class="think-spinner"></div>
      <span>Searching web + synthesizing with Claude…</span>
    </div>`;
  resultDiv.classList.add('open');

  try {
    const prompt = tool.buildPrompt(inputVals);
    const result = await callClaude(prompt, true);
    intelResults[toolId] = { text:result, ts:new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'}), inputs:inputVals };
    resultDiv.style.maxHeight = '';
    resultDiv.innerHTML = renderToolResult(toolId, intelResults[toolId]);
  } catch(e) {
    resultDiv.innerHTML = `<div class="ai-thinking"><span style="color:var(--rose)">Error: ${e.message||'API unavailable'}</span></div>`;
  }
  btn.disabled = false;
  btn.innerHTML = '🔄 Re-run Analysis';
}

function renderToolResult(toolId, data) {
  return `
  <div class="tool-result-inner">
    <div class="result-meta">
      <span class="result-tag">AI ANALYSIS</span>
      <span class="result-ts">${data.ts}</span>
      ${data.inputs?.filter(Boolean).length ? `<span class="result-ts">· ${data.inputs.filter(Boolean).join(', ')}</span>` : ''}
    </div>
    <div class="result-content">${formatResult(data.text)}</div>
    <div class="result-sources">
      <span class="src-chip">🌐 Web Search</span>
      <span class="src-chip">🤖 Claude ${CLAUDE_MODEL}</span>
      <span class="src-chip">📅 ${data.ts}</span>
    </div>
  </div>`;
}
