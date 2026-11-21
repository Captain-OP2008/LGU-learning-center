/* =====================================================================
 * ch03.js · 第 3 章「凸函数：目标函数的形状」
 * 职责：给出凸函数的定义、一阶与二阶判据，列出常见凸函数与保凸运算，
 *       介绍共轭函数、拟凸函数与强凸性，并说明凸性如何决定算法收敛速度。
 * 依据：MAT3007 教材第 3 章（凸函数、共轭函数、强凸性）。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch03',
  num: '03',
  title: '凸函数：目标函数的形状',
  en: 'CONVEX FUNCTIONS',
  goals: [
    '用定义、一阶条件、二阶条件三种方式判定一个函数是否凸，并能对具体函数给出证明',
    '认出仿射、指数、幂、范数、逐点最大、log-sum-exp、二次型这七类常见凸函数',
    '用非负加权和、复合、逐点最大、部分最小化四条规则判断复合函数的凸性',
    '写出共轭函数的定义并手算二次函数与指数函数的共轭',
    '区分凸、严格凸、强凸三档强度，并说明条件数如何决定梯度下降的收敛速度'
  ],
  kp: [
    { id: 'ch03-1', title: '凸函数的定义' },
    { id: 'ch03-2', title: '一阶与二阶条件' },
    { id: 'ch03-3', title: '常见凸函数家族' },
    { id: 'ch03-4', title: '保凸运算' },
    { id: 'ch03-5', title: '共轭函数' },
    { id: 'ch03-6', title: '拟凸函数与下水平集' },
    { id: 'ch03-7', title: '强凸性与条件数' },
    { id: 'ch03-8', title: '凸性如何决定算法' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '从「形状」到「碗」', html: '第 2 章只看可行域的形状，这一章看目标函数的形状。一个函数凸，意味着它的图像像一只朝上的碗：弦在图像之上，切平面在图像之下，任意局部最低点就是全局最低点。这三句话分别对应定义、一阶条件、二阶条件，也是后面所有算法保证收敛的依据。反过来，只要目标函数不是碗形，梯度下降就可能卡在某个「坑」里出不来——而且它不会告诉你自己卡住了。' },

    { t: 'p', lead: true, html: '设 <code>f: R<sup>n</sup> → R</code> 的定义域 <code>dom f</code> 是凸集。若对任意 <code>x, y ∈ dom f</code> 与 <code>θ ∈ [0,1]</code>，都有 <code>f(θx + (1−θ)y) ≤ θf(x) + (1−θ)f(y)</code>，则称 <code>f</code> 为<b>凸函数</b>（convex function）。几何上：<b>图像上任意两点连成的弦，始终位于函数图像的上方</b>。等号恒成立时是仿射函数，这是凸函数与凹函数的分界。' },

    { t: 'h', lvl: 2, text: '一、凸函数的定义', id: 'ch03-1' },

    { t: 'p', html: '定义里有两个前提容易被忽略。<b>第一，定义域必须是凸集</b>：若 <code>dom f</code> 本身不凸，两点之间的线段可能落在定义域外，不等式根本没法写。<b>第二，比较的是函数值，不是梯度</b>：凸性是一个整体性质，不是某点附近的局部性质。这也是为什么「看起来像碗」不足以判断凸性——你必须证明所有方向、所有距离上的弦都在图像上方。' },

    { t: 'p', html: '有两种等价的改写方式，做题时按方便挑一个。<b>一种是 epigraph（上图）</b>：<code>epi f = {(x, t) | f(x) ≤ t}</code>。<code>f</code> 凸 ⟺ <code>epi f</code> 是凸集。这直接把函数问题转成集合问题，第 2 章的工具立刻可用。<b>另一种是 Jensen 不等式</b>：<code>f(Σθ<sub>i</sub>x<sub>i</sub>) ≤ Σθ<sub>i</sub>f(x<sub>i</sub>)</code> 对任意凸组合成立。定义只要求两点，但 Jensen 说明它可以推广到任意有限个点。' },

    { t: 'p', html: '凹函数（concave）就是把不等号反过来：<code>f</code> 凹 ⟺ <code>−f</code> 凸。这门课大量出现「最大化凹函数」，它等价于「最小化凸函数」，所以不需要单独一套理论。一个常见的混淆是<b>凸函数不一定单调</b>：<code>x<sup>2</sup></code> 先降后升，仍然是凸的；单调性和凸性是两个独立的性质。' },

    { t: 'p', html: '再强调一次定义域的重要性。函数 <code>f(x) = log x</code> 的定义域是 <code>x &gt; 0</code>，它在那里是凹的；若把它延拓到 <code>x ≤ 0</code> 就无定义，谈不上凸凹。函数 <code>f(x) = 1/x</code> 在 <code>x &gt; 0</code> 上凸，在 <code>x &lt; 0</code> 上也凸，但在整个 <code>x ≠ 0</code> 上不是凸函数——因为定义域被 0 切成两段，不凸。很多「反例」其实都是定义域没选对。' },

    { t: 'compare', left: { title: '凸：弦在上方', html: '<code>f(θx+(1−θ)y) ≤ θf(x)+(1−θ)f(y)</code>。图像向下凸出（像一个碗），任意两点的连线不低于图像。例：<code>x<sup>2</sup></code>、<code>e<sup>x</sup></code>、<code>|x|</code>。' }, right: { title: '凹：弦在下方', html: '<code>f(θx+(1−θ)y) ≥ θf(x)+(1−θ)f(y)</code>。图像向上凸出（像一个盖），任意两点的连线不高于图像。例：<code>log x</code>、<code>√x</code>、<code>−x<sup>2</sup></code>。' } },

    { t: 'callout', kind: 'tip', title: '一个不严谨但好用的直觉', html: '把函数图像想成地形，凸函数就是「一个坑」：无论你从哪出发往下走，最后都到同一个最低点。若地形有多个坑（非凸），梯度下降停在哪个坑取决于初值。这个直觉不能代替证明，但能帮你在建模时快速判断「这个问题会不会有局部最优陷阱」。' },

    { t: 'h', lvl: 2, text: '二、一阶与二阶条件', id: 'ch03-2' },

    { t: 'p', html: '若 <code>f</code> 可微，凸性有一个只用梯度就能表达的等价条件，叫<b>一阶条件</b>：对任意 <code>x, y ∈ dom f</code>，<code>f(y) ≥ f(x) + ∇f(x)<sup>T</sup>(y − x)</code>。右边是 <code>f</code> 在 <code>x</code> 处的切平面。<b>凸函数的切平面是全局下界</b>，不只在 <code>x</code> 附近有效。这条性质是凸优化里几乎所有最优性条件的来源：若 <code>∇f(x) = 0</code>，则 <code>f(y) ≥ f(x)</code> 对一切 <code>y</code> 成立，<code>x</code> 就是全局最优。' },

    { t: 'p', html: '拿 <code>f(x) = x<sup>2</sup></code> 在 <code>x = 1</code> 处验算：<code>f(1) = 1</code>，<code>f′(1) = 2</code>，切平面是 <code>g(y) = 1 + 2(y − 1) = 2y − 1</code>。取 <code>y = 3</code>，<code>g(3) = 5</code>，而 <code>f(3) = 9 ≥ 5</code>，切平面确实在下方。取 <code>y = 0</code>，<code>g(0) = −1</code>，<code>f(0) = 0 ≥ −1</code>，仍然成立。距离越远，切平面与函数值的差越大——这个差正是「凸性带来的盈余」。' },

    { t: 'p', html: '若 <code>f</code> 二阶可微，还有<b>二阶条件</b>：<code>∇<sup>2</sup>f(x) ⪰ 0</code> 对定义域内每个 <code>x</code> 成立。一维时就是 <code>f″(x) ≥ 0</code>。这是实际做题最常用的判据，因为它把「验证所有弦」变成了「算一个矩阵是否半正定」。注意条件是「处处成立」，只在一点成立不够：<code>f(x) = x<sup>3</sup></code> 在 <code>x = 0</code> 处二阶导为 0，但它不是凸函数（<code>x &lt; 0</code> 时二阶导为负）。' },

    { t: 'table', caption: '三种判据的适用场景', head: ['判据', '形式', '什么时候用'], rows: [
      ['定义', '<code>f(θx+(1−θ)y) ≤ θf(x)+(1−θ)f(y)</code>', '函数不可微，或要证一个抽象结论'],
      ['一阶条件', '<code>f(y) ≥ f(x) + ∇f(x)<sup>T</sup>(y−x)</code>', '可微，且想推出最优性条件'],
      ['二阶条件', '<code>∇<sup>2</sup>f(x) ⪰ 0</code> 处处成立', '二阶可微，最常见；算 Hessian 判半正定'],
      ['上图', '<code>epi f</code> 是凸集', '需要借用凸集工具，或证分段函数']
    ] },

    { t: 'p', html: 'Hessian 半正定的判定有几个实用技巧。<b>对角占优</b>：若矩阵对称且每行对角元不小于该行其余元素绝对值之和，则半正定——这是充分条件，不是必要条件。<b>主子式</b>：所有顺序主子式非负（半正定时是「所有主子式」，不只是顺序的）。<b>特征值</b>：数值计算最稳，但手算时 <code>2×2</code> 用迹与行列式更快：<code>tr ≥ 0</code> 且 <code>det ≥ 0</code> 就是半正定。' },

    { t: 'p', html: '举个两维例子：<code>f(x) = log(e<sup>x<sub>1</sub></sup> + e<sup>x<sub>2</sub></sup>)</code>。在 <code>x = (0,0)</code> 处，<code>f = log 2</code>，梯度是 <code>(1/2, 1/2)</code>，Hessian 是 <code>¼[[1, −1], [−1, 1]]</code>。它的迹是 <code>1/2 ≥ 0</code>，行列式是 0，特征值为 <code>0</code> 与 <code>1/2</code>，半正定。所以这个函数在原点附近是凸的；事实上它在整个 <code>R<sup>2</sup></code> 上都凸，这就是下一节要讲的 log-sum-exp。' },

    { t: 'quiz', qid: 'ch03-q1' },

    { t: 'h', lvl: 2, text: '三、常见凸函数家族', id: 'ch03-3' },

    { t: 'p', html: '和凸集一样，凸函数也只有有限的几个「原型」。把它们记住，建模时就能直接判断「我这个目标是不是凸的」，而不必每次从定义出发。' },

    { t: 'table', caption: '七类常见凸函数', head: ['函数', '定义域', '为什么凸', '典型用途'], rows: [
      ['仿射 <code>a<sup>T</sup>x + b</code>', '整个 <code>R<sup>n</sup></code>', '等号恒成立，既凸又凹', '线性目标、线性约束'],
      ['指数 <code>e<sup>ax</sup></code>', '整个 <code>R</code>', '二阶导 <code>a<sup>2</sup>e<sup>ax</sup> ≥ 0</code>', '增长模型、logistic 回归的损失'],
      ['幂 <code>x<sup>p</sup></code>', '<code>x &gt; 0</code>；<code>p ≥ 1</code> 或 <code>p ≤ 0</code>', '二阶导 <code>p(p−1)x<sup>p−2</sup> ≥ 0</code>', '范数、距离、能量'],
      ['绝对值 / 范数 <code>‖x‖</code>', '整个 <code>R<sup>n</sup></code>', '三角不等式 + 齐次性', '稀疏正则、鲁棒损失'],
      ['逐点最大 <code>max<sub>i</sub> f<sub>i</sub></code>', '交集', '逐点最大保持凸性', '最坏情况、Chebyshev 拟合'],
      ['log-sum-exp', '整个 <code>R<sup>n</sup></code>', 'Hessian 半正定，且是 max 的光滑近似', 'softmax、分类损失'],
      ['二次型 <code>½x<sup>T</sup>Px + q<sup>T</sup>x</code>', '整个 <code>R<sup>n</sup></code>，要求 <code>P ⪰ 0</code>', 'Hessian 就是 <code>P</code>', '最小二乘、投资组合、SVM']
    ] },

    { t: 'p', html: '表里有两处细节值得展开。<b>幂函数 <code>x<sup>p</sup></code> 的凸性依赖 <code>p</code></b>：<code>p ≥ 1</code> 或 <code>p ≤ 0</code> 时凸，<code>0 &lt; p &lt; 1</code> 时凹（<code>√x</code> 是凹的，很多人第一次会记反）。<b>二次型的凸性完全由 <code>P</code> 决定</b>：<code>P ⪰ 0</code> 凸，<code>P ⪯ 0</code> 凹，<code>P</code> 不定则两者都不是，是一个鞍形。' },

    { t: 'p', html: '<b>log-sum-exp</b> 值得单独记住，因为它有双重身份。它本身是凸函数，同时又满足 <code>max<sub>i</sub> x<sub>i</sub> ≤ log Σ e<sup>x<sub>i</sub></sup> ≤ max<sub>i</sub> x<sub>i</sub> + log n</code>，即它是最大值函数的平滑近似，误差不超过 <code>log n</code>。这个不等式让「<code>max</code> 不可微」的问题可以用「log-sum-exp 光滑化」来解，是机器学习与鲁棒优化里的常用技巧。' },

    { t: 'p', html: '还有两个「凹函数」原型经常出现：<b>几何平均</b> <code>(Π x<sub>i</sub>)<sup>1/n</sup></code> 在 <code>x &gt; 0</code> 上凹；<b><code>log det X</code></b> 在正定矩阵锥 <code>S<sup>n</sup><sub>++</sub></code> 上凹。前者出现在 Cobb–Douglas 效用函数里，后者出现在最大熵与最优实验设计里。它们都是「最大化」的对象，转成极小化时要取负号，取负之后就变成凸函数。' },

    { t: 'callout', kind: 'warn', title: '两个凸函数相减不一定凸', html: '<code>f − g</code>（两个凸函数之差）没有任何保证，它可能凸、可能凹、可能两者都不是。典型例子：<code>x<sup>2</sup> − x<sup>4</sup></code> 在 <code>|x| &lt; 1/√6</code> 内凸、外面凹。所以「把惩罚项从目标里减掉」这种操作要格外小心，先化成「加上一个凹函数」再判断。' },

    { t: 'h', lvl: 2, text: '四、保凸运算', id: 'ch03-4' },

    { t: 'p', html: '和第 2 章的保凸运算对应，函数也有四条造新凸函数的规则。这四条规则构成了 CVXPY 那套「disciplined convex programming」语法的理论内核：只要你的表达式是用这些规则搭起来的，凸性自动成立。' },

    { t: 'table', caption: '四条保凸运算', head: ['运算', '条件', '例子'], rows: [
      ['非负加权和', '<code>w<sub>i</sub> ≥ 0</code>，<code>f<sub>i</sub></code> 凸', '<code>3x<sup>2</sup> + 2e<sup>x</sup></code> 凸'],
      ['复合（外层增）', '<code>f</code> 凸且不减，<code>g</code> 凸', '<code>e<sup>x<sup>2</sup></sup></code> 凸；<code>max(0, g)</code> 凸'],
      ['逐点最大 / 上确界', '每个 <code>f<sub>i</sub></code> 凸', '<code>max(x, 0)</code>、<code>‖x‖<sub>∞</sub></code> 凸'],
      ['部分最小化', '<code>f(x, y)</code> 在 <code>(x, y)</code> 上凸，<code>y</code> 的定义域凸', '<code>inf<sub>y</sub> f(x, y)</code> 凸']
    ] },

    { t: 'p', html: '复合规则要小心方向。<b>外层凸且单调增</b>时，内层凸 → 复合凸；若外层凸但单调减，内层必须凹才能保证复合凸（因为 <code>f</code> 减、<code>g</code> 凹，两层翻转抵消）。举个反例：<code>f(u) = u<sup>2</sup></code>（凸）、<code>g(x) = −x<sup>2</sup></code>（凹），复合 <code>f(g(x)) = x<sup>4</sup></code> 恰好是凸的——这是碰巧，不是规则保证。换一个 <code>g(x) = −e<sup>x</sup></code>（凹），复合 <code>e<sup>2x</sup></code> 也凸。规则能保证的情形和碰巧的情形要分清。' },

    { t: 'p', html: '<b>逐点最大</b>是建模里最有用的一条。它让「最坏情况」可以直接写进目标：<code>min max<sub>i</sub> |a<sub>i</sub><sup>T</sup>x − b<sub>i</sub>|</code> 是 Chebyshev 拟合，凸的；<code>min max<sub>i</sub> f<sub>i</sub>(x)</code> 只要每个 <code>f<sub>i</sub></code> 凸就凸。代价是不可微——最大值点处有折角，梯度不存在。这就是为什么实际代码里常用 log-sum-exp 或平方来光滑化。' },

    { t: 'p', html: '<b>部分最小化</b>是另一条隐藏的主力。<code>g(x) = inf<sub>y</sub> f(x, y)</code> 在 <code>f</code> 联合凸时仍然凸。它的意义是：优化掉一部分变量不会破坏凸性。这解释了为什么「先消去等式约束再优化」是安全的操作——消元本质就是部分最小化（把被消去的变量取到最优）。第 5 章的对偶函数也是这个套路：<code>g(λ) = inf<sub>x</sub> L(x, λ)</code> 一定是凹的。' },

    { t: 'quiz', qid: 'ch03-q2' },

    { t: 'h', lvl: 2, text: '五、共轭函数', id: 'ch03-5' },

    { t: 'p', html: '凸函数 <code>f</code> 的<b>共轭函数</b>（conjugate function）定义为 <code>f*(y) = sup<sub>x ∈ dom f</sub> (y<sup>T</sup>x − f(x))</code>。<code>y</code> 可以取任意向量，结果允许是 <code>+∞</code>。几何上，<code>y<sup>T</sup>x − f(x)</code> 是斜率为 <code>y</code> 的直线与函数图像之间的「垂直距离」，取上确界就是找一条斜率为 <code>y</code> 的直线，使它尽量贴着图像的下方。' },

    { t: 'p', html: '共轭函数有两个立刻能用的性质。<b>第一，它永远凸</b>：对每个固定的 <code>x</code>，<code>y<sup>T</sup>x − f(x)</code> 是 <code>y</code> 的仿射函数；一族仿射函数的上确界必然凸，与 <code>f</code> 本身凸不凸无关。这一点很反直觉：即使 <code>f</code> 非凸，它的共轭也是凸的。<b>第二，Fenchel 不等式</b>：<code>f(x) + f*(y) ≥ x<sup>T</sup>y</code>，对任意 <code>x, y</code> 成立，等号当且仅当 <code>y</code> 是 <code>f</code> 在 <code>x</code> 处的次梯度。' },

    { t: 'p', html: '手算两个例子。<b>二次函数</b>：<code>f(x) = ½x<sup>T</sup>Qx</code>（<code>Q ≻ 0</code>）。对 <code>y<sup>T</sup>x − ½x<sup>T</sup>Qx</code> 求导令零，得 <code>x = Q<sup>−1</sup>y</code>，代回得 <code>f*(y) = ½y<sup>T</sup>Q<sup>−1</sup>y</code>。共轭把 <code>Q</code> 换成了 <code>Q<sup>−1</sup></code>，这是一条漂亮的对称性。<b>绝对值</b>：<code>f(x) = |x|</code>，则 <code>f*(y) = 0</code> 当 <code>|y| ≤ 1</code>，否则 <code>+∞</code>——共轭变成了「区间 <code>[−1,1]</code> 的指示函数」。指示函数的共轭又回到支撑函数，两者互为对偶。' },

    { t: 'table', caption: '三对常用共轭', head: ['<code>f(x)</code>', '<code>f*(y)</code>', '备注'], rows: [
      ['<code>½x<sup>T</sup>Qx</code>，<code>Q ≻ 0</code>', '<code>½y<sup>T</sup>Q<sup>−1</sup>y</code>', '二次共轭把矩阵求逆'],
      ['<code>e<sup>x</sup></code>', '<code>y ln y − y</code>（<code>y &gt; 0</code>），否则 <code>+∞</code>', '指数与熵互为共轭'],
      ['<code>|x|</code>', '<code>0</code> 若 <code>|y| ≤ 1</code>，否则 <code>+∞</code>', '范数的共轭是单位球指示函数']
    ] },

    { t: 'p', html: '为什么现在讲共轭？因为它是第 5 章对偶理论的代数骨架。对偶问题 <code>max g(λ, ν)</code> 里的 <code>g</code> 就是拉格朗日函数的部分最小化，而它可以用共轭写成闭式；对偶间隙为零的条件也能用共轭解释为「<code>x</code> 与 <code>y</code> 满足 Fenchel 等号」。在机器学习里，共轭还出现在「正则化项的对偶范数」这一说法中：<code>‖w‖<sub>1</sub></code> 的对偶是 <code>‖·‖<sub>∞</sub></code>，所以 L1 正则对应无穷范数约束。' },

    { t: 'callout', kind: 'exam', title: '手算共轭的三步', html: '① 写出 <code>h(x) = y<sup>T</sup>x − f(x)</code>；② 对 <code>x</code> 求导令零（或直接配方），得到最优 <code>x*(y)</code>；③ 代回 <code>h</code> 得 <code>f*(y)</code>，并注明 <code>y</code> 的有效范围（哪里取 <code>+∞</code>）。若 <code>f</code> 不可微，用次梯度 <code>y ∈ ∂f(x)</code> 代替求导。' },

    { t: 'h', lvl: 2, text: '六、拟凸函数与下水平集', id: 'ch03-6' },

    { t: 'p', html: '比凸更弱的性质是<b>拟凸</b>（quasiconvex）：对任意 <code>α</code>，下水平集 <code>{x | f(x) ≤ α}</code> 都是凸集。等价说法是 <code>f(θx+(1−θ)y) ≤ max(f(x), f(y))</code>。每个凸函数都拟凸（因为 <code>f ≤ α</code> 与凸集的交仍是凸集），但反过来不成立。<code>f(x) = √|x|</code> 是拟凸的（下水平集是区间），却不是凸函数；任何单调函数都拟凸。' },

    { t: 'p', html: '拟凸性为什么重要？因为「可行域凸 + 目标拟凸」时，任何局部最优仍是全局最优——这个结论比凸函数弱，但覆盖面更广。<b>下水平集凸</b>是证明拟凸最方便的方式：直接看 <code>{x | f(x) ≤ α}</code> 是什么形状，比验证不等式容易得多。工程上许多「单峰」的目标函数都属于这一类。' },

    { t: 'p', html: '用二分法解拟凸问题是最经典的用法：要找最小的 <code>α</code> 使下水平集非空，就在 <code>α</code> 上做二分，每次解一个凸可行性问题 <code>f(x) ≤ α</code>。因为每个下水平集都凸，可行性判断是凸的；二分只需要 <code>log((α<sub>max</sub> − α<sub>min</sub>)/ε)</code> 步。这是「把非凸问题拆成一串凸问题」的典型套路，第 7 章的序列凸规划也是同一思路。' },

    { t: 'compare', left: { title: '凸 ⇒ 拟凸', html: '凸函数的下水平集是凸集，所以必然拟凸。反之不成立：<code>√|x|</code> 拟凸但非凸。凸是更强的条件，能用的结论也更多（例如对偶间隙为零）。' }, right: { title: '拟凸 ⇏ 凸', html: '拟凸只保证「局部最优 = 全局最优」，不保证对偶间隙为零，也不保证梯度下降收敛到最优。所以建模时若只能证到拟凸，要额外检查算法。' } },

    { t: 'h', lvl: 2, text: '七、强凸性与条件数', id: 'ch03-7' },

    { t: 'p', html: '凸函数分三档强度。<b>凸</b>：弦在图像上方。<b>严格凸</b>：弦严格在图像上方（除非 <code>x = y</code>），保证最优解唯一。<b>强凸</b>：存在 <code>m &gt; 0</code> 使 <code>f(x) − (m/2)‖x‖<sup>2</sup></code> 仍凸，等价于 <code>f(y) ≥ f(x) + ∇f(x)<sup>T</sup>(y−x) + (m/2)‖y−x‖<sup>2</sup></code>。强凸意味着函数「至少像一只开口固定的碗」，不会越走越平。' },

    { t: 'p', html: '强凸性的另一半是光滑性（smoothness）：存在 <code>L &gt; 0</code> 使 <code>∇<sup>2</sup>f(x) ⪯ LI</code>，等价于梯度是 <code>L</code>-Lipschitz 的。两个常数一起定义了<b>条件数</b> <code>κ = L/m</code>。<code>κ</code> 接近 1 时等高线接近圆形，梯度方向几乎直指最优；<code>κ</code> 很大时等高线是细长的椭圆，梯度方向几乎垂直于最优方向，走一步就来回震荡。' },

    { t: 'table', caption: '三档凸性强度对比', head: ['性质', '定义', '保证什么', '不保证什么'], rows: [
      ['凸', '弦在图像上方', '局部最优即全局最优', '最优解唯一；收敛速度'],
      ['严格凸', '弦严格在上方（<code>x ≠ y</code>）', '最优解唯一', '收敛速度；对噪声稳定'],
      ['强凸', '<code>f − (m/2)‖x‖<sup>2</sup></code> 凸，<code>m &gt; 0</code>', '最优解唯一 + 线性收敛速度', '条件数小；<code>κ</code> 可能很大'],
      ['强凸 + 光滑', '<code>mI ⪯ ∇<sup>2</sup>f ⪯ LI</code>', '<code>κ = L/m</code> 可控时收敛快', '非二次函数上的精确速率']
    ] },

    { t: 'p', html: '条件数的威力可以算出来。对 <code>m</code>-强凸、<code>L</code>-光滑的函数，梯度下降取步长 <code>1/L</code> 时满足 <code>f(x<sub>k</sub>) − f* ≤ (1 − 1/κ)<sup>k</sup>(f(x<sub>0</sub>) − f*)</code>。若 <code>κ = 100</code>，每步只缩小 1%，要 460 步才能把误差降到 <code>e<sup>−1</sup></code>；若 <code>κ = 10<sup>4</sup></code>，需要 4.6 万步。这就是为什么「特征缩放」和「预条件」在实践里如此重要——它们本质上是在降低 <code>κ</code>。' },

    { t: 'p', html: '一个具体例子：<code>f(x) = ½(x<sub>1</sub><sup>2</sup> + 100x<sub>2</sub><sup>2</sup>)</code>。<code>m = 1</code>、<code>L = 100</code>、<code>κ = 100</code>。梯度是 <code>(x<sub>1</sub>, 100x<sub>2</sub>)</code>，在 <code>(1, 1)</code> 处梯度为 <code>(1, 100)</code>，方向几乎沿着 <code>x<sub>2</sub></code> 轴，而最优点在原点。于是梯度下降会先沿 <code>x<sub>2</sub></code> 方向大幅震荡，再缓慢地沿 <code>x<sub>1</sub></code> 收敛——这就是「病态」的直观画面。' },

    { t: 'p', html: '牛顿法之所以对条件数不敏感，是因为它用 <code>∇<sup>2</sup>f</code> 做预条件，把细长的椭圆「拉圆」。代价是每步要解一个线性方程组（<code>O(n<sup>3</sup>)</code>）并计算 Hessian。第 6 章会把梯度下降、牛顿法、拟牛顿法放在一起，用 <code>κ</code> 统一解释它们的差别。' },

    { t: 'quiz', qid: 'ch03-q3' },

    { t: 'h', lvl: 2, text: '八、凸性如何决定算法', id: 'ch03-8' },

    { t: 'p', html: '把这一章的三条结论串起来，就得到整门课的算法逻辑链。<b>凸性 ⇒ 局部最优即全局最优</b>，所以算法只要保证「每步不上升」并停下来，停下来的点就是答案。<b>一阶条件 ⇒ 梯度为零即最优</b>，所以无约束问题的最优性判据只有一行。<b>强凸 + 光滑 ⇒ 收敛速度由 <code>κ</code> 决定</b>，所以我们可以预估迭代次数，而不是盲目地跑到收敛。' },

    { t: 'p', html: '反过来，这三条也划出了算法的边界。目标非凸时，梯度为零只是驻点，可能是局部极小、局部极大或鞍点；可行域非凸时，KKT 点可能不是最优；只有凸没有强凸时，收敛可能是次线性的（<code>O(1/k)</code> 而不是 <code>O((1−1/κ)<sup>k</sup>)</code>）。知道这些边界，才知道什么时候该换算法、什么时候该改模型。' },

    { t: 'code', lang: 'python', caption: '用数值检查一个函数的凸性与条件数', code: `import numpy as np

def f(x):
    return 0.5 * (x[0]**2 + 100 * x[1]**2)

def grad(x):
    return np.array([x[0], 100 * x[1]])

def hess(_):
    return np.diag([1.0, 100.0])

# 1) 一阶条件抽查：随机取点，检查 f(y) >= f(x) + g(x)·(y-x)
rng = np.random.default_rng(1)
ok = True
for _ in range(1000):
    x, y = rng.normal(size=(2, 2))
    if f(y) < f(x) + grad(x) @ (y - x) - 1e-12:
        ok = False
        break
print("一阶条件成立:", ok)

# 2) 条件数：Hessian 最大与最小特征值之比
w = np.linalg.eigvalsh(hess(np.zeros(2)))
print("条件数 kappa =", w.max() / w.min())   # 100.0` },

    { t: 'p', html: '这段代码做了两件事：用随机采样抽查一阶条件（只能证伪，不能证明），以及从 Hessian 的特征值算出条件数。把 <code>f</code> 换成你正在建模的目标函数，就能快速判断「它大概有多凸、会不会病态」。注意第一条的容差 <code>1e-12</code>：浮点误差会让严格不等式偶尔失败，检查凸性时要留一点余量。' },

    { t: 'terms', items: [
      { en: 'convex function', zh: '凸函数', html: '弦始终位于图像上方的函数；等价于上图为凸集。' },
      { en: 'epigraph', zh: '上图', html: '集合 <code>{(x,t) | f(x) ≤ t}</code>；函数凸当且仅当上图为凸集。' },
      { en: 'first-order condition', zh: '一阶条件', html: '可微凸函数满足 <code>f(y) ≥ f(x) + ∇f(x)<sup>T</sup>(y−x)</code>，切平面是全局下界。' },
      { en: 'conjugate function', zh: '共轭函数', html: '<code>f*(y) = sup<sub>x</sub>(y<sup>T</sup>x − f(x))</code>，恒为凸，是对偶理论的代数骨架。' },
      { en: 'quasiconvex', zh: '拟凸', html: '所有下水平集都凸的函数；比凸弱，但仍保证局部最优即全局最优。' },
      { en: 'strong convexity', zh: '强凸性', html: '存在 <code>m &gt; 0</code> 使 <code>f − (m/2)‖x‖<sup>2</sup></code> 凸，保证唯一最优与线性收敛。' },
      { en: 'condition number', zh: '条件数', html: '<code>κ = L/m</code>，Hessian 最大与最小特征值之比，决定梯度下降的收敛速度。' }
    ] },

    { t: 'keypoint', items: [
      { title: '凸 = 弦在上方 = 上图为凸集', html: '三种等价说法任选其一；定义域必须先凸，否则不等式无从谈起。' },
      { title: '切平面是全局下界', html: '一阶条件 <code>f(y) ≥ f(x) + ∇f(x)<sup>T</sup>(y−x)</code> 推出「梯度为零即全局最优」。' },
      { title: '二阶条件最常用来做题', html: '<code>∇<sup>2</sup>f ⪰ 0</code> 必须处处成立；只在一个点成立不够。' },
      { title: '幂函数的凸性看指数', html: '<code>x<sup>p</sup></code> 在 <code>x &gt; 0</code> 上 <code>p ≥ 1</code> 或 <code>p ≤ 0</code> 时凸，<code>0 &lt; p &lt; 1</code> 时凹。' },
      { title: '共轭恒凸', html: '仿射函数族的上确界必凸；Fenchel 不等式 <code>f + f* ≥ x<sup>T</sup>y</code> 等号处即次梯度。' },
      { title: '条件数决定步数', html: '梯度下降误差按 <code>(1 − 1/κ)<sup>k</sup></code> 收缩；<code>κ</code> 大就要预条件或换牛顿法。' }
    ] },

    { t: 'checklist', id: 'ch03', items: [
      '我能用定义验证 <code>x<sup>2</sup></code>、<code>e<sup>x</sup></code>、<code>|x|</code> 都是凸函数',
      '我能写出凸函数的一阶条件与二阶条件，并说明两者的差别',
      '我能指出「只在一个点 Hessian 半正定」为什么不足以证明凸性',
      '我能默写七类常见凸函数，并说出幂函数凸性随指数的变化',
      '我能用非负加权和、复合、逐点最大、部分最小化判断复合函数的凸性',
      '我能手算二次函数与指数函数的共轭',
      '我能解释 Fenchel 不等式，并说出等号成立的条件',
      '我能区分凸、严格凸、强凸，并说明各自保证什么',
      '我能由 Hessian 的特征值算出条件数，并估计梯度下降需要多少步',
      '我能说明为什么「最大化凹函数」等价于「最小化凸函数」'
    ] },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章依据 MAT3007 教材第 3 章「凸函数」组织：定义与上图、一阶与二阶条件、常见凸函数、保凸运算、共轭函数、拟凸函数、强凸性与条件数。收敛速率 <code>(1 − 1/κ)<sup>k</sup></code> 对应步长 <code>1/L</code> 的梯度下降，属标准结论，推导留到第 6 章。幂函数凸性、复合规则的方向、共轭的三对例子均为考试高频点。文中代码用随机采样抽查一阶条件，只作直觉校验，不构成证明。具体考核范围以当学期 syllabus 与习题课为准。' }
  ]
});
