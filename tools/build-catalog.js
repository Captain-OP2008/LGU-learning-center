/* =====================================================================
 * tools/build-catalog.js · 生成「全部课程」目录页的数据文件
 * ---------------------------------------------------------------------
 * 输入：_data/courses.json      —— 66 门课的元数据（dir/id/title/en/dept…）
 *       _data/course-files.json —— 扫描出的原始资料清单（统计每课资料数）
 *       sites/<dir>/index.html —— 是否存在（标记 built 状态，未建的站显示「建设中」）
 * 输出：assets/courses-data.js  —— window.COURSE_CATALOG = { generatedAt, stats, groups }
 * 用法：node tools/build-catalog.js
 * ===================================================================== */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const read = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));

const courses = read('_data/courses.json');
let fileIndex = { courses: {} };
try { fileIndex = read('_data/course-files.json'); } catch (_) { /* 可选 */ }

/** 院系展示顺序与副标题（与 courses.json 的 dept 字段一一对应）。 */
const DEPTS = [
  ['计算机科学', 'COMPUTER SCIENCE', '编程、系统、理论、网络与 AI 基础'],
  ['数学与优化', 'MATHEMATICS & OPTIMIZATION', '微积分、线代、分析、凸优化与预科'],
  ['统计与数据科学', 'STATISTICS & DATA SCIENCE', '概率统计、数据分析、机器学习与深度学习'],
  ['电子与信息工程', 'ELECTRONIC & INFORMATION ENGINEERING', '数字逻辑、游戏设计、信息技术'],
  ['经济与金融', 'ECONOMICS & FINANCE', '微观、宏观、计量、公司金融与财务理论'],
  ['会计与管理', 'ACCOUNTING & MANAGEMENT', '财务会计、管理会计、管理学、营销与供应链'],
  ['物理与化学', 'PHYSICS & CHEMISTRY', '大学物理与普通化学'],
  ['生命科学', 'LIFE SCIENCE', '生物化学与分子基础'],
  ['心理学与社科', 'PSYCHOLOGY & SOCIAL SCIENCE', '普通心理、统计方法、认知与毕生发展'],
  ['人文与语言', 'HUMANITIES & LANGUAGE', '国文、学术英语、科学与工程沟通、翻译'],
  ['通识与国情', 'GENERAL EDUCATION', '思政、中国近现代史、与人文对话、与自然对话'],
  ['体育', 'PHYSICAL EDUCATION', '篮球、游泳、体适能与运动处方']
];

const DEPT_ORDER = DEPTS.map((d) => d[0]);
const deptMeta = {};
DEPTS.forEach(([name, en, blurb]) => { deptMeta[name] = { name, en, blurb }; });

/** 每门课的原始资料数量。 */
function fileCount(c) {
  const bucket = fileIndex.courses && fileIndex.courses[c.sourceDir];
  return bucket && bucket.files ? bucket.files.length : 0;
}

/** 站点是否已生成。 */
function isBuilt(c) {
  return fs.existsSync(path.join(ROOT, 'sites', c.dir, 'index.html'));
}

const groups = [];
const byDept = new Map();
DEPT_ORDER.forEach((d) => byDept.set(d, []));

for (const c of courses) {
  const dept = byDept.has(c.dept) ? c.dept : '通识与国情';
  const entry = {
    dir: c.dir,
    id: c.id,
    short: c.short || String(c.id).toUpperCase(),
    title: c.title,
    en: c.en || '',
    zh: c.zh || '',
    brand: c.brand || '',
    dept,
    sourceDir: c.sourceDir || '',
    chapters: c.chapters || 0,
    lang: c.lang || '',
    files: fileCount(c),
    built: isBuilt(c),
    href: 'sites/' + c.dir + '/index.html'
  };
  byDept.get(dept).push(entry);
}

for (const [name, list] of byDept) {
  if (!list.length) continue;
  list.sort((a, b) => String(a.sourceDir).localeCompare(String(b.sourceDir), 'en') || a.dir.localeCompare(b.dir));
  list.forEach((e, i) => { e.no = String(i + 1).padStart(2, '0'); });
  groups.push({
    dept: name,
    en: deptMeta[name].en,
    blurb: deptMeta[name].blurb,
    courses: list
  });
}

const chapters = courses.reduce((s, c) => s + (c.chapters || 0), 0);
const resources = courses.reduce((s, c) => s + fileCount(c), 0);
const built = courses.filter(isBuilt).length;

const payload = {
  generatedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
  stats: {
    courses: courses.length,
    chapters,
    resources,
    built,
    depts: groups.length
  },
  groups
};

const out = '/* 由 tools/build-catalog.js 生成，请勿手改。重新生成：node tools/build-catalog.js */\n' +
  'window.COURSE_CATALOG = ' + JSON.stringify(payload, null, 1) + ';\n';

fs.writeFileSync(path.join(ROOT, 'assets', 'courses-data.js'), out, 'utf8');

console.log('✅ assets/courses-data.js 已生成');
console.log('   课程 %d 门 · 院系 %d 组 · 章节合计 %d · 原始资料 %d 份 · 已建站 %d',
  payload.stats.courses, payload.stats.depts, chapters, resources, built);
groups.forEach((g) => console.log('   · %s（%d）', g.dept, g.courses.length));
