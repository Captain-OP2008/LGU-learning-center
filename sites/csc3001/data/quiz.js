/* =====================================================================
 * sites/csc3001/data/quiz.js · 离散数学分章题库
 * 结构：{ items:[{ id, ch, kp, tier, type, difficulty, tags, stem,
 *                  options?, answer?, accept?, explain }] }
 * 题型：mcq / tf / fill / multi（predict 需要代码，本站不用）
 * 目标：每章 7 题，全站 56 题
 * ===================================================================== */
(function () {
  'use strict';

  var PACK = {
    items: [
      /* ---------------- ch00 课程地图 ---------------- */
      {
        id: 'ch00-q1', ch: 'ch00', kp: 'ch00-8', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '这门课真正能给你什么？下面哪种用法回报最高？',
        options: [
          { text: '把每章的结论抄成一张公式表，考前背下来' },
          { text: '跟着每一节自己推一遍、做完自检与项目，再回来查缺补漏', correct: true },
          { text: '只看视频不看正文，等考前突击' },
          { text: '直接背题库答案，不用理解推导过程' }
        ],
        explain: '离散数学考的是「能不能自己造出一条论证」，背结论在题型一变时立刻失效。四步学习法（看图 → 精读 → 自检 → 项目）就是围绕这个目标设计的。'
      },
      {
        id: 'ch00-q2', ch: 'ch00', kp: 'ch00-4', tier: 1, type: 'tf', difficulty: 1,
        tags: ['concept'],
        stem: '离散数学主要研究变量在实数区间上连续变化时的极限、导数与积分。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '极限、导数、积分属于微积分（连续数学）。离散数学研究的是可数、可分离的对象：命题、整数、集合、图、树，工具是逻辑与计数而不是极限。'
      },
      {
        id: 'ch00-q3', ch: 'ch00', kp: 'ch00-3', tier: 1, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '本站把七章内容归为三条主线，下面哪些属于这三条主线？（多选）',
        options: [
          { text: '逻辑与证明', correct: true },
          { text: '计数与组合', correct: true },
          { text: '结构与图', correct: true },
          { text: '级数收敛半径' },
          { text: '偏微分方程数值解' }
        ],
        explain: '三条主线：逻辑与证明（ch01–ch02 是语言，ch05 用归纳与递推把它用在无穷对象上）、计数与组合（ch06）、结构与图（ch03 集合关系、ch04 数论、ch07 图论与树）。级数与偏微分方程属于连续数学。'
      },
      {
        id: 'ch00-q4', ch: 'ch00', kp: 'ch00-2', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '按本站的依赖关系，正式进入图论（ch07）之前最需要先掌握哪一章？',
        options: [
          { text: 'ch06 计数与组合' },
          { text: 'ch03 集合、关系与函数', correct: true },
          { text: 'ch04 数论与同余' },
          { text: 'ch05 归纳法与递推关系' }
        ],
        explain: '图的精确定义用有序对与多重集，路径与连通性用关系，最小生成树用等价类与偏序的语言；ch03 是图论的地基。ch05 的归纳常用于证明图的性质，但依赖关系上 ch03 更靠前。'
      },
      {
        id: 'ch00-q5', ch: 'ch00', kp: 'ch00-5', tier: 2, type: 'fill', difficulty: 2,
        tags: ['concept'],
        stem: '四步学习法的第三步是：合上正文，用一段话和一道题做一次 ______ 检查。',
        answer: '自检',
        accept: ['自我检查', '主动回忆'],
        explain: '第三步是自检：不看正文，自己复述本节结论并做一道题，再回去对答案。主动回忆（active recall）比反复重读有效得多。'
      },
      {
        id: 'ch00-q6', ch: 'ch00', kp: 'ch00-6', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['proof'],
        stem: '从「一句话」走到「一条定理」，中间最关键的一环是什么？',
        options: [
          { text: '把这句话翻成带量词的精确命题，再选择匹配的证明方法', correct: true },
          { text: '先把结论抄下来，再凑出几个例子' },
          { text: '直接写「显然成立」' },
          { text: '把命题改写成更容易证明的另一句话（只要读起来像）' }
        ],
        explain: '第一步永远是翻译：所有对象上有量词吗？是「任意」还是「存在」？结论是蕴含、等值还是否定？翻准之后，证明方法（直接、逆否、反证、分类、构造）才有得选。'
      },
      {
        id: 'ch00-q7', ch: 'ch00', kp: 'ch00-7', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '数据结构课里的最短路、最小生成树、拓扑排序，最直接来自本站哪一章？',
        options: [
          { text: 'ch07 图论与树', correct: true },
          { text: 'ch02 证明方法与证明结构' },
          { text: 'ch06 计数与组合' },
          { text: 'ch01 命题逻辑与量词' }
        ],
        explain: '最短路（Dijkstra）、最小生成树（Kruskal/Prim）、拓扑排序（偏序的线性化）都在 ch07 图论与树里给出定义与性质，算法课直接拿来做复杂度分析。'
      },

      /* ---------------- ch01 命题逻辑与量词 ---------------- */
      {
        id: 'ch01-q1', ch: 'ch01', kp: 'ch01-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '下列哪个句子是命题（能判定真假）？',
        options: [
          { text: 'x 大于 3' },
          { text: '请把门关上' },
          { text: '7 是素数', correct: true },
          { text: 'π 是无理数吗？' }
        ],
        explain: '命题必须能判定真假。含自由变量的「x 大于 3」真假取决于 x，是命题函数；祈使句与疑问句都不判定真假。「7 是素数」是真命题。'
      },
      {
        id: 'ch01-q2', ch: 'ch01', kp: 'ch01-2', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: 'p → q 与下面哪个公式逻辑等价？',
        options: [
          { text: 'p ∧ ¬q' },
          { text: '¬p ∨ q', correct: true },
          { text: 'q → p' },
          { text: '¬p ∧ q' }
        ],
        explain: '蕴含的展开式：p → q ≡ ¬p ∨ q，即「只要不出现 p 真 q 假就是真的」。p ∧ ¬q 是它的否定，q → p 是它的逆命题。'
      },
      {
        id: 'ch01-q3', ch: 'ch01', kp: 'ch01-3', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['concept', 'apply'],
        stem: '命题「若下雨，则地面湿」的逆否命题是：',
        options: [
          { text: '若地面湿，则下雨' },
          { text: '若不下雨，则地面不湿' },
          { text: '若地面不湿，则没有下雨', correct: true },
          { text: '若下雨，则地面不湿' }
        ],
        explain: 'p → q 的逆否是 ¬q → ¬p，与原命题等价。「若地面不湿，则没有下雨」正是 ¬(地面湿) → ¬(下雨)。选项 1 是逆命题，选项 2 是否命题，两个都与原命题不等价。'
      },
      {
        id: 'ch01-q4', ch: 'ch01', kp: 'ch01-5', tier: 2, type: 'tf', difficulty: 3,
        tags: ['concept'],
        stem: '「不存在任何自然数比所有自然数都大」的否定是「存在某个自然数比所有自然数都大」。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '原句写成 ¬∃n∀m (n ≥ m)，否定一次量词翻转，得到 ∃n∀m (n ≥ m)——也就是「存在某个自然数比所有自然数都大」。注意否定从未进入量词内部时顺序不变，但每层都翻面。'
      },
      {
        id: 'ch01-q5', ch: 'ch01', kp: 'ch01-5', tier: 3, type: 'mcq', difficulty: 3,
        tags: ['trace'],
        stem: '公式 ¬∀x∃y (x < y) 等价于：',
        options: [
          { text: '∀x∃y (x ≥ y)' },
          { text: '∃x∀y (x ≥ y)', correct: true },
          { text: '∃x∃y (x ≥ y)' },
          { text: '∀x∀y (x < y)' }
        ],
        explain: '把否定一路推进去：¬∀x∃y P(x,y) → ∃x ¬∃y P(x,y) → ∃x ∀y ¬P(x,y)，即 ∃x∀y (x ≥ y)。量词顺序不变，但每个量词本身都要翻面。'
      },
      {
        id: 'ch01-q6', ch: 'ch01', kp: 'ch01-6', tier: 2, type: 'fill', difficulty: 2,
        tags: ['concept'],
        stem: '把 p → q 写成只含 ∧、∨、¬ 的析取范式，得到 ¬p ∨ ____。',
        answer: 'q',
        accept: ['Q'],
        explain: 'p → q ≡ ¬p ∨ q，就是这两个文字（literal）组成的析取式，也是它的 CNF 只有一项的特例。'
      },
      {
        id: 'ch01-q7', ch: 'ch01', kp: 'ch01-6', tier: 3, type: 'multi', difficulty: 3,
        tags: ['proof'],
        stem: '下列推理形式中，哪些是有效的？（多选）',
        options: [
          { text: '假言推理：p → q，p，所以 q', correct: true },
          { text: '拒取式：p → q，¬q，所以 ¬p', correct: true },
          { text: '否定前件：p → q，¬p，所以 ¬q' },
          { text: '肯定后件：p → q，q，所以 p' },
          { text: '假言三段论：p → q，q → r，所以 p → r', correct: true }
        ],
        explain: '否定前件与肯定后件是最常见的两个谬误：p 假时 q 仍可为真，q 真时 p 也可以为假。假言推理、拒取式（即逆否）、假言三段论都是有效规则。'
      },

      /* ---------------- ch02 证明方法与证明结构 ---------------- */
      {
        id: 'ch02-q1', ch: 'ch02', kp: 'ch02-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['proof'],
        stem: '要证明「若 n 是偶数，则 n² 是偶数」，最自然的证法是：',
        options: [
          { text: '反证法：假设 n² 是奇数' },
          { text: '直接证明：设 n = 2k，算出 n² = 4k² = 2(2k²) 也是偶数', correct: true },
          { text: '穷举所有偶数' },
          { text: '举几个例子（2、4、6）说明' }
        ],
        explain: '结论直接由定义展开：偶数写成 2k，代入平方后仍是 2 的倍数。举例只能说明「可能成立」，不能构成证明；反证法可以但绕远。'
      },
      {
        id: 'ch02-q2', ch: 'ch02', kp: 'ch02-3', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['proof'],
        stem: '证明「对任意整数 n，n(n+1) 一定是偶数」，最标准的做法是：',
        options: [
          { text: '对 n 的奇偶性分两类讨论：n 为偶数或 n 为奇数', correct: true },
          { text: '假设 n(n+1) 是奇数，推出矛盾' },
          { text: '算 n = 1, 2, 3 时都成立，所以对全部成立' },
          { text: '用数学归纳法对 n 归纳' }
        ],
        explain: '相邻两整数必然一奇一偶，乘积含因子 2。按 n 的奇偶分类是最短路径：n 偶时 2 | n；n 奇时 2 | n+1。结论依赖某个整数取值的分支，这正是分类讨论的典型场景。'
      },
      {
        id: 'ch02-q3', ch: 'ch02', kp: 'ch02-5', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['proof'],
        stem: '要证明「p 当且仅当 q」，应当证明什么？',
        options: [
          { text: '只需证明 p → q' },
          { text: '只需证明 q → p' },
          { text: '分别证明 p → q 与 q → p 两个方向', correct: true },
          { text: '证明 p 与 q 都能各自成立' }
        ],
        explain: '「当且仅当」是双向蕴含 p ⇔ q。标准做法是拆成「p ⇒ q」（必要性）与「q ⇒ p」（充分性）两个方向，也可以证 p ⇒ q 与 ¬p ⇒ ¬q（后者是前者的逆否，本质同一件事）。'
      },
      {
        id: 'ch02-q4', ch: 'ch02', kp: 'ch02-2', tier: 2, type: 'tf', difficulty: 2,
        tags: ['proof'],
        stem: '用反证法证明「若 p 则 q」，正确的假设是「p 真且 q 假」。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '反证法假设「结论不成立」，即 p → q 的否定 p ∧ ¬q。不是假设 p 假，也不是单独假设 q 假（单独 q 假并不构成对蕴含的否定）。'
      },
      {
        id: 'ch02-q5', ch: 'ch02', kp: 'ch02-2', tier: 2, type: 'fill', difficulty: 2,
        tags: ['proof'],
        stem: '要证明「不存在最大的素数」，反证法的开头是：假设存在一个最大的素数 p，再构造出比 p 更大的素数，与 ______ 矛盾。',
        answer: 'p 是最大的素数',
        accept: ['假设', 'p 最大', '最大性', 'p 为最大'],
        explain: '反证法的矛盾点必须落在假设上：构造出比 p 大的素数，与「p 是最大的素数」冲突。很多证明写不清矛盾对象，阅卷时会失分。'
      },
      {
        id: 'ch02-q6', ch: 'ch02', kp: 'ch02-4', tier: 3, type: 'mcq', difficulty: 3,
        tags: ['proof'],
        stem: '「存在性证明」与「构造性证明」的关系是：',
        options: [
          { text: '两者完全等价，都只需举一个例子' },
          { text: '构造性证明给出具体对象，非构造性证明只说明存在性而不必指出对象', correct: true },
          { text: '非构造性证明一定错误' },
          { text: '构造性证明只适用于有限集合' }
        ],
        explain: '存在性证明只需说明「至少有一个」，而构造性证明会真的把那个对象做出来（例如给出具体算法或显式公式）。非构造性证明同样有效，只是不给对象，例如用鸽巢原理或反证法。'
      },
      {
        id: 'ch02-q7', ch: 'ch02', kp: 'ch02-6', tier: 3, type: 'multi', difficulty: 3,
        tags: ['proof'],
        stem: '下列哪些是证明书写中常见的漏洞？（多选）',
        options: [
          { text: '用举例代替「任意」的推理', correct: true },
          { text: '在「⇒」方向里用了「⇐」才成立的条件（方向含混）', correct: true },
          { text: '引入新变量却没有说明它的取值范围与来源', correct: true },
          { text: '结尾写出「证毕」' },
          { text: '把待证结论当作已知条件使用（循环论证）', correct: true }
        ],
        explain: '举例代替任意、方向倒置、变量来源不明、循环论证是四个高频漏洞。写「证毕」本身是好习惯，不是漏洞——它提醒读者论证已结束。'
      },

      /* ---------------- ch03 集合、关系与函数 ---------------- */
      {
        id: 'ch03-q1', ch: 'ch03', kp: 'ch03-1', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['concept', 'trace'],
        stem: 'A ∪ (B ∩ C) 与 (A ∪ B) ∩ (A ∪ C) 的关系是：',
        options: [
          { text: '前者是后者的子集，反向一般不成立' },
          { text: '两者恒等（分配律）', correct: true },
          { text: '后者是前者的子集，反向一般不成立' },
          { text: '两者没有一般关系' }
        ],
        explain: '集合的分配律：A ∪ (B ∩ C) = (A ∪ B) ∩ (A ∪ C)，对偶地 A ∩ (B ∪ C) = (A ∩ B) ∪ (A ∩ C)。用元素隶属的定义逐点验证：两边都是「x∈A 或（x∈B 且 x∈C）」。'
      },
      {
        id: 'ch03-q2', ch: 'ch03', kp: 'ch03-4', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '在整数集上定义「a ≡ b 当且仅当 7 | (a − b)」，这个关系是：',
        options: [
          { text: '等价关系，把整数分成 7 个等价类', correct: true },
          { text: '等价关系，把整数分成 2 个等价类' },
          { text: '偏序关系' },
          { text: '既不是等价关系也不是偏序关系' }
        ],
        explain: '模 7 同余满足自反（7 | 0）、对称（7 | (a−b) 则 7 | (b−a)）、传递（整除相加）。等价类就是余数 0,1,…,6，共 7 个。同余式是后面数论与密码学的基础。'
      },
      {
        id: 'ch03-q3', ch: 'ch03', kp: 'ch03-6', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '函数 f: ℝ → ℝ，f(x) = x²。关于它的性质，正确的是：',
        options: [
          { text: '是单射但不是满射' },
          { text: '是满射但不是单射' },
          { text: '既不是单射也不是满射', correct: true },
          { text: '既是单射又是满射' }
        ],
        explain: '不是单射：f(−1) = f(1) = 1；也不是满射：值域是 [0, +∞)，不代表负实数。把它限制成 f: [0,+∞) → [0,+∞) 时才是双射。'
      },
      {
        id: 'ch03-q4', ch: 'ch03', kp: 'ch03-2', tier: 2, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: '若集合 A 有 n 个元素，则幂集 P(A) 有 2ⁿ 个元素。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '每个元素有两种命运：被选进子集或不被选进，各元素独立，所以 2ⁿ 个子集。例如 P(∅) = {∅} 有 1 = 2⁰ 个元素，P({1,2}) 有 4 个。'
      },
      {
        id: 'ch03-q5', ch: 'ch03', kp: 'ch03-2', tier: 2, type: 'fill', difficulty: 2,
        tags: ['calc'],
        stem: '若 |A| = 3，|B| = 4，则 |A × B| = ______。',
        answer: '12',
        explain: '笛卡尔积的元素是有序对 (a, b)，a 有 3 种选法、b 有 4 种选法，乘起来 3 × 4 = 12。这就是乘法原理在集合上的形式。'
      },
      {
        id: 'ch03-q6', ch: 'ch03', kp: 'ch03-4', tier: 3, type: 'fill', difficulty: 3,
        tags: ['calc'],
        stem: '集合 {1,2,3,4} 上的关系 R = {(a,b) | a − b 是偶数} 是等价关系。它把集合分成 ______ 个等价类。',
        answer: '2',
        accept: ['两', '两个'],
        explain: 'a − b 为偶数 ⇔ a、b 同奇偶。所以等价类只有两个：奇数类 {1,3} 与偶数类 {2,4}。'
      },
      {
        id: 'ch03-q7', ch: 'ch03', kp: 'ch03-5', tier: 3, type: 'multi', difficulty: 3,
        tags: ['concept'],
        stem: '偏序关系需要同时满足哪三条性质？（多选）',
        options: [
          { text: '自反性', correct: true },
          { text: '反对称性', correct: true },
          { text: '传递性', correct: true },
          { text: '对称性' },
          { text: '非自反性' }
        ],
        explain: '偏序是自反、反对称、传递；等价关系是自反、对称、传递。对称性恰好是偏序最需要避免的：若 a ≤ b 且 b ≤ a 推出 a = b（反对称），而不是两者都成立。'
      },
      {
        "id": "ch04-q1",
        "ch": "ch04",
        "kp": "ch04-1",
        "tier": 1,
        "type": "mcq",
        "difficulty": 1,
        "tags": [
          "concept"
        ],
        "stem": "用 17 除以 5 做带余除法，商与余数分别是？",
        "options": [
          {
            "text": "商 3，余 2",
            "correct": true
          },
          {
            "text": "商 2，余 3"
          },
          {
            "text": "商 3，余 1"
          },
          {
            "text": "商 4，余 −3"
          }
        ],
        "explain": "带余除法要求 17 = 5q + r 且 0 ≤ r < 5。5 × 3 = 15，17 − 15 = 2，所以 q = 3、r = 2。余数必须落在 [0, b) 内，因此「商 4，余 −3」虽然等式成立，却不符合标准形式。"
      },
      {
        "id": "ch04-q2",
        "ch": "ch04",
        "kp": "ch04-2",
        "tier": 2,
        "type": "fill",
        "difficulty": 2,
        "tags": [
          "calc"
        ],
        "stem": "用欧几里得算法计算 gcd(1071, 462)，结果是 ______。",
        "answer": "21",
        "explain": "1071 = 2 × 462 + 147；462 = 3 × 147 + 21；147 = 7 × 21 + 0。最后非零余数是 21，所以 gcd = 21。欧几里得算法的核心是 gcd(a, b) = gcd(b, a mod b)，每一步都把问题缩小。"
      },
      {
        "id": "ch04-q3",
        "ch": "ch04",
        "kp": "ch04-3",
        "tier": 2,
        "type": "mcq",
        "difficulty": 2,
        "tags": [
          "calc"
        ],
        "stem": "同余方程 7x ≡ 1 (mod 11) 的解是？",
        "options": [
          {
            "text": "x = 8",
            "correct": true
          },
          {
            "text": "x = 3"
          },
          {
            "text": "x = 7"
          },
          {
            "text": "无解"
          }
        ],
        "explain": "7 × 8 = 56 = 5 × 11 + 1，所以 7 × 8 ≡ 1 (mod 11)，8 就是 7 模 11 的逆元。一般地，方程 ax ≡ b (mod m) 有唯一解当且仅当 gcd(a, m) = 1，此时 x ≡ b · a⁻¹ (mod m)。"
      },
      {
        "id": "ch04-q4",
        "ch": "ch04",
        "kp": "ch04-4",
        "tier": 3,
        "type": "fill",
        "difficulty": 3,
        "tags": [
          "calc"
        ],
        "stem": "解同余方程组 x ≡ 2 (mod 3)、x ≡ 3 (mod 5)，在 0 ≤ x < 15 内 x = ______。",
        "answer": "8",
        "explain": "先看 mod 5 的 3：3, 8, 13。逐个检查 mod 3：3 ≡ 0、8 ≡ 2、13 ≡ 1。只有 8 同时满足 x ≡ 2 (mod 3)。所以通解是 x ≡ 8 (mod 15)。中国剩余定理保证：模数互素时解在 0 到乘积 − 1 之间唯一。"
      },
      {
        "id": "ch04-q5",
        "ch": "ch04",
        "kp": "ch04-5",
        "tier": 1,
        "type": "tf",
        "difficulty": 2,
        "tags": [
          "concept"
        ],
        "stem": "若 p 是质数且 p 不整除 a，则 a^(p−1) ≡ 1 (mod p)。",
        "options": [
          {
            "text": "正确",
            "correct": true
          },
          {
            "text": "错误"
          }
        ],
        "explain": "这正是费马小定理。例如 p = 7、a = 3：3⁶ = 729 = 7 × 104 + 1，所以 3⁶ ≡ 1 (mod 7)。它的推广是欧拉定理 a^(φ(n)) ≡ 1 (mod n)（要求 gcd(a, n) = 1），RSA 的正确性就建立在它之上。"
      },
      {
        "id": "ch04-q6",
        "ch": "ch04",
        "kp": "ch04-4",
        "tier": 2,
        "type": "multi",
        "difficulty": 2,
        "tags": [
          "concept"
        ],
        "stem": "下面哪些等式对任意整数 a、b 和正整数 n 都成立？（多选）",
        "options": [
          {
            "text": "(a + b) mod n = ((a mod n) + (b mod n)) mod n",
            "correct": true
          },
          {
            "text": "(a × b) mod n = ((a mod n) × (b mod n)) mod n",
            "correct": true
          },
          {
            "text": "a mod n 的结果一定落在 [0, n) 内",
            "correct": true
          },
          {
            "text": "(a ÷ b) mod n = (a mod n) ÷ (b mod n)",
            "correct": false
          },
          {
            "text": "a mod n = b mod n 一定推出 a = b",
            "correct": false
          }
        ],
        "explain": "加法和乘法可以先取模再取模，这让大数计算可以被压缩到很小；而且取模结果被规范到 [0, n) 区间。但除法没有一般规律（需要乘法逆元，且只在 gcd(b, n) = 1 时才有逆元），「同余」也绝不等于「相等」：3 ≡ 8 (mod 5) 而 3 ≠ 8。"
      },
      {
        "id": "ch04-q7",
        "ch": "ch04",
        "kp": "ch04-6",
        "tier": 3,
        "type": "mcq",
        "difficulty": 3,
        "tags": [
          "apply"
        ],
        "stem": "RSA 中公钥是 (e, n)，私钥 d 满足什么条件？",
        "options": [
          {
            "text": "e · d ≡ 1 (mod φ(n))",
            "correct": true
          },
          {
            "text": "e + d = φ(n)"
          },
          {
            "text": "e · d = n"
          },
          {
            "text": "d = φ(e)"
          }
        ],
        "explain": "RSA 的加密是 c ≡ m^e (mod n)，解密需要 m ≡ c^d (mod n)。由欧拉定理，这成立当且仅当 e·d ≡ 1 (mod φ(n))，即 d 是 e 模 φ(n) 的逆元。因为 φ(n) 只有知道 n = pq 的分解才能算，而分解大整数是困难的，所以公钥公开也安全。"
      },
      {
        "id": "ch05-q1",
        "ch": "ch05",
        "kp": "ch05-1",
        "tier": 1,
        "type": "mcq",
        "difficulty": 1,
        "tags": [
          "concept"
        ],
        "stem": "数学归纳法的第二步（归纳步）要证明的是？",
        "options": [
          {
            "text": "假设 P(k) 成立，推出 P(k+1) 成立",
            "correct": true
          },
          {
            "text": "直接证明 P(n) 对任意 n 成立"
          },
          {
            "text": "验证 n = 1 时 P(1) 成立"
          },
          {
            "text": "证明 P(k) 对某个 k 成立"
          }
        ],
        "explain": "归纳法像一个可以无限向下推倒的多米诺骨牌：基础步推倒第一块（验证 P(1)），归纳步保证任意一块倒下会带倒下一块（P(k) ⇒ P(k+1)），两者合起来覆盖所有 n。少了任何一步都不成立：只验证 P(1) 只能保证 n = 1。"
      },
      {
        "id": "ch05-q2",
        "ch": "ch05",
        "kp": "ch05-1",
        "tier": 1,
        "type": "fill",
        "difficulty": 1,
        "tags": [
          "calc"
        ],
        "stem": "求和 1 + 2 + 3 + … + 10 = ______。",
        "answer": "55",
        "explain": "等差数列求和公式 n(n+1)/2 代入 n = 10 得 10 × 11 / 2 = 55。这个公式本身就是归纳法的经典例题：P(k) 成立时，1+…+k+(k+1) = k(k+1)/2 + (k+1) = (k+1)(k+2)/2，正好是 n = k+1 的形式。"
      },
      {
        "id": "ch05-q3",
        "ch": "ch05",
        "kp": "ch05-2",
        "tier": 2,
        "type": "mcq",
        "difficulty": 2,
        "tags": [
          "concept"
        ],
        "stem": "强归纳法与普通归纳法最主要的区别是？",
        "options": [
          {
            "text": "归纳步假设 P(1), P(2), …, P(k) 全部成立，推出 P(k+1)",
            "correct": true
          },
          {
            "text": "强归纳不需要验证基础步"
          },
          {
            "text": "强归纳只能证明不等式"
          },
          {
            "text": "强归纳要求 n 必须很大"
          }
        ],
        "explain": "普通归纳只用 P(k) 一条假设，强归纳可以用前面全部 P(1)…P(k)。当 P(k+1) 依赖不止前一项时（比如递推式含 aₙ₋₂、或证明「每个大于 1 的整数都能分解成质数乘积」），就必须用强归纳。两者在逻辑上等价，强归纳只是把假设变强、写起来更方便。"
      },
      {
        "id": "ch05-q4",
        "ch": "ch05",
        "kp": "ch05-5",
        "tier": 2,
        "type": "fill",
        "difficulty": 2,
        "tags": [
          "calc"
        ],
        "stem": "递推数列 a₁ = 1，aₙ = 2aₙ₋₁ + 1，则 a₅ = ______。",
        "answer": "31",
        "explain": "逐项展开：a₂ = 3、a₃ = 7、a₄ = 15、a₅ = 31。规律是 aₙ = 2ⁿ − 1。求法是「加常数化齐次」：令 bₙ = aₙ + 1，则 bₙ = 2bₙ₋₁，b₁ = 2，于是 bₙ = 2ⁿ，回代得 aₙ = 2ⁿ − 1。"
      },
      {
        "id": "ch05-q5",
        "ch": "ch05",
        "kp": "ch05-5",
        "tier": 3,
        "type": "mcq",
        "difficulty": 3,
        "tags": [
          "calc"
        ],
        "stem": "递推式 aₙ = 5aₙ₋₁ − 6aₙ₋₂ 的通解形式是？（A、B 为常数）",
        "options": [
          {
            "text": "A · 2ⁿ + B · 3ⁿ",
            "correct": true
          },
          {
            "text": "A · 5ⁿ + B · 6ⁿ"
          },
          {
            "text": "A + B · n"
          },
          {
            "text": "A · (−2)ⁿ + B · (−3)ⁿ"
          }
        ],
        "explain": "线性常系数齐次递推的特征方程是 x² = 5x − 6，即 x² − 5x + 6 = 0，因式分解 (x − 2)(x − 3) = 0，根为 2 和 3。两个互异实根时通解就是 A·2ⁿ + B·3ⁿ，再用两个初始条件定出 A、B。这是求解斐波那契型递推的通用套路。"
      },
      {
        "id": "ch05-q6",
        "ch": "ch05",
        "kp": "ch05-6",
        "tier": 3,
        "type": "fill",
        "difficulty": 3,
        "tags": [
          "apply"
        ],
        "stem": "归并排序满足递推 T(n) = 2T(n/2) + n，则 T(n) 的渐进复杂度是 Θ(______)。",
        "answer": "n log n",
        "accept": [
          "n log n",
          "nlogn",
          "n·log n",
          "Θ(n log n)"
        ],
        "explain": "每一层递归把区间对半分，产生 2 个子问题、规模减半，合并代价为 n。展开得 T(n) = 2T(n/2) + n = 4T(n/4) + 2n = … = n·T(1) + n·log₂n = Θ(n log n)。这是「分治 + 线性合并」的典型代价，也是主定理情形之一。"
      },
      {
        "id": "ch05-q7",
        "ch": "ch05",
        "kp": "ch05-7",
        "tier": 2,
        "type": "tf",
        "difficulty": 2,
        "tags": [
          "concept"
        ],
        "stem": "证明「对所有正整数 n 成立」时，只要验证 n = 1 成立就足够了。",
        "options": [
          {
            "text": "正确"
          },
          {
            "text": "错误",
            "correct": true
          }
        ],
        "explain": "只验证基础步等于只推倒第一块骨牌，没有任何链条保证后面的也倒下，所以结论对 n ≥ 2 未必成立。必须同时完成基础步与归纳步。另一类常见错误是归纳步里「偷偷假设了结论」（循环论证），或在推导中用了未被假设成立的情形。"
      },
      {
        "id": "ch06-q1",
        "ch": "ch06",
        "kp": "ch06-2",
        "tier": 1,
        "type": "fill",
        "difficulty": 1,
        "tags": [
          "calc"
        ],
        "stem": "C(8, 3) = ______。",
        "answer": "56",
        "explain": "C(8,3) = 8! / (3! · 5!) = (8 × 7 × 6) / (3 × 2 × 1) = 336 / 6 = 56。组合数不考虑顺序，所以比排列 A(8,3) = 336 少掉了 3! 种内部顺序。"
      },
      {
        "id": "ch06-q2",
        "ch": "ch06",
        "kp": "ch06-3",
        "tier": 2,
        "type": "mcq",
        "difficulty": 2,
        "tags": [
          "calc"
        ],
        "stem": "(x + y)⁵ 展开式中 x²y³ 的系数是？",
        "options": [
          {
            "text": "10",
            "correct": true
          },
          {
            "text": "5"
          },
          {
            "text": "20"
          },
          {
            "text": "15"
          }
        ],
        "explain": "二项式定理说 (x + y)ⁿ = Σ C(n,k) x^(n−k) y^k。要 x²y³ 就取 n = 5、k = 3，系数是 C(5,3) = 10。理解方式：从 5 个因子里选 3 个贡献 y，剩下 2 个贡献 x，选法数就是组合数。"
      },
      {
        "id": "ch06-q3",
        "ch": "ch06",
        "kp": "ch06-1",
        "tier": 2,
        "type": "fill",
        "difficulty": 2,
        "tags": [
          "apply"
        ],
        "stem": "从 5 门不同的课里选 2 门，分别安排在上午和下午（顺序有意义），共有 ______ 种安排。",
        "answer": "20",
        "explain": "这是排列而不是组合：先选上午的课 5 种，再选下午的课 4 种，5 × 4 = 20。若只问「选哪 2 门」不排时间，那就是 C(5,2) = 10。加法原理处理「或」（分类），乘法原理处理「且」（分步），先分清是哪种再套公式。"
      },
      {
        "id": "ch06-q4",
        "ch": "ch06",
        "kp": "ch06-4",
        "tier": 3,
        "type": "mcq",
        "difficulty": 3,
        "tags": [
          "calc"
        ],
        "stem": "1 到 100 的整数中，能被 2 或 3 整除的共有多少个？",
        "options": [
          {
            "text": "67",
            "correct": true
          },
          {
            "text": "83"
          },
          {
            "text": "50"
          },
          {
            "text": "33"
          }
        ],
        "explain": "能被 2 整除的有 50 个，能被 3 整除的有 33 个，两者都能（即被 6 整除）的有 16 个。容斥原理：|A ∪ B| = |A| + |B| − |A ∩ B| = 50 + 33 − 16 = 67。不减交集就会把 6 的倍数数两遍。"
      },
      {
        "id": "ch06-q5",
        "ch": "ch06",
        "kp": "ch06-5",
        "tier": 1,
        "type": "fill",
        "difficulty": 2,
        "tags": [
          "concept"
        ],
        "stem": "任意 13 个人中，至少有 2 个人出生在同一个月份。这里用到的原理叫 ______ 原理。",
        "answer": "鸽巢",
        "accept": [
          "鸽巢",
          "抽屉",
          "鸽巢原理",
          "抽屉原理"
        ],
        "explain": "13 个人是 13 只鸽子，12 个月份是 12 个鸽巢。由抽屉原理（鸽巢原理），如果鸽子比巢多，至少有一个巢里住着两只鸽子。这条看似简单的原理能证明很多「一定存在」型结论。"
      },
      {
        "id": "ch06-q6",
        "ch": "ch06",
        "kp": "ch06-7",
        "tier": 3,
        "type": "fill",
        "difficulty": 3,
        "tags": [
          "calc"
        ],
        "stem": "把 10 个完全相同的球放进 3 个不同的盒子，允许有空盒，共有 ______ 种放法。",
        "answer": "66",
        "explain": "这是「隔板法」的允许空盒版本：把 10 个球和 2 块隔板排成一列，共 12 个位置，选出 2 个放隔板，方案数 C(12,2) = 66。若要求每个盒子至少 1 个球，就先每个盒子放 1 个，剩 7 个球与 2 块隔板，方案数 C(9,2) = 36。"
      },
      {
        "id": "ch06-q7",
        "ch": "ch06",
        "kp": "ch06-3",
        "tier": 2,
        "type": "multi",
        "difficulty": 3,
        "tags": [
          "concept"
        ],
        "stem": "下面哪些组合恒等式成立？（多选）",
        "options": [
          {
            "text": "C(n, k) = C(n, n − k)",
            "correct": true
          },
          {
            "text": "C(n, k) = C(n−1, k−1) + C(n−1, k)",
            "correct": true
          },
          {
            "text": "C(n, 0) + C(n, 1) + … + C(n, n) = 2ⁿ",
            "correct": true
          },
          {
            "text": "C(n, k) = n · C(n, k−1)",
            "correct": false
          },
          {
            "text": "C(n, k) = P(n, k) / k! 不成立",
            "correct": false
          }
        ],
        "explain": "前三条都是组合数的基本恒等式：对称性对应「选了 k 个等价于没选 n−k 个」；帕斯卡恒等式是「固定一个特殊元素，分选它和不选它两类」；求和恒等式是「所有子集数 = 2ⁿ」。第四条正确形式是 C(n,k) = C(n−1,k−1) · n/k；第五条错误，C(n,k) = P(n,k)/k! 正是成立的。"
      },
      {
        "id": "ch07-q1",
        "ch": "ch07",
        "kp": "ch07-2",
        "tier": 1,
        "type": "fill",
        "difficulty": 1,
        "tags": [
          "calc"
        ],
        "stem": "一个无向图所有顶点的度数之和为 24，则它的边数是 ______ 条。",
        "answer": "12",
        "explain": "握手定理：所有顶点度数之和等于边数的 2 倍，因为每条边给两个端点各贡献 1 度。所以 |E| = 24 / 2 = 12。推论：度数之和必定是偶数，且奇数度顶点的个数一定是偶数。"
      },
      {
        "id": "ch07-q2",
        "ch": "ch07",
        "kp": "ch07-3",
        "tier": 2,
        "type": "mcq",
        "difficulty": 2,
        "tags": [
          "concept"
        ],
        "stem": "一个连通无向图存在欧拉回路（经过每条边恰好一次并回到起点）的充要条件是？",
        "options": [
          {
            "text": "每个顶点的度数都是偶数",
            "correct": true
          },
          {
            "text": "每个顶点的度数都是奇数"
          },
          {
            "text": "恰有两个顶点的度数是奇数"
          },
          {
            "text": "图的顶点数是偶数"
          }
        ],
        "explain": "欧拉回路要求「进得来也出得去」，每个顶点被经过的次数要能两两配对，所以所有度数必须是偶数。如果只有两个奇度顶点，那只能存在欧拉路径（从其中一个奇点出发、另一个结束），回不到起点。注意欧拉回路看边，哈密顿回路看顶点，两者难度相差极大。"
      },
      {
        "id": "ch07-q3",
        "ch": "ch07",
        "kp": "ch07-4",
        "tier": 1,
        "type": "tf",
        "difficulty": 1,
        "tags": [
          "concept"
        ],
        "stem": "一棵有 n 个顶点的树恰好有 n − 1 条边。",
        "options": [
          {
            "text": "正确",
            "correct": true
          },
          {
            "text": "错误"
          }
        ],
        "explain": "树的定义是连通无环。从只有一个顶点的树开始，每加入一个顶点必须用恰好一条边把它接上，否则要么不连通、要么成环。所以 n 个顶点需要 n − 1 条边。反过来，「连通且有 n − 1 条边」与「无环且有 n − 1 条边」也都是树的等价刻画。"
      },
      {
        "id": "ch07-q4",
        "ch": "ch07",
        "kp": "ch07-5",
        "tier": 3,
        "type": "fill",
        "difficulty": 3,
        "tags": [
          "apply"
        ],
        "stem": "四个顶点 A、B、C、D，边权 AB = 1、BC = 2、CD = 3、AD = 4、AC = 5。用 Kruskal 算法求最小生成树，总权值为 ______。",
        "answer": "6",
        "explain": "按权值从小到大选边，跳过会成环的：先选 AB(1)，再选 BC(2)，第三小 CD(3) 接上 D 仍不成环，此时 4 个点已连通（3 条边），停止。AD(4) 和 AC(5) 都会成环，被跳过。总权值 1 + 2 + 3 = 6。最小生成树一定是 n − 1 条边。"
      },
      {
        "id": "ch07-q5",
        "ch": "ch07",
        "kp": "ch07-6",
        "tier": 2,
        "type": "mcq",
        "difficulty": 2,
        "tags": [
          "concept"
        ],
        "stem": "Dijkstra 算法求单源最短路时，不能正确处理哪种情况？",
        "options": [
          {
            "text": "存在负权边",
            "correct": true
          },
          {
            "text": "图中有环"
          },
          {
            "text": "图不连通"
          },
          {
            "text": "顶点数很大"
          }
        ],
        "explain": "Dijkstra 的贪心前提是「当前离源点最近的未访问顶点不会再被更短的路径改进」，有负权边时这个前提被破坏：一条负边可能让绕远路的代价反而更低。负权图要用 Bellman-Ford 或 SPFA。Dijkstra 本身能处理有环、不连通（只是到不了的点距离记为 ∞）的图。"
      },
      {
        "id": "ch07-q6",
        "ch": "ch07",
        "kp": "ch07-1",
        "tier": 1,
        "type": "fill",
        "difficulty": 1,
        "tags": [
          "calc"
        ],
        "stem": "完全图 K₆ 的边数是 ______。",
        "answer": "15",
        "explain": "完全图每一对顶点之间都有一条边，n 个顶点共有 C(n,2) = n(n−1)/2 条边。K₆ 就是 C(6,2) = 15。每个顶点的度数是 n − 1 = 5，全部顶点度数之和 6 × 5 = 30，恰好是边数的 2 倍，与握手定理一致。"
      },
      {
        "id": "ch07-q7",
        "ch": "ch07",
        "kp": "ch07-7",
        "tier": 3,
        "type": "mcq",
        "difficulty": 3,
        "tags": [
          "concept"
        ],
        "stem": "画偏序关系的哈斯图时，从关系图中删去的是哪些边？",
        "options": [
          {
            "text": "自反的环、由传递性隐含的边、方向性的箭头",
            "correct": true
          },
          {
            "text": "只删自反的环，其它都保留"
          },
          {
            "text": "删去所有指向下方的边"
          },
          {
            "text": "删去度数最大的顶点的边"
          }
        ],
        "explain": "哈斯图是对偏序关系的「精简可视化」：① 自反关系 a ≤ a 的环省略；② 若 a < b < c，则 a ≤ c 由传递性自动成立，这条边省略（只画覆盖关系）；③ 约定「上大下小」，箭头省略。这样偏序的全部信息都被保留，图也清爽。例如整数同余的等价类、集合的包含关系都能画成哈斯图。"
      }
    ]
  };

  CSC._quizPack = PACK;
  CSC.registerQuizPack(PACK);
})();
