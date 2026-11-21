/* =====================================================================
 * site.js · STA2001 概率与统计 站点配置（window.CSC_SITE）
 * ===================================================================== */
window.CSC_SITE = {
  id: 'sta2001',
  short: 'STA2001',
  name: '概率与统计',
  en: 'Probability and Statistics',
  dept: '统计与数据科学',
  lang: 'text',
  langLabel: '统计',

  /* 首页启动终端 */
  mode: 'STATIC · 阅读 + 自测',
  bootHead: 'STA2001 // PROBABILITY OBSERVATORY',
  bootLog: [
    '> mounting course partition ... STA2001',
    '> loading 8 modules: axioms, conditioning, distributions ...',
    '> calibrating quiz bank & sampling tables ...',
    '> variance within tolerance. welcome aboard.'
  ],

  /* 首页主视觉文案 */
  tagline: '从一枚硬币开始，把不确定性算清楚。',
  missionEn: 'STA2001 · 8 MODULES',
  missionTitle: '从公理到推断<br><em>算得出，也说得清</em>',
  lede: '八章沿一条主线推进：先建立概率模型与公理，再用随机变量描述不确定性，最后从样本反推总体。每章配推导、对比表、真实例题、常见错误与自检清单，读完能独立完成估计、区间与检验，并说清每个结论的前提。',
  searchPlaceholder: 'QUERY // 搜索：贝叶斯 · 期望 · 正态 · 中心极限 · 置信区间 · p 值',

  /* 资料库（path 相对 "CUHKSZ course" 目录，由 tools/check-content.js 校验存在性） */
  resBase: '../../resources/STA2001/',
  resources: {
    note: '收录 STA2001 的课程讲义、作业与习题课解答、历年考试卷；文件名即原始文件，点击后用系统默认程序打开。',
    groups: [
      { name: '讲义与教材', note: '按授课顺序排列；前 8 讲对应 ch01–ch04，后 10 讲对应 ch05–ch07。', items: [
        { title: 'Lecture 01 · 课程导引与计数', path: '学习资料/STA2001_Lecture_01.pdf', kind: 'pdf', note: '课程安排、样本空间与古典概型' },
        { title: 'Lecture 02 · 公理与性质', path: '学习资料/STA2001_Lecture_02.pdf', kind: 'pdf', note: '三条公理、五条推论与容斥' },
        { title: 'Lecture 03 · 条件概率', path: '学习资料/STA2001_Lecture_03.pdf', kind: 'pdf', note: '条件概率、乘法公式与全概率' },
        { title: 'Lecture 04 · 贝叶斯与独立性', path: '学习资料/STA2001_Lecture_04.pdf', kind: 'pdf', note: '贝叶斯公式、基率谬误与独立性' },
        { title: 'Lecture 05 · 随机变量', path: '学习资料/STA2001_Lecture_05.pdf', kind: 'pdf', note: '分布函数、离散型与连续型' },
        { title: 'Lecture 06 · 常见分布', path: '学习资料/STA2001_Lecture_06.pdf', kind: 'pdf', note: '二项、泊松、均匀、指数、正态' },
        { title: 'Lecture 07 · 变量变换', path: '学习资料/STA2001_Lecture_07.pdf', kind: 'pdf', note: '单调变换、累积法与雅可比' },
        { title: 'Lecture 08 · 期望与方差', path: '学习资料/STA2001_Lecture_08.pdf', kind: 'pdf', note: 'LOTUS、方差公式与矩母函数' },
        { title: 'Lecture 09 · 多维随机变量', path: '学习资料/STA2001_Lecture_09.pdf', kind: 'pdf', note: '联合、边缘与条件分布' },
        { title: 'Lecture 10 · 协方差与线性组合', path: '学习资料/STA2001_Lecture_10.pdf', kind: 'pdf', note: '协方差、相关系数与线性组合' },
        { title: 'Lecture 11 · 抽样分布', path: '学习资料/STA2001_Lecture_11.pdf', kind: 'pdf', note: '统计量、标准误与 χ²/t/F' },
        { title: 'Lecture 12 · 中心极限定理', path: '学习资料/STA2001_Lecture_12.pdf', kind: 'pdf', note: 'CLT、大数定律与正态近似' },
        { title: 'Lecture 13 · 点估计', path: '学习资料/STA2001_Lecture_13.pdf', kind: 'pdf', note: '矩估计、极大似然与评价标准' },
        { title: 'Lecture 14 · 置信区间', path: '学习资料/STA2001_Lecture_14.pdf', kind: 'pdf', note: '枢轴量法与均值、比例区间' },
        { title: 'Lecture 15 · 假设检验', path: '学习资料/STA2001_Lecture_15.pdf', kind: 'pdf', note: '检验框架、两类错误与功效' },
        { title: 'Lecture 16 · 单样本检验', path: '学习资料/STA2001_Lecture_16.pdf', kind: 'pdf', note: '均值、比例与方差的检验' },
        { title: 'Lecture 17 · 双样本与配对', path: '学习资料/STA2001_Lecture_17.pdf', kind: 'pdf', note: '独立样本、Welch 与配对设计' },
        { title: 'Lecture 18 · 卡方与复习', path: '学习资料/STA2001_Lecture_18.pdf', kind: 'pdf', note: '拟合优度、独立性检验与总复习' },
        { title: '教材 · 概率论与数理统计（第 9 版）', path: '学习资料/STA2001_Probability_and_Statistical_Inference_9th_Edition.pdf', kind: 'pdf', note: 'Hogg & Tanis，本站章节编号与之一致' },
        { title: '期中复习讲义', path: '学习资料/STA2001_Half_time_Review.pdf', kind: 'pdf', note: 'ch01–ch04 的公式与题型汇总' },
        { title: '期末总复习', path: '学习资料/STA2001_Full_time_review_of_STA2001.pdf', kind: 'pdf', note: '全课程串联复习，含典型例题' }
      ] },
      { name: '作业与习题课', note: '先做原题再看解答；Tutorial 的解答与 HW 常成对出现。', items: [
        { title: '课程大纲（2024 Summer）', path: '作业习题/STA2001_2024Summer_STA2001_Course_Syllabus.pdf', kind: 'pdf', note: '评分构成、进度与考核方式' },
        { title: 'HW 01 解答', path: '作业习题/STA2001_HW_01_Solution.pdf', kind: 'pdf', note: '计数与公理练习' },
        { title: 'HW 02 解答', path: '作业习题/STA2001_HW_02_Solution.pdf', kind: 'pdf', note: '条件概率与贝叶斯' },
        { title: 'HW 03 解答', path: '作业习题/STA2001_HW_03_Solution.pdf', kind: 'pdf', note: '随机变量与分布' },
        { title: 'HW 04 解答', path: '作业习题/STA2001_HW_04_Solution.pdf', kind: 'pdf', note: '期望、方差与矩母函数' },
        { title: 'HW 05 原题', path: '作业习题/STA2001_HW_05.pdf', kind: 'pdf', note: '多维随机变量专题' },
        { title: 'HW 05 解答', path: '作业习题/STA2001_HW_05_Solution.pdf', kind: 'pdf', note: '联合分布与线性组合' },
        { title: 'HW 06 原题', path: '作业习题/STA2001_HW_06.pdf', kind: 'pdf', note: '抽样分布与推断' },
        { title: 'HW 06 解答', path: '作业习题/STA2001_HW_06_Solution.pdf', kind: 'pdf', note: 'CLT、区间与检验' },
        { title: 'Tutorial 01 · 含解答', path: '作业习题/STA2001_Tutorial_01_With_Solution.pdf', kind: 'pdf', note: '样本空间与计数入门' },
        { title: 'Tutorial 02 · 含解答', path: '作业习题/STA2001_Tutorial_02_With_Solution.pdf', kind: 'pdf', note: '公理与容斥的课堂练习' },
        { title: 'Tutorial 03 · 含解答', path: '作业习题/STA2001_Tutorial_03_With_Solution.pdf', kind: 'pdf', note: '条件概率与全概率' },
        { title: 'Tutorial 04 · 含解答', path: '作业习题/STA2001_Tutorial_04_With_Solution.pdf', kind: 'pdf', note: '贝叶斯与独立性' },
        { title: 'Tutorial 05 · 含解答', path: '作业习题/STA2001_Tutorial_05_With_Solution.pdf', kind: 'pdf', note: '随机变量与分布函数' },
        { title: 'Tutorial 06 · 含解答', path: '作业习题/STA2001_Tutorial_06_With_Solution.pdf', kind: 'pdf', note: '连续分布与变量变换' },
        { title: 'Tutorial 07 · HW 03 讲评', path: '作业习题/STA2001_Tutorial_07_(HW_03).pdf', kind: 'pdf', note: '第三次作业的逐题讲评' },
        { title: 'Tutorial 07 · HW 03 部分解答', path: '作业习题/STA2001_Tutorial_07_Partial_Solution_to_HW_03.pdf', kind: 'pdf', note: '官方给出的部分参考解答' },
        { title: 'Tutorial 09', path: '作业习题/STA2001_Tutorial_09.pdf', kind: 'pdf', note: '期望与方差专题' },
        { title: 'Tutorial 10', path: '作业习题/STA2001_Tutorial_10.pdf', kind: 'pdf', note: '多维随机变量与协方差' },
        { title: 'Tutorial 11', path: '作业习题/STA2001_Tutorial_11.pdf', kind: 'pdf', note: '抽样分布与极限定理' },
        { title: 'Tutorial 13', path: '作业习题/STA2001_Tutorial_13.pdf', kind: 'pdf', note: '估计与检验综合练习' },
        { title: '习题全解指南（浙大·第 4 版）', path: '作业习题/STA2001_概率论与数理统计习题全解指南_浙大第4版_浙江大学_盛骤_谢式千_潘承毅.pdf', kind: 'pdf', note: '中文教材配套题解，可补充计算训练' }
      ] },
      { name: '考试资料', note: '先按真实时限闭卷做，再对照解答统计失分点；不要一边看答案一边做。', items: [
        { title: '2017 Final · 含解答', path: '考试资料/STA2001_2017_Final_WithSolution.pdf', kind: 'pdf', note: '早年期末卷，题型覆盖全课程' },
        { title: '2023 Summer Sample Final', path: '考试资料/STA2001_2023_Summer_Sample_Final.pdf', kind: 'pdf', note: '样卷，无解答，适合限时模拟' },
        { title: '2023 Summer Sample Midterm · 含解答', path: '考试资料/STA2001_2023_Summer_Sample_Midterm_WithSolution.pdf', kind: 'pdf', note: '期中样卷，覆盖 ch01–ch05' },
        { title: '2024 Midterm · 含解答', path: '考试资料/STA2001_2024_Midterm_WithSolution.pdf', kind: 'pdf', note: '最近一次期中真题与评分参考' }
      ] }
    ]
  },

  /* 关于页的信息行 */
  aboutLines: [
    ['课程', '概率与统计（Probability and Statistics），CUHKSZ STA2001'],
    ['来源', 'CUHKSZ STA2001 课程讲义、作业解答与历年考试资料'],
    ['结构', '8 章正文 · 56 题题库 · 模拟卷 · 3 个统计项目 · 资料库'],
    ['建议', '第 0 章先建地图；ch02 与 ch07 务必动笔算，条件概率与检验只靠看是学不会的。']
  ],

  /* 速查表：tabs 结构 [{ label, blocks:[...] }] */
  cheat: [
    { label: '概率与计数', blocks: [
      { t: 'table', head: ['公式', '表达式', '什么时候用'], rows: [
        ['补事件', '<code>P(A<sup>c</sup>)=1-P(A)</code>', '「至少一个」类问题优先取补'],
        ['容斥（两个）', '<code>P(A∪B)=P(A)+P(B)-P(A∩B)</code>', '并事件，永远成立'],
        ['容斥（三个）', '<code>ΣP(A<sub>i</sub>)-ΣP(A<sub>i</sub>∩A<sub>j</sub>)+P(A∩B∩C)</code>', '三个集合的并'],
        ['德摩根', '<code>(A∪B)<sup>c</sup>=A<sup>c</sup>∩B<sup>c</sup></code>', '把「至少一个」翻成「都不」'],
        ['条件概率', '<code>P(A|B)=P(A∩B)/P(B)</code>', '已知 <code>B</code> 发生'],
        ['乘法公式', '<code>P(A∩B)=P(A|B)P(B)</code>', '连续发生的联合概率'],
        ['全概率', '<code>P(B)=ΣP(B|A<sub>i</sub>)P(A<sub>i</sub>)</code>', '按互斥且完备的原因分组'],
        ['贝叶斯', '<code>P(A<sub>i</sub>|B)=P(B|A<sub>i</sub>)P(A<sub>i</sub>)/P(B)</code>', '由结果反推原因']
      ], caption: '前四条是集合语言，后四条是「信息更新」的四件套' },
      { t: 'table', head: ['计数', '公式', '典型题'], rows: [
        ['排列', '<code>P(n,k)=n!/(n-k)!</code>', '排队、分职务'],
        ['组合', '<code>C(n,k)=n!/[k!(n-k)!]</code>', '选人、不分职务'],
        ['可重复排列', '<code>n<sup>k</sup></code>', '密码、生日'],
        ['分组', '<code>n!/[n<sub>1</sub>!…n<sub>k</sub>!]</code>', '多重集排列'],
        ['隔板法', '<code>C(n+k-1,k-1)</code>', '正整数解个数'],
        ['配对', '<code>D<sub>n</sub>=n!(1-1/1!+…)</code>', '错排问题']
      ], caption: '先问「顺序重要吗」「允许重复吗」，两个问题定四象限' },
      { t: 'callout', kind: 'warn', title: '互斥 ≠ 独立', html: '互斥是「不能同时发生」，独立是「一个发生不改变另一个的概率」。若 <code>P(A)&gt;0</code>、<code>P(B)&gt;0</code> 且互斥，则 <code>P(A|B)=0≠P(A)</code>，两者一定<b>不</b>独立。' }
    ] },

    { label: '分布与数字特征', blocks: [
      { t: 'table', head: ['分布', '参数', '<code>E(X)</code>', '<code>Var(X)</code>', '场景'], rows: [
        ['伯努利', '<code>p</code>', '<code>p</code>', '<code>p(1-p)</code>', '一次成败'],
        ['二项', '<code>n,p</code>', '<code>np</code>', '<code>np(1-p)</code>', '<code>n</code> 次独立成败'],
        ['几何', '<code>p</code>', '<code>1/p</code>', '<code>(1-p)/p<sup>2</sup></code>', '首次成功所需次数'],
        ['泊松', '<code>λ</code>', '<code>λ</code>', '<code>λ</code>', '单位时间事件数'],
        ['均匀', '<code>a,b</code>', '<code>(a+b)/2</code>', '<code>(b-a)<sup>2</sup>/12</code>', '等可能落在区间'],
        ['指数', '<code>λ</code>', '<code>1/λ</code>', '<code>1/λ<sup>2</sup></code>', '等待时间，无记忆'],
        ['正态', '<code>μ,σ<sup>2</sup></code>', '<code>μ</code>', '<code>σ<sup>2</sup></code>', '误差、和、均值']
      ], caption: '这张表要能默写；考试常直接问「某分布的均值与方差」' },
      { t: 'table', head: ['运算', '期望', '方差'], rows: [
        ['线性变换', '<code>E(aX+b)=aE(X)+b</code>', '<code>Var(aX+b)=a<sup>2</sup>Var(X)</code>'],
        ['和', '<code>E(X+Y)=E(X)+E(Y)</code>', '<code>Var(X+Y)=VarX+VarY+2Cov</code>'],
        ['独立和', '同上', '<code>Var(X+Y)=VarX+VarY</code>'],
        ['乘积', '<code>E(XY)=E(X)E(Y)</code>（需独立/不相关）', '—'],
        ['平方', '<code>E(X<sup>2</sup>)≥[E(X)]<sup>2</sup></code>', '<code>Var(X)=E(X<sup>2</sup>)-[E(X)]<sup>2</sup></code>']
      ], caption: '期望永远可加；方差只有在协方差为 0 时才「干净地」相加' },
      { t: 'callout', kind: 'tip', title: 'LOTUS 与矩母函数', html: '求 <code>E[g(X)]</code> 不必先求 <code>g(X)</code> 的分布：<code>E[g(X)]=Σg(x)p(x)</code> 或 <code>∫g(x)f(x)dx</code>。矩母函数 <code>M(t)=E(e<sup>tX</sup>)</code> 满足 <code>M<sup>(k)</sup>(0)=E(X<sup>k</sup>)</code>，还能识别分布的和。' }
    ] },

    { label: '抽样与推断', blocks: [
      { t: 'table', head: ['情形', '统计量', '分布', '区间'], rows: [
        ['均值，<code>σ</code> 已知', '<code>(x̄-μ)/(σ/√n)</code>', '<code>N(0,1)</code>', '<code>x̄±z<sub>α/2</sub>σ/√n</code>'],
        ['均值，<code>σ</code> 未知', '<code>(x̄-μ)/(S/√n)</code>', '<code>t(n-1)</code>', '<code>x̄±t<sub>α/2</sub>S/√n</code>'],
        ['比例', '<code>(p̂-p)/√(p̂(1-p̂)/n)</code>', '近似 <code>N(0,1)</code>', '<code>p̂±z<sub>α/2</sub>√(p̂(1-p̂)/n)</code>'],
        ['方差', '<code>(n-1)S<sup>2</sup>/σ<sup>2</sup></code>', '<code>χ<sup>2</sup>(n-1)</code>', '用两侧分位数反解，不对称'],
        ['两均值差', '合并标准误', '<code>t(n<sub>1</sub>+n<sub>2</sub>-2)</code>', '<code>(x̄<sub>1</sub>-x̄<sub>2</sub>)±t·S<sub>p</sub>√(1/n<sub>1</sub>+1/n<sub>2</sub>)</code>']
      ], caption: '统一模板：点估计 ± 临界值 × 标准误；先判断用哪种分布' },
      { t: 'table', head: ['概念', '一句话', '易错点'], rows: [
        ['标准误', '<code>SE=σ/√n</code>', '是统计量的波动，不是数据的波动'],
        ['CLT', '<code>x̄</code> 近似 <code>N(μ,σ<sup>2</sup>/n)</code>', '要求 iid 且方差有限，不要求总体正态'],
        ['大数定律', '<code>x̄ →<sub>p</sub> μ</code>', '只保证收敛，不给误差分布'],
        ['置信水平', '重复抽样下的覆盖率', '不是「<code>μ</code> 落入此区间的概率」'],
        ['<code>α</code> 与 <code>β</code>', '弃真与存伪', '<code>α</code> 变小则 <code>β</code> 变大，只有 <code>n</code> 能同时降'],
        ['p 值', '<code>P(数据或更极端|H<sub>0</sub>)</code>', '不是 <code>H<sub>0</sub></code> 为真的概率，也不衡量效应大小']
      ], caption: '这一页是第 6、7 章的全部骨架' },
      { t: 'compare', left: { title: '置信区间', html: '给出参数的候选范围，宽度反映精度；<b>不</b>对参数做判断，适合报告「效应可能有多大」。' }, right: { title: '假设检验', html: '对某个具体参数值做「拒绝/不拒绝」的判断；<b>不</b>给出范围，适合回答「有没有证据」。双侧 <code>α</code> 检验与 <code>1-α</code> 区间一一对应。' } }
    ] },

    { label: '易错清单', blocks: [
      { t: 'table', head: ['错误说法', '为什么错', '正确写法'], rows: [
        ['<code>P(A|B)=P(B|A)</code>', '分母方向不同', '<code>P(A|B)=P(A∩B)/P(B)</code>'],
        ['<code>P(A∪B)=P(A)+P(B)</code>', '未扣除交集', '容斥公式，除非互斥'],
        ['两两独立 ⇒ 相互独立', '缺三阶乘积条件', '还需 <code>P(ABC)=P(A)P(B)P(C)</code>'],
        ['密度必须 ≤1', '密度不是概率', '只需非负且积分为 1'],
        ['<code>Var(X-Y)=VarX-VarY</code>', '方差不可减', '<code>VarX+VarY-2Cov</code>'],
        ['<code>ρ=0</code> ⇒ 独立', '只排除线性关系', '独立 ⇒ 不相关，反之不然'],
        ['<code>n≥30</code> 万能', '偏态重时远不够', '看偏度与异常值，必要时更大'],
        ['不拒绝 <code>H<sub>0</sub></code> ⇒ <code>H<sub>0</sub></code> 为真', '可能只是功效不足', '写「无足够证据拒绝」']
      ], caption: '考前把这八条读一遍，能挡住大部分概念题陷阱' },
      { t: 'callout', kind: 'exam', title: '答题顺序建议', html: '① 先扫一遍，把「套公式即可」的题做掉；② 再攻需要建模的题（全概率、贝叶斯、变换）；③ 最后检查单位、分母、自由度。检验题务必写全四要素，区间题务必写清用的是 <code>z</code> 还是 <code>t</code>。<b>只写答案不写公式，步骤分全丢。</b>' }
    ] }
  ]
};
