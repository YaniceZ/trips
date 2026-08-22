/* ══════════════════════════════════════════════════════════════
   content.js — 行程全部文字在此文件。
   改字只动此文件，index.html 不动。

   规则：
   1. 单引号 ' 内不可再用单引号。中文用「」。
   2. 每项末尾逗号不删。
   3. 改完提交，30 秒后刷新。白屏按 F12 看 Console 红字。

   目录：
     LABELS / TXT  界面词 + 说明文字
     REG / P       区域 + 地点
     TIMING        季节表
     V             5 套方案，drive = 当日驾驶小时数
     BROWS         预算科目
     TODOS         行前待办
     STAY          每晚住宿 + 餐饮（文件末尾）
   ══════════════════════════════════════════════════════════════ */

const LABELS = {
  cost: '费用',
  drive: '驾驶时长',
  season: '最佳季节',
  weather: '天气',
  routes: '5 套方案',
  switchPlan: '切换方案',
  places: '沿途地点',
  ourPins: '收藏点',
  bookings: '预订',
  prepList: '行前待办',
  reconcile: '对账',
  fx: '汇率',
  rules: '规则',
  compare: '方案对比',
  aboutPage: '关于此页'
};

const TXT={
  season:
    '夏季（6 月中–9 月中）：湖水最蓝，路况全通，游客峰值。'
    +'<br><br>秋季（9 月中–10 月上旬）：落叶松转金，人流回落。Moraine Lake Road 10 月 12 日封至次年 6 月。'
    +'<br><br>冬季（12 月–3 月）：滑雪季。Icefields Parkway 服务点关闭，'
    +'Moraine Lake 禁入。冬季仅推荐滑雪，湖景不可达。',

  drive:
    '横条 = 每日驾驶小时数。>5 小时标红，需预留休息站，避免夜间行驶。'
    +'<br><br>温哥华→Golden 约 750 km，标准 8 小时。施工/雨雪 +1–2 小时。',

  wxNote:
    '降水单位 mm。7 天预报仅出发前一周有效。上方为去年同期实测。'
    +'落基山昼夜温差大：8 月底日间 20°C+，清晨 5–6°C，湖边风感更低。'
    +'数据 Open-Meteo（CC BY 4.0）。',

  itinHint: '点任意一天，地图跟随。左侧数字 = 当日驾驶小时数，红色 >5 小时。',

  pinsEmpty:
    '暂无收藏点。分享行程码给同行者，新增餐厅/观景点/住宿实时同步。地图长按可落点。',

  bookingIntro:
    '本栏为预订记录，非建议。勾选完成项，填确认号+实付金额，同行者可见，预算页自动对账。',

  prepIntro:
    '按当前方案筛选。<b>Moraine Lake 班车预约</b>需最先处理，其余可临时补办。',

  budgetNote:
    '单位加元，数字为估算，可拖拽调整。'
    +'<br><br>油费按往返 1500 km、9 L/100km、1.7 CAD/L 估算，实际依车型浮动。'
    +'国家公园门票：2026.06.19–09.07 由 Canada Strong Pass 覆盖，免费入园。'
    +'Lake Louise 旺季停车 42 CAD/车，Park and Ride 免费。',

  noteHint: '记实地信息：人流时段/停车状况/闭店/路线修正。显示在描述上方。',

  aboutPage:
    '行程码 = 数据视图。同码用户共享收藏点。新码 = 空白行程，可供他人独立使用。',
  aboutFoot:
    '共享数据对同码用户可见。坐标为示意精度，班车时刻/票价/开放状态以 Parks Canada 当日公告为准。'
};

/* ── Moraine Lake 抢票分步指南（准备页） ── */
const SHUTTLE={
  url:'https://reservation.pc.gc.ca',
  parking:'1 Whitehorn Rd, Lake Louise, AB T0L 1E0',
  price:'车票 8 CAD/人（青少年常为 0）+ 预订费约 3.5 CAD + 税。4 人合计通常 <20 CAD。',
  steps:[
   ['提前注册账号','reservation.pc.gc.ca 右上角 Sign in。有 GCKey 用 GCKey 最快，否则用 Google 登录。抢票当天再注册来不及。'],
   ['提前存信用卡','把卡存进浏览器自动填充。付款手速决定成败，别人还在填卡号时你已下单。'],
   ['设闹钟：出发前 2 日 08:00 MDT','山地时区。温哥华为 07:00。提前 10 分钟登录并停在预订页。'],
   ['选 Moraine Lake 优先','选哪个湖 = 先到哪个湖。Lake Louise 私家车可达，Moraine 只能坐车 → 优先抢 Moraine。'],
   ['抢不到就持续刷新','热门时段数分钟售罄。刷新常有退票释出。抢到任意时段先放购物车锁定，再刷理想时段。'],
   ['时段选择','清晨最热门。抢不到 → 选 12:00 后，成功率更高。看金松需预留 ≥3 小时。'],
   ['提前截图二维码','邮件收到二维码。现场信号极差，务必本地截图。'],
   ['现场换纸质票','按预约时段抵达绿色亭子 Booth 签到换票。旺季排队，提前 30 分钟到。'],
   ['签到后当天无限次','一票通两湖，含 Lake Connector 接驳。末班车常在 19:30 前后，规划返程。']
  ],
  fallback:[
   ['抢不到票的替代方案','Roam Transit 8X Super Pass：成人往返 30 CAD，青少年半价，12 岁以下免费。当天无限次。'],
   ['购票','roamtransit.com 官网，或现场排队买。Banff High School 站上车。'],
   ['反向也可以','买不到 Banff→Louise，就买 Louise→Banff，当天无限次，效果相同。'],
   ['停车','住 Banff 镇可停酒店。未住镇内可停 Banff 火车站，9am–9pm 免费停 9 小时，够玩两湖。'],
   ['两湖之间','Lake Connector 免费，出示购票二维码即可。']
  ]
};

/* ── 离线地图（准备页） ── */
const OFFLINE=[
 ['Google 地图 · 离线区域','App 内点头像 → 离线地图 → 选择您自己的地图 → 框选 Banff/Lake Louise/Icefields 一带 → 下载。出发前在 wifi 下完成。'],
 ['Apple 地图 · 离线地图','iOS 17 起支持。App 内点头像 → 离线地图 → 下载新地图 → 框选区域。'],
 ['务必截图的内容','Moraine Lake 班车二维码、酒店确认号、当日导航路线。湖区全天无信号，截图比任何 App 可靠。']
];

/* ── 两条硬规则 ── */
const RULES=[
 ['Moraine Lake 禁私家车','2023 年起全年封闭私家车（含无障碍证）。仅限 Parks Canada 班车/持牌商业车/Roam 公交/骑行（单程 12.5 km，爬升 250 m）。'],
 ['班车分两次放票','2026.04.15 放全季 40% 票额。剩余 60% 于出发前 2 日 08:00 MT 滚动放出。热门时段数分钟售罄。'],
 ['一票通两湖','含 Lake Connector 接驳 + Park and Ride 返程。预约时选定的湖为首个目的地。'],
 ['Lake Louise 可开车，停车贵','旺季 42 CAD/车，3:00–19:00 收费，清晨即满。Park and Ride 班车停车免费。'],
 ['门票与班车票分离','班车票不含国家公园门票。2026.06.19–09.07 Canada Strong Pass 免费入园，其余时段单独购买。']
];

/* ── 五套方案对比 ── */
const COMPARE=[
 ['甲 · Calgary 连住四晚','住宿仅换两处，行李拆两次。首日直达 Calgary，后三日当日往返，每日 ≤3 景点。'],
 ['乙 · 住进 Banff','省去 Calgary 往返 2 小时。早 7 点可达湖边。旺季住宿成本上升。'],
 ['丙 · 飞抵 4 天','YVR→YYC 1.5 小时，落地租车。省 2 天驾驶，增机票+租车费。'],
 ['丁 · 深度 8 天','含 Jasper + Icefields Parkway 全程 + 哥伦比亚冰原。落基山完整版。'],
 ['戊 · 冬季滑雪 7 天','Kicking Horse + SkiBig3。冬季湖面封冻，行程重心为滑雪。']
];

/* ══════ 区域 + 地点 ══════ */
const REG={bc:{n:'BC 段',hex:'#2F6B4F'},yoho:{n:'Yoho',hex:'#2E8C9E'},
           banff:{n:'Banff',hex:'#C0392B'},cal:{n:'Calgary',hex:'#7A6A8C'},
           ice:{n:'Icefields',hex:'#D8A93C'},ski:{n:'雪场',hex:'#1F6FA8'}};
const P={};
const def=(id,zh,en,lat,lng,r,note,kind)=>P[id]={id,zh,en,lat,lng,r,note,kind};
/* kind='way' = 路过点（休息区/家/加油），不显示攻略搜索和官网按钮 */

/* — BC 段 — */
def('burnaby','Burnaby 出发','Burnaby BC',49.2488,-122.9805,'bc','满油出发，查胎压。Coquihalla 沿线无平价油站。','way');
def('zopkios','Zopkios 休息区','Zopkios Rest Area',49.6017,-121.0972,'bc','Coquihalla 高点附近。有洗手间+大停车区。行驶约 2 小时可达。','way');
def('kamloops','Kamloops','Kamloops BC',50.6745,-120.3273,'bc','全程中点。加油+正餐建议在此。Golden 前选择减少。');
def('kamloopslake','Kamloops Lake 观景点','Kamloops Lake Rest Area',50.7300,-120.6800,'bc','1 号公路沿湖段，多处路边观景台。','way');
def('revelstoke','Revelstoke','Revelstoke BC',50.9981,-118.1957,'bc','进 Rogers Pass 前最后一个完整城镇。','way');
def('rogers','Rogers Pass','Rogers Pass',51.3011,-117.5197,'bc','海拔 1330 m。冬季雪崩控制常临时封路。夏季路况良好，全程最佳山景段之一。','way');
def('golden','Golden','Golden BC',51.2965,-116.9631,'bc','落基山西侧小镇，往返均在此过夜。镇区小，餐厅闭店早。');
def('sicamous','Sicamous','Sicamous BC',50.8300,-118.9800,'bc','Trans-Canada 转 97A 南下的路口镇。加油+洗手间。','way');
def('vernon','Vernon','Vernon BC',50.2670,-119.2720,'bc','Okanagan 北端。此后沿湖南下 0.5 小时到 Kelowna。','way');
def('kelowna','Kelowna','Kelowna BC',49.8880,-119.4960,'bc','Okanagan 湖东岸，BC 内陆最大城市。酒庄+湖滩集中，餐饮选择远多于 Kamloops。');
def('citypark','Kelowna City Park','Kelowna City Park BC',49.8845,-119.4966,'bc','湖边沙滩+平坦步道，紧邻市中心。晨间散步 30 分钟。');
def('missionhill','Mission Hill 酒庄','Mission Hill Family Estate Westbank BC',49.8330,-119.6060,'bc','Kelowna 西岸，建筑+视野最佳。参观需预约，仅看风景可直接进。');
def('quailsgate','Quails Gate 酒庄','Quails Gate Winery West Kelowna BC',49.8480,-119.5760,'bc','与 Mission Hill 相邻，餐厅评价高，湖景座位需订位。');
def('merritt','Merritt','Merritt BC',50.1120,-120.7860,'bc','97C 与 Coquihalla 交汇。回程唯一完整服务区，加油+吃饭。');
def('wolfsden','The Wolfs Den','The Wolfs Den Golden',51.2967,-116.9648,'bc','Golden 老牌餐厅。野牛肋排为招牌。旺季晚市需等位，进镇前致电。');
def('ethos','Ethos Cafe','Ethos Cafe Golden',51.2977,-116.9639,'bc','早餐+外带咖啡。次日出发前采购，湖边食用。');
def('kicking','Kicking Horse 雪场','Kicking Horse Mountain Resort',51.2981,-117.0489,'ski','Golden 旁，落差 1260 m，加拿大最大雪场之一。陡峭碗状地形+林间道。初学者选择少。');

/* — Yoho — */
def('emerald','Emerald Lake','Emerald Lake',51.4432,-116.5289,'yoho','环湖步道 5.2 km，约 1 小时。或走前 10 分钟至桥头。停车场有限，10:00 后常满。');
def('naturalbridge','Natural Bridge','Natural Bridge Yoho',51.3892,-116.5044,'yoho','往 Emerald Lake 途中，停车后步行 2 分钟。Kicking Horse 河切穿岩层成孔洞。');
def('takakkaw','Takakkaw Falls','Takakkaw Falls',51.4989,-116.4772,'yoho','落差 254 m。上坡含两处发夹弯，长轴距车辆不推荐。6 月–10 月初开放。');

/* — Lake Louise / Moraine — */
def('parkride','Lake Louise Park and Ride','Lake Louise Park and Ride',51.4419,-116.1547,'banff','Lake Louise 滑雪场停车场。有班车预约则停车免费。所有常规班车从此发车。','way');
def('lakelouise','Lake Louise 湖边','Lake Louise Lakeshore',51.4254,-116.1773,'banff','湖边平路来回 4 km。长辈走前半段至城堡酒店侧即可。旺季停车 42 CAD/车且常满。');
def('moraine','Moraine Lake','Moraine Lake',51.3217,-116.1860,'banff','十峰谷。私家车全年禁行，仅限班车。Rockpile 观景点：短陡碎石台阶，扶手齐全。');
def('billpeytos','Bill Peytos Cafe','Bill Peytos Cafe Lake Louise',51.4258,-116.1858,'banff','Lake Louise 村内青旅餐厅。价格低于湖边，人少。');
def('fairmontll','Fairmont 城堡酒店','Fairmont Chateau Lake Louise',51.4166,-116.2180,'banff','湖景餐厅需提前订位，先解决停车。不订位可坐大堂咖啡区。');
def('lakeagnes','Lake Agnes 茶屋','Lake Agnes Tea House',51.4306,-116.2394,'banff','单程 3.5 km，爬升 400 m，来回 3 小时。仅收现金。不推荐带长辈。');

/* — Banff — */
def('banfftown','Banff 小镇','Banff Town',51.1784,-115.5708,'banff','主街 Banff Ave 步行 20 分钟走完。镇内停车紧张，Bear Street 停车楼最省事。');
def('cascade','Cascade of Time Garden','Cascade of Time Garden',51.1706,-115.5688,'banff','公园管理局大楼后花园。坡缓，有长椅。8 月底仍有花。免费。');
def('surprise','Surprise Corner 观景台','Surprise Corner Viewpoint',51.1697,-115.5578,'banff','拍 Fairmont Banff Springs 城堡的经典机位。路边停车，步行 2 分钟。');
def('pedbridge','Banff 步行桥','Banff Pedestrian Bridge',51.1729,-115.5695,'banff','跨 Bow River，桥上观 Cascade Mountain。与上述两处均在步行范围，1 小时走完。');
def('bowfalls','Bow Falls','Bow Falls',51.1667,-115.5622,'banff','落差不大，水量足。观景台距停车场数十米。');
def('minnewanka','Minnewanka Loop','Lake Minnewanka Loop',51.2417,-115.5000,'banff','约 24 km 环形景观道。清早常见大角羊/麋鹿。开完一圈 40 分钟，不下车也值。');
def('twojack','Two Jack Lake','Two Jack Lake',51.2258,-115.5136,'banff','Minnewanka 环线上。湖面平静时倒映 Mount Rundle。日出机位。');
def('norquay','Mount Norquay 观景台','Mount Norquay Lookout',51.2000,-115.5967,'banff','盘山公路直达，免费。俯瞰整个 Banff 镇+Bow Valley。日落前 1 小时最佳，人流少于缆车站。');
def('vermilion','Vermilion Lakes','Vermilion Lakes',51.1786,-115.6042,'banff','距镇中心 5 分钟。日落日出俱佳。路边可停，晚间常有麋鹿。');
def('johnston','Johnston Canyon','Johnston Canyon',51.2450,-115.8394,'banff','栈道贴峡谷壁，至下瀑布单程 1.1 km，路面平整。停车场 9 点前满，早去或傍晚去。');
def('farmfire','Farm and Fire','Farm and Fire Banff',51.1760,-115.5713,'banff','Banff 镇柴火烤炉餐厅。晚市需订位。');
def('banffsocial','Banff Social','Banff Social',51.1755,-115.5715,'banff','主街上。菜单杂，出餐快。适合带长辈，等位时间短。');

/* — Icefields Parkway / Jasper — */
def('bowlake','Bow Lake','Bow Lake',51.6706,-116.4622,'ice','Icefields Parkway 首个大湖。路边即停车场，无需步行。');
def('peyto','Peyto Lake','Peyto Lake',51.7167,-116.5167,'ice','停车后步道约 15 分钟至观景台，坡缓有栏杆。停车场中午满。');
def('icefield','哥伦比亚冰原','Columbia Icefield',52.2203,-117.2264,'ice','Athabasca 冰川就在路边。冰上车/玻璃栈道需提前订。不上冰可在游客中心对面观景。');
def('athabascafalls','Athabasca Falls','Athabasca Falls',52.6644,-117.8836,'ice','水量大，栈道短，15 分钟看完。');
def('jasper','Jasper 镇','Jasper AB',52.8737,-118.0814,'ice','比 Banff 安静。暗夜保护区，晴天见银河。2024 山火后部分区域恢复中，出发前查开放状态。');
def('maligne','Maligne Lake','Maligne Lake',52.7233,-117.6428,'ice','至 Spirit Island 需坐船，往返 90 分钟，提前订。');

/* — Calgary — */
def('calgary','Calgary 市中心','Downtown Calgary',51.0447,-114.0719,'cal','住 Downtown：晚饭+散步步行可达。代价：每日进出落基山各 1 小时。');
def('crossiron','CrossIron Mills','CrossIron Mills',51.2189,-114.0022,'cal','Calgary 北面大型 outlet，距机场 10 分钟。雨天/走不动的一天用来兜底。');
def('studiobell','Studio Bell 国家音乐中心','Studio Bell',51.0450,-114.0553,'cal','建筑本身值得看。室内，适合天气不好的下午。');
def('calgarytower','Calgary Tower','Calgary Tower',51.0447,-114.0631,'cal','191 m，玻璃地板。晴天可见落基山轮廓。');
def('eauclaire','Eau Claire / Prince Island','Eau Claire Calgary',51.0533,-114.0700,'cal','Bow River 边公园+步道。饭后散步适宜。');
def('joey','JOEY Eau Claire','JOEY Eau Claire Calgary',51.0530,-114.0708,'cal','江边连锁，出品稳定。需订位。');
def('yyc','Calgary 机场','YYC Calgary International Airport',51.1315,-114.0106,'cal','温哥华飞行约 1.5 小时。租车柜台在航站楼内。','way');
def('canmore','Canmore','Canmore AB',51.0884,-115.3479,'banff','国家公园门外。住宿低于 Banff，开进 Banff 20 分钟。三姐妹峰在镇后。');

/* — 雪场（方案戊） — */
def('sunshine','Banff Sunshine Village','Banff Sunshine Village',51.0783,-115.7761,'ski','雪质最干，海拔高，季节长。需坐缆车从停车场上雪村。');
def('lakelouiseski','Lake Louise 雪场','Lake Louise Ski Resort',51.4419,-116.1547,'ski','面积最大，前后山地形差异明显。背面（Back Bowls）风大时关闭。');
def('norquayski','Mt Norquay 雪场','Mt Norquay',51.2003,-115.5964,'ski','距 Banff 镇最近，规模小，有夜滑。适合半天热身。');
def('nakiska','Nakiska','Nakiska Ski Area',50.9425,-115.1550,'ski','Kananaskis 内，1988 冬奥场地，距 Calgary 最近。人少，以压雪道为主。');

/* ══════ 季节表 ══════ */
const GCOL=['#E1E7E6','#BFD9DA','#6FB0B8','#2E8C9E'];
const H2=['#E1E7E6','#EBD8B0','#D8A93C','#C0392B'];
const TIMING={
  cols:[{k:'1–3月',pk:1},{k:'4–5月',pk:0},{k:'6月',pk:0},{k:'7–8月',pk:1},{k:'9月',pk:1},{k:'10月',pk:0},{k:'11–12月',pk:0}],
  rows:[
    {n:'湖 / 路',v:[0,1,2,3,3,1,0],c:GCOL},
    {n:'滑雪',   v:[3,1,0,0,0,0,2],c:GCOL},
    {n:'人流',   v:[2,1,2,3,2,1,1],c:H2},
    {n:'价格',   v:[2,1,2,3,2,1,1],c:H2}
  ]
};

/* ══════ 五套方案 ══════ */
const V={
A:{k:'A',gr:'甲',name:'Calgary 连住四晚 · 6 天 5 晚',met:'6 DAYS · 5 NIGHTS',hex:'#C0392B',tag:'这次',
  start:'2026-08-27', dates:'2026.08.27 → 09.01',
  pitch:'住宿仅换两处：Calgary 连住四晚，回程 Kamloops 歇一晚。行李拆两次。\n\n'
    +'首日直达 Calgary，最累一段一次用完。后三日当日往返，每日 ≤3 景点，步行 ≤1 小时。',
  cons:'首日约 950 km，10–11 小时，全程最硬一天。早出发，避免夜间进城。\n\n'
    +'住 Calgary：每日进出落基山各约 1 小时。省去此项 → 方案乙。',
  budget:{gas:450,stay:1300,food:900,park:0,shuttle:60,tickets:220,shop:600,misc:300},
  days:[
   {d:'08.27',w:'四',t:'Burnaby → Calgary',r:'bc',stay:'Calgary',drive:10.5,
    sig:'全程基本有信号。Coquihalla 山区局部断续。',
    note:'约 950 km，10–11 小时。全程最硬一天，出发前满油。',stops:[
     {t:'早',p:'burnaby',n:'出发',s:'6:30 前上路'},
     {t:'—',p:'zopkios',n:'Zopkios Rest Area',s:'Coquihalla 最高点附近，厕所+大停车场'},
     {t:'午',p:'kamloops',n:'Kamloops 加油+午饭',s:'油价低于 Coquihalla 段'},
     {t:'—',p:'rogers',n:'Rogers Pass',s:'全程最佳山景段，今日以赶路为主'},
     {t:'晚',p:'calgary',n:'Calgary 入住',s:'早休息'}]},
   {d:'08.28',w:'五',t:'班夫日',r:'banff',stay:'Calgary',drive:3.5,
    sig:'Banff 镇有信号有 wifi。Minnewanka Loop/Norquay 段信号弱、断续。',
    note:'清晨出发，Minnewanka 环线常见大角羊/麋鹿。镇上 3 景点步行可达。',stops:[
     {t:'07:30',p:'minnewanka',n:'Minnewanka Loop',s:'24 km 环线，开一圈 40 分钟'},
     {t:'—',p:'twojack',n:'Two Jack Lake',s:'湖面平静时倒映 Rundle 山'},
     {t:'10:30',p:'cascade',n:'Cascade of Time Garden',s:'坡缓有长椅，免费'},
     {t:'—',p:'surprise',n:'Surprise Corner',s:'城堡酒店拍摄机位'},
     {t:'—',p:'pedbridge',n:'Banff 步行桥',s:'3 处合计 <1 小时'},
     {t:'12:30',p:'farmfire',n:'午饭',s:'Farm and Fire 或 Banff Social，均需订位'},
     {t:'17:30',p:'norquay',n:'Mount Norquay Lookout',s:'开车直达，免费，日落前 1 小时最佳'}]},
   {d:'08.29',w:'六',t:'湖泊日 · 断网日',r:'yoho',stay:'Calgary',drive:5,
    sig:'全天基本无信号无 wifi。Emerald Lake/Moraine Lake 完全断网。Lake Louise 村信号弱。班车凭证提前截图存本地。',
    note:'今日抢班车。早餐带走，车上食用。全程最满一天。',stops:[
     {t:'07:00',p:'ethos',n:'Ethos Cafe 带早餐',s:'车上食用'},
     {t:'—',p:'emerald',n:'Emerald Lake',s:'环湖步道 30 分钟。或仅至桥头'},
     {t:'—',p:'parkride',n:'Park and Ride 换班车',s:'停车免费，预约时段前 15 分钟到'},
     {t:'—',p:'lakelouise',n:'Lake Louise 湖边',s:'平路，至城堡酒店侧即可'},
     {t:'—',p:'moraine',n:'Moraine Lake',s:'转乘 Lake Connector，免费'},
     {t:'午',p:'billpeytos',n:'午饭 · 视情况',s:'先在村内简单吃。体力+时间充裕 → Fairmont 湖景餐厅（需订位）'},
     {t:'傍晚',p:'calgary',n:'回 Calgary',s:'约 3 小时'}]},
   {d:'08.30',w:'日',t:'休息购物日',r:'cal',stay:'Calgary',drive:1,
    sig:'全程正常，市区 wifi 齐全。',
    note:'连续 2 日行程后缓冲。雨天全程室内可行。',stops:[
     {t:'上午',p:'crossiron',n:'CrossIron Mills',s:'市区北面，20 分钟车程'},
     {t:'下午',p:'studiobell',n:'Studio Bell',s:'建筑本身值得看'},
     {t:'—',p:'calgarytower',n:'Calgary Tower',s:'晴天可见落基山轮廓'},
     {t:'—',p:'eauclaire',n:'Eau Claire / Prince Island',s:''},
     {t:'晚',p:'joey',n:'JOEY Eau Claire',s:'江边，饭后散步，需订位'}]},
   {d:'08.31',w:'一',t:'Icefields Parkway + 转场 Kelowna',r:'ice',stay:'Kelowna',drive:9,
    sig:'Bow Lake/Peyto Lake 段信号弱。过 Golden 后恢复正常。',
    note:'全程最长一天：纯驾驶约 8.5 小时，含观景+用餐全天 10 小时起。7:00 出发。Peyto 看完即上路，Golden 后不再停景点。体力不支 → Revelstoke 或 Salmon Arm 加一晚。',stops:[
     {t:'07:00',p:'calgary',n:'出发',s:'比原计划早 30 分钟'},
     {t:'—',p:'bowlake',n:'Bow Lake',s:'路边即停车场'},
     {t:'—',p:'peyto',n:'Peyto Lake',s:'步道数分钟至观景台，坡缓有栏杆。停车场中午满'},
     {t:'—',p:'golden',n:'经 Golden',s:'加油+午饭'},
     {t:'—',p:'revelstoke',n:'经 Revelstoke',s:'退路：体力不支可在此过夜'},
     {t:'—',p:'sicamous',n:'Sicamous 转 97A 南下',s:'离开 Trans-Canada'},
     {t:'—',p:'vernon',n:'经 Vernon',s:'此后沿湖 0.5 小时'},
     {t:'晚',p:'kelowna',n:'Kelowna 入住',s:''}]},
   {d:'09.01',w:'二',t:'Kelowna → Burnaby',r:'bc',stay:'—',drive:4.5,
    sig:'全程正常。',
    note:'两条路线：97C 经 Merritt 转 Coquihalla，4.5 小时，最快。或 Hwy 3 经 Princeton 到 Hope，5.5–6 小时，风景更好、不走 Coquihalla。避开温哥华晚高峰 → 午前上路。',stops:[
     {t:'早',p:'citypark',n:'City Park 湖边散步',s:'平坦步道 30 分钟。或改酒庄'},
     {t:'—',p:'missionhill',n:'Mission Hill（二选一）',s:'建筑+视野最佳，参观需预约'},
     {t:'—',p:'quailsgate',n:'Quails Gate（二选一）',s:'餐厅评价高，湖景座位需订位'},
     {t:'午',p:'merritt',n:'Merritt 加油+午饭',s:'回程唯一完整服务区'},
     {t:'—',p:'burnaby',n:'到家',s:''}]}
  ]},

B:{k:'B',gr:'乙',name:'住进 Banff · 5 天',met:'5 DAYS · 示例 2027.07',hex:'#2E8C9E',tag:'省折返',
  start:'2027-07-15', dates:'2027.07.15 → 07.19',
  pitch:'住 Banff 镇，省去每日 Calgary 往返 2 小时。7 点可达湖边，'
    +'傍晚 Norquay 下山直接回镇用餐。\n\n'
    +'体力正常 → 效率高于方案甲。',
  cons:'Banff 镇旺季住宿贵，同价位 Canmore 高一档，开进来 20 分钟。\n\n'
    +'首末两日仍为 8 小时车程，无法规避。',
  budget:{gas:380,stay:1600,food:800,park:0,shuttle:60,tickets:250,shop:200,misc:250},
  days:[
   {d:'07.15',w:'',t:'Burnaby → Golden',r:'bc',stay:'Golden',drive:8,note:'',stops:[
     {t:'—',p:'zopkios',n:'Zopkios',s:''},{t:'—',p:'kamloops',n:'Kamloops',s:''},{t:'晚',p:'golden',n:'Golden',s:''}]},
   {d:'07.16',w:'',t:'Yoho → Banff',r:'yoho',stay:'Banff 镇',drive:3,note:'Yoho 3 点均路边，无需远走。',stops:[
     {t:'—',p:'naturalbridge',n:'Natural Bridge',s:'停车步行 2 分钟'},
     {t:'—',p:'emerald',n:'Emerald Lake',s:''},
     {t:'—',p:'takakkaw',n:'Takakkaw Falls',s:'两处发夹弯，长车不推荐'},
     {t:'晚',p:'banfftown',n:'Banff 入住',s:''}]},
   {d:'07.17',w:'',t:'两湖日',r:'banff',stay:'Banff 镇',drive:2,note:'班车提前预约。Banff→Park and Ride 约 45 分钟。',stops:[
     {t:'早',p:'parkride',n:'Park and Ride',s:''},
     {t:'—',p:'moraine',n:'Moraine Lake',s:'先去人少处'},
     {t:'—',p:'lakelouise',n:'Lake Louise',s:'Lake Connector 免费接驳'},
     {t:'下午',p:'lakeagnes',n:'Lake Agnes 茶屋（体力允许）',s:'来回 3 小时，仅收现金'}]},
   {d:'07.18',w:'',t:'Banff 周边',r:'banff',stay:'Banff 镇',drive:2,note:'',stops:[
     {t:'早',p:'johnston',n:'Johnston Canyon',s:'9 点前到，否则无车位'},
     {t:'—',p:'minnewanka',n:'Minnewanka Loop',s:''},
     {t:'—',p:'banfftown',n:'镇上 + Bow Falls',s:''},
     {t:'傍晚',p:'vermilion',n:'Vermilion Lakes 日落',s:'距镇 5 分钟'}]},
   {d:'07.19',w:'',t:'Banff → Burnaby',r:'bc',stay:'—',drive:10,note:'单日返程强度高。可拆两日，Kamloops 加一晚。',stops:[
     {t:'—',p:'golden',n:'Golden 中途停',s:''},{t:'—',p:'burnaby',n:'到家',s:''}]}
  ]},

C:{k:'C',gr:'丙',name:'飞过去 4 天 · 落地租车',met:'4 DAYS · 示例 2027.08',hex:'#7A6A8C',tag:'时间紧',
  start:'2027-08-12', dates:'2027.08.12 → 08.15',
  pitch:'YVR→YYC 1.5 小时，落地租车直接进山。省 2 整天驾驶，'
    +'4 天完成方案乙 5 天内容。\n\n'
    +'周末+2 天假 = 可成行。时间紧首选。',
  cons:'机票+租车成本高于自驾，双人约多支出 600–800 CAD。\n\n'
    +'注意异地还车费，YYC 取车高峰需排队。',
  budget:{gas:120,stay:1300,food:700,park:0,shuttle:60,tickets:250,shop:150,misc:1100},
  days:[
   {d:'08.12',w:'',t:'YVR → YYC → Canmore',r:'cal',stay:'Canmore',drive:1.5,note:'订早班机，中午前抵 Canmore。',stops:[
     {t:'—',p:'yyc',n:'落地取车',s:'柜台在航站楼内'},
     {t:'—',p:'canmore',n:'Canmore 入住',s:'低于 Banff，开进公园 20 分钟'}]},
   {d:'08.13',w:'',t:'两湖日',r:'banff',stay:'Canmore',drive:3,note:'班车提前预约。',stops:[
     {t:'早',p:'parkride',n:'Park and Ride',s:''},
     {t:'—',p:'moraine',n:'Moraine Lake',s:''},
     {t:'—',p:'lakelouise',n:'Lake Louise',s:''},
     {t:'下午',p:'emerald',n:'Emerald Lake（顺路）',s:'西向 30 分钟车程'}]},
   {d:'08.14',w:'',t:'Banff 全天',r:'banff',stay:'Canmore',drive:2,note:'',stops:[
     {t:'早',p:'johnston',n:'Johnston Canyon',s:''},
     {t:'—',p:'minnewanka',n:'Minnewanka Loop',s:''},
     {t:'—',p:'banfftown',n:'Banff 镇',s:''},
     {t:'傍晚',p:'norquay',n:'Norquay 观景台',s:''}]},
   {d:'08.15',w:'',t:'Calgary → YVR',r:'cal',stay:'—',drive:1.5,note:'预留还车+值机时间。',stops:[
     {t:'上午',p:'calgary',n:'市区或 outlet',s:''},{t:'—',p:'yyc',n:'还车',s:''}]}
  ]},

D:{k:'D',gr:'丁',name:'深度 8 天 · 含 Jasper',met:'8 DAYS · 示例 2027.07',hex:'#D8A93C',tag:'走完整',
  start:'2027-07-10', dates:'2027.07.10 → 07.17',
  pitch:'加入 Jasper + Icefields Parkway 全程，230 km，'
    +'冰川/湖/瀑布密集分布，慢开需一整天。\n\n'
    +'完整落基山行程。Banff 仅为南段一半。',
  cons:'Jasper 2024 山火后部分区域恢复中，出发前查开放状态+住宿供应。\n\n'
    +'Icefields Parkway 全程无加油站，进入前必须满油。',
  budget:{gas:600,stay:2400,food:1200,park:0,shuttle:60,tickets:500,shop:250,misc:350},
  days:[
   {d:'07.10',w:'',t:'Burnaby → Golden',r:'bc',stay:'Golden',drive:8,note:'',stops:[{t:'—',p:'kamloops',n:'Kamloops',s:''},{t:'晚',p:'golden',n:'Golden',s:''}]},
   {d:'07.11',w:'',t:'Yoho → Lake Louise',r:'yoho',stay:'Lake Louise',drive:2,note:'',stops:[
     {t:'—',p:'emerald',n:'Emerald Lake',s:''},{t:'—',p:'takakkaw',n:'Takakkaw Falls',s:''}]},
   {d:'07.12',w:'',t:'两湖日',r:'banff',stay:'Lake Louise',drive:1,note:'住村内距 Park and Ride 最近。',stops:[
     {t:'早',p:'moraine',n:'Moraine Lake',s:''},{t:'—',p:'lakelouise',n:'Lake Louise',s:''}]},
   {d:'07.13',w:'',t:'Icefields Parkway → Jasper',r:'ice',stay:'Jasper',drive:5,note:'230 km 全程无加油站，出发前满油。分 5–6 次停靠。',stops:[
     {t:'—',p:'bowlake',n:'Bow Lake',s:''},
     {t:'—',p:'peyto',n:'Peyto Lake',s:''},
     {t:'—',p:'icefield',n:'哥伦比亚冰原',s:'冰上车提前订'},
     {t:'—',p:'athabascafalls',n:'Athabasca Falls',s:''},
     {t:'晚',p:'jasper',n:'Jasper 入住',s:'暗夜保护区，晴天见银河'}]},
   {d:'07.14',w:'',t:'Jasper 周边',r:'ice',stay:'Jasper',drive:3,note:'',stops:[
     {t:'—',p:'maligne',n:'Maligne Lake',s:'Spirit Island 船票提前订'}]},
   {d:'07.15',w:'',t:'Jasper → Banff',r:'banff',stay:'Banff 镇',drive:5,note:'原路返回，光线不同，值得再停。',stops:[
     {t:'—',p:'icefield',n:'冰原（回程再看）',s:''},{t:'晚',p:'banfftown',n:'Banff',s:''}]},
   {d:'07.16',w:'',t:'Banff 全天',r:'banff',stay:'Banff 镇',drive:2,note:'',stops:[
     {t:'早',p:'johnston',n:'Johnston Canyon',s:''},{t:'—',p:'minnewanka',n:'Minnewanka Loop',s:''},
     {t:'傍晚',p:'norquay',n:'Norquay',s:''}]},
   {d:'07.17',w:'',t:'Banff → Burnaby',r:'bc',stay:'—',drive:10,note:'过累 → Kamloops 加一晚。',stops:[{t:'—',p:'burnaby',n:'到家',s:''}]}
  ]},

E:{k:'E',gr:'戊',name:'冬季滑雪 7 天 · Kicking Horse + SkiBig3',met:'7 DAYS · 示例 2028.02',hex:'#1F6FA8',tag:'雪季',
  start:'2028-02-05', dates:'2028.02.05 → 02.11',
  pitch:'冬季专攻滑雪。Golden 滑 2 天 Kicking Horse，再进 Banff 滑 SkiBig3。\n\n'
    +'Kicking Horse 落差 1260 m，陡峭碗状地形著称。SkiBig3 = Sunshine + Lake Louise + Norquay，'
    +'一票通刷，免费班车串联各雪场+Banff 镇。',
  cons:'冬季 Moraine Lake Road 全封，湖不可达。Icefields Parkway 冬季服务点关闭，'
    +'路况差，不推荐自驾。\n\n'
    +'Rogers Pass 冬季常因雪崩控制临时封路，行程需留缓冲，末日不排回程。\n\n'
    +'各雪场不在 Epic 内，按季票价单独购买。通票归属每年变动，出发前官网核实。',
  budget:{gas:400,stay:2000,food:1000,park:0,shuttle:0,tickets:1800,shop:300,misc:500},
  days:[
   {d:'02.05',w:'',t:'Burnaby → Golden',r:'bc',stay:'Golden',drive:9,note:'冬季路况慢，比夏季多留 1 小时。查 DriveBC 的 Coquihalla/Rogers Pass 状态。',stops:[
     {t:'—',p:'kamloops',n:'Kamloops',s:'冬季常有雪'},{t:'晚',p:'golden',n:'Golden',s:''}]},
   {d:'02.06',w:'',t:'Kicking Horse D1',r:'ski',stay:'Golden',drive:0.5,note:'先摸地形，不直接冲碗状区。',stops:[
     {t:'—',p:'kicking',n:'Kicking Horse',s:'落差 1260 m，初学者选择少'}]},
   {d:'02.07',w:'',t:'Kicking Horse D2',r:'ski',stay:'Golden',drive:0.5,note:'',stops:[{t:'—',p:'kicking',n:'Kicking Horse',s:''}]},
   {d:'02.08',w:'',t:'Golden → Banff',r:'banff',stay:'Banff 镇',drive:2.5,note:'转场日，下午抵 Banff，取雪票。',stops:[
     {t:'—',p:'banfftown',n:'Banff 入住',s:'住镇内可坐免费班车至 3 雪场'}]},
   {d:'02.09',w:'',t:'Sunshine Village',r:'ski',stay:'Banff 镇',drive:0.5,note:'雪质最干，海拔高。',stops:[
     {t:'—',p:'sunshine',n:'Banff Sunshine',s:'缆车从停车场上雪村'}]},
   {d:'02.10',w:'',t:'Lake Louise 雪场',r:'ski',stay:'Banff 镇',drive:1,note:'面积最大，前后山差异明显。风大时背面关闭。',stops:[
     {t:'—',p:'lakelouiseski',n:'Lake Louise',s:''}]},
   {d:'02.11',w:'',t:'Norquay 半天 → 回程',r:'bc',stay:'—',drive:9,note:'Norquay 最近，滑半天中午出发。冬季回程务必留缓冲。',stops:[
     {t:'早',p:'norquayski',n:'Mt Norquay',s:'规模小，适合半天'},
     {t:'—',p:'burnaby',n:'回家',s:''}]}
  ]}
};

const BROWS=[
 {k:'gas', n:'油费', s:'往返约 1500 km · 9 L/100km · 1.7 CAD/L', max:1200},
 {k:'stay',n:'住宿', s:'Golden / Calgary / Banff / Canmore', max:4000},
 {k:'food',n:'餐饮', s:'Banff 镇内价格高于 Calgary 约 30%', max:2500},
 {k:'park',n:'国家公园门票', s:'2026.06.19–09.07 由 Canada Strong Pass 覆盖', max:400},
 {k:'shuttle',n:'班车 · 停车', s:'Parks Canada 班车 + Lake Louise 停车', max:400},
 {k:'tickets',n:'门票 · 雪票 · 活动', s:'冰原车 / Calgary Tower / 雪票', max:3000},
 {k:'shop',n:'购物', s:'Outlet + 手信', max:2000},
 {k:'misc',n:'机票 · 租车 · 杂项', s:'方案丙专属。含保险+过路费', max:2500}
];

const TODOS=[
 {id:'b1',n:'抢 Moraine Lake 班车（最优先）',s:'出发前 2 日 08:00 MT（温哥华 07:00）放 60% 票额。预先登录账号，确定湖点+人数，勿现场填写',due:'出发前 2 天',v:'ABCD'},
 {id:'b2',n:'确认国家公园门票',s:'2026.06.19–09.07 Canada Strong Pass 免费入园。其余时段需购日票/年票，班车票不含门票',due:'现在',v:'ABCDE'},
 {id:'b3',n:'订住宿',s:'Banff 镇 + Lake Louise 村旺季极紧张。同价位 Canmore 通常高一档',due:'现在',v:'ABCDE'},
 {id:'b4',n:'订餐厅',s:'Farm and Fire / Fairmont 湖景餐厅 / JOEY 均需订位。Golden 的 Wolfs Den 旺季需等位',due:'出发前 1 周',v:'ABCD'},
 {id:'b5',n:'车检 + 加油策略',s:'查胎压/机油/雨刮。Icefields Parkway 全程无加油站。Coquihalla 段油价高，Kamloops 加油最划算',due:'出发前',v:'ABDE'},
 {id:'b6',n:'查 DriveBC 路况',s:'Coquihalla/Rogers Pass 全年可能因施工或雪崩控制封路。出发前夜+当日早晨各查一次',due:'出发当天',v:'ABDE'},
 {id:'b7',n:'下载离线地图',s:'Rogers Pass/Icefields Parkway/Park and Ride 大段无信号。班车预约截图存本地',due:'出发前',v:'ABCDE'},
 {id:'b8',n:'订机票和租车',s:'注意异地还车费，YYC 取车高峰需排队',due:'现在',v:'C'},
 {id:'b9',n:'订雪票和装备',s:'SkiBig3 三山通票、Kicking Horse 单独购买。租装备需预报身高/体重/脚长',due:'出发前 1 月',v:'E'},
 {id:'b10',n:'冬季轮胎 + 应急包',s:'BC 省山区 10 月–次年 4 月强制冬季胎/链条。车载毯子/水/充电宝',due:'出发前',v:'E'},
 {id:'b11',n:'防熊 + 野生动物',s:'不下车接近动物，路边停车不挡道。徒步携带防熊喷雾，Johnston Canyon 一带常见',due:'出发前',v:'ABCD'},
 {id:'b12',n:'携带现金',s:'Lake Agnes 茶屋仅收现金，部分小镇店铺同样',due:'出发前',v:'BD'}
];

/* ══════ 每晚住宿 + 餐饮 ══════
   方向 + 筛选条件，非具体房源清单。q = Booking/Google 搜索词。 */
const STAY={
 'Golden':{area:'Golden, BC',nav:'Golden BC',
  opts:[{n:'1 号公路边连锁酒店',tier:'$$',pick:true,q:'Golden BC hotel highway 1',
    why:'进出方便，早晨无需绕镇。本次预订 Holiday Inn Express Golden-Kicking Horse 位于此区。'},
   {n:'镇中心小旅馆',tier:'$',q:'Golden BC downtown motel',
    why:'步行可达餐厅，价格低一档，停车位少。'},
   {n:'Kicking Horse 山脚',tier:'$$$',q:'Kicking Horse Mountain Resort lodging',
    why:'冬季滑雪值得，夏季距镇远。'}],
  food:[{n:'The Wolfs Den',jp:'The Wolfs Den Golden BC',why:'野牛肋排招牌。旺季需等位，进镇前致电。'},
   {n:'Ethos Cafe',jp:'Ethos Cafe Golden BC',why:'早餐+外带咖啡。次日出发前采购。'},
   {n:'Raven + Pine',jp:'Raven and Pine Golden BC',why:'Wolfs Den 满位时的备选。'}]},

 'Calgary':{area:'Downtown Calgary',nav:'Hilton Garden Inn Calgary Downtown',
  opts:[{n:'Downtown（Eau Claire 一带）',tier:'$$',pick:true,q:'Downtown Calgary hotel Eau Claire',
    why:'晚饭+江边散步步行可达，无需驾车。本次预订 Hilton Garden Inn Downtown 位于此区。'},
   {n:'机场 / 北区',tier:'$',q:'Calgary airport hotel',
    why:'价低，距 CrossIron Mills 近，夜间无步行区域。'},
   {n:'西区（往 Banff 方向）',tier:'$$',q:'Calgary west hotel Bow Trail',
    why:'每日进山省 20 分钟，代价：距市中心远。'}],
  food:[{n:'JOEY Eau Claire',jp:'JOEY Eau Claire Calgary',why:'江边连锁，出品稳定，需订位。饭后沿 Bow River 散步。'},
   {n:'Stephen Avenue 一带',jp:'Stephen Avenue Calgary restaurants',why:'步行街，选择多，适合临时决定。'},
   {n:'Alberta 牛排',jp:'steakhouse Calgary',why:'当地特色。人均价高，需订位。'}]},

 'Banff 镇':{area:'Town of Banff',nav:'Banff AB',
  opts:[{n:'Banff Ave 步行范围内',tier:'$$$',pick:true,q:'Banff Avenue hotel',
    why:'7 点可达湖边，夜间步行返回用餐。冬季可坐免费班车至 3 雪场。旺季价高。'},
   {n:'Tunnel Mountain 一带',tier:'$$',q:'Tunnel Mountain Banff accommodation',
    why:'距镇中心车程 5 分钟，价低一档，有免费 Roam 公交。'},
   {n:'Canmore（公园外）',tier:'$$',q:'Canmore Alberta hotel',
    why:'同价位通常高一档，开进 Banff 20 分钟。三姐妹峰在镇后。'}],
  food:[{n:'Farm and Fire',jp:'Farm and Fire Banff',why:'柴火烤炉，晚市需订位。'},
   {n:'Banff Social',jp:'Banff Social Banff Ave',why:'菜单杂，出餐快。适合带长辈，等位短。'},
   {n:'Seoul Korean Restaurant',jp:'Seoul Korean Restaurant Banff',why:'网友实测：味道中规中矩，牛尾汤偏腻，冷面一般，菜量小。人均约 40 CAD，为该行程最贵一餐。'},
   {n:'Banff Ave 自选',jp:'restaurants Banff Avenue',why:'主街一条走完。旺季 19 点后普遍需等位。'}]},

 'Canmore':{area:'Canmore, Alberta',nav:'Canmore AB',
  opts:[{n:'主街 Main Street 附近',tier:'$$',pick:true,q:'Canmore Main Street hotel',
    why:'国家公园门外，免园区停车费，开进 Banff 20 分钟。餐厅密度高。'}],
  food:[{n:'Rocky Mountain Pizza',jp:'Rocky Mountain Flatbread Canmore',why:'网友实测：用料足，薄饼皮带炭火香。8 寸牛肉披萨约 37 CAD。'},
   {n:'Ramen Arashi',jp:'Ramen Arashi Canmore',why:'网友实测：汤头第一口惊艳，久喝略腻。炸鸡一般。人均约 20 CAD。'},
   {n:'Canmore 主街',jp:'restaurants Main Street Canmore',why:'价低于 Banff，本地客源多。'}]},

 'Lake Louise':{area:'Lake Louise Village',nav:'Lake Louise Village AB',
  opts:[{n:'Lake Louise 村内',tier:'$$$',pick:true,q:'Lake Louise Village hotel',
    why:'距 Park and Ride 最近，早班车最省事。房源少，价高。'},
   {n:'退一步：Field 或 Golden',tier:'$$',q:'Field BC accommodation',
    why:'Field 位于 Yoho 内，至 Park and Ride 20 分钟，价格差一大截。'}],
  food:[{n:'Bill Peytos Cafe',jp:'Bill Peytos Cafe Lake Louise',why:'村内青旅餐厅，价低于湖边。'},
   {n:'村内超市自备',jp:'Lake Louise village grocery',why:'湖边无平价餐食，晨间购三明治带上山。'}]},

 'Jasper':{area:'Jasper, Alberta',nav:'Jasper AB',
  opts:[{n:'镇中心',tier:'$$',pick:true,q:'Jasper Alberta hotel downtown',
    why:'2024 山火后住宿供应恢复中，出发前确认。暗夜保护区，晴天见银河。'}],
  food:[{n:'Patricia Street 一带',jp:'restaurants Patricia Street Jasper',why:'镇上餐厅集中于此两条街。'}]},

 'Kamloops':{area:'Kamloops, BC',
  opts:[{n:'1 号公路边连锁酒店',tier:'$',pick:true,q:'Kamloops BC hotel highway',
    why:'仅过夜，进出方便优先。'},
   {n:'市中心 Victoria Street 一带',tier:'$$',q:'Kamloops downtown hotel',
    why:'餐厅步行可达，想吃好一点选此区。'}],
  food:[{n:'Maaza Indian Kitchen',jp:'Maaza Indian Kitchen Kamloops',why:'网友实测：lamb korma 出色，配 garlic naan。烧烤拼盘+羊肉炒饭量大。人均约 25 CAD。'},
   {n:'Victoria Street 一带',jp:'restaurants Victoria Street Kamloops',why:'镇上餐厅集中于此街。'},
   {n:'Red Collar Brewing',jp:'Red Collar Brewing Kamloops',why:'本地精酿。驾车者不饮酒。'}]},

 'Kelowna':{area:'Kelowna, BC',nav:'Kelowna BC',
  opts:[{n:'市中心（近 City Park / 湖滨）',tier:'$$',pick:true,q:'Downtown Kelowna hotel lakefront',
    why:'次晨湖边散步步行可达，免再上车。餐饮密度高。'},
   {n:'Hwy 97 沿线连锁',tier:'$',q:'Kelowna Highway 97 hotel',
    why:'价低，进出快。夜间无步行区域。'},
   {n:'西岸酒庄区（West Kelowna）',tier:'$$$',q:'West Kelowna winery accommodation',
    why:'靠近 Mission Hill/Quails Gate，次日直接出发。离市区 20 分钟。'}],
  food:[{n:'Zabb Thai Restaurant',jp:'Zabb Thai Restaurant Kelowna',why:'网友实测：satay 与菠萝炒饭香，penang 咖喱浓郁。beef pad 略咸。人均约 20 CAD。'},
   {n:'湖滨 Bernard Ave 一带',jp:'restaurants Bernard Avenue Kelowna',why:'市中心主街，选择最多。'},
   {n:'Quails Gate 酒庄餐厅',jp:'Quails Gate Winery restaurant',why:'湖景座位需订位。次日午餐可选。'}]},
 'Merritt 中途':{area:'Merritt, BC',nav:'Merritt BC',
  opts:[],
  food:[{n:'Cocos Restaurant',jp:'Cocos Restaurant Merritt BC',why:'网友实测：炸鸡外脆内嫩量足，寿司食材新鲜，house roll 评价高。人均约 20 CAD。'}]},
 '机上':{area:'',opts:[],food:[]}
};
