/* =====================================================================
 * assets/exam.js · 模拟卷引擎
 * 职责：试卷列表（mountList）与在线作答（mount）——封面 → 作答（答题卡、
 *       倒计时、自动保存）→ 交卷确认 → 成绩（总分、逐题对错、解析展开）
 * 判分：choice/tf 精确匹配；fill 归一化文本；output 按行给部分分；
 *       keywords 按关键词命中比例给分（简答/找 bug/写代码题）
 * 对外：CSC.exam = { mountList, mount }
 * 数据：data/exam.js 调用 CSC.registerExam({ id, questions:[…] })
 * ===================================================================== */
(function () {
  'use strict';

  var CSC = window.CSC;
  if (!CSC) return;
  var el = CSC.el;
  var esc = CSC.escapeHtml;
  var icon = CSC.icon;
  var LETTERS = 'ABCDEFGH'.split('');
  var LS_ATTEMPT = 'exam.attempt.';
  var LS_RESULT = 'exam.result.';
  var LS_HISTORY = 'exam.history';

  /* ------------------------------------------------------------------ 注册表 */
  var exams = [];
  var examById = Object.create(null);

  function ingestExam(e) {
    if (!e || !e.id || !Array.isArray(e.questions)) { console.warn('[exam] 无效的试卷数据'); return; }
    if (examById[e.id]) {
      for (var i = 0; i < exams.length; i++) if (exams[i].id === e.id) { exams[i] = e; break; }
    } else {
      exams.push(e);
    }
    examById[e.id] = e;
  }

  /* 与 quiz 相同的数据桥接：app.js 先加载 data/exam.js，再加载本引擎 */
  if (Array.isArray(CSC._exams)) CSC._exams.forEach(ingestExam);
  var upstreamRegister = CSC.registerExam;
  if (typeof upstreamRegister === 'function') {
    CSC.registerExam = function (e) {
      ingestExam(e);
      return upstreamRegister.apply(CSC, arguments);
    };
  }
  if (CSC.bus && CSC.bus.on) CSC.bus.on('exam:ready', ingestExam);

  /* ------------------------------------------------------------------ 文本工具 */
  function normLines(s) {
    return String(s == null ? '' : s)
      .replace(/\r\n?/g, '\n')
      .replace(/\u00a0/g, ' ')
      .split('\n')
      .map(function (line) { return line.replace(/[ \t]+$/g, '').replace(/^[ \t]+/g, ''); })
      .filter(function (line) { return line.length > 0; })
      .join('\n');
  }
  function normFlat(s) { return normLines(s).replace(/\s+/g, ' ').trim(); }
  function squeeze(s) { return String(s == null ? '' : s).replace(/\s+/g, '').toLowerCase(); }
  function stripTags(s) { return String(s == null ? '' : s).replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim(); }

  function fmtClock(ms) {
    var sec = Math.max(0, Math.floor(ms / 1000));
    var m = Math.floor(sec / 60), s = sec % 60;
    return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
  }
  function fmtDate(ts) {
    var d = new Date(ts);
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0') +
      ' ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
  }

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

  /* ------------------------------------------------------------------ 判分 */
  function candidates(part) {
    var list = [];
    if (Array.isArray(part.answer)) list = list.concat(part.answer);
    else if (part.answer != null) list.push(part.answer);
    if (Array.isArray(part.accept)) list = list.concat(part.accept);
    return list;
  }

  /** fill 题：归一化比较 + 去空白比较（宽容空格写法） */
  function gradeFill(part, raw) {
    var flat = normFlat(raw), sq = squeeze(raw);
    if (!flat) return 0;
    var hit = candidates(part).some(function (c) {
      if (c instanceof RegExp) { try { return c.test(String(raw)); } catch (e) { return false; } }
      var cf = normFlat(c), cs = squeeze(c);
      if (cf === flat || cs === sq) return true;
      if (/^-?\d+(\.\d+)?$/.test(cf) && /^-?\d+(\.\d+)?$/.test(flat) && parseFloat(cf) === parseFloat(flat)) return true;
      return false;
    });
    return hit ? part.points : 0;
  }

  /** output 题：全对给满分；accept 里的等价写法也算全对；否则按命中的输出行给部分分 */
  function gradeOutput(part, raw) {
    var got = normLines(raw);
    if (!got) return 0;
    var exp = normLines(part.answer);
    if (normFlat(exp) === normFlat(got) || squeeze(exp) === squeeze(got)) return part.points;
    var gf = normFlat(got), gs = squeeze(got);
    var acceptHit = (part.accept || []).some(function (c) {
      if (c instanceof RegExp) { try { return c.test(String(raw)); } catch (e) { return false; } }
      var cf = normFlat(c), cs = squeeze(c);
      if (cf && (cf === gf || cs === gs)) return true;
      if (/^-?\d+(\.\d+)?$/.test(cf) && /^-?\d+(\.\d+)?$/.test(gf) && parseFloat(cf) === parseFloat(gf)) return true;
      return false;
    });
    if (acceptHit) return part.points;
    var expLines = exp.split('\n').filter(Boolean);
    if (!expLines.length) return 0;
    var hit = expLines.filter(function (line) {
      var lf = normFlat(line), ls = squeeze(line);
      return gf.indexOf(lf) >= 0 || gs.indexOf(ls) >= 0;
    }).length;
    return Math.round(part.points * hit / expLines.length * 10) / 10;
  }

  /** keywords 题：按命中关键词比例给分（简答/找 bug/写代码）
   *  关键词可以是字符串、正则，或字符串数组（表示同一意思的若干写法，命中任一即可） */
  function gradeKeywords(part, raw) {
    var sq = squeeze(raw);
    if (!sq) return 0;
    var kws = (part.keywords || []).filter(Boolean);
    if (!kws.length) return 0;
    var hit = kws.filter(function (k) {
      if (Array.isArray(k)) {
        return k.some(function (alt) { return sq.indexOf(squeeze(alt)) >= 0; });
      }
      if (k instanceof RegExp) { try { return k.test(String(raw)); } catch (e) { return false; } }
      return sq.indexOf(squeeze(k)) >= 0;
    }).length;
    return Math.round(part.points * hit / kws.length * 10) / 10;
  }

  /** 单选题 / 判断题：选中项必须正确 */
  function gradeChoice(part, raw) {
    var idx = typeof raw === 'number' ? raw : (raw == null || raw === '' ? -1 : parseInt(raw, 10));
    if (!(idx >= 0)) return 0;
    var opt = (part.options || [])[idx];
    return opt && opt.correct ? part.points : 0;
  }

  function gradePart(part, raw) {
    var kind = part.kind || 'fill';
    if (kind === 'choice') return gradeChoice(part, raw);
    if (kind === 'tf') return gradeChoice(part, raw);
    if (kind === 'output') return gradeOutput(part, raw);
    if (kind === 'keywords') return gradeKeywords(part, raw);
    return gradeFill(part, raw);
  }

  function gradeExam(exam, answers) {
    var total = 0;
    var detail = exam.questions.map(function (q) {
      var qScore = 0;
      var parts = (q.parts || []).map(function (part, pi) {
        var key = q.no + '-' + pi;
        var score = gradePart(part, answers[key]);
        qScore += score;
        return { key: key, score: score, max: part.points, resp: answers[key] };
      });
      total += qScore;
      return { no: q.no, score: Math.round(qScore * 10) / 10, max: q.points, parts: parts };
    });
    return { total: Math.round(total * 10) / 10, detail: detail };
  }

  /* ------------------------------------------------------------------ 存储 */
  function loadAttempt(id) { return CSC.store.get(LS_ATTEMPT + id, null); }
  function saveAttempt(id, att) { CSC.store.set(LS_ATTEMPT + id, att); }
  function clearAttempt(id) { CSC.store.del(LS_ATTEMPT + id); }
  function loadResult(id) { return CSC.store.get(LS_RESULT + id, null); }
  function saveResult(id, rec) { CSC.store.set(LS_RESULT + id, rec); }
  function pushHistory(id, item) {
    var hist = CSC.store.get(LS_HISTORY, {});
    if (!hist[id]) hist[id] = [];
    hist[id].unshift(item);
    hist[id] = hist[id].slice(0, 8);
    CSC.store.set(LS_HISTORY, hist);
  }
  function lastHistory(id) {
    var hist = CSC.store.get(LS_HISTORY, {});
    return (hist[id] && hist[id][0]) || null;
  }

  /* ------------------------------------------------------------------ 计时器 */
  var live = { timerId: null, examId: null, attempt: null };

  function stopTimer() {
    if (live.timerId) { clearInterval(live.timerId); live.timerId = null; }
  }
  function cleanup() {
    stopTimer();
    if (live.examId && live.attempt && !live.attempt.submitted) saveAttempt(live.examId, live.attempt);
    live.examId = null;
    live.attempt = null;
  }
  /* 离开当前试卷（切到别的视图或试卷列表）时停表并保存，回来可以续答 */
  window.addEventListener('hashchange', function () {
    if (!live.examId) return;
    if (location.hash.indexOf('#/exam/' + live.examId) !== 0) cleanup();
  });
  /* 关闭/刷新页面前保存一次，避免最后几秒的输入丢失（计时按绝对时间，回来可续答） */
  window.addEventListener('beforeunload', function () {
    if (live.examId && live.attempt && !live.attempt.submitted) saveAttempt(live.examId, live.attempt);
  });

  /* ------------------------------------------------------------------ 试卷列表 */
  function mountList(host) {
    if (!host) return;
    cleanup();
    host.innerHTML = '';
    if (!exams.length) {
      host.appendChild(el('div', { class: 'varEmpty', text: '试卷载入失败：data/exam.js 未注册任何试卷。' }));
      return;
    }
    var intro = el('div', { class: 'callout note' }, [
      el('div', { class: 'ct', html: icon('target') + '<span>怎么用这两套卷子</span>' }),
      el('div', { class: 'cb', html: '<p>建议先按章节刷完题库，再用模拟卷做一次完整的限时训练：点开卷子 → 开始计时 → 按真实考试节奏作答 → 交卷看逐题解析。成绩保存在本地浏览器，可以反复重做。</p>' })
    ]);
    host.appendChild(intro);
    exams.forEach(function (exam) {
      var last = loadResult(exam.id);
      var hist = lastHistory(exam.id);
      var card = el('div', { class: 'exCover' });
      card.appendChild(el('h2', { html: esc(exam.title || exam.id) + ' <span class="pill">' + esc(exam.style || '') + '</span>' }));
      card.appendChild(el('div', { class: 'sub', text: (exam.subtitle || '') + ' · ' + (exam.date || '') }));
      var info = el('div', { class: 'exInfo' });
      info.appendChild(infoItem('Questions', String((exam.questions || []).length)));
      info.appendChild(infoItem('Total', String(exam.totalScore || 100) + ' pts'));
      info.appendChild(infoItem('Time', String(exam.minutes || 0) + ' min'));
      info.appendChild(infoItem('Last score', last ? String(last.score) + ' / ' + String(last.total) : '—'));
      card.appendChild(info);
      var introP = el('div', { class: 'blockP' });
      introP.innerHTML = exam.summary || '';
      card.appendChild(introP);
      var actions = el('div', { class: 'qzActions' });
      var go = el('button', { class: 'qzBtn', type: 'button', text: '进入试卷' });
      go.addEventListener('click', function () { CSC.go('#/exam/' + exam.id); });
      actions.appendChild(go);
      if (hist) actions.appendChild(el('span', { class: 'qzStreak', text: '上次：' + fmtDate(hist.date) + ' · ' + hist.score + ' 分' }));
      card.appendChild(actions);
      host.appendChild(card);
    });
  }

  function infoItem(label, val) {
    var n = el('div', { class: 'exInfoItem' });
    n.appendChild(el('span', { text: label }));
    n.appendChild(el('b', { text: val }));
    return n;
  }

  /* ------------------------------------------------------------------ 主入口 */
  function mount(root, examId) {
    if (!root) return;
    cleanup();
    root.innerHTML = '';
    var exam = examById[examId];
    /* 动态内容（题目/解析）插入后自动触发公式排版：MathJax 未就绪时 CSC_MATH 会排队 */
    if (window.MutationObserver && window.CSC_MATH) {
      var mo = new MutationObserver(function () { window.CSC_MATH.schedule(root); });
      mo.observe(root, { childList: true, subtree: true });
    }

    if (!exam) {
      root.appendChild(el('div', { class: 'varEmpty', text: '未找到试卷：' + examId }));
      return;
    }
    var att = loadAttempt(exam.id);
    var result = loadResult(exam.id);
    if (att && att.submitted && att.record) { renderResult(root, exam, att.record); return; }
    if (result) { renderResult(root, exam, result); return; }
    if (att && !att.submitted) {
      if (Date.now() >= att.deadline) { finalize(root, exam, att, true); return; }
      renderResume(root, exam, att);
      return;
    }
    renderCover(root, exam);
  }

  /* ------------------------------------------------------------------ 封面 */
  function renderCover(root, exam) {
    var cover = el('div', { class: 'exCover' });
    cover.appendChild(el('h2', { html: esc(exam.title) + ' <span class="pill">' + esc(exam.style || '') + '</span>' }));
    cover.appendChild(el('div', { class: 'sub', text: exam.subtitle || '' }));
    cover.appendChild(el('div', { class: 'sub', text: exam.date || '' }));
    var info = el('div', { class: 'exInfo' });
    info.appendChild(infoItem('Questions', String(exam.questions.length)));
    info.appendChild(infoItem('Total', String(exam.totalScore) + ' pts'));
    info.appendChild(infoItem('Time', String(exam.minutes) + ' min'));
    info.appendChild(infoItem('Pass', '60 / 100'));
    cover.appendChild(info);
    if (exam.instructions && exam.instructions.length) {
      var ul = el('ol');
      exam.instructions.forEach(function (t) { ul.appendChild(el('li', { html: t })); });
      var note = el('div', { class: 'callout note' }, [
        el('div', { class: 'ct', html: icon('book') + '<span>Instructions</span>' }),
        el('div', { class: 'cb' })
      ]);
      note.querySelector('.cb').appendChild(ul);
      cover.appendChild(note);
    }
    cover.appendChild(el('div', { class: 'callout warn' }, [
      el('div', { class: 'ct', html: icon('warning') + '<span>开始前请注意</span>' }),
      el('div', { class: 'cb', html: '<p>点击「开始作答」后计时立刻开始，<b>关闭页面或刷新不会停止计时</b>（倒计时按真实时间计算）。作答过程会自动保存；如果在时限内回来，可以接着写；超时会自动交卷。</p>' })
    ]));
    var actions = el('div', { class: 'qzActions' });
    var start = el('button', { class: 'qzBtn', type: 'button', text: '开始作答' });
    start.addEventListener('click', function () {
      var now = Date.now();
      var att = {
        examId: exam.id,
        startedAt: now,
        deadline: now + (exam.minutes || 60) * 60000,
        answers: {},
        submitted: false
      };
      saveAttempt(exam.id, att);
      renderAttempt(root, exam, att);
    });
    actions.appendChild(start);
    var back = el('a', { class: 'qzBtn ghost', href: '#/exam', text: '返回试卷列表' });
    actions.appendChild(back);
    cover.appendChild(actions);
    root.appendChild(cover);
  }

  /* ------------------------------------------------------------------ 续答 */
  function renderResume(root, exam, att) {
    var remain = att.deadline - Date.now();
    var cover = el('div', { class: 'exCover' });
    cover.appendChild(el('h2', { text: '继续未完成的作答' }));
    cover.appendChild(el('div', { class: 'sub', text: exam.title + ' · 还剩 ' + fmtClock(remain) }));
    var info = el('div', { class: 'exInfo' });
    info.appendChild(infoItem('Answered', countAnswered(exam, att) + ' / ' + exam.questions.length));
    info.appendChild(infoItem('Remaining', fmtClock(remain)));
    cover.appendChild(info);
    cover.appendChild(el('div', { class: 'callout note' }, [
      el('div', { class: 'ct', html: icon('clock') + '<span>恢复作答</span>' }),
      el('div', { class: 'cb', html: '<p>检测到上次没有交卷的作答记录。选择「继续作答」会带着已填的答案和剩余时间继续；选择「重新开始」会清空旧记录并重置计时。</p>' })
    ]));
    var actions = el('div', { class: 'qzActions' });
    var cont = el('button', { class: 'qzBtn', type: 'button', text: '继续作答' });
    cont.addEventListener('click', function () { renderAttempt(root, exam, att); });
    actions.appendChild(cont);
    var restart = el('button', { class: 'qzBtn ghost', type: 'button', text: '重新开始' });
    restart.addEventListener('click', function () {
      clearAttempt(exam.id);
      renderCover(root, exam);
    });
    actions.appendChild(restart);
    cover.appendChild(actions);
    root.appendChild(cover);
  }

  function countAnswered(exam, att) {
    var n = 0;
    exam.questions.forEach(function (q) {
      (q.parts || []).forEach(function (part, pi) {
        var v = att.answers[q.no + '-' + pi];
        if (v !== undefined && v !== null && String(v).trim() !== '') n++;
      });
    });
    return n;
  }

  /* ------------------------------------------------------------------ 作答界面 */
  function renderAttempt(root, exam, att) {
    root.innerHTML = '';
    live.examId = exam.id;
    live.attempt = att;

    /* 顶部固定栏 */
    var bar = el('div', { class: 'exBar' });
    bar.appendChild(el('span', { class: 'exFile', text: exam.title }));
    var timerNode = el('span', { class: 'exTimer' });
    bar.appendChild(timerNode);
    var sheetBtn = el('button', { class: 'qzBtn ghost', type: 'button', text: '答题卡' });
    var submitBtn = el('button', { class: 'qzBtn', type: 'button', text: '交卷' });
    bar.appendChild(sheetBtn);
    bar.appendChild(submitBtn);
    root.appendChild(bar);

    var sheetHost = el('div');
    sheetHost.hidden = true;
    root.appendChild(sheetHost);

    var confirmHost = el('div');
    root.appendChild(confirmHost);

    var body = el('div');
    root.appendChild(body);

    /* 答题卡 */
    function refreshSheet() {
      sheetHost.innerHTML = '';
      var card = el('div', { class: 'exCover' });
      card.appendChild(el('div', { class: 'sub', text: '答题卡 · 已作答 ' + countAnswered(exam, att) + ' / ' + exam.questions.length + ' 题' }));
      var grid = el('div', { class: 'exSheet' });
      exam.questions.forEach(function (q) {
        var answered = (q.parts || []).some(function (part, pi) {
          var v = att.answers[q.no + '-' + pi];
          return v !== undefined && v !== null && String(v).trim() !== '';
        });
        var b = el('button', {
          class: 'exSheetBtn' + (answered ? ' ans' : ''), type: 'button', text: String(q.no),
          title: 'Q' + q.no + ' · ' + q.points + ' points'
        });
        b.addEventListener('click', function () {
          var target = document.getElementById('ex-q-' + exam.id + '-' + q.no);
          if (target) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
        grid.appendChild(b);
      });
      card.appendChild(grid);
      sheetHost.appendChild(card);
    }

    sheetBtn.addEventListener('click', function () {
      sheetHost.hidden = !sheetHost.hidden;
      if (!sheetHost.hidden) { refreshSheet(); sheetHost.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }
    });

    var saveTimer = null;
    function autoSave() {
      clearTimeout(saveTimer);
      saveTimer = setTimeout(function () { saveAttempt(exam.id, att); }, 400);
    }

    /* 题目 */
    exam.questions.forEach(function (q) {
      body.appendChild(questionBlock(exam, q, att, function () { autoSave(); if (!sheetHost.hidden) refreshSheet(); }));
    });

    /* 交卷 */
    submitBtn.addEventListener('click', function () {
      showConfirm(confirmHost, exam, att, function (ok) {
        if (ok) { stopTimer(); finalize(root, exam, att, false); }
        else confirmHost.innerHTML = '';
      });
    });

    /* 计时 */
    function tick() {
      var remain = att.deadline - Date.now();
      if (remain <= 0) {
        timerNode.textContent = '00:00';
        stopTimer();
        finalize(root, exam, att, true);
        return;
      }
      timerNode.textContent = fmtClock(remain);
      timerNode.className = 'exTimer' + (remain < 60000 ? ' danger' : remain < 300000 ? ' warn' : '');
    }
    stopTimer();
    live.timerId = setInterval(tick, 1000);
    tick();
    refreshSheet();
    window.scrollTo(0, 0);
  }

  function questionBlock(exam, q, att, onChange) {
    var card = el('div', { class: 'exQ', id: 'ex-q-' + exam.id + '-' + q.no });
    var head = el('div', { class: 'exQHead' }, [
      el('span', { class: 'exQNum', text: 'Q' + q.no }),
      el('span', { class: 'exQScore', text: q.points + ' points' }),
      el('span', { class: 'exQType', text: typeName(q) })
    ]);
    card.appendChild(head);
    if (q.intro) card.appendChild(el('div', { class: 'qzStem', html: q.intro }));
    if (q.code) card.appendChild(codeBox(q.code, q.codeTitle || ('Q' + q.no + '.java')));
    (q.parts || []).forEach(function (part, pi) {
      card.appendChild(partBlock(q, part, pi, att, onChange));
    });
    return card;
  }

  function typeName(q) {
    if (q.type) return q.type;
    var kinds = (q.parts || []).map(function (p) { return p.kind; });
    if (kinds.indexOf('choice') >= 0) return 'multiple choice';
    if (kinds.indexOf('tf') >= 0) return 'true / false';
    if (kinds.indexOf('output') >= 0) return 'read & write output';
    if (kinds.indexOf('keywords') >= 0) return 'short answer';
    return 'fill in';
  }

  function partBlock(q, part, pi, att, onChange) {
    var key = q.no + '-' + pi;
    var wrap = el('div');
    var prompt = el('div', { class: 'qzStem' });
    prompt.innerHTML = (part.label ? '<b>' + esc(part.label) + '</b> ' : '') + (part.prompt || '');
    wrap.appendChild(prompt);
    if (part.code) wrap.appendChild(codeBox(part.code, part.codeTitle || 'Java'));

    var kind = part.kind || 'fill';
    if (kind === 'choice' || kind === 'tf') {
      var opts = el('div', { class: 'qzOpts' });
      var buttons = [];
      (part.options || []).forEach(function (opt, i) {
        var b = el('button', { class: 'qzOpt', type: 'button' }, [
          el('span', { class: 'qn', text: LETTERS[i] }),
          el('span', { class: 'qo', html: opt.text })
        ]);
        if (att.answers[key] === i) b.classList.add('sel');
        b.addEventListener('click', function () {
          att.answers[key] = i;
          buttons.forEach(function (bb, bi) { bb.classList.toggle('sel', bi === i); });
          onChange();
        });
        buttons.push(b);
        opts.appendChild(b);
      });
      wrap.appendChild(opts);
    } else if (kind === 'fill') {
      var row = el('div', { class: 'qzInputRow' });
      var input = el('input', {
        class: 'qzInput', type: 'text', spellcheck: 'false',
        placeholder: part.placeholder || 'Your answer'
      });
      if (att.answers[key] != null) input.value = att.answers[key];
      input.addEventListener('input', function () {
        att.answers[key] = input.value;
        onChange();
      });
      row.appendChild(input);
      wrap.appendChild(row);
    } else {
      var ta = el('textarea', { class: 'qzTextarea', spellcheck: 'false' });
      ta.placeholder = part.placeholder || 'Your answer（可写多行）';
      if (att.answers[key] != null) ta.value = att.answers[key];
      ta.addEventListener('input', function () {
        att.answers[key] = ta.value;
        onChange();
      });
      wrap.appendChild(ta);
    }
    return wrap;
  }

  /* ------------------------------------------------------------------ 交卷确认 */
  function showConfirm(host, exam, att, done) {
    host.innerHTML = '';
    var card = el('div', { class: 'qzCard' });
    var body = el('div', { class: 'qzBody' });
    var answered = countAnswered(exam, att);
    var total = 0;
    exam.questions.forEach(function (q) { total += (q.parts || []).length; });
    var un = [];
    exam.questions.forEach(function (q) {
      var missing = (q.parts || []).every(function (part, pi) {
        var v = att.answers[q.no + '-' + pi];
        return v === undefined || v === null || String(v).trim() === '';
      });
      if (missing) un.push('Q' + q.no);
    });
    body.appendChild(el('div', { class: 'qzStem', html: '<b>确认交卷？</b>' }));
    body.appendChild(el('div', { class: 'blockP', text: '已作答 ' + answered + ' / ' + total + ' 小题' + (un.length ? '，完全未作答的题：' + un.join('、') : '，所有题都有填写') + '。交卷后不能再修改答案。' }));
    var actions = el('div', { class: 'qzActions' });
    var yes = el('button', { class: 'qzBtn', type: 'button', text: '确认交卷' });
    yes.addEventListener('click', function () { done(true); });
    var no = el('button', { class: 'qzBtn ghost', type: 'button', text: '继续作答' });
    no.addEventListener('click', function () { done(false); });
    actions.appendChild(yes);
    actions.appendChild(no);
    body.appendChild(actions);
    card.appendChild(body);
    host.appendChild(card);
    host.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  /* ------------------------------------------------------------------ 判分与成绩 */
  function finalize(root, exam, att, auto) {
    stopTimer();
    var graded = gradeExam(exam, att.answers);
    var record = {
      examId: exam.id,
      score: graded.total,
      total: exam.totalScore || 100,
      detail: graded.detail,
      answers: att.answers,
      startedAt: att.startedAt,
      submittedAt: Date.now(),
      usedMs: Date.now() - att.startedAt,
      auto: !!auto
    };
    att.submitted = true;
    att.record = record;
    saveAttempt(exam.id, att);
    saveResult(exam.id, record);
    pushHistory(exam.id, { score: record.score, total: record.total, date: record.submittedAt, auto: !!auto });
    if (auto) CSC.toast('时间到，已自动交卷', 'warn');
    live.examId = null;
    live.attempt = null;
    renderResult(root, exam, record);
    window.scrollTo(0, 0);
  }

  function renderResult(root, exam, record) {
    root.innerHTML = '';
    var pct = Math.round(record.score / record.total * 100);
    var cover = el('div', { class: 'exCover' });
    cover.appendChild(el('div', { class: 'sub', text: exam.title + ' · ' + exam.style + ' · ' + (exam.date || '') }));
    cover.appendChild(el('div', { class: 'big-num', text: String(record.score) + ' / ' + String(record.total) }));
    cover.appendChild(el('div', { class: 'blockP', html: '得分率 <b>' + pct + '%</b> · 用时 ' + fmtClock(record.usedMs) + ' · ' + (record.auto ? '<span class="pill warn">超时自动交卷</span>' : '<span class="pill ok">按时交卷</span>') + ' · 交卷时间 ' + fmtDate(record.submittedAt) }));
    var info = el('div', { class: 'exInfo' });
    var rightParts = 0, allParts = 0;
    record.detail.forEach(function (d) {
      d.parts.forEach(function (p) {
        allParts++;
        if (p.score >= p.max) rightParts++;
      });
    });
    info.appendChild(infoItem('Score', record.score + ' / ' + record.total));
    info.appendChild(infoItem('Full marks', rightParts + ' / ' + allParts));
    info.appendChild(infoItem('Used', fmtClock(record.usedMs)));
    if (record.score >= 85) info.appendChild(infoItem('评价', '优秀'));
    else if (record.score >= 60) info.appendChild(infoItem('评价', '及格'));
    else info.appendChild(infoItem('评价', '需复习'));
    cover.appendChild(info);
    var actions = el('div', { class: 'qzActions' });
    var again = el('button', { class: 'qzBtn', type: 'button', text: '重做本卷' });
    again.addEventListener('click', function () {
      clearAttempt(exam.id);
      CSC.store.del(LS_RESULT + exam.id);
      renderCover(root, exam);
    });
    actions.appendChild(again);
    actions.appendChild(el('a', { class: 'qzBtn ghost', href: '#/exam', text: '返回试卷列表' }));
    actions.appendChild(el('a', { class: 'qzBtn ghost', href: '#/quiz', text: '去题库刷题' }));
    cover.appendChild(actions);
    root.appendChild(cover);

    root.appendChild(el('h2', { class: 'blockH', text: '逐题解析' }));
    exam.questions.forEach(function (q) {
      var d = null;
      record.detail.forEach(function (x) { if (x.no === q.no) d = x; });
      root.appendChild(resultQuestion(q, d, record));
    });
  }

  function resultQuestion(q, d, record) {
    var card = el('div', { class: 'exQ' });
    var head = el('div', { class: 'exQHead' }, [
      el('span', { class: 'exQNum', text: 'Q' + q.no }),
      el('span', { class: 'exQScore', text: (d ? d.score : 0) + ' / ' + q.points }),
      el('span', { class: 'exQType', text: typeName(q) })
    ]);
    card.appendChild(head);
    if (q.intro) card.appendChild(el('div', { class: 'qzStem', html: q.intro }));
    if (q.code) card.appendChild(codeBox(q.code, q.codeTitle || ('Q' + q.no + '.java')));
    (q.parts || []).forEach(function (part, pi) {
      var dp = null;
      if (d && d.parts) d.parts.forEach(function (x) { if (x.key === q.no + '-' + pi) dp = x; });
      var score = dp ? dp.score : 0;
      var resp = record.answers[q.no + '-' + pi];
      var full = score >= part.points - 0.001;
      var fb = el('div', { class: 'qzFb ' + (full ? 'correct' : 'wrong') });
      fb.appendChild(el('div', {
        class: 'qzFbHead',
        html: (full ? icon('check') : icon('x')) + '<span>' + (part.label ? esc(part.label) + ' · ' : '') + score + ' / ' + part.points + ' 分</span>'
      }));
      var bd = el('div', { class: 'qzFbBody' });
      if (part.prompt) bd.appendChild(el('div', { html: part.prompt }));
      if (part.code) bd.appendChild(codeBox(part.code, part.codeTitle || 'Java'));
      bd.appendChild(el('div', { class: 'ansLine', text: '你的答案：' + respDisplay(part, resp) }));
      bd.appendChild(el('div', { class: 'ansLine', html: '参考答案：<b>' + esc(answerDisplay(part)).replace(/\n/g, '<br>') + '</b>' }));
      if (part.explain) bd.appendChild(el('div', { html: part.explain }));
      fb.appendChild(bd);
      card.appendChild(fb);
    });
    return card;
  }

  function respDisplay(part, resp) {
    if (resp === undefined || resp === null || String(resp).trim() === '') return '（未作答）';
    if (part.kind === 'choice' || part.kind === 'tf') {
      var i = typeof resp === 'number' ? resp : parseInt(resp, 10);
      var opt = (part.options || [])[i];
      if (!opt) return '（未作答）';
      return LETTERS[i] + '. ' + stripTags(opt.text);
    }
    return String(resp);
  }

  function answerDisplay(part) {
    if (part.kind === 'choice' || part.kind === 'tf') {
      var idx = -1;
      (part.options || []).forEach(function (o, i) { if (o.correct) idx = i; });
      if (idx < 0) return '见解析';
      return LETTERS[idx] + '. ' + stripTags(part.options[idx].text);
    }
    if (part.answer != null) return String(part.answer);
    if (part.keywords) return '关键词：' + part.keywords.map(function (k) { return Array.isArray(k) ? k[0] : k; }).join(' / ');
    return '见解析';
  }

  /* ------------------------------------------------------------------ 导出 */
  CSC.exam = {
    mountList: mountList,
    mount: mount,
    _ingest: ingestExam,
    _list: function () { return exams.slice(); }
  };
  if (CSC.bus && CSC.bus.emit) CSC.bus.emit('exam:engine-ready');
})();
