/* =====================================================================
 * ch07.js · 第 7 章「约束优化算法：从罚函数到内点法」
 * 职责：等式约束的牛顿步与 KKT 系统、罚函数/增广拉格朗日、对数障碍与中心
 *       路径、原始-对偶内点法、单纯形对比、ADMM 与算子分裂、收敛判据。
 * 依据：MAT3007 教材第 7 章（等式约束最小化、内点法）。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch07',
  num: '07',
  title: '约束优化算法：从罚函数到内点法',
  en: 'CONSTRAINED MINIMIZATION',
  goals: [
    '写出等式约束问题的牛顿步与 KKT 系统，并说明为什么不能只对目标求牛顿方向',
    '用二次罚函数与增广拉格朗日处理约束，解释罚参数为什么会导致病态',
    '推导对数障碍问题的中心路径，说明对偶间隙 <code>m/t</code> 的来源',
    '描述原始-对偶内点法的一步迭代，并说明它的多项式复杂度从哪来',
    '在单纯形法、内点法、ADMM 之间按问题结构做选择，并给出可靠的停止判据'
  ],
  kp: [
    { id: 'ch07-1', title: '等式约束的牛顿步' },
    { id: 'ch07-2', title: '罚函数与增广拉格朗日' },
    { id: 'ch07-3', title: '对数障碍函数' },
    { id: 'ch07-4', title: '中心路径' },
    { id: 'ch07-5', title: '原始-对偶内点法' },
    { id: 'ch07-6', title: '单纯形与内点法的对比' },
    { id: 'ch07-7', title: 'ADMM 与算子分裂' },
    { id: 'ch07-8', title: '收敛判据与实现' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '为什么先读这一章', html: '第 6 章的算法假设「往哪走都行」。一旦有约束，随便走一步就可能出界。这一章给出三条处理约束的路线：把约束<b>吸收进牛顿步</b>（等式约束的 KKT 系统）、把约束<b>变成惩罚项</b>（罚函数与增广拉格朗日）、把约束<b>变成障碍</b>（对数障碍与内点法）。三条路线的数学核心是同一个东西——第 5 章的 KKT 条件。理解了这一点，你会发现「解约束问题」不过是「解一个非线性方程组」。' },

    { t: 'p', lead: true, html: '考虑 <code>min f<sub>0</sub>(x)</code>，<code>s.t. f<sub>i</sub>(x) ≤ 0</code>（<code>i = 1…m</code>），<code>Ax = b</code>，其中 <code>f<sub>i</sub></code> 凸、二阶可微。所有算法都在这条主线上：先找一个可行或近似可行的点，再沿着「既能降低目标、又不破坏可行性」的方向迭代。区别在于「不破坏可行性」如何度量——用等式、用罚、用障碍，分别对应三种算法家族。' },

    { t: 'h', lvl: 2, text: '一、等式约束的牛顿步', id: 'ch07-1' },

    { t: 'p', html: '先只看等式约束：<code>min f(x)</code>，<code>s.t. Ax = b</code>。可行点满足 <code>Ax = b</code>，所以任何搜索方向 <code>v</code> 必须满足 <code>Av = 0</code>（否则一步就出界）。<b>等式约束的牛顿步</b>就是解：<code>min<sub>v</sub> ∇f<sup>T</sup>v + ½v<sup>T</sup>∇<sup>2</sup>f v</code>，<code>s.t. Av = 0</code>。它的最优性条件（KKT）给出一个线性方程组。' },

    { t: 'p', html: '把它写成分块矩阵形式：<code>[[∇<sup>2</sup>f, A<sup>T</sup>], [A, 0]] · [Δx; w] = [−∇f; 0]</code>。第一个分块行是平稳性 <code>∇<sup>2</sup>f Δx + A<sup>T</sup>w = −∇f</code>，第二个是可行性 <code>AΔx = 0</code>。<code>w</code> 就是等式约束的乘子（增量形式）。整个矩阵叫 <b>KKT 矩阵</b>，它对称但<b>不定</b>（有正有负特征值），不能直接用 Cholesky 分解，要用 LDL<sup>T</sup> 或稀疏直接法。' },

    { t: 'p', html: '若当前点不可行（<code>Ax<sub>k</sub> ≠ b</code>），把第二个方程改成 <code>AΔx = b − Ax<sub>k</sub></code>，一步就能把可行性补回来。这叫<b>不可行起点牛顿法</b>（infeasible start Newton method），是内点法的前身：它同时消解「目标下降」与「可行性恢复」两个诉求，两者的权衡由残差 <code>r = (∇f + A<sup>T</sup>w, Ax − b)</code> 的范数控制。' },

    { t: 'p', html: '手算一个小例子：<code>min ½(x<sub>1</sub><sup>2</sup> + x<sub>2</sub><sup>2</sup>)</code>，<code>s.t. x<sub>1</sub> + x<sub>2</sub> = 1</code>。<code>∇f = (x<sub>1</sub>, x<sub>2</sub>)</code>，<code>∇<sup>2</sup>f = I</code>，<code>A = (1, 1)</code>。KKT 平稳性给出 <code>x<sub>1</sub> + w = 0</code>、<code>x<sub>2</sub> + w = 0</code>，故 <code>x<sub>1</sub> = x<sub>2</sub> = −w</code>；代入约束得 <code>−2w = 1</code>，<code>w = −0.5</code>，最优解 <code>(0.5, 0.5)</code>，最优值 0.25。牛顿法对这个二次问题<b>一步收敛</b>——和上一章一样，因为二次模型就是函数本身。' },

    { t: 'p', html: '不等式约束怎么办？两种思路。<b>① 有效集法</b>（active set）：猜哪些约束起作用，把它们当等式处理，解 KKT 系统，检查乘子是否非负、未起作用的约束是否满足；不满足就调整集合重来。有限步终止，适合小规模 QP。<b>② 障碍法</b>：把不等式「挡」在可行域内部，让迭代永远不碰边界。后者就是接下来四节的主题。' },

    { t: 'quiz', qid: 'ch07-q1' },

    { t: 'h', lvl: 2, text: '二、罚函数与增广拉格朗日', id: 'ch07-2' },

    { t: 'p', html: '<b>二次罚函数</b>把约束违反量平方后加进目标：<code>P<sub>ρ</sub>(x) = f<sub>0</sub>(x) + (ρ/2)Σ(max(0, f<sub>i</sub>(x)))<sup>2</sup> + (ρ/2)||Ax − b||<sup>2</sup></code>，然后对 <code>P<sub>ρ</sub></code> 做无约束最小化。想法很直接：违反约束要付出代价，<code>ρ</code> 越大代价越高。当 <code>ρ → ∞</code> 时，<code>P<sub>ρ</sub></code> 的极小点趋于原问题的可行最优解。' },

    { t: 'p', html: '问题是收敛得很难受。<b>① 只有 <code>ρ → ∞</code> 才精确</b>：有限 <code>ρ</code> 时解总是略微违反约束，误差量级 <code>O(1/ρ)</code>。<b>② 病态</b>：<code>P<sub>ρ</sub></code> 的 Hessian 条件数随 <code>ρ</code> 增长（约 <code>O(ρ)</code>），无约束求解器在 <code>ρ</code> 很大时几乎不动。所以「把 <code>ρ</code> 调到 <code>10<sup>8</sup></code> 硬算」在实践中会失败——不是精度不够，是数值上解不动。' },

    { t: 'p', html: '<b>增广拉格朗日</b>（augmented Lagrangian，也叫乘子法）解决了这个矛盾：<code>L<sub>ρ</sub>(x, λ, ν) = f<sub>0</sub> + Σ λ<sub>i</sub>f̃<sub>i</sub> + ν<sup>T</sup>(Ax−b) + (ρ/2)(Σ f̃<sub>i</sub><sup>2</sup> + ||Ax−b||<sup>2</sup>)</code>，其中 <code>f̃<sub>i</sub> = max(0, f<sub>i</sub>)</code>。它等于「拉格朗日函数 + 罚项」，交替做两步：<b>①</b> 固定乘子，对 <code>x</code> 最小化 <code>L<sub>ρ</sub></code>；<b>②</b> 用违反量更新乘子 <code>λ<sub>i</sub> ← max(0, λ<sub>i</sub> + ρf<sub>i</sub>(x))</code>、<code>ν ← ν + ρ(Ax − b)</code>。' },

    { t: 'p', html: '关键区别在于：<b>乘子承担了「精确性」，罚参数只承担「收敛速度」</b>。乘子收敛到真值时，即使 <code>ρ</code> 是有限的，<code>x</code> 也收敛到精确最优解。所以 <code>ρ</code> 不需要趋于无穷，病态问题被绕开了。这也是 ADMM 与很多现代分解算法的理论基础——ADMM 本质上就是对增广拉格朗日做交替最小化。' },

    { t: 'table', caption: '三种处理约束的方式', head: ['方法', '形式', '精确性', '主要问题'], rows: [
      ['二次罚函数', '<code>f<sub>0</sub> + (ρ/2)||违反||<sup>2</sup></code>', '需 <code>ρ→∞</code>', '条件数 <code>O(ρ)</code>，解不动'],
      ['增广拉格朗日', '罚项 + 乘子项，交替更新', '有限 <code>ρ</code> 即精确', '每步仍需解无约束子问题'],
      ['对数障碍', '<code>f<sub>0</sub> − (1/t)Σlog(−f<sub>i</sub>)</code>', '需 <code>t→∞</code>', '要严格可行起点，每步解 KKT']
    ] },

    { t: 'callout', kind: 'warn', title: '罚函数最常见的误用', html: '把 <code>ρ</code> 设成 <code>10<sup>10</sup></code> 然后抱怨求解器不收敛。正确的做法是：<code>ρ</code> 从 <code>1</code> 或 <code>10</code> 起，解子问题到中等精度，更新乘子，再逐步增大 <code>ρ</code>；或者干脆用增广拉格朗日，让乘子承担精度。' },

    { t: 'quiz', qid: 'ch07-q2' },

    { t: 'h', lvl: 2, text: '三、对数障碍函数', id: 'ch07-3' },

    { t: 'p', html: '障碍法用一个「无限高的墙」代替约束：<code>φ(x) = −Σ log(−f<sub>i</sub>(x))</code>，定义域是严格可行域 <code>{x | f<sub>i</sub>(x) &lt; 0}</code>。当 <code>x</code> 靠近边界时，<code>−f<sub>i</sub> → 0<sup>+</sup></code>，<code>−log(−f<sub>i</sub>) → +∞</code>，所以迭代永远被挡在内部。<b>障碍问题</b>是 <code>min f<sub>0</sub>(x) + (1/t)φ(x)</code>，<code>t &gt; 0</code> 是精度参数。' },

    { t: 'p', html: '为什么是 <code>log</code> 而不是别的？两个理由。<b>① 自洽性</b>：<code>−log</code> 的导数结构让障碍问题的 KKT 条件恰好是原问题的 KKT 条件加上 <code>λ<sub>i</sub>(−f<sub>i</sub>) = 1/t</code>——互补松弛被「软化」成一个等式，这正是内点法能顺着中心路径走的原因。<b>② 自 concordant</b>（self-concordant）：<code>−log</code> 的三阶导数被二阶导数控制，使得牛顿法的复杂度分析可以做到与问题规模无关的精度界。这是 Nesterov 与 Nemirovski 理论的核心，也是内点法多项式复杂度的来源。' },

    { t: 'p', html: '拿最简单的例子算一遍：<code>min x</code>，<code>s.t. x ≥ 1</code>。写成 <code>1 − x ≤ 0</code>，障碍问题 <code>min x − (1/t)log(x − 1)</code>。求导：<code>1 − 1/(t(x−1)) = 0</code>，得 <code>x(t) = 1 + 1/t</code>。当 <code>t → ∞</code>，<code>x(t) → 1</code>，正是原问题最优解；而间隙 <code>x(t) − 1 = 1/t = m/t</code>（这里 <code>m = 1</code>）。这个 <code>m/t</code> 不是巧合，一般地有 <code>f<sub>0</sub>(x(t)) − p* ≤ m/t</code>。' },

    { t: 'p', html: '间隙公式给出一个非常干净的算法：<b>外层把 <code>t</code> 乘以 <code>μ &gt; 1</code></b>（常取 <code>μ = 10</code> 或 <code>20</code>，权衡「外层轮数」与「内层牛顿收敛难度」），<b>内层用牛顿法解障碍问题</b>（以当前点为起点，通常 20–30 步），直到 <code>m/t ≤ ε</code>。总外层轮数是 <code>log<sub>μ</sub>(m/(εt<sub>0</sub>))</code>，每轮内层代价与 <code>n</code> 的关系由 Newton 系统决定。' },

    { t: 'p', html: '起点怎么办？障碍法要求严格可行点，而很多问题没有现成的。标准做法是<b>阶段一</b>（phase I）：引入松弛变量 <code>s</code>，解 <code>min s</code>、<code>s.t. f<sub>i</sub>(x) ≤ s</code>、<code>Ax = b</code>，从 <code>s = 1</code> 这种显然可行的点出发；若最优 <code>s* &lt; 0</code>，原问题严格可行，拿 <code>x*</code> 当起点；若 <code>s* &gt; 0</code>，原问题不可行。这一步在实现里往往比主算法还长，但逻辑很清晰。' },

    { t: 'h', lvl: 2, text: '四、中心路径', id: 'ch07-4' },

    { t: 'p', html: '对每个 <code>t</code>，障碍问题有唯一最优解 <code>x*(t)</code>（当 <code>f<sub>0</sub></code> 凸、障碍严格凸时）。所有 <code>x*(t)</code> 连成一条曲线，叫<b>中心路径</b>（central path）。它是可行域内部的一条光滑曲线，<code>t → ∞</code> 时趋向原问题最优解，<code>t → 0</code> 时趋向「解析中心」（可行域最「圆」的那个点）。' },

    { t: 'p', html: '中心路径上的点满足一组漂亮的方程：<code>∇f<sub>0</sub>(x) + Σ λ<sub>i</sub>∇f<sub>i</sub>(x) + A<sup>T</sup>ν = 0</code>，<code>f<sub>i</sub>(x) &lt; 0</code>，<code>λ<sub>i</sub> &gt; 0</code>，以及 <code>λ<sub>i</sub>(−f<sub>i</sub>(x)) = 1/t</code>。<b>最后一条就是被软化的互补松弛</b>：原来要求乘积为零，现在要求乘积等于 <code>1/t</code>。每个约束都「稍微起作用」一点，这正是内点法「走内部」的数学表达。' },

    { t: 'p', html: '把四个方程对 <code>t</code> 求导，可以算出中心路径的切线方向。这个切线与牛顿步的方向只差一个缩放，所以沿着中心路径走，本质上就是「解一系列结构相同的 KKT 系统」。进一步，<code>x*(t)</code> 处的对偶可行解可以取 <code>λ<sub>i</sub>(t) = −1/(t f<sub>i</sub>(x*(t)))</code>，于是对偶间隙恰好是 <code>m/t</code>——路径上的每一点都自带一个「上界 + 下界」的证书。' },

    { t: 'p', html: '这个「自带证书」的性质非常实用。算法不需要等到收敛才知道离最优多远：任意一个中心路径点都给出 <code>f<sub>0</sub>(x) − p* ≤ m/t</code>。这就是内点法能给出可靠停止判据（而不是「跑够 1000 步就停」）的根本原因。第 8 节的停止准则会用到它。' },

    { t: 'quiz', qid: 'ch07-q3' },

    { t: 'h', lvl: 2, text: '五、原始-对偶内点法', id: 'ch07-5' },

    { t: 'p', html: '障碍法要 <code>t → ∞</code> 才精确，外层轮数是对数级的，已经不错。但更彻底的做法是把 <code>x</code>、<code>λ</code>、<code>ν</code> 一起当未知量，直接对 KKT 系统做牛顿法——这就是<b>原始-对偶内点法</b>（primal-dual interior-point method）。它不需要外层循环，一次迭代同时改进原始与对偶。' },

    { t: 'p', html: '记三个残差：<b>对偶残差</b> <code>r<sub>d</sub> = ∇f<sub>0</sub> + Σλ<sub>i</sub>∇f<sub>i</sub> + A<sup>T</sup>ν</code>；<b>原始残差</b> <code>r<sub>p</sub> = (f<sub>i</sub>(x) + s<sub>i</sub>, Ax − b)</code>（若引入松弛变量 <code>s &gt; 0</code>）；<b>中心化残差</b> <code>r<sub>c</sub> = −diag(λ)s − (1/t)𝟙</code>。当三个残差都为零时，KKT 条件精确成立。牛顿法要解的线性系统是这三个方程的雅可比乘以增量等于负残差，结构是「Hessian + 对角 + 约束块」，可用稀疏分解高效求解。' },

    { t: 'p', html: '一步迭代的流程很短：<b>①</b> 算三个残差与代理间隙 <code>η = λ<sup>T</sup>s</code>；<b>②</b> 解牛顿系统得 <code>(Δx, Δs, Δλ, Δν)</code>；<b>③</b> 取步长 <code>α = min(1, 0.99·α<sub>max</sub>)</code>，其中 <code>α<sub>max</sub></code> 保证 <code>λ &gt; 0</code>、<code>s &gt; 0</code>；<b>④</b> 更新四个变量，<code>t</code> 增大，重复。' },

    { t: 'p', html: '为什么是多项式复杂度？关键在于代理间隙每步按固定比例缩小。取 <code>t</code> 合适、<code>α</code> 取 0.99 时，可证 <code>η<sub>k+1</sub> ≤ (1 − 0.01/√m)η<sub>k</sub></code>，于是达到 <code>η ≤ ε</code> 需要 <code>O(√m log(1/ε))</code> 步——这就是内点法「著名」的 <code>√m</code>。步长受限的原因是必须保持 <code>λ, s &gt; 0</code>，而牛顿方向会把人推向边界，所以只能走 99% 的路。' },

    { t: 'p', html: '实践中还有两个变体：<b>Mehrotra 预测-校正</b>（predictor-corrector）先算一个「纯牛顿」方向（相当于 <code>t = 0</code>，只求可行性）再算一个校正方向，用二阶信息修正，通常 5–10 步就到 <code>10<sup>−8</sup></code> 精度；<b>不可行起点</b>版本不要求初始点可行，直接从 <code>x = 0</code>、<code>s = 1</code>、<code>λ = 1</code> 起步，靠牛顿步把残差压到零。主流求解器（MOSEK、Gurobi、Clarabel、ECOS）的内点法都是这两个技术的组合。' },

    { t: 'h', lvl: 2, text: '六、单纯形与内点法的对比', id: 'ch07-6' },

    { t: 'p', html: '线性规划有两条完全不同的求解路线。<b>单纯形法</b>（simplex）沿着可行多面体的<b>顶点</b>走：从一个基本可行解出发，每次沿一条边移动到相邻的、目标更好的顶点，直到没有改进方向。它输出的一定是顶点解，且附带一个<b>基</b>（哪些约束起作用），这正是灵敏度分析需要的信息。' },

    { t: 'p', html: '<b>内点法</b>走的是可行域<b>内部</b>：迭代点永远严格可行，从不落在边界上，最后才逼近最优顶点。它不产生基，但也不受「顶点数指数级」的影响。<b>复杂度上</b>：单纯形法最坏情形是指数时间（Klee–Minty 立方体），内点法是 <code>O(√n log(1/ε))</code> 次迭代的严格多项式算法。' },

    { t: 'table', caption: '单纯形法与内点法的对照', head: ['维度', '单纯形法', '内点法'], rows: [
      ['迭代路径', '沿顶点与边移动', '穿越可行域内部'],
      ['最坏复杂度', '指数（Klee–Minty）', '多项式 <code>O(√n log(1/ε))</code>'],
      ['典型迭代数', '与顶点数有关，常几十到几千', '30–60 步，与规模弱相关'],
      ['输出', '顶点解 + 基（便于灵敏度）', '近似最优解（内部点）'],
      ['热启动', '极强（改右端项几乎免费）', '较弱'],
      ['适合', '小中型、需反复求解、需基信息', '大规模稀疏、超高精度']
    ] },

    { t: 'p', html: '实践中的结论有点反直觉：<b>两者都很好用，选哪个取决于「要不要反复解」</b>。单次求解大规模稀疏 LP，内点法往往更快（迭代数与规模几乎无关）；但若要在分支定界里解上万个只改一点点的 LP，单纯形法的热启动优势压倒一切。商业求解器通常两者都实现，让用户按场景切换。' },

    { t: 'p', html: '还有一类「交叉」方法：用内点法先跑几步，等接近最优解时切换到单纯形法「收尾」，同时拿到基。这在需要灵敏度分析又嫌单纯形太慢的时候很有用。理解两种方法的互补性，比记住「哪个更快」更有价值。' },

    { t: 'h', lvl: 2, text: '七、ADMM 与算子分裂', id: 'ch07-7' },

    { t: 'p', html: '最后看一类结构完全不同的问题：目标可以拆成两块，<code>min f(x) + g(z)</code>，<code>s.t. Ax + Bz = c</code>。典型例子是 Lasso：<code>f(x) = ½||Ax − b||<sup>2</sup></code>（光滑），<code>g(z) = μ||z||<sub>1</sub></code>（不光滑但近端算子简单），约束 <code>x − z = 0</code>。' },

    { t: 'p', html: '<b>ADMM</b>（alternating direction method of multipliers）对增广拉格朗日做交替最小化：<code>x<sup>k+1</sup> = argmin<sub>x</sub> f(x) + (ρ/2)||Ax + Bz<sup>k</sup> − c + u<sup>k</sup>||<sup>2</sup></code>；<code>z<sup>k+1</sup> = argmin<sub>z</sub> g(z) + (ρ/2)||Ax<sup>k+1</sup> + Bz − c + u<sup>k</sup>||<sup>2</sup></code>；<code>u<sup>k+1</sup> = u<sup>k</sup> + Ax<sup>k+1</sup> + Bz<sup>k+1</sup> − c</code>。三步都很便宜，因为 <code>f</code> 与 <code>g</code> 被<b>分开</b>处理了。' },

    { t: 'code', lang: 'python', caption: 'ADMM 解 Lasso（20 行）', code: `import numpy as np

def soft(z, tau):
    return np.sign(z) * np.maximum(np.abs(z) - tau, 0.0)

def lasso_admm(A, b, mu, rho=1.0, iters=500, tol=1e-6):
    n = A.shape[1]
    AtA = A.T @ A
    Atb = A.T @ b
    x = np.zeros(n); z = np.zeros(n); u = np.zeros(n)
    for k in range(iters):
        x = np.linalg.solve(AtA + rho * np.eye(n), Atb + rho * (z - u))
        z = soft(x + u, mu / rho)
        u = u + x - z
        r_pri = np.linalg.norm(x - z)
        r_dual = rho * np.linalg.norm(z - z_old) if k else 0.0
        z_old = z.copy()
        if r_pri < tol and r_dual < tol:
            break
    return x, k`},

    { t: 'p', html: '收敛性方面：只要 <code>f</code>、<code>g</code> 是闭正常凸函数、增广拉格朗日有鞍点，ADMM 对<b>任意</b> <code>ρ &gt; 0</code> 都收敛（原始残差与对偶残差趋于零）。一般速率是 <code>O(1/k)</code>；<code>f</code>、<code>g</code> 强凸时可线性收敛。它有「先慢后快」的典型曲线：前期残差下降明显，后期变慢——因为它本质上是交替方向，不是牛顿型方法。' },

    { t: 'p', html: '<code>ρ</code> 的选择直接影响实际速度。<code>ρ</code> 太大，<code>z</code> 更新过度惩罚、<code>x</code> 更新几乎不动；<code>ρ</code> 太小，可行性恢复慢。<b>自适应</b>策略很常用：每隔若干步比较原始残差与对偶残差，若 <code>r<sub>pri</sub> &gt; 10r<sub>dual</sub></code> 就把 <code>ρ</code> 翻倍（并相应缩放 <code>u</code>），反之减半。几行代码，速度常常翻几倍。' },

    { t: 'compare', title: 'ADMM vs 内点法', left: { head: 'ADMM', items: [
      '每步只做「解一个简单子问题」，无需二阶信息',
      '可分解、可分块、适合分布式与大数据',
      '收敛慢（<code>O(1/k)</code>），精度一般到 <code>10<sup>−6</sup></code> 就够用',
      '对非光滑项友好（近端算子即可）'
    ] }, right: { head: '内点法', items: [
      '每步解 KKT 系统，需要二阶信息与稀疏分解',
      '集中式，难以按数据分块',
      '30–60 步到极高精度（<code>10<sup>−10</sup></code>）',
      '要求目标与约束光滑（非光滑需先改造）'
    ] } },

    { t: 'p', html: '近端梯度是这条路线上的另一个成员：<code>x<sup>k+1</sup> = prox<sub>t g</sub>(x<sup>k</sup> − t∇f(x<sup>k</sup>))</code>，其中 <code>prox<sub>t g</sub>(v) = argmin<sub>z</sub> g(z) + (1/2t)||z − v||<sup>2</sup></code>。当 <code>g = μ||·||<sub>1</sub></code> 时，近端算子就是软阈值 <code>S<sub>μt</sub></code>。加上 Nesterov 加速（FISTA），速率从 <code>O(1/k)</code> 提到 <code>O(1/k<sup>2</sup>)</code>。它比 ADMM 简单、比次梯度法快，是 Lasso 类问题的第一选择。' },

    { t: 'h', lvl: 2, text: '八、收敛判据与实现', id: 'ch07-8' },

    { t: 'p', html: '约束问题的「收敛」比无约束更微妙：目标值不再单调下降，原始可行性与对偶可行性可能此消彼长。所以停止判据必须同时看<b>三件事</b>：原始残差（离可行域多远）、对偶残差（KKT 平稳性差多少）、对偶间隙（离最优值多远）。三者都小，才算真的收敛。' },

    { t: 'table', caption: '三类停止判据', head: ['判据', '表达式', '含义'], rows: [
      ['原始残差', '<code>||(f<sub>i</sub>(x))<sup>+</sup>||, ||Ax − b||</code>', '可行性的违反程度'],
      ['对偶残差', '<code>||∇f<sub>0</sub> + Σλ<sub>i</sub>∇f<sub>i</sub> + A<sup>T</sup>ν||</code>', '平稳性差多少'],
      ['对偶间隙', '<code>f<sub>0</sub>(x) − g(λ, ν)</code>', '离最优值多远（有绝对意义）']
    ] },

    { t: 'p', html: '工程上还要做<b>相对化</b>：原始残差除以 <code>1 + ||b||</code> 或 <code>1 + ||x||</code>，对偶残差除以 <code>1 + ||∇f<sub>0</sub>||</code> 或 <code>1 + |f<sub>0</sub>|</code>。否则量纲一变，同一个阈值就失效了。另外要设<b>不可行检测</b>：若残差长时间不降且步长趋零，问题可能本身不可行或无界，应报出明确的状态而不是「达到最大迭代次数」。' },

    { t: 'p', html: '数值细节上有三个高频坑。<b>① 尺度</b>：约束的系数差几个数量级时，先做对角缩放（<code>x = Dz</code>），否则内点法的 KKT 矩阵条件数会很差。<b>② 稀疏性</b>：KKT 矩阵要按稀疏格式组装，用 AMD/COLAMD 排序减少填入，<code>n = 10<sup>5</sup></code> 时这是能否在内存里跑起来的分界线。<b>③ 精度极限</b>：内点法在 <code>10<sup>−10</sup></code> 附近会遇到浮点极限，再往下调阈值只会让迭代数爆炸——想要更高精度应换有理数/精确算术，而不是继续压 <code>ε</code>。' },

    { t: 'steps', items: [
      { title: '① 先判断问题类型', html: '光滑凸（LP/QP/SOCP/SDP）→ 内点法或现成求解器；带非光滑正则 → ADMM 或近端梯度；需要反复热启动 → 单纯形/有效集。' },
      { title: '② 缩放与预处理', html: '把变量与约束缩放到同一量级，检查是否有固定变量、冗余约束，能化简的先化简。' },
      { title: '③ 设三个残差阈值', html: '用相对形式，<code>ε<sub>pri</sub> = ε<sub>dual</sub> = 10<sup>−6</sup></code> 是常见起点，高精度需求再收紧。' },
      { title: '④ 跑通再谈速度', html: '先确保收敛、残差可解释；再比较不同算法与参数，别在没有基线的情况下调参。' }
    ] },

    { t: 'terms', items: [
      { en: 'KKT system', zh: 'KKT 系统', html: '平稳性、可行性、互补松弛组成的方程组，牛顿法在每步解它的线性化。' },
      { en: 'quadratic penalty', zh: '二次罚函数', html: '把约束违反量的平方加进目标，需 <code>ρ→∞</code> 才精确。' },
      { en: 'augmented Lagrangian', zh: '增广拉格朗日', html: '拉格朗日函数加罚项，交替更新 <code>x</code> 与乘子，有限 <code>ρ</code> 即精确。' },
      { en: 'log barrier', zh: '对数障碍', html: '<code>−Σlog(−f<sub>i</sub>)</code>，把迭代挡在严格可行域内部。' },
      { en: 'central path', zh: '中心路径', html: '<code>x*(t)</code> 的轨迹，满足 <code>λ<sub>i</sub>(−f<sub>i</sub>) = 1/t</code>，间隙 <code>m/t</code>。' },
      { en: 'primal-dual IPM', zh: '原始-对偶内点法', html: '同时对 <code>x, λ, ν</code> 做牛顿法，<code>O(√m log(1/ε))</code> 步收敛。' },
      { en: 'simplex method', zh: '单纯形法', html: '沿可行多面体顶点移动，输出基，便于灵敏度分析与热启动。' },
      { en: 'ADMM', zh: '交替方向乘子法', html: '对增广拉格朗日交替最小化，可分解，适合大规模与非光滑问题。' }
    ] },

    { t: 'keypoint', items: [
      { title: '等式约束的牛顿步解 KKT 系统', html: '分块矩阵对称不定，用 LDL<sup>T</sup>；不可行起点版本同时恢复可行性。' },
      { title: '罚函数与增广拉格朗日的差别在乘子', html: '罚参数只影响速度，乘子承担精度，因此 <code>ρ</code> 不必趋于无穷。' },
      { title: '障碍把约束变成「软化互补松弛」', html: '<code>λ<sub>i</sub>(−f<sub>i</sub>) = 1/t</code>；间隙 <code>m/t</code> 给出可计算的上界。' },
      { title: '中心路径自带证书', html: '路径上任意一点都满足 <code>f<sub>0</sub>(x) − p* ≤ m/t</code>，可用于可靠停机。' },
      { title: '内点法复杂度是 <code>√m</code>', html: '代理间隙每步按 <code>1 − c/√m</code> 缩小；步长受限因为要保持 <code>λ, s &gt; 0</code>。' },
      { title: '单纯形与内点法互补', html: '要基与热启动选单纯形，大规模稀疏单次求解选内点法。' },
      { title: 'ADMM 用可分解换收敛速度', html: '任意 <code>ρ &gt; 0</code> 收敛、<code>O(1/k)</code>；调 <code>ρ</code> 与残差平衡是主要工程手段。' }
    ] },

    { t: 'checklist', id: 'ch07', items: [
      '我能写出等式约束问题的 KKT 矩阵，并说明它为什么不定',
      '我能解释不可行起点牛顿法如何同时处理下降与可行性',
      '我能说明二次罚函数为什么需要 <code>ρ→∞</code>，以及它为什么病态',
      '我能写出增广拉格朗日的两步更新，并解释乘子的作用',
      '我能推导对数障碍问题的解与间隙 <code>m/t</code>',
      '我能陈述中心路径满足的四个方程，并解释互补松弛如何被软化',
      '我能描述原始-对偶内点法一步迭代，并说明 <code>√m</code> 复杂度来源',
      '我能比较单纯形法与内点法的适用场景',
      '我能写出 ADMM 的三步更新，并说明 <code>ρ</code> 如何自适应',
      '我能为约束问题设计原始/对偶残差与间隙三类停止判据'
    ] },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章依据 MAT3007 教材第 7 章「等式约束最小化与内点法」组织：等式约束牛顿步与 KKT 系统、有效集思想、二次罚函数与增广拉格朗日、对数障碍与中心路径、原始-对偶内点法与 Mehrotra 预测-校正、单纯形法的复杂度与适用场景、ADMM 与近端梯度、三类收敛判据与数值实现要点。间隙公式采用 <code>m/t</code>（<code>m</code> 为不等式约束个数），内点法复杂度按短步版本陈述。ADMM 的 <code>O(1/k)</code> 速率不依赖强凸假设，强凸时可达线性收敛。考核范围以当学期 syllabus 与作业为准。' }
  ]
});
