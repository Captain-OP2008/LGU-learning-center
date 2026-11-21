/* =====================================================================
 * data/projects.js · 项目式学习数据（#/projects）
 *
 * 职责：定义 4 个「把多章能力串起来」的完整项目，每个项目 3 个里程碑：
 *   项目 = { id, title, en, tagline, level, minutes, chapters, goals, intro,
 *            milestones:[{ n, title, tasks:[], starter, tests:[{name, args, stdin, expect}],
 *                          hints:[], solution, explain }],
 *            extension:[], solutionNote }
 *   判分约定：tests 的 {args, stdin} 交给站内 Java 引擎执行用户代码，
 *       stdout 与 expect 逐行去首尾空白/空行后比较（与题库 code 题同一套规则）。
 *   solution 是参考实现：_dev/projects-tests.js 会用引擎实跑它并通过全部 tests。
 * 由 assets/app.js 的 loadProjects() 按需加载（CSC.registerProjects）。
 * 作者模块：feature-builder
 * ===================================================================== */

CSC.registerProjects([
  /* ==================================================================
   * 项目 1 · calc 命令行计算器（ch01–ch03）
   * ================================================================== */
  {
    id: 'calc',
    title: '命令行计算器',
    en: 'CLI CALCULATOR',
    tagline: '从「两数运算」到「带括号的表达式求值 + 错误处理」',
    level: 2,
    minutes: 120,
    chapters: ['ch01', 'ch02', 'ch03'],
    goals: [
      '把 Scanner 读入、字符串处理、分支与循环组合成一个能反复使用的程序',
      '用递归下降解析表达式，理解「优先级」与「括号」是怎么被程序处理的',
      '学会把非法输入、除零这类错误变成明确的输出，而不是让程序崩掉'
    ],
    intro: '做一个命令行计算器：程序反复读入表达式，输出计算结果。'
      + 'M1 只要求两个数、一个运算符；M2 要求支持括号与先乘除后加减；M3 要求识别非法输入与除零，并统计成功处理了多少条。',
    milestones: [
      {
        n: 1,
        title: 'M1 · 两数运算',
        tasks: [
          '从 stdin 第一行读入整数 n（后面有 n 道算式）',
          '每道算式占一行，格式为「整数 运算符 整数」，运算符是 + - * /',
          '输出每道算式的结果（int 整除，和 Java 的 int / int 一致）'
        ],
        starter: `import java.util.Scanner;

public class Calc {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        for (int i = 0; i < n; i++) {
            int a = sc.nextInt();
            // TODO: 读运算符（sc.next() 读一个字符串）与第二个整数 b
            // TODO: 用 if / else if 根据运算符计算并 println 结果
        }
    }
}`,
        tests: [
          { name: '加、乘、整除', stdin: '3\n12 + 5\n7 * 8\n20 / 4\n', expect: '17\n56\n5' },
          { name: '减法与负数结果', stdin: '2\n9 - 3\n3 - 10\n', expect: '6\n-7' },
          { name: '整除截断（与 Java 一致）', stdin: '2\n100 / 7\n-9 / 2\n', expect: '14\n-4' }
        ],
        hints: [
          'Scanner 的 nextInt() 读整数、next() 读一个「词」；它们都会自动跳过空白，所以读 "12 + 5" 很方便。',
          '用 String.equals 比较运算符：op.equals("+")。不要用 ==（== 比的是引用）。',
          '整数除法和数学除法不同：7 / 2 得 3，因为 int / int 会截断小数。'
        ],
        solution: `import java.util.Scanner;

public class Calc {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        for (int i = 0; i < n; i++) {
            int a = sc.nextInt();
            String op = sc.next();
            int b = sc.nextInt();
            if (op.equals("+")) {
                System.out.println(a + b);
            } else if (op.equals("-")) {
                System.out.println(a - b);
            } else if (op.equals("*")) {
                System.out.println(a * b);
            } else {
                System.out.println(a / b);
            }
        }
    }
}`,
        explain: '循环 n 次、每次读三个 token 是「<b>读入 → 处理 → 输出</b>」的基本骨架。'
          + '注意 <code>sc.nextInt()</code> 和 <code>sc.next()</code> 会跳过空白，所以一行里的空格不影响读取；'
          + '而 <code>nextLine()</code> 会读整行、不跳空白——两者混用时要小心。'
      },
      {
        n: 2,
        title: 'M2 · 括号与优先级',
        tasks: [
          '第一行仍是 n；接下来 n 行是完整表达式（可能含空格、括号、多个运算符）',
          '支持 + - * /、括号、先乘除后加减，整除规则同 M1',
          '对每个表达式输出一个整数结果'
        ],
        starter: `import java.util.Scanner;

public class Calc {
    static String s;
    static int p;

    // 表达式 := 项 (('+'|'-') 项)*
    static int expr() {
        int v = term();
        // TODO: 当 p 指向 '+' 或 '-' 时，取运算符、p++，再读一个 term() 并累加/累减
        return v;
    }

    // 项 := 因子 (('*'|'/') 因子)*
    static int term() {
        int v = fac();
        // TODO: 当 p 指向 '*' 或 '/' 时，处理乘除
        return v;
    }

    // 因子 := 数字 | '(' 表达式 ')'
    static int fac() {
        skip();
        if (p < s.length() && s.charAt(p) == '(') {
            p++;
            int v = expr();
            p++;
            return v;
        }
        // TODO: 读一串数字，用 Integer.parseInt 转成 int
        return 0;
    }

    static void skip() {
        while (p < s.length() && s.charAt(p) == ' ') p++;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        sc.nextLine();
        for (int i = 0; i < n; i++) {
            s = sc.nextLine().replace(" ", "");
            p = 0;
            System.out.println(expr());
        }
    }
}`,
        tests: [
          { name: '括号优先', stdin: '1\n(2 + 3) * 4\n', expect: '20' },
          { name: '先乘除后加减', stdin: '3\n2 + 3 * 4\n10 - 2 * 3\n(10 - 2) * 3\n', expect: '14\n4\n24' },
          { name: '嵌套括号', stdin: '2\n((1 + 2) * (3 + 4))\n100 / (2 + 3)\n', expect: '21\n20' }
        ],
        hints: [
          '递归下降的三个函数正好对应三层优先级：expr（加减）→ term（乘除）→ fac（数字/括号）。',
          '把「当前读到第几个字符」存成静态字段 p，三个函数共享它，谁读字符谁负责 p++。',
          'fac() 遇到括号时，先 p++ 跳过 "("，递归调用 expr()，再 p++ 跳过 ")"。'
        ],
        solution: `import java.util.Scanner;

public class Calc {
    static String s;
    static int p;

    static int expr() {
        int v = term();
        while (p < s.length() && (s.charAt(p) == '+' || s.charAt(p) == '-')) {
            char op = s.charAt(p);
            p++;
            int r = term();
            if (op == '+') v += r;
            else v -= r;
        }
        return v;
    }

    static int term() {
        int v = fac();
        while (p < s.length() && (s.charAt(p) == '*' || s.charAt(p) == '/')) {
            char op = s.charAt(p);
            p++;
            int r = fac();
            if (op == '*') v *= r;
            else v /= r;
        }
        return v;
    }

    static int fac() {
        skip();
        if (p < s.length() && s.charAt(p) == '(') {
            p++;
            int v = expr();
            skip();
            if (p < s.length() && s.charAt(p) == ')') p++;
            return v;
        }
        skip();
        int start = p;
        while (p < s.length() && s.charAt(p) >= '0' && s.charAt(p) <= '9') p++;
        return Integer.parseInt(s.substring(start, p));
    }

    static void skip() {
        while (p < s.length() && s.charAt(p) == ' ') p++;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        sc.nextLine();
        for (int i = 0; i < n; i++) {
            s = sc.nextLine().replace(" ", "");
            p = 0;
            System.out.println(expr());
        }
    }
}`,
        explain: '递归下降的核心是「每层只处理自己的优先级」：expr 把加减串起来，每遇到加减就向 term 要一个操作数；'
          + 'term 同理向 fac 要数字。括号让 fac 递归回到 expr，于是括号里的内容被当作一个整体。'
          + '<b>为什么 while 而不是 if</b>：表达式可能有任意多个同优先级运算符（1+2+3+4）。'
      },
      {
        n: 3,
        title: 'M3 · 错误处理与历史记录',
        tasks: [
          '输入格式同 M2：第一行 n，接下来 n 行表达式（其中可能混入非法输入与除零）',
          '非法表达式（含字母、缺少操作数、括号不配对等）输出 ERR',
          '除零输出 ERR zero；合法表达式照常输出整数',
          '最后再输出一行 HIST 加「成功处理的条数」'
        ],
        starter: `import java.util.Scanner;

public class Calc {
    static String s;
    static int p;
    static boolean ok;
    static boolean zero;

    static int expr() {
        int v = term();
        while (ok && p < s.length() && (s.charAt(p) == '+' || s.charAt(p) == '-')) {
            char op = s.charAt(p);
            p++;
            int r = term();
            if (!ok) return 0;
            if (op == '+') v += r; else v -= r;
        }
        return v;
    }

    static int term() {
        int v = fac();
        while (ok && p < s.length() && (s.charAt(p) == '*' || s.charAt(p) == '/')) {
            char op = s.charAt(p);
            p++;
            int r = fac();
            if (!ok) return 0;
            if (op == '*') {
                v *= r;
            } else {
                // TODO: 如果 r == 0，把 zero 标记为 true、ok 标记为 false
                v /= r;
            }
        }
        return v;
    }

    static int fac() {
        skip();
        if (p < s.length() && s.charAt(p) == '(') { p++; int v = expr(); skip(); if (p < s.length() && s.charAt(p) == ')') p++; else ok = false; return v; }
        skip();
        int start = p;
        while (p < s.length() && s.charAt(p) >= '0' && s.charAt(p) <= '9') p++;
        if (start == p) { ok = false; return 0; }   // 这里没有数字 → 非法
        return Integer.parseInt(s.substring(start, p));
    }

    static void skip() {
        while (p < s.length() && s.charAt(p) == ' ') p++;
    }

    static boolean atEnd() {
        skip();
        return p >= s.length();
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        sc.nextLine();
        int hist = 0;
        // TODO: 逐行解析；根据 ok / zero 输出 "ERR" / "ERR zero" / 结果
        // 最后输出 "HIST " + hist
    }
}`,
        tests: [
          { name: '非法字符', stdin: '2\n1 + 2\n/ 3\n', expect: '3\nERR\nHIST 1' },
          { name: '除零与乘法', stdin: '3\n5 / 0\n7 * 6\n12 @ 2\n', expect: 'ERR zero\n42\nERR\nHIST 1' },
          { name: '缺操作数', stdin: '2\n(2 + 3) * 4\n2 + 3 *\n', expect: '20\nERR\nHIST 1' }
        ],
        hints: [
          '不要在解析函数里抛异常（本站引擎也不支持 try/catch）：用一个 boolean ok 当「出错开关」，出错后立刻返回。',
          '除零要单独标记：zero = true 且 ok = false，主程序里先判断 zero 再判断 ok。',
          '解析完还要检查「是否消费完整个字符串」：多余字符（如 1+2)）也算非法。'
        ],
        solution: `import java.util.Scanner;

public class Calc {
    static String s;
    static int p;
    static boolean ok;
    static boolean zero;

    static int expr() {
        int v = term();
        while (ok && p < s.length() && (s.charAt(p) == '+' || s.charAt(p) == '-')) {
            char op = s.charAt(p);
            p++;
            int r = term();
            if (!ok) return 0;
            if (op == '+') v += r;
            else v -= r;
        }
        return v;
    }

    static int term() {
        int v = fac();
        while (ok && p < s.length() && (s.charAt(p) == '*' || s.charAt(p) == '/')) {
            char op = s.charAt(p);
            p++;
            int r = fac();
            if (!ok) return 0;
            if (op == '*') {
                v *= r;
            } else {
                if (r == 0) {
                    zero = true;
                    ok = false;
                    return 0;
                }
                v /= r;
            }
        }
        return v;
    }

    static int fac() {
        skip();
        if (p < s.length() && s.charAt(p) == '(') {
            p++;
            int v = expr();
            skip();
            if (p < s.length() && s.charAt(p) == ')') p++;
            else ok = false;
            return v;
        }
        skip();
        int start = p;
        while (p < s.length() && s.charAt(p) >= '0' && s.charAt(p) <= '9') p++;
        if (start == p) {
            ok = false;
            return 0;
        }
        return Integer.parseInt(s.substring(start, p));
    }

    static void skip() {
        while (p < s.length() && s.charAt(p) == ' ') p++;
    }

    static boolean atEnd() {
        skip();
        return p >= s.length();
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        sc.nextLine();
        int hist = 0;
        for (int i = 0; i < n; i++) {
            s = sc.nextLine().replace(" ", "");
            p = 0;
            ok = true;
            zero = false;
            int v = expr();
            if (ok && !atEnd()) ok = false;
            if (zero) {
                System.out.println("ERR zero");
            } else if (!ok) {
                System.out.println("ERR");
            } else {
                System.out.println(v);
                hist++;
            }
        }
        System.out.println("HIST " + hist);
    }
}`,
        explain: '「别让程序崩掉」是命令行工具的基本素养：所有可能出错的路径都要有明确的输出。'
          + '这里用 <code>ok</code> / <code>zero</code> 两个标志位代替异常；'
          + '你还可以思考：如果输入是 <code>999999999 * 999999999</code>，int 溢出后会发生什么？（试试把变量改成 long。）'
      }
    ],
    extension: [
      '支持负数（一元负号）与小数：把返回类型改成 double，解析负号与小数点。',
      '支持取余 % 与乘方 ^，并规定优先级。',
      '把历史记录保存成字符串数组，最后按「原始表达式 = 结果」的格式全部打印出来。',
      '用 args 传入一个初始值，让计算器支持「上次结果」变量（如 ans + 5）。'
    ],
    solutionNote: '参考实现按「递归下降解析器」组织：expr / term / fac 三层函数各管一级优先级，'
      + '加上 ok / zero 两个错误标志。完整代码见每个里程碑下的「参考实现」。'
  },

  /* ==================================================================
   * 项目 2 · grades 学生成绩管理（ch04–ch09）
   * ================================================================== */
  {
    id: 'grades',
    title: '学生成绩管理',
    en: 'GRADES MANAGER',
    tagline: '数组 → 对象数组 → 排序与二分查排名',
    level: 3,
    minutes: 150,
    chapters: ['ch04', 'ch06', 'ch07', 'ch08', 'ch09'],
    goals: [
      '把「数组 + 方法 + 类」组合成一个真实的数据管理程序',
      '理解对象数组：数组元素是引用，排序时交换的是引用而不是值',
      '用二分查找在有序数据上快速定位排名，体会 O(log n) 和 O(n) 的差别'
    ],
    intro: '管理一个班级的成绩：读入学生与分数，做统计、排序、查排名。'
      + 'M1 先用纯数组做统计；M2 引入 Student 类与对象数组；M3 排序输出排名并用二分查找回答「某个分数以上有几人」。',
    milestones: [
      {
        n: 1,
        title: 'M1 · 数组统计',
        tasks: [
          '第一行读入整数 n（学生人数），接下来 n 个整数是分数',
          '输出：sum=总分、avg=平均分（保留 1 位小数）、max=最高分、min=最低分、pass=及格人数（≥60）'
        ],
        starter: `import java.util.Scanner;

public class Grades {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] scores = new int[n];
        for (int i = 0; i < n; i++) {
            scores[i] = sc.nextInt();
        }
        // TODO: 遍历数组求 sum / max / min / pass
        // TODO: 用 printf("avg=%.1f%n", (double) sum / n) 输出平均分
    }
}`,
        tests: [
          { name: '常规班级', stdin: '4\n90 80 70 100\n', expect: 'sum=340\navg=85.0\nmax=100\nmin=70\npass=4' },
          { name: '有人不及格', stdin: '3\n59 60 95\n', expect: 'sum=214\navg=71.3\nmax=95\nmin=59\npass=2' },
          { name: '全及格班级', stdin: '3\n85 90 75\n', expect: 'sum=250\navg=83.3\nmax=90\nmin=75\npass=3' },
          { name: '只有一个学生', stdin: '1\n100\n', expect: 'sum=100\navg=100.0\nmax=100\nmin=100\npass=1' }
        ],
        hints: [
          '把 max / min 初始化成 scores[0]，再从下标 1 开始比较，避免初始值 0 干扰（分数可能全负）。',
          '整数相除会截断：avg 要先转 double，写成 (double) sum / n。',
          'printf 的格式：%d 整数、%.1f 一位小数、%n 换行。'
        ],
        solution: `import java.util.Scanner;

public class Grades {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] scores = new int[n];
        for (int i = 0; i < n; i++) {
            scores[i] = sc.nextInt();
        }
        int sum = 0;
        int max = scores[0];
        int min = scores[0];
        int pass = 0;
        for (int i = 0; i < scores.length; i++) {
            sum += scores[i];
            if (scores[i] > max) max = scores[i];
            if (scores[i] < min) min = scores[i];
            if (scores[i] >= 60) pass++;
        }
        System.out.println("sum=" + sum);
        System.out.printf("avg=%.1f%n", (double) sum / n);
        System.out.println("max=" + max);
        System.out.println("min=" + min);
        System.out.println("pass=" + pass);
    }
}`,
        explain: '一次遍历就能同时算出 sum / max / min / pass：每个元素被访问一次，时间复杂度 O(n)。'
          + '<code>max = scores[0]</code> 这个初始化很关键——如果初始化成 0，全负分会得到错误结果。'
      },
      {
        n: 2,
        title: 'M2 · 类与对象数组',
        tasks: [
          '第一行读入 n；接下来 n 行是「姓名 分数」（姓名不含空格）',
          '定义 Student 类（字段 name / score，构造器与一个输出方法）',
          '用 Student[] 存所有学生，按输入顺序输出每行 name: score，最后输出 avg=平均分（1 位小数）'
        ],
        starter: `import java.util.Scanner;

class Student {
    String name;
    int score;
    // TODO: 写构造器 Student(String n, int s)
    // TODO: 写方法 String label()，返回 "姓名: 分数"
}

public class Grades {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        sc.nextLine();
        Student[] list = new Student[n];
        // TODO: 循环读入 name + score，创建 Student 对象放进数组
        // TODO: 遍历输出每个学生，并统计平均分
    }
}`,
        tests: [
          { name: '三个学生', stdin: '3\nAnn 90\nBob 85\nCid 80\n', expect: 'Ann: 90\nBob: 85\nCid: 80\navg=85.0' },
          { name: '平均分带小数', stdin: '2\nZoe 100\nMax 59\n', expect: 'Zoe: 100\nMax: 59\navg=79.5' },
          { name: '四名学生', stdin: '4\nAnn 90\nBob 86\nCid 80\nDan 70\n', expect: 'Ann: 90\nBob: 86\nCid: 80\nDan: 70\navg=81.5' }
        ],
        hints: [
          '多行输入里混用 nextInt 与 nextLine 容易踩坑：读完 n 之后要先 nextLine() 吃掉行尾换行。',
          'Student[] list = new Student[n] 只创建了「放引用的格子」，每个元素还要 new Student(...) 才真正存在。',
          '对象数组的 length 是学生人数；list[i].name 是第 i 个学生的名字。'
        ],
        solution: `import java.util.Scanner;

class Student {
    String name;
    int score;

    Student(String n, int s) {
        this.name = n;
        this.score = s;
    }

    String label() {
        return name + ": " + score;
    }
}

public class Grades {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        sc.nextLine();
        Student[] list = new Student[n];
        for (int i = 0; i < n; i++) {
            String name = sc.next();
            int score = sc.nextInt();
            list[i] = new Student(name, score);
        }
        int sum = 0;
        for (int i = 0; i < list.length; i++) {
            System.out.println(list[i].label());
            sum += list[i].score;
        }
        System.out.printf("avg=%.1f%n", (double) sum / list.length);
    }
}`,
        explain: '<code>new Student[n]</code> 创建的是「长度为 n 的引用数组」，元素默认是 null；'
          + '必须逐个 <code>new Student(...)</code> 才有对象。这是第二章「数组」与第七章「类」第一次真正合体。'
      },
      {
        n: 3,
        title: 'M3 · 排序与查排名',
        tasks: [
          '第一行 n；接下来 n 行「姓名 分数」；最后一行是一个整数 target（分数）',
          '按分数从高到低排序输出（同分时按姓名字典序升序），每行「姓名 分数」',
          '再输出 rank=第一个分数低于 target 的名次（1-based）；若所有人都 ≥ target，输出 n+1',
          '请用二分查找实现 rank（不是线性扫描）'
        ],
        starter: `import java.util.Scanner;

class Student {
    String name;
    int score;
    Student(String n, int s) { this.name = n; this.score = s; }
    String label() { return name + " " + score; }
}

public class Grades {
    static boolean better(Student a, Student b) {
        // TODO: 分数高的在前；同分按 name 字典序（a.name.compareTo(b.name) < 0）
        return false;
    }

    static int rankOf(int[] sortedDesc, int target) {
        // 二分：找第一个 < target 的位置
        int lo = 0, hi = sortedDesc.length;
        while (lo < hi) {
            int mid = (lo + hi) / 2;
            // TODO: 根据 sortedDesc[mid] 与 target 的关系收缩区间
            lo = mid + 1;
        }
        return lo;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        Student[] list = new Student[n];
        for (int i = 0; i < n; i++) {
            String name = sc.next();
            int score = sc.nextInt();
            list[i] = new Student(name, score);
        }
        int target = sc.nextInt();
        // TODO: 选择排序（用 better 比较），输出每个学生
        // TODO: 把分数提取成 int[]，调用 rankOf，输出 rank=...
    }
}`,
        tests: [
          { name: '排名在中间', stdin: '4\nAnn 90\nBob 85\nCid 80\nDan 77\n80\n', expect: 'Ann 90\nBob 85\nCid 80\nDan 77\nrank=4' },
          { name: '同分按名字排序', stdin: '3\nCid 85\nAnn 85\nBob 70\n85\n', expect: 'Ann 85\nCid 85\nBob 70\nrank=3' },
          { name: 'target 高于所有人', stdin: '2\nAnn 90\nBob 80\n100\n', expect: 'Ann 90\nBob 80\nrank=1' }
        ],
        hints: [
          '对象数组排序交换的是引用：Student t = list[i]; list[i] = list[best]; list[best] = t;',
          '二分查找「第一个 < target 的位置」：若中间值 >= target，说明答案在右半段（lo = mid + 1）；否则 hi = mid。',
          'rank 输出用 lo + 1；若所有人都 >= target，lo 会等于 n，输出 n+1。'
        ],
        solution: `import java.util.Scanner;

class Student {
    String name;
    int score;
    Student(String n, int s) { this.name = n; this.score = s; }
    String label() { return name + " " + score; }
}

public class Grades {
    static boolean better(Student a, Student b) {
        if (a.score != b.score) return a.score > b.score;
        return a.name.compareTo(b.name) < 0;
    }

    static int rankOf(int[] sortedDesc, int target) {
        int lo = 0;
        int hi = sortedDesc.length;
        while (lo < hi) {
            int mid = (lo + hi) / 2;
            if (sortedDesc[mid] >= target) lo = mid + 1;
            else hi = mid;
        }
        return lo;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        Student[] list = new Student[n];
        for (int i = 0; i < n; i++) {
            String name = sc.next();
            int score = sc.nextInt();
            list[i] = new Student(name, score);
        }
        int target = sc.nextInt();
        for (int i = 0; i < n - 1; i++) {
            int best = i;
            for (int j = i + 1; j < n; j++) {
                if (better(list[j], list[best])) best = j;
            }
            Student t = list[i];
            list[i] = list[best];
            list[best] = t;
        }
        int[] scores = new int[n];
        for (int i = 0; i < n; i++) {
            System.out.println(list[i].label());
            scores[i] = list[i].score;
        }
        System.out.println("rank=" + (rankOf(scores, target) + 1));
    }
}`,
        explain: '选择排序每一轮把「剩下的人里最好的」换到当前位置，O(n²)；'
          + '二分查找利用「分数已经有序」这个条件，每次排除一半，O(log n)。'
          + '注意二分的前提是有序——这也是为什么必须先排序。'
      }
    ],
    extension: [
      '按分数区间统计人数：90+ / 80–89 / 70–79 / 60–69 / <60，并输出成直方图（每 5 人一个 #）。',
      '把 Student 改成 implements Comparable<Student>，用 Arrays.sort 排序。',
      '增加「按名字查询分数」：先按名字排序，再二分查找。',
      '用一个 int[][] 存 3 门课成绩，输出每个学生的总分与每门课的平均分。'
    ],
    solutionNote: '参考实现把「比较规则」（better）与「排序算法」（选择排序）分开，'
      + '再把分数提取成 int[] 后二分查排名——这正是「方法 + 数组 + 类」的组合方式。'
  },

  /* ==================================================================
   * 项目 3 · wordcount 文本分析器（ch02 / ch05 / ch10）
   * ================================================================== */
  {
    id: 'wordcount',
    title: '文本分析器',
    en: 'WORD COUNTER',
    tagline: '分词 → 词频 → Top N：HashMap / HashSet 的第一战',
    level: 3,
    minutes: 130,
    chapters: ['ch02', 'ch05', 'ch10'],
    goals: [
      '掌握「读多行文本 → 清洗 → 统计」的标准数据处理流程',
      '用 HashMap 做词频统计、HashSet 做去重，理解「键值对」的用途',
      '给结果排序并取 Top N，理解「相同频次时按字典序」这种稳定的排序规则'
    ],
    intro: '写一个文本分析器：读入多行文本，统计词数、词频、去重数与 Top N 高频词。'
      + 'M1 只数词；M2 用 HashMap 做词频并按字典序输出；M3 按频次排序取前 k 个高频词。',
    milestones: [
      {
        n: 1,
        title: 'M1 · 分词与计数',
        tasks: [
          '第一行读入行数 n，随后 n 行是文本',
          '按空格切分，忽略空串；把词首尾的标点 , . ! ? ; : 去掉后再计数',
          '输出 "words=总词数"'
        ],
        starter: `import java.util.Scanner;

public class WordCount {
    static String clean(String w) {
        // TODO: 去掉 , . ! ? ; : 这些字符，返回剩下的部分
        return w;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        sc.nextLine();
        int words = 0;
        for (int i = 0; i < n; i++) {
            String line = sc.nextLine();
            // TODO: trim + split(" ") 后逐个 clean，非空就 words++
        }
        System.out.println("words=" + words);
    }
}`,
        tests: [
          { name: '两行文本', stdin: '2\nhello world\njava is fun\n', expect: 'words=5' },
          { name: '带标点', stdin: '1\nhello,world! test. data\n', expect: 'words=3' },
          { name: '空行不计数', stdin: '3\nThe quick, brown fox.\nJumps over the lazy dog!\n\n', expect: 'words=9' }
        ],
        hints: [
          'sc.nextLine() 读一整行（可能为空）；读完 n 之后先 nextLine() 吃掉换行。',
          'split(" ") 遇到连续空格会产生空串元素，用 length() > 0 过滤。',
          'clean 里逐字符拼接：遇到标点就跳过，其他字符拼进结果字符串。'
        ],
        solution: `import java.util.Scanner;

public class WordCount {
    static String clean(String w) {
        String out = "";
        for (int i = 0; i < w.length(); i++) {
            char c = w.charAt(i);
            if (c == ',' || c == '.' || c == '!' || c == '?' || c == ';' || c == ':') continue;
            out += c;
        }
        return out;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        sc.nextLine();
        int words = 0;
        for (int i = 0; i < n; i++) {
            String line = sc.nextLine().trim();
            String[] parts = line.split(" ");
            for (int j = 0; j < parts.length; j++) {
                if (clean(parts[j]).length() > 0) words++;
            }
        }
        System.out.println("words=" + words);
    }
}`,
        explain: '难点不是计数，而是「什么才算一个词」：空格切分、标点清洗、空串过滤。'
          + '真实世界的文本分析 80% 的代码都在做数据清洗。'
      },
      {
        n: 2,
        title: 'M2 · 词频统计',
        tasks: [
          '输入格式同 M1',
          '把每个词转成小写再统计（A 和 a 算同一个词）',
          '按字典序输出每个词与出现次数，每行 "word=次数"；最后输出 "unique=不同词数"'
        ],
        starter: `import java.util.Scanner;
import java.util.HashMap;
import java.util.ArrayList;
import java.util.Collections;

public class WordCount {
    static String clean(String w) { /* 沿用 M1 的实现 */ return w; }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        sc.nextLine();
        HashMap<String, Integer> freq = new HashMap<String, Integer>();
        // TODO: 统计每个词（先 clean 再 toLowerCase）
        // TODO: 用 ArrayList 收集所有 key，Collections.sort 排序，逐个输出
        // TODO: 输出 "unique=" + freq.size()
    }
}`,
        tests: [
          { name: '两行文本词频', stdin: '2\njava is fun\njava is hard\n', expect: 'fun=1\nhard=1\nis=2\njava=2\nunique=4' },
          { name: '大小写合并', stdin: '1\nA a b\n', expect: 'a=2\nb=1\nunique=2' },
          { name: '标点与大小写', stdin: '1\nHello, hello! WORLD.\n', expect: 'hello=2\nworld=1\nunique=2' }
        ],
        hints: [
          'HashMap 的 put / get / containsKey / size 就够用了：先查 containsKey，再决定 put 1 还是 put 旧值 + 1。',
          'HashMap 的遍历顺序不保证是字典序，所以要把 key 收集到 ArrayList 里再用 Collections.sort 排序。',
          '增强 for 遍历 keySet：for (String k : freq.keySet()) keys.add(k);'
        ],
        solution: `import java.util.Scanner;
import java.util.HashMap;
import java.util.ArrayList;
import java.util.Collections;

public class WordCount {
    static String clean(String w) {
        String out = "";
        for (int i = 0; i < w.length(); i++) {
            char c = w.charAt(i);
            if (c == ',' || c == '.' || c == '!' || c == '?' || c == ';' || c == ':') continue;
            out += c;
        }
        return out;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        sc.nextLine();
        HashMap<String, Integer> freq = new HashMap<String, Integer>();
        for (int i = 0; i < n; i++) {
            String[] parts = sc.nextLine().trim().split(" ");
            for (int j = 0; j < parts.length; j++) {
                String w = clean(parts[j]).toLowerCase();
                if (w.length() == 0) continue;
                if (freq.containsKey(w)) {
                    freq.put(w, freq.get(w) + 1);
                } else {
                    freq.put(w, 1);
                }
            }
        }
        ArrayList<String> keys = new ArrayList<String>();
        for (String k : freq.keySet()) keys.add(k);
        Collections.sort(keys);
        for (int i = 0; i < keys.size(); i++) {
            System.out.println(keys.get(i) + "=" + freq.get(keys.get(i)));
        }
        System.out.println("unique=" + freq.size());
    }
}`,
        explain: 'HashMap 是「键 → 值」的映射：键是词，值是次数。查找/插入平均 O(1)，所以统计 n 个词是 O(n)。'
          + '但 HashMap 不保证顺序，要输出有序结果必须自己收集 key 再排序。'
      },
      {
        n: 3,
        title: 'M3 · Top N 高频词',
        tasks: [
          '第一行 n（文本行数）；随后 n 行文本；最后一行是整数 k',
          '统计词频（小写、清洗同 M2）',
          '按「频次从高到低」排序；频次相同时按字典序升序',
          '输出前 k 个词，每行 "word=次数"；最后输出 "unique=不同词数"（k 大于词数时全部输出）'
        ],
        starter: `import java.util.Scanner;
import java.util.HashMap;
import java.util.ArrayList;

public class WordCount {
    static String clean(String w) { /* 同 M2 */ return w; }

    static boolean better(String a, String b, HashMap<String, Integer> f) {
        // TODO: f.get(a) > f.get(b) 时返回 true；频次相同时 a.compareTo(b) < 0
        return false;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        sc.nextLine();
        // TODO: 统计词频（同 M2）
        // TODO: 读最后一行的 k
        // TODO: 用选择排序按 better 排序 keys，输出前 min(k, size) 个
        // TODO: 输出 "unique=" + freq.size()
    }
}`,
        tests: [
          { name: 'Top 2', stdin: '2\nthe cat the dog\nthe bird cat\n2\n', expect: 'the=3\ncat=2\nunique=4' },
          { name: 'k 大于词数', stdin: '1\na b a\n5\n', expect: 'a=2\nb=1\nunique=2' },
          { name: '同频按字典序', stdin: '1\nb a c\n2\n', expect: 'a=1\nb=1\nunique=3' }
        ],
        hints: [
          '排序规则要写成「比较函数」：先比频次，频次相同再比字典序。',
          '选择排序 + better 比较函数：外层 i 从 0 到 size-2，内层找「剩下的里最该排前面的」再交换。',
          '取前 k 个时用 Math.min(k, keys.size()) 防止越界。'
        ],
        solution: `import java.util.Scanner;
import java.util.HashMap;
import java.util.ArrayList;

public class WordCount {
    static String clean(String w) {
        String out = "";
        for (int i = 0; i < w.length(); i++) {
            char c = w.charAt(i);
            if (c == ',' || c == '.' || c == '!' || c == '?' || c == ';' || c == ':') continue;
            out += c;
        }
        return out;
    }

    static boolean better(String a, String b, HashMap<String, Integer> f) {
        int fa = f.get(a);
        int fb = f.get(b);
        if (fa != fb) return fa > fb;
        return a.compareTo(b) < 0;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        sc.nextLine();
        HashMap<String, Integer> freq = new HashMap<String, Integer>();
        for (int i = 0; i < n; i++) {
            String[] parts = sc.nextLine().trim().split(" ");
            for (int j = 0; j < parts.length; j++) {
                String w = clean(parts[j]).toLowerCase();
                if (w.length() == 0) continue;
                if (freq.containsKey(w)) freq.put(w, freq.get(w) + 1);
                else freq.put(w, 1);
            }
        }
        int k = sc.nextInt();
        ArrayList<String> keys = new ArrayList<String>();
        for (String key : freq.keySet()) keys.add(key);
        for (int i = 0; i < keys.size() - 1; i++) {
            int best = i;
            for (int j = i + 1; j < keys.size(); j++) {
                if (better(keys.get(j), keys.get(best), freq)) best = j;
            }
            String t = keys.get(i);
            keys.set(i, keys.get(best));
            keys.set(best, t);
        }
        int top = Math.min(k, keys.size());
        for (int i = 0; i < top; i++) {
            System.out.println(keys.get(i) + "=" + freq.get(keys.get(i)));
        }
        System.out.println("unique=" + freq.size());
    }
}`,
        explain: 'Top N 是「排序 + 截断」：先用比较函数把 key 排好，再取前 k 个。'
          + '选择排序 O(n²) 在词数几千以内完全够用；词数上百万时才需要考虑用优先队列（堆）。'
      }
    ],
    extension: [
      '用 HashSet 只统计「不同单词」的个数（不关心次数）。',
      '统计字符频率而不是词频（HashMap<Character, Integer>），并忽略空格与标点。',
      '输出「只出现一次的词」列表，并按字典序排序。',
      '把 Top N 的结果输出成柱状图：每行 word=####（# 的个数 = 频次）。'
    ],
    solutionNote: '参考实现把「清洗 → 统计 → 排序 → 截断」拆成四步；'
      + '真正值得记的是 HashMap 的统计模式（containsKey / get / put）。'
  },

  /* ==================================================================
   * 项目 4 · game 小游戏（ch03 / ch04 / ch12）
   * ================================================================== */
  {
    id: 'game',
    title: '小游戏合集',
    en: 'MINI GAMES',
    tagline: '猜数字 → 井字棋 → 胜负判断',
    level: 2,
    minutes: 140,
    chapters: ['ch03', 'ch04', 'ch12'],
    goals: [
      '用循环 + 反馈把「游戏主循环」写出来',
      '用二维数组表示棋盘，理解行列下标与「一条线」的关系',
      '把重复的胜负判断抽成方法，体会「数据结构 + 算法」的关系'
    ],
    intro: '两个经典小游戏：猜数字与井字棋（命令行版）。'
      + 'M1 实现猜数字的循环反馈；M2 用二维 char 数组画出井字棋棋盘；M3 判断胜负并处理「和棋 / 继续」。',
    milestones: [
      {
        n: 1,
        title: 'M1 · 猜数字',
        tasks: [
          '第一行读入正确答案 secret（整数），随后每行一个猜测，直到猜中为止',
          '每次猜测输出反馈：偏小输出 too low、偏大输出 too high、猜中输出 correct 并结束',
          '最后输出 "tries=猜测次数"'
        ],
        starter: `import java.util.Scanner;

public class Guess {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int secret = sc.nextInt();
        int tries = 0;
        while (sc.hasNext()) {
            int g = sc.nextInt();
            tries++;
            // TODO: 比较 g 与 secret，输出 too low / too high / correct
            // TODO: 猜中时跳出循环
        }
        System.out.println("tries=" + tries);
    }
}`,
        tests: [
          { name: '猜三次', stdin: '42\n50\n25\n42\n', expect: 'too high\ntoo low\ncorrect\ntries=3' },
          { name: '一次猜中', stdin: '7\n7\n', expect: 'correct\ntries=1' },
          { name: '慢慢逼近', stdin: '100\n1\n50\n99\n100\n', expect: 'too low\ntoo low\ntoo low\ncorrect\ntries=4' }
        ],
        hints: [
          'while (sc.hasNext()) 表示「还有输入就继续读」；配合 break 在猜中时退出。',
          '三个分支的顺序很重要：先判断小于、再判断大于，剩下的就是相等。',
          'tries 要在读到猜测后立即 ++，这样猜中那次也会被计入。'
        ],
        solution: `import java.util.Scanner;

public class Guess {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int secret = sc.nextInt();
        int tries = 0;
        while (sc.hasNext()) {
            int g = sc.nextInt();
            tries++;
            if (g < secret) {
                System.out.println("too low");
            } else if (g > secret) {
                System.out.println("too high");
            } else {
                System.out.println("correct");
                break;
            }
        }
        System.out.println("tries=" + tries);
    }
}`,
        explain: '游戏主循环 =「读输入 → 更新状态 → 反馈 → 判断是否结束」。'
          + '这个骨架换成任何交互式程序都成立。'
      },
      {
        n: 2,
        title: 'M2 · 井字棋棋盘',
        tasks: [
          '第一行读入一个长度为 9 的字符串，按行优先顺序表示 3×3 棋盘（X / O / .）',
          '把字符放进 char[][] board = new char[3][3]',
          '输出 3 行棋盘，每行 3 个字符、字符之间一个空格'
        ],
        starter: `import java.util.Scanner;

public class TicTacToe {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        char[][] board = new char[3][3];
        int k = 0;
        // TODO: 双重循环把 s 的字符放进 board（行优先）
        // TODO: 再输出 3 行，每行字符之间加一个空格
    }
}`,
        tests: [
          { name: 'X 在左上角', stdin: 'X........\n', expect: 'X . .\n. . .\n. . .' },
          { name: '交替落子', stdin: 'XOXOXOXOX\n', expect: 'X O X\nO X O\nX O X' },
          { name: '中间一子', stdin: '...X...O.\n', expect: '. . .\nX . .\n. O .' }
        ],
        hints: [
          '第 k 个字符对应 board[k / 3][k % 3]：行号 = k / 3，列号 = k % 3。',
          '二维数组遍历用双重 for，外层 i 是行、内层 j 是列。',
          '输出时注意「行内字符之间加空格、行末不加」——用 j > 0 判断。'
        ],
        solution: `import java.util.Scanner;

public class TicTacToe {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        char[][] board = new char[3][3];
        int k = 0;
        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {
                board[i][j] = s.charAt(k);
                k++;
            }
        }
        for (int i = 0; i < 3; i++) {
            String row = "";
            for (int j = 0; j < 3; j++) {
                if (j > 0) row += " ";
                row += board[i][j];
            }
            System.out.println(row);
        }
    }
}`,
        explain: '二维数组的本质是「数组的数组」：board[i] 是第 i 行（一个 char[]）。'
          + '行优先填充是 k/3、k%3 的经典用法；棋盘的「行列」与「一条线」正是下一步胜负判断的基础。'
      },
      {
        n: 3,
        title: 'M3 · 胜负判断',
        tasks: [
          '输入格式同 M2（9 个字符）',
          '输出棋盘（同 M2），再输出一行结果：X wins / O wins / Draw / Playing',
          '判断 3 行、3 列、2 条对角线共 8 条线；空位 . 不算赢',
          '棋盘满且无人获胜 → Draw；未满且无人获胜 → Playing'
        ],
        starter: `import java.util.Scanner;

public class TicTacToe {
    static char[][] build(String s) {
        char[][] b = new char[3][3];
        int k = 0;
        for (int i = 0; i < 3; i++) for (int j = 0; j < 3; j++) { b[i][j] = s.charAt(k); k++; }
        return b;
    }

    // 三个格子是否同一个人（且不是空位）
    static boolean all(char[][] b, int r1, int c1, int r2, int c2, int r3, int c3) {
        char p = b[r1][c1];
        if (p == '.') return false;
        return p == b[r2][c2] && p == b[r3][c3];
    }

    static char winner(char[][] b) {
        // TODO: 检查 3 行、3 列、2 条对角线，返回 'X' / 'O' / '.'（无人赢）
        return '.';
    }

    static boolean full(char[][] b) {
        // TODO: 还有 '.' 就返回 false
        return false;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        char[][] b = build(sc.next());
        // TODO: 输出棋盘（同 M2）
        // TODO: 根据 winner / full 输出 X wins / O wins / Draw / Playing
    }
}`,
        tests: [
          { name: 'X 一行获胜', stdin: 'XXXOO....\n', expect: 'X X X\nO O .\n. . .\nX wins' },
          { name: 'O 对角线获胜', stdin: 'O..XOXXOO\n', expect: 'O . .\nX O X\nX O O\nO wins' },
          { name: '满盘和棋', stdin: 'XOXXOOOXX\n', expect: 'X O X\nX O O\nO X X\nDraw' }
        ],
        hints: [
          '先用 all(...) 把「一行/一列/对角线是否同色」写成一个小工具，winner 里只负责 8 次调用。',
          '8 条线：3 行 (i,0)(i,1)(i,2)、3 列 (0,i)(1,i)(2,i)、主对角 (0,0)(1,1)(2,2)、副对角 (0,2)(1,1)(2,0)。',
          '结果判断顺序：先 winner（有人赢就结束），再 full（满盘和棋），否则 Playing。'
        ],
        solution: `import java.util.Scanner;

public class TicTacToe {
    static char[][] build(String s) {
        char[][] b = new char[3][3];
        int k = 0;
        for (int i = 0; i < 3; i++)
            for (int j = 0; j < 3; j++) {
                b[i][j] = s.charAt(k);
                k++;
            }
        return b;
    }

    static boolean all(char[][] b, int r1, int c1, int r2, int c2, int r3, int c3) {
        char p = b[r1][c1];
        if (p == '.') return false;
        return p == b[r2][c2] && p == b[r3][c3];
    }

    static char winner(char[][] b) {
        for (int i = 0; i < 3; i++) {
            if (all(b, i, 0, i, 1, i, 2)) return b[i][0];
            if (all(b, 0, i, 1, i, 2, i)) return b[0][i];
        }
        if (all(b, 0, 0, 1, 1, 2, 2)) return b[0][0];
        if (all(b, 0, 2, 1, 1, 2, 0)) return b[0][2];
        return '.';
    }

    static boolean full(char[][] b) {
        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {
                if (b[i][j] == '.') return false;
            }
        }
        return true;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        char[][] b = build(sc.next());
        for (int i = 0; i < 3; i++) {
            String row = "";
            for (int j = 0; j < 3; j++) {
                if (j > 0) row += " ";
                row += b[i][j];
            }
            System.out.println(row);
        }
        char w = winner(b);
        if (w == 'X') System.out.println("X wins");
        else if (w == 'O') System.out.println("O wins");
        else if (full(b)) System.out.println("Draw");
        else System.out.println("Playing");
    }
}`,
        explain: '胜负判断把「8 条线」抽象成一个 all(...) 调用，代码从 24 个比较变成 8 行。'
          + '这是「用方法消除重复」的典型场景；下一步可以思考：如何让程序自己下一步棋（这就是 AI 的雏形）？'
      }
    ],
    extension: [
      '让电脑自动猜数字：用二分法（每次猜区间中点）代替人类猜，统计平均次数。',
      '完整井字棋：读入一整个落子序列，每步都输出棋盘与当前状态，非法落子输出 ERR。',
      '把胜负判断改成「检查最后一步是否连成三子」，让判断从 O(8) 变成 O(1)。',
      '加入简单 AI：在空位里找「能立刻赢」的位置，找不到再堵对方。'
    ],
    solutionNote: '参考实现先给数据结构（char[3][3] 棋盘），再给工具方法（all / winner / full），'
      + '最后组织主流程；这正是「数据结构 + 算法」的思考顺序。'
  }
]);
