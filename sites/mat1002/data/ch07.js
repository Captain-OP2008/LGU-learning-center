/* =====================================================================
 * ch07.js · 第 7 章「多重积分与向量场定理」
 * 教材对应：Thomas 第 15 章（15.1–15.5、15.7、15.8）与第 16 章：
 * 二重/三重积分、极坐标与换元、线积分、格林定理、曲面积分、
 * 斯托克斯定理、散度定理。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch07',
  num: '07',
  title: '多重积分与向量场定理',
  en: 'MULTIPLE INTEGRALS AND VECTOR CALCULUS',
  goals: [
    '把二重积分写成累次积分，并根据区域形状选择积分顺序',
    '在直角、极坐标、柱坐标、球坐标之间切换，正确写出面积元与体积元',
    '用雅可比行列式处理一般换元，并解释它为什么是面积伸缩因子',
    '判断向量场是否保守，并用势函数计算线积分',
    '用格林、斯托克斯、散度定理把边界积分与区域积分互换'
  ],
  kp: [
    { id: 'ch07-1', title: '二重积分与累次积分' },
    { id: 'ch07-2', title: '极坐标下的二重积分' },
    { id: 'ch07-3', title: '三重积分与柱、球坐标' },
    { id: 'ch07-4', title: '换元与雅可比行列式' },
    { id: 'ch07-5', title: '线积分、保守场与路径无关' },
    { id: 'ch07-6', title: '格林定理与曲面积分' },
    { id: 'ch07-7', title: '斯托克斯定理与散度定理' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '最后一章：把前六章一次性用掉', html: '这一章的每个公式都能在前面的章节找到零件。二重积分换极坐标用的 <code>r dr dθ</code> 来自 ch04 的扇形面积；曲面积分的 <code>|r<sub>u</sub> × r<sub>v</sub>|</code> 来自 ch05 的叉积；格林定理的正向约定来自 ch04 的逆时针；三大定理的证明思路「分割—求和—取极限」来自 ch01。所以这一章不是新内容，而是<b>把所有工具组装成一台机器</b>。组装的难点不在公式，而在两个判断：先对谁积分，以及边界方向取哪一侧。这两件事判断错了，计算再准也是零分。' },

    { t: 'p', lead: true, html: '本章有两条线。<b>第一条是累加</b>：二重、三重积分把密度累加成质量、把 1 累加成面积与体积；核心技能是「画区域、定次序、换坐标」。<b>第二条是边界与内部互换</b>：格林定理把平面闭曲线上的环量换成区域上的二重积分，斯托克斯定理把空间闭曲线上的环量换成曲面上的通量，散度定理把闭曲面上的通量换成体积分。三条定理是同一个思想在不同维数的化身，理解了其中一个，另外两个就是「升维」。' },

    { t: 'h', lvl: 2, text: '一、二重积分与累次积分', id: 'ch07-1' },

    { t: 'p', html: '二重积分 <code>∬<sub>D</sub> f(x, y) dA</code> 的定义与一元定积分完全平行：把区域 D 分成小块，取样本点，求和，取极限。它的几何意义是「曲面 <code>z = f</code> 下方、区域 D 上方的有向体积」；当 <code>f = 1</code> 时就是 D 的面积。可积的充分条件是 <code>f</code> 连续（或分片连续且有界）。' },

    { t: 'p', html: '<b>富比尼定理</b>保证二重积分可以写成累次积分：若 D 是「竖条型」<code>a ≤ x ≤ b, g<sub>1</sub>(x) ≤ y ≤ g<sub>2</sub>(x)</code>，则 <code>∬<sub>D</sub> f dA = ∫<sub>a</sub><sup>b</sup>∫<sub>g<sub>1</sub>(x)</sub><sup>g<sub>2</sub>(x)</sup> f dy dx</code>；若 D 是「横条型」<code>c ≤ y ≤ d, h<sub>1</sub>(y) ≤ x ≤ h<sub>2</sub>(y)</code>，则先对 x 积分。两种写法给出同一个值，区别只在计算量。' },

    { t: 'p', html: '选择积分顺序的原则是<b>看被积函数与区域哪个更好处理</b>。例：<code>∬ e<sup>y<sup>2</sup></sup> dA</code> 在由 <code>y = x, y = 1, x = 0</code> 围成的三角形上。先对 y 积分会遇到 <code>∫e<sup>y<sup>2</sup></sup>dy</code>，没有初等原函数；先对 x 积分则内层是 <code>∫<sub>0</sub><sup>y</sup> e<sup>y<sup>2</sup></sup>dx = y e<sup>y<sup>2</sup></sup></code>，外层用 <code>u = y<sup>2</sup></code> 换元立刻算出 <code>(e − 1)/2</code>。<b>「积不出来就换顺序」是本章最实用的一句话。</b>' },

    { t: 'steps', items: [
      { title: '第一步 · 画区域', html: '把边界曲线画出来，标出交点；不画图直接写限几乎必错。' },
      { title: '第二步 · 判断竖条还是横条', html: '能用单个 <code>g<sub>1</sub>(x) ≤ y ≤ g<sub>2</sub>(x)</code> 描述就竖条；需要分段就考虑横条。' },
      { title: '第三步 · 看被积函数', html: '若某一层积分积不出来（如 <code>e<sup>y<sup>2</sup></sup></code>、<code>sin(y<sup>2</sup>)</code>），换顺序。' },
      { title: '第四步 · 写限并检查', html: '外层限必须是常数；内层限只依赖外层变量。用区域内的一个点代入验证。' },
      { title: '第五步 · 算内层再算外层', html: '内层把外层变量当常数；算完代限，再对剩下变量积分。' }
    ] },

    { t: 'h', lvl: 2, text: '二、极坐标下的二重积分', id: 'ch07-2' },

    { t: 'p', html: '极坐标换元是 <code>x = r cos θ, y = r sin θ</code>，面积元变为 <code>dA = r dr dθ</code>。<b>那个 <code>r</code> 来自雅可比行列式</b>：<code>∂(x, y)/∂(r, θ) = r</code>，也可以从几何上理解——小扇形面积是 <code>1/2(r + Δr)<sup>2</sup>Δθ − 1/2 r<sup>2</sup>Δθ ≈ r Δr Δθ</code>。漏掉 <code>r</code> 是本章最高频的错误，量纲上也能发现：<code>dr dθ</code> 是长度乘弧度（无量纲），<code>r dr dθ</code> 才是面积。' },

    { t: 'p', html: '什么时候用极坐标？<b>区域是圆、圆环、扇形，或被积函数含 <code>x<sup>2</sup> + y<sup>2</sup></code></b>。例：<code>∬<sub>D</sub> e<sup>−(x<sup>2</sup>+y<sup>2</sup>)</sup> dA</code> 在单位圆盘上，换成极坐标得 <code>∫<sub>0</sub><sup>2π</sup>∫<sub>0</sub><sup>1</sup> e<sup>−r<sup>2</sup></sup> r dr dθ = π(1 − e<sup>−1</sup>)</code>。同一积分在直角坐标下没有初等原函数，这就是极坐标的价值。' },

    { t: 'p', html: '极坐标的积分限写法：<b>先定 θ 的范围，再定 r 的范围</b>。若区域是圆盘 <code>x<sup>2</sup> + y<sup>2</sup> ≤ 1</code>，则 <code>0 ≤ θ ≤ 2π, 0 ≤ r ≤ 1</code>。若区域是圆环，<code>r</code> 的下限是内半径。若区域由 <code>r = f(θ)</code> 围成（如心形线），则 <code>r</code> 从 0 到 <code>f(θ)</code>，θ 的范围由曲线闭合的位置决定。若边界是直线（如 <code>y = x</code>），则 θ 的限是常数角，r 的限可能依赖 θ。' },

    { t: 'table', head: ['区域', 'θ 范围', 'r 范围', '备注'], rows: [
      ['单位圆盘', '<code>[0, 2π]</code>', '<code>[0, 1]</code>', '最标准'],
      ['上半圆盘', '<code>[0, π]</code>', '<code>[0, 1]</code>', 'θ 减半'],
      ['第一象限圆盘', '<code>[0, π/2]</code>', '<code>[0, 1]</code>', '对称性常用'],
      ['圆环 <code>1 ≤ r ≤ 2</code>', '<code>[0, 2π]</code>', '<code>[1, 2]</code>', '内半径非零'],
      ['心形线内部', '<code>[0, 2π]</code>', '<code>[0, 1 + cos θ]</code>', 'r 上限依赖 θ'],
      ['直线 <code>y = x</code> 与圆之间', '<code>[0, π/4]</code>', '<code>[0, 1]</code>', 'θ 由直线定']
    ], caption: 'θ 的限通常由「曲线闭合点」或「直线角度」决定，r 的限由「射线与边界的交点」决定' },

    { t: 'callout', kind: 'warn', title: '极坐标积分的三个坑', html: '<b>一、忘记 <code>r</code>：</b>写成 <code>∫∫f dr dθ</code>，结果量纲都不对。<br><b>二、θ 扫了两遍：</b>心形线在 <code>[0, 2π]</code> 上只画一遍，但玫瑰线 <code>r = cos 2θ</code> 在 <code>[0, 2π]</code> 上画两遍，求一瓣面积要用 <code>[−π/4, π/4]</code>。<br><b>三、r 的下限写成 0 而区域不含原点：</b>例如圆环、偏移圆，下限必须是内边界，否则会把中间挖掉的洞也算进去。' },

    { t: 'h', lvl: 2, text: '三、三重积分与柱、球坐标', id: 'ch07-3' },

    { t: 'p', html: '三重积分 <code>∭<sub>V</sub> f dV</code> 把密度累加成质量，把 1 累加成体积。直角坐标下写成三次累次积分，积分顺序有六种，选「投影最简单」的那种。例：<code>V</code> 是由 <code>z = 0, z = 1 − x − y, x = 0, y = 0</code> 围成的四面体，最自然的顺序是 <code>∫<sub>0</sub><sup>1</sup>∫<sub>0</sub><sup>1−x</sup>∫<sub>0</sub><sup>1−x−y</sup> f dz dy dx</code>。' },

    { t: 'p', html: '<b>柱坐标</b> <code>(r, θ, z)</code>：<code>x = r cos θ, y = r sin θ, z = z</code>，体积元 <code>dV = r dr dθ dz</code>。适合「绕 z 轴的旋转体」：圆柱、圆锥、抛物面。例：<code>z = x<sup>2</sup> + y<sup>2</sup></code> 与 <code>z = 4</code> 围成的体积，用柱坐标得 <code>∫<sub>0</sub><sup>2π</sup>∫<sub>0</sub><sup>2</sup>∫<sub>r<sup>2</sup></sub><sup>4</sup> r dz dr dθ = 8π</code>。' },

    { t: 'p', html: '<b>球坐标</b> <code>(ρ, φ, θ)</code>：<code>x = ρ sin φ cos θ, y = ρ sin φ sin θ, z = ρ cos φ</code>，其中 <code>ρ ≥ 0</code> 是到原点的距离，<code>φ ∈ [0, π]</code> 是从 z 轴量起的极角，<code>θ ∈ [0, 2π]</code> 是方位角。体积元 <code>dV = ρ<sup>2</sup> sin φ dρ dφ dθ</code>。适合「球、锥、球壳」：<code>x<sup>2</sup> + y<sup>2</sup> + z<sup>2</sup> ≤ R<sup>2</sup></code> 直接是 <code>0 ≤ ρ ≤ R</code>。' },

    { t: 'compare', left: { title: '柱坐标：绕 z 轴转', html: '<code>dV = r dr dθ dz</code>。保留 z 作为高度，适合「上下是平面、侧面是圆柱」的区域。转换只需把 <code>x<sup>2</sup> + y<sup>2</sup></code> 换成 <code>r<sup>2</sup></code>。' }, right: { title: '球坐标：绕原点转', html: '<code>dV = ρ<sup>2</sup>sin φ dρ dφ dθ</code>。适合「边界是球面或圆锥面」的区域。注意 <code>φ</code> 从 z 轴量起，<code>θ</code> 在 xy 平面内，两者不要混。' } },

    { t: 'callout', kind: 'tip', title: 'φ 与 θ 谁是谁', html: '不同教材约定不同。Thomas 用 <code>φ</code> 表示「从 z 轴量起的角」（极角），<code>θ</code> 表示「xy 平面内从 x 轴量起的角」（方位角）。物理教材常反过来。考试时看题目给的公式：若体积元写 <code>ρ<sup>2</sup>sin φ dρ dφ dθ</code>，则 <code>φ</code> 必是极角，因为 <code>sin φ</code> 来自「纬度圈半径 <code>ρ sin φ</code>」。记不住就用这个反推。' },

    { t: 'h', lvl: 2, text: '四、换元与雅可比行列式', id: 'ch07-4' },

    { t: 'p', html: '一般换元 <code>(x, y) = T(u, v)</code> 下，面积元变成 <code>dA = |∂(x, y)/∂(u, v)| du dv</code>，其中 <code>∂(x,y)/∂(u,v) = x<sub>u</sub>y<sub>v</sub> − x<sub>v</sub>y<sub>u</sub></code> 是雅可比行列式。<b>它的绝对值就是「小块面积被拉伸的倍数」</b>：<code>|J| &gt; 1</code> 放大，<code>|J| &lt; 1</code> 缩小，<code>J = 0</code> 说明换元退化（把区域压成一条线），不能作为坐标变换。' },

    { t: 'p', html: '极坐标就是 <code>J = r</code> 的特例；柱坐标 <code>J = r</code>；球坐标 <code>J = ρ<sup>2</sup>sin φ</code>。这三个都可以现场用行列式算出来，不必死记。例：球坐标的 <code>x = ρ sin φ cos θ</code> 等三式对 <code>(ρ, φ, θ)</code> 求偏导组成 3×3 矩阵，行列式算得 <code>ρ<sup>2</sup>sin φ</code>。考场上若忘了 <code>sin φ</code>，用「纬度圈半径 <code>ρ sin φ</code>、弧长元 <code>ρ sin φ dθ</code>、经线元 <code>ρ dφ</code>、径向元 <code>dρ</code>」的几何法也能推出来。' },

    { t: 'p', html: '换元的三步：<b>（1）</b>选变换，把边界写成 <code>u, v</code> 的简单形式；<b>（2）</b>算雅可比，取绝对值；<b>（3）</b>把被积函数与积分限全部换成 <code>u, v</code>。第三步最容易漏：换了 <code>dA</code> 却忘了换被积函数里的 <code>x, y</code>，答案会完全错。检查方法：换元后积分区域的面积（对 1 积分）应该等于原区域面积，不等就说明漏了因子。' },

    { t: 'h', lvl: 2, text: '五、线积分、保守场与路径无关', id: 'ch07-5' },

    { t: 'p', html: '线积分 <code>∫<sub>C</sub> F·dr = ∫<sub>a</sub><sup>b</sup> F(r(t))·r′(t) dt</code> 算的是「力沿路径做的功」；若 <code>F</code> 是速度场，它是环量。它与路径方向有关：把 <code>t</code> 反过来，积分变号。这与 ch04 的弧长不同——弧长与方向无关，线积分与方向有关，因为 <code>dr</code> 带方向。' },

    { t: 'p', html: '<b>保守场</b>有三个等价刻画：<b>（1）</b><code>F = ∇f</code>（存在势函数）；<b>（2）</b>线积分与路径无关，只依赖起点终点；<b>（3）</b>沿任何闭曲线的环量为零。在<b>单连通</b>区域上，还有一个便于检验的条件：<code>∂P/∂y = ∂Q/∂x</code>（二维）或 <code>curl F = 0</code>（三维）。注意「单连通」不能省：<code>F = ⟨−y, x⟩/(x<sup>2</sup> + y<sup>2</sup>)</code> 在挖掉原点的平面上满足 <code>P<sub>y</sub> = Q<sub>x</sub></code>，但绕原点一圈的环量是 <code>2π</code>，不是保守场。' },

    { t: 'p', html: '求势函数的标准做法：由 <code>f<sub>x</sub> = P</code> 对 x 积分得 <code>f = ∫P dx + g(y)</code>，再对 y 求导令其等于 Q，解出 <code>g′(y)</code> 后积分。例：<code>F = ⟨2xy, x<sup>2</sup> + 3y<sup>2</sup>⟩</code>，<code>f = x<sup>2</sup>y + g(y)</code>，<code>f<sub>y</sub> = x<sup>2</sup> + g′ = x<sup>2</sup> + 3y<sup>2</sup></code>，故 <code>g′ = 3y<sup>2</sup></code>、<code>g = y<sup>3</sup></code>，势函数 <code>f = x<sup>2</sup>y + y<sup>3</sup> + C</code>。有了势函数，线积分就是 <code>f(终点) − f(起点)</code>，与路径无关。' },

    { t: 'h', lvl: 2, text: '六、格林定理与曲面积分', id: 'ch07-6' },

    { t: 'p', html: '<b>格林定理</b>：若 C 是区域 D 的<b>逆时针</b>边界（正向），<code>P, Q</code> 有连续偏导，则 <code>∮<sub>C</sub> P dx + Q dy = ∬<sub>D</sub> (Q<sub>x</sub> − P<sub>y</sub>) dA</code>。它把「边界上的环量」换成「内部每个小块的旋转量之和」。这个「旋转量」<code>Q<sub>x</sub> − P<sub>y</sub></code> 就是二维旋度，ch07 最后一节会把它升级为三维的 <code>curl</code>。' },

    { t: 'p', html: '格林定理有三种用法：<b>（1）</b>边界积分难、区域积分易时换过去（最常见）；<b>（2）</b>区域积分难、边界积分易时反过来用；<b>（3）</b>用 <code>P = −y/2, Q = x/2</code> 得面积公式 <code>A = 1/2∮(x dy − y dx)</code>，这就是 ch04 的扇形公式。方向约定必须记牢：<b>C 取逆时针时公式为正</b>；若 C 是顺时针，右边要加负号。' },

    { t: 'p', html: '<b>曲面积分</b>分两类。第一类 <code>∬<sub>S</sub> f dS</code> 算的是「曲面上的积分」，与方向无关，<code>dS = |r<sub>u</sub> × r<sub>v</sub>| du dv</code>。第二类 <code>∬<sub>S</sub> F·n dS</code> 算的是「穿过曲面的通量」，与法向量方向有关，<code>n dS = (r<sub>u</sub> × r<sub>v</sub>) du dv</code>（带方向）。若曲面是 <code>z = g(x, y)</code> 的图，则 <code>dS = √(1 + g<sub>x</sub><sup>2</sup> + g<sub>y</sub><sup>2</sup>) dA</code>，上侧法向量是 <code>⟨−g<sub>x</sub>, −g<sub>y</sub>, 1⟩</code>。' },

    { t: 'table', head: ['积分类型', '记号', '方向', '化为二重积分'], rows: [
      ['第一类曲面积分', '<code>∬<sub>S</sub> f dS</code>', '无方向', '<code>∬ f|r<sub>u</sub> × r<sub>v</sub>| dudv</code>'],
      ['第二类（通量）', '<code>∬<sub>S</sub> F·n dS</code>', '有方向', '<code>∬ F·(r<sub>u</sub> × r<sub>v</sub>) dudv</code>'],
      ['图 <code>z = g(x, y)</code>', '<code>∬<sub>S</sub> F·n dS</code>', '上侧为正', '<code>∬(−Pg<sub>x</sub> − Qg<sub>y</sub> + R) dA</code>'],
      ['闭曲面', '<code>∬<sub>S</sub> F·n dS</code>', '外法向为正', '用散度定理转成体积分']
    ], caption: '第一类不带方向，第二类带方向；两者的差别就是叉积有没有取模' },

    { t: 'h', lvl: 2, text: '七、斯托克斯定理与散度定理', id: 'ch07-7' },

    { t: 'p', html: '<b>斯托克斯定理</b>：<code>∮<sub>C</sub> F·dr = ∬<sub>S</sub> (curl F)·n dS</code>，其中 C 是曲面 S 的边界，方向与 S 的法向量满足右手定则。<b>散度定理</b>：<code>∬<sub>S</sub> F·n dS = ∭<sub>V</sub> div F dV</code>，其中 S 是闭曲面、n 取外法向。两条定理与格林定理是同一件事的三级版本：维度从 2 升到 3，边界从曲线升到曲面，导数从 <code>Q<sub>x</sub> − P<sub>y</sub></code> 升到 <code>curl</code> 与 <code>div</code>。' },

    { t: 'p', html: '记忆方法：<b>「边界上的积分 = 内部导数的积分」</b>。格林是平面版，斯托克斯是「曲面 + 其边界曲线」，散度是「体积 + 其边界曲面」。维度每升一级，边界降一维，导数换一种（旋度或散度）。三条定理的适用条件都是「场足够光滑、区域足够好（分段光滑边界）」，考试里通常默认满足，但答题时最好写一句「由格林/斯托克斯/散度定理」。' },

    { t: 'p', html: '选择定理的标准是<b>看哪个积分好算</b>。若边界是复杂曲线、内部是简单区域，用格林或斯托克斯把边界积分换成区域积分；反之，若内部是复杂区域、边界是简单曲面（如球面、圆柱面），用散度定理把体积分换成面积分。例：求 <code>F = ⟨x, y, z⟩</code> 穿过单位球面的通量，直接用散度定理得 <code>∭3 dV = 3 · (4π/3) = 4π</code>；若直接算面积分，要在球面上做参数化、算叉积、积分，工作量是十倍。' },

    { t: 'callout', kind: 'exam', title: '三大定理的答题模板', html: '<b>（1）</b>写「设 …… 满足定理条件」；<b>（2）</b>写定理等式，标清 C 的方向或 S 的法向；<b>（3）</b>把一边化成另一边，写出参数化或区域描述；<b>（4）</b>算积分，注明用了哪个坐标变换；<b>（5）</b>检查符号：方向反了要加负号，这是最常见的扣分点。<br>特别提醒：若曲面不是闭的，用散度定理前要「补面」；若曲线不是闭的，用斯托克斯前要「补线」。补的时候方向要一致，补出来的部分单独算再相减。' },

    { t: 'terms', items: [
      { en: 'double integral', zh: '二重积分', html: '<code>∬<sub>D</sub> f dA</code>；几何上是曲面下的有向体积。' },
      { en: 'iterated integral', zh: '累次积分', html: '把二重积分写成两次一元积分；顺序可换，计算量不同。' },
      { en: 'Jacobian', zh: '雅可比行列式', html: '换元时面积/体积的伸缩因子；取绝对值进入 <code>dA</code> 或 <code>dV</code>。' },
      { en: 'conservative field', zh: '保守场', html: '<code>F = ∇f</code>；线积分与路径无关，闭曲线环量为零。' },
      { en: 'curl', zh: '旋度', html: '<code>∇ × F</code>；描述场的局部旋转，斯托克斯定理的被积函数。' },
      { en: 'divergence', zh: '散度', html: '<code>∇·F</code>；描述场的源汇强度，散度定理的被积函数。' },
      { en: 'flux', zh: '通量', html: '<code>∬<sub>S</sub> F·n dS</code>；穿过曲面的流量，带方向。' },
      { en: 'simply connected', zh: '单连通', html: '区域内任何闭曲线都能在区域内收缩成一点；挖洞的平面不是单连通。' }
    ] },

    { t: 'quiz', qid: 'ch07-q1' },
    { t: 'quiz', qid: 'ch07-q2' },
    { t: 'quiz', qid: 'ch07-q3' },

    { t: 'keypoint', items: [
      { title: '先画区域再写限', html: '外层限是常数，内层限只依赖外层变量；用区域内一点代入验证。' },
      { title: '积不出来就换顺序', html: '<code>e<sup>y<sup>2</sup></sup></code>、<code>sin(y<sup>2</sup>)</code> 这类内层无初等原函数，换序即可。' },
      { title: '极坐标别忘 r', html: '<code>dA = r dr dθ</code>，来自雅可比；漏掉它量纲都不对。' },
      { title: '球坐标看 sin φ', html: '<code>dV = ρ<sup>2</sup>sin φ dρ dφ dθ</code>；<code>φ</code> 从 z 轴量起。' },
      { title: '保守场三等价', html: '有势函数、路径无关、闭曲线环量为零；单连通区域上可用 <code>curl F = 0</code> 检验。' },
      { title: '三大定理同一件事', html: '边界积分 = 内部导数积分；方向与法向的约定决定符号，补面补线时尤其要小心。' }
    ] },

    { t: 'checklist', id: 'ch07', items: [
      '我能画出积分区域并写出两种积分顺序的限，且说明哪种更好算',
      '我能识别「内层积不出来」的情形并换序，例如 <code>e<sup>y<sup>2</sup></sup></code>',
      '我能把二重积分换成极坐标，正确写出 <code>r dr dθ</code> 与 θ、r 的范围',
      '我能用柱坐标与球坐标算三重积分，并说出各自的体积元',
      '我能算雅可比行列式，并用它做一般换元',
      '我能判断一个向量场是否保守，并求出势函数',
      '我能用格林定理把边界积分换成二重积分，并处理顺时针方向的符号',
      '我能算第一类与第二类曲面积分，并说出两者的方向差别',
      '我能用斯托克斯与散度定理解题，并在补面、补线时保持方向一致'
    ] },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章对应 Thomas《Calculus》第 13 版 SI 单位第 15 章（15.1–15.5 多重积分、15.7 格林定理、15.8 曲面积分）与第 16 章（斯托克斯定理、散度定理）。按课程大纲，15.6（曲面面积与曲面积分的另一套处理）跳过，因此本章的曲面面积只给公式、不做专门一节；14.10 的多元泰勒公式同样跳过，本章不涉及。线积分部分只讲标量场与向量场的第二类线积分，不讲微分形式；三大定理只要求会用、不要求证明（证明思路在正文中一笔带过）。本章的极坐标积分与 ch04 的面积公式是同一件事，曲面积分的叉积与 ch05 的法向量是同一件事。' }
  ]
});
