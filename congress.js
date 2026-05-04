// ═══════════════════════════════════════════
//  FLOATLOCK — CONGRESS Tab
//  Congressional Trade Tracker + Alert Engine
// ═══════════════════════════════════════════

// ─── CONGRESS WATCH LIST (from transcript + seeded) ───
const CONGRESS_WATCH = [
  {
    s:'BBAI', n:'BigBear.ai', sector:'AI / Defense',
    why:'Congressional AI defense spending bill pipeline. $34.8M Q1 revenue, $107.6M cash. Small-cap that moves fast on defense contract news.',
    tags:['AI','Defense','Small-Cap'],
    alert:'Multiple members loading before AI defense budget expansion',
    color:'var(--indigo)'
  },
  {
    s:'NEE', n:'NextEra Energy', sector:'Energy / AI Power',
    why:'21-gigawatt data center power pipeline in Florida. $1.46B quarterly net income. AI power demand is the structural tailwind.',
    tags:['Energy','AI Infrastructure','Utilities'],
    alert:'Congress buying power infrastructure ahead of AI grid expansion bills',
    color:'var(--amber)'
  },
  {
    s:'MELI', n:'MercadoLibre', sector:'E-Commerce / Fintech',
    why:'$10.9B investment in Brazil, 14 new fulfillment centers, 10K jobs. Clearest bet on LatAm e-commerce + fintech growth.',
    tags:['E-Commerce','Fintech','LatAm'],
    alert:'Bipartisan accumulation — trade deal and LatAm growth narrative',
    color:'var(--emerald)'
  },
  {
    s:'IONQ', n:'IonQ', sector:'Quantum Computing',
    why:'$130M 2025 revenue (60%+ commercial), guiding $225M–$245M in 2026. Tied directly to the quantum computing race backed by NSA/DOD.',
    tags:['Quantum','Defense','Deep-Tech'],
    alert:'Defense committee members buying ahead of quantum security legislation',
    color:'var(--violet)'
  },
  {
    s:'MSFT', n:'Microsoft', sector:'AI / Cloud',
    why:'$81.2B next quarter guidance, Azure +37–38%, $25B AUD Australia AI investment. Congress\'s safe AI play — institutional without the risk.',
    tags:['AI','Cloud','Megacap'],
    alert:'Energy & Commerce committee members adding on AI infrastructure narrative',
    color:'var(--sky)'
  },
];

// ─── QUIVER QUANT API ───────────────────────
// Free congressional trading data
const QUIVER_BASE = 'https://api.quiverquant.com/beta/live/congresstrading';
const QUIVER_KEY  = ''; // Quiver free tier — no key needed for public endpoints

// ─── STATE ──────────────────────────────────
let congressTrades    = [];
let congressAlerts    = [];
let lastCongressCheck = null;
let congressCheckTimer= null;
let congressLoading   = false;
let alertCount        = 0;
let activeCongressFilter = 'ALL';
let activePartyFilter    = 'ALL';

// ─── UNUSUAL TRADE DETECTION ────────────────
const UNUSUAL_THRESHOLDS = {
  minAmount:    50000,   // $50K+ trades flagged
  alertAmount: 250000,   // $250K+ = HIGH alert
  watchTickers: new Set(CONGRESS_WATCH.map(w=>w.s)),
  watchSectors: ['AI','Defense','Quantum','Energy','Technology','Semiconductors'],
};

function scoreUnusual(trade) {
  let score = 0;
  const sym = (trade.Ticker||'').toUpperCase();
  const amt = parseFloat(trade.Range_High || trade.Amount || 0);

  if (UNUSUAL_THRESHOLDS.watchTickers.has(sym))  score += 40;
  if (amt >= 250000)  score += 30;
  else if (amt >= 50000) score += 15;
  if (trade.Transaction==='Purchase') score += 10;

  const sector = (trade.Sector||trade.Industry||'').toLowerCase();
  if (sector.includes('tech') || sector.includes('defense') || sector.includes('energy') || sector.includes('quantum')) score += 15;

  // Recency bonus
  const daysAgo = trade.daysAgo || 30;
  if (daysAgo <= 7)  score += 20;
  if (daysAgo <= 3)  score += 10;

  return Math.min(score, 99);
}

function getAlertLevel(score) {
  if (score >= 70) return { level:'CRITICAL', color:'var(--rose)',    label:'🚨 CRITICAL' };
  if (score >= 50) return { level:'HIGH',     color:'var(--amber)',   label:'⚠️ HIGH' };
  if (score >= 30) return { level:'WATCH',    color:'var(--indigo)', label:'👁 WATCH' };
  return               { level:'INFO',     color:'var(--t2)',     label:'ℹ INFO' };
}

// ─── DATA FETCHING ───────────────────────────
async function fetchCongressTrades() {
  if (congressLoading) return;
  congressLoading = true;
  setCongressStatus('load', 'FETCHING TRADES…');

  try {
    // Quiver Quant public congressional trading endpoint
    const r = await fetch('https://api.quiverquant.com/beta/live/congresstrading', {
      headers: { 'Accept': 'application/json' }
    });

    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const raw = await r.json();

    if (Array.isArray(raw) && raw.length) {
      // Enrich with computed fields
      congressTrades = raw.slice(0, 100).map(t => {
        const filed   = new Date(t.Filed || t.Date || Date.now());
        const daysAgo = Math.floor((Date.now()-filed)/86400000);
        const score   = scoreUnusual({...t, daysAgo});
        const alert   = getAlertLevel(score);
        return { ...t, daysAgo, score, alert, filed };
      });

      // Find alerts (score >= 30)
      const newAlerts = congressTrades
        .filter(t => t.score >= 30)
        .sort((a,b) => b.score - a.score)
        .slice(0, 20);

      congressAlerts = newAlerts;
      alertCount = newAlerts.filter(t => t.score >= 50).length;
      updateAlertBadge();
      setCongressStatus('ok', `${congressTrades.length} TRADES LOADED`);
    } else {
      throw new Error('No data returned');
    }
  } catch(e) {
    // Fallback to rich mock data seeded with the transcript tickers
    congressTrades = generateMockTrades();
    congressAlerts = congressTrades.filter(t => t.score >= 30).sort((a,b)=>b.score-a.score);
    alertCount = congressAlerts.filter(t => t.score >= 50).length;
    updateAlertBadge();
    setCongressStatus('ok', `${congressTrades.length} TRADES (DEMO)`);
  }

  lastCongressCheck = new Date();
  congressLoading = false;
  renderCongress();
  scheduleNextCheck();
}

function generateMockTrades() {
  const members = [
    {name:'Nancy Pelosi', party:'D', state:'CA', committee:'House Speaker Emerita'},
    {name:'Dan Crenshaw',  party:'R', state:'TX', committee:'Homeland Security'},
    {name:'Tommy Tuberville', party:'R', state:'AL', committee:'Armed Services'},
    {name:'Ro Khanna',    party:'D', state:'CA', committee:'Armed Services'},
    {name:'Michael McCaul',party:'R', state:'TX', committee:'Foreign Affairs'},
    {name:'Mark Warner',  party:'D', state:'VA', committee:'Intelligence'},
    {name:'Marjorie Taylor Greene', party:'R', state:'GA', committee:'Oversight'},
    {name:'Josh Gottheimer',party:'D', state:'NJ', committee:'Financial Services'},
    {name:'Debbie Wasserman Schultz',party:'D',state:'FL',committee:'Appropriations'},
    {name:'Pat Toomey',   party:'R', state:'PA', committee:'Banking'},
  ];

  const seeds = [
    // Transcript tickers — high score
    {Ticker:'BBAI', Issuer:'BigBear.ai Holdings', Transaction:'Purchase', Range_High:150000, Sector:'Technology', daysAgo:3},
    {Ticker:'IONQ', Issuer:'IonQ Inc', Transaction:'Purchase', Range_High:280000, Sector:'Technology', daysAgo:5},
    {Ticker:'NEE',  Issuer:'NextEra Energy', Transaction:'Purchase', Range_High:500000, Sector:'Utilities', daysAgo:2},
    {Ticker:'MSFT', Issuer:'Microsoft Corp', Transaction:'Purchase', Range_High:1000000, Sector:'Technology', daysAgo:7},
    {Ticker:'MELI', Issuer:'MercadoLibre', Transaction:'Purchase', Range_High:320000, Sector:'Consumer Discretionary', daysAgo:4},
    // Additional real-looking trades
    {Ticker:'NVDA', Issuer:'Nvidia Corp', Transaction:'Purchase', Range_High:850000, Sector:'Technology', daysAgo:6},
    {Ticker:'LMT',  Issuer:'Lockheed Martin', Transaction:'Purchase', Range_High:200000, Sector:'Aerospace & Defense', daysAgo:8},
    {Ticker:'RTX',  Issuer:'RTX Corporation', Transaction:'Purchase', Range_High:175000, Sector:'Aerospace & Defense', daysAgo:9},
    {Ticker:'GE',   Issuer:'GE Vernova', Transaction:'Purchase', Range_High:95000, Sector:'Industrials', daysAgo:11},
    {Ticker:'PLTR', Issuer:'Palantir Technologies', Transaction:'Purchase', Range_High:450000, Sector:'Technology', daysAgo:3},
    {Ticker:'AAPL', Issuer:'Apple Inc', Transaction:'Sale', Range_High:300000, Sector:'Technology', daysAgo:14},
    {Ticker:'AMD',  Issuer:'Advanced Micro Devices', Transaction:'Purchase', Range_High:125000, Sector:'Technology', daysAgo:12},
    {Ticker:'AMZN', Issuer:'Amazon.com', Transaction:'Purchase', Range_High:600000, Sector:'Consumer Discretionary', daysAgo:5},
    {Ticker:'TSM',  Issuer:'Taiwan Semiconductor', Transaction:'Purchase', Range_High:220000, Sector:'Semiconductors', daysAgo:10},
    {Ticker:'QCOM', Issuer:'Qualcomm Inc', Transaction:'Sale', Range_High:180000, Sector:'Semiconductors', daysAgo:15},
    {Ticker:'CRWD', Issuer:'CrowdStrike', Transaction:'Purchase', Range_High:90000, Sector:'Cybersecurity', daysAgo:8},
    {Ticker:'BA',   Issuer:'Boeing Company', Transaction:'Sale', Range_High:250000, Sector:'Aerospace & Defense', daysAgo:20},
    {Ticker:'XOM',  Issuer:'ExxonMobil', Transaction:'Purchase', Range_High:140000, Sector:'Energy', daysAgo:18},
    {Ticker:'IONQ', Issuer:'IonQ Inc', Transaction:'Purchase', Range_High:95000, Sector:'Technology', daysAgo:13},
    {Ticker:'BBAI', Issuer:'BigBear.ai Holdings', Transaction:'Purchase', Range_High:75000, Sector:'Technology', daysAgo:16},
  ];

  return seeds.map((s, i) => {
    const m = members[i % members.length];
    const filed = new Date(Date.now() - s.daysAgo*86400000);
    const score = scoreUnusual({...s});
    const alert = getAlertLevel(score);
    return {
      ...s, ...m,
      Representative: m.name,
      Party: m.party,
      State: m.state,
      Committee: m.committee,
      Filed: filed.toISOString().split('T')[0],
      filed, score, alert,
    };
  });
}

// ─── ALERT BADGE ────────────────────────────
function updateAlertBadge() {
  const badge = document.getElementById('congressBadge');
  if (!badge) return;
  if (alertCount > 0) {
    badge.textContent = alertCount;
    badge.style.display = 'flex';
    // Flash tab
    const tab = document.getElementById('congressTab');
    if (tab) {
      tab.style.animation = 'none';
      setTimeout(() => tab.style.animation = 'glow-pulse 2s ease 3', 10);
    }
  } else {
    badge.style.display = 'none';
  }
}

// ─── AUTO CHECK EVERY 2 HOURS ───────────────
function scheduleNextCheck() {
  if (congressCheckTimer) clearTimeout(congressCheckTimer);
  congressCheckTimer = setTimeout(() => {
    fetchCongressTrades();
  }, 2 * 60 * 60 * 1000); // 2 hours

  // Update countdown
  updateCheckCountdown();
}

function updateCheckCountdown() {
  const el = document.getElementById('nextCheckEl');
  if (!el) return;
  const nextCheck = lastCongressCheck ? new Date(lastCongressCheck.getTime() + 2*60*60*1000) : null;
  if (nextCheck) {
    const diff = Math.max(0, nextCheck - Date.now());
    const h = Math.floor(diff/3600000);
    const m = Math.floor((diff%3600000)/60000);
    el.textContent = `Next scan in ${h}h ${m}m`;
  }
  setTimeout(updateCheckCountdown, 30000);
}

// ─── STATUS ─────────────────────────────────
function setCongressStatus(cls, txt) {
  const el = document.getElementById('si-congress');
  if (!el) return;
  el.className = 'si ' + cls;
  el.querySelector('.si-txt').textContent = 'CONGRESS: ' + txt;
}

// ─── RENDER ─────────────────────────────────
function renderCongress() {
  renderCongressAlerts();
  renderCongressWatchPins();
  renderCongressFeed();
}

function renderCongressAlerts() {
  const el = document.getElementById('congressAlertsBanner');
  if (!el) return;

  const critical = congressAlerts.filter(t=>t.score>=50);
  if (!critical.length) { el.style.display='none'; return; }

  el.style.display = 'block';
  el.innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;padding:12px 16px;background:rgba(240,79,110,0.08);border-bottom:1px solid rgba(240,79,110,0.2)">
      <span style="font-size:20px">🚨</span>
      <div>
        <div style="font-size:12px;font-weight:700;color:var(--rose)">UNUSUAL ACTIVITY DETECTED</div>
        <div style="font-family:var(--mono);font-size:9px;color:var(--t1);margin-top:2px">
          ${critical.length} high-conviction congressional trade${critical.length>1?'s':''} — ${critical.map(t=>t.Ticker).join(', ')}
        </div>
      </div>
      <div style="margin-left:auto;font-family:var(--mono);font-size:8px;color:var(--t2)">
        ${lastCongressCheck?.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'})||''}
      </div>
    </div>
    ${critical.slice(0,3).map(t => makeAlertRow(t)).join('')}
  `;
}

function makeAlertRow(t) {
  const watch = CONGRESS_WATCH.find(w=>w.s===t.Ticker);
  const amt = formatAmount(t.Range_High||t.Amount||0);
  return `
  <div style="padding:10px 16px;border-bottom:1px solid var(--line);display:flex;align-items:center;gap:12px">
    <div style="width:36px;height:36px;border-radius:9px;background:${t.alert.color}18;
      border:1px solid ${t.alert.color}33;display:flex;align-items:center;justify-content:center;
      font-family:var(--mono);font-size:9px;color:${t.alert.color};flex-shrink:0;font-weight:700">${t.Ticker||'?'}</div>
    <div style="flex:1;min-width:0">
      <div style="font-size:11px;font-weight:700">${t.Representative||t.name||'Member'} <span style="color:${t.Party==='D'?'var(--indigo)':'var(--rose)'};">(${t.Party||'?'})</span></div>
      <div style="font-family:var(--mono);font-size:9px;color:var(--t1);margin-top:1px">
        ${t.Transaction==='Purchase'?'🟢':'🔴'} ${t.Transaction} · ${amt} · ${t.daysAgo}d ago
      </div>
      ${watch?`<div style="font-family:var(--mono);font-size:8px;color:var(--amber);margin-top:2px">⚡ TRANSCRIPT MATCH: ${watch.alert}</div>`:''}
    </div>
    <div style="text-align:right;flex-shrink:0">
      <div style="font-family:var(--mono);font-size:8px;padding:3px 8px;border-radius:8px;
        background:${t.alert.color}18;color:${t.alert.color};border:1px solid ${t.alert.color}33">${t.alert.label}</div>
      <div style="font-family:var(--mono);font-size:8px;color:var(--t2);margin-top:3px">${t.score}/99</div>
    </div>
  </div>`;
}

function renderCongressWatchPins() {
  const el = document.getElementById('congressWatchPins');
  if (!el) return;

  el.innerHTML = CONGRESS_WATCH.map(w => {
    const price = STATE.prices[w.s];
    const chg   = price ? price.ch : null;
    const trades= congressTrades.filter(t=>(t.Ticker||'').toUpperCase()===w.s);
    const buys  = trades.filter(t=>t.Transaction==='Purchase').length;
    const totalAmt = trades.reduce((a,t)=>a+(t.Range_High||0),0);

    return `
    <div style="flex-shrink:0;width:130px;background:var(--bg2);border:1px solid ${w.color}33;
      border-left:3px solid ${w.color};border-radius:12px;padding:12px;cursor:pointer"
      onclick="filterCongressBySym('${w.s}')">
      <div style="font-family:var(--mono);font-size:7px;color:var(--t2);letter-spacing:1px;margin-bottom:4px">${w.sector}</div>
      <div style="font-weight:800;font-size:16px;color:${w.color}">${w.s}</div>
      <div style="font-size:9px;color:var(--t1);margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${w.n}</div>
      <div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap">
        ${buys>0?`<span style="font-family:var(--mono);font-size:7px;padding:2px 6px;border-radius:6px;background:rgba(16,201,143,.1);color:var(--emerald);border:1px solid rgba(16,201,143,.2)">${buys} BUY${buys>1?'S':''}</span>`:''}
        ${totalAmt>0?`<span style="font-family:var(--mono);font-size:7px;padding:2px 6px;border-radius:6px;background:rgba(240,165,0,.1);color:var(--amber);border:1px solid rgba(240,165,0,.2)">${formatAmount(totalAmt)}</span>`:''}
      </div>
      ${price?`<div style="font-family:var(--mono);font-size:10px;margin-top:5px">${'$'+price.p.toFixed(2)} <span style="${chg>=0?'color:var(--emerald)':'color:var(--rose)'}">${chg>=0?'+':''}${chg?.toFixed(2)}%</span></div>`:''}
      <div style="font-family:var(--mono);font-size:7px;color:var(--t2);margin-top:4px;line-height:1.4">${w.tags.join(' · ')}</div>
    </div>`;
  }).join('');
}

function renderCongressFeed() {
  const grid = document.getElementById('congressFeed');
  if (!grid) return;

  let list = [...congressTrades];

  // Filter
  if (activeCongressFilter !== 'ALL') {
    if (activeCongressFilter==='BUYS')   list = list.filter(t=>t.Transaction==='Purchase');
    if (activeCongressFilter==='SELLS')  list = list.filter(t=>t.Transaction==='Sale');
    if (activeCongressFilter==='ALERTS') list = list.filter(t=>t.score>=30);
    if (activeCongressFilter==='WATCH')  list = list.filter(t=>UNUSUAL_THRESHOLDS.watchTickers.has((t.Ticker||'').toUpperCase()));
  }
  if (activePartyFilter!=='ALL') list = list.filter(t=>t.Party===activePartyFilter);

  // Sort by score desc then date
  list.sort((a,b)=>b.score-a.score||b.daysAgo-a.daysAgo);

  if (!list.length) { grid.innerHTML='<div class="empty">No trades match current filters</div>'; return; }

  grid.innerHTML = list.map((t,i)=>makeTradeCard(t,i)).join('');
}

function makeTradeCard(t, idx) {
  const sym    = (t.Ticker||'?').toUpperCase();
  const watch  = CONGRESS_WATCH.find(w=>w.s===sym);
  const isBuy  = t.Transaction==='Purchase';
  const amt    = formatAmount(t.Range_High||t.Amount||0);
  const party  = t.Party || (t.Representative||'').includes('Pelosi')?'D':'?';
  const partyC = party==='D'?'var(--indigo)':party==='R'?'var(--rose)':'var(--t2)';
  const score  = t.score||0;
  const alert  = t.alert||getAlertLevel(score);
  const price  = STATE.prices[sym];
  const chg    = price?.ch;

  return `
  <div style="background:var(--bg2);border:1px solid ${score>=50?alert.color+'44':'var(--line)'};
    border-left:3px solid ${isBuy?'var(--emerald)':'var(--rose)'};
    border-radius:14px;overflow:hidden;animation:fadein .3s ease both;animation-delay:${Math.min(idx*.04,.4)}s">

    <!-- Card header -->
    <div style="padding:13px 13px 10px;display:flex;align-items:center;gap:10px">
      <!-- Logo/sym -->
      <div style="width:42px;height:42px;border-radius:10px;background:var(--bg3);border:1px solid var(--line2);
        display:flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0;position:relative">
        <img src="https://logo.clearbit.com/${sym.toLowerCase()}.com" alt="${sym}"
          style="width:100%;height:100%;object-fit:contain;padding:6px"
          onerror="this.outerHTML='<div style=font-family:var(--mono);font-size:9px;color:var(--t1)>${sym.slice(0,4)}</div>'">
        ${score>=50?`<div style="position:absolute;top:-2px;right:-2px;width:10px;height:10px;border-radius:50%;background:${alert.color};border:2px solid var(--bg2)"></div>`:''}
      </div>

      <!-- Info -->
      <div style="flex:1;min-width:0">
        <div style="display:flex;align-items:center;gap:6px">
          <span style="font-weight:800;font-size:16px;letter-spacing:-.3px">${sym}</span>
          <span style="font-family:var(--mono);font-size:8px;padding:2px 6px;border-radius:6px;
            background:${isBuy?'rgba(16,201,143,.12)':'rgba(240,79,110,.12)'};
            color:${isBuy?'var(--emerald)':'var(--rose)'};
            border:1px solid ${isBuy?'rgba(16,201,143,.3)':'rgba(240,79,110,.3)'}">${isBuy?'▲ BUY':'▼ SELL'}</span>
          ${score>=30?`<span style="font-family:var(--mono);font-size:7px;padding:2px 6px;border-radius:6px;background:${alert.color}18;color:${alert.color};border:1px solid ${alert.color}33">${alert.label}</span>`:''}
        </div>
        <div style="font-size:11px;color:var(--t1);margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${t.Issuer||t.n||sym}</div>
        <div style="font-family:var(--mono);font-size:8px;color:var(--t2);margin-top:2px">
          <span style="color:${partyC}">● ${t.Representative||t.name||'Member'} (${party}-${t.State||'?'})</span>
          ${t.Committee?`· ${t.Committee}`:''}
        </div>
      </div>

      <!-- Right: amount + price -->
      <div style="text-align:right;flex-shrink:0">
        <div style="font-family:var(--mono);font-size:14px;font-weight:500;color:${isBuy?'var(--emerald)':'var(--rose)'}">${amt}</div>
        ${price?`<div style="font-family:var(--mono);font-size:10px;color:var(--t1);margin-top:2px">$${price.p.toFixed(2)}</div>`:''}
        ${chg!=null?`<div style="font-family:var(--mono);font-size:9px;color:${chg>=0?'var(--emerald)':'var(--rose)'}">${chg>=0?'+':''}${chg.toFixed(2)}%</div>`:''}
        <div style="font-family:var(--mono);font-size:8px;color:var(--t2);margin-top:3px">${t.daysAgo}d ago · ${t.Filed||''}</div>
      </div>
    </div>

    <!-- Watch match -->
    ${watch?`
    <div style="margin:0 12px 10px;padding:9px 11px;background:rgba(240,165,0,.06);border:1px solid rgba(240,165,0,.2);border-radius:8px">
      <div style="font-family:var(--mono);font-size:7px;color:var(--amber);letter-spacing:1px;margin-bottom:4px">📌 CONGRESS WATCH — TRANSCRIPT MATCH</div>
      <div style="font-size:10px;color:var(--t1);line-height:1.5">${watch.alert}</div>
      <div style="display:flex;gap:4px;margin-top:6px;flex-wrap:wrap">
        ${watch.tags.map(tag=>`<span style="font-family:var(--mono);font-size:7px;padding:2px 7px;border-radius:8px;background:var(--bg3);border:1px solid var(--line2);color:var(--t2)">${tag}</span>`).join('')}
      </div>
    </div>`:''}

    <!-- Sector + score bar -->
    <div style="padding:0 12px 12px;display:flex;align-items:center;gap:10px">
      <div style="font-family:var(--mono);font-size:8px;color:var(--t2);flex-shrink:0">${t.Sector||t.sector||'—'}</div>
      <div style="flex:1;height:2px;background:var(--line2);border-radius:1px;overflow:hidden">
        <div style="height:100%;width:${score}%;background:${alert.color};border-radius:1px;transition:width .6s ease"></div>
      </div>
      <div style="font-family:var(--mono);font-size:9px;color:${alert.color};width:36px;text-align:right">${score}/99</div>
    </div>
  </div>`;
}

// ─── HELPERS ────────────────────────────────
function formatAmount(n) {
  if (!n) return '—';
  if (n >= 1000000) return '$' + (n/1000000).toFixed(1) + 'M';
  if (n >= 1000)    return '$' + Math.round(n/1000) + 'K';
  return '$' + n;
}

function filterCongressBySym(sym) {
  // Scroll to feed and highlight
  const feed = document.getElementById('congressFeed');
  if (feed) feed.scrollIntoView({behavior:'smooth',block:'start'});
  // Filter to just this ticker temporarily
  const prev = activeCongressFilter;
  activeCongressFilter = 'ALL';
  const list = congressTrades.filter(t=>(t.Ticker||'').toUpperCase()===sym);
  const grid = document.getElementById('congressFeed');
  if (grid) grid.innerHTML = list.map((t,i)=>makeTradeCard(t,i)).join('') +
    `<div style="text-align:center;padding:12px"><button onclick="resetCongressFilter()" style="font-family:var(--mono);font-size:9px;padding:6px 14px;border:1px solid var(--line2);border-radius:20px;color:var(--t1);background:none;cursor:pointer">← Show All Trades</button></div>`;
}

function resetCongressFilter() {
  activeCongressFilter = 'ALL';
  renderCongressFeed();
}

function setCongressFilter(f, el) {
  activeCongressFilter = f;
  document.querySelectorAll('[data-cf]').forEach(p=>p.className='pill');
  const cls = {ALL:'on-indigo',BUYS:'on-emerald',SELLS:'on-rose',ALERTS:'on-amber',WATCH:'on-violet'};
  el.classList.add(cls[f]||'on-indigo');
  renderCongressFeed();
}

function setPartyFilter(p, el) {
  activePartyFilter = p;
  document.querySelectorAll('[data-pf]').forEach(x=>x.className='pill');
  const cls = {ALL:'on-indigo',D:'on-indigo',R:'on-rose'};
  el.classList.add(cls[p]||'on-indigo');
  renderCongressFeed();
}

async function manualCongressRefresh() {
  const btn = document.getElementById('congressRfBtn');
  if (btn) { btn.disabled=true; btn.textContent='…'; }
  await fetchCongressTrades();
  if (btn) { btn.disabled=false; btn.textContent='↻ SCAN NOW'; }
}
