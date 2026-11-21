/* =====================================================================
 * ch07.js · 第 7 章「圆锥曲线与极限预览：从解析几何到微积分」
 * 职责：用方程描述圆、抛物线、椭圆、双曲线，用参数与极坐标换视角，
 *       最后把「无限接近」写成极限，完成到微积分的过渡。
 * 依据：Precalculus 7th Edition 第 9–10 章（Conics, Limits Preview）。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch07',
  num: '07',
  title: '圆锥曲线与极限预览：从解析几何到微积分',
  en: 'CONICS & LIMITS PREVIEW',
  goals: [
    '把圆锥曲线的方程化成标准形，读出圆心、顶点、焦点与渐近线',
    '用参数方程描述运动轨迹，并在参数方程与普通方程之间转换',
    '把直角坐标与极坐标互化，认出 r = 2cos θ 这类简单极坐标曲线',
    '用图像与代入两种方式估计极限，并正确使用极限律',
    '说出连续性的定义，并写出导数作为差商的极限'
  ],
  kp: [
    { id: 'ch07-1', title: '圆与抛物线的标准形' },
    { id: 'ch07-2', title: '椭圆与双曲线' },
    { id: 'ch07-3', title: '参数方程' },
    { id: 'ch07-4', title: '极坐标' },
    { id: 'ch07-5', title: '极坐标曲线' },
    { id: 'ch07-6', title: '极限的直观与极限律' },
    { id: 'ch07-7', title: '连续性与导数预览' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '为什么把这一章放在最后', html: '因为它要同时用到前面所有工具：配方来自 ch01–ch02，弧度与三角来自 ch04，参数与消元来自 ch06。更重要的是，它是<b>微积分的门口</b>：圆锥曲线是「用方程描述形状」的顶峰，极限是「用无限接近描述趋势」的起点。学完这一章，你应该能看懂微积分教材第一章的开头，而不是被 <code>lim</code> 符号吓住。' },

    { t: 'p', lead: true, html: '这一章分两段。前一段是<b>解析几何</b>：用方程描述平面上的一类曲线，核心动作是「配方成标准形，然后读参数」。后一段是<b>极限预览</b>：不追求严格证明，只求把「<code>x</code> 越来越接近 2 时函数值越来越接近 4</n>」这句话说清楚，并知道它为什么是导数和积分的基础。两段的连接点是抛物线：它既是圆锥曲线，也是抛体运动的轨迹，还是「切线斜率」的第一个例子。' },

    { t: 'h', lvl: 2, text: '一、圆与抛物线的标准形', id: 'ch07-1' },

    { t: 'p', html: '圆的标准形是 <code>(x − h)<sup>2</sup> + (y − k)<sup>2</sup> = r<sup>2</sup></code>，圆心 <code>(h, k)</code>，半径 <code>r</code>。一般式 <code>x<sup>2</sup> + y<sup>2</sup> + Dx + Ey + F = 0</code> 通过配方化成标准形。例：<code>x<sup>2</sup> + y<sup>2</sup> − 6x + 4y − 12 = 0</code>。配方：<code>(x<sup>2</sup> − 6x + 9) + (y<sup>2</sup> + 4y + 4) = 12 + 9 + 4</code>，即 <code>(x − 3)<sup>2</sup> + (y + 2)<sup>2</sup> = 25</code>。圆心 (3, −2)，半径 5。检验：把圆心代回原式，<code>9 + 4 − 18 − 8 − 12 = −25</code>，不等于 0，但配方后的常数 25 正确；也可以取圆上一点 (8, −2) 代入原式验证。' },

    { t: 'p', html: '抛物线的标准形有两种。<b>上下开口</b>：<code>y − k = a(x − h)<sup>2</sup></code>，顶点 <code>(h, k)</code>，焦点 <code>(h, k + 1/(4a))</code>，准线 <code>y = k − 1/(4a)</code>。<b>左右开口</b>：<code>x − h = a(y − k)<sup>2</sup></code>，焦点 <code>(h + 1/(4a), k)</code>，准线 <code>x = h − 1/(4a)</code>。抛物线的定义是「到焦点与到准线距离相等」的点的集合，这个定义在物理里就是「平行光经抛物面反射后汇聚于焦点」的原理。' },

    { t: 'table', head: ['曲线', '标准形', '关键参数', '例子'], rows: [
      ['圆', '<code>(x−h)<sup>2</sup> + (y−k)<sup>2</sup> = r<sup>2</sup></code>', '圆心 (h,k)，半径 r', '<code>(x−3)<sup>2</sup>+(y+2)<sup>2</sup>=25</code>'],
      ['抛物线（上下）', '<code>y−k = a(x−h)<sup>2</sup></code>', '顶点 (h,k)，焦点距顶点 1/(4a)', '<code>y = 2(x−2)<sup>2</sup>−3</code>'],
      ['抛物线（左右）', '<code>x−h = a(y−k)<sup>2</sup></code>', '顶点 (h,k)，开口朝右若 a &gt; 0', '<code>x = (y−1)<sup>2</sup></code>'],
      ['椭圆', '<code>(x−h)<sup>2</sup>/a<sup>2</sup> + (y−k)<sup>2</sup>/b<sup>2</sup> = 1</code>', 'a &gt; b &gt; 0，c<sup>2</sup> = a<sup>2</sup> − b<sup>2</sup>', '<code>x<sup>2</sup>/25 + y<sup>2</sup>/9 = 1</code>'],
      ['双曲线', '<code>(x−h)<sup>2</sup>/a<sup>2</sup> − (y−k)<sup>2</sup>/b<sup>2</sup> = 1</code>', 'c<sup>2</sup> = a<sup>2</sup> + b<sup>2</sup>，渐近线斜率 ±b/a', '<code>x<sup>2</sup>/9 − y<sup>2</sup>/16 = 1</code>']
    ], caption: '四条曲线都由「到定点与定直线（或两定点）的距离关系」定义，标准形只是把这个关系写成最简形式' },

    { t: 'p', html: '例：把 <code>y = 2x<sup>2</sup> − 8x + 5</code> 化成抛物线标准形。配方：<code>y = 2(x − 2)<sup>2</sup> − 3</code>。顶点 (2, −3)，<code>a = 2</code>，焦点距顶点 <code>1/(4×2) = 1/8</code>，所以焦点 <code>(2, −3 + 0.125) = (2, −2.875)</code>，准线 <code>y = −3.125</code>。开口向上，与 ch01 的二次函数分析一致——同一个对象，两套语言。' },

    { t: 'h', lvl: 2, text: '二、椭圆与双曲线', id: 'ch07-2' },

    { t: 'p', html: '椭圆是「到两定点距离之和为常数」的点的集合。标准形 <code>x<sup>2</sup>/a<sup>2</sup> + y<sup>2</sup>/b<sup>2</sup> = 1</code>（<code>a &gt; b &gt; 0</code>），长轴沿 x 方向，半长轴 <code>a</code>、半短轴 <code>b</code>，焦距参数 <code>c<sup>2</sup> = a<sup>2</sup> − b<sup>2</sup></code>，焦点 <code>(±c, 0)</code>。离心率 <code>e = c/a</code>，范围 <code>0 ≤ e &lt; 1</code>；<code>e</code> 越接近 0 越像圆，越接近 1 越扁。' },

    { t: 'p', html: '双曲线是「到两定点距离之差为常数」的点的集合。标准形 <code>x<sup>2</sup>/a<sup>2</sup> − y<sup>2</sup>/b<sup>2</sup> = 1</code>，这里 <code>c<sup>2</sup> = a<sup>2</sup> + b<sup>2</sup></code>（注意是加不是减），焦点 <code>(±c, 0)</code>，渐近线 <code>y = ±(b/a)x</code>。双曲线分左右两支，每支都无限延伸但永远不与渐近线相交。离心率 <code>e = c/a &gt; 1</code>。' },

    { t: 'table', head: ['对比项', '椭圆', '双曲线'], rows: [
      ['定义', '到两焦点距离<b>之和</b>为常数 2a', '到两焦点距离<b>之差</b>的绝对值为常数 2a'],
      ['标准形', '<code>x<sup>2</sup>/a<sup>2</sup> + y<sup>2</sup>/b<sup>2</sup> = 1</code>', '<code>x<sup>2</sup>/a<sup>2</sup> − y<sup>2</sup>/b<sup>2</sup> = 1</code>'],
      ['c 的关系', '<code>c<sup>2</sup> = a<sup>2</sup> − b<sup>2</sup></code>', '<code>c<sup>2</sup> = a<sup>2</sup> + b<sup>2</sup></code>'],
      ['离心率', '<code>0 ≤ e &lt; 1</code>', '<code>e &gt; 1</code>'],
      ['图形', '封闭的卵形', '两支开口曲线，带渐近线'],
      ['例子', '<code>x<sup>2</sup>/25 + y<sup>2</sup>/9 = 1</code>，c = 4', '<code>x<sup>2</sup>/9 − y<sup>2</sup>/16 = 1</code>，c = 5']
    ], caption: '两处最易混：一个是「和」与「差」，一个是 c<sup>2</sup> 的加减号——记住椭圆里 c 最小，双曲线里 c 最大' },

    { t: 'p', html: '例：椭圆 <code>x<sup>2</sup>/25 + y<sup>2</sup>/9 = 1</code>。<code>a = 5</code>、<code>b = 3</code>、<code>c = √(25 − 9) = 4</code>，焦点 <code>(±4, 0)</code>，离心率 <code>e = 4/5 = 0.8</code>。顶点 <code>(±5, 0)</code> 与 <code>(0, ±3)</code>。检验：椭圆上一点 <code>(5, 0)</code> 到两焦点距离之和 <code>1 + 9 = 10 = 2a</code>，符合定义。' },

    { t: 'p', html: '例：双曲线 <code>x<sup>2</sup>/9 − y<sup>2</sup>/16 = 1</code>。<code>a = 3</code>、<code>b = 4</code>、<code>c = √(9 + 16) = 5</code>，焦点 <code>(±5, 0)</code>，渐近线 <code>y = ±(4/3)x</code>，离心率 <code>e = 5/3 ≈ 1.67</code>。取 <code>x = 5</code>，代入得 <code>25/9 − y<sup>2</sup>/16 = 1</code>，<code>y<sup>2</sup> = 16 × 16/9</code>，<code>y = ±16/3 ≈ ±5.33</code>；渐近线在 <code>x = 5</code> 处给 <code>y = 20/3 ≈ 6.67</code>，曲线在渐近线内侧，符合预期。' },

    { t: 'h', lvl: 2, text: '三、参数方程', id: 'ch07-3' },

    { t: 'p', html: '参数方程用一个第三变量 <code>t</code>（通常是时间）分别表示 <code>x</code> 与 <code>y</code>：<code>x = f(t)</code>、<code>y = g(t)</code>。它的好处是能描述「运动」而不只是「形状」：同一个圆，普通方程告诉你它长什么样，参数方程还告诉你点以什么速度、从哪出发、往哪个方向转。' },

    { t: 'p', html: '例：<code>x = 3cos t</code>、<code>y = 3sin t</code>，<code>0 ≤ t &lt; 2π</code>。消去参数：<code>x<sup>2</sup> + y<sup>2</sup> = 9(cos<sup>2</sup> + sin<sup>2</sup>) = 9</code>，是半径 3 的圆。<code>t = 0</code> 时点在 (3, 0)，<code>t = π/2</code> 时在 (0, 3)，逆时针转。若把 <code>cos</code> 与 <code>sin</code> 互换，转向就变成顺时针——<b>普通方程看不出方向，参数方程可以</b>。' },

    { t: 'p', html: '抛体运动是最典型的参数方程：水平方向匀速 <code>x = (v<sub>0</sub>cos θ)t</code>，竖直方向匀加速 <code>y = h + (v<sub>0</sub>sin θ)t − ½gt<sup>2</sup></code>。例：<code>v<sub>0</sub> = 20</code> m/s、<code>θ = 45°</code>、<code>h = 0</code>、<code>g = 9.8</code>。则 <code>x = 14.14t</code>、<code>y = 14.14t − 4.9t<sup>2</sup></code>。落地时间：解 <code>14.14t − 4.9t<sup>2</sup> = 0</code> 得 <code>t ≈ 2.886</code> 秒；射程 <code>x = 14.14 × 2.886 ≈ 40.8</code> 米。消去 <code>t</code> 得 <code>y = x − 0.0245x<sup>2</sup></code>，是一条开口向下的抛物线，与 ch01 的喷泉例子同型。' },

    { t: 'p', html: '有些曲线用参数方程写简单、用普通方程写复杂，最典型的是摆线：<code>x = r(t − sin t)</code>、<code>y = r(1 − cos t)</code>。消去 <code>t</code> 需要反三角函数，很不方便；保留参数反而清楚。微积分里求弧长、求面积，常常直接在参数方程上做，不必先消参。' },

    { t: 'h', lvl: 2, text: '四、极坐标', id: 'ch07-4' },

    { t: 'p', html: '极坐标用「距原点的距离 <code>r</code>」与「与正 x 轴的夹角 <code>θ</code>」定位：<code>x = r cos θ</code>、<code>y = r sin θ</code>。反过来 <code>r<sup>2</sup> = x<sup>2</sup> + y<sup>2</sup></code>、<code>tan θ = y/x</code>（要注意象限）。与直角坐标最大的差别是<b>表示不唯一</b>：<code>(r, θ)</code> 与 <code>(r, θ + 2π)</code> 是同一点，<code>(−r, θ)</code> 与 <code>(r, θ + π)</code> 也是同一点。' },

    { t: 'table', head: ['点', '直角坐标', '极坐标（一种写法）', '说明'], rows: [
      ['原点', '(0, 0)', '(0, 任意 θ)', 'r = 0 时 θ 无意义'],
      ['正 x 轴上', '(3, 0)', '(3, 0)', 'θ = 0'],
      ['正 y 轴上', '(0, 3)', '(3, π/2)', 'θ = π/2'],
      ['第二象限', '(−2, 2)', '(2√2, 3π/4)', 'r = √8'],
      ['同一射线反向', '(−3, 0)', '(−3, 0) 或 (3, π)', '负 r 表示反方向']
    ], caption: '极坐标的重点不是换算，而是「同一个点有无穷多种写法」这件事' },

    { t: 'p', html: '互化例子：直角坐标 <code>(1, √3)</code> 转极坐标。<code>r = √(1 + 3) = 2</code>，<code>tan θ = √3</code>，点在第一象限，<code>θ = π/3</code>，所以 <code>(2, π/3)</code>。反向：<code>(4, 5π/6)</code> 转直角坐标，<code>x = 4cos(5π/6) = −2√3</code>，<code>y = 4sin(5π/6) = 2</code>，即 <code>(−2√3, 2)</code>。检验：<code>r = √(12 + 4) = 4</code>，在第二象限，正确。' },

    { t: 'callout', kind: 'warn', title: '错误说法：极坐标的 r 必须为正', html: '为什么错：<code>r</code> 可以为负，表示「沿 θ 的反方向走 |r| 个单位」。正确说法：<code>(−3, π/3)</code> 与 <code>(3, 4π/3)</code> 是同一点。允许负 r 的好处是某些曲线（如 <code>r = 1 + 2cos θ</code>）能连续画出内环，不必分段讨论。考试写答案时，正 r 更常见，但判断同一点时要记得负 r 的用法。' },

    { t: 'h', lvl: 2, text: '五、极坐标曲线', id: 'ch07-5' },

    { t: 'p', html: '很多曲线在极坐标下方程极简。<b>圆</b>：<code>r = 2cos θ</code>。两边乘 <code>r</code> 得 <code>r<sup>2</sup> = 2r cos θ</code>，即 <code>x<sup>2</sup> + y<sup>2</sup> = 2x</code>，配方得 <code>(x − 1)<sup>2</sup> + y<sup>2</sup> = 1</code>，是以 (1, 0) 为圆心、半径 1 的圆。注意它只画一遍：<code>θ</code> 从 0 到 π 就画完了整个圆，π 到 2π 重复。' },

    { t: 'p', html: '<b>心形线</b>：<code>r = a(1 + cos θ)</code>，形状像心，尖点在原点，最远到 <code>r = 2a</code>。<b>玫瑰线</b>：<code>r = a cos(kθ)</code>，<code>k</code> 为奇数时有 <code>k</code> 个瓣，<code>k</code> 为偶数时有 <code>2k</code> 个瓣。<b>双纽线</b>：<code>r<sup>2</sup> = a<sup>2</sup>cos 2θ</code>，像横放的 8 字。这些曲线在直角坐标下方程很丑，在极坐标下却只有一个短式子，这就是换坐标的价值。' },

    { t: 'table', head: ['极坐标方程', '直角坐标形式', '图形'], rows: [
      ['<code>r = 2</code>', '<code>x<sup>2</sup> + y<sup>2</sup> = 4</code>', '半径 2 的圆'],
      ['<code>θ = π/4</code>', '<code>y = x</code>（x ≥ 0）', '过原点的射线'],
      ['<code>r = 2cos θ</code>', '<code>(x − 1)<sup>2</sup> + y<sup>2</sup> = 1</code>', '过原点的圆'],
      ['<code>r = 1 + cos θ</code>', '无简洁直角形式', '心形线'],
      ['<code>r = cos 2θ</code>', '无简洁直角形式', '四瓣玫瑰线']
    ], caption: '极坐标擅长描述「绕原点」的对称性，直角坐标擅长描述「沿坐标轴」的平移' },

    { t: 'p', html: '画极坐标曲线的实用方法是<b>列表描点</b>：取 <code>θ = 0, π/6, π/3, π/2, …</code>，算出对应的 <code>r</code>，把点标在对应方向上。遇到 <code>r &lt; 0</code> 就把点画在反方向。再检查对称性：若 <code>r(−θ) = r(θ)</code>，关于极轴对称；若 <code>r(π − θ) = r(θ)</code>，关于 <code>θ = π/2</code> 对称。对称性检查能省一半描点工作。' },

    { t: 'h', lvl: 2, text: '六、极限的直观与极限律', id: 'ch07-6' },

    { t: 'p', html: '<code>lim<sub>x→c</sub> f(x) = L</code> 的意思是：当 <code>x</code> 越来越接近 <code>c</code>（但不等于 <code>c</code>）时，<code>f(x)</code> 越来越接近 <code>L</code>。注意两件事：极限<b>不关心</b> <code>x = c</code> 处的函数值，甚至可以在那里没有定义；极限要求从左右两侧都趋向同一个 <code>L</code>，否则极限不存在。' },

    { t: 'p', html: '例：<code>lim<sub>x→2</sub> (x<sup>2</sup> − 4)/(x − 2)</code>。直接代入得 <code>0/0</code>，没有意义，但可以约分：<code>(x − 2)(x + 2)/(x − 2) = x + 2</code>（<code>x ≠ 2</code>），所以极限是 4。图像是直线 <code>y = x + 2</code> 上挖掉 <code>(2, 4)</code> 一个点——这正是 ch02 讲的「孔」。<b>极限存在，函数值不存在</b>，这是极限区别于「代入求值」的关键。' },

    { t: 'p', html: '极限律：若 <code>lim f = L</code>、<code>lim g = M</code>，则和的极限是 <code>L + M</code>、积的极限是 <code>LM</code>、商的极限是 <code>L/M</code>（要求 <code>M ≠ 0</code>）。多项式与有理函数在分母不为零处可以直接代入，就是因为这些律。遇到 <code>0/0</code> 说明不能直接代入，要先变形（约分、通分、有理化），再取极限。' },

    { t: 'table', head: ['情形', '直接代入', '处理方式', '结果'], rows: [
      ['<code>lim<sub>x→1</sub> (3x<sup>2</sup> − 2x + 1)</code>', '3 − 2 + 1', '直接代入', '2'],
      ['<code>lim<sub>x→2</sub> (x<sup>2</sup>−4)/(x−2)</code>', '0/0', '约分', '4'],
      ['<code>lim<sub>x→0</sub> (√(x+1) − 1)/x</code>', '0/0', '分子有理化', '1/2'],
      ['<code>lim<sub>x→0</sub> sin x / x</code>', '0/0', '几何或泰勒', '1'],
      ['<code>lim<sub>x→3</sub> 1/(x−3)</code>', '1/0', '左右极限不同', '不存在']
    ], caption: '0/0 是「还有活干」的信号，不是「没有极限」；1/0 才是真的发散' },

    { t: 'p', html: '<code>lim<sub>x→0</sub> sin x / x = 1</code> 值得单独记：它在弧度制下成立，是 <code>(sin x)′ = cos x</code> 的关键一步。用计算器代入小值可以直观看到：<code>x = 0.1</code> 时 0.9983，<code>x = 0.01</code> 时 0.99998，趋于 1。若换成角度制，这个极限会变成 <code>π/180 ≈ 0.01745</code>，这也从另一个角度说明<b>微积分必须用弧度</b>。' },

    { t: 'h', lvl: 2, text: '七、连续性与导数预览', id: 'ch07-7' },

    { t: 'p', html: '函数在 <code>x = c</code> 处<b>连续</b>，要同时满足三条：<code>f(c)</code> 有定义、<code>lim<sub>x→c</sub> f(x)</code> 存在、两者相等。直观地说，图像在这一点「不断开、不跳、没有洞」。多项式处处连续；有理函数在分母不为零处连续；<code>1/x</code> 在 0 处不连续，因为那里没有定义且极限不存在。' },

    { t: 'p', html: '连续性的重要性在于：只有连续函数才满足「介值定理」——若 <code>f(a) &lt; 0 &lt; f(b)</code>，则中间必有一点使 <code>f = 0</code>。求方程的近似解（二分法）就靠这条定理。它也保证了「图像可以一笔画出来」这个直觉在大多数情况下成立。' },

    { t: 'p', html: '最后是<b>导数</b>。在 <code>x</code> 处的瞬时变化率定义为差商的极限：<code>f′(x) = lim<sub>h→0</sub> (f(x + h) − f(x))/h</code>。以 <code>f(x) = x<sup>2</sup></code> 为例：<code>((x + h)<sup>2</sup> − x<sup>2</sup>)/h = (2xh + h<sup>2</sup>)/h = 2x + h</code>，令 <code>h → 0</code> 得 <code>f′(x) = 2x</code>。所以 <code>f′(3) = 6</code>，这正是 ch01 里那串平均变化率 4、3、2.5、2.1、2.01 趋近的极限（在 <code>x = 1</code> 处趋于 2，与 <code>2x</code> 一致）。' },

    { t: 'callout', kind: 'tip', title: '从这一章到微积分第一章', html: '你现在已经具备三样东西：<b>函数的图像语言</b>（ch01–ch02）、<b>变化率的直觉</b>（ch01 的平均变化率）、<b>极限的操作</b>（本章）。微积分的第一堂课会把它们合成一句话：<b>导数就是差商的极限，积分就是和的极限</b>。回头看 ch01 的抛物线、ch06 的数列求和，你会发现它们早就在为这句话做准备。' },

    { t: 'terms', items: [
      { en: 'conic section', zh: '圆锥曲线', html: '圆、抛物线、椭圆、双曲线的统称，由平面截圆锥得到，也用距离关系定义。' },
      { en: 'eccentricity', zh: '离心率', html: 'e = c/a；椭圆 0 ≤ e &lt; 1，双曲线 e &gt; 1，抛物线 e = 1。' },
      { en: 'parametric equations', zh: '参数方程', html: '用第三变量 t 分别表示 x 与 y，能描述运动的方向与速度。' },
      { en: 'polar coordinates', zh: '极坐标', html: '用 (r, θ) 定位；同一点有无穷多种写法，r 可以为负。' },
      { en: 'limit', zh: '极限', html: 'x 趋近 c 时 f(x) 趋近的值；与 f(c) 本身无关，左右必须一致。' },
      { en: 'derivative', zh: '导数', html: '差商 (f(x+h) − f(x))/h 当 h → 0 的极限，即切线斜率。' }
    ] },

    { t: 'quiz', qid: 'ch07-q1' },
    { t: 'quiz', qid: 'ch07-q2' },
    { t: 'quiz', qid: 'ch07-q3' },

    { t: 'keypoint', items: [
      { title: '配方是圆锥曲线的通用钥匙', html: '圆、椭圆、双曲线、抛物线都先化成标准形，再读圆心、顶点、焦点、渐近线。' },
      { title: '椭圆 c² = a² − b²，双曲线 c² = a² + b²', html: '记「椭圆里 c 最小、双曲线里 c 最大」，就不会用错加减号。' },
      { title: '参数方程能描述方向', html: '普通方程只给形状，参数方程还给运动；抛体运动是典型例子。' },
      { title: '极限与函数值无关', html: '0/0 先变形再取极限；左右极限不一致则极限不存在。' },
      { title: '导数是差商的极限', html: '(x²)′ = 2x 由 (2xh + h²)/h = 2x + h 推出，h → 0。' }
    ] },

    { t: 'checklist', id: 'ch07', items: [
      '我能把 x<sup>2</sup> + y<sup>2</sup> − 6x + 4y − 12 = 0 配方成标准形，读出圆心与半径',
      '我能说出 y = 2(x − 2)<sup>2</sup> − 3 的顶点、焦点与准线',
      '我能由 x<sup>2</sup>/25 + y<sup>2</sup>/9 = 1 求出焦点与离心率，并用定义检验',
      '我能说出椭圆与双曲线在 c<sup>2</sup> 公式上的区别，并各举一例',
      '我能把 x = 3cos t、y = 3sin t 消参成 x<sup>2</sup> + y<sup>2</sup> = 9，并指出转向',
      '我能把 (1, √3) 与 (4, 5π/6) 在两种坐标间互化',
      '我能说明 r = 2cos θ 为什么是圆，并说出它只画一遍的原因',
      '我能用约分算出 lim (x<sup>2</sup>−4)/(x−2)（x→2），并解释它与函数值无关',
      '我能写出导数的定义，并用它推出 (x<sup>2</sup>)′ = 2x'
    ] },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章对应 Precalculus 7th Edition 第 9–10 章：圆与抛物线的标准形、椭圆与双曲线的标准形与离心率、参数方程、极坐标与常见极坐标曲线、极限的直观定义与极限律、连续性与导数预览。教材中关于圆锥曲线一般方程的分类、极坐标下的圆锥曲线统一定义只作提及，未展开；极限部分只给直观与运算法则，ε–δ 定义留给微积分。抛体与光学例子中的数值为教学设定，g 取 9.8 m/s<sup>2</sup>。' }
  ]
});
