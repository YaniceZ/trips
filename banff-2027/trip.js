/* banff-2027/trip.js —— 这一趟的配置和特有部件。通用部分在 ../shared/engine.js。 */
/* 只硬编码我能确认的链接；其余走日文搜索 —— 官网改版了也不会失效 */
const SITE={};
/* ── 实时雪情：Open-Meteo，无 key，CORS 开放，模型含 JMA ── */
const WXP=[{k:'banff',n:'Banff',lat:51.1784,lng:-115.5708},{k:'golden',n:'Golden',lat:51.2965,lng:-116.9631}];
function tripWindow(v){
  const a=dayInfo(v,0), b=dayInfo(v,v.days.length-1);
  if(!a.iso) return null;
  const ly=x=>String(+x.slice(0,4)-1)+x.slice(4);
  return {a:a.iso,b:b.iso,la:ly(a.iso),lb:ly(b.iso)};
}
async function loadWX(force){
 const cache=await S.get('banff:wx');
 if(!force&&cache&&Date.now()-cache.at<3*3600e3){WX=cache;return}
 const la=WXP.map(x=>x.lat).join(','),lo=WXP.map(x=>x.lng).join(',');
 try{
  const r=await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${la}&longitude=${lo}`+
   `&daily=precipitation_sum,temperature_2m_max,temperature_2m_min,weather_code`+
   `&timezone=America%2FEdmonton&forecast_days=7`);
  if(!r.ok)throw 0;
  const j=await r.json();WX.fc=Array.isArray(j)?j:[j];WX.err=null;
 }catch(e){WX.err='预报没拉到';if(cache)WX.fc=cache.fc}
 const ly=tripWindow(V[st.opt]);
 if(ly){try{
   const r2=await fetch(`https://archive-api.open-meteo.com/v1/archive?latitude=${la}&longitude=${lo}`+
    `&start_date=${ly.la}&end_date=${ly.lb}&daily=precipitation_sum,temperature_2m_max&timezone=America%2FEdmonton`);
   if(r2.ok){const j2=await r2.json();WX.hist={win:ly,d:Array.isArray(j2)?j2:[j2]}}
  }catch(e){if(cache&&cache.hist)WX.hist=cache.hist}}
 WX.at=Date.now();await S.set('banff:wx',WX)}
function wxBlock(s){
 if(WX.hist){
  const box=el('div','wx');
  box.appendChild(el('div','wxh',`<span class="wxn">去年同期实测</span><span class="wxm">${WX.hist.win.la} → ${WX.hist.win.lb}</span>`));
  const rowd=el('div','wxd');
  WXP.forEach((pt,i)=>{
   const dd=WX.hist.d[i]?.daily||{};
   const arr=dd.precipitation_sum||[];
   const rain=arr.filter(x=>x>=1).length;
   const tmax=dd.temperature_2m_max||[];
   const avg=tmax.length?Math.round(tmax.reduce((a,b)=>a+b,0)/tmax.length):'—';
   const c=el('div','wxc');
   c.innerHTML=`<div class="dd">${pt.n}</div><div class="sn">${rain}<small style="font-size:11px"> / ${arr.length} 天有雨</small></div><div class="tt">均高温 ${avg}°C</div>`;
   rowd.appendChild(c)});
  box.appendChild(rowd);s.appendChild(box);
 }
 if(WX.fc){
  WXP.forEach((pt,i)=>{
   const d=WX.fc[i]?.daily;if(!d)return;
   const box=el('div','wx');
   box.appendChild(el('div','wxh',`<span class="wxn">${pt.n} · 未来 7 天</span><span class="wxm">${new Date(WX.at).toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit'})} 更新</span>`));
   const rowd=el('div','wxd');
   d.time.forEach((t,j)=>{
    const sn=(d.precipitation_sum||[])[j]||0;
    const c=el('div','wxc');
    c.innerHTML=`<div class="dd">${t.slice(5).replace('-','/')}</div>`+
     `<div class="sn" style="color:${sn>=10?'var(--rd)':sn>0?'var(--blu)':'var(--faint)'}">${sn>0?sn.toFixed(0):'·'}</div>`+
     `<div class="tt">${Math.round(d.temperature_2m_min[j])}/${Math.round(d.temperature_2m_max[j])}°</div>`;
    rowd.appendChild(c)});
   box.appendChild(rowd);s.appendChild(box)})}
 const n=el('p','tx');n.style.cssText='font-size:12.5px;color:var(--faint);margin:2px 0 18px';
 n.innerHTML=(WX.err?`<span style="color:var(--amb)">${WX.err}（离线或被拦截，显示的是上次缓存）</span> · `:'')+TXT.wxNote;
 s.appendChild(n)}




/* ── 预订清单：从行程自动推导 ── */
function bookings(){
 const v=V[st.opt],out=[];
 const ids=new Set(); v.days.forEach(d=>d.stops.forEach(x=>x.p&&ids.add(x.p)));
 if(ids.has('yyc')) out.push({id:'air',n:'机票 · YVR ⇄ YYC',t:'交通'},{id:'car',n:'租车（注意异地还车费）',t:'交通'});
 if(ids.has('moraine')||ids.has('parkride'))
   out.push({id:'shuttle',n:'Moraine Lake 班车预约（最要紧）',t:'预约'});
 out.push({id:'park',n:'国家公园门票 / Canada Strong Pass 确认',t:'门票'});
 if(ids.has('icefield')) out.push({id:'icefield',n:'哥伦比亚冰原 冰上车',t:'门票'});
 if(ids.has('maligne')) out.push({id:'maligne',n:'Maligne Lake 游船',t:'门票'});
 if(ids.has('kicking')||ids.has('sunshine')) out.push({id:'ski',n:'雪票（SkiBig3 / Kicking Horse）',t:'雪票'},{id:'gear',n:'雪具租赁',t:'装备'});
 const strip=x=>String(x||'').replace(/\s?[①②③④⑤⑥⑦⑧⑨⑩⑪]/g,'').trim();
 [...new Set(v.days.map(d=>strip(d.stay)).filter(x=>x&&x!=='—'&&x!=='机上'))]
   .forEach(x=>out.push({id:'stay-'+x,n:'住宿 · '+x,t:'住宿'}));
 if(ids.has('farmfire')||ids.has('joey')) out.push({id:'dine',n:'餐厅订位（Farm and Fire / JOEY）',t:'餐饮'});
 out.push({id:'ins',n:'旅行保险 / 道路救援',t:'其他'});
 return out}
function toICS(){
 const v=V[st.opt];
 const pad=n=>String(n).padStart(2,'0');
 const nx=d=>{const t=new Date(d.slice(0,4)+'-'+d.slice(4,6)+'-'+d.slice(6,8)+'T00:00:00Z');
  t.setUTCDate(t.getUTCDate()+1);return `${t.getUTCFullYear()}${pad(t.getUTCMonth()+1)}${pad(t.getUTCDate())}`};
 let out='BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//banff//ZH\r\nCALSCALE:GREGORIAN\r\n';
 v.days.forEach((d,i)=>{
  const info=dayInfo(v,i);
  if(!info.iso) return;
  const ds=info.iso.replace(/-/g,'');
  const esc2=t=>String(t).replace(/[\\;,]/g,m=>'\\'+m).replace(/\n/g,'\\n');
  const body=[d.note||'',...d.stops.map(x=>`${x.t} ${x.n}${x.s?' — '+x.s:''}`)].filter(Boolean).join('\n');
  out+='BEGIN:VEVENT\r\n'+`UID:banff-${st.opt}-${i}@local\r\n`+`DTSTAMP:${ds}T000000Z\r\n`+
   `DTSTART;VALUE=DATE:${ds}\r\nDTEND;VALUE=DATE:${nx(ds)}\r\n`+
   `SUMMARY:${esc2(''+d.t)}\r\n`+
   (d.stay&&d.stay!=='—'?`LOCATION:${esc2(d.stay)}\r\n`:'')+
   `DESCRIPTION:${esc2(body)}\r\n`+'END:VEVENT\r\n'});
 out+='END:VCALENDAR\r\n';
 const b=new Blob([out],{type:'text/calendar;charset=utf-8'});
 const a=document.createElement('a');a.href=URL.createObjectURL(b);
 a.download=`banff-${st.opt}.ics`;document.body.appendChild(a);a.click();
 setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1500);
 toast('已导出 '+v.days.length+' 天到日历')}

let st={opt:'A',tab:'plan',room:'banff26',openDay:null,
  me:{id:null,name:'',color:AVC[0]},pins:[],members:[],budget:{},done:{},bk:{},notes:{},addr:{},
  rate:115,perPerson:false,ccy:'CAD'};
const K={pins:()=>`banff:${st.room}:pins`,mem:()=>`banff:${st.room}:members`,
  bk:()=>`banff:${st.room}:bookings`,addr:()=>`banff:${st.room}:addr`,notes:()=>`banff:${st.room}:notes`,cfg:()=>'banff:localcfg'};

function planStart(v){ return (st.starts&&st.starts[v.k]) || v.start || '2027-08-27'; }
function dayInfo(v,i){
  const d=new Date(planStart(v)+'T00:00:00Z');
  if(isNaN(d)) return {iso:null,md:v.days[i].d||'—',wd:v.days[i].w||'',date:null};
  d.setUTCDate(d.getUTCDate()+i);
  const mm=String(d.getUTCMonth()+1).padStart(2,'0'), dd=String(d.getUTCDate()).padStart(2,'0');
  return {iso:`${d.getUTCFullYear()}-${mm}-${dd}`, md:`${mm}.${dd}`, wd:WD[d.getUTCDay()], date:d};
}
function dateModal(){
  const v=V[st.opt];
  openM(`<h3>改出发日期</h3><p class="mp">天数不变，整段行程按新日期平移。星期几会自动重算，天气的「去年同期」也会跟着换。</p>
   <div class="fd"><label class="lb">出发日</label>
     <input type="date" id="sd" value="${esc(planStart(v))}"></div>
   <div class="fd"><label class="lb">当前方案</label>
     <div class="tiny">${esc(v.name)} · 共 ${v.days.length} 天</div></div>
   <div class="row"><button class="btn" id="sreset">恢复默认</button>
     <button class="btn pri" id="sok">应用</button></div>
   <div class="row" style="margin-top:7px"><button class="btn" data-close>取消</button></div>`,
  b=>{
   b.querySelector('#sok').onclick=()=>{
     const val=b.querySelector('#sd').value;
     if(!val) return toast('选个日期');
     st.starts=st.starts||{}; st.starts[v.k]=val;
     closeM(); save(); renderOpts(); renderTabs(); renderBody();
     loadWX(true).then(()=>{if(st.tab==='prep')renderBody()});
     toast('已改为 '+val+' 出发');
   };
   b.querySelector('#sreset').onclick=()=>{
     if(st.starts) delete st.starts[v.k];
     closeM(); save(); renderOpts(); renderTabs(); renderBody();
     loadWX(true).then(()=>{if(st.tab==='prep')renderBody()});
     toast('已恢复默认日期');
   };
  });
}

/* ═══════ 7. 开车强度 ═══════ */
function quota(){
  const v=V[st.opt];
  const h=v.days.map(d=>d.drive==null?0:d.drive);
  const total=h.reduce((a,b)=>a+b,0);
  const longest=Math.max(...h,0);
  const hard=h.filter(x=>x>5).length;
  return{total:Math.round(total*10)/10,longest,hard,
    avg:h.length?(total/h.length).toFixed(1):'0',ok:hard===0,series:h};
}
function isJump(v,i){ const d=v.days[i]; return d.drive!=null && d.drive>5; }

/* ═══════ 8. 渲染 ═══════ */
function renderOpts(){
  const w=$('#opts');w.innerHTML='';
  Object.values(V).forEach(v=>{
    const b=el('button','opt');b.style.setProperty('--oc',v.hex);
    b.setAttribute('aria-pressed',st.opt===v.k);
    b.innerHTML=`<span class="gr">${v.gr}</span><span><span class="lab">${esc(v.name)}</span><span class="met">${esc(v.met)}</span></span>`;
    b.onclick=()=>{st.opt=v.k;st.openDay=null;renderOpts();renderTabs();renderBody();drawPl();showAll();save();loadWX(true).then(()=>{if(st.tab==='plan')renderBody()})};
    w.appendChild(b)});
  const v=V[st.opt];
  $('#hdates').textContent=planRange(v);
  $('#hski').textContent=v.days.length+' 天 / 开车 '+quota().total+' h';
  $('#hopt').textContent='方案 '+v.gr;
}
const TABS=[{k:'plan',n:'方案'},{k:'prep',n:'准备'},{k:'itin',n:'行程'},{k:'spots',n:'地点'},{k:'bud',n:'预算'}];
function renderBody(){const s=$('#scroll');s.innerHTML='';
  ({plan:vPlan,prep:vPrep,itin:vItin,spots:vSpots,bud:vBud})[st.tab](s)}

/* ── 方案 ── */
function qBlock(s){
  const v=V[st.opt], q=quota();
  const box=el('div','quota');
  const g=el('div','wsum');
  [[q.total,'总开车小时'],[q.longest,'最长一天 h'],[q.hard,'超 5 小时的天数']]
   .forEach(([a,b2])=>{const c=el('div','wcell');
    c.innerHTML=`<div class="wv">${a}</div><div class="wl">${b2}</div>`;g.appendChild(c)});
  box.appendChild(g);
  const prof=el('div','prof');
  const top=Math.max(q.longest,1);
  v.days.forEach((d,i)=>{
    const hh=d.drive==null?0:Math.max(2,Math.round(d.drive/top*46));
    const b=el('div','pbar'+(isJump(v,i)?' jump':''));
    b.style.height=hh+'px';
    b.title=`${dayInfo(v,i).md} 周${dayInfo(v,i).wd} · ${d.drive==null?'—':d.drive+' 小时'}`;
    b.onclick=()=>{st.tab='itin';st.openDay=i;renderTabs();renderBody();
      setTimeout(()=>{const n=document.querySelectorAll('.day')[i];n&&n.scrollIntoView({block:'center'})},60)};
    prof.appendChild(b)});
  box.appendChild(prof);
  const ax=el('div','pax');
  ax.innerHTML=`<span>${esc(dayInfo(v,0).md)}</span><span>${esc(dayInfo(v,v.days.length-1).md)}</span>`;
  box.appendChild(ax);
  const nt=el('div','qnote'+(q.ok?'':' warn'));
  nt.textContent=q.ok
    ? `全程没有单日开车超过 5 小时的情况。`
    : `有 ${q.hard} 天开车超过 5 小时（图中红色），最长 ${q.longest} 小时。那几天多留休息站，别压到天黑。`;
  box.appendChild(nt);s.appendChild(box);
}
function vPlan(s){
  const v=V[st.opt];
  s.appendChild(el('h2','sec',LABELS.season));
  const tm=el('div','tm'),g=el('div','tmg');
  g.appendChild(el('div','tmc',''));
  TIMING.cols.forEach(c=>g.appendChild(el('div','tmc'+(c.pk?' pk':''),c.k)));
  TIMING.rows.forEach(r=>{g.appendChild(el('div','tmh',r.n));
    r.v.forEach((val,i)=>{const c=el('div','tmv');c.style.background=r.c[val];
      if(val>=2)c.textContent=['','','中','高'][val];g.appendChild(c)})});
  tm.appendChild(g);s.appendChild(tm);
  const lg=el('div','tmleg');
  lg.innerHTML=`<i>颜色越深 = 越多</i>`
   + `<i>${GCOL.map(c=>`<b style="background:${c}"></b>`).join('')} 可玩度</i>`
   + `<i>${H2.map(c=>`<b style="background:${c}"></b>`).join('')} 人 / 价</i>`
   + `<i style="color:var(--rd)">红色列头 = 主要窗口</i>`;
  s.appendChild(lg);
  s.appendChild(el('p','tx',TXT.season));
  s.appendChild(el('h2','sec','方案 '+v.gr+' · '+v.tag));
  const h=el('div','t-big');h.textContent=v.name;s.appendChild(h);
  v.pitch.split('\n\n').forEach(par=>s.appendChild(el('p','tx',par)));
  const c=el('div','callout');
  c.innerHTML=`<span class="k">${esc(LABELS.cost)}</span><p>${v.cons}</p>`;s.appendChild(c);
  s.appendChild(el('h2','sec',LABELS.compare));
  COMPARE.forEach(([n2,d2])=>{const w=el('div','bl');
    w.innerHTML=`<div class="nm">${esc(n2)}<small style="margin-top:3px;display:block">${esc(d2)}</small></div>`;
    s.appendChild(w)});
  s.appendChild(el('h2','sec',LABELS.switchPlan));
  Object.values(V).filter(x=>x.k!==st.opt).forEach(x=>{
    const b=el('button','pc');b.style.setProperty('--pc',x.hex);b.style.width='100%';b.style.textAlign='left';
    b.innerHTML=`<div class="top"><span class="sw"></span><h3>${esc(x.name)}<span>${esc(x.tag)}</span></h3></div><p>${esc(x.met)} · ${esc(x.dates)}</p>`;
    b.onclick=()=>{st.opt=x.k;st.openDay=null;renderOpts();renderTabs();renderBody();drawPl();showAll();save();$('#scroll').scrollTop=0};
    s.appendChild(b)})}

/* ── 行程 ── */
function vItin(s){
  qBlock(s);
  s.appendChild(el('p','tx',TXT.itinHint));
  const sp=el('div','spine');
  V[st.opt].days.forEach((d,i)=>{
    const hex=REG[d.r].hex;
    const w=el('div','day'+(st.openDay===i?' open':''));w.style.setProperty('--nc',hex);
    const b=el('button','daybtn');
    b.innerHTML=`<span class="node${isJump(V[st.opt],i)?' jump':''}">${d.drive==null?'—':d.drive}<small>H</small></span>`+`
      <span class="ddate">${esc(dayInfo(V[st.opt],i).md)} 周${esc(dayInfo(V[st.opt],i).wd)}</span>
      <div class="dtitle">${esc(d.t)}</div>
      ${d.note?`<div class="dnote">${esc(d.note)}</div>`:''}
      ${d.sig?`<div class="sigrow"><span class="sigi"></span>${esc(d.sig)}</div>`:''}
      <div class="dmeta">${d.drive!=null&&d.drive>0?`<span class="pill sk">开车 ${d.drive} h</span>`:''}
        ${d.stay&&d.stay!=='—'?`<span class="pill st">宿 ${esc(d.stay)}</span>`:''}
        <span class="pill">${REG[d.r].n}</span></div>`;
    b.onclick=()=>{st.openDay=st.openDay===i?null:i;renderBody();if(st.openDay===i)focusDay(i)};
    w.appendChild(b);
    const bd=el('div','dbody');
    d.stops.forEach(x=>{const p=x.p?P[x.p]:null;const btn=el('button','stop');
      btn.innerHTML=`<span class="t">${esc(x.t)}</span><span class="n">${esc(x.n)}${x.s?`<small>${esc(x.s)}</small>`:''}</span>`;
      btn.onclick=e=>{e.stopPropagation();if(p&&mapOK){map.flyTo([p.lat,p.lng],12,{duration:.7});mReg[p.id]?.openPopup();if(innerWidth<=900)snap(0)}};
      bd.appendChild(btn);
      if(p){const lr=linkRow(p,true);lr.style.margin='0 0 6px 54px';bd.appendChild(lr)}});
    {const vv=V[st.opt];
     const nv=dayNavRow(vv,i); if(nv) bd.appendChild(nv);
     const curK=stayKey(d.stay);
     const prevK=i>0?stayKey(vv.days[i-1].stay):null;
     if(curK&&curK!=='—'&&curK!=='机上'&&curK===prevK){
       let firstIdx=i; while(firstIdx>0&&stayKey(vv.days[firstIdx-1].stay)===curK) firstIdx--;
       const nth=i-firstIdx+1;
       const same=el('div','samestay');
       same.innerHTML=`住 · ${esc(curK)}　<span>连住第 ${nth} 晚，同第 ${firstIdx+1} 天</span>`;
       bd.appendChild(same);
     } else {
       const sb=stayBlock2(vv,i); if(sb) bd.appendChild(sb);
     }}
    w.appendChild(bd);sp.appendChild(w)});
  s.appendChild(sp)}

/* ── 雪场 ── */
function vSpots(s){
  const bar=el('div','row');bar.style.marginBottom='15px';
  const a=el('button','btn pri','＋ 添加地点');a.onclick=()=>addM();bar.appendChild(a);
  const r=el('button','btn','↻ 同步');r.onclick=()=>pull(true);bar.appendChild(r);
  s.appendChild(bar);
  s.appendChild(el('h2','sec',`${LABELS.ourPins} ${st.pins.length}`));
  if(!st.pins.length)s.appendChild(el('p','tx',TXT.pinsEmpty));
  [...st.pins].sort((x,y)=>(y.likes||[]).length-(x.likes||[]).length||y.at-x.at).forEach(p=>{
    const c=el('div','pc');c.style.setProperty('--pc',p.color||'#8B4FB5');
    const lk=(p.likes||[]).includes(st.me.id);
    c.innerHTML=`<div class="top"><span class="sw"></span><h3>${esc(p.name)}</h3></div>${p.note?`<p>${esc(p.note)}</p>`:''}
      <div class="foot"><span class="byl"><span class="mini" style="background:${p.color||'#8B4FB5'}">${esc((p.by||'?').slice(0,1))}</span>${esc(p.by||'匿名')}</span>
      <span style="flex:1"></span><button class="act lk ${lk?'on':''}">♥ ${(p.likes||[]).length}</button>
      <button class="act go">定位</button>${p.byId===st.me.id?'<button class="act del">删除</button>':''}</div>`;
    c.querySelector('.lk').onclick=()=>like(p.id);
    c.querySelector('.go').onclick=()=>{if(mapOK){map.flyTo([p.lat,p.lng],13,{duration:.7});if(innerWidth<=900)snap(0)}};
    c.querySelector('.del')?.addEventListener('click',()=>del(p.id));
    c.appendChild(linkRow({id:p.id,zh:p.name,jp:p.name,lat:p.lat,lng:p.lng},true));
    s.appendChild(c)});
  s.appendChild(el('h2','sec',LABELS.places));
  const seen=new Set(),list=[];
  V[st.opt].days.forEach(d=>d.stops.forEach(x=>{if(x.p&&P[x.p]&&!seen.has(x.p)){seen.add(x.p);list.push(P[x.p])}}));
  list.forEach(p=>{const c=el('button','pc');c.style.setProperty('--pc',p.grade?GC[p.grade]:REG[p.r].hex);
    c.style.width='100%';c.style.textAlign='left';
    const gl=p.grade?{green:'初級',red:'中級',black:'上級'}[p.grade]:'';
    c.innerHTML=`<div class="top"><span class="sw"></span><h3>${esc(p.zh)}<span>${esc(p.jp)}${gl?' · '+gl:''}</span></h3></div>`;
    const nb=noteBlock(p); if(nb) c.appendChild(nb);
    const mine=el('p',null,esc(p.note));
    if(nb){const tg=el('span',null,'参考');
      tg.style.cssText='font-family:var(--mono);font-size:11px;letter-spacing:.09em;color:var(--faint);border:1px solid var(--line);border-radius:3px;padding:1px 5px;margin-right:6px;vertical-align:1px';
      mine.prepend(tg)}
    c.appendChild(mine);
    c.appendChild(linkRow(p,false));
    c.onclick=e=>{if(e.target.closest('a,.lk2,.ndel'))return;
      if(mapOK){map.flyTo([p.lat,p.lng],12,{duration:.7});mReg[p.id]?.openPopup();if(innerWidth<=900)snap(0)}};
    s.appendChild(c)})}

/* ── 预算 ── */
function vBud(s){
  const b=st.budget[st.opt]||(st.budget[st.opt]={...V[st.opt].budget});
  const tot=BROWS.reduce((a,r)=>a+(b[r.k]||0),0),dv=st.perPerson?2:1;
  const f=n=>st.ccy==='CAD'?'$'+Math.round(n/dv).toLocaleString():'¥'+Math.round(n*st.rate/dv).toLocaleString();
  const nd=V[st.opt].days.length;
  const t=el('div','btot');
  t.innerHTML=`<div><div class="cap">${st.perPerson?'每人':'两人合计'} · ${nd} 天</div><div class="big">${f(tot)}</div></div>
    <div class="side">${st.ccy==='CAD'?'¥'+Math.round(tot*st.rate/dv).toLocaleString():'$'+Math.round(tot/dv).toLocaleString()}<br><span style="color:var(--faint)">${f(tot/nd)} / 天</span></div>`;
  s.appendChild(t);
  const ct=el('div','row');ct.style.marginBottom='16px';
  const mk=(x,on,fn)=>{const q=el('button','btn'+(on?' pri':''),x);q.onclick=fn;return q};
  ct.appendChild(mk(st.perPerson?'每人':'两人合计',st.perPerson,()=>{st.perPerson=!st.perPerson;renderBody();save()}));
  ct.appendChild(mk(st.ccy,st.ccy==='JPY',()=>{st.ccy=st.ccy==='CAD'?'JPY':'CAD';renderBody();save()}));
  ct.appendChild(mk('重置',false,()=>{st.budget[st.opt]={...V[st.opt].budget};renderBody();save()}));
  s.appendChild(ct);
  BROWS.forEach(r=>{const w=el('div','bl');
    w.innerHTML=`<div class="lr"><span class="nm">${esc(r.n)}${r.s?`<small>${esc(r.s)}</small>`:''}</span><span class="vv">${f(b[r.k]||0)}</span></div>`;
    const sl=el('input');sl.type='range';sl.min=0;sl.max=r.max;sl.step=25;sl.value=b[r.k]||0;
    sl.oninput=e=>{b[r.k]=+e.target.value;renderBody()};sl.onchange=()=>save();
    w.appendChild(sl);s.appendChild(w)});
  /* 实付对账 */
  const bks=bookings();
  const paid=bks.reduce((a,b)=>a+(bkGet(b.id)?.amt||0),0);
  const nbk=bks.filter(b=>bkGet(b.id)?.state==='ok').length;
  s.appendChild(el('h2','sec',LABELS.reconcile));
  if(!nbk){s.appendChild(el('p','tx','还没有登记任何已订项目。去「备忘」那页把订好的东西打勾并填金额，这里会自动汇总。'))}
  else{
   const w=el('div','btot');
   w.innerHTML=`<div><div class="cap">已登记 ${nbk} / ${bks.length} 项</div><div class="big">$${Math.round(paid/dv).toLocaleString()}</div></div>
    <div class="side">预算 ${f(tot)}<br><span style="color:${paid>tot?'var(--rd)':'var(--gr)'}">${paid>tot?'超':'剩'} $${Math.abs(Math.round((tot-paid)/dv)).toLocaleString()}</span></div>`;
   s.appendChild(w)}
  s.appendChild(el('h2','sec','汇率'));
  const fd=el('div','fd');fd.innerHTML='<label class="lb">1 CAD = ? JPY</label>';
  const i=el('input');i.type='number';i.value=st.rate;i.step='0.5';
  i.onchange=e=>{st.rate=+e.target.value||115;renderBody();save()};fd.appendChild(i);s.appendChild(fd);
  s.appendChild(el('p','tx',TXT.budgetNote));
}

/* ── 备忘 ── */
function vPrep(s){
  s.appendChild(el('h2','sec',LABELS.weather));
  wxBlock(s);
  s.appendChild(el('h2','sec',LABELS.drive));
  qBlock(s);
  s.appendChild(el('p','tx',TXT.drive));
  {const t=el('p','tx');t.style.cssText='font-size:12px;color:var(--mist)';t.innerHTML='日期可在右上角「改日期」修改。天数不变，整段平移，星期和天气窗口随之更新。';s.appendChild(t)}
  s.appendChild(el('h2','sec',LABELS.rules));
  RULES.forEach(([n,d])=>{const w=el('div','bl');
    w.innerHTML=`<div class="nm">${esc(n)}<small style="margin-top:3px;display:block">${esc(d)}</small></div>`;
    s.appendChild(w)});

  /* ── Moraine Lake 抢票分步 ── */
  if(typeof SHUTTLE!=='undefined'){
    s.appendChild(el('h2','sec','Moraine Lake 抢票'));
    const hd=el('div','shbox');
    hd.innerHTML=`<div class="shtop"><span class="shk">官网</span>`
      +`<a class="lk2" href="${SHUTTLE.url}" target="_blank" rel="noopener noreferrer">reservation.pc.gc.ca</a></div>`
      +`<div class="shp">${esc(SHUTTLE.price)}</div>`
      +`<div class="shp">停车：${esc(SHUTTLE.parking)}`
      +` <a class="lk2" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SHUTTLE.parking)}" target="_blank" rel="noopener noreferrer">地图</a></div>`;
    s.appendChild(hd);
    SHUTTLE.steps.forEach(([n,d],i)=>{const w=el('div','shstep');
      w.innerHTML=`<span class="shnum">${i+1}</span><span class="shtx"><b>${esc(n)}</b><small>${esc(d)}</small></span>`;
      s.appendChild(w)});
    s.appendChild(el('h2','sec','抢不到票的替代方案'));
    SHUTTLE.fallback.forEach(([n,d])=>{const w=el('div','bl');
      w.innerHTML=`<div class="nm">${esc(n)}<small style="margin-top:3px;display:block">${esc(d)}</small></div>`;
      s.appendChild(w)});
  }

  /* ── 离线地图 ── */
  if(typeof OFFLINE!=='undefined'){
    s.appendChild(el('h2','sec','离线地图'));
    OFFLINE.forEach(([n,d])=>{const w=el('div','bl');
      w.innerHTML=`<div class="nm">${esc(n)}<small style="margin-top:3px;display:block">${esc(d)}</small></div>`;
      s.appendChild(w)});
    const note=el('p','tx');
    note.style.cssText='font-size:12px;color:var(--mist)';
    note.textContent='说明：两家地图 App 均不支持从网页一键触发离线下载，只能在 App 内手动框选。出发前在 wifi 下做完。';
    s.appendChild(note);
  }

  /* ── 预订清单 ── */
  const bks=bookings();
  const dn=bks.filter(b=>bkGet(b.id)?.state==='ok').length;
  s.appendChild(el('h2','sec',`预订 ${dn} / ${bks.length}`));
  s.appendChild(el('p','tx',TXT.bookingIntro));
  bks.forEach(b=>{
    const r=bkGet(b.id),ok=r?.state==='ok';
    const w=el('div','bkrow'+(ok?' done':''));
    w.innerHTML=`<div style="display:flex;align-items:flex-start;gap:9px">
      <span class="box${ok?' on':''}"></span>
      <span style="flex:1"><span style="font-size:13.5px">${esc(b.n)}</span>
      <span class="vfy ${ok?'ok':'todo'}" style="margin-left:6px">${ok?'已订':'未订'}</span>
      ${ok&&r.ref?`<small style="display:block;font-family:var(--mono);font-size:12px;color:var(--slate);margin-top:3px">确认号 ${esc(r.ref)}</small>`:''}
      ${ok&&r.amt?`<small style="display:block;font-family:var(--mono);font-size:12px;color:var(--mist)">实付 $${Number(r.amt).toLocaleString()} CAD</small>`:''}
      ${ok&&r.by?`<small style="display:block;font-family:var(--mono);font-size:11.5px;color:var(--faint);margin-top:2px">${esc(r.by)} · ${esc(r.at||'')}</small>`:''}
      </span><span class="pill">${esc(b.t)}</span></div>`;
    w.querySelector('.box').parentNode.style.cursor='pointer';
    w.onclick=()=>bkModal(b);
    s.appendChild(w)});
  const ic=el('button','btn','↓ 导出到日历 .ics');ic.onclick=toICS;
  ic.style.marginTop='12px';s.appendChild(ic);

  s.appendChild(el('h2','sec',LABELS.prepList));
  s.appendChild(el('p','tx',TXT.prepIntro));
  TODOS.filter(t=>t.v.includes(st.opt)).forEach(t=>{
    const dn=!!st.done[t.id];const b=el('button','td'+(dn?' done':''));
    b.innerHTML=`<span class="box"></span><span class="tx2">${esc(t.n)}<small>${esc(t.s)}</small></span><span class="due ${dn?'ok':''}">${esc(t.due)}</span>`;
    b.onclick=()=>{st.done[t.id]=!dn;renderTabs();renderBody();save()};s.appendChild(b)});
  s.appendChild(el('h2','sec',LABELS.aboutPage));
  s.appendChild(el('p','tx',TXT.aboutPage));
  const rw=el('div','row');
  const e2=el('button','btn','导出 JSON');e2.onclick=exJ;rw.appendChild(e2);
  const i2=el('button','btn','导入 JSON');i2.onclick=imJ;rw.appendChild(i2);s.appendChild(rw);
  const w=el('p','tx');w.style.cssText='margin-top:14px;font-size:12px;color:var(--faint)';
  w.textContent=TXT.aboutFoot;
  s.appendChild(w)}

const AREA_HINT={bc:'British Columbia Canada',yoho:'Yoho National Park BC',banff:'Banff National Park Alberta',cal:'Calgary Alberta',ice:'Alberta Canada',ski:'Canada'};
const PLACE_TAB='spots';
Object.keys(P).forEach(k=>{if(!P[k].jp)P[k].jp=P[k].en||P[k].es||P[k].zh});
const LK2={
  /* 用地名搜索：落在真实的地点卡片上（含营业时间、评价、照片） */
  map:  p=>`https://www.google.com/maps/search/?api=1&query=${gquery(p)}`,
  /* 坐标兜底：地名搜不到时用这个 */
  pin:  p=>`https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}`,
  dir:  p=>`https://www.google.com/maps/dir/?api=1&destination=${gquery(p)}&travelmode=transit`,
  site: p=>`https://www.google.com/search?q=${encodeURIComponent((p.jp||p.zh)+' official site hours')}`,
  /* 食べログ：日本餐厅的实际权威来源 */
  tabelog: q=>`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`,
  /* Yahoo 乗換案内：日本人自己用的换乘工具，比谷歌准 */
  transit: (a,b)=>`https://transit.yahoo.co.jp/search/result?from=${encodeURIComponent(a)}&to=${encodeURIComponent(b)}`,
  /* 住宿比价 */
  booking: (q,ci,co)=>`https://www.booking.com/searchresults.html?ss=${encodeURIComponent(q)}`
            +(ci?`&checkin=${ci}`:'')+(co?`&checkout=${co}`:''),
  ghotel:  q=>`https://www.google.com/travel/search?q=${encodeURIComponent(q)}`,
  agoda:   q=>`https://www.agoda.com/search?text=${encodeURIComponent(q)}`,
  xhsWeb:  q=>`https://www.xiaohongshu.com/search_result?keyword=${encodeURIComponent(q)}`
};

/* ── 一个地点的深链行 ── */
function linkRow(p,compact){
  const w=el('div','lkrow');
  const A=(t,href,cls)=>{const a=document.createElement('a');a.className='lk2'+(cls?' '+cls:'');
    a.href=href;a.target='_blank';a.rel='noopener noreferrer';a.textContent=t;return a};
  const B=(t,fn,cls)=>{const b=el('button','lk2'+(cls?' '+cls:''),null);b.textContent=t;
    b.onclick=e=>{e.stopPropagation();fn()};return b};
  w.appendChild(A('地图',LK2.map(p)));
  w.appendChild(A('导航',LK2.dir(p)));
  const j=B('英文名 ⧉',()=>copyJP(p),'jp'); j.title=p.jp||p.zh; w.appendChild(j);
  if(!compact){
    const kind=p.kind||'poi';
    if(kind!=='way'){
      w.appendChild(A('官网 / 营业时间',LK2.site(p)));
      w.appendChild(B('攻略搜索',()=>openXHS((p.en||p.zh)+' Banff')));
    }
    w.appendChild(A('坐标',LK2.pin(p),'dim'));
    w.appendChild(B('＋ 笔记',()=>noteModal(p),'nt'));
  }
  return w;
}

function isoDate(dstr,year){ const a=String(dstr).split('.');
  if(a.length<2||!/^\d{2}$/.test(a[0])||!/^\d{2}$/.test(a[1])) return null;
  return `${year}-${a[0]}-${a[1]}`; }
/* ── 整日导航 ──
   1. 省略 origin → Google 自动用「我的位置」
   2. 途经点一律用坐标，避免同名/解析失败
   3. 终点优先用用户自设住宿地址（每个行程码各自保存） */
function stayAddr(k){
  if(!k) return null;
  const custom=(st.addr||{})[k];
  if(custom&&custom.trim()) return custom.trim();
  if(typeof STAY!=='undefined'&&STAY[k]&&STAY[k].nav) return STAY[k].nav;
  return null;
}
function dayRouteUrl(v,i){
  const d=v.days[i];
  const pts=(d.stops||[]).map(x=>x.p?P[x.p]:null).filter(Boolean);
  if(!pts.length) return null;
  // 途经点用坐标，最稳
  let way=pts.map(p=>p.lat.toFixed(5)+','+p.lng.toFixed(5));
  way=way.filter((x,j)=>j===0||x!==way[j-1]);
  const k=stayKey(d.stay);
  const hotel=stayAddr(k);
  let dest;
  if(hotel){ dest=hotel; }
  else { dest=way.pop(); }            // 无住宿地址 → 最后一个停靠点当终点
  if(!dest) return null;
  // Google Maps URL API 最多 9 个途经点
  if(way.length>9) way=way.slice(0,9);
  return 'https://www.google.com/maps/dir/?api=1'
    +'&destination='+encodeURIComponent(dest)
    +(way.length?'&waypoints='+way.map(encodeURIComponent).join('%7C'):'')
    +'&travelmode=driving';
}
/* ── 自设住宿地址（同一行程码内共享） ── */
async function addrModal(k){
  if(!st.me.name) return meM(()=>addrModal(k));
  const cur=(st.addr||{})[k]||'';
  const def=(typeof STAY!=='undefined'&&STAY[k]&&STAY[k].nav)?STAY[k].nav:'';
  openM(`<h3>${esc(k)} 的住宿地址</h3>
   <p class="mp">用于「本日整条路线导航」的终点。填酒店名或完整地址，越具体越准。</p>
   <div class="fd"><label class="lb">住宿地址</label>
     <input type="text" id="ad2" maxlength="120" value="${esc(cur)}" placeholder="${esc(def||'例：Hilton Garden Inn Calgary Downtown')}"></div>
   <div class="tiny">留空则用默认值${def?'：'+esc(def):'（当天最后一个停靠点）'}</div>
   <div class="row" style="margin-top:12px"><button class="btn" id="adclr">清除</button>
     <button class="btn pri" id="adok">保存</button></div>
   <div class="row" style="margin-top:7px"><button class="btn" data-close>取消</button></div>`,
  b=>{
   b.querySelector('#ad2').focus();
   b.querySelector('#adok').onclick=async()=>{
     const val=b.querySelector('#ad2').value.trim();
     st.addr=st.addr||{};
     if(val) st.addr[k]=val; else delete st.addr[k];
     await S.set(K.addr(),st.addr,true);
     closeM(); renderBody(); toast(val?'已保存住宿地址':'已恢复默认');
   };
   b.querySelector('#adclr').onclick=async()=>{
     st.addr=st.addr||{}; delete st.addr[k];
     await S.set(K.addr(),st.addr,true);
     closeM(); renderBody(); toast('已恢复默认');
   };
  });
}
function dayNavRow(v,i){
  const url=dayRouteUrl(v,i);
  if(!url) return null;
  const w=el('div','lkrow'); w.style.margin='10px 0 0';
  const a=document.createElement('a');
  a.className='lk2 navday'; a.href=url; a.target='_blank'; a.rel='noopener noreferrer';
  a.textContent='本日整条路线导航';
  w.appendChild(a);
  const k=stayKey(v.days[i].stay);
  if(k&&k!=='—'&&k!=='机上'){
    const b2=el('button','lk2',null);
    b2.textContent=(st.addr||{})[k]?'终点：已自设':'改终点住宿';
    b2.onclick=e=>{e.stopPropagation();addrModal(k)};
    w.appendChild(b2);
  }
  const tip=el('div','navtip');
  tip.textContent='起点为你的当前位置。途经点用坐标，不受同名影响。';
  w.appendChild(tip);
  return w;
}
function stayBlock(day,isoOverride){
  const k=stayKey(day.stay);
  if(!k||k==='—'||k==='机上'||typeof STAY==='undefined'||!STAY[k]) return null;
  const S2=STAY[k];
  const ci=isoOverride||null;
  const co=ci?(()=>{const d=new Date(ci+'T00:00:00Z');
    if(isNaN(d)) return null;
    d.setUTCDate(d.getUTCDate()+1);return d.toISOString().slice(0,10)})():null;
  const box=el('div','stayb');
  box.appendChild(el('div','stayh',
    `<span class="sn2">住 · ${esc(k)}</span><span class="sa">${esc(S2.area||'')}</span>`));
  (S2.opts||[]).forEach(o=>{
    const r=el('div','sopt'+(o.pick?' pick':''));
    r.innerHTML=`<div class="st"><span class="tier">${esc(o.tier||'')}</span>`
      +`<span class="sname">${esc(o.n)}</span>`
      +(o.pick?'<span class="pk">建议</span>':'')+`</div>`
      +(o.why?`<div class="swhy">${esc(o.why)}</div>`:'');
    const lr=el('div','lkrow');
    [['Booking',LK2.booking(o.q||((S2.area||k)+' '+(o.n||'')),ci,co)],
     ['Google 酒店',LK2.ghotel(/hotel|ryokan|accommodation|apartment|lodge/i.test(o.q||'')?(o.q||''):((o.q||S2.area||k)+' hotel'))],
     ['Agoda',LK2.agoda(o.q||S2.area||k)]].forEach(([t,h])=>{
      const a=document.createElement('a');a.className='lk2';a.href=h;a.target='_blank';
      a.rel='noopener noreferrer';a.textContent=t;lr.appendChild(a)});
    r.appendChild(lr);
    box.appendChild(r)});
  if((S2.food||[]).length){
    box.appendChild(el('div','stayh2','吃'));
    S2.food.forEach(f=>{
      const r=el('div','sfood');
      r.innerHTML=`<div class="st"><span class="sname">${esc(f.n)}</span>`
        +(f.jp?`<span class="fjp">${esc(f.jp)}</span>`:'')+`</div>`
        +(f.why?`<div class="swhy">${esc(f.why)}</div>`:'');
      const lr=el('div','lkrow');
      const a1=document.createElement('a');a1.className='lk2';a1.href=LK2.tabelog(f.jp||f.n);
      a1.target='_blank';a1.rel='noopener noreferrer';a1.textContent='地图搜';lr.appendChild(a1);
      const a2=document.createElement('a');a2.className='lk2';
      a2.href=`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((f.jp||f.n)+' '+(S2.area||k))}`;
      a2.target='_blank';a2.rel='noopener noreferrer';a2.textContent='地图';lr.appendChild(a2);
      const b=el('button','lk2',null);b.textContent='小红书';
      b.onclick=e=>{e.stopPropagation();openXHS(f.n)};lr.appendChild(b);
      r.appendChild(lr);box.appendChild(r)});
  }
  const note=el('div','staynote');
  note.textContent='上面是方向和筛选条件，不是具体房源清单——按钮已按当晚日期预填好搜索。价格和空房以平台当日为准。';
  box.appendChild(note);
  return box;
}

/* ── 加地点弹窗 v2：名字搜索 + 粘贴链接 ── */
function addM(pre){
  if(!st.me.name) return meM(()=>addM(pre));
  openM(`<h3>添加地点</h3>
   <p class="mp">三种方式：搜名字、粘贴谷歌地图链接、或在地图上长按取点。</p>
   <div class="fd"><label class="lb">① 搜名字</label>
     <div style="display:flex;gap:6px"><input type="text" id="gq" placeholder="例：Emerald Lake / Banff Ave"
       style="flex:1"><button class="btn" id="gbtn" style="flex:0 0 auto">搜索</button></div>
     <div id="gres"></div>
     <div class="tiny">地理编码来自 OpenStreetMap Nominatim，志愿者服务器，每秒限一次，偶尔搜不到。
       搜不到就用②或③。数据 © OpenStreetMap contributors</div>
   </div>
   <div class="fd"><label class="lb">② 粘贴谷歌地图链接 / 坐标</label>
     <input type="text" id="gpaste" placeholder="粘贴分享链接，或 34.6659,135.5011"></div>
   <div class="fd"><label class="lb">名字</label><input type="text" id="an" maxlength="40"
     value="${pre&&pre.name?esc(pre.name):''}" placeholder="显示在地图上的名字"></div>
   <div class="fd"><label class="lb">为什么想去</label><textarea id="ad" maxlength="200"
     placeholder="小红书看到的 / 朋友推荐 / 想拍的机位"></textarea></div>
   <div class="row"><div class="fd"><label class="lb">纬度</label>
     <input type="number" id="alat" step="0.00001" value="${pre?pre.lat.toFixed(5):''}"></div>
     <div class="fd"><label class="lb">经度</label>
     <input type="number" id="alng" step="0.00001" value="${pre?pre.lng.toFixed(5):''}"></div></div>
   <div class="row" style="margin-top:5px"><button class="btn" data-close>取消</button>
     <button class="btn pri" id="as">加进地图</button></div>`,
  b=>{
    const $q=b.querySelector('#gq'), $res=b.querySelector('#gres'),
          $lat=b.querySelector('#alat'), $lng=b.querySelector('#alng'), $an=b.querySelector('#an');
    const setPt=(lat,lng,nm)=>{$lat.value=(+lat).toFixed(5);$lng.value=(+lng).toFixed(5);
      if(nm&&!$an.value.trim())$an.value=nm};
    async function run(){
      const q=$q.value.trim(); if(q.length<2) return toast('至少两个字');
      $res.innerHTML='<div class="tiny">搜索中…</div>';
      const rs=await geoSearch(q);
      $res.innerHTML='';
      if(!rs){ $res.innerHTML='<div class="tiny warn">没搜到，或服务暂时不可用。用②粘贴链接更稳。</div>'; return }
      if(!rs.length){ $res.innerHTML='<div class="tiny warn">没有结果。换个写法，或加上城市名。</div>'; return }
      rs.forEach(x=>{
        const r=el('button','gitem');
        const short=x.name.split(',').slice(0,3).join(',');
        r.innerHTML=`<span class="gn">${esc(short)}</span><span class="gk">${esc(x.kind)}</span>`;
        r.onclick=ev=>{ev.preventDefault();setPt(x.lat,x.lng,short.split(',')[0].trim());
          $res.querySelectorAll('.gitem').forEach(z=>z.classList.remove('on'));
          r.classList.add('on'); toast('已取点')};
        $res.appendChild(r)});
    }
    b.querySelector('#gbtn').onclick=run;
    $q.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();run()}});
    b.querySelector('#gpaste').addEventListener('input',e=>{
      const c=parseCoords(e.target.value);
      if(c){ setPt(c.lat,c.lng); toast('已从链接取到坐标') }});
    $an.focus();
    b.querySelector('#as').onclick=async()=>{
      const n=$an.value.trim();
      const la=parseFloat($lat.value), ln=parseFloat($lng.value);
      if(!n) return toast('起个名字');
      if(isNaN(la)||isNaN(ln)) return toast('还没有坐标 — 用上面三种方式之一取一个');
      st.pins.push({id:uid(),name:n,note:b.querySelector('#ad').value.trim(),lat:la,lng:ln,
        by:st.me.name,byId:st.me.id,color:st.me.color,likes:[],at:Date.now()});
      closeM(); st.tab=PLACE_TAB; renderTabs(); renderBody(); drawPin();
      if(typeof mapOK==='undefined'||mapOK) try{map.flyTo([la,ln],13,{duration:.7})}catch(e){}
      await push(); toast('加好了，同行的人也能看到');
    };
  });
}

/* ═══════ 9. 协作 ═══════ */
async function pull(loud){
  $('#syncDot').className='dot busy';
  const [p,m,bk,nt,ad]=await Promise.all([S.get(K.pins(),true),S.get(K.mem(),true),
    S.get(K.bk(),true),S.get(K.notes(),true),S.get(K.addr(),true)]);
  if(Array.isArray(p))st.pins=p;if(Array.isArray(m))st.members=m;
  if(bk&&typeof bk==='object')st.bk=bk;if(nt&&typeof nt==='object')st.notes=nt;if(ad&&typeof ad==='object')st.addr=ad;
  $('#syncDot').className=S.ok?'dot':'dot off';
  renderMem();renderTabs();if(st.tab==='spots')renderBody();drawPin();
  if(loud)toast(S.ok?`已保存在本机 · ${st.pins.length} 个点`:'当前环境没有共享存储，改动只留在本次会话')}
async function load(){const c=await S.get(K.cfg());if(!c)return;
 st.room=c.room||st.room;st.opt=V[c.opt]?c.opt:'A';st.me=c.me||st.me;
 st.budget=c.budget||{};st.done=c.done||{};st.rate=c.rate||115;
 st.perPerson=!!c.perPerson;st.ccy=c.ccy||'CAD'}

