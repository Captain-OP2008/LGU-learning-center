/* =====================================================================
 * ch06.js · 第 6 章「动量与转动：守恒律的两副面孔」
 * 教材对应：Young & Freedman 第 9 章（Momentum）、第 10 章（Rotation）、
 *           第 11 章（Angular Momentum）
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch06',
  num: '06',
  title: '动量与转动：守恒律的两副面孔',
  en: 'MOMENTUM & ROTATION',
  goals: [
    '用质心坐标描述多体系统，并说明「质心运动只由外力决定」',
    '用冲量—动量定理处理碰撞与打击，区分弹性、非弹性与完全非弹性碰撞',
    '计算常见刚体的转动惯量，会用平行轴定理与转动动能',
    '写出力矩与转动定律 τ = Iα，并用角动量守恒解释「收臂加速」',
    '分析滚动问题：用 v = ωR 把平动与转动接起来，求沿斜面的加速度'
  ],
  kp: [
    { id: 'ch06-1', title: '质心与质心运动' },
    { id: 'ch06-2', title: '冲量与动量定理' },
    { id: 'ch06-3', title: '动量守恒与碰撞' },
    { id: 'ch06-4', title: '转动惯量与转动动能' },
    { id: 'ch06-5', title: '力矩与转动定律' },
    { id: 'ch06-6', title: '角动量守恒' },
    { id: 'ch06-7', title: '滚动：平动与转动的合体' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '为什么「转」比「动」难', html: '花样滑冰运动员收臂时越转越快，很多人以为她「用了力」，其实她只是把手收回来，<b>没有施加任何外力矩</b>。真正发生的是：转动惯量变小，为了保持角动量不变，角速度必须变大。<b>角动量守恒</b>——这条定律与动量守恒是同一套逻辑的两个版本。转动之所以看起来难，是因为它把「质量」换成了「转动惯量」（还依赖形状）、把「力」换成了「力矩」（还依赖力臂）、把「速度」换成了「角速度」（还依赖半径）。三个量都多了一层几何，但方程的形式一模一样。本章的任务就是把这种「形式上的对应」讲透。' },

    { t: 'p', lead: true, html: 'ch05 用能量守恒绕开了过程；这一章再给两把钥匙：<b>动量</b>与<b>角动量</b>。它们都是「守恒量」，但守恒的条件不同：动量守恒要求外力为零，角动量守恒要求外力矩为零，能量守恒要求非保守力不做功。三个条件互相独立，一道题可能只满足其中一两个。本章前一半处理平动的动量（质心、冲量、碰撞），后一半处理转动（转动惯量、力矩、角动量、滚动）。核心对照是：<code>p = mv ↔ L = Iω</code>、<code>F = ma ↔ τ = Iα</code>、<code>K = ½mv<sup>2</sup> ↔ K = ½Iω<sup>2</sup></code>。把这三组对应记住，转动就不再是「新东西」。' },

    { t: 'h', lvl: 2, text: '一、质心与质心运动', id: 'ch06-1' },

    { t: 'p', html: '<b>质心</b>（center of mass）是系统的「质量中心」：<code>r<sub>cm</sub> = (Σm<sub>i</sub>r<sub>i</sub>)/M</code>，其中 <code>M = Σm<sub>i</sub></code>。它是各质点位置按质量加权的平均。对连续体，求和换成积分 <code>r<sub>cm</sub> = (1/M)∫r dm</code>。' },

    { t: 'p', html: '质心的意义在于<b>质心运动定理</b>：<code>ΣF<sub>ext</sub> = Ma<sub>cm</sub></code>。也就是说，无论系统内部多么复杂（爆炸、碰撞、人走动），<b>质心的运动只由外力决定</b>。一个在空中爆炸的烟花，碎片四散，但质心仍沿原来的抛物线落地——因为爆炸力是内力，成对抵消。' },

    { t: 'p', html: '几个常用结论：均匀细杆的质心在中点；均匀圆盘的质心在圆心；三角形的质心在三条中线交点（距顶点 2/3 处）；半球壳的质心在距球心 <code>R/2</code> 处（不在球心）。最后这个例子说明质心不一定在物体内部。' },

    { t: 'p', html: '数值例子：<code>m<sub>1</sub> = 2 kg</code> 在 <code>x = 0</code>，<code>m<sub>2</sub> = 3 kg</code> 在 <code>x = 5 m</code>，则 <code>x<sub>cm</sub> = (2 × 0 + 3 × 5)/5 = 3 m</code>。质心更靠近重的那个。若两物体相互吸引（例如双星系统），它们绕质心转，质心本身匀速直线运动——这也是「质心系」在碰撞分析里特别好用的原因。' },

    { t: 'h', lvl: 2, text: '二、冲量与动量定理', id: 'ch06-2' },

    { t: 'p', html: '<b>动量</b>（momentum）<code>p = mv</code>，是矢量，单位 kg·m/s。牛顿第二定律的原始形式其实是 <code>ΣF = dp/dt</code>，对变质量系统（火箭）也成立；<code>F = ma</code> 只是质量不变时的特例。' },

    { t: 'p', html: '把 <code>ΣF = dp/dt</code> 对时间积分，得<b>冲量—动量定理</b>：<code>J = ∫F dt = Δp</code>。<b>冲量</b>（impulse）<code>J</code> 是力对时间的累积，单位 N·s，与动量同量纲。这个定理的价值在于处理「时间很短、力很大」的过程：碰撞、击球、跳落。我们不需要知道力的具体波形，只要知道冲量等于动量变化。' },

    { t: 'p', html: '平均力 <code>F<sub>avg</sub> = Δp/Δt</code>。这解释了安全气囊的原理：动量变化 <code>Δp</code> 由碰撞前后的速度决定，无法改变；但延长作用时间 <code>Δt</code> 可以显著减小平均力。一个 70 kg 的人以 10 m/s 撞墙，若 0.01 s 内停下，平均力约 <code>70 × 10/0.01 = 7 × 10<sup>4</sup> N</code>（约 7 吨力）；若气囊把时间延长到 0.1 s，平均力降到 7000 N（约 0.7 吨力），生还率大大提高。<b>「软」的本质是「慢」。</b>' },

    { t: 'p', html: '另一类应用是「反冲」：火箭喷出气体，气体获得向后的动量，火箭获得向前的动量。整个过程外力（重力）不可忽略，但在极短时间内可近似用动量守恒处理单次喷射。火箭方程 <code>Δv = v<sub>e</sub>ln(m<sub>0</sub>/m)</code> 就是反复应用动量守恒的结果，本课只要求定性理解。' },

    { t: 'h', lvl: 2, text: '三、动量守恒与碰撞', id: 'ch06-3' },

    { t: 'p', html: '若系统所受<b>合外力为零</b>（或某方向合外力为零），则该方向动量守恒：<code>Σp<sub>初</sub> = Σp<sub>末</sub></code>。注意条件是「合外力为零」，不是「没有力」——内力可以很大，但成对抵消。爆炸、碰撞、反冲都属此类。' },

    { t: 'p', html: '碰撞按能量关系分三类。<b>弹性碰撞</b>（elastic）：动量与动能都守恒，宏观上表现为「弹开且不发热」，例如钢球碰撞、分子碰撞。<b>非弹性碰撞</b>（inelastic）：动量守恒但动能减少，减少的部分变成热与形变，例如橡皮泥落地。<b>完全非弹性碰撞</b>（perfectly inelastic）：碰后粘在一起、共同速度，动能损失最大。' },

    { t: 'table', caption: '三类碰撞的判据与结果；动量永远守恒，动能不一定', head: ['类型', '动量', '动能', '碰后形态'], rows: [
      ['弹性 elastic', '守恒', '守恒', '分开，相对速度大小不变、方向反转'],
      ['非弹性 inelastic', '守恒', '减少', '分开，相对速度变小'],
      ['完全非弹性 perfectly inelastic', '守恒', '损失最大', '粘在一起，共同速度 v = Σmv/Σm']
    ] },

    { t: 'p', html: '一维完全非弹性碰撞：<code>m<sub>1</sub></code> 以 <code>v<sub>1</sub></code> 撞静止的 <code>m<sub>2</sub></code>，碰后共同速度 <code>v = m<sub>1</sub>v<sub>1</sub>/(m<sub>1</sub> + m<sub>2</sub>)</code>。动能损失 <code>ΔK = ½·(m<sub>1</sub>m<sub>2</sub>/(m<sub>1</sub>+m<sub>2</sub>))·v<sub>1</sub><sup>2</sup></code>，可以写成 <code>½μv<sub>1</sub><sup>2</sup></code>，其中 <code>μ = m<sub>1</sub>m<sub>2</sub>/(m<sub>1</sub>+m<sub>2</sub>)</code> 叫约化质量。' },

    { t: 'p', html: '数值例子：<code>m<sub>1</sub> = 1 kg</code>、<code>v<sub>1</sub> = 4 m/s</code> 撞 <code>m<sub>2</sub> = 3 kg</code> 静止。完全非弹性：<code>v = 4/2 = 1 m/s</code>；初动能 8 J，末动能 <code>½ × 4 × 1 = 2 J</code>，损失 6 J（75%）。弹性碰撞：<code>v<sub>1</sub>′ = ((m<sub>1</sub>−m<sub>2</sub>)/(m<sub>1</sub>+m<sub>2</sub>))v<sub>1</sub> = (−2/4) × 4 = −2 m/s</code>（反弹），<code>v<sub>2</sub>′ = (2m<sub>1</sub>/(m<sub>1</sub>+m<sub>2</sub>))v<sub>1</sub> = (2/4) × 4 = 2 m/s</code>。检验：初动能 8 J，末动能 <code>½ × 1 × 4 + ½ × 3 × 4 = 2 + 6 = 8 J</code>，守恒。' },

    { t: 'p', html: '弹性碰撞有两个极限值得记住。<b>质量相等</b>（<code>m<sub>1</sub> = m<sub>2</sub></code>）：<code>v<sub>1</sub>′ = 0</code>、<code>v<sub>2</sub>′ = v<sub>1</sub></code>，撞者停下、被撞者带走全部速度——台球正撞就是这种情形。<b>轻撞重</b>（<code>m<sub>1</sub> ≪ m<sub>2</sub></code>）：<code>v<sub>1</sub>′ ≈ −v<sub>1</sub></code>，轻球原速弹回，像撞墙。<b>重撞轻</b>（<code>m<sub>1</sub> ≫ m<sub>2</sub></code>）：<code>v<sub>1</sub>′ ≈ v<sub>1</sub></code>、<code>v<sub>2</sub>′ ≈ 2v<sub>1</sub></code>，重球几乎不受影响，轻球以两倍速度飞出。' },

    { t: 'h', lvl: 2, text: '四、转动惯量与转动动能', id: 'ch06-4' },

    { t: 'p', html: '转动惯量（moment of inertia）是转动中的「质量」，定义为 <code>I = Σm<sub>i</sub>r<sub>i</sub><sup>2</sup></code>，连续体为 <code>I = ∫r<sup>2</sup>dm</code>，单位 kg·m<sup>2</sup>。它不只依赖质量，还依赖<b>质量相对转轴的分布</b>：同样的质量，离轴越远，转动惯量越大。' },

    { t: 'table', caption: '常见刚体绕对称轴的转动惯量；M 为总质量，R 为半径，L 为长度', head: ['刚体', '转轴', '转动惯量 I'], rows: [
      ['圆环（细环）', '过圆心垂直环面', 'MR<sup>2</sup>'],
      ['圆盘（实心）', '过圆心垂直盘面', '½MR<sup>2</sup>'],
      ['实心球', '过球心', '⅖MR<sup>2</sup>'],
      ['薄球壳', '过球心', '⅔MR<sup>2</sup>'],
      ['细杆', '过中心垂直杆', '<sup>1</sup>⁄<sub>12</sub>ML<sup>2</sup>'],
      ['细杆', '过一端垂直杆', '<sup>1</sup>⁄<sub>3</sub>ML<sup>2</sup>'],
      ['圆柱（绕轴）', '过中心轴', '½MR<sup>2</sup>']
    ] },

    { t: 'p', html: '两个刚体质量相同、半径相同，为什么圆环的 <code>I</code> 是圆盘的两倍？因为圆环的质量全部分布在 <code>r = R</code> 处，而圆盘的质量从中心到边缘均匀分布，平均 <code>r<sup>2</sup></code> 更小。<b>「质量越靠外，越难转」</b>——这就是为什么飞轮做成外缘厚重的形状，也是为什么体操运动员团身时转得快。' },

    { t: 'p', html: '<b>平行轴定理</b>：<code>I = I<sub>cm</sub> + Md<sup>2</sup></code>，其中 <code>d</code> 是转轴到质心的距离。细杆绕端点：<code>I = ML<sup>2</sup>/12 + M(L/2)<sup>2</sup> = ML<sup>2</sup>/3</code>，与表里一致，可以当作定理的验算。这个定理在「轴不在质心」的题里必用。' },

    { t: 'p', html: '<b>转动动能</b>：<code>K<sub>rot</sub> = ½Iω<sup>2</sup></code>，与 <code>½mv<sup>2</sup></code> 完全对应。若刚体既平动又转动（例如滚动的车轮），总动能是两项之和 <code>K = ½mv<sub>cm</sub><sup>2</sup> + ½I<sub>cm</sub>ω<sup>2</sup></code>，这是下一节滚动的关键。' },

    { t: 'p', html: '数值例子：<code>M = 2 kg</code>、<code>L = 1.0 m</code> 的细杆绕端点以 <code>ω = 3 rad/s</code> 转动。<code>I = 2 × 1/3 ≈ 0.667 kg·m<sup>2</sup></code>，<code>K = ½ × 0.667 × 9 ≈ 3.0 J</code>。若改成绕中心转，<code>I = 2/12 ≈ 0.167</code>，同样角速度下动能只有 0.75 J——<b>同一根杆，转轴不同，储存的转动动能差四倍</b>。' },

    { t: 'h', lvl: 2, text: '五、力矩与转动定律', id: 'ch06-5' },

    { t: 'p', html: '<b>力矩</b>（torque）<code>τ = r × F</code>，大小 <code>rF sin θ</code>，方向由右手定则确定，单位 N·m。它衡量「力使物体转动的效果」。<code>θ</code> 是位置矢量与力的夹角：<code>θ = 90°</code> 时力矩最大，<code>θ = 0</code>（力沿半径）时力矩为零——推门时推门轴那一侧，怎么推都推不动。' },

    { t: 'p', html: '注意「力矩」与「功」单位都是 N·m，但物理意义完全不同：功是标量、可以转化为能量；力矩是矢量、改变角动量。写单位时力矩习惯写 N·m 而不写 J，就是为了避免混淆。' },

    { t: 'p', html: '<b>转动定律</b>：<code>Στ = Iα</code>，与 <code>ΣF = ma</code> 完全对应。<code>α</code> 是角加速度（rad/s<sup>2</sup>）。这个方程只对<b>绕固定轴</b>转动或绕质心转动的刚体直接成立；一般情形要用完整的角动量定理。' },

    { t: 'p', html: '数值例子：半径 0.20 m 的圆盘（<code>M = 5 kg</code>）绕中心轴转动，边缘切向施加 10 N 的力。力矩 <code>τ = 0.20 × 10 = 2.0 N·m</code>；<code>I = ½ × 5 × 0.04 = 0.10 kg·m<sup>2</sup></code>；<code>α = 2.0/0.10 = 20 rad/s<sup>2</sup></code>。若从静止开始 2 s，<code>ω = 40 rad/s</code>，<code>K = ½ × 0.10 × 1600 = 80 J</code>。' },

    { t: 'p', html: '转动里也有「静摩擦」式的约束：<b>纯滚动</b>时接触点相对地面瞬时静止，摩擦力不做功，只提供转动所需的力矩。这条性质在下一节会用到。另外，力矩的功 <code>W = ∫τ dθ</code>，功率 <code>P = τω</code>，与 <code>P = Fv</code> 对应——汽车发动机的扭矩与转速相乘就是功率，这是「扭矩大不大看转速」说法的来源。' },

    { t: 'h', lvl: 2, text: '六、角动量守恒', id: 'ch06-6' },

    { t: 'p', html: '<b>角动量</b>（angular momentum）对质点定义为 <code>L = r × p</code>，大小 <code>rmv sin θ</code>；对绕固定轴转动的刚体为 <code>L = Iω</code>，单位 kg·m<sup>2</sup>/s。角动量定理：<code>Στ<sub>ext</sub> = dL/dt</code>。当合外力矩为零时，<code>L</code> 守恒。' },

    { t: 'p', html: '角动量守恒最漂亮的演示就是花样滑冰。运动员张开手臂时 <code>I<sub>1</sub></code> 大、<code>ω<sub>1</sub></code> 小；收臂后 <code>I<sub>2</sub></code> 变小，为保持 <code>I<sub>1</sub>ω<sub>1</sub> = I<sub>2</sub>ω<sub>2</sub></code>，<code>ω<sub>2</sub></code> 必须变大。数值例子：<code>I<sub>1</sub> = 2.0 kg·m<sup>2</sup></code>、<code>ω<sub>1</sub> = 3.0 rad/s</code>，收臂后 <code>I<sub>2</sub> = 0.5</code>，则 <code>ω<sub>2</sub> = 6.0/0.5 = 12 rad/s</code>，转速翻四倍。' },

    { t: 'p', html: '注意能量：转动动能 <code>½Iω<sup>2</sup></code> 从 <code>½ × 2 × 9 = 9 J</code> 变成 <code>½ × 0.5 × 144 = 36 J</code>，<b>增加了</b>。这些能量来自运动员收臂时肌肉做的功——她必须克服「离心趋势」把手臂拉回来。所以角动量守恒不等于能量守恒：本例中角动量守恒、机械能不守恒。这个反差是考试里常考的陷阱。' },

    { t: 'p', html: '另一个经典例子是<b>开普勒第二定律</b>：行星绕太阳运动时，引力始终沿连线（有心力），力矩为零，所以角动量守恒。于是 <code>mvr sin θ = const</code>，在近日点速度大、远日点速度小，扫过的面积速率恒定。这条定律的力学根源就是角动量守恒。' },

    { t: 'p', html: '还有一类问题：<b>碰撞中的角动量</b>。子弹击中转盘边缘、人跳上旋转的转台，都属于「完全非弹性」的角碰撞：<code>I<sub>1</sub>ω<sub>1</sub> = (I<sub>1</sub> + I<sub>2</sub>)ω<sub>2</sub></code>。注意此时动能减少，但角动量守恒——与平动的完全非弹性碰撞完全平行。' },

    { t: 'h', lvl: 2, text: '七、滚动：平动与转动的合体', id: 'ch06-7' },

    { t: 'p', html: '纯滚动（rolling without slipping）的条件是<b>接触点相对地面瞬时静止</b>，由此得到 <code>v<sub>cm</sub> = ωR</code>、<code>a<sub>cm</sub> = αR</code>。车轮上各点的速度不同：最高点是 <code>2v<sub>cm</sub></code>，接触点是零。这就是为什么车轮上甩出的泥巴总是沿切线飞出。' },

    { t: 'p', html: '滚动物体的总动能是平动与转动之和：<code>K = ½mv<sub>cm</sub><sup>2</sup> + ½I<sub>cm</sub>ω<sup>2</sup> = ½mv<sub>cm</sub><sup>2</sup>(1 + I<sub>cm</sub>/(mR<sup>2</sup>))</code>。设 <code>β = I<sub>cm</sub>/(mR<sup>2</sup>)</code>，则 <code>K = ½mv<sup>2</sup>(1 + β)</code>。不同形状的 <code>β</code> 不同：圆环 <code>β = 1</code>，圆盘 <code>β = ½</code>，实心球 <code>β = ⅖</code>，薄球壳 <code>β = ⅔</code>。' },

    { t: 'p', html: '沿斜面滚下时，重力势能转化为 <code>K</code>：<code>mgh = ½mv<sup>2</sup>(1 + β)</code>，得 <code>v = √(2gh/(1 + β))</code>；加速度 <code>a = g sin θ/(1 + β)</code>。<b>关键结论：β 越小，滚得越快</b>。所以在同一斜面上，实心球（β = 0.4）比圆盘（0.5）快，圆盘比圆环（1.0）快。这与质量、半径都无关，只与形状有关——一个著名的演示实验。' },

    { t: 'p', html: '验算：倾角 30° 的斜面，实心球 <code>a = 9.8 × 0.5/1.4 = 3.5 m/s<sup>2</sup></code>，圆环 <code>a = 9.8 × 0.5/2 = 2.45 m/s<sup>2</sup></code>。若两者从同一高度释放，球先到底。这个结论在「滚动比赛」演示里非常直观：观众常以为重的快，实际是「质量分布靠内的快」。' },

    { t: 'p', html: '滚动问题有一个隐含条件容易忽略：<b>静摩擦必须足够大，否则会打滑</b>。所需静摩擦 <code>f = Iα/R = βmg sin θ/(1 + β)</code>，条件 <code>f ≤ μ<sub>s</sub>N = μ<sub>s</sub>mg cos θ</code>，即 <code>μ<sub>s</sub> ≥ β tan θ/(1 + β)</code>。斜面太陡或太滑时，物体变成「滑 + 转」的混合状态，上面所有公式都失效。' },

    { t: 'terms', items: [
      { en: 'center of mass', zh: '质心', html: '质量加权的平均位置。质心运动只由外力决定，ΣF<sub>ext</sub> = Ma<sub>cm</sub>。' },
      { en: 'impulse', zh: '冲量', html: 'J = ∫F dt = Δp，单位 N·s。延长作用时间可减小平均力，这是安全气囊的原理。' },
      { en: 'elastic collision', zh: '弹性碰撞', html: '动量与动能都守恒，碰后相对速度大小不变。台球正撞、分子碰撞属于此类。' },
      { en: 'moment of inertia', zh: '转动惯量', html: 'I = Σmr<sup>2</sup>，依赖质量分布与转轴位置。平行轴定理 I = I<sub>cm</sub> + Md<sup>2</sup>。' },
      { en: 'torque', zh: '力矩', html: 'τ = r×F = rF sin θ，单位 N·m。转动定律 Στ = Iα。' },
      { en: 'angular momentum', zh: '角动量', html: 'L = r×p（质点）或 L = Iω（刚体）。合外力矩为零时守恒。' },
      { en: 'rolling without slipping', zh: '纯滚动', html: '接触点瞬时静止，v<sub>cm</sub> = ωR。总动能 = 平动 + 转动。' }
    ] },

    { t: 'quiz', qid: 'ch06-q1' },
    { t: 'quiz', qid: 'ch06-q2' },
    { t: 'quiz', qid: 'ch06-q3' },

    { t: 'keypoint', items: [
      { title: '质心只服从外力', html: '内部爆炸、碰撞不改变质心轨迹。质心系是分析碰撞的便利参考系。' },
      { title: '冲量定理管「短时间大力」', html: 'J = Δp，F<sub>avg</sub> = Δp/Δt。安全气囊、跳垫的原理都是延长 Δt。' },
      { title: '碰撞三分：看动能', html: '动量永远守恒；弹性动能守恒、完全非弹性粘在一起且损失最大。等质量正撞会「交换速度」。' },
      { title: '转动的三组对应', html: 'I ↔ m、τ ↔ F、L = Iω ↔ p = mv、K = ½Iω<sup>2</sup> ↔ ½mv<sup>2</sup>。平行轴定理把轴挪开也能算。' },
      { title: '角动量守恒 ≠ 能量守恒', html: '收臂加速时 ω 变大、转动动能增加，能量来自肌肉做功。滚动时 β 越小越快。' }
    ] },

    { t: 'checklist', id: 'ch06', items: [
      '我能算出两质点系统的质心位置，并解释烟花爆炸后质心为何仍走抛物线',
      '我能用冲量定理解释安全气囊为什么能减小伤害',
      '我能区分弹性、非弹性、完全非弹性碰撞，并算出碰后速度与动能损失',
      '我知道等质量弹性正撞会「交换速度」，并能用公式验证',
      '我能写出圆环、圆盘、实心球、细杆（中心/端点）的转动惯量',
      '我能用平行轴定理把细杆的 I 从中心换到端点',
      '我能用 τ = Iα 算出圆盘在切向力下的角加速度',
      '我能用角动量守恒算出收臂前后的角速度变化，并说明能量从哪来',
      '我能推出滚动加速度 a = g sin θ/(1 + β)，并判断球与环谁先到底'
    ] },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章对应教材第 9 章 Linear Momentum、第 10 章 Dynamics of Rotational Motion 与第 11 章 Angular Momentum，覆盖质心与质心运动定理、冲量与动量定理、三类碰撞、转动惯量与平行轴定理、转动动能、力矩与转动定律、角动量守恒、纯滚动与滚动加速度。课程大纲把动量列为第 12–13 讲、转动与角动量列为第 14–17 讲，期中覆盖到动量与转动前半，期末覆盖角动量与滚动。文中 1 kg 撞 3 kg、I = 2 kg·m<sup>2</sup> 收臂、细杆 2 kg/1 m 等均为便于手算取整的教学数值。陀螺进动、刚体一般运动（非定轴）超出本课要求，本章未展开；滚动部分只讨论圆柱形刚体在斜面上的纯滚动。' }
  ]
});
