/* =====================================================================
 * site.js · 站点配置（window.CSC_SITE）
 * 所有展示文案集中在这里；换课程只需改本文件与 data/ 下的章节文件。
 * ===================================================================== */
window.CSC_SITE = {
  id: 'mat3007',
  short: 'MAT3007',
  name: '凸优化',
  en: 'Convex Optimization',
  dept: '数学与优化',
  lang: 'text',
  langLabel: '优化',

  /* 首页启动终端 */
  mode: 'STATIC · 阅读型',
  bootHead: 'MAT3007 // OBSERVATORY',
  bootLog: [
    '> mounting course partition ... MAT3007',
    '> loading 8 modules ...',
    '> calibrating glossary & quiz bank ...',
    '> all systems nominal. welcome aboard.'
  ],

  /* 首页主视觉文案 */
  tagline: '把「最优」拆成可以验证的形状、条件与算法。',
  missionEn: 'MAT3007 · 8 MODULES',
  missionTitle: '从建模到内点法<br><em>凸优化 全掌握</em>',
  lede: '先学会把一句话写成优化问题，再用凸集与凸函数判断它好不好解，用对偶与 KKT 读出灵敏度，最后落到梯度法、牛顿法与内点法。每章配术语、对比表、常见错误与自检清单。',
  searchPlaceholder: 'QUERY // 搜索本站章节、术语与题目',

  /* 资料库（path 相对 "CUHKSZ course" 目录，由 tools/check-content.js 校验存在性） */
  resBase: '../../resources/MAT3007/',
  resources: {
    note: '本课程公开资料只有两份：一份公式速查（CheatingPaper），一份课程讲义（convex_optimization）。下面按用途切片索引，方便按需查阅。',
    groups: [
      {
        name: '考前速查',
        items: [
          { title: '公式速查页（CheatingPaper）', kind: 'PDF', path: '考试资料/MAT3007_CheatingPaper.pdf',
            note: '一页纸浓缩：凸集与凸函数判定、对偶与 KKT 四条件、常见算法收敛速率。考前 30 分钟过一遍最有效。' },
          { title: '讲义第 5 章 · 对偶与 KKT', kind: 'PDF', path: '学习资料/MAT3007_convex_optimization.pdf',
            note: '配合速查页读：弱对偶与强对偶的证明思路、Slater 条件、互补松弛与影子价格。' }
        ]
      },
      {
        name: '讲义精读',
        items: [
          { title: '讲义第 2–3 章 · 凸集与凸函数', kind: 'PDF', path: '学习资料/MAT3007_convex_optimization.pdf',
            note: '判定工具箱：凸组合、分离超平面、一阶与二阶条件、保凸运算与复合规则。' },
          { title: '速查页 · 判定清单', kind: 'PDF', path: '考试资料/MAT3007_CheatingPaper.pdf',
            note: '把讲义里的定义压缩成可勾选的清单：每条判定配一个反例，适合做题前自检。' }
        ]
      },
      {
        name: '算法与实现',
        items: [
          { title: '讲义第 6–7 章 · 无约束与约束算法', kind: 'PDF', path: '学习资料/MAT3007_convex_optimization.pdf',
            note: '梯度下降与线搜索、牛顿与拟牛顿、罚函数与对数障碍、原始-对偶内点法的推导。' },
          { title: '速查页 · 算法对照', kind: 'PDF', path: '考试资料/MAT3007_CheatingPaper.pdf',
            note: '一张表对比每步代价、收敛速率与适用规模，做题时用来快速选方法。' }
        ]
      }
    ]
  },

  /* 关于页的信息行 */
  aboutLines: [
    ['课程', '凸优化（Convex Optimization）'],
    ['来源', 'CUHKSZ MAT3007 课程资料'],
    ['结构', '8 章正文 · 分章题库 · 模拟卷 · 实战项目 · 资料库'],
    ['建议', '先读第 0 章建立地图，再按顺序推进；每章结尾的自检清单不要跳过。']
  ],

  /* 速查表：tabs 结构 [{ label, blocks:[...] }] */
  cheat: [
    {
      label: '判定',
      blocks: [
        { t: 'table', head: ['对象', '判定方法', '常见反例'], rows: [
          ['集合 C', '任取 x, y ∈ C，验证整条线段 θx + (1−θ)y 仍在 C', '单位圆外部：两端在集合内，中点掉进圆内'],
          ['集合 C', '写成凸函数的下水平集，或若干半空间/锥之交', '两个凸集之并不保凸'],
          ['函数 f', '验证 f(θx + (1−θ)y) ≤ θf(x) + (1−θ)f(y)', 'sin x 在 ℝ 上不凸，局部看像凸容易误判'],
          ['可微函数 f', '一阶条件 f(y) ≥ f(x) + ∇f(x)^T(y−x) 对所有 y 成立', '梯度只给局部信息时不能下结论'],
          ['二阶可微 f', 'Hessian 处处半正定 ∇²f(x) ⪰ 0', '鞍点处 Hessian 不定但梯度为零']
        ], caption: '判定顺序：先看定义域是否凸，再选一阶或二阶工具；有复合结构时先拆成保凸运算' },
        { t: 'callout', kind: 'tip', title: '三句话记住保凸运算', html: '非负加权和、逐点取最大（上确界）、与仿射映射复合，三件事都保凸；<b>交集</b>保凸，<b>并集</b>不保凸。遇到分式或乘积先别急着算 Hessian，试着换成对数或平方形式。' }
      ]
    },
    {
      label: '对偶与 KKT',
      blocks: [
        { t: 'table', head: ['条件', '公式', '含义'], rows: [
          ['平稳性', '∇f0(x) + Σ λ_i ∇f_i(x) + A^T ν = 0', '梯度能被约束梯度线性表示'],
          ['原始可行', 'f_i(x) ≤ 0，Ax = b', '解真的在可行域内'],
          ['对偶可行', 'λ_i ≥ 0', '不等式乘子非负，保证下界性质'],
          ['互补松弛', 'λ_i f_i(x) = 0', '约束起作用或乘子为零，至少一个']
        ], caption: '凸问题 + Slater：四条 KKT 是充要条件；非凸问题只保证必要性' },
        { t: 'table', head: ['量', '公式 / 关系', '怎么用'], rows: [
          ['弱对偶', 'd* = max g(λ,ν) ≤ p*', '任何可行 (λ,ν) 都给 p* 一个下界证书'],
          ['强对偶', 'd* = p*，凸 + Slater 时成立', 'LP 可行有界即自动成立'],
          ['影子价格', '∂p*/∂u_i = −λ_i*（Ax = b 形式）', '只在该约束的基不变范围内有效'],
          ['对偶间隙', 'p* − d* = λ^T(−f(x))', '间隙为零当且仅当互补松弛成立']
        ], caption: '写对偶时先统一约束方向：不等式方向反了，乘子符号要跟着反' }
      ]
    },
    {
      label: '算法',
      blocks: [
        { t: 'table', head: ['方法', '每步代价', '收敛速率', '适用'], rows: [
          ['梯度下降', 'O(n)', 'O(1/k)；强凸 O((1−1/κ)^k)', '大规模、低精度、目标光滑'],
          ['牛顿法', 'O(n³)', '局部二次，迭代次数与 κ 基本无关', '中小规模、需要高精度'],
          ['拟牛顿 BFGS', 'O(n²)', '超线性', '中等规模、Hessian 难算'],
          ['内点法', '一次稀疏 LDL 分解', 'O(√m log(1/ε)) 步', '大规模稀疏 LP/SOCP/SDP'],
          ['ADMM', '每步一次子问题', 'O(1/k)，对 ρ 鲁棒', '可分裂结构、分布式']
        ], caption: '先看规模与稀疏性，再看要精度还是要热启动；不要默认「牛顿一定更快」' },
        { t: 'callout', kind: 'note', title: '线搜索与停止准则', html: '回溯线搜索：取 α = 0.3、β = 0.5，判据 <code>f(x + t d) ≤ f(x) + α t ∇f(x)^T d</code>，保证 <code>t ≥ min(1, β/L)</code>。停止准则用相对量：<code>‖∇f‖ ≤ ε(1 + |f|)</code>；约束问题同时看原始残差、对偶残差与间隙。' }
      ]
    },
    {
      label: '建模与求解',
      blocks: [
        { t: 'table', head: ['步骤', '要问的问题', '典型错误'], rows: [
          ['选变量', '每个变量的单位与取值范围是什么', '变量含义重叠，导致约束写重'],
          ['写目标', '要最大还是最小，系数从哪来', '把成本当利润，符号反了'],
          ['写约束', '每条约束是 ≤、≥ 还是 =，右端是什么', '比例约束的分母写成单个变量'],
          ['验证', '量纲、边界、极端值是否说得通', '解出来了但业务上不可行']
        ], caption: '四步之外还要补非负约束；线性化之前先确认问题真的是线性的' },
        { t: 'table', head: ['问题族', '目标', '约束', '求解器'], rows: [
          ['LP', '线性', '线性', 'linprog / HiGHS / 单纯形'],
          ['QP', '凸二次', '线性', 'OSQP / quadprog'],
          ['SOCP', '线性', '二阶锥', 'ECOS / Mosek'],
          ['SDP', '线性', '半正定锥', 'SCS / Mosek']
        ], caption: '拿不准属于哪一类时，先写成 CVXPY 模型让 DCP 规则替你检查' }
      ]
    }
  ]
};
