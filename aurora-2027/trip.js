/* trip.js —— 极光行程配置。准备页追加：实时 Kp 指数 + 当晚云量。数据来自 NOAA SWPC 和 Open-Meteo，免费、不需要 key。 */
window.TRIP = {
  id: 'aurora-2027',
  start: '2027-02-04',
  room: 'aurora-2027',
  currency: { home: 'CAD', alt: 'CNY', rate: 5.1, people: 2, label: '两人合计', per: '每人' },
  wx: { points: [
    { k: 'yzf', n: '黄刀镇', lat: 62.454, lng: -114.372 },
    { k: 'yxy', n: '白马市', lat: 60.7212, lng: -135.0568 }
  ], tz: 'America/Edmonton' },
  areaHint: { yzf: 'Yellowknife NT Canada', yxy: 'Whitehorse YT Canada', yvr: 'Vancouver BC Canada' },
  searchSuffix: 'Canada',
  searchHint: '例：Takhini Hot Springs / Pilots Monument',
  tabs: { spots: '地点' },

  prepExtra(s) {
    s.appendChild(el('h2', 'sec', '今晚极光'));
    const box = el('div', 'tx');
    box.textContent = '读取中…';
    s.appendChild(box);
    const CITIES = [['黄刀镇', 62.454, -114.372], ['白马市', 60.7212, -135.0568]];
    const kpP = fetch('https://services.swpc.noaa.gov/products/noaa-planetary-k-index-forecast.json')
      .then(r => r.json()).catch(() => null);
    const cloudP = Promise.all(CITIES.map(c =>
      fetch('https://api.open-meteo.com/v1/forecast?latitude=' + c[1] + '&longitude=' + c[2] +
        '&hourly=cloud_cover&forecast_days=3&timezone=America%2FEdmonton')
        .then(r => r.json()).catch(() => null)));
    Promise.all([kpP, cloudP]).then(([kp, cl]) => {
      box.textContent = '';
      const rows = [];
      if (Array.isArray(kp)) {
        const list = kp.map(x => Array.isArray(x) ? { t: x[0], k: parseFloat(x[1]) } : { t: x.time_tag, k: parseFloat(x.kp) })
          .filter(x => x.t && !isNaN(x.k));
        const now = Date.now();
        const next = list.filter(x => new Date(String(x.t).replace(' ', 'T') + 'Z').getTime() >= now - 3 * 3600e3).slice(0, 8);
        if (next.length) {
          const mx = Math.max(...next.map(x => x.k));
          rows.push('未来 24 小时 Kp 预报最高 ' + mx.toFixed(1) + '。' + (mx >= 4 ? '活动较强。' : mx >= 2 ? '有机会，主要看云。' : '偏弱。'));
        }
      } else rows.push('Kp 预报暂时读取不到。');
      cl.forEach((d, i) => {
        if (!d || !d.hourly) { rows.push(CITIES[i][0] + '：云量暂时读取不到。'); return; }
        const T = d.hourly.time, C = d.hourly.cloud_cover, out = [];
        const days = [...new Set(T.map(t => t.slice(0, 10)))].slice(0, 3);
        days.forEach(day => {
          const idx = T.map((t, j) => [t, j]).filter(([t]) => t.startsWith(day) && +t.slice(11, 13) >= 22).map(x => x[1]);
          const nxt = T.map((t, j) => [t, j]).filter(([t]) => t.slice(0, 10) > day && t.slice(0, 10) <= days[days.indexOf(day) + 1] && +t.slice(11, 13) <= 2).map(x => x[1]);
          const all = idx.concat(nxt).map(j => C[j]).filter(v => v != null);
          if (all.length) out.push(day.slice(5) + ' 夜 ' + Math.round(all.reduce((a, b) => a + b, 0) / all.length) + '%');
        });
        rows.push(CITIES[i][0] + ' 22 点到次日 2 点平均云量：' + (out.join('，') || '无数据'));
      });
      rows.push('云量越低越好，30% 以下比较理想。Kp 和云量都只是参考，以当晚实际天空为准。');
      rows.forEach(t => { const p = el('p', 'tx', t); box.appendChild(p); });
    });
  }
};
