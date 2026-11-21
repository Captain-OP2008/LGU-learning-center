#!/usr/bin/env node
/* =====================================================================
 * tools/bump-version.js · 统一刷新版本号（避免三/四套版本号漂移）
 * 用法：node tools/bump-version.js 20261112p1
 * 作用：
 *   1) 门户 + 六个子站 index.html 里所有 ?v=<token> → ?v=<stamp>
 *   2) 六站 assets/app.js 的 BUILD = '<stamp>'
 *   3) 六站 sw.js 的缓存版本 → '<siteId>-<stamp>'（保持原变量名 CACHE/VERSION）
 * 只改这三处，不碰其他代码。
 * ===================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
// 站点目录 → 站点 id 全部来自课程主数据（66 门）
const COURSES = JSON.parse(fs.readFileSync(path.join(ROOT, '_data', 'courses.json'), 'utf8'));
const SITE_IDS = {};
COURSES.forEach(c => { SITE_IDS[c.dir] = c.id; });

const stamp = process.argv[2];
if (!stamp || !/^[A-Za-z0-9._-]+$/.test(stamp)) {
  console.error('用法: node tools/bump-version.js <stamp>，例如 20261112p1');
  process.exit(2);
}

let total = 0;
function edit(file, fn) {
  if (!fs.existsSync(file)) return;
  const before = fs.readFileSync(file, 'utf8');
  const after = fn(before);
  if (after !== before) {
    fs.writeFileSync(file, after, 'utf8');
    total++;
    console.log('  ✎ ' + path.relative(ROOT, file).replace(/\\/g, '/'));
  }
}

function bumpHtml(txt) {
  // 只替换形如 ?v=xxx 的查询参数，保留其余部分
  return txt.replace(/([?&]v=)[A-Za-z0-9._-]+/g, (m, p1) => p1 + stamp);
}

console.log('build stamp = ' + stamp);

// 门户（含「全部课程」目录页）
edit(path.join(ROOT, 'index.html'), bumpHtml);
edit(path.join(ROOT, 'courses.html'), bumpHtml);

// 子站
for (const [dir, id] of Object.entries(SITE_IDS)) {
  const siteDir = path.join(ROOT, 'sites', dir);
  edit(path.join(siteDir, 'index.html'), bumpHtml);
  edit(path.join(siteDir, 'assets', 'app.js'), txt =>
    txt.replace(/(var\s+BUILD\s*=\s*)'[^']*'/, `$1'${stamp}'`));
  edit(path.join(siteDir, 'sw.js'), txt =>
    txt.replace(/((?:var|const)\s+(?:CACHE|VERSION|CACHE_NAME)\s*=\s*)'[^']*'/, `$1'${id}-${stamp}'`));
}

console.log(total ? `\n已更新 ${total} 个文件。` : '\n没有需要更新的文件。');
