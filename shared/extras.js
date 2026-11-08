/* ══════════════════════════════════════════════════════════════
   shared/extras.js —— 六个行程页共用的新增功能
   · 出行：航班（含倒计时、中转时长）、租车（还车倒计时）、取还车检查
   · 记账：多人垫付、按人分摊、一键算出谁转给谁、按类别统计、导出 CSV
   · 行程页：自动展开「今天」并标出来
   所有填写的内容存在本机浏览器（localStorage），按页面分开存。
   航班和租车信息都要自己填，页面不预设任何订单。
   ══════════════════════════════════════════════════════════════ */
(function(){
'use strict';
if(typeof st==='undefined'||typeof TABS==='undefined') return;   // 不是行程页就不动

const TRIP=document.documentElement.dataset.trip||'';
/* ── 数据：存进 window.storage（见 storage.js）。开了同步就是 Supabase，没开就是本机。
      每条记录带 u（修改时间），删除记 tomb（墓碑），两个人同时改时按这两样合并，不会互相覆盖。 ── */
const KEY='tripx';
const blank=()=>({flights:[],rental:null,chk:{},ledger:{people:[],items:[],ccy:'',pu:0},tomb:{}});
const norm=o=>{ const b=blank(), x=Object.assign(b,o||{}); x.ledger=Object.assign(blank().ledger,x.ledger||{}); x.tomb=x.tomb||{}; return x };
const newer=(a,b)=>((a.u||0)>=(b.u||0)?a:b);
function mergeList(r,l,tomb){
  const m=new Map();
  (r||[]).concat(l||[]).forEach(i=>{ const p=m.get(i.id); m.set(i.id,p?newer(p,i):i) });
  return [...m.values()].filter(i=>!tomb[i.id]);
}
function merge(r,l){
  r=norm(r); l=norm(l);
  const tomb=Object.assign({},r.tomb,l.tomb), out=norm({tomb});
  out.flights=mergeList(r.flights,l.flights,tomb);
  out.ledger.items=mergeList(r.ledger.items,l.ledger.items,tomb);
  const lp=(l.ledger.pu||0)>=(r.ledger.pu||0);
  out.ledger.people=(lp?l:r).ledger.people; out.ledger.pu=Math.max(l.ledger.pu||0,r.ledger.pu||0);
  out.ledger.ccy=l.ledger.ccy||r.ledger.ccy;
  out.rental=(l.rental&&r.rental)?newer(r.rental,l.rental):(l.rental||r.rental);
  if(tomb.rental&&(!out.rental||(out.rental.u||0)<=tomb.rental)) out.rental=null;
  out.chk=Object.assign({},r.chk,l.chk);
  return out;
}
let X=blank();
async function loadX(){
  try{ const r=await window.storage.get(KEY,true); if(r&&r.value) X=norm(JSON.parse(r.value)); }catch(e){}
}
let savingQ=Promise.resolve();
function save(){
  savingQ=savingQ.then(async()=>{
    try{
      const r=await window.storage.get(KEY,true);
      if(r&&r.value) X=merge(JSON.parse(r.value),X);
      await window.storage.set(KEY,JSON.stringify(X),true);
    }catch(e){ say('没存上，再试一次') }
  });
  return savingQ;
}

const q=s=>document.querySelector(s);
const mk=(t,c,h)=>{const e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e};
const esc=s=>String(s??'').replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
const say=m=>{ try{ toast(m) }catch(e){} };
const rid=()=>Math.random().toString(36).slice(2,10);
const openMod=(h,fn)=>{ if(typeof openM==='function') openM(h,fn); else openModal(h,fn) };
const closeMod=()=>{ if(typeof closeM!=='undefined') closeM(); else closeModal() };
const planKey=()=>st.variant||st.opt;
const pad=n=>String(n).padStart(2,'0');

/* ── 各页的默认设置：落地时区、常用币种 ── */
const DEF={
  kansai:{arrTz:9,  ccy:'JPY'}, japow:{arrTz:9, ccy:'JPY'},
  banff: {arrTz:-6, ccy:'CAD'}, fall: {arrTz:-4,ccy:'CAD'},
  camino:{arrTz:2,  ccy:'EUR'}, andes:{arrTz:-5,ccy:'USD'}
}[TRIP]||{arrTz:0,ccy:'CAD'};
const CCYS=['CAD','JPY','EUR','USD','CNY','PEN','BOB','CLP','ARS','COP'];
const ZERO_DEC=new Set(['JPY','CLP','COP']);
const TZHINT={'-8':'温哥华冬令','-7':'温哥华夏令 / 卡尔加里冬令','-6':'卡尔加里夏令','-5':'多伦多冬令 / 利马 / 波哥大',
 '-4':'多伦多夏令 / 魁北克夏令 / 玻利维亚','-3':'布宜诺斯艾利斯 / 智利夏令','0':'伦敦冬令','1':'伦敦夏令 / 里斯本夏令',
 '2':'马德里夏令','8':'北京 / 香港','9':'东京 / 大阪 / 首尔'};
const tzOpts=sel=>{ let o=''; for(let z=-12;z<=14;z++) o+=`<option value="${z}"${z===sel?' selected':''}>UTC${z>=0?'+':'−'}${Math.abs(z)}${TZHINT[z]?'　'+TZHINT[z]:''}</option>`; return o };
const defDepTz=dateStr=>{ const m=+(String(dateStr||'').slice(5,7)||0); return (m>=11||m<=3)?-8:-7 };

/* ── 时间换算：本地时间 + 时区 → 绝对时间 ── */
function absMs(local,tz){
  const m=String(local||'').match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/); if(!m) return NaN;
  return Date.UTC(+m[1],+m[2]-1,+m[3],+m[4],+m[5])-tz*3600000;
}
const WDN=['周日','周一','周二','周三','周四','周五','周六'];
function fmtLocal(local){
  const m=String(local||'').match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}:\d{2})/); if(!m) return '—';
  const wd=WDN[new Date(Date.UTC(+m[1],+m[2]-1,+m[3])).getUTCDay()];
  return `${+m[2]}月${+m[3]}日 ${wd} ${m[4]}`;
}
function fmtDur(ms){
  if(!(ms>0)) return '—';
  const mins=Math.round(ms/60000), h=Math.floor(mins/60), mm=mins%60;
  return h?`${h} 小时${mm?` ${mm} 分`:''}`:`${mm} 分`;
}
function fmtCount(ms){
  ms=Math.max(0,ms); const s=Math.floor(ms/1000);
  const d=Math.floor(s/86400), h=Math.floor(s%86400/3600), m=Math.floor(s%3600/60), x=s%60;
  return (d?`${d} 天 `:'')+`${pad(h)}:${pad(m)}:${pad(x)}`;
}
const todayISO=()=>{ const d=new Date(); return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}` };

/* ══════════════ 出行 ══════════════ */
let tick=null;
const stopTick=()=>{ if(tick){clearInterval(tick);tick=null} };

function nextEvent(now){
  const ev=[];
  X.flights.forEach(f=>{
    const a=absMs(f.dep,f.depTz), b=absMs(f.arr,f.arrTz), name=(f.no||'航班')+' '+(f.from||'')+'→'+(f.to||'');
    if(!isNaN(a)) ev.push({t:a,end:b,kind:'dep',label:'距起飞',sub:name});
  });
  const r=X.rental;
  if(r){
    const p=absMs(r.pick,r.tz), d=absMs(r.drop,r.tz);
    if(!isNaN(p)) ev.push({t:p,kind:'pick',label:'距取车',sub:(r.company||'租车')+(r.pickAt?' · '+r.pickAt:'')});
    if(!isNaN(d)) ev.push({t:d,kind:'drop',label:'距最晚还车',sub:(r.company||'租车')+(r.dropAt?' · '+r.dropAt:'')});
  }
  // 正在飞
  const flying=ev.find(e=>e.kind==='dep'&&e.t<=now&&e.end>now);
  if(flying) return {label:'飞行中，距抵达',sub:flying.sub,t:flying.end,flying:true};
  const fut=ev.filter(e=>e.t>now).sort((a,b)=>a.t-b.t)[0];
  if(fut) return fut;
  return ev.length?{done:true}:null;
}

function vTrip(s){
  stopTick();
  s.appendChild(mk('p','lede','顶部「此刻关注」会倒数这里填的航班和租车。时间都按当地时间加时区算，跨时区打开也不会错。'));

  /* 航班 */
  s.appendChild(mk('h2','sec','航班'));
  const fl=[...X.flights].sort((a,b)=>absMs(a.dep,a.depTz)-absMs(b.dep,b.depTz));
  if(!fl.length) s.appendChild(mk('div','xempty','还没有航班。把订单上的航班号和时间填进来，会自动算飞行时长和中转时间。'));
  fl.forEach((f,i)=>{
    if(i>0){
      const gap=absMs(f.dep,f.depTz)-absMs(fl[i-1].arr,fl[i-1].arrTz);
      if(gap>0&&gap<36*3600000) s.appendChild(mk('div','xday',`中转 ${fmtDur(gap)}${gap<75*60000?'　<span class="xwarn">偏紧</span>':''}`));
    }
    const dur=absMs(f.arr,f.arrTz)-absMs(f.dep,f.depTz);
    const c=mk('div','xcard');
    c.innerHTML=`<div class="r1"><span class="t">${esc(f.no||'航班')}${f.airline?` · ${esc(f.airline)}`:''}</span><span class="m">${f.ref?'确认码 '+esc(f.ref):''}</span></div>
      <div class="leg"><div><div class="ap">${esc(f.from||'—')}</div><div class="tm2">${fmtLocal(f.dep)}</div></div>
        <div class="mid"><i>${fmtDur(dur)}</i></div>
        <div style="text-align:right"><div class="ap">${esc(f.to||'—')}</div><div class="tm2">${fmtLocal(f.arr)}</div></div></div>
      ${f.note?`<div class="nt">${esc(f.note)}</div>`:''}
      <div class="acts"><span class="xlink" data-a="e">编辑</span><span class="xlink d" data-a="d">删除</span></div>`;
    c.querySelector('[data-a=e]').onclick=()=>flightModal(f);
    c.querySelector('[data-a=d]').onclick=()=>{ if(confirm('删除这段航班？')){ X.flights=X.flights.filter(x=>x.id!==f.id); X.tomb[f.id]=Date.now(); save(); renderBody() } };
    s.appendChild(c);
  });
  const row=mk('div','row'); row.style.marginTop='4px';
  const add=mk('button','btn pri','＋ 添加航班'); add.onclick=()=>flightModal(); row.appendChild(add);
  if(fl.length){ const back=mk('button','btn','＋ 返程（对调上一段）'); back.onclick=()=>{
      const l=fl[fl.length-1]; flightModal({from:l.to,to:l.from,depTz:l.arrTz,arrTz:l.depTz,airline:l.airline}) }; row.appendChild(back) }
  s.appendChild(row);

  /* 租车 */
  s.appendChild(mk('h2','sec','租车'));
  const r=X.rental;
  if(!r){
    s.appendChild(mk('div','xempty','没租车就不用填。租了的话，记下取还车时间，页面会倒数最晚还车。'));
    const b=mk('button','btn','＋ 添加租车信息'); b.onclick=()=>rentalModal(); s.appendChild(b);
  }else{
    const pk=absMs(r.pick,r.tz), dr=absMs(r.drop,r.tz), left=dr-Date.now();
    const c=mk('div','xcard');
    c.innerHTML=`<div class="r1"><span class="t">${esc(r.company||'租车')}</span><span class="m">${r.ref?'订单 '+esc(r.ref):''}</span></div>
      <div class="xrow"><span>取车<small>${esc(r.pickAt||'')}</small></span><span class="a">${fmtLocal(r.pick)}</span></div>
      <div class="xrow"><span>最晚还车<small>${esc(r.dropAt||'')}</small></span><span class="a ${left>0&&left<86400000?'xwarn':''}">${fmtLocal(r.drop)}</span></div>
      <div class="xrow"><span>租期</span><span class="a">${isNaN(pk)||isNaN(dr)?'—':fmtDur(dr-pk)}</span></div>
      ${r.note?`<div class="nt">${esc(r.note).replace(/\n/g,'<br>')}</div>`:''}
      <div class="acts"><span class="xlink" data-a="e">编辑</span><span class="xlink d" data-a="d">删除</span></div>`;
    c.querySelector('[data-a=e]').onclick=()=>rentalModal();
    c.querySelector('[data-a=d]').onclick=()=>{ if(confirm('删除租车信息？')){ X.rental=null; X.tomb.rental=Date.now(); save(); renderBody() } };
    s.appendChild(c);

    s.appendChild(mk('h2','sec','取还车检查'));
    [['取车','核对订单、驾照和国际驾照（或翻译件）'],['取车','绕车一圈拍照或录像，已有的刮痕让工作人员标上'],
     ['取车','拍下油表和里程表，问清还车要不要加满'],['取车','确认导航语言、ETC 卡和车载充电线'],
     ['还车前','按要求加满油，小票留着'],['还车前','清掉垃圾，别落东西'],
     ['还车前','到还车点至少留 1.5 小时，去机场的话更多'],['还车时','再拍一轮车身和油表，拿还车确认单']
    ].forEach(([ph,t],i)=>{
      const k='rc'+i, done=!!X.chk[k];
      const b=mk('button','xchk'+(done?' done':''),`<span class="box"></span><span>${ph==='取车'||ph==='还车前'||ph==='还车时'?`<b style="font-weight:500;color:var(--mist);margin-right:8px">${ph}</b>`:''}${esc(t)}</span>`);
      b.onclick=()=>{ X.chk[k]=!X.chk[k]; save(); renderBody() };
      if(done){ b.querySelector('.box').style.cssText='background:var(--text);border-color:var(--text)' }
      s.appendChild(b);
    });
  }
}

function field(label,inner){ return `<div class="fd"><label class="lb">${label}</label>${inner}</div>` }

function flightModal(f){
  f=f||{};
  const edit=!!f.id;
  const today=todayISO();
  const depTz=f.depTz!=null?f.depTz:defDepTz(f.dep||today);
  const arrTz=f.arrTz!=null?f.arrTz:DEF.arrTz;
  openMod(`<h3>${edit?'编辑航班':'添加航班'}</h3><p class="mp">时间都按机场当地时间填，再选对应的时区。</p>
    <div class="xgrid">${field('航班号',`<input type="text" id="fno" maxlength="12" value="${esc(f.no||'')}" placeholder="AC23">`)}
      ${field('航空公司',`<input type="text" id="fal" maxlength="20" value="${esc(f.airline||'')}">`)}</div>
    <div class="xgrid">${field('出发机场',`<input type="text" id="ffr" maxlength="20" value="${esc(f.from||'')}" placeholder="YVR">`)}
      ${field('到达机场',`<input type="text" id="fto" maxlength="20" value="${esc(f.to||'')}" placeholder="KIX">`)}</div>
    ${field('起飞（当地时间）',`<input type="datetime-local" id="fdp" value="${esc(f.dep||'')}">`)}
    ${field('起飞地时区',`<select id="fdz">${tzOpts(depTz)}</select>`)}
    ${field('到达（当地时间）',`<input type="datetime-local" id="far" value="${esc(f.arr||'')}">`)}
    ${field('到达地时区',`<select id="faz">${tzOpts(arrTz)}</select>`)}
    ${field('确认码',`<input type="text" id="frf" maxlength="20" value="${esc(f.ref||'')}">`)}
    ${field('备注（座位、行李、航站楼）',`<input type="text" id="fnt" maxlength="80" value="${esc(f.note||'')}">`)}
    <div class="row"><button class="btn" data-close>取消</button><button class="btn pri" id="fok">保存</button></div>`,
  b=>{
    let tzTouched=edit||f.depTz!=null;
    b.querySelector('#fdz').onchange=()=>{ tzTouched=true };
    b.querySelector('#fdp').onchange=e=>{ if(!tzTouched) b.querySelector('#fdz').value=defDepTz(e.target.value) };
    b.querySelector('#fok').onclick=()=>{
      const g=id=>b.querySelector(id).value.trim();
      const rec={id:f.id||rid(),u:Date.now(),no:g('#fno'),airline:g('#fal'),from:g('#ffr').toUpperCase(),to:g('#fto').toUpperCase(),
        dep:b.querySelector('#fdp').value,depTz:+b.querySelector('#fdz').value,
        arr:b.querySelector('#far').value,arrTz:+b.querySelector('#faz').value,ref:g('#frf'),note:g('#fnt')};
      if(!rec.dep||!rec.arr) return say('起飞和到达时间都要填');
      if(absMs(rec.arr,rec.arrTz)<=absMs(rec.dep,rec.depTz)) return say('到达时间早于起飞，检查一下时区');
      X.flights=edit?X.flights.map(x=>x.id===rec.id?rec:x):X.flights.concat(rec);
      save(); closeMod(); renderBody(); say('已保存');
    };
  });
}

function rentalModal(){
  const r=X.rental||{};
  openMod(`<h3>租车信息</h3><p class="mp">时间按取还车地点的当地时间填。</p>
    ${field('租车公司',`<input type="text" id="rco" maxlength="30" value="${esc(r.company||'')}">`)}
    ${field('取车地点',`<input type="text" id="rpa" maxlength="60" value="${esc(r.pickAt||'')}">`)}
    ${field('取车时间',`<input type="datetime-local" id="rpk" value="${esc(r.pick||'')}">`)}
    ${field('还车地点',`<input type="text" id="rda" maxlength="60" value="${esc(r.dropAt||'')}">`)}
    ${field('最晚还车时间',`<input type="datetime-local" id="rdp" value="${esc(r.drop||'')}">`)}
    ${field('当地时区',`<select id="rtz">${tzOpts(r.tz!=null?r.tz:DEF.arrTz)}</select>`)}
    ${field('订单号',`<input type="text" id="rrf" maxlength="30" value="${esc(r.ref||'')}">`)}
    ${field('备注（保险、押金、里程限制）',`<textarea id="rnt" maxlength="300">${esc(r.note||'')}</textarea>`)}
    <div class="row"><button class="btn" data-close>取消</button><button class="btn pri" id="rok">保存</button></div>`,
  b=>{
    b.querySelector('#rok').onclick=()=>{
      const g=id=>b.querySelector(id).value.trim();
      const rec={u:Date.now(),company:g('#rco'),pickAt:g('#rpa'),pick:b.querySelector('#rpk').value,dropAt:g('#rda'),
        drop:b.querySelector('#rdp').value,tz:+b.querySelector('#rtz').value,ref:g('#rrf'),note:g('#rnt')};
      if(!rec.pick||!rec.drop) return say('取车和还车时间都要填');
      if(absMs(rec.drop,rec.tz)<=absMs(rec.pick,rec.tz)) return say('还车时间早于取车');
      X.rental=rec; save(); closeMod(); renderBody(); say('已保存');
    };
  });
}

/* ══════════════ 记账 ══════════════ */
const CATS=['餐饮','交通','住宿','门票','购物','其他'];
const fmtMoney=(n,c)=>{ const z=ZERO_DEC.has(c); n=z?Math.round(n):Math.round(n*100)/100;
  return c+' '+n.toLocaleString('zh-CN',{minimumFractionDigits:0,maximumFractionDigits:z?0:2}) };

function people(){
  const L=X.ledger;
  if(!L.people.length){
    const names=[]; if(st.me&&st.me.name) names.push(st.me.name);
    (st.members||[]).forEach(m=>{ if(m.name&&!names.includes(m.name)) names.push(m.name) });
    while(names.length<2) names.push(names.length?'同伴':'我');
    L.people=names.slice(0,6);
  }
  return L.people;
}

function balances(ccy){
  const bal={};
  people().forEach(p=>bal[p]=0);
  X.ledger.items.filter(i=>i.ccy===ccy).forEach(i=>{
    const sp=(i.split&&i.split.length)?i.split:people();
    bal[i.payer]=(bal[i.payer]||0)+i.amt;
    sp.forEach(p=>{ bal[p]=(bal[p]||0)-i.amt/sp.length });
  });
  return bal;
}
function transfers(bal,ccy){
  const z=ZERO_DEC.has(ccy), r=n=>z?Math.round(n):Math.round(n*100)/100;
  const cr=[],db=[];
  Object.entries(bal).forEach(([p,v])=>{ v=r(v); if(v>0) cr.push([p,v]); else if(v<0) db.push([p,-v]) });
  cr.sort((a,b)=>b[1]-a[1]); db.sort((a,b)=>b[1]-a[1]);
  const out=[]; let i=0,j=0;
  while(i<cr.length&&j<db.length){
    const m=Math.min(cr[i][1],db[j][1]);
    if(m>0) out.push({from:db[j][0],to:cr[i][0],amt:r(m)});
    cr[i][1]=r(cr[i][1]-m); db[j][1]=r(db[j][1]-m);
    if(cr[i][1]<=0) i++; if(db[j][1]<=0) j++;
  }
  return out;
}

function vLedger(s){
  stopTick();
  const L=X.ledger, P=people(), items=[...L.items].sort((a,b)=>(b.date||'').localeCompare(a.date||'')||b.at-a.at);
  const bar=mk('div','row');
  const a=mk('button','btn pri','＋ 记一笔'); a.onclick=()=>expenseModal(); bar.appendChild(a);
  const m=mk('button','btn','成员 · '+P.length); m.onclick=peopleModal; bar.appendChild(m);
  s.appendChild(bar);

  if(!items.length){
    const e=mk('div','xempty','还没有开销。谁付的钱、几个人分，记一笔就行，结算时自动算出谁转给谁。'); e.style.marginTop='16px'; s.appendChild(e);
    s.appendChild(mk('p','lede','账目只存在这台设备的浏览器里。换设备或者两人要对账，用下面的「导出」发给对方。'));
  }else{
    const ccys=[...new Set(items.map(i=>i.ccy))];
    s.appendChild(mk('h2','sec','合计'));
    ccys.forEach(c=>{
      const tot=items.filter(i=>i.ccy===c).reduce((x,i)=>x+i.amt,0);
      s.appendChild(mk('div','xrow',`<span>${c}<small>${items.filter(i=>i.ccy===c).length} 笔</small></span><span class="a">${fmtMoney(tot,c)}</span>`));
    });

    s.appendChild(mk('h2','sec','谁转给谁'));
    let any=false;
    ccys.forEach(c=>{
      const bal=balances(c), tr=transfers(bal,c);
      tr.forEach(t=>{ any=true; s.appendChild(mk('div','xrow',`<span><b style="font-weight:500">${esc(t.from)}</b> → <b style="font-weight:500">${esc(t.to)}</b></span><span class="a">${fmtMoney(t.amt,c)}</span>`)) });
    });
    if(!any) s.appendChild(mk('p','lede','目前互不相欠。'));
    const det=mk('div'); det.style.marginTop='10px';
    ccys.forEach(c=>{
      const bal=balances(c);
      const paid={}; items.filter(i=>i.ccy===c).forEach(i=>paid[i.payer]=(paid[i.payer]||0)+i.amt);
      if(ccys.length>1) det.appendChild(mk('div','xday',c));
      Object.keys(bal).forEach(p=>{
        const net=bal[p], share=(paid[p]||0)-net;
        if(!(paid[p]>0)&&!(share>0.005)) return;                 // 这个币种里没参与的人不列
        det.appendChild(mk('div','xrow',`<span>${esc(p)}<small>垫付 ${fmtMoney(paid[p]||0,c).replace(c+' ','')}　应担 ${fmtMoney(share,c).replace(c+' ','')}</small></span><span class="a" style="color:${net<-0.005?'var(--acc)':'var(--text)'}">${Math.abs(net)<0.005?'持平':(net>0?'多付 ':'少付 ')+fmtMoney(Math.abs(net),c).replace(c+' ','')}</span>`));
      });
    });
    s.appendChild(det);

    s.appendChild(mk('h2','sec','按类别'));
    ccys.forEach(c=>{
      const by={}; items.filter(i=>i.ccy===c).forEach(i=>by[i.cat||'其他']=(by[i.cat||'其他']||0)+i.amt);
      const tot=Object.values(by).reduce((x,y)=>x+y,0)||1;
      if(ccys.length>1) s.appendChild(mk('div','xday',c));
      Object.entries(by).sort((x,y)=>y[1]-x[1]).forEach(([k,v])=>{
        s.appendChild(mk('div','xrow',`<span style="flex:1">${esc(k)}<div class="xbar"><i style="width:${Math.round(v/tot*100)}%"></i></div></span><span class="a">${fmtMoney(v,c)}</span>`));
      });
    });

    s.appendChild(mk('h2','sec','明细'));
    let last='';
    items.forEach(i=>{
      if(i.date!==last){ last=i.date; s.appendChild(mk('div','xday',esc(i.date?`${+i.date.slice(5,7)}月${+i.date.slice(8,10)}日`:'未标日期'))) }
      const sp=(i.split&&i.split.length&&i.split.length<P.length)?` · ${i.split.map(esc).join('、')}分`:'';
      const r=mk('button','xrow',`<span style="text-align:left">${esc(i.title||i.cat)}<small>${esc(i.cat||'')} · ${esc(i.payer)}付${sp}</small></span><span class="a">${fmtMoney(i.amt,i.ccy)}</span>`);
      r.style.cssText='width:100%;text-align:left';
      r.onclick=()=>expenseModal(i); s.appendChild(r);
    });
    const ex=mk('button','btn','↓ 导出 CSV'); ex.style.marginTop='18px'; ex.onclick=exportCSV; s.appendChild(ex);
    s.appendChild(mk('p','lede','<span style="font-size:13px;color:var(--mist)">账目只存在这台设备的浏览器里，清除浏览数据会丢。要对账就导出发给同伴。</span>'));
  }
}

function peopleModal(){
  openMod(`<h3>成员</h3><p class="mp">一行一个名字，最多 8 个。改名字不会改已有的账，删掉的人旧账里仍会保留。</p>
    <div class="fd"><textarea id="pp" style="min-height:120px">${esc(people().join('\n'))}</textarea></div>
    <div class="row"><button class="btn" data-close>取消</button><button class="btn pri" id="pok">保存</button></div>`,
  b=>{ b.querySelector('#pok').onclick=()=>{
    const names=[...new Set(b.querySelector('#pp').value.split(/\n|,|，|、/).map(x=>x.trim()).filter(Boolean))].slice(0,8);
    if(names.length<2) return say('至少两个人');
    X.ledger.people=names; X.ledger.pu=Date.now(); save(); closeMod(); renderBody();
  }});
}

function expenseModal(it){
  const P=people(), edit=!!it; it=it||{};
  const ccy=it.ccy||X.ledger.ccy||DEF.ccy;
  const sel=it.split&&it.split.length?it.split:P;
  const payer=it.payer||(st.me&&P.includes(st.me.name)?st.me.name:P[0]);
  openMod(`<h3>${edit?'修改这笔':'记一笔'}</h3>
    ${field('项目',`<input type="text" id="et" maxlength="40" value="${esc(it.title||'')}" placeholder="晚饭、JR 票、民宿">`)}
    <div class="xgrid">${field('金额',`<input type="number" id="ea" inputmode="decimal" step="any" min="0" value="${it.amt||''}">`)}
      ${field('币种',`<select id="ec">${CCYS.map(c=>`<option${c===ccy?' selected':''}>${c}</option>`).join('')}</select>`)}</div>
    <div class="xgrid">${field('日期',`<input type="date" id="ed" value="${esc(it.date||todayISO())}">`)}
      ${field('类别',`<select id="ek">${CATS.map(c=>`<option${c===(it.cat||'餐饮')?' selected':''}>${c}</option>`).join('')}</select>`)}</div>
    ${field('谁付的',`<select id="ep">${P.map(p=>`<option${p===payer?' selected':''}>${esc(p)}</option>`).join('')}</select>`)}
    ${field('谁分摊（平均分）',`<div class="xchips" id="es">${P.map(p=>`<label><input type="checkbox" value="${esc(p)}"${sel.includes(p)?' checked':''}>${esc(p)}</label>`).join('')}</div>`)}
    <div class="row">${edit?'<button class="btn" id="edel">删除</button>':''}<button class="btn" data-close>取消</button><button class="btn pri" id="eok">保存</button></div>`,
  b=>{
    b.querySelector('#eok').onclick=()=>{
      const amt=parseFloat(b.querySelector('#ea').value);
      if(!(amt>0)) return say('金额要大于 0');
      const split=[...b.querySelectorAll('#es input:checked')].map(x=>x.value);
      if(!split.length) return say('至少选一个人分摊');
      const rec={id:it.id||rid(),u:Date.now(),title:b.querySelector('#et').value.trim(),amt,ccy:b.querySelector('#ec').value,
        date:b.querySelector('#ed').value,cat:b.querySelector('#ek').value,payer:b.querySelector('#ep').value,split,at:it.at||Date.now()};
      X.ledger.ccy=rec.ccy;
      X.ledger.items=edit?X.ledger.items.map(x=>x.id===rec.id?rec:x):X.ledger.items.concat(rec);
      save(); closeMod(); renderBody(); say('已记下');
    };
    const d=b.querySelector('#edel');
    if(d) d.onclick=()=>{ if(confirm('删除这一笔？')){ X.ledger.items=X.ledger.items.filter(x=>x.id!==it.id); X.tomb[it.id]=Date.now(); save(); closeMod(); renderBody() } };
  });
}

function exportCSV(){
  const q2=v=>'"'+String(v??'').replace(/"/g,'""')+'"';
  const rows=[['日期','项目','类别','金额','币种','付款人','分摊']];
  [...X.ledger.items].sort((a,b)=>(a.date||'').localeCompare(b.date||'')).forEach(i=>rows.push([i.date,i.title,i.cat,i.amt,i.ccy,i.payer,(i.split||[]).join('、')]));
  const blob=new Blob(['﻿'+rows.map(r=>r.map(q2).join(',')).join('\r\n')],{type:'text/csv;charset=utf-8'});
  const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='记账-'+(TRIP||'trip')+'.csv';
  document.body.appendChild(a); a.click(); setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1500);
  say('已导出 '+X.ledger.items.length+' 笔');
}

/* ══════════════ 接入页面 ══════════════ */
TABS.push({k:'trip',n:'出行'},{k:'ledger',n:'记账'});

const origBody=window.renderBody;
let todayDone=false;
function todayIdx(){
  try{
    const v=V[planKey()]; if(!v||typeof dayInfo!=='function') return -1;
    const t=todayISO();
    for(let i=0;i<v.days.length;i++){ if(dayInfo(v,i).iso===t) return i }
  }catch(e){}
  return -1;
}
function applyToday(){
  if(todayDone) return; todayDone=true;
  const i=todayIdx();
  if(i>=0 && (st.tab==='plan'||!st.tab)){ st.tab='itin'; st.openDay=i; try{renderTabs()}catch(e){} }
}
function markToday(){
  const v=V[planKey()]; if(!v||typeof dayInfo!=='function') return;
  const t=todayISO();
  document.querySelectorAll('#scroll .spine .day').forEach((d,i)=>{
    let iso=null; try{ iso=dayInfo(v,i).iso }catch(e){}
    if(iso===t){ d.classList.add('today');
      const dt=d.querySelector('.ddate'); if(dt&&!dt.querySelector('.xtoday')) dt.insertAdjacentHTML('beforeend','<span class="xtoday">今天</span>'); }
  });
}
window.renderBody=function(){
  stopTick();
  applyToday();
  if(st.tab==='trip'||st.tab==='ledger'){
    const s=q('#scroll'); s.innerHTML='';
    (st.tab==='trip'?vTrip:vLedger)(s);
    return;
  }
  origBody();
  if(st.tab==='itin') markToday();
};
/* ══════════════ 此刻关注：页头下面一条，永远在最上面 ══════════════ */
function ensureBar(){
  if(q('#nowbar')) return q('#nowbar');
  const hd=q('#app > header'); if(!hd) return null;
  const b=mk('button','','<span class="nl"></span><span class="nv"></span>'); b.id='nowbar'; b.type='button';
  b.onclick=()=>{ st.tab='trip'; try{renderTabs()}catch(e){} renderBody(); if(window.innerWidth<=900&&typeof snapTo==='function') snapTo(1) };
  hd.after(b); return b;
}
const dayDiff=(a,b)=>Math.round((new Date(b+'T00:00:00')-new Date(a+'T00:00:00'))/864e5);
function paintBar(){
  const b=ensureBar(); if(!b) return;
  let v=null,iso0=null,isoN=null,idx=-1;
  try{ v=V[planKey()]; iso0=dayInfo(v,0).iso; isoN=dayInfo(v,v.days.length-1).iso; idx=todayIdx(); }catch(e){}
  const now=Date.now(), e=nextEvent(now), today=todayISO();
  const evOK=e&&!e.done;
  let sub='', main='', warn=false;
  const showEv=()=>{ main=fmtCount(e.t-now); sub=e.label+'　'+(e.sub||''); warn=e.kind==='drop'&&e.t-now<864e5 };
  if(evOK&&(e.t-now<3*864e5||e.flying)) showEv();
  else if(iso0&&today<iso0){ const d=dayDiff(today,iso0); main=d+' 天'; sub='距出发'+(evOK?'　下一件事 '+(e.sub||'').split(' ')[0]:''); }
  else if(idx>=0){ main='第 '+(idx+1)+' 天'; sub=(v.days[idx].t||'')+(evOK?'　'+e.label+' '+fmtCount(e.t-now):''); }
  else if(evOK) showEv();
  else if(iso0&&today>isoN){ main='已结束'; sub='这趟旅程'; }
  else { main='—'; sub=''; }
  b.querySelector('.nl').innerHTML='<b>此刻关注</b>'+(sub?'　'+esc(sub):'');
  const nv=b.querySelector('.nv'); nv.textContent=main; nv.className='nv'+(warn?' xwarn':'');
}
setInterval(paintBar,1000);

/* ══════════════ 同步入口（Supabase，见 SUPABASE.md） ══════════════ */
function syncChip(){
  const hr=q('.hright'); if(!hr||q('#syncBtn')) return;
  const b=mk('button','chip','<span class="dot"></span><span class="t"></span>'); b.id='syncBtn'; b.onclick=syncModal;
  hr.insertBefore(b,hr.firstChild); refreshChip();
}
function refreshChip(){
  const b=q('#syncBtn'); if(!b||!window.tripSync) return;
  const on=tripSync.on(); b.querySelector('.t').textContent=on?'已同步':(tripSync.available()?'开启同步':'同步');
  b.querySelector('.dot').className='dot'+(on?'':' off');
}
function syncModal(){
  const T=window.tripSync;
  if(!T||!T.available()){
    openMod(`<h3>多人同步</h3><p class="mp">想让你和同伴看到同一份收藏点、预订、账目、航班，需要一个免费的 Supabase 项目。步骤写在仓库里的 SUPABASE.md，大约 10 分钟。配好之后，这里会出现「创建共享空间」。</p>
      <p class="mp">没配的时候，所有内容只存在这台设备的浏览器里。</p><div class="row"><button class="btn" data-close>知道了</button></div>`);
    return;
  }
  if(!T.on()){
    openMod(`<h3>开启同步</h3><p class="mp">创建一个共享空间，把邀请链接发给同伴。拿到链接的人都能看到和修改，所以别公开发。</p>
      <div class="row"><button class="btn pri" id="sCreate">创建共享空间</button></div>
      <div class="fd" style="margin-top:16px"><label class="lb">或者粘贴同伴发来的邀请链接</label><input type="text" id="sLink" placeholder="https://…#room=…"></div>
      <div class="row"><button class="btn" data-close>取消</button><button class="btn" id="sJoin">加入</button></div>`,
    b=>{
      b.querySelector('#sCreate').onclick=()=>{ T.join(T.create()); closeMod(); say('已创建，正在同步'); setTimeout(()=>location.reload(),600) };
      b.querySelector('#sJoin').onclick=()=>{
        const m=b.querySelector('#sLink').value.match(/room=([A-Za-z0-9_-]{16,64})/)||b.querySelector('#sLink').value.trim().match(/^([A-Za-z0-9_-]{16,64})$/);
        if(!m) return say('没认出这个链接');
        T.join(m[1]); closeMod(); say('已加入'); setTimeout(()=>location.reload(),600);
      };
    });
    return;
  }
  openMod(`<h3>已同步</h3><p class="mp">下面是邀请链接。拿到的人都能看到和修改，别发到公开的地方。六个行程共用同一个共享空间。</p>
    <div class="fd"><input type="text" id="sOut" readonly value="${esc(T.link())}"></div>
    <div class="row"><button class="btn pri" id="sCopy">复制链接</button><button class="btn" id="sLeave">退出同步</button></div>
    <div class="row" style="margin-top:8px"><button class="btn" data-close>关闭</button></div>`,
  b=>{
    b.querySelector('#sCopy').onclick=async()=>{ const i=b.querySelector('#sOut'); i.select(); try{ await navigator.clipboard.writeText(i.value) }catch(e){ document.execCommand('copy') } say('已复制') };
    b.querySelector('#sLeave').onclick=()=>{ if(confirm('退出后，这台设备只看本机的内容。共享空间里的数据不会被删。')){ T.leave(); closeMod(); setTimeout(()=>location.reload(),300) } };
  });
}

/* ══════════════ 启动 ══════════════ */
try{ renderTabs(); }catch(e){}
syncChip(); ensureBar(); paintBar();
loadX().then(()=>{ if(st.tab==='trip'||st.tab==='ledger') renderBody(); paintBar(); });
setTimeout(()=>{ try{ if(!todayDone){ applyToday(); renderBody(); } }catch(e){} },80);

/* 开了同步：回到页面或每 25 秒，拉一次别人的改动（正在填表时不刷新） */
async function refreshRemote(){
  if(!(window.tripSync&&tripSync.on())||document.hidden) return;
  const modalOpen=q('#modal')&&q('#modal').classList.contains('show');
  await loadX();
  if(!modalOpen){
    if(typeof pull==='function'){ try{ await pull(false) }catch(e){} }
    if(st.tab==='trip'||st.tab==='ledger') renderBody();
  }
  paintBar();
}
document.addEventListener('visibilitychange',()=>{ if(!document.hidden) refreshRemote() });
setInterval(refreshRemote,25000);
})();
