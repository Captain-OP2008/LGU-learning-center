/* =====================================================================
 * 计算机科学与 Java 编程导论 · 学习站 · generator.js
 * 职责：参数化题目生成器（window.CSC.generator）。
 *   给定 seed + {type, difficulty}，随机生成一道「读程序写输出」题：
 *   - 数值、变量名、运算符、数组/字符串内容全部由 seed 决定，可复现；
 *   - 标准答案 = 用站内 Java 引擎（CSC.java.run）真实执行生成程序得到的 stdout；
 *     引擎未就绪/失败时回落到与 Java 语义一致的纯 JS 计算（item.fallback=true），
 *     保证 file:// 离线、引擎按需加载慢时生成器仍然可用。
 *   - 干扰答案来自该模板的常见错误（off-by-one / 漏条件 / 边界错），
 *     并保证与正确答案互不相同。
 * 对外 API：window.CSC.generator = {
 *   version, TYPES, types(), build(seed, cfg), buildSet(count, cfg, seedBase)
 * }
 * 纯逻辑模块：不碰 DOM、不写 localStorage、不 fetch，可在 Node 里直接 require 验证。
 * 作者模块：feature-builder
 * ===================================================================== */
(function () {
  'use strict';

  var CSC = (typeof window !== 'undefined' && window.CSC) ? window.CSC : null;

  /* ==================================================================
   * 一、基础工具（seeded 随机 / 组装 / 打分辅助）
   * ================================================================== */

  /** xorshift32：同 seed 必得同一题（题目可复现，便于对账与分享） */
  function makeRng(seed) {
    var s = ((Number(seed) || 0) >>> 0) || 0x9e3779b9;
    return function () {
      s ^= s << 13; s >>>= 0;
      s ^= s >>> 17;
      s ^= s << 5; s >>>= 0;
      return s / 4294967296;
    };
  }

  /** [a,b] 闭区间随机整数 */
  function ri(rnd, a, b) { return a + Math.floor(rnd() * (b - a + 1)); }

  function pick(rnd, list) { return list[Math.floor(rnd() * list.length) % list.length]; }

  function shuffle(rnd, arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(rnd() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  /** 变量名生成器：同一模板内不重名（避免两个语义变量撞名） */
  function nameGen(rnd) {
    var used = {};
    return function (list) {
      var avail = list.filter(function (x) { return !used[x]; });
      var v = avail.length ? avail[Math.floor(rnd() * avail.length) % avail.length] : list[0];
      used[v] = 1;
      return v;
    };
  }

  /** 去掉 stdout 末尾换行/空白（保留内部换行），作为唯一答案字符串 */
  function normOut(v) { return String(v == null ? '' : v).replace(/\s+$/, ''); }

  /**
   * 组装完整程序并给出「行号映射」：
   *   imports（可选）+ 空行 + class + main{ 体 } + 方法声明 + }
   * 模板只按 main/methods 的 0-based 索引描述解析位置，这里换算成真实行号。
   */
  function assemble(def) {
    var lines = [];
    var imports = def.imports || [];
    imports.forEach(function (imp) { lines.push(imp); });
    if (imports.length) lines.push('');
    lines.push('public class Gen {');
    lines.push('    public static void main(String[] args) {');
    var mainFirst = lines.length + 1;            // main 体第一行的 1-based 行号
    (def.main || []).forEach(function (s) { lines.push('        ' + s); });
    lines.push('    }');
    var methodFirst = lines.length + 1;          // 第一个方法声明的行号
    (def.methods || []).forEach(function (s) { lines.push(s); });
    lines.push('}');
    return {
      source: lines.join('\n'),
      lineOf: function (where, i) {
        return (where === 'method' ? methodFirst : mainFirst) + (Number(i) || 0);
      }
    };
  }

  /** 用站内引擎执行生成程序；不可用/失败返回 null（调用方回落 JS 计算） */
  function runEngine(source) {
    var c = CSC;
    if (!c || !c.java || typeof c.java.run !== 'function') return null;
    try {
      var r = c.java.run(source, { snapshots: false, timeoutMs: 1500, maxSteps: 200000 });
      if (r && r.ok) return { ok: true, output: normOut(r.output) };
      return { ok: false, error: r && r.error };
    } catch (e) {
      return { ok: false, error: { message: (e && e.message) || String(e) } };
    }
  }

  /**
   * 凑够 3 个「可信但错误」的干扰项：
   * 先用模板给的常见错误候选，不足时按答案类型（数字/字符串）派生。
   */
  function padDistractors(correct, candidates) {
    var out = [];
    var seen = {};
    var cs = String(correct);
    seen[cs] = 1;
    (candidates || []).forEach(function (c) {
      if (c == null) return;
      var t = String(c);
      if (!t || seen[t]) return;
      seen[t] = 1;
      out.push(t);
    });
    var num = Number(cs);
    var numeric = cs !== '' && isFinite(num) && String(num) === cs;
    var extras = numeric
      ? [num + 1, num - 1, num + 10, num * 2, num + 7]
      : [cs.split('').reverse().join(''), cs + '0', cs.slice(0, Math.max(1, cs.length - 1)), cs.toUpperCase()];
    for (var i = 0; i < extras.length && out.length < 3; i++) {
      var t2 = String(extras[i]);
      if (!t2 || seen[t2]) continue;
      seen[t2] = 1;
      out.push(t2);
    }
    /* 极端兜底：加可见后缀，确保选项文本互不相同 */
    var bumps = ['#', '##', '###'];
    for (var m = 0; out.length < 3 && m < 20; m++) {
      var t3 = cs + bumps[m % 3] + (m >= 3 ? String(m) : '');
      if (seen[t3]) continue;
      seen[t3] = 1;
      out.push(t3);
    }
    return out.slice(0, 3);
  }

  /** 题型元数据（顺序即 UI 下拉顺序） */
  var TYPES = [
    { id: 'loop', label: '循环累加与条件', en: 'LOOP & BRANCH', icon: 'repeat', desc: 'for / while、if、continue 的累积与分支' },
    { id: 'array', label: '数组遍历', en: 'ARRAY SCAN', icon: 'array', desc: '最值、累加、排序后统计' },
    { id: 'string', label: '字符串方法', en: 'STRING API', icon: 'keyboard', desc: 'charAt / substring / 反转' },
    { id: 'method', label: '方法调用与返回值', en: 'METHODS', icon: 'function', desc: '参数、返回值、方法之间调用' },
    { id: 'matrix', label: '二维数组', en: '2D ARRAY', icon: 'grid', desc: '双重循环、对角线、逐行扫描' },
    { id: 'recursion', label: '递归', en: 'RECURSION', icon: 'layers', desc: '阶乘、斐波那契、汉诺塔步数' }
  ];
  var TYPE_IDS = TYPES.map(function (t) { return t.id; });

  function typeMeta(id) {
    for (var i = 0; i < TYPES.length; i++) if (TYPES[i].id === id) return TYPES[i];
    return TYPES[0];
  }

  /* ==================================================================
   * 二、题目模板（6 类 × 3 难度 = 18 个变体）
   * 每个模板返回：{ main, methods?, imports?, notes, expected, candidates, summary }
   *   notes: [{ where:'main'|'method', i:<行索引>, note:'逐行说明' }]
   * ================================================================== */

  var TPL = {};

  /* ---------------- 1) loop：循环累加 + 条件 ---------------- */
  TPL.loop = function (rnd, diff) {
    var N = nameGen(rnd);
    if (diff === 1) {
      var n = N(['n', 'limit', 'count', 'size']);
      var sum = N(['sum', 'total', 'acc', 'running']);
      var nv = ri(rnd, 6, 20);
      var exp = nv * (nv + 1) / 2;
      return {
        main: [
          'int ' + n + ' = ' + nv + ';',
          'int ' + sum + ' = 0;',
          'for (int i = 1; i <= ' + n + '; i++) {',
          '    ' + sum + ' += i;',
          '}',
          'System.out.println(' + sum + ');'
        ],
        notes: [
          { i: 2, note: 'i 从 1 取到 ' + nv + '（含 ' + nv + '），循环体一共执行 ' + nv + ' 次。' },
          { i: 3, note: sum + ' 依次加上 1+2+…+' + nv + '，每轮都改变一次。' },
          { i: 5, note: '输出累加结果 ' + exp + '（' + nv + '×' + (nv + 1) + '÷2）。' }
        ],
        expected: exp,
        candidates: [exp - nv, nv * nv, exp + nv, nv, exp - 1],
        summary: '1 到 ' + nv + ' 的整数和是 ' + exp + '。'
      };
    }
    if (diff === 2) {
      var n2 = N(['n', 'limit', 'count', 'size']);
      var k = N(['k', 'step', 'mod', 'div']);
      var sum2 = N(['sum', 'total', 'acc']);
      var nv2 = ri(rnd, 8, 16);
      var kv = pick(rnd, [3, 4]);
      var total = nv2 * (nv2 + 1) / 2;
      var skip = 0;
      for (var i2 = 1; i2 <= nv2; i2++) if (i2 % kv === 0) skip += i2;
      var exp2 = total - skip;
      return {
        main: [
          'int ' + n2 + ' = ' + nv2 + ';',
          'int ' + k + ' = ' + kv + ';',
          'int ' + sum2 + ' = 0;',
          'for (int i = 1; i <= ' + n2 + '; i++) {',
          '    if (i % ' + k + ' == 0) continue;',
          '    ' + sum2 + ' += i;',
          '}',
          'System.out.println(' + sum2 + ');'
        ],
        notes: [
          { i: 4, note: 'i 是 ' + kv + ' 的倍数时 continue 直接进入下一轮，本轮不累加。' },
          { i: 5, note: '只有 i % ' + kv + ' != 0 的数被加进 ' + sum2 + '。' },
          { i: 7, note: '1..' + nv2 + ' 总和 ' + total + ' 减去 ' + kv + ' 的倍数和 ' + skip + '，输出 ' + exp2 + '。' }
        ],
        expected: exp2,
        candidates: [total, skip, exp2 + kv, exp2 - 1],
        summary: '跳过 ' + kv + ' 的倍数后，余下的数累加为 ' + exp2 + '。'
      };
    }
    var rows = ri(rnd, 3, 5);
    var cols = ri(rnd, 3, 5);
    var sum3 = N(['sum', 'total', 'acc']);
    var all = 0, oddI = 0, evenJ = 0, exp3 = 0;
    for (var a = 1; a <= rows; a++) {
      for (var b = 1; b <= cols; b++) {
        all += a * b;
        if (a % 2 === 1) oddI += a * b;
        if (b % 2 === 0) evenJ += a * b;
        if ((a + b) % 2 === 0) exp3 += a * b;
      }
    }
    return {
      main: [
        'int rows = ' + rows + ';',
        'int cols = ' + cols + ';',
        'int ' + sum3 + ' = 0;',
        'for (int i = 1; i <= rows; i++) {',
        '    for (int j = 1; j <= cols; j++) {',
        '        if ((i + j) % 2 == 0) {',
        '            ' + sum3 + ' += i * j;',
        '        }',
        '    }',
        '}',
        'System.out.println(' + sum3 + ');'
      ],
      notes: [
        { i: 3, note: '外层 i 走 1..' + rows + '，内层 j 走 1..' + cols + '，一共 ' + (rows * cols) + ' 次内层循环。' },
        { i: 5, note: '只有 i+j 为偶数时才累加 i*j（奇偶交错，跳过一半格子）。' },
        { i: 10, note: '输出满足条件的格子权值和 ' + exp3 + '。' }
      ],
      expected: exp3,
      candidates: [all, oddI, evenJ, exp3 + 1],
      summary: 'i+j 为偶数的格子，i×j 之和是 ' + exp3 + '。'
    };
  };

  /* ---------------- 2) array：数组遍历 / 最值 / 累加 ---------------- */
  function makeArray(rnd, len, min, max) {
    var vals = [];
    for (var i = 0; i < len; i++) vals.push(ri(rnd, min, max));
    /* 保证最值有区分度，避免 max == min == sum 等退化 */
    if (Math.max.apply(null, vals) - Math.min.apply(null, vals) < 10) {
      vals[ri(rnd, 0, len - 1)] = max;
      vals[ri(rnd, 0, len - 1)] = min;
    }
    return vals;
  }

  TPL.array = function (rnd, diff) {
    var N = nameGen(rnd);
    var arr = N(['a', 'arr', 'data', 'nums']);
    if (diff === 1) {
      var max = N(['max', 'best', 'largest', 'peak']);
      var vals = makeArray(rnd, 6, 1, 99);
      var mx = Math.max.apply(null, vals);
      var mn = Math.min.apply(null, vals);
      var sm = vals.reduce(function (x, y) { return x + y; }, 0);
      return {
        main: [
          'int[] ' + arr + ' = {' + vals.join(', ') + '};',
          'int ' + max + ' = ' + arr + '[0];',
          'for (int i = 1; i < ' + arr + '.length; i++) {',
          '    if (' + arr + '[i] > ' + max + ') ' + max + ' = ' + arr + '[i];',
          '}',
          'System.out.println(' + max + ');'
        ],
        notes: [
          { i: 0, note: '数组有 ' + vals.length + ' 个元素，下标 0..' + (vals.length - 1) + '。' },
          { i: 1, note: '先把 ' + arr + '[0] = ' + vals[0] + ' 当作当前最大值。' },
          { i: 3, note: 'i 从 1 扫到末尾，遇到更大的就更新 ' + max + '；最后一个更大的值是 ' + mx + '。' },
          { i: 5, note: '输出最大值 ' + mx + '。' }
        ],
        expected: mx,
        candidates: [mn, sm, vals[vals.length - 1], mx + 1],
        summary: '数组最大值是 ' + mx + '。'
      };
    }
    if (diff === 2) {
      var sum = N(['sum', 'total', 'acc']);
      var max2 = N(['max', 'best', 'peak']);
      var vals2 = makeArray(rnd, 6, 1, 20);
      var sm2 = vals2.reduce(function (x, y) { return x + y; }, 0);
      var mx2 = Math.max.apply(null, vals2);
      var mn2 = Math.min.apply(null, vals2);
      return {
        main: [
          'int[] ' + arr + ' = {' + vals2.join(', ') + '};',
          'int ' + sum + ' = 0;',
          'int ' + max2 + ' = 0;',
          'for (int v : ' + arr + ') {',
          '    ' + sum + ' += v;',
          '    if (v > ' + max2 + ') ' + max2 + ' = v;',
          '}',
          'System.out.println("sum=" + ' + sum + ' + " max=" + ' + max2 + ');'
        ],
        notes: [
          { i: 3, note: '增强 for 让 v 依次取数组里的每个元素（没有下标）。' },
          { i: 4, note: '每轮把 v 累加进 ' + sum + '，最终 ' + sm2 + '。' },
          { i: 5, note: '同时用条件更新最大值，最终 ' + mx2 + '。' },
          { i: 7, note: '字符串 + 拼接，输出形如 sum=xx max=yy。' }
        ],
        expected: 'sum=' + sm2 + ' max=' + mx2,
        candidates: ['sum=' + (sm2 - 1) + ' max=' + mx2, 'sum=' + mx2 + ' max=' + sm2, 'sum=' + sm2 + ' max=' + mn2],
        summary: '元素和 ' + sm2 + '，最大值 ' + mx2 + '。'
      };
    }
    var dif = N(['gap', 'diff', 'spread']);
    var vals3 = makeArray(rnd, 6, 1, 40).sort(function (x, y) { return x - y; });
    var gap = 0;
    for (var g = 1; g < vals3.length; g++) if (vals3[g] - vals3[g - 1] > gap) gap = vals3[g] - vals3[g - 1];
    return {
      imports: ['import java.util.Arrays;'],
      main: [
        'int[] ' + arr + ' = {' + vals3.join(', ') + '};',
        'Arrays.sort(' + arr + ');',
        'int ' + dif + ' = 0;',
        'for (int i = 1; i < ' + arr + '.length; i++) {',
        '    if (' + arr + '[i] - ' + arr + '[i - 1] > ' + dif + ') ' + dif + ' = ' + arr + '[i] - ' + arr + '[i - 1];',
        '}',
        'System.out.println(' + dif + ');'
      ],
      notes: [
        { i: 1, note: 'Arrays.sort 把数组原地升序排列：' + vals3.join(', ') + '。' },
        { i: 3, note: 'i 从 1 开始，比较相邻两个元素（' + arr + '[i] 与 ' + arr + '[i-1]）。' },
        { i: 4, note: '只记录更大的间隔，最终最大相邻间隔是 ' + gap + '。' },
        { i: 6, note: '输出 ' + gap + '。' }
      ],
      expected: gap,
      candidates: [vals3[vals3.length - 1] - vals3[0], gap + 1, vals3[vals3.length - 1], gap * 2],
      summary: '排序后最大相邻间隔是 ' + gap + '。'
    };
  };

  /* ---------------- 3) string：charAt / substring / 反转 ---------------- */
  var WORDS = ['programming', 'education', 'observatory', 'variable', 'recursion', 'algorithm',
    'compiler', 'terminal', 'generator', 'compilation', 'iteration', 'methodology'];

  TPL.string = function (rnd, diff) {
    var N = nameGen(rnd);
    var word = pick(rnd, WORDS);
    var s = N(['s', 'word', 'text', 'str']);
    if (diff === 1) {
      var c = N(['count', 'cnt', 'vowels']);
      var exp = 0;
      for (var i = 0; i < word.length; i++) if ('aeiou'.indexOf(word.charAt(i)) >= 0) exp++;
      return {
        main: [
          'String ' + s + ' = "' + word + '";',
          'int ' + c + ' = 0;',
          'for (int i = 0; i < ' + s + '.length(); i++) {',
          '    char ch = ' + s + '.charAt(i);',
          "    if (ch == 'a' || ch == 'e' || ch == 'i' || ch == 'o' || ch == 'u') " + c + '++;',
          '}',
          'System.out.println(' + c + ');'
        ],
        notes: [
          { i: 0, note: '字符串字面量 "' + word + '"，长度 ' + word.length + '（下标 0..' + (word.length - 1) + '）。' },
          { i: 3, note: 'charAt(i) 取出第 i 个字符，存进 char 变量 ch。' },
          { i: 4, note: '只有 a/e/i/o/u 五个小写元音会被计数。' },
          { i: 6, note: '输出元音个数 ' + exp + '。' }
        ],
        expected: exp,
        candidates: [exp + 1, exp - 1, word.length, exp * 2],
        summary: '字符串里有 ' + exp + ' 个元音字母。'
      };
    }
    if (diff === 2) {
      var a = ri(rnd, 0, word.length - 7);
      var len = ri(rnd, 3, 5);
      var b = a + len;
      var idx = ri(rnd, 0, word.length - 1);
      var sub = word.substring(a, b);
      var exp2 = sub + word.charAt(idx);
      return {
        main: [
          'String ' + s + ' = "' + word + '";',
          'String t = ' + s + '.substring(' + a + ', ' + b + ');',
          'System.out.println(t + ' + s + '.charAt(' + idx + '));'
        ],
        notes: [
          { i: 1, note: 'substring(' + a + ', ' + b + ') 取的是 [ ' + a + ', ' + b + ' )：含 ' + a + '，不含 ' + b + '，得到 "' + sub + '"。' },
          { i: 2, note: 'charAt(' + idx + ') 取单个字符 \'' + word.charAt(idx) + '\'，与 t 用 + 拼成字符串。' },
          { i: 2, note: '输出 "' + exp2 + '"（不是数字相加）。' }
        ],
        expected: exp2,
        candidates: [
          word.substring(a, Math.min(word.length, b + 1)) + word.charAt(idx),
          word.substring(a + 1, b) + word.charAt(idx),
          sub,
          sub + word.charAt((idx + 1) % word.length)
        ],
        summary: 'substring 左闭右开，拼接后输出 "' + exp2 + '"。'
      };
    }
    var r = N(['r', 'rev', 'result', 'out']);
    var exp3 = word.split('').reverse().join('');
    return {
      main: [
        'String ' + s + ' = "' + word + '";',
        'String ' + r + ' = "";',
        'for (int i = ' + s + '.length() - 1; i >= 0; i--) {',
        '    ' + r + ' += ' + s + '.charAt(i);',
        '}',
        'System.out.println(' + r + ');'
      ],
      notes: [
        { i: 2, note: 'i 从最后一个下标 ' + (word.length - 1) + ' 递减到 0。' },
        { i: 3, note: '每轮把当前字符追加到 ' + r + ' 末尾，于是顺序被倒过来。' },
        { i: 5, note: '输出 "' + exp3 + '"。' }
      ],
      expected: exp3,
      candidates: [word, word.toUpperCase(), exp3.slice(1), exp3 + word.charAt(0)],
      summary: '倒序输出 "' + exp3 + '"。'
    };
  };

  /* ---------------- 4) method：方法调用与返回值 ---------------- */
  TPL.method = function (rnd, diff) {
    var N = nameGen(rnd);
    if (diff === 1) {
      var a = ri(rnd, 2, 5);
      var b = ri(rnd, 1, 6);
      var f = N(['f', 'calc', 'transform', 'apply']);
      var p1 = a * 3 + b, p2 = a * 5 + b;
      var exp = p1 + p2;
      return {
        main: [
          'int r1 = ' + f + '(3);',
          'int r2 = ' + f + '(5);',
          'System.out.println(r1 + r2);'
        ],
        methods: [
          '    static int ' + f + '(int x) {',
          '        return ' + a + ' * x + ' + b + ';',
          '    }'
        ],
        notes: [
          { where: 'method', i: 1, note: '方法体返回 ' + a + '*x+' + b + '：传 x=3 得 ' + p1 + '，传 x=5 得 ' + p2 + '。' },
          { i: 0, note: '调用 ' + f + '(3)，返回值赋给 r1（' + p1 + '）。' },
          { i: 1, note: '调用 ' + f + '(5)，返回值赋给 r2（' + p2 + '）。' },
          { i: 2, note: '两个返回值相加，输出 ' + exp + '。' }
        ],
        expected: exp,
        candidates: [p1, a * 8 + b, exp - b, a * 3 + b + a * 5],
        summary: '两次方法调用返回 ' + p1 + ' 和 ' + p2 + '，相加得 ' + exp + '。'
      };
    }
    if (diff === 2) {
      var arr = N(['a', 'arr', 'data']);
      var c = N(['c', 'cnt', 'hits']);
      var kp = N(['k', 'threshold', 'cut']);
      var vals = makeArray(rnd, 6, 1, 20);
      var k1 = ri(rnd, 4, 8);
      var k2 = k1 + ri(rnd, 3, 6);
      function above(k) { var n = 0; for (var i = 0; i < vals.length; i++) if (vals[i] > k) n++; return n; }
      var e1 = above(k1), e2 = above(k2);
      return {
        main: [
          'int[] ' + arr + ' = {' + vals.join(', ') + '};',
          'System.out.println(countAbove(' + arr + ', ' + k1 + ') + countAbove(' + arr + ', ' + k2 + '));'
        ],
        methods: [
          '    static int countAbove(int[] ' + arr + ', int ' + kp + ') {',
          '        int ' + c + ' = 0;',
          '        for (int i = 0; i < ' + arr + '.length; i++) {',
          '            if (' + arr + '[i] > ' + kp + ') ' + c + '++;',
          '        }',
          '        return ' + c + ';',
          '    }'
        ],
        notes: [
          { where: 'method', i: 3, note: '严格大于 ' + kp + ' 才计数（等于不算）。' },
          { where: 'method', i: 5, note: '返回计数：' + arr + ' 中 >' + k1 + ' 的有 ' + e1 + ' 个，>' + k2 + ' 的有 ' + e2 + ' 个。' },
          { i: 1, note: '两次调用结果相加：' + e1 + ' + ' + e2 + ' = ' + (e1 + e2) + '。' }
        ],
        expected: e1 + e2,
        candidates: [e1, e2, e1 + e2 - 1, e1 + e2 + 1],
        summary: '大于 ' + k1 + ' 的 ' + e1 + ' 个，大于 ' + k2 + ' 的 ' + e2 + ' 个，合计 ' + (e1 + e2) + '。'
      };
    }
    var n = N(['n', 'limit', 'size']);
    var s = N(['s', 'acc', 'total']);
    var nv = ri(rnd, 4, 8);
    var exp3 = 0;
    for (var q = 1; q <= nv; q++) exp3 += q * q;
    return {
      main: ['System.out.println(calc(' + nv + '));'],
      methods: [
        '    static int square(int x) {',
        '        return x * x;',
        '    }',
        '    static int calc(int ' + n + ') {',
        '        int ' + s + ' = 0;',
        '        for (int i = 1; i <= ' + n + '; i++) {',
        '            ' + s + ' += square(i);',
        '        }',
        '        return ' + s + ';',
        '    }'
      ],
      notes: [
        { where: 'method', i: 6, note: '每次循环调用 square(i)，把 i² 累加进 ' + s + '。' },
        { where: 'method', i: 8, note: '循环结束返回平方和：1+4+…+' + nv + '² = ' + exp3 + '。' },
        { i: 0, note: 'main 只做一次调用，输出 ' + exp3 + '。' }
      ],
      expected: exp3,
      candidates: [nv * nv, nv * (nv + 1) / 2, exp3 - nv * nv, exp3 + 1],
      summary: '1² 到 ' + nv + '² 的平方和是 ' + exp3 + '。'
    };
  };

  /* ---------------- 5) matrix：二维数组 ---------------- */
  function makeMatrix(rnd, rows, cols, min, max) {
    var m = [];
    for (var i = 0; i < rows; i++) {
      var row = [];
      for (var j = 0; j < cols; j++) row.push(ri(rnd, min, max));
      m.push(row);
    }
    return m;
  }

  function matrixLiteral(m) {
    return '{' + m.map(function (r) { return '{' + r.join(', ') + '}'; }).join(', ') + '}';
  }

  TPL.matrix = function (rnd, diff) {
    var N = nameGen(rnd);
    var mName = N(['m', 'grid', 'mat', 'table']);
    if (diff === 1) {
      var rows = ri(rnd, 3, 3), cols = ri(rnd, 3, 4);
      var m1 = makeMatrix(rnd, rows, cols, 1, 20);
      var sum = N(['sum', 'total', 'acc']);
      var all = 0;
      m1.forEach(function (r) { r.forEach(function (v) { all += v; }); });
      var row0 = m1[0].reduce(function (x, y) { return x + y; }, 0);
      var diag = 0;
      for (var d = 0; d < Math.min(rows, cols); d++) diag += m1[d][d];
      return {
        main: [
          'int[][] ' + mName + ' = ' + matrixLiteral(m1) + ';',
          'int ' + sum + ' = 0;',
          'for (int i = 0; i < ' + mName + '.length; i++) {',
          '    for (int j = 0; j < ' + mName + '[i].length; j++) {',
          '        ' + sum + ' += ' + mName + '[i][j];',
          '    }',
          '}',
          'System.out.println(' + sum + ');'
        ],
        notes: [
          { i: 0, note: '二维数组是 ' + rows + '×' + cols + '；' + mName + '.length 是行数 ' + rows + '。' },
          { i: 3, note: '内层用 ' + mName + '[i].length 拿第 i 行的列数，逐格访问。' },
          { i: 4, note: '把每一格都加到 ' + sum + '。' },
          { i: 7, note: '输出所有元素之和 ' + all + '。' }
        ],
        expected: all,
        candidates: [row0, diag, rows * cols, all + 1],
        summary: '二维数组全部元素和是 ' + all + '。'
      };
    }
    if (diff === 2) {
      var n = ri(rnd, 3, 4);
      var m2 = makeMatrix(rnd, n, n, 1, 30);
      var sum2 = N(['sum', 'total', 'acc']);
      var diag2 = 0;
      for (var d2 = 0; d2 < n; d2++) diag2 += m2[d2][d2];
      var all2 = 0;
      m2.forEach(function (r) { r.forEach(function (v) { all2 += v; }); });
      var anti = 0;
      for (var a2 = 0; a2 < n; a2++) anti += m2[a2][n - 1 - a2];
      return {
        main: [
          'int[][] ' + mName + ' = ' + matrixLiteral(m2) + ';',
          'int ' + sum2 + ' = 0;',
          'for (int i = 0; i < ' + mName + '.length; i++) {',
          '    ' + sum2 + ' += ' + mName + '[i][i];',
          '}',
          'System.out.println(' + sum2 + ');'
        ],
        notes: [
          { i: 0, note: '方阵 ' + n + '×' + n + '。' },
          { i: 3, note: 'i 相同时取 ' + mName + '[i][i]，这就是从左上到右下的主对角线。' },
          { i: 5, note: '输出主对角线和 ' + diag2 + '（全数组和是 ' + all2 + '，副对角线和是 ' + anti + '）。' }
        ],
        expected: diag2,
        candidates: [all2, anti, n * n, diag2 + 1],
        summary: '主对角线元素之和是 ' + diag2 + '。'
      };
    }
    var rows3 = ri(rnd, 3, 4), cols3 = ri(rnd, 3, 4);
    var m3 = makeMatrix(rnd, rows3, cols3, 1, 20);
    var total = N(['total', 'sum', 'acc']);
    var rowMaxSum = 0;
    var rowMaxes = m3.map(function (r) {
      var mx = r[0];
      for (var j = 1; j < r.length; j++) if (r[j] > mx) mx = r[j];
      rowMaxSum += mx;
      return mx;
    });
    var colSums = [];
    for (var c3 = 0; c3 < cols3; c3++) {
      var cs = 0;
      for (var r3 = 0; r3 < rows3; r3++) cs += m3[r3][c3];
      colSums.push(cs);
    }
    return {
      main: [
        'int[][] ' + mName + ' = ' + matrixLiteral(m3) + ';',
        'int ' + total + ' = 0;',
        'for (int i = 0; i < ' + mName + '.length; i++) {',
        '    int max = ' + mName + '[i][0];',
        '    for (int j = 1; j < ' + mName + '[i].length; j++) {',
        '        if (' + mName + '[i][j] > max) max = ' + mName + '[i][j];',
        '    }',
        '    ' + total + ' += max;',
        '}',
        'System.out.println(' + total + ');'
      ],
      notes: [
        { i: 3, note: '每行开始先把该行第 0 个元素当作 max。' },
        { i: 5, note: 'j 从 1 开始扫本行，更新这一行的最大值。每行最大值依次是 ' + rowMaxes.join('、') + '。' },
        { i: 7, note: '把每行的 max 累加进 ' + total + '。' },
        { i: 9, note: '输出各行最大值之和 ' + rowMaxSum + '（各列之和是 ' + colSums.join('、') + '）。' }
      ],
      expected: rowMaxSum,
      candidates: [colSums.reduce(function (x, y) { return x + y; }, 0), m3[0].reduce(function (x, y) { return x + y; }, 0), rowMaxSum - 1, rowMaxSum + 1],
      summary: '各行最大值之和是 ' + rowMaxSum + '。'
    };
  };

  /* ---------------- 6) recursion：阶乘 / 斐波那契 / 汉诺塔 ---------------- */
  TPL.recursion = function (rnd, diff) {
    var N = nameGen(rnd);
    if (diff === 1) {
      var f = N(['fact', 'factorial', 'fac']);
      var nv = ri(rnd, 5, 8);
      var exp = 1;
      for (var i = 1; i <= nv; i++) exp *= i;
      return {
        main: ['System.out.println(' + f + '(' + nv + '));'],
        methods: [
          '    static int ' + f + '(int n) {',
          '        if (n <= 1) return 1;',
          '        return n * ' + f + '(n - 1);',
          '    }'
        ],
        notes: [
          { where: 'method', i: 1, note: '基线条件：n<=1 时返回 1，递归停止。' },
          { where: 'method', i: 2, note: '递归展开成 ' + nv + '×' + (nv - 1) + '×…×1。' },
          { i: 0, note: '输出 ' + nv + '! = ' + exp + '。' }
        ],
        expected: exp,
        candidates: [exp / nv, exp + 1, exp - nv, nv * nv],
        summary: nv + '! = ' + exp + '。'
      };
    }
    if (diff === 2) {
      var fb = N(['fib', 'fibo', 'fibonacci']);
      var nv2 = ri(rnd, 7, 12);
      var memo = [0, 1];
      for (var k = 2; k <= nv2 + 1; k++) memo[k] = memo[k - 1] + memo[k - 2];
      var exp2 = memo[nv2];
      return {
        main: ['System.out.println(' + fb + '(' + nv2 + '));'],
        methods: [
          '    static int ' + fb + '(int n) {',
          '        if (n <= 1) return n;',
          '        return ' + fb + '(n - 1) + ' + fb + '(n - 2);',
          '    }'
        ],
        notes: [
          { where: 'method', i: 1, note: '基线：n=0 返回 0，n=1 返回 1。' },
          { where: 'method', i: 2, note: '每个 n 都拆成前两项递归调用，指数级重复计算。' },
          { i: 0, note: '斐波那契数列 0,1,1,2,3,5,8,13,21,34,55,89…，第 ' + nv2 + ' 项是 ' + exp2 + '。' }
        ],
        expected: exp2,
        candidates: [memo[nv2 - 1], memo[nv2 - 2], nv2, exp2 - 1],
        summary: 'fib(' + nv2 + ') = ' + exp2 + '。'
      };
    }
    var hv = N(['hanoi', 'towers', 'moveCount']);
    var nv3 = ri(rnd, 4, 7);
    var exp3 = Math.pow(2, nv3) - 1;
    return {
      main: ['System.out.println(' + hv + '(' + nv3 + '));'],
      methods: [
        '    static int ' + hv + '(int n) {',
        '        if (n == 0) return 0;',
        '        return 2 * ' + hv + '(n - 1) + 1;',
        '    }'
      ],
      notes: [
        { where: 'method', i: 1, note: 'n=0 时不需要移动，返回 0。' },
        { where: 'method', i: 2, note: 'n 层的最小步数 = 2 ×（n-1 层步数）+ 1，递推得 2ⁿ-1。' },
        { i: 0, note: nv3 + ' 层汉诺塔最少要 ' + exp3 + ' 步。' }
      ],
      expected: exp3,
      candidates: [Math.pow(2, nv3 - 1) - 1, Math.pow(2, nv3), nv3 * nv3, exp3 - 1],
      summary: '汉诺塔 ' + nv3 + ' 层的移动步数是 2^' + nv3 + ' - 1 = ' + exp3 + '。'
    };
  };

  /* ==================================================================
   * 三、组装成题目对象
   * ================================================================== */

  /**
   * 生成一道题。
   * @param {number} seed 随机种子（同 seed 同题）
   * @param {object} cfg  { type:'loop'|'array'|...|'all', difficulty:1|2|3|0 }
   * @returns {object} item
   */
  function build(seed, cfg) {
    cfg = cfg || {};
    var s = ((Number(seed) || 0) >>> 0) || 1;
    var rnd = makeRng(s);
    var type = cfg.type && cfg.type !== 'all' ? String(cfg.type) : TYPE_IDS[s % TYPE_IDS.length];
    if (TYPE_IDS.indexOf(type) < 0) type = 'loop';
    var diff = Number(cfg.difficulty) || 0;
    if (diff < 1 || diff > 3) diff = 1 + (s % 3);

    var def = TPL[type](rnd, diff);
    var asm = assemble(def);
    var jsExpected = normOut(def.expected);
    var engineRes = runEngine(asm.source);
    var engineOk = !!(engineRes && engineRes.ok);
    var output = engineOk ? engineRes.output : jsExpected;
    /* 引擎真跑出的值与模板 JS 计算不一致 → 以引擎为准，并标记（自测会断言 0 条） */
    var mismatch = engineOk && output !== jsExpected;

    var meta = typeMeta(type);
    var options = [{ text: output, correct: true }].concat(
      padDistractors(output, def.candidates).map(function (t) { return { text: t, correct: false }; })
    );

    return {
      id: 'gen-' + type + '-d' + diff + '-' + s,
      kind: 'predict',
      type: type,
      typeLabel: meta.label,
      typeEn: meta.en,
      difficulty: diff,
      seed: s,
      stem: '阅读下面的 Java 程序，写出它的标准输出（即 System.out 打印的全部内容）。',
      program: asm.source,
      lineCount: asm.source.split('\n').length,
      output: output,
      answer: output,
      options: shuffle(rnd, options),
      explain: (def.notes || []).map(function (nt) {
        return { line: asm.lineOf(nt.where || 'main', nt.i), note: nt.note };
      }),
      summary: def.summary || '',
      engine: engineOk,          // 答案是否由站内 Java 引擎实测得到
      fallback: !engineOk,       // 引擎不可用 → JS 语义计算
      mismatch: mismatch         // 模板 JS 与引擎结果不一致（自测为 0）
    };
  }

  /** 生成一组题：类型/难度轮转，保证一套题覆盖面 */
  function buildSet(count, cfg, seedBase) {
    cfg = cfg || {};
    var n = Math.max(1, Math.min(40, Number(count) || 10));
    var base = seedBase == null
      ? (((Date.now() & 0xffffffff) ^ Math.floor(Math.random() * 4294967296)) >>> 0)
      : (Number(seedBase) >>> 0);
    var items = [];
    for (var i = 0; i < n; i++) {
      var one = { type: cfg.type || 'all', difficulty: cfg.difficulty || 0 };
      if (one.type === 'all') one.type = TYPE_IDS[(base + i) % TYPE_IDS.length];
      if (!one.difficulty) one.difficulty = 1 + ((base + i) % 3);
      items.push(build((base + i * 7919) >>> 0, one));
    }
    return items;
  }

  function types() { return TYPES.slice(); }

  var api = {
    version: '1.0',
    TYPES: TYPES,
    types: types,
    build: build,
    buildSet: buildSet,
    /* 自测钩子：暴露内部工具，便于 _dev 之外的对账脚本断言（不供 UI 使用） */
    _internal: { makeRng: makeRng, assemble: assemble, padDistractors: padDistractors, runEngine: runEngine }
  };

  if (CSC) {
    CSC.generator = api;
    if (CSC.bus && CSC.bus.emit) CSC.bus.emit('generator:ready', api);
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})();
