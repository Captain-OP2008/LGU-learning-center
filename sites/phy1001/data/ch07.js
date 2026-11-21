/* =====================================================================
 * ch07.js · 第 7 章「平衡、引力与振动波：力学的收束」
 * 教材对应：Young & Freedman 第 12 章（Equilibrium & Elasticity）、
 *           第 13 章（Gravitation）、第 14 章（Fluid Mechanics）、
 *           第 15–16 章（Oscillations / Mechanical Waves）、第 17 章（Sound）
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch07',
  num: '07',
  title: '平衡、引力与振动波：力学的收束',
  en: 'EQUILIBRIUM, GRAVITY & WAVES',
  goals: [
    '用 ΣF = 0 与 Στ = 0 解静力平衡问题（梯子、悬臂、桥），并判断稳定性',
    '用应力—应变关系说明材料为什么会断，区分杨氏模量、剪切模量与体积模量',
    '用万有引力定律算轨道速度与逃逸速度，并解释「失重」其实是自由落体',
    '用压强、浮力与伯努利方程分析流体静力学与流动问题',
    '写出简谐运动的位移、速度、加速度与能量，算出弹簧振子和单摆的周期',
    '用 v = λf 与弦波、声波公式处理波速、驻波、拍频与多普勒效应'
  ],
  kp: [
    { id: 'ch07-1', title: '刚体平衡与稳定性' },
    { id: 'ch07-2', title: '应力、应变与弹性' },
    { id: 'ch07-3', title: '万有引力与轨道' },
    { id: 'ch07-4', title: '流体压强、浮力与伯努利' },
    { id: 'ch07-5', title: '简谐运动' },
    { id: 'ch07-6', title: '弹簧振子、单摆与共振' },
    { id: 'ch07-7', title: '横波、声波与多普勒' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '为什么最后一章要讲「不动」与「来回动」', html: '前面六章讲的都是「怎么动」：加速、转弯、碰撞、旋转。这一章反过来问两个问题：物体<b>怎样才不动</b>？物体<b>怎样来回动</b>？第一个问题把前六章的力与力矩全部收拢成两条方程 <code>ΣF = 0</code>、<code>Στ = 0</code>，但要求你对「支点选在哪」「力臂怎么量」有精确的控制力。第二个问题看似新，其实只是牛顿定律在「回复力」下的必然结果：只要力与位移成正比且反向，运动必然是正弦式的。而振动一旦传出去，就成了波——声、地震、光，都是同一套语言。学完这一章，力学的零件就齐了。' },

    { t: 'p', lead: true, html: '本章是教材第 12–17 章的压缩：<b>平衡与弹性</b>（12）、<b>引力</b>（13）、<b>流体</b>（14）、<b>振动</b>（15–16）、<b>波与声</b>（16–17）。看起来是五个独立话题，其实共享一个方法论：<b>先找回复力或约束，再写方程</b>。平衡题的约束是「加速度为零」，流体题的约束是「不可压缩 + 压强连续」，振动题的约束是「力与位移成正比反向」，波题的约束是「介质连续、边界条件决定驻波」。抓住约束，方程几乎自动写出来。' },

    { t: 'h', lvl: 2, text: '一、刚体平衡与稳定性', id: 'ch07-1' },

    { t: 'p', html: '刚体处于<b>平衡</b>（equilibrium）的条件是两条：<code>ΣF = 0</code>（平动平衡）与 <code>Στ = 0</code>（转动平衡）。注意第二条对<b>任意</b>参考点都成立——这是解题的利器：选一个「未知力通过的点」作参考点，该力的力矩为零，方程里就少一个未知量。' },

    { t: 'p', html: '静力平衡题的标准流程：① 画受力图，标出所有力（重力、支持力、摩擦力、张力）；② 选参考点，通常选「最多的未知力交汇处」；③ 写 <code>ΣF<sub>x</sub> = 0</code>、<code>ΣF<sub>y</sub> = 0</code>、<code>Στ = 0</code>；④ 解方程并检查合理性（例如支持力不能为负，否则物体已离开支面）。' },

    { t: 'p', html: '经典例子：<b>梯子靠墙</b>。长 <code>L = 5 m</code>、质量 <code>20 kg</code> 的均匀梯子与地面成 <code>60°</code>，靠在光滑墙上，地面摩擦系数 <code>μ<sub>s</sub> = 0.4</code>。以梯脚为参考点：重力力矩 <code>mg(L/2)cos 60°</code>，墙的支持力力矩 <code>N<sub>w</sub>L sin 60°</code>，二者平衡得 <code>N<sub>w</sub> = mg·(1/2)·cot 60° ≈ 20 × 9.8 × 0.289 ≈ 56.6 N</code>；地面需要的静摩擦也是 56.6 N，而最大静摩擦 <code>μ<sub>s</sub>mg = 0.4 × 196 = 78.4 N</code>，所以不打滑。若倾角降到 <code>45°</code>，所需摩擦增大到 98 N，超过上限，梯子会滑倒——这就是「梯子不能太陡」的物理原因。' },

    { t: 'p', html: '<b>稳定性</b>分三类：<b>稳定平衡</b>（微小偏离后回复，如碗底的球）、<b>不稳定平衡</b>（偏离后越走越远，如山顶的球）、<b>随遇平衡</b>（偏离后仍平衡，如平面上的球）。判据是「重心在支面（support base）投影之内」：重心越低、支面越宽，越稳定。这就是为什么赛车底盘低、瓶子底要宽、走钢丝的人要拿长杆（增大转动惯量，减慢倾倒）。' },

    { t: 'h', lvl: 2, text: '二、应力、应变与弹性', id: 'ch07-2' },

    { t: 'p', html: '真实物体受力会形变。用<b>应力</b>（stress）<code>= F/A</code>（单位 Pa）与<b>应变</b>（strain）<code>= ΔL/L</code>（无量纲）描述，二者在弹性范围内成正比：<code>应力 = E × 应变</code>，比例系数 <code>E</code> 叫<b>杨氏模量</b>（Young&#8217;s modulus）。' },

    { t: 'table', caption: '三种基本形变与对应的模量；数值为常见材料的量级', head: ['形变类型', '应力', '应变', '模量（典型值）'], rows: [
      ['拉伸/压缩', 'F/A（正应力）', 'ΔL/L', '杨氏模量 E，钢约 2×10<sup>11</sup> Pa'],
      ['剪切', 'F/A（切向）', 'Δx/h', '剪切模量 G，钢约 8×10<sup>10</sup> Pa'],
      ['体积压缩', 'Δp（压强变化）', 'ΔV/V', '体积模量 B，水约 2.2×10<sup>9</sup> Pa']
    ] },

    { t: 'p', html: '体积模量定义为 <code>B = −Δp/(ΔV/V)</code>，负号表示压强增大时体积减小。水的 <code>B</code> 很大，说明水几乎不可压缩——这是流体力学里「不可压缩」假设的依据。骨的杨氏模量约 <code>1×10<sup>10</sup> Pa</code>，比钢小一个量级，但骨的「比强度」（强度/密度）很高，这是演化的结果。' },

    { t: 'p', html: '超过<b>弹性极限</b>（elastic limit）后，材料进入塑性形变，撤去力也回不去；继续加力到<b>断裂强度</b>（breaking stress）就断了。设计桥梁、电梯缆绳时要留<b>安全系数</b>（通常 3–10）：工作应力远低于断裂强度。例题：直径 1 cm 的钢缆，截面积 <code>7.85×10<sup>−5</sup> m<sup>2</sup></code>，钢的断裂强度约 <code>4×10<sup>8</sup> Pa</code>，理论最大承重约 <code>3.1×10<sup>4</sup> N</code>（约 3 吨）；取安全系数 5，实际只允许吊 600 kg 左右。' },

    { t: 'p', html: '胡克定律 <code>F = −kx</code> 是弹性在「弹簧」这种特例下的写法，<code>k</code> 是劲度系数（N/m）。负号表示力总是指向平衡位置——这个「回复」性质是下一节简谐运动的全部起点。' },

    { t: 'h', lvl: 2, text: '三、万有引力与轨道', id: 'ch07-3' },

    { t: 'p', html: '<b>万有引力定律</b>：<code>F = Gm<sub>1</sub>m<sub>2</sub>/r<sup>2</sup></code>，<code>G = 6.67×10<sup>−11</sup> N·m<sup>2</sup>/kg<sup>2</sup></code>，方向沿连线、相互吸引。它是「平方反比」律，也是「超距」作用的原型——现代物理用场来理解它。' },

    { t: 'p', html: '由 <code>mg = GMm/R<sup>2</sup></code> 得 <code>g = GM/R<sup>2</sup></code>。地球 <code>M = 5.97×10<sup>24</sup> kg</code>、<code>R = 6.37×10<sup>6</sup> m</code>，代入得 <code>g ≈ 9.8 m/s<sup>2</sup></code>。这个「巧合」其实是卡文迪什实验之后才被理解的：<code>G</code> 的测量让人类第一次「称」出了地球的质量。' },

    { t: 'p', html: '圆轨道上，引力提供向心力：<code>GMm/r<sup>2</sup> = mv<sup>2</sup>/r</code>，得 <b>轨道速度</b> <code>v = √(GM/r)</code>。贴地飞行的第一宇宙速度 <code>v<sub>1</sub> = √(gR) ≈ 7.9 km/s</code>（约 2.8 万 km/h）。要彻底逃离地球，需要 <b>逃逸速度</b> <code>v<sub>esc</sub> = √(2GM/R) = √2·v<sub>1</sub> ≈ 11.2 km/s</code>。注意逃逸速度与抛射方向无关（忽略空气与地球自转），只要速度够大。' },

    { t: 'p', html: '轨道能量：<code>E = ½mv<sup>2</sup> − GMm/r</code>。<code>E &lt; 0</code> 是束缚轨道（圆或椭圆），<code>E = 0</code> 是抛物线（恰好逃逸），<code>E &gt; 0</code> 是双曲线（飞掠而过）。这个判据与「总机械能是否足以到达无穷远」完全一致。' },

    { t: 'p', html: '<b>开普勒三定律</b>：① 行星沿椭圆轨道运行，太阳在一个焦点；② 面积速率恒定（等价于角动量守恒，见 ch06）；③ <code>T<sup>2</sup> ∝ a<sup>3</sup></code>（<code>a</code> 为半长轴）。第三定律可以从圆轨道推出：<code>T = 2πr/v</code>、<code>v<sup>2</sup> = GM/r</code>，得 <code>T<sup>2</sup> = 4π<sup>2</sup>r<sup>3</sup>/(GM)</code>。用它算同步卫星高度：<code>T = 86400 s</code>，解得 <code>r ≈ 4.2×10<sup>7</sup> m</code>，即离地约 3.6 万 km。' },

    { t: 'p', html: '关于「失重」：空间站里的宇航员并不是「没有引力」，而是与空间站一起自由下落，二者加速度相同，所以相对彼此「飘」起来。国际空间站的 <code>g</code> 约为地面的 89%，一点都不小。<b>失重的本质是「没有支持力」，不是「没有引力」。</b>' },

    { t: 'h', lvl: 2, text: '四、流体压强、浮力与伯努利', id: 'ch07-4' },

    { t: 'p', html: '<b>压强</b> <code>p = F/A</code>，单位 Pa（N/m<sup>2</sup>）。静止流体中同一深度压强相同，且随深度线性增加：<code>p = p<sub>0</sub> + ρgh</code>。<code>ρ</code> 是密度。<code>p<sub>0</sub></code> 是液面压强（通常为大气压 <code>1.01×10<sup>5</sup> Pa</code>）。每下潜 10 m，压强增加约一个大气压——这就是潜水员必须缓慢上升的原因（否则溶解的气体会在血液里形成气泡）。' },

    { t: 'p', html: '<b>阿基米德原理</b>：浸在流体中的物体受到向上的浮力，大小等于排开流体的重量 <code>F<sub>b</sub> = ρ<sub>f</sub>V<sub>排</sub>g</code>。漂浮时 <code>F<sub>b</sub> = mg</code>，即 <code>ρ<sub>f</sub>V<sub>排</sub> = ρ<sub>物</sub>V<sub>物</sub></code>。冰的密度约 <code>0.90 g/cm<sup>3</sup></code>，所以冰山约 90% 体积在水下——「冰山一角」是字面意义上的 10%。' },

    { t: 'p', html: '流动流体的两条基本方程。<b>连续性方程</b>（不可压缩）：<code>A<sub>1</sub>v<sub>1</sub> = A<sub>2</sub>v<sub>2</sub></code>——管子变细，流速变快（河流窄处急）。<b>伯努利方程</b>（理想流体、定常流动）：<code>p + ½ρv<sup>2</sup> + ρgy = 常数</code>。它是能量守恒在流体中的写法：压强能、动能、势能三者之和守恒。' },

    { t: 'p', html: '伯努利方程解释了很多现象：<b>机翼升力</b>（上表面流速快、压强低，产生向上的压差）、<b>喷雾器</b>（高速气流处压强低，把液体吸上来）、<b>列车进站时人要被「吸」向车</b>（车与人的间隙流速快、压强低）。但要注意它的适用条件：理想、不可压缩、定常、无黏。真实流体有黏性，需要用泊肃叶定律；飞机升力也有「下洗气流」的贡献，只用伯努利解释是不完整的。' },

    { t: 'p', html: '数值例子：水管从直径 4 cm 缩到 2 cm。由连续性 <code>A<sub>1</sub>v<sub>1</sub> = A<sub>2</sub>v<sub>2</sub></code>，面积比 4:1，所以 <code>v<sub>2</sub> = 4v<sub>1</sub></code>。若 <code>v<sub>1</sub> = 1 m/s</code>，则 <code>v<sub>2</sub> = 4 m/s</code>；同高度下压强降低 <code>½ρ(v<sub>2</sub><sup>2</sup> − v<sub>1</sub><sup>2</sup>) = ½ × 1000 × 15 = 7500 Pa</code>。' },

    { t: 'h', lvl: 2, text: '五、简谐运动', id: 'ch07-5' },

    { t: 'p', html: '当回复力与位移成正比且反向（<code>F = −kx</code>）时，运动是<b>简谐运动</b>（simple harmonic motion, SHM）：<code>x(t) = A cos(ωt + φ)</code>，<code>A</code> 是振幅、<code>ω</code> 是角频率（rad/s）、<code>φ</code> 是初相。<code>ω = √(k/m)</code>，周期 <code>T = 2π/ω = 2π√(m/k)</code>，频率 <code>f = 1/T</code>。' },

    { t: 'p', html: '对位移求导得速度与加速度：<code>v = −Aω sin(ωt + φ)</code>、<code>a = −Aω<sup>2</sup>cos(ωt + φ) = −ω<sup>2</sup>x</code>。最后这个式子说明 <code>a</code> 与 <code>x</code> 反向且成正比，正是 SHM 的定义。<b>关键相位关系</b>：位移最大时速度为零、加速度最大；过平衡位置时速度最大、加速度为零。' },

    { t: 'p', html: '能量：<code>E = ½kA<sup>2</sup></code> 恒定，在动能与势能之间来回转换：<code>K = ½k(A<sup>2</sup> − x<sup>2</sup>)</code>、<code>U = ½kx<sup>2</sup></code>。最大速度 <code>v<sub>max</sub> = Aω</code>，最大加速度 <code>a<sub>max</sub> = Aω<sup>2</sup></code>。' },

    { t: 'table', caption: '简谐运动的三个特殊位置；记住这张表，相位题就不会错', head: ['位置', '位移 x', '速度 v', '加速度 a', '动能/势能'], rows: [
      ['平衡位置', '0', '±Aω（最大）', '0', 'K 最大，U = 0'],
      ['正最大位移', '+A', '0', '−Aω<sup>2</sup>（最大）', 'K = 0，U 最大'],
      ['负最大位移', '−A', '0', '+Aω<sup>2</sup>（最大）', 'K = 0，U 最大'],
      ['任意位置', 'x', '±ω√(A<sup>2</sup>−x<sup>2</sup>)', '−ω<sup>2</sup>x', 'K + U = ½kA<sup>2</sup>']
    ] },

    { t: 'p', html: '数值例子：<code>k = 200 N/m</code>、<code>m = 0.50 kg</code>、<code>A = 0.10 m</code>。<code>ω = √(200/0.5) = 20 rad/s</code>，<code>T = 2π/20 ≈ 0.314 s</code>，<code>v<sub>max</sub> = 2.0 m/s</code>，<code>a<sub>max</sub> = 40 m/s<sup>2</sup></code>，<code>E = ½ × 200 × 0.01 = 1.0 J</code>。在 <code>x = 0.06 m</code> 处，<code>v = 20√(0.01 − 0.0036) = 20 × 0.08 = 1.6 m/s</code>，<code>U = ½ × 200 × 0.0036 = 0.36 J</code>，<code>K = 0.64 J</code>，相加为 1.0 J，验算通过。' },

    { t: 'h', lvl: 2, text: '六、弹簧振子、单摆与共振', id: 'ch07-6' },

    { t: 'p', html: '<b>弹簧振子</b>：水平放置时 <code>T = 2π√(m/k)</code>，与振幅无关（等时性），与重力无关；竖直悬挂时重力只是把平衡位置下移 <code>mg/k</code>，周期不变。这个「周期与振幅无关」的性质叫<b>等时性</b>，是伽利略从比萨教堂吊灯摆动中发现的。' },

    { t: 'p', html: '<b>单摆</b>（simple pendulum）：小角度（通常 <code>θ &lt; 10°</code>）下，回复力 <code>−mg sin θ ≈ −mgθ = −(mg/L)x</code>，等效劲度系数 <code>k = mg/L</code>，于是 <code>T = 2π√(L/g)</code>。同样与质量、振幅无关，只与摆长和重力加速度有关。这个公式是「用摆测 g」的原理：测出 <code>L</code> 与 <code>T</code>，<code>g = 4π<sup>2</sup>L/T<sup>2</sup></code>。' },

    { t: 'p', html: '数值例子：<code>L = 1.00 m</code>，<code>T = 2π√(1/9.8) ≈ 2.01 s</code>。这就是「秒摆」（周期 2 s）的摆长约 1 m 的由来。若把摆搬到月球（<code>g ≈ 1.6 m/s<sup>2</sup></code>），周期变成 <code>2π√(1/1.6) ≈ 4.97 s</code>，慢了一倍多。' },

    { t: 'p', html: '<b>物理摆</b>（复摆）：<code>T = 2π√(I/(mgd))</code>，<code>d</code> 是转轴到质心的距离，<code>I</code> 绕该轴。细杆绕端点：<code>I = mL<sup>2</sup>/3</code>、<code>d = L/2</code>，得 <code>T = 2π√(2L/(3g))</code>。当 <code>L = 1 m</code> 时 <code>T ≈ 1.64 s</code>，比同长单摆短——因为质量分布更靠近支点。' },

    { t: 'p', html: '<b>阻尼振动</b>：有摩擦时振幅按指数衰减 <code>A(t) = A<sub>0</sub>e<sup>−bt/2m</sup></code>，周期略变长。<b>受迫振动</b>：外加周期力驱动，稳定后按驱动频率振动。<b>共振</b>（resonance）：驱动频率接近固有频率时振幅急剧增大。共振既能造（微波炉、核磁共振、乐器的共鸣箱），也能毁（塔科马海峡大桥、士兵齐步过桥）。设计上要么利用共振，要么避开它。' },

    { t: 'h', lvl: 2, text: '七、横波、声波与多普勒', id: 'ch07-7' },

    { t: 'p', html: '波是振动在介质中的传播。基本关系 <code>v = λf</code>（速度 = 波长 × 频率）。<b>横波</b>（transverse）：质点振动方向垂直于传播方向，如绳波、光；<b>纵波</b>（longitudinal）：振动方向与传播方向平行，如声波、地震 P 波。横波不能在流体中传播（流体没有剪切弹性），所以真空中没有声波。' },

    { t: 'compare', left: { title: '横波 transverse', html: '振动垂直于传播方向。<b>绳波、水表面波、电磁波</b>。可以在固体与液体表面传播，但不能在流体内部传播，因为流体无法承受剪切。可偏振。' }, right: { title: '纵波 longitudinal', html: '振动平行于传播方向，表现为疏密相间。<b>声波、地震 P 波</b>。可以在固体、液体、气体中传播（只要有体积弹性）。不能偏振。' } },

    { t: 'p', html: '<b>弦上的波速</b>：<code>v = √(T/μ)</code>，<code>T</code> 是张力、<code>μ</code> 是线密度（kg/m）。张力越大、弦越轻，波跑得越快——吉他调音就是调张力。数值例子：<code>T = 100 N</code>、<code>μ = 0.010 kg/m</code>，<code>v = √10000 = 100 m/s</code>；若 <code>f = 50 Hz</code>，<code>λ = v/f = 2 m</code>。' },

    { t: 'p', html: '<b>声波</b>在空气中的速度约 <code>343 m/s</code>（20 °C），随温度升高而增大：<code>v ≈ 331 + 0.6T<sub>C</sub></code>。声强 <code>I = P/A</code>（W/m<sup>2</sup>），<b>声强级</b> <code>β = 10 log<sub>10</sub>(I/I<sub>0</sub>)</code> dB，<code>I<sub>0</sub> = 10<sup>−12</sup> W/m<sup>2</sup></code> 是听阈。人耳可听范围约 20 Hz–20 kHz；每增加 10 dB，声强增大 10 倍，主观响度约翻倍。' },

    { t: 'p', html: '<b>驻波与谐波</b>：两端固定的弦，波长必须满足 <code>L = nλ/2</code>，所以 <code>f<sub>n</sub> = nv/(2L)</code>（<code>n = 1, 2, 3…</code>），<code>n = 1</code> 叫基频，其余叫谐波。这就是弦乐器音色的来源：基频决定音高，谐波的比例决定音色。开管（两端开口）与闭管（一端封闭）的边界条件不同，闭管只允许奇数谐波，所以闭管发出的音更「空」。' },

    { t: 'p', html: '<b>多普勒效应</b>（Doppler effect）：<code>f′ = f·(v ± v<sub>o</sub>)/(v ∓ v<sub>s</sub>)</code>，<code>v<sub>o</sub></code> 观察者速度、<code>v<sub>s</sub></code> 声源速度。靠近时频率升高、远离时降低。<b>记忆法</b>：分子「迎着」取加号、分母「追着」取减号，结果总是让频率升高。数值例子：救护车以 <code>30 m/s</code> 接近，鸣笛 <code>1000 Hz</code>，<code>f′ = 1000 × 343/(343 − 30) ≈ 1096 Hz</code>；远离时 <code>f′ = 1000 × 343/(343 + 30) ≈ 920 Hz</code>。一进一出，音调掉了一个大二度，这就是「呜哇」声的来源。' },

    { t: 'p', html: '<b>拍</b>（beats）：两个频率相近的波叠加，合振幅周期性变化，拍频 <code>f<sub>beat</sub> = |f<sub>1</sub> − f<sub>2</sub>|</code>。调音师就是靠听拍音把两根弦调到同频：拍音消失即同频。数值例子：440 Hz 与 444 Hz 叠加，每秒听到 4 次强弱变化。' },

    { t: 'terms', items: [
      { en: 'static equilibrium', zh: '静力平衡', html: 'ΣF = 0 且 Στ = 0。参考点可选任意处，选未知力交汇点可简化方程。' },
      { en: 'stress / strain', zh: '应力 / 应变', html: '应力 = F/A（Pa），应变 = ΔL/L（无量纲）。弹性范围内成正比，比例系数为杨氏模量 E。' },
      { en: 'escape velocity', zh: '逃逸速度', html: 'v<sub>esc</sub> = √(2GM/R)，地球约 11.2 km/s。与抛射方向无关（忽略空气）。' },
      { en: 'buoyancy', zh: '浮力', html: '阿基米德原理 F<sub>b</sub> = ρ<sub>f</sub>V<sub>排</sub>g，等于排开流体的重量。' },
      { en: 'simple harmonic motion', zh: '简谐运动', html: 'F = −kx 时的运动，x = A cos(ωt + φ)，ω = √(k/m)，E = ½kA<sup>2</sup>。' },
      { en: 'resonance', zh: '共振', html: '驱动频率接近固有频率时振幅急剧增大。既可利用也可致灾。' },
      { en: 'Doppler effect', zh: '多普勒效应', html: 'f′ = f(v ± v<sub>o</sub>)/(v ∓ v<sub>s</sub>)。靠近升调、远离降调，用于测速与天文红移。' }
    ] },

    { t: 'quiz', qid: 'ch07-q1' },
    { t: 'quiz', qid: 'ch07-q2' },
    { t: 'quiz', qid: 'ch07-q3' },

    { t: 'keypoint', items: [
      { title: '平衡两条方程、一个技巧', html: 'ΣF = 0、Στ = 0，参考点选未知力交汇处。稳定性看重心投影是否落在支面内。' },
      { title: '弹性只看应力应变比', html: 'E = 应力/应变，超过弹性极限就塑性变形，到断裂强度就断。设计要留安全系数。' },
      { title: '引力给轨道定速', html: 'v = √(GM/r)、v<sub>esc</sub> = √(2GM/R)。失重 = 自由落体，不是没有引力。' },
      { title: '流体两方程', html: 'p = p<sub>0</sub> + ρgh、F<sub>b</sub> = ρ<sub>f</sub>V<sub>排</sub>g；连续性 A<sub>1</sub>v<sub>1</sub> = A<sub>2</sub>v<sub>2</sub>，伯努利 p + ½ρv<sup>2</sup> + ρgy = const。' },
      { title: 'SHM 与波共用一套公式', html: 'T = 2π√(m/k) = 2π√(L/g)，v = λf，弦 v = √(T/μ)，多普勒 f′ = f(v ± v<sub>o</sub>)/(v ∓ v<sub>s</sub>)。' }
    ] },

    { t: 'checklist', id: 'ch07', items: [
      '我能用 Στ = 0 解梯子靠墙问题，并判断倾角多小会打滑',
      '我能说出稳定、不稳定、随遇平衡的区别，并用「重心投影」判断稳定性',
      '我能写出杨氏模量、剪切模量、体积模量的定义与单位',
      '我能用断裂强度与安全系数估算钢缆的最大承重',
      '我能推出 v = √(GM/r) 与 v<sub>esc</sub> = √(2GM/R)，并说出地球的数值',
      '我能解释空间站里为什么「失重」，并说明 g 并没有变成零',
      '我能用 p = p<sub>0</sub> + ρgh 与阿基米德原理算浮力与冰山吃水比例',
      '我能用连续性与伯努利方程解释机翼升力与喷雾器',
      '我能写出 SHM 的 x、v、a 表达式，并说出三个特殊位置的相位关系',
      '我能算弹簧振子与单摆的周期，并解释「周期与振幅无关」',
      '我能用 v = λf、弦波速公式、驻波条件算频率，用多普勒公式算音调变化'
    ] },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章对应教材第 12 章 Equilibrium and Elasticity、第 13 章 Gravitation、第 14 章 Fluid Mechanics、第 15 章 Oscillations、第 16 章 Mechanical Waves、第 17 章 Sound and Hearing，是课程大纲后七周（第 11–17 章）的主体。课程把平衡与弹性放在第 18–19 讲、引力第 20 讲、流体第 21 讲、振动第 22–24 讲、波与声第 25–28 讲。文中梯子 5 m/20 kg/60°、弹簧 200 N/m、单摆 1 m、救护车 30 m/s 等均为便于手算取整的教学数值，g 统一取 9.8 m/s<sup>2</sup>。超出本课范围的内容（广义相对论、黏性流体的泊肃叶定律、非线性振动与混沌、声波的衍射定量计算）本章只提及名词、未展开；流体部分限于理想不可压缩定常流动。' }
  ]
});
