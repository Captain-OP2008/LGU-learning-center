/* =====================================================================
 * assets/catalog.js · 「全部课程」目录页渲染
 * 数据：window.COURSE_CATALOG（由 tools/build-catalog.js 生成）
 *      { generatedAt, stats:{courses,chapters,resources,built,depts},
 *        groups:[{ dept, en, blurb, courses:[{dir,id,short,title,en,zh,brand,
 *                  dept,sourceDir,chapters,lang,files,built,href,no}] }] }
 * 职责：① 填统计数字 ② 渲染院系 chips 与分组卡片 ③ 搜索过滤 + 关键词高亮
 *      ④ 键盘 / 聚焦搜索、Esc 清空 ⑤ 未建站显示「建设中」且不可点击
 * ===================================================================== */
(function () {
  'use strict';

  var DATA = window.COURSE_CATALOG;
  if (!DATA || !DATA.groups) return;

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var el = function (tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  };
  var esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
    });
  };
  var pad2 = function (n) { return String(n).padStart(2, '0'); };

  var groupsBox = $('#groups');
  var chipsBox = $('#chips');
  var input = $('#q');
  var clearBtn = $('#clear');
  var emptyBox = $('#empty');
  var hint = $('#finderHint');
  var allCards = [];

  /* ── 1. 统计数字 ───────────────────────────────────────────────── */
  var st = DATA.stats || {};
  ['#hudCourses', '#fbCourses'].forEach(function (sel) {
    var n = $(sel); if (n) n.textContent = st.courses != null ? st.courses : '--';
  });
  ['#hudDepts', '#fbDepts'].forEach(function (sel) {
    var n = $(sel); if (n) n.textContent = st.depts != null ? st.depts : '--';
  });
  ['#hudRes', '#fbRes'].forEach(function (sel) {
    var n = $(sel); if (n) n.textContent = st.resources != null ? st.resources.toLocaleString('en-US') : '--';
  });
  var fbCh = $('#fbChapters'); if (fbCh) fbCh.textContent = st.chapters != null ? st.chapters : '--';
  var statNodes = document.querySelectorAll('#stats [data-stat]');
  Array.prototype.forEach.call(statNodes, function (n) {
    var key = n.getAttribute('data-stat');
    var val = st[key];
    if (val != null) n.textContent = key === 'resources' ? val.toLocaleString('en-US') : val;
  });

  /* ── 2. 卡片工厂 ───────────────────────────────────────────────── */
  function makeCard(c) {
    var tag = c.built ? 'a' : 'div';
    var card = el(tag, 'card' + (c.built ? '' : ' wip'));
    if (c.built) card.setAttribute('href', c.href);
    card.setAttribute('data-key', [c.title, c.en, c.short, c.sourceDir, c.dir, c.zh, c.brand].join(' ').toLowerCase());
    if (c.built) card.setAttribute('aria-label', c.title + '，' + c.chapters + ' 章');

    var top = el('span', 'cTop');
    top.appendChild(el('span', 'cNo', esc(c.no)));
    top.appendChild(el('span', 'cCode', esc(c.sourceDir || c.short)));
    top.appendChild(el('span', 'cState', c.built ? '已上线' : '建设中'));
    card.appendChild(top);

    card.appendChild(el('span', 'cZh', esc(c.title)));
    if (c.en) card.appendChild(el('span', 'cEn', esc(c.en)));

    var meta = el('span', 'cMeta');
    meta.appendChild(el('span', null, esc(c.chapters) + ' <i>章</i>'));
    if (c.files) meta.appendChild(el('span', null, esc(c.files) + ' <i>份资料</i>'));
    card.appendChild(meta);

    return card;
  }

  /* ── 3. 渲染分组 ───────────────────────────────────────────────── */
  DATA.groups.forEach(function (g, gi) {
    var sec = el('section', 'grp');
    sec.id = 'dept-' + (gi + 1);

    var head = el('div', 'grpHead');
    head.appendChild(el('span', 'grpNo', 'DEPT ' + pad2(gi + 1)));
    var h2 = el('h2', 'grpZh'); h2.textContent = g.dept;
    head.appendChild(h2);
    if (g.en) head.appendChild(el('span', 'grpEn', esc(g.en)));
    head.appendChild(el('span', 'grpCount', g.courses.length + ' COURSES'));
    sec.appendChild(head);

    if (g.blurb) sec.appendChild(el('p', 'grpBlurb', esc(g.blurb)));

    var grid = el('div', 'grid');
    g.courses.forEach(function (c) {
      var card = makeCard(c);
      card.setAttribute('data-group', String(gi));
      allCards.push(card);
      grid.appendChild(card);
    });
    sec.appendChild(grid);
    groupsBox.appendChild(sec);

    /* chip */
    var chip = el('button', 'chip', esc(g.dept) + '<b>' + g.courses.length + '</b>');
    chip.type = 'button';
    chip.setAttribute('data-target', sec.id);
    chip.addEventListener('click', function () {
      sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      sec.classList.add('flash');
      setTimeout(function () { sec.classList.remove('flash'); }, 900);
    });
    chipsBox.appendChild(chip);
  });

  /* ── 4. 搜索过滤 ───────────────────────────────────────────────── */
  var defaultHint = hint ? hint.innerHTML : '';

  function clearMarks(node) {
    var marks = node.querySelectorAll('mark');
    Array.prototype.forEach.call(marks, function (m) {
      var parent = m.parentNode;
      parent.replaceChild(document.createTextNode(m.textContent), m);
      parent.normalize();
    });
  }

  function markIn(node, kw) {
    if (!kw) return;
    var walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null);
    var hits = [];
    var t;
    while ((t = walker.nextNode())) {
      var i = t.nodeValue.toLowerCase().indexOf(kw);
      if (i >= 0) hits.push([t, i]);
    }
    hits.forEach(function (pair) {
      var textNode = pair[0], idx = pair[1];
      var range = document.createRange();
      range.setStart(textNode, idx);
      range.setEnd(textNode, idx + kw.length);
      var mark = document.createElement('mark');
      range.surroundContents(mark);
    });
  }

  var sections = Array.prototype.slice.call(groupsBox.querySelectorAll('.grp'));

  function applyFilter(raw) {
    var kw = String(raw || '').trim().toLowerCase();
    var shown = 0;

    allCards.forEach(function (card) {
      clearMarks(card);
      var hit = !kw || (card.getAttribute('data-key') || '').indexOf(kw) >= 0;
      card.hidden = !hit;
      if (hit) {
        shown++;
        if (kw && kw.length >= 2) {
          var zh = card.querySelector('.cZh'), en = card.querySelector('.cEn');
          if (zh) markIn(zh, kw);
          if (en && !(zh && zh.textContent.toLowerCase().indexOf(kw) >= 0)) markIn(en, kw);
        }
      }
    });

    sections.forEach(function (sec) {
      var visible = sec.querySelectorAll('.card:not([hidden])').length;
      sec.hidden = visible === 0;
      var chip = chipsBox.querySelector('[data-target="' + sec.id + '"]');
      if (chip) chip.hidden = visible === 0;
    });

    emptyBox.hidden = shown > 0;
    clearBtn.hidden = !kw;
    if (hint) {
      hint.innerHTML = kw
        ? '匹配 <b>' + shown + '</b> 门课程' + (shown ? '' : ' — 换个关键词试试')
        : defaultHint;
    }
  }

  input.addEventListener('input', function () { applyFilter(input.value); });
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { input.value = ''; applyFilter(''); input.blur(); }
  });
  clearBtn.addEventListener('click', function () {
    input.value = ''; applyFilter(''); input.focus();
  });
  var resetBtn = $('#reset');
  if (resetBtn) resetBtn.addEventListener('click', function () {
    input.value = ''; applyFilter(''); input.focus();
  });

  /* ── 5. 键盘 ───────────────────────────────────────────────────── */
  document.addEventListener('keydown', function (e) {
    var tag = (e.target.tagName || '').toLowerCase();
    var typing = tag === 'input' || tag === 'textarea' || tag === 'select';
    if (e.key === '/' && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) {
      e.preventDefault();
      input.focus();
      input.select();
    }
  });

  /* ── 6. 生成时间标注 ───────────────────────────────────────────── */
  if (DATA.generatedAt) {
    hint.innerHTML = hint.innerHTML + ' <span class="genAt">· 索引 ' + esc(DATA.generatedAt) + '</span>';
    defaultHint = hint.innerHTML;
  }
})();
