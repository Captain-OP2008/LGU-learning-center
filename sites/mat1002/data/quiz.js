/* =====================================================================
 * quiz.js · 分章题库（PACK.items）
 * 每项字段：{ id:'ch01-q1', ch:'ch01', kp:'ch01-1', tier:1, type:'mcq'|'tf'|'fill'|'multi',
 *            difficulty:1, tags:['concept'], stem, options:[{text, correct}], explain }
 * 目标：每章 7 题，全站 56 题；每题必须写 explain。
 * ===================================================================== */
(function () {
  'use strict';

  var PACK = {
    items: [
      /* ---------------- ch00 课程地图 ---------------- */
      {
        id: 'ch00-q1', ch: 'ch00', kp: 'ch00-2', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '本站把八章内容串成一条主线，下面哪条描述最准确？',
        options: [
          { text: '极限 → 导数 → 积分 → 微分方程' },
          { text: '级数 → 幂级数与泰勒 → 参数曲线与极坐标 → 向量与空间几何 → 偏导与多元极值 → 多重积分与三大定理', correct: true },
          { text: '矩阵 → 行列式 → 特征值 → 二次型' },
          { text: '概率 → 分布 → 期望 → 大数定律' }
        ],
        explain: '八章是一条递进链：先把「无限求和」讲清楚（ch01–ch03），再用参数与极坐标描述平面曲线（ch04），接着进入三维（ch05），然后在多元函数上做微分（ch06），最后用多重积分与格林、斯托克斯、散度定理把微分与积分合起来（ch07）。'
      },
      {
        id: 'ch00-q2', ch: 'ch00', kp: 'ch00-6', tier: 1, type: 'tf', difficulty: 1,
        tags: ['exam'],
        stem: '本课程的期中与期末都是闭卷考试，且不允许使用计算器。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '课程大纲写明考试为闭卷、无计算器。这意味着数值计算不会太复杂，重点考「判据选择」「公式记忆」与「推导步骤」，所以本站每章都把公式整理成表，并配了手算量适中的例题。'
      },
      {
        id: 'ch00-q3', ch: 'ch00', kp: 'ch00-7', tier: 1, type: 'multi', difficulty: 2,
        tags: ['exam'],
        stem: '关于本课程的成绩构成，下面哪些说法正确？（多选）',
        options: [
          { text: '作业占 20%，共 12 次、取最好的 11 次', correct: true },
          { text: 'quiz 占 10%，共 4 次、取最好的 3 次', correct: true },
          { text: '期中占 30%，期末占 40%', correct: true },
          { text: '出勤率单独占 10%' },
          { text: '期末占 60%，期中可以不算' }
        ],
        explain: '大纲给出的比例是作业 20%、quiz 10%、期中 30%、期末 40%，合计 100%；作业与 quiz 都允许各丢一次最低分。没有出勤分，期末也不是 60%。'
      },
      {
        id: 'ch00-q4', ch: 'ch00', kp: 'ch00-2', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '格林定理、斯托克斯定理与散度定理集中出现在哪一章？',
        options: [
          { text: '第 2 章 变号级数与幂级数' },
          { text: '第 5 章 向量与空间几何' },
          { text: '第 7 章 多重积分与向量场定理', correct: true },
          { text: '第 3 章 泰勒展开' }
        ],
        explain: '第 7 章先建立二重、三重积分与线面积分，再把三条定理作为「边界积分与内部积分互换」的统一结论给出。第 5 章的叉积与法向量是它们的计算工具，但不是定理本身。'
      },
      {
        id: 'ch00-q5', ch: 'ch00', kp: 'ch00-5', tier: 1, type: 'fill', difficulty: 1,
        tags: ['concept'],
        stem: '本课程主要教材是 Thomas 的 Calculus，SI 单位制，第 ___ 版。',
        answer: '13',
        accept: ['13', '第十三版', '13版'],
        explain: '课程大纲指定 Thomas’ Calculus, 13th edition, SI Units 为主教材，Stewart 的 Early Transcendentals 8e 为参考书。本站的章节编号也按 Thomas 第 13 版标注。'
      },
      {
        id: 'ch00-q6', ch: 'ch00', kp: 'ch00-3', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '下面哪个主题不在本课程的教学范围内？',
        options: [
          { text: '泰勒级数与余项估计' },
          { text: '极坐标下的面积与弧长' },
          { text: '常微分方程的级数解法', correct: true },
          { text: '散度定理与通量' }
        ],
        explain: '大纲覆盖 Thomas 第 10–16 章，止于向量场与三大定理；常微分方程的级数解法属于后续课程（或第 17 章），不在 MAT1002 的范围。'
      },
      {
        id: 'ch00-q7', ch: 'ch00', kp: 'ch00-4', tier: 1, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '学完本课程，你应当具备下面哪些能力？（多选）',
        options: [
          { text: '给定一个级数，选择合适的判据判断敛散并估计余项', correct: true },
          { text: '把二重、三重积分换到极坐标、柱坐标或球坐标计算', correct: true },
          { text: '判断向量场是否保守，并用格林、斯托克斯、散度定理解题', correct: true },
          { text: '证明黎曼猜想' },
          { text: '用有限元方法数值求解偏微分方程' }
        ],
        explain: '课程目标是「会算、会判、会用定理」，不涉及研究级证明或数值 PDE。三大定理也只要求会用，不要求独立证明。'
      },

      /* ---------------- ch01 数列与级数 ---------------- */
      {
        id: 'ch01-q1', ch: 'ch01', kp: 'ch01-3', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['compute'],
        stem: '几何级数 <code>Σ<sub>n=1</sub><sup>∞</sup> 3/4<sup>n</sup></code> 的和是多少？',
        options: [
          { text: '<code>1</code>', correct: true },
          { text: '<code>3/4</code>' },
          { text: '<code>4/3</code>' },
          { text: '发散' }
        ],
        explain: '首项 <code>a = 3/4</code>，公比 <code>r = 1/4</code>，和 <code>a/(1 − r) = (3/4)/(3/4) = 1</code>。注意首项不是 3：<code>n</code> 从 1 开始，第一项是 <code>3/4</code>。'
      },
      {
        id: 'ch01-q2', ch: 'ch01', kp: 'ch01-3', tier: 1, type: 'tf', difficulty: 1,
        tags: ['concept'],
        stem: '若 <code>a<sub>n</sub> → 0</code>，则级数 <code>Σ a<sub>n</sub></code> 一定收敛。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '错误。调和级数 <code>Σ1/n</code> 的通项趋于 0，但级数发散。正确的方向是「收敛 ⇒ 通项趋于 0」，反过来不成立。判断发散时可用它的逆否命题：通项不趋于 0 就一定发散。'
      },
      {
        id: 'ch01-q3', ch: 'ch01', kp: 'ch01-6', tier: 2, type: 'multi', difficulty: 2,
        tags: ['judge'],
        stem: '下面哪些级数收敛？（多选）',
        options: [
          { text: '<code>Σ 1/n<sup>2</sup></code>', correct: true },
          { text: '<code>Σ 1/n</code>' },
          { text: '<code>Σ 1/√n</code>' },
          { text: '<code>Σ (1/2)<sup>n</sup></code>', correct: true },
          { text: '<code>Σ 1/n<sup>3/2</sup></code>', correct: true }
        ],
        explain: '前三个是 p 级数：<code>p = 2</code> 与 <code>p = 3/2</code> 都大于 1，收敛；<code>p = 1</code> 是调和级数。等比级数公比 <code>1/2</code> 绝对值小于 1，收敛。<code>Σ1/√n</code> 的 <code>p = 1/2 &lt; 1</code>，发散。'
      },
      {
        id: 'ch01-q4', ch: 'ch01', kp: 'ch01-6', tier: 1, type: 'fill', difficulty: 1,
        tags: ['concept'],
        stem: 'p 级数 <code>Σ 1/n<sup>p</sup></code> 收敛的充要条件是 <code>p</code> ___ 1。',
        answer: '>',
        accept: ['>', '大于', '＞', '大于1'],
        explain: 'p 级数在 <code>p &gt; 1</code> 时收敛，在 <code>p ≤ 1</code> 时发散。这个结论由积分判别法得到：<code>∫<sub>1</sub><sup>∞</sup>x<sup>−p</sup>dx</code> 在 <code>p &gt; 1</code> 时收敛。'
      },
      {
        id: 'ch01-q5', ch: 'ch01', kp: 'ch01-4', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '使用积分判别法判断 <code>Σ a<sub>n</sub></code> 时，对 <code>f</code> 的要求是下面哪一组？',
        options: [
          { text: '<code>f</code> 连续、取正值、单调递减' },
          { text: '<code>f</code> 连续、取正值、单调递减，且 <code>f(n) = a<sub>n</sub></code>', correct: true },
          { text: '<code>f</code> 可导且 <code>f′ &gt; 0</code>' },
          { text: '<code>f</code> 有界即可' }
        ],
        explain: '积分判别法要求 <code>f</code> 在 <code>[1, ∞)</code> 上连续、取正值、单调递减，并且与通项对齐 <code>f(n) = a<sub>n</sub></code>。缺少单调性时积分与级数可能一个收敛一个发散。'
      },
      {
        id: 'ch01-q6', ch: 'ch01', kp: 'ch01-6', tier: 3, type: 'fill', difficulty: 3,
        tags: ['compute'],
        stem: '用积分估计 <code>Σ<sub>n=1</sub><sup>∞</sup>1/n<sup>2</sup></code> 的余项 <code>R<sub>N</sub> = Σ<sub>n=N+1</sub><sup>∞</sup>1/n<sup>2</sup></code>，取 <code>N = 10</code> 时上界为 ___（小数）。',
        answer: '0.1',
        accept: ['0.1', '1/10', '0.10'],
        explain: '余项被积分夹住：<code>R<sub>N</sub> &lt; ∫<sub>N</sub><sup>∞</sup>x<sup>−2</sup>dx = 1/N</code>。代入 <code>N = 10</code> 得 <code>0.1</code>。这个估计说明只需 10 项，误差就在 0.1 以内，收敛速度是 <code>1/N</code> 级。'
      },
      {
        id: 'ch01-q7', ch: 'ch01', kp: 'ch01-5', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['judge'],
        stem: '判断 <code>Σ (2n + 1)/(n<sup>3</sup> + 1)</code> 的敛散性，最合适的比较对象是？',
        options: [
          { text: '<code>Σ 1/n</code>' },
          { text: '<code>Σ 1/n<sup>2</sup></code>', correct: true },
          { text: '<code>Σ 1/2<sup>n</sup></code>' },
          { text: '<code>Σ 1/√n</code>' }
        ],
        explain: '分子是 <code>n</code> 的一次、分母是三次，通项与 <code>1/n<sup>2</sup></code> 同阶：<code>[(2n+1)/(n<sup>3</sup>+1)]/(1/n<sup>2</sup>) → 2</code>。极限比较判别法给出同敛散，而 <code>Σ1/n<sup>2</sup></code> 收敛，故原级数收敛。'
      },

      /* ---------------- ch02 变号级数与幂级数 ---------------- */
      {
        id: 'ch02-q1', ch: 'ch02', kp: 'ch02-1', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['judge'],
        stem: '级数 <code>Σ<sub>n=1</sub><sup>∞</sup> (−1)<sup>n+1</sup>/n</code> 属于下面哪一类？',
        options: [
          { text: '绝对收敛' },
          { text: '条件收敛', correct: true },
          { text: '发散' },
          { text: '无法判断' }
        ],
        explain: '取绝对值得到调和级数 <code>Σ1/n</code>，发散，所以不绝对收敛；由交错级数判别法，<code>b<sub>n</sub> = 1/n</code> 递减趋 0，级数收敛。收敛但不绝对收敛，称为条件收敛。'
      },
      {
        id: 'ch02-q2', ch: 'ch02', kp: 'ch02-1', tier: 1, type: 'tf', difficulty: 1,
        tags: ['concept'],
        stem: '若 <code>Σ|a<sub>n</sub>|</code> 收敛，则 <code>Σa<sub>n</sub></code> 一定收敛。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '正确，这就是绝对收敛蕴含收敛。证明用比较判别法：<code>0 ≤ a<sub>n</sub> + |a<sub>n</sub>| ≤ 2|a<sub>n</sub>|</code>，故 <code>Σ(a<sub>n</sub> + |a<sub>n</sub>|)</code> 收敛，再减去收敛的 <code>Σ|a<sub>n</sub>|</code>。反之不成立，交错调和级数是反例。'
      },
      {
        id: 'ch02-q3', ch: 'ch02', kp: 'ch02-3', tier: 2, type: 'multi', difficulty: 2,
        tags: ['judge'],
        stem: '要判断 <code>Σ n!/n<sup>n</sup></code> 收敛，下面哪些方法可行？（多选）',
        options: [
          { text: '比值判别法', correct: true },
          { text: '根值判别法', correct: true },
          { text: '交错级数判别法' },
          { text: '积分判别法（直接对 <code>n!/n<sup>n</sup></code>）' }
        ],
        explain: '比值 <code>a<sub>n+1</sub>/a<sub>n</sub> = (n/(n+1))<sup>n</sup> → 1/e &lt; 1</code>，收敛；根值法同样给 <code>1/e</code>。级数全是正项，没有交错结构；<code>n!/n<sup>n</sup></code> 也不是容易积分的连续函数，积分判别法不适用。'
      },
      {
        id: 'ch02-q4', ch: 'ch02', kp: 'ch02-2', tier: 3, type: 'fill', difficulty: 3,
        tags: ['compute'],
        stem: '交错级数 <code>Σ (−1)<sup>n+1</sup>/n</code> 用前 <code>N</code> 项近似，要使误差小于 <code>0.01</code>，<code>N</code> 至少取 ___。',
        answer: '100',
        accept: ['100', '100项'],
        explain: '交错级数的截断误差不超过第一个被舍去的项：<code>|R<sub>N</sub>| ≤ b<sub>N+1</sub> = 1/(N+1)</code>。要求 <code>1/(N+1) &lt; 0.01</code>，得 <code>N + 1 &gt; 100</code>，故 <code>N ≥ 100</code>。'
      },
      {
        id: 'ch02-q5', ch: 'ch02', kp: 'ch02-3', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '用比值判别法算得 <code>L = 1</code>，可以得到什么结论？',
        options: [
          { text: '级数收敛' },
          { text: '级数发散' },
          { text: '判别法失效，需要用别的方法', correct: true },
          { text: '级数和为 1' }
        ],
        explain: '<code>L = 1</code> 是临界情形，比值与根值判别法都给不出结论。典型例子：<code>Σ1/n</code>（发散）与 <code>Σ1/n<sup>2</sup></code>（收敛）的比值极限都是 1。此时应改用比较、积分或交错级数判别法。'
      },
      {
        id: 'ch02-q6', ch: 'ch02', kp: 'ch02-6', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['compute'],
        stem: '幂级数 <code>Σ<sub>n=1</sub><sup>∞</sup> x<sup>n</sup>/n</code> 的收敛区间是？',
        options: [
          { text: '<code>(−1, 1)</code>' },
          { text: '<code>[−1, 1]</code>' },
          { text: '<code>[−1, 1)</code>', correct: true },
          { text: '<code>(−1, 1]</code>' }
        ],
        explain: '先由比值法得半径 <code>R = 1</code>，区间 <code>(−1, 1)</code>。端点单独看：<code>x = 1</code> 得调和级数，发散；<code>x = −1</code> 得交错调和级数，收敛。合并得 <code>[−1, 1)</code>。'
      },
      {
        id: 'ch02-q7', ch: 'ch02', kp: 'ch02-5', tier: 3, type: 'fill', difficulty: 3,
        tags: ['compute'],
        stem: '幂级数 <code>Σ n! x<sup>n</sup></code> 的收敛半径 <code>R</code> = ___。',
        answer: '0',
        accept: ['0', '零'],
        explain: '比值 <code>|a<sub>n+1</sub>/a<sub>n</sub>| = (n+1)|x|</code>，只要 <code>x ≠ 0</code> 就趋于无穷，级数发散；<code>x = 0</code> 时每项为 0，和也是 0。所以只在一点收敛，<code>R = 0</code>。'
      },

      /* ---------------- ch03 泰勒展开 ---------------- */
      {
        id: 'ch03-q1', ch: 'ch03', kp: 'ch03-3', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '<code>e<sup>x</sup></code> 的麦克劳林级数是下面哪一个？',
        options: [
          { text: '<code>Σ x<sup>n</sup></code>' },
          { text: '<code>Σ x<sup>n</sup>/n!</code>', correct: true },
          { text: '<code>Σ (−1)<sup>n</sup>x<sup>n</sup>/n!</code>' },
          { text: '<code>Σ x<sup>2n</sup>/(2n)!</code>' }
        ],
        explain: '<code>e<sup>x</sup> = 1 + x + x<sup>2</sup>/2! + x<sup>3</sup>/3! + …</code>，系数全为正、全为 <code>1/n!</code>。第二项是巧合的几何级数（只在 <code>|x| &lt; 1</code> 收敛），第三项是 <code>e<sup>−x</sup></code>，第四项是 <code>cosh x</code>。'
      },
      {
        id: 'ch03-q2', ch: 'ch03', kp: 'ch03-4', tier: 2, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: '对同一个函数，泰勒多项式的次数越高，在任意点的误差一定越小。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '错误。只有当点落在收敛区间内、且余项趋于 0 时，增加次数才会改善近似；在收敛半径之外，泰勒多项式可能越算越偏。即使在收敛域内，误差也未必逐次单调下降，需要用余项公式单独估计。'
      },
      {
        id: 'ch03-q3', ch: 'ch03', kp: 'ch03-3', tier: 2, type: 'fill', difficulty: 2,
        tags: ['concept'],
        stem: '<code>sin x</code> 的麦克劳林展开中，<code>x<sup>5</sup></code> 项的系数是 ___。',
        answer: '1/120',
        accept: ['1/120', '0.008333', '1/5!'],
        explain: '<code>sin x = x − x<sup>3</sup>/3! + x<sup>5</sup>/5! − …</code>，所以 <code>x<sup>5</sup></code> 的系数是 <code>1/5! = 1/120</code>。符号规律是正负交替，且只出现奇次幂。'
      },
      {
        id: 'ch03-q4', ch: 'ch03', kp: 'ch03-2', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '带拉格朗日余项的泰勒公式中，余项 <code>R<sub>n</sub>(x)</code> 的正确形式是？',
        options: [
          { text: '<code>f<sup>(n+1)</sup>(c) x<sup>n+1</sup>/(n+1)!</code>，<code>c</code> 在 0 与 <code>x</code> 之间', correct: true },
          { text: '<code>f<sup>(n)</sup>(c) x<sup>n</sup>/n!</code>，<code>c</code> 任意' },
          { text: '<code>f<sup>(n+1)</sup>(x) x<sup>n</sup>/n!</code>' },
          { text: '<code>f(c) x<sup>n+1</sup>/(n+1)</code>' }
        ],
        explain: '拉格朗日余项是「下一项的形状，但导数在中间点取值」：<code>R<sub>n</sub> = f<sup>(n+1)</sup>(c)x<sup>n+1</sup>/(n+1)!</code>，<code>c</code> 位于展开点与 <code>x</code> 之间。它把误差转化为「导数的界 × 幂次」，是估计误差的主要工具。'
      },
      {
        id: 'ch03-q5', ch: 'ch03', kp: 'ch03-3', tier: 2, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '下面哪些展开式是正确的？（多选）',
        options: [
          { text: '<code>ln(1+x) = x − x<sup>2</sup>/2 + x<sup>3</sup>/3 − …</code>', correct: true },
          { text: '<code>cos x = 1 − x<sup>2</sup>/2! + x<sup>4</sup>/4! − …</code>', correct: true },
          { text: '<code>arctan x = x − x<sup>3</sup>/3 + x<sup>5</sup>/5 − …</code>', correct: true },
          { text: '<code>1/(1−x) = 1 + x + x<sup>2</sup> + …</code>（<code>|x| &lt; 1</code>）', correct: true },
          { text: '<code>ln(1+x) = x + x<sup>2</sup>/2 + x<sup>3</sup>/3 + …</code>' }
        ],
        explain: '前四个都对：对数与反正切是交错符号的积分型展开，余弦只含偶次幂，几何级数在 <code>|x| &lt; 1</code> 内成立。最后一项符号全错——那是 <code>−ln(1−x)</code> 的展开。'
      },
      {
        id: 'ch03-q6', ch: 'ch03', kp: 'ch03-4', tier: 3, type: 'fill', difficulty: 3,
        tags: ['compute'],
        stem: '用 <code>1 + x</code> 近似 <code>e<sup>x</sup></code>，在 <code>x = 0.1</code> 处误差的上界约为 ___（保留三位小数）。',
        answer: '0.006',
        accept: ['0.006', '0.0055', '0.005', '0.00551'],
        explain: '一阶余项 <code>R<sub>1</sub> = e<sup>c</sup>x<sup>2</sup>/2</code>，<code>c ∈ (0, 0.1)</code>，故 <code>R<sub>1</sub> ≤ e<sup>0.1</sup>·0.01/2 ≈ 1.105 × 0.005 ≈ 0.0055</code>。实际误差约 <code>0.00517</code>，与估计吻合。'
      },
      {
        id: 'ch03-q7', ch: 'ch03', kp: 'ch03-5', tier: 3, type: 'mcq', difficulty: 3,
        tags: ['compute'],
        stem: '利用泰勒展开计算 <code>lim<sub>x→0</sub> (sin x − x)/x<sup>3</sup></code>，结果是？',
        options: [
          { text: '<code>0</code>' },
          { text: '<code>−1/6</code>', correct: true },
          { text: '<code>1/6</code>' },
          { text: '不存在' }
        ],
        explain: '<code>sin x = x − x<sup>3</sup>/6 + o(x<sup>3</sup>)</code>，所以 <code>sin x − x = −x<sup>3</sup>/6 + o(x<sup>3</sup>)</code>，除以 <code>x<sup>3</sup></code> 后极限为 <code>−1/6</code>。用洛必达法则求三次也行，但展开更快、更不易错。'
      },

      /* ---------------- ch04 参数曲线与极坐标 ---------------- */
      {
        id: 'ch04-q1', ch: 'ch04', kp: 'ch04-4', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '极坐标方程 <code>r = 2cos θ</code> 表示的是什么曲线？',
        options: [
          { text: '圆心在 <code>(1, 0)</code>、半径为 1 的圆', correct: true },
          { text: '圆心在原点、半径为 2 的圆' },
          { text: '心形线' },
          { text: '三瓣玫瑰线' }
        ],
        explain: '两边乘 <code>r</code> 得 <code>r<sup>2</sup> = 2r cos θ</code>，即 <code>x<sup>2</sup> + y<sup>2</sup> = 2x</code>，配方为 <code>(x − 1)<sup>2</sup> + y<sup>2</sup> = 1</code>。它是过极点、圆心在 <code>(1, 0)</code> 的圆。凡 <code>r = 2a cos θ</code> 或 <code>r = 2a sin θ</code> 都是圆。'
      },
      {
        id: 'ch04-q2', ch: 'ch04', kp: 'ch04-5', tier: 2, type: 'fill', difficulty: 2,
        tags: ['compute'],
        stem: '圆 <code>r = 2cos θ</code> 围成的面积是 ___。',
        answer: 'π',
        accept: ['π', 'pi', '3.14'],
        explain: '面积 <code>A = 1/2∫<sub>−π/2</sub><sup>π/2</sup>(2cos θ)<sup>2</sup>dθ = 2∫<sub>−π/2</sub><sup>π/2</sup>cos<sup>2</sup>θ dθ = 2 · (π/2) = π</code>。与「半径 1 的圆面积 <code>π</code>」一致，可作为换元正确性的自检。'
      },
      {
        id: 'ch04-q3', ch: 'ch04', kp: 'ch04-4', tier: 2, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: '玫瑰线 <code>r = cos 3θ</code> 恰好有 3 个花瓣。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '正确。<code>n</code> 为奇数时 <code>r = cos nθ</code> 有 <code>n</code> 个花瓣；<code>n</code> 为偶数时有 <code>2n</code> 个花瓣。原因是 <code>n</code> 为偶数时，<code>θ</code> 转过 <code>π</code> 后 <code>r</code> 取到相反值，同一花瓣被画了两次，需要 <code>2π</code> 才闭合。'
      },
      {
        id: 'ch04-q4', ch: 'ch04', kp: 'ch04-2', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '参数曲线 <code>r(t)</code> 从 <code>t = a</code> 到 <code>t = b</code> 的弧长公式是？',
        options: [
          { text: '<code>∫<sub>a</sub><sup>b</sup> |r′(t)| dt</code>', correct: true },
          { text: '<code>∫<sub>a</sub><sup>b</sup> r(t) dt</code>' },
          { text: '<code>|r(b) − r(a)|</code>' },
          { text: '<code>∫<sub>a</sub><sup>b</sup> |r″(t)| dt</code>' }
        ],
        explain: '弧长是「速度的模」的积分：<code>s = ∫|r′(t)|dt</code>。第二项是向量积分，没有几何意义；第三项是弦长，只有当曲线是直线段时才等于弧长；第四项与加速度有关，不是弧长。'
      },
      {
        id: 'ch04-q5', ch: 'ch04', kp: 'ch04-4', tier: 2, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '下面哪些是极坐标曲线的标准名称与方程的正确配对？（多选）',
        options: [
          { text: '心形线：<code>r = 1 + cos θ</code>', correct: true },
          { text: '三瓣玫瑰线：<code>r = cos 3θ</code>', correct: true },
          { text: '圆：<code>r = 2cos θ</code>', correct: true },
          { text: '蜗线：<code>r = 1 + 2cos θ</code>', correct: true },
          { text: '螺旋线：<code>r = cos θ</code>' }
        ],
        explain: '前四项都是标准曲线：心形线是蜗线的特例（内外比例 1:1），<code>r = 1 + 2cos θ</code> 带内环。<code>r = cos θ</code> 是圆而不是螺旋线；真正的阿基米德螺线是 <code>r = θ</code>。'
      },
      {
        id: 'ch04-q6', ch: 'ch04', kp: 'ch04-5', tier: 3, type: 'fill', difficulty: 3,
        tags: ['compute'],
        stem: '心形线 <code>r = 1 + cos θ</code> 围成的面积是 ___。',
        answer: '3π/2',
        accept: ['3π/2', '1.5π', '3π/2', '4.712'],
        explain: '<code>A = 1/2∫<sub>0</sub><sup>2π</sup>(1 + cos θ)<sup>2</sup>dθ = 1/2∫(1 + 2cos θ + cos<sup>2</sup>θ)dθ</code>。一个周期上 <code>∫cos θ = 0</code>、<code>∫cos<sup>2</sup>θ = π</code>，故 <code>A = 1/2(2π + π) = 3π/2</code>。'
      },
      {
        id: 'ch04-q7', ch: 'ch04', kp: 'ch04-2', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '参数曲线 <code>x = f(t), y = g(t)</code> 的切线斜率 <code>dy/dx</code> 等于？',
        options: [
          { text: '<code>g′(t)/f′(t)</code>（<code>f′(t) ≠ 0</code>）', correct: true },
          { text: '<code>f′(t)/g′(t)</code>' },
          { text: '<code>g(t)/f(t)</code>' },
          { text: '<code>g″(t)/f″(t)</code>' }
        ],
        explain: '由链式法则 <code>dy/dt = (dy/dx)(dx/dt)</code>，所以 <code>dy/dx = (dy/dt)/(dx/dt) = g′(t)/f′(t)</code>。<code>f′(t) = 0</code> 时切线竖直，斜率不存在，要单独讨论。'
      },

      /* ---------------- ch05 向量与空间几何 ---------------- */
      {
        id: 'ch05-q1', ch: 'ch05', kp: 'ch05-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '两个向量 <code>a, b</code> 的叉积模长 <code>|a × b|</code> 的几何意义是？',
        options: [
          { text: '以 <code>a, b</code> 为邻边的平行四边形的面积', correct: true },
          { text: '以 <code>a, b</code> 为邻边的三角形的面积' },
          { text: '<code>a</code> 在 <code>b</code> 上的投影长度' },
          { text: '<code>a, b</code> 的夹角余弦' }
        ],
        explain: '<code>|a × b| = |a||b|sin θ</code>，正是平行四边形面积；三角形面积是它的一半。点积给的是投影与夹角余弦，不要与叉积混淆。'
      },
      {
        id: 'ch05-q2', ch: 'ch05', kp: 'ch05-1', tier: 2, type: 'fill', difficulty: 2,
        tags: ['compute'],
        stem: '向量 <code>a = ⟨1, 0, 0⟩</code>、<code>b = ⟨0, 2, 0⟩</code>、<code>c = ⟨0, 0, 3⟩</code> 张成的平行六面体体积是 ___。',
        answer: '6',
        accept: ['6', '6立方单位'],
        explain: '体积等于混合积的绝对值：<code>|a · (b × c)| = |1 × (2 × 3)| = 6</code>。三个向量两两垂直，所以体积就是三个模长之积 <code>1 × 2 × 3 = 6</code>，可用来验证公式。'
      },
      {
        id: 'ch05-q3', ch: 'ch05', kp: 'ch05-1', tier: 1, type: 'tf', difficulty: 1,
        tags: ['concept'],
        stem: '两个非零向量垂直的充要条件是它们的点积为 0。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '正确。<code>a · b = |a||b|cos θ</code>，两个模长都非零，点积为 0 当且仅当 <code>cos θ = 0</code>，即 <code>θ = π/2</code>。注意「非零」不能省，零向量与任何向量的点积都是 0，但零向量没有方向。'
      },
      {
        id: 'ch05-q4', ch: 'ch05', kp: 'ch05-2', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['compute'],
        stem: '过点 <code>(1, 0, 0)</code> 且法向量为 <code>⟨1, 2, 3⟩</code> 的平面方程是？',
        options: [
          { text: '<code>x + 2y + 3z = 1</code>', correct: true },
          { text: '<code>x + 2y + 3z = 0</code>' },
          { text: '<code>(x − 1) + 2y + 3z = 0</code>' },
          { text: '<code>x + 2y + 3z = 6</code>' }
        ],
        explain: '点法式：<code>1(x − 1) + 2(y − 0) + 3(z − 0) = 0</code>，展开即 <code>x + 2y + 3z = 1</code>。第三项其实是同一个方程未展开的形式，但作为「平面方程」不规范；常数项由代入点决定。'
      },
      {
        id: 'ch05-q5', ch: 'ch05', kp: 'ch05-3', tier: 2, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '下面哪些曲面是二次曲面？（多选）',
        options: [
          { text: '椭球面 <code>x<sup>2</sup>/a<sup>2</sup> + y<sup>2</sup>/b<sup>2</sup> + z<sup>2</sup>/c<sup>2</sup> = 1</code>', correct: true },
          { text: '双叶双曲面 <code>z<sup>2</sup>/c<sup>2</sup> − x<sup>2</sup>/a<sup>2</sup> − y<sup>2</sup>/b<sup>2</sup> = 1</code>', correct: true },
          { text: '椭圆抛物面 <code>z = x<sup>2</sup>/a<sup>2</sup> + y<sup>2</sup>/b<sup>2</sup></code>', correct: true },
          { text: '双曲抛物面（马鞍面）<code>z = y<sup>2</sup>/b<sup>2</sup> − x<sup>2</sup>/a<sup>2</sup></code>', correct: true },
          { text: '环面（甜甜圈）' }
        ],
        explain: '二次曲面是三元二次方程定义的曲面，前四种都是标准形。环面由四次方程定义，不属于二次曲面；它虽然也是旋转曲面，但分类上另属一类。'
      },
      {
        id: 'ch05-q6', ch: 'ch05', kp: 'ch05-5', tier: 2, type: 'fill', difficulty: 2,
        tags: ['compute'],
        stem: '圆 <code>r(t) = ⟨2cos t, 2sin t, 0⟩</code> 的曲率是 ___。',
        answer: '1/2',
        accept: ['1/2', '0.5'],
        explain: '半径 <code>R = 2</code> 的圆，曲率恒为 <code>1/R = 1/2</code>。也可用公式验证：<code>r′ = ⟨−2sin t, 2cos t, 0⟩</code>，<code>|r′| = 2</code>，<code>r″ = −r</code>，<code>|r′ × r″| = 4</code>，故 <code>κ = 4/8 = 1/2</code>。'
      },
      {
        id: 'ch05-q7', ch: 'ch05', kp: 'ch05-5', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '空间曲线的曲率公式是下面哪一个？',
        options: [
          { text: '<code>κ = |r′ × r″|/|r′|<sup>3</sup></code>', correct: true },
          { text: '<code>κ = |r′ · r″|/|r′|<sup>2</sup></code>' },
          { text: '<code>κ = |r″|/|r′|</code>' },
          { text: '<code>κ = |r′ × r″|/|r′|<sup>2</sup></code>' }
        ],
        explain: '曲率衡量「单位弧长上切向量转过的角度」，公式为 <code>κ = |r′ × r″|/|r′|<sup>3</sup></code>。等价形式 <code>κ = |T′|/|r′|</code>。分母是三次，因为要把「对参数 t 的导数」换算成「对弧长 s 的导数」。'
      },

      /* ---------------- ch06 偏导数与极值 ---------------- */
      {
        id: 'ch06-q1', ch: 'ch06', kp: 'ch06-2', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '函数 <code>f(x, y) = xy/(x<sup>2</sup> + y<sup>2</sup>)</code>（原点处补定义为 0）在原点处？',
        options: [
          { text: '两个偏导数都存在，但不连续' },
          { text: '两个偏导数都存在，且连续' },
          { text: '偏导数不存在，但连续' },
          { text: '两个偏导数都存在，但不连续；因此不可微', correct: true }
        ],
        explain: '沿坐标轴 <code>f(x, 0) = 0</code>，故 <code>f<sub>x</sub>(0,0) = f<sub>y</sub>(0,0) = 0</code>。但沿 <code>y = x</code> 有 <code>f = 1/2</code>，沿 <code>y = −x</code> 有 <code>f = −1/2</code>，极限不存在，故不连续，也不可微。这说明「偏导存在」远弱于「可微」。'
      },
      {
        id: 'ch06-q2', ch: 'ch06', kp: 'ch06-4', tier: 1, type: 'tf', difficulty: 1,
        tags: ['concept'],
        stem: '梯度 <code>∇f</code> 在每一点都垂直于过该点的等值线（等值面）。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '正确。沿等值线方向的方向导数为 0，而方向导数等于 <code>∇f · u</code>，故 <code>∇f</code> 与等值线的切向垂直。这也是「梯度指向函数增长最快的方向」的几何来源。'
      },
      {
        id: 'ch06-q3', ch: 'ch06', kp: 'ch06-2', tier: 2, type: 'fill', difficulty: 2,
        tags: ['compute'],
        stem: '<code>f(x, y) = x<sup>2</sup>y</code>，则混合偏导 <code>f<sub>xy</sub></code> = ___。',
        answer: '2x',
        accept: ['2x', '2*x'],
        explain: '先对 <code>x</code> 求偏导得 <code>f<sub>x</sub> = 2xy</code>，再对 <code>y</code> 求偏导得 <code>f<sub>xy</sub> = 2x</code>。先对 <code>y</code> 后对 <code>x</code> 结果相同（<code>f<sub>yx</sub> = 2x</code>），这体现了混合偏导相等的定理（在偏导连续时成立）。'
      },
      {
        id: 'ch06-q4', ch: 'ch06', kp: 'ch06-4', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '在一点处，方向导数最大的方向是？',
        options: [
          { text: '梯度的方向', correct: true },
          { text: '与梯度垂直的方向' },
          { text: '与梯度相反的方向' },
          { text: '任意方向都一样' }
        ],
        explain: '<code>D<sub>u</sub>f = ∇f · u = |∇f|cos θ</code>，当 <code>u</code> 与 <code>∇f</code> 同向时取最大值 <code>|∇f|</code>。与梯度相反时取最小值 <code>−|∇f|</code>，垂直时为 0（沿等值线方向）。'
      },
      {
        id: 'ch06-q5', ch: 'ch06', kp: 'ch06-6', tier: 2, type: 'multi', difficulty: 2,
        tags: ['judge'],
        stem: '设 <code>D = f<sub>xx</sub>f<sub>yy</sub> − f<sub>xy</sub><sup>2</sup></code> 在临界点处取值，下面哪些判断正确？（多选）',
        options: [
          { text: '<code>D &gt; 0</code> 且 <code>f<sub>xx</sub> &gt; 0</code>：极小值', correct: true },
          { text: '<code>D &gt; 0</code> 且 <code>f<sub>xx</sub> &lt; 0</code>：极大值', correct: true },
          { text: '<code>D &lt; 0</code>：鞍点', correct: true },
          { text: '<code>D = 0</code>：判别法失效，需要进一步分析', correct: true },
          { text: '<code>D &gt; 0</code>：一定是极大值' }
        ],
        explain: '二阶判别法：<code>D &gt; 0</code> 时看 <code>f<sub>xx</sub></code> 的符号定极大或极小；<code>D &lt; 0</code> 时曲面在该点「一升一降」，是鞍点；<code>D = 0</code> 时二阶信息不足，要回到定义或高阶项。'
      },
      {
        id: 'ch06-q6', ch: 'ch06', kp: 'ch06-7', tier: 3, type: 'fill', difficulty: 3,
        tags: ['compute'],
        stem: '在约束 <code>x + y = 10</code> 下，<code>f(x, y) = xy</code> 的最大值是 ___。',
        answer: '25',
        accept: ['25', '25（x=y=5）'],
        explain: '拉格朗日条件 <code>∇f = λ∇g</code> 给 <code>y = λ</code>、<code>x = λ</code>，故 <code>x = y</code>；代入约束得 <code>x = y = 5</code>，最大值 <code>25</code>。也可用 <code>y = 10 − x</code> 代入得二次函数 <code>x(10 − x)</code>，顶点在 <code>x = 5</code>。'
      },
      {
        id: 'ch06-q7', ch: 'ch06', kp: 'ch06-3', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '<code>z = f(x, y)</code>，而 <code>x = x(t), y = y(t)</code>，则 <code>dz/dt</code> 等于？',
        options: [
          { text: '<code>f<sub>x</sub>x′ + f<sub>y</sub>y′</code>', correct: true },
          { text: '<code>f<sub>x</sub>y′ + f<sub>y</sub>x′</code>' },
          { text: '<code>f<sub>x</sub> + f<sub>y</sub></code>' },
          { text: '<code>f<sub>xx</sub>x′ + f<sub>yy</sub>y′</code>' }
        ],
        explain: '多元链式法则：<code>dz/dt = (∂z/∂x)(dx/dt) + (∂z/∂y)(dy/dt)</code>。可以画依赖树帮助记忆：<code>t</code> 分出两条路径，每条路径「沿途的偏导相乘」，最后相加。'
      },

      /* ---------------- ch07 多重积分与向量场 ---------------- */
      {
        id: 'ch07-q1', ch: 'ch07', kp: 'ch07-2', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '极坐标下，面积元 <code>dA</code> 的正确写法是？',
        options: [
          { text: '<code>dr dθ</code>' },
          { text: '<code>r dr dθ</code>', correct: true },
          { text: '<code>r<sup>2</sup> dr dθ</code>' },
          { text: '<code>dr dθ/r</code>' }
        ],
        explain: '换元 <code>x = r cos θ, y = r sin θ</code> 的雅可比行列式是 <code>r</code>，所以 <code>dA = r dr dθ</code>。几何上，小扇形面积约为 <code>r Δr Δθ</code>；量纲检查也要求有一个长度因子 <code>r</code>。'
      },
      {
        id: 'ch07-q2', ch: 'ch07', kp: 'ch07-3', tier: 2, type: 'fill', difficulty: 2,
        tags: ['concept'],
        stem: '球坐标体积元 <code>dV = ρ<sup>2</sup>sin ___ dρ dφ dθ</code>，横线处应填 ___。',
        answer: 'φ',
        accept: ['φ', 'phi', '极角'],
        explain: '球坐标中 <code>φ</code> 是从 z 轴量起的极角，<code>θ</code> 是 xy 平面内的方位角。体积元里的 <code>sin φ</code> 来自「纬度圈半径 <code>ρ sin φ</code>」——<code>φ</code> 越接近 0 或 <code>π</code>，同样的 <code>dφdθ</code> 扫出的体积越小。'
      },
      {
        id: 'ch07-q3', ch: 'ch07', kp: 'ch07-5', tier: 1, type: 'tf', difficulty: 1,
        tags: ['concept'],
        stem: '保守场中的线积分只与起点、终点有关，与路径无关。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '正确。若 <code>F = ∇f</code>，则 <code>∫<sub>C</sub>F·dr = f(终点) − f(起点)</code>（微积分基本定理的线积分版），路径只影响过程不影响结果。等价地，沿任何闭曲线的环量为 0。'
      },
      {
        id: 'ch07-q4', ch: 'ch07', kp: 'ch07-6', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '使用格林定理 <code>∮<sub>C</sub>Pdx + Qdy = ∬<sub>D</sub>(Q<sub>x</sub> − P<sub>y</sub>)dA</code> 时，边界 <code>C</code> 的正向是？',
        options: [
          { text: '逆时针方向', correct: true },
          { text: '顺时针方向' },
          { text: '由内向外' },
          { text: '任意方向都可以' }
        ],
        explain: '正向约定为「沿边界走时区域在左手边」，对平面区域就是逆时针。若题目给的曲线是顺时针，应用定理后要在右边加负号。这是本章最常见的符号错误来源。'
      },
      {
        id: 'ch07-q5', ch: 'ch07', kp: 'ch07-5', tier: 3, type: 'multi', difficulty: 3,
        tags: ['judge'],
        stem: '下面哪些向量场在指定区域上是保守场？（多选）',
        options: [
          { text: '<code>F = ⟨2xy, x<sup>2</sup> + 3y<sup>2</sup>⟩</code>，整个平面', correct: true },
          { text: '<code>F = ⟨y, x⟩</code>，整个平面', correct: true },
          { text: '<code>F = ⟨x, y⟩</code>，整个平面', correct: true },
          { text: '<code>F = ⟨−y, x⟩</code>，整个平面' },
          { text: '<code>F = ⟨−y, x⟩/(x<sup>2</sup> + y<sup>2</sup>)</code>，挖掉原点的平面' }
        ],
        explain: '前三个都满足 <code>P<sub>y</sub> = Q<sub>x</sub></code> 且区域单连通，可求出势函数（分别是 <code>x<sup>2</sup>y + y<sup>3</sup></code>、<code>xy</code>、<code>(x<sup>2</sup>+y<sup>2</sup>)/2</code>）。<code>⟨−y, x⟩</code> 的 <code>Q<sub>x</sub> − P<sub>y</sub> = 2</code>，不是零；最后一个虽然 <code>P<sub>y</sub> = Q<sub>x</sub></code>，但区域不单连通，绕原点的环量为 <code>2π</code>，所以不是保守场。'
      },
      {
        id: 'ch07-q6', ch: 'ch07', kp: 'ch07-7', tier: 3, type: 'fill', difficulty: 3,
        tags: ['compute'],
        stem: '<code>F = ⟨x, y, z⟩</code> 穿过单位球面（外法向）的通量是 ___。',
        answer: '4π',
        accept: ['4π', '4pi', '12.57'],
        explain: '<code>div F = 1 + 1 + 1 = 3</code>，由散度定理通量 <code>= ∭<sub>V</sub>3 dV = 3 × (4π/3) = 4π</code>。若直接做面积分，要在球面上参数化、算叉积，工作量大约是十倍——这正是散度定理的价值。'
      },
      {
        id: 'ch07-q7', ch: 'ch07', kp: 'ch07-7', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '斯托克斯定理把下面的哪两种积分联系起来？',
        options: [
          { text: '沿闭曲线的环量与旋度在曲面上的通量', correct: true },
          { text: '闭曲面上的通量与体积分' },
          { text: '平面区域上的二重积分与边界曲线积分' },
          { text: '曲线弧长与曲率' }
        ],
        explain: '<code>∮<sub>C</sub>F·dr = ∬<sub>S</sub>(curl F)·n dS</code>，联系「边界曲线上的环量」与「曲面上旋度的通量」。第二项描述的是散度定理，第三项是格林定理（斯托克斯的平面特例），第四项与本章无关。'
      }
    ]
  };

  CSC._quizPack = PACK;
  CSC.registerQuizPack(PACK);
})();
