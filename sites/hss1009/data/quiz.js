/* =====================================================================
 * quiz.js · 分章题库（PACK.items）
 * 每项字段：{ id:'ch01-q1', ch:'ch01', kp:'ch01-1', tier:1, type:'mcq'|'tf'|'fill'|'multi',
 *            difficulty:1, tags:['concept'], stem, options:[{text, correct:true?}], explain }
 * fill 类型额外含 answer / accept。
 * 目标：8 章 × 7 题 = 56 题；每章 q1–q3 与 chXX.js 内嵌题的 qid 一一对应。
 * ===================================================================== */
(function () {
  var PACK = {
    items: [
      /* ---------------- ch00 课程地图 ---------------- */
      {
        id: 'ch00-q1', ch: 'ch00', kp: 'ch00-5', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '本站强调两处「硬依赖」，下面哪一组说对了？',
        options: [
          { text: '标准差（ch02）支撑标准误（ch03）；抽样分布（ch03）支撑 p 值（ch04）', correct: true },
          { text: '均值（ch02）支撑 F 比（ch06）；卡方（ch07）支撑回归（ch07）' },
          { text: '测量尺度（ch01）支撑标准误（ch03）；置信区间（ch03）支撑方差分析（ch06）' },
          { text: 'SPSS 操作（ch00）支撑抽样误差（ch03）；相关（ch07）支撑假设检验（ch04）' }
        ],
        explain: '标准误的公式是 s/√n，分子就是样本标准差，所以没有 ch02 的标准差就没有 ch03 的标准误；p 值的定义是「H<sub>0</sub> 成立时抽到当前或更极端结果的概率」，这句话里的「抽到」依赖 ch03 的抽样分布。这两处断了，后面只能背菜单。'
      },
      {
        id: 'ch00-q2', ch: 'ch00', kp: 'ch00-3', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '只有一道题、用 1–5 分测量的「图书馆满意度」，严格说属于哪种测量尺度？',
        options: [
          { text: '定序（ordinal）：能排序，但间距不一定相等', correct: true },
          { text: '定比（ratio）：有绝对零点，可以算比值' },
          { text: '定距（interval）：单位相等，零点任意' },
          { text: '定类（nominal）：只能分类，不能排序' }
        ],
        explain: '单题李克特量表严格说是定序：能确定「4 分比 3 分满意」，但不能确定「4 与 3 的差」等于「3 与 2 的差」。多道题加总并报告信度后，才常被当作近似定距处理。'
      },
      {
        id: 'ch00-q3', ch: 'ch00', kp: 'ch00-4', tier: 1, type: 'tf', difficulty: 1, tags: ['spss'],
        stem: '要做单因素方差分析，SPSS 数据必须是「一列因变量 + 一列分组变量」的长表，而不是把每组拆成一列。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '方差分析需要 Factor（分组变量）与 Dependent（因变量）两个角色，宽表里「每组一列」没法指定 Factor。宽表可用 Data &gt; Restructure 转换，或在录入阶段就按长表组织。'
      },
      {
        id: 'ch00-q4', ch: 'ch00', kp: 'ch00-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['method'],
        stem: '五步流程的第一步是什么？',
        options: [
          { text: '把模糊的问题改写成有组别、有变量、能写进 H<sub>0</sub> 的可检验句子', correct: true },
          { text: '打开 SPSS，先跑一遍描述统计看看有什么' },
          { text: '先确定用 t 检验还是方差分析' },
          { text: '先把数据里所有异常值删掉' }
        ],
        explain: '「学生对食堂满意吗」没有比较对象，无法检验；改成「大一与大四的满意度均值是否不同」才有 H<sub>0</sub>。方法与清理都在问题清楚之后，顺序颠倒会让后面每一步都失去依据。'
      },
      {
        id: 'ch00-q5', ch: 'ch00', kp: 'ch00-1', tier: 2, type: 'multi', difficulty: 2, tags: ['method'],
        stem: '下列哪些属于概率抽样（每个个体有已知的入样概率）？（多选）',
        options: [
          { text: '简单随机抽样：从名册里随机抽 200 人', correct: true },
          { text: '分层抽样：按年级分层，各层内随机抽', correct: true },
          { text: '整群抽样：随机抽若干个班，整班入样', correct: true },
          { text: '在食堂门口拦住刚打完饭的人发问卷' }
        ],
        explain: '前三种都有明确的随机机制，入样概率可算，才能估计标准误、才能推断回总体。食堂门口拦人属于方便抽样，样本系统性偏向「正在吃饭、心情尚可」的人，p 值再小也不能推广。'
      },
      {
        id: 'ch00-q6', ch: 'ch00', kp: 'ch00-6', tier: 1, type: 'fill', difficulty: 1, tags: ['report'],
        stem: '规范的报告句要给出五件东西：统计量、p 值、效应量、方向，以及另一个决定分布形状的量。它是什么？（填中文，三个字）',
        answer: '自由度',
        accept: ['自由度', 'df', 'degrees of freedom'],
        explain: '五件套是统计量、自由度、p 值、效应量、方向。自由度决定用哪条分布曲线查临界值，也是别人复核你结论的必需信息，例如 t(60) = 2.50 里的 60。'
      },
      {
        id: 'ch00-q7', ch: 'ch00', kp: 'ch00-7', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '关于本站的资料库，下列说法正确的是：',
        options: [
          { text: '只收录课程目录里真实存在的文件；本课只有一本教材 PDF，所以只有一组一条', correct: true },
          { text: '为了看起来丰富，把网上找到的同类教材都收进来' },
          { text: '资料库里放的是本站自己编写的讲义，与课程目录无关' },
          { text: '资料库条目越多，说明课程资料越全' }
        ],
        explain: '资料库只登记课程目录里真实存在的文件，不凑数。本课公开资料只有《Understanding Statistics for the Social Sciences with IBM SPSS》这一本 PDF。'
      },

      /* ---------------- ch01 变量与频数 ---------------- */
      {
        id: 'ch01-q1', ch: 'ch01', kp: 'ch01-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '把「年级」编码为 1=大一、2=大二、3=大三、4=大四，它属于哪种尺度？',
        options: [
          { text: '定序（ordinal）：能排出高低，但 3 与 2 的差不等于 2 与 1 的差', correct: true },
          { text: '定比（ratio）：有绝对零点，可以算「大四是大一的两倍」' },
          { text: '定距（interval）：单位相等，可以算平均年级' },
          { text: '定类（nominal）：只能分类，不能排序' }
        ],
        explain: '年级有天然顺序，但没有相等的单位，也没有绝对零点（不存在「0 年级」），所以是定序。可以对它求中位数、做秩检验，但不该求均值，更不该说「大四是研一的两倍」。'
      },
      {
        id: 'ch01-q2', ch: 'ch01', kp: 'ch01-3', tier: 1, type: 'mcq', difficulty: 1, tags: ['table'],
        stem: '30 名学生学习时数的分组频数表里，频数最多的是哪一组、多少人？',
        options: [
          { text: '4–6 小时组，10 人（33.3%）', correct: true },
          { text: '2–4 小时组，9 人（30.0%）' },
          { text: '6–8 小时组，5 人（16.7%）' },
          { text: '8 小时以上组，2 人（6.7%）' }
        ],
        explain: '分组频数表为 0–2 小时 4 人、2–4 小时 9 人、4–6 小时 10 人、6–8 小时 5 人、8 小时以上 2 人，合计 30 人。4–6 小时组的 10 人占 33.3%，是峰值所在。'
      },
      {
        id: 'ch01-q3', ch: 'ch01', kp: 'ch01-5', tier: 1, type: 'tf', difficulty: 1, tags: ['table'],
        stem: '性别 × 是否通过的列联表按行百分比计算：男生通过率 60%（18/30），女生通过率 30%（9/30），说明本样本中男生的通过率更高。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '行百分比的分母是该行合计（男 30 人、女 30 人），所以 18/30 = 60%、9/30 = 30%。列联表比较组间差异时必须先确定分母是谁，用列百分比会得到完全不同的数字。'
      },
      {
        id: 'ch01-q4', ch: 'ch01', kp: 'ch01-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '研究「学生对课程的满意度」，问卷每人一份、每份记录一名学生的回答。这里的分析单位（unit of analysis）是什么？',
        options: [
          { text: '学生（一个人一行）', correct: true },
          { text: '课程（一门课一行）' },
          { text: '问卷上的每一道题' },
          { text: '整个学院' }
        ],
        explain: '分析单位是「一行代表什么」。这里一份问卷对应一名学生，所以单位是学生。若把同一学生的多门课评价堆在一行，单位就变成了「学生 × 课程」，标准误与自由度的算法都会变。'
      },
      {
        id: 'ch01-q5', ch: 'ch01', kp: 'ch01-4', tier: 1, type: 'mcq', difficulty: 1, tags: ['graph'],
        stem: '要展示「每天学习时数」这个连续变量的分布形状，最合适的图是：',
        options: [
          { text: '直方图：把连续取值分箱，柱高表示频数', correct: true },
          { text: '条形图：每个类别一根柱子，柱子之间留空隙' },
          { text: '饼图：展示各部分占整体的比例' },
          { text: '折线图：按时间顺序连接各点' }
        ],
        explain: '连续变量先分组再画直方图，柱子相邻以体现取值的连续性；条形图用于定类/定序变量，柱子之间留空隙。饼图适合展示构成比例，不适合看分布形状。'
      },
      {
        id: 'ch01-q6', ch: 'ch01', kp: 'ch01-6', tier: 2, type: 'multi', difficulty: 2, tags: ['data'],
        stem: '数据清理阶段应当做的事有哪些？（多选）',
        options: [
          { text: '检查缺失值，说明是「未作答」还是「不适用」', correct: true },
          { text: '核对异常值是否来自录入错误（如 5 分制里出现 7）', correct: true },
          { text: '统一反向题的编码方向，保证量表同向', correct: true },
          { text: '把结果不理想的观测直接删掉，让 p 值变小' }
        ],
        explain: '清理是查错与统一口径，不是修改结论。前三条都属于记录在案的技术处理；为了显著性删数据属于学术不端，而且会破坏样本代表性。任何删除都要写明理由与数量。'
      },
      {
        id: 'ch01-q7', ch: 'ch01', kp: 'ch01-7', tier: 1, type: 'fill', difficulty: 1, tags: ['spss'],
        stem: '在 SPSS 里要生成一张分类变量的频数表与百分比，应使用 Analyze &gt; Descriptive Statistics 下的哪个过程？（填英文单词）',
        answer: 'Frequencies',
        accept: ['Frequencies', 'frequencies', '频数'],
        explain: '路径是 Analyze &gt; Descriptive Statistics &gt; Frequencies，把变量拖进 Variable(s)，勾 Display frequency tables。连续变量用它会被切成一大堆取值的表，应先分组（Visual Binning）再统计。'
      },

      /* ---------------- ch02 集中与离散 ---------------- */
      {
        id: 'ch02-q1', ch: 'ch02', kp: 'ch02-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '一组居民月收入的分布明显右偏（少数高收入者拉长右尾）。要描述「典型居民的收入」，最合适的指标是：',
        options: [
          { text: '中位数：不受少数极端高值影响', correct: true },
          { text: '均值：用到了每一个观测的信息' },
          { text: '极差：最大值减最小值' },
          { text: '众数：出现次数最多的收入值' }
        ],
        explain: '右偏分布里均值被右尾拉高，会高估「典型的人」；中位数是第 50 百分位，对极端值稳健。描述偏态数据时通常中位数配四分位距，均值配标准差并说明偏态。'
      },
      {
        id: 'ch02-q2', ch: 'ch02', kp: 'ch02-3', tier: 2, type: 'mcq', difficulty: 2, tags: ['calc'],
        stem: '10 个观测的偏差平方和 SS = 224。样本方差 s<sup>2</sup> 是多少？',
        options: [
          { text: '24.89（224 ÷ 9）', correct: true },
          { text: '22.40（224 ÷ 10）' },
          { text: '224.00（不除自由度）' },
          { text: '4.99（224 ÷ 9 再开方）' }
        ],
        explain: '样本方差 s<sup>2</sup> = SS/(n−1) = 224/9 = 24.89。除以 n−1 而不是 n，是因为用样本均值代替总体均值消耗了一个自由度，这样估计才是无偏的。开方后 s ≈ 4.99，那是标准差。'
      },
      {
        id: 'ch02-q3', ch: 'ch02', kp: 'ch02-6', tier: 1, type: 'tf', difficulty: 1, tags: ['concept'],
        stem: 'z 分数只能用于同一个量表内部的比较，不能跨量表比较。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: 'z 分数的作用正是把不同量表放到同一把尺上：z = (x − x̄)/s，标准化后均值 0、标准差 1，于是「语文 85 分」与「数学 78 分」谁在本班更突出就可以比较了。所以「不能跨量表」的说法是错的。'
      },
      {
        id: 'ch02-q4', ch: 'ch02', kp: 'ch02-4', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '样本方差的分母为什么是 n − 1 而不是 n？',
        options: [
          { text: '因为用样本均值代替总体均值，消耗了一个自由度，除以 n−1 才是无偏估计', correct: true },
          { text: '因为样本量总是比总体小 1' },
          { text: '因为除以 n 会让标准差变成负数' },
          { text: '这是约定俗成，两种算法结果完全一样' }
        ],
        explain: '偏差是围绕样本均值算的，而样本均值本身让偏差之和恒为 0，n 个偏差里只有 n−1 个可以自由变动。除以 n 会系统性低估总体方差，除以 n−1 才能让它期望等于 σ<sup>2</sup>。n 越大两者差别越小。'
      },
      {
        id: 'ch02-q5', ch: 'ch02', kp: 'ch02-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '在一组数据里加入一个远高于其余观测的极端值，均值与中位数会怎样变化？',
        options: [
          { text: '均值明显变大，中位数几乎不变', correct: true },
          { text: '两者都明显变大，且幅度相同' },
          { text: '均值几乎不变，中位数明显变大' },
          { text: '两者都不变，因为只是多了一个观测' }
        ],
        explain: '均值把每个观测都算进分子，极端值会直接抬高它；中位数只看位置，把极端值排到末尾后中间位置几乎不动。这正是判断「该用哪个代表值」的实用方法：比较均值与中位数的差距，差距大就说明分布偏。'
      },
      {
        id: 'ch02-q6', ch: 'ch02', kp: 'ch02-5', tier: 1, type: 'fill', difficulty: 1, tags: ['concept'],
        stem: '数据近似正态时，约 95% 的观测落在均值加减几个标准差之内？（填数字）',
        answer: '2',
        accept: ['2', '2个', '两'],
        explain: '经验法则（68–95–99.7）：约 68% 落在 ±1 个标准差内，95% 落在 ±2 个内，99.7% 落在 ±3 个内。切比雪夫不等式给出更宽松但与分布形状无关的界：至少 75% 落在 ±2 个内。'
      },
      {
        id: 'ch02-q7', ch: 'ch02', kp: 'ch02-7', tier: 2, type: 'mcq', difficulty: 2, tags: ['spss'],
        stem: '想同时看一组数据的箱线图、偏度、极端值与 5% 修剪均值，应使用 SPSS 的哪个过程？',
        options: [
          { text: 'Analyze &gt; Descriptive Statistics &gt; Explore', correct: true },
          { text: 'Analyze &gt; Descriptive Statistics &gt; Frequencies' },
          { text: 'Analyze &gt; Compare Means &gt; One-Sample T Test' },
          { text: 'Analyze &gt; Correlate &gt; Bivariate' }
        ],
        explain: 'Explore 一次给出描述统计、极端值表（Extreme Values）、正态性检验（Shapiro-Wilk）与箱线图/直方图，是做数据检查的首选。Frequencies 只给频数与少量描述统计，不含箱线图与极端值表。'
      },

      /* ---------------- ch03 抽样分布 ---------------- */
      {
        id: 'ch03-q1', ch: 'ch03', kp: 'ch03-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['calc'],
        stem: '总体标准差 σ = 15，样本量 n = 100，样本均值的标准误是多少？',
        options: [
          { text: '1.50', correct: true },
          { text: '0.15' },
          { text: '15.00' },
          { text: '3.00' }
        ],
        explain: 'SE = σ/√n = 15/√100 = 15/10 = 1.50。√n 是 10 而不是 100，这是最常见的手算错误；样本量翻 4 倍才能把标准误减半。'
      },
      {
        id: 'ch03-q2', ch: 'ch03', kp: 'ch03-3', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '关于中心极限定理（CLT），下列说法正确的是：',
        options: [
          { text: '样本量增大时，样本均值的抽样分布趋近正态，与总体原本的形状无关', correct: true },
          { text: '只有总体本身是正态分布时，样本均值才近似正态' },
          { text: '它说明样本均值一定等于总体均值' },
          { text: '它只适用于二分类变量' }
        ],
        explain: 'CLT 的关键在于「与总体形状无关」：无论总体是偏态、均匀还是双峰，n 足够大（经验上 30 左右）时 x̄ 的抽样分布都近似正态。这才使得 t 检验、置信区间在非正态总体下仍可使用。'
      },
      {
        id: 'ch03-q3', ch: 'ch03', kp: 'ch03-5', tier: 2, type: 'tf', difficulty: 2, tags: ['concept'],
        stem: '95% 置信区间的正确解释是：如果重复抽样很多次，每次算一个区间，约 95% 的区间会包含总体均值 μ。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '频率学派的置信区间描述的是「方法的长期覆盖率」，不是「μ 落在这一次区间里的概率」。μ 是固定值，区间是随机的；一旦算出 [94.1, 105.9]，μ 要么在里面要么不在，概率是 0 或 1。'
      },
      {
        id: 'ch03-q4', ch: 'ch03', kp: 'ch03-4', tier: 1, type: 'mcq', difficulty: 1, tags: ['calc'],
        stem: '其他条件不变，要把置信区间的半宽（误差）缩小到原来的一半，样本量需要变成原来的几倍？',
        options: [
          { text: '4 倍', correct: true },
          { text: '2 倍' },
          { text: '8 倍' },
          { text: '不变，误差只由置信水平决定' }
        ],
        explain: '半宽 E = z × σ/√n，与 √n 成反比。要让 E 减半，√n 要加倍，n 就要变成 4 倍。这也是「4 倍样本换一半误差」的由来：σ = 15 时，n 从 100 增到 400，半宽从 2.94 降到 1.47。'
      },
      {
        id: 'ch03-q5', ch: 'ch03', kp: 'ch03-1', tier: 1, type: 'fill', difficulty: 1, tags: ['concept'],
        stem: '抽样分布的标准差有一个专门的名字，中文是三个字。它是什么？',
        answer: '标准误',
        accept: ['标准误', 'standard error', 'SE'],
        explain: '标准误（standard error, SE）描述统计量在反复抽样中的抖动幅度。别把它和标准差混：标准差描述「个体之间差多少」，标准误描述「样本均值之间差多少」，后者随 n 增大而变小。'
      },
      {
        id: 'ch03-q6', ch: 'ch03', kp: 'ch03-6', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '下列哪种情况会让置信区间变宽？',
        options: [
          { text: '把置信水平从 95% 提高到 99%', correct: true },
          { text: '把样本量从 100 增加到 400' },
          { text: '样本标准差变小' },
          { text: '把置信水平从 95% 降到 90%' }
        ],
        explain: '99% 对应的 z 是 2.576，比 95% 的 1.960 大，区间自然更宽。区间宽度与置信水平同向、与样本量和标准差反向：想又窄又可信，只能靠增大样本量。'
      },
      {
        id: 'ch03-q7', ch: 'ch03', kp: 'ch03-7', tier: 2, type: 'multi', difficulty: 2, tags: ['method'],
        stem: '关于 Bootstrap（自助法），下列说法正确的有：（多选）',
        options: [
          { text: '从原样本中有放回地反复重抽，得到统计量的经验分布', correct: true },
          { text: '不需要假设总体正态，可用于中位数、相关系数等复杂统计量', correct: true },
          { text: '重抽次数越多，区间估计越稳定', correct: true },
          { text: '它能把非概率样本变成概率样本' }
        ],
        explain: 'Bootstrap 用「有放回重抽」近似抽样分布，优点是摆脱正态假设、能处理没有解析公式的统计量。但它只反映原样本内部的变异，样本本身的偏差（方便抽样）无法靠它修正。'
      },

      /* ---------------- ch04 假设检验 ---------------- */
      {
        id: 'ch04-q1', ch: 'ch04', kp: 'ch04-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '某品牌宣称其产品平均寿命 12 个月，你想检验实际是否更低。H<sub>0</sub> 应该写成：',
        options: [
          { text: 'H<sub>0</sub>: μ = 12（总体均值等于宣称值）', correct: true },
          { text: 'H<sub>0</sub>: x̄ = 10.4（样本均值等于观测值）' },
          { text: 'H<sub>0</sub>: μ &lt; 12（总体均值低于宣称值）' },
          { text: 'H<sub>0</sub>: s = 4（样本标准差等于 4）' }
        ],
        explain: 'H<sub>0</sub> 永远写「无差别」的等式，且针对总体参数 μ 而不是样本统计量 x̄。把观测到的 10.4 写进 H<sub>0</sub> 是循环论证——那样数据永远无法反驳它。方向性的主张放在 H<sub>1</sub>: μ &lt; 12。'
      },
      {
        id: 'ch04-q2', ch: 'ch04', kp: 'ch04-4', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: 'p 值的准确定义是：',
        options: [
          { text: '假定 H<sub>0</sub> 为真时，得到当前或更极端结果的概率', correct: true },
          { text: 'H<sub>0</sub> 为真的概率' },
          { text: 'H<sub>1</sub> 为真的概率' },
          { text: '结论出错的概率' }
        ],
        explain: 'p = P(数据至少这么极端 | H<sub>0</sub> 为真)，条件在 H<sub>0</sub> 上，所以它不能反过来告诉你「H<sub>0</sub> 为真的概率」。把 p 说成「结论错误的概率」是最常见的误读，两者完全不同。'
      },
      {
        id: 'ch04-q3', ch: 'ch04', kp: 'ch04-5', tier: 1, type: 'tf', difficulty: 1, tags: ['method'],
        stem: '单尾检验比双尾更容易达到显著，但方向必须在看数据之前确定，否则 α 会被偷偷放大。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '单尾把全部 α 押在一侧，同样的效应更容易越过门槛，所以功效更高。但若先看数据再选方向，等于用了两次机会，实际 α 接近翻倍（.05 变成 .10），这在方法上是不可接受的。'
      },
      {
        id: 'ch04-q4', ch: 'ch04', kp: 'ch04-3', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '取 α = .05 的含义是：',
        options: [
          { text: 'H<sub>0</sub> 为真时，长期来看约 5% 的检验会错误地拒绝它', correct: true },
          { text: '5% 的数据是错的' },
          { text: '有 5% 的把握说结论正确' },
          { text: '效应量只有 5%' }
        ],
        explain: 'α 是「弃真错误」的长期频率上限，是事先设定的门槛，不是对某一次结论的置信度。它也不含任何关于效应大小的信息——那是 Cohen’s d 与置信区间的事。'
      },
      {
        id: 'ch04-q5', ch: 'ch04', kp: 'ch04-6', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '下列哪种做法能提高统计功效（power）？',
        options: [
          { text: '增大样本量', correct: true },
          { text: '把 α 从 .05 降到 .01' },
          { text: '增大数据的随机误差' },
          { text: '把双侧检验改成先看数据再决定单双侧' }
        ],
        explain: '功效 = 1 − β，随样本量、真实效应量与 α 增大而提高。降低 α 会让门槛更严，反而降低功效；增加误差会淹没效应。最后一项不是提高功效，而是作弊。'
      },
      {
        id: 'ch04-q6', ch: 'ch04', kp: 'ch04-7', tier: 1, type: 'fill', difficulty: 1, tags: ['spss'],
        stem: 'SPSS 的检验输出里，标着 p 值的那一列叫什么？（填英文缩写）',
        answer: 'Sig.',
        accept: ['Sig.', 'Sig', 'sig', '显著性'],
        explain: 'SPSS 输出中的 Sig.（significance）就是 p 值，常见形式为 Sig. (2-tailed)。它小于你事先设定的 α 时拒绝 H<sub>0</sub>。注意 .000 表示「小于 .0005」，应写作 p &lt; .001，而不是 p = .000。'
      },
      {
        id: 'ch04-q7', ch: 'ch04', kp: 'ch04-1', tier: 3, type: 'multi', difficulty: 3, tags: ['concept'],
        stem: '关于「不拒绝 H<sub>0</sub>」，下列说法正确的有：（多选）',
        options: [
          { text: '它不等于「证明 H<sub>0</sub> 成立」，只说明证据不足以拒绝', correct: true },
          { text: '样本量很小时很容易出现这种结果，因为功效不足', correct: true },
          { text: '此时仍应报告效应量与置信区间，说明差异可能有多大', correct: true },
          { text: '它说明两个总体参数完全相等' }
        ],
        explain: '不拒绝 H<sub>0</sub> 是「证据不足」，不是「证明无差异」。小样本时标准误大、功效低，真实存在的差异也常检不出；此时置信区间能告诉读者「差异可能小到什么程度」，比一句「不显著」有信息量得多。'
      },

      /* ---------------- ch05 两组均值比较 ---------------- */
      {
        id: 'ch05-q1', ch: 'ch05', kp: 'ch05-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['method'],
        stem: '同一批 20 名学生在培训前后各测一次成绩，要比较两次的均值，应使用：',
        options: [
          { text: '配对样本 t 检验：把每人两次测量相减，对差值做单样本 t', correct: true },
          { text: '独立样本 t 检验：把前测 20 人与后测 20 人当成两批人' },
          { text: '单样本 t 检验：把后测均值与前测均值比较' },
          { text: '卡方独立性检验：看前后测是否独立' }
        ],
        explain: '同一批人测两次属于配对设计，差值能消掉个体差异，检验更灵敏。当独立样本处理会把个体差异全塞进误差项，还会把自由度从 19 虚增到 38，结论往往被稀释。'
      },
      {
        id: 'ch05-q2', ch: 'ch05', kp: 'ch05-3', tier: 2, type: 'mcq', difficulty: 2, tags: ['calc'],
        stem: '一项独立样本 t 检验报告 t(60) = 2.50。两组样本量之和是多少？',
        options: [
          { text: '62（df = n<sub>1</sub> + n<sub>2</sub> − 2）', correct: true },
          { text: '60' },
          { text: '61' },
          { text: '不能确定，需要知道两组各自的人数' }
        ],
        explain: '独立样本 t 的自由度是 n<sub>1</sub> + n<sub>2</sub> − 2，所以 n<sub>1</sub> + n<sub>2</sub> = 62。自由度不是「样本量」，它扣掉了估计两个均值所消耗的两个自由度。配对 t 的 df 才是「对数 − 1」。'
      },
      {
        id: 'ch05-q3', ch: 'ch05', kp: 'ch05-5', tier: 1, type: 'mcq', difficulty: 2, tags: ['calc'],
        stem: '20 名学生培训前后测，差值均值 3.7、差值标准差 6.2。配对 t 的标准误是多少？',
        options: [
          { text: '1.386（6.2 ÷ √20）', correct: true },
          { text: '6.20（直接用差值标准差）' },
          { text: '0.31（3.7 ÷ 12）' },
          { text: '1.386 但要用前测的标准差' }
        ],
        explain: '配对 t 的分母是「差值标准差 ÷ √n」= 6.2/√20 = 1.386，t = 3.7/1.386 = 2.67。最常见错误是拿前测或后测各自的标准差当分子——那样算出来的不是差值的标准误。'
      },
      {
        id: 'ch05-q4', ch: 'ch05', kp: 'ch05-4', tier: 2, type: 'mcq', difficulty: 2, tags: ['spss'],
        stem: '独立样本 t 的输出里 Levene 检验的 Sig. = .02。接下来该读哪一行？',
        options: [
          { text: 'Equal variances not assumed（Welch 那一行），并报告其小数自由度', correct: true },
          { text: 'Equal variances assumed（第一行），因为 Levene 显著说明方差齐' },
          { text: '两行取平均' },
          { text: 'Levene 显著说明 t 检验不能用，必须改用相关分析' }
        ],
        explain: 'Levene 的 H<sub>0</sub> 是「方差相等」，Sig. = .02 &lt; .05 表示方差不齐，因此要读 Welch 那一行。很多人把「显著」误当成「通过」，方向正好反了。'
      },
      {
        id: 'ch05-q5', ch: 'ch05', kp: 'ch05-6', tier: 1, type: 'fill', difficulty: 1, tags: ['concept'],
        stem: '按 Cohen 的惯例，两组均值比较的效应量 d 达到多少算「中等」？（填小数）',
        answer: '0.5',
        accept: ['0.5', '.5', '0.50'],
        explain: '惯例是 0.2 小、0.5 中、0.8 大。这只是参照，不是硬标准：教育干预里 0.3 已属可观，而两组分布重叠约 80%，实际意义要结合情境判断。'
      },
      {
        id: 'ch05-q6', ch: 'ch05', kp: 'ch05-2', tier: 1, type: 'tf', difficulty: 1, tags: ['method'],
        stem: '单样本 t 检验也可以用来比较两个样本的均值，只要把其中一组的均值当作 μ<sub>0</sub>。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: 'μ<sub>0</sub> 必须来自外部（校规、基准、理论值）；若把它换成另一组的样本均值，就忽略了那个均值自身的抽样误差，标准误被低估、t 值被夸大。两组比较必须用独立或配对 t，所以这个说法是错的。'
      },
      {
        id: 'ch05-q7', ch: 'ch05', kp: 'ch05-7', tier: 2, type: 'multi', difficulty: 2, tags: ['report'],
        stem: '规范的 t 检验报告应包含下列哪些内容？（多选）',
        options: [
          { text: 't 值与自由度，如 t(60) = 2.50', correct: true },
          { text: 'p 值，如 p = .015', correct: true },
          { text: '效应量，如 d = 0.64', correct: true },
          { text: '两组的均值与差值的 95% 置信区间', correct: true },
          { text: '只写「差异显著」，其余从略' }
        ],
        explain: '四件套（t、df、p、效应量）加上两组均值与差值的置信区间，读者才能判断「差多少、有多确定」。只写「显著」等于没报告，因为既没有大小也没有方向。'
      },

      /* ---------------- ch06 多组均值比较 ---------------- */
      {
        id: 'ch06-q1', ch: 'ch06', kp: 'ch06-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '5 个组两两比较需要做 10 次 t 检验。若每次 α = .05 且相互独立，至少误报一次的概率约为：',
        options: [
          { text: '40%（1 − 0.95<sup>10</sup>）', correct: true },
          { text: '5%' },
          { text: '10%' },
          { text: '50%（10 × 5%）正好一半' }
        ],
        explain: '族错误率 = 1 − (1−α)<sup>k</sup> = 1 − 0.95<sup>10</sup> ≈ 40%。注意这是下限：这些比较共用同一批数据，并不独立，真实膨胀往往更严重。这就是先做 F 检验再做事后比较的理由。'
      },
      {
        id: 'ch06-q2', ch: 'ch06', kp: 'ch06-3', tier: 2, type: 'mcq', difficulty: 2, tags: ['calc'],
        stem: '一项单因素方差分析报告 F(2, 27) = 1.51。由此可以推出：',
        options: [
          { text: '共 3 组、总样本量 30：df<sub>组间</sub> = k−1 = 2，df<sub>组内</sub> = N−k = 27', correct: true },
          { text: '共 27 组、每组 2 人' },
          { text: '总样本量 29，分成 2 组' },
          { text: '样本量无法从自由度推出' }
        ],
        explain: 'df<sub>组间</sub> = k − 1 = 2 得 k = 3；df<sub>组内</sub> = N − k = 27 得 N = 30。两个自由度相加是 N − 1 = 29，这也是一致的检验。F 后面括号里的顺序是（组间, 组内），写反是常见错误。'
      },
      {
        id: 'ch06-q3', ch: 'ch06', kp: 'ch06-5', tier: 1, type: 'mcq', difficulty: 1, tags: ['method'],
        stem: '单因素方差分析的 F 检验显著之后，下一步应当做什么？',
        options: [
          { text: '做事后比较（如 Tukey HSD），找出哪几组之间存在差异', correct: true },
          { text: '直接下结论：所有组的均值两两都不相等' },
          { text: '再跑三次 t 检验，因为 F 只说「有差异」' },
          { text: '停止分析，F 显著已经回答了问题' }
        ],
        explain: 'F 显著只说明「至少有一组与其余不全等」，不指明是哪几组。事后比较要在控制族错误率的前提下做两两比较，Tukey HSD 是最常用的选择；不能改回普通 t 检验。'
      },
      {
        id: 'ch06-q4', ch: 'ch06', kp: 'ch06-2', tier: 1, type: 'mcq', difficulty: 2, tags: ['calc'],
        stem: '总平方和 SS<sub>总</sub> = 4170，组间平方和 SS<sub>组间</sub> = 420。组内平方和是多少？',
        options: [
          { text: '3750', correct: true },
          { text: '4590' },
          { text: '420' },
          { text: '必须知道每组人数才能算' }
        ],
        explain: 'SS<sub>总</sub> = SS<sub>组间</sub> + SS<sub>组内</sub> 是严格的代数恒等式，所以 SS<sub>组内</sub> = 4170 − 420 = 3750。自由度同样可加：N−1 = (k−1) + (N−k)。'
      },
      {
        id: 'ch06-q5', ch: 'ch06', kp: 'ch06-6', tier: 2, type: 'tf', difficulty: 2, tags: ['concept'],
        stem: 'η² 会随样本量系统性偏大，小样本时应改用 ω² 作为更保守的效应量。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: 'SS<sub>组间</sub> 里混有抽样误差，样本越小这部分占比越大，η² 就越虚高。ω² 从中扣除了 (k−1)MS<sub>组内</sub>，性质更接近无偏；上例 η² = .10 而 ω² = .03，差距明显。'
      },
      {
        id: 'ch06-q6', ch: 'ch06', kp: 'ch06-4', tier: 1, type: 'fill', difficulty: 1, tags: ['concept'],
        stem: 'ANOVA 的三条前提是独立、正态、方差齐。其中哪一条无法用统计手段补救？（填两个字）',
        answer: '独立',
        accept: ['独立', '独立性', 'independence'],
        explain: '正态性在大样本下可依赖中心极限定理，方差不齐可用 Welch 校正，但观测不独立（如班级内学生互相影响、把重复测量当独立）会直接低估标准误，只能改设计或改用多层模型。'
      },
      {
        id: 'ch06-q7', ch: 'ch06', kp: 'ch06-7', tier: 3, type: 'multi', difficulty: 3, tags: ['spss'],
        stem: '读 SPSS 的 One-Way ANOVA 输出，正确做法有哪些？（多选）',
        options: [
          { text: '先看 Levene 的 Sig.，决定用标准 F 还是 Welch', correct: true },
          { text: '再看 ANOVA 表的 Sig. 判断整体是否显著', correct: true },
          { text: '若整体不显著，就不要再翻 Post Hoc 找显著的对', correct: true },
          { text: '若整体显著，报 η² 并用 Tukey 指出具体哪几组不同', correct: true },
          { text: '只要 Post Hoc 里有一对显著，就可以宣称整体显著' }
        ],
        explain: '固定顺序是 Levene → F → 事后 → 效应量。最后一项把因果顺序弄反了：事后比较是 F 显著之后的后续分析，不能用来反推整体结论，否则族错误率又回来了。'
      },

      /* ---------------- ch07 关系与分类 ---------------- */
      {
        id: 'ch07-q1', ch: 'ch07', kp: 'ch07-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '为什么算相关系数之前一定要先画散点图？',
        options: [
          { text: '因为 r 只反映线性关系，非线性、极端值与分组结构都可能被它掩盖', correct: true },
          { text: '因为散点图能直接算出 r 的精确值' },
          { text: '因为不画图 SPSS 会拒绝计算 r' },
          { text: '因为散点图可以替代显著性检验' }
        ],
        explain: 'Anscombe 四组数据的 r 都是 .82，但一组正常、一组弯曲、一组被一个极端点拉斜、一组几乎全是垂直堆叠。同一个 r 对应完全不同的现实，只有图形能区分。'
      },
      {
        id: 'ch07-q2', ch: 'ch07', kp: 'ch07-4', tier: 2, type: 'mcq', difficulty: 2, tags: ['calc'],
        stem: '自习时数（SD = 4）与绩点（SD = 0.40）的 r = .62。回归斜率 b 是多少？',
        options: [
          { text: '0.062（b = r × s<sub>y</sub>/s<sub>x</sub> = .62 × 0.40/4）', correct: true },
          { text: '6.20（r × 10）' },
          { text: '0.248（r × 0.40）' },
          { text: '2.48（r × 4）' }
        ],
        explain: 'b = r × (s<sub>y</sub>/s<sub>x</sub>) = .62 × (0.40/4) = 0.062，含义是「每多自习 1 小时，绩点平均高 0.062」。截距 a = 3.20 − 0.062×12 = 2.456，回归方程为 ŷ = 2.456 + 0.062x。'
      },
      {
        id: 'ch07-q3', ch: 'ch07', kp: 'ch07-6', tier: 1, type: 'mcq', difficulty: 2, tags: ['calc'],
        stem: '2×2 列联表总计 60 人，男生 30 人、通过合计 45 人，男生通过格的期望频数是多少？',
        options: [
          { text: '22.5（30 × 45 ÷ 60）', correct: true },
          { text: '18（实际观测值）' },
          { text: '30（男生总人数）' },
          { text: '7.5（30 × 15 ÷ 60）' }
        ],
        explain: '期望频数 = 行合计 × 列合计 ÷ 总数 = 30 × 45 ÷ 60 = 22.5。实际 18 人通过，比期望少 4.5 人，这一格对 χ² 的贡献是 (18−22.5)<sup>2</sup>/22.5 = 0.9。'
      },
      {
        id: 'ch07-q4', ch: 'ch07', kp: 'ch07-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '一项研究报告 r = −.45。这说明：',
        options: [
          { text: '中等强度的负相关，r<sup>2</sup> = .20，即解释约 20% 的变异', correct: true },
          { text: '强的正相关，因为 .45 已接近 .5' },
          { text: '两个变量完全无关，因为符号是负的' },
          { text: 'r<sup>2</sup> = .45，即解释 45% 的变异' }
        ],
        explain: '负号只表示方向（此增彼减），强度看绝对值：.45 属中等。r<sup>2</sup> = (−.45)<sup>2</sup> = .20，即 20% 的变异被解释——报告相关时给 r² 才能说清「有多大用」。'
      },
      {
        id: 'ch07-q5', ch: 'ch07', kp: 'ch07-7', tier: 1, type: 'tf', difficulty: 1, tags: ['concept'],
        stem: '只要相关系数显著且样本足够大，就可以推断两个变量之间存在因果关系。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '显著只排除「纯属偶然」，排除不了反向因果、共同原因与选择效应。要谈因果需要随机分配；观察数据最多只能说「在控制某些变量后仍相关」，所以这个说法是错的。'
      },
      {
        id: 'ch07-q6', ch: 'ch07', kp: 'ch07-3', tier: 1, type: 'fill', difficulty: 1, tags: ['method'],
        stem: '两个变量都是定序（等级）数据时，应使用哪种相关系数？（填英文姓氏）',
        answer: 'Spearman',
        accept: ['Spearman', 'spearman', '斯皮尔曼'],
        explain: 'Spearman 秩相关把取值换成秩次再算相关，适合定序数据、偏态分布与单调非线性关系。Pearson 要求近似定距、线性、无明显极端值，用错会把等级当等距处理。'
      },
      {
        id: 'ch07-q7', ch: 'ch07', kp: 'ch07-5', tier: 3, type: 'multi', difficulty: 3, tags: ['concept'],
        stem: '一元线性回归的 LINE 四条假设包括哪些？（多选）',
        options: [
          { text: '线性：自变量与因变量的关系是直线', correct: true },
          { text: '残差独立：观测之间不相互影响', correct: true },
          { text: '残差正态：残差近似正态分布', correct: true },
          { text: '同方差：残差的方差在各处大致相同', correct: true },
          { text: '因变量本身必须服从正态分布' }
        ],
        explain: 'LINE 指 Linearity、Independence、Normality、Equal variance，后三条都是针对残差而非原始变量——y 本身偏态并不违反假设。这是最常被记混的一点。'
      }
    ]
  };
  CSC._quizPack = PACK;
  CSC.registerQuizPack(PACK);
})();
