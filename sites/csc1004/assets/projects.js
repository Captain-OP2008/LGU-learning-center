/* =====================================================================
 * 计算机科学与 Java 编程导论 · 学习站 · projects.js
 * 职责：项目式学习的渲染与判分层。
 *   - CSC.projects.mountList(host, projects)：项目卡片列表（难度/章节/时长/完成状态）
 *   - CSC.projects.mountDetail(host, project)：项目详情 = 需求 + 里程碑 + 编辑器 +
 *     「运行并检查」（跑该里程碑隐藏测试）+ 提示 + 参考实现 + 扩展挑战
 *   判分复用站内 Java 引擎（CSC.java.run）与题库 code 题同一套输出归一化规则；
 *   用户代码 / 完成状态保存到 localStorage（csc.projects），刷新后继续。
 * 依赖：CSC.el / CSC.editor / CSC.java（由 assets/app.js 按需加载后传入）
 * 作者模块：feature-builder
 * ===================================================================== */
(function () {
  'use strict';

  var CSC = window.CSC;
  if (!CSC) {
    console.error('[projects] 必须先加载 app.js');
    return;
  }

  function E(tag, attrs, children) { return CSC.el(tag, attrs, children); }
  function icon(name) { return typeof CSC.icon === 'function' ? CSC.icon(name) : ''; }
  function esc(s) { return CSC.escapeHtml(s); }

  /** 与题库 code 题一致的输出归一化：去 CR、去行首尾空白、丢弃空行 */
  function normLines(s) {
    return String(s == null ? '' : s)
      .replace(/\r\n?/g, '\n')
      .replace(/\u00a0/g, ' ')
      .split('\n')
      .map(function (line) { return line.replace(/[ \t]+$/g, '').replace(/^[ \t]+/g, ''); })
      .filter(function (line) { return line.length > 0; })
      .join('\n');
  }

  var STORE_KEY = 'projects';

  function loadAllState() {
    var all = null;
    try { all = CSC.store.get(STORE_KEY, null); } catch (e) { all = null; }
    return all && typeof all === 'object' ? all : {};
  }
  function projectState(id) {
    var all = loadAllState();
    var st = all[id];
    if (!st || typeof st !== 'object') st = {};
    if (!st.done || typeof st.done !== 'object') st.done = {};
    if (!st.code || typeof st.code !== 'object') st.code = {};
    /* keep：参考实现是否已解锁（看过后不再默认隐藏） */
    if (!st.keep || typeof st.keep !== 'object') st.keep = {};
    return st;
  }
  function saveProjectState(id, st) {
    var all = loadAllState();
    all[id] = st;
    CSC.store.set(STORE_KEY, all);
    if (CSC.bus) CSC.bus.emit('projects:change', { id: id, state: st });
  }
  function doneCount(p, st) {
    var n = 0;
    (p.milestones || []).forEach(function (m) { if (st.done && st.done[m.n]) n++; });
    return n;
  }

  function levelText(lv) {
    var l = Math.max(1, Math.min(3, Math.round(lv || 1)));
    var out = '';
    for (var i = 1; i <= 3; i++) out += i <= l ? '★' : '☆';
    return out;
  }

  function chapterLabel(id) {
    var m = (CSC.chapterMeta || []).filter(function (x) { return x.id === id; })[0];
    return m ? (m.num + ' ' + m.title) : id;
  }

  /* ==================================================================
   * 一、项目列表
   * ================================================================== */
  function mountList(host, projects) {
    host.innerHTML = '';
    projects = projects || [];
    var doneTotal = 0;
    projects.forEach(function (p) { doneTotal += doneCount(p, projectState(p.id)); });
    var totalMiles = projects.reduce(function (a, p) { return a + (p.milestones || []).length; }, 0);

    host.appendChild(E('div', { class: 'projectsIntro' }, [
      E('div', { class: 'piK', text: 'PROJECT_LAB // 项目实战' }),
      E('p', {
        class: 'piT',
        html: '把 21 章学到的东西拼成课程要求的三个项目：<b>Java 聊天室 Chat Zoom</b>（Socket + 多线程）、'
          + '<b>Gomoku 五子棋</b>（类设计 + JavaFX）、<b>Python 贪吃蛇</b>（Tkinter + 类）。'
          + '每个项目拆成 5 个里程碑，含验收清单、代码骨架、提示与参考实现。'
          + '<b>注意：</b>这三个项目跑在 Socket / JavaFX / Tkinter 上，无法在浏览器里自动判分——'
          + '每个里程碑请按任务清单在你的 IntelliJ / PyCharm 里逐条自检。'
      }),
      E('div', { class: 'piStat' }, [
        E('span', { html: '已完成 <b>' + doneTotal + '</b> / ' + totalMiles + ' 个里程碑' })
      ])
    ]));

    var grid = E('div', { class: 'projectsGrid' });
    projects.forEach(function (p) {
      var st = projectState(p.id);
      var done = doneCount(p, st);
      var miles = (p.milestones || []).length;
      var pct = miles ? Math.round(done / miles * 100) : 0;
      var status = done >= miles ? 'DONE' : (done > 0 ? 'IN PROGRESS' : 'NOT STARTED');
      var card = E('a', {
        class: 'projectCard' + (done >= miles ? ' done' : ''),
        href: '#/projects/' + p.id,
        dataset: { project: p.id }
      }, [
        E('div', { class: 'pcTop' }, [
          E('span', { class: 'pcLevel', text: levelText(p.level), title: '难度 ' + p.level + ' / 3' }),
          E('span', { class: 'pcStatus', text: status }),
          E('span', { class: 'pcMin', text: '≈' + p.minutes + ' min' })
        ]),
        E('div', { class: 'pcTitle', text: p.title }),
        E('div', { class: 'pcEn', text: p.en }),
        E('div', { class: 'pcTag', text: p.tagline }),
        E('div', { class: 'pcChips' }, (p.chapters || []).slice(0, 5).map(function (id) {
          return E('span', { class: 'pcChip', text: chapterLabel(id) });
        })),
        E('div', { class: 'pcProgress' }, [
          E('span', { class: 'pcBar' }, (function () {
            var bar = E('span', { class: 'pcBarFill' });
            bar.style.width = pct + '%';
            return bar;
          })()),
          E('span', { class: 'pcPct', text: done + ' / ' + miles + ' 里程碑' })
        ]),
        E('div', { class: 'pcGo', html: '进入项目 <span class="pcArrow">→</span>' })
      ]);
      grid.appendChild(card);
    });
    host.appendChild(grid);

    host.appendChild(E('div', {
      class: 'learnNote',
      html: 'HOW_IT_WORKS // 每个里程碑给出<b>验收清单 + 代码骨架 + 提示 + 参考实现</b>。'
        + 'CSC1004 的三个项目跑在 Socket / JavaFX / Tkinter 上，<b>无法在浏览器里自动判分</b>：'
        + '请在你的 IntelliJ / PyCharm 里逐条验证任务清单，确认无误后点「标记本里程碑完成」。'
        + '<br>代码与完成状态保存在本机（csc.projects），刷新/重开浏览器后继续；不上传任何数据。'
    }));
  }

  /* ==================================================================
   * 二、项目详情
   * ================================================================== */
  function mountDetail(host, project) {
    host.innerHTML = '';
    if (!project) {
      host.appendChild(E('div', { class: 'learnEmpty' }, [
        E('div', { class: 'learnEmptyT', text: '没有找到这个项目' }),
        E('div', { class: 'learnEmptyD', text: '可能项目数据没有加载好，回列表重新进入试试。' }),
        E('a', { class: 'learnEmptyBtn', href: '#/projects', text: '← 返回项目列表' })
      ]));
      return;
    }
    var st = projectState(project.id);
    var state = { current: Math.max(1, Math.min((project.milestones || []).length, Number(st.current) || 1)) };

    /* ---------- 头部 ---------- */
    var head = E('div', { class: 'projHead' });
    head.appendChild(E('a', { class: 'projBack', href: '#/projects', text: '← 项目列表' }));
    head.appendChild(E('span', { class: 'projLevel', text: levelText(project.level), title: '难度 ' + project.level + ' / 3' }));
    head.appendChild(E('span', { class: 'projMin', text: '预计 ' + project.minutes + ' 分钟' }));
    var progNode = E('span', { class: 'projProg' });
    head.appendChild(progNode);
    function paintProgress() {
      var d = doneCount(project, st);
      var total = (project.milestones || []).length;
      progNode.textContent = d + ' / ' + total + ' 里程碑';
      progNode.className = 'projProg' + (d >= total ? ' done' : '');
    }
    paintProgress();
    host.appendChild(head);

    host.appendChild(E('h2', { class: 'projTitle', text: project.title }));
    host.appendChild(E('div', { class: 'projEn', text: project.en + ' · ' + project.tagline }));
    host.appendChild(E('div', { class: 'projChips' }, (project.chapters || []).map(function (id) {
      var m = (CSC.chapterMeta || []).filter(function (x) { return x.id === id; })[0];
      return E('a', { class: 'pcChip', href: '#/' + id, title: '去读这一章' }, [
        E('span', { class: 'pcChipK', text: m ? m.num : id }),
        E('span', { text: m ? m.title : id })
      ]);
    })));

    host.appendChild(E('div', { class: 'projIntro', html: project.intro || '' }));

    if (project.goals && project.goals.length) {
      var goals = E('div', { class: 'projGoals' });
      project.goals.forEach(function (g) {
        goals.appendChild(E('div', { class: 'projGoal' }, [
          E('span', { class: 'projGoalK', html: icon('target') }),
          E('span', { class: 'projGoalT', text: g })
        ]));
      });
      host.appendChild(E('div', { class: 'projSection' }, [
        E('span', { class: 'projSectionT', text: '学完你会' }),
        E('span', { class: 'projSectionK', text: 'GOALS' })
      ]));
      host.appendChild(goals);
    }

    /* ---------- 里程碑页签 ---------- */
    var tabsHost = E('div', { class: 'projTabs', role: 'tablist' });
    var bodyHost = E('div', { class: 'projBody' });
    host.appendChild(E('div', { class: 'projSection' }, [
      E('span', { class: 'projSectionT', text: '里程碑' }),
      E('span', { class: 'projSectionK', text: '写代码 → 运行并检查 → 全部通过' })
    ]));
    host.appendChild(tabsHost);
    host.appendChild(bodyHost);

    function paintTabs() {
      tabsHost.innerHTML = '';
      paintProgress();
      (project.milestones || []).forEach(function (m) {
        var isDone = !!st.done[m.n];
        var isCur = m.n === state.current;
        tabsHost.appendChild(E('button', {
          class: 'projTab' + (isCur ? ' on' : '') + (isDone ? ' done' : ''),
          type: 'button',
          dataset: { milestone: String(m.n) },
          'aria-selected': isCur ? 'true' : 'false'
        }, [
          E('span', { class: 'projTabN', text: 'M' + m.n }),
          E('span', { class: 'projTabT', text: (m.title || '').replace(/^M\d+\s*·\s*/, '') }),
          E('span', { class: 'projTabState', html: isDone ? icon('check') : '' })
        ]));
      });
      Array.prototype.slice.call(tabsHost.querySelectorAll('.projTab')).forEach(function (b) {
        b.addEventListener('click', function () {
          state.current = Number(b.dataset.milestone) || 1;
          st.current = state.current;
          saveProjectState(project.id, st);
          paintTabs();
          paintBody();
        });
      });
    }

    function paintBody() {
      bodyHost.innerHTML = '';
      var milestone = (project.milestones || [])[state.current - 1];
      if (!milestone) return;
      bodyHost.appendChild(renderMilestone(project, milestone, st, {
        tabs: paintTabs,
        body: paintBody
      }));
    }

    paintTabs();
    paintBody();

    /* ---------- 扩展挑战 ---------- */
    if (project.extension && project.extension.length) {
      var ext = E('div', { class: 'projExt' });
      project.extension.forEach(function (t, i) {
        ext.appendChild(E('div', { class: 'projExtItem' }, [
          E('span', { class: 'projExtN', text: String(i + 1).padStart(2, '0') }),
          E('span', { class: 'projExtT', text: t })
        ]));
      });
      host.appendChild(E('div', { class: 'projSection' }, [
        E('span', { class: 'projSectionT', text: '扩展挑战' }),
        E('span', { class: 'projSectionK', text: 'EXTENSIONS · 做完主线再挑战' })
      ]));
      host.appendChild(ext);
    }
    if (project.solutionNote) {
      host.appendChild(E('div', { class: 'projSolutionNote', text: project.solutionNote }));
    }
  }

  /**
   * 单个里程碑：任务清单 + 编辑器 + 运行检查 + 提示 + 参考实现
   * @param {object} project 项目
   * @param {object} milestone 里程碑
   * @param {object} st 项目本地状态（含 code / done / keep）
   * @param {object} refresh { tabs(), body() }：只刷新页签 / 整个里程碑主体
   */
  function renderMilestone(project, milestone, st, refresh) {
    var wrap = E('div', { class: 'projMilestone', dataset: { milestone: String(milestone.n) } });

    var isDone = !!st.done[milestone.n];
    wrap.appendChild(E('div', { class: 'projMTop' }, [
      E('span', { class: 'projMTitle', text: milestone.title || ('M' + milestone.n) }),
      isDone ? E('span', { class: 'projDoneBadge', html: icon('check') + '<span>已完成</span>' }) : null
    ]));

    /* 任务清单 */
    var tasks = E('div', { class: 'projTasks' });
    (milestone.tasks || []).forEach(function (t, i) {
      tasks.appendChild(E('div', { class: 'projTask' }, [
        E('span', { class: 'projTaskN', text: String(i + 1).padStart(2, '0') }),
        E('span', { class: 'projTaskT', text: t })
      ]));
    });
    wrap.appendChild(tasks);

    /* 编辑器 */
    var code = (st.code && typeof st.code[milestone.n] === 'string')
      ? st.code[milestone.n]
      : (milestone.starter || '');
    var edHost = E('div', { class: 'projEditorHost' });
    wrap.appendChild(edHost);
    var editor = null;
    function mountEditor() {
      if (!CSC.editor) {
        edHost.appendChild(E('div', { class: 'varEmpty', text: '代码编辑器加载中…' }));
        if (CSC.loadModules) {
          CSC.loadModules(['engine', 'editor']).then(function () {
            edHost.innerHTML = '';
            mountEditor();
          });
        }
        return;
      }
      try {
        editor = CSC.editor.mount(edHost, {
          code: code,
          height: Math.min(520, Math.max(300, String(code).split('\n').length * 19 + 60)),
          run: true,
          trace: false,
          onChange: function (v) {
            if (!st.code) st.code = {};
            st.code[milestone.n] = v;
            saveProjectState(project.id, st);
          }
        });
      } catch (e) {
        edHost.appendChild(E('div', { class: 'varEmpty', text: '编辑器挂载失败：' + (e && e.message) }));
      }
    }
    mountEditor();

    /* 操作按钮 */
    var resultHost = E('div', { class: 'projResultHost' });
    var actions = E('div', { class: 'projActions' });
    /* CSC1004 的项目（Socket / JavaFX / Tkinter）无法在站内引擎里跑，
     * tests 一律为 []；此时把「运行并检查」换成「标记完成」，避免按钮点了 0/0 假通过。 */
    var hasTests = ((milestone.tests || []).length > 0);
    var checkBtn = E('button', { class: 'projBtn primary', type: 'button' }, [
      E('span', { html: icon(hasTests ? 'play' : 'check') }),
      E('span', { text: hasTests ? '运行并检查' : '标记本里程碑完成' })
    ]);
    var resetBtn = E('button', { class: 'projBtn ghost', type: 'button', text: '重置为起始代码' });
    actions.appendChild(checkBtn);
    actions.appendChild(resetBtn);
    wrap.appendChild(actions);
    wrap.appendChild(resultHost);

    function showFail(message) {
      resultHost.innerHTML = '';
      resultHost.appendChild(E('div', { class: 'projRunNote err', text: message }));
    }

    checkBtn.addEventListener('click', function () {
      var src = editor ? editor.getCode() : code;
      /* 无隐藏测试（CSC1004 全部项目）：按任务清单人工自检后手动标记完成 */
      if (!hasTests) {
        if (!src || !String(src).trim()) { showFail('先把 starter 骨架补完（哪怕是部分实现），再标记完成。'); return; }
        st.done[milestone.n] = true;
        if (!st.keep) st.keep = {};
        delete st.keep[milestone.n];
        var pTotal = (project.milestones || []).length;
        var pNext = Math.min(pTotal, milestone.n + 1);
        if (Number(st.current) < pNext) st.current = pNext;
        saveProjectState(project.id, st);
        resultHost.innerHTML = '';
        resultHost.appendChild(E('div', {
          class: 'projRunNote',
          text: 'M' + milestone.n + ' 已标记完成。注意：本站不能运行 Socket / JavaFX / Tkinter 代码，'
            + '请确认任务清单每一条都在你自己的 IDE 里验证过。'
        }));
        if (CSC.toast) CSC.toast('M' + milestone.n + ' 已标记完成', 'ok');
        if (refresh && refresh.tabs) refresh.tabs();
        return;
      }
      if (!src || !src.trim()) { showFail('先写点代码再检查。'); return; }
      if (!CSC.java || typeof CSC.java.run !== 'function') {
        resultHost.innerHTML = '';
        resultHost.appendChild(E('div', { class: 'projRunNote', text: 'Java 引擎加载中，正在自动重试…' }));
        CSC.loadModules(['engine']).then(function () {
          if (CSC.java) checkBtn.click();
          else showFail('Java 引擎加载失败：可以对照参考实现自我检查。');
        });
        return;
      }
      checkBtn.disabled = true;
      var rows = [];
      var allOk = true;
      var tests = milestone.tests || [];
      var idx = 0;
      function runOne() {
        if (idx >= tests.length) { finish(); return; }
        var t = tests[idx];
        var res;
        try {
          res = CSC.java.run(src, {
            snapshots: false,
            args: t.args || [],
            stdin: t.stdin || '',
            maxSteps: 200000,
            timeoutMs: 2500
          });
        } catch (e) {
          res = { ok: false, output: '', error: { message: (e && e.message) || String(e) } };
        }
        var actual = res && res.ok ? String(res.output || '') : '';
        var pass = !!(res && res.ok && normLines(actual) === normLines(t.expect || ''));
        if (!pass) allOk = false;
        rows.push({
          i: idx + 1,
          name: t.name || ('测试 ' + (idx + 1)),
          pass: pass,
          expected: t.expect || '',
          actual: actual,
          error: res && res.error
        });
        idx++;
        runOne();
      }
      function finish() {
        checkBtn.disabled = false;
        resultHost.innerHTML = '';
        var head = E('div', { class: 'projRunHead ' + (allOk ? 'ok' : 'fail') }, [
          E('span', { class: 'projRunIcon', html: icon(allOk ? 'check' : 'x') }),
          E('b', { text: allOk ? '全部测试通过！' : '还有 ' + rows.filter(function (r) { return !r.pass; }).length + ' 个测试未通过' }),
          E('span', { class: 'projRunCount', text: rows.filter(function (r) { return r.pass; }).length + ' / ' + rows.length })
        ]);
        resultHost.appendChild(head);
        rows.forEach(function (r) {
          var row = E('div', { class: 'projTestRow ' + (r.pass ? 'ok' : 'fail') }, [
            E('span', { class: 'projTestName', text: '测试 ' + r.i + ' · ' + r.name }),
            E('span', { class: 'projTestState', text: r.pass ? '通过' : '未通过' })
          ]);
          resultHost.appendChild(row);
          if (!r.pass) {
            if (r.error && r.error.message) {
              resultHost.appendChild(E('div', { class: 'projTestDetail err', text: '错误：' + r.error.message + (r.error.line ? '（第 ' + r.error.line + ' 行）' : '') }));
            }
            resultHost.appendChild(E('div', { class: 'projTestDetail', text: '期望输出：' + normLines(r.expected) }));
            resultHost.appendChild(E('div', { class: 'projTestDetail', text: '实际输出：' + (normLines(r.actual) || '（空）') }));
          }
        });

        if (allOk) {
          st.done[milestone.n] = true;
          delete st.keep[milestone.n];
          var total = (project.milestones || []).length;
          /* 不自动跳里程碑：先让用户看到「全部测试通过」的结果，再手动进入下一关 */
          var nextIndex = Math.min(total, milestone.n + 1);
          if (Number(st.current) < nextIndex) st.current = nextIndex;
          saveProjectState(project.id, st);
          if (CSC.toast) CSC.toast('M' + milestone.n + ' 通过！状态已保存', 'ok');
            var nav = E('div', { class: 'projNextRow' });
          if (milestone.n < total) {
            var nextBtn = E('button', { class: 'projBtn primary', type: 'button', text: '下一里程碑 M' + (milestone.n + 1) + ' →' });
            nextBtn.addEventListener('click', function () {
              st.current = milestone.n + 1;
              saveProjectState(project.id, st);
              if (refresh) {
                if (refresh.tabs) refresh.tabs();
                if (refresh.body) refresh.body();
              }
            });
            nav.appendChild(nextBtn);
          } else {
            var listBtn = E('a', { class: 'projBtn primary', href: '#/projects', text: '项目完成，回列表 →' });
            nav.appendChild(listBtn);
          }
          resultHost.appendChild(nav);
          if (refresh && refresh.tabs) refresh.tabs();
        }
      }
      runOne();
    });

    resetBtn.addEventListener('click', function () {
      code = milestone.starter || '';
      if (editor && editor.setCode) editor.setCode(code);
      if (!st.code) st.code = {};
      st.code[milestone.n] = code;
      saveProjectState(project.id, st);
      resultHost.innerHTML = '';
      if (CSC.toast) CSC.toast('已恢复为起始代码', '');
    });

    /* 提示（折叠） */
    if (milestone.hints && milestone.hints.length) {
      var hints = E('div', { class: 'projHints' });
      milestone.hints.forEach(function (h, i) {
        var box = E('details', { class: 'projCollapse' }, [
          E('summary', { class: 'projCollapseHead', text: '💡 提示 ' + (i + 1) }),
          E('div', { class: 'projCollapseBody', text: h })
        ]);
        hints.appendChild(box);
      });
      wrap.appendChild(hints);
    }

    /* 参考实现（默认折叠；通过后可展开对照） */
    if (milestone.solution) {
      var unlocked = !!st.keep[milestone.n] || !!st.done[milestone.n];
      var solBody = E('div', { class: 'projCollapseBody' });
      var loaded = false;
      function paintSolution() {
        solBody.innerHTML = '';
        if (!unlocked && !loaded) {
          solBody.appendChild(E('div', { class: 'projSolutionLock' }, [
            E('div', { html: '参考实现默认隐藏：先自己写。通过本里程碑的测试后会自动解锁；也可以直接点下面的按钮提前看。' }),
            (function () {
              var b = E('button', { class: 'projBtn ghost', type: 'button', text: '提前查看参考实现' });
              b.addEventListener('click', function () {
                unlocked = true;
                st.keep[milestone.n] = true;
                saveProjectState(project.id, st);
                paintSolution();
              });
              return b;
            })()
          ]));
          return;
        }
        solBody.appendChild(E('div', { class: 'projCodeBox', html: CSC.codeLines ? CSC.codeLines(milestone.solution) : '<pre>' + esc(milestone.solution) + '</pre>' }));
        var loadBtn = E('button', { class: 'projBtn ghost', type: 'button', text: '载入到编辑器' });
        loadBtn.addEventListener('click', function () {
          code = milestone.solution;
          if (editor && editor.setCode) editor.setCode(code);
          if (!st.code) st.code = {};
          st.code[milestone.n] = code;
          saveProjectState(project.id, st);
          if (CSC.toast) CSC.toast('参考实现已载入编辑器（对照着读一遍再自己重写）', 'ok');
        });
        solBody.appendChild(loadBtn);
      }
      paintSolution();
      wrap.appendChild(E('details', { class: 'projCollapse projSolCollapse' }, [
        E('summary', { class: 'projCollapseHead', text: '📖 参考实现（' + (unlocked ? '已解锁' : '默认隐藏') + '）' }),
        solBody
      ]));
    }
    if (milestone.explain) {
      wrap.appendChild(E('div', { class: 'projExplain', html: milestone.explain }));
    }
    return wrap;
  }

  /* ==================================================================
   * 导出
   * ================================================================== */
  CSC.projects = {
    version: '1.0',
    mountList: mountList,
    mountDetail: mountDetail,
    /* 供自测/其他模块读取某项目的本地状态 */
    stateOf: function (id) { return projectState(id); },
    normLines: normLines
  };
  if (CSC.bus && CSC.bus.emit) CSC.bus.emit('projects:ready', CSC.projects);
})();
