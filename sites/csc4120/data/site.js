/* =====================================================================
 * site.js · 站点配置（window.CSC_SITE）
 * 所有展示文案集中在这里；换课程只需改本文件与 data/ 下的章节文件。
 * ===================================================================== */
window.CSC_SITE = {
  id: 'csc4120',
  short: 'CSC4120',
  name: '算法设计与分析',
  en: 'Algorithm Design and Analysis',
  dept: '计算机科学',
  lang: 'text',
  langLabel: '算法',

  /* 首页启动终端 */
  mode: 'STATIC · 阅读型',
  bootHead: 'CSC4120 // ANALYSIS ENGINE',
  bootLog: [
    '> mounting course partition ... CSC4120',
    '> loading 8 modules, 56 quiz items, 1 mock paper ...',
    '> linking recurrences, graphs, flows & NP reductions ...',
    '> all systems nominal. start with ch00.'
  ],

  /* 首页主视觉文案 */
  tagline: '不是背模板，而是学会判断：它对不对、要跑多久、能不能更快。',
  missionEn: 'CSC4120 · 8 MODULES · 13 WEEKS',
  missionTitle: '从渐进记号到<br><em>算法设计与分析 全掌握</em>',
  lede: '先建立整门课的地图，再逐章推进：定义、证明、对比表、常见错误与自检清单，每章都配有题库与延伸练习。八章覆盖分治、排序与树、散列、图、贪心、DP、流与 NP 完全性。',
  searchPlaceholder: 'QUERY // 搜索章节、术语、递推式与题目',

  /* 资料库（path 相对 "CUHKSZ course" 目录，由 tools/check-content.js 校验存在性） */
  resBase: '../../resources/CSC4120/',
  resources: {
    note: '资料按「讲义 / 教材 / 作业 / 考试」四组归档，均来自 CSC4120 课程原始文件。文件名中的 Week 编号与本站章节对应：Week 01–02 → ch01，Week 03–04 → ch02，Week 05–06 → ch03，Week 07–08 → ch04，Week 09 → ch05，Week 10–11 → ch06，Week 11–13 → ch07。',
    groups: [
      {
        name: '讲义 · Lecture Slides',
        note: '按周组织的课堂讲义，正文中的定义、例题与复杂度推导基本都能在对应周的 PDF 里找到出处。',
        items: [
          { title: 'Week 01 · 渐进记号、分治与主定理（导论）', path: '学习资料/CSC4120_Week_01_As_notation_D&C_master_theorem_L01_0_Introduction_2025b.pdf', kind: 'pdf', note: '课程介绍、评分方式与整门课的地图。' },
          { title: 'Week 01 · 渐进复杂度 Asymptotic Complexity', path: '学习资料/CSC4120_Week_01_As_notation_D&C_master_theorem_L01_1_Asymptotic_complexity_2025b.pdf', kind: 'pdf', note: 'O/Ω/Θ 的形式定义与常见函数阶。' },
          { title: 'Week 01 · 分治与主定理', path: '学习资料/CSC4120_Week_01_As_notation_D&C_master_theorem_L01_2_D+C_Master_Theorem_2025b.pdf', kind: 'pdf', note: 'master theorem 三种情况与 peak finding。' },
          { title: 'Week 02 · 凸包、中位数与随机化选择', path: '学习资料/CSC4120_Week_02_FFT_con_hull_median_etc_L02_1_convex_hull_median_prob_algs_2025b.pdf', kind: 'pdf', note: 'Graham 扫描、quickselect、median of medians。' },
          { title: 'Week 02 · FFT 快速傅里叶变换', path: '学习资料/CSC4120_Week_02_FFT_con_hull_median_etc_L02_2_FFT_2025b.pdf', kind: 'pdf', note: '多项式乘法、单位根与分治。' },
          { title: 'Week 03 · 排序下界与线性时间排序', path: '学习资料/CSC4120_Week_03_LBs_Heaps_Mod_L03_1_LBs_Linear_time_sorting_2025b.pdf', kind: 'pdf', note: '决策树下界、计数/基数/桶排序。' },
          { title: 'Week 03 · 堆与优先队列', path: '学习资料/CSC4120_Week_03_LBs_Heaps_Mod_L03_2_Heaps.pdf', kind: 'pdf', note: '建堆 O(n)、堆排序、优先队列应用。' },
          { title: 'Week 04 · AVL 树', path: '学习资料/CSC4120_Week_04_Trees_L04_1_AVL.pdf', kind: 'pdf', note: '四种旋转与高度平衡。' },
          { title: 'Week 04 · 区间树 Interval Trees', path: '学习资料/CSC4120_Week_04_Trees_L04_2_Interval_trees.pdf', kind: 'pdf', note: '区间重叠查询与增广树。' },
          { title: 'Week 04 · van Emde Boas 树', path: '学习资料/CSC4120_Week_04_Trees_L04_3_VEB_Trees_2025b.pdf', kind: 'pdf', note: '整数宇宙上的 O(log log u) 操作。' },
          { title: 'Week 05 · 散列 I', path: '学习资料/CSC4120_Week_05_Hashing_L05_1_Hashing_I_2025b.pdf', kind: 'pdf', note: '直接寻址、链接法、开放寻址。' },
          { title: 'Week 05 · 散列 II', path: '学习资料/CSC4120_Week_05_Hashing_L05_2_Hashing_II_2025b.pdf', kind: 'pdf', note: '全域散列与随机化分析。' },
          { title: 'Week 06 · 摊销分析与球与箱', path: '学习资料/CSC4120_Week_06_Prob_hashing_L06_1_amortized_analysis_2025b.pdf', kind: 'pdf', note: '动态表扩容的势能分析。' },
          { title: 'Week 06 · 完美散列与 Bloom 过滤器', path: '学习资料/CSC4120_Week_06_Prob_hashing_L06_3_perfect_hashing_2025b.pdf', kind: 'pdf', note: '两级结构、FKS 与假阳性率。' },
          { title: 'Week 07 · DFS 深度优先搜索', path: '学习资料/CSC4120_Week_07_DFS_BFS_DFS_2025b.pdf', kind: 'pdf', note: '时间戳、括号结构与边分类。' },
          { title: 'Week 07 · BFS 与图表示', path: '学习资料/CSC4120_Week_07_DFS_BFS_BFS_2025b.pdf', kind: 'pdf', note: '最短边数路径与 BFS 树。' },
          { title: 'Week 07 · 强连通分量 SCC', path: '学习资料/CSC4120_Week_07_DFS_BFS_SCC_2025b.pdf', kind: 'pdf', note: 'Kosaraju 与 Tarjan 两种算法。' },
          { title: 'Week 08 · Bellman-Ford 与负权', path: '学习资料/CSC4120_Week_08_Bellman_Ford_Dijkstra_Bellman_Ford_2025b.pdf', kind: 'pdf', note: '|V|−1 轮松弛与负环检测。' },
          { title: 'Week 08 · Dijkstra 与 DAG 最短路', path: '学习资料/CSC4120_Week_08_Bellman_Ford_Dijkstra_Dijkstra_DAGs_2025b.pdf', kind: 'pdf', note: '优先队列实现、DAG 上线性时间。' },
          { title: 'Week 08 · A* 与启发式搜索', path: '学习资料/CSC4120_Week_08_Bellman_Ford_Dijkstra_Dijkstra_extensions_Astar_2025b.pdf', kind: 'pdf', note: 'admissible/consistent 与扩展节点数。' },
          { title: 'Week 09 · 贪心算法', path: '学习资料/CSC4120_Week_09_Greedy_greedy_2025b.pdf', kind: 'pdf', note: '交换论证、区间调度、MST、Huffman。' },
          { title: 'Week 09 · 并查集 Union-Find', path: '学习资料/CSC4120_Week_09_Greedy_UnionFind.pdf', kind: 'pdf', note: '路径压缩与按秩合并的近似线性。' },
          { title: 'Week 10 · DP1：斐波那契与最短路', path: '学习资料/CSC4120_Week_10_DP1_DP3_DP1_Fib_SPs_2025b.pdf', kind: 'pdf', note: '记忆化、DAG 上的 DP。' },
          { title: 'Week 10 · DP2：切钢条与文本对齐', path: '学习资料/CSC4120_Week_10_DP1_DP3_DP2_rodcut_textj_2025b.pdf', kind: 'pdf', note: '线性 DP 的状态与转移。' },
          { title: 'Week 10 · DP3：LCS、TSP 与区间 DP', path: '学习资料/CSC4120_Week_10_DP1_DP3_DP3_par_lcs_as_TSP_2025.pdf', kind: 'pdf', note: '序列 DP、状压 DP、矩阵链。' },
          { title: 'Week 10 · DP4：背包与二分图', path: '学习资料/CSC4120_Week_10_DP1_DP3_DP4_knap_bp_sub_2025b.pdf', kind: 'pdf', note: '0/1 背包、完全背包、二分图匹配。' },
          { title: 'Week 11 · 网络流 NetFlow', path: '学习资料/CSC4120_Week_11_DP4_Flows_netflow.pdf', kind: 'pdf', note: '最大流最小割、残量网络。' },
          { title: 'Week 11 · Edmonds-Karp 与二分图匹配', path: '学习资料/CSC4120_Week_11_DP4_Flows_edmondskarp.pdf', kind: 'pdf', note: 'BFS 增广与 O(VE²)。' },
          { title: 'Week 12 · 复杂度：P、NP 与归约', path: '学习资料/CSC4120_Week_12_Complexity_Complexity_P_NP_2025b.pdf', kind: 'pdf', note: '多项式归约与 NP 完全性定义。' },
          { title: 'Week 13 · 近似算法', path: '学习资料/CSC4120_Week_13_Dealing_with_NP_completeness_Approx_alg_2025b.pdf', kind: 'pdf', note: '顶点覆盖、TSP、Christofides。' }
        ]
      },
      {
        name: '教材与参考 · Textbooks',
        note: '主教材为 CLRS，Dasgupta 作为补充；讲义中的证明多用 CLRS 的记号体系。',
        items: [
          { title: 'CLRS《算法导论》第 4 版（个人使用版）', path: '学习资料/CSC4120_Introduction_to_algorithms_4th_ed_personal_use_only.pdf', kind: 'pdf', note: '本课主教材，章节编号与讲义一致。' },
          { title: 'CLRS《算法导论》第 3 版', path: '学习资料/CSC4120_Introduction_to_algorithms_3rd_edition.pdf', kind: 'pdf', note: '旧版，部分习题编号不同。' },
          { title: 'Dasgupta · Papadimitriou · Vazirani', path: '学习资料/CSC4120_Dasgupta_Papadimitriou_Vazirani_book.pdf', kind: 'pdf', note: '更简洁的算法教材，适合快速回顾。' },
          { title: '如何解递推式（MIT 讲义）', path: '学习资料/CSC4120_Week_01_As_notation_D&C_master_theorem_How_to_solve_recurrences_MIT_2025.pdf', kind: 'pdf', note: '展开法、递归树、主定理的补充推导。' },
          { title: 'Recitation 01 · 复杂度练习', path: '学习资料/CSC4120_Week_01_As_notation_D&C_master_theorem_Recitation_01_Complexity.pdf', kind: 'pdf', note: '渐进记号的判断题与反例。' },
          { title: 'Recitation 02 · 递推式练习', path: '学习资料/CSC4120_Week_01_As_notation_D&C_master_theorem_Recitation_02_Recurrences.pdf', kind: 'pdf', note: '主定理失效时的处理。' }
        ]
      },
      {
        name: '作业与项目 · Homework & Project',
        note: '书面作业共 11 次，每次配官方解答；课程项目含说明与展示模板。',
        items: [
          { title: 'Written Homework 1', path: '作业习题/CSC4120_Written_Homework_HW1.pdf', kind: 'pdf', note: '渐进记号与分治入门。' },
          { title: 'HW1 官方解答', path: '作业习题/CSC4120_Written_Homework_HW1_Solution.pdf', kind: 'pdf', note: '对照检查证明步骤。' },
          { title: 'Written Homework 9', path: '作业习题/CSC4120_Written_Homework_hw9.pdf', kind: 'pdf', note: '贪心与 MST 相关。' },
          { title: 'HW9 官方解答', path: '作业习题/CSC4120_Written_Homework_HW9_Solution.pdf', kind: 'pdf', note: '交换论证与并查集分析。' },
          { title: 'Course Project 说明', path: '作业习题/CSC4120_Course_Project_proj_description_2025b.pdf', kind: 'pdf', note: '项目要求、评分细则与提交格式。' },
          { title: 'Course Project 展示模板', path: '作业习题/CSC4120_Course_Project_project_presentation_2025b.pptx', kind: 'pptx', note: '期末展示的幻灯片框架。' },
          { title: 'Course Project 示例包', path: '作业习题/CSC4120_Course_Project_proj_ptp.zip', kind: 'zip', note: '往届项目代码与报告样例。' }
        ]
      },
      {
        name: '考试与例题 · Exam & Examples',
        note: '期中样卷与各周例题，适合考前按题型过一遍。',
        items: [
          { title: 'Midterm Sample Paper', path: '考试资料/CSC4120_Midterm_Sample_Paper.pdf', kind: 'pdf', note: '期中题型与分值分布参考。' },
          { title: '主定理例题', path: '考试资料/CSC4120_Week_01_As_notation_D&C_master_theorem_Examples_master_theorem.pdf', kind: 'pdf', note: '三种情况的判定与计算。' },
          { title: 'vEB 树例题', path: '考试资料/CSC4120_Week_04_Trees_Example_VEB.pdf', kind: 'pdf', note: '递归结构的手算演示。' },
          { title: '最短路笔记', path: '考试资料/CSC4120_Week_08_Bellman_Ford_Dijkstra_notes_on_shortest_paths.pdf', kind: 'pdf', note: '负权、负环与算法选择。' },
          { title: 'MST 例题', path: '考试资料/CSC4120_Week_09_Greedy_MSPs_examples.pdf', kind: 'pdf', note: 'Prim/Kruskal 手算与割性质。' }
        ]
      }
    ]
  },

  /* 关于页的信息行 */
  aboutLines: [
    ['课程', '算法设计与分析（Algorithm Design and Analysis）'],
    ['来源', 'CUHKSZ CSC4120 课程资料（2025b 学期讲义、作业与考试样卷）'],
    ['结构', '8 章正文 · 56 道分章题库 · 1 套模拟卷 · 3 个实战项目 · 四组资料库'],
    ['建议', '先读第 0 章建立地图，再按 ch01→ch07 推进；每章结尾的自检清单不要跳过。']
  ],

  /* 速查表：tabs 结构 [{ label, blocks:[...] }] */
  cheat: [
    {
      label: '渐进与递推',
      blocks: [
        { t: 'table', caption: '主定理：T(n) = aT(n/b) + f(n)，比较 f(n) 与 n<sup>log<sub>b</sub>a</sup>', head: ['情况', '条件', '结论', '例子'], rows: [
          ['1 · 叶子支配', 'f(n) = O(n<sup>log<sub>b</sub>a−ε</sup>)', 'T(n) = Θ(n<sup>log<sub>b</sub>a</sup>)', 'T(n)=2T(n/2)+1 → Θ(n)'],
          ['2 · 平衡', 'f(n) = Θ(n<sup>log<sub>b</sub>a</sup> log<sup>k</sup>n)', 'T(n) = Θ(n<sup>log<sub>b</sub>a</sup> log<sup>k+1</sup>n)', 'T(n)=2T(n/2)+n → Θ(n log n)'],
          ['3 · 根支配', 'f(n) = Ω(n<sup>log<sub>b</sub>a+ε</sup>) 且 a·f(n/b) ≤ c·f(n)', 'T(n) = Θ(f(n))', 'T(n)=2T(n/2)+n² → Θ(n²)']
        ] },
        { t: 'table', caption: '常见递推式的解（背下来能省一半时间）', head: ['递推式', '解', '出处'], rows: [
          ['T(n) = T(n−1) + O(1)', 'Θ(n)', '线性扫描'],
          ['T(n) = T(n−1) + O(n)', 'Θ(n²)', '选择排序、朴素快排最坏'],
          ['T(n) = T(n/2) + O(1)', 'Θ(log n)', '二分查找'],
          ['T(n) = 2T(n/2) + O(n)', 'Θ(n log n)', '归并排序、FFT'],
          ['T(n) = 2T(n/2) + O(1)', 'Θ(n)', '树遍历、建堆'],
          ['T(n) = 3T(n/2) + O(n)', 'Θ(n<sup>log₂3</sup>) ≈ Θ(n<sup>1.585</sup>)', 'Karatsuba 乘法'],
          ['T(n) = 7T(n/2) + O(n²)', 'Θ(n<sup>log₂7</sup>) ≈ Θ(n<sup>2.807</sup>)', 'Strassen 矩阵乘法'],
          ['T(n) = 2T(n−1) + O(1)', 'Θ(2<sup>n</sup>)', '汉诺塔、子集枚举']
        ] },
        { t: 'compare', left: { title: '主定理能用时', html: '先算 log<sub>b</sub>a，再与 f(n) 的阶比较；差一个多项式因子才能落进情况 1 或 3，只差 log 因子属于情况 2。' }, right: { title: '主定理失效时', html: '子问题规模不等（T(n)=T(n/3)+T(2n/3)+n）、f 不是多项式、a 随 n 变化，都要回到递归树或代入法。' } },
        { t: 'callout', kind: 'tip', title: '代入法的标准三步', html: '猜测解 → 用归纳假设代入并化简 → 求出使不等式成立的常数。最后写「由归纳法，对所有 n ≥ n₀ 成立」。猜解可以从递归树的前几层和叶子数估出来。' }
      ]
    },
    {
      label: '数据结构代价',
      blocks: [
        { t: 'table', caption: '平均/最坏时间复杂度速查（n 个元素）', head: ['结构', '查找', '插入', '删除', '备注'], rows: [
          ['有序数组', 'O(log n)', 'O(n)', 'O(n)', '二分查找，插入要搬移'],
          ['链表', 'O(n)', 'O(1)', 'O(1)*', '*已知前驱指针'],
          ['二叉堆', 'O(n) 任意 / O(1) 最值', 'O(log n)', 'O(log n) 取最值', '建堆 O(n)'],
          ['BST（不平衡）', 'O(h)，最坏 O(n)', 'O(h)', 'O(h)', '有序插入会退化成链'],
          ['AVL / 红黑树', 'O(log n)', 'O(log n)', 'O(log n)', '旋转维持平衡'],
          ['散列表（链接法）', 'Θ(1+α)', 'Θ(1)', 'Θ(1+α)', '最坏 O(n)'],
          ['vEB 树（u 为整数宇宙）', 'O(log log u)', 'O(log log u)', 'O(log log u)', '空间 O(u)'],
          ['并查集', '—', '近乎 O(1)', '—', '路径压缩 + 按秩，O(α(n))']
        ] },
        { t: 'table', caption: '四种平衡旋转的判定（AVL）', head: ['失衡形态', '插入位置', '旋转', '记忆'], rows: [
          ['LL', '左子树的左子树', '右旋', '左边重，往右压'],
          ['RR', '右子树的右子树', '左旋', '右边重，往左压'],
          ['LR', '左子树的右子树', '先左旋再右旋', '折线，先掰直'],
          ['RL', '右子树的左子树', '先右旋再左旋', '折线，先掰直']
        ] },
        { t: 'code', lang: 'text', caption: '堆的上滤 / 下滤骨架', code: 'sift_up(i):\n  while i > 1 and a[i] < a[i/2]:\n    swap(a[i], a[i/2]); i = i/2\n\nsift_down(i, n):\n  while 2i <= n:\n    j = 2i\n    if j+1 <= n and a[j+1] < a[j]: j = j+1\n    if a[i] <= a[j]: break\n    swap(a[i], a[j]); i = j' },
        { t: 'callout', kind: 'warn', title: '三个高频错误', html: '① 建堆是 O(n) 不是 O(n log n)：自底向上从 n/2 开始下滤，总代价是等比级数。② 堆不是有序结构，中序遍历没有意义。③ AVL 删除可能沿路径多次旋转，与插入不同。' }
      ]
    },
    {
      label: '图算法',
      blocks: [
        { t: 'table', caption: '单源最短路：按边权与图类型选算法', head: ['算法', '适用条件', '复杂度', '能否处理负权'], rows: [
          ['BFS', '无权图（边权全 1）', 'O(V+E)', '不适用'],
          ['DAG 最短路', '有向无环图，任意权', 'O(V+E)', '可以（按拓扑序）'],
          ['Dijkstra（二叉堆）', '非负权', 'O((V+E) log V)', '不可以'],
          ['Bellman-Ford', '任意权，可检测负环', 'O(VE)', '可以'],
          ['Floyd-Warshall', '全源最短路', 'O(V³)', '可以（无负环）'],
          ['A*', '有 admissible 启发式', '取决于 h', '通常非负']
        ] },
        { t: 'table', caption: '遍历与连通性', head: ['问题', '算法', '关键点'], rows: [
          ['最短边数路径', 'BFS', '按层扩展，首次访问即最短'],
          ['拓扑排序', 'Kahn / DFS 后序', '有环则无解；Kahn 输出数 < n 即有环'],
          ['强连通分量', 'Kosaraju / Tarjan', 'Kosaraju 两遍 DFS：原图 + 反图'],
          ['割点与桥', 'DFS 的 low 值', 'low[v] ≥ disc[u] 则 u 是割点'],
          ['二分图判定', 'BFS 染色', '相邻点异色，冲突即非二分图'],
          ['最小生成树', 'Prim / Kruskal', '割性质 / 环性质；Kruskal 需并查集']
        ] },
        { t: 'compare', left: { title: 'Prim：从点长树', html: '维护已选点集到未选点的最小边，适合<b>稠密图</b>；二叉堆 O(E log V)，数组 O(V²)。' }, right: { title: 'Kruskal：从边选树', html: '按边权排序，用并查集跳过成环的边，适合<b>稀疏图</b>；O(E log E)。' } },
        { t: 'callout', kind: 'exam', title: '跑 Dijkstra 的表格写法', html: '列一张表：顶点 | 已确定 | dist | prev。每轮从未确定顶点中取 dist 最小者标记确定，松弛它的出边。负权边一出现就说明该用 Bellman-Ford——这是最常见的判断题陷阱。' }
      ]
    },
    {
      label: '范式与 NP',
      blocks: [
        { t: 'table', caption: '四种设计范式：什么时候用、什么时候失效', head: ['范式', '适用信号', '代价', '反例 / 边界'], rows: [
          ['分治', '问题可拆成同类子问题、合并代价可控', 'T(n)=aT(n/b)+f(n)', '子问题重叠时退化成指数'],
          ['贪心', '可证贪心选择性质（交换论证）', '通常 O(n log n)', '0/1 背包、找零（非规范币制）'],
          ['动态规划', '最优子结构 + 重叠子问题', '状态数 × 转移代价', '状态设计漏维就错'],
          ['网络流', '有容量约束的分配/匹配', 'O(V²E) ~ O(V³)', '非线性目标需重新建模']
        ] },
        { t: 'table', caption: 'NP 完全性证明模板与常见 NPC 问题', head: ['步骤', '要写什么', '常见源问题'], rows: [
          ['1 · 属于 NP', '给出证书并验证多项式时间', '—'],
          ['2 · 选已知 NPC', 'SAT / 3-SAT / Clique / Vertex Cover / Hamiltonian Cycle', '3-SAT 最常用'],
          ['3 · 构造归约', '把源实例映射为目标实例，多项式时间可算', ' gadget 设计'],
          ['4 · 证明等价', '源有解 ⇔ 目标有解（两个方向都要写）', '—']
        ] },
        { t: 'table', caption: '近似算法速查', head: ['问题', '算法', '近似比', '备注'], rows: [
          ['顶点覆盖', '取极大匹配的端点', '2', '紧例：完全二分图'],
          ['度量 TSP', 'MST 双遍走', '2', '利用三角不等式'],
          ['度量 TSP', 'Christofides', '3/2', 'MST + 最小权完美匹配'],
          ['并行机调度 P||Cmax', 'LPT 降序贪心', '4/3 − 1/(3k)', 'k 为机器数'],
          ['集合覆盖', '贪心选覆盖最多者', 'H(n) ≈ ln n', '近似比随 n 增长']
        ] },
        { t: 'callout', kind: 'tip', title: '一句话区分判定、优化与近似', html: '判定问「有没有 ≤ k 的解」（NP 完全性用这个）；优化问「最小的 k 是多少」；近似问「多项式时间能保证多接近最优」。三者可以互相转化，但复杂度结论只对判定形式严格成立。' }
      ]
    }
  ]
};
