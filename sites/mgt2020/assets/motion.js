/* =====================================================================
 * assets/motion.js · 动效层（两站共用）
 * 首页 SYSTEM 读数 count-up：进入首页时数字从 0 滚到目标值
 * （星图视差已按需求移除）
 * 约束：只在非「减少动态效果」环境启用；只改文本，不触发布局
 * ===================================================================== */
(function () {
  'use strict';

  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  function contentEl() { return document.getElementById('content'); }
  function numEls() {
    var root = contentEl();
    if (!root) return [];
    var all = root.querySelectorAll('.dockRows b, .dockSub b, .sysPanel b');
    var out = [];
    for (var i = 0; i < all.length; i++) {
      var t = (all[i].textContent || '').trim();
      if (/^\d+$/.test(t)) out.push({ el: all[i], target: parseInt(t, 10), pad: t.length });
    }
    return out;
  }

  function zeroOut(items) {
    for (var i = 0; i < items.length; i++) {
      var s = '';
      for (var k = 0; k < items[i].pad; k++) s += '0';
      items[i].el.textContent = s;
    }
  }

  function animate(items) {
    var start = performance.now(), dur = 900;
    function tick(t) {
      for (var a = 0; a < items.length; a++) {
        if (!items[a].el.isConnected) return;      /* DOM 被路由替换：放弃本次 */
      }
      var p = Math.min(1, (t - start) / dur);
      var e = 1 - Math.pow(1 - p, 3);
      for (var k = 0; k < items.length; k++) {
        var s = String(Math.round(items[k].target * e));
        while (s.length < items[k].pad) s = '0' + s;
        items[k].el.textContent = s;
      }
      if (p < 1) { requestAnimationFrame(tick); return; }
      for (var j = 0; j < items.length; j++) {
        items[j].el.textContent = String(items[j].target).padStart(items[j].pad, '0');
      }
    }
    requestAnimationFrame(tick);
  }

  var countTimer = 0;
  function scheduleCountUp() {
    clearTimeout(countTimer);
    countTimer = setTimeout(function () {
      var root = contentEl();
      if (!root || !root.querySelector('.starStage')) return;
      var items = numEls();
      if (!items.length) return;

      /* 先归零，避免「先显示最终值、再跳回 0」 */
      zeroOut(items);

      var boot = document.getElementById('boot');
      var wait = (boot && !boot.classList.contains('done')) ? 2900 : 220;
      setTimeout(function () {
        var alive = true;
        for (var i = 0; i < items.length; i++) { if (!items[i].el.isConnected) { alive = false; break; } }
        if (alive) animate(items);
      }, wait);
    }, 700);
  }

  window.addEventListener('hashchange', scheduleCountUp);
  scheduleCountUp();
})();
