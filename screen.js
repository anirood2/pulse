// ═══════════════════════════════════════════
//  FLOATLOCK — SCREEN Tab (Squeeze Screener)
// ═══════════════════════════════════════════

// ─── FILTER STATE ───────────────────────────
let qVal='', qTimer=null;

function getFiltered() {
  let list = allTickers();
  if (qVal) list = list.filter(t => t.s.includes(qVal) || t.n.toUpperCase().includes(qVal));
  if (STATE.activeLane==='CUSTOM') list = list.filter(t => t.custom);
  else if (STATE.activeLane!=='ALL') list = list.filter(t => getLane(t)===STATE.activeLane);
  if (STATE.activeSig!=='ALL') list = list.filter(t => t.sigs.includes(STATE.activeSig));
  list.sort((a,b) => {
    if (STATE.activeSort==='score') return calcFLS(b)-calcFLS(a);
    if (STATE.activeSort==='short') return b.sp-a.sp;
    if (STATE.activeSort==='dtc')   return b.dtc-a.dtc;
    if (STATE.activeSort==='rsi') {
      return ((STATE.techCache[a.s]&&STATE.techCache[a.s].rsi)||50) -
             ((STATE.techCache[b.s]&&STATE.techCache[b.s].rsi)||50);
    }
    if (STATE.activeSort==='chg') {
      return ((STATE.prices[b.s]&&STATE.prices[b.s].ch)||0) -
             ((STATE.prices[a.s]&&STATE.prices[a.s].ch)||0);
    }
    return calcFLS(b)-calcFLS(a);
  });
  return list;
}

function renderScreen() {
  const grid = document.getElementById('tGrid');
  if (!grid) return;
  const list = getFiltered();
  if (!list.length) { grid.innerHTML='<div class="empty">No tickers match current filters</div>'; updateStats(); return; }
  grid.innerHTML = list.map((t,i) => makeTickerCard(t,i)).join('');
  updateStats();
  renderWatchStrip();
}

function makeTickerCard(t, idx) {
  const sc   = calcFLS(t);
  const lane = getLane(t);
  const lc   = LANE_COLORS[lane] || 'var(--t2)';
  const p    = STATE.prices[t.s];
  const tech = STATE.techCache[t.s];
  const stg  = STATE.stages[t.s];
  const isExp= STATE.expanded[t.s];
  const curTab=STATE.dtabs[t.s]||'overview';

  const price  = p ? `$${p.p.toFixed(2)}` : '—';
  const chg    = p ? p.ch : null;
  const chgStr = chg!=null ? `${chg>=0?'+':''}${chg.toFixed(2)}%` : '—';
  const chgCls = chg!=null ? (chg>=0?'up':'dn') : 'nc';

  const rsi    = tech ? tech.rsi : null;
  const macdL  = tech?.macdObj?.label || null;
  const macdC  = macdL==='BULLISH'?'var(--emerald)':macdL==='BEARISH'?'var(--rose)':'var(--t2)';
  const ma50p  = tech ? tech.ma50p : null;
  const ma50C  = !ma50p?'var(--t2)':parseFloat(ma50p)>10?'var(--rose)':parseFloat(ma50p)>0?'var(--emerald)':'var(--amber)';
  const ytd    = tech ? tech.ytd : null;
  const ytdC   = !ytd?'var(--t2)':parseFloat(ytd)>0?'var(--emerald)':'var(--rose)';

  const sigHtml = t.sigs.length
    ? t.sigs.map(sg => {
        const cfg = SIG_CFG[sg]||{color:'var(--t2)',label:sg.toUpperCase(),edId:sg};
        return `<span class="sig-tag" style="border-color:${cfg.color}44;color:${cfg.color};background:${cfg.color}11"
          onclick="event.stopPropagation();goLearn('${sg}')">${cfg.label}</span>`;
      }).join('')
    : `<span style="font-family:var(--mono);font-size:8px;color:var(--t2)">No signals</span>`;

  const stgBadge = stg ? (() => {
    const sc2 = STAGE_COLORS[stg.stage]||'var(--t2)';
    return `<span class="stage-badge" style="border-color:${sc2}44;color:${sc2}">${STAGE_EMOJIS[stg.stage]} ${stg.stage}</span>`;
  })() : '';

  const customTag = t.custom ? `<span style="font-family:var(--mono);font-size:7px;color:var(--violet);margin-left:6px">CUSTOM</span>` : '';

  const loading = `<span class="blink" style="font-size:8px;font-family:var(--mono);color:var(--t2)">…</span>`;

  return `
  <div class="tcard lane-${lane.toLowerCase()}" style="animation-delay:${Math.min(idx*.04,.4)}s">
    <div class="card-hdr" onclick="toggleCard('${t.s}')">
      <div class="card-logo">
        <img src="https://logo.clearbit.com/${t.s.toLowerCase()}.com" alt="${t.s}"
          onerror="this.outerHTML='<div class=card-logo-fb>${t.s.slice(0,4)}</div>'">
      </div>
      <div class="card-main">
        <div class="card-sym">${t.s}${customTag}</div>
        <div class="card-name">${t.n}</div>
        <div class="card-meta">
          <div class="meta-dot" style="background:${lc}"></div>
          <span class="meta-txt">${lane} · ${t.sec}</span>
          ${stgBadge}
        </div>
      </div>
      <div class="card-right">
        <div class="card-price">${price}</div>
        <div class="card-chg ${chgCls}">${chgStr}</div>
      </div>
      <span class="chev${isExp?' open':''}">▾</span>
    </div>
    <div class="tech-row">
      <div class="tech-cell">
        <div class="tech-lbl">RSI(14)</div>
        <div class="tech-val" style="color:${rsiColor(rsi)}">${rsi??loading}</div>
      </div>
      <div class="tech-cell">
        <div class="tech-lbl">MACD</div>
        <div class="tech-val" style="color:${macdC};font-size:9px">${macdL??loading}</div>
      </div>
      <div class="tech-cell">
        <div class="tech-lbl">VS 50d MA</div>
        <div class="tech-val" style="color:${ma50C};font-size:9px">${ma50p!=null?(parseFloat(ma50p)>0?'+':'')+ma50p+'%':loading}</div>
      </div>
      <div class="tech-cell">
        <div class="tech-lbl">YTD</div>
        <div class="tech-val" style="color:${ytdC};font-size:9px">${ytd!=null?(parseFloat(ytd)>0?'+':'')+ytd+'%':loading}</div>
      </div>
    </div>
    <div class="fls-row">
      <div class="fls-track">
        <div class="fls-fill" style="width:${sc}%;background:${flsColor(sc)}"></div>
      </div>
      <div class="fls-val" style="color:${flsColor(sc)}">${sc}/99</div>
    </div>
    <div class="sig-tags">${sigHtml}</div>
    <div class="card-detail${isExp?' open':''}">
      ${isExp ? makeCardDetail(t, curTab, sc, p, tech, lc, stg) : ''}
    </div>
  </div>`;
}

function makeCardDetail(t, tab, sc, p, tech, lc, stg) {
  const tabs = [['overview','OVERVIEW'],['thesis','THESIS'],['score','SCORE'],['links','LINKS']];
  const tabBar = `<div class="detail-tabs">
    ${tabs.map(([k,l]) => `<div class="detail-tab${tab===k?' on':''}" 
      onclick="event.stopPropagation();switchDTab('${t.s}','${k}')">${l}</div>`).join('')}
  </div>`;

  const pt = PRICE_TARGETS[t.s]||0;
  const upside = pt && p ? ((pt-p.p)/p.p*100).toFixed(0) : '—';

  let pane = '<div class="detail-pane">';

  if (tab==='overview') {
    const rows = [
      ['PRICE', p?`$${p.p.toFixed(2)}`:'—', p&&p.ch>=0?'var(--up)':'var(--dn)'],
      ['DAY CHANGE', p?(p.ch>=0?'+':'')+p.ch.toFixed(2)+'%':'—', p&&p.ch>=0?'var(--up)':'var(--dn)'],
      ['ANALYST PT', pt?`$${pt}`:'—', 'var(--sky)'],
      ['UPSIDE TO PT', upside!=='—'?(upside>0?'+':'')+upside+'%':'—', 'var(--emerald)'],
      ['SHORT % FLOAT', t.sp+'%','var(--rose)'],
      ['DAYS TO COVER', t.dtc+'d','var(--amber)'],
      ['FLOAT', t.fl+'M shares','var(--t1)'],
      ['MKT CAP', '$'+t.mc+'B','var(--t1)'],
      ['FLS SCORE', sc+'/99', flsColor(sc)],
    ];
    if (tech) {
      rows.push(['RSI (14)', String(tech.rsi), rsiColor(tech.rsi)]);
      rows.push(['MACD', tech.macdObj?tech.macdObj.label:'—', tech.macdObj?.label==='BULLISH'?'var(--emerald)':'var(--rose)']);
      rows.push(['VS 50d MA', (parseFloat(tech.ma50p)>=0?'+':'')+tech.ma50p+'%','var(--t1)']);
      rows.push(['VS 200d MA',(parseFloat(tech.ma200p)>=0?'+':'')+tech.ma200p+'%','var(--t1)']);
      rows.push(['VOL RATIO', tech.volR+'x avg', parseFloat(tech.volR)>1.5?'var(--emerald)':'var(--t1)']);
      rows.push(['YTD RETURN', (parseFloat(tech.ytd)>=0?'+':'')+tech.ytd+'%', parseFloat(tech.ytd)>=0?'var(--emerald)':'var(--rose)']);
      rows.push(['FROM 52W HIGH', tech.hi52p+'%','var(--rose)']);
    }
    if (stg) {
      rows.push(['AUTO STAGE', STAGE_EMOJIS[stg.stage]+' '+stg.stage, STAGE_COLORS[stg.stage]]);
      pane += rows.map(r => `<div class="d-row"><span class="d-lbl">${r[0]}</span><span class="d-val" style="color:${r[2]}">${r[1]}</span></div>`).join('');
      pane += `<div style="background:var(--bg3);border-radius:8px;padding:10px 12px;margin-top:10px;font-family:var(--mono);font-size:8px;color:var(--t2);line-height:1.7">${stg.reason}</div>`;
    } else {
      pane += rows.map(r => `<div class="d-row"><span class="d-lbl">${r[0]}</span><span class="d-val" style="color:${r[2]}">${r[1]}</span></div>`).join('');
    }

    // Quick analyze button
    pane += `<button class="tool-run-btn emerald" style="margin-top:12px;width:100%"
      onclick="event.stopPropagation();quickAnalyze('${t.s}')">
      🤖 AI Deep Dive — ${t.s}
    </button>`;

  } else if (tab==='thesis') {
    pane += `<div class="thesis-box">${t.th}</div>`;
  } else if (tab==='score') {
    const comps = [
      ['Short % (×0.35)', Math.min(t.sp*.35,35).toFixed(1), 35, 'var(--rose)'],
      ['DTC (×2)', Math.min(t.dtc*2,20).toFixed(1), 20, 'var(--amber)'],
      ['Swap Signal', t.sigs.includes('swap')?30:0, 30, 'var(--rose)'],
      ['Tiger DNA', t.sigs.includes('tiger')?12:0, 12, 'var(--violet)'],
      ['Family Lock', t.sigs.includes('family')?10:0, 10, 'var(--sky)'],
      ['Put Ladder', t.sigs.includes('puts')?8:0, 8, 'var(--amber)'],
      ['Activist', t.sigs.includes('activist')?6:0, 6, 'var(--emerald)'],
      ['Buyback', t.sigs.includes('buyback')?4:0, 4, '#F472B6'],
      ['Float Bonus', t.fl<15?15:t.fl<50?10:t.fl<100?5:0, 15, 'var(--sky)'],
    ];
    pane += `<div class="score-grid">`;
    comps.forEach(([l,v,max,c]) => {
      pane += `<div class="score-item">
        <div class="score-item-lbl">${l}</div>
        <div class="score-item-val" style="color:${+v>0?c:'var(--t2)'}">+${v}</div>
        <div class="score-bar"><div class="score-fill" style="width:${(+v/max*100).toFixed(0)}%;background:${c}"></div></div>
      </div>`;
    });
    pane += `</div>
    <div style="background:var(--bg3);border-radius:10px;padding:14px;margin-top:12px;text-align:center">
      <div style="font-family:var(--mono);font-size:8px;color:var(--t2);margin-bottom:5px">TOTAL FLS SCORE</div>
      <div style="font-family:var(--mono);font-size:36px;font-weight:700;color:${flsColor(sc)}">${sc}/99</div>
    </div>`;
  } else if (tab==='links') {
    const lnks = [
      ['Fintel Short Data','fintel.io'],
      ['MarketBeat','marketbeat.com'],
      ['SEC EDGAR','sec.gov'],
      ['Unusual Whales','unusualwhales.com'],
      ['Finviz','finviz.com'],
      ['Quiver Quant','quiverquant.com'],
    ];
    pane += `<div class="links-grid">`;
    lnks.forEach(([l,d]) => {
      pane += `<a href="https://www.google.com/search?q=${t.s}+${encodeURIComponent(l)}"
        target="_blank" class="lnk-btn">${l} ↗</a>`;
    });
    pane += `</div>`;
  }

  pane += '</div>';
  return tabBar + pane;
}

function updateStats() {
  const all = allTickers(), tot = all.length||1;
  setEl('s0', (all.reduce((a,t)=>a+t.sp,0)/tot).toFixed(0)+'%');
  setEl('s1', all.filter(t=>getLane(t)==='EXTREME').length);
  setEl('s2', all.filter(t=>t.sigs.includes('swap')).length);
  setEl('s3', (all.map(calcFLS).reduce((a,b)=>a+b,0)/tot).toFixed(0));
}

// ─── CARD INTERACTIONS ──────────────────────
function toggleCard(sym) {
  STATE.expanded[sym] = !STATE.expanded[sym];
  if (!STATE.dtabs[sym]) STATE.dtabs[sym] = 'overview';
  renderScreen();
}

function switchDTab(sym, tab) {
  STATE.dtabs[sym] = tab;
  renderScreen();
}

function quickAnalyze(sym) {
  switchPage('analyze', document.querySelectorAll('.tb')[2]);
  document.getElementById('analyzeInp').value = sym;
  setTimeout(() => runAnalyzeModule('deep', sym), 200);
}

// ─── WATCHLIST STRIP ────────────────────────
function renderWatchStrip() {
  const el = document.getElementById('wstrip');
  if (!el) return;
  let html = '';
  STATE.custom.forEach((t,i) => {
    const p = STATE.prices[t.s];
    const chg = p ? p.ch : null;
    const stg = STATE.stages[t.s];
    const sc = stg ? STAGE_COLORS[stg.stage] : 'var(--t2)';
    html += `<div class="wcard" onclick="expandSym('${t.s}')">
      <span class="wcard-rm" onclick="event.stopPropagation();removeCustom(${i})">✕</span>
      <div class="wcard-sym">${t.s}</div>
      <div class="wcard-price">${p?'$'+p.p.toFixed(2):'—'}</div>
      <div class="wcard-chg ${chg!=null?(chg>=0?'up':'dn'):'nc'}">${chg!=null?(chg>=0?'+':'')+chg.toFixed(2)+'%':'—'}</div>
      ${stg?`<div class="wcard-stage" style="color:${sc}">${STAGE_EMOJIS[stg.stage]} ${stg.stage}</div>`:''}
    </div>`;
  });
  html += `<div class="wadd-btn" onclick="focusSearch()">
    <div class="wadd-icon">＋</div>
    <div class="wadd-lbl">ADD<br>TICKER</div>
  </div>`;
  el.innerHTML = html;
}

function removeCustom(i) { STATE.custom.splice(i,1); renderScreen(); }
function focusSearch() { document.getElementById('qInp').focus(); }
function expandSym(sym) { STATE.expanded[sym]=true; STATE.dtabs[sym]='overview'; renderScreen(); }

// ─── SEARCH ─────────────────────────────────
function onSearchInput(v) {
  qVal = v.trim().toUpperCase();
  clearTimeout(qTimer);
  if (!qVal) { hideDropdown(); renderScreen(); return; }
  qTimer = setTimeout(() => { renderScreen(); showDropdown(); }, 160);
}

function showDropdown() {
  const dd = document.getElementById('qDd');
  const hits = allTickers().filter(t => t.s.startsWith(qVal)||t.n.toUpperCase().includes(qVal)).slice(0,5);
  let html = '';
  hits.forEach(t => {
    const sc = calcFLS(t), lc = LANE_COLORS[getLane(t)];
    html += `<div class="dd-row" onclick="expandSym('${t.s}');hideDropdown();clearSearch()">
      <span class="dd-sym">${t.s}</span>
      <span class="dd-name">${t.n}</span>
      <span class="dd-badge" style="background:${lc}18;color:${lc}">${sc}/99</span>
    </div>`;
  });
  html += `<div class="dd-row" onclick="addCustomTicker()" style="background:rgba(167,139,250,.05)">
    <span style="color:var(--violet);font-family:var(--mono);font-size:10px">＋ Analyze ${qVal}</span>
  </div>`;
  dd.innerHTML = html;
  dd.style.display = 'block';
}

function hideDropdown() { const d=document.getElementById('qDd'); if(d) d.style.display='none'; }
function clearSearch()   { qVal=''; const i=document.getElementById('qInp'); if(i) i.value=''; }

function onSearchKey(e) {
  if (e.key==='Enter') addCustomTicker();
  if (e.key==='Escape') { hideDropdown(); clearSearch(); renderScreen(); }
}

async function addCustomTicker() {
  const inp = document.getElementById('qInp');
  const sym = (inp.value||qVal).trim().toUpperCase();
  if (!sym) return;
  if (allTickers().find(t=>t.s===sym)) { expandSym(sym); hideDropdown(); clearSearch(); return; }
  inp.value = `Analyzing ${sym}…`; inp.disabled = true;
  const [q, pro, tech] = await Promise.all([fetchQuote(sym), fetchProfile(sym), computeTech(sym)]);
  inp.disabled = false;
  if (!q) { inp.value=''; inp.placeholder=sym+' not found'; setTimeout(()=>inp.placeholder='Search or add any ticker…',2500); return; }
  STATE.prices[sym] = q;
  if (tech) { STATE.techCache[sym]=tech; STATE.stages[sym]=classify(tech,{s:sym,sp:0,dtc:0,sigs:[]}); }
  STATE.custom.push({
    s:sym, n:(pro?.name)||sym,
    sec:(pro?.finnhubIndustry)||'Custom',
    sp:0, dtc:0,
    fl: Math.round(((pro?.shareOutstanding)||0)*.7),
    mc: Math.round(((pro?.marketCapitalization)||0)/100)/10,
    sigs:[], custom:true,
    th:`<strong>Custom: ${sym}</strong><br>Visit Fintel.io or MarketBeat for short interest data.`
  });
  clearSearch(); hideDropdown(); renderScreen();
}

// ─── FILTER CONTROLS ────────────────────────
function setSig(s, el) {
  STATE.activeSig = s;
  document.querySelectorAll('#sigPills .pill').forEach(p => p.className='pill');
  const cls = {ALL:'on-indigo',swap:'on-rose',puts:'on-amber',family:'on-sky',tiger:'on-violet',activist:'on-emerald',buyback:'on-emerald'};
  if (cls[s]) el.classList.add(cls[s]); else el.classList.add('on-indigo');
  renderScreen();
}

function setLane(l, el) {
  STATE.activeLane = l;
  document.querySelectorAll('#lanePills .pill').forEach(p => p.className='pill');
  const cls = {ALL:'on-indigo',EXTREME:'on-rose',HIGH:'on-amber',ELEVATED:'on-indigo',WATCHLIST:'on-indigo',CUSTOM:'on-violet'};
  el.classList.add(cls[l]||'on-indigo');
  renderScreen();
}

function setSort(s, el) {
  STATE.activeSort = s;
  document.querySelectorAll('[data-sort]').forEach(p => p.classList.remove('on'));
  el.classList.add('on');
  renderScreen();
}

async function doRefresh() {
  const btn = document.getElementById('rfBtn');
  btn.disabled=true; btn.textContent='…';
  await loadPrices();
  renderScreen();
  btn.disabled=false; btn.textContent='↻ REFRESH';
  if (!STATE.techBusy) loadTech();
}
