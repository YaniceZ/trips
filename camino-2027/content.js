/* ══════════════════════════════════════════════════════════════
   content.js — 这个行程的所有文字都在这里。
   改字只动这个文件，index.html 一行都不用碰。

   三条规矩：
   1. 单引号 ' 里不能再出现单引号。中文用「」。
   2. 每一项结尾的逗号别删。
   3. 改完提交，半分钟后刷新。白屏就按 F12 看 Console 红字。
   ══════════════════════════════════════════════════════════════ */

/* ── 界面固定词 ───────────────────────────────────────────── */
const LABELS={
  cost:'Cost', stats:'步行统计', season:'什么时候走', weather:'天气',
  routes:'四条路线', switchPlan:'换一条看看', places:'沿途地点',
  ourPins:'两个人加的', bookings:'预订', prepList:'行前待办',
  reconcile:'实付对账', fx:'汇率', rules:'Compostela 证书规则',
  compare:'四条路的区别', aboutPage:'这个页面'
};

/* ── 成段说明 ─────────────────────────────────────────────── */
const TXT={
  season:
    '推荐 <b>5 月</b>或 <b>9 月上中旬</b>。5 月气温 12–21°C，基础设施全开，田野还是绿的，'
    +'价格比 7 月低 10–20%。9 月条件相近，第一周之后人流下降。'
    +'<br><br>7–8 月不建议：Meseta 段热浪期可超过 40°C，多数人天亮前就出发，庇护所很早满员。'
    +'沿海线路（葡萄牙之路、北方之路）受海风调节，夏季相对温和。'
    +'<br><br>冬季只有部分路段可走，法国之路最后 100 公里、葡萄牙中央线、英国之路全年通行。',

  wxNote:
    '降水单位 mm。7 天预报现在没用，出发前两周开始看。上面那栏是去年同期实测，'
    +'用来判断这个时间窗的降雨和气温。加利西亚全年多雨，做好淋两天的准备。数据 Open-Meteo（CC BY 4.0）。',

  itinHint: '点任意一天，地图跟随。左侧数字是距离 Santiago 还剩多少公里，按朝圣路石碑的写法。',

  pinsEmpty:
    '还没人加过点。把行程码发给同行的人，你们加的庇护所、餐厅、想看的教堂会互相同步。'
    +'地图上长按也能直接落点。',

  bookingIntro:
    '这一栏是记录，不是建议。订好一项就打勾，填确认号和实付金额，两个人都看得到，预算页会自动对账。',

  prepIntro:
    '按方案过滤。朝圣者证书（credencial）和 5 月的住宿是最该早处理的两项。',

  budgetNote:
    '写这版时约 1 CAD ≈ 0.63 EUR。数字是估算，全部可调。'
    +'<br><br>住宿差异最大：公立庇护所每晚 8–15 欧、私立 15–25 欧、乡村旅馆 50–90 欧。'
    +'按庇护所算的话每天 40–55 欧可以覆盖住宿加三餐，选旅馆则接近翻倍。'
    +'行李托运每件每段 5–7 欧，肩膀不好的话这笔钱值得花。',

  noteHint: '写点只有走过才知道的：哪家庇护所要早到、哪段没有补水点、哪里我写错了。这条会显示在我的描述上面。',

  aboutPage:
    '行程码决定你看到哪份数据。你和同行的人用同一个码，加的点会互相同步；换一个没人用过的码，就是一份空白行程。',
  aboutFoot:
    '共享数据对所有知道行程码的人可见。坐标为示意精度，公里数为路书常见值，实际以路上石碑为准。'
};

/* ── Compostela 规则 ─────────────────────────────────────── */
const RULES=[
 ['步行至少 100 公里','骑行则是 200 公里。必须是连续的最后一段，中间断了要重新计算。'],
 ['带朝圣者证书 credencial','出发前在教堂、朝圣者协会或线上申请，路上每天盖两个章（庇护所、教堂、酒吧都能盖）。'],
 ['最后 100 公里每天盖两章','这是加利西亚段的额外要求，前面的路段每天一个章即可。'],
 ['到 Santiago 朝圣者办公室换证','带 credencial 排队登记，免费。旺季排队可能超过一小时。']
];

/* ── 四条路的区别 ─────────────────────────────────────────── */
const COMPARE=[
 ['法国之路 Francés','780 公里，30–35 天。基础设施最完善，同行者最多，社交氛围最强。最后 100 公里从 Sarria 起是最多人的选择。缺点是 Meseta 段夏季酷热，Sarria 之后人非常密集。'],
 ['葡萄牙之路 Portugués','从 Porto 起 240–280 公里，10–14 天。地形最平缓，气候温和，海岸线变体沿大西洋走。适合第一次走且不想爬山的人。'],
 ['原始之路 Primitivo','321 公里，14–16 天。最古老也最难，翻越坎塔布连山脉，服务点少，人最少。适合有徒步经验、想要安静的人。'],
 ['北方之路 Norte','825 公里，35–40 天。沿比斯开湾走，海景最好，起伏不断，难度仅次于原始之路。时间不够就不要考虑。']
];

/* ══════ 区域与地点 ══════ */
const REG={cam:{n:'朝圣路',hex:'#D9A21B'},gal:{n:'加利西亚',hex:'#2F7D5B'},
           nor:{n:'西班牙北部',hex:'#1F6FA8'},cit:{n:'城市',hex:'#8C4A6B'},por:{n:'葡萄牙',hex:'#C0532F'}};
const P={};
const def=(id,zh,es,lat,lng,r,note,km)=>P[id]={id,zh,es,lat,lng,r,note,km};

/* — 法国之路 最后 100 公里 — */
def('sarria','Sarria 萨里亚','Sarria',42.7772,-7.4139,'cam','最后 100 公里的起点，也是全程人最密集的一段的开始。镇上有大量庇护所和装备店，缺什么在这里补。',111.5);
def('portomarin','Portomarín 波托马林','Portomarín',42.8072,-7.6156,'cam','水库淹村后整体搬迁上山的镇子，教堂是拆散编号后重砌的。进镇要爬一段很长的台阶。',89);
def('palas','Palas de Rei 帕拉斯','Palas de Rei',42.8731,-7.8686,'cam','规模不大的中转镇，前后两段都比较长，多数人在这里过夜。',64);
def('melide','Melide 梅利德','Melide',42.9142,-8.0142,'cam','原始之路在这里汇入法国之路，人流明显增加。加利西亚章鱼 pulpo á feira 的代表小镇，Ezequiel 那家最有名。',50);
def('arzua','Arzúa 阿尔苏阿','Arzúa',42.9278,-8.1614,'cam','奶酪产区，本地 queixo de Arzúa 是 DOP 认证。之后进入桉树林路段。',39);
def('pedrouzo','O Pedrouzo 佩德鲁索','O Pedrouzo',42.9075,-8.3625,'cam','进 Santiago 前最后一晚，离机场很近，飞机低空掠过。多数人第二天清早出发赶中午的朝圣者弥撒。',19);
def('gozo','Monte do Gozo 欢喜山','Monte do Gozo',42.8836,-8.5033,'cam','第一次能看到大教堂尖顶的山头，名字由此而来。现在山上有大型庇护所群，视野被树挡掉不少。',4.7);
def('santiago','Santiago 大教堂','Catedral de Santiago',42.8806,-8.5449,'gal','终点。朝圣者弥撒每天中午 12 点和晚上 7 点半，香炉 botafumeiro 不是每场都摆，看当天安排。',0);
def('pilgrimoffice','朝圣者办公室','Oficina del Peregrino',42.8817,-8.5442,'gal','换 Compostela 证书的地方，离大教堂几分钟。带好 credencial，旺季排队可能超过一小时。');
def('finisterre','Finisterre 世界尽头','Cabo Fisterra',42.8828,-9.2717,'gal','古人认为的大陆尽头，从 Santiago 再走 3 天或坐 1.5 小时巴士。海角看日落，传统上在这里烧掉一件旧衣服。');
def('muxia','Muxía 穆希亚','Muxía',43.1050,-9.2183,'gal','比 Finisterre 安静的海角，教堂建在礁石上，风浪很大。');

/* — 法国之路 全程节点（方案丁） — */
def('sjpdp','Saint-Jean-Pied-de-Port','SJPdP',43.1636,-1.2372,'cam','法国之路传统起点，法国境内。第二天翻比利牛斯山是全程最难的一天，天气不好走 Valcarlos 低线。',780);
def('roncesvalles','Roncesvalles 龙塞斯瓦列斯','Roncesvalles',43.0092,-1.3197,'cam','翻过比利牛斯山后的第一站，修道院庇护所有 180 张床。',765);
def('pamplona','Pamplona 潘普洛纳','Pamplona',42.8125,-1.6458,'cam','奔牛节的城市，老城和 pintxos 值得多留半天。',705);
def('logrono','Logroño 洛格罗尼奥','Logroño',42.4650,-2.4456,'cam','里奥哈葡萄酒产区首府，Calle Laurel 一条街全是小酒馆。',610);
def('burgos','Burgos 布尔戈斯','Burgos',42.3408,-3.6997,'cam','哥特式大教堂是世界遗产，熙德的墓在里面。之后进入 Meseta 高原段。',490);
def('meseta','Meseta 高原段','La Meseta',42.2500,-4.5000,'cam','约 200 公里的平坦麦田，遮荫极少。夏季白天可超 40°C，天亮前出发是常态。也是很多人觉得最难熬、又最有收获的一段。',430);
def('leon','León 莱昂','León',42.5987,-5.5671,'cam','大教堂的彩窗是全西班牙最好的之一，高迪的 Casa Botines 也在这儿。',310);
def('astorga','Astorga 阿斯托加','Astorga',42.4589,-6.0525,'cam','高迪设计的主教宫，还有 cocido maragato 那道反着上菜的炖菜。',260);
def('cruzferro','Cruz de Ferro 铁十字','Cruz de Ferro',42.4894,-6.3617,'cam','海拔 1505 米，全程最高点。传统是从家里带一块石头放在杆下。',230);
def('ponferrada','Ponferrada 蓬费拉达','Ponferrada',42.5461,-6.5911,'cam','圣殿骑士城堡就在路边。',210);
def('cebreiro','O Cebreiro 塞布雷罗','O Cebreiro',42.7078,-7.0433,'cam','进入加利西亚的第一个村，海拔 1300 米，圆形石屋 pallozas。上坡很陡，雾很大。',155);

/* — 葡萄牙之路（方案乙） — */
def('porto','Porto 波尔图','Porto',41.1435,-8.6110,'por','起点。大教堂领第一个章，然后沿杜罗河出城。多留一天喝波特酒。',240);
def('viladoconde','Vila do Conde','Vila do Conde',41.3517,-8.7425,'por','海岸线变体的第一晚，长长的木栈道贴着大西洋。',215);
def('barcelos','Barcelos 巴塞卢什','Barcelos',41.5314,-8.6186,'por','葡萄牙公鸡传说的发源地，周四有全国最大的集市之一。',185);
def('pontedelima','Ponte de Lima','Ponte de Lima',41.7681,-8.5836,'por','葡萄牙最古老的城镇之一，罗马桥横跨利马河。',150);
def('tui','Tui 图伊','Tui',42.0472,-8.6439,'por','跨过米尼奥河进入西班牙。从这里到 Santiago 刚好 115 公里，是葡萄牙之路拿证书的最短起点。',115);
def('redondela','Redondela','Redondela',42.2833,-8.6094,'por','海岸线和中央线在这里合并。',85);
def('pontevedra','Pontevedra 蓬特维德拉','Pontevedra',42.4310,-8.6444,'gal','老城完全步行化，是西班牙城市改造的样板。',63);
def('caldas','Caldas de Reis','Caldas de Reis',42.6047,-8.6425,'gal','温泉小镇，路边有免费的热泉洗脚池。',43);
def('padron','Padrón 帕德龙','Padrón',42.7383,-8.6606,'gal','padrón 青椒的产地，十个里有一个是辣的。传说圣雅各的石船停靠于此。',25);

/* — 原始之路（方案丙） — */
def('oviedo','Oviedo 奥维耶多','Oviedo',43.3619,-5.8494,'nor','原始之路起点，最古老的朝圣路，9 世纪阿方索二世走的就是这条。老城的苹果酒馆值得留一晚。',321);
def('grado','Grado','Grado',43.3900,-6.0700,'nor','第一天终点，开始进入阿斯图里亚斯山区。',296);
def('tineo','Tineo','Tineo',43.3350,-6.4147,'nor','山脊上的镇子，视野很好。',245);
def('polaallande','Pola de Allande','Pola de Allande',43.2733,-6.6100,'nor','第二天要翻 Puerto del Palo，全程爬升最大的一段之一。',215);
def('grandas','Grandas de Salime','Grandas de Salime',43.2211,-6.8747,'nor','水库边下坡再上坡，民族博物馆很值得看。',185);
def('fonsagrada','A Fonsagrada','A Fonsagrada',43.1233,-7.0678,'nor','进入加利西亚，海拔 950 米，全年多雾。',155);
def('lugo','Lugo 卢戈','Lugo',43.0097,-7.5567,'gal','完整的罗马城墙绕城一圈，可以在墙顶走完 2 公里。离 Santiago 正好 100 公里出头，也是原始之路上拿证书的常见起点。',101);

/* — 西班牙城市 — */
def('madrid','Madrid 马德里','Madrid',40.4168,-3.7038,'cit','进出西班牙最方便的枢纽。普拉多、索菲亚王后、提森三馆步行可达，Retiro 公园就在旁边。');
def('sansebastian','San Sebastián 圣塞瓦斯蒂安','Donostia',43.3183,-1.9812,'nor','老城 pintxos 一条街，贝壳湾在城中间。米其林星级密度全球前列。');
def('bilbao','Bilbao 古根海姆','Guggenheim Bilbao',43.2687,-2.9340,'nor','盖里的钛金属外壳，周边旧城改造得很好。离圣塞瓦斯蒂安一小时。');
def('toledo','Toledo 托莱多','Toledo',39.8628,-4.0273,'cit','马德里坐 AVE 半小时。基督教、伊斯兰、犹太三种建筑挤在一座山城里。当天来回够，住一晚更好。');
def('segovia','Segovia 塞戈维亚','Segovia',40.9481,-4.1184,'cit','罗马水道桥保存完整，没有用灰浆。烤乳猪是本地招牌。');
def('granada','Granada 阿尔罕布拉宫','Alhambra',37.1761,-3.5881,'cit','必须提前很久在官网买票，现场基本买不到。纳斯里王宫是分时段入场，迟到不让进。');
def('sevilla','Sevilla 塞维利亚','Sevilla',37.3886,-5.9823,'cit','大教堂、王宫、都市阳伞。5 月有春会 Feria de Abril 前后的余热，也是最好的季节。');
def('cordoba','Córdoba 大清真寺','Mezquita',37.8790,-4.7794,'cit','清真寺里盖了座教堂，两套建筑语言叠在一起。5 月庭院节 Patios 期间老城开放私人庭院。');
def('barcelona','Barcelona 巴塞罗那','Barcelona',41.3851,2.1734,'cit','圣家堂和公园大道的高迪建筑都要提前订票。');

/* — 机场 — */
def('mad','马德里机场','MAD Barajas',40.4936,-3.5668,'cit','温哥华出发多数需要在多伦多或欧洲枢纽转一次。');
def('scq','Santiago 机场','SCQ',42.8963,-8.4152,'gal','离市区 12 公里，飞马德里、巴塞罗那、伦敦都有直飞。');
def('opo','Porto 机场','OPO',41.2481,-8.6814,'por','地铁直达市区，非常方便。');
def('ovd','阿斯图里亚斯机场','OVD',43.5636,-6.0347,'nor','离 Oviedo 40 分钟。');

/* ══════ 时机表 ══════ */
const GCOL=['#E4E1D8','#BFD4C0','#7FB08A','#2F7D5B'];
const HCOL=['#E4E1D8','#EBD09A','#DFA33F','#C4482C'];
const TIMING={
  cols:[{k:'3月',pk:0},{k:'4月',pk:0},{k:'5月',pk:1},{k:'6月',pk:0},{k:'7–8月',pk:0},{k:'9月',pk:1},{k:'10月',pk:0}],
  rows:[
    {n:'气温',v:[1,2,3,3,1,3,2],c:GCOL},
    {n:'少雨',v:[1,1,2,3,3,3,1],c:GCOL},
    {n:'人流',v:[0,1,3,2,3,3,1],c:HCOL},
    {n:'价格',v:[0,1,2,2,3,2,1],c:HCOL}
  ]
};

/* ══════ 四个方案 ══════ */
const V={
A:{k:'A',gr:'I',name:'最后 100 公里 + 西班牙北部',met:'16 DAYS · 5 WALK',hex:'#D9A21B',tag:'推荐',
  dates:'2027.05.08 → 05.23', walkDays:5, walkKm:115,
  pitch:'Sarria 走到 Santiago，六天，115 公里，够拿 Compostela 证书。'
    +'剩下的时间给圣塞瓦斯蒂安、毕尔巴鄂和马德里。\n\n'
    +'这是第一次走朝圣路最常见的选择：路标密集、庇护所多、同行者多，'
    +'不需要提前几个月练体能，也不用请一个月的假。',
  cons:'Sarria 之后是全程人最密集的一段，5 月尤其明显，庇护所需要提前订或每天早到。'
    +'\n\n只走最后 100 公里会错过 Meseta 和比利牛斯，很多人认为那才是法国之路的核心。',
  budget:{air:3000,walkStay:900,cityStay:1600,food:1500,transfer:250,train:500,tickets:300,misc:400},
  days:[
   {d:'05.08',w:'六',t:'温哥华 → 马德里',r:'cit',stay:'机上',km:null,note:'多数航班在多伦多或欧洲枢纽转一次，全程 14–17 小时。',stops:[{t:'—',p:null,n:'YVR 出发',s:''}]},
   {d:'05.09',w:'日',t:'抵马德里',r:'cit',stay:'马德里',km:null,note:'时差 9 小时。今天不安排硬行程。',stops:[
     {t:'下午',p:'mad',n:'入境',s:'机场地铁直达市区'},{t:'晚',p:'madrid',n:'走一圈 Retiro 公园',s:'撑到当地时间 22 点再睡'}]},
   {d:'05.10',w:'一',t:'马德里 · 普拉多',r:'cit',stay:'马德里',km:null,note:'博物馆日。也可以换成托莱多当天来回。',stops:[
     {t:'10:00',p:'madrid',n:'普拉多美术馆',s:'提前网上买票避开排队'},{t:'—',p:'toledo',n:'托莱多（可选）',s:'AVE 半小时'}]},
   {d:'05.11',w:'二',t:'马德里 → Sarria',r:'cam',stay:'Sarria',km:111.5,note:'火车到 Sarria 需换乘，也可飞 SCQ 再坐巴士。到了先领 credencial、买 credencial 章。',stops:[
     {t:'—',p:'sarria',n:'Sarria 入住',s:'镇上装备店齐全，缺什么在这里补'}]},
   {d:'05.12',w:'三',t:'Sarria → Portomarín',r:'cam',stay:'Portomarín',km:89,walk:22.5,note:'第一天 22.5 公里，前半段爬升，橡树林和石墙小路。进镇前那段长台阶在一天结束时相当难受。',stops:[
     {t:'07:00',p:'sarria',n:'出发',s:'从这里开始每天盖两个章'},
     {t:'14:00',p:'portomarin',n:'Portomarín',s:'水库淹村后整体搬上山的镇子'}]},
   {d:'05.13',w:'四',t:'Portomarín → Palas de Rei',r:'cam',stay:'Palas de Rei',km:64,walk:25,note:'25 公里，全程缓上，中段有一长段沿公路。今天最长。',stops:[
     {t:'07:00',p:'portomarin',n:'出发',s:'出镇过桥直接上坡'},{t:'15:00',p:'palas',n:'Palas de Rei',s:''}]},
   {d:'05.14',w:'五',t:'Palas de Rei → Arzúa',r:'cam',stay:'Arzúa',km:39,walk:29,note:'29 公里，全程最长的一天。想拆成两段就在 Melide 停，多一晚。',stops:[
     {t:'07:00',p:'palas',n:'出发',s:''},
     {t:'12:00',p:'melide',n:'Melide 吃章鱼',s:'原始之路在这里汇入，人明显变多'},
     {t:'16:30',p:'arzua',n:'Arzúa',s:'本地奶酪是 DOP 认证'}]},
   {d:'05.15',w:'六',t:'Arzúa → O Pedrouzo',r:'cam',stay:'O Pedrouzo',km:19,walk:19,note:'19 公里，桉树林居多，相对轻松。今天早点睡，明天要赶中午的弥撒。',stops:[
     {t:'07:30',p:'arzua',n:'出发',s:''},{t:'14:00',p:'pedrouzo',n:'O Pedrouzo',s:'离机场很近，飞机低空掠过'}]},
   {d:'05.16',w:'日',t:'走进 Santiago',r:'gal',stay:'Santiago',km:0,walk:19,note:'最后 19 公里。多数人 5 点半就出发，为了赶 12 点的朝圣者弥撒。',stops:[
     {t:'05:30',p:'pedrouzo',n:'摸黑出发',s:'带头灯，前两小时天没亮'},
     {t:'10:00',p:'gozo',n:'Monte do Gozo',s:'第一次看到大教堂尖顶'},
     {t:'11:30',p:'santiago',n:'Praza do Obradoiro',s:'12 点朝圣者弥撒'},
     {t:'15:00',p:'pilgrimoffice',n:'换 Compostela 证书',s:'带 credencial，旺季排队超过一小时'}]},
   {d:'05.17',w:'一',t:'Finisterre 世界尽头',r:'gal',stay:'Santiago',km:null,note:'巴士来回约 1.5 小时单程。体力好可以再走三天到这里。',stops:[
     {t:'09:00',p:'finisterre',n:'Cabo Fisterra',s:'海角看日落，传统是烧掉一件旧衣服'},
     {t:'—',p:'muxia',n:'Muxía（可选）',s:'比 Finisterre 安静'}]},
   {d:'05.18',w:'二',t:'Santiago → 毕尔巴鄂',r:'nor',stay:'毕尔巴鄂',km:null,note:'飞行约 1 小时 20 分，陆路很远，建议飞。',stops:[
     {t:'—',p:'scq',n:'SCQ 出发',s:''},{t:'下午',p:'bilbao',n:'古根海姆',s:'盖里的钛金属外壳'}]},
   {d:'05.19',w:'三',t:'圣塞瓦斯蒂安',r:'nor',stay:'圣塞瓦斯蒂安',km:null,note:'离毕尔巴鄂一小时。晚上老城 pintxos 一家一家吃过去。',stops:[
     {t:'—',p:'sansebastian',n:'贝壳湾 + 老城',s:'pintxos 站着吃，一家一两样就换下家'}]},
   {d:'05.20',w:'四',t:'圣塞瓦斯蒂安 慢一天',r:'nor',stay:'圣塞瓦斯蒂安',km:null,note:'不安排硬行程。乌尔古尔山看全湾，或去附近的 Getaria。',stops:[
     {t:'—',p:'sansebastian',n:'随意',s:''}]},
   {d:'05.21',w:'五',t:'回马德里',r:'cit',stay:'马德里',km:null,note:'火车约 5 小时，飞机 1 小时。',stops:[
     {t:'—',p:'madrid',n:'马德里',s:'最后采买'}]},
   {d:'05.22',w:'六',t:'马德里 或 塞戈维亚',r:'cit',stay:'马德里',km:null,note:'缓冲日。',stops:[
     {t:'—',p:'segovia',n:'塞戈维亚（可选）',s:'罗马水道桥，AVE 半小时'}]},
   {d:'05.23',w:'日',t:'马德里 → 温哥华',r:'cit',stay:'—',km:null,note:'',stops:[{t:'—',p:'mad',n:'MAD',s:'退税柜台排队久，提前三小时'}]}
  ]},

B:{k:'B',gr:'II',name:'葡萄牙之路 · Porto 出发',met:'18 DAYS · 11 WALK',hex:'#C0532F',tag:'最平缓',
  dates:'2027.05.06 → 05.23', walkDays:11, walkKm:263,
  pitch:'从 Porto 走完整的 240 公里，12 天。地形是几条主线里最平缓的，'
    +'气候也比内陆温和。海岸线变体贴着大西洋走，木栈道很长一段。\n\n'
    +'适合第一次走、又想要完整路线体验、且不想爬山的人。',
  cons:'名义上跨两个国家，实际大部分风景是乡村公路和小镇，'
    +'戏剧性不如原始之路或北方之路。\n\nTui 之后并入主流人群，最后 100 公里同样拥挤。',
  budget:{air:3100,walkStay:1500,cityStay:900,food:1700,transfer:400,train:350,tickets:250,misc:400},
  days:[
   {d:'05.06',w:'四',t:'温哥华 → Porto',r:'por',stay:'机上',km:null,note:'',stops:[{t:'—',p:null,n:'YVR 出发',s:''}]},
   {d:'05.07',w:'五',t:'抵 Porto',r:'por',stay:'Porto',km:240,note:'时差第一天不走路。',stops:[{t:'—',p:'opo',n:'OPO 入境',s:'地铁直达市区'},{t:'—',p:'porto',n:'大教堂领第一个章',s:''}]},
   {d:'05.08',w:'六',t:'Porto 一天',r:'por',stay:'Porto',km:240,note:'喝波特酒，走杜罗河两岸。明天开始连走 12 天。',stops:[{t:'—',p:'porto',n:'Ribeira + 酒窖',s:''}]},
   {d:'05.09',w:'日',t:'Porto → Vila do Conde',r:'por',stay:'Vila do Conde',km:215,walk:26,note:'海岸线变体第一天，长木栈道贴着大西洋。',stops:[{t:'07:00',p:'porto',n:'出发',s:''},{t:'15:00',p:'viladoconde',n:'Vila do Conde',s:''}]},
   {d:'05.10',w:'一',t:'沿海北上',r:'por',stay:'Esposende',km:190,walk:25,note:'',stops:[{t:'—',p:'viladoconde',n:'出发',s:''}]},
   {d:'05.11',w:'二',t:'转内陆 → Barcelos',r:'por',stay:'Barcelos',km:185,walk:24,note:'',stops:[{t:'—',p:'barcelos',n:'Barcelos',s:'周四有大集市'}]},
   {d:'05.12',w:'三',t:'Barcelos → Ponte de Lima',r:'por',stay:'Ponte de Lima',km:150,walk:33,note:'今天最长，33 公里。可以拆成两段。',stops:[{t:'—',p:'pontedelima',n:'罗马桥',s:''}]},
   {d:'05.13',w:'四',t:'翻 Labruja 山口',r:'por',stay:'Rubiães',km:132,walk:19,note:'葡萄牙段唯一一段像样的爬升。',stops:[{t:'—',p:null,n:'Alto da Portela Grande',s:'海拔 405 米'}]},
   {d:'05.14',w:'五',t:'过境进西班牙 → Tui',r:'por',stay:'Tui',km:115,walk:20,note:'跨米尼奥河，从这里到 Santiago 正好 115 公里。',stops:[{t:'—',p:'tui',n:'Tui',s:'从这里开始每天盖两章'}]},
   {d:'05.15',w:'六',t:'Tui → Redondela',r:'gal',stay:'Redondela',km:85,walk:31,note:'31 公里，今天很长。',stops:[{t:'—',p:'redondela',n:'Redondela',s:'海岸线在这里并入'}]},
   {d:'05.16',w:'日',t:'→ Pontevedra',r:'gal',stay:'Pontevedra',km:63,walk:20,note:'',stops:[{t:'—',p:'pontevedra',n:'Pontevedra',s:'老城完全步行化'}]},
   {d:'05.17',w:'一',t:'→ Caldas de Reis',r:'gal',stay:'Caldas de Reis',km:43,walk:21,note:'',stops:[{t:'—',p:'caldas',n:'Caldas de Reis',s:'路边有免费热泉洗脚池'}]},
   {d:'05.18',w:'二',t:'→ Padrón',r:'gal',stay:'Padrón',km:25,walk:19,note:'',stops:[{t:'—',p:'padron',n:'Padrón',s:'青椒产地，十个里一个辣'}]},
   {d:'05.19',w:'三',t:'走进 Santiago',r:'gal',stay:'Santiago',km:0,walk:25,note:'最后 25 公里。早出发赶中午弥撒。',stops:[
     {t:'06:00',p:'padron',n:'出发',s:''},{t:'11:30',p:'santiago',n:'大教堂',s:''},{t:'15:00',p:'pilgrimoffice',n:'换证书',s:''}]},
   {d:'05.20',w:'四',t:'Finisterre',r:'gal',stay:'Santiago',km:null,note:'',stops:[{t:'—',p:'finisterre',n:'Cabo Fisterra',s:''}]},
   {d:'05.21',w:'五',t:'Santiago 休整',r:'gal',stay:'Santiago',km:null,note:'',stops:[{t:'—',p:'santiago',n:'老城',s:''}]},
   {d:'05.22',w:'六',t:'飞马德里',r:'cit',stay:'马德里',km:null,note:'',stops:[{t:'—',p:'madrid',n:'马德里',s:''}]},
   {d:'05.23',w:'日',t:'马德里 → 温哥华',r:'cit',stay:'—',km:null,note:'',stops:[{t:'—',p:'mad',n:'MAD',s:''}]}
  ]},

C:{k:'C',gr:'III',name:'原始之路 · Oviedo 出发',met:'20 DAYS · 13 WALK',hex:'#1F6FA8',tag:'最难最静',
  dates:'2027.05.04 → 05.23', walkDays:13, walkKm:315,
  pitch:'321 公里，14 天，最古老的一条，9 世纪阿方索二世走的原路。'
    +'翻越坎塔布连山脉，服务点少，同行者也少。\n\n'
    +'到 Melide 汇入法国之路之前，很多天只会遇到十几个人。',
  cons:'难度明显高于其他三条：连续爬升、山区路段服务稀疏、天气变化快，'
    +'需要提前几个月练体能。\n\n阿斯图里亚斯和加利西亚山区全年多雨多雾，'
    +'5 月淋雨的概率不低。',
  budget:{air:3000,walkStay:1600,cityStay:700,food:1700,transfer:300,train:400,tickets:200,misc:450},
  days:[
   {d:'05.04',w:'二',t:'温哥华 → 马德里',r:'cit',stay:'机上',km:null,note:'',stops:[{t:'—',p:null,n:'YVR 出发',s:''}]},
   {d:'05.05',w:'三',t:'抵马德里 → Oviedo',r:'nor',stay:'Oviedo',km:321,note:'火车约 4 小时，或飞 OVD。',stops:[{t:'—',p:'oviedo',n:'Oviedo',s:'老城苹果酒馆值得留一晚'}]},
   {d:'05.06',w:'四',t:'Oviedo 休整 + 领 credencial',r:'nor',stay:'Oviedo',km:321,note:'大教堂领章。今天不走。',stops:[{t:'—',p:'oviedo',n:'圣救主大教堂',s:''}]},
   {d:'05.07',w:'五',t:'Oviedo → Grado',r:'nor',stay:'Grado',km:296,walk:25,note:'第一天 25 公里，开始进山。',stops:[{t:'—',p:'grado',n:'Grado',s:''}]},
   {d:'05.08',w:'六',t:'→ Salas',r:'nor',stay:'Salas',km:274,walk:22,note:'',stops:[{t:'—',p:null,n:'Salas',s:''}]},
   {d:'05.09',w:'日',t:'→ Tineo',r:'nor',stay:'Tineo',km:245,walk:20,note:'爬升明显。',stops:[{t:'—',p:'tineo',n:'Tineo',s:'山脊上的镇子'}]},
   {d:'05.10',w:'一',t:'→ Pola de Allande',r:'nor',stay:'Pola de Allande',km:215,walk:28,note:'28 公里，中途补给点很少，水要带足。',stops:[{t:'—',p:'polaallande',n:'Pola de Allande',s:''}]},
   {d:'05.11',w:'二',t:'翻 Puerto del Palo',r:'nor',stay:'Berducedo',km:196,walk:19,note:'全程最大爬升之一，海拔升到 1146 米。雾大时能见度很低。',stops:[{t:'—',p:null,n:'Puerto del Palo',s:'1146 米'}]},
   {d:'05.12',w:'三',t:'→ Grandas de Salime',r:'nor',stay:'Grandas',km:185,walk:20,note:'先长下坡到水库，再一路上坡。',stops:[{t:'—',p:'grandas',n:'Grandas de Salime',s:'民族博物馆很值得看'}]},
   {d:'05.13',w:'四',t:'进加利西亚 → A Fonsagrada',r:'gal',stay:'A Fonsagrada',km:155,walk:26,note:'翻 Puerto del Acebo 后进入加利西亚。',stops:[{t:'—',p:'fonsagrada',n:'A Fonsagrada',s:'海拔 950 米，全年多雾'}]},
   {d:'05.14',w:'五',t:'→ O Cádavo',r:'gal',stay:'O Cádavo',km:131,walk:24,note:'',stops:[{t:'—',p:null,n:'O Cádavo',s:''}]},
   {d:'05.15',w:'六',t:'→ Lugo',r:'gal',stay:'Lugo',km:101,walk:30,note:'30 公里，最长的一天。进城前那段很长。',stops:[{t:'—',p:'lugo',n:'Lugo 罗马城墙',s:'可以在墙顶走完 2 公里'}]},
   {d:'05.16',w:'日',t:'Lugo → San Román',r:'gal',stay:'San Román',km:81,walk:20,note:'从这里开始每天盖两章。',stops:[{t:'—',p:null,n:'San Román da Retorta',s:''}]},
   {d:'05.17',w:'一',t:'→ Melide',r:'gal',stay:'Melide',km:52,walk:29,note:'并入法国之路，人流突然变多。',stops:[{t:'—',p:'melide',n:'Melide 吃章鱼',s:''}]},
   {d:'05.18',w:'二',t:'→ Arzúa → O Pedrouzo',r:'cam',stay:'O Pedrouzo',km:19,walk:33,note:'33 公里，也可以拆成两天。',stops:[{t:'—',p:'arzua',n:'Arzúa',s:''},{t:'—',p:'pedrouzo',n:'O Pedrouzo',s:''}]},
   {d:'05.19',w:'三',t:'走进 Santiago',r:'gal',stay:'Santiago',km:0,walk:19,note:'',stops:[
     {t:'05:30',p:'pedrouzo',n:'出发',s:''},{t:'11:30',p:'santiago',n:'大教堂',s:''},{t:'15:00',p:'pilgrimoffice',n:'换证书',s:''}]},
   {d:'05.20',w:'四',t:'Finisterre',r:'gal',stay:'Santiago',km:null,note:'',stops:[{t:'—',p:'finisterre',n:'Cabo Fisterra',s:''}]},
   {d:'05.21',w:'五',t:'Santiago 休整',r:'gal',stay:'Santiago',km:null,note:'',stops:[{t:'—',p:'santiago',n:'老城',s:''}]},
   {d:'05.22',w:'六',t:'飞马德里',r:'cit',stay:'马德里',km:null,note:'',stops:[{t:'—',p:'madrid',n:'马德里',s:''}]},
   {d:'05.23',w:'日',t:'马德里 → 温哥华',r:'cit',stay:'—',km:null,note:'',stops:[{t:'—',p:'mad',n:'MAD',s:''}]}
  ]},

D:{k:'D',gr:'IV',name:'法国之路全程 · SJPdP 出发',met:'38 DAYS · 33 WALK · 节点示意',hex:'#8C4A6B',tag:'全程',
  dates:'2027.05.01 → 06.07', walkDays:33, walkKm:780,
  pitch:'780 公里，33 个步行日，从法国边境走到 Santiago。'
    +'这是绝大多数人说「走朝圣之路」时指的那条。\n\n'
    +'完整版包含比利牛斯、里奥哈酒区、Meseta 高原、铁十字、加利西亚山区，'
    +'每一段的地貌和节奏都不一样。\n\n注意：这一条在行程页只列出关键节点，不是逐日拆解。真要走全程，需要按体力把 33 天重新分段。',
  cons:'需要连续请假五周以上，且要提前几个月做体能准备。'
    +'\n\n第一天翻比利牛斯是全程最难的一天，天气不好必须改走 Valcarlos 低线。'
    +'Meseta 段约 200 公里平坦麦田，遮荫极少，也是最多人中途搭车跳过的一段。',
  budget:{air:3000,walkStay:3600,cityStay:400,food:3800,transfer:900,train:400,tickets:250,misc:700},
  days:[
   {d:'05.01',w:'六',t:'温哥华 → 巴黎 → SJPdP',r:'cam',stay:'机上',km:780,note:'到 Saint-Jean 通常要转两次，留足时间。',stops:[{t:'—',p:null,n:'YVR 出发',s:''}]},
   {d:'05.02',w:'日',t:'抵 SJPdP',r:'cam',stay:'SJPdP',km:780,note:'朝圣者办公室领 credencial 和第一个章，顺便问明天的天气和路线建议。',stops:[
     {t:'—',p:'sjpdp',n:'Saint-Jean-Pied-de-Port',s:''}]},
   {d:'05.03',w:'一',t:'翻比利牛斯 → Roncesvalles',r:'cam',stay:'Roncesvalles',km:765,walk:25,note:'全程最难的一天，爬升 1250 米。天气不好走 Valcarlos 低线，不要逞强。',stops:[
     {t:'06:30',p:'sjpdp',n:'出发',s:''},{t:'16:00',p:'roncesvalles',n:'Roncesvalles',s:'修道院庇护所 180 张床'}]},
   {d:'05.06',w:'四',t:'→ Pamplona',r:'cam',stay:'Pamplona',km:705,walk:22,note:'第 4 天。老城和 pintxos 值得多留半天。',stops:[{t:'—',p:'pamplona',n:'Pamplona',s:''}]},
   {d:'05.10',w:'一',t:'→ Logroño',r:'cam',stay:'Logroño',km:610,walk:20,note:'第 8 天，进入里奥哈酒区。',stops:[{t:'—',p:'logrono',n:'Logroño',s:'Calle Laurel 一条街全是小酒馆'}]},
   {d:'05.15',w:'六',t:'→ Burgos',r:'cam',stay:'Burgos',km:490,walk:21,note:'第 13 天。大教堂是世界遗产。之后进入 Meseta。',stops:[{t:'—',p:'burgos',n:'Burgos 大教堂',s:''}]},
   {d:'05.19',w:'三',t:'Meseta 中段',r:'cam',stay:'Carrión',km:430,walk:26,note:'第 17 天。约 200 公里平坦麦田，遮荫极少，天亮前出发是常态。',stops:[{t:'—',p:'meseta',n:'Meseta',s:'夏季可超 40°C，5 月还好'}]},
   {d:'05.24',w:'一',t:'→ León',r:'cam',stay:'León',km:310,walk:24,note:'第 22 天。大教堂彩窗是全西班牙最好的之一。建议在这里休一天。',stops:[{t:'—',p:'leon',n:'León 大教堂',s:''}]},
   {d:'05.27',w:'四',t:'→ Astorga',r:'cam',stay:'Astorga',km:260,walk:22,note:'第 25 天。高迪设计的主教宫。',stops:[{t:'—',p:'astorga',n:'Astorga',s:'cocido maragato 反着上菜'}]},
   {d:'05.29',w:'六',t:'Cruz de Ferro → Ponferrada',r:'cam',stay:'Ponferrada',km:210,walk:27,note:'第 27 天。全程最高点 1505 米，传统是从家里带一块石头放在杆下。',stops:[
     {t:'—',p:'cruzferro',n:'Cruz de Ferro',s:'1505 米'},{t:'—',p:'ponferrada',n:'圣殿骑士城堡',s:''}]},
   {d:'06.01',w:'二',t:'→ O Cebreiro',r:'cam',stay:'O Cebreiro',km:155,walk:28,note:'第 30 天。进入加利西亚，海拔 1300 米，上坡很陡。',stops:[{t:'—',p:'cebreiro',n:'O Cebreiro',s:'圆形石屋 pallozas'}]},
   {d:'06.03',w:'四',t:'→ Sarria',r:'cam',stay:'Sarria',km:111.5,walk:24,note:'第 32 天。从明天开始人流骤增，且要每天盖两章。',stops:[{t:'—',p:'sarria',n:'Sarria',s:''}]},
   {d:'06.06',w:'日',t:'走进 Santiago',r:'gal',stay:'Santiago',km:0,walk:19,note:'第 35 天，终点。',stops:[
     {t:'—',p:'gozo',n:'Monte do Gozo',s:''},{t:'11:30',p:'santiago',n:'大教堂',s:''},{t:'15:00',p:'pilgrimoffice',n:'换证书',s:''}]},
   {d:'06.07',w:'一',t:'Santiago → 回程',r:'gal',stay:'—',km:null,note:'时间够的话再走三天到 Finisterre。',stops:[{t:'—',p:'finisterre',n:'Finisterre（可选）',s:''}]}
  ]}
};

/* ══════ 预算科目 ══════ */
const BROWS=[
 {k:'air', n:'国际机票', s:'YVR ⇄ 马德里 / Porto · 两人', max:7000},
 {k:'walkStay',n:'路上住宿', s:'庇护所 8–25 欧 / 乡村旅馆 50–90 欧', max:6000},
 {k:'cityStay',n:'城市住宿', s:'马德里 / 圣塞瓦斯蒂安 / Santiago', max:3500},
 {k:'food',n:'餐饮', s:'朝圣者套餐 12–15 欧含酒；pintxos 另算', max:5000},
 {k:'transfer',n:'行李托运', s:'每件每段 5–7 欧，肩膀不好就花这笔', max:1200},
 {k:'train',n:'境内交通', s:'AVE / 区域火车 / 国内航段 / 巴士', max:1500},
 {k:'tickets',n:'门票', s:'普拉多 / 古根海姆 / 阿尔罕布拉宫', max:900},
 {k:'misc',n:'装备 · 保险 · 杂项', s:'credencial 2 欧 · 证书免费', max:1500}
];

/* ══════ 行前待办 ══════ */
const TODOS=[
 {id:'p1',n:'办朝圣者证书 credencial',s:'出发前在朝圣者协会或线上申请，也可到 Sarria / Porto / Oviedo 当地领。约 2 欧',due:'现在',v:'ABCD'},
 {id:'p2',n:'订机票',s:'温哥华没有直飞，多在多伦多或欧洲枢纽转一次。5 月是欧洲旺季前，早订差价明显',due:'现在',v:'ABCD'},
 {id:'p3',n:'订最后 100 公里的住宿',s:'Sarria 之后 5 月非常挤。公立庇护所不接受预订，私立和旅馆要提前订',due:'现在',v:'ABCD'},
 {id:'p4',n:'买徒步鞋并提前磨合',s:'至少提前两个月开始穿，累计走够 100 公里再上路。新鞋直接上阵必起水泡',due:'现在',v:'ABCD'},
 {id:'p5',n:'体能准备',s:'提前 2–3 个月，每天 15–20 公里，背上实际要背的包。目标 6–8 公斤，约体重的 10%',due:'出发前 2 月',v:'ABCD'},
 {id:'p6',n:'预约阿尔罕布拉宫 / 普拉多',s:'阿尔罕布拉宫必须提前很久官网买票，分时段入场，迟到不让进',due:'出发前 2 月',v:'AB'},
 {id:'p7',n:'确认比利牛斯路线',s:'第一天走 Napoleón 高线还是 Valcarlos 低线，看当天天气。SJPdP 朝圣者办公室会给建议',due:'出发前',v:'D'},
 {id:'p8',n:'旅行保险（含徒步）',s:'确认覆盖徒步和意外撤离。部分保单把多日徒步列为除外责任',due:'出发前',v:'ABCD'},
 {id:'p9',n:'打包清单 6–8 公斤',s:'两套速干衣、雨衣、凉鞋、水泡贴、护膝、登山杖。多带的每一克都会在第三天变成后悔',due:'出发前',v:'ABCD'},
 {id:'p10',n:'下载离线地图 + 庇护所清单',s:'山区有大段没信号。原始之路尤其明显',due:'出发前',v:'ABCD'},
 {id:'p11',n:'带足现金',s:'小村庄的庇护所和酒吧很多只收现金，ATM 稀少',due:'出发前',v:'ABCD'}
];

/* ══════ 每晚住宿与吃饭 ══════
   写的是方向和筛选条件，不是具体房源清单。
   朝圣路上公立庇护所（albergue municipal）不接受预订，只能当天先到先得；
   私立庇护所和乡村旅馆可以订。5 月的最后 100 公里建议提前订。 */
const STAY={
 '马德里':{area:'Madrid centro',
  opts:[{n:'太阳门 / 格兰大道一带',tier:'€€',pick:true,q:'Madrid Sol Gran Via hotel',
    why:'地铁枢纽，走路能到普拉多和 Retiro。倒时差阶段离地铁近最要紧。'},
   {n:'阿托查车站附近',tier:'€',q:'Madrid Atocha hotel',
    why:'去托莱多、塞戈维亚的 AVE 从这里发车，但晚上那一带安静。'}],
  food:[{n:'圣米格尔市场',jp:'Mercado de San Miguel',why:'游客多但方便，落地当晚吃一圈 tapas。'},
   {n:'Casa Lucio 或同类老店',jp:'huevos rotos Madrid',why:'碎蛋配薯条火腿，马德里的家常做法。'}]},

 'Sarria':{area:'Sarria, Lugo',
  opts:[{n:'私立庇护所（albergue privado）',tier:'€',pick:true,q:'Sarria albergue',
    why:'6–8 张床的房间，15–25 欧。最后 100 公里起点，5 月要提前订。'},
   {n:'镇上的小旅馆 pensión',tier:'€€',q:'Sarria pension hotel',
    why:'第一晚想睡好就选这个。40–70 欧，有独立卫浴。'}],
  food:[{n:'朝圣者套餐 menú del peregrino',jp:'menu del peregrino Sarria',why:'12–15 欧，三道菜含酒和面包。几乎每家酒吧都有。'}]},

 'Portomarín':{area:'Portomarín, Lugo',
  opts:[{n:'公立庇护所',tier:'€',q:'Portomarin albergue municipal',
    why:'8–10 欧，不接受预订，下午到就要排队。'},
   {n:'私立庇护所或 pensión',tier:'€',pick:true,q:'Portomarin albergue privado',
    why:'能提前订，走完 22.5 公里不用再找住处。'}],
  food:[{n:'河边餐厅的炖章鱼',jp:'pulpo Portomarin',why:'加利西亚做法，配 Ribeiro 白酒。'}]},

 'Palas de Rei':{area:'Palas de Rei',
  opts:[{n:'镇上庇护所',tier:'€',pick:true,q:'Palas de Rei albergue',why:'中转镇，选择不少，前后两段都长。'}],
  food:[{n:'朝圣者套餐',jp:'menu peregrino Palas de Rei',why:''}]},

 'Arzúa':{area:'Arzúa, A Coruña',
  opts:[{n:'庇护所或小旅馆',tier:'€',pick:true,q:'Arzua albergue',why:'走完 29 公里的一天，离主街近最好。'}],
  food:[{n:'Arzúa 奶酪',jp:'queixo Arzua',why:'DOP 认证的本地奶酪，配蜂蜜。'}]},

 'O Pedrouzo':{area:'O Pedrouzo (Arca)',
  opts:[{n:'庇护所（早睡型）',tier:'€',pick:true,q:'O Pedrouzo albergue',
    why:'明天要 5 点半出发赶中午弥撒，选安静的。离机场近，飞机低空掠过。'}],
  food:[{n:'主街上的 bar',jp:'O Pedrouzo restaurante',why:'选择不多，早点吃早点睡。'}]},

 'Santiago':{area:'Santiago de Compostela, casco antiguo',
  opts:[{n:'老城内步行可达大教堂',tier:'€€',pick:true,q:'Santiago de Compostela old town hotel',
    why:'走完全程的犒赏。老城石板路多，行李箱不好拖，但值得。'},
   {n:'Hostal dos Reis Católicos',tier:'€€€',q:'Parador Santiago de Compostela',
    why:'广场边的古建筑改的 Parador，据说每天给前十名朝圣者免费餐。想住要很早订。'},
   {n:'老城外的现代酒店',tier:'€',q:'Santiago de Compostela hotel',
    why:'便宜，有电梯，走去大教堂十五分钟。'}],
  food:[{n:'Mercado de Abastos',jp:'Mercado de Abastos Santiago',why:'买海鲜可以让隔壁摊现做。上午去。'},
   {n:'炖章鱼 + Albariño',jp:'pulpo a feira Santiago',why:'加利西亚组合。'},
   {n:'Tarta de Santiago',jp:'tarta de Santiago',why:'杏仁蛋糕，上面印圣雅各十字。'}]},

 'Porto':{area:'Porto, Ribeira / Baixa',
  opts:[{n:'Ribeira 或 Baixa 一带',tier:'€€',pick:true,q:'Porto Ribeira hotel',
    why:'走路能到大教堂领第一个章，也能到酒窖。坡很多。'}],
  food:[{n:'Francesinha',jp:'francesinha Porto',why:'波尔图的招牌三明治，分量极大。'},
   {n:'杜罗河南岸酒窖',jp:'Vila Nova de Gaia port wine',why:'过桥就是，下午去。'}]},

 'Tui':{area:'Tui, Pontevedra',
  opts:[{n:'公立庇护所或 pensión',tier:'€',pick:true,q:'Tui albergue',
    why:'跨过米尼奥河的第一晚。从这里开始每天盖两章。'}],food:[]},

 'Pontevedra':{area:'Pontevedra casco vello',
  opts:[{n:'老城内',tier:'€€',pick:true,q:'Pontevedra old town hotel',
    why:'老城完全步行化，晚上很舒服。'}],
  food:[{n:'老城 tapas',jp:'tapas Pontevedra casco vello',why:'广场周围一圈都是。'}]},

 'Oviedo':{area:'Oviedo casco antiguo',
  opts:[{n:'老城内',tier:'€€',pick:true,q:'Oviedo old town hotel',
    why:'原始之路起点，大教堂领章。苹果酒馆 sidrería 都在这一带。'}],
  food:[{n:'Sidrería 苹果酒馆',jp:'sidreria Oviedo',why:'倒酒有专门手法，让服务员倒。配 cachopo。'}]},

 'Lugo':{area:'Lugo, dentro de la muralla',
  opts:[{n:'罗马城墙内',tier:'€€',pick:true,q:'Lugo muralla hotel',
    why:'可以在墙顶走完 2 公里。走完 30 公里的一天，住城里最省事。'}],
  food:[{n:'Lugo 的 tapas（点酒送小食）',jp:'tapas Lugo',why:'卢戈的传统是点一杯酒白送一份 tapa。'}]},

 '毕尔巴鄂':{area:'Bilbao, Casco Viejo / Abandoibarra',
  opts:[{n:'老城或古根海姆附近',tier:'€€',pick:true,q:'Bilbao Casco Viejo hotel',why:'两边都能走到，地铁方便。'}],
  food:[{n:'Casco Viejo 的 pintxos',jp:'pintxos Casco Viejo Bilbao',why:'比圣塞瓦斯蒂安便宜，人少一些。'}]},

 '圣塞瓦斯蒂安':{area:'Donostia, Parte Vieja',
  opts:[{n:'老城 Parte Vieja 边缘',tier:'€€€',pick:true,q:'San Sebastian Parte Vieja hotel',
    why:'晚上 pintxos 一家家吃过去，住在里面最好。旺季价格很高。'},
   {n:'Gros 区（河对岸）',tier:'€€',q:'San Sebastian Gros hotel',
    why:'便宜一些，走过桥十分钟，本地感更强。'}],
  food:[{n:'Parte Vieja pintxos 巡回',jp:'pintxos Parte Vieja San Sebastian',why:'一家一两样就换下家，站着吃。'},
   {n:'La Viña 的芝士蛋糕',jp:'La Viña San Sebastian tarta de queso',why:'巴斯克焦香芝士蛋糕的原版。'}]},

 'SJPdP':{area:'Saint-Jean-Pied-de-Port, France',
  opts:[{n:'镇上 gîte 或小旅馆',tier:'€€',pick:true,q:'Saint Jean Pied de Port gite',
    why:'朝圣者办公室领 credencial，顺便问明天翻山的天气建议。'}],food:[]},
 'Roncesvalles':{area:'Roncesvalles, Navarra',
  opts:[{n:'修道院庇护所',tier:'€',pick:true,q:'Roncesvalles albergue monasterio',why:'180 张床，翻过比利牛斯当晚。'}],food:[]},
 'Pamplona':{area:'Pamplona casco viejo',
  opts:[{n:'老城内',tier:'€€',pick:true,q:'Pamplona old town hotel',why:'值得多留半天。'}],
  food:[{n:'Calle Estafeta 的 pintxos',jp:'pintxos Pamplona Estafeta',why:''}]},
 'Logroño':{area:'Logroño, La Rioja',
  opts:[{n:'老城内',tier:'€€',pick:true,q:'Logrono old town hotel',why:'Calle Laurel 一条街全是小酒馆。'}],
  food:[{n:'Calle Laurel',jp:'Calle Laurel Logrono',why:'一家一个招牌菜，配里奥哈红酒。'}]},
 'Burgos':{area:'Burgos centro',
  opts:[{n:'大教堂附近',tier:'€€',pick:true,q:'Burgos cathedral hotel',why:'之后进入 Meseta，这里休一天不亏。'}],food:[]},
 'León':{area:'León casco antiguo',
  opts:[{n:'老城 Barrio Húmedo',tier:'€€',pick:true,q:'Leon Barrio Humedo hotel',why:'建议在这里整休一天。'}],
  food:[{n:'Barrio Húmedo 点酒送 tapa',jp:'tapas Barrio Humedo Leon',why:''}]},
 'Astorga':{area:'Astorga',opts:[{n:'镇上庇护所',tier:'€',pick:true,q:'Astorga albergue',why:''}],
  food:[{n:'Cocido maragato',jp:'cocido maragato Astorga',why:'反着上菜：先肉后汤。分量很大。'}]},
 'Ponferrada':{area:'Ponferrada',opts:[{n:'城堡附近',tier:'€',pick:true,q:'Ponferrada albergue',why:''}],food:[]},
 'O Cebreiro':{area:'O Cebreiro, Lugo',
  opts:[{n:'村里的庇护所',tier:'€',pick:true,q:'O Cebreiro albergue',why:'海拔 1300 米，房间极少，雾很大。'}],
  food:[{n:'Caldo gallego',jp:'caldo gallego O Cebreiro',why:'加利西亚蔬菜汤，爬完坡喝。'}]},
 'Carrión':{area:'Carrión de los Condes',opts:[{n:'修道院庇护所',tier:'€',pick:true,q:'Carrion de los Condes albergue',why:'Meseta 中段。'}],food:[]},
 'Esposende':{area:'Esposende, Portugal',opts:[{n:'海边旅馆',tier:'€',pick:true,q:'Esposende hotel',why:''}],food:[]},
 'Barcelos':{area:'Barcelos, Portugal',opts:[{n:'镇上庇护所',tier:'€',pick:true,q:'Barcelos albergue',why:'周四有大集市。'}],food:[]},
 'Ponte de Lima':{area:'Ponte de Lima, Portugal',opts:[{n:'罗马桥附近',tier:'€',pick:true,q:'Ponte de Lima hotel',why:''}],food:[]},
 'Rubiães':{area:'Rubiães, Portugal',opts:[{n:'公立庇护所',tier:'€',pick:true,q:'Rubiaes albergue',why:'翻过山口当晚，选择很少。'}],food:[]},
 'Vila do Conde':{area:'Vila do Conde, Portugal',opts:[{n:'海边旅馆',tier:'€',pick:true,q:'Vila do Conde hotel',why:'海岸线变体第一晚。'}],food:[]},
 'Redondela':{area:'Redondela',opts:[{n:'镇上庇护所',tier:'€',pick:true,q:'Redondela albergue',why:''}],food:[]},
 'Caldas de Reis':{area:'Caldas de Reis',opts:[{n:'温泉镇旅馆',tier:'€',pick:true,q:'Caldas de Reis hotel',why:'路边有免费热泉洗脚池。'}],food:[]},
 'Padrón':{area:'Padrón',opts:[{n:'镇上庇护所',tier:'€',pick:true,q:'Padron albergue',why:''}],
  food:[{n:'Pimientos de Padrón',jp:'pimientos de Padron',why:'十个里有一个是辣的。'}]},
 'Grado':{area:'Grado, Asturias',opts:[{n:'镇上庇护所',tier:'€',pick:true,q:'Grado Asturias albergue',why:''}],food:[]},
 'Salas':{area:'Salas, Asturias',opts:[{n:'镇上庇护所',tier:'€',pick:true,q:'Salas Asturias albergue',why:''}],food:[]},
 'Tineo':{area:'Tineo, Asturias',opts:[{n:'镇上庇护所',tier:'€',pick:true,q:'Tineo albergue',why:''}],food:[]},
 'Pola de Allande':{area:'Pola de Allande',opts:[{n:'镇上庇护所',tier:'€',pick:true,q:'Pola de Allande albergue',why:'明天翻 Puerto del Palo。'}],food:[]},
 'Berducedo':{area:'Berducedo, Asturias',opts:[{n:'村里庇护所',tier:'€',pick:true,q:'Berducedo albergue',why:'服务点很少，早点到。'}],food:[]},
 'Grandas':{area:'Grandas de Salime',opts:[{n:'镇上庇护所',tier:'€',pick:true,q:'Grandas de Salime albergue',why:''}],food:[]},
 'A Fonsagrada':{area:'A Fonsagrada, Lugo',opts:[{n:'镇上庇护所',tier:'€',pick:true,q:'A Fonsagrada albergue',why:'海拔 950 米，全年多雾。'}],food:[]},
 'O Cádavo':{area:'O Cádavo Baleira',opts:[{n:'村里庇护所',tier:'€',pick:true,q:'O Cadavo albergue',why:''}],food:[]},
 'San Román':{area:'San Román da Retorta',opts:[{n:'村里庇护所',tier:'€',pick:true,q:'San Roman da Retorta albergue',why:'选择极少。'}],food:[]},
 'Melide':{area:'Melide, A Coruña',opts:[{n:'镇上庇护所',tier:'€',pick:true,q:'Melide albergue',why:''}],
  food:[{n:'Pulpería Ezequiel',jp:'Pulperia Ezequiel Melide',why:'梅利德最有名的章鱼店。'}]}
};
