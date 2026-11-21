/* =====================================================================
 * tools/merge-quiz.js · 把 _build/quiz/*.json 题库片段合并进 data/quiz.js
 * 用法：node 学习中心/tools/merge-quiz.js [--dry]
 * 规则：
 *   1. 读取 data/quiz.js 现有文本，收集已有题 id（防止重复）。
 *   2. 读取 _build/quiz/ 下全部 *.json（数组），校验字段、id 唯一。
 *   3. 在 PACK.items 数组末尾（"  ] };" 之前）插入片段题（JSON → JS 字面量）。
 *   4. 校验合并后仍是合法 JS，并把报告写到 stdout。
 * 只读校验失败会以非零退出码结束；--dry 只报告、不写文件。
 * ===================================================================== */
'use strict';

var fs = require('fs');
var path = require('path');
var vm = require('vm');

var ROOT = path.resolve(__dirname, '..');
var SITE = path.join(ROOT, 'sites', 'java-intro');
var QUIZ = path.join(SITE, 'data', 'quiz.js');
var FRAG_DIR = path.join(ROOT, '_build', 'quiz');
var MARKER = '  ] };';
var ALLOWED_TYPES = ['mcq', 'tf', 'fill', 'multi', 'predict', 'code', 'findbug'];

function fail(msg) { console.error('✗ ' + msg); process.exitCode = 1; }
function ok(msg) { console.log('✓ ' + msg); }

function readFragments() {
  if (!fs.existsSync(FRAG_DIR)) { fail('片段目录不存在：' + FRAG_DIR); return []; }
  var files = fs.readdirSync(FRAG_DIR).filter(function (f) { return /\.json$/.test(f); }).sort();
  var out = [];
  files.forEach(function (f) {
    var p = path.join(FRAG_DIR, f);
    var raw = fs.readFileSync(p, 'utf8');
    var arr;
    try { arr = JSON.parse(raw); } catch (e) { fail(f + ' 不是合法 JSON：' + e.message); return; }
    if (!Array.isArray(arr)) { fail(f + ' 必须是 JSON 数组'); return; }
    arr.forEach(function (it, i) {
      var where = f + '[' + i + ']';
      if (!it || typeof it !== 'object') { fail(where + ' 不是对象'); return; }
      ['id', 'ch', 'kp', 'type', 'stem', 'explain'].forEach(function (k) {
        if (typeof it[k] !== 'string' || !it[k].trim()) fail(where + ' 缺字段 ' + k);
      });
      if (ALLOWED_TYPES.indexOf(it.type) < 0) fail(where + ' type 非法：' + it.type);
      if (it.type === 'mcq' || it.type === 'multi') {
        if (!Array.isArray(it.options) || it.options.length < 2) fail(where + ' options 不足');
        else if (!it.options.some(function (o) { return o && o.correct; })) fail(where + ' 没有正确选项');
      }
      if (it.type === 'tf') { var oc = (it.options||[]).filter(function(o){return o && o.correct === true;}).length; if (typeof it.answer !== 'boolean' && oc !== 1) fail(where + ' tf 需要恰好一个 correct 选项（或布尔 answer）'); }
      if (it.type === 'fill' && !it.answer) fail(where + ' fill 缺 answer');
      if (it.type === 'predict') {
        if (!it.code) fail(where + ' predict 缺 code');
        if (!it.answer) fail(where + ' predict 缺 answer');
      }
      it.__from = f;
      out.push(it);
    });
  });
  return out;
}

function main() {
  var dry = process.argv.indexOf('--dry') >= 0;
  var src = fs.readFileSync(QUIZ, 'utf8');

  /* 现有题 id */
  var existing = {};
  src.replace(/id:\s*'([^']+)'/g, function (m, id) {
    if (/^ch\d\d-[a-z]\d+$/.test(id)) existing[id] = 1;
    return m;
  });
  var existingCount = Object.keys(existing).length;

  var frags = readFragments();
  if (!frags.length) { fail('没有可合并的片段'); return; }

  var seen = {};
  var dupWithExisting = [];
  frags.forEach(function (it) {
    if (seen[it.id]) fail('片段内 id 重复：' + it.id);
    seen[it.id] = 1;
    if (existing[it.id]) dupWithExisting.push(it.id);
  });
  if (dupWithExisting.length) fail('与现有题库 id 冲突：' + dupWithExisting.join(', '));

  var byCh = {};
  frags.forEach(function (it) { byCh[it.ch] = (byCh[it.ch] || 0) + 1; });

  if (dry) {
    console.log('片段文件 ' + fs.readdirSync(FRAG_DIR).filter(function (f) { return /\.json$/.test(f); }).length +
      ' 个，题目 ' + frags.length + ' 道；现有题 ' + existingCount + ' 道。');
    Object.keys(byCh).sort().forEach(function (ch) { console.log('  ' + ch + ': ' + byCh[ch]); });
    console.log('（--dry：未写文件）');
    return;
  }

  var idx = src.lastIndexOf(MARKER);
  if (idx < 0) { fail('找不到插入点：' + MARKER); return; }

  var lines = frags.map(function (it) {
    var copy = {};
    Object.keys(it).forEach(function (k) { if (k !== '__from') copy[k] = it[k]; });
    return '    ' + JSON.stringify(copy);
  });
  var block = '\n    /* ===== 教材对照补题（2026-11-12 合并，来自 _build/quiz/*.json） ===== */\n' +
    lines.join(',\n') + ',\n';
  var out = src.slice(0, idx) + block + src.slice(idx);

  /* 校验合并结果可执行且题目数正确 */
  var sandbox = { CSC: { registerQuizPack: function (p) { sandbox.__pack = p; } }, globalThis: {} };
  sandbox.globalThis = sandbox;
  try { new vm.Script(out, { filename: 'quiz.js' }); } catch (e) { fail('合并后语法错误：' + e.message); return; }
  try {
    vm.runInNewContext(out, sandbox, { filename: 'quiz.js' });
  } catch (e) { fail('合并后执行失败：' + e.message); return; }
  var total = sandbox.__pack && sandbox.__pack.items ? sandbox.__pack.items.length : 0;
  if (total !== existingCount + frags.length) {
    fail('题目数不符：期望 ' + (existingCount + frags.length) + '，实际 ' + total);
    return;
  }

  fs.writeFileSync(QUIZ, out, 'utf8');
  ok('已合并 ' + frags.length + ' 道题（' + Object.keys(byCh).sort().join(', ') + '），题库共 ' + total + ' 题');
  ok('data/quiz.js 覆盖率：' + Object.keys(byCh).map(function (ch) { return ch + '=' + byCh[ch]; }).join(' '));
}

main();
