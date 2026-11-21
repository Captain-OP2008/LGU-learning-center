/* =====================================================================
 * exam.js · 模拟卷 A（ECO3011 中级微观经济学）
 * 结构：CSC.registerExam({ id, title, style, subtitle, date, minutes,
 *        totalScore, summary, instructions, questions:[{ no, points, type,
 *        intro, parts:[{ label, points, kind, prompt, options, explain }] }] })
 * kind ∈ choice / tf / output / keywords / fill；no 从 1 连续，题分合计 100。
 * ===================================================================== */
CSC.registerExam({
  id: 'ECO3011-A',
  title: '模拟卷 A',
  style: 'FINAL',
  subtitle: '中级微观经济学 · 全课综合',
  date: '',
  minutes: 100,
  totalScore: 100,
  summary: '本卷覆盖八章主干：预算与偏好、消费者选择与需求、不确定性与跨期、技术与成本、完全竞争、垄断与寡头、一般均衡与市场失灵。题型包括选择、判断、填空、计算与简答关键词，建议按分值分配时间，先做会做的题。',
  instructions: [
    '闭卷；可使用不含通信功能的计算器。',
    '选择题与判断题只需给出选项；填空题写数值或最简表达式。',
    '计算题必须写出关键步骤：一阶条件、均衡方程、代入求解，只写答案最多得一半分。',
    '简答题按关键词给分，请用「条件—机制—结论」三句话组织，不必展开成段落。',
    '全卷满分 100 分，建议时间 100 分钟：客观题 40 分钟内完成，剩余时间留给计算与简答。'
  ],
  questions: [
    {
      no: 1,
      points: 8,
      type: '概念辨析',
      intro: '以下四题考查第一章的基本语言。请选出一个最准确的选项。',
      parts: [
        {
          label: '1-1',
          points: 2,
          kind: 'choice',
          prompt: '预算线 <code>p1x1 + p2x2 = m</code> 的斜率（横轴为 <code>x1</code>）表示什么？',
          options: [
            { text: '多买一单位商品 1 必须放弃的商品 2 的数量，即 <code>p1/p2</code>', correct: true },
            { text: '消费者的收入水平', correct: false },
            { text: '两种商品的总效用之比', correct: false },
            { text: '商品 1 的需求价格弹性', correct: false }
          ],
          explain: '改写为 <code>x2 = m/p2 − (p1/p2)x1</code> 即见斜率为 <code>−p1/p2</code>，其绝对值是用商品 2 计价的机会成本。它与效用无关，只由价格决定。'
        },
        {
          label: '1-2',
          points: 2,
          kind: 'choice',
          prompt: '无差异曲线凸向原点，等价于下列哪一条？',
          options: [
            { text: '边际替代率随 <code>x1</code> 增加而递减', correct: true },
            { text: '边际效用递增', correct: false },
            { text: '两种商品完全替代', correct: false },
            { text: '消费者收入递减', correct: false }
          ],
          explain: '凸性即「平均束优于端点束」，几何上表现为 MRS 沿曲线递减：商品 1 越多，消费者越不愿再为它放弃商品 2。它来自偏好的凸性假设，与收入无关。'
        },
        {
          label: '1-3',
          points: 2,
          kind: 'choice',
          prompt: '若 <code>u(x1,x2) = x1x2</code>，下列哪个效用函数代表完全相同的偏好？',
          options: [
            { text: '<code>v = 3x1x2 + 10</code>', correct: true },
            { text: '<code>v = x1 + x2</code>', correct: false },
            { text: '<code>v = x1<sup>2</sup>x2</code>', correct: false },
            { text: '<code>v = −x1x2</code>', correct: false }
          ],
          explain: '只有严格递增变换保持偏好顺序。<code>3u+10</code> 是正仿射变换，等价；<code>x1+x2</code> 把完全互补变成了完全替代；<code>x1<sup>2</sup>x2</code> 改变了两种商品的相对权重；乘负号翻转顺序。'
        },
        {
          label: '1-4',
          points: 2,
          kind: 'choice',
          prompt: '内点最优解处，下列哪个等式成立？',
          options: [
            { text: '<code>MRS = p1/p2</code>', correct: true },
            { text: '<code>MRS = p2/p1</code>', correct: false },
            { text: '<code>MU1 = MU2</code>', correct: false },
            { text: '<code>p1x1 = p2x2</code>', correct: false }
          ],
          explain: '无差异曲线与预算线相切，斜率相等即 <code>MU1/MU2 = p1/p2</code>，等价于「每一元钱在两种商品上的边际效用相等」。<code>p1x1 = p2x2</code> 只在特定效用函数下偶然成立。'
        }
      ]
    },
    {
      no: 2,
      points: 8,
      type: '判断与填空',
      intro: '考查预算集的移动与截距计算。',
      parts: [
        {
          label: '2-1',
          points: 2,
          kind: 'tf',
          prompt: '价格不变、收入翻倍，预算线平行外移，斜率不变。',
          options: [
            { text: '正确', correct: true },
            { text: '错误', correct: false }
          ],
          explain: '收入只出现在截距 <code>m/p1</code>、<code>m/p2</code> 中，不影响斜率 <code>−p1/p2</code>，所以是平行外移。这正是「名义收入上升而相对价格不变」的几何含义。'
        },
        {
          label: '2-2',
          points: 2,
          kind: 'tf',
          prompt: '两种价格与收入同比例上升，消费者的预算集不变。',
          options: [
            { text: '正确', correct: true },
            { text: '错误', correct: false }
          ],
          explain: '不等式两边同除以该比例，约束完全不变，所以预算集不变，最优消费束也不变。这是需求函数零次齐次性的来源，也叫没有货币幻觉。'
        },
        {
          label: '2-3',
          points: 4,
          kind: 'fill',
          prompt: '设 <code>p1 = 4</code>、<code>p2 = 2</code>、<code>m = 40</code>，预算线的横截距（<code>x1</code> 轴）等于多少？',
          explain: '令 <code>x2 = 0</code> 得 <code>x1 = m/p1 = 40/4 = 10</code>。纵截距则是 <code>m/p2 = 20</code>；两点连线即为预算线。'
        }
      ]
    },
    {
      no: 3,
      points: 10,
      type: '计算：Cobb-Douglas 需求',
      intro: '某消费者效用 <code>u = x1<sup>0.5</sup>x2<sup>0.5</sup></code>，收入 <code>m = 120</code>，价格 <code>p1 = 2</code>、<code>p2 = 3</code>。',
      parts: [
        {
          label: '3-1',
          points: 3,
          kind: 'fill',
          prompt: '最优 <code>x1</code> 等于多少？',
          explain: 'Cobb-Douglas 效用下支出份额等于指数：<code>p1x1 = 0.5m</code>，故 <code>x1 = 0.5×120/2 = 30</code>。也可由 <code>MRS = x2/x1 = p1/p2</code> 联立预算约束得到。'
        },
        {
          label: '3-2',
          points: 3,
          kind: 'fill',
          prompt: '最优 <code>x2</code> 等于多少？',
          explain: '对称地 <code>p2x2 = 0.5m</code>，<code>x2 = 60/3 = 20</code>。检验：<code>2×30 + 3×20 = 120</code>，预算恰好用尽。'
        },
        {
          label: '3-3',
          points: 4,
          kind: 'output',
          prompt: '求最优效用水平（可保留根号）。',
          explain: '<code>u = √(30×20) = √600 ≈ 24.49</code>。注意效用数值本身没有意义，只有比较才有意义：任何严格递增变换都会得到同一消费束，但数值会变。'
        }
      ]
    },
    {
      no: 4,
      points: 8,
      type: '概念辨析：需求与弹性',
      intro: '以下四题考查第二章的需求理论与斯勒茨基分解。',
      parts: [
        {
          label: '4-1',
          points: 2,
          kind: 'choice',
          prompt: '价格上升时，替代效应的方向是？',
          options: [
            { text: '恒为负，需求量下降', correct: true },
            { text: '恒为正，需求量上升', correct: false },
            { text: '取决于商品是否为劣等品', correct: false },
            { text: '等于收入效应', correct: false }
          ],
          explain: '替代效应沿原无差异曲线移动：该商品相对变贵，消费者必然用其他商品替代它，所以恒为负。符号可能为正的只有收入效应（劣等品），两者相加才决定总效应。'
        },
        {
          label: '4-2',
          points: 2,
          kind: 'choice',
          prompt: '吉芬商品出现的条件是？',
          options: [
            { text: '劣等品，且收入效应强于替代效应', correct: true },
            { text: '正常品，且替代效应强于收入效应', correct: false },
            { text: '任何价格上升的商品', correct: false },
            { text: '完全互补品', correct: false }
          ],
          explain: '吉芬商品需求量与价格同向变动，需要收入效应为正（劣等品）且大到压过负的替代效应，使总效应为正。它极其罕见，因为收入效应通常远小于替代效应。'
        },
        {
          label: '4-3',
          points: 2,
          kind: 'choice',
          prompt: '需求函数 <code>x1(p1,p2,m)</code> 是零次齐次的，这意味着？',
          options: [
            { text: '三者同比例变化时需求量不变', correct: true },
            { text: '价格上升时需求量一定下降', correct: false },
            { text: '收入上升时需求量一定上升', correct: false },
            { text: '两种商品互为替代品', correct: false }
          ],
          explain: '零次齐次即 <code>x1(tp1,tp2,tm) = x1(p1,p2,m)</code>：只有相对价格与实际收入重要。它不保证需求曲线向下倾斜（吉芬商品就是反例），也不涉及交叉价格关系。'
        },
        {
          label: '4-4',
          points: 2,
          kind: 'choice',
          prompt: '完全互补品 <code>u = min{x1, 2x2}</code> 的最优消费满足？',
          options: [
            { text: '<code>x1 = 2x2</code>，即折点处', correct: true },
            { text: '<code>x1 = x2</code>', correct: false },
            { text: '<code>MRS = p1/p2</code>', correct: false },
            { text: '只消费商品 1', correct: false }
          ],
          explain: '完全互补品的无差异曲线是 L 形，最优解在折点，不存在可定义的 MRS 与相切条件。折点条件来自「多余的某一商品不带来效用」：令 <code>x1 = 2x2</code> 再代入预算约束。'
        }
      ]
    },
    {
      no: 5,
      points: 10,
      type: '不确定性与保险',
      intro: '某人的效用函数为 <code>u(w) = √w</code>，初始财富 100，面临损失 100 与损失 0 各一半概率的彩票。',
      parts: [
        {
          label: '5-1',
          points: 2,
          kind: 'tf',
          prompt: '该消费者是风险厌恶的，确定性等价小于期望值。',
          options: [
            { text: '正确', correct: true },
            { text: '错误', correct: false }
          ],
          explain: '<code>√w</code> 是凹函数，<code>u(EV) &gt; E[u]</code>，所以确定性等价 <code>CE &lt; EV</code>，风险溢价为正。凹性、风险厌恶、CE 小于 EV 三者等价。'
        },
        {
          label: '5-2',
          points: 2,
          kind: 'tf',
          prompt: '把效用函数改为 <code>v = 3√w + 5</code>，消费者的选择与风险溢价都不变。',
          options: [
            { text: '正确', correct: true },
            { text: '错误', correct: false }
          ],
          explain: '正仿射变换保持期望效用的排序：<code>E[3u+5] = 3E[u]+5</code>，比较结果不变，CE 与 RP 也不变。这正是期望效用只依赖序数偏好的含义。'
        },
        {
          label: '5-3',
          points: 3,
          kind: 'fill',
          prompt: '该彩票的确定性等价 <code>CE</code> 等于多少？',
          explain: '<code>E[u] = 0.5√100 + 0.5√0 = 5</code>，令 <code>√CE = 5</code> 得 <code>CE = 25</code>。也就是说，这个人与「确定拿到 25」无差异。'
        },
        {
          label: '5-4',
          points: 3,
          kind: 'fill',
          prompt: '风险溢价 <code>RP</code> 等于多少？（期望值 50）',
          explain: '<code>EV = 0.5×100 + 0.5×0 = 50</code>，<code>RP = EV − CE = 50 − 25 = 25</code>。它表示愿意为消除风险支付的上限；保费低于 25 时他会选择全额投保。'
        }
      ]
    },
    {
      no: 6,
      points: 10,
      type: '计算：成本曲线',
      intro: '某厂商短期总成本 <code>TC = q<sup>2</sup> + 16</code>（固定成本 16）。',
      parts: [
        {
          label: '6-1',
          points: 3,
          kind: 'fill',
          prompt: '边际成本 <code>MC</code> 的表达式是什么？',
          explain: '对 <code>TC</code> 求导：<code>MC = 2q</code>。固定成本导数为零，所以 <code>MC</code> 与固定成本无关，这也是短期决策只看可变成本的原因。'
        },
        {
          label: '6-2',
          points: 3,
          kind: 'fill',
          prompt: '平均成本 <code>AC</code> 最低时的产量是多少？',
          explain: '<code>AC = q + 16/q</code>，求导 <code>1 − 16/q<sup>2</sup> = 0</code> 得 <code>q = 4</code>（取正）。此时 <code>AC = 8</code>，且 <code>MC = 8 = AC</code>，符合「MC 穿过 AC 最低点」。'
        },
        {
          label: '6-3',
          points: 4,
          kind: 'output',
          prompt: '价格低于多少时，厂商在长期会退出该行业？',
          explain: '长期退出临界点是 <code>min AC = 8</code>。价格低于 8 时无论如何产量都亏损，退出优于继续生产；注意短期停产临界点是 <code>min AVC</code>，本题 <code>AVC = q</code> 最低趋近 0，与长期结论不同。'
        }
      ]
    },
    {
      no: 7,
      points: 8,
      type: '概念辨析：竞争与政策',
      intro: '以下四题考查第五章的均衡与福利分析。',
      parts: [
        {
          label: '7-1',
          points: 2,
          kind: 'choice',
          prompt: '对某商品征从量税，税负主要由谁承担？',
          options: [
            { text: '供给与需求中弹性较小的一方', correct: true },
            { text: '法律上负责申报缴纳的一方', correct: false },
            { text: '永远是消费者', correct: false },
            { text: '永远是生产者', correct: false }
          ],
          explain: '归宿由相对弹性决定：弹性小的一方替代选项少、难以退出交易，税负更容易落在它身上。法定纳税人只影响征管流程，不改变经济归宿。'
        },
        {
          label: '7-2',
          points: 2,
          kind: 'choice',
          prompt: '最高限价低于均衡价格，最可能出现的后果是？',
          options: [
            { text: '短缺、排队与黑市', correct: true },
            { text: '过剩与滞销', correct: false },
            { text: '市场自动出清', correct: false },
            { text: '需求量下降、供给量上升', correct: false }
          ],
          explain: '限价压低价格，需求量增加、供给量减少，出现短缺；短缺催生配给、排队、黑市与质量下降。过剩是高于均衡价的最低限价的后果。'
        },
        {
          label: '7-3',
          points: 2,
          kind: 'choice',
          prompt: '总剩余（消费者剩余加生产者剩余）在何处最大？',
          options: [
            { text: '竞争均衡的数量上', correct: true },
            { text: '垄断产量上', correct: false },
            { text: '产量为零时', correct: false },
            { text: '价格最高时', correct: false }
          ],
          explain: '只要支付意愿高于边际成本，多交易一单位就增加剩余；均衡处两者相等。偏离均衡的数量（垄断、配额、税收）都会产生无谓损失。'
        },
        {
          label: '7-4',
          points: 2,
          kind: 'choice',
          prompt: '需求与供给同时右移，可以确定的是？',
          options: [
            { text: '均衡数量增加，价格方向不确定', correct: true },
            { text: '均衡价格上升，数量方向不确定', correct: false },
            { text: '价格与数量都上升', correct: false },
            { text: '价格与数量都下降', correct: false }
          ],
          explain: '两个移动对数量的作用同向（都增加），对价格的作用相反（需求推高、供给压低），所以数量确定、价格取决于两者幅度。双移动题只能确定一个变量。'
        }
      ]
    },
    {
      no: 8,
      points: 10,
      type: '计算：垄断',
      intro: '某垄断厂商面临需求 <code>p = 100 − 2Q</code>，边际成本恒为 20，无固定成本。',
      parts: [
        {
          label: '8-1',
          points: 5,
          kind: 'output',
          prompt: '求垄断产量与价格。',
          explain: '总收益 <code>TR = 100Q − 2Q<sup>2</sup></code>，<code>MR = 100 − 4Q</code>。令 <code>MR = MC</code>：<code>100 − 4Q = 20</code>，得 <code>Q = 20</code>，<code>p = 100 − 40 = 60</code>。'
        },
        {
          label: '8-2',
          points: 5,
          kind: 'output',
          prompt: '求垄断利润，并说明它与完全竞争相比的无谓损失来源。',
          explain: '利润 <code>(p − MC)Q = (60 − 20)×20 = 800</code>。无谓损失来自产量从竞争水平 40 压到 20：那些支付意愿在 20 到 60 之间的交易没有发生，损失为三角形面积 <code>0.5×(60−20)×(40−20) = 400</code>。'
        }
      ]
    },
    {
      no: 9,
      points: 8,
      type: '寡头',
      intro: '市场需求 <code>p = 100 − Q</code>，两家厂商边际成本均为 10。',
      parts: [
        {
          label: '9-1',
          points: 3,
          kind: 'choice',
          prompt: '古诺均衡中每家厂商的产量是多少？',
          options: [
            { text: '30', correct: true },
            { text: '20', correct: false },
            { text: '45', correct: false },
            { text: '60', correct: false }
          ],
          explain: '对称古诺解 <code>q = (a−c)/(3b) = (100−10)/3 = 30</code>，总产量 60，价格 40。若记竞争产量 <code>D = 90</code>，古诺总产量是 <code>2D/3</code>。'
        },
        {
          label: '9-2',
          points: 3,
          kind: 'choice',
          prompt: '若厂商 1 先行动（斯塔克尔伯格），其产量是多少？',
          options: [
            { text: '45', correct: true },
            { text: '30', correct: false },
            { text: '60', correct: false },
            { text: '22.5', correct: false }
          ],
          explain: '领导者把跟随者的反应函数 <code>q2 = (90 − q1)/2</code> 代入自身利润，得 <code>q1 = (a−c)/(2b) = 45</code>，跟随者 22.5。先动优势来自「把对手的反应内生化」。'
        },
        {
          label: '9-3',
          points: 2,
          kind: 'tf',
          prompt: '同质产品、相同常数边际成本的伯特兰竞争，均衡价格等于边际成本。',
          options: [
            { text: '正确', correct: true },
            { text: '错误', correct: false }
          ],
          explain: '任何高于 <code>c</code> 的价格都会诱使一方降价抢占全市场，所以只有 <code>p = c</code> 无人偏离。这就是伯特兰悖论：两家厂商即可实现完全竞争结果。'
        }
      ]
    },
    {
      no: 10,
      points: 8,
      type: '一般均衡与福利',
      intro: '两消费者、两商品的纯交换经济。',
      parts: [
        {
          label: '10-1',
          points: 4,
          kind: 'fill',
          prompt: '交换达到帕累托有效时，两人的边际替代率满足什么关系？',
          explain: '<code>MRS<sup>A</sup> = MRS<sup>B</sup></code>。若不等，就存在双方都接受的交换比率，可继续互惠交易；相等时交易空间耗尽，配置落在契约曲线上。'
        },
        {
          label: '10-2',
          points: 4,
          kind: 'fill',
          prompt: '公共品最优供给的萨缪尔森条件写成什么？',
          explain: '<code>ΣMBi = MC</code>，即所有人边际支付意愿之和等于边际成本。公共品非竞争，所有人消费同一数量，所以是垂直加总；私人物品才水平加总。'
        }
      ]
    },
    {
      no: 11,
      points: 6,
      type: '简答：外部性治理',
      intro: '一家工厂排污影响下游居民。请用关键词回答。',
      parts: [
        {
          label: '11-1',
          points: 3,
          kind: 'keywords',
          prompt: '说明庇古税的作用机制（写出「条件—机制—结论」）。',
          explain: '关键词：私人边际成本低于社会边际成本、产量过高、按边际外部成本征税、使私人成本等于社会成本、产量回到有效水平。税金应等于 <code>MEC</code>，而不是任意罚款。'
        },
        {
          label: '11-2',
          points: 3,
          kind: 'keywords',
          prompt: '科斯定理成立需要哪些条件？它与庇古税有何不同？',
          explain: '关键词：产权清晰界定、交易成本足够低、自愿谈判、结果与初始产权分配无关（效率层面）。不同点：庇古税靠政府定价，科斯靠市场谈判；交易成本高时科斯方案失效。'
        }
      ]
    },
    {
      no: 12,
      points: 6,
      type: '简答：信息不对称',
      intro: '二手车市场与保险市场都存在信息问题。',
      parts: [
        {
          label: '12-1',
          points: 3,
          kind: 'keywords',
          prompt: '解释逆向选择如何导致市场萎缩。',
          explain: '关键词：卖方知道车况、买方只知道平均质量、按平均质量出价、好车退出、平均质量进一步下降、价格继续下跌，形成「柠檬市场」的恶性循环，严重时市场消失。'
        },
        {
          label: '12-2',
          points: 3,
          kind: 'keywords',
          prompt: '保险市场中的道德风险指什么？可用哪些工具缓解？',
          explain: '关键词：投保后行为不可观测、全险降低谨慎激励、赔付增加。工具：免赔额、共保比例、费率与理赔记录挂钩、监督与合同条款——核心都是让投保人自己也承担部分后果。'
        }
      ]
    }
  ]
});
