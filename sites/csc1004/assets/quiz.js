/* =====================================================================
 * assets/quiz.js · 测验引擎
 * 职责：题库注册表 + 单题作答卡 + 题单（章节/tag 筛选、即时判分、解析）
 * 题型：mcq 单选 / multi 多选 / tf 判断 / fill 填空 / predict 预测输出 /
 *       order 排序 / code 编程（依赖 CSC.java，缺失时降级为显示参考答案）/
 *       findbug 找 bug（数据层 type:'fill' + mode:'findbug'，按 accept 关键点命中给分）
 * 梯度：tier1 模仿 / tier2 变式 / tier3 独立实现 / tier4 综合（题卡徽标 + 筛选，URL 同步）
 * 对外：CSC.quiz = { all, byId, mountCard, mountList, stats }
 * 数据：data/quiz.js 调用 CSC.registerQuizPack({ items:[…] }) 注入
 * ===================================================================== */
(function () {
  'use strict';

  var CSC = window.CSC;
  if (!CSC) return;
  var el = CSC.el;
  var esc = CSC.escapeHtml;
  var icon = CSC.icon;
  var LETTERS = 'ABCDEFGH'.split('');

  /* 行内标记：`code` → <code>，**bold** → <b>（深色主题里 code 由 CSS 着绿色） */
  function fmtMd(s) {
    if (s == null) return '';
    s = String(s);
    if (s.indexOf('`') < 0 && s.indexOf('**') < 0) return s;
    return s.replace(/`([^`\n]{1,200})`/g, '<code>$1</code>')
      .replace(/\*\*([^*<>\n]{1,80})\*\*/g, '<b>$1</b>');
  }

  /* ------------------------------------------------------------------ 注册表 */
  var items = [];                 // 题目数组，顺序 = 注册顺序
  var byIdMap = Object.create(null);
  var seenPacks = [];             // 已合并的 pack（同一对象只合并一次）

  /** 合并一个题库包。重复 id 覆盖内容但保留原顺序位置。 */
  function ingestPack(pack) {
    if (!pack || !Array.isArray(pack.items)) return;
    if (seenPacks.indexOf(pack) >= 0) return;
    seenPacks.push(pack);
    pack.items.forEach(function (q) {
      if (!q || !q.id) { console.warn('[quiz] 忽略缺少 id 的题目'); return; }
      var idx = -1;
      for (var i = 0; i < items.length; i++) { if (items[i].id === q.id) { idx = i; break; } }
      if (idx >= 0) items[idx] = q; else items.push(q);
      byIdMap[q.id] = q;
    });
  }

  /* data/quiz.js 先于本文件加载（app.js 的 loadQuizPack 先加载数据再加载引擎），
     因此数据侧把同一份 pack 挂在 CSC._quizPack 上作为桥接；之后如果再注册也接住。 */
  if (CSC._quizPack) ingestPack(CSC._quizPack);
  var upstreamRegister = CSC.registerQuizPack;
  if (typeof upstreamRegister === 'function') {
    CSC.registerQuizPack = function (pack) {
      ingestPack(pack);
      return upstreamRegister.apply(CSC, arguments);
    };
  }
  if (CSC.bus && CSC.bus.on) CSC.bus.on('quiz:ready', ingestPack);

  /* ------------------------------------------------------------------ 文本工具 */
  function stripTags(s) { return String(s == null ? '' : s).replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim(); }

  /** 统一换行、去掉每行首尾空白与空行（用于比较程序的输出） */
  function normLines(s) {
    return String(s == null ? '' : s)
      .replace(/\r\n?/g, '\n')
      .replace(/\u00a0/g, ' ')
      .split('\n')
      .map(function (line) { return line.replace(/[ \t]+$/g, '').replace(/^[ \t]+/g, ''); })
      .filter(function (line) { return line.length > 0; })
      .join('\n');
  }
  /** 再把空白压成单空格（用于比较写成一行也算对的答案） */
  function normFlat(s) { return normLines(s).replace(/\s+/g, ' ').trim(); }
  function isNumeric(s) { return /^-?\d+(\.\d+)?$/.test(s); }

  /**
   * 找 bug 题（type:'fill' + mode:'findbug'）的答案归一化：
   * 去空白与中英文标点，保留 `< > = ; ( ) [ ]` 这些代码符号，方便"行号 + 改法"的关键词比对。
   */
  function normBug(s) {
    return String(s == null ? '' : s).toLowerCase()
      .replace(/[\s，。、；：！？""''“”‘’（）【】《》,.!?]/g, '');
  }

  /** 找 bug 题：accept 每项 = { hint, any:[…] }，返回每个关键点是否命中 */
  function findbugHits(q, resp) {
    var ans = normBug(resp);
    return (q.accept || []).map(function (item) {
      var alts = (item && item.any) ? item.any : [item];
      for (var i = 0; i < alts.length; i++) {
        var a = normBug(alts[i]);
        if (a && ans.indexOf(a) >= 0) return true;
      }
      return false;
    });
  }

  /** 单个答案写法（fill / predict）是否命中参考答案或 accept 列表 */
  function hitCandidate(raw, cand) {
    if (cand instanceof RegExp) { try { return cand.test(raw); } catch (e) { return false; } }
    var flat = normFlat(raw), cf = normFlat(cand);
    if (!flat) return false;
    if (cf === flat) return true;
    if (isNumeric(cf) && isNumeric(flat) && parseFloat(cf) === parseFloat(flat)) return true;
    return false;
  }

  /** fill 题的候选答案集合：answer（字符串或数组）+ accept */
  function fillCandidates(q) {
    var list = [];
    if (Array.isArray(q.answer)) list = list.concat(q.answer);
    else if (q.answer != null) list.push(q.answer);
    if (Array.isArray(q.accept)) list = list.concat(q.accept);
    return list;
  }

  /** 编程题的参考代码（用于「显示参考答案」与解析） */
  function codeSolution(q) {
    return q.solution || q.reference || (typeof q.answer === 'string' ? q.answer : '') || '';
  }

  /* ------------------------------------------------------------------ 判分 */
  function correctIndexOf(q) {
    var opts = q.options || [];
    for (var i = 0; i < opts.length; i++) { if (opts[i] && opts[i].correct) return i; }
    return -1;
  }
  function correctSetOf(q) {
    var set = [];
    (q.options || []).forEach(function (o, i) { if (o && o.correct) set.push(i); });
    return set;
  }

  /**
   * 判分。resp 的类型随题型而变：
   *   mcq/tf -> 选项下标数字；multi -> 下标数组；fill/predict -> 文本；order -> 下标数组
   * 返回 { ok, detail }。
   */
  function grade(q, resp) {
    var type = q.type || 'mcq';
    if (q.mode === 'findbug') {
      var hits = findbugHits(q, resp);
      var need = typeof q.minHits === 'number' ? q.minHits : hits.length;
      var gotHits = hits.filter(Boolean).length;
      return { ok: gotHits >= need && gotHits > 0, detail: { hits: hits, total: hits.length, got: gotHits, need: need } };
    }
    if (type === 'mcq' || type === 'tf') {
      var ci = correctIndexOf(q);
      return { ok: resp === ci, detail: '' };
    }
    if (type === 'multi') {
      var want = correctSetOf(q).slice().sort().join(',');
      var got = (Array.isArray(resp) ? resp.slice() : []).sort(function (a, b) { return a - b; }).join(',');
      return { ok: want === got && want !== '', detail: '' };
    }
    if (type === 'fill') {
      var hit = fillCandidates(q).some(function (c) { return hitCandidate(resp, c); });
      return { ok: hit, detail: '' };
    }
    if (type === 'predict') {
      var ns = normLines(resp), nf = normFlat(resp);
      if (!ns) return { ok: false, detail: '' };
      var pass = fillCandidates(q).some(function (c) {
        if (c instanceof RegExp) { try { return c.test(String(resp)); } catch (e) { return false; } }
        return normLines(c) === ns || normFlat(c) === nf;
      });
      return { ok: pass, detail: '' };
    }
    if (type === 'order') {
      var ans = (q.answer || []).join(',');
      return { ok: ans !== '' && (Array.isArray(resp) ? resp.join(',') : '') === ans, detail: '' };
    }
    return { ok: false, detail: '' };
  }

  /** 参考答案的展示文本 */
  function answerText(q) {
    var type = q.type || 'mcq';
    if (q.mode === 'findbug') return q.answer ? String(q.answer) : '见解析';
    if (type === 'mcq' || type === 'tf') {
      var i = correctIndexOf(q);
      return i >= 0 ? LETTERS[i] + '. ' + stripTags(q.options[i].text) : '（题目缺少 correct 选项）';
    }
    if (type === 'multi') {
      return correctSetOf(q).map(function (i) { return LETTERS[i]; }).join(', ');
    }
    if (type === 'fill' || type === 'predict') {
      var c = fillCandidates(q)[0];
      return (c && !(c instanceof RegExp)) ? String(c) : '见解析';
    }
    if (type === 'order') return (q.answer || []).map(function (i) { return LETTERS[i]; }).join(' → ');
    if (type === 'code') { var s = codeSolution(q); return s ? '见参考代码' : '见解析'; }
    return '见解析';
  }

  function answerHtml(q) {
    return fmtMd(esc(answerText(q))).replace(/\n/g, '<br>');
  }

  /** 用户作答的展示文本 */
  function respText(q, resp, picked) {
    var type = q.type || 'mcq';
    if (type === 'mcq' || type === 'tf') {
      var i = (typeof picked === 'number') ? picked : resp;
      if (typeof i === 'number' && q.options && q.options[i]) return LETTERS[i] + '. ' + stripTags(q.options[i].text);
      if (typeof i === 'number' && i >= 0) return LETTERS[i];
      return '（未作答）';
    }
    if (type === 'multi' || type === 'order') {
      var arr = Array.isArray(resp) ? resp : [];
      return arr.length ? arr.map(function (i) { return LETTERS[i]; }).join('') : '（未选择）';
    }
    var s = String(resp == null ? '' : resp);
    return s.trim() ? s : '（空）';
  }

  /* ------------------------------------------------------------------ 小组件 */
  function codeBox(code, caption) {
    var box = el('div', { class: 'codeBox' });
    box.appendChild(el('div', { class: 'codeBoxHead' }, [
      el('span', { class: 'codeDots', html: '<i></i><i></i><i></i>' }),
      el('span', { class: 'cbT', html: '<b>' + esc(caption || 'Java') + '</b>' })
    ]));
    var lines = CSC.codeLines ? CSC.codeLines(code) : esc(code).replace(/\n/g, '<br>');
    box.appendChild(el('pre', { html: lines }));
    return box;
  }

  function diffNode(q) {
    var d = el('span', { class: 'qdiff' });
    var n = Math.max(1, Math.min(3, q.difficulty || 1));
    for (var i = 1; i <= 3; i++) d.appendChild(el('i', { class: i <= n ? 'on' : '' }));
    return d;
  }

  function typeLabel(type, mode) {
    if (mode === 'findbug') return '找 bug';
    return ({ mcq: '单选题', multi: '多选题', tf: '判断题', fill: '填空题',
      predict: '预测输出', order: '排序题', code: '编程题', match: '匹配题' })[type] || '题目';
  }

  /* 四档练习梯度：徽标文字 + 一句建议（题卡上显示，筛选栏里作说明） */
  var TIER_META = {
    1: { name: '模仿', hint: '学完本节即可' },
    2: { name: '变式', hint: '换个情境再练' },
    3: { name: '独立', hint: '独立写出方法' },
    4: { name: '综合', hint: '跨章综合挑战' }
  };
  function tierOf(q) {
    var n = Number(q.tier);
    return (n >= 1 && n <= 4) ? n : 1;
  }
  function tierBadge(q) {
    var n = tierOf(q), m = TIER_META[n];
    var s = el('span', { class: 'pill ' + (n >= 3 ? 'warn' : 'info'), text: 'T' + n + ' ' + m.name });
    s.title = 'T' + n + ' · ' + m.name + '：' + m.hint;
    return s;
  }

  function cardHead(q) {
    var head = el('div', { class: 'qzHead' }, [
      el('span', { class: 'qt', text: typeLabel(q.type, q.mode) }),
      el('span', { class: 'qch', text: (q.ch || '') + (q.kp ? ' · ' + q.kp : '') }),
      tierBadge(q),
      el('span', { class: 'dim', text: TIER_META[tierOf(q)].hint })
    ]);
    var rec = CSC.records && CSC.records.quizRec ? CSC.records.quizRec(q.id) : null;
    if (rec && rec.n > 0) {
      var ok = rec.ok === rec.n;
      head.appendChild(el('span', {
        class: 'pill ' + (ok ? 'ok' : 'err'),
        text: ok ? '已掌握' : '错过 ' + (rec.n - rec.ok) + ' 次'
      }));
    }
    head.appendChild(diffNode(q));
    return head;
  }

  /* ------------------------------------------------------------------ 单题卡 */
  /**
   * 在 el 内挂载一道题的完整作答卡。
   * opts: { onAnswer(correct, q), compact? }
   * 返回 { root, reset() }
   */
  function mountCard(root, q, opts) {
    opts = opts || {};
    if (!root) return null;
    root.innerHTML = '';
    if (!q) {
      root.appendChild(el('div', { class: 'qzCard' }, [el('div', { class: 'qzBody' }, [
        el('div', { class: 'varEmpty', text: '未找到题目' })
      ])]));
      return null;
    }

    var card = el('div', { class: 'qzCard' });
    card.appendChild(cardHead(q));
    var body = el('div', { class: 'qzBody' });
    card.appendChild(body);
    root.appendChild(card);

    var state = { done: false, ok: false };
    var hintShown = false;
    var hintNode = null;

    body.appendChild(el('div', { class: 'qzStem', html: fmtMd(q.stem || '') }));
    if (q.code) body.appendChild(codeBox(q.code, q.codeTitle || 'Java'));
    if (q.stdin) body.appendChild(el('div', { class: 'qzCode', text: '$ stdin\n' + q.stdin }));

    var actions = el('div', { class: 'qzActions' });
    var streakNode = el('span', { class: 'qzStreak' });
    var hintBtn = null;
    if (q.hint) {
      hintBtn = el('button', { class: 'qzHintBtn', type: 'button', text: '💡 给点提示' });
      hintBtn.addEventListener('click', function () {
        if (!hintNode) {
          hintNode = el('div', { class: 'callout note' }, [
            el('div', { class: 'ct', html: icon('lightbulb') + '<span>提示</span>' }),
            el('div', { class: 'cb', html: fmtMd(q.hint) })
          ]);
          body.insertBefore(hintNode, actions);
        }
        hintBtn.disabled = true;
        hintBtn.textContent = '💡 提示已展开';
      });
      actions.appendChild(hintBtn);
    }
    actions.appendChild(streakNode);
    body.appendChild(actions);

    var answerArea = el('div');
    body.appendChild(answerArea);
    var fbHost = el('div');

    /* ---- 状态与反馈 ---- */
    function refreshStreak() {
      var s = session.streak;
      streakNode.textContent = s > 0 ? '🔥 连对 ' + s + ' 题' : '';
    }

    function finish(ok, resp, silent, detail) {
      state.done = true;
      state.ok = ok;
      fbHost.innerHTML = '';
      fbHost.appendChild(feedback(q, ok, resp, pickedRef, detail));
      body.appendChild(fbHost);
      if (!silent) {
        session.answers[q.id] = { ok: ok, resp: resp };
        if (ok) { session.streak += 1; if (session.streak > session.best) session.best = session.streak; }
        else session.streak = 0;
        if (CSC.records && CSC.records.recordQuiz) CSC.records.recordQuiz(q.id, ok);
        if (typeof opts.onAnswer === 'function') { try { opts.onAnswer(ok, q); } catch (e) { console.error(e); } }
      }
      refreshStreak();
    }

    var pickedRef = null;

    /* ---- 选项类题（mcq / tf / multi） ---- */
    function mountChoice(multi) {
      var optsList = el('div', { class: 'qzOpts' });
      var buttons = [];
      var picked = [];
      (q.options || []).forEach(function (opt, i) {
        var b = el('button', { class: 'qzOpt', type: 'button' }, [
          el('span', { class: 'qn', text: LETTERS[i] }),
          el('span', { class: 'qo', html: fmtMd(opt.text) })
        ]);
        b.addEventListener('click', function () {
          if (state.done) return;
          if (multi) {
            var pos = picked.indexOf(i);
            if (pos >= 0) { picked.splice(pos, 1); b.classList.remove('sel'); }
            else { picked.push(i); b.classList.add('sel'); }
            return;
          }
          pickedRef = i;
          lockChoice(buttons, i);
          var r = grade(q, i);
          markChoice(buttons, i, r.ok);
          finish(r.ok, i, false);
        });
        buttons.push(b);
        optsList.appendChild(b);
      });
      answerArea.appendChild(optsList);

      if (multi) {
        var row = el('div', { class: 'qzInputRow' });
        var submit = el('button', { class: 'qzBtn', type: 'button', text: '提交答案' });
        submit.addEventListener('click', function () {
          if (state.done) return;
          if (!picked.length) { CSC.toast('先选至少一个选项', 'warn'); return; }
          pickedRef = picked.slice();
          var r = grade(q, picked);
          markMulti(buttons, picked, r.ok);
          submit.disabled = true;
          finish(r.ok, picked.slice(), false);
        });
        row.appendChild(submit);
        answerArea.appendChild(row);
      }
    }

    function lockChoice(buttons, picked) {
      buttons.forEach(function (b, i) {
        b.disabled = true;
        if (i === picked) b.classList.add('sel');
      });
    }
    function markChoice(buttons, picked, ok) {
      (q.options || []).forEach(function (opt, i) {
        if (!buttons[i]) return;
        if (opt.correct) buttons[i].classList.add('ok');
        else if (i === picked && !ok) buttons[i].classList.add('bad');
      });
    }
    function markMulti(buttons, picked, ok) {
      (q.options || []).forEach(function (opt, i) {
        var b = buttons[i];
        if (!b) return;
        var chose = picked.indexOf(i) >= 0;
        if (opt.correct) b.classList.add('ok');
        else if (chose && !ok) b.classList.add('bad');
        else if (!chose) b.classList.remove('sel');
        b.disabled = true;
      });
    }

    /* ---- 输入类题（fill / predict） ---- */
    function mountInput(isPredict) {
      var row = el('div', { class: 'qzInputRow' });
      var input;
      if (isPredict) {
        input = el('textarea', {
          class: 'qzTextarea',
          placeholder: '按程序真实输出逐行写出（忽略行首尾空白与空行）',
          spellcheck: 'false'
        });
        answerArea.appendChild(input);
      } else {
        input = el('input', { class: 'qzInput', type: 'text', placeholder: '输入答案', spellcheck: 'false' });
        row.appendChild(input);
      }
      var submit = el('button', { class: 'qzBtn', type: 'button', text: '提交答案' });
      function doSubmit() {
        if (state.done) return;
        var val = input.value;
        if (!val || !String(val).trim()) { CSC.toast('先写下你的答案', 'warn'); input.focus(); return; }
        var r = grade(q, val);
        input.disabled = true;
        submit.disabled = true;
        finish(r.ok, val, false);
      }
      submit.addEventListener('click', doSubmit);
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !isPredict) { e.preventDefault(); doSubmit(); }
        else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); doSubmit(); }
      });
      row.appendChild(submit);
      answerArea.appendChild(row);
    }

    /* ---- 排序题 ---- */
    function mountOrder() {
      var list = el('div', { class: 'qzOpts' });
      var buttons = [];
      var picked = [];
      (q.options || []).forEach(function (opt, i) {
        var b = el('button', { class: 'qzOpt', type: 'button' }, [
          el('span', { class: 'qn', text: LETTERS[i] }),
          el('span', { class: 'qo', html: fmtMd(opt.text) })
        ]);
        b.addEventListener('click', function () {
          if (state.done) return;
          var pos = picked.indexOf(i);
          if (pos >= 0) { picked.splice(pos, 1); b.classList.remove('sel'); }
          else { picked.push(i); b.classList.add('sel'); }
          buttons.forEach(function (bb, k) {
            var n = picked.indexOf(k);
            bb.querySelector('.qn').textContent = n >= 0 ? String(n + 1) : LETTERS[k];
          });
        });
        buttons.push(b);
        list.appendChild(b);
      });
      answerArea.appendChild(list);
      var row = el('div', { class: 'qzInputRow' });
      var submit = el('button', { class: 'qzBtn', type: 'button', text: '提交顺序' });
      submit.addEventListener('click', function () {
        if (state.done) return;
        if (picked.length !== buttons.length) { CSC.toast('请给每一项都排好顺序', 'warn'); return; }
        var r = grade(q, picked);
        pickedRef = picked.slice();
        buttons.forEach(function (b) { b.disabled = true; });
        submit.disabled = true;
        finish(r.ok, picked.slice(), false);
      });
      row.appendChild(submit);
      answerArea.appendChild(row);
    }

    /* ---- 找 bug 题（type:'fill' + mode:'findbug'）：关键词命中给部分分 ---- */
    function mountFindBug() {
      var ta = el('textarea', {
        class: 'qzTextarea',
        spellcheck: 'false',
        placeholder: '写出行号 + 修改方法（例如：第 5 行，把 i <= a.length 改成 i < a.length）'
      });
      answerArea.appendChild(ta);
      var row = el('div', { class: 'qzInputRow' });
      var submit = el('button', { class: 'qzBtn', type: 'button', text: '提交答案' });
      submit.addEventListener('click', function () {
        if (state.done) return;
        var val = String(ta.value || '').trim();
        if (!val) { CSC.toast('先写下你的答案', 'warn'); ta.focus(); return; }
        var r = grade(q, val);
        ta.disabled = true;
        submit.disabled = true;
        finish(r.ok, val, false, r.detail);
      });
      row.appendChild(submit);
      answerArea.appendChild(row);
    }

    /* ---- 编程题（依赖 CSC.java，未就绪时降级） ---- */
    function mountCode() {
      var ta = el('textarea', { class: 'qzTextarea', spellcheck: 'false' });
      ta.value = q.starter || '';
      answerArea.appendChild(ta);
      var row = el('div', { class: 'qzInputRow' });
      var runBtn = el('button', { class: 'qzBtn', type: 'button', text: '运行并判分' });
      var refBtn = el('button', { class: 'qzBtn ghost', type: 'button', text: '显示参考答案' });
      row.appendChild(runBtn);
      row.appendChild(refBtn);
      answerArea.appendChild(row);
      var out = el('div', { class: 'qzFb' }, [el('div', { class: 'qzFbBody' }, [
        el('div', { class: 'varEmpty', text: '在这里写代码，然后点「运行并判分」。' })
      ])]);
      answerArea.appendChild(out);

      function showReference() {
        var sol = codeSolution(q);
        out.innerHTML = '';
        out.className = 'qzFb';
        var head = el('div', { class: 'qzFbHead', html: icon('book') + '<span>参考答案</span>' });
        var bd = el('div', { class: 'qzFbBody' });
        if (sol) bd.appendChild(codeBox(sol, '参考实现'));
        bd.appendChild(el('div', { html: fmtMd(q.explain || '') }));
        out.appendChild(head); out.appendChild(bd);
      }

      runBtn.addEventListener('click', function () {
        if (state.done) return;
        var src = ta.value;
        if (!src || !src.trim()) { CSC.toast('先写代码', 'warn'); return; }
        var java = CSC.java;
        if (!java || typeof java.run !== 'function') {
          /* 引擎按需加载：题库页默认不加载 engine.js，第一次判分时拉一次再自动重试 */
          if (typeof CSC.loadModules === 'function') {
            out.innerHTML = '';
            out.className = 'qzFb';
            out.appendChild(el('div', { class: 'qzFbBody' }, [
              el('div', { class: 'varEmpty', text: '第一次判分需要加载 Java 引擎，请稍候…' })
            ]));
            runBtn.disabled = true;
            CSC.loadModules(['engine']).then(function () {
              runBtn.disabled = false;
              if (CSC.java && typeof CSC.java.run === 'function') { runBtn.click(); return; }
              out.innerHTML = '';
              out.appendChild(el('div', { class: 'qzFbBody' }, [
                el('div', { class: 'varEmpty', text: 'Java 引擎加载失败，无法自动判分；可以先对照参考答案自我检查。' })
              ]));
              showReference();
            });
            return;
          }
          // 没有加载器：降级为只读参考答案，不报错
          out.innerHTML = '';
          out.appendChild(el('div', { class: 'qzFbBody' }, [
            el('div', { class: 'varEmpty', text: 'Java 引擎尚未加载，无法自动运行判分；可以先对照参考答案自我检查。' })
          ]));
          showReference();
          return;
        }
        var tests = Array.isArray(q.tests) && q.tests.length ? q.tests : [{ expect: q.expect || '' }];
        var rows = [];
        var allOk = true;
        tests.forEach(function (t, i) {
          var res;
          try { res = java.run(src, { args: t.args || [], stdin: t.stdin || '', maxSteps: 200000 }); }
          catch (e) { res = { ok: false, output: '', error: { message: e && e.message } }; }
          var actual = res && res.ok ? String(res.output || '') : '';
          var pass = res && res.ok && normLines(actual) === normLines(t.expect || '');
          if (!pass) allOk = false;
          rows.push({ i: i + 1, pass: pass, expected: t.expect || '', actual: actual, error: res && res.error });
        });
        out.innerHTML = '';
        out.className = 'qzFb ' + (allOk ? 'correct' : 'wrong');
        var head = el('div', {
          class: 'qzFbHead',
          html: (allOk ? icon('check') : icon('x')) + '<span>' + (allOk ? '全部测试通过' : '还有测试未通过') + '</span>'
        });
        var bd = el('div', { class: 'qzFbBody' });
        rows.forEach(function (r) {
          var box = el('div', { class: 'ansLine', html: '<b>测试 ' + r.i + '</b> ' + (r.pass ? '✅ 通过' : '❌ 未通过') });
          bd.appendChild(box);
          if (!r.pass) {
            if (r.error && r.error.message) bd.appendChild(el('div', { class: 'ansLine', text: '错误：' + r.error.message }));
            bd.appendChild(el('div', { class: 'ansLine', text: '期望输出：' + normLines(r.expected) }));
            bd.appendChild(el('div', { class: 'ansLine', text: '实际输出：' + normLines(r.actual) }));
          }
        });
        if (q.explain) bd.appendChild(el('div', { html: fmtMd(q.explain) }));
        out.appendChild(head); out.appendChild(bd);
        if (allOk) { ta.disabled = true; runBtn.disabled = true; finish(true, ta.value, false); }
      });
      refBtn.addEventListener('click', showReference);
      refBtn.hidden = !(q.solution || q.reference);
    }

    /* ---- 挂载 ---- */
    var type = q.type || 'mcq';
    if (q.mode === 'findbug') mountFindBug();
    else if (type === 'mcq' || type === 'tf') mountChoice(false);
    else if (type === 'multi') mountChoice(true);
    else if (type === 'fill') mountInput(false);
    else if (type === 'predict') mountInput(true);
    else if (type === 'order') mountOrder();
    else if (type === 'code') mountCode();
    else mountInput(false);

    /* ---- 本题已答过：恢复已答状态（不重复记账） ---- */
    var prev = session.answers[q.id];
    if (prev) {
      state.done = true;
      state.ok = prev.ok;
      pickedRef = prev.resp;
      if (type === 'mcq' || type === 'tf') {
        var bs = answerArea.querySelectorAll('.qzOpt');
        lockChoice(bs, prev.resp);
        markChoice(bs, prev.resp, prev.ok);
      } else if (type === 'multi' || type === 'order') {
        var bs2 = answerArea.querySelectorAll('.qzOpt');
        markMulti(bs2, prev.resp || [], prev.ok);
      } else if (type === 'code') {
        var cta = answerArea.querySelector('.qzTextarea');
        if (cta) cta.disabled = true;
        var cbtn = answerArea.querySelector('.qzInputRow .qzBtn');
        if (cbtn) cbtn.disabled = true;
      } else {
        var inp = answerArea.querySelector('.qzInput, .qzTextarea');
        if (inp) { inp.value = prev.resp == null ? '' : prev.resp; inp.disabled = true; }
        var sb = answerArea.querySelector('.qzInputRow .qzBtn');
        if (sb) sb.disabled = true;
      }
      body.appendChild(fbHost);
      fbHost.appendChild(feedback(q, prev.ok, prev.resp, prev.resp,
        (q.mode === 'findbug') ? grade(q, prev.resp).detail : null));
    }
    refreshStreak();

    /* ---- 重做按钮 ---- */
    var redoRow = el('div', { class: 'qzActions' });
    var redoBtn = el('button', { class: 'qzBtn ghost', type: 'button', text: '↻ 重做本题' });
    redoBtn.addEventListener('click', function () {
      delete session.answers[q.id];
      mountCard(root, q, opts);
    });
    redoRow.appendChild(redoBtn);
    body.appendChild(redoRow);

    return {
      root: card,
      reset: function () { delete session.answers[q.id]; mountCard(root, q, opts); }
    };
  }

  /* ------------------------------------------------------------------ 反馈卡 */
  function feedback(q, ok, resp, picked, detail) {
    var fb = el('div', { class: 'qzFb ' + (ok ? 'correct' : 'wrong') });
    fb.appendChild(el('div', {
      class: 'qzFbHead',
      html: (ok ? icon('check') : icon('x')) + '<span>' + (ok ? '答对了' : '答错了') + '</span>'
    }));
    var bd = el('div', { class: 'qzFbBody' });
    if (!ok) bd.appendChild(el('div', { class: 'ansLine', html: fmtMd(esc('你的答案：' + respText(q, resp, picked))) }));
    bd.appendChild(el('div', { class: 'ansLine', html: '正确答案：<b>' + answerHtml(q) + '</b>' }));
    if (q.mode === 'findbug' && detail && detail.hits) {
      bd.appendChild(el('div', { class: 'ansLine', html: '<b>关键点命中：' + detail.got + ' / ' + detail.total + (detail.need < detail.total ? '（需 ≥ ' + detail.need + '）' : '') + '</b>' }));
      (q.accept || []).forEach(function (item, i) {
        bd.appendChild(el('div', {
          class: 'ansLine',
          html: (detail.hits[i] ? '✅ ' : '❌ ') + fmtMd(esc((item && item.hint) || '关键点 ' + (i + 1)))
        }));
      });
      if (q.fix) bd.appendChild(codeBox(q.fix, '修改后（参考）'));
    }
    if (q.type === 'code') {
      var sol = codeSolution(q);
      if (sol) bd.appendChild(codeBox(sol, '参考实现'));
    }
    bd.appendChild(el('div', { html: fmtMd(q.explain || '（暂无解析）') }));
    fb.appendChild(bd);
    return fb;
  }

  /* ------------------------------------------------------------------ 题单 */
  var session = {
    answers: Object.create(null),   // qid -> {ok, resp}（本次页面会话内保留）
    streak: 0,
    best: 0
  };

  function chapterMetaOf(chId) {
    if (!CSC.chapterMeta) return null;
    for (var i = 0; i < CSC.chapterMeta.length; i++) if (CSC.chapterMeta[i].id === chId) return CSC.chapterMeta[i];
    return null;
  }

  function answeredCount(list) {
    var n = 0, ok = 0;
    list.forEach(function (q) {
      var a = session.answers[q.id];
      if (a) { n++; if (a.ok) ok++; }
    });
    return { n: n, ok: ok };
  }

  /**
   * 题单：筛选 + 逐题作答 + 进度统计。
   * opts: { chapter, tag, tier, special, limit }
   */
  function mountList(root, opts) {
    opts = opts || {};
    if (!root) return;

    /* app.js 只透传 chapter/tag/random/wrong；tier/special 由本模块从 hash 里自读，
       这样 URL 分享/刷新后梯度与专项筛选仍能恢复。 */
    function urlParam(name) {
      var h = String(location.hash || '');
      var i = h.indexOf('?');
      if (i < 0) return '';
      var parts = h.slice(i + 1).split('&');
      for (var k = 0; k < parts.length; k++) {
        var p = parts[k].split('=');
        if (p[0] === name) {
          try { return decodeURIComponent(p[1] == null ? '' : p[1]); } catch (e) { return p[1] || ''; }
        }
      }
      return '';
    }
    var tierParam = String(opts.tier || urlParam('tier') || '');
    if (!/^[1-4]$/.test(tierParam)) tierParam = '';
    var specialParam = String(opts.special || urlParam('special') || '');
    if (['read', 'write', 'bug', 'complexity'].indexOf(specialParam) < 0) specialParam = '';

    var state = {
      chapter: opts.chapter || '',
      tag: opts.tag || '',
      tier: tierParam,
      special: specialParam,
      wrongOnly: !!opts.wrongOnly,
      random: !!opts.random,
      limit: opts.limit || (opts.random ? Math.min(10, items.length) : 0)
    };

    /* 筛选状态写进 URL（#/quiz/ch05?tag=exam&tier=2&special=bug），刷新/分享后保持。
       用 replaceState 而不是改 hash：不触发 hashchange，避免重新渲染打断答题。 */
    function syncUrl() {
      var q = [];
      if (state.tag) q.push('tag=' + encodeURIComponent(state.tag));
      if (state.tier) q.push('tier=' + state.tier);
      if (state.special) q.push('special=' + state.special);
      if (state.random) q.push('random=1');
      if (state.wrongOnly) q.push('wrong=1');
      var h = '#/quiz' + (state.chapter ? '/' + state.chapter : '') + (q.length ? '?' + q.join('&') : '');
      if (location.hash === h) return;
      try {
        window.history.replaceState(null, '', h);
      } catch (e) {
        location.hash = h;
      }
    }

    root.innerHTML = '';
    var head = el('div', { class: 'quizPageHead' });
    var chipBar = el('div', { class: 'filterBar' });
    var tierBar = el('div', { class: 'filterBar' });
    var specialBar = el('div', { class: 'filterBar' });
    var tagBar = el('div', { class: 'filterBar' });
    var progressRow = el('div', { class: 'qzProgress' });
    var toolRow = el('div', { class: 'qzActions' });
    var listHost = el('div');
    var doneHost = el('div');

    root.appendChild(head);
    root.appendChild(chipBar);
    root.appendChild(tierBar);
    root.appendChild(specialBar);
    root.appendChild(tagBar);
    root.appendChild(progressRow);
    root.appendChild(toolRow);
    root.appendChild(listHost);
    root.appendChild(doneHost);

    /* 计数：章节 / 标签 / 梯度 / 能力专项 */
    var chCount = {};
    var tagCount = {};
    var tierCount = { 1: 0, 2: 0, 3: 0, 4: 0 };
    var specialCount = { read: 0, write: 0, bug: 0, complexity: 0 };
    var SPECIAL_META = {
      read: { label: '读代码', match: function (q) { return q.type === 'predict'; } },
      write: { label: '写代码', match: function (q) { return q.type === 'code'; } },
      bug: { label: '找 bug', match: function (q) { return q.mode === 'findbug'; } },
      complexity: { label: '复杂度分析', match: function (q) { return (q.tags || []).indexOf('bigo') >= 0; } }
    };
    items.forEach(function (q) {
      if (q.ch) chCount[q.ch] = (chCount[q.ch] || 0) + 1;
      (q.tags || []).forEach(function (t) { tagCount[t] = (tagCount[t] || 0) + 1; });
      tierCount[tierOf(q)] = (tierCount[tierOf(q)] || 0) + 1;
      Object.keys(SPECIAL_META).forEach(function (k) {
        if (SPECIAL_META[k].match(q)) specialCount[k] = (specialCount[k] || 0) + 1;
      });
    });

    var TAG_LABEL = { exam: '考试高频', trap: '易错题', output: '读程序', syntax: '编译/语法', concept: '概念辨析', bug: '找 bug', code: '编程题' };

    function buildChips() {
      chipBar.innerHTML = '';
      var all = el('button', {
        class: 'filterChip' + (state.chapter === '' ? ' on' : ''), type: 'button',
        html: '全部<span class="n">' + items.length + '</span>'
      });
      all.addEventListener('click', function () { state.chapter = ''; buildChips(); syncUrl(); render(); });
      chipBar.appendChild(all);
      (CSC.chapterMeta || []).forEach(function (m) {
        var n = chCount[m.id] || 0;
        if (!n) return;
        var b = el('button', {
          class: 'filterChip' + (state.chapter === m.id ? ' on' : ''), type: 'button',
          html: m.num + ' ' + esc(shortTitle(m)) + '<span class="n">' + n + '</span>'
        });
        b.addEventListener('click', function () { state.chapter = m.id; state.random = false; state.limit = 0; buildChips(); syncUrl(); render(); });
        chipBar.appendChild(b);
      });
    }

    function shortTitle(m) {
      var t = m.title || m.id;
      // 去掉「序章：」这类前缀，chip 只留核心名词
      var parts = t.split(/[：:]/);
      return parts.length > 1 ? parts[1] : t;
    }

    function buildTags() {
      tagBar.innerHTML = '';
      var keys = Object.keys(TAG_LABEL).filter(function (k) { return tagCount[k]; });
      if (keys.length < 1) return;
      var none = el('button', {
        class: 'filterChip' + (state.tag === '' ? ' on' : ''), type: 'button', text: '不限类型'
      });
      none.addEventListener('click', function () { state.tag = ''; buildTags(); syncUrl(); render(); });
      tagBar.appendChild(none);
      keys.forEach(function (k) {
        var b = el('button', {
          class: 'filterChip' + (state.tag === k ? ' on' : ''), type: 'button',
          html: TAG_LABEL[k] + '<span class="n">' + tagCount[k] + '</span>'
        });
        b.addEventListener('click', function () { state.tag = (state.tag === k ? '' : k); buildTags(); syncUrl(); render(); });
        tagBar.appendChild(b);
      });
    }

    /* 梯度筛选：T1 模仿 → T2 变式 → T3 独立实现 → T4 综合 */
    function buildTierBar() {
      tierBar.innerHTML = '';
      tierBar.appendChild(el('span', { class: 'dim', text: '梯度' }));
      var all = el('button', {
        class: 'filterChip' + (state.tier === '' ? ' on' : ''), type: 'button',
        html: '全部梯度<span class="n">' + items.length + '</span>'
      });
      all.addEventListener('click', function () { state.tier = ''; buildTierBar(); syncUrl(); render(); });
      tierBar.appendChild(all);
      [1, 2, 3, 4].forEach(function (n) {
        var b = el('button', {
          class: 'filterChip' + (state.tier === String(n) ? ' on' : ''), type: 'button',
          html: 'T' + n + ' ' + TIER_META[n].name + '<span class="n">' + (tierCount[n] || 0) + '</span>'
        });
        b.title = 'T' + n + ' · ' + TIER_META[n].name + '：' + TIER_META[n].hint;
        b.addEventListener('click', function () {
          state.tier = String(n);
          state.random = false;
          state.limit = 0;
          buildTierBar();
          syncUrl();
          render();
        });
        tierBar.appendChild(b);
      });
    }

    /* 专项训练：按能力类型（读代码 / 写代码 / 找 bug / 复杂度分析） */
    function buildSpecials() {
      specialBar.innerHTML = '';
      specialBar.appendChild(el('span', { class: 'dim', text: '专项训练' }));
      var none = el('button', {
        class: 'filterChip' + (state.special === '' ? ' on' : ''), type: 'button', text: '不限'
      });
      none.addEventListener('click', function () { state.special = ''; buildSpecials(); syncUrl(); render(); });
      specialBar.appendChild(none);
      Object.keys(SPECIAL_META).forEach(function (k) {
        var b = el('button', {
          class: 'filterChip' + (state.special === k ? ' on' : ''), type: 'button',
          html: SPECIAL_META[k].label + '<span class="n">' + (specialCount[k] || 0) + '</span>'
        });
        b.addEventListener('click', function () {
          state.special = (state.special === k ? '' : k);
          state.random = false;
          state.limit = 0;
          buildSpecials();
          syncUrl();
          render();
        });
        specialBar.appendChild(b);
      });
    }

    function filtered() {
      var list = items.filter(function (q) {
        if (state.chapter && q.ch !== state.chapter) return false;
        if (state.tag && (q.tags || []).indexOf(state.tag) < 0) return false;
        if (state.tier && String(tierOf(q)) !== state.tier) return false;
        if (state.special && !SPECIAL_META[state.special].match(q)) return false;
        if (state.wrongOnly) {
          var rec = CSC.records && CSC.records.quizRec ? CSC.records.quizRec(q.id) : null;
          if (!rec) return false;
          if (rec.ok === rec.n) return false;   // 从没错过的不进错题本
        }
        return true;
      });
      if (state.random) {
        list = list.slice();
        for (var i = list.length - 1; i > 0; i--) {
          var j = Math.floor(Math.random() * (i + 1));
          var t = list[i]; list[i] = list[j]; list[j] = t;
        }
      }
      if (state.limit) list = list.slice(0, state.limit);
      return list;
    }

    function renderProgress(list) {
      var st = answeredCount(list);
      progressRow.innerHTML = '';
      var pct = list.length ? Math.round(st.n / list.length * 100) : 0;
      progressRow.appendChild(el('span', { text: '本次已答 ' + st.n + ' / ' + list.length + ' 题' }));
      var bar = el('div', { class: 'qzProgBar' }, [el('i')]);
      bar.firstChild.style.width = pct + '%';
      progressRow.appendChild(bar);
      progressRow.appendChild(el('span', {
        class: 'qzStreak',
        text: st.n ? '正确率 ' + Math.round(st.ok / st.n * 100) + '%' : '开始答题吧'
      }));
    }

    function renderTools(list) {
      toolRow.innerHTML = '';
      var rand = el('button', { class: 'qzBtn', type: 'button', text: state.random ? '↺ 恢复顺序' : '🎲 随机抽 ' + Math.min(10, items.length) + ' 题' });
      rand.addEventListener('click', function () {
        if (state.random) { state.random = false; state.limit = 0; }
        else { state.random = true; state.limit = 10; }
        syncUrl();
        render();
      });
      toolRow.appendChild(rand);

      var wrong = el('button', {
        class: 'qzBtn ghost' + (state.wrongOnly ? ' on' : ''), type: 'button',
        text: state.wrongOnly ? '✕ 退出错题本' : '📕 错题本'
      });
      wrong.addEventListener('click', function () {
        state.wrongOnly = !state.wrongOnly;
        state.random = false;
        if (state.wrongOnly) state.limit = 0;
        syncUrl();
        render();
      });
      toolRow.appendChild(wrong);

      var reset = el('button', { class: 'qzBtn ghost', type: 'button', text: '清空本次作答记录' });
      reset.addEventListener('click', function () {
        session.answers = Object.create(null);
        session.streak = 0;
        CSC.toast('已清空本次作答（历史正确率仍保留）', 'ok');
        render();
      });
      toolRow.appendChild(reset);
      toolRow.appendChild(el('span', { class: 'qzStreak', text: '连对 ' + session.streak + ' · 最佳 ' + session.best }));
    }

    /** 渲染一组题卡；返回该组容器 */
    function renderGroup(titleHtml, list) {
      var wrap = el('div');
      var headNode = el('h3', { class: 'blockH' });
      headNode.innerHTML = titleHtml;
      wrap.appendChild(headNode);
      list.forEach(function (q) {
        var host = el('div', { class: 'qzHost', dataset: { qid: q.id } });
        wrap.appendChild(host);
        mountCard(host, q, {
          onAnswer: function () {
            renderProgress(filtered());
            renderTools(filtered());
            var l2 = filtered();
            if (l2.length && answeredCount(l2).n === l2.length) renderDone(l2);
          }
        });
      });
      return wrap;
    }

    function renderDone(list) {
      var st = answeredCount(list);
      doneHost.innerHTML = '';
      if (!list.length || st.n < list.length) return;
      var pct = Math.round(st.ok / list.length * 100);
      doneHost.appendChild(el('div', { class: 'qzCard' }, [
        el('div', { class: 'qzDone' }, [
          el('div', { class: 'big', text: pct + '%' }),
          el('div', { class: 'dim', text: '这组题已全部作答：' + st.ok + ' / ' + list.length + ' 正确' }),
          el('div', { class: 'qzActions', html: '<button class="qzBtn" type="button" id="qzAgain">再来一轮</button>' })
        ])
      ]));
      var btn = doneHost.querySelector('#qzAgain');
      if (btn) btn.addEventListener('click', function () {
        session.answers = Object.create(null);
        render();
      });
    }

    function render() {
      var list = filtered();
      listHost.innerHTML = '';
      doneHost.innerHTML = '';
      renderProgress(list);
      renderTools(list);

      if (!list.length) {
        listHost.appendChild(el('div', { class: 'qzCard' }, [el('div', { class: 'qzBody' }, [
          el('div', { class: 'varEmpty', text: state.wrongOnly ? '错题本是空的：先答几题再来。' : '这一筛选条件下没有题目。' })
        ])]));
        return;
      }

      if (!state.chapter && !state.wrongOnly && !state.random) {
        // 全部分组显示，每组可折叠；默认展开第一章有题的组
        var byCh = {};
        list.forEach(function (q) { (byCh[q.ch] = byCh[q.ch] || []).push(q); });
        var opened = false;
        Object.keys(byCh).forEach(function (ch) {
          var meta = chapterMetaOf(ch);
          var title = meta ? (meta.num + ' ' + meta.title) : ch;
          var details = el('details', { class: 'qzGroup' });
          if (!opened) { details.open = true; opened = true; }
          var sum = el('summary');
          var st = answeredCount(byCh[ch]);
          sum.appendChild(el('div', { class: 'qzProgress' }, [
            el('span', { html: '<b>' + esc(title) + '</b>' }),
            el('span', { class: 'dim', text: '· 共 ' + byCh[ch].length + ' 题' }),
            el('span', { class: 'qzStreak', text: st.n ? '已答 ' + st.n + ' · 正确 ' + st.ok : '' })
          ]));
          details.appendChild(sum);
          byCh[ch].forEach(function (q) {
            var host = el('div', { class: 'qzHost', dataset: { qid: q.id } });
            details.appendChild(host);
            /* 作答后只刷新统计，不重绘整个列表（否则会丢失滚动位置和折叠状态） */
            mountCard(host, q, {
              onAnswer: function () {
                var l2 = filtered();
                renderProgress(l2);
                renderTools(l2);
                renderDone(l2);
              }
            });
          });
          listHost.appendChild(details);
        });
      } else {
        var meta2 = state.chapter ? chapterMetaOf(state.chapter) : null;
        var titleText = state.wrongOnly ? '📕 错题本' : (meta2 ? (meta2.num + ' ' + meta2.title) : '题目列表');
        listHost.appendChild(renderGroup(esc(titleText) + ' <span class="dim">· 共 ' + list.length + ' 题</span>', list));
      }
      renderDone(list);
    }

    buildChips();
    buildTierBar();
    buildSpecials();
    buildTags();
    render();
  }

  /* ------------------------------------------------------------------ 统计 */
  function stats() {
    var byCh = {}, byType = {}, byTier = {}, total = items.length;
    items.forEach(function (q) {
      byCh[q.ch || '?'] = (byCh[q.ch || '?'] || 0) + 1;
      var t = (q.mode === 'findbug') ? 'findbug' : (q.type || 'mcq');
      byType[t] = (byType[t] || 0) + 1;
      byTier[tierOf(q)] = (byTier[tierOf(q)] || 0) + 1;
    });
    var missing = [];
    (CSC.chapterMeta || []).forEach(function (m) {
      for (var i = 1; i <= 4; i++) {
        if (!byIdMap[m.id + '-q' + i]) missing.push(m.id + '-q' + i);
      }
    });
    return { total: total, byCh: byCh, byType: byType, byTier: byTier, missingFixedIds: missing };
  }

  /* ------------------------------------------------------------------ 导出 */
  CSC.quiz = {
    all: function () { return items.slice(); },
    byId: function (id) { return byIdMap[id] || null; },
    mountCard: mountCard,
    mountList: mountList,
    stats: stats,
    _ingest: ingestPack
  };
  if (CSC.bus && CSC.bus.emit) CSC.bus.emit('quiz:ready');
})();
