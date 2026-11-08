/* shared/engine.js —— 行程页的通用引擎。由 5 个站里完全相同的代码合并而来。
   每个行程自己的配置和特有部件在各自文件夹的 trip.js 里。 */

if(window.__BAD) throw new Error('内容检查没通过，见页面上的说明');
if(typeof V==='undefined'||typeof P==='undefined'){document.getElementById('app').innerHTML='<div style="padding:40px;font-family:monospace;font-size:13px;line-height:2">content.js 没加载成功。<br>确认它和 index.html 在同一个文件夹里，文件名一字不差。<br>如果刚改过 content.js，多半是里面有语法错误 —— 按 F12 看 Console 的红字。</div>';throw new Error('content.js missing');}
/* ═══════ 1. 存储适配层 ═══════ */
const mem=new Map();
const S={ok:typeof window.storage!=='undefined'&&window.storage,
 async get(k,sh=false){if(!this.ok)return mem.has(k+sh)?mem.get(k+sh):null;
  try{const r=await window.storage.get(k,sh);return r?JSON.parse(r.value):null}catch(e){return null}},
 async set(k,v,sh=false){if(!this.ok){mem.set(k+sh,v);return true}
  try{await window.storage.set(k,JSON.stringify(v),sh);return true}catch(e){return false}}};



async function copyJP(p){
 try{await navigator.clipboard.writeText(p.jp)}
 catch(e){const t=document.createElement('textarea');t.value=p.jp;document.body.appendChild(t);
  t.select();try{document.execCommand('copy')}catch(_){}t.remove()}
 toast('已复制「'+p.jp+'」')}

/* ── 实地笔记：你们写的，压在我写的上面 ── */
function notesOf(id){return (st.notes||{})[id]||[]}
async function addNote(id,txt){st.notes=st.notes||{};
 st.notes[id]=notesOf(id).concat([{by:st.me.name,at:new Date().toISOString().slice(0,10),t:txt}]);
 await S.set(K.notes(),st.notes,true);renderBody()}
async function delNote(id,i){st.notes[id]=notesOf(id).filter((_,k)=>k!==i);
 if(!st.notes[id].length)delete st.notes[id];
 await S.set(K.notes(),st.notes,true);renderBody()}
function noteModal(p){
 if(!st.me.name)return meM(()=>noteModal(p));
 openM(`<h3>${esc(p.zh)}</h3><p class="mp">${esc(TXT.noteHint)}</p>
  <div class="fd"><textarea id="nt" maxlength="300" placeholder="例：1/12 首缆 8:15 排队，缆车 12 分钟到顶。山顶食堂只收现金。"></textarea></div>
  <div class="row"><button class="btn" data-close>取消</button><button class="btn pri" id="nok">记下</button></div>`,
 b=>{b.querySelector('#nt').focus();
  b.querySelector('#nok').onclick=async()=>{const t=b.querySelector('#nt').value.trim();
   if(!t)return toast('写点什么');closeM();await addNote(p.id,t);toast('记下了')}})}
function noteBlock(p){
 const ns=notesOf(p.id);if(!ns.length)return null;
 const w=el('div','notes');
 ns.forEach((n,i)=>{const r=el('div','note');
  r.innerHTML=`<div class="nb">${esc(n.t)}</div><div class="nm">${esc(n.by||'匿名')} · ${esc(n.at||'')}</div>`;
  if(n.by===st.me.name){const d=el('button','ndel','×');
   d.onclick=e=>{e.stopPropagation();delNote(p.id,i)};r.appendChild(d)}
  w.appendChild(r)});
 return w}

let WX={fc:null,hist:null,at:0,err:null};
function lastYear(dstr){ /* "2027.01.08 → 01.24" → 去年同期 */
 const m=dstr.match(/(\d{4})\.(\d{2})\.(\d{2}).*?(\d{2})\.(\d{2})/);if(!m)return null;
 const y=+m[1]-1;return{a:`${y}-${m[2]}-${m[3]}`,b:`${y}-${m[4]}-${m[5]}`}}
const bkKey=id=>st.opt+':'+id;
function bkGet(id){return (st.bk||{})[bkKey(id)]||null}
async function bkSet(id,rec){st.bk=st.bk||{};
 if(rec)st.bk[bkKey(id)]=rec;else delete st.bk[bkKey(id)];
 await S.set(K.bk(),st.bk,true);renderTabs();renderBody()}

/* ── .ics 日历导出 ── */
function icsDate(dstr,mmdd){
 const y=(dstr.match(/(\d{4})/)||[])[1]||'2027';
 const m=mmdd.split('.');return `${y}${m[0]}${m[1]}`}
/* ═══════ 5. 状态 ═══════ */
const AVC=['#D63C33','#1A6FBF','#1F8F5F','#C98A15','#8B4FB5','#0F9B9B','#D6588C','#5A6B8C'];
const $=s=>document.querySelector(s);
const el=(t,c,h)=>{const e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e};
const esc=s=>String(s??'').replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
const uid=()=>Math.random().toString(36).slice(2,10);
let tT;const toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(tT);tT=setTimeout(()=>t.classList.remove('show'),2500)};
/* ═══════ 6. 地图 ═══════ */
const BASES=[
 {n:'街道',u:'https://tile.openstreetmap.org/{z}/{x}/{y}.png',a:'&copy; OpenStreetMap contributors',max:19},
 {n:'地形',u:'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',a:'&copy; OpenStreetMap · SRTM | &copy; OpenTopoMap (CC-BY-SA)',max:17}
];
let map,bi=0,bl,lPl,lPin,lRt,mReg={},adding=false,mapOK=false;
function initMap(){
  if(typeof L==='undefined'){$('#map').innerHTML='<div style="padding:26px;font-family:var(--mono);font-size:12.5px;color:var(--mist);line-height:1.9">地图组件没能加载（网络拦截了 CDN）。<br>行程、方案、预算、清单全部照常可用。</div>';return}
  map=L.map('map',{zoomControl:true}).setView([39.5,139.5],5);
  map.zoomControl.setPosition('bottomright');
  setBase(0);
  lRt=L.layerGroup().addTo(map);lPl=L.layerGroup().addTo(map);lPin=L.layerGroup().addTo(map);
  let lt;
  map.on('contextmenu',e=>drop(e.latlng));
  map.on('click',e=>{if(adding){drop(e.latlng);setAdd(false)}});
  map.on('mousedown',e=>{lt=setTimeout(()=>drop(e.latlng),620)});
  map.on('mouseup mousemove dragstart zoomstart',()=>clearTimeout(lt));
  mapOK=true;
}
function setBase(i){if(!mapOK&&bl)return;bi=i;if(bl)map.removeLayer(bl);const b=BASES[i];
  bl=L.tileLayer(b.u,{attribution:b.a,maxZoom:b.max,subdomains:'abc'}).addTo(map);$('#baseBtn').textContent='底图 · '+b.n}
/* 图钉：纸色底、墨色描边的小圆，区域色只出现在描边上（样式在 skin.css 的 .pinico） */
const ico=(hex,txt,sz)=>L.divIcon({className:'',html:`<div class="pinico" style="--pc:${hex}">${esc(txt)}</div>`,iconSize:[22,22],iconAnchor:[11,11]});
const icoU=(hex,txt)=>L.divIcon({className:'',html:`<div class="pinico usr" style="--pc:${hex}"><span>${esc(txt)}</span></div>`,iconSize:[22,22],iconAnchor:[11,11]});
const GC={green:'#1F8F5F',red:'#D63C33',black:'#141A22'};

function drawPl(){
  if(!mapOK)return; lPl.clearLayers();mReg={};
  const seen=new Set();
  V[st.opt].days.forEach((d,i)=>d.stops.forEach(s=>{
    if(!s.p||seen.has(s.p))return;seen.add(s.p);
    const p=P[s.p];if(!p)return;
    const hex=p.grade?GC[p.grade]:REG[p.r].hex;
    const m=L.marker([p.lat,p.lng],{icon:ico(hex,String(i+1),23)}).addTo(lPl);
    m.bindPopup(`<b>${esc(p.zh)}</b><span class="jp">${esc(p.en)}</span><div style="margin-top:6px">${esc(p.note)}</div><span class="mt">D${i+1} · ${esc(d.d)} · ${REG[p.r].n}</span>`);
    mReg[p.id]=m;
  }));
}
function drawPin(){if(!mapOK)return;lPin.clearLayers();
  st.pins.forEach(p=>{const m=L.marker([p.lat,p.lng],{icon:icoU(p.color||'#8B4FB5',(p.by||'?').slice(0,1))}).addTo(lPin);
   m.bindPopup(`<b>${esc(p.name)}</b><div style="margin-top:4px">${esc(p.note||'')}</div><span class="mt">${esc(p.by||'匿名')} · ♥ ${(p.likes||[]).length}</span>`)})}
function focusDay(i){
  if(!mapOK)return;
  const d=V[st.opt].days[i];
  const pts=d.stops.filter(s=>s.p&&P[s.p]).map(s=>[P[s.p].lat,P[s.p].lng]);
  lRt.clearLayers();if(!pts.length)return;
  const hex=REG[d.r].hex;
  if(pts.length>1){L.polyline(pts,{color:hex,weight:2.5,opacity:.9,dashArray:'2 6'}).addTo(lRt);
    L.polyline(pts,{color:hex,weight:11,opacity:.09}).addTo(lRt)}
  map.flyToBounds(L.latLngBounds(pts).pad(.45),{duration:.8,maxZoom:12});
  $('#allBtn').classList.remove('on');
}
function showAll(){if(!mapOK)return;lRt.clearLayers();const pts=[];
  V[st.opt].days.forEach(d=>d.stops.forEach(s=>{if(s.p&&P[s.p])pts.push([P[s.p].lat,P[s.p].lng])}));
  st.pins.forEach(p=>pts.push([p.lat,p.lng]));
  if(pts.length)map.flyToBounds(L.latLngBounds(pts).pad(.14),{duration:.8});
  $('#allBtn').classList.add('on')}
function setAdd(v){adding=v;$('#addBtn').classList.toggle('on',v);
  $('#addBtn').textContent=v?'点地图落点…':'＋ 加点';if(mapOK)map.getContainer().style.cursor=v?'crosshair':'';
  if(v)toast('在地图上点一下')}

/* ═══════ 6.5 日期引擎 ═══════ */
const WD=['日','一','二','三','四','五','六'];
function planRange(v){
  const a=dayInfo(v,0), b=dayInfo(v,v.days.length-1);
  return a.iso? `${a.iso.replace(/-/g,'.')} → ${b.md}` : (v.dates||'');
}
function renderMem(){
  const w=$('#avatars');w.innerHTML='';
  const all=[...st.members];if(st.me.id&&!all.find(m=>m.id===st.me.id))all.unshift(st.me);
  all.slice(0,4).forEach(m=>{const a=el('span','av',esc((m.name||'?').slice(0,1)));a.style.background=m.color;a.title=m.name;w.appendChild(a)});
  $('#meName').textContent=st.me.name||'设置名字';$('#roomLabel').textContent=st.room;
}
function renderTabs(){
  const w=$('#tabs');w.innerHTML='';
  TABS.forEach(t=>{const b=el('button','tab');let n='';
    if(t.k==='spots')n=`<span class="n">${st.pins.length}</span>`;
    if(t.k==='itin')n=`<span class="n">${V[st.opt].days.length}</span>`;
    if(t.k==='prep')n=`<span class="n">${TODOS.filter(x=>x.v.includes(st.opt)&&!st.done[x.id]).length}</span>`;
    b.innerHTML=esc(t.n)+n;b.setAttribute('role','tab');b.setAttribute('aria-selected',st.tab===t.k);
    b.onclick=()=>{st.tab=t.k;renderTabs();renderBody();$('#scroll').scrollTop=0;if(innerWidth<=900)snap(1)};
    w.appendChild(b)})}
/* ══════════════════════════════════════════════════════════════
   链接与住宿模块
   1. 地图跳转改用「地名」而不是经纬度
   2. 小红书在手机上先试 App scheme，失败回退网页
   3. 加地点支持「名字搜索」和「粘贴谷歌地图链接」
   4. 每晚住宿 / 吃饭推荐 + 比价与预订深链
   ══════════════════════════════════════════════════════════════ */

/* ── 地名查询串：优先用日文名 + 地区，避免同名 ── */
function gquery(p){
  return encodeURIComponent(p.gq || ((p.jp||p.zh)+' '+(AREA_HINT[p.r]||'')).trim());
}
/* ── 小红书：手机上先试 App，1.2 秒没跳走就打开网页 ── */
const IS_MOBILE=/Android|iPhone|iPad|iPod|HarmonyOS/i.test(navigator.userAgent);
function openXHS(kw){
  const web=LK2.xhsWeb(kw);
  if(!IS_MOBILE){ window.open(web,'_blank','noopener'); return; }
  let gone=false;
  const mark=()=>{gone=true};
  document.addEventListener('visibilitychange',mark,{once:true});
  window.addEventListener('pagehide',mark,{once:true});
  const t=setTimeout(()=>{
    document.removeEventListener('visibilitychange',mark);
    if(!gone) window.location.href=web;
  },1200);
  try{ window.location.href='xhsdiscover://search/result?keyword='+encodeURIComponent(kw); }
  catch(e){ clearTimeout(t); window.location.href=web; }
}

/* ── 地理编码：Nominatim（OpenStreetMap）
   使用条款 https://operations.osmfoundation.org/policies/nominatim/
   志愿者服务器，无可用性保证。本实现：每秒最多 1 次、结果缓存、不做批量。
   数据 © OpenStreetMap contributors（ODbL）。 ── */
let geoAt=0, geoBusy=false;
async function geoSearch(q){
  const key='geo:'+q.toLowerCase().trim();
  const hit=await S.get(key); if(hit) return hit;
  if(geoBusy) return null;
  geoBusy=true;
  try{
    const wait=Math.max(0,1100-(Date.now()-geoAt));
    if(wait) await new Promise(r=>setTimeout(r,wait));
    geoAt=Date.now();
    const r=await fetch('https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5'
      +'&accept-language=zh-CN,ja,en&q='+encodeURIComponent(q));
    if(!r.ok) throw new Error('geo '+r.status);
    const j=await r.json();
    const out=j.map(x=>({name:x.display_name,lat:+x.lat,lng:+x.lon,kind:x.type||''}));
    await S.set(key,out);
    return out;
  }catch(e){ return null; }
  finally{ geoBusy=false; }
}
/* ── 粘贴谷歌地图链接 / 坐标，直接抽出经纬度 ── */
function parseCoords(t){
  t=String(t||'');
  let m=t.match(/@(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/);            if(m) return{lat:+m[1],lng:+m[2]};
  m=t.match(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/);               if(m) return{lat:+m[1],lng:+m[2]};
  m=t.match(/[?&](?:q|ll|daddr|destination)=(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/); if(m) return{lat:+m[1],lng:+m[2]};
  m=t.match(/^\s*(-?\d{1,2}(?:\.\d+)?)\s*[,，]\s*(-?\d{1,3}(?:\.\d+)?)\s*$/);          if(m) return{lat:+m[1],lng:+m[2]};
  return null;
}

/* ── 住宿 / 吃饭：每晚给 2–3 个方向 + 预订深链 ── */
function stayKey(s){ return String(s||'').replace(/\s?[①②③④⑤⑥⑦⑧⑨⑩⑪]/g,'').trim(); }
function stayBlock2(v,i){
  const info=dayInfo(v,i);
  return stayBlock(v.days[i], info.iso);
}
async function push(){$('#syncDot').className='dot busy';await S.set(K.pins(),st.pins,true);$('#syncDot').className=S.ok?'dot':'dot off'}
async function join(){if(!st.me.id)return;const m=await S.get(K.mem(),true)||[];
  const i=m.findIndex(x=>x.id===st.me.id),rec={id:st.me.id,name:st.me.name,color:st.me.color,at:Date.now()};
  if(i>=0)m[i]=rec;else m.push(rec);st.members=m;await S.set(K.mem(),m,true);renderMem()}
function drop(ll){if(!st.me.name){meM(()=>drop(ll));return}addM({lat:ll.lat,lng:ll.lng})}
async function like(id){if(!st.me.id)return meM();const p=st.pins.find(x=>x.id===id);if(!p)return;
  p.likes=p.likes||[];const i=p.likes.indexOf(st.me.id);if(i>=0)p.likes.splice(i,1);else p.likes.push(st.me.id);
  renderBody();drawPin();await push()}
async function del(id){st.pins=st.pins.filter(p=>p.id!==id);renderTabs();renderBody();drawPin();await push();toast('已删除')}

/* ═══════ 10. 弹窗 ═══════ */
function openM(h,fn){const b=$('#mbox');b.innerHTML=h;$('#modal').classList.add('show');fn&&fn(b);
  b.querySelectorAll('[data-close]').forEach(x=>x.onclick=closeM)}
const closeM=()=>$('#modal').classList.remove('show');
$('#modal').onclick=e=>{if(e.target.id==='modal')closeM()};
function meM(after){
  openM(`<h3>你是谁</h3><p class="mp">名字会跟在你加的每个点后面，这样才知道是谁想去的。</p>
   <div class="fd"><label class="lb">名字</label><input type="text" id="mn" maxlength="12" value="${esc(st.me.name)}" placeholder="比如 小K"></div>
   <div class="fd"><label class="lb">颜色</label><div id="cw" style="display:flex;gap:7px;flex-wrap:wrap"></div></div>
   <div class="row" style="margin-top:15px"><button class="btn" data-close>取消</button><button class="btn pri" id="ms">保存</button></div>`,
  b=>{const cw=b.querySelector('#cw');
   AVC.forEach(c=>{const d=el('button');d.style.cssText=`width:25px;height:25px;border-radius:7px;background:${c};border:2px solid ${st.me.color===c?'#0F151C':'transparent'}`;
    d.onclick=()=>{st.me.color=c;meM(after)};cw.appendChild(d)});
   b.querySelector('#mn').focus();
   b.querySelector('#ms').onclick=async()=>{const n=b.querySelector('#mn').value.trim();
    if(!n)return toast('填个名字');st.me.name=n;st.me.id=st.me.id||uid();
    closeM();save();await join();renderMem();toast('已加入 '+st.room);after&&after()}})}
function roomM(){
  openM(`<h3>行程码</h3><p class="mp">同一个码就是同一份地图。换一个没人用过的码，会得到一份全新的空白行程。</p>
   <div class="fd"><label class="lb">当前</label><input type="text" id="rc" maxlength="24" value="${esc(st.room)}"></div>
   <p class="mp" style="font-size:12.5px;color:var(--faint)">只能用字母数字和短横线。知道这个码的人都能看到里面的内容。</p>
   <div class="row"><button class="btn" data-close>取消</button><button class="btn pri" id="rs">切换</button></div>`,
  b=>{b.querySelector('#rs').onclick=async()=>{
   const v=b.querySelector('#rc').value.trim().toLowerCase().replace(/[^a-z0-9-]/g,'');
   if(v.length<3)return toast('至少 3 个字符');
   st.room=v;closeM();save();st.pins=[];st.members=[];await pull();await join();toast('已切到 '+v)}})}
function bkModal(b){
 if(!st.me.name)return meM(()=>bkModal(b));
 const r=bkGet(b.id)||{};
 openM(`<h3>${esc(b.n)}</h3><p class="mp">订好了就填确认号，没订就留空关掉。</p>
  <div class="fd"><label class="lb">确认号 / 订单号</label><input type="text" id="bref" maxlength="60" value="${esc(r.ref||'')}" placeholder="例如 ABC123 或 Booking #99887"></div>
  <div class="fd"><label class="lb">实付金额 ${typeof CUR!=='undefined'?CUR.home+'（'+CUR.label+'）':'CAD（两人合计）'}</label><input type="number" id="bamt" step="1" value="${r.amt||''}" placeholder="0"></div>
  <div class="row"><button class="btn" id="bclr">标为未订</button><button class="btn pri" id="bok">标为已订</button></div>
  <div class="row" style="margin-top:7px"><button class="btn" data-close>取消</button></div>`,
 x=>{x.querySelector('#bref').focus();
  x.querySelector('#bok').onclick=async()=>{
   await bkSet(b.id,{state:'ok',ref:x.querySelector('#bref').value.trim(),
    amt:+x.querySelector('#bamt').value||0,by:st.me.name,at:new Date().toISOString().slice(0,10)});
   closeM();toast('已记下')};
  x.querySelector('#bclr').onclick=async()=>{await bkSet(b.id,null);closeM();toast('已清除')}})}
function exJ(){const d={room:st.room,opt:st.opt,pins:st.pins,budget:st.budget,done:st.done,rate:st.rate};
 openM(`<h3>导出</h3><p class="mp">复制走，可以粘回任何一个行程码。</p>
  <textarea id="ex" style="height:220px;font-family:var(--mono);font-size:12.5px">${esc(JSON.stringify(d,null,2))}</textarea>
  <div class="row" style="margin-top:11px"><button class="btn" data-close>关闭</button><button class="btn pri" id="cp">复制</button></div>`,
 b=>{b.querySelector('#cp').onclick=async()=>{const ta=b.querySelector('#ex');
  try{await navigator.clipboard.writeText(ta.value)}catch(e){ta.select();try{document.execCommand('copy')}catch(_){return toast('复制失败，手动全选')}}
  toast('已复制')}})}
function imJ(){openM(`<h3>导入</h3><p class="mp">粘贴一份导出的 JSON，会覆盖当前行程码下的点位和预算。</p>
  <textarea id="im" style="height:190px;font-family:var(--mono);font-size:12.5px"></textarea>
  <div class="row" style="margin-top:11px"><button class="btn" data-close>取消</button><button class="btn pri" id="io">导入</button></div>`,
 b=>{b.querySelector('#io').onclick=async()=>{try{const d=JSON.parse(b.querySelector('#im').value);
  if(Array.isArray(d.pins))st.pins=d.pins;if(d.budget)st.budget=d.budget;if(d.done)st.done=d.done;
  if(d.opt&&V[d.opt])st.opt=d.opt;if(d.rate)st.rate=d.rate;
  closeM();renderOpts();renderTabs();renderBody();drawPl();drawPin();await push();save();toast('导入完成')}
  catch(e){toast('JSON 格式不对')}}})}

/* ═══════ 11. 本地配置 ═══════ */
let sT;const save=()=>{clearTimeout(sT);sT=setTimeout(()=>S.set(K.cfg(),
 {room:st.room,opt:st.opt,me:st.me,budget:st.budget,done:st.done,rate:st.rate,perPerson:st.perPerson,ccy:st.ccy}),320)};
/* ═══════ 12. 手机抽屉 ═══════ */
const SNAP=[0.14,0.40,0.90];let si=1,spx=0;const VH=()=>innerHeight;
function snap(i){if(innerWidth>900)return;si=Math.max(0,Math.min(2,i));spx=SNAP[si]*VH();
 document.documentElement.style.setProperty('--sheet-h',spx+'px')}
(function(){const p=$('#panel'),g=$('#grab'),sc=$('#scroll');
 let y0=0,h0=0,dr=false,mv=false;
 const st_=e=>{if(innerWidth>900)return;dr=true;mv=false;p.classList.add('dragging');
   y0=e.touches?e.touches[0].clientY:e.clientY;h0=spx||SNAP[si]*VH()};
 const mo=e=>{if(!dr)return;const y=e.touches?e.touches[0].clientY:e.clientY;
   if(Math.abs(y-y0)>3){mv=true;if(e.cancelable)e.preventDefault()}
   spx=Math.max(70,Math.min(VH()*.92,h0-(y-y0)));
   document.documentElement.style.setProperty('--sheet-h',spx+'px')};
 const en=()=>{if(!dr)return;dr=false;p.classList.remove('dragging');
   if(!mv){snap(si===2?1:2);return}
   const fr=spx/VH();let bs=0,bd=Infinity;SNAP.forEach((s,i)=>{const d=Math.abs(s-fr);if(d<bd){bd=d;bs=i}});snap(bs)};
 g.addEventListener('touchstart',st_,{passive:true});g.addEventListener('touchmove',mo,{passive:false});
 g.addEventListener('touchend',en);g.addEventListener('mousedown',st_);
 addEventListener('mousemove',mo);addEventListener('mouseup',en);
 let sy=0;sc.addEventListener('touchstart',e=>{sy=e.touches[0].clientY},{passive:true});
 sc.addEventListener('touchmove',e=>{if(innerWidth>900)return;
   if(sc.scrollTop<=0&&e.touches[0].clientY-sy>64&&si>0){snap(si-1);sy=e.touches[0].clientY}},{passive:true})})();

function __boot(){
/* ═══════ 13. 启动 ═══════ */
$('#baseBtn').onclick=()=>{if(mapOK)setBase((bi+1)%BASES.length)};
$('#allBtn').onclick=showAll;$('#addBtn').onclick=()=>setAdd(!adding);
$('#roomBtn').onclick=roomM;$('#dateBtn').onclick=dateModal;$('#meBtn').onclick=()=>meM();
addEventListener('resize',()=>{if(innerWidth>900)document.documentElement.style.removeProperty('--sheet-h');else snap(si);
  setTimeout(()=>mapOK&&map.invalidateSize(),120)});
addEventListener('keydown',e=>{if(e.key==='Escape'){closeM();if(adding)setAdd(false)}});
if('serviceWorker' in navigator&&location.protocol.startsWith('http')){
  navigator.serviceWorker.register('sw.js').catch(()=>{});}
(async function(){
  await load();initMap();
  renderOpts();renderTabs();renderBody();renderMem();drawPl();showAll();
  await pull();if(st.me.id)join();snap(1);
  loadWX().then(()=>{if(st.tab==='plan')renderBody()});
  setInterval(()=>{if(document.visibilityState==='visible')pull()},9000);
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')pull()});
  if(!S.ok)$('#syncDot').className='dot off';
  setTimeout(()=>mapOK&&map.invalidateSize(),200)})();
}
