/* =====================================================================
 * data/exam.js · 四套在线模拟卷
 * A 卷：2024 风格，9 题 / 100 分 / 100 分钟，读程序写输出为主（Midterm 1 范围）
 * B 卷：2025 风格，7 大题 / 100 分 / 90 分钟，选择/判断/简答/填空/读代码/找 bug（Midterm 1 范围）
 * M2 卷：Midterm 2 范围（ch07–ch10 Objects/继承多态/内存/ADT），8 大题 / 100 分 / 90 分钟
 * F 卷：Final 范围（ch11–ch13 + 跨章综合），9 大题 / 100 分 / 120 分钟
 * 结构：{ id, title, style, date, minutes, totalScore, instructions, questions:[…] }
 *       question.parts[] 是判分单位：kind = choice|tf|fill|output|keywords
 * 注入：CSC.registerExam({...})；另挂 CSC._exams 供引擎加载时读取
 * 答案可靠性：A/B 卷题目来自 计算机科学与 Java 编程导论_Mock_Exams/src；M2/F 卷全部代码题答案用 JDK 25 实跑核对
 * ===================================================================== */
(function () {
  'use strict';

  /* ================================================================ A 卷 */
  var A = {
    id: 'A',
    title: 'Mock Midterm A',
    style: '2024 style',
    subtitle: 'CUHK(SZ)-计算机科学与 Java 编程导论 Midterm Exam · Read the Java programs and write down your answers',
    date: 'Oct. 20, 2026',
    minutes: 100,
    totalScore: 100,
    summary: '2024 风格卷：9 道读程序题，覆盖命令行参数、数组、循环、方法、二维数组与二分查找。适合在刷完 ch01–ch11 后做一次完整限时训练。',
    instructions: [
      'This is a closed-book exam. No notes, calculators, or dictionaries are allowed.',
      'Answer all questions within the time limit of 100 minutes.',
      'All questions are based on Java 17 (or later) and <code>java</code> / <code>javac</code> command-line tools.',
      'For “line number” questions, line numbers start from 1 at the first line of the program.'
    ],
    questions: [
      {
        no: 1, points: 10, type: 'read & write',
        intro: 'Read the following Java program, and write down your answer(s).',
        code:
`public class Q1 {
    public static void main(String[] args) {
        int max = Integer.parseInt(args[0]);
        int min = Integer.parseInt(args[0]);
        for (int i = 1; i < args.length; i++) {
            int v = Integer.parseInt(args[i]);
            if (v > max) max = v;
            if (v < min) min = v;
        }
        System.out.println("max = " + max + ", min = " + min);
        System.out.println("range = " + (max - min));
    }
}`,
        parts: [
          {
            label: '(a)', points: 5, kind: 'fill',
            prompt: 'What is the command to compile the program?',
            answer: 'javac Q1.java', accept: ['javac *.java', 'javac Q1.java'],
            explain: '编译用 javac，参数是**带 .java 扩展名**的源文件名：javac Q1.java。运行才是 java Q1（不带扩展名）。javac *.java 会编译当前目录所有源文件，也接受。'
          },
          {
            label: '(b)', points: 5, kind: 'output',
            prompt: 'What is the output of the program when running “java Q1 7 3 9 1 5”?',
            answer: 'max = 9, min = 1\nrange = 8',
            explain: 'args = [7, 3, 9, 1, 5]，首个参数同时作为 max 和 min 的初值。循环从 i=1 开始扫描：3 不更新、9 更新 max、1 更新 min、5 不更新。于是 max=9、min=1，range = 9-1 = 8。注意循环从 1 开始，args[0] 已经被初始化过了。'
          }
        ]
      },
      {
        no: 2, points: 10, type: 'read & fix',
        intro: 'Read the following Java program, and write down your answer(s).',
        code:
`public class Q2 {
    public static void main(String[] args) {
        int[] a = new int[args.length];
        for (int i = 0; i < args.length; i++)
            a[i] = Integer.parseInt(args[i]);
        int first = a[0];
        for (int i = 0; i < a.length - 1; i++)
            a[i] = a[i + 1];
        a[a.length - 1] = first;
        for (int i = 0; i < a.length; i++)
            System.out.print(a[i] + " ");
    }
}`,
        parts: [
          {
            label: '(a)', points: 4, kind: 'output',
            prompt: 'What is the output of the program when running “java Q2 1 2 3 4 5”?',
            answer: '2 3 4 5 1',
            explain: '程序保存 a[0]=1，把 a[1]~a[4] 整体左移一格（a[i] = a[i+1]），最后把保存的 1 放到末尾。结果 2 3 4 5 1，即**左旋一位**。末尾每个元素后面跟一个空格，判分忽略行尾空白。'
          },
          {
            label: '(b)', points: 6, kind: 'keywords',
            prompt: 'If the program is to rotate the command-line input numbers one position to the <b>right</b> (the last number becomes the first, and every other number moves one place to the right), there is a mistake. Point out the line number(s) and write the corrected code.',
            keywords: [['line 6', 'lines 6', 'line 6-9', 'lines 6-9', '第 6 行', '第6行'], ['int last', 'last = a[a.length - 1]', 'last'], ['a.length - 1', 'a.length-1'], ['i > 0', 'i>0', 'right to left', '从右往左'], ['a[i - 1]', 'a[i-1]'], ['a[0] = last', 'a[0]=last']],
            answer: 'Lines 6-9 must be changed. Line 6: save the LAST element with int last = a[a.length - 1];. Lines 7-8: copy from right to left, for (int i = a.length - 1; i > 0; i--) a[i] = a[i - 1];. Line 9: put it at the front, a[0] = last;.',
            explain: '右旋要三步：①第 6 行保存**最后一个**元素 `int last = a[a.length - 1];`（原程序保存的是第一个，方向就反了）；②第 7–8 行必须**从右往左**复制，否则会覆盖还没用到的数据：`for (int i = a.length - 1; i > 0; i--) a[i] = a[i - 1];`；③第 9 行把保存的元素放到开头 `a[0] = last;`。只把循环方向反过来、却仍保存第一个元素，会丢掉一个值，只能拿部分分。'
          }
        ]
      },
      {
        no: 3, points: 10, type: 'read & write',
        intro: 'Read the following Java program, and write down your answer(s).',
        code:
`public class Q3 {
    public static void main(String[] args) {
        int n = Integer.parseInt(args[0]);
        int temp = n;
        int sum = 0;
        while (n > 0) {
            int d = n % 10;
            sum += d * d * d;
            n /= 10;
        }
        if (temp == sum) System.out.println("true");
        else System.out.println("false");
    }
}`,
        parts: [
          {
            label: '(a)', points: 3, kind: 'output',
            prompt: 'What is the output of the program when running “java Q3 153”?',
            answer: 'true',
            explain: '拆位循环：n=153 → d=3,sum=27,n=15；d=5,sum=27+125=152,n=1；d=1,sum=152+1=153,n=0。temp=153 与 sum=153 相等，输出 true。153 是最有名的 Armstrong 数（水仙花数）。'
          },
          {
            label: '(b)', points: 3, kind: 'output',
            prompt: 'What is the output of the program when running “java Q3 154”?',
            answer: 'false',
            explain: '154 的各位立方和 = 1³ + 5³ + 4³ = 1 + 125 + 64 = 190 ≠ 154，所以输出 false。'
          },
          {
            label: '(c)', points: 4, kind: 'fill',
            prompt: 'A three-digit integer is an <i>Armstrong number</i> if it equals the sum of the cubes of its three digits. How many Armstrong numbers are there among all the three-digit integers from 100 to 999?',
            answer: '4', accept: ['4', '4 个', '四个'],
            explain: '三位水仙花数只有 4 个：153 = 1+125+27、370 = 27+343+0、371 = 27+343+1、407 = 64+0+343。可以写个小循环枚举 100–999 验证。'
          }
        ]
      },
      {
        no: 4, points: 10, type: 'read & write',
        intro: 'Read the following Java program, and write down your answer(s).',
        code:
`public class Q4 {
    public static void main(String[] args) {
        int a = Integer.parseInt(args[0]);
        int b = Integer.parseInt(args[1]);
        int step = (a > b) ? a : b;
        int lcm = step;
        while (!(lcm % a == 0 && lcm % b == 0)) lcm += step;
        System.out.println("lcm = " + lcm);
    }
}`,
        parts: [
          {
            label: '(a)', points: 5, kind: 'output',
            prompt: 'What is the output of the program when running “java Q4 12 18”?',
            answer: 'lcm = 36', accept: ['36', 'lcm = 36'],
            explain: 'step = max(12,18) = 18。从 18 开始每次加 18 直到同时被 12 和 18 整除：18（18%12=6 ✗）、36（36%12=0 且 36%18=0 ✓），输出 lcm = 36。注意循环条件是**双重取反** `!(... && ...)`，等价于“两个余数都为 0 时停止”。'
          },
          {
            label: '(b)', points: 5, kind: 'output',
            prompt: 'What is the output of the program when running “java Q4 7 5”?',
            answer: 'lcm = 35', accept: ['35', 'lcm = 35'],
            explain: 'step = max(7,5) = 7。7（7%5=2 ✗）、14、21、28、35（35%7=0 且 35%5=0 ✓），输出 lcm = 35。两数互质时最小公倍数就是乘积 7×5。'
          }
        ]
      },
      {
        no: 5, points: 10, type: 'read & write',
        intro: 'Read the following Java program, and write down your answer(s).',
        code:
`public class Q5 {
    public static void modify(int[] x) {
        x[0] = 100;
        x = new int[]{1, 2, 3};
        x[0] = 999;
    }

    public static void main(String[] args) {
        int[] a = {5, 6, 7};
        int[] b = a;
        modify(a);
        System.out.println("a[0] = " + a[0]);
        System.out.println("b[0] = " + b[0]);
        b[1] = a[2];
        System.out.println("a.length = " + a.length + ", b.length = " + b.length);
        System.out.println("b[1] = " + b[1]);
    }
}`,
        parts: [
          {
            label: '', points: 10, kind: 'output',
            prompt: 'What is the output of the program when running “java Q5”?',
            answer: 'a[0] = 100\nb[0] = 100\na.length = 3, b.length = 3\nb[1] = 7',
            explain: '① b = a 让两个引用指向同一个数组；② modify(a) 里 x[0]=100 通过引用改到原数组，所以 a[0] 和 b[0] 都是 100；③ x = new int[]{1,2,3} 只让**参数 x** 改指向新数组，之后 x[0]=999 与原数组无关，a 仍是 {100,6,7}；④ b[1] = a[2] 把 7 复制到下标 1；⑤ 两个引用仍指向同一数组，length 都是 3。四行各占 2.5 分，写出几行得几行的分。'
          }
        ]
      },
      {
        no: 6, points: 10, type: 'read & write',
        intro: 'Read the following Java program, and write down your answer(s).',
        code:
`public class Q6 {
    public static void main(String[] args) {
        int[] a = {7, 2, 9, 4, 1, 8, 3};
        for (int i = 0; i < a.length - 1; i++) {
            int min = i;
            for (int j = i + 1; j < a.length; j++)
                if (a[j] < a[min]) min = j;
            int t = a[i]; a[i] = a[min]; a[min] = t;
        }
        for (int i = 0; i < a.length; i++) System.out.print(a[i] + " ");
    }
}`,
        parts: [
          {
            label: '(a)', points: 5, kind: 'output',
            prompt: 'What is the output of the program when running “java Q6”?',
            answer: '1 2 3 4 7 8 9',
            explain: '这是选择排序（升序）：每轮在未排序区间找最小值的下标，与该区间第一个元素交换。7 个元素排完 {7,2,9,4,1,8,3} → 1 2 3 4 7 8 9。'
          },
          {
            label: '(b)', points: 5, kind: 'output',
            prompt: 'If the comparison on line 7 is changed from “a[j] &lt; a[min]” to “a[j] &gt; a[min]”, what is the output?',
            answer: '9 8 7 4 3 2 1',
            explain: '把 `<` 改成 `>` 后，内层循环找的是**最大值**而不是最小值，同一个算法就变成降序排序，输出 9 8 7 4 3 2 1。'
          }
        ]
      },
      {
        no: 7, points: 10, type: 'read & fix',
        intro: 'The following program is supposed to print the binary representation of a positive integer n, by repeatedly dividing n by 2 and collecting the remainders. Read the program and answer the questions.',
        code:
`public class Q7 {
    public static void main(String[] args) {
        int n = Integer.parseInt(args[0]);
        int[] bits = new int[32];
        int count = 0;
        while (n > 0) {
            bits[count] = n % 2;
            count++;
            n /= 2;
        }
        for (int i = 0; i < count; i++) System.out.print(bits[i]);
    }
}`,
        parts: [
          {
            label: '(a)', points: 5, kind: 'output',
            prompt: 'What is the output of the program when running “java Q7 19”?',
            answer: '11001',
            explain: '19 ÷ 2 依次得到余数 1,1,0,0,1（从最低位到最高位），bits = [1,1,0,0,1]，程序按下标 0→4 打印，输出 11001。它正好是 19 的二进制 10011 的反序。'
          },
          {
            label: '(b)', points: 5, kind: 'keywords',
            prompt: 'The program does not print the correct binary representation of n. Point out the line number of the mistake and correct it.',
            keywords: [['line 11', 'lines 11', '第 11 行', '第11行'], ['count - 1', 'count-1'], ['i >= 0', 'i>=0'], ['i--', 'i--']],
            answer: 'Line 11. Change the print loop to: for (int i = count - 1; i >= 0; i--) System.out.print(bits[i]);',
            explain: '余数是**从最低位往最高位**产生的，存进 bits[0..count-1]，打印时必须从 count-1 倒着打印到 0。第 11 行改成 `for (int i = count - 1; i >= 0; i--) System.out.print(bits[i]);` 即可。只写对“倒序”但没给出正确循环也只能拿部分分。'
          }
        ]
      },
      {
        no: 8, points: 15, type: 'read & fix',
        intro: 'Study the following Java program. It works on a 3×3 integer matrix and prints the sum of its main diagonal, the sum of all its elements, and the sum of its anti-diagonal (from the top-right corner to the bottom-left corner).',
        code:
`public class Q8 {
    public static void main(String[] args) {
        int[][] m = {
            {1, 2, 3},
            {4, 5, 6},
            {7, 8, 10}
        };
        int diag = 0;
        for (int i = 0; i < m.length; i++)
            for (int j = 0; j < m[i].length; j++)
                if (i == j) diag += m[i][j];
        System.out.println("diag = " + diag);

        int total = 0;
        for (int i = 0; i < m.length; i++)
            for (int j = 0; j < m[i].length; j++)
                total += m[i][j];
        System.out.println("total = " + total);

        int anti = 0;
        for (int i = 0; i < m.length; i++)
            for (int j = 0; j < m[i].length; j++)
                if (i == j) anti += m[i][j];
        System.out.println("anti = " + anti);
    }
}`,
        parts: [
          {
            label: '(a)', points: 10, kind: 'output',
            prompt: 'What is the output of the program when running “java Q8”?',
            answer: 'diag = 16\ntotal = 46\nanti = 16',
            explain: '主对角线 i==j：m[0][0]+m[1][1]+m[2][2] = 1+5+10 = 16；全部元素和 = 1+2+3+4+5+6+7+8+10 = 46；anti 的循环条件写错了，仍然用 i==j，所以又算了一遍主对角线 = 16。三行分别给分。'
          },
          {
            label: '(b)', points: 5, kind: 'keywords',
            prompt: 'The program does not compute the sum of the anti-diagonal correctly. Point out the line number of the mistake and correct it.',
            keywords: [['line 23', 'lines 23', '第 23 行', '第23行'], ['i + j', 'i+j'], ['m.length - 1', 'm.length-1', 'length - 1', 'length-1']],
            answer: 'Line 23. Change it to: if (i + j == m.length - 1) anti += m[i][j];',
            explain: '副对角线（右上到左下）的下标满足 i + j = n - 1。第 23 行把条件从 `i == j` 改成 `if (i + j == m.length - 1)`，anti = m[0][2]+m[1][1]+m[2][0] = 3+5+7 = 15。'
          }
        ]
      },
      {
        no: 9, points: 15, type: 'read & write',
        intro: 'Read the following Java program, and write down your answer(s). The array passed to <code>search</code> is sorted in <i>descending</i> order.',
        code:
`public class Q9 {
    public static int search(int[] a, int n) {
        int lo = 0, hi = a.length - 1, c = 0;
        while (lo <= hi) {
            c++;
            int mid = (lo + hi) / 2;
            if (a[mid] == n) return c;
            if (a[mid] > n) lo = mid + 1;
            else hi = mid - 1;
        }
        return -1;
    }

    public static void main(String[] args) {
        int[] a = {20, 18, 16, 14, 12, 10, 8, 6, 4, 2};
        int n = Integer.parseInt(args[0]);
        System.out.println("c = " + search(a, n));
    }
}`,
        parts: [
          {
            label: '(a)', points: 4, kind: 'output',
            prompt: 'What is the output of the program when running “java Q9 4”?',
            answer: 'c = 3', accept: ['3', 'c = 3'],
            explain: '目标 4 在下标 8。lo=0,hi=9 → mid=4（12>4）→ lo=5；lo=5,hi=9 → mid=7（6>4）→ lo=8；lo=8,hi=9 → mid=8（4==4）返回 3。比较了 3 次。'
          },
          {
            label: '(b)', points: 4, kind: 'output',
            prompt: 'What is the output of the program when running “java Q9 20”?',
            answer: 'c = 3', accept: ['3', 'c = 3'],
            explain: '目标 20 在下标 0，但它是**降序**数组的中间元素 12 先被比较：mid=4 → a[4]=12 < 20，按“升序逻辑”写的分支把 hi 移到 3；mid=1 → a[1]=18 < 20 → hi=0；mid=0 → a[0]=20，返回 3。注意这次“碰巧”找到了，但比较路径依赖降序判断 `a[mid] > n` 时 lo = mid+1。'
          },
          {
            label: '(c)', points: 4, kind: 'output',
            prompt: 'What is the output of the program when running “java Q9 7”?',
            answer: 'c = -1', accept: ['-1', 'c = -1'],
            explain: '7 不在数组中。搜索区间不断收缩直到 lo > hi，循环结束返回 -1，所以输出 c = -1。'
          },
          {
            label: '(d)', points: 3, kind: 'fill',
            prompt: 'For command-line input integers that appear in the array, what is the largest possible output value of “c”?',
            answer: '4', accept: ['4', '4 次', '四次'],
            explain: '10 个元素，每轮区间减半：10 → 5 → 2 → 1，最多 4 次比较（⌈log₂10⌉ = 4）。所以对数组中存在的元素，c 最大为 4。'
          }
        ]
      }
    ]
  };

  /* ================================================================ B 卷 */
  var B = {
    id: 'B',
    title: 'Mock Midterm B',
    style: '2025 style',
    subtitle: 'CUHK(SZ)-计算机科学与 Java 编程导论 Midterm Exam · Multiple choice / True-False / Short answer / Fill in / Read code / Find bugs',
    date: 'Oct. 29, 2026',
    minutes: 90,
    totalScore: 100,
    summary: '2025 风格卷：7 大题 100 分，题型混合（选择 20 + 判断 6 + 简答 20 + 写代码 5 + 填空 9 + 读代码 30 + 找 bug 10）。适合按真实题型分布做整套训练。',
    instructions: [
      'This is a closed-book exam. No notes, calculators, or dictionaries are allowed.',
      'Answer all questions within the time limit of 90 minutes.',
      'For multiple-choice questions, choose ONE best answer.',
      'For short-answer and find-bug questions, the grader checks for the key points; write clearly and concisely.'
    ],
    questions: [
      {
        no: 1, points: 20, type: 'multiple choice',
        intro: 'Circle ONE solution that best suits each question. (4 points each)',
        parts: [
          {
            label: '(1)', points: 4, kind: 'choice',
            prompt: 'Which of the following is a valid Java identifier?',
            options: [
              { text: '2ndValue' },
              { text: '_count', correct: true },
              { text: 'class' },
              { text: 'my-name' }
            ],
            explain: '标识符首字符不能是数字（2ndValue 非法）；class 是关键字；- 是减号，不能出现在标识符里（my-name 非法）。_count 以下划线开头，合法。'
          },
          {
            label: '(2)', points: 4, kind: 'choice',
            prompt: 'What is the value of the following expression?',
            code: '(double) 7 / 2',
            options: [
              { text: '3' },
              { text: '3.5', correct: true },
              { text: '3.0' },
              { text: '4' }
            ],
            explain: '强转的优先级高于除法：`(double) 7 / 2` 先把 7 变成 7.0，再除以 2（int 自动提升为 double），结果是 3.5。若是 `(double) (7 / 2)` 才会先整数除法得 3 再转成 3.0。'
          },
          {
            label: '(3)', points: 4, kind: 'choice',
            prompt: 'Which of the following correctly declares and creates a 3-by-4 two-dimensional int array?',
            options: [
              { text: 'int[][] a = new int[3][4];', correct: true },
              { text: 'int[3][4] a;' },
              { text: 'int a[][] = new int[4][3];' },
              { text: 'int[] a = new int[3][4];' }
            ],
            explain: '`new int[3][4]` 表示 3 行 4 列。B 的方括号里不能写长度（声明时不创建数组）；C 创建的是 4 行 3 列，尺寸反了；D 是一维数组的声明，不能接二维 new。'
          },
          {
            label: '(4)', points: 4, kind: 'choice',
            prompt: 'What is the main difference between a while loop and a do-while loop?',
            options: [
              { text: 'A do-while loop executes its body at least once.', correct: true },
              { text: 'A do-while loop cannot contain a break statement.' },
              { text: 'A while loop executes its body at least once.' },
              { text: 'There is no difference.' }
            ],
            explain: 'do-while 先执行循环体再判断条件，所以至少执行一次；while 先判断后执行，可能一次都不执行。break 两种循环都能用。'
          },
          {
            label: '(5)', points: 4, kind: 'choice',
            prompt: 'How many times will the following loop execute?',
            code: 'for (int i = 10; i > 0; i -= 3) {\n    System.out.println(i);\n}',
            options: [
              { text: '3' },
              { text: '4', correct: true },
              { text: '5' },
              { text: '6' }
            ],
            explain: 'i 依次取 10、7、4、1，共 4 轮；下一个 i = -2 不满足 i > 0，退出。'
          }
        ]
      },
      {
        no: 2, points: 6, type: 'true / false',
        intro: 'For each of the following statements, choose “True (T)” or “False (F)”. (2 points each)',
        parts: [
          {
            label: '(a)', points: 2, kind: 'tf',
            prompt: 'In Java, the index of an array starts from 1.',
            options: [{ text: 'True (T)' }, { text: 'False (F)', correct: true }],
            explain: '数组下标从 0 开始，最后一个元素的下标是 length - 1。'
          },
          {
            label: '(b)', points: 2, kind: 'tf',
            prompt: 'The operator &amp;&amp; uses short-circuit evaluation: if the left operand is false, the right operand is not evaluated.',
            options: [{ text: 'True (T)', correct: true }, { text: 'False (F)' }],
            explain: '&& 短路：左边为 false 时右边不求值，所以 `if (i < n && a[i] > 0)` 在 i >= n 时不会越界。|| 同理：左边为 true 时右边不求值。'
          },
          {
            label: '(c)', points: 2, kind: 'tf',
            prompt: 'A local variable declared inside a method is automatically initialized to 0 if it is not explicitly initialized.',
            options: [{ text: 'True (T)' }, { text: 'False (F)', correct: true }],
            explain: '只有**字段**（实例变量/静态变量）有默认值。局部变量必须先赋值后使用，否则编译错误 “variable might not have been initialized”。'
          }
        ]
      },
      {
        no: 3, points: 20, type: 'short answer',
        intro: 'Answer the following short questions. (4 points each)',
        parts: [
          {
            label: '(1)', points: 4, kind: 'keywords',
            prompt: 'Write one line of Java code that declares and initializes an array of five double values: 0.5, 1.0, 1.5, 2.0, 2.5.',
            keywords: ['double', '0.5', '2.5', '{'],
            answer: 'double[] a = {0.5, 1.0, 1.5, 2.0, 2.5};',
            explain: '数组字面量初始化：`double[] a = {0.5, 1.0, 1.5, 2.0, 2.5};`。类型必须是 double，元素用大括号包起来。'
          },
          {
            label: '(2)', points: 4, kind: 'keywords',
            prompt: 'What is the value of y, and what is its data type?',
            code: 'int x = 5;\ndouble y = x / 2 + 0.5 * x;',
            keywords: ['4.5', 'double'],
            answer: 'y = 4.5, type double',
            explain: '`x / 2` 是整数除法 = 2；`0.5 * x` = 2.5；两者相加 2 + 2.5 = 4.5，赋给 double。注意不能因为最后是 double 就以为 `x / 2` 得到 2.5——整数除法在**运算时**就截断了。'
          },
          {
            label: '(3)', points: 4, kind: 'keywords',
            prompt: 'Given <code>int[] arr = {4, 8, 15, 16, 23, 42};</code>, write one line of Java code that prints the number of elements in arr.',
            keywords: ['arr.length'],
            answer: 'System.out.println(arr.length);   // prints 6',
            explain: '数组用 length **属性**（不带括号），输出 6。写成 arr.length() 会编译错误，写成 arr.size() 是 ArrayList 的写法。'
          },
          {
            label: '(4)', points: 4, kind: 'keywords',
            prompt: 'Write a while loop that computes the sum 1 + 2 + ... + 100 and stores it in a variable named <code>sum</code>. (Assume <code>int sum = 0;</code> has already been declared.)',
            keywords: ['while', 'sum', '100', ['++', '+= 1', '+=1', 'i = i + 1']],
            answer: 'int i = 1;\nwhile (i <= 100) {\n    sum += i;\n    i++;\n}',
            explain: '循环变量从 1 开始，条件 i <= 100，每轮累加后 i 自增。三个关键点：初始值 1、包含 100（<=）、循环体内自增（否则死循环）。'
          },
          {
            label: '(5)', points: 4, kind: 'keywords',
            prompt: 'Declare and create a two-dimensional <code>char</code> array with 5 rows and 5 columns.',
            keywords: ['char', '[5][5]'],
            answer: 'char[][] grid = new char[5][5];',
            explain: '`char[][] grid = new char[5][5];`：行数在前、列数在后，char 元素默认值是 \'\\u0000\'。'
          }
        ]
      },
      {
        no: 4, points: 5, type: 'write code',
        intro: 'Write a Java for loop that counts how many positive numbers are in an int array called <code>arr</code>. Store the result in an integer variable called <code>count</code> that has been previously declared and initialized to 0.',
        parts: [
          {
            label: '', points: 5, kind: 'keywords',
            prompt: 'Your answer (a for loop):',
            keywords: ['for', '.length', 'count++', '> 0'],
            answer: 'for (int i = 0; i < arr.length; i++) {\n    if (arr[i] > 0) count++;\n}',
            explain: '必须从 0 开始、到 < arr.length（不是 <=，否则越界）；正数的条件是 `> 0` 而不是 `>= 0`（0 不是正数）。增强 for 也接受：`for (int v : arr) if (v > 0) count++;`。'
          }
        ]
      },
      {
        no: 5, points: 9, type: 'fill in the blanks',
        intro: 'Complete the missing parts in each code snippet below. (3 points each)',
        parts: [
          {
            label: '(a)', points: 3, kind: 'fill',
            prompt: 'Fill in the blank to print the last element of the array <code>arr</code>.',
            code: 'System.out.println(arr[__________]);',
            answer: 'arr.length - 1', accept: ['arr.length-1', 'length - 1', 'length-1', 'arr.length -1'],
            explain: '最后一个元素的下标是 length - 1。写 arr.length 会越界（下标范围 0 ~ length-1）。'
          },
          {
            label: '(b)', points: 3, kind: 'fill',
            prompt: 'Fill in the blank so that the loop visits every element of arr from the last one to the first one.',
            code: 'for (int i = arr.length - 1; i ______ 0; i--) {\n    ...\n}',
            answer: '>=', accept: ['>=', '>= 0', '>='],
            explain: '要从最后一个（length-1）一路访问到 0，条件必须是 i >= 0；写成 i > 0 会漏掉下标 0。'
          },
          {
            label: '(c)', points: 3, kind: 'fill',
            prompt: 'Fill in the blank so that the code counts how many elements in arr are divisible by 3.',
            code: 'int count = 0;\nfor (int i = 0; i < arr.length; i++) {\n    if (__________) {\n        count++;\n    }\n}',
            answer: 'arr[i] % 3 == 0', accept: ['arr[i] % 3 == 0', 'arr[i]%3==0', 'arr[i] % 3 == 0 '],
            explain: '“能被 3 整除”即除以 3 的余数为 0：`arr[i] % 3 == 0`。注意是 ==（比较）不是 =（赋值）。'
          }
        ]
      },
      {
        no: 6, points: 30, type: 'read & write output',
        intro: 'Read the following Java code snippets and write down the output for each sub-question.',
        parts: [
          {
            label: '(a)', points: 5, kind: 'output',
            prompt: 'Snippet 1 — What is the output?',
            code:
`static void f(int[] a, int[] b) {
    a[0] = 9;
    b = new int[]{7, 7};
    b[0] = 8;
}
public static void main(String[] args) {
    int[] p = {1, 2};
    int[] q = p;
    f(p, q);
    System.out.println(p[0] + " " + q[0]);
}`,
            answer: '9 9',
            explain: '调用时 p 和 q 都指向同一个数组，传入的 a、b 也是这个数组的引用副本。a[0]=9 改到原数组 → p[0]=9、q[0]=9；`b = new int[]{7,7}` 只让参数 b 改指向新数组，b[0]=8 与原数组无关。所以输出 9 9。'
          },
          {
            label: '(b)', points: 5, kind: 'output',
            prompt: 'Snippet 2 — What is the output?',
            code:
`int i = 0;
do {
    i += 2;
    System.out.print(i + " ");
} while (i < 5);`,
            answer: '2 4 6',
            explain: 'do-while 先执行再判断：i=2 打印 2，2<5 继续；i=4 打印 4，4<5 继续；i=6 打印 6，6<5 为假退出。输出 “2 4 6 ”，判分忽略行尾空格。'
          },
          {
            label: '(c)', points: 10, kind: 'output',
            prompt: 'Snippet 3 — What is the output? (write all 5 lines)',
            code:
`for (int i = 0; i < 5; i++) {
    for (int j = 0; j < 5; j++) {
        if (j <= i) System.out.print("*");
        else System.out.print(".");
    }
    System.out.println();
}`,
            answer: '*....\n**...\n***..\n****.\n*****',
            explain: '每行 5 个字符：当 j <= i 时打印 *，否则打印 .。第 0 行 1 个星、第 1 行 2 个星……第 4 行 5 个星，形成左下三角阶梯图案。五行分别给分。'
          },
          {
            label: '(d)', points: 10, kind: 'output',
            prompt: 'Snippet 4 — What is the output?',
            code:
`int[] arr = {2, 5, 1, 4, 3};
int count = 0;
for (int i = 0; i < arr.length; i++) {
    for (int j = i + 1; j < arr.length; j++) {
        if (arr[i] > arr[j]) count++;
    }
}
System.out.println(count);`,
            answer: '5',
            explain: '统计“前面的数比后面的数大”的数对（逆序对）：(2,1)、(5,1)、(5,4)、(5,3)、(4,3)，共 5 对。逐个 i 列出：i=0: (2,1)；i=1: (5,1)(5,4)(5,3)；i=2: 无；i=3: (4,3)；i=4: 无。'
          }
        ]
      },
      {
        no: 7, points: 10, type: 'find the bugs',
        intro: 'The following two code snippets each contain at least one bug. For each snippet, indicate the bug(s), the line number(s) that need to be fixed, and write the corrected code. (5 points each)',
        parts: [
          {
            label: '(a)', points: 5, kind: 'keywords',
            prompt: 'Snippet 1: the method should return the maximum value in the array a.',
            code:
`public static int max(int[] a) {
    int m = 0;
    for (int i = 0; i < a.length; i++)
        if (a[i] > m) m = a[i];
    return m;
}`,
            keywords: [['line 2', 'lines 2', '第 2 行', '第2行'], 'a[0]', ['m = 0', 'm=0']],
            answer: 'Line 2: `int m = 0;` should be `int m = a[0];` (and start the loop at i = 1).',
            explain: '把初值写成 0 时，如果数组元素全是负数，方法会返回 0 而不是真正的最大值。正确写法是把初值设为 `a[0]`（循环从 1 开始），或用 `int m = Integer.MIN_VALUE;`。'
          },
          {
            label: '(b)', points: 5, kind: 'keywords',
            prompt: 'Snippet 2: the method should print every even number in the array a.',
            code:
`public static void printEven(int[] a) {
    for (int i = 1; i <= a.length; i++) {
        if (a[i] % 2 == 0) System.out.println(a[i]);
    }
}`,
            keywords: [['i = 1', 'i=1', 'starts at 1', '从 1 开始', '从1开始'], ['<=', 'less than or equal', '小于等于'], 'a.length'],
            answer: 'Line 2. The loop starts at i = 1 and uses i <= a.length; both are wrong. Change it to: for (int i = 0; i < a.length; i++). Start at 0 (not 1), and use < a.length (not <=).',
            explain: '这一行有两个 bug：①起点 i = 1 漏掉了 a[0]；②条件 i <= a.length 会在最后一轮访问 a[a.length]，抛 ArrayIndexOutOfBoundsException。改成 `for (int i = 0; i < a.length; i++)`。'
          }
        ]
      }
    ]
  };

  /* ================================================================ M2 卷（Midterm 2） */
  var M2 = {
    id: 'M2',
    title: 'Mock Midterm 2',
    style: '2026 style · ch07–ch10',
    subtitle: 'CUHK(SZ)-计算机科学与 Java 编程导论 Midterm 2 · Objects / Inheritance & Polymorphism / Memory / ADTs & Collections',
    date: 'Nov. 22, 2026',
    minutes: 90,
    totalScore: 100,
    summary: '覆盖 ch07–ch10 的 Midterm 2 模拟卷：8 大题 100 分（选择 20 + 判断 8 + 对象读程序 10 + 继承多态 14 + 内存图 14 + 集合选型 10 + 填空 12 + 找 bug 与值传递 12）。学完 Objects / 继承多态 / 内存 / ADT 后做一次完整限时训练。',
    instructions: [
      'This is a closed-book exam. No notes, calculators, or dictionaries are allowed.',
      'Answer all questions within the time limit of 90 minutes.',
      'All questions are based on Java 17 (or later).',
      'For read-the-program questions, write the exact output; trailing spaces at the end of a line do not matter.',
      'For short-answer questions, the grader checks for the key points; write clearly and concisely.'
    ],
    questions: [
      {
        no: 1, points: 20, type: 'multiple choice',
        intro: 'Circle ONE solution that best suits each question. (4 points each)',
        parts: [
          {
            label: '(1)', points: 4, kind: 'choice',
            prompt: 'What is the output of the following program?',
            code:
`class Counter {
    static int count = 0;
    int id;
    Counter() { id = ++count; }
}
public class Q1 {
    public static void main(String[] args) {
        Counter a = new Counter();
        Counter b = new Counter();
        Counter c = a;
        System.out.println(a.id + " " + b.id + " " + c.id + " " + Counter.count);
    }
}`,
            options: [
              { text: '1 2 1 2', correct: true },
              { text: '1 2 3 2' },
              { text: '1 2 1 3' },
              { text: '1 2 3 3' }
            ],
            explain: '`count` 是 static 字段，全类共享一份，每 new 一个对象构造器就执行一次 `++count`；`id` 是实例字段，每个对象各一份。a、b 各创建一个对象，于是 count = 2、id 分别为 1、2。`Counter c = a;` 只是复制引用，没有 new，所以 c.id 与 a.id 都是 1。最后 `Counter.count` 也是 2。'
          },
          {
            label: '(2)', points: 4, kind: 'choice',
            prompt: 'What is the output of the following program?',
            code:
`class Animal {
    public String toString() { return "animal"; }
}
class Dog extends Animal {
    public String toString() { return "dog"; }
}
public class Q1 {
    public static void main(String[] args) {
        Animal a = new Dog();
        System.out.println(a);
    }
}`,
            options: [
              { text: 'animal' },
              { text: 'dog', correct: true },
              { text: 'null' },
              { text: 'Compile error: Animal does not define toString()' }
            ],
            explain: '`System.out.println(obj)` 会自动调用 `obj.toString()`。变量 a 的**声明类型**是 Animal，但**运行时的对象**是 Dog：方法重写按运行时类型动态派发，所以调用 Dog 的 toString() 输出 dog（编译看左边，运行看右边）。'
          },
          {
            label: '(3)', points: 4, kind: 'choice',
            prompt: 'What is the output of the following program?',
            code:
`public class Q1 {
    public static void main(String[] args) {
        String s1 = new String("hi");
        String s2 = new String("hi");
        System.out.println((s1 == s2) + " " + s1.equals(s2));
    }
}`,
            options: [
              { text: 'true true' },
              { text: 'false true', correct: true },
              { text: 'true false' },
              { text: 'false false' }
            ],
            explain: '`new String("hi")` 每次都在堆上新建一个 String 对象，s1、s2 指向两个不同对象。`==` 比较引用（地址）→ false；`equals` 比较内容，String 重写了 equals → true。'
          },
          {
            label: '(4)', points: 4, kind: 'choice',
            prompt: 'What is the output of the following program?',
            code:
`import java.util.ArrayList;
public class Q1 {
    public static void main(String[] args) {
        ArrayList<String> list = new ArrayList<>();
        list.add("a");
        list.add("b");
        list.add("c");
        list.remove(1);
        System.out.println(list);
    }
}`,
            options: [
              { text: '[a, b, c]' },
              { text: '[a, c]', correct: true },
              { text: '[b, c]' },
              { text: '[a]' }
            ],
            explain: '`remove(1)` 匹配的是 `remove(int index)` 重载：删掉下标 1 的元素 "b"，剩下 [a, c]。`remove(Object)` 才是“删掉这个对象”（如 `list.remove("b")`）。ArrayList 的 toString 输出形如 `[a, c]`。'
          },
          {
            label: '(5)', points: 4, kind: 'choice',
            prompt: 'Which of the following statements about inheritance, abstract classes and interfaces is <b>correct</b>?',
            options: [
              { text: 'A class can extend only one superclass, but it can implement multiple interfaces.', correct: true },
              { text: 'An abstract class cannot declare a constructor.' },
              { text: 'An interface can declare instance fields.' },
              { text: 'If a subclass does not write @Override, its method is not an override.' }
            ],
            explain: 'Java 是单继承、多实现：一个类只能 extends 一个父类，但可以 implements 多个接口。抽象类可以有构造器（只是不能 new，子类会通过 super(...) 调用它）；接口里的字段隐式是 public static final，没有实例字段；@Override 只是让编译器帮你检查签名，不写也照样是重写。四个选项正好覆盖 ch08 的四个易错点。'
          }
        ]
      },
      {
        no: 2, points: 8, type: 'true / false',
        intro: 'For each of the following statements, choose “True (T)” or “False (F)”. (2 points each)',
        parts: [
          {
            label: '(a)', points: 2, kind: 'tf',
            prompt: 'A static method can directly access an instance field of the same class without creating an object.',
            options: [{ text: 'True (T)' }, { text: 'False (F)', correct: true }],
            explain: 'static 方法属于类，没有 this，所以不能直接读写实例字段；它只能访问静态成员，或者先 new 一个对象再用引用访问实例字段。'
          },
          {
            label: '(b)', points: 2, kind: 'tf',
            prompt: 'If a subclass does not define any constructor, the compiler inserts a no-argument constructor that calls super().',
            options: [{ text: 'True (T)', correct: true }, { text: 'False (F)' }],
            explain: '没有写构造器时编译器会补一个无参构造器，它第一条语句是 `super()`。注意：如果父类只定义了带参构造器（没有无参版本），子类又没写构造器，就会编译错误。'
          },
          {
            label: '(c)', points: 2, kind: 'tf',
            prompt: 'With <code>List&lt;String&gt; names = new ArrayList&lt;&gt;();</code>, an object created as an ArrayList can be referenced by a variable of the interface type List.',
            options: [{ text: 'True (T)', correct: true }, { text: 'False (F)' }],
            explain: 'ArrayList 实现了 List 接口，可以把 ArrayList 对象赋给 List 类型的变量（向上转型）。此后只能调用 List 接口里声明的方法，但对象本身仍是 ArrayList。'
          },
          {
            label: '(d)', points: 2, kind: 'tf',
            prompt: 'Java is pass-by-reference for objects: a method receives the actual object, so reassigning its parameter changes the caller variable too.',
            options: [{ text: 'True (T)' }, { text: 'False (F)', correct: true }],
            explain: 'Java 只有值传递。传对象时复制的是**引用**：方法能通过这个引用修改对象内容，但如果让参数改指向新对象，调用者的变量不受影响（参见本卷 Q5、Q8）。'
          }
        ]
      },
      {
        no: 3, points: 10, type: 'read & write output',
        intro: 'Read the following program and answer the questions.',
        code:
`class Book {
    private String title;
    private int pages;
    static int created = 0;
    Book(String t, int p) {
        title = t;
        pages = p;
        created++;
    }
    Book(String t) { this(t, 100); }
    public String toString() { return title + ":" + pages; }
}
public class Q3 {
    public static void main(String[] args) {
        Book[] shelf = new Book[3];
        shelf[0] = new Book("Java", 300);
        shelf[1] = new Book("Algo");
        System.out.println(Book.created);
        System.out.println(shelf[0]);
        System.out.println(shelf[2]);
        System.out.println(shelf[2] == null);
    }
}`,
        parts: [
          {
            label: '(a)', points: 8, kind: 'output',
            prompt: 'What is the output? (write all four lines)',
            answer: '2\nJava:300\nnull\ntrue',
            explain: '① `shelf[0] = new Book("Java", 300)` 创建第 1 个对象，created = 1；② `shelf[1] = new Book("Algo")` 调用单参构造器，它用 `this(t, 100)` 转到双参构造器，pages 得到 100、created = 2；③ 打印 `Book.created` → 2；④ 打印 `shelf[0]` 自动调用 toString → Java:300；⑤ `new Book[3]` 只创建数组，元素默认是 null，所以 `shelf[2]` 打印 null；⑥ `shelf[2] == null` → true。'
          },
          {
            label: '(b)', points: 2, kind: 'fill',
            prompt: 'If the statement <code>shelf[1] = new Book("Algo");</code> is replaced by <code>shelf[1] = shelf[0];</code>, what is the value printed by <code>System.out.println(Book.created);</code>?',
            answer: '1',
            explain: '`shelf[1] = shelf[0];` 只复制引用，不会调用构造器，所以整个程序只创建了 1 个 Book 对象，created = 1。与此同时 shelf[0] 与 shelf[1] 指向同一个对象（别名），改其中一个的字段另一个也会变。'
          }
        ]
      },
      {
        no: 4, points: 14, type: 'read & write output + short answer',
        intro: 'Read the following program and answer the questions.',
        code:
`class Shape {
    protected String name;
    Shape() { this("shape"); }
    Shape(String name) { this.name = name; }
    public double area() { return 0; }
    public String toString() { return name + "(" + area() + ")"; }
}
class Square extends Shape {
    private double side;
    Square(double side) { super("square"); this.side = side; }
    public double area() { return side * side; }
}
class Circle extends Shape {
    private double r;
    Circle(double r) { super("circle"); this.r = r; }
    public double area() { return 3.0 * r * r; }
}
public class Q4 {
    public static void main(String[] args) {
        Shape[] shapes = { new Square(2.0), new Circle(1.0), new Shape() };
        double total = 0;
        for (Shape s : shapes) {
            System.out.println(s);
            total += s.area();
        }
        System.out.println("total = " + total);
    }
}`,
        parts: [
          {
            label: '(a)', points: 10, kind: 'output',
            prompt: 'What is the output? (write all four lines)',
            answer: 'square(4.0)\ncircle(3.0)\nshape(0.0)\ntotal = 7.0',
            explain: '① 对象数组元素向上转型为 Shape；② 增强 for 里 s 的声明类型是 Shape，但 `s.area()` 按运行时类型动态派发：Square 返回 2.0\*2.0 = 4.0、Circle 返回 3.0\*1.0\*1.0 = 3.0、Shape 返回 0；③ println(s) 调用 Shape 的 toString，其中又调用 area()，得到 `square(4.0)` 这类字符串——注意 double 的 toString 保留 `.0`，不是 4；④ total = 4.0 + 3.0 + 0.0 = 7.0。'
          },
          {
            label: '(b)', points: 4, kind: 'keywords',
            prompt: 'The call <code>s.area()</code> inside the for loop: is the method chosen at compile time or at run time? Explain in one or two sentences.',
            keywords: [
              ['runtime', 'run time', 'run-time', '运行时', '运行期'],
              ['dynamic dispatch', 'dynamic', '动态绑定', '动态派发', '动态'],
              ['actual object', 'actual type', 'real object', '真实对象', '实际类型', 'subclass', '子类'],
              ['override', 'overridden', '重写', '改写']
            ],
            answer: 'It is chosen at run time by dynamic dispatch: the actual object decides which overridden area() runs, not the declared type of s.',
            explain: '多态的关键：重写的方法在**运行期**按对象真实类型决定（编译看左边，运行看右边）；重载才是在编译期按参数类型选。这里 s 的声明类型是 Shape，但实际对象可能是 Square 或 Circle，所以各自的 area() 被调用。'
          }
        ]
      },
      {
        no: 5, points: 14, type: 'read & write output + memory diagram',
        intro: 'Read the following program and answer the questions.',
        code:
`class Node {
    int value;
    Node next;
    Node(int value) { this.value = value; }
}
public class Q5 {
    public static void connect(Node[] arr) {
        arr[0].next = arr[1];
        arr[1].next = arr[0];
        arr = new Node[]{ new Node(99) };
    }
    public static void main(String[] args) {
        Node[] nodes = new Node[2];
        nodes[0] = new Node(1);
        nodes[1] = new Node(2);
        Node first = nodes[0];
        connect(nodes);
        System.out.println(first.value);
        System.out.println(first.next.value);
        System.out.println(nodes[1].next == nodes[0]);
        System.out.println(nodes.length);
        nodes = new Node[3];
        System.out.println(nodes[1] == null);
    }
}`,
        parts: [
          {
            label: '(a)', points: 8, kind: 'output',
            prompt: 'What is the output? (write all five lines)',
            answer: '1\n2\ntrue\n2\ntrue',
            explain: '① `new Node[2]` 只创建数组，两个位置先都是 null，随后分别 new 出 value 为 1、2 的两个 Node；② first = nodes[0] 是引用副本，指向 Node 1；③ connect 里 `arr[0].next = arr[1]; arr[1].next = arr[0];` 把两个对象互相连起来；`arr = new Node[]{...}` 只让形参 arr 改指向新数组，**不影响**调用者的 nodes；④ first.value → 1；first.next 是 Node 2 → 2；nodes[1].next 是 Node 1，`== nodes[0]` → true；⑤ nodes.length → 2；⑥ `nodes = new Node[3]` 让 nodes 指向新数组，元素默认 null → true。'
          },
          {
            label: '(b)', points: 6, kind: 'keywords',
            prompt: 'Draw the memory diagram at the end of <code>main</code> (after the last println). In words, state: (i) which stack variables exist; (ii) which heap objects are still reachable and through which references; (iii) which objects have become garbage.',
            keywords: [
              ['stack', '栈'],
              ['first', 'nodes'],
              ['next'],
              ['unreachable', 'garbage', '不可达', '垃圾', 'no reference', '没有任何引用'],
              ['parameter', '形参', 'copy', '副本', 'pass-by-value', '值传递'],
              ['array', '数组']
            ],
            answer: 'Stack: args, nodes (→ the new Node[3] array), first (→ Node 1). Reachable heap: the Node[3] array, Node 1 (via first), Node 2 (via first.next / Node 1.next), and the two nodes point at each other. The original Node[2] array, the temporary array created inside connect, and the Node(99) object are unreachable garbage. Reassigning the parameter arr never changes the caller variable nodes (Java is pass-by-value).',
            explain: '内存图三要素：栈帧里的变量、堆里的对象/数组、引用箭头。connect 里 `arr = new Node[]{...}` 改的是**形参副本**，所以调用者的 nodes 仍指向原来的 Node[2]；而通过 arr[0]、arr[1] 改的是对象内部字段，所以 next 箭头留了下来。最后 `nodes = new Node[3]` 又让 nodes 改指向新数组，原来的 Node[2] 数组不再被任何栈变量引用（但其中两个 Node 对象仍通过 first 可达，不是垃圾）。'
          }
        ]
      },
      {
        no: 6, points: 10, type: 'short answer',
        intro: 'For each scenario below, choose the most suitable collection and briefly justify your choice. Choose from <code>ArrayList</code>, <code>LinkedList</code>, <code>HashSet</code>, <code>HashMap</code>. Your justification must mention the key operation(s) and the average cost. (3 + 3 + 4 points)',
        parts: [
          {
            label: '(a)', points: 3, kind: 'keywords',
            prompt: 'You keep 10,000 student records in insertion order. The program repeatedly reads the record at a given index, appends new records at the end, and almost never inserts in the middle.',
            keywords: [['ArrayList'], ['index', 'indexed', 'random access', '下标', '随机访问'], ['O(1)']],
            answer: 'ArrayList — indexed access (get) is O(1) and appending at the end is amortized O(1); LinkedList would need O(n) to walk to an index.',
            explain: 'ArrayList 底层是数组，按下标访问 O(1)、尾部追加摊还 O(1)；LinkedList 虽然尾部追加也快，但按下标访问要逐个走 O(n)，所以“频繁按下标读”选 ArrayList。'
          },
          {
            label: '(b)', points: 3, kind: 'keywords',
            prompt: 'You need to store a collection of unique student IDs (no duplicates) and frequently test whether a given ID has been seen. The order does not matter.',
            keywords: [['HashSet'], ['unique', 'duplicate', '不重复', '重复', '去重'], ['O(1)']],
            answer: 'HashSet — it stores unique elements and contains() is average O(1).',
            explain: 'HashSet 靠 hashCode/equals 去重，`contains` 平均 O(1)。若用 ArrayList，虽然也能用 contains 判重，但那是 O(n)；题目只关心“在不在”，不关心顺序，所以选 Set 家族。'
          },
          {
            label: '(c)', points: 4, kind: 'keywords',
            prompt: 'You read a text file and need to count how many times each word appears.',
            keywords: [['HashMap'], ['word', '单词', 'key', '键'], ['count', '计数', 'value', '值'], ['O(1)', 'average', '平均']],
            answer: 'HashMap — map each word (key) to its count (value); put/get are average O(1), so counting is O(n) for n words.',
            explain: '“单词 → 次数”是典型的键值对：键唯一、值可累加。HashMap 的 put/get 平均 O(1)，遍历一遍文本即可完成计数。若要求按单词排序输出，可以在计数完成后把 key 取出来排序（计数仍用 HashMap）。'
          }
        ]
      },
      {
        no: 7, points: 12, type: 'fill in the blanks',
        intro: 'Fill in each blank with the missing Java code. (3 points each)',
        parts: [
          {
            label: '(a)', points: 3, kind: 'fill',
            prompt: 'The keyword that hides the field <code>balance</code> from code outside the class is __________.',
            code:
`public class Account {
    __________ int balance;
    public int getBalance() { return balance; }
    public void deposit(int amount) {
        if (amount <= 0) throw new IllegalArgumentException("amount must be positive");
        balance += amount;
    }
}`,
            answer: 'private', accept: ['private'],
            explain: '封装 = private 字段 + public getter/setter，把校验集中到方法里，保证对象始终合法。注意构造器、方法可以用别的访问修饰符，但“隐藏字段”用的是 private。'
          },
          {
            label: '(b)', points: 3, kind: 'fill',
            prompt: 'Complete the constructor so that the shared counter is incremented before the id is assigned.',
            code:
`class Student {
    private static int total = 0;
    private int id;
    Student() {
        __________;   // increment the shared counter
        id = total;
    }
}`,
            answer: 'total++', accept: ['++total', 'total += 1', 'total +=1', 'total = total + 1', 'total=total+1'],
            explain: 'total 是 static 字段、全类共享一份。第一个对象构造时 total 变 1、id = 1，第二个对象 total 变 2、id = 2……注意写成 total++ 或 ++total 在这条语句里效果相同（都没有被别的表达式使用）。'
          },
          {
            label: '(c)', points: 3, kind: 'fill',
            prompt: 'Complete the loop so that every element is a new Point whose x is i and y is 0. (Point has a constructor Point(int x, int y).)',
            code:
`Point[] pts = new Point[3];
for (int i = 0; i < pts.length; i++) {
    pts[i] = __________;
}`,
            answer: 'new Point(i, 0)', accept: ['new Point(i,0)', 'new Point(i, 0)', 'new Point(i,0);'],
            explain: '`new Point[3]` 只创建数组，三个元素默认都是 null（对象数组存的是引用）；必须在循环里逐个 new，否则访问 `pts[i].x` 会抛 NullPointerException。'
          },
          {
            label: '(d)', points: 3, kind: 'fill',
            prompt: 'Complete the declaration so that the code compiles and can later be assigned an ArrayList.',
            code:
`List<String> names = new __________<String>();
names.add("Amy");
names.add("Bob");`,
            answer: 'ArrayList', accept: ['ArrayList', 'arraylist'],
            explain: 'List 是接口，不能 `new List<>()`；ArrayList 实现了 List。把声明类型写成接口 List，后面若换成 LinkedList 只需改 new 的那一处，使用代码不用动。'
          }
        ]
      },
      {
        no: 8, points: 12, type: 'find the bug + read & write output',
        intro: 'Answer the questions about the two programs below.',
        parts: [
          {
            label: '(a)', points: 6, kind: 'keywords',
            prompt: 'The programmer wants <code>b</code> to be an independent copy of <code>a</code>, but changing <code>b.data[0]</code> also changes <code>a.data[0]</code>. Point out the problematic line and write the corrected statement(s).',
            code:
`class Box {
    int[] data;
    Box(int[] data) { this.data = data; }
}
public class Q8 {
    public static void main(String[] args) {
        Box a = new Box(new int[]{1, 2, 3});
        Box b = new Box(a.data);
        b.data[0] = 99;
        System.out.println(a.data[0]);
    }
}`,
            keywords: [
              ['line 3', '第 3 行', '第3行', 'line 8', '第 8 行', '第8行', 'constructor', '构造器'],
              ['Arrays.copyOf', 'copyOf', 'System.arraycopy', 'clone', 'new int[]'],
              ['copy', '复制', '副本', '深拷贝', 'deep copy'],
              ['same array', '同一个数组', 'shared', '共享', 'shallow', '浅拷贝'],
              ['this.data', 'data ='],
              ['independent', '独立']
            ],
            answer: 'Line 3: the constructor stores the caller reference, so a and b share the same array (a shallow copy); they are not independent. Change it to `this.data = Arrays.copyOf(data, data.length);` (or copy at line 8: `new Box(Arrays.copyOf(a.data, a.data.length))`).',
            explain: '`Box b = new Box(a.data);` 传的是数组引用，构造器又把它直接存进字段，于是 a.data 与 b.data 指向**同一个数组**（浅拷贝/别名），改 b 就改到 a。正确做法是复制数组内容：`this.data = Arrays.copyOf(data, data.length);` 或 `System.arraycopy`。这就是 ch09 的“浅拷贝 vs 深拷贝”。'
          },
          {
            label: '(b)', points: 6, kind: 'output',
            prompt: 'What is the output of the following program?',
            code:
`class Counter {
    int n = 0;
}
public class Q8 {
    static void add(Counter c, int times) {
        for (int i = 0; i < times; i++) c.n++;
        c = new Counter();
        c.n = 100;
    }
    public static void main(String[] args) {
        Counter c = new Counter();
        add(c, 3);
        System.out.println(c.n);
    }
}`,
            answer: '3',
            explain: '`c.n++` 通过引用修改的是调用者那个对象的字段，执行 3 次后 n = 3；随后 `c = new Counter(); c.n = 100;` 只让**形参**改指向新对象，调用者的 c 仍指向原来的对象（Java 只有值传递）。所以输出 3，不是 100。'
          }
        ]
      }
    ]
  };

  /* ================================================================ F 卷（Final） */
  var F = {
    id: 'F',
    title: 'Mock Final',
    style: '2026 style · ch11–ch13',
    subtitle: 'CUHK(SZ)-计算机科学与 Java 编程导论 Final Exam · Algorithms / Recursion / Performance + comprehensive questions',
    date: 'Dec. 20, 2026',
    minutes: 120,
    totalScore: 100,
    summary: '覆盖 ch11–ch13 并横跨全书的 Final 模拟卷：9 大题 100 分（选择 20 + 判断 8 + 排序追踪 10 + 排序/查找补全 12 + 递归编程 10 + 递归读程序 10 + 复杂度分析 10 + 二分查找 10 + 找 bug 10）。',
    instructions: [
      'This is a closed-book exam. No notes, calculators, or dictionaries are allowed.',
      'Answer all questions within the time limit of 120 minutes.',
      'All questions are based on Java 17 (or later).',
      'For read-the-program questions, write the exact output; trailing spaces at the end of a line do not matter.',
      'For short-answer and find-bug questions, the grader checks for the key points; write clearly and concisely.'
    ],
    questions: [
      {
        no: 1, points: 20, type: 'multiple choice',
        intro: 'Circle ONE solution that best suits each question. (4 points each)',
        parts: [
          {
            label: '(1)', points: 4, kind: 'choice',
            prompt: 'Which of the following statements about sorting algorithms is <b>correct</b>?',
            options: [
              { text: 'Selection sort is stable because it only moves the minimum element to the front.' },
              { text: 'Insertion sort is stable if the inner loop shifts elements only while <code>a[j] &gt; key</code> (strict comparison).', correct: true },
              { text: 'Merge sort is unstable because it compares elements from two halves.' },
              { text: 'Quick sort is stable in the average case.' }
            ],
            explain: '插入排序里只有 `a[j] > key`（严格大于）才后移，等于 key 的元素不会被跨过，相对顺序不变 → 稳定。选择排序每次把最小值交换到前面，交换可能跨过相等元素 → 不稳定；归并排序的合并用 `<=` 取左半边 → 稳定；快速排序的分区交换会打乱相等元素 → 不稳定（且最坏 O(n²)）。'
          },
          {
            label: '(2)', points: 4, kind: 'choice',
            prompt: 'For a sorted array of length 1000, what is the maximum number of iterations of a binary search loop that keeps <code>lo &lt;= hi</code>?',
            options: [
              { text: '10', correct: true },
              { text: '32' },
              { text: '500' },
              { text: '1000' }
            ],
            explain: '每轮区间长度减半：1000 → 500 → 250 → … → 1，最多 ⌊log₂1000⌋ + 1 = 9 + 1 = 10 轮。严格核对：对 n = 1000 的数组、所有目标（含不存在的目标）实测最大循环次数就是 10（本卷 Q8 有同型代码）。'
          },
          {
            label: '(3)', points: 4, kind: 'choice',
            prompt: 'What is the output of the following program?',
            code:
`public class Q1 {
    static void g(int n) {
        if (n == 0) return;
        System.out.print(n + " ");
        g(n - 1);
        System.out.print(n + " ");
    }
    public static void main(String[] args) {
        g(3);
    }
}`,
            options: [
              { text: '1 2 3' },
              { text: '3 2 1' },
              { text: '3 2 1 1 2 3', correct: true },
              { text: '1 2 3 3 2 1' }
            ],
            explain: '递归调用之前的 print 是“去程”顺序 3 2 1；递归调用返回之后每个栈帧再执行一次 print，是“回程”顺序 1 2 3。拼起来就是 3 2 1 1 2 3（行尾空格判分时忽略）。'
          },
          {
            label: '(4)', points: 4, kind: 'choice',
            prompt: 'What is the time complexity of the following code?',
            code:
`int sum = 0;
for (int i = 0; i < n; i++)
    for (int j = i; j < n; j++)
        sum++;`,
            options: [
              { text: 'O(log n)' },
              { text: 'O(n)' },
              { text: 'O(n log n)' },
              { text: 'O(n²)', correct: true }
            ],
            explain: '内层 j 从 i 走到 n-1，执行次数 n + (n-1) + … + 1 = n(n+1)/2；化简时去系数、丢低阶，只留最高阶 → O(n²)。'
          },
          {
            label: '(5)', points: 4, kind: 'choice',
            prompt: 'Which of the following statements about Java collections is <b>correct</b>?',
            options: [
              { text: 'Calling put twice with the same key on a HashMap stores both values and makes the size 2.' },
              { text: 'A HashMap stores key-value pairs; calling put with an existing key replaces the old value.', correct: true },
              { text: 'A HashSet allows duplicate elements.' },
              { text: 'LinkedList.get(i) is O(1) because LinkedList is a list.' }
            ],
            explain: 'HashMap 的 put 遇到相同 key 会覆盖旧 value，size 不变（实测 size = 1、get 返回新值）；HashSet 用 hashCode/equals 去重，不允许重复；LinkedList 按下标访问要顺着链逐个走，是 O(n)，所以频繁随机访问要选 ArrayList。'
          }
        ]
      },
      {
        no: 2, points: 8, type: 'true / false',
        intro: 'For each of the following statements, choose “True (T)” or “False (F)”. (2 points each)',
        parts: [
          {
            label: '(a)', points: 2, kind: 'tf',
            prompt: 'Merge sort runs in O(n log n) in the worst case but needs O(n) extra space.',
            options: [{ text: 'True (T)', correct: true }, { text: 'False (F)' }],
            explain: '归并排序每层合并 O(n)、共 log n 层 → O(n log n)（最好、最坏、平均都一样）；合并时需要长度为 n 的辅助数组 → O(n) 额外空间。'
          },
          {
            label: '(b)', points: 2, kind: 'tf',
            prompt: 'Quick sort always runs in O(n log n) regardless of the input.',
            options: [{ text: 'True (T)' }, { text: 'False (F)', correct: true }],
            explain: '快排的平均是 O(n log n)，但如果每次选的基准都恰好是最小/最大值（例如对已排序数组固定取最后一个元素），区间划分极不均衡，最坏退化到 O(n²)。'
          },
          {
            label: '(c)', points: 2, kind: 'tf',
            prompt: 'Binary search can be applied to an unsorted array, as long as we search for the maximum value.',
            options: [{ text: 'True (T)' }, { text: 'False (F)', correct: true }],
            explain: '二分查找的前提是**有序**：它靠“a[mid] 比 target 小/大”来决定丢哪一半，无序时这个判断没有意义。找最大值只能线性扫描 O(n)。'
          },
          {
            label: '(d)', points: 2, kind: 'tf',
            prompt: 'Every recursive method must contain at least one base case that can be reached; otherwise the recursion cannot stop by itself.',
            options: [{ text: 'True (T)', correct: true }, { text: 'False (F)' }],
            explain: '递归三要素：基线条件、递归步骤、每次逼近。缺了可达的基线条件（或递归参数没有逼近基线），调用会无限压栈，最终抛 StackOverflowError。'
          }
        ]
      },
      {
        no: 3, points: 10, type: 'read & write output',
        intro: 'The following program uses insertion sort. Read it and answer the questions.',
        code:
`import java.util.Arrays;
public class Q3 {
    static void sort(int[] a) {
        for (int i = 1; i < a.length; i++) {
            int key = a[i];
            int j = i - 1;
            while (j >= 0 && a[j] > key) {
                a[j + 1] = a[j];
                j--;
            }
            a[j + 1] = key;
        }
    }
    public static void main(String[] args) {
        int[] a = {5, 2, 4, 6, 1, 3};
        sort(a);
        System.out.println(Arrays.toString(a));
    }
}`,
        parts: [
          {
            label: '(a)', points: 4, kind: 'output',
            prompt: 'What is the output of the program?',
            answer: '[1, 2, 3, 4, 5, 6]', accept: ['1 2 3 4 5 6', '[1,2,3,4,5,6]'],
            explain: '插入排序把 {5, 2, 4, 6, 1, 3} 逐步理成有序：{2,5,4,6,1,3} → {2,4,5,6,1,3} → {1,2,4,5,6,3} → {1,2,3,4,5,6}。`Arrays.toString` 的输出带方括号和逗号空格。'
          },
          {
            label: '(b)', points: 3, kind: 'fill',
            prompt: 'What is the state of the array <code>a</code> right after the iteration with <code>i = 3</code> finishes inside <code>sort</code>? (Write the elements from index 0 to 5.)',
            answer: '2 4 5 6 1 3', accept: ['[2, 4, 5, 6, 1, 3]', '2, 4, 5, 6, 1, 3', '2 4 5 6 1 3'],
            explain: 'i=1：key=2，插到 5 前面 → [2, 5, 4, 6, 1, 3]；i=2：key=4，插到 5 前面 → [2, 4, 5, 6, 1, 3]；i=3：key=6，比前一个 5 大，不动 → 仍是 [2, 4, 5, 6, 1, 3]（JDK 实测）。'
          },
          {
            label: '(c)', points: 3, kind: 'keywords',
            prompt: 'Is this insertion sort <i>stable</i>? Justify your answer by referring to the comparison in the while condition.',
            keywords: [
              ['stable', '稳定'],
              ['>', 'strict', 'strictly', '严格大于', '大于'],
              ['equal', '相等', '相同', 'relative order', '相对顺序', '保持']
            ],
            answer: 'Yes, it is stable: the loop shifts elements only while a[j] > key (strictly greater), so elements equal to key are never moved past it and keep their relative order.',
            explain: '稳定性看相等元素会不会被交换位置。这里 while 条件是 `a[j] > key`（严格大于），遇到等于 key 的元素就停止后移，新的 key 插在它后面 → 相等元素保持原来的先后顺序，所以稳定。若改成 `a[j] >= key` 就会不稳定。'
          }
        ]
      },
      {
        no: 4, points: 12, type: 'fill in the blanks',
        intro: 'Complete the missing parts in the following code fragments. (3 points each)',
        parts: [
          {
            label: '(a)', points: 3, kind: 'fill',
            prompt: 'Selection sort: the inner loop must scan the unsorted part only.',
            code:
`for (int i = 0; i < a.length - 1; i++) {
    int min = i;
    for (int j = __________; j < a.length; j++) {
        if (a[j] < a[min]) min = j;
    }
    int t = a[i]; a[i] = a[min]; a[min] = t;
}`,
            answer: 'i + 1', accept: ['i+1', 'i + 1'],
            explain: '第 i 轮开始时 a[0..i-1] 已经有序，新区间第一个元素是 a[i] 本身，所以内层从 i + 1 开始找更小的。写 i 会把自己和自己比（不影响结果），写 0 会把已排好的元素也扫进来。'
          },
          {
            label: '(b)', points: 3, kind: 'fill',
            prompt: 'Merge step: copy the remaining smaller element from the right half.',
            code:
`while (i <= mid && j <= hi) {
    if (a[i] <= a[j]) aux[k++] = a[i++];
    else aux[k++] = __________;
}`,
            answer: 'a[j++]', accept: ['a[j++]', 'a[j ++]', 'a[j]; j++;'],
            explain: '当右半边当前元素更小时，把它放进 aux，并让 j 后移：`a[j++]` 等价于 `aux[k++] = a[j]; j++;`。注意 `a[i] <= a[j]` 取左边，正是归并排序稳定的原因；忘了 j++ 会重复拷贝同一个元素。'
          },
          {
            label: '(c)', points: 3, kind: 'fill',
            prompt: 'Binary search: keep the half that can still contain the target.',
            code:
`while (lo <= hi) {
    int mid = (lo + hi) / 2;
    if (a[mid] == target) return mid;
    if (a[mid] < target) lo = __________;
    else hi = mid - 1;
}
return -1;`,
            answer: 'mid + 1', accept: ['mid+1', 'mid + 1'],
            explain: 'a[mid] 已经比较过且不等于 target，并且 a[mid] < target，说明目标只可能在右半边，于是 lo = mid + 1。写 lo = mid 会死循环（区间不再缩小）。'
          },
          {
            label: '(d)', points: 3, kind: 'fill',
            prompt: 'Quick sort partition: after swapping, advance the boundary of the "smaller than pivot" region.',
            code:
`int pivot = a[hi];
int i = lo;
for (int j = lo; j < hi; j++) {
    if (a[j] < pivot) {
        int t = a[i]; a[i] = a[j]; a[j] = t;
        __________;
    }
}
int t = a[i]; a[i] = a[hi]; a[hi] = t;
return i;`,
            answer: 'i++', accept: ['i++', 'i += 1', 'i = i + 1', '++i'],
            explain: 'i 是“小于 pivot 区域的下一个空位”。每次把一个更小的元素交换到 i 处后，i 要后移一格，这样循环结束时 a[lo..i-1] 都小于 pivot，a[i] 与 pivot 交换就完成分区。（++i 与 i++ 在这条语句里效果相同。）'
          }
        ]
      },
      {
        no: 5, points: 10, type: 'write recursive methods',
        intro: 'Write the following methods <b>recursively</b>. You are graded on the key points: a correct base case, a correct recursive call, and progress toward the base case. (5 points each)',
        parts: [
          {
            label: '(a)', points: 5, kind: 'keywords',
            prompt: 'Write a recursive method <code>int sumDigits(int n)</code> that returns the sum of the decimal digits of a non-negative integer n. Example: <code>sumDigits(1729)</code> returns 19.',
            keywords: [
              ['n == 0', 'n==0', 'n <= 0', 'n<=0', 'base case', '基线'],
              ['% 10', '%10'],
              ['/ 10', '/10'],
              ['sumDigits'],
              ['return']
            ],
            answer: 'static int sumDigits(int n) {\n    if (n == 0) return 0;\n    return n % 10 + sumDigits(n / 10);\n}',
            explain: '基线：n == 0 时返回 0；递归：最低位是 n % 10，其余位交给 sumDigits(n / 10)；每次 n / 10 都变小，保证逼近基线。例：sumDigits(1729) = 9 + sumDigits(172) = 9 + 2 + sumDigits(17) = … = 19（JDK 实测）。'
          },
          {
            label: '(b)', points: 5, kind: 'keywords',
            prompt: 'Write a recursive method <code>String reverse(String s)</code> that returns the reversed string. Example: <code>reverse("计算机科学与 Java 编程导论")</code> returns "3001CSC". You may use <code>length()</code>, <code>charAt()</code> and <code>substring()</code>.',
            keywords: [
              ['length() <= 1', 'length()==1', 'length() == 0', 'length() <= 1', 'base case', '基线'],
              ['substring'],
              ['charAt'],
              ['reverse'],
              ['+', 'concat']
            ],
            answer: 'static String reverse(String s) {\n    if (s.length() <= 1) return s;\n    return reverse(s.substring(1)) + s.charAt(0);\n}',
            explain: '基线：长度 0 或 1 的字符串反转后还是自己；递归：先反转除首字符外的后缀，再把首字符拼到末尾。substring(1) 每次少一个字符，保证逼近基线。例：reverse("计算机科学与 Java 编程导论") → "3001CSC"（JDK 实测）。'
          }
        ]
      },
      {
        no: 6, points: 10, type: 'read & write output + short answer',
        intro: 'Read the following program and answer the questions.',
        code:
`public class Q6 {
    static int calls = 0;
    static int fib(int n) {
        if (n <= 1) return n;
        return fib(n - 1) + fib(n - 2);
    }
    static void hanoi(int n, char from, char to, char via) {
        if (n == 0) return;
        hanoi(n - 1, from, via, to);
        System.out.println("move " + n + " " + from + "->" + to);
        hanoi(n - 1, via, to, from);
    }
    static int f(int n) {
        calls++;
        if (n <= 1) return 1;
        return f(n - 1) + f(n - 2);
    }
    public static void main(String[] args) {
        System.out.println(fib(5));
        hanoi(2, 'A', 'C', 'B');
        f(4);
        System.out.println(calls);
    }
}`,
        parts: [
          {
            label: '(a)', points: 6, kind: 'output',
            prompt: 'What is the output? (write all five lines)',
            answer: '5\nmove 1 A->B\nmove 2 A->C\nmove 1 B->C\n9',
            explain: '① fib(5) = 5；② 汉诺塔 2 层从 A 到 C（借助 B）：先把 1 号从 A 挪到 B，再把 2 号从 A 挪到 C，最后把 1 号从 B 挪到 C；③ f(4) 每调用一次 calls++：f(4) 调用 f(3)、f(2)；f(3) 调用 f(2)、f(1)；两个 f(2) 各调用 f(1)、f(0)……数下来一共 1 + 2 + 4 + 2 = 9 次（递归树节点数，JDK 实测）。'
          },
          {
            label: '(b)', points: 4, kind: 'keywords',
            prompt: 'The naive <code>fib(n)</code> used above is exponential. Explain why, and state how memoization improves it.',
            keywords: [
              ['exponential', '指数', '1.6', '2^n', 'fib'],
              ['same subproblem', 'repeated', 'repeat', '重复', 'overlap', '重叠', '多次计算'],
              ['memoization', 'memo', 'cache', '记忆化', '缓存'],
              ['O(n)', 'linear', '线性']
            ],
            answer: 'The recursion tree recomputes the same subproblems (fib(k) for the same k) exponentially many times, so T(n) grows like 1.6^n. Memoization stores each computed fib(k) in an array, so every subproblem is solved once: time O(n), space O(n).',
            explain: '朴素 fib 的递归树里 fib(k) 被反复计算：T(n) = T(n-1) + T(n-2) + O(1)，按 ≈1.618ⁿ 增长。记忆化（自顶向下加缓存）或自底向上填表，让每个 k 只算一次，时间降到 O(n)（空间 O(n)）。'
          }
        ]
      },
      {
        no: 7, points: 10, type: 'complexity analysis',
        intro: 'Answer the following questions about complexity analysis.',
        parts: [
          {
            label: '(a)', points: 2, kind: 'fill',
            prompt: 'Simplify <code>T(n) = 3n² + 10n + 7</code> to Big-O notation: O(__________).',
            answer: 'O(n^2)', accept: ['O(n²)', 'n^2', 'n²', 'O(n2)', 'n2'],
            explain: 'Big-O 只看最高阶、去掉系数：3n² 是主导项，10n 与 7 在 n 很大时都可以忽略，所以是 O(n²)。'
          },
          {
            label: '(b)', points: 3, kind: 'fill',
            prompt: 'What is the time complexity of the following loop nest? (n is the input size)',
            code:
`int count = 0;
for (int i = 1; i <= n; i *= 2)
    for (int j = 0; j < n; j++)
        count++;`,
            answer: 'O(n log n)', accept: ['O(nlogn)', 'n log n', 'nlogn', 'O(n log n)', 'O(nlog n)', 'O(n log(n))', 'O(n*logn)'],
            explain: '外层 i 每次乘 2：1, 2, 4, … ≤ n，共 ⌊log₂n⌋ + 1 次；内层固定 n 次。嵌套相乘 → O(n log n)。'
          },
          {
            label: '(c)', points: 2, kind: 'fill',
            prompt: 'The measurements below come from the same program on the same machine. What is the most likely order of growth?',
            code:
`n       running time
1000    2 ms
2000    8 ms
4000    32 ms`,
            answer: 'O(n^2)', accept: ['O(n²)', 'n^2', 'n²', 'quadratic', '二次'],
            explain: 'n 每翻一倍，耗时变成 4 倍（2 → 8 → 32）。倍增法判据：比值 2 → O(n)、比值 4 → O(n²)、比值约 2.2 → O(n log n)。这里比值是 4，所以最可能是 O(n²)。'
          },
          {
            label: '(d)', points: 3, kind: 'keywords',
            prompt: 'Give the extra space complexity of selection sort, and briefly explain why it does not need an auxiliary array like merge sort.',
            keywords: [
              ['O(1)', 'constant', '常数'],
              ['in-place', 'in place', '原地', 'auxiliary', '辅助', 'extra array', '额外'],
              ['swap', '交换', 'index', '下标', 'variable', '变量']
            ],
            answer: 'O(1) extra space: selection sort sorts in place by swapping elements and only keeps a few index / temporary variables; it never allocates an auxiliary array.',
            explain: '选择排序只要存 min、i、j、t 几个变量，交换在数组内部完成 → 额外空间 O(1)。归并排序合并时要把结果放进长度为 n 的辅助数组，所以是 O(n) 额外空间。'
          }
        ]
      },
      {
        no: 8, points: 10, type: 'read & write output',
        intro: 'Read the following program and answer the questions.',
        code:
`public class Q8 {
    static int search(int[] a, int target) {
        int lo = 0, hi = a.length - 1, count = 0;
        while (lo <= hi) {
            count++;
            int mid = lo + (hi - lo) / 2;
            if (a[mid] == target) return count * 100 + mid;
            if (a[mid] < target) lo = mid + 1;
            else hi = mid - 1;
        }
        return -count;
    }
    public static void main(String[] args) {
        int[] a = {1, 3, 5, 7, 9, 11, 13};
        System.out.println(search(a, 11));
        System.out.println(search(a, 1));
        System.out.println(search(a, 8));
    }
}`,
        parts: [
          {
            label: '(a)', points: 7, kind: 'output',
            prompt: 'What is the output? (write all three lines)',
            answer: '205\n300\n-3',
            explain: '数组下标 0..6。① search(11)：mid=3 → a[3]=7 &lt; 11 → lo=4；mid=5 → a[5]=11，第 2 轮找到 → 2\*100+5 = 205。② search(1)：mid=3 → 7 &gt; 1 → hi=2；mid=1 → 3 &gt; 1 → hi=0；mid=0 → a[0]=1，第 3 轮找到 → 3\*100+0 = 300。③ search(8)：mid=3 → 7 &lt; 8 → lo=4；mid=5 → 11 &gt; 8 → hi=4；mid=4 → 9 &gt; 8 → hi=3，此时 lo=4 &gt; hi=3 退出 → 返回 -3。'
          },
          {
            label: '(b)', points: 3, kind: 'fill',
            prompt: 'For a sorted array of length 1000, what is the maximum number of iterations of the while loop in the same kind of binary search?',
            answer: '10', accept: ['10', '10 次', '10次'],
            explain: '区间每轮减半：1000 → 500 → 250 → … → 1，最多 ⌊log₂1000⌋ + 1 = 10 轮；对全部目标（含不存在的目标）实测最大也是 10（本卷 Q1(2) 的同型结论）。'
          }
        ]
      },
      {
        no: 9, points: 10, type: 'find the bugs',
        intro: 'Each of the following code fragments contains exactly one bug. For each fragment, point out the line number and write the corrected line. (5 points each)',
        parts: [
          {
            label: '(a)', points: 5, kind: 'keywords',
            prompt: 'The method should return the index of <code>target</code> in the sorted array, or -1 if it is absent.',
            code:
`public class Q9a {
    public static int search(int[] a, int target) {
        int lo = 0, hi = a.length;
        while (lo <= hi) {
            int mid = (lo + hi) / 2;
            if (a[mid] == target) return mid;
            if (a[mid] < target) lo = mid + 1;
            else hi = mid - 1;
        }
        return -1;
    }
}`,
            keywords: [
              ['line 3', '第 3 行', '第3行'],
              ['a.length - 1', 'a.length-1', 'length - 1', 'length-1'],
              ['out of bounds', '越界', 'ArrayIndexOutOfBoundsException', 'exception', '异常'],
              ['lo + (hi - lo) / 2', 'lo+(hi-lo)/2', 'overflow', '溢出']
            ],
            answer: 'Line 3. Change `int lo = 0, hi = a.length;` to `int lo = 0, hi = a.length - 1;`. Otherwise mid can become a.length and a[mid] throws ArrayIndexOutOfBoundsException. Also prefer `int mid = lo + (hi - lo) / 2` to avoid overflow.',
            explain: '有效下标是 0..a.length-1，hi 却初始化成 a.length，区间越界。例如 a = {1,3,5,7,9}, target = 10：lo=0, hi=5 → mid=2 → lo=3 → mid=4 → lo=5 → mid=5 → a[5] 越界（JDK 实测抛 ArrayIndexOutOfBoundsException: Index 5 out of bounds for length 5）。改成 a.length - 1 即可。另外 `(lo + hi) / 2` 在 lo、hi 都很大时可能 int 溢出，写成 `lo + (hi - lo) / 2` 更稳。'
          },
          {
            label: '(b)', points: 5, kind: 'keywords',
            prompt: 'The method should return the sum of <code>a[i] + a[i+1] + ... + a[a.length-1]</code>.',
            code:
`public class Q9b {
    public static int sum(int[] a, int i) {
        if (i == a.length) return 0;
        return a[i] + sum(a, i);
    }
}`,
            keywords: [
              ['line 4', '第 4 行', '第4行'],
              ['i + 1', 'i+1'],
              ['StackOverflowError', 'StackOverflow', 'stack overflow', '栈溢出'],
              ['infinite recursion', 'infinite', '无限递归', '死递归', 'never stops'],
              ['base case', '基线', 'reach', '到达'],
              ['sum(a, i + 1)', 'sum(a,i+1)', 'sum(a, i+1)']
            ],
            answer: 'Line 4. Change `return a[i] + sum(a, i);` to `return a[i] + sum(a, i + 1);`. Without `i + 1` the recursive call never reaches the base case; it causes infinite recursion that never stops, so the program ends with StackOverflowError.',
            explain: '递归三要素缺了“每次逼近”：i 始终不变，永远到不了 `i == a.length` 的基线，于是无限压栈，JVM 抛 StackOverflowError（JDK 实测）。改成 `sum(a, i + 1)` 后每层下标前进一格，到 a.length 时基线返回 0，结果正确。'
          }
        ]
      }
    ]
  };

  /* 桥接：数据先于引擎加载，引擎从 CSC._exams 读取 */
  var G = (typeof globalThis !== 'undefined') ? globalThis
        : (typeof window !== 'undefined') ? window : this;
  var C = G && G.CSC;
  var LIST = [A, B, M2, F];
  if (C && typeof C.registerExam === 'function') {
    try { C._exams = LIST; } catch (e) {}
    LIST.forEach(function (exam) { C.registerExam(exam); });
  }
})();
