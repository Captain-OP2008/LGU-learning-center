/* =====================================================================
 * 计算机科学与 Java 编程导论 · 学习站 · 代码编辑器 + 运行/单步调试面板（editor.js）
 * 职责：把一段 Java 代码变成可编辑、可运行、可单步的交互组件。
 *   - 编辑器：textarea + 高亮覆盖层 + 行号 + Tab 缩进 + 自动补 } + IME 安全
 *   - 运行面板：stdout / 错误（行号 + 中文提示）/ 步数
 *   - 调试面板：变量表 + 调用栈 + 内存图（栈帧 → 引用 → 堆对象）
 * 对外 API（CONTRACT §7.3）：window.CSC.editor = { mount(el, opts) }
 * 依赖：assets/app.css 已定义的 .ed-* / .varTable / .stack* / .mem-* 样式类，
 *       以及 CSC.java（engine.js）。引擎未就绪时监听 'engine:ready'。
 * 作者模块：engine-dev
 * ===================================================================== */
(function () {
  'use strict';

  var CSC = window.CSC;
  if (!CSC) { console.warn('[editor] 需要先加载 app.js'); return; }

  var el = CSC.el;
  var icon = CSC.icon || function () { return ''; };
  var esc = CSC.escapeHtml || function (s) { return String(s == null ? '' : s); };

  var INDENT = '    ';          /* Java 社区惯例：4 个空格一个缩进 */
  var DEFAULT_HEIGHT = 260;
  var AUTO_STEP_MS = 320;       /* 自动单步节奏：快到能看清、慢到跟得上 */

  /* ------------------------------------------------------------------
   * 高亮：优先复用框架提供的 highlightJava（tk-* 类已在 app.css 定义）
   * ------------------------------------------------------------------ */
  function highlight(code) {
    if (typeof CSC.highlightJava === 'function') return CSC.highlightJava(code);
    return esc(code);
  }

  /* ------------------------------------------------------------------
   * 小工具
   * ------------------------------------------------------------------ */
  function lineHeightInfo(area) {
    var cs = window.getComputedStyle(area);
    var lh = parseFloat(cs.lineHeight);
    if (!isFinite(lh)) lh = parseFloat(cs.fontSize) * 1.62;
    return {
      line: lh,
      padTop: parseFloat(cs.paddingTop) || 0,
      padLeft: parseFloat(cs.paddingLeft) || 0
    };
  }

  /** 把值格式化成变量表里显示的文本（引用类型显示成 #1） */
  function valueText(v) {
    if (!v) return 'null';
    if (v.type === 'ref') return v.display || v.ref;
    return v.display != null ? v.display : String(v.value);
  }

  function isRefValue(v) { return v && v.type === 'ref'; }

  /* ------------------------------------------------------------------
   * 代码导出：把当前编辑区内容下载为 .java（文件名取 public class 名，默认 Main.java）
   * Blob + <a download>，纯前端、file:// 亦可用；下载不可用时降级复制到剪贴板。
   * ------------------------------------------------------------------ */
  function javaFileName(code) {
    var m = String(code || '').match(/\bclass\s+([A-Za-z_$][\w$]*)/);
    return (m ? m[1] : 'Main') + '.java';
  }

  function exportJava(code) {
    var src = String(code == null ? '' : code);
    var name = javaFileName(src);
    var ok = false;
    try {
      if (typeof Blob === 'function' && window.URL && URL.createObjectURL) {
        var blob = new Blob([src], { type: 'text/x-java-source;charset=utf-8' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = name;
        a.rel = 'noopener';
        a.style.cssText = 'position:fixed;left:-9999px;top:0';
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
          try { URL.revokeObjectURL(url); } catch (e) {}
          if (a.parentNode) a.parentNode.removeChild(a);
        }, 5000);
        ok = true;
      }
    } catch (e) {
      ok = false;
    }
    if (ok) {
      if (CSC.toast) CSC.toast('已导出 ' + name, 'ok');
    } else {
      if (CSC.copy) CSC.copy(src);
      if (CSC.toast) CSC.toast('下载不可用，已把代码复制到剪贴板', 'warn');
    }
  }

  /* ------------------------------------------------------------------
   * mount：构建整个编辑器面板
   * ------------------------------------------------------------------ */
  function mount(host, opts) {
    opts = opts || {};
    if (!host) return null;

    var state = {
      code: String(opts.code == null ? '' : opts.code),
      stdin: typeof opts.stdin === 'string' ? opts.stdin : '',
      session: null,        /* 单步会话 */
      snap: null,           /* 最近一个内存快照 */
      stepCount: 0,
      autoTimer: null,
      composing: false,
      running: false,
      finished: false,
      destroyed: false,
      result: null,
      lastErrorLine: 0,
      syntaxErrorLine: 0,
      syntaxTimer: null
    };

    host.innerHTML = '';

    /* -------- 根容器 -------- */
    var root = el('div', { class: 'ed' + (opts.trace ? ' traceMode' : '') });

    /* -------- 工具栏 -------- */
    var toolbar = el('div', { class: 'ed-toolbar' });
    var cap = el('span', { class: 'ed-cap', html: opts.caption ? '<b>' + esc(opts.caption) + '</b>' : '<b>Java</b>' });
    toolbar.appendChild(cap);

    var btnRun = el('button', { class: 'ed-btn primary', type: 'button', html: icon('play') + '<span>运行</span>', title: '运行（Ctrl/⌘ + Enter）' });
    var btnStep = el('button', { class: 'ed-btn', type: 'button', html: icon('step') + '<span>单步</span>', title: '执行下一条语句' });
    var btnAuto = el('button', { class: 'ed-btn', type: 'button', html: icon('play') + '<span>自动</span>', title: '连续单步（再点一次暂停）' });
    var btnReset = el('button', { class: 'ed-btn', type: 'button', html: icon('reset') + '<span>重置</span>', title: '回到未执行状态' });
    var btnCopy = el('button', { class: 'ed-btn', type: 'button', html: icon('copy') + '<span>复制</span>', title: '复制代码' });
    var btnExport = el('button', { class: 'ed-btn', type: 'button', html: '<span>⤓ 导出 .java</span>', title: '把当前代码下载成 .java 文件（文件名取 class 名）' });

    if (opts.run !== false) toolbar.appendChild(btnRun);
    if (opts.trace) {
      toolbar.appendChild(btnStep);
      toolbar.appendChild(btnAuto);
      toolbar.appendChild(btnReset);
    }
    toolbar.appendChild(btnCopy);
    toolbar.appendChild(btnExport);
    root.appendChild(toolbar);

    /* -------- 编辑区 -------- */
    var main = el('div', { class: 'ed-main' });
    var gutter = el('div', { class: 'ed-gutter' });
    var scroll = el('div', { class: 'ed-scroll' });
    /* 当前执行行的高亮条：放在高亮层下面、textarea 上面，只画背景不影响文字 */
    var curLine = el('div');
    curLine.className = 'ed-curLine';
    var hl = el('div', { class: 'ed-hl', 'aria-hidden': 'true' });
    var area = el('textarea', {
      class: 'ed-area',
      spellcheck: 'false',
      autocomplete: 'off',
      autocapitalize: 'off',
      autocorrect: 'off',
      'aria-label': 'Java 代码编辑器'
    });
    area.setAttribute('wrap', 'off');
    scroll.appendChild(curLine);
    scroll.appendChild(hl);
    scroll.appendChild(area);
    main.appendChild(gutter);
    main.appendChild(scroll);
    root.appendChild(main);
    curLine.style.cssText = 'position:absolute;left:0;right:0;pointer-events:none;display:none;'
      + 'background:var(--accentSoft2);border-left:2px solid var(--accent);z-index:0;';

    /* -------- STDIN 输入（Scanner 示例用；复用已有 qzTextarea / ed-out 样式） -------- */
    var stdinArea = null;
    var needStdin = (typeof opts.stdin === 'string') || /new\s+Scanner\s*\(/.test(String(opts.code || ''));
    if (needStdin) {
      var stdinBox = el('div', { class: 'ed-out' });
      var btnRestore = el('button', { class: 'ed-btn', type: 'button', html: '<span>恢复示例输入</span>', title: '把输入恢复成示例给出的值' });
      var stdinHead = el('div', { class: 'ed-outHead' }, [
        el('span', { text: 'STDIN · 程序输入' }),
        el('span', { class: 'st', text: 'Scanner 会按行读取这里的内容' }),
        btnRestore
      ]);
      stdinArea = el('textarea', {
        class: 'qzTextarea', spellcheck: 'false', rows: '3',
        'aria-label': '程序标准输入（Scanner 读取这里的内容）'
      });
      stdinArea.value = typeof opts.stdin === 'string' ? opts.stdin : '';
      stdinBox.appendChild(stdinHead);
      stdinBox.appendChild(stdinArea);
      root.appendChild(stdinBox);
      btnRestore.addEventListener('click', function () {
        stdinArea.value = typeof opts.stdin === 'string' ? opts.stdin : '';
        state.stdin = stdinArea.value;
      });
      stdinArea.addEventListener('input', function () { state.stdin = stdinArea.value; });
    }

    /* -------- 输出区 -------- */
    var out = el('div', { class: 'ed-out' });
    var outHead = el('div', { class: 'ed-outHead' }, [
      el('span', { text: 'OUTPUT · 输出' }),
      el('span', { class: 'st', text: '' })
    ]);
    var outBody = el('pre', { class: 'ed-outBody empty', text: '点「运行」查看程序输出' });
    var errBox = el('div', { class: 'ed-err' });
    errBox.hidden = true;
    out.appendChild(outHead);
    out.appendChild(outBody);
    out.appendChild(errBox);
    root.appendChild(out);

    /* -------- 调试面板（trace 模式） -------- */
    var debug = null, dbgBar = null, stepTxt = null, varPanel = null, staticPanel = null, stackPanel = null, memPanel = null;
    if (opts.trace) {
      debug = el('div', { class: 'ed-debug' });
      dbgBar = el('div', { class: 'ed-dbgBar' });
      var dRun = el('button', { class: 'ed-btn', type: 'button', html: icon('play') + '<span>直接运行完成</span>' });
      var dStep = el('button', { class: 'ed-btn', type: 'button', html: icon('step') + '<span>单步</span>' });
      var dAuto = el('button', { class: 'ed-btn', type: 'button', html: icon('play') + '<span>自动</span>' });
      var dReset = el('button', { class: 'ed-btn', type: 'button', html: icon('reset') + '<span>重置</span>' });
      stepTxt = el('span', { class: 'stepTxt', text: '准备就绪' });
      dbgBar.appendChild(dRun);
      dbgBar.appendChild(dStep);
      dbgBar.appendChild(dAuto);
      dbgBar.appendChild(dReset);
      dbgBar.appendChild(stepTxt);

      var dbgBody = el('div', { class: 'ed-dbgBody' });
      var pLeft = el('div', { class: 'ed-panel' });
      pLeft.appendChild(el('div', { class: 'ed-panelT', html: icon('list') + '<span>变量 VARIABLES</span>' }));
      varPanel = el('div');
      pLeft.appendChild(varPanel);
      pLeft.appendChild(el('div', { class: 'ed-panelT', html: icon('layers') + '<span>静态字段 STATIC</span>' }));
      staticPanel = el('div');
      pLeft.appendChild(staticPanel);
      pLeft.appendChild(el('div', { class: 'ed-panelT', html: icon('layers') + '<span>调用栈 CALL STACK</span>' }));
      stackPanel = el('div');
      pLeft.appendChild(stackPanel);
      var pRight = el('div', { class: 'ed-panel' });
      pRight.appendChild(el('div', { class: 'ed-panelT', html: icon('memory') + '<span>内存 MEMORY</span>' }));
      memPanel = el('div');
      pRight.appendChild(memPanel);
      dbgBody.appendChild(pLeft);
      dbgBody.appendChild(pRight);
      debug.appendChild(dbgBar);
      debug.appendChild(dbgBody);
      root.appendChild(debug);

      /* 调试面板里的按钮和工具栏按钮行为一致，绑定同一批动作 */
      dRun.addEventListener('click', function () { runAll(); });
      dStep.addEventListener('click', function () { stepOnce(); });
      dAuto.addEventListener('click', function (e) { toggleAuto(e.currentTarget); });
      dReset.addEventListener('click', function () { resetDebug(); });
    }

    host.appendChild(root);

    /* ==================================================================
     * 高亮 / 行号 / 滚动同步
     * ================================================================== */

    function syncGutter() {
      var lines = area.value.split('\n').length;
      var cur = state.snap && state.snap.line ? state.snap.line : 0;
      var errLine = state.lastErrorLine || state.syntaxErrorLine || 0;
      var sig = lines + '|' + cur + '|' + errLine;
      if (gutter.childNodes.length === lines && gutter.__sig === sig) {
        gutter.style.height = (area.offsetHeight || 0) + 'px';
        return;
      }
      gutter.__sig = sig;
      var frag = document.createDocumentFragment();
      for (var i = 1; i <= lines; i++) {
        var sp = document.createElement('span');
        sp.textContent = (i === errLine ? '⚠' : '') + String(i);
        if (i === cur) sp.className = 'cur';
        if (i === errLine) sp.title = '这一行有错误';
        frag.appendChild(sp);
      }
      gutter.innerHTML = '';
      gutter.appendChild(frag);
      /* gutter 高度固定成编辑区高度，超出部分裁掉，再靠 transform 跟随纵向滚动 */
      gutter.style.height = (area.offsetHeight || 0) + 'px';
    }

    function refreshHighlight() {
      hl.innerHTML = highlight(area.value) + '\n';
      layoutHighlight();
    }

    /**
     * 高亮层要"比可视区大"，否则滚动后盒子一起平移，底部几行的高亮文字会被裁掉。
     * 这里把它撑成内容尺寸，再用 transform 跟随滚动 —— 文字与 textarea 严格对齐。
     */
    function layoutHighlight() {
      var info = lineHeightInfo(area);
      var lines = area.value.split('\n').length;
      var w = Math.max(area.scrollWidth || 0, area.clientWidth || 0, 40);
      var h = Math.ceil(lines * info.line + info.padTop * 2 + 4);
      hl.style.inset = 'auto';
      hl.style.top = '0';
      hl.style.left = '0';
      hl.style.width = w + 'px';
      hl.style.height = h + 'px';
    }

    function syncScroll() {
      hl.style.transform = 'translate(' + (-area.scrollLeft) + 'px,' + (-area.scrollTop) + 'px)';
      gutter.style.transform = 'translateY(' + (-area.scrollTop) + 'px)';
      positionCurLine();
    }

    /** 行高亮条位置：跟随滚动与当前执行行 */
    function positionCurLine() {
      if (!state.snap || !state.snap.line) { curLine.style.display = 'none'; return; }
      var info = lineHeightInfo(area);
      var line = state.snap.line;
      var lines = area.value.split('\n');
      if (line < 1 || line > lines.length) { curLine.style.display = 'none'; return; }
      curLine.style.display = 'block';
      curLine.style.top = (info.padTop + (line - 1) * info.line - area.scrollTop) + 'px';
      curLine.style.height = info.line + 'px';
    }

    /** 单步时把当前行滚进可视区（太远才滚，避免画面跳动） */
    function revealLine(line) {
      var info = lineHeightInfo(area);
      var top = info.padTop + (line - 1) * info.line;
      var viewTop = area.scrollTop;
      var viewBottom = area.scrollTop + area.clientHeight;
      if (top < viewTop + info.line) area.scrollTop = Math.max(0, top - info.padTop);
      else if (top + info.line > viewBottom - info.line) area.scrollTop = top + info.line * 2 - area.clientHeight;
      syncScroll();
    }

    function refreshAll() {
      refreshHighlight();
      syncGutter();
      syncScroll();
    }

    /* ==================================================================
     * 编辑行为：Tab / Enter 缩进 / 自动补 } / 输入法
     * ================================================================== */

    /** 统一的插入实现：优先 execCommand（保留浏览器撤销栈），失败时退回 setRangeText */
    function insertText(text) {
      area.focus();
      var okCmd = false;
      try {
        okCmd = document.execCommand('insertText', false, text);
      } catch (e) { okCmd = false; }
      if (!okCmd) {
        var s = area.selectionStart, e2 = area.selectionEnd;
        area.setRangeText(text, s, e2, 'end');
        onInput();
      }
    }

    function handleTab(isShift) {
      var value = area.value;
      var start = area.selectionStart, end = area.selectionEnd;

      /* 单光标且不反缩进：直接插入 4 个空格 */
      if (!isShift && start === end) {
        insertText(INDENT);
        return;
      }
      /* 处理光标所在的一整段行（多行选区整体缩进/反缩进） */
      var lineStart = value.lastIndexOf('\n', start - 1) + 1;
      var lineEnd = value.indexOf('\n', end);
      if (lineEnd < 0) lineEnd = value.length;
      var chunk = value.slice(lineStart, lineEnd);
      var lines = chunk.split('\n');
      var newLines = lines.map(function (ln) {
        if (isShift) return ln.replace(/^ {1,4}/, '');
        return INDENT + ln;
      });
      var replaced = newLines.join('\n');
      if (replaced === chunk) return;
      area.setRangeText(replaced, lineStart, lineEnd, 'preserve');
      /* 尽量让选区跟着移动，保持"还选中原来那几行"的手感 */
      var delta = replaced.length - chunk.length;
      if (end > start) {
        area.setSelectionRange(Math.max(lineStart, start + (isShift ? Math.min(0, delta) : delta) - (isShift ? 0 : 0)),
          Math.max(lineStart, end + delta));
      }
      onInput();
    }

    area.addEventListener('keydown', function (e) {
      /* 中文输入法组词期间不要拦截任何按键，否则候选框会被打断 */
      if (state.composing || e.isComposing || e.keyCode === 229) return;

      if ((e.ctrlKey || e.metaKey) && (e.key === 'Enter' || e.keyCode === 13)) {
        e.preventDefault();
        if (opts.run !== false) runAll();
        return;
      }
      if (e.key === 'Tab') {
        e.preventDefault();
        handleTab(e.shiftKey);
        return;
      }
      if (e.key === 'Enter') {
        /* 回车后沿用上一行缩进；如果上一行以 { 结尾，再多缩进一级 */
        e.preventDefault();
        var value = area.value;
        var pos = area.selectionStart;
        var lineStart = value.lastIndexOf('\n', pos - 1) + 1;
        var lineText = value.slice(lineStart, pos);
        var m = /^[ \t]*/.exec(lineText);
        var indent = m ? m[0] : '';
        var trimmed = lineText.replace(/[ \t]+$/, '');
        var last = trimmed.charAt(trimmed.length - 1);
        var extra = (last === '{' || last === '(') ? INDENT : '';
        if (area.selectionStart !== area.selectionEnd) {
          /* 有选区时回车 = 删除选区再缩进 */
          insertText('\n' + indent + extra);
        } else {
          insertText('\n' + indent + extra);
        }
        return;
      }
      if (e.key === '{') {
        /* 自动补右花括号，并把光标放中间 —— 初学者最常漏的就是 } */
        e.preventDefault();
        var s0 = area.selectionStart, e0 = area.selectionEnd;
        insertText('{}');
        if (s0 === e0) {
          var p = s0 + 1;
          area.setSelectionRange(p, p);
        }
        onInput();
        return;
      }
      if (e.key === '}') {
        /* 下一个字符已经是 } 时，直接跳过而不是再插一个 */
        var next = area.value.charAt(area.selectionStart);
        if (next === '}' && area.selectionStart === area.selectionEnd) {
          e.preventDefault();
          area.setSelectionRange(area.selectionStart + 1, area.selectionStart + 1);
          syncScroll();
        }
        return;
      }
      if (e.key === '"' || e.key === "'") {
        var nxt = area.value.charAt(area.selectionStart);
        if (nxt === e.key && area.selectionStart === area.selectionEnd) {
          e.preventDefault();
          area.setSelectionRange(area.selectionStart + 1, area.selectionStart + 1);
        }
      }
    });

    /* 输入法：组词期间不重绘高亮，避免候选框被打断 */
    area.addEventListener('compositionstart', function () { state.composing = true; });
    area.addEventListener('compositionend', function () {
      state.composing = false;
      onInput();
    });

    function onInput() {
      if (state.composing) return;
      state.code = area.value;
      refreshHighlight();
      syncGutter();
      syncScroll();
      scheduleSyntaxCheck();
      if (typeof opts.onChange === 'function') {
        try { opts.onChange(area.value); } catch (e) { console.warn('[editor] onChange 报错', e); }
      }
    }

    /** 输入停顿后跑一次语法检查：gutter 标 ⚠ + 状态栏给中文提示（不执行程序） */
    function scheduleSyntaxCheck() {
      state.syntaxErrorLine = 0;
      if (!CSC.java || typeof CSC.java.parse !== 'function') return;
      clearTimeout(state.syntaxTimer);
      state.syntaxTimer = setTimeout(function () {
        if (state.destroyed) return;
        var r = CSC.java.parse(area.value);
        var line = r.ok ? 0 : ((r.error && r.error.line) || 0);
        state.syntaxErrorLine = line;
        if (r.ok) { state.lastErrorLine = 0; }
        syncGutter();
        if (!state.running && !state.finished) {
          if (r.ok) setStatus('');
          else setStatus('⚠ 语法错误 · 第 ' + line + ' 行：' + r.error.message);
        }
      }, 260);
    }
    area.addEventListener('input', onInput);
    area.addEventListener('scroll', syncScroll);
    window.addEventListener('resize', onResize);

    function onResize() { syncGutter(); syncScroll(); }

    /* ==================================================================
     * 运行结果渲染
     * ================================================================== */
    function setStatus(text) {
      var st = outHead.querySelector('.st');
      if (st) st.textContent = text || '';
    }

    function renderOutput(result, elapsed) {
      state.result = result;
      outBody.textContent = result.output || '';
      outBody.classList.toggle('empty', !result.output);
      if (!result.output) {
        outBody.textContent = result.ok ? '（程序没有产生任何输出）' : '（程序没有输出）';
      }
      if (result.error) renderError(result.error);
      else { errBox.hidden = true; errBox.innerHTML = ''; }

      var st = '步数 ' + result.steps;
      if (typeof elapsed === 'number') st += ' · ' + elapsed + 'ms';
      st += result.ok ? ' · ✓ 执行完成' : ' · ✗ 执行中断';
      setStatus(st);

      if (result.error && result.error.line) {
        state.lastErrorLine = result.error.line;
        /* ED2：出错时不要清空变量/内存面板——回放一次（只带快照）取到"案发现场" */
        var snapAtError = opts.trace ? captureErrorSnapshot(result) : null;
        if (snapAtError) {
          state.snap = snapAtError;
          state.stepCount = result.steps;
          if (opts.trace) renderDebug();
        }
        revealLine(result.error.line);
        syncGutter();
        positionCurLine();
      }
      if (typeof opts.onResult === 'function') {
        try { opts.onResult(result); } catch (e) { console.warn('[editor] onResult 报错', e); }
      }
    }

    function renderError(err) {
      errBox.hidden = false;
      errBox.innerHTML = '';
      var head = el('div', { class: 'eh' });
      if (err.stage === 'runtime') {
        head.textContent = 'Exception in thread "main" ' + err.type + (err.message ? ': ' + err.message : '');
      } else {
        head.textContent = '编译错误 · 第 ' + err.line + ' 行' + (err.type ? ' · ' + err.type : '');
      }
      errBox.appendChild(head);
      var detail = el('div');
      if (err.stage === 'runtime') {
        detail.textContent = '\tat line ' + err.line;
      } else {
        detail.textContent = err.message;
      }
      errBox.appendChild(detail);
      if (err.hint) {
        var hint = el('span', { class: 'ehint' });
        hint.innerHTML = '<b>提示：</b>' + esc(err.hint);
        errBox.appendChild(hint);
      }
    }

    function setBusy(busy) {
      state.running = busy;
      [btnRun, btnStep, btnAuto, btnReset].forEach(function (b) {
        if (b) b.disabled = busy;
      });
    }

    /**
     * 出错后回放一次带快照的执行，拿到抛异常前最后一帧（变量/调用栈/内存）。
     * 只在错误路径调用；步数过大（>6 万步）时放弃，避免把页面卡住。
     */
    function captureErrorSnapshot(result) {
      var java = CSC.java;
      if (!java || !result || result.steps > 60000) return null;
      try {
        var s = java.session(area.value, engineOpts({ snapshots: true }));
        var snap = null, r, guard = 0;
        while (guard++ < 200000) {
          r = s.step();
          if (r.done) break;
          snap = r.snapshot;
        }
        return snap;
      } catch (e) {
        return null;
      }
    }

    /* ==================================================================
     * 运行（一次性）
     * ================================================================== */

    /** 引擎未就绪时：记住这次请求，等 engine:ready 后自动补跑 */
    function requireEngine() {
      if (CSC.java) return CSC.java;
      state.pendingRun = true;
      if (CSC.toast) CSC.toast('代码引擎正在加载，就绪后自动运行…', '');
      return null;
    }

    function engineOpts(extra) {
      var o = {
        args: opts.args || [],
        stdin: stdinArea ? stdinArea.value : state.stdin,
        maxSteps: 1000000,
        timeoutMs: 4000,
        snapshots: false
      };
      if (extra) { for (var k in extra) { if (Object.prototype.hasOwnProperty.call(extra, k)) o[k] = extra[k]; } }
      return o;
    }

    function runAll() {
      /* 正在自动单步时点"运行"：先停自动，再完整运行（不是直接吞掉这次点击） */
      stopAuto();
      var java = requireEngine();
      if (!java) return;
      setBusy(true);
      var t0 = Date.now();
      var result;
      try {
        result = java.run(area.value, engineOpts());
      } catch (e) {
        result = { ok: false, output: '', steps: 0, error: { stage: 'runtime', type: 'EngineCrash', message: String(e && e.message || e), line: 1, hint: '引擎异常，请把代码发给老师' } };
      }
      var elapsed = Date.now() - t0;
      setBusy(false);
      renderOutput(result, elapsed);
      /* trace 模式下：成功时回到"第一帧"等学生单步；失败时保留出错现场（ED2），不覆盖成空快照 */
      if (opts.trace) {
        state.session = null;
        state.lastErrorLine = result.error && result.error.line ? result.error.line : 0;
        if (!result.error) {
          state.snap = null;
          state.stepCount = 0;
          createAndPeek();
        } else if (!state.snap) {
          createAndPeek();
        }
      }
    }

    /* ==================================================================
     * 单步调试
     * ================================================================== */
    function createSession() {
      stopAuto();
      var java = requireEngine();
      if (!java) return false;
      /* 单步/调试必须生成快照；一次性运行才关掉（性能） */
      state.session = java.session(area.value, engineOpts({ snapshots: true }));
      state.snap = null;
      state.stepCount = 0;
      state.finished = false;
      return true;
    }

    function ensureSession() {
      if (!state.session) {
        if (!createSession()) return false;
        /* 第一次单步：先取到 main 第一条语句前的快照 */
        var first = state.session.step();
        if (first.done) {
          finishSession(first.result);
          return false;
        }
        state.snap = first.snapshot;
        state.stepCount = 1;
        renderDebug();
        revealLine(state.snap.line);
        return true;
      }
      return true;
    }

    function stepOnce() {
      if (stopAuto()) return;
      if (!ensureSession()) return;
      var r = state.session.step();
      if (r.done) { finishSession(r.result); return; }
      state.snap = r.snapshot;
      state.stepCount++;
      renderDebug();
      revealLine(state.snap.line);
    }

    function toggleAuto(btn) {
      if (state.autoTimer) { stopAuto(); return; }
      if (!ensureSession(true)) return;
      renderDebug();
      state.autoTimer = setInterval(function () {
        if (!state.session) { stopAuto(); return; }
        var r = state.session.step();
        if (r.done) { finishSession(r.result); stopAuto(); return; }
        state.snap = r.snapshot;
        state.stepCount++;
        renderDebug();
        revealLine(state.snap.line);
      }, AUTO_STEP_MS);
    }

    function stopAuto() {
      if (state.autoTimer) {
        clearInterval(state.autoTimer);
        state.autoTimer = null;
        return true;
      }
      return false;
    }

    function finishSession(result) {
      state.finished = true;
      state.session = null;
      renderOutput(result);
      if (opts.trace) {
        if (stepTxt) stepTxt.textContent = '执行结束（共 ' + result.steps + ' 步）';
        renderDebug();
      }
    }

    function resetDebug() {
      stopAuto();
      state.session = null;
      state.snap = null;
      state.stepCount = 0;
      state.finished = false;
      state.lastErrorLine = 0;
      setBusy(false);
      if (opts.trace) {
        if (stepTxt) stepTxt.textContent = '已重置';
        renderDebug();
        createAndPeek();
      }
      errBox.hidden = true;
      errBox.innerHTML = '';
      outBody.textContent = '（等待运行）';
      outBody.classList.add('empty');
      outBody.classList.toggle('empty', true);
      setStatus('');
      curLine.style.display = 'none';
      syncGutter();
      syncScroll();
    }

    /** 重置后自动把会话准备好、显示第一帧（trace 块打开即可见） */
    function createAndPeek() {
      if (!createSession()) return;
      var r = state.session.step();
      if (r.done) { finishSession(r.result); return; }
      state.snap = r.snapshot;
      state.stepCount = 1;
      renderDebug();
    }

    /* ==================================================================
     * 调试面板渲染
     * ================================================================== */
    function renderDebug() {
      if (!opts.trace) return;
      var snap = state.snap;
      if (!snap) {
        if (stepTxt) stepTxt.textContent = '点「单步」开始逐行执行';
        varPanel.innerHTML = '';
        varPanel.appendChild(el('div', { class: 'varEmpty', text: '还没有变量（执行第一条语句前）' }));
        if (staticPanel) {
          staticPanel.innerHTML = '';
          staticPanel.appendChild(el('div', { class: 'varEmpty', text: '还没有静态字段' }));
        }
        stackPanel.innerHTML = '';
        stackPanel.appendChild(el('div', { class: 'varEmpty', text: '调用栈为空' }));
        memPanel.innerHTML = '';
        memPanel.appendChild(el('div', { class: 'memEmpty', text: '点「单步」查看内存变化' }));
        return;
      }
      if (stepTxt) {
        stepTxt.textContent = '第 ' + state.stepCount + ' 步 · 即将执行第 ' + snap.line + ' 行'
          + (snap.frames.length > 1 ? ' · 栈深 ' + snap.frames.length : '');
      }
      renderVars(snap);
      renderStatics(snap);
      renderStack(snap);
      renderMemory(snap);
      curLine.style.display = '';
      positionCurLine();
      syncGutter();
    }

    function renderVars(snap) {
      varPanel.innerHTML = '';
      var top = snap.frames.length ? snap.frames[snap.frames.length - 1] : null;
      if (!top || (!top.localOrder || !top.localOrder.length) && !top.thisRef) {
        varPanel.appendChild(el('div', { class: 'varEmpty', text: '当前方法还没有局部变量' }));
        return;
      }
      var table = el('table', { class: 'varTable' });
      /* this：实例方法里最重要却最容易被忽略的引用 */
      if (top.thisRef) {
        var th = el('tr');
        th.appendChild(el('td', { class: 'vn', text: 'this' }));
        th.appendChild(el('td', { class: 'vt', text: top.cls }));
        th.appendChild(el('td', { class: 'vv ref', text: '→ ' + top.thisRef }));
        table.appendChild(th);
      }
      (top.localOrder || []).forEach(function (name) {
        var v = top.locals[name];
        var tr = el('tr');
        tr.appendChild(el('td', { class: 'vn', text: name }));
        tr.appendChild(el('td', { class: 'vt', text: v.decl || v.type }));
        var cls = 'vv' + (v.changed ? ' changed' : '') + (isRefValue(v) ? ' ref' : '');
        tr.appendChild(el('td', { class: cls, text: isRefValue(v) ? '→ ' + v.ref : valueText(v) }));
        table.appendChild(tr);
      });
      varPanel.appendChild(table);
    }

    /** 静态字段面板：static 计数器（C.total）在变量表里本来完全看不到 */
    function renderStatics(snap) {
      if (!staticPanel) return;
      staticPanel.innerHTML = '';
      var list = snap.statics || [];
      if (!list.length) {
        staticPanel.appendChild(el('div', { class: 'varEmpty', text: '还没有静态字段' }));
        return;
      }
      var table = el('table', { class: 'varTable' });
      list.forEach(function (v) {
        var tr = el('tr');
        tr.appendChild(el('td', { class: 'vn', text: (v.cls ? v.cls + '.' : '') + v.name }));
        tr.appendChild(el('td', { class: 'vt', text: v.decl || v.type }));
        var cls = 'vv' + (v.changed ? ' changed' : '') + (isRefValue(v) ? ' ref' : '');
        tr.appendChild(el('td', { class: cls, text: isRefValue(v) ? '→ ' + v.ref : valueText(v) }));
        table.appendChild(tr);
      });
      staticPanel.appendChild(table);
    }

    function renderStack(snap) {
      stackPanel.innerHTML = '';
      if (!snap.frames.length) {
        stackPanel.appendChild(el('div', { class: 'varEmpty', text: '调用栈为空' }));
        return;
      }
      var list = el('div', { class: 'stackList' });
      /* 调用栈习惯上把"当前帧"放最上面，所以从后往前渲染 */
      for (var i = snap.frames.length - 1; i >= 0; i--) {
        var f = snap.frames[i];
        var isTop = i === snap.frames.length - 1;
        var box = el('div', { class: 'stackFrame' + (isTop ? ' top' : '') });
        box.appendChild(el('span', { class: 'sfn', text: f.cls + '.' + f.name + '()' }));
        box.appendChild(el('span', { class: 'sfl', text: '  line ' + (isTop ? f.line : f.callLine || f.line) }));
        var parts = [];
        (f.localOrder || []).forEach(function (n2) {
          var vv = f.locals[n2];
          parts.push(n2 + ' = ' + (isRefValue(vv) ? vv.ref : valueText(vv)));
        });
        if (parts.length) box.appendChild(el('div', { class: 'sfv', text: parts.join('  ') }));
        list.appendChild(box);
      }
      stackPanel.appendChild(list);
    }

    function renderMemory(snap) {
      memPanel.innerHTML = '';
      var wrap = el('div');
      wrap.style.cssText = 'position:relative;';
      var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('class', 'memLinks');
      svg.style.cssText = 'position:absolute;inset:0;pointer-events:none;overflow:visible;z-index:0;';
      var mem = el('div', { class: 'mem' });

      /* ----- 左列：栈（每一帧的局部变量） ----- */
      var stackCol = el('div', { class: 'memCol' });
      stackCol.appendChild(el('div', { class: 'memColT', text: '栈 STACK' }));
      var stackList = el('div', { class: 'memStack' });
      snap.frames.forEach(function (f, idx) {
        var isTop = idx === snap.frames.length - 1;
        var frameBox = el('div', { class: 'memFrame' + (isTop ? ' top' : '') });
        var head = el('div', { class: 'memFrameH' });
        head.appendChild(el('b', { text: f.cls + '.' + f.name + '()' }));
        head.appendChild(el('span', { class: 'ml', text: (isTop ? '▶ line ' + f.line : 'line ' + (f.callLine || f.line)) }));
        frameBox.appendChild(head);
        var vars = el('div', { class: 'memVars' });
        if (f.thisRef) {
          var thisRow = el('div', { class: 'memVar' });
          thisRow.appendChild(el('span', { class: 'mn', text: 'this' }));
          thisRow.appendChild(el('span', { class: 'mty', text: f.cls }));
          thisRow.appendChild(el('span', { class: 'mref', dataset: { ref: f.thisRef }, text: '→ ' + f.thisRef }));
          vars.appendChild(thisRow);
        }
        if (!f.localOrder || !f.localOrder.length) {
          if (!f.thisRef) vars.appendChild(el('div', { class: 'memEmpty', text: '（无局部变量）' }));
        } else {
          f.localOrder.forEach(function (name) {
            var v = f.locals[name];
            var row = el('div', { class: 'memVar' + (v.changed ? ' changed' : '') });
            row.appendChild(el('span', { class: 'mn', text: name }));
            row.appendChild(el('span', { class: 'mty', text: v.decl || v.type }));
            if (isRefValue(v)) {
              row.appendChild(el('span', { class: 'mref', dataset: { ref: v.ref }, text: '→ ' + v.ref }));
            } else {
              row.appendChild(el('span', { class: 'mv', text: valueText(v) }));
            }
            vars.appendChild(row);
          });
        }
        frameBox.appendChild(vars);
        stackList.appendChild(frameBox);
      });
      if (!snap.frames.length) stackList.appendChild(el('div', { class: 'memEmpty', text: '（还没有栈帧）' }));
      stackCol.appendChild(stackList);

      /* ----- 右列：堆对象 ----- */
      var heapCol = el('div', { class: 'memCol' });
      heapCol.appendChild(el('div', { class: 'memColT', text: '堆 HEAP' }));
      var heapList = el('div', { class: 'memHeap' });
      snap.heap.forEach(function (o) {
        var objBox = el('div', { class: 'memObj', dataset: { oid: o.id } });
        var head2 = el('div', { class: 'memObjH' });
        head2.appendChild(el('span', { class: 'oid', text: o.id }));
        head2.appendChild(el('span', { text: o.type }));
        if (o.kind === 'array' || o.kind === 'list' || o.kind === 'set') {
          head2.appendChild(el('span', { text: ' · ' + o.elements.length + ' 个元素' }));
        }
        objBox.appendChild(head2);

        if (o.kind === 'array' || o.kind === 'list' || o.kind === 'set') {
          var arr = el('div', { class: 'memArr' });
          o.elements.forEach(function (e) {
            var cell = el('div', { class: 'memCell' + (e.changed ? ' changed' : '') });
            if (isRefValue(e)) {
              cell.textContent = e.ref;
              cell.dataset.ref = e.ref;
              cell.title = '引用 ' + e.ref;
            } else {
              cell.textContent = valueText(e);
            }
            arr.appendChild(cell);
          });
          if (!o.elements.length) arr.appendChild(el('div', { class: 'memEmpty', text: '（空）' }));
          objBox.appendChild(arr);
          if (o.kind === 'array') {
            var idxRow = el('div', { class: 'memIdx' });
            o.elements.forEach(function (_, i) { idxRow.appendChild(el('span', { text: String(i) })); });
            objBox.appendChild(idxRow);
          }
        } else if (o.kind === 'map' && o.entries) {
          var mfields = el('div', { class: 'memFields' });
          o.entries.forEach(function (ent) {
            var row = el('div', { class: 'memField' + ((ent.key.changed || ent.val.changed) ? ' changed' : '') });
            row.appendChild(el('span', { class: 'fn2', text: valueText(ent.key) }));
            row.appendChild(el('span', { text: '→' }));
            row.appendChild(el('span', { class: 'fv', text: valueText(ent.val) }));
            mfields.appendChild(row);
          });
          if (!o.entries.length) mfields.appendChild(el('div', { class: 'memEmpty', text: '（空）' }));
          objBox.appendChild(mfields);
        } else {
          var fields = el('div', { class: 'memFields' });
          var order = o.fieldOrder || Object.keys(o.fields || {});
          order.forEach(function (fn) {
            var fv = o.fields[fn];
            if (!fv) return;
            var row2 = el('div', { class: 'memField' + (fv.changed ? ' changed' : '') });
            row2.appendChild(el('span', { class: 'fn2', text: fn }));
            if (isRefValue(fv)) {
              var tag = el('span', { class: 'fv', text: '→ ' + fv.ref });
              tag.dataset.ref = fv.ref;
              row2.appendChild(tag);
            } else {
              row2.appendChild(el('span', { class: 'fv', text: valueText(fv) }));
            }
            fields.appendChild(row2);
          });
          if (!order.length) fields.appendChild(el('div', { class: 'memEmpty', text: '（没有字段）' }));
          objBox.appendChild(fields);
        }
        heapList.appendChild(objBox);
      });
      if (!snap.heap.length) heapList.appendChild(el('div', { class: 'memEmpty', text: '（堆里没有对象）' }));
      heapCol.appendChild(heapList);

      mem.appendChild(stackCol);
      mem.appendChild(heapCol);
      wrap.appendChild(svg);
      wrap.appendChild(mem);
      memPanel.appendChild(wrap);

      /* 引用连线要等 DOM 布局完成后再画 */
      requestAnimationFrame(function () { drawLinks(wrap, svg); });
    }

    /** 在栈变量（.mref）与堆对象（.memObj）之间画虚线箭头 */
    function drawLinks(wrap, svg) {
      if (!wrap || !svg || !wrap.parentNode) return;
      var wrapRect = wrap.getBoundingClientRect();
      var w = wrap.offsetWidth, h = wrap.offsetHeight;
      if (!w || !h) return;
      svg.setAttribute('width', w);
      svg.setAttribute('height', h);
      svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
      var defs = '<defs><marker id="memArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">'
        + '<path d="M0 0 L10 5 L0 10 z" fill="var(--accent)"/></marker></defs>';
      var paths = '';
      var refs = wrap.querySelectorAll('.mref, .memCell[data-ref], .memField .fv[data-ref]');
      Array.prototype.forEach.call(refs, function (node) {
        var ref = node.getAttribute('data-ref');
        if (!ref) return;
        var target = wrap.querySelector('.memObj[data-oid="' + ref + '"]');
        if (!target) return;
        var a = node.getBoundingClientRect();
        var b = target.getBoundingClientRect();
        var x1 = a.right - wrapRect.left - 2;
        var y1 = a.top + a.height / 2 - wrapRect.top;
        var x2 = b.left - wrapRect.left;
        var y2 = b.top + 12 - wrapRect.top;
        var mx = Math.max(18, Math.abs(x2 - x1) / 2);
        paths += '<path d="M' + x1.toFixed(1) + ' ' + y1.toFixed(1)
          + ' C' + (x1 + mx).toFixed(1) + ' ' + y1.toFixed(1) + ' '
          + (x2 - mx).toFixed(1) + ' ' + y2.toFixed(1) + ' '
          + x2.toFixed(1) + ' ' + y2.toFixed(1) + '" fill="none" stroke="var(--accent)" '
          + 'stroke-width="1.1" stroke-dasharray="3 3" opacity=".65" marker-end="url(#memArrow)"/>';
      });
      svg.innerHTML = defs + paths;
    }

    /* ==================================================================
     * 对外句柄
     * ================================================================== */
    var handle = {
      el: root,
      getCode: function () { return area.value; },
      setCode: function (s) {
        area.value = String(s == null ? '' : s);
        state.code = area.value;
        stopAuto();
        state.session = null;
        state.snap = null;
        state.lastErrorLine = 0;
        refreshAll();
        syncGutter();
        if (opts.trace) resetDebug();
      },
      run: function () { setBusy(false); runAll(); },
      reset: function () { resetDebug(); },
      step: function () { stepOnce(); },
      /** 供外部（题库/实验台）读到当前 STDIN 内容 */
      getStdin: function () { return stdinArea ? stdinArea.value : state.stdin; },
      setStdin: function (s) {
        state.stdin = String(s == null ? '' : s);
        if (stdinArea) stdinArea.value = state.stdin;
      },
      destroy: function () {
        state.destroyed = true;
        clearTimeout(state.syntaxTimer);
        stopAuto();
        window.removeEventListener('resize', onResize);
        host.innerHTML = '';
      },
      getState: function () { return { code: area.value, steps: state.stepCount, snap: state.snap, result: state.result }; }
    };

    /* -------- 初始化内容 -------- */
    area.value = state.code;
    if (opts.readOnly) area.readOnly = true;
    var h = Math.max(120, Number(opts.height) || DEFAULT_HEIGHT);
    area.style.height = h + 'px';
    refreshAll();
    /* 字体加载完成后行高可能变化，再同步一次 */
    if (document.fonts && document.fonts.ready && document.fonts.ready.then) {
      document.fonts.ready.then(function () { if (!state.destroyed) refreshAll(); }).catch(function () {});
    }

    /* trace 块（含 memory 演示）挂载后直接摆好第一帧，学生一眼就能看到栈/堆；
       engine.js 与 editor.js 是并行加载的，这里要处理"引擎还没到"的时序。 */
    if (CSC.java) {
      if (opts.trace) createAndPeek();
    } else if (CSC.bus && CSC.bus.on) {
      CSC.bus.on('engine:ready', function () {
        if (state.destroyed) return;
        if (opts.trace && !state.snap) createAndPeek();
        if (state.pendingRun) { state.pendingRun = false; runAll(); }
      });
    }

    /* 按钮事件 */
    btnRun.addEventListener('click', function () { setBusy(false); runAll(); });
    btnStep.addEventListener('click', function () { stepOnce(); });
    btnAuto.addEventListener('click', function (e) { toggleAuto(e.currentTarget); });
    btnReset.addEventListener('click', function () { resetDebug(); });
    btnCopy.addEventListener('click', function () { CSC.copy && CSC.copy(area.value); });
    btnExport.addEventListener('click', function () { exportJava(area.value); });

    return handle;
  }

  CSC.editor = { mount: mount };
  if (CSC.bus && CSC.bus.emit) CSC.bus.emit('editor:ready', CSC.editor);
})();
