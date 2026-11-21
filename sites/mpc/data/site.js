/* =====================================================================
 * site.js · MPC 微积分预科 站点配置（window.CSC_SITE）
 * 所有展示文案集中在这里；换课程只需改本文件与 data/ 下的章节文件。
 * ===================================================================== */
window.CSC_SITE = {
  id: 'mpc',
  short: 'MPC',
  name: '微积分预科',
  en: 'Precalculus',
  dept: '数学与优化',
  lang: 'text',
  langLabel: '数学',

  /* 首页启动终端 */
  mode: 'STATIC · 阅读 + 自测',
  bootHead: 'MPC // OBSERVATORY',
  bootLog: [
    '> mounting course partition ... MPC',
    '> loading 8 modules: functions, polynomials, exponentials ...',
    '> calibrating unit circle & triangle solvers ...',
    '> all systems nominal. welcome aboard.'
  ],

  /* 首页主视觉文案 */
  tagline: '微积分不是从零开始，它站在一张你已经画好的图上。',
  missionEn: 'MPC · 8 MODULES',
  missionTitle: '从函数到极限<br><em>把预科读成一条路</em>',
  lede: '八章沿一条主线推进：先学会用函数描述关系、画出图像，再处理多项式与指数增长，' +
    '接着把角放回单位圆、用三角形测量距离，最后用方程组、数列与圆锥曲线收束，' +
    '在极限与导数处接上微积分。每章配概念推导、对比表、常见错误、自检清单与分章题库。',
  searchPlaceholder: 'QUERY // 搜索：定义域 · 渐近线 · 对数律 · 弧度 · 余弦定理 · 极限',

  /* 资料库（path 相对 "CUHKSZ course" 目录，由 tools/check-content.js 校验存在性） */
  resBase: '../../resources/MPC/',
  resources: {
    note: '本站公开资料只有一本教材：Stewart《Precalculus: Mathematics for Calculus》第 7 版。' +
      '章节编号与书中目录基本对应，读正文时遇到推导细节可回到对应小节核对。',
    groups: [
      { name: '教材', note: '全书 PDF，体积较大，建议按章下载或在线翻阅，不必一次读完。', items: [
        { title: 'Precalculus: Mathematics for Calculus（第 7 版）', path: '学习资料/MPC_Precalculus_7th_Edition.pdf', kind: 'pdf',
          note: 'Stewart / Redlin / Watson 著；函数、多项式、指数对数、三角、方程组、数列、圆锥曲线与极限预览' }
      ] }
    ]
  },

  /* 关于页的信息行 */
  aboutLines: [
    ['课程', '微积分预科（Precalculus），CUHKSZ MPC'],
    ['来源', 'CUHKSZ MPC 课程大纲与 Stewart《Precalculus》第 7 版教材'],
    ['结构', '8 章正文 · 56 题分章题库 · 模拟卷 A · 3 个实战项目 · 速查表'],
    ['建议', '第 0 章先建地图；ch01 与 ch04 是硬前置，不要跳过；每章结尾的自检清单请逐条动手验算。']
  ],

  /* 速查表：tabs 结构 [{ label, blocks:[...] }] */
  cheat: [
    { label: '函数与图像', blocks: [
      { t: 'table', head: ['变换', '写法', '图像动作', '易错点'], rows: [
        ['纵向平移', '<code>f(x) + c</code>', 'c &gt; 0 向上移 c', '加在函数外面，动的是 y'],
        ['横向平移', '<code>f(x + c)</code>', 'c &gt; 0 向左移 c', '符号与直觉相反：加号往左'],
        ['纵向拉伸', '<code>a·f(x)</code>', '<code>|a| &gt; 1</code> 拉长，<code>0 &lt; |a| &lt; 1</code> 压扁', 'a 为负时同时关于 x 轴翻折'],
        ['横向压缩', '<code>f(bx)</code>', '<code>|b| &gt; 1</code> 压扁为 <code>1/|b|</code>', '周期变成 <code>2π/|b|</code>，不是 <code>2πb</code>'],
        ['关于 x 轴', '<code>−f(x)</code>', '上下翻转，y 变号', '与 <code>f(−x)</code>（左右翻转）不同'],
        ['关于 y 轴', '<code>f(−x)</code>', '左右翻转，x 变号', '偶函数满足 <code>f(−x) = f(x)</code>'],
        ['绝对值', '<code>|f(x)|</code>', 'x 轴下方部分翻上来', '先画原图再翻，不要逐点猜']
      ], caption: '多个变换同时出现时，先做括号内的横向变换，再做外面的纵向变换' },
      { t: 'compare',
        left: { title: '反函数 f⁻¹', html: '把输入输出对调：<code>y = f(x)</code> 解出 <code>x = f⁻¹(y)</code>。图像关于直线 <code>y = x</code> 对称；要求 f 在定义域上单调（一一对应）。' },
        right: { title: '倒数 1/f', html: '对每个函数值取倒数。<code>f(x) = 0</code> 处无定义，产生垂直渐近线；与「反函数」毫无关系，符号 <code>f⁻¹</code> 只表示反函数。' } },
      { t: 'callout', kind: 'warn', title: '三个最贵的代数错误', html: '<code>f(x + h) ≠ f(x) + h</code>（函数不是线性运算）；<code>√(a + b) ≠ √a + √b</code>；<code>(a + b)<sup>2</sup> ≠ a<sup>2</sup> + b<sup>2</sup></code>，中间还有 <code>2ab</code>。这三个错误会直接毁掉导数与化简题。' }
    ] },

    { label: '三角与解三角形', blocks: [
      { t: 'table', head: ['θ（弧度）', '0', 'π/6', 'π/4', 'π/3', 'π/2'], rows: [
        ['sin θ', '0', '1/2', '√2/2', '√3/2', '1'],
        ['cos θ', '1', '√3/2', '√2/2', '1/2', '0'],
        ['tan θ', '0', '√3/3', '1', '√3', '无定义']
      ], caption: '只背第一象限，其余用参考角加象限符号推出；tan 在 π/2 处是垂直渐近线' },
      { t: 'table', head: ['参数', '在 <code>y = A sin(B(x − C)) + D</code> 里', '怎么读'], rows: [
        ['振幅', '<code>|A|</code>', '最高点与最低点差的一半'],
        ['周期', '<code>2π/|B|</code>', '相邻两个峰之间的距离'],
        ['相位', '<code>C</code>', '先把 B 提出来，再读括号里的减数'],
        ['中线', '<code>D</code>', '最高点与最低点的平均值']
      ], caption: '<code>y = 3sin(2x − π/3) + 1</code> 应写成 <code>3sin(2(x − π/6)) + 1</code>：右移 π/6，不是 π/3' },
      { t: 'compare',
        left: { title: '正弦定理', html: '<code>a/sin A = b/sin B = c/sin C</code>。已知两角一边（AAS/ASA）或两边及其中一边的对角（SSA）时用；SSA 要检查两解。' },
        right: { title: '余弦定理', html: '<code>a<sup>2</sup> = b<sup>2</sup> + c<sup>2</sup> − 2bc·cos A</code>。已知两边及夹角（SAS）或三边（SSS）时用；求角时把公式反解出 cos A。' } },
      { t: 'callout', kind: 'tip', title: '弧度制的三个直接好处', html: '弧长 <code>s = rθ</code>、扇形面积 <code>S = r<sup>2</sup>θ/2</code>、<code>lim<sub>x→0</sub> sin x / x = 1</code> 都只在弧度制下成立。计算器务必确认 RAD 模式。' }
    ] },

    { label: '指数与对数', blocks: [
      { t: 'table', head: ['运算', '等式', '条件'], rows: [
        ['乘法', '<code>log<sub>a</sub>(xy) = log<sub>a</sub>x + log<sub>a</sub>y</code>', 'x, y &gt; 0'],
        ['除法', '<code>log<sub>a</sub>(x/y) = log<sub>a</sub>x − log<sub>a</sub>y</code>', 'x, y &gt; 0'],
        ['幂', '<code>log<sub>a</sub>(x<sup>r</sup>) = r·log<sub>a</sub>x</code>', 'x &gt; 0'],
        ['换底', '<code>log<sub>a</sub>x = ln x / ln a</code>', 'a &gt; 0, a ≠ 1'],
        ['反函数', '<code>a<sup>log<sub>a</sub>x</sup> = x</code>，<code>log<sub>a</sub>(a<sup>x</sup>) = x</code>', 'x &gt; 0']
      ], caption: '加法没有对数律：log(a + b) 不能拆，只能整体保留或换元' },
      { t: 'table', head: ['模型', '公式', '判断依据'], rows: [
        ['线性', '<code>y = mx + b</code>', '等间隔 x 的差恒定'],
        ['指数', '<code>y = ab<sup>x</sup></code>', '等间隔 x 的比值恒定；半对数图上为直线'],
        ['幂函数', '<code>y = ax<sup>p</sup></code>', '双对数图上为直线，斜率是 p'],
        ['连续复利', '<code>A = Pe<sup>rt</sup></code>', 'r 是年利率，t 以年为单位']
      ], caption: '复利比较：1000 元、5%、10 年 → 按年 1628.89 元，连续 1648.72 元' },
      { t: 'callout', kind: 'warn', title: '解对数方程必须验根', html: '合并 <code>log(x−1) + log(x+3) = 3</code> 时要求 <code>x &gt; 1</code>；解出的负根会让某个对数无定义，必须舍去。忘记验根是这类题最常见的失分点。' }
    ] },

    { label: '数列与圆锥曲线', blocks: [
      { t: 'table', head: ['', '等差数列', '等比数列'], rows: [
        ['通项', '<code>a<sub>n</sub> = a<sub>1</sub> + (n−1)d</code>', '<code>a<sub>n</sub> = a<sub>1</sub>r<sup>n−1</sup></code>'],
        ['前 n 项和', '<code>S<sub>n</sub> = n(a<sub>1</sub> + a<sub>n</sub>)/2</code>', '<code>S<sub>n</sub> = a<sub>1</sub>(1 − r<sup>n</sup>)/(1 − r)</code>（r ≠ 1）'],
        ['无穷和', '不存在（除非 d = 0）', '<code>a<sub>1</sub>/(1 − r)</code>，仅当 <code>|r| &lt; 1</code>'],
        ['典型来源', '每期固定增量', '每期固定百分比']
      ], caption: '等比求和公式在 r = 1 时分母为零，必须单独处理：此时 S<sub>n</sub> = na<sub>1</sub>' },
      { t: 'table', head: ['曲线', '标准方程', '参数关系', '渐近线'], rows: [
        ['圆', '<code>(x−h)<sup>2</sup> + (y−k)<sup>2</sup> = r<sup>2</sup>', '圆心 (h, k)，半径 r', '无'],
        ['椭圆', '<code>(x−h)<sup>2</sup>/a<sup>2</sup> + (y−k)<sup>2</sup>/b<sup>2</sup> = 1</code>', '<code>c<sup>2</sup> = a<sup>2</sup> − b<sup>2</sup></code>', '无'],
        ['双曲线', '<code>(x−h)<sup>2</sup>/a<sup>2</sup> − (y−k)<sup>2</sup>/b<sup>2</sup> = 1</code>', '<code>c<sup>2</sup> = a<sup>2</sup> + b<sup>2</sup></code>', '<code>y − k = ±(b/a)(x − h)</code>'],
        ['抛物线', '<code>(x−h)<sup>2</sup> = 4p(y − k)</code>', '焦点 (h, k + p)，准线 <code>y = k − p</code>', '无']
      ], caption: '椭圆里 c 最小，双曲线里 c 最大；混用这两个关系会立刻算出矛盾' },
      { t: 'compare',
        left: { title: '参数方程', html: '用第三个变量 t 分别表示 x 与 y：<code>x = f(t), y = g(t)</code>。能描述运动方向与时刻，抛体、圆周运动都靠它。' },
        right: { title: '极坐标', html: '用距离与角度表示：<code>r = f(θ)</code>。对称性好的曲线（圆、玫瑰线、心形线）写起来极短，<code>r = 2cos θ</code> 就是圆。' } },
      { t: 'callout', kind: 'note', title: '通往微积分的三个接口', html: '平均变化率 <code>(f(b) − f(a))/(b − a)</code> 取极限得导数；<code>lim<sub>x→2</sub>(x<sup>2</sup>−4)/(x−2) = 4</code> 说明极限可以与函数值无关；连续要求「有定义、极限存在、两者相等」三条同时成立。' }
    ] }
  ]
};
