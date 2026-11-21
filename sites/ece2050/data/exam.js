/* =====================================================================
 * exam.js · 模拟卷（CSC.registerExam）
 * 结构：{ id, title, style, subtitle, date, minutes, totalScore, summary, instructions,
 *         questions:[{ no, points, type, intro, code, codeTitle, parts:[{ label, points, kind,
 *                     prompt, options:[{text,correct}], explain }] }] }
 * 12 题，满分 100，覆盖 ch01–ch07。
 * ===================================================================== */
CSC.registerExam({
  id: 'ECE2050-A',
  title: '模拟卷 A',
  style: 'MIDTERM',
  subtitle: '覆盖第 1–7 章：数制与编码、布尔代数、化简、组合模块、触发器、状态机、存储器',
  date: '',
  minutes: 90,
  totalScore: 100,
  summary: '共 12 题：选择题 8 分、填空题 16 分、化简与设计题 30 分、时序与状态机 28 分、存储器与综合 18 分。难度按讲义例题与作业题的中上水平设置。',
  instructions: [
    '闭卷，90 分钟；可使用非 programmable 计算器，不得使用手机。',
    '化简题请画出卡诺图并标出所圈的组，只写结果不给分。',
    '设计题请先写真值表或状态表，再写表达式；Verilog 题按可综合风格作答。',
    '所有二进制数请标明位宽，补码题请写出判断溢出的依据。'
  ],
  questions: [
    { no: 1, points: 8, type: '选择题', intro: '数制与编码（每小题 2 分）',
      parts: [
        { label: '(1)', points: 2, kind: 'choice', prompt: '8 位补码能表示的整数范围是：',
          options: [{ text: '−128 ~ +127', correct: true }, { text: '−127 ~ +127' }, { text: '0 ~ 255' }, { text: '−256 ~ +255' }],
          explain: '8 位共 256 个编码，补码把 1000 0000 定义为 −128，其余负数为 −127 到 −1，正数 0 到 +127。' },
        { label: '(2)', points: 2, kind: 'choice', prompt: '十进制 0.375 的二进制表示是：',
          options: [{ text: '0.011', correct: true }, { text: '0.101' }, { text: '0.110' }, { text: '0.010' }],
          explain: '0.375×2=0.75 取 0，0.75×2=1.5 取 1，0.5×2=1.0 取 1，得 0.011。' },
        { label: '(3)', points: 2, kind: 'choice', prompt: '下列编码中，相邻两个码字只有一位不同的是：',
          options: [{ text: '格雷码', correct: true }, { text: 'BCD 码' }, { text: '余三码' }, { text: 'ASCII 码' }],
          explain: '格雷码的构造保证相邻码字只差一位，用于减少多位同时翻转带来的采样错误。' },
        { label: '(4)', points: 2, kind: 'choice', prompt: '两个 8 位补码数 0110 1010 与 0011 0101 相加，结果与溢出情况是：',
          options: [{ text: '1001 1111，未溢出' }, { text: '1001 1111，溢出', correct: true }, { text: '1001 1110，未溢出' }, { text: '1010 0000，溢出' }],
          explain: '两数之和为 159，超过 8 位有符号数的上限 +127；两个正数相加得到最高位为 1 的结果，符号位改变，故溢出。' }
      ] },
    { no: 2, points: 8, type: '填空题', intro: '进制与位宽（每空 2 分）',
      parts: [
        { label: '(1)', points: 2, kind: 'fill', prompt: '十六进制 0x2F 的十进制值是 ______。',
          answer: '47', explain: '2×16 + 15 = 47。' },
        { label: '(2)', points: 2, kind: 'fill', prompt: '十进制 100 的 8 位二进制表示是 ______。',
          answer: '01100100', explain: '64 + 32 + 4 = 100，即 0110 0100。' },
        { label: '(3)', points: 2, kind: 'fill', prompt: '−25 的 8 位补码是 ______（二进制）。',
          answer: '11100111', explain: '+25 = 0001 1001，取反 1110 0110，加 1 得 1110 0111。' },
        { label: '(4)', points: 2, kind: 'fill', prompt: '要表示 0 到 1000 的无符号整数，至少需要 ______ 位。',
          answer: '10', explain: '2 的 9 次方是 512，不够；2 的 10 次方是 1024，够用，所以至少 10 位。' }
      ] },
    { no: 3, points: 10, type: '化简题', intro: '用卡诺图化简下列函数，写出最简与或式（每小题 5 分）',
      parts: [
        { label: '(1)', points: 5, kind: 'output', prompt: 'F(A,B,C,D) = Σm(0,1,2,3,8,9,10,11)，求最简与或式。',
          answer: 'B&#39;',
          explain: 'm0–m3 是 A=0、B=0 的整行，m8–m11 是 A=1、B=0 的整行，两行合成一个八格圈，只剩 B&#39;。' },
        { label: '(2)', points: 5, kind: 'output', prompt: 'G(A,B,C) = Σm(1,2,3,5,7)，求最简与或式。',
          answer: 'A&#39;B + C',
          explain: 'm1、m3、m5、m7 中 C=1 覆盖 1、3、5、7，得 C；剩下 m2（A=0,B=1,C=0）与 m3 相邻，圈得 A&#39;B。故 G = C + A&#39;B。' }
      ] },
    { no: 4, points: 10, type: '设计题', intro: '组合逻辑设计（每小题 5 分）',
      parts: [
        { label: '(1)', points: 5, kind: 'output', prompt: '设计一个「多数表决器」：三个输入 A、B、C，输出 F 在至少两个输入为 1 时为 1。写出 F 的最简与或式。',
          answer: 'F = AB + BC + AC',
          explain: '真值表有 4 个最小项（011、101、110、111），两两相邻，圈成三个二变量圈，得 AB + BC + AC。' },
        { label: '(2)', points: 5, kind: 'output', prompt: '用一片 3 线到 8 线译码器（输出低有效）和若干与非门实现 F = Σm(1,4,6)，请写出所用译码器输出与门的连接关系。',
          answer: 'F = (Y1·Y4·Y6)&#39;，即把 Y1、Y4、Y6 接入一个与非门',
          explain: '低有效译码器的 Yi 在 i 被选中时为 0，所以最小项之和对应「与非」：F = (Y1·Y4·Y6)&#39;。' }
      ] },
    { no: 5, points: 8, type: '选择题', intro: '组合模块（每小题 4 分）',
      parts: [
        { label: '(1)', points: 4, kind: 'choice', prompt: '用 4 选 1 多路选择器实现三变量函数 F(A,B,C)，若把 A、B 接选择端，则四个数据输入端应接：',
          options: [{ text: 'C、C、C&#39;、C&#39;' }, { text: '0、1、C、C&#39; 等按真值表取值', correct: true }, { text: '全部接 1' }, { text: 'A、B、C 三者' }],
          explain: '把函数按 A、B 展开，每个分支的系数是 C 的函数（0、1、C 或 C&#39;），数据端就接对应的常量或 C／C&#39;，这是 MUX 当 LUT 的用法。' },
        { label: '(2)', points: 4, kind: 'choice', prompt: '行波进位加法器的主要缺点是：',
          options: [{ text: '不能做减法' }, { text: '进位逐级传递，位数越多延迟越大', correct: true }, { text: '无法级联' }, { text: '只能用全加器实现' }],
          explain: '第 n 位的和要等第 n−1 位的进位，延迟与位数成正比；超前进位用 G、P 并行算出各位进位来缩短关键路径。' }
      ] },
    { no: 6, points: 8, type: '分析题', intro: '触发器与时序（每小题 4 分）',
      parts: [
        { label: '(1)', points: 4, kind: 'output', prompt: '某 D 触发器在时钟上升沿采样，数据在时钟沿前 1 ns 才稳定，而器件的建立时间为 2 ns。会发生什么？如何修复？',
          answer: '违反建立时间，可能进入亚稳态；应缩短组合逻辑延迟或插入一级寄存器打拍',
          explain: '数据到达太晚，触发器内部无法在采样窗口内建立稳定值，输出可能在一段时间内振荡；降低前级延迟或加流水线可让数据提前到达。' },
        { label: '(2)', points: 4, kind: 'tf', prompt: '判断：把两个门控 D 锁存器用反相时钟串联，就能得到可靠的边沿触发 D 触发器。',
          options: [{ text: '正确' }, { text: '错误', correct: true }],
          explain: '简单串联会出现「空翻」：时钟高电平期间主级透明、从级也透明，输入仍能传到输出。可靠的主从结构需要更严格的时钟配合，工程上直接用边沿触发器单元。' }
      ] },
    { no: 7, points: 8, type: '设计题', intro: '计数器设计（每小题 4 分）',
      parts: [
        { label: '(1)', points: 4, kind: 'output', prompt: '用 4 位同步二进制计数器（74163 风格，同步清零）实现模 10 计数器，清零条件应写成什么？',
          answer: '计数值等于 9 时产生同步清零（或计到 9 后下一拍回 0）',
          explain: '同步清零在时钟沿生效，所以要在 Q=9（1001）时置清零有效，下一拍回到 0000，状态序列正好 0–9 共 10 个。' },
        { label: '(2)', points: 4, kind: 'fill', prompt: '若要实现模 12 计数器，需要 ______ 个触发器（填数字）。',
          answer: '4', explain: '模 12 需要 12 个状态，3 位只有 8 个状态不够，4 位有 16 个状态，故至少 4 个触发器。' }
      ] },
    { no: 8, points: 12, type: '状态机', intro: '序列检测器设计（每小题 4 分）',
      parts: [
        { label: '(1)', points: 4, kind: 'output', prompt: '设计一个 Mealy 型序列检测器，检测输入序列中的「101」（允许重叠）。请列出状态（用 S0 表示尚未匹配、S1 表示已收到 1、S2 表示已收到 10）。',
          answer: 'S0 --1--> S1；S1 --0--> S2；S2 --1--> S1 且输出 1；其余转移回 S0 或按重叠规则处理',
          explain: '重叠检测的关键是 S2 收到 1 后不能回 S0，而应回到 S1（这个 1 同时是下一个 101 的开头），输出在 S2→S1 这一转移上为 1。' },
        { label: '(2)', points: 4, kind: 'output', prompt: '把上述 Mealy 机改成 Moore 机，需要增加什么？输出在哪个状态为 1？',
          answer: '增加一个状态 S3 表示「已收到 101」，输出在 S3 为 1，且 S3 收到 1 时回 S1',
          explain: 'Moore 输出只与状态有关，所以必须把「刚刚检测到」这件事固化成状态；代价是输出比 Mealy 晚一拍。' },
        { label: '(3)', points: 4, kind: 'choice', prompt: '若采用独热编码，4 个状态需要几个触发器？',
          options: [{ text: '2 个' }, { text: '4 个', correct: true }, { text: '8 个' }, { text: '1 个' }],
          explain: '独热编码每个状态用一位表示，n 个状态需要 n 个触发器；二进制编码只需 ceil(log2 n) 个。' }
      ] },
    { no: 9, points: 10, type: '代码填空', intro: '补全三段式状态机的 Verilog 代码（每空 2 分，共 5 空）',
      code: `module fsm (
  input  clk, rst_n, in,
  output reg out
);
  localparam S0 = 2'd0, S1 = 2'd1, S2 = 2'd2;
  reg [1:0] cur, nxt;

  always @(posedge clk or negedge rst_n)
    if (!rst_n) cur <= S0;
    else        cur <= ______(1)______;

  always @(*) begin
    nxt = cur;
    case (cur)
      S0: nxt = in ? S1 : S0;
      S1: nxt = in ? S1 : S2;
      S2: nxt = in ? ______(2)______ : S0;
      default: nxt = S0;
    endcase
  end

  always @(*) begin
    out = 1'b0;
    if (cur == ______(3)______ && in) out = 1'b1;
  end
endmodule`,
      codeTitle: '三段式状态机模板',
      parts: [
        { label: '(1)', points: 2, kind: 'fill', prompt: '空 (1)：状态寄存器的更新语句应填 ______。', answer: 'nxt', explain: '时序段只负责把次态打进当前态，写作 cur <= nxt。' },
        { label: '(2)', points: 2, kind: 'fill', prompt: '空 (2)：S2 收到 1 后应转到哪个状态？（填状态名）', answer: 'S1', explain: '允许重叠检测：刚收到的 1 同时是下一个序列的开头，故回 S1。' },
        { label: '(3)', points: 2, kind: 'fill', prompt: '空 (3)：输出为 1 的条件是当前状态为 ______ 且输入为 1。', answer: 'S2', explain: 'Mealy 输出在 S2 且 in=1 时为 1，表示刚刚收齐 101。' },
        { label: '(4)', points: 2, kind: 'fill', prompt: '空 (4)：若改用 Moore 机，输出条件应只与 ______ 有关。', answer: '状态', explain: 'Moore 输出不依赖输入，只由当前状态决定，通常写成状态译码或状态寄存器输出。' },
        { label: '(5)', points: 2, kind: 'keywords', prompt: '写出两个可综合性检查点（各 1 分）。', answer: '状态机要有复位与 default 分支；输出不要用组合逻辑当时钟', explain: '复位保证上电进入合法态，default 防止非法状态锁死；组合输出当时钟会引入毛刺与新时钟域。' }
      ] },
    { no: 10, points: 8, type: '存储器', intro: '存储阵列（每小题 4 分）',
      parts: [
        { label: '(1)', points: 4, kind: 'output', prompt: '用 2K×4 的芯片构成 8K×8 的存储器，需要多少片？地址如何分配？',
          answer: '8 片：每 2 片位扩展成 2K×8，再用 4 组字扩展成 8K×8；低 11 位片内地址，高 2 位译码出 4 个片选',
          explain: '位扩展把 4 位凑成 8 位（2 片一组），字扩展把 2K 凑成 8K（4 组），共 8 片。低 11 位接所有芯片，高 2 位经 2–4 译码器产生组选。' },
        { label: '(2)', points: 4, kind: 'choice', prompt: 'DRAM 需要刷新的根本原因是：',
          options: [{ text: '地址线复用' }, { text: '存储电容的电荷会泄漏', correct: true }, { text: '读写速度太快' }, { text: '容量太大' }],
          explain: '电容不是理想器件，电荷会通过漏电流慢慢流失，几十毫秒后可能无法分辨 0 与 1，因此必须周期性地读出并重写。' }
      ] },
    { no: 11, points: 6, type: '计算题', intro: '时序计算（每小题 3 分）',
      parts: [
        { label: '(1)', points: 3, kind: 'fill', prompt: '触发器 Tco=2 ns、组合逻辑延迟 5 ns、Tsu=1 ns、时钟偏斜 0.5 ns，最高时钟频率约为 ______ MHz（填整数）。',
          answer: '117', explain: '最小周期 = 2 + 5 + 1 + 0.5 = 8.5 ns，频率 = 1/8.5 ns ≈ 117.6 MHz，取整 117。' },
        { label: '(2)', points: 3, kind: 'fill', prompt: '若把上述组合逻辑插入一级流水线，关键路径缩短为 3 ns，则最高频率约为 ______ MHz（忽略寄存器开销，填整数）。',
          answer: '154', explain: '周期 = 2 + 3 + 1 + 0.5 = 6.5 ns，频率 = 1/6.5 ns ≈ 153.8 MHz，取整 154。流水线把长路径切成两段，频率上升但增加了一拍延迟。' }
      ] },
    { no: 12, points: 4, type: '简答题', intro: '综合',
      parts: [
        { label: '', points: 4, kind: 'keywords', prompt: '列出至少三条本课强调的可综合编码规则，并各用一句话说明原因。',
          answer: '单一时钟加使能；always 块补全分支避免锁存器；组合与时序分开写；跨时钟域先同步；不用组合输出当时钟',
          explain: '这些规则共同指向两件事：让综合结果与仿真一致，让时序可分析。漏分支产生意外锁存器、组合时钟产生毛刺，都是「仿真对、上板错」的典型来源。' }
      ] }
  ]
});
