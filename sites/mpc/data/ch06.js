/* =====================================================================
 * ch06.js · 第 6 章「方程组与数列：从线性到递推」
 * 职责：多个条件同时成立时怎么解（消元、矩阵），一串数怎么求和
 *       （等差、等比、求和记号），以及两条证明与展开工具（归纳、二项式）。
 * 依据：Precalculus 7th Edition 第 7–8 章（Systems and Sequences）。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch06',
  num: '06',
  title: '方程组与数列：从线性到递推',
  en: 'SYSTEMS & SEQUENCES',
  goals: [
    '用代入、消元、图像三种方法解二元一次方程组，并判断无解与无穷多解',
    '把方程组写成增广矩阵，用高斯消元化为阶梯形',
    '用求和记号写出前 n 项和，并推导等差、等比的通项与求和公式',
    '用数学归纳法证明与自然数有关的等式',
    '用二项式定理展开 (a + b)<sup>n</sup> 并求指定项'
  ],
  kp: [
    { id: 'ch06-1', title: '二元一次方程组的三种解法' },
    { id: 'ch06-2', title: '矩阵与高斯消元' },
    { id: 'ch06-3', title: '行列式与解的个数' },
    { id: 'ch06-4', title: '数列与求和记号' },
    { id: 'ch06-5', title: '等差数列与等比数列' },
    { id: 'ch06-6', title: '数学归纳法' },
    { id: 'ch06-7', title: '二项式定理' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '为什么微积分也要学方程组与数列', html: '两个理由。第一，<b>线性方程组是几乎所有应用数学的底层结构</b>：拟合一条直线要解方程组，电路分析要解方程组，微积分里的多元极值也要解方程组。第二，<b>数列的极限就是级数</b>：<code>1 + 1/2 + 1/4 + …</code> 收敛到 2，这件事在微积分里叫几何级数，是泰勒展开的起点。求和记号 <code>Σ</code> 更是积分符号的祖先——把「加有限项」换成「加无穷多项」，就是积分。' },

    { t: 'p', lead: true, html: '本章有两个独立但相通的半场。前半场是<b>解方程组</b>：多个条件同时成立时，怎么系统地消去未知数。后半场是<b>数列</b>：一串有规律的数，怎么写出通项、怎么求和。两者在「用有限个参数描述整体结构」这一点上是同一件事——方程组用系数矩阵描述约束，数列用通项公式描述规律。' },

    { t: 'h', lvl: 2, text: '一、二元一次方程组的三种解法', id: 'ch06-1' },

    { t: 'p', html: '二元一次方程组是两条直线的交点问题。三种解法各有适用场景。<b>代入法</b>：从一个方程解出一个变量，代入另一个，适合某个系数为 1 的情况。<b>消元法</b>：把两个方程乘以适当的数再相减，直接消去一个变量，适合系数整齐的情况。<b>图像法</b>：画两条直线看交点，适合快速判断解的个数，不适合求精确值。' },

    { t: 'p', html: '例：解 <code>2x + 3y = 12</code> 与 <code>x − y = 1</code>。代入法：由第二个方程得 <code>x = y + 1</code>，代入第一个：<code>2(y + 1) + 3y = 12</code>，<code>5y = 10</code>，<code>y = 2</code>，<code>x = 3</code>。消元法：第二个方程乘 2 得 <code>2x − 2y = 2</code>，两式相减：<code>5y = 10</code>，同样得 <code>y = 2</code>。两种方法结果一致，检验：<code>2(3) + 3(2) = 12</code>、<code>3 − 2 = 1</code>，都对。' },

    { t: 'table', head: ['情况', '系数关系', '图像', '解的个数'], rows: [
      ['唯一解', '两直线斜率不同', '相交于一点', '1'],
      ['无解', '斜率相同、截距不同', '两条平行线', '0'],
      ['无穷多解', '两方程成比例（同一平面上的同一条直线）', '两直线重合', '无穷'],
      ['例：唯一', '<code>2x + 3y = 12</code> 与 <code>x − y = 1</code>', '斜率 −2/3 与 1', '(3, 2)'],
      ['例：无解', '<code>x + y = 2</code> 与 <code>2x + 2y = 5</code>', '斜率都是 −1，截距不同', '无'],
      ['例：无穷多', '<code>x + y = 2</code> 与 <code>2x + 2y = 4</code>', '完全重合', '任意 (t, 2−t)']
    ], caption: '消元到最后出现 0 = 非零 就是无解，出现 0 = 0 就是无穷多解' },

    { t: 'p', html: '判断无解与无穷多解，不需要画图：消元后若得到 <code>0 = 5</code> 这类矛盾，说明无解；若得到 <code>0 = 0</code>，说明两个方程线性相关，解有无穷多个，用参数表示。例：<code>x + y = 2</code> 与 <code>2x + 2y = 4</code>，第二个除以 2 就是第一个，所以解集是 <code>(t, 2 − t)</code>，<code>t</code> 任意。写答案时用参数形式，不能只写一个点。' },

    { t: 'h', lvl: 2, text: '二、矩阵与高斯消元', id: 'ch06-2' },

    { t: 'p', html: '把方程组的系数与常数按顺序排成矩阵，就叫<b>增广矩阵</b>。上面的例子写成 <code>[2 3 | 12; 1 −1 | 1]</code>。解方程组允许的三类操作，对应矩阵的<b>初等行变换</b>：交换两行、某一行乘一个非零常数、某一行加上另一行的倍数。这三类操作不改变解集，所以可以放心用来化简。' },

    { t: 'steps', items: [
      { title: '第一步 · 写增广矩阵', html: '每个方程一行，未知数按固定顺序排列，常数项放在竖线右侧。缺项补 0，别留空。' },
      { title: '第二步 · 消第一列', html: '用第一行把下面各行的第一个元素消成 0：<code>R<sub>i</sub> ← R<sub>i</sub> − (a<sub>i1</sub>/a<sub>11</sub>)R<sub>1</sub></code>。' },
      { title: '第三步 · 消第二列', html: '用第二行把下面各行的第二个元素消成 0，依此类推，直到形成上三角（阶梯形）。' },
      { title: '第四步 · 回代', html: '从最后一行解出最后一个未知数，逐行往上代，得到全部解。' },
      { title: '第五步 · 检验', html: '把解代回<b>原</b>方程组，两个方程都要验，别只验变形后的那个。' }
    ] },

    { t: 'p', html: '对 <code>[2 3 | 12; 1 −1 | 1]</code> 做消元：先交换两行（让主元变成 1，算起来省事），得 <code>[1 −1 | 1; 2 3 | 12]</code>；<code>R<sub>2</sub> ← R<sub>2</sub> − 2R<sub>1</sub></code>，得 <code>[1 −1 | 1; 0 5 | 10]</code>；由第二行 <code>5y = 10</code> 得 <code>y = 2</code>；回代第一行 <code>x − 2 = 1</code> 得 <code>x = 3</code>。整个过程只有加减乘，比联立方程不容易出错。' },

    { t: 'p', html: '三个未知数时同理，只是行数变多。原则是<b>从左上到右下，逐列消元</b>，不要东消一个西消一个。若某列的主元为 0，就与下面某行交换；若整列都是 0，说明这个未知数自由，解里会出现参数。这套流程在计算机里就是线性方程组的标准解法，微积分里解约束极值也用它。' },

    { t: 'h', lvl: 2, text: '三、行列式与解的个数', id: 'ch06-3' },

    { t: 'p', html: '二阶行列式 <code>|a b; c d| = ad − bc</code>。对 <code>a<sub>1</sub>x + b<sub>1</sub>y = c<sub>1</sub></code> 与 <code>a<sub>2</sub>x + b<sub>2</sub>y = c<sub>2</sub></code>，系数行列式 <code>D = a<sub>1</sub>b<sub>2</sub> − a<sub>2</sub>b<sub>1</sub></code>。<code>D ≠ 0</code> 时有唯一解；<code>D = 0</code> 时无解或无穷多解，要再比较常数项。几何上，<code>D</code> 是两条直线方向向量张成的平行四边形的有向面积，<code>D = 0</code> 意味着方向向量共线，两条直线平行或重合。' },

    { t: 'p', html: '<b>克拉默法则</b>给出唯一解时的公式：<code>x = D<sub>x</sub>/D</code>、<code>y = D<sub>y</sub>/D</code>，其中 <code>D<sub>x</sub></code> 是把 <code>D</code> 的第一列换成常数项，<code>D<sub>y</sub></code> 换第二列。对上面的例子：<code>D = 2(−1) − 1(3) = −5</code>；<code>D<sub>x</sub> = 12(−1) − 1(3) = −15</code>；<code>D<sub>y</sub> = 2(1) − 12(1) = −10</code>；所以 <code>x = 3</code>、<code>y = 2</code>，与消元法一致。' },

    { t: 'callout', kind: 'warn', title: '错误说法：D = 0 就是无解', html: '为什么错：<code>D = 0</code> 只说明两条直线平行<b>或重合</b>，还要看常数项是否成比例。正确说法：<code>D = 0</code> 且常数项不成比例 → 无解；<code>D = 0</code> 且常数项也成比例 → 无穷多解。例：<code>x + y = 2</code> 与 <code>2x + 2y = 4</code> 的 <code>D = 0</code>，但有无穷多解；把第二个改成 <code>2x + 2y = 5</code> 才无解。' },

    { t: 'h', lvl: 2, text: '四、数列与求和记号', id: 'ch06-4' },

    { t: 'p', html: '数列是按顺序排列的一串数，记作 <code>{a<sub>n</sub>}</code>，<code>a<sub>n</sub></code> 是第 n 项。给出数列的方式有两种：<b>通项公式</b> <code>a<sub>n</sub> = f(n)</code>，直接算第 n 项；<b>递推公式</b>，用前几项算出后一项，例如 <code>a<sub>1</sub> = 1</code>、<code>a<sub>n+1</sub> = 2a<sub>n</sub> + 1</code>。通项便于求任意项，递推便于描述过程（如利息滚动）。' },

    { t: 'p', html: '求和记号 <code>Σ</code> 把一串加法压缩：<code>Σ<sub>k=1</sub><sup>n</sup> a<sub>k</sub> = a<sub>1</sub> + a<sub>2</sub> + … + a<sub>n</sub></code>。三条常用性质：和的求和等于求和再相加、常数因子可以提出、常数求和等于常数乘项数。即 <code>Σ(a<sub>k</sub> + b<sub>k</sub>) = Σa<sub>k</sub> + Σb<sub>k</sub></code>、<code>Σc·a<sub>k</sub> = cΣa<sub>k</sub></code>、<code>Σ<sub>k=1</sub><sup>n</sup> c = nc</code>。注意 <b>乘积的求和没有类似性质</b>，<code>Σ(a<sub>k</sub>b<sub>k</sub>) ≠ (Σa<sub>k</sub>)(Σb<sub>k</sub>)</code>。' },

    { t: 'table', head: ['记号', '含义', '例子', '结果'], rows: [
      ['<code>Σ<sub>k=1</sub><sup>5</sup> k</code>', '1 到 5 求和', '1+2+3+4+5', '15'],
      ['<code>Σ<sub>k=1</sub><sup>5</sup> (2k+1)</code>', '奇数和', '3+5+7+9+11', '35'],
      ['<code>Σ<sub>k=1</sub><sup>4</sup> k<sup>2</sup></code>', '平方和', '1+4+9+16', '30'],
      ['<code>Σ<sub>k=1</sub><sup>n</sup> c</code>', '常数求和', '<code>c + c + … + c</code>（n 项）', '<code>nc</code>'],
      ['<code>Σ<sub>k=1</sub><sup>n</sup> k</code>', '自然数求和公式', '<code>n(n+1)/2</code>', '见归纳法']
    ], caption: '求和记号的下标只是「计数变量」，换成 j、i 都一样，别和函数里的 x 混' },

    { t: 'p', html: '例：<code>Σ<sub>k=1</sub><sup>n</sup> (3k − 2)</code>。拆开：<code>3Σk − Σ2 = 3·n(n+1)/2 − 2n = (3n<sup>2</sup> + 3n − 4n)/2 = (3n<sup>2</sup> − n)/2</code>。检验 <code>n = 3</code>：直接加 <code>1 + 4 + 7 = 12</code>，公式给 <code>(27 − 3)/2 = 12</code>，一致。求和题一定要用小的 n 验算，这是最快的查错方式。' },

    { t: 'h', lvl: 2, text: '五、等差数列与等比数列', id: 'ch06-5' },

    { t: 'p', html: '等差数列每项加同一个常数 <code>d</code>：<code>a<sub>n</sub> = a<sub>1</sub> + (n − 1)d</code>，前 n 项和 <code>S<sub>n</sub> = n(a<sub>1</sub> + a<sub>n</sub>)/2 = n(2a<sub>1</sub> + (n − 1)d)/2</code>。求和的推导用的是「倒序相加」：把 <code>S<sub>n</sub></code> 正着写一遍、倒着写一遍，相加得 <code>n</code> 个 <code>(a<sub>1</sub> + a<sub>n</sub>)</code>。这个技巧是高斯小时候的故事，也是理解公式的最好方式。' },

    { t: 'p', html: '等比数列每项乘同一个常数 <code>r</code>：<code>a<sub>n</sub> = a<sub>1</sub>r<sup>n−1</sup></code>，前 n 项和 <code>S<sub>n</sub> = a<sub>1</sub>(1 − r<sup>n</sup>)/(1 − r)</code>（<code>r ≠ 1</code>）。推导用「错位相减」：<code>S<sub>n</sub></code> 乘 <code>r</code> 后与原式相减，中间项全部消掉。当 <code>|r| &lt; 1</code> 且 <code>n → ∞</code> 时，<code>r<sup>n</sup> → 0</code>，无穷级数和为 <code>a<sub>1</sub>/(1 − r)</code>。' },

    { t: 'table', head: ['性质', '等差数列', '等比数列'], rows: [
      ['通项', '<code>a<sub>n</sub> = a<sub>1</sub> + (n−1)d</code>', '<code>a<sub>n</sub> = a<sub>1</sub>r<sup>n−1</sup></code>'],
      ['相邻关系', '<code>a<sub>n+1</sub> − a<sub>n</sub> = d</code>', '<code>a<sub>n+1</sub>/a<sub>n</sub> = r</code>'],
      ['前 n 项和', '<code>n(a<sub>1</sub>+a<sub>n</sub>)/2</code>', '<code>a<sub>1</sub>(1−r<sup>n</sup>)/(1−r)</code>'],
      ['无穷和', '发散（除非 d = 0）', '<code>a<sub>1</sub>/(1−r)</code>，仅当 |r| &lt; 1'],
      ['例子', '3, 7, 11, 15, …（d = 4）', '2, 6, 18, 54, …（r = 3）']
    ], caption: '等差靠加法，等比靠乘法；「差」与「比」是判断类型的唯一标准' },

    { t: 'p', html: '例：<code>a<sub>1</sub> = 3</code>、<code>d = 4</code>，求 <code>S<sub>10</sub></code>。<code>a<sub>10</sub> = 3 + 9×4 = 39</code>，<code>S<sub>10</sub> = 10(3 + 39)/2 = 210</code>。例：<code>a<sub>1</sub> = 2</code>、<code>r = 3</code>，求 <code>S<sub>5</sub></code>：<code>2(1 − 243)/(1 − 3) = 2(−242)/(−2) = 242</code>。再例：<code>1/2 + 1/4 + 1/8 + …</code>，<code>a<sub>1</sub> = 1/2</code>、<code>r = 1/2</code>，无穷和 <code>(1/2)/(1 − 1/2) = 1</code>。' },

    { t: 'p', html: '等比求和公式要小心 <code>r = 1</code>：此时分母为零，公式失效，但数列每项都等于 <code>a<sub>1</sub></code>，和就是 <code>na<sub>1</sub></code>。另外 <code>r = 0</code> 时从第二项起全为 0，也属于等比（公比为 0），但通常题目会排除。这些边界情况在考试里常以选择题出现。' },

    { t: 'h', lvl: 2, text: '六、数学归纳法', id: 'ch06-6' },

    { t: 'p', html: '数学归纳法用来证明「对一切正整数 n 成立」的命题，分两步。<b>基础步</b>：验证 <code>n = 1</code> 时命题成立。<b>归纳步</b>：假设 <code>n = k</code> 时成立，证明 <code>n = k + 1</code> 时也成立。两步合起来，就像多米诺骨牌：第一块倒下，且每一块倒下都会推倒下一块，于是全部倒下。' },

    { t: 'p', html: '例：证明 <code>1 + 2 + … + n = n(n+1)/2</code>。基础步：<code>n = 1</code> 时左边 1，右边 <code>1×2/2 = 1</code>，成立。归纳步：假设 <code>1 + … + k = k(k+1)/2</code>，则 <code>1 + … + k + (k+1) = k(k+1)/2 + (k+1) = (k+1)(k+2)/2</code>，正是 <code>n = k+1</code> 的右边。证毕。' },

    { t: 'callout', kind: 'warn', title: '错误说法：归纳法可以跳过基础步', html: '为什么错：没有基础步，归纳步只能证明「如果有一块倒下，下一块也会倒」，但没有任何一块真的倒下。例如命题「<code>n<sup>2</sup> + n + 41</code> 对所有 n 都是素数」在 <code>n = 1</code> 到 39 都成立，<code>n = 40</code> 时等于 1681 = 41<sup>2</sup>，不成立——这说明「验证了很多项」不等于证明。归纳法的两步缺一不可。' },

    { t: 'p', html: '归纳步里最常见的错误是<b>把要证的结论直接用了</b>。正确做法是从 <code>n = k</code> 的表达式出发，加上第 <code>k+1</code> 项，变形到 <code>n = k+1</code> 的形式。写的时候把「假设」与「目标」分开写清，逻辑链条就不会乱。' },

    { t: 'h', lvl: 2, text: '七、二项式定理', id: 'ch06-7' },

    { t: 'p', html: '二项式定理：<code>(a + b)<sup>n</sup> = Σ<sub>k=0</sub><sup>n</sup> C(n, k) a<sup>n−k</sup>b<sup>k</sup></code>，其中 <code>C(n, k) = n!/(k!(n−k)!)</code> 是组合数，也记作 <code>n 选 k</code>。它说的是：展开时每一项都从 n 个括号里选若干个 <code>b</code>，选法数就是系数。帕斯卡三角给出递推：<code>C(n, k) = C(n−1, k−1) + C(n−1, k)</code>。' },

    { t: 'table', head: ['n', '展开式', '系数（帕斯卡三角第 n 行）'], rows: [
      ['0', '<code>1</code>', '1'],
      ['1', '<code>a + b</code>', '1 1'],
      ['2', '<code>a<sup>2</sup> + 2ab + b<sup>2</sup></code>', '1 2 1'],
      ['3', '<code>a<sup>3</sup> + 3a<sup>2</sup>b + 3ab<sup>2</sup> + b<sup>3</sup></code>', '1 3 3 1'],
      ['4', '<code>a<sup>4</sup> + 4a<sup>3</sup>b + 6a<sup>2</sup>b<sup>2</sup> + 4ab<sup>3</sup> + b<sup>4</sup></code>', '1 4 6 4 1']
    ], caption: '每一项 a 的指数与 b 的指数之和恒为 n，这是检查展开式最快的办法' },

    { t: 'p', html: '例：展开 <code>(x + 2)<sup>4</sup></code>。系数 1, 4, 6, 4, 1；<code>a = x</code>、<code>b = 2</code>，所以 <code>x<sup>4</sup> + 4x<sup>3</sup>(2) + 6x<sup>2</sup>(4) + 4x(8) + 16 = x<sup>4</sup> + 8x<sup>3</sup> + 24x<sup>2</sup> + 32x + 16</code>。检验：令 <code>x = 1</code>，左边 <code>3<sup>4</sup> = 81</code>，右边 <code>1 + 8 + 24 + 32 + 16 = 81</code>，一致。这种「代一个数验算」的方法对任何展开式都有效。' },

    { t: 'p', html: '求指定项：<code>(2x − 1)<sup>6</sup></code> 中 <code>x<sup>4</sup></code> 的系数。通项是 <code>C(6, k)(2x)<sup>6−k</sup>(−1)<sup>k</sup></code>。要 <code>x<sup>4</sup></code>，令 <code>6 − k = 4</code>，<code>k = 2</code>。系数为 <code>C(6,2)·2<sup>4</sup>·(−1)<sup>2</sup> = 15 × 16 × 1 = 240</code>。注意负号：<code>k</code> 为奇数时该项为负，这一步最容易漏。' },

    { t: 'terms', items: [
      { en: 'augmented matrix', zh: '增广矩阵', html: '把方程组的系数与常数项排成的矩阵，用于高斯消元。' },
      { en: 'determinant', zh: '行列式', html: '二阶为 ad − bc；不为零时有唯一解，为零时无解或无穷多解。' },
      { en: 'arithmetic sequence', zh: '等差数列', html: '相邻项之差恒为 d；通项 a₁ + (n−1)d，求和用倒序相加。' },
      { en: 'geometric sequence', zh: '等比数列', html: '相邻项之比恒为 r；通项 a₁r<sup>n−1</sup>，求和用错位相减。' },
      { en: 'induction', zh: '数学归纳法', html: '基础步加归纳步，证明对一切正整数成立的命题；两步缺一不可。' },
      { en: 'binomial theorem', zh: '二项式定理', html: '(a+b)<sup>n</sup> 的展开，系数为组合数；a 与 b 的指数和恒为 n。' }
    ] },

    { t: 'quiz', qid: 'ch06-q1' },
    { t: 'quiz', qid: 'ch06-q2' },
    { t: 'quiz', qid: 'ch06-q3' },

    { t: 'keypoint', items: [
      { title: '消元后看 0 = 什么', html: '0 = 非零 无解，0 = 0 无穷多解；不要只看系数行列式就下结论。' },
      { title: '行变换不改变解集', html: '交换、倍乘、相加是高斯消元的三种合法操作；回代后代回原方程检验。' },
      { title: '等差看差，等比看比', html: '通项与求和公式都靠这两个定义推出来，不要混用。' },
      { title: '归纳法两步缺一不可', html: '基础步给第一块骨牌，归纳步保证传递；不能拿结论当假设。' },
      { title: '二项式展开的指数和恒为 n', html: '用这一条检查每一项，再用代值法核对整个展开式。' }
    ] },

    { t: 'checklist', id: 'ch06', items: [
      '我能用代入法与消元法各解一次 2x + 3y = 12、x − y = 1，并核对结果',
      '我能判断 x + y = 2 与 2x + 2y = 5 无解，并说出消元后出现什么',
      '我能把方程组写成增广矩阵，做一次完整的高斯消元与回代',
      '我能用克拉默法则算出 x = 3、y = 2，并解释 D = 0 的两种可能',
      '我能用 Σ 写出前 n 个奇数之和并算出结果',
      '我能推导等差数列求和公式，并说出「倒序相加」的关键一步',
      '我能算出 1/2 + 1/4 + 1/8 + … 的无穷和，并说明收敛条件',
      '我能用归纳法证明 1 + 2 + … + n = n(n+1)/2，两步都写清',
      '我能展开 (x + 2)<sup>4</sup> 并用 x = 1 验算，还能求 (2x − 1)<sup>6</sup> 中 x<sup>4</sup> 的系数'
    ] },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章对应 Precalculus 7th Edition 第 7–8 章：二元一次方程组的代入、消元与图像解法，增广矩阵与高斯消元，行列式与克拉默法则，数列与求和记号，等差与等比数列，数学归纳法，二项式定理。三元以上方程组只给方法框架，不展开数值例子；无穷级数只讲几何级数的收敛，留待微积分正式处理。出租车、成本等例子不涉及，本章数值均为教学设定。' }
  ]
});
