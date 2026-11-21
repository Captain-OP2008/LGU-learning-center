/* =====================================================================
 * 项目实战 · 渲染层（静态展示，不在站内运行代码）
 *   - CSC.projects.mountList(host, projects)：项目卡片列表
 *   - CSC.projects.mountDetail(host, project)：项目详情 = 目标 + 里程碑
 *     + 起始代码 + 提示 + 参考实现 + 扩展挑战 + 验收标准
 * 所有代码示例均为静态展示，可一键复制到本地解释器 / 编译器运行。
 * 依赖：CSC.el / CSC.escapeHtml / CSC.codeLines / CSC.copy
 * ===================================================================== */
(function () {
  'use strict';

  var CSC = window.CSC;
  if (!CSC) {
    console.error('[projects] 必须先加载 app.js');
    return;
  }

  function E(tag, attrs, children) { return CSC.el(tag, attrs, children); }
  function esc(s) { return CSC.escapeHtml(s); }

  var LANG = (CSC.site && CSC.site.lang) || 'text';

  function chapterLabel(id) {
    var m = (CSC.chapterMeta || []).filter(function (x) { return x.id === id; })[0];
    return m ? (m.num + ' ' + m.title) : id;
  }

  function levelStars(lv) {
    var map = { '入门': 1, '基础': 1, '进阶': 2, '提高': 2, '综合': 3, '挑战': 3 };
    var l = typeof lv === 'string' ? (map[lv] || 1) : Math.round(Number(lv) || 1);
    return Math.max(1, Math.min(3, l));
  }
  function levelText(lv) {
    var l = levelStars(lv);
    var out = '';
    for (var i = 1; i <= 3; i++) out += i <= l ? '★' : '☆';
    return out;
  }

  function codeBox(code, caption) {
    var box = E('div', { class: 'codeBox' });
    var head = E('div', { class: 'codeBoxHead' }, [
      E('span', { class: 'codeDots', html: '<i></i><i></i><i></i>' }),
      E('span', { class: 'cbT', html: '<b>' + esc(caption || '示例代码') + '</b>' })
    ]);
    var btn = E('button', {
      class: 'ed-btn', type: 'button', text: '复制',
      style: 'margin-left:auto'
    });
    btn.addEventListener('click', function () {
      CSC.copy(code || '');
      btn.textContent = '已复制';
      setTimeout(function () { btn.textContent = '复制'; }, 1400);
    });
    head.appendChild(btn);
    box.appendChild(head);
    box.appendChild(E('pre', { html: CSC.codeLines(code || '', null, LANG) }));
    return box;
  }

  function taskList(items) {
    var ul = E('div', { class: 'projTasks' });
    (items || []).forEach(function (t, i) {
      ul.appendChild(E('div', { class: 'projTask' }, [
        E('span', { class: 'projTaskN', text: String(i + 1).padStart(2, '0') }),
        E('span', { class: 'projTaskT', html: t })
      ]));
    });
    return ul;
  }

  function bullets(items) {
    var ul = E('div', { class: 'projTasks' });
    (items || []).forEach(function (t) {
      ul.appendChild(E('div', { class: 'projTask' }, [
        E('span', { class: 'projTaskN', text: '·' }),
        E('span', { class: 'projTaskT', html: t })
      ]));
    });
    return ul;
  }

  function collapse(title, build) {
    var det = E('details', { class: 'projCollapse' });
    det.appendChild(E('summary', { class: 'projCollapseHead', html: esc(title) }));
    var body = E('div', { class: 'projCollapseBody' });
    build(body);
    det.appendChild(body);
    return det;
  }

  function section(title, kicker, children) {
    var sec = E('section', { class: 'projSection' });
    sec.appendChild(E('div', { class: 'projSectionT', html: esc(title) }));
    if (kicker) sec.appendChild(E('div', { class: 'projSectionK', html: kicker }));
    (children || []).forEach(function (c) { if (c) sec.appendChild(c); });
    return sec;
  }

  /* ==================================================================
   * 一、项目列表
   * ================================================================== */
  function mountList(host, projects) {
    host.innerHTML = '';
    projects = projects || [];
    var totalMiles = projects.reduce(function (a, p) { return a + (p.milestones || []).length; }, 0);
    var totalMin = projects.reduce(function (a, p) { return a + (Number(p.minutes) || 0); }, 0);

    host.appendChild(E('div', { class: 'projectsIntro' }, [
      E('div', { class: 'piK', text: 'PROJECT_LAB // 项目实战' }),
      E('p', {
        class: 'piT',
        html: '把 ' + String((CSC.chapterMeta || []).length) + ' 章学到的能力拼成完整程序：'
          + '需求拆解、数据与文本处理、文件持久化、命令行输出。每个项目分若干里程碑，'
          + '读需求 → 在本机写代码 → 对照验收标准自查；卡住了可以展开提示，最后对照参考实现。'
      }),
      E('div', { class: 'piStat' }, [
        E('span', { html: '<b>' + projects.length + '</b> 个项目 · <b>' + totalMiles + '</b> 个里程碑 · 约 <b>' + totalMin + '</b> 分钟' })
      ])
    ]));

    var grid = E('div', { class: 'projectsGrid' });
    projects.forEach(function (p) {
      var card = E('a', {
        class: 'projectCard',
        href: '#/projects/' + p.id,
        dataset: { project: p.id }
      }, [
        E('div', { class: 'pcTop' }, [
          E('span', { class: 'pcLevel', text: levelText(p.level), title: '难度 ' + (p.level || '入门') }),
          E('span', { class: 'pcMin', text: '≈' + (p.minutes || 0) + ' min' })
        ]),
        E('div', { class: 'pcTitle', text: p.title }),
        E('div', { class: 'pcEn', text: p.en || '' }),
        E('div', { class: 'pcTag', text: p.tagline || '' }),
        E('div', { class: 'pcChips' }, (p.chapters || []).slice(0, 5).map(function (id) {
          return E('span', { class: 'pcChip', text: chapterLabel(id) });
        })),
        E('div', { class: 'pcProgress' }, [
          E('span', { class: 'pcPct', text: (p.milestones || []).length + ' 个里程碑 · 本地实现' })
        ]),
        E('div', { class: 'pcGo', html: '进入项目 <span class="pcArrow">→</span>' })
      ]);
      grid.appendChild(card);
    });
    host.appendChild(grid);

    host.appendChild(E('div', {
      class: 'learnNote',
      html: 'HOW_IT_WORKS // 每个里程碑给出任务清单、起始代码与验收标准；代码示例为静态展示，'
        + '复制到本地解释器 / 编译器运行。参考实现用于自查，不参与自动判分。'
    }));
  }

  /* ==================================================================
   * 二、项目详情
   * ================================================================== */
  function mountDetail(host, p) {
    host.innerHTML = '';
    if (!p) {
      host.appendChild(E('div', { class: 'learnEmpty' }, [
        E('div', { class: 'learnEmptyT', text: '没有找到这个项目' }),
        E('div', { class: 'learnEmptyD', text: '它可能已被重命名或删除。' }),
        E('a', { class: 'learnEmptyBtn', href: '#/projects', text: '← 返回项目列表' })
      ]));
      return;
    }

    var wrap = E('div', { class: 'projDetail' });
    wrap.appendChild(E('a', {
      class: 'learnEmptyBtn', href: '#/projects', text: '← 返回项目列表',
      style: 'display:inline-block;margin:0 0 18px'
    }));

    wrap.appendChild(E('div', { class: 'projHead' }, [
      E('span', { class: 'pcLevel', text: levelText(p.level) }),
      E('span', { class: 'pcMin', text: '≈' + (p.minutes || 0) + ' min' }),
      E('span', { class: 'pcMin', text: (p.milestones || []).length + ' 个里程碑' })
    ]));
    wrap.appendChild(E('h1', { class: 'projTitle', text: p.title }));
    wrap.appendChild(E('div', { class: 'pcEn', text: p.en || '' }));
    wrap.appendChild(E('p', { class: 'pcTag', text: p.tagline || '', style: 'min-height:0;margin-top:10px' }));

    if (p.chapters && p.chapters.length) {
      var chips = E('div', { class: 'pcChips', style: 'margin:12px 0 4px' });
      p.chapters.forEach(function (id) {
        chips.appendChild(E('a', { class: 'pcChip', href: '#/' + id, text: chapterLabel(id) }));
      });
      wrap.appendChild(chips);
    }

    if (p.intro) wrap.appendChild(E('p', { class: 'blockP', html: p.intro }));

    if (p.goals && p.goals.length) {
      wrap.appendChild(section('目标 · GOALS', '做完这个项目，你应该能：', [bullets(p.goals)]));
    }

    if (p.requirements && p.requirements.length) {
      wrap.appendChild(section('要求 · REQUIREMENTS', '交付前逐条核对：', [taskList(p.requirements)]));
    }

    var miles = p.milestones || [];
    if (miles.length) {
      var mSec = section('里程碑 · MILESTONES', '按顺序推进，每一步都能独立验证。', []);
      miles.forEach(function (m) {
        var box = E('div', { class: 'projMilestone' });
        box.appendChild(E('div', { class: 'projMTop' }, [
          E('span', { class: 'projTaskN', text: String(m.n || 0).padStart(2, '0') }),
          E('div', { class: 'projSectionT', text: m.title || ('里程碑 ' + m.n) })
        ]));
        if (m.tasks && m.tasks.length) box.appendChild(taskList(m.tasks));
        if (m.starter) box.appendChild(codeBox(m.starter, '起始代码'));
        if (m.hints && m.hints.length) {
          box.appendChild(collapse('提示（卡住再看）', function (bd) {
            (m.hints || []).forEach(function (h, i) {
              bd.appendChild(E('p', { class: 'blockP', html: '<b>提示 ' + (i + 1) + '</b>　' + h }));
            });
          }));
        }
        if (m.solution) {
          box.appendChild(collapse('参考实现（先自己写）', function (bd) {
            bd.appendChild(codeBox(m.solution, '参考实现'));
            if (m.explain) bd.appendChild(E('div', { class: 'projSolutionNote', html: m.explain }));
          }));
        } else if (m.explain) {
          box.appendChild(E('div', { class: 'projSolutionNote', html: m.explain }));
        }
        mSec.appendChild(box);
      });
      wrap.appendChild(mSec);
    }

    if (p.extension && p.extension.length) {
      wrap.appendChild(section('扩展 · EXTENSION', '做完基础要求后，再挑战这些：', [bullets(p.extension)]));
    }

    if (p.solutionNote) {
      wrap.appendChild(E('div', { class: 'callout note' }, [
        E('div', { class: 'cb', html: p.solutionNote })
      ]));
    }

    host.appendChild(wrap);
    if (CSC.bus) CSC.bus.emit('projects:mount', p.id);
  }

  CSC.projects = { mountList: mountList, mountDetail: mountDetail };
  if (CSC.bus && CSC.bus.emit) CSC.bus.emit('projects:loaded', CSC.projects);
})();
