/* ══════════════════════════════════════════════════════════════
   content.js — 朝圣之路 · 西班牙 四套方案
   改字只动这个文件，index.html 一行都不用碰。
   ══════════════════════════════════════════════════════════════ */

const LABELS={
  cost:'费用',
  weather:'天气 · 降雨',
  segments:'行程',
  comparePlan:'方案对比',
  places:'推荐去处',
  ourPins:'我们收藏的地点',
  bookings:'预订',
  prepList:'行前准备',
  reconcile:'费用记录',
  fx:'汇率',
  rules:'徒步 · 实用',
  aboutPage:'关于本页'
};

const TXT={
  wxNote:'降水单位 mm。7 天预报现在参考意义不大，出发前两周开始每天看。上面是去年同期数据，判断 9-10 月加利西亚和安达卢西亚的降雨稳定性。数据 Open-Meteo（CC BY 4.0）。',
  itinHint:'点左侧任一天，地图跟随。底图可切「地形」层，看清沿途海拔起伏。',
  pinsEmpty:'还没有人加过点。把行程码发给同行的人，你们添加的餐厅或想去的地方会同步到彼此的地图上。地图上长按也能落点。',
  bookingIntro:'这一栏是记录，不是推荐。订好一项就点开填确认号和实付金额，两个人能看到，预算页会自动汇总。',
  prepIntro:'按方案过滤。前几项建议尽早处理：朝圣者护照需要提前办好，Sarria 第一晚住宿在 9 月比较紧张。',
  budgetNote:'写这版时约 1 CAD ≈ 0.65 EUR。数字是估算，不是报价，全部可调。朝圣之路日均开销约 30-50€，塞维利亚长住期间日均约 60-80€（含餐饮和短途交通）。<br><br>阿尔罕布拉宫门票需提前 1-2 周预约，格拉纳达一日游是塞维利亚长住期间最贵的单日项目。',
  noteHint:'到了之后记点实际信息：几点到、床位还剩多少、哪家店开得早。这条会显示在我的描述上面。',
  aboutPage:'行程码决定你看到哪份数据。你和同行的人用同一个码，加的点会互相同步；换一个没人用过的码，就是一份空白行程。',
  aboutFoot:'共享数据对所有知道行程码的人可见，不要放证件号或住址。坐标为示意精度，导航以实际地图为准。'
};

/* ── 区域 ── */
const R={
  galicia:{k:'galicia',n:'加利西亚',hex:'#5A7A6B'},
  andalucia:{k:'andalucia',n:'安达卢西亚',hex:'#C47A5A'},
  catalunya:{k:'catalunya',n:'加泰罗尼亚',hex:'#C4956A'},
  paisvasco:{k:'paisvasco',n:'巴斯克',hex:'#7A8F6E'},
  madrid:{k:'madrid',n:'马德里',hex:'#8B7D5C'}
};

/* ── 地点库 ── */
const P={};
function def(id,zh,jp,lat,lng,r,note){P[id]={id,zh,jp,lat,lng,r,note};}

/* — 朝圣之路（法国之路最后 100km） — */
def('sarria','萨里亚','Sarria',42.7801,-7.4142,'galicia','最后 100km 的起点。从 Madrid 或 Santiago 有火车和巴士直达。');
def('portomarin','波尔托马林','Portomarín',42.8050,-7.6160,'galicia','过了河上的桥就是老城区。河景不错。');
def('palas-rei','帕拉斯德雷伊','Palas de Rei',42.8735,-7.8688,'galicia','加利西亚内陆丘陵。沿途有奶牛牧场。');
def('melide','梅利德','Melide',42.9136,-8.0090,'galicia','章鱼小镇。朝圣者基本都会在这里停下来吃 Pulpo。');
def('arzua','阿尔苏阿','Arzúa',42.9270,-8.1640,'galicia','以奶酪出名。离 Santiago 约 40km。');
def('monte-gozo','蒙特戈佐山','Monte do Gozo',42.8838,-8.5088,'galicia','第一次看到 Santiago 大教堂尖顶的地方。');
def('santiago','圣地亚哥德孔波斯特拉','Santiago de Compostela',42.8805,-8.5457,'galicia','朝圣之路终点。大教堂每天中午 12 点有朝圣者弥撒。');

/* — 北方之路最后 100km — */
def('baamonde','巴蒙德','Baamonde',43.1704,-7.7050,'galicia','北方之路最后 100km 起点。小村庄。');
def('villela','维莱拉','Vilalba',43.2980,-7.6810,'galicia','北方之路上的小镇，有古堡。');
def('mondoñedo','蒙多涅多','Mondoñedo',43.4280,-7.3620,'galicia','北方之路上的历史小城。');
def('foz','福斯','Foz',43.5700,-7.2540,'galicia','海滨小镇，过了这里进入内陆。');
def('trabada','特拉巴达','Trabada',43.4480,-7.1940,'galicia','北方之路上的小村庄。');

/* — 安达卢西亚（塞维利亚周边） — */
def('sevilla','塞维利亚','Sevilla',37.3891,-5.9845,'andalucia','安达卢西亚首府，大教堂、王宫、西班牙广场。秋季天气好，适合长住。');
def('cordoba','科尔多瓦','Córdoba',37.8882,-4.7794,'andalucia','大清真寺（Mezquita），犹太区。高铁 45 分钟。');
def('granada','格拉纳达','Granada',37.1773,-3.5986,'andalucia','阿尔罕布拉宫需提前 1-2 周预约。Sacromonte 区的 flamenco 很出名。');
def('ronda','龙达','Ronda',36.7428,-5.1649,'andalucia','悬崖上的白城，新桥是标志。斗牛场是西班牙最古老的之一。');
def('jerez','赫雷斯','Jerez de la Frontera',36.6815,-6.1388,'andalucia','雪利酒的发源地。酒庄参观约 1.5 小时，需预约。');
def('cadiz','加的斯','Cádiz',36.5296,-6.2923,'andalucia','西班牙最古老的城市之一。老城区小而紧凑，沙滩不错。');
def('carmona','卡尔莫纳','Carmona',37.4717,-5.6430,'andalucia','白墙小镇，离塞维利亚 30 分钟。山坡上看整个平原。');
def('osuna','奥苏纳','Osuna',37.2379,-5.1030,'andalucia','安达卢西亚典型村庄，Game of Thrones 取景地。');
def('malaga','马拉加','Málaga',36.7213,-4.4215,'andalucia','地中海城市，毕加索博物馆。海滩 2 公里长。');
def('nerja','内尔哈','Nerja',36.7444,-3.8749,'andalucia','Balcón de Europa 海景平台。海边餐厅不错。');

/* — 巴塞罗那及周边 — */
def('barcelona','巴塞罗那','Barcelona',41.3851,2.1734,'catalunya','高迪的城市。圣家堂、桂尔公园、米拉之家。12 天可刷遍。');
def('gerona','赫罗纳','Girona',41.9813,2.8243,'catalunya','老城区、犹太区、大教堂。Game of Thrones 取景地之一。');
def('tarragona','塔拉戈纳','Tarragona',41.1188,1.2445,'catalunya','罗马遗迹，海边的古城。');
def('montserrat','蒙特塞拉特','Montserrat',41.5980,1.8360,'catalunya','锯齿山上的修道院。从巴塞罗那坐火车 1 小时。');

/* — 巴斯克（圣塞巴斯蒂安周边） — */
def('san-sebastian','圣塞巴斯蒂安','San Sebastián',43.3183,-1.9812,'paisvasco','巴斯克美食中心，La Concha 海滩。10 天可吃遍 Pintxos。');
def('bilbao','毕尔巴鄂','Bilbao',43.2630,-2.9350,'paisvasco','古根海姆博物馆。巴斯克传统菜。');
def('vitoria','维多利亚','Vitoria-Gasteiz',42.8467,-2.6716,'paisvasco','巴斯克首府，中世纪老城。');
def('hondarribia','宏达瑞比亚','Hondarribia',43.3620,-1.7930,'paisvasco','法国边境小镇，彩色房子。');

/* — 法国之路全程起点 — */
def('sjpp','圣让皮耶德波尔','Saint-Jean-Pied-de-Port',43.1636,-1.2367,'galicia','法国之路起点。朝圣者办公室在城墙下。');
def('roncesvalles','龙塞斯瓦列斯','Roncesvalles',43.0094,-1.3197,'galicia','翻过庇里牛斯山后的第一个西班牙村子。');
def('pamplona','潘普洛纳','Pamplona',42.8169,-1.6432,'galicia','奔牛节的城市。');
def('logrono','洛格罗尼奥','Logroño',42.4658,-2.4449,'galicia','里奥哈葡萄酒产区首府。');
def('burgos','布尔戈斯','Burgos',42.3439,-3.6969,'galicia','哥特式大教堂是世界遗产。');
def('leon','莱昂','León',42.5987,-5.5671,'galicia','莱昂大教堂的彩绘玻璃窗。');

/* ── 方案 ── */
const V={
A:{
  k:'A',gr:'A',name:'朝圣 + 安达卢西亚',met:'19 天 · 推荐',
  hex:'#5A7A6B',tag:'推荐',
  dates:'2027.09.15 → 10.03',
  pitch:'Sarria → Santiago 徒步 7 天，随后在塞维利亚长住 12 天。\n\n朝圣之路结束后，进入安达卢西亚深度游。塞维利亚住下来，每天轻装出发去周边城市——科尔多瓦、格拉纳达、龙达、赫雷斯、加的斯。和京都模式一样，行李只拆一次。',
  cons:'安达卢西亚 9-10 月气温 25-30°C，比加利西亚高。徒步结束后直接进入高温区域，需要适应。格拉纳达的阿尔罕布拉宫需要提前 1-2 周预约。',
  budget:{flight:2200,stay:1800,transit:500,food:1200,tickets:150,shop:400,misc:300},
  days:[
    {d:'09.15',w:'三',t:'抵达 · Sarria',r:'galicia',stay:'Sarria',walk:false,dist:0,note:'从 Santiago 坐巴士或火车到 Sarria（约 2 小时）。取护照、买贝壳、熟悉路线。',stops:[{t:'—',p:'sarria',n:'Sarria 入住',s:'朝圣者办公室在城边'}]},
    {d:'09.16',w:'四',t:'Sarria → Portomarín',r:'galicia',stay:'Portomarín',walk:true,dist:'22.5',note:'第一天 22.5km，缓坡起伏。经过几个小村子后到达河边的 Portomarín。',stops:[{t:'08:00',p:'sarria',n:'出发'},{t:'16:00',p:'portomarin',n:'抵达'}]},
    {d:'09.17',w:'五',t:'Portomarín → Palas de Rei',r:'galicia',stay:'Palas de Rei',walk:true,dist:'24.8',note:'24.8km，路程稍长。穿过加利西亚乡村，有橡树林和牧场。',stops:[{t:'08:00',p:'portomarin',n:'出发'},{t:'17:30',p:'palas-rei',n:'抵达'}]},
    {d:'09.18',w:'六',t:'Palas de Rei → Melide',r:'galicia',stay:'Melide',walk:true,dist:'14.8',note:'14.8km，轻松的一天。下午到 Melide，镇上的章鱼是必吃的。',stops:[{t:'09:00',p:'palas-rei',n:'出发'},{t:'13:00',p:'melide',n:'抵达'}]},
    {d:'09.19',w:'日',t:'Melide → Arzúa',r:'galicia',stay:'Arzúa',walk:true,dist:'15.6',note:'15.6km，穿过森林和溪流。Arzúa 以奶酪出名。',stops:[{t:'08:30',p:'melide',n:'出发'},{t:'13:00',p:'arzua',n:'抵达'}]},
    {d:'09.20',w:'一',t:'Arzúa → Monte do Gozo',r:'galicia',stay:'Monte do Gozo',walk:true,dist:'20.5',note:'20.5km，地势渐高。蒙特戈佐山是看到 Santiago 的第一眼。',stops:[{t:'07:30',p:'arzua',n:'出发'},{t:'15:00',p:'monte-gozo',n:'抵达'}]},
    {d:'09.21',w:'二',t:'Monte do Gozo → Santiago',r:'galicia',stay:'Santiago',walk:true,dist:'4.5',note:'最后 4.5km，走进古城。大教堂是终点。中午有朝圣者弥撒。',stops:[{t:'08:30',p:'monte-gozo',n:'出发'},{t:'10:00',p:'santiago',n:'抵达大教堂'},{t:'12:00',p:'santiago',n:'朝圣者弥撒'}]},
    {d:'09.22',w:'三',t:'Santiago → 塞维利亚',r:'andalucia',stay:'Sevilla',walk:false,dist:0,note:'转场日。从 Santiago 坐高铁到塞维利亚（约 5.5 小时，需在 Madrid 中转）。',stops:[{t:'08:00',p:'santiago',n:'Santiago 出发'},{t:'14:00',p:'sevilla',n:'塞维利亚 入住'}]},
    {d:'09.23',w:'四',t:'塞维利亚 · 城内',r:'andalucia',stay:'Sevilla',walk:false,dist:0,note:'塞维利亚第一天。大教堂、王宫、西班牙广场。',stops:[{t:'09:00',p:'sevilla',n:'塞维利亚大教堂'},{t:'14:00',p:'sevilla',n:'西班牙广场'}]},
    {d:'09.24',w:'五',t:'塞维利亚 · 城内',r:'andalucia',stay:'Sevilla',walk:false,dist:0,note:'Santa Cruz 老城漫步。特里亚纳区。',stops:[{t:'09:00',p:'sevilla',n:'Santa Cruz 区'},{t:'16:00',p:'sevilla',n:'特里亚纳区'}]},
    {d:'09.25',w:'六',t:'科尔多瓦 一日游',r:'andalucia',stay:'Sevilla',walk:false,dist:0,note:'高铁 45 分钟。大清真寺、犹太区、百花巷。当天往返。',stops:[{t:'08:30',p:'cordoba',n:'科尔多瓦 大清真寺'},{t:'15:00',p:'cordoba',n:'返回塞维利亚'}]},
    {d:'09.26',w:'日',t:'格拉纳达 一日游',r:'andalucia',stay:'Sevilla',walk:false,dist:0,note:'高铁 2.5 小时。阿尔罕布拉宫需提前 1-2 周预约。Sacromonte 弗拉门戈。',stops:[{t:'07:00',p:'granada',n:'阿尔罕布拉宫'},{t:'18:00',p:'granada',n:'返回塞维利亚'}]},
    {d:'09.27',w:'一',t:'龙达 一日游',r:'andalucia',stay:'Sevilla',walk:false,dist:0,note:'巴士或火车约 2 小时。悬崖上的白城，新桥和斗牛场。',stops:[{t:'08:30',p:'ronda',n:'龙达 新桥'},{t:'16:00',p:'ronda',n:'返回塞维利亚'}]},
    {d:'09.28',w:'二',t:'赫雷斯 + 加的斯 一日游',r:'andalucia',stay:'Sevilla',walk:false,dist:0,note:'高铁到赫雷斯 1 小时，再到加的斯 30 分钟。雪利酒庄和老城。',stops:[{t:'09:00',p:'jerez',n:'赫雷斯 酒庄'},{t:'14:00',p:'cadiz',n:'加的斯 老城'}]},
    {d:'09.29',w:'三',t:'塞维利亚 · 休整',r:'andalucia',stay:'Sevilla',walk:false,dist:0,note:'不安排景点。逛市场、找家咖啡馆坐一天。长住行程里建议留一天。',stops:[{t:'—',p:'sevilla',n:'自由活动'}]},
    {d:'09.30',w:'四',t:'卡尔莫纳 / 奥苏纳',r:'andalucia',stay:'Sevilla',walk:false,dist:0,note:'白墙小镇。巴士 30-60 分钟，看一个即可。',stops:[{t:'10:00',p:'carmona',n:'卡尔莫纳'}]},
    {d:'10.01',w:'五',t:'塞维利亚 · 补漏',r:'andalucia',stay:'Sevilla',walk:false,dist:0,note:'哪没去够再补一天。或者去马拉加/内尔哈（高铁 2 小时）。',stops:[{t:'—',p:'sevilla',n:'自由活动'}]},
    {d:'10.02',w:'六',t:'塞维利亚 → 马德里',r:'madrid',stay:'Madrid',walk:false,dist:0,note:'高铁到马德里约 2.5 小时。住一晚。',stops:[{t:'10:00',p:'sevilla',n:'塞维利亚出发'},{t:'13:00',p:'madrid',n:'马德里入住'}]},
    {d:'10.03',w:'日',t:'马德里 → 温哥华',r:'madrid',stay:'—',walk:false,dist:0,note:'从 Madrid 飞回温哥华。提前 3 小时到机场。',stops:[{t:'—',p:'madrid',n:'马德里机场'}]}
  ]
},
B:{
  k:'B',gr:'B',name:'朝圣 + 加泰罗尼亚',met:'19 天 · 城市向',
  hex:'#C4956A',tag:'城市向',
  dates:'2027.09.15 → 10.03',
  pitch:'Sarria → Santiago 徒步 7 天，随后在巴塞罗那长住 12 天。\n\n朝圣之路结束后，进入加泰罗尼亚深度游。巴塞罗那住下来，每天轻装出发去周边——赫罗纳、塔拉戈纳、蒙特塞拉特。适合更喜欢城市文化的人。',
  cons:'巴塞罗那 9-10 月游客仍然很多，圣家堂和桂尔公园需提前 1-2 周预约。相比塞维利亚，巴塞罗那消费更高。',
  budget:{flight:2200,stay:2100,transit:400,food:1400,tickets:200,shop:500,misc:300},
  days:[
    {d:'09.15',w:'三',t:'抵达 · Sarria',r:'galicia',stay:'Sarria',walk:false,dist:0,note:'从 Santiago 坐巴士或火车到 Sarria。',stops:[{t:'—',p:'sarria',n:'Sarria 入住'}]},
    {d:'09.16',w:'四',t:'Sarria → Portomarín',r:'galicia',stay:'Portomarín',walk:true,dist:'22.5',note:'',stops:[{t:'08:00',p:'sarria',n:'出发'},{t:'16:00',p:'portomarin',n:'抵达'}]},
    {d:'09.17',w:'五',t:'Portomarín → Palas de Rei',r:'galicia',stay:'Palas de Rei',walk:true,dist:'24.8',note:'',stops:[{t:'08:00',p:'portomarin',n:'出发'},{t:'17:30',p:'palas-rei',n:'抵达'}]},
    {d:'09.18',w:'六',t:'Palas de Rei → Melide',r:'galicia',stay:'Melide',walk:true,dist:'14.8',note:'',stops:[{t:'09:00',p:'palas-rei',n:'出发'},{t:'13:00',p:'melide',n:'抵达'}]},
    {d:'09.19',w:'日',t:'Melide → Arzúa',r:'galicia',stay:'Arzúa',walk:true,dist:'15.6',note:'',stops:[{t:'08:30',p:'melide',n:'出发'},{t:'13:00',p:'arzua',n:'抵达'}]},
    {d:'09.20',w:'一',t:'Arzúa → Monte do Gozo',r:'galicia',stay:'Monte do Gozo',walk:true,dist:'20.5',note:'',stops:[{t:'07:30',p:'arzua',n:'出发'},{t:'15:00',p:'monte-gozo',n:'抵达'}]},
    {d:'09.21',w:'二',t:'Monte do Gozo → Santiago',r:'galicia',stay:'Santiago',walk:true,dist:'4.5',note:'',stops:[{t:'08:30',p:'monte-gozo',n:'出发'},{t:'10:00',p:'santiago',n:'抵达大教堂'}]},
    {d:'09.22',w:'三',t:'Santiago → 巴塞罗那',r:'catalunya',stay:'Barcelona',walk:false,dist:0,note:'从 Santiago 飞巴塞罗那（约 1.5 小时）。',stops:[{t:'10:00',p:'santiago',n:'Santiago 出发'},{t:'14:00',p:'barcelona',n:'巴塞罗那 入住'}]},
    {d:'09.23',w:'四',t:'巴塞罗那 · 高迪',r:'catalunya',stay:'Barcelona',walk:false,dist:0,note:'圣家堂、桂尔公园。需提前预约。',stops:[{t:'09:00',p:'barcelona',n:'圣家堂'},{t:'14:00',p:'barcelona',n:'桂尔公园'}]},
    {d:'09.24',w:'五',t:'巴塞罗那 · 哥特区',r:'catalunya',stay:'Barcelona',walk:false,dist:0,note:'哥特区、兰布拉大道、博盖利亚市场。',stops:[{t:'09:00',p:'barcelona',n:'哥特区'}]},
    {d:'09.25',w:'六',t:'赫罗纳 一日游',r:'catalunya',stay:'Barcelona',walk:false,dist:0,note:'火车 40 分钟。老城区、犹太区。',stops:[{t:'09:00',p:'gerona',n:'赫罗纳'}]},
    {d:'09.26',w:'日',t:'蒙特塞拉特 一日游',r:'catalunya',stay:'Barcelona',walk:false,dist:0,note:'火车 1 小时。山上的修道院。',stops:[{t:'09:00',p:'montserrat',n:'蒙特塞拉特'}]},
    {d:'09.27',w:'一',t:'塔拉戈纳 一日游',r:'catalunya',stay:'Barcelona',walk:false,dist:0,note:'火车 1 小时。罗马遗迹。',stops:[{t:'09:00',p:'tarragona',n:'塔拉戈纳'}]},
    {d:'09.28-10.02',w:'二-六',t:'巴塞罗那 · 自由日',r:'catalunya',stay:'Barcelona',walk:false,dist:0,note:'不安排固定行程。补漏、购物、找家咖啡馆坐一天。',stops:[{t:'—',p:'barcelona',n:'自由活动'}]},
    {d:'10.03',w:'日',t:'巴塞罗那 → 温哥华',r:'catalunya',stay:'—',walk:false,dist:0,note:'从 BCN 飞回温哥华。',stops:[{t:'—',p:'barcelona',n:'巴塞罗那机场'}]}
  ]
},
C:{
  k:'C',gr:'C',name:'北方之路 + 巴斯克',met:'17 天 · 海岸向',
  hex:'#7A8F6E',tag:'海岸向',
  dates:'2027.09.15 → 10.01',
  pitch:'北方之路最后 100km（7 天）+ 圣塞巴斯蒂安长住 10 天。\n\n沿着海岸线走，海景和山景交替。结束后在巴斯克美食中心住下来，吃透 Pintxos。',
  cons:'北方之路起伏较大，比法国之路辛苦。9 月加利西亚北部降雨量比 Sarria 段多一些。',
  budget:{flight:2200,stay:1700,transit:400,food:1300,tickets:100,shop:400,misc:300},
  days:[
    {d:'09.15',w:'三',t:'抵达 · Baamonde',r:'galicia',stay:'Baamonde',walk:false,dist:0,note:'从 Santiago 坐巴士到 Baamonde（约 2 小时）。',stops:[{t:'—',p:'baamonde',n:'Baamonde 入住'}]},
    {d:'09.16',w:'四',t:'Baamonde → Vilalba',r:'galicia',stay:'Vilalba',walk:true,dist:'20.0',note:'北方之路第一天。加利西亚北部丘陵。',stops:[{t:'08:00',p:'baamonde',n:'出发'},{t:'16:00',p:'villela',n:'抵达 Vilalba'}]},
    {d:'09.17',w:'五',t:'Vilalba → Mondoñedo',r:'galicia',stay:'Mondoñedo',walk:true,dist:'22.0',note:'经过森林和小村庄。Mondoñedo 有历史老城。',stops:[{t:'08:00',p:'villela',n:'出发'},{t:'17:00',p:'mondoñedo',n:'抵达'}]},
    {d:'09.18',w:'六',t:'Mondoñedo → Foz',r:'galicia',stay:'Foz',walk:true,dist:'18.0',note:'向南走到海滨小镇 Foz。海岸线。',stops:[{t:'08:30',p:'mondoñedo',n:'出发'},{t:'15:00',p:'foz',n:'抵达'}]},
    {d:'09.19',w:'日',t:'Foz → Trabada',r:'galicia',stay:'Trabada',walk:true,dist:'20.0',note:'离开海岸，进入内陆。',stops:[{t:'08:00',p:'foz',n:'出发'},{t:'16:00',p:'trabada',n:'抵达'}]},
    {d:'09.20',w:'一',t:'Trabada → 北方之路终点',r:'galicia',stay:'Santiago',walk:true,dist:'20.0',note:'北方之路最后一天，汇入法国之路终点。',stops:[{t:'08:00',p:'trabada',n:'出发'},{t:'16:00',p:'santiago',n:'抵达 Santiago'}]},
    {d:'09.21',w:'二',t:'Santiago → 圣塞巴斯蒂安',r:'paisvasco',stay:'San Sebastián',walk:false,dist:0,note:'从 Santiago 飞圣塞巴斯蒂安（约 1 小时，在马德里中转）。',stops:[{t:'10:00',p:'santiago',n:'Santiago 出发'},{t:'15:00',p:'san-sebastian',n:'入住'}]},
    {d:'09.22-10.01',w:'三-五',t:'圣塞巴斯蒂安 · 长住',r:'paisvasco',stay:'San Sebastián',walk:false,dist:0,note:'La Concha 海滩、老城区 Pintxos 巡礼。周边：毕尔巴鄂、宏达瑞比亚、维多利亚。',stops:[{t:'—',p:'san-sebastian',n:'自由活动'}]}
  ]
},
D:{
  k:'D',gr:'D',name:'法国之路全程 + 安达卢西亚',met:'43 天 · 完整',
  hex:'#8B7D5C',tag:'完整',
  dates:'2027.09.01 → 10.13',
  pitch:'从 SJPP 走完法国之路全程（33 天），然后在塞维利亚长住 10 天。\n\n最完整的朝圣体验，随后在安达卢西亚休整和深度游。适合时间充裕的人。',
  cons:'时间跨度长，对体力和时间要求高。全程约 780km，Meseta 段比较枯燥。需要在 SJPP 和 Roncesvalles 提前订住宿。',
  budget:{flight:2200,stay:4000,transit:800,food:2200,tickets:150,shop:500,misc:400},
  days:[
    {d:'09.01',w:'三',t:'抵达 · SJPP',r:'galicia',stay:'SJPP',walk:false,dist:0,note:'法国之路起点。朝圣者办公室领护照。',stops:[{t:'—',p:'sjpp',n:'SJPP 入住'}]},
    {d:'09.02',w:'四',t:'SJPP → Roncesvalles',r:'galicia',stay:'Roncesvalles',walk:true,dist:'25.1',note:'翻越庇里牛斯山，全程最艰苦的一天。',stops:[{t:'07:00',p:'sjpp',n:'出发'},{t:'16:00',p:'roncesvalles',n:'抵达'}]},
    // 方案 D 的其余 31 天略 — 可按法国之路标准行程填充
    {d:'10.05',w:'二',t:'Monte do Gozo → Santiago',r:'galicia',stay:'Santiago',walk:true,dist:'4.5',note:'最后一天。',stops:[{t:'08:30',p:'monte-gozo',n:'出发'},{t:'10:00',p:'santiago',n:'抵达大教堂'}]},
    {d:'10.06',w:'三',t:'Santiago → 塞维利亚',r:'andalucia',stay:'Sevilla',walk:false,dist:0,note:'转场。',stops:[{t:'08:00',p:'santiago',n:'Santiago 出发'},{t:'14:00',p:'sevilla',n:'塞维利亚入住'}]},
    {d:'10.07-10.13',w:'四-三',t:'塞维利亚 · 长住',r:'andalucia',stay:'Sevilla',walk:false,dist:0,note:'塞维利亚及周边：科尔多瓦、格拉纳达、龙达。',stops:[{t:'—',p:'sevilla',n:'自由活动'}]}
  ]
}
};

const BROWS=[
  {k:'flight',n:'国际机票',s:'YVR ⇄ 欧洲 · 2 人',max:5000},
  {k:'stay',n:'住宿',s:'庇护所 / 旅馆',max:4000},
  {k:'transit',n:'交通',s:'高铁 / 巴士 / 机场接驳',max:1500},
  {k:'food',n:'餐饮',s:'朝圣者套餐 / 当地餐饮',max:3500},
  {k:'tickets',n:'门票',s:'教堂 / 阿尔罕布拉宫 / 博物馆',max:300},
  {k:'shop',n:'购物',s:'手信 / 贝壳 / 当地特产',max:800},
  {k:'misc',n:'杂项',s:'保险 / 洗衣 / 装备',max:800}
];

const TODOS=[
  {id:'t1',n:'订国际机票',s:'YVR ⇄ 欧洲（Madrid/Santiago/Barcelona），9-10 月是旺季肩季',due:'立刻',v:'ABCD'},
  {id:'t2',n:'办朝圣者护照',s:'在起点（Sarria/SJPP）的朝圣者办公室办',due:'抵达后',v:'ABCD'},
  {id:'t3',n:'订 Sarria/SJPP 前两晚住宿',s:'9 月旺季，前两站庇护所比较紧张',due:'出发前 1 周',v:'ABD'},
  {id:'t4',n:'预约阿尔罕布拉宫',s:'格拉纳达一日游需提前 1-2 周在网上预约',due:'出发前 1 周',v:'AD'},
  {id:'t5',n:'下载离线地图',s:'Buen Camino App 或 Google Maps 离线区',due:'出发前 3 天',v:'ABCD'},
  {id:'t6',n:'装备准备',s:'30-40L 背包，6-9kg。徒步鞋提前穿两周。睡袋内衬必带。',due:'出发前 1 周',v:'ABCD'},
  {id:'t7',n:'凡士林 + 水泡贴',s:'每天走路 15-25km，脚底容易出问题',due:'出发前 1 周',v:'ABCD'},
  {id:'t8',n:'斗篷式雨衣',s:'加利西亚 9 月仍可能下雨',due:'出发前 1 周',v:'ABCD'},
  {id:'t9',n:'旅行保险（含徒步）',s:'确认覆盖徒步受伤和救援',due:'出发前 1 周',v:'ABCD'},
  {id:'t10',n:'订 Santiago 回程交通',s:'走完当天从 Santiago 去下一站',due:'出发前 1 月',v:'ABCD'}
];

const RULES=[
  ['庇护所规则','公立庇护所先到先得，不可预订。建议每天 14:00 前抵达。私人庇护所可预订。'],
  ['徒步节奏','每天 15-25km 是大多数人的配速。前两天少走一些，让脚适应。'],
  ['吃饭','朝圣者套餐约 10-15€，含前菜、主菜、甜点和酒。'],
  ['背包','30-40L，不超过体重的 10%。不必要的物品可寄到 Santiago 或下一站。']
];

/* ── 住宿 ── */
const STAY={
 'Sarria':{area:'Sarria 中心',
  opts:[{n:'Albergue San Marcos',tier:'€',pick:true,q:'Albergue San Marcos Sarria',why:'€12，近朝圣者办公室。'},
   {n:'Hotel Alfonso IX',tier:'€€',q:'Hotel Alfonso IX Sarria',why:'€35-45，私人房间。'}],
  food:[{n:'Café de la Plaza',jp:'Café de la Plaza',why:'朝圣者套餐 €12。'}]},
 'Portomarín':{area:'老城区',
  opts:[{n:'Albergue de Portomarín',tier:'€',pick:true,q:'Albergue Portomarín',why:'€10，公立。'},
   {n:'Hotel Villa de Portomarín',tier:'€€',q:'Hotel Portomarín',why:'€40-50。'}],
  food:[{n:'O Mirador',jp:'O Mirador',why:'河景餐厅，朝圣者套餐 €13。'}]},
 'Palas de Rei':{area:'镇中心',
  opts:[{n:'Albergue de Palas de Rei',tier:'€',pick:true,q:'Albergue Palas de Rei',why:'€10。'},
   {n:'Hostal Roxa',tier:'€€',q:'Hostal Roxa Palas de Rei',why:'€30-40。'}],
  food:[{n:'Casa Curro',jp:'Casa Curro',why:'章鱼和烤猪肉。'}]},
 'Melide':{area:'镇中心',
  opts:[{n:'Albergue de Melide',tier:'€',pick:true,q:'Albergue Melide',why:'€12。'},
   {n:'Hotel Carlos',tier:'€€',q:'Hotel Carlos Melide',why:'€35-45。'}],
  food:[{n:'Pulpería A Garnacha',jp:'Pulpería A Garnacha',why:'Melide 最出名的章鱼店。'}]},
 'Arzúa':{area:'镇中心',
  opts:[{n:'Albergue de Arzúa',tier:'€',pick:true,q:'Albergue Arzúa',why:'€10。'},
   {n:'Hostal Arzúa',tier:'€€',q:'Hostal Arzúa',why:'€30-40。'}],
  food:[{n:'Pulpería Arzúa',jp:'Pulpería Arzúa',why:'章鱼和当地奶酪。'}]},
 'Monte do Gozo':{area:'山坡',
  opts:[{n:'Albergue de Monte do Gozo',tier:'€',pick:true,q:'Monte do Gozo albergue',why:'€15。'},
   {n:'Hotel Monte do Gozo',tier:'€€',q:'Hotel Monte do Gozo',why:'€45-55。'}],
  food:[{n:'Bar Monte do Gozo',jp:'Bar Monte do Gozo',why:'简单午餐。'}]},
 'Santiago':{area:'大教堂周边',
  opts:[{n:'Albergue de San Martín',tier:'€',pick:true,q:'Albergue San Martín Santiago',why:'€15。'},
   {n:'Hotel Palacio del Carmen',tier:'€€',q:'Hotel Santiago',why:'€50-70。'}],
  food:[{n:'Café O Dezaseis',jp:'Café O Dezaseis',why:'Galicia 菜系。'}]},
 'Sevilla':{area:'老城区',
  opts:[{n:'Hotel Casa de la Memoria',tier:'€€',pick:true,q:'Casa de la Memoria Sevilla',why:'€55-75，近大教堂，安静。'},
   {n:'Hostal Sevilla',tier:'€',q:'Hostal Sevilla centro',why:'€30-45。'}],
  food:[{n:'Bar El Comercio',jp:'Bar El Comercio',why:'炸鱼和啤酒。'},{n:'Casa Morales',jp:'Casa Morales',why:'塞维利亚最老的酒馆之一。'}]},
 'Barcelona':{area:'哥特区 / Eixample',
  opts:[{n:'Hotel Casa Camper',tier:'€€',pick:true,q:'Casa Camper Barcelona',why:'€90-120，近兰布拉。'},
   {n:'Hostal Barcelona',tier:'€',q:'Hostal Barcelona centro',why:'€40-55。'}],
  food:[{n:'Cal Pep',jp:'Cal Pep',why:'海鲜 tapas，需要排队。'},{n:'El Xampanyet',jp:'El Xampanyet',why:'气泡酒和 tapas。'}]},
 'San Sebastián':{area:'老城区 / La Concha',
  opts:[{n:'Hotel Londres',tier:'€€',pick:true,q:'Hotel Londres San Sebastián',why:'€80-120，海景。'},
   {n:'Hostal San Sebastián',tier:'€',q:'Hostal San Sebastián centro',why:'€35-50。'}],
  food:[{n:'La Cuchara de San Telmo',jp:'La Cuchara de San Telmo',why:'巴斯克 Pintxos。'},{n:'Txuleta',jp:'Txuleta',why:'巴斯克牛排。'}]},
 'SJPP':{area:'城墙下',
  opts:[{n:'Gite Makila',tier:'€€',pick:true,q:'Gite Makila Saint-Jean-Pied-de-Port',why:'€25，含早餐。'},
   {n:'Municipal albergue',tier:'€',q:'Municipal albergue SJPP',why:'€8-12。'}],
  food:[{n:'Chez Dédé',jp:'Chez Dédé',why:'鸭胸和土豆饼。'}]},
 'Roncesvalles':{area:'修道院旁',
  opts:[{n:'Real Colegiata de Roncesvalles',tier:'€',pick:true,q:'Roncesvalles albergue',why:'€12。'}],
  food:[{n:'朝圣者套餐（庇护所内）',jp:'Menú del peregrino',why:'€10。'}]},
 'Madrid':{area:'市中心',
  opts:[{n:'Hotel Palacio de los Duques',tier:'€€',pick:true,q:'Hotel Madrid centro',why:'€70-100。'},
   {n:'Hostal Madrid',tier:'€',q:'Hostal Madrid centro',why:'€35-50。'}],
  food:[{n:'Casa Lucio',jp:'Casa Lucio',why:'马德里老餐厅。'}]}
};