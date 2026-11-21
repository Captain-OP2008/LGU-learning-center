/* =====================================================================
 * 通用编程课程学习站 · 框架层（data/site.js 提供课程标识）
 * 职责：
 *   1) window.CSC 命名空间、工具函数、事件总线、按课程隔离的本地存储
 *   2) 内容块渲染管线 renderBlocks（含代码高亮、静态代码展示与复制）
 *   3) 路由 / 侧栏导航 / 右侧本章目录 / 搜索 / 主题 / 快捷键
 *   4) 总览页、题库页、模拟卷页、项目页、速查表、关于页的外壳
 * 对外 API 见 _dev/CONTRACT.md §3
 * ===================================================================== */
(function () {
  'use strict';

  var VERSION = '2.0.0';
  /* 构建批次：改过任何静态资源后 +1，用于让浏览器缓存失效（与 index.html 中的 ?v= 保持一致） */
  var BUILD = '20261121n8';
  var SITE_ID = (window.CSC_SITE && window.CSC_SITE.id) || 'python';
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

  /* ------------------------------------------------------------------ 站点配置 */
  var SITE = window.CSC_SITE || {};
  var SITE_SHORT = SITE.short || 'CSC';
  var SITE_NAME = SITE.name || '编程导论';
  var SITE_LANG = SITE.lang || 'text';
  var SITE_LABEL = SITE.langLabel || '代码';

  /* ------------------------------------------------------------------ 语法高亮（Python / C / Shell 通用） */
  var LANG_KW = {
    python: ('def return if elif else for while in not and or import from as class try except finally with lambda '
      + 'None True False pass break continue is global nonlocal assert del raise yield async await').split(' '),
    bash: ('if then else elif fi for while do done case esac function in return local export cd echo exit').split(' '),
    c: ('auto break case char const continue default do double else enum extern float for goto if inline int long '
      + 'register restrict return short signed sizeof static struct switch typedef union unsigned void volatile while').split(' ')
  };
  var LANG_KW_SET = {};
  Object.keys(LANG_KW).forEach(function (k) { LANG_KW_SET[k] = {}; LANG_KW[k].forEach(function (w) { LANG_KW_SET[k][w] = 1; }); });
  var LANG_TYPE_SET = {
    python: { int: 1, float: 1, str: 1, bool: 1, list: 1, dict: 1, set: 1, tuple: 1, range: 1, len: 1, print: 1, input: 1, open: 1, sorted: 1, sum: 1, min: 1, max: 1, abs: 1, enumerate: 1, zip: 1, type: 1, round: 1, chr: 1, ord: 1, isinstance: 1 },
    c: { printf: 1, fprintf: 1, sprintf: 1, malloc: 1, calloc: 1, realloc: 1, free: 1, memcpy: 1, memmove: 1, memset: 1, memcmp: 1, strlen: 1, strcpy: 1, strncpy: 1, strcmp: 1, strcat: 1, strchr: 1, strstr: 1, qsort: 1, fopen: 1, fclose: 1, fgets: 1, fputs: 1, scanf: 1, FILE: 1, size_t: 1, NULL: 1, sizeof: 1 }
  };

  function normalizeLang(lang) {
    lang = String(lang || SITE_LANG || 'text').toLowerCase();
    if (lang === 'py' || lang === 'python3') return 'python';
    if (lang === 'cpp' || lang === 'c++' || lang === 'c99') return 'c';
    if (lang === 'bash' || lang === 'sh' || lang === 'shell' || lang === 'console' || lang === 'cmd') return 'bash';
    return LANG_KW[lang] ? lang : (LANG_KW[SITE_LANG] ? SITE_LANG : 'text');
  }

  /** 源码 → 带 span 的高亮 HTML（不换行，保留原有换行由调用方处理） */
  function highlightCode(src, lang) {
    lang = normalizeLang(lang);
    var kwSet = LANG_KW_SET[lang] || {};
    var typeSet = LANG_TYPE_SET[lang] || {};
    var py = (lang === 'python' || lang === 'bash');
    var out = '', i = 0, n = src.length;
    function isIdStart(c) { return /[A-Za-z_$]/.test(c); }
    function isId(c) { return /[A-Za-z0-9_$]/.test(c); }
    while (i < n) {
      var c = src[i], c2 = src[i + 1], c3 = src.slice(i, i + 3);
      if (py && c === '#') {
        var jh = src.indexOf('\n', i); if (jh < 0) jh = n;
        out += '<span class="tk-cmt">' + esc(src.slice(i, jh)) + '</span>'; i = jh; continue;
      }
      if (!py && c === '/' && c2 === '/') {
        var j = src.indexOf('\n', i); if (j < 0) j = n;
        out += '<span class="tk-cmt">' + esc(src.slice(i, j)) + '</span>'; i = j; continue;
      }
      if (!py && c === '/' && c2 === '*') {
        var jj = src.indexOf('*/', i + 2); jj = jj < 0 ? n : jj + 2;
        out += '<span class="tk-cmt">' + esc(src.slice(i, jj)) + '</span>'; i = jj; continue;
      }
      if (!py && c === '#' && /^[ \t]*$/.test(src.slice(src.lastIndexOf('\n', i - 1) + 1, i))) {
        var jp = src.indexOf('\n', i); if (jp < 0) jp = n;
        out += '<span class="tk-cmt">' + esc(src.slice(i, jp)) + '</span>'; i = jp; continue;
      }
      var TQ = '\x22\x22\x22', SQ = '\x27\x27\x27';
      if (py && (c3 === TQ || c3 === SQ)) {
        var q3 = c3, jd = i + 3;
        while (jd < n) { if (src[jd] === '\\') { jd += 2; continue; } if (src.slice(jd, jd + 3) === q3) { jd += 3; break; } jd++; }
        out += '<span class="tk-str">' + esc(src.slice(i, jd)) + '</span>'; i = jd; continue;
      }
      if (c === '"' || c === "'") {
        var q = c, j2 = i + 1;
        while (j2 < n) { if (src[j2] === '\\') { j2 += 2; continue; } if (src[j2] === q) { j2++; break; } if (src[j2] === '\n') break; j2++; }
        out += '<span class="tk-str">' + esc(src.slice(i, j2)) + '</span>'; i = j2; continue;
      }
      if (/[0-9]/.test(c) || (c === '.' && /[0-9]/.test(c2))) {
        var j3 = i;
        while (j3 < n && /[0-9a-fA-FxXobOB._eE+\-]/.test(src[j3])) {
          if ((src[j3] === '+' || src[j3] === '-') && !/[eE]/.test(src[j3 - 1])) break;
          if (src[j3] === '.' && !/[0-9]/.test(src[j3 + 1] || '') && !/[eEfFdD]/.test(src[j3 + 1] || '')) break;
          j3++;
        }
        out += '<span class="tk-num">' + esc(src.slice(i, j3)) + '</span>'; i = j3; continue;
      }
      if (isIdStart(c)) {
        var j4 = i + 1;
        while (j4 < n && isId(src[j4])) j4++;
        var w = src.slice(i, j4), after = src.slice(j4, j4 + 40);
        if (kwSet[w]) out += '<span class="tk-kw">' + w + '</span>';
        else if (typeSet[w]) out += '<span class="tk-type">' + w + '</span>';
        else if (/^\s*\(/.test(after)) out += '<span class="tk-meth">' + esc(w) + '</span>';
        else out += esc(w);
        i = j4; continue;
      }
      if (/[+\-*/%=<>!&|^~?:]/.test(c)) out += '<span class="tk-op">' + esc(c) + '</span>';
      else out += esc(c);
      i++;
    }
    return out;
  }

  /** 兼容旧调用 */

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
      s.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'v=' + VERSION + '-' + BUILD;
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
    quiz: 'assets/quiz.js',
    exam: 'assets/exam.js',
    projects: 'assets/projects.js',
    '/chapters': null
  };

  function loadModule(name) {
    if (!MODULE_FILES[name]) return Promise.resolve(false);
    return loadScript(MODULE_FILES[name]);
  }
  function loadModules(names) {
    return Promise.all(names.map(loadModule));
  }

  /* ------------------------------------------------------------------ 成绩记录（本地，按课程隔离） */
  /* 只记答题对错统计（错题本/复盘用），不含任何进度语义 */
  var records = (function () {
    var q = store.get('quiz', null) || {};      // { qid: {n, ok} }
    function save() { store.set('quiz', q); }
    return {
      recordQuiz: function (id, ok) {
        var r = q[id] || (q[id] = { n: 0, ok: 0 });
        r.n++; if (ok) r.ok++;
        save();
        bus.emit('records:change', id);
      },
      quizRec: function (id) { return q[id] || null; },
      wrongList: function () {
        return Object.keys(q).filter(function (id) { return q[id] && q[id].n > q[id].ok; });
      },
      stats: function () {
        var n = 0, ok = 0;
        for (var k in q) { n += q[k].n; ok += q[k].ok; }
        return { answered: n, correct: ok, accuracy: n ? Math.round(ok / n * 100) : 0 };
      },
      clear: function () { q = {}; save(); bus.emit('records:change', null); }
    };
  })();

  /* ------------------------------------------------------------------ 旧数据迁移（一次性，按站隔离） */
  /* 旧版所有站点共用裸 csc.* 键：这里只迁移本站还需要的数据（模拟卷成绩），
     旧的游戏化进度（章节已读、XP、连续天数、进阶读完标记、自查清单）直接清理。 */
  var MIGRATION_FLAG = 'csc.' + SITE_ID + '.migrated.v3';
  var MIGRATION_EXAM_FLAG = 'csc.' + SITE_ID + '.migrated.v3.exam';

  function legacyGet(k) {
    try { var v = localStorage.getItem('csc.' + k); return v == null ? null : JSON.parse(v); }
    catch (e) { return null; }
  }
  function legacyDel(k) { try { localStorage.removeItem('csc.' + k); } catch (e) {} }

  /** 由 loadExams() 在卷子加载后调用：只迁移本站已知 exam id 的旧成绩（幂等） */
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

  /* ------------------------------------------------------------------ 容器 */
  var chapters = [];
  var chapterMeta = [];
  var chapterById = {};
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
          if (s.code) card.appendChild(el('pre', { html: highlightCode(s.code, b.lang) }));
          cw.appendChild(card);
        });
        return cw;
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
      qsa('.checkItem', wrap).forEach(function (n) { if (n.classList.contains('on')) done++; });
      bar.firstChild.style.width = (items.length ? done / items.length * 100 : 0) + '%';
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

  /* 代码块：静态展示 + 语言徽标 + 一键复制（不在站内运行） */
  function codeLangLabel(b) {
    var lk = normalizeLang(b && b.lang);
    if (lk === 'python') return 'Python';
    if (lk === 'c') return 'C';
    if (lk === 'bash') return 'Shell';
    return SITE_LABEL || '代码';
  }

  function renderCodeBlock(b) {
    var box = el('div', { class: 'codeBox' });
    var label = codeLangLabel(b);
    var head = el('div', { class: 'codeBoxHead' }, [
      el('span', { class: 'codeDots', html: '<i></i><i></i><i></i>' }),
      el('span', { class: 'cbT', html: (b.caption ? '<b>' + esc(b.caption) + '</b>' : '<b>' + esc(label) + '</b>') }),
      el('span', { class: 'pill', text: label })
    ]);
    var copyBtn = el('button', {
      class: 'ed-btn', type: 'button', text: '复制',
      title: '复制到剪贴板（本站不运行代码，请粘贴到本地环境运行）',
      style: 'margin-left:auto'
    });
    copyBtn.addEventListener('click', function () {
      copyText(b.code || '');
      copyBtn.textContent = '已复制';
      setTimeout(function () { copyBtn.textContent = '复制'; }, 1400);
    });
    head.appendChild(copyBtn);
    box.appendChild(head);
    var pre = el('pre', { html: codeLines(b.code || '', b.focus, normalizeLang(b.lang)) });
    box.appendChild(pre);
    return box;
  }

  /* 占位题目按需补全 */
  var pendingQuiz = [];

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
    home: SITE_NAME + ' · OBSERVATORY',
    glossary: '术语表 · ' + SITE_SHORT,
    map: '航线图 · ' + SITE_SHORT,
    about: '使用说明 · ' + SITE_SHORT
  };

  function updateDocTitle(view, arg) {
    var t;
    if (view === 'ch') {
      var meta = null;
      (chapterMeta || []).some(function (m) { if (m.id === arg) { meta = m; return true; } return false; });
      t = (meta ? (meta.num + ' ' + meta.title) : (arg || '章节')) + ' · ' + SITE_SHORT;
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
   * 每个 Part = 一个星区；每章 = 一颗行星。
   * 行星由章节数据生成：大小 ∝ 课时；纹理 = 10 种程序化世界风格；
   * 大气辉光 = Part 色；每颗行星下方垂下入口节点树（章节 / 题库）。
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

  /* 章节 → 世界风格（按章节主题挑选，固定不变） */
  var WORLD_MAP = [
    'rocky', 'ocean', 'desert', 'ice', 'ringed',
    'aurora', 'gas', 'storm', 'lava', 'icegiant'
  ];

  var PART_COLORS = { I: '#d7ab61', II: '#e06236', III: '#9fc0e2', IV: '#c82337' };
  var PART_SOFT = {
    I: 'rgba(215, 171, 97, .07)',
    II: 'rgba(224, 98, 54, .06)',
    III: 'rgba(159, 192, 226, .06)',
    IV: 'rgba(200, 35, 55, .06)'
  };

  /* 行星大小 ∝ 课时（22–48 min → 34–64px） */
  function worldSize(m) {
    var mins = Math.min(48, Math.max(22, m.minutes || 30));
    return Math.round(38 + (mins - 22) / 26 * 28);
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
      title: SITE_SHORT + ' // CORE · 进入第 0 章',
      'aria-label': SITE_SHORT + ' 核心，点击进入第 0 章'
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
      var size = worldSize(m);

      var nodes = el('span', { class: 'pNodes' });
      nodes.appendChild(el('a', {
        class: 'pNode pnMain', href: '#/' + m.id,
        'aria-label': '进入 ' + m.title, title: 'MOD ' + m.num + ' ' + m.title
      }, [
        el('span', { class: 'pnNum', text: m.num }),
        el('span', { class: 'pnTip', text: 'MOD ' + m.num })
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
        el('span', { text: 'MISSION_BRIEF // ' + SITE_SHORT })
      ]),
      el('h1', { class: 'missionT', html: '从零学会<br><em>用 ' + SITE_LABEL + ' 思考</em>' }),
      el('div', { class: 'missionEn', text: SITE.missionEn || '' }),
      el('p', { class: 'missionLede', html: SITE.lede || '' }),
      el('div', { class: 'missionBtns' }, [
        el('a', {
          class: 'btnPrimary',
          href: '#/ch00',
          title: '从第 0 章开始',
          html: '<span>▶</span><span>开始学习</span>'
        }),
        el('a', { class: 'btnGhost', href: '#/glossary', html: '<span>术语表</span>' }),
        el('a', { class: 'btnGhost', href: '#/about', html: '<span>使用说明</span>' })
      ])
    ]));

    /* ---------- 右：系统读数 dock ---------- */
    var sysTerm = el('div', { class: 'termOut', id: 'homeTerm' });
    stage.appendChild(el('div', { class: 'systemDock' }, [
      el('div', { class: 'dockTitle', html: 'SYSTEM : <b>' + SITE_SHORT + '</b>' }),
      el('div', {
        class: 'dockSub',
        html: 'SECTOR: <b>CS</b> // LANG: <b>' + SITE_LABEL + '</b> // WORLDS: <b>' + String(chapterMeta.length).padStart(2, '0') + '</b>'
      }),
      el('div', { class: 'dockRows' }, [
        el('div', { html: '&gt; SYSTEM_OVERVIEW: <span class="hl">' + SITE_NAME + '</span>' }),
        el('div', { html: '&gt; MODULES: <b>' + String(chapterMeta.length).padStart(2, '0') + '</b> // PARTS: <b>04</b>' }),
        el('div', { html: '&gt; CODE: <b>' + SITE_LABEL + '</b> // MODE: <b>STATIC READ</b>' }),
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

    /* ---------- 仪表读数 ---------- */
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
        + '> RUNTIME: ' + (m.minutes || 30) + ' MIN\n'
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
      sun.addEventListener('click', function () { CSC.go('#/ch00'); });
      sun.addEventListener('mouseenter', function () {
        say('> CORE: ' + SITE_SHORT + '\n> SYSTEM: ' + String(chapterMeta.length).padStart(2, '0') + ' WORLDS // 04 PARTS\n> CLICK: OPEN MODULE 00');
      });
      sun.addEventListener('mouseleave', function () {
        say('> SYSTEM READY...\n> 4 PARTS // ' + String(chapterMeta.length).padStart(2, '0') + ' WORLDS\n> SELECT TARGET');
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
      say('> SYSTEM READY...\n> 4 PARTS // ' + String(chapterMeta.length).padStart(2, '0') + ' WORLDS\n> SELECT TARGET');
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
      pendingQuiz = [];
      var wrap = el('article', { class: 'chapter' });

      // 头部
      var idx = chapterMeta.findIndex(function (m) { return m.id === id; });
      var prev = idx > 0 ? chapterMeta[idx - 1] : null;
      var next = idx >= 0 && idx < chapterMeta.length - 1 ? chapterMeta[idx + 1] : null;
      var partName = (ch.meta && ch.meta.part) || '';
      var partRoman = (partName.match(/Part ([IVX]+)/) || [])[1] || '—';
      var examples = (ch.blocks || []).filter(function (b) { return b.t === 'code'; }).length;
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
          metaItem('EXAMPLES', String(examples).padStart(2, '0')),
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
      head.appendChild(el('div', {
        class: 'chRunNote',
        style: 'margin-top:12px;font-size:12px;line-height:1.6;color:var(--dim,#8a94a6);border-left:2px solid rgba(120,180,255,.35);padding-left:10px',
        html: '代码示例为静态展示，不在页面里运行：点右上角「复制」，粘贴到本地 ' + esc(SITE_LABEL) + ' 环境执行。'
      }));
      wrap.appendChild(head);


      // 正文
      var anchors = [];
      renderBlocks(wrap, ch.blocks, { chapter: ch, anchors: anchors });

      // 章节底部：练习入口（不记录进度）
      var doneBar = el('div', { class: 'doneBar' });
      doneBar.appendChild(el('div', { class: 'dt', html: '读完这一章，去练习里检验一下：<b>题库</b>按章节出题，<b>模拟卷</b>按范围整卷作答。' }));
      doneBar.appendChild(el('a', { class: 'qzBtn ghost', href: '#/quiz/' + id, text: '去刷本章题' }));
      doneBar.appendChild(el('a', { class: 'qzBtn ghost', href: '#/projects', text: '项目实战' }));
      wrap.appendChild(doneBar);

      var navRow = el('div', { class: 'chNav' });
      if (prev) navRow.appendChild(el('a', { class: 'chNavA', href: '#/' + prev.id }, [el('div', { class: 'd', text: '← 上一章' }), el('div', { class: 't', text: prev.num + ' ' + prev.title })]));
      else navRow.appendChild(el('div', { class: 'chNavA disabled' }, [el('div', { class: 'd', text: '← 上一章' }), el('div', { class: 't', text: '已经是第一章' })]));
      if (next) {
        navRow.appendChild(el('a', { class: 'chNavA next', href: '#/' + next.id }, [el('div', { class: 'd', text: '下一章 →' }), el('div', { class: 't', text: next.num + ' ' + next.title })]));
      } else navRow.appendChild(el('div', { class: 'chNavA next disabled' }, [el('div', { class: 'd', text: '下一章 →' }), el('div', { class: 't', text: '全部完成 🎉' })]));
      wrap.appendChild(navRow);

      setContent(wrap);
      buildRail(ch, anchors);
      setupScrollSpy();
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
        kl.appendChild(el('div', { style: 'padding:2px 0', html: '<span style="color:var(--accent)">▸</span> ' + esc(k.title) }));
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
        ['BANK', 'PRACTICE'],
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

  VIEWS.projects = function (id) {
    var root = el('div', { class: 'projectsPage' });
    root.appendChild(pageHead({
      crumb: '<a href="#/">OVERVIEW</a><span>/</span><span>PROJECT_LAB</span>' + (id ? '<span>/</span><span>' + esc(String(id).toUpperCase()) + '</span>' : ''),
      kicker: 'PROJECT_LAB // 项目实战',
      title: id ? '项目详情' : '项目实战',
      en: 'PROJECT LAB · 把 ' + String(chapterMeta.length) + ' 章能力串成完整程序',
      meta: [
        ['PROJECTS', 'LAB'],
        ['MODE', 'LOCAL'],
        ['RUN', 'LOCAL']
      ],
      lead: id
        ? '按里程碑推进：读需求 → 在本机写代码 → 对照验收标准自查；卡住可以看提示，最后对照参考实现。'
        : '每个项目有目标、里程碑与验收标准，全部在本机完成，不依赖站内运行环境。'
    }));
    var host = el('div', { class: 'projectsHost' });
    root.appendChild(host);
    setContent(root);
    host.appendChild(el('div', { class: 'learnEmpty' }, [
      el('div', { class: 'learnEmptyT', text: '正在载入项目…' }),
      el('div', { class: 'learnEmptyD', text: '第一次进入需要加载项目数据。' })
    ]));
    loadProjects().then(function (list) {
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
      lead: '在线模拟卷：像真考试一样计时，交卷后逐题判分并给出解析；简答题给出参考答案，需人工对照。'
    }));
    var host = el('div');
    root.appendChild(host);
    setContent(root);
    loadExams().then(function () {
      if (!CSC.exam) return;
      CSC.exam.mountList(host);
    });
  };

  /* 关于 */
  VIEWS.about = function () {
    var root = el('div');
    var st = records.stats();
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
      '<p class="blockP">整个网站是纯静态文件，没有任何后端与外部依赖。<b>直接双击 <code>index.html</code> 就能用</b>。代码示例不在网页里运行，复制到本地解释器 / 编译器即可执行。</p>' +
      '<h2 class="blockH">课程说明</h2>' +
      '<div class="tableWrap"><table><tbody>' +
      (SITE.aboutLines || []).map(function (r) { return '<tr><th style="width:120px">' + r[0] + '</th><td>' + r[1] + '</td></tr>'; }).join('') +
      '</tbody></table></div>' +
      '<h2 class="blockH">界面与操作</h2>' +
      '<div class="tableWrap"><table><tbody>' +
      '<tr><th style="width:130px">首页世界星图</th><td>横向「课程世界星图」：左侧核心恒星＝课程核心，向右按 Part 分星区排列 ' + String(chapterMeta.length).padStart(2, '0') + ' 颗行星＝' + String(chapterMeta.length).padStart(2, '0') + ' 章。<b>行星直径 ∝ 课时</b>；悬停行星浮出章名并在右侧仪表读数；<code>FOV_SCALE</code> 滑块缩放整张星图；<b>点左上角徽标</b>随时回到首页。</td></tr>' +
      '<tr><th>侧栏</th><td>按 Part 分组列出全部章节；底部直达术语表 / 航线图 / 使用说明。</td></tr>' +
      '<tr><th>搜索</th><td>顶栏搜索框按 <kbd class="kbd">/</kbd> 聚焦，实时搜索全站正文；<kbd class="kbd">⌘K</kbd> 打开命令面板。</td></tr>' +
      '</tbody></table></div>' +
      '<h2 class="blockH">主要功能</h2>' +
      '<div class="tableWrap"><table><tbody>' +
      '<tr><th style="width:130px">章节</th><td>' + String(chapterMeta.length) + ' 章，每章有学习目标、知识点、示例代码、表格与自查清单。</td></tr>' +
      '<tr><th>代码示例</th><td>代码块带行号与语法高亮，可一键复制；本课程为阅读型，代码请复制到本地解释器 / 编译器运行。</td></tr>' +
      '<tr><th>题库</th><td>按章节刷题，选择 / 判断 / 填空 / 读程序输出都有；做完即时判分并给出解析，错题会进错题本。</td></tr>' +
      '<tr><th>模拟卷</th><td>两套整卷，计时作答、自动判分；简答题给出参考答案供人工对照。</td></tr>' +
      '<tr><th>项目实战</th><td>4 个完整项目，含目标、里程碑、验收标准、提示与参考实现，全部在本机实现。</td></tr>' +
      '<tr><th>速查表</th><td>一页纸复习：语法表 + 可复制运行的代码示例 + 常见坑。</td></tr>' +
      '<tr><th>术语表</th><td>自动汇总全站英文术语，按字母索引 + 实时过滤，点卡片跳到出处章节。</td></tr>' +
      '<tr><th>航线图</th><td>把全部章节画成一张星图，按 Part 分组，点节点直接进入。</td></tr>' +
      '</tbody></table></div>' +
      '<h2 class="blockH">成绩记录</h2>' +
      '<p class="blockP">答题对错与模拟卷成绩保存在<b>本站专属</b>的浏览器本地存储（<code>csc.' + SITE_ID + '.*</code>），不上传任何服务器；换浏览器或清缓存会丢失，六门课互不覆盖。当前记录：答题 <b>' + st.answered + '</b> 次，正确 <b>' + st.correct + '</b> 次，正确率 <b>' + st.accuracy + '%</b>。</p>' +
      '<div class="qzActions" id="aboutActions"></div>' +
      '<h2 class="blockH">快捷键</h2>' +
      '<div class="tableWrap"><table><thead><tr><th>按键</th><th>作用</th></tr></thead><tbody>' +
      '<tr><td><kbd class="kbd">⌘K</kbd> / <kbd class="kbd">Ctrl</kbd>+<kbd class="kbd">K</kbd></td><td>命令面板（全局搜索 + 快捷操作）</td></tr>' +
      '<tr><td><kbd class="kbd">/</kbd></td><td>聚焦顶栏搜索框</td></tr>' +
      '<tr><td><kbd class="kbd">?</kbd></td><td>显示快捷键帮助</td></tr>' +
      '<tr><td><kbd class="kbd">G</kbd> / <kbd class="kbd">M</kbd></td><td>术语表 / 航线图</td></tr>' +
      '<tr><td><kbd class="kbd">Esc</kbd></td><td>关闭搜索 / 弹窗 / 手机侧栏</td></tr>' +
      '</tbody></table></div>' +
      '<h2 class="blockH">关于本站</h2>' +
      '<p class="blockP">本网站为个人学习用途整理的中文课程站，把一门编程入门课的知识点重新组织为「章节 + 示例 + 自查」的阅读结构；非任何机构官方教学材料。</p>' +
      '<div class="callout ai"><div class="ct"><span>AI 时代怎么用这个网站</span></div><div class="cb"><p>本站刻意把每个概念都写成能自己敲一遍的代码。遇到不懂的，先自己敲一遍、跑一遍，再去问 AI——这时你能判断它的答案对不对。</p></div></div>' +
      '<h2 class="blockH">视觉与致谢</h2>' +
      '<p class="blockP">界面采用 NASA-Punk Observatory 设计语言（深空底 + 程序化等高线地形 + 仪表读数 + 四色色标），设计参考 <a href="https://github.com/flowersauce/NASA-Punk_Observatory" target="_blank" rel="noopener">flowersauce/NASA-Punk_Observatory</a>（MIT License）；字体为 Jura 与 Roboto Mono（SIL Open Font License），已本地打包、离线可用。</p>' +
      '<h2 class="blockH">数据与隐私</h2>' +
      '<p class="blockP">所有成绩记录（答题对错、模拟卷成绩）只保存在你浏览器的 localStorage 里，不上传任何服务器。清除浏览器数据或点下面的按钮会清空本站成绩记录。</p>';
    root.appendChild(body);
    setContent(root);
    var acts = qs('#aboutActions');
    if (acts) {
      var clearBtn = el('button', { class: 'qzBtn ghost', type: 'button', html: '<span>清除本站成绩记录</span>' });
      clearBtn.addEventListener('click', function () {
        CSC.modal('<h3>确定清除吗？</h3><p>本站的答题对错与模拟卷成绩会被清空，无法恢复。</p>', { okText: '取消' });
        var m = qs('#modal .mcFoot');
        if (m) {
          var yes = el('button', { class: 'qzBtn', text: '确认清除', style: 'background:var(--err);border-color:var(--err)' });
          yes.addEventListener('click', function () {
            records.clear();
            try {
              Object.keys(localStorage).forEach(function (k) {
                if (k.indexOf('csc.' + SITE_ID + '.exam.') === 0) localStorage.removeItem(k);
              });
            } catch (e) {}
            CSC._closeModal && CSC._closeModal();
            CSC.toast('已清除本站成绩记录', 'ok');
            VIEWS.about();
          });
          m.insertBefore(yes, m.firstChild);
        }
      });
      acts.appendChild(clearBtn);
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
    navGroup('Reference', [
      ['glossary', 'book', '术语表'],
      ['map', 'compass', '航线图'],
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
    projects: ['PJ', 'PROJECT LAB'],
    quiz: ['QB', 'QUIZ BANK'],
    exam: ['EX', 'MOCK EXAMS'],
    glossary: ['GL', 'GLOSSARY'],
    cheatsheet: ['CS', 'CHEAT SHEET'],
    map: ['MP', 'FLIGHT PLAN'],
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
      res.innerHTML = '<div class="resEmpty">没有找到「' + esc(q) + '」<br><span class="small">试试：数组、多态、递归、Big-O</span></div>';
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
      ['projects', '项目实战', 'PROJECT LAB'],
      ['quiz', '题库', 'QUIZ BANK'],
      ['exam', '模拟卷', 'MOCK EXAMS'],
      ['glossary', '术语表', 'GLOSSARY'],
      ['cheatsheet', '速查表', 'CHEAT SHEET'],
      ['map', '课程航线图', 'FLIGHT PLAN'],
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
    ['Esc', '关闭浮层 / 搜索']
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
            key: 'csc.boot.seen',
            minMs: 1700,
            lines: (SITE.bootLog || [
              'INITIALIZING CORE .......... OK',
              'LOADING MODULES ............ OK',
              'CORE ENGINE ................ READY',
              'TOPOGRAPHY RENDERER ........ ONLINE',
              'OPTICS CALIBRATED .......... 100%'
            ])
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
    renderNav();
    bindToTop();

    // 侧栏图标
    qs('#helpBtn').innerHTML = icon('help');
    qs('#menuBtn').innerHTML = icon('menu');

    // 侧栏底部快捷入口：术语表 / 航线图 / 使用说明（不占导航滚动区）
    var sideTools = qs('#sideTools');
    if (sideTools) {
      [
        ['glossary', 'book', '术语表'],
        ['map', 'compass', '航线图'],
        ['about', 'help', '使用说明']
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
    var manualBtn = qs('#manualBtn');
    if (manualBtn) {
      manualBtn.innerHTML = '<span class="dot"></span><span class="lbl">MANUAL</span>';
      manualBtn.title = '操作手册 / 使用说明';
      manualBtn.addEventListener('click', function () { CSC.go('#/about'); });
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
        ['SOURCE', String(chapterMeta.length).padStart(2, '0') + ' CHAPTERS'],
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
  /* 速查表数据由两套语言各一份，按站点语言选择（两站 app.js 保持同一份） */
var CHEATSHEET_PY = [
  {
    label: '类型与运算',
    blocks: [
      { t: 'table', head: ['类型', '字面量示例', '要点'], rows: [
        ['<code>int</code>', '<code>42</code>、<code>-7</code>', '任意精度整数，不会溢出'],
        ['<code>float</code>', '<code>3.14</code>、<code>2.0</code>', '有精度误差，比较用 <code>math.isclose</code>'],
        ['<code>str</code>', '<code>"hi"</code>、<code>"你好"</code>', '不可变的字符序列'],
        ['<code>bool</code>', '<code>True</code>、<code>False</code>', '首字母大写，是 int 的子类'],
        ['<code>NoneType</code>', '<code>None</code>', '空值，判断写 <code>x is None</code>']
      ]},
      { t: 'table', head: ['表达式', '结果', '说明'], rows: [
        ['<code>7 / 2</code>', '3.5', '真除法，结果总是 float'],
        ['<code>7 // 2</code>', '3', '向下取整'],
        ['<code>-7 // 2</code>', '-4', '不是截断，而是 floor'],
        ['<code>7 // -2</code>', '-4', '向负无穷方向取整'],
        ['<code>-7 % 3</code>', '2', '余数符号与除数一致'],
        ['<code>7 % -3</code>', '-2', '和上一行对照记忆'],
        ['<code>2 ** 10</code>', '1024', '幂运算'],
        ['<code>10 ** 0.5</code>', '3.1622776601683795', '开平方']
      ]},
      { t: 'code', caption: '数值运算、类型转换与 f-string', lang: 'python', code: 'a, b = 7, 2\nprint(a / b, a // b)        # -> 3.5 3\nprint(-7 // 2, -7 % 3)      # -> -4 2\nprint(2 ** 10, 10 ** 0.5)   # -> 1024 3.1622776601683795\nname, score = "小明", 92.5\nprint(f"{name} 得分 {score:.1f}")   # -> 小明 得分 92.5\nprint(int("42") + 1, float("3.5"), str(7) + "!")  # -> 43 3.5 7!\nprint(bool(0), bool(""), bool([]), bool("0"))     # -> False False False True' },
      { t: 'callout', kind: 'tip', title: '== 与 is 的区别', html: '<code>==</code> 比较值，<code>is</code> 比较是否为同一个对象。小整数和短字符串可能被缓存，使 <code>is</code> 偶然为 True，不要依赖。判断空值统一写 <code>x is None</code>。' }
    ]
  },
  {
    label: '字符串',
    blocks: [
      { t: 'table', head: ['写法', '结果（s = "Python"）', '含义'], rows: [
        ['<code>s[0]</code>', '<code>"P"</code>', '第一个字符'],
        ['<code>s[-1]</code>', '<code>"n"</code>', '最后一个字符'],
        ['<code>s[1:4]</code>', '<code>"yth"</code>', '左闭右开，不含下标 4'],
        ['<code>s[:3]</code>', '<code>"Pyt"</code>', '省略起点'],
        ['<code>s[3:]</code>', '<code>"hon"</code>', '省略终点'],
        ['<code>s[::2]</code>', '<code>"Pto"</code>', '每隔一个取一个'],
        ['<code>s[::-1]</code>', '<code>"nohtyP"</code>', '负步长反转字符串'],
        ['<code>s[10:20]</code>', '<code>""</code>', '切片越界不报错，返回空串'],
        ['<code>s[10]</code>', 'IndexError', '单个下标越界会报错']
      ]},
      { t: 'code', caption: '切片与常用字符串方法', lang: 'python', code: 's = "Python"\nprint(s[0], s[-1])                    # -> P n\nprint(s[1:4], s[:3], s[3:])           # -> yth Pyt hon\nprint(s[::2], s[::-1])                # -> Pto nohtyP\nprint(len(s), "py" in s.lower())      # -> 6 True\n\nraw = "  a, b ,c  "\nparts = [p.strip() for p in raw.strip().split(",")]\nprint(parts)                          # 三个元素：a、b、c\nprint("-".join(parts))                # -> a-b-c\nprint("hello".replace("l", "L"))      # -> heLLo\nprint("abcabc".find("c"), "abc".find("z"))  # -> 2 -1\nprint("Hello".upper(), "Hello".lower())     # -> HELLO hello' },
      { t: 'table', head: ['方法', '示例', '结果'], rows: [
        ['<code>split</code>', '<code>"a,b,c".split(",")</code>', '<code>["a", "b", "c"]</code>'],
        ['<code>join</code>', '<code>"-".join(["a", "b"])</code>', '<code>"a-b"</code>'],
        ['<code>strip</code>', '<code>"  hi  ".strip()</code>', '<code>"hi"</code>'],
        ['<code>replace</code>', '<code>"aXb".replace("X", "-")</code>', '<code>"a-b"</code>'],
        ['<code>find</code>', '<code>"abc".find("c")</code>', '<code>2</code>，找不到返回 <code>-1</code>'],
        ['<code>startswith</code>', '<code>"abc".startswith("ab")</code>', '<code>True</code>'],
        ['<code>upper / lower</code>', '<code>"Ab".lower()</code>', '<code>"ab"</code>'],
        ['<code>count</code>', '<code>"banana".count("a")</code>', '<code>3</code>']
      ]},
      { t: 'callout', kind: 'warn', title: '字符串不可变', html: '不能写 <code>s[0] = "X"</code>，会抛 TypeError。要改只能生成新串，如 <code>s = "X" + s[1:]</code>；所有字符串方法都返回新字符串，原串不变。' }
    ]
  },
  {
    label: '列表与字典',
    blocks: [
      { t: 'code', caption: '列表增删改查与排序', lang: 'python', code: 'nums = [3, 1, 4]\nnums.append(5)              # [3, 1, 4, 5]\nnums.insert(0, 0)           # [0, 3, 1, 4, 5]\nnums.remove(1)              # 删除第一个 1 -> [0, 3, 4, 5]\nlast = nums.pop()           # last 是 5，nums 变 [0, 3, 4]\nnums.sort()                 # 原地升序\nprint(nums)                 # -> [0, 3, 4]\nprint(sorted(nums, reverse=True))   # -> [4, 3, 0]\nprint(nums[1:], len(nums))          # -> [3, 4] 3\nprint([x * 2 for x in nums])        # -> [0, 6, 8]' },
      { t: 'table', head: ['操作', '作用'], rows: [
        ['<code>append(x)</code>', '末尾追加一个元素'],
        ['<code>insert(i, x)</code>', '在下标 i 处插入'],
        ['<code>pop() / pop(i)</code>', '删除并返回末尾 / 指定位置元素'],
        ['<code>remove(x)</code>', '删除第一个值为 x 的元素'],
        ['<code>sort()</code>', '原地排序，返回 None'],
        ['<code>sorted(a)</code>', '返回新列表，原列表不变'],
        ['<code>a.index(x)</code>', '返回下标，找不到抛 ValueError'],
        ['<code>[f(x) for x in a]</code>', '列表推导式，生成新列表']
      ]},
      { t: 'code', caption: '字典取值、计数与 setdefault', lang: 'python', code: 'd = {"apple": 3, "pear": 1}\nprint(d.get("apple"), d.get("kiwi", 0))   # -> 3 0\nd["kiwi"] = d.get("kiwi", 0) + 1         # 计数套路：缺失当 0\nd.setdefault("berry", []).append("蓝莓")  # 值为列表时省去判断\nfor k, v in d.items():\n    print(k, v)\nprint(d["berry"][0])         # -> 蓝莓\nprint(len(d))                # -> 4' },
      { t: 'table', head: ['字典操作', '作用'], rows: [
        ['<code>d[k]</code>', '取值，键不存在抛 KeyError'],
        ['<code>d.get(k, default)</code>', '安全取值，键缺失返回 default'],
        ['<code>d.items()</code>', '键值对视图，可解包遍历'],
        ['<code>d.keys() / d.values()</code>', '键 / 值视图，可转成 list'],
        ['<code>d.setdefault(k, v)</code>', '键不存在时写入 v 并返回该值'],
        ['<code>del d[k]</code>', '删除键，键不存在抛 KeyError']
      ]},
      { t: 'table', head: ['写法', '说明'], rows: [
        ['<code>t = (1, 2)</code>', '元组不可变，可作字典键'],
        ['<code>x, y = t</code>', '解包'],
        ['<code>a, b = b, a</code>', '交换两个变量'],
        ['<code>first, *rest = [1, 2, 3]</code>', '<code>first=1</code>，<code>rest=[2, 3]</code>'],
        ['<code>t2 = (5,)</code>', '单元素元组必须带逗号'],
        ['<code>for k, v in d.items()</code>', 'items 返回键值对元组，可直接解包']
      ]},
      { t: 'callout', kind: 'warn', title: '可变对象的别名陷阱', html: '<code>b = a</code> 只复制引用，不复制内容：之后 <code>b.append(1)</code> 会同时改变 a。要独立副本用 <code>b = a[:]</code> 或 <code>a.copy()</code>；嵌套结构要用 <code>copy.deepcopy(a)</code>。' }
    ]
  },
  {
    label: '控制流',
    blocks: [
      { t: 'code', caption: 'if / elif / else 与 enumerate', lang: 'python', code: 'score = 85\nif score >= 90:\n    grade = "A"\nelif score >= 80:          # 是 elif，不是 else if\n    grade = "B"\nelse:\n    grade = "C"\nprint(grade)               # -> B\n\nfor i, ch in enumerate("abc", start=1):\n    if ch == "b":\n        continue           # 跳过本次\n    print(i, ch)           # -> 1 a / 3 c' },
      { t: 'table', head: ['工具', '用法', '要点'], rows: [
        ['<code>range(5)</code>', '0, 1, 2, 3, 4', '不含终点'],
        ['<code>range(1, 10, 2)</code>', '1, 3, 5, 7, 9', '起点、终点、步长'],
        ['<code>range(5, 0, -1)</code>', '5, 4, 3, 2, 1', '负步长倒着数'],
        ['<code>enumerate(seq)</code>', '同时给出下标和值', '可加 <code>start=1</code>'],
        ['<code>zip(a, b)</code>', '并行遍历两个序列', '长度以短的为准'],
        ['<code>for ... else</code>', '循环没被 break 才执行 else', '常用来判断「找到没有」'],
        ['<code>break / continue</code>', '跳出整个循环 / 跳过本次', '只影响最内层循环']
      ]},
      { t: 'code', caption: 'for-else、while 与三元表达式', lang: 'python', code: 'for n in [1, 3, 5, 7]:\n    if n == 7:\n        print("找到", n)   # -> 找到 7\n        break\nelse:\n    print("没找到")       # 没被 break 才执行\n\nn = 0\nwhile n < 3:\n    n += 1\nprint(n)                  # -> 3\n\nsquares = [x * x for x in range(1, 5)]   # -> [1, 4, 9, 16]\nlabel = "偶" if 4 % 2 == 0 else "奇"      # -> 偶\nprint(squares, label)' },
      { t: 'callout', kind: 'tip', title: '真值判断', html: '空值都为假：<code>0</code>、<code>0.0</code>、<code>""</code>、<code>[]</code>、<code>{}</code>、<code>()</code>、<code>set()</code>、<code>None</code>、<code>False</code>；其余为真。判断空容器写 <code>if not lst:</code>，不要写 <code>if lst == []:</code>。' }
    ]
  },
  {
    label: '函数',
    blocks: [
      { t: 'code', caption: '定义函数、默认参数与可变参数', lang: 'python', code: 'def greet(name, greeting="你好"):\n    return f"{greeting}，{name}"\n\ndef stats(*args, **kwargs):\n    return sum(args) + sum(kwargs.values())\n\nprint(greet("小明"))                 # -> 你好，小明\nprint(greet("Amy", greeting="Hi"))   # -> Hi，Amy\nprint(stats(1, 2, 3, bonus=4))       # -> 10\na, b = 1, 2\na, b = b, a\nprint(a, b)                          # -> 2 1\n\ndef min_max(nums):\n    return min(nums), max(nums)\n\nlo, hi = min_max([3, 1, 4])\nprint(lo, hi)             # -> 1 4\n\ncount = 0\ndef bump():\n    global count          # 函数内改全局变量必须声明\n    count += 1\nbump()\nprint(count)              # -> 1' },
      { t: 'table', head: ['写法', '含义'], rows: [
        ['<code>def f(a, b=2)</code>', '默认参数必须放在无默认参数之后'],
        ['<code>f(b=5, a=1)</code>', '关键字参数，顺序无关'],
        ['<code>def f(*args)</code>', '多余的位置参数打包成元组'],
        ['<code>def f(**kwargs)</code>', '多余的关键字参数打包成字典'],
        ['<code>return a, b</code>', '实际返回元组，可用 <code>x, y = f()</code> 解包'],
        ['<code>global x</code>', '函数内要修改全局变量必须声明']
      ]},
      { t: 'code', caption: 'lambda、sorted key 与递归', lang: 'python', code: 'pairs = [("b", 2), ("a", 3), ("c", 1)]\nprint(sorted(pairs, key=lambda kv: kv[0]))    # 按字母升序\nprint(sorted(pairs, key=lambda kv: -kv[1]))   # 按数字降序\nwords = ["apple", "fig", "banana"]\nprint(sorted(words, key=len))                 # 按长度：fig、apple、banana\n\ndef fact(n):\n    if n <= 1:            # 基线条件，必须有\n        return 1\n    return n * fact(n - 1)\n\ndef total(lst):\n    return 0 if not lst else lst[0] + total(lst[1:])\n\nprint(fact(5), total([1, 2, 3, 4]))   # -> 120 10' },
      { t: 'callout', kind: 'warn', title: '默认参数不要用可变对象', html: '<code>def f(lst=[])</code> 的默认列表在定义时只创建一次，多次调用会共享并累积。正确写法：<code>def f(lst=None): lst = [] if lst is None else lst</code>。' }
    ]
  },
  {
    label: '文件',
    blocks: [
      { t: 'table', head: ['模式', '含义'], rows: [
        ['<code>"r"</code>', '只读，默认；文件不存在抛 FileNotFoundError'],
        ['<code>"w"</code>', '只写，清空已有内容或新建'],
        ['<code>"a"</code>', '追加，文件不存在则新建'],
        ['<code>"r+"</code>', '读写，指针在开头'],
        ['<code>"rb" / "wb"</code>', '二进制模式，处理图片等非文本'],
        ['<code>newline=""</code>', 'csv 模块读写时建议加上，避免空行']
      ]},
      { t: 'code', caption: 'with 读写文本文件与逐行遍历', lang: 'python', code: 'with open("nums.txt", "w", encoding="utf-8") as f:\n    print(10, file=f)\n    print(20, file=f)\n\nwith open("nums.txt", encoding="utf-8") as f:\n    print(f.read())          # 两行文本，含换行符\n\nwith open("nums.txt", encoding="utf-8") as f:\n    lines = f.readlines()    # 每行都带换行符\n    print(len(lines))        # -> 2\n    print(lines[0].strip())  # -> 10\n\nwith open("nums.txt", encoding="utf-8") as f:\n    print(f.readline().strip())   # -> 10（只读一行）\n\nwith open("nums.txt", encoding="utf-8") as f:\n    for line in f:           # 逐行遍历，最省内存\n        print(int(line) * 2)  # -> 20 40（分两行输出）' },
      { t: 'code', caption: 'csv 模块读写', lang: 'python', code: 'import csv\n\nrows = [["name", "score"], ["小明", "92"], ["小红", "88"]]\nwith open("score.csv", "w", newline="", encoding="utf-8") as f:\n    csv.writer(f).writerows(rows)\n\nwith open("score.csv", newline="", encoding="utf-8") as f:\n    print(list(csv.reader(f)))   # 每行是一个列表\n\nwith open("score.csv", newline="", encoding="utf-8") as f:\n    for row in csv.DictReader(f):\n        print(row["name"], row["score"])   # 按表头取列' },
      { t: 'code', caption: 'pathlib 路径操作', lang: 'python', code: 'from pathlib import Path\n\np = Path("out") / "note.txt"     # 用 / 拼接路径\np.parent.mkdir(parents=True, exist_ok=True)\np.write_text("你好", encoding="utf-8")\nprint(p.read_text(encoding="utf-8"))  # -> 你好\nprint(p.exists(), p.suffix, p.stem)   # -> True .txt note\nfor f in Path(".").glob("*.txt"):\n    print(f.name)' },
      { t: 'callout', kind: 'warn', title: '编码与换行', html: '读写文本文件一律显式写 <code>encoding="utf-8"</code>，Windows 默认编码容易触发 UnicodeDecodeError；用 csv 模块时再补 <code>newline=""</code>。' }
    ]
  },
  {
    label: '异常',
    blocks: [
      { t: 'code', caption: 'try / except / else / finally', lang: 'python', code: 'try:\n    n = int("abc")\nexcept ValueError as e:\n    print("转换失败:", e)     # 打印具体的错误信息\nelse:\n    print("没有异常才执行")\nfinally:\n    print("无论如何都执行")   # -> 无论如何都执行' },
      { t: 'table', head: ['异常', '常见触发场景'], rows: [
        ['<code>ValueError</code>', '<code>int("abc")</code>、解包数量不匹配'],
        ['<code>ZeroDivisionError</code>', '<code>10 / 0</code>'],
        ['<code>KeyError</code>', '字典取不存在的键 <code>d["x"]</code>'],
        ['<code>IndexError</code>', '列表下标越界 <code>lst[100]</code>'],
        ['<code>TypeError</code>', '<code>"a" + 1</code>、参数类型不对'],
        ['<code>FileNotFoundError</code>', '<code>open("不存在.txt")</code>'],
        ['<code>AttributeError</code>', '对 <code>None</code> 调用方法']
      ]},
      { t: 'code', caption: 'raise 主动抛出与 assert 断言', lang: 'python', code: 'def set_age(age):\n    if not isinstance(age, int):\n        raise TypeError("年龄必须是整数")\n    if age < 0:\n        raise ValueError("年龄不能为负")\n    return age\n\ntry:\n    set_age(-1)\nexcept ValueError as e:\n    print(e)          # -> 年龄不能为负\n\nassert 2 + 2 == 4, "断言失败"\nprint("继续执行")     # -> 继续执行' },
      { t: 'callout', kind: 'exam', title: 'EAFP 风格', html: 'Python 推崇「先做，出错再处理」：<code>try: v = d[k] except KeyError: ...</code>；但能用 <code>d.get(k)</code> 或 <code>setdefault</code> 时优先用它们。捕获异常要具体，不要写裸 <code>except:</code> 吞掉所有错误。' }
    ]
  },
  {
    label: '常用标准库',
    blocks: [
      { t: 'code', caption: 'math 与 random', lang: 'python', code: 'import math, random\n\nprint(math.sqrt(16), math.floor(3.7), math.ceil(3.2))  # -> 4.0 3 4\nprint(round(math.pi, 2), abs(-5))                     # -> 3.14 5\nrandom.seed(42)              # 固定种子，结果可复现\nprint(random.randint(1, 6))  # 1 到 6 的整数\nprint(random.choice(["红", "绿", "蓝"]))\nprint(random.sample(range(10), 3))   # 不重复抽 3 个' },
      { t: 'code', caption: 'Counter 计数与 defaultdict 分组', lang: 'python', code: 'from collections import Counter, defaultdict\n\nc = Counter("abracadabra")\nprint(c["a"], c["z"])         # -> 5 0（缺失键返回 0）\nprint(c.most_common(2))       # 出现最多的前两个\n\ngroups = defaultdict(list)    # 缺失键自动建空列表\nfor word in ["apple", "avocado", "banana"]:\n    groups[word[0]].append(word)\nprint(groups["a"])            # 两个 a 开头的词\nprint(len(groups["b"]))       # -> 1' },
      { t: 'code', caption: 'json 序列化与文件读写', lang: 'python', code: 'import json\n\ndata = {"name": "小明", "scores": [90, 85], "ok": True}\ns = json.dumps(data, ensure_ascii=False, indent=2)\nprint(s)                       # 带缩进的中文 JSON\nback = json.loads(s)\nprint(back["scores"][0])       # -> 90\n\nwith open("data.json", "w", encoding="utf-8") as f:\n    json.dump(data, f, ensure_ascii=False)\nwith open("data.json", encoding="utf-8") as f:\n    loaded = json.load(f)\nprint(loaded["ok"])            # -> True' },
      { t: 'code', caption: 'datetime 与 re 基础', lang: 'python', code: 'from datetime import datetime, timedelta\n\nnow = datetime(2024, 5, 1, 9, 30)\nprint(now.strftime("%Y-%m-%d %H:%M"))   # -> 2024-05-01 09:30\nlater = now + timedelta(days=7)\nprint(later.date())                     # -> 2024-05-08\nprint(datetime.strptime("2024-02-03", "%Y-%m-%d").month)  # -> 2\n\nimport re\nprint(re.search("[0-9]+", "订单 123 号").group())   # -> 123\nprint(re.findall("[a-z]+", "a1b22c"))               # -> a、b、c\nprint(re.sub("[0-9]", "*", "a1b2"))                 # -> a*b*\nprint(re.match("[a-z]+", "abc123").group())          # -> abc' },
      { t: 'table', head: ['需求', '写法'], rows: [
        ['随机整数', '<code>random.randint(1, 6)</code>'],
        ['可复现随机', '<code>random.seed(42)</code>'],
        ['取整', '<code>math.floor(3.7)</code>、<code>round(3.14159, 2)</code>'],
        ['路径拼接', '<code>os.path.join("data", "a.txt")</code>'],
        ['路径是否存在', '<code>os.path.exists(p)</code>'],
        ['文件名 / 目录', '<code>os.path.basename(p)</code>、<code>os.path.dirname(p)</code>'],
        ['列出目录', '<code>os.listdir(".")</code>'],
        ['当前时间', '<code>datetime.now()</code>'],
        ['格式化时间', '<code>dt.strftime("%Y-%m-%d")</code>'],
        ['解析时间', '<code>datetime.strptime(s, "%Y-%m-%d")</code>']
      ]},
      { t: 'callout', kind: 'tip', title: '导入方式', html: '<code>import math</code> 后用 <code>math.sqrt</code>；<code>from math import sqrt</code> 后可直接用 <code>sqrt</code>。避免 <code>from module import *</code>，会污染命名空间、掩盖拼写错误。' }
    ]
  },
  {
    label: '综合套路',
    blocks: [
      { t: 'code', caption: '读文件统计词频 TopN', lang: 'python', code: 'from collections import Counter\n\nwith open("article.txt", "w", encoding="utf-8") as f:\n    f.write("the cat and the dog and the bird")\nwith open("article.txt", encoding="utf-8") as f:\n    text = f.read()\nwords = text.lower().split()\ntop = Counter(words).most_common(3)\nfor word, n in top:\n    print(word, n)          # -> the 3 / and 2 / cat 1' },
      { t: 'code', caption: '排序取 TopN、字典分组、去重保序', lang: 'python', code: 'scores = {"王小明": 92, "张伟": 88, "李娜": 95}\ntop2 = sorted(scores.items(), key=lambda kv: -kv[1])[:2]\nprint(top2)      # 分数最高的前两名\n\nby_first = {}\nfor name in scores:\n    by_first.setdefault(name[0], []).append(name)\nprint(by_first)  # 按姓氏分组\n\nseen, unique = set(), []\nfor x in [3, 1, 3, 2, 1]:\n    if x not in seen:\n        seen.add(x)\n        unique.append(x)\nprint(unique)    # -> [3, 1, 2]' },
      { t: 'code', caption: '列表推导与生成器表达式', lang: 'python', code: 'nums = range(1, 11)\nevens = [n for n in nums if n % 2 == 0]      # 列表推导 + 条件\nsquares = {n: n * n for n in range(1, 4)}    # 字典推导\ntotal = sum(n * n for n in nums)             # 生成器表达式，省内存\nprint(evens)         # -> [2, 4, 6, 8, 10]\nprint(squares)       # -> {1: 1, 2: 4, 3: 9}\nprint(total)         # -> 385' },
      { t: 'table', head: ['常见坑', '现象', '正确写法'], rows: [
        ['整数除法', '<code>7 / 2</code> 得 3.5，不是 3', '要整数用 <code>7 // 2</code>'],
        ['默认参数可变', '<code>def f(lst=[])</code> 多次调用共享同一个列表', '默认写 <code>None</code>，函数内再创建'],
        ['浅拷贝', '<code>b = a</code> 只是别名', '<code>a[:]</code>、<code>a.copy()</code>、<code>copy.deepcopy</code>'],
        ['遍历时修改列表', '边 for 边 remove 会漏掉元素', '遍历副本 <code>for x in a[:]</code>'],
        ['字符串不可变', '<code>s[0] = "X"</code> 抛 TypeError', '用切片拼接生成新字符串'],
        ['用 == 判断 None', '可能被自定义 <code>__eq__</code> 影响', '统一用 <code>x is None</code>']
      ]},
      { t: 'callout', kind: 'exam', title: '考场提醒', html: '写完循环先检查边界（空列表、单元素、越界）；字典取值优先 <code>get</code>；需要「去重且保序」用 <code>seen</code> 集合加列表，不要直接 <code>set()</code>，因为集合会打乱顺序。' }
    ]
  }
];

var CHEATSHEET_C = [
  {
    label: '类型与运算',
    blocks: [
      { t: 'h', lvl: 3, text: '基本类型与 sizeof' },
      { t: 'table', head: ['类型', '典型大小', 'printf 格式', '要点'], rows: [
        ['<code>char</code>', '1 字节', '<code>%c</code>', '是否带符号由实现定义；要存 0~255 用 <code>unsigned char</code>'],
        ['<code>int</code>', '通常 4 字节', '<code>%d</code>', '至少 16 位，常见 32 位'],
        ['<code>unsigned</code>', '同 <code>int</code>', '<code>%u</code>', '溢出按模 2^N 回绕'],
        ['<code>long</code>', '4 或 8 字节', '<code>%ld</code>', 'Windows 常见 4 字节，64 位 Linux 为 8'],
        ['<code>long long</code>', '通常 8 字节', '<code>%lld</code>', 'C99 起至少 64 位'],
        ['<code>float</code>', '4 字节', '<code>%f</code>', '默认浮点常量是 <code>double</code>'],
        ['<code>double</code>', '8 字节', '<code>%f</code>', '<code>printf</code> 中 float 会提升为 double，统一用 <code>%f</code>'],
        ['<code>size_t</code>', '无符号', '<code>%zu</code>', '<code>sizeof</code> 的结果类型']
      ], caption: '大小依赖平台与编译器；考试常问“至少多少位”' },
      { t: 'code', caption: 'sizeof、整数除法与取余', lang: 'c', code: '#include <stdio.h>\n\nint main(void) {\n    printf("%zu %zu %zu\\n", sizeof(int), sizeof(char), sizeof(double));\n    int a = 7, b = -7;\n    printf("%d %d\\n", a / 3, a % 3);    /* 2 1 */\n    printf("%d %d\\n", b / 3, b % 3);    /* -2 -1，C99 起向零截断 */\n    printf("%d\\n", 7 / 2);              /* 3，整数除法 */\n    printf("%.2f\\n", 7 / 2.0);          /* 3.50 */\n    return 0;\n}' },
      { t: 'code', caption: '位运算、字符与截断', lang: 'c', code: '#include <stdio.h>\n\nint main(void) {\n    unsigned int flags = 0x0F;\n    flags |= 0x30;           /* 置位：0x0F -> 0x3F */\n    flags &= ~0x01u;         /* 清位：0x3F -> 0x3E */\n    printf("%u\\n", flags);   /* 62 */\n\n    printf("%d\\n", 1 << 3);  /* 8 */\n    printf("%d\\n", -8 >> 1); /* 有符号右移：实现定义，常见 -4 */\n\n    char c = \'A\';\n    printf("%d %c\\n", c, c); /* 65 A */\n\n    int big = 300;\n    unsigned char t = (unsigned char)big; /* 截断：300 % 256 = 44 */\n    printf("%u\\n", (unsigned int)t);      /* 44 */\n    return 0;\n}' },
      { t: 'callout', kind: 'exam', title: '三条铁律', html: '<code>-7 / 3</code> 得 <code>-2</code>，<code>-7 % 3</code> 得 <code>-1</code>（C99 起向零截断）；有符号整数溢出是未定义行为，无符号溢出按模回绕；<code>char</code> 是否有符号由实现定义，不要假设。' }
    ]
  },
  {
    label: '指针',
    blocks: [
      { t: 'h', lvl: 3, text: '地址、解引用与传参' },
      { t: 'table', head: ['写法', '含义'], rows: [
        ['<code>&amp;x</code>', '取变量 x 的地址'],
        ['<code>*p</code>', '解引用：读写 p 指向的对象'],
        ['<code>int *p</code>', '声明 p 为指向 int 的指针；<code>*</code> 属于变量名'],
        ['<code>p + 1</code>', '向后移动一个元素，不是 1 字节'],
        ['<code>p++</code>', '指针后移，表达式的值是原指针'],
        ['<code>(*p)++</code>', '把 p 指向的值加 1'],
        ['<code>NULL</code>', '空指针常量，解引用前必须判空'],
        ['<code>const int *p</code>', '不能通过 p 改值，p 可以改指向'],
        ['<code>int *const p</code>', 'p 本身不能改指向，值可以改']
      ], caption: '指针的类型决定一次移动多少字节' },
      { t: 'code', caption: '交换两个变量：通过指针修改实参', lang: 'c', code: '#include <stdio.h>\n\nvoid swap(int *a, int *b) {\n    int t = *a;\n    *a = *b;\n    *b = t;\n}\n\nint main(void) {\n    int x = 1, y = 2;\n    swap(&x, &y);\n    printf("%d %d\\n", x, y);  /* 2 1 */\n    int *p = &x;\n    *p = 10;                  /* 通过指针改 x */\n    printf("%d\\n", x);        /* 10 */\n    return 0;\n}' },
      { t: 'code', caption: '指针算术、数组退化与 const 指针', lang: 'c', code: '#include <stdio.h>\n\nint main(void) {\n    int a[4] = {10, 20, 30, 40};\n    int *p = a;                      /* 数组名退化为首元素地址 */\n    printf("%d %d\\n", *p, *(p + 2)); /* 10 30 */\n    printf("%d\\n", a[2]);            /* 等价于 *(a + 2) */\n    p++;                             /* 移动一个 int */\n    printf("%d\\n", *p);              /* 20 */\n\n    const int *q = a;   /* 不能通过 q 改值 */\n    int *const r = a;   /* r 不能改指向 */\n    printf("%d %d\\n", *q, *r);\n    /* *q = 1;    编译错误 */\n    /* r = &a[1]; 编译错误 */\n    return 0;\n}' },
      { t: 'code', caption: '二级指针：修改指针本身', lang: 'c', code: '#include <stdio.h>\n\nint main(void) {\n    int x = 5;\n    int *p = &x;\n    int **pp = &p;      /* pp 指向 p */\n    **pp = 7;           /* 等价于 x = 7 */\n    printf("%d\\n", x);  /* 7 */\n    return 0;\n}' },
      { t: 'callout', kind: 'warn', title: '野指针与失效指针', html: '局部指针未初始化时不要解引用；函数返回后，指向其局部变量的指针立即失效；<code>free</code> 之后的指针也不可再用。' }
    ]
  },
  {
    label: '数组',
    blocks: [
      { t: 'h', lvl: 3, text: '声明、下标与长度' },
      { t: 'table', head: ['写法', '含义'], rows: [
        ['<code>int a[5];</code>', '5 个元素；局部数组未初始化，值不确定'],
        ['<code>int a[5] = {0};</code>', '全部元素为 0'],
        ['<code>int a[] = {1, 2, 3};</code>', '长度由初始化列表决定，为 3'],
        ['<code>int m[2][3];</code>', '2 行 3 列，按行连续存放'],
        ['<code>a[i]</code>', '等价于 <code>*(a + i)</code>，下标从 0 开始'],
        ['<code>sizeof(a) / sizeof(a[0])</code>', '元素个数；仅对本作用域内的数组名有效']
      ], caption: '数组名在大多数表达式里退化为首元素指针' },
      { t: 'code', caption: '初始化、遍历与二维数组', lang: 'c', code: '#include <stdio.h>\n\nint main(void) {\n    int a[5] = {1, 2, 3};              /* 其余元素补 0 */\n    int n = (int)(sizeof(a) / sizeof(a[0]));\n    for (int i = 0; i < n; i++) printf("%d ", a[i]);\n    printf("\\n");\n\n    int m[2][3] = {{1, 2, 3}, {4, 5, 6}};\n    for (int i = 0; i < 2; i++)\n        for (int j = 0; j < 3; j++)\n            printf("%d ", m[i][j]);\n    printf("\\n");\n    printf("%zu\\n", sizeof(m) / sizeof(m[0]));  /* 2，行数 */\n    return 0;\n}' },
      { t: 'code', caption: '字符串数组：指针数组', lang: 'c', code: '#include <stdio.h>\n\nint main(void) {\n    const char *days[] = {"Mon", "Tue", "Wed"};\n    int n = (int)(sizeof(days) / sizeof(days[0]));\n    for (int i = 0; i < n; i++) printf("%s\\n", days[i]);\n    return 0;\n}' },
      { t: 'callout', kind: 'warn', html: '越界读写是未定义行为，可能“看起来正常”却在别处崩溃。函数形参写成 <code>int a[]</code> 时实际是指针，<code>sizeof(a)</code> 得到的是指针大小，必须另传长度。' }
    ]
  },
  {
    label: '字符串',
    blocks: [
      { t: 'h', lvl: 3, text: 'C 字符串就是 char 数组' },
      { t: 'table', head: ['函数', '作用', '注意'], rows: [
        ['<code>strlen(s)</code>', '求长度', '不含结尾的 <code>\'\\0\'</code>'],
        ['<code>strcpy(dst, src)</code>', '复制字符串', '连同 <code>\'\\0\'</code> 一起复制，不检查容量'],
        ['<code>strncpy(dst, src, n)</code>', '最多复制 n 字节', 'src 不短于 n 时不会补 <code>\'\\0\'</code>'],
        ['<code>strcat(dst, src)</code>', '追加到末尾', 'dst 必须有足够空间'],
        ['<code>strcmp(a, b)</code>', '按字典序比较', '相等返回 0；判相等要写 <code>strcmp(a, b) == 0</code>'],
        ['<code>strchr(s, c)</code>', '查找字符', '返回指针或 <code>NULL</code>'],
        ['<code>strstr(s, sub)</code>', '查找子串', '返回指针或 <code>NULL</code>'],
        ['<code>snprintf(buf, n, ...)</code>', '格式化到缓冲区', '最多写 n-1 个字符并补 <code>\'\\0\'</code>']
      ], caption: '这些函数都在 <code>&lt;string.h&gt;</code> 中' },
      { t: 'code', caption: '基础用法：strlen / strcmp / strchr / snprintf', lang: 'c', code: '#include <stdio.h>\n#include <string.h>\n\nint main(void) {\n    char s[] = "hello";\n    printf("%zu %zu\\n", strlen(s), sizeof(s));  /* 5 6 */\n    printf("%zu\\n", sizeof("abc"));             /* 4，含 \'\\0\' */\n    printf("%d\\n", strcmp("abc", "abd") < 0);   /* 1 */\n    char *p = strchr(s, \'l\');\n    if (p != NULL) printf("%s\\n", p);           /* llo */\n    char buf[16];\n    snprintf(buf, sizeof(buf), "%s-%d", s, 42);\n    printf("%s\\n", buf);                        /* hello-42 */\n    return 0;\n}' },
      { t: 'code', caption: '字符函数：isalpha / isdigit / toupper', lang: 'c', code: '#include <stdio.h>\n#include <ctype.h>\n\nint main(void) {\n    char s[] = "Hello, C 2024!";\n    int letters = 0, digits = 0;\n    for (int i = 0; s[i] != \'\\0\'; i++) {\n        unsigned char c = (unsigned char)s[i];\n        if (isalpha(c)) letters++;\n        if (isdigit(c)) digits++;\n        s[i] = (char)toupper(c);\n    }\n    printf("%s\\n%d %d\\n", s, letters, digits);\n    return 0;\n}' },
      { t: 'callout', kind: 'warn', title: '缓冲区溢出与只读字面量', html: '<code>strcpy</code>/<code>strcat</code> 不知道目标多大，工程代码优先 <code>snprintf</code>，或用 <code>strncpy</code> 后手动补 <code>\'\\0\'</code>。字符串字面量通常放在只读区，<code>char *s = "abc"; s[0] = \'x\';</code> 是未定义行为。' }
    ]
  },
  {
    label: '结构体',
    blocks: [
      { t: 'h', lvl: 3, text: '定义、typedef 与成员访问' },
      { t: 'code', caption: 'typedef、嵌套结构体与结构体数组', lang: 'c', code: '#include <stdio.h>\n\ntypedef struct { int x, y; } Point;\n\ntypedef struct {\n    char name[16];\n    Point pos;\n} Player;\n\nint main(void) {\n    Point p = {3, 4};\n    Player pl = {"Ann", {1, 2}};\n    Player *q = &pl;\n    printf("%d %d\\n", p.x, p.y);\n    printf("%s (%d,%d)\\n", q->name, q->pos.x, q->pos.y);\n    Point arr[2] = {{0, 0}, {5, 6}};\n    for (int i = 0; i < 2; i++) printf("%d ", arr[i].x);\n    printf("\\n");\n    return 0;\n}' },
      { t: 'table', head: ['主题', '写法', '说明'], rows: [
        ['访问成员', '<code>p.x</code>', '结构体变量用点'],
        ['指针访问', '<code>q-&gt;x</code>', '等价于 <code>(*q).x</code>'],
        ['传值', '<code>void f(Point p)</code>', '复制整个结构体，函数内修改不影响外部'],
        ['传指针', '<code>void f(Point *p)</code>', '只复制地址，可修改原对象；大结构体更高效'],
        ['嵌套', '<code>pl.pos.x</code>', '逐层用点访问'],
        ['对齐', '<code>sizeof(struct)</code>', '可能大于成员大小之和，编译器会插入填充字节']
      ], caption: 'typedef 之后可以省略 <code>struct</code> 关键字' },
      { t: 'code', caption: '结构体传值 vs 传指针', lang: 'c', code: '#include <stdio.h>\n\ntypedef struct { int hp; } Unit;\n\nvoid damage_val(Unit u) { u.hp -= 10; }    /* 改副本，外部不变 */\nvoid damage_ptr(Unit *u) { u->hp -= 10; }  /* 改原对象 */\n\nint main(void) {\n    Unit a = {100};\n    damage_val(a);\n    printf("%d\\n", a.hp);   /* 100 */\n    damage_ptr(&a);\n    printf("%d\\n", a.hp);   /* 90 */\n    return 0;\n}' },
      { t: 'callout', kind: 'tip', title: '对齐示例', html: '<code>struct A { char c; int i; };</code> 在常见 x86-64 上占 8 字节：<code>c</code> 后有 3 字节填充。成员顺序会影响大小；需要精确偏移时用 <code>offsetof</code>（<code>&lt;stddef.h&gt;</code>）。' }
    ]
  },
  {
    label: '函数',
    blocks: [
      { t: 'h', lvl: 3, text: '声明、原型与值传递' },
      { t: 'code', caption: '函数原型与按值传递', lang: 'c', code: '#include <stdio.h>\n\nint add(int a, int b);                  /* 原型：可放在头文件 */\n\nint add(int a, int b) { return a + b; }\n\nvoid try_change(int x) { x = 99; }      /* 只改副本 */\n\nint main(void) {\n    int n = 3;\n    try_change(n);\n    printf("%d %d\\n", n, add(2, n));    /* 3 5 */\n    return 0;\n}' },
      { t: 'code', caption: '函数指针与 qsort 回调', lang: 'c', code: '#include <stdio.h>\n#include <stdlib.h>\n\nint cmp_int(const void *a, const void *b) {\n    int x = *(const int *)a;\n    int y = *(const int *)b;\n    return (x > y) - (x < y);\n}\n\nint main(void) {\n    int a[] = {3, 1, 4, 1, 5};\n    int n = (int)(sizeof(a) / sizeof(a[0]));\n    qsort(a, (size_t)n, sizeof(a[0]), cmp_int);\n    for (int i = 0; i < n; i++) printf("%d ", a[i]);  /* 1 1 3 4 5 */\n    printf("\\n");\n\n    int (*fp)(const void *, const void *) = cmp_int;  /* 函数指针 */\n    printf("%d\\n", fp(&a[0], &a[4]) < 0);             /* 1 */\n    return 0;\n}' },
      { t: 'code', caption: '递归：阶乘', lang: 'c', code: '#include <stdio.h>\n\nlong fact(int n) {\n    if (n <= 1) return 1;       /* 终止条件 */\n    return n * fact(n - 1);\n}\n\nint main(void) {\n    printf("%ld\\n", fact(5));   /* 120 */\n    return 0;\n}' },
      { t: 'table', head: ['主题', '要点'], rows: [
        ['函数原型', '<code>int add(int, int);</code> 让编译器检查调用'],
        ['按值传递', '形参是副本；数组传参退化为指针'],
        ['返回指针', '不能返回局部数组或局部变量的地址'],
        ['函数指针', '<code>int (*fp)(int, int);</code> 可保存函数地址、做回调'],
        ['static 函数', '内部链接，只在本源文件可见'],
        ['static 局部变量', '只初始化一次，生命周期持续到程序结束'],
        ['递归', '必须有终止条件，否则栈溢出']
      ], caption: '声明与定义分开写，便于多文件编译' },
      { t: 'callout', kind: 'exam', title: 'qsort 回调', html: '比较函数的参数是 <code>const void *</code>，返回负数、0、正数分别表示小于、等于、大于。用 <code>(x &gt; y) - (x &lt; y)</code> 可避免减法溢出。' }
    ]
  },
  {
    label: '内存',
    blocks: [
      { t: 'h', lvl: 3, text: '栈、堆与动态内存' },
      { t: 'table', head: ['函数', '作用', '要点'], rows: [
        ['<code>malloc(size)</code>', '分配指定字节数', '内容未初始化，失败返回 <code>NULL</code>'],
        ['<code>calloc(n, size)</code>', '分配 n 个元素', '全部清零'],
        ['<code>realloc(p, size)</code>', '调整已分配块', '可能搬移；失败返回 <code>NULL</code> 且原块仍有效'],
        ['<code>free(p)</code>', '释放', '只能释放一次；释放后指针悬空'],
        ['<code>sizeof *p</code>', '元素大小', '比写死类型更安全'],
        ['栈', '自动变量', '函数返回即失效，容量通常只有几 MB'],
        ['堆', 'malloc 系列', '手动管理，忘记释放就泄漏']
      ], caption: '所有分配函数都在 <code>&lt;stdlib.h&gt;</code>' },
      { t: 'code', caption: 'malloc 判空、realloc 与 free 模板', lang: 'c', code: '#include <stdio.h>\n#include <stdlib.h>\n\nint main(void) {\n    int n = 5;\n    int *a = malloc((size_t)n * sizeof *a);\n    if (a == NULL) { perror("malloc"); return 1; }\n    for (int i = 0; i < n; i++) a[i] = i * i;\n\n    int *tmp = realloc(a, (size_t)(n * 2) * sizeof *a);\n    if (tmp == NULL) { free(a); return 1; }   /* 原内存仍有效 */\n    a = tmp;\n    for (int i = n; i < n * 2; i++) a[i] = i;\n\n    printf("%d %d\\n", a[0], a[9]);            /* 0 9 */\n    free(a);\n    a = NULL;                                 /* 避免悬空指针 */\n    return 0;\n}' },
      { t: 'code', caption: 'calloc：分配并清零', lang: 'c', code: '#include <stdio.h>\n#include <stdlib.h>\n\nint main(void) {\n    size_t n = 4;\n    int *a = calloc(n, sizeof *a);\n    if (a == NULL) { perror("calloc"); return 1; }\n    for (size_t i = 0; i < n; i++) printf("%d ", a[i]);  /* 0 0 0 0 */\n    printf("\\n");\n    free(a);\n    return 0;\n}' },
      { t: 'callout', kind: 'warn', title: '四类内存错误', html: '泄漏（忘记 <code>free</code>）、悬空指针（<code>free</code> 后继续用）、双重释放、越界写破坏堆管理信息。分配后先判 <code>NULL</code>；释放后把指针置 <code>NULL</code>。' }
    ]
  },
  {
    label: '文件',
    blocks: [
      { t: 'h', lvl: 3, text: 'fopen / fclose 与文本读写' },
      { t: 'table', head: ['模式', '含义', '注意'], rows: [
        ['<code>"r"</code>', '只读文本', '文件必须存在'],
        ['<code>"w"</code>', '只写文本', '存在则清空，不存在则创建'],
        ['<code>"a"</code>', '追加文本', '总是写到末尾'],
        ['<code>"r+"</code> / <code>"w+"</code>', '读写', '<code>"w+"</code> 会先清空'],
        ['<code>"rb"</code> / <code>"wb"</code>', '二进制', '不做换行转换'],
        ['<code>EOF</code>', '文件结束标志', '<code>fgetc</code> 返回 <code>int</code> 才能和 <code>EOF</code> 区分']
      ], caption: '模式字符串写错是运行时才暴露的错误' },
      { t: 'code', caption: 'fprintf 写文件，fgets 逐行读', lang: 'c', code: '#include <stdio.h>\n\nint main(void) {\n    FILE *fp = fopen("out.txt", "w");\n    if (fp == NULL) { perror("fopen"); return 1; }\n    fprintf(fp, "%d %s\\n", 42, "answer");\n    fclose(fp);\n\n    fp = fopen("out.txt", "r");\n    if (fp == NULL) { perror("fopen"); return 1; }\n    char line[128];\n    while (fgets(line, sizeof(line), fp) != NULL)\n        printf("%s", line);\n    if (ferror(fp)) perror("read");\n    fclose(fp);\n    return 0;\n}' },
      { t: 'code', caption: 'fputc / fgetc 逐字符读写', lang: 'c', code: '#include <stdio.h>\n\nint main(void) {\n    FILE *fp = fopen("bytes.txt", "w");\n    if (fp == NULL) { perror("fopen"); return 1; }\n    fputc(\'A\', fp);\n    fputc(\'\\n\', fp);\n    fclose(fp);\n\n    fp = fopen("bytes.txt", "r");\n    if (fp == NULL) { perror("fopen"); return 1; }\n    int ch;\n    while ((ch = fgetc(fp)) != EOF) putchar(ch);\n    fclose(fp);\n    return 0;\n}' },
      { t: 'code', caption: 'fscanf：逐个读取整数直到失败', lang: 'c', code: '#include <stdio.h>\n\nint main(void) {\n    FILE *fp = fopen("nums.txt", "r");   /* 每行一个整数 */\n    if (fp == NULL) { perror("fopen"); return 1; }\n    int x, sum = 0;\n    while (fscanf(fp, "%d", &x) == 1) sum += x;\n    fclose(fp);\n    printf("%d\\n", sum);\n    return 0;\n}' },
      { t: 'callout', kind: 'tip', title: '换行与返回值', html: '<code>fgets</code> 会把换行符一起读进来；缓冲区够大时一行一次，超长时只读一部分。读文件要判断 <code>fgets</code>/<code>fscanf</code> 的返回值，写文件要检查 <code>fclose</code> 是否成功。二进制数据用 <code>fread</code>/<code>fwrite</code> 配 <code>"rb"</code>/<code>"wb"</code>。' }
    ]
  },
  {
    label: '预处理器与编译',
    blocks: [
      { t: 'h', lvl: 3, text: '宏、头文件与编译命令' },
      { t: 'code', caption: '宏参数必须加括号', lang: 'c', code: '#include <stdio.h>\n\n#define SQ(x) ((x) * (x))\n#define BAD(x) x * x\n\nint main(void) {\n    printf("%d\\n", SQ(1 + 2));   /* 9，括号保护 */\n    printf("%d\\n", BAD(1 + 2));  /* 5，展开为 1 + 2 * 1 + 2 */\n    return 0;\n}' },
      { t: 'code', caption: '片段：头文件 point.h 的保护写法', lang: 'c', code: '#ifndef POINT_H\n#define POINT_H\n\ntypedef struct { int x, y; } Point;\n\n#endif' },
      { t: 'table', head: ['写法 / 命令', '作用'], rows: [
        ['<code>#include &lt;stdio.h&gt;</code>', '先查系统头文件目录'],
        ['<code>#include "my.h"</code>', '先查当前源文件所在目录'],
        ['<code>#define N 100</code>', '对象式宏，只做文本替换、没有类型'],
        ['<code>#ifndef X</code> … <code>#endif</code>', '头文件保护，防止重复包含'],
        ['<code>gcc -Wall -Wextra -std=c11 -o app main.c util.c</code>', '编译并链接多个源文件'],
        ['<code>gcc -c util.c</code>', '只编译成 <code>util.o</code>，不链接'],
        ['<code>gcc -g</code>', '生成调试信息，供 gdb 使用'],
        ['<code>gcc ... -lm</code>', '链接数学库，放在源文件之后']
      ], caption: '警告不是噪声：<code>-Wall</code> 能提前发现很多真实 bug' },
      { t: 'callout', kind: 'exam', title: '常见编译错误', html: '忘记 <code>#include &lt;stdio.h&gt;</code> 会出现隐式声明警告；少分号通常报在下一行；<code>undefined reference to \'foo\'</code> 表示声明了但没链接实现（漏了 <code>.o</code> 或 <code>-lm</code>）；宏参数不加括号会得到错误结果。' }
    ]
  }
];

  VIEWS.cheatsheet = function () {
    var data = (SITE_LANG === 'c') ? CHEATSHEET_C : CHEATSHEET_PY;
    var root = el('div');
    root.appendChild(pageHead({
      crumb: '<a href="#/">OVERVIEW</a><span>/</span><span>CHEAT_SHEET</span>',
      kicker: 'QUICK_REFERENCE // 速查表',
      title: (SITE_LANG === 'c' ? 'C 速查表' : 'Python 速查表'),
      en: 'CHEAT SHEET · 一页纸复习',
      meta: [
        ['SECTIONS', String(data.length).padStart(2, '0')],
        ['MODE', 'REVIEW'],
        ['LANG', SITE_LABEL]
      ],
      lead: '考前 30 分钟看这一页。语法、模板、常用函数与常见坑都在这里；示例都可以复制到本地运行。'
    }));
    var wrap = el('div', { class: 'csWrap' });
    root.appendChild(wrap);
    renderBlocks(wrap, [{ t: 'tabs', items: data }], {});
    setContent(root);
  };

  /* ------------------------------------------------------------------ 航线图 */
  VIEWS.map = function () {
    var root = el('div');
    var partOrder = [], byPart = {};
    chapterMeta.forEach(function (m) {
      if (!byPart[m.part]) { byPart[m.part] = []; partOrder.push(m.part); }
      byPart[m.part].push(m);
    });
    var colors = ['var(--accent2)', 'var(--const-yellow)', 'var(--accent)', 'var(--ok)'];
    root.appendChild(pageHead({
      crumb: '<a href="#/">OVERVIEW</a><span>/</span><span>FLIGHT_PLAN</span>',
      kicker: 'FLIGHT_PLAN // 课程航线图',
      title: '课程航线图',
      en: 'FLIGHT PLAN · ' + chapterMeta.length + ' 个模块的依赖关系',
      meta: [
        ['NODES', String(chapterMeta.length)],
        ['PARTS', String(partOrder.length)],
        ['ORDER', 'SEQUENTIAL']
      ],
      lead: '把 ' + chapterMeta.length + ' 章想成一趟飞行：每一站都建立在前面几站之上。虚线是顺序依赖，同色为一组。点任意节点直接进入模块。'
    }));

    var W = 1080, H = 566, PAD = 40, LABEL_W = 118;
    var rowH = Math.min(120, Math.floor((H - 100) / Math.max(1, partOrder.length)));
    var groups = partOrder.map(function (name, gi) {
      return { name: name, color: colors[gi % colors.length], ids: byPart[name].map(function (m) { return m.id; }) };
    });
    var nodes = [];
    groups.forEach(function (g, gi) {
      var baseY = 92 + gi * rowH;
      g.ids.forEach(function (id, i) {
        var meta = chapterMeta.find(function (m) { return m.id === id; });
        if (!meta) return;
        var t = (i + 0.5) / g.ids.length;
        nodes.push({
          id: id, num: meta.num, title: meta.title, en: meta.en,
          x: PAD + LABEL_W + t * (W - PAD * 2 - LABEL_W),
          y: baseY, color: g.color, group: gi
        });
      });
    });

    var svg = '<svg class="mapSvg" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="课程航线图">';
    svg += '<defs><pattern id="mapGrid" width="36" height="36" patternUnits="userSpaceOnUse">'
      + '<path d="M36 0 H0 V36" fill="none" stroke="rgba(255,255,255,.045)" stroke-width="1"/></pattern></defs>';
    svg += '<rect x="0" y="0" width="' + W + '" height="' + H + '" fill="url(#mapGrid)"/>';

    groups.forEach(function (g, gi) {
      var y = 92 + gi * rowH;
      svg += '<path d="M' + (PAD + LABEL_W - 34) + ' ' + y + ' C ' + (W * 0.3) + ' ' + (y - 22) + ', ' + (W * 0.7) + ' ' + (y + 22) + ', ' + (W - PAD + 12) + ' ' + y
        + '" fill="none" stroke="' + g.color + '" stroke-opacity=".22" stroke-width="1.4" stroke-dasharray="3 6"/>';
      svg += '<line x1="16" y1="' + (y - 4) + '" x2="' + (PAD + LABEL_W - 40) + '" y2="' + (y - 4) + '" stroke="' + g.color + '" stroke-opacity=".18" stroke-width="1"/>';
      svg += '<text x="16" y="' + (y + 3) + '" fill="' + g.color + '" fill-opacity=".85" '
        + 'font-family="var(--mono)" font-size="8.5" letter-spacing="2.4">' + esc(g.name) + '</text>';
    });

    // 顺序依赖：上一组最后一章 → 下一组第一章
    for (var gi2 = 0; gi2 < groups.length - 1; gi2++) {
      var lastId = groups[gi2].ids[groups[gi2].ids.length - 1];
      var firstId = groups[gi2 + 1].ids[0];
      var a = nodes.find(function (n) { return n.id === lastId; });
      var b = nodes.find(function (n) { return n.id === firstId; });
      if (!a || !b) continue;
      var mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
      svg += '<path d="M' + a.x + ' ' + a.y + ' Q ' + mx + ' ' + my + ' ' + b.x + ' ' + b.y
        + '" fill="none" stroke="rgba(255,255,255,.12)" stroke-width="1" stroke-dasharray="2 5"/>';
    }

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
    var legend = el('div', { class: 'mapLegend' });
    groups.forEach(function (g) {
      legend.appendChild(el('span', { html: '<i class="legendDot" style="background:' + g.color + '"></i>' + esc(g.name) }));
    });
    legend.appendChild(el('span', { class: 'dim', text: '虚线 = 顺序依赖' }));
    root.appendChild(legend);
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
    site: SITE,
    siteId: SITE_ID,
    highlightCode: highlightCode,
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
    registerProjects: registerProjects,
    registerViz: function (v) { CSC.viz = v; bus.emit('viz:ready', v); },
    loadQuizPack: loadQuizPack,
    loadExams: loadExams,
    loadProjects: loadProjects,
    loadModule: loadModule,
    loadModules: loadModules,
    route: route,
    go: function (hash) { if (location.hash === hash) route(); else location.hash = hash; },
    current: { view: 'home', id: null },
    renderBlocks: renderBlocks,
    renderMarkdownish: function (s) { return s; },
    store: store,
    records: records,
    migrateStorage: migrateStorage,
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
    codeLines: codeLines,
    viz: null,
    quiz: null,
    exam: null,
    projects: null
  };

  migrateStorage();

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

})();
