/* =====================================================================
 * data/ch06.js · 第 06 章：方法与函数库
 * 内容块 schema 见 _dev/CONTRACT.md §4–§5
 * 本章要点：方法声明与调用 / 值传递 / 作用域与生命周期 / 调用栈 /
 *           重载 / 常用函数库 / 递归初探 / DRY 模块化
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch06',
  num: '06',
  title: '方法与函数库',
  en: 'Functions & Libraries',
  goals: [
    '能声明带参数和返回值的方法，并解释参数、实参、返回值的角色',
    '能说清 Java 的值传递：基本类型复制数值、引用类型复制引用',
    '能画出简单程序的调用栈，说出局部变量的作用域与生命周期',
    '能用方法重载与 Math / String / Integer / Arrays 常用库方法简化代码',
    '能读懂递归方法，指出它的基线条件与问题缩小方式',
    '能诊断漏 return、参数顺序、整数除法这三类方法 bug'
  ],
  kp: [
    { id: 'ch06-1', title: '方法声明：参数与返回值' },
    { id: 'ch06-2', title: '值传递（pass by value）' },
    { id: 'ch06-3', title: '作用域与生命周期' },
    { id: 'ch06-4', title: '调用栈与栈帧' },
    { id: 'ch06-5', title: '方法重载（overload）' },
    { id: 'ch06-6', title: '常用函数库' },
    { id: 'ch06-7', title: '递归初探与 DRY' },
    { id: 'ch06-8', title: '方法 bug 的调试方法' },
    { id: 'ch06-12', title: '教材 §2.1–2.2：静态方法与库的设计' }
  ],
  blocks: [

    { t: 'callout', kind: 'why', html:
      '先看三个"能编译、但结果不对"的小程序：求最大值的 <code>max(5, 5)</code> 返回 <b>0</b>；' +
      '求平均的 <code>average(7, 2)</code> 返回 <b>3.0</b> 而不是 3.5；调 <code>divide(2, 7)</code> 得到 0.28，' +
      '而本意是 7 ÷ 2。<br>' +
      '三个 bug 分别对应方法的三处易错点：<b>漏掉一条返回路径</b>、<b>整数除法丢小数</b>、<b>实参顺序传反</b>。' +
      '前几章你把代码都堆在 <code>main</code> 里：算平均分写一遍，换个班再复制一遍，公式错了要挨个改。' +
      '这一章解决<b>代码怎么组织成可复用的部件</b>——方法（method）。真正让人卡住的是三个「看不见」的动作：' +
      '参数复制了什么（值传递）、变量在哪里活着（作用域）、调用时内部发生了什么（调用栈）。'
    },

    { t: 'p', lead: true, html:
      '人类记不住 200 行代码，但记得住 5 个名字。方法就是给一段逻辑起一个好名字，' +
      '让调用者只需要关心「给我什么、还我什么」，不用关心里面怎么转。'
    },

    { t: 'code', caption: 'OpeningBug06.java　三个"能跑但不对"的方法', code:
`public class OpeningBug06 {
    static int max(int a, int b) {
        int result = 0;              // BUG: never assigned when a == b
        if (a > b) result = a;
        if (b > a) result = b;
        return result;
    }

    static double average(int sum, int count) {
        return sum / count;          // BUG: integer division
    }

    static double divide(int a, int b) {
        return (double) a / b;
    }

    public static void main(String[] args) {
        System.out.println(max(5, 5));        // 0: the equal case fell through
        System.out.println(average(7, 2));    // 3.0: 3.5 was expected
        System.out.println(divide(2, 7));     // arguments were swapped
    }
}
` },

    { t: 'p', html:
      '输出是 <code>0</code>、<code>3.0</code>、<code>0.2857…</code>。三个 bug 的根因各不相同：' +
      '<b>max</b> 只用两个 if 分别处理"a 更大"和"b 更大"，相等时两条都不执行，<code>result</code> 保持初值 0；' +
      '<b>average</b> 的返回类型写着 double，但 <code>sum / count</code> 先按 int 算完才转 double，小数已经丢了；' +
      '<b>divide(2, 7)</b> 方法本身没错，是调用者把参数顺序传反了——形式参数叫 <code>a, b</code>，实际语义是"分子、分母"。<br>' +
      '这三个坑覆盖了方法类题目的 90%：<b>返回路径不全、运算类型不对、实参与形参语义错位</b>。读完这一章，' +
      '你应该能一眼看出它们，并知道怎么改。'
    },

    { t: 'p', html:
      '本章路线：先学会声明与调用（一），再拆开四个"看不见"的机制——值传递（二）、作用域（三）、调用栈（四）；' +
      '然后是重载（五）与常用函数库（六）；第七节把递归和模块化放在一起讲；' +
      '第八节列边界与反例，第九节用三个真实 bug 演示调试；最后两个完整案例（方法拆分报告、递归入门工具集）把全章串起来。'
    },

    { t: 'h', text: '一、方法声明：给我什么，还你什么', id: 'ch06-1' },

    { t: 'p', html:
      '方法的语法可以拆成五部分：<code>修饰符 返回类型 名字(参数列表) { 方法体 }</code>。' +
      '返回类型（return type）声明「交回什么类型的结果」，<code>void</code> 表示不交结果；' +
      '参数列表声明「需要喂给它什么数据」。名字用动词开头的小驼峰，比如 <code>average</code>、' +
      '<code>isPass</code>、<code>printStars</code>。'
    },

    { t: 'terms', items: [
      { en: 'method', zh: '方法', html: '一段有名字、可以被反复调用的代码。Java 里所有逻辑都写在方法里。' },
      { en: 'parameter', zh: '形参', html: '方法声明里的变量，是「占位符」，调用时才被赋值。' },
      { en: 'argument', zh: '实参', html: '调用时真正传进去的值，会被复制给形参。' },
      { en: 'return value', zh: '返回值', html: '<code>return</code> 交回给调用者的结果，类型必须与声明一致。' }
    ] },

    { t: 'code', caption: 'MethodBasics.java', code:
      'public class MethodBasics {\n' +
      '    public static double average(int a, int b) {\n' +
      '        return (a + b) / 2.0;          // 交回一个 double\n' +
      '    }\n' +
      '\n' +
      '    public static void main(String[] args) {\n' +
      '        double x = average(80, 91);    // 80 复制给 a，91 复制给 b\n' +
      '        System.out.printf("average = %.2f%n", x);\n' +
      '        System.out.printf("again   = %.2f%n", average(60, 75));\n' +
      '    }\n' +
      '}\n'
    },

    { t: 'p', html:
      '调用时发生了四件事：① 把实参 80、91 <b>复制</b>给形参 a、b；② 进入方法体执行；' +
      '③ <code>return</code> 把结果交回；④ 回到调用点，方法帧销毁。' +
      '<code>return</code> 有两个作用：<b>交回值</b>和<b>立刻结束方法</b>——它后面的语句不会执行。'
    },

    { t: 'p', html:
      '读一个方法，先读它的<b>签名（signature）</b>：<code>double average(int a, int b)</code> 说的是' +
      '「给我两个 int，我还你一个 double」。调用者看这一行就够了，不需要读方法体。' +
      '这也是好方法的标准：<b>名字 + 参数 + 返回类型能说清它做什么</b>；如果说不清，说明职责太杂，应该拆成两个。' +
      '方法体则应尽量短（十几行以内），超过就考虑再抽一个方法出来。'
    },

    { t: 'callout', kind: 'tip', title: '2.0 和 2 的区别，考试真的考', html:
      '<code>(a + b) / 2.0</code> 得到小数；写成 <code>(a + b) / 2</code> 就是<b>整数除法</b>，' +
      '80 和 91 的平均会变成 85 而不是 85.5。返回类型写着 double 也没用——表达式先按整数算完再转宽。' +
      '想保住小数，让参与运算的至少一方是 double。'
    },

    { t: 'h', lvl: 3, text: 'void 方法与副作用' },

    { t: 'p', html:
      '不是所有方法都要交回结果。打印一行星星、把数组排序、修改对象字段——这些方法的产物是' +
      '<b>副作用（side effect）</b>，不在返回值里。它们用 <code>void</code> 声明。' +
      '选哪种很简单：调用者需要「结果」就 <code>return</code>，只需要「动作」就 <code>void</code>。'
    },

    { t: 'code', caption: 'Stars.java　void 方法把重复的输出打包', code:
      'public class Stars {\n' +
      '    public static void printStars(int n) {\n' +
      '        for (int i = 0; i < n; i++) System.out.print("*");\n' +
      '        System.out.println();\n' +
      '    }\n' +
      '\n' +
      '    public static void main(String[] args) {\n' +
      '        for (int row = 1; row <= 4; row++) {\n' +
      '            printStars(row);\n' +
      '        }\n' +
      '        printStars(6);\n' +
      '    }\n' +
      '}\n'
    },

    { t: 'h', text: '二、值传递：方法拿到的是复印件', id: 'ch06-2' },

    { t: 'p', html:
      'Java 只有一种参数传递方式：<b>值传递（pass by value）</b>——把实参的值<b>复制一份</b>给形参。' +
      '<b>基本类型</b>复制数值本身；<b>引用类型</b>（数组、对象）复制的是<b>引用（reference）</b>，可理解为「对象的地址」。于是：'
    },

    { t: 'table',
      head: ['传什么', '方法里做什么', '外面看得到吗'],
      rows: [
        ['基本类型', '给形参重新赋值', '<b>看不到</b>：改的是复印件'],
        ['数组 / 对象', '通过形参修改元素或字段', '<b>看得到</b>：两个引用指向同一块内存'],
        ['数组 / 对象', '让形参指向另一个新数组/新对象', '<b>看不到</b>：只改了本地引用']
      ],
      caption: '「能改数组元素」不等于「Java 有引用传递」——传进去的仍然是引用值的复印件'
    },

    { t: 'code', caption: 'PassValue.java　点「单步」，对比两个栈帧', trace: true, code:
      'public class PassValue {\n' +
      '    public static void addOne(int x) {\n' +
      '        x = x + 1;                       // 改的是复印件\n' +
      '        System.out.println("inside  x = " + x);\n' +
      '    }\n' +
      '\n' +
      '    public static void fillFirst(int[] data, int value) {\n' +
      '        data[0] = value;                 // 通过引用改同一块内存\n' +
      '    }\n' +
      '\n' +
      '    public static void main(String[] args) {\n' +
      '        int n = 5;\n' +
      '        addOne(n);\n' +
      '        System.out.println("outside n = " + n);\n' +
      '\n' +
      '        int[] nums = {1, 2, 3};\n' +
      '        fillFirst(nums, 99);\n' +
      '        System.out.println("outside nums[0] = " + nums[0]);\n' +
      '    }\n' +
      '}\n'
    },

    { t: 'p', html:
      '单步执行时看两处：进入 <code>addOne</code> 后，栈顶帧里有一个独立的 <code>x</code>，' +
      '它和 main 的 <code>n</code> 是两份数据，所以 main 的 <code>n</code> 一直是 5；' +
      '进入 <code>fillFirst</code> 后，帧里的 <code>data</code> 和 main 的 <code>nums</code> ' +
      '存的是同一个引用，<code>data[0] = 99</code> 改的就是同一个数组，所以外面看到 99。'
    },

    { t: 'callout', kind: 'warn', title: '最常见的错误表述', html:
      '不要说「数组是引用传递」。准确说法是：<b>数组的引用被按值复制</b>。' +
      '如果 Java 是引用传递，方法里让 <code>data = new int[]{7,7,7}</code> 就应该改变外面的 <code>nums</code>——' +
      '但实际上不会。第 09 章会用栈/堆内存图把这个区别彻底画清楚，现在先记住这句话。'
    },

    { t: 'h', text: '三、作用域与生命周期', id: 'ch06-3' },

    { t: 'p', html:
      '<b>作用域（scope）</b>是变量能被访问的范围：方法体里的<b>局部变量（local variable）</b>' +
      '只在方法内有效，<code>{ }</code> 块里声明的只在块内有效。<b>生命周期（lifetime）</b>是它存在的时间：' +
      '调用时创建，返回时随栈帧销毁。不同方法的同名变量毫无关系。'
    },

    { t: 'code', caption: 'Scope.java　两个方法各有一个 result，互不干扰', code:
      'public class Scope {\n' +
      '    public static double area(double r) {\n' +
      '        double result = Math.PI * r * r;\n' +
      '        return result;\n' +
      '    }\n' +
      '\n' +
      '    public static double circumference(double r) {\n' +
      '        double result = 2 * Math.PI * r;   // 同名，但属于另一个方法\n' +
      '        return result;\n' +
      '    }\n' +
      '\n' +
      '    public static void main(String[] args) {\n' +
      '        System.out.printf("area          = %.2f%n", area(2));\n' +
      '        System.out.printf("circumference = %.2f%n", circumference(2));\n' +
      '    }\n' +
      '}\n'
    },

    { t: 'p', html:
      '作用域还有两条容易忽略的规则：① <b>块作用域</b>——<code>{ }</code> 里的变量出块即失效，所以 ' +
      '<code>if</code> / <code>for</code> 里声明的变量在大括号外不能读；② <b>不可重复声明</b>——同一个作用域里' +
      '不能声明两个同名局部变量，但<b>内层块可以遮蔽外层</b>（shadowing），此时内层的同名变量覆盖外层，出块后外层恢复。' +
      '遮蔽能编译通过，却极易读错，工程上一般禁用。<br>' +
      '还有一个高频误解：<b>参数也是局部变量</b>，它和同作用域内声明的局部变量同名会直接编译报错，' +
      '不能说"参数是参数、变量是变量"。'
    },

    { t: 'callout', kind: 'warn', title: '循环外的 i 不存在', html:
      '<code>for (int i = 0; i &lt; n; i++) { ... }</code> 里的 <code>i</code> 出了循环就消失，' +
      '循环外再写 <code>System.out.println(i)</code> 会编译报错。<b>想把结果带出循环</b>，' +
      '要么在循环外声明变量，要么在循环后 <code>return</code>。' +
      '（字段不是局部变量——字段属于对象，活到对象被回收，第 07 章会讲。）'
    },

    { t: 'h', text: '四、调用栈：方法之间的堆叠', id: 'ch06-4' },

    { t: 'p', html:
      '每调用一个方法，JVM 就在<b>调用栈（call stack）</b>上压入一个<b>栈帧（stack frame）</b>：' +
      '参数、局部变量、返回地址。方法返回时弹出。栈是<b>后进先出（LIFO）</b>的，<code>main</code> 在最底下。'
    },

    { t: 'lab', id: 'trace' },

    { t: 'code', caption: 'CallStack.java　三层调用：main → averageSquare → sumSquares → square', trace: true, code:
`public class CallStack {
    static int square(int x) {
        return x * x;
    }

    static int sumSquares(int n) {
        int sum = 0;
        for (int i = 1; i <= n; i++) {
            sum += square(i);
        }
        return sum;
    }

    static double averageSquare(int n) {
        return (double) sumSquares(n) / n;
    }

    public static void main(String[] args) {
        System.out.println(sumSquares(3));
        System.out.printf("%.2f%n", averageSquare(3));
    }
}
` },

    { t: 'p', html:
      '点「单步」会看到栈最多有三层：<code>main</code> → <code>averageSquare</code> → <code>sumSquares</code>，' +
      '每进一层就多一个栈帧，每个帧里都有自己的 <code>n</code>、<code>sum</code>、<code>x</code>。' +
      '<code>square</code> 返回后栈帧弹出，回到 <code>sumSquares</code> 的 <code>sum +=</code> 那一行继续——' +
      '<b>返回地址</b>就是靠栈帧记着的。<br>' +
      '读嵌套调用时只问两句：<b>现在栈顶是谁？它返回后回到哪一行、拿到什么值？</b> 把这两句答清楚，' +
      '再深的调用也只是"栈变高了"。'
    },

    { t: 'keypoint', items: [
      { title: '检查点 · 栈帧', html: '给定三层调用，能说出执行到最内层时栈里有哪几个帧、每帧的局部变量是什么。' },
      { title: '检查点 · 返回', html: '能说出 <code>return</code> 之后控制权回到哪一行，以及为什么要在栈里存返回地址。' }
    ] },

    { t: 'callout', kind: 'tip', title: '读代码时问自己两句话', html:
      '① 现在栈顶是哪一层？② 这一层返回后会回到哪一行、拿到什么值？' +
      '把这两个问题答清楚，嵌套调用和递归都只是「栈变高了」而已。' +
      '递归之所以会 <code>StackOverflowError</code>，本质是栈帧无限堆积、超出 JVM 给栈分配的内存。'
    },

    { t: 'h', text: '五、方法重载：同名，不同参数', id: 'ch06-5' },

    { t: 'p', html:
      '<b>重载（overload）</b>：同一个类里多个同名方法，只要<b>参数列表不同</b>' +
      '（个数、类型或顺序不同）。编译器按实参的个数和类型挑版本，发生在<b>编译期</b>。' +
      '只有返回类型不同<b>不算</b>重载。'
    },

    { t: 'code', caption: 'Overload.java', code:
      'public class Overload {\n' +
      '    public static int max(int a, int b) {\n' +
      '        return a > b ? a : b;\n' +
      '    }\n' +
      '\n' +
      '    public static int max(int a, int b, int c) {\n' +
      '        return max(max(a, b), c);       // 调用上面那个两参数版本\n' +
      '    }\n' +
      '\n' +
      '    public static double max(double a, double b) {\n' +
      '        return a > b ? a : b;\n' +
      '    }\n' +
      '\n' +
      '    public static void main(String[] args) {\n' +
      '        System.out.println(max(3, 8));        // int, int\n' +
      '        System.out.println(max(3, 8, 5));     // int, int, int\n' +
      '        System.out.println(max(3.5, 2.5));    // double, double\n' +
      '    }\n' +
      '}\n'
    },

    { t: 'table',
      head: ['', '重载 overload', '重写 override'],
      rows: [
        ['发生在', '同一个类里', '子类与父类之间'],
        ['要求', '方法名相同，<b>参数列表不同</b>', '方法名、参数列表、返回类型都<b>相同</b>'],
        ['谁决定调用哪个', '<b>编译期</b>：看实参的个数与类型', '<b>运行期</b>：看对象的真实类型'],
        ['本章/章节', '本章', '第 08 章']
      ],
      caption: '这两个词长得像、含义完全不同'
    },

    { t: 'code', caption: 'OverloadTrap.java　重载到底选中谁：看实参的"最具体匹配"', code:
`public class OverloadTrap {
    static void show(int x) {
        System.out.println("int: " + x);
    }

    static void show(long x) {
        System.out.println("long: " + x);
    }

    static void show(double x) {
        System.out.println("double: " + x);
    }

    static void pick(int a, int b) {
        System.out.println("int,int");
    }

    static void pick(int a, double b) {
        System.out.println("int,double");
    }

    static void pick(double a, int b) {
        System.out.println("double,int");
    }

    public static void main(String[] args) {
        show(5);
        show(5L);
        show(5.0);
        show('a');
        pick(1, 2);
        pick(1, 2.0);
        pick(1.0, 2);
    }
}
` },

    { t: 'p', html:
      '输出能解释三条重载规则：① <b>精确匹配优先</b>——<code>show(5)</code> 走 int 版，<code>show(5L)</code> 走 long 版，' +
      '<code>show(5.0)</code> 走 double 版；② <b>允许自动提升但不反向</b>——<code>show(\'a\')</code> 的 char 会提升为 int，' +
      '所以输出 <code>int: 97</code>，但 int 实参不会"降级"去匹配 char 版本（根本没有）；' +
      '③ <b>多参数时逐个比较</b>——<code>pick(1, 2.0)</code> 只有 <code>(int, double)</code> 能精确匹配，' +
      '另外两个各有一处需要转换，所以不选它们。<br>' +
      '<b>最容易踩的坑</b>：以为"返回类型不同就能重载"——不行，编译报"方法已定义"；以为"参数名不同就能重载"——也不行。' +
      '重载只看<b>方法名 + 参数列表</b>。'
    },

    { t: 'keypoint', items: [
      { title: '检查点 · 选版本', html: '给一组重载与一个调用，能说出编译期选中哪个版本，并解释"精确匹配优先、允许提升"。' },
      { title: '检查点 · 不是重载', html: '能说出"只改返回类型"和"只改参数名"都不算重载。' }
    ] },

    { t: 'h', text: '六、常用函数库：别重复造轮子', id: 'ch06-6' },

    { t: 'p', html:
      'Java 标准库已经写好了一大批工具方法。它们的共同特点是 <code>static</code>：不用 <code>new</code> 对象，' +
      '直接用「类名.方法名」调用。会查、会用，比会背重要。'
    },

    { t: 'table',
      head: ['类', '常用方法', '用途'],
      rows: [
        ['<code>Math</code>', '<code>abs(a)</code> <code>max(a,b)</code> <code>pow(x,y)</code> <code>sqrt(x)</code> <code>round(x)</code> <code>random()</code>', '数学运算，参数和返回值多为 double'],
        ['<code>String</code>', '<code>length()</code> <code>charAt(i)</code> <code>substring(a,b)</code> <code>indexOf(s)</code> <code>toUpperCase()</code> <code>equals(s)</code> <code>trim()</code>', '字符串长度、取字符、切片、查找、比较'],
        ['<code>Integer</code>', '<code>parseInt(s)</code> <code>toString(i)</code> <code>MAX_VALUE</code>', 'String 与 int 互转、整数边界'],
        ['<code>Arrays</code>', '<code>toString(a)</code> <code>sort(a)</code> <code>fill(a,v)</code> <code>copyOf(a,n)</code>', '数组打印、排序、填充、复制']
      ]
    },

    { t: 'code', caption: 'Libraries.java', code:
      'import java.util.Arrays;\n' +
      '\n' +
      'public class Libraries {\n' +
      '    public static void main(String[] args) {\n' +
      '        System.out.println(Math.sqrt(2));\n' +
      '        System.out.println(Math.pow(2, 10));\n' +
      '        System.out.println(Math.abs(-7));\n' +
      '\n' +
      '        String s = "  Java Programming  ";\n' +
      '        String t = s.trim();                  // 去掉首尾空格\n' +
      '        System.out.println(t.length());\n' +
      '        System.out.println(t.toUpperCase());\n' +
      '        System.out.println(t.charAt(0));\n' +
      '        System.out.println(t.substring(5, 11));   // 含头不含尾\n' +
      '        System.out.println(t.indexOf("gram"));\n' +
      '\n' +
      '        int n = Integer.parseInt("2026");\n' +
      '        System.out.println(n + 1);\n' +
      '\n' +
      '        int[] nums = {5, 2, 9, 1};\n' +
      '        Arrays.sort(nums);\n' +
      '        System.out.println(Arrays.toString(nums));\n' +
      '    }\n' +
      '}\n'
    },

    { t: 'code', caption: 'MathLab.java　Math / Integer / Arrays 各来一次', code:
`import java.util.Arrays;

public class MathLab {
    public static void main(String[] args) {
        System.out.println(Math.abs(-7));
        System.out.println(Math.max(3, 9));
        System.out.println(Math.min(3, 9));
        System.out.println(Math.pow(2, 10));
        System.out.println(Math.sqrt(2));
        System.out.println(Math.floor(3.7));
        System.out.println(Math.ceil(3.2));
        System.out.println(Math.round(3.5));
        System.out.println(Math.PI);
        System.out.println(Integer.parseInt("123") + 1);
        System.out.println(Integer.toString(255));
        System.out.println(Integer.MAX_VALUE);
        int[] a = {3, 1, 2};
        Arrays.sort(a);
        System.out.println(Arrays.toString(a));
        System.out.println(Arrays.equals(a, new int[]{1, 2, 3}));
    }
}
` },

    { t: 'p', html:
      '读输出时会发现两条容易混的规则：① <b><code>Math.pow</code> / <code>sqrt</code> 的返回值永远是 double</b>，' +
      '所以 <code>pow(2, 10)</code> 打印 <code>1024.0</code> 而不是 <code>1024</code>；' +
      '② <b><code>Math.round(3.5)</code> 是 4</b>，但 <code>(int) 3.5</code> 是 3——round 四舍五入、强转直接截断，' +
      '这两个在选择题里经常放在一起考。<br>' +
      '<code>Integer.MAX_VALUE</code> 是 2147483647，做加法前可以用它判断溢出；' +
      '<code>Arrays.sort</code> 原地排序、<code>Arrays.toString</code> 能把数组打印成 <code>[1, 2, 3]</code>——' +
      '这两个是调试时最常用的组合。'
    },

    { t: 'keypoint', items: [
      { title: '检查点 · 返回值类型', html: '能说出 <code>pow</code> / <code>sqrt</code> 返回 double，<code>round</code> 返回 long/int 且是四舍五入。' },
      { title: '检查点 · 查库', html: '遇到"求绝对值 / 取整 / 转字符串 / 打印数组"，能立刻想到对应的库类与方法，而不是自己写循环。' }
    ] },

    { t: 'lab', id: 'string' },

    { t: 'callout', kind: 'warn', title: 'String 的两个坑', html:
      '① 比较内容要用 <code>equals</code>：<code>s == "Java"</code> 比的是引用，答案可能是 false。' +
      '② <code>substring(a, b)</code> 取的是下标 <code>[a, b)</code>，<b>不含 b</b>；' +
      '<code>substring(5, 11)</code> 返回 6 个字符。这两个点几乎每份卷子都出现。'
    },

    { t: 'h', text: '七、递归初探与模块化', id: 'ch06-7' },

    { t: 'p', html:
      '<b>递归（recursion）</b>就是方法调用自己。它必须有<b>两个部件</b>：' +
      '<b>基线条件（base case）</b>——不再调用自己、直接给答案；' +
      '<b>递归步骤（recursive step）</b>——把问题变成规模更小的同类问题。' +
      '阶乘：4! = 4 × 3!，3! = 3 × 2!……直到 1! = 1 停住。'
    },

    { t: 'code', caption: 'Factorial.java', code:
      'public class Factorial {\n' +
      '    public static int factorial(int n) {\n' +
      '        if (n <= 1) return 1;              // 基线条件：1! = 1\n' +
      '        return n * factorial(n - 1);       // 递归步骤：规模从 n 变成 n-1\n' +
      '    }\n' +
      '\n' +
      '    public static void main(String[] args) {\n' +
      '        for (int n = 1; n <= 6; n++) {\n' +
      '            System.out.println(n + "! = " + factorial(n));\n' +
      '        }\n' +
      '    }\n' +
      '}\n'
    },

    { t: 'p', html:
      '执行分两段：先是<b>展开</b>——一路压栈到 <code>factorial(1)</code> 返回 1；' +
      '然后<b>回溯</b>——每一层拿子问题的结果乘上自己的 n，一层层弹出。' +
      '下面这个实验台能把展开和回溯的过程画成调用树。'
    },

    { t: 'lab', id: 'recursion' },

    { t: 'callout', kind: 'warn', title: '递归的两个死法', html:
      '① 没写基线条件或永远到不了；② 递归时参数没变小（写成 <code>factorial(n)</code>）。' +
      '都会让栈帧无限堆积，最终 <code>StackOverflowError</code>。看递归先查「参数有没有朝基线靠近」。'
    },

    { t: 'h', lvl: 3, text: '模块化：不要重复自己' },

    { t: 'p', html:
      '<b>DRY</b> 是 Don\'t Repeat Yourself 的缩写：同样的逻辑只写一次。抽取成方法有三条收益：' +
      '改公式只改一处；方法名代替注释；<code>main</code> 变短、成为一份可读的流程提纲。' +
      '什么时候抽？<b>当你第二次复制粘贴同一段代码的时候。</b>'
    },

    { t: 'compare', left: {
      title: '复制粘贴版：逻辑散落三处',
      html: '两个班算平均分，代码各写一遍；第三个班再来一遍。改一次逻辑要改三处。',
      code: 'int sum = 0;\nfor (int i = 0; i < cs.length; i++) sum += cs[i];\ndouble avg = (double) sum / cs.length;\nSystem.out.println("CS: " + avg);\n// ……数学班再来一遍'
    }, right: {
      title: '提取方法版：逻辑只在一处',
      html: '把「算平均」抽成方法，调用方只传数组。函数库（如 <code>Math</code>、<code>Arrays</code>）就是别人提前抽好的方法。',
      code: 'printReport(cs, "CS");\nprintReport(math, "Math");\n// 逻辑集中在 printReport / average 里'
    } },

    { t: 'p', html:
      '抽方法的粒度怎么定？一个实用标准是<b>「一个方法只做一件事，且这件事能用一句话说完」</b>。' +
      '<code>printReport</code> 可以，<code>printReportAndSortAndSave</code> 就太杂。' +
      '另一个标准是<b>可测</b>：如果一个方法你没法用几行 main 单独验证它，说明它依赖太多东西。' +
      '案例 A 会演示"把 68 行的 main 拆成 8 个方法"的过程，拆分后每个方法都能单独跑、单独改。'
    },

    { t: 'code', caption: 'Report.java　main 只剩几行，逻辑都在方法里', code:
      'public class Report {\n' +
      '    public static double average(int[] data) {\n' +
      '        int sum = 0;\n' +
      '        for (int i = 0; i < data.length; i++) sum += data[i];\n' +
      '        return (double) sum / data.length;\n' +
      '    }\n' +
      '\n' +
      '    public static int max(int[] data) {\n' +
      '        int best = data[0];\n' +
      '        for (int i = 1; i < data.length; i++) {\n' +
      '            if (data[i] > best) best = data[i];\n' +
      '        }\n' +
      '        return best;\n' +
      '    }\n' +
      '\n' +
      '    public static void printReport(int[] data, String label) {\n' +
      '        System.out.printf("%s: average = %.1f, max = %d%n", label, average(data), max(data));\n' +
      '    }\n' +
      '\n' +
      '    public static void main(String[] args) {\n' +
      '        int[] cs = {85, 92, 78, 90};\n' +
      '        int[] math = {70, 88, 95, 61};\n' +
      '        printReport(cs, "CS");\n' +
      '        printReport(math, "Math");\n' +
      '    }\n' +
      '}\n'
    },

    { t: 'h', text: '八、边界与反例：六个常见误解' },

    { t: 'table',
      head: ['说法 / 场景', '真相', '怎么记'],
      rows: [
        ['漏掉一条 return 路径，编译器一定报错', '不一定。若变量已初始化，能编译，只是逻辑错（如 <code>max(5,5)</code> 返回 0）', '每条路径都要给正确值'],
        ['返回类型写 double，平均就有小数', '错。<code>sum / count</code> 先按 int 算完再转 double', '至少一方先转 double'],
        ['实参顺序传反了编译器会发现', '只有类型不兼容时才报错；同为 int 时静默算错', '用参数名对齐、写一行注释'],
        ['void 方法里不能出现 return', '可以写 <code>return;</code> 提前结束，只是不带值', 'void 的 return 不带表达式'],
        ['递归方法必须有返回值', '不一定。打印型递归是 void，但<b>基线条件仍然必须有</b>', '递归 = 基线 + 缩小'],
        ['方法名相同、返回类型不同就是重载', '错，直接编译报"方法已定义"', '重载只看参数列表']
      ],
      caption: '这六条覆盖了期中卷面上方法类的判断题与找 bug 题'
    },

    { t: 'p', html:
      '再补两个边界：① <b>空数组</b>——<code>average</code> 里 <code>data.length</code> 为 0 时会除零，' +
      '要么提前返回 0，要么在调用方保证非空；② <b>栈深度</b>——递归每层一个栈帧，Java 默认栈只能容纳几千层，' +
      '<code>factorial(100000)</code> 会直接 <code>StackOverflowError</code>，这类题要么问"什么时候溢出"，' +
      '要么问"为什么记忆化也救不了深度"。'
    },

    { t: 'h', text: '九、调试实录：三个方法 bug', id: 'ch06-8' },

    { t: 'p', html:
      '方法类 bug 的共同点是：<b>能编译、能运行，结果就是不对</b>。调试顺序固定为三步：' +
      '① 先确认"方法到底返回了什么"（在调用点打印返回值）；② 再对照"我以为它应该返回什么"；' +
      '③ 最后回到方法体，检查<b>返回路径、运算类型、参数语义</b>这三处。' +
      '下面三个案例分别踩中一处，修复后的代码连在一起跑。'
    },

    { t: 'steps', items: [
      { title: '打印返回值', html: '在调用点加 <code>System.out.println("ret = " + 方法(参数))</code>，先看结果对不对。' },
      { title: '对照期望值', html: '手算一遍期望值，和打印结果比较；差在小数位 → 查整数除法，差在边界 → 查 return 路径。' },
      { title: '只改一处再验证', html: '先改 return 路径，再改类型，最后核对参数顺序；每次只改一样，避免掩盖问题。' }
    ] },

    { t: 'h', lvl: 3, text: '案例 1：两个 if 漏掉了相等的情况' },

    { t: 'p', html:
      '求最大值的 <code>max(5, 5)</code> 返回 0。定位过程：打印返回值看到 0，说明 <code>result</code> 从来没被赋值；' +
      '回看方法体，两个 if 分别处理 <code>a &gt; b</code> 和 <code>b &gt; a</code>，<b>相等时两条都不成立</b>，' +
      '于是返回初值。修复：把初值设成 <code>a</code>，然后只在 <code>b &gt; a</code> 时替换——' +
      '这样"相等"自然归入默认分支。这类 bug 的教训是：<b>写 if 链时先问"剩下的情况怎么办"</b>。'
    },

    { t: 'h', lvl: 3, text: '案例 2：返回类型写 double 也救不了整数除法' },

    { t: 'p', html:
      '<code>average(7, 2)</code> 返回 3.0 而不是 3.5。定位过程：返回值类型确实是 double，但表达式 ' +
      '<code>sum / count</code> 两个操作数都是 int，先按整数除法得 3，再隐式转成 3.0。' +
      '修复：<code>(double) sum / count</code>——把分子转成 double，整个表达式就按 double 算。' +
      '注意 <code>(double) (sum / count)</code> 是错的：括号位置决定了是"先除再转"还是"先转再除"，' +
      '这两种写法在选择题里经常成对出现（见第 02 章的类型转换）。'
    },

    { t: 'h', lvl: 3, text: '案例 3：实参顺序传反，编译器不吭声' },

    { t: 'p', html:
      '<code>divide(2, 7)</code> 得到 0.28，而本意是 7 ÷ 2。两个实参都是 int，编译器无法发现语义错误——' +
      '它只知道"两个 int 传给两个 int 形参"。定位靠的是<b>比对参数名与调用意图</b>：方法签名是 ' +
      '<code>divide(int a, int b)</code>，约定 a 是分子、b 是分母；调用处却写成了 <code>divide(2, 7)</code>。' +
      '修复：改成 <code>divide(7, 2)</code>；更稳的做法是给方法起语义化的名字（<code>divide(numerator, denominator)</code>）' +
      '并在调用处写注释。参数顺序类 bug 在 printf 里也常见（宽度和小数位写反）。'
    },

    { t: 'code', caption: 'DebugCase06.java　三个修复后的版本连起来跑', code:
`public class DebugCase06 {
    static int max(int a, int b) {
        int result = a;                  // fix 1: start from a, replace only when b is bigger
        if (b > a) result = b;
        return result;
    }

    static double average(int sum, int count) {
        return (double) sum / count;     // fix 2: cast before dividing
    }

    static void printRange(int lo, int hi) {
        System.out.println("range " + lo + ".." + hi);
    }

    public static void main(String[] args) {
        System.out.println(max(5, 5));        // 5
        System.out.println(average(7, 2));    // 3.5
        printRange(1, 10);                    // range 1..10
    }
}
` },

    { t: 'keypoint', items: [
      { title: '检查点 · 三个 bug', html: '能说出"漏 return 路径 / 整数除法 / 参数顺序"各自的症状与修复，并知道编译器只抓第二类中的部分情况。' },
      { title: '检查点 · 调试顺序', html: '拿到"结果不对"的方法，先打印返回值、再对照期望、最后只改一处。' }
    ] },

    { t: 'h', text: '十、完整案例 A：把长 main 拆成方法', id: 'ch06-9' },

    { t: 'p', html:
      '上一节的 <code>Report</code> 是简化版（3 个方法）。真实需求通常更复杂：要算总数、平均、最高、最低、' +
      '统计达标人数、按等级输出。如果全写在 main 里，就是一个 40 行的"流水账"，改一处要读全部。' +
      '下面把它拆成 8 个方法：每个方法只做一件事，main 变成一份<b>可读的流程提纲</b>。' +
      '注意 <code>printReport</code> 只负责"编排"，具体计算都委托给别的方法——这就是模块化的核心。'
    },

    { t: 'code', caption: 'ReportBuilder.java　68 行：8 个方法各司其职', code:
`import java.util.Arrays;

public class ReportBuilder {
    static int total(int[] scores) {
        int sum = 0;
        for (int i = 0; i < scores.length; i++) {
            sum += scores[i];
        }
        return sum;
    }

    static double average(int[] scores) {
        if (scores.length == 0) return 0.0;
        return (double) total(scores) / scores.length;
    }

    static int max(int[] scores) {
        int best = scores[0];
        for (int i = 1; i < scores.length; i++) {
            if (scores[i] > best) best = scores[i];
        }
        return best;
    }

    static int min(int[] scores) {
        int worst = scores[0];
        for (int i = 1; i < scores.length; i++) {
            if (scores[i] < worst) worst = scores[i];
        }
        return worst;
    }

    static int countAbove(int[] scores, int threshold) {
        int count = 0;
        for (int i = 0; i < scores.length; i++) {
            if (scores[i] >= threshold) count++;
        }
        return count;
    }

    static String gradeOf(int score) {
        if (score >= 90) return "A";
        if (score >= 80) return "B";
        if (score >= 70) return "C";
        if (score >= 60) return "D";
        return "F";
    }

    static void printRow(String name, int score, double avg) {
        System.out.printf("%-8s %5d %5s %8.1f%n", name, score, gradeOf(score), score - avg);
    }

    static void printReport(String[] names, int[] scores) {
        double avg = average(scores);
        System.out.printf("%-8s %5s %5s %8s%n", "name", "score", "grade", "diff");
        for (int i = 0; i < names.length; i++) {
            printRow(names[i], scores[i], avg);
        }
        System.out.printf("count=%d total=%d avg=%.2f max=%d min=%d above80=%d%n",
            scores.length, total(scores), avg, max(scores), min(scores),
            countAbove(scores, 80));
    }

    public static void main(String[] args) {
        String[] names = {"Alice", "Bob", "Carol", "Dave", "Eve"};
        int[] scores = {85, 92, 78, 60, 95};
        printReport(names, scores);
    }
}
` },

    { t: 'table',
      head: ['方法', '职责', '为什么单独成方法'],
      rows: [
        ['<code>total</code> / <code>average</code>', '求和与平均', 'average 复用 total，避免重复遍历'],
        ['<code>max</code> / <code>min</code>', '最值', '两者结构相同但语义不同，分开更好读'],
        ['<code>countAbove</code>', '统计达标人数', '阈值是参数，可复用于 60 / 80 / 90'],
        ['<code>gradeOf</code>', '分数转等级', '纯函数：输入分数、输出字母，最好测'],
        ['<code>printRow</code>', '打印一行', '表格格式只写一次，改列宽只改这里'],
        ['<code>printReport</code>', '编排整个报告', 'main 只调用它，流程一目了然']
      ],
      caption: '每个方法都能用 2–3 行 main 单独验证——这就是"可测"的标准'
    },

    { t: 'p', html:
      '对比简化版 Report：代码从 27 行涨到 68 行，但<b>可读性和可测性大幅提升</b>。' +
      '新增一个"按等级统计人数"的需求时，只需加一个方法、在 printReport 里调一行，不用动其他逻辑。' +
      '这就是 DRY 的收益：<b>变化被限制在一个方法里</b>。' +
      '注意 <code>average</code> 里的空数组判断：<code>scores.length == 0</code> 时返回 0.0，' +
      '否则 <code>total / length</code> 会除零——第 05 章的输入循环也处理过同样的边界。'
    },

    { t: 'h', text: '十一、完整案例 B：递归入门工具集', id: 'ch06-10' },

    { t: 'p', html:
      '递归的入门不需要等第 12 章：只要掌握"基线条件 + 问题缩小"两件套，就能写出阶乘、斐波那契、' +
      '最大公约数、进制转换、回文判断这一批经典题。下面这个程序把 8 个递归方法放在一起，' +
      '每个都只有 2–4 行——短，但都能跑。' +
      '特别留意 <code>printDown</code> 与 <code>printUp</code>：它们只差"打印写在递归调用之前还是之后"，' +
      '输出顺序却完全相反（去程 vs 回程），这是递归读代码题的最高频考点。'
    },

    { t: 'code', caption: 'RecursionIntro.java　59 行：八个递归方法一次看全', code:
`public class RecursionIntro {
    static int factorial(int n) {
        if (n <= 1) return 1;
        return n * factorial(n - 1);
    }

    static int fib(int n) {
        if (n <= 1) return n;
        return fib(n - 1) + fib(n - 2);
    }

    static int sumTo(int n) {
        if (n == 0) return 0;
        return n + sumTo(n - 1);
    }

    static int gcd(int a, int b) {
        if (b == 0) return a;
        return gcd(b, a % b);
    }

    static String toBinary(int n) {
        if (n < 2) return "" + n;
        return toBinary(n / 2) + (n % 2);
    }

    static boolean isPalindrome(String s) {
        if (s.length() <= 1) return true;
        if (s.charAt(0) != s.charAt(s.length() - 1)) return false;
        return isPalindrome(s.substring(1, s.length() - 1));
    }

    static void printDown(int n) {
        if (n == 0) return;
        System.out.print(n + " ");
        printDown(n - 1);
    }

    static void printUp(int n) {
        if (n == 0) return;
        printUp(n - 1);
        System.out.print(n + " ");
    }

    public static void main(String[] args) {
        System.out.println("factorial(5) = " + factorial(5));
        System.out.println("fib(10) = " + fib(10));
        System.out.println("sumTo(100) = " + sumTo(100));
        System.out.println("gcd(48, 18) = " + gcd(48, 18));
        System.out.println("toBinary(19) = " + toBinary(19));
        System.out.println("isPalindrome(level) = " + isPalindrome("level"));
        System.out.println("isPalindrome(java) = " + isPalindrome("java"));
        System.out.print("countdown: ");
        printDown(5);
        System.out.println();
        System.out.print("countup:   ");
        printUp(5);
        System.out.println();
    }
}
` },

    { t: 'p', html:
      '读输出注意两件事：① <code>fib(10) = 55</code> 但朴素递归算 fib(10) 要调用 177 次——第 12 章会算这笔账' +
      '并用记忆化优化；② <code>countdown: 5 4 3 2 1</code> 与 <code>countup: 1 2 3 4 5</code> 的差别，' +
      '就是"打印在递归调用前 / 后"的差别。<br>' +
      '<b>与第 12 章的交叉链接</b>：本章只要求"能读懂、能写简单递归"；第 12 章会系统讲调用栈、递归树、' +
      '记忆化、汉诺塔和递归 vs 迭代的选择。现在把"基线条件 + 每次变小"这两句吃透，那一章会轻松很多。' +
      '<b>与第 09 章的交叉链接</b>：这些方法的参数（int、String）都是值传递，递归每层拿到的是副本——' +
      '所以 <code>isPalindrome</code> 用 <code>substring</code> 造新串而不是改原串，天然正确。'
    },

    { t: 'p', html:
      '全章回看一句话：<b>方法是"把逻辑命名、把细节隐藏"的最小单位</b>。' +
      '声明时想清"给我什么、还我什么"，签名就写对了；调用时记住<b>参数永远是复印件</b>，就不会误以为改形参能改实参；' +
      '调试时先看返回值、再看运算类型、最后核对参数顺序，三类 bug 跑不掉。' +
      '把这三件事做顺，读任何方法（包括 JDK 的库方法）都只是读它的签名——这也是这一章最重要的迁移能力。'
    },

    { t: 'h', text: '教材对照：§2.1–2.2 静态方法与函数库', id: 'ch06-11' },

    { t: 'p', html:
      '教材 §2.1 把"函数"叫 <b>static method</b>，理由很 Java：这门语言里没有游离在类外面的函数，' +
      '所有方法都必须住在某个类里，<code>static</code> 只是说明"它属于类，不需要先 new 一个对象"。' +
      '§2.2 接着往前走一步：把一组相关方法装进<b>库（library）</b>，客户端只依赖库的 API，不关心实现。' +
      '本站 ch06 讲语法、值传递和调用栈；教材这两节补的正是"怎么把方法组织成能复用的东西"。'
    },

    { t: 'table',
      head: ['教材的说法', '本站对应', '关键点'],
      rows: [
        ['用 static 方法实现函数', '一、方法声明', '调用 <code>类名.方法名(实参)</code>，不需要创建对象'],
        ['参数传递是"值的副本"', '二、值传递', '基本类型改不动外面；数组/对象拿到引用的副本，能改内容、不能换对象'],
        ['库 + 客户端分离', '六、常用函数库', '客户端只依赖签名；库内部随便改，只要签名不变就不影响调用者'],
        ['库要带 main() 做单元测试', '（本站未单列，见下方说明）', '先在 main 里拿几组输入验证每个方法，再交给别人用'],
        ['§2.3 递归：方法调用自己', '七、递归初探', '教材把递归放在函数一章；本站入门在 ch06，系统展开在 ch12']
      ],
      caption: '教材的库设计原则值得抄进作业：一个库只管一个概念（StdRandom 只管随机、StdStats 只管统计），不要在同一个库里塞"万能工具"' },

    { t: 'code', caption: '教材 Program 2.1.1：原书用 StdOut 打印，java Harmonic 1 2 4 依次输出 1.0 / 1.5 / 2.083333333333333', args: ['1', '2', '4'], code:
`public class Harmonic {
    public static double harmonic(int n) {
        double sum = 0.0;
        for (int i = 1; i <= n; i++) {
            sum += 1.0 / i;
        }
        return sum;
    }

    public static void main(String[] args) {
        for (int i = 0; i < args.length; i++) {
            int arg = Integer.parseInt(args[i]);
            double value = harmonic(arg);
            System.out.println(value);
        }
    }
}
` },

    { t: 'p', html:
      '把这段程序拆开看，能对上教材 §2.1 的三条主张：① <b>方法先写、main 后写</b>——计算逻辑在 <code>harmonic</code> 里，' +
      '<code>main</code> 只负责"读参数、调方法、打印"，这是教材要求的职责分离；' +
      '② <b>库方法必须能独立测试</b>——<code>main</code> 对每个参数调用一次，输入 1、2、4 就能验证 1.0、1.5、2.08…，' +
      '教材说"每个库都应该带一个 main 做单元测试"，考的就是这个习惯；' +
      '③ <b>参数是副本</b>——<code>harmonic(arg)</code> 把 arg 的值复制给形参 n，方法里怎么改 n 都不影响 main 的 arg。<br><br>教材还强调一点本站容易忽略的：<b>先有库，再写客户端</b>。它把 StdRandom、StdArrayIO、StdStats 这些库单独成节，' +
      '每个都配 main 测试，然后客户端程序（比如抽样、绘图）只负责调用。' +
      '对比一下本站的完整案例 A：<code>gradeOf</code>、<code>average</code>、<code>max</code> 这些方法其实就是一个小库，' +
      '而 <code>main</code> 是它的第一个客户端。如果你写作业时先把方法想清楚、再用 main 串起来，代码会长得和教材一样干净。<br><br>最后一个常被问的问题：递归为什么放在"函数"这一章？教材把递归（§2.3）紧跟在静态方法后面，因为递归不过是"方法在自己的方法体里调用自己"——' +
      '刚学完调用栈，正好用它解释递归的"去程与回程"。本站把递归入门放在 ch06 第七节，系统讲递归树、记忆化、汉诺塔则放到 ch12。' +
      '两种安排不冲突：先记住"基线条件 + 每次规模变小"，到 ch12 再补整体方法。'
    },

    { t: 'h', text: '即时练习' },

    { t: 'quiz', qid: 'ch06-q1' },
    { t: 'quiz', qid: 'ch06-q2' },
    { t: 'quiz', qid: 'ch06-q3' },

    { t: 'callout', kind: 'exam', title: '这一章在考试里怎么考', html:
      '五类题、三档分值：<br>' +
      '① <b>值传递问输出</b>（读代码写输出，5–10 分）：方法 A 改 int、方法 B 改数组元素，问 main 里的值——' +
      '本课程出现频率最高的题之一，答案永远是「int 不变、数组元素变」；再加上"形参重新赋值不影响外面"这一层，' +
      '就是 Mock A Q5 的完整形态（第 09 章有完整内存图）。<br>' +
      '② <b>给方法问返回值</b>（读代码写输出，5 分）：注意整数除法与 <code>return</code> 提前结束；' +
      '如果方法里有多条 return，要按条件逐条走。考场做法：把方法单独抄出来，代一组小数字手算。<br>' +
      '③ <b>重载选择</b>（选择/填空，3–5 分）：给三个同名方法，问调用落到哪个版本；' +
      '记住"精确匹配优先、允许自动提升、不反向降级"。<br>' +
      '④ <b>库方法陷阱</b>（填空，3–5 分）：<code>substring</code> 右端点不含、<code>==</code> vs ' +
      '<code>equals</code>、<code>Math.pow</code> 返回 double。<br>' +
      '⑤ <b>递归输出/调用次数</b>（读代码写输出，5–10 分）：按展开—回溯在纸上推，' +
      '注意打印写在递归调用之前还是之后（去程 vs 回程）。<br>' +
      '<b>看到这类题先做什么</b>：值传递题先在草稿纸上画两个栈帧、标出"谁是副本"；' +
      '重载题先列出每个版本的参数类型再对照实参；递归题先写"每层的 n 值"竖列，再标哪一层打印。'
    },

    { t: 'keypoint', items: [
      { title: '声明', html: '<code>返回类型 名字(参数列表) { 方法体 }</code>；<code>void</code> 不返回结果；<code>return</code> 交回值并立即结束方法。' },
      { title: '签名', html: '方法名 + 参数列表 + 返回类型构成签名；调用者只依赖签名，方法体可以独立修改。' },
      { title: '值传递', html: '基本类型复制数值，数组/对象复制引用：改元素外面看得到，改引用本身看不到。' },
      { title: '作用域与栈', html: '局部变量只在声明它的块里有效；每次调用压一帧，栈 LIFO，main 在最底下。' },
      { title: '重载', html: '同名不同参数列表，编译期按实参挑选；返回类型不同不算重载。' },
      { title: '库', html: '<code>Math</code> / <code>String</code> / <code>Integer</code> / <code>Arrays</code> 的静态方法直接用；先查文档再自己写循环。' },
      { title: '递归', html: '递归 = 基线条件 + 规模变小；打印在调用前是去程顺序、在调用后是回程顺序。' },
      { title: '调试', html: '先打印返回值、再对照期望值、最后只改一处；三类根因是返回路径、运算类型、参数顺序。' }
    ] },

    { t: 'checklist', id: 'ch06', items: [
      '我能写出一个「接收两个分数、返回平均分」的方法并正确调用',
      '我能解释为什么方法里把 int 参数改成 9，main 里的变量还是原来的值',
      '我能解释为什么方法里改数组元素，外面能看见——并说出这不是引用传递',
      '我能说出局部变量的作用域和生命周期，并画出三层方法调用的栈帧顺序',
      '我能判断两个同名方法是不是合法重载，并能预测一次调用落到哪个版本',
      '我能用 Math / Integer / Arrays 的库方法替代手写循环',
      '我能写一个带基线条件的递归方法，并说出它什么时候返回',
      '我能区分 printDown 与 printUp 的输出顺序差异',
      '我知道 String 比较要用 equals，substring 的右端点不包含',
      '我能诊断漏 return 路径、整数除法、参数顺序这三类方法 bug',
      '我能说出教材 §2.1–2.2 的"库 + 客户端"结构，并解释为什么库要带 main 做单元测试'
    ] },

    { t: 'p', html:
      '<b>延伸阅读</b>：教材 Sedgewick《Computer Science: An Interdisciplinary Approach》第 2.1 节（Defining Functions）' +
      '与第 2.2 节（Modular Programming）；站内第 05 章「输入输出」（本章案例的方法拆分）、' +
      '第 09 章「内存与引用」（值传递的内存图）、第 12 章「递归」（本章只做入门，那一章系统展开）。' +
      '动手可以打开 <a href="#/labs/trace">实验台 · 逐语句追踪</a> 看栈帧，或到 <a href="#/quiz/ch06">题库 · ch06</a> 按章节练习。'
    },

    { t: 'callout', kind: 'ai', title: 'AI 时代这样学', html:
      '这一章最值得让 AI 陪你做的是<b>对答案</b>：让 AI 出 5 道「值传递问输出」的题，你先写答案，' +
      '再用 AI 的解析对照；不一致就把代码粘到本站跑一遍，用真实输出裁决。' +
      '也可以反过来：你写递归方法，让 AI 检查「基线条件有没有问题、参数是否在变小」，然后自己验证。<br>' +
      '还有一个高价值练习：把本章案例 ReportBuilder 发给 AI，让它"加一个按等级统计人数的方法"，' +
      '然后你检查它有没有（a）复用现有方法、(b) 处理空数组、(c) 不破坏原有输出。' +
      'AI 经常在"复用"和"边界"上偷懒，这种审查比让它直接写代码有用得多。'
    },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html:
      '覆盖范围：方法与函数库：声明与调用、参数与返回值、作用域、调用栈、重载、值传递、库方法、模块化与重构、递归初探。<br>依据：Course Outline v5 的 Functions / Tracing / Modular Programming / Useful Libraries 部分；Sedgewick §2.1。本站为个人整理的学习材料，与课程要求冲突时以老师和课程大纲为准；代码均在真实 JDK 上校验过。' }

  ]
});