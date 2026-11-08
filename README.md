# 旅行计划网页

给每一趟旅行做一个手机上好用的页面：逐日行程、地图、住宿方向、预算、行前待办，
还能记航班和租车（带倒计时）、多人分账。可以加到手机主屏幕，没网也能打开。

纯静态网页，没有后台，免费托管在 GitHub Pages 上。

## 想做自己的行程？

1. 点右上角 **Fork**，得到一份自己的仓库。
2. 在仓库的 **Settings → Pages** 里选 `main` 分支、根目录，保存。几分钟后网页就上线了。
3. 复制 `template` 文件夹，改个名字（例如 `tokyo-2028`），改里面的 3 个文件。
   详细步骤见 **[docs/ADD_A_TRIP.md](docs/ADD_A_TRIP.md)**。
4. 不想自己写内容？把 **[docs/AI_PROMPT.md](docs/AI_PROMPT.md)** 里的提示词连同你的行程一起丢给 AI，它会生成 `content.js`。

先看看效果：打开 `/template/`，那是一份能直接运行的「京都三日」示例。

## 文件夹结构

```
index.html            首页（所有行程的目录）
template/             新行程的模板，复制它开始
  index.html            页面外壳，只需要改标题
  trip.js               这个行程的基本设置（出发日、币种、天气地点……）
  content.js            这个行程的全部内容（每天去哪、地点、预算、待办）
shared/               所有行程共用的代码，一般不用动
  engine.js             通用引擎：地图、行程、预订、笔记、导出日历……
  defaults.js           通用默认实现（读 trip.js 的设置，生成各个页签）
  validate.js           启动前检查内容，填错了会用中文告诉你哪里错
  extras.js             航班/租车倒计时、记账分摊、「此刻关注」、同步入口
  skin.css, base.css    外观
  vendor/leaflet/       地图库（已自带，不依赖外部 CDN）
supabase/setup.sql    多人同步用的建表脚本（可选）
SUPABASE.md           多人同步怎么配（可选）
```

`banff-2027`、`fall-2027`、`japow-2027`、`camino-2027`、`andes-2027` 是作者自己的五趟行程，
它们各有一份完整的 `trip.js`（带自己的特殊部件，例如 Epic 滑雪额度、开车强度、变色窗口）。
`kansai-2027` 用的是和 `template` 同一套通用实现（`shared/defaults.js`），它的特殊部分
（台风风险条、按住宿分段、熊野与自驾要点、预订推导）都写成了 `trip.js` 里的钩子，可以当作"在模板上加自定义部件"的例子来读。

## 数据存在哪里

- 收藏的地点、笔记、预订记录、待办勾选、航班、租车、账目，**只存在你自己设备的浏览器里**。
  换设备或清除浏览数据会丢，页面里有「导出 JSON」可以备份。
- 想让你和同伴看到同一份，需要配一个免费的 Supabase，见 [SUPABASE.md](SUPABASE.md)。
- 页面是公开的，任何人拿到网址都能看。**不要把确认号、证件号、房间号写进 `content.js`。**

## 本地预览

在这个文件夹里运行：

```
python -m http.server 8000
```

然后打开 <http://localhost:8000/>。（直接双击 html 文件也能看，但离线缓存不会生效。）

## 许可

代码以 MIT 协议开放。`shared/vendor/leaflet` 是 [Leaflet](https://leafletjs.com)（BSD-2-Clause）。
地图数据 © OpenStreetMap 贡献者，地形图 © OpenTopoMap，天气数据来自 Open-Meteo（CC BY 4.0）。

## 新增功能

- **中 / EN 切换**：页头右上角按钮。界面文字和地点名自动换成英文；正文英文放在各行程的 en.js（见 	emplate/en.js），没写到的句子保持中文。
- **查价**：「出行」页签里生成携程、Trip.com、Expedia、Google Flights、Booking 等站点的搜索链接，并可记录自己查到的价格。页面是静态的，不会自动抓取价格。
- **极光行程**：urora-2027/，准备页显示 NOAA 的 Kp 预报和 Open-Meteo 的夜间云量。

