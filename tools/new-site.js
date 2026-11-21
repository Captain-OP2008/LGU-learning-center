#!/usr/bin/env node
/* =====================================================================
 * new-site.js · 课程站骨架生成器
 *
 * 依据：_data/courses.json（课程主数据）+ _template/（学站模板）
 * 产出：sites/<dir>/ 下的完整可运行骨架（8 章占位 + 数据文件 + SW + manifest）
 *
 * 用法：
 *   node tools/new-site.js                      # 生成所有缺失的新站
 *   node tools/new-site.js --only csc3001,act2111
 *   node tools/new-site.js --force --only act2111   # 覆盖已有目录
 *   node tools/new-site.js --build 20261121n1       # 指定统一构建号
 *
 * 约定：
 *   - 已存在的站点（courses.json 里 existing 字段非空）永不覆盖；
 *   - 非 --force 时已存在的目录跳过；
 *   - 生成后请用 node tools/check-site.js <dir> 验证。
 * ===================================================================== */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TPL_DIR = path.join(ROOT, '_template');
const SITES_DIR = path.join(ROOT, 'sites');

/* ---------- 参数 ---------- */
const argv = process.argv.slice(2);
let BUILD = '20261121n1';
let FORCE = false;
let ONLY = null;
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === '--force') FORCE = true;
  else if (a === '--build') BUILD = argv[++i];
  else if (a === '--only') ONLY = String(argv[++i] || '').split(',').map(s => s.trim()).filter(Boolean);
  else if (a === '--help' || a === '-h') { console.log('用法: node tools/new-site.js [--only a,b] [--force] [--build 20261121n1]'); process.exit(0); }
  else { console.error('未知参数: ' + a); process.exit(2); }
}
if (!/^[0-9a-z]+$/.test(BUILD)) { console.error('--build 只接受小写字母数字：' + BUILD); process.exit(2); }

/* ---------- 工具 ---------- */
function read(p) { return fs.readFileSync(p, 'utf8'); }
function write(p, s) { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, s); }
function escAttr(s) { return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;'); }
function pad2(n) { return String(n).padStart(2, '0'); }
function replaceAll(s, from, to) {
  if (!from) return s;
  return s.split(from).join(to);
}

/* ---------- 课程数据 ---------- */
const courses = JSON.parse(read(path.join(ROOT, '_data', 'courses.json')));
const byDir = new Map(courses.map(c => [c.dir, c]));

/* ---------- index.html ---------- */
function buildIndexHtml(c, seq) {
  let h = read(path.join(TPL_DIR, 'index.html'));
  const stamp = '20261117q6';
  const short = c.short;
  const desc = c.title + '（' + c.en + '）：' + c.chapters + ' 章正文，按「概念 → 例子 → 对比 → 自检」组织，' +
    '含分章题库、模拟卷、实战项目与本地资料库；纯静态、可离线。';

  /* 版本号：全站统一 */
  h = replaceAll(h, stamp, BUILD);

  /* 标题与描述 */
  h = h.replace(/<title>[^<]*<\/title>/, '<title>' + escAttr(c.title) + ' · 深空观测台</title>');
  h = h.replace(/<meta property="og:title" content="[^"]*">/, '<meta property="og:title" content="' + escAttr(c.title + ' · 深空观测台') + '">');
  h = h.replace(/<meta property="og:description" content="[^"]*">/, '<meta property="og:description" content="' + escAttr(desc) + '">');
  h = h.replace(/<meta name="description" content="[^"]*">/, '<meta name="description" content="' + escAttr(desc) + '">');

  /* 启动画面（JS 执行前即可见的静态文案） */
  h = replaceAll(h, '<div class="bootWatermark" aria-hidden="true">PYTHON</div>',
    '<div class="bootWatermark" aria-hidden="true">' + escAttr(short) + '</div>');
  h = h.replace(/<div class="bootHead"><span>[^<]*<\/span><span>[^<]*<\/span><\/div>/,
    '<div class="bootHead"><span>' + escAttr(short) + ' // OBSERVATORY</span><span>BOOT_SEQUENCE // ' + pad2(seq) + '</span></div>');

  /* 顶栏品牌 / 系统面板 */
  h = h.replace(/aria-label="[^"]*· OBSERVATORY"/, 'aria-label="' + escAttr(short + ' · OBSERVATORY') + '"');
  h = h.replace(/<span class="t">PYTHON<span class="tzh">[^<]*<\/span><\/span>/,
    '<span class="t">' + escAttr(short) + '<span class="tzh">' + escAttr(c.zh) + '</span></span>');
  h = h.replace(/<span class="s">[^<]*<\/span>/, '<span class="s">' + escAttr(c.brand) + '</span>');
  h = h.replace(/<span class="sysV">PYTHON<\/span>/, '<span class="sysV">' + escAttr(short) + '</span>');
  h = h.replace(/<span class="sysV">PYTHON 3 · 静态示例<\/span>/, '<span class="sysV">' + escAttr(c.langLabel + ' · 静态示例') + '</span>');
  h = h.replace(/<span class="footTag">[^<]*<\/span>/, '<span class="footTag">' + escAttr(short) + '</span>');
  h = h.replace(/placeholder="QUERY \/\/ 搜索[^"]*"/, 'placeholder="QUERY // 搜索本站章节、术语与题目"');

  return h;
}

/* ---------- manifest ---------- */
function buildManifest(c) {
  const desc = c.title + ' —— 深空观测台学习站：' + c.chapters + ' 章正文、题库、模拟卷、实战项目与本地资料库。';
  return JSON.stringify({
    name: c.title + ' · 深空观测台',
    short_name: c.short,
    description: desc,
    lang: 'zh-CN',
    start_url: './index.html',
    scope: './',
    display: 'standalone',
    orientation: 'any',
    background_color: '#0e141f',
    theme_color: '#0e141f',
    categories: ['education', 'productivity'],
    icons: [
      { src: '../../shared/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '../../shared/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '../../shared/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
    ]
  }, null, 2) + '\n';
}

/* ---------- sw.js ---------- */
function buildSw(c) {
  const chs = [];
  for (let i = 0; i < c.chapters; i++) chs.push("  './data/ch" + pad2(i) + ".js'");
  return `/* =====================================================================
 * sw.js · Service Worker（仅在 http/https 下生效，file:// 双击打开时自动跳过）
 * 策略：network-first（内容更新即时生效），断网回退缓存，做到离线可学。
 * ===================================================================== */
var CACHE = '${c.id}-${BUILD}';
/* 注意：data/chXX.js 必须全部列在这里；漏掉的话断网后会缺少章节。 */
var CORE = [
  './',
  './index.html',
  './manifest.webmanifest',
  '../../shared/icons/favicon.svg',
  '../../shared/icons/icon-192.png',
  '../../shared/icons/icon-512.png',
  '../../shared/icons/icon-maskable-512.png',
  '../../shared/css/app.css',
  '../../shared/css/observatory.css',
  '../../shared/css/pages-reference.css',
  '../../shared/css/pages-tools.css',
  '../../shared/css/pages-features.css',
  '../../shared/css/pages-projects.css',
  '../../shared/css/pages-advanced.css',
  '../../shared/css/pages-widgets.css',
  './assets/observatory.js',
  './assets/app.js',
  './assets/motion.js',
  './assets/quiz.js',
  './assets/exam.js',
  './assets/projects.js',
  '../../shared/fonts/Jura-Light.ttf',
  '../../shared/fonts/Jura-Medium.ttf',
  '../../shared/fonts/Jura-Bold.ttf',
  '../../shared/fonts/RobotoMono-Light.ttf',
  '../../shared/fonts/RobotoMono-Regular.ttf',
  './data/site.js',
  './data/index.js',
${chs.join(',\n')},
  './data/quiz.js',
  './data/exam.js',
  './data/projects.js'
];

self.addEventListener('install', function (e) {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      var failed = [];
      return Promise.all(CORE.map(function (u) {
        return c.add(u).catch(function () { failed.push(u); });
      })).then(function () {
        if (failed.length) console.warn('[SW] 预缓存失败 ' + failed.length + ' 项：' + failed.join(', '));
      });
    })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) { if (k !== CACHE) return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
    .then(function () {
      return self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (list) {
        for (var i = 0; i < list.length; i++) {
          try { list[i].postMessage({ type: 'sw:updated', cache: CACHE }); } catch (err) {}
        }
      });
    })
  );
});

function cachePut(req, res) {
  if (!res || !res.ok) return;
  var copy = res.clone();
  caches.open(CACHE).then(function (c) { c.put(req, copy); }).catch(function () {});
}

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin !== location.origin) return;

  e.respondWith(
    fetch(req).then(function (res) { cachePut(req, res); return res; })
    .catch(function () {
      return caches.match(req, { ignoreSearch: true }).then(function (hit) {
        if (hit) return hit;
        if (req.mode === 'navigate') return caches.match('./index.html');
        return new Response('离线且未缓存：' + req.url, { status: 504, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
      });
    })
  );
});
`;
}

/* ---------- data/site.js ---------- */
function buildSiteJs(c) {
  /* 第二行（em）在 1440px 视口下约可容纳 8 个全角字宽，超出会被浏览器折行、末尾易剩孤字 */
  const emWidth = (s) => {
    let w = 0;
    for (const ch of s) {
      if (/[\u4e00-\u9fff\u3000-\u303f\uff00-\uffef]/.test(ch)) w += 1;
      else if (ch === ' ') w += 0.3;
      else w += 0.55;
    }
    return w;
  };
  const own = emWidth(c.title);
  const missionT = (own + 4.3) <= 8
    ? '从零开始<br><em>' + c.title + ' 全掌握</em>'
    : (own <= 8 ? '从零开始<br><em>' + c.title + '</em>' : '从零开始<br><em>把整门课读通</em>');
  return `/* =====================================================================
 * site.js · 站点配置（window.CSC_SITE）
 * 所有展示文案集中在这里；换课程只需改本文件与 data/ 下的章节文件。
 * 占位字段（TODO 注释处）由内容编写者补全。
 * ===================================================================== */
window.CSC_SITE = {
  id: '${c.id}',
  short: '${c.short}',
  name: '${c.title}',
  en: '${c.en}',
  dept: '${c.dept}',
  lang: '${c.lang}',
  langLabel: '${c.langLabel}',

  /* 首页启动终端 */
  mode: 'STATIC · 阅读型',
  bootHead: '${c.short} // OBSERVATORY',
  bootLog: [
    '> mounting course partition ... ${c.short}',
    '> loading ${c.chapters} modules ...',
    '> calibrating glossary & quiz bank ...',
    '> all systems nominal. welcome aboard.'
  ],

  /* 首页主视觉文案（TODO：按课程改写） */
  tagline: '把课程读成一张可以走通的地图。',
  missionEn: '${c.short} · ${c.chapters} MODULES',
  missionTitle: '${missionT}',
  lede: '先建立整门课的地图，再逐章推进：概念、例子、对比表、常见错误与自检清单，每章都配有题库与延伸练习。',
  searchPlaceholder: 'QUERY // 搜索本站章节、术语与题目',

  /* 资料库（path 相对 "CUHKSZ course/<课程目录>" 目录，由 tools/check-content.js 校验存在性） */
  resBase: '../../../CUHKSZ course/${c.sourceDir}/',
  resources: {
    note: '',
    groups: []
  },

  /* 关于页的信息行 */
  aboutLines: [
    ['课程', '${c.title}（${c.en}）'],
    ['来源', 'CUHKSZ ${c.sourceDir} 课程资料'],
    ['结构', '${c.chapters} 章正文 · 分章题库 · 模拟卷 · 实战项目 · 资料库'],
    ['建议', '先读第 0 章建立地图，再按顺序推进；每章结尾的自检清单不要跳过。']
  ],

  /* 速查表：tabs 结构 [{ label, blocks:[...] }]；留空则回退内置 Python/C 速查表（仅编程课适用） */
  cheat: []
};
`;
}

/* ---------- data/index.js ---------- */
function buildIndexJs(c) {
  const lines = [];
  lines.push("  { id: 'ch00', num: '00', title: '课程地图', en: 'COURSE MAP', part: 'Part I · 导览', week: 1, minutes: 60, icon: 'compass', labs: 1,");
  lines.push("    blurb: '先建立整门课的地图：这门课回答什么问题、各章之间怎么衔接、怎样使用本站。' },");
  for (let i = 1; i < c.chapters; i++) {
    const part = i <= 2 ? 'Part II · 基础' : (i <= 5 ? 'Part III · 深入' : 'Part IV · 综合');
    lines.push("  { id: 'ch" + pad2(i) + "', num: '" + pad2(i) + "', title: '模块 " + pad2(i) + " · 待定', en: 'MODULE " + pad2(i) + "', part: '" + part + "', week: " + (i + 1) + ", minutes: 90, icon: 'box', labs: 1,");
    lines.push("    blurb: 'TODO：本章一句话说明（它会出现在首页卡片与搜索里）。' }" + (i < c.chapters - 1 ? ',' : ''));
  }
  return `/* =====================================================================
 * index.js · 章节清单（CSC.registerMeta）
 * 每项字段：id / num / title / en / part / week / minutes / icon / labs / blurb
 * icon 可选：compass keyboard sparkle box layers function repeat cpu memory star grid chart zap rocket target code play flask trophy
 * ===================================================================== */
CSC.registerMeta([
${lines.join('\n')}
]);
`;
}

/* ---------- data/chXX.js ---------- */
function buildChapterJs(c, i) {
  const id = 'ch' + pad2(i);
  const title = i === 0 ? '课程地图' : ('模块 ' + pad2(i) + ' · 待定');
  const en = i === 0 ? 'COURSE MAP' : ('MODULE ' + pad2(i));
  const kpId = id + '-1';
  const intro = i === 0
    ? '这一章交代整门课的问题意识、章节地图与使用方法。'
    : 'TODO：本章导语（两三句话说明这章解决什么问题）。';
  return `/* =====================================================================
 * ${id}.js · 第 ${i} 章
 * 结构：CSC.registerChapter({ id, num, title, en, goals, kp, blocks })
 * 块类型：p / h / code / callout(why|warn|note|ai|exam|tip) / keypoint / table / compare /
 *         terms / steps / checklist / quiz / lab / svg / tabs / flow
 * 质量标准以 tools/check-content.js 的验收规则为准；占位内容必须全部重写。
 * ===================================================================== */
CSC.registerChapter({
  id: '${id}',
  num: '${pad2(i)}',
  title: '${title}',
  en: '${en}',
  goals: [
    'TODO：读完这章，读者能做什么（4–6 条，动词开头）'
  ],
  kp: [
    { id: '${kpId}', title: 'TODO：知识点标题' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '为什么先读这一章', html: '${intro}' },
    { t: 'h', lvl: 2, text: 'TODO：小节一', id: '${kpId}' },
    { t: 'p', lead: true, html: 'TODO：正文段落。' },
    { t: 'p', html: 'TODO：正文段落。' },
    { t: 'keypoint', title: '本章要点', items: ['TODO：要点一', 'TODO：要点二'] },
    { t: 'quiz', qid: '${id}-q1' },
    { t: 'checklist', id: '${id}', items: ['TODO：自检项一', 'TODO：自检项二'] }
  ]
});
`;
}

/* ---------- data/quiz.js ---------- */
function buildQuizJs(c) {
  return `/* =====================================================================
 * quiz.js · 分章题库（PACK.items）
 * 每项字段：{ id:'ch01-q1', ch:'ch01', kp:'ch01-1', tier:1, type:'mcq'|'tf'|'fill'|'multi'|'predict',
 *            difficulty:1, tags:['concept'], stem, options:[{text, correct:true?}], explain }
 * predict 类型额外含 code / codeTitle / answer。
 * 目标：每章 6–8 题，全站 ≥ 48 题；每题必须写 explain。
 * ===================================================================== */
(function () {
  var PACK = {
    items: []
  };
  /* 桥接：数据脚本先于 assets/quiz.js 加载，引擎启动时从这里取同一份 pack。 */
  CSC._quizPack = PACK;
  CSC.registerQuizPack(PACK);
})();
`;
}

/* ---------- data/exam.js ---------- */
function buildExamJs(c) {
  return `/* =====================================================================
 * exam.js · 模拟卷（CSC.registerExam）
 * 结构：{ id, title, style, subtitle, date, minutes, totalScore, summary, instructions,
 *         questions:[{ no, points, type, intro, code, codeTitle, parts:[{ label, points, kind,
 *                     prompt, options:[{text,correct}], explain }] }] }
 * 目标：本站至少 1 套 100 分卷；题目编号从 1 开始连续。
 * ===================================================================== */
CSC.registerExam({
  id: '${c.short}-A',
  title: '模拟卷 A',
  style: 'MIDTERM',
  subtitle: 'TODO：一句话说明覆盖范围',
  date: '',
  minutes: 90,
  totalScore: 100,
  summary: 'TODO：卷面结构说明（各题型题量与分值）。',
  instructions: [
    'TODO：考试说明一',
    'TODO：考试说明二'
  ],
  questions: []
});
`;
}

/* ---------- data/projects.js ---------- */
function buildProjectsJs(c) {
  return `/* =====================================================================
 * projects.js · 实战项目（CSC.registerProjects）
 * 结构：{ id, title, en, tagline, level, minutes, chapters, goals, intro,
 *         milestones:[{ n, title, tasks, starter, hints, solution }] }
 * 目标：本站 3 个项目，由易到难，均能落回章节知识点。
 * ===================================================================== */
CSC.registerProjects([]);
`;
}

/* ---------- 使用说明.md ---------- */
function buildReadme(c) {
  return `# ${c.title} · 学习站 · 使用说明

> ${c.title}（${c.en}），按「章节 + 例子 + 自检」组织的一门完整学习站。
> 全站包含：${c.chapters} 章正文、速查表、分章题库、模拟卷、实战项目与本地资料库。
> **纯静态、零安装、可离线**，双击 \`index.html\` 就能用。
>
> 视觉语言：NASA-Punk Observatory（深空天文台界面）——程序化等高线地形、Jura + Roboto Mono 仪表字体、四色色标、四色幕布转场。

---

## 一、怎么打开

**方法 1（最简单）**：双击文件夹里的 \`index.html\`，用 Chrome / Edge / Firefox / Safari 打开即可。

**方法 2（可离线安装）**：在本文件夹里起一个静态服务器：

\`\`\`powershell
python -m http.server 8790
\`\`\`

然后访问 \`http://127.0.0.1:8790\`。用 http 打开后站点会注册 Service Worker，第一次加载完就能断网学习，也可以「安装到桌面」。

> 首页左上角的徽标可以随时点回观测台门户。

---

## 二、里面有什么

| 内容 | 说明 |
| --- | --- |
| **${c.chapters} 章正文** | 每章有学习目标、知识点、例子、对比表、常见错误与自检清单 |
| **速查表** | 一页纸复习：核心概念、公式、套路与常见坑 |
| **分章题库** | 每章 6–8 题：单选、多选、判断、填空、读代码/读材料；答完即判分并给解析 |
| **实战项目** | 3 个由易到难的项目，含目标、里程碑、提示与参考实现 |
| **模拟卷** | 100 分整卷，题型与真实考试对齐 |
| **术语表** | 自动汇总全站术语，按字母索引 + 实时过滤 |
| **课程航线图** | 全部章节画成一张星图，点节点直接进入 |
| **资料库** | 指向本地课程资料（PDF / PPT / 代码等）的索引页，不复制文件 |
| **搜索** | 顶栏实时搜索全站正文；\`⌘K\` / \`Ctrl+K\` 打开命令面板 |

---

## 三、数据与隐私

- 学习记录（读过的章、答过的题、项目进度）只存在浏览器 \`localStorage\`，**不上传任何服务器**。
- 清除浏览器站点数据会同时清除学习记录。
- 资料库里的链接指向本机 \`CUHKSZ course\` 目录中的原始文件；若移动了目录，资料库链接会失效，但正文不受影响。
`;
}

/* ---------- 复制 assets ---------- */
function copyAssets(dst) {
  fs.cpSync(path.join(TPL_DIR, 'assets'), path.join(dst, 'assets'), { recursive: true });
  /* app.js 的 BUILD 必须与 index.html 的 ?v= 同步（check-site 校验） */
  const appPath = path.join(dst, 'assets', 'app.js');
  let app = read(appPath);
  app = app.replace(/var BUILD = '[^']*';/, "var BUILD = '" + BUILD + "';");
  fs.writeFileSync(appPath, app);
}

/* ---------- 生成单站 ---------- */
function genSite(c, seq) {
  const dst = path.join(SITES_DIR, c.dir);
  const existed = fs.existsSync(dst);
  if (existed && !FORCE) return { dir: c.dir, skipped: true };
  fs.rmSync(dst, { recursive: true, force: true });

  copyAssets(dst);
  write(path.join(dst, 'index.html'), buildIndexHtml(c, seq));
  write(path.join(dst, 'manifest.webmanifest'), buildManifest(c));
  write(path.join(dst, 'sw.js'), buildSw(c));
  write(path.join(dst, 'data', 'site.js'), buildSiteJs(c));
  write(path.join(dst, 'data', 'index.js'), buildIndexJs(c));
  for (let i = 0; i < c.chapters; i++) {
    write(path.join(dst, 'data', 'ch' + pad2(i) + '.js'), buildChapterJs(c, i));
  }
  write(path.join(dst, 'data', 'quiz.js'), buildQuizJs(c));
  write(path.join(dst, 'data', 'exam.js'), buildExamJs(c));
  write(path.join(dst, 'data', 'projects.js'), buildProjectsJs(c));
  write(path.join(dst, '使用说明.md'), buildReadme(c));
  return { dir: c.dir, skipped: false, replaced: existed };
}

/* ---------- 主流程 ---------- */
let targets = courses.filter(c => !c.existing);
if (ONLY) {
  const unknown = ONLY.filter(d => !byDir.has(d));
  if (unknown.length) { console.error('未知课程目录：' + unknown.join(', ')); process.exit(2); }
  targets = targets.filter(c => ONLY.includes(c.dir));
  if (!targets.length) { console.error('--only 指定的课程都是已有站点，没有可生成的。'); process.exit(2); }
}

let made = 0, skipped = 0, replaced = 0;
targets.forEach((c, idx) => {
  const seq = courses.findIndex(x => x.dir === c.dir) + 1;
  const r = genSite(c, seq);
  if (r.skipped) { skipped++; console.log('skip   sites/' + c.dir + '（已存在，--force 可覆盖）'); }
  else { made++; if (r.replaced) replaced++; console.log('build  sites/' + c.dir + '  ' + c.title); }
});

console.log('\n完成：新生成 ' + made + ' 站' + (replaced ? '（覆盖 ' + replaced + '）' : '') + '，跳过 ' + skipped + ' 站；构建号 ' + BUILD);
