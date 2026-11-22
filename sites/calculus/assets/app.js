/* =====================================================================
 * 微积分学习站 · 框架层
 * 职责：
 *   1) window.CSC 命名空间、工具函数、事件总线、localStorage 状态
 *   2) 内容块渲染管线 renderBlocks（含代码高亮、降级、按需加载）
 *   3) 路由 / 侧栏导航 / 右侧本章目录 / 搜索 / 主题 / 快捷键
 *   4) 总览页、实验台索引、题库页、模拟卷页、关于页的外壳
 * 对外 API 见 _dev/CONTRACT.md §3
 * ===================================================================== */
(function () {
  'use strict';

  var VERSION = '1.0.0';
  /* 构建批次：改过任何静态资源后 +1，用于让浏览器缓存失效（与 index.html 中的 ?v= 保持一致） */
  var BUILD = '20261122n4';
  /* 站点身份：data/site.js 在本脚本之前加载，向 window.CSC_SITE 提供本站 id、名称与全部文案 */
  var SITE = window.CSC_SITE || {};
  var SITE_ID = SITE.id || 'calculus';
  var SITE_SHORT = SITE.short || 'CALCULUS';
  var SITE_NAME = SITE.name || '微积分 I';
  var SITE_EN = SITE.en || 'CALCULUS I';
  var SITE_LANG = SITE.lang || 'text';
  var SITE_LABEL = SITE.langLabel || 'Text';
  /* 本课专属命名空间：六站共用同一浏览器存储，却互不覆盖对方的答题与模拟卷记录 */
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

  /* 裸 localStorage 读写：只给一次性迁移用，操作的是六站共用时代的旧键 csc.<key> */
  function legacyGet(k, d) {
    try { var v = localStorage.getItem('csc.' + k); return v == null ? d : JSON.parse(v); }
    catch (e) { return d; }
  }
  function legacyDel(k) { try { localStorage.removeItem('csc.' + k); } catch (e) {} }
  function legacyKeys() {
    try { return Object.keys(localStorage); } catch (e) { return []; }
  }

  /* 迁移标记按站命名空间，避免「先打开的站迁完、其他站以为已迁移而跳过」 */
  var MIGRATED_KEY = 'csc.' + SITE_ID + '.migrated.v3';

  /* 一次性迁移：把六站共用时代的旧键搬进本站命名空间，然后清掉旧键。
     旧的 csc.progress / csc.quiz 直接丢弃（qid 六站重名，无法安全归属）；
     旧模拟卷成绩先整包暂存，等 data/exam.js 就绪后按本站 exam id 精确迁移。 */
  function migrateStorage() {
    try {
      if (localStorage.getItem(MIGRATED_KEY)) return;
      var legacyExam = null;
      legacyKeys().forEach(function (k) {
        if (k.indexOf('csc.exam.') !== 0) return;
        legacyExam = legacyExam || {};
        legacyExam[k.slice(4)] = localStorage.getItem(k);
        /* 保留原始键：别的站也要各自迁移属于自己的 exam id */
      });
      if (legacyExam) store.set('legacyExam', legacyExam);
      if (legacyGet('welcomed', null) !== null) store.set('welcomed', true);
      ['progress', 'last' + 'Chapter', 'welcomed', 'advanced', 'quiz'].forEach(legacyDel);
      localStorage.setItem(MIGRATED_KEY, '1');
    } catch (e) {}
  }

  /* exam 数据加载后调用：只迁移本站已知 exam id 的成绩与历史，重复调用幂等 */
  function migrateExamLegacy(ids) {
    var pending = store.get('legacyExam', null);
    if (!pending || typeof pending !== 'object') return;
    var known = {};
    (ids || []).forEach(function (id) { known[id] = 1; });
    Object.keys(pending).forEach(function (k) {
      var m = k.match(/^exam\.(?:result|attempt)\.(.+)$/);
      var id = m ? m[1] : null;
      if (!id || !known[id]) return;
      try { localStorage.setItem(LS + k, pending[k]); localStorage.removeItem('csc.' + k); } catch (e) {}
      delete pending[k];
    });
    var hist = pending['exam.history'];
    if (hist) {
      var old = null;
      try { old = JSON.parse(hist); } catch (e) { old = null; }
      if (old && typeof old === 'object') {
        var filtered = {}, moved = false;
        Object.keys(old).forEach(function (id) { if (known[id]) { filtered[id] = old[id]; moved = true; } });
        if (moved) store.set('exam.history', filtered);
      }
      delete pending['exam.history'];
    }
    var left = Object.keys(pending).length;
    store.set('legacyExam', left ? pending : null);
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
    compass: '<circle cx="12" cy="12" r="9"/><polygon points="16 8 14 14 8 16 10 10 16 8"/>',
    /* ---------- 数学站专属：符号化图标（24×24 线稿，与上面同一视觉语言） ---------- */
    limit: '<path d="M4 12h8"/><path d="M9 8l4 4-4 4"/><path d="M19 5v14"/><circle cx="19" cy="12" r="1.2"/>',
    tangent: '<path d="M3 19c4.5-9 9-11 18-10.6"/><line x1="2.6" y1="14.4" x2="21" y2="8.2"/><circle cx="11.6" cy="12.3" r="1.1"/>',
    integral: '<path d="M14.6 4.2c-2.6 0-3.4 2.2-3.4 5.2v5.2c0 3-.8 5.2-3.4 5.2"/><path d="M17.4 3.4c-.9-.5-2-.8-2.8-.8"/><path d="M7.8 20.6c.9.5 2 .8 2.8.8"/>',
    solid: '<ellipse cx="12" cy="6.4" rx="7" ry="2.8"/><path d="M5 6.4v11.2c0 1.6 3.1 2.9 7 2.9s7-1.3 7-2.9V6.4"/>',
    exp: '<path d="M3 20.4c6.2 0 8.4-2.2 10.6-6.4C15.8 9.8 18.6 5.4 21 4.2"/>',
    tools: '<path d="M14.4 6.6a4.2 4.2 0 0 0 5.2 5.2"/><path d="M19.6 3.4 16.2 6.8l-2.6-2.6 3.4-3.4z"/><path d="M16.4 11.4 7 20.8l-3.8-3.8 9.4-9.4"/>',
    series: '<path d="M18 4.6H6.4l7 7.4-7 7.4H18"/>',
    polar: '<circle cx="12" cy="12" r="8"/><line x1="12" y1="12" x2="18.8" y2="6.6"/><circle cx="12" cy="12" r="1.3"/>',
    vector: '<line x1="3.2" y1="20.8" x2="18.4" y2="5.6"/><polyline points="12.2 5.6 18.4 5.6 18.4 11.8"/>',
    spacecurve: '<path d="M3 17.6c6-11.6 12 5.8 18-5.8"/><path d="M3 17.6c6-1.8 12 1.8 18-5.8" stroke-dasharray="2 3"/>',
    partial: '<path d="M15.6 4.8c-4.2 0-6.2 2.2-6.2 6.2v7"/><path d="M9.4 12.2h6"/>',
    multiple: '<path d="M7.4 3.4c-2 0-2.4 1.8-2.4 3.8v9.6c0 2 .4 3.8 2.4 3.8"/><path d="M16.6 3.4c2 0 2.4 1.8 2.4 3.8v9.6c0 2-.4 3.8-2.4 3.8"/>',
    field: '<path d="M4 6.5h4.4M4 12h4.4M4 17.5h4.4"/><path d="M15.6 6.5H20M15.6 12H20M15.6 17.5H20"/><path d="m8.4 4.9 1.8 1.6-1.8 1.6M8.4 15.9l1.8 1.6-1.8 1.6"/>',
    diff: '<path d="M4 19c4.2-7 8.6-11.6 15.4-13.8"/><path d="m4 19 4.2.6"/><path d="m19.4 5.2-1 4"/>',
    wave: '<path d="M2 12.4c2.4-5.4 4.8-5.4 7.2 0s4.8 5.4 7.2 0 3.6-2.6 5.6-1"/>',
    formula: '<path d="M4.4 6.4h15.2"/><path d="M9.2 6.4v11.2"/><path d="M4.4 12h7.2"/><path d="M14.4 12h5.2"/>'
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

  /* 语言适配：数学站的内容以公式与文字为主，代码块统一走 text 语言（只转义、不高亮）；
     Java 高亮器保留在文件里，代码站复用同一套框架时仍然可用。 */
  var LANG_KW = { java: JAVA_KW_SET, text: {} };
  var LANG_TYPE_SET = { java: JAVA_TYPE_SET, text: {} };
  var LANG_LABEL = { java: 'Java', text: 'Text' };
  function normalizeLang(lang) {
    var l = String(lang || '').toLowerCase();
    if (l === 'text' || l === 'txt' || l === 'plain' || l === 'pseudo') return 'text';
    return 'java';
  }
  function highlightCode(src, lang) {
    if (normalizeLang(lang) === 'text') return esc(String(src == null ? '' : src));
    return highlightJava(src);
  }

  /** 把高亮 HTML 按行包成 <span class="line">，可选聚焦行 */
  function codeLines(code, focus, lang) {
    var src = String(code || '').replace(/\s+$/, '');
    var lines = highlightCode(src, lang).split('\n');
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
    viz: 'assets/viz.js',
    labs: 'assets/labs.js',
    quiz: 'assets/quiz.js',
    exam: 'assets/exam.js',
    calc: 'assets/calc.js',
    '/chapters': null
  };

  function loadModule(name) {
    if (!MODULE_FILES[name]) return Promise.resolve(false);
    return loadScript(MODULE_FILES[name]);
  }
  function loadModules(names) {
    return Promise.all(names.map(loadModule));
  }

  /* ------------------------------------------------------------------ 成绩记录 */
  /* 成绩记录：只记答题对错统计（错题本/复盘用），不含任何进度语义 */
  var records = (function () {
    var q = store.get('quiz', null) || {};      // { qid: {n, ok} }
    function save() { store.set('quiz', q); }
    return {
      recordQuiz: function (id, ok) {
        var r = q[id] || (q[id] = { n: 0, ok: 0 });
        r.n++; if (ok) r.ok++;
        save();
      },
      quizRec: function (id) { return q[id] || null; },
      all: function () { return q; },
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
          pane.appendChild(renderCodeBlock({ t: 'code', code: tb.code, run: tb.run, trace: tb.trace, caption: tb.caption || tb.label }, ctx));
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
        var cw = el('div', { class: 'compare' });
        ['left', 'right'].forEach(function (side) {
          var s = b[side] || {};
          var card = el('div', { class: 'cmpCard ' + side }, [
            el('div', { class: 'cT', html: (side === 'left' ? '✕ ' : '✓ ') + esc(s.title || (side === 'left' ? 'A' : 'B')) })
          ]);
          if (s.html) card.appendChild(el('div', { html: s.html }));
          if (s.code) card.appendChild(el('pre', { html: highlightJava(s.code) }));
          cw.appendChild(card);
        });
        return cw;
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

      /* ================================================================
       * 数学站专属块
       * ================================================================ */
      case 'list': {                       /* 无序 / 有序列表（正文最常见的块） */
        var lw = el(b.ordered ? 'ol' : 'ul', { class: 'blockList' + (b.ordered ? ' ordered' : '') });
        (b.items || []).forEach(function (itx) {
          lw.appendChild(el('li', { html: typeof itx === 'string' ? itx : (itx && itx.html) || '' }));
        });
        return lw;
      }
      case 'tex': {                        /* 独立公式：一张「公式纸片」 */
        var plate = el('div', { class: 'eqPlate' });
        plate.appendChild(el('div', { html: '$$' + (b.tex || '') + '$$' }));
        if (b.caption) plate.appendChild(el('div', { class: 'eqCap', html: b.caption }));
        return plate;
      }
      case 'example': {                    /* 例题卡：题目 / 思路 / 解答 / 点评 */
        var ex = el('div', { class: 'exCard' });
        var exHead = el('div', { class: 'exHead' }, [
          el('span', { class: 'exNo', text: b.no ? ('例 ' + b.no) : (b.kicker || '例题') }),
          b.tag ? el('span', { class: 'exTag', html: b.tag }) : null
        ]);
        ex.appendChild(exHead);
        var exBody = el('div', { class: 'exBody' });
        (b.fields || []).forEach(function (f) {
          exBody.appendChild(el('div', { class: 'exField', dataset: { k: f.k || '' } }, [
            el('span', { class: 'fk', text: f.k || '' }),
            el('div', { class: 'fv', html: f.html || '' })
          ]));
        });
        if (b.html) exBody.appendChild(el('div', { html: b.html }));
        ex.appendChild(exBody);
        return ex;
      }
      case 'theorem': {                    /* 定理卡：名称 + 条件 / 结论 / 用法 */
        var th = el('div', { class: 'thmCard' });
        var thHead = el('div', { class: 'thmHead' }, [
          b.name ? el('span', { class: 'thmName', text: b.name }) : null,
          b.zh ? el('span', { class: 'thmZh', text: b.zh }) : null
        ]);
        if (thHead.childNodes.length) th.appendChild(thHead);
        var thBody = el('div', { class: 'thmBody' });
        (b.rows || []).forEach(function (r) {
          thBody.appendChild(el('div', { class: 'thmRow', dataset: { k: r.k || '' } }, [
            el('span', { class: 'tk', text: r.k || '' }),
            el('div', { class: 'tv', html: r.html || '' })
          ]));
        });
        if (b.html) thBody.appendChild(el('div', { html: b.html }));
        th.appendChild(thBody);
        return th;
      }
      case 'formula': {                    /* 公式清单：名称 + 公式，两列网格 */
        var fg = el('div', { class: 'formulaGrid' });
        (b.items || []).forEach(function (itx) {
          fg.appendChild(el('div', { class: 'formulaRow' }, [
            el('div', { class: 'frName', html: itx.name || '' }),
            el('div', { class: 'frBody', html: itx.tex ? ('$$' + itx.tex + '$$') : (itx.html || '') })
          ]));
        });
        return fg;
      }
      case 'scope': {                      /* 考纲横幅：期中 / 期末 / 考纲外 */
        var sbx = el('div', { class: 'scopeBar' });
        sbx.appendChild(el('span', {
          class: 'scopeBadge', dataset: { scope: b.scope || 'outside' },
          html: '<i class="sbDot"></i>' + esc(SCOPE_ZH[b.scope] || b.scope || '')
        }));
        if (b.weeks) sbx.appendChild(el('span', { html: 'TEACHING <b>' + esc(b.weeks) + '</b>' }));
        if (b.sections) sbx.appendChild(el('span', { html: 'SECTIONS <b>' + esc(b.sections) + '</b>' }));
        if (b.note) sbx.appendChild(el('span', { html: b.note }));
        return sbx;
      }
      case 'calc': {                       /* 公式演算台（calc.js 提供） */
        var cbx = el('div', { class: 'calcBox' });
        cbx.appendChild(el('div', { class: 'calcHead' }, [
          el('span', { class: 'ci', html: icon('formula') }),
          el('b', { text: b.title || '公式演算台' }),
          el('span', { text: b.desc || '' }),
          el('span', { class: 'calcTag', text: 'interactive' })
        ]));
        cbx.appendChild(el('div', { class: 'calcBody' }, [
          el('div', { class: 'varEmpty', text: '演算台加载中…' })
        ]));
        cbx._calcDef = b;
        pendingCalc.push(cbx);
        /* 触发演算台模块加载；已加载则直接挂载 */
        setTimeout(function () {
          if (window.CSC_CALC) hydrateCalc();
          else ensureCalc();
        }, 0);
        return cbx;
      }
      case 'html':                         /* 兜底：整段 HTML（含 LaTeX），由 MathJax 排版 */
        return el('div', { class: b.cls || '', html: b.html || '' });
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

  /* 自查清单：只在本次页面会话内打勾，不落盘、不计入任何成绩或进度 */
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
      if (done === items.length && items.length) wrap.dataset.all = '1';
      else delete wrap.dataset.all;
    }
    items.forEach(function (txt) {
      var item = el('div', { class: 'checkItem' }, [
        el('span', { class: 'box', html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">' + ICONS.check + '</svg>' }),
        el('span', { class: 'ctext', html: txt })
      ]);
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

  /* 代码块：默认静态展示；本站没有可运行的代码引擎（数学站），因此不出现「运行」按钮 */
  function renderCodeBlock(b, ctx) {
    var lang = normalizeLang(b.lang || SITE_LANG);
    var box = el('div', { class: 'codeBox' });
    var head = el('div', { class: 'codeBoxHead' }, [
      el('span', { class: 'codeDots', html: '<i></i><i></i><i></i>' }),
      el('span', { class: 'cbT', html: (b.caption ? '<b>' + esc(b.caption) + '</b>' : '<b>' + LANG_LABEL[lang] + '</b>') }),
      el('span', { class: 'pill', text: LANG_LABEL[lang] })
    ]);
    if (MODULE_FILES.editor && typeof CSC.editor !== 'undefined' && (b.run !== false || b.trace)) {
      var runBtn = el('button', { class: 'ed-btn primary', html: icon('play') + '<span>运行</span>' });
      head.appendChild(runBtn);
      head.style.gap = '8px';
      runBtn.style.marginLeft = 'auto';
      runBtn.addEventListener('click', function () {
        expand(box, b, ctx, b.trace);
      });
    }
    box.appendChild(head);
    var pre = el('pre', { html: codeLines(b.code || '', b.focus, lang) });
    box.appendChild(pre);

    if (MODULE_FILES.editor && b.trace) {
      // 单步块：直接展开调试面板（这是核心交互）
      setTimeout(function () {
        if (CSC.editor) expand(box, b, ctx, true);
      }, 0);
    }
    return box;
  }

  function expand(box, b, ctx, trace) {
    if (!MODULE_FILES.editor) { CSC.toast('本站为静态内容站，不提供代码运行环境'); return; }
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
    if (!MODULE_FILES.editor) return;
    list.forEach(function (host) {
      if (host.dataset.done) return;
      if (!CSC.editor) {
        // 引擎还没加载好：触发加载后重试（只重试一次，避免死循环）
        if (!host.dataset.waiting) {
          host.dataset.waiting = '1';
          loadModules(['editor']).then(function () {
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
  var pendingCalc = [];
  var calcState = 0;          /* 0 未加载 / 1 加载中 / 2 已就绪 */
  var calcPromise = null;

  /* 考纲范围的显示名（data/index.js 的 scope 字段） */
  var SCOPE_ZH = {
    guide: '学习路线', prereq: '先修基础', midterm: '期中范围', final: '期末范围',
    both: '期中 + 期末', outside: '考纲外', tool: '工具'
  };

  function ensureCalc() {
    if (window.CSC_CALC) return Promise.resolve(window.CSC_CALC);
    if (calcState === 1) return calcPromise;
    calcState = 1;
    calcPromise = loadScript('assets/calc.js').then(function () {
      calcState = window.CSC_CALC ? 2 : 0;
      hydrateCalc();
      return window.CSC_CALC;
    });
    return calcPromise;
  }

  function hydrateCalc(scope) {
    var list = scope ? qsa('.calcBox', scope) : pendingCalc.slice();
    if (!list.length) return;
    if (!window.CSC_CALC) { ensureCalc(); return; }
    list.forEach(function (box) {
      var def = box._calcDef;
      if (!def || box.dataset.done) return;
      box.dataset.done = '1';
      var body = qs('.calcBody', box);
      body.innerHTML = '';
      try {
        window.CSC_CALC.mount(body, def);
        if (window.CSC_MATH) window.CSC_MATH.schedule(body);
      } catch (e) {
        console.error('[calc] 演算台渲染失败', e);
        body.appendChild(el('div', { class: 'varEmpty', text: '演算台渲染失败：' + e.message }));
      }
    });
  }

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
      if (window.CSC_MATH) window.CSC_MATH.schedule(host);
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
  function registerExam(e) {
    exams.push(e);
    try { migrateExamLegacy(exams.map(function (x) { return x.id; })); } catch (err) {}
    bus.emit('exam:ready', e);
  }
  function registerLabs(obj) {
    Object.keys(obj || {}).forEach(function (k) { labs[k] = obj[k]; });
    bus.emit('labs:ready');
    hydrateLabs();
  }

  /* ------------------------------------------------------------------ 进阶轨道 */
  /* 4 个主题分别放在 data/adv-analysis.js / adv-proof.js / adv-numeric.js / adv-challenge.js，
   * 由 #/advanced 按需并行加载；独立数组，不进入 chapterMeta / 主课程 / 航线图。 */
  var ADV_FILES = ['adv-analysis', 'adv-proof', 'adv-numeric', 'adv-challenge'];
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
  function registerAdvanced(data) {
    if (!data || !data.id) return null;
    if (!Array.isArray(advancedData)) advancedData = [];
    var idx = -1;
    for (var i = 0; i < advancedData.length; i++) if (advancedData[i].id === data.id) idx = i;
    if (idx >= 0) advancedData[idx] = data;
    else advancedData.push(data);
    bus.emit('advanced:ready', data);
    return data;
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
    /* 公式排版：视图 DOM 就位后触发；MathJax 未就绪时自动排队，就绪后统一补排 */
    if (window.CSC_MATH) window.CSC_MATH.schedule(c);
  }

  var VIEWS = {};

  /* ------------------------------------------------------------------ 专用页数据 */
  /* data/glossary.js / cheatsheet.js / pitfalls.js / deps.js 由 loadScript 按需注入，
     文件里调用下面四个 register* 函数。页面视图在 ensurePageData 之后再渲染。 */
  var PAGE_DATA = { glossary: null, cheat: null, pitfalls: null, deps: null };
  var PAGE_LOAD = {};
  var PAGE_FILE = {
    glossary: 'data/glossary.js',
    cheat: 'data/cheatsheet.js',
    pitfalls: 'data/pitfalls.js',
    deps: 'data/deps.js'
  };

  function ensurePageData(kind) {
    if (PAGE_DATA[kind]) return Promise.resolve(PAGE_DATA[kind]);
    if (PAGE_LOAD[kind]) return PAGE_LOAD[kind];
    PAGE_LOAD[kind] = loadScript(PAGE_FILE[kind]).then(function () {
      return PAGE_DATA[kind];
    });
    return PAGE_LOAD[kind];
  }

  function registerGlossary(list) { PAGE_DATA.glossary = list || []; bus.emit('page:glossary', PAGE_DATA.glossary); }
  function registerCheat(list) { PAGE_DATA.cheat = list || []; bus.emit('page:cheat', PAGE_DATA.cheat); }
  function registerPitfalls(list) { PAGE_DATA.pitfalls = list || []; bus.emit('page:pitfalls', PAGE_DATA.pitfalls); }
  function registerDeps(obj) { PAGE_DATA.deps = obj || {}; bus.emit('page:deps', PAGE_DATA.deps); }


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
    }
    qs('#rail').innerHTML = '';

    if (VIEWS[view]) VIEWS[view](arg, arg2, raw);
    else VIEWS.home();
    if (window.innerWidth < 860) window.scrollTo(0, 0);
  }
  /* ==================================================================
   * 首页 · 课程世界星图（WORLD CHART）
   * 4 个 Part = 4 个星区；20 颗行星 = 20 章。
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

  /* 每章 → 世界风格（按章节主题挑选，固定不变）
     数学映射：总览=岩质起点 / 函数=海洋 / 极限=冰（趋近）/ 导数=风暴（变化率）
     / 导数应用=沙漠 / 积分=环星（累积成环）/ 积分应用=气态 / 超越函数=熔岩
     / 积分技术=极光 / 级数=冰巨星 / 极坐标=环星 / 向量=气态 / 空间曲线=风暴
     / 偏导=海洋 / 多重积分=冰 / 向量场=极光 / 一阶 ODE=沙漠 / 二阶 ODE=熔岩
     / 附录=岩质 / 速查=冰巨星 */
  var WORLD_MAP = [
    'rocky',     /* ch00 总览与复习路线 */
    'ocean',     /* ch01 函数 */
    'ice',       /* ch02 极限与连续 */
    'storm',     /* ch03 导数 */
    'desert',    /* ch04 导数的应用 */
    'ringed',    /* ch05 积分 */
    'gas',       /* ch06 定积分的应用 */
    'lava',      /* ch07 超越函数 */
    'aurora',    /* ch08 积分技术 */
    'icegiant',  /* ch09 无穷序列与级数 */
    'ringed',    /* ch10 参数方程与极坐标 */
    'gas',       /* ch11 向量与空间几何 */
    'storm',     /* ch12 向量值函数与空间运动 */
    'ocean',     /* ch13 偏导数 */
    'ice',       /* ch14 多重积分 */
    'aurora',    /* ch15 积分与向量场 */
    'desert',    /* ch16 一阶微分方程 */
    'lava',      /* ch17 二阶微分方程 */
    'rocky',     /* ch18 附录 A */
    'icegiant'   /* ch19 全书公式速查表 */
  ];

  var PART_COLORS = { I: '#d7ab61', II: '#e06236', III: '#9fc0e2', IV: '#c82337' };
  var PART_SOFT = {
    I: 'rgba(215, 171, 97, .07)',
    II: 'rgba(224, 98, 54, .06)',
    III: 'rgba(159, 192, 226, .06)',
    IV: 'rgba(200, 35, 55, .06)'
  };

  /* 行星大小 ∝ 课时（20–55 min → 34–58px）；20 颗行星比 14 颗更密，基准整体下调 */
  function worldSize(m) {
    var mins = Math.min(55, Math.max(20, m.minutes || 30));
    return Math.round(34 + (mins - 20) / 35 * 24);
  }

  VIEWS.home = function () {
    var root = el('div', { class: 'home' });
    var stage = el('section', { class: 'starStage' });

    /* 背景细网格 */
    stage.appendChild(el('div', { class: 'solarGrid' }));

    /* ---------- 世界星图 ---------- */
    var system = el('div', { class: 'solarSystem', id: 'solarSystem' });

    /* 左侧核心恒星：点击 = 随机挑战 */
    system.appendChild(el('button', {
      class: 'sunCore', id: 'sunCore', type: 'button',
      title: 'CALCULUS // CORE · 点击随机挑战（快捷键 R）',
      'aria-label': '微积分学习站核心，点击随机挑战'
    }, [
      el('span', { class: 'sunGlow' }),
      el('span', { class: 'sunBody' }, [el('span', { class: 'sunTexture' })]),
      el('span', { class: 'sunCorona' })
    ]));

    /* 轴线 + 星区层 + 星尘 */
    system.appendChild(el('div', { class: 'solarAxis', id: 'solarAxis' }));
    system.appendChild(el('div', { class: 'partLayer', id: 'partLayer' }));
    system.appendChild(el('div', { class: 'asteroidBelt', id: 'asteroidBelt' }));

    /* 20 颗行星 + 入口节点树 */
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
        el('span', { text: 'MISSION_BRIEF // CALCULUS' })
      ]),
      el('h1', { class: 'missionT', html: '从极限到积分<br><em>把微积分想通</em>' }),
      el('div', { class: 'missionEn', text: SITE.missionEn || 'OBSERVATORY FOR CALCULUS · THOMAS 14E SI' }),
      el('p', {
        class: 'missionLede',
        html: SITE.lede || '零基础也能读。每一节都从「为什么」讲起，把符号拆开讲，再让你<b>动手拖、即时算、看得见图</b>。'
      }),
      el('div', { class: 'missionBtns' }, [
        el('a', {
          class: 'btnPrimary',
          href: '#/' + (chapterMeta[0] ? chapterMeta[0].id : 'ch00'),
          html: '<span>▶</span><span>从第一章开始</span>'
        }),
        el('a', { class: 'btnGhost', href: '#/labs', html: '<span>交互实验台</span>' }),
        el('a', { class: 'btnGhost', href: '#/exam', html: '<span>模拟卷</span>' }),
        el('button', {
          class: 'btnGhost', type: 'button', title: '随机抽一道题（快捷键 R）',
          html: '<span>随机挑战</span>',
          'on:click': function () { randomChallenge(); }
        })
      ])
    ]));

    /* ---------- 右：系统读数 dock ---------- */
    var sysTerm = el('div', { class: 'termOut', id: 'homeTerm' });
    stage.appendChild(el('div', { class: 'systemDock' }, [
      el('div', { class: 'dockTitle', html: 'SYSTEM : <b>CALCULUS</b>' }),
      el('div', {
        class: 'dockSub',
        html: 'SECTOR: <b>MATH</b> // TEXT: <b>THOMAS 14E SI</b> // WORLDS: <b>20</b>'
      }),
      el('div', { class: 'dockRows' }, [
        el('div', { html: '&gt; SYSTEM_OVERVIEW: <span class="hl">CALCULUS</span>' }),
        el('div', { html: '&gt; CORE: <b>THOMAS 14E (SI)</b> // TYPE: <b>CALC I</b>' }),
        el('div', { html: '&gt; WORLDS: <b>20</b> // PARTS: <b>04</b>' }),
        el('div', { html: '&gt; THEOREMS: <b>222</b> // QUIZ: <b>270</b>' }),
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

        var tag = el('div', {
          class: 'partTag',
          style: '--part:' + (PART_COLORS[f.roman] || '#9fc0e2')
        }, [
          el('b', { text: 'PART ' + f.roman }),
          el('span', { text: f.name }),
          el('i', { text: f.list[0].num + '–' + f.list[f.list.length - 1].num })
        ]);
        tag.style.left = ((f.start + f.end) / 2).toFixed(1) + 'px';
        tag.style.top = (layoutCache.axisY - 110) + 'px';
        partLayer.appendChild(tag);

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
      /* 太阳回到原位：距舞台左缘 34 + sunD/2，与首颗行星之间留 34px。
         光晕不再靠裁剪避让，而是把半径缩到舞台内（见 observatory.css 第四版） */
      var sunX = 34 + sunD / 2;
      var x0 = 34 + sunD + 34;
      var x1 = W - 40;
      var avail = x1 - x0;

      /* 间距随视口增大，避免行星与节点树挤在一起 */
      var gapIn = Math.max(12, W * 0.013);
      var gapPart = Math.max(34, W * 0.032);
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
        say('> CORE: CALCULUS [CALC-I]\n> SYSTEM: 20 WORLDS // 4 PARTS\n> CLICK: RANDOM CHALLENGE');
      });
      sun.addEventListener('mouseleave', function () {
        say('> SYSTEM READY...\n> 20 WORLDS ONLINE\n> SELECT TARGET');
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
      say('> SYSTEM READY...\n> 4 PARTS // 20 WORLDS\n> SELECT TARGET');
    }, 140);
  }

  /* 页面头：与章节页同一套观测站版式（面包屑 + 读数 + 细线 + 单行简介） */
  function pageHead(opts) {
    opts = opts || {};
    var head = el('header', { class: 'chHead pageHead' }, [
      el('div', { class: 'chTop' }, [
        el('div', { class: 'chCrumbs', html: opts.crumb || '<a href="#/">OVERVIEW</a>' }),
        el('div', { class: 'chSeq', text: opts.seq || 'CALCULUS // OBSERVATORY' })
      ]),
      el('div', { class: 'chKicker', text: opts.kicker || 'SYSTEM_BRIEF // CALCULUS' }),
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

    loadChapter(id).then(function (ch) {
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
        return b.t === 'lab' || b.t === 'calc';
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
      if (ch.goals && ch.goals.length) {
        var goals = el('div', { class: 'goalsBox' }, [
          el('h4', { text: 'MISSION OBJECTIVES // 学完这一章，你应该能' })
        ]);
        var ul = el('ul');
        ch.goals.forEach(function (g) { ul.appendChild(el('li', { html: g })); });
        goals.appendChild(ul);
        head.appendChild(goals);
      }
      /* 招牌公式名片：这一章的"门面公式" */
      if (ch.meta && ch.meta.hero) {
        head.appendChild(el('div', { class: 'chFormulaCard' }, [
          el('span', { class: 'cfk', text: 'CORE_FORMULA' }),
          el('div', { class: 'cfv', html: '$$' + ch.meta.hero + '$$' })
        ]));
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


      /* 考纲横幅：数据里已含 scope block 时以数据为准，缺失时才用 meta 兜底 */
      if (ch.meta && ch.meta.scope &&
          !(ch.blocks || []).some(function (bb) { return bb.t === 'scope'; })) {
        var scopeNode = renderBlock({
          t: 'scope', scope: ch.meta.scope,
          weeks: ch.meta.weeks, sections: ch.meta.sections
        }, {}, []);
        if (scopeNode) wrap.appendChild(scopeNode);
      }

      // 正文
      var anchors = [];
      renderBlocks(wrap, ch.blocks, { chapter: ch, anchors: anchors });

      // 章节底部：中性提示 + 导航（本站不记录阅读进度）
      var tailBar = el('div', { class: 'doneBar' });
      tailBar.appendChild(el('div', { class: 'dt', text: '本章读完可以继续下一章，也可以在题库里巩固一下。' }));
      tailBar.appendChild(el('a', { class: 'qzBtn ghost', href: '#/quiz/' + id, text: '去刷本章题' }));
      wrap.appendChild(tailBar);

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
        kl.appendChild(el('div', { style: 'padding:2px 0', text: k.title }));
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
      lead: '微积分的直觉靠"看见"长出来：拖动参数、切换情形、点下一步，把极限、导数、积分真正变成屏幕上的东西。'
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
  VIEWS.quiz = function (chId) {
    var root = el('div');
    root.appendChild(pageHead({
      crumb: '<a href="#/">OVERVIEW</a><span>/</span><a href="#/quiz">QUIZ_BANK</a>' + (chId ? '<span>/</span><span>MOD_' + esc(chapterTitle(chId).split(' ')[0]) + '</span>' : ''),
      kicker: 'QUESTION_BANK // 题库',
      title: '题库',
      en: 'QUIZ BANK · 即时判分 + 逐题解析',
      meta: [
        ['BANK', 'CALCULUS'],
        ['MODE', 'PRACTICE'],
        ['SCORING', 'AUTO']
      ],
      lead: chId ? '只显示「' + esc(chapterTitle(chId)) + '」相关题目。先想再做，做错看解析。' : '按章节刷题：270 道选择题覆盖全书，每题四个选项逐项给解析。做完立刻判分，并标出它对应的章节与考纲范围。'
    }));
    var host = el('div');
    root.appendChild(host);
    setContent(root);
    loadQuizPack().then(function (pack) {
      if (!CSC.quiz) { host.appendChild(el('div', { class: 'varEmpty', text: '题库组件加载失败' })); return; }
      CSC.quiz.mountList(host, { chapter: chId || '' });
    });
  };

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
        ['PAPERS', 'ONLINE'],
        ['MODE', 'TIMED'],
        ['SCORING', 'AUTO']
      ],
      lead: '围绕本课程考纲的模拟卷：期中范围与期末范围各一套，可计时作答、交卷判分、逐题解析。'
    }));
    var host = el('div');
    root.appendChild(host);
    setContent(root);
    loadExams().then(function () {
      if (!CSC.exam) return;
      CSC.exam.mountList(host);
    });
  };

  /* ------------------------------------------------------------------ 记录导出 / 导入 */
  var RECORDS_FILE_VERSION = 1;
  var RECORDS_APP = 'csc-' + SITE_ID;

  /** 收集本站命名空间下的所有键值（答题对错统计、错题、模拟卷成绩） */
  function collectRecords() {
    var data = {};
    try {
      Object.keys(localStorage).forEach(function (k) {
        if (k.indexOf(LS) !== 0) return;
        data[k.slice(LS.length)] = localStorage.getItem(k);
      });
    } catch (e) {}
    return data;
  }

  function downloadText(filename, text, mime) {
    try {
      var blob = new Blob([text], { type: mime || 'application/json' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url; a.download = filename;
      document.body.appendChild(a); a.click();
      setTimeout(function () {
        if (a.parentNode) a.parentNode.removeChild(a);
        URL.revokeObjectURL(url);
      }, 0);
      return true;
    } catch (e) { return false; }
  }

  function exportRecords() {
    var data = collectRecords();
    var n = Object.keys(data).length;
    if (!n) { CSC.toast('还没有可导出的记录：先做几道题或交一次模拟卷', ''); return; }
    var payload = {
      app: RECORDS_APP,
      fileVersion: RECORDS_FILE_VERSION,
      exportedAt: new Date().toISOString(),
      site: { id: SITE_ID, name: SITE_NAME },
      data: data
    };
    var text = JSON.stringify(payload, null, 2);
    var fname = 'csc-' + SITE_ID + '-records-' + todayStr() + '.json';
    if (!downloadText(fname, text, 'application/json')) {
      if (CSC.copy) CSC.copy(text);
      CSC.toast('浏览器不允许直接下载，记录已复制到剪贴板', 'ok');
      return;
    }
    CSC.toast('已导出 ' + n + ' 项记录：' + fname, 'ok');
  }

  function confirmImport(data) {
    var n = Object.keys(data).length;
    CSC.modal('<h3>导入记录？</h3><p>将写入 <b>' + n + '</b> 项答题 / 模拟卷记录，同名记录会被覆盖。确认后页面会自动刷新。</p>', { okText: '取消' });
    var m = qs('#modal .mcFoot');
    if (!m) return;
    var yes = el('button', { class: 'qzBtn', text: '确认导入' });
    yes.addEventListener('click', function () {
      Object.keys(data).forEach(function (k) {
        try { localStorage.setItem(LS + k, data[k]); } catch (e) {}
      });
      CSC._closeModal && CSC._closeModal();
      CSC.toast('已导入 ' + n + ' 项记录，正在刷新…', 'ok');
      setTimeout(function () { location.reload(); }, 600);
    });
    m.insertBefore(yes, m.firstChild);
  }

  function importRecords() {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.style.position = 'fixed';
    input.style.left = '-9999px';
    document.body.appendChild(input);
    function cleanup() { if (input.parentNode) input.parentNode.removeChild(input); }
    input.addEventListener('change', function () {
      var f = input.files && input.files[0];
      if (!f) { cleanup(); return; }
      var reader = new FileReader();
      reader.onload = function () {
        cleanup();
        var payload;
        try { payload = JSON.parse(String(reader.result)); } catch (e) { CSC.toast('文件不是有效的 JSON', 'err'); return; }
        if (!payload || payload.app !== RECORDS_APP) { CSC.toast('这不是本站导出的记录文件', 'err'); return; }
        var data = payload.data || {};
        if (!Object.keys(data).length) { CSC.toast('文件里没有可导入的记录', 'err'); return; }
        confirmImport(data);
      };
      reader.onerror = function () { cleanup(); CSC.toast('读取文件失败', 'err'); };
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
      '<p class="blockP">整个网站是纯静态文件，没有任何后端与外部依赖，公式也由本地 MathJax 离线排版。<b>直接双击 <code>index.html</code> 就能用</b>；也可以在站点目录执行 <code>py -m http.server 8789</code> 后用浏览器打开（这样才能安装成 App、断网离线）。学习记录存在浏览器 localStorage 里，换浏览器或清缓存会重置。</p>' +
      '<h2 class="blockH">这是什么</h2>' +
      '<p class="blockP">一本<b>给第一次学微积分的人看的教材</b>：把 <b>Thomas\' Calculus 14e (SI) 全书</b>（17 章 + 附录 A + 公式速查）拆成 20 个可观测模块，并对齐 CUHK-Shenzhen <b>Calculus I</b>（AY2026-27 Term 1, L10）的教学范围。</p>' +
      '<p class="blockP">文字按初学者的节奏写：每一节都从「为什么需要这个工具」讲起，每个符号第一次出现都会解释，关键公式一步一步推给你看；讲完立刻用实验台把图像画出来、用题目练一次。不需要先学过微积分，只要会函数和基本代数就能读。</p>' +
      '<div class="tableWrap"><table><thead><tr><th>考纲徽章</th><th>含义</th><th>范围</th></tr></thead><tbody>' +
      '<tr><td><span class="scopeBadge" data-scope="midterm"><i class="sbDot"></i>期中范围</span></td><td>期中考试（10/24）覆盖</td><td>§2.1–5.1（第 2–4 章 + 5.1）</td></tr>' +
      '<tr><td><span class="scopeBadge" data-scope="final"><i class="sbDot"></i>期末范围</span></td><td>期末考试（12/20–27）覆盖</td><td>§5.2–8.8 + §16.1–16.4</td></tr>' +
      '<tr><td><span class="scopeBadge" data-scope="prereq"><i class="sbDot"></i>先修基础</span></td><td>开课前已假定掌握</td><td>第 1 章 函数</td></tr>' +
      '<tr><td><span class="scopeBadge" data-scope="outside"><i class="sbDot"></i>考纲外</span></td><td>本学期不考，作知识体系完整保留</td><td>第 9–15 章、第 17 章</td></tr>' +
      '</tbody></table></div>' +
      '<p class="blockP"><b>第一次读</b>：按侧栏顺序从第 1 章读起，每章按「为什么学 → 逐节讲解 → 例题 → 自查」走完，再点章末的实验台玩一玩。<b>期末冲刺</b>：优先顺序是期末范围 → 期中范围（打底）→ 考纲外（只读不刷题），侧栏带彩色小竖条的章节就是考试范围。</p>' +
      '<h2 class="blockH">界面与操作</h2>' +
      '<div class="tableWrap"><table><tbody>' +
      '<tr><th style="width:130px">首页世界星图</th><td>横向「课程世界星图」：左侧核心恒星＝课程核心（点击＝随机挑战），向右按 4 个 Part 分星区排列 <b>' + chapterMeta.length + ' 颗行星＝' + chapterMeta.length + ' 章</b>。<b>行星直径 ∝ 建议课时</b>，纹理为 10 种程序化世界风格（岩质/海洋/沙漠/冰/极光/气态/环星/风暴/熔岩/冰巨星），环与大气辉光来自 Part 色。</td></tr>' +
      '<tr><th>节点 / FOV</th><td>每颗行星下方是<b>入口节点树</b>（章节 / 实验台 / 题库）；悬停行星会在右侧终端打出该章读数；<code>FOV_SCALE</code> 滑块缩放整张星图；左下 <code>PART_INDEX</code> 是 Part 图例；<b>点左上角徽标</b>随时回到首页。</td></tr>' +
      '<tr><th>侧栏</th><td>按 Part 分组列出 ' + chapterMeta.length + ' 章；考试范围的章名右侧有彩色小竖条；底部四个图标直达实验台 / 题库 / 模拟卷 / 术语表。</td></tr>' +
      '<tr><th>搜索</th><td>顶栏搜索框按 <kbd class="kbd">/</kbd> 聚焦，实时搜索全站正文（含公式与条款）；<kbd class="kbd">⌘K</kbd> 打开命令面板（模块 / 页面 / 操作）。</td></tr>' +
      '</tbody></table></div>' +
      '<h2 class="blockH">主要功能</h2>' +
      '<div class="tableWrap"><table><tbody>' +
      '<tr><th style="width:130px">章节</th><td>每章七段式：10 秒速览 / 核心概念与公式 / 定理与判定法 / 考点与题型 / 典型例题 / 易错点 / 前后章节联系。定理用「定理卡」、例题用「例题卡」呈现，条件、结论、用法、思路、解答、点评分行陈列。</td></tr>' +
      '<tr><th>公式排版</th><td>MathJax 离线渲染。过宽的行内公式会自动提升为独立「公式纸片」；仍然放不下的按顶层等号拆成多行；拆不了的等比缩小。过宽的公式与长表格会提供「可横向滚动」的提示，不再无提示地裁切。</td></tr>' +
      '<tr><th>实验台</th><td>44 个可拖动的 Canvas 实验台：ε-δ 极限、夹逼、黎曼和、FTC、旋转体、泰勒、极坐标、梯度、二重积分、Green 定理、斜率场、阻尼振动……每台有核心公式 + 控件 + 实时读数。</td></tr>' +
      '<tr><th>公式演算台</th><td>章节内嵌的可交互演算器：画函数图、求导、数值积分、极限逼近、泰勒展开、方程求根。改一个参数就能看见微积分在动。</td></tr>' +
      '<tr><th>题库</th><td>270 道选择题，按章节筛选；每题四个选项逐项给解析，答完立刻判分，并显示它对应的小节与考纲范围。支持随机 10 题与错题重做。</td></tr>' +
      '<tr><th>模拟卷</th><td>两套模拟卷：期中范围（§2.1–5.1）与期末范围（§5.2–8.8 + §16）。可在线计时作答、交卷判分、逐题看解析。</td></tr>' +
      '<tr><th>公式速查</th><td>按主题分组的全书公式表（代数三角 / 极限 / 导数 / 积分 / 积分技术 / 超越函数 / 级数 / 坐标向量 / 多元 / 向量场 / 微分方程），可直接对照默写。</td></tr>' +
      '<tr><th>术语表</th><td>英文术语 ↔ 中文对照，按字母索引 + 实时过滤，点卡片跳到它出现的章节。考试卷面是英文的，看不懂术语等于看不懂题。</td></tr>' +
      '<tr><th>易错手册</th><td>全书高频失分点按章收集：错法、正解、口诀。考前扫一遍，比多刷十道题有用。</td></tr>' +
      '<tr><th>航线图</th><td>' + chapterMeta.length + ' 章的依赖关系图：每一站建立在哪几站之上，点节点直接进入章节。</td></tr>' +
      '</tbody></table></div>' +
      '<h2 class="blockH">快捷键</h2>' +
      '<div class="tableWrap"><table><thead><tr><th>按键</th><th>作用</th></tr></thead><tbody>' +
      '<tr><td><kbd class="kbd">⌘K</kbd> / <kbd class="kbd">Ctrl</kbd>+<kbd class="kbd">K</kbd></td><td>命令面板（全局搜索 + 快捷操作）</td></tr>' +
      '<tr><td><kbd class="kbd">/</kbd></td><td>聚焦顶栏搜索框</td></tr>' +
      '<tr><td><kbd class="kbd">?</kbd></td><td>显示快捷键帮助</td></tr>' +
      '<tr><td><kbd class="kbd">R</kbd></td><td>随机挑战一道题</td></tr>' +
      '<tr><td><kbd class="kbd">G</kbd> / <kbd class="kbd">C</kbd> / <kbd class="kbd">M</kbd> / <kbd class="kbd">D</kbd></td><td>术语表 / 公式速查 / 航线图 / 易错手册</td></tr>' +
      '<tr><td><kbd class="kbd">Esc</kbd></td><td>关闭搜索 / 弹窗 / 手机侧栏</td></tr>' +
      '</tbody></table></div>' +
      '<h2 class="blockH">关于课程与教材</h2>' +
      '<p class="blockP">Calculus I（CUHK-Shenzhen，AY2026-27 Term 1，L10，Prof. Ce Ju）为 3 学分英文授课课程。教材：Thomas\' Calculus, 14th Edition in SI Units（Pearson / 高等教育出版社）。考核：Assignments 10% + Weekly Quizzes 25% + Midterm 25%（10 月 24 日）+ Final 40%（12 月 20–27 日）。教学进度：第 1–7 周讲极限、导数及其应用与 §5.1；第 8–14 周讲定积分、积分应用、超越函数、积分技术与一阶微分方程。</p>' +
      '<div class="callout exam"><div class="ct"><span>怎么用它复习</span></div><div class="cb"><p>① 先按考纲徽章把范围筛出来；② 每章读「10 秒速览」与「定理与判定法」建骨架；③ 遮住例题解答自己做一遍；④ 实验台把没想通的几何直观补上；⑤ 题库刷本章题，错的回易错手册找原因；⑥ 考前做一套模拟卷，用错题清单查漏。</p></div></div>' +
      '<h2 class="blockH">视觉与致谢</h2>' +
      '<p class="blockP">界面采用 NASA-Punk Observatory 设计语言（深空底 + 程序化等高线地形 + 仪表读数 + 四色色标），设计参考 <a href="https://github.com/flowersauce/NASA-Punk_Observatory" target="_blank" rel="noopener">flowersauce/NASA-Punk_Observatory</a>（MIT License）；字体为 Jura 与 Roboto Mono（SIL Open Font License），MathJax 3.2.2（Apache License 2.0），均已本地打包、离线可用。内容整理自课堂进度与 Thomas\' Calculus 14e SI，例题与题库为学习用途自编/改写。</p>' +
      (SITE.aboutLines && SITE.aboutLines.length
        ? '<h2 class="blockH">站点信息</h2><div class="tableWrap"><table><tbody id="aboutSiteInfo"></tbody></table></div>'
        : '') +
      '<h2 class="blockH">数据与隐私</h2>' +
      '<p class="blockP">答题记录（每题的对错统计）与模拟卷成绩只保存在你浏览器的本地存储（localStorage）里，键名以 <code>csc.' + SITE_ID + '.</code> 为前缀，六门课互不覆盖；不上传任何服务器。清除浏览器数据或点下面的按钮会清空本站记录。</p>' +
      '<div class="qzActions" id="aboutActions"></div>';
    root.appendChild(body);
    setContent(root);
    if (SITE.aboutLines && SITE.aboutLines.length) {
      var siteTb = qs('#aboutSiteInfo');
      if (siteTb) SITE.aboutLines.forEach(function (row) {
        var tr = el('tr');
        tr.appendChild(el('th', { style: 'width:130px', text: row[0] }));
        tr.appendChild(el('td', { text: row[1] }));
        siteTb.appendChild(tr);
      });
    }
    var acts = qs('#aboutActions');
    if (acts) {
      var resetBtn = el('button', { class: 'qzBtn ghost', html: '<span>清除本站记录</span>' });
      resetBtn.addEventListener('click', function () {
        CSC.modal('<h3>确定清除吗？</h3><p>本站的答题记录与模拟卷成绩都会被清空，无法恢复。</p>', { okText: '取消' });
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
            CSC.toast('已清除本站记录，正在刷新…', 'ok');
            setTimeout(function () { location.reload(); }, 600);
          });
          m.insertBefore(yes, m.firstChild);
        }
      });
      acts.appendChild(resetBtn);
      var exportBtn = el('button', { class: 'qzBtn ghost', html: '<span>导出记录</span>' });
      exportBtn.addEventListener('click', exportRecords);
      acts.appendChild(exportBtn);
      var importBtn = el('button', { class: 'qzBtn ghost', html: '<span>导入记录</span>' });
      importBtn.addEventListener('click', importRecords);
      acts.appendChild(importBtn);
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
          el('span', { class: 'navTxt', text: m.title }),
          (m.scope === 'midterm' || m.scope === 'final' || m.scope === 'both')
            ? el('span', { class: 'navScope', dataset: { scope: m.scope }, title: SCOPE_ZH[m.scope] || '' })
            : null
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
      ['labs', 'flask', '交互实验室'],
      ['quiz', 'target', '题库'],
      ['exam', 'trophy', '模拟卷']
    ]);
    navGroup('Advanced', [
      ['advanced', 'zap', '进阶学习']
    ]);
    navGroup('Reference', [
      ['glossary', 'book', '术语表'],
      ['cheatsheet', 'list', '速查表'],
      ['map', 'compass', '航线图'],
      ['debug', 'warning', '易错手册'],
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
    quiz: ['QB', 'QUIZ BANK'],
    exam: ['EX', 'MOCK EXAMS'],
    glossary: ['GL', 'GLOSSARY'],
    cheatsheet: ['FR', 'FORMULA REF'],
    map: ['MP', 'FLIGHT PLAN'],
    debug: ['PL', 'PITFALL LOG'],
    advanced: ['AV', 'ADVANCED TRACK'],
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
          else if (b.t === 'list') text = (b.items || []).map(function (x) { return stripTags(typeof x === 'string' ? x : (x.html || '')); }).join(' ');
          else if (b.t === 'tex') { text = b.tex || ''; title = b.caption || '公式'; }
          else if (b.t === 'example') text = stripTags(((b.tag || '') + ' ' + (b.fields || []).map(function (f) { return f.html || ''; }).join(' ')));
          else if (b.t === 'theorem') text = (b.name || '') + ' ' + (b.zh || '') + ' ' + stripTags((b.rows || []).map(function (r) { return r.html || ''; }).join(' '));
          else if (b.t === 'formula') text = (b.items || []).map(function (x) { return (x.name || '') + ' ' + (x.tex || ''); }).join(' ');
          else if (b.t === 'html') text = stripTags(b.html || '');
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
    return ({ p: '正文', callout: '提示', code: '代码', table: '表格', terms: '术语', compare: '对比', steps: '步骤', keypoint: '要点',
      list: '要点', tex: '公式', example: '例题', theorem: '定理', formula: '公式', html: '正文' })[t] || '内容';
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
        if (/(极限|导数|积分|级数|泰勒|洛必达|格林|斯托克斯|偏导|多重积分|微分方程|换元|分部|中值|拐点|曲率|梯度|散度|旋度)/.test(q)) score += 8;
        hits.push({ it: it, score: score - Math.min(20, pos / 20) });
      }
    });
    hits.sort(function (a, b) { return b.score - a.score; });
    if (!hits.length) {
      res.innerHTML = '<div class="resEmpty">没有找到「' + esc(q) + '」<br><span class="small">试试：极限、导数、积分、级数、泰勒、洛必达、格林公式</span></div>';
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
    m.onclick = function (e) { if (e.target === m) closeModal(); };
    function closeModal() { m.hidden = true; m.innerHTML = ''; }
    CSC._closeModal = closeModal;
  }

  function openSidebar() { qs('#sidebar').classList.add('open'); qs('#scrim').classList.add('on'); }
  function closeSidebar() { qs('#sidebar').classList.remove('open'); qs('#scrim').classList.remove('on'); }


  /* ==================================================================
   * 命令面板（⌘K / Ctrl+K）：搜索章节、术语、页面与操作
   * ================================================================== */
  var cmdkEl = null, cmdkInput = null, cmdkList = null, cmdkHead = null;
  var cmdkItems = [], cmdkSel = 0;

  function buildCommands() {
    var cmds = [];
    chapterMeta.forEach(function (m) {
      cmds.push({
        kind: 'MODULE', label: m.num + ' · ' + m.title, hint: m.en || '',
        run: function () { CSC.go('#/' + m.id); }
      });
    });
    [
      ['labs', '交互实验室', 'INTERACTIVE LABS'],
      ['quiz', '题库', 'QUIZ BANK'],
      ['exam', '模拟期中卷', 'MOCK EXAMS'],
      ['glossary', '术语表', 'GLOSSARY'],
      ['cheatsheet', '公式速查', 'FORMULA REF'],
      ['map', '课程航线图', 'FLIGHT PLAN'],
      ['advanced', '进阶学习', 'ADVANCED TRACK'],
      ['debug', '易错手册', 'PITFALL LOG'],
      ['about', '使用说明', 'OPERATIONS MANUAL']
    ].forEach(function (p) {
      cmds.push({ kind: 'PAGE', label: p[1], hint: p[2], run: function () { CSC.go('#/' + p[0]); } });
    });
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
    cmdkEl.hidden = false;
    cmdkInput.value = '';
    renderCmdk('');
    setTimeout(function () { cmdkInput.focus(); }, 30);
  }

  function closeCmdk() {
    if (!cmdkEl) return;
    cmdkEl.hidden = true;
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
    ['V', '进阶学习'],
    ['D', '易错手册'],
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
      if (window.CSC_OBS && CSC_OBS.mountBoot) {
        try {
          CSC_OBS.mountBoot(boot, {
            key: 'csc.' + SITE_ID + '.boot.seen',
            minMs: 1700,
            lines: SITE.bootLog || [
              'INITIALIZING CORE .......... OK',
              'LOADING MODULES ............ OK',
              'CONTENT TYPESETTER ......... READY',
              'TOPOGRAPHY RENDERER ........ ONLINE',
              'OPTICS CALIBRATED .......... 100%'
            ]
          });
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
    try { migrateStorage(); } catch (e) {}
    var qBox = qs('#q');
    if (qBox && SITE.searchPlaceholder) qBox.placeholder = 'QUERY // ' + SITE.searchPlaceholder;
    renderNav();
    bindToTop();

    // 侧栏图标
    qs('#helpBtn').innerHTML = icon('help');
    qs('#menuBtn').innerHTML = icon('menu');

    // 侧栏底部快捷入口：实验台 / 题库 / 模拟卷 / 术语表（不占导航滚动区）
    var sideTools = qs('#sideTools');
    if (sideTools) {
      [
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
   * 参考类页面：术语表 / 公式速查 / 航线图 / 易错点手册
   * 这些视图不依赖章节内容文件，按需从已加载数据或内置常量渲染
   * ================================================================== */

  /* ------------------------------------------------------------------ 术语表 */
  /* ------------------------------------------------------------------ 术语表 */
  VIEWS.glossary = function () {
    var root = el('div');
    root.appendChild(pageHead({
      crumb: '<a href="#/">OVERVIEW</a><span>/</span><span>GLOSSARY</span>',
      kicker: 'TERM_DATABASE // 术语表',
      title: '术语表',
      en: 'GLOSSARY · 英文术语 ↔ 中文对照',
      meta: [['SORT', 'A → Z'], ['MODE', 'FILTER'], ['LINK', 'MODULE']],
      lead: '数学卷面是英文的：<b>看不懂术语，等于看不懂题</b>。这里按字母收录全书英文术语，点卡片跳到它出现的章节。'
    }));
    var statRow = el('div', { class: 'statRow' });
    root.appendChild(statRow);

    var bar = el('div', { class: 'glossToolbar' });
    var input = el('input', {
      class: 'glossInput', type: 'search',
      placeholder: '过滤：limit / derivative / integral / convergence / gradient …', spellcheck: 'false'
    });
    bar.appendChild(input);
    var alpha = el('div', { class: 'glossLetters' });
    bar.appendChild(alpha);
    var countEl = el('span', { class: 'glossCount', text: '' });
    bar.appendChild(countEl);
    root.appendChild(bar);

    var list = el('div');
    root.appendChild(list);
    setContent(root);

    var items = [], activeLetter = '';

    function hit(it, q) {
      if (!q) return true;
      return (it.en + ' ' + it.zh + ' ' + stripTags(it.def || '')).toLowerCase().indexOf(q) >= 0;
    }

    function render() {
      var q = String(input.value || '').trim().toLowerCase();
      list.innerHTML = '';
      var shown = 0, groups = {};
      items.forEach(function (it) {
        if (!hit(it, q)) return;
        if (activeLetter && String(it.en || '').charAt(0).toUpperCase() !== activeLetter) return;
        var letter = /^[a-zA-Z]/.test(String(it.en)) ? String(it.en).charAt(0).toUpperCase() : '#';
        (groups[letter] = groups[letter] || []).push(it);
        shown++;
      });
      Object.keys(groups).sort().forEach(function (letter) {
        var sec = el('section', { class: 'glossGroup' });
        sec.appendChild(el('div', { class: 'glossAlphaHead' }, [
          el('span', { text: letter }),
          el('i', { text: groups[letter].length })
        ]));
        var grid = el('div', { class: 'glossGrid' });
        groups[letter].forEach(function (it) {
          var chMeta = chapterMeta.find(function (m) { return m.id === it.ch; });
          grid.appendChild(el('div', { class: 'glossCard' }, [
            el('div', { class: 'ge', text: it.en || '' }),
            el('div', { class: 'gz', html: it.zh || '' }),
            el('div', { class: 'gd', html: it.def || '' }),
            chMeta ? el('div', { class: 'gc' }, [
              el('a', { href: '#/' + it.ch + (it.anchor ? '/' + it.anchor : ''), text: 'MOD ' + chMeta.num + ' · ' + chMeta.title })
            ]) : null
          ]));
        });
        sec.appendChild(grid);
        list.appendChild(sec);
      });
      if (!shown) {
        list.appendChild(el('div', { class: 'emptyState' }, [
          el('div', { class: 'ei', text: '◌' }),
          el('h3', { text: '没有匹配的术语' }),
          el('p', { text: '换个关键词，或点「全部」清空筛选。' })
        ]));
      }
      countEl.textContent = shown + ' / ' + items.length + ' TERMS';
      if (window.CSC_MATH) window.CSC_MATH.schedule(list);
    }

    function buildAlpha() {
      alpha.innerHTML = '';
      var all = el('button', { type: 'button', class: activeLetter ? '' : 'on', text: '全部' });
      all.addEventListener('click', function () {
        activeLetter = '';
        qsa('button', alpha).forEach(function (b) { b.classList.remove('on'); });
        all.classList.add('on');
        render();
      });
      alpha.appendChild(all);
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(function (L) {
        var b = el('button', { type: 'button', class: activeLetter === L ? 'on' : '', text: L });
        b.addEventListener('click', function () {
          activeLetter = L;
          qsa('button', alpha).forEach(function (x) { x.classList.remove('on'); });
          b.classList.add('on');
          render();
        });
        alpha.appendChild(b);
      });
    }

    ensurePageData('glossary').then(function (data) {
      items = (data || []).slice().sort(function (a, b) {
        return String(a.en).toLowerCase().localeCompare(String(b.en).toLowerCase());
      });
      statRow.appendChild(statCard(String(items.length), 'TERMS · 术语总数', 'accent'));
      statRow.appendChild(statCard(String(chapterMeta.length), 'MODULES · 覆盖章节', 'cyan'));
      animateCounters(statRow);
      buildAlpha();
      render();
      input.addEventListener('input', debounce(render, 120));
      if (!items.length) {
        list.innerHTML = '<div class="emptyState"><div class="ei">◌</div><h3>术语数据尚未生成</h3>'
          + '<p>data/glossary.js 还没就绪（或加载失败）。</p></div>';
      }
    });
  };

  /* ------------------------------------------------------------------ 速查表 */
  /* ------------------------------------------------------------------ 公式速查 */
  VIEWS.cheatsheet = function () {
    var root = el('div');
    var wrap = el('div');
    setContent(root);

    ensurePageData('cheat').then(function (groups) {
      groups = groups || [];
      var total = 0;
      groups.forEach(function (g) { total += (g.items || []).length; });
      root.appendChild(pageHead({
        crumb: '<a href="#/">OVERVIEW</a><span>/</span><span>FORMULA_REF</span>',
        kicker: 'FORMULA_REFERENCE // 公式速查',
        title: '公式速查',
        en: 'FORMULA REFERENCE · ' + total + ' 条公式',
        meta: [['GROUPS', String(groups.length).padStart(2, '0')], ['ITEMS', String(total)], ['MODE', 'REVIEW']],
        lead: '考前 30 分钟看这一页。按主题分组，点标签切换；公式由 MathJax 排版，可直接对照默写。'
      }));

      var bar = el('div', { class: 'cheatTabs' });
      var search = el('input', {
        class: 'glossInput', type: 'search',
        placeholder: '过滤公式：导数 / 积分 / 级数 / 格林 …', spellcheck: 'false'
      });
      root.appendChild(search);
      root.appendChild(bar);

      var host = el('div');
      root.appendChild(host);
      var active = 0, q = '';

      function renderGroup() {
        host.innerHTML = '';
        var g = groups[active];
        if (!g) return;
        var items = (g.items || []).filter(function (it) {
          if (!q) return true;
          return ((it.name || '') + ' ' + (it.tex || '') + ' ' + (it.note || '')).toLowerCase().indexOf(q) >= 0;
        });
        var sec = el('section', { class: 'cheatGroup' });
        sec.appendChild(el('h3', { text: (g.group || '') + ' · ' + items.length + ' 条' }));
        items.forEach(function (it) {
          sec.appendChild(el('div', { class: 'cheatItem' }, [
            el('div', { class: 'cn', text: it.name || '' }),
            it.tex ? el('div', { class: 'cb', html: '$$' + it.tex + '$$' })
              : el('div', { class: 'cb', html: it.html || '' }),
            it.note ? el('div', { class: 'cheatNote', html: it.note }) : null
          ]));
        });
        if (!items.length) sec.appendChild(el('div', { class: 'dim', text: '这一组里没有匹配的公式。' }));
        host.appendChild(sec);
        if (window.CSC_MATH) window.CSC_MATH.schedule(host);
      }

      groups.forEach(function (g, i) {
        var b = el('button', { class: 'cheatTab' + (i === 0 ? ' on' : ''), type: 'button', text: g.group || ('组 ' + (i + 1)) });
        b.addEventListener('click', function () {
          active = i;
          qsa('.cheatTab', bar).forEach(function (x) { x.classList.remove('on'); });
          b.classList.add('on');
          renderGroup();
        });
        bar.appendChild(b);
      });
      search.addEventListener('input', debounce(function () {
        q = String(search.value || '').trim().toLowerCase();
        renderGroup();
      }, 140));
      renderGroup();
      if (!groups.length) {
        root.appendChild(el('div', { class: 'emptyState' }, [
          el('div', { class: 'ei', text: '◌' }),
          el('h3', { text: '公式数据尚未生成' }),
          el('p', { text: 'data/cheatsheet.js 还没就绪（或加载失败）。' })
        ]));
      }
    });
  };

  /* ------------------------------------------------------------------ 航线图 */
  /* ------------------------------------------------------------------ 航线图 */
  VIEWS.map = function () {
    var root = el('div');
    setContent(root);

    ensurePageData('deps').then(function (data) {
      data = data || {};
      var deps = data.edges || [];
      var partMeta = [
        { key: 'I', color: '#d7ab61' },
        { key: 'II', color: '#e06236' },
        { key: 'III', color: '#9fc0e2' },
        { key: 'IV', color: '#c82337' }
      ];
      root.appendChild(pageHead({
        crumb: '<a href="#/">OVERVIEW</a><span>/</span><span>FLIGHT_PLAN</span>',
        kicker: 'FLIGHT_PLAN // 课程航线图',
        title: '课程航线图',
        en: 'FLIGHT PLAN · ' + chapterMeta.length + ' 个模块的依赖关系',
        meta: [
          ['NODES', String(chapterMeta.length)],
          ['PARTS', '04'],
          ['EDGES', String(deps.length)]
        ],
        lead: '把 ' + chapterMeta.length + ' 章想成一趟飞行：每一站都建立在前面几站之上。曲线 = 前置依赖，点任意节点直接进入模块。'
      }));

      /* ---- 布局：4 条编队（Part），每条弧上按章节顺序排节点 ---- */
      var W = 1100, H = 620, PAD = 42, LABEL_W = 130;
      var groups = [];
      var byPart = {};
      chapterMeta.forEach(function (m) {
        var pname = m.part || 'Part I';
        if (!byPart[pname]) { byPart[pname] = []; groups.push(pname); }
        byPart[pname].push(m);
      });
      var nodes = [];
      groups.forEach(function (pname, gi) {
        var roman = (pname.match(/Part ([IVX]+)/) || [])[1] || 'I';
        var color = (partMeta.find(function (p) { return p.key === roman; }) || partMeta[0]).color;
        var baseY = 96 + gi * 138;
        var list = byPart[pname];
        list.forEach(function (m, i) {
          var t = (i + 0.5) / list.length;
          nodes.push({
            id: m.id, num: m.num, title: m.title, en: m.en,
            x: PAD + LABEL_W + t * (W - PAD * 2 - LABEL_W),
            y: baseY, color: color, part: roman
          });
        });
      });

      var svg = '<svg class="mapSvg" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="课程航线图">';
      svg += '<defs><pattern id="mapGrid" width="36" height="36" patternUnits="userSpaceOnUse">'
        + '<path d="M36 0 H0 V36" fill="none" stroke="rgba(255,255,255,.045)" stroke-width="1"/></pattern></defs>';
      svg += '<rect x="0" y="0" width="' + W + '" height="' + H + '" fill="url(#mapGrid)"/>';

      groups.forEach(function (pname, gi) {
        var roman = (pname.match(/Part ([IVX]+)/) || [])[1] || 'I';
        var color = (partMeta.find(function (p) { return p.key === roman; }) || partMeta[0]).color;
        var y = 96 + gi * 138;
        svg += '<line x1="14" y1="' + (y - 4) + '" x2="' + (PAD + LABEL_W - 40) + '" y2="' + (y - 4) + '" stroke="' + color + '" stroke-opacity=".18" stroke-width="1"/>';
        svg += '<text x="14" y="' + (y + 4) + '" fill="' + color + '" fill-opacity=".9" '
          + 'font-family="var(--mono)" font-size="8.5" letter-spacing="2.2">PART ' + roman + '</text>';
        svg += '<text x="14" y="' + (y + 18) + '" fill="var(--text3)" '
          + 'font-family="var(--mono)" font-size="7.5" letter-spacing="1">' + esc(pname.replace(/^Part\s+[IVX]+\s*·\s*/, '')) + '</text>';
      });

      /* 依赖边：从 from 到 to 画一条弧（跨 Part 时弧度更大） */
      deps.forEach(function (e) {
        var a = nodes.find(function (n) { return n.id === e[0]; });
        var b = nodes.find(function (n) { return n.id === e[1]; });
        if (!a || !b) return;
        var midX = (a.x + b.x) / 2;
        var lift = Math.abs(a.y - b.y) > 10 ? 46 : 30;
        var midY = (a.y + b.y) / 2 - lift;
        var strong = e[2] === '强';
        svg += '<path d="M' + a.x + ' ' + a.y + ' Q ' + midX + ' ' + midY + ' ' + b.x + ' ' + b.y + '" fill="none" '
          + 'stroke="' + (strong ? 'rgba(215,171,97,.42)' : 'rgba(159,192,226,.20)') + '" stroke-width="' + (strong ? 1.3 : 1)
          + '" ' + (strong ? '' : 'stroke-dasharray="3 5"') + '/>';
      });

      nodes.forEach(function (n) {
        svg += '<a href="#/' + n.id + '" class="mapLink">';
        svg += '<g class="mapNode" data-ch="' + n.id + '" tabindex="0" role="link" aria-label="' + esc(n.num + ' ' + n.title) + '">';
        svg += '<circle cx="' + n.x + '" cy="' + n.y + '" r="27" fill="#05070a" stroke="' + n.color + '" stroke-opacity=".6" stroke-width="1.2"/>';
        svg += '<circle cx="' + n.x + '" cy="' + n.y + '" r="21" fill="none" stroke="' + n.color + '" stroke-opacity=".16" stroke-width="1" stroke-dasharray="2 4"/>';
        svg += '<text x="' + n.x + '" y="' + (n.y + 5) + '" text-anchor="middle" fill="' + n.color + '" '
          + 'font-family="var(--mono)" font-size="13" font-weight="700">' + esc(n.num) + '</text>';
        svg += '<text x="' + n.x + '" y="' + (n.y + 46) + '" text-anchor="middle" fill="var(--text2)" '
          + 'font-family="var(--font)" font-size="10.5">' + esc(n.title) + '</text>';
        svg += '<text x="' + n.x + '" y="' + (n.y + 60) + '" text-anchor="middle" fill="var(--text3)" '
          + 'font-family="var(--mono)" font-size="7.5" letter-spacing=".6">' + esc((n.en || '').slice(0, 24).toUpperCase()) + '</text>';
        svg += '</g></a>';
      });
      svg += '</svg>';

      var fig = el('div', { class: 'mapWrap', html: svg });
      root.appendChild(fig);

      /* 文字版依赖列表 */
      var legend = el('div', { class: 'depList' });
      legend.appendChild(el('div', { class: 'depHead', text: 'DEPENDENCY_INDEX // 逐章前置与后续' }));
      chapterMeta.forEach(function (m) {
        var pre = deps.filter(function (e) { return e[1] === m.id; }).map(function (e) { return e[0]; });
        var nxt = deps.filter(function (e) { return e[0] === m.id; }).map(function (e) { return e[1]; });
        function chip(id, kind) {
          var mm = chapterMeta.find(function (x) { return x.id === id; });
          if (!mm) return null;
          return el('a', { class: 'depChip ' + kind, href: '#/' + id, text: mm.num + ' ' + mm.title });
        }
        var row = el('div', { class: 'depRow' }, [
          el('span', { class: 'depNum', text: m.num }),
          el('span', { class: 'depTitle', text: m.title })
        ]);
        var preW = el('span', { class: 'depSet' }, [el('i', { text: '前置' })]);
        var nxtW = el('span', { class: 'depSet' }, [el('i', { text: '后续' })]);
        (pre.length ? pre : ['']).forEach(function (id) {
          var c = id ? chip(id, 'pre') : el('span', { class: 'dim', text: '—' });
          if (c) preW.appendChild(c);
        });
        (nxt.length ? nxt : ['']).forEach(function (id) {
          var c = id ? chip(id, 'next') : el('span', { class: 'dim', text: '—' });
          if (c) nxtW.appendChild(c);
        });
        row.appendChild(preW);
        row.appendChild(nxtW);
        legend.appendChild(row);
      });
      root.appendChild(legend);

      mapNav(fig);
      if (!deps.length) {
        root.appendChild(el('div', { class: 'emptyState' }, [
          el('div', { class: 'ei', text: '◌' }),
          el('h3', { text: '依赖数据尚未生成' }),
          el('p', { text: 'data/deps.js 还没就绪（或加载失败）。' })
        ]));
      }
    });
  };

  function mapNav(fig) {
    fig.addEventListener('click', function (e) {
      var g = e.target.closest ? e.target.closest('.mapNode') : null;
      if (g) { e.preventDefault(); CSC.go('#/' + g.getAttribute('data-ch')); }
    });
    fig.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      var g = e.target.closest ? e.target.closest('.mapNode') : null;
      if (g) { e.preventDefault(); CSC.go('#/' + g.getAttribute('data-ch')); }
    });
  }

  /* ------------------------------------------------------------------ Debug 手册 */
  /* ------------------------------------------------------------------ 易错手册 */
  VIEWS.debug = function () {
    var root = el('div');
    setContent(root);

    ensurePageData('pitfalls').then(function (data) {
      var items = data || [];
      root.appendChild(pageHead({
        crumb: '<a href="#/">OVERVIEW</a><span>/</span><span>PITFALL_LOG</span>',
        kicker: 'ERROR_LOG // 易错点手册',
        title: '易错点手册',
        en: 'PITFALL LOG · 全书高频失分点',
        meta: [
          ['ENTRIES', String(items.length)],
          ['MODULES', String(chapterMeta.length)],
          ['MODE', 'REFERENCE']
        ],
        lead: '微积分的分数大多丢在「会但做错」：换元忘换限、变限求导漏链式因子、面积不分段……这里按章收集，点开看错法与正解。'
      }));

      var statRow = el('div', { class: 'statRow' }, [
        statCard(String(items.length), 'ENTRIES · 收录条目', 'accent'),
        statCard(String(chapterMeta.length), 'MODULES · 覆盖章节', 'cyan'),
        statCard('04', 'CATEGORIES · 错因类型', 'ok')
      ]);
      root.appendChild(statRow);
      animateCounters(statRow);

      var bar = el('div', { class: 'glossToolbar' });
      var input = el('input', {
        class: 'glossInput', type: 'search',
        placeholder: '过滤：换元 / 洛必达 / 泰勒 / 变限求导 …', spellcheck: 'false'
      });
      bar.appendChild(input);
      var countEl = el('span', { class: 'glossCount', text: '' });
      bar.appendChild(countEl);
      root.appendChild(bar);

      var host = el('div', { class: 'misList' });
      root.appendChild(host);

      var byCh = {};
      items.forEach(function (it) { (byCh[it.ch || 'other'] = byCh[it.ch || 'other'] || []).push(it); });

      function render() {
        var q = String(input.value || '').trim().toLowerCase();
        host.innerHTML = '';
        var shown = 0;
        chapterMeta.forEach(function (m) {
          var list = (byCh[m.id] || []).filter(function (it) {
            if (!q) return true;
            return ((it.title || '') + ' ' + (it.tag || '') + ' ' + stripTags(it.html || '') + ' ' + (it.fix || '')).toLowerCase().indexOf(q) >= 0;
          });
          if (!list.length) return;
          shown += list.length;
          var sec = el('section', { class: 'misSection' });
          sec.appendChild(el('div', { class: 'misHead' }, [
            el('span', { class: 'misNum', text: m.num }),
            el('span', { class: 'misTitle', text: m.title }),
            el('i', { text: list.length + ' 条' })
          ]));
          list.forEach(function (it) {
            var d = el('details', { class: 'misCard' });
            d.appendChild(el('summary', {}, [
              el('span', { class: 'mcTag', text: it.tag || '易错' }),
              el('span', { class: 'mcT', text: it.title || '' }),
              it.fix ? el('span', { class: 'mcCh', text: it.fix }) : null
            ]));
            d.appendChild(el('div', { class: 'mcBody', html: it.html || '' }));
            sec.appendChild(d);
          });
          host.appendChild(sec);
        });
        if (!shown) {
          host.appendChild(el('div', { class: 'emptyState' }, [
            el('div', { class: 'ei', text: '◌' }),
            el('h3', { text: '没有匹配的易错点' }),
            el('p', { text: '换个关键词，或清空筛选。' })
          ]));
        }
        countEl.textContent = shown + ' / ' + items.length + ' ENTRIES';
        if (window.CSC_MATH) window.CSC_MATH.schedule(host);
      }
      render();
      input.addEventListener('input', debounce(render, 140));
      if (!items.length) {
        host.appendChild(el('div', { class: 'emptyState' }, [
          el('div', { class: 'ei', text: '◌' }),
          el('h3', { text: '易错点数据尚未生成' }),
          el('p', { text: 'data/pitfalls.js 还没就绪（或加载失败）。' })
        ]));
      }
    });
  };

  /* ==================================================================
   * 进阶轨道（课程之外的深入学习模块）
   * 独立数组（CSC.registerAdvanced），不进入 chapterMeta / 主课程 / 航线图。
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
      kicker: 'ADVANCED_TRACK // 进阶学习 · 课程之外',
      title: isDetail ? '进阶主题' : '进阶学习',
      en: 'ADVANCED TRACK · 课程之外的深入学习',
      meta: [
        ['TOPICS', '04'],
        ['MODE', 'BEYOND SYLLABUS'],
        ['PROGRESS', 'SEPARATE']
      ],
      lead: '进阶学习是主课程之外的深入内容：把课上「先跳过」的严格证明、数值方法、'
        + '证明技巧与挑战题补齐。它不进入主课程主线与航线图，也不进入主课程统计——想读就读，不影响主线。'
    }));
    var host = el('div', { class: 'advHost' });
    root.appendChild(host);
    setContent(root);
    host.appendChild(el('div', { class: 'learnEmpty' }, [
      el('div', { class: 'learnEmptyT', text: '正在载入进阶内容…' }),
      el('div', { class: 'learnEmptyD', text: '第一次进入会加载 4 个进阶主题的内容。' })
    ]));
    loadAdvanced().then(function (list) {
      if (CSC.current.view !== 'advanced') return;
      host.innerHTML = '';
      list = list || [];
      if (!list.length) {
        host.appendChild(el('div', { class: 'learnEmpty' }, [
          el('div', { class: 'learnEmptyT', text: '进阶内容加载失败' }),
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
        el('div', { class: 'learnEmptyT', text: '进阶内容加载失败' }),
        el('div', { class: 'learnEmptyD', text: String((e && e.message) || e) })
      ]));
    });
  };

  function advBanner() {
    return el('div', { class: 'advBanner' }, [
      el('span', { class: 'advBannerK', text: 'OUTSIDE_THE_SYLLABUS' }),
      el('span', { class: 'advBannerT', text: '课程之外 · 不属于主课程（' + chapterMeta.length + ' 章主线与航线图均不含本模块）' })
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
        + '公式同样由 MathJax 排版，涉及计算的部分可以对照站内 7 个公式演算台与 44 个交互实验台一起看。'
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
        el('a', { class: 'learnEmptyBtn', href: '#/advanced', text: '← 返回进阶学习' })
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
      renderBlocks(body, sec.blocks || [], { chapter: { id: topic.id, title: topic.title }, anchors: [] });
      secNode.appendChild(body);
      sectionHost.appendChild(secNode);
      anchors.push({ id: sid, text: 'S' + (si + 1) + ' · ' + (sec.title || '') });
    });
    host.appendChild(sectionHost);
    /* 进阶内容同样含公式与表格：渲染完成后触发 MathJax 与尺寸自适应 */
    if (window.CSC_MATH) window.CSC_MATH.schedule(host);
    /* 进阶内容也可以嵌实验台 / 内嵌题 / 演算台：渲染后补挂这些组件 */
    try { hydrateLabs(host); } catch (e) {}
    try { hydrateCalc(host); } catch (e) {}
    try {
      loadQuizPack().then(function () { try { hydrateQuiz(host); } catch (e) {} });
    } catch (e) {}

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
      card.appendChild(el('div', { class: 'advRailNote', text: '课程之外 · 不进入主课程' }));
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
        ['PAPERS', '04'],
        ['MODE', 'TIMED'],
        ['SCORING', 'AUTO']
      ],
      lead: '四套在线卷：A（2024 式读程序）/ B（2025 式混合）/ M2（Midterm 2 范围）/ F（Final 范围）。像真考试一样计时，交卷后逐题判分并给出解析。'
    }));
    var host = el('div');
    root.appendChild(host);
    setContent(root);
    loadExams().then(function () {
      if (!CSC.exam) return;
      CSC.exam.mountList(host);
    });
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
    registerAdvanced: registerAdvanced,
    loadAdvanced: loadAdvanced,
    registerGlossary: registerGlossary,
    registerCheat: registerCheat,
    registerPitfalls: registerPitfalls,
    registerDeps: registerDeps,
    registerViz: function (v) { CSC.viz = v; bus.emit('viz:ready', v); },
    loadQuizPack: loadQuizPack,
    loadExams: loadExams,
    loadModule: loadModule,
    loadModules: loadModules,
    route: route,
    go: function (hash) { if (location.hash === hash) route(); else location.hash = hash; },
    current: { view: 'home', id: null },
    renderBlocks: renderBlocks,
    renderMarkdownish: function (s) { return s; },
    store: store,
    records: records,
    SITE: SITE,
    SITE_ID: SITE_ID,
    SITE_NAME: SITE_NAME,
    exportRecords: exportRecords,
    importRecords: importRecords,
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
    highlightCode: highlightCode,
    codeLines: codeLines,
    labs: labs,
    java: null,
    editor: null,
    viz: null,
    quiz: null,
    exam: null
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

})();
