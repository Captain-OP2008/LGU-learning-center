/* =====================================================================
 * ch04.js · 第 4 章「凸优化问题：把模型放进标准形」
 * 职责：给出凸优化问题的标准形与判定条件，讲清局部最优即全局最优、
 *       LP/QP/SOCP/SDP 四类实例，以及五种常用的等价变换与松弛手法。
 * 依据：MAT3007 教材第 4 章（凸优化问题、问题类、等价变换）。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch04',
  num: '04',
  title: '凸优化问题：把模型放进标准形',
  en: 'CONVEX OPTIMIZATION PROBLEMS',
  goals: [
    '写出凸优化问题的标准形，并逐条判断一个模型是否属于这个标准形',
    '解释为什么凸问题的任意局部最优都是全局最优，并写出两行证明',
    '区分 LP、QP、SOCP、SDP 四类实例，把具体约束对应到正确的类',
    '用引入辅助变量、消去等式约束、变量替换三种手法把模型改写成标准形',
    '说明松弛为什么给出下界，以及松弛解何时恰好是原问题的解'
  ],
  kp: [
    { id: 'ch04-1', title: '凸问题的标准形' },
    { id: 'ch04-2', title: '局部最优与全局最优' },
    { id: 'ch04-3', title: '线性规划与二次规划' },
    { id: 'ch04-4', title: '二阶锥规划' },
    { id: 'ch04-5', title: '半正定规划' },
    { id: 'ch04-6', title: '等价变换三件套' },
    { id: 'ch04-7', title: '消元与松弛' },
    { id: 'ch04-8', title: '给模型归类' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '这一章是「把问题放进框子里」', html: '前两章分别解释了「可行域要凸」与「目标要凸」，这一章把两件事合起来，定义什么叫「一个凸优化问题」。标准形只有三行，但要把现实中的模型塞进这三行，往往需要一连串等价变形：引入辅助变量把 <code>max</code> 摊平、消去等式约束降维、用变量替换把乘积变成加法、用松弛把整数问题变成连续问题。这些变形不改变最优值（或只改变一点点并给出界），却决定了求解器能不能接手。' },

    { t: 'p', lead: true, html: '优化问题 <code>min f<sub>0</sub>(x)</code>、<code>s.t. f<sub>i</sub>(x) ≤ 0</code>、<code>a<sub>i</sub><sup>T</sup>x = b<sub>i</sub></code> 称为<b>凸优化问题</b>（convex optimization problem），如果 <code>f<sub>0</sub></code> 与所有 <code>f<sub>i</sub></code> 都是凸函数，且等式约束都是仿射的。三个条件缺一不可：目标凸、不等式约束凸、等式约束仿射。满足这三个条件，可行域就是凸集，问题就是凸的。' },

    { t: 'h', lvl: 2, text: '一、凸问题的标准形', id: 'ch04-1' },

    { t: 'p', html: '注意「等式约束必须仿射」这一条最容易违反。<code>x<sub>1</sub><sup>2</sup> + x<sub>2</sub><sup>2</sup> = 1</code> 定义的是单位圆，它不凸（取圆上两点，中点落在圆内），所以带这种等式约束的问题一定不是凸的。反过来，<code>x<sub>1</sub> + 2x<sub>2</sub> = 3</code> 是直线，凸，可以用。<b>判据是「约束定义的集合凸不凸」，不是「函数看起来简不简单」</b>。' },

    { t: 'p', html: '再看不等式约束的方向。<code>f<sub>i</sub>(x) ≤ 0</code> 要求 <code>f<sub>i</sub></code> 凸，这样下水平集才是凸的。若约束写成 <code>f<sub>i</sub>(x) ≥ 0</code>，那就需要 <code>f<sub>i</sub></code> 凹（等价于 <code>−f<sub>i</sub></code> 凸）。很多人写模型时习惯「大于等于某个下限」，这时要检查的是凹性而不是凸性——方向与凸性要求是配对的。' },

    { t: 'table', caption: '三个条件与各自的检查方式', head: ['成分', '标准形要求', '违反时的典型症状'], rows: [
      ['目标 <code>f<sub>0</sub></code>', '凸函数', '求解器报「非凸」，或结果依赖初值'],
      ['不等式 <code>f<sub>i</sub> ≤ 0</code>', '<code>f<sub>i</sub></code> 凸', '可行域有凹陷，局部最优不是全局最优'],
      ['等式 <code>a<sub>i</sub><sup>T</sup>x = b<sub>i</sub></code>', '仿射', '可行域是曲面（圆、球面），非凸'],
      ['变量定义域', '<code>x ∈ R<sup>n</sup></code>（或凸子集）', '整数要求、稀疏要求破坏凸性']
    ] },

    { t: 'p', html: '还有一条常见误解：「函数凸不凸」和「问题凸不凸」不是一回事。<code>min −log(x)</code> 里 <code>−log</code> 是凸的，所以问题凸；<code>max log(x)</code> 里 <code>log</code> 是凹的，最大化凹函数也等价于最小化凸函数，同样凸。<b>判断问题凸不凸，看的是「极小化 + 凸目标 + 凸不等式 + 仿射等式」这个整体结构</b>，单个函数的凸性只是零件。' },

    { t: 'p', html: '最后提醒一个反直觉的事实：凸问题的标准形并不要求 <code>f<sub>i</sub></code> 在整个 <code>R<sup>n</sup></code> 上凸，只要求在可行域上「有效」。例如 <code>f(x) = x<sup>2</sup></code> 限制在 <code>x ≥ 1</code> 上，与 <code>f(x) = 2x − 1</code> 在可行域上给出相同的约束效果（因为 <code>x<sup>2</sup> ≥ 2x−1</code> 恒成立，等号只在 <code>x=1</code>）。这种「在可行域上等价」的替换，是后面等价变换的理论基础。' },

    { t: 'callout', kind: 'tip', title: '三行自检', html: '① 写下目标，问「它凸吗」；② 逐条写下不等式，问「左边这个函数凸吗，方向对不对」；③ 逐条写下等式，问「它是线性的吗」。三行都过，问题就是凸的；有一条不过，先想能不能变形，再考虑它是不是真的非凸。' },

    { t: 'h', lvl: 2, text: '二、局部最优与全局最优', id: 'ch04-2' },

    { t: 'p', html: '凸优化最重要的结论只有一句话：<b>凸问题的任意局部最优解都是全局最优解</b>。所谓局部最优，是指存在 <code>R &gt; 0</code>，使得所有满足 <code>‖y − x‖ ≤ R</code> 的可行点 <code>y</code> 都有 <code>f<sub>0</sub>(y) ≥ f<sub>0</sub>(x)</code>。全局最优则要求不等式对所有可行点成立。凸性把「附近」直接升级成「全部」。' },

    { t: 'p', html: '证明只有两行，值得背下来。设 <code>x</code> 是局部最优，若存在可行点 <code>y</code> 使 <code>f<sub>0</sub>(y) &lt; f<sub>0</sub>(x)</code>，取 <code>z = θy + (1−θ)x</code>，<code>θ ∈ (0,1)</code> 足够小，则 <code>z</code> 落在 <code>x</code> 的邻域内且可行（可行域凸）。由凸性，<code>f<sub>0</sub>(z) ≤ θf<sub>0</sub>(y) + (1−θ)f<sub>0</sub>(x) &lt; f<sub>0</sub>(x)</code>，与 <code>x</code> 局部最优矛盾。所以不存在更好的可行点。<b>整个证明只用到「可行域凸」与「目标凸」这两件事。</b>' },

    { t: 'p', html: '这条结论的实践意义：<b>你不需要担心初值</b>。梯度下降从哪出发都收敛到同一个最优值（可能收敛到不同的最优点，如果最优解不唯一）。反过来，如果同一个模型换初值得到不同的结果，那它一定不是凸的——这是一个非常实用的「凸性探测器」，比读代码找非凸项快得多。' },

    { t: 'p', html: '非凸问题里，驻点有三种身份：局部极小、局部极大、鞍点。更麻烦的是「平坦区」：梯度很小但离最优很远，算法会误以为收敛了。凸问题没有这些麻烦，因为梯度为零（无约束时）或 KKT 条件成立（有约束时）就是全局最优的充要条件。这条充要性是第 5、6、7 章所有算法的终止判据。' },

    { t: 'compare', left: { title: '凸问题', html: '局部最优 = 全局最优。梯度为零（或 KKT 成立）即最优。初值无关，结果可复现。这就是为什么工程上愿意花力气把模型「凸化」。' }, right: { title: '非凸问题', html: '局部最优可能有一堆，驻点可能是鞍点，结果依赖初值与随机种子。通常只能求近似解，并用多起点、松弛或启发式来兜底。' } },

    { t: 'quiz', qid: 'ch04-q1' },

    { t: 'h', lvl: 2, text: '三、线性规划与二次规划', id: 'ch04-3' },

    { t: 'p', html: '<b>线性规划</b>（LP）是目标和约束全为仿射的情形：<code>min c<sup>T</sup>x</code>，<code>s.t. Ax ≤ b</code>，<code>Cx = d</code>。它的可行域是多面体，最优解在极值点（第 2 章）。LP 的特殊之处在于规模可以极大：变量上百万、约束上百万，商用求解器仍能在分钟级解出来，因为单纯形法与内点法都有成熟实现。' },

    { t: 'p', html: '<b>二次规划</b>（QP）把目标换成二次型：<code>min ½x<sup>T</sup>Px + q<sup>T</sup>x</code>，<code>s.t. Ax ≤ b</code>，其中 <code>P ⪰ 0</code>。若 <code>P ≻ 0</code>，目标严格凸，最优解唯一；若 <code>P</code> 只有半正定，最优解可能是一个面。QP 覆盖了最小二乘、岭回归、软间隔 SVM、投资组合等一大类问题，是实践中最常用的凸模型。' },

    { t: 'p', html: '一个具体的 QP：<code>min ½(x<sub>1</sub><sup>2</sup> + 2x<sub>2</sub><sup>2</sup>) + x<sub>1</sub> − 4x<sub>2</sub></code>，<code>s.t. x<sub>1</sub> + x<sub>2</sub> ≤ 3</code>，<code>x ≥ 0</code>。无约束最优解由 <code>∇f = (x<sub>1</sub>+1, 2x<sub>2</sub>−4) = 0</code> 给出 <code>(−1, 2)</code>，不满足 <code>x<sub>1</sub> ≥ 0</code>；加上约束后最优点落在 <code>x<sub>1</sub> = 0</code> 上，再解 <code>x<sub>2</sub></code> 得 <code>x<sub>2</sub> = 2</code>，目标值 <code>½·0 + ½·2·4 + 0 − 8 = −4</code>。检查约束 <code>0 + 2 = 2 ≤ 3</code>，可行。这个例子说明：<b>QP 的最优解可能落在边界上，不能只解无约束的一阶条件</b>。' },

    { t: 'p', html: 'QP 有一个 LP 没有的性质：若 <code>P ≻ 0</code>，目标严格凸，最优点唯一，因此「最优解」是一个点而不是一个集合。这让 QP 的灵敏度分析更干净（第 5 章），也让数值算法更容易判断收敛。LP 则相反，最优解常常是一整条边或一整个面，需要额外处理「解不唯一」的情况。' },

    { t: 'table', caption: 'LP 与 QP 的对照', head: ['维度', 'LP', 'QP'], rows: [
      ['目标', '<code>c<sup>T</sup>x</code>', '<code>½x<sup>T</sup>Px + q<sup>T</sup>x</code>，<code>P ⪰ 0</code>'],
      ['最优解位置', '极值点（顶点）', '可能是内点、边界或顶点'],
      ['唯一性', '通常不唯一', '<code>P ≻ 0</code> 时唯一'],
      ['典型算法', '单纯形法、内点法', '有效集法、内点法'],
      ['典型规模', '百万级变量', '万级到十万级'],
      ['典型场景', '运输、排班、网络流', '最小二乘、组合优化、SVM']
    ] },

    { t: 'h', lvl: 2, text: '四、二阶锥规划', id: 'ch04-4' },

    { t: 'p', html: '<b>二阶锥规划</b>（second-order cone program，SOCP）的约束形如 <code>‖A<sub>i</sub>x + b<sub>i</sub>‖<sub>2</sub> ≤ c<sub>i</sub><sup>T</sup>x + d<sub>i</sub></code>，也就是「一个仿射函数的范数不超过另一个仿射函数」。这类约束定义的集合是二阶锥与仿射子空间的交，凸。目标通常是线性的。' },

    { t: 'p', html: 'SOCP 覆盖了 QP：任何凸二次约束 <code>x<sup>T</sup>Px + q<sup>T</sup>x + r ≤ 0</code>（<code>P ⪰ 0</code>）都可以写成 <code>‖P<sup>1/2</sup>x + ½P<sup>−1/2</sup>q‖ ≤ ...</code> 的范数形式。它也覆盖了大量「范数型」的目标：<code>min ‖Ax − b‖<sub>2</sub></code>、<code>min ‖x‖<sub>1</sub></code>（可线性化）、<code>min max<sub>i</sub> ‖A<sub>i</sub>x − b<sub>i</sub>‖</code>。' },

    { t: 'p', html: 'SOCP 最典型的应用是<b>鲁棒线性规划</b>。假设约束 <code>a<sub>i</sub><sup>T</sup>x ≤ b<sub>i</sub></code> 里的 <code>a<sub>i</sub></code> 不确定，只知道它落在椭球 <code>ā<sub>i</sub> + Σ<sub>i</sub><sup>1/2</sup>u</code>（<code>‖u‖ ≤ 1</code>）里。要求约束对所有可能的 <code>a<sub>i</sub></code> 都成立，最坏情况是 <code>ā<sub>i</sub><sup>T</sup>x + ‖Σ<sub>i</sub><sup>1/2</sup>x‖<sub>2</sub> ≤ b<sub>i</sub></code>，正好是一条二阶锥约束。这样「参数不确定」就被转成了「确定性的凸约束」，不需要采样，也不需要猜。' },

    { t: 'p', html: '举个数字：<code>ā = (1, 0)</code>、<code>Σ = diag(0.04, 0.01)</code>、<code>b = 1</code>。鲁棒约束是 <code>x<sub>1</sub> + sqrt(0.04x<sub>1</sub><sup>2</sup> + 0.01x<sub>2</sub><sup>2</sup>) ≤ 1</code>。当 <code>x = (0.5, 0)</code> 时左边 <code>= 0.5 + 0.1 = 0.6 ≤ 1</code>，可行；当 <code>x = (1, 0)</code> 时左边 <code>= 1 + 0.2 = 1.2 &gt; 1</code>，不可行。注意 <code>x<sub>1</sub> = 1</code> 对名义约束 <code>x<sub>1</sub> ≤ 1</code> 是可行的，但鲁棒约束把它排除了——<b>鲁棒化一定会让可行域变小</b>，这是稳健性的代价。' },

    { t: 'p', html: 'SOCP 的求解复杂度介于 LP 与 SDP 之间，内点法在多项式时间内可解。工程上它被广泛用于天线阵列设计、滤波器设计、投资组合（CVaR 约束）、机器人轨迹规划（碰撞避免写成范数约束）。CVXPY 里写 <code>cp.norm(A @ x + b) &lt;= c @ x + d</code> 就是一条 SOCP 约束，求解器会自动识别。' },

    { t: 'quiz', qid: 'ch04-q2' },

    { t: 'h', lvl: 2, text: '五、半正定规划', id: 'ch04-5' },

    { t: 'p', html: '<b>半正定规划</b>（semidefinite program，SDP）的变量是一个对称矩阵 <code>X</code>，约束是线性的，外加 <code>X ⪰ 0</code>：<code>min tr(CX)</code>，<code>s.t. tr(A<sub>i</sub>X) = b<sub>i</sub></code>，<code>X ⪰ 0</code>。它是线性规划在「矩阵变量 + 半正定锥」上的推广：把 <code>X ⪰ 0</code> 换成 <code>x ≥ 0</code> 就是 LP。' },

    { t: 'p', html: 'SDP 为什么重要？因为它能表达「平方和」与「矩阵不等式」。形如 <code>A<sup>T</sup>XA ⪯ B</code> 的线性矩阵不等式（LMI）是控制理论的标准语言；形如「<code>x<sup>T</sup>Px ≤ 1</code> 对所有 <code>P</code> 成立」的鲁棒条件可以写成 SDP；组合优化里的最大割、最大独立集，其 SDP 松弛给出了目前最好的近似比。' },

    { t: 'p', html: '最著名的例子是最大割（MaxCut）的 Goemans–Williamson 松弛。原问题是 <code>max Σ<sub>(i,j)∈E</sub> (1 − x<sub>i</sub>x<sub>j</sub>)/2</code>，<code>x<sub>i</sub> ∈ {−1, 1}</code>，组合的、NP 难的。松弛把 <code>x<sub>i</sub></code> 换成单位向量 <code>v<sub>i</sub></code>，<code>x<sub>i</sub>x<sub>j</sub></code> 换成 <code>v<sub>i</sub><sup>T</sup>v<sub>j</sub></code>，约束 <code>X = VV<sup>T</sup> ⪰ 0</code> 且 <code>X<sub>ii</sub> = 1</code>。这个 SDP 可解，再用随机超平面取整，期望近似比 <code>0.878</code>。' },

    { t: 'p', html: 'SDP 的代价是规模。内点法每步要解一个 <code>n<sup>2</sup>×n<sup>2</sup></code> 的线性系统，变量数上千就吃力了。所以实践中常用「低秩分解」「一阶方法（如 ADMM）」或「只在关键约束上用 SDP」。这也是第 7 章要讲 ADMM 的原因：它能把大型 SDP 拆成若干小问题交替求解。' },

    { t: 'table', caption: '四类问题的包含关系与代价', head: ['问题类', '变量', '锥', '求解代价', '典型规模'], rows: [
      ['LP', '<code>x ∈ R<sup>n</sup></code>', '非负象限', '最低', '<code>10<sup>5</sup>–10<sup>6</sup></code>'],
      ['QP', '<code>x ∈ R<sup>n</sup></code>', '非负象限 + 二次目标', '低', '<code>10<sup>4</sup>–10<sup>5</sup></code>'],
      ['SOCP', '<code>x ∈ R<sup>n</sup></code>', '二阶锥', '中', '<code>10<sup>3</sup>–10<sup>4</sup></code>'],
      ['SDP', '<code>X ∈ S<sup>n</sup></code>', '半正定锥', '高', '<code>10<sup>2</sup>–10<sup>3</sup></code>']
    ] },

    { t: 'h', lvl: 2, text: '六、等价变换三件套', id: 'ch04-6' },

    { t: 'p', html: '现实模型很少天然长成标准形。下面三种变形覆盖了绝大多数情况，它们的共同点是<b>不改变最优解集合（或最优值），只改变写法</b>。' },

    { t: 'steps', items: [
      { title: '① 引入辅助变量，把非光滑摊平', html: '目标里的 <code>max</code>、<code>|·|</code>、分段函数，都可以用一个新变量 <code>t</code> 顶替：<code>min t</code>，<code>s.t. t ≥ f<sub>i</sub>(x)</code>。这样目标变成线性，约束变多但都凸。例：<code>min max<sub>i</sub>(a<sub>i</sub><sup>T</sup>x + b<sub>i</sub>)</code> 变成 <code>min t</code>、<code>a<sub>i</sub><sup>T</sup>x + b<sub>i</sub> ≤ t</code>。' },
      { title: '② 消去等式约束，降维', html: '把 <code>Ax = b</code> 的通解写成 <code>x = x<sub>0</sub> + Fz</code>（<code>F</code> 是 <code>A</code> 的零空间基），代回目标与不等式，得到一个只含 <code>z</code> 的低维问题。变量数从 <code>n</code> 降到 <code>n − rank(A)</code>，且不再有等式约束。' },
      { title: '③ 变量替换，把非凸项变成凸项', html: '对正变量取对数 <code>y = log x</code>，乘积变加法、幂变线性，几何规划因此可解；对协方差矩阵用 Cholesky 因子 <code>Σ = LL<sup>T</sup></code>，<code>log det Σ</code> 变成 <code>2 log det L</code>，凹性显式。替换必须是一一对应（双射），否则最优解可能丢失。' }
    ] },

    { t: 'p', html: '第一种变形有个细节要小心：<code>min t</code>、<code>t ≥ f<sub>i</sub>(x)</code> 的最优解里，<code>t</code> 会被压到恰好等于 <code>max<sub>i</sub> f<sub>i</sub>(x)</code>，所以它与原问题等价。<b>但如果目标里还有别的项在拉 <code>t</code></b>（例如 <code>min t + 3x</code>），就要检查 <code>t</code> 是否还能被压到边界——通常能，因为压低 <code>t</code> 总是有利的。只有当 <code>t</code> 的系数为负时才会出问题（那时模型会想把 <code>t</code> 推向负无穷，被约束挡住，仍然等价）。' },

    { t: 'p', html: '第二种变形是「消元」，它的正确性依据是第 3 章的部分最小化：<code>inf<sub>x</sub> f(x)</code> 在 <code>x</code> 满足等式时，等于 <code>inf<sub>z</sub> f(x<sub>0</sub> + Fz)</code>。注意零空间基的选取不唯一，但得到的可行域与最优值相同；数值上要选正交基（SVD 或 QR），否则 <code>F</code> 条件数差会让求解变慢。' },

    { t: 'p', html: '第三种变形最容易出错。变量替换必须保住「凸性」：<code>x = e<sup>y</sup></code> 把 <code>x &gt; 0</code> 映到整个 <code>R</code>，且 <code>log</code> 是单调的，所以可行性不变；但若替换是 <code>x = y<sup>2</sup></code>，则 <code>y</code> 与 <code>−y</code> 映到同一点，问题变成非凸（可行域不凸），不能直接用。判断标准：<b>替换映射是不是仿射或单调双射</b>。' },

    { t: 'p', html: '再补一个常用的「化归」：把 <code>max</code> 目标转成 <code>min</code>。<code>max f</code> 等价于 <code>min −f</code>，最优解不变、最优值取负。这个操作看起来平凡，但它是所有「最大化凹函数」问题能被标准求解器处理的原因。写代码时若直接用 <code>cp.Maximize</code>，CVXPY 内部也是这么转的。' },

    { t: 'quiz', qid: 'ch04-q3' },

    { t: 'h', lvl: 2, text: '七、消元与松弛', id: 'ch04-7' },

    { t: 'p', html: '<b>松弛</b>（relaxation）是「去掉一些约束，把可行域放大」。因为可行域变大，最优值只会变好（对极小化是变小），所以松弛问题的最优值给出原问题最优值的<b>下界</b>。这个下界有两个用途：一是判断原问题「至少能有多好」，二是给分支定界提供剪枝依据。' },

    { t: 'p', html: '松弛有两种常见形式。<b>连续松弛</b>：把整数变量 <code>x ∈ {0,1}</code> 放松成 <code>0 ≤ x ≤ 1</code>，问题立刻变成 LP，可解。<b>锥松弛</b>：把 <code>X = vv<sup>T</sup></code>（秩一、非凸）放松成 <code>X ⪰ 0</code>（凸），得到 SDP。两种松弛都会给出下界，但都不保证紧。' },

    { t: 'p', html: '什么时候松弛是「紧」的？也就是松弛解恰好满足被去掉的约束。对连续松弛，一个充分条件是约束矩阵全幺模（运输问题、网络流问题都有这个性质），此时 LP 的顶点自动是整数点。对锥松弛，紧性依赖问题结构，一般要用随机取整并分析近似比。考试里若问「松弛是否紧」，标准答法是：<b>先解松弛，检查解是否满足原约束；满足则紧，不满足则只能给界</b>。' },

    { t: 'p', html: '消元与松弛常一起用。例如带整数变量的选址问题：先松弛成 LP 得到下界，再对分数变量分支；每个分支再消去等式约束降维。这套流程就是分支定界（branch and bound）的骨架，它的效率高度依赖下界的质量——下界越紧，剪枝越早。' },

    { t: 'p', html: '一个常被忽略的点：<b>松弛的方向不能搞反</b>。对极小化问题，松弛（去掉约束）让最优值变小，所以松弛值 ≤ 原问题最优值；对极大化问题则相反，松弛值 ≥ 原问题最优值。写论文或作业时若把不等号方向写反，整个界的论证就失效了。' },

    { t: 'callout', kind: 'warn', title: '松弛解不可行时的正确说法', html: '不要说「松弛失败」或「这个方法不对」。松弛从来只承诺给界，不承诺给可行解。正确说法是：「松弛最优值为 <code>L</code>，原问题最优值 <code>p* ≥ L</code>；由于松弛解 <code>x̃</code> 不满足约束 <code>x ∈ {0,1}</code>，需要取整或分支。」若取整后得到可行解 <code>x̂</code>，则进一步有 <code>L ≤ p* ≤ f(x̂)</code>，这就是相对误差界。' },

    { t: 'h', lvl: 2, text: '八、给模型归类', id: 'ch04-8' },

    { t: 'p', html: '拿到一个模型，先归类再求解。归类的顺序是：<b>目标是不是二次的？约束是不是只有线性的？有没有范数？有没有矩阵不等式？</b>按这个顺序回答，就能落到 LP、QP、SOCP、SDP 中的某一类，或者发现它不在四类之内（那时要考虑松弛、近似或换建模方式）。' },

    { t: 'p', html: '分类之后还要做一次「规模体检」：变量数与约束数量级是多少？若 LP 有百万变量，直接用内点法可能内存不够，要考虑单纯形法或分解算法；若 SDP 的矩阵维数上千，要考虑低秩近似或一阶方法。模型类别决定算法族，规模决定算法参数——这两步都不能跳。' },

    { t: 'p', html: '最后一件事是「验证」：解出来之后，把最优解代回原始约束逐条检查，并核对目标值。凸问题的解不会「看起来对但其实错」，但建模错误（第 1 章那五条）会让解出来的东西完全跑偏。<b>数值求解只保证「在你给的模型上最优」，不保证「模型是你想要的那个」</b>，这一步永远要人工做。' },

    { t: 'p', html: '把这一章压缩成一张图：<b>凸问题 = 凸目标 + 凸不等式 + 仿射等式</b>；它的核心好处是局部最优即全局最优；它的四类实例按锥的复杂度排列；它的建模技巧是辅助变量、消元、变量替换、松弛。下一章开始讲对偶——那是理解「为什么最优」「乘子是什么」「灵敏度怎么算」的关键工具。' },

    { t: 'terms', items: [
      { en: 'convex problem', zh: '凸优化问题', html: '目标与不等式约束凸、等式约束仿射的极小化问题。' },
      { en: 'local optimum', zh: '局部最优', html: '在某个邻域内不劣于所有可行点的解；凸问题中它必是全局最优。' },
      { en: 'epigraph form', zh: '上图形式', html: '把 <code>min f<sub>0</sub></code> 改写成 <code>min t</code>、<code>f<sub>0</sub>(x) ≤ t</code> 的等价形式。' },
      { en: 'relaxation', zh: '松弛', html: '去掉部分约束以放大可行域，其最优值给出原问题最优值的界。' },
      { en: 'SOCP', zh: '二阶锥规划', html: '约束形如 <code>‖Ax+b‖ ≤ c<sup>T</sup>x+d</code> 的凸问题，可表达鲁棒 LP。' },
      { en: 'SDP', zh: '半正定规划', html: '矩阵变量加 <code>X ⪰ 0</code> 约束的线性优化问题，用于 LMI 与组合松弛。' },
      { en: 'LMI', zh: '线性矩阵不等式', html: '形如 <code>A<sup>T</sup>XA ⪯ B</code> 的约束，是控制与鲁棒分析的标准写法。' }
    ] },

    { t: 'keypoint', items: [
      { title: '三个条件', html: '目标凸、不等式约束凸、等式约束仿射；等式一旦非线性，可行域就不凸。' },
      { title: '局部即全局', html: '凸问题的两行证明只用「可行域凸」与「目标凸」，结论是初值无关、可复现。' },
      { title: '四类实例按锥排列', html: 'LP ⊂ QP ⊂ SOCP ⊂ SDP；表达力越强，求解代价越高，规模上限越低。' },
      { title: '鲁棒 LP 是 SOCP', html: '椭球不确定集下的最坏情况约束 <code>ā<sup>T</sup>x + ‖Σ<sup>1/2</sup>x‖ ≤ b</code> 正是二阶锥约束。' },
      { title: '三种等价变形', html: '辅助变量摊平非光滑、消元降维、变量替换改凸性；替换必须是双射。' },
      { title: '松弛只给界', html: '极小化问题的松弛值是最优值的下界；松弛解可行才算紧，否则要取整或分支。' }
    ] },

    { t: 'checklist', id: 'ch04', items: [
      '我能写出凸优化问题的标准形，并逐条说明三个条件',
      '我能指出「二次等式约束」为什么破坏凸性',
      '我能写出「局部最优即全局最优」的两行证明',
      '我能用「换初值看结果」判断一个模型是否凸',
      '我能把 <code>min max<sub>i</sub>(a<sub>i</sub><sup>T</sup>x+b<sub>i</sub>)</code> 改写成 LP',
      '我能说清 QP 与 LP 在最优解位置上的差别',
      '我能写出 SOCP 的约束形式，并解释鲁棒 LP 怎么变成 SOCP',
      '我能写出 SDP 的标准形，并说明 <code>X ⪰ 0</code> 松弛了什么',
      '我能用零空间参数化消去等式约束',
      '我能解释松弛为什么给出下界，以及「紧」是什么意思'
    ] },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章依据 MAT3007 教材第 4 章「凸优化问题」组织：标准形与判定、局部与全局最优、LP/QP/SOCP/SDP 四类实例、等价变换（辅助变量、消元、变量替换）与松弛。鲁棒 LP 的椭球不确定集推导按 Boyd 教材 §4.4 的口径给出；MaxCut 的 <code>0.878</code> 近似比只给结论，未展开随机取整的证明。第二章的 QP 数值例子经过重新设计以便手算（最优解 <code>(0, 2)</code>、最优值 <code>−4</code>）。考核若涉及「判断是否凸」或「做等价变形」，以课堂例题与习题课要求为准。' }
  ]
});
