/* =====================================================================
 * quiz.js · 分章题库（PACK.items）
 * 8 章 × 7 题 = 56 题；每章 q1–q3 即正文内嵌的测验题
 * 字段：{ id, ch, kp, tier, type, difficulty, tags, stem, options|answer, explain }
 * ===================================================================== */
(function () {
  var PACK = {
    items: [
      /* ---------------- ch00 课程地图 ---------------- */
      {
        id: 'ch00-q1', ch: 'ch00', kp: 'ch00-4', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: 'PED1002 的总评由三部分构成，下列比例正确的是哪一项？',
        options: [
          { text: '笔试 25%、技能 60%、课堂参与 15%', correct: true },
          { text: '笔试 60%、技能 25%、课堂参与 15%' },
          { text: '笔试 40%、技能 40%、课堂参与 20%' },
          { text: '笔试 50%、技能 40%、课堂参与 10%' }
        ],
        explain: '课程考核以技能为主：技能 60 分、笔试 25 分、课堂参与 15 分。技能占比最高，所以缺课与技能练习的投入直接决定总评。'
      },
      {
        id: 'ch00-q2', ch: 'ch00', kp: 'ch00-5', tier: 1, type: 'mcq', difficulty: 1, tags: ['rule'],
        stem: '一分钟跳投考核中，命中 4 球对应多少分？',
        options: [
          { text: '8 分', correct: true },
          { text: '6 分' },
          { text: '10 分' },
          { text: '12 分' }
        ],
        explain: '投篮按每球 2 分线性换算：6 球 12 分、5 球 10 分、4 球 8 分、3 球 6 分。多进一球就是实打实的 2 分。'
      },
      {
        id: 'ch00-q3', ch: 'ch00', kp: 'ch00-4', tier: 1, type: 'tf', difficulty: 1, tags: ['rule'],
        stem: '课堂参与分中，缺席一次扣 5 分，迟到超过 15 分钟按缺席计算。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '缺勤规则是缺席一次扣 5 分、迟到超过 15 分钟按缺席计、累计缺席超过 5 次记 F。三次缺席就扣掉 15 分，相当于整个投篮项的分值。'
      },
      {
        id: 'ch00-q4', ch: 'ch00', kp: 'ch00-4', tier: 1, type: 'fill', difficulty: 1, tags: ['concept'],
        stem: '技能考核占总评的百分之多少？（只填数字）',
        answer: '60',
        accept: ['60', '60%', '60 分'],
        explain: '技能 60%、笔试 25%、课堂参与 15%。技能分又拆成投篮 12、运球 25、比赛 23 等可量化的小项。'
      },
      {
        id: 'ch00-q5', ch: 'ch00', kp: 'ch00-2', tier: 2, type: 'mcq', difficulty: 2, tags: ['method'],
        stem: '本站八章的组织逻辑，下列哪一条最准确？',
        options: [
          { text: '先总论体适能，再依次讲心肺、力量、柔韧、体成分，然后落到运动处方与球类游泳技术', correct: true },
          { text: '按教材页码顺序逐页讲解，不区分主题', correct: false },
          { text: '先讲篮球、羽毛球、游泳的技术，再补理论', correct: false },
          { text: '只讲笔试考点，技能部分留给课堂', correct: false }
        ],
        explain: '八章是一条训练逻辑：ch01 总论给出五要素与 FITT，ch02–ch05 逐项展开，ch06 把它们组装成处方，ch07 落到具体项目与终身运动。'
      },
      {
        id: 'ch00-q6', ch: 'ch00', kp: 'ch00-3', tier: 1, type: 'multi', difficulty: 1, tags: ['concept'],
        stem: '健康体适能的五要素包括下列哪些？（多选）',
        options: [
          { text: '心肺耐力', correct: true },
          { text: '肌肉力量与肌肉耐力', correct: true },
          { text: '柔韧性', correct: true },
          { text: '身体成分', correct: true },
          { text: '50 米冲刺速度' }
        ],
        explain: '健康相关体适能是心肺耐力、肌肉力量、肌肉耐力、柔韧性与身体成分五项。速度、敏捷、爆发力属于竞技相关体适能，不是健康五要素。'
      },
      {
        id: 'ch00-q7', ch: 'ch00', kp: 'ch00-6', tier: 1, type: 'mcq', difficulty: 1, tags: ['prescription'],
        stem: '按通行建议，成年人每周应累计多少分钟中等强度有氧运动？',
        options: [
          { text: '150 分钟', correct: true },
          { text: '50 分钟' },
          { text: '300 分钟' },
          { text: '30 分钟' }
        ],
        explain: '基本推荐是每周 150 分钟中等强度或 75 分钟较大强度有氧，再加每周 2 次抗阻。300 分钟是更高的进阶目标，不是最低线。'
      },

      /* ---------------- ch01 健康体适能 ---------------- */
      {
        id: 'ch01-q1', ch: 'ch01', kp: 'ch01-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '下列哪一项属于「竞技相关」而不是「健康相关」体适能？',
        options: [
          { text: '敏捷与爆发力', correct: true },
          { text: '心肺耐力' },
          { text: '柔韧性' },
          { text: '身体成分' }
        ],
        explain: '健康相关五要素是心肺、肌力、肌耐力、柔韧、体成分；竞技相关包括速度、敏捷、爆发力、协调、反应与平衡。两者都要练，但目的不同。'
      },
      {
        id: 'ch01-q2', ch: 'ch01', kp: 'ch01-3', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: 'FITT-VP 中的 V 指什么？',
        options: [
          { text: '总量（volume），即一次或一周训练的总负荷', correct: true },
          { text: '速度（velocity）' },
          { text: '变化（variation）' },
          { text: '有效性（validity）' }
        ],
        explain: 'FITT-VP 是频率、强度、时间、类型、总量、进阶。总量常用「组数 × 次数 × 重量」或「MET·分钟」表示，它把分散的参数合成一个可比较的数。'
      },
      {
        id: 'ch01-q3', ch: 'ch01', kp: 'ch01-4', tier: 1, type: 'tf', difficulty: 1, tags: ['intensity'],
        stem: 'RPE 11–13 大致对应中等强度，此时还能说完整句子但唱不了歌。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: 'Borg 6–20 量表中 11–13 为中等强度，与「能说完整句子、不能唱歌」的说话测试一致；14–16 为较大强度，只能说短句。'
      },
      {
        id: 'ch01-q4', ch: 'ch01', kp: 'ch01-3', tier: 1, type: 'fill', difficulty: 1, tags: ['prescription'],
        stem: '健康成人每周中等强度有氧的推荐下限是多少分钟？（只填数字）',
        answer: '150',
        accept: ['150', '150 分钟', '150分钟'],
        explain: '每周 150 分钟中等强度，或 75 分钟较大强度，可拆成 5 次 × 30 分钟。超过 300 分钟可获得更多健康收益。'
      },
      {
        id: 'ch01-q5', ch: 'ch01', kp: 'ch01-5', tier: 2, type: 'mcq', difficulty: 2, tags: ['method'],
        stem: '关于训练五原则，下列哪一句是错的？',
        options: [
          { text: '只要总量够，练什么动作都一样，这叫特异性', correct: true },
          { text: '超负荷要求训练刺激略高于当前适应水平', correct: false },
          { text: '渐进要小步增加，避免一次加太多', correct: false },
          { text: '个体差异意味着同样的计划对不同人效果不同', correct: false }
        ],
        explain: '特异性恰恰是说「练什么就长什么」：跑步提高心肺，但不会直接提高卧推。其余三句分别对应超负荷、渐进与个体差异。'
      },
      {
        id: 'ch01-q6', ch: 'ch01', kp: 'ch01-6', tier: 1, type: 'multi', difficulty: 1, tags: ['assessment'],
        stem: '一次合格的基线评估应当包含哪些内容？（多选）',
        options: [
          { text: '心肺耐力测试（如 12 分钟跑或台阶试验）', correct: true },
          { text: '力量或肌耐力测试', correct: true },
          { text: '柔韧性测试（如坐位体前屈）', correct: true },
          { text: '身体成分（BMI、腰围、体脂率）', correct: true },
          { text: '只称一次体重就够了' }
        ],
        explain: '基线要覆盖五要素中的至少四项，才能知道从哪里开始、短板在哪里。单一指标（尤其只看体重）无法反映体适能结构。'
      },
      {
        id: 'ch01-q7', ch: 'ch01', kp: 'ch01-7', tier: 2, type: 'mcq', difficulty: 2, tags: ['concept'],
        stem: '关于训练后的肌肉酸痛（DOMS），下列哪一项正确？',
        options: [
          { text: '通常在运动后 24–72 小时达到高峰，与肌肉离心收缩造成的微损伤有关', correct: true },
          { text: '说明训练完全无效，应立即停止训练', correct: false },
          { text: '是乳酸堆积造成的，拉伸可以立刻清除', correct: false },
          { text: '只在初学者身上出现，老手不会酸痛', correct: false }
        ],
        explain: 'DOMS 与离心收缩造成的微损伤和炎症有关，24–72 小时达峰，数天内自行缓解。乳酸在运动后一两小时就代谢完了，不是酸痛的原因。'
      },

      /* ---------------- ch02 心肺耐力 ---------------- */
      {
        id: 'ch02-q1', ch: 'ch02', kp: 'ch02-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '最大摄氧量（VO2max）的常用单位是什么？',
        options: [
          { text: 'ml/kg/min', correct: true },
          { text: 'L/min' },
          { text: 'kcal/min' },
          { text: '次/分' }
        ],
        explain: 'VO2max 常用相对值 ml/kg/min，便于不同体重的人比较；绝对值 L/min 用于反映总摄氧能力。它是心肺耐力的核心指标。'
      },
      {
        id: 'ch02-q2', ch: 'ch02', kp: 'ch02-3', tier: 2, type: 'mcq', difficulty: 2, tags: ['calc'],
        stem: '用 12 分钟跑推算 VO2max，若 12 分钟跑了 2000 米，结果约为多少？',
        options: [
          { text: '33.4 ml/kg/min', correct: true },
          { text: '44.7 ml/kg/min' },
          { text: '28.6 ml/kg/min' },
          { text: '50.2 ml/kg/min' }
        ],
        explain: '公式为 VO2max ≈（距离米数 − 504.9）÷ 44.73，（2000 − 504.9）÷ 44.73 ≈ 33.4。距离越远，估算值越高。'
      },
      {
        id: 'ch02-q3', ch: 'ch02', kp: 'ch02-3', tier: 2, type: 'tf', difficulty: 2, tags: ['assessment'],
        stem: '台阶试验指数越大，说明心肺耐力越好。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '台阶指数 = 运动秒数 × 100 ÷（2 × 三次脉搏之和）。同样负荷下恢复越快、脉搏越低，指数越大，反映心肺适应能力越强。'
      },
      {
        id: 'ch02-q4', ch: 'ch02', kp: 'ch02-3', tier: 2, type: 'fill', difficulty: 2, tags: ['calc'],
        stem: '台阶试验运动 180 秒，三次脉搏分别为 60、55、50，指数是多少？（保留一位小数）',
        answer: '54.5',
        accept: ['54.5', '54.54', '54.6'],
        explain: '指数 = 180 × 100 ÷（2 × 165）= 18000 ÷ 330 ≈ 54.5。三次脉搏之和越小，指数越高。'
      },
      {
        id: 'ch02-q5', ch: 'ch02', kp: 'ch02-2', tier: 2, type: 'mcq', difficulty: 2, tags: ['method'],
        stem: '高强度间歇训练（HIIT）的典型特征是？',
        options: [
          { text: '强度约 85% 以上最大心率，单次 20–30 分钟，含多组短时高强度与间歇', correct: true },
          { text: '强度 50% 以下，持续 90 分钟', correct: false },
          { text: '只做低强度长时间慢跑', correct: false },
          { text: '完全不需要热身与整理', correct: false }
        ],
        explain: 'HIIT 用 85% 以上的强度做多组间歇（如 4 分钟 × 4 组），总时长较短但心肺刺激强。它替代不了热身与整理，也不适合所有人。'
      },
      {
        id: 'ch02-q6', ch: 'ch02', kp: 'ch02-2', tier: 1, type: 'multi', difficulty: 1, tags: ['method'],
        stem: '下列哪些属于常见的有氧训练方法？（多选）',
        options: [
          { text: 'LSD（长距离慢跑）', correct: true },
          { text: '节奏跑（tempo）', correct: true },
          { text: '间歇训练（interval）', correct: true },
          { text: 'HIIT（高强度间歇）', correct: true },
          { text: '坐姿腿屈伸' }
        ],
        explain: 'LSD、节奏跑、间歇、HIIT 是四种典型有氧方法，区别在强度与时长配比。坐姿腿屈伸是抗阻动作，主要练股四头肌，不属于有氧方法。'
      },
      {
        id: 'ch02-q7', ch: 'ch02', kp: 'ch02-5', tier: 2, type: 'mcq', difficulty: 2, tags: ['intensity'],
        stem: '「心率漂移」指的是什么？',
        options: [
          { text: '长时间运动或高温脱水时，同样配速下心率缓慢上升 10–20 次', correct: true },
          { text: '手表电量不足导致心率读数消失', correct: false },
          { text: '静息心率随训练水平提高而下降', correct: false },
          { text: '运动结束后心率快速回落', correct: false }
        ],
        explain: '心率漂移是身体为维持同样的输出而付出的额外心血管代价，热天与脱水时更明显。它提醒你：配速相同不等于强度相同。'
      },

      /* ---------------- ch03 肌肉力量 ---------------- */
      {
        id: 'ch03-q1', ch: 'ch03', kp: 'ch03-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '抗阻训练初期（0–6 周）力量快速提高，主要原因是？',
        options: [
          { text: '神经适应：更多运动单位被募集、放电频率提高', correct: true },
          { text: '肌肉横截面积已经大幅增加', correct: false },
          { text: '骨密度迅速提高', correct: false },
          { text: '肌腱长度明显变长', correct: false }
        ],
        explain: '前 6 周力量可提高 20–40%，但肌肉体积变化很小，主要来自神经适应；明显的肌肥大通常在 6 周以后才显现。'
      },
      {
        id: 'ch03-q2', ch: 'ch03', kp: 'ch03-2', tier: 2, type: 'mcq', difficulty: 2, tags: ['prescription'],
        stem: '以增肌为目标的抗阻训练，常用的强度与次数区间是？',
        options: [
          { text: '67–85% 1RM，每组 6–12 次，2–3 组，组间休息 2–3 分钟', correct: true },
          { text: '85% 以上 1RM，每组 1–6 次', correct: false },
          { text: '50% 以下 1RM，每组 15–25 次', correct: false },
          { text: '30% 1RM，每组 30 次以上', correct: false }
        ],
        explain: '增肌区在 67–85% 1RM、6–12 次，兼顾机械张力与代谢压力。85% 以上偏重最大力量，≤50% 的高次数更适合增骨量与肌耐力。'
      },
      {
        id: 'ch03-q3', ch: 'ch03', kp: 'ch03-7', tier: 1, type: 'tf', difficulty: 1, tags: ['concept'],
        stem: '女性的睾酮水平显著低于男性，因此抗阻训练对女性几乎无效。',
        options: [
          { text: '错误', correct: true },
          { text: '正确' }
        ],
        explain: '前半句对、后半句错，所以整句是错的。女性睾酮虽低 10–20 倍，但抗阻训练的神经适应与肌肥大反应同样显著，只是绝对力量上限不同。'
      },
      {
        id: 'ch03-q4', ch: 'ch03', kp: 'ch03-4', tier: 2, type: 'fill', difficulty: 2, tags: ['calc'],
        stem: '用 Epley 公式估算：某人 60 kg 能完成 10 次，其 1RM 约为多少 kg？（只填数字）',
        answer: '80',
        accept: ['80', '80 kg', '80kg'],
        explain: 'Epley：1RM ≈ 重量 ×（1 + 次数 ÷ 30）= 60 ×（1 + 10/30）= 80 kg。次数越少，估算越准；超过 15 次误差会变大。'
      },
      {
        id: 'ch03-q5', ch: 'ch03', kp: 'ch03-3', tier: 1, type: 'mcq', difficulty: 1, tags: ['method'],
        stem: '下列哪一组是本章推荐的五种基本动作模式？',
        options: [
          { text: '推、拉、蹲、髋铰链、核心', correct: true },
          { text: '胸、背、腿、肩、臂', correct: false },
          { text: '跑、跳、投、掷、爬', correct: false },
          { text: '深蹲、卧推、硬拉、引体、卧腿弯举', correct: false }
        ],
        explain: '按动作模式而非肌肉部位安排训练，能覆盖全身并避免遗漏：推（卧推/肩推）、拉（划船/引体）、蹲、髋铰链（硬拉/臀桥）、核心（平板/抗旋转）。'
      },
      {
        id: 'ch03-q6', ch: 'ch03', kp: 'ch03-6', tier: 1, type: 'multi', difficulty: 1, tags: ['safety'],
        stem: '抗阻训练的安全做法包括哪些？（多选）',
        options: [
          { text: '发力时呼气、还原时吸气，避免长时间憋气', correct: true },
          { text: '大重量时使用护具并请同伴保护', correct: true },
          { text: '训练前做 5–10 分钟热身与轻重量激活组', correct: true },
          { text: '每周只增加一点点重量，循序渐进', correct: true },
          { text: '为了快速进步，每天对同一肌群做大重量训练' }
        ],
        explain: '呼气发力、护具与保护、热身、渐进都是标准做法。同一肌群大重量训练应间隔至少 48 小时，否则恢复不足，受伤与平台期都会提前到来。'
      },
      {
        id: 'ch03-q7', ch: 'ch03', kp: 'ch03-2', tier: 2, type: 'mcq', difficulty: 2, tags: ['prescription'],
        stem: '预设次数完成后「还能再做几次」的指标 RIR，若一组结束后还能做 1–2 次，RIR 约为多少？',
        options: [
          { text: '1–2', correct: true },
          { text: '0' },
          { text: '4–5' },
          { text: '10' }
        ],
        explain: 'RIR（保留次数）指力竭前还能完成的次数。RIR 0–3 通常对应有效刺激区间；RIR 4 以上说明重量偏轻，RIR 0 说明已力竭，不宜每组都做。'
      },

      /* ---------------- ch04 柔韧与损伤预防 ---------------- */
      {
        id: 'ch04-q1', ch: 'ch04', kp: 'ch04-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '静态拉伸时，肌肉被拉长到一定程度会自动收缩抵抗，这一反射是？',
        options: [
          { text: '牵张反射', correct: true },
          { text: '腱反射' },
          { text: '交叉伸肌反射' },
          { text: '翻正反射' }
        ],
        explain: '肌梭感受到快速拉长会触发牵张反射，肌肉反射性收缩。缓慢、持续地拉可以降低这一反射，这也是静态拉伸要慢的原因。'
      },
      {
        id: 'ch04-q2', ch: 'ch04', kp: 'ch04-2', tier: 1, type: 'mcq', difficulty: 1, tags: ['method'],
        stem: '训练前的准备活动中，更合适的拉伸方式是？',
        options: [
          { text: '动态拉伸，每个动作 8–12 次，配合升温', correct: true },
          { text: '长时间静态拉伸，每个部位 3 分钟', correct: false },
          { text: '弹震式拉伸，快速反复弹动', correct: false },
          { text: '完全不拉伸，直接上最大重量', correct: false }
        ],
        explain: '训练前用动态拉伸升高体温、激活神经；长时间静态拉伸（尤其超过 60 秒）会短暂降低力量输出 5–10%，应放在训练后。'
      },
      {
        id: 'ch04-q3', ch: 'ch04', kp: 'ch04-2', tier: 2, type: 'tf', difficulty: 2, tags: ['method'],
        stem: '训练前做超过 60 秒的静态拉伸，可能使随后的力量表现下降 5–10%。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '长时间静态拉伸会降低肌肉的僵硬度与神经驱动，短时间内的爆发力与最大力量会受影响。所以静态拉伸放在训练后或单独安排。'
      },
      {
        id: 'ch04-q4', ch: 'ch04', kp: 'ch04-5', tier: 1, type: 'fill', difficulty: 1, tags: ['safety'],
        stem: '急性软组织损伤处理的 POLICE 原则中，P 代表什么？（填中文）',
        answer: '保护',
        accept: ['保护', '保护患处', 'Protection', 'protection'],
        explain: 'POLICE 是保护（Protection）、适度负荷（Optimal Loading）、冰敷（Ice）、加压（Compression）、抬高（Elevation）。与旧版 RICE 相比，它强调尽早的适度负荷。'
      },
      {
        id: 'ch04-q5', ch: 'ch04', kp: 'ch04-5', tier: 2, type: 'mcq', difficulty: 2, tags: ['safety'],
        stem: '踝关节扭伤后 48 小时内，下列哪种做法最合适？',
        options: [
          { text: '保护、冰敷 15–20 分钟、弹力绷带加压、抬高患肢', correct: true },
          { text: '立即热敷并用力按摩，把淤血揉开', correct: false },
          { text: '继续训练，靠活动把关节活动开', correct: false },
          { text: '完全不动，一周内不承重也不做任何活动', correct: false }
        ],
        explain: '急性期以控制肿胀与疼痛为主：冰敷、加压、抬高，同时避免热敷与用力按摩。过度制动也不利恢复，应在可承受范围内逐步负重。'
      },
      {
        id: 'ch04-q6', ch: 'ch04', kp: 'ch04-5', tier: 1, type: 'multi', difficulty: 1, tags: ['safety'],
        stem: '运动损伤的「红旗信号」包括哪些？（多选）',
        options: [
          { text: '剧烈疼痛、明显畸形', correct: true },
          { text: '受伤后无法负重或关节不稳', correct: true },
          { text: '意识改变、头晕或呕吐', correct: true },
          { text: '轻微肌肉酸胀，休息后缓解' }
        ],
        explain: '红旗信号提示可能存在骨折、脱位、脑震荡或血管神经损伤，应停止运动并就医。轻微酸胀属于正常训练反应，不是红旗。'
      },
      {
        id: 'ch04-q7', ch: 'ch04', kp: 'ch04-6', tier: 1, type: 'mcq', difficulty: 1, tags: ['method'],
        stem: 'RAMP 热身框架的正确顺序是？',
        options: [
          { text: '提升（Raise）→ 激活（Activate）→ 动员（Mobilise）→ 增强（Potentiate）', correct: true },
          { text: '拉伸 → 跑步 → 力量 → 冷身' },
          { text: '动员 → 提升 → 增强 → 激活' },
          { text: '冰敷 → 热身 → 训练 → 拉伸' }
        ],
        explain: 'RAMP 分四步：先升高体温与心率，再激活稳定肌群，然后做关节活动度练习，最后用渐进强度的动作做神经增强。比单纯的慢跑加拉伸更完整。'
      },

      /* ---------------- ch05 身体成分与营养 ---------------- */
      {
        id: 'ch05-q1', ch: 'ch05', kp: 'ch05-3', tier: 1, type: 'mcq', difficulty: 1, tags: ['concept'],
        stem: '按中国成人标准，BMI 25.0–29.9 属于？',
        options: [
          { text: '超重', correct: true },
          { text: '正常' },
          { text: '肥胖' },
          { text: '过轻' }
        ],
        explain: 'BMI 分级为低于 18.5 过轻、18.5–24.9 正常、25.0–29.9 超重、30 及以上肥胖。BMI 不区分脂肪与肌肉，需结合腰围与体脂率一起看。'
      },
      {
        id: 'ch05-q2', ch: 'ch05', kp: 'ch05-1', tier: 2, type: 'mcq', difficulty: 2, tags: ['assessment'],
        stem: '20–29 岁男性体脂率 11.5–14.8% 属于哪一档？',
        options: [
          { text: '良好', correct: true },
          { text: '非常瘦' },
          { text: '一般' },
          { text: '很胖' }
        ],
        explain: '男性六档为非常瘦 4.2–6.4、出色 7.9–10.5、良好 11.5–14.8、一般 15.8–18.6、较胖 19.7–23.3、很胖 24.9–33.4。11.5–14.8 落在良好档。'
      },
      {
        id: 'ch05-q3', ch: 'ch05', kp: 'ch05-4', tier: 1, type: 'tf', difficulty: 1, tags: ['nutrition'],
        stem: '减掉 1 磅脂肪大约需要 3500 kcal 的热量缺口。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '1 磅脂肪约含 3500 kcal，这是「每天缺口 500 kcal、一周约减 1 磅」这一经验规则的来源。它只是近似，实际减重还受水分与肌肉变化影响。'
      },
      {
        id: 'ch05-q4', ch: 'ch05', kp: 'ch05-4', tier: 2, type: 'fill', difficulty: 2, tags: ['calc'],
        stem: '一位 60 kg 女性，按 0.9 kcal/kg/h 估算，其基础代谢率约为多少 kcal/天？（只填数字）',
        answer: '1296',
        accept: ['1296', '1296 kcal', '1300'],
        explain: 'BMR = 0.9 × 60 × 24 = 1296 kcal/天。男性用 1.0 kcal/kg/h。这是清醒静卧状态下的消耗，还要乘以活动系数才接近每日总消耗。'
      },
      {
        id: 'ch05-q5', ch: 'ch05', kp: 'ch05-6', tier: 1, type: 'mcq', difficulty: 1, tags: ['nutrition'],
        stem: '减脂期比较合理的每日热量缺口是？',
        options: [
          { text: '500–1000 kcal', correct: true },
          { text: '100–200 kcal' },
          { text: '1500–2000 kcal' },
          { text: '不需要缺口，只要运动' }
        ],
        explain: '每日 500–1000 kcal 的缺口对应每周约减 0.5–1 kg，既能减脂又较少损失肌肉。缺口过大容易导致代谢适应、肌肉流失与反弹。'
      },
      {
        id: 'ch05-q6', ch: 'ch05', kp: 'ch05-5', tier: 1, type: 'multi', difficulty: 1, tags: ['nutrition'],
        stem: '关于蛋白质摄入，下列哪些说法正确？（多选）',
        options: [
          { text: '一般训练者每公斤体重约 1.2–1.6 g', correct: true },
          { text: '减脂期可提高到 1.6–2.0 g/kg，以保住肌肉', correct: true },
          { text: '分 3–4 餐摄入，比一顿吃完全部更有效', correct: true },
          { text: '只靠蛋白粉就能满足全部需求' }
        ],
        explain: '总量与分配都重要：每公斤 1.2–1.6 g，减脂期可提高，分 3–4 餐摄入。蛋白粉只是补充手段，天然食物还提供其他营养素。'
      },
      {
        id: 'ch05-q7', ch: 'ch05', kp: 'ch05-3', tier: 2, type: 'mcq', difficulty: 2, tags: ['assessment'],
        stem: '一位男性腰围 105 cm，按课程资料的腰围风险分级，属于？',
        options: [
          { text: '高', correct: true },
          { text: '很低' },
          { text: '低' },
          { text: '很高' }
        ],
        explain: '男性腰围低于 80 cm 很低、80–99 cm 低、100–120 cm 高、超过 120 cm 很高。105 cm 落在高风险区间，提示内脏脂肪较多。'
      },

      /* ---------------- ch06 运动处方 ---------------- */
      {
        id: 'ch06-q1', ch: 'ch06', kp: 'ch06-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['prescription'],
        stem: '运动处方的四项原则是？',
        options: [
          { text: '因人而异、有效、安全、全面', correct: true },
          { text: '强度、频率、时间、类型', correct: false },
          { text: '超负荷、渐进、特异性、可逆性', correct: false },
          { text: '有氧、抗阻、柔韧、平衡', correct: false }
        ],
        explain: '四原则是因人而异、有效、安全、全面；FITT 是要素，训练五原则是另一套概念。四者互相制约，只追效果容易伤，只追安全没效果。'
      },
      {
        id: 'ch06-q2', ch: 'ch06', kp: 'ch06-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['prescription'],
        stem: '下列哪一项不属于运动处方的六个要素？',
        options: [
          { text: '教练的姓名', correct: true },
          { text: '目的' },
          { text: '强度' },
          { text: '注意事项' }
        ],
        explain: '六要素是目的、频率、强度、时间、类型、注意事项。教练姓名不是处方要素；注意事项是安全原则落地的地方，最容易被省略。'
      },
      {
        id: 'ch06-q3', ch: 'ch06', kp: 'ch06-2', tier: 1, type: 'tf', difficulty: 1, tags: ['safety'],
        stem: '制定运动处方的第一步是预检与健康评价，PAR-Q 是常用的筛查工具。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '流程是预检与健康评价、必要时负荷试验、体适能测试、成方。PAR-Q 任一项答「是」应先咨询医生，跳过预检直接开计划是常见错误。'
      },
      {
        id: 'ch06-q4', ch: 'ch06', kp: 'ch06-4', tier: 2, type: 'fill', difficulty: 2, tags: ['calc'],
        stem: '20 岁、静息心率 65 的人，按 60% 储备心率计算，目标心率是多少次/分？（只填数字）',
        answer: '146',
        accept: ['146', '146 次', '146次/分'],
        explain: 'HRmax = 220 − 20 = 200，储备 = 135，目标 = 65 + 0.6 × 135 = 146。70% 则为 160，所以区间是 146–160。'
      },
      {
        id: 'ch06-q5', ch: 'ch06', kp: 'ch06-3', tier: 2, type: 'mcq', difficulty: 2, tags: ['prescription'],
        stem: '以增肌为目标的抗阻处方，频率与组间休息通常怎么安排？',
        options: [
          { text: '每周 2–3 次，同一肌群间隔至少 48 小时，组间休息 2–3 分钟', correct: true },
          { text: '每天 1 次，组间不休息', correct: false },
          { text: '每周 5 次，同一肌群连续练', correct: false },
          { text: '每周 1 次，组间休息 10 分钟', correct: false }
        ],
        explain: '增肌需要足够的刺激与恢复：每周 2–3 次、同肌群间隔 ≥48 小时、60–80% 1RM、8–12 次、2–4 组、组间 2–3 分钟。'
      },
      {
        id: 'ch06-q6', ch: 'ch06', kp: 'ch06-7', tier: 2, type: 'multi', difficulty: 2, tags: ['safety'],
        stem: '为特殊人群调整处方时，下列哪些做法正确？（多选）',
        options: [
          { text: '高血压者避免憋气与爆发性用力，抗阻时呼气发力', correct: true },
          { text: '糖尿病者运动前血糖低于 5.6 mmol/L 时先补 15–20 g 碳水', correct: true },
          { text: '肥胖者优先选择游泳、骑车等低冲击项目', correct: true },
          { text: '服用 β 受体阻滞剂者应完全用最大心率百分比判断强度' }
        ],
        explain: 'β 受体阻滞剂会压低心率，这类人应更多依靠 RPE 与说话测试。其余三项分别是高血压、糖尿病、肥胖的标准调整。'
      },
      {
        id: 'ch06-q7', ch: 'ch06', kp: 'ch06-6', tier: 1, type: 'mcq', difficulty: 1, tags: ['prescription'],
        stem: '运动处方的复评周期一般是多久？',
        options: [
          { text: '4–6 周', correct: true },
          { text: '1 天' },
          { text: '半年' },
          { text: '不需要复评' }
        ],
        explain: '4–6 周复评一次，看静息心率、体重腰围、同样配速下的心率、同样重量下的次数、柔韧与主观状态。调整时先看执行率，再改参数。'
      },

      /* ---------------- ch07 球类与游泳 ---------------- */
      {
        id: 'ch07-q1', ch: 'ch07', kp: 'ch07-1', tier: 1, type: 'mcq', difficulty: 1, tags: ['skill'],
        stem: '一分钟跳投考核中，命中 5 球得多少分？',
        options: [
          { text: '10 分', correct: true },
          { text: '8 分' },
          { text: '12 分' },
          { text: '6 分' }
        ],
        explain: '每球 2 分：6 球 12 分、5 球 10 分、4 球 8 分、3 球 6 分、2 球 4 分、1 球 2 分。所以 5 球对应 10 分。'
      },
      {
        id: 'ch07-q2', ch: 'ch07', kp: 'ch07-3', tier: 1, type: 'mcq', difficulty: 1, tags: ['skill'],
        stem: '全场运球上篮考核，男子满分（25 分）的时间标准是？',
        options: [
          { text: '45 秒', correct: true },
          { text: '60 秒' },
          { text: '38 秒' },
          { text: '52 秒' }
        ],
        explain: '男子 45 秒满分，60 秒大约 10 分，中间每慢 3 秒掉一档；女子标准整体慢 3 秒。全程零失误比单纯求快更接近满分。'
      },
      {
        id: 'ch07-q3', ch: 'ch07', kp: 'ch07-4', tier: 1, type: 'tf', difficulty: 1, tags: ['skill'],
        stem: '羽毛球正手发高远球落在 A 区得 5 分，B 区得 3 分，C 区得 1 分。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '发球 5 个按落区计分：A 区 5 分、B 区 3 分、C 区 1 分。A 区最靠近底线，说明球又高又远才算高质量发球。'
      },
      {
        id: 'ch07-q4', ch: 'ch07', kp: 'ch07-5', tier: 2, type: 'fill', difficulty: 2, tags: ['skill'],
        stem: '男子 50 米蛙泳用 66 秒完成，按时间标准得多少分？（只填数字）',
        answer: '15',
        accept: ['15', '15 分', '15分'],
        explain: '男子 56 秒及以内 18 分、57–66 秒 15 分、67–76 秒 12 分。66 秒正好落在 15 分档的上限。'
      },
      {
        id: 'ch07-q5', ch: 'ch07', kp: 'ch07-2', tier: 2, type: 'mcq', difficulty: 2, tags: ['rule'],
        stem: '三人制篮球（3x3）的比赛时长与胜负条件是？',
        options: [
          { text: '10 分钟，或任一队先得 21 分', correct: true },
          { text: '4 节 × 10 分钟，打满全场', correct: false },
          { text: '20 分钟，先得 30 分', correct: false },
          { text: '两节 × 5 分钟，先得 11 分' }
        ],
        explain: '3x3 单节 10 分钟，或在 10 分钟内先到 21 分即结束；计分为 1 分与 2 分制，全队第 6 次犯规起罚球。'
      },
      {
        id: 'ch07-q6', ch: 'ch07', kp: 'ch07-7', tier: 1, type: 'multi', difficulty: 1, tags: ['concept'],
        stem: '挑选一项能长期坚持的运动时，本章建议考虑哪三条标准？（多选）',
        options: [
          { text: '可得性：场地近、装备便宜、受天气影响小', correct: true },
          { text: '社交性：有人一起练，缺席会有压力', correct: true },
          { text: '可调节：强度能从低到高，受伤后能降级', correct: true },
          { text: '装备越贵越专业越好' }
        ],
        explain: '可得性、社交性、可调节是筛选主项目的三条标准；装备价格与坚持程度无关。选出一主一副，比同时玩五个项目更容易长期执行。'
      },
      {
        id: 'ch07-q7', ch: 'ch07', kp: 'ch07-6', tier: 2, type: 'mcq', difficulty: 2, tags: ['skill'],
        stem: '蛙泳的主要推进力来自哪个动作？',
        options: [
          { text: '蹬夹腿', correct: true },
          { text: '划手', correct: false },
          { text: '抬头换气', correct: false },
          { text: '腰部起伏' }
        ],
        explain: '蛙泳是「划手换气、蹬夹推进、滑行省力」的循环，主要推进来自蹬夹腿；划手更多负责抬头换气与配合。所以蛙泳腿单独占 12 分。'
      }
    ]
  };
  CSC._quizPack = PACK;
  CSC.registerQuizPack(PACK);
})();
