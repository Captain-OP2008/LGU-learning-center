/* =====================================================================
 * ch05.js · 第 5 章「三角恒等式与解三角形：化简与测量」
 * 职责：把单位圆上的关系变成可运算的恒等式，再用正弦/余弦定理解三角形。
 * 依据：Precalculus 7th Edition 第 6 章（Analytic Trigonometry）。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch05',
  num: '05',
  title: '三角恒等式与解三角形：化简与测量',
  en: 'TRIG IDENTITIES & TRIANGLE SOLVING',
  goals: [
    '从倒数、商数、勾股三组基本恒等式出发，化简任意三角表达式',
    '用和差公式推出倍角与半角公式，并算非特殊角的精确值',
    '按「从复杂的一边开始」的策略写出一段可读的恒等式证明',
    '解三角方程并写出通解，知道 sin/cos 加 2kπ、tan 加 kπ',
    '用正弦定理与余弦定理解三角形，识别 SSA 的两解情形'
  ],
  kp: [
    { id: 'ch05-1', title: '基本恒等式' },
    { id: 'ch05-2', title: '和差公式与倍角公式' },
    { id: 'ch05-3', title: '证明的策略' },
    { id: 'ch05-4', title: '三角方程与通解' },
    { id: 'ch05-5', title: '正弦定理' },
    { id: 'ch05-6', title: '余弦定理与面积' },
    { id: 'ch05-7', title: '测量应用与误差' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '为什么恒等式不是「背多分」', html: '因为真正要用的只有三组基本关系，其余全部可以现场推。会推的人，考场上忘了倍角公式，三十秒就能从和差公式重新写出来；只会背的人，一紧张就把 <code>cos 2θ</code> 的三个版本记混。更重要的是，恒等式训练的是<b>「把式子变形到能算」</b>的能力——这种能力在微积分里求积分时天天要用，比记住任何一个公式都值钱。' },

    { t: 'p', lead: true, html: '这一章分两半。前半是<b>化简</b>：给你一个复杂的三角式子，用恒等式把它变成简单形式，或者证明两个看起来不一样的式子其实相等。后半是<b>测量</b>：给你三角形的一部分边和角，把其余的算出来。两半的共同点是「只允许用已知关系做等价变形」，不允许两边同时平方、同时除以可能为零的量——这些细节决定了答案是否完整。' },

    { t: 'h', lvl: 2, text: '一、基本恒等式', id: 'ch05-1' },

    { t: 'p', html: '所有恒等式的源头是单位圆上的定义。三个倒数关系：<code>csc θ = 1/sin θ</code>、<code>sec θ = 1/cos θ</code>、<code>cot θ = 1/tan θ</code>。两个商数关系：<code>tan θ = sin θ/cos θ</code>、<code>cot θ = cos θ/sin θ</code>。三个勾股关系：<code>sin<sup>2</sup>θ + cos<sup>2</sup>θ = 1</code>、<code>1 + tan<sup>2</sup>θ = sec<sup>2</sup>θ</code>、<code>1 + cot<sup>2</sup>θ = csc<sup>2</sup>θ</code>。后两个由第一个两边分别除以 <code>cos<sup>2</sup></code> 与 <code>sin<sup>2</sup></code> 得到。' },

    { t: 'table', head: ['类型', '恒等式', '什么时候用', '注意'], rows: [
      ['倒数', '<code>csc = 1/sin</code>、<code>sec = 1/cos</code>', '式子里同时出现正割与余弦', '分母不能为零'],
      ['商数', '<code>tan = sin/cos</code>', '把正切换成 sin、cos', '<code>cos θ ≠ 0</code>'],
      ['勾股（正弦型）', '<code>sin<sup>2</sup> + cos<sup>2</sup> = 1</code>', '出现 <code>1 − cos<sup>2</sup></code> 时换成 <code>sin<sup>2</sup></code>', '最常用的一条'],
      ['勾股（正切型）', '<code>1 + tan<sup>2</sup> = sec<sup>2</sup></code>', '出现 <code>sec<sup>2</sup> − 1</code>', '<code>cos θ ≠ 0</code>'],
      ['勾股（余切型）', '<code>1 + cot<sup>2</sup> = csc<sup>2</sup></code>', '出现 <code>csc<sup>2</sup> − 1</code>', '<code>sin θ ≠ 0</code>']
    ], caption: '三组关系共八条，全部可以从单位圆上的一个点和勾股定理推出来' },

    { t: 'p', html: '化简的第一步几乎总是<b>统一成 sin 与 cos</b>。例：化简 <code>sec θ · cos θ + tan θ · cot θ</code>。第一项 <code>(1/cos)·cos = 1</code>；第二项 <code>(sin/cos)·(cos/sin) = 1</code>；总和 2。再如 <code>(1 − cos<sup>2</sup>θ)/sin θ</code>：分子换成 <code>sin<sup>2</sup>θ</code>，约掉一个 <code>sin θ</code>，得 <code>sin θ</code>（<code>sin θ ≠ 0</code>）。两步都用同一招，比套公式快。' },

    { t: 'callout', kind: 'warn', title: '错误说法：sin<sup>2</sup>θ = (sin θ)<sup>2</sup> 可以随便开方', html: '为什么错：开方得到 <code>|sin θ|</code>，不是 <code>sin θ</code>。只有当 θ 的范围使 sin θ ≥ 0 时才能去掉绝对值。正确说法：<code>√(sin<sup>2</sup>θ) = |sin θ|</code>。同理 <code>√(1 − cos<sup>2</sup>θ) = |sin θ|</code>。在解方程时，这个绝对值经常导致漏解或多解，要按象限讨论。' },

    { t: 'h', lvl: 2, text: '二、和差公式与倍角公式', id: 'ch05-2' },

    { t: 'p', html: '四个和差公式是整章的核心，其余公式都是它们的推论：<code>sin(α ± β) = sin α cos β ± cos α sin β</code>、<code>cos(α ± β) = cos α cos β ∓ sin α sin β</code>、<code>tan(α ± β) = (tan α ± tan β)/(1 ∓ tan α tan β)</code>。注意 cos 的符号与括号里相反（加变减），这是最常见的记错点。用 <code>sin(π/2 − θ) = cos θ</code> 可以从 sin 的公式推出 cos 的公式。' },

    { t: 'p', html: '令 <code>β = α</code> 就得到倍角公式：<code>sin 2θ = 2 sin θ cos θ</code>，<code>cos 2θ = cos<sup>2</sup>θ − sin<sup>2</sup>θ = 2cos<sup>2</sup>θ − 1 = 1 − 2sin<sup>2</sup>θ</code>。三个版本用哪个，看题目给了什么：给 <code>cos θ</code> 用第二个，给 <code>sin θ</code> 用第三个。<code>tan 2θ = 2tan θ/(1 − tan<sup>2</sup>θ)</code>。把倍角公式反解，就得到半角（降幂）公式：<code>sin<sup>2</sup>θ = (1 − cos 2θ)/2</code>、<code>cos<sup>2</sup>θ = (1 + cos 2θ)/2</code>。' },

    { t: 'table', head: ['公式', '形式', '典型用途'], rows: [
      ['sin 和角', '<code>sin(α+β) = sinα cosβ + cosα sinβ</code>', '求 sin 75°'],
      ['cos 和角', '<code>cos(α+β) = cosα cosβ − sinα sinβ</code>', '求 cos 15°'],
      ['sin 倍角', '<code>sin 2θ = 2 sinθ cosθ</code>', '已知 sinθ 求 sin 2θ'],
      ['cos 倍角（三版）', '<code>cos<sup>2</sup>−sin<sup>2</sup> = 2cos<sup>2</sup>−1 = 1−2sin<sup>2</sup></code>', '按已知量选版本'],
      ['降幂', '<code>sin<sup>2</sup>θ = (1−cos2θ)/2</code>', '积分里消去平方'],
      ['半角', '<code>tan(θ/2) = sinθ/(1+cosθ)</code>', '求半角的精确值']
    ], caption: '倍角与半角是同一组公式的两个方向，考试里两个方向都会用到' },

    { t: 'p', html: '例：求 <code>sin 75°</code> 的精确值。拆成 <code>45° + 30°</code>：<code>sin(45+30) = sin45 cos30 + cos45 sin30 = (√2/2)(√3/2) + (√2/2)(1/2) = (√6 + √2)/4 ≈ 0.9659</code>。检验：75° 接近 90°，sin 应接近 1，0.966 合理；也可用计算器直接核对。<b>精确值写成根式，近似值放在最后一步</b>，这是本站反复强调的顺序。' },

    { t: 'p', html: '例：已知 <code>sin θ = 3/5</code> 且 θ 在第一象限，求 <code>cos 2θ</code>。因为给了 sin，用第三版：<code>cos 2θ = 1 − 2(9/25) = 1 − 18/25 = 7/25</code>。用第一版核对：<code>cos θ = 4/5</code>，<code>cos<sup>2</sup> − sin<sup>2</sup> = 16/25 − 9/25 = 7/25</code>，一致。这种一题两算的自检，比重新读一遍题有用。' },

    { t: 'h', lvl: 2, text: '三、证明的策略', id: 'ch05-3' },

    { t: 'p', html: '证明恒等式的铁律：<b>只能对一边变形，或者两边各自变形到同一个中间式</b>，绝不能把要证的等式当已知条件，两边同时乘一个式子。一旦两边同时操作，逻辑就变成了「假设它成立，推出它成立」，等于什么都没证。' },

    { t: 'steps', items: [
      { title: '第一步 · 选边', html: '从<b>更复杂</b>的那一边开始。复杂的一边可化简的余地大，简单的一边往往已经是目标形式。' },
      { title: '第二步 · 统一函数', html: '把所有 tan、cot、sec、csc 换成 sin 与 cos。绝大多数恒等式在这一步之后就变得显然。' },
      { title: '第三步 · 找结构', html: '看有没有平方差、完全平方、公因式。例如 <code>1 − cos<sup>2</sup>θ</code> 换成 <code>sin<sup>2</sup>θ</code>，<code>sec<sup>2</sup>θ − 1</code> 换成 <code>tan<sup>2</sup>θ</code>。' },
      { title: '第四步 · 写成链条', html: '每一步单独一行，等号右边注明用了哪条恒等式。证明的可读性比技巧重要：老师看得懂，你自己复查也快。' }
    ] },

    { t: 'p', html: '例：证明 <code>(1 − cos<sup>2</sup>θ)/sin θ = sin θ</code>（<code>sin θ ≠ 0</code>）。左边 = <code>sin<sup>2</sup>θ / sin θ</code>（用勾股恒等式）= <code>sin θ</code>（约分）。一行完成。再如证明 <code>tan θ + cot θ = sec θ csc θ</code>：左边 = <code>sin/cos + cos/sin</code> = <code>(sin<sup>2</sup> + cos<sup>2</sup>)/(sin cos)</code> = <code>1/(sin cos)</code> = <code>sec θ csc θ</code>。通分是关键的一步，而通分的动机来自「两个分式相加」。' },

    { t: 'compare', left: { title: '可以做的变形', html: '用已知恒等式替换（<code>sin<sup>2</sup> + cos<sup>2</sup> = 1</code>）；通分、约分（分母不为零）；分子分母同乘一个非零式子；把 tan 写成 sin/cos。每一步都是<b>等价</b>的。' }, right: { title: '不能做的操作', html: '把待证等式两边同时乘除同一个含变量的式子（可能引入零因子，且逻辑上是循环论证）；两边同时平方（会引入增根）；只对一边的某一项操作而改变整体值。证明是变形，不是解方程。' } },

    { t: 'h', lvl: 2, text: '四、三角方程与通解', id: 'ch05-4' },

    { t: 'p', html: '三角方程与恒等式的区别是：恒等式对一切 θ 成立，方程只对某些 θ 成立。解方程的目标是<b>写出全部解</b>，所以必须加周期。基本规则：<code>sin θ = k</code> 与 <code>cos θ = k</code> 的解加 <code>2kπ</code>（<code>k</code> 为整数）；<code>tan θ = k</code> 的解加 <code>kπ</code>。若题目限定区间，再从中筛出落在区间内的那些。' },

    { t: 'p', html: '例：解 <code>2sin<sup>2</sup>x − sin x − 1 = 0</code>。把 <code>sin x</code> 看成 <code>u</code>：<code>2u<sup>2</sup> − u − 1 = 0</code>，因式分解 <code>(2u + 1)(u − 1) = 0</code>，得 <code>u = −1/2</code> 或 <code>u = 1</code>。于是 <code>sin x = −1/2</code> 或 <code>sin x = 1</code>。<code>sin x = −1/2</code> 的两个基本解是 <code>7π/6</code> 与 <code>11π/6</code>；<code>sin x = 1</code> 的基本解是 <code>π/2</code>。通解写全：<code>x = 7π/6 + 2kπ</code>、<code>x = 11π/6 + 2kπ</code>、<code>x = π/2 + 2kπ</code>。' },

    { t: 'table', head: ['方程形式', '解法', '解的个数（一个周期内）', '常见漏解'], rows: [
      ['<code>sin x = k</code>，|k| &lt; 1', '参考角 + 两个象限', '2', '只写一个象限'],
      ['<code>cos x = k</code>，|k| &lt; 1', '参考角 + 两个象限', '2', '忘记负半轴那一个'],
      ['<code>tan x = k</code>', '一个解 + kπ', '1', '误加 2kπ'],
      ['<code>sin 2x = k</code>', '先解 2x，再除以 2', '4', '忘记把周期也除以 2'],
      ['二次型（换元）', '因式分解或求根公式', '视因式而定', '约掉含 x 的因子']
    ], caption: '「一个周期内几个解」是检查答案是否完整的快速标准' },

    { t: 'p', html: '最后一行值得展开：解 <code>sin x · cos x = 0</code> 时，千万不能两边除以 <code>cos x</code>，那会丢掉 <code>cos x = 0</code> 的全部解。正确做法是分别令每个因子为零：<code>sin x = 0</code> 给 <code>x = kπ</code>，<code>cos x = 0</code> 给 <code>x = π/2 + kπ</code>。<b>解方程时「除以含未知数的因子」几乎总是丢解的同义词</b>，这一条在微积分里同样适用。' },

    { t: 'h', lvl: 2, text: '五、正弦定理', id: 'ch05-5' },

    { t: 'p', html: '在任意三角形中，<code>a/sin A = b/sin B = c/sin C = 2R</code>，其中 <code>a</code> 是角 <code>A</code> 的对边，<code>R</code> 是外接圆半径。正弦定理的适用场景是<b>已知两角一边</b>（AAS 或 ASA），或者<b>已知两边与其中一边的对角</b>（SSA）。它的本质是「边与对角的正弦成比例」，所以大边对大角，大角对大边。' },

    { t: 'p', html: '例（AAS）：<code>A = 30°</code>、<code>B = 45°</code>、<code>a = 10</code>，求 <code>b</code>。由 <code>a/sin A = b/sin B</code> 得 <code>b = 10 · sin45°/sin30° = 10 · (√2/2)/(1/2) = 10√2 ≈ 14.14</code>。检验：B 比 A 大，b 应比 a 大，14.14 &gt; 10，合理。第三个角 <code>C = 105°</code>，再用一次正弦定理求 <code>c</code>，三角形就解完了。' },

    { t: 'p', html: 'SSA 是唯一可能<b>两解</b>的情形，也叫「模糊情形」。例：<code>a = 10</code>、<code>b = 12</code>、<code>A = 30°</code>。由正弦定理 <code>sin B = b sin A / a = 12 × 0.5/10 = 0.6</code>，所以 <code>B ≈ 36.87°</code> 或 <code>B ≈ 143.13°</code>。两个 B 都满足「三角形内角和小于 180°」吗？第一个：<code>C = 180 − 30 − 36.87 = 113.13°</code>，可以；第二个：<code>C = 180 − 30 − 143.13 = 6.87°</code>，也可以。<b>两个三角形都合法</b>，答案必须写两组。' },

    { t: 'callout', kind: 'tip', title: 'SSA 判断口诀', html: '设已知 <code>a</code>、<code>b</code> 与 <code>A</code>。<b>a &lt; b sin A</b>：无解（够不着）；<b>a = b sin A</b>：一解（相切）；<b>b sin A &lt; a &lt; b</b>：两解（摆动有两个位置）；<b>a ≥ b</b>：一解。这个判断来自「以 a 为半径画弧与另一边有几个交点」，画一次图就记住了，不必背。' },

    { t: 'h', lvl: 2, text: '六、余弦定理与面积', id: 'ch05-6' },

    { t: 'p', html: '余弦定理：<code>a<sup>2</sup> = b<sup>2</sup> + c<sup>2</sup> − 2bc cos A</code>，另外两个角轮换。它是勾股定理的推广：当 <code>A = 90°</code> 时 <code>cos A = 0</code>，退化成 <code>a<sup>2</sup> = b<sup>2</sup> + c<sup>2</sup></code>。适用场景是<b>已知两边及夹角</b>（SAS）求第三边，或<b>已知三边</b>（SSS）求角。' },

    { t: 'p', html: '例（SAS）：<code>b = 8</code>、<code>c = 7</code>、<code>A = 60°</code>，求 <code>a</code>。<code>a<sup>2</sup> = 64 + 49 − 2 × 56 × 0.5 = 113 − 56 = 57</code>，<code>a ≈ 7.55</code>。例（SSS）：三边 <code>7, 8, 9</code>，求最大角（对 9）。<code>cos C = (49 + 64 − 81)/(2 × 7 × 8) = 32/112 = 2/7</code>，<code>C ≈ 73.4°</code>。检验：最大边对最大角，73.4° 是三个角里最大的，合理。' },

    { t: 'p', html: '面积公式：<code>S = ½ab sin C</code>（两边及其夹角）。已知三边时用海伦公式：<code>s = (a+b+c)/2</code>，<code>S = √(s(s−a)(s−b)(s−c))</code>。例：<code>b = 8</code>、<code>c = 7</code>、<code>A = 60°</code>，<code>S = ½ × 8 × 7 × sin60° = 28 × √3/2 = 14√3 ≈ 24.25</code>。用海伦公式核对：三边 7.55、8、7，<code>s ≈ 11.28</code>，<code>S ≈ √(11.28 × 3.73 × 3.28 × 4.28) ≈ 24.2</code>，一致。' },

    { t: 'table', head: ['已知条件', '用哪个定理', '求什么', '解的个数'], rows: [
      ['两角一边（AAS/ASA）', '正弦定理', '其余两边', '唯一'],
      ['两边及夹角（SAS）', '余弦定理', '第三边，再求角', '唯一'],
      ['三边（SSS）', '余弦定理', '三个角', '唯一'],
      ['两边及一边对角（SSA）', '正弦定理', '另一个角', '0、1 或 2'],
      ['直角三角形', '勾股 + 基本三角比', '任意边角', '唯一']
    ], caption: '先判断属于哪一类，再选定理；选错定理会绕远路甚至算不出来' },

    { t: 'h', lvl: 2, text: '七、测量应用与误差', id: 'ch05-7' },

    { t: 'p', html: '解三角形的应用题几乎都是「测量不可直接到达的距离或高度」：测楼高、测河宽、测山高、定位船只。套路固定：<b>画图 → 标已知 → 找三角形 → 选定理 → 算 → 检查合理性</b>。图一定要画，而且要标清哪个角是仰角、哪个是俯角。' },

    { t: 'p', html: '例：在平地一点测得塔顶仰角 30°，向塔走 50 米后再测仰角 45°，求塔高。设塔高 <code>h</code>，第一次测点距塔底 <code>d</code>，则 <code>h = d tan30°</code>，第二次 <code>h = (d − 50) tan45° = d − 50</code>。联立：<code>d/√3 = d − 50</code>，<code>d(1 − 1/√3) = 50</code>，<code>d ≈ 118.3</code>，<code>h ≈ 68.3</code> 米。检验：45° 时距离等于高度，118.3 − 50 = 68.3，一致。' },

    { t: 'p', html: '误差也值得说一句。测量角度的误差会被放大：用 <code>h = d tan θ</code> 时，<code>θ</code> 接近 90° 会让 <code>tan θ</code> 急剧增大，一点点角度误差就导致高度差很多。所以实际测量中，测点要选得让仰角在 30°–60° 之间，这是工程上的经验，也是数学上「导数大则敏感」的直观版本。' },

    { t: 'terms', items: [
      { en: 'identity', zh: '恒等式', html: '对定义域内一切变量都成立的等式；证明时只能对一边变形。' },
      { en: 'double-angle formula', zh: '倍角公式', html: 'sin2θ = 2sinθcosθ；cos2θ 有三个等价版本，按已知量选。' },
      { en: 'general solution', zh: '通解', html: '把基本解加上周期得到的全部解；sin/cos 加 2kπ，tan 加 kπ。' },
      { en: 'law of sines', zh: '正弦定理', html: 'a/sinA = b/sinB = c/sinC = 2R；适用于两角一边与 SSA。' },
      { en: 'law of cosines', zh: '余弦定理', html: 'a² = b² + c² − 2bc cosA；适用于 SAS 与 SSS，是勾股定理的推广。' },
      { en: 'ambiguous case', zh: '模糊情形', html: 'SSA 条件下可能有两个不同三角形，必须按 b sinA 与 a、b 的大小关系判断。' }
    ] },

    { t: 'quiz', qid: 'ch05-q1' },
    { t: 'quiz', qid: 'ch05-q2' },
    { t: 'quiz', qid: 'ch05-q3' },

    { t: 'keypoint', items: [
      { title: '八条基本恒等式是全部源头', html: '倒数三条、商数两条、勾股三条；其余公式都能从它们与和差公式推出。' },
      { title: 'cos 的和角公式符号相反', html: 'sin(α+β) 中间是加，cos(α+β) 中间是减；这是最常见的记错点。' },
      { title: '证明只动一边', html: '从复杂的一边开始，统一成 sin/cos，找平方差与公因式。' },
      { title: '三角方程必须写通解', html: 'sin/cos 加 2kπ，tan 加 kπ；限定区间时再筛。' },
      { title: 'SSA 可能有两解', html: '按 b sinA 与 a、b 的大小关系判断 0、1 或 2 个三角形。' }
    ] },

    { t: 'checklist', id: 'ch05', items: [
      '我能从 sin<sup>2</sup>θ + cos<sup>2</sup>θ = 1 推出另外两条勾股恒等式',
      '我能算出 sin75° 与 cos15° 的精确值，并说明用了哪条公式',
      '我能由 sinθ = 3/5 且 θ 在第一象限求出 cos2θ，并用两种版本核对',
      '我能独立证明 tanθ + cotθ = secθ cscθ，且每一步只动一边',
      '我能解 2sin<sup>2</sup>x − sinx − 1 = 0 并写出通解',
      '我能说出 sinx = 1/2 与 tanx = 1 的通解周期为什么不同',
      '我能用正弦定理由两角一边求出其余边，并检查大边对大角',
      '我能判断 a = 10、b = 12、A = 30° 有几个三角形，并算出两组解',
      '我能用余弦定理由三边求最大角，并说明为什么最大角对最大边'
    ] },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章对应 Precalculus 7th Edition 第 6 章：基本恒等式、和差与倍角公式、恒等式证明、三角方程与通解、正弦定理、余弦定理、三角形面积与测量应用。教材中关于积化和差、和差化积的公式只作为推导练习提及，本章不要求背诵；反三角函数留到微积分中讲导数时再展开。测量例子的数值为教学设定，用于说明「画图 → 选定理 → 检验」的流程，不代表具体工程测量结果。' }
  ]
});
