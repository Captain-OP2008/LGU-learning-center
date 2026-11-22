#!/usr/bin/env node
/* =====================================================================
 * tools/check-hub.js · 门户（观测台）+ 跨站数据 验收脚本（只读）
 * 用法：node tools/check-hub.js
 * 退出码：0 全绿；1 有失败项。
 * ===================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const HUB = path.join(ROOT);
const COURSES = JSON.parse(fs.readFileSync(path.join(ROOT, '_data', 'courses.json'), 'utf8'));
const CORE_SITES = ['java-intro', 'csc1004', 'calculus', 'linear-algebra', 'python-intro', 'c-intro'];
const SITES = {};
for (const dir of CORE_SITES) {
  const c = COURSES.find(x => x.dir === dir);
  SITES[dir] = c ? c.id : dir;
}
/* 所有已经生成 index.html 的站点（新站建完自动纳入体检） */
const ALL_SITES = COURSES
  .filter(c => fs.existsSync(path.join(ROOT, 'sites', c.dir, 'index.html')))
  .map(c => c.dir);
const STAMP = '20261122n3';

const problems = [];
const add = (f, m) => problems.push(`${f} :: ${m}`);
const read = f => { try { return fs.readFileSync(f, 'utf8'); } catch (e) { return ''; } };
const exists = f => fs.existsSync(f);
const rel = f => path.relative(ROOT, f).replace(/\\/g, '/');

/* ---------- 1. 门户文件与引用 ---------- */
function checkHubFiles() {
  const html = read(path.join(HUB, 'index.html'));
  if (!html) { add('index.html', '门户 index.html 缺失'); return; }
  const refs = [...html.matchAll(/(?:src|href)\s*=\s*"([^"]+)"/g)].map(m => m[1]);
  for (const ref of refs) {
    if (!ref || ref[0] === '#' || /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(ref)) continue;
    const clean = ref.split('?')[0].split('#')[0];
    if (!clean) continue;
    if (!exists(path.resolve(HUB, clean))) add('index.html', `引用的文件不存在: ${ref}`);
  }
  const tokens = [...new Set([...html.matchAll(/\?v=([A-Za-z0-9._-]+)/g)].map(m => m[1]))];
  if (tokens.length !== 1) add('index.html', `?v= 不统一: ${tokens.join(', ') || '（无）'}`);
  else if (tokens[0] !== STAMP) add('index.html', `?v=${tokens[0]}，应为 ${STAMP}`);
  for (const need of ['manifest.webmanifest', 'apple-touch-icon']) {
    if (need === 'apple-touch-icon') {
      if (!/apple-touch-icon/.test(html)) add('index.html', '缺少 apple-touch-icon 声明');
    } else if (!html.includes(need) || !exists(path.join(HUB, need))) {
      add('index.html', `缺少 ${need}`);
    }
  }
  if (!/<main[\s>]/.test(html)) add('index.html', '缺少 <main> 地标');
  if (!/skip/i.test(html)) add('index.html', '缺少跳转正文/跳过链接');
  if (/href="#top"/.test(html)) add('index.html', '仍有 href="#top" 死链');
  if (!/hub-index\.js/.test(html)) add('index.html', '未引入 assets/hub-index.js（跨课搜索索引）');
  if (/fetch\(\s*['"][^'"]*hub-index/.test(html)) add('index.html', 'hub-index 不应通过 fetch 加载（file:// 不可用）');
}

/* ---------- 2. 门户 PWA ---------- */
function checkHubPwa() {
  const swPath = path.join(HUB, 'sw.js');
  if (!exists(swPath)) { add('sw.js', '门户缺少 sw.js'); return; }
  const txt = read(swPath);
  if (!txt.includes(STAMP)) add('sw.js', `门户 SW 版本未包含 stamp ${STAMP}`);
  if (!/navigate/.test(txt)) add('sw.js', '门户 SW 缺少 navigate 回退');
  if (!/ignoreSearch/.test(txt)) add('sw.js', '门户 SW 缓存匹配缺少 ignoreSearch');
  const m = txt.match(/(?:var|const)\s+CORE\s*=\s*\[([\s\S]*?)\];/);
  if (!m) add('sw.js', '门户 SW 缺少 CORE 预缓存清单');
  else for (const e of m[1].matchAll(/'([^']+)'/g)) {
    const p = e[1].split('?')[0];
    if (p === './' || p === '.' || /^https?:/.test(p)) continue;
    if (!exists(path.resolve(HUB, p))) add('sw.js', `CORE 文件不存在: ${e[1]}`);
  }
  const mani = path.join(HUB, 'manifest.webmanifest');
  if (exists(mani)) {
    try { JSON.parse(read(mani)); } catch (e) { add('manifest.webmanifest', 'JSON 解析失败: ' + e.message); }
  }
}

/* ---------- 3. hub-index 与实际站点数据一致 ---------- */
function loadHubIndex() {
  const p = path.join(HUB, 'assets', 'hub-index.js');
  if (!exists(p)) { add('assets/hub-index.js', '缺失（请运行 node tools/build-hub-index.js）'); return null; }
  const sandbox = { window: {}, console: { log() {}, warn() {} } };
  sandbox.window = sandbox;
  try { vm.runInNewContext(read(p), sandbox, { filename: 'hub-index.js' }); }
  catch (e) { add('assets/hub-index.js', '执行失败: ' + e.message); return null; }
  const idx = sandbox.HUB_INDEX || (sandbox.window && sandbox.window.HUB_INDEX);
  if (!idx) { add('assets/hub-index.js', '未定义 window.HUB_INDEX'); return null; }
  return idx;
}

function checkHubIndex(idx) {
  if (!idx) return;
  if (!idx.courses || idx.courses.length < 6) add('assets/hub-index.js', `courses 数量异常，实际 ${idx.courses ? idx.courses.length : 0}`);
  let chapters = 0, quiz = 0, exams = 0, projects = 0;
  for (const c of idx.courses || []) {
    const dir = path.join(HUB, 'sites', c.dir || c.id);
    if (!exists(dir)) add('assets/hub-index.js', `课程目录不存在: sites/${c.dir || c.id}`);
    chapters += c.chapters || 0;
    quiz += c.quiz || 0;
    exams += c.exams || 0;
    projects += c.projects || 0;
    if (!Array.isArray(c.meta) || c.meta.length !== c.chapters) {
      add('assets/hub-index.js', `${c.id}: meta 条目数(${c.meta ? c.meta.length : 0}) 与章节数(${c.chapters}) 不一致`);
    }
    if (!c.chapters) add('assets/hub-index.js', `${c.id}: 章节数为 0`);
    if (!c.quiz) add('assets/hub-index.js', `${c.id}: 题量为 0（题库未注册或加载失败）`);
  }
  if (!Array.isArray(idx.search) || idx.search.length === 0) add('assets/hub-index.js', 'search 索引为空');
  const st = idx.stats || {};
  if (st.chapters != null && st.chapters !== chapters) add('assets/hub-index.js', `stats.chapters(${st.chapters}) 与 courses 求和(${chapters}) 不一致`);
  console.log(`   hub-index: courses=${idx.courses.length} chapters=${chapters} quiz=${quiz} exams=${exams} projects=${projects} search=${(idx.search || []).length}`);
}

/* ---------- 4. 站点身份 / 内容完整性 / 禁用残留 ---------- */
function loadSiteData(site) {
  const dir = path.join(HUB, 'sites', site);
  const files = ['data/site.js', 'data/index.js', 'data/quiz.js', 'data/exam.js', 'data/projects.js', 'data/cheatsheet.js'];
  const noop = () => {};
  const fakeEl = () => ({ style: {}, classList: { add: noop, remove: noop, contains: () => false }, setAttribute: noop, appendChild: noop, addEventListener: noop, querySelector: () => null, querySelectorAll: () => [], innerHTML: '', textContent: '' });
  const sandbox = {
    window: {}, console: { log: noop, warn: noop, error: noop },
    document: { createElement: fakeEl, getElementById: () => fakeEl(), querySelector: () => fakeEl(), querySelectorAll: () => [], addEventListener: noop, body: fakeEl(), head: fakeEl() },
    localStorage: { getItem: () => null, setItem: noop, removeItem: noop },
    sessionStorage: { getItem: () => null, setItem: noop, removeItem: noop },
    setTimeout: noop, clearTimeout: noop, setInterval: noop, clearInterval: noop,
    location: { href: '', hash: '', protocol: 'file:', search: '' },
    navigator: { userAgent: '' }
  };
  sandbox.window = sandbox;
  sandbox.CSC = {
    registerMeta(m) { sandbox.__meta = m; },
    registerChapter(c) { (sandbox.__chapters = sandbox.__chapters || []).push(c); },
    registerQuizPack(p) { sandbox.__quizPack = p; },
    registerExam(e) { (sandbox.__exams = sandbox.__exams || []).push(e); },
    registerProjects(p) { sandbox.__projects = p; },
    registerCheat(c) { sandbox.__cheat = c; },
    registerGlossary(g) { sandbox.__glossary = g; }
  };
  for (const f of files) {
    const p = path.join(dir, f);
    if (!exists(p)) continue;
    try { vm.runInNewContext(read(p), sandbox, { filename: site + '/' + f }); }
    catch (e) { add(`sites/${site}/${f}`, '执行失败: ' + e.message); }
  }
  return sandbox;
}

function checkSiteContent(site) {
  const sd = loadSiteData(site);
  const meta = sd.__meta || [];
  const chapters = sd.__chapters || [];
  const quiz = (sd.__quizPack && sd.__quizPack.items) || [];
  const exams = sd.__exams || [];
  const projects = sd.__projects || [];
  if (!meta.length) add(`sites/${site}/data/index.js`, '章节 meta 为空');
  if (meta.length && chapters.length && chapters.length !== meta.length) {
    add(`sites/${site}`, `章节注册数(${chapters.length}) 与 meta(${meta.length}) 不一致`);
  }
  if (!quiz.length) add(`sites/${site}/data/quiz.js`, '题库为空');
  if (!exams.length) add(`sites/${site}/data/exam.js`, '模拟卷为空或未注册');
  if (['python-intro', 'c-intro'].includes(site) && !projects.length) add(`sites/${site}/data/projects.js`, '项目为空或未注册');
  const html = read(path.join(HUB, 'sites', site, 'index.html'));
  if (site !== 'java-intro' && site !== 'csc1004') {
    if (/Java 速查表|public class Gen|CSC1003|JAVA \/\/ OBSERVATORY/.test(html)) add(`sites/${site}/index.html`, '仍为 Java 外壳内容');
    const q = read(path.join(HUB, 'sites', site, 'data/quiz.js'));
    if (/Java 速查表|public class Gen/.test(q)) add(`sites/${site}/data/quiz.js`, '仍为 Java 外壳内容');
  }
  const app = read(path.join(HUB, 'sites', site, 'assets/app.js'));
  if (/Java 速查表|JAVA SUBSET ENGINE|JAVA \/\/ OBSERVATORY/.test(app) && !['java-intro', 'csc1004'].includes(site)) {
    add(`sites/${site}/assets/app.js`, '仍有 Java 残留');
  }
  if (site === 'python-intro' || site === 'c-intro') {
    for (const mod of ['engine.js', 'editor.js', 'labs.js', 'generator.js']) {
      if (exists(path.join(HUB, 'sites', site, 'assets', mod))) add(`sites/${site}/assets/${mod}`, 'Java 运行链路模块未删除');
    }
  }
  console.log(`   ${site.padEnd(15)} chapters=${String(meta.length).padStart(2)} quiz=${String(quiz.length).padStart(3)} exams=${exams.length} projects=${projects.length}`);
  return { meta: meta.length, quiz: quiz.length, exams: exams.length, projects: projects.length };
}

/* ---------- 5. 重复文件统计（共享内核现状） ---------- */
function checkDuplication() {
  const byHash = new Map();
  const walk = dir => {
    for (const name of fs.readdirSync(dir)) {
      if (name === '_backup' || name === 'tools') continue;
      const p = path.join(dir, name);
      const st = fs.statSync(p);
      if (st.isDirectory()) { walk(p); continue; }
      if (st.size < 4096) continue;
      const crypto = require('crypto');
      const h = crypto.createHash('md5').update(fs.readFileSync(p)).digest('hex');
      if (!byHash.has(h)) byHash.set(h, []);
      byHash.get(h).push({ p, size: st.size });
    }
  };
  walk(path.join(HUB, 'sites'));
  let wasted = 0, groups = 0;
  for (const [, files] of byHash) {
    if (files.length < 2) continue;
    groups++;
    wasted += files[0].size * (files.length - 1);
  }
  console.log(`   duplication: ${groups} 组重复（≥4KB），冗余 ${(wasted / 1048576).toFixed(2)} MB`);
  return wasted;
}

/* ---------- 主流程 ---------- */
console.log('== 门户（观测台）==');
checkHubFiles();
checkHubPwa();
const idx = loadHubIndex();
console.log('== hub-index 一致性 ==');
checkHubIndex(idx);
/* 已完成内容的站点：quiz.js 超过 2KB 视为题库已写（骨架仅 0.6KB） */
const DONE_SITES = ALL_SITES.filter(dir => {
  try { return fs.statSync(path.join(ROOT, 'sites', dir, 'data', 'quiz.js')).size > 2000; }
  catch (e) { return false; }
});

console.log('== 站点数据完整性 ==');
console.log(`   已生成 ${ALL_SITES.length}/${COURSES.length} 个站点，其中 ${DONE_SITES.length} 个内容已完成`);
for (const site of DONE_SITES) checkSiteContent(site);
console.log('== 共享内核重复度 ==');
checkDuplication();
console.log('== 单站验收脚本 ==');
const siteCheck = require('./check-site.js');
const sc = siteCheck.runCheck(ALL_SITES);
for (const [site, r] of Object.entries(sc.result)) {
  console.log(`   ${r.bad ? '❌' : '✅'} ${site.padEnd(15)} stamp=${r.stamp || '(无)'} ${r.bad ? `问题 ${r.bad} 项` : '全部通过'}`);
}
for (const p of sc.problems) add(p.split(' :: ')[0], p.split(' :: ').slice(1).join(' :: '));

if (problems.length) {
  console.log('\n—— 失败明细 ——');
  for (const p of problems) console.log('  • ' + p);
  process.exit(1);
}
console.log('\n门户与跨站验收全部通过。');
