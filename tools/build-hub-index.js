#!/usr/bin/env node
/* =====================================================================
 * tools/build-hub-index.js · 生成门户跨课索引 assets/hub-index.js
 * 从全部站点（_data/courses.json 里的每一门课）的 data/{site,index,quiz,exam,projects}.js
 * 里读取真实数据，输出 window.HUB_INDEX = { stats, courses:[…], search:[…] }。
 * 门户只读这个文件，不做跨目录 fetch —— file:// 双击也能用。
 * 未生成的站点（sites/<dir>/index.html 不存在）自动跳过并汇总提示。
 * 用法：node tools/build-hub-index.js
 * ===================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');

/** 站点清单来自唯一主数据 _data/courses.json（66 门课）。 */
const CATALOG = JSON.parse(fs.readFileSync(path.join(ROOT, '_data', 'courses.json'), 'utf8'));
const SITES = CATALOG.map((c) => ({
  dir: c.dir,
  id: c.id,
  fallback: c.title,
  dept: c.dept || '',
  sourceDir: c.sourceDir || ''
}));

function read(f) { try { return fs.readFileSync(f, 'utf8'); } catch (e) { return ''; } }

/** 在沙箱里执行数据文件，捕获 CSC.register* 调用 */
function loadData(files) {
  const out = { meta: [], quiz: [], exams: [], projects: [], cheats: [], glossary: [] };
  const api = {
    registerMeta: m => { out.meta = m || []; },
    registerChapter: c => { (out.chapters = out.chapters || []).push(c); },
    registerQuizPack: p => { out.quiz = (p && p.items) || []; },
    registerExam: e => { out.exams.push(e); },
    registerProjects: p => { out.projects = Array.isArray(p) ? p : ((p && p.items) || []); },
    registerCheat: c => { out.cheats.push(c); },
    registerGlossary: g => { out.glossary.push(g); },
    registerPitfalls: p => { out.pitfalls = p; },
    registerAdvanced: a => { out.advanced = a; },
    registerDeps: d => { out.deps = d; }
  };
  for (const f of files) {
    const src = read(f);
    if (!src) continue;
    const sandbox = {
      console, JSON, Date, Math,
      CSC: api,
      window: { CSC: api },
      localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
      document: { createElement: () => ({ style: {} }), addEventListener: () => {} },
      navigator: { userAgent: 'node' }
    };
    sandbox.globalThis = sandbox;
    try {
      vm.runInNewContext(src, sandbox, { filename: f, timeout: 20000 });
    } catch (e) {
      console.warn(`  ⚠ ${path.relative(ROOT, f).replace(/\\/g, '/')}: ${e.message.split('\n')[0]}`);
    }
  }
  return out;
}

const courses = [];
const search = [];
const stats = { courses: 0, chapters: 0, quiz: 0, exams: 0, projects: 0 };
const skipped = [];

for (const s of SITES) {
  const dir = path.join(ROOT, 'sites', s.dir);
  if (!fs.existsSync(path.join(dir, 'index.html'))) { skipped.push(s.dir); continue; }
  const dataDir = path.join(dir, 'data');
  const data = loadData([
    path.join(dataDir, 'site.js'),
    path.join(dataDir, 'index.js'),
    path.join(dataDir, 'quiz.js'),
    path.join(dataDir, 'exam.js'),
    path.join(dataDir, 'projects.js')
  ]);
  let siteCfg = {};
  try {
    const sandbox = { window: {}, CSC: {}, console };
    sandbox.globalThis = sandbox;
    vm.runInNewContext(read(path.join(dataDir, 'site.js')), sandbox, { filename: 'site.js' });
    siteCfg = (sandbox.window && sandbox.window.CSC_SITE) || {};
  } catch (e) { /* 用 fallback */ }

  const meta = data.meta || [];
  const chapterCount = meta.length;
  const quizCount = (data.quiz || []).length;
  const examCount = (data.exams || []).length;
  const projectCount = (data.projects || []).length;

  const course = {
    id: s.id,
    dir: s.dir,
    dept: s.dept,
    sourceDir: s.sourceDir,
    name: siteCfg.name || s.fallback,
    short: siteCfg.short || s.id.toUpperCase(),
    en: siteCfg.en || '',
    tagline: siteCfg.tagline || '',
    langLabel: siteCfg.langLabel || '',
    chapters: chapterCount,
    quiz: quizCount,
    exams: examCount,
    projects: projectCount,
    meta: meta.map(m => ({ id: m.id, num: m.num, title: m.title, en: m.en || '', part: m.part || '', blurb: m.blurb || '', minutes: m.minutes || 0 }))
  };
  courses.push(course);
  stats.courses++;
  stats.chapters += chapterCount;
  stats.quiz += quizCount;
  stats.exams += examCount;
  stats.projects += projectCount;

  for (const m of meta) {
    search.push({
      c: s.id, cn: course.name, h: m.id, n: m.num, t: m.title, e: m.en || '',
      p: m.part || '', b: m.blurb || ''
    });
  }
  for (const ex of (data.exams || [])) {
    search.push({ c: s.id, cn: course.name, h: 'exam', n: '', t: ex.title || '模拟卷', e: ex.style || '', p: '模拟卷', b: ex.subtitle || '' });
  }
}

const payload = {
  generatedAt: new Date().toISOString().slice(0, 10),
  stats,
  courses,
  search
};
const target = path.join(ROOT, 'assets', 'hub-index.js');
const body = '/* 由 tools/build-hub-index.js 生成，请勿手改。' + payload.generatedAt + ' */\n'
  + 'window.HUB_INDEX = ' + JSON.stringify(payload, null, 0) + ';\n';
fs.writeFileSync(target, body, 'utf8');
const kb = (Buffer.byteLength(body) / 1024).toFixed(1);
console.log(`✅ ${path.relative(ROOT, target).replace(/\\/g, '/')}  ${kb} KB`);
console.log(`   课程 ${stats.courses} · 章节 ${stats.chapters} · 题目 ${stats.quiz} · 模拟卷 ${stats.exams} · 项目 ${stats.projects}`);
if (skipped.length) console.log(`   ⚠ 跳过 ${skipped.length} 个尚未生成的站点：${skipped.slice(0, 8).join(', ')}${skipped.length > 8 ? ' …' : ''}`);
for (const c of courses) console.log(`   - ${c.id.padEnd(9)} ${String(c.chapters).padStart(2)} 章 / ${String(c.quiz).padStart(4)} 题 / ${c.exams} 卷`);
