/* =====================================================================
 * site.js · 站点配置（window.CSC_SITE）
 * 所有展示文案集中在这里；换课程只需改本文件与 data/ 下的章节文件。
 * ===================================================================== */
window.CSC_SITE = {
  id: 'dda2001',
  short: 'DDA2001',
  name: '数据科学与分析导论',
  en: 'Introduction to Data Science and Analytics',
  dept: '统计与数据科学',
  lang: 'python',
  langLabel: 'Python / R',

  /* 首页启动终端 */
  mode: 'STATIC · 阅读型',
  bootHead: 'DDA2001 // OBSERVATORY',
  bootLog: [
    '> mounting course partition ... DDA2001',
    '> loading 8 modules / 24 lectures ...',
    '> seeding probability -> inference -> optimization -> ML ...',
    '> all systems nominal. welcome aboard.'
  ],

  /* 首页主视觉文案 */
  tagline: '先把不确定性写成数字，再让数据说话。',
  missionEn: 'DDA2001 · 8 MODULES',
  missionTitle: '从概率到机器学习<br><em>一条线走通</em>',
  lede: '这门课从「数据科学在回答什么问题」出发，经过概率、随机变量、统计推断、线性回归、凸性与优化，最后落到 KNN、逻辑回归与模型选择。每一章都配有例子、对比表、常见错误与自检清单。',
  searchPlaceholder: 'QUERY // 搜索章节、术语与题目',

  /* 资料库（path 相对 "CUHKSZ course" 目录，由 tools/check-content.js 校验存在性） */
  resBase: '../../resources/DDA2001/',
  resources: {
    note: '资料按讲义、作业习题、考试三组排列；文件名里的 Lecture 编号与本站章节的对应关系见第 0 章的地图。',
    groups: [
      {
        name: '讲义（节选）',
        items: [
          { title: 'Lecture 01 · 概率与样本空间', path: '学习资料/DDA2001_Lecture_01_Jiaqi_Lu.pdf', kind: 'pdf', note: '对应第 1 章' },
          { title: 'Lecture 11 · 线性回归', path: '学习资料/DDA2001_Lecture_11_Linear_Regression.pdf', kind: 'pdf', note: '对应第 4 章' },
          { title: 'Lecture 15 · 凸集', path: '学习资料/DDA2001_Lecture_15_Convex_Set.pdf', kind: 'pdf', note: '对应第 5 章' },
          { title: 'Lecture 20 · KNN', path: '学习资料/DDA2001_Lecture_20_Machine_Learning_KNN.pdf', kind: 'pdf', note: '对应第 7 章' },
          { title: 'Lecture 21 · 逻辑回归', path: '学习资料/DDA2001_Lecture_21_Logistic_Regression.pdf', kind: 'pdf', note: '对应第 7 章' }
        ]
      },
      {
        name: '作业与习题',
        items: [
          { title: 'HW 01', path: '作业习题/DDA2001_HW_01.pdf', kind: 'pdf' },
          { title: 'HW 01 参考解答', path: '作业习题/DDA2001_HW_01_Solution.pdf', kind: 'pdf' },
          { title: 'Tutorial 01', path: '作业习题/DDA2001_Tutorial_01.pdf', kind: 'pdf' },
          { title: 'Tutorial 02 参考解答', path: '作业习题/DDA2001_Tutorial_02_soln.pdf', kind: 'pdf' },
          { title: 'Week 11 演示 Notebook', path: '作业习题/DDA2001_Week_11.ipynb', kind: 'ipynb' }
        ]
      },
      {
        name: '考试与复习',
        items: [
          { title: '2024 Final（含解答）', path: '考试资料/DDA2001_2024_Final_WithSolution.pdf', kind: 'pdf' },
          { title: 'Final Review 讲义', path: '考试资料/DDA2001_Lecture_24_Final_Review.pdf', kind: 'pdf' },
          { title: 'Quiz 01 参考解答', path: '考试资料/DDA2001_Quiz_01_soln.pdf', kind: 'pdf' }
        ]
      }
    ]
  },

  /* 关于页的信息行 */
  aboutLines: [
    ['课程', '数据科学与分析导论（Introduction to Data Science and Analytics）'],
    ['来源', 'CUHKSZ DDA2001 课程资料'],
    ['结构', '8 章正文 · 分章题库 · 模拟卷 · 实战项目 · 资料库'],
    ['建议', '先读第 0 章建立地图，再按概率、推断、回归、优化、机器学习的顺序推进；每章结尾的自检清单不要跳过。']
  ],

  /* 速查表 */
  cheat: [
    {
      label: 'pandas / numpy',
      blocks: [
        {
          type: 'table',
          caption: '最常用的数据操作与对应代码',
          head: ['任务', '代码', '注意'],
          rows: [
            ['读入表格', "pd.read_csv('data.csv')", '先看 shape 与 head'],
            ['查看缺失', 'df.isna().sum()', '缺失比例高的列先别急着填'],
            ['分组统计', "df.groupby('g')['y'].mean()", '默认跳过缺失值'],
            ['新建列', "df['z'] = df['x'] * 2", '向量化运算，不要写循环'],
            ['排序取值', "df.nlargest(5, 'score')", '比 sort_values 再 head 更直接'],
            ['矩阵乘法', 'X @ beta', '形状对不上时先打印 shape']
          ]
        },
        {
          type: 'code',
          lang: 'python',
          caption: '一份最小可用的数据检查流程',
          code: "import pandas as pd\n\ndf = pd.read_csv('data.csv')\nprint(df.shape)\nprint(df.dtypes)\nprint(df.isna().sum())\nprint(df.describe().T)"
        },
        {
          type: 'callout',
          kind: 'tip',
          title: '列名里的空格与中文',
          html: '列名含空格或中文时，用 <code>df[\'总成绩\']</code> 这种方括号写法最稳；链式赋值 <code>df[df.x &gt; 0][\'y\'] = 1</code> 不会写回原表，应改用 <code>df.loc[df.x &gt; 0, \'y\'] = 1</code>。'
        }
      ]
    },
    {
      label: '概率与分布',
      blocks: [
        {
          type: 'table',
          caption: '三条常用分布的参数、均值与方差',
          head: ['分布', '参数', '均值', '方差'],
          rows: [
            ['二项 B(n, p)', 'n 次独立试验，每次成功概率 p', 'np', 'np(1−p)'],
            ['泊松 P(λ)', '单位时间平均发生 λ 次', 'λ', 'λ'],
            ['正态 N(μ, σ²)', '位置 μ，尺度 σ', 'μ', 'σ²']
          ]
        },
        {
          type: 'callout',
          kind: 'warn',
          title: '标准差与标准误不是一回事',
          html: '<code>σ</code> 描述单个观测的波动，<code>σ/√n</code> 描述样本均值的波动。样本量翻四倍，标准误才减半；把标准误当标准差写进报告，会让区间看起来窄得离谱。'
        },
        {
          type: 'table',
          caption: '条件概率与贝叶斯的分工',
          head: ['公式', '什么时候用'],
          rows: [
            ['P(A|B) = P(A∩B) / P(B)', '已知 B 发生，求 A 的概率'],
            ['P(A) = Σ P(A|Bᵢ)P(Bᵢ)', '结果已知，按原因分组求和'],
            ['P(B|A) = P(A|B)P(B) / P(A)', '把条件方向反过来，常配合基数率使用']
          ]
        }
      ]
    },
    {
      label: '回归与统计',
      blocks: [
        {
          type: 'table',
          caption: '回归输出里每个数字在说什么',
          head: ['指标', '公式', '读法'],
          rows: [
            ['斜率 b1', 'Sxy / Sxx', 'x 每增加一个单位，y 平均变化多少'],
            ['截距 b0', 'ȳ − b1x̄', 'x=0 时的预测值，未必有现实意义'],
            ['R²', '1 − SSE/SST', '模型解释了 y 的多少比例波动'],
            ['残差标准误 s', '√(SSE/(n−2))', '观测点离回归线的典型距离'],
            ['系数标准误', 's / √Sxx', '斜率估计的波动，用来算 t 与区间']
          ]
        },
        {
          type: 'code',
          lang: 'python',
          caption: '用 scipy 一次拿到斜率、截距、R² 与 p 值',
          code: "from scipy import stats\n\nres = stats.linregress(x, y)\nprint(res.slope, res.intercept)\nprint(res.rvalue ** 2, res.pvalue, res.stderr)"
        },
        {
          type: 'callout',
          kind: 'exam',
          title: '考点：R² 高不等于模型对',
          html: 'R² 只衡量拟合样本的程度，不检查线性假设、异方差与异常点。答题时若被问「这个模型能不能用」，要分别回答：系数是否显著、残差有没有结构、有没有外推。'
        }
      ]
    },
    {
      label: '优化与机器学习',
      blocks: [
        {
          type: 'table',
          caption: '训练不动的常见原因与排查顺序',
          head: ['现象', '常见原因', '先查什么'],
          rows: [
            ['损失变成 NaN', '学习率太大或对数里出现 0', '把 α 缩小十倍，检查 log 的参数'],
            ['损失震荡不降', '步长接近稳定上界', '算 2/λmax，或改用线搜索'],
            ['收敛很慢', '条件数大、特征尺度差异大', '标准化特征，考虑动量或牛顿法'],
            ['训练好测试差', '过拟合或数据泄漏', '先划分再预处理，加正则或简化模型'],
            ['准确率虚高', '类别不平衡', '改看精确率、召回率与 F1']
          ]
        },
        {
          type: 'table',
          caption: '三个评估指标的定义',
          head: ['指标', '公式', '关心什么'],
          rows: [
            ['精确率', 'TP / (TP + FP)', '报出来的阳性有多可信'],
            ['召回率', 'TP / (TP + FN)', '真正的阳性被抓到多少'],
            ['F1', '2PR / (P + R)', '精确率与召回率的调和平均']
          ]
        },
        {
          type: 'callout',
          kind: 'warn',
          title: '阈值是业务决定',
          html: '把阈值从 0.5 调到 0.3，召回率上升、精确率下降，模型本身没变。先问清楚漏判和误判哪个代价更高，再谈「最优阈值」。'
        }
      ]
    }
  ]
};
