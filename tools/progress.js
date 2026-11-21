#!/usr/bin/env node
/* ===== 进度总览（供调度用） =====
 *   node tools/progress.js            只看未完成的站
 *   node tools/progress.js --all      连已完成的站一起看
 *   node tools/progress.js --detail   附「还缺什么」
 *
 * 判定标准（与 check-content.js 一致，这里只做快速估算，不替代验收）：
 *   章节达标 = data/chXX.js ≥ 4KB；题库 = quiz.js 里 id 数 ≥ 章数×6；
 *   模拟卷 = exam.js ≥ 10 题；项目 = projects.js ≥ 3 个；速查表 = site.js 里 cheat 非空；
 *   资料库 = site.js 里 groups 有内容。
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const COURSES = JSON.parse(fs.readFileSync(path.join(ROOT, '_data', 'courses.json'), 'utf8'));

const argv = process.argv.slice(2);
const SHOW_ALL = argv.includes('--all');
const DETAIL = argv.includes('--detail');

const read = p => { try { return fs.readFileSync(p, 'utf8'); } catch (e) { return ''; } };
const kb = n => (n / 1024).toFixed(0);

function inspect(c) {
  const dir = path.join(ROOT, 'sites', c.dir);
  const data = path.join(dir, 'data');
  const out = { dir: c.dir, title: c.title, chapters: c.chapters, done: [], todo: [], legacy: !!c.existing };

  if (!fs.existsSync(path.join(dir, 'index.html'))) { out.todo.push('站点未生成'); return out; }

  /* 章节 */
  let chOk = 0;
  for (let i = 0; i < c.chapters; i++) {
    const f = path.join(data, 'ch' + String(i).padStart(2, '0') + '.js');
    const size = fs.existsSync(f) ? fs.statSync(f).size : 0;
    if (size >= 4000) chOk++; else out.todo.push('ch' + String(i).padStart(2, '0'));
  }
  out.chOk = chOk;

  /* 六个旗舰站沿用旧结构（题库在 assets/quiz.js、速查表内置在 app.js），不按新标准统计 */
  if (c.existing) {
    out.quizN = 0; out.examN = 0; out.projN = 0;
    out.cheatOk = true; out.resOk = true;
    out.todo = out.todo.filter(t => !/^ch/.test(t));
    return out;
  }

  /* 题库：id 可能是 JS 风格 id: 'chXX-qN'，也可能是 JSON 风格 "id": "chXX-qN" */
  const quiz = read(path.join(data, 'quiz.js'));
  out.quizN = (quiz.match(/["']ch\d{2}-q\d+["']/g) || []).length;
  if (out.quizN < c.chapters * 6) out.todo.push(`题库 ${out.quizN}/${c.chapters * 6}`);

  /* 模拟卷 */
  const exam = read(path.join(data, 'exam.js'));
  out.examN = (exam.match(/no:\s*\d+/g) || []).length;
  if (out.examN < 10) out.todo.push(`卷 ${out.examN} 题`);

  /* 项目 */
  const proj = read(path.join(data, 'projects.js'));
  out.projN = (proj.match(/milestones:\s*\[/g) || []).length;
  if (out.projN < 3) out.todo.push(`项目 ${out.projN}`);

  /* site.js 的 cheat / resources */
  const site = read(path.join(data, 'site.js'));
  out.cheatOk = /cheat:\s*\[(?!\s*\])/.test(site);
  if (!out.cheatOk) out.todo.push('速查表');
  out.resOk = /groups:\s*\[\s*\{/.test(site);
  if (!out.resOk) out.todo.push('资料库');

  return out;
}

const rows = COURSES.map(inspect);
const pending = rows.filter(r => r.chOk < r.chapters || r.todo.length);
const shown = SHOW_ALL ? rows : pending;

console.log('课程总数 ' + rows.length + '，已完成 ' + (rows.length - pending.length) + '，待推进 ' + pending.length);
console.log('');

let lastDept = '';
for (const r of shown) {
  const c = COURSES.find(x => x.dir === r.dir);
  if (c.dept !== lastDept) { console.log('\n【' + c.dept + '】'); lastDept = c.dept; }
  const bar = '█'.repeat(r.chOk) + '░'.repeat(Math.max(0, r.chapters - r.chOk));
  if (r.legacy) {
    console.log('✅ ' + (r.dir + '          ').slice(0, 11) + (r.title + '                ').slice(0, 16) + ' 旗舰站 ' + bar + ' ' + r.chOk + '/' + r.chapters);
    continue;
  }
  const full = !r.todo.length && r.chOk === r.chapters ? '✅' : '  ';
  console.log(
    full + ' ' + (r.dir + '          ').slice(0, 11) +
    (r.title + '                ').slice(0, 16) +
    ' 章 ' + bar + ' ' + r.chOk + '/' + r.chapters +
    ' 题 ' + String(r.quizN).padStart(3) +
    ' 卷 ' + String(r.examN).padStart(2) +
    ' 项 ' + String(r.projN).padStart(2) +
    (DETAIL && r.todo.length ? '  缺: ' + r.todo.join(', ') : '')
  );
}
console.log('');
if (!DETAIL) console.log('（加 --detail 看每站还缺什么；--all 看全部）');
