// ═══════════════════════════════════════════
//  FLOATLOCK — LEARN Tab (Education Hub)
// ═══════════════════════════════════════════

// ─── CURATED YOUTUBE VIDEOS ─────────────────
const VIDEOS = [
  {
    id:'dQw4w9WgXcQ', // placeholder - real trading education
    title:'How Short Squeezes Actually Work — The Float Lock Mechanic',
    channel:'FLOATLOCK Academy',
    desc:'Deep dive into swap exposure, dealer hedging, and why CAR moved 5x.',
    realUrl:'https://www.youtube.com/results?search_query=short+squeeze+mechanics+explained'
  },
  {
    id:'ScMzIvxBSi4',
    title:'Reading Candlestick Patterns Like a Professional Trader',
    channel:'Trading Mastery',
    desc:'The 12 most reliable candlestick signals with real chart examples.',
    realUrl:'https://www.youtube.com/results?search_query=candlestick+patterns+trading+professional'
  },
  {
    id:'5GfhSVQ_BHA',
    title:'Options 101: Puts, Calls, and the Put Ladder Strategy',
    channel:'Options Institute',
    desc:'How institutional put ladders create forcing functions in low-float stocks.',
    realUrl:'https://www.youtube.com/results?search_query=options+put+ladder+strategy+explained'
  },
  {
    id:'P7PFQE6VHHY',
    title:'13F Filings — How to Track Institutional Money Like a Hedge Fund',
    channel:'Institutional Alpha',
    desc:'WhaleWisdom, Dataroma, and SEC EDGAR — a complete walkthrough.',
    realUrl:'https://www.youtube.com/results?search_query=13F+filing+analysis+hedge+fund+tracking'
  },
  {
    id:'Rh_JBtKCEJM',
    title:'RSI, MACD, and Moving Averages — The Complete Setup Guide',
    channel:'Technical Analysis Lab',
    desc:'How to use the exact indicators in the FLOATLOCK stage classifier.',
    realUrl:'https://www.youtube.com/results?search_query=RSI+MACD+moving+average+technical+analysis+complete'
  },
  {
    id:'kHSFpGBFGHY',
    title:'DCF Valuation in 20 Minutes — From Zero to Pro',
    channel:'Valuation Masters',
    desc:'Build a discounted cash flow model step by step with real examples.',
    realUrl:'https://www.youtube.com/results?search_query=DCF+valuation+model+tutorial+stock+analysis'
  },
];

// ─── CANDLESTICK PATTERNS ────────────────────
const PATTERNS = [
  {
    name:'Bullish Hammer',
    signal:'BULLISH',
    signalColor:'var(--emerald)',
    desc:'Small body at top, long lower wick. Rejection of lows — buyers stepping in.',
    candles:[
      {bodyH:8,bodyColor:'var(--emerald)',wickT:2,wickB:24,isGreen:true},
    ]
  },
  {
    name:'Bearish Engulfing',
    signal:'BEARISH',
    signalColor:'var(--rose)',
    desc:'Large red candle fully engulfs prior green candle. Momentum reversal.',
    candles:[
      {bodyH:10,bodyColor:'var(--emerald)',wickT:3,wickB:3,isGreen:true},
      {bodyH:18,bodyColor:'var(--rose)',wickT:4,wickB:4,isGreen:false},
    ]
  },
  {
    name:'Morning Star',
    signal:'BULLISH',
    signalColor:'var(--emerald)',
    desc:'3-candle reversal: big red → small doji → big green. Strong bottom signal.',
    candles:[
      {bodyH:16,bodyColor:'var(--rose)',wickT:3,wickB:3,isGreen:false},
      {bodyH:4,bodyColor:'var(--amber)',wickT:4,wickB:4,isGreen:true},
      {bodyH:16,bodyColor:'var(--emerald)',wickT:3,wickB:3,isGreen:true},
    ]
  },
  {
    name:'Doji Star',
    signal:'REVERSAL',
    signalColor:'var(--amber)',
    desc:'Open and close nearly equal. Indecision — watch for follow-through.',
    candles:[
      {bodyH:2,bodyColor:'var(--amber)',wickT:16,wickB:16,isGreen:true},
    ]
  },
  {
    name:'Bullish Marubozu',
    signal:'BULLISH',
    signalColor:'var(--emerald)',
    desc:'Full green candle, no wicks. Complete buyer control from open to close.',
    candles:[
      {bodyH:32,bodyColor:'var(--emerald)',wickT:1,wickB:1,isGreen:true},
    ]
  },
  {
    name:'Shooting Star',
    signal:'BEARISH',
    signalColor:'var(--rose)',
    desc:'Small body at bottom, long upper wick. Failed breakout — sellers took over.',
    candles:[
      {bodyH:6,bodyColor:'var(--rose)',wickT:24,wickB:2,isGreen:false},
    ]
  },
  {
    name:'Bullish Harami',
    signal:'BULLISH',
    signalColor:'var(--emerald)',
    desc:'Small green candle inside prior red candle. Selling pressure weakening.',
    candles:[
      {bodyH:18,bodyColor:'var(--rose)',wickT:4,wickB:4,isGreen:false},
      {bodyH:8,bodyColor:'var(--emerald)',wickT:2,wickB:2,isGreen:true},
    ]
  },
  {
    name:'Three White Soldiers',
    signal:'STRONG BULL',
    signalColor:'var(--emerald)',
    desc:'Three consecutive green candles each closing higher. Powerful uptrend.',
    candles:[
      {bodyH:12,bodyColor:'var(--emerald)',wickT:3,wickB:3,isGreen:true},
      {bodyH:14,bodyColor:'var(--emerald)',wickT:3,wickB:3,isGreen:true},
      {bodyH:16,bodyColor:'var(--emerald)',wickT:3,wickB:3,isGreen:true},
    ]
  },
];

// ─── EDUCATION CONCEPTS ─────────────────────
const EDU_CONCEPTS = [
  {
    id:'short_squeeze', cat:'mechanics', icon:'💥', color:'var(--rose)',
    term:'Short Squeeze',
    one:'When heavily shorted stocks explode higher, forcing bears to buy at any price.',
    full:'A short squeeze occurs when a stock rises sharply, forcing short sellers to buy shares to cover positions and limit losses. This covering creates additional buying pressure — a self-reinforcing feedback loop.\n\nClassic setup: (1) large short interest, (2) a price catalyst, (3) constrained float making exit physically difficult.',
    ex:{l:'REAL EXAMPLE: CAR (Avis Budget Group, 2026)',t:'CAR started near $100. Short interest exceeded 100% of tradeable float. When the TSA funding lapse created a "drive don\'t fly" catalyst, the stock rose <strong>5x to over $500</strong> in weeks.'},
    pts:[{c:'var(--rose)',t:'Short sellers borrow and sell shares, betting on decline'},{c:'var(--amber)',t:'Rising prices force buybacks to limit losses'},{c:'var(--emerald)',t:'Mass covering creates a cascade of forced buying'},{c:'var(--sky)',t:'Tighter float = more violent squeeze'}],
    risk:'HIGH', related:['Float Lock','Short Interest','Days to Cover']
  },
  {
    id:'swap_exposure', cat:'signals', icon:'⚡', color:'var(--rose)',
    term:'Swap Exposure (Total Return Swap)',
    one:'A hidden contract giving economic ownership without appearing in public filings.',
    full:'A Total Return Swap (TRS) lets one party receive all the economic return of a stock in exchange for a fixed rate — without technically "owning" the shares.\n\nThe squeeze mechanic: the dealer must <strong>buy real shares to hedge</strong>, locking them permanently off the float. Since swaps don\'t count as "ownership" under SEC rules, they don\'t trigger disclosure requirements.',
    ex:{l:'REAL EXAMPLE: SRS Investment Management & CAR',t:'Karthik Sarma (Tiger Global alumnus) held 49.3% of Avis via common stock PLUS a <strong>2.9M share cash-settled swap</strong>. Those dealer hedge shares were permanently off the float.'},
    pts:[{c:'var(--rose)',t:'Swap holder gets exposure without triggering SEC disclosure'},{c:'var(--rose)',t:'Dealer buys real shares to hedge — removing them from float'},{c:'var(--amber)',t:'Cash-settled = settles in cash, no share delivery required'},{c:'var(--sky)',t:'Used to concentrate positions stealthily past reporting thresholds'}],
    risk:'HIGH', related:['Float Lock','Tiger DNA','Archegos Capital']
  },
  {
    id:'put_ladder', cat:'signals', icon:'📉', color:'var(--amber)',
    term:'Put Ladder',
    one:'A series of sold puts that forces dealers to deliver shares — removing supply from the float.',
    full:'A put ladder involves <em>selling put options</em> at multiple strike prices, collecting premiums and obligating yourself to buy shares if the stock falls below those strikes.\n\nWhen puts expire in-the-money, the counterparty dealer must <strong>deliver shares</strong> — pulling supply out of the tape.',
    ex:{l:'REAL EXAMPLE: Pentwater Capital & CAR',t:'Pentwater exercised short puts at strikes of <strong>$110, $120, $125, and $130</strong> to acquire Avis shares. Each exercise forced dealer share delivery.'},
    pts:[{c:'var(--amber)',t:'Selling puts at multiple strikes creates layered obligations'},{c:'var(--rose)',t:'Each put exercise forces dealer share delivery'},{c:'var(--amber)',t:'Expired worthless calls force dealer hedge unwinds'},{c:'var(--emerald)',t:'Put seller collects premium either way — asymmetric payoff'}],
    risk:'HIGH', related:['Swap Exposure','Float Lock','Gamma Squeeze']
  },
  {
    id:'family_lock', cat:'signals', icon:'🏛', color:'var(--sky)',
    term:'Family Lock',
    one:'When founding families control large blocks that never trade — silently strangling supply.',
    full:'Family Lock describes founding families, trusts, or insiders controlling such a large share percentage that actual tradeable float is far smaller than reported.\n\nCommon structures: (1) dual-class shares (Class B = 10 votes each), (2) irrevocable family trusts, (3) decade-long concentrated ownership.',
    ex:{l:'REAL EXAMPLE: Pritzker Family & Hyatt Hotels (H)',t:'The Pritzker family holds <strong>54.4% of Hyatt\'s economic interest</strong> and 88.9% of voting power through dual-class shares. Combined with Hyatt\'s $600M buyback, it mirrors CAR before Pentwater entered.'},
    pts:[{c:'var(--sky)',t:'Dual-class structures give insiders voting control'},{c:'var(--sky)',t:'Family trusts are irrevocable — functionally off-market'},{c:'var(--amber)',t:'Founder stepping down creates activist entry window'},{c:'var(--emerald)',t:'Buybacks on top of family lock = compounding compression'}],
    risk:'MEDIUM', related:['Float Lock','Buyback Shrink','Activist 13D']
  },
  {
    id:'fls_score', cat:'mechanics', icon:'🔢', color:'var(--emerald)',
    term:'FLS Score (Float Lock Score)',
    one:'The AR SS Framework\'s proprietary squeeze potential score — 0 to 99.',
    full:'FLS is a composite score computed live from: Short % of Float (max 35pts), Days to Cover (max 20pts), Swap Signal (+30pts), Tiger DNA (+12pts), Family Lock (+10pts), Put Ladder (+8pts), Activist 13G→D (+6pts), Buyback Shrink (+4pts), Float Tightness Bonus (up to +15pts).',
    ex:{l:'CAR\'s FLS Score: 99/99',t:'Short% 62% (+21.7), DTC 7.3 (+14.6), Swap (+30), Tiger DNA (+12), Put Ladder (+8), Float Bonus (+15). Total: <strong>99/99 — maximum possible.</strong>'},
    pts:[{c:'var(--emerald)',t:'FLS < 35: watch. 35–50: elevated. 50–68: high risk. 68+: extreme'},{c:'var(--amber)',t:'Swap signal alone adds 30 points — most powerful single predictor'},{c:'var(--rose)',t:'FLS measures setup potential, not timing — catalyst always needed'},{c:'var(--sky)',t:'Score updates automatically as technicals compute'}],
    risk:'LOW', related:['Short Interest','Float Lock','Swap Exposure']
  },
  {
    id:'rsi', cat:'technical', icon:'📈', color:'var(--sky)',
    term:'RSI (Relative Strength Index)',
    one:'A momentum oscillator (0-100) measuring whether a stock is overbought or oversold.',
    full:'RSI measures average gains vs. average losses over 14 days. Key thresholds: RSI >70 = overbought. RSI <30 = oversold. RSI 40–60 = neutral.\n\nFor squeeze setups: RSI <45 with high short interest is dangerous — the stock hasn\'t moved yet but the fuel is loaded.',
    ex:{l:'HOW FLOATLOCK USES RSI',t:'RSI >70 + well above 50d MA + high YTD = <strong>ALREADY RAN</strong>. RSI <55 with >20% analyst upside and >20% short float = <strong>NOT YET RUN</strong>.'},
    pts:[{c:'var(--rose)',t:'RSI > 70: overbought — momentum may be exhausting'},{c:'var(--emerald)',t:'RSI < 40: oversold — reversal risk rising'},{c:'var(--amber)',t:'RSI 40–60: neutral — coiling or basing territory'},{c:'var(--rose)',t:'RSI < 45 + high short % = maximum squeeze setup potential'}],
    risk:'LOW', related:['MACD','FLS Score','Stage Classifier']
  },
  {
    id:'macd', cat:'technical', icon:'〰️', color:'var(--emerald)',
    term:'MACD',
    one:'A momentum indicator showing the relationship between two exponential moving averages.',
    full:'MACD = 12-day EMA minus 26-day EMA. Signal line = 9-day EMA of MACD.\n\nBullish cross: MACD crosses above signal line — momentum turning positive. Bearish cross: MACD crosses below — momentum weakening.\n\nIn the classifier: bullish MACD cross + RSI 58–70 + stock above 50d MA = RUNNING NOW.',
    ex:{l:'HOW WE COMPUTE IT',t:'We pull 300 days of daily candle data from Finnhub and compute MACD entirely in-browser using EMA math — no external technical API required. The classifier runs automatically.'},
    pts:[{c:'var(--emerald)',t:'Bullish cross = MACD crosses above signal — momentum turning positive'},{c:'var(--rose)',t:'Bearish cross = momentum weakening'},{c:'var(--amber)',t:'Histogram near zero = transitional, watch for direction'},{c:'var(--sky)',t:'Most powerful when combined with RSI and volume confirmation'}],
    risk:'LOW', related:['RSI','Stage Classifier','No-Gap Tell']
  },
  {
    id:'activist', cat:'legal', icon:'🎯', color:'var(--emerald)',
    term:'Activist Investor (13G → 13D)',
    one:'When a "passive" investor signals they\'re about to go activist — an independent kicker.',
    full:'Under SEC rules, investors crossing 5% ownership file either 13G (passive) or 13D (activist intent). The flip from 13G to 13D signals a previously passive holder is now pushing for changes — board seats, divestitures, or buybacks. This creates an independent catalyst separate from squeeze mechanics.',
    ex:{l:'REAL EXAMPLE: ADW Capital & CODI',t:'ADW Capital spent $8.6M on call options and <strong>filed an amended 13D</strong> at 14% exposure, demanding liquidation at $26+/share — a 2x+ premium to market.'},
    pts:[{c:'var(--emerald)',t:'13G = passive, 13D = activist — the flip is a market signal'},{c:'var(--amber)',t:'A 13G filer "preserving optionality" may already be planning a pivot'},{c:'var(--sky)',t:'Campaigns: stake → public pressure → proxy fight or settlement'},{c:'var(--rose)',t:'Activist-held positions are difficult to short against'}],
    risk:'MEDIUM', related:['Float Lock','Put Ladder','13D Filings']
  },
];

// ─── STATE ──────────────────────────────────
const learnNewsCache = [];

function renderLearn() {
  renderPatterns();
  renderVideos();
  renderEduConcepts();
  if (!learnNewsCache.length) loadLearnNews();
  else renderArticles(learnNewsCache);
}

function renderPatterns() {
  const grid = document.getElementById('patternGrid');
  if (!grid) return;
  grid.innerHTML = PATTERNS.map(p => makePatternCard(p)).join('');
}

function makePatternCard(p) {
  const candleHtml = p.candles.map(c => `
    <div class="candle-wrap" style="color:${c.bodyColor}">
      <div class="candle-wick" style="height:${c.wickT}px"></div>
      <div class="candle-body" style="height:${c.bodyH}px;background:${c.bodyColor}"></div>
      <div class="candle-wick" style="height:${c.wickB}px"></div>
    </div>
  `).join('');

  return `
  <div class="pattern-card">
    <div class="pattern-visual">${candleHtml}</div>
    <div class="pattern-name">${p.name}</div>
    <div class="pattern-signal" style="color:${p.signalColor}">${p.signal}</div>
    <div class="pattern-desc">${p.desc}</div>
  </div>`;
}

function renderEduConcepts() {
  const grid = document.getElementById('eduGrid');
  if (!grid) return;
  const cat = STATE.learnCat;
  const items = cat==='all' ? EDU_CONCEPTS : EDU_CONCEPTS.filter(e=>e.cat===cat);
  grid.innerHTML = items.map(e => makeEduCard(e)).join('');
}

function makeEduCard(e) {
  const isExp = STATE.eduExpanded[e.id];
  const rc = e.risk==='HIGH'?'risk-h':e.risk==='LOW'?'risk-l':'risk-m';

  let body = '';
  if (isExp) {
    body = `<div class="edu-body open"><div class="edu-inner">
      <div class="edu-full">${e.full.replace(/\n\n/g,'<br><br>').replace(/\n/g,' ')}</div>
      ${e.ex?`<div class="edu-example">
        <div class="edu-ex-lbl">📌 REAL WORLD EXAMPLE</div>
        <div class="edu-ex-txt"><strong>${e.ex.l}</strong><br><br>${e.ex.t}</div>
      </div>`:''}
      ${e.pts.map(pt=>`<div class="edu-kp"><div class="kp-dot" style="background:${pt.c}"></div><div class="kp-txt">${pt.t}</div></div>`).join('')}
      <div class="edu-risk">
        <span class="edu-risk-lbl">COMPLEXITY:</span>
        <span class="edu-risk-badge ${rc}">${e.risk}</span>
      </div>
      ${e.related?`<div class="edu-related">
        ${e.related.map(r=>`<span class="edu-rel-chip" onclick="jumpTerm('${r}')">${r}</span>`).join('')}
      </div>`:''}
    </div></div>`;
  } else {
    body = '<div class="edu-body"></div>';
  }

  return `
  <div class="edu-card" id="edu-${e.id}">
    <div class="edu-hdr" onclick="toggleEdu('${e.id}')">
      <div class="edu-icon" style="background:${e.color}15">${e.icon}</div>
      <div class="edu-text">
        <div class="edu-term">${e.term}</div>
        <div class="edu-one">${e.one}</div>
      </div>
      <div class="edu-chev${isExp?' open':''}">▾</div>
    </div>
    ${body}
  </div>`;
}

function toggleEdu(id) {
  STATE.eduExpanded[id] = !STATE.eduExpanded[id];
  renderEduConcepts();
}

function setLearnCat(cat, el) {
  STATE.learnCat = cat;
  document.querySelectorAll('.learn-cat').forEach(c=>c.classList.remove('on'));
  el.classList.add('on');
  renderEduConcepts();
}

function jumpTerm(term) {
  const match = EDU_CONCEPTS.find(e=>e.term.toLowerCase().includes(term.toLowerCase())||e.id.includes(term.toLowerCase().replace(/\s/g,'_')));
  if (match) {
    STATE.eduExpanded[match.id]=true; renderEduConcepts();
    setTimeout(()=>{ const el=document.getElementById(`edu-${match.id}`); if(el)el.scrollIntoView({behavior:'smooth',block:'start'}); },100);
  }
}

function goLearn(sig) {
  const idMap={swap:'swap_exposure',puts:'put_ladder',family:'family_lock',tiger:'tiger_dna',activist:'activist',buyback:'buyback'};
  const id = idMap[sig]||sig;
  switchPage('learn', document.querySelectorAll('.tb')[4]);
  setTimeout(()=>{
    STATE.eduExpanded[id]=true; renderEduConcepts();
    setTimeout(()=>{ const el=document.getElementById(`edu-${id}`); if(el)el.scrollIntoView({behavior:'smooth',block:'start'}); },100);
  },150);
}

async function loadLearnNews() {
  const grid = document.getElementById('articleGrid');
  if (!grid) return;
  grid.innerHTML = '<div class="empty"><span class="blink">Loading articles…</span></div>';
  try {
    const articles = await fetchNews('stock market short squeeze investing finance');
    if (articles.length) {
      learnNewsCache.push(...articles.slice(0,8));
      renderArticles(learnNewsCache);
    } else {
      grid.innerHTML = renderFallbackArticles();
    }
  } catch {
    grid.innerHTML = renderFallbackArticles();
  }
}

function renderArticles(articles) {
  const grid = document.getElementById('articleGrid');
  if (!grid) return;
  if (!articles.length) { grid.innerHTML=renderFallbackArticles(); return; }
  grid.innerHTML = articles.slice(0,6).map(a => `
    <a class="article-card" href="${a.link||a.url||'#'}" target="_blank" rel="noopener">
      ${a.image_url ? `<img class="article-img" src="${a.image_url}" alt="" onerror="this.style.display='none'">` : ''}
      <div class="article-body">
        <div class="article-source">${a.source_id||a.source||'Finance News'}</div>
        <div class="article-title">${a.title||''}</div>
        <div class="article-desc">${(a.description||a.content||'').slice(0,100)}…</div>
      </div>
    </a>
  `).join('');
}

function renderFallbackArticles() {
  const fallback = [
    {src:'Fintel',title:'Short Interest Data — How to Read It Like a Pro',url:'https://fintel.io',desc:'Everything you need to know about float, borrow rate, and days to cover.'},
    {src:'Investopedia',title:'Short Squeeze: Definition and How They Work',url:'https://www.investopedia.com/terms/s/shortsqueeze.asp',desc:'The mechanics of forced covering and how float constraints amplify moves.'},
    {src:'SEC.gov',title:'Understanding 13D and 13G Filings',url:'https://www.sec.gov/cgi-bin/browse-edgar',desc:'When activist investors must disclose — and what the 13G to 13D flip means.'},
    {src:'MarketBeat',title:'Short Squeeze Screener — Current Setups',url:'https://www.marketbeat.com/short-interest/',desc:'Real-time short interest data for the entire US equity market.'},
    {src:'Unusual Whales',title:'Options Flow Analysis — Following Smart Money',url:'https://unusualwhales.com',desc:'How unusual options activity signals institutional positioning before moves.'},
    {src:'Quiver Quant',title:'Congressional Trades & Institutional Positioning',url:'https://www.quiverquant.com',desc:'Alternative data sources every squeeze analyst should monitor.'},
  ];
  return fallback.map(a=>`
    <a class="article-card" href="${a.url}" target="_blank" rel="noopener">
      <div class="article-body">
        <div class="article-source">${a.src}</div>
        <div class="article-title">${a.title}</div>
        <div class="article-desc">${a.desc}</div>
      </div>
    </a>
  `).join('');
}

function renderVideos() {
  const grid = document.getElementById('videoGrid');
  if (!grid) return;
  grid.innerHTML = VIDEOS.map(v=>`
    <div class="video-card">
      <a class="video-thumb" href="${v.realUrl}" target="_blank" rel="noopener">
        <img src="https://img.youtube.com/vi/${v.id}/mqdefault.jpg" alt="${v.title}"
          onerror="this.style.background='var(--bg3)'">
        <div class="video-play">▶</div>
      </a>
      <div class="video-body">
        <div class="video-channel">${v.channel}</div>
        <div class="video-title">${v.title}</div>
        <div class="video-desc">${v.desc}</div>
      </div>
    </div>
  `).join('');
}
