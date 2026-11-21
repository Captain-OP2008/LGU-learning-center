/* =====================================================================
 * quiz.js · STA2001 分章题库
 * 结构：{ items:[{ id, ch, kp, tier, type, difficulty, tags, stem,
 *                  options?, answer?, accept?, explain }] }
 * 题型：mcq / tf / fill / multi
 * 覆盖：ch00–ch07，每章 7 题，共 56 题
 * ===================================================================== */
(function () {
  'use strict';

  var PACK = {
    items: [
      /* ---------------- ch00 课程地图 ---------------- */
      {
        id: 'ch00-q1', ch: 'ch00', kp: 'ch00-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '概率论与数理统计最核心的区别是什么？',
        options: [
          { text: '概率论研究连续变量，统计学研究离散变量' },
          { text: '概率论从已知模型推出数据的性质，统计学从数据反推模型中的未知参数', correct: true },
          { text: '概率论只需要加法法则，统计学需要微积分' },
          { text: '两者完全相同，只是名称不同' }
        ],
        explain: '概率论是「模型 → 数据」：给定分布，算事件概率、期望、方差。统计学是「数据 → 模型」：拿到样本，猜总体参数、给区间、做检验。本站八章正是沿这条主线排列的。'
      },
      {
        id: 'ch00-q2', ch: 'ch00', kp: 'ch00-3', tier: 1, type: 'tf', difficulty: 1,
        tags: ['concept'],
        stem: '样本均值 <code>x̄</code> 是统计量，总体均值 <code>μ</code> 是参数。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '统计量是样本的函数，只由数据决定、不含未知参数；参数是总体的固定常数。所以 <code>x̄</code> 随抽样变化，<code>μ</code> 不变——这正是置信区间解释的关键。'
      },
      {
        id: 'ch00-q3', ch: 'ch00', kp: 'ch00-4', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['compute'],
        stem: '灯泡例子中 <code>n=25</code>、<code>S=200</code>，样本均值的标准误是多少？',
        options: [
          { text: '8' },
          { text: '40', correct: true },
          { text: '200' },
          { text: '1020' }
        ],
        explain: '<code>SE = S/√n = 200/5 = 40</code>。标准误衡量的是「<code>x̄</code> 这个估计量的波动」，不是单个灯泡的波动；<code>n</code> 越大它越小。'
      },
      {
        id: 'ch00-q4', ch: 'ch00', kp: 'ch00-2', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '按本站的章节依赖，学第 7 章「统计推断」之前最应该先掌握哪一章？',
        options: [
          { text: '第 6 章「抽样分布与极限定理」', correct: true },
          { text: '第 1 章「概率的语言」' },
          { text: '第 5 章「多维随机变量」' },
          { text: '第 0 章「课程地图」' }
        ],
        explain: '区间与检验的临界值全部来自抽样分布（<code>z</code>、<code>t</code>、<code>χ²</code>、<code>F</code>），而这些分布由第 6 章的正态抽样理论与 CLT 推出。跳过第 6 章直接学第 7 章，只能背公式而不知道公式从哪来。'
      },
      {
        id: 'ch00-q5', ch: 'ch00', kp: 'ch00-6', tier: 1, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '下面哪些数学工具是本课程会反复用到的？',
        options: [
          { text: '求和号与多重求和的换序', correct: true },
          { text: '一元与多元积分（求密度、求期望）', correct: true },
          { text: '偏导数与极值（求极大似然）', correct: true },
          { text: '复变函数与留数定理' }
        ],
        explain: '概率部分主要用求和、积分、二重积分与偏导；统计部分额外用到分位数与不等式。复变函数不在本课程范围内，考试也不会涉及。'
      },
      {
        id: 'ch00-q6', ch: 'ch00', kp: 'ch00-5', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '课程的三条主线通常被概括为下列哪一组？',
        options: [
          { text: '概率模型 → 随机变量与分布 → 统计推断', correct: true },
          { text: '集合论 → 微积分 → 线性代数' },
          { text: '描述统计 → 回归分析 → 机器学习' },
          { text: '排列组合 → 数论 → 图论' }
        ],
        explain: '第一条线建立概率模型与公理（ch01–ch02），第二条线用随机变量描述不确定性（ch03–ch05），第三条线由样本推断总体（ch06–ch07）。回归与机器学习是后续课程，不在本站范围。'
      },
      {
        id: 'ch00-q7', ch: 'ch00', kp: 'ch00-8', tier: 1, type: 'tf', difficulty: 1,
        tags: ['concept'],
        stem: '本站的资料库按「学习资料 / 作业习题 / 考试资料」三类组织，原始文件来自课程目录。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '资料库不是装饰：讲义对应每章的概念，习题解答对应计算训练，历年卷对应题型与难度。建议每学完一章就打开对应的 Lecture 与 Tutorial 对照，而不是等到考前。'
      },

      /* ---------------- ch01 概率的语言 ---------------- */
      {
        id: 'ch01-q1', ch: 'ch01', kp: 'ch01-3', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['compute'],
        stem: '掷两枚公平骰子，点数之和为 7 的概率是多少？',
        options: [
          { text: '<code>1/12</code>' },
          { text: '<code>1/6</code>', correct: true },
          { text: '<code>7/36</code>' },
          { text: '<code>1/2</code>' }
        ],
        explain: '样本空间 36 个等可能结果，和为 7 的有 (1,6)(2,5)(3,4)(4,3)(5,2)(6,1) 共 6 个，概率 <code>6/36 = 1/6</code>。和为 7 是出现方式最多的一种，所以概率最大。'
      },
      {
        id: 'ch01-q2', ch: 'ch01', kp: 'ch01-2', tier: 1, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: '对任意两个事件 <code>A</code>、<code>B</code>，都有 <code>P(A∪B) = P(A) + P(B)</code>。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '只有当 <code>A</code> 与 <code>B</code> 互斥（<code>A∩B=∅</code>）时才能直接相加。一般情形是容斥公式 <code>P(A∪B)=P(A)+P(B)-P(A∩B)</code>，多减的那一项正是被重复计算的部分。'
      },
      {
        id: 'ch01-q3', ch: 'ch01', kp: 'ch01-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '德摩根律告诉我们 <code>(A∪B)<sup>c</sup></code> 等于什么？',
        options: [
          { text: '<code>A<sup>c</sup> ∪ B<sup>c</sup></code>' },
          { text: '<code>A<sup>c</sup> ∩ B<sup>c</sup></code>', correct: true },
          { text: '<code>A ∩ B</code>' },
          { text: '<code>A<sup>c</sup> ∪ B</code>' }
        ],
        explain: '「<code>A</code> 或 <code>B</code> 至少一个发生」的否定是「两个都不发生」，即 <code>A<sup>c</sup>∩B<sup>c</sup></code>。口诀：否定进括号，并交互换。另一条是 <code>(A∩B)<sup>c</sup>=A<sup>c</sup>∪B<sup>c</sup></code>。'
      },
      {
        id: 'ch01-q4', ch: 'ch01', kp: 'ch01-4', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['compute'],
        stem: '生日问题中，房间里有 23 人时「至少两人同生日」的概率大约是？',
        options: [
          { text: '约 0.06' },
          { text: '约 0.25' },
          { text: '约 0.51', correct: true },
          { text: '约 0.95' }
        ],
        explain: '用补事件：23 天各不相同的概率为 <code>(365/365)(364/365)…(343/365) ≈ 0.493</code>，所以至少一对相同的概率约 <code>0.507</code>。直觉低估是因为把它想成「有人和<b>我</b>同生日」，而题目问的是任意两人。'
      },
      {
        id: 'ch01-q5', ch: 'ch01', kp: 'ch01-5', tier: 2, type: 'mcq', difficulty: 3,
        tags: ['compute'],
        stem: '某班 100 人中，选数学 60 人、物理 40 人、化学 30 人；数学与物理都选 20 人，数学与化学都选 15 人，物理与化学都选 10 人，三科都选 5 人。至少选一科的有多少人？',
        options: [
          { text: '85' },
          { text: '90', correct: true },
          { text: '95' },
          { text: '130' }
        ],
        explain: '容斥：<code>60+40+30-20-15-10+5 = 90</code>。注意最后要<b>加回</b>三科都选的人：它在三个单科里被加了 3 次、在三个两两交集里被减了 3 次，正好抵消，必须补一次。'
      },
      {
        id: 'ch01-q6', ch: 'ch01', kp: 'ch01-6', tier: 2, type: 'mcq', difficulty: 3,
        tags: ['compute'],
        stem: '两人约定在 0 到 1 小时内到达，先到者等 15 分钟。两人能碰面的概率是多少？',
        options: [
          { text: '<code>1/4</code>' },
          { text: '<code>7/16</code>', correct: true },
          { text: '<code>1/2</code>' },
          { text: '<code>9/16</code>' }
        ],
        explain: '样本空间是单位正方形，碰面条件是 <code>|x-y| ≤ 1/4</code>。不碰面是两个直角边 <code>3/4</code> 的等腰直角三角形，面积 <code>2×(1/2)(3/4)<sup>2</sup> = 9/16</code>，所以碰面概率 <code>1-9/16 = 7/16</code>。几何概型的关键是「面积比」，不是「时间比」。'
      },
      {
        id: 'ch01-q7', ch: 'ch01', kp: 'ch01-7', tier: 2, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '下面哪些说法是<b>错误</b>的？',
        options: [
          { text: '互斥的事件一定相互独立', correct: true },
          { text: '若 <code>P(A)=0</code>，则 <code>A</code> 一定是不可能事件', correct: true },
          { text: '若 <code>P(A)=1</code>，则 <code>A</code> 一定是必然事件', correct: true },
          { text: '<code>P(A|B)</code> 与 <code>P(B|A)</code> 一般相等' , correct: true }
        ],
        explain: '四个都错。互斥且概率非零的事件反而不独立（一个发生排除了另一个）；概率为 0 的事件在连续情形下可以发生（如 <code>X</code> 恰好等于某点）；条件概率的方向由分母决定，<code>P(A|B)=P(A∩B)/P(B)</code>，交换后分母不同。'
      },

      /* ---------------- ch02 条件概率与独立性 ---------------- */
      {
        id: 'ch02-q1', ch: 'ch02', kp: 'ch02-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '条件概率 <code>P(A|B)</code> 的定义是？',
        options: [
          { text: '<code>P(A∩B)/P(B)</code>', correct: true },
          { text: '<code>P(A∩B)/P(A)</code>' },
          { text: '<code>P(A)P(B)</code>' },
          { text: '<code>P(A∪B)/P(B)</code>' }
        ],
        explain: '条件概率把样本空间缩小到 <code>B</code>，再用 <code>B</code> 的概率归一化：<code>P(A|B)=P(A∩B)/P(B)</code>（要求 <code>P(B)&gt;0</code>）。记住「分母是条件」，方向不能反。'
      },
      {
        id: 'ch02-q2', ch: 'ch02', kp: 'ch02-2', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['compute'],
        stem: '三台机器产量占 50%、30%、20%，次品率分别为 2%、3%、5%。随机取一件是次品的概率是多少？',
        options: [
          { text: '0.017' },
          { text: '0.029', correct: true },
          { text: '0.033' },
          { text: '0.050' }
        ],
        explain: '全概率公式：<code>0.5×0.02 + 0.3×0.03 + 0.2×0.05 = 0.010+0.009+0.010 = 0.029</code>。它不是三个次品率的简单平均（那样得 <code>0.033</code>），必须按产量加权。'
      },
      {
        id: 'ch02-q3', ch: 'ch02', kp: 'ch02-3', tier: 2, type: 'mcq', difficulty: 3,
        tags: ['compute'],
        stem: '某病患病率 1%，检测灵敏度 99%、特异度 95%。某人检测阳性，他真正患病的概率约为？',
        options: [
          { text: '99%' },
          { text: '约 16.7%', correct: true },
          { text: '约 50%' },
          { text: '约 95%' }
        ],
        explain: '贝叶斯：<code>P(D|+) = 0.01×0.99 / (0.01×0.99 + 0.99×0.05) = 0.0099/0.0594 ≈ 0.167</code>。即使检测很准，基率只有 1% 时，绝大多数阳性来自那 99% 的健康人——这就是基率谬误。'
      },
      {
        id: 'ch02-q4', ch: 'ch02', kp: 'ch02-4', tier: 2, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: '三个事件两两独立，则它们一定相互独立。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '两两独立只保证三对乘积关系，不保证 <code>P(ABC)=P(A)P(B)P(C)</code>。经典反例：掷两枚硬币，<code>A</code>=第一枚正、<code>B</code>=第二枚正、<code>C</code>=两枚同面，三者两两独立但不相互独立。'
      },
      {
        id: 'ch02-q5', ch: 'ch02', kp: 'ch02-5', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['compute'],
        stem: '<code>X ~ B(10, 0.2)</code>，则 <code>P(X=0)</code> 约为？',
        options: [
          { text: '0.107', correct: true },
          { text: '0.200' },
          { text: '0.268' },
          { text: '0.800' }
        ],
        explain: '<code>P(X=0)=C(10,0)(0.2)<sup>0</sup>(0.8)<sup>10</sup>=0.8<sup>10</sup>≈0.107</code>。注意不是 <code>1-0.2=0.8</code>：10 次都不发生才会得到 0。'
      },
      {
        id: 'ch02-q6', ch: 'ch02', kp: 'ch02-6', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '三门问题中，参赛者初选一扇门，主持人打开另一扇有山羊的门后，换门中奖的概率是？',
        options: [
          { text: '<code>1/2</code>' },
          { text: '<code>2/3</code>', correct: true },
          { text: '<code>1/3</code>' },
          { text: '<code>3/4</code>' }
        ],
        explain: '初选时选中汽车的概率是 <code>1/3</code>，没选中是 <code>2/3</code>。主持人<b>知道答案</b>并总能打开一扇山羊门，这个行为不改变初选的概率，却把「没选中」的 <code>2/3</code> 全部集中到剩下那扇门上，所以换门赢面是 <code>2/3</code>。'
      },
      {
        id: 'ch02-q7', ch: 'ch02', kp: 'ch02-7', tier: 2, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '关于条件概率与独立性，下面哪些说法正确？',
        options: [
          { text: '若 <code>A</code>、<code>B</code> 独立，则 <code>P(A|B)=P(A)</code>', correct: true },
          { text: '若 <code>P(B)&gt;0</code> 且 <code>P(A|B)=P(A)</code>，则 <code>A</code>、<code>B</code> 独立', correct: true },
          { text: '互斥且概率都大于 0 的两个事件一定不独立', correct: true },
          { text: '条件概率一定大于等于无条件概率' }
        ],
        explain: '前三条是独立性的等价刻画与推论：独立意味着「知道 <code>B</code> 不改变 <code>A</code> 的概率」；互斥时 <code>P(A|B)=0≠P(A)</code>，故不独立。第四条错：条件概率可以更小，也可以更大。'
      },

      /* ---------------- ch03 随机变量与分布 ---------------- */
      {
        id: 'ch03-q1', ch: 'ch03', kp: 'ch03-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '分布函数 <code>F(x)=P(X≤x)</code> 具有下列哪条性质？',
        options: [
          { text: '单调不减、右连续，且 <code>F(-∞)=0</code>、<code>F(+∞)=1</code>', correct: true },
          { text: '单调递增且左连续' },
          { text: '一定连续可导' },
          { text: '取值范围是 <code>(-1,1)</code>' }
        ],
        explain: '<code>F</code> 单调不减（<code>x</code> 变大，事件变大）、右连续，两端极限为 0 与 1。离散型 <code>F</code> 是阶梯函数，在跳跃点不连续，所以「一定连续」是错的。'
      },
      {
        id: 'ch03-q2', ch: 'ch03', kp: 'ch03-2', tier: 1, type: 'fill', difficulty: 1,
        tags: ['compute'],
        stem: '离散型随机变量 <code>X</code> 取值 0、1、2，已知 <code>P(X=0)=0.2</code>、<code>P(X=1)=0.5</code>，则 <code>P(X=2)</code> 等于多少？',
        answer: '0.3',
        accept: ['0.3', '.3', '3/10'],
        explain: '概率质量函数必须满足归一性：<code>Σp(x)=1</code>，所以 <code>P(X=2)=1-0.2-0.5=0.3</code>。任何 pmf 题先检查这一条，能快速排除一半错误选项。'
      },
      {
        id: 'ch03-q3', ch: 'ch03', kp: 'ch03-3', tier: 1, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: '连续型随机变量的概率密度 <code>f(x)</code> 可以大于 1。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '密度不是概率，它只需非负且积分为 1。<code>U(0, 0.5)</code> 的密度是 2，在 <code>[0,0.5]</code> 上处处大于 1，但区间概率仍是长度乘以 2，不超过 1。单个点的概率恒为 0。'
      },
      {
        id: 'ch03-q4', ch: 'ch03', kp: 'ch03-4', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '<code>X ~ Exp(λ)</code>，则 <code>E(X)</code> 等于？',
        options: [
          { text: '<code>λ</code>' },
          { text: '<code>1/λ</code>', correct: true },
          { text: '<code>λ<sup>2</sup></code>' },
          { text: '<code>1/λ<sup>2</sup></code>' }
        ],
        explain: '指数分布的均值为 <code>1/λ</code>，方差为 <code>1/λ<sup>2</sup></code>。若题目给的参数是「率」，则平均等待时间是其倒数；把 <code>λ</code> 与 <code>1/λ</code> 弄反是最常见的失分点。'
      },
      {
        id: 'ch03-q5', ch: 'ch03', kp: 'ch03-5', tier: 3, type: 'mcq', difficulty: 3,
        tags: ['compute'],
        stem: '<code>X ~ U(0,1)</code>，令 <code>Y=X<sup>2</sup></code>，则 <code>Y</code> 的密度 <code>f<sub>Y</sub>(y)</code> 是？',
        options: [
          { text: '<code>1</code>，<code>0&lt;y&lt;1</code>' },
          { text: '<code>1/(2√y)</code>，<code>0&lt;y&lt;1</code>', correct: true },
          { text: '<code>2√y</code>，<code>0&lt;y&lt;1</code>' },
          { text: '<code>1/y</code>，<code>0&lt;y&lt;1</code>' }
        ],
        explain: '累积法：<code>F<sub>Y</sub>(y)=P(X<sup>2</sup>≤y)=P(X≤√y)=√y</code>，求导得 <code>1/(2√y)</code>。也可用单调变换公式 <code>f<sub>Y</sub>=f<sub>X</sub>(√y)·|d√y/dy|</code>，两种方法必须给出同一结果。'
      },
      {
        id: 'ch03-q6', ch: 'ch03', kp: 'ch03-6', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['compute'],
        stem: '<code>X ~ N(μ, σ<sup>2</sup>)</code>，则 <code>P(X ≤ μ+1.96σ)</code> 约等于？',
        options: [
          { text: '0.68' },
          { text: '0.95' },
          { text: '0.975', correct: true },
          { text: '0.99' }
        ],
        explain: '标准化后 <code>Z=(X-μ)/σ ≤ 1.96</code>，查表得 <code>Φ(1.96)=0.975</code>。注意 <code>μ±1.96σ</code> 覆盖的是 95%（双侧各留 2.5%），单侧到 1.96 是 97.5%。'
      },
      {
        id: 'ch03-q7', ch: 'ch03', kp: 'ch03-7', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '指数分布的无记忆性指的是？',
        options: [
          { text: '<code>P(X&gt;s+t | X&gt;s) = P(X&gt;t)</code>', correct: true },
          { text: '<code>P(X&gt;s+t) = P(X&gt;s)+P(X&gt;t)</code>' },
          { text: '<code>P(X&gt;s+t) = P(X&gt;s)P(X&gt;t)</code>' },
          { text: '指数分布的期望不随参数改变' }
        ],
        explain: '「已经等了 <code>s</code> 小时」不会改变「还要再等 <code>t</code> 小时」的概率，这就是无记忆性，也是指数分布区别于均匀分布、伽马分布的关键特征。第三条是「无记忆」的常见误写，量纲都不对。'
      },

      /* ---------------- ch04 期望、方差与矩母函数 ---------------- */
      {
        id: 'ch04-q1', ch: 'ch04', kp: 'ch04-1', tier: 1, type: 'tf', difficulty: 1,
        tags: ['concept'],
        stem: '对任意常数 <code>a</code>、<code>b</code>，都有 <code>E(aX+b)=aE(X)+b</code>。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '期望是线性算子，对任意随机变量（不必独立）都成立。这条性质让「先化简再求期望」成为可能，例如 <code>E(2X+3Y-1)=2E(X)+3E(Y)-1</code>。'
      },
      {
        id: 'ch04-q2', ch: 'ch04', kp: 'ch04-2', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['compute'],
        stem: '已知 <code>Var(X)=4</code>，则 <code>Var(2X+3)</code> 等于？',
        options: [
          { text: '7' },
          { text: '8' },
          { text: '16', correct: true },
          { text: '19' }
        ],
        explain: '<code>Var(aX+b)=a<sup>2</sup>Var(X)</code>，常数平移不改变波动，系数要平方。所以 <code>2<sup>2</sup>×4=16</code>，与 <code>+3</code> 无关。'
      },
      {
        id: 'ch04-q3', ch: 'ch04', kp: 'ch04-3', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '矩母函数 <code>M(t)=E(e<sup>tX</sup>)</code> 在 <code>t=0</code> 处的 <code>k</code> 阶导数等于？',
        options: [
          { text: '<code>E(X)</code>' },
          { text: '<code>E(X<sup>k</sup>)</code>', correct: true },
          { text: '<code>Var(X)</code>' },
          { text: '<code>k!</code>' }
        ],
        explain: '<code>M<sup>(k)</sup>(0)=E(X<sup>k</sup>)</code>，这是 MGF 被称为「矩母」的原因。另外 MGF 若在 0 的邻域存在，则唯一决定分布，可用于识别分布的和（如正态、泊松的可加性）。'
      },
      {
        id: 'ch04-q4', ch: 'ch04', kp: 'ch04-4', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '哪种分布的均值与方差相等？',
        options: [
          { text: '二项分布 <code>B(n,p)</code>' },
          { text: '泊松分布 <code>Poi(λ)</code>', correct: true },
          { text: '指数分布 <code>Exp(λ)</code>' },
          { text: '均匀分布 <code>U(a,b)</code>' }
        ],
        explain: '泊松分布 <code>E(X)=Var(X)=λ</code>。二项是 <code>np</code> 与 <code>np(1-p)</code>，指数是 <code>1/λ</code> 与 <code>1/λ<sup>2</sup></code>，均匀是 <code>(a+b)/2</code> 与 <code>(b-a)<sup>2</sup>/12</code>，都不相等。'
      },
      {
        id: 'ch04-q5', ch: 'ch04', kp: 'ch04-5', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '切比雪夫不等式给出 <code>P(|X-μ| ≥ 2σ)</code> 的上界是？',
        options: [
          { text: '<code>1/2</code>' },
          { text: '<code>1/4</code>', correct: true },
          { text: '<code>1/16</code>' },
          { text: '无法确定' }
        ],
        explain: '<code>P(|X-μ|≥kσ) ≤ 1/k<sup>2</sup></code>，代入 <code>k=2</code> 得 <code>1/4</code>。这个界对任何有限方差的分布都成立，因此通常偏松；它只保证上界，不说明实际概率等于 <code>1/4</code>。'
      },
      {
        id: 'ch04-q6', ch: 'ch04', kp: 'ch04-6', tier: 2, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: '若 <code>X</code> 与 <code>Y</code> 独立，则 <code>Var(X+Y)=Var(X)+Var(Y)</code>；若两者不独立，这个等式一定不成立。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '前半句对，后半句错：一般公式是 <code>Var(X+Y)=VarX+VarY+2Cov(X,Y)</code>。只要协方差为 0（不一定独立），等式仍成立。所以「不独立 ⇒ 方差不可加」是错误推理。'
      },
      {
        id: 'ch04-q7', ch: 'ch04', kp: 'ch04-7', tier: 2, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '下面哪些等式在一般情况下<b>不成立</b>？',
        options: [
          { text: '<code>E(XY)=E(X)E(Y)</code>', correct: true },
          { text: '<code>E(X<sup>2</sup>)=[E(X)]<sup>2</sup></code>', correct: true },
          { text: '<code>Var(X-Y)=Var(X)-Var(Y)</code>', correct: true },
          { text: '<code>E(X+Y)=E(X)+E(Y)</code>' }
        ],
        explain: '前三条都需要额外条件：<code>E(XY)</code> 的分解要求独立（或至少不相关）；<code>E(X<sup>2</sup>)</code> 一般大于 <code>[E(X)]<sup>2</sup></code>，差值正是方差；<code>Var(X-Y)=VarX+VarY-2Cov</code>，方差不作差。只有期望的线性性无条件成立。'
      },

      /* ---------------- ch05 多维随机变量 ---------------- */
      {
        id: 'ch05-q1', ch: 'ch05', kp: 'ch05-1', tier: 1, type: 'tf', difficulty: 1,
        tags: ['concept'],
        stem: '由联合分布可以唯一确定边缘分布；反过来，由两个边缘分布一般不能确定联合分布。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '边缘分布是联合分布求和（或积分）的结果，信息单向丢失。同一对边缘可以对应不同的联合分布（不同的相依结构），只有加上独立性才能相乘还原。'
      },
      {
        id: 'ch05-q2', ch: 'ch05', kp: 'ch05-2', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '全期望公式指出 <code>E(X)</code> 等于？',
        options: [
          { text: '<code>E[E(X|Y)]</code>', correct: true },
          { text: '<code>E(X|Y)</code>' },
          { text: '<code>E(X)E(Y)</code>' },
          { text: '<code>E(X|Y)/E(Y)</code>' }
        ],
        explain: '<code>E(X)=E[E(X|Y)]</code>：先按 <code>Y</code> 分层求条件均值，再对 <code>Y</code> 求平均。它常把二维积分化成一维，是计算混合分布期望的标准工具。'
      },
      {
        id: 'ch05-q3', ch: 'ch05', kp: 'ch05-3', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '判断 <code>X</code>、<code>Y</code> 独立，下列哪条是<b>充分</b>条件？',
        options: [
          { text: '<code>f(x,y)=f<sub>X</sub>(x)f<sub>Y</sub>(y)</code> 对所有 <code>(x,y)</code> 成立', correct: true },
          { text: '<code>Cov(X,Y)=0</code>' },
          { text: '<code>E(XY)=E(X)E(Y)</code>' },
          { text: '<code>ρ=0</code>' }
        ],
        explain: '联合密度（或 pmf）能分解成边缘之积，是独立的定义式，也是充分条件。其余三条只说明「不相关」，而正态以外的不相关不一定独立。'
      },
      {
        id: 'ch05-q4', ch: 'ch05', kp: 'ch05-4', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['compute'],
        stem: '<code>Var(X)=4</code>、<code>Var(Y)=9</code>、<code>Cov(X,Y)=3</code>，则相关系数 <code>ρ</code> 等于？',
        options: [
          { text: '<code>1/2</code>', correct: true },
          { text: '<code>1/3</code>' },
          { text: '<code>3/13</code>' },
          { text: '<code>3/4</code>' }
        ],
        explain: '<code>ρ=Cov/(σ<sub>X</sub>σ<sub>Y</sub>)=3/(2×3)=1/2</code>。相关系数无量纲，范围 <code>[-1,1]</code>；协方差有量纲，不能直接比较强弱。'
      },
      {
        id: 'ch05-q5', ch: 'ch05', kp: 'ch05-5', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['compute'],
        stem: '<code>X</code>、<code>Y</code> 独立，<code>Var(X)=1</code>、<code>Var(Y)=4</code>，则 <code>Var(3X-2Y)</code> 等于？',
        options: [
          { text: '1' },
          { text: '17' },
          { text: '25', correct: true },
          { text: '-7' }
        ],
        explain: '独立时方差可加且系数平方：<code>9×1 + 4×4 = 25</code>。注意负号也被平方，<code>Var(-2Y)=4Var(Y)</code>；方差永远非负，算出负数一定错了。'
      },
      {
        id: 'ch05-q6', ch: 'ch05', kp: 'ch05-6', tier: 2, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: '两个相互独立的正态随机变量之和仍服从正态分布。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '正态分布对加法封闭：若 <code>X~N(μ<sub>1</sub>,σ<sub>1</sub><sup>2</sup>)</code>、<code>Y~N(μ<sub>2</sub>,σ<sub>2</sub><sup>2</sup>)</code> 独立，则 <code>X+Y~N(μ<sub>1</sub>+μ<sub>2</sub>, σ<sub>1</sub><sup>2</sup>+σ<sub>2</sub><sup>2</sup>)</code>。可用 MGF 证明，也是第 6 章 <code>t</code>、<code>F</code> 分布构造的基础。'
      },
      {
        id: 'ch05-q7', ch: 'ch05', kp: 'ch05-7', tier: 2, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '关于协方差与相关，下列哪些说法正确？',
        options: [
          { text: '<code>Cov(X,X)=Var(X)</code>', correct: true },
          { text: '<code>|ρ|≤1</code>，且 <code>|ρ|=1</code> 当且仅当 <code>X</code>、<code>Y</code> 以概率 1 成线性关系', correct: true },
          { text: '<code>Cov(aX+b, cY+d)=ac·Cov(X,Y)</code>', correct: true },
          { text: '<code>ρ=0</code> 一定意味着 <code>X</code>、<code>Y</code> 独立' }
        ],
        explain: '前三条是协方差的基本性质。<code>ρ=0</code> 只排除线性关系，不排除非线性依赖；例如 <code>X~U(-1,1)</code>、<code>Y=X<sup>2</sup></code> 时 <code>Cov=0</code> 但两者完全相依。'
      },

      /* ---------------- ch06 抽样分布与极限定理 ---------------- */
      {
        id: 'ch06-q1', ch: 'ch06', kp: 'ch06-1', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '样本方差 <code>S<sup>2</sup></code> 的分母为什么是 <code>n-1</code> 而不是 <code>n</code>？',
        options: [
          { text: '为了让 <code>S<sup>2</sup></code> 成为 <code>σ<sup>2</sup></code> 的无偏估计', correct: true },
          { text: '为了计算更简单' },
          { text: '因为样本量必须减一' },
          { text: '为了让 <code>S<sup>2</sup></code> 的方差最小' }
        ],
        explain: '若分母用 <code>n</code>，则 <code>E[(1/n)Σ(X<sub>i</sub>-x̄)<sup>2</sup>]=(n-1)σ<sup>2</sup>/n &lt; σ<sup>2</sup></code>，系统性低估。除以 <code>n-1</code> 正好补偿，因为 <code>x̄</code> 用掉了一个自由度。'
      },
      {
        id: 'ch06-q2', ch: 'ch06', kp: 'ch06-2', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['compute'],
        stem: '样本量从 100 增加到 400，样本均值的标准误会怎样变化？',
        options: [
          { text: '不变' },
          { text: '减半', correct: true },
          { text: '变为原来的 1/4' },
          { text: '翻倍' }
        ],
        explain: '<code>SE=σ/√n</code>，<code>n</code> 变为 4 倍，<code>√n</code> 变为 2 倍，<code>SE</code> 减半。这就是「精度提升要靠平方级的样本量」——想把误差减到 1/10，样本量要增 100 倍。'
      },
      {
        id: 'ch06-q3', ch: 'ch06', kp: 'ch06-3', tier: 2, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: '中心极限定理要求总体必须服从正态分布。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: 'CLT 只要求独立同分布且方差有限，<b>不要求</b>总体正态。它说的是「样本均值在 <code>n</code> 大时近似正态」，与总体形状无关；总体越偏，需要的 <code>n</code> 越大。'
      },
      {
        id: 'ch06-q4', ch: 'ch06', kp: 'ch06-4', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '关于大数定律与中心极限定理，下列哪条描述正确？',
        options: [
          { text: '大数定律说 <code>x̄</code> 收敛到 <code>μ</code>，CLT 说 <code>x̄</code> 的波动近似正态', correct: true },
          { text: '两者是同一个定理的两种写法' },
          { text: '大数定律比 CLT 给出更精确的近似' },
          { text: 'CLT 只对大样本成立，大数定律只对小样本成立' }
        ],
        explain: '大数定律回答「会不会收敛」（极限位置），CLT 回答「误差有多大、呈什么形状」（极限分布）。两者互补：前者保证一致性，后者支撑区间与检验的临界值。'
      },
      {
        id: 'ch06-q5', ch: 'ch06', kp: 'ch06-5', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '正态总体下，<code>(n-1)S<sup>2</sup>/σ<sup>2</sup></code> 服从什么分布？',
        options: [
          { text: '<code>χ<sup>2</sup>(n)</code>' },
          { text: '<code>χ<sup>2</sup>(n-1)</code>', correct: true },
          { text: '<code>t(n-1)</code>' },
          { text: '<code>F(1,n-1)</code>' }
        ],
        explain: '自由度是 <code>n-1</code>，因为 <code>S<sup>2</sup></code> 里用到了 <code>x̄</code>，损失一个自由度。这个结论是方差区间与方差检验的基础，也是 <code>t</code> 统计量构造的关键一步。'
      },
      {
        id: 'ch06-q6', ch: 'ch06', kp: 'ch06-6', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '从 <code>N=1000</code> 的有限总体中不放回抽取 <code>n=200</code>，计算标准误时应？',
        options: [
          { text: '直接用 <code>σ/√n</code>，无需修正' },
          { text: '乘以有限总体修正系数 <code>√((N-n)/(N-1))</code>', correct: true },
          { text: '乘以 <code>n/N</code>' },
          { text: '把 <code>n</code> 换成 <code>N</code>' }
        ],
        explain: '<code>n/N=20%&gt;5%</code>，需要修正：<code>SE=(σ/√n)·√((N-n)/(N-1))</code>，本例系数约 <code>0.894</code>。不放回抽样提供额外信息，标准误比独立情形小。'
      },
      {
        id: 'ch06-q7', ch: 'ch06', kp: 'ch06-7', tier: 2, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '关于抽样分布与极限定理，下列哪些说法正确？',
        options: [
          { text: '<code>t</code> 分布随自由度增大逐渐趋近标准正态分布', correct: true },
          { text: '<code>n≥30</code> 是 CLT 生效的硬性门槛，达不到就不能用正态近似' },
          { text: '对独立同分布、方差有限的总体，标准化后的 <code>x̄</code> 依分布收敛到 <code>N(0,1)</code>', correct: true },
          { text: '<code>S<sup>2</sup></code> 的无偏性需要计算 <code>E(S<sup>2</sup>)=σ<sup>2</sup></code> 才能证明', correct: true }
        ],
        explain: '第一条对：自由度越大，<code>t</code> 的尾部越薄，极限是正态。第二条错：<code>30</code> 只是经验法则，偏态重时需要更大样本。第三条是 CLT 的正式表述，前提缺一不可。第四条对：无偏性是算出来的，不是「除以 <code>n-1</code> 就自动成立」。'
      },

      /* ---------------- ch07 统计推断 ---------------- */
      {
        id: 'ch07-q1', ch: 'ch07', kp: 'ch07-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['compute'],
        stem: '<code>X<sub>1</sub>,…,X<sub>n</sub></code> 来自 <code>Exp(λ)</code>，<code>λ</code> 的 MLE 是？',
        options: [
          { text: '<code>x̄</code>' },
          { text: '<code>1/x̄</code>', correct: true },
          { text: '<code>1/x̄<sup>2</sup></code>' },
          { text: '<code>max X<sub>i</sub></code>' }
        ],
        explain: '<code>ℓ(λ)=n lnλ-λΣx<sub>i</sub></code>，令 <code>n/λ-Σx<sub>i</sub>=0</code> 得 <code>λ̂=1/x̄</code>。因为 <code>E(X)=1/λ</code>，MLE 与矩估计在这里一致。'
      },
      {
        id: 'ch07-q2', ch: 'ch07', kp: 'ch07-2', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '估计量的均方误差 <code>MSE</code> 可以分解为？',
        options: [
          { text: '<code>Var(θ̂)+Bias(θ̂)<sup>2</sup></code>', correct: true },
          { text: '<code>Var(θ̂)-Bias(θ̂)<sup>2</sup></code>' },
          { text: '<code>E(θ̂)<sup>2</sup></code>' },
          { text: '<code>Bias(θ̂)</code>' }
        ],
        explain: '<code>MSE=E[(θ̂-θ)<sup>2</sup>]=Var(θ̂)+[E(θ̂)-θ]<sup>2</sup></code>。这个分解说明可以「用一点偏差换大幅方差下降」，压缩估计就是这种思路。'
      },
      {
        id: 'ch07-q3', ch: 'ch07', kp: 'ch07-3', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '「95% 置信区间」的正确含义是？',
        options: [
          { text: '<code>μ</code> 有 95% 的概率落在这个具体区间内' },
          { text: '重复抽样下，约 95% 的同类区间会覆盖 <code>μ</code>', correct: true },
          { text: '这个区间包含 95% 的样本' },
          { text: '有 95% 的样本均值落在区间内' }
        ],
        explain: '<code>μ</code> 是常数，区间是随机的：样本一变，区间就变。95% 描述的是「构造方法的长期覆盖率」，不是某一个已算出的区间的概率。'
      },
      {
        id: 'ch07-q4', ch: 'ch07', kp: 'ch07-4', tier: 2, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: '方差 <code>σ<sup>2</sup></code> 的置信区间关于 <code>S<sup>2</sup></code> 对称。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '<code>χ<sup>2</sup></code> 分布右偏，两侧分位数不对称，所以反解出的区间也不关于 <code>S<sup>2</sup></code> 对称。写成 <code>S<sup>2</sup>±…</code> 一定会错；必须分别查左右尾。'
      },
      {
        id: 'ch07-q5', ch: 'ch07', kp: 'ch07-5', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '样本量固定时，把显著性水平 <code>α</code> 从 0.05 降到 0.01，通常会怎样？',
        options: [
          { text: '第二类错误 <code>β</code> 减小' },
          { text: '第二类错误 <code>β</code> 增大', correct: true },
          { text: '功效 <code>1-β</code> 增大' },
          { text: '两类错误都减小' }
        ],
        explain: '门槛更严，更难拒绝 <code>H<sub>0</sub></code>：冤枉好人的概率降了，但放过坏人的概率升了。只有增大样本量才能同时降低 <code>α</code> 与 <code>β</code>。'
      },
      {
        id: 'ch07-q6', ch: 'ch07', kp: 'ch07-6', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['compute'],
        stem: '检验 <code>H<sub>0</sub>: p=p<sub>0</sub></code> 时，比例检验统计量的分母应使用？',
        options: [
          { text: '<code>√(p̂(1-p̂)/n)</code>' },
          { text: '<code>√(p<sub>0</sub>(1-p<sub>0</sub>)/n)</code>', correct: true },
          { text: '<code>√(p<sub>0</sub>/n)</code>' },
          { text: '<code>p̂(1-p̂)</code>' }
        ],
        explain: '检验在 <code>H<sub>0</sub></code> 下计算，此时 <code>p=p<sub>0</sub></code>，标准误必须用 <code>p<sub>0</sub></code>；置信区间不为任何假设服务，才用 <code>p̂</code>。这个区别是双比例与单比例题的常见陷阱。'
      },
      {
        id: 'ch07-q7', ch: 'ch07', kp: 'ch07-8', tier: 2, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '关于 p 值，下列哪些说法正确？',
        options: [
          { text: 'p 值是在 <code>H<sub>0</sub></code> 为真时，得到当前或更极端结果的概率', correct: true },
          { text: 'p 值小只说明数据与 <code>H<sub>0</sub></code> 不太相容，不说明效应大小', correct: true },
          { text: '做 20 次独立检验，即使全无效应，至少一次 <code>p&lt;0.05</code> 的概率约 0.64', correct: true },
          { text: 'p 值就是 <code>H<sub>0</sub></code> 为真的概率' }
        ],
        explain: '前三条正确：p 值是「数据在 <code>H<sub>0</sub></code> 下的罕见程度」，不是 <code>H<sub>0</sub></code> 的概率，也不衡量效应大小；多重比较会让假阳性膨胀，<code>1-0.95<sup>20</sup>≈0.64</code>。第四条是典型误用。'
      }
    ]
  };

  CSC._quizPack = PACK;
  CSC.registerQuizPack(PACK);
})();
