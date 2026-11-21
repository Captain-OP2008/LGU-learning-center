/* =====================================================================
 * quiz.js · MAT3007 分章题库
 * 结构：{ items:[{ id, ch, kp, tier, type, difficulty, tags, stem,
 *                  options?, answer?, accept?, code?, explain }] }
 * 题型：mcq / tf / fill / multi / predict
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
        stem: '与一般非线性优化相比，凸优化多出来的最关键保证是：',
        options: [
          { text: '局部最优解就是全局最优解，且在约束规范下强对偶成立', correct: true },
          { text: '一定能在常数时间内解完', correct: false },
          { text: '不需要目标函数可微', correct: false },
          { text: '所有约束都必须是线性等式', correct: false }
        ],
        explain: '凸性把「局部最优」升级成「全局最优」，并让 KKT 从必要条件变成充要条件；多项式时间指的是随规模增长的复杂度量级，不是常数时间；凸优化同样要求目标函数可微或至少有次梯度。'
      },
      {
        id: 'ch00-q2', ch: 'ch00', kp: 'ch00-3', tier: 1, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: '只要目标函数和所有约束函数都是凸的，这个问题的对偶间隙就一定为零。',
        options: [
          { text: '正确', correct: false },
          { text: '错误', correct: true }
        ],
        explain: '凸性只保证弱对偶（对偶问题给出下界）。要得到零间隙还需要约束规范，例如 Slater 条件（存在严格内点）；线性规划因为约束是仿射的，只要可行有界就自动满足。'
      },
      {
        id: 'ch00-q3', ch: 'ch00', kp: 'ch00-4', tier: 1, type: 'fill', difficulty: 1,
        tags: ['definition'],
        stem: '凸优化标准形 min f0(x) s.t. f_i(x) ≤ 0（i=1..m）中，不等式约束的拉格朗日乘子必须满足 λ_i ≥ ______。',
        answer: '0',
        accept: ['零', '0（非负）'],
        explain: '不等式约束写成 f_i(x) ≤ 0，可行方向只能让它变小，所以乘子取非负；若约束写成 ≥ 0，乘子就变成非正，符号完全由约束方向决定。'
      },
      {
        id: 'ch00-q4', ch: 'ch00', kp: 'ch00-2', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['modeling'],
        stem: '手里的问题目标是最大化利润，而求解器只接受最小化。标准做法是：',
        options: [
          { text: '把目标改成 min −利润，最优解不变，最优值取相反数', correct: true },
          { text: '把约束全部取相反数，目标不动', correct: false },
          { text: '先随便取一个可行解，再局部搜索', correct: false },
          { text: '最大化问题不能转成最小化', correct: false }
        ],
        explain: 'min −f 与 max f 的可行域相同，同一个点同时取得两者的最优，只要把最优值反号即可。取负会改变凹凸性方向，所以 max 凹函数才等价于 min 凸函数。'
      },
      {
        id: 'ch00-q5', ch: 'ch00', kp: 'ch00-5', tier: 2, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '下列哪些问题族属于凸优化，可以调用成熟求解器在多项式时间内求解？（多选）',
        options: [
          { text: '线性规划 LP', correct: true },
          { text: '二次规划 QP（Hessian 半正定）', correct: true },
          { text: '二阶锥规划 SOCP', correct: true },
          { text: '半定规划 SDP', correct: true },
          { text: '0-1 整数线性规划', correct: false }
        ],
        explain: 'LP、QP（凸）、SOCP、SDP 都是凸锥规划的层次，彼此包含，均有内点法求解器。整数约束破坏凸性，0-1 规划是 NP 难的，只能用分支定界等组合方法。'
      },
      {
        id: 'ch00-q6', ch: 'ch00', kp: 'ch00-4', tier: 2, type: 'predict', difficulty: 2,
        tags: ['code'],
        code: 'import numpy as np\\n\\nQ = np.array([[2.0, 0.0], [0.0, 8.0]])\\nx = np.array([1.0, 1.0])\\nprint(x @ Q @ x)',
        stem: '这段代码打印出的数值是多少？（这是二次型 x^T Q x 在 x=(1,1) 处的值）',
        answer: '10.0',
        accept: ['10'],
        explain: 'x^T Q x = 2·1² + 8·1² = 10。只有交叉项出现在 Q 的非对角位置时才需要乘 2；这里 Q 是对角的，直接按对角元加权平方和即可。'
      },
      {
        id: 'ch00-q7', ch: 'ch00', kp: 'ch00-3', tier: 3, type: 'mcq', difficulty: 3,
        tags: ['concept'],
        stem: '一个凸问题不满足 Slater 条件时，下面哪种说法最准确？',
        options: [
          { text: 'KKT 一阶条件仍是必要条件，但强对偶与 KKT 的充分性需要单独验证', correct: true },
          { text: '问题一定没有最优解', correct: false },
          { text: '对偶问题一定不可行', correct: false },
          { text: '凸性因此失效，问题变成非凸的', correct: false }
        ],
        explain: 'Slater 只是保证强对偶的充分条件，不成立时可能出现正的对偶间隙（例如约束退化的情形），但问题仍是凸的，最优解可能存在，KKT 仍必要。'
      },

      /* ---------------- ch01 建模 ---------------- */
      {
        id: 'ch01-q1', ch: 'ch01', kp: 'ch01-3', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['modeling'],
        stem: '某厂生产 A、B 两种产品，要求 A 的产量不低于总产量的 30%。设产量为 x_A、x_B，正确的约束是：',
        options: [
          { text: 'x_A ≥ 0.3(x_A + x_B)', correct: true },
          { text: 'x_A ≥ 0.3 x_B', correct: false },
          { text: 'x_B ≥ 0.3(x_A + x_B)', correct: false },
          { text: 'x_A ≤ 0.3(x_A + x_B)', correct: false }
        ],
        explain: '「占总产量 30%」的分母是 x_A + x_B，不是另一个变量。整理得 0.7x_A − 0.3x_B ≥ 0，仍是线性约束；把分母写成单个变量是最常见的比例约束错误。'
      },
      {
        id: 'ch01-q2', ch: 'ch01', kp: 'ch01-2', tier: 1, type: 'tf', difficulty: 1,
        tags: ['modeling'],
        stem: '最大化 c^T x 与最小化 −c^T x 的可行域相同，最优解也相同。',
        options: [
          { text: '正确', correct: true },
          { text: '错误', correct: false }
        ],
        explain: '两个目标只差一个符号，同一点处一个取最大另一个取最小，所以最优解集合完全一致，只是最优值互为相反数。'
      },
      {
        id: 'ch01-q3', ch: 'ch01', kp: 'ch01-4', tier: 1, type: 'fill', difficulty: 1,
        tags: ['standard-form'],
        stem: '把自由变量 x ∈ ℝ 拆成 x = x⁺ − x⁻ 后，需要新加的非负约束是 x⁺, x⁻ ≥ ______。',
        answer: '0',
        accept: ['零', '0（非负）'],
        explain: '拆分的意义就是让两个新变量都满足标准形要求的非负性，原变量于是可以取任意实数；如果 x 本来就非负，就不需要拆。'
      },
      {
        id: 'ch01-q4', ch: 'ch01', kp: 'ch01-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['modeling'],
        stem: '建模四步（选变量、写目标、写约束、验证）中，最容易被跳过却最能救命的一步是：',
        options: [
          { text: '验证：检查量纲、边界情况与求解后的解释是否说得通', correct: true },
          { text: '写目标：尽量把目标写复杂', correct: false },
          { text: '选变量：变量越多越好', correct: false },
          { text: '写约束：把所有能想到的约束都加上', correct: false }
        ],
        explain: '模型能解出数不代表模型对。把最优解代回业务场景、检查单位与边界，往往能发现符号写反、漏掉非负约束这类根本性错误；变量与约束也不是越多越好，冗余会增加求解成本。'
      },
      {
        id: 'ch01-q5', ch: 'ch01', kp: 'ch01-7', tier: 2, type: 'multi', difficulty: 2,
        tags: ['modeling'],
        stem: '下列哪些是线性规划建模中的常见错误？（多选）',
        options: [
          { text: '漏写决策变量的非负约束', correct: true },
          { text: '把「不少于」写成了「不超过」', correct: true },
          { text: '比例约束的分母写成了单个变量而不是总量', correct: true },
          { text: '把可加的产量约束写成了耦合的非线性式', correct: true },
          { text: '给每个约束都标了单位', correct: false }
        ],
        explain: '前四项都会改变可行域或破坏线性性；标注单位是正确做法，能量纲检查发现系数写错。建模错误通常不会报错，只会悄悄给出一个「能算但不对」的最优解。'
      },
      {
        id: 'ch01-q6', ch: 'ch01', kp: 'ch01-2', tier: 2, type: 'predict', difficulty: 1,
        tags: ['code'],
        code: 'import numpy as np\\n\\nc = np.array([3.0, 5.0])\\nx = np.array([4.0, 2.0])\\nprint(c @ x)',
        stem: '某生产计划取 x=(4,2)，单位利润为 c=(3,5)。这段代码打印的总利润是多少？',
        answer: '22.0',
        accept: ['22'],
        explain: 'c^T x = 3·4 + 5·2 = 22。用向量点积写目标函数，既不容易漏项，也方便之后换成矩阵形式 A x ≤ b 交给求解器。'
      },
      {
        id: 'ch01-q7', ch: 'ch01', kp: 'ch01-5', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['lp'],
        stem: 'max 3x + 2y s.t. x + y ≤ 4，0 ≤ x ≤ 3，0 ≤ y ≤ 3。最优值是：',
        options: [
          { text: '11', correct: true },
          { text: '9', correct: false },
          { text: '12', correct: false },
          { text: '10', correct: false }
        ],
        explain: '枚举顶点：(0,0)=0、(3,0)=9、(3,1)=11、(1,3)=9、(0,3)=6。最优解 (3,1) 处两条上界同时起作用，最优值 11；12 是不可行的，因为 3+3=6 超过 x+y≤4。'
      },

      /* ---------------- ch02 凸集 ---------------- */
      {
        id: 'ch02-q1', ch: 'ch02', kp: 'ch02-2', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['convex-set'],
        stem: '下列集合中不是凸集的是：',
        options: [
          { text: '{ (x1,x2) : x1² + x2² ≥ 1 }（单位圆的外部）', correct: true },
          { text: '半空间 { x : a^T x ≤ b }', correct: false },
          { text: '多面体 { x : Ax ≤ b }', correct: false },
          { text: '球 { x : ‖x − c‖₂ ≤ r }', correct: false }
        ],
        explain: '取 (1,0) 与 (−1,0)，两者范数都是 1，属于集合；中点是原点，范数 0 < 1，不在集合里，所以单位圆外部不凸。半空间、多面体都是若干线性不等式之交，球由凸函数的下水平集给出，三者都凸。'
      },
      {
        id: 'ch02-q2', ch: 'ch02', kp: 'ch02-3', tier: 1, type: 'tf', difficulty: 1,
        tags: ['convex-set'],
        stem: '任意多个凸集的交集仍然是凸集。',
        options: [
          { text: '正确', correct: true },
          { text: '错误', correct: false }
        ],
        explain: '两点若同时在交集中，它们就同时在每一个凸集里，于是整条线段也在每个凸集里，从而在线段交集中。并集没有这个性质，两个凸集的并通常不是凸集。'
      },
      {
        id: 'ch02-q3', ch: 'ch02', kp: 'ch02-1', tier: 1, type: 'fill', difficulty: 1,
        tags: ['definition'],
        stem: '设 C 凸，x, y ∈ C，θ ∈ [0,1]。点 θx + (1−θ)y 称为 x 与 y 的一个 ______。',
        answer: '凸组合',
        accept: ['convex combination', '凸组合（convex combination）'],
        explain: '凸组合就是权重非负且和为 1 的线性组合。凸集的定义正是「对集合内任意两点的所有凸组合封闭」，这也是线性规划可行域可以只用顶点描述的基础。'
      },
      {
        id: 'ch02-q4', ch: 'ch02', kp: 'ch02-4', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['convex-set'],
        stem: '半空间 { x : a^T x ≤ b } 是凸集，最本质的原因是：',
        options: [
          { text: '它是线性函数的下水平集，而下水平集保持凸性', correct: true },
          { text: '它的边界是超平面，超平面一定凸', correct: false },
          { text: '不等号方向朝下就一定是凸集', correct: false },
          { text: '因为它有界', correct: false }
        ],
        explain: 'a^T x 是仿射函数，集合就是它取值不超过 b 的区域，即下水平集；凸函数的下水平集必凸，仿射函数是凸函数的特例。有界与否则无关，半空间是无界的。'
      },
      {
        id: 'ch02-q5', ch: 'ch02', kp: 'ch02-6', tier: 2, type: 'multi', difficulty: 2,
        tags: ['operations'],
        stem: '下列哪些运算保持凸性？（多选）',
        options: [
          { text: '任意多个凸集求交', correct: true },
          { text: '凸集在线性映射下的像（如投影到子空间）', correct: true },
          { text: '两个凸集的 Minkowski 和', correct: true },
          { text: '两个凸集的并', correct: false },
          { text: '凸集在线性映射下的原像', correct: true }
        ],
        explain: '交、线性像、Minkowski 和、线性原像都保凸，这是「凸性可以按运算规则传递」的核心清单；并集不保凸，两个半空间的并中间会缺掉一大块。'
      },
      {
        id: 'ch02-q6', ch: 'ch02', kp: 'ch02-6', tier: 2, type: 'predict', difficulty: 2,
        tags: ['code'],
        code: 'import numpy as np\\n\\np = np.array([1.0, 0.0])\\nq = np.array([0.0, 1.0])\\nm = 0.5 * (p + q)\\nprint(bool(m.sum() <= 1.0))',
        stem: '这段代码判断中点是否属于集合 { x : x1 + x2 ≤ 1 }。打印结果是什么？',
        answer: 'True',
        accept: ['true', 'True', '是'],
        explain: '中点为 (0.5,0.5)，和为 1，满足 ≤ 1，因此打印 True。这个集合是半空间，p、q 与中点都在其中，正好演示「线段不越界」。'
      },
      {
        id: 'ch02-q7', ch: 'ch02', kp: 'ch02-7', tier: 3, type: 'mcq', difficulty: 2,
        tags: ['polytope'],
        stem: '多面体 P = { x : Ax ≤ b } 的极点（extreme point）的正确描述是：',
        options: [
          { text: '不能表示成 P 中两个不同点的严格凸组合的点', correct: true },
          { text: '目标函数在该点处梯度为零的点', correct: false },
          { text: '所有约束都取等号的点', correct: false },
          { text: 'P 中坐标最大的点', correct: false }
        ],
        explain: '极点就是「顶点」：一旦能写成别人的凸组合，它就落在一条线段内部，不是顶点。所有约束取等号是更强的条件（顶点只需 n 个线性无关约束起作用），而最优解总可以在某个顶点取到（LP 基本定理）。'
      },

      /* ---------------- ch03 凸函数 ---------------- */
      {
        id: 'ch03-q1', ch: 'ch03', kp: 'ch03-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['convex-function'],
        stem: '下列函数在 ℝ 上不是凸函数的是：',
        options: [
          { text: 'sin x', correct: true },
          { text: 'x²', correct: false },
          { text: '|x|', correct: false },
          { text: 'e^x', correct: false }
        ],
        explain: 'sin x 在 (0,π) 上是凹的、在 (π,2π) 上是凸的，二阶导数 cos 变号，不满足全局凸性。x²、|x|、e^x 的二阶导（或次梯度单调性）都保证凸。'
      },
      {
        id: 'ch03-q2', ch: 'ch03', kp: 'ch03-2', tier: 1, type: 'tf', difficulty: 1,
        tags: ['convex-function'],
        stem: '若 f 二阶可微、定义域为凸集，且 ∇²f(x) ⪰ 0 对所有 x 成立，则 f 是凸函数。',
        options: [
          { text: '正确', correct: true },
          { text: '错误', correct: false }
        ],
        explain: 'Hessian 半正定意味着沿任意方向的一元函数二阶导非负，于是每条线段上函数值不超过端点连线，正是凸性的定义；反过来凸函数在不可微点要用次梯度代替。'
      },
      {
        id: 'ch03-q3', ch: 'ch03', kp: 'ch03-4', tier: 1, type: 'fill', difficulty: 1,
        tags: ['first-order'],
        stem: '凸函数的一阶条件 f(y) ≥ f(x) + ∇f(x)^T(y − x) 说明：梯度在 x 处定义的超平面是整张函数图像的全局 ______。',
        answer: '下界',
        accept: ['下界（支撑超平面）', '支撑超平面', 'lower bound'],
        explain: '这条不等式给出一个仿射函数，处处不超过 f，因此它把图像「托」在下面，对应 epigraph 的支撑超平面。非凸函数没有这个性质，这也是凸优化能判断全局最优的根本原因。'
      },
      {
        id: 'ch03-q4', ch: 'ch03', kp: 'ch03-6', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['composition'],
        stem: '复合函数 g(h(x)) 保凸的常用充分条件是：',
        options: [
          { text: 'h 凸，g 凸且单调不减', correct: true },
          { text: 'h 凹，g 凸且单调不减', correct: false },
          { text: 'h 凸，g 凹且单调递减', correct: false },
          { text: '只要 g 凸就够，h 任意', correct: false }
        ],
        explain: '保凸复合规则要求内层与外层的「方向」匹配：h 凸时 g 需凸且非降；若 g 非增，则 h 要凹。把规则表背混是常见错误，检查时可以直接对一维例子验算。'
      },
      {
        id: 'ch03-q5', ch: 'ch03', kp: 'ch03-7', tier: 2, type: 'multi', difficulty: 2,
        tags: ['operations'],
        stem: '下列哪些运算保持凸性？（多选）',
        options: [
          { text: '非负加权求和', correct: true },
          { text: '逐点取最大', correct: true },
          { text: '与仿射映射复合', correct: true },
          { text: '两个凸函数相乘', correct: false },
          { text: '逐点上确界（一族凸函数）', correct: true }
        ],
        explain: '非负加权和、逐点最大、上确界、与仿射映射复合都保凸。乘积不保凸：f1(x) = x 与 f2(x) = x² 都凸，但 f1·f2 = x³ 的二阶导为 6x，在 x < 0 时为负，整体不是凸函数。遇到乘积先看能否化成平方、对数或分式再判定。'
      },
      {
        id: 'ch03-q6', ch: 'ch03', kp: 'ch03-3', tier: 2, type: 'predict', difficulty: 1,
        tags: ['code'],
        code: 'def f(x):\\n    return x ** 2 + 2 * x\\n\\nprint(f(2.0))',
        stem: 'f(x) = x² + 2x，这段代码打印的值是多少？',
        answer: '8.0',
        accept: ['8'],
        explain: '2² + 2·2 = 4 + 4 = 8。这个函数在 x = −1 处取到最小值 −1，求导得 2x + 2 = 0；它也是凸函数，Hessian 恒为 2 > 0。'
      },
      {
        id: 'ch03-q7', ch: 'ch03', kp: 'ch03-8', tier: 3, type: 'mcq', difficulty: 2,
        tags: ['strong-convexity'],
        stem: '若 f 是 m-强凸（m > 0）函数，则下列说法正确的是：',
        options: [
          { text: '若最优解存在，则它唯一；且 f 一定在某个有界区域内取到最小值', correct: true },
          { text: 'f 一定有最小值，即使定义域无界', correct: false },
          { text: 'f 的 Hessian 一定处处正定', correct: false },
          { text: '强凸等价于严格凸', correct: false }
        ],
        explain: 'm-强凸给出 f(y) ≥ f(x) + ∇f(x)^T(y−x) + (m/2)‖y−x‖²，函数向无穷远二次增长，所以最优解若存在必唯一且下水平集有界；但定义域本身可能开（如 (0,1) 上的 x²），最小值仍可能取不到。严格凸不蕴含强凸，例如 e^x 严格凸但 m = 0。'
      },

      /* ---------------- ch04 凸优化问题 ---------------- */
      {
        id: 'ch04-q1', ch: 'ch04', kp: 'ch04-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['standard-form'],
        stem: '凸优化标准形对三类函数的要求是：',
        options: [
          { text: '目标函数凸、不等式约束函数凸、等式约束仿射', correct: true },
          { text: '目标函数凸、不等式约束凹、等式约束凸', correct: false },
          { text: '目标函数与约束都只需连续', correct: false },
          { text: '目标函数凹、约束凸', correct: false }
        ],
        explain: '约束写成 f_i(x) ≤ 0 时，可行域是凸函数的下水平集之交，仍是凸集；等式约束必须仿射，因为 h(x) = 0 同时是 h ≤ 0 与 −h ≤ 0，只有仿射函数与其相反数同时凸。'
      },
      {
        id: 'ch04-q2', ch: 'ch04', kp: 'ch04-2', tier: 1, type: 'tf', difficulty: 1,
        tags: ['standard-form'],
        stem: '把等式约束写成 h(x) = 0 时，h 可以是任意凸函数。',
        options: [
          { text: '正确', correct: false },
          { text: '错误', correct: true }
        ],
        explain: 'h(x) = 0 等价于 h(x) ≤ 0 且 −h(x) ≤ 0，要求 h 与 −h 同时凸，只有仿射函数满足。若 h 是非线性凸函数，h(x) = 0 通常是曲面，可行域不再凸。'
      },
      {
        id: 'ch04-q3', ch: 'ch04', kp: 'ch04-3', tier: 1, type: 'fill', difficulty: 1,
        tags: ['slack'],
        stem: '引入松弛变量 s_i ≥ 0，可把不等式 f_i(x) ≤ 0 改写成等式 f_i(x) + s_i = ______。',
        answer: '0',
        accept: ['零'],
        explain: '松弛变量把不等式变成等式，便于套用等式约束的算法与对偶推导；s_i ≥ 0 与 f_i(x) ≤ 0 完全等价，s_i 的最优值恰好度量约束的松紧。'
      },
      {
        id: 'ch04-q4', ch: 'ch04', kp: 'ch04-4', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['qp'],
        stem: '下列问题中是凸优化问题的是：',
        options: [
          { text: 'min x1² + x2² s.t. x1 + x2 ≥ 1', correct: true },
          { text: 'min x1x2 s.t. x1 + x2 = 2, x ≥ 0', correct: false },
          { text: 'min x1² − x2² s.t. x1 + x2 = 1', correct: false },
          { text: 'min x1² + x2² s.t. x1² ≥ 1', correct: false }
        ],
        explain: '第一项目标凸、约束仿射，是标准 QP。x1x2 的 Hessian 不定；x1² − x2² 的 Hessian 有负特征值，目标非凸；x1² ≥ 1 的可行域是两条射线之外的部分，两点连线会穿过中间禁区，不凸。'
      },
      {
        id: 'ch04-q5', ch: 'ch04', kp: 'ch04-5', tier: 2, type: 'multi', difficulty: 2,
        tags: ['transformation'],
        stem: '下列哪些做法是合法的凸问题等价变换？（多选）',
        options: [
          { text: '引入松弛变量把不等式变成等式', correct: true },
          { text: '用 epigraph 形式把 min f0 写成 min t s.t. f0(x) ≤ t', correct: true },
          { text: '消去线性等式约束（解出部分变量代入）', correct: true },
          { text: '对约束两边同时平方', correct: false },
          { text: '把目标函数乘上 −1 后仍求最小', correct: false }
        ],
        explain: '松弛变量、epigraph、消元都是保等价的标准手法（epigraph 要求 f0 凸）；平方会改变可行域，除非两边都非负；目标乘 −1 会把最小化变成最大化，最优解虽相同但问题类型反了。'
      },
      {
        id: 'ch04-q6', ch: 'ch04', kp: 'ch04-4', tier: 2, type: 'predict', difficulty: 1,
        tags: ['code'],
        code: 'xs = [2.0, 3.0, 4.0]\\nprint(min(x * x for x in xs))',
        stem: '在约束 x ≥ 2 下最小化 x²。这段代码枚举了可行点，打印的最小值是多少？',
        answer: '4.0',
        accept: ['4'],
        explain: 'x² 在 x ≥ 0 上单调递增，所以约束下界 x = 2 就是最优点，最小值为 4。若约束改成 x ≥ −2，最优点会变成 x = 0，说明投影到约束集合才是关键步骤。'
      },
      {
        id: 'ch04-q7', ch: 'ch04', kp: 'ch04-6', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['hierarchy'],
        stem: '关于 LP、QP、SOCP、SDP 的包含关系，正确的是：',
        options: [
          { text: 'LP ⊆ QP ⊆ SOCP ⊆ SDP', correct: true },
          { text: 'SDP ⊆ SOCP ⊆ QP ⊆ LP', correct: false },
          { text: 'SOCP 与 QP 互不包含', correct: false },
          { text: '四者完全相同，只是叫法不同', correct: false }
        ],
        explain: 'LP 是线性目标加仿射约束；QP 把目标换成凸二次；SOCP 用二阶锥约束统一描述 QP 与许多范数约束；SDP 用半正定锥，包含 SOCP。越往右表达力越强、单步代价也越高。'
      },

      /* ---------------- ch05 对偶 ---------------- */
      {
        id: 'ch05-q1', ch: 'ch05', kp: 'ch05-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['dual'],
        stem: '对标准形 min f0 s.t. f_i(x) ≤ 0, Ax = b 构造拉格朗日函数时，乘子的符号要求是：',
        options: [
          { text: '不等式乘子 λ ≥ 0，等式乘子 ν 可正可负', correct: true },
          { text: '所有乘子都必须 ≥ 0', correct: false },
          { text: '所有乘子都必须 ≤ 0', correct: false },
          { text: '乘子符号没有限制', correct: false }
        ],
        explain: 'λ ≥ 0 保证拉格朗日函数在可行点处不超过原目标，从而给出下界；等式约束两侧对称，ν 取任意实数都不会破坏这个下界性质。'
      },
      {
        id: 'ch05-q2', ch: 'ch05', kp: 'ch05-2', tier: 1, type: 'tf', difficulty: 2,
        tags: ['dual-function'],
        stem: '无论原问题是否凸，它的拉格朗日对偶函数 g(λ,ν) 都是凹函数。',
        options: [
          { text: '正确', correct: true },
          { text: '错误', correct: false }
        ],
        explain: 'g 是一族关于 (λ,ν) 的仿射函数的下确界，仿射函数既凸又凹，而「下确界」保凹，所以 g 恒凹。这正是对偶问题总是凸的原因，哪怕原问题非凸。'
      },
      {
        id: 'ch05-q3', ch: 'ch05', kp: 'ch05-3', tier: 1, type: 'fill', difficulty: 1,
        tags: ['weak-duality'],
        stem: '对任意可行 (λ,ν) 都有 g(λ,ν) ≤ p*，即 d* ≤ p*，这个结论称为 ______ 对偶。',
        answer: '弱',
        accept: ['weak', '弱对偶'],
        explain: '弱对偶对一切问题无条件成立，它给出 p* 的下界，可用于验证候选解；只有当 d* = p* 时（凸 + Slater 等）才称为强对偶。'
      },
      {
        id: 'ch05-q4', ch: 'ch05', kp: 'ch05-5', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['kkt'],
        stem: '对凸优化问题，在 Slater 条件成立时，KKT 条件是：',
        options: [
          { text: '最优性的充要条件', correct: true },
          { text: '仅是最优性的必要条件', correct: false },
          { text: '仅当目标可微时才必要', correct: false },
          { text: '与最优性无关', correct: false }
        ],
        explain: '凸性 + 约束规范使「满足 KKT」与「是全局最优解」互相推出，这就是凸优化可以用一阶条件直接判优的原因；非凸问题中 KKT 只是必要条件。'
      },
      {
        id: 'ch05-q5', ch: 'ch05', kp: 'ch05-5', tier: 2, type: 'multi', difficulty: 1,
        tags: ['kkt'],
        stem: 'KKT 条件包含下列哪几项？（多选）',
        options: [
          { text: '平稳性：拉格朗日函数对 x 的梯度为零', correct: true },
          { text: '原始可行：f_i(x) ≤ 0 且 Ax = b', correct: true },
          { text: '对偶可行：λ ≥ 0', correct: true },
          { text: '互补松弛：λ_i f_i(x) = 0', correct: true },
          { text: '目标函数值等于零', correct: false }
        ],
        explain: '四项缺一不可。互补松弛说明「约束起作用」与「乘子非零」只能两者之一发生；目标值没有任何约束，最优值通常不为零。'
      },
      {
        id: 'ch05-q6', ch: 'ch05', kp: 'ch05-8', tier: 2, type: 'predict', difficulty: 2,
        tags: ['code'],
        code: 'pts = [(6.0, 0.0), (3.0, 1.0), (0.0, 4.0)]\\nprint(min(2 * a + 3 * b for a, b in pts))',
        stem: 'min 2x1 + 3x2 s.t. x1 + x2 ≥ 4, x1 + 3x2 ≥ 6, x ≥ 0 的可行域顶点为 (6,0)、(3,1)、(0,4)。代码打印的最小目标值是多少？',
        answer: '9.0',
        accept: ['9'],
        explain: '三个顶点的目标值分别为 12、9、12，最小是 9，在 (3,1) 处取得。此时两条约束都取等号，对偶解 y=(1.5,0.5) 给出同样的值 9，正好演示强对偶。'
      },
      {
        id: 'ch05-q7', ch: 'ch05', kp: 'ch05-6', tier: 3, type: 'mcq', difficulty: 2,
        tags: ['sensitivity'],
        stem: '若约束右端项 b_i 增加 1 个单位，最优值 p* 的变化量约等于：',
        options: [
          { text: '−λ_i*（在基不变的范围内）', correct: true },
          { text: '+λ_i*，且对任意增量都成立', correct: false },
          { text: '0，因为乘子只与目标有关', correct: false },
          { text: '−p*，与乘子无关', correct: false }
        ],
        explain: '灵敏度公式是 ∂p*/∂b_i = −λ_i*（对 Ax = b 形式；对 Ax ≥ b 则符号相反）。它只在当前有效约束集合（基）不变的邻域里成立，增量太大时基会切换。'
      },

      /* ---------------- ch06 无约束算法 ---------------- */
      {
        id: 'ch06-q1', ch: 'ch06', kp: 'ch06-2', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['line-search'],
        stem: '回溯线搜索的 Armijo 判据是 f(x + t d) ≤ f(x) + α t ∇f(x)^T d，其中 α 通常取：',
        options: [
          { text: '0.3 这类 (0, 0.5) 内的小常数', correct: true },
          { text: '1.0，取满整步', correct: false },
          { text: '2.0，放大步长', correct: false },
          { text: 'α 必须等于 1/2 才能收敛', correct: false }
        ],
        explain: 'α 取 (0,0.5) 内的小常数即可，常用 1e−4 或 0.3；它要求目标至少下降当前线性预测的一小部分。α ≥ 1 会让判据比一阶近似还松，失去「充分下降」的意义。'
      },
      {
        id: 'ch06-q2', ch: 'ch06', kp: 'ch06-4', tier: 2, type: 'tf', difficulty: 2,
        tags: ['newton'],
        stem: '牛顿法的收敛速度基本不受问题条件数影响（仿射不变），代价是每步需要 O(n³) 量级的线性代数。',
        options: [
          { text: '正确', correct: true },
          { text: '错误', correct: false }
        ],
        explain: '牛顿方向对变量做仿射变换保持不变，因此迭代次数与 κ 基本无关；代价是要算 Hessian 并解线性方程组，每步 O(n³)，大规模时改用拟牛顿或截断牛顿。'
      },
      {
        id: 'ch06-q3', ch: 'ch06', kp: 'ch06-3', tier: 1, type: 'fill', difficulty: 2,
        tags: ['convergence'],
        stem: '目标凸且梯度 L-Lipschitz 时，固定步长梯度下降满足 f(x_k) − f* ≤ L‖x0 − x*‖² / (2______)。',
        answer: 'k',
        accept: ['k（迭代次数）', '迭代次数'],
        explain: '这是 O(1/k) 次线性（sublinear）速率：误差随迭代次数反比下降，要把误差减半大约要翻倍迭代。强凸时升级为线性收敛 (1 − m/L)^k。'
      },
      {
        id: 'ch06-q4', ch: 'ch06', kp: 'ch06-5', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['bfgs'],
        stem: 'BFGS 更新中要求 y^T s > 0（s 为步长向量、y 为梯度差），目的是：',
        options: [
          { text: '保证更新后的近似 Hessian 保持正定', correct: true },
          { text: '保证目标函数值一定下降', correct: false },
          { text: '让步长恒等于 1', correct: false },
          { text: '使 Hessian 变成对角阵', correct: false }
        ],
        explain: 'BFGS 是割线条件的秩二更新，y^T s > 0 时更新保持正定，从而搜索方向仍是下降方向。非凸或线搜索不充分时 y^T s 可能 ≤ 0，需要重置或改用阻尼更新。'
      },
      {
        id: 'ch06-q5', ch: 'ch06', kp: 'ch06-7', tier: 2, type: 'multi', difficulty: 1,
        tags: ['stopping'],
        stem: '下列哪些是合理的迭代停止准则？（多选）',
        options: [
          { text: '梯度范数相对小于阈值：‖∇f‖ ≤ ε(1 + |f|)', correct: true },
          { text: '相邻两次目标函数值变化足够小', correct: true },
          { text: '步长 ‖x_{k+1} − x_k‖ 足够小', correct: true },
          { text: '固定跑满 10 次迭代就停', correct: false },
          { text: '有约束时检查原始残差、对偶残差与间隙', correct: true }
        ],
        explain: '停止准则要能反映「离最优还有多远」：梯度范数、目标变化、步长、约束问题的三项残差都是可解释的度量。写死迭代次数只能控制预算，不能保证精度。'
      },
      {
        id: 'ch06-q6', ch: 'ch06', kp: 'ch06-1', tier: 2, type: 'predict', difficulty: 1,
        tags: ['code'],
        code: 'x = 1.0\\nt = 0.1\\nx = x - t * 2 * x\\nprint(x)',
        stem: '对 f(x) = x² 从 x = 1 做一步步长为 0.1 的梯度下降，代码打印的 x 是多少？',
        answer: '0.8',
        accept: ['0.8', '0.80'],
        explain: '梯度为 2x = 2，更新 x ← 1 − 0.1·2 = 0.8。对 x² 而言，步长必须小于 1/L = 1/2 = 0.5 才稳定，0.1 安全；若取 t = 0.6，x 会振荡发散。'
      },
      {
        id: 'ch06-q7', ch: 'ch06', kp: 'ch06-3', tier: 3, type: 'mcq', difficulty: 2,
        tags: ['condition'],
        stem: '条件数 κ = 100 的强凸二次问题，用梯度下降把误差降到 1e−6，迭代次数大致是：',
        options: [
          { text: '10³ 量级（约 κ·ln(1/ε)）', correct: true },
          { text: '10 量级，与 κ 无关', correct: false },
          { text: '10⁶ 量级', correct: false },
          { text: '1 次就够', correct: false }
        ],
        explain: '强凸光滑问题的收敛因子是 1 − m/L = 1 − 1/κ，达到 ε 需约 κ ln(1/ε) 次，κ = 100、ln(1/ε) ≈ 13.8，得到约 1380 次。这正是需要牛顿法或预条件的原因。'
      },

      /* ---------------- ch07 约束算法 ---------------- */
      {
        id: 'ch07-q1', ch: 'ch07', kp: 'ch07-1', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['newton-step'],
        stem: '从可行点出发求解等式约束问题时，牛顿步 Δx 必须满足：',
        options: [
          { text: 'AΔx = 0（落在约束的零空间里，保持可行）', correct: true },
          { text: 'AΔx = b（直接跳到右端）', correct: false },
          { text: 'Δx 与梯度同向', correct: false },
          { text: 'Δx = 0', correct: false }
        ],
        explain: '可行点处 A x = b，要维持等式必须 A(x + Δx) = b，即 AΔx = 0。不可行起点法把它放松成 AΔx = b − Ax，一步同时降低目标与修复可行性。'
      },
      {
        id: 'ch07-q2', ch: 'ch07', kp: 'ch07-2', tier: 1, type: 'tf', difficulty: 2,
        tags: ['penalty'],
        stem: '二次罚函数法必须让罚参数 ρ → ∞ 才能得到精确解，而 ρ 增大会使问题条件数变差。',
        options: [
          { text: '正确', correct: true },
          { text: '错误', correct: false }
        ],
        explain: '罚项 ρ‖f(x)‖² 只有在 ρ 无穷大时才能把违反约束的代价推到无穷，有限 ρ 的最优解一般略微违反约束；同时 Hessian 条件数随 ρ 线性增长，导致数值困难。增广拉格朗日用乘子估计把 ρ 固定住。'
      },
      {
        id: 'ch07-q3', ch: 'ch07', kp: 'ch07-3', tier: 1, type: 'fill', difficulty: 1,
        tags: ['barrier'],
        stem: '对数障碍法中，若障碍参数为 t，则当前障碍问题的最优解与原问题最优值的差距不超过 m / ______。',
        answer: 't',
        accept: ['t（障碍参数）'],
        explain: '这是经典的间隙界：对偶间隙 ≤ m/t，m 是约束个数。t 每增大 10 倍，间隙缩小 10 倍，因此外层只需 O(log(1/ε)) 次参数更新。'
      },
      {
        id: 'ch07-q4', ch: 'ch07', kp: 'ch07-5', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['interior-point'],
        stem: '原始-对偶内点法把对偶间隙降到 ε 所需的迭代次数是：',
        options: [
          { text: 'O(√m · log(1/ε))，每步解一个牛顿方程组', correct: true },
          { text: 'O(m²) 次，与 ε 无关', correct: false },
          { text: 'O(1/ε) 次', correct: false },
          { text: '恰好 m 次', correct: false }
        ],
        explain: '路径跟踪每步把间隙乘上 (1 − 0.01/√m)，从 η0 = 1 降到 ε 需要约 √m ln(1/ε)/0.01 步；实际实现里 Mehrotra 预测-校正通常 5–10 步就到 1e−8。'
      },
      {
        id: 'ch07-q5', ch: 'ch07', kp: 'ch07-7', tier: 2, type: 'multi', difficulty: 1,
        tags: ['admm'],
        stem: 'ADMM 的一轮迭代包含哪些步骤？（多选）',
        options: [
          { text: 'x-更新：最小化增广拉格朗日函数中的 x 部分', correct: true },
          { text: 'z-更新：通常是一个近端/软阈值操作', correct: true },
          { text: '对偶变量更新：u ← u + ρ(Ax + Bz − c)', correct: true },
          { text: '每轮重新计算并分解 Hessian', correct: false },
          { text: '把 ρ 强制设为 1', correct: false }
        ],
        explain: 'ADMM 交替最小化 x、z，再用原始残差更新对偶变量 u；x 子问题常可复用一次分解，z 子问题往往是闭式的软阈值，因此适合大规模分布式场景。ρ 可自适应调整，但不必设为 1。'
      },
      {
        id: 'ch07-q6', ch: 'ch07', kp: 'ch07-7', tier: 2, type: 'predict', difficulty: 2,
        tags: ['code'],
        code: 'import numpy as np\\n\\ndef soft(z, tau):\\n    return np.sign(z) * max(abs(z) - tau, 0.0)\\n\\nprint(soft(5.0, 2.0))',
        stem: '软阈值函数 S_τ(z) = sign(z)·max(|z| − τ, 0)。代码打印的结果是多少？',
        answer: '3.0',
        accept: ['3'],
        explain: 'abs(5) − 2 = 3，符号为正，所以输出 3.0。软阈值把小于 τ 的分量直接压成 0，并把其余分量整体向零平移 τ，这正是 Lasso 近端算子。'
      },
      {
        id: 'ch07-q7', ch: 'ch07', kp: 'ch07-6', tier: 3, type: 'mcq', difficulty: 2,
        tags: ['simplex'],
        stem: '如果求解器需要从已有的基出发做热启动，且问题规模中等、约束稀疏性一般，通常优先选择：',
        options: [
          { text: '单纯形法，它天然从给定基继续迭代', correct: true },
          { text: '内点法，它只接受零起点', correct: false },
          { text: '梯度下降，不需要线性代数', correct: false },
          { text: 'ADMM，永远是最快的', correct: false }
        ],
        explain: '单纯形法在顶点上走，天然支持给基热启动，约束个数少、热启动频繁的序列求解（如分支定界、滚动排产）有明显优势；内点法用不可行起点，热启动支持较弱，但大规模稀疏时往往更快。'
      }
    ]
  };
  CSC._quizPack = PACK;
  CSC.registerQuizPack(PACK);
})();
