// ═══════════════════════════════════════════
//  FLOATLOCK — ANALYZE Tab (Deep Dive)
//  Self-contained — independent prompts
// ═══════════════════════════════════════════

const ANALYZE_MODULES = [
  {
    id:'deep', icon:'🏢', name:'Company Deep Dive',
    desc:'Business model, moat, financials, risks, valuation, 12–24 month outlook',
    accentColor:'var(--indigo)',
    buildPrompt(t) {
      return `You are a senior equity analyst. Search for the latest data and provide a comprehensive analysis of ${t}:
1. Business model and key revenue streams (what % of revenue from each)
2. Competitive advantages — be specific, not generic
3. Key industry trends affecting ${t} in 2025-2026
4. Financial health: YoY revenue growth, operating margin, FCF, debt/equity
5. Top 3 risks ranked by severity
6. Valuation vs 3 direct competitors (P/E, EV/EBITDA, P/S) — name the peers
7. Bull case, base case, bear case with price targets
8. 12-24 month outlook — 3 key catalysts to watch with approximate dates
Be specific with numbers. Search for the most recent financial data.`;
    }
  },
  {
    id:'financials', icon:'📊', name:'Financial Health',
    desc:'Revenue growth, net income, FCF, margins, debt, ROE — full breakdown',
    accentColor:'var(--emerald)',
    buildPrompt(t) {
      return `You are a financial analyst. Search for ${t}'s most recent financial data:
1. Revenue growth: Last 4 quarters YoY %, is it accelerating or decelerating?
2. Net income: Last 4 quarters trend, margin expansion or contraction
3. Free cash flow: TTM FCF, FCF yield vs share price, YoY growth rate
4. Profit margins: Gross %, operating %, net % vs historical 3-year average
5. Debt: Total debt, net debt, debt/EBITDA, interest coverage ratio
6. Return on equity: ROE vs industry peers, 3-year trend
7. Financial grade: A/B/C/D with one-paragraph reasoning
Search for the latest earnings report. Flag red flags and standout strengths.`;
    }
  },
  {
    id:'moat', icon:'🏰', name:'Competitive Moat',
    desc:'Brand, network effects, switching costs, IP — 1–10 rating vs peers',
    accentColor:'var(--amber)',
    buildPrompt(t) {
      return `You are a Morningstar-style moat analyst. Evaluate ${t}'s competitive moat.
Score each dimension 1-10:
- Brand strength: pricing power and recognition
- Network effects: does value compound with more users?
- Switching costs: pain of moving to a competitor
- Cost advantages: scale, proprietary processes
- Patents and proprietary technology
Then:
- Compare to ${t}'s top 3 direct competitors on each dimension (name them)
- OVERALL MOAT RATING: 1-10 with verdict paragraph
- The single biggest threat to the moat in the next 3 years
Search for recent competitive dynamics and product news.`;
    }
  },
  {
    id:'valuation', icon:'💰', name:'Valuation Analysis',
    desc:'P/E, DCF, industry comps — undervalued or overvalued verdict',
    accentColor:'var(--emerald)',
    buildPrompt(t) {
      return `You are an equity valuation specialist. Search for current price and financial data for ${t}:
1. P/E: current vs 5-year average vs top 3 peers (name them)
2. EV/EBITDA and P/S vs industry average
3. PEG ratio (P/E divided by growth rate) and what it implies
4. DCF estimate: state assumptions (revenue CAGR, terminal growth, discount rate), give fair value range
5. Analyst consensus price target vs current price — how much upside/downside?
6. Verdict: undervalued / fairly valued / overvalued — by approximately what %?
7. The variable that most changes this conclusion
Show your math. Give specific numbers, not ranges.`;
    }
  },
  {
    id:'risks', icon:'⚠️', name:'Risk Assessment',
    desc:'All major risks ranked — economic, regulatory, competitive, financial',
    accentColor:'var(--rose)',
    buildPrompt(t) {
      return `You are a risk analyst. Search for recent news and filings for ${t}.
Rank risks from MOST to LEAST dangerous:
1. Economic risks (recession sensitivity, rate exposure, commodity prices)
2. Industry disruption (technology shifts, new entrants, AI displacement)
3. Competitive threats (who is most likely to take share and how — be specific)
4. Regulatory/legal (pending investigations, legislation, international exposure)
5. Financial risks (debt levels, dilution risk, cash burn rate)
6. Execution risks (management, supply chain, key-person dependency)
For each risk: Severity (Critical/High/Medium/Low) + probability in 12-24 months + what a 30%+ drawdown scenario looks like.`;
    }
  },
  {
    id:'growth', icon:'🚀', name:'Growth Potential',
    desc:'5–10 year growth model: TAM, expansion, new products, AI leverage',
    accentColor:'var(--sky)',
    buildPrompt(t) {
      return `You are a growth equity analyst. Search for ${t}'s latest roadmap, market data, and guidance.
1. TAM: Current addressable market → projected 2030 size and CAGR
2. ${t}'s current market share and realistic capture scenario
3. Geographic expansion: untapped markets and timeline
4. New products or services in pipeline — revenue potential
5. AI or technology advantages that could accelerate growth
6. Management's own long-term targets (from investor days or earnings calls)
Model output:
- Realistic revenue CAGR for the next 5 years
- Stock price at that growth rate with current multiples
- Stock price at that growth rate with compressed multiples (downside)`;
    }
  },
  {
    id:'instview', icon:'🐋', name:'Hedge Fund Perspective',
    desc:'Institutional thesis — why they buy, why they avoid, key catalysts',
    accentColor:'var(--violet)',
    buildPrompt(t) {
      return `You are a senior portfolio manager presenting ${t} to an investment committee.
WHY AN INSTITUTION WOULD BUY ${t}:
- What makes this compelling as a long right now?
- What type of fund fits this — value, growth, quant, event-driven, long/short?
- At what price does this become a screaming buy?
- Which specific institutions are currently accumulating? Search recent 13F filings.
WHY AN INSTITUTION WOULD AVOID OR SHORT:
- What are the institutional red flags?
- What mandates would prohibit this position?
- What would trigger a forced institutional exit?
KEY CATALYSTS: 3 specific events with approximate dates
IC THESIS: Write a 3-sentence thesis a PM would use in an investment committee meeting.
Be specific, institutional, and direct.`;
    }
  },
  {
    id:'earnings', icon:'📋', name:'Earnings Breakdown',
    desc:'Most recent quarter — beats/misses, key metrics, guidance, market reaction',
    accentColor:'var(--amber)',
    buildPrompt(t) {
      return `You are an earnings analyst. Search for ${t}'s most recent quarterly earnings report and break down:
1. Revenue: Actual vs Wall Street consensus — beat or miss by how much %?
2. EPS: Actual vs consensus — beat or miss? Direction vs prior quarter?
3. Three key business metrics specific to ${t} (e.g. for SaaS: ARR, NRR, churn; for retail: comps, GMV, margin)
4. Management guidance: next quarter and full year vs consensus — raised, lowered, or maintained?
5. Market reaction: after-hours move + next full trading day move and why
6. Most important thing management said on the earnings call
7. One-sentence verdict: strong quarter, mixed quarter, or weak quarter relative to expectations?`;
    }
  },
  {
    id:'debate', icon:'⚔️', name:'Bull vs Bear Debate',
    desc:'Two analysts with opposing views — data-backed, ends with a verdict',
    accentColor:'var(--rose)',
    buildPrompt(t) {
      return `Create a structured debate between two analysts about ${t}. Search for current data first.
BULL ANALYST argues ${t} is a BUY:
- Argument 1 with specific data and numbers
- Argument 2 with specific data and numbers
- Argument 3 with specific data and numbers
- 12-month price target with methodology
- The single most important catalyst
BEAR ANALYST argues ${t} is a SELL or AVOID:
- Counterargument 1 with specific data and numbers
- Counterargument 2 with specific data and numbers
- Counterargument 3 with specific data and numbers
- 12-month downside target with methodology
- The biggest risk the bull is ignoring
MODERATOR VERDICT:
- Which argument is stronger right now and why (be direct)
- The one data point that would settle the debate
- Final call: Buy / Hold / Avoid with 12-month price range`;
    }
  },
  {
    id:'verdict', icon:'⚖️', name:'Investment Verdict',
    desc:'Final Buy / Hold / Avoid — short and long-term outlook',
    accentColor:'var(--emerald)',
    buildPrompt(t) {
      return `You are a professional investor. Search for current data then give a direct verdict on ${t}.
SHORT-TERM (1 year):
- Primary price driver over the next 12 months
- 3 upcoming catalysts with approximate dates
- Technical setup: oversold, overbought, or at a decision point?
- Analyst consensus target and range
LONG-TERM (5+ years):
- Secular tailwinds supporting the thesis
- What would need to be true for a 3x-5x return?
- What would cause permanent capital impairment?
FINAL VERDICT — be direct, no hedging:
- Decision: BUY / HOLD / AVOID
- Conviction: High / Medium / Low
- Entry strategy: buy now / wait for pullback to $X / avoid until [specific event]
- Position sizing: core (5%+) / satellite (1-3%) / speculative (<1%)
- One-sentence thesis a PM would put in a trade memo`;
    }
  },
];

// ─── STATE & RENDER ─────────────────────────
const analyzeResults = {};

function renderAnalyze() {
  const grid = document.getElementById('analyzeGrid');
  if (!grid) return;
  const sym = STATE.analyzeTarget || '';

  if (!sym) {
    grid.innerHTML = `
    <div style="text-align:center;padding:40px 20px;color:var(--t2)">
      <div style="font-size:48px;margin-bottom:14px">🔬</div>
      <div style="font-size:16px;font-weight:700;color:var(--t0);margin-bottom:6px">Enter any ticker above</div>
      <div style="font-family:var(--mono);font-size:10px;line-height:1.9">
        10 independent AI research modules<br>
        Each runs a separate Claude + web search query<br>
        Results are cached for your session
      </div>
    </div>`;
    return;
  }

  grid.innerHTML = ANALYZE_MODULES.map((m,i) => makeAnalyzeModule(m, sym, i)).join('');
}

function makeAnalyzeModule(m, sym, idx) {
  const key = `${m.id}_${sym}`;
  const hasResult = analyzeResults[key];

  return `
  <div class="a-module" style="animation-delay:${Math.min(idx*.04,.4)}s">
    <div class="a-mod-hdr">
      <span class="a-mod-icon">${m.icon}</span>
      <div class="a-mod-info">
        <div class="a-mod-name">${m.name}</div>
        <div class="a-mod-desc">${m.desc}</div>
      </div>
      <button class="a-mod-run" id="amr_${m.id}_${sym}"
        style="border-color:${m.accentColor};color:${m.accentColor};background:${m.accentColor}12"
        onclick="runAnalyzeModule('${m.id}','${sym}')">
        ${hasResult ? '🔄 Re-run' : '▶ Run'}
      </button>
    </div>
    <div class="a-result${hasResult?' open':''}" id="ar_${m.id}_${sym}">
      ${hasResult ? renderAnalyzeResult(analyzeResults[key]) : ''}
    </div>
  </div>`;
}

async function runAnalyzeModule(moduleId, sym) {
  const sym2 = sym || document.getElementById('analyzeInp')?.value?.trim()?.toUpperCase();
  if (!sym2) return;
  STATE.analyzeTarget = sym2;

  const m = ANALYZE_MODULES.find(x => x.id === moduleId);
  if (!m) return;

  const btn = document.getElementById(`amr_${moduleId}_${sym2}`);
  const res  = document.getElementById(`ar_${moduleId}_${sym2}`);
  if (!btn || !res) { renderAnalyze(); return; }

  btn.disabled = true;
  btn.innerHTML = '<span style="display:inline-block;width:10px;height:10px;border-radius:50%;border:2px solid rgba(255,255,255,.3);border-top-color:white;animation:spin .7s linear infinite"></span>';

  res.innerHTML = `<div class="a-result-inner"><div class="ai-thinking">
    <div class="think-spinner"></div>
    <span>Analyzing <strong>${sym2}</strong> — ${m.name}…</span>
  </div></div>`;
  res.classList.add('open');
  res.style.maxHeight = '120px';

  try {
    const text = await callClaude(m.buildPrompt(sym2), true);
    const key = `${moduleId}_${sym2}`;
    analyzeResults[key] = {
      text, sym: sym2, module: m.name, icon: m.icon,
      accent: m.accentColor,
      ts: new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'})
    };
    res.style.maxHeight = '';
    res.innerHTML = renderAnalyzeResult(analyzeResults[key]);
  } catch(e) {
    res.style.maxHeight = '';
    res.innerHTML = `<div class="a-result-inner"><div class="ai-thinking" style="flex-direction:column;align-items:flex-start;gap:6px">
      <span style="color:var(--rose);font-weight:700">Analysis failed</span>
      <span style="font-size:10px;color:var(--t2)">${e.message || 'Check your Claude API key in data.js'}</span>
    </div></div>`;
  }
  btn.disabled = false;
  btn.innerHTML = '🔄 Re-run';
}

function renderAnalyzeResult(data) {
  return `<div class="a-result-inner">
    <div class="result-meta">
      <span style="font-size:18px">${data.icon}</span>
      <span class="result-tag" style="background:${data.accent}18;color:${data.accent};border-color:${data.accent}33">${data.module.toUpperCase()}</span>
      <span class="result-ts">${data.sym} · ${data.ts}</span>
    </div>
    <div class="result-content" style="margin-top:12px">${formatResult(data.text)}</div>
    <div class="result-sources">
      <span class="src-chip">🌐 Web Search</span>
      <span class="src-chip">🤖 Claude AI</span>
      <span class="src-chip">📌 ${data.sym}</span>
      <span class="src-chip">🕐 ${data.ts}</span>
    </div>
  </div>`;
}

function setAnalyzeTarget() {
  const inp = document.getElementById('analyzeInp');
  const sym = inp?.value?.trim()?.toUpperCase();
  if (!sym) return;
  STATE.analyzeTarget = sym;

  const hdr = document.getElementById('analyzeTargetSym');
  if (hdr) hdr.innerHTML = `<span style="color:var(--emerald)">${sym}</span><span style="font-family:var(--mono);font-size:10px;color:var(--t2);margin-left:10px;font-weight:400;letter-spacing:.5px">10 MODULES READY</span>`;

  renderAnalyze();
  const grid = document.getElementById('analyzeGrid');
  if (grid) setTimeout(() => grid.scrollIntoView({behavior:'smooth',block:'start'}), 80);
}
