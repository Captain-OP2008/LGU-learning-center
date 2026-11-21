/* =====================================================================
 * ch04.js · 第 4 章「参数曲线与极坐标」
 * 教材对应：Thomas 第 11 章（11.1–11.5）：参数方程、参数曲线微积分、
 * 极坐标、极坐标图形、极坐标下的面积与长度。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch04',
  num: '04',
  title: '参数曲线与极坐标',
  en: 'PARAMETRIC CURVES AND POLAR COORDINATES',
  goals: [
    '把同一条曲线在直角方程、参数方程、极坐标方程之间来回改写',
    '用 <code>dy/dx = (dy/dt)/(dx/dt)</code> 求参数曲线的切线，并处理竖直切线',
    '用 <code>∫√((dx/dt)<sup>2</sup> + (dy/dt)<sup>2</sup>) dt</code> 算弧长',
    '解释极坐标面积公式里 <code>1/2</code> 与 <code>r<sup>2</sup></code> 的来源',
    '根据图形的对称性与周期确定极坐标积分的上下限'
  ],
  kp: [
    { id: 'ch04-1', title: '参数方程与曲线' },
    { id: 'ch04-2', title: '参数曲线的斜率、弧长与面积' },
    { id: 'ch04-3', title: '极坐标的定义与转换' },
    { id: 'ch04-4', title: '常见极坐标曲线与对称性' },
    { id: 'ch04-5', title: '极坐标面积' },
    { id: 'ch04-6', title: '极坐标弧长与切线' },
    { id: 'ch04-7', title: '坐标系的选择与常见错误' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '为什么先学曲线再学空间', html: 'ch05 的空间曲线是本章的直接升级：把 <code>(x(t), y(t))</code> 换成 <code>(x(t), y(t), z(t))</code>，把弧长、切线、曲率整套搬过去。而 ch07 的多重积分要用本章的极坐标：二重积分换极坐标时出现的 <code>r dr dθ</code>，就是本章面积元 <code>1/2 r<sup>2</sup> dθ</code> 的微分版本。所以本章不是「几何欣赏」，而是后面两章的工具库。更实际地说：很多直角坐标下积不出来的积分（如 <code>∫e<sup>−x<sup>2</sup></sup>dx</code> 的二维版本），换成极坐标就变成初等积分。' },

    { t: 'p', lead: true, html: '本章讲两种「换描述」的技术。<b>参数化</b>把曲线看成质点运动的轨迹：位置是时间 t 的函数，于是切线是速度方向、弧长是路程。<b>极坐标</b>把定位方式从「横纵坐标」换成「距离与角度」，于是圆、螺线、花瓣这类图形有极简的方程。两种技术都遵循同一条原则：<b>不要改变曲线本身，只改变描述它的字母</b>。做题时先问「哪种描述让积分更简单」，再动手。' },

    { t: 'h', lvl: 2, text: '一、参数方程与曲线', id: 'ch04-1' },

    { t: 'p', html: '<b>参数方程</b>是 <code>x = f(t), y = g(t)</code>（<code>t ∈ I</code>）。每给一个 t，就得到一个点；t 扫过区间，点就画出曲线。<code>t</code> 叫参数，物理上常是时间。与直角方程 <code>y = F(x)</code> 相比，参数方程能描述<b>多值</b>曲线：圆 <code>x<sup>2</sup> + y<sup>2</sup> = 1</code> 不能写成单个 <code>y = F(x)</code>，但可以写成 <code>x = cos t, y = sin t</code>，<code>t ∈ [0, 2π]</code>。' },

    { t: 'p', html: '参数化不唯一，这是本章最重要的观念。同一条线段可以写成 <code>(t, 2t)</code>、<code>(2t, 4t)</code>、<code>(sin t, 2 sin t)</code>，甚至 <code>(t<sup>3</sup>, 2t<sup>3</sup>)</code>。它们描述的是同一个点集，但「速度」不同：<code>(2t, 4t)</code> 走得比 <code>(t, 2t)</code> 快一倍。凡是与参数化无关的量（弧长、面积、曲率）必须对任何参数化给出同一个答案，这是检验公式是否写对的好办法；而与参数化有关的量（速度、加速度）则依赖具体写法。' },

    { t: 'p', html: '消去参数是常见要求：由 <code>x = f(t)</code> 解出 <code>t = f<sup>−1</sup>(x)</code> 再代入，或利用恒等式（如 <code>cos<sup>2</sup> + sin<sup>2</sup> = 1</code>、<code>cosh<sup>2</sup> − sinh<sup>2</sup> = 1</code>）。但要小心：消参可能丢失信息。圆 <code>x = cos t, y = sin t</code> 消参得 <code>x<sup>2</sup> + y<sup>2</sup> = 1</code>，曲线一样，但「t 从 0 到 π/2 走四分之一圆」这个信息丢了。反过来，<code>x = t<sup>2</sup>, y = t</code> 消参得 <code>x = y<sup>2</sup></code>，这是一条抛物线，但 t 的取值限制了只走一半。' },

    { t: 'table', head: ['曲线', '参数方程', '参数范围', '直角方程'], rows: [
      ['圆', '<code>(cos t, sin t)</code>', '<code>[0, 2π]</code>', '<code>x<sup>2</sup> + y<sup>2</sup> = 1</code>'],
      ['椭圆', '<code>(a cos t, b sin t)</code>', '<code>[0, 2π]</code>', '<code>x<sup>2</sup>/a<sup>2</sup> + y<sup>2</sup>/b<sup>2</sup> = 1</code>'],
      ['抛物线', '<code>(t, t<sup>2</sup>)</code>', '<code>(−∞, ∞)</code>', '<code>y = x<sup>2</sup></code>'],
      ['摆线', '<code>(t − sin t, 1 − cos t)</code>', '<code>[0, 2π]</code>', '无初等直角方程'],
      ['心形线', '<code>(a(1−cos t)cos t, a(1−cos t)sin t)</code>', '<code>[0, 2π]</code>', '极坐标下 <code>r = a(1 − cos θ)</code>'],
      ['螺线', '<code>(t cos t, t sin t)</code>', '<code>[0, 4π]</code>', '极坐标下 <code>r = θ</code>']
    ], caption: '摆线与心形线说明参数/极坐标的价值：它们的直角方程要么不存在，要么极其难看' },

    { t: 'p', html: '有些曲线用直角坐标根本写不出简洁方程，但用参数或极坐标只有一行。摆线是圆沿直线滚动时圆周上一点的轨迹，物理里是「最速降线」问题的答案；心形线是圆外一点绕等圆滚动的轨迹。它们的存在提醒你：<b>不要默认「曲线 = y 是 x 的函数」</b>，这个假设会让一大类问题无解。' },

    { t: 'h', lvl: 2, text: '二、参数曲线的斜率、弧长与面积', id: 'ch04-2' },

    { t: 'p', html: '斜率由链式法则给出：<code>dy/dx = (dy/dt)/(dx/dt)</code>，条件是 <code>dx/dt ≠ 0</code>。<b>当 <code>dx/dt = 0</code> 而 <code>dy/dt ≠ 0</code> 时切线竖直</b>，此时 <code>dy/dx</code> 无穷大，不能写成分数；<b>当两者同时为 0</b> 时，该点是奇点，需要单独分析（可能尖点、可能光滑）。二阶导数不是简单地对 <code>dy/dx</code> 再除一次，而是 <code>d<sup>2</sup>y/dx<sup>2</sup> = (d/dt)(dy/dx) ÷ (dx/dt)</code>，因为要对 x 求导，必须再乘 <code>dt/dx</code>。' },

    { t: 'p', html: '弧长公式来自「用折线逼近」：小段位移是 <code>(dx/dt, dy/dt)Δt</code>，长度是 <code>√((dx/dt)<sup>2</sup> + (dy/dt)<sup>2</sup>)Δt</code>，求和取极限得 <code>L = ∫<sub>α</sub><sup>β</sup> √((dx/dt)<sup>2</sup> + (dy/dt)<sup>2</sup>) dt</code>。这个量对参数化不变：把 t 换成 <code>2s</code>，导数翻倍、dt 减半，乘积不变。这也是检验公式的记忆法：<b>被积式必须是「速度的模」</b>。' },

    { t: 'p', html: '参数曲线的面积要小心使用 <code>∫y dx</code>。若曲线从 <code>t = α</code> 到 <code>β</code> 描绘出一条封闭曲线且不自身相交，则面积 <code>A = ∫<sub>α</sub><sup>β</sup> y(t)x′(t) dt</code>；但若曲线回头，<code>∫y dx</code> 会带符号地重复计算。更稳妥的公式是<b>扇形公式</b> <code>A = 1/2 ∮(x dy − y dx)</code>，它对任何简单闭曲线都给出正面积（逆时针），在 ch07 的格林定理里会再次遇到。' },

    { t: 'callout', kind: 'warn', title: '三个容易掉的坑', html: '<b>一、</b>竖直切线不能写成 <code>dy/dx = ∞</code> 就完事，要写「<code>dx/dt = 0</code> 且 <code>dy/dt ≠ 0</code>，切线为 <code>x = x(t<sub>0</sub>)</code>」。<br><b>二、</b>二阶导公式漏掉最后的 <code>÷(dx/dt)</code>，得到的是 <code>d/dt(dy/dx)</code> 而不是 <code>d<sup>2</sup>y/dx<sup>2</sup></code>。<br><b>三、</b>弧长积分不要忘了根号里的平方，写成 <code>∫(dx/dt + dy/dt)dt</code> 是最常见的错误。' },

    { t: 'h', lvl: 2, text: '三、极坐标的定义与转换', id: 'ch04-3' },

    { t: 'p', html: '极坐标用 <code>(r, θ)</code> 定位：<code>θ</code> 是从正 x 轴逆时针量的角，<code>r</code> 是到原点的有向距离。转换公式是 <code>x = r cos θ</code>、<code>y = r sin θ</code>，反过来 <code>r<sup>2</sup> = x<sup>2</sup> + y<sup>2</sup></code>、<code>tan θ = y/x</code>（注意象限）。与直角坐标最大的不同是<b>表示不唯一</b>：<code>(r, θ)</code>、<code>(r, θ + 2π)</code>、<code>(−r, θ + π)</code> 是同一个点。做题时必须利用这一点来对齐上下限。' },

    { t: 'p', html: '负半径的约定常被误解。<code>r &lt; 0</code> 时不表示「距离为负」，而是「在 <code>θ + π</code> 方向上取 <code>|r|</code>」。例如 <code>r = −1, θ = 0</code> 对应点 <code>(−1, 0)</code>，与 <code>r = 1, θ = π</code> 相同。这个约定让 <code>r = 1 + cos θ</code> 这类方程在 <code>θ ∈ [0, 2π]</code> 上自动画出完整图形，不必分段。但积分时要注意：<code>r<sup>2</sup></code> 永远非负，所以 <code>r</code> 的符号不影响面积公式，只影响曲线经过的象限。' },

    { t: 'p', html: '极坐标方程与直角方程的互化，靠三个替换：<code>x = r cos θ</code>、<code>y = r sin θ</code>、<code>r<sup>2</sup> = x<sup>2</sup> + y<sup>2</sup></code>。例：<code>r = 2 cos θ</code> 两边乘 r 得 <code>r<sup>2</sup> = 2r cos θ</code>，即 <code>x<sup>2</sup> + y<sup>2</sup> = 2x</code>，配方得 <code>(x − 1)<sup>2</sup> + y<sup>2</sup> = 1</code>，是以 <code>(1, 0)</code> 为心、半径 1 的圆。这一步「乘 r」是关键技巧，因为它把 <code>r</code> 与 <code>r cos θ</code> 同时变成直角坐标里的量。' },

    { t: 'table', head: ['极坐标方程', '图形', '直角方程', '备注'], rows: [
      ['<code>r = a</code>', '以原点为心的圆', '<code>x<sup>2</sup> + y<sup>2</sup> = a<sup>2</sup></code>', '半径 a'],
      ['<code>θ = α</code>', '过原点的直线', '<code>y = (tan α)x</code>', 'α 为倾斜角'],
      ['<code>r = 2a cos θ</code>', '过原点、心在 x 轴上的圆', '<code>(x − a)<sup>2</sup> + y<sup>2</sup> = a<sup>2</sup></code>', '乘 r 后配方'],
      ['<code>r = 2a sin θ</code>', '过原点、心在 y 轴上的圆', '<code>x<sup>2</sup> + (y − a)<sup>2</sup> = a<sup>2</sup></code>', '同上'],
      ['<code>r = a(1 + cos θ)</code>', '心形线', '四次方程，不简洁', '对称于极轴'],
      ['<code>r = a cos 2θ</code>', '四瓣玫瑰线', '—', '周期 π，四瓣'],
      ['<code>r = e<sup>θ</sup></code>', '对数螺线', '—', '<code>θ</code> 增大时越绕越远']
    ], caption: '「乘 r 再配方」是极坐标转直角的万能第一步；反过来则用三个替换式' },

    { t: 'h', lvl: 2, text: '四、常见极坐标曲线与对称性', id: 'ch04-4' },

    { t: 'p', html: '画极坐标图形，先看对称性，能把工作量减半。三条判据：<b>（1）关于极轴（x 轴）对称</b>，若把 <code>θ</code> 换成 <code>−θ</code> 方程不变；<b>（2）关于 <code>θ = π/2</code>（y 轴）对称</b>，若把 <code>θ</code> 换成 <code>π − θ</code> 方程不变；<b>（3）关于原点对称</b>，若把 <code>r</code> 换成 <code>−r</code>（或 <code>θ</code> 换成 <code>θ + π</code>）方程不变。注意这些判据是充分不必要：方程变了形但图形仍可能对称。' },

    { t: 'p', html: '第二个要点是<b>周期与花瓣数</b>。<code>r = a cos nθ</code> 与 <code>r = a sin nθ</code> 叫玫瑰线：n 为奇数时有 n 瓣，n 为偶数时有 2n 瓣。原因是 <code>cos nθ</code> 的周期是 <code>2π/n</code>，但极坐标下 <code>θ</code> 增加 <code>π</code> 会让 <code>r</code> 变号，等价于把点反射到对面，于是「半周期」就画完一遍。n 为偶数时半周期恰好是 <code>π/n</code>，画出的瓣数翻倍；n 为奇数时半周期与整周期画的瓣重合。' },

    { t: 'p', html: '第三个要点是<b>描点顺序</b>。极坐标图形常常在原点附近反复穿越，手工描点时按 <code>θ</code> 递增列一张表：<code>θ = 0, π/6, π/4, π/3, π/2, …</code>，算出 r，标点，再连成光滑曲线。遇到 <code>r = 0</code> 的 θ 值要特别标出，那是曲线经过原点（「花瓣的尖端」）。若 <code>r</code> 在某个区间为负，曲线会出现在与 θ 相反的方向，别以为是算错了。' },

    { t: 'compare', left: { title: '直角坐标擅长的', html: '直线、抛物线、椭圆（标准位置）、双曲线。方程是多项式，求交点、求切线都直接。积分区域是「上下两条曲线夹一条竖带」时最方便。' }, right: { title: '极坐标擅长的', html: '过原点的圆、以原点为心的圆、螺线、玫瑰线、心形线。方程只含 <code>r</code> 与 <code>θ</code>，面积与弧长积分往往能化成单变量。区域是「两条射线夹一段曲线」时最方便。' } },

    { t: 'h', lvl: 2, text: '五、极坐标面积', id: 'ch04-5' },

    { t: 'p', html: '把区域切成许多小扇形：每个扇形半径约 <code>r(θ)</code>、圆心角 <code>Δθ</code>，面积约 <code>1/2 r<sup>2</sup> Δθ</code>（因为整圆面积 <code>πr<sup>2</sup></code> 对应 <code>2π</code> 弧度，比例是 <code>Δθ/2π</code>）。求和取极限得 <b><code>A = ∫<sub>α</sub><sup>β</sup> 1/2 r(θ)<sup>2</sup> dθ</code></b>。这个公式里的 <code>1/2</code> 与 <code>r<sup>2</sup></code> 都不是人为加的，而是扇形面积公式的直接结果——这也是它和直角坐标 <code>∫y dx</code> 长得完全不同的原因。' },

    { t: 'p', html: '例：求 <code>r = 2 cos θ</code> 围成的面积。这是半径 1 的圆，面积应为 <code>π</code>。用公式：<code>A = 1/2 ∫<sub>−π/2</sub><sup>π/2</sup> 4cos<sup>2</sup>θ dθ = 2∫<sub>−π/2</sub><sup>π/2</sup> (1 + cos 2θ)/2 dθ = [θ + sin 2θ/2]<sub>−π/2</sub><sup>π/2</sup> = π</code>。上下限取 <code>[−π/2, π/2]</code> 是因为在这个区间内 <code>r ≥ 0</code>，曲线正好画出一整圈；若取 <code>[0, 2π]</code> 会重复画两遍，面积算成 <code>2π</code>。' },

    { t: 'p', html: '上下限的选择是极坐标面积题的最大失分点，有三条规则：<b>（1）</b>找 <code>r = 0</code> 的 θ 值，它们通常是曲线的起止点；<b>（2）</b>利用对称性，只算一半再乘 2（但乘之前确认另一半面积相等）；<b>（3）</b>两曲线围成的区域，先求交点 <code>r<sub>1</sub>(θ) = r<sub>2</sub>(θ)</code> 得到分界角，再分段积分，每段用「外曲线平方减内曲线平方」。' },

    { t: 'table', head: ['区域', '积分式', '易错点'], rows: [
      ['<code>r = f(θ)</code> 从 α 到 β 扫过的扇形', '<code>1/2∫<sub>α</sub><sup>β</sup> f<sup>2</sup> dθ</code>', '区间必须只扫一遍'],
      ['两曲线之间的区域', '<code>1/2∫(f<sub>外</sub><sup>2</sup> − f<sub>内</sub><sup>2</sup>) dθ</code>', '先求交点定分段'],
      ['含原点的花瓣', '<code>1/2∫<sub>−π/4</sub><sup>π/4</sup> a<sup>2</sup>cos<sup>2</sup>2θ dθ</code>', '周期与瓣数对应'],
      ['圆 <code>r = 2a cos θ</code> 内部', '<code>1/2∫<sub>−π/2</sub><sup>π/2</sup> 4a<sup>2</sup>cos<sup>2</sup>θ dθ</code>', '上限不是 2π']
    ], caption: '「只扫一遍」是极坐标面积的第一原则：多扫一圈面积就翻倍' },

    { t: 'callout', kind: 'tip', title: '对称性省一半计算', html: '若图形关于极轴对称，可只算 <code>[0, π]</code> 上半部分再乘 2；若同时关于两条轴对称，只算第一象限再乘 4。但要注意：<b>对称性只对「整个区域」成立时才可用</b>。如果区域只是花瓣的一部分，乘 2 会算多。判断方法是画图，或在 <code>θ</code> 与 <code>−θ</code> 处各取一点验证 <code>r</code> 相同。' },

    { t: 'h', lvl: 2, text: '六、极坐标弧长与切线', id: 'ch04-6' },

    { t: 'p', html: '把极坐标看成参数方程 <code>x = r(θ)cos θ</code>、<code>y = r(θ)sin θ</code>，对 θ 求导得 <code>x′ = r′cos θ − r sin θ</code>、<code>y′ = r′sin θ + r cos θ</code>。平方相加，交叉项抵消，利用 <code>cos<sup>2</sup> + sin<sup>2</sup> = 1</code>，得 <code>(x′)<sup>2</sup> + (y′)<sup>2</sup> = (r′)<sup>2</sup> + r<sup>2</sup></code>。于是<b>弧长 <code>L = ∫<sub>α</sub><sup>β</sup> √(r<sup>2</sup> + (dr/dθ)<sup>2</sup>) dθ</code></b>。' },

    { t: 'p', html: '这个公式很好记：它是「半径方向的变化率 <code>r′</code>」与「切向的变化率 <code>r</code>」的平方和，正好是极坐标下的勾股定理。检验方法：取 <code>r = a</code>（圆），<code>r′ = 0</code>，得 <code>L = ∫<sub>0</sub><sup>2π</sup> a dθ = 2πa</code>，正确。取 <code>r = θ</code>（阿基米德螺线），<code>L = ∫√(θ<sup>2</sup> + 1) dθ</code>，这个积分要用 <code>θ = sinh u</code> 换元，结果含 <code>ln</code>，教材上作为公式给出。' },

    { t: 'p', html: '切线斜率仍用 <code>dy/dx = y′/x′</code>，其中 <code>x′, y′</code> 是对 θ 的导数。竖直切线出现在 <code>x′ = 0</code> 且 <code>y′ ≠ 0</code>；水平切线出现在 <code>y′ = 0</code> 且 <code>x′ ≠ 0</code>。例：心形线 <code>r = 1 + cos θ</code> 在 <code>θ = π</code> 处 <code>r = 0</code>，曲线经过原点，此处切线是 <code>y = 0</code>（极轴），这是一个尖点，不是光滑点。这类「尖点」在极坐标里很常见，求切线要单独算极限。' },

    { t: 'callout', kind: 'exam', title: '本章题型的标准套路', html: '<b>求面积：</b>画图 → 定上下限（找 <code>r = 0</code> 与交点）→ 套 <code>1/2∫r<sup>2</sup></code> → 用 <code>cos<sup>2</sup> = (1 + cos 2θ)/2</code> 降幂。<br><b>求弧长：</b>算 <code>r′</code> → 套 <code>∫√(r<sup>2</sup> + r′<sup>2</sup>)</code> → 化简根号 → 积分。<br><b>求切线：</b>算 <code>x′, y′</code> → 判断分母是否为零 → 写点斜式或 <code>x = 常数</code>。<br><b>转换：</b>极转直用 <code>r<sup>2</sup> = x<sup>2</sup> + y<sup>2</sup></code> 并「乘 r」；直转极用 <code>x = r cos θ</code> 代入。' },

    { t: 'h', lvl: 2, text: '七、坐标系的选择与常见错误', id: 'ch04-7' },

    { t: 'p', html: '做题时先花 30 秒判断用哪种坐标，比埋头算更省时间。判据只有一条：<b>看区域边界与函数的「自然形状」</b>。边界是圆、扇形、花瓣 → 极坐标；边界是直线、抛物线 → 直角坐标；曲线是运动轨迹、有明确的时间或角度参数 → 参数方程。三种描述可以互相转换，选错不会做错，但可能把一个两行积分变成两页计算。' },

    { t: 'p', html: '参数化还有一个隐藏要求：<b>分段光滑且不自身相交</b>（简单曲线）。若曲线自身相交，弧长公式仍然对（它算的是总路程），但面积公式会重复计算交叉部分。摆线一拱的面积、心形线的面积都是简单闭曲线，可以直接套公式；而玫瑰线 <code>r = a cos 2θ</code> 在原点自交，求「一瓣面积」必须把 θ 限制在单瓣区间，不能对整个周期积分。' },

    { t: 'table', head: ['症状', '可能的错误', '修正'], rows: [
      ['面积算成两倍', '区间扫了两遍', '找 <code>r = 0</code> 或利用对称性缩小区间'],
      ['弧长为负或为零', '根号里写成 <code>r<sup>2</sup> − r′<sup>2</sup></code>', '应为 <code>r<sup>2</sup> + r′<sup>2</sup></code>'],
      ['切线斜率算不出', '<code>x′ = 0</code> 时仍用 <code>y′/x′</code>', '改判竖直切线'],
      ['参数化后图形不全', 't 的范围没覆盖整条曲线', '检查 t 的周期与端点'],
      ['极坐标转直角后多一个 r', '忘记「乘 r」', '两边乘 r 再代换'],
      ['交点只找到一个', '忽略了 <code>(−r, θ+π)</code> 的等价表示', '联立时同时考虑负半径']
    ], caption: '这些症状几乎覆盖了本章作业与考试里的全部扣分点' },

    { t: 'terms', items: [
      { en: 'parametrization', zh: '参数化', html: '用参数 t 表示曲线上的点：<code>(x(t), y(t))</code>；不唯一。' },
      { en: 'arc length', zh: '弧长', html: '<code>∫√((dx/dt)<sup>2</sup> + (dy/dt)<sup>2</sup>) dt</code>；与参数化无关。' },
      { en: 'polar coordinates', zh: '极坐标', html: '用距离 r 与角 θ 定位；<code>x = r cos θ, y = r sin θ</code>。' },
      { en: 'rose curve', zh: '玫瑰线', html: '<code>r = a cos nθ</code>；n 奇 n 瓣，n 偶 2n 瓣。' },
      { en: 'cardioid', zh: '心形线', html: '<code>r = a(1 ± cos θ)</code> 或 <code>a(1 ± sin θ)</code>；过原点的尖点。' },
      { en: 'sector area', zh: '扇形面积', html: '<code>1/2 r<sup>2</sup>Δθ</code>；极坐标面积公式的来源。' },
      { en: 'simple curve', zh: '简单曲线', html: '不自交的曲线；面积公式要求区域由简单闭曲线围成。' }
    ] },

    { t: 'quiz', qid: 'ch04-q1' },
    { t: 'quiz', qid: 'ch04-q2' },
    { t: 'quiz', qid: 'ch04-q3' },

    { t: 'keypoint', items: [
      { title: '参数化不唯一', html: '同一条曲线有无数种参数化；弧长、面积、曲率与参数化无关，速度与加速度有关。' },
      { title: '斜率是比值', html: '<code>dy/dx = (dy/dt)/(dx/dt)</code>；分母为零时是竖直切线，不是「斜率无穷大」的糊弄写法。' },
      { title: '弧长是速度的模', html: '<code>∫|r′(t)| dt</code>；极坐标下化为 <code>∫√(r<sup>2</sup> + r′<sup>2</sup>) dθ</code>。' },
      { title: '极坐标面积多一个 1/2', html: '<code>A = 1/2∫r<sup>2</sup>dθ</code>；来自扇形面积，不是笔误。' },
      { title: '上下限只扫一遍', html: '找 <code>r = 0</code> 与交点定界；扫两遍面积翻倍，是最高频错误。' },
      { title: '极转直先乘 r', html: '<code>r = 2a cos θ</code> 两边乘 r 得 <code>r<sup>2</sup> = 2ar cos θ</code>，再代换配方。' }
    ] },

    { t: 'checklist', id: 'ch04', items: [
      '我能把圆、椭圆、抛物线写成参数方程，并说出参数范围',
      '我能消去参数得到直角方程，并指出消参丢失了哪些信息',
      '我能用 <code>dy/dx = (dy/dt)/(dx/dt)</code> 求切线，并正确处理竖直切线',
      '我能写出参数曲线的弧长公式，并解释它为什么与参数化无关',
      '我能把 <code>r = 2a cos θ</code> 化为直角方程并配方',
      '我能说出玫瑰线 <code>r = a cos nθ</code> 的瓣数与 n 的奇偶关系',
      '我能确定极坐标面积的上下限，并说明为什么不能随便取 <code>[0, 2π]</code>',
      '我能推导极坐标弧长公式 <code>√(r<sup>2</sup> + r′<sup>2</sup>)</code>',
      '我能根据区域形状在直角、参数、极坐标之间做出选择，并说明理由'
    ] },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章对应 Thomas《Calculus》第 13 版 SI 单位第 11.1–11.5 节：参数方程、参数曲线的微积分、极坐标、极坐标图形、极坐标下的面积与长度。按课程大纲，11.6（极坐标下的圆锥曲线）与 11.7（圆锥曲线的应用）跳过，因此本章不讨论离心率、准线、极坐标下的圆锥曲线统一方程。参数曲面的面积也不在本章，留到 ch07 的曲面积分。极坐标面积与弧长公式在 ch07 会以「二重积分换元」的形式再次出现，届时 <code>r dr dθ</code> 与本章的 <code>1/2 r<sup>2</sup> dθ</code> 是同一个几何事实的两种写法。' }
  ]
});
