#!/usr/bin/env node
/* =====================================================================
 * tools/check-site.js · 单站改造验收脚本（只读，不改文件）
 * 用法：
 *   node tools/check-site.js java-intro
 *   node tools/check-site.js            # 依次检查六站
 * 退出码：0 全绿；1 有失败项。
 * 说明：语法检查用 vm.Script 在进程内完成（沙箱可能禁止 spawn 子进程）。
 * ===================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');

/* 站点清单以 _data/courses.json 为唯一来源（旧六站 + 新建站） */
const COURSES = JSON.parse(fs.readFileSync(path.join(ROOT, '_data', 'courses.json'), 'utf8'));
const SITE_IDS = {};
COURSES.forEach(c => { SITE_IDS[c.dir] = c.id; });
/* 'JAVA' 字样在 Java 课站点属正常（app.js 的高亮关键字表也会命中，已在下方剔除） */
const JAVA_SITES = new Set(COURSES.filter(c => /java/i.test(c.lang || '')).map(c => c.dir));

let problems = [];
const add = (f, m) => problems.push(`${f} :: ${m}`);

function walk(dir, out) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    let st;
    try { st = fs.statSync(p); } catch (e) { continue; }
    if (st.isDirectory()) {
      if (name === 'node_modules') continue;
      walk(p, out);
    } else if (/\.js$/.test(name)) out.push(p);
  }
  return out;
}
const read = f => { try { return fs.readFileSync(f, 'utf8'); } catch (e) { return ''; } };
const rel = f => path.relative(ROOT, f).replace(/\\/g, '/');
const exists = f => fs.existsSync(f);

/* ---------- 1. JS 语法 ---------- */
function checkSyntax(siteDir) {
  const files = walk(siteDir, []);
  for (const f of files) {
    try { new vm.Script(read(f), { filename: f }); }
    catch (e) { add(rel(f), '语法检查失败: ' + String(e.message).split('\n').slice(0, 2).join(' ')); }
  }
  return files.length;
}

/* ---------- 2. 进度系统与身份残留 ---------- */
const FORBIDDEN = [
  [/CSC\.progress/, '仍引用 CSC.progress'],
  [/\bmarkChapterRead\b|\bisChapterRead\b|\bunmarkChapterRead\b/, '章节「已读」逻辑残留'],
  [/\brenderProgressRing\b|\blevelProgress\b|\baddXp\b|\brecordXp\b/, '游戏化进度（XP/等级/进度环）残留'],
  [/store\.(?:get|set|del)\(\s*['"]progress['"]/, "'progress' 存储键残留"],
  [/\blastChapter\b/, 'lastChapter 残留'],
  [/\brefreshDone\b|\bupdateDoneBadge\b/, '删除进度模块后遗留的未定义引用（会导致章节页白屏）']
];
const JAVA_RESIDUE = /JAVA\s*\/\/|JAVA SUBSET|JAVA OBSERVATORY|['"]JAVA['"]/;

function checkProgressAndIdentity(siteDir, siteName) {
  const targets = [];
  const assetsDir = path.join(siteDir, 'assets');
  if (exists(assetsDir)) {
    for (const n of fs.readdirSync(assetsDir)) if (/\.js$/.test(n)) targets.push(path.join(assetsDir, n));
  }
  for (const n of ['index.html', 'data/site.js', 'data/index.js', 'sw.js']) {
    const p = path.join(siteDir, n);
    if (exists(p)) targets.push(p);
  }
  // app.js 里的历史高亮器可能自带 JAVA 关键字表：这些属于语言定义，先剔除行再查残留
  for (const f of targets) {
    let txt = read(f);
    if (!JAVA_SITES.has(siteName)) {
      const stripped = txt.replace(/JAVA_KW[\s\S]{0,1200}?\];/g, '').replace(/JAVA_TYPE_SET[\s\S]{0,400}?\};/g, '');
      if (JAVA_RESIDUE.test(stripped)) add(rel(f), '仍有 JAVA 身份残留（数学/Python/C 站不应出现）');
    }
    if (/index\.html$|sw\.js$|data\/(site|index)\.js$/.test(f)) continue;
    for (const [re, msg] of FORBIDDEN) {
      if (re.test(txt)) add(rel(f), msg);
    }
  }
}

/* ---------- 3. 存储命名空间 ---------- */
function checkStorage(siteDir, siteName, expectedId) {
  const app = path.join(siteDir, 'assets', 'app.js');
  if (!exists(app)) { add(rel(app), '缺少 assets/app.js'); return; }
  const txt = read(app);
  if (!/LS\s*=\s*'csc\.'\s*\+\s*[A-Za-z_$][\w$]*/.test(txt)) {
    add(rel(app), "缺少课程命名空间（应形如 var LS = 'csc.' + SITE_ID;）");
  }
  const siteJs = path.join(siteDir, 'data', 'site.js');
  if (!exists(siteJs)) { add(rel(siteJs), '缺少 data/site.js（站点身份）'); return; }
  const site = read(siteJs);
  const m = site.match(/id\s*:\s*'([^']+)'/);
  if (!m || m[1] !== expectedId) add(rel(siteJs), `站点 id 应为 '${expectedId}'，实际为 ${m ? `'${m[1]}'` : '缺失'}`);
  const html = read(path.join(siteDir, 'index.html'));
  const iSite = html.indexOf('data/site.js');
  const iApp = html.indexOf('assets/app.js');
  if (iSite < 0) add(rel(path.join(siteDir, 'index.html')), '未引入 data/site.js');
  else if (iApp < 0) add(rel(path.join(siteDir, 'index.html')), '未引入 assets/app.js');
  else if (iSite > iApp) add(rel(path.join(siteDir, 'index.html')), 'data/site.js 必须在 assets/app.js 之前引入');
}

/* ---------- 4. 版本号一致性 ---------- */
function collectSwVersion(swTxt) {
  const m = swTxt.match(/(?:var|const)\s+(?:CACHE|VERSION|CACHE_NAME)\s*=\s*'([^']+)'/);
  return m ? m[1] : '';
}
function checkVersions(siteDir, siteName) {
  const html = read(path.join(siteDir, 'index.html'));
  const tokens = [...html.matchAll(/\?v=([A-Za-z0-9._-]+)/g)].map(m => m[1]);
  const uniq = [...new Set(tokens)];
  const indexFile = rel(path.join(siteDir, 'index.html'));
  if (uniq.length !== 1) add(indexFile, `?v= 不统一: ${uniq.join(', ') || '（无）'}`);
  const stamp = uniq[0] || '';
  const appTxt = read(path.join(siteDir, 'assets', 'app.js'));
  const m = appTxt.match(/var\s+BUILD\s*=\s*'([^']+)'/);
  if (!m) add(rel(path.join(siteDir, 'assets', 'app.js')), '缺少 BUILD 常量');
  else if (m[1] !== stamp) add(rel(path.join(siteDir, 'assets', 'app.js')), `BUILD='${m[1]}' 与 index ?v=${stamp} 不一致`);
  const swTxt = read(path.join(siteDir, 'sw.js'));
  if (!swTxt) add(rel(path.join(siteDir, 'sw.js')), '缺少 sw.js');
  else {
    const v = collectSwVersion(swTxt);
    if (!v) add(rel(path.join(siteDir, 'sw.js')), '缺少缓存版本常量（CACHE/VERSION）');
    else if (stamp && v.indexOf(stamp) < 0) add(rel(path.join(siteDir, 'sw.js')), `SW 版本 '${v}' 未包含 build stamp '${stamp}'`);
  }
  return stamp;
}

/* ---------- 5. 引用文件存在性 ---------- */
function checkRefs(siteDir) {
  const html = read(path.join(siteDir, 'index.html'));
  const refs = [...html.matchAll(/(?:src|href)\s*=\s*"([^"]+)"/g)].map(m => m[1]);
  for (let ref of refs) {
    if (!ref || ref[0] === '#' || /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(ref)) continue;
    const clean = ref.split('?')[0].split('#')[0];
    if (!clean) continue;
    const abs = path.resolve(siteDir, clean);
    if (!exists(abs)) add(rel(path.join(siteDir, 'index.html')), `引用的文件不存在: ${ref}`);
  }
}

/* ---------- 6. SW CORE 清单 ---------- */
function checkSwCore(siteDir) {
  const swPath = path.join(siteDir, 'sw.js');
  const txt = read(swPath);
  if (!txt) return;
  const m = txt.match(/(?:var|const)\s+CORE\s*=\s*\[([\s\S]*?)\];/);
  if (!m) { add(rel(swPath), '未找到 CORE 预缓存清单'); return; }
  for (const entry of m[1].matchAll(/'([^']+)'/g)) {
    const p = entry[1].split('?')[0];
    if (p === './' || p === '.' || /^https?:/.test(p)) continue;
    const abs = path.resolve(siteDir, p);
    if (!exists(abs)) add(rel(swPath), `CORE 中的文件不存在: ${entry[1]}`);
  }
  if (!/navigate/.test(txt)) add(rel(swPath), '缺少 navigate 请求的离线回退处理');
  if (!/ignoreSearch/.test(txt)) add(rel(swPath), '缓存匹配未使用 ignoreSearch（版本参数会击穿缓存）');
}

/* ---------- 7. MODULE_FILES 引用的模块必须存在 ---------- */
function checkModules(siteDir) {
  const app = read(path.join(siteDir, 'assets', 'app.js'));
  const m = app.match(/var\s+MODULE_FILES\s*=\s*\{([\s\S]*?)\};/);
  if (!m) return;
  for (const e of m[1].matchAll(/:\s*'([^']+\.js)'/g)) {
    const abs = path.resolve(siteDir, e[1]);
    if (!exists(abs)) add(rel(path.join(siteDir, 'assets', 'app.js')), `MODULE_FILES 指向不存在的模块: ${e[1]}`);
  }
}

/* ---------- 主流程 ---------- */
function checkSite(siteName, quiet) {
  const siteDir = path.join(ROOT, 'sites', siteName);
  if (!exists(siteDir)) { add(siteName, '站点目录不存在'); return { bad: 1, stamp: '' }; }
  const before = problems.length;
  const n = checkSyntax(siteDir);
  checkProgressAndIdentity(siteDir, siteName);
  checkStorage(siteDir, siteName, SITE_IDS[siteName]);
  const stamp = checkVersions(siteDir, siteName);
  checkRefs(siteDir);
  checkSwCore(siteDir);
  checkModules(siteDir);
  const bad = problems.length - before;
  if (!quiet) {
    console.log(`${bad ? '❌' : '✅'} ${siteName.padEnd(15)} js=${String(n).padStart(2)} stamp=${stamp || '(无)'} ${bad ? `问题 ${bad} 项` : '全部通过'}`);
  }
  return { bad, stamp, js: n };
}

/* 供其它脚本在进程内调用（避免 spawn）：返回失败明细数组 */
function runCheck(list) {
  problems = [];
  const result = {};
  for (const s of list) {
    if (!SITE_IDS[s]) { problems.push(`${s} :: 未知站点`); continue; }
    result[s] = checkSite(s, true);
  }
  return { problems: problems.slice(), result };
}

module.exports = { checkSite, runCheck, SITE_IDS, ROOT };

if (require.main === module) {
  const arg = process.argv[2];
  const list = arg ? [arg] : Object.keys(SITE_IDS);
  for (const s of list) {
    if (!SITE_IDS[s]) { console.error(`未知站点: ${s}（可选: ${Object.keys(SITE_IDS).join(', ')}）`); process.exit(2); }
    checkSite(s);
  }
  if (problems.length) {
    console.log('\n—— 失败明细 ——');
    for (const p of problems) console.log('  • ' + p);
    process.exit(1);
  }
  console.log('\n全部站点通过验收。');
}
