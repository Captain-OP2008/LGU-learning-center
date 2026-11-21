#!/usr/bin/env node
/* =====================================================================
 * tools/verify-java-quiz.js · java-intro 题库 × 引擎回归
 *
 * 做什么：
 *   1) 在 Node 沙箱里加载 sites/java-intro/assets/engine.js（CommonJS 导出）
 *      与 sites/java-intro/data/quiz.js（只注册数据，不碰 DOM）；
 *   2) 把每道「可执行」predict 题的代码真跑一遍，输出与题目标注 answer 比对；
 *   3) 把每道 code 题的 solution 按 tests 逐组跑，校验期望输出；
 *   4) 列出 mismatch / 引擎不支持（题目已标注）清单。
 *
 * 用法：
 *   node tools/verify-java-quiz.js            # 摘要 + mismatch 明细
 *   node tools/verify-java-quiz.js --all      # 额外列出全部通过题号
 *   node tools/verify-java-quiz.js --json     # 机器可读结果
 *
 * 退出码：0 = 可执行题 0 mismatch；1 = 有 mismatch 或加载失败。
 * 说明：脚本只读站点文件，不写任何东西。
 * ===================================================================== */
'use strict';

const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SITE = path.join(ROOT, 'sites', 'java-intro');
const argv = process.argv.slice(2);
const SHOW_ALL = argv.indexOf('--all') >= 0;
const JSON_OUT = argv.indexOf('--json') >= 0;

/* ---------- 与 assets/quiz.js 完全一致的归一化 ---------- */
function normLines(s) {
  return String(s == null ? '' : s)
    .replace(/\r\n?/g, '\n')
    .replace(/\u00a0/g, ' ')
    .split('\n')
    .map(function (line) { return line.replace(/[ \t]+$/g, '').replace(/^[ \t]+/g, ''); })
    .filter(function (line) { return line.length > 0; })
    .join('\n');
}

/* ---------- 沙箱加载 ---------- */
function loadEngine() {
  return require(path.join(SITE, 'assets', 'engine.js'));
}
function loadPack() {
  global.CSC = {
    registerQuizPack: function (p) { global.CSC._quizPack = p; },
    _quizPack: null
  };
  require(path.join(SITE, 'data', 'quiz.js'));
  const pack = global.CSC && global.CSC._quizPack;
  if (!pack || !Array.isArray(pack.items)) throw new Error('data/quiz.js 未注册 quiz pack（CSC._quizPack 为空）');
  return pack;
}

/* ---------- 题干里声明的命令行参数（ch01-n4 之类） ----------
 * 优先用题目自带的 args 字段；没有就从 stem 的 `java Q 3 5 8` 反推。
 * 只取纯数字/单 token，避免把用法示例误当参数。 */
function argsOf(q) {
  if (Array.isArray(q.args)) return q.args.map(String);
  const stem = String(q.stem || '');
  const m = stem.match(/`java\s+\w+((?:\s+[^\s`]+)+)`/);
  if (!m) return [];
  return m[1].trim().split(/\s+/).filter(function (t) {
    return /^-?\d+(?:\.\d+)?$/.test(t) || /^[A-Za-z_][\w-]*$/.test(t);
  });
}

/* ---------- 主流程 ---------- */
function main() {
  let api, pack;
  try {
    api = loadEngine();
    pack = loadPack();
  } catch (e) {
    console.error('❌ 加载失败：' + (e && e.stack || e));
    process.exit(1);
  }

  const items = pack.items;
  const predict = items.filter(function (q) { return q.type === 'predict'; });
  const codeQs = items.filter(function (q) { return q.type === 'code' && Array.isArray(q.tests) && q.tests.length; });

  const mismatches = [];
  const unsupported = [];
  const annotated = [];
  const passed = [];
  let executable = 0;

  predict.forEach(function (q) {
    /* 题面已明确标注「站内引擎不支持 / 伪代码」的题，不参与执行比对 */
    if (q.engineNote) { annotated.push({ id: q.id, note: q.engineNote }); return; }
    const args = argsOf(q);
    let res;
    try {
      res = api.run(q.code || '', { stdin: q.stdin || '', args: args, maxSteps: 300000, timeoutMs: 3000 });
    } catch (e) {
      res = { ok: false, error: { message: e && e.message || String(e) } };
    }
    if (!res || !res.ok) {
      /* 引擎跑不动的题（伪代码/未支持的语法）：不是答案错误，但要能解释 */
      unsupported.push({ id: q.id, why: (res && res.error && (res.error.message || res.error.type)) || '运行失败' });
      return;
    }
    executable++;
    const actual = normLines(res.output || '');
    const expected = normLines(q.answer);
    if (actual !== expected) {
      mismatches.push({ id: q.id, expected: expected, actual: actual, args: args, stdin: q.stdin || '' });
    } else {
      passed.push(q.id);
    }
  });

  /* code 题：用 solution 跑 tests（与站内「运行并判分」同一套判定） */
  const codeFails = [];
  let codeChecked = 0;
  codeQs.forEach(function (q) {
    const sol = q.solution || q.reference;
    if (!sol) return;
    codeChecked++;
    q.tests.forEach(function (t, i) {
      let res;
      try {
        res = api.run(sol, { args: t.args || [], stdin: t.stdin || '', maxSteps: 300000, timeoutMs: 3000 });
      } catch (e) {
        res = { ok: false, error: { message: e && e.message || String(e) } };
      }
      const actual = res && res.ok ? normLines(res.output || '') : '';
      const expected = normLines(t.expect || '');
      if (!res || !res.ok || actual !== expected) {
        codeFails.push({
          id: q.id, test: i + 1,
          expected: expected, actual: actual,
          error: (res && res.error && res.error.message) || ''
        });
      }
    });
  });

  if (JSON_OUT) {
    console.log(JSON.stringify({
      total: items.length,
      predict: predict.length,
      executable: executable,
      mismatches: mismatches,
      unsupported: unsupported,
      annotated: annotated,
      codeChecked: codeChecked,
      codeFails: codeFails
    }, null, 2));
  } else {
    console.log('java-intro 题库回归');
    console.log('  题目总数            ' + items.length);
    console.log('  predict 题          ' + predict.length);
    console.log('  可执行 predict      ' + executable);
    console.log('  mismatch            ' + mismatches.length + (mismatches.length ? '  ❌' : '  ✅'));
    console.log('  引擎不支持（跳过）  ' + unsupported.length + (unsupported.length ? '  ⚠ 需在题面加 engineNote 标注' : '  ✅'));
    console.log('  已标注不执行        ' + annotated.length);
    console.log('  code 题（solution） ' + codeChecked + ' 题 / 失败测试 ' + codeFails.length + (codeFails.length ? '  ❌' : '  ✅'));
    if (annotated.length) {
      console.log('\n—— 题面已标注「站内引擎不执行」（可接受）——');
      annotated.forEach(function (u) { console.log('  · ' + u.id + ' :: ' + u.note); });
    }
    if (unsupported.length) {
      console.log('\n—— 引擎不支持（需在题面标注「站内引擎不支持」，或改写为可执行形式）——');
      unsupported.forEach(function (u) { console.log('  · ' + u.id + ' :: ' + u.why); });
    }
    if (mismatches.length) {
      console.log('\n—— predict 答案不符 ——');
      mismatches.forEach(function (m) {
        console.log('  ✗ ' + m.id + (m.args.length ? '  args=[' + m.args.join(',') + ']' : ''));
        console.log('      期望: ' + JSON.stringify(m.expected));
        console.log('      实际: ' + JSON.stringify(m.actual));
      });
    }
    if (codeFails.length) {
      console.log('\n—— code 题 solution × tests 不符 ——');
      codeFails.forEach(function (m) {
        console.log('  ✗ ' + m.id + ' 测试 ' + m.test + (m.error ? '  错误: ' + m.error : ''));
        console.log('      期望: ' + JSON.stringify(m.expected));
        console.log('      实际: ' + JSON.stringify(m.actual));
      });
    }
    if (SHOW_ALL && passed.length) {
      console.log('\n—— 通过 ——\n  ' + passed.join(', '));
    }
  }

  process.exit(mismatches.length || codeFails.length || unsupported.length ? 1 : 0);
}

main();
