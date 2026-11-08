/* shared/validate.js —— 启动前检查 content.js 和 trip.js 有没有填错。
   有错就在页面上用中文列出来（哪一天、哪个地点），而不是白屏。
   用法：<script>if(validateTrip()) __boot()</script> */
(function(){
  const isNum=x=>typeof x==='number'&&isFinite(x);
  const isDate=s=>/^\d{4}-\d{2}-\d{2}$/.test(s)&&!isNaN(new Date(s+'T00:00:00Z'));
  const isHex=s=>/^#[0-9a-fA-F]{6}$/.test(s);

  function check(){
    const errs=[], warns=[];
    const E=m=>errs.push(m), W=m=>warns.push(m);
    const has=n=>{try{return typeof (0,eval)(n)!=='undefined'}catch(e){return false}};
    const get=n=>{try{return (0,eval)(n)}catch(e){return undefined}};

    for(const n of ['V','P','REG']) if(!has(n)) E(`content.js 里没有 ${n}。请对照模板补上。`);
    if(errs.length) return {errs,warns};
    const V=get('V'),P=get('P'),REG=get('REG');
    const TODOS=has('TODOS')?get('TODOS'):null, BROWS=has('BROWS')?get('BROWS'):null;
    const T=window.TRIP||{};

    /* trip.js 配置 */
    if(!T.id) E('trip.js 里 TRIP.id 没填。它是这个行程的英文短名，用来区分存储，例如 \'kyoto-2028\'。');
    else if(!/^[a-z0-9][a-z0-9-]*$/.test(T.id)) E(`TRIP.id「${T.id}」只能用小写字母、数字和短横线。`);
    if(T.start && !isDate(T.start)) E(`TRIP.start「${T.start}」不是有效日期，格式是 2028-04-01。`);

    /* 区域 */
    const regKeys=Object.keys(REG);
    if(!regKeys.length) E('REG 是空的。至少要有一个区域，例如 REG={kyoto:{n:\'京都\',hex:\'#B3432F\'}}。');
    regKeys.forEach(k=>{
      if(!REG[k].n) E(`区域 REG.${k} 缺少 n（显示名）。`);
      if(!isHex(REG[k].hex||'')) E(`区域 REG.${k} 的 hex「${REG[k].hex}」不是 #RRGGBB 格式的颜色。`);
    });

    /* 地点 */
    const pIds=Object.keys(P);
    pIds.forEach(id=>{
      const p=P[id], at=`地点「${id}」`;
      if(!p.zh) E(`${at}缺少名字（第 2 个参数）。`);
      if(!isNum(p.lat)||!isNum(p.lng)) E(`${at}的经纬度不是数字。`);
      else {
        if(Math.abs(p.lat)>90) E(`${at}的纬度 ${p.lat} 超出范围，经纬度是不是写反了？应该是「纬度, 经度」。`);
        if(Math.abs(p.lng)>180) E(`${at}的经度 ${p.lng} 超出范围。`);
        if(p.lat===0&&p.lng===0) W(`${at}的坐标是 0,0（几内亚湾海面），是不是忘了填？`);
      }
      if(!(p.r in REG)) E(`${at}的区域「${p.r}」没有在 REG 里定义。已定义的有：${regKeys.join('、')}。`);
    });

    /* 方案和每一天 */
    const vKeys=Object.keys(V);
    if(!vKeys.length) E('V 是空的。至少要有一个方案。');
    vKeys.forEach(key=>{
      const v=V[key], vn=`方案 ${key}`;
      if(!Array.isArray(v.days)||!v.days.length){E(`${vn} 没有 days，或者是空的。`);return}
      if(v.start&&!isDate(v.start)) E(`${vn} 的 start「${v.start}」不是有效日期，格式是 2028-04-01。`);
      if(!v.start&&!T.start) W(`${vn} 没有 start，TRIP 里也没有，日期会用默认值。建议给每个方案写 start。`);
      v.days.forEach((d,i)=>{
        const at=`${vn} 第 ${i+1} 天`;
        if(!d.t) E(`${at}缺少标题 t。`);
        if(d.r&&!(d.r in REG)) E(`${at}的区域 r「${d.r}」没有在 REG 里定义。`);
        if(d.stops!==undefined&&!Array.isArray(d.stops)) E(`${at}的 stops 必须是数组。`);
        (d.stops||[]).forEach((s,j)=>{
          if(s.p&&!(s.p in P)) E(`${at}第 ${j+1} 个停靠点引用了地点「${s.p}」，但 P 里没有定义它。是不是拼错了？`);
          if(!s.n) E(`${at}第 ${j+1} 个停靠点缺少名字 n。`);
        });
      });
    });

    /* 待办 / 预算 */
    if(TODOS){
      const seen=new Set();
      TODOS.forEach((t,i)=>{
        if(!t.id) E(`TODOS 第 ${i+1} 项缺少 id。`);
        else if(seen.has(t.id)) E(`TODOS 里 id「${t.id}」重复了。`); else seen.add(t.id);
        if(typeof t.v!=='string') E(`TODOS「${t.n||t.id}」的 v 要写成方案字母串，例如 'ABC'（表示在这几个方案里出现）。`);
        else [...t.v].forEach(c=>{ if(!(c in V)) W(`TODOS「${t.n||t.id}」的 v 里有「${c}」，但没有这个方案。`) });
      });
    } else W('没有 TODOS（行前待办），准备页的清单会是空的。');
    if(BROWS){
      const seen=new Set();
      BROWS.forEach((r,i)=>{
        if(!r.k) E(`BROWS 第 ${i+1} 行缺少 k。`);
        else if(seen.has(r.k)) E(`BROWS 里 k「${r.k}」重复了。`); else seen.add(r.k);
        if(!isNum(r.max)) E(`BROWS「${r.n||r.k}」缺少数字 max（滑块上限）。`);
      });
      vKeys.forEach(key=>{ const b=V[key].budget||{};
        Object.keys(b).forEach(k=>{ if(!BROWS.some(r=>r.k===k)) W(`方案 ${key} 的 budget 里有「${k}」，但 BROWS 里没有这一行。`) }) });
    } else W('没有 BROWS（预算科目），预算页会是空的。');

    return {errs,warns};
  }

  function show(errs,warns){
    const app=document.getElementById('app')||document.body;
    const esc=s=>String(s).replace(/[&<>]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[m]));
    app.innerHTML=`<div style="max-width:640px;margin:0 auto;padding:32px 20px;font:15px/1.8 'Noto Sans SC','PingFang SC','Microsoft YaHei',sans-serif;color:#2A2620">
      <h1 style="font-size:22px;margin:0 0 6px">内容里有 ${errs.length} 处要先改一下</h1>
      <p style="color:#756E60;margin:0 0 18px">页面没法正常显示，是因为下面这些地方填得不对。改完 content.js 或 trip.js，保存后刷新就行。</p>
      <ol style="padding-left:22px;margin:0">${errs.map(e=>`<li style="margin:0 0 8px">${esc(e)}</li>`).join('')}</ol>
      ${warns.length?`<h2 style="font-size:16px;margin:24px 0 6px">另外有 ${warns.length} 条提醒（不影响显示）</h2><ul style="padding-left:20px;color:#756E60;margin:0">${warns.map(w=>`<li>${esc(w)}</li>`).join('')}</ul>`:''}
    </div>`;
  }

  window.validateTrip=function(){
    let r; try{ r=check(); }catch(e){ r={errs:['检查过程出错：'+e.message],warns:[]}; }
    if(r.warns.length) console.warn('[行程检查] 提醒：\n- '+r.warns.join('\n- '));
    if(r.errs.length){
      window.__BAD=true;                     // 引擎、默认实现、扩展模块看到它就不再启动
      console.error('[行程检查] 错误：\n- '+r.errs.join('\n- '));
      const run=()=>show(r.errs,r.warns);
      if(document.getElementById('app')) run(); else document.addEventListener('DOMContentLoaded',run);
      return false;
    }
    return true;
  };
})();
