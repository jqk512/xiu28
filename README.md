# XIU28 / 宿格测试

以中国传统二十八星宿为灵感的人格测试离线原型。HTML + CSS + 原生 JavaScript，无构建、依赖安装、服务器、账号、API、CDN 或第三方服务。

## 打开

解压后保留整个目录，双击 `index.html` 即可开始。不要只拷贝 HTML。建议使用近期版本的 Chrome、Edge 或 Safari。

页面用 `#quiz`、`#result`、`#atlas`、`#type/xinyuehu` 这类哈希地址切换。没有本地 fetch、ES modules 或服务工作线程，可在 `file://` 下加载经典脚本与相对路径资源。关闭网络也不影响功能。

## 文件结构

```text
XIU28/
├── index.html                  页面入口
├── css/main.css                基础排版、响应式样式
├── css/stellar.css             星空底图与磨砂玻璃主题
├── js/
│   ├── questions.js            16 题与每个选项的权重
│   ├── types.js                四象、七曜和 28 个独立人格对象
│   ├── scoring.js              数据校验、纯评分函数、并列规则
│   └── app.js                  页面、答题状态、图鉴与图片兜底
├── assets/
│   ├── characters/             28 个原创 IP 图片
│   ├── icons/favicon.svg
│   └── images/                 后续视觉素材预留目录
├── tests/
│   ├── index.html             可直接双击运行的离线自检
│   └── checks.js              数据与评分测试
├── QA.md                      本次验证记录与边界
└── README.md
```

## 修改题目与权重

编辑 `js/questions.js` 中的 `window.XIU_QUESTIONS`。每题保留唯一 `id`、`text` 和 4 个 `options`。`category` 与 `hint` 可选；题目总数由程序读取，增删后进度条自动更新（自检中的 16 题断言需同步修改）。

```javascript
{
  id: "q17",
  category: "新的日常情境",
  text: "你的新题目？",
  options: [
    { text: "选项一", scores: { qinglong: 2, wood: 2, fire: 1 } },
    { text: "选项二", scores: { xuanwu: 2, moon: 2, water: 1 } },
    { text: "选项三", scores: { baihu: 2, metal: 2, earth: 1 } },
    { text: "选项四", scores: { zhuque: 2, sun: 2, fire: 1 } }
  ]
}
```

四象键：`qinglong` 青龙、`xuanwu` 玄武、`baihu` 白虎、`zhuque` 朱雀。

七曜键：`wood` 木、`fire` 火、`earth` 土、`metal` 金、`water` 水、`sun` 日、`moon` 月。

分数使用非负有限数字；省略的属性按 0 分处理。一个选项可同时加多个四象和七曜的分数。不要把各题 A/B/C/D 固定绑定同一象。

### 评分与并列

两条轴独立累计，最高四象与最高七曜映射成一个星宿。返回改答案只是替换该题的选项索引，结算时重新遍历当前答案，因此不会重复加分。

并列依次比较：

1. 累计得分。
2. 已选选项中，该属性在本轴内**独立最高**的次数。多人并列或全部 0 分不算领先。
3. 该属性获得 **至少 2 分**的次数。
4. 固定优先顺序：青龙 → 玄武 → 白虎 → 朱雀；木 → 火 → 土 → 金 → 水 → 日 → 月。

最后一层保证稳定，不代表人格高低。可在 `scoring.js` 的 `GROUP_ORDER`、`ELEMENT_ORDER` 修改；该顺序也决定部分展示顺序。结果页“为什么是这一宿？”公开得分和判定理由。分数占比不是准确率。当前题库、权重及人格文案均为创作性功能原型，未经过心理测量校准。

## 修改人格文案

直接编辑 `js/types.js` 中 `window.XIU_TYPES` 的对应对象。名称、标题、关键词、核心句、优势、弱点、社交、情绪、动物、图片路径都会同步更新结果页和图鉴。

`id` 用于详情地址；`groupId`、`elementId` 用于评分映射。确保每种四象 × 七曜组合恰好一个对象。`group` 与 `element` 是显示名称，修改时应与对应 ID 保持一致。四象介绍与配色编辑 `XIU_GROUPS`；七曜说明编辑 `XIU_ELEMENTS`。

## 角色图片与磨砂主题

28 个原创角色已放入 `assets/characters/`，通过 `js/types.js` 的 `image` 相对路径自动显示在图鉴、详情和测试认证页。例如 `assets/characters/xinyuehu.png`。以后可直接替换同名图片，或修改 `image` 路径；支持本地 PNG、WebP、JPG、SVG。图片完整等比展示，加载失败显示文字占位，图鉴使用懒加载。

底图为 `assets/images/stellar-background.png`。`css/stellar.css` 控制背景柔焦、半透明面板和磨砂玻璃效果；修改 `body::before` 的 `blur()` 可调节模糊程度。角色与文字不参与模糊，原始图片未经重绘或锐化。

## 状态与隐私

答案只在本页面内计算。浏览器允许时使用 `sessionStorage` 保存当前标签页进度，刷新可恢复；禁用存储或 `file://` 不支持存储时，自动退回内存模式，完整测试仍能运行，只是刷新会丢失进度。

“重新测试”清空答案、题号、延迟跳转和已保存的本轮状态。未完成测试不能通过 `#result` 直接生成结果。更换题库后旧进度自动失效。没有结果分享链接、数据上传或后台分析。

“保存结果”是明确的功能占位，点击显示提示，当前可用系统截图留存。

## 自检

双击 `tests/index.html`。检查完整映射、文案字段、权重、并列四层规则、修改后的分数、纯函数不污染状态、无效输入和 30,000 组固定种子答案的结果覆盖。不需要 Node.js。

## 上传为静态网站

将 `index.html`、`css/`、`js/`、`assets/` 原样上传到同一个发布目录。使用静态站点/无框架预设，不填构建命令，发布目录选择包含 `index.html` 的目录。

- GitHub Pages：将文件放入仓库根目录，选择对应分支和根目录发布。
- Cloudflare Pages / 腾讯 EdgeOne Pages：上传目录或连接仓库，按纯静态资源发布。
- Vercel：使用 Other / 静态资源预设，跳过构建，输出目录选择项目根目录。

所有资源使用相对路径，适合根域名和仓库子目录部署。哈希路由无需后端 rewrite，刷新不产生子路由 404。上线后将正式 HTTPS 首页地址制作成包装二维码。当前的本地文件路径不能作为消费者扫码地址。

## 设计说明

第二版参考 16Personalities 测试页面的清晰层级与宽松布局：白底、居中标题、柔和青绿/蓝紫色、系统无衬线字体与圆形选项控件。首页使用三步介绍，四象使用浅色区分；所有角色区为空白预留，不使用具体形象。星宿映射沿用提供的二十八宿名称；四象人格驱动力、七曜倾向和具体文案是本项目的现代创作设定。
