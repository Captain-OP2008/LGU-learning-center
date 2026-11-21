/* =====================================================================
 * ch05.js · 第 5 章「向量、空间几何与空间曲线」
 * 教材对应：Thomas 第 12 章（12.1–12.5）：三维坐标、向量、点积与叉积、
 * 直线与平面、柱面与二次曲面；空间曲线与曲率取自 13.1–13.4。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch05',
  num: '05',
  title: '向量、空间几何与空间曲线',
  en: 'VECTORS, SPACE GEOMETRY AND SPACE CURVES',
  goals: [
    '用点积判断垂直、求投影与夹角，用叉积求法向量与平行四边形面积',
    '由点和法向量写出平面方程，由点和方向向量写出直线方程',
    '识别六种二次曲面的方程与截面形状，并说出它们的对称轴',
    '对空间曲线求切向量、单位切向量、弧长与曲率',
    '解释曲率为什么是「单位切向量的变化率」，并会用两种公式计算'
  ],
  kp: [
    { id: 'ch05-1', title: '向量、点积与叉积' },
    { id: 'ch05-2', title: '直线与平面' },
    { id: 'ch05-3', title: '柱面与二次曲面' },
    { id: 'ch05-4', title: '空间曲线与切向量' },
    { id: 'ch05-5', title: '弧长与曲率' },
    { id: 'ch05-6', title: '法向量、副法向量与活动标架' },
    { id: 'ch05-7', title: '空间几何的解题策略' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '这一章是 ch07 的「几何零件仓库」', html: '曲面积分要算法向量，斯托克斯定理要定曲面方向，散度定理要用闭曲面的外法向——这些全部是本章的内容。更具体地说：ch07 里 <code>∬<sub>S</sub> F·n dS</code> 的 <code>n</code> 来自本章的叉积，<code>dS</code> 来自本章的 <code>|r<sub>u</sub> × r<sub>v</sub>|</code>，格林定理的正向约定来自本章的「逆时针」。如果这一章的叉积算错，后面所有定理都会差一个负号，而负号错误在积分题里几乎必然导致零分。' },

    { t: 'p', lead: true, html: '本章分两半。前半是<b>静态几何</b>：向量、点积、叉积、直线、平面、二次曲面——目标是把三维图形翻译成方程，把方程读成图形。后半是<b>动态几何</b>：空间曲线、切向量、弧长、曲率——目标是描述质点沿曲线运动时的方向变化。两半共用一套工具：向量。学完本章，你应当看到 <code>x<sup>2</sup> + y<sup>2</sup> = z</code> 就能说出「开口向上的旋转抛物面」，看到 <code>r(t) = (cos t, sin t, t)</code> 就能说出「螺旋线，曲率随半径变化」。' },

    { t: 'h', lvl: 2, text: '一、向量、点积与叉积', id: 'ch05-1' },

    { t: 'p', html: '向量是「有方向的量」，记作 <code>v = ⟨a, b, c⟩</code>。加法按分量，数乘按分量，模长 <code>|v| = √(a<sup>2</sup> + b<sup>2</sup> + c<sup>2</sup>)</code>。单位向量是 <code>v/|v|</code>。<b>点积</b> <code>u·v = a<sub>1</sub>a<sub>2</sub> + b<sub>1</sub>b<sub>2</sub> + c<sub>1</sub>c<sub>2</sub> = |u||v|cos θ</code>，结果是数；它测量「同向程度」，垂直时为零，投影长度是 <code>u·v/|v|</code>。<b>叉积</b> <code>u × v</code> 是向量，方向由右手定则，模长 <code>|u||v|sin θ</code> 等于两向量张成的平行四边形面积。' },

    { t: 'p', html: '叉积的计算用行列式：<code>u × v = ⟨b<sub>1</sub>c<sub>2</sub> − c<sub>1</sub>b<sub>2</sub>, c<sub>1</sub>a<sub>2</sub> − a<sub>1</sub>c<sub>2</sub>, a<sub>1</sub>b<sub>2</sub> − b<sub>1</sub>a<sub>2</sub>⟩</code>。手算时按「<code>i</code> 分量遮第一列、<code>j</code> 分量遮第二列并加负号、<code>k</code> 分量遮第三列」的余子式规则，比硬记公式可靠。三条性质必须熟：<b>（1）</b><code>u × v = −v × u</code>（反交换）；<b>（2）</b><code>u × u = 0</code>，所以平行向量的叉积为零；<b>（3）</b><code>(u × v)·u = (u × v)·v = 0</code>，叉积同时垂直于两个因子。' },

    { t: 'table', head: ['运算', '结果类型', '几何意义', '为零意味着'], rows: [
      ['<code>u·v</code>', '标量', '<code>|u||v|cos θ</code>，投影的分子', '两向量垂直'],
      ['<code>u × v</code>', '向量', '法向量，模长为平行四边形面积', '两向量平行'],
      ['<code>u·(v × w)</code>', '标量', '三向量张成的平行六面体体积（有向）', '三向量共面'],
      ['<code>|u × v|</code>', '标量', '平行四边形面积', '共线'],
      ['<code>u·v/|v|</code>', '标量', '<code>u</code> 在 <code>v</code> 上的有向投影长度', '<code>u</code> 垂直于 <code>v</code>']
    ], caption: '点积判垂直、叉积判平行、混合积判共面，这是空间几何的三把尺子' },

    { t: 'p', html: '混合积有一个好用的几何解释：<code>|u·(v × w)|</code> 是以三个向量为棱的平行六面体体积。于是「四点共面」等价于「三个边向量混合积为零」，比列平面方程再代点快得多。叉积还给出点到直线的距离公式：点 <code>P</code> 到过 <code>Q</code>、方向 <code>v</code> 的直线距离为 <code>|QP × v|/|v|</code>，因为 <code>|QP × v|</code> 是以 <code>QP</code> 与 <code>v</code> 为边的平行四边形面积，除以底 <code>|v|</code> 就是高。' },

    { t: 'callout', kind: 'warn', title: '叉积的三个常见错误', html: '<b>一、</b>把叉积当交换的：<code>v × u</code> 与 <code>u × v</code> 差一个负号，法向量方向反了，平面方程就整体变号（方程本身仍对，但后续判断会错）。<br><b>二、</b>忘记叉积是向量，写出 <code>u × v = 5</code> 这种答案。<br><b>三、</b>用叉积求面积时忘记取模：<code>u × v</code> 本身是向量，面积是 <code>|u × v|</code>；三角形面积还要再除以 2。' },

    { t: 'h', lvl: 2, text: '二、直线与平面', id: 'ch05-2' },

    { t: 'p', html: '<b>平面</b>由一点 <code>P<sub>0</sub>(x<sub>0</sub>, y<sub>0</sub>, z<sub>0</sub>)</code> 与一个法向量 <code>n = ⟨A, B, C⟩</code> 确定，方程是 <code>A(x − x<sub>0</sub>) + B(y − y<sub>0</sub>) + C(z − z<sub>0</sub>) = 0</code>，展开为 <code>Ax + By + Cz = D</code>。反过来，任何 <code>Ax + By + Cz = D</code> 都是平面，<code>⟨A, B, C⟩</code> 就是法向量。这个「系数即法向量」的对应是本章最有用的一句话：看到平面方程，立刻能读出法向量。' },

    { t: 'p', html: '求平面方程的三种常见情形：<b>（1）给三点</b>——取两个边向量，叉积得法向量；<b>（2）给一点与一条直线</b>——直线方向 <code>v</code> 与「点到直线上某点」的向量叉积；<b>（3）给两条相交直线</b>——两方向向量的叉积。三条路都归结为「找法向量」，而找法向量的通用工具就是叉积。' },

    { t: 'p', html: '<b>直线</b>由一点与方向向量 <code>v = ⟨a, b, c⟩</code> 确定，参数式 <code>x = x<sub>0</sub> + at, y = y<sub>0</sub> + bt, z = z<sub>0</sub> + ct</code>，对称式 <code>(x − x<sub>0</sub>)/a = (y − y<sub>0</sub>)/b = (z − z<sub>0</sub>)/c</code>（分母为零时单独写）。直线与平面的关系：<b>平行</b>当 <code>v·n = 0</code>；<b>垂直</b>当 <code>v</code> 与 <code>n</code> 平行（<code>v × n = 0</code>）；<b>相交</b>时把参数式代入平面方程解出 t。两平面夹角用 <code>cos θ = |n<sub>1</sub>·n<sub>2</sub>|/(|n<sub>1</sub>||n<sub>2</sub>|)</code>，取绝对值是因为平面夹角定义为锐角。' },

    { t: 'p', html: '点到平面的距离公式值得记：<code>d = |Ax<sub>0</sub> + By<sub>0</sub> + Cz<sub>0</sub> − D|/√(A<sup>2</sup> + B<sup>2</sup> + C<sup>2</sup>)</code>。分子是把点代入平面方程左端的绝对值，分母是法向量模长。两条异面直线的距离则用混合积：<code>d = |(P<sub>2</sub> − P<sub>1</sub>)·(v<sub>1</sub> × v<sub>2</sub>)|/|v<sub>1</sub> × v<sub>2</sub>|</code>，几何上是「以两方向为底、连线为高的平行六面体」的高。' },

    { t: 'compare', left: { title: '平面：一个法向量定方向', html: '方程 <code>Ax + By + Cz = D</code> 的系数就是法向量。判断点在哪一侧，只需看 <code>Ax + By + Cz − D</code> 的符号。两个平面平行当法向量平行。' }, right: { title: '直线：一个方向向量定方向', html: '参数式 <code>P<sub>0</sub> + tv</code> 的 <code>v</code> 是方向向量。直线与平面平行当 <code>v·n = 0</code>。两直线平行当方向向量平行，垂直当 <code>v<sub>1</sub>·v<sub>2</sub> = 0</code>。' } },

    { t: 'h', lvl: 2, text: '三、柱面与二次曲面', id: 'ch05-3' },

    { t: 'p', html: '三维曲面按方程结构分类，认识六种标准形就够应付本课。<b>柱面</b>：方程缺少一个变量，例如 <code>x<sup>2</sup> + y<sup>2</sup> = 1</code> 不含 z，表示「沿 z 轴无限延伸的圆柱面」——每一条平行于 z 轴的直线都整条落在曲面上。<b>二次曲面</b>：方程是二次的，标准形有椭球面、双叶/单叶双曲面、椭圆抛物面、双曲抛物面、圆锥面。' },

    { t: 'table', head: ['名称', '标准方程', '截面特征', '形状记忆'], rows: [
      ['椭球面', '<code>x<sup>2</sup>/a<sup>2</sup> + y<sup>2</sup>/b<sup>2</sup> + z<sup>2</sup>/c<sup>2</sup> = 1</code>', '三个方向截面都是椭圆', '压扁的球'],
      ['单叶双曲面', '<code>x<sup>2</sup>/a<sup>2</sup> + y<sup>2</sup>/b<sup>2</sup> − z<sup>2</sup>/c<sup>2</sup> = 1</code>', '水平截面是圆，竖直截面是双曲线', '冷却塔'],
      ['双叶双曲面', '<code>z<sup>2</sup>/c<sup>2</sup> − x<sup>2</sup>/a<sup>2</sup> − y<sup>2</sup>/b<sup>2</sup> = 1</code>', '两叶，中间断开', '两个碗底对底'],
      ['椭圆抛物面', '<code>z = x<sup>2</sup>/a<sup>2</sup> + y<sup>2</sup>/b<sup>2</sup></code>', '水平截面椭圆，竖直截面抛物线', '开口向上的碗'],
      ['双曲抛物面', '<code>z = x<sup>2</sup>/a<sup>2</sup> − y<sup>2</sup>/b<sup>2</sup></code>', '马鞍形，一个方向升一个方向降', '薯片'],
      ['圆锥面', '<code>z<sup>2</sup> = x<sup>2</sup>/a<sup>2</sup> + y<sup>2</sup>/b<sup>2</sup></code>', '过顶点的直线族', '双锥']
    ], caption: '识别方法：数负号个数（0 个椭球、1 个单叶、2 个双叶），看哪个变量单独出现（抛物面）' },

    { t: 'p', html: '识别二次曲面的实用步骤：<b>（1）</b>数平方项的符号：全正为椭球型，一负为单叶双曲面或双曲抛物面，两负为双叶双曲面；<b>（2）</b>看是否有变量只以一次方出现：有则是抛物面，那个变量是「开口方向」；<b>（3）</b>令某个变量为常数，看截面是什么曲线。第三步最可靠，因为它直接告诉你图形的「切片形状」，考试里也常用它来出题。' },

    { t: 'callout', kind: 'tip', title: '用截面法读图', html: '拿到 <code>z = x<sup>2</sup> − y<sup>2</sup></code>，先令 <code>z = 0</code> 得两条直线 <code>y = ±x</code>；令 <code>z = 1</code> 得双曲线 <code>x<sup>2</sup> − y<sup>2</sup> = 1</code>；令 <code>x = 0</code> 得抛物线 <code>z = −y<sup>2</sup></code> 开口向下；令 <code>y = 0</code> 得 <code>z = x<sup>2</sup></code> 开口向上。两个方向的抛物线一张一合，就是马鞍面。截面法能让你不看 3D 图也说出形状。' },

    { t: 'h', lvl: 2, text: '四、空间曲线与切向量', id: 'ch05-4' },

    { t: 'p', html: '空间曲线用向量函数表示：<code>r(t) = ⟨f(t), g(t), h(t)⟩ = f(t)i + g(t)j + h(t)k</code>。它是 ch04 参数曲线的直接推广，所有概念（极限、导数、积分）都按分量定义。<b>导数 <code>r′(t) = ⟨f′(t), g′(t), h′(t)⟩</code> 是切向量</b>，物理上是速度；<code>|r′(t)|</code> 是速率；<code>r″(t)</code> 是加速度。' },

    { t: 'p', html: '曲线的切线方程就是「过 <code>r(t<sub>0</sub>)</code>、方向 <code>r′(t<sub>0</sub>)</code>」的直线，写法与 ch05 第二部分的直线完全一致。若 <code>r′(t<sub>0</sub>) = 0</code>，该点是奇点，切线可能不存在或不唯一，需要看左右极限。例：<code>r(t) = ⟨t<sup>2</sup>, t<sup>3</sup>, 0⟩</code> 在 <code>t = 0</code> 处导数为零，曲线有一个尖点，切线方向由 <code>t → 0<sup>±</sup></code> 的极限决定。' },

    { t: 'p', html: '向量函数的积分按分量进行：<code>∫<sub>a</sub><sup>b</sup> r(t) dt = ⟨∫f, ∫g, ∫h⟩</code>。它给出「位移」而不是「路程」——若要求路程，必须对速率 <code>|r′(t)|</code> 积分，这就是下一节的弧长。这个区别在物理题里很重要：物体绕一圈回到原点，位移为零，路程却是周长。' },

    { t: 'h', lvl: 2, text: '五、弧长与曲率', id: 'ch05-5' },

    { t: 'p', html: '<b>弧长</b>：<code>s(t) = ∫<sub>a</sub><sup>t</sup> |r′(u)| du</code>，总长 <code>L = ∫<sub>a</sub><sup>b</sup> |r′(t)| dt</code>。若用弧长作参数（<code>s</code> 参数化），则 <code>|dr/ds| = 1</code>，即单位切向量 <code>T = dr/ds</code>，这让曲率的定义变得干净。' },

    { t: 'p', html: '<b>曲率</b>衡量曲线「弯曲得多快」，定义为单位切向量对弧长的变化率：<code>κ = |dT/ds|</code>。等价地 <code>κ = |T′(t)|/|r′(t)|</code>，或用叉积公式 <code>κ = |r′ × r″|/|r′|<sup>3</sup></code>。前者概念清楚，后者计算方便（不用先求 T 再求导）。曲率半径是 <code>ρ = 1/κ</code>，曲率圆是与曲线在该点「二阶相切」的圆。' },

    { t: 'p', html: '三个检验例子。<b>直线</b>：<code>r = r<sub>0</sub> + tv</code>，<code>r′ = v</code>、<code>r″ = 0</code>，故 <code>κ = 0</code>，符合「直线不弯」。<b>圆</b>：<code>r = ⟨R cos t, R sin t⟩</code>，<code>|r′| = R</code>、<code>|r′ × r″| = R<sup>2</sup></code>，故 <code>κ = 1/R</code>，半径越小越弯。<b>螺旋线</b>：<code>r = ⟨a cos t, a sin t, bt⟩</code>，<code>κ = a/(a<sup>2</sup> + b<sup>2</sup>)</code>，当 <code>b = 0</code> 退化为圆，<code>κ = 1/a</code>，一致。' },

    { t: 'table', head: ['对象', '<code>r(t)</code>', '曲率', '直觉'], rows: [
      ['直线', '<code>⟨t, 2t, 3t⟩</code>', '0', '不弯'],
      ['圆半径 R', '<code>⟨R cos t, R sin t, 0⟩</code>', '<code>1/R</code>', '半径越小越弯'],
      ['螺旋线', '<code>⟨a cos t, a sin t, bt⟩</code>', '<code>a/(a<sup>2</sup>+b<sup>2</sup>)</code>', '拉得越开越直'],
      ['抛物线', '<code>⟨t, t<sup>2</sup>, 0⟩</code>', '<code>2/(1+4t<sup>2</sup>)<sup>3/2</sup></code>', '顶点最弯'],
      ['三次曲线', '<code>⟨t, t<sup>3</sup>, 0⟩</code>', '<code>6|t|/(1+9t<sup>4</sup>)<sup>3/2</sup></code>', '<code>t = 0</code> 处曲率为 0']
    ], caption: '曲率是有量纲的：圆的曲率是长度的倒数，所以「半径 1 的圆曲率为 1」' },

    { t: 'callout', kind: 'exam', title: '曲率题的两种解法怎么选', html: '若题目只要 <code>κ</code> 的数值，用 <code>|r′ × r″|/|r′|<sup>3</sup></code>，因为不用求单位切向量；若题目还要求 <code>T</code>、<code>N</code>，就用 <code>T = r′/|r′|</code>、<code>N = T′/|T′|</code> 一步步算；若要证明某条曲线是圆，用「<code>κ</code> 为常数且挠率为零」的判据更快。三种路都要会，考场上按题目问什么选。' },

    { t: 'h', lvl: 2, text: '六、法向量、副法向量与活动标架', id: 'ch05-6' },

    { t: 'p', html: '在曲线上每一点可以架一组正交标架：<b>单位切向量</b> <code>T = r′/|r′|</code>，<b>主法向量</b> <code>N = T′/|T′|</code>（指向弯曲的内侧），<b>副法向量</b> <code>B = T × N</code>。三者两两垂直、构成右手系，称为 Frenet 标架。曲率是 <code>T</code> 转得多快，<b>挠率</b> <code>τ</code> 是 <code>B</code> 转得多快，衡量曲线「离开平面」的程度：平面曲线的挠率为零。' },

    { t: 'p', html: '本课不要求计算挠率，但要求理解三个词的方向含义。为什么需要 <code>N</code>？因为 <code>T</code> 只告诉你「往哪走」，不告诉你「往哪弯」；<code>N</code> 补上后者，于是加速度可以分解为 <code>a = a<sub>T</sub>T + a<sub>N</sub>N</code>，其中 <code>a<sub>T</sub> = d|v|/dt</code> 改变速率、<code>a<sub>N</sub> = κ|v|<sup>2</sup></code> 改变方向。这个分解在物理的曲线运动里天天用到。' },

    { t: 'p', html: '一个常见误解是「<code>N</code> 指向圆心」。这只对圆周运动成立。一般曲线的主法向量指向「曲率圆」的圆心（密切圆圆心），而密切圆是「在该点与曲线二阶相切」的圆，位置随点变化。所以 <code>N</code> 一般<b>不</b>经过某个固定点。理解这一点，才能明白为什么加速度的法向分量是 <code>κ|v|<sup>2</sup></code> 而不是 <code>|v|<sup>2</sup>/R</code>（后者只在圆上成立）。' },

    { t: 'h', lvl: 2, text: '七、空间几何的解题策略', id: 'ch05-7' },

    { t: 'p', html: '空间几何题的难点不在计算，而在「选择用哪个量」。把常见题型与首选工具列成一张对照表，做题时先归类再动手。凡是涉及「垂直」「投影」「夹角」的，先想点积；凡是涉及「法向量」「面积」「同时垂直于两个方向」的，先想叉积；凡是涉及「四点共面」「体积」的，先想混合积。' },

    { t: 'table', head: ['题目问什么', '首选工具', '关键式子'], rows: [
      ['两向量夹角', '点积', '<code>cos θ = u·v/(|u||v|)</code>'],
      ['判断垂直 / 平行', '点积 / 叉积', '<code>u·v = 0</code> / <code>u × v = 0</code>'],
      ['过三点的平面', '叉积', '<code>n = (B−A) × (C−A)</code>'],
      ['点到直线距离', '叉积', '<code>|QP × v|/|v|</code>'],
      ['点到平面距离', '代入公式', '<code>|Ax<sub>0</sub>+By<sub>0</sub>+Cz<sub>0</sub>−D|/|n|</code>'],
      ['两异面直线距离', '混合积', '<code>|(P<sub>2</sub>−P<sub>1</sub>)·(v<sub>1</sub>×v<sub>2</sub>)|/|v<sub>1</sub>×v<sub>2</sub>|</code>'],
      ['曲线在某点的切线', '求导', '<code>r′(t<sub>0</sub>)</code> 作方向向量'],
      ['曲线弯曲程度', '曲率公式', '<code>|r′ × r″|/|r′|<sup>3</sup></code>']
    ], caption: '先归类再计算，能避免「算出答案但用错工具」的隐性错误' },

    { t: 'p', html: '最后提醒两件事。<b>第一，方向约定要写清。</b>法向量有正反两个，平面方程乘 −1 仍是同一个平面；但曲面积分里 <code>n</code> 的方向决定符号，所以 ch07 会要求「外法向」或「上侧」这类约定。现在养成习惯：写平面方程时说法向量取哪个方向，写直线时说明参数增加的方向。<b>第二，符号错误比计算错误更致命。</b>叉积的顺序、混合积的绝对值、曲率公式里的三次方，任一处出错都会让整题作废，而检查的方法只有一个：代特殊值验证（如取圆、取直线）看公式是否退化成已知结果。' },

    { t: 'terms', items: [
      { en: 'dot product', zh: '点积', html: '<code>u·v = |u||v|cos θ</code>；判垂直、求投影与夹角。' },
      { en: 'cross product', zh: '叉积', html: '向量，垂直于两因子，模长为平行四边形面积。' },
      { en: 'scalar triple product', zh: '混合积', html: '<code>u·(v × w)</code>；绝对值等于平行六面体体积。' },
      { en: 'normal vector', zh: '法向量', html: '垂直于平面或曲面的向量；平面方程系数即法向量。' },
      { en: 'quadric surface', zh: '二次曲面', html: '三元二次方程表示的曲面；六种标准形需能识别。' },
      { en: 'curvature', zh: '曲率', html: '<code>κ = |dT/ds|</code>；衡量单位切向量的转动速率。' },
      { en: 'Frenet frame', zh: '活动标架', html: '<code>T, N, B</code> 构成的正交右手系；<code>B = T × N</code>。' }
    ] },

    { t: 'quiz', qid: 'ch05-q1' },
    { t: 'quiz', qid: 'ch05-q2' },
    { t: 'quiz', qid: 'ch05-q3' },

    { t: 'keypoint', items: [
      { title: '点积判垂直、叉积判平行', html: '这是空间几何的两条基本判据；混合积判共面，三者合起来覆盖大部分判定题。' },
      { title: '系数即法向量', html: '<code>Ax + By + Cz = D</code> 的法向量是 <code>⟨A, B, C⟩</code>，平面题几乎都从这里开始。' },
      { title: '六种二次曲面看符号', html: '平方项全正为椭球，一负为单叶或双曲抛物面，两负为双叶；单独一次项定开口。' },
      { title: '曲率是 T 的变化率', html: '<code>κ = |dT/ds| = |r′ × r″|/|r′|<sup>3</sup></code>；直线为 0，圆为 <code>1/R</code>。' },
      { title: '位移与路程不同', html: '<code>∫r′dt</code> 是位移，<code>∫|r′|dt</code> 是路程；绕一圈位移为零但路程不为零。' },
      { title: '方向约定必须写', html: '法向量、参数方向、曲面积分的外法向都要说明；符号错会让整题作废。' }
    ] },

    { t: 'checklist', id: 'ch05', items: [
      '我能计算点积、叉积与混合积，并说出它们各自的几何意义',
      '我能由三点写出平面方程，并验证第四点是否在该平面上',
      '我能写出过一点的直线参数式与对称式，并处理分母为零的情形',
      '我能判断直线与平面是平行、垂直还是相交，并求出交点',
      '我能用截面法识别六种二次曲面，并说出各自的对称轴',
      '我能对空间曲线求切向量、切线方程与弧长',
      '我能用 <code>|r′ × r″|/|r′|<sup>3</sup></code> 计算曲率，并用圆与直线检验结果',
      '我能解释 <code>T, N, B</code> 各自的含义，并说明 <code>N</code> 为什么不一定指向固定点',
      '我能根据题目问法选择点积、叉积或混合积，并说明理由'
    ] },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章对应 Thomas《Calculus》第 13 版 SI 单位第 12.1–12.5 节（三维坐标系、向量、点积、叉积、直线与平面、柱面与二次曲面）与第 13.1–13.4 节（空间曲线、切线、向量函数积分、弧长、曲率与主法向量）。按课程大纲，13.5（挠率与 Frenet 标架的完整理论）与 13.6（空间运动）跳过，因此本章只介绍 <code>T, N, B</code> 的几何含义，不要求计算挠率、不讨论开普勒定律等应用。曲面积分所需的参数曲面与法向量放在 ch07，本章只准备叉积与曲面识别的工具。' }
  ]
});
