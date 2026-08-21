/* ══════════════════════════════════════════════════════════════
   content.js — 这个行程的所有文字都在这里。
   改字只动这个文件，index.html 一行都不用碰。

   三条规矩：
   1. 单引号 ' 里不能再出现单引号。中文用「」。
   2. 每一项结尾的逗号别删。
   3. 改完提交，半分钟后刷新。白屏就按 F12 看 Console 红字。

   目录：
     LABELS / TXT  界面词与成段说明
     PEAK          各线路的变色窗口（页面顶上那张图的数据）
     REG / P       区域与地点
     TIMING        季节表
     V             四条线路，每天 drive 是当天开车小时数
     BROWS / TODOS 预算科目与行前待办
     STAY          每晚住宿方向与吃饭（文件最下面）
   ══════════════════════════════════════════════════════════════ */

const LABELS={
  cost:'Cost', peak:'变色窗口', drive:'开车强度', season:'什么时候去', weather:'天气',
  routes:'四条线路', switchPlan:'换一条看看', places:'沿途地点',
  ourPins:'加的点', bookings:'预订', prepList:'行前待办',
  reconcile:'实付对账', fx:'汇率', rules:'关于赏枫的三件事', compare:'四条线路的区别',
  aboutPage:'这个页面'
};

const TXT={
  peak:
    '横条是各线路的<b>变色高峰期</b>，竖线是你当前选的出发日和结束日。'
    +'重叠越多，看到满树颜色的概率越高。<br><br>'
    +'改右上角的日期，这张图会跟着重算。',

  season:
    '加拿大的秋色从北往南走，前后能拉开五到六周。'
    +'<br><br>育空和北部最早，九月中下旬就到头；安大略的 Algonquin 和魁北克的 Charlevoix '
    +'在九月底到十月初；Cape Breton 高地要到十月的头两周；再往南的新斯科舍海岸线则拖到十月中下旬。'
    +'<br><br>每年的实际时间会因天气前后浮动五到十天。冷夜配晴天出红色，暖而多云的九月会让颜色偏黄。'
    +'出发前一两周看各省的实时色彩地图，比看往年平均可靠得多。',

  drive:
    '横条是每天的开车小时数，超过 5 小时的那天会标红。'
    +'<br><br>赏枫本质上是公路旅行，好看的东西都在路上而不是终点，所以每天的车程不宜太满——'
    +'留出随时靠边停车的余量。',

  wxNote:
    '降水单位 mm。7 天预报现在没用，出发前一周开始每天看。上面那栏是去年同期实测。'
    +'秋天东部早晚接近零度、白天可能到十五度以上，分层穿。雨后落叶掉得很快。'
    +'数据 Open-Meteo（CC BY 4.0）。',

  itinHint: '点任意一天，地图跟随。左侧数字是当天开车小时数，红色表示超过 5 小时。',

  pinsEmpty:
    '还没人加过点。把行程码发给同行的人，你们加的观景点、餐厅、民宿会互相同步。'
    +'地图上长按也能直接落点。',

  bookingIntro:
    '这一栏是记录，不是建议。订好一项就打勾，填确认号和实付金额，同行的人都看得到，预算页会自动对账。',

  prepIntro:
    '按当前线路过滤。赏枫季的住宿是最紧的一项——热门区域通常要提前六到八周。',

  budgetNote:
    '全部按加元计。数字是估算，可以拖。'
    +'<br><br>四条线路都要从温哥华飞过去，机票是最大一笔。租车在赏枫季也会涨价，'
    +'尤其是十月的感恩节长周末前后。'
    +'<br><br>住宿差异最大：Algonquin 和 Charlevoix 的乡村旅舍旺季翻倍，'
    +'育空则是淡季价格，因为夏季旅游团已经走了。',

  noteHint: '写点只有到了才知道的：哪个观景台停车位多、几点光线最好、哪家关门了、哪里我写错了。这条会显示在我的描述上面。',

  aboutPage:
    '行程码决定你看到哪份数据。你和同行的人用同一个码，加的点会互相同步；换一个没人用过的码，就是一份空白行程，别人也能拿去建自己的。',
  aboutFoot:
    '共享数据对所有知道行程码的人可见。坐标为示意精度，变色窗口为常年区间，实际以各省当季色彩地图为准。'
};

/* ── 变色窗口：a/b 是高峰期，ea/eb 是有色但未到顶的区间 ── */
const PEAK=[
 {k:'A',n:'Algonquin / Muskoka', ea:'09-18',a:'09-25',b:'10-08',eb:'10-16',c:'#C8412B'},
 {k:'B',n:'Charlevoix / 魁北克',  ea:'09-20',a:'09-25',b:'10-08',eb:'10-18',c:'#E0A526'},
 {k:'C',n:'Cape Breton 高地',     ea:'09-22',a:'10-01',b:'10-14',eb:'10-24',c:'#B85C2E'},
 {k:'D',n:'育空 Yukon',           ea:'08-25',a:'09-01',b:'09-20',eb:'09-28',c:'#6FA07A'}
];

/* ── 关于赏枫的三件事 ── */
const RULES=[
 ['颜色从北往南走','育空九月中就到头，Algonquin 和 Charlevoix 在九月底到十月初，Cape Breton 高地要等到十月头两周。同一时间去不同地方，看到的是完全不同的阶段。'],
 ['每年浮动五到十天','冷夜配晴天出最艳的红；暖而多云的九月会让颜色偏黄。一场大风大雨能让高峰期直接结束。出发前一两周看实时色彩地图，别只信常年区间。'],
 ['十月的感恩节长周末是高峰','加拿大感恩节是十月第二个周一。那个周末全国出游，热门区域的住宿价格和路上车流都翻倍。能避开就避开。']
];

const COMPARE=[
 ['甲 · Algonquin + Muskoka','最经典的森林加湖泊。Highway 60 走廊在路边就能看，不用徒步；想深入就划独木舟进内湖。离多伦多近，机票和租车都最便宜。'],
 ['乙 · 魁北克 + Charlevoix','秋色之外还有法语古城和沿河的小镇。Route 362 那段被认为是全国最好的赏枫公路之一。内容最丰富，也最不像单纯的自然行程。'],
 ['丙 · Cape Breton + 新斯科舍','Cabot Trail 是海岸线加高地的组合，颜色映在大西洋上。十月上旬还有 Celtic Colours 音乐节。但高峰期比另外两条晚一到两周。'],
 ['丁 · 育空','荒野尺度完全不同，白桦和杨树的金色铺满整个山谷，加上极光机会。但九月下旬已经接近尾声，去晚了看到的是落叶后的褐色。']
];

/* ══════ 区域与地点 ══════ */
const REG={on:{n:'安大略',hex:'#C8412B'},qc:{n:'魁北克',hex:'#E0A526'},
           ns:{n:'新斯科舍',hex:'#B85C2E'},yt:{n:'育空',hex:'#6FA07A'},
           city:{n:'城市 / 枢纽',hex:'#7C8A86'}};
const P={};
const def=(id,zh,en,lat,lng,r,note,kind)=>P[id]={id,zh,en,lat,lng,r,note,kind};

/* — 安大略 — */
def('yyz','多伦多机场','Toronto Pearson YYZ',43.6777,-79.6248,'city','温哥华飞过来约 4.5 小时。租车柜台在航站楼，赏枫季提前订。','way');
def('toronto','多伦多','Toronto',43.6532,-79.3832,'city','头尾各留半天。市区本身的秋色一般，主要作为进出点。');
def('huntsville','Huntsville','Huntsville Ontario',45.3268,-79.2170,'on','进 Algonquin 前的最后一个像样的镇子，补给和加油在这里。');
def('algonquin','Algonquin 省立公园','Algonquin Provincial Park',45.5350,-78.6800,'on','加拿大最老的省立公园。Highway 60 走廊全长 56 公里，路边观景点一个接一个，不用徒步也能看饱。需要买日票。');
def('lookout','Lookout Trail','Lookout Trail Algonquin',45.5522,-78.5081,'on','来回 2.1 公里，最后一段爬坡，顶上是整片枫林的俯瞰。公园里最出名的短线，中午停车场会满。');
def('canoelake','Canoe Lake','Canoe Lake Algonquin',45.5333,-78.7167,'on','租独木舟的地方。划出去二十分钟就能离开人群，水面倒影是这条线最好的画面。');
def('bataclan','Beaver Pond Trail','Beaver Pond Trail Algonquin',45.5900,-78.4200,'on','来回 1.5 公里，平缓。清晨和傍晚常见到驼鹿。');
def('dorset','Dorset 观景塔','Dorset Lookout Tower',45.2400,-78.8900,'on','30 米高的塔，登顶看 Lake of Bays 的全景。赏枫季周末排队，工作日随到随上。');
def('arrowhead','Arrowhead 省立公园','Arrowhead Provincial Park',45.4000,-79.2000,'on','比 Algonquin 小得多也安静得多，适合 Algonquin 人太多时的替代。');
def('bracebridge','Bracebridge','Bracebridge Ontario',45.0400,-79.3000,'on','Muskoka 的中心镇，瀑布就在镇里。');
def('portcarling','Port Carling','Port Carling Ontario',45.1167,-79.5833,'on','Muskoka 湖区的船闸小镇，两湖之间的通道。');
def('bala','Bala','Bala Ontario',45.0167,-79.6167,'on','蔓越莓产区，十月初有 Cranberry Festival。');

/* — 魁北克 — */
def('yul','蒙特利尔机场','Montréal YUL',45.4706,-73.7408,'city','温哥华直飞约 5 小时。','way');
def('montreal','蒙特利尔','Montréal',45.5017,-73.5673,'qc','皇家山公园的观景台能俯瞰全城秋色。老城石板路适合走一整天。');
def('tremblant','Mont-Tremblant','Mont-Tremblant',46.1185,-74.5962,'qc','缆车上山看整片劳伦琴山脉，是最省力的全景。山下村子是行人区。');
def('quebeccity','魁北克老城','Vieux-Québec',46.8123,-71.2050,'qc','北美唯一还保留城墙的城市。石板街配秋色，走路就够，不用开车进城。');
def('montmorency','Montmorency 瀑布','Chute Montmorency',46.8905,-71.1475,'qc','83 米，比尼亚加拉还高。悬索桥横在瀑布顶上，秋天两侧全是红黄。');
def('orleans','奥尔良岛','Île d Orléans',46.9167,-70.9833,'qc','环岛一圈 67 公里，全是农场和果园。苹果酒和枫糖直接在农场买。');
def('baiestpaul','Baie-Saint-Paul','Baie-Saint-Paul',47.4419,-70.5044,'qc','Charlevoix 的门户，画廊小镇，太阳马戏团的发源地。');
def('route362','Route 362 沿河公路','Route 362 Charlevoix',47.5500,-70.3500,'qc','Baie-Saint-Paul 到 La Malbaie 之间的老路，一路起伏、圣劳伦斯河在右手边。被认为是全国最好的赏枫公路之一。别走 138 高速。');
def('lamalbaie','La Malbaie','La Malbaie',47.6533,-70.1533,'qc','Charlevoix 的另一端，河谷加悬崖。');
def('hautesgorges','Hautes-Gorges 国家公园','Parc national des Hautes-Gorges',47.8833,-70.4667,'qc','加拿大东部最深的峡谷之一。可以坐船进去看两侧的峭壁，秋天颜色从水面一直铺到山顶。');
def('lemassif','Le Massif 缆车','Le Massif de Charlevoix',47.2833,-70.5833,'qc','落差 770 米，缆车上去正对圣劳伦斯河。');
def('tadoussac','Tadoussac','Tadoussac',48.1400,-69.7167,'qc','萨格奈峡湾口，看鲸的季节到九月底基本结束，去晚了可能只剩风景。');

/* — 新斯科舍 — */
def('yhz','哈利法克斯机场','Halifax YHZ',44.8808,-63.5086,'city','温哥华飞过来通常要转一次，全程 8 到 10 小时。','way');
def('halifax','哈利法克斯','Halifax',44.6488,-63.5752,'ns','进出点。城堡山和海滨步道半天够。');
def('peggys','Peggys Cove','Peggys Cove',44.4919,-63.9169,'ns','花岗岩上的白色灯塔，新斯科舍最有名的一张照片。岩石湿滑时不要靠近水线。');
def('lunenburg','Lunenburg','Lunenburg Nova Scotia',44.3777,-64.3158,'ns','世界遗产的彩色木屋老城，十八世纪的街道格局原样保留。');
def('mahonebay','Mahone Bay','Mahone Bay',44.4494,-64.3819,'ns','三座教堂并排在海湾边。十月整月镇上摆满稻草人。');
def('baddeck','Baddeck','Baddeck Nova Scotia',46.1000,-60.7500,'ns','Cabot Trail 的传统起点，贝尔的故居和博物馆在这里。');
def('cabottrail','Cabot Trail','Cabot Trail',46.7000,-60.6000,'ns','全长约 300 公里的环线，三分之一穿过 Cape Breton 高地国家公园。逆时针开的话内侧车道靠山，顺时针则靠海。');
def('skyline','Skyline Trail','Skyline Trail Cape Breton',46.7503,-60.8836,'ns','环线 7.5 公里，尽头是伸向大西洋的木栈台。日落时最好，但要留出走回来的时间和头灯。');
def('cheticamp','Chéticamp','Cheticamp Nova Scotia',46.6333,-61.0000,'ns','阿卡迪亚人的渔镇，法语区。环线西侧的住宿基地。');
def('ingonish','Ingonish','Ingonish Nova Scotia',46.6833,-60.3833,'ns','环线东侧的基地，Keltic Lodge 那片海岬视野很好。');
def('meatcove','Meat Cove','Meat Cove Nova Scotia',47.0333,-60.5500,'ns','岛的最北端，最后十几公里是碎石路。开过去的人不多，因此也最安静。');
def('louisbourg','Louisbourg 要塞','Fortress of Louisbourg',45.9214,-59.9714,'ns','北美最大的历史重建项目，穿着十八世纪服装的工作人员在里面生活。十月中之后关门。');
def('wolfville','Wolfville / Annapolis Valley','Wolfville Nova Scotia',45.0917,-64.3644,'ns','苹果和葡萄酒产区，秋收季节。颜色比高地晚两周。');

/* — 育空 — */
def('yxy','白马机场','Whitehorse YXY',60.7096,-135.0678,'city','温哥华直飞约 2.5 小时，是四条线里飞行时间最短的。','way');
def('whitehorse','白马市','Whitehorse',60.7212,-135.0568,'yt','育空首府，人口两万多。所有补给、租车、极光团都从这里出发。');
def('milescanyon','Miles Canyon','Miles Canyon Whitehorse',60.6800,-135.0000,'yt','育空河切出的玄武岩峡谷，离市区十分钟，步道平缓。');
def('carcross','Carcross','Carcross Yukon',60.1667,-134.7000,'yt','世界最小沙漠就在镇边。往南开是通往阿拉斯加的 South Klondike Highway。');
def('emeraldyt','Emerald Lake','Emerald Lake Yukon',60.4833,-134.7167,'yt','碳酸钙让湖水呈现不真实的绿松色，路边就能看。');
def('kluane','Kluane 国家公园','Kluane National Park',60.7522,-137.5108,'yt','加拿大最高峰所在地，也是世界最大的非极地冰原。Haines Junction 是门户镇。');
def('kathleen','Kathleen Lake','Kathleen Lake Kluane',60.5667,-137.3667,'yt','Kluane 里最容易到达的湖，湖边步道平缓，背后是雪山。');
def('takhini','Takhini 温泉','Takhini Hot Pools',60.8833,-135.3500,'yt','白马市外三十分钟，露天温泉。看极光等待的时候泡着最舒服。');
def('tombstone','Tombstone territorial 公园','Tombstone Territorial Park',64.5167,-138.2167,'yt','Dempster Highway 上的苔原公园，秋色是矮灌木的红和金，和森林完全不同。从白马开过去很远，要单独安排两三天。');
def('dawson','Dawson City','Dawson City Yukon',64.0601,-139.4333,'yt','淘金热留下的木板路小镇，全城没有铺装路面。从白马开过去六小时。');
def('aurora','极光观测点','Aurora Viewing Whitehorse',60.8500,-135.2000,'yt','白马市郊的暗天区。九月下旬开始夜长足够，晴天概率也不错。团通常晚上十点出发，凌晨两点回。');

/* ══════ 季节表 ══════ */
const GCOL=['#E6E2D8','#DCCBA6','#D19A4E','#C8412B'];
const H2=['#E6E2D8','#DFD3B4','#C9A96A','#8E6B3A'];
const TIMING={
  cols:[{k:'9月上',pk:0},{k:'9月中',pk:0},{k:'9月下',pk:1},{k:'10月上',pk:1},{k:'10月中',pk:0},{k:'10月下',pk:0},{k:'11月',pk:0}],
  rows:[
    {n:'Algonquin',v:[0,1,3,3,2,1,0],c:GCOL},
    {n:'Charlevoix',v:[0,1,3,3,2,1,0],c:GCOL},
    {n:'Cape Breton',v:[0,1,2,3,3,2,0],c:GCOL},
    {n:'育空',v:[2,3,2,1,0,0,0],c:GCOL},
    {n:'人 / 价',v:[1,1,2,3,2,1,0],c:H2}
  ]
};

/* ══════ 四条线路 ══════ */
const V={
A:{k:'A',gr:'甲',name:'Algonquin + Muskoka',met:'6 DAYS · 安大略',hex:'#C8412B',tag:'最经典',
  start:'2026-09-27', dates:'2026.09.27 → 10.02',
  pitch:'最经典的森林加湖泊组合。Highway 60 走廊 56 公里，路边观景点一个接一个，'
    +'不用徒步就能看饱；想要更好的画面就划独木舟进内湖，二十分钟就能甩掉人群。\n\n'
    +'离多伦多两个半小时，四条线里机票和租车都最便宜，节奏也最松。',
  cons:'Algonquin 是这几条线里游客最集中的，周末的 Highway 60 停车场十点就满。尽量安排在工作日。\n\n'
    +'公园里手机信号很差，住宿要提前订——赏枫季 Huntsville 一带经常一房难求。',
  budget:{air:1300,car:600,stay:1100,food:700,park:120,tickets:200,shop:200,misc:250},
  days:[
   {d:'09.27',w:'',t:'温哥华 → 多伦多 → Huntsville',r:'city',stay:'Huntsville',drive:2.5,
    sig:'全程有信号。',
    note:'飞行约 4.5 小时，落地取车往北开。今天不进公园。',stops:[
     {t:'—',p:'yyz',n:'YYZ 落地取车',s:'赏枫季租车要提前订'},
     {t:'晚',p:'huntsville',n:'Huntsville 入住',s:'补给和加油在这里做完'}]},
   {d:'09.28',w:'',t:'Algonquin · Highway 60 走廊',r:'on',stay:'Huntsville',drive:3,
    sig:'公园内大段无信号，离线地图先下好。',
    note:'公园需要买日票，西门进。今天以路边观景为主。',stops:[
     {t:'早',p:'algonquin',n:'西门买日票',s:'早去，中午停车场会满'},
     {t:'—',p:'lookout',n:'Lookout Trail',s:'来回 2.1 公里，最后一段爬坡，顶上是整片枫林'},
     {t:'—',p:'bataclan',n:'Beaver Pond Trail',s:'来回 1.5 公里，平缓，清晨傍晚常见驼鹿'}]},
   {d:'09.29',w:'',t:'Algonquin · 独木舟日',r:'on',stay:'Huntsville',drive:2.5,
    sig:'湖上完全无信号。',
    note:'划出去二十分钟就能离开人群，水面倒影是这条线最好的画面。风大就取消。',stops:[
     {t:'早',p:'canoelake',n:'Canoe Lake 租独木舟',s:'半天足够，救生衣必穿'},
     {t:'下午',p:'algonquin',n:'游客中心 + 色彩报告',s:'每天更新变色进度'}]},
   {d:'09.30',w:'',t:'Muskoka 湖区',r:'on',stay:'Bracebridge',drive:3,
    sig:'镇上正常，湖区公路时断时续。',
    note:'比 Algonquin 安静，风格从森林转成湖畔小镇。',stops:[
     {t:'—',p:'dorset',n:'Dorset 观景塔',s:'30 米，登顶看 Lake of Bays 全景'},
     {t:'—',p:'portcarling',n:'Port Carling',s:'两湖之间的船闸小镇'},
     {t:'晚',p:'bracebridge',n:'Bracebridge',s:'瀑布就在镇里'}]},
   {d:'10.01',w:'',t:'Muskoka → 多伦多',r:'city',stay:'多伦多',drive:2.5,
    sig:'全程正常。',
    note:'路上可以拐 Bala 看蔓越莓收成。',stops:[
     {t:'—',p:'bala',n:'Bala（可选）',s:'十月初有 Cranberry Festival'},
     {t:'晚',p:'toronto',n:'多伦多入住',s:''}]},
   {d:'10.02',w:'',t:'多伦多 → 温哥华',r:'city',stay:'—',drive:1,
    sig:'全程正常。',
    note:'留足还车时间。',stops:[{t:'—',p:'yyz',n:'还车',s:''}]}
  ]},

B:{k:'B',gr:'乙',name:'魁北克 + Charlevoix',met:'8 DAYS · 魁北克',hex:'#E0A526',tag:'最丰富',
  start:'2026-09-26', dates:'2026.09.26 → 10.03',
  pitch:'秋色之外还有一座法语古城和一整条沿河的小镇线。'
    +'Route 362 从 Baie-Saint-Paul 到 La Malbaie 那段，是全国公认最好的赏枫公路之一。\n\n'
    +'内容最丰富的一条：老城、峡谷、缆车、果园、峡湾，每天的画面都不重样。',
  cons:'开车时间比方案甲多，八天里有三天在三小时以上。\n\n'
    +'如果日期撞上十月第二个周一的感恩节长周末，Charlevoix 的住宿会翻倍且很难订。',
  budget:{air:1500,car:700,stay:1600,food:1000,park:100,tickets:350,shop:300,misc:300},
  days:[
   {d:'09.26',w:'',t:'温哥华 → 蒙特利尔',r:'city',stay:'蒙特利尔',drive:1,
    sig:'全程正常。',note:'直飞约 5 小时，时差 3 小时。今天不开长途。',stops:[
     {t:'—',p:'yul',n:'YUL 落地取车',s:''},{t:'晚',p:'montreal',n:'蒙特利尔入住',s:''}]},
   {d:'09.27',w:'',t:'Mont-Tremblant',r:'qc',stay:'Mont-Tremblant',drive:2,
    sig:'村里有 wifi，山上信号弱。',note:'缆车上山看整片劳伦琴山脉，是最省力的全景。',stops:[
     {t:'—',p:'tremblant',n:'缆车 + 山下村子',s:'行人区，车停外面'}]},
   {d:'09.28',w:'',t:'→ 魁北克城',r:'qc',stay:'魁北克城',drive:3.5,
    sig:'高速沿线正常。',note:'车停城外，老城全程步行。',stops:[
     {t:'—',p:'quebeccity',n:'老城',s:'北美唯一还保留城墙的城市'}]},
   {d:'09.29',w:'',t:'瀑布 + 奥尔良岛',r:'qc',stay:'魁北克城',drive:2,
    sig:'正常。',note:'',stops:[
     {t:'早',p:'montmorency',n:'Montmorency 瀑布',s:'83 米，比尼亚加拉还高，悬索桥横在顶上'},
     {t:'下午',p:'orleans',n:'奥尔良岛',s:'环岛 67 公里，苹果酒和枫糖在农场买'}]},
   {d:'09.30',w:'',t:'进 Charlevoix · Route 362',r:'qc',stay:'Baie-Saint-Paul',drive:2.5,
    sig:'河谷段时断时续。',note:'走老路 362，不要走 138 高速——整条线的重点就在这段路上。',stops:[
     {t:'—',p:'lemassif',n:'Le Massif 缆车',s:'落差 770 米，正对圣劳伦斯河'},
     {t:'—',p:'route362',n:'Route 362',s:'一路起伏，河在右手边'},
     {t:'晚',p:'baiestpaul',n:'Baie-Saint-Paul',s:'画廊小镇'}]},
   {d:'10.01',w:'',t:'Hautes-Gorges 峡谷',r:'qc',stay:'La Malbaie',drive:3,
    sig:'公园内无信号。',note:'加拿大东部最深的峡谷之一，可以坐船进去看两侧峭壁。',stops:[
     {t:'—',p:'hautesgorges',n:'Hautes-Gorges',s:'颜色从水面铺到山顶'},
     {t:'晚',p:'lamalbaie',n:'La Malbaie',s:''}]},
   {d:'10.02',w:'',t:'Tadoussac 或 返程',r:'qc',stay:'魁北克城',drive:4,
    sig:'峡湾一带弱。',note:'看鲸季节到九月底基本结束，去晚了可能只剩风景。不去的话直接慢慢开回魁北克城。',stops:[
     {t:'—',p:'tadoussac',n:'Tadoussac（可选）',s:'萨格奈峡湾口'}]},
   {d:'10.03',w:'',t:'→ 蒙特利尔 → 温哥华',r:'city',stay:'—',drive:3,
    sig:'正常。',note:'魁北克城到 YUL 约 3 小时，留足还车时间。',stops:[{t:'—',p:'yul',n:'还车',s:''}]}
  ]},

C:{k:'C',gr:'丙',name:'Cape Breton + 新斯科舍',met:'8 DAYS · 大西洋',hex:'#B85C2E',tag:'海岸线',
  start:'2026-10-01', dates:'2026.10.01 → 10.08',
  pitch:'Cabot Trail 是海岸线和高地的组合，颜色直接映在大西洋上，'
    +'这是另外三条线都没有的画面。十月上旬还有 Celtic Colours 音乐节，'
    +'九天里全岛几十个村子都有演出。\n\n'
    +'南边的 Lunenburg、Mahone Bay、Peggys Cove 顺路收掉，秋色之外还有灯塔和渔村。',
  cons:'<b>高峰期比另外两条东部线晚一到两周</b>，Cape Breton 高地通常在十月的头两周才到顶。'
    +'如果你的日期在九月下旬，这条线会偏早。\n\n'
    +'温哥华飞哈利法克斯通常要转一次，全程 8 到 10 小时，是四条线里路上最久的。',
  budget:{air:1700,car:750,stay:1400,food:900,park:120,tickets:250,shop:250,misc:300},
  days:[
   {d:'10.01',w:'',t:'温哥华 → 哈利法克斯',r:'city',stay:'哈利法克斯',drive:1,
    sig:'正常。',note:'通常要转一次，全程 8 到 10 小时。时差 4 小时。',stops:[
     {t:'—',p:'yhz',n:'YHZ 落地取车',s:''},{t:'晚',p:'halifax',n:'哈利法克斯入住',s:''}]},
   {d:'10.02',w:'',t:'南岸 · 灯塔与渔村',r:'ns',stay:'Lunenburg',drive:3,
    sig:'正常。',note:'',stops:[
     {t:'—',p:'peggys',n:'Peggys Cove',s:'岩石湿滑时不要靠近水线'},
     {t:'—',p:'mahonebay',n:'Mahone Bay',s:'三座教堂并排；十月整月摆稻草人'},
     {t:'晚',p:'lunenburg',n:'Lunenburg',s:'世界遗产的彩色木屋老城'}]},
   {d:'10.03',w:'',t:'→ Baddeck',r:'ns',stay:'Baddeck',drive:5.5,
    sig:'高速沿线正常。',note:'今天开得最久，中途在 Truro 一带停一次。',stops:[
     {t:'晚',p:'baddeck',n:'Baddeck',s:'Cabot Trail 的传统起点'}]},
   {d:'10.04',w:'',t:'Cabot Trail 西段',r:'ns',stay:'Chéticamp',drive:3,
    sig:'高地公园内大段无信号。',note:'逆时针开，内侧靠山；想靠海就顺时针。',stops:[
     {t:'—',p:'cabottrail',n:'Cabot Trail',s:'三分之一穿过高地国家公园，需要买日票'},
     {t:'傍晚',p:'skyline',n:'Skyline Trail',s:'环线 7.5 公里，日落最好，带头灯'},
     {t:'晚',p:'cheticamp',n:'Chéticamp',s:'阿卡迪亚渔镇，法语区'}]},
   {d:'10.05',w:'',t:'北端 · Meat Cove',r:'ns',stay:'Ingonish',drive:3.5,
    sig:'北端几乎完全无信号。',note:'最后十几公里是碎石路，开慢一点。天气不好就跳过。',stops:[
     {t:'—',p:'meatcove',n:'Meat Cove',s:'岛的最北端，最安静'},
     {t:'晚',p:'ingonish',n:'Ingonish',s:'环线东侧的基地'}]},
   {d:'10.06',w:'',t:'Louisbourg 要塞',r:'ns',stay:'Baddeck',drive:3,
    sig:'正常。',note:'十月中之后关门，去之前查开放日。',stops:[
     {t:'—',p:'louisbourg',n:'Louisbourg',s:'北美最大的历史重建项目'}]},
   {d:'10.07',w:'',t:'→ Annapolis Valley',r:'ns',stay:'Wolfville',drive:5,
    sig:'正常。',note:'苹果和葡萄酒产区，秋收季节。这里的颜色比高地晚两周。',stops:[
     {t:'晚',p:'wolfville',n:'Wolfville',s:''}]},
   {d:'10.08',w:'',t:'→ 哈利法克斯 → 温哥华',r:'city',stay:'—',drive:1.5,
    sig:'正常。',note:'',stops:[{t:'—',p:'yhz',n:'还车',s:''}]}
  ]},

D:{k:'D',gr:'丁',name:'育空 · 荒野与极光',met:'6 DAYS · 育空',hex:'#6FA07A',tag:'看时机',
  start:'2026-09-12', dates:'2026.09.12 → 09.17',
  pitch:'荒野的尺度和另外三条完全不同：白桦和杨树的金色铺满整个山谷，'
    +'背后是 Kluane 的雪山和冰原。加上九月下旬开始夜长足够，有极光机会。\n\n'
    +'温哥华直飞白马市只要 2.5 小时，是四条线里飞行时间最短的。',
  cons:'<b>时机最紧</b>：育空的秋色九月中就到头，九月下旬已经接近尾声，'
    +'去晚了看到的是落叶后的褐色。想赏枫就必须把日期提到九月上中旬。\n\n'
    +'如果主要目标是极光，反而越晚越好——那样这条线就不该按赏枫来排。\n\n'
    +'Tombstone 和 Dawson City 都在很远的北边，六天塞不进去，要另加两三天。',
  budget:{air:900,car:750,stay:900,food:700,park:80,tickets:400,shop:150,misc:300},
  days:[
   {d:'09.12',w:'',t:'温哥华 → 白马市',r:'city',stay:'白马市',drive:0.5,
    sig:'市区正常。',note:'直飞 2.5 小时。今天轻松，晚上如果晴就先看一次极光。',stops:[
     {t:'—',p:'yxy',n:'YXY 落地取车',s:''},
     {t:'—',p:'whitehorse',n:'白马市入住',s:'补给在这里做完，出城后没有超市'},
     {t:'夜',p:'aurora',n:'极光（看天）',s:'团通常十点出发，凌晨两点回'}]},
   {d:'09.13',w:'',t:'白马周边 + 南线',r:'yt',stay:'白马市',drive:3,
    sig:'南线公路时断时续。',note:'',stops:[
     {t:'早',p:'milescanyon',n:'Miles Canyon',s:'离市区十分钟，步道平缓'},
     {t:'—',p:'emeraldyt',n:'Emerald Lake',s:'碳酸钙让湖水呈绿松色，路边就能看'},
     {t:'—',p:'carcross',n:'Carcross',s:'世界最小沙漠就在镇边'}]},
   {d:'09.14',w:'',t:'Kluane 国家公园',r:'yt',stay:'Haines Junction',drive:3.5,
    sig:'公园内基本无信号。',note:'加拿大最高峰所在地，也是世界最大的非极地冰原。',stops:[
     {t:'—',p:'kluane',n:'Haines Junction 游客中心',s:''},
     {t:'—',p:'kathleen',n:'Kathleen Lake',s:'湖边步道平缓，背后是雪山'}]},
   {d:'09.15',w:'',t:'Kluane 深入 或 观光飞行',r:'yt',stay:'Haines Junction',drive:2,
    sig:'无信号。',note:'冰原观光飞行是看 Kluane 的唯一实际方式，天气说了算，要留备用日。',stops:[
     {t:'—',p:'kluane',n:'冰原观光飞行（可选）',s:'天气不好会取消，提前订并留缓冲'}]},
   {d:'09.16',w:'',t:'回白马 + 温泉 + 极光',r:'yt',stay:'白马市',drive:2,
    sig:'市区正常。',note:'泡着温泉等极光是本地人的做法。',stops:[
     {t:'—',p:'takhini',n:'Takhini 温泉',s:'市外三十分钟，露天'},
     {t:'夜',p:'aurora',n:'极光',s:''}]},
   {d:'09.17',w:'',t:'白马市 → 温哥华',r:'city',stay:'—',drive:0.5,
    sig:'正常。',note:'',stops:[{t:'—',p:'yxy',n:'还车',s:''}]}
  ]}
};

const BROWS=[
 {k:'air', n:'国际机票', s:'YVR ⇄ 目的地 · 两人', max:5000},
 {k:'car', n:'租车', s:'赏枫季涨价，感恩节长周末尤甚', max:2000},
 {k:'stay',n:'住宿', s:'热门区域提前六到八周订', max:4000},
 {k:'food',n:'餐饮', s:'小镇餐厅关得早，备些干粮', max:2500},
 {k:'park',n:'公园门票', s:'省立 / 国家公园日票', max:400},
 {k:'tickets',n:'活动 · 门票', s:'缆车 / 独木舟 / 观光飞行 / 音乐节', max:1500},
 {k:'shop',n:'购物', s:'枫糖、苹果酒、手工', max:1000},
 {k:'misc',n:'保险 · 杂项', s:'', max:1000}
];

const TODOS=[
 {id:'f1',n:'订住宿（最紧的一项）',s:'赏枫季热门区域提前六到八周。Algonquin 周边和 Charlevoix 尤其难订',due:'现在',v:'ABCD'},
 {id:'f2',n:'订机票和租车',s:'四条线都要飞。租车在赏枫季涨价明显，越早越好',due:'现在',v:'ABCD'},
 {id:'f3',n:'避开感恩节长周末',s:'加拿大感恩节是十月第二个周一。那个周末住宿翻倍、路上堵',due:'现在',v:'ABC'},
 {id:'f4',n:'查实时色彩地图',s:'安大略省立公园、Bonjour Québec、新斯科舍自然资源厅都有每周更新的色彩报告。出发前一两周开始看',due:'出发前 2 周',v:'ABCD'},
 {id:'f5',n:'买公园日票',s:'Algonquin、Cape Breton 高地、Hautes-Gorges 都要单独买票，部分可以线上先买',due:'出发前 1 周',v:'ABC'},
 {id:'f6',n:'订独木舟 / 缆车 / 观光飞行',s:'Canoe Lake 租船、Tremblant 和 Le Massif 缆车、Kluane 冰原飞行都建议提前',due:'出发前 1 周',v:'ABD'},
 {id:'f7',n:'查 Celtic Colours 演出表',s:'十月上旬 Cape Breton 全岛几十个村子有演出，票要单独买',due:'出发前 1 月',v:'C'},
 {id:'f8',n:'极光准备',s:'查 KP 指数和月相，满月会压低对比。带三脚架、备用电池、手套',due:'出发前 1 周',v:'D'},
 {id:'f9',n:'分层衣物',s:'东部早晚接近零度、白天可能十五度以上。育空更冷，要带真正的冬装',due:'出发前',v:'ABCD'},
 {id:'f10',n:'下载离线地图',s:'Algonquin、Cape Breton 高地、Kluane 都有大段无信号',due:'出发前',v:'ABCD'},
 {id:'f11',n:'注意驼鹿和野生动物',s:'清晨傍晚是活动高峰，公路上撞到驼鹿非常危险。天黑后减速',due:'出发前',v:'ABD'},
 {id:'f12',n:'带现金',s:'小镇的农场摊位和部分渔村店只收现金',due:'出发前',v:'ABC'}
];

/* ══════ 每晚住宿与吃饭 ══════ */
const STAY={
 'Huntsville':{area:'Huntsville, Ontario',
  opts:[{n:'镇上或 Deerhurst 一带',tier:'$$',pick:true,q:'Huntsville Ontario hotel',
    why:'进 Algonquin 西门 40 分钟，补给齐全。赏枫季一房难求，提前六到八周订。'},
   {n:'Algonquin 门口的 lodge',tier:'$$$',q:'Algonquin Park lodge',
    why:'省掉每天的通勤，但价格高、选择少，且多数不含 wifi。'}],
  food:[{n:'镇上的主街',jp:'restaurants Main Street Huntsville',why:'小镇餐厅关得早，八点后基本只剩快餐。'},
   {n:'超市备干粮',jp:'grocery Huntsville Ontario',why:'公园里没有像样的吃的，早上买好带进去。'}]},
 'Bracebridge':{area:'Bracebridge, Muskoka',
  opts:[{n:'镇中心',tier:'$$',pick:true,q:'Bracebridge Ontario hotel',why:'瀑布就在镇里，走路可达餐厅。'}],
  food:[{n:'主街',jp:'restaurants Bracebridge',why:''}]},
 '多伦多':{area:'Downtown Toronto',
  opts:[{n:'市中心',tier:'$$',pick:true,q:'Downtown Toronto hotel',why:'头尾各一晚，靠近地铁就行。'},
   {n:'机场附近',tier:'$',q:'Toronto Pearson airport hotel',why:'只在赶早班机时选。'}],
  food:[{n:'Kensington Market 一带',jp:'Kensington Market Toronto restaurants',why:'选择多，价格正常。'}]},
 '蒙特利尔':{area:'Vieux-Montréal / Plateau',
  opts:[{n:'Plateau 或老城',tier:'$$',pick:true,q:'Plateau Montreal hotel',why:'走路能到餐厅和公园，停车要单独确认。'}],
  food:[{n:'烟熏肉',jp:'smoked meat Montreal',why:'蒙特利尔的招牌。'},
   {n:'Mile End 的贝果',jp:'bagel Mile End Montreal',why:'24 小时营业，现烤。'}]},
 'Mont-Tremblant':{area:'Mont-Tremblant village',
  opts:[{n:'山下行人村',tier:'$$$',pick:true,q:'Mont Tremblant village hotel',
    why:'车停外面，村里全是行人区。缆车站就在旁边。'},
   {n:'Saint-Jovite（老镇）',tier:'$$',q:'Saint Jovite Mont Tremblant hotel',
    why:'开车十分钟，便宜一档，本地感更强。'}],
  food:[{n:'村里的餐厅',jp:'restaurants Mont Tremblant village',why:'旅游价，但位置方便。'}]},
 '魁北克城':{area:'Vieux-Québec',
  opts:[{n:'老城城墙内',tier:'$$$',pick:true,q:'Vieux Quebec hotel',
    why:'石板街走路就够，不用开车进城。停车要另外找车位。'},
   {n:'Saint-Roch 区',tier:'$$',q:'Saint Roch Quebec City hotel',
    why:'走上去老城十五分钟，价格低一截，餐厅更本地。'}],
  food:[{n:'Petit-Champlain 一带',jp:'Petit Champlain Quebec restaurants',why:'游客多但确实好看。'},
   {n:'Poutine',jp:'poutine Quebec City',why:'来都来了。'}]},
 'Baie-Saint-Paul':{area:'Baie-Saint-Paul, Charlevoix',
  opts:[{n:'主街上的乡村旅舍',tier:'$$',pick:true,q:'Baie Saint Paul auberge',
    why:'画廊小镇，走路逛完。赏枫季提前订，感恩节长周末会翻倍。'}],
  food:[{n:'主街的小馆子',jp:'restaurants Baie Saint Paul',why:'Charlevoix 是美食产区，本地奶酪值得试。'}]},
 'La Malbaie':{area:'La Malbaie, Charlevoix',
  opts:[{n:'河谷或悬崖边',tier:'$$',pick:true,q:'La Malbaie hotel',why:'挑能看到圣劳伦斯河的房间。'}],
  food:[{n:'镇上',jp:'restaurants La Malbaie',why:''}]},
 '哈利法克斯':{area:'Halifax waterfront',
  opts:[{n:'海滨一带',tier:'$$',pick:true,q:'Halifax waterfront hotel',why:'走路到步道和餐厅，头尾各一晚。'}],
  food:[{n:'龙虾卷和海鲜',jp:'lobster roll Halifax',why:'秋天是龙虾季的开始。'}]},
 'Lunenburg':{area:'Old Town Lunenburg',
  opts:[{n:'老城的彩色木屋 B&B',tier:'$$',pick:true,q:'Lunenburg Nova Scotia inn',
    why:'世界遗产老城，房子本身就是看点。停车在坡上。'}],
  food:[{n:'海滨餐厅',jp:'restaurants Lunenburg waterfront',why:'十月中之后不少店转淡季营业时间。'}]},
 'Baddeck':{area:'Baddeck, Cape Breton',
  opts:[{n:'湖边旅馆',tier:'$$',pick:true,q:'Baddeck Nova Scotia inn',
    why:'Cabot Trail 的起点，Celtic Colours 期间会满。'}],
  food:[{n:'镇上',jp:'restaurants Baddeck',why:'选择少，早点吃。'}]},
 'Chéticamp':{area:'Chéticamp, Cape Breton',
  opts:[{n:'镇上或海边',tier:'$$',pick:true,q:'Cheticamp Nova Scotia accommodation',
    why:'环线西侧的基地，阿卡迪亚渔镇，法语区。'}],
  food:[{n:'阿卡迪亚菜',jp:'Acadian restaurant Cheticamp',why:'和新斯科舍其他地方的口味不一样。'}]},
 'Ingonish':{area:'Ingonish, Cape Breton',
  opts:[{n:'Keltic Lodge 一带',tier:'$$$',pick:true,q:'Ingonish Nova Scotia lodge',
    why:'海岬上视野最好，十月中之后部分关门。'},
   {n:'Ingonish Beach 附近的汽车旅馆',tier:'$',q:'Ingonish motel',why:'便宜很多。'}],
  food:[{n:'镇上',jp:'restaurants Ingonish',why:'淡季选择很少，提前确认营业。'}]},
 'Wolfville':{area:'Wolfville, Annapolis Valley',
  opts:[{n:'镇上的 B&B',tier:'$$',pick:true,q:'Wolfville Nova Scotia inn',why:'酒庄和果园就在周围。'}],
  food:[{n:'酒庄餐厅',jp:'winery restaurant Wolfville',why:'秋收季节，要订位。'}]},
 '白马市':{area:'Whitehorse, Yukon',
  opts:[{n:'市中心',tier:'$$',pick:true,q:'Whitehorse Yukon hotel downtown',
    why:'走路到餐厅和极光团集合点。九月已是淡季，价格比夏天低。'}],
  food:[{n:'市中心 Main Street',jp:'restaurants Main Street Whitehorse',why:'选择比想象中多。'},
   {n:'超市备干粮',jp:'grocery Whitehorse',why:'出城后没有超市。'}]},
 'Haines Junction':{area:'Haines Junction, Yukon',
  opts:[{n:'镇上的小旅馆',tier:'$',pick:true,q:'Haines Junction Yukon motel',
    why:'Kluane 的门户，选择极少，务必提前订。'}],
  food:[{n:'镇上',jp:'restaurants Haines Junction',why:'只有几家，关得很早。'}]},
 '机上':{area:'',opts:[],food:[]}
};
