#!/usr/bin/env node
/* =====================================================================
 * pack-resources.js · 资料库离线打包 / 还原
 *
 * 背景：各站「资料库」默认用 site.js 的 resBase 指向项目外的
 *       ../../../CUHKSZ course/<课程>/ 目录，因此拷贝走整套站点后链接会失效。
 *       本脚本把「各站资料库真正引用到的文件」复制进项目内 resources/<课程>/，
 *       并把 resBase 切到项目内路径；--revert 可完整还原。
 *
 * 用法（在 学习中心/ 目录下运行）：
 *   node tools/pack-resources.js           打包：复制文件 + 切换 resBase
 *   node tools/pack-resources.js --dry-run 只统计要复制多少文件、多大体积
 *   node tools/pack-resources.js --check   校验已打包的文件是否齐全（不复制）
 *   node tools/pack-resources.js --revert  还原：resBase 切回项目外，并删除 resources/
 * ===================================================================== */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const SITES = path.join(ROOT, 'sites');
const INDEX = path.join(ROOT, '_data', 'course-files.json');
const OUT = path.join(ROOT, 'resources');

const EXT_BASE = "'../../../CUHKSZ course/";   // 项目外资料根（相对 sites/<站>/index.html）
const INT_BASE = "'../../resources/";          // 项目内资料根（学习中心/resources/，比项目外近一层）
const RE_BASE = /resBase:\s*'([^']*)'/;

const argv = process.argv.slice(2);
const has = (f) => argv.includes(f);

/* ---------- 收集计划 ---------- */
function loadSite(dir) {
  const file = path.join(SITES, dir, 'data', 'site.js');
  if (!fs.existsSync(file)) return null;
  const sandbox = { window: {} };
  try {
    vm.runInNewContext(fs.readFileSync(file, 'utf8'), sandbox, { timeout: 5000 });
  } catch (e) {
    return null;
  }
  return sandbox.window.CSC_SITE || null;
}

function siteDirs() {
  return fs.readdirSync(SITES).filter((d) => {
    return fs.existsSync(path.join(SITES, d, 'data', 'site.js'));
  }).sort();
}

/** 课程目录名 = resBase 末尾那段，例如 '../../../CUHKSZ course/CSC3001/' → CSC3001 */
function courseOf(resBase) {
  const m = String(resBase || '').match(/CUHKSZ course\/([^/]+)\/$/);
  if (m) return m[1];
  const m2 = String(resBase || '').match(/resources\/([^/]+)\/$/);
  return m2 ? m2[1] : null;
}

function buildPlan() {
  const plan = new Map(); // 课程目录 → Set(相对路径)
  const noResBase = [];
  const stat = { sites: 0 };
  for (const dir of siteDirs()) {
    const site = loadSite(dir);
    if (!site) continue;
    stat.sites++;
    const groups = (site.resources && site.resources.groups) || [];
    const resBase = (fs.readFileSync(path.join(SITES, dir, 'data', 'site.js'), 'utf8').match(RE_BASE) || [])[1];
    const course = courseOf(resBase);
    if (!course) { if (groups.length) noResBase.push(dir); continue; }
    if (!plan.has(course)) plan.set(course, new Set());
    const set = plan.get(course);
    for (const g of groups) for (const it of g.items || []) {
      const p = String(it.path || '').replace(/\\/g, '/');
      if (p) set.add(p);
    }
  }
  return { plan, noResBase, stat };
}

/* ---------- 复制 / 校验 ---------- */
function sourceRoot() {
  const idx = JSON.parse(fs.readFileSync(INDEX, 'utf8'));
  if (!idx.root) throw new Error('_data/course-files.json 缺少 root 字段');
  // root 可为绝对路径，或相对项目根目录的路径（发布版默认 '../CUHKSZ course'）
  const root = path.isAbsolute(idx.root) ? idx.root : path.resolve(ROOT, idx.root);
  if (!fs.existsSync(root)) {
    throw new Error(
      '找不到资料目录：' + root + '\n' +
      '课程资料有版权、不随仓库分发；请把原始资料放到该目录，或修改 _data/course-files.json 的 root 字段指向你的资料目录。\n' +
      '如果你只是阅读站点，资料库链接不可用属正常，课程正文、题库不受影响（见 README「资料库」一节）。'
    );
  }
  return root;
}

function human(bytes) {
  const u = ['B', 'KB', 'MB', 'GB'];
  let i = 0, n = bytes;
  while (n >= 1024 && i < u.length - 1) { n /= 1024; i++; }
  return n.toFixed(i ? 1 : 0) + u[i];
}

function main() {
  const { plan, noResBase, stat } = buildPlan();
  const srcBase = sourceRoot();

  if (!plan.size) {
    console.log('没有找到带 resBase 的站点，无需处理。');
    return 0;
  }

  /* 汇总要复制的文件 */
  const jobs = [];          // { course, rel, src, dst, size }
  const missing = [];
  for (const [course, set] of [...plan.entries()].sort()) {
    for (const rel of [...set].sort()) {
      const src = path.join(srcBase, course, rel);
      const dst = path.join(OUT, course, rel);
      let size = 0;
      try { size = fs.statSync(src).size; } catch (e) { missing.push(`${course}/${rel}`); }
      jobs.push({ course, rel, src, dst, size });
    }
  }
  const totalBytes = jobs.reduce((s, j) => s + j.size, 0);
  const courses = [...plan.keys()].sort();

  console.log(`站点 ${stat.sites} 个，其中 ${courses.length} 个课程的资料库共引用 ${jobs.length} 个文件，合计 ${human(totalBytes)}。`);
  if (missing.length) {
    console.log(`\n⚠ 源目录缺失 ${missing.length} 个文件：`);
    missing.slice(0, 20).forEach((m) => console.log('  - ' + m));
    if (missing.length > 20) console.log(`  … 另有 ${missing.length - 20} 个`);
  }
  if (noResBase.length) console.log(`（${noResBase.length} 个站有资料库但缺少 resBase：${noResBase.join(', ')}）`);

  /* --dry-run */
  if (has('--dry-run')) {
    for (const c of courses) {
      const list = jobs.filter((j) => j.course === c);
      console.log(`  ${c}: ${list.length} 个文件 / ${human(list.reduce((s, j) => s + j.size, 0))}`);
    }
    console.log('\n（--dry-run：未复制、未改 resBase）');
    return missing.length ? 1 : 0;
  }

  /* --check */
  if (has('--check')) {
    const bad = jobs.filter((j) => {
      try { return fs.statSync(j.dst).size !== j.size; } catch (e) { return true; }
    });
    if (bad.length) {
      console.log(`\n✗ 打包不完整：缺 ${bad.length} 个文件，例如：`);
      bad.slice(0, 10).forEach((j) => console.log('  - ' + j.course + '/' + j.rel));
      console.log('  运行 node tools/pack-resources.js 补全（已存在的文件会跳过）。');
      return 1;
    }
    console.log('\n✓ 打包完整：全部 ' + jobs.length + ' 个文件都在 resources/ 下且体积一致。');
    return 0;
  }

  /* --revert */
  if (has('--revert')) {
    let n = 0;
    for (const dir of siteDirs()) {
      const file = path.join(SITES, dir, 'data', 'site.js');
      const txt = fs.readFileSync(file, 'utf8');
      if (!txt.includes(INT_BASE)) continue;
      fs.writeFileSync(file, txt.split(INT_BASE).join(EXT_BASE));
      n++;
    }
    if (fs.existsSync(OUT)) fs.rmSync(OUT, { recursive: true, force: true });
    console.log(`已还原 ${n} 个站点的 resBase 指向项目外，并删除 resources/。`);
    return 0;
  }

  /* 默认：打包 */
  let copied = 0, skipped = 0, bytes = 0;
  for (let i = 0; i < jobs.length; i++) {
    const j = jobs[i];
    if (!j.size && !fs.existsSync(j.src)) continue;
    try {
      if (fs.existsSync(j.dst) && fs.statSync(j.dst).size === j.size) { skipped++; continue; }
    } catch (e) { /* 继续复制 */ }
    fs.mkdirSync(path.dirname(j.dst), { recursive: true });
    fs.copyFileSync(j.src, j.dst);
    copied++; bytes += j.size;
    if (copied % 100 === 0) console.log(`  已复制 ${copied} 个（${human(bytes)}）…`);
  }
  console.log(`\n文件复制完成：新复制 ${copied} 个（${human(bytes)}），已存在跳过 ${skipped} 个。`);

  /* 切换 resBase */
  let switched = 0;
  for (const dir of siteDirs()) {
    const file = path.join(SITES, dir, 'data', 'site.js');
    const txt = fs.readFileSync(file, 'utf8');
    if (!txt.includes(EXT_BASE)) continue;
    fs.writeFileSync(file, txt.split(EXT_BASE).join(INT_BASE));
    switched++;
  }
  console.log(`resBase 已切到项目内 resources/：${switched} 个站点。`);

  console.log(`\n完成。整个「学习中心」文件夹现在可以整体拷走：站点 + 资料库都在里面。`);
  console.log(`体积：${human(totalBytes)}（原始目录 ${srcBase} 保持不动，可随时 --revert）。`);
  return missing.length ? 1 : 0;
}

process.exit(main());
