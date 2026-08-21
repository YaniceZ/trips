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
    '夏季（6 月中 – 9 月中）：湖水最蓝，路况全通，游客峰值。'
    +'<br><br>秋季（9 月中 – 10 月上旬）：落叶松转金，人流回落。Moraine Lake Road 约 10 月 12 日关闭至次年 6 月。'
    +'<br><br>冬季（12 月 – 3 月）：滑雪季。Icefields Parkway 服务点关闭，'
    +'oraine Lake 禁入。冬季仅推荐滑雪，湖景不可达。',

  drive:
    '横条为每日驾驶小时数。> 5 小时标红 —— 需预留休息站，避免夜间行驶。'
    +'<br><br>温哥华 → Golden 约 750 km，标准 8 小时，遇施工/雨雪增加 1–2 小时。',

  wxNote:
    '降水单位 mm。7  天预报仅出发前一周有效。上方为去年同期实测数据。'
    +'落基山昼夜温差显著：8 月底日间 20°C+，清晨 5–6°C，湖边风感更低。'
    +'数据 Open-Meteo（CC BY 4.0）。',

  itinHint: '点击任意一天，地图跟随。左侧数字为当日驾驶小时数，红色 > 5 小时。',

  pinsEmpty:
    '暂无收藏点。分享行程码给同行者，新增的餐厅、观景点、住宿将同步。地图长按可直接落点。',

  bookingIntro:
    '本栏为预订记录，非建议。勾选即完成，填写确认号及实付金额，同行者可查看，预算页自动汇总对账。',

  prepIntro:
    '按当前方案筛选。<b>Moraine Lake 班车预约需提前操作</b>，其余事项可临时补办。',

  budgetNote:
    '单位：加元。数字为估算值，可拖拽调整。'
    +'<br><br>油费按往返 1500 km、9 L/100 km、1.7 CAD/L 估算，实际依车型而定。'
    +'国家公园门票：2026 年 6 月 19 日 – 9 月 7 日由 Canada Strong Pass 覆盖，免费入园。'
    +'Lake Louise 旺季停车 42 CAD/车，Park and Ride 班车停车免费。',

  noteHint: '记录实地信息：人流时段、停车状况、闭店情况、路线修正。此条将显示在描述上方。',

  aboutPage:
    '行程码决定数据视图。同码用户共享收藏点；新码即空白行程，可供他人独立使用。',
  aboutFoot:
    '共享数据对同码用户公开。坐标仅为示意精度，班车时刻、票价、开放状态以 Parks Canada 当日公告为准。'
};

/* ── 两条硬规则 ── */
const RULES=[
 ['Moraine Lake 禁私家车', '2023 年起 Moraine Lake Road 全年封闭私家车（含无障碍证）。仅限 Parks Canada 班车、持牌商业车、Roam 公交、骑行（单程 12.5 km，爬升 250 m）。'],
 ['班车需提前预约，且分两次放票','2026 年 4 月 15 日释放全季 40% 票额；剩余 60% 于出发前 2 日 8:00 MT（山区时间）滚动释放。热门时段数分钟售罄。'],
 ['一票通两湖','Parks Canada 班车票含 Lake Connector 接驳及 Park and Ride 返程。预约时选择的湖为首个目的地。'],
 ['Lake Louise 可开车但停车贵且难','旺季 42 CAD/车，3:00–19:00 收费，清晨即满。Park and Ride 班车停车免费。'],
 ['门票与班车票分离','班车票不含国家公园门票。2026 年 6 月 19 日 – 9 月 7 日 Canada Strong Pass 期间免费入园，其余时间需单独购买。']
];

/* ── 五套方案的区别 ── */
const COMPARE=[
 ['甲 · Calgary 连住四晚','住宿仅换两处，行李拆两次。首日直达 Calgary，后三日当日往返，每日 ≤ 3 个景点。'],
 ['乙 · 住进 Banff','省去 Calgary 往返 2 小时车程，早 7 点可达湖边。旺季住宿成本上升。'],
 ['丙 · 飞抵 4 天','温哥华 → Calgary 飞行 1.5 小时，落地租车。节省 2 天驾驶，增加机票及租车费用。'],
 ['丁 · 深度 8 天','涵盖 Jasper 及 Icefields Parkway 全程（含哥伦比亚冰原）。完整落基山行程。'],
 ['戊 · 冬季滑雪 7 天','Kicking Horse + SkiBig3。冬季湖面封冻，行程重心为滑雪。']
];

/* ══════ 区域与地点 ══════ */
const REG={bc:{n:'BC 段',hex:'#2F6B4F'},yoho:{n:'Yoho',hex:'#2E8C9E'},
           banff:{n:'Banff',hex:'#C0392B'},cal:{n:'Calgary',hex:'#7A6A8C'},
           ice:{n:'Icefields',hex:'#D8A93C'},ski:{n:'雪场',hex:'#1F6FA8'}};
const P={};
const def=(id,zh,en,lat,lng,r,note,kind)=>P[id]={id,zh,en,lat,lng,r,note,kind};
/* kind='way' 表示只是路过点（休息区、家、加油），不给攻略搜索和官网按钮 */

/* — BC 段 — */
def('burnaby','Burnaby 出发','Burnaby BC',49.2488,-122.9805,'bc','满油出发，检查胎压。Coquihalla 沿线无廉价油站。','way');
def('zopkios','Zopkios 休息区','Zopkios Rest Area',49.6017,-121.0972,'bc','Coquihalla 高点附近，有洗手间及大型停车区。行驶约 2 小时可达，适合下车休整。','way');
def('kamloops','Kamloops','Kamloops BC',50.6745,-120.3273,'bc','全程中点。加油及正餐建议在此停留，Golden 前选择减少。');
def('kamloopslake','Kamloops Lake 观景点','Kamloops Lake Rest Area',50.7300,-120.6800,'bc','1 号公路沿湖段，多处路边观景台可停靠。','way');
def('revelstoke','Revelstoke','Revelstoke BC',50.9981,-118.1957,'bc','Rogers Pass 前最后一个完整城镇。','way');
def('rogers','Rogers Pass','Rogers Pass',51.3011,-117.5197,'bc','海拔 1330 m。冬季雪崩控制常致临时封路，夏季路况良好，山景为全程最佳路段之一。','way');
def('golden','Golden','Golden BC',51.2965,-116.9631,'bc','落基山西侧小镇，往返均在此过夜。镇区小，餐厅晚间提早关店。');
def('wolfsden','The Wolfs Den','The Wolfs Den Golden',51.2967,-116.9648,'bc','Golden 老牌餐厅，野牛肋排为招牌。旺季晚间需等位，建议进镇前致电。');
def('ethos','Ethos Cafe','Ethos Cafe Golden',51.2977,-116.9639,'bc','早餐及外带咖啡。次日出发前采购，于湖边享用。');
def('kicking','Kicking Horse 雪场','Kicking Horse Mountain Resort',51.2981,-117.0489,'ski','Golden 旁，落差 1260 m，加拿大最大雪场之一。以陡峭碗状地形及林间道著称，新手选项较少。');

/* — Yoho — */
def('emerald','Emerald Lake','Emerald Lake',51.4432,-116.5289,'yoho','环湖步道 5.2 km，约 1 小时；亦可仅走前 10 分钟至桥头观景。停车场有限，10:00 后常满。');
def('naturalbridge','Natural Bridge','Natural Bridge Yoho',51.3892,-116.5044,'yoho','往 Emerald Lake 途中，停车后步行 2 分钟可达。Kicking Horse 河切穿岩层形成孔洞。');
def('takakkaw','Takakkaw Falls','Takakkaw Falls',51.4989,-116.4772,'yoho','落差 254 m。上坡路段含两处发夹弯，长轴距车辆不建议。6 月至 10 月初开放。');

/* — Lake Louise / Moraine — */
def('parkride','Lake Louise Park and Ride','Lake Louise Park and Ride',51.4419,-116.1547,'banff','位于 Lake Louise 滑雪场停车场。持班车预约可免费停车，所有常规班车由此发车。','way');
def('lakelouise','Lake Louise 湖边','Lake Louise Lakeshore',51.4254,-116.1773,'banff','湖边平路往返 4 km，长者走前半段至城堡酒店一侧即够。旺季停车 42 CAD/车，常满。');
def('moraine','Moraine Lake','Moraine Lake',51.3217,-116.1860,'banff','十峰谷。私家车全年禁行，仅限班车。Rockpile 观景台为短而陡的碎石台阶，配有扶手。');
def('billpeytos','Bill Peytos Cafe','Bill Peytos Cafe Lake Louise',51.4258,-116.1858,'banff','Lake Louise 村内青旅餐厅，价格低于湖边选项，客流较少。');
def('fairmontll','Fairmont 城堡酒店','Fairmont Chateau Lake Louise',51.4166,-116.2180,'banff','湖景餐厅需提前订位，且需先解决停车。未订位亦可于大堂咖啡区落座。');
def('lakeagnes','Lake Agnes 茶屋','Lake Agnes Tea House',51.4306,-116.2394,'banff','单程 3.5 km，爬升 400 m，往返约 3 小时。仅收现金。长者不建议。');

/* — Banff — */
def('banfftown','Banff 小镇','Banff Town',51.1784,-115.5708,'banff','主街 Banff Ave 步行横穿约 20 分钟。镇内停车紧张，Bear Street 停车楼为最便利选项。');
def('cascade','Cascade of Time Garden','Cascade of Time Garden',51.1706,-115.5688,'banff','公园管理局大楼后方花园，坡缓、设长椅，8 月底仍有花开。免费。');
def('surprise','Surprise Corner 观景台','Surprise Corner Viewpoint',51.1697,-115.5578,'banff','拍摄 Fairmont Banff Springs 城堡的经典机位，路边停车后步行数步。');
def('pedbridge','Banff 步行桥','Banff Pedestrian Bridge',51.1729,-115.5695,'banff','跨 Bow River，桥上可观 Cascade Mountain。与上述两处均在步行范围内，1 小时可走完。');
def('bowfalls','Bow Falls','Bow Falls',51.1667,-115.5622,'banff','落差不大但水流量充足，观景台距停车场数十米。');
def('minnewanka','Minnewanka Loop','Lake Minnewanka Loop',51.2417,-115.5000,'banff','约 24 km 环形景观车道，清晨常见大角羊及麋鹿。全程约 40 分钟，不下车亦值得。');
def('twojack','Two Jack Lake','Two Jack Lake',51.2258,-115.5136,'banff','Minnewanka 环线上，湖面平静时可倒映 Mount Rundle。日出拍摄位。');
def('norquay','Mount Norquay 观景台','Mount Norquay Lookout',51.2000,-115.5967,'banff','盘山公路直达，免费。可俯瞰 Banff 镇及 Bow Valley。日落前 1 小时最佳，人流量低于缆车。');
def('vermilion','Vermilion Lakes','Vermilion Lakes',51.1786,-115.6042,'banff','距镇中心 5 分钟，日出日落皆宜。路边可停，夜间常有麋鹿。');
def('johnston','Johnston Canyon','Johnston Canyon',51.2450,-115.8394,'banff','栈道贴峡谷壁，至下瀑布单程 1.1 km，路面平整。停车场 9:00 前即满，建议早到或傍晚前往。');
def('farmfire','Farm and Fire','Farm and Fire Banff',51.1760,-115.5713,'banff','Banff 镇柴火烤炉餐厅，晚市需订位。');
def('banffsocial','Banff Social','Banff Social',51.1755,-115.5715,'banff','主街上，菜单综合且出餐快，适合带长者免等位。');

/* — Icefields Parkway / Jasper — */
def('bowlake','Bow Lake','Bow Lake',51.6706,-116.4622,'ice','Icefields Parkway 上首个大湖，路边即停车场，无需步行。');
def('peyto','Peyto Lake','Peyto Lake',51.7167,-116.5167,'ice','停车后沿步道步行约 15 分钟至观景台，坡缓设栏杆。停车场中午常满。');
def('icefield','哥伦比亚冰原','Columbia Icefield',52.2203,-117.2264,'ice','Athabasca 冰川位于路侧。冰川车及玻璃栈道需提前预订；不上冰则游客中心对面观看已足够。');
def('athabascafalls','Athabasca Falls','Athabasca Falls',52.6644,-117.8836,'ice','水流量大，栈道短，15 分钟可完成。');
def('jasper','Jasper 镇','Jasper AB',52.8737,-118.0814,'ice','较 Banff 安静，暗夜保护区，晴夜可见银河。2024 年山火后部分区域仍在恢复，出发前查询开放状态。');
def('maligne','Maligne Lake','Maligne Lake',52.7233,-117.6428,'ice','前往 Spirit Island 需乘船，单程 90 分钟往返，须提前预订。');

/* — Calgary — */
def('calgary','Calgary 市中心','Downtown Calgary',51.0447,-114.0719,'cal','Downtown 住宿优势：晚餐及散步均在步行范围。劣势：每日进出落基山各需 1 小时。');
def('crossiron','CrossIron Mills','CrossIron Mills',51.2189,-114.0022,'cal','Calgary 北面大型奥特莱斯，距机场 10 分钟。雨天或体力不足时的备选方案。');
def('studiobell','Studio Bell 国家音乐中心','Studio Bell',51.0450,-114.0553,'cal','建筑本身具观赏价值。室内场所，适合天气不佳的下午。');
def('calgarytower','Calgary Tower','Calgary Tower',51.0447,-114.0631,'cal','高 191 m，设玻璃地板。晴天可见落基山轮廓。');
def('eauclaire','Eau Claire / Prince Island','Eau Claire Calgary',51.0533,-114.0700,'cal','Bow River 河滨公园及步道，适宜饭后散步。');
def('joey','JOEY Eau Claire','JOEY Eau Claire Calgary',51.0530,-114.0708,'cal','河滨连锁餐厅，出品稳定，适合免踩雷的晚餐。需订位。');
def('yyc','Calgary 机场','YYC Calgary International Airport',51.1315,-114.0106,'cal','温哥华飞抵约 1.5 小时。租车柜台位于航站楼内。','way');
def('canmore','Canmore','Canmore AB',51.0884,-115.3479,'banff','国家公园门外，住宿较 Banff 便宜，至 Banff 车程 20 分钟。三姐妹峰位于镇后。');

/* — 雪场（方案戊） — */
def('sunshine','Banff Sunshine Village','Banff Sunshine Village',51.0783,-115.7761,'ski','雪质最干，海拔高、雪季长。需乘缆车从停车场至雪村。');
def('lakelouiseski','Lake Louise 雪场','Lake Louise Ski Resort',51.4419,-116.1547,'ski','面积最大，前后山地形差异显著。背面（Back Bowls）大风时关闭。');
def('norquayski','Mt Norquay 雪场','Mt Norquay',51.2003,-115.5964,'ski','距 Banff 镇最近，规模小但设夜滑。适合半日或热身。');
def('nakiska','Nakiska','Nakiska Ski Area',50.9425,-115.1550,'ski','位于 Kananaskis，1988 冬奥会场，距 Calgary 最近。人少，以压雪道为主。');

/* ══════ 季节表 ══════ */
const GCOL = ['#E1E7E6','#BFD9DA','#6FB0B8','#2E8C9E'];
const H2 = ['#E1E7E6','#EBD8B0','#D8A93C','#C0392B'];
const TIMING = {
  cols: [{ k: '1–3月', pk: 1 }, { k: '4–5月', pk: 0 }, { k: '6月', pk: 0 }, { k: '7–8月', pk: 1 }, { k: '9月', pk: 1 }, { k: '10月', pk: 0 }, { k: '11–12月', pk: 0 }],
  rows: [
    { n: '湖 / 路', v: [0, 1, 2, 3, 3, 1, 0], c: GCOL },
    { n: '滑雪', v: [3, 1, 0, 0, 0, 0, 2], c: GCOL },
    { n: '人流', v: [2, 1, 2, 3, 2, 1, 1], c: H2 },
    { n: '价格', v: [2, 1, 2, 3, 2, 1, 1], c: H2 }
  ]
};

/* ══════ 五套方案 ══════ */
const V = {
  A: {
    k: 'A', gr: '甲', name: 'Calgary 连住四晚 · 6 天 5 晚', met: '6 DAYS · 5 NIGHTS', hex: '#C0392B', tag: '本次',
    start: '2026-08-27', dates: '2026.08.27 → 09.01',
    pitch: '住宿两处：Calgary 连住四晚，返程 Kamloops 一晚。行李拆两次。\n\n首日直抵 Calgary，最累路段前置。之后三日 Calgary 往返，每日 ≤ 3 景点，步行 ≤ 1 小时。',
    cons: '首日约 950 km，10–11 小时。全程最硬路段。建议尽早出发，避免夜间进城。\n\n住 Calgary 代价：每日进出落基山各 1 小时。如需省时，切换至方案乙。',
    budget: { gas: 450, stay: 1300, food: 900, park: 0, shuttle: 60, tickets: 220, shop: 600, misc: 300 },
    days: [{
      d: '08.27', w: '四', t: 'Burnaby → Calgary', r: 'bc', stay: 'Calgary', drive: 10.5,
      sig: '全程有信号，Coquihalla 山区局部断续。',
      note: '约 950 km，10–11 小时。建议早出发，满油。',
      stops: [
        { t: '早', p: 'burnaby', n: '出发', s: '尽量 6:30 前上路' },
        { t: '—', p: 'zopkios', n: 'Zopkios 休息区', s: 'Coquihalla 高点，厕所 + 大停车场' },
        { t: '午', p: 'kamloops', n: 'Kamloops 加油 + 午餐', s: '油价低于 Coquihalla' },
        { t: '—', p: 'rogers', n: 'Rogers Pass', s: '山景最佳路段，今日以赶路为主' },
        { t: '晚', p: 'calgary', n: 'Calgary 入住', s: '晚餐随意，尽早休息' }
      ]
    }, {
      d: '08.28', w: '五', t: '班夫日', r: 'banff', stay: 'Calgary', drive: 3.5,
      sig: 'Banff 镇有信号有 WiFi。Minnewanka Loop 及 Norquay 段信号弱。',
      note: '清晨出发，Minnewanka 环线常见大角羊及麋鹿。镇内三处步行可达。',
      stops: [
        { t: '07:30', p: 'minnewanka', n: 'Minnewanka Loop', s: '24 km 环线，约 40 分钟' },
        { t: '—', p: 'twojack', n: 'Two Jack Lake', s: '静水面可倒映 Mount Rundle' },
        { t: '10:30', p: 'cascade', n: 'Cascade 花园', s: '坡缓设长椅，免费' },
        { t: '—', p: 'surprise', n: 'Surprise Corner', s: '城堡酒店拍摄点' },
        { t: '—', p: 'pedbridge', n: 'Banff 步行桥', s: '三处步行约 1 小时' },
        { t: '12:30', p: 'farmfire', n: '午餐', s: 'Farm and Fire 或 Banff Social，需订位' },
        { t: '17:30', p: 'norquay', n: 'Mount Norquay 观景台', s: '开车直达，免费。日落前 1 小时最佳' }
      ]
    }, {
      d: '08.29', w: '六', t: '湖泊日 · 断网日', r: 'yoho', stay: 'Calgary', drive: 5,
      sig: '全天基本无信号 / 无 WiFi。Emerald Lake 及 Moraine Lake 几乎完全断网，Lake Louise 村信号弱。班车凭证需提前截图保存。',
      note: '班车日。早餐外带。全程最满一日。',
      stops: [
        { t: '07:00', p: 'ethos', n: 'Ethos Cafe 外带早餐', s: '路上食用' },
        { t: '—', p: 'emerald', n: 'Emerald Lake', s: '环湖 30 分钟；亦可仅走至桥头' },
        { t: '—', p: 'parkride', n: 'Park and Ride 换班车', s: '停车免费，提前 15 分钟至发车点' },
        { t: '—', p: 'lakelouise', n: 'Lake Louise 湖边', s: '平路，走至城堡酒店侧即可' },
        { t: '—', p: 'moraine', n: 'Moraine Lake', s: '转乘 Lake Connector，免费' },
        { t: '午', p: 'billpeytos', n: '午餐 · 视情况', s: 'Lake Louise 村简餐。若时间体力充裕，可考虑 Fairmont 湖景餐厅（需提前订位）' },
        { t: '傍晚', p: 'calgary', n: '返回 Calgary', s: '约 3 小时' }
      ]
    }, {
      d: '08.30', w: '日', t: '休息 · 购物', r: 'cal', stay: 'Calgary', drive: 1,
      sig: '全程信号正常，市区 WiFi 齐全。',
      note: '连看两日山景后的缓冲日。雨天可转室内。',
      stops: [
        { t: '上午', p: 'crossiron', n: 'CrossIron Mills', s: '市区北面，车程 20 分钟' },
        { t: '下午', p: 'studiobell', n: 'Studio Bell', s: '建筑具观赏性' },
        { t: '—', p: 'calgarytower', n: 'Calgary Tower', s: '晴天可见落基山轮廓' },
        { t: '—', p: 'eauclaire', n: 'Eau Claire / 王子岛', s: '' },
        { t: '晚', p: 'joey', n: 'JOEY Eau Claire', s: '河滨，需订位' }
      ]
    }, {
      d: '08.31', w: '一', t: 'Icefields Pkwy + 转场', r: 'ice', stay: 'Kamloops', drive: 8,
      sig: 'Bow Lake 及 Peyto Lake 段信号弱。过 Golden 后逐步恢复。',
      note: '今日完成返程大半，次日轻松。Peyto 无需预约，停车场中午满，建议早到。',
      stops: [
        { t: '07:30', p: 'calgary', n: '出发', s: '' },
        { t: '—', p: 'bowlake', n: 'Bow Lake', s: '路边停车场' },
        { t: '—', p: 'peyto', n: 'Peyto Lake', s: '铺装步道至观景台，坡缓设栏杆' },
        { t: '—', p: 'golden', n: '经 Golden', s: '加油' },
        { t: '—', p: 'revelstoke', n: '经 Revelstoke', s: '' },
        { t: '晚', p: 'kamloops', n: 'Kamloops 入住', s: '晚餐随意' }
      ]
    }, {
      d: '09.01', w: '二', t: 'Kamloops → Burnaby', r: 'bc', stay: '—', drive: 4,
      sig: '全程信号正常。',
      note: '约 4 小时。建议中午前出发，避开温哥华晚高峰。',
      stops: [
        { t: '早', p: 'kamloops', n: '出发', s: '' },
        { t: '—', p: 'kamloopslake', n: 'Kamloops Lake 观景点', s: '' },
        { t: '—', p: 'burnaby', n: '到家', s: '' }
      ]
    }]
  },

  B: {
    k: 'B', gr: '乙', name: '住进 Banff · 5 天', met: '5 DAYS · 示例 2027.07', hex: '#2E8C9E', tag: '省折返',
    start: '2027-07-15', dates: '2027.07.15 → 07.19',
    pitch: '住 Banff 镇内，省去每日往返 Calgary 的 2 小时。早 7 点可达湖边，傍晚 Norquay 下山即回镇。\n\n体力正常者，本方案效率高于方案甲。',
    cons: 'Banff 镇旺季住宿溢价显著，同价位 Canmore 质量更高，但需多开 20 分钟进公园。\n\n首日及末日仍为 8 小时车程。',
    budget: { gas: 380, stay: 1600, food: 800, park: 0, shuttle: 60, tickets: 250, shop: 200, misc: 250 },
    days: [{
      d: '07.15', w: '', t: 'Burnaby → Golden', r: 'bc', stay: 'Golden', drive: 8, note: '', stops: [
        { t: '—', p: 'zopkios', n: 'Zopkios', s: '' }, { t: '—', p: 'kamloops', n: 'Kamloops', s: '' }, { t: '晚', p: 'golden', n: 'Golden', s: '' }
      ]
    }, {
      d: '07.16', w: '', t: 'Yoho → Banff', r: 'yoho', stay: 'Banff 镇', drive: 3, note: 'Yoho 三处均在路边，无需长距离步行。', stops: [
        { t: '—', p: 'naturalbridge', n: 'Natural Bridge', s: '停车步行 2 分钟' },
        { t: '—', p: 'emerald', n: 'Emerald Lake', s: '' },
        { t: '—', p: 'takakkaw', n: 'Takakkaw Falls', s: '含两处发夹弯，长车不宜' },
        { t: '晚', p: 'banfftown', n: 'Banff 入住', s: '' }
      ]
    }, {
      d: '07.17', w: '', t: '两湖日', r: 'banff', stay: 'Banff 镇', drive: 2, note: '班车需提前预约。Banff → Park and Ride 约 45 分钟。', stops: [
        { t: '早', p: 'parkride', n: 'Park and Ride', s: '' },
        { t: '—', p: 'moraine', n: 'Moraine Lake', s: '优先前往人流较少者' },
        { t: '—', p: 'lakelouise', n: 'Lake Louise', s: 'Lake Connector 免费接驳' },
        { t: '下午', p: 'lakeagnes', n: 'Lake Agnes 茶屋（体力充足）', s: '往返 3 小时，仅收现金' }
      ]
    }, {
      d: '07.18', w: '', t: 'Banff 周边', r: 'banff', stay: 'Banff 镇', drive: 2, note: '', stops: [
        { t: '早', p: 'johnston', n: 'Johnston Canyon', s: '9:00 前抵达，否则无车位' },
        { t: '—', p: 'minnewanka', n: 'Minnewanka Loop', s: '' },
        { t: '—', p: 'banfftown', n: '镇内 + Bow Falls', s: '' },
        { t: '傍晚', p: 'vermilion', n: 'Vermilion Lakes 日落', s: '距镇 5 分钟' }
      ]
    }, {
      d: '07.19', w: '', t: 'Banff → Burnaby', r: 'bc', stay: '—', drive: 10, note: '一日返程强度较高，可于 Kamloops 分两日。', stops: [
        { t: '—', p: 'golden', n: 'Golden 停靠', s: '' }, { t: '—', p: 'burnaby', n: '到家', s: '' }
      ]
    }]
  },

  C: {
    k: 'C', gr: '丙', name: '飞过去 4 天 · 落地租车', met: '4 DAYS · 示例 2027.08', hex: '#7A6A8C', tag: '时间紧',
    start: '2027-08-12', dates: '2027.08.12 → 08.15',
    pitch: '温哥华飞 Calgary 1.5 小时，落地租车进山。节省 2 天驾驶，4 天达成方案乙 5 天内容。\n\n周末 + 2 天假即可成行，时间紧张时首选。',
    cons: '机票 + 租车成本较自驾高出 600–800 加元（双人）。\n\n注意租车异地还车费，Calgary 机场取车高峰需排队。',
    budget: { gas: 120, stay: 1300, food: 700, park: 0, shuttle: 60, tickets: 250, shop: 150, misc: 1100 },
    days: [{
      d: '08.12', w: '', t: 'YVR → YYC → Canmore', r: 'cal', stay: 'Canmore', drive: 1.5, note: '订早班机，中午前可达 Canmore。', stops: [
        { t: '—', p: 'yyc', n: '落地取车', s: '柜台位于航站楼内' },
        { t: '—', p: 'canmore', n: 'Canmore 入住', s: '价格低于 Banff，进公园 20 分钟' }
      ]
    }, {
      d: '08.13', w: '', t: '两湖日', r: 'banff', stay: 'Canmore', drive: 3, note: '班车需提前预约。', stops: [
        { t: '早', p: 'parkride', n: 'Park and Ride', s: '' },
        { t: '—', p: 'moraine', n: 'Moraine Lake', s: '' },
        { t: '—', p: 'lakelouise', n: 'Lake Louise', s: '' },
        { t: '下午', p: 'emerald', n: 'Emerald Lake（顺路）', s: '向西再开 30 分钟' }
      ]
    }, {
      d: '08.14', w: '', t: 'Banff 全天', r: 'banff', stay: 'Canmore', drive: 2, note: '', stops: [
        { t: '早', p: 'johnston', n: 'Johnston Canyon', s: '' },
        { t: '—', p: 'minnewanka', n: 'Minnewanka Loop', s: '' },
        { t: '—', p: 'banfftown', n: 'Banff 镇', s: '' },
        { t: '傍晚', p: 'norquay', n: 'Norquay 观景台', s: '' }
      ]
    }, {
      d: '08.15', w: '', t: 'Calgary → YVR', r: 'cal', stay: '—', drive: 1.5, note: '留足还车及值机时间。', stops: [
        { t: '上午', p: 'calgary', n: '市区 / 奥特莱斯', s: '' }, { t: '—', p: 'yyc', n: '还车', s: '' }
      ]
    }]
  },

  D: {
    k: 'D', gr: '丁', name: '深度 8 天 · 含 Jasper', met: '8 DAYS · 示例 2027.07', hex: '#D8A93C', tag: '走完整',
    start: '2027-07-10', dates: '2027.07.10 → 07.17',
    pitch: '纳入 Jasper 及 Icefields Parkway 全程。该路段 230 km，沿途冰川、湖、瀑布密集，需整日慢行。\n\n走完全程才算完整落基山，Banff 仅为南段。',
    cons: 'Jasper 2024 年山火后部分区域仍在恢复，出发前查询开放状态及住宿供应。\n\nIcefields Parkway 全程无加油站，进入前须加满。',
    budget: { gas: 600, stay: 2400, food: 1200, park: 0, shuttle: 60, tickets: 500, shop: 250, misc: 350 },
    days: [{
      d: '07.10', w: '', t: 'Burnaby → Golden', r: 'bc', stay: 'Golden', drive: 8, note: '', stops: [
        { t: '—', p: 'kamloops', n: 'Kamloops', s: '' }, { t: '晚', p: 'golden', n: 'Golden', s: '' }
      ]
    }, {
      d: '07.11', w: '', t: 'Yoho → Lake Louise', r: 'yoho', stay: 'Lake Louise', drive: 2, note: '', stops: [
        { t: '—', p: 'emerald', n: 'Emerald Lake', s: '' }, { t: '—', p: 'takakkaw', n: 'Takakkaw Falls', s: '' }
      ]
    }, {
      d: '07.12', w: '', t: '两湖日', r: 'banff', stay: 'Lake Louise', drive: 1, note: 'Lake Louise 村距 Park and Ride 最近。', stops: [
        { t: '早', p: 'moraine', n: 'Moraine Lake', s: '' }, { t: '—', p: 'lakelouise', n: 'Lake Louise', s: '' }
      ]
    }, {
      d: '07.13', w: '', t: 'Icefields Pkwy → Jasper', r: 'ice', stay: 'Jasper', drive: 5, note: '230 km 全程无加油站，出发前加满。建议慢行，停靠 5–6 次。', stops: [
        { t: '—', p: 'bowlake', n: 'Bow Lake', s: '' },
        { t: '—', p: 'peyto', n: 'Peyto Lake', s: '' },
        { t: '—', p: 'icefield', n: '哥伦比亚冰原', s: '冰上车需提前预订' },
        { t: '—', p: 'athabascafalls', n: 'Athabasca Falls', s: '' },
        { t: '晚', p: 'jasper', n: 'Jasper 入住', s: '暗夜保护区，晴夜可见银河' }
      ]
    }, {
      d: '07.14', w: '', t: 'Jasper 周边', r: 'ice', stay: 'Jasper', drive: 3, note: '', stops: [
        { t: '—', p: 'maligne', n: 'Maligne Lake', s: 'Spirit Island 游船需提前订' }
      ]
    }, {
      d: '07.15', w: '', t: 'Jasper → Banff', r: 'banff', stay: 'Banff 镇', drive: 5, note: '原路返程，光线方向不同，值得再停。', stops: [
        { t: '—', p: 'icefield', n: '冰原（返程观览）', s: '' }, { t: '晚', p: 'banfftown', n: 'Banff', s: '' }
      ]
    }, {
      d: '07.16', w: '', t: 'Banff 全天', r: 'banff', stay: 'Banff 镇', drive: 2, note: '', stops: [
        { t: '早', p: 'johnston', n: 'Johnston Canyon', s: '' }, { t: '—', p: 'minnewanka', n: 'Minnewanka Loop', s: '' },
        { t: '傍晚', p: 'norquay', n: 'Norquay', s: '' }
      ]
    }, {
      d: '07.17', w: '', t: 'Banff → Burnaby', r: 'bc', stay: '—', drive: 10, note: '若体力不支，可在 Kamloops 加住一晚。', stops: [
        { t: '—', p: 'burnaby', n: '到家', s: '' }
      ]
    }]
  },

  E: {
    k: 'E', gr: '戊', name: '冬季滑雪 7 天 · Kicking Horse + SkiBig3', met: '7 DAYS · 示例 2028.02', hex: '#1F6FA8', tag: '雪季',
    start: '2028-02-05', dates: '2028.02.05 → 02.11',
    pitch: '冬季行程聚焦滑雪。Golden 先滑 Kicking Horse 2 天，再进 Banff 滑 SkiBig3 3 天。\n\nKicking Horse 落差 1260 m，以陡峭碗状及林间道著称。SkiBig3 含 Sunshine、Lake Louise、Norquay 三雪场，一票通，免费班车连接各雪场及 Banff 镇。',
    cons: '冬季 Moraine Lake Road 完全封闭，湖区不可达。Icefields Parkway 冬季服务关闭、路况差，不建议自驾穿越。\n\nRogers Pass 冬季因雪崩控制常临时封路，行程需预留缓冲，勿将返程压在最后一日。\n\n以上雪场均不属 Epic Pass，按当季票价另购。各雪场通票归属每年变动，出发前至官网确认。',
    budget: { gas: 400, stay: 2000, food: 1000, park: 0, shuttle: 0, tickets: 1800, shop: 300, misc: 500 },
    days: [{
      d: '02.05', w: '', t: 'Burnaby → Golden', r: 'bc', stay: 'Golden', drive: 9, note: '冬季路况较慢，比夏季多预留 1 小时。查询 DriveBC 获取 Coquihalla 及 Rogers Pass 状态。', stops: [
        { t: '—', p: 'kamloops', n: 'Kamloops', s: '冬季此段常有积雪' }, { t: '晚', p: 'golden', n: 'Golden', s: '' }
      ]
    }, {
      d: '02.06', w: '', t: 'Kicking Horse D1', r: 'ski', stay: 'Golden', drive: 0.5, note: '首日熟悉地形，避免直接进入碗状区域。', stops: [
        { t: '—', p: 'kicking', n: 'Kicking Horse', s: '落差 1260 m，新手选择少' }
      ]
    }, {
      d: '02.07', w: '', t: 'Kicking Horse D2', r: 'ski', stay: 'Golden', drive: 0.5, note: '', stops: [
        { t: '—', p: 'kicking', n: 'Kicking Horse', s: '' }
      ]
    }, {
      d: '02.08', w: '', t: 'Golden → Banff', r: 'banff', stay: 'Banff 镇', drive: 2.5, note: '转场日。下午抵 Banff，领取雪票。', stops: [
        { t: '—', p: 'banfftown', n: 'Banff 入住', s: '镇内可乘免费班车至三雪场' }
      ]
    }, {
      d: '02.09', w: '', t: 'Sunshine Village', r: 'ski', stay: 'Banff 镇', drive: 0.5, note: '雪质最干，海拔高。', stops: [
        { t: '—', p: 'sunshine', n: 'Banff Sunshine', s: '需乘缆车从停车场至雪村' }
      ]
    }, {
      d: '02.10', w: '', t: 'Lake Louise 雪场', r: 'ski', stay: 'Banff 镇', drive: 1, note: '面积最大，前后山地形差异显著。大风时背面（Back Bowls）关闭。', stops: [
        { t: '—', p: 'lakelouiseski', n: 'Lake Louise', s: '' }
      ]
    }, {
      d: '02.11', w: '', t: 'Norquay 半天 → 返程', r: 'bc', stay: '—', drive: 9, note: 'Norquay 距镇最近，滑半天后中午出发。冬季返程务必保留缓冲时间。', stops: [
        { t: '早', p: 'norquayski', n: 'Mt Norquay', s: '规模小，适半日' },
        { t: '—', p: 'burnaby', n: '返家', s: '' }
      ]
    }]
  }
};

/* ══════ 每晚住宿与吃饭 ══════
   写的是方向和筛选条件，不是具体房源清单。q 是给 Booking / Google 的搜索词。 */
const STAY = {
  'Golden': {
    area: 'Golden, BC',
    opts: [
      { n: '1 号公路旁连锁酒店', tier: '$$', pick: true, q: 'Golden BC hotel highway 1',
        why: '进出便利，无需绕镇。Holiday Inn Express Golden-Kicking Horse 位于该区域。' },
      { n: '镇中心汽车旅馆', tier: '$', q: 'Golden BC downtown motel',
        why: '步行可达餐厅，价格较低，停车位有限。' },
      { n: 'Kicking Horse 山脚', tier: '$$$', q: 'Kicking Horse Mountain Resort lodging',
        why: '仅冬季滑雪时优先，夏季离镇较远。' }
    ],
    food: [
      { n: 'The Wolfs Den', jp: 'The Wolfs Den Golden BC', why: '野牛肋排招牌。旺季需等位，建议进镇前致电。' },
      { n: 'Ethos Cafe', jp: 'Ethos Cafe Golden BC', why: '早餐及外带咖啡，次日出发前采购。' },
      { n: 'Raven + Pine', jp: 'Raven and Pine Golden BC', why: 'Wolfs Den 满位时备选。' }
    ]
  },

  'Calgary': {
    area: 'Downtown Calgary',
    opts: [
      { n: 'Downtown（Eau Claire 区域）', tier: '$$', pick: true, q: 'Downtown Calgary hotel Eau Claire',
        why: '晚餐及江边散步均在步行范围，长者无需再上车。Hilton Garden Inn Downtown 位于此区。' },
      { n: '机场 / 北区', tier: '$', q: 'Calgary airport hotel',
        why: '价格较低，近 CrossIron Mills，夜间无可步行区域。' },
      { n: '西区（往 Banff 方向）', tier: '$$', q: 'Calgary west hotel Bow Trail',
        why: '每日进山节省 20 分钟，代价是远离市中心。' }
    ],
    food: [
      { n: 'JOEY Eau Claire', jp: 'JOEY Eau Claire Calgary', why: '河滨连锁，出品稳定，需订位。饭后可沿 Bow River 散步。' },
      { n: 'Stephen Avenue 区域', jp: 'Stephen Avenue Calgary restaurants', why: '步行街，选择多元，适合作出决定困难时使用。' },
      { n: 'Alberta 牛排馆', jp: 'steakhouse Calgary', why: '人均较高，需订位。' }
    ]
  },

  'Banff 镇': {
    area: 'Town of Banff',
    opts: [
      { n: 'Banff Ave 步行范围', tier: '$$$', pick: true, q: 'Banff Avenue hotel',
        why: '早 7 点可达湖边，晚间步行回镇就餐。冬季可乘免费班车至三雪场。旺季价格较高。' },
      { n: 'Tunnel Mountain 区域', tier: '$$', q: 'Tunnel Mountain Banff accommodation',
        why: '距镇中心 5 分钟车程，价格较低，有免费 Roam 公交。' },
      { n: 'Canmore（公园门外）', tier: '$$', q: 'Canmore Alberta hotel',
        why: '同价位通常品质更高，进 Banff 车程 20 分钟。三姐妹峰位于镇后。' }
    ],
    food: [
      { n: 'Farm and Fire', jp: 'Farm and Fire Banff', why: '柴火烤炉，晚市需订位。' },
      { n: 'Banff Social', jp: 'Banff Social Banff Ave', why: '菜单综合，出餐快，适合长者免等位。' },
      { n: 'Banff Ave 自选', jp: 'restaurants Banff Avenue', why: '主街全程步行可达，旺季 19:00 后普遍需等位。' }
    ]
  },

  'Canmore': {
    area: 'Canmore, Alberta',
    opts: [
      { n: 'Main Street 附近', tier: '$$', pick: true, q: 'Canmore Main Street hotel',
        why: '位于国家公园门外，免园区停车费，至 Banff 车程 20 分钟。餐厅密度较高。' }
    ],
    food: [
      { n: 'Canmore 主街', jp: 'restaurants Main Street Canmore', why: '价格低于 Banff，本地客流为主。' }
    ]
  },

  'Lake Louise': {
    area: 'Lake Louise Village',
    opts: [
      { n: 'Lake Louise 村内', tier: '$$$', pick: true, q: 'Lake Louise Village hotel',
        why: '距 Park and Ride 最近，早班车便捷。房源少且价格高。' },
      { n: 'Field 或 Golden', tier: '$$', q: 'Field BC accommodation',
        why: 'Field 位于 Yoho 内，至 Park and Ride 车程 20 分钟，价格差异显著。' }
    ],
    food: [
      { n: 'Bill Peytos Cafe', jp: 'Bill Peytos Cafe Lake Louise', why: '村内青旅餐厅，价格低于湖边选项。' },
      { n: '村内超市自备', jp: 'Lake Louise village grocery', why: '湖边无平价餐饮，建议清晨采购三明治携带上山。' }
    ]
  },

  'Jasper': {
    area: 'Jasper, Alberta',
    opts: [
      { n: '镇中心', tier: '$$', pick: true, q: 'Jasper Alberta hotel downtown',
        why: '2024 年山火后住宿供应仍在恢复，出发前确认开放状态。暗夜保护区，晴夜可见银河。' }
    ],
    food: [
      { n: 'Patricia Street 区域', jp: 'restaurants Patricia Street Jasper', why: '镇内餐厅集中于该街道。' }
    ]
  },

  'Kamloops': {
    area: 'Kamloops, BC',
    opts: [
      { n: '1 号公路旁连锁酒店', tier: '$', pick: true, q: 'Kamloops BC hotel highway',
        why: '仅过夜用途，便利优先。次日抵家约 4 小时。' },
      { n: '市中心 Victoria Street', tier: '$$', q: 'Kamloops downtown hotel',
        why: '餐厅步行可达，适合希望品质晚餐者。' }
    ],
    food: [
      { n: 'Victoria Street 区域', jp: 'restaurants Victoria Street Kamloops', why: '镇内餐厅集中于该街。' },
      { n: 'Red Collar Brewing', jp: 'Red Collar Brewing Kamloops', why: '本地精酿，驾驶者请勿饮用。' }
    ]
  },

  '机上': {
    area: '',
    opts: [],
    food: []
  }
};