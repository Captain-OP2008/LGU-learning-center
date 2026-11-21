/* =====================================================================
 * tools/validate-java-content.js · java-intro 教材扩容后的结构与内容校验
 * 用法：node 学习中心/tools/validate-java-content.js [--lenient]
 * 校验项：
 *   1. data/index.js 注册 26 章，id 连续（ch00…ch25）、每章字段齐全。
 *   2. 每章 data/chXX.js 存在、能执行、注册的 id 与文件名一致；
 *      新章（ch14–ch25）块数 ≥ 20，且 why callout / h / keypoint / checklist 齐备。
 *   3. 块类型白名单；h 块有 id；quiz 块 qid 是字符串。
 *   4. 代码块规则：用教材库（StdIn/StdOut/StdDraw/StdAudio/StdRandom/In/Out）必须 run:false；
 *      run:false 且用教材库的，caption 必须含「教材库」；可运行块禁止明显不支持的语法。
 *   5. 题库片段 _build/quiz/*.json：JSON 合法、字段齐全、kp 存在于该章 kp、id 全局唯一。
 *   6. sw.js CORE 包含全部 26 个 data/chXX.js。
 *   7. 现有章节里残留「14 章 / 四个 Part」的表述（警告）。
 * 退出码：有 error 时 1。
 * ===================================================================== */
'use strict';

var fs = require('fs');
var path = require('path');
var vm = require('vm');

var ROOT = path.resolve(__dirname, '..');
var SITE = path.join(ROOT, 'sites', 'java-intro');
var LENIENT = process.argv.indexOf('--lenient') >= 0;

var errors = [];
var warns = [];
function err(m) { errors.push(m); }
function warn(m) { warns.push(m); }

var BLOCK_TYPES = ['p', 'h', 'code', 'callout', 'keypoint', 'table', 'compare', 'terms',
  'steps', 'checklist', 'quiz', 'lab', 'svg', 'flow', 'term', 'mermaid'];
var STD_LIB_RE = /\b(StdIn|StdOut|StdDraw|StdAudio|StdRandom|StdIn\.|In\.|Out\.)\b/;
var BAD_RUN_SYNTAX = [['->', 'lambda'], ['::', '方法引用'], ['enum ', 'enum'], ['try (', 'try-with-resources'], ['@Override', '注解']];

function loadScript(file, sandbox) {
  var code = fs.readFileSync(file, 'utf8');
  try {
    vm.runInNewContext(code, sandbox, { filename: file, timeout: 5000 });
    return true;
  } catch (e) {
    err(path.basename(file) + ' 执行失败：' + e.message);
    return false;
  }
}

function makeSandbox() {
  var sb = {
    console: console,
    window: { CSC_SITE: { id: 'java' } },
    document: { createElement: function () { return {}; }, querySelector: function () { return null; }, addEventListener: function () {} },
    localStorage: { getItem: function () { return null; }, setItem: function () {}, removeItem: function () {} },
    setTimeout: function () {}, clearTimeout: function () {}, requestAnimationFrame: function () {}
  };
  sb.window.window = sb.window;
  sb.globalThis = sb;
  sb.CSC = {
    meta: null, chapters: {},
    registerMeta: function (m) { sb.CSC.meta = m; },
    registerChapter: function (c) { sb.CSC.chapters[c.id] = c; },
    registerQuizPack: function () {}, registerExam: function () {}, registerProjects: function () {},
    registerCheat: function () {}, registerGlossary: function () {}, registerPitfalls: function () {},
    registerAdvanced: function () {}, registerDeps: function () {}, registerLab: function () {}
  };
  return sb;
}

/* ---------- 1. index.js ---------- */
var metaSb = makeSandbox();
loadScript(path.join(SITE, 'data', 'index.js'), metaSb);
var meta = metaSb.CSC.meta || [];
if (!Array.isArray(meta) || meta.length !== 26) {
  err('data/index.js 注册章数 = ' + (Array.isArray(meta) ? meta.length : 0) + '，期望 26');
}
var PART_RE = /^Part (I|II|III|IV|V|VI|VII|VIII) · /;
var metaById = {};
(Array.isArray(meta) ? meta : []).forEach(function (m, i) {
  var expectId = 'ch' + String(i).padStart(2, '0');
  if (m.id !== expectId) err('data/index.js 第 ' + i + ' 项 id=' + m.id + '，期望 ' + expectId);
  metaById[m.id] = m;
  ['id', 'num', 'title', 'en', 'part', 'icon', 'blurb'].forEach(function (k) {
    if (typeof m[k] !== 'string' || !m[k].trim()) err(m.id + ' 缺字段 ' + k);
  });
  if (m.num !== m.id.slice(2)) err(m.id + ' num 与 id 不一致');
  if (!PART_RE.test(m.part || '')) err(m.id + ' part 不合规：' + m.part);
  if (typeof m.week !== 'number' || m.week < 0) err(m.id + ' week 非法');
  if (typeof m.minutes !== 'number' || m.minutes <= 0) err(m.id + ' minutes 非法');
  if (typeof m.labs !== 'number') err(m.id + ' labs 非法');
  if (!m.blurb || m.blurb.length > 90) warn(m.id + ' blurb 长度异常（' + (m.blurb || '').length + '）');
});

/* ---------- 2/3/4. 各章正文 ---------- */
var kpByCh = {};
var tpl = 0;
meta.forEach(function (m) {
  var file = path.join(SITE, 'data', m.id + '.js');
  if (!fs.existsSync(file)) { err('缺文件 ' + path.relative(ROOT, file)); return; }
  var sb = makeSandbox();
  if (!loadScript(file, sb)) return;
  var ch = sb.CSC.chapters[m.id];
  if (!ch) { err(m.id + '.js 没有注册 id=' + m.id + ' 的章节'); return; }
  if (ch.title !== m.title) warn(m.id + ' 标题与 index.js 不一致：' + ch.title + ' ≠ ' + m.title);
  var blocks = ch.blocks || [];
  tpl += blocks.length;
  if (m.id >= 'ch14' && blocks.length < 20) err(m.id + ' 块数 ' + blocks.length + ' < 20');
  if (!Array.isArray(ch.goals) || ch.goals.length < 2) err(m.id + ' goals 不足');
  if (!Array.isArray(ch.kp) || ch.kp.length < 2) err(m.id + ' kp 不足');
  kpByCh[m.id] = (ch.kp || []).map(function (k) { return typeof k === 'string' ? k : k.id; });

  var hCount = 0, quizCount = 0, codeCount = 0, hasWhy = false, hasKey = false, hasChek = false, hasTable = false, hasSvg = false;
  blocks.forEach(function (b, bi) {
    var at = m.id + '.blocks[' + bi + ']';
    if (!b || typeof b !== 'object') { err(at + ' 不是对象'); return; }
    if (BLOCK_TYPES.indexOf(b.t) < 0) { err(at + ' 未知块类型 ' + b.t); return; }
    if (b.t === 'h') {
      hCount++;
      if (!b.id) warn(at + ' h 块缺 id');
      if (!b.text && !b.html) err(at + ' h 块缺 text');
    }
    if (b.t === 'quiz') {
      quizCount++;
      if (typeof b.qid !== 'string' || !b.qid) err(at + ' quiz 块缺 qid');
    }
    if (b.t === 'keypoint') hasKey = true;
    if (b.t === 'checklist') hasChek = true;
    if (b.t === 'table') hasTable = true;
    if (b.t === 'svg') hasSvg = true;
    if (b.t === 'callout' && (b.kind === 'why' || b.kind === 'why')) hasWhy = true;
    if (b.t === 'code') {
      codeCount++;
      var code = b.code || '';
      var usesStd = STD_LIB_RE.test(code);
      if (usesStd && b.run !== false) err(at + ' 使用教材库但未标注 run:false');
      if (usesStd && b.run !== false === false && String(b.caption || '').indexOf('教材库') < 0 && b.run === false) {
        warn(at + ' run:false 的教材库代码 caption 未写「教材库」');
      }
      if (b.run !== false) {
        BAD_RUN_SYNTAX.forEach(function (pair) {
          if (code.indexOf(pair[0]) >= 0) warn(at + ' 可运行代码疑似含 ' + pair[1] + '（' + pair[0] + '）');
        });
      }
      if (!b.caption) warn(at + ' code 块缺 caption');
    }
  });
  if (m.id >= 'ch14') {
    if (!hasWhy) err(m.id + ' 缺 why callout 开篇');
    if (!hasKey) err(m.id + ' 缺 keypoint');
    if (!hasChek) err(m.id + ' 缺 checklist');
    if (!hasTable && !hasSvg) err(m.id + ' 缺 table/svg');
    if (hCount < 5) warn(m.id + ' h 小节只有 ' + hCount + ' 个');
    if (codeCount < 2) warn(m.id + ' 代码块只有 ' + codeCount + ' 个');
    if (quizCount < 2) warn(m.id + ' 正文内嵌 quiz 只有 ' + quizCount + ' 个');
  }
  if (m.id === 'ch00' || m.id === 'ch13') {
    var flat = JSON.stringify(blocks);
    if (/14\s*章|四个 Part/.test(flat)) warn(m.id + ' 仍残留「14 章 / 四个 Part」表述');
  }
});

/* ---------- 5. 题库片段 ---------- */
var FRAG_DIR = path.join(ROOT, '_build', 'quiz');
var ids = {};
if (fs.existsSync(FRAG_DIR)) {
  fs.readdirSync(FRAG_DIR).filter(function (f) { return /\.json$/.test(f); }).sort().forEach(function (f) {
    var m = /^(ch\d\d)(-add)?\.json$/.exec(f);
    if (!m) { err('片段文件名不合法：' + f); return; }
    var ch = m[1];
    var arr;
    try { arr = JSON.parse(fs.readFileSync(path.join(FRAG_DIR, f), 'utf8')); }
    catch (e) { err(f + ' 不是合法 JSON：' + e.message); return; }
    if (!Array.isArray(arr)) { err(f + ' 必须是数组'); return; }
    if (arr.length < 2) warn(f + ' 题量只有 ' + arr.length);
    arr.forEach(function (it, i) {
      var at = f + '[' + i + ']';
      if (it.ch !== ch) err(at + ' ch=' + it.ch + ' 与文件名不一致');
      if (ids[it.id]) err('题库片段 id 重复：' + it.id);
      ids[it.id] = 1;
      if (kpByCh[ch] && kpByCh[ch].indexOf(it.kp) < 0) err(at + ' kp=' + it.kp + ' 不在 ' + ch + ' 的 kp 列表里');
      if (!it.explain) warn(at + ' 缺 explain');
    });
  });
} else {
  warn('_build/quiz 目录不存在（尚未产出题库片段）');
}
var fragCount = Object.keys(ids).length;

/* ---------- 6. sw.js CORE ---------- */
var sw = fs.readFileSync(path.join(SITE, 'sw.js'), 'utf8');
meta.forEach(function (m) {
  if (sw.indexOf("./data/" + m.id + ".js") < 0) err('sw.js CORE 缺 ./data/' + m.id + '.js（离线不可用）');
});

/* ---------- 汇总 ---------- */
console.log('章节：' + meta.length + ' 章，内容块 ' + tpl + ' 个，题库片段 ' + fragCount + ' 题。');
if (warns.length) {
  console.log('\n警告 ' + warns.length + ' 条：');
  warns.slice(0, 60).forEach(function (w) { console.log('  ! ' + w); });
  if (warns.length > 60) console.log('  … 其余 ' + (warns.length - 60) + ' 条省略');
}
if (errors.length) {
  console.log('\n错误 ' + errors.length + ' 条：');
  errors.slice(0, 80).forEach(function (e) { console.log('  ✗ ' + e); });
  if (errors.length > 80) console.log('  … 其余 ' + (errors.length - 80) + ' 条省略');
  process.exitCode = 1;
} else {
  console.log('\n✓ 结构与内容校验通过' + (LENIENT ? '（lenient）' : ''));
}
