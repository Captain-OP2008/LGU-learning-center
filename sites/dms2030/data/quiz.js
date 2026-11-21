/* =====================================================================
 * quiz.js · 分章题库（PACK.items）
 * 8 章 × 7 题 = 56 题；每章 q1–q3 与 chXX.js 内嵌题一一对应
 * 字段：{ id, ch, kp, tier, type, difficulty, tags, stem, options|answer|accept, explain }
 * predict 额外含 code / codeTitle / answer。
 * ===================================================================== */
(function () {
  var PACK = {
    items: [
      /* ---------------- ch00 课程地图 ---------------- */
      {
        id: 'ch00-q1', ch: 'ch00', kp: 'ch00-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '教材对运营与供应链管理（OSCM）的定义，最接近下面哪一句？',
        options: [
          { text: '把输入转化为产品与服务的计划、组织与控制活动', correct: true },
          { text: '只研究工厂车间的设备与工艺', correct: false },
          { text: '只包括采购与物流两个部门的工作', correct: false },
          { text: '只关注成本核算与财务报表', correct: false }
        ],
        explain: 'OSCM 覆盖从原料到交付的整条转化链：设计、采购、制造、交付与售后都被纳入，核心是把输入转化为顾客需要的产品与服务，并让这个转化过程高效、稳定、可盈利。只盯车间或只盯采购，都是把一条链切成了片段。'
      },
      {
        id: 'ch00-q2', ch: 'ch00', kp: 'ch00-3', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '与制造流程相比，服务流程最本质的特征是？',
        options: [
          { text: '产出不能储存，生产与消费同时发生，因此难以用库存缓冲需求', correct: true },
          { text: '服务无法计量，所以不需要质量指标', correct: false },
          { text: '服务不需要流程设计，只靠员工经验', correct: false },
          { text: '服务一定比制造更便宜', correct: false }
        ],
        explain: '服务不可储存、顾客参与生产、产出难以标准化，这三条决定了服务不能用成品库存吸收波动，只能靠产能弹性、预约与排队管理来调节供需。服务质量同样要量化，只是指标换成等待时间、首次解决率等。'
      },
      {
        id: 'ch00-q3', ch: 'ch00', kp: 'ch00-2', tier: 1, type: 'tf', difficulty: 1, tags: ['concept'],
        stem: '本站的七个主题章把教材 25 章全部讲完，没有做任何取舍。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '七个主题章覆盖教材的核心计算与决策内容，但项目管理（第 4 章）、工作中心排程（第 22 章）与两个专题章（第 24、25 章）没有单独成章，只在相关章节中以应用形式出现。这一取舍在每章结尾的「覆盖范围与依据」里都有说明。'
      },
      {
        id: 'ch00-q4', ch: 'ch00', kp: 'ch00-4', tier: 1, type: 'mcq', difficulty: 1, tags: ['method'],
        stem: '按本站的设计，最合理的学习顺序是？',
        options: [
          { text: '战略 → 产品设计与产能 → 流程 → 质量 → 库存 → 计划 → 供应链设计', correct: true },
          { text: '先读供应链设计，再回头学战略', correct: false },
          { text: '跳过概念章，直接刷题库', correct: false },
          { text: '只读库存一章，其余略过', correct: false }
        ],
        explain: '后面的工具都建立在「竞争优先级」之上：先想清楚凭什么赢，才知道该设计什么产品、留多少产能、把流程做成什么类型。库存与计划需要流程与质量的数据作输入，供应链设计再把前面所有工具放进一张网络。'
      },
      {
        id: 'ch00-q5', ch: 'ch00', kp: 'ch00-5', tier: 1, type: 'fill', difficulty: 1, tags: ['concept'],
        stem: '本课程教材共分五大部分，合计多少章？（只填数字）',
        answer: '25',
        accept: ['25', '二十五'],
        explain: '教材五大部分共 25 章：战略与产品、制造与服务流程、供应链流程、供需计划与控制、以及医疗与咨询两个专题。本站把它们重新组织成七个主题章，是为了让计算与决策的主线更清楚。'
      },
      {
        id: 'ch00-q6', ch: 'ch00', kp: 'ch00-6', tier: 2, type: 'multi', difficulty: 2, tags: ['concept'],
        stem: '下列哪些属于运营经理要做的决策？（多选）',
        options: [
          { text: '建多大的产能、何时扩张', correct: true },
          { text: '备多少库存、在哪里备', correct: true },
          { text: '用什么质量标准与检验方案', correct: true },
          { text: '请哪位明星做品牌代言', correct: false }
        ],
        explain: '产能、库存、质量、流程与供应链网络是运营决策的核心，它们直接决定成本、交付与质量。明星代言属于营销决策，虽然会影响需求，但不属于运营部门对转化过程的决策。'
      },
      {
        id: 'ch00-q7', ch: 'ch00', kp: 'ch00-7', tier: 1, type: 'mcq', difficulty: 1, tags: ['calc'],
        stem: '做运营计算题时，第一步最该做的是什么？',
        options: [
          { text: '写出公式并统一单位，再代入数字', correct: true },
          { text: '先猜一个答案，再倒推过程', correct: false },
          { text: '先看选项，用排除法选最像的', correct: false },
          { text: '先把结论背下来，考试时直接套', correct: false }
        ],
        explain: '运营题的数字通常带单位（件/小时、元/年、天），单位不统一是失分主因。先写公式能让你看清需要哪些量、哪些量题目没给、哪些量要自己假设；单位统一后，量级检查也能立刻发现结果是否离谱。'
      },

      /* ---------------- ch01 战略与生产力 ---------------- */
      {
        id: 'ch01-q1', ch: 'ch01', kp: 'ch01-4', tier: 1, type: 'mcq', difficulty: 2, tags: ['case'],
        stem: '某汽车零部件厂：客户下单的前提是通过体系审核、报价不高于同行、交付准时率 98%；最终花落谁家，取决于能否在 48 小时内给出工程变更方案。按订单赢家与订单资格的说法，正确的是？',
        options: [
          { text: '体系、价格与交付是订单资格，工程响应速度是订单赢家', correct: true },
          { text: '价格是订单赢家，其余都是资格', correct: false },
          { text: '四项全部是订单赢家', correct: false },
          { text: '四项全部是订单资格，没有赢家', correct: false }
        ],
        explain: '订单资格是「进了这个门槛才有资格被考虑」，通常包括合规体系、可接受的价格与基本交付；订单赢家是「在门槛之内让客户选你」的那一项。案例里前三条谁都能做到，工程响应速度才是差异点。'
      },
      {
        id: 'ch01-q2', ch: 'ch01', kp: 'ch01-5', tier: 1, type: 'fill', difficulty: 1, tags: ['calc'],
        stem: '某厂一年产出 8,000 件，投入 400 个工时，单要素生产力是多少件/工时？（只填数字）',
        answer: '20',
        accept: ['20', '20 件/工时'],
        explain: '单要素生产力 = 产出 ÷ 单一投入 = 8,000 ÷ 400 = 20 件/工时。它只衡量一种投入的效率，换一种投入（例如材料或能源）会得到完全不同的数值，所以报告生产力时必须说明用的是哪个口径。'
      },
      {
        id: 'ch01-q3', ch: 'ch01', kp: 'ch01-6', tier: 1, type: 'tf', difficulty: 1, tags: ['concept'],
        stem: '只要效率提高，效果一定同步提高。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '效率是「把事情做对」，效果是「做对的事情」。如果市场根本不需要这些产品，生产线跑得再快也只是更快地制造库存。效率与效果的关系要用价值判断：先确认方向，再谈速度。'
      },
      {
        id: 'ch01-q4', ch: 'ch01', kp: 'ch01-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '六竞争维度中的「柔性」指的是？',
        options: [
          { text: '快速调整产品品种与产量、响应需求变化的能力', correct: true },
          { text: '产品价格低于竞争对手', correct: false },
          { text: '设备折旧年限更长', correct: false },
          { text: '员工人数更多', correct: false }
        ],
        explain: '柔性包含品种柔性（换型快、能做多种产品）与数量柔性（产量能升能降）。它与成本、质量、交付速度、创新、服务并列构成竞争维度，且往往与低成本存在权衡：柔性要付出换型与产能冗余的代价。'
      },
      {
        id: 'ch01-q5', ch: 'ch01', kp: 'ch01-3', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '关于效率前沿（权衡曲线），下列说法正确的是？',
        options: [
          { text: '前沿上的点是当前技术下的最优组合，要把前沿向外推需要工艺或组织创新', correct: true },
          { text: '前沿上的点都存在浪费，应该全部舍弃', correct: false },
          { text: '前沿只由成本一个维度决定', correct: false },
          { text: '任何企业都能同时无限改善所有维度', correct: false }
        ],
        explain: '权衡曲线说明在给定技术下，想改善一个维度往往要牺牲另一个维度，曲线上的点已经是「没有白白浪费」的组合。要同时改善两个维度，只能靠创新把曲线整体外推，例如用柔性自动化同时降成本与提柔性。'
      },
      {
        id: 'ch01-q6', ch: 'ch01', kp: 'ch01-1', tier: 2, type: 'multi', difficulty: 2, tags: ['method'],
        stem: '运营战略要求「活动体系一致」，下列哪些属于一致性的表现？（多选）',
        options: [
          { text: '运营资源与目标市场的需求特征匹配', correct: true },
          { text: '各职能的决策相互支持，而不是互相拆台', correct: true },
          { text: '竞争优先级与流程类型、产能策略相匹配', correct: true },
          { text: '每个部门都追求本部门指标最优', correct: false }
        ],
        explain: '一致性是横向（研发、采购、生产、销售不互相拖后腿）与纵向（战略目标逐层落到流程与指标）两个方向的匹配。各部门指标各自最优，恰恰是整体次优的常见来源：采购压单价、生产放大批量、销售月底压货，三件事都「正确」却让公司库存爆仓。'
      },
      {
        id: 'ch01-q7', ch: 'ch01', kp: 'ch01-7', tier: 2, type: 'mcq', difficulty: 2, tags: ['risk'],
        stem: '评估供应链中断风险时，最常用的两个维度是？',
        options: [
          { text: '发生概率与影响程度', correct: true },
          { text: '供应商数量与注册资本', correct: false },
          { text: '汇率与利率', correct: false },
          { text: '员工人数与厂房面积', correct: false }
        ],
        explain: '风险矩阵用「概率 × 影响」定位优先级，再乘以暴露量得到期望损失，才能与防范成本比较。只谈「这个风险很严重」而不谈概率，就无法判断该投多少钱去防它。'
      },

      /* ---------------- ch02 产品设计、产能与学习曲线 ---------------- */
      {
        id: 'ch02-q1', ch: 'ch02', kp: 'ch02-3', tier: 1, type: 'mcq', difficulty: 2, tags: ['calc'],
        stem: '某车间设计产能 12,000 件、有效产能 10,200 件、实际产出 9,180 件，利用率与效率分别是？',
        options: [
          { text: '76.5% 与 90%', correct: true },
          { text: '90% 与 76.5%', correct: false },
          { text: '85% 与 90%', correct: false },
          { text: '76.5% 与 85%', correct: false }
        ],
        explain: '利用率 = 实际产出 ÷ 设计产能 = 9,180 ÷ 12,000 = 76.5%；效率 = 实际产出 ÷ 有效产能 = 9,180 ÷ 10,200 = 90%。两个指标一起看才有意义：效率高说明在现有排班下跑得不错，利用率低说明还有大量时间没被有效利用。'
      },
      {
        id: 'ch02-q2', ch: 'ch02', kp: 'ch02-6', tier: 1, type: 'fill', difficulty: 1, tags: ['calc'],
        stem: '学习率 80%，第 1 件耗时 100 小时，第 4 件约多少小时？（只填数字）',
        answer: '64',
        accept: ['64', '64 小时'],
        explain: '累计产量翻倍时单位时间乘以学习率：第 1 件 100 小时，第 2 件 80 小时，第 4 件 64 小时。注意「第 4 件」与「前 4 件平均」不同，后者是 100 × (0.8 + 0.8² + …) 的加权结果，不能混用。'
      },
      {
        id: 'ch02-q3', ch: 'ch02', kp: 'ch02-5', tier: 2, type: 'mcq', difficulty: 2, tags: ['calc'],
        stem: '某方案投入 300 万元，高需求概率 0.6、对应收益 500 万元；低需求概率 0.4、对应收益 300 万元。期望净收益是多少万元？',
        options: [
          { text: '120', correct: true },
          { text: '180', correct: false },
          { text: '300', correct: false },
          { text: '80', correct: false }
        ],
        explain: '期望收益 = 0.6 × 500 + 0.4 × 300 = 300 + 120 = 420 万元，减去投入 300 万元，期望净收益 120 万元。决策树从右往左算：先算每个分支的收益，再按概率加权，最后减去该分支的投资。'
      },
      {
        id: 'ch02-q4', ch: 'ch02', kp: 'ch02-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '面向制造与装配的设计（DFM/DFA）最直接的目标是？',
        options: [
          { text: '减少零件数量与装配难度，降低制造成本与出错机会', correct: true },
          { text: '让产品外观更漂亮', correct: false },
          { text: '提高产品售价', correct: false },
          { text: '增加功能数量，越多越好', correct: false }
        ],
        explain: 'DFM/DFA 在产品设计阶段就决定后续 70% 以上的成本：零件少、装配方向单一、不需要特殊工具，制造与装配就快且稳。设计阶段改一张图纸很便宜，量产后改工艺很贵，所以越早介入越值钱。'
      },
      {
        id: 'ch02-q5', ch: 'ch02', kp: 'ch02-7', tier: 2, type: 'tf', difficulty: 2, tags: ['concept'],
        stem: '学习曲线可以无限外推：只要累计产量足够大，单位成本会趋近于零。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '学习效应来自熟练度、工艺改进与组织学习，但它受设备能力、材料成本与管理上限约束，最终会趋于平坦。把学习曲线外推到成本趋零，会得出「永远降价也能赚钱」的错误结论，现实中常见于新品定价过于乐观的案例。'
      },
      {
        id: 'ch02-q6', ch: 'ch02', kp: 'ch02-4', tier: 1, type: 'multi', difficulty: 1, tags: ['concept'],
        stem: '产能扩张的三种典型策略包括？（多选）',
        options: [
          { text: '领先扩张：在需求到来之前建产能', correct: true },
          { text: '跟随扩张：需求确认后再扩', correct: true },
          { text: '滞后扩张：等产能不足已经影响交付才扩', correct: true },
          { text: '永久关闭全部产能以规避风险', correct: false }
        ],
        explain: '领先扩张赌需求、跟随扩张稳但可能丢单、滞后扩张最省资本但容易缺货。选择取决于需求不确定性、产能建设周期与缺货的代价；没有一种策略永远正确，教材要求用决策树把概率与收益一起算。'
      },
      {
        id: 'ch02-q7', ch: 'ch02', kp: 'ch02-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['method'],
        stem: '产品设计的五个阶段，正确顺序是？',
        options: [
          { text: '构思 → 可行性分析 → 产品设计 → 工艺设计 → 试产', correct: true },
          { text: '试产 → 构思 → 工艺设计 → 产品设计 → 可行性分析', correct: false },
          { text: '可行性分析 → 试产 → 构思 → 产品设计 → 工艺设计', correct: false },
          { text: '产品设计 → 构思 → 可行性分析 → 试产 → 工艺设计', correct: false }
        ],
        explain: '先有构思，再判断技术与经济是否可行，然后做产品设计（功能与结构），再做工艺设计（怎么做、用什么设备与工装），最后试产验证。并行工程会把后两步提前与产品设计交叉进行，但逻辑顺序不变。'
      },

      /* ---------------- ch03 流程分析 ---------------- */
      {
        id: 'ch03-q1', ch: 'ch03', kp: 'ch03-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['calc'],
        stem: '一条线六道工序的单件时间分别为 8、5、6、12、9、4 分钟，瓶颈工序与产线产能是？',
        options: [
          { text: '12 分钟的工序，产能 5 件/小时', correct: true },
          { text: '8 分钟的工序，产能 7.5 件/小时', correct: false },
          { text: '12 分钟的工序，产能 12 件/小时', correct: false },
          { text: '4 分钟的工序，产能 15 件/小时', correct: false }
        ],
        explain: '产线产出由最慢工序决定：瓶颈是 12 分钟，每小时 60 ÷ 12 = 5 件。把非瓶颈做到比瓶颈快，只是增加在制品等待，不会提高产出；除非同时给瓶颈增加并行工位或缩短其时间。'
      },
      {
        id: 'ch03-q2', ch: 'ch03', kp: 'ch03-3', tier: 1, type: 'fill', difficulty: 1, tags: ['calc'],
        stem: '某流程在制品 60 件，平均流程时间 4 小时，产出率是多少件/小时？（只填数字）',
        answer: '15',
        accept: ['15', '15 件/小时'],
        explain: '利特尔法则：在制品 = 产出率 × 流程时间，所以产出率 = 60 ÷ 4 = 15 件/小时。这个公式对整条流程或任一段都成立，前提是系统处于稳定状态、平均量取的是同一时间段。'
      },
      {
        id: 'ch03-q3', ch: 'ch03', kp: 'ch03-4', tier: 2, type: 'mcq', difficulty: 2, tags: ['queue'],
        stem: 'M/M/1 排队系统中，利用率从 0.8 升到 0.89，平均等待时间的变化最接近？',
        options: [
          { text: '从 24 分钟升到 53 分钟，涨幅远大于利用率的涨幅', correct: true },
          { text: '基本不变，因为只差 0.09', correct: false },
          { text: '从 24 分钟降到 20 分钟', correct: false },
          { text: '从 5 分钟升到 6 分钟', correct: false }
        ],
        explain: 'M/M/1 的平均排队长度 L<sub>q</sub> = ρ²/(1−ρ)，等待时间 W<sub>q</sub> = L<sub>q</sub>/λ。ρ = 0.8 时 L<sub>q</sub> = 3.2 人、W<sub>q</sub> ≈ 24 分钟；ρ = 0.89 时 L<sub>q</sub> ≈ 7.2 人、W<sub>q</sub> ≈ 53 分钟。等待时间对利用率是非线性的，越接近 1 越陡，这就是「忙到 90% 就开始排长队」的数学原因。'
      },
      {
        id: 'ch03-q4', ch: 'ch03', kp: 'ch03-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '品种多、批量小、按订单生产的车间，最适合的流程类型是？',
        options: [
          { text: '作业车间（job shop），设备按工艺类型成组布置', correct: true },
          { text: '连续流程（continuous flow），24 小时不停机', correct: false },
          { text: '大批量流水线，节拍固定', correct: false },
          { text: '项目型流程，每件产品都在现场完成', correct: false }
        ],
        explain: '流程类型要与产品—流程矩阵匹配：品种多、批量小对应作业车间；品种少、批量大对应流水线或连续流程。用流水线去做定制产品，换型与停机成本会吃掉全部效率优势。'
      },
      {
        id: 'ch03-q5', ch: 'ch03', kp: 'ch03-5', tier: 1, type: 'fill', difficulty: 1, tags: ['calc'],
        stem: '一条产线每天可用 480 分钟，计划产出 240 件，节拍是多少分钟/件？（只填数字）',
        answer: '2',
        accept: ['2', '2 分钟'],
        explain: '节拍 = 可用时间 ÷ 计划产出 = 480 ÷ 240 = 2 分钟/件。它决定了每个工位的作业元素如何组合：把各元素时间相加，尽量贴近节拍而不超过，再算需要的工位数与平衡率。'
      },
      {
        id: 'ch03-q6', ch: 'ch03', kp: 'ch03-6', tier: 2, type: 'multi', difficulty: 1, tags: ['service'],
        stem: '与制造流程相比，服务流程的特点包括？（多选）',
        options: [
          { text: '顾客参与生产过程，服务人员与顾客直接接触', correct: true },
          { text: '产出不能储存，需求波动难以用成品库存吸收', correct: true },
          { text: '质量难以在交付前全检，出问题时往往已经发生', correct: true },
          { text: '可以先大批量生产、再按订单发货', correct: false }
        ],
        explain: '服务的三个特征——顾客参与、不可储存、产出异质——使它的产能管理只能用预约、排队、弹性排班与需求引导；质量控制必须前移到过程与员工授权，而不是靠事后检验。把服务当成可库存的制造来规划，往往在旺季崩掉。'
      },
      {
        id: 'ch03-q7', ch: 'ch03', kp: 'ch03-7', tier: 2, type: 'mcq', difficulty: 2, tags: ['diagnose'],
        stem: '设备利用率 95%、订单前置期却持续变长，最可能的原因是？',
        options: [
          { text: '在制品与批量过大，排队时间主导了总前置期', correct: true },
          { text: '设备太旧，折旧太慢', correct: false },
          { text: '员工太少，应该再裁员', correct: false },
          { text: '需求太少，产能过剩', correct: false }
        ],
        explain: '高利用率意味着队列长，而前置期 = 加工时间 + 排队 + 搬运 + 等待。大量时间花在「等」上，说明在制品与批量过大，或者投放节奏没有与瓶颈匹配。先压批量、设瓶颈缓冲、限制在制品，往往比加设备更快见效。'
      },

      /* ---------------- ch04 质量 ---------------- */
      {
        id: 'ch04-q1', ch: 'ch04', kp: 'ch04-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '六西格玛水平对应的缺陷率约为多少？',
        options: [
          { text: '3.4 ppm（百万分之 3.4）', correct: true },
          { text: '233 ppm', correct: false },
          { text: '6,210 ppm', correct: false },
          { text: '66,807 ppm', correct: false }
        ],
        explain: '按 1.5σ 长期漂移计算，6σ 约 3.4 ppm，5σ 约 233 ppm，4σ 约 6,210 ppm，3σ 约 66,807 ppm。每提高一个 σ，缺陷率下降约一个数量级，这也是「质量免费」说法的数学基础：预防投入远小于失败成本。'
      },
      {
        id: 'ch04-q2', ch: 'ch04', kp: 'ch04-4', tier: 2, type: 'fill', difficulty: 2, tags: ['calc'],
        stem: '某轴径公差上限 10.5、下限 9.5，过程标准差 0.12，过程能力指数 Cp 是多少？（保留两位小数）',
        answer: '1.39',
        accept: ['1.39', '1.389', '1.4'],
        explain: 'Cp = (USL − LSL) ÷ 6σ = 1.0 ÷ (6 × 0.12) = 1.0 ÷ 0.72 ≈ 1.39。Cp 只看波动与公差宽度之比，不看均值是否居中；要判断均值偏离，还要算 Cpk。'
      },
      {
        id: 'ch04-q3', ch: 'ch04', kp: 'ch04-4', tier: 2, type: 'mcq', difficulty: 2, tags: ['calc'],
        stem: '同一过程的 Cpk 明显小于 Cp，说明什么？',
        options: [
          { text: '过程波动尚可，但均值偏离了规格中心', correct: true },
          { text: '过程波动过大，必须换设备', correct: false },
          { text: '数据量不足，无法判断', correct: false },
          { text: '量具一定失效了', correct: false }
        ],
        explain: 'Cp 衡量「潜在能力」，Cpk 衡量「实际能力」，两者之差来自均值偏移：Cpk = min(USL − μ, μ − LSL) ÷ 3σ。Cpk 明显小于 Cp 时，先调均值比换设备更划算；若两者都低，才说明波动本身太大。'
      },
      {
        id: 'ch04-q4', ch: 'ch04', kp: 'ch04-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '质量成本的「1-10-100 法则」说明什么？',
        options: [
          { text: '缺陷发现得越晚，处理成本越高：预防 1 元、过程拦截 10 元、流出后 100 元', correct: true },
          { text: '检验越早，成本越高', correct: false },
          { text: '返工永远比预防便宜', correct: false },
          { text: '客户投诉不影响成本', correct: false }
        ],
        explain: '在设计或来料阶段消除一个缺陷可能只花 1 元，到了装配线要 10 元，到了客户手里（退货、赔付、品牌损失）可能是 100 元。所以质量投入应前置到预防与设计，而不是靠终检把关。'
      },
      {
        id: 'ch04-q5', ch: 'ch04', kp: 'ch04-5', tier: 2, type: 'tf', difficulty: 2, tags: ['spc'],
        stem: '控制图上的点超出控制限，说明过程能力指数不足。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '超出控制限说明过程出现了特殊原因、处于失控状态，要先查原因并纠正；Cpk 反映的是过程在受控状态下的能力。控制图回答「稳不稳」，Cpk 回答「够不够」，两者不能互相替代。'
      },
      {
        id: 'ch04-q6', ch: 'ch04', kp: 'ch04-3', tier: 1, type: 'multi', difficulty: 1, tags: ['method'],
        stem: 'DMAIC 的五个阶段包括？（多选）',
        options: [
          { text: '定义（Define）', correct: true },
          { text: '测量（Measure）', correct: true },
          { text: '分析（Analyze）', correct: true },
          { text: '设计（Design）', correct: false }
        ],
        explain: 'DMAIC 是定义、测量、分析、改进、控制五个阶段，用于改善已有过程；「设计」属于 DMADV（定义、测量、分析、设计、验证），用于新产品或新过程的设计。两者都强调用数据说话，但起点不同。'
      },
      {
        id: 'ch04-q7', ch: 'ch04', kp: 'ch04-7', tier: 2, type: 'mcq', difficulty: 2, tags: ['calc'],
        stem: 'FMEA 中风险优先数 RPN = 严重度 S × 发生度 O × 探测度 D。某失效模式 S = 8、O = 6、D = 4，改善后 D 降到 1、O 降到 2，RPN 从多少降到多少？',
        options: [
          { text: '192 降到 16', correct: true },
          { text: '192 降到 96', correct: false },
          { text: '144 降到 48', correct: false },
          { text: '192 降到 24', correct: false }
        ],
        explain: '改善前 8 × 6 × 4 = 192；改善后 8 × 2 × 1 = 16。降 RPN 的三条路是降低发生度（改工艺）、提高探测度（加防错或检测）、降低严重度（改设计）。严重度通常最难改，所以先动 O 与 D 更现实。'
      },

      /* ---------------- ch05 库存管理 ---------------- */
      {
        id: 'ch05-q1', ch: 'ch05', kp: 'ch05-3', tier: 1, type: 'mcq', difficulty: 2, tags: ['calc'],
        stem: '年需求 12,000 件、每次订货成本 200 元、单位年持有成本 10 元，经济订货批量 EOQ 约为？',
        options: [
          { text: '693 件', correct: true },
          { text: '490 件', correct: false },
          { text: '1,200 件', correct: false },
          { text: '2,400 件', correct: false }
        ],
        explain: 'EOQ = √(2DS ÷ H) = √(2 × 12,000 × 200 ÷ 10) = √480,000 ≈ 693 件。它的含义是让年订货成本与年持有成本相等；在这个点附近成本曲线很平，取整到 700 件几乎不增加成本。'
      },
      {
        id: 'ch05-q2', ch: 'ch05', kp: 'ch05-5', tier: 1, type: 'fill', difficulty: 1, tags: ['calc'],
        stem: '日需求 48 件、提前期 5 天，不考虑安全库存时的再订货点是多少件？（只填数字）',
        answer: '240',
        accept: ['240', '240 件'],
        explain: '再订货点 ROP = 日需求 × 提前期 = 48 × 5 = 240 件。它的意思是：当库存降到 240 件时下单，货正好在提前期末到；若加了安全库存，再订货点还要加上那部分缓冲。'
      },
      {
        id: 'ch05-q3', ch: 'ch05', kp: 'ch05-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: 'ABC 分类中，A 类物料通常的特征是？',
        options: [
          { text: '品种数占 10%–20%，占用金额占 70%–80%，需要重点管控', correct: true },
          { text: '品种数占 70%，占用金额只占 10%', correct: false },
          { text: '品种数与金额都占一半', correct: false },
          { text: '金额占比最低，可以一年盘一次', correct: false }
        ],
        explain: 'ABC 按金额（用量 × 单价）排序：A 类少数品种占大部分金额，值得精确预测、频繁盘点、严密控制；C 类品种多、金额小，适合简化管理。把精力平均分给所有物料，是库存管理最常见的浪费。'
      },
      {
        id: 'ch05-q4', ch: 'ch05', kp: 'ch05-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '下列哪一项不属于库存持有成本？',
        options: [
          { text: '每次下单发生的采购手续费', correct: true },
          { text: '库存占用的资金成本', correct: false },
          { text: '仓储、保险与税费', correct: false },
          { text: '变质、过时与损耗', correct: false }
        ],
        explain: '持有成本（holding cost）包括资金占用、仓储、保险、税费与损耗；下单手续费属于订货成本（ordering cost）。EOQ 的权衡就是这两类成本：订得多省订货费但多付持有费，订得少则相反。'
      },
      {
        id: 'ch05-q5', ch: 'ch05', kp: 'ch05-4', tier: 2, type: 'multi', difficulty: 2, tags: ['decision'],
        stem: '评估供应商的数量折扣是否值得接受时，必须同时考虑哪些变化？（多选）',
        options: [
          { text: '采购单价下降带来的节省', correct: true },
          { text: '平均库存上升带来的持有成本', correct: true },
          { text: '订货次数减少带来的订货成本下降', correct: true },
          { text: '只比较单价，库存与订货成本可以忽略', correct: false }
        ],
        explain: '折扣决策要把「单价节省 + 订货成本节省」与「持有成本上升」放在一起算总成本，再比较不同折扣档位。只看到单价下降就放大批量，常常出现「采购部省了钱、公司多花了钱」的结果。'
      },
      {
        id: 'ch05-q6', ch: 'ch05', kp: 'ch05-6', tier: 2, type: 'mcq', difficulty: 2, tags: ['calc'],
        stem: '服务水平从 95% 提高到 99%，在需求波动不变的前提下，安全库存大约增加多少？',
        options: [
          { text: '约 41%（z 从 1.645 升到 2.326）', correct: true },
          { text: '约 4%', correct: false },
          { text: '约 100%', correct: false },
          { text: '不变，服务水平只影响缺货次数', correct: false }
        ],
        explain: '安全库存 = z × σ<sub>dLT</sub>，95% 对应 z ≈ 1.645，99% 对应 z ≈ 2.326，增幅 (2.326 − 1.645) ÷ 1.645 ≈ 41%。服务水平的提升是非线性的：最后几个百分点最贵，所以要按缺货的真实代价来定目标。'
      },
      {
        id: 'ch05-q7', ch: 'ch05', kp: 'ch05-7', tier: 3, type: 'predict', difficulty: 3, tags: ['calc', 'code'],
        stem: '下面这段脚本按 Q = 600、700、800 计算年总成本（订货成本 + 持有成本 + 采购成本，D = 12,000、S = 200、H = 10、单价 50 元）。按真实输出逐行写出三行结果。',
        codeTitle: 'EOQ 附近的总成本（JavaScript）',
        code: "var D = 12000, S = 200, H = 10;\n[600, 700, 800].forEach(function (Q) {\n  var c = D / Q * S + Q / 2 * H + D * 50;\n  console.log(Math.round(c));\n});",
        answer: '607000 606929 607000',
        accept: ['607000 606929 607000', '607000\n606929\n607000'],
        explain: '三段分别是：Q = 600 时 4,000 + 3,000 + 600,000 = 607,000；Q = 700 时 3,428.6 + 3,500 + 600,000 ≈ 606,929；Q = 800 时 3,000 + 4,000 + 600,000 = 607,000。EOQ ≈ 693 件附近的成本只差 71 元，这就是「EOQ 附近成本曲线很平」的量化证据，也是实践中不必把订货量算到小数点后一位的原因。'
      },

      /* ---------------- ch06 预测与产销计划 ---------------- */
      {
        id: 'ch06-q1', ch: 'ch06', kp: 'ch06-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['calc'],
        stem: '最近三个月需求为 120、110、130，用三期简单移动平均预测下月，结果是多少？',
        options: [
          { text: '120', correct: true },
          { text: '110', correct: false },
          { text: '130', correct: false },
          { text: '360', correct: false }
        ],
        explain: '移动平均 = (120 + 110 + 130) ÷ 3 = 120。期数越多曲线越平滑、反应越慢；期数越少越灵敏、越容易被噪声带着走。没有「最优期数」，要看需求中趋势与噪声的比例。'
      },
      {
        id: 'ch06-q2', ch: 'ch06', kp: 'ch06-2', tier: 1, type: 'fill', difficulty: 1, tags: ['calc'],
        stem: '上期预测 100、实际需求 110，平滑系数 α = 0.3，指数平滑得到的下一期预测是多少？（只填数字）',
        answer: '103',
        accept: ['103', '103.0'],
        explain: 'F<sub>t+1</sub> = α × A<sub>t</sub> + (1 − α) × F<sub>t</sub> = 0.3 × 110 + 0.7 × 100 = 33 + 70 = 103。α 越大越相信最新一期，反应快但抖动大；α 越小越平滑，但对真实转折反应迟钝。'
      },
      {
        id: 'ch06-q3', ch: 'ch06', kp: 'ch06-3', tier: 2, type: 'mcq', difficulty: 2, tags: ['diagnose'],
        stem: '某产品的预测跟踪信号连续 5 期都在 4 以上，最合理的解释是？',
        options: [
          { text: '预测存在系统性偏差（持续高估或低估），需要重估模型或参数', correct: true },
          { text: '需求完全随机，跟踪信号高是正常现象', correct: false },
          { text: '模型非常好，可以放心使用', correct: false },
          { text: '只要提高服务水平就能解决', correct: false }
        ],
        explain: '跟踪信号是累计预测误差与平均绝对偏差之比，正常应在 ±4 以内波动。连续超出说明误差方向一致，即模型系统性高估或低估，常见原因是趋势、季节或促销没有进入模型。此时继续用原参数，误差会一直累积。'
      },
      {
        id: 'ch06-q4', ch: 'ch06', kp: 'ch06-4', tier: 2, type: 'mcq', difficulty: 2, tags: ['decision'],
        stem: '某产品季度需求为 1,000、1,600、1,200、1,600，平准策略年总成本 3,500 元、追逐策略 28,000 元。按这组参数应选？',
        options: [
          { text: '平准策略，因为它的总成本明显更低', correct: true },
          { text: '追逐策略，因为库存一定更少', correct: false },
          { text: '两者成本相同，随便选', correct: false },
          { text: '无法比较，因为需求有波动', correct: false }
        ],
        explain: '综合计划的比较看总成本，不看单一指标。这里追逐策略的加班、闲置与招聘解雇成本远高于平准的库存持有成本，所以平准更省。若需求波动更大或持有成本更高，结论可能反转——方法是算，不是背结论。'
      },
      {
        id: 'ch06-q5', ch: 'ch06', kp: 'ch06-5', tier: 2, type: 'multi', difficulty: 2, tags: ['method'],
        stem: '主生产计划（MPS）必须满足哪些约束？（多选）',
        options: [
          { text: '总量与 S&OP 达成一致，不自行加码', correct: true },
          { text: '不超过关键产能（瓶颈）约束', correct: true },
          { text: '能计算出可承诺量（ATP），支持接单承诺', correct: true },
          { text: '可以任意超过瓶颈产能，只要销售能卖出去', correct: false }
        ],
        explain: 'MPS 是 S&OP 与车间之间的桥：对上要守住总量，对下要落在关键产能之内，对销售要给出 ATP。超过瓶颈产能的 MPS 只是把库存与延期交货写进了计划，执行时一定兑现不了。'
      },
      {
        id: 'ch06-q6', ch: 'ch06', kp: 'ch06-6', tier: 1, type: 'tf', difficulty: 1, tags: ['concept'],
        stem: 'MRP 的提前期倒推是：计划订单下达时间 = 需求时间 − 提前期。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: 'MRP 从最终产品的需求日期出发，按 BOM 逐层展开，每一层都用「需求时间 − 提前期」得到下单时间。所以提前期数据不准，整个展开就会错位；这也是 MRP 实施失败最常见的数据原因之一。'
      },
      {
        id: 'ch06-q7', ch: 'ch06', kp: 'ch06-7', tier: 1, type: 'mcq', difficulty: 1, tags: ['diagnose'],
        stem: '企业实施 MRP 失败，最常见的原因是？',
        options: [
          { text: 'BOM、库存记录与提前期数据不准，导致展开结果不可信', correct: true },
          { text: '软件界面不够好看', correct: false },
          { text: '员工不会使用键盘', correct: false },
          { text: '没有采用云计算部署', correct: false }
        ],
        explain: 'MRP 是「垃圾进、垃圾出」的典型系统：BOM 错一层、库存记录差几十件、提前期凭感觉填，算出来的下单时间与数量就全错，计划员很快就会放弃系统、回到 Excel。所以实施 MRP 的第一步是数据治理，而不是选软件。'
      },

      /* ---------------- ch07 精益与供应链设计 ---------------- */
      {
        id: 'ch07-q1', ch: 'ch07', kp: 'ch07-2', tier: 2, type: 'mcq', difficulty: 2, tags: ['calc'],
        stem: '日需求 480 件、补货周期 0.25 日、安全系数 0.2、每容器装 20 件，按看板公式需要多少张看板？',
        options: [
          { text: '8 张', correct: true },
          { text: '6 张', correct: false },
          { text: '10 张', correct: false },
          { text: '12 张', correct: false }
        ],
        explain: 'N = D × T × (1 + X) ÷ C = 480 × 0.25 × 1.2 ÷ 20 = 7.2，向上取整为 8 张。看板张数就是两工序之间允许的在制品上限：8 × 20 = 160 件。想降低这个上限，可以缩短补货周期、降低安全系数或减小容器容量。'
      },
      {
        id: 'ch07-q2', ch: 'ch07', kp: 'ch07-2', tier: 1, type: 'fill', difficulty: 1, tags: ['calc'],
        stem: '某线每天可用 420 分钟、需求 480 件，节拍是多少秒/件？（只填数字，可保留一位小数）',
        answer: '52.5',
        accept: ['52.5', '52.5 秒'],
        explain: '节拍 = 420 × 60 ÷ 480 = 25,200 ÷ 480 = 52.5 秒/件。节拍是需求给定的节奏，不是设备能力的上限；工位实际时间超过节拍，就必须拆分工位或把动作转移出去。'
      },
      {
        id: 'ch07-q3', ch: 'ch07', kp: 'ch07-3', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '抑制牛鞭效应最直接的结构性做法是？',
        options: [
          { text: '让上游共享下游的终端销售数据，并按下游实际消耗补货', correct: true },
          { text: '要求每一级都换成更复杂的预测算法', correct: false },
          { text: '把所有环节的安全库存翻倍', correct: false },
          { text: '增加中间商层级，让信息更充分', correct: false }
        ],
        explain: '牛鞭效应的根因是每一级都用自己的订单历史做预测，把下游的批量与博弈噪声当成需求。共享 POS 数据、按实际消耗补货（VMI 或连续补货），等于让同一份需求只被解读一次，波动就不会被逐级放大。'
      },
      {
        id: 'ch07-q4', ch: 'ch07', kp: 'ch07-4', tier: 2, type: 'mcq', difficulty: 2, tags: ['calc'],
        stem: 'A 供应商报价 100 元且含运费关税；B 报价 88 元，另需运费 6 元、关税 5 元、质量返工 7 元、库存占用 1.8 元、差旅验货 1.5 元。按总拥有成本（TCO）判断，正确的是？',
        options: [
          { text: 'B 约 109.3 元，比 A 的 100.5 元更贵', correct: true },
          { text: 'B 88 元，比 A 便宜 12 元', correct: false },
          { text: '两者都是 100 元，基本相同', correct: false },
          { text: 'B 约 94 元，比 A 便宜', correct: false }
        ],
        explain: 'B 的 TCO = 88 + 6 + 5 + 7 + 1.8 + 1.5 = 109.3 元；A 的 TCO = 100 + 0.5 = 100.5 元。只比报价会得出「B 便宜 12%」的结论，算完 TCO 才发现 B 贵约 8.8%。差异主要来自质量返工（7 元）与物流关税（11 元）。'
      },
      {
        id: 'ch07-q5', ch: 'ch07', kp: 'ch07-7', tier: 1, type: 'multi', difficulty: 1, tags: ['risk'],
        stem: '提高供应链韧性的常见手段包括？（多选）',
        options: [
          { text: '多源采购与备份产能', correct: true },
          { text: '为关键物料准备战略库存', correct: true },
          { text: '建立供应链可视化与早期预警', correct: true },
          { text: '把所有库存降到零以减少资金占用', correct: false }
        ],
        explain: '韧性的四种常用手段是多源、冗余产能、战略库存、可视性与可切换的物流路径。它们的共同点是用一定成本换取中断时的恢复能力；把库存清零恰好相反，会让任何小中断都直接变成停线。'
      },
      {
        id: 'ch07-q6', ch: 'ch07', kp: 'ch07-6', tier: 1, type: 'tf', difficulty: 1, tags: ['toc'],
        stem: '按约束理论，非瓶颈工序提高产出不会提高系统产出。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '系统产出等于瓶颈产出，非瓶颈多做的部分只会变成在制品库存与更长的前置期。要注意前提：非瓶颈提高产出不会立即提高系统产出；但如果改善让某个非瓶颈变慢、成为新瓶颈，或者原瓶颈被打破，结论就要重新评估，这也是五步法最后一步「回头」的意义。'
      },
      {
        id: 'ch07-q7', ch: 'ch07', kp: 'ch07-7', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '延迟差异化能降低安全库存，主要原因是？',
        options: [
          { text: '汇总需求的标准差小于各版本分别备货所需安全库存之和', correct: true },
          { text: '通用件的采购单价一定更低', correct: false },
          { text: '客户愿意为定制等待更久', correct: false },
          { text: '运输距离变短，在途库存下降', correct: false }
        ],
        explain: '6 个版本各备安全库存时，总缓冲是 6 × zσ；延迟后按汇总需求备货，标准差约为 σ√6，安全库存只按 z × σ√6 计。以 σ = 200、z = 1.645 为例，从 1,974 台降到 806 台，节省 1,168 台。代价是最后一道差异化工序必须能小批量快换型。'
      }
    ]
  };
  CSC._quizPack = PACK;
  CSC.registerQuizPack(PACK);
})();
