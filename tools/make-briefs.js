#!/usr/bin/env node
/* =====================================================================
 * tools/make-briefs.js · 为每个新站生成一份「作业书」_data/briefs/<dir>.md
 * 供委派给 subagent 时直接阅读（读 brief 即可开工，不必再翻多份文档）。
 * 用法：node tools/make-briefs.js [dir1,dir2,…]
 * ===================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const COURSES = JSON.parse(fs.readFileSync(path.join(ROOT, '_data', 'courses.json'), 'utf8'));
const FILES = JSON.parse(fs.readFileSync(path.join(ROOT, '_data', 'course-files.json'), 'utf8'));
const OUT = path.join(ROOT, '_data', 'briefs');
fs.mkdirSync(OUT, { recursive: true });

const only = process.argv[2] ? process.argv[2].split(',').map((s) => s.trim()).filter(Boolean) : null;
const list = COURSES.filter((c) => !c.existing && (!only || only.includes(c.dir)));

function fileInfo(c) {
  const rec = FILES.courses[c.sourceDir];
  if (!rec || !rec.files || !rec.files.length) return { count: 0, sample: [] };
  const files = rec.files.slice().sort((a, b) => (b.kb || 0) - (a.kb || 0));
  return { count: rec.files.length, sample: files.slice(0, 18).map((f) => f.p) };
}

const TPL = [
  '# 作业书 · {{title}}（{{id}} · {{dept}}）',
  '',
  '> 本文件是你这个站点的完整作业书。先读「一、你负责什么」，再按「四、写作要求」逐章写，最后按「六、验收」跑命令。',
  '> 所有路径都相对项目根目录（即本仓库根，Windows 上用正斜杠也能用）。',
  '',
  '## 一、你负责什么',
  '',
  '把一个**已生成骨架**的课程站点填成合格站点：',
  '',
  '- 站点目录：`sites/{{dir}}/`',
  '- 课程：**{{title}}**（{{en}}）',
  '- 原始资料目录：`../CUHKSZ course/{{sourceDir}}/`（相对项目根目录，共 {{fileCount}} 个文件）',
  '- 站点配置：id=`{{id}}`、short=`{{short}}`、dept=`{{dept}}`、lang=`{{lang}}`、langLabel=`{{langLabel}}`、**章数 {{chapters}}**（ch00 + {{chMinus1}} 个主题章）',
  '',
  '### 只允许改这些文件（其它一律不碰）',
  '```',
  'sites/{{dir}}/data/site.js',
  'sites/{{dir}}/data/index.js',
  '{{chapterFiles}}',
  'sites/{{dir}}/data/quiz.js',
  'sites/{{dir}}/data/exam.js',
  'sites/{{dir}}/data/projects.js',
  'sites/{{dir}}/使用说明.md',
  '```',
  '**绝对不要碰**：`index.html`、`assets/*`、`sw.js`、`manifest.webmanifest`（已生成且被 check-site 校验，改了必然报错）；也不要碰 `tools/*`、`_template/*`、`_data/*`、`shared/*`、门户文件、以及**任何其它 `sites/<别的目录>`**。',
  '',
  '## 二、开工前必读',
  '',
  '1. `tools/check-content.js` —— 验收规则（章数 / 块数 / 字数 / 题库 / 资料库路径），写完必须跑通。',
  '2. `sites/csc3001/data/ch00.js` —— 合格章节样板（块序列、篇幅、语气、结尾 callout）。',
  '3. `sites/csc3001/data/site.js` —— site.js 合格样板（cheat 4 页、resources 3 组、aboutLines、boot 文案）。',
  '',
  '另外可参考：`sites/csc3001/data/quiz.js`（题库）、`exam.js`（模拟卷）、`projects.js`（项目）、`index.js`（章节清单）。',
  '',
  '## 三、这门课的内容依据',
  '',
  '教材与讲义就在 `CUHKSZ course/{{sourceDir}}/`，按体量排序的前若干文件：',
  '',
  '{{fileSample}}',
  '',
  '> 写作时以这门课的真实教学内容为准（教材章节、作业题、往年卷风格）。**不要编造不存在的参考文献或伪造页码**；资料库只链接上面真实存在的文件。',
  '',
  '## 四、写作要求（逐条都会被 `tools/check-content.js` 检查）',
  '',
  '### 4.1 章节规划（你设计，ch00 固定）',
  '- **ch00 = 课程地图**：这门课在学什么、{{chMinus1}} 章怎么串、学习路径、考核方式、教材与资料在哪。照 `sites/csc3001/data/ch00.js` 的骨架写。',
  '- **ch01–ch0{{last}} = {{chMinus1}} 个递进主题**：由你按这门课的教材目录设计，覆盖整门课，从基础到综合。每章标题同时写进 `data/index.js` 与 `data/chXX.js`（`registerMeta` 与 `registerChapter` 必须逐字一致）。',
  '- part 划分建议：`Part I · 导览`（ch00）/ `Part II · 基础`（ch01–ch02）/ `Part III · 深入`（ch03–ch05）/ `Part IV · 综合`（ch06–ch0{{last}}）。',
  '- icon 从这些里挑：compass / function / target / layers / grid / repeat / chart / star / box / sparkle / cpu / memory / zap / rocket / code / play / flask / trophy / keyboard。',
  '',
  '### 4.2 每章硬指标（{{chapters}} 章全部满足）',
  '',
  '| 指标 | 要求 |',
  '|---|---|',
  '| 块数 blocks | ≥ 22（建议 30–50） |',
  '| 可见字符 | ≥ 6500（HTML 标签也计入；按 8000–12000 写更稳） |',
  '| goals | 4–6 条 |',
  '| kp 知识点 | 6–12 个，id 为 `chXX-1`…`chXX-K` |',
  '| h 小节 | 6–12 个，id 与 kp id 一一对应，用 `text` 字段 |',
  '| 图/表 | 至少 1 个 `table` 或 `compare` 或 `svg` |',
  '| 内嵌 quiz | 2–5 个 `{t:"quiz",qid:"chXX-qN"}`（qid 必须存在于 quiz.js） |',
  '| checklist | ≥ 8 条（字符串数组），id 为 `chXX` |',
  '| keypoint | 有 `{t:"keypoint",items:[{title,html}]}` |',
  '| 结尾 | 一个 `note` callout，title 含「覆盖范围」或「依据」或「范围」 |',
  '',
  '块序列建议：`callout(why) → p(lead) → h/正文交替（6–8 个小节）→ terms → quiz×2–3 → keypoint → checklist → 延伸阅读 → callout(note,覆盖范围)`',
  '',
  '### 4.3 题库 `data/quiz.js`',
  '- **每章 7 题，共 {{quizTotal}} 题**；每题 `{id:"chXX-qN", ch:"chXX", kp:"chXX-N", tier:1|2|3, type, difficulty:1-3, tags, stem, options|answer, explain}`',
  '- 题型混用：`mcq`（4 选项恰好 1 个 correct:true）、`tf`（两个选项：正确/错误）、`fill`（answer 必填，可加 accept）、`multi`（≥2 个 correct）',
  '- `explain` 必须 ≥10 字，讲清为什么，不能只重复答案',
  '- 每章第 1–3 题的 id 必须正好对应章节正文里的内嵌 quiz（`chXX-q1/q2/q3`）',
  '',
  '### 4.4 模拟卷 `data/exam.js`',
  '- 1 套，id `{{short}}-A`，title「模拟卷 A」，totalScore 100，≥10 题，`minutes` 90–120',
  '- `questions[].no` 从 1 连续；每题 parts 的 points 之和 = 100；part kind ∈ `choice|tf|output|keywords|fill`',
  '- 每题都要 `explain`，像真实期末卷：覆盖全书，难度递进',
  '',
  '### 4.5 项目 `data/projects.js`',
  '- 3 个项目，每个 `{id,title,en,tagline,level,minutes,chapters,goals,intro,milestones:[{n,title,tasks,starter,hints,solution}]}`',
  '- level 取 入门 / 进阶 / 挑战；每个项目 ≥2 个里程碑，每个里程碑都要 tasks（3–5 条）、hints（≥2 条）、solution（具体可执行）',
  '- 项目要贴合这门课（文科类课程可以是文献综述、案例分析、数据整理、演示文稿等，但 starter/solution 仍要具体、可操作）',
  '',
  '### 4.6 `data/site.js`',
  '- 站点文案（name/en/tagline/missionTitle/lede/searchPlaceholder/bootHead/bootLog[4]/aboutLines 4 行 [标签, HTML]）全部改写成本课程口径',
  '- `cheat`：**≥3 页**（每页 `{label, blocks:[...]}`，每页 ≥2 块），例如「核心概念 / 常用公式 / 答题模板 / 易错清单」',
  '- `resources`：**≥3 组**（每组 ≥2 条），path 相对 `CUHKSZ course/`，**每一条都必须是上面资料目录里真实存在的文件**；字段 `{title, path, kind, note}`，kind ∈ pdf/ppt/pptx/doc/docx/txt/md/zip/code/data/img/ipynb/html',
  '',
  '### 4.7 `data/index.js` 与 `使用说明.md`',
  '- index.js：`CSC.registerMeta([{id,num,title,en,part,week,minutes,icon,labs,blurb}])`，num 为 00…0{{last}}，week 1–16 递增，minutes 40–120，blurb 一句话',
  '- 使用说明.md：把标题、课程简介、章数、内容清单改成这门课的（不要留「Python 编程导论」「print」等旧站残留），结构照现有骨架',
  '',
  '## 五、质量红线',
  '',
  '- 不许出现 `TODO` / `待定` / `待补充` / `占位` 之类字样',
  '- 不许出现 Markdown 语法（正文用 HTML：`<code>`、`<b>`、`<em>`、`<ul><li>`）',
  '- 中文写作，术语首次出现给英文；公式用 `<code>` 或行内 Unicode，不要写 LaTeX 源码',
  '- 每章内容要具体：有定义、有例子、有对比、有常见错误，不要空泛套话',
  '',
  '## 六、验收（必须全绿才收工）',
  '',
  '```bash',
  'node tools/check-site.js {{dir}}',
  'node tools/check-content.js {{dir}}',
  '```',
  '',
  '- `check-site` 必须输出「✅ 全部通过」',
  '- `check-content` 必须输出「问题 0 项」（退出码 0）',
  '- 报错逐条修到 0，不要保留「预期报错」',
  '',
  '## 七、交付回报',
  '',
  '完成后回报：各章（字符数 / 块数 / h 数）、题库题数、模拟卷题数与总分、项目数、cheat 页数、resources 组数与条数、两条命令的最终输出。',
  ''
].join('\n');

let made = 0;
for (const c of list) {
  const n = c.chapters || 8;
  const info = fileInfo(c);
  const chapterFiles = Array.from({ length: n }, (_, i) => 'sites/' + c.dir + '/data/ch0' + i + '.js').join('\n');
  const vars = {
    title: c.title,
    en: c.en,
    id: c.id,
    short: c.short,
    dir: c.dir,
    dept: c.dept,
    sourceDir: c.sourceDir,
    lang: c.lang || 'text',
    langLabel: c.langLabel || '通识',
    chapters: String(n),
    chMinus1: String(n - 1),
    last: String(n - 1),
    fileCount: String(info.count),
    fileSample: info.sample.length ? info.sample.map((p) => '- `' + p + '`').join('\n') : '- （该目录资料很少，按课程通用知识写，资料库少而精即可）',
    chapterFiles,
    quizTotal: String(n * 7)
  };
  const md = TPL.replace(/\{\{(\w+)\}\}/g, (_, k) => (vars[k] !== undefined ? String(vars[k]) : '{{' + k + '}}'));
  fs.writeFileSync(path.join(OUT, c.dir + '.md'), md, 'utf8');
  made++;
}
console.log('✅ 生成 ' + made + ' 份作业书 → _data/briefs/');
