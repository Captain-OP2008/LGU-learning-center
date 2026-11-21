/* =====================================================================
 * data/ch21.js · 第 21 章：图灵机与通用性
 * 职责：图灵机模型（带、读写头、状态、转移）、二进制加一与加法器、
 *       通用虚拟图灵机、识别/判定/可计算函数、通用性与 Church–Turing 论题。
 * 依据：教材 §5.2–§5.3。
 * 本章 Java 代码均用 JDK 25 编译运行核对；addTM.txt 为非 Java 静态阅读。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch21',
  num: '21',
  title: '图灵机与通用性',
  en: 'Turing Machines & Universality',
  goals: [
    '能说出图灵机与 DFA 的三点关键差别：可写、可左右移动、纸带无界',
    '能读懂一台图灵机的状态转移表，并手算一条输入串的完整轨迹',
    '能用数组把图灵机的转移表变成可运行的 Java 模拟程序',
    '能解释"通用图灵机"为什么等于"软件"：同一台机器读入不同程序',
    '能区分 recognizes 与 decides，并说明为什么 DFA 不需要这个区分',
    '能复述 Church–Turing 论题的内容与它的地位（论题而非定理）'
  ],
  kp: [
    { id: 'ch21-1', title: '图灵机的构成' },
    { id: 'ch21-2', title: '例：二进制加一' },
    { id: 'ch21-3', title: '状态表与二进制加法器' },
    { id: 'ch21-4', title: '用 Java 模拟图灵机' },
    { id: 'ch21-5', title: '识别、判定与可计算函数' },
    { id: 'ch21-6', title: '程序处理程序与通用图灵机' },
    { id: 'ch21-7', title: '通用性与 Church–Turing 论题' },
    { id: 'ch21-8', title: '通用性的边界' }
  ],
  blocks: [

    { t: 'callout', kind: 'why', html:
      '上一章的 DFA 有一个致命短板：它只能读、不能写，头只能向右，状态数固定。' +
      '所以它记不住"a 和 b 是否一样多"这种需要无界计数的信息。' +
      '图灵机（Turing machine）只改了三件小事：给机器一条<b>无限长的纸带</b>，' +
      '允许读写头<b>改写</b>格子里的符号，允许头<b>左右移动</b>。' +
      '这个改动小到可以画在一张纸上，却带来了两个惊人的结果：' +
      '一台机器可以模拟所有机器（通用性），以及有些问题<b>永远无法用算法解决</b>（不可判定性）。' +
      '本章先造出这台机器，再解释"通用"二字的分量；不可判定性留到下一章展开。'
    },

    { t: 'h', text: '一、图灵机的构成', id: 'ch21-1' },

    { t: 'p', html:
      '一台图灵机由四部分组成：一条向两端无限延伸的<b>纸带</b>（每个格子存一个符号，未写过的格子视为空白符号 <code>#</code>）；' +
      '一个可以在纸带上左右移动的<b>读写头</b>；一组有限个<b>状态</b>；以及一张<b>转移表</b>。' +
      '每个状态对每个符号<b>恰好</b>规定一条转移：下一步进入哪个状态、往当前格写入什么符号。' +
      '状态分四类：<b>R</b>（向右扫描）、<b>L</b>（向左扫描）、<b>H</b>（停机）、' +
      '<b>Yes/No</b>（接受/拒绝并停机）。'
    },

    { t: 'svg', maxW: 680, caption: '图灵机的纸带与读写头：头停在哪一格，就读哪一格、写哪一格；写入后按"下一个状态"的动作左右移动或停机。', html:
`<svg viewBox="0 0 700 260" role="img" aria-label="图灵机的纸带、读写头与状态">
  <defs>
    <marker id="ch21-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
      <path d="M0,0 L10,5 L0,10 z" fill="var(--accent)"/>
    </marker>
  </defs>
  <text x="20" y="26" font-size="13" font-weight="700" fill="var(--accent)">纸带（两端无限，未写过的格子是 #）</text>

  <rect x="70" y="60" width="60" height="60" fill="var(--surface2)" stroke="var(--line2)"/>
  <text x="100" y="98" font-size="20" text-anchor="middle" fill="var(--text)">#</text>
  <rect x="130" y="60" width="60" height="60" fill="var(--surface2)" stroke="var(--line2)"/>
  <text x="160" y="98" font-size="20" text-anchor="middle" fill="var(--text)">1</text>
  <rect x="190" y="60" width="60" height="60" fill="var(--surface2)" stroke="var(--line2)"/>
  <text x="220" y="98" font-size="20" text-anchor="middle" fill="var(--text)">0</text>
  <rect x="250" y="60" width="60" height="60" fill="var(--accentSoft)" stroke="var(--accent)" stroke-width="2"/>
  <text x="280" y="98" font-size="20" text-anchor="middle" fill="var(--text)">1</text>
  <rect x="310" y="60" width="60" height="60" fill="var(--surface2)" stroke="var(--line2)"/>
  <text x="340" y="98" font-size="20" text-anchor="middle" fill="var(--text)">1</text>
  <rect x="370" y="60" width="60" height="60" fill="var(--surface2)" stroke="var(--line2)"/>
  <text x="400" y="98" font-size="20" text-anchor="middle" fill="var(--text)">1</text>
  <rect x="430" y="60" width="60" height="60" fill="var(--surface2)" stroke="var(--line2)"/>
  <text x="460" y="98" font-size="20" text-anchor="middle" fill="var(--text)">#</text>
  <text x="490" y="98" font-size="20" fill="var(--text)">…</text>

  <line x1="280" y1="60" x2="280" y2="30" stroke="var(--accent)" stroke-width="2" marker-end="url(#ch21-arw)"/>
  <text x="300" y="24" font-size="12" fill="var(--text)">读写头</text>

  <rect x="70" y="170" width="150" height="54" rx="8" fill="var(--accentSoft)" stroke="var(--accent)" stroke-width="2"/>
  <text x="145" y="192" font-size="13" text-anchor="middle" fill="var(--text)">当前状态：1（L）</text>
  <text x="145" y="212" font-size="11" text-anchor="middle" fill="var(--text)">读到 1 → 写 0，向左移</text>

  <path d="M220,170 C300,140 330,120 300,105" fill="none" stroke="var(--accent)" stroke-width="1.6" marker-end="url(#ch21-arw)"/>
  <text x="330" y="150" font-size="12" fill="var(--text)">读/写</text>
</svg>` },

    { t: 'p', html:
      '转移的记法是 <code>读符号:写符号</code>，箭头指向下一个状态。为了少画箭头，教材约定：' +
      '如果写符号与读到的符号相同，可以省略冒号后的部分；如果既不写也不移动（自环），连箭头都可以省略；' +
      '从某状态出发、对"除已标出的符号外"的所有符号行为一致时，用一条无标签箭头表示。' +
      '另外注意一个容易读错的地方：<b>头怎么移动，取决于"下一个状态"是 R 还是 L</b>，' +
      '而不是当前状态——这正是下一节模拟程序要处理的关键细节。'
    },

    { t: 'h', text: '二、例：二进制加一', id: 'ch21-2' },

    { t: 'p', html:
      '先造一台最小的图灵机：给一个二进制数加一。思路和竖式加法一样：从最右端开始，' +
      '把末尾的 1 全部变成 0，再把遇到的第一个 0 变成 1；如果一路全是 1，就在最前面补一个 1。' +
      '机器用三个状态：<b>0 = R</b>（向右扫到末尾）、<b>1 = L</b>（向左回扫并进位）、<b>2 = H</b>（停机）。' +
      '字母表是 <code>0</code>、<code>1</code>、<code>#</code>。'
    },

    { t: 'table', caption: '二进制加一图灵机的转移表：每行一个状态，每列"读到某符号后"的下一状态与写符号', head: ['状态', '动作', '读 0', '读 1', '读 #'], rows: [
      ['0', 'R 右扫', '留在 0，写 0', '留在 0，写 1', '转 1，写 #'],
      ['1', 'L 左扫', '转 2，写 1', '留在 1，写 0', '转 2，写 1'],
      ['2', 'H 停机', '—', '—', '—']
    ] },

    { t: 'p', html:
      '拿 <code>10111</code> 走一遍。状态 0 从最左端出发，一路向右扫到末尾的 <code>#</code>；' +
      '转入状态 1 时，因为新状态是 L，头立刻向左移一格，落在最后一个 <code>1</code> 上。' +
      '状态 1 读 1 写 0 继续左移，连做三次；再往左遇到 <code>0</code>，写 1 转入停机态。' +
      '纸带从 <code>10111</code> 变成 <code>11000</code>——二进制 23 加一得 24，正确。' +
      '如果输入是全 1（如 <code>111</code>），状态 1 会在最左端的空白格上写 1 并停机，得到 <code>1000</code>。'
    },

    { t: 'h', text: '三、状态表与二进制加法器', id: 'ch21-3' },

    { t: 'p', html:
      '把上面的转移表写成文本文件，就得到一台"数据化的图灵机"：第一行是状态数与字母表，' +
      '后面每行是一个状态的动作、以及它对每个符号的"下一状态 + 写符号"。' +
      '这种格式的好处是：模拟程序不用改一行代码，换一个文件就换一台机器。' +
      '教材的加法器机器（6 个状态、字母表 <code>01+#</code>）用的正是这种格式。'
    },

    { t: 'code', run: false, caption: 'addTM.txt —— 图灵机状态表（非 Java · 静态阅读）', code:
`6 01+#
R 0 0 0 1 0 1 + #
L 1 2 4 1 1 0 # #
L 2 2 3 2 0 1 + #
L 0 3 3 0 1 0 + 1
R 4 4 4 5 # # # #
Halt
` },

    { t: 'p', html:
      '这份表读作：6 个状态，字母表是 <code>0 1 + #</code>；状态 0 是 R，向右扫到 <code>#</code>；' +
      '状态 1 是 L，负责把 <code>+</code> 右边的数减一；状态 2 是 L，扫回 <code>+</code> 左边；' +
      '状态 3 负责把左边的数加一；状态 4 是 R，清理掉 <code>+</code> 和多余符号；状态 5 停机。' +
      '用模拟器运行 <code>101+11</code>，最终输出 <code>Halt 1000</code>：二进制 5 加 3 得 8。' +
      '整台机器只做两件事——"右边减一、左边加一"，反复直到右边变成 0。'
    },

    { t: 'h', text: '四、用 Java 模拟图灵机', id: 'ch21-4' },

    { t: 'p', html:
      '图灵机的模拟比 DFA 多两件事：纸带要用数组表示（预留空白格），每一步要按"下一个状态"的动作移动读写头。' +
      '下面的程序把加一机器的转移表写成三个数组：<code>next</code> 存下一状态，<code>write</code> 存写符号，' +
      '<code>action</code> 存每个状态的动作（+1 右移、−1 左移、0 停机）。' +
      '主循环只有五行，却完整复现了纸带、读写头与状态机。'
    },

    { t: 'code', caption: 'TMSim.java —— 模拟二进制加一图灵机并打印每一步', code:
`public class TMSim {
    public static void main(String[] args) {
        String input = "10111";
        char[] tape = new char[32];
        for (int i = 0; i < tape.length; i++) tape[i] = '#';
        for (int i = 0; i < input.length(); i++) tape[i + 1] = input.charAt(i);

        int[] action = { 1, -1, 0 };            // 0=R 右移，1=L 左移，2=H 停机
        int[][] next = {
            { 1, 0, 0 },   // 状态 0：读到 # 转 1；读到 0/1 留在 0
            { 2, 2, 1 },   // 状态 1：读到 # 写 1 停机；读到 0 写 1 停机；读到 1 写 0 继续
            { 0, 0, 0 }    // 状态 2：停机
        };
        char[][] write = {
            { '#', '0', '1' },
            { '1', '1', '0' },
            { '#', '0', '1' }
        };

        int state = 0;
        int head = 1;
        int step = 0;
        while (action[state] != 0) {
            char c = tape[head];
            int sym = (c == '#') ? 0 : (c == '0') ? 1 : 2;
            tape[head] = write[state][sym];
            state = next[state][sym];
            head += action[state];              // 头按"新状态"的动作移动
            step++;
            System.out.println(step + ": state=" + state + " tape=" + tapeString(tape));
        }
        System.out.println("Halt " + tapeString(tape));
    }

    static String tapeString(char[] t) {
        int lo = 0;
        int hi = t.length - 1;
        while (lo < hi && t[lo] == '#') lo++;
        while (hi > lo && t[hi] == '#') hi--;
        StringBuilder sb = new StringBuilder();
        for (int i = lo; i <= hi; i++) sb.append(t[i]);
        return sb.toString();
    }
}
` },

    { t: 'p', html:
      '运行后你会看到纸带逐步变化：从 <code>10111</code> 开始，先右扫到末尾，再左扫把末尾的 1 逐个改成 0，' +
      '最后把中间的 0 改成 1，输出 <code>Halt 11000</code>。' +
      '注意 <code>head += action[state]</code> 这一行：移动发生在"换完状态之后"，' +
      '如果写成按当前状态移动，全 1 输入就会把读写头移出纸带边界。' +
      '这也是手写 TM 模拟器最常见的 bug。'
    },

    { t: 'h', text: '五、识别、判定与可计算函数', id: 'ch21-5' },

    { t: 'p', html:
      '图灵机运行有四种结局：<b>Yes</b>（接受）、<b>No</b>（拒绝）、<b>H</b>（停机但不表态）、' +
      '<b>永远不停</b>。于是教材区分了两个概念：一台机器 <b>recognizes</b>（识别）一个语言，' +
      '指它接受该语言的所有串（对不在语言里的串可以不停机）；' +
      '如果它对所有输入都停机，并且 Yes/No 恰好对应"在/不在语言里"，就叫 <b>decides</b>（判定）。' +
      'DFA 一定会停机，所以对 DFA 来说"识别"和"判定"是一回事；图灵机不是，这个区分是下一章不可判定性的入口。'
    },

    { t: 'table', caption: '四个关键词：识别、判定、可计算、不可解', head: ['概念', '含义', '典型例子'], rows: [
      ['识别语言 L', '接受 L 中所有串；不在 L 中的串可以不停机', '能枚举所有回文串的 TM'],
      ['判定语言 L', '对所有输入都停机，Yes 当且仅当属于 L', '判定"b 的个数是 3 的倍数"的 DFA'],
      ['可计算函数 f', '从输入 x 出发，停机时纸带上是 f(x)', '整数加乘、排序、编译'],
      ['不可解问题', '不存在能判定它的图灵机', '停机问题（下一章证明）']
    ] },

    { t: 'p', html:
      '除了"语言"，图灵机还能算<b>函数</b>：如果对每个输入 x，机器都会停机并在纸带上留下 f(x)，' +
      '就说 f 是<b>可计算函数（computable function）</b>。整数加减乘除、求最大公约数、' +
      '把一个 Java 程序编译成字节码，都是可计算函数——因为它们都能写成有限步骤的算法，' +
      '而图灵机正是"算法"的形式化定义。'
    },

    { t: 'h', text: '六、程序处理程序与通用图灵机', id: 'ch21-6' },

    { t: 'p', html:
      '一个程序把另一个程序当输入，这件事你每天都在用：<code>javac</code> 读 <code>.java</code> 文件、' +
      '生成 <code>.class</code>；JVM 读 <code>.class</code> 文件、执行它。' +
      '上一章的"通用虚拟 DFA"也是同一思路：把 DFA 的状态表当数据读进来，用一个固定的模拟器跑它。' +
      '图灵机也能这样做——把"机器的转移表"和"输入串"一起写在纸带上，' +
      '再设计一台专门读这种纸带的机器，就得到<b>通用图灵机（universal Turing machine，UTM）</b>。'
    },

    { t: 'steps', items: [
      { title: '第一步：把机器编码成数据', html: '用固定格式把状态数、字母表、每个状态的转移写成符号串，放在纸带开头；用分隔符把"程序"和"输入"分开。' },
      { title: '第二步：准备一条模拟带', html: 'UTM 自己也需要纸带记录"被模拟机器"的纸带内容、读写头位置和当前状态。可以理解为 UTM 在纸带上画了两块区域：程序区与数据区。' },
      { title: '第三步：取指—译码—执行', html: '每一步先读"被模拟机器的当前状态与头下符号"，在程序区里找到对应转移，改写数据区、更新状态与头位置，再进入下一步。' },
      { title: '第四步：处理停机', html: '当被模拟机器进入 H/Yes/No 时，UTM 也停机，并按约定输出结果。若被模拟机器不停机，UTM 也不停机——这一点下一章会变成关键。' }
    ] },

    { t: 'code', caption: 'TMUniversal.java —— 把转移表当数据传入，同一段模拟代码跑多台机器', code:
`public class TMUniversal {
    public static void main(String[] args) {
        int[] action = { 1, -1, 0 };
        int[][] next = { { 1, 0, 0 }, { 2, 2, 1 }, { 0, 0, 0 } };
        char[][] write = { { '#', '0', '1' }, { '1', '1', '0' }, { '#', '0', '1' } };
        String[] inputs = { "10111", "111", "10011" };

        for (int k = 0; k < inputs.length; k++) {
            char[] tape = new char[32];
            for (int i = 0; i < tape.length; i++) tape[i] = '#';
            for (int i = 0; i < inputs[k].length(); i++) tape[i + 1] = inputs[k].charAt(i);
            run(tape, action, next, write);
            System.out.println(inputs[k] + " -> " + tapeString(tape));
        }
    }

    static void run(char[] tape, int[] action, int[][] next, char[][] write) {
        int state = 0;
        int head = 1;
        while (action[state] != 0) {
            char c = tape[head];
            int sym = (c == '#') ? 0 : (c == '0') ? 1 : 2;
            tape[head] = write[state][sym];
            state = next[state][sym];
            head += action[state];
        }
    }

    static String tapeString(char[] t) {
        int lo = 0;
        int hi = t.length - 1;
        while (lo < hi && t[lo] == '#') lo++;
        while (hi > lo && t[hi] == '#') hi--;
        StringBuilder sb = new StringBuilder();
        for (int i = lo; i <= hi; i++) sb.append(t[i]);
        return sb.toString();
    }
}
` },

    { t: 'p', html:
      '输出三行：<code>10111 -> 11000</code>、<code>111 -> 1000</code>、<code>10011 -> 10100</code>。' +
      '这段代码里的 <code>run</code> 方法不认识"加一"这个概念，它只是照着数组执行；' +
      '换掉 <code>next/write/action</code> 三个数组，它就变成另一台机器。' +
      '把"程序"从代码里挪到数据里，正是通用图灵机的核心思想——' +
      '也是现代计算机"存储程序"（stored-program）架构的理论原型。'
    },

    { t: 'h', text: '七、通用性与 Church–Turing 论题', id: 'ch21-7' },

    { t: 'p', html:
      '通用图灵机的存在意味着：<b>不需要为每个任务造一台新机器，只要写一个新程序</b>。' +
      '图灵 1936 年的论文里，UTM 已经包含了这个思想；冯·诺依曼架构把程序和数据放进同一块内存，' +
      '正是同一件事的工程实现。教材因此说：UTM 可以看作"软件"的发明——' +
      '硬件只需要会做最基本的符号操作，复杂性全部交给可替换的程序。'
    },

    { t: 'table', caption: '被证明与图灵机等价（Turing complete）的模型', head: ['模型', '说明'], rows: [
      ['lambda 演算', '函数式编程的理论基础，1930 年代由 Church 提出'],
      ['计数器机', '只有 increment/decrement/jump-if-zero 三条指令'],
      ['元胞自动机', '如 Conway 的生命游戏，规则极简却可模拟任意计算'],
      ['主流编程语言', 'C、Java、Python、Haskell 等都能模拟 UTM'],
      ['字符串替换系统', '如 Thue 系统、Markov 算法'],
      ['DNA 计算机', 'Adleman 1994 年用 DNA 链解决旅行商问题']
    ] },

    { t: 'callout', kind: 'warn', title: 'Church–Turing 论题不是定理', html:
      '教材强调：<b>任何物理上可实现的计算机能做的计算，通用图灵机都能做</b>，' +
      '这被称为 Church–Turing 论题（thesis），而不是 Church–Turing 定理。' +
      '原因很微妙：它断言的是"所有物理设备"，而物理世界没有穷尽，所以无法用数学证明。' +
      '它能被"反驳"——只要有人造出一台能解决图灵机解决不了的问题的物理设备；' +
      '但至今没有。它的逆否形式更有用：<b>图灵机做不到的，任何物理计算机也做不到</b>。' +
      '下一章的"不可解问题"正是靠这句话才有实际意义。'
    },

    { t: 'p', html:
      '图灵机有很多变体，但能力不变。<b>增强型</b>——多条纸带、非确定性转移、二维纸带——都可以用一台普通图灵机模拟，' +
      '所以不多算任何东西（非确定性用类似 NFA 子集构造的办法模拟，代价是指数时间）。' +
      '<b>限制型</b>——单向无限纸带、只有 0/1 两个符号——大多仍然等价；' +
      '但有些限制会真正削弱能力：DFA 不能写纸带，只能单向移动的机器也不行。' +
      '最有趣的是栈：<b>一个栈</b>（PDA）弱于图灵机，<b>两个栈</b>就与图灵机等价。' +
      '"一个栈"和"两个栈"之间，正是可判定与不可判定之间的那道墙。'
    },

    { t: 'h', text: '八、通用性的边界', id: 'ch21-8' },

    { t: 'p', html:
      '通用性是一把双刃剑。好的一面是"一台机器什么都能算"；坏的一面是"它也可能永远算不完"。' +
      'DFA 一定停机，所以 DFA 的世界里没有"死循环"；图灵机可能不停机，' +
      '于是出现了一个 DFA 世界里不存在的问题：<b>给定程序和输入，它到底会不会停？</b>' +
      '这个问题看起来只是"多等一会儿"，但下一章会证明：不存在任何算法能对所有程序和输入正确回答它。' +
      '这就是停机问题，也是"可计算性"这门学问的起点。'
    },

    { t: 'quiz', qid: 'ch21-q1' },
    { t: 'quiz', qid: 'ch21-q2' },
    { t: 'quiz', qid: 'ch21-q3' },

    { t: 'p', html:
      '纸带和读写头在纸上画起来简单，跑起来才知道每一步都要先看当前符号、再按下一个状态的动作移动。' +
      '这台实验台让一台小机器执行「二进制加一」：你可以单步、播放，也可以随时暂停换个输入。'
    },

    { t: 'lab', id: 'turing' },

    { t: 'callout', kind: 'exam', title: '这一章在考试里怎么考', html:
      '常见题型：给一台图灵机的状态表，让你手算某条输入串的轨迹并写出最终纸带；' +
      '给一个语言，让你设计不超过 k 个状态的图灵机；' +
      '以及概念题——UTM 为什么能模拟任意图灵机、recognizes 与 decides 的区别、' +
      '为什么 Church–Turing 是论题而不是定理。' +
      '手算轨迹时最容易错的是"头按新状态移动"这一步；设计机器时先想清楚' +
      '"纸带要分几段、每段由哪个状态负责"，再补转移表。'
    },

    { t: 'keypoint', items: [
      { title: '检查点 · 图灵机的四要素', html: '无限纸带、读写头、有限状态、转移表；状态分 R/L/H/Yes/No。' },
      { title: '检查点 · 头怎么移动', html: '读写头按<b>下一个状态</b>的动作移动：新状态是 R 就右移，是 L 就左移，是 H/Yes/No 就停机。' },
      { title: '检查点 · 加一机器', html: '3 个状态就能给二进制数加一：右扫到末尾、左扫把 1 变 0、遇 0 变 1；全 1 时最左补 1。' },
      { title: '检查点 · 状态表', html: '把转移表写成"状态数 + 字母表 + 每状态一行"的文本，模拟器就能读任意机器。' },
      { title: '检查点 · 识别与判定', html: 'recognize 只要求接受语言中的串；decide 还要求对所有输入停机。DFA 一定停机，所以两者等价。' },
      { title: '检查点 · 通用图灵机', html: 'UTM 把"机器描述 + 输入"一起读进来并模拟，等价于"软件"：换程序不换硬件。' },
      { title: '检查点 · Church–Turing 论题', html: '任何物理可实现的计算机能做的，UTM 都能做；它是论题不是定理，但从未被反驳。' },
      { title: '检查点 · 增强与限制', html: '多带、非确定、二维带不增加能力；一个栈弱于图灵机，两个栈与图灵机等价。' }
    ] },

    { t: 'checklist', id: 'ch21', items: [
      '我能说出图灵机与 DFA 的三点关键差别',
      '我能画出图灵机的纸带与读写头示意，并解释 # 的作用',
      '我能读懂 read:write 记法，并说明头按哪个状态移动',
      '我能手算二进制加一机器在 10111 上的完整轨迹',
      '我能把转移表写成数组，用 Java 模拟一台图灵机',
      '我能解释 recognizes 与 decides 的区别，并举一个例子',
      '我能说明通用图灵机为什么等于"软件"，以及它和 JVM 的类比',
      '我能复述 Church–Turing 论题的内容，并说明它不是定理',
      '我能说出一个栈与两个栈在能力上的差别'
    ] },

    { t: 'p', html:
      '延伸阅读：教材 §5.2 与 §5.3。' +
      '§5.2 里有 addTM.txt 的完整运行输出与通用虚拟图灵机的两个程序（Tape 与 TuringMachine）；' +
      '§5.3 讨论算法、可计算函数、UTM 与 Church–Turing 论题。' +
      '站内可对照 ch20 的 DFA/NFA（本章是它们的"可写、可左右移动"版本），' +
      '以及下一章 ch22——那里会把本章最后一节的"会不会停"变成严格的不可判定性证明。'
    },

    { t: 'callout', kind: 'ai', title: 'AI 时代这样学', html:
      '图灵机看起来离工程很远，但它是你判断"AI 能不能做到"的标尺：' +
      '任何图灵完备的系统（包括大模型之外的所有通用计算机）都受同样的可计算性限制。' +
      '当有人声称某个算法能"自动判断任意程序是否正确"时，本章的通用性与下一章的 Rice 定理就是反驳工具。' +
      '学习建议：把 TMSim 的转移表改一改，让它做"二进制减一"或"字符串反转"，' +
      '亲手体会"状态 + 纸带 + 规则"如何组合出任意计算。'
    },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html:
      '覆盖范围：图灵机模型与运行规则、二进制加一与加法器状态表、图灵机的 Java 模拟、' +
      '识别/判定/可计算函数、通用图灵机与"程序即数据"、Church–Turing 论题、图灵机变体与能力边界。' +
      '依据：教材 §5.2–§5.3（Chapter 5, Turing Machines / Universality）。' +
      '本站为个人整理学习材料，与课程要求冲突时以老师和课程大纲为准；' +
      '本章 Java 代码均在真实 JDK 上编译运行核对过输出，addTM.txt 为教材格式的静态示例。'
    }

  ]
});
