/* ==================================================================
 * tools/scan-course-files.js
 * 扫描本机「CUHKSZ course」目录，输出每门课的资料清单（只列文件名，不读内容）。
 *
 * 用法：node tools/scan-course-files.js
 * 输出：_data/course-files.json
 *   { root, scannedAt, courses: { <dir>: { name, files: [{ p, ext, kb }], byExt: {...} } } }
 *
 * 用途：
 *   1) 确认每个课程目录的实际主题（新站命名依据）；
 *   2) 作为各课程站「资料库」页的资源索引（data/site.js 的 resources 从这里挑）。
 * 只扫描两层（课程/子目录/文件），跳过隐藏文件与 >4MB 之外的深路径目录（避免过慢）。
 * ================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');

const HUB = path.resolve(__dirname, '..');
const SRC = path.resolve(HUB, '..', 'CUHKSZ course');
const OUT_DIR = path.join(HUB, '_data');
const OUT = path.join(OUT_DIR, 'course-files.json');

const EXTS = new Set(['.pdf', '.ppt', '.pptx', '.doc', '.docx', '.txt', '.md', '.zip', '.rar', '.7z',
  '.py', '.java', '.c', '.cpp', '.h', '.js', '.ipynb', '.csv', '.xlsx', '.xls', '.png', '.jpg', '.jpeg',
  '.gif', '.mp4', '.mp3', '.wav', '.tex', '.sav', '.do', '.r', '.sql', '.json', '.epub', '.html']);

function walk(dir, rel, depth, acc) {
  let ents;
  try { ents = fs.readdirSync(dir, { withFileTypes: true }); } catch (e) { return; }
  for (const e of ents) {
    if (e.name.startsWith('.') || e.name === 'node_modules' || e.name === '$RECYCLE.BIN' || e.name === 'System Volume Information') continue;
    const abs = path.join(dir, e.name);
    const relP = rel ? rel + '/' + e.name : e.name;
    if (e.isDirectory()) {
      if (depth < 3) walk(abs, relP, depth + 1, acc);
      else acc.dirs.push(relP);
      continue;
    }
    if (!e.isFile()) continue;
    const ext = path.extname(e.name).toLowerCase();
    if (!EXTS.has(ext)) continue;
    let kb = 0;
    try { kb = Math.round(fs.statSync(abs).size / 1024); } catch (err) { kb = 0; }
    acc.files.push({ p: relP, ext: ext.slice(1), kb });
  }
}

// root 写相对项目根目录的路径（不写本机绝对路径，便于换机与发布）
const result = { root: path.relative(HUB, SRC).split(path.sep).join('/'), scannedAt: new Date().toISOString().slice(0, 10), courses: {} };
const top = fs.readdirSync(SRC, { withFileTypes: true })
  .filter(e => e.isDirectory() && !e.name.startsWith('.'))
  .sort((a, b) => a.name.localeCompare(b.name));

for (const d of top) {
  const acc = { files: [], dirs: [] };
  walk(path.join(SRC, d.name), '', 0, acc);
  acc.files.sort((a, b) => a.p.localeCompare(b.p));
  const byExt = {};
  acc.files.forEach(f => { byExt[f.ext] = (byExt[f.ext] || 0) + 1; });
  result.courses[d.name] = { files: acc.files, dirs: acc.dirs, byExt };
  console.log(d.name.padEnd(14), String(acc.files.length).padStart(4), 'files', JSON.stringify(byExt));
}

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(result, null, 1), 'utf8');
console.log('\nwritten:', OUT, (fs.statSync(OUT).size / 1024 / 1024).toFixed(2) + ' MB');
