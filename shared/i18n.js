/* ══════════════════════════════════════════════════════════════
   shared/i18n.js —— 中 / EN 一键切换
   做法：页面照常用中文渲染，切到英文时把页面里的文字节点按词典换成英文；切回中文时还原。
   · 界面文字（页签、按钮、提示）：下面的 UI 词典，全部页面共用。
   · 地点名：自动用 content.js 里每个地点的英文名（P 里的 en）。
   · 正文（行程说明、要点等）：在行程文件夹里放 en.js，写 window.TRIP_EN={'中文原句':'English'}，
     原句要和页面上的文字完全一致。没写到的句子保持中文。
   选择记在本机 localStorage（tripsLang）。
   ══════════════════════════════════════════════════════════════ */
(function(){
'use strict';
const KEY='tripsLang';
let lang='zh'; try{ lang=localStorage.getItem(KEY)==='en'?'en':'zh' }catch(e){}

const UI={
 '方案':'Plans','准备':'Prep','行程':'Itinerary','地点':'Places','预算':'Budget','出行':'Travel','记账':'Ledger',
 '航班':'Flights','租车':'Car rental','取还车检查':'Pickup / return checklist','取车':'Pick-up','还车前':'Before return','还车时':'At return',
 '查价':'Price check','机票':'Flights','酒店':'Hotels','携程机票':'Ctrip Flights','携程酒店':'Ctrip Hotels','Google 酒店':'Google Hotels',
 '出发':'From','到达':'To','去程':'Depart','返程':'Return','入住':'Check-in','退房':'Check-out','人数':'Travelers','城市（英文）':'City',
 '我查到的机票价格':'Fares I found','我查到的酒店价格':'Hotel prices I found','＋ 记一笔':'+ Log a price','最低':'Lowest',
 '在上面的网站看到价格后，点「记一笔」存下来，最低价会标出来。':'After checking a site above, tap “Log a price” to save it. The lowest is highlighted.',
 '点按钮会在新窗口打开对应网站的搜索页。各站链接格式偶尔会变，打不开就在站内重新搜一次。':'Buttons open each site’s search page in a new tab. Link formats change now and then; if one fails, search again on the site.',
 '记录机票价格':'Log a fare','记录酒店价格':'Log a hotel price','填总价（全部人数）':'Enter the total for all travelers','填入住期间的总价':'Enter the total for the stay',
 '来源网站':'Site','价格':'Price','币种':'Currency','备注（航班、房型、是否可退）':'Note (flight, room type, refundable?)','先填价格':'Enter a price first','已记录':'Saved',
 '顶部倒计时使用这里填写的航班和租车，时间按当地时区计算。':'The countdown at the top uses the flights and car rental entered here, in local time.',
 '暂无航班。填写航班号和时间，自动计算飞行时长和中转时间。':'No flights yet. Add flight numbers and times to get duration and layover.',
 '＋ 添加航班':'+ Add flight','＋ 返程（对调上一段）':'+ Return (swap last leg)','编辑':'Edit','删除':'Delete','取消':'Cancel','保存':'Save',
 '无租车可跳过。填写取还车时间后，显示最晚还车倒计时。':'Skip if no car. Add pick-up and return times to see the return countdown.',
 '＋ 添加租车信息':'+ Add car rental','核对订单、驾照和国际驾照（或翻译件）':'Check booking, license and international permit (or translation)',
 '绕车一圈拍照或录像，已有的刮痕让工作人员标上':'Photograph the car all round; have existing scratches noted',
 '拍下油表和里程表，问清还车要不要加满':'Photo of fuel gauge and odometer; ask if it must be returned full',
 '确认导航语言、ETC 卡和车载充电线':'Check navigation language, toll card and charging cable',
 '按要求加满油，小票留着':'Refuel as required; keep the receipt','清理垃圾，检查随身物品':'Clear rubbish; check belongings',
 '留至少 1.5 小时到达还车点，去机场时增加':'Allow at least 1.5 h to reach the drop-off; more for airports',
 '再拍一轮车身和油表，拿还车确认单':'Photograph the car and fuel gauge again; get the return slip',
 '编辑航班':'Edit flight','添加航班':'Add flight','航班号':'Flight no.','航空公司':'Airline','出发机场':'From airport','到达机场':'To airport',
 '起飞（当地时间）':'Departure (local)','起飞地时区':'Departure time zone','到达（当地时间）':'Arrival (local)','到达地时区':'Arrival time zone',
 '确认码':'Confirmation','备注（座位、行李、航站楼）':'Note (seat, baggage, terminal)','按机场当地时间填写，并选择对应时区。':'Use each airport’s local time and pick its time zone.',
 '起飞和到达时间都要填':'Departure and arrival times are required','到达时间早于起飞，检查一下时区':'Arrival is before departure; check time zones','已保存':'Saved',
 '租车信息':'Car rental details','租车公司':'Company','取车地点':'Pick-up location','取车时间':'Pick-up time','还车地点':'Return location',
 '最晚还车时间':'Latest return time','当地时区':'Local time zone','订单号':'Booking no.','备注（保险、押金、里程限制）':'Note (insurance, deposit, mileage)',
 '按取还车地点的当地时间填写。':'Use local time at the pick-up / return location.','取车和还车时间都要填':'Pick-up and return times are required','还车时间早于取车':'Return is before pick-up',
 '删除这段航班？':'Delete this flight?','删除租车信息？':'Delete car rental details?',
 '餐饮':'Food','交通':'Transport','住宿':'Lodging','门票':'Tickets','购物':'Shopping','其他':'Other',
 '同伴':'Travelers','我':'Me','暂无开销。记录付款人和分摊人，自动计算结算。':'No expenses yet. Log who paid and who shares; settlement is calculated for you.',
 '账目保存在本设备浏览器中。换设备或核对账目，使用「导出」。':'Ledger is stored in this browser. Use Export to move or check it.',
 '合计':'Total','谁转给谁':'Who pays whom','无需转账。':'No transfers needed.','按类别':'By category','明细':'Details','未标日期':'No date',
 '↓ 导出 CSV':'↓ Export CSV','至少两个人':'Need at least two people','修改这笔':'Edit expense','记一笔':'Add expense','项目':'Item','金额':'Amount','日期':'Date',
 '类别':'Category','谁付的':'Paid by','谁分摊（平均分）':'Shared by (split evenly)','金额要大于 0':'Amount must be above 0','至少选一个人分摊':'Pick at least one person',
 '已记下':'Saved','删除这一笔？':'Delete this expense?','付款人':'Payer','分摊':'Share','已结束':'Finished','这趟旅程':'This trip',
 '已同步':'Synced','开启同步':'Turn on sync','同步':'Sync','链接无效':'Invalid link','已加入':'Joined','已复制':'Copied',
 '两人合计':'Total for two','每人':'Per person','最佳时机':'Best timing','代价':'Trade-offs','对比':'Compare','换个方案':'Switch plan','收藏点':'Saved spots',
 '沿途地点':'Places on the way','天气':'Weather','要点':'Key points','对账':'Reconcile','行前待办':'To-do before leaving','关于此页':'About this page',
 '点击任意一天展开，地图定位并显示当天路线。':'Tap a day to expand it; the map shows that day’s route.',
 '点任意一天展开，地图会跟着定位并画出当天的路线。':'Tap a day to expand it; the map shows that day’s route.',
 '点任意一天展开，地图会定位并画出当天路线。极光时段在每天最后一项。':'Tap a day to expand it; the map shows that day’s route. The aurora slot is the last item of each day.',
 '暂无收藏点。点「添加地点」，或在地图上长按。':'No saved spots. Tap “Add place” or long-press the map.',
 '预订记录。勾选已订项目，填写确认号和实付金额，预算页自动对账。':'Bookings. Tick what is booked, add the confirmation and amount paid; the budget reconciles automatically.',
 '预订记录。订好后勾选，填写确认号和实付金额，预算页自动对账。':'Bookings. Tick what is booked, add the confirmation and amount paid; the budget reconciles automatically.',
 '按当前方案筛选。':'Filtered by the current plan.','数字为估算，可拖动调整。':'Figures are estimates; drag to adjust.',
 '数字是按两人估的，不是报价。机票和住宿用「出行」页的查价按钮核对，再把实际价格填进来。':'Figures are estimates for two, not quotes. Check flights and hotels with the price links in Travel, then enter real prices.',
 '记录实地信息：人流时段、价格、闭店、路线修正。显示在描述上方。':'Notes from the ground: crowds, prices, closures, route fixes. Shown above the description.',
 '数据仅保存在本机。坐标为示意精度，开放状态和票价以官方公告为准。':'Data stays on this device. Coordinates are approximate; opening status and prices follow official notices.',
 '收藏点、笔记和预订记录保存在本设备浏览器中。换设备或清除浏览数据会丢失，可用下方导出备份。':'Spots, notes and bookings are saved in this browser. Switching devices or clearing data loses them; use Export to back up.',
 '方案 ':'Plan ','行程概览':'Overview','＋ 添加地点':'+ Add place','↻ 同步':'↻ Sync','匿名':'Anonymous',
 '重置':'Reset','暂无已登记的预订。在「准备」页勾选并填写金额后，这里自动汇总。':'No bookings yet. Tick items in Prep and add amounts; they are summed here.',
 '汇率':'Exchange rate','日期可在右上角「改日期」修改。天数不变，整段平移，星期和天气窗口随之更新。':'Change dates with “Change dates” at top right. The trip length stays; everything shifts, including weekdays and weather windows.',
 '已订':'Booked','未订':'Not booked','↓ 导出到日历 .ics':'↓ Export to calendar (.ics)','导出 JSON':'Export JSON','导入 JSON':'Import JSON',
 '地图':'Map','导航':'Navigate','英文名':'Local name','官网 / 营业时间':'Website / hours','攻略搜索':'Guides','坐标':'Coordinates','＋ 笔记':'+ Note',
 '本日整条路线导航':'Navigate the whole day','改终点住宿':'Change end lodging','吃':'Eat','地图搜':'Map search','小红书':'Xiaohongshu',
 '街道':'Street','地形':'Terrain','＋ 加点':'+ Add point','在地图上点一下':'Tap the map','显示全程':'Show all',
 '设置名字':'Set name','已删除':'Deleted','改日期':'Change dates','底图 · 地形':'Basemap · Terrain','底图 · 街道':'Basemap · Street',
 '读取中…':'Loading…','今晚极光':'Tonight’s aurora','天气':'Weather',
 '预报没拉到':'Forecast unavailable','去年同期实测':'Same dates last year (observed)',
 '日':'Sun','一':'Mon','二':'Tue','三':'Wed','四':'Thu','五':'Fri','六':'Sat',
 '周日':'Sun','周一':'Mon','周二':'Tue','周三':'Wed','周四':'Thu','周五':'Fri','周六':'Sat',
 '下一次出发':'Next departure','正在进行':'Now travelling','天后':'days to go',
 '黄刀镇':'Yellowknife','白马市':'Whitehorse','温哥华':'Vancouver','关西':'Kansai','大阪':'Osaka','京都':'Kyoto'
};
const MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const RULES=[
 [/^(.+?)，(\d+) 个目的地$/,'$1, $2 destinations'],[/^(\d+) 个$/,'$1 trips'],
 [/^(\d+) 天 · (\d+) 晚/,'$1 days · $2 nights'],[/^(\d+) 天 (\d+) 晚/,'$1 days, $2 nights'],[/^(\d+) 晚/,'$1 nights'],
 [/^第 (\d+) 天$/,'Day $1'],[/^(\d+) 天$/,'$1 days'],[/^(\d+) 天 (\d\d:\d\d:\d\d)$/,'$1 d $2'],[/^共 (\d+) 笔$/,'$1 items'],[/^(\d+) 笔$/,'$1 items'],
 [/^确认码 (.+)$/,'Confirmation $1'],[/^订单 (.+)$/,'Booking $1'],[/^成员 · (.+)$/,'Members · $1'],[/^记账-(.+)$/,'ledger-$1'],
 [/^方案 (.+?) · (.+)$/,'Plan $1 · $2'],[/^底图 · (.+)$/,'Basemap · $1'],[/^已切到 (.+)$/,'Switched to $1'],[/^已改为 (.+)$/,'Changed to $1'],
 [/^已加入 (.+)$/,'Joined $1'],[/^距起飞$/,'Until departure'],[/^距出发$/,'Until departure'],[/^距取车$/,'Until pick-up'],[/^距最晚还车$/,'Until return'],
 [/^飞行中，距到$/,'In flight, arrives in'],
 [/周([日一二三四五六])/g,(m,c)=>({日:'Sun',一:'Mon',二:'Tue',三:'Wed',四:'Thu',五:'Fri',六:'Sat'})[c]],
 [/^宿 /,'Stay '],[/^住宿 · /,'Lodging · '],[/^连住第 (\d+) 晚/,'Night $1'],
 [/(\d+)月(\d+)日/g,(m,a,b)=>MON[+a-1]+' '+(+b)],
 [/(\d+) 小时 ?(\d+)? ?分?/g,(m,h,mm)=>h+' h'+(mm?' '+mm+' min':'')],
 [/(\d+) 分(?!钟)/g,'$1 min'],
 [/\s*更新$/,' updated']
];
let D=new Map();
function buildDict(){
  D=new Map(Object.entries(UI));
  try{ const T=window.TRIP_EN; if(T) Object.entries(T).forEach(([k,v])=>D.set(k,v)) }catch(e){}
  try{ if(typeof P!=='undefined') Object.values(P).forEach(p=>{ if(p&&p.zh&&p.en&&!D.has(p.zh)) D.set(p.zh,p.en) }) }catch(e){}
  try{ if(typeof REG!=='undefined'&&window.REG_EN) Object.entries(REG).forEach(([k,r])=>{ if(window.REG_EN[k]) D.set(r.n,window.REG_EN[k]) }) }catch(e){}
}
function tr(str){
  const core=str.trim(); if(!core) return str;
  const lead=str.slice(0,str.indexOf(core)), trail=str.slice(str.indexOf(core)+core.length);
  const hit=D.get(core); if(hit!=null) return lead+hit+trail;
  if(!/[\u3000-\u9fff\uff00-\uffef]/.test(core)) return str;
  let r=core; RULES.forEach(([re,f])=>{ r=r.replace(re,f) });
  // 地点名等较长词条：整句里出现时也换
  if(/[\u4e00-\u9fff]/.test(r)) for(const [k,v] of D){ if(k.length>=3&&r.includes(k)) r=r.split(k).join(v) }
  return r===core?str:lead+r+trail;
}

const store=new WeakMap();
const SKIP=new Set(['SCRIPT','STYLE','TEXTAREA','NOSCRIPT']);
const skipEl=e=>!e||SKIP.has(e.nodeName)||(e.closest&&e.closest('[data-noi18n],.leaflet-tile-pane'));
function doText(n){
  if(skipEl(n.parentElement)) return;
  const rec=store.get(n), cur=n.data;
  if(lang==='zh'){ if(rec){ if(cur===rec.t) n.data=rec.o; store.delete(n) } return }
  if(rec&&cur===rec.t) return;
  const t=tr(cur);
  if(t!==cur){ store.set(n,{o:cur,t}); n.data=t } else if(rec) store.delete(n);
}
const ATTRS=['placeholder','title','aria-label','alt'];
function doAttrs(e){
  if(e.nodeType!==1||skipEl(e)) return;
  ATTRS.forEach(a=>{
    if(!e.hasAttribute(a)) return;
    const k='data-zh-'+a, cur=e.getAttribute(a);
    if(lang==='zh'){ if(e.hasAttribute(k)){ e.setAttribute(a,e.getAttribute(k)); e.removeAttribute(k) } return }
    if(e.hasAttribute(k)&&e.getAttribute('data-en-'+a)===cur) return;
    const t=tr(cur);
    if(t!==cur){ e.setAttribute(k,cur); e.setAttribute('data-en-'+a,t); e.setAttribute(a,t) }
  });
}
function walk(root){
  if(root.nodeType===3){ doText(root); return }
  if(root.nodeType!==1) return;
  doAttrs(root);
  const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT|NodeFilter.SHOW_ELEMENT);
  let n; while((n=w.nextNode())){ n.nodeType===3?doText(n):doAttrs(n) }
}
let mo=null;
function apply(){
  if(mo) mo.disconnect();
  buildDict();
  walk(document.body);
  document.documentElement.lang=lang==='en'?'en':'zh-CN';
  const b=document.getElementById('langBtn'); if(b){ b.textContent=lang==='en'?'中文':'EN' }
  if(mo) start();
}
function start(){
  mo=mo||new MutationObserver(recs=>{
    if(lang!=='en') return;
    mo.disconnect();
    recs.forEach(r=>{
      if(r.type==='childList') r.addedNodes.forEach(walk);
      else if(r.type==='characterData') doText(r.target);
      else if(r.type==='attributes') doAttrs(r.target);
    });
    start();
  });
  mo.observe(document.body,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:ATTRS});
}
function setLang(l){
  lang=l; try{ localStorage.setItem(KEY,l) }catch(e){}
  apply(); if(l==='en') start(); else if(mo){ mo.disconnect() }
}
function mkBtn(){
  if(document.getElementById('langBtn')) return;
  const b=document.createElement('button');
  b.id='langBtn'; b.className='chip'; b.type='button'; b.setAttribute('data-noi18n','');
  b.title='中文 / English'; b.onclick=()=>setLang(lang==='en'?'zh':'en');
  const h=document.querySelector('#app > header');
  if(h) h.appendChild(b);
  else{ b.style.cssText='position:fixed;top:10px;right:10px;z-index:9999;padding:4px 12px;border:1px solid #CBD5D9;border-radius:99px;background:#fff;cursor:pointer;font:13px sans-serif'; document.body.appendChild(b) }
  b.textContent=lang==='en'?'中文':'EN';
}
function init(){
  mkBtn();
  if(lang==='en'){ apply(); start() }
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
window.setTripLang=setLang;
})();
