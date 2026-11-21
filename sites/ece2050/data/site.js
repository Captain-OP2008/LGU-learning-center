/* =====================================================================
 * site.js · 站点配置（window.CSC_SITE）
 * 所有展示文案集中在这里；换课程只需改本文件与 data/ 下的章节文件。
 * ===================================================================== */
window.CSC_SITE = {
  id: 'ece2050',
  short: 'ECE2050',
  name: '数字逻辑设计',
  en: 'Digital Logic Design',
  dept: '电子与信息工程',
  lang: 'text',
  langLabel: '数字电路',

  /* 首页启动终端 */
  mode: 'STATIC · 阅读型',
  bootHead: 'ECE2050 // LOGIC LAB',
  bootLog: [
    '> mounting course partition ... ECE2050',
    '> loading 8 modules · 56 quiz items · 1 mock exam',
    '> calibrating karnaugh maps & timing diagrams ...',
    '> synthesis complete. ready to build.'
  ],

  /* 首页主视觉文案 */
  tagline: '从两个开关到一台状态机，把数字逻辑读成一条能走通的路。',
  missionEn: 'ECE2050 · 8 MODULES · 1 SEMESTER',
  missionTitle: '从 0 与 1 开始<br><em>数字逻辑设计 全掌握</em>',
  lede: '七章正文按「表示 → 化简 → 组合 → 时序 → 系统」推进：每章配真值表、卡诺图、时序图与可综合 Verilog，结尾有自检清单；题库、模拟卷与三个实战项目负责把纸面知识落到板上。',
  searchPlaceholder: 'QUERY // 搜索章节、术语、题目与速查表',

  /* 资料库（path 相对 resBase，由 tools/check-content.js 校验存在性） */
  resBase: '../../resources/ECE2050/',
  resources: {
    note: '收录 ECE2050 的讲义、作业与解答、历年试卷与 Tutorial 材料；文件名保持原始命名，点击后用系统默认程序打开。',
    groups: [
      {
        name: '讲义与参考书',
        note: '按章节顺序排列。第 1–11 章覆盖从数制到存储阵列的全部内容，Course Outline 说明考核与进度。',
        items: [
          { title: '课程大纲 Course Outline', path: '学习资料/ECE2050_Lecture_Notes_Course_Outline.pdf', kind: 'pdf', note: '评分构成、周次安排与实验要求' },
          { title: 'Chapter 1 · 导论与基本概念', path: '学习资料/ECE2050_Lecture_Notes_Chapter_1_Introductory_Concepts.pdf', kind: 'pdf', note: '数字系统、抽象层次与设计流程' },
          { title: 'Chapter 2 · 数制与编码', path: '学习资料/ECE2050_Lecture_Notes_Chapter_2_Number_Systems.pdf', kind: 'pdf', note: '进制转换、补码、BCD 与格雷码' },
          { title: 'Chapter 3 · 逻辑门', path: '学习资料/ECE2050_Lecture_Notes_Chapter_3_Logic_Gates.pdf', kind: 'pdf', note: '逻辑电平、门符号与真值表' },
          { title: 'Chapter 4 · 布尔代数与化简', path: '学习资料/ECE2050_Lecture_Notes_Chapter_4_Boolean_Algebra_and_Logic_Simplification.pdf', kind: 'pdf', note: '定理、标准形与卡诺图' },
          { title: 'Chapter 5 · 组合逻辑设计', path: '学习资料/ECE2050_Lecture_Notes_Chapter_5_Combinational_Logic_Design.pdf', kind: 'pdf', note: '从真值表到门级实现的设计流程' },
          { title: 'Chapter 6 · 组合逻辑模块', path: '学习资料/ECE2050_Lecture_Notes_Chapter_6_Combinational_Building_Blocks.pdf', kind: 'pdf', note: '加法器、译码器、编码器与 MUX' },
          { title: 'Chapter 7 · 时序逻辑设计', path: '学习资料/ECE2050_Lecture_Notes_Chapter_7_Sequential_Logic_Design.pdf', kind: 'pdf', note: '锁存器、触发器与时序约束' },
          { title: 'Chapter 8 · 移位寄存器', path: '学习资料/ECE2050_Lecture_Notes_Chapter_8_Shift_Registers.pdf', kind: 'pdf', note: 'SIPO／PISO 与串并转换' },
          { title: 'Chapter 9 · 有限状态机', path: '学习资料/ECE2050_Lecture_Notes_Chapter_9_Finite_State_Machine.pdf', kind: 'pdf', note: '状态图、状态表与编码' },
          { title: 'Chapter 10 · 计数器', path: '学习资料/ECE2050_Lecture_Notes_Chapter_10_Counters.pdf', kind: 'pdf', note: '同步计数、任意模值与级联' },
          { title: 'Chapter 11 · 存储器与逻辑阵列', path: '学习资料/ECE2050_Lecture_Notes_Chapter_11_Memory_&_Logic_Arrays.pdf', kind: 'pdf', note: 'SRAM／DRAM、ROM 与 FPGA' },
          { title: '参考手册 Reference', path: '学习资料/ECE2050_Lecture_Notes_Reference.pdf', kind: 'pdf', note: '常用公式、器件引脚与符号速查' },
          { title: '教材 Textbook', path: '学习资料/ECE2050_Lecture_Notes_Textbook.pdf', kind: 'pdf', note: '课程指定的主教材节选' }
        ]
      },
      {
        name: '作业与解答',
        note: 'HW1–HW8 按周布置；解答文件命名不统一，已在每条注明对应哪次作业。建议先独立完成再对照。',
        items: [
          { title: 'HW1', path: '作业习题/ECE2050_Homework_HW1.pdf', kind: 'pdf', note: '数制与进制转换' },
          { title: 'HW1 解答', path: '作业习题/ECE2050_Solution_folder_HW1_Solution.pdf', kind: 'pdf', note: '含逐步换算过程' },
          { title: 'HW2', path: '作业习题/ECE2050_Homework_HW2.pdf', kind: 'pdf', note: '补码运算与溢出' },
          { title: 'HW2 解答', path: '作业习题/ECE2050_Solution_folder_HW2Solution.pdf', kind: 'pdf', note: '溢出判据的两种写法' },
          { title: 'HW3', path: '作业习题/ECE2050_Homework_HW3.pdf', kind: 'pdf', note: '布尔代数与门级实现' },
          { title: 'HW3 解答', path: '作业习题/ECE2050_Solution_folder_Homework_3_ANSWER.pdf', kind: 'pdf', note: '定理化简的完整步骤' },
          { title: 'HW4', path: '作业习题/ECE2050_Homework_HW4.pdf', kind: 'pdf', note: '卡诺图化简' },
          { title: 'HW4 解答', path: '作业习题/ECE2050_Solution_folder_Homework4.pdf', kind: 'pdf', note: '圈法与无关项处理' },
          { title: 'HW5', path: '作业习题/ECE2050_Homework_HW5.pdf', kind: 'pdf', note: '组合逻辑模块' },
          { title: 'HW5 解答', path: '作业习题/ECE2050_Solution_folder_HW5_Sol.pdf', kind: 'pdf', note: '加法器与译码器设计' },
          { title: 'HW6', path: '作业习题/ECE2050_Homework_HW6.pdf', kind: 'pdf', note: '锁存器与触发器' },
          { title: 'HW6 解答', path: '作业习题/ECE2050_Solution_folder_HW6_Solution.pdf', kind: 'pdf', note: '波形分析与时序参数' },
          { title: 'HW7', path: '作业习题/ECE2050_Homework_HW7.pdf', kind: 'pdf', note: '计数器与移位寄存器' },
          { title: 'HW7 解答', path: '作业习题/ECE2050_Solution_folder_Homework7_Solution.pdf', kind: 'pdf', note: '模值设计与级联' },
          { title: 'HW8', path: '作业习题/ECE2050_Homework_HW8.pdf', kind: 'pdf', note: '状态机与存储器' },
          { title: 'HW8 解答', path: '作业习题/ECE2050_Solution_folder_Homework8_Solution.pdf', kind: 'pdf', note: '状态图与状态表' },
          { title: '课程项目说明', path: '作业习题/ECE2050_Homework_ECE2050Projectv.pdf', kind: 'pdf', note: '期末项目的需求、评分与提交要求' }
        ]
      },
      {
        name: '试卷与 Tutorial',
        note: 'Midterm 与 Final 历年卷，带 Solution 的版本可用于自测后对答案；Tutorial 覆盖 Verilog、Vivado 与习题讲解。',
        items: [
          { title: 'Midterm 2023（含解答）', path: '考试资料/ECE2050_Tutorial_materials_Midterm2023With_Solution.pdf', kind: 'pdf', note: '数制、布尔代数与组合逻辑' },
          { title: 'Midterm 2024（含解答）', path: '考试资料/ECE2050_Tutorial_materials_Midterm2024With_Solution.pdf', kind: 'pdf', note: '含卡诺图与模块设计' },
          { title: 'Midterm 2025（含解答）', path: '考试资料/ECE2050_Tutorial_materials_Midterm2025With_Solution.pdf', kind: 'pdf', note: '最新一次期中，题型最接近' },
          { title: 'Final 2021（含解答）', path: '考试资料/ECE2050_Tutorial_materials_Final2021With_Solution.pdf', kind: 'pdf', note: '覆盖全学期，含时序分析' },
          { title: 'Final 2022 Spring（含解答）', path: '考试资料/ECE2050_Tutorial_materials_Final2022SWith_Solution.pdf', kind: 'pdf', note: '状态机与存储器比重大' },
          { title: 'Final 2023', path: '考试资料/ECE2050_Tutorial_materials_Final2023.pdf', kind: 'pdf', note: '无解答，适合限时自测' },
          { title: 'Final 2024', path: '考试资料/ECE2050_Tutorial_materials_Final2024.pdf', kind: 'pdf', note: '无解答，题型与 2023 相近' },
          { title: 'Tutorial 1', path: '作业习题/ECE2050_Tutorial_materials_Tutorial_1.pptx', kind: 'pptx', note: '数制与编码习题课' },
          { title: 'Tutorial 2', path: '作业习题/ECE2050_Tutorial_materials_Tutorial_2.pptx', kind: 'pptx', note: '布尔代数与化简' },
          { title: 'Tutorial 3', path: '作业习题/ECE2050_Tutorial_materials_Tutorial_3.pdf', kind: 'pdf', note: '门级实现与卡诺图练习' },
          { title: 'Tutorial 4', path: '作业习题/ECE2050_Tutorial_materials_Tutorial_4.pdf', kind: 'pdf', note: '组合逻辑模块讲解' },
          { title: 'Tutorial 5', path: '作业习题/ECE2050_Tutorial_materials_Tutorial_5.pptx', kind: 'pptx', note: '触发器与波形分析' },
          { title: 'Tutorial 6 · Vivado 入门', path: '作业习题/ECE2050_Tutorial_materials_Tutorial6_Vivado_Tut.pptx', kind: 'pptx', note: '建工程、写约束、下载比特流' },
          { title: 'Tutorial 6 · Verilog 入门', path: '作业习题/ECE2050_Tutorial_materials_Tutorial6_Verilog_Tut.pptx', kind: 'pptx', note: '模块、assign 与 always 的基本写法' },
          { title: 'Tutorial 6 · VHDL（参考）', path: '作业习题/ECE2050_Tutorial_materials_Tutorial6_VHDL_Tut_for_reference.pptx', kind: 'pptx', note: '仅作对照，课程以 Verilog 为主' },
          { title: 'Tutorial 7', path: '作业习题/ECE2050_Tutorial_materials_Tutorial7.pdf', kind: 'pdf', note: '计数器与分频' },
          { title: 'Tutorial 8', path: '作业习题/ECE2050_Tutorial_materials_Tutorial8.pdf', kind: 'pdf', note: '状态机设计' },
          { title: 'Tutorial 9', path: '作业习题/ECE2050_Tutorial_materials_Tutorial9.pptx', kind: 'pptx', note: '存储器与地址译码' },
          { title: 'Tutorial 10', path: '作业习题/ECE2050_Tutorial_materials_Tutorial10.pdf', kind: 'pdf', note: '综合复习与样题' }
        ]
      }
    ]
  },

  /* 关于页的信息行 */
  aboutLines: [
    ['课程', '数字逻辑设计（Digital Logic Design），ECE2050'],
    ['内容', '数制与编码 · 布尔代数 · 卡诺图 · 组合模块 · 触发器 · 状态机 · 存储器'],
    ['结构', '8 章正文 · 56 道分章题 · 1 套模拟卷 · 3 个实战项目 · 4 页速查表 · 资料库'],
    ['建议', '先读第 0 章建立地图；每章读完做内嵌速测，再用自检清单和题库查漏，最后用模拟卷限时自测。']
  ],

  /* 速查表：tabs 结构 [{ label, blocks:[...] }] */
  cheat: [
    {
      label: '布尔代数',
      blocks: [
        {
          t: 'table',
          head: ['定律', '与形式', '或形式', '用途'],
          rows: [
            ['同一律', 'A · 1 = A', 'A + 0 = A', '去掉常量'],
            ['零律', 'A · 0 = 0', 'A + 1 = 1', '短路整项'],
            ['幂等律', 'A · A = A', 'A + A = A', '合并重复项'],
            ['互补律', 'A · A&#39; = 0', 'A + A&#39; = 1', '消去变量'],
            ['交换律', 'AB = BA', 'A + B = B + A', '调整顺序'],
            ['结合律', '(AB)C = A(BC)', '(A + B) + C = A + (B + C)', '改变分组'],
            ['分配律', 'A(B + C) = AB + AC', 'A + BC = (A + B)(A + C)', '展开与提取'],
            ['吸收律', 'A(A + B) = A', 'A + AB = A', '吃掉多余项'],
            ['消去律', 'A(A&#39; + B) = AB', 'A + A&#39;B = A + B', '跳过反变量'],
            ['德摩根', '(AB)&#39; = A&#39; + B&#39;', '(A + B)&#39; = A&#39; · B&#39;', '取反与门变换']
          ],
          caption: '背不下全部时，至少记牢吸收律、消去律与德摩根——化简题里八成靠这三条'
        },
        {
          t: 'callout',
          kind: 'tip',
          title: '化简的三条经验',
          html: '<b>一、</b>先看能不能提出公因子，再看能不能用吸收律吃掉一项；<b>二、</b>遇到「一个变量与它的反变量同时出现」优先想消去律；<b>三、</b>德摩根把「大非号」拆开时，运算符要互换、每个变量都要取反，漏一个就错。'
        },
        {
          t: 'table',
          head: ['标准形', '定义', '记号', '什么时候用'],
          rows: [
            ['最小项之和（SOP）', '每个乘积项包含全部变量（原变量或反变量）', 'Σm(编号)', '从真值表直接写出，再化简'],
            ['最大项之积（POS）', '每个和项包含全部变量，输出为 0 的行', 'ΠM(编号)', '圈 0 更方便，或需要或与门实现'],
            ['最简与或式', '乘积项最少、每项变量最少', '—', '两级与或门实现'],
            ['最简或与式', '和项最少、每项变量最少', '—', '两级或与门实现，门数可能更少']
          ],
          caption: '标准形是唯一的，最简式不一定唯一；考试写最简式时要检查是否还能合并'
        }
      ]
    },
    {
      label: '卡诺图',
      blocks: [
        {
          t: 'table',
          head: ['规则', '说明', '常见错误'],
          rows: [
            ['格雷码排列', '行、列都按 00 01 11 10 排，相邻格只差一位', '按 00 01 10 11 排，导致「相邻」判断错'],
            ['圈的大小', '只能是 1、2、4、8……个 2 的幂个格子', '圈 3 个或 6 个格子'],
            ['圈要尽量大', '圈越大消掉的变量越多', '满足于二格圈，结果多出变量'],
            ['圈要尽量少', '覆盖所有 1 的前提下圈数最少', '同一个 1 被重复圈多次，门数增加'],
            ['可以跨边界', '左右、上下边界相邻，四角也相邻', '只在图内部圈，漏掉边界合并'],
            ['每圈至少一个新 1', '避免冗余圈', '圈了一个已被完全覆盖的组'],
            ['无关项按需用', 'd 可当 0 或 1，帮助圈变大', '把 d 全部圈进去，反而增加项']
          ],
          caption: '四变量图的四角（m0、m2、m8、m10）互相相邻，这是最容易漏的一组'
        },
        {
          t: 'table',
          head: ['四变量编号（A 为行高位，B 为行低位；C 为列高位，D 为列低位）', 'CD=00', 'CD=01', 'CD=11', 'CD=10'],
          rows: [
            ['AB=00', 'm0', 'm1', 'm3', 'm2'],
            ['AB=01', 'm4', 'm5', 'm7', 'm6'],
            ['AB=11', 'm12', 'm13', 'm15', 'm14'],
            ['AB=10', 'm8', 'm9', 'm11', 'm10']
          ],
          caption: '编号 = 8·A + 4·B + 2·C + 1·D；写表达式前先在图上标好变量顺序'
        },
        {
          t: 'callout',
          kind: 'warn',
          title: '从 K 图读 POS',
          html: '圈 0 得到的是 F&#39; 的最简与或式；对结果整体取反并用德摩根，才得到 F 的或与式。直接照 0 格写「和项相乘」时，0 对应的变量要取反——这一步最容易把极性写反。'
        }
      ]
    },
    {
      label: '时序电路',
      blocks: [
        {
          t: 'table',
          head: ['器件', '触发方式', '透明性', '典型用途'],
          rows: [
            ['SR 锁存器', '电平（使能）', '是', '最基础的双稳态，教学用'],
            ['D 锁存器', '电平（使能）', '是，使能期间 Q 跟随 D', '总线保持、避免毛刺的场合'],
            ['D 触发器', '边沿（上升或下降）', '否，只在沿采样', '寄存器、计数器、状态机'],
            ['寄存器', '边沿 + 使能', '否', '多位数据的暂存'],
            ['移位寄存器', '边沿', '否', '串并转换、延时打拍']
          ],
          caption: '「锁存器电平敏感、触发器边沿敏感」是这一章最常考的一句话'
        },
        {
          t: 'table',
          head: ['参数', '含义', '约束', '违反的后果'],
          rows: [
            ['Tsu 建立时间', '时钟沿前数据必须稳定的时长', 'Tco + Tlogic + Troute ≤ Tclk − Tsu − Tskew', '数据太晚到，采到旧值或亚稳态'],
            ['Th 保持时间', '时钟沿后数据必须继续保持的时长', 'Tco + Tlogic ≥ Th + Tskew', '新数据来得太早，冲掉正在采的值'],
            ['Tco 时钟到输出', '时钟沿到 Q 稳定的延迟', '出现在时序路径起点', '影响最大频率'],
            ['Tskew 时钟偏斜', '同一时钟到达不同触发器的时刻差', '越小越好', '压缩有效时序窗口']
          ],
          caption: '最高频率 fmax = 1 / (Tco + Tlogic + Tsu + Tskew)，分子里没有「线长」这一项，但线长通过 Tlogic 起作用'
        },
        {
          t: 'callout',
          kind: 'tip',
          title: '复位的三条实践',
          html: '<b>一、</b>异步复位、同步释放：复位有效可以不等时钟，撤销必须对齐时钟沿；<b>二、</b>复位只复位「状态」，不要用它复位数据通路的每一级（会增加扇出与布线压力）；<b>三、</b>仿真时给初值，综合后靠复位，不要指望寄存器上电是 0。'
        }
      ]
    },
    {
      label: 'Verilog 模板',
      blocks: [
        {
          t: 'code',
          lang: 'verilog',
          caption: '三段式状态机：时序段只更新 cur，组合段算 nxt，输出段单独写',
          code: `module fsm (
  input  clk, rst_n, in,
  output reg out
);
  localparam S0 = 2'd0, S1 = 2'd1, S2 = 2'd2;
  reg [1:0] cur, nxt;

  // 1) 状态寄存器
  always @(posedge clk or negedge rst_n)
    if (!rst_n) cur <= S0;
    else        cur <= nxt;

  // 2) 次态逻辑
  always @(*) begin
    nxt = cur;                 // 先给默认值，避免锁存器
    case (cur)
      S0: nxt = in ? S1 : S0;
      S1: nxt = in ? S1 : S2;
      S2: nxt = in ? S1 : S0;
      default: nxt = S0;
    endcase
  end

  // 3) 输出逻辑
  always @(*) begin
    out = 1'b0;
    if (cur == S2 && in) out = 1'b1;
  end
endmodule`
        },
        {
          t: 'table',
          head: ['写法', '可综合', '说明'],
          rows: [
            ['<code>assign y = a &amp; b;</code>', '是', '组合逻辑，连续赋值'],
            ['<code>always @(*) begin ... end</code>', '是', '组合逻辑，块内用阻塞赋值 ='],
            ['<code>always @(posedge clk) q &lt;= d;</code>', '是', '时序逻辑，块内用非阻塞赋值 &lt;='],
            ['<code>always @(posedge clk) q = q + 1;</code>', '不推荐', '时序块里用阻塞赋值，仿真与综合可能不一致'],
            ['<code>#10 a = ~a;</code>', '否', '延时只用于 testbench'],
            ['<code>initial begin ... end</code>', '否（除 FPGA 初值）', '综合忽略，仿真用'],
            ['<code>for</code> 循环（固定次数）', '是', '会被展开，次数必须是常量'],
            ['<code>while</code> 循环依赖输入', '否', '无法展开成固定硬件']
          ],
          caption: '判断标准很简单：这段代码能不能画成「确定数量」的门与触发器'
        },
        {
          t: 'callout',
          kind: 'warn',
          title: '三个高频综合陷阱',
          html: '<b>锁存器：</b>组合 always 块漏写 else 或 default，综合出意外锁存器；<b>位宽不匹配：</b>赋值两侧位宽不同会静默截断或补零，用 <code>localparam</code> 统一定义位宽；<b>组合输出当时钟：</b><code>always @(posedge gate_out)</code> 会引入毛刺与新时钟域，正确做法是单一时钟加使能。'
        }
      ]
    }
  ]
};
