/* =====================================================================
 * 计算机科学与 Java 编程导论 · 学习站 · 框架层
 * 职责：
 *   1) window.CSC 命名空间、工具函数、事件总线、localStorage 状态
 *   2) 内容块渲染管线 renderBlocks（含代码高亮、降级、按需加载）
 *   3) 路由 / 侧栏导航 / 右侧本章目录 / 搜索 / 进度 / 主题 / 快捷键
 *   4) 总览页、实验台索引、题库页、模拟卷页、关于页的外壳
 * 对外 API 见 _dev/CONTRACT.md §3
 * ===================================================================== */
(function () {
  'use strict';

  var VERSION = '20261112p1';
  /* 构建批次：与 index.html / sw.js 的版本号保持一致，改过静态资源后一起更新，用于让缓存失效 */
  var BUILD = '20261122n1';

  /* ------------------------------------------------------------------ 站点身份 */
  /* data/site.js 在 assets/app.js 之前加载；六站共用一套框架，这里读取本站身份与文案。 */
  var SITE = window.CSC_SITE || {};
  var SITE_ID = SITE.id || 'csc1004';
  var SITE_SHORT = SITE.short || 'JAVA';
  var SITE_NAME = SITE.name || '计算机科学与编程导论';
  var SITE_LANG = SITE.lang || 'java';
  var SITE_LABEL = SITE.langLabel || 'JAVA';

  /* 本地存储命名空间：每门课独立，六站互不覆盖（旧版是裸 csc.*，见 migrateStorage） */
  var LS = 'csc.' + SITE_ID + '.';

  /* ------------------------------------------------------------------ 工具 */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      for (var k in attrs) {
        if (!Object.prototype.hasOwnProperty.call(attrs, k)) continue;
        var v = attrs[k];
        if (v == null || v === false) continue;
        if (k === 'class' || k === 'className') node.className = v;
        else if (k === 'text') node.textContent = v;
        else if (k === 'html') node.innerHTML = v;
        else if (k === 'dataset') { for (var d in v) node.dataset[d] = v[d]; }
        else if (k.slice(0, 3) === 'on:') node.addEventListener(k.slice(3), v);
        else if (k === 'style') node.setAttribute('style', v);
        else node.setAttribute(k, v === true ? '' : v);
      }
    }
    appendChildren(node, children);
    return node;
  }

  function appendChildren(node, children) {
    if (children == null) return node;
    if (!Array.isArray(children)) children = [children];
    children.forEach(function (c) {
      if (c == null || c === false) return;
      if (Array.isArray(c)) { appendChildren(node, c); return; }
      node.appendChild(c.nodeType ? c : document.createTextNode(String(c)));
    });
    return node;
  }

  function h(tag, attrs) {
    var kids = Array.prototype.slice.call(arguments, 2);
    return el(tag, attrs, kids);
  }

  function on(node, type, fn) { node.addEventListener(type, fn); return node; }
  function qs(sel, root) { return (root || document).querySelector(sel); }
  function qsa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function debounce(fn, ms) {
    var t; return function () { var a = arguments, s = this; clearTimeout(t); t = setTimeout(function () { fn.apply(s, a); }, ms || 200); };
  }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  /* localStorage 安全封装（file:// 下也可能抛错，比如隐私模式） */
  var store = {
    get: function (k, d) {
      try { var v = localStorage.getItem(LS + k); return v == null ? d : JSON.parse(v); }
      catch (e) { return d; }
    },
    set: function (k, v) {
      try { localStorage.setItem(LS + k, JSON.stringify(v)); } catch (e) {}
    },
    del: function (k) { try { localStorage.removeItem(LS + k); } catch (e) {} }
  };

  /* ------------------------------------------------------------------ 旧数据迁移（一次性） */
  /* 旧版所有站点共用裸 csc.* 键：这里只迁移本站还需要的数据（模拟卷成绩），
     旧的游戏化进度（章节已读、XP、连续天数、进阶读完标记、自查清单）直接清理。 */
  var MIGRATION_FLAG = 'csc.' + SITE_ID + '.migrated.v3';
  var MIGRATION_EXAM_FLAG = 'csc.' + SITE_ID + '.migrated.v3.exam';

  function legacyGet(k) {
    try { var v = localStorage.getItem('csc.' + k); return v == null ? null : JSON.parse(v); }
    catch (e) { return null; }
  }
  function legacyDel(k) { try { localStorage.removeItem('csc.' + k); } catch (e) {} }

  /** 由 assets/exam.js 加载卷子后调用：只迁移本站已知 exam id 的旧成绩（幂等） */
  function migrateExamLegacy(ids) {
    try {
      if (localStorage.getItem(MIGRATION_EXAM_FLAG)) return;
      (ids || []).forEach(function (id) {
        var r = legacyGet('exam.result.' + id);
        if (r != null) store.set('exam.result.' + id, r);
        var a = legacyGet('exam.attempt.' + id);
        if (a != null) store.set('exam.attempt.' + id, a);
        legacyDel('exam.result.' + id);
        legacyDel('exam.attempt.' + id);
      });
      var hist = legacyGet('exam.history');
      if (hist != null) store.set('exam.history', hist);
      /* csc.exam.history 不删：其他站也要各自迁移一份 */
      localStorage.setItem(MIGRATION_EXAM_FLAG, '1');
    } catch (e) {}
  }

  /** 一次性清理旧版裸 csc.* 键（进度/已读/进阶标记/欢迎标记），不碰其他站的数据 */
  function migrateStorage() {
    try {
      if (localStorage.getItem(MIGRATION_FLAG)) return;
      var welcomed = legacyGet('welcomed');
      if (welcomed != null) store.set('welcomed', welcomed);
      ['progress', 'last' + 'Chapter', 'advanced', 'welcomed'].forEach(function (k) { legacyDel(k); });
      localStorage.setItem(MIGRATION_FLAG, '1');
    } catch (e) {}
  }
  function todayStr() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  /* ------------------------------------------------------------------ 事件总线 */
  var bus = (function () {
    var map = {};
    return {
      on: function (evt, fn) { (map[evt] = map[evt] || []).push(fn); },
      emit: function (evt, data) { (map[evt] || []).forEach(function (fn) { try { fn(data); } catch (e) { console.error(e); } }); }
    };
  })();

  /* ------------------------------------------------------------------ 图标 */
  var ICONS = {
    rocket: '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
    code: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
    cpu: '<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3"/>',
    branch: '<line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/>',
    array: '<rect x="2" y="7" width="20" height="10" rx="2"/><path d="M7 7v10M12 7v10M17 7v10"/>',
    keyboard: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M6 9h.01M10 9h.01M14 9h.01M18 9h.01M8 13h.01M12 13h.01M16 13h.01M7 16h10"/>',
    function: '<path d="M9 3h3a6 6 0 0 1 0 12v6"/><path d="M3 9h12"/>',
    box: '<path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="m3.3 7 8.7 5 8.7-5M12 22V12"/>',
    layers: '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
    memory: '<rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h2v4H6zM11 10h2v4h-2zM16 10h2v4h-2z"/>',
    list: '<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>',
    sort: '<path d="M11 5h10M11 9h7M11 13h4M3 17l3 3 3-3M6 18V4"/>',
    repeat: '<path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/>',
    chart: '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>',
    check: '<polyline points="20 6 9 17 4 12"/>',
    x: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
    play: '<polygon points="6 3 20 12 6 21 6 3"/>',
    step: '<polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/>',
    reset: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
    copy: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    moon: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
    trophy: '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',
    zap: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
    'arrow-right': '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>',
    'arrow-left': '<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>',
    chevron: '<polyline points="9 18 15 12 9 6"/>',
    menu: '<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>',
    home: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
    bug: '<path d="m8 2 1.88 1.88M14.12 3.88 16 2"/><path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"/><path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6z"/><path d="M12 20v-9M6.53 9C4.6 8.8 3 7.1 3 5M6 13H2M3 21c0-2.1 1.7-3.9 3.8-4M20.97 5c0 2.1-1.6 3.8-3.5 4M22 13h-4M17.2 17c2.1.1 3.8 1.9 3.8 4"/>',
    lightbulb: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>',
    warning: '<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
    flask: '<path d="M9 3h6v5.5l4.5 8.5A2.5 2.5 0 0 1 17.25 21H6.75a2.5 2.5 0 0 1-2.25-3.5L9 8.5V3z"/><path d="M9 3h6M8 13h8"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    sparkle: '<path d="m12 3 1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4L12 3z"/><path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 14"/>',
    star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
    trash: '<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
    grid: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
    fire: '<path d="M12 22c4.4 0 7-3 7-6.5 0-4-3-6-4-9.5-1 1.5-1.5 3-1.5 4.5C13.5 8 12 5 9 3c.5 3-1 5-2.5 7C5 12 5 13.5 5 15.5 5 19 7.6 22 12 22z"/>',
    medal: '<circle cx="12" cy="14" r="6"/><path d="M8 2 5 8M16 2l3 6"/><path d="m12 11 1 2.2 2.4.3-1.8 1.7.5 2.4-2.1-1.2-2.1 1.2.5-2.4-1.8-1.7 2.4-.3z"/>',
    compass: '<circle cx="12" cy="12" r="9"/><polygon points="16 8 14 14 8 16 10 10 16 8"/>'
  };

  function icon(name, cls) {
    var p = ICONS[name] || ICONS.code;
    return '<svg class="ico ' + (cls || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>';
  }

  /* ------------------------------------------------------------------ Java 高亮 */
  var JAVA_KW = ('abstract assert boolean break byte case catch char class const continue default do double else enum '
    + 'extends final finally float for goto if implements import instanceof int interface long native new package private '
    + 'protected public return short static strictfp super switch synchronized this throw throws transient try void '
    + 'volatile while true false null var record').split(' ');
  var JAVA_KW_SET = {};
  JAVA_KW.forEach(function (k) { JAVA_KW_SET[k] = 1; });
  var JAVA_TYPE_SET = { String: 1, Integer: 1, Double: 1, Character: 1, Boolean: 1, Math: 1, System: 1, Object: 1, Scanner: 1, ArrayList: 1, Arrays: 1, LinkedList: 1, HashMap: 1, HashSet: 1, List: 1, Map: 1, Set: 1, StringBuilder: 1, Collections: 1, Exception: 1, RuntimeException: 1 };

  /** Java 源码 → 带 span 的高亮 HTML（不换行，保留原有换行由调用方处理） */
  function highlightJava(src) {
    var out = '', i = 0, n = src.length;
    function isIdStart(c) { return /[A-Za-z_$]/.test(c); }
    function isId(c) { return /[A-Za-z0-9_$]/.test(c); }
    while (i < n) {
      var c = src[i], c2 = src[i + 1];
      // 行注释 / 块注释
      if (c === '/' && c2 === '/') {
        var j = src.indexOf('\n', i); if (j < 0) j = n;
        out += '<span class="tk-cmt">' + esc(src.slice(i, j)) + '</span>'; i = j; continue;
      }
      if (c === '/' && c2 === '*') {
        var jj = src.indexOf('*/', i + 2); jj = jj < 0 ? n : jj + 2;
        out += '<span class="tk-cmt">' + esc(src.slice(i, jj)) + '</span>'; i = jj; continue;
      }
      // 字符串 / 字符
      if (c === '"' || c === "'") {
        var q = c, j2 = i + 1;
        while (j2 < n) { if (src[j2] === '\\') { j2 += 2; continue; } if (src[j2] === q) { j2++; break; } if (src[j2] === '\n' && q === '"') break; j2++; }
        out += '<span class="tk-str">' + esc(src.slice(i, j2)) + '</span>'; i = j2; continue;
      }
      // 数字
      if (/[0-9]/.test(c) || (c === '.' && /[0-9]/.test(c2))) {
        var j3 = i;
        while (j3 < n && /[0-9a-fA-FxX._eE+\-]/.test(src[j3])) {
          if ((src[j3] === '+' || src[j3] === '-') && !/[eE]/.test(src[j3 - 1])) break;
          if (src[j3] === '.' && !/[0-9]/.test(src[j3 + 1] || '') && !/[eEfFdD]/.test(src[j3 + 1] || '')) break;
          j3++;
        }
        out += '<span class="tk-num">' + esc(src.slice(i, j3)) + '</span>'; i = j3; continue;
      }
      // 标识符
      if (isIdStart(c)) {
        var j4 = i + 1;
        while (j4 < n && isId(src[j4])) j4++;
        var w = src.slice(i, j4), after = src.slice(j4, j4 + 40);
        if (JAVA_KW_SET[w]) out += '<span class="tk-kw">' + w + '</span>';
        else if (JAVA_TYPE_SET[w]) out += '<span class="tk-type">' + w + '</span>';
        else if (/^\s*\(/.test(after)) out += '<span class="tk-meth">' + esc(w) + '</span>';
        else out += esc(w);
        i = j4; continue;
      }
      // 运算符
      if (/[+\-*/%=<>!&|^~?:]/.test(c)) out += '<span class="tk-op">' + esc(c) + '</span>';
      else out += esc(c);
      i++;
    }
    return out;
  }

  /* ------------------------------------------------------------------ Python 高亮 */
  var PY_KW_SET = {};
  ('False None True and as assert async await break class continue def del elif else except finally for from '
    + 'global if import in is lambda nonlocal not or pass raise return try while with yield match case').split(' ')
    .forEach(function (k) { PY_KW_SET[k] = 1; });
  var PY_BUILTIN_SET = {
    print: 1, len: 1, range: 1, int: 1, str: 1, float: 1, list: 1, dict: 1, set: 1, tuple: 1, open: 1,
    input: 1, type: 1, isinstance: 1, super: 1, self: 1, enumerate: 1, zip: 1, sum: 1, max: 1, min: 1,
    sorted: 1, abs: 1, round: 1, Exception: 1, ValueError: 1, TypeName: 1
  };

  /** Python 源码 → 带 span 的高亮 HTML（不换行，保留原有换行由调用方处理） */
  function highlightPython(src) {
    var out = '', i = 0, n = src.length;
    function isIdStart(c) { return /[A-Za-z_]/.test(c); }
    function isId(c) { return /[A-Za-z0-9_]/.test(c); }
    while (i < n) {
      var c = src[i], c2 = src[i + 1];
      // 行注释
      if (c === '#') {
        var j = src.indexOf('\n', i); if (j < 0) j = n;
        out += '<span class="tk-cmt">' + esc(src.slice(i, j)) + '</span>'; i = j; continue;
      }
      // 字符串：三引号 / 单双引号
      if (c === '"' || c === "'") {
        var q = c, j2 = i + 1;
        if (src[i + 1] === q && src[i + 2] === q) {
          j2 = i + 3;
          while (j2 < n && !(src[j2] === q && src[j2 + 1] === q && src[j2 + 2] === q)) j2++;
          j2 = Math.min(n, j2 + 3);
        } else {
          while (j2 < n) {
            if (src[j2] === '\\') { j2 += 2; continue; }
            if (src[j2] === q) { j2++; break; }
            if (src[j2] === '\n') break;
            j2++;
          }
        }
        out += '<span class="tk-str">' + esc(src.slice(i, j2)) + '</span>'; i = j2; continue;
      }
      // 数字
      if (/[0-9]/.test(c) || (c === '.' && /[0-9]/.test(c2))) {
        var j3 = i;
        while (j3 < n && /[0-9a-fA-FxX._eE+\-]/.test(src[j3])) {
          if ((src[j3] === '+' || src[j3] === '-') && !/[eE]/.test(src[j3 - 1])) break;
          j3++;
        }
        out += '<span class="tk-num">' + esc(src.slice(i, j3)) + '</span>'; i = j3; continue;
      }
      // 标识符 / 关键字 / 内置函数
      if (isIdStart(c)) {
        var j4 = i + 1;
        while (j4 < n && isId(src[j4])) j4++;
        var w = src.slice(i, j4), after = src.slice(j4, j4 + 40);
        if (PY_KW_SET[w]) out += '<span class="tk-kw">' + w + '</span>';
        else if (PY_BUILTIN_SET[w]) out += '<span class="tk-type">' + w + '</span>';
        else if (/^\s*\(/.test(after)) out += '<span class="tk-meth">' + esc(w) + '</span>';
        else out += esc(w);
        i = j4; continue;
      }
      // 运算符
      if (/[+\-*/%=<>!&|^~?:@]/.test(c)) out += '<span class="tk-op">' + esc(c) + '</span>';
      else out += esc(c);
      i++;
    }
    return out;
  }

  /** 把高亮 HTML 按行包成 <span class="line">，可选聚焦行；lang 为 'python' 时走 Python 高亮 */
  function codeLines(code, focus, lang) {
    var src = String(code || '').replace(/\s+$/, '');
    var lines = (/python/i.test(lang || '') ? highlightPython(src) : highlightJava(src)).split('\n');
    return lines.map(function (ln, idx) {
      var no = idx + 1;
      var cls = 'line';
      if (focus && focus.indexOf(no) >= 0) cls += ' focus';
      var lnCls = 'ln' + (focus && focus.indexOf(no) >= 0 ? ' focus' : '');
      return '<span class="' + cls + '"><span class="' + lnCls + '">' + no + '</span>' + ln + '</span>';
    }).join('');
  }

  /* ------------------------------------------------------------------ 模块加载 */
  var loaded = {};
  var loading = {};

  function loadScript(url) {
    if (loaded[url]) return loaded[url];
    if (loading[url]) return loading[url];
    loading[url] = new Promise(function (resolve) {
      var s = document.createElement('script');
      // 带版本号：内容更新后浏览器不会继续用旧缓存
      s.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'v=' + BUILD;
      s.async = true;
      s.onload = function () { loaded[url] = Promise.resolve(true); resolve(true); };
      s.onerror = function () {
        loaded[url] = Promise.resolve(false);
        console.warn('[CSC] 模块加载失败：' + url);
        resolve(false);
      };
      document.head.appendChild(s);
    });
    return loading[url];
  }

  var MODULE_FILES = {
    engine: 'assets/engine.js',
    editor: 'assets/editor.js',
    viz: 'assets/viz.js',
    labs: 'assets/labs.js',
    labs2: 'assets/labs2.js',
    quiz: 'assets/quiz.js',
    exam: 'assets/exam.js',
    generator: 'assets/generator.js',
    projects: 'assets/projects.js',
    '/chapters': null
  };

  function loadModule(name) {
    if (!MODULE_FILES[name]) return Promise.resolve(false);
    /* labs 由两个物理文件组成：labs.js（ch00–ch14 的实验台）+ labs2.js（ch15–ch20 的实验台）。
     * 两个文件都各自调用 CSC.registerLabs(...)，注册表合并到同一处，所以逻辑上是一个模块。 */
    if (name === 'labs') {
      return Promise.all([
        loadScript(MODULE_FILES.labs),
        loadScript(MODULE_FILES.labs2)
      ]).then(function (r) { return r[0]; });
    }
    return loadScript(MODULE_FILES[name]);
  }
  function loadModules(names) {
    return Promise.all(names.map(loadModule));
  }

  /* ------------------------------------------------------------------ 成绩记录 */
  /* 只保留答题对错统计（每道题答过几次 / 对几次），不再记录章节已读、XP、等级或连续天数。 */
  var records = (function () {
    var q = store.get('quiz', null) || {};

    function save() { store.set('quiz', q); }

    return {
      recordQuiz: function (id, ok) {
        var r = q[id] || (q[id] = { n: 0, ok: 0 });
        r.n++;
        if (ok) r.ok++;
        save();
      },
      quizRec: function (id) { return q[id] || null; },
      clear: function () { q = {}; save(); }
    };
  })();

  /* ------------------------------------------------------------------ 容器 */
  var chapters = [];
  var chapterMeta = [];
  var chapterById = {};
  var labs = {};
  var quizPack = null;
  var exams = [];

  /* 站点读数：Part 数与换行符都由数据算，避免文案和章节清单脱节 */
  var NL = String.fromCharCode(10);
  function partCount() {
    var seen = {};
    chapterMeta.forEach(function (m) { if (m.part) seen[m.part] = 1; });
    return Object.keys(seen).length;
  }

  /* ------------------------------------------------------------------ 内容块渲染 */
  var ANCHOR_SEQ = 0;
  var CURR_CTX = {};

  function blockTitle(block) {
    if (!block) return '';
    if (block.t === 'h') return stripTags(block.text);
    if (block.t === 'callout') return stripTags(block.title || '');
    return '';
  }

  function stripTags(s) {
    return String(s || '').replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
  }

  /** 渲染内容块数组。ctx: {chapter, container, anchors} */
  function renderBlocks(container, blocks, ctx) {
    ctx = ctx || {};
    var anchors = ctx.anchors || [];
    (blocks || []).forEach(function (b) {
      if (!b) return;
      var node = renderBlock(b, ctx, anchors);
      if (node) container.appendChild(node);
    });
    return anchors;
  }

  function renderBlock(b, ctx, anchors) {
    switch (b.t) {
      case 'h': {
        var lvl = b.lvl || 2;
        var tag = 'h' + clamp(lvl, 2, 4);
        var id = b.id || ('sec-' + (++ANCHOR_SEQ));
        var node = el(tag, { class: 'blockH', id: id, html: b.text });
        anchors.push({ id: id, text: stripTags(b.text), lvl: lvl });
        return node;
      }
      case 'p':
        return el('p', { class: 'blockP' + (b.lead ? ' lead' : ''), html: b.html });
      case 'divider':
        return el('hr', { class: 'divider' });
      case 'callout': {
        var kind = b.kind || 'note';
        var icons = { why: 'lightbulb', tip: 'check', warn: 'warning', exam: 'target', ai: 'sparkle', note: 'book', quote: 'book' };
        var titles = { why: '为什么学这个', tip: '小技巧', warn: '易错点', exam: '考试视角', ai: 'AI 时代这样学', note: '补充', quote: '一句话' };
        return el('div', { class: 'callout ' + kind }, [
          el('div', { class: 'ct', html: icon(icons[kind] || 'book') + '<span>' + esc(b.title || titles[kind] || '') + '</span>' }),
          el('div', { class: 'cb', html: b.html || '' })
        ]);
      }
      case 'code':
        return renderCodeBlock(b, ctx);
      case 'codegroup': {
        var wrap = el('div', { class: 'tabsBlock' });
        var bar = el('div', { class: 'tabBar' });
        var panes = el('div');
        (b.tabs || []).forEach(function (tb, i) {
          var btn = el('button', { class: 'tabBtn' + (i === 0 ? ' active' : ''), text: tb.label || ('Tab ' + (i + 1)) });
          var pane = el('div', { class: 'tabPane' + (i === 0 ? '' : ' hidden') });
          pane.appendChild(renderCodeBlock({ t: 'code', lang: tb.lang, code: tb.code, run: tb.run, trace: tb.trace, caption: tb.caption || tb.label }, ctx));
          btn.addEventListener('click', function () {
            qsa('.tabBtn', bar).forEach(function (x) { x.classList.remove('active'); });
            qsa('.tabPane', wrap).forEach(function (x) { x.classList.add('hidden'); });
            btn.classList.add('active'); pane.classList.remove('hidden');
          });
          bar.appendChild(btn); panes.appendChild(pane);
        });
        wrap.appendChild(bar); wrap.appendChild(panes);
        return wrap;
      }
      case 'table': {
        var tWrap = el('div', { class: 'tableWrap' });
        var tbl = el('table');
        if (b.head && b.head.length) {
          var thead = el('thead'), tr = el('tr');
          b.head.forEach(function (c) { tr.appendChild(el('th', { html: c })); });
          thead.appendChild(tr); tbl.appendChild(thead);
        }
        var tbody = el('tbody');
        (b.rows || []).forEach(function (row) {
          var tr2 = el('tr');
          row.forEach(function (c) { tr2.appendChild(el('td', { html: c })); });
          tbody.appendChild(tr2);
        });
        tbl.appendChild(tbody); tWrap.appendChild(tbl);
        if (b.caption) tWrap.appendChild(el('div', { class: 'cap', html: b.caption }));
        return tWrap;
      }
      case 'term': {
        return termCard(b);
      }
      case 'terms': {
        var g = el('div', { class: 'termsGrid' });
        if (b.cols === 2) g.style.gridTemplateColumns = '1fr 1fr';
        (b.items || []).forEach(function (it) { g.appendChild(termCard(it)); });
        return g;
      }
      case 'steps': {
        var sw = el('div', { class: 'steps' });
        (b.items || []).forEach(function (it, i) {
          sw.appendChild(el('div', { class: 'step', dataset: { n: i + 1 } }, [
            el('div', { class: 'st', html: it.title || '' }),
            el('div', { class: 'sd', html: it.html || '' })
          ]));
        });
        return sw;
      }
      case 'compare': {
        /* CSC1004 的 compare 多数是**中性对照**（Java vs Python、HBox vs VBox、ServerSocket vs Socket、
         * 控制台版 vs JavaFX 版），用固定 ✕/✓ 会把一侧误标成「错」。
         * 因此默认用中性的 A / B 徽标；只有当内容显式给出 b.verdict（'wrong-right'）时才用 ✕ / ✓。 */
        var cw = el('div', { class: 'compare' });
        var wantVerdict = b.verdict === 'wrong-right';
        ['left', 'right'].forEach(function (side) {
          var s = b[side] || {};
          var mark = wantVerdict ? (side === 'left' ? '✕ ' : '✓ ') : (side === 'left' ? 'A · ' : 'B · ');
          var card = el('div', { class: 'cmpCard ' + side }, [
            el('div', { class: 'cT', html: mark + esc(s.title || (side === 'left' ? 'A' : 'B')) })
          ]);
          if (s.html) card.appendChild(el('div', { html: s.html }));
          if (s.code) card.appendChild(el('pre', { html: highlightJava(s.code) }));
          cw.appendChild(card);
        });
        if (!b.vs) return cw;
        var cmpWrap = el('div');
        cmpWrap.appendChild(el('div', { class: 'cmpVsT', text: b.vs }));
        cmpWrap.appendChild(cw);
        return cmpWrap;
      }
      case 'memory': {
        return el('div', { class: 'memHost', dataset: { code: encodeURIComponent(b.code || ''), note: b.note || '' } });
      }
      case 'flow':
        return flowBlock(b);
      case 'svg': {
        var fig = el('div', { class: 'svgFig' });
        fig.innerHTML = b.html || '';
        if (b.caption) fig.appendChild(el('div', { class: 'figCap', html: b.caption }));
        if (b.maxW) { var svg0 = fig.querySelector('svg'); if (svg0) svg0.style.maxWidth = b.maxW + 'px'; }
        return fig;
      }
      case 'grid': {
        var gg = el('div', { class: 'gridBlock c' + (b.cols || 2) });
        (b.items || []).forEach(function (it) {
          var cell = el('div');
          if (Array.isArray(it)) renderBlocks(cell, it, ctx);
          else if (it && it.t) { var one = renderBlock(it, ctx, []); if (one) cell.appendChild(one); }
          else if (it && it.html) cell.innerHTML = it.html;
          gg.appendChild(cell);
        });
        return gg;
      }
      case 'tabs': {
        var tw = el('div', { class: 'tabsBlock' });
        var tbar = el('div', { class: 'tabBar' });
        var tpanes = el('div');
        (b.items || []).forEach(function (it, i) {
          var btn2 = el('button', { class: 'tabBtn' + (i === 0 ? ' active' : ''), text: it.label || ('Tab ' + (i + 1)) });
          var pane2 = el('div', { class: 'tabPane' + (i === 0 ? '' : ' hidden') });
          renderBlocks(pane2, it.blocks || [], {});
          btn2.addEventListener('click', function () {
            qsa('.tabBtn', tbar).forEach(function (x) { x.classList.remove('active'); });
            qsa('.tabPane', tw).forEach(function (x) { x.classList.add('hidden'); });
            btn2.classList.add('active'); pane2.classList.remove('hidden');
          });
          tbar.appendChild(btn2); tpanes.appendChild(pane2);
        });
        tw.appendChild(tbar); tw.appendChild(tpanes);
        return tw;
      }
      case 'checklist':
        return checklistBlock(b);
      case 'keypoint': {
        var kp = el('div', { class: 'keypoint' }, [el('h4', { html: icon('target') + '<span>本章要点</span>' })]);
        (b.items || []).forEach(function (it, i) {
          kp.appendChild(el('div', { class: 'kpItem' }, [
            el('span', { class: 'kpn', text: i + 1 }),
            el('span', { html: (it.title ? '<b>' + esc(it.title) + '</b> ' : '') + (it.html || '') })
          ]));
        });
        return kp;
      }
      case 'lab': {
        var lw = el('div', { class: 'lab', dataset: { lab: b.id || '' } });
        lw.appendChild(el('div', { class: 'labHead' }, [
          el('div', { class: 'labIcon', html: icon('flask') }),
          el('div', { class: 'labTt' }, [
            el('b', { text: '交互实验室' }),
            el('span', { text: '正在载入…' })
          ])
        ]));
        lw.appendChild(el('div', { class: 'labBody' }, [el('div', { class: 'labStage' }, [el('div', { class: 'varEmpty', text: '组件加载中…' })])]));
        lw._props = b.props || {};
        pendingLabs.push(lw);
        return lw;
      }
      case 'quiz': {
        var qw = el('div', { class: 'qzHost', dataset: { qid: b.qid || '' } },
          [el('div', { class: 'qzCard' }, [el('div', { class: 'qzBody' }, [el('div', { class: 'varEmpty', text: '题目加载中…' })])])]);
        pendingQuiz.push(qw);
        return qw;
      }
      default:
        console.warn('[CSC] 未知 block 类型：', b.t);
        return null;
    }
  }

  function termCard(it) {
    return el('div', { class: 'termCard' }, [
      el('span', { class: 'te', text: it.en || '' }),
      el('span', { class: 'tz', html: it.zh || '' }),
      el('div', { class: 'td', html: (it.html || '') + (it.code ? ' <code>' + esc(it.code) + '</code>' : '') })
    ]);
  }

  function checklistBlock(b) {
    var wrap = el('div', { class: 'checklist' }, [el('h4', { text: '离开本章前，自查一下' })]);
    var bar = el('div', { class: 'checkBar' }, [el('i')]);
    var items = b.items || [];
    function refresh() {
      var done = 0;
      qsa('.checkItem', wrap).forEach(function (n) {
        if (n.classList.contains('on')) done++;
      });
      bar.firstChild.style.width = (items.length ? done / items.length * 100 : 0) + '%';
      wrap.dataset.all = (done === items.length && items.length) ? '1' : '0';
    }
    items.forEach(function (txt) {
      var item = el('div', { class: 'checkItem' }, [
        el('span', { class: 'box', html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">' + ICONS.check + '</svg>' }),
        el('span', { class: 'ctext', html: txt })
      ]);
      /* 自查清单只在本次会话里勾选，不写入本地存储 */
      item.addEventListener('click', function () {
        item.classList.toggle('on');
        refresh();
      });
      wrap.appendChild(item);
    });
    wrap.appendChild(bar);
    refresh();
    return wrap;
  }

  function flowBlock(b) {
    var nodes = b.nodes || [];
    var dir = b.dir || 'v';
    var wrap = el('div', { class: 'flowWrap' });
    var W = dir === 'h' ? Math.min(840, nodes.length * 200) : 560;
    var gap = dir === 'h' ? 200 : 104;
    var H = dir === 'h' ? 190 : nodes.length * gap + 20;
    if (dir === 'h') W = nodes.length * gap + 40;
    var svg = '<svg class="flowSvg" viewBox="0 0 ' + W + ' ' + H + '" role="img">';
    svg += '<defs><marker id="arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--line2)"/></marker></defs>';
    nodes.forEach(function (nd, i) {
      var x, y;
      if (dir === 'h') { x = 20 + i * gap; y = 40; }
      else { x = 20; y = 14 + i * gap; }
      var kind = nd.kind || 'proc';
      var rx = kind === 'decide' ? 6 : 10;
      var fill = kind === 'decide' ? 'var(--accentSoft)' : 'var(--surface2)';
      var stroke = kind === 'decide' ? 'var(--accent)' : 'var(--line2)';
      svg += '<rect x="' + x + '" y="' + y + '" width="' + (dir === 'h' ? 160 : 300) + '" height="' + (kind === 'decide' ? 52 : 48) + '" rx="' + rx + '" fill="' + fill + '" stroke="' + stroke + '" stroke-width="1.4"/>';
      svg += '<text x="' + (x + (dir === 'h' ? 80 : 150)) + '" y="' + (y + (kind === 'decide' ? 22 : 20)) + '" text-anchor="middle" fill="var(--text)" font-size="12" font-weight="600" font-family="var(--font)">' + esc(nd.title || '') + '</text>';
      if (nd.desc) svg += '<text x="' + (x + (dir === 'h' ? 80 : 150)) + '" y="' + (y + (kind === 'decide' ? 38 : 35)) + '" text-anchor="middle" fill="var(--text3)" font-size="10" font-family="var(--font)">' + esc(nd.desc) + '</text>';
      if (i < nodes.length - 1) {
        if (dir === 'h') {
          svg += '<line x1="' + (x + 160) + '" y1="' + (y + 26) + '" x2="' + (x + gap - 2) + '" y2="' + (y + 26) + '" stroke="var(--line2)" stroke-width="1.4" marker-end="url(#arw)"/>';
        } else {
          svg += '<line x1="' + (x + 150) + '" y1="' + (y + 48) + '" x2="' + (x + 150) + '" y2="' + (y + gap - 4) + '" stroke="var(--line2)" stroke-width="1.4" marker-end="url(#arw)"/>';
        }
      }
    });
    svg += '</svg>';
    wrap.innerHTML = svg;
    return wrap;
  }

  /* 代码块语言标签：本站同时有 Java 与 Python 代码，按内容判断而不是写死 <span>Java</span>。
   * 判定顺序：Python 强特征（def/class X:/from x import/self./print(/# 注释/tkinter 调用）→ Python，
   * 其余（含 JavaFX / Socket / Java 片段）→ Java。 */
  function detectLang(code, ctx) {
    var s = String(code || '');
    if (/(^|\n)\s*(def |class\s+\w+\s*:|from\s+\w[\w.]*\s+import |import\s+(tkinter|random|numpy|torch|os|sys|json)\b)/.test(s)) return 'Python';
    if (/\bself\./.test(s)) return 'Python';
    if (/(^|\n)\s*print\(/.test(s)) return 'Python';
    if (/(^|\n)\s*#\s?[^\n]*$/.test(s) && !/[;{}]/.test(s)) return 'Python';
    if (/(\.pack\(|\.grid\(|\.place\(|mainloop\(|create_rectangle\(|create_text\(|\.after\()/.test(s)) return 'Python';
    /* 第 15–19 章是 Python 单元：没有强 Java 特征的代码统一按 Python 处理 */
    var chapterId = (ctx && ctx.chapter && ctx.chapter.id) ? String(ctx.chapter.id) : '';
    if (/^ch1[5-9]$/.test(chapterId) && !/(public\s+class|System\.out|import\s+java|void\s+main|new\s+Scanner)/.test(s)) return 'Python';
    return 'Java';
  }

  /* 代码块：默认静态展示 + 「运行」按钮，点击就地展开为可编辑运行面板 */
  function renderCodeBlock(b, ctx) {
    var box = el('div', { class: 'codeBox' });
    var declared = String(b.lang || '').toLowerCase();
    var lang = declared ? (declared === 'python' ? 'Python' : 'Java') : detectLang(b.code, ctx);
    var langKey = (/python/i.test(lang) ? 'python' : 'java');
    var head = el('div', { class: 'codeBoxHead' }, [
      el('span', { class: 'codeDots', html: '<i></i><i></i><i></i>' }),
      el('span', { class: 'cbT', html: (b.caption ? '<b>' + esc(b.caption) + '</b>' : '<b>' + lang + '</b>') }),
      el('span', { class: 'pill', text: lang })
    ]);
    /* 站内解释器只覆盖 ch01–ch05 的 Java 子集：不可运行的块明确标注需要本地环境 */
    if (b.run === false && !b.trace) {
      head.appendChild(el('span', {
        class: 'pill noRun',
        text: (langKey === 'python' ? '需本地 Python 运行，站内不执行' : '需本地 JDK 运行，站内不执行')
      }));
    }
    if (b.run !== false || b.trace) {
      var runBtn = el('button', { class: 'ed-btn primary', html: icon('play') + '<span>运行</span>' });
      head.appendChild(runBtn);
      head.style.gap = '8px';
      runBtn.style.marginLeft = 'auto';
      runBtn.addEventListener('click', function () {
        expand(box, b, ctx, b.trace);
      });
    }
    box.appendChild(head);
    var pre = el('pre', { html: codeLines(b.code || '', b.focus, langKey) });
    box.appendChild(pre);

    if (b.trace) {
      // 单步块：直接展开调试面板（这是核心交互）
      setTimeout(function () {
        if (CSC.editor) expand(box, b, ctx, true);
      }, 0);
    }
    return box;
  }

  function expand(box, b, ctx, trace) {
    if (!CSC.editor) {
      if (!box._loading) {
        box._loading = true;
        CSC.toast('正在加载代码引擎…');
        loadModules(['engine', 'editor']).then(function () {
          if (CSC.editor) expand(box, b, ctx, trace);
          else CSC.toast('代码引擎加载失败，请刷新页面重试', 'err');
        });
      }
      return;
    }
    box.innerHTML = '';
    box.style.border = '0';
    box.style.background = 'transparent';
    box.style.boxShadow = 'none';
    var mount = el('div');
    box.appendChild(mount);
    var ed = CSC.editor.mount(mount, {
      code: b.code || '',
      caption: b.caption || '',
      run: b.run !== false,
      trace: !!trace,
      stdin: b.stdin || '',
      args: b.args || [],
      height: Math.min(420, Math.max(150, (b.code || '').split('\n').length * 21 + 26))
    });
    box._editor = ed;
    if (b.trace) setTimeout(function () { try { ed.run(); } catch (e) {} }, 60);
  }

  function hydrateMemory(scope) {
    var list = qsa('.memHost', scope || document);
    list.forEach(function (host) {
      if (host.dataset.done) return;
      if (!CSC.editor) {
        // 引擎还没加载好：触发加载后重试（只重试一次，避免死循环）
        if (!host.dataset.waiting) {
          host.dataset.waiting = '1';
          loadModules(['engine', 'editor']).then(function () {
            host.dataset.waiting = '';
            hydrateMemory(scope);
          });
        }
        return;
      }
      host.dataset.done = '1';
      var code = '';
      try { code = decodeURIComponent(host.dataset.code || ''); } catch (e) { code = host.dataset.code || ''; }
      var note = host.dataset.note || '';
      host.innerHTML = '';
      if (note) host.appendChild(el('div', { class: 'callout note' }, [el('div', { class: 'cb', html: note })]));
      var mountBox = el('div');
      host.appendChild(mountBox);
      try {
        CSC.editor.mount(mountBox, {
          code: code,
          trace: true,
          run: false,
          height: Math.min(360, Math.max(140, code.split('\n').length * 21 + 26))
        });
      } catch (e) {
        console.error('[memory] 渲染失败', e);
        host.appendChild(el('div', { class: 'varEmpty', text: '内存演示渲染失败：' + e.message }));
      }
    });
  }

  /* 占位组件的按需补全 */
  var pendingLabs = [];
  var pendingQuiz = [];

  function hydrateLabs(scope) {
    var list = scope ? qsa('.lab[data-lab]', scope) : pendingLabs.slice();
    list.forEach(function (lw) {
      var id = lw.dataset.lab;
      var def = labs[id];
      if (!def || lw.dataset.done) return;
      lw.dataset.done = '1';
      lw.innerHTML = '';
      lw.appendChild(el('div', { class: 'labHead' }, [
        el('div', { class: 'labIcon', html: icon(def.icon || 'flask') }),
        el('div', { class: 'labTt' }, [
          el('b', { text: def.title || '交互实验室' }),
          el('span', { text: def.desc || '' })
        ]),
        el('span', { class: 'labTag', text: 'interactive' })
      ]));
      var body = el('div', { class: 'labBody' });
      lw.appendChild(body);
      try {
        def.init(body, lw._props || {}, { chapter: CURR_CTX.chapter, CSC: CSC });
      } catch (e) {
        console.error('[labs] ' + id + ' 初始化失败', e);
        body.appendChild(el('div', { class: 'varEmpty', text: '该实验台初始化失败：' + e.message }));
      }
    });
  }

  function hydrateQuiz(scope) {
    var list = scope ? qsa('.qzHost', scope) : pendingQuiz.slice();
    list.forEach(function (host) {
      var qid = host.dataset.qid;
      if (!CSC.quiz || host.dataset.done) return;
      var item = CSC.quiz.byId(qid);
      if (!item) {
        host.innerHTML = '<div class="qzCard"><div class="qzBody"><div class="varEmpty">未找到题目 ' + esc(qid) + '</div></div></div>';
        return;
      }
      host.dataset.done = '1';
      host.innerHTML = '';
      CSC.quiz.mountCard(host, item, {});
    });
  }

  /* ------------------------------------------------------------------ 章节 */
  function registerChapter(ch) {
    if (!ch || !ch.id) return;
    var exist = chapterById[ch.id];
    if (exist) { Object.assign(exist, ch); return exist; }
    chapterById[ch.id] = ch;
    var idx = chapterMeta.findIndex(function (m) { return m.id === ch.id; });
    if (idx >= 0) { ch.meta = chapterMeta[idx]; chapters[idx] = ch; }
    else chapters.push(ch);
    bus.emit('chapter:loaded', ch);
    return ch;
  }

  function loadChapter(id) {
    if (chapterById[id]) return Promise.resolve(chapterById[id]);
    return loadScript('data/' + id + '.js').then(function (ok) {
      return chapterById[id] || null;
    });
  }

  function loadAllChapters() {
    return Promise.all(chapterMeta.map(function (m) { return loadChapter(m.id); }));
  }

  function loadQuizPack() {
    if (quizPack) return Promise.resolve(quizPack);
    return loadScript('data/quiz.js').then(function () {
      return loadModules(['quiz']).then(function () {
        if (CSC.quiz && typeof CSC.quiz._ingest === 'function' && quizPack) {
          if (!CSC.quiz.all || !CSC.quiz.all.length) CSC.quiz._ingest(quizPack);
        }
        return quizPack;
      });
    });
  }

  function loadExams() {
    if (exams.length) return Promise.resolve(exams);
    return loadScript('data/exam.js').then(function () {
      return loadModules(['exam']).then(function () {
        migrateExamLegacy(exams.map(function (e) { return e.id; }));
        if (CSC.exam && typeof CSC.exam._ingest === 'function') {
          var got = (CSC.exam._list && CSC.exam._list().length) || 0;
          if (!got) exams.forEach(function (e) { try { CSC.exam._ingest(e); } catch (err) {} });
        }
        return exams;
      });
    });
  }

  function registerQuizPack(pack) {
    quizPack = pack || { items: [] };
    (quizPack.items || []).forEach(function (q) { if (q.id) quizPack._byId = quizPack._byId || {}; if (q.id) quizPack._byId[q.id] = q; });
    bus.emit('quiz:ready', quizPack);
  }
  function registerExam(e) { exams.push(e); bus.emit('exam:ready', e); }
  function registerLabs(obj) {
    Object.keys(obj || {}).forEach(function (k) { labs[k] = obj[k]; });
    bus.emit('labs:ready');
    hydrateLabs();
  }

  /* ------------------------------------------------------------------ 项目实战 */
  /* data/projects.js 由 #/projects 按需加载；注册后缓存在 projectsData 里 */
  var projectsData = null;
  function loadProjects() {
    if (projectsData) return Promise.resolve(projectsData);
    return loadModules(['projects']).then(function () {
      return loadScript('data/projects.js').then(function () { return projectsData; });
    });
  }
  function registerProjects(list) {
    projectsData = Array.isArray(list) ? list : [];
    bus.emit('projects:ready', projectsData);
    return projectsData;
  }

  /* ------------------------------------------------------------------ 进阶轨道 */
  /* 4 个主题分别放在 data/adv-java.js / adv-concur.js / adv-fx.js / adv-py.js，
   * 由 #/advanced 按需并行加载；独立数组，不进入 chapterMeta / 主课程进度 / 航线图。 */
  var ADV_FILES = ['adv-java', 'adv-concur', 'adv-fx', 'adv-py'];
  var advancedData = [];
  var advancedLoading = null;
  function loadAdvanced() {
    if (advancedData.length >= ADV_FILES.length) return Promise.resolve(advancedData);
    if (advancedLoading) return advancedLoading;
    advancedLoading = Promise.all(ADV_FILES.map(function (f) {
      return loadScript('data/' + f + '.js');
    })).then(function () {
      advancedLoading = null;
      advancedData.sort(function (a, b) {
        return (Number(a.order) || 99) - (Number(b.order) || 99);
      });
      return advancedData;
    }, function () {
      advancedLoading = null;
      return advancedData;
    });
    return advancedLoading;
  }
  /* 兼容两种注册方式：registerAdvanced({...}) 与 registerAdvanced([{...}, {...}]) */
  function registerAdvanced(data) {
    if (!data) return null;
    if (!Array.isArray(advancedData)) advancedData = [];
    var list = Array.isArray(data) ? data : [data];
    var last = null;
    list.forEach(function (item) {
      if (!item || !item.id) return;
      var idx = -1;
      for (var i = 0; i < advancedData.length; i++) if (advancedData[i].id === item.id) idx = i;
      if (idx >= 0) advancedData[idx] = item;
      else advancedData.push(item);
      last = item;
      bus.emit('advanced:ready', item);
    });
    return last;
  }

  /* ------------------------------------------------------------------ 视图 */
  function setContent(node) {
    var c = qs('#content');
    c.innerHTML = '';
    if (node) c.appendChild(node);
    /* 重触发页面进场动画（否则同一元素再次渲染不会播放） */
    c.style.animation = 'none';
    void c.offsetWidth;
    c.style.animation = '';
    c.scrollTop = 0;
    window.scrollTo(0, 0);
    /* 更新返回顶部按钮状态 */
    var tt = qs('#toTop');
    if (tt) tt.classList.remove('on');
    /* 统一给当前视图加滚动进场 */
    setupReveal(c);
  }

  var VIEWS = {};

  /* 路由：视觉上先落四色幕布，再换内容；锚点跳转不转场 */
  var FIRST_ROUTE = true;
  var LAST_ROUTE_KEY = '';
  var curtainTimers = [];

  function prefersReducedMotion() {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  function route() {
    var raw = (location.hash || '#/').replace(/^#\/?/, '');
    var seg = raw.split(/[/?]/).filter(Boolean);
    var view = seg[0] || 'home';
    var arg = seg[1] || '';
    var arg2 = seg[2] || '';

    // 章节路由： #/ch03 或 #/ch03/<锚点>
    if (/^ch\d{2}$/.test(view)) {
      arg2 = arg; arg = view; view = 'ch';
    }

    var viewKey = view + '|' + arg;
    var anchorOnly = !FIRST_ROUTE && viewKey === LAST_ROUTE_KEY;
    var curtain = qs('#curtain');

    if (anchorOnly || FIRST_ROUTE || !curtain || prefersReducedMotion()) {
      applyRoute(view, arg, arg2, raw);
      return;
    }

    /* 幕布压屏 → 换内容 → 幕布退场（约 1 秒，不阻塞锚点滚动） */
    curtainTimers.forEach(clearTimeout);
    curtainTimers = [];
    curtain.classList.add('on', 'in');
    curtainTimers.push(setTimeout(function () {
      applyRoute(view, arg, arg2, raw);
      curtain.classList.remove('in');
      curtain.classList.add('out');
      curtainTimers.push(setTimeout(function () {
        curtain.classList.remove('on', 'out');
      }, 520));
    }, 460));
  }

  /* 文档标题随路由变化：浏览器标签页、历史记录、书签都能区分页面 */
  var PAGE_TITLES = {
    home: 'Java 程序设计实验 · Computational Laboratory Using Java',
    drill: '题目生成器 · CSC1004',
    labs: '交互实验室 · CSC1004',
    quiz: '题库 · CSC1004',
    exam: '模拟卷 · CSC1004',
    glossary: '术语表 · CSC1004',
    cheatsheet: '速查表 · CSC1004',
    map: '航线图 · CSC1004',
    debug: 'Debug 手册 · CSC1004',
    projects: '项目实战 · CSC1004',
    advanced: '进阶轨道 · CSC1004',
    about: '使用说明 · CSC1004'
  };

  function updateDocTitle(view, arg) {
    var t;
    if (view === 'ch') {
      var meta = null;
      (chapterMeta || []).some(function (m) { if (m.id === arg) { meta = m; return true; } return false; });
      t = (meta ? (meta.num + ' ' + meta.title) : (arg || '章节')) + ' · CSC1004';
    } else {
      t = PAGE_TITLES[view] || PAGE_TITLES.home;
    }
    if (document.title !== t) document.title = t;
  }

  /* 从 hash 里取查询串（#/quiz/ch05?tag=exam&random=1） */
  function parseHashQuery(raw) {
    var out = {};
    var i = String(raw == null ? '' : raw).indexOf('?');
    if (i < 0) return out;
    String(raw).slice(i + 1).split('&').forEach(function (kv) {
      if (!kv) return;
      var p = kv.split('=');
      try { out[decodeURIComponent(p[0])] = decodeURIComponent(p[1] == null ? '' : p[1]); }
      catch (e) { out[p[0]] = p[1] || ''; }
    });
    return out;
  }

  function applyRoute(view, arg, arg2, raw) {
    /* 切页前先停掉首页太阳系的 resize 监听 */
    if (window.CSC._homeStop) { try { window.CSC._homeStop(); } catch (e) {} }
    FIRST_ROUTE = false;
    LAST_ROUTE_KEY = view + '|' + arg;
    CSC.current = { view: view, id: arg, sub: arg2 };
    document.documentElement.setAttribute('data-view', view);
    updateNavActive(view, arg);
    updateModTag(view, arg);
    closeSidebar();
    hideResults();
    /* 切页时收起弹窗（随机挑战 / 快捷键说明等），避免浮层跨页残留 */
    var modalEl = qs('#modal');
    if (modalEl && !modalEl.hidden) {
      modalEl.hidden = true;
      modalEl.innerHTML = '';
      modalEl.removeAttribute('aria-labelledby');
    }
    qs('#rail').innerHTML = '';

    if (VIEWS[view]) VIEWS[view](arg, arg2, raw);
    else VIEWS.home();
    updateDocTitle(view, arg);
    if (window.innerWidth < 860) window.scrollTo(0, 0);
  }
  /* ==================================================================
   * 首页 · 课程世界星图（WORLD CHART）
   * 7 个 Part = 7 个星区；21 颗行星 = 21 章。
   * 行星由章节数据生成：大小 ∝ 课时；卫星数 = 实验台数量；
   * 纹理 = 10 种程序化世界风格；大气辉光 = Part 色；
   * 每颗行星下方垂下入口节点树（章节 / 实验台 / 题库）。
   * ================================================================== */

  /* 10 种世界风格（CSS 侧按 class 绘制纹理） */
  var WORLD_TYPES = {
    rocky: { label: 'ROCKY', ring: 0 },
    ocean: { label: 'OCEANIC', ring: 0 },
    desert: { label: 'DESERT', ring: 0 },
    ice: { label: 'ICE', ring: 0 },
    ringed: { label: 'RINGED', ring: 1 },
    aurora: { label: 'AURORA', ring: 0 },
    gas: { label: 'GAS GIANT', ring: 1 },
    storm: { label: 'STORM', ring: 0 },
    lava: { label: 'LAVA', ring: 0 },
    icegiant: { label: 'ICE GIANT', ring: 1 }
  };

  /* 21 章 → 世界风格（按章节主题挑选，固定不变） */
  var WORLD_MAP = [
    'rocky',     /* ch00 总览与学习路线 */
    'ocean',     /* ch01 实验环境 */
    'aurora',    /* ch02 AI 辅助编程 */
    'desert',    /* ch03 类与对象 */
    'storm',     /* ch04 继承与多态 */
    'gas',       /* ch05 Lambda */
    'ice',       /* ch06 I/O 与流 */
    'ringed',    /* ch07 Socket */
    'lava',      /* ch08 多线程 */
    'ocean',     /* ch09 JavaFX 基础 */
    'gas',       /* ch10 控件与布局 */
    'ringed',    /* ch11 2D 图形与 Canvas */
    'aurora',    /* ch12 事件处理 */
    'storm',     /* ch13 聊天室项目 */
    'lava',      /* ch14 五子棋项目 */
    'ocean',     /* ch15 Python 基础 */
    'desert',    /* ch16 Python 类 */
    'gas',       /* ch17 Tkinter */
    'icegiant',  /* ch18 Snake 项目 */
    'aurora',    /* ch19 机器学习入门 */
    'icegiant'   /* ch20 期末备考 */
  ];

  var PART_COLORS = { I: '#d7ab61', II: '#e06236', III: '#9fc0e2', IV: '#c82337', V: '#4fb3a8', VI: '#7fb069', VII: '#9b8ac4' };
  var PART_SOFT = {
    I: 'rgba(215, 171, 97, .07)',
    II: 'rgba(224, 98, 54, .06)',
    III: 'rgba(159, 192, 226, .06)',
    IV: 'rgba(200, 35, 55, .06)',
    V: 'rgba(79, 179, 168, .06)',
    VI: 'rgba(127, 176, 105, .06)',
    VII: 'rgba(155, 138, 196, .06)'
  };

  /* 行星大小 ∝ 课时（22–48 min → 34–64px） */
  function worldSize(m) {
    var mins = Math.min(48, Math.max(22, m.minutes || 30));
    return Math.round(38 + (mins - 22) / 26 * 28);
  }

  VIEWS.home = function () {
    var firstCh = chapterMeta.length ? chapterMeta[0] : null;
    var startHref = firstCh ? '#/' + firstCh.id : '#/';
    var root = el('div', { class: 'home' });
    var stage = el('section', { class: 'starStage' });

    /* 背景细网格 */
    stage.appendChild(el('div', { class: 'solarGrid' }));

    /* ---------- 世界星图 ---------- */
    var system = el('div', { class: 'solarSystem', id: 'solarSystem' });

    /* 左侧核心恒星：点击 = 随机挑战 */
    system.appendChild(el('button', {
      class: 'sunCore', id: 'sunCore', type: 'button',
      title: SITE_SHORT + ' // CORE · 点击随机挑战（快捷键 R）',
      'aria-label': SITE_SHORT + ' 核心，点击随机挑战'
    }, [
      el('span', { class: 'sunGlow' }),
      el('span', { class: 'sunBody' }, [el('span', { class: 'sunTexture' })]),
      el('span', { class: 'sunCorona' })
    ]));

    /* 轴线 + 星区层 + 星尘 */
    system.appendChild(el('div', { class: 'solarAxis', id: 'solarAxis' }));
    system.appendChild(el('div', { class: 'partLayer', id: 'partLayer' }));
    system.appendChild(el('div', { class: 'asteroidBelt', id: 'asteroidBelt' }));

    /* 14 颗行星 + 入口节点树 */
    chapterMeta.forEach(function (m, idx) {
      var typeKey = WORLD_MAP[idx] || 'rocky';
      var world = WORLD_TYPES[typeKey] || WORLD_TYPES.rocky;
      var roman = ((m.part || '').match(/Part ([IVX]+)/) || [])[1] || 'I';
      var partColor = PART_COLORS[roman] || '#9fc0e2';
      var labs = m.labs || 0;
      var size = worldSize(m);

      var nodes = el('span', { class: 'pNodes' });
      nodes.appendChild(el('a', {
        class: 'pNode pnMain', href: '#/' + m.id,
        'aria-label': '进入 ' + m.title, title: 'MOD ' + m.num + ' ' + m.title
      }, [
        el('span', { class: 'pnNum', text: m.num }),
        el('span', { class: 'pnTip', text: 'MOD ' + m.num })
      ]));
      if (labs > 0) {
        nodes.appendChild(el('a', {
          class: 'pNode pnLab', href: '#/labs',
          'aria-label': '打开 ' + m.title + ' 相关实验台', title: 'LAB // 实验台'
        }, [
          el('span', { html: icon('flask') }),
          el('span', { class: 'pnTip', text: 'LAB' })
        ]));
      }
      nodes.appendChild(el('a', {
        class: 'pNode pnQuiz', href: '#/quiz/' + m.id,
        'aria-label': '打开 ' + m.title + ' 题库', title: 'QUIZ // 题库'
      }, [
        el('span', { html: icon('target') }),
        el('span', { class: 'pnTip', text: 'QUIZ' })
      ]));

      var label = el('span', {
        class: 'planetLabel',
        html: m.title + '<span class="plEn">' + esc(m.en || '') + '</span>'
      });

      var kids = [
        el('span', { class: 'planet pl--' + typeKey }, [
          el('span', { class: 'planetTexture' })
        ])
      ];
      if (world.ring) {
        kids.push(el('span', { class: 'ringBack' }));
        kids.push(el('span', { class: 'ringFront' }));
      }
      kids.push(label);

      var wrap = el('div', {
        class: 'planetWrap',
        dataset: { idx: String(idx), type: typeKey, part: roman },
        style: '--i:' + idx + ';--part:' + partColor + ';--part-soft:' + (PART_SOFT[roman] || PART_SOFT.I)
      }, [
        el('a', {
          class: 'planetLink', href: '#/' + m.id,
          'aria-label': 'MOD ' + m.num + ' ' + m.title + '（' + world.label + '）'
        }, kids),
        nodes
      ]);
      system.appendChild(wrap);
    });

    stage.appendChild(system);

    /* ---------- 左：任务简报 ---------- */
    stage.appendChild(el('div', { class: 'missionDock' }, [
      el('div', { class: 'dockKicker' }, [
        el('span', { class: 'sq' }),
        el('span', { text: 'MISSION_BRIEF // ' + (SITE.id ? SITE.id.toUpperCase() : 'CSC1004') })
      ]),
      el('h1', { class: 'missionT', html: '把课堂<br><em>写成实验</em>' }),
      el('div', { class: 'missionEn', text: SITE.missionEn || 'COMPUTATIONAL LABORATORY USING JAVA' }),
      el('p', {
        class: 'missionLede',
        html: SITE.lede || '21 个任务模块：从一个 Java 类，到一个能聊天的服务器、一盘能下的五子棋、一条能动的蛇。'
      }),
      el('div', { class: 'missionBtns' }, [
        el('a', {
          class: 'btnPrimary',
          href: startHref,
          title: '从第 0 章开始：' + (firstCh ? firstCh.title : '总览与学习路线'),
          html: '<span>▶</span><span>开始学习</span>'
        }),
        el('a', { class: 'btnGhost', href: '#/labs', html: '<span>交互实验台</span>' }),
        el('a', { class: 'btnGhost', href: '#/projects', html: '<span>项目实战</span>' }),
        el('a', { class: 'btnGhost', href: '#/advanced', html: '<span>进阶轨道</span>' }),
        el('a', { class: 'btnGhost', href: '#/exam', html: '<span>模拟卷</span>' }),
        el('a', { class: 'btnGhost', href: '#/drill', html: '<span>题目生成器</span>' }),
        el('button', {
          class: 'btnGhost', type: 'button', title: '随机抽一道题（快捷键 R）',
          html: '<span>随机挑战</span>',
          'on:click': function () { randomChallenge(); }
        })
      ])
    ]));

    /* ---------- 右：系统读数 dock ---------- */
    var sysTerm = el('div', { class: 'termOut', id: 'homeTerm' });
    /* 读数尽量用数据算，避免硬编码与章节清单脱节 */
    var labTotal = 0;
    chapterMeta.forEach(function (m) { labTotal += (Number(m.labs) || 0); });
    var partTotal = {};
    chapterMeta.forEach(function (m) { partTotal[m.part] = 1; });
    stage.appendChild(el('div', { class: 'systemDock' }, [
      el('div', { class: 'dockTitle', html: 'SYSTEM : <b>' + esc(SITE.id ? SITE.id.toUpperCase() : 'CSC1004') + '</b>' }),
      el('div', {
        class: 'dockSub',
        html: 'SECTOR: <b>LAB</b> // LANG: <b>' + esc(SITE_LABEL) + '</b> // WORLDS: <b>' + chapterMeta.length + '</b>'
      }),
      el('div', { class: 'dockRows' }, [
        el('div', { html: '&gt; SYSTEM_OVERVIEW: <span class="hl">COMPUTATIONAL LAB</span>' }),
        el('div', { html: '&gt; CORE: <b>JAVA</b> // SECOND: <b>PYTHON</b>' }),
        el('div', { html: '&gt; WORLDS: <b>' + chapterMeta.length + '</b> // PARTS: <b>' + String(Object.keys(partTotal).length).padStart(2, '0') + '</b>' }),
        el('div', { html: '&gt; PROJECTS: <b>03</b> // LABS: <b>' + labTotal + '</b> // EXAMS: <b>03</b>' }),
        el('div', { class: 'sysTerm' }, [sysTerm])
      ])
    ]));

    /* ---------- Part 图例 ---------- */
    var partRows = [];
    var byPart = {};
    var partOrder = [];
    chapterMeta.forEach(function (m) {
      if (!byPart[m.part]) { byPart[m.part] = []; partOrder.push(m.part); }
      byPart[m.part].push(m);
    });
    partOrder.forEach(function (pname, gi) {
      var roman = (pname.match(/Part ([IVX]+)/) || [])[1] || String(gi + 1);
      var list = byPart[pname];
      var range = list.length > 1 ? (list[0].num + '–' + list[list.length - 1].num) : (list[0] && list[0].num || '');
      partRows.push(el('div', { class: 'olRow' }, [
        el('span', { class: 'olDot', style: 'background:' + (PART_COLORS[roman] || '#9fc0e2') }),
        el('span', { class: 'olCode', text: 'PART ' + roman }),
        el('span', { class: 'olPart', text: range }),
        el('span', { class: 'olName', text: pname.replace(/^Part\s+[IVX]+\s*·\s*/, '') })
      ]));
    });
    stage.appendChild(el('div', { class: 'orbitLegend' }, [
      el('div', { class: 'olHead', text: 'PART_INDEX' })
    ].concat(partRows).concat([
      el('div', { class: 'olHint', text: 'SIZE ∝ RUNTIME // PART = GLOW' })
    ])));

    /* ---------- 底部：FOV 缩放 ---------- */
    var fovTicks = el('div', { class: 'fovTicks' });
    for (var t = 0; t <= 20; t++) fovTicks.appendChild(el('i'));
    stage.appendChild(el('div', { class: 'bottomHud' }, [
      el('div', { class: 'fovWrap' }, [
        el('div', { class: 'fovLabel' }, [
          el('span', { text: 'FOV_SCALE // ' }),
          el('span', { class: 'fovVal', id: 'fovVal', text: '100%' })
        ]),
        el('input', {
          class: 'fovSlider', id: 'fovSlider', type: 'range',
          min: '0', max: '100', value: '50', 'aria-label': '世界星图缩放'
        }),
        fovTicks
      ])
    ]));

    stage.appendChild(el('div', {
      class: 'stageHint',
      html: '&gt; HOVER: WORLD_DATA<br>&gt; CLICK: OPEN MODULE<br>&gt; FOV: SYSTEM ZOOM'
    }));

    /* ---------- 移动端纵向模块索引 ---------- */
    var mi = el('div', { class: 'moduleIndex' }, [
      el('div', { class: 'miHead' }, [
        el('span', { text: 'MODULE INDEX // ' + String(chapterMeta.length).padStart(2, '0') }),
        el('span', { text: 'TAP TO OPEN' })
      ])
    ]);
    chapterMeta.forEach(function (m) {
      var roman = ((m.part || '').match(/Part ([IVX]+)/) || [])[1] || 'I';
      mi.appendChild(el('a', { class: 'miRow', href: '#/' + m.id }, [
        el('span', { class: 'miNum', text: m.num }),
        el('span', { class: 'miMain' }, [
          el('span', { class: 'miT', text: m.title }),
          el('span', { class: 'miE', text: m.en || '' })
        ]),
        el('span', { class: 'miPart', text: 'PART ' + roman }),
        el('span', { class: 'miArrow', text: '›' })
      ]));
    });
    stage.appendChild(mi);

    root.appendChild(stage);
    setContent(root);
    mountHomeStage(root);
  };

  /* 首页世界星图：布局（含 Part 星区）+ 悬停读数 + FOV */
  function mountHomeStage(root) {
    var stage = qs('.starStage', root);
    var system = qs('#solarSystem', root);
    var sun = qs('#sunCore', root);
    var axis = qs('#solarAxis', root);
    var partLayer = qs('#partLayer', root);
    var belt = qs('#asteroidBelt', root);
    var slider = qs('#fovSlider', root);
    var valEl = qs('#fovVal', root);
    var termEl = qs('#homeTerm', root);
    var wraps = qsa('.planetWrap', root);
    if (!stage || !system || !wraps.length) return;

    var reduced = prefersReducedMotion();

    /* ---------- 终端读数 ---------- */
    var term = null;
    if (termEl && window.CSC_OBS && CSC_OBS.runTerminal) {
      try { term = CSC_OBS.runTerminal(termEl, { speed: 9 }); } catch (e) { term = null; }
    }
    function say(text) {
      if (term) { term.type(text); return; }
      if (!termEl) return;
      termEl.innerHTML = '';
      var i = 0;
      var timer = setInterval(function () {
        if (i >= text.length) {
          clearInterval(timer);
          termEl.innerHTML += '<span class="cursor">▌</span>';
          return;
        }
        termEl.textContent += text.charAt(i++);
      }, 9);
    }

    /* ---------- Part 分组 ---------- */
    var groups = [];
    var byPart = {};
    chapterMeta.forEach(function (m) {
      if (!byPart[m.part]) { byPart[m.part] = { part: m.part, list: [] }; groups.push(byPart[m.part]); }
      byPart[m.part].list.push(m);
    });
    groups.forEach(function (g) {
      g.roman = (g.part.match(/Part ([IVX]+)/) || [])[1] || 'I';
      g.start = chapterMeta.indexOf(g.list[0]);
      g.end = chapterMeta.indexOf(g.list[g.list.length - 1]);
      g.name = g.part.replace(/^Part\s+[IVX]+\s*·\s*/, '');
    });

    /* ---------- 布局 ---------- */
    var layoutCache = { x: [], sunX: 0, axisY: 0, sunD: 0, width: 0, fields: [] };

    function clearChildren(node) {
      while (node && node.firstChild) node.removeChild(node.firstChild);
    }

    function buildTicks() {
      clearChildren(axis);
      for (var i = 0; i < layoutCache.x.length - 1; i++) {
        var mid = (layoutCache.x[i] + layoutCache.x[i + 1]) / 2;
        var tick = el('span', { class: 'axisTick' });
        tick.style.left = (mid - layoutCache.sunX).toFixed(1) + 'px';
        tick.style.top = '0px';
        axis.appendChild(tick);
      }
      for (var k = 0; k < layoutCache.x.length; k++) {
        var dot = el('span', { class: 'axisTick' });
        dot.style.left = (layoutCache.x[k] - layoutCache.sunX).toFixed(1) + 'px';
        dot.style.top = '0px';
        dot.style.height = '2px';
        dot.style.opacity = '.55';
        axis.appendChild(dot);
      }
    }

    function buildBelt() {
      clearChildren(belt);
      /* 星尘：在 Part 分隔处撒点 */
      for (var gi = 1; gi < layoutCache.fields.length; gi++) {
        var prev = layoutCache.fields[gi - 1];
        var cur = layoutCache.fields[gi];
        var cx = (prev.end + cur.start) / 2;
        for (var i = 0; i < 12; i++) {
          var dot = el('span', { class: 'beltDot' });
          dot.style.left = (cx + (Math.random() * 40 - 20)).toFixed(1) + 'px';
          dot.style.top = (layoutCache.axisY + (Math.random() * 22 - 11)).toFixed(1) + 'px';
          belt.appendChild(dot);
        }
      }
    }

    function buildPartLayer() {
      if (!partLayer) return;
      clearChildren(partLayer);
      layoutCache.fields.forEach(function (f, gi) {
        var prev = layoutCache.fields[gi - 1];
        var startX = f.start - 12;
        var width = (f.end - f.start) + 24;

        var field = el('div', { class: 'partField' });
        field.style.left = startX.toFixed(1) + 'px';
        field.style.width = Math.max(40, width).toFixed(1) + 'px';
        field.style.top = (layoutCache.axisY - 140) + 'px';
        field.style.height = '400px';
        field.style.setProperty('--part-soft', PART_SOFT[f.roman] || PART_SOFT.I);
        partLayer.appendChild(field);

        /* 分区标签（PART I/II…）已移除：它会与任务简报的按钮区重叠，
         * 且信息与左下角 PART_INDEX 图例重复（v1.7.2）。 */

        if (prev) {
          var div = el('div', { class: 'partDivider' });
          div.style.left = ((prev.end + f.start) / 2).toFixed(1) + 'px';
          div.style.top = (layoutCache.axisY - 96) + 'px';
          div.style.height = '360px';
          partLayer.appendChild(div);
        }
      });
    }

    function layout() {
      var W = stage.clientWidth;
      var H = stage.clientHeight;
      if (!W || !H) return;

      var n = wraps.length;
      var sizes = chapterMeta.map(function (m) { return worldSize(m); });
      var sumSizes = sizes.slice(0, n).reduce(function (a, b) { return a + b; }, 0);

      var sunD = Math.round(Math.min(W * 0.12, H * 0.18));
      var axisY = Math.round(H * 0.55);
      var sunX = 44 + sunD / 2; /* 右移 10px：让太阳光晕完整落在舞台内（v1.7.9） */
      var x0 = 34 + sunD + 34;
      var x1 = W - 40;
      var avail = x1 - x0;

      /* 间距随视口增大，避免行星与节点树挤在一起 */
      var gapIn = Math.max(18, W * 0.018);
      var gapPart = Math.max(46, W * 0.042);
      var total = sumSizes + (n - groups.length) * gapIn + (groups.length - 1) * gapPart;
      var scale = Math.min(1, avail / total);
      if (!isFinite(scale) || scale <= 0) scale = 0.5;
      var gapI = gapIn * scale;
      var gapP = gapPart * scale;

      layoutCache = { x: [], sunX: sunX, axisY: axisY, sunD: sunD, width: W, fields: [] };

      var cursor = x0;
      var pos = [];
      groups.forEach(function (g, gi) {
        if (gi > 0) cursor += gapP;
        var start = cursor;
        g.list.forEach(function (m, i) {
          var idx = chapterMeta.indexOf(m);
          var d = Math.max(16, Math.round(sizes[idx] * scale));
          var cx = cursor + d / 2;
          cursor += d + (i < g.list.length - 1 ? gapI : 0);
          pos[idx] = { cx: cx, d: d };
        });
        layoutCache.fields.push({ roman: g.roman, name: g.name, list: g.list, start: start, end: cursor });
      });

      if (sun) {
        sun.style.setProperty('--size', sunD + 'px');
        /* 太阳中心到舞台左边缘的距离：光晕据此把半径收在舞台内，避免左侧被 overflow:hidden 裁成直线 */
        sun.style.setProperty('--sun-x', sunX.toFixed(1) + 'px');
        sun.style.width = sunD + 'px';
        sun.style.height = sunD + 'px';
        sun.style.marginLeft = (sunD / -2) + 'px';
        sun.style.marginTop = (sunD / -2) + 'px';
        sun.style.transform = 'translate3d(' + sunX.toFixed(1) + 'px,' + axisY + 'px,0)';
      }

      wraps.forEach(function (w, idx) {
        var p = pos[idx];
        if (!p) return;
        layoutCache.x.push(p.cx);
        w.style.setProperty('--size', p.d + 'px');
        w.style.width = p.d + 'px';
        w.style.height = p.d + 'px';
        w.style.marginLeft = (p.d / -2) + 'px';
        w.style.marginTop = (p.d / -2) + 'px';
        w.style.transform = 'translate3d(' + p.cx.toFixed(1) + 'px,' + axisY + 'px,0)';
      });

      if (axis) {
        axis.style.left = sunX.toFixed(1) + 'px';
        axis.style.top = axisY + 'px';
        axis.style.width = Math.max(0, (W - 40) - sunX).toFixed(1) + 'px';
      }

      system.style.setProperty('--cx', (W / 2).toFixed(1) + 'px');
      system.style.setProperty('--cy', axisY + 'px');

      buildTicks();
      buildPartLayer();
      buildBelt();
    }

    /* ---------- 悬停 / 焦点读数 ---------- */
    function reading(m, idx) {
      var typeKey = WORLD_MAP[idx] || 'rocky';
      var world = WORLD_TYPES[typeKey] || WORLD_TYPES.rocky;
      var roman = ((m.part || '').match(/Part ([IVX]+)/) || [])[1] || 'I';
      return '> TARGET: MOD-' + m.num + ' [' + m.title + ']\n'
        + '> WORLD: ' + world.label + ' // PART_' + roman + '\n'
        + '> CLASS: ' + String(m.en || '').toUpperCase() + '\n'
        + '> RUNTIME: ' + (m.minutes || 30) + ' MIN // LAB: ' + String(m.labs || 0).padStart(2, '0') + '\n'
        + '> STATUS: ONLINE';
    }

    wraps.forEach(function (w, idx) {
      var m = chapterMeta[idx];
      if (!m) return;
      var link = qs('.planetLink', w);
      function enter() {
        w.classList.add('hot');
        say(reading(m, idx));
      }
      function leave() { w.classList.remove('hot'); }
      w.addEventListener('mouseenter', enter);
      w.addEventListener('mouseleave', leave);
      if (link) {
        link.addEventListener('focus', enter);
        link.addEventListener('blur', leave);
      }
    });

    if (sun) {
      sun.addEventListener('click', function () { randomChallenge(); });
      sun.addEventListener('mouseenter', function () {
        say('> CORE: ' + SITE_SHORT + ' [' + String(SITE.id || 'CSC1004').toUpperCase() + ']\n> SYSTEM: ' + chapterMeta.length + ' WORLDS // ' + partCount() + ' PARTS\n> CLICK: RANDOM CHALLENGE');
      });
      sun.addEventListener('mouseleave', function () {
        say('> SYSTEM READY...' + NL + '> ' + chapterMeta.length + ' WORLDS ONLINE' + NL + '> SELECT TARGET');
      });
    }

    /* ---------- FOV：整图缩放 ---------- */
    function applyFov() {
      var raw = slider ? parseFloat(slider.value) : 50;
      var scale = 0.88 + (raw / 100) * 0.24;
      system.style.setProperty('--sys-scale', scale.toFixed(3));
      if (valEl) valEl.textContent = Math.round(scale * 100) + '%';
    }
    if (slider) {
      slider.addEventListener('input', applyFov);
      applyFov();
    }

    /* ---------- 尺寸 / 销毁 ---------- */
    function onResize() { layout(); }
    window.addEventListener('resize', debounce(onResize, 160));
    var destroyed = false;
    window.CSC._homeStop = function () {
      if (destroyed) return;
      destroyed = true;
      window.removeEventListener('resize', onResize);
      window.CSC._homeStop = null;
    };

    layout();
    setTimeout(function () {
      say('> SYSTEM READY...' + NL + '> ' + partCount() + ' PARTS // ' + chapterMeta.length + ' WORLDS' + NL + '> SELECT TARGET');
    }, 140);
  }

  /* 页面头：与章节页同一套观测站版式（面包屑 + 读数 + 细线 + 单行简介） */
  function pageHead(opts) {
    opts = opts || {};
    var head = el('header', { class: 'chHead pageHead' }, [
      el('div', { class: 'chTop' }, [
        el('div', { class: 'chCrumbs', html: opts.crumb || '<a href="#/">OVERVIEW</a>' }),
        el('div', { class: 'chSeq', text: opts.seq || (SITE_SHORT + ' // OBSERVATORY') })
      ]),
      el('div', { class: 'chKicker', text: opts.kicker || ('SYSTEM_BRIEF // ' + SITE_SHORT) }),
      el('h1', { class: 'chTitle', text: opts.title || '' }),
      opts.en ? el('div', { class: 'chEn', text: opts.en }) : null,
      (opts.meta && opts.meta.length) ? el('div', { class: 'chMeta' }, opts.meta.map(function (r) {
        return metaItem(r[0], r[1]);
      })) : null
    ]);
    if (opts.lead) head.appendChild(el('p', { class: 'pageLead', html: opts.lead }));
    return head;
  }

  /* 仪表读数小格（章节页用） */
  function metaItem(k, vHtml) {
    return el('div', { class: 'metaItem' }, [
      el('span', { class: 'metaK', text: k }),
      el('span', { class: 'metaV', html: vHtml })
    ]);
  }
  function statCard(v, l, cls) {
    var sv = el('div', { class: 'sv', text: v });
    var card = el('div', { class: 'statCard ' + (cls || '') }, [
      sv,
      el('div', { class: 'sl', text: l })
    ]);
    if (/^\d+$/.test(String(v))) {
      card._countTo = parseInt(v, 10);
      card._countEl = sv;
    }
    return card;
  }

  /* 数字从 0 滚动到目标值（仪表读数感） */
  function animateCounters(scope) {
    qsa('.statCard', scope).forEach(function (card) {
      if (card._counted || card._countTo == null || !card._countEl) return;
      card._counted = true;
      var target = card._countTo;
      var node = card._countEl;
      var pad = String(node.textContent).length;
      var dur = 680;
      var t0 = 0;
      function step(ts) {
        if (!t0) t0 = ts;
        var p = Math.min(1, (ts - t0) / dur);
        var eased = 1 - Math.pow(1 - p, 3);
        var val = Math.round(target * eased);
        node.textContent = pad > 1 && target < 100 ? String(val).padStart(pad, '0') : String(val);
        if (p < 1) requestAnimationFrame(step);
        else node.textContent = pad > 1 && target < 100 ? String(target).padStart(pad, '0') : String(target);
      }
      requestAnimationFrame(step);
    });
  }
  function howCard(ic, t, d) {
    return el('div', { class: 'howCard' }, [
      el('div', { class: 'hi', html: icon(ic) }),
      el('b', { text: t }),
      el('span', { html: d })
    ]);
  }
  function tableFromPairs(pairs, caption) {
    var tw = el('div');
    var tb = el('table');
    pairs.forEach(function (p) {
      var tr = el('tr');
      tr.appendChild(el('th', { html: p[0], style: 'width:132px' }));
      tr.appendChild(el('td', { html: p[1] }));
      tb.appendChild(tr);
    });
    tw.appendChild(tb);
    if (caption) tw.appendChild(el('div', { class: 'cap', html: caption }));
    return tw;
  }

  /* 章节视图 */
  VIEWS.ch = function (id, anchor) {
    var meta = chapterMeta.find(function (m) { return m.id === id; });
    var root = el('div');
    root.appendChild(el('div', { class: 'bootSplash' }, [el('div', { class: 'bootIn' }, [
      el('span', { class: 'bootMark', text: '{ }' }),
      el('span', { class: 'bootTxt', text: '正在装载第 ' + (meta ? meta.num : '?') + ' 章…' })
    ])]));
    setContent(root);

    Promise.all([loadChapter(id), loadModules(['engine', 'editor'])]).then(function (res) {
      var ch = res[0];
      if (!ch) {
        setContent(el('div', { class: 'emptyState' }, [
          el('div', { class: 'ei', text: '{ }' }),
          el('h3', { text: '这一章还没准备好' }),
          el('p', { text: '可能是内容文件缺失。回到总览选择其他章节。' })
        ]));
        return;
      }
      CURR_CTX = { chapter: ch };
      pendingLabs = []; pendingQuiz = [];
      var wrap = el('article', { class: 'chapter' });

      // 头部
      var idx = chapterMeta.findIndex(function (m) { return m.id === id; });
      var prev = idx > 0 ? chapterMeta[idx - 1] : null;
      var next = idx >= 0 && idx < chapterMeta.length - 1 ? chapterMeta[idx + 1] : null;
      var partName = (ch.meta && ch.meta.part) || '';
      var partRoman = (partName.match(/Part ([IVX]+)/) || [])[1] || '—';
      var interactive = (ch.blocks || []).filter(function (b) {
        return b.t === 'lab' || b.t === 'code' || b.t === 'memory';
      }).length;
      var head = el('header', { class: 'chHead' }, [
        el('div', { class: 'chTop' }, [
          el('div', {
            class: 'chCrumbs',
            html: '<a href="#/">OVERVIEW</a><span>/</span><span>' + esc(partName) + '</span><span>/</span><span>MOD_' + ch.num + '</span>'
          }),
          el('div', {
            class: 'chSeq',
            text: 'MODULE ' + ch.num + ' / ' + String(chapterMeta.length).padStart(2, '0')
          })
        ]),
        el('div', { class: 'chKicker', text: 'CHAPTER_BRIEF // ' + String(ch.en || '').toUpperCase() }),
        el('h1', { class: 'chTitle', text: ch.title }),
        el('div', { class: 'chEn', text: ch.en }),
        el('div', { class: 'chMeta' }, [
          metaItem('RUNTIME', (ch.meta && ch.meta.minutes ? ch.meta.minutes : 30) + ' MIN'),
          metaItem('KNOWLEDGE', String((ch.kp || []).length).padStart(2, '0')),
          metaItem('INTERACTIVE', String(interactive).padStart(2, '0')),
          metaItem('PART', partRoman)
        ])
      ]);
      head.appendChild(el('span', { class: 'chWatermark', text: ch.num }));
      if (ch.goals && ch.goals.length) {
        var goals = el('div', { class: 'goalsBox' }, [
          el('h4', { text: 'MISSION OBJECTIVES // 学完这一章，你应该能' })
        ]);
        var ul = el('ul');
        ch.goals.forEach(function (g) { ul.appendChild(el('li', { html: g })); });
        goals.appendChild(ul);
        head.appendChild(goals);
      }
      wrap.appendChild(head);
      // 章节视觉影像（可选：assets/img/<chId>.webp 存在时才显示）
      (function () {
        var fig = el('figure', { class: 'chHero' });
        var img = el('img', { src: 'assets/img/' + id + '.webp', alt: '', loading: 'lazy', decoding: 'async' });
        img.addEventListener('error', function () { fig.remove(); });
        fig.appendChild(img);
        fig.appendChild(el('figcaption', {
          html: '<b>IMG.' + String(ch.num).padStart(2, '0') + '</b><span>// ' + esc(ch.en || '') + '</span><em>VISUAL REFERENCE</em>'
        }));
        wrap.appendChild(fig);
      })();


      /* 本章若所有代码块都标记 run:false，明确提示需要本地环境运行（§7） */
      var codeStats = { total: 0, runnable: 0 };
      (function walkCode(node) {
        if (!node || typeof node !== 'object') return;
        if (Object.prototype.toString.call(node) === '[object Array]') { node.forEach(walkCode); return; }
        if (node.t === 'code') { codeStats.total++; if (node.run !== false) codeStats.runnable++; }
        else if (typeof node.code === 'string' && node.label != null) { codeStats.total++; if (node.run !== false) codeStats.runnable++; }
        Object.keys(node).forEach(function (k) { if (k !== 'code') walkCode(node[k]); });
      })(ch.blocks);
      if (/^ch(0[5-9]|1[0-9]|20)$/.test(id) && codeStats.total && !codeStats.runnable) {
        var envLabel = /^ch1[5-9]$/.test(id) ? 'Python（如 PyCharm / VS Code）' : 'JDK（如 IntelliJ IDEA）';
        wrap.appendChild(el('div', { class: 'callout warn' }, [
          el('div', { class: 'ct', html: icon('warning') + '<span>本章代码需在本地运行</span>' }),
          el('div', {
            class: 'cb',
            html: '<p>本章示例涉及 I/O、Socket、多线程、JavaFX 或 Python 等站内不执行的内容，'
              + '<b>需复制到本地 ' + esc(envLabel) + ' 环境运行，站内不执行</b>；'
              + '本站只展示代码与讲解，不执行、也不预生成运行结果。</p>'
          })
        ]));
      }

      // 正文
      var anchors = [];
      renderBlocks(wrap, ch.blocks, { chapter: ch, anchors: anchors });

      // 章节底部：只保留上一章 / 下一章导航（本站不记录章节完成状态）

      var navRow = el('div', { class: 'chNav' });
      if (prev) navRow.appendChild(el('a', { class: 'chNavA', href: '#/' + prev.id }, [el('div', { class: 'd', text: '← 上一章' }), el('div', { class: 't', text: prev.num + ' ' + prev.title })]));
      else navRow.appendChild(el('div', { class: 'chNavA disabled' }, [el('div', { class: 'd', text: '← 上一章' }), el('div', { class: 't', text: '已经是第一章' })]));
      if (next) {
        navRow.appendChild(el('a', { class: 'chNavA next', href: '#/' + next.id }, [el('div', { class: 'd', text: '下一章 →' }), el('div', { class: 't', text: next.num + ' ' + next.title })]));
      } else navRow.appendChild(el('div', { class: 'chNavA next disabled' }, [el('div', { class: 'd', text: '下一章 →' }), el('div', { class: 't', text: '已经是最后一章' })]));
      wrap.appendChild(navRow);

      setContent(wrap);
      buildRail(ch, anchors);
      setupScrollSpy();
      hydrateLabs(wrap);
      hydrateMemory(wrap);

      // 异步补全交互组件
      loadModules(['viz', 'labs']).then(function () { hydrateLabs(wrap); });
      loadQuizPack().then(function () { hydrateQuiz(wrap); });
      setupReveal(wrap);

      // 锚点定位
      if (anchor) {
        var target = document.getElementById(anchor);
        if (target) setTimeout(function () { target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 120);
      }
    });
  };



  /* 右侧本章目录 */
  function buildRail(ch, anchors) {
    var rail = qs('#rail');
    rail.innerHTML = '';
    if (!anchors.length) return;
    rail.appendChild(el('div', { class: 'railTitle', text: '本章目录' }));
    var nav2 = el('div', { class: 'railNav' });
    anchors.forEach(function (a) {
      var link = el('a', { class: 'railLink' + (a.lvl > 2 ? ' h3' : ''), href: '#' + a.id, text: a.text });
      link.addEventListener('click', function (e) {
        e.preventDefault();
        var t = document.getElementById(a.id);
        if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      nav2.appendChild(link);
    });
    rail.appendChild(nav2);

    var card = el('div', { class: 'railCard2' });
    var kp = ch.kp || [];
    if (kp.length) {
      card.appendChild(el('b', { text: '知识点' }));
      var kl = el('div');
      kp.forEach(function (k) {
        kl.appendChild(el('div', { style: 'padding:2px 0', html: '<span style="color:var(--accent)">·</span> ' + esc(k.title) }));
      });
      card.appendChild(kl);
    }
    var quizLink = el('div', { style: 'margin-top:10px' });
    quizLink.appendChild(el('a', { href: '#/quiz/' + ch.id, style: 'font-size:11.5px;font-weight:600', html: '本章练习 →' }));
    card.appendChild(quizLink);
    rail.appendChild(card);
  }

  var spyObserver = null;
  function setupScrollSpy() {
    if (spyObserver) spyObserver.disconnect();
    var rail = qs('#rail');
    var heads = qsa('.content .blockH');
    if (!heads.length || !rail) return;
    var linkMap = {};
    qsa('.railLink', rail).forEach(function (l) { linkMap[l.getAttribute('href').slice(1)] = l; });
    spyObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          qsa('.railLink', rail).forEach(function (l) { l.classList.remove('active'); });
          var l2 = linkMap[en.target.id];
          if (l2) l2.classList.add('active');
        }
      });
    }, { rootMargin: '-10% 0px -70% 0px', threshold: 0 });
    heads.forEach(function (hd) { spyObserver.observe(hd); });
  }

  /* 实验台索引 */
  var labsLoadState = 0;   // 0=未尝试 1=加载中 2=完成
  VIEWS.labs = function (id) {
    var root = el('div');
    if (id) { renderLabPage(root, id); return; }
    root.appendChild(pageHead({
      crumb: '<a href="#/">OVERVIEW</a><span>/</span><span>LABS</span>',
      kicker: 'INSTRUMENT_INDEX // 交互实验室',
      title: '交互实验室',
      en: 'LABS · 把抽象概念变成能拖能点的东西',
      meta: [
        ['STATIONS', String(Object.keys(labs).length).padStart(2, '0')],
        ['MODE', 'INTERACTIVE'],
        ['LINK', 'ONLINE']
      ],
      lead: '这些实验台没有"下一题"，只有"如果改一改会怎样"。改参数、点下一步、看结果——直觉是这么长出来的。'
    }));
    var grid = el('div', { class: 'chGrid' });
    var defs = labs;
    var keys = Object.keys(defs);
    if (!keys.length) {
      root.appendChild(el('div', { class: 'bootSplash' }, [el('div', { class: 'bootIn' }, [el('span', { class: 'bootTxt', text: labsLoadState === 2 ? '实验台尚未就绪' : '正在载入实验台…' })])]));
      setContent(root);
      if (labsLoadState !== 2) {
        labsLoadState = 1;
        loadModules(['viz', 'labs']).then(function () {
          labsLoadState = 2;
          if (CSC.current.view === 'labs') VIEWS.labs(id);
        });
      }
      return;
    }
    keys.sort(function (a, b) { return (defs[a].order || 99) - (defs[b].order || 99); });
    keys.forEach(function (k) {
      var d = defs[k];
      var card = el('a', { class: 'chCard', href: '#/labs/' + k }, [
        el('span', { class: 'cnum', text: (d.tags && d.tags[0] ? d.tags[0].toUpperCase() : 'LAB') }),
        el('div', { class: 'cti', text: d.title }),
        el('div', { class: 'cbl', text: d.desc || '' })
      ]);
      grid.appendChild(card);
    });
    root.appendChild(grid);
    setContent(root);
  };

  function renderLabPage(root, key) {
    if (!labs[key]) {
      root.appendChild(el('div', { class: 'bootSplash' }, [el('div', { class: 'bootIn' }, [el('span', { class: 'bootTxt', text: labsLoadState === 2 ? '没有找到这个实验台' : '正在载入实验台…' })])]));
      setContent(root);
      if (labsLoadState !== 2) {
        labsLoadState = 1;
        loadModules(['viz', 'labs']).then(function () {
          labsLoadState = 2;
          if (CSC.current.view === 'labs') VIEWS.labs(key);
        });
      }
      return;
    }
    var d = labs[key];
    root.appendChild(pageHead({
      crumb: '<a href="#/">OVERVIEW</a><span>/</span><a href="#/labs">LABS</a><span>/</span><span>STATION_' + esc(key.toUpperCase()) + '</span>',
      kicker: 'STATION_BRIEF // ' + esc(String((d.tags && d.tags[0]) || 'LAB').toUpperCase()),
      title: d.title,
      en: d.desc || '',
      meta: [
        ['STATION', esc(key.toUpperCase())],
        ['TYPE', 'INTERACTIVE'],
        ['STATUS', 'ONLINE']
      ]
    }));
    var host = el('div', { class: 'lab' });
    host.appendChild(el('div', { class: 'labHead' }, [
      el('div', { class: 'labIcon', html: icon(d.icon || 'flask') }),
      el('div', {
        class: 'labStatLine',
        html: '&gt; STATION_' + esc(String(key).toUpperCase())
          + ' // ' + esc(String((d.tags && d.tags[0]) || 'LAB').toUpperCase())
          + ' // INTERACTIVE // READY'
      }),
      el('span', { class: 'labTag', text: 'interactive' })
    ]));
    var body = el('div', { class: 'labBody' });
    host.appendChild(body);
    root.appendChild(host);
    setContent(root);
    try { d.init(body, {}, { CSC: CSC }); } catch (e) { body.appendChild(el('div', { class: 'varEmpty', text: '初始化失败：' + e.message })); }
  }

  /* 题库页 */
  VIEWS.quiz = function (chId, arg2, raw) {
    /* 支持 #/quiz/ch05?tag=exam&random=1&wrong=1：筛选状态由 URL 决定，刷新后仍保持 */
    var params = parseHashQuery(raw);
    var chapId = (chId && /^ch\d{2}$/.test(chId)) ? chId : '';
    chId = chapId;
    var root = el('div');
    root.appendChild(pageHead({
      crumb: '<a href="#/">OVERVIEW</a><span>/</span><a href="#/quiz">QUIZ_BANK</a>' + (chId ? '<span>/</span><span>MOD_' + esc(chapterTitle(chId).split(' ')[0]) + '</span>' : ''),
      kicker: 'QUESTION_BANK // 题库',
      title: '题库',
      en: 'QUIZ BANK · 即时判分 + 逐题解析',
      meta: [
        ['BANK', 'JAVA'],
        ['MODE', 'PRACTICE'],
        ['SCORING', 'AUTO']
      ],
      lead: chId ? '只显示「' + esc(chapterTitle(chId)) + '」相关题目。先想再做，做错看解析。' : '按章节刷题，选择/判断/填空/预测输出/找 bug 都有；做完立刻判分，并给出逐题解析。'
    }));
    var host = el('div');
    root.appendChild(host);
    setContent(root);
    loadQuizPack().then(function (pack) {
      if (!CSC.quiz) { host.appendChild(el('div', { class: 'varEmpty', text: '题库组件加载失败' })); return; }
      CSC.quiz.mountList(host, {
        chapter: chId || '',
        tag: params.tag || '',
        random: params.random === '1',
        wrongOnly: params.wrong === '1'
      });
    });
  };

  /* ==================================================================
   * 题目生成器页（参数化出题）
   * 每次生成 = 随机 seed → 生成器产出完整 Java 程序 → 站内引擎实跑得到标准答案；
   * 逐题作答即时判分，答完展示得分 + 逐行解析；题目本身不落 localStorage。
   * 模块：assets/generator.js（CSC.generator），按需加载。
   * ================================================================== */
  var drillStats = { answered: 0, correct: 0 };   /* 本页会话内统计，刷新即清零 */
  var drillSession = null;
  var drillDepsTried = false;

  VIEWS.drill = function () {
    drillSession = null;
    var root = el('div', { class: 'drillPage' });
    root.appendChild(pageHead({
      crumb: '<a href="#/">OVERVIEW</a><span>/</span><span>GENERATOR</span>',
      kicker: 'PARAMETRIC_DRILL // 参数化题目生成器',
      title: '题目生成器',
      en: 'PARAMETRIC QUESTION GENERATOR · 无限套题，答案由引擎实跑',
      meta: [
        ['MODE', 'PRACTICE'],
        ['TEMPLATES', '18'],
        ['SCORING', 'AUTO']
      ],
      lead: '每点一次「生成题组」，都会得到一套全新的「读程序写输出」题：数值、变量名、数组内容都不重样。'
        + '标准答案不是人写的——而是用站内 Java 引擎把生成的程序真的执行一遍得到的，解析逐行标注。'
    }));
    var host = el('div', { class: 'drillHost' });
    root.appendChild(host);
    setContent(root);
    paintDrillSetup(host);
  };

  function drillField(label, input) {
    return el('label', { class: 'drillField' }, [
      el('span', { class: 'drillLabel', text: label }),
      input
    ]);
  }

  function drillTypeLabel(id) {
    var defs = (CSC.generator && CSC.generator.TYPES) || [];
    for (var i = 0; i < defs.length; i++) if (defs[i].id === id) return defs[i].label;
    return id === 'all' ? '全部题型' : id;
  }

  /** 配置页：题型 / 难度 / 题量 + 模板说明 + 本页统计 */
  function paintDrillSetup(host) {
    if (CSC.current.view !== 'drill') return;
    host.innerHTML = '';
    var card = el('div', { class: 'drillSetup' });
    var defs = (CSC.generator && CSC.generator.TYPES) || null;

    if (!defs) {
      card.appendChild(el('div', { class: 'drillLoading' }, [
        el('div', { class: 'drillSpinner' }),
        el('div', { class: 'drillLoadingTxt', text: '正在载入题目模板与 Java 引擎…' })
      ]));
      if (!drillDepsTried) {
        drillDepsTried = true;
        host.appendChild(card);
        loadModules(['generator', 'engine']).then(function () { paintDrillSetup(host); });
      } else {
        card.appendChild(el('div', { class: 'drillFail', text: '题目生成器加载失败：assets/generator.js 未就绪，请刷新页面后重试。' }));
        host.appendChild(card);
      }
      return;
    }

    card.appendChild(el('div', { class: 'drillSetupHead' }, [
      el('span', { class: 'drillKicker', text: 'GENERATOR_CONFIG // 生成配置' }),
      el('span', { class: 'drillAuth', text: (defs.length * 3) + ' TEMPLATES · ENGINE CHECKED' })
    ]));

    var typeSel = el('select', { class: 'drillSelect', 'aria-label': '题型' });
    typeSel.appendChild(el('option', { value: 'all', text: '全部题型（混合）' }));
    defs.forEach(function (t) { typeSel.appendChild(el('option', { value: t.id, text: t.label })); });

    var diffSel = el('select', { class: 'drillSelect', 'aria-label': '难度' });
    [['0', '混合难度'], ['1', '难度 1 · 基础'], ['2', '难度 2 · 进阶'], ['3', '难度 3 · 挑战']].forEach(function (o) {
      diffSel.appendChild(el('option', { value: o[0], text: o[1] }));
    });

    var countSel = el('select', { class: 'drillSelect', 'aria-label': '题量' });
    [5, 10, 20].forEach(function (n) {
      countSel.appendChild(el('option', { value: String(n), text: n + ' 题' }));
    });
    countSel.value = '10';

    card.appendChild(el('div', { class: 'drillGrid' }, [
      drillField('题型 TYPE', typeSel),
      drillField('难度 LEVEL', diffSel),
      drillField('题量 COUNT', countSel)
    ]));

    var tpls = el('div', { class: 'drillTpls' });
    defs.forEach(function (t) {
      tpls.appendChild(el('div', { class: 'drillTpl' }, [
        el('span', { class: 'drillTplIcon', html: icon(t.icon || 'zap') }),
        el('b', { class: 'drillTplT', text: t.label }),
        el('span', { class: 'drillTplD', text: t.desc || '' }),
        el('span', { class: 'drillTplE', text: (t.en || '') + ' · 3 LEVELS' })
      ]));
    });
    card.appendChild(tpls);

    var startBtn = el('button', { class: 'drillStart', type: 'button' });
    startBtn.innerHTML = icon('play') + '<span>生成题组</span>';
    startBtn.addEventListener('click', function () {
      startDrill(host, {
        type: typeSel.value,
        difficulty: Number(diffSel.value) || 0,
        count: Number(countSel.value) || 10
      });
    });
    card.appendChild(el('div', { class: 'drillStartRow' }, [
      startBtn,
      el('span', { class: 'drillHint', text: '答案由引擎实测；逐题即时判分，答完看逐行解析。' })
    ]));
    card.appendChild(el('div', {
      class: 'drillStatsLine',
      html: '本页累计：答 <b>' + drillStats.answered + '</b> 题 · 正确 <b>' + drillStats.correct
        + '</b> 题 · 模板变体 <b>' + (defs.length * 3) + '</b> 个'
    }));
    host.appendChild(card);
  }

  /** 生成一整套题（生成器按需加载；生成过程中显示加载态） */
  function startDrill(host, cfg) {
    if (CSC.current.view !== 'drill') return;
    host.innerHTML = '';
    host.appendChild(el('div', { class: 'drillLoading' }, [
      el('div', { class: 'drillSpinner' }),
      el('div', { class: 'drillLoadingTxt', text: '正在生成 ' + cfg.count + ' 道题，并用 Java 引擎实跑校验答案…' })
    ]));
    loadModules(['generator', 'engine']).then(function () {
      if (CSC.current.view !== 'drill') return;
      if (!CSC.generator) {
        host.innerHTML = '';
        host.appendChild(el('div', { class: 'drillFail', text: '题目生成器加载失败：assets/generator.js 未就绪，请刷新页面后重试。' }));
        return;
      }
      var items;
      try {
        items = CSC.generator.buildSet(cfg.count, { type: cfg.type, difficulty: cfg.difficulty });
      } catch (e) {
        host.innerHTML = '';
        host.appendChild(el('div', { class: 'drillFail', text: '生成失败：' + (e && e.message ? e.message : e) }));
        return;
      }
      if (!items || !items.length) {
        host.innerHTML = '';
        host.appendChild(el('div', { class: 'drillFail', text: '生成失败：没有可用的题目模板。' }));
        return;
      }
      drillSession = { items: items, idx: 0, correct: 0, cfg: cfg, answered: [] };
      paintDrill(host);
    });
  }

  /** 逐题作答卡：程序 + 4 选项 + 即时判分 + 逐行解析 */
  function paintDrill(host) {
    if (CSC.current.view !== 'drill' || !drillSession) return;
    var s = drillSession;
    host.innerHTML = '';
    if (s.idx >= s.items.length) { paintDrillResult(host); return; }
    var it = s.items[s.idx];
    var card = el('div', { class: 'drillCard' });

    var pips = el('span', { class: 'drillPips' });
    for (var d = 1; d <= 3; d++) pips.appendChild(el('i', { class: 'drillPip' + (d <= it.difficulty ? ' on' : '') }));

    card.appendChild(el('div', { class: 'drillBar' }, [
      el('span', { class: 'drillNo', text: 'Q ' + (s.idx + 1) + ' / ' + s.items.length }),
      el('span', { class: 'drillType', text: it.typeLabel }),
      pips,
      el('span', { class: 'drillSeed', text: 'SEED ' + it.seed })
    ]));

    var prog = el('div', { class: 'drillProg' });
    var bar = el('i');
    bar.style.width = (s.idx / s.items.length * 100) + '%';
    prog.appendChild(bar);
    card.appendChild(prog);

    card.appendChild(el('div', { class: 'drillStem', html: esc(it.stem) }));

    var codeBox = el('div', { class: 'codeBox drillCodeBox' });
    codeBox.appendChild(el('div', { class: 'codeBoxHead' }, [
      el('span', { class: 'codeDots', html: '<i></i><i></i><i></i>' }),
      el('span', { class: 'cbT', html: '<b>Gen.java</b><span class="drillCodeHint"> · 由 seed ' + it.seed + ' 生成</span>' }),
      el('span', { class: 'pill', text: 'Java' })
    ]));
    var pre = el('pre');
    pre.innerHTML = codeLines(it.program);
    codeBox.appendChild(pre);
    card.appendChild(codeBox);

    var opts = el('div', { class: 'drillOpts' });
    var buttons = [];
    var locked = false;
    it.options.forEach(function (o, i) {
      var b = el('button', { class: 'drillOpt', type: 'button' }, [
        el('span', { class: 'drOptK', text: String.fromCharCode(65 + i) }),
        el('code', { class: 'drOptT', text: o.text })
      ]);
      buttons.push(b);
      b.addEventListener('click', function () {
        if (locked) return;
        locked = true;
        var ok = !!o.correct;
        b.classList.add(ok ? 'correct' : 'wrong');
        if (!ok) {
          it.options.forEach(function (o2, j) { if (o2.correct) buttons[j].classList.add('correct'); });
        }
        buttons.forEach(function (bb) { bb.classList.add('done'); });
        s.answered.push({ type: it.type, correct: ok });
        s.correct += ok ? 1 : 0;
        drillStats.answered++;
        if (ok) drillStats.correct++;
        card.appendChild(buildDrillFeedback(it, ok));
        var next = el('button', { class: 'drillNext', type: 'button' }, [
          el('span', { text: s.idx + 1 < s.items.length ? '下一题 →' : '查看成绩 →' })
        ]);
        next.addEventListener('click', function () {
          s.idx++;
          paintDrill(host);
        });
        card.appendChild(el('div', { class: 'drillNextRow' }, [next]));
        var fb = card.querySelector('.drillFeedback');
        if (fb && fb.scrollIntoView) {
          try { fb.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); } catch (e) { /* 忽略 */ }
        }
      });
      opts.appendChild(b);
    });
    card.appendChild(opts);

    var abort = el('button', { class: 'drillAbort', type: 'button', text: '重新配置' });
    abort.addEventListener('click', function () { drillSession = null; paintDrillSetup(host); });
    card.appendChild(el('div', { class: 'drillFootLine' }, [
      el('span', { text: '标准答案 = 站内 Java 引擎实跑输出' }),
      abort
    ]));

    host.appendChild(card);
    window.scrollTo(0, 0);
  }

  /** 判分反馈：正确项 + 引擎来源徽标 + 逐行解析 */
  function buildDrillFeedback(it, ok) {
    var box = el('div', { class: 'drillFeedback' + (ok ? ' ok' : ' err') });
    box.appendChild(el('div', { class: 'drillFbHead' }, [
      el('span', { class: 'drillFbIcon', html: icon(ok ? 'check' : 'x') }),
      el('b', { class: 'drillFbTitle', text: ok ? '答对了' : '答案不匹配' }),
      el('span', { class: 'drillFbAns', text: '标准输出：' + it.output })
    ]));
    box.appendChild(el('div', {
      class: 'drillSrc',
      html: it.engine
        ? '<span class="pill ok">ENGINE VERIFIED</span> 答案由站内 Java 引擎实际执行得到'
        : '<span class="pill warn">JS FALLBACK</span> 引擎未就绪，答案由内置 Java 语义计算得到'
    }));
    box.appendChild(el('div', { class: 'drillExT', text: '逐行解析' }));
    var list = el('ol', { class: 'drillExList' });
    (it.explain || []).forEach(function (ex) {
      list.appendChild(el('li', { class: 'drillExItem' }, [
        el('span', { class: 'drillExLine', text: 'L' + ex.line }),
        el('span', { class: 'drillExNote', text: ex.note })
      ]));
    });
    box.appendChild(list);
    if (it.summary) box.appendChild(el('div', { class: 'drillSum', text: it.summary }));
    return box;
  }

  /** 成绩页：得分 + 分题型正确率 + 再来一组 */
  function paintDrillResult(host) {
    if (CSC.current.view !== 'drill' || !drillSession) return;
    var s = drillSession;
    var n = s.items.length;
    var pct = n ? Math.round(s.correct / n * 100) : 0;
    var card = el('div', { class: 'drillResult' });

    card.appendChild(el('div', { class: 'drillResultHead' }, [
      el('span', { class: 'drillResKicker', text: 'DRILL_COMPLETE // 本组完成' }),
      el('div', { class: 'drillScore' }, [
        el('b', { class: 'drillScoreNum', text: String(s.correct) }),
        el('span', { class: 'drillScoreOf', text: '/ ' + n }),
        el('span', { class: 'drillScorePct', text: pct + '%' })
      ]),
      el('div', {
        class: 'drillResLine',
        text: '本组：' + drillTypeLabel(s.cfg.type) + ' · '
          + (s.cfg.difficulty ? '难度 ' + s.cfg.difficulty : '难度混合') + ' · ' + n + ' 题'
      })
    ]));

    var by = {};
    s.answered.forEach(function (a) {
      by[a.type] = by[a.type] || { n: 0, c: 0 };
      by[a.type].n++;
      if (a.correct) by[a.type].c++;
    });
    var brk = el('div', { class: 'drillBreak' });
    Object.keys(by).forEach(function (k) {
      var v = by[k];
      var row = el('div', { class: 'drillBrkRow' });
      row.appendChild(el('span', { class: 'drillBrkName', text: drillTypeLabel(k) }));
      var track = el('span', { class: 'drillBrkTrack' });
      var fill = el('i');
      fill.style.width = Math.round(v.c / v.n * 100) + '%';
      track.appendChild(fill);
      row.appendChild(track);
      row.appendChild(el('span', { class: 'drillBrkVal', text: v.c + ' / ' + v.n }));
      brk.appendChild(row);
    });
    card.appendChild(brk);

    var again = el('button', { class: 'drillStart', type: 'button' });
    again.innerHTML = icon('play') + '<span>再来一组</span>';
    again.addEventListener('click', function () { startDrill(host, s.cfg); });
    var cfgBtn = el('button', { class: 'drillAbort', type: 'button', text: '调整配置' });
    cfgBtn.addEventListener('click', function () { drillSession = null; paintDrillSetup(host); });
    card.appendChild(el('div', { class: 'drillResultBtns' }, [again, cfgBtn]));
    card.appendChild(el('div', {
      class: 'drillFootNote',
      text: '本页累计：答 ' + drillStats.answered + ' 题 · 正确 ' + drillStats.correct + ' 题（刷新后清零）'
    }));
    host.innerHTML = '';
    host.appendChild(card);
    window.scrollTo(0, 0);
  }

  /* ==================================================================
   * 项目实战（项目式学习）
   * 路由：#/projects（列表）与 #/projects/<id>（详情）。
   * 数据在 data/projects.js，渲染与判分在 assets/projects.js；
   * 判分复用站内 Java 引擎（CSC.java.run），与题库 code 题同一套输出归一化规则。
   * ================================================================== */
  VIEWS.projects = function (id) {
    var root = el('div', { class: 'projectsPage' });
    root.appendChild(pageHead({
      crumb: '<a href="#/">OVERVIEW</a><span>/</span><span>PROJECT_LAB</span>' + (id ? '<span>/</span><span>' + esc(String(id).toUpperCase()) + '</span>' : ''),
      kicker: 'PROJECT_LAB // 项目实战',
      title: id ? '项目详情' : '项目实战',
      en: 'PROJECT LAB · 把 21 章能力串成完整程序',
      meta: [
        ['PROJECTS', '03'],
        ['MILESTONES', '15'],
        ['SCORING', 'SELF-CHECK']
      ],
      lead: id
        ? '按里程碑推进：读需求 → 写代码 → 对着「任务清单」逐条自检；卡住可以看提示，写完再对照参考实现。'
        : '课程要求的 3 个项目：Java 聊天室 Chat Zoom、Gomoku 五子棋、Python 贪吃蛇。每个项目拆成 5 个里程碑，含验收清单、代码骨架、提示与参考实现——但这些项目跑在 Socket / JavaFX / Tkinter 上，<b>无法在站内自动判分</b>，请在你的 IntelliJ / PyCharm 里验证。'
    }));
    var host = el('div', { class: 'projectsHost' });
    root.appendChild(host);
    setContent(root);
    host.appendChild(el('div', { class: 'learnEmpty' }, [
      el('div', { class: 'learnEmptyT', text: '正在载入项目…' }),
      el('div', { class: 'learnEmptyD', text: '第一次进入需要加载项目数据与 Java 引擎（约 1 秒）。' })
    ]));
    loadProjects().then(function (list) {
      return loadModules(['engine', 'editor']).then(function () { return list; });
    }).then(function (list) {
      if (CSC.current.view !== 'projects') return;
      host.innerHTML = '';
      if (!CSC.projects) {
        host.appendChild(el('div', { class: 'learnEmpty' }, [
          el('div', { class: 'learnEmptyT', text: '项目模块加载失败' }),
          el('div', { class: 'learnEmptyD', text: 'assets/projects.js 没有就绪，请刷新页面重试。' }),
          el('a', { class: 'learnEmptyBtn', href: '#/', text: '← 回总览' })
        ]));
        return;
      }
      if (!list || !list.length) {
        host.appendChild(el('div', { class: 'learnEmpty' }, [
          el('div', { class: 'learnEmptyT', text: '项目数据加载失败' }),
          el('div', { class: 'learnEmptyD', text: 'data/projects.js 没有注册任何项目，请刷新页面重试。' }),
          el('a', { class: 'learnEmptyBtn', href: '#/', text: '← 回总览' })
        ]));
        return;
      }
      if (id) {
        var project = null;
        for (var i = 0; i < list.length; i++) if (list[i].id === id) project = list[i];
        CSC.projects.mountDetail(host, project);
      } else {
        CSC.projects.mountList(host, list);
      }
    }).catch(function (e) {
      if (CSC.current.view !== 'projects') return;
      host.innerHTML = '';
      host.appendChild(el('div', { class: 'learnEmpty' }, [
        el('div', { class: 'learnEmptyT', text: '项目加载失败' }),
        el('div', { class: 'learnEmptyD', text: String((e && e.message) || e) })
      ]));
    });
  };

  /* ==================================================================
   * 进阶轨道（课程之外的深入学习模块）
   * 独立数组（CSC.registerAdvanced），不进入 chapterMeta / 主课程统计。
   * 复用 renderBlocks 渲染同一套 block 类型；右侧目录 + 上下篇导航。
   * ================================================================== */

  /** 统计主题正文汉字数（不含代码；只用于列表页"约 N 字"的展示） */
  function advCountWords(topic) {
    var n = 0;
    function scan(blocks) {
      (blocks || []).forEach(function (b) {
        if (!b) return;
        var text = '';
        if (b.t === 'h') text = b.text || '';
        else if (b.t === 'p' || b.t === 'callout') text = b.html || '';
        else if (b.t === 'keypoint') text = (b.items || []).map(function (x) { return (x.title || '') + (x.html || ''); }).join(' ');
        else if (b.t === 'compare') text = ((b.left || {}).html || '') + ' ' + ((b.right || {}).html || '');
        else if (b.t === 'table') text = (b.head || []).join(' ') + ' ' + (b.rows || []).map(function (r) { return r.join(' '); }).join(' ');
        else if (b.t === 'steps') text = (b.items || []).map(function (x) { return (x.title || '') + (x.html || ''); }).join(' ');
        else if (b.t === 'terms') text = (b.items || []).map(function (x) { return (x.zh || '') + (x.html || ''); }).join(' ');
        else if (b.t === 'term') text = (b.zh || '') + (b.html || '');
        else if (b.t === 'checklist') text = (b.items || []).join(' ');
        var m = String(text).replace(/<[^>]*>/g, ' ').match(/[\u4e00-\u9fa5]/g);
        n += m ? m.length : 0;
        if (b.t === 'grid' || b.t === 'tabs') {
          (b.items || []).forEach(function (it) { scan(it.blocks || []); });
        }
      });
    }
    (topic.sections || []).forEach(function (s) { scan(s.blocks); });
    return n;
  }

  function advPrereqChips(topic) {
    var chips = el('span', { class: 'advChips' });
    (topic.prereq || []).forEach(function (id) {
      var m = chapterMeta.filter(function (x) { return x.id === id; })[0];
      chips.appendChild(el('a', { class: 'advChip', href: '#/' + id, title: '主课程章节（前置知识）' }, [
        el('span', { class: 'advChipK', text: m ? m.num : id }),
        el('span', { text: m ? m.title : id })
      ]));
    });
    return chips;
  }

  VIEWS.advanced = function (id) {
    var isDetail = !!id;
    var root = el('div', { class: 'advPage' });
    root.appendChild(pageHead({
      crumb: '<a href="#/">OVERVIEW</a><span>/</span><span>ADVANCED_TRACK</span>' + (isDetail ? '<span>/</span><span>' + esc(String(id).toUpperCase()) + '</span>' : ''),
      kicker: 'ADVANCED_TRACK // 进阶轨道 · 课程之外',
      title: isDetail ? '进阶主题' : '进阶轨道',
      en: 'ADVANCED TRACK · 主课程之外的深入学习',
      meta: [
        ['TOPICS', '04'],
        ['MODE', 'BEYOND SYLLABUS'],
        ['READING', 'OPTIONAL']
      ],
      lead: '进阶轨道是主课程之外的深入学习：Java 语言特性、算法、工程实践与计算机系统。'
        + '它独立于 21 章主线，不进入主课程统计——想读就读，不影响主线。'
    }));
    var host = el('div', { class: 'advHost' });
    root.appendChild(host);
    setContent(root);
    host.appendChild(el('div', { class: 'learnEmpty' }, [
      el('div', { class: 'learnEmptyT', text: '正在载入进阶主题…' }),
      el('div', { class: 'learnEmptyD', text: '第一次进入会加载 4 个进阶主题的数据。' })
    ]));
    loadAdvanced().then(function (list) {
      if (CSC.current.view !== 'advanced') return;
      host.innerHTML = '';
      list = list || [];
      if (!list.length) {
        host.appendChild(el('div', { class: 'learnEmpty' }, [
          el('div', { class: 'learnEmptyT', text: '进阶主题加载失败' }),
          el('div', { class: 'learnEmptyD', text: 'data/adv-*.js 没有就绪，请刷新页面重试。' }),
          el('a', { class: 'learnEmptyBtn', href: '#/', text: '← 回总览' })
        ]));
        return;
      }
      if (isDetail) renderAdvDetail(host, id, list);
      else renderAdvList(host, list);
    }).catch(function (e) {
      if (CSC.current.view !== 'advanced') return;
      host.innerHTML = '';
      host.appendChild(el('div', { class: 'learnEmpty' }, [
        el('div', { class: 'learnEmptyT', text: '进阶主题加载失败' }),
        el('div', { class: 'learnEmptyD', text: String((e && e.message) || e) })
      ]));
    });
  };

  function advBanner() {
    return el('div', { class: 'advBanner' }, [
      el('span', { class: 'advBannerK', text: 'OUTSIDE_THE_SYLLABUS' }),
      el('span', { class: 'advBannerT', text: '课程之外 · 独立阅读，不计入主课程' })
    ]);
  }

  /* ---------------------------------------------------------------- 列表 */
  function renderAdvList(host, list) {
    host.appendChild(advBanner());
    var grid = el('div', { class: 'advGrid' });
    list.forEach(function (t, i) {
      var words = advCountWords(t);
      grid.appendChild(el('a', {
        class: 'advCard',
        href: '#/advanced/' + t.id,
        dataset: { adv: t.id }
      }, [
        el('div', { class: 'advTop' }, [
          el('span', { class: 'advIdx', text: String(i + 1).padStart(2, '0') }),
          el('span', { class: 'advLevel', text: t.level || '进阶' }),
          el('span', { class: 'advTime', text: '≈' + (t.minutes || 60) + ' min' })
        ]),
        el('div', { class: 'advTitle', text: t.title || t.id }),
        el('div', { class: 'advEn', text: t.en || '' }),
        el('div', { class: 'advTagline', text: t.tagline || '' }),
        el('div', { class: 'advMeta' }, [
          el('span', { class: 'advStat', text: (t.sections || []).length + ' 小节' }),
          el('span', { class: 'advStat', text: '约 ' + words + ' 字' })
        ]),
        (t.prereq && t.prereq.length) ? el('div', { class: 'advPrereq' }, [
          el('span', { class: 'advPrereqK', text: '前置' }),
          advPrereqChips(t)
        ]) : null,
        el('div', { class: 'advGo', html: '进入主题 <span class="advArrow">→</span>' })
      ]));
    });
    host.appendChild(grid);
    host.appendChild(el('div', {
      class: 'learnNote',
      html: 'ADVANCED_TRACK // 4 个主题共 ' + list.reduce(function (a, t) { return a + (t.sections || []).length; }, 0) + ' 个小节。'
        + '<br>进阶轨道与 21 章主线分开阅读。站内代码引擎只执行 ch01–ch05 的 Java 子集，这里出现的 try/catch、IO、Stream、并发、JavaFX 与 Python 代码，'
        + '请复制到本地 JDK / Python 环境中运行；站内只展示代码与讲解，不执行、也不预生成运行结果。'
    }));
  }

  /* ---------------------------------------------------------------- 详情 */
  function renderAdvDetail(host, id, list) {
    var topic = null, idx = -1;
    for (var i = 0; i < list.length; i++) if (list[i].id === id) { topic = list[i]; idx = i; }
    if (!topic) {
      host.appendChild(el('div', { class: 'learnEmpty' }, [
        el('div', { class: 'learnEmptyT', text: '没有找到这个进阶主题' }),
        el('div', { class: 'learnEmptyD', text: '可能链接里的 id 写错了，回列表重新选择。' }),
        el('a', { class: 'learnEmptyBtn', href: '#/advanced', text: '← 返回进阶轨道' })
      ]));
      return;
    }
    var words = advCountWords(topic);
    var sections = topic.sections || [];

    host.appendChild(advBanner());

    /* 头部 */
    host.appendChild(el('div', { class: 'advTopicHead' }, [
      el('div', { class: 'advTopicTop' }, [
        el('span', { class: 'advTopicIdx', text: String(idx + 1).padStart(2, '0') + ' / ' + String(list.length).padStart(2, '0') }),
        el('span', { class: 'advTopicLevel', text: topic.level || '进阶' }),
        el('span', { class: 'advTopicTime', text: '≈' + (topic.minutes || 60) + ' 分钟 · 约 ' + words + ' 字' })
      ]),
      el('h2', { class: 'advTopicTitle', text: topic.title || topic.id }),
      el('div', { class: 'advTopicEn', text: topic.en || '' }),
      el('div', { class: 'advTopicTagline', text: topic.tagline || '' }),
      (topic.prereq && topic.prereq.length) ? el('div', { class: 'advPrereq' }, [
        el('span', { class: 'advPrereqK', text: '前置章节' }),
        advPrereqChips(topic)
      ]) : null
    ]));

    if (topic.intro) host.appendChild(el('div', { class: 'advIntro', html: topic.intro }));
    if (topic.goals && topic.goals.length) {
      var goals = el('div', { class: 'advGoals' });
      topic.goals.forEach(function (g) {
        goals.appendChild(el('div', { class: 'advGoal' }, [
          el('span', { class: 'advGoalK', html: icon('target') }),
          el('span', { class: 'advGoalT', text: g })
        ]));
      });
      host.appendChild(el('div', { class: 'learnSection' }, [
        el('span', { class: 'learnSectionT', text: '读完这篇你会' }),
        el('span', { class: 'learnSectionK', text: 'GOALS' })
      ]));
      host.appendChild(goals);
    }

    /* 小节跳转 */
    if (sections.length) {
      var jump = el('div', { class: 'advJump' });
      jump.appendChild(el('span', { class: 'advJumpK', text: 'SECTIONS' }));
      sections.forEach(function (sec, si) {
        jump.appendChild(el('a', {
          class: 'advJumpLink',
          href: '#' + (sec.id || (topic.id + '-s' + (si + 1))),
          text: 'S' + (si + 1) + ' · ' + (sec.title || '')
        }));
      });
      host.appendChild(jump);
    }

    /* 逐节渲染（复用 renderBlocks 与现有 block 类型） */
    var anchors = [];
    var sectionHost = el('div', { class: 'advSections' });
    sections.forEach(function (sec, si) {
      var sid = sec.id || (topic.id + '-s' + (si + 1));
      var secNode = el('section', { class: 'advSection', id: sid, dataset: { section: sid } });
      secNode.appendChild(el('div', { class: 'advSectionHead' }, [
        el('span', { class: 'advSectionN', text: 'S' + (si + 1) }),
        el('span', { class: 'advSectionT', text: sec.title || '' }),
        sec.en ? el('span', { class: 'advSectionEn', text: sec.en }) : null,
        sec.minutes ? el('span', { class: 'advSectionTime', text: sec.minutes + ' min' }) : null
      ]));
      var body = el('div', { class: 'advSectionBody' });
      var secBlocks = sec.blocks || [];
      /* sections[].html 作为本节导语渲染；若 blocks 第一块已经是 p（作者已把导语写进 blocks），则跳过，避免重复 */
      var leadAlready = secBlocks.length && secBlocks[0] && secBlocks[0].t === 'p';
      if (sec.html && !leadAlready) {
        renderBlocks(body, [{ t: 'p', lead: true, html: sec.html }],
          { chapter: { id: topic.id, title: topic.title }, anchors: [] });
      }
      renderBlocks(body, secBlocks, { chapter: { id: topic.id, title: topic.title }, anchors: [] });
      secNode.appendChild(body);
      sectionHost.appendChild(secNode);
      anchors.push({ id: sid, text: 'S' + (si + 1) + ' · ' + (sec.title || '') });
    });
    host.appendChild(sectionHost);

    /* 检查点（可勾选自测清单）与本章要点：复用现有 block 渲染器 */
    if (topic.checklist && topic.checklist.items && topic.checklist.items.length) {
      renderBlocks(host, [{ t: 'checklist', id: topic.checklist.id || (topic.id + '-check'), items: topic.checklist.items }], {});
    }
    if (topic.keypoint && topic.keypoint.items && topic.keypoint.items.length) {
      renderBlocks(host, [{ t: 'keypoint', items: topic.keypoint.items }], {});
    }

    /* 收尾建议 */
    if (topic.finish) host.appendChild(el('div', { class: 'advFinishNote', html: topic.finish }));


    /* 上 / 下一篇 */
    var prevT = idx > 0 ? list[idx - 1] : null;
    var nextT = idx < list.length - 1 ? list[idx + 1] : null;
    if (prevT || nextT) {
      var navRow = el('div', { class: 'advNav' });
      if (prevT) {
        navRow.appendChild(el('a', { class: 'advNavBtn prev', href: '#/advanced/' + prevT.id }, [
          el('span', { class: 'advNavK', text: '← 上一篇' }),
          el('span', { class: 'advNavT', text: prevT.title || prevT.id })
        ]));
      }
      if (nextT) {
        navRow.appendChild(el('a', { class: 'advNavBtn next', href: '#/advanced/' + nextT.id }, [
          el('span', { class: 'advNavK', text: '下一篇 →' }),
          el('span', { class: 'advNavT', text: nextT.title || nextT.id })
        ]));
      }
      host.appendChild(navRow);
    }

    /* 右侧目录 */
    var rail = qs('#rail');
    if (rail) {
      rail.innerHTML = '';
      rail.appendChild(el('div', { class: 'railTitle', text: '本篇目录' }));
      var rnav = el('div', { class: 'railNav' });
      anchors.forEach(function (a) {
        var link = el('a', { class: 'railLink', href: '#' + a.id, text: a.text });
        link.addEventListener('click', function (e) {
          e.preventDefault();
          var target = document.getElementById(a.id);
          if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        rnav.appendChild(link);
      });
      rail.appendChild(rnav);
      var card = el('div', { class: 'railCard2' });
      card.appendChild(el('b', { text: '进阶轨道' }));
      card.appendChild(el('div', { class: 'advRailNote', text: '课程之外 · 独立阅读' }));
      card.appendChild(el('a', { class: 'advRailLink', href: '#/advanced', text: '← 全部主题' }));
      rail.appendChild(card);
    }
  }

  /* 模拟卷 */
  VIEWS.exam = function (id) {
    var root = el('div', { class: 'exWrap' });
    if (id) {
      setContent(el('div', { class: 'bootSplash' }, [el('div', { class: 'bootIn' }, [el('span', { class: 'bootTxt', text: '正在准备试卷…' })])]));
      loadExams().then(function () {
        if (CSC.exam) CSC.exam.mount(root, id);
        else root.appendChild(el('div', { class: 'varEmpty', text: '试卷组件加载失败' }));
        setContent(root);
      });
      return;
    }
    root.appendChild(pageHead({
      crumb: '<a href="#/">OVERVIEW</a><span>/</span><span>MOCK_EXAMS</span>',
      kicker: 'EXAM_SIMULATION // 模拟卷',
      title: '模拟卷',
      en: 'MOCK EXAMS · 计时作答 + 自动判分 + 逐题解析',
      meta: [
        ['PAPERS', '03'],
        ['MODE', 'TIMED'],
        ['SCORING', 'AUTO']
      ],
      lead: '三套在线卷（F1 / F2 / F3，期末范围）：像真考试一样计时作答，交卷后逐题判分并给出解析。'
    }));
    var host = el('div');
    root.appendChild(host);
    setContent(root);
    loadExams().then(function () {
      if (!CSC.exam) return;
      CSC.exam.mountList(host);
    });
  };

  /* ==================================================================
   * 本站记录导出 / 导入（纯静态、file:// 可用）
   * 导出：把本站 csc.<siteId>.* 的 localStorage 原样打包成 JSON 文件（Blob 下载）
   * 导入：<input type="file"> 读回并覆盖同名记录（校验格式，导入后刷新生效）
   * ================================================================== */
  var RECORDS_FILE_VERSION = 1;

  function collectRecords() {
    var data = {};
    try {
      Object.keys(localStorage).forEach(function (k) {
        if (k.indexOf(LS) === 0) data[k] = localStorage.getItem(k);
      });
    } catch (e) {}
    return data;
  }

  /* Blob 下载；失败返回 false，由调用方降级到剪贴板 */
  function downloadText(filename, text, mime) {
    try {
      if (typeof Blob !== 'function' || !window.URL || !URL.createObjectURL) return false;
      var blob = new Blob([text], { type: mime || 'application/json;charset=utf-8' });
      if (window.navigator && window.navigator.msSaveBlob) { window.navigator.msSaveBlob(blob, filename); return true; }
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.rel = 'noopener';
      a.style.cssText = 'position:fixed;left:-9999px;top:0';
      document.body.appendChild(a);
      a.click();
      setTimeout(function () {
        try { URL.revokeObjectURL(url); } catch (e) {}
        if (a.parentNode) a.parentNode.removeChild(a);
      }, 5000);
      return true;
    } catch (e) {
      return false;
    }
  }

  function exportRecords() {
    var payload = {
      app: 'csc1004-records',
      fileVersion: RECORDS_FILE_VERSION,
      exportedAt: new Date().toISOString(),
      data: collectRecords()
    };
    var n = Object.keys(payload.data).length;
    var text = JSON.stringify(payload, null, 2);
    var name = SITE_ID + '-records-' + todayStr() + '.json';
    if (downloadText(name, text)) {
      toast('已导出 ' + n + ' 项本站记录：' + name, 'ok');
    } else {
      if (CSC.copy) CSC.copy(text);
      toast('下载不可用，已把本站记录复制到剪贴板', 'warn');
    }
  }

  function confirmImport(data) {
    var keys = Object.keys(data).filter(function (k) { return k.indexOf(LS) === 0; });
    CSC.modal('<h3>导入本站记录？</h3><p>将用文件中的 ' + keys.length
      + ' 项记录覆盖当前浏览器里的同名记录，无法撤销。导入完成后会自动刷新页面。</p>', { okText: '取消' });
    var foot = qs('#modal .mcFoot');
    if (!foot) return;
    var yes = el('button', { class: 'qzBtn', text: '确认导入' });
    yes.addEventListener('click', function () {
      try {
        keys.forEach(function (k) {
          var v = data[k];
          localStorage.setItem(k, typeof v === 'string' ? v : JSON.stringify(v));
        });
      } catch (e) {
        toast('写入失败：浏览器可能禁用了本地存储', 'err');
        return;
      }
      if (CSC._closeModal) CSC._closeModal();
      toast('已导入 ' + keys.length + ' 项记录，正在刷新…', 'ok');
      setTimeout(function () { location.reload(); }, 700);
    });
    foot.insertBefore(yes, foot.firstChild);
  }

  function importRecords() {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.style.cssText = 'position:fixed;left:-9999px;top:0';
    document.body.appendChild(input);
    function cleanup() {
      setTimeout(function () { if (input.parentNode) input.parentNode.removeChild(input); }, 1500);
    }
    input.addEventListener('change', function () {
      var f = input.files && input.files[0];
      if (!f) { cleanup(); return; }
      if (!window.FileReader) { toast('当前浏览器不支持读取文件', 'err'); cleanup(); return; }
      var reader = new FileReader();
      reader.onload = function () {
        var data = null;
        try {
          var payload = JSON.parse(String(reader.result));
          data = (payload && payload.data && typeof payload.data === 'object') ? payload.data : payload;
          if (!data || typeof data !== 'object' || Object.prototype.toString.call(data) === '[object Array]') {
            throw new Error('文件结构不正确');
          }
          if (payload && payload.app && payload.app !== 'csc1004-records' && payload.app !== 'csc1003-observatory') {
            throw new Error('这不是本站导出的记录文件');
          }
        } catch (e) {
          toast('导入失败：' + (e && e.message ? e.message : 'JSON 解析失败'), 'err');
          cleanup();
          return;
        }
        var keys = Object.keys(data).filter(function (k) { return k.indexOf(LS) === 0; });
        if (!keys.length) { toast('导入失败：文件里没有本站（' + LS + '*）记录', 'err'); cleanup(); return; }
        cleanup();
        confirmImport(data);
      };
      reader.onerror = function () { toast('读取文件失败', 'err'); cleanup(); };
      reader.readAsText(f);
    });
    input.click();
  }

  /* 关于 */
  VIEWS.about = function () {
    var root = el('div');
    root.appendChild(pageHead({
      crumb: '<a href="#/">OVERVIEW</a><span>/</span><span>OPERATIONS_MANUAL</span>',
      kicker: 'OPERATIONS_MANUAL // 使用说明',
      title: '使用说明',
      en: 'ABOUT & HELP · 关于本站的一切',
      meta: [
        ['REV', VERSION],
        ['MODE', 'OFFLINE'],
        ['DATA', 'LOCAL']
      ]
    }));
    var body = el('div');
    body.innerHTML =
      '<h2 class="blockH">离线可用，双击即可</h2>' +
      '<p class="blockP">整个网站是纯静态文件，没有任何后端与外部依赖。<b>直接双击 <code>index.html</code> 就能用</b>；也可以放在任何静态服务器上（含 GitHub Pages）。答题对错、模拟卷成绩与项目状态保存在本站专属的 <code>csc.csc1004.*</code> 本地存储里；换浏览器或清缓存会重置，六门课互不覆盖。</p>' +
      '<h2 class="blockH">界面与操作</h2>' +
      '<div class="tableWrap"><table><tbody>' +
      '<tr><th style="width:130px">首页世界星图</th><td>横向「课程世界星图」：左侧核心恒星＝课程核心（点击＝随机挑战），向右按 <b>7 个 Part</b> 分星区排列 <b>21 颗行星＝21 章</b>。<b>行星直径 ∝ 课时</b>，纹理为 10 种程序化世界风格（岩质/海洋/沙漠/冰/极光/气态/环星/风暴/熔岩/冰巨星），环与大气辉光分别来自世界类型和 Part 色。</td></tr>' +
      '<tr><th>节点 / FOV</th><td>每颗行星下方是<b>入口节点树</b>（章节 / 实验台 / 题库）；悬停行星浮出章名并在右侧终端读数（含世界类型、课时、实验台数）；<code>FOV_SCALE</code> 滑块缩放整张星图；左下 <code>PART_INDEX</code> 是 Part 图例；<b>点左上角徽标</b>随时回到首页。</td></tr>' +
      '<tr><th>侧栏</th><td>按 Part 分组列出 21 章；底部四个图标直达实验台 / 题库 / 模拟卷 / 术语表。</td></tr>' +
      '<tr><th>搜索</th><td>顶栏搜索框按 <kbd class="kbd">/</kbd> 聚焦，实时搜索全站正文；<kbd class="kbd">⌘K</kbd> 打开命令面板（模块 / 页面 / 操作）。搜「Socket」「JavaFX」「Tkinter」「after」都能直接命中。</td></tr>' +
      '</tbody></table></div>' +
      '<h2 class="blockH">主要功能</h2>' +
      '<div class="tableWrap"><table><tbody>' +
      '<tr><th style="width:130px">章节</th><td><b>21 章</b>覆盖 12 讲 Lecture + 11 个 Tutorial：从实验环境、Java 继承与多态，到 I/O 与 Socket、多线程、JavaFX 四章、聊天室与五子棋项目、Python 基础/类/Tkinter、贪吃蛇项目、机器学习项目，最后一章是期末备考。</td></tr>' +
      '<tr><th>代码运行</th><td>内置一个 <b>Java 子集解释器</b>（纯 JS 实现）。点代码块右上角「运行」即可编辑并执行；标「单步」的代码可以逐行执行，看变量、调用栈与堆内存。<b>注意：</b>ch01–ch05 大部分代码可以跑；从 ch06 起（I/O、Socket、多线程、JavaFX、Python）代码只能看、不能跑——这些机制必须在你自己的 IntelliJ / PyCharm 里验证，站内用实验台讲原理。</td></tr>' +
      '<tr><th>实验台</th><td>21 个可视化实验台：IntelliJ 调试器导览、AI 提示词构造器与代码审查、类设计器、继承链与方法查找、多态派发、I/O 流包装链、<b>Socket 连接时序</b>、线程调度时间线与五态状态机、Stage/Scene/Node 结构、<b>JavaFX 布局实时预览</b>、Canvas 绘图台、事件捕获冒泡、<b>聊天室广播消息流</b>、<b>可玩的五子棋</b>、Java↔Python 语法对照、Python 类可视化、Tkinter 三种几何管理、<b>可玩的贪吃蛇</b>、PyTorch 训练循环、期末时间分配器。</td></tr>' +
      '<tr><th>题库</th><td>按章节刷题，选择/多选/判断/填空/读代码写输出/排序/找 bug/编程判分等题型，即时判分并给出解析。每章至少 15 题，覆盖全部 21 章。</td></tr>' +
      '<tr><th>模拟卷</th><td><b>三套在线卷</b>（F1 全范围 / F2 Java 侧重 / F3 Python 侧重），严格按 Final Examination Guideline 的四部分结构（选择 10×3、判断 5×4、填空 5×5、简答编程 25 分）出题，可在线计时作答、交卷判分、看逐题解析。</td></tr>' +
      '<tr><th>项目手册</th><td><code>#/projects</code>：把课程的三个项目（Chat Zoom 聊天室 / Gomoku 五子棋 / Snake 贪吃蛇）拆成里程碑，每步给验收清单、代码骨架、提示、参考实现与评分要点。</td></tr>' +
      '<tr><th>进阶轨道</th><td><code>#/advanced</code>：课程之外的深入内容（Java 异常与集合、并发进阶、JavaFX FXML/动画、Python 装饰器与 NumPy），独立阅读、不参与主课程统计。</td></tr>' +
      '</tbody></table></div>' +
      '<h2 class="blockH">本站信息</h2>' +
      '<div class="tableWrap"><table><tbody>' +
      (SITE.aboutLines || []).map(function (r) { return '<tr><th style="width:130px">' + esc(r[0]) + '</th><td>' + r[1] + '</td></tr>'; }).join('') +
      '</tbody></table></div>' +
      '<h2 class="blockH">快捷键</h2>' +
      '<div class="tableWrap"><table><thead><tr><th>按键</th><th>作用</th></tr></thead><tbody>' +
      '<tr><td><kbd class="kbd">⌘K</kbd> / <kbd class="kbd">Ctrl</kbd>+<kbd class="kbd">K</kbd></td><td>命令面板（全局搜索 + 快捷操作）</td></tr>' +
      '<tr><td><kbd class="kbd">/</kbd></td><td>聚焦顶栏搜索框</td></tr>' +
      '<tr><td><kbd class="kbd">?</kbd></td><td>显示快捷键帮助</td></tr>' +
      '<tr><td><kbd class="kbd">R</kbd></td><td>随机挑战一道题</td></tr>' +
      '<tr><td><kbd class="kbd">G</kbd> / <kbd class="kbd">C</kbd> / <kbd class="kbd">M</kbd> / <kbd class="kbd">D</kbd></td><td>术语表 / 速查表 / 航线图 / Debug 手册</td></tr>' +
      '<tr><td><kbd class="kbd">Esc</kbd></td><td>关闭搜索 / 弹窗 / 手机侧栏</td></tr>' +
      '<tr><td><kbd class="kbd">Ctrl</kbd>+<kbd class="kbd">Enter</kbd></td><td>在代码编辑器中运行代码</td></tr>' +
      '<tr><td><kbd class="kbd">Tab</kbd> / <kbd class="kbd">Shift</kbd>+<kbd class="kbd">Tab</kbd></td><td>编辑器缩进 / 反缩进（编辑器内）</td></tr>' +
      '</tbody></table></div>' +
      '<h2 class="blockH">关于本课程</h2>' +
      '<p class="blockP">《<b>Java 程序设计实验</b>》—— CUHK-Shenzhen <b>CSC1004 Computational Laboratory Using Java</b>（LIU Guiliang，Term 2 2026）。这是一门<b>实验课</b>：每个学生独立完成 <b>两个 Java 项目</b>（各约 2000 行：聊天室 Chat Zoom、五子棋 Gomoku）和 <b>一个 Python 项目</b>（约 500 行：贪吃蛇等）。评分：Java 项目 40%（各 20%）+ Python 项目 20% + <b>期末考 40%</b>。期末闭卷，只考与项目紧密相关的知识，四部分：选择 10×3、判断 5×4、填空 5×5、简答编程 25 分。</p>' +
      '<div class="callout warn"><div class="ct"><span>关于 AI 的两条规则</span></div><div class="cb"><p>课程<b>允许</b>在完成项目时使用 AI 工具（"The use of AI tools is permitted for completing projects."），但<b>期末考期间严禁</b>任何 AI 与电子设备（"strictly prohibited during the final exam"）。所以本站的定位是：帮你在项目阶段把机制真正搞懂（这样 AI 写的代码你能审），帮你在考试阶段离开工具也能答（第 02 章与第 20 章专门讲这两件事）。</p></div></div>' +
      '<h2 class="blockH">视觉与致谢</h2>' +
      '<p class="blockP">界面采用 NASA-Punk Observatory 设计语言（深空底 + 程序化等高线地形 + 仪表读数 + 四色色标），沿用同系列参考站的视觉体系，设计参考 <a href="https://github.com/flowersauce/NASA-Punk_Observatory" target="_blank" rel="noopener">flowersauce/NASA-Punk_Observatory</a>（MIT License）；字体为 Jura 与 Roboto Mono（SIL Open Font License），已本地打包、离线可用。</p>' +
      '<h2 class="blockH">反馈与免责</h2>' +
      '<p class="blockP">本网站依据 CUHK-Shenzhen CSC1004 的公开讲义（Lecture 0–12、Tutorial 1–11）与 Final Examination Guideline（Term 2, 2026）整理，为个人学习用途，非官方教学材料。若与课程要求冲突，以老师与课程大纲为准。</p>' +
      '<h2 class="blockH">数据与隐私</h2>' +
      '<p class="blockP">答题对错、模拟卷成绩与项目状态只保存在你浏览器本站专属的 <code>csc.csc1004.*</code> 本地存储里，不上传任何服务器。清除浏览器数据或点下面的按钮只会重置这一门课的记录，不会影响其他课程。</p>' +
      '<div class="qzActions" id="aboutActions"></div>';
    root.appendChild(body);
    setContent(root);
    var acts = qs('#aboutActions');
    if (acts) {
      var resetBtn = el('button', { class: 'qzBtn ghost', html: '<span>重置本站成绩记录</span>' });
      resetBtn.addEventListener('click', function () {
        CSC.modal('<h3>确定重置吗？</h3><p>本站的答题记录、模拟卷成绩与项目状态都会被清空，其他课程的数据不受影响；此操作无法恢复。</p>', { okText: '取消' });
        var m = qs('#modal .mcFoot');
        if (m) {
          var yes = el('button', { class: 'qzBtn', text: '确认重置', style: 'background:var(--err);border-color:var(--err)' });
          yes.addEventListener('click', function () {
            try {
              Object.keys(localStorage).forEach(function (k) {
                if (k.indexOf(LS) === 0) localStorage.removeItem(k);
              });
            } catch (e) {}
            CSC._closeModal && CSC._closeModal();
            CSC.toast('已重置，正在刷新…', 'ok');
            setTimeout(function () { location.reload(); }, 600);
          });
          m.insertBefore(yes, m.firstChild);
        }
      });
      var exportBtn = el('button', { class: 'qzBtn ghost', type: 'button', html: '<span>⤓ 导出本站记录</span>' });
      exportBtn.title = '把本站成绩记录导出成 JSON 文件，可在别的浏览器/设备导入';
      exportBtn.addEventListener('click', exportRecords);
      var importBtn = el('button', { class: 'qzBtn ghost', type: 'button', html: '<span>⤒ 导入本站记录</span>' });
      importBtn.title = '从之前导出的 JSON 文件恢复本站记录（会覆盖同名记录）';
      importBtn.addEventListener('click', importRecords);
      acts.appendChild(exportBtn);
      acts.appendChild(importBtn);
      acts.appendChild(resetBtn);
      var ver = el('span', { class: 'dim aboutVer', text: '版本 v' + VERSION + ' · 离线可用' });
      acts.appendChild(ver);
    }
  };

  /* ------------------------------------------------------------------ 导航 */
  function chapterTitle(id) {
    var m = chapterMeta.find(function (x) { return x.id === id; });
    return m ? m.num + ' ' + m.title : id;
  }

  function renderNav() {
    var nav = qs('#nav');
    nav.innerHTML = '';
    var parts = {};
    chapterMeta.forEach(function (m) { (parts[m.part] = parts[m.part] || []).push(m); });
    Object.keys(parts).forEach(function (pname) {
      var g = el('div', { class: 'navGroup' });
      g.appendChild(el('div', { class: 'navGroupT', text: pname }));
      parts[pname].forEach(function (m) {
        var a = el('a', { class: 'navItem', href: '#/' + m.id, dataset: { ch: m.id } }, [
          el('span', { class: 'navNum', text: m.num }),
          el('span', { class: 'navTxt', text: m.title })
        ]);
        g.appendChild(a);
      });
      nav.appendChild(g);
    });

    function navGroup(title, items) {
      var g = el('div', { class: 'navGroup' });
      g.appendChild(el('div', { class: 'navGroupT', text: title }));
      items.forEach(function (t) {
        g.appendChild(el('a', { class: 'navItem', href: '#/' + t[0], dataset: { view: t[0] } }, [
          el('span', { class: 'navNum', html: icon(t[1]) }),
          el('span', { class: 'navTxt', text: t[2] })
        ]));
      });
      nav.appendChild(g);
    }
    navGroup('Tools', [
      ['drill', 'zap', '题目生成器'],
      ['projects', 'layers', '项目实战'],
      ['advanced', 'sparkle', '进阶轨道'],
      ['labs', 'flask', '交互实验室'],
      ['quiz', 'target', '题库'],
      ['exam', 'trophy', '模拟卷']
    ]);
    navGroup('Reference', [
      ['glossary', 'book', '术语表'],
      ['cheatsheet', 'list', '速查表'],
      ['map', 'compass', '航线图'],
      ['debug', 'bug', 'Debug 手册'],
      ['about', 'help', '使用说明']
    ]);
    updateNavActive(CSC.current.view, CSC.current.id);
  }

  function updateNavActive(view, id) {
    qsa('.navItem').forEach(function (a) {
      a.classList.remove('active');
      if (view === 'ch' && a.dataset.ch === id) a.classList.add('active');
      if (a.dataset.view === view) a.classList.add('active');
    });
  }

  /* 顶栏模块标识：NASA 风格的 MOD 编号 + 英文模块名 */
  var VIEW_TAGS = {
    home: ['00', 'OVERVIEW'],
    labs: ['LB', 'INTERACTIVE LABS'],
    drill: ['GN', 'QUESTION GENERATOR'],
    projects: ['PJ', 'PROJECT LAB'],
    advanced: ['AD', 'ADVANCED TRACK'],
    path: ['LP', 'STUDY PATH'],
    mastery: ['MS', 'MASTERY MAP'],
    review: ['RV', 'REVIEW QUEUE'],
    report: ['WR', 'WEEKLY REPORT'],
    quiz: ['QB', 'QUIZ BANK'],
    exam: ['EX', 'MOCK EXAMS'],
    glossary: ['GL', 'GLOSSARY'],
    cheatsheet: ['CS', 'CHEAT SHEET'],
    map: ['MP', 'FLIGHT PLAN'],
    debug: ['DB', 'DEBUG GUIDE'],
    about: ['OP', 'OPERATIONS MANUAL']
  };

  function updateModTag(view, id) {
    var numEl = qs('#modNum');
    var nameEl = qs('#modName');
    if (!numEl || !nameEl) return;
    if (view === 'ch' && id) {
      var m = chapterMeta.find(function (x) { return x.id === id; });
      numEl.textContent = m ? m.num : '--';
      nameEl.textContent = m ? (m.en || m.title) : '';
    } else {
      var t = VIEW_TAGS[view] || ['--', ''];
      numEl.textContent = t[0];
      nameEl.textContent = t[1];
    }
  }

  /* ------------------------------------------------------------------ 链路状态 */
  /* 侧栏 SYS 面板的 LINK 读数：真实反映 navigator.onLine，断网时给出一次提示 */
  function paintLinkState() {
    var node = qs('#sysLink');
    if (!node) return;
    var on = navigator.onLine !== false;
    node.innerHTML = '<i class="led" aria-hidden="true" style="'
      + (on ? '' : 'background:var(--err);box-shadow:0 0 8px var(--err);')
      + '"></i>' + (on ? 'ONLINE' : 'OFFLINE');
    node.setAttribute('title', on ? '网络已连接' : '当前离线：已缓存的页面与章节仍可学习');
  }

  function bindLinkState() {
    paintLinkState();
    window.addEventListener('online', function () {
      paintLinkState();
      toast('网络已恢复 · ONLINE', 'ok');
    });
    window.addEventListener('offline', function () {
      paintLinkState();
      toast('已断网 · 已缓存的章节仍可学习', 'warn');
    });
  }

  /* ------------------------------------------------------------------ 搜索 */
  var searchIndex = null;
  var searchBuilding = false;

  function buildIndex() {
    if (searchIndex) return Promise.resolve(searchIndex);
    searchBuilding = true;
    return loadAllChapters().then(function () {
      var idx = [];
      chapterMeta.forEach(function (m) {
        var ch = chapterById[m.id];
        if (!ch) return;
        idx.push({ ch: m.id, anchor: '', title: m.num + ' ' + m.title, text: (m.en || '') + ' ' + (m.blurb || ''), kind: '章节' });
        (ch.blocks || []).forEach(function (b) {
          var text = '', title = '';
          if (b.t === 'h') { title = stripTags(b.text); text = title; }
          else if (b.t === 'p' || b.t === 'callout' || b.t === 'keypoint') text = stripTags(b.html || (b.items ? b.items.map(function (x) { return x.html || x.title || ''; }).join(' ') : ''));
          else if (b.t === 'term' || b.t === 'terms') text = (b.en || '') + ' ' + (b.zh || '') + ' ' + (b.html || '') + ' ' + ((b.items || []).map(function (x) { return (x.en || '') + ' ' + (x.zh || '') + ' ' + (x.html || ''); }).join(' '));
          else if (b.t === 'code') { text = b.code || ''; title = b.caption || '代码'; }
          else if (b.t === 'table') text = (b.head || []).join(' ') + ' ' + (b.rows || []).map(function (r) { return r.join(' '); }).join(' ');
          else if (b.t === 'compare') text = stripTags((b.left && b.left.html || '') + ' ' + (b.right && b.right.html || ''));
          else if (b.t === 'steps') text = (b.items || []).map(function (x) { return stripTags((x.title || '') + ' ' + (x.html || '')); }).join(' ');
          if (!text && !title) return;
          idx.push({ ch: m.id, anchor: b.id || '', title: title || (m.num + ' ' + m.title), text: text.slice(0, 600), kind: kindName(b.t) });
        });
        (ch.kp || []).forEach(function (k) {
          idx.push({ ch: m.id, anchor: '', title: '知识点：' + k.title, text: k.title, kind: '知识点' });
        });
      });
      searchIndex = idx;
      searchBuilding = false;
      return idx;
    });
  }

  function kindName(t) {
    return ({ p: '正文', callout: '提示', code: '代码', table: '表格', terms: '术语', compare: '对比', steps: '步骤', keypoint: '要点' })[t] || '内容';
  }

  function doSearch(q) {
    var res = qs('#results');
    q = q.trim();
    if (!q) { hideResults(); return; }
    res.hidden = false;
    if (!searchIndex) {
      res.innerHTML = '<div class="resEmpty">正在建立索引…</div>';
      buildIndex().then(function () { doSearch(q); });
      return;
    }
    var lq = q.toLowerCase();
    var hits = [];
    searchIndex.forEach(function (it) {
      var s = (it.title + ' ' + it.text).toLowerCase();
      var pos = s.indexOf(lq);
      if (pos >= 0) {
        var score = 0;
        if (it.title.toLowerCase().indexOf(lq) >= 0) score += 60;
        if (it.kind === '章节' || it.kind === '知识点') score += 12;
        if (/(for|while|if|array|string|class|method|int|double|boolean|return|new|static|void|println)/i.test(q)) score += 8;
        hits.push({ it: it, score: score - Math.min(20, pos / 20) });
      }
    });
    hits.sort(function (a, b) { return b.score - a.score; });
    if (!hits.length) {
      res.innerHTML = '<div class="resEmpty">没有找到「' + esc(q) + '」<br><span class="small">试试：Socket、多线程、JavaFX、Tkinter、after</span></div>';
      return;
    }
    res.innerHTML = '<div class="resHead">找到 ' + hits.length + ' 条结果 · 回车打开第一条</div>';
    hits.slice(0, 12).forEach(function (hit, i) {
      var it = hit.it;
      var snippet = it.text || '';
      var pos = snippet.toLowerCase().indexOf(lq);
      var inner = '';
      if (pos >= 0) {
        var before = pos > 26 ? '…' + esc(snippet.slice(pos - 26, pos)) : esc(snippet.slice(0, pos));
        var after = snippet.slice(pos, pos + 70);
        inner = before + '<mark>' + esc(snippet.slice(pos, pos + q.length)) + '</mark>' + esc(after.slice(q.length)) + '…';
      } else {
        inner = esc(snippet.slice(0, 80)) + (snippet.length > 80 ? '…' : '');
      }
      var row = el('a', { class: 'resItem' + (i === 0 ? ' sel' : ''), href: '#/' + it.ch + (it.anchor ? '/' + it.anchor : ''), dataset: { i: i } }, [
        el('div', { class: 'rt' }, [
          el('span', { class: 'rk', text: it.kind }),
          el('span', { class: 'rc', text: chapterTitle(it.ch) })
        ]),
        el('div', { class: 'rs', html: inner })
      ]);
      res.appendChild(row);
    });
    currentHits = hits.slice(0, 12);
    currentSel = 0;
  }

  var currentHits = [], currentSel = 0;
  function hideResults() { var r = qs('#results'); if (r) { r.hidden = true; r.innerHTML = ''; } currentHits = []; }

  /* ------------------------------------------------------------------ 主题 / 侧栏 / toast / modal */
  /* 深色主题为唯一主题（NASA-Punk 视觉前提），旧的切换逻辑已移除 */

  var toastTimer = null;
  function toast(msg, kind) {
    var t = qs('#toast');
    t.textContent = msg;
    t.className = 'toast on' + (kind ? ' ' + kind : '');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.className = 'toast'; }, 2200);
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { toast('已复制', 'ok'); }, function () { fallback(); });
    } else fallback();
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); toast('已复制', 'ok'); } catch (e) { toast('复制失败', 'err'); }
      document.body.removeChild(ta);
    }
  }

  function modal(html, opts) {
    opts = opts || {};
    var m = qs('#modal');
    /* 无障碍：记住打开前的焦点，关闭时归还；打开后把焦点送进弹窗 */
    var returnFocus = document.activeElement;
    m.hidden = false;
    m.innerHTML = '';
    var card = el('div', { class: 'modalCard' });
    card.innerHTML = '<div class="mcBody">' + html + '</div>';
    var foot = el('div', { class: 'mcFoot' });
    var closeBtn = el('button', { class: 'qzBtn', text: opts.okText || '知道了' });
    closeBtn.addEventListener('click', closeModal);
    foot.appendChild(closeBtn);
    card.appendChild(foot);
    m.appendChild(card);
    /* 把弹窗内第一个 <h3> 作为对话框标题（index.html 上 aria-labelledby 指向它） */
    var h3 = card.querySelector('h3');
    if (h3) {
      h3.id = 'modalTitle';
      m.setAttribute('aria-labelledby', 'modalTitle');
    } else {
      m.removeAttribute('aria-labelledby');
    }
    m.onclick = function (e) { if (e.target === m) closeModal(); };
    setTimeout(function () {
      if (m.hidden) return;
      var first = card.querySelector('button, a[href], input, textarea, select');
      if (first) { try { first.focus(); } catch (e) {} }
    }, 40);
    function closeModal() {
      m.hidden = true;
      m.innerHTML = '';
      m.removeAttribute('aria-labelledby');
      if (returnFocus && returnFocus.focus && document.contains(returnFocus)) {
        try { returnFocus.focus(); } catch (e) {}
      }
    }
    CSC._closeModal = closeModal;
  }

  function openSidebar() {
    qs('#sidebar').classList.add('open');
    qs('#scrim').classList.add('on');
    var mb = qs('#menuBtn');
    if (mb) mb.setAttribute('aria-expanded', 'true');
  }
  function closeSidebar() {
    qs('#sidebar').classList.remove('open');
    qs('#scrim').classList.remove('on');
    var mb = qs('#menuBtn');
    if (mb) mb.setAttribute('aria-expanded', 'false');
  }


  /* ==================================================================
   * 命令面板（⌘K / Ctrl+K）：搜索章节、术语、页面与操作
   * ================================================================== */
  var cmdkEl = null, cmdkInput = null, cmdkList = null, cmdkHead = null;
  var cmdkItems = [], cmdkSel = 0, cmdkReturnFocus = null;

  function buildCommands() {
    var cmds = [];
    chapterMeta.forEach(function (m) {
      cmds.push({
        kind: 'MODULE', label: m.num + ' · ' + m.title, hint: m.en || '',
        run: function () { CSC.go('#/' + m.id); }
      });
    });
    [
      ['drill', '题目生成器', 'PARAMETRIC DRILL'],
      ['projects', '项目实战', 'PROJECT LAB'],
      ['advanced', '进阶轨道（课程之外）', 'ADVANCED TRACK'],
      ['labs', '交互实验室', 'INTERACTIVE LABS'],
      ['quiz', '题库', 'QUIZ BANK'],
      ['exam', '模拟卷', 'MOCK EXAMS'],
      ['glossary', '术语表', 'GLOSSARY'],
      ['cheatsheet', '课程速查表', 'CHEAT SHEET'],
      ['map', '课程航线图', 'FLIGHT PLAN'],
      ['debug', 'Debug 手册', 'DEBUG GUIDE'],
      ['about', '使用说明', 'OPERATIONS MANUAL']
    ].forEach(function (p) {
      cmds.push({ kind: 'PAGE', label: p[1], hint: p[2], run: function () { CSC.go('#/' + p[0]); } });
    });
    cmds.push({ kind: 'ACTION', label: '五子棋实验台', hint: 'GOMOKU LAB', run: function () { CSC.go('#/labs/gomoku'); } });
    cmds.push({ kind: 'ACTION', label: '随机挑战一道题', hint: 'RANDOM CHALLENGE', run: function () { randomChallenge(); } });
    cmds.push({ kind: 'ACTION', label: '回到页面顶部', hint: 'SCROLL TO TOP', run: function () { window.scrollTo({ top: 0, behavior: 'smooth' }); } });
    cmds.push({ kind: 'ACTION', label: '打开使用说明', hint: 'MANUAL', run: function () { CSC.go('#/about'); } });
    return cmds;
  }

  function ensureCmdk() {
    if (cmdkEl) return;
    cmdkEl = el('div', { class: 'cmdk', id: 'cmdk', hidden: true });
    var card = el('div', { class: 'cmdkCard' });
    cmdkHead = el('div', { class: 'cmdkHead' });
    cmdkInput = el('input', {
      class: 'cmdkInput', type: 'text', placeholder: '搜索模块、页面或操作…（↑↓ 选择 · ↵ 执行）',
      autocomplete: 'off', spellcheck: 'false'
    });
    cmdkHead.appendChild(el('span', { class: 'cmdkK', text: '⌘K' }));
    cmdkHead.appendChild(cmdkInput);
    cmdkHead.appendChild(el('span', { class: 'cmdkEsc', text: 'ESC' }));
    cmdkList = el('div', { class: 'cmdkList' });
    var foot = el('div', { class: 'cmdkFoot', html:
      '<span><b>↑</b><b>↓</b> 选择</span><span><b>↵</b> 执行</span>'
      + '<span><b>esc</b> 关闭</span><span class="cmdkCount" id="cmdkCount"></span>' });
    card.appendChild(cmdkHead);
    card.appendChild(cmdkList);
    card.appendChild(foot);
    cmdkEl.appendChild(card);
    document.body.appendChild(cmdkEl);

    cmdkEl.addEventListener('click', function (e) { if (e.target === cmdkEl) closeCmdk(); });
    cmdkInput.addEventListener('input', function () { renderCmdk(cmdkInput.value); });
    cmdkInput.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.preventDefault(); closeCmdk(); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); moveCmdk(1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); moveCmdk(-1); }
      else if (e.key === 'Enter') { e.preventDefault(); runCmdk(); }
    });
  }

  function renderCmdk(q) {
    var all = buildCommands();
    var lq = String(q || '').trim().toLowerCase();
    cmdkItems = all.filter(function (c) {
      if (!lq) return true;
      return (c.label + ' ' + c.hint + ' ' + c.kind).toLowerCase().indexOf(lq) >= 0;
    }).slice(0, 40);
    cmdkSel = 0;
    cmdkList.innerHTML = '';
    if (!cmdkItems.length) {
      cmdkList.appendChild(el('div', { class: 'cmdkEmpty', text: '没有匹配项' }));
    }
    cmdkItems.forEach(function (c, i) {
      var row = el('div', { class: 'cmdkItem' + (i === 0 ? ' sel' : ''), dataset: { i: i } }, [
        el('span', { class: 'cmdkKind', text: c.kind }),
        el('span', { class: 'cmdkLabel', text: c.label }),
        el('span', { class: 'cmdkHint', text: c.hint })
      ]);
      row.addEventListener('mouseenter', function () { cmdkSel = i; paintCmdk(); });
      row.addEventListener('click', function () { cmdkSel = i; runCmdk(); });
      cmdkList.appendChild(row);
    });
    var cnt = qs('#cmdkCount');
    if (cnt) cnt.textContent = cmdkItems.length + ' / ' + all.length;
    paintCmdk();
  }

  function paintCmdk() {
    qsa('.cmdkItem', cmdkList).forEach(function (n, i) {
      n.classList.toggle('sel', i === cmdkSel);
    });
    var sel = qs('.cmdkItem.sel', cmdkList);
    if (sel && sel.scrollIntoView) sel.scrollIntoView({ block: 'nearest' });
  }

  function moveCmdk(d) {
    if (!cmdkItems.length) return;
    cmdkSel = (cmdkSel + d + cmdkItems.length) % cmdkItems.length;
    paintCmdk();
  }

  function runCmdk() {
    var c = cmdkItems[cmdkSel];
    if (!c) return;
    closeCmdk();
    setTimeout(function () { c.run(); }, 10);
  }

  function openCmdk() {
    ensureCmdk();
    cmdkReturnFocus = document.activeElement;
    cmdkEl.hidden = false;
    cmdkInput.value = '';
    renderCmdk('');
    setTimeout(function () { cmdkInput.focus(); }, 30);
  }

  function closeCmdk() {
    if (!cmdkEl) return;
    cmdkEl.hidden = true;
    var t = cmdkReturnFocus;
    cmdkReturnFocus = null;
    if (t && t.focus && document.contains(t)) {
      try { t.focus(); } catch (e) {}
    }
  }

  /* 快捷键帮助 */
  var SHORTCUTS = [
    ['/', '聚焦搜索框'],
    ['⌘K / Ctrl+K', '打开命令面板'],
    ['↑ ↓', '命令面板内选择'],
    ['↵', '命令面板内执行'],
    ['R', '随机挑战一道题'],
    ['G', '术语表'],
    ['C', '速查表'],
    ['M', '课程航线图'],
    ['D', 'Debug 手册'],
    ['Esc', '关闭浮层 / 搜索'],
    ['Tab / ⇧Tab', '代码编辑器缩进 / 反缩进'],
    ['Ctrl+↵', '在代码编辑器中运行']
  ];

  function showShortcuts() {
    var rows = SHORTCUTS.map(function (s) {
      return '<tr><td><kbd class="kbd">' + s[0] + '</kbd></td><td>' + s[1] + '</td></tr>';
    }).join('');
    CSC.modal('<h3>键盘快捷键</h3><div class="tableWrap"><table><tbody>' + rows + '</tbody></table></div>'
      + '<p class="dim" style="margin-top:10px;font-size:12px">在任何页面按 <kbd class="kbd">?</kbd> 都可以重新打开这个面板。</p>',
      { okText: '知道了' });
  }

  /* ------------------------------------------------------------------ 观测站签名层初始化 */
  function initObservatory() {
    /* 地形等高线背景：整站常驻（只画一次，resize 重绘） */
    var topo = qs('#topoCanvas');
    if (topo && window.CSC_OBS && CSC_OBS.mountTopo) {
      try { CSC_OBS.mountTopo(topo); } catch (e) { console.error('[observatory] topo 初始化失败', e); }
    }
    /* 启动终端序列：首次进入逐行打字，之后同一标签页内跳过 */
    var boot = qs('#boot');
    if (boot) {
      var bootHead = qs('.bootHead');
      if (bootHead) {
        var bhSpans = bootHead.querySelectorAll('span');
        if (bhSpans[0] && SITE.bootHead) bhSpans[0].textContent = SITE.bootHead;
        if (bhSpans[1]) bhSpans[1].textContent = 'BOOT_SEQUENCE // ' + String(SITE_ID).toUpperCase();
      }
      var bootWm = qs('.bootWatermark');
      if (bootWm) bootWm.textContent = String(SITE_ID).toUpperCase();
      if (window.CSC_OBS && CSC_OBS.mountBoot) {
        try {
          var bootLines = [
            'INITIALIZING CORE .......... OK',
            'LOADING MODULES ............ ' + chapterMeta.length,
            SITE_LABEL + ' SUBSET ENGINE ......... READY',
            'TOPOGRAPHY RENDERER ........ ONLINE',
            'OPTICS CALIBRATED .......... 100%'
          ];
          if (SITE.bootLog && SITE.bootLog.length) {
            bootLines = SITE.bootLog.map(function (t) {
              return String(t).replace('{{CHAPTERS}}', String(chapterMeta.length));
            });
          }
          CSC_OBS.mountBoot(boot, { key: LS + 'boot.seen', minMs: 1700, lines: bootLines });
        } catch (e) {
          boot.classList.add('done');
          setTimeout(function () { if (boot.parentNode) boot.parentNode.removeChild(boot); }, 600);
        }
      } else {
        boot.classList.add('done');
        setTimeout(function () { if (boot.parentNode) boot.parentNode.removeChild(boot); }, 600);
      }
    }
  }
  /* ------------------------------------------------------------------ 滚动进场 */
  var revealObserver = null;

  var REVEAL_SEL = '.callout, .codeBox, .lab, .qzCard, .tableWrap, .termCard, .keypoint, '
    + '.compare, .steps, .termsGrid, .checklist, .chCard, .howCard';

  /* 把视口内的未显示元素立刻显示（兜底：即使 IntersectionObserver 失效也不会留白） */
  function revealSweep() {
    var vh = window.innerHeight || 800;
    qsa('.reveal:not(.in)').forEach(function (n) {
      var r = n.getBoundingClientRect();
      /* 只要顶部已经到达或越过视口底边，就显示（含快速滚动跳过的元素） */
      if (r.top < vh + 60) n.classList.add('in');
    });
  }

  function setupReveal(scope) {
    if (!('IntersectionObserver' in window)) return;
    var root = scope || document;
    var nodes = qsa(REVEAL_SEL, root);
    if (!nodes.length) return;
    if (revealObserver) revealObserver.disconnect();
    revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) en.target.classList.add('in');
      });
    }, { rootMargin: '0px 0px -4% 0px', threshold: 0.01 });
    nodes.forEach(function (n) {
      if (n.classList.contains('in')) return;
      if (!n.classList.contains('reveal')) n.classList.add('reveal');
      /* 关键：每次都要重新 observe（disconnect 之后之前观察的对象全部失效） */
      revealObserver.observe(n);
    });
    /* 双重兜底：立即扫一次 + 1.2 秒后再扫一次 */
    revealSweep();
    clearTimeout(setupReveal._t);
    setupReveal._t = setTimeout(revealSweep, 1200);
  }

  /* ------------------------------------------------------------------ 返回顶部 */
  var toTopBound = false;
  function bindToTop() {
    var btn = qs('#toTop');
    if (!btn || toTopBound) return;
    toTopBound = true;
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ------------------------------------------------------------------ 初始化 */
  function init() {
    migrateStorage();
    if (SITE_NAME) document.title = SITE_NAME + (SITE.en ? ' · ' + SITE.en : '');
    renderNav();
    bindToTop();

    // 侧栏图标
    qs('#helpBtn').innerHTML = icon('help');
    qs('#menuBtn').innerHTML = icon('menu');

    // 侧栏底部快捷入口：实验台 / 题库 / 模拟卷 / 术语表（不占导航滚动区）
    var sideTools = qs('#sideTools');
    if (sideTools) {
      [
        ['drill', 'zap', '题目生成器'],
        ['labs', 'flask', '交互实验室'],
        ['quiz', 'target', '题库'],
        ['exam', 'trophy', '模拟卷'],
        ['glossary', 'book', '术语表']
      ].forEach(function (t) {
        var b = el('button', { class: 'iconBtn', title: t[2], 'aria-label': t[2], html: icon(t[1]) });
        b.addEventListener('click', function () { CSC.go('#/' + t[0]); });
        sideTools.appendChild(b);
      });
    }

    qs('#helpBtn').addEventListener('click', function () { CSC.go('#/about'); });
    qs('#menuBtn').addEventListener('click', openSidebar);
    qs('#scrim').addEventListener('click', closeSidebar);
    // 顶栏右侧：操作手册入口（原学习能量按钮）
    var xpBtn = qs('#xpBtn');
    if (xpBtn) {
      xpBtn.innerHTML = '<span class="dot"></span><span class="lbl">MANUAL</span>';
      xpBtn.title = '操作手册 / 使用说明';
      xpBtn.addEventListener('click', function () { CSC.go('#/about'); });
    }
    qs('#footVer').textContent = VERSION;
    bindLinkState();
    updateModTag('home', '');

    // 搜索
    var qInput = qs('#q');
    qInput.addEventListener('input', debounce(function () { doSearch(qInput.value); }, 180));
    qInput.addEventListener('focus', function () { if (qInput.value) doSearch(qInput.value); });
    qInput.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { qInput.value = ''; hideResults(); qInput.blur(); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); currentSel = Math.min(currentHits.length - 1, currentSel + 1); highlightSel(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); currentSel = Math.max(0, currentSel - 1); highlightSel(); }
      else if (e.key === 'Enter') { e.preventDefault(); if (currentHits[currentSel]) { location.hash = currentHits[currentSel].it.ch ? '#/' + currentHits[currentSel].it.ch + (currentHits[currentSel].it.anchor ? '/' + currentHits[currentSel].it.anchor : '') : '#/'; hideResults(); qInput.blur(); } }
    });
    document.addEventListener('click', function (e) {
      if (!qs('#results').contains(e.target) && e.target !== qInput) hideResults();
    });

    // 快捷键
    document.addEventListener('keydown', function (e) {
      var tag = (e.target.tagName || '').toLowerCase();
      var typing = tag === 'input' || tag === 'textarea' || e.target.isContentEditable;
      if (typing) return;
      if (e.key === '/') { e.preventDefault(); qs('#q').focus(); qs('#q').select(); return; }
      if (e.key === 'Escape') {
        if (!qs('#modal').hidden && CSC._closeModal) CSC._closeModal();
        hideResults(); closeSidebar();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault(); openCmdk(); return;
      }
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === '?') { e.preventDefault(); showShortcuts(); return; }
      if (e.key === 'r' || e.key === 'R') { e.preventDefault(); randomChallenge(); }
      else if (e.key === 'g' || e.key === 'G') { e.preventDefault(); CSC.go('#/glossary'); }
      else if (e.key === 'c' || e.key === 'C') { e.preventDefault(); CSC.go('#/cheatsheet'); }
      else if (e.key === 'm' || e.key === 'M') { e.preventDefault(); CSC.go('#/map'); }
      else if (e.key === 'd' || e.key === 'D') { e.preventDefault(); CSC.go('#/debug'); }
    });

    // 章节数据就绪后刷新
    bus.on('chapter:loaded', function () {
      if (CSC.current.view === 'home') renderNav();
    });

    // 首次访问提示
    if (!store.get('welcomed', false)) {
      store.set('welcomed', true);
      setTimeout(function () {
        toast('提示：按 / 可以搜索任意概念', '');
      }, 1200);
    }

    // 滚动：返回顶部按钮显隐 + 滚动进场兜底
    var revealSweepThrottled = debounce(revealSweep, 140);
    window.addEventListener('scroll', function () {
      var btn = qs('#toTop');
      if (btn) btn.classList.toggle('on', window.scrollY > 720);
      if (qs('.reveal:not(.in)')) revealSweepThrottled();
    }, { passive: true });

    window.addEventListener('hashchange', route);
    initObservatory();
    route();
  }

  function highlightSel() {
    qsa('.resItem').forEach(function (r, i) { r.classList.toggle('sel', i === currentSel); });
  }


  /* ==================================================================
   * 参考类页面：术语表 / 速查表 / 航线图 / Debug 手册
   * 这些视图不依赖章节内容文件，按需从已加载数据或内置常量渲染
   * ================================================================== */

  /* ------------------------------------------------------------------ 术语表 */
  VIEWS.glossary = function () {
    var root = el('div');
    root.appendChild(pageHead({
      crumb: '<a href="#/">OVERVIEW</a><span>/</span><span>GLOSSARY</span>',
      kicker: 'TERM_DATABASE // 术语表',
      title: '术语表',
      en: 'GLOSSARY · 全站英文术语速查',
      meta: [
        ['SOURCE', '21 MODULES'],
        ['SORT', 'A → Z'],
        ['MODE', 'FILTER']
      ],
      lead: '课程里出现过的英文术语都收在这里，按字母排序。考试卷面是英文的——<b>看不懂术语，等于看不懂题</b>。点卡片可直接跳到它出现的章节。'
    }));
    var statRow = el('div', { class: 'statRow' });
    root.appendChild(statRow);

    var bar = el('div', { class: 'glossBar' });
    var input = el('input', { class: 'glossInput', type: 'search', placeholder: '过滤：array / 递归 / reference / pointer …', spellcheck: 'false' });
    bar.appendChild(input);
    var countEl = el('span', { class: 'glossCount', text: '' });
    bar.appendChild(countEl);
    root.appendChild(bar);

    var list = el('div', { class: 'glossList' });
    root.appendChild(list);
    setContent(root);

    var items = [];
    loadAllChapters().then(function () {
      chapterMeta.forEach(function (m) {
        var ch = chapterById[m.id];
        if (!ch) return;
        (ch.blocks || []).forEach(function (b) {
          if (b.t === 'term') {
            items.push({ en: b.en || '', zh: b.zh || '', html: b.html || '', ch: m });
          } else if (b.t === 'terms') {
            (b.items || []).forEach(function (it) {
              items.push({ en: it.en || '', zh: it.zh || '', html: it.html || '', ch: m });
            });
          }
        });
      });
      items.sort(function (a, b) { return String(a.en).toLowerCase().localeCompare(String(b.en).toLowerCase()); });

      statRow.appendChild(statCard(String(items.length).padStart(2, '0'), 'TERMS · 术语总数', 'accent'));
      statRow.appendChild(statCard(String(chapterMeta.length).padStart(2, '0'), 'MODULES · 覆盖章节', 'cyan'));
      animateCounters(statRow);
      countEl.textContent = items.length + ' TERMS';

      function render(filter) {
        list.innerHTML = '';
        var q = String(filter || '').trim().toLowerCase();
        var shown = 0;
        var groups = {};
        items.forEach(function (it) {
          var hay = (it.en + ' ' + it.zh + ' ' + stripTags(it.html)).toLowerCase();
          if (q && hay.indexOf(q) < 0) return;
          shown++;
          var letter = (String(it.en).match(/^[a-zA-Z]/) ? String(it.en)[0].toUpperCase() : '#');
          (groups[letter] = groups[letter] || []).push(it);
        });
        Object.keys(groups).sort().forEach(function (letter) {
          var sec = el('section', { class: 'glossGroup' });
          sec.appendChild(el('div', { class: 'glossAlpha' }, [
            el('span', { text: letter }),
            el('i', { text: groups[letter].length })
          ]));
          var grid = el('div', { class: 'termsGrid' });
          groups[letter].forEach(function (it) {
            var card = el('div', { class: 'termCard glossCard' }, [
              el('span', { class: 'te', text: it.en }),
              el('span', { class: 'tz', html: it.zh }),
              el('div', { class: 'td', html: it.html }),
              el('a', { class: 'glossSrc', href: '#/' + it.ch.id, text: 'MOD ' + it.ch.num + ' · ' + it.ch.title })
            ]);
            grid.appendChild(card);
          });
          sec.appendChild(grid);
          list.appendChild(sec);
        });
        if (!shown) list.appendChild(el('div', { class: 'emptyState' }, [
          el('div', { class: 'ei', text: '◌' }),
          el('h3', { text: '没有匹配的术语' }),
          el('p', { text: '换个关键词试试，或者清空筛选。' })
        ]));
        countEl.textContent = shown + ' / ' + items.length + ' TERMS';
      }
      render('');
      input.addEventListener('input', debounce(function () { render(input.value); }, 120));
      if (items.length) countEl.textContent = items.length + ' TERMS';
    });
  };

  /* ------------------------------------------------------------------ 速查表 */
  var CHEATSHEET = [
    /* ============================================================ 1. 继承与多态 */
    {
      label: '继承与多态',
      blocks: [
        { t: 'h', lvl: 3, text: '继承的三种类型（课程只支持这三种）' },
        { t: 'table', head: ['类型', '形状', '例子'], rows: [
          ['<b>单继承</b> single', 'A→B', '<code>class Dog extends Animal</code>'],
          ['<b>多级继承</b> multilevel', 'A → B → C', '<code>class BabyDog extends Dog</code>'],
          ['<b>层次继承</b> hierarchical', 'A→B、A→C', '<code>Dog</code> 与 <code>Cat</code> 都 extends <code>Animal</code>'],
          ['<b>多继承</b> —— <span class="hl">Java 类不支持</span>', 'A、B→C', '会产生菱形歧义；改用 <b>接口</b> 实现多实现']
        ] },
        { t: 'code', caption: '继承 + 重写 + super 的标准写法', code:
`class Animal {
    protected String name;
    public Animal(String name) { this.name = name; }
    public void speak() { System.out.println(name + " makes a sound"); }
}

class Dog extends Animal {                 // IS-A：Dog 是一种 Animal
    public Dog(String name) {
        super(name);                       // 必须是构造器第一句
    }
    @Override                              // 建议写，拼错编译器会报
    public void speak() {                  // 重写：签名必须完全一致
        super.speak();                     // 需要时先调父类版本
        System.out.println(name + " barks");
    }
}` },
        { t: 'h', lvl: 3, text: '多态：编译期看左边的类型，运行期看右边的对象' },
        { t: 'table', head: ['写法', '能调用什么', '实际执行谁'], rows: [
          ['<code>Animal a = new Dog("x");</code>', '只能调 <code>Animal</code> 声明过的方法', '<code>Dog</code> 重写过的版本（动态绑定）'],
          ['<code>Dog d = new Dog("x");</code>', '<code>Dog</code> 与继承来的全部方法', '<code>Dog</code> 自己的版本'],
          ['<code>Animal a = new Animal("x");</code>', '<code>Animal</code> 的方法', '<code>Animal</code> 的版本']
        ] },
        { t: 'table', head: ['关键字 / 概念', '一句话记住'], rows: [
          ['<code>extends</code>', '类继承类（单继承）；接口继承接口（可多个）'],
          ['<code>implements</code>', '类实现接口（可多个），必须实现全部抽象方法'],
          ['<code>super(...)</code>', '调父类构造器，必须是子类构造器第一句'],
          ['<code>super.m()</code>', '调父类被重写的方法'],
          ['<code>@Override</code>', '让编译器帮你检查「这真的是重写吗」'],
          ['<code>abstract</code>', '抽象类不能实例化；抽象方法没有方法体'],
          ['<code>interface</code>', '只有抽象方法的契约（Java 8+ 可有 default）'],
          ['<code>instanceof</code>', '判断运行期实际类型，常配合强转'],
          ['<code>final</code>', 'final 类不能被继承、final 方法不能被重写'],
          ['<b>HAS-A</b>（聚合）', '一个类持有另一个类的引用，<b>不是</b>继承']
        ] },
        { t: 'callout', kind: 'warn', html: '重写（override）vs 重载（overload）：重写的签名<b>完全相同</b>，发生在父子类之间；重载的方法名相同、<b>参数列表不同</b>，可以发生在同一个类里。考卷上最爱在这里设陷阱。' }
      ]
    },

    /* ============================================================ 2. I/O 与 Socket */
    {
      label: 'I/O 与 Socket',
      blocks: [
        { t: 'h', lvl: 3, text: '流的四层包装（背下来）' },
        { t: 'table', head: ['层', '类', '作用'], rows: [
          ['字节流（底层）', '<code>InputStream</code> / <code>OutputStream</code>', '只认 byte，来自 socket / file'],
          ['桥接（字节→字符）', '<code>InputStreamReader</code> / <code>OutputStreamWriter</code>', '按字符集解码/编码'],
          ['缓冲（效率）', '<code>BufferedReader</code> / <code>BufferedWriter</code>', '攒一批再读写；提供 <code>readLine()</code>'],
          ['过滤（结构化）', '<code>DataInputStream</code> / <code>DataOutputStream</code>', '<code>readUTF()</code> / <code>writeUTF()</code> 直接读写字符串与基本类型']
        ] },
        { t: 'code', caption: '聊天室里那两行必须会默写', code:
`// 写：Socket 的字节输出 → OutputStreamWriter 转字符 → BufferedWriter 加缓冲
BufferedWriter writer = new BufferedWriter(
        new OutputStreamWriter(socket.getOutputStream()));

// 读：反过来，最后拿到 readLine()
BufferedReader reader = new BufferedReader(
        new InputStreamReader(socket.getInputStream()));

writer.write("hello");
writer.newLine();   // 或 writer.write("\\n");
writer.flush();     // ⚠ 不 flush，对方永远收不到` },
        { t: 'h', lvl: 3, text: 'Socket 骨架' },
        { t: 'code', caption: '服务器：accept 阻塞等连接', code:
`ServerSocket serverSocket = new ServerSocket(1004);   // 端口 1004
while (!serverSocket.isClosed()) {
    Socket socket = serverSocket.accept();            // 阻塞：没连接就一直等
    ClientHandler handler = new ClientHandler(socket);
    new Thread(handler).start();                      // 每个客户端一个线程
}` },
        { t: 'code', caption: '客户端：必须知道 IP + 端口', code:
`Socket socket = new Socket("localhost", 1004);        // 服务器与本机同机时用 localhost` },
        { t: 'table', head: ['概念', '要点'], rows: [
          ['<code>Socket</code>', '客户端座机；<code>getInputStream()</code> / <code>getOutputStream()</code> 拿双向管道'],
          ['<code>ServerSocket</code>', '服务器监听；<code>accept()</code> 返回一个 <code>Socket</code>（代表这次连接）'],
          ['端口', '0–65535；同一台机器同一端口只能被一个 <code>ServerSocket</code> 占用'],
          ['连接式 vs 无连接', '连接式＝<code>Socket</code>/<code>ServerSocket</code>（本项目用）；无连接＝<code>DatagramSocket</code>/<code>DatagramPacket</code>'],
          ['<code>readLine()</code>', '读到一行；<b>流结束或没数据时返回 null</b>，必须判空'],
          ['多客户端', 'IntelliJ 里 Edit Configuration → Modify options → <b>Allow multiple instances</b>']
        ] },
        { t: 'callout', kind: 'warn', html: 'Socket / I/O 方法几乎都要处理 <code>IOException</code>：要么 <code>throws IOException</code> 往上抛，要么 <code>try-catch</code> 包住。写漏了编译不过——这是编程题最常见的扣分点。' }
      ]
    },

    /* ============================================================ 3. 多线程 */
    {
      label: '多线程',
      blocks: [
        { t: 'h', lvl: 3, text: '线程五态（call start() 之后是 Runnable，不是 Running）' },
        { t: 'table', head: ['状态', '怎么进入', '怎么离开'], rows: [
          ['<b>New</b>', '<code>new Thread(r)</code>', '<code>start()</code>'],
          ['<b>Runnable</b>', '<code>start()</code> 之后', '被调度器选中 → Running'],
          ['<b>Running</b>', '拿到 CPU', '时间片用完 / 阻塞 / 结束'],
          ['<b>Blocked / Waiting</b>', '<code>wait()</code>、等锁、<code>join()</code>', '被唤醒 / 拿到锁'],
          ['<b>Timed Waiting</b>', '<code>sleep(ms)</code>、<code>join(ms)</code>', '时间到'],
          ['<b>Terminated</b>', '<code>run()</code> 正常结束或抛未捕获异常', '—']
        ] },
        { t: 'code', caption: '两种创建线程的方式', code:
`// 方式 1：implements Runnable（推荐，还能继承别的类）
class MyTask implements Runnable {
    @Override
    public void run() { System.out.println("thread is running..."); }
}
new Thread(new MyTask()).start();

// 方式 2：继承 Thread
class MyThread extends Thread {
    @Override
    public void run() { System.out.println("My new thread"); }
}
new MyThread().start();

// 方式 3：直接给名字
new Thread(runnable, "client-1").start();` },
        { t: 'table', head: ['易混点', '正确理解'], rows: [
          ['<code>start()</code> vs <code>run()</code>', '<code>start()</code> 开新线程，由 JVM 调 <code>run()</code>；<b>直接调 <code>run()</code> 就是普通方法调用</b>，还在当前线程里跑'],
          ['同一线程 start 两次', '抛 <code>IllegalThreadStateException</code>'],
          ['<code>Thread.sleep</code>', '抛 <code>InterruptedException</code>（checked），要处理'],
          ['进程 vs 线程', '进程有独立内存、重；线程共享内存、轻'],
          ['异常隔离', '一个线程抛异常不影响其他线程（但会终止自己）'],
          ['为什么聊天室要多线程', '每个客户端的 <code>readLine()</code> 都会阻塞，主线程一个人读不了三个人']
        ] },
        { t: 'code', caption: '聊天室 Server 的核心三行', code:
`Socket socket = serverSocket.accept();
ClientHandler clientHandler = new ClientHandler(socket);
new Thread(clientHandler).start();` },
        { t: 'callout', kind: 'warn', html: '判断题最爱考：<b>「调用 <code>start()</code> 后线程立即开始执行 <code>run()</code>」是错的</b>——只是进入 Runnable，还要等调度器给 CPU。' }
      ]
    },

    /* ============================================================ 4. JavaFX */
    {
      label: 'JavaFX',
      blocks: [
        { t: 'h', lvl: 3, text: '一个 JavaFX 程序的最小骨架（六步）' },
        { t: 'code', caption: '抄这段就能跑', code:
`import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.layout.StackPane;
import javafx.stage.Stage;

public class HelloFX extends Application {      // ① extends Application
    @Override
    public void start(Stage stage) {             // ② 重写 start(Stage)
        Button btn = new Button("Hello");        // ③ 创建控件
        btn.setOnAction(e -> System.out.println("clicked")); // ⑥ 注册事件
        StackPane root = new StackPane(btn);     // ④ 放进布局
        Scene scene = new Scene(root, 300, 200); // ⑤ 布局 → Scene
        stage.setScene(scene);                   // ⑥ Scene → Stage
        stage.setTitle("Lab 1004");
        stage.show();                            //    show() 才真正显示
    }
    public static void main(String[] args) {     // ② main 里 launch
        launch(args);
    }
}` },
        { t: 'h', lvl: 3, text: '三层结构与五种布局' },
        { t: 'table', head: ['层级', '是什么', '例子'], rows: [
          ['<b>Stage 舞台</b>', '整个窗口（含标题栏）', '<code>stage.setScene(...)</code> / <code>stage.show()</code>'],
          ['<b>Scene 场景</b>', '窗口里的内容容器，只能有一个根节点', '<code>new Scene(root, w, h)</code>'],
          ['<b>Node 节点</b>', '任何可见元素：控件、图形、布局', '<code>Button</code> / <code>Circle</code> / <code>VBox</code>']
        ] },
        { t: 'table', head: ['布局', '排列方式', '典型用途'], rows: [
          ['<code>HBox</code>', '单行水平排列', '工具栏'],
          ['<code>VBox</code>', '单列垂直排列', '表单、菜单'],
          ['<code>FlowPane</code>', '一行排满自动换行', '标签云、按钮流'],
          ['<code>GridPane</code>', '<b>二维网格</b>（行列坐标）', '棋盘、登录表单'],
          ['<code>StackPane</code>', '<b>层叠</b>（后加的盖在上面）', '棋盘格子（线 + 棋子）']
        ] },
        { t: 'table', head: ['控件', '用途'], rows: [
          ['<code>Label</code>', '一行静态文字'],
          ['<code>Button</code>', '可点击按钮'],
          ['<code>TextField</code> / <code>PasswordField</code>', '文本输入 / 密码（显示为圆点）'],
          ['<code>RadioButton</code> / <code>CheckBox</code>', '单选（组内互斥）/ 多选'],
          ['<code>ScrollBar</code> / <code>Slider</code> / <code>ProgressBar</code>', '滚动 / 取值 / 进度'],
          ['<code>Menu</code> / <code>ToolTip</code>', '菜单栏 / 悬停提示']
        ] },
        { t: 'code', caption: 'Canvas 绘图（五子棋棋盘就靠它）', code:
`Canvas canvas = new Canvas(300, 300);
GraphicsContext gc = canvas.getGraphicsContext2D();   // 拿画笔

gc.setStroke(Color.BLACK);          // 描边颜色
gc.setLineWidth(1);                 // 线宽
gc.beginPath();                     // 开始一条路径
gc.moveTo(30.5, 30.5);              // 起点
gc.lineTo(150.5, 30.5);             // 连到终点
gc.stroke();                        // 描边（stroke = 只画线）

gc.setFill(Color.FORESTGREEN);      // 填充颜色
gc.fillOval(30, 30, 80, 80);        // 画实心椭圆（fill = 填内部）` },
        { t: 'table', head: ['事件概念', '含义'], rows: [
          ['Event Source', '产生事件的控件（如 Button）'],
          ['Event Object', '事件本身（<code>MouseEvent</code> / <code>KeyEvent</code> / <code>ActionEvent</code>）'],
          ['Event Target', '接收事件的节点'],
          ['Event Handler', '处理事件的方法（<code>handle()</code> 或 lambda 体）'],
          ['<code>setOnAction</code>', '按钮点击最常用'],
          ['EventHandler vs EventFilter', 'Handler 在<b>冒泡</b>阶段执行（从目标往根）；Filter 在<b>捕获</b>阶段执行（从根往目标，先执行）']
        ] },
        { t: 'callout', kind: 'warn', html: 'JavaFX 需要单独的 SDK 模块：IntelliJ 里要确认 <b>External Libraries</b> 里有 JavaFX 包，否则会报 <code>Error: JavaFX runtime components are missing</code>。这是项目二最常见的环境问题。' }
      ]
    },

    /* ============================================================ 5. Python */
    {
      label: 'Python',
      blocks: [
        { t: 'h', lvl: 3, text: '和 Java 的十条对应关系' },
        { t: 'table', head: ['Java', 'Python', '注意'], rows: [
          ['<code>int x = 5;</code>', '<code>x = 5</code>', '不声明类型、不加分号'],
          ['<code>{ }</code> 代码块', '<b>缩进</b>（通常 4 空格）', '缩进错了就是语法错误'],
          ['<code>int[] a = new int[3];</code>', '<code>a = [0, 0, 0]</code>', 'list 长度可变'],
          ['<code>a.length</code>', '<code>len(a)</code>', '是函数不是属性'],
          ['<code>a.length()</code>（String）', '<code>len(s)</code>', '同上'],
          ['<code>for (int i=0;i<n;i++)</code>', '<code>for i in range(n):</code>', 'range 不含终点'],
          ['<code>System.out.println(x)</code>', '<code>print(x)</code>', '打印任意类型'],
          ['<code>String.format("%d", n)</code>', '<code>f"{n}"</code>', 'f-string 直接在串里写表达式'],
          ['<code>this.name</code>', '<code>self.name</code>', '每个方法第一个参数都是 self'],
          ['<code>super().__init__()</code> ↔ <code>super(...)</code>', '<code>super().__init__(...)</code>', 'Python 要显式写 __init__']
        ] },
        { t: 'code', caption: 'list 全套方法（必背）', code:
`thislist = ["apple", "banana", "cherry"]
print(thislist[1])          # banana（下标从 0 开始，可负）
print(thislist[2:5])        # 切片：含头不含尾
print(len(thislist))        # 3
if "apple" in thislist:     # in 判断存在
    print("yes")
thislist[1] = "blackcurrant"   # 改
thislist.append("orange")      # 末尾加
thislist.insert(1, "orange")   # 指定位置插
thislist.remove("banana")      # 按值删
del thislist[1]                # 按下标删
list3 = list1 + list2          # 拼接（产生新 list）
list1.extend(list2)            # 原地追加
for value in thislist:         # 直接遍历值
    print(value)
for i in range(len(thislist)): # 遍历下标
    print(thislist[i])` },
        { t: 'h', lvl: 3, text: '类与继承' },
        { t: 'code', caption: 'Python 类的最小骨架', code:
`class Person:
    def __init__(self, name, age):     # 构造器
        self.name = name               # self 就是 Java 的 this
        self.age = age
        self.__deposit = 1000          # __ 开头 = private（名字改写）

    def __str__(self):                 # 相当于 Java 的 toString()
        return f"{self.name}({self.age})"

    def speak(self):
        print(f"{self.name} is {self.age}")

class Student(Person):                 # 继承：括号里写父类
    def __init__(self, name, age, grade):
        super().__init__(name, age)    # 先初始化父类部分
        self.grade = grade

s = Student("John", 18, 3)
print(s)                               # 调 __str__
del s.age                              # 删属性` },
        { t: 'table', head: ['易混点', '正确理解'], rows: [
          ['缩进', '<b>缩进就是语法</b>，同一块必须一致'],
          ['<code>self</code>', '实例方法的第一个参数，调用时不用传'],
          ['<code>__x</code>', '名字改写为 <code>_类名__x</code>，不是真私有，但外部不该直接访问'],
          ['<code>try/except/else/finally</code>', 'except 捕获异常，else 无异常时执行，finally 一定执行'],
          ['<code>random.randint(a, b)</code>', '<b>包含</b> b（Python 的 range 不包含）'],
          ['<code>if __name__ == "__main__":</code>', '只有直接运行本文件时才执行'],
          ['<code>type(x)</code>', '查看类型（Java 用 <code>instanceof</code> 或 <code>getClass()</code>）']
        ] }
      ]
    },

    /* ============================================================ 6. Tkinter */
    {
      label: 'Tkinter',
      blocks: [
        { t: 'h', lvl: 3, text: '四步骨架' },
        { t: 'code', caption: '所有 Tkinter 程序都是这四步', code:
`from tkinter import *

root = Tk()                    # ① 创建根窗口
root.title("Snake Game")
root.geometry("800x800")       # 宽 x 高，或 "800x800+100+50"

canvas = Canvas(root, width=800, height=800, bg='black')  # ② 创建控件
canvas.pack()                                             # ③ 布局（必须）

root.mainloop()                # ④ 进入事件循环（不写就一闪而过）` },
        { t: 'h', lvl: 3, text: '三种几何管理（同一容器只能混用会报错）' },
        { t: 'table', head: ['方法', '机制', '参数'], rows: [
          ['<code>pack()</code>', '按顺序塞进容器（上下左右）', '<code>side=TOP/BOTTOM/LEFT/RIGHT</code>、<code>fill</code>、<code>expand</code>、<code>pady</code>'],
          ['<code>grid()</code>', '<b>二维表格</b>', '<code>row=</code>、<code>column=</code>、<code>rowspan=</code>、<code>columnspan=</code>、<code>sticky=</code>'],
          ['<code>place()</code>', '<b>绝对坐标</b>', '<code>x=</code>、<code>y=</code>、<code>width=</code>、<code>height=</code>']
        ] },
        { t: 'code', caption: 'Canvas 绘图与事件绑定', code:
`canvas.create_line(0, 50, 200, 50, fill="yellow")
canvas.create_rectangle(50, 25, 150, 75, fill="blue")   # x1,y1,x2,y2
canvas.create_oval(10, 10, 60, 60, fill="red")
canvas.create_text(100, 50, text="Python", fill="white")
canvas.delete('all')          # 清屏（贪吃蛇每帧都靠它重画）

def change_direction(event):
    if event.keysym in ['Left', 'Right', 'Up', 'Down']:
        print(event.keysym)
root.bind("<KeyPress>", change_direction)   # 键按下的键名在 event.keysym
# 鼠标：<Button-1> 左键、<Double-1> 双击、<B1-Motion> 按住拖动
# 鼠标坐标：event.x / event.y` },
        { t: 'table', head: ['函数', '作用'], rows: [
          ['<code>after(ms, fn, *args)</code>', 'ms 毫秒后执行 fn，<b>不阻塞</b> mainloop（贪吃蛇的游戏循环就靠它递归调度）'],
          ['<code>destroy()</code>', '销毁窗口 / 控件'],
          ['<code>bind(event, fn)</code>', '把事件绑到函数'],
          ['<code>unbind(event)</code>', '解绑（Snake 的 game_over 会解绑键事件）'],
          ['<code>delete(&#39;all&#39;)</code>', '清空 Canvas（重绘前必做）'],
          ['<code>itemconfig(id, ...)</code> / <code>coords(id, ...)</code>', '改某个图元的属性 / 坐标']
        ] },
        { t: 'callout', kind: 'exam', title: '最高频的一道简答', html: '「<b>为什么 Snack 游戏要用 <code>root.after()</code> 而不是 <code>while</code> + <code>time.sleep()</code>？</b>」<br>答：Tkinter 的 GUI 在单线程里跑，<code>mainloop()</code> 是事件循环。<code>while</code> + <code>sleep</code> 会<b>阻塞主循环</b>，界面不刷新、事件不处理，程序假死；<code>after()</code> 只是把函数登记到事件队列，ms 之后由主循环调用，期间界面照常响应。' }
      ]
    }
  ];

  VIEWS.cheatsheet = function () {
    var root = el('div');
    root.appendChild(pageHead({
      crumb: '<a href="#/">OVERVIEW</a><span>/</span><span>CHEAT_SHEET</span>',
      kicker: 'QUICK_REFERENCE // 速查表',
      title: '课程速查表',
      en: 'CHEAT SHEET · 期末四部分速查',
      meta: [
        ['SECTIONS', String((typeof CHEATSHEET !== 'undefined' ? CHEATSHEET.length : 6)).padStart(2, '0')],
        ['MODE', 'REVIEW'],
        ['TARGET', 'FINAL EXAM']
      ],
      lead: '考前 30 分钟看这一页：继承与多态、I/O 与 Socket、多线程、JavaFX、Python、Tkinter 六块。左边是语法模板，右边是踩坑提醒——都是期末四部分最容易丢分的地方。'
    }));
    var wrap = el('div', { class: 'csWrap' });
    root.appendChild(wrap);
    renderBlocks(wrap, [{ t: 'tabs', items: CHEATSHEET }], {});
    setContent(root);
  };

  /* ------------------------------------------------------------------ 航线图 */
  VIEWS.map = function () {
    var root = el('div');
    root.appendChild(pageHead({
      crumb: '<a href="#/">OVERVIEW</a><span>/</span><span>FLIGHT_PLAN</span>',
      kicker: 'FLIGHT_PLAN // 课程航线图',
      title: '课程航线图',
      en: 'FLIGHT PLAN · 21 个模块的依赖关系',
      meta: [
        ['NODES', '21'],
        ['PARTS', '07'],
        ['DEPENDENCIES', '11']
      ],
      lead: '把 21 章想成一趟飞行：每一站都建立在前面几站之上。虚线是"强依赖"，实线是"同阶段"。点任意节点直接进入模块。'
    }));

    var W = 1080, H = 900, PAD = 40, LABEL_W = 128;
    // 七个编队（Part），每队一条弧——与首页星图的 7 个星区一一对应
    var groups = [
      { name: 'PART I · 课程与工具', color: '#d7ab61', ids: ['ch00', 'ch01', 'ch02'] },
      { name: 'PART II · Java 面向对象', color: '#e06236', ids: ['ch03', 'ch04', 'ch05'] },
      { name: 'PART III · 网络与并发', color: '#9fc0e2', ids: ['ch06', 'ch07', 'ch08'] },
      { name: 'PART IV · JavaFX 界面', color: '#c82337', ids: ['ch09', 'ch10', 'ch11', 'ch12'] },
      { name: 'PART V · 项目实战', color: '#4fb3a8', ids: ['ch13', 'ch14'] },
      { name: 'PART VI · Python', color: '#7fb069', ids: ['ch15', 'ch16', 'ch17', 'ch18', 'ch19'] },
      { name: 'PART VII · 备考', color: '#9b8ac4', ids: ['ch20'] }
    ];
    var BASE_Y = 88, ROW_GAP = 116;
    var nodes = [];
    groups.forEach(function (g, gi) {
      var baseY = BASE_Y + gi * ROW_GAP;
      g.ids.forEach(function (id, i) {
        var meta = chapterMeta.find(function (m) { return m.id === id; });
        if (!meta) return;
        var t = g.ids.length === 1 ? 0.5 : (i + 0.5) / g.ids.length;
        nodes.push({
          id: id, num: meta.num, title: meta.title, en: meta.en,
          x: PAD + LABEL_W + t * (W - PAD * 2 - LABEL_W),
          y: baseY,
          color: g.color,
          group: gi
        });
      });
    });

    var svg = '<svg class="mapSvg" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="课程航线图">';
    svg += '<defs><pattern id="mapGrid" width="36" height="36" patternUnits="userSpaceOnUse">'
      + '<path d="M36 0 H0 V36" fill="none" stroke="rgba(255,255,255,.045)" stroke-width="1"/></pattern></defs>';
    svg += '<rect x="0" y="0" width="' + W + '" height="' + H + '" fill="url(#mapGrid)"/>';

    // 每组一条基线弧
    groups.forEach(function (g, gi) {
      var y = BASE_Y + gi * ROW_GAP;
      svg += '<path d="M' + (PAD + LABEL_W - 34) + ' ' + y + ' C ' + (W * 0.3) + ' ' + (y - 22) + ', ' + (W * 0.7) + ' ' + (y + 22) + ', ' + (W - PAD + 12) + ' ' + y
        + '" fill="none" stroke="' + g.color + '" stroke-opacity=".22" stroke-width="1.4" stroke-dasharray="3 6"/>';
      svg += '<line x1="16" y1="' + (y - 4) + '" x2="' + (PAD + LABEL_W - 40) + '" y2="' + (y - 4) + '" stroke="' + g.color + '" stroke-opacity=".18" stroke-width="1"/>';
      svg += '<text x="16" y="' + (y + 3) + '" fill="' + g.color + '" fill-opacity=".85" '
        + 'font-family="var(--mono)" font-size="8.5" letter-spacing="2.4">' + esc(g.name) + '</text>';
    });

    // 依赖连线（跨章强依赖）
    var deps = [
      ['ch01', 'ch02'], ['ch03', 'ch04'], ['ch04', 'ch09'],
      ['ch06', 'ch07'], ['ch07', 'ch08'], ['ch08', 'ch13'],
      ['ch09', 'ch10'], ['ch11', 'ch12'], ['ch12', 'ch14'],
      ['ch15', 'ch16'], ['ch17', 'ch18'], ['ch18', 'ch19']
    ];
    deps.forEach(function (d) {
      var a = nodes.find(function (n) { return n.id === d[0]; });
      var b = nodes.find(function (n) { return n.id === d[1]; });
      if (!a || !b) return;
      var mx = (a.x + b.x) / 2;
      var my = (a.y + b.y) / 2;
      svg += '<path d="M' + a.x + ' ' + a.y + ' Q ' + mx + ' ' + my + ' ' + b.x + ' ' + b.y
        + '" fill="none" stroke="rgba(255,255,255,.12)" stroke-width="1" stroke-dasharray="2 5"/>';
    });

    nodes.forEach(function (n) {
      svg += '<g class="mapNode" data-ch="' + n.id + '" tabindex="0" role="link" aria-label="' + esc(n.num + ' ' + n.title) + '">';
      svg += '<circle cx="' + n.x + '" cy="' + n.y + '" r="26" fill="#05070a" stroke="' + n.color + '" stroke-opacity=".55" stroke-width="1.2"/>';
      svg += '<circle cx="' + n.x + '" cy="' + n.y + '" r="20" fill="none" stroke="' + n.color + '" stroke-opacity=".16" stroke-width="1" stroke-dasharray="2 4"/>';
      svg += '<text x="' + n.x + '" y="' + (n.y + 5) + '" text-anchor="middle" fill="' + n.color + '" '
        + 'font-family="var(--mono)" font-size="13" font-weight="700">' + esc(n.num) + '</text>';
      svg += '<text x="' + n.x + '" y="' + (n.y + 44) + '" text-anchor="middle" fill="var(--text2)" '
        + 'font-family="var(--font)" font-size="10.5">' + esc(n.title) + '</text>';
      svg += '<text x="' + n.x + '" y="' + (n.y + 58) + '" text-anchor="middle" fill="var(--text3)" '
        + 'font-family="var(--mono)" font-size="7.5" letter-spacing="1">' + esc((n.en || '').slice(0, 26).toUpperCase()) + '</text>';
      svg += '</g>';
    });
    svg += '</svg>';

    var fig = el('div', { class: 'mapWrap', html: svg });
    root.appendChild(fig);
    root.appendChild(el('div', { class: 'mapLegend' }, [
      el('span', { html: '<i class="legendDot" style="background:#d7ab61"></i>课程与工具' }),
      el('span', { html: '<i class="legendDot" style="background:#e06236"></i>Java 面向对象' }),
      el('span', { html: '<i class="legendDot" style="background:#9fc0e2"></i>网络与并发' }),
      el('span', { html: '<i class="legendDot" style="background:#c82337"></i>JavaFX 界面' }),
      el('span', { html: '<i class="legendDot" style="background:#4fb3a8"></i>项目实战' }),
      el('span', { html: '<i class="legendDot" style="background:#7fb069"></i>Python' }),
      el('span', { html: '<i class="legendDot" style="background:#9b8ac4"></i>备考' }),
      el('span', { class: 'dim', text: '虚线 = 依赖关系' })
    ]));
    setContent(root);
    fig.addEventListener('click', function (e) {
      var g = e.target.closest ? e.target.closest('.mapNode') : null;
      if (g) CSC.go('#/' + g.getAttribute('data-ch'));
    });
    fig.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      var g = e.target.closest ? e.target.closest('.mapNode') : null;
      if (g) { e.preventDefault(); CSC.go('#/' + g.getAttribute('data-ch')); }
    });
  };

  /* ------------------------------------------------------------------ Debug 手册 */
  var DEBUG_DB = [
    {
      cat: '编译错误（Java compile-time）',
      items: [
        { err: "cannot find symbol", why: '变量/方法/类名拼错、大小写不符、超出作用域，或忘了 <code>import</code>。', fix: '逐个核对拼写与作用域；用到的类是否已 import（<code>java.util.*</code>、<code>java.io.*</code>、<code>java.net.*</code>）。', code: 'count = 0;              // ✗ 没声明\nint count = 0;          // ✓' },
        { err: "';' expected", why: '上一条语句末尾漏了分号。', fix: '看报错行号的<b>上一行</b>，90% 是那里漏了 <code>;</code>。', code: 'System.out.println("Hi")    // ✗\nSystem.out.println("Hi");   // ✓' },
        { err: 'incompatible types: int cannot be converted to String', why: '类型不匹配。', fix: '转换或用 <code>String.valueOf()</code>。', code: 'String s = 42;                   // ✗\nString s = String.valueOf(42);   // ✓' },
        { err: 'method does not override or implement a method from a supertype', why: '写了 <code>@Override</code>，但方法签名与父类/接口不一致（参数类型、返回值、名字大小写）。', fix: '对比父类方法签名；重写要求签名<b>完全一致</b>。', code: 'class Dog extends Animal {\n    @Override\n    public void Speak() { }   // ✗ 父类是 speak()\n}' },
        { err: 'constructor Dog in class Dog cannot be applied to given types', why: '子类构造器没有正确调用父类构造器，或参数个数/类型不对。', fix: '子类构造器第一句写 <code>super(参数)</code>，参数表与父类匹配。', code: 'public Dog(String name) {\n    super(name);   // ✓ 第一句\n}' },
        { err: 'non-static variable name cannot be referenced from a static context', why: '在 <code>static</code> 方法（含 <code>main</code>）里直接用了实例字段/实例方法。', fix: '先 <code>new</code> 出对象再调，或把该成员改成 <code>static</code>。', code: 'public static void main(String[] a) {\n    System.out.println(name);       // ✗\n    System.out.println(new Dog("x").name);  // ✓\n}' },
        { err: 'unreported exception IOException; must be caught or declared to be thrown', why: '调用了会抛 checked 异常的方法（Socket、I/O），但没有处理。', fix: '方法签名加 <code>throws IOException</code>，或用 <code>try-catch</code> 包住。', code: 'public static void main(String[] args) throws IOException {\n    Socket s = new Socket("localhost", 1004);\n}' },
        { err: 'class Server is public, should be declared in a file named Server.java', why: '文件名与 public 类名不一致。', fix: '两者必须完全一致（含大小写）。', code: '// 文件是 server.java，类却写\npublic class Server { }   // ✗' },
        { err: 'reached end of file while parsing', why: '花括号没配对（通常是少了最后的 <code>}</code>）。', fix: '数一数 <code>{</code> 与 <code>}</code>；IDE 里点一下花括号看配对。</p>', code: 'public class A {\n    public static void main(String[] a) {\n        // 少了两个 }\n' },
        { err: 'variable used in lambda expression should be final or effectively final', why: 'lambda 里引用了之后会被重新赋值的局部变量。', fix: '改用 <code>final</code> 变量，或把值拷到新变量里。', code: 'int x = 0;\nbtn.setOnAction(e -> x++);   // ✗ 编译不过\nfinal int[] box = {0};\nbtn.setOnAction(e -> box[0]++);  // ✓（用数组绕过）' }
      ]
    },
    {
      cat: '运行时异常（Java runtime）',
      items: [
        { err: 'java.lang.NullPointerException', why: '<code>null</code> 上调用了方法或取了字段：对象没 <code>new</code>、数组元素没赋值、<code>readLine()</code> 返回 null 没判。', fix: '顺着报错行号找右手边那个变量，加判空；Socket 读循环必须先判 <code>null</code>。', code: 'String msg = reader.readLine();\nSystem.out.println(msg.length());   // ✗ msg 可能是 null\nif (msg != null) System.out.println(msg.length());  // ✓' },
        { err: 'java.lang.ArrayIndexOutOfBoundsException: Index 5 out of bounds for length 5', why: '下标越界。', fix: '循环条件用 <code>i &lt; a.length</code>（不是 <code>&lt;=</code>）；二维数组注意行列顺序。', code: 'for (int i = 0; i <= a.length; i++)   // ✗ 越界\nfor (int i = 0; i <  a.length; i++)   // ✓' },
        { err: 'java.lang.ArithmeticException: / by zero', why: '整数除以 0。', fix: '除法前判除数是否为 0。', code: 'if (divisor != 0) int r = a / divisor;' },
        { err: 'java.lang.NumberFormatException: For input string: "abc"', why: '<code>Integer.parseInt</code> 收到非纯数字字符串。', fix: '先 <code>trim()</code>，或先试 <code>new Scanner(str).hasNextInt()</code>；输入含空格也是这个错。', code: 'int n = Integer.parseInt(" 42 ".trim());   // ✓' },
        { err: 'java.net.BindException: Address already in use', why: '端口被占用（上一次的服务端没关掉，或有别的程序占用）。', fix: '关掉残留进程，或换端口（如 1004 → 1005）；主函数里 <code>serverSocket.close()</code> 要写。', code: '// 换端口测试\nServerSocket serverSocket = new ServerSocket(1005);' },
        { err: 'java.net.ConnectException: Connection refused', why: '客户端连不上：服务端没启动、端口不一致、IP 写错。', fix: '先启动 Server 再启动 Client；核对两边端口号；本机测试用 <code>"localhost"</code>。', code: 'Socket socket = new Socket("localhost", 1004);\n// 前提：ServerSocket 已经在 1004 上 listen' },
        { err: 'java.lang.IllegalThreadStateException', why: '同一个 <code>Thread</code> 对象调用了两次 <code>start()</code>。', fix: '一个线程对象只能 start 一次；要重跑就 <code>new</code> 一个新线程。', code: 'Thread t = new Thread(task);\nt.start();   // ✓\nt.start();   // ✗ IllegalThreadStateException' },
        { err: 'java.util.ConcurrentModificationException', why: '遍历集合时直接增删元素（聊天室广播时客户端退出最容易踩）。', fix: '用 <code>Iterator.remove()</code>，或先收集要删的元素，遍历完再删。', code: 'for (ClientHandler h : clientHandlers) {\n    clientHandlers.remove(h);     // ✗\n}\nclientHandlers.removeIf(h -> !h.isAlive());  // ✓' },
        { err: 'java.io.IOException: Stream closed', why: '流已经关闭还在读写。', fix: '把 <code>close()</code> 放到所有读写之后；用 try-with-resources 或 finally 保证顺序。', code: 'try {\n    writer.write("hi"); writer.flush();\n} finally {\n    socket.close();          // 最后才关\n}' }
      ]
    },
    {
      cat: '网络与并发（调不通时的排查）',
      items: [
        { err: '程序卡在 accept() 不动', why: '<b>这是正常行为</b>：<code>accept()</code> 在等客户端连接。', fix: '先运行 Server，再运行 Client；确认客户端连的是同一个端口。', code: 'Socket socket = serverSocket.accept();  // 阻塞，直到有人连上来' },
        { err: '一个客户端能聊，两个就卡死', why: '服务端主线程忙着读第一个客户端的 <code>readLine()</code>，没空去 <code>accept</code> 第二个。', fix: '每个 <code>ClientHandler</code> 必须放进独立线程（<code>new Thread(handler).start()</code>）。', code: 'new Thread(new ClientHandler(socket)).start();' },
        { err: '客户端能看到自己发的消息，别人收不到', why: '广播时把消息写回了发送者自己，或 <code>ArrayList&lt;ClientHandler&gt;</code> 只加了一个。', fix: '广播时跳过 <code>this</code>；确认构造器里 <code>clientHandlers.add(this)</code> 在广播之前。', code: 'for (ClientHandler h : clientHandlers) {\n    if (h != this) h.sendMessage(msg);\n}' },
        { err: '消息发出去了但对方没反应', why: '忘了 <code>flush()</code>，数据还在缓冲区。', fix: '每次写完 <code>writer.flush()</code>。', code: 'writer.write(msg);\nwriter.newLine();\nwriter.flush();     // ⚠ 必须有' },
        { err: '用户名读成了别的内容', why: '<code>ClientHandler</code> 构造器里在 <code>readLine()</code> 之前建了别的 reader，或客户端没先发用户名就发消息。', fix: '协议固定顺序：客户端连上先 <code>write(username)</code> + flush，服务端第一件事 <code>readLine()</code> 取用户名。', code: '// Client 端\nwriter.write(username); writer.newLine(); writer.flush();' },
        { err: 'IntelliJ 里只能开一个 Client', why: '默认不允许同一配置运行多个实例。', fix: 'Run → Edit Configurations → Modify options → 勾 <b>Allow multiple instances</b>。', code: '' }
      ]
    },
    {
      cat: 'JavaFX 常见问题',
      items: [
        { err: 'Error: JavaFX runtime components are missing, and are required to run this application', why: '项目没有引入 JavaFX SDK / 模块。', fix: '下载 JavaFX SDK，在 IntelliJ 里加到 Libraries；VM options 加 <code>--module-path ... --add-modules javafx.controls,javafx.fxml</code>。', code: '--module-path "C:/javafx/lib" --add-modules javafx.controls,javafx.fxml' },
        { err: 'Exception in Application start method（java.lang.NullPointerException）', why: '<code>start()</code> 里用了还没初始化的控件，或 FXML 注入的字段为 null。', fix: '检查控件是否在 <code>start</code> 里先创建；<code>@FXML</code> 字段要在 <code>initialize()</code> 之后用，并确认 <code>fx:id</code> 与字段名一致。', code: '@Override\npublic void start(Stage stage) {\n    Button btn = new Button();     // 先创建\n    btn.setText("hi");             // 再使用\n}' },
        { err: '窗口一闪而过 / 只有进程不显示窗口', why: '忘了调 <code>stage.show()</code>。', fix: '在 <code>start()</code> 末尾补 <code>stage.show()</code>。', code: 'stage.setScene(scene);\nstage.show();        // ⚠ 不写就看不见' },
        { err: '点按钮没反应', why: '注册了 <code>setOnAction</code> 但没写 lambda 体，或把事件注册在别的控件上。', fix: '确认 <code>btn.setOnAction(e -&gt; { ... })</code>；用 <code>System.out.println</code> 打点确认真的进到了处理器。', code: 'btn.setOnAction(e -> System.out.println("clicked"));' },
        { err: '控件没显示 / 挤在一起', why: '控件没加进布局，或布局没设进 Scene，或布局的 <code>spacing</code>/<code>padding</code> 没设。', fix: '确认链条完整：控件 → 布局 → <code>new Scene(root)</code> → <code>stage.setScene</code>。（对照第 09 章「六步」）', code: 'VBox root = new VBox(10);      // 10 = spacing\nroot.getChildren().add(btn);\nScene scene = new Scene(root);' },
        { err: 'Exception in thread "JavaFX Application Thread" java.lang.IllegalStateException: Not on FX application thread', why: '在非 FX 线程里直接改界面（例如多线程任务里更新 Label）。', fix: '用 <code>Platform.runLater(() -&gt; { ... })</code> 把界面更新投递回 FX 线程。', code: 'Platform.runLater(() -> label.setText("done"));' }
      ]
    },
    {
      cat: 'Python 与 Tkinter',
      items: [
        { err: "IndentationError: expected an indented block", why: '冒号后面没有缩进，或同一块缩进不一致（混用了 Tab 与空格）。', fix: '统一用 4 个空格；Python 靠缩进定义代码块。', code: 'if 5 > 2:\nprint("big")     # ✗ 没缩进\n    print("big")  # ✓' },
        { err: "SyntaxError: expected ':'", why: '<code>if</code>/<code>for</code>/<code>def</code>/<code>class</code> 行末漏了冒号。', fix: '补冒号。', code: 'def move_snake(self):   # ✓ 别忘冒号' },
        { err: "NameError: name 'self' is not defined", why: '方法定义时漏写 <code>self</code> 参数，或在方法外用了 <code>self</code>。', fix: '实例方法第一个参数必须写 <code>self</code>。', code: 'class Dog:\n    def speak(self):      # ✓\n        print(self.name)' },
        { err: "AttributeError: 'Person' object has no attribute 'name'", why: '属性没在 <code>__init__</code> 里赋值，或拼写不一致（<code>self.name</code> vs <code>self.Name</code>）。', fix: '在 <code>__init__</code> 里初始化所有属性，并统一拼写。', code: 'def __init__(self, name):\n    self.name = name     # ✓ 先赋值再使用' },
        { err: "TypeError: 'str' object is not callable", why: '变量名覆盖了函数名（比如把 <code>list</code>、<code>str</code> 当变量名），或漏了某个方法后的括号。', fix: '别用内置名当变量名；检查是否漏写 <code>()</code>。', code: 'list = [1, 2]        # ✗ 覆盖了内置 list\nmy_list = [1, 2]     # ✓' },
        { err: 'ModuleNotFoundError: No module named \'tkinter\'', why: '当前解释器环境不完整（少见）；或模块名拼错。', fix: '确认 PyCharm 里选的解释器正确；<code>import tkinter</code> 全小写。', code: 'import tkinter as tk\nroot = tk.Tk()' },
        { err: '_tkinter.TclError: cannot use geometry manager pack inside . which already has slaves managed by grid', why: '同一容器里 <b>混用了 <code>pack()</code> 和 <code>grid()</code></b>。', fix: '同一个父容器只用一种几何管理；不同容器可以各用一种。', code: 'root = tk.Tk()\nbtn1.pack()      # ✗ 同一个 root 里\nbtn2.grid()      # ✗ 混用会报错' },
        { err: '界面卡死 / 无响应（Tkinter）', why: '在回调里写了 <code>while</code> + <code>time.sleep()</code>，阻塞了 <code>mainloop()</code>。', fix: '改用 <code>root.after(ms, fn)</code> 递归调度。', code: 'def run_game(self):\n    self.move_snake()\n    self.after(100, self.run_game)   # ✓ 不阻塞\nself.after(100, self.run_game)' },
        { err: '蛇/棋子画出来了但不动', why: '<code>update_ui</code> 里没有先 <code>delete(\'all\')</code>，或者在改完数据后忘了调用它。', fix: '每帧先清屏再重画；确认 <code>move_snake</code> 末尾调用了 <code>update_ui</code>。', code: 'def update_ui(self):\n    self.canvas.delete("all")        # ⚠ 必须\n    for x, y in self.snake:\n        self.canvas.create_rectangle(x, y, x+20, y+20, fill="green")' },
        { err: '方向键一按就死（Snake 撞自己）', why: '没有方向锁：允许 180° 掉头，蛇头直接撞上第二节身体。', fix: '记录相反方向表，禁止反向。', code: 'opposite = {"Left":"Right","Right":"Left","Up":"Down","Down":"Up"}\nif event.keysym != opposite[self.snake_direction]:\n    self.snake_direction = event.keysym' }
      ]
    }
  ];

  VIEWS.debug = function () {
    var root = el('div');
    root.appendChild(pageHead({
      crumb: '<a href="#/">OVERVIEW</a><span>/</span><span>DEBUG_GUIDE</span>',
      kicker: 'ERROR_DATABASE // Debug 手册',
      title: 'Debug 手册',
      en: 'DEBUG GUIDE · 课程高频报错对照',
      meta: [
        ['ENTRIES', String(DEBUG_DB.reduce(function (n, g) { return n + g.items.length; }, 0))],
        ['GROUPS', String(DEBUG_DB.length).padStart(2, '0')],
        ['MODE', 'REFERENCE']
      ],
      lead: '把课程里最常出现的报错按「Java 编译期 / Java 运行时 / 网络与并发 / JavaFX / Python 与 Tkinter」五类整理成对照表：报错原文、原因、修复代码。'
    }));

    var total = 0;
    DEBUG_DB.forEach(function (g) { total += g.items.length; });
    var statRow = el('div', { class: 'statRow' }, [
      statCard(String(total).padStart(2, '0'), 'ERRORS · 收录条目', 'accent'),
      statCard(String(DEBUG_DB.length).padStart(2, '0'), 'CATEGORIES · 错误类型', 'cyan'),
      statCard('60', 'SECONDS · 平均定位时间', 'ok')
    ]);
    root.appendChild(statRow);

    DEBUG_DB.forEach(function (g, gi) {
      var sec = el('section', { class: 'dbgSection' });
      sec.appendChild(el('div', { class: 'dbgCat' }, [
        el('span', { class: 'pn', text: String(gi + 1) }),
        el('h3', { text: g.cat }),
        el('i', { text: g.items.length + ' 条' })
      ]));
      g.items.forEach(function (it) {
        var card = el('div', { class: 'dbgCard' });
        card.appendChild(el('div', { class: 'dbgErr', html: '<span class="dbgTag">ERROR</span><code>' + esc(it.err) + '</code>' }));
        card.appendChild(el('div', { class: 'dbgBody' }, [
          el('div', { class: 'dbgRow' }, [
            el('span', { class: 'dbgK', text: '原因' }),
            el('div', { class: 'dbgV', html: it.why })
          ]),
          el('div', { class: 'dbgRow' }, [
            el('span', { class: 'dbgK', text: '修复' }),
            el('div', { class: 'dbgV', html: it.fix })
          ]),
          it.code ? el('pre', { class: 'dbgCode', html: highlightJava(it.code) }) : null
        ]));
        sec.appendChild(card);
      });
      root.appendChild(sec);
    });
    setContent(root);
    animateCounters(statRow);
  };

  /* ------------------------------------------------------------------ 随机挑战 */
  function randomChallenge() {
    loadQuizPack().then(function (pack) {
      var items = (pack && pack.items) || [];
      if (!items.length) { toast('题库还没加载好，稍后再试', 'warn'); return; }
      var q = items[Math.floor(Math.random() * items.length)];
      var html = '<div class="rqHead"><span class="rqK">RANDOM CHALLENGE</span>'
        + '<span class="rqCh">' + esc(q.ch || '') + '</span></div>'
        + '<div class="rqHost" id="rqHost"></div>';
      CSC.modal(html, { okText: '关闭' });
      var host = qs('#rqHost');
      if (host && CSC.quiz) CSC.quiz.mountCard(host, q, {});
      if (CSC.quiz) CSC.quiz.recordOpen && CSC.quiz.recordOpen(q.id);
    });
  }

  /* ------------------------------------------------------------------ 导出 */
  var CSC = window.CSC = {
    version: VERSION,
    bus: bus,
    chapters: chapters,
    chapterMeta: chapterMeta,
    registerMeta: function (list) { chapterMeta.length = 0; (list || []).forEach(function (m) { chapterMeta.push(m); }); },
    registerChapter: registerChapter,
    getChapter: function (id) { return chapterById[id] || null; },
    loadChapter: loadChapter,
    loadAllChapters: loadAllChapters,
    registerQuizPack: registerQuizPack,
    registerExam: registerExam,
    registerLabs: registerLabs,
    registerProjects: registerProjects,
    registerViz: function (v) { CSC.viz = v; bus.emit('viz:ready', v); },
    loadQuizPack: loadQuizPack,
    loadExams: loadExams,
    loadProjects: loadProjects,

    registerAdvanced: registerAdvanced,
    loadAdvanced: loadAdvanced,
    loadModule: loadModule,
    loadModules: loadModules,
    route: route,
    go: function (hash) { if (location.hash === hash) route(); else location.hash = hash; },
    current: { view: 'home', id: null },
    renderBlocks: renderBlocks,
    renderMarkdownish: function (s) { return s; },
    store: store,
    records: records,
    site: SITE,
    ls: LS,
    migrateExamLegacy: migrateExamLegacy,
    el: el, h: h, on: on, qs: qs, qsa: qsa,
    escapeHtml: esc,
    debounce: debounce,
    toast: toast,
    copy: copyText,
    modal: modal,
    randomChallenge: randomChallenge,
    openCmdk: openCmdk,
    showShortcuts: showShortcuts,
    icon: icon,
    highlightJava: highlightJava,
    codeLines: codeLines,
    labs: labs,
    java: null,
    editor: null,
    viz: null,
    quiz: null,
    exam: null,
    generator: null,
    projects: null,
    advanced: []
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

})();
