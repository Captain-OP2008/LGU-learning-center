/* =====================================================================
 * site.js · 站点配置（window.CSC_SITE）
 * 所有展示文案集中在这里；换课程只需改本文件与 data/ 下的章节文件。
 * ===================================================================== */
window.CSC_SITE = {
  id: 'csc3050',
  short: 'CSC3050',
  name: '计算机组成与系统编程',
  en: 'Computer Organization and Systems Programming',
  dept: '计算机科学',
  lang: 'c',
  langLabel: 'RISC-V / C',

  /* 首页启动终端 */
  mode: 'STATIC · 阅读型',
  bootHead: 'CSC3050 // OBSERVATORY',
  bootLog: [
    '> mounting course partition ... CSC3050',
    '> loading 8 modules ... bits → isa → datapath → pipe → cache',
    '> calibrating glossary, quiz bank & cache simulator ...',
    '> all systems nominal. welcome aboard.'
  ],

  /* 首页主视觉文案 */
  tagline: '把机器拆到指令，再装回系统。',
  missionEn: 'CSC3050 · 8 MODULES',
  missionTitle: '从一条指令<br><em>看懂整台计算机</em>',
  lede: '从晶体管与 0/1 出发，经 RISC-V 指令、数据通路、流水线与 Cache，一路走到链接加载与多核性能。每章配正文、对比表、自检清单、题库与可动手的项目。',
  searchPlaceholder: 'QUERY // 搜索指令、Cache、链接与术语',

  /* 资料库（path 相对 "CUHKSZ course" 目录，由 tools/check-content.js 校验存在性） */
  resBase: '../../resources/CSC3050/',
  resources: {
    note: '以下文件来自 CUHKSZ CSC3050 课程资料目录，按主题分组；点击在新标签页打开原始 PPT / PDF / ZIP，本站不复制文件。',
    groups: [
      {
        name: '课程信息与环境',
        items: [
          { title: 'Course Organization：大纲、考核与学术规范', path: '学习资料/CSC3050_Course_Organization.pptx', kind: 'pptx', note: '5% 出勤 + 25% 随堂测验 + 45% 四个 Project + 25% 开卷期末' },
          { title: 'Docker 实验环境搭建', path: '学习资料/CSC3050_Assessment_Scheme_Environment_Setup_by_Docker.pdf', kind: 'pdf', note: 'bomblab 与 Project 3/4 的 RISC-V 工具链都在容器里' },
          { title: 'TUT1 Course Guide', path: '作业习题/CSC3050_Tutorial_CSC3050_TUT1_Course_Guide.pptx', kind: 'pptx', note: '第一次习题课：工具链、提交方式与评分口径' }
        ]
      },
      {
        name: '数据表示与指令系统',
        items: [
          { title: 'Chapter 1：Computer Abstraction and Technology', path: '学习资料/CSC3050_Chapter_1_Computer_Abstraction_and_Technology.pptx', kind: 'pptx', note: '八个伟大思想、性能公式与技术趋势' },
          { title: 'Chapter 2.1：Data Representation 与 ISA 预览', path: '学习资料/CSC3050_Chapter_2_1_Data_Representation_and_RISC_V_ISA_Preview.pptx', kind: 'pptx', note: '进制、补码、符号扩展、大小端与 RV32I 速览' },
          { title: 'Chapter 2.2：RISC-V ISA', path: '学习资料/CSC3050_Chapter_2_2_RISC_V_ISA.pptx', kind: 'pptx', note: 'R/I/S/B/U/J 格式、寻址、伪指令与 CSR' },
          { title: 'RISC-V Calling Convention', path: '学习资料/CSC3050_Calling_Convensions_RISC_V_calling_convention_Caller_Sallee_saved_registers.pptx', kind: 'pptx', note: '栈帧、caller-saved 与 callee-saved 的取舍' }
        ]
      },
      {
        name: '处理器、流水线与调度',
        items: [
          { title: 'Chapter 3：ALU Operations', path: '学习资料/CSC3050_Chapter_3_ALU_Operations.pptx', kind: 'pptx', note: '加减乘除、逻辑运算与 ALU 控制信号' },
          { title: 'Chapter 3：Floating Point Numbers and Operations', path: '学习资料/CSC3050_Chapter_3_Floating_Point_Numbers_and_Operations.pptx', kind: 'pptx', note: 'IEEE 754、舍入模式与浮点加减乘' },
          { title: 'Chapter 4：Datapath（上）', path: '学习资料/CSC3050_Chapter_4_Data_Path_part_1.pptx', kind: 'pptx', note: '单周期数据通路、控制信号与关键路径' },
          { title: 'Chapter 4：Control', path: '学习资料/CSC3050_Chapter_4_Control.pptx', kind: 'pptx', note: '主控与 ALU 控制的真值表写法' },
          { title: 'Chapter 4：Pipelined Implementation', path: '学习资料/CSC3050_Chapter_4_Pipelined_Implementation.pptx', kind: 'pptx', note: '五级流水、流水寄存器与吞吐率' },
          { title: 'Chapter 4：Pipeline Hazards', path: '学习资料/CSC3050_Chapter_4_Pipeline_Hazards.pptx', kind: 'pptx', note: '结构/数据/控制冒险、forwarding、分支预测' },
          { title: 'Chapter 4：Code Scheduling', path: '学习资料/CSC3050_Chapter_4_Code_Scheduling.pptx', kind: 'pptx', note: '编译器如何重排指令以避免 load-use 停顿' }
        ]
      },
      {
        name: '存储层次与虚拟内存',
        items: [
          { title: 'Chapter 5：Memory Hierarchy', path: '学习资料/CSC3050_Chapter_5_Memory_Hierarchy.pptx', kind: 'pptx', note: 'SRAM/DRAM、直接映射、组相联、AMAT 与写策略' },
          { title: 'Chapter 5.6–5.7：Virtual Memory', path: '学习资料/CSC3050_Chapter_5_section_5_6_and_5_7_VM_and_VM.pptx', kind: 'pptx', note: '页表、TLB、缺页与地址翻译' },
          { title: 'Review Quiz：Cache 专题', path: '考试资料/CSC3050_Review_Review_quiz_questions_on_caches.pptx', kind: 'pptx', note: '考前刷 Cache 计算题的题源' }
        ]
      },
      {
        name: '作业与四个 Project',
        items: [
          { title: 'Project 1：Assembly Programming（说明）', path: '作业习题/CSC3050_Assessment_Scheme_Project_1.pdf', kind: 'pdf', note: '用 RV32I 汇编完成矩阵/字符串等任务' },
          { title: 'Project 1：起始代码包', path: '作业习题/CSC3050_Assessment_Scheme_csc3050_project1.zip', kind: 'zip', note: '含骨架、测试脚本与提交模板' },
          { title: 'Project 2：Bomb Lab（说明）', path: '作业习题/CSC3050_Assessment_Scheme_CSC3050_Project_2.pdf', kind: 'pdf', note: '用 gdb 反汇编拆六个炸弹阶段' },
          { title: 'Bomb Lab 提示', path: '作业习题/CSC3050_Assessment_Scheme_bomblab_hint.pdf', kind: 'pdf', note: '卡住时先看提示，不要直接搜答案' },
          { title: 'Bomb Lab 预备习题课', path: '作业习题/CSC3050_Tutorial_bomblab_prep_tut.pdf', kind: 'pdf', note: 'gdb 断点、寄存器查看与 string 对比' },
          { title: 'Project 3：流水线 RISC-V 模拟器', path: '作业习题/CSC3050_Assessment_Scheme_CSC3050_Project_3.pdf', kind: 'pdf', note: '实现五级流水与 hazard 处理' },
          { title: 'Project 4：数据 Cache 模拟器', path: '作业习题/CSC3050_Assessment_Scheme_CSC3050_Project4.pdf', kind: 'pdf', note: '实现直接映射/组相联与 LRU 替换' },
          { title: 'Project 4：Cache Simulation 习题课', path: '作业习题/CSC3050_Tutorial_Project_4_Cache_Simulation_T.pptx', kind: 'pptx', note: '地址拆分与命中率统计的 walkthrough' }
        ]
      },
      {
        name: '考试与复习',
        items: [
          { title: 'Final Review', path: '考试资料/CSC3050_Review_Final_Review.pptx', kind: 'pptx', note: '期末范围、重点题型与公式清单' },
          { title: 'Last Semester Final', path: '考试资料/CSC3050_Review_Last_semesters_Final.docx', kind: 'docx', note: '上一届期末题，最适合限时模考' },
          { title: 'First Online Quiz', path: '考试资料/CSC3050_FirstOnLineQuiz.pptx', kind: 'pptx', note: '第一次线上测验：数据表示与 ISA' },
          { title: 'Second Group Quiz', path: '考试资料/CSC3050_SecondGroupQuiz.pptx', kind: 'pptx', note: '第二次小组测验：处理器与流水线' },
          { title: '考场规则', path: '考试资料/CSC3050_Review_Rules_to_be_Observed_by_Candidates_at_Examination_Centre_考场考试规则.pdf', kind: 'pdf', note: '开卷但不可使用电子设备，提前确认可带材料' }
        ]
      }
    ]
  },

  /* 关于页的信息行 */
  aboutLines: [
    ['课程', '计算机组成与系统编程（Computer Organization and Systems Programming）'],
    ['教材', 'Patterson & Hennessy《Computer Organization and Design》RISC-V Edition；参考 CS:APP'],
    ['结构', '8 章正文 · 56 题分章题库 · 100 分模拟卷 · 4 个实战项目 · 速查表 · 资料库'],
    ['建议', '先读第 0 章建立地图；第 1–2 章打地基，第 3–5 章是课程主干，第 6–7 章负责把系统串起来。']
  ],

  /* 速查表：tabs 结构 [{ label, blocks:[...] }] */
  cheat: [
    {
      label: '数据与指令',
      blocks: [
        { t: 'table', head: ['概念', '要点', '常见坑'], rows: [
          ['n 位补码', '范围 −2^(n−1) … 2^(n−1)−1；减法 = 加相反数', '最小值取负仍溢出；C 中有符号溢出是 UB'],
          ['符号扩展', '复制最高位到高位；零扩展只用于无符号', '把 lb 的结果当无符号用'],
          ['移位', 'sll 左移补 0；srl 右移补 0；sra 右移补符号位', '对负数用 >> 期望得到除法结果（C 实现定义）'],
          ['对齐', '字地址是 4 的倍数，双字是 8 的倍数', '结构体里 char 后直接放 int 造成 padding']
        ], caption: 'RV32I 的整数只有 32 位：先问「这是位模式还是数值」，再谈运算' },
        { t: 'table', head: ['格式', '字段布局（从高到低）', '典型指令'], rows: [
          ['R', 'funct7 | rs2 | rs1 | funct3 | rd | opcode', 'add, sub, and, or, slt'],
          ['I', 'imm[11:0] | rs1 | funct3 | rd | opcode', 'addi, lw, jalr'],
          ['S', 'imm[11:5] | rs2 | rs1 | funct3 | imm[4:0] | opcode', 'sw, sb, sh'],
          ['B', 'imm[12|10:5] | rs2 | rs1 | funct3 | imm[4:1|11] | opcode', 'beq, bne, blt, bge'],
          ['U', 'imm[31:12] | rd | opcode', 'lui, auipc'],
          ['J', 'imm[20|10:1|11|19:12] | rd | opcode', 'jal']
        ], caption: 'opcode 永远在低 7 位，rd 在 7–11，rs1 在 15–19，rs2 在 20–24' },
        { t: 'code', lang: 'asm', title: '数组求和 + 调用约定骨架', code: [
          '# int sum(int *a, int n)  —— a0 = a, a1 = n',
          'sum:',
          '    addi sp, sp, -16      # 开栈帧',
          '    sw   ra, 12(sp)       # 保存返回地址（callee-saved 责任）',
          '    sw   s0, 8(sp)',
          '    mv   s0, a0           # s0 = 当前指针',
          '    mv   t0, a1           # t0 = 剩余个数',
          '    li   t1, 0            # t1 = 累加和',
          'loop:',
          '    beq  t0, x0, done',
          '    lw   t2, 0(s0)',
          '    add  t1, t1, t2',
          '    addi s0, s0, 4',
          '    addi t0, t0, -1',
          '    j    loop',
          'done:',
          '    mv   a0, t1',
          '    lw   s0, 8(sp)',
          '    lw   ra, 12(sp)',
          '    addi sp, sp, 16',
          '    ret'
        ] },
        { t: 'callout', kind: 'tip', title: '写汇编前先问三句', html: '① 这个值在调用前后还要用吗？要，就放 <code>s0–s11</code> 或栈上。② 参数超过 8 个怎么办？第 9 个起放栈上。③ 返回值放哪？<code>a0/a1</code>。把这三句答完，栈帧就不会写错。' }
      ]
    },
    {
      label: '处理器与流水',
      blocks: [
        { t: 'table', head: ['阶段', '做什么', '用到的部件'], rows: [
          ['IF', 'PC → 指令存储器，读 32 位指令，PC+4', 'PC、IMEM、加法器'],
          ['ID', '译码、读寄存器、生成立即数', '寄存器堆、立即数单元'],
          ['EX', 'ALU 运算 / 计算地址 / 比较分支', 'ALU、ALU 控制'],
          ['MEM', '读或写数据存储器', 'DMEM'],
          ['WB', '把 ALU 或存储器结果写回 rd', '寄存器堆写端口']
        ], caption: '单周期是一条指令占一个长周期；流水是五条指令各占一个短周期的一格' },
        { t: 'p', html: '<b>CPU 时间 = 指令数 × CPI × 时钟周期</b>。流水线不减少指令数，也不把单条指令延迟缩短到 1/5；它把<b>吞吐率</b>提高到接近每周期一条，理想加速比等于级数，实际被最慢一级、填充/排空与冒险吃掉一部分。' },
        { t: 'table', head: ['冒险', '典型触发', '解决'], rows: [
          ['结构', '同一周期争用同一硬件（如单存储器）', '分开 IMEM/DMEM、加端口、停顿'],
          ['数据 RAW', 'add x1,… 紧跟 sub …,x1', 'forwarding；load-use 必须停顿 1 拍'],
          ['控制', 'beq/jalr 改变 PC', 'flush、预测不跳、BTB、动态预测']
        ], caption: '检测 forwarding 的条件：EX/MEM.rd == ID/EX.rs 且 RegWrite=1 且 rd≠x0' },
        { t: 'code', lang: 'c', title: '流水线 CPI 速算', code: [
          '/* 假设：20% 分支，其中 60% 跳转；分支在 EX 判定，',
          ' * 预测不跳，猜错 flush 2 条；load 占 25%，其中 30% 紧跟 use。 */',
          'double branch_penalty = 0.20 * 0.60 * 2;   /* 0.24 */',
          'double load_stall     = 0.25 * 0.30 * 1;   /* 0.075 */',
          'double cpi = 1 + branch_penalty + load_stall;',
          'printf("CPI = %.3f, speedup vs 5-cycle = %.2f\\n",',
          '       cpi, 5.0 / cpi);'
        ] }
      ]
    },
    {
      label: '存储层次',
      blocks: [
        { t: 'table', head: ['量', '公式', '备注'], rows: [
          ['地址位数', 'log2(容量)（按字节编址）', '32 位地址空间 = 4 GiB'],
          ['块内偏移', 'log2(块大小)', '块 64B → 6 位'],
          ['组索引', 'log2(组数) = log2(容量 / (块大小 × 相联度))', '直接映射时组数 = 行数'],
          ['标记', '地址位数 − 索引 − 偏移', '有效位另算，不占地址位'],
          ['AMAT', '命中时间 + 缺失率 × 缺失代价', '多级 Cache 逐级套公式']
        ], caption: '先把地址拆成 tag | index | offset，再谈命中；顺序反了必错' },
        { t: 'p', html: '<b>写策略</b>：write-through 每次写都到下一级，简单但流量大；write-back 只在替换时写回，需要 dirty 位。写缺失时 write-allocate 先把块取进来（配合 write-back），no-write-allocate 直接写下一级（常配 write-through）。考试里先看题目给的是哪种组合，再决定是否产生一次读。' },
        { t: 'table', head: ['结构', '组数', '每组的行', '冲突特点'], rows: [
          ['直接映射', '行数', '1', '冲突最多，硬件最省'],
          ['N 路组相联', '行数 / N', 'N', '折中；N=行数即全相联'],
          ['全相联', '1', '行数', '冲突最少，比较器最贵']
        ], caption: '替换只在同一组内发生；LRU 要维护每组的访问顺序' },
        { t: 'callout', kind: 'warn', title: '三个高频错误', html: '① 把「块大小」当成「Cache 容量」；② 忘记有效位，冷启动第一次访问必然 miss；③ 算 AMAT 时把缺失代价也乘了命中时间。正确写法：<code>AMAT = hit_time + miss_rate × miss_penalty</code>。' }
      ]
    },
    {
      label: '链接与性能',
      blocks: [
        { t: 'table', head: ['ELF 段', '内容', '谁关心'], rows: [
          ['.text', '机器指令', '取指、链接重定位'],
          ['.data', '已初始化全局/静态变量', '加载时从文件复制'],
          ['.bss', '未初始化全局/静态变量', '只记录大小，加载时清零'],
          ['.rodata', '字符串常量、跳转表', '只读，可共享'],
          ['.symtab / .rela', '符号表与重定位表', '链接器（-g 时保留调试信息）']
        ], caption: '局部变量在栈上，malloc 的内存在堆上，都不占 ELF 的 .data/.bss' },
        { t: 'code', lang: 'bash', title: '从源文件到进程', code: [
          'gcc -E main.c -o main.i        # 预处理：展开宏与头文件',
          'gcc -S main.i -o main.s        # 编译：生成汇编',
          'gcc -c main.s -o main.o        # 汇编：生成可重定位目标文件',
          'gcc main.o util.o -o app       # 链接：合并段、解析符号、重定位',
          './app                          # 加载：映射段、建栈、跳到 _start'
        ] },
        { t: 'table', head: ['性能量', '公式', '用途'], rows: [
          ['CPU 时间', 'IC × CPI × T_clk', '判断该减指令、减 CPI 还是提频'],
          ['加速比', 'T_old / T_new', '优化前后对比'],
          ['Amdahl', '1 / ((1−f) + f/s)', '判断「只优化一部分」的上限'],
          ['能效', '性能 / 功率', '多核与 DVFS 时代的硬约束']
        ], caption: 'f 是可优化部分占比，s 是该部分的加速倍数；s→∞ 时上限是 1/(1−f)' },
        { t: 'callout', kind: 'exam', title: '并行三问', html: '① 并行粒度是什么（指令 / 数据 / 线程 / 进程）？② 共享数据靠什么保持一致（锁、原子操作、缓存一致性协议）？③ 扩展性受什么限制（Amdahl、通信、内存带宽、频率墙）？三问答全，性能题就不会只写一句「多核更快」。' }
      ]
    }
  ]
};
