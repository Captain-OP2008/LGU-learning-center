/* =====================================================================
 * projects.js · MAT3007 实战项目
 * 结构：{ id, title, en, tagline, level, minutes, chapters, goals, intro,
 *         milestones:[{ n, title, tasks, starter, hints, solution }] }
 * 目标：3 个项目，由易到难，分别落在建模、凸优化求解与一阶算法上。
 * ===================================================================== */
(function () {
  'use strict';

  CSC.registerProjects([

    /* ------------------------------------------------------------ 项目 1 */
    {
      id: 'mat3007-p1',
      title: '生产计划：从一句话到 LP 与影子价格',
      en: 'Production Planning LP',
      tagline: '把一段车间描述翻成线性规划，解出来，再用对偶解释「多一吨原料值多少钱」。',
      level: '入门',
      minutes: 120,
      chapters: ['ch01', 'ch04', 'ch05'],
      goals: [
        '能把文字描述拆成决策变量、线性目标与线性约束，并补全非负约束',
        '能用枚举顶点与 scipy.optimize.linprog 两种方式求解同一个 LP，并互相对照',
        '能写出对偶问题、读出影子价格，并用它回答「多一单位资源值多少」',
        '能判断哪些约束冗余、哪些约束在最优解处起作用'
      ],
      intro: '某车间生产两种产品，单件利润分别为 40 与 30。每件产品 1 消耗 2 单位工时与 1 单位原料，' +
        '每件产品 2 消耗 1 单位工时与 3 单位原料；本周可用工时为 100，可用原料为 90。' +
        '目标是安排产量使总利润最大。数据已经写在 starter 里，请完成建模、求解与对偶分析。',
      milestones: [
        {
          n: 1,
          title: '建模与手工求解',
          tasks: [
            '写出决策变量 x1、x2 的含义与单位，明确它们非负',
            '写出目标函数与两条资源约束，检查每条约束的量纲是否一致',
            '把可行域画在纸上，列出全部顶点，逐个计算目标值',
            '指出哪个顶点最优、哪些约束在该点取等号，并解释为什么第三条约束不需要'
          ],
          starter: 'import numpy as np\\n\\nc = np.array([40.0, 30.0])      # 单件利润\\nA = np.array([[2.0, 1.0],      # 工时消耗\\n              [1.0, 3.0]])     # 原料消耗\\nb = np.array([100.0, 90.0])    # 资源上限\\n\\n# 顶点列表：把可行域的每个顶点写进来，再算 c 与它的内积\\nvertices = []\\nprint("顶点个数：", len(vertices))',
          hints: [
            '两条约束都是 ≤，可行域是左下角围出的四边形，顶点由「两条边界相交」或「边界与坐标轴相交」产生',
            '把候选点代回两条约束，任何一个不满足就说明这个交点不在可行域内',
            '两个变量、两条非坐标轴约束，最多 4 个顶点：原点和两个截距点，再加两条约束的交点'
          ],
          solution: 'import numpy as np\\n\\nc = np.array([40.0, 30.0])\\nA = np.array([[2.0, 1.0], [1.0, 3.0]])\\nb = np.array([100.0, 90.0])\\n\\n# 顶点：原点、两个截距点、两条约束的交点\\nvertices = [np.array([0.0, 0.0]), np.array([50.0, 0.0]),\\n            np.array([0.0, 30.0]), np.array([42.0, 16.0])]\\n\\nfor v in vertices:\\n    if np.all(A @ v <= b + 1e-9):\\n        print(v, "目标值", c @ v)\\n\\n# 交点验证：2x1 + x2 = 100 且 x1 + 3x2 = 90\\n# 解得 x = (42, 16)，目标值 40*42 + 30*16 = 2160'
        },
        {
          n: 2,
          title: '用求解器复核并读对偶',
          tasks: [
            '用 scipy.optimize.linprog 求最大值（注意把目标取负），打印最优解与最优值',
            '核对求解器给出的目标值与手工枚举的 2160 是否一致',
            '写出对偶问题：max 改成 min 后乘子符号如何变化，两条对偶约束是什么',
            '解出对偶最优解 (y1, y2)，验证 100y1 + 90y2 = 2160（强对偶）'
          ],
          starter: 'from scipy.optimize import linprog\\nimport numpy as np\\n\\nc = np.array([40.0, 30.0])\\nA = np.array([[2.0, 1.0], [1.0, 3.0]])\\nb = np.array([100.0, 90.0])\\n\\nres = linprog(-c, A_ub=A, b_ub=b, bounds=[(0, None), (0, None)], method="highs")\\nprint("x =", res.x)\\nprint("p* =", -res.fun)\\nprint("对偶变量 =", res.ineqlin.marginals)',
          hints: [
            'linprog 只做最小化，所以传 -c，最后把目标值再取负',
            'res.ineqlin.marginals 给出的是对偶变量，符号与「≤ 约束」的乘子约定有关，先看数值再判断正负',
            '对偶约束由 A^T y ≥ c 给出：2y1 + y2 ≥ 40，y1 + 3y2 ≥ 30'
          ],
          solution: 'from scipy.optimize import linprog\\nimport numpy as np\\n\\nc = np.array([40.0, 30.0])\\nA = np.array([[2.0, 1.0], [1.0, 3.0]])\\nb = np.array([100.0, 90.0])\\n\\nres = linprog(-c, A_ub=A, b_ub=b, bounds=[(0, None), (0, None)], method="highs")\\nprint("x* =", res.x, "p* =", -res.fun)\\nprint("marginals =", res.ineqlin.marginals)\\n\\n# 手工对偶：max 100y1 + 90y2 s.t. 2y1 + y2 >= 40, y1 + 3y2 >= 30, y >= 0\\n# 两条对偶约束在最优处都取等号：y = (18, 4)，d* = 1800 + 360 = 2160'
        },
        {
          n: 3,
          title: '影子价格与灵敏度报告',
          tasks: [
            '解释 y1 = 18 的含义：多 1 单位工时，利润大约增加多少，这个结论在什么范围内成立',
            '把工时上限从 100 改成 101，重新求解，验证利润增量与 y1 的关系',
            '把原料上限从 90 改成 200（远超最优点所需），观察影子价格与最优解如何变化',
            '写一段 150 字左右的管理建议，说明本周应该优先扩充哪种资源'
          ],
          starter: 'from scipy.optimize import linprog\\nimport numpy as np\\n\\nc = np.array([40.0, 30.0])\\nA = np.array([[2.0, 1.0], [1.0, 3.0]])\\n\\ndef solve(b):\\n    res = linprog(-c, A_ub=A, b_ub=b, bounds=[(0, None), (0, None)], method="highs")\\n    return res.x, -res.fun\\n\\nfor delta in [0, 1, 5, 10]:\\n    print(delta, solve(np.array([100.0 + delta, 90.0])))',
          hints: [
            '影子价格只在当前基（起作用的约束集合）不变的范围内等于 −λ*，超出范围后会有新约束接管',
            '把 b2 提到 200 后，原料不再稀缺，它的乘子应变成 0，但最优解可能仍受工时限制',
            '注意 res.ineqlin.marginals 的符号约定，写报告时统一成「每多一单位资源、利润增加多少」'
          ],
          solution: 'from scipy.optimize import linprog\\nimport numpy as np\\n\\nc = np.array([40.0, 30.0])\\nA = np.array([[2.0, 1.0], [1.0, 3.0]])\\n\\ndef solve(b):\\n    res = linprog(-c, A_ub=A, b_ub=b, bounds=[(0, None), (0, None)], method="highs")\\n    return res.x, -res.fun\\n\\nbase_x, base_p = solve(np.array([100.0, 90.0]))\\nfor delta in [1, 2, 5, 10]:\\n    x, p = solve(np.array([100.0 + delta, 90.0]))\\n    print("d =", delta, "增量 =", round(p - base_p, 4), "每单位 =", round((p - base_p) / delta, 4))\\n\\n# 前几个 delta 的每单位增量约等于 18，与 y1 = 18 一致；\\n# 当工时增加到使原料约束不再起作用时，增量会掉到 0，影子价格失效。'
        }
      ]
    },

    /* ------------------------------------------------------------ 项目 2 */
    {
      id: 'mat3007-p2',
      title: '投资组合：Markowitz 模型与有效前沿',
      en: 'Markowitz Portfolio QP',
      tagline: '用二次规划在「收益」与「风险」之间画出一条可以解释的曲线。',
      level: '中级',
      minutes: 180,
      chapters: ['ch03', 'ch04', 'ch05', 'ch07'],
      goals: [
        '能把均值-方差模型写成标准 QP：凸二次目标加两条线性约束',
        '能用 CVXPY 求解并画出有效前沿，理解「给定收益下的最小风险」',
        '能从对偶变量解释约束的影子价格，理解为什么加收益目标会抬高边际风险',
        '能讨论卖空约束、交易成本与估计误差对解的影响'
      ],
      intro: '给定 n 只资产的期望收益 μ 与协方差 Σ，权重 w 的组合收益为 μ^T w、方差为 w^T Σ w。' +
        'Markowitz 模型在「权重和为 1」与「收益不低于目标 r」的约束下最小化方差。' +
        '本项目用 5 只合成资产做实验：先解单个 QP，再扫一遍 r 画出有效前沿，最后加入卖空约束比较差异。',
      milestones: [
        {
          n: 1,
          title: '写出并求解单个 QP',
          tasks: [
            '写出 min w^T Σ w s.t. μ^T w ≥ r，1^T w = 1，w ≥ 0，并说明它是凸问题',
            '用 CVXPY 建立模型，设 r = 0.08，求解并打印权重与组合波动率',
            '检查最优解是否满足全部约束，特别是权重和是否精确等于 1',
            '解释为什么目标里常写 (1/2)w^T Σ w：它不改变最优解，只让梯度更干净'
          ],
          starter: 'import numpy as np\\nimport cvxpy as cp\\n\\nnp.random.seed(0)\\nmu = np.array([0.06, 0.08, 0.10, 0.12, 0.15])\\n\\n# 构造一个半正定协方差矩阵\\nF = np.random.randn(5, 5) * 0.05\\nSigma = F @ F.T + np.diag([0.02, 0.03, 0.04, 0.05, 0.06])\\n\\nw = cp.Variable(5)\\nr = 0.08\\nobj = cp.Minimize(cp.quad_form(w, Sigma))\\ncons = [cp.sum(w) == 1, mu @ w >= r, w >= 0]\\nprob = cp.Problem(obj, cons)\\nprob.solve()\\nprint("status =", prob.status)\\nprint("w =", w.value)',
          hints: [
            'cp.quad_form(w, Sigma) 要求 Sigma 半正定，可以用 np.linalg.eigvalsh 检查最小特征值',
            '约束写成列表一次传给 Problem，求解器会同时处理等式与不等式',
            '如果 r 设得高于最大单资产收益，问题会不可行，prob.status 会变成 infeasible'
          ],
          solution: 'import numpy as np\\nimport cvxpy as cp\\n\\nnp.random.seed(0)\\nmu = np.array([0.06, 0.08, 0.10, 0.12, 0.15])\\nF = np.random.randn(5, 5) * 0.05\\nSigma = F @ F.T + np.diag([0.02, 0.03, 0.04, 0.05, 0.06])\\nprint("最小特征值 =", np.linalg.eigvalsh(Sigma).min())\\n\\nw = cp.Variable(5)\\nr = 0.08\\nprob = cp.Problem(cp.Minimize(cp.quad_form(w, Sigma)),\\n                  [cp.sum(w) == 1, mu @ w >= r, w >= 0])\\nprob.solve()\\nprint(prob.status, np.round(w.value, 4))\\nprint("收益 =", round(float(mu @ w.value), 4), "波动率 =", round(float(np.sqrt(w.value @ Sigma @ w.value)), 4))'
        },
        {
          n: 2,
          title: '扫出有效前沿',
          tasks: [
            '让 r 从 0.06 到 0.14 取 17 个点，每次求解并记录波动率',
            '以波动率为横轴、收益为纵轴画曲线，标出最小方差组合的位置',
            '验证曲线左端（最小方差组合）以下不存在可行组合，解释原因',
            '比较「最小方差组合」与「等权组合」的波动率，说明优化带来了多少改善'
          ],
          starter: 'import numpy as np\\nimport cvxpy as cp\\nimport matplotlib.pyplot as plt\\n\\nmu = np.array([0.06, 0.08, 0.10, 0.12, 0.15])\\nF = np.random.randn(5, 5) * 0.05\\nSigma = F @ F.T + np.diag([0.02, 0.03, 0.04, 0.05, 0.06])\\n\\nfrontier = []\\nfor r in np.linspace(0.06, 0.14, 17):\\n    # 建立并求解模型，把 (波动率, 收益) 追加到 frontier\\n    pass\\n\\nprint(frontier)',
          hints: [
            '把求解封装成函数，返回 (收益, 波动率, 权重)，循环里只改 r',
            '最小方差组合不对收益做要求，等价于去掉收益约束后单独求一次',
            '等权组合的波动率是 sqrt((1/n)^T Sigma (1/n))，用一行 numpy 就能算'
          ],
          solution: 'import numpy as np\\nimport cvxpy as cp\\n\\nmu = np.array([0.06, 0.08, 0.10, 0.12, 0.15])\\nF = np.random.randn(5, 5) * 0.05\\nSigma = F @ F.T + np.diag([0.02, 0.03, 0.04, 0.05, 0.06])\\n\\ndef solve(r):\\n    w = cp.Variable(5)\\n    cons = [cp.sum(w) == 1, mu @ w >= r, w >= 0]\\n    cp.Problem(cp.Minimize(cp.quad_form(w, Sigma)), cons).solve()\\n    return w.value\\n\\nfrontier = []\\nfor r in np.linspace(0.06, 0.14, 17):\\n    w = solve(r)\\n    if w is None:\\n        continue\\n    frontier.append((float(np.sqrt(w @ Sigma @ w)), float(mu @ w)))\\nprint(np.round(frontier, 4))\\n\\nw_eq = np.ones(5) / 5\\nprint("等权波动率 =", round(float(np.sqrt(w_eq @ Sigma @ w_eq)), 4))'
        },
        {
          n: 3,
          title: '约束、成本与估计误差',
          tasks: [
            '加入卖空约束 w ≥ 0 与不加约束两种情形各解一次，比较权重与波动率',
            '在目标中加入交易成本项 κ‖w − w0‖₁，说明它为什么仍是凸问题、如何改写',
            '把 μ 整体扰动 1%，重解前沿，观察权重变化幅度（估计误差敏感性）',
            '用 200 字总结：有效前沿好看，但实盘使用前必须处理哪三个问题'
          ],
          starter: 'import numpy as np\\nimport cvxpy as cp\\n\\nmu = np.array([0.06, 0.08, 0.10, 0.12, 0.15])\\nF = np.random.randn(5, 5) * 0.05\\nSigma = F @ F.T + np.diag([0.02, 0.03, 0.04, 0.05, 0.06])\\nw0 = np.ones(5) / 5\\nkappa = 0.01\\n\\ndef solve(short_allowed, r):\\n    w = cp.Variable(5)\\n    cons = [cp.sum(w) == 1, mu @ w >= r]\\n    if not short_allowed:\\n        cons.append(w >= 0)\\n    # 目标里加入 kappa * norm1(w - w0)\\n    pass\\n\\nprint(solve(False, 0.10), solve(True, 0.10))',
          hints: [
            'CVXPY 用 cp.norm1(w - w0) 表示 L1 范数，它本身就是凸的，直接写进目标即可',
            '允许卖空时权重可能为负，波动率不一定更低，因为负权重会放大风险',
            '估计误差实验只需把 mu 乘上 0.99 与 1.01 各解一次，比较权重向量的差'
          ],
          solution: 'import numpy as np\\nimport cvxpy as cp\\n\\nmu = np.array([0.06, 0.08, 0.10, 0.12, 0.15])\\nF = np.random.randn(5, 5) * 0.05\\nSigma = F @ F.T + np.diag([0.02, 0.03, 0.04, 0.05, 0.06])\\nw0 = np.ones(5) / 5\\nkappa = 0.01\\n\\ndef solve(short_allowed, r, mu_hat=mu):\\n    w = cp.Variable(5)\\n    cons = [cp.sum(w) == 1, mu_hat @ w >= r]\\n    if not short_allowed:\\n        cons.append(w >= 0)\\n    obj = cp.Minimize(cp.quad_form(w, Sigma) + kappa * cp.norm1(w - w0))\\n    cp.Problem(obj, cons).solve()\\n    return w.value\\n\\nfor allowed in [False, True]:\\n    w = solve(allowed, 0.10)\\n    print("卖空 =", allowed, np.round(w, 4), "波动率 =", round(float(np.sqrt(w @ Sigma @ w)), 4))\\n\\nw_up = solve(False, 0.10, mu * 1.01)\\nw_dn = solve(False, 0.10, mu * 0.99)\\nprint("权重对 1% 扰动的最大变化 =", round(float(np.abs(w_up - w_dn).max()), 4))'
        }
      ]
    },

    /* ------------------------------------------------------------ 项目 3 */
    {
      id: 'mat3007-p3',
      title: '稀疏回归：从软阈值到 ADMM 图像去噪',
      en: 'Sparse Regression and ADMM',
      tagline: '手写软阈值与 ADMM，把 Lasso 解出来，再用同一套代码给图片去噪。',
      level: '进阶',
      minutes: 240,
      chapters: ['ch03', 'ch06', 'ch07'],
      goals: [
        '能推出 Lasso 的近端算子就是软阈值，并解释它为什么产生精确零',
        '能写出 ADMM 的三步更新，并把 x-子问题化简为一次线性方程组求解',
        '能用 CVXPY 作为参照验证自写 ADMM 的正确性',
        '能把同一算法迁移到图像去噪，理解正则化强度与平滑程度的关系'
      ],
      intro: 'Lasso 问题 min (1/2)‖Ax − b‖² + λ‖x‖₁ 的 L1 项不可微，不能直接套梯度下降。' +
        '本项目分三步：先验证软阈值是 L1 近端算子；再把问题拆成 ADMM 的三步迭代并与 CVXPY 对照；' +
        '最后把 A 取成单位阵，Lasso 退化为逐元素去噪，用同一套代码处理一张灰度图。',
      milestones: [
        {
          n: 1,
          title: '软阈值与近端算子',
          tasks: [
            '证明 min_z (1/2)(z − v)² + λ|z| 的解是 S_λ(v) = sign(v)·max(|v| − λ, 0)',
            '实现 soft(v, lam)，用 v = −5、−0.5、0、0.5、5 与 λ = 1 验证输出',
            '画出一维软阈值曲线，说明为什么 |v| ≤ λ 的输出恰好为 0',
            '对比硬阈值：解释为什么软阈值解是唯一的、而硬阈值不是'
          ],
          starter: 'import numpy as np\\n\\ndef soft(v, lam):\\n    # 返回 sign(v) * max(|v| - lam, 0)\\n    pass\\n\\nvs = np.array([-5.0, -0.5, 0.0, 0.5, 5.0])\\nprint([soft(v, 1.0) for v in vs])',
          hints: [
            '对 z > 0 与 z < 0 分别求导，令导数为零，再检查边界 z = 0',
            'numpy 里用 np.sign(v) * np.maximum(np.abs(v) - lam, 0.0) 一次算完整个向量',
            '硬阈值是 v 乘以指示函数，在跳变点不连续；软阈值连续且把小区间整体压成 0'
          ],
          solution: 'import numpy as np\\n\\ndef soft(v, lam):\\n    return np.sign(v) * np.maximum(np.abs(v) - lam, 0.0)\\n\\nvs = np.array([-5.0, -0.5, 0.0, 0.5, 5.0])\\nprint(soft(vs, 1.0))\\n\\n# 推导：z > 0 时目标为 (1/2)(z-v)^2 + lam z，驻点 z = v - lam；\\n# 若 v - lam <= 0，则最优落在边界 z = 0，于是得到 max(|v| - lam, 0)。'
        },
        {
          n: 2,
          title: 'ADMM 求解 Lasso 并对照 CVXPY',
          tasks: [
            '把 Lasso 写成 min f(x) + g(z) s.t. x − z = 0，写出增广拉格朗日函数',
            '推导 x-更新为解 (A^T A + ρI)x = A^T b + ρ(z − u)，z-更新为软阈值',
            '实现完整 ADMM 循环，记录每轮的原始残差与对偶残差',
            '用 CVXPY 解同一个问题，比较目标值与支撑集（非零位置）是否一致'
          ],
          starter: 'import numpy as np\\n\\nnp.random.seed(1)\\nm, n = 60, 20\\nA = np.random.randn(m, n) / np.sqrt(m)\\nb = A @ np.array([3.0, 0.0, -2.0] + [0.0] * (n - 3)) + 0.01 * np.random.randn(m)\\nlam = 0.05\\nrho = 1.0\\n\\nx = np.zeros(n)\\nz = np.zeros(n)\\nu = np.zeros(n)\\n\\nfor k in range(200):\\n    # 1) x-更新：解线性方程组\\n    # 2) z-更新：软阈值\\n    # 3) u-更新：对偶变量累积残差\\n    pass',
          hints: [
            'x-更新的矩阵 A^T A + rho * I 只需分解一次，循环里反复用同一份分解',
            'z-更新是 soft(x + u, lam / rho)，注意阈值要除以 rho',
            'u 的更新为 u + x − z；残差 r = x − z，s = rho * (z - z_old)'
          ],
          solution: 'import numpy as np\\nimport cvxpy as cp\\n\\nnp.random.seed(1)\\nm, n = 60, 20\\nA = np.random.randn(m, n) / np.sqrt(m)\\nx_true = np.array([3.0, 0.0, -2.0] + [0.0] * (n - 3))\\nb = A @ x_true + 0.01 * np.random.randn(m)\\nlam, rho = 0.05, 1.0\\n\\nM = A.T @ A + rho * np.eye(n)\\nAtb = A.T @ b\\nx, z, u = np.zeros(n), np.zeros(n), np.zeros(n)\\nfor k in range(200):\\n    x = np.linalg.solve(M, Atb + rho * (z - u))\\n    z_old = z.copy()\\n    v = x + u\\n    z = np.sign(v) * np.maximum(np.abs(v) - lam / rho, 0.0)\\n    u = u + x - z\\n    if k % 50 == 0:\\n        print(k, "原始残差", round(float(np.linalg.norm(x - z)), 6),\\n              "对偶残差", round(float(rho * np.linalg.norm(z - z_old)), 6))\\n\\nw = cp.Variable(n)\\ncp.Problem(cp.Minimize(0.5 * cp.sum_squares(A @ w - b) + lam * cp.norm1(w))).solve()\\nprint("ADMM 支撑", np.flatnonzero(np.abs(z) > 1e-6))\\nprint("CVXPY 支撑", np.flatnonzero(np.abs(w.value) > 1e-6))'
        },
        {
          n: 3,
          title: '图像去噪与正则化强度',
          tasks: [
            '取 A = I，说明此时 Lasso 的解为什么就是 soft(b, λ)',
            '对一张灰度图逐像素应用软阈值，比较 λ = 0.05、0.1、0.2 的平滑效果',
            '计算每个 λ 下的均方误差（相对干净图），找出最优 λ 并解释过大会发生什么',
            '把 L1 换成全变分（TV）正则项，写出对应的 ADMM 更新思路（可只写公式）'
          ],
          starter: 'import numpy as np\\n\\ndef denoise(img, lam):\\n    # A = I 时，Lasso 的解为逐元素软阈值\\n    return img\\n\\nnoisy = np.clip(np.random.rand(64, 64), 0.0, 1.0)\\nfor lam in [0.05, 0.1, 0.2]:\\n    out = denoise(noisy, lam)\\n    print(lam, float(np.abs(out - noisy).mean()))',
          hints: [
            'A = I 时目标按坐标分解，每个像素独立地解一元软阈值问题',
            '均方误差要用干净图与去噪结果算；没有干净图时可以退而用噪声方差的估计',
            'λ 太大时细节被压平、图像变糊，偏差增大；λ 太小时噪声残留，方差大'
          ],
          solution: 'import numpy as np\\n\\ndef soft(v, lam):\\n    return np.sign(v) * np.maximum(np.abs(v) - lam, 0.0)\\n\\ndef denoise(img, lam):\\n    return soft(img, lam)\\n\\nclean = np.zeros((64, 64))\\nclean[20:40, 20:40] = 0.8\\nnoisy = np.clip(clean + 0.15 * np.random.randn(64, 64), 0.0, 1.0)\\n\\nfor lam in [0.05, 0.1, 0.2]:\\n    out = denoise(noisy, lam)\\n    mse = float(np.mean((out - clean) ** 2))\\n    print(lam, "MSE =", round(mse, 5), "非零像素 =", int(np.count_nonzero(out)))\\n\\n# TV 正则：min (1/2)||x - b||^2 + lam * sum |x_{i+1} - x_i|\\n# 引入差分算子 D，令 z = Dx，则 z-更新仍是软阈值，x-更新解 (I + rho D^T D)x = b + rho D^T(z - u)。'
        }
      ]
    }
  ]);
})();
