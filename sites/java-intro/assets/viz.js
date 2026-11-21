/* =====================================================================
 * 计算机科学与 Java 编程导论 · 学习站 · viz.js
 * 职责：通用 SVG 可视化基础组件，供 labs.js 与内容块复用。
 * 对外 API（_dev/CONTRACT.md §7.4）：
 *   CSC.viz.bars / arrayBoxes / callStack / tree / lineChart / grid / graph / flow
 *   每个组件签名：CSC.viz.<name>(host, opts) -> { update(next), destroy(), el }
 *   update(next) 会合并新选项后重绘；destroy() 移除 SVG。
 * 绘制约定：
 *   - 一律 SVG + viewBox 自适应容器宽度；
 *   - 只使用 app.css 中已定义的 .viz* 类着色，颜色全部来自 CSS 变量；
 *   - 不写内联 style（唯一例外是 tree 的 min-width，用于大树横向滚动）。
 * 作者模块：labs-member
 * ===================================================================== */
(function () {
  'use strict';

  var CSC = window.CSC;
  if (!CSC) {
    console.error('[viz] 必须先加载 app.js');
    return;
  }

  var NS = 'http://www.w3.org/2000/svg';

  /* ----------------------------------------------------------- 基础工具 */
  function hasOwn(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  }

  /** 创建 SVG 元素（attrs 里的 class 会直接作为 class 属性） */
  function svg(tag, attrs, children) {
    var node = document.createElementNS(NS, tag);
    if (attrs) {
      for (var k in attrs) {
        if (!hasOwn(attrs, k)) continue;
        var v = attrs[k];
        if (v == null || v === false) continue;
        node.setAttribute(k, v === true ? '' : String(v));
      }
    }
    if (children) {
      children.forEach(function (c) {
        if (c) node.appendChild(c);
      });
    }
    return node;
  }

  /** 一段文字；cls 默认 .vizLabel（灰色小字） */
  function tx(x, y, str, cls, anchor) {
    var t = svg('text', { x: x, y: y, class: cls || 'vizLabel' });
    if (anchor) t.setAttribute('text-anchor', anchor);
    t.textContent = String(str == null ? '' : str);
    return t;
  }

  function clear(node) {
    if (!node) return;
    while (node.firstChild) node.removeChild(node.firstChild);
  }

  /** 数字的教学化显示：大数用「万 / 亿 / e 记法」，避免 Big-O 表格里出现 20 位数字 */
  function fmtNum(v) {
    var n = Number(v);
    if (v == null || isNaN(n)) return '—';
    var a = Math.abs(n);
    if (a >= 1e15) return n.toExponential(1).replace('e+', 'e');
    if (a >= 1e12) return (n / 1e12).toFixed(1).replace(/\.0$/, '') + '万亿';
    if (a >= 1e8) return (n / 1e8).toFixed(2).replace(/\.?0+$/, '') + '亿';
    if (a >= 1e4) return (n / 1e4).toFixed(1).replace(/\.0$/, '') + '万';
    if (a % 1 === 0) return String(n);
    if (a >= 10) return String(Math.round(n));
    return String(Math.round(n * 100) / 100);
  }

  /**
   * 组件外壳：自动创建/复用 <svg class="vizSvg">，update 合并选项后整幅重绘。
   * 组件规模都很小（< 200 个 SVG 节点），整幅重绘比维护增量逻辑可靠得多。
   */
  function component(host, draw) {
    var root = null;
    var opts = {};
    var api;

    function ensure() {
      if (root || !host) return root;
      /* width:100% 让 SVG 跟随容器宽度，height 由 CSS(.vizSvg) 按 viewBox 比例计算 */
      root = svg('svg', { class: 'vizSvg', role: 'img', width: '100%' });
      host.appendChild(root);
      return root;
    }

    api = {
      update: function (next) {
        if (next) {
          for (var k in next) {
            if (hasOwn(next, k)) opts[k] = next[k];
          }
        }
        var s = ensure();
        if (!s) return api;
        clear(s);
        var size = draw(s, opts) || {};
        s.setAttribute('viewBox', '0 0 ' + (size.w || 320) + ' ' + (size.h || 120));
        return api;
      },
      destroy: function () {
        if (root && root.parentNode) root.parentNode.removeChild(root);
        root = null;
        return api;
      }
    };

    Object.defineProperty(api, 'el', {
      get: function () { return root; }
    });
    return api;
  }

  /* ----------------------------------------------------------- 柱状图 */
  /**
   * 柱状图（排序 / 计数演示）。
   * opts:
   *   values:[number]          柱高数据
   *   labels:[string]          覆盖柱顶的值文本（缺省显示数值）
   *   highlight:[index]        正在比较（黄）
   *   done:[index]             已就位（绿）
   *   dim:[index]              区间外（灰）
   *   range:[lo,hi]            当前处理区间（画两条虚线边界 + 文字）
   *   max:number               固定最大值（缺省取数据最大值）
   *   onFrame(values)          每次重绘后的回调（可选）
   * 柱子元素做增量更新，因此 CSS transition（.vizBar 已定义）能产生平滑移动。
   */
  function bars(host, initial) {
    var root = null;
    var o = {};
    var parts = null;
    var api;

    function ensure(n) {
      if (!root && host) {
        root = svg('svg', { class: 'vizSvg', role: 'img', width: '100%' });
        host.appendChild(root);
      }
      if (!root) return false;
      if (parts && parts.n === n) return true;
      clear(root);
      parts = { n: n, rects: [], vals: [], idxs: [] };
      parts.rangeG = svg('g');
      root.appendChild(parts.rangeG);
      for (var i = 0; i < n; i++) {
        var r = svg('rect', { class: 'vizBar', rx: 3 });
        root.appendChild(r);
        parts.rects.push(r);
        parts.vals.push(svg('text', { class: 'vizVal', 'text-anchor': 'middle' }));
        parts.idxs.push(svg('text', { class: 'vizLabel', 'text-anchor': 'middle' }));
        root.appendChild(parts.vals[i]);
        root.appendChild(parts.idxs[i]);
      }
      return true;
    }

    function paint() {
      var vals = o.values || [];
      var n = vals.length;
      if (!n) {
        if (root) {
          clear(root);
          parts = null;
          root.setAttribute('viewBox', '0 0 320 80');
        }
        return;
      }
      if (!ensure(n)) return;

      var slot = Math.max(26, Math.min(58, Math.round(360 / n)));
      var barW = Math.max(12, slot - 12);
      var padX = 10;
      var topY = 34;
      var baseY = 132;
      var W = n * slot + padX * 2;
      var H = baseY + 34;
      var maxV = o.max != null ? Number(o.max) : Math.max.apply(null, vals.concat([1]));
      if (!(maxV > 0)) maxV = 1;
      var hi = o.highlight || [];
      var done = o.done || [];
      var dim = o.dim || [];

      for (var i = 0; i < n; i++) {
        var v = Number(vals[i]) || 0;
        var h = Math.max(3, Math.round((v / maxV) * (baseY - topY)));
        var x = padX + i * slot + (slot - barW) / 2;
        var cls = 'vizBar';
        if (hi.indexOf(i) >= 0) cls += ' hi';
        else if (done.indexOf(i) >= 0) cls += ' done';
        else if (dim.indexOf(i) >= 0) cls += ' dim';

        var r = parts.rects[i];
        r.setAttribute('x', x);
        r.setAttribute('y', baseY - h);
        r.setAttribute('width', barW);
        r.setAttribute('height', h);
        r.setAttribute('class', cls);

        var vt = parts.vals[i];
        vt.setAttribute('x', x + barW / 2);
        vt.setAttribute('y', Math.max(12, baseY - h - 6));
        vt.textContent = o.labels ? String(o.labels[i] == null ? v : o.labels[i]) : fmtNum(v);

        var it = parts.idxs[i];
        it.setAttribute('x', x + barW / 2);
        it.setAttribute('y', baseY + 16);
        it.textContent = i;
      }

      /* 当前区间边界（虚线 + 标签） */
      var g = parts.rangeG;
      clear(g);
      if (o.range && o.range.length === 2) {
        var lo = Math.max(0, Math.min(n - 1, o.range[0]));
        var hi2 = Math.max(0, Math.min(n - 1, o.range[1]));
        if (lo <= hi2) {
          var x1 = padX + lo * slot;
          var x2 = padX + (hi2 + 1) * slot;
          g.appendChild(svg('line', { class: 'vizGrid', x1: x1, y1: 26, x2: x1, y2: baseY + 4 }));
          g.appendChild(svg('line', { class: 'vizGrid', x1: x2, y1: 26, x2: x2, y2: baseY + 4 }));
          g.appendChild(tx((x1 + x2) / 2, 14, '区间 [' + lo + '..' + hi2 + ']', 'vizLabel', 'middle'));
        }
      }

      root.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
      if (typeof o.onFrame === 'function') {
        try { o.onFrame(vals.slice()); } catch (e) { /* 回调异常不影响绘图 */ }
      }
    }

    api = {
      update: function (next) {
        if (next) {
          for (var k in next) {
            if (hasOwn(next, k)) o[k] = next[k];
          }
        }
        paint();
        return api;
      },
      destroy: function () {
        if (root && root.parentNode) root.parentNode.removeChild(root);
        root = null;
        parts = null;
        return api;
      }
    };
    Object.defineProperty(api, 'el', {
      get: function () { return root; }
    });
    if (initial) api.update(initial);
    return api;
  }

  /* ------------------------------------------------------- 数组格子 + 指针 */
  function drawBoxes(s, o) {
    var values = o.values || [];
    var n = values.length;
    var names = o.pointers ? Object.keys(o.pointers) : [];
    var slot = Math.max(34, Math.min(56, Math.round(360 / Math.max(1, n))));
    var cellW = slot - 6;
    var cellH = o.cellH || 30;
    var topPad = 8 + names.length * 14;
    var extra = (o.errAt != null && o.errAt >= n) ? 1 : 0;
    var W = (n + extra) * slot + 16;
    var H = topPad + cellH + 24;

    /* 指针：每个指针一行，中间画一条竖线指向自己的格子 */
    names.forEach(function (name, row) {
      var idx = Number(o.pointers[name]);
      if (isNaN(idx)) return;
      idx = Math.max(0, Math.min(n - 1, idx));
      var cx = 8 + idx * slot + slot / 2;
      var ty = 13 + row * 14;
      s.appendChild(tx(cx, ty, name, 'vizPtrText', 'middle'));
      s.appendChild(svg('line', { class: 'vizAxis', x1: cx, y1: ty + 3, x2: cx, y2: topPad - 3 }));
    });

    for (var i = 0; i < n; i++) {
      var x = 8 + i * slot + 3;
      var cls = 'vizCell';
      if (o.changed && o.changed.indexOf(i) >= 0) cls += ' vizNode hi';
      else if (o.selected === i) cls += ' vizNode hi';
      if (o.errAt === i) cls += ' vizBar hi';
      var r = svg('rect', { class: cls, x: x, y: topPad, width: cellW, height: cellH, rx: 6 });
      if (typeof o.onCell === 'function') {
        r.addEventListener('click', (function (k) {
          return function () { o.onCell(k); };
        })(i));
      }
      s.appendChild(r);
      s.appendChild(tx(x + cellW / 2, topPad + cellH / 2 + 4, values[i], 'vizCellText', 'middle'));
      s.appendChild(tx(x + cellW / 2, topPad + cellH + 15, i, 'vizLabel', 'middle'));
    }

    /* 越界位置：额外画一个警示格（演示 a[length] 的错误） */
    if (extra) {
      var ex = 8 + n * slot + 3;
      s.appendChild(svg('rect', { class: 'vizCell vizBar hi', x: ex, y: topPad, width: cellW, height: cellH, rx: 6 }));
      s.appendChild(tx(ex + cellW / 2, topPad + cellH / 2 + 4, '✕', 'vizCellText', 'middle'));
      s.appendChild(tx(ex + cellW / 2, topPad + cellH + 15, String(n), 'vizPtrText', 'middle'));
    }

    if (o.title) s.appendChild(tx(8, 0, o.title, 'vizText', 'start'));
    return { w: W, h: H };
  }

  /** 数组格子：值 + 下标 + 指针（lo/hi/mid/cur…）+ 点击回调 */
  function arrayBoxes(host, initial) {
    var comp = component(host, drawBoxes);
    if (initial) comp.update(initial);
    return comp;
  }

  /* ----------------------------------------------------------- 调用栈 */
  function drawStack(s, o) {
    var frames = o.frames || [];
    var n = frames.length;
    var W = 300;
    var fw = 258;
    var fh = 34;
    var gap = 5;
    var top = 10;
    var H = top + Math.max(1, n) * (fh + gap) + 6;
    var topIndex = o.topIndex != null ? o.topIndex : n - 1;

    if (!n) {
      s.appendChild(tx(W / 2, 42, '（栈为空）', 'vizLabel', 'middle'));
      return { w: W, h: 70 };
    }

    for (var i = 0; i < n; i++) {
      /* frames[0] 是 main，画在最底下；新帧往上叠 */
      var y = top + (n - 1 - i) * (fh + gap);
      var x = 20;
      var active = i === topIndex;
      var cls = 'vizNode' + (active ? ' hi' : '');
      s.appendChild(svg('rect', { class: cls, x: x, y: y, width: fw, height: fh, rx: 7 }));
      var fr = frames[i] || {};
      s.appendChild(tx(x + 10, y + 15, fr.name || '?', 'vizText', 'start'));
      if (fr.args) s.appendChild(tx(x + 10, y + 28, fr.args, 'vizLabel', 'start'));
      s.appendChild(tx(x + fw - 8, y + 22, 'frame ' + i, 'vizLabel', 'end'));
      if (active) s.appendChild(tx(x + fw - 72, y - 2, '↑ 当前帧', 'vizPtrText', 'start'));
    }
    return { w: W, h: H };
  }

  /** 调用栈示意：frames:[{name, args}]，frames[0] 为最底层 */
  function callStack(host, initial) {
    var comp = component(host, drawStack);
    if (initial) comp.update(initial);
    return comp;
  }

  /* ----------------------------------------------------------- 递归树 */
  function drawTree(s, o) {
    var rawNodes = o.nodes || [];
    var nodes = [];
    var byId = {};
    rawNodes.forEach(function (nd, i) {
      var id = nd && nd.id != null ? nd.id : i;
      nodes.push({
        id: id,
        label: nd && nd.label != null ? nd.label : id,
        raw: nd || {}
      });
      byId[id] = nodes[nodes.length - 1];
    });

    var children = {};
    var hasParent = {};
    (o.edges || []).forEach(function (e) {
      var f = e && e.from != null ? e.from : (e ? e[0] : null);
      var t = e && e.to != null ? e.to : (e ? e[1] : null);
      if (!byId[f] || !byId[t]) return;
      if (!children[f]) children[f] = [];
      children[f].push(t);
      hasParent[t] = 1;
    });

    var collapsed = o.collapsed || {};
    var roots = [];
    nodes.forEach(function (nd) {
      if (!hasParent[nd.id]) roots.push(nd.id);
    });
    if (!roots.length && nodes.length) roots = [nodes[0].id];
    if (o.root != null && byId[o.root]) roots = [o.root];

    var nodeW = o.nodeW || 58;
    var nodeH = o.nodeH || 28;
    var gapX = o.gapX || (nodeW + 8);
    var gapY = o.gapY || 30;
    var dir = o.dir === 'h' ? 'h' : 'v';
    var padTop = 12;
    var cursor = 0;
    var maxDepth = 0;

    /* DFS：先给叶子分配槽位，内部节点取子节点槽位的中点 */
    function place(id, depth) {
      var nd = byId[id];
      if (!nd || nd.depth != null) return;
      nd.depth = depth;
      if (depth > maxDepth) maxDepth = depth;
      var kids = collapsed[id] ? [] : (children[id] || []);
      nd.kids = kids;
      nd.hasKids = (children[id] || []).length > 0;
      if (!kids.length) {
        nd.slotPos = cursor++;
      } else {
        for (var i = 0; i < kids.length; i++) place(kids[i], depth + 1);
        var first = byId[kids[0]];
        var last = byId[kids[kids.length - 1]];
        nd.slotPos = (first.slotPos + last.slotPos) / 2;
      }
    }
    roots.forEach(function (r) { place(r, 0); });

    /* 坐标：纵向时 depth→y、槽位→x；横向时相反（线性递归链不会变成超高的图） */
    nodes.forEach(function (nd) {
      if (nd.slotPos == null) return;
      if (dir === 'v') {
        nd.cx = 14 + nodeW / 2 + nd.slotPos * gapX;
        nd.cy = padTop + nd.depth * (nodeH + gapY) + nodeH / 2;
      } else {
        nd.cx = 14 + nodeW / 2 + nd.depth * (nodeW + gapX);
        nd.cy = padTop + nd.slotPos * (nodeH + gapY) + nodeH / 2;
      }
    });

    var W, H;
    if (dir === 'v') {
      W = Math.max(300, 14 + Math.max(0, cursor - 1) * gapX + nodeW + 14);
      H = padTop + (maxDepth + 1) * (nodeH + gapY) + 6;
    } else {
      W = Math.max(300, 14 + maxDepth * (nodeW + gapX) + nodeW + 14);
      H = Math.max(70, padTop + Math.max(0, cursor - 1) * (nodeH + gapY) + nodeH + 8);
    }

    var active = o.active || [];
    var done = o.done || [];
    var ann = o.annotations || {};

    /* 先画边，再画节点，避免线压在文字上 */
    nodes.forEach(function (p) {
      if (p.slotPos == null) return;
      (p.kids || []).forEach(function (cid) {
        var c = byId[cid];
        if (!c || c.slotPos == null) return;
        var x1, y1, x2, y2;
        if (dir === 'v') {
          x1 = p.cx; y1 = p.cy + nodeH / 2;
          x2 = c.cx; y2 = c.cy - nodeH / 2;
        } else {
          x1 = p.cx + nodeW / 2; y1 = p.cy;
          x2 = c.cx - nodeW / 2; y2 = c.cy;
        }
        var mid = dir === 'v' ? (y1 + y2) / 2 : (x1 + x2) / 2;
        var d = dir === 'v'
          ? 'M' + x1 + ' ' + y1 + ' C' + x1 + ' ' + mid + ' ' + x2 + ' ' + mid + ' ' + x2 + ' ' + y2
          : 'M' + x1 + ' ' + y1 + ' C' + mid + ' ' + y1 + ' ' + mid + ' ' + y2 + ' ' + x2 + ' ' + y2;
        var ecls = 'vizEdge';
        if (active.indexOf(p.id) >= 0 || active.indexOf(c.id) >= 0) ecls += ' hi';
        s.appendChild(svg('path', { class: ecls, d: d }));
      });
    });

    nodes.forEach(function (nd) {
      if (nd.slotPos == null) return;
      var cls = 'vizNode';
      if (active.indexOf(nd.id) >= 0) cls += ' hi';
      else if (done.indexOf(nd.id) >= 0) cls += ' vizBar done';
      var rx = 8;
      var el = svg('rect', {
        class: cls, x: nd.cx - nodeW / 2, y: nd.cy - nodeH / 2,
        width: nodeW, height: nodeH, rx: rx
      });
      if (typeof o.onNodeClick === 'function') {
        el.addEventListener('click', (function (id) {
          return function () { o.onNodeClick(id); };
        })(nd.id));
      }
      s.appendChild(el);
      s.appendChild(tx(nd.cx, nd.cy + 4, nd.label, 'vizText', 'middle'));
      /* 折叠标记：有子节点时在左上角显示 − / + */
      if (nd.hasKids) {
        s.appendChild(tx(nd.cx - nodeW / 2 + 5, nd.cy + 4, collapsed[nd.id] ? '+' : '−', 'vizPtrText', 'start'));
      }
      /* 返回值注解（递归回溯时显示 =24） */
      if (ann[nd.id] != null) {
        s.appendChild(tx(nd.cx + nodeW / 2 - 3, nd.cy - nodeH / 2 - 2, ann[nd.id], 'vizVal', 'end'));
      }
    });

    if (o.caption) s.appendChild(tx(W / 2, H - 4, o.caption, 'vizLabel', 'middle'));
    return { w: W, h: H };
  }

  /**
   * 递归/调用树。
   * nodes:[{id,label}], edges:[{from,to}]（也接受 [[from,to]]）
   * collapsed:{id:true} 折叠子树；active:[id] 高亮；done:[id] 完成
   * annotations:{id:'=24'} 显示返回值；onNodeClick(id) 点击节点
   * dir:'v'（默认，二叉递归树）| 'h'（线性递归链，横向展开）
   */
  function tree(host, initial) {
    var comp = component(host, drawTree);
    if (initial) comp.update(initial);
    return comp;
  }

  /* ----------------------------------------------------------- 折线图 */
  /** 坐标轴刻度：线性等分；对数轴按 10 的整数次幂取刻度（并丢掉明显超出上界的） */
  function tickValues(min, max, count, isLog) {
    var out = [];
    var i;
    if (isLog) {
      var lo = Math.floor(Math.log10(Math.max(1, min)));
      var hi = Math.ceil(Math.log10(Math.max(1, max)));
      var step = Math.max(1, Math.ceil((hi - lo) / Math.max(1, count)));
      for (var k = lo; k <= hi; k += step) out.push(Math.pow(10, k));
      out = out.filter(function (v) { return v <= max * 1.25 || v === out[0]; });
    } else {
      for (i = 0; i <= count; i++) out.push(min + (max - min) * i / count);
    }
    return out;
  }

  /** 短刻度文本（x 轴通常是整数 n） */
  function fmtShort(v) {
    var a = Math.abs(v);
    if (a >= 1e6) return fmtNum(v);
    if (a >= 1) return String(Math.round(v));
    return String(Math.round(v * 10) / 10);
  }

  /**
   * 折线图（复杂度增长 / 实测拟合）。
   * opts:
   *   series:[{name, points:[[x,y]], hi:boolean, dash:'4 3', opacity, dots:boolean}]
   *   xLabel / yLabel / xTicks / yTicks / width / height
   *   logX / logY（对数坐标） / xMin / xMax / yMin / yMax
   * 颜色只用 .vizEdge（灰）与 .vizEdge.hi（主色），多条曲线靠虚线样式与透明度区分。
   */
  function drawChart(s, o) {
    var series = o.series || [];
    var W = o.width || 380;
    var H = o.height || 210;
    var padL = 48;
    var padR = 14;
    var padT = 16;
    var padB = 30;
    var plotW = W - padL - padR;
    var plotH = H - padT - padB;
    var logX = !!o.logX;
    var logY = !!o.logY;
    var xMin = Infinity;
    var xMax = -Infinity;
    var yMax = -Infinity;
    var hasPoint = false;

    series.forEach(function (se) {
      (se.points || []).forEach(function (pt) {
        if (!pt) return;
        var x = Number(pt[0]);
        var y = Number(pt[1]);
        if (isNaN(x) || isNaN(y)) return;
        hasPoint = true;
        xMin = Math.min(xMin, x);
        xMax = Math.max(xMax, x);
        yMax = Math.max(yMax, y);
      });
    });
    if (!hasPoint) { xMin = 1; xMax = 2; yMax = 1; }
    if (o.xMin != null) xMin = Number(o.xMin);
    if (o.xMax != null) xMax = Number(o.xMax);
    var yMin = o.yMin != null ? Number(o.yMin) : (logY ? 1 : 0);
    if (logY && yMin < 1) yMin = 1;
    if (logX && xMin < 1) xMin = 1;
    if (!isFinite(xMin)) xMin = logX ? 1 : 0;
    if (!isFinite(xMax) || xMax <= xMin) xMax = xMin + 1;
    if (!isFinite(yMax) || yMax <= yMin) yMax = yMin + 1;

    var lxMin = Math.log(Math.max(1e-9, xMin));
    var lxMax = Math.log(Math.max(1e-9, xMax));
    var lyMin = Math.log(Math.max(1e-9, yMin));
    var lyMax = Math.log(Math.max(1e-9, yMax));
    if (lxMax - lxMin < 1e-9) lxMax = lxMin + 1;
    if (lyMax - lyMin < 1e-9) lyMax = lyMin + 1;

    function mapX(v) {
      var t = logX
        ? (Math.log(Math.max(1e-9, v)) - lxMin) / (lxMax - lxMin)
        : (v - xMin) / (xMax - xMin);
      return padL + Math.max(0, Math.min(1, t)) * plotW;
    }
    function mapY(v) {
      var t = logY
        ? (Math.log(Math.max(1e-9, v)) - lyMin) / (lyMax - lyMin)
        : (v - yMin) / (yMax - yMin);
      return padT + plotH - Math.max(0, Math.min(1, t)) * plotH;
    }

    /* 网格 + 刻度 */
    tickValues(xMin, xMax, o.xTicks || 5, logX).forEach(function (v) {
      var x = mapX(v);
      s.appendChild(svg('line', { class: 'vizGrid', x1: x, y1: padT, x2: x, y2: padT + plotH }));
      s.appendChild(tx(x, padT + plotH + 16, fmtShort(v), 'vizLabel', 'middle'));
    });
    tickValues(yMin, yMax, o.yTicks || 4, logY).forEach(function (v) {
      var y = mapY(v);
      s.appendChild(svg('line', { class: 'vizGrid', x1: padL, y1: y, x2: padL + plotW, y2: y }));
      s.appendChild(tx(padL - 7, y + 3, fmtNum(v), 'vizLabel', 'end'));
    });

    /* 坐标轴 */
    s.appendChild(svg('line', { class: 'vizAxis', x1: padL, y1: padT, x2: padL, y2: padT + plotH }));
    s.appendChild(svg('line', { class: 'vizAxis', x1: padL, y1: padT + plotH, x2: padL + plotW, y2: padT + plotH }));

    /* 曲线 */
    series.forEach(function (se) {
      var pts = (se.points || []).filter(function (pt) {
        return pt && !isNaN(Number(pt[0])) && !isNaN(Number(pt[1]));
      });
      if (!pts.length) return;
      var d = pts.map(function (pt, i) {
        return (i ? 'L' : 'M') + mapX(Number(pt[0])).toFixed(1) + ' ' + mapY(Number(pt[1])).toFixed(1);
      }).join(' ');
      var line = svg('path', {
        class: 'vizEdge' + (se.hi ? ' hi' : ''),
        d: d,
        fill: 'none'
      });
      if (se.dash) line.setAttribute('stroke-dasharray', se.dash);
      if (se.opacity != null) line.setAttribute('stroke-opacity', String(se.opacity));
      s.appendChild(line);
      if (se.dots) {
        pts.forEach(function (pt) {
          s.appendChild(svg('circle', {
            class: 'vizPtr',
            cx: mapX(Number(pt[0])),
            cy: mapY(Number(pt[1])),
            r: 2.6
          }));
        });
      }
    });

    if (o.xLabel) s.appendChild(tx(padL + plotW, H - 5, o.xLabel, 'vizLabel', 'end'));
    if (o.yLabel) s.appendChild(tx(6, padT - 5, o.yLabel, 'vizLabel', 'start'));
    return { w: W, h: H };
  }

  /** 折线图组件 */
  function lineChart(host, initial) {
    var comp = component(host, drawChart);
    if (initial) comp.update(initial);
    return comp;
  }

  /* ----------------------------------------------------------- 二维网格 */
  function hasCell(list, r, c) {
    if (!list) return false;
    for (var i = 0; i < list.length; i++) {
      if (list[i] && list[i][0] === r && list[i][1] === c) return true;
    }
    return false;
  }

  /**
   * 二维数组 / 表格网格。
   * opts: rows, cols, cells[[...]], cellW, cellH,
   *       changed:[[r,c]], selected:[r,c], onCell(r,c),
   *       rowLabels:true|string[], colLabels:true|string[]
   */
  function drawGrid(s, o) {
    var cells = o.cells || [];
    var rows = o.rows != null ? o.rows : cells.length;
    var cols = o.cols != null ? o.cols : (cells[0] ? cells[0].length : 0);
    if (!rows || !cols) {
      s.appendChild(tx(160, 40, '（空网格）', 'vizLabel', 'middle'));
      return { w: 320, h: 70 };
    }
    var cellW = o.cellW || Math.max(28, Math.min(52, Math.round(300 / cols)));
    var cellH = o.cellH || 28;
    var gap = 4;
    var showRow = o.rowLabels !== false;
    var showCol = o.colLabels !== false;
    var left = showRow ? 28 : 8;
    var top = showCol ? 18 : 8;
    var W = left + cols * (cellW + gap) + 6;
    var H = top + rows * (cellH + gap) + 6;

    function labelAt(source, idx, fallback) {
      if (source && source.length && source[idx] != null) return source[idx];
      return fallback;
    }

    for (var c = 0; c < cols; c++) {
      s.appendChild(tx(left + c * (cellW + gap) + cellW / 2, top - 6,
        showCol ? labelAt(o.colLabels, c, c) : '', 'vizLabel', 'middle'));
    }
    for (var r = 0; r < rows; r++) {
      var row = cells[r] || [];
      if (showRow) {
        s.appendChild(tx(left - 8, top + r * (cellH + gap) + cellH / 2 + 4,
          labelAt(o.rowLabels, r, r), 'vizLabel', 'end'));
      }
      for (var c2 = 0; c2 < cols; c2++) {
        var x = left + c2 * (cellW + gap);
        var y = top + r * (cellH + gap);
        var cls = 'vizCell';
        if (hasCell(o.changed, r, c2)) cls += ' vizNode hi';
        else if (o.selected && o.selected[0] === r && o.selected[1] === c2) cls += ' vizNode hi';
        var rect = svg('rect', { class: cls, x: x, y: y, width: cellW, height: cellH, rx: 5 });
        if (typeof o.onCell === 'function') {
          rect.addEventListener('click', (function (rr, cc) {
            return function () { o.onCell(rr, cc); };
          })(r, c2));
        }
        s.appendChild(rect);
        var cell = row[c2];
        var val = cell && typeof cell === 'object' ? cell.value : cell;
        s.appendChild(tx(x + cellW / 2, y + cellH / 2 + 4, val == null ? '' : val, 'vizCellText', 'middle'));
      }
    }
    return { w: W, h: H };
  }

  /** 二维网格组件 */
  function grid(host, initial) {
    var comp = component(host, drawGrid);
    if (initial) comp.update(initial);
    return comp;
  }

  /* ----------------------------------------------------------- 图 */
  var ARW_SEQ = 0;

  function drawGraph(s, o) {
    var nodes = o.nodes || [];
    var n = nodes.length;
    var W = o.width || 340;
    var H = o.height || 240;
    var cx = W / 2;
    var cy = H / 2;
    var R = Math.max(30, Math.min(W, H) / 2 - 34);
    var byId = {};
    var list = [];
    var i;

    for (i = 0; i < n; i++) {
      var nd = nodes[i] || {};
      var id = nd.id != null ? nd.id : i;
      var p = {
        id: id,
        label: nd.label != null ? nd.label : String(id),
        x: 0,
        y: 0
      };
      if (nd.x != null && nd.y != null) {
        p.x = nd.x <= 1 ? nd.x * W : nd.x;
        p.y = nd.y <= 1 ? nd.y * H : nd.y;
      } else {
        var a = n ? (-Math.PI / 2 + i * 2 * Math.PI / n) : 0;
        p.x = cx + R * Math.cos(a);
        p.y = cy + R * Math.sin(a);
      }
      list.push(p);
      byId[id] = p;
    }

    var active = o.active || [];
    var visited = o.visited || [];
    var hiEdges = o.hiEdges || [];
    var directed = !!o.directed;
    var markerId = '';
    if (directed) {
      markerId = 'vizArw' + (++ARW_SEQ);
      var defs = svg('defs');
      var marker = svg('marker', {
        id: markerId, viewBox: '0 0 10 10', refX: 9, refY: 5,
        markerWidth: 6, markerHeight: 6, orient: 'auto'
      });
      marker.appendChild(svg('path', { class: 'vizPtr', d: 'M0,0 L10,5 L0,10 z' }));
      defs.appendChild(marker);
      s.appendChild(defs);
    }

    function edgeKeyOf(e) {
      var f = e && e.from != null ? e.from : (e ? e[0] : null);
      var t = e && e.to != null ? e.to : (e ? e[1] : null);
      return String(f) + '>' + String(t);
    }
    var hiSet = {};
    hiEdges.forEach(function (e) { hiSet[edgeKeyOf(e)] = 1; });

    (o.edges || []).forEach(function (e) {
      var f = e && e.from != null ? e.from : (e ? e[0] : null);
      var t = e && e.to != null ? e.to : (e ? e[1] : null);
      var a = byId[f];
      var b = byId[t];
      if (!a || !b) return;
      var hi = !!hiSet[edgeKeyOf(e)];
      var ln = svg('line', {
        class: 'vizEdge' + (hi ? ' hi' : ''),
        x1: a.x, y1: a.y, x2: b.x, y2: b.y
      });
      if (directed) ln.setAttribute('marker-end', 'url(#' + markerId + ')');
      s.appendChild(ln);
      if (e && e.label) {
        s.appendChild(tx((a.x + b.x) / 2, (a.y + b.y) / 2 - 4, e.label, 'vizLabel', 'middle'));
      }
    });

    list.forEach(function (p2) {
      var cls = 'vizNode';
      if (active.indexOf(p2.id) >= 0) cls += ' hi';
      else if (visited.indexOf(p2.id) >= 0) cls += ' vizBar done';
      s.appendChild(svg('circle', { class: cls, cx: p2.x, cy: p2.y, r: 16 }));
      s.appendChild(tx(p2.x, p2.y + 4, p2.label, 'vizText', 'middle'));
    });
    return { w: W, h: H };
  }

  /** 图组件（节点缺省按环形布局；给 x/y 可自定义位置） */
  function graph(host, initial) {
    var comp = component(host, drawGraph);
    if (initial) comp.update(initial);
    return comp;
  }

  /* ----------------------------------------------------------- 流程图 */
  /**
   * 流程图。纵向时条件节点（kind:'decide'）可在右侧挂一个 "yes" 结果框，
   * 便于表达 if/else-if 分支；active 用来高亮"当前正走到哪一个判断"。
   * opts:
   *   nodes:[{title, desc, kind:'start'|'proc'|'decide'|'end', yes:'A'}]
   *   active:{node:index, yes:index}  path:[已走过的节点 index]  yesPath:[已走过的 yes 分支 index]
   */
  function drawFlow(s, o) {
    var nodes = o.nodes || [];
    var dir = o.dir === 'h' ? 'h' : 'v';
    var active = o.active || {};
    var path = {};
    (o.path || []).forEach(function (i) { path[i] = 1; });
    var nodeW = 190;
    var x = 12;
    var rightX = 248;
    var rightW = 140;
    var rightH = 42;
    var gapY = 26;
    var y = 12;
    var pos = [];
    var i;

    if (dir === 'h') {
      var hnw = 150;
      var hnh = 54;
      var hgap = 34;
      var HW = 12 + nodes.length * (hnw + hgap) + 6;
      for (i = 0; i < nodes.length; i++) {
        var hx = 12 + i * (hnw + hgap);
        if (i > 0) {
          s.appendChild(svg('line', {
            class: 'vizEdge', x1: hx - hgap + 2, y1: 55, x2: hx - 3, y2: 55
          }));
          s.appendChild(tx(hx - hgap / 2, 50, '→', 'vizLabel', 'middle'));
        }
        var hcls = 'vizNode' + (active.node === i || path[i] ? ' hi' : '');
        s.appendChild(svg('rect', { class: hcls, x: hx, y: 28, width: hnw, height: hnh, rx: 10 }));
        s.appendChild(tx(hx + hnw / 2, 50, (nodes[i] || {}).title || '', 'vizText', 'middle'));
        if ((nodes[i] || {}).desc) {
          s.appendChild(tx(hx + hnw / 2, 66, nodes[i].desc, 'vizLabel', 'middle'));
        }
      }
      return { w: HW, h: 110 };
    }

    /* 纵向主链位置 */
    for (i = 0; i < nodes.length; i++) {
      var nd = nodes[i] || {};
      var h = nd.kind === 'decide' ? 52 : 46;
      pos.push({ x: x, y: y, w: nodeW, h: h, nd: nd, idx: i });
      y += h + gapY;
    }
    var W = 400;
    var H = y + 4;

    /* 先画主链箭头（藏在节点下层） */
    pos.forEach(function (p, idx) {
      if (idx === 0) return;
      var prev = pos[idx - 1];
      var x1 = prev.x + prev.w / 2;
      var y1 = prev.y + prev.h;
      var x2 = p.x + p.w / 2;
      var y2 = p.y;
      var hi = path[prev.idx] === 1 && path[p.idx] === 1;
      s.appendChild(svg('path', {
        class: 'vizEdge' + (hi ? ' hi' : ''),
        d: 'M' + x1 + ' ' + y1 + ' L' + x2 + ' ' + y2,
        fill: 'none'
      }));
      s.appendChild(svg('path', {
        class: 'vizPtr',
        d: 'M' + (x2 - 4) + ' ' + (y2 - 7) + ' L' + (x2 + 4) + ' ' + (y2 - 7) + ' L' + x2 + ' ' + y2 + ' z'
      }));
      if (prev.nd.kind === 'decide') {
        s.appendChild(tx(x1 + 8, y1 + (y2 - y1) / 2 + 4, '否', 'vizLabel', 'start'));
      }
    });

    /* 再画节点与右侧 "是" 分支 */
    pos.forEach(function (p) {
      var nd2 = p.nd;
      var isHi = active.node === p.idx || path[p.idx] === 1;
      var cls = 'vizNode' + (isHi ? ' hi' : '');
      var rx = nd2.kind === 'decide' ? 10 : 20;
      s.appendChild(svg('rect', { class: cls, x: p.x, y: p.y, width: p.w, height: p.h, rx: rx }));
      var ty = p.y + (nd2.desc ? p.h / 2 - 2 : p.h / 2 + 4);
      s.appendChild(tx(p.x + p.w / 2, ty, nd2.title || '', 'vizText', 'middle'));
      if (nd2.desc) s.appendChild(tx(p.x + p.w / 2, ty + 14, nd2.desc, 'vizLabel', 'middle'));

      if (nd2.yes != null) {
        var ry = p.y + p.h / 2 - rightH / 2;
        var yesHi = active.yes === p.idx || active.yesPath === p.idx || path[p.idx] === 1;
        s.appendChild(svg('rect', {
          class: 'vizNode' + (yesHi ? ' hi' : ''),
          x: rightX, y: ry, width: rightW, height: rightH, rx: 8
        }));
        s.appendChild(tx(rightX + rightW / 2, ry + rightH / 2 + 4, nd2.yes, 'vizText', 'middle'));
        var mx = (p.x + p.w + rightX) / 2;
        s.appendChild(svg('path', {
          class: 'vizEdge' + (yesHi ? ' hi' : ''),
          d: 'M' + (p.x + p.w) + ' ' + (p.y + p.h / 2) + ' L' + (rightX - 3) + ' ' + (ry + rightH / 2),
          fill: 'none'
        }));
        s.appendChild(tx(mx, p.y + p.h / 2 - 6, '是', 'vizPtrText', 'middle'));
      }
    });
    return { w: W, h: H };
  }

  /** 流程图组件 */
  function flow(host, initial) {
    var comp = component(host, drawFlow);
    if (initial) comp.update(initial);
    return comp;
  }

  /* ----------------------------------------------------------- 对外注册 */
  var api = {
    bars: bars,
    arrayBoxes: arrayBoxes,
    callStack: callStack,
    tree: tree,
    lineChart: lineChart,
    grid: grid,
    graph: graph,
    flow: flow,
    fmtNum: fmtNum
  };

  if (typeof CSC.registerViz === 'function') CSC.registerViz(api);
  else {
    CSC.viz = api;
    if (CSC.bus) CSC.bus.emit('viz:ready', api);
  }
})();
