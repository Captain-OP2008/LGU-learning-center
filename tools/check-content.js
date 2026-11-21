#!/usr/bin/env node
/* =====================================================================
 * check-content.js · 课程站「内容质量」验收（只读，不改文件）
 *
 * 与 check-site.js（工程结构验收）互补：
 *   check-site.js    → 能不能跑：语法、版本号、SW、模块引用
 *   check-content.js → 内容够不够：章数、篇幅、块结构、题库、试卷、项目、资料库
 *
 * 用法：
 *   node tools/check-content.js               # 检查所有新建站（courses.json 里没有 existing 的）
 *   node tools/check-content.js csc3001       # 只查指定站
 *   node tools/check-content.js --all         # 连旧六站一起查（旧站不满足新规会报错，仅供参照）
 *
 * 退出码：0 全绿；1 有失败项。
 * 数据来源：_data/courses.json（课程与章数）、_data/course-files.json（资料库路径真实性）
 * ===================================================================== */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const CONTENT_ROOT = path.resolve(ROOT, '..', 'CUHKSZ course');

const read = p => { try { return fs.readFileSync(p, 'utf8'); } catch (e) { return ''; } };
const COURSES = JSON.parse(read(path.join(ROOT, '_data', 'courses.json')));
const FILES_DB = JSON.parse(read(path.join(ROOT, '_data', 'course-files.json')));

/* 阈值（规格即标准，改这里等于改验收线） */
const RULE = {
  minBlocks: 22,          // 每章块数下限
  minText: 6500,          // 每章正文可见字符数下限（≈ 15KB UTF-8 中文）
  goals: [4, 6],
  kp: [6, 12],
  hCount: [6, 12],
  quizBlocks: [2, 5],
  quizPerChapter: [6, 8],
  checklistItems: 8,
  examQuestions: 10,
  projects: 3,
  projectMilestones: 2,
  resGroups: 1,
  resItemsPerGroup: 2,
  cheatTabs: 3
};

const PROG_LANGS = new Set(['python', 'c', 'java', 'cpp', 'sql']);
const QUIZ_TYPES = new Set(['mcq', 'tf', 'multi', 'fill', 'predict', 'order', 'code']);
const PART_KINDS = new Set(['choice', 'tf', 'output', 'keywords', 'fill']);
const PLACEHOLDER = /待定|待补充|TODO[:：]|TODO\s/;

let problems = [];
const add = (dir, msg) => problems.push(dir + ' :: ' + msg);

/* ---------- 沙箱加载 data/*.js ---------- */
function loadSite(dir, chapterCount) {
  const sd = path.join(ROOT, 'sites', dir);
  const out = { meta: [], chapters: [], quiz: null, exams: [], projects: null, site: null };
  const win = {};
  const CSC = {
    registerMeta: l => { out.meta = l || []; },
    registerChapter: c => { out.chapters.push(c); },
    registerQuizPack: p => { out.quiz = p; },
    registerExam: e => { out.exams.push(e); },
    registerProjects: l => { out.projects = l || []; }
  };
  win.CSC = CSC;
  const sandbox = { window: win, CSC: CSC, console: console };
  vm.createContext(sandbox);
  const files = ['data/site.js', 'data/index.js'];
  for (let i = 0; i < chapterCount; i++) files.push('data/ch' + String(i).padStart(2, '0') + '.js');
  files.push('data/quiz.js', 'data/exam.js', 'data/projects.js');
  for (const f of files) {
    const abs = path.join(sd, f);
    if (!fs.existsSync(abs)) { add(dir, '缺少 ' + f); continue; }
    try { vm.runInContext(read(abs), sandbox, { filename: abs }); }
    catch (e) { add(dir, f + ' 执行失败: ' + String(e.message).split('\n')[0]); }
  }
  out.site = win.CSC_SITE || null;
  return out;
}

/* ---------- 文本量统计（递归取字符串，忽略结构字段） ---------- */
const SKIP_KEYS = new Set(['id', 'qid', 't', 'kind', 'lang', 'icon', 'lvl', 'level', 'run', 'maxW',
  'cols', 'type', 'part', 'week', 'num', 'en', 'ch', 'kp', 'tier', 'difficulty', 'tags',
  'label', 'name', 'path', 'src', 'href', 'hex', 'accent', 'sort', 'id2', 'headers', 'pad']);
function textLen(node) {
  if (typeof node === 'string') return node.length;
  if (Array.isArray(node)) return node.reduce((s, x) => s + textLen(x), 0);
  if (node && typeof node === 'object') {
    let n = 0;
    for (const k of Object.keys(node)) {
      if (SKIP_KEYS.has(k)) continue;
      n += textLen(node[k]);
    }
    return n;
  }
  return 0;
}
function walkBlocks(blocks) {
  const acc = { h: 0, table: 0, svg: 0, code: 0, quiz: [], checklist: [], keypoint: 0, noteTail: null };
  (blocks || []).forEach(b => {
    if (!b || typeof b !== 'object') return;
    if (b.t === 'h') acc.h++;
    if (b.t === 'table' || b.t === 'compare') acc.table++;
    if (b.t === 'svg') acc.svg++;
    if (b.t === 'code') acc.code++;
    if (b.t === 'quiz') acc.quiz.push(b.qid);
    if (b.t === 'checklist') acc.checklist.push(b);
    if (b.t === 'keypoint') acc.keypoint++;
    if (b.t === 'callout' && b.kind === 'note' && /覆盖范围|依据|范围/.test(String(b.title || ''))) acc.noteTail = b;
    if (b.t === 'tabs' && Array.isArray(b.items)) b.items.forEach(it => { const sub = walkBlocks(it.blocks); acc.h += sub.h; acc.table += sub.table; acc.svg += sub.svg; acc.code += sub.code; acc.keypoint += sub.keypoint; });
  });
  return acc;
}

/* ---------- 资料库路径真实性 ---------- */
function fileSetFor(sourceDir) {
  const rec = FILES_DB.courses[sourceDir];
  if (!rec) return null;
  return new Set((rec.files || []).map(f => f.p.replace(/\\/g, '/')));
}
function attrOrEmpty(v) { return typeof v === 'string' ? v : ''; }

/* ---------- 单站检查 ---------- */
function checkOne(course) {
  const dir = course.dir;
  const sd = path.join(ROOT, 'sites', dir);
  if (!fs.existsSync(sd)) { add(dir, '站点目录不存在（先跑 tools/new-site.js）'); return; }
  const d = loadSite(dir, course.chapters);
  const site = d.site;

  /* 1. site.js */
  if (!site) add(dir, 'data/site.js 未定义 window.CSC_SITE');
  else {
    if (site.name !== course.title) add(dir, `site.js name='${attrOrEmpty(site.name)}' 与 courses.json '${course.title}' 不一致`);
    if (!Array.isArray(site.cheat) || site.cheat.length < RULE.cheatTabs) add(dir, `速查表 cheat 需要 ≥${RULE.cheatTabs} 个标签页（当前 ${Array.isArray(site.cheat) ? site.cheat.length : '缺失'}）`);
    else site.cheat.forEach((tab, i) => {
      if (!tab.label || !Array.isArray(tab.blocks) || tab.blocks.length < 2) add(dir, `cheat 第 ${i + 1} 页缺少 label 或 blocks（≥2 块）`);
    });
    if (!/Static/.test(JSON.stringify(site)) && !site.mode) add(dir, 'site.mode 缺失');
    const cheatJson = JSON.stringify(site);
    if (PLACEHOLDER.test(cheatJson.replace(/"TODO[^"]*"/g, ''))) { /* 占位在 cheat 内允许？不允许 */ }
  }

  /* 2. 章节数量 */
  if (d.meta.length !== course.chapters) add(dir, `index.js 章节数 ${d.meta.length} ≠ courses.json ${course.chapters}`);
  if (d.chapters.length !== course.chapters) add(dir, `registerChapter 数量 ${d.chapters.length} ≠ ${course.chapters}`);

  /* 3. 逐章内容 */
  const isProg = PROG_LANGS.has(course.lang);
  const quizItems = (d.quiz && Array.isArray(d.quiz.items)) ? d.quiz.items : [];
  const chapterIds = new Set();
  for (let i = 0; i < course.chapters; i++) {
    const id = 'ch' + String(i).padStart(2, '0');
    chapterIds.add(id);
    const ch = d.chapters[i];
    const tag = id;
    if (!ch) { add(dir, `${tag} 未注册`); continue; }
    if (ch.id !== id) add(dir, `${tag} 注册 id='${ch.id}' 不匹配文件名`);
    if (PLACEHOLDER.test(JSON.stringify(ch))) add(dir, `${tag} 仍有占位文案（待定/待补充/TODO）`);
    const goals = ch.goals || [];
    if (goals.length < RULE.goals[0] || goals.length > RULE.goals[1]) add(dir, `${tag} goals ${goals.length} 条，应为 ${RULE.goals[0]}–${RULE.goals[1]}`);
    const kp = ch.kp || [];
    if (kp.length < RULE.kp[0] || kp.length > RULE.kp[1]) add(dir, `${tag} kp ${kp.length} 个，应为 ${RULE.kp[0]}–${RULE.kp[1]}`);
    kp.forEach(k => {
      if (!/^ch\d\d-\d+$/.test(String(k.id))) add(dir, `${tag} 知识点 id '${k.id}' 应为 chXX-N 形式`);
      if (!k.title || PLACEHOLDER.test(k.title)) add(dir, `${tag} 知识点 ${k.id} 标题缺失或占位`);
    });
    const blocks = ch.blocks || [];
    if (blocks.length < RULE.minBlocks) add(dir, `${tag} 块数 ${blocks.length} < ${RULE.minBlocks}`);
    const len = textLen(blocks);
    if (len < RULE.minText) add(dir, `${tag} 正文约 ${len} 字符 < ${RULE.minText}（篇幅不足）`);
    const a = walkBlocks(blocks);
    if (a.h < RULE.hCount[0] || a.h > RULE.hCount[1]) add(dir, `${tag} 小节 h 块 ${a.h} 个，应为 ${RULE.hCount[0]}–${RULE.hCount[1]}`);
    if (a.table + a.svg < 1) add(dir, `${tag} 缺少 table/compare/svg 之一`);
    if (isProg && a.code < 2) add(dir, `${tag} 编程课需要 ≥2 个 code 块（当前 ${a.code}）`);
    if (a.quiz.length < RULE.quizBlocks[0] || a.quiz.length > RULE.quizBlocks[1]) add(dir, `${tag} 内嵌题 ${a.quiz.length} 道，应为 ${RULE.quizBlocks[0]}–${RULE.quizBlocks[1]}`);
    if (!a.checklist.length) add(dir, `${tag} 缺少 checklist 自检块`);
    else {
      const total = a.checklist.reduce((s, c) => s + ((c.items || []).length), 0);
      if (total < RULE.checklistItems) add(dir, `${tag} 自检项 ${total} 条 < ${RULE.checklistItems}`);
      a.checklist.forEach(c => { if (c.id && c.id !== id) add(dir, `${tag} checklist id='${c.id}' 应为 '${id}'`); });
    }
    if (!a.keypoint) add(dir, `${tag} 缺少 keypoint 要点块`);
    if (!a.noteTail) add(dir, `${tag} 结尾缺少「覆盖范围与依据」类的 note callout`);
    /* h 块 id 检查 */
    blocks.forEach(b => {
      if (b && b.t === 'h' && b.lvl !== 3 && b.id && !/^ch\d\d-\d+$/.test(String(b.id))) add(dir, `${tag} 小节 id '${b.id}' 应为 chXX-N 形式`);
    });
    /* 内嵌题必须存在于题库 */
    a.quiz.forEach(qid => { if (!quizItems.some(q => q.id === qid)) add(dir, `${tag} 内嵌题 ${qid} 在 quiz.js 中不存在`); });
  }

  /* 4. 题库 */
  if (!quizItems.length) add(dir, 'quiz.js 题库为空');
  else {
    const perCh = {};
    quizItems.forEach((q, idx) => {
      const where = `题库第 ${idx + 1} 题（${q.id || '无 id'}）`;
      if (!q.id || !/^ch\d\d-q\d+$/.test(String(q.id))) add(dir, where + ' id 应为 chXX-qN');
      if (!chapterIds.has(q.ch)) add(dir, where + ` ch='${q.ch}' 不存在`);
      else perCh[q.ch] = (perCh[q.ch] || 0) + 1;
      if (!QUIZ_TYPES.has(q.type || 'mcq')) add(dir, where + ` type='${q.type}' 不合法`);
      if (!/^ch\d\d-\d+$/.test(String(q.kp || ''))) add(dir, where + ` kp='${q.kp}' 应为 chXX-N`);
      if (!q.stem || q.stem.length < 6) add(dir, where + ' 题干缺失');
      if (!q.explain || String(q.explain).length < 10) add(dir, where + ' 缺少解析 explain');
      const t = q.type || 'mcq';
      if (t === 'mcq' || t === 'tf') {
        const opts = q.options || [];
        if (opts.length < 2) add(dir, where + ' 选项少于 2 个');
        const correct = opts.filter(o => o.correct).length;
        if (correct !== 1) add(dir, where + ` 正确选项 ${correct} 个，应恰好 1 个`);
      }
      if (t === 'multi') {
        const correct = (q.options || []).filter(o => o.correct).length;
        if (correct < 2) add(dir, where + ` 多选题正确选项 ${correct} 个，应 ≥2`);
      }
      if (t === 'fill' || t === 'predict') {
        if (!q.answer && !(q.accept && q.accept.length)) add(dir, where + ' 填空题缺少 answer/accept');
      }
      if (t === 'predict' && !q.code) add(dir, where + ' 读代码题缺少 code');
    });
    Object.keys(perCh).forEach(ch => {
      const n = perCh[ch];
      if (n < RULE.quizPerChapter[0] || n > RULE.quizPerChapter[1]) add(dir, `${ch} 题库 ${n} 题，应为 ${RULE.quizPerChapter[0]}–${RULE.quizPerChapter[1]}`);
    });
    chapterIds.forEach(id => { if (!perCh[id]) add(dir, `${id} 在题库中没有任何题`); });
    if (quizItems.length < course.chapters * RULE.quizPerChapter[0]) add(dir, `题库总数 ${quizItems.length} < ${course.chapters * RULE.quizPerChapter[0]}`);
  }

  /* 5. 模拟卷 */
  if (!d.exams.length) add(dir, 'exam.js 没有注册任何模拟卷');
  d.exams.forEach((e, ei) => {
    const tag = '模拟卷' + (ei + 1);
    if (!e.id) add(dir, tag + ' 缺少 id');
    if (!Array.isArray(e.questions) || e.questions.length < RULE.examQuestions) add(dir, `${tag} 题量 ${(e.questions || []).length} < ${RULE.examQuestions}`);
    if (Number(e.totalScore) !== 100) add(dir, tag + ` totalScore=${e.totalScore}，应为 100`);
    (e.questions || []).forEach((q, qi) => {
      if (q.no !== qi + 1) add(dir, `${tag} 第 ${qi + 1} 题 no='${q.no}' 应为 ${qi + 1}`);
      if (!Array.isArray(q.parts) || !q.parts.length) add(dir, `${tag} 第 ${qi + 1} 题缺少 parts`);
      (q.parts || []).forEach((p, pi) => {
        if (!PART_KINDS.has(p.kind || 'fill')) add(dir, `${tag} 第 ${qi + 1} 题第 ${pi + 1} 小问 kind='${p.kind}' 不合法`);
        if (!p.prompt) add(dir, `${tag} 第 ${qi + 1} 题第 ${pi + 1} 小问缺少 prompt`);
      });
    });
  });

  /* 6. 项目 */
  const projects = d.projects || [];
  if (projects.length < RULE.projects) add(dir, `项目数 ${projects.length} < ${RULE.projects}`);
  projects.forEach((p, pi) => {
    const tag = '项目' + (pi + 1);
    if (!p.id || !p.title) add(dir, tag + ' 缺少 id/title');
    if (!Array.isArray(p.milestones) || p.milestones.length < RULE.projectMilestones) add(dir, `${tag} 里程碑 ${(p.milestones || []).length} 个 < ${RULE.projectMilestones}`);
    (p.milestones || []).forEach((m, mi) => {
      if (!Array.isArray(m.tasks) || !m.tasks.length) add(dir, `${tag} 里程碑 ${mi + 1} 缺少 tasks`);
    });
  });

  /* 7. 资料库 */
  const groups = (site && site.resources && site.resources.groups) || [];
  if (groups.length < RULE.resGroups) add(dir, '资料库 resources.groups 为空');
  const known = fileSetFor(course.sourceDir);
  /* 原始资料只有一两个文件的课（如 ACT2111、FIN2020），每组 1 条即达标 */
  const perGroupMin = known ? Math.max(1, Math.min(RULE.resItemsPerGroup, known.size)) : RULE.resItemsPerGroup;
  let resCount = 0;
  if (known) {
    groups.forEach(g => {
      const items = g.items || [];
      if (items.length < perGroupMin) add(dir, `资料库分组「${g.name || '未命名'}」条目 ${items.length} < ${perGroupMin}`);
      items.forEach(it => {
        resCount++;
        const p = String(it.path || '').replace(/\\/g, '/');
        if (!p) return add(dir, `资料库条目「${it.title || '?'}」缺少 path`);
        if (!known.has(p)) add(dir, `资料库路径不存在于 ${course.sourceDir}：${p}`);
        if (!it.title) add(dir, `资料库条目缺少 title（${p}）`);
        if (!it.kind) add(dir, `资料库条目缺少 kind（${p}）`);
      });
    });
  } else {
    add(dir, `_data/course-files.json 里没有 ${course.sourceDir} 的扫描结果，无法校验资料库路径`);
  }

  /* 8. 使用说明.md */
  const readme = read(path.join(sd, '使用说明.md'));
  if (!readme) add(dir, '缺少 使用说明.md');
  else {
    if (/Python 编程导论|print 到嵌套/.test(readme)) add(dir, '使用说明.md 残留旧课程文案');
    if (PLACEHOLDER.test(readme)) add(dir, '使用说明.md 仍有占位文案');
  }
}

/* ---------- 主流程 ---------- */
const argv = process.argv.slice(2);
const all = argv.includes('--all');
let targets = COURSES.filter(c => all || !c.existing);
const only = argv.filter(a => !a.startsWith('--'));
if (only.length) {
  const unknown = only.filter(d => !COURSES.some(c => c.dir === d));
  if (unknown.length) { console.error('未知课程目录：' + unknown.join(', ')); process.exit(2); }
  targets = COURSES.filter(c => only.includes(c.dir));
}

console.log('检查 ' + targets.length + ' 个站点（阈值：每章 ≥' + RULE.minBlocks + ' 块 / ≥' + RULE.minText + ' 字符）\n');
targets.forEach(c => {
  const before = problems.length;
  checkOne(c);
  const bad = problems.length - before;
  console.log(`${bad ? '❌' : '✅'} ${c.dir.padEnd(12)} ${c.title.padEnd(16)} ${bad ? '问题 ' + bad + ' 项' : '内容达标'}`);
});

if (problems.length) {
  console.log('\n—— 失败明细 ——');
  problems.forEach(p => console.log('  • ' + p));
  process.exit(1);
}
console.log('\n全部站点内容验收通过。');
