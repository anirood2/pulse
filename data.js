// ═══════════════════════════════════════════
//  FLOATLOCK — Core Data & API Layer
// ═══════════════════════════════════════════
'use strict';

// ─── API KEYS ───────────────────────────────
const FH_KEY = 'cvemjnhr01qhb9f8n2a0cvemjnhr01qhb9f8n2ag';
const NEWS_KEY = 'pub_85279b94b1bf59cf0d52b83196ef0a75f05f'; // newsdata.io free key
const CLAUDE_MODEL = 'claude-sonnet-4-20250514';

// ─── TICKER UNIVERSE ────────────────────────
const TICKERS = [
  {s:'CAR', n:'Avis Budget Group',       sec:'Consumer',   sp:62,dtc:7.3,fl:10.1,mc:17.4,sigs:['swap','puts','tiger'],  th:'<strong>The blueprint.</strong> SRS (Tiger alum) holds 49.3% via cash-settled swap locked off float. Pentwater put ladder at $110–$130 forced dealer delivery of 2.8M+ shares. Float was mathematically zero before the squeeze.'},
  {s:'H',   n:'Hyatt Hotels Corp',        sec:'Consumer',   sp:21,dtc:5.4,fl:41.8,mc:14.2,sigs:['family','buyback'],   th:'<strong>Top structural candidate.</strong> Pritzker family: 54.4% economic + 88.9% voting power. $600M buyback shrinking float. Governance transition creates activist window.'},
  {s:'CHH', n:'Choice Hotels Intl',       sec:'Consumer',   sp:52,dtc:8.1,fl:38.2,mc:4.6, sigs:['family','puts'],     th:'<strong>Same cluster as CAR.</strong> Founder family concentration. 52% float short. Q1 earnings is the ignition event.'},
  {s:'HTZ', n:'Hertz Global',             sec:'Consumer',   sp:44,dtc:6.2,fl:285, mc:1.8, sigs:['puts'],              th:'<strong>CAR peer.</strong> 44% float short. Already up 65% in CAR sympathy — hasn\'t had its own moment yet.'},
  {s:'CODI',n:'Compass Diversified',      sec:'Industrials',sp:18,dtc:9.3,fl:62,  mc:1.1, sigs:['activist','puts'],  th:'<strong>ADW Capital play.</strong> 13D filed at 14% exposure demanding liquidation at $26+/share.'},
  {s:'LCID',n:'Lucid Group',              sec:'EV',         sp:38,dtc:4.8,fl:2100,mc:6.2, sigs:['family','puts'],    th:'<strong>Saudi PIF float lock.</strong> PIF owns ~58%. Any capital injection into 38% short float cascades.'},
  {s:'GRPN',n:'Groupon',                  sec:'Technology', sp:46,dtc:12.1,fl:22, mc:0.35,sigs:['activist'],         th:'<strong>Highest short % in 2026.</strong> 12+ days to cover. Tiny float amplifies any catalyst.'},
  {s:'HIMS',n:'Hims & Hers Health',       sec:'Healthcare', sp:29,dtc:5.1,fl:190, mc:3.1, sigs:['activist'],         th:'<strong>GLP-1 binary catalyst.</strong> 29% float short. FDA ruling on compounding is the binary event.'},
  {s:'BYND',n:'Beyond Meat',              sec:'Staples',    sp:41,dtc:7.8,fl:48,  mc:0.22,sigs:['activist'],         th:'<strong>Classic distressed setup.</strong> 41% float short. Tiny cap means any catalyst moves it violently.'},
  {s:'PLUG',n:'Plug Power',               sec:'Energy',     sp:26,dtc:4.2,fl:520, mc:1.4, sigs:['puts'],             th:'<strong>Hydrogen subsidy squeeze.</strong> DOE loan guarantee is the catalyst into 26% short float.'},
  {s:'W',   n:'Wayfair',                  sec:'Consumer',   sp:33,dtc:6.1,fl:112, mc:4.8, sigs:['puts','buyback'],  th:'<strong>Housing recovery play.</strong> 33% float short. Any rate decline triggers violent cover.'},
  {s:'OPEN',n:'Opendoor Technologies',    sec:'Real Estate',sp:31,dtc:5.9,fl:620, mc:1.2, sigs:['activist','puts'], th:'<strong>iBuying short crowded.</strong> 31% float. Activists circling asset value gap.'},
  {s:'MARA',n:'MARA Holdings',            sec:'Crypto',     sp:28,dtc:3.2,fl:280, mc:4.1, sigs:['puts'],            th:'<strong>Bitcoin proxy short.</strong> Any BTC breakout forces simultaneous cover across mining stocks.'},
  {s:'CHTR',n:'Charter Communications',  sec:'Telecom',    sp:22,dtc:6.8,fl:148, mc:39.2,sigs:['buyback','family'],th:'<strong>Systematic float compression.</strong> Liberty Media block + aggressive buyback.'},
  {s:'SMMT',n:'Summit Therapeutics',      sec:'Biotech',    sp:35,dtc:7.2,fl:82,  mc:8.4, sigs:['activist','family'],th:'<strong>Oncology binary.</strong> Phase 3 ivonescimab data into 35% short float.'},
  {s:'BETR',n:'Better Home & Finance',    sec:'Fintech',    sp:44,dtc:11.2,fl:12, mc:0.08,sigs:['activist','puts'], th:'<strong>Tiny float extreme short.</strong> 44% on 12M float. DTC 11 days = near impossible cover without explosion.'},
  {s:'ASTS',n:'AST SpaceMobile',          sec:'Satellite',  sp:30,dtc:4.6,fl:95,  mc:8.1, sigs:['family','puts'],  th:'<strong>Satellite squeeze.</strong> Avellan + AT&T/Vodafone blocks. Any launch success triggers forcing function.'},
  {s:'MXL', n:'MaxLinear',                sec:'Semis',      sp:23,dtc:7.9,fl:52,  mc:0.88,sigs:['activist','buyback'],th:'<strong>Semi short tight float.</strong> DOCSIS 4.0 + Wi-Fi 7 launches.'},
  {s:'SOFI',n:'SoFi Technologies',        sec:'Fintech',    sp:19,dtc:3.4,fl:780, mc:8.2, sigs:['activist'],        th:'<strong>Fintech regulatory.</strong> Student loan restart + bank charter thesis.'},
  {s:'NKLA',n:'Nikola Corporation',       sec:'EV',         sp:44,dtc:8.4,fl:380, mc:0.18,sigs:['activist'],        th:'<strong>Distressed squeeze.</strong> 44% short. Tiny cap.'},
  {s:'SMTC',n:'Semtech Corp',              sec:'Semis',      sp:15,dtc:4.2,fl:93,  mc:8.1, sigs:['activist'],       th:'<strong>Not yet run — same as CRDO months ago.</strong> FiberEdge 1.6T DSPs. 14/14 analysts Buy. $104 consensus vs ~$87 price.'},
  {s:'CRDO',n:'Credo Technology',          sec:'Semis',      sp:8, dtc:2.1,fl:190, mc:14.2,sigs:[],                 th:'<strong>Already ran — multi-year ramp just beginning.</strong> 800G to 1.6T content ramp.'},
  {s:'MU',  n:'Micron Technology',         sec:'Semis',      sp:12,dtc:3.1,fl:1100,mc:29.3,sigs:[],                 th:'<strong>Running with upside left.</strong> HBM3E/HBM4 sold out 2026.'},
  {s:'NVDA',n:'Nvidia',                    sec:'AI/GPU',     sp:3, dtc:1.2,fl:2400,mc:455, sigs:[],                 th:'<strong>Already ran — compounding business.</strong> $500B orders.'},
  {s:'AMD', n:'Advanced Micro Devices',    sec:'Semis',      sp:11,dtc:2.4,fl:1600,mc:170, sigs:[],                 th:'<strong>Coiling at key level.</strong> MI300X ramp underappreciated.'},
  {s:'QCOM',n:'Qualcomm',                  sec:'Semis',      sp:9, dtc:2.2,fl:1070,mc:175, sigs:[],                 th:'<strong>Three catalysts not yet priced.</strong> AI PCs, automotive wins, edge AI inference.'},
  {s:'INTC',n:'Intel Corp',                sec:'Semis',      sp:14,dtc:3.8,fl:4200,mc:88,  sigs:[],                 th:'<strong>Turnaround binary on watch.</strong> 18A process validation is the entire thesis.'},
  {s:'WOLF',n:'Wolfspeed',                 sec:'SiC/Power',  sp:31,dtc:7.4,fl:125, mc:1.1, sigs:[],                th:'<strong>Distressed SiC — high risk watch.</strong> Only domestic SiC wafer manufacturer at scale.'},
];

const PRICE_TARGETS = {
  CAR:150,H:180,CHH:110,HTZ:8,CODI:26,LCID:4,GRPN:18,HIMS:24,BYND:5,PLUG:3,
  W:55,OPEN:3,MARA:22,CHTR:400,SMMT:65,BETR:12,ASTS:35,MXL:24,SOFI:14,
  NKLA:2,SMTC:104,CRDO:175,MU:305,NVDA:250,AMD:160,QCOM:230,INTC:28,WOLF:18
};

// ─── SIGNAL CONFIG ──────────────────────────
const SIG_CFG = {
  swap:     { color:'var(--rose)',    label:'⚡ SWAP',        edId:'swap_exposure' },
  puts:     { color:'var(--amber)',   label:'📉 PUT LADDER',  edId:'put_ladder' },
  family:   { color:'var(--sky)',     label:'🏛 FAMILY LOCK', edId:'family_lock' },
  tiger:    { color:'var(--violet)',  label:'🐯 TIGER DNA',   edId:'tiger_dna' },
  activist: { color:'var(--emerald)', label:'🎯 ACTIVIST',    edId:'activist' },
  buyback:  { color:'#F472B6',       label:'🔄 BUYBACK',     edId:'buyback' },
};

const LANE_COLORS = {
  EXTREME:'var(--rose)', HIGH:'var(--amber)', ELEVATED:'var(--indigo)', WATCHLIST:'var(--t2)'
};

const STAGE_COLORS  = { RAN:'var(--rose)', RUNNING:'var(--amber)', NOTYET:'var(--emerald)', COILING:'var(--indigo)', WATCH:'var(--violet)' };
const STAGE_EMOJIS  = { RAN:'🔴', RUNNING:'🟠', NOTYET:'🟢', COILING:'🔵', WATCH:'🟣' };
const STAGE_ORDER   = { RAN:0, RUNNING:1, NOTYET:2, COILING:3, WATCH:4 };

// ─── APP STATE ──────────────────────────────
const STATE = {
  prices:   {},
  techCache:{},
  stages:   {},
  custom:   [],
  expanded: {},
  dtabs:    {},
  rrExpanded:{},
  eduExpanded:{},
  activeSig:  'ALL',
  activeLane: 'ALL',
  activeSort: 'score',
  rrStage:    'ALL',
  rrSort:     'stage',
  learnCat:   'all',
  techBusy:   false,
  techDone:   0,
  analyzeTarget: null,
};

// ─── FINNHUB API ────────────────────────────
async function fetchQuote(sym) {
  try {
    const r = await fetch(`https://finnhub.io/api/v1/quote?symbol=${sym}&token=${FH_KEY}`);
    const d = await r.json();
    if (d && d.c > 0) return { p:d.c, ch:d.dp, h:d.h, l:d.l, pc:d.pc };
    return null;
  } catch { return null; }
}

async function fetchProfile(sym) {
  try {
    const r = await fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${sym}&token=${FH_KEY}`);
    return await r.json();
  } catch { return null; }
}

async function fetchCandles(sym) {
  const now  = Math.floor(Date.now()/1000);
  const from = now - 300*24*3600;
  try {
    const r = await fetch(`https://finnhub.io/api/v1/stock/candle?symbol=${sym}&resolution=D&from=${from}&to=${now}&token=${FH_KEY}`);
    return await r.json();
  } catch { return null; }
}

async function fetchNews(query = 'stock market finance') {
  // Using newsdata.io free tier
  try {
    const r = await fetch(`https://newsdata.io/api/1/news?apikey=${NEWS_KEY}&q=${encodeURIComponent(query)}&language=en&category=business`);
    const d = await r.json();
    return d.results || [];
  } catch { return []; }
}

// ─── TECHNICAL ANALYSIS ─────────────────────
function calcRSI(closes, period=14) {
  if (closes.length < period+1) return null;
  let gains=0, losses=0;
  for (let i=1; i<=period; i++) {
    const d = closes[i]-closes[i-1];
    if (d>0) gains+=d; else losses+=Math.abs(d);
  }
  let ag=gains/period, al=losses/period;
  for (let j=period+1; j<closes.length; j++) {
    const dd = closes[j]-closes[j-1];
    ag = (ag*(period-1)+(dd>0?dd:0))/period;
    al = (al*(period-1)+(dd<0?Math.abs(dd):0))/period;
  }
  if (al===0) return 100;
  return Math.round(100-100/(1+ag/al));
}

function calcEMA(data, period) {
  const k = 2/(period+1);
  let ema = data[0];
  for (let i=1; i<data.length; i++) ema = data[i]*k + ema*(1-k);
  return ema;
}

function calcMACD(closes) {
  if (closes.length < 26) return null;
  const ema12 = calcEMA(closes.slice(-12), 12);
  const ema26 = calcEMA(closes.slice(-26), 26);
  const macd  = ema12 - ema26;
  const sig   = calcEMA([macd], 9);
  return { val:macd, hist:macd-sig, label:(macd-sig)>0?'BULLISH':'BEARISH' };
}

async function computeTech(sym) {
  const cached = STATE.techCache[sym];
  if (cached && (Date.now()-cached.ts) < 900000) return cached;
  const d = await fetchCandles(sym);
  if (!d || d.s!=='ok' || !d.c || d.c.length<50) return null;
  const closes=d.c, vols=d.v, n=closes.length;
  const rsi    = calcRSI(closes);
  const macdObj= calcMACD(closes);
  const ma50   = closes.slice(-50).reduce((a,b)=>a+b,0)/Math.min(50,n);
  const ma200  = closes.slice(-200).reduce((a,b)=>a+b,0)/Math.min(200,n);
  const cur    = closes[n-1];
  const ma50p  = ((cur-ma50)/ma50*100).toFixed(1);
  const ma200p = ((cur-ma200)/ma200*100).toFixed(1);
  const avgVol = vols.slice(-20,-1).reduce((a,b)=>a+b,0)/19;
  const volR   = avgVol>0?(vols[n-1]/avgVol).toFixed(2):'1.00';
  const h52    = Math.max(...closes.slice(-252));
  const l52    = Math.min(...closes.slice(-252));
  const ytdS   = closes[Math.max(0,n-252)];
  const ytd    = ((cur-ytdS)/ytdS*100).toFixed(1);
  const hi52p  = ((cur-h52)/h52*100).toFixed(1);
  const result = {rsi,macdObj,ma50p,ma200p,volR,ytd,hi52p,h52,l52,cur,ts:Date.now()};
  STATE.techCache[sym] = result;
  return result;
}

// ─── STAGE CLASSIFIER ───────────────────────
function classify(tech, ticker) {
  if (!tech) return {stage:'WATCH',reason:'Insufficient data — monitoring',conf:30};
  const {rsi,macdObj,ma50p,ytd:ytdStr,volR:volRStr} = tech;
  const ytd   = parseFloat(ytdStr);
  const ma50  = parseFloat(ma50p);
  const macdB = macdObj && macdObj.label==='BULLISH';
  const volR  = parseFloat(volRStr);
  const pt    = PRICE_TARGETS[ticker.s]||0;
  const upside= pt && tech.cur ? ((pt-tech.cur)/tech.cur*100) : 0;

  if (rsi>=70 && ma50>=15 && ytd>=30)
    return {stage:'RAN',reason:`RSI ${rsi} (overbought) · +${ma50}% vs 50d MA · +${ytd}% YTD`,conf:90};
  if (rsi>=65 && ytd>=50)
    return {stage:'RAN',reason:`RSI ${rsi} extended · +${ytd}% YTD priced in`,conf:82};
  if (rsi>=58 && rsi<70 && macdB && ma50>=5)
    return {stage:'RUNNING',reason:`RSI ${rsi} · MACD bullish · +${ma50}% vs 50d MA`,conf:84};
  if (rsi>=60 && volR>=1.5)
    return {stage:'RUNNING',reason:`RSI ${rsi} with ${volR}x volume surge — breakout underway`,conf:76};
  if (rsi<55 && upside>=20 && (macdB||Math.abs(ma50)<10))
    return {stage:'NOTYET',reason:`RSI ${rsi} (room to run) · ${Math.round(upside)}% analyst upside`,conf:80};
  if (rsi<50 && upside>=30 && ticker.sp>=20)
    return {stage:'NOTYET',reason:`RSI ${rsi} · ${Math.round(upside)}% upside · ${ticker.sp}% short float`,conf:84};
  if (rsi>=42 && rsi<58 && Math.abs(ma50)<8)
    return {stage:'COILING',reason:`RSI ${rsi} neutral · ${ma50}% from 50d MA — energy building`,conf:72};
  if (rsi<42)
    return {stage:'WATCH',reason:`RSI ${rsi} (oversold) · ${ma50}% from MA — monitoring for reversal`,conf:60};
  return {stage:'WATCH',reason:`RSI ${rsi} · ${ma50}% from MA · ${ytd}% YTD`,conf:55};
}

// ─── FLS SCORING ────────────────────────────
function calcFLS(t) {
  const tech = STATE.techCache[t.s];
  let s = 0;
  s += Math.min(t.sp*0.35, 35);
  s += Math.min(t.dtc*2, 20);
  if (t.sigs.includes('swap'))     s += 30;
  if (t.sigs.includes('tiger'))    s += 12;
  if (t.sigs.includes('family'))   s += 10;
  if (t.sigs.includes('puts'))     s += 8;
  if (t.sigs.includes('activist')) s += 6;
  if (t.sigs.includes('buyback'))  s += 4;
  if (t.fl < 15)       s += 15;
  else if (t.fl < 50)  s += 10;
  else if (t.fl < 100) s += 5;
  if (tech && tech.rsi < 45 && t.sp > 20) s += 5;
  return Math.min(Math.round(s), 99);
}

function getLane(t) {
  const sc = calcFLS(t);
  if (sc>=68 || t.sigs.includes('swap')) return 'EXTREME';
  if (sc>=48) return 'HIGH';
  if (sc>=32) return 'ELEVATED';
  return 'WATCHLIST';
}

function flsColor(sc) {
  if (sc>=68) return 'var(--rose)';
  if (sc>=48) return 'var(--amber)';
  if (sc>=32) return 'var(--indigo)';
  return 'var(--t2)';
}

function rsiColor(r) {
  if (!r) return 'var(--t2)';
  if (r>70) return 'var(--rose)';
  if (r<40) return 'var(--emerald)';
  if (r>58) return 'var(--amber)';
  return 'var(--t1)';
}

// ─── DATA LOADING ───────────────────────────
function allTickers() { return [...TICKERS, ...STATE.custom]; }

async function loadPrices() {
  setStatus('si-price','PRICES: LOADING','load');
  const all = allTickers();
  let done = 0;
  await Promise.all(all.map(async t => {
    const q = await fetchQuote(t.s);
    if (q) { STATE.prices[t.s] = q; done++; }
  }));
  setStatus('si-price', `PRICES: ${done}/${all.length} LIVE`, done>0?'ok':'err');
  setEl('s4', `${done}/${all.length}`);
}

async function loadTech() {
  if (STATE.techBusy) return;
  STATE.techBusy = true; STATE.techDone = 0;
  const all = allTickers();
  setStatus('si-tech','TECH: COMPUTING','load');
  setStatus('si-stage','STAGE: PENDING','load');

  const batchLoad = async (i) => {
    if (i >= all.length) {
      setStatus('si-tech', `TECH: ${STATE.techDone}/${all.length}`, STATE.techDone>0?'ok':'err');
      setStatus('si-stage','STAGE: AUTO-CLASSIFIED','ok');
      setEl('s5', `${STATE.techDone}/${all.length}`);
      setEl('si-updated', `UPDATED ${new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'})}`);
      STATE.techBusy = false;
      renderScreen();
      if (document.getElementById('pg-radar').classList.contains('active')) renderRadar();
      return;
    }
    const batch = all.slice(i, i+4);
    await Promise.all(batch.map(async t => {
      const tech = await computeTech(t.s);
      if (tech) { STATE.techDone++; STATE.stages[t.s] = classify(tech,t); }
    }));
    renderScreen();
    setStatus('si-tech', `TECH: ${Math.min(i+4,all.length)}/${all.length}`,'load');
    setTimeout(() => batchLoad(i+4), 350);
  };
  batchLoad(0);
}

// ─── CLAUDE API ─────────────────────────────
async function callClaude(prompt, useWebSearch=true) {
  const body = {
    model: CLAUDE_MODEL,
    max_tokens: 1000,
    messages: [{ role:'user', content: prompt }],
  };
  if (useWebSearch) {
    body.tools = [{ type:'web_search_20250305', name:'web_search' }];
  }
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type':'application/json' },
    body: JSON.stringify(body)
  });
  const d = await r.json();
  const text = d.content
    .filter(b => b.type==='text')
    .map(b => b.text)
    .join('\n');
  return text || 'Analysis complete. Please check the sources for details.';
}

// ─── DOM HELPERS ────────────────────────────
function setEl(id, html) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = html;
}

function setStatus(id, txt, cls='') {
  const el = document.getElementById(id);
  if (!el) return;
  el.className = 'si ' + cls;
  el.querySelector('.si-txt').textContent = txt;
}

function formatResult(text) {
  if (!text) return '<span style="color:var(--t2)">No content returned.</span>';

  return text
    // Headers
    .replace(/^###\s+(.+)$/gm, '<div style="font-size:13px;font-weight:800;color:var(--t0);margin:16px 0 6px;letter-spacing:-.2px;border-bottom:1px solid var(--line);padding-bottom:5px">$1</div>')
    .replace(/^##\s+(.+)$/gm,  '<div style="font-size:14px;font-weight:800;color:var(--t0);margin:18px 0 8px;letter-spacing:-.3px">$1</div>')
    .replace(/^#\s+(.+)$/gm,   '<div style="font-size:16px;font-weight:800;color:var(--t0);margin:20px 0 10px;letter-spacing:-.5px">$1</div>')
    // Bold + italic
    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em style="color:var(--amber);font-style:normal">$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--t0)">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em style="color:var(--amber);font-style:normal">$1</em>')
    // Inline code / mono values
    .replace(/`([^`]+)`/g, '<code style="font-family:var(--mono);font-size:10px;background:var(--bg3);padding:1px 6px;border-radius:4px;color:var(--sky)">$1</code>')
    // Numbered lists
    .replace(/^(\d+)\.\s+\*\*(.+?)\*\*[:：]?\s*(.*)$/gm,
      '<div style="display:flex;gap:10px;align-items:flex-start;padding:7px 0;border-bottom:1px solid var(--line)">' +
      '<div style="font-family:var(--mono);font-size:9px;background:var(--indigo);color:white;width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-weight:700;margin-top:1px">$1</div>' +
      '<div><div style="font-size:11px;font-weight:700;color:var(--t0);margin-bottom:2px">$2</div><div style="font-size:11px;color:var(--t1);line-height:1.6">$3</div></div></div>')
    .replace(/^(\d+)\.\s+(.+)$/gm,
      '<div style="display:flex;gap:10px;align-items:flex-start;padding:6px 0">' +
      '<div style="font-family:var(--mono);font-size:9px;background:var(--bg3);color:var(--indigo);width:18px;height:18px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;border:1px solid var(--indigo)44">$1</div>' +
      '<div style="font-size:11px;color:var(--t1);line-height:1.6;flex:1">$2</div></div>')
    // Bullet lists
    .replace(/^[▸•\-]\s+\*\*(.+?)\*\*[:：]?\s*(.*)$/gm,
      '<div style="display:flex;gap:8px;align-items:flex-start;padding:5px 0">' +
      '<div style="width:6px;height:6px;border-radius:50%;background:var(--indigo);flex-shrink:0;margin-top:5px"></div>' +
      '<div><span style="font-size:11px;font-weight:700;color:var(--t0)">$1</span>' +
      '<span style="font-size:11px;color:var(--t1)"> $2</span></div></div>')
    .replace(/^[▸•\-]\s+(.+)$/gm,
      '<div style="display:flex;gap:8px;align-items:flex-start;padding:4px 0">' +
      '<div style="width:5px;height:5px;border-radius:50%;background:var(--t2);flex-shrink:0;margin-top:6px"></div>' +
      '<div style="font-size:11px;color:var(--t1);line-height:1.6">$1</div></div>')
    // Verdict / label lines (e.g. "BUY / HOLD / AVOID" patterns)
    .replace(/\b(BUY|AVOID|HOLD|STRONG BUY|STRONG SELL)\b/g,
      (m) => {
        const c = m.includes('BUY')?'var(--emerald)':m.includes('AVOID')||m.includes('SELL')?'var(--rose)':'var(--amber)';
        return `<span style="font-family:var(--mono);font-weight:700;color:${c};font-size:11px;padding:1px 7px;background:${c}18;border-radius:5px;border:1px solid ${c}44">${m}</span>`;
      })
    // Score patterns like "7/10" or "85/100"
    .replace(/\b(\d+)\/(\d+)\b/g,
      '<span style="font-family:var(--mono);font-weight:700;color:var(--amber)">$1/$2</span>')
    // Dollar amounts
    .replace(/\$[\d,]+(?:\.\d+)?[BMK]?/g,
      m => `<span style="font-family:var(--mono);font-weight:600;color:var(--emerald)">${m}</span>`)
    // Percentages
    .replace(/[+\-]?\d+\.?\d*%/g,
      m => {
        const pos = !m.startsWith('-');
        return `<span style="font-family:var(--mono);font-weight:600;color:${pos?'var(--emerald)':'var(--rose)'}">${m}</span>`;
      })
    // Horizontal rules
    .replace(/^---+$/gm, '<div style="border-top:1px solid var(--line);margin:12px 0"></div>')
    // Blockquotes
    .replace(/^>\s+(.+)$/gm,
      '<div style="border-left:3px solid var(--indigo);padding:6px 12px;background:var(--indigo)08;border-radius:0 6px 6px 0;margin:6px 0;font-size:11px;color:var(--t1);line-height:1.6">$1</div>')
    // Paragraph breaks
    .replace(/\n\n/g, '<div style="margin-top:10px"></div>')
    .replace(/\n/g, '<br>');
}

