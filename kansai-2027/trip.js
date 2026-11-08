/* kansai-2027/trip.js —— 这一趟的设置，以及 content.js 数据格式的适配。
   内容文件 content.js 保持原样；下面把它的几处字段名对到通用引擎的格式上，
   再用钩子加上这一趟独有的部分（台风风险条、段落结构、熊野与自驾要点、预订推导）。 */

/* ── 数据适配：content.js 的字段名 → 通用引擎的字段名 ── */
(function(){
  window.REG={};
  Object.keys(R).forEach(k=>{ REG[k]={n:R[k].n,hex:R[k].hex} });          // 区域：R → REG
  window.BROWS=BUDGET_ROWS;                                              // 预算科目
  TODOS.forEach(t=>{ t.v=typeof t.vars==='string'?t.vars:(t.vars||[]).join('') });   // 待办适用的方案
  Object.keys(V).forEach(k=>{ const v=V[k]; v.k=v.key; v.gr=v.mark });   // 方案：key/mark → k/gr
  Object.keys(P).forEach(k=>{ P[k].en=P[k].en||P[k].jp });               // 地点：日文名当作「当地名」
  LABELS.switchPlan=LABELS.comparePlan;
})();

window.TRIP = {
  id: 'kansai',
  store: 'trip',                 // 沿用旧版的本地存储键，已存的收藏点、笔记、预订记录不会丢
  start: '2027-09-17',
  room: 'jp2610',
  currency: { home: 'CAD', alt: 'JPY', rate: 115, people: 2, label: '两人合计', per: '每人' },
  wx: { points: [{ k:'kyoto', n:'京都', lat:35.0037, lng:135.7681 }, { k:'hongu', n:'熊野本宫', lat:33.8404, lng:135.7737 }],
        tz: 'Asia/Tokyo', models: 'jma_seamless' },
  areaHint: { kansai:'関西', shikoku:'四国', kyushu:'九州', kumano:'和歌山 熊野' },
  searchName: 'zh', searchSuffix: '日本', nameLabel: '日本語',
  searchHint: '例：大阪城 / 祖谷',
  switchExcerpt: true,           // 方案页底部的其他方案卡片，显示一段介绍摘要

  /* 预订清单：按这个方案里实际用到的地点推导 */
  bookingsAll(v, ids){
    const out = [{ id:'air', n:'国际机票 · YVR ⇄ KIX', t:'交通' }];
    if(/自驾|取车/.test(JSON.stringify(v.days))) out.push({ id:'car', n:'租车（右舵 / ETC / 中文导航）', t:'交通' });
    if(ids.has('takijiri') || ids.has('hongu')){
      out.push({ id:'kumano-stay', n:'熊野山中民宿 3 晚（含两餐）', t:'住宿' });
      out.push({ id:'kuroshio', n:'特急くろしお 指定席 往返', t:'交通' });
    }
    if(ids.has('naoshima')) out.push({ id:'chichu', n:'地中美术馆 指定时段预约', t:'门票' });
    [...new Set(v.days.map(d => stayKey(d.stay)).filter(x => x && x !== '—' && x !== '机上'))]
      .forEach(x => out.push({ id:'stay-'+x, n:'住宿 · '+x, t:'住宿' }));
    out.push({ id:'ins', n:'旅行保险（含台风延误 / 行程变更）', t:'其他' });
    out.push({ id:'esim', n:'eSIM + 离线地图', t:'其他' });
    return out;
  },

  /* 方案页：按住宿分段，每段几晚 */
  planAfter(s){
    const v = V[st.opt];
    s.appendChild(el('h2', 'sec', LABELS.segments));
    const segs = {};
    v.days.forEach(d => { const k = stayKey(d.stay); if(!k || k === '—' || k === '机上') return; segs[k] = (segs[k] || 0) + 1; });
    Object.entries(segs).forEach(([k, n]) => {
      const day = v.days.find(d => d.stay.startsWith(k));
      const hex = day ? (REG[day.r] || {}).hex : '#756E60';
      const r = el('div', 'bl');
      r.innerHTML = `<div class="lr"><span class="nm"><span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:${hex};margin-right:8px"></span>${esc(k)}</span><span class="vv" style="color:var(--mist)">${n} 晚</span></div>`;
      s.appendChild(r);
    });
  },

  /* 准备页：台风风险条 */
  prepExtra(s){
    s.appendChild(el('h2', 'sec', LABELS.typhoon));
    const rk = el('div', 'risk'), bar = el('div', 'riskbar');
    RISK.forEach(r => { const g = el('div', 'riskseg', r.lv); g.style.background = r.c; g.style.flex = r.d; bar.appendChild(g); });
    rk.appendChild(bar);
    const lb = el('div', 'risklab');
    RISK.forEach((r, i) => { const x = el('span', null, r.lab); x.style.flex = r.d; x.style.textAlign = i === 0 ? 'left' : i === RISK.length - 1 ? 'right' : 'center'; lb.appendChild(x); });
    rk.appendChild(lb);
    rk.appendChild(el('p', 'tx', TXT.typhoon));
    s.appendChild(rk);
  },

  /* 准备页：自驾规则、熊野古道规则 */
  prepAfter(s){
    [[LABELS.drive, DRIVE], [LABELS.kumano, KUMANO]].forEach(([title, list]) => {
      s.appendChild(el('h2', 'sec', title));
      list.forEach(([n, d]) => {
        const w = el('div', 'bl');
        w.innerHTML = `<div class="nm">${esc(n)}<small style="margin-top:4px;line-height:1.6;display:block">${esc(d)}</small></div>`;
        s.appendChild(w);
      });
    });
  }
};
