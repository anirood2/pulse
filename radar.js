// ═══════════════════════════════════════════
//  FLOATLOCK — RADAR Tab (Run Stage Classifier)
// ═══════════════════════════════════════════

function renderRadar() {
  const grid = document.getElementById('rrGrid');
  if (!grid) return;

  let list = allTickers();
  if (STATE.rrStage!=='ALL') list = list.filter(t=>(STATE.stages[t.s]?.stage)===STATE.rrStage);

  list.sort((a,b) => {
    const sa=STATE.stages[a.s], sb=STATE.stages[b.s];
    if (STATE.rrSort==='stage')  return (STAGE_ORDER[(sa?.stage)||'WATCH'])-(STAGE_ORDER[(sb?.stage)||'WATCH']);
    if (STATE.rrSort==='sent')   return ((STATE.techCache[b.s]?.rsi)||50)-((STATE.techCache[a.s]?.rsi)||50);
    if (STATE.rrSort==='upside') {
      const ua=PRICE_TARGETS[a.s]&&STATE.prices[a.s]?((PRICE_TARGETS[a.s]-STATE.prices[a.s].p)/STATE.prices[a.s].p*100):0;
      const ub=PRICE_TARGETS[b.s]&&STATE.prices[b.s]?((PRICE_TARGETS[b.s]-STATE.prices[b.s].p)/STATE.prices[b.s].p*100):0;
      return ub-ua;
    }
    return (STAGE_ORDER[(sa?.stage)||'WATCH'])-(STAGE_ORDER[(sb?.stage)||'WATCH']);
  });

  if (!list.length) { grid.innerHTML='<div class="empty">No tickers in this stage yet</div>'; return; }
  grid.innerHTML = list.map((t,i) => makeRRCard(t,i)).join('');

  updateRwyDots();
  updateGauge();
  updateRRStats();
}

function makeRRCard(t, idx) {
  const tech=STATE.techCache[t.s], p=STATE.prices[t.s];
  const stg = STATE.stages[t.s]||{stage:'WATCH',reason:'Computing…',conf:0};
  const {stage,reason,conf} = stg;
  const sc = STAGE_COLORS[stage]||'var(--t2)';
  const em = STAGE_EMOJIS[stage]||'';
  const price = p ? `$${p.p.toFixed(2)}` : '—';
  const chg   = p ? p.ch : null;
  const chgStr= chg!=null ? `${chg>=0?'+':''}${chg.toFixed(2)}%` : '—';
  const chgCls= chg!=null ? (chg>=0?'up':'dn') : 'nc';
  const pt = PRICE_TARGETS[t.s]||0;
  const up = pt&&p ? Math.round((pt-p.p)/p.p*100) : null;
  const upC = up!=null ? (up>20?'var(--emerald)':up>0?'var(--amber)':'var(--rose)') : 'var(--t2)';
  const rsi  = tech?.rsi || null;
  const rc   = rsiColor(rsi);
  const volR = tech ? parseFloat(tech.volR) : 0;
  const isExp = STATE.rrExpanded[t.s];

  const miniGrid = `<div class="mini-grid">
    ${[
      ['RSI (14)', rsi??'—', rc],
      ['MACD', tech?.macdObj?.label??'—', tech?.macdObj?.label==='BULLISH'?'var(--emerald)':'var(--rose)'],
      ['VS 50d MA', tech?(parseFloat(tech.ma50p)>=0?'+':'')+tech.ma50p+'%':'—','var(--t1)'],
      ['YTD', tech?(parseFloat(tech.ytd)>=0?'+':'')+tech.ytd+'%':'—',tech&&parseFloat(tech.ytd)>=0?'var(--emerald)':'var(--rose)'],
      ['VOL RATIO', tech?tech.volR+'x':'—', volR>1.5?'var(--emerald)':'var(--t1)'],
      ['ANALYST PT', pt?`$${pt}`:'—','var(--sky)'],
      ['UPSIDE', up!=null?(up>0?'+':'')+up+'%':'—', upC],
      ['SHORT %', t.sp+'%','var(--rose)'],
    ].map(([l,v,c])=>`<div class="mini-cell">
      <div class="mini-lbl">${l}</div>
      <div class="mini-val" style="color:${c}">${v}</div>
    </div>`).join('')}
  </div>`;

  return `
  <div class="rrcard ${stage}" id="rrc-${t.s}" style="animation-delay:${Math.min(idx*.04,.4)}s">
    <div class="rr-hdr" onclick="rrToggle('${t.s}')">
      <div class="rr-logo">
        <img src="https://logo.clearbit.com/${t.s.toLowerCase()}.com" alt="${t.s}"
          onerror="this.innerHTML='<span style=font-family:var(--mono);font-size:9px;color:var(--t2)>${t.s.slice(0,4)}</span>'">
      </div>
      <div class="rr-info">
        <div class="rr-sym">${t.s}</div>
        <div class="rr-name">${t.n}</div>
        <span class="stage-badge" style="border-color:${sc}44;color:${sc};margin-top:4px;display:inline-flex">${em} ${stage}</span>
      </div>
      <div class="rr-right">
        <div class="rr-price">${price}</div>
        <div class="rr-chg ${chgCls}">${chgStr}</div>
        <div class="rr-pt" style="color:${upC}">PT $${pt}${up!=null?` · ${up>0?'+':''}${up}%`:''}</div>
      </div>
      <span class="chev${isExp?' open':''}">▾</span>
    </div>
    <div class="rr-bars" onclick="rrToggle('${t.s}')">
      <div class="rr-bar-row">
        <span class="rr-bar-lbl">RSI(14)</span>
        <div class="rr-track"><div class="rr-fill" style="width:${rsi||0}%;background:${rc}"></div></div>
        <span class="rr-bval" style="color:${rc}">${rsi||'…'}</span>
      </div>
      <div class="rr-bar-row">
        <span class="rr-bar-lbl">MOMENTUM</span>
        <div class="rr-track"><div class="rr-fill" style="width:${Math.min(volR*50,100)}%;background:var(--amber)"></div></div>
        <span class="rr-bval" style="color:var(--amber)">${tech?tech.volR+'x':'…'}</span>
      </div>
      <div class="rr-bar-row">
        <span class="rr-bar-lbl">CONFIDENCE</span>
        <div class="rr-track"><div class="rr-fill" style="width:${conf}%;background:${sc}"></div></div>
        <span class="rr-bval" style="color:${sc}">${conf}%</span>
      </div>
    </div>
    <div class="stage-reason">${reason}</div>
    <div class="rr-detail${isExp?' open':''}" id="rrd-${t.s}">
      <div class="rr-inner">
        <div class="rr-thesis">${t.th}</div>
        ${miniGrid}
        <div class="links-grid">
          <a href="https://www.google.com/search?q=${t.s}+chart" target="_blank" class="lnk-btn">Chart ↗</a>
          <a href="https://finviz.com/quote.ashx?t=${t.s}" target="_blank" class="lnk-btn">Finviz ↗</a>
          <a href="https://www.google.com/search?q=${t.s}+short+interest" target="_blank" class="lnk-btn">Short Data ↗</a>
        </div>
      </div>
    </div>
  </div>`;
}

function rrToggle(sym) {
  STATE.rrExpanded[sym] = !STATE.rrExpanded[sym];
  renderRadar();
}

function rrScrollTo(sym) {
  STATE.rrExpanded[sym] = true;
  renderRadar();
  setTimeout(() => {
    const el = document.getElementById(`rrc-${sym}`);
    if (el) el.scrollIntoView({behavior:'smooth',block:'start'});
  }, 120);
}

function rrStage(s, el) {
  STATE.rrStage = s;
  document.querySelectorAll('[data-rst]').forEach(b => b.className='pill');
  const cls = {ALL:'on-indigo',NOTYET:'on-emerald',RUNNING:'on-amber',RAN:'on-rose',COILING:'on-indigo',WATCH:'on-violet'};
  el.classList.add(cls[s]||'on-indigo');
  renderRadar();
}

function rrSort(s, el) {
  STATE.rrSort = s;
  document.querySelectorAll('[data-rrs]').forEach(b => b.classList.remove('on'));
  el.classList.add('on');
  renderRadar();
}

async function rrRefresh() {
  const btn = document.getElementById('rrRfBtn');
  btn.disabled=true; btn.textContent='…';
  await loadPrices();
  renderRadar();
  btn.disabled=false; btn.textContent='↻';
  if (!STATE.techBusy) loadTech();
}

function updateRwyDots() {
  const el = document.getElementById('rwyDots');
  if (!el) return;
  el.innerHTML = allTickers().map(t => {
    const st = (STATE.stages[t.s]?.stage)||'WATCH';
    const sc = STAGE_COLORS[st]||'var(--t2)';
    return `<span class="rdot" style="border-color:${sc}44;color:${sc}" onclick="rrScrollTo('${t.s}')">${t.s}</span>`;
  }).join('');
}

function updateGauge() {
  const rsis = Object.values(STATE.techCache).filter(tc=>tc?.rsi).map(tc=>tc.rsi);
  if (!rsis.length) return;
  const avg = rsis.reduce((a,b)=>a+b,0)/rsis.length;
  const pct  = Math.max(5,Math.min(95,((avg-30)/40*100)));
  const thumb = document.getElementById('gthumb');
  const gval  = document.getElementById('gval');
  if (thumb) thumb.style.left = pct+'%';
  if (gval) {
    gval.textContent = avg>=60?`BULLISH (${avg.toFixed(0)})`:avg>=45?`NEUTRAL (${avg.toFixed(0)})`: `BEARISH (${avg.toFixed(0)})`;
    gval.style.color = avg>=60?'var(--emerald)':avg>=45?'var(--amber)':'var(--rose)';
  }
}

function updateRRStats() {
  const all = allTickers();
  setEl('rr0', all.filter(t=>STATE.stages[t.s]?.stage==='NOTYET').length);
  setEl('rr1', all.filter(t=>STATE.stages[t.s]?.stage==='RUNNING').length);
  setEl('rr2', all.filter(t=>STATE.stages[t.s]?.stage==='RAN').length);
  const ups = all
    .map(t => { const pt=PRICE_TARGETS[t.s], p=STATE.prices[t.s]; return pt&&p?((pt-p.p)/p.p*100):0; })
    .filter(u=>u>0);
  setEl('rr3', ups.length ? '+'+Math.round(ups.reduce((a,b)=>a+b,0)/ups.length)+'%' : '—');
}
