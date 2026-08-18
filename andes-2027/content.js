/* ══════════════════════════════════════════════════════════════
   content.js — 这个行程的所有文字都在这里。
   改字只动这个文件，index.html 一行都不用碰。

   三条规矩：
   1. 单引号 ' 里不能再出现单引号。中文用「」。
   2. 每一项结尾的逗号别删。
   3. 改完提交，半分钟后刷新。白屏就按 F12 看 Console 红字。

   目录：
     LABELS / TXT  界面词与成段说明
     REG / P       区域与地点（alt 是海拔，米）
     TIMING        四趟的季节表
     V             四趟行程，每天 alt 是当晚睡觉的海拔
     BROWS         预算科目
     TODOS         行前待办
     STAY          每晚住宿方向与吃饭（文件最下面）
   ══════════════════════════════════════════════════════════════ */

const LABELS={
  cost:'Cost', alt:'海拔曲线', season:'四趟怎么分', weather:'天气',
  routes:'四趟行程', switchPlan:'看看别的一趟', places:'沿途地点',
  ourPins:'两个人加的', bookings:'预订', prepList:'行前待办',
  reconcile:'实付对账', fx:'汇率', rules:'高原反应的三条规则',
  compare:'四趟的季节冲突', aboutPage:'这个页面'
};

const TXT={
  season:
    '这四块地方没有一个共同的最佳月份，所以拆成四趟，各去各的季节。'
    +'<br><br>秘鲁旱季是 5–9 月；乌尤尼要看镜面得赶 12–4 月的雨季；'
    +'巴塔哥尼亚徒步季是 11–3 月的南半球夏天；哥伦比亚和巴西的干季在 12–3 月。'
    +'秘鲁的旱季和乌尤尼的镜面季正好相反，硬凑成一趟只能牺牲其中一个。'
    +'<br><br>拆开的另一个好处是每趟都能放慢：两周左右，落地缓两天，不赶。',

  alt:
    '横条是当晚睡觉的海拔。<b>规则是睡得低、玩得高</b>：白天可以上到 4000 米以上，'
    +'但过夜的海拔一天最好不要涨超过 500 米。'
    +'<br><br>红色标记表示当晚比前一晚高出太多，那几天要留意身体反应。',

  wxNote:
    '降水单位 mm。7 天预报现在没用，出发前两周开始看。上面那栏是去年同期实测，'
    +'用来判断这个时间窗的雨量和温度。安第斯山区昼夜温差极大，白天二十度晚上接近零度是常态。'
    +'数据 Open-Meteo（CC BY 4.0）。',

  itinHint: '点任意一天，地图跟随。左侧数字是当晚睡觉的海拔，红色表示比前一晚升得快。',

  pinsEmpty:
    '还没人加过点。把行程码发给同行的人，你们加的餐厅、想住的地方、想拍的机位会互相同步。'
    +'地图上长按也能直接落点。',

  bookingIntro:
    '这一栏是记录，不是建议。订好一项就打勾，填确认号和实付金额，两个人都看得到，预算页会自动对账。',

  prepIntro:
    '按当前这一趟过滤。南美有几项是硬门槛：马丘比丘门票分线路限额、'
    +'托雷斯德帕因的营地和山屋必须先订才让进、黄热病疫苗有些线路会查。',

  budgetNote:
    '写这版时约 1 CAD ≈ 0.73 USD。数字是估算，全部可调。'
    +'<br><br>南美的机票占比比亚洲高很多，因为境内航段多且贵。'
    +'巴塔哥尼亚那趟尤其明显：El Calafate 和 Punta Arenas 之间基本只能飞或者坐很久的大巴。'
    +'反过来，当地的吃住比日本便宜不少，秘鲁一顿正经的午市套餐（menú）通常十几索尔。',

  noteHint: '写点只有到了才知道的：几点没人、多少钱、哪家关门了、哪里我写错了。这条会显示在我的描述上面。',

  aboutPage:
    '行程码决定你看到哪份数据。你和同行的人用同一个码，加的点会互相同步；换一个没人用过的码，就是一份空白行程。',
  aboutFoot:
    '共享数据对所有知道行程码的人可见。坐标为示意精度，海拔为常见公开值，班次和门票以官方当日公告为准。'
};

/* ── 高原反应规则 ── */
const RULES=[
 ['睡得低，玩得高','白天上到 4000 米以上没问题，关键是过夜的海拔。超过 3000 米之后，每晚的睡眠海拔涨幅控制在 500 米以内。'],
 ['先睡圣谷，再上库斯科','库斯科 3400 米，圣谷的乌鲁班巴 2871 米、奥扬泰坦博 2792 米。落地库斯科机场直接下到圣谷过夜，比在城里硬扛舒服得多，也顺路离去马丘比丘的火车站更近。'],
 ['硬的留到后面','彩虹山 5200 米、瓦卡奇纳、萨尔坎泰这类，安排在适应三天之后。高反和体能无关，运动员一样会中招。'],
 ['前 48 小时','少酒、少大餐、多喝水。古柯茶（mate de coca）当地随处都有。Diamox 要出发前问过医生。'],
 ['下降永远有效','症状压不住就往低处走。阿瓜斯卡连特斯 2040 米、圣谷 2800 米，都是现成的退路。']
];

/* ── 四趟的季节冲突 ── */
const COMPARE=[
 ['秘鲁','旱季 5–9 月，晴天多、山路好走。1–3 月是雨季，印加古道二月整月封闭维护。'],
 ['玻利维亚 乌尤尼','要看镜面就得赶雨季 12–4 月，最好是 2–3 月。想开进盐湖深处、去红湖白湖，反而是 6–8 月干季更稳。两种玩法互斥。'],
 ['巴塔哥尼亚','11–3 月南半球夏天。12–2 月是旺季，风最大、人最多；3 月风小人少、秋色开始，是很多人认为最好的月份。'],
 ['巴西 / 哥伦比亚','哥伦比亚干季 12–3 月。巴西南部夏天是 12–3 月，伊瓜苏水量则是雨季后的 3–5 月更壮观。']
];

/* ══════ 区域与地点 ══════ */
const REG={per:{n:'秘鲁',hex:'#C4392D'},bol:{n:'玻利维亚',hex:'#D99A2B'},
           pat:{n:'巴塔哥尼亚',hex:'#2E8FA6'},bra:{n:'巴西 / 哥伦比亚',hex:'#3F8F5B'},
           cit:{n:'城市',hex:'#7A6A8C'}};
const P={};
const def=(id,zh,es,lat,lng,r,note,alt)=>P[id]={id,zh,es,lat,lng,r,note,alt};

/* — 秘鲁 — */
def('lima','利马 米拉弗洛雷斯','Lima Miraflores',-12.1219,-77.0297,'per','海平面。转机通常在这里过一夜，顺便把时差倒掉再上高原。米拉弗洛雷斯沿海崖边有步道。',0);
def('limacentro','利马老城','Centro de Lima',-12.0464,-77.0428,'per','武器广场和圣方济各修道院的地下墓穴。半天够。',150);
def('larco','拉尔科博物馆','Museo Larco',-12.0722,-77.0700,'per','前哥伦布时期陶器收藏，馆藏质量很高。花园餐厅可以吃午饭。',100);
def('sacred','圣谷 乌鲁班巴','Valle Sagrado Urubamba',-13.3050,-72.1150,'per','2871 米，比库斯科低五百多米。落地第一晚睡这里，身体适应会舒服很多。气候也比库斯科温和。',2871);
def('ollanta','奥扬泰坦博','Ollantaytambo',-13.2586,-72.2650,'per','2792 米。去马丘比丘的火车主要从这儿发车，住这里省掉库斯科出发的凌晨转运。梯田和太阳神庙就在镇上。',2792);
def('pisac','皮萨克','Pisac',-13.4222,-71.8492,'per','2972 米。山脊上的印加遗址加集市。集市周日最大，但也最挤。',2972);
def('moray','莫雷梯田','Moray',-13.3300,-72.1950,'per','3385 米，同心圆梯田，据说是印加人的农业试验场。旁边的马拉斯盐田顺路。',3385);
def('cusco','库斯科','Cusco',-13.5167,-71.9789,'per','3399 米。印加石墙上盖西班牙教堂，整座城就是这个逻辑。圣布拉斯区坡陡，住宿挑楼层。',3399);
def('sacsay','萨克塞瓦曼','Sacsayhuamán',-13.5089,-71.9822,'per','3701 米，俯瞰库斯科的巨石墙。石块接缝到现在插不进刀片。适应期第二天走走刚好。',3701);
def('machu','马丘比丘','Machu Picchu',-13.1631,-72.5450,'per','2430 米，比库斯科低一千米，很多人到了反而觉得轻松。门票分线路（circuito）限额限时，必须提前在官网买，现场几乎买不到。',2430);
def('aguas','阿瓜斯卡连特斯','Aguas Calientes',-13.1547,-72.5253,'per','2040 米。马丘比丘山脚的镇子，除了住宿和餐厅没有别的。住一晚可以赶第一班车上山。',2040);
def('rainbow','彩虹山','Vinicunca',-13.8697,-71.3028,'per','5200 米，全程最高点。必须适应三天以上再去，且当天很早出发。天气不好就是一片灰，别有执念。',5200);
def('humantay','乌曼台湖','Laguna Humantay',-13.3650,-72.5900,'per','4200 米的冰川湖。爬升不长但很陡，同样安排在适应之后。',4200);

/* — 玻利维亚 — */
def('lapaz','拉巴斯','La Paz',-16.4897,-68.1193,'bol','3640 米，世界最高的首都之一。城市建在峡谷里，缆车（Mi Teleférico）是日常公交，也是最好的观景方式。',3640);
def('valleluna','月亮谷','Valle de la Luna',-16.5583,-68.0906,'bol','拉巴斯郊外的风蚀土林，半天。海拔比市区低一点。',3400);
def('titicaca','的的喀喀湖 科帕卡巴纳','Copacabana Titicaca',-16.1667,-69.0833,'bol','3810 米，世界最高的可通航湖。从这里坐船去太阳岛（Isla del Sol）。',3810);
def('sol','太阳岛','Isla del Sol',-16.0250,-69.1750,'bol','3800 米，岛上没有汽车，全靠走。印加创世神话的起点。住一晚看日落。',3800);
def('uyuni','乌尤尼盐湖','Salar de Uyuni',-20.1338,-67.4891,'bol','3660 米，一万平方公里。12–4 月薄水层覆盖时出现镜面，最好是 2–3 月。旱季则是六边形盐壳，能开进湖心。',3660);
def('uyunitown','乌尤尼镇','Uyuni',-20.4597,-66.8253,'bol','3670 米。所有团从这里出发，镇子本身很小很冷。火车坟场在镇外。',3670);
def('incahuasi','鱼岛','Isla Incahuasi',-20.2417,-67.6264,'bol','盐湖中心的石岛，长满几米高的仙人掌。旱季才能开到。',3660);
def('lagunacolorada','红湖','Laguna Colorada',-22.1833,-67.7833,'bol','4278 米。藻类让水变红，火烈鸟成群。三日团的第二天到这里，那一晚睡在 4000 米以上，是全程最难受的一晚。',4278);

/* — 巴塔哥尼亚 — */
def('calafate','El Calafate','El Calafate',-50.3379,-72.2648,'pat','200 米。看冰川的基地，机场有直飞布宜诺斯艾利斯。镇子沿一条主街展开。',200);
def('perito','佩里托莫雷诺冰川','Glaciar Perito Moreno',-50.4967,-73.1377,'pat','少数还在前进的冰川之一。栈道分几层，能听到崩塌的巨响。也可以走冰上徒步（minitrekking）。',300);
def('chalten','El Chaltén','El Chaltén',-49.3315,-72.8863,'pat','400 米，阿根廷的徒步之都。所有步道从镇上直接起步，不用开车不用报团，这是它最好的地方。',400);
def('fitzroy','菲茨罗伊 Laguna de los Tres','Laguna de los Tres',-49.2717,-73.0083,'pat','全程 20 公里往返，最后一公里陡升 400 米。晴天的话是巴塔哥尼亚最有名的画面。风大就别上最后那段。',1170);
def('torre','托雷湖','Laguna Torre',-49.3050,-73.0500,'pat','18 公里往返，比菲茨罗伊平缓很多。适合到达后的第一天。',600);
def('puertonatales','Puerto Natales','Puerto Natales',-51.7236,-72.4875,'pat','智利一侧的门户，进托雷斯德帕因从这里出发。租装备、买补给都在这儿。',50);
def('torres','托雷斯德帕因','Torres del Paine',-50.9423,-73.4068,'pat','W 线四到五天。营地和山屋必须提前预订才让进园，旺季几个月前就订满。不能野营。',700);
def('basetorres','三塔观景台','Base Las Torres',-50.9394,-72.9042,'pat','W 线最有名的一段，往返 19 公里。多数人摸黑出发看日出照在塔上。',900);
def('greyglacier','格雷冰川','Glaciar Grey',-51.0333,-73.2000,'pat','W 线西端，可以坐船靠近冰川正面。',100);
def('puntaarenas','Punta Arenas','Punta Arenas',-53.1638,-70.9171,'pat','麦哲伦海峡边，进出巴塔哥尼亚南部的主要机场。',30);

/* — 巴西 / 哥伦比亚 — */
def('rio','里约热内卢','Rio de Janeiro',-22.9068,-43.1729,'bra','海平面。科帕卡巴纳和伊帕内玛之间那段海滩最好走。治安要留意，别带贵重物品去沙滩。',10);
def('corcovado','基督像 科尔科瓦多','Cristo Redentor',-22.9519,-43.2105,'bra','710 米。清早上去人最少，云散得也快。齿轨火车要提前订。',710);
def('sugarloaf','面包山','Pão de Açúcar',-22.9492,-43.1545,'bra','396 米，两段缆车。日落前一小时上去，能同时看到白天和夜景。',396);
def('iguazu','伊瓜苏瀑布','Cataratas do Iguaçu',-25.6953,-54.4367,'bra','阿根廷一侧栈道多、离水近，巴西一侧看全景。两边都值得，各一天。3–5 月水量最大。',180);
def('paraty','帕拉蒂','Paraty',-23.2178,-44.7131,'bra','里约往南四小时，殖民时期的石板小镇加群岛。节奏比里约慢很多。',5);
def('bogota','波哥大','Bogotá',4.7110,-74.0721,'bra','2640 米，进出哥伦比亚的枢纽。老城 La Candelaria 加黄金博物馆。',2640);
def('medellin','麦德林','Medellín',6.2442,-75.5812,'bra','1495 米，四季如春。缆车（Metrocable）上 Comuna 13 是这座城市最值得看的部分。',1495);
def('cartagena','卡塔赫纳','Cartagena',10.3910,-75.4794,'bra','海平面，加勒比海边的殖民城墙老城。很热很潮，傍晚才适合走。',5);
def('cocora','科科拉山谷','Valle de Cocora',4.6378,-75.4869,'bra','2400 米，世界最高的棕榈树（蜡棕）。从 Salento 坐吉普车进去。',2400);

/* — 枢纽 — */
def('scl','圣地亚哥机场','SCL Santiago',-33.3930,-70.7858,'cit','进出智利和巴塔哥尼亚的主要中转点。');
def('eze','布宜诺斯艾利斯','Buenos Aires EZE',-34.8222,-58.5358,'cit','进出阿根廷的枢纽。转机时间够的话进城吃顿饭。');
def('lim','利马机场','LIM Jorge Chávez',-12.0219,-77.1143,'cit','从温哥华出发多数在洛杉矶、休斯敦或墨西哥城转一次。');

/* ══════ 季节表 ══════ */
const GCOL=['#E3DFD8','#BFD6D9','#6FAFBC','#2E8FA6'];
const HCOL=['#E3DFD8','#EBCFA0','#DFA33F','#C4392D'];
const H2=['#E3DFD8','#EBCFA0','#DFA33F','#C4392D'];
const TIMING={
  cols:[{k:'1–2月',pk:0},{k:'3月',pk:1},{k:'4–5月',pk:0},{k:'6–8月',pk:1},{k:'9–10月',pk:0},{k:'11–12月',pk:0},{k:'旺季',pk:0}],
  rows:[
    {n:'秘鲁',v:[0,1,2,3,2,1,0],c:GCOL},
    {n:'乌尤尼',v:[3,3,2,1,1,2,0],c:GCOL},
    {n:'巴塔哥尼亚',v:[2,3,1,0,0,2,0],c:GCOL},
    {n:'人 / 价',v:[2,1,1,2,1,2,3],c:H2}
  ]
};

/* ══════ 四趟行程 ══════ */
const V={
A:{k:'A',gr:'一',name:'秘鲁 · 圣谷与马丘比丘',met:'14 DAYS · 旱季 6–8月',hex:'#C4392D',tag:'第一趟',
  dates:'2027.06.12 → 06.25',
  pitch:'十四天，节奏很松。核心是一条从低往高的线：利马海平面 → 圣谷 2871 米 → 马丘比丘 2430 米 → 库斯科 3399 米。\n\n'
    +'很多人的做法是落地直接住库斯科，然后头疼两天。这条反过来，先在圣谷睡两晚，'
    +'等身体缓过来再上城里，最后才安排彩虹山这种 5000 米以上的。',
  cons:'旱季是旺季，马丘比丘门票和火车都要提前很久订。\n\n'
    +'六到八月的安第斯昼夜温差极大，白天二十度出头，夜里接近零度，圣谷的房子多数没有暖气。',
  budget:{air:2800,dom:600,stay:1900,food:1100,tours:1400,tickets:700,transfer:400,misc:500},
  days:[
   {d:'06.12',w:'六',t:'温哥华 → 利马',r:'cit',stay:'利马',alt:0,note:'多数在洛杉矶、休斯敦或墨西哥城转一次，全程 14–18 小时。',stops:[{t:'—',p:'lim',n:'LIM 抵达',s:''}]},
   {d:'06.13',w:'日',t:'利马 · 海平面缓一天',r:'per',stay:'利马',alt:0,note:'时差和高原不要一起扛。今天留在海平面。',stops:[
     {t:'上午',p:'larco',n:'拉尔科博物馆',s:'前哥伦布时期陶器，花园餐厅可以吃午饭'},
     {t:'下午',p:'lima',n:'米拉弗洛雷斯崖边步道',s:'沿海岸走，看滑翔伞'}]},
   {d:'06.14',w:'一',t:'飞库斯科 → 直接下圣谷',r:'per',stay:'圣谷 乌鲁班巴',alt:2871,note:'落地库斯科机场不进城，直接坐车下到圣谷，比城里低五百多米。今天只做最轻的事。',stops:[
     {t:'上午',p:'cusco',n:'库斯科机场（只是路过）',s:'1 小时飞行'},
     {t:'中午',p:'sacred',n:'乌鲁班巴入住',s:'喝古柯茶，睡个午觉，晚饭吃少'}]},
   {d:'06.15',w:'二',t:'圣谷 · 慢慢走',r:'per',stay:'圣谷 乌鲁班巴',alt:2871,note:'第二天仍然轻。皮萨克集市和莫雷梯田选一个，不要都去。',stops:[
     {t:'—',p:'pisac',n:'皮萨克 集市 + 遗址',s:'遗址在山脊上，坐车上去再往下走'},
     {t:'—',p:'moray',n:'莫雷梯田（二选一）',s:'3385 米，比圣谷高，量力'}]},
   {d:'06.16',w:'三',t:'奥扬泰坦博',r:'per',stay:'奥扬泰坦博',alt:2792,note:'搬到火车站所在的镇，明天上山不用凌晨转运。',stops:[
     {t:'上午',p:'ollanta',n:'太阳神庙 + 梯田',s:'就在镇上，走上去二十分钟'},
     {t:'下午',p:null,n:'确认明天的火车和门票',s:'把纸质票和护照放一起'}]},
   {d:'06.17',w:'四',t:'马丘比丘',r:'per',stay:'阿瓜斯卡连特斯',alt:2040,note:'门票分线路限时入场，走错线路不让进。今晚住山脚，比当天来回从容得多。',stops:[
     {t:'早',p:'aguas',n:'火车到阿瓜斯卡连特斯',s:'1.5 小时'},
     {t:'—',p:'machu',n:'马丘比丘',s:'2430 米，反而比库斯科好受。按买的 circuito 走'}]},
   {d:'06.18',w:'五',t:'回库斯科',r:'per',stay:'库斯科',alt:3399,note:'现在才上 3399 米，身体已经适应了五天。',stops:[
     {t:'—',p:'cusco',n:'库斯科入住',s:'圣布拉斯区坡很陡，订房看清楼层和台阶'}]},
   {d:'06.19',w:'六',t:'库斯科 · 城里',r:'per',stay:'库斯科',alt:3399,note:'',stops:[
     {t:'—',p:'sacsay',n:'萨克塞瓦曼',s:'3701 米，从城里走上去，慢慢来'},
     {t:'—',p:null,n:'圣佩德罗市场 + 武器广场',s:''}]},
   {d:'06.20',w:'日',t:'库斯科 · 空一天',r:'per',stay:'库斯科',alt:3399,note:'不安排。逛店、喝东西、修整。明天有硬的。',stops:[{t:'—',p:'cusco',n:'随意',s:''}]},
   {d:'06.21',w:'一',t:'彩虹山 或 乌曼台湖',r:'per',stay:'库斯科',alt:3399,note:'适应到第九天才做这个。凌晨三四点出发，天气不好就是一片灰，别有执念。',stops:[
     {t:'04:00',p:'rainbow',n:'彩虹山 5200 米',s:'可以骑马上最后一段'},
     {t:'—',p:'humantay',n:'乌曼台湖（替代）',s:'4200 米，爬升短但陡'}]},
   {d:'06.22',w:'二',t:'库斯科 缓冲',r:'per',stay:'库斯科',alt:3399,note:'昨天累了就整天休息。这天是留给意外的。',stops:[{t:'—',p:'cusco',n:'休息',s:''}]},
   {d:'06.23',w:'三',t:'飞回利马',r:'per',stay:'利马',alt:0,note:'回到海平面，睡一晚会特别好。',stops:[{t:'—',p:'lima',n:'米拉弗洛雷斯',s:'最后吃一顿正经的'}]},
   {d:'06.24',w:'四',t:'利马 最后一天',r:'per',stay:'利马',alt:0,note:'',stops:[{t:'—',p:'limacentro',n:'老城（可选）',s:''}]},
   {d:'06.25',w:'五',t:'利马 → 温哥华',r:'cit',stay:'—',alt:0,note:'',stops:[{t:'—',p:'lim',n:'LIM',s:''}]}
  ]},

B:{k:'B',gr:'二',name:'玻利维亚 · 乌尤尼镜面',met:'12 DAYS · 镜面季 2–3月',hex:'#D99A2B',tag:'第二趟',
  dates:'2028.02.19 → 03.01',
  pitch:'十二天，为了镜面而来。薄水层要下过雨才有，12 到 4 月，2–3 月概率最高。\n\n'
    +'这趟全程都在 3600 米以上，是四趟里高反压力最大的一趟。'
    +'所以前面留了拉巴斯和的的喀喀湖慢慢适应，不直接冲乌尤尼。',
  cons:'镜面看运气。雨太大盐湖会封路，一点不下又没有水膜。这件事没法提前锁定。\n\n'
    +'三日团的第二晚睡在红湖附近 4200 米以上，条件简陋，是全程最难受的一晚。'
    +'不想受这个罪就只做一日团，当天来回乌尤尼镇。',
  budget:{air:2900,dom:700,stay:1300,food:800,tours:1500,tickets:200,transfer:400,misc:500},
  days:[
   {d:'02.19',w:'六',t:'温哥华 → 拉巴斯',r:'cit',stay:'机上',alt:0,note:'通常在利马或圣地亚哥转。',stops:[{t:'—',p:null,n:'YVR 出发',s:''}]},
   {d:'02.20',w:'日',t:'抵拉巴斯 · 只休息',r:'bol',stay:'拉巴斯',alt:3640,note:'从海平面直接到 3640 米，今天什么都不做。慢走、喝水、古柯茶、吃少。',stops:[
     {t:'—',p:'lapaz',n:'入住 Sopocachi 或 Zona Sur',s:'Zona Sur 海拔更低几百米，第一晚睡那边更舒服'}]},
   {d:'02.21',w:'一',t:'拉巴斯 · 坐缆车',r:'bol',stay:'拉巴斯',alt:3640,note:'缆车是当地公交，也是最省力的观光方式——不用爬坡。',stops:[
     {t:'—',p:'lapaz',n:'Mi Teleférico 红线 / 黄线',s:'俯瞰整个峡谷城市'},
     {t:'—',p:'valleluna',n:'月亮谷',s:'半天，风蚀土林'}]},
   {d:'02.22',w:'二',t:'的的喀喀湖 科帕卡巴纳',r:'bol',stay:'科帕卡巴纳',alt:3810,note:'车程约四小时。海拔又高了一点，注意反应。',stops:[
     {t:'—',p:'titicaca',n:'科帕卡巴纳',s:'湖边小镇，傍晚看日落'}]},
   {d:'02.23',w:'三',t:'太阳岛',r:'bol',stay:'科帕卡巴纳',alt:3810,note:'岛上没有汽车，全靠走，坡不少。',stops:[
     {t:'—',p:'sol',n:'Isla del Sol',s:'船程约 1.5 小时，印加创世神话的起点'}]},
   {d:'02.24',w:'四',t:'回拉巴斯 → 飞乌尤尼',r:'bol',stay:'乌尤尼镇',alt:3670,note:'也可以坐夜班大巴，省一晚住宿但很累。',stops:[
     {t:'—',p:'uyunitown',n:'乌尤尼镇',s:'镇子很小很冷，团都从这里出发'}]},
   {d:'02.25',w:'五',t:'盐湖 · 日落与星空团',r:'bol',stay:'乌尤尼镇',alt:3670,note:'镜面最好的时段是日落和日出，正午光太硬。先做一日团探路。',stops:[
     {t:'下午',p:'uyuni',n:'Salar de Uyuni',s:'带一双能湿的鞋和替换袜子'},
     {t:'晚',p:null,n:'星空 / 银河',s:'水面倒影，穿够衣服，夜里接近零度'}]},
   {d:'02.26',w:'六',t:'盐湖 · 日出团 或 三日团出发',r:'bol',stay:'乌尤尼镇 / 山里',alt:3670,note:'想深入红湖白湖就今天出发三日团，那两晚条件简陋且更高。只想看镜面的话留在镇上。',stops:[
     {t:'日出',p:'uyuni',n:'日出镜面',s:''},
     {t:'—',p:'incahuasi',n:'鱼岛（水浅时可到）',s:'仙人掌石岛'}]},
   {d:'02.27',w:'日',t:'红湖 与 火烈鸟（三日团）',r:'bol',stay:'红湖附近',alt:4278,note:'今晚睡 4200 米以上，是全程最高的一晚。做一日团的话这天留在乌尤尼镇休息。',stops:[
     {t:'—',p:'lagunacolorada',n:'Laguna Colorada',s:'4278 米，火烈鸟成群'}]},
   {d:'02.28',w:'一',t:'回乌尤尼 → 拉巴斯',r:'bol',stay:'拉巴斯',alt:3640,note:'',stops:[{t:'—',p:'lapaz',n:'拉巴斯',s:'最后采买，Mercado de las Brujas'}]},
   {d:'02.29',w:'二',t:'拉巴斯 缓冲',r:'bol',stay:'拉巴斯',alt:3640,note:'留给航班变动和身体。',stops:[{t:'—',p:'lapaz',n:'休息',s:''}]},
   {d:'03.01',w:'三',t:'拉巴斯 → 温哥华',r:'cit',stay:'—',alt:0,note:'',stops:[{t:'—',p:'lapaz',n:'LPB',s:'机场在 El Alto，4050 米，是世界最高的国际机场之一'}]}
  ]},

C:{k:'C',gr:'三',name:'巴塔哥尼亚 · 冰川与徒步',met:'16 DAYS · 南半球夏 11–3月',hex:'#2E8FA6',tag:'第三趟',
  dates:'2028.11.11 → 11.26',
  pitch:'十六天，阿根廷和智利各一半。海拔全程很低，不用担心高反，'
    +'但风是另一回事——巴塔哥尼亚的风能把人吹得走不动路。\n\n'
    +'El Chaltén 是这趟最舒服的部分：所有步道从镇上直接起步，不用开车不用报团，'
    +'早上看天气决定今天走哪条。',
  cons:'托雷斯德帕因的营地和山屋必须提前订才让进园，旺季几个月前就满，且不能野营。\n\n'
    +'境内航段贵且班次少，El Calafate 到 Punta Arenas 基本只能飞或者坐很久的大巴。\n\n'
    +'十一月风最大。想要风小人少就换到三月，代价是天黑得早。',
  budget:{air:3000,dom:1400,stay:2400,food:1600,tours:1200,tickets:500,transfer:600,misc:600},
  days:[
   {d:'11.11',w:'六',t:'温哥华 → 布宜诺斯艾利斯',r:'cit',stay:'机上',alt:0,note:'',stops:[{t:'—',p:'eze',n:'EZE',s:''}]},
   {d:'11.12',w:'日',t:'抵布宜诺斯艾利斯',r:'cit',stay:'布宜诺斯艾利斯',alt:25,note:'时差 5 小时，比去亚洲轻松。',stops:[{t:'—',p:'eze',n:'进城',s:'国内航班在市区的 AEP 机场起飞，注意别搞错'}]},
   {d:'11.13',w:'一',t:'飞 El Calafate',r:'pat',stay:'El Calafate',alt:200,note:'3 小时。到了先租徒步装备、买补给。',stops:[{t:'—',p:'calafate',n:'El Calafate',s:'镇子沿一条主街展开'}]},
   {d:'11.14',w:'二',t:'佩里托莫雷诺冰川',r:'pat',stay:'El Calafate',alt:200,note:'栈道分几层，能待很久。想上冰就订 minitrekking，要提前。',stops:[
     {t:'—',p:'perito',n:'Glaciar Perito Moreno',s:'听崩塌的巨响，运气好能看到大块塌下来'}]},
   {d:'11.15',w:'三',t:'到 El Chaltén',r:'pat',stay:'El Chaltén',alt:400,note:'大巴三小时。今天不走远路，熟悉镇子。',stops:[{t:'—',p:'chalten',n:'El Chaltén',s:'步道从镇上直接起步'}]},
   {d:'11.16',w:'四',t:'托雷湖',r:'pat',stay:'El Chaltén',alt:400,note:'18 公里往返，比较平缓，当作热身。',stops:[{t:'—',p:'torre',n:'Laguna Torre',s:''}]},
   {d:'11.17',w:'五',t:'菲茨罗伊 Laguna de los Tres',r:'pat',stay:'El Chaltén',alt:400,note:'20 公里往返，最后一公里陡升 400 米。风太大就在下面折返，不丢人。',stops:[
     {t:'早',p:'fitzroy',n:'Laguna de los Tres',s:'晴天是巴塔哥尼亚最有名的画面'}]},
   {d:'11.18',w:'六',t:'El Chaltén 看天气决定',r:'pat',stay:'El Chaltén',alt:400,note:'留白。天好就再走一条，天不好就在镇上喝啤酒。',stops:[{t:'—',p:'chalten',n:'随意',s:''}]},
   {d:'11.19',w:'日',t:'过境到 Puerto Natales',r:'pat',stay:'Puerto Natales',alt:50,note:'大巴 6–7 小时含过境，阿根廷出境和智利入境各停一次。智利禁止带新鲜果蔬入境。',stops:[
     {t:'—',p:'puertonatales',n:'Puerto Natales',s:'租装备、买补给、确认园区预订'}]},
   {d:'11.20',w:'一',t:'进园 · W 线第一天',r:'pat',stay:'园区山屋',alt:700,note:'再次确认营地预订单，园区入口要查。',stops:[{t:'—',p:'torres',n:'Torres del Paine',s:''}]},
   {d:'11.21',w:'二',t:'W 线 · 三塔观景台',r:'pat',stay:'园区山屋',alt:900,note:'往返 19 公里，最后一段是碎石坡。多数人摸黑出发看日出照在塔上。',stops:[{t:'—',p:'basetorres',n:'Base Las Torres',s:''}]},
   {d:'11.22',w:'三',t:'W 线 · 法国谷',r:'pat',stay:'园区山屋',alt:700,note:'风口路段，风大时会封。',stops:[{t:'—',p:'torres',n:'Valle del Francés',s:''}]},
   {d:'11.23',w:'四',t:'W 线 · 格雷冰川',r:'pat',stay:'园区山屋',alt:100,note:'可以加钱坐船靠近冰川正面。',stops:[{t:'—',p:'greyglacier',n:'Glaciar Grey',s:''}]},
   {d:'11.24',w:'五',t:'出园 → Puerto Natales',r:'pat',stay:'Puerto Natales',alt:50,note:'洗澡、吃一顿正经的。',stops:[{t:'—',p:'puertonatales',n:'回镇上',s:''}]},
   {d:'11.25',w:'六',t:'到 Punta Arenas',r:'pat',stay:'Punta Arenas',alt:30,note:'大巴三小时。缓冲日，也防天气误机。',stops:[{t:'—',p:'puntaarenas',n:'麦哲伦海峡',s:''}]},
   {d:'11.26',w:'日',t:'Punta Arenas → 温哥华',r:'cit',stay:'—',alt:0,note:'通常经圣地亚哥转。',stops:[{t:'—',p:'scl',n:'SCL 转机',s:''}]}
  ]},

D:{k:'D',gr:'四',name:'哥伦比亚 · 或 巴西',met:'12 DAYS · 干季 12–3月',hex:'#3F8F5B',tag:'第四趟',
  dates:'2029.01.13 → 01.24',
  pitch:'十二天，全程低海拔，是四趟里最轻松的一趟。\n\n'
    +'哥伦比亚线：波哥大 → 麦德林 → 咖啡三角 → 卡塔赫纳，气候、城市、海岸各不相同，距离也不远。\n'
    +'巴西线换成里约 → 帕拉蒂 → 伊瓜苏，重心在自然和海滩。两条选一条，不要都塞。',
  cons:'哥伦比亚部分区域治安需要留意，尽量白天移动，晚上用打车软件不要拦街车。\n\n'
    +'巴西线的伊瓜苏水量 3–5 月最大，1 月去会小一些；反过来 3–5 月里约的天气不如 1 月。',
  budget:{air:2600,dom:600,stay:1500,food:1000,tours:700,tickets:300,transfer:400,misc:500},
  days:[
   {d:'01.13',w:'六',t:'温哥华 → 波哥大',r:'cit',stay:'机上',alt:0,note:'',stops:[{t:'—',p:'bogota',n:'BOG',s:''}]},
   {d:'01.14',w:'日',t:'波哥大',r:'bra',stay:'波哥大',alt:2640,note:'2640 米，比想象中高。第一天别安排剧烈活动。',stops:[
     {t:'—',p:'bogota',n:'La Candelaria + 黄金博物馆',s:''}]},
   {d:'01.15',w:'一',t:'飞麦德林',r:'bra',stay:'麦德林',alt:1495,note:'1 小时。海拔降到 1495 米，四季如春。',stops:[
     {t:'—',p:'medellin',n:'Comuna 13 缆车',s:'城市改造最值得看的部分'}]},
   {d:'01.16',w:'二',t:'麦德林 · Guatapé',r:'bra',stay:'麦德林',alt:1495,note:'当天来回，两小时车程。',stops:[{t:'—',p:'medellin',n:'Guatapé 巨石',s:'740 级台阶'}]},
   {d:'01.17',w:'三',t:'咖啡三角 Salento',r:'bra',stay:'Salento',alt:1895,note:'',stops:[{t:'—',p:'cocora',n:'科科拉山谷',s:'2400 米，世界最高的棕榈树'}]},
   {d:'01.18',w:'四',t:'咖啡庄园',r:'bra',stay:'Salento',alt:1895,note:'从采豆到烘焙走一遍，半天。',stops:[{t:'—',p:'cocora',n:'庄园 finca',s:''}]},
   {d:'01.19',w:'五',t:'飞卡塔赫纳',r:'bra',stay:'卡塔赫纳',alt:5,note:'降到海平面，很热很潮。',stops:[{t:'—',p:'cartagena',n:'城墙老城',s:'傍晚才适合走'}]},
   {d:'01.20',w:'六',t:'卡塔赫纳 · 老城',r:'bra',stay:'卡塔赫纳',alt:5,note:'',stops:[{t:'—',p:'cartagena',n:'Getsemaní 区',s:'壁画和夜市，比老城内本地感更强'}]},
   {d:'01.21',w:'日',t:'玫瑰岛 或 慢一天',r:'bra',stay:'卡塔赫纳',alt:5,note:'',stops:[{t:'—',p:'cartagena',n:'Islas del Rosario（可选）',s:'船程一小时'}]},
   {d:'01.22',w:'一',t:'卡塔赫纳 空一天',r:'bra',stay:'卡塔赫纳',alt:5,note:'不安排。',stops:[{t:'—',p:'cartagena',n:'随意',s:''}]},
   {d:'01.23',w:'二',t:'回波哥大',r:'bra',stay:'波哥大',alt:2640,note:'缓冲日，防国内航班延误。',stops:[{t:'—',p:'bogota',n:'波哥大',s:''}]},
   {d:'01.24',w:'三',t:'波哥大 → 温哥华',r:'cit',stay:'—',alt:0,note:'',stops:[{t:'—',p:'bogota',n:'BOG',s:''}]}
  ]}
};

const BROWS=[
 {k:'air', n:'国际机票', s:'YVR ⇄ 南美 · 两人 · 需转机', max:8000},
 {k:'dom', n:'境内航段', s:'南美国内线贵且班次少，越早订越好', max:3000},
 {k:'stay',n:'住宿', s:'秘鲁玻利维亚便宜，巴塔哥尼亚园区山屋很贵', max:5000},
 {k:'food',n:'餐饮', s:'秘鲁午市套餐 menú 十几索尔；巴塔哥尼亚要自带干粮', max:3000},
 {k:'tours',n:'团 · 向导 · 装备租赁', s:'盐湖团、冰川船、W 线装备', max:3000},
 {k:'tickets',n:'门票', s:'马丘比丘 + 火车 / 园区入园费', max:1500},
 {k:'transfer',n:'地面交通', s:'长途大巴 / 接送 / 过境', max:1500},
 {k:'misc',n:'保险 · 疫苗 · 杂项', s:'保险确认含高海拔和徒步', max:1500}
];

const TODOS=[
 {id:'s1',n:'订马丘比丘门票 + 火车',s:'门票分线路 circuito 限额限时，官网提前放票，旺季很快售罄。火车 PeruRail 或 IncaRail 分开订',due:'现在',v:'A'},
 {id:'s2',n:'订托雷斯德帕因营地 / 山屋',s:'没有预订不让进园，且不能野营。旺季几个月前订满。两家运营商各管一部分营地，要分别订',due:'现在',v:'C'},
 {id:'s3',n:'订国际机票',s:'温哥华没有直飞南美，多在洛杉矶、休斯敦、墨西哥城或圣地亚哥转',due:'现在',v:'ABCD'},
 {id:'s4',n:'订境内航段',s:'南美国内线贵、班次少、常变动。留足中转时间，别订最后一班接国际航班',due:'现在',v:'ABCD'},
 {id:'s5',n:'看医生问高原药',s:'Diamox（乙酰唑胺）需要处方，要提前问过。高反和体能无关',due:'出发前 2 月',v:'AB'},
 {id:'s6',n:'确认疫苗要求',s:'部分线路（亚马逊、部分边境）会查黄热病证明，接种后要满十天才生效',due:'出发前 2 月',v:'ABD'},
 {id:'s7',n:'旅行保险含高海拔与徒步',s:'很多保单把 4000 米以上和多日徒步列为除外责任。买之前搜清楚条款',due:'出发前 1 月',v:'ABC'},
 {id:'s8',n:'订乌尤尼团（一日 或 三日）',s:'先决定要不要三日团。三日团第二晚在 4200 米以上，条件简陋',due:'出发前 1 月',v:'B'},
 {id:'s9',n:'准备防风装备',s:'巴塔哥尼亚的风是主要难点。硬壳外套、防风裤、护目镜或墨镜',due:'出发前 1 月',v:'C'},
 {id:'s10',n:'带足现金（小额美元）',s:'玻利维亚和秘鲁小镇 ATM 少且常没钱。美元要新钞无破损，破了当地不收',due:'出发前',v:'AB'},
 {id:'s11',n:'下载离线地图 + 西语常用语',s:'安第斯山区和园区大段无信号。小城镇英语普及度低',due:'出发前',v:'ABCD'},
 {id:'s12',n:'防晒（比想象中重要）',s:'高原紫外线极强，3600 米比海平面高约 50%。高倍防晒、帽子、唇膏',due:'出发前',v:'AB'}
];

/* ══════ 每晚住宿与吃饭 ══════
   写的是方向和筛选条件，不是具体房源清单。 */
const STAY={
 '利马':{area:'Miraflores, Lima',
  opts:[{n:'米拉弗洛雷斯崖边一带',tier:'$$',pick:true,q:'Miraflores Lima hotel',
    why:'海边步道走路可达，餐厅密集，夜里走动比市中心安心。转机过夜也方便。'},
   {n:'Barranco 区',tier:'$$',q:'Barranco Lima hotel',
    why:'更有生活感，壁画和小酒馆多，离机场略远。'}],
  food:[{n:'Ceviche（午餐吃）',jp:'cevicheria Miraflores',why:'当地人只在中午吃，晚上开的多半是给游客的。'},
   {n:'Pollo a la brasa',jp:'pollo a la brasa Lima',why:'炭烤鸡，秘鲁人的家常。'}]},

 '圣谷 乌鲁班巴':{area:'Urubamba, Valle Sagrado',
  opts:[{n:'乌鲁班巴的乡村旅舍',tier:'$$',pick:true,q:'Urubamba Sacred Valley hotel',
    why:'2871 米，比库斯科低五百多米，第一晚睡这里高反轻很多。多数带花园，气候温和。'},
   {n:'带供氧的高端酒店',tier:'$$$',q:'Sacred Valley luxury hotel oxygen',
    why:'对高原特别没把握的话可以考虑，房价高不少。'}],
  food:[{n:'旅舍晚餐',jp:'Urubamba restaurante',why:'第一晚吃少、别喝酒，这两条比吃什么重要。'},
   {n:'Mate de coca',jp:'mate de coca',why:'古柯茶，到处都有，免费续。'}]},

 '奥扬泰坦博':{area:'Ollantaytambo',
  opts:[{n:'火车站步行范围内',tier:'$$',pick:true,q:'Ollantaytambo hotel near station',
    why:'2792 米。明早的火车从这里发，省掉库斯科出发的凌晨转运。石板路多，行李箱不好拖。'}],
  food:[{n:'广场周围的小馆子',jp:'Ollantaytambo restaurante plaza',why:'选择不多，早点吃。'}]},

 '阿瓜斯卡连特斯':{area:'Aguas Calientes (Machupicchu Pueblo)',
  opts:[{n:'镇上任意一家（离巴士站近）',tier:'$$',pick:true,q:'Aguas Calientes hotel',
    why:'2040 米，全程最低。住这里能赶第一班上山的车。镇子很小，除了住和吃没别的。'}],
  food:[{n:'河边餐厅',jp:'Aguas Calientes restaurante',why:'价格比别处高一截，是垄断价，接受就好。'}]},

 '库斯科':{area:'Cusco, Centro / San Blas',
  opts:[{n:'武器广场周边，平地',tier:'$$',pick:true,q:'Cusco Plaza de Armas hotel',
    why:'3399 米，能不爬坡就不爬坡。订房前看清楚有没有电梯、要爬几层。'},
   {n:'圣布拉斯 San Blas',tier:'$$',q:'San Blas Cusco hotel',
    why:'最好看的一区，但全是陡坡和台阶，在这个海拔每天爬会很累。'}],
  food:[{n:'圣佩德罗市场',jp:'Mercado de San Pedro Cusco',why:'早上去，果汁摊和 caldo 汤。'},
   {n:'Menú del día',jp:'menu del dia Cusco',why:'午市套餐，汤 + 主菜 + 饮料，十几到二十索尔。'},
   {n:'烤豚鼠 cuy（想试的话）',jp:'cuy al horno Cusco',why:'安第斯的节庆菜，整只上桌。'}]},

 '拉巴斯':{area:'La Paz, Sopocachi / Zona Sur',
  opts:[{n:'Zona Sur（海拔更低）',tier:'$$',pick:true,q:'Zona Sur La Paz hotel',
    why:'比市中心低三百米左右，第一晚睡这边明显好受。缆车能上市区。'},
   {n:'Sopocachi',tier:'$',q:'Sopocachi La Paz hotel',
    why:'餐厅和酒吧集中，走路方便，但海拔高一些。'}],
  food:[{n:'Salteñas（只在早上）',jp:'salteñas La Paz',why:'汤汁很多的酥皮包，中午前就卖完。'},
   {n:'Mercado Lanza 的摊子',jp:'Mercado Lanza La Paz',why:'便宜且本地。肠胃敏感的话第一天先别试。'}]},

 '科帕卡巴纳':{area:'Copacabana, Lago Titicaca',
  opts:[{n:'湖景旅馆',tier:'$',pick:true,q:'Copacabana Bolivia lake hotel',
    why:'3810 米，是全程较高的地方。房间多数没有暖气，确认有热水和厚被子。'}],
  food:[{n:'Trucha（湖鳟）',jp:'trucha Copacabana Titicaca',why:'湖边一排都在做，煎的比炸的好。'}]},

 '乌尤尼镇':{area:'Uyuni',
  opts:[{n:'镇上有暖气的旅馆',tier:'$$',pick:true,q:'Uyuni hotel heating',
    why:'3670 米，夜里接近零度。暖气和热水是硬指标，比位置重要。'},
   {n:'盐砖旅馆（Hotel de Sal）',tier:'$$$',q:'Uyuni salt hotel',
    why:'墙和家具都用盐砖砌，在湖边。体验性强，条件相对简朴。'}],
  food:[{n:'镇上的披萨和烤肉',jp:'Uyuni restaurante',why:'选择很少，关得早。团里通常含午餐。'}]},

 '乌尤尼镇 / 山里':{area:'Uyuni 或 团队宿营点',
  opts:[{n:'看你选一日团还是三日团',tier:'$',pick:true,q:'Uyuni hotel',
    why:'一日团住回镇上；三日团的住宿由团安排，条件简陋，通常是通铺。'}],food:[]},

 '红湖附近':{area:'Laguna Colorada 周边',
  opts:[{n:'团队安排的山中宿舍',tier:'$',pick:true,q:'Laguna Colorada refugio',
    why:'4278 米，全程最高的一晚。通铺、无暖气、可能停电。带上自己的睡袋内胆和厚衣服。'}],
  food:[{n:'团队伙食',jp:'',why:'含在团费里。海拔高，吃少一点更舒服。'}]},

 'El Calafate':{area:'El Calafate, Argentina',
  opts:[{n:'主街 Av. Libertador 附近',tier:'$$',pick:true,q:'El Calafate hotel centro',
    why:'租装备、订团、吃饭都在这条街上。'}],
  food:[{n:'烤羊 Cordero patagónico',jp:'cordero patagonico El Calafate',why:'巴塔哥尼亚的招牌，整只在火边慢烤。'}]},

 'El Chaltén':{area:'El Chaltén, Argentina',
  opts:[{n:'镇上任意一家（步道起点就在镇里）',tier:'$$',pick:true,q:'El Chalten hotel',
    why:'镇子很小，走到哪儿都不超过十五分钟。旺季房源紧张，早订。'},
   {n:'带厨房的公寓',tier:'$$',q:'El Chalten apartment kitchen',
    why:'徒步日自己做早饭和干粮，省钱也方便。镇上超市选择有限，补给在 El Calafate 买齐。'}],
  food:[{n:'La Cervecería 一类的精酿馆',jp:'cerveceria El Chalten',why:'走完一天的常规动作。'},
   {n:'超市自备干粮',jp:'supermercado El Chalten',why:'步道上没有任何补给点，水可以在溪流补。'}]},

 'Puerto Natales':{area:'Puerto Natales, Chile',
  opts:[{n:'镇中心',tier:'$$',pick:true,q:'Puerto Natales hotel',
    why:'租装备、买补给、确认园区预订都在这里。很多旅舍可以寄存大件行李。'}],
  food:[{n:'Curanto 或海鲜汤',jp:'restaurante Puerto Natales',why:'进园前最后一顿正经的。'}]},

 '园区山屋':{area:'Torres del Paine, refugios',
  opts:[{n:'W 线沿途的 refugio（床位）',tier:'$$$',pick:true,q:'Torres del Paine refugio booking',
    why:'必须提前订才让进园，不能野营。两家运营商各管一部分营地，要分别订。旺季几个月前满。'},
   {n:'自带帐篷 + 营位',tier:'$$',q:'Torres del Paine camping',
    why:'便宜一些，但营位同样要预订，且要背帐篷。'}],
  food:[{n:'山屋的套餐',jp:'',why:'贵但省事，可以只订早晚餐。'},
   {n:'自带干粮',jp:'',why:'园区内没有商店。所有食物在 Puerto Natales 买齐。'}]},

 'Punta Arenas':{area:'Punta Arenas, Chile',
  opts:[{n:'市中心',tier:'$$',pick:true,q:'Punta Arenas hotel centro',
    why:'缓冲日 + 防天气误机。走路到麦哲伦海峡边。'}],food:[]},

 '布宜诺斯艾利斯':{area:'Buenos Aires, Palermo / Recoleta',
  opts:[{n:'Palermo',tier:'$$',pick:true,q:'Palermo Buenos Aires hotel',
    why:'餐厅和咖啡馆最集中，走路舒服。'}],
  food:[{n:'Parrilla 烤肉',jp:'parrilla Buenos Aires',why:'点 bife de chorizo，配马尔贝克。'}]},

 '波哥大':{area:'Bogotá, La Candelaria / Chapinero',
  opts:[{n:'Chapinero 或 Zona G',tier:'$$',pick:true,q:'Chapinero Bogota hotel',
    why:'2640 米。比 La Candelaria 安全一些，餐厅也更多。老城白天去就好。'}],
  food:[{n:'Ajiaco',jp:'ajiaco Bogota',why:'鸡肉土豆汤，配奶油和刺山柑。'}]},

 '麦德林':{area:'Medellín, El Poblado / Laureles',
  opts:[{n:'Laureles',tier:'$$',pick:true,q:'Laureles Medellin hotel',
    why:'比 El Poblado 本地感强、更安静，地铁方便。'},
   {n:'El Poblado',tier:'$$',q:'El Poblado Medellin hotel',
    why:'夜生活集中，游客也最多。'}],
  food:[{n:'Bandeja paisa',jp:'bandeja paisa Medellin',why:'分量极大，两个人可以分一份。'}]},

 'Salento':{area:'Salento, Quindío',
  opts:[{n:'镇上的彩色小旅馆',tier:'$',pick:true,q:'Salento Colombia hotel',
    why:'1895 米，气候舒服。去科科拉山谷的吉普车从广场发。'}],
  food:[{n:'Trucha con patacón',jp:'trucha Salento',why:'鳟鱼配炸大蕉。'}]},

 '卡塔赫纳':{area:'Cartagena, Centro / Getsemaní',
  opts:[{n:'城墙内老城',tier:'$$$',pick:true,q:'Cartagena walled city hotel',
    why:'最方便也最贵。很热，确认空调好用。'},
   {n:'Getsemaní',tier:'$$',q:'Getsemani Cartagena hotel',
    why:'紧挨老城，壁画和夜市，价格低一截，本地感更强。'}],
  food:[{n:'Arepa de huevo / 街边炸物',jp:'arepa de huevo Cartagena',why:'傍晚在广场边买。'},
   {n:'加勒比海鲜',jp:'restaurante Getsemani Cartagena',why:'Getsemaní 的小馆子比老城内实惠。'}]},

 '机上':{area:'',opts:[],food:[]}
};
