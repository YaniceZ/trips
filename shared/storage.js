/* shared/storage.js
   给页面提供 window.storage。
   · 没配 Supabase、或没加入共享空间：只存本机 localStorage（刷新不丢，但不跨设备）
   · 配好了 config.js 并加入共享空间：「shared」的数据同时写到 Supabase，别人也能看到
   本机永远留一份，网络断了也能照常用。 */
(function(){
  if(typeof window.storage!=='undefined') return;     // Artifact 之类自带存储的环境，不动

  var CFG=window.TRIPS_CONFIG||{};
  var BASE=location.pathname.replace(/index\.html$/,'');   // 每个行程各用各的键
  var LP='tripsd:'+BASE+'|';
  var RK='tripsync:room';                                  // 共享空间码，六个行程共用

  // 邀请链接 …#room=xxxx：读出来存好，再把地址栏清干净
  try{
    var m=location.hash.match(/room=([A-Za-z0-9_-]{16,64})/);
    if(m){ localStorage.setItem(RK,m[1]); history.replaceState(null,'',location.pathname+location.search); }
  }catch(e){}

  function room(){ try{ return localStorage.getItem(RK)||''; }catch(e){ return ''; } }
  function available(){ return !!(CFG.supabaseUrl&&CFG.supabaseKey); }
  function on(){ return available()&&!!room(); }

  function lget(k){ try{ var v=localStorage.getItem(LP+k); return v==null?null:{key:k,value:v}; }catch(e){ return null; } }
  function lset(k,v){ try{ localStorage.setItem(LP+k,v); }catch(e){} }

  function rpc(fn,body){
    var h={'apikey':CFG.supabaseKey,'Content-Type':'application/json'};
    if(/^eyJ/.test(CFG.supabaseKey)) h['Authorization']='Bearer '+CFG.supabaseKey;   // 新版 publishable key 只要 apikey
    var c=new AbortController(), t=setTimeout(function(){ c.abort(); },6000);
    return fetch(CFG.supabaseUrl.replace(/\/$/,'')+'/rest/v1/rpc/'+fn,{method:'POST',headers:h,body:JSON.stringify(body),signal:c.signal})
      .then(function(r){ clearTimeout(t); if(!r.ok) throw new Error('HTTP '+r.status); return r.text(); })
      .then(function(t){ return t?JSON.parse(t):null; });
  }

  window.storage={
    get:function(k,shared){
      var lv=lget(k);
      if(!(shared&&on())) return Promise.resolve(lv);
      return rpc('kv_get',{p_room:room(),p_key:BASE+k}).then(function(v){
        if(v==null) return lv;                       // 云端还没有，用本机的
        var s=JSON.stringify(v); lset(k,s); return {key:k,value:s};
      }).catch(function(){ return lv; });            // 断网：用本机的
    },
    set:function(k,v,shared){
      lset(k,v);
      if(!(shared&&on())) return Promise.resolve({key:k,value:v});
      return rpc('kv_set',{p_room:room(),p_key:BASE+k,p_val:JSON.parse(v)})
        .then(function(){ return {key:k,value:v}; })
        .catch(function(){ return {key:k,value:v}; });   // 云端没写上也别报错，本机已存
    }
  };

  function rand(n){
    var a=new Uint8Array(n), s='', al='abcdefghijkmnpqrstuvwxyz23456789';   // 去掉易混的 l / o / 0 / 1
    (window.crypto||window.msCrypto).getRandomValues(a);
    for(var i=0;i<n;i++) s+=al[a[i]%al.length];
    return s;
  }
  window.tripSync={
    available:available, on:on, room:room,
    join:function(c){ try{ localStorage.setItem(RK,c); }catch(e){} },
    leave:function(){ try{ localStorage.removeItem(RK); }catch(e){} },
    create:function(){ return rand(24); },
    link:function(){ return location.origin+location.pathname+'#room='+room(); }
  };
})();
