/* =====================================================================
 * data/exam.js · Python 模拟卷 A / B
 * 职责：给 assets/exam.js 提供两套可在线作答、自动判分的模拟卷。
 * 范围：A 卷 ch00–ch05（程序结构 / 表达式 / 条件循环 / 函数 / 二维循环）；
 *       B 卷 ch06–ch09 + 综合（字符串切片 / 列表与文件 / 字典计数 / 排序与嵌套）。
 * 规格：每卷 19 题、满分 100、限时 90 分钟；代码一律 Python 3。
 * 判分：choice / tf 精确匹配，fill 归一化文本，output 逐行给分，
 *       keywords 按关键词命中比例给分（简答题需人工对照参考答案）。
 * ===================================================================== */
(function () {
  'use strict';

  /* ==================================================================
   * A 卷：ch00–ch05
   * ================================================================== */
  var A = {
    id: 'PY-A',
    title: 'Python 模拟卷 A',
    style: '期末风格',
    subtitle: 'Python 编程导论 · 覆盖 ch00–ch05 的读程序与基础语法',
    date: '2026-11-12',
    minutes: 90,
    totalScore: 100,
    summary: '本卷覆盖 ch00–ch05：程序的基本结构、变量与表达式、条件与循环、函数与分解、二维循环。' +
      '题目以读程序写输出为主，考查「按行推演」的基本功，而不是背语法条文；' +
      '建议限时 90 分钟独立完成，交卷后再对照解析逐题复盘。',
    instructions: [
      '时间 90 分钟，满分 100 分。开始作答后计时不会暂停，刷新页面或暂时离开也按真实时间计算。',
      '题型：单项选择 6 题、判断 2 题、填空 3 题、读程序写输出 5 题、简答 3 题。',
      '全部代码均为 Python 3，请按 Python 的规则推演，不要套用其他语言的写法。',
      '写输出题请逐行书写；行内多个值之间保留一个空格，不要添加空行或多余标点。',
      '简答题按关键词命中比例给分，答出要点即可；交卷后可对照参考答案人工复核表述。'
    ],
    questions: [

      /* ---------------------------------------------------------- Q1 */
      { no: 1, points: 6, type: 'multiple choice',
        intro: '先读一遍这段最短的 Python 程序，再回答两个问题。',
        code: `# 第一个程序：注释与输出
print("Hello, Python")
print(2 + 3 * 4)
print(10 // 4)
`,
        codeTitle: 'Q1.py',
        parts: [
          { label: '(a)', points: 3, kind: 'choice',
            prompt: '关于第 1 行 <code># 第一个程序：注释与输出</code>，下列说法正确的是：',
            options: [
              { text: '注释会被执行，并把这句话打印到屏幕上' },
              { text: '注释只写给人看，Python 解释器会忽略 <code>#</code> 后面的内容', correct: true },
              { text: '<code>#</code> 只能出现在文件第一行，写在别处会报语法错误' },
              { text: 'Python 的注释必须以 <code>//</code> 开头' }
            ],
            explain: '<code>#</code> 之后到行尾都是注释，解释器会跳过；注释可以单独成行，也可以跟在语句后面。' +
              'Python 的注释符号是 <code>#</code>，写 <code>//</code> 会被当成整除运算符，不是注释。' },
          { label: '(b)', points: 3, kind: 'choice',
            prompt: '程序运行后，屏幕上的第一行输出是：',
            options: [
              { text: '<code>Hello, Python</code>', correct: true },
              { text: '<code>"Hello, Python"</code>' },
              { text: '<code>hello, python</code>' },
              { text: '<code>第一个程序：注释与输出</code>' }
            ],
            explain: '第 2 行 <code>print("Hello, Python")</code> 才是第一条输出语句；引号只是字符串的定界符，不会被打印。' +
              '第 1 行是注释，里面的文字不会出现在屏幕上。' }
        ] },

      /* ---------------------------------------------------------- Q2 */
      { no: 2, points: 5, type: 'multiple choice',
        intro: '先自己心算四行结果，再作答。注意 <code>/</code> 与 <code>//</code> 的区别。',
        code: `x = 7
y = 2
print(x / y)
print(x // y)
print(x % y)
print(x ** y)
`,
        codeTitle: 'Q2.py',
        parts: [
          { label: '(a)', points: 2, kind: 'choice',
            prompt: '<code>print(x // y)</code> 这一行输出：',
            options: [
              { text: '3', correct: true },
              { text: '3.5' },
              { text: '4' },
              { text: '1' }
            ],
            explain: '<code>//</code> 是整除，结果向下取整：7 // 2 = 3。它和 <code>/</code> 不同，<code>/</code> 永远返回浮点数。' },
          { label: '(b)', points: 3, kind: 'choice',
            prompt: '四行输出从上到下依次是：',
            options: [
              { text: '3.5、3、1、49', correct: true },
              { text: '3、3、1、49' },
              { text: '3.5、3.5、1、49' },
              { text: '3.5、3、1、14' }
            ],
            explain: '7 / 2 = 3.5；7 // 2 = 3；7 % 2 = 1；7 ** 2 = 49。' +
              '<code>**</code> 是幂运算，优先级高于乘除，所以最后一行是 7 的平方。' }
        ] },

      /* ---------------------------------------------------------- Q3 */
      { no: 3, points: 5, type: 'multiple choice',
        intro: '字符串和整数是两种不同的类型，注意 <code>*</code> 作用在字符串上时的含义。',
        code: `a = "3"
b = 4
print(a * 2)
print(int(a) + b)
`,
        codeTitle: 'Q3.py',
        parts: [
          { points: 5, kind: 'choice',
            prompt: '两行输出依次是：',
            options: [
              { text: '<code>33</code> 和 <code>7</code>', correct: true },
              { text: '<code>6</code> 和 <code>7</code>' },
              { text: '<code>33</code> 和 <code>34</code>' },
              { text: '程序报错：字符串不能和整数相加' }
            ],
            explain: '<code>"3" * 2</code> 是字符串重复，得到 <code>"33"</code>，不是 6；' +
              '<code>int("3")</code> 把字符串转成整数 3，再加 4 得 7。' +
              'D 错在 <code>int()</code> 已经完成了类型转换，后面是整数加法，不会报错。' }
        ] },

      /* ---------------------------------------------------------- Q4 */
      { no: 4, points: 4, type: 'true / false',
        intro: '判断下列说法是否正确。',
        parts: [
          { label: '(a)', points: 2, kind: 'tf',
            prompt: '在 Python 中执行 <code>0.1 + 0.2 == 0.3</code>，结果是 <code>True</code>。',
            options: [
              { text: 'True' },
              { text: 'False', correct: true }
            ],
            explain: '0.1 和 0.2 都无法用二进制浮点精确表示，相加得到 0.30000000000000004，与 0.3 不相等，所以结果是 False。' +
              '比较浮点数通常写成 <code>abs(a - b) &lt; 1e-9</code> 这类「足够接近」的判断。' },
          { label: '(b)', points: 2, kind: 'tf',
            prompt: '<code>and</code> 与 <code>or</code> 都有短路求值：<code>False and f()</code> 中的 <code>f()</code> 不会被调用。',
            options: [
              { text: 'True', correct: true },
              { text: 'False' }
            ],
            explain: '<code>False and ...</code> 的结果一定是 False，右边的表达式没有必要再算，这就是短路求值。' +
              '<code>or</code> 同理：左边为真时右边不执行。' }
        ] },

      /* ---------------------------------------------------------- Q5 */
      { no: 5, points: 5, type: 'multiple choice',
        intro: '注意 if / elif / else 是一条链，而不是三个互相独立的分支。',
        code: `score = 72
if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
else:
    grade = "D"
print(grade)
`,
        codeTitle: 'Q5.py',
        parts: [
          { label: '(a)', points: 2, kind: 'choice',
            prompt: '程序输出：',
            options: [
              { text: 'A' },
              { text: 'B' },
              { text: 'C', correct: true },
              { text: 'D' }
            ],
            explain: 'score = 72：不满足 >= 90，也不满足 >= 80，但满足 >= 70，所以执行第三个分支，grade 被赋成 "C"。' },
          { label: '(b)', points: 3, kind: 'choice',
            prompt: '关于这段 if / elif / else 链，说法正确的是：',
            options: [
              { text: '条件从上到下依次判断，某个分支执行后，后面的分支会被跳过', correct: true },
              { text: '所有条件都会被判断一次，最后执行所有成立的分支' },
              { text: 'elif 与 if 相互独立，每个 elif 都会执行一次' },
              { text: '这段代码必须写 else，否则会报语法错误' }
            ],
            explain: 'if / elif / else 是一条链：从上往下找到第一个为真的条件，执行它的分支，然后跳出整条链。' +
              'else 可以省略，省略时若所有条件都不成立就什么也不做。' }
        ] },

      /* ---------------------------------------------------------- Q6 */
      { no: 6, points: 5, type: 'fill in',
        intro: '下面的循环把 1 到 5 累加起来。',
        code: `total = 0
for i in range(1, 6):
    total = total + i
print(total)
`,
        codeTitle: 'Q6.py',
        parts: [
          { label: '(a)', points: 2, kind: 'fill',
            prompt: '<code>range(1, 6)</code> 依次产生的整数是（用英文逗号加空格分隔）：',
            placeholder: '例如：1, 2, 3',
            answer: '1, 2, 3, 4, 5',
            accept: ['1,2,3,4,5', '1 2 3 4 5', '1、2、3、4、5'],
            explain: '<code>range(start, stop)</code> 包含起点、不包含终点，所以产生 1、2、3、4、5，共 5 个数。' },
          { label: '(b)', points: 3, kind: 'fill',
            prompt: '循环结束后 <code>print(total)</code> 输出：',
            placeholder: '填一个整数',
            answer: '15',
            explain: '1 + 2 + 3 + 4 + 5 = 15。累加器 total 必须在循环外先设为 0，否则第一轮就没有旧值可加。' }
        ] },

      /* ---------------------------------------------------------- Q7 */
      { no: 7, points: 5, type: 'multiple choice',
        intro: '循环条件是 <code>n &lt; 100</code>，注意 n 在循环体内如何变化。',
        code: `n = 1
while n < 100:
    n = n * 2
print(n)
`,
        codeTitle: 'Q7.py',
        parts: [
          { points: 5, kind: 'choice',
            prompt: '程序输出：',
            options: [
              { text: '64' },
              { text: '100' },
              { text: '128', correct: true },
              { text: '程序陷入死循环' }
            ],
            explain: 'n 依次变成 1 → 2 → 4 → 8 → 16 → 32 → 64 → 128；当 n = 128 时条件 128 < 100 为假，循环结束，输出 128。' +
              '循环体每轮都在更新 n，所以不会死循环；64 是「最后一次满足条件时」的值，不是最终值。' }
        ] },

      /* ---------------------------------------------------------- Q8 */
      { no: 8, points: 6, type: 'read & write output',
        intro: '注意 print 用逗号分隔多个值时，输出之间会自动加一个空格。',
        code: `print("Python", "is", "fun")
print(3 + 4, 3 * 4)
print("3 + 4 =", 3 + 4)
`,
        codeTitle: 'Q8.py',
        parts: [
          { points: 6, kind: 'output',
            prompt: '写出程序的三行输出（逐行精确书写）：',
            answer: 'Python is fun\n7 12\n3 + 4 = 7',
            explain: '第一行三个字符串用空格连接；第二行先算 3 + 4 = 7、3 * 4 = 12，再以空格分隔打印；' +
              '第三行字符串原样输出，后面的表达式算出 7。注意第一行没有引号。' }
        ] },

      /* ---------------------------------------------------------- Q9 */
      { no: 9, points: 6, type: 'read & write output',
        intro: '两小段程序互相独立，分别写出运行结果。',
        parts: [
          { label: '(a)', points: 3, kind: 'output',
            code: `n = 20
steps = 0
while n > 1:
    n = n // 2
    steps = steps + 1
print(n, steps)
`,
            codeTitle: 'Q9(a).py',
            prompt: '写出这段程序的输出（两个值之间一个空格）：',
            answer: '1 4',
            explain: 'n：20 → 10 → 5 → 2 → 1，共 4 轮；steps 每轮加 1，最后是 4。注意 5 // 2 = 2，不是 2.5。' },
          { label: '(b)', points: 3, kind: 'output',
            code: `total = 0
for i in range(1, 6):
    total = total + i * i
print(total)
`,
            codeTitle: 'Q9(b).py',
            prompt: '写出这段程序的输出：',
            answer: '55',
            explain: 'i 取 1 到 5，累加每个数的平方：1 + 4 + 9 + 16 + 25 = 55。' }
        ] },

      /* ---------------------------------------------------------- Q10 */
      { no: 10, points: 4, type: 'true / false',
        intro: '判断下列说法是否正确。',
        parts: [
          { label: '(a)', points: 2, kind: 'tf',
            prompt: '<code>for i in range(3):</code> 的循环体执行 3 次，i 依次取 0、1、2。',
            options: [
              { text: 'True', correct: true },
              { text: 'False' }
            ],
            explain: '<code>range(3)</code> 等价于 <code>range(0, 3)</code>，产生 0、1、2 三个值，循环体执行 3 次。' },
          { label: '(b)', points: 2, kind: 'tf',
            prompt: '<code>while</code> 循环的循环体至少会执行一次。',
            options: [
              { text: 'True' },
              { text: 'False', correct: true }
            ],
            explain: 'while 先判断条件再执行，条件一开始就为假时循环体一次也不会执行。' +
              'Python 没有 do-while；若确实需要「至少执行一次」，应先写一次再进入循环。' }
        ] },

      /* ---------------------------------------------------------- Q11 */
      { no: 11, points: 5, type: 'fill in',
        intro: '函数先算出返回值，再参与外面的加法。',
        code: `def area(w, h):
    return w * h

def perimeter(w, h):
    return 2 * (w + h)

print(area(3, 4) + perimeter(3, 4))
`,
        codeTitle: 'Q11.py',
        parts: [
          { points: 5, kind: 'fill',
            prompt: '程序输出：',
            placeholder: '填一个整数',
            answer: '26',
            explain: 'area(3, 4) = 3 × 4 = 12；perimeter(3, 4) = 2 × (3 + 4) = 14；12 + 14 = 26。' }
        ] },

      /* ---------------------------------------------------------- Q12 */
      { no: 12, points: 5, type: 'multiple choice',
        intro: '注意函数内部的赋值改的是局部名字，不是外面的变量。',
        code: `def double(x):
    x = x * 2
    return x

n = 5
m = double(n)
print(n, m)
`,
        codeTitle: 'Q12.py',
        parts: [
          { label: '(a)', points: 2, kind: 'choice',
            prompt: '程序输出：',
            options: [
              { text: '<code>5 10</code>', correct: true },
              { text: '<code>10 10</code>' },
              { text: '<code>5 5</code>' },
              { text: '<code>10 5</code>' }
            ],
            explain: '函数里的 x 是局部名字，<code>x = x * 2</code> 只改变函数内部的 x，n 本身没有变。' +
              '返回值 10 赋给 m，所以输出 5 10。' },
          { label: '(b)', points: 3, kind: 'choice',
            prompt: '如果把函数体改成只有 <code>x = x * 2</code>（删去 return 那一行），<code>print(n, m)</code> 会输出：',
            options: [
              { text: '<code>5 10</code>' },
              { text: '<code>5 None</code>', correct: true },
              { text: '<code>10 None</code>' },
              { text: '程序报错：函数没有返回值' }
            ],
            explain: '没有 return 的函数会返回 <code>None</code>。m 得到 None，n 仍然是 5，所以输出 <code>5 None</code>；' +
              '这不是语法错误，运行时也不会报错。' }
        ] },

      /* ---------------------------------------------------------- Q13 */
      { no: 13, points: 6, type: 'read & write output',
        intro: '两段都是嵌套循环，注意内层循环每轮都会完整跑一遍。',
        parts: [
          { label: '(a)', points: 3, kind: 'output',
            code: `for row in range(3):
    line = ""
    for col in range(4):
        line = line + "*"
    print(row, line)
`,
            codeTitle: 'Q13(a).py',
            prompt: '写出这段程序的输出（每行两个值，中间一个空格）：',
            answer: '0 ****\n1 ****\n2 ****',
            explain: '外层循环 3 轮，每轮先把 line 重新设为空串，内层循环再拼上 4 个星号。' +
              '打印时先输出行号 row，再输出 4 个星号，所以三行分别以 0、1、2 开头。' },
          { label: '(b)', points: 3, kind: 'output',
            code: `for i in range(1, 4):
    for j in range(1, i + 1):
        print(i, j)
`,
            codeTitle: 'Q13(b).py',
            prompt: '写出这段程序的输出（每行两个数，中间一个空格）：',
            answer: '1 1\n2 1\n2 2\n3 1\n3 2\n3 3',
            explain: 'i = 1 时内层 j 只取 1；i = 2 时 j 取 1、2；i = 3 时 j 取 1、2、3，共 6 行。' +
              '内层 <code>range(1, i + 1)</code> 的终点随外层变量变化，这是打印三角形的常用写法。' }
        ] },

      /* ---------------------------------------------------------- Q14 */
      { no: 14, points: 6, type: 'read & write output',
        intro: '字符串乘整数表示重复。',
        code: `for i in range(1, 5):
    print(i, "*" * i)
`,
        codeTitle: 'Q14.py',
        parts: [
          { points: 6, kind: 'output',
            prompt: '写出程序的四行输出（每行「数字 + 空格 + 星号」）：',
            answer: '1 *\n2 **\n3 ***\n4 ****',
            explain: 'i 从 1 到 4，每轮先打印 i，再打印 i 个星号，两者之间由 print 自动补一个空格。' +
              '注意 <code>range(1, 5)</code> 不包含 5。' }
        ] },

      /* ---------------------------------------------------------- Q15 */
      { no: 15, points: 5, type: 'fill in',
        intro: '两小题都是填空：把程序的输出写在答案里。',
        parts: [
          { label: '(a)', points: 2, kind: 'fill',
            code: `def greet(name, greeting="Hello"):
    return greeting + ", " + name

print(greet("Ada"))
`,
            codeTitle: 'Q15(a).py',
            prompt: '程序输出：',
            answer: 'Hello, Ada',
            explain: '调用时只传了一个参数，<code>greeting</code> 使用默认值 "Hello"；拼接结果是 "Hello, Ada"，注意逗号后有一个空格。' },
          { label: '(b)', points: 3, kind: 'fill',
            code: `def f(x):
    return x * 2

def g(x):
    return f(x) + 1

print(g(3))
`,
            codeTitle: 'Q15(b).py',
            prompt: '程序输出：',
            placeholder: '填一个整数',
            answer: '7',
            explain: 'g(3) 先调用 f(3) 得到 6，再加 1 得 7。函数可以调用另一个函数，返回值再参与外面的运算。' }
        ] },

      /* ---------------------------------------------------------- Q16 */
      { no: 16, points: 5, type: 'short answer',
        intro: '简答题：按要点作答即可，评分时按关键词命中比例给分。',
        parts: [
          { points: 5, kind: 'keywords',
            prompt: '把一段重复出现的代码改写成函数，至少带来哪些好处？请写出三条，并各用一句话说明。',
            keywords: [
              ['复用', '重用', '重复使用', '不用重复写', '避免重复'],
              ['可读', '易读', '清晰', '名字', '语义'],
              ['维护', '修改', '一处', '只改', '统一'],
              ['测试', '调试', '隔离', '单独验证'],
              ['参数', '抽象', '屏蔽细节', '分解', '分工']
            ],
            answer: '参考答案（关键词给分，人工对照）：\n' +
              '1) 复用：同一段逻辑只写一次，需要时多次调用，不必复制粘贴。\n' +
              '2) 可读：给逻辑起一个有意义的名字，主程序读起来像一句话。\n' +
              '3) 易维护：需求变化时只改函数体一处，所有调用点一起生效。\n' +
              '4) 易测试：函数的输入输出明确，可以单独验证。\n' +
              '5) 分解与抽象：用参数接收变化的数据，把细节藏在函数内部。',
            explain: '五组关键词各 1 分：复用、可读、维护、测试、参数/抽象。表述不同但意思对即可，需人工对照参考答案。' }
        ] },

      /* ---------------------------------------------------------- Q17 */
      { no: 17, points: 6, type: 'read & write output',
        intro: '两小题都把函数调用嵌在循环或表达式里，先算函数值再继续。',
        parts: [
          { label: '(a)', points: 3, kind: 'output',
            code: `def is_even(n):
    return n % 2 == 0

count = 0
for i in range(1, 8):
    if is_even(i):
        count = count + 1
print(count)
`,
            codeTitle: 'Q17(a).py',
            prompt: '写出这段程序的输出：',
            answer: '3',
            explain: '1 到 7 中的偶数是 2、4、6，共 3 个。is_even 返回布尔值，可以直接放在 if 的条件里使用。' },
          { label: '(b)', points: 3, kind: 'output',
            code: `def digit_sum(n):
    total = 0
    while n > 0:
        total = total + n % 10
        n = n // 10
    return total

print(digit_sum(1234))
`,
            codeTitle: 'Q17(b).py',
            prompt: '写出这段程序的输出：',
            answer: '10',
            explain: '每轮取个位：4、3、2、1，累加得 10；n 每轮整除 10 去掉个位，变成 0 时循环结束。' +
              '这个函数对任意非负整数都成立。' }
        ] },

      /* ---------------------------------------------------------- Q18 */
      { no: 18, points: 6, type: 'short answer',
        intro: '下面的程序想从 10 倒数到 1，但运行后停不下来。读代码后回答。',
        code: `n = 10
while n > 0:
    print(n)
`,
        codeTitle: 'Q18.py',
        parts: [
          { points: 6, kind: 'keywords',
            prompt: '指出这段程序的问题，并说明怎样修改才能让它正常结束（写清改哪一行、改成什么）。',
            keywords: [
              ['没有更新', '没有修改', '没有改变', 'n 不变', 'n没有变', '没变'],
              ['死循环', '无限循环', '永远循环', '停不下来'],
              ['n = n - 1', 'n -= 1', '递减', '减 1', '减一', '每次减'],
              ['循环体内', '在 print 之后', '每次循环', '循环体中', '加一行']
            ],
            answer: '参考答案（关键词给分，人工对照）：\n' +
              '问题：循环体里只打印 n，没有更新循环变量，n 一直是 10，条件 n > 0 永远为真，所以是死循环。\n' +
              '修改：在循环体内、print 之后加一行 n = n - 1（或 n -= 1），让 n 每轮递减。' +
              '减到 0 时条件 n > 0 为假，循环结束，输出 10 到 1。',
            explain: '四组关键词各 1.5 分：没有更新循环变量、死循环、n = n - 1 / n -= 1、放在循环体内。' +
              '只写「加 n = n - 1」而没有指出死循环原因，会少拿一半分。' }
        ] },

      /* ---------------------------------------------------------- Q19 */
      { no: 19, points: 5, type: 'short answer',
        intro: '简答题：用自己的话说明即可，评分时按关键词命中比例给分。',
        parts: [
          { points: 5, kind: 'keywords',
            prompt: '用嵌套循环处理一张图片时，外层循环和内层循环通常分别遍历什么？为什么通常把「行」放在外层？请用 3–4 句话说明。',
            keywords: [
              ['外层', 'row', '行循环', '外循环'],
              ['内层', 'column', 'col', '列循环', '内循环'],
              ['每个像素', '所有像素', '逐行', '一行一行'],
              ['从上到下', '从左到右', '阅读习惯', '自然', '顺序'],
              ['行数', '列数', 'height', 'width', 'range']
            ],
            answer: '参考答案（关键词给分，人工对照）：\n' +
              '外层循环遍历每一行（row / y），内层循环遍历这一行里的每一列（column / x），两层合起来访问每个像素 (x, y)。\n' +
              '把行放在外层符合人的阅读习惯：从上到下一行一行处理，同一行内从左到右，输出和调试时的顺序也更自然。\n' +
              '内层循环的次数通常由图片宽度（列数）决定，外层由高度（行数）决定，所以常写成 range(height) 里套 range(width)。',
            explain: '五组关键词各 1 分：外层=行、内层=列、访问每个像素、从上到下/从左到右、用行数列数控制 range。' }
        ] }
    ]
  };

  /* ==================================================================
   * B 卷：ch06–ch09 + 综合
   * ================================================================== */
  var B = {
    id: 'PY-B',
    title: 'Python 模拟卷 B',
    style: '期末风格',
    subtitle: 'Python 编程导论 · 覆盖 ch06–ch09 与综合应用的读程序与数据处理',
    date: '2026-11-12',
    minutes: 90,
    totalScore: 100,
    summary: '本卷覆盖 ch06–ch09 与综合应用：字符串与切片、列表与文件、字典计数、嵌套结构与排序。' +
      '题目强调「先认清数据结构，再按行推演」，后半段会出现跨章节组合；' +
      '建议限时 90 分钟完成，简答题按关键词给分，交卷后请对照参考答案人工复核表述。',
    instructions: [
      '时间 90 分钟，满分 100 分。开始作答后计时不会暂停，刷新页面或暂时离开也按真实时间计算。',
      '题型：单项选择 6 题、判断 2 题、填空 3 题、读程序写输出 5 题、简答 3 题。',
      '全部代码均为 Python 3，请按 Python 的规则推演；列表、字典的打印格式按 Python 默认写法书写。',
      '写输出题请逐行书写；行内多个值之间保留一个空格，不要添加空行或多余标点。',
      '简答题与找错题按关键词命中比例给分，答出要点即可；交卷后可对照参考答案人工复核。'
    ],
    questions: [

      /* ---------------------------------------------------------- Q1 */
      { no: 1, points: 6, type: 'multiple choice',
        intro: '切片写作 <code>s[start:stop:step]</code>，包含 start、不包含 stop，下标可以是负数。',
        code: `s = "PYTHON"
print(s[1:4])
print(s[:3])
print(s[-2:])
`,
        codeTitle: 'Q1.py',
        parts: [
          { label: '(a)', points: 3, kind: 'choice',
            prompt: '第一行 <code>print(s[1:4])</code> 输出：',
            options: [
              { text: 'YTH', correct: true },
              { text: 'PYT' },
              { text: 'YTHO' },
              { text: 'YTHON' }
            ],
            explain: '下标从 0 开始：P 是 0、Y 是 1、T 是 2、H 是 3、O 是 4、N 是 5。' +
              '<code>s[1:4]</code> 取 1、2、3 三个字符，即 YTH。' },
          { label: '(b)', points: 3, kind: 'choice',
            prompt: '三行输出从上到下依次是：',
            options: [
              { text: 'YTH、PYT、ON', correct: true },
              { text: 'YTH、PYT、NO' },
              { text: 'YTHO、PYT、ON' },
              { text: 'YTH、PYTH、ON' }
            ],
            explain: '<code>s[:3]</code> 省略起点，从 0 取到 2，得 PYT；<code>s[-2:]</code> 从倒数第二个字符取到结尾，得 ON。' }
        ] },

      /* ---------------------------------------------------------- Q2 */
      { no: 2, points: 5, type: 'multiple choice',
        intro: '注意方法的返回值有没有被重新赋值给变量。',
        code: `s = "hello"
s.upper()
print(s)
`,
        codeTitle: 'Q2.py',
        parts: [
          { points: 5, kind: 'choice',
            prompt: '程序输出：',
            options: [
              { text: 'HELLO' },
              { text: 'hello', correct: true },
              { text: '程序报错：字符串不能调用 upper()' },
              { text: 'Hello' }
            ],
            explain: '字符串是不可变对象，<code>upper()</code> 返回一个新字符串，并不会改变 s 本身。' +
              '这里没有把返回值赋回去，所以 s 仍是 "hello"；写成 <code>s = s.upper()</code> 才会输出 HELLO。' }
        ] },

      /* ---------------------------------------------------------- Q3 */
      { no: 3, points: 5, type: 'multiple choice',
        intro: 'Python 打印列表时，元素之间用「逗号 + 一个空格」分隔，两端是方括号。',
        code: `nums = [1, 2, 3]
nums.append(4)
nums[0] = 9
print(nums)
print(len(nums))
`,
        codeTitle: 'Q3.py',
        parts: [
          { label: '(a)', points: 2, kind: 'choice',
            prompt: '第一行输出：',
            options: [
              { text: '[9, 2, 3, 4]', correct: true },
              { text: '[1, 2, 3, 4]' },
              { text: '[9, 2, 3]' },
              { text: '[9, 1, 2, 3, 4]' }
            ],
            explain: '<code>append(4)</code> 在末尾追加 4，列表变成 [1, 2, 3, 4]；<code>nums[0] = 9</code> 把第一个元素改成 9，得到 [9, 2, 3, 4]。' },
          { label: '(b)', points: 3, kind: 'choice',
            prompt: '第二行输出：',
            options: [
              { text: '3' },
              { text: '4', correct: true },
              { text: '5' },
              { text: '[9, 2, 3, 4]' }
            ],
            explain: '<code>len()</code> 返回元素个数；列表里有 9、2、3、4 四个元素，所以是 4。' }
        ] },

      /* ---------------------------------------------------------- Q4 */
      { no: 4, points: 4, type: 'true / false',
        intro: '判断下列说法是否正确。',
        parts: [
          { label: '(a)', points: 2, kind: 'tf',
            prompt: '<code>s = "abc"</code> 之后执行 <code>s[0] = "A"</code>，可以把字符串改成 <code>"Abc"</code>。',
            options: [
              { text: 'True' },
              { text: 'False', correct: true }
            ],
            explain: '字符串不可变，不能通过下标赋值，<code>s[0] = "A"</code> 会抛 TypeError。' +
              '要得到新字符串应写 <code>s = "A" + s[1:]</code>，或者用 <code>replace</code> 之类的方法生成新串。' },
          { label: '(b)', points: 2, kind: 'tf',
            prompt: '<code>a = [1, 2]</code> 后执行 <code>b = a</code>，再执行 <code>b.append(3)</code>，此时 <code>a</code> 也变成 <code>[1, 2, 3]</code>。',
            options: [
              { text: 'True', correct: true },
              { text: 'False' }
            ],
            explain: '<code>b = a</code> 不复制列表，只让 b 和 a 指向同一个列表对象；通过 b 修改，a 看到的变化相同。' +
              '需要独立副本时应写 <code>b = a[:]</code> 或 <code>b = list(a)</code>。' }
        ] },

      /* ---------------------------------------------------------- Q5 */
      { no: 5, points: 5, type: 'multiple choice',
        intro: '这是字典计数的标准写法：用 get 取旧值，没有就当作 0。',
        code: `counts = {}
counts["a"] = counts.get("a", 0) + 1
counts["a"] = counts.get("a", 0) + 1
counts["b"] = counts.get("b", 0) + 1
print(counts["a"])
print(counts)
`,
        codeTitle: 'Q5.py',
        parts: [
          { label: '(a)', points: 2, kind: 'choice',
            prompt: '<code>print(counts["a"])</code> 输出：',
            options: [
              { text: '1' },
              { text: '2', correct: true },
              { text: '3' },
              { text: 'KeyError' }
            ],
            explain: '<code>get("a", 0)</code> 在键不存在时返回默认值 0：第一行把 a 记成 1，第二行读到 1 再加 1 得 2。' },
          { label: '(b)', points: 3, kind: 'choice',
            prompt: '<code>print(counts)</code> 输出：',
            options: [
              { text: "{'a': 2, 'b': 1}", correct: true },
              { text: "{'a': 1, 'b': 1}" },
              { text: "[('a', 2), ('b', 1)]" },
              { text: "{'b': 1, 'a': 2}" }
            ],
            explain: 'Python 3.7 起字典保持插入顺序：先插入 a、再插入 b，所以打印时 a 在前。' +
              '字典用大括号和「键: 值」表示，字符串键带引号，项与项之间是「逗号 + 空格」。' }
        ] },

      /* ---------------------------------------------------------- Q6 */
      { no: 6, points: 5, type: 'fill in',
        intro: '两行分别考查 <code>count</code> 与带步长的切片。',
        code: `print("banana".count("a"))
print("banana"[::2])
`,
        codeTitle: 'Q6.py',
        parts: [
          { label: '(a)', points: 2, kind: 'fill',
            prompt: '第一行输出：',
            placeholder: '填一个整数',
            answer: '3',
            explain: 'banana 里 a 出现在下标 1、3、5，共 3 个；<code>count</code> 数的是出现次数，不是下标。' },
          { label: '(b)', points: 3, kind: 'fill',
            prompt: '第二行输出：',
            answer: 'bnn',
            explain: '<code>[::2]</code> 表示从头到尾、步长 2，取下标 0、2、4 的字符：b、n、n，拼成 "bnn"。' }
        ] },

      /* ---------------------------------------------------------- Q7 */
      { no: 7, points: 5, type: 'multiple choice',
        intro: '假设 <code>data.txt</code> 里恰好有三行文本：alpha、beta、gamma，每行末尾都有换行符。',
        code: `with open("data.txt", "r") as f:
    lines = f.readlines()
print(len(lines))
`,
        codeTitle: 'Q7.py',
        parts: [
          { points: 5, kind: 'choice',
            prompt: '程序输出：',
            options: [
              { text: '2' },
              { text: '3', correct: true },
              { text: '4' },
              { text: '程序报错：没有调用 f.close()' }
            ],
            explain: '<code>readlines()</code> 把每一行作为列表的一个元素，三行就是 3 个元素，所以 <code>len(lines)</code> 为 3。' +
              'with 语句会在离开代码块时自动关闭文件，不需要手动 <code>close()</code>，也不会报错。' }
        ] },

      /* ---------------------------------------------------------- Q8 */
      { no: 8, points: 6, type: 'read & write output',
        intro: '负数步长表示从后往前取。',
        code: `word = "stressed"
print(word[::-1])
print(word[1:4])
`,
        codeTitle: 'Q8.py',
        parts: [
          { points: 6, kind: 'output',
            prompt: '写出程序的两行输出：',
            answer: 'desserts\ntre',
            explain: '步长为 -1 表示从后往前取，stressed 倒过来是 desserts；<code>word[1:4]</code> 取下标 1、2、3 的 t、r、e。' }
        ] },

      /* ---------------------------------------------------------- Q9 */
      { no: 9, points: 6, type: 'read & write output',
        intro: '同一份列表被用了两次：一次求和，一次挑奇数。',
        code: `nums = [3, 1, 4, 1, 5]
total = 0
for n in nums:
    total = total + n

result = []
for n in nums:
    if n % 2 == 1:
        result.append(n)

print(total)
print(result)
`,
        codeTitle: 'Q9.py',
        parts: [
          { label: '(a)', points: 3, kind: 'output',
            prompt: '第一行输出：',
            answer: '14',
            explain: '3 + 1 + 4 + 1 + 5 = 14。for 直接遍历列表元素，不需要下标。' },
          { label: '(b)', points: 3, kind: 'output',
            prompt: '第二行输出：',
            answer: '[3, 1, 1, 5]',
            explain: '挑出所有奇数并按原顺序追加：3、1、1、5。打印列表时元素之间是「逗号 + 空格」，两端加方括号。' }
        ] },

      /* ---------------------------------------------------------- Q10 */
      { no: 10, points: 4, type: 'true / false',
        intro: '判断下列说法是否正确。',
        parts: [
          { label: '(a)', points: 2, kind: 'tf',
            prompt: '用 <code>for line in f:</code> 逐行读文件时，line 通常带着行末的换行符，常用 <code>line.strip()</code> 把它去掉。',
            options: [
              { text: 'True', correct: true },
              { text: 'False' }
            ],
            explain: '文件迭代按行返回字符串，行末的换行符会保留在字符串里；<code>strip()</code> 去掉首尾空白（包括换行），' +
              '只想去掉换行时可以用 <code>rstrip("\\n")</code>。' },
          { label: '(b)', points: 2, kind: 'tf',
            prompt: '字典的键可以是列表，例如 <code>d[[1, 2]] = 3</code> 是合法的。',
            options: [
              { text: 'True' },
              { text: 'False', correct: true }
            ],
            explain: '字典的键必须可哈希；列表是可变的、不可哈希，用作键会抛 TypeError。元组、字符串、数字可以作为键。' }
        ] },

      /* ---------------------------------------------------------- Q11 */
      { no: 11, points: 5, type: 'fill in',
        intro: '遍历字符串，用字典累计每个字符出现的次数。',
        code: `text = "level"
counts = {}
for ch in text:
    counts[ch] = counts.get(ch, 0) + 1
print(counts["e"])
`,
        codeTitle: 'Q11.py',
        parts: [
          { points: 5, kind: 'fill',
            prompt: '程序输出：',
            placeholder: '填一个整数',
            answer: '2',
            explain: 'level 的字符依次是 l、e、v、e、l，e 出现 2 次。<code>get(ch, 0)</code> 让第一次遇到的字符从 0 开始计数。' }
        ] },

      /* ---------------------------------------------------------- Q12 */
      { no: 12, points: 5, type: 'multiple choice',
        intro: '注意 <code>sorted()</code> 与 <code>sort()</code> 的区别，以及 <code>key</code> 参数的含义。',
        parts: [
          { label: '(a)', points: 2, kind: 'choice',
            code: `nums = [3, 1, 2]
result = sorted(nums)
print(nums, result)
`,
            codeTitle: 'Q12(a).py',
            prompt: '程序输出：',
            options: [
              { text: '[3, 1, 2] [1, 2, 3]', correct: true },
              { text: '[1, 2, 3] [1, 2, 3]' },
              { text: '[3, 1, 2] [3, 2, 1]' },
              { text: '[1, 2, 3] [3, 1, 2]' }
            ],
            explain: '<code>sorted()</code> 返回排好序的新列表，原列表不变，所以 nums 仍是 [3, 1, 2]。' +
              'print 用逗号分隔两个值，中间一个空格。' },
          { label: '(b)', points: 3, kind: 'choice',
            code: `words = ["pear", "apple", "fig"]
words.sort(key=len)
print(words)
`,
            codeTitle: 'Q12(b).py',
            prompt: '程序输出：',
            options: [
              { text: "['fig', 'pear', 'apple']", correct: true },
              { text: "['apple', 'fig', 'pear']" },
              { text: "['fig', 'apple', 'pear']" },
              { text: "['apple', 'pear', 'fig']" }
            ],
            explain: '<code>key=len</code> 表示按字符串长度排序：fig 长 3、pear 长 4、apple 长 5，所以顺序是 fig、pear、apple。' +
              '<code>sort()</code> 就地修改 words，返回值是 None。' }
        ] },

      /* ---------------------------------------------------------- Q13 */
      { no: 13, points: 6, type: 'read & write output',
        intro: '两小题分别考查字典里的列表和二维列表的下标。',
        parts: [
          { label: '(a)', points: 3, kind: 'output',
            code: `scores = {"amy": [90, 80], "ben": [70, 60]}
for name in scores:
    print(name, sum(scores[name]) // 2)
`,
            codeTitle: 'Q13(a).py',
            prompt: '写出程序的两行输出：',
            answer: 'amy 85\nben 65',
            explain: '遍历字典得到键 amy、ben（插入顺序）；<code>sum</code> 求列表和：170 // 2 = 85，130 // 2 = 65。' +
              '这里用整除，输出不会带 .0。' },
          { label: '(b)', points: 3, kind: 'output',
            code: `matrix = [[1, 2, 3], [4, 5, 6]]
col = 0
for row in matrix:
    col = col + row[1]
print(col)
`,
            codeTitle: 'Q13(b).py',
            prompt: '写出程序的输出：',
            answer: '7',
            explain: '第一次 row = [1, 2, 3]，row[1] = 2；第二次 row = [4, 5, 6]，row[1] = 5；2 + 5 = 7。' +
              '这是取二维列表「第二列」的写法。' }
        ] },

      /* ---------------------------------------------------------- Q14 */
      { no: 14, points: 6, type: 'read & write output',
        intro: '先统计字符次数，再按键排序输出。',
        code: `counts = {}
for ch in "mississippi":
    counts[ch] = counts.get(ch, 0) + 1
letters = sorted(counts)
for ch in letters:
    print(ch, counts[ch])
`,
        codeTitle: 'Q14.py',
        parts: [
          { points: 6, kind: 'output',
            prompt: '写出程序的四行输出（每行「字符 + 空格 + 次数」）：',
            answer: 'i 4\nm 1\np 2\ns 4',
            explain: 'mississippi 中 m 1 次、i 4 次、s 4 次、p 2 次；<code>sorted(counts)</code> 把键按字母顺序排成 i、m、p、s，' +
              '再逐个打印字符和次数。注意排序的是键，不是次数。' }
        ] },

      /* ---------------------------------------------------------- Q15 */
      { no: 15, points: 5, type: 'fill in',
        intro: '两小题分别考查 split 与字典的更新。',
        code: `s = "hello world"
print(len(s.split()))

d = {"a": 1, "b": 2}
d["a"] = d.get("a", 0) + 10
print(d)
`,
        codeTitle: 'Q15.py',
        parts: [
          { label: '(a)', points: 2, kind: 'fill',
            prompt: '第一行输出：',
            placeholder: '填一个整数',
            answer: '2',
            explain: '<code>split()</code> 不带参数时按任意空白切分，"hello world" 得到两个单词，len 为 2。' },
          { label: '(b)', points: 3, kind: 'fill',
            prompt: '第二行输出：',
            answer: "{'a': 11, 'b': 2}",
            accept: ["{'a':11,'b':2}"],
            explain: '<code>get("a", 0)</code> 读到旧值 1，加 10 后写回 a；b 不变。打印顺序按插入顺序，a 在前、b 在后。' }
        ] },

      /* ---------------------------------------------------------- Q16 */
      { no: 16, points: 5, type: 'short answer',
        intro: '简答题：按要点作答即可，评分时按关键词命中比例给分。',
        parts: [
          { points: 5, kind: 'keywords',
            prompt: '请说明用 Python 读取一个文本文件的完整步骤，并解释 <code>with open(...) as f:</code> 相比手动 <code>f = open(...)</code> 的好处。',
            keywords: [
              ['open', '打开文件', '打开'],
              ['with', '上下文管理器', '自动关闭'],
              ['close', '关闭文件', '释放'],
              ['read', 'readlines', 'readline', 'for line in f', '逐行'],
              ['模式', '"r"', '路径', '文件名']
            ],
            answer: '参考答案（关键词给分，人工对照）：\n' +
              '1) 用 open(路径, "r") 打开文件，得到文件对象；\n' +
              '2) 读取内容：read() 一次读完、readlines() 读成列表、或 for line in f 逐行处理；\n' +
              '3) 用完关闭文件。\n' +
              'with 的好处：with 是上下文管理器，代码块结束（包括中途抛出异常）时会自动调用 close()，' +
              '不会忘记关闭文件，也不会因为异常而泄漏文件句柄；手动写法需要自己保证 close() 一定被执行。',
            explain: '五组关键词各 1 分：open、with/上下文管理器、close、read/readlines/逐行、模式或路径。' +
              '表述不同但意思对即可，需人工对照参考答案。' }
        ] },

      /* ---------------------------------------------------------- Q17 */
      { no: 17, points: 6, type: 'read & write output',
        intro: '两小题分别把列表和字符串转成别的形式。',
        parts: [
          { label: '(a)', points: 3, kind: 'output',
            code: `words = ["apple", "banana", "cherry"]
lengths = []
for w in words:
    lengths.append(len(w))
print(lengths)
`,
            codeTitle: 'Q17(a).py',
            prompt: '写出这段程序的输出：',
            answer: '[5, 6, 6]',
            explain: 'apple 5 个字母，banana 6 个，cherry 6 个；append 依次追加，打印为 [5, 6, 6]。' },
          { label: '(b)', points: 3, kind: 'output',
            code: `text = "a-b-c"
parts = text.split("-")
print(parts)
print("-".join(parts))
`,
            codeTitle: 'Q17(b).py',
            prompt: '写出这段程序的两行输出：',
            answer: "['a', 'b', 'c']\na-b-c",
            explain: '<code>split("-")</code> 按短横线切成三个字符串，得到列表；<code>join</code> 用 "-" 把列表元素重新拼成一个字符串。' }
        ] },

      /* ---------------------------------------------------------- Q18 */
      { no: 18, points: 6, type: 'short answer',
        intro: '下面的程序想统计整词 "the" 出现的次数，但运行结果是 0。读代码后回答。',
        code: `def count_word(text, word):
    count = 0
    for ch in text:
        if ch == word:
            count = count + 1
    return count

print(count_word("the cat sat on the mat", "the"))
`,
        codeTitle: 'Q18.py',
        parts: [
          { points: 6, kind: 'keywords',
            prompt: '指出错误原因，并写出一种修改方案（用文字或代码均可）。',
            keywords: [
              ['逐字符', '按字符', '单个字符', '一个字符', 'ch 是字符'],
              ['split', 'text.split', '按空格', '分词', '切成单词'],
              ['count', 'text.count', 'str.count'],
              ['不会相等', '永远不相等', '永远为 0', '匹配不到', '比较对象', '不会匹配'],
              ['修改', '改成', '正确做法', '方案']
            ],
            answer: '参考答案（关键词给分，人工对照）：\n' +
              '原因：for ch in text 是逐字符遍历，ch 是单个字符（如 "t"、"h"），而 word 是 "the" 这个整词，' +
              '两者永远不会相等，所以 count 一直是 0。\n' +
              '修改一：先分词再比较——for w in text.split(): if w == word: count += 1。\n' +
              '修改二：直接用字符串方法 return text.count(word)（本题文本中 "the" 恰好作为独立单词出现）。',
            explain: '五组关键词各 1.2 分：逐字符遍历、应 split 成单词、可用 count、字符与整词不会相等、给出修改方案。' +
              '只指出「结果是 0」而没有说明原因，会少拿分。' }
        ] },

      /* ---------------------------------------------------------- Q19 */
      { no: 19, points: 5, type: 'short answer',
        intro: '简答题：写出思路即可，评分时按关键词命中比例给分。',
        parts: [
          { points: 5, kind: 'keywords',
            prompt: '要统计一段文本中每个单词出现的次数，并按次数从高到低输出，请写出你的思路（说明用到的数据结构与关键函数）。',
            keywords: [
              ['split', '分词', '按空白', '切成单词'],
              ['字典', 'dict', 'counts'],
              ['get', 'setdefault', 'counts.get', 'word in', 'in counts'],
              ['sorted', 'sort', '排序'],
              ['reverse', '降序', '从高到低', '逆序']
            ],
            answer: '参考答案（关键词给分，人工对照）：\n' +
              '1) 用 text.split() 把文本切成单词列表；\n' +
              '2) 准备一个字典 counts，遍历单词，用 counts[word] = counts.get(word, 0) + 1 累加次数' +
              '（也可以先用 setdefault，或 if word in counts 判断）；\n' +
              '3) 按次数降序排序：items = sorted(counts.items(), key=lambda kv: kv[1], reverse=True)；\n' +
              '4) 遍历 items 输出单词和次数；若要求次数相同的按字母序，可把 key 写成 (-次数, 单词)。',
            explain: '五组关键词各 1 分：split 分词、字典计数、get/setdefault/判断存在、sorted 排序、降序/reverse。' }
        ] }
    ]
  };

  /* ---------------------------------------------------------------- 注册 */
  var G = (typeof globalThis !== 'undefined') ? globalThis : (typeof window !== 'undefined') ? window : this;
  var C = G && G.CSC;
  if (C && typeof C.registerExam === 'function') {
    try { C._exams = [A, B]; } catch (e) {}
    [A, B].forEach(function (ex) { C.registerExam(ex); });
  }
})();
