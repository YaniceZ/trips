/* ══════════════════════════════════════════════════════════════
   content.js — 这个行程的所有文字都在这里。
   改字只动这个文件，index.html 一行都不用碰。

   三条规矩：
   1. 单引号 ' 里不能再出现单引号。中文用「」。
   2. 每一项结尾的逗号别删。
   3. 改完提交，半分钟后刷新。白屏就按 F12 看 Console 红字。

   目录：
     LABELS / TXT  界面词与成段说明
     REG / P       区域与地点
     TIMING        季节表
     V             五套方案，每天 drive 是当天开车小时数
     BROWS         预算科目
     TODOS         行前待办
     STAY          每晚住宿方向与吃饭（文件最下面）
   ══════════════════════════════════════════════════════════════ */

const LABELS={
  cost:'Cost', drive:'开车强度', season:'什么时候去', weather:'天气',
  routes:'五套方案', switchPlan:'换一套看看', places:'沿途地点',
  ourPins:'加的点', bookings:'预订', prepList:'行前待办',
  reconcile:'实付对账', fx:'汇率', rules:'两条硬规则', compare:'五套方案的区别',
  aboutPage:'这个页面'
};

const TXT={
  season:
    '夏季（6 月中 → 9 月中）湖水最蓝、道路全通，也是最挤的时候。'
    +'<br><br>9 月中到 10 月上旬是落叶松变金的窗口，人明显少，但 Moraine Lake Road 10 月 12 日左右就关到明年 6 月。'
    +'<br><br>冬天（12 月 → 3 月）滑雪季，Icefields Parkway 冬季路况差、服务点关闭，'
    +'Moraine Lake 完全进不去。冬天来就专心滑雪，别惦记湖。',

  drive:
    '横条是每天的开车小时数。<b>超过 5 小时的那天会标红</b>——带长辈或一个人开的话，'
    +'那几天要多留休息站，别压到天黑。'
    +'<br><br>温哥华到 Golden 全程约 750 公里，正常 8 小时，遇施工或雨雪要加一到两小时。',

  wxNote:
    '降水单位 mm。7 天预报现在没用，出发前一周开始每天看。上面那栏是去年同期实测。'
    +'落基山昼夜温差大，八月底白天二十度出头、清晨可能只有五六度，湖边风更冷。'
    +'数据 Open-Meteo（CC BY 4.0）。',

  itinHint: '点任意一天，地图跟随。左侧数字是当天开车小时数，红色表示超过 5 小时。',

  pinsEmpty:
    '还没人加过点。把行程码发给同行的人，你们加的餐厅、观景点、想住的地方会互相同步。'
    +'地图上长按也能直接落点。',

  bookingIntro:
    '这一栏是记录，不是建议。订好一项就打勾，填确认号和实付金额，同行的人都看得到，预算页会自动对账。',

  prepIntro:
    '按当前方案过滤。<b>Moraine Lake 的班车预约是唯一没有替代方案的一项</b>，其余都能临时补。',

  budgetNote:
    '全部按加元计。数字是估算，可以拖。'
    +'<br><br>油费按往返约 1500 公里、百公里 9 升、每升 1.7 加元估的，实际看车。'
    +'国家公园门票在 2026 年 6 月 19 日至 9 月 7 日之间由 Canada Strong Pass 覆盖，那段时间进园免费。'
    +'Lake Louise 湖边停车旺季每车 42 加元，坐班车停 Park and Ride 则免费。',

  noteHint: '写点只有到了才知道的：几点没人、停车位好不好找、哪家关门了、哪里我写错了。这条会显示在我的描述上面。',

  aboutPage:
    '行程码决定你看到哪份数据。你和同行的人用同一个码，加的点会互相同步；换一个没人用过的码，就是一份空白行程，朋友也能这样拿去建自己的。',
  aboutFoot:
    '共享数据对所有知道行程码的人可见。坐标为示意精度，班车时刻、票价与开放状态以 Parks Canada 当日公告为准。'
};

/* ── 两条硬规则 ── */
const RULES=[
 ['Moraine Lake 不能开车进去','自 2023 年起 Moraine Lake Road 全年禁止私家车，持无障碍停车证也不例外。只能坐 Parks Canada 班车、持牌商业车、Roam 公交，或骑车（单程 12.5 公里、爬升约 250 米）。'],
 ['班车必须提前预约，且分两次放票','2026 年 4 月 15 日放出全季 40% 的票，剩下 60% 在出发日前两天早 8 点（山区时间）滚动放出。热门时段几分钟内售罄，现场碰运气基本没戏。'],
 ['一张票管两个湖','Parks Canada 的班车票含两湖之间的 Lake Connector 接驳，以及回 Park and Ride 的返程。预约时选的那个湖是你必须先到的。'],
 ['Lake Louise 可以开车但停车贵且难','湖边停车场旺季每车 42 加元，3am–7pm 收费，且经常早上就满。坐班车停 Park and Ride 免费。'],
 ['门票和班车票是两回事','班车票不含国家公园门票。2026 年 6 月 19 日至 9 月 7 日 Canada Strong Pass 期间进园免费，其余时间要单独买。']
];

/* ── 五套方案的区别 ── */
const COMPARE=[
 ['甲 · 父母 6 天','开车往返，节奏最松，每天景点不超过三个，住宿只换两处。适合带长辈或第一次去。'],
 ['乙 · 经典 5 天','住进 Banff 镇里，省掉每天往返 Calgary 的两小时。适合两三个人自己去。'],
 ['丙 · 飞过去 4 天','温哥华飞 Calgary 一个半小时，落地租车。省下两天开车，代价是机票和租车费。周末能凑出来的最优解。'],
 ['丁 · 深度 8 天','加进 Jasper 和 Icefields Parkway 全程，含哥伦比亚冰原。这条才算把落基山走完整。'],
 ['戊 · 冬季滑雪 7 天','Kicking Horse 加 SkiBig3。冬天湖都封了，行程重心完全不同。']
];

/* ══════ 区域与地点 ══════ */
const REG={bc:{n:'BC 段',hex:'#2F6B4F'},yoho:{n:'Yoho',hex:'#2E8C9E'},
           banff:{n:'Banff',hex:'#C0392B'},cal:{n:'Calgary',hex:'#7A6A8C'},
           ice:{n:'Icefields',hex:'#D8A93C'},ski:{n:'雪场',hex:'#1F6FA8'}};
const P={};
const def=(id,zh,en,lat,lng,r,note)=>P[id]={id,zh,en,lat,lng,r,note};

/* — BC 段 — */
def('burnaby','Burnaby 出发','Burnaby BC',49.2488,-122.9805,'bc','出发前把油加满、胎压看一眼。Coquihalla 上没有便宜的加油站。');
def('zopkios','Zopkios 休息区','Zopkios Rest Area',49.6017,-121.0972,'bc','Coquihalla 最高点附近，有厕所和大片停车位。开了两小时左右到这儿，正好下车走走。');
def('kamloops','Kamloops','Kamloops BC',50.6745,-120.3273,'bc','全程中点。要加油、要吃正餐就在这里停，之后到 Golden 之间选择变少。');
def('kamloopslake','Kamloops Lake 观景点','Kamloops Lake Rest Area',50.7300,-120.6800,'bc','1 号公路沿湖那段，几个路边观景台都能停。');
def('revelstoke','Revelstoke','Revelstoke BC',50.9981,-118.1957,'bc','进 Rogers Pass 前最后一个像样的镇子。');
def('rogers','Rogers Pass','Rogers Pass',51.3011,-117.5197,'bc','海拔 1330 米，冬天雪崩控制常临时封路。夏天路况好，山景是全程最好的一段之一。');
def('golden','Golden','Golden BC',51.2965,-116.9631,'bc','落基山西侧的小镇，往返都在这里过夜。镇子不大，晚上餐厅关得早。');
def('wolfsden','The Wolfs Den','The Wolfs Den Golden',51.2967,-116.9648,'bc','Golden 的老馆子，野牛肋排是招牌。旺季晚上要等位，进镇前打个电话。');
def('ethos','Ethos Cafe','Ethos Cafe Golden',51.2977,-116.9639,'bc','早餐和外带咖啡。第二天出发前买好，路上湖边吃。');
def('kicking','Kicking Horse 雪场','Kicking Horse Mountain Resort',51.2981,-117.0489,'ski','Golden 边上，落差 1260 米，加拿大最大之一。以陡峭的碗状地形和树林道著称，初学者选择少。');

/* — Yoho — */
def('emerald','Emerald Lake','Emerald Lake',51.4432,-116.5289,'yoho','环湖步道 5.2 公里、约 1 小时，也可以只走前十分钟到桥上看。停车场不大，十点后会满。');
def('naturalbridge','Natural Bridge','Natural Bridge Yoho',51.3892,-116.5044,'yoho','去 Emerald Lake 的路上，停车走两分钟就到。Kicking Horse 河把岩层冲出一个洞。');
def('takakkaw','Takakkaw Falls','Takakkaw Falls',51.4989,-116.4772,'yoho','254 米落差。上去的路有两个发夹弯，长车不建议。六月到十月初开放。');

/* — Lake Louise / Moraine — */
def('parkride','Lake Louise Park and Ride','Lake Louise Park and Ride',51.4419,-116.1547,'banff','在 Lake Louise 滑雪场停车场。有班车预约的话停车免费，所有常规班车从这里发。');
def('lakelouise','Lake Louise 湖边','Lake Louise Lakeshore',51.4254,-116.1773,'banff','湖边平路来回 4 公里，长辈走前半段到城堡酒店那侧就够。湖边停车旺季每车 42 加元且常满。');
def('moraine','Moraine Lake','Moraine Lake',51.3217,-116.1860,'banff','十峰谷。私家车全年禁行，只能坐班车。观景的 Rockpile 是一段短而陡的碎石台阶，扶手齐全。');
def('billpeytos','Bill Peytos Cafe','Bill Peytos Cafe Lake Louise',51.4258,-116.1858,'banff','Lake Louise 村里的青旅餐厅，价格比湖边正常，人也少。');
def('fairmontll','Fairmont 城堡酒店','Fairmont Chateau Lake Louise',51.4166,-116.2180,'banff','湖景餐厅要提前订位，且要先解决停车。不订位的话大堂咖啡也能坐。');
def('lakeagnes','Lake Agnes 茶屋','Lake Agnes Tea House',51.4306,-116.2394,'banff','单程 3.5 公里、爬升 400 米，来回三小时。只收现金。带长辈的话不建议。');

/* — Banff — */
def('banfftown','Banff 小镇','Banff Town',51.1784,-115.5708,'banff','主街 Banff Ave 从头走到尾二十分钟。镇里停车位紧张，Bear Street 停车楼最省事。');
def('cascade','Cascade of Time Garden','Cascade of Time Garden',51.1706,-115.5688,'banff','公园管理局大楼后面的花园，坡缓、有长椅，八月底花还在。免费。');
def('surprise','Surprise Corner 观景台','Surprise Corner Viewpoint',51.1697,-115.5578,'banff','拍 Fairmont Banff Springs 城堡的经典机位，路边停车走两步。');
def('pedbridge','Banff 步行桥','Banff Pedestrian Bridge',51.1729,-115.5695,'banff','跨 Bow River，桥上看 Cascade Mountain。和上面两处都在步行范围内，一小时能走完。');
def('bowfalls','Bow Falls','Bow Falls',51.1667,-115.5622,'banff','落差不大但水量足，观景台离停车场几十米。');
def('minnewanka','Minnewanka Loop','Lake Minnewanka Loop',51.2417,-115.5000,'banff','约 24 公里的环形景观车道，清早常见到大角羊和麋鹿。开完一圈四十分钟，不下车也值。');
def('twojack','Two Jack Lake','Two Jack Lake',51.2258,-115.5136,'banff','Minnewanka 环线上，湖面平静时能倒映 Mount Rundle。日出机位。');
def('norquay','Mount Norquay 观景台','Mount Norquay Lookout',51.2000,-115.5967,'banff','盘山公路直接开到，免费，能俯瞰整个 Banff 镇和 Bow Valley。日落前一小时最好，人比缆车少得多。');
def('vermilion','Vermilion Lakes','Vermilion Lakes',51.1786,-115.6042,'banff','离镇中心五分钟，日落和日出都好。路边可停，晚上常有麋鹿。');
def('johnston','Johnston Canyon','Johnston Canyon',51.2450,-115.8394,'banff','栈道贴着峡谷壁，到下瀑布单程 1.1 公里、路面平整。停车场九点前就满，要么早去要么傍晚去。');
def('farmfire','Farm and Fire','Farm and Fire Banff',51.1760,-115.5713,'banff','Banff 镇上的柴火烤炉餐厅，晚市要订位。');
def('banffsocial','Banff Social','Banff Social',51.1755,-115.5715,'banff','主街上，菜单杂但出餐快，适合带长辈不想等。');

/* — Icefields Parkway / Jasper — */
def('bowlake','Bow Lake','Bow Lake',51.6706,-116.4622,'ice','Icefields Parkway 上第一个大湖，路边就是停车场，不用走路。');
def('peyto','Peyto Lake','Peyto Lake',51.7167,-116.5167,'ice','停车后沿铺装步道走约 15 分钟到观景台，坡缓有栏杆。湖形像一只狐狸。停车场中午会满。');
def('icefield','哥伦比亚冰原','Columbia Icefield',52.2203,-117.2264,'ice','Athabasca 冰川就在路边。冰上车和玻璃栈道要提前订，不上冰的话在游客中心对面看也够。');
def('athabascafalls','Athabasca Falls','Athabasca Falls',52.6644,-117.8836,'ice','水量很大，栈道短，十五分钟看完。');
def('jasper','Jasper 镇','Jasper AB',52.8737,-118.0814,'ice','比 Banff 安静，暗夜保护区，晴天晚上能看到银河。2024 年山火后部分区域仍在恢复，出发前查开放状态。');
def('maligne','Maligne Lake','Maligne Lake',52.7233,-117.6428,'ice','去 Spirit Island 要坐船，单程 90 分钟往返，要提前订。');

/* — Calgary — */
def('calgary','Calgary 市中心','Downtown Calgary',51.0447,-114.0719,'cal','住 Downtown 的好处是晚饭和散步都在步行范围，缺点是每天进出落基山各一小时。');
def('crossiron','CrossIron Mills','CrossIron Mills',51.2189,-114.0022,'cal','Calgary 北面的大型 outlet，离机场十分钟。下雨天或走不动的那天用来兜底。');
def('studiobell','Studio Bell 国家音乐中心','Studio Bell',51.0450,-114.0553,'cal','建筑本身就值得看。室内，适合天气不好的下午。');
def('calgarytower','Calgary Tower','Calgary Tower',51.0447,-114.0631,'cal','191 米，玻璃地板。晴天能看到落基山的轮廓。');
def('eauclaire','Eau Claire / Prince Island','Eau Claire Calgary',51.0533,-114.0700,'cal','Bow River 边的公园和步道，饭后散步刚好。');
def('joey','JOEY Eau Claire','JOEY Eau Claire Calgary',51.0530,-114.0708,'cal','江边连锁，出品稳定，适合不想踩雷的一晚。要订位。');
def('yyc','Calgary 机场','YYC Calgary International Airport',51.1315,-114.0106,'cal','温哥华飞过来约一个半小时。租车柜台在航站楼里。');
def('canmore','Canmore','Canmore AB',51.0884,-115.3479,'banff','在国家公园门外，住宿比 Banff 便宜不少，开进 Banff 二十分钟。三姐妹峰就在镇后面。');

/* — 雪场（方案戊） — */
def('sunshine','Banff Sunshine Village','Banff Sunshine Village',51.0783,-115.7761,'ski','雪质最干，海拔高、季节长。要坐缆车从停车场上到雪村。');
def('lakelouiseski','Lake Louise 雪场','Lake Louise Ski Resort',51.4419,-116.1547,'ski','面积最大，前后山地形差异明显。背面（Back Bowls）风大时会关。');
def('norquayski','Mt Norquay 雪场','Mt Norquay',51.2003,-115.5964,'ski','离 Banff 镇最近，规模小但有夜滑。适合半天或热身。');
def('nakiska','Nakiska','Nakiska Ski Area',50.9425,-115.1550,'ski','Kananaskis 里，1988 冬奥场地，离 Calgary 最近。人少，以压雪道为主。');

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
A:{k:'A',gr:'甲',name:'父母 6 天 · 开车往返',met:'6 DAYS · 2026.08.27',hex:'#C0392B',tag:'这次',
  dates:'2026.08.27 → 09.01',
  pitch:'开车往返，去程和回程各在 Golden 歇一晚，中间三晚都在 Calgary 不挪窝。\n\n'
    +'每天景点不超过三个，步行都控制在一小时以内，最长的一段路留给第一天和最后一天。'
    +'中间那个购物日是故意留的——连着看几天山，长辈会累。',
  cons:'住 Calgary 的代价是每天进出落基山各一小时左右。想省掉这段就看方案乙，住进 Banff 镇里。\n\n'
    +'第二天是全程最满的一天：两个湖加一段三小时的车程，早饭要在车上吃。',
  budget:{gas:420,stay:1400,food:900,park:0,shuttle:60,tickets:220,shop:600,misc:300},
  days:[
   {d:'08.27',w:'四',t:'Burnaby → Golden',r:'bc',stay:'Golden',drive:8,note:'约 750 公里。Coquihalla 转 1 号公路。出发前加满油。',stops:[
     {t:'早',p:'burnaby',n:'出发',s:'尽量 7 点前上路，避开高峰'},
     {t:'—',p:'zopkios',n:'Zopkios 休息区',s:'开两小时左右到，下车走走'},
     {t:'午',p:'kamloops',n:'Kamloops 加油 + 午饭',s:'全程中点，之后选择变少'},
     {t:'—',p:'rogers',n:'Rogers Pass',s:'山景最好的一段'},
     {t:'晚',p:'wolfsden',n:'The Wolfs Den',s:'野牛肋排。旺季要等位，进镇前打电话'}]},
   {d:'08.28',w:'五',t:'湖泊日 · Emerald → Lake Louise → Moraine → Calgary',r:'yoho',stay:'Calgary',drive:5,note:'全程最满的一天。班车预约要提前打印或截图，Park and Ride 手机信号不稳。',stops:[
     {t:'07:30',p:'ethos',n:'Ethos Cafe 带早餐',s:'路上吃'},
     {t:'08:30',p:'emerald',n:'Emerald Lake',s:'环湖 5.2 公里约一小时；只走前十分钟到桥上也行'},
     {t:'11:00',p:'parkride',n:'Park and Ride 换班车',s:'停车免费，按预约时段提前十五分钟到'},
     {t:'—',p:'lakelouise',n:'Lake Louise 湖边',s:'平路，长辈走到城堡酒店那侧就够'},
     {t:'—',p:'moraine',n:'Moraine Lake',s:'Rockpile 是短而陡的碎石台阶，有扶手'},
     {t:'13:30',p:'billpeytos',n:'午饭',s:'村里的 Bill Peytos 比湖边便宜也不挤'},
     {t:'16:00',p:'calgary',n:'开往 Calgary',s:'约 3 小时'}]},
   {d:'08.29',w:'六',t:'Banff 日',r:'banff',stay:'Calgary',drive:3.5,note:'清早出发能在 Minnewanka 环线上看到动物。镇上三处景点步行可达。',stops:[
     {t:'07:30',p:'minnewanka',n:'Minnewanka Loop',s:'24 公里环线，开一圈四十分钟'},
     {t:'—',p:'twojack',n:'Two Jack Lake',s:'湖面平静时倒映 Rundle 山'},
     {t:'10:30',p:'cascade',n:'Cascade of Time Garden',s:'坡缓有长椅，免费'},
     {t:'—',p:'surprise',n:'Surprise Corner',s:'拍城堡酒店的机位'},
     {t:'—',p:'pedbridge',n:'Banff 步行桥',s:'三处走完不到一小时'},
     {t:'12:30',p:'farmfire',n:'午饭',s:'Farm and Fire 或 Banff Social，都要订位'},
     {t:'17:30',p:'norquay',n:'Mount Norquay 观景台',s:'开车直达，免费，日落前一小时最好'}]},
   {d:'08.30',w:'日',t:'休息购物日 · Calgary',r:'cal',stay:'Calgary',drive:1,note:'连看几天山之后的缓冲。下雨的话整天都在室内。',stops:[
     {t:'上午',p:'crossiron',n:'CrossIron Mills',s:'市区北面，开二十分钟'},
     {t:'下午',p:'studiobell',n:'Studio Bell',s:'建筑本身就值得看'},
     {t:'—',p:'calgarytower',n:'Calgary Tower',s:'晴天能看到落基山轮廓'},
     {t:'晚',p:'joey',n:'JOEY Eau Claire',s:'江边，饭后沿 Bow River 散步'}]},
   {d:'08.31',w:'一',t:'Icefields Parkway 一段 · Peyto Lake → Golden',r:'ice',stay:'Golden',drive:5,note:'Peyto 不用预约，停车后铺装步道走十五分钟。停车场中午会满，早点到。',stops:[
     {t:'08:00',p:'calgary',n:'出发',s:''},
     {t:'11:00',p:'bowlake',n:'Bow Lake',s:'路边就是停车场'},
     {t:'11:45',p:'peyto',n:'Peyto Lake',s:'铺装步道十五分钟，坡缓有栏杆'},
     {t:'17:00',p:'golden',n:'回 Golden',s:''},
     {t:'晚',p:'wolfsden',n:'晚饭',s:'The Wolfs Den 或 Ethos Cafe'}]},
   {d:'09.01',w:'二',t:'Golden → Burnaby',r:'bc',stay:'—',drive:8,note:'和第一天同一条路反向。周一晚高峰前到家的话，中午前出发。',stops:[
     {t:'早',p:'golden',n:'出发',s:''},
     {t:'午',p:'kamloops',n:'Kamloops 午饭 + 加油',s:''},
     {t:'—',p:'zopkios',n:'Zopkios 休息区',s:''},
     {t:'—',p:'burnaby',n:'到家',s:''}]}
  ]},

B:{k:'B',gr:'乙',name:'经典 5 天 · 住进 Banff',met:'5 DAYS · 示例 2027.07',hex:'#2E8C9E',tag:'朋友版',
  dates:'2027.07.15 → 07.19',
  pitch:'住 Banff 镇里，省掉每天往返 Calgary 的两小时。早上七点就能在湖边，'
    +'傍晚从 Norquay 下来直接回镇上吃饭。\n\n'
    +'两三个人自己去、体力正常的话，这条比方案甲效率高不少。',
  cons:'Banff 镇的住宿旺季很贵，同价位在 Canmore 能好一档，开进来二十分钟。\n\n'
    +'第一天和最后一天仍然是八小时车程，这个躲不掉。',
  budget:{gas:380,stay:1600,food:800,park:0,shuttle:60,tickets:250,shop:200,misc:250},
  days:[
   {d:'07.15',w:'',t:'Burnaby → Golden',r:'bc',stay:'Golden',drive:8,note:'',stops:[
     {t:'—',p:'zopkios',n:'Zopkios',s:''},{t:'—',p:'kamloops',n:'Kamloops',s:''},{t:'晚',p:'golden',n:'Golden',s:''}]},
   {d:'07.16',w:'',t:'Yoho → Banff',r:'yoho',stay:'Banff 镇',drive:3,note:'Yoho 三个点都在路边，不用走远。',stops:[
     {t:'—',p:'naturalbridge',n:'Natural Bridge',s:'停车走两分钟'},
     {t:'—',p:'emerald',n:'Emerald Lake',s:''},
     {t:'—',p:'takakkaw',n:'Takakkaw Falls',s:'两个发夹弯，长车不建议'},
     {t:'晚',p:'banfftown',n:'Banff 入住',s:''}]},
   {d:'07.17',w:'',t:'两湖日',r:'banff',stay:'Banff 镇',drive:2,note:'班车提前预约。从 Banff 开到 Park and Ride 约 45 分钟。',stops:[
     {t:'早',p:'parkride',n:'Park and Ride',s:''},
     {t:'—',p:'moraine',n:'Moraine Lake',s:'先去人少的那个'},
     {t:'—',p:'lakelouise',n:'Lake Louise',s:'Lake Connector 免费接驳'},
     {t:'下午',p:'lakeagnes',n:'Lake Agnes 茶屋（体力够的话）',s:'来回三小时，只收现金'}]},
   {d:'07.18',w:'',t:'Banff 周边',r:'banff',stay:'Banff 镇',drive:2,note:'',stops:[
     {t:'早',p:'johnston',n:'Johnston Canyon',s:'九点前到，不然没车位'},
     {t:'—',p:'minnewanka',n:'Minnewanka Loop',s:''},
     {t:'—',p:'banfftown',n:'镇上 + Bow Falls',s:''},
     {t:'傍晚',p:'vermilion',n:'Vermilion Lakes 日落',s:'离镇五分钟'}]},
   {d:'07.19',w:'',t:'Banff → Burnaby',r:'bc',stay:'—',drive:10,note:'一天开回去很累，也可以分两天在 Kamloops 歇一晚。',stops:[
     {t:'—',p:'golden',n:'Golden 中途停',s:''},{t:'—',p:'burnaby',n:'到家',s:''}]}
  ]},

C:{k:'C',gr:'丙',name:'飞过去 4 天 · 落地租车',met:'4 DAYS · 示例 2027.08',hex:'#7A6A8C',tag:'周末版',
  dates:'2027.08.12 → 08.15',
  pitch:'温哥华飞 Calgary 一个半小时，落地租车直接进山。省掉两整天开车，'
    +'四天能干出方案乙五天的事。\n\n'
    +'周末加两天假就能成行，是时间紧时最合理的选择。',
  cons:'机票加租车比自驾贵不少，两个人大概多出六到八百加元。\n\n'
    +'租车要注意异地还车费，以及 Calgary 机场取车高峰排队。',
  budget:{gas:120,stay:1300,food:700,park:0,shuttle:60,tickets:250,shop:150,misc:1100},
  days:[
   {d:'08.12',w:'',t:'YVR → YYC → Canmore',r:'cal',stay:'Canmore',drive:1.5,note:'订早班机，中午前能到 Canmore。',stops:[
     {t:'—',p:'yyc',n:'落地取车',s:'柜台在航站楼里'},
     {t:'—',p:'canmore',n:'Canmore 入住',s:'比 Banff 便宜，开进公园二十分钟'}]},
   {d:'08.13',w:'',t:'两湖日',r:'banff',stay:'Canmore',drive:3,note:'班车提前预约。',stops:[
     {t:'早',p:'parkride',n:'Park and Ride',s:''},
     {t:'—',p:'moraine',n:'Moraine Lake',s:''},
     {t:'—',p:'lakelouise',n:'Lake Louise',s:''},
     {t:'下午',p:'emerald',n:'Emerald Lake（顺路）',s:'再往西开 30 分钟'}]},
   {d:'08.14',w:'',t:'Banff 全天',r:'banff',stay:'Canmore',drive:2,note:'',stops:[
     {t:'早',p:'johnston',n:'Johnston Canyon',s:''},
     {t:'—',p:'minnewanka',n:'Minnewanka Loop',s:''},
     {t:'—',p:'banfftown',n:'Banff 镇',s:''},
     {t:'傍晚',p:'norquay',n:'Norquay 观景台',s:''}]},
   {d:'08.15',w:'',t:'Calgary → YVR',r:'cal',stay:'—',drive:1.5,note:'留足还车和值机时间。',stops:[
     {t:'上午',p:'calgary',n:'市区或 outlet',s:''},{t:'—',p:'yyc',n:'还车',s:''}]}
  ]},

D:{k:'D',gr:'丁',name:'深度 8 天 · 含 Jasper',met:'8 DAYS · 示例 2027.07',hex:'#D8A93C',tag:'走完整',
  dates:'2027.07.10 → 07.17',
  pitch:'加进 Jasper 和 Icefields Parkway 全程。那条路 230 公里，'
    +'沿途冰川、湖、瀑布一个接一个，慢慢开要一整天。\n\n'
    +'走完这条才算把落基山看全，Banff 只是南边一半。',
  cons:'Jasper 在 2024 年山火后部分区域仍在恢复，出发前查开放状态和住宿供应。\n\n'
    +'Icefields Parkway 全程没有加油站，进 Parkway 前必须加满。',
  budget:{gas:600,stay:2400,food:1200,park:0,shuttle:60,tickets:500,shop:250,misc:350},
  days:[
   {d:'07.10',w:'',t:'Burnaby → Golden',r:'bc',stay:'Golden',drive:8,note:'',stops:[{t:'—',p:'kamloops',n:'Kamloops',s:''},{t:'晚',p:'golden',n:'Golden',s:''}]},
   {d:'07.11',w:'',t:'Yoho → Lake Louise',r:'yoho',stay:'Lake Louise',drive:2,note:'',stops:[
     {t:'—',p:'emerald',n:'Emerald Lake',s:''},{t:'—',p:'takakkaw',n:'Takakkaw Falls',s:''}]},
   {d:'07.12',w:'',t:'两湖日',r:'banff',stay:'Lake Louise',drive:1,note:'住 Lake Louise 村的好处是离 Park and Ride 最近。',stops:[
     {t:'早',p:'moraine',n:'Moraine Lake',s:''},{t:'—',p:'lakelouise',n:'Lake Louise',s:''}]},
   {d:'07.13',w:'',t:'Icefields Parkway → Jasper',r:'ice',stay:'Jasper',drive:5,note:'230 公里全程无加油站，出发前加满。慢慢开，停五六次。',stops:[
     {t:'—',p:'bowlake',n:'Bow Lake',s:''},
     {t:'—',p:'peyto',n:'Peyto Lake',s:''},
     {t:'—',p:'icefield',n:'哥伦比亚冰原',s:'冰上车要提前订'},
     {t:'—',p:'athabascafalls',n:'Athabasca Falls',s:''},
     {t:'晚',p:'jasper',n:'Jasper 入住',s:'暗夜保护区，晴天看银河'}]},
   {d:'07.14',w:'',t:'Jasper 周边',r:'ice',stay:'Jasper',drive:3,note:'',stops:[
     {t:'—',p:'maligne',n:'Maligne Lake',s:'去 Spirit Island 的船要提前订'}]},
   {d:'07.15',w:'',t:'Jasper → Banff',r:'banff',stay:'Banff 镇',drive:5,note:'原路返回，光线和来时不一样，值得再停几次。',stops:[
     {t:'—',p:'icefield',n:'冰原（回程再看）',s:''},{t:'晚',p:'banfftown',n:'Banff',s:''}]},
   {d:'07.16',w:'',t:'Banff 全天',r:'banff',stay:'Banff 镇',drive:2,note:'',stops:[
     {t:'早',p:'johnston',n:'Johnston Canyon',s:''},{t:'—',p:'minnewanka',n:'Minnewanka Loop',s:''},
     {t:'傍晚',p:'norquay',n:'Norquay',s:''}]},
   {d:'07.17',w:'',t:'Banff → Burnaby',r:'bc',stay:'—',drive:10,note:'太累就在 Kamloops 加一晚。',stops:[{t:'—',p:'burnaby',n:'到家',s:''}]}
  ]},

E:{k:'E',gr:'戊',name:'冬季滑雪 7 天 · Kicking Horse + SkiBig3',met:'7 DAYS · 示例 2028.02',hex:'#1F6FA8',tag:'雪季',
  dates:'2028.02.05 → 02.11',
  pitch:'冬天来就专心滑雪。先在 Golden 滑两天 Kicking Horse，再进 Banff 滑 SkiBig3。\n\n'
    +'Kicking Horse 落差 1260 米，以陡峭碗状地形著称；SkiBig3 是 Sunshine、Lake Louise、Norquay 三家，'
    +'一张票通刷，有免费班车串各雪场和 Banff 镇。',
  cons:'冬天 Moraine Lake Road 完全封闭，湖是看不到的。Icefields Parkway 冬季服务点关闭、'
    +'路况差，不建议自驾走。\n\n'
    +'Rogers Pass 冬天常因雪崩控制临时封路，行程要留缓冲，别把回程压在最后一天。\n\n'
    +'这几家不在 Epic 里，按当季票价另买。各家的通票归属每年会变，出发前在官网确认。',
  budget:{gas:400,stay:2000,food:1000,park:0,shuttle:0,tickets:1800,shop:300,misc:500},
  days:[
   {d:'02.05',w:'',t:'Burnaby → Golden',r:'bc',stay:'Golden',drive:9,note:'冬天路况慢，比夏天多留一小时。查 DriveBC 的 Coquihalla 和 Rogers Pass 状态。',stops:[
     {t:'—',p:'kamloops',n:'Kamloops',s:'冬天这段常有雪'},{t:'晚',p:'golden',n:'Golden',s:''}]},
   {d:'02.06',w:'',t:'Kicking Horse D1',r:'ski',stay:'Golden',drive:0.5,note:'先摸地形，别一上来就扎碗。',stops:[
     {t:'—',p:'kicking',n:'Kicking Horse',s:'落差 1260 米，初学者选择少'}]},
   {d:'02.07',w:'',t:'Kicking Horse D2',r:'ski',stay:'Golden',drive:0.5,note:'',stops:[{t:'—',p:'kicking',n:'Kicking Horse',s:''}]},
   {d:'02.08',w:'',t:'Golden → Banff',r:'banff',stay:'Banff 镇',drive:2.5,note:'转场日，下午到 Banff，取雪票。',stops:[
     {t:'—',p:'banfftown',n:'Banff 入住',s:'住镇上可以坐免费班车去三个雪场'}]},
   {d:'02.09',w:'',t:'Sunshine Village',r:'ski',stay:'Banff 镇',drive:0.5,note:'雪最干的一家，海拔高。',stops:[
     {t:'—',p:'sunshine',n:'Banff Sunshine',s:'要坐缆车从停车场上雪村'}]},
   {d:'02.10',w:'',t:'Lake Louise 雪场',r:'ski',stay:'Banff 镇',drive:1,note:'面积最大，前后山差异明显。风大时背面会关。',stops:[
     {t:'—',p:'lakelouiseski',n:'Lake Louise',s:''}]},
   {d:'02.11',w:'',t:'Norquay 半天 → 回程',r:'bc',stay:'—',drive:9,note:'Norquay 离镇最近，滑半天中午走。冬天回程务必留缓冲。',stops:[
     {t:'早',p:'norquayski',n:'Mt Norquay',s:'规模小，适合半天'},
     {t:'—',p:'burnaby',n:'回家',s:''}]}
  ]}
};

const BROWS=[
 {k:'gas', n:'油费', s:'往返约 1500 公里 · 百公里 9 升 · 1.7/升', max:1200},
 {k:'stay',n:'住宿', s:'Golden / Calgary / Banff / Canmore', max:4000},
 {k:'food',n:'餐饮', s:'Banff 镇内比 Calgary 贵三成左右', max:2500},
 {k:'park',n:'国家公园门票', s:'2026.06.19–09.07 由 Canada Strong Pass 覆盖', max:400},
 {k:'shuttle',n:'班车 · 停车', s:'Parks Canada 班车 + Lake Louise 停车', max:400},
 {k:'tickets',n:'门票 · 雪票 · 活动', s:'冰原车 / Calgary Tower / 雪票', max:3000},
 {k:'shop',n:'购物', s:'Outlet 与手信', max:2000},
 {k:'misc',n:'机票 · 租车 · 杂项', s:'方案丙才有；含保险和过路杂费', max:2500}
];

const TODOS=[
 {id:'b1',n:'抢 Moraine Lake 班车（最要紧的一项）',s:'出发日前两天早 8 点山区时间放 60% 的票，温哥华时间是早 7 点。提前登录好账号、想清楚先去哪个湖和人数，开抢时不要现填',due:'出发前 2 天',v:'ABCD'},
 {id:'b2',n:'确认国家公园门票',s:'2026 年 6 月 19 日至 9 月 7 日 Canada Strong Pass 期间进园免费。其余时间要买日票或年票，班车票不含门票',due:'现在',v:'ABCDE'},
 {id:'b3',n:'订住宿',s:'Banff 镇和 Lake Louise 村旺季极紧张。同价位 Canmore 通常好一档',due:'现在',v:'ABCDE'},
 {id:'b4',n:'订餐厅',s:'Banff 镇上的 Farm and Fire、Fairmont 湖景餐厅、JOEY 都要订位。Golden 的 Wolfs Den 旺季要等位',due:'出发前 1 周',v:'ABCD'},
 {id:'b5',n:'车检 + 加油策略',s:'胎压、机油、雨刮。Icefields Parkway 全程没有加油站；Coquihalla 上油价高，Kamloops 加最划算',due:'出发前',v:'ABDE'},
 {id:'b6',n:'查 DriveBC 路况',s:'Coquihalla 和 Rogers Pass 全年都可能因施工或雪崩控制封路。出发前一晚和当天早上各查一次',due:'出发当天',v:'ABDE'},
 {id:'b7',n:'下载离线地图',s:'Rogers Pass、Icefields Parkway、Park and Ride 都有大段无信号。班车预约截图存本地',due:'出发前',v:'ABCDE'},
 {id:'b8',n:'订机票和租车',s:'注意异地还车费，以及 YYC 取车高峰排队',due:'现在',v:'C'},
 {id:'b9',n:'订雪票和装备',s:'SkiBig3 三山通票、Kicking Horse 单独买。租装备提前报身高体重脚长',due:'出发前 1 月',v:'E'},
 {id:'b10',n:'冬季轮胎与应急包',s:'BC 省山区 10 月至次年 4 月强制冬季胎或链条。车上带毯子、水、充电宝',due:'出发前',v:'E'},
 {id:'b11',n:'防熊与野生动物',s:'不要下车接近动物，路边停车不要挡道。徒步带防熊喷雾，Johnston Canyon 一带常有',due:'出发前',v:'ABCD'},
 {id:'b12',n:'带现金',s:'Lake Agnes 茶屋只收现金，部分小镇店也是',due:'出发前',v:'BD'}
];

/* ══════ 每晚住宿与吃饭 ══════
   写的是方向和筛选条件，不是具体房源清单。q 是给 Booking / Google 的搜索词。 */
const STAY={
 'Golden':{area:'Golden, BC',
  opts:[{n:'1 号公路边的连锁酒店',tier:'$$',pick:true,q:'Golden BC hotel highway 1',
    why:'进出方便，早上不用绕镇。这次订的 Holiday Inn Express Golden-Kicking Horse 就在这一带。'},
   {n:'镇中心的小旅馆',tier:'$',q:'Golden BC downtown motel',
    why:'走路能到餐厅，价格低一截，但停车位少。'},
   {n:'Kicking Horse 山脚',tier:'$$$',q:'Kicking Horse Mountain Resort lodging',
    why:'冬天滑雪才值得，夏天离镇上远。'}],
  food:[{n:'The Wolfs Den',jp:'The Wolfs Den Golden BC',why:'野牛肋排是招牌。旺季要等位，进镇前打电话。'},
   {n:'Ethos Cafe',jp:'Ethos Cafe Golden BC',why:'早餐和外带咖啡，第二天出发前买。'},
   {n:'Raven + Pine',jp:'Raven and Pine Golden BC',why:'Wolfs Den 满了的备选。'}]},

 'Calgary':{area:'Downtown Calgary',
  opts:[{n:'Downtown（Eau Claire 一带）',tier:'$$',pick:true,q:'Downtown Calgary hotel Eau Claire',
    why:'晚饭和江边散步都在步行范围，长辈不用再上车。这次订的 Hilton Garden Inn Downtown 在这一块。'},
   {n:'机场 / 北区',tier:'$',q:'Calgary airport hotel',
    why:'便宜，离 CrossIron Mills 近，但晚上没地方走。'},
   {n:'西区（往 Banff 方向）',tier:'$$',q:'Calgary west hotel Bow Trail',
    why:'每天进山能省二十分钟，代价是离市中心远。'}],
  food:[{n:'JOEY Eau Claire',jp:'JOEY Eau Claire Calgary',why:'江边连锁，出品稳定，要订位。饭后沿 Bow River 散步。'},
   {n:'Stephen Avenue 一带',jp:'Stephen Avenue Calgary restaurants',why:'步行街，选择多，适合不想决定的一晚。'},
   {n:'Alberta 牛排',jp:'steakhouse Calgary',why:'来都来了。人均不便宜，要订位。'}]},

 'Banff 镇':{area:'Town of Banff',
  opts:[{n:'Banff Ave 步行范围内',tier:'$$$',pick:true,q:'Banff Avenue hotel',
    why:'早上七点就能在湖边，晚上走回来吃饭。冬天还能坐免费班车去三个雪场。旺季很贵。'},
   {n:'Tunnel Mountain 一带',tier:'$$',q:'Tunnel Mountain Banff accommodation',
    why:'离镇中心开车五分钟，价格低一档，有免费 Roam 公交。'},
   {n:'Canmore（公园外）',tier:'$$',q:'Canmore Alberta hotel',
    why:'同价位通常好一档，开进 Banff 二十分钟。三姐妹峰就在镇后面。'}],
  food:[{n:'Farm and Fire',jp:'Farm and Fire Banff',why:'柴火烤炉，晚市要订位。'},
   {n:'Banff Social',jp:'Banff Social Banff Ave',why:'菜单杂但出餐快，适合带长辈不想等。'},
   {n:'Banff Ave 上的自选',jp:'restaurants Banff Avenue',why:'主街一条走到底，旺季七点后普遍要等位。'}]},

 'Canmore':{area:'Canmore, Alberta',
  opts:[{n:'主街 Main Street 附近',tier:'$$',pick:true,q:'Canmore Main Street hotel',
    why:'在国家公园门外，不用付园区停车，开进 Banff 二十分钟。餐厅密度不低。'}],
  food:[{n:'Canmore 主街',jp:'restaurants Main Street Canmore',why:'比 Banff 便宜，本地人多。'}]},

 'Lake Louise':{area:'Lake Louise Village',
  opts:[{n:'Lake Louise 村里',tier:'$$$',pick:true,q:'Lake Louise Village hotel',
    why:'离 Park and Ride 最近，早班车最省事。房源极少且贵。'},
   {n:'退一步住 Field 或 Golden',tier:'$$',q:'Field BC accommodation',
    why:'Field 在 Yoho 里，开到 Park and Ride 二十分钟，价格差一大截。'}],
  food:[{n:'Bill Peytos Cafe',jp:'Bill Peytos Cafe Lake Louise',why:'村里的青旅餐厅，比湖边正常。'},
   {n:'村里超市自备',jp:'Lake Louise village grocery',why:'湖边没有便宜的吃的，早上买三明治带上山。'}]},

 'Jasper':{area:'Jasper, Alberta',
  opts:[{n:'镇中心',tier:'$$',pick:true,q:'Jasper Alberta hotel downtown',
    why:'2024 年山火后住宿供应仍在恢复，出发前确认。暗夜保护区，晴天晚上看银河。'}],
  food:[{n:'Patricia Street 一带',jp:'restaurants Patricia Street Jasper',why:'镇上餐厅集中在这两条街。'}]},

 '机上':{area:'',opts:[],food:[]}
};
