/* =====================================================================
 * data/ch02.js · 第 02 章：变量、类型与字符串
 * 职责：讲清"数据怎么被命名、存放、运算"，覆盖 8 种基本类型、字面量、
 *       类型转换、整数/浮点陷阱、String 不可变与常用 API、格式化输出，
 *       并用三个调试实录与两个完整案例把概念落到能跑的程序上。
 * 对外 API：CSC.registerChapter({...})（block schema 见 _dev/CONTRACT.md §4–§5）
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch02',
  num: '02',
  title: '变量、类型与字符串',
  en: 'Variables, Types & Strings',
  goals: [
    '能声明变量，说清"类型 + 名字 + 初始值"各自的作用',
    '能说出 8 种基本类型的用途与范围，解释 int 为什么会溢出',
    '能正确区分整除、取余与浮点除法，并预测其输出',
    '能判断何时自动转换、何时必须强制转换，以及强转为什么会截断',
    '能用 String 常用方法处理文本，并说清 == 与 equals 的区别',
    '能用 printf / String.format 输出对齐的表格，并用容差比较浮点数'
  ],
  kp: [
    { id: 'ch02-1', title: '变量是内存格子的标签' },
    { id: 'ch02-2', title: '八种基本类型与字面量' },
    { id: 'ch02-3', title: '运算符与优先级' },
    { id: 'ch02-7', title: '三元运算符' },
    { id: 'ch02-5', title: '类型转换与强制转换' },
    { id: 'ch02-4', title: '整数除法、取余与溢出' },
    { id: 'ch02-8', title: '浮点数的二进制误差' },
    { id: 'ch02-6', title: 'String 与 == / equals' },
    { id: 'ch02-9', title: 'String 常用方法' },
    { id: 'ch02-10', title: '格式化输出 printf' },
    { id: 'ch02-12', title: '教材 §1.2：五种内置类型、三种转换与 Math 库' }
  ],
  blocks: [

    /* ---------------------------------------------------------------- 开篇 */
    { t: 'callout', kind: 'why', html:
      '先运行下面这段只有 12 行的程序，把 5 行输出抄在纸上。它会让初学者连踩四个坑：' +
      '<code>double avg = 7 / 2;</code> 得到 <code>3.0</code> 而不是 3.5；' +
      '<code>int</code> 最大值加 1 变成负数；键盘输入明明打了 YES，程序却打印 <code>rejected</code>；' +
      '<code>0.1 + 0.2</code> 竟然不等于 0.3。<br>' +
      '这些都不是 bug，也不是"Java 有毛病"，而是<b>类型与存储方式的规则</b>在起作用。' +
      '这一章要训练的就是：看到这些输出，能立刻说出"哪条规则造成的、应该怎么改"。'
    },

    { t: 'p', lead: true, html:
      '变量（variable）这个中文翻译有点误导：它不是"可以变的量"，而是<b>一块有名字的内存空间</b>。' +
      '名字是给你看的，内存地址是给 CPU 看的。你写 <code>age</code>，编译器替你换算成"第几个格子"。'
    },

    { t: 'code', caption: 'OpeningBug.java · 四个坑一次踩完（点「单步」看每行之后变量怎么变）', trace: true, code:
`public class OpeningBug {
    public static void main(String[] args) {
        double avg = 7 / 2;                          // 期望 3.5
        System.out.println("avg = " + avg);           // avg = 3.0

        int max = 2147483647;
        System.out.println(max + 1);                  // -2147483648

        String input = new String("YES");
        if (input == "YES") {
            System.out.println("accepted");
        } else {
            System.out.println("rejected");           // rejected
        }

        System.out.println(0.1 + 0.2);                // 0.30000000000000004
        System.out.println(0.1 + 0.2 == 0.3);         // false
    }
}
` },

    { t: 'p', html:
      '逐条对号：① <code>7 / 2</code> 两边都是 <code>int</code>，先整除得 3，再赋给 double 变成 3.0，小数在第一步就没了；' +
      '② <code>int</code> 只有 32 位，最大值加 1 会回绕到最小值；' +
      '③ <code>new String("YES")</code> 造的是<b>新对象</b>，而 <code>==</code> 比的是"是不是同一个对象"，不是内容；' +
      '④ 0.1 和 0.2 在二进制里都是无限循环小数，存进 64 位必然被截断，加起来的误差会露出来。' +
      '四个坑分别对应本章的整数、类型、字符串与浮点四块内容。'
    },

    { t: 'p', html:
      '本章路线：先建立"变量是一个盒子"的模型（一），再认识盒子的规格——8 种基本类型与字面量（二），' +
      '然后学在盒子上做运算（三）、在类型之间搬数据（四）；接着集中处理三类数值陷阱：整数（五）、浮点（六）；' +
      '再转向文本：String 的不可变与常量池（七）、常用方法（八）、格式化输出（九）。' +
      '最后用三份调试实录和两个 50 行以上的完整程序把全部概念串起来。'
    },

    /* ---------------------------------------------------------------- 一 */
    { t: 'h', text: '一、变量：有名字的内存格子', id: 'ch02-1' },

    { t: 'p', html:
      '想象一排储物柜：每个柜子有编号，但你不会记"第 39 号柜子"，只会记"放证件的那个"。' +
      '变量就是<b>贴在柜门上的标签</b>：标签可以换内容，但每次放进去的东西必须装得下。' +
      '<code>int age = 18;</code> 这一条语句做了两件事：<b>声明</b>（要一块装 int 的格子并起名 age）、' +
      '<b>初始化</b>（第一次放入 18）。之后 <code>age = 19;</code> 只是<b>赋值</b>，旧值被覆盖。'
    },

    { t: 'p', html:
      '顺序不能反：先声明再赋值，否则编译器不知道 <code>age</code> 是什么。' +
      '另外，声明可以一次写多个同类型变量（<code>int a = 1, b = 2;</code>），但考试里更常见的是分开写。' +
      '命名习惯上，变量用小驼峰（camelCase，如 <code>totalScore</code>），常量用全大写加下划线（<code>final int MAX_SIZE = 100;</code>）。'
    },

    { t: 'svg', maxW: 640, caption: '变量是贴在格子上的标签：格子有固定宽度（类型），标签会换（赋值），但新值必须放得下。', html:
`<svg viewBox="0 0 660 300" role="img" aria-label="变量作为内存格子的示意图">
  <defs>
    <marker id="ch02-arw1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
      <path d="M0,0 L10,5 L0,10 z" fill="var(--accent2)"/>
    </marker>
  </defs>
  <text x="20" y="30" font-size="13" font-weight="700" fill="var(--accent)">栈 Stack · 局部变量</text>

  <rect x="24" y="52" width="220" height="70" rx="8" fill="var(--surface2)" stroke="var(--line2)"/>
  <text x="40" y="80" font-size="13" fill="var(--text2)">int age</text>
  <rect x="150" y="64" width="76" height="34" rx="4" fill="var(--bg2)" stroke="var(--accent)"/>
  <text x="188" y="87" font-size="15" text-anchor="middle" fill="var(--text)">18</text>
  <text x="40" y="108" font-size="11" fill="var(--text3)">32 位，只能装整数</text>

  <rect x="24" y="140" width="220" height="70" rx="8" fill="var(--surface2)" stroke="var(--line2)"/>
  <text x="40" y="168" font-size="13" fill="var(--text2)">double score</text>
  <rect x="150" y="152" width="76" height="34" rx="4" fill="var(--bg2)" stroke="var(--accent)"/>
  <text x="188" y="175" font-size="15" text-anchor="middle" fill="var(--text)">95.5</text>
  <text x="40" y="196" font-size="11" fill="var(--text3)">64 位，能装小数</text>

  <rect x="24" y="228" width="220" height="56" rx="8" fill="var(--surface2)" stroke="var(--line2)"/>
  <text x="40" y="254" font-size="13" fill="var(--text2)">String name</text>
  <text x="150" y="254" font-size="13" fill="var(--accent2)">→ #1</text>
  <text x="40" y="274" font-size="11" fill="var(--text3)">引用类型：装的是箭头</text>

  <text x="300" y="30" font-size="13" font-weight="700" fill="var(--accent2)">堆 Heap · 对象</text>
  <rect x="300" y="52" width="300" height="80" rx="8" fill="var(--bg2)" stroke="var(--accent2)"/>
  <text x="316" y="78" font-size="13" font-weight="700" fill="var(--accent2)">#1 String</text>
  <text x="316" y="104" font-size="13" fill="var(--text2)">"Alice"（不可变）</text>
  <text x="316" y="124" font-size="11" fill="var(--text3)">内容改不了，只能换箭头</text>

  <line x1="244" y1="255" x2="292" y2="100" stroke="var(--accent2)" stroke-width="1.6" marker-end="url(#ch02-arw1)"/>
  <text x="300" y="170" font-size="12" fill="var(--text2)">赋值 = 把右边的东西放进左边格子</text>
  <text x="300" y="194" font-size="12" fill="var(--text2)">基本类型放数值，引用类型放箭头</text>
  <text x="300" y="230" font-size="12" fill="var(--text3)">第 09 章会把箭头画得更细</text>
</svg>`
    },

    { t: 'code', caption: 'Variables.java —— 声明、赋值、重新赋值与 final', code:
`public class Variables {
    public static void main(String[] args) {
        int age;                   // 声明：要一块能装 int 的空间，名字叫 age
        age = 18;                  // 赋值：把 18 放进去
        System.out.println(age);   // 18

        age = 19;                  // 重新赋值：旧值 18 被覆盖
        System.out.println(age);   // 19

        int score = 95;            // 声明 + 初始化可以写在一起
        score = score + 5;         // 右边先算，结果再存回左边
        System.out.println(score); // 100

        final int LIMIT = 60;      // final：只能赋值一次，之后不能再改
        System.out.println(LIMIT); // 60
    }
}
` },

    { t: 'callout', kind: 'warn', title: '局部变量必须先赋值再用', html:
      '写 <code>int x; System.out.println(x);</code> 会<b>编译报错</b>，不是运行时才崩。' +
      'C 语言里这会读到随机垃圾值，Java 选择在编译期就拒绝——少一类"结果莫名其妙"的 bug。' +
      '另外 <code>final</code> 变量第二次赋值也会编译报错，正好用来表达"这个值不该被改"。'
    },

    { t: 'terms', cols: 2, items: [
      { en: 'variable', zh: '变量', html: '有名字的内存空间，值可以改。' },
      { en: 'declaration', zh: '声明', html: '告诉编译器类型和名字。' },
      { en: 'initialization', zh: '初始化', html: '第一次赋值，之后才能安全读取。' },
      { en: 'literal', zh: '字面量', html: '直接写在代码里的值，如 <code>18</code>、<code>"hi"</code>。' }
    ] },

    { t: 'keypoint', items: [
      { title: '检查点 · 盒子模型', html: '能说出 <code>int age = 18;</code> 里哪一部分是类型、名字、值，以及为啥必须先赋值再读。' },
      { title: '检查点 · 命名', html: '能判断一个名字是否合法（不能数字开头、不能是关键字），并知道常量的写法。' }
    ] },

    /* ---------------------------------------------------------------- 二 */
    { t: 'h', text: '二、八种基本类型与字面量', id: 'ch02-2' },

    { t: 'p', html:
      '同样 32 个二进制位，按整数读是 1，按小数读是另一个数——计算机必须知道格子怎么解读。' +
      '<b>类型（type）</b>就是"格子大小 + 解读方式"的约定。Java 有 8 种<b>基本类型（primitive type）</b>，' +
      '它们不是对象，没有方法，赋值时复制的是数值本身。'
    },

    { t: 'table',
      head: ['类型', '位数', '范围 / 取值', '字面量例子'],
      rows: [
        ['<code>byte</code>', '8', '−128 ~ 127', '<code>100</code>'],
        ['<code>short</code>', '16', '约 ±3.2 万', '<code>32000</code>'],
        ['<code>int</code>', '32', '−2147483648 ~ 2147483647', '<code>2_000_000_000</code>'],
        ['<code>long</code>', '64', '约 ±9.2×10¹⁸', '<code>10_000_000_000L</code>'],
        ['<code>float</code>', '32', '约 7 位有效数字', '<code>3.14f</code>'],
        ['<code>double</code>', '64', '约 15 位有效数字', '<code>3.14159</code>'],
        ['<code>char</code>', '16', '一个 Unicode 字符', "<code>'A'</code>"],
        ['<code>boolean</code>', '1 位', '<code>true</code> / <code>false</code>', '<code>true</code>']
      ],
      caption: '默认值只对类的字段有效；方法里的局部变量不会自动初始化，必须自己赋值' },

    { t: 'p', html:
      '日常写代码 <code>int</code> 和 <code>double</code> 占九成：<code>int</code> 是 CPU 一次运算的原生长度，' +
      '±21 亿够用又最快；<code>double</code> 覆盖所有需要小数的场景。其余六种各有专门用途：' +
      '<code>byte</code> 省内存（文件、网络），<code>long</code> 存时间戳与大数，<code>char</code> 单字符，' +
      '<code>boolean</code> 只表真假。'
    },

    { t: 'svg', maxW: 640, caption: '同样的 32 位，按 int 解读得到 1078530011，按 float 解读约等于 3.14159——类型决定解读方式。', html:
`<svg viewBox="0 0 660 220" role="img" aria-label="32 位同一串比特的两种解读">
  <text x="20" y="26" font-size="12" fill="var(--text2)">同一串 32 位：0100 0000 0100 1001 0000 1111 1101 1011</text>
  <g>
    <rect x="20" y="44" width="60" height="34" fill="var(--surface2)" stroke="var(--line2)"/>
    <rect x="80" y="44" width="60" height="34" fill="var(--surface2)" stroke="var(--line2)"/>
    <rect x="140" y="44" width="60" height="34" fill="var(--surface2)" stroke="var(--line2)"/>
    <rect x="200" y="44" width="60" height="34" fill="var(--surface2)" stroke="var(--line2)"/>
    <rect x="260" y="44" width="60" height="34" fill="var(--surface2)" stroke="var(--line2)"/>
    <rect x="320" y="44" width="60" height="34" fill="var(--surface2)" stroke="var(--line2)"/>
    <rect x="380" y="44" width="60" height="34" fill="var(--surface2)" stroke="var(--line2)"/>
    <rect x="440" y="44" width="60" height="34" fill="var(--surface2)" stroke="var(--line2)"/>
    <text x="50" y="66" font-size="12" text-anchor="middle" fill="var(--text)">0100</text>
    <text x="110" y="66" font-size="12" text-anchor="middle" fill="var(--text)">0000</text>
    <text x="170" y="66" font-size="12" text-anchor="middle" fill="var(--text)">0100</text>
    <text x="230" y="66" font-size="12" text-anchor="middle" fill="var(--text)">1001</text>
    <text x="290" y="66" font-size="12" text-anchor="middle" fill="var(--text)">0000</text>
    <text x="350" y="66" font-size="12" text-anchor="middle" fill="var(--text)">1111</text>
    <text x="410" y="66" font-size="12" text-anchor="middle" fill="var(--text)">1101</text>
    <text x="470" y="66" font-size="12" text-anchor="middle" fill="var(--text)">1011</text>
  </g>

  <rect x="20" y="108" width="290" height="84" rx="8" fill="var(--bg2)" stroke="var(--accent)"/>
  <text x="36" y="132" font-size="12" font-weight="700" fill="var(--accent)">按 int 读：1078530011</text>
  <text x="36" y="156" font-size="11" fill="var(--text2)">整数编码，直接换算成十进制</text>
  <text x="36" y="178" font-size="11" fill="var(--text3)">0x40490FDB</text>

  <rect x="340" y="108" width="300" height="84" rx="8" fill="var(--bg2)" stroke="var(--accent2)"/>
  <text x="356" y="132" font-size="12" font-weight="700" fill="var(--accent2)">按 float 读：3.1415927</text>
  <text x="356" y="156" font-size="11" fill="var(--text2)">1 位符号 + 8 位指数 + 23 位尾数</text>
  <text x="356" y="178" font-size="11" fill="var(--text3)">IEEE 754 单精度</text>
</svg>`
    },

    { t: 'code', caption: 'Types.java —— 八种基本类型与字面量的写法', code:
`public class Types {
    public static void main(String[] args) {
        byte    small  = 127;              // 8 位，范围 -128 ~ 127
        short   medium = 32000;            // 16 位，约 ±3.2 万
        int     count  = 2_000_000_000;    // 32 位；下划线只是给人看的
        long    big    = 10_000_000_000L;  // 64 位；超出 int 范围必须加 L
        float   ratio  = 3.14f;            // 小数默认 double，加 f 才是 float
        double  pi     = 3.141592653589793;
        char    letter = 'A';              // 单引号，只能放一个字符
        boolean flag   = true;             // 只有 true / false，不能写 1 / 0

        System.out.println(small + " " + medium + " " + count);
        System.out.println(big + " " + ratio + " " + pi);
        System.out.println(letter + " " + flag);
        System.out.println((int) letter);          // 65：char 本质是 16 位整数
        System.out.println((char) (letter + 1));   // B
        System.out.println(small + 1);             // 128：byte 先提升为 int 再相加
    }
}
` },

    { t: 'p', html:
      '字面量（literal）有固定规则，记住五条就够：① 整数默认 <code>int</code>，超过 21 亿要加 <code>L</code>；' +
      '② 小数默认 <code>double</code>，要 <code>float</code> 就加 <code>f</code>；' +
      '③ 下划线 <code>1_000_000</code> 只是方便阅读，编译器会忽略；' +
      '④ 进制可以写 <code>0x1F</code>（十六进制）、<code>0b1010</code>（二进制）；' +
      '⑤ <code>char</code> 用单引号，字符串用双引号，二者不能混。'
    },

    { t: 'callout', kind: 'warn', title: '后缀不是装饰，写错就编译失败', html:
      '整数默认 <code>int</code>、小数默认 <code>double</code>，所以 ' +
      '<code>long x = 10000000000;</code> 报"整数太大"，<code>float r = 3.14;</code> 报类型不兼容，' +
      '必须写 <code>L</code> 和 <code>f</code>。<br>' +
      '另外 <code>char</code> 的 <code>\'A\'</code> 和字符串的 <code>"A"</code> 是两种类型：' +
      '<code>\'A\' + 1</code> 是 <code>66</code>，<code>"A" + 1</code> 是 <code>"A1"</code>——因为 <code>+</code> 遇到字符串就变成拼接。'
    },

    { t: 'callout', kind: 'tip', title: '为什么 Java 非要写类型', html:
      'C 允许你把一块内存随便当整数或指针解释，Java 不允许。类型固定了<b>内存布局和解读方式</b>，' +
      '编译器才能验证每个操作合不合法，把错误挡在运行之前。代价是写得啰嗦，' +
      '收益是"编译通过的程序基本不会因类型搞错而崩溃"——这就是<b>强类型（strongly typed）</b>的取舍。'
    },

    { t: 'terms', cols: 2, items: [
      { en: 'primitive type', zh: '基本类型', html: '8 种内置类型，存数值本身，没有方法。' },
      { en: 'reference type', zh: '引用类型', html: '如 String、数组、对象，变量里存的是箭头。' },
      { en: 'type conversion', zh: '类型转换', html: '把值从一种类型搬到另一种。' },
      { en: 'strongly typed', zh: '强类型', html: '类型不匹配的代码在编译期就被拒绝。' }
    ] },

    { t: 'keypoint', items: [
      { title: '检查点 · 八种类型', html: '能按位数从小到大写全 8 种基本类型，并说出哪两种最常用。' },
      { title: '检查点 · 字面量', html: '看到 <code>10L</code>、<code>3.14f</code>、<code>0x1F</code>、<code>"A"</code>、<code>\'A\'</code> 能立刻说出类型。' }
    ] },

    /* ---------------------------------------------------------------- 三 */
    { t: 'h', text: '三、运算符、优先级与三元', id: 'ch02-3' },

    { t: 'p', html:
      '运算符（operator）是 <code>+ - * / %</code> 这类符号，被运算的值叫操作数（operand）。' +
      '优先级（precedence）决定先算谁：括号 > 一元（<code>++ -- !</code> 与强转）> <code>* / %</code> > <code>+ -</code> > ' +
      '比较 > <code>&&</code> > <code>||</code> > 赋值。记不住就<b>加括号</b>，可读性永远比炫技重要。'
    },

    { t: 'table',
      head: ['优先级（高 → 低）', '运算符'],
      rows: [
        ['1', '<code>()</code> 括号，永远最先算'],
        ['2', '<code>++ -- !</code>、<code>(int)</code> 一元运算与强转'],
        ['3', '<code>* / %</code>'],
        ['4', '<code>+ -</code>'],
        ['5', '<code>&lt; &lt;= &gt; &gt;=</code>，然后 <code>== !=</code>'],
        ['6', '<code>&&</code>，然后 <code>||</code>'],
        ['7', '<code>= += -= *= /= %=</code> 赋值，从右往左结合']
      ] },

    { t: 'code', caption: 'Operators.java —— 算术、优先级、自增与三元', code:
`public class Operators {
    public static void main(String[] args) {
        int a = 7, b = 2;

        System.out.println(a / b);         // 3    整除，小数被直接丢掉
        System.out.println(a % b);         // 1    余数
        System.out.println(-7 / 2);        // -3   向零取整，不是 -4
        System.out.println(-7 % 2);        // -1   余数符号跟被除数走

        System.out.println(2 + 3 * 4);     // 14   先乘后加
        System.out.println((2 + 3) * 4);   // 20   括号优先

        int i = 1;
        System.out.println(i++);           // 1    先用旧值，再自增
        System.out.println(i);             // 2
        System.out.println(++i);           // 3    先自增，再用新值

        int total = 100;
        total += 5;                        // 等价于 total = total + 5
        System.out.println(total);         // 105

        int max = a > b ? a : b;                        // 7
        String parity = a % 2 == 0 ? "even" : "odd";    // odd
        System.out.println("max = " + max + ", " + parity);
    }
}
` },

    { t: 'callout', kind: 'warn', title: '两个考试必考的区别', html:
      '<b>① <code>=</code> vs <code>==</code></b>：<code>=</code> 赋值，<code>==</code> 比较。' +
      '<code>if (x = 5)</code> 在 Java 里直接编译报错，这是它比 C 安全的地方。<br>' +
      '<b>② <code>i++</code> vs <code>++i</code></b>：单独一行没区别；参与表达式时，' +
      '<code>i++</code> 取<b>旧值</b>再自增，<code>++i</code> 先自增再取<b>新值</b>。' +
      '考题常写成 <code>int y = i++ + ++i;</code>，必须逐个按顺序算。'
    },

    { t: 'p', html:
      '当 if / else 只做一件事——<b>在两个值里挑一个</b>——可以用更紧凑的三元运算符（ternary operator）：' +
      '<code>条件 ? 甲 : 乙</code>。条件为 true 取甲，否则取乙。' +
      '它和 if 的最大区别是：<b>三元是表达式（expression），结果有类型</b>，可以直接赋值、参与运算、当方法实参；' +
      'if 是语句（statement），本身不产生值，所以不能出现在赋值号右边。'
    },

    { t: 'callout', kind: 'tip', title: '什么时候别用三元', html:
      '三元只适合"二选一取值"。一旦某个分支要做<i>多件事</i>（打印、改多个变量、调用方法），就该用 if / else——' +
      '硬套嵌套三元只会让代码难读。<br>' +
      '注意<b>优先级</b>：三元的优先级低于 <code>==</code> 和算术运算，写 <code>int x = 1 + (flag ? 2 : 3)</code> ' +
      '时括号不能省；两个三元嵌套时从右往左结合，<code>a ? b : c ? d : e</code> 等价于 <code>a ? b : (c ? d : e)</code>。'
    },

    { t: 'keypoint', items: [
      { title: '检查点 · 优先级', html: '能不看表算出 <code>2 + 3 * 4</code>、<code>1 + 2 &gt; 2 &amp;&amp; false</code> 这类表达式。' },
      { title: '检查点 · 自增与三元', html: '能预测 <code>i++</code> 参与表达式后的值，并把一段 if / else 改写为三元。' }
    ] },

    /* ---------------------------------------------------------------- 四 */
    { t: 'h', text: '四、类型转换：小转大自动，大转小强制', id: 'ch02-5' },

    { t: 'p', html:
      '把值搬到另一种类型叫<b>类型转换（type conversion）</b>。方向从小到大' +
      '（<code>byte → short → int → long → float → double</code>）编译器自动完成，因为不丢信息，叫<b>自动转换（widening）</b>；' +
      '反过来必须写<b>强制转换（cast）</b>，因为可能丢数据，编译器要你明确表示"我知道风险"，叫 <b>narrowing</b>。' +
      '规则一句话：<b>小的能自动变大的，大的必须手动变小的。</b>'
    },

    { t: 'compare', left: {
      title: '自动转换（widening）：小 → 大',
      html: '不丢数据，编译器自动做。混合运算时会先提升到较宽的类型再算：<code>int + double</code> 得 <code>double</code>。',
      code: 'int i = 42;\ndouble d = i;               // 42.0\nSystem.out.println(1 / 2.0); // 0.5'
    }, right: {
      title: '强制转换（narrowing）：大 → 小',
      html: '可能丢数据，必须手写 <code>(类型)</code>。规则是<b>截断</b>（向零取整），不是四舍五入。',
      code: 'double pi = 3.99;\nint x = (int) pi;             // 3\nint y = (int) Math.round(pi); // 4'
    } },

    { t: 'p', html:
      '混合运算的<b>提升规则（type promotion）</b>值得单独记：' +
      '① 有 <code>double</code> 就全变 <code>double</code>，有 <code>float</code> 变 <code>float</code>，有 <code>long</code> 变 <code>long</code>；' +
      '② 否则一律提升为 <code>int</code>——所以 <code>byte + byte</code> 的结果是 <code>int</code>，赋回 byte 还得强转；' +
      '③ <code>char</code> 参与算术也会先变成 <code>int</code>。'
    },

    { t: 'code', caption: 'Convert.java —— 自动、强制、提升与 char 转换', code:
`public class Convert {
    public static void main(String[] args) {
        int i = 42;
        double d = i;                        // 自动：int -> double
        System.out.println(d);               // 42.0

        double pi = 3.99;
        int cut = (int) pi;                  // 强制：截断，不是四舍五入
        System.out.println(cut);             // 3
        System.out.println(Math.round(pi));  // 4：要四舍五入得自己调

        System.out.println((int) -3.9);      // -3：向零取整
        System.out.println(1 / 2);           // 0：先整除，结果已经是 int
        System.out.println(1 / 2.0);         // 0.5：混入 double 才带小数
        System.out.println((double) 1 / 2);  // 0.5：先把 1 转成 double
        System.out.println((double) (1 / 2)); // 0.0：括号里先算成 0

        char c = 'A';
        int code = c;                        // char -> int 自动
        System.out.println(code);            // 65
        System.out.println((char) (code + 1)); // B

        int x = 200;
        byte low = (byte) x;                 // 只保留低 8 位
        System.out.println(low);             // -56
    }
}
` },

    { t: 'callout', kind: 'warn', title: '强制转换只对紧挨着的那个值生效', html:
      '<code>(double) 1 / 2</code> 是 <code>0.5</code>（先把 1 转成 double，再做 double 除法）；' +
      '<code>(double) (1 / 2)</code> 是 <code>0.0</code>（括号里先整除成 0）。<b>括号位置差一点，结果差很多。</b><br>' +
      '还要注意 <code>(byte) 200</code> 不是 200，而是 -56：200 超出 byte 范围，只保留低 8 位并按补码解释。' +
      '强转不检查范围，这也是它危险的地方。'
    },

    { t: 'keypoint', items: [
      { title: '检查点 · 方向', html: '能说出 byte → int → long → double 自动转换，反向必须写 cast。' },
      { title: '检查点 · 截断', html: '知道 <code>(int) 3.99</code> 是 3、<code>(int) -3.99</code> 是 -3，且 <code>(byte) 200</code> 会回绕。' }
    ] },

    /* ---------------------------------------------------------------- 五 */
    { t: 'h', text: '五、整数除法、取模与溢出', id: 'ch02-4' },

    { t: 'p', html:
      '两个 <code>int</code> 相除，结果还是 <code>int</code>，小数部分<b>直接丢弃</b>（不是四舍五入），这叫<b>整数除法（integer division）</b>。' +
      '这和数学直觉冲突，但和"整数类型只能存整数"一致：结果类型是 int，就存不下 3.5。' +
      '想让结果带小数，必须让<b>至少一个操作数</b>是浮点数，或者先强转。'
    },

    { t: 'p', html:
      '<code>%</code> 是取余（modulus），最常用于判断奇偶、秒数换算、按位拆数字。' +
      'Java 规定 <b><code>a % b</code> 的符号跟被除数 a 一致</b>，所以 <code>-7 % 2</code> 是 <code>-1</code>，' +
      '不是数学上的 1；<code>7 % -2</code> 是 <code>1</code>。' +
      '而除法结果一律<b>向零取整</b>：<code>-7 / 2</code> 是 <code>-3</code>，不是 <code>-4</code>。'
    },

    { t: 'code', caption: 'TimeFormat.java —— 整除 + 取余拆秒数（考试高频）', code:
`public class TimeFormat {
    public static void main(String[] args) {
        int totalSeconds = 3725;

        int hours   = totalSeconds / 3600;         // 1
        int minutes = totalSeconds % 3600 / 60;    // 2   先取余再整除
        int seconds = totalSeconds % 60;           // 5

        System.out.println(hours + " h " + minutes + " m " + seconds + " s");

        int n = 7;
        System.out.println(n % 2 == 0);            // false：n 是奇数
        System.out.println(n / 2.0);               // 3.5：混入 double 才有小数
    }
}
` },

    { t: 'callout', kind: 'warn', title: '1 / 2 等于 0', html:
      '这是 本课程出现频率最高的陷阱之一。<code>1 / 2</code> 是 <code>0</code>，' +
      '因为两边都是 int；<code>1 / 2.0</code> 才是 <code>0.5</code>。' +
      '连带推论：<code>(a + b) / 2</code> 求平均会截断，算平均分、算中间下标时都会踩；' +
      '<code>total / count</code> 求平均值也一样——这是本章第 2 个调试实录的主角。'
    },

    { t: 'p', html:
      '<code>int</code> 占 32 位，范围是 <code>-2147483648</code> 到 <code>2147483647</code>。' +
      '最大值再加 1，不是报错，而是变成最小值：CPU 用固定位宽做加法，最高位的进位被直接丢弃。' +
      '这就是<b>溢出（overflow）</b>。为什么设计成这样？因为硬件用<b>补码（two\'s complement）</b>表示负数，' +
      '加法器不用区分正负，速度快、电路简单，而 Java 为了性能<b>不做溢出检查</b>。'
    },

    { t: 'svg', maxW: 660, caption: '32 位补码是个环：最大值 +1 绕到最小值，最小值 -1 绕回最大值。', html:
`<svg viewBox="0 0 680 250" role="img" aria-label="int 溢出回绕示意图">
  <defs>
    <marker id="ch02-arw2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
      <path d="M0,0 L10,5 L0,10 z" fill="var(--warn)"/>
    </marker>
  </defs>
  <rect x="24" y="70" width="190" height="80" rx="8" fill="var(--bg2)" stroke="var(--accent)"/>
  <text x="119" y="100" font-size="12" text-anchor="middle" fill="var(--text2)">2147483647</text>
  <text x="119" y="124" font-size="11" text-anchor="middle" fill="var(--text3)">int 最大值</text>

  <rect x="340" y="70" width="190" height="80" rx="8" fill="var(--bg2)" stroke="var(--warn)"/>
  <text x="435" y="100" font-size="12" text-anchor="middle" fill="var(--text2)">-2147483648</text>
  <text x="435" y="124" font-size="11" text-anchor="middle" fill="var(--text3)">int 最小值</text>

  <line x1="222" y1="92" x2="332" y2="92" stroke="var(--warn)" stroke-width="1.8" marker-end="url(#ch02-arw2)"/>
  <text x="277" y="80" font-size="12" text-anchor="middle" fill="var(--warn)">+1</text>
  <text x="277" y="116" font-size="10" text-anchor="middle" fill="var(--text3)">进位被丢掉</text>

  <line x1="332" y1="132" x2="222" y2="132" stroke="var(--ok)" stroke-width="1.8" marker-end="url(#ch02-arw2)"/>
  <text x="277" y="152" font-size="12" text-anchor="middle" fill="var(--ok)">-1</text>
  <text x="277" y="172" font-size="10" text-anchor="middle" fill="var(--text3)">借位绕回来</text>

  <text x="24" y="214" font-size="12" fill="var(--text2)">补码把加法器和减法器合成一个：a - b 就是 a + (-b)，</text>
  <text x="24" y="236" font-size="12" fill="var(--text2)">代价是范围只有 2³² 个位置，越界就会绕到另一头。</text>
</svg>`
    },

    { t: 'code', caption: 'Overflow.java —— 点「单步」看 max 怎么变成负数', trace: true, code:
`public class Overflow {
    public static void main(String[] args) {
        int max = 2147483647;              // int 的最大值
        System.out.println(max);           // 2147483647

        max = max + 1;                     // 溢出：回绕到最小值
        System.out.println(max);           // -2147483648

        int min = -2147483647 - 1;          // 直接写 -2147483648 在部分环境有坑
        min = min - 1;                      // 往另一个方向溢出
        System.out.println(min);           // 2147483647

        long safe = 2147483647L + 1L;      // long 有位可用，不会溢出
        System.out.println(safe);          // 2147483648

        int product = 50000 * 50000;       // 两个 int 相乘，结果还是 int
        System.out.println(product);       // -1794967296

        long real = 50000L * 50000L;       // 先转 long 再乘
        System.out.println(real);          // 2500000000
    }
}
` },

    { t: 'callout', kind: 'warn', title: '溢出不会抛异常', html:
      '这段代码会<b>正常打印</b>一正一负几个数，不会崩溃。所以"程序跑通了"不等于"结果是对的"。' +
      '修法有三条：① 提前换成 <code>long</code>（<code>50000L * 50000L</code>）；' +
      '② 相乘前用 <code>(long) a * b</code> 先转换；' +
      '③ 累加前判断 <code>if (total &gt; Integer.MAX_VALUE - x)</code>。阶乘、大数求和、日期换算最容易翻车。'
    },

    { t: 'keypoint', items: [
      { title: '检查点 · 整除与取模', html: '能预测 <code>7/2</code>、<code>-7/2</code>、<code>-7%2</code>、<code>1/2.0</code> 的结果并解释符号规则。' },
      { title: '检查点 · 溢出', html: '能算出 <code>int</code> 最大值 +1 的结果，并说出用 long 或先强转来避免。' }
    ] },

    /* ---------------------------------------------------------------- 六 */
    { t: 'h', text: '六、浮点数的二进制误差', id: 'ch02-8' },

    { t: 'p', html:
      '整数在计算机里是精确的，小数不是。0.1 用二进制写是 <code>0.0001100110011…</code>，无限循环——' +
      '和十进制里 1/3 = 0.333… 一个道理。64 位 <code>double</code> 只能存前 52 位尾数，剩下的被截断，' +
      '所以 <code>0.1</code> 存进去的其实是一个极接近但不等同于 0.1 的数。误差很小，但会累积，也会在比较时暴露。'
    },

    { t: 'code', caption: 'FloatError.java —— 误差从哪来、怎么比较才对', code:
`public class FloatError {
    public static void main(String[] args) {
        System.out.println(0.1 + 0.2);          // 0.30000000000000004
        System.out.println(0.1 + 0.2 == 0.3);   // false
        System.out.println(1.0 - 0.9);          // 0.09999999999999998
        System.out.println(0.5 + 0.25);         // 0.75：分母是 2 的幂，精确

        double sum = 0.0;
        for (int i = 0; i < 10; i++) {
            sum = sum + 0.1;                    // 每次加都不精确，误差累积
        }
        System.out.println(sum);                // 0.9999999999999999
        System.out.println(Math.abs(sum - 1.0) < 0.000000001);  // true：容差比较
        System.out.printf("%.2f%n", sum);       // 1.00：显示时四舍五入
    }
}
` },

    { t: 'callout', kind: 'warn', title: '浮点数不要用 == 比较', html:
      '正确做法是<b>看差值是否足够小</b>：<code>Math.abs(a - b) &lt; 1e-9</code>（叫容差比较）。' +
      '如果只是要"看起来对"，用 <code>printf("%.2f")</code> 在<b>输出时</b>四舍五入即可，不要为了显示去改存储的值。<br>' +
      '另外 <code>float</code> 只有约 7 位有效数字，<code>double</code> 约 15 位；这就是为什么金额计算要用 ' +
      '<code>BigDecimal</code> 或"以分为单位存整数"，而不是直接 <code>double</code>。'
    },

    { t: 'keypoint', items: [
      { title: '检查点 · 原因', html: '能用"二进制无法精确表示 0.1"解释 <code>0.1 + 0.2 == 0.3</code> 为什么是 false。' },
      { title: '检查点 · 做法', html: '知道比较浮点用容差、显示用 <code>printf</code>，并且能说出哪些小数是精确的（分母为 2 的幂）。' }
    ] },

    /* ---------------------------------------------------------------- 七 */
    { t: 'h', text: '七、String：不可变的字符序列', id: 'ch02-6' },

    { t: 'p', html:
      '<code>String</code> 用起来像基本类型（可以直接写 <code>"hello"</code>），但它其实是<b>引用类型（reference type）</b>，是一个类。' +
      '它存储<b>不可变（immutable）</b>的字符序列：所有看起来"修改"字符串的方法，都返回一个<b>新字符串</b>，原对象纹丝不动。' +
      '所以 <code>s.toUpperCase();</code> 单独一行等于白写，必须 <code>s = s.toUpperCase();</code>。'
    },

    { t: 'p', html:
      '为什么设计成不可变？① 可以安全共享——同一个字面量在常量池里只存一份；' +
      '② 可以放心当哈希表的键，内容不变哈希值就不变；③ 多线程同时读不会出问题。' +
      '代价是频繁拼接会产生大量临时对象，循环里拼字符串应该用 <code>StringBuilder</code>。'
    },

    { t: 'svg', maxW: 660, caption: '字面量 "hello" 在常量池里只有一份，a、b 指向它；new String 另建一个堆对象，c 指向新对象。', html:
`<svg viewBox="0 0 680 300" role="img" aria-label="字符串常量池与堆对象">
  <defs>
    <marker id="ch02-arw3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
      <path d="M0,0 L10,5 L0,10 z" fill="var(--accent2)"/>
    </marker>
  </defs>
  <text x="20" y="28" font-size="13" font-weight="700" fill="var(--accent)">栈 Stack</text>
  <rect x="20" y="44" width="180" height="50" rx="6" fill="var(--surface2)" stroke="var(--line2)"/>
  <text x="34" y="74" font-size="12" fill="var(--text2)">String a</text>
  <text x="140" y="74" font-size="12" fill="var(--accent2)">→ #0</text>
  <rect x="20" y="104" width="180" height="50" rx="6" fill="var(--surface2)" stroke="var(--line2)"/>
  <text x="34" y="134" font-size="12" fill="var(--text2)">String b</text>
  <text x="140" y="134" font-size="12" fill="var(--accent2)">→ #0</text>
  <rect x="20" y="164" width="180" height="50" rx="6" fill="var(--surface2)" stroke="var(--line2)"/>
  <text x="34" y="194" font-size="12" fill="var(--text2)">String c</text>
  <text x="140" y="194" font-size="12" fill="var(--accent2)">→ #1</text>

  <text x="280" y="28" font-size="13" font-weight="700" fill="var(--accent2)">常量池 / 堆</text>
  <rect x="280" y="44" width="230" height="66" rx="6" fill="var(--bg2)" stroke="var(--accent)"/>
  <text x="296" y="70" font-size="12" font-weight="700" fill="var(--accent)">#0 "hello"</text>
  <text x="296" y="94" font-size="11" fill="var(--text3)">字面量，全程序共用一份</text>

  <rect x="280" y="160" width="230" height="66" rx="6" fill="var(--bg2)" stroke="var(--warn)"/>
  <text x="296" y="186" font-size="12" font-weight="700" fill="var(--warn)">#1 "hello"</text>
  <text x="296" y="210" font-size="11" fill="var(--text3)">new String(...) 新造的对象</text>

  <line x1="204" y1="69" x2="272" y2="69" stroke="var(--accent2)" stroke-width="1.5" marker-end="url(#ch02-arw3)"/>
  <line x1="204" y1="129" x2="272" y2="85" stroke="var(--accent2)" stroke-width="1.5" marker-end="url(#ch02-arw3)"/>
  <line x1="204" y1="189" x2="272" y2="189" stroke="var(--accent2)" stroke-width="1.5" marker-end="url(#ch02-arw3)"/>

  <text x="280" y="264" font-size="12" fill="var(--text2)">a == b 是 true（同一个 #0）；a == c 是 false（#0 ≠ #1）。</text>
  <text x="280" y="286" font-size="12" fill="var(--text2)">但 a.equals(c) 仍然是 true：内容一样。</text>
  <text x="20" y="252" font-size="11" fill="var(--text3)">两个对象，</text>
  <text x="20" y="270" font-size="11" fill="var(--text3)">三段内容相同</text>
</svg>`
    },

    { t: 'code', caption: 'Equality.java —— 内容相同，比较方式不同', code:
`public class Equality {
    public static void main(String[] args) {
        String a = "hello";
        String b = "hello";                // 字面量复用常量池里的同一个对象
        String c = new String("hello");    // new 一定造新对象
        String e = "hel";
        String f = e + "lo";               // 运行时拼接：新对象

        System.out.println(a == b);        // true   同一个对象
        System.out.println(a == c);        // false  内容相同，地址不同
        System.out.println(a == f);        // false  运行时拼出来的新对象
        System.out.println(a.equals(c));   // true   比内容
        System.out.println(a.equals(f));   // true
        System.out.println(a.compareTo(a));       // 0
        System.out.println(a.compareTo("help") < 0);  // true：h-e-l-l-o 排在 help 前
    }
}
` },

    { t: 'callout', kind: 'warn', title: '== 比的是"是不是同一个对象"', html:
      '<code>==</code> 比<b>引用是否相同</b>（地址），<code>equals</code> 比<b>内容是否相同</b>。' +
      '字符串字面量会被复用（常量池），所以 <code>"hi" == "hi"</code> 常常是 true；' +
      '但一旦 <code>new</code> 出来、或在运行时拼接出来，<code>==</code> 就变了。' +
      '<b>结论：比较字符串内容永远用 <code>equals</code>。</b>这在第 09 章会从内存图角度再讲一次。'
    },

    { t: 'keypoint', items: [
      { title: '检查点 · 不可变', html: '能解释 <code>s.toUpperCase()</code> 为什么必须写 <code>s = ...</code>，以及循环拼接为什么慢。' },
      { title: '检查点 · 常量池', html: '能画出 a、b、c 三个变量指向哪两个对象，并预测 <code>==</code> 与 <code>equals</code> 的结果。' }
    ] },

    /* ---------------------------------------------------------------- 八 */
    { t: 'h', text: '八、String 常用方法地图', id: 'ch02-9' },

    { t: 'p', html:
      'String 的方法很多，真正要掌握的是<b>三个动作</b>：<b>查</b>（<code>indexOf</code> / <code>contains</code> / <code>startsWith</code> / <code>endsWith</code>）、' +
      '<b>切</b>（<code>substring</code> / <code>charAt</code> / <code>split</code> / <code>trim</code>）、' +
      '<b>改</b>（<code>replace</code> / <code>toUpperCase</code>）。' +
      '每个方法都有两个必须记的细节：下标从 0 开始，区间一律"左闭右开"（含头不含尾）。'
    },

    { t: 'table',
      head: ['方法', '作用', '例子 → 结果'],
      rows: [
        ['<code>length()</code>', '字符个数（含空格）', '<code>"hi".length()</code> → <code>2</code>'],
        ['<code>charAt(i)</code>', '第 i 个字符（下标从 0 起）', '<code>"Java".charAt(1)</code> → <code>a</code>'],
        ['<code>substring(a,b)</code>', '截取 [a, b) 区间', '<code>"Hello".substring(1,3)</code> → <code>el</code>'],
        ['<code>indexOf(s)</code>', '首次出现位置，找不到返回 −1', '<code>"Hello".indexOf("l")</code> → <code>2</code>'],
        ['<code>contains(s)</code>', '是否包含子串', '<code>"Hello".contains("ell")</code> → <code>true</code>'],
        ['<code>equals(s)</code>', '内容是否相同', '<code>"a".equals("a")</code> → <code>true</code>'],
        ['<code>compareTo(s)</code>', '按字典序比较：负数/0/正数', '<code>"apple".compareTo("banana")</code> → 负数'],
        ['<code>toUpperCase()</code>', '转大写，返回新串', '<code>"ab".toUpperCase()</code> → <code>AB</code>'],
        ['<code>trim()</code>', '去掉两端空白', '<code>" hi ".trim()</code> → <code>hi</code>'],
        ['<code>split(regex)</code>', '按分隔符切成数组', '<code>"a,b".split(",")</code> → 长度 2'],
        ['<code>startsWith(s)</code>', '是否以 s 开头（区分大小写）', '<code>"report.pdf".startsWith("rep")</code> → <code>true</code>'],
        ['<code>endsWith(s)</code>', '是否以 s 结尾（判断扩展名）', '<code>"a.png".endsWith(".jpg")</code> → <code>false</code>'],
        ['<code>replace(a,b)</code>', '把所有 a 替换成 b，返回新串', '<code>"a-b-c".replace("-","+")</code> → <code>a+b+c</code>'],
        ['<code>isEmpty()</code>', '长度是否为 0', '<code>"".isEmpty()</code> → <code>true</code>']
      ],
      caption: '前 8 个是最常用的；后 6 个是期末读程序题的常客——尤其是 startsWith / endsWith / replace / compareTo' },

    { t: 'code', caption: 'StringMethods.java —— 14 个方法各跑一次', code:
`public class StringMethods {
    public static void main(String[] args) {
        String s = "  Hello Java  ";

        System.out.println(s.length());                 // 14：空格也算字符
        System.out.println(s.trim().length());          // 10：去掉两端空白
        System.out.println(s.trim().toUpperCase());     // HELLO JAVA
        System.out.println(s.trim().toLowerCase());     // hello java
        System.out.println(s.substring(2, 7));          // Hello：区间 [2,7)
        System.out.println(s.indexOf("Java"));          // 8
        System.out.println(s.indexOf("Python"));        // -1：找不到
        System.out.println(s.contains("Java"));         // true
        System.out.println("abc".charAt(1));            // b：下标从 0 起
        System.out.println("a,b,c".split(",").length);  // 3
        System.out.println("a-b-c".replace("-", "+"));  // a+b+c：返回新串
        System.out.println("report.pdf".startsWith("rep"));  // true
        System.out.println("report.pdf".endsWith(".pdf"));   // true，区分大小写
        System.out.println("".isEmpty());               // true
        System.out.println("apple".compareTo("banana") < 0);  // true：按字典序
    }
}
` },

    { t: 'callout', kind: 'tip', title: '字符串题的两个高频变形', html:
      '① <b>删除字符 / 保字母</b>：遍历 + <code>charAt</code> 判断 + 拼接，注意拼接结果要赋回变量；' +
      '② <b>回文 / 反转</b>：双指针从两头向中间比，循环条件是 <code>i &lt; j</code> 而不是 <code>i &lt;= j</code>（奇数长度时中间那个字符不用比）。<br>' +
      '还有三个小陷阱：<code>substring(a, b)</code> 的 b 可以等于 <code>length()</code>，但不能超过；' +
      '<code>charAt(length())</code> 会抛 <code>StringIndexOutOfBoundsException</code>；' +
      '<code>split</code> 的参数是正则，切 <code>"|"</code>、<code>"."</code> 这种字符要先转义。'
    },

    { t: 'code', caption: 'StringAlgos.java —— 最长公共前缀、删字符、回文（第 03 章会讲循环，这里先照着读）', code:
`public class StringAlgos {
    // 1) 最长公共前缀：先假设第一个单词就是答案，再逐个单词修剪
    public static String lcp(String[] words) {
        String prefix = words[0];
        for (int i = 1; i < words.length; i++) {
            while (!words[i].startsWith(prefix)) {      // 不是前缀就砍掉最后一位
                prefix = prefix.substring(0, prefix.length() - 1);
                if (prefix.isEmpty()) return "";
            }
        }
        return prefix;
    }

    // 2) 删除所有指定字符：逐位检查，不是目标字符就留下
    public static String removeChar(String s, char target) {
        String result = "";
        for (int i = 0; i < s.length(); i++) {
            if (s.charAt(i) != target) {
                result = result + s.charAt(i);
            }
        }
        return result;
    }

    // 3) 回文判断：双指针从两头往中间比
    public static boolean isPalindrome(String s) {
        int i = 0, j = s.length() - 1;
        while (i < j) {
            if (s.charAt(i) != s.charAt(j)) return false;
            i++;
            j--;
        }
        return true;
    }

    public static void main(String[] args) {
        String[] words = {"flower", "flow", "flight"};
        System.out.println("lcp = " + lcp(words));                    // fl
        System.out.println("remove = " + removeChar("banana", 'a'));  // bnn
        System.out.println("pal = " + isPalindrome("level"));         // true
        System.out.println("pal2 = " + isPalindrome("java"));         // false
    }
}
` },

    { t: 'keypoint', items: [
      { title: '检查点 · 左闭右开', html: '能算出 <code>"Hello".substring(1, 3)</code> 是 <code>el</code>，并说出 <code>charAt</code> 越界的后果。' },
      { title: '检查点 · 查切改', html: '拿到"判断扩展名 / 取年份 / 去空格"的需求，能立刻选出对应方法。' }
    ] },

    /* ---------------------------------------------------------------- 九 */
    { t: 'h', text: '九、格式化输出：printf 与 String.format', id: 'ch02-10' },

    { t: 'p', html:
      '<code>System.out.println</code> 只会把值原样打印，做不出对齐的表格。<b>格式化输出</b>用 <code>printf</code>：' +
      '第一个参数是<b>格式串（format string）</b>，里面的 <code>%</code> 占位符按顺序被后面的实参替换。' +
      '两种常用写法：<code>System.out.printf(...)</code> 直接打印，<code>String.format(...)</code> 返回字符串还能继续加工。'
    },

    { t: 'table',
      head: ['占位符', '含义', '例子'],
      rows: [
        ['<code>%d</code>', '整数', '<code>printf("%d", 42)</code> → <code>42</code>'],
        ['<code>%s</code>', '字符串（任何对象都行）', '<code>printf("%s", "ok")</code> → <code>ok</code>'],
        ['<code>%f / %.2f</code>', '小数 / 保留两位', '<code>printf("%.2f", 3.14159)</code> → <code>3.14</code>'],
        ['<code>%c</code>', '单个字符', '<code>printf("%c", \'A\')</code> → <code>A</code>'],
        ['<code>%b</code>', '布尔值', '<code>printf("%b", true)</code> → <code>true</code>'],
        ['<code>%5d / %-5d</code>', '宽度 5、右对齐 / 左对齐', '<code>printf("[%5d]", 42)</code> → <code>[   42]</code>'],
        ['<code>%05d</code>', '宽度 5、补前导零', '<code>printf("%05d", 42)</code> → <code>00042</code>'],
        ['<code>%n</code>', '换行（跨平台）', '<code>printf("a%nb")</code> → 两行']
      ],
      caption: '宽度写在 % 与字母之间；负号表示左对齐，0 表示用零填充。格式串里要输出百分号本身，写 %%' },

    { t: 'code', caption: 'PrintfDemo.java —— 对齐、补零、精度与 String.format', code:
`public class PrintfDemo {
    public static void main(String[] args) {
        String name = "Alice";
        int score = 92;
        double gpa = 3.14159;

        // %s 字符串、%d 整数、%.2f 保留两位小数；%n 换行（跨平台写法）
        System.out.printf("%-8s|%5d|%.2f%n", name, score, gpa);
        System.out.printf("%-8s|%5d|%.2f%n", "Bob", 7, 2.0);
        System.out.printf("%05d%n", 42);              // 00042：补前导零
        System.out.printf("%.1f %.0f%n", 2.46, 2.4);  // 2.5 2：显示时才四舍五入
        System.out.printf("%c %b %s%n", 'A', true, "ok");
        System.out.printf("%% 就是百分号%n");          // %% 输出一个 %

        String row = String.format("%-6s %3d", "Lily", 100);
        System.out.println("[" + row + "]");
        System.out.println(String.format("%d + %d = %d", 3, 4, 3 + 4));
    }
}
` },

    { t: 'callout', kind: 'warn', title: '占位符与实参必须一一对应', html:
      '<code>%d</code> 传了 <code>double</code>、或 <code>%.2f</code> 传了 <code>int</code>，运行时直接抛 ' +
      '<code>IllegalFormatConversionException</code>；实参个数少于占位符也会抛异常。' +
      '写的时候按"数一数几个 <code>%</code>、对一对几个参数"检查。' +
      '另外 <code>%.2f</code> 的四舍五入发生在<b>显示</b>，变量本身的值没有被改。'
    },

    { t: 'keypoint', items: [
      { title: '检查点 · 占位符', html: '能写出 <code>%d</code>、<code>%s</code>、<code>%.2f</code>、<code>%5d</code>、<code>%-5d</code>、<code>%05d</code>、<code>%n</code> 的含义。' },
      { title: '检查点 · 两种写法', html: '知道 <code>printf</code> 直接输出、<code>String.format</code> 返回字符串，并能用后者拼表格行。' }
    ] },

    /* ---------------------------------------------------------------- 十 */
    { t: 'h', text: '十、边界与反例：六个常见误解' },

    { t: 'p', html:
      '下面六条是卷面上最常被写成"正确"的错误说法。每条都对应本章一个具体规则，考前对照一遍比刷十道题有用。'
    },

    { t: 'table',
      head: ['常见误解', '真相', '怎么记'],
      rows: [
        ['<code>1 / 2</code> 得 <code>0.5</code>', '得 <code>0</code>：两个 int 整除先截断，结果再赋给 double 也是 0.0', '想带小数就写 <code>1 / 2.0</code> 或先强转'],
        ['<code>(int) 3.9</code> 得 <code>4</code>', '得 <code>3</code>：强转是截断，要四舍五入用 <code>Math.round</code>', '截断 ≠ 四舍五入'],
        ['<code>int max = 2147483647 + 1;</code> 是 <code>2147483648</code>', '溢出回绕成 <code>-2147483648</code>，答案永远超不出 int 范围', '先想范围再算'],
        ['<code>"a" == "a"</code> 恒为 true，所以 <code>==</code> 能比字符串', '只对字面量碰巧成立；<code>new</code> 或拼接后立刻失效', '比较内容永远用 <code>equals</code>'],
        ['<code>(int) 3.99</code> 与 <code>Math.round(3.99)</code> 都是 4', '前者 3、后者 4；负数时 <code>(int) -3.9</code> 是 -3', '向零取整 vs 四舍五入'],
        ['<code>0.1 + 0.2 == 0.3</code> 是 true', '是 false，差约 <code>5.5e-17</code>', '浮点用容差比较']
      ],
      caption: '这六条覆盖了期中"判断 + 读程序写输出"两类题的绝大部分失分点' },

    { t: 'p', html:
      '再补一个容易混的：<code>Integer.parseInt("123")</code> 把字符串转成 int，但 <code>"12.5"</code> 会抛 ' +
      '<code>NumberFormatException</code>（要小数用 <code>Double.parseDouble</code>）；传入空串、带空格的串同样会抛。' +
      '考试里常见"给定输入 12.5，问哪一行会崩"，答案就是整数解析那一行。'
    },

    /* ---------------------------------------------------------------- 十一 */
    { t: 'h', text: '十一、调试实录：三个真实 bug' },

    { t: 'p', html:
      '这一章的 bug 有个共同点：<b>程序不报错，输出就是不对</b>。它们没法靠"看异常"定位，只能靠固定流程。' +
      '下面三个案例都按同一套三步法走：<b>① 记录症状</b>（实际输出 vs 期望输出）；' +
      '<b>② 找到最可疑的那个表达式</b>（类型在哪一步变了、比较用的是什么）；' +
      '<b>③ 只改一处验证</b>。'
    },

    { t: 'steps', items: [
      { title: '症状：输出与期望差一点', html: '先写下"我要 4.5，实际 4.0"这类具体差距，不要笼统说"算错了"。' },
      { title: '定位：找第一个出错的表达式', html: '看每个中间值的类型：整除发生在哪一步？强转在哪一步？比较用的是 <code>==</code> 还是 <code>equals</code>？' },
      { title: '修复：改类型或改方法', html: '整除丢小数就改 <code>/ 2.0</code>；比内容就把 <code>==</code> 换 <code>equals</code>；溢出就换 <code>long</code>。一次只改一处。' }
    ] },

    { t: 'h', lvl: 3, text: '案例 1：用 == 比较字符串，分支永远走错' },

    { t: 'p', html:
      '需求是"输入 YES 就通过"。代码写 <code>if (input == "YES")</code>，键盘输入明明打了 YES，' +
      '控制台却打印 <code>rejected</code>。症状不是异常，而是分支走错。' +
      '定位方法很直接：先打印 <code>input == "YES"</code> 得到 false，再打印 <code>input.equals("YES")</code> 得到 true——' +
      '说明内容一样、地址不同，问题在比较方式。修复：把条件改成 <code>"YES".equals(input)</code>。' +
      '常量写在前面还顺带解决了 input 为 null 时的空指针。'
    },

    { t: 'h', lvl: 3, text: '案例 2：整除丢小数，平均值永远差一截' },

    { t: 'p', html:
      '求 7 和 2 的平均值，期望 4.5，实际打印 <code>4.0</code>。看方法签名是 <code>double avgBad(int a, int b)</code>，' +
      '问题不在返回值类型，而在 <code>return (a + b) / 2;</code>：先算 <code>9 / 2</code> 得 4，再赋给 double 变成 4.0，' +
      '小数在整除那一步已经永久丢失。定位技巧：在 <code>return</code> 前打印 <code>(a + b) / 2</code>，看到 4 而不是 4.5 就锁定。' +
      '修复：写 <code>(a + b) / 2.0</code>，或 <code>(a + b) / (double) 2</code>。'
    },

    { t: 'h', lvl: 3, text: '案例 3：int 溢出，求和静默变负' },

    { t: 'p', html:
      '对 1 到 65536 求和，正确答案是 2147516416，程序却输出 <code>-2147450880</code>。' +
      '这不是求和逻辑错，而是 <code>int total</code> 装不下结果：累加到一半就越过 2147483647，回绕成负数，后面越加越负。' +
      '定位：打印最终值与手算答案对比，发现符号都不对，立刻怀疑类型宽度。修复：把 <code>total</code> 改成 <code>long</code>，' +
      '或写成 <code>(long) n * (n + 1) / 2</code>。下面这段把三个 bug 的"坏方法"和"好方法"放在一起对照：'
    },

    { t: 'code', caption: 'DebugLab.java —— 三个 bug 的修复前后对比', code:
`public class DebugLab {
    // bug 1：用 == 比较字符串内容，分支永远走 else
    static String checkBad(String input) {
        if (input == "YES") return "accepted";
        return "rejected";
    }
    static String checkGood(String input) {
        if ("YES".equals(input)) return "accepted";   // 常量写前面，还能防 null
        return "rejected";
    }

    // bug 2：先整除、再赋给 double，小数在整除那一步已经丢了
    static double avgBad(int a, int b) {
        return (a + b) / 2;
    }
    static double avgGood(int a, int b) {
        return (a + b) / 2.0;
    }

    // bug 3：int 溢出，静默变负；改 long 就够用
    static int sumBad(int n) {
        int total = 0;
        for (int i = 1; i <= n; i++) total = total + i;
        return total;
    }
    static long sumGood(int n) {
        long total = 0;
        for (int i = 1; i <= n; i++) total = total + i;
        return total;
    }

    public static void main(String[] args) {
        String input = new String("YES");       // 模拟从输入读进来的字符串

        System.out.println(checkBad(input));    // rejected
        System.out.println(checkGood(input));   // accepted
        System.out.println(avgBad(7, 2));       // 4.0：9/2 先算成 4
        System.out.println(avgGood(7, 2));      // 4.5：9/2.0 才是 4.5
        System.out.println(sumBad(65536));      // -2147450880：溢出
        System.out.println(sumGood(65536));     // 2147516416：正确
        System.out.println((long) 65536 * 65537 / 2);  // 2147516416：公式 n(n+1)/2
    }
}
` },

    { t: 'keypoint', items: [
      { title: '检查点 · 三个 bug', html: '能说出每个 bug 是"地址 vs 内容"、"整除 vs 浮点除法"还是"类型宽度"问题，以及对应的修法。' },
      { title: '检查点 · 流程', html: '遇到"能跑但结果不对"的程序，会先打印中间值定位，而不是盲目改代码。' }
    ] },

    /* ---------------------------------------------------------------- 案例 A */
    { t: 'h', text: '十二、完整案例 A：学生成绩单格式化输出', id: 'ch02-case-a' },

    { t: 'p', html:
      '下面这份成绩单程序把本章九成知识点串在一起：常量、整除与浮点除法、<code>char</code> 运算、' +
      '三元嵌套、<code>String</code> 的 <code>trim / substring / toUpperCase</code>、<code>printf</code> 对齐，以及边界处理。' +
      '读之前先预测：<code>avg</code> 是多少？<code>grade((int) avg)</code> 与 <code>grade(Math.round(avg))</code> 会不会不同？'
    },

    { t: 'code', caption: 'GradeSheet.java —— 一个学生的成绩单：类型转换 + 字符串处理 + 格式化 + 边界', code:
`public class GradeSheet {
    static final String SCHOOL = "计算机科学与 Java 编程导论";
    static final int PASS = 60;

    // 分数换算等级：三元嵌套，从高到低判断，顺序不能乱
    static String grade(int score) {
        return score >= 90 ? "A"
             : score >= 80 ? "B"
             : score >= 70 ? "C"
             : score >= PASS ? "D"
             : "F";
    }

    // 平均分：先用 double 除，否则 227 / 3 会先变成 75，小数永远回不来
    static double average(int a, int b, int c) {
        return (a + b + c) / 3.0;
    }

    // 整理姓名：去空白、首字母大写、其余小写；空串有专门返回值
    static String tidyName(String raw) {
        String name = raw.trim();
        if (name.isEmpty()) return "(unknown)";
        return name.substring(0, 1).toUpperCase()
             + name.substring(1).toLowerCase();
    }

    public static void main(String[] args) {
        String rawName = "  alice ";
        int java = 92, math = 78, english = 57;
        int total = java + math + english;
        double avg = average(java, math, english);
        String name = tidyName(rawName);

        System.out.println(SCHOOL + " REPORT");
        System.out.printf("name  : %s%n", name);
        System.out.printf("java  : %3d  grade %s%n", java, grade(java));
        System.out.printf("math  : %3d  grade %s%n", math, grade(math));
        System.out.printf("eng   : %3d  grade %s%n", english, grade(english));
        System.out.printf("total : %3d / 300%n", total);
        System.out.printf("avg   : %.2f%n", avg);
        System.out.printf("avg as int : %d  -> grade %s%n", (int) avg, grade((int) avg));
        System.out.printf("name  : %d chars, first letter %c%n", name.length(), name.charAt(0));

        // 边界：缺考记 0 分；空名字；四舍五入与截断只差一分却可能差一个等级
        System.out.printf("missing -> grade %s%n", grade(0));
        System.out.println("empty name -> " + tidyName("   "));
        System.out.println("59.9 round -> " + Math.round(59.9) + ", cast -> " + (int) 59.9);
    }
}
` },

    { t: 'p', html:
      '输出里有三处值得细看。① <code>avg</code> 是 <code>75.67</code>：<code>(92 + 78 + 57) / 3.0</code> 保留小数，' +
      '若写成 <code>/ 3</code> 就会先得 75、再变成 75.0。' +
      '② <code>(int) avg</code> 是 75，等级 C，和 <code>Math.round</code> 的 76 一样落在 C 档——但换成 59.x 就会差一个等级，' +
      '这就是最后一行 <code>59.9 round -> 60, cast -> 59</code> 想提醒的：<b>及格线附近，截断与四舍五入会给出相反的结论</b>。' +
      '③ <code>tidyName</code> 对空串返回 <code>(unknown)</code>，而不是让 <code>charAt(0)</code> 抛越界异常——边界先处理，是写方法的好习惯。'
    },

    /* ---------------------------------------------------------------- 案例 B */
    { t: 'h', text: '十三、完整案例 B：身份证 / 学号解析', id: 'ch02-case-b' },

    { t: 'p', html:
      '第二个案例全部围绕"字符串切片 + 字符转数字"。身份证 18 位的结构是：6 位地址码 + 8 位生日 + 3 位顺序码 + 1 位校验码。' +
      '解析它只需要 <code>substring</code>、<code>charAt</code>、<code>charAt - \'0\'</code>、<code>String.format</code> 这几样，' +
      '但每一步都踩在"下标从 0 开始、区间左闭右开"上。校验码那一段用到数组与循环，第 03 章会正式讲，这里先照结构读。'
    },

    { t: 'code', caption: 'StudentId.java —— 切片、字符转数字、取模校验与格式化', code:
`public class StudentId {
    // 身份证 18 位 = 6 位地址码 + 8 位生日 + 3 位顺序码 + 1 位校验码
    static final String ID = "320101200501011238";

    static String area(String id) {
        return id.substring(0, 6);
    }

    // 生日在第 7~14 位（下标 6~13），分别取 4+2+2 位再拼日期
    static String birth(String id) {
        String y = id.substring(6, 10);
        String m = id.substring(10, 12);
        String d = id.substring(12, 14);
        return y + "-" + m + "-" + d;
    }

    // 第 17 位（下标 16）奇数男、偶数女；char - '0' 把字符转成数字
    static String gender(String id) {
        int code = id.charAt(16) - '0';
        return code % 2 == 1 ? "male" : "female";
    }

    // 校验码：前 17 位加权求和，% 11 查表 10X98765432
    static char checkCode(String id) {
        int[] weight = {7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2};
        String table = "10X98765432";
        int sum = 0;
        for (int i = 0; i < 17; i++) {
            sum = sum + (id.charAt(i) - '0') * weight[i];
        }
        return table.charAt(sum % 11);
    }

    public static void main(String[] args) {
        System.out.println("id     : " + ID);
        System.out.println("length : " + ID.length());
        System.out.println("area   : " + area(ID));
        System.out.println("birth  : " + birth(ID));
        System.out.println("gender : " + gender(ID));
        System.out.println("check  : " + checkCode(ID) + " vs given " + ID.charAt(17));
        System.out.println("valid  : " + (checkCode(ID) == ID.charAt(17)));

        // 学号：2024CSC0207 = 年份 4 位 + 专业 3 位 + 序号 4 位
        String sid = "2024CSC0207";
        System.out.println("year   : " + sid.substring(0, 4));
        System.out.println("major  : " + sid.substring(4, 7));
        System.out.println("no     : " + Integer.parseInt(sid.substring(7)));
        System.out.println("next   : " + String.format("%s%04d", sid.substring(0, 7), 8));
        System.out.println("is csc : " + sid.startsWith("2024CSC"));
    }
}
` },

    { t: 'p', html:
      '几个细节：① 生日用 <code>substring(6, 10)</code> 取年份——第 7 位字符的下标是 6，<code>substring</code> 的右边界不含，' +
      '所以取 4 个字符写 <code>(6, 10)</code>。② <code>id.charAt(16) - \'0\'</code> 是把字符 <code>\'3\'</code> 转成数字 3 的标准写法，' +
      '直接强转 <code>(int) id.charAt(16)</code> 得到的是 51，不是 3。' +
      '③ 校验码用 <code>% 11</code> 查表，<code>sum % 11</code> 的范围是 0~10，最后一位可能是 <code>X</code>。' +
      '④ <code>Integer.parseInt</code> 要求整个串都是数字，<code>"0207"</code> 可以，<code>" 207"</code> 会抛异常，所以先 <code>trim</code>。'
    },

    /* ---------------------------------------------------------------- 收尾 */
    { t: 'h', text: '教材对照：§1.2 内置类型与类型转换', id: 'ch02-11' },

    { t: 'p', html:
      '教材 §1.2 只讲三件事：五种<b>内置类型</b>（int、double、boolean、char、String）、它们之间的<b>类型转换</b>、' +
      '以及 Math 库。它刻意只挑五种，理由是"其余类型用不到，先别分散注意力"。' +
      '本站 ch02 把八种原始类型都摆出来了——不是为了背，而是为了看清每种类型占多少位、什么时候会丢精度。'
    },

    { t: 'table',
      head: ['教材的"内置类型"', '本站的位置', '一句话提醒'],
      rows: [
        ['<code>int</code>', '八种原始类型之一（32 位）', '教材默认的整数类型；除法会截断小数'],
        ['<code>double</code>', '八种原始类型之一（64 位）', '教材默认的小数类型；0.1+0.2 不等于 0.3'],
        ['<code>boolean</code>', '八种原始类型之一', '只有 true / false，不能和整数互转'],
        ['<code>char</code>', '八种原始类型之一（16 位）', '单引号里放一个字符；本质是无符号整数'],
        ['<code>String</code>', '是<b>类</b>，不是原始类型', '教材为了行文方便把它混在"内置类型"里讲']
      ],
      caption: '考试若问"Java 有几种原始类型"，答 8 种；教材说的"五种内置类型"是教学口径，不是语法定义' },

    { t: 'code', caption: '教材 Program 1.2.4 闰年判断：原书跑 2004 得 true、1900 得 false、2000 得 true；这里预置 2004', args: ['2004'], code:
`public class LeapYear {
    public static void main(String[] args) {
        int year = Integer.parseInt(args[0]);
        boolean isLeapYear = (year % 4 == 0);
        isLeapYear = isLeapYear && (year % 100 != 0);
        isLeapYear = isLeapYear || (year % 400 == 0);
        System.out.println(isLeapYear);
    }
}
` },

    { t: 'p', html:
      '这段程序是教材"用布尔变量一步步收紧条件"的样板：先假设"能被 4 整除就是闰年"，' +
      '再用被 100 整除排除、用被 400 整除补回。每一步都赋值给同一个 <code>boolean</code> 变量，' +
      '读代码时按顺序往下看即可，不需要一口气理解整个复合条件。' +
      '本站 ch03 的布尔运算会再讲这套写法，那里你会遇到同样的"层层收窄"结构。<br><br>教材还埋了三个容易在考试里出现的细节，本站 ch02 都已经展开过，这里用教材的话再对一遍：' +
      '① <b>整数除法截断</b>——<code>(1 + 2 + 3 + 4) / 4</code> 的结果是 <code>2</code> 而不是 <code>2.5</code>，' +
      '因为两个 int 相除结果还是 int；② <b>三种转换</b>——自动转换（小范围到大范围，如 int→double）、' +
      '强制转换（<code>(int) 3.9</code> 得 3，直接截断）、解析转换（<code>Integer.parseInt("42")</code>）；' +
      '③ <b>溢出回绕</b>——<code>int</code> 最大 2147483647，再加 1 会变成 <code>-2147483648</code>，' +
      '不会报错，只会静默出错。<br><br>教材 §1.2 的第三块是 <b>Math 库</b>。它只列了最常用的几个方法：<code>Math.abs</code>、<code>Math.max</code>、' +
      '<code>Math.min</code>、<code>Math.sqrt</code>、<code>Math.pow</code>，以及 <code>Math.random</code>。' +
      '注意这些方法都是 <b>static</b> 的：用类名直接调用 <code>Math.sqrt(2.0)</code>，不需要先 <code>new</code> 一个 Math 对象。' +
      '教材在这里只是顺带一提，ch06 讲"方法"时会解释 static 到底意味着什么。' +
      '<code>Math.random()</code> 返回 <code>[0, 1)</code> 之间的 double，教材常用 <code>(int)(Math.random() * n)</code> 造出 0 到 n−1 的随机整数——' +
      '这个写法本站 ch05 的随机模拟还会再用。<br><br>最后提醒一句：别被"内置类型"这个说法带偏——教材把 String 和四种原始类型并列，是为了让你先建立"值有类型"的直觉，' +
      '但 String 是<b>引用类型</b>：变量里存的是对象的地址，不是字符本身。' +
      '这个区别在 ch06 传参、ch07 类与对象里会变得关键；现在只要记住：' +
      '"五种内置类型"是教材的讲法，"八种原始类型 + 引用类型"才是 Java 的语法事实。'
    },

    { t: 'h', text: '即时练习' },

    { t: 'quiz', qid: 'ch02-q9' },
    { t: 'quiz', qid: 'ch02-q1' },
    { t: 'quiz', qid: 'ch02-q2' },
    { t: 'quiz', qid: 'ch02-q3' },

    { t: 'p', html:
      '做题时先自己写出每一行的结果，再点开解析。这个顺序很重要：先预测、再验证，才能把"以为懂了"和"真的懂了"分开。'
    },

    { t: 'lab', id: 'string' },

    { t: 'p', html:
      '下面这个实验台把变量一步步的变化画出来。第 03 章学循环后，你会反复回到这里看"每一轮之后变量是什么"。'
    },

    { t: 'lab', id: 'trace' },

    { t: 'callout', kind: 'exam', title: '这一章在考试里怎么考', html:
      '这是期中"读代码写输出"题的主战场，五类必刷：<br>' +
      '① <b>混合运算</b>：<code>7 / 2</code>、<code>-7 % 2</code>、<code>1 / 2.0</code>、<code>(double) 1 / 2</code> 这类题，Mock A 第 4 题与 B 卷第 3 题都考过同一套规则；<br>' +
      '② <b>自增参与表达式</b>：<code>i++</code> 与 <code>++i</code> 混在一个表达式里，按从左到右逐个求值；<br>' +
      '③ <b>int 溢出</b>：给一个加法或乘法，问结果；答案一定落在 int 范围内，超出就回绕；<br>' +
      '④ <b>强转与四舍五入</b>：<code>(int) 3.99</code> vs <code>Math.round(3.99)</code>，注意负数方向；<br>' +
      '⑤ <b><code>==</code> vs <code>equals</code></b>：给字面量、<code>new</code>、拼接三种写法，问哪几行是 true。<br>' +
      '<b>看到题先做什么</b>：不要急着拍答案，先在草稿纸写两列——左列变量名与类型，右列每步的值；' +
      '凡是看到 <code>/</code>、<code>%</code>、<code>(类型)</code>、<code>==</code> 四个符号，各停一秒问"类型是什么、比的是什么"。' +
      '最后用"数量级检查"验收：int 的结果不该超过 21 亿，平均值不该小于最小值。'
    },

    { t: 'keypoint', items: [
      { title: '变量', html: '有名字的内存空间；局部变量必须先赋值再读，<code>final</code> 只赋值一次。' },
      { title: '类型', html: '8 种基本类型；整数默认 int、小数默认 double，写 long 加 L、float 加 f。' },
      { title: '溢出', html: 'int 最大值 +1 回绕成最小值，不报错；用 long 或先强转避免。' },
      { title: '整除与取模', html: '整除向零截断，<code>%</code> 的符号跟被除数；<code>1 / 2</code> 是 0。' },
      { title: '转换', html: '小 → 大自动，大 → 小要强制；强制是截断，不是四舍五入。' },
      { title: '浮点', html: '0.1 无法用二进制精确表示；比较用容差，显示用 <code>printf</code>。' },
      { title: 'String', html: '引用类型、不可变；常量池让字面量共享；比较内容一律用 <code>equals</code>。' },
      { title: '格式化', html: '<code>%d %s %.2f %5d %-5d %05d %c %b %n</code>，占位符与实参一一对应。' }
    ] },

    { t: 'checklist', id: 'ch02', items: [
      '我能写出 8 种基本类型，并说出哪两种最常用',
      '我知道 long 和 float 的字面量为什么必须加后缀',
      '我能预测 7 / 2、-7 % 2、1 / 2.0、(double) 1 / 2 的结果',
      '我能解释 int 溢出为什么变成负数，以及怎么避免',
      '我知道 (int) 是截断而不是四舍五入，负数也向零取整',
      '我能说明 0.1 + 0.2 为什么不等于 0.3，以及浮点该怎么比较',
      '我能解释"比较字符串为什么必须用 equals"，并画出常量池的两个对象',
      '我能用 substring / charAt / indexOf / replace / trim / split 完成切分与判断',
      '我能用 printf 输出对齐的表格，并说出 %05d 与 %-5d 的区别',
      '我能把一段"能跑但结果不对"的代码定位到整除、溢出或比较方式',
      '我能说出教材 §1.2 的五种内置类型，以及自动转换、强制转换、解析转换各发生在什么时候'
    ] },

    { t: 'p', html:
      '<b>延伸阅读</b>：教材 Sedgewick《Computer Science: An Interdisciplinary Approach》第 1.1 节（Basic Programming Concepts）' +
      '讲变量与类型，第 1.2 节（Data Abstraction）讲对象与引用；站内第 03 章的条件与循环会把本章的表达式放进流程里，' +
      '第 06 章的「值传递」会解释基本类型与引用类型在方法调用中的差异，第 10 章的集合大量使用 <code>equals</code> 与 <code>toString</code>。' +
      '想练手可以到 <a href="#/quiz/ch02">题库 · ch02</a> 按章节筛选，或用首页的随机挑战抽题。'
    },

    { t: 'callout', kind: 'ai', title: 'AI 时代这样学', html:
      '这一章适合用 AI 做<b>快问快答</b>，但每个结论都要验证：' +
      '① 让它出 10 道"读代码写输出"小题，你先做，再让它逐题解释，最后用本站运行结果裁决；' +
      '② 让它解释"为什么 0.1 不精确"，再追问"那为什么 0.5 是精确的"——答不上来说明它只背了结论；' +
      '③ 让它 review 你的代码里有没有用 <code>==</code> 比字符串、有没有 <code>int / int</code> 求平均，然后在本站跑一遍。' +
      'AI 最容易错的是类型提升的细节（比如 <code>byte + byte</code> 的类型），凡是它的结论都用代码验证。'
    },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html:
      '覆盖范围：变量、八种基本类型与字面量、运算符与优先级、类型转换、整数除法与溢出、浮点误差、String 与常用方法、printf 格式化。<br>依据：Course Outline v5 的 Variables / Operations / Type Conversion / Strings 部分；Sedgewick §1.2。本站为个人整理的学习材料，与课程要求冲突时以老师和课程大纲为准；代码均在真实 JDK 上校验过。' }

  ]
});