/* data/quiz.js · Python 题库：90 题，覆盖 ch00–ch09；题型 mcq/predict/fill/multi */
(function () {
  'use strict';
  var PACK = { items: [

    /* ch00 · 序章：编程是什么 */
    {
      id: 'ch00-q1', ch: 'ch00', kp: 'ch00-1', tier: 1, type: 'mcq', difficulty: 1,
      tags: ['concept'],
      stem: '在 Python 里，一个<b>程序</b>最本质的含义是什么？',
      options: [
        { text: '一台计算机的硬件配置' },
        { text: '一组按顺序执行的指令', correct: true },
        { text: '一种用自然语言写成的说明书' },
        { text: '一个已经打包好的可执行文件' }
      ],
      explain: '程序是写给计算机执行的一组指令，解释器会按顺序读取并执行它们。硬件是运行程序的设备，自然语言说明不是程序，Python 源码也不需要先打包成 exe 才能运行。'
    },
    {
      id: 'ch00-q2', ch: 'ch00', kp: 'ch00-2', tier: 1, type: 'mcq', difficulty: 1,
      tags: ['concept'],
      stem: 'Python 的<b>解释器</b>主要负责什么？',
      options: [
        { text: '逐行读取源代码并执行', correct: true },
        { text: '把程序翻译成 Word 文档' },
        { text: '自动理解并修正程序的业务逻辑' },
        { text: '只检查语法，从不执行代码' }
      ],
      explain: '解释器读取 Python 源代码，边翻译边执行。它会在运行前检查语法，但不会替你修正逻辑错误，也不会把源码变成文档。'
    },
    {
      id: 'ch00-q3', ch: 'ch00', kp: 'ch00-3', tier: 1, type: 'mcq', difficulty: 1,
      tags: ['error'],
      stem: '运行 <code>print("hi"</code> 时少写了一个右括号，这属于哪一类错误？',
      options: [
        { text: '语法错误', correct: true },
        { text: '运行时错误' },
        { text: '语义（逻辑）错误' },
        { text: '这不是错误' }
      ],
      explain: 'Python 在执行前要先解析代码，括号不配对会让解析失败，抛出 SyntaxError，程序根本不会开始运行。运行时错误发生在执行过程中，语义错误则是程序能跑但结果不符合意图。'
    },
    {
      id: 'ch00-q4', ch: 'ch00', kp: 'ch00-3', tier: 2, type: 'mcq', difficulty: 2,
      tags: ['error'],
      stem: '程序能正常运行，但把「平均分」算成了「总分」，这属于哪一类错误？',
      options: [
        { text: '语义（逻辑）错误', correct: true },
        { text: '语法错误' },
        { text: '运行时错误' },
        { text: '缩进错误' }
      ],
      explain: '程序没有崩溃，也没有违反语法，只是计算结果不符合真实意图，这叫语义错误或逻辑错误。语法错误会让程序无法启动，运行时错误会在执行中抛出异常，缩进错误本质上也是语法错误。'
    },
    {
      id: 'ch00-q5', ch: 'ch00', kp: 'ch00-4', tier: 1, type: 'predict', difficulty: 1,
      tags: ['output'], codeTitle: 'Python',
      stem: '阅读下面的程序，逐行写出它的输出。',
      code: `print('Hello, Python!')
print(2 + 3)
print('2 + 3')`,
      answer: `Hello, Python!
5
2 + 3`,
      explain: '第一行把字符串原样打印。第二行没有引号，先计算 2 + 3 得到 5；第三行的 2 + 3 在引号里，只是普通文本，不再参与计算。'
    },
    {
      id: 'ch00-q6', ch: 'ch00', kp: 'ch00-4', tier: 1, type: 'predict', difficulty: 1,
      tags: ['trace'], codeTitle: 'Python',
      stem: '阅读下面的程序，逐行写出它的输出。',
      code: `print('one')
# print('two')
print('three')`,
      answer: `one
three`,
      explain: '以 # 开头的内容是注释，解释器会忽略整行，所以中间那行不会产生输出。程序只执行第一行和第三行，依次打印 one 和 three。'
    },
    {
      id: 'ch00-q7', ch: 'ch00', kp: 'ch00-4', tier: 1, type: 'predict', difficulty: 1,
      tags: ['output'], codeTitle: 'Python',
      stem: '阅读下面的程序，逐行写出它的输出。',
      code: `print(1 + 2 * 3)
print((1 + 2) * 3)`,
      answer: `7
9`,
      explain: '乘法优先级高于加法，所以第一行先算 2 * 3 得 6，再加 1 得 7。第二行用括号强制先算 1 + 2 得 3，再乘 3 得 9。'
    },
    {
      id: 'ch00-q8', ch: 'ch00', kp: 'ch00-2', tier: 1, type: 'fill', difficulty: 1,
      tags: ['concept'],
      stem: '把源代码逐行翻译并执行的程序，中文通常称为 ____。',
      answer: '解释器',
      accept: ['解释器', 'Python 解释器', 'interpreter'],
      explain: '解释器负责读取源代码、翻译并执行。Python 常被称为解释型语言，就是因为它的代码由解释器逐行处理。'
    },
    {
      id: 'ch00-q9', ch: 'ch00', kp: 'ch00-3', tier: 2, type: 'multi', difficulty: 2,
      tags: ['error'],
      stem: '（多选）下列哪些属于本课介绍的常见错误类型？',
      options: [
        { text: '语法错误', correct: true },
        { text: '运行时错误', correct: true },
        { text: '语义（逻辑）错误', correct: true },
        { text: '字体错误' }
      ],
      explain: '本课把错误分成语法错误、运行时错误和语义错误三类。语法错误让程序无法解析，运行时错误在执行中抛出异常，语义错误则是结果不对；字体错误不是程序错误的分类。'
    },

    /* ch01 · 第一个 Python 程序 */
    {
      id: 'ch01-q1', ch: 'ch01', kp: 'ch01-1', tier: 1, type: 'mcq', difficulty: 1,
      tags: ['concept'],
      stem: '在 <code>print("Hello")</code> 中，括号里的 <code>"Hello"</code> 称为什么？',
      options: [
        { text: '函数名' },
        { text: '实参（参数）', correct: true },
        { text: '返回值' },
        { text: '注释' }
      ],
      explain: 'print 是函数名，"Hello" 是调用时传进去的实参。函数根据实参完成工作，返回值是函数执行后交回的结果；注释则以 # 开头。'
    },
    {
      id: 'ch01-q2', ch: 'ch01', kp: 'ch01-4', tier: 1, type: 'mcq', difficulty: 1,
      tags: ['syntax'],
      stem: '关于 Python 的单行注释，下列哪一项正确？',
      options: [
        { text: '以 # 开头，直到行尾的内容会被忽略', correct: true },
        { text: '只能写在文件的第一行' },
        { text: '会被 print 原样输出' },
        { text: '必须用 // 开头' }
      ],
      explain: 'Python 的单行注释从 # 开始，到这一行结束为止都不参与执行。它可以出现在任意位置，也不会被 print 输出；// 不是 Python 的注释符号。'
    },
    {
      id: 'ch01-q3', ch: 'ch01', kp: 'ch01-5', tier: 2, type: 'mcq', difficulty: 2,
      tags: ['syntax'],
      stem: 'Python 用缩进表示代码块，缩进的主要作用是什么？',
      options: [
        { text: '让代码更漂亮，删掉也不影响运行' },
        { text: '表示哪些语句属于同一个代码块', correct: true },
        { text: '提高程序的运行速度' },
        { text: '把变量自动变成常量' }
      ],
      explain: '缩进在 Python 里是语法的一部分，用来划分代码块，例如 if 或 for 下面哪些语句属于这个分支或循环。缩进错了会直接报 IndentationError；缩进不会改变运行速度，也不会改变变量的性质。'
    },
    {
      id: 'ch01-q4', ch: 'ch01', kp: 'ch01-2', tier: 1, type: 'mcq', difficulty: 1,
      tags: ['output'],
      stem: '<code>print("a", "b")</code> 的输出是什么？',
      options: [
        { text: 'a b', correct: true },
        { text: 'ab' },
        { text: '"a", "b"' },
        { text: 'a,b' }
      ],
      explain: 'print 用逗号分隔多个实参时，会依次输出并在它们之间插入一个空格，所以结果是 a b。若写成 "a" + "b" 才会得到没有空格的 ab。'
    },
    {
      id: 'ch01-q5', ch: 'ch01', kp: 'ch01-1', tier: 1, type: 'predict', difficulty: 1,
      tags: ['output'], codeTitle: 'Python',
      stem: '阅读下面的程序，逐行写出它的输出。',
      code: `print("Python")
print("is")
print("fun")`,
      answer: `Python
is
fun`,
      explain: '三次 print 调用各自输出一个字符串，每次输出后自动换行，因此得到三行。字符串两端的引号只是标记，不会被打印出来。'
    },
    {
      id: 'ch01-q6', ch: 'ch01', kp: 'ch01-3', tier: 1, type: 'predict', difficulty: 1,
      tags: ['output'], codeTitle: 'Python',
      stem: '阅读下面的程序，逐行写出它的输出。',
      code: `print(3 * 4)
print("3 * 4")
print(10 - 2 * 3)`,
      answer: `12
3 * 4
4`,
      explain: '第一行没有引号，3 * 4 被计算成 12。第二行的 3 * 4 在引号里，只是普通文本。第三行先算乘法 2 * 3 得 6，再算 10 - 6 得 4。'
    },
    {
      id: 'ch01-q7', ch: 'ch01', kp: 'ch01-4', tier: 2, type: 'predict', difficulty: 2,
      tags: ['trace'], codeTitle: 'Python',
      stem: '阅读下面的程序，逐行写出它的输出。',
      code: `x = 5
y = x + 2
print(y)
x = 10
print(y)`,
      answer: `7
7`,
      explain: 'y 在第二行被赋值为 x + 2，当时 x 是 5，所以 y 变成 7。后面虽然把 x 改成了 10，但 y 不会自动重新计算，仍然是 7。'
    },
    {
      id: 'ch01-q8', ch: 'ch01', kp: 'ch01-4', tier: 1, type: 'fill', difficulty: 1,
      tags: ['syntax'],
      stem: 'Python 的单行注释以 ____ 开头。',
      answer: '#',
      accept: ['#', '井号'],
      explain: '在 Python 中，# 后面的内容会被解释器忽略，常用于给代码写说明。它既可以单独占一行，也可以放在代码行的末尾。'
    },
    {
      id: 'ch01-q9', ch: 'ch01', kp: 'ch01-4', tier: 2, type: 'multi', difficulty: 2,
      tags: ['syntax'],
      stem: '（多选）下列哪些是合法的 Python 变量名？',
      options: [
        { text: '<code>score</code>', correct: true },
        { text: '<code>2player</code>' },
        { text: '<code>_total</code>', correct: true },
        { text: '<code>user-name</code>' }
      ],
      explain: '变量名可以由字母、数字和下划线组成，但不能以数字开头，所以 score 和 _total 合法，2player 不合法。user-name 中的减号会被当成运算符，不能组成一个变量名。'
    },

    /* ch02 · 变量、表达式与类型 */
    {
      id: 'ch02-q1', ch: 'ch02', kp: 'ch02-4', tier: 1, type: 'mcq', difficulty: 1,
      tags: ['operator'],
      stem: '在 Python 3 中，表达式 <code>7 / 2</code> 的结果是什么？',
      options: [
        { text: '<code>3</code>，整数' },
        { text: '<code>3.5</code>，浮点数', correct: true },
        { text: '<code>3.0</code>，浮点数' },
        { text: '会报错' }
      ],
      explain: 'Python 3 的 / 永远执行真除法，结果一定是浮点数，所以 7 / 2 得到 3.5。想要向下取整的整数除法要用 //，7 // 2 才是 3。'
    },
    {
      id: 'ch02-q2', ch: 'ch02', kp: 'ch02-4', tier: 3, type: 'mcq', difficulty: 3,
      tags: ['operator'],
      stem: '表达式 <code>-7 % 3</code> 的结果是多少？',
      options: [
        { text: '<code>-1</code>' },
        { text: '<code>1</code>' },
        { text: '<code>2</code>', correct: true },
        { text: '<code>-2</code>' }
      ],
      explain: 'Python 的取模结果与除数同号，并且满足「被除数 = 除数 × 商 + 余数」。这里 -7 // 3 是 -3，-7 = 3 × (-3) + 2，所以余数是 2。'
    },
    {
      id: 'ch02-q3', ch: 'ch02', kp: 'ch02-6', tier: 2, type: 'mcq', difficulty: 2,
      tags: ['input'],
      stem: '从键盘读入一个整数，下列写法正确的是？',
      options: [
        { text: '<code>int(input())</code>', correct: true },
        { text: '<code>input(int())</code>' },
        { text: '<code>str(input())</code>' },
        { text: '<code>input() + 0</code>' }
      ],
      explain: 'input() 返回的永远是字符串，要得到整数必须用 int() 包在它的外面。input(int()) 会先调用没有参数的 int()，直接抛出 TypeError；str(input()) 仍然得到字符串；字符串直接加 0 也会报 TypeError。'
    },
    {
      id: 'ch02-q4', ch: 'ch02', kp: 'ch02-5', tier: 2, type: 'mcq', difficulty: 2,
      tags: ['string'],
      stem: '已知 <code>x = 5</code>，下列哪一行会输出 <code>x = 5</code>？',
      options: [
        { text: '<code>print(f"x = {x}")</code>', correct: true },
        { text: '<code>print("x = {x}")</code>' },
        { text: '<code>print(f"x = x")</code>' },
        { text: '<code>print("x = " + x)</code>' }
      ],
      explain: 'f-string 前面的 f 表示字符串里的大括号要替换成表达式的值，所以第一项会输出 x = 5。第二项没有 f，大括号只是普通字符；第三项的大括号里没有变量；第四项把字符串和整数相加，会报 TypeError。'
    },
    {
      id: 'ch02-q5', ch: 'ch02', kp: 'ch02-4', tier: 2, type: 'predict', difficulty: 2,
      tags: ['operator'], codeTitle: 'Python',
      stem: '阅读下面的程序，逐行写出它的输出。',
      code: `print(7 // 2)
print(-7 // 2)
print(7 / 2)`,
      answer: `3
-4
3.5`,
      explain: '// 是向下取整的整数除法，7 // 2 得 3；-7 // 2 的真实结果是 -3.5，向下取整得到 -4，不是向零截断的 -3。/ 是真除法，7 / 2 得到浮点数 3.5。'
    },
    {
      id: 'ch02-q6', ch: 'ch02', kp: 'ch02-3', tier: 1, type: 'predict', difficulty: 1,
      tags: ['operator'], codeTitle: 'Python',
      stem: '阅读下面的程序，逐行写出它的输出。',
      code: `print(2 + 3 * 4)
print((2 + 3) * 4)
print(2 ** 3)`,
      answer: `14
20
8`,
      explain: '第一行先算乘法 3 * 4 得 12，再加 2 得 14。第二行括号优先，先算 2 + 3 得 5，再乘 4 得 20。** 表示乘方，2 ** 3 就是 2 的 3 次方，等于 8。'
    },
    {
      id: 'ch02-q7', ch: 'ch02', kp: 'ch02-5', tier: 2, type: 'predict', difficulty: 2,
      tags: ['type'], codeTitle: 'Python',
      stem: '阅读下面的程序，逐行写出它的输出。',
      code: `a = "3"
b = 4
print(a * 2)
print(int(a) + b)`,
      answer: `33
7`,
      explain: 'a 是字符串 "3"，字符串乘 2 表示重复两次，得到 "33"。int(a) 把字符串转成整数 3，再和 4 相加，得到整数 7。'
    },
    {
      id: 'ch02-q8', ch: 'ch02', kp: 'ch02-4', tier: 1, type: 'fill', difficulty: 1,
      tags: ['operator'],
      stem: '<code>17 // 5</code> 的值是 ____。',
      answer: '3',
      accept: ['3'],
      explain: '// 做整数除法并向下取整，17 ÷ 5 = 3.4，向下取整得到 3。余数则由 17 % 5 得到 2。'
    },
    {
      id: 'ch02-q9', ch: 'ch02', kp: 'ch02-2', tier: 2, type: 'multi', difficulty: 2,
      tags: ['boolean'],
      stem: '（多选）下列哪些表达式的结果是 <code>True</code>？',
      options: [
        { text: '<code>3 &lt; 5</code>', correct: true },
        { text: '<code>"a" == "A"</code>' },
        { text: '<code>not (2 &gt; 1)</code>' },
        { text: '<code>7 % 2 == 1</code>', correct: true }
      ],
      explain: '3 &lt; 5 显然成立；7 % 2 的余数是 1，所以 7 % 2 == 1 也成立。字符串比较区分大小写，"a" 和 "A" 不相等；2 &gt; 1 为 True，not 之后变成 False。'
    },

    /* ch03 · 条件与循环 */
    {
      id: 'ch03-q1', ch: 'ch03', kp: 'ch03-2', tier: 2, type: 'mcq', difficulty: 3,
      tags: ['boolean'],
      stem: '当 <code>x = 0</code> 时，执行 <code>print(x != 0 and 10 / x &gt; 2)</code> 会发生什么？',
      options: [
        { text: '输出 <code>False</code>', correct: true },
        { text: '输出 <code>True</code>' },
        { text: '抛出 <code>ZeroDivisionError</code>' },
        { text: '输出 <code>0</code>' }
      ],
      explain: 'and 从左往右求值，并且具有短路特性：左边 x != 0 为 False 时，整个 and 已经确定为 False，右边的 10 / x 根本不会执行。因此不会除以零，程序输出 False。'
    },
    {
      id: 'ch03-q2', ch: 'ch03', kp: 'ch03-5', tier: 1, type: 'mcq', difficulty: 1,
      tags: ['range'],
      stem: '<code>range(1, 5)</code> 会产生哪些整数？',
      options: [
        { text: '1、2、3、4', correct: true },
        { text: '1、2、3、4、5' },
        { text: '0、1、2、3、4' },
        { text: '1、3、5' }
      ],
      explain: 'range(start, stop) 从 start 开始，到 stop 之前停止，包含 start 但不包含 stop。所以 range(1, 5) 依次产生 1、2、3、4，5 不会出现。'
    },
    {
      id: 'ch03-q3', ch: 'ch03', kp: 'ch03-3', tier: 1, type: 'mcq', difficulty: 2,
      tags: ['branch'],
      stem: '执行下面的代码，会输出什么？<br><code>score = 85</code><br><code>if score &gt;= 90:</code><br><code>&nbsp;&nbsp;&nbsp;&nbsp;print("A")</code><br><code>elif score &gt;= 80:</code><br><code>&nbsp;&nbsp;&nbsp;&nbsp;print("B")</code><br><code>else:</code><br><code>&nbsp;&nbsp;&nbsp;&nbsp;print("C")</code>',
      options: [
        { text: 'A' },
        { text: 'B', correct: true },
        { text: 'C' },
        { text: '什么都不输出' }
      ],
      explain: 'score 是 85，第一个条件 85 &gt;= 90 为 False，程序继续检查 elif。85 &gt;= 80 为 True，于是执行这个分支打印 B；一旦某个分支命中，后面的 else 就不会再执行。'
    },
    {
      id: 'ch03-q4', ch: 'ch03', kp: 'ch03-4', tier: 2, type: 'mcq', difficulty: 2,
      tags: ['loop'],
      stem: '下面的循环会无限执行。要让它正常结束并打印 0、1、2，应该怎样修改？<br><code>i = 0</code><br><code>while i &lt; 3:</code><br><code>&nbsp;&nbsp;&nbsp;&nbsp;print(i)</code>',
      options: [
        { text: '在 <code>print(i)</code> 后面加一行 <code>i += 1</code>', correct: true },
        { text: '把条件改成 <code>i &lt;= 3</code>' },
        { text: '删除 <code>print(i)</code>' },
        { text: '在循环前加一行 <code>i = 3</code>' }
      ],
      explain: 'while 循环必须让条件有机会变成 False，这里缺少对 i 的更新，i 永远是 0。加上 i += 1 后，i 会依次变成 1、2、3，循环在 i 为 3 时结束。改成 i &lt;= 3 仍然是死循环，因为 i 从不增加，会一直打印 0；删除 print 也仍然死循环；i = 3 会让循环一次也不执行。'
    },
    {
      id: 'ch03-q5', ch: 'ch03', kp: 'ch03-6', tier: 1, type: 'predict', difficulty: 1,
      tags: ['loop'], codeTitle: 'Python',
      stem: '阅读下面的程序，写出它打印的数字。',
      code: `total = 0
for i in range(1, 5):
    total += i
print(total)`,
      answer: `10`,
      explain: 'range(1, 5) 依次给出 1、2、3、4。total 从 0 开始，每次把当前的 i 累加进去：0 + 1 + 2 + 3 + 4 = 10，循环结束后打印 10。'
    },
    {
      id: 'ch03-q6', ch: 'ch03', kp: 'ch03-6', tier: 2, type: 'predict', difficulty: 2,
      tags: ['loop'], codeTitle: 'Python',
      stem: '阅读下面的程序，逐行写出它的输出。',
      code: `for i in range(5):
    if i == 3:
        break
    print(i)`,
      answer: `0
1
2`,
      explain: '循环依次取 0、1、2、3、4。当 i 等于 3 时，break 立即结束整个循环，所以 3 和后面的 4 都不会被打印。在此之前已经打印了 0、1、2。'
    },
    {
      id: 'ch03-q7', ch: 'ch03', kp: 'ch03-6', tier: 2, type: 'predict', difficulty: 2,
      tags: ['loop'], codeTitle: 'Python',
      stem: '阅读下面的程序，逐行写出它的输出。',
      code: `i = 0
while i < 6:
    i += 1
    if i % 2 == 0:
        continue
    print(i)`,
      answer: `1
3
5`,
      explain: '每轮先把 i 加 1，再判断是否为偶数。i 为 2、4、6 时 continue 会跳过本轮剩下的 print；i 为 1、3、5 时是奇数，正常打印。i 变成 6 后循环条件不再成立，程序结束。'
    },
    {
      id: 'ch03-q8', ch: 'ch03', kp: 'ch03-5', tier: 2, type: 'fill', difficulty: 2,
      tags: ['range'],
      stem: '<code>range(2, 10, 3)</code> 产生的最后一个数是 ____。',
      answer: '8',
      accept: ['8'],
      explain: 'range(2, 10, 3) 从 2 开始，每次加 3，依次得到 2、5、8，下一次是 11，已经超过 stop 10，所以停止。最后一个数是 8。'
    },
    {
      id: 'ch03-q9', ch: 'ch03', kp: 'ch03-5', tier: 2, type: 'multi', difficulty: 2,
      tags: ['range'],
      stem: '（多选）下列哪些循环会依次输出 0、1、2、3、4？',
      options: [
        { text: '<code>for i in range(5): print(i)</code>', correct: true },
        { text: '<code>for i in range(0, 5): print(i)</code>', correct: true },
        { text: '<code>for i in range(1, 5): print(i)</code>' },
        { text: '<code>for i in range(0, 4): print(i)</code>' }
      ],
      explain: 'range(5) 等价于 range(0, 5)，从 0 到 4 共五个数，所以前两项正确。range(1, 5) 从 1 开始，缺少 0；range(0, 4) 到 4 之前停止，缺少 4。'
    },

    /* ch04 · 函数与分解 */
    {
      id: 'ch04-q1', ch: 'ch04', kp: 'ch04-2', tier: 1, type: 'mcq', difficulty: 1,
      tags: ['function'],
      stem: '一个函数执行到结尾都没有遇到 <code>return</code>，它返回什么？',
      options: [
        { text: '<code>None</code>', correct: true },
        { text: '<code>0</code>' },
        { text: '空字符串 <code>""</code>' },
        { text: '程序会报错' }
      ],
      explain: 'Python 的函数如果没有显式 return，或者 return 后面没有值，默认返回 None。None 表示「没有值」，它不等于 0，也不等于空字符串，而且不会因此报错。'
    },
    {
      id: 'ch04-q2', ch: 'ch04', kp: 'ch04-5', tier: 2, type: 'mcq', difficulty: 2,
      tags: ['function'],
      stem: '已知 <code>def greet(name, greeting="Hello"):</code>，下列哪个调用是合法的？',
      options: [
        { text: '<code>greet("Ada")</code>', correct: true },
        { text: '<code>greet()</code>' },
        { text: '<code>greet("Ada", "Hi", "!")</code>' },
        { text: '<code>greet(greeting="Hi")</code>' }
      ],
      explain: 'greeting 有默认值，调用时可以省略，所以 greet("Ada") 合法，greeting 会自动取 "Hello"。name 没有默认值，必须提供，因此 greet() 和只给 greeting 的调用都缺少 name；三个实参则超过了函数声明的两个参数。'
    },
    {
      id: 'ch04-q3', ch: 'ch04', kp: 'ch04-4', tier: 2, type: 'mcq', difficulty: 3,
      tags: ['scope'],
      stem: '执行下面的代码会发生什么？<br><code>def f():</code><br><code>&nbsp;&nbsp;&nbsp;&nbsp;x = 10</code><br><code>f()</code><br><code>print(x)</code>',
      options: [
        { text: '抛出 <code>NameError</code>', correct: true },
        { text: '输出 <code>10</code>' },
        { text: '输出 <code>None</code>' },
        { text: '输出 <code>0</code>' }
      ],
      explain: '函数内部赋值的 x 是局部变量，只在这次函数调用期间存在。函数返回后局部变量就被销毁，外面的 print(x) 找不到这个名字，于是抛出 NameError。'
    },
    {
      id: 'ch04-q4', ch: 'ch04', kp: 'ch04-6', tier: 2, type: 'mcq', difficulty: 2,
      tags: ['recursion'],
      stem: '写递归函数时，最重要的必备部分是什么？',
      options: [
        { text: '能终止递归的基线条件（base case）', correct: true },
        { text: '必须一次调用自己两次' },
        { text: '必须使用 <code>global</code> 声明' },
        { text: '必须返回字符串' }
      ],
      explain: '递归函数必须有一个不再调用自身的基线条件，否则会一层层调用下去，直到触发 RecursionError。递归每次只调用自己一次也可以；global 和返回字符串都不是递归的必要条件。'
    },
    {
      id: 'ch04-q5', ch: 'ch04', kp: 'ch04-2', tier: 2, type: 'predict', difficulty: 2,
      tags: ['function'], codeTitle: 'Python',
      stem: '阅读下面的程序，逐行写出它的输出。',
      code: `def min_max(nums):
    return min(nums), max(nums)

low, high = min_max([3, 1, 4, 2])
print(low)
print(high)`,
      answer: `1
4`,
      explain: '函数用逗号返回了两个值，实际上返回的是一个元组 (1, 4)。调用处用 low, high 进行元组解包，low 得到 1，high 得到 4，所以两行分别打印 1 和 4。'
    },
    {
      id: 'ch04-q6', ch: 'ch04', kp: 'ch04-4', tier: 3, type: 'predict', difficulty: 3,
      tags: ['scope'], codeTitle: 'Python',
      stem: '阅读下面的程序，逐行写出它的输出。',
      code: `def f(x):
    x = x + 1
    return x

x = 10
print(f(x))
print(x)`,
      answer: `11
10`,
      explain: '调用 f(x) 时，10 被传给参数 x，函数里的 x 是局部名字。函数内部把局部 x 加 1 并返回 11，但这不会改变外面那个 x。函数返回后，外面的 x 仍然是 10。'
    },
    {
      id: 'ch04-q7', ch: 'ch04', kp: 'ch04-6', tier: 3, type: 'predict', difficulty: 3,
      tags: ['recursion'], codeTitle: 'Python',
      stem: '阅读下面的程序，逐行写出它的输出。',
      code: `def fact(n):
    if n <= 1:
        return 1
    return n * fact(n - 1)

print(fact(4))
print(fact(1))`,
      answer: `24
1`,
      explain: 'fact(4) 展开为 4 * fact(3)，再展开为 4 * 3 * fact(2)，继续得到 4 * 3 * 2 * fact(1)。fact(1) 命中基线条件返回 1，所以结果是 24。fact(1) 直接返回 1，因此第二行打印 1。'
    },
    {
      id: 'ch04-q8', ch: 'ch04', kp: 'ch04-1', tier: 1, type: 'fill', difficulty: 1,
      tags: ['syntax'],
      stem: '在 Python 中定义函数使用的关键字是 ____。',
      answer: 'def',
      accept: ['def'],
      explain: '定义函数以 def 开头，后面依次写函数名、参数列表和冒号，函数体则缩进书写。调用函数时直接写函数名加括号，不需要再写 def。'
    },
    {
      id: 'ch04-q9', ch: 'ch04', kp: 'ch04-3', tier: 3, type: 'multi', difficulty: 3,
      tags: ['function'],
      stem: '（多选）关于 <code>return</code> 与 <code>print</code>，下列哪些说法正确？',
      options: [
        { text: '<code>return</code> 把结果交给调用者', correct: true },
        { text: '<code>print</code> 只负责显示，不改变函数的返回值', correct: true },
        { text: '没有 <code>return</code> 的函数返回 <code>None</code>', correct: true },
        { text: '<code>x = print(5)</code> 执行后 <code>x</code> 等于 5' }
      ],
      explain: 'return 的作用是把值送回调用处，print 只是把内容显示到屏幕上，两者不能混用。没有 return 的函数默认返回 None，而 print 本身也返回 None，所以 x = print(5) 会先打印 5，再把 None 赋给 x。'
    },

    /* ch05 · 图像与二维循环 */
    {
      id: 'ch05-q1', ch: 'ch05', kp: 'ch05-1', tier: 1, type: 'mcq', difficulty: 1,
      tags: ['image'],
      stem: '在常见的图像坐标系统中，像素 <code>(0, 0)</code> 位于图像的哪个位置？',
      options: [
        { text: '左上角', correct: true },
        { text: '左下角' },
        { text: '右上角' },
        { text: '正中心' }
      ],
      explain: '图像通常按「行」从上到下存储，所以 y 轴向下增长，原点 (0, 0) 在左上角。x 轴向右增长，越往右列号越大，越往下行号越大。'
    },
    {
      id: 'ch05-q2', ch: 'ch05', kp: 'ch05-2', tier: 2, type: 'mcq', difficulty: 2,
      tags: ['loop'],
      stem: '要用双层循环按「一行一行」的顺序访问宽 <code>w</code>、高 <code>h</code> 的像素，外层循环通常遍历什么？',
      options: [
        { text: '行号 <code>y</code>，内层再遍历列号 <code>x</code>', correct: true },
        { text: '列号 <code>x</code>，内层再遍历行号 <code>y</code>' },
        { text: 'RGB 三个颜色通道' },
        { text: '像素的总数，不需要内层循环' }
      ],
      explain: '按行扫描时，外层固定一行 y，内层把这一行的所有 x 走一遍，因此外层是 y、内层是 x。反过来先遍历 x 会变成按列扫描；颜色通道和像素总数都不能替代两层坐标。'
    },
    {
      id: 'ch05-q3', ch: 'ch05', kp: 'ch05-3', tier: 1, type: 'mcq', difficulty: 1,
      tags: ['image'],
      stem: 'RGB 颜色 <code>(255, 0, 0)</code> 表示什么颜色？',
      options: [
        { text: '红色', correct: true },
        { text: '绿色' },
        { text: '蓝色' },
        { text: '白色' }
      ],
      explain: 'RGB 的三个分量依次是红、绿、蓝。(255, 0, 0) 表示红色通道拉满、绿和蓝都是 0，所以是纯红色。白色需要三个分量都为 255，蓝色则是 (0, 0, 255)。'
    },
    {
      id: 'ch05-q4', ch: 'ch05', kp: 'ch05-5', tier: 2, type: 'mcq', difficulty: 2,
      tags: ['image'],
      stem: '对每个颜色通道做「反色」处理，正确的公式是哪个？',
      options: [
        { text: '<code>new = 255 - old</code>', correct: true },
        { text: '<code>new = old - 255</code>' },
        { text: '<code>new = old / 255</code>' },
        { text: '<code>new = 0</code>' }
      ],
      explain: '每个通道的取值是 0 到 255，反色就是把「亮」变成「暗」、把「暗」变成「亮」，所以用 255 减去原值。old - 255 会得到负数，old / 255 会得到 0 到 1 的小数，new = 0 则会把所有像素变成黑色。'
    },
    {
      id: 'ch05-q5', ch: 'ch05', kp: 'ch05-2', tier: 2, type: 'predict', difficulty: 2,
      tags: ['loop'], codeTitle: 'Python',
      stem: '阅读下面的程序，逐行写出它的输出。',
      code: `for y in range(2):
    for x in range(3):
        print(x, y)`,
      answer: `0 0
1 0
2 0
0 1
1 1
2 1`,
      explain: '外层 y 先取 0，内层 x 依次取 0、1、2，打印三行；然后外层 y 取 1，内层再完整走一遍 0、1、2。print(x, y) 先输出 x 再输出 y，中间自动加一个空格。'
    },
    {
      id: 'ch05-q6', ch: 'ch05', kp: 'ch05-2', tier: 2, type: 'predict', difficulty: 2,
      tags: ['loop'], codeTitle: 'Python',
      stem: '阅读下面的程序，写出它打印的结果。',
      code: `grid = [
    [1, 2, 3],
    [4, 5, 6]
]
total = 0
for row in grid:
    for value in row:
        total += value
print(total)`,
      answer: `21`,
      explain: '外层 for 依次取出每一行，内层 for 再取出这一行里的每个数。total 把 1 到 6 全部累加：1 + 2 + 3 + 4 + 5 + 6 = 21。'
    },
    {
      id: 'ch05-q7', ch: 'ch05', kp: 'ch05-2', tier: 3, type: 'predict', difficulty: 3,
      tags: ['loop'], codeTitle: 'Python',
      stem: '阅读下面的程序，写出它打印的结果。',
      code: `width = 3
height = 2
count = 0
for y in range(height):
    for x in range(width):
        if x == y:
            count += 1
print(count)`,
      answer: `2`,
      explain: '两层循环访问 2 行 × 3 列共 6 个坐标。满足 x == y 的只有 (0, 0) 和 (1, 1)，因为 y 最大只到 1；坐标 (2, 2) 不存在。因此 count 从 0 加了两次，最后打印 2。'
    },
    {
      id: 'ch05-q8', ch: 'ch05', kp: 'ch05-3', tier: 1, type: 'fill', difficulty: 1,
      tags: ['image'],
      stem: 'RGB 三个颜色通道中，每个通道的取值范围是 0 到 ____。',
      answer: '255',
      accept: ['255'],
      explain: '一个颜色通道通常用 8 位存储，能表示 0 到 255 共 256 个亮度级别。0 表示该通道完全不亮，255 表示该通道最亮。'
    },
    {
      id: 'ch05-q9', ch: 'ch05', kp: 'ch05-1', tier: 2, type: 'multi', difficulty: 2,
      tags: ['image'],
      stem: '（多选）关于像素与坐标，下列哪些说法正确？',
      options: [
        { text: '宽 4、高 3 的图像一共有 12 个像素', correct: true },
        { text: '坐标 <code>(0, 0)</code> 通常表示左上角', correct: true },
        { text: '坐标 <code>(x, y)</code> 中的 <code>x</code> 通常表示列号', correct: true },
        { text: '图像坐标通常从 1 开始编号' }
      ],
      explain: '像素总数等于宽乘高，4 × 3 = 12。常见图像坐标以左上角为 (0, 0)，x 向右表示列、y 向下表示行，编号从 0 开始而不是从 1 开始。'
    },

    /* ch06 · 字符串与切片 */
    {
      id: 'ch06-q1', ch: 'ch06', kp: 'ch06-2', tier: 1, type: 'mcq', difficulty: 1,
      tags: ['slice'],
      stem: '已知 <code>s = "Python"</code>，<code>s[1:4]</code> 的结果是什么？',
      options: [
        { text: '<code>"yth"</code>', correct: true },
        { text: '<code>"ytho"</code>' },
        { text: '<code>"Pyt"</code>' },
        { text: '<code>"tho"</code>' }
      ],
      explain: '切片 s[start:stop] 包含 start 位置，但不包含 stop 位置。s[1:4] 取下标 1、2、3 三个字符，也就是 y、t、h，所以结果是 "yth"。'
    },
    {
      id: 'ch06-q2', ch: 'ch06', kp: 'ch06-2', tier: 1, type: 'mcq', difficulty: 1,
      tags: ['slice'],
      stem: '已知 <code>s = "Python"</code>，<code>s[::-1]</code> 的结果是什么？',
      options: [
        { text: '原字符串 <code>"Python"</code>' },
        { text: '反转后的字符串 <code>"nohtyP"</code>', correct: true },
        { text: '只包含首尾字符的 <code>"Pn"</code>' },
        { text: '会报错' }
      ],
      explain: '切片省略 start 和 stop 表示取整个字符串。步长 -1 表示从后往前取，所以 s[::-1] 把整个字符串反转，得到 "nohtyP"。'
    },
    {
      id: 'ch06-q3', ch: 'ch06', kp: 'ch06-6', tier: 3, type: 'mcq', difficulty: 3,
      tags: ['string'],
      stem: '执行 <code>s = "abc"</code> 后，再执行 <code>s[0] = "A"</code> 会发生什么？',
      options: [
        { text: '抛出 <code>TypeError</code>', correct: true },
        { text: '<code>s</code> 变成 <code>"Abc"</code>' },
        { text: '修改被静默忽略，<code>s</code> 仍是 <code>"abc"</code>' },
        { text: '抛出 <code>SyntaxError</code>' }
      ],
      explain: '字符串是不可变对象，创建后不能通过下标修改其中的字符，所以赋值会抛出 TypeError。若想得到 "Abc"，必须用切片和拼接重新构造一个新字符串，例如 "A" + s[1:]。'
    },
    {
      id: 'ch06-q4', ch: 'ch06', kp: 'ch06-1', tier: 1, type: 'predict', difficulty: 1,
      tags: ['slice'], codeTitle: 'Python',
      stem: '阅读下面的程序，逐行写出它的输出。',
      code: `s = "Python"
print(s[0], s[-1])
print(s[1:4])
print(s[:3])
print(s[3:])`,
      answer: `P n
yth
Pyt
hon`,
      explain: 's[0] 是第一个字符 P，s[-1] 是最后一个字符 n。s[1:4] 取下标 1 到 3，得到 yth；s[:3] 从开头取到下标 2，得到 Pyt；s[3:] 从下标 3 取到结尾，得到 hon。'
    },
    {
      id: 'ch06-q5', ch: 'ch06', kp: 'ch06-2', tier: 2, type: 'predict', difficulty: 2,
      tags: ['slice'], codeTitle: 'Python',
      stem: '阅读下面的程序，逐行写出它的输出。',
      code: `s = "abcdef"
print(s[::2])
print(s[1::2])
print(s[-2:])`,
      answer: `ace
bdf
ef`,
      explain: 's[::2] 从开头开始每隔一个字符取一个，得到下标 0、2、4 的 a、c、e。s[1::2] 从下标 1 开始同样隔一个取一个，得到 b、d、f。s[-2:] 从倒数第二个字符取到结尾，得到 ef。'
    },
    {
      id: 'ch06-q6', ch: 'ch06', kp: 'ch06-5', tier: 2, type: 'predict', difficulty: 2,
      tags: ['string'], codeTitle: 'Python',
      stem: '阅读下面的程序，逐行写出它的输出。',
      code: `words = "red,green,blue".split(",")
print(words)
print(len(words))
print("-".join(words))`,
      answer: `['red', 'green', 'blue']
3
red-green-blue`,
      explain: 'split(",") 按逗号把字符串切成三个单词，返回列表，打印时保留列表的方括号和引号。len(words) 统计列表元素个数，得到 3。join 用 "-" 把三个单词重新连接成一个字符串，得到 red-green-blue。'
    },
    {
      id: 'ch06-q7', ch: 'ch06', kp: 'ch06-3', tier: 1, type: 'fill', difficulty: 1,
      tags: ['string'],
      stem: '<code>len("Python")</code> 的值是 ____。',
      answer: '6',
      accept: ['6'],
      explain: 'len 返回序列中元素的个数。字符串 "Python" 有 P、y、t、h、o、n 六个字符，所以长度是 6，最后一个字符的下标是 5。'
    },
    {
      id: 'ch06-q8', ch: 'ch06', kp: 'ch06-2', tier: 1, type: 'fill', difficulty: 1,
      tags: ['slice'],
      stem: '<code>"abc"[::-1]</code> 的结果是 ____。',
      answer: 'cba',
      accept: ['cba'],
      explain: '步长为 -1 时切片从后往前取，省略起点和终点表示取整个字符串。因此 "abc" 会被反转成 "cba"。'
    },
    {
      id: 'ch06-q9', ch: 'ch06', kp: 'ch06-2', tier: 3, type: 'multi', difficulty: 3,
      tags: ['slice'],
      stem: '（多选）已知 <code>s = "Python"</code>，下列哪些表达式的结果是 <code>"Py"</code>？',
      options: [
        { text: '<code>s[:2]</code>', correct: true },
        { text: '<code>s[0:2]</code>', correct: true },
        { text: '<code>s[1:3]</code>' },
        { text: '<code>s[-6:-4]</code>', correct: true }
      ],
      explain: 's[:2] 和 s[0:2] 都取下标 0、1，得到 P、y。s[-6:-4] 从倒数第 6 个字符开始，到倒数第 4 个之前结束，同样对应 P、y。s[1:3] 取的是下标 1、2，结果是 yt。'
    },

    /* ch07 · 列表与文件 */
    {
      id: 'ch07-q1', ch: 'ch07', kp: 'ch07-4', tier: 2, type: 'mcq', difficulty: 2,
      tags: ['list'],
      stem: '执行 <code>result = nums.sort()</code> 后，<code>result</code> 的值是什么？',
      options: [
        { text: '<code>None</code>', correct: true },
        { text: '排序后的新列表' },
        { text: '原来的 <code>nums</code> 列表' },
        { text: '<code>True</code>' }
      ],
      explain: 'list.sort() 是原地排序，直接修改 nums，并且返回 None。它不会创建新列表；如果想要一个排好序的新列表，应使用 sorted(nums)。'
    },
    {
      id: 'ch07-q2', ch: 'ch07', kp: 'ch07-5', tier: 2, type: 'mcq', difficulty: 2,
      tags: ['alias'],
      stem: '执行下面的代码后，<code>a</code> 是什么？<br><code>a = [1, 2]</code><br><code>b = a</code><br><code>b.append(3)</code><br><code>print(a)</code>',
      options: [
        { text: '<code>[1, 2, 3]</code>', correct: true },
        { text: '<code>[1, 2]</code>' },
        { text: '<code>[3]</code>' },
        { text: '会报错' }
      ],
      explain: 'b = a 没有复制列表，只是让 b 和 a 指向同一个列表对象。通过 b 追加 3，修改的就是那个共同对象，所以 a 也会看到 3。想得到独立副本，可以写 b = a[:] 或 b = list(a)。'
    },
    {
      id: 'ch07-q3', ch: 'ch07', kp: 'ch07-6', tier: 3, type: 'mcq', difficulty: 3,
      tags: ['file'],
      stem: '阅读下面的代码，程序会输出什么？<br><code>try:</code><br><code>&nbsp;&nbsp;&nbsp;&nbsp;with open("missing.txt") as f:</code><br><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;text = f.read()</code><br><code>except FileNotFoundError:</code><br><code>&nbsp;&nbsp;&nbsp;&nbsp;print("no file")</code>',
      options: [
        { text: '输出 <code>no file</code>', correct: true },
        { text: '程序崩溃并显示 <code>FileNotFoundError</code>' },
        { text: '自动创建 <code>missing.txt</code>' },
        { text: '输出空字符串' }
      ],
      explain: 'open 以默认的只读模式打开不存在的文件，会抛出 FileNotFoundError，这个异常被 except 分支接住，于是打印 no file，程序不会崩溃。with 只负责在结束时关闭文件，不会自动创建文件；要创建文件得用 "w" 模式。'
    },
    {
      id: 'ch07-q4', ch: 'ch07', kp: 'ch07-2', tier: 1, type: 'predict', difficulty: 1,
      tags: ['list'], codeTitle: 'Python',
      stem: '阅读下面的程序，逐行写出它的输出。',
      code: `nums = [3, 1, 2]
nums.append(4)
print(nums)
print(nums.pop())
print(nums)`,
      answer: `[3, 1, 2, 4]
4
[3, 1, 2]`,
      explain: 'append(4) 把 4 加到列表末尾，所以第一次打印是 [3, 1, 2, 4]。pop() 删除并返回最后一个元素 4，因此第二行打印 4，第三行打印剩下的 [3, 1, 2]。'
    },
    {
      id: 'ch07-q5', ch: 'ch07', kp: 'ch07-4', tier: 2, type: 'predict', difficulty: 2,
      tags: ['list'], codeTitle: 'Python',
      stem: '阅读下面的程序，逐行写出它的输出。',
      code: `nums = [3, 1, 2]
result = nums.sort()
print(nums)
print(result)`,
      answer: `[1, 2, 3]
None`,
      explain: 'nums.sort() 直接对 nums 原地排序，把它变成 [1, 2, 3]，但方法本身的返回值是 None。result 接收到的就是 None，所以第二行打印 None。'
    },
    {
      id: 'ch07-q6', ch: 'ch07', kp: 'ch07-5', tier: 3, type: 'predict', difficulty: 3,
      tags: ['alias'], codeTitle: 'Python',
      stem: '阅读下面的程序，逐行写出它的输出。',
      code: `a = [1, 2]
b = a
b.append(3)
print(a)
c = a[:]
c.append(4)
print(a)`,
      answer: `[1, 2, 3]
[1, 2, 3]`,
      explain: 'b = a 让两个名字指向同一个列表，所以通过 b 追加 3 后，a 也变成 [1, 2, 3]。c = a[:] 创建了一个浅拷贝，c.append(4) 只修改副本，因此 a 仍然是 [1, 2, 3]。'
    },
    {
      id: 'ch07-q7', ch: 'ch07', kp: 'ch07-2', tier: 1, type: 'fill', difficulty: 1,
      tags: ['list'],
      stem: '<code>[10, 20, 30].pop()</code> 的返回值是 ____。',
      answer: '30',
      accept: ['30'],
      explain: 'pop() 不带参数时删除并返回列表的最后一个元素。这里最后一个元素是 30，所以返回 30，同时原列表会变成 [10, 20]。'
    },
    {
      id: 'ch07-q8', ch: 'ch07', kp: 'ch07-6', tier: 1, type: 'fill', difficulty: 1,
      tags: ['file'],
      stem: '以「追加」模式打开文件 <code>"log.txt"</code>，<code>open</code> 的 mode 参数应写 ____。',
      answer: 'a',
      accept: ['a', "'a'", '"a"'],
      explain: '文件模式 "a" 表示 append，在文件末尾追加内容，不会清空原文件。若用 "w" 会覆盖原内容，"r" 只能读，不能写。'
    },
    {
      id: 'ch07-q9', ch: 'ch07', kp: 'ch07-2', tier: 2, type: 'multi', difficulty: 2,
      tags: ['list'],
      stem: '（多选）下列哪些操作会原地修改列表 <code>nums</code>？',
      options: [
        { text: '<code>nums.append(5)</code>', correct: true },
        { text: '<code>nums.sort()</code>', correct: true },
        { text: '<code>sorted(nums)</code>' },
        { text: '<code>nums.reverse()</code>', correct: true }
      ],
      explain: 'append、sort、reverse 都是列表的原地方法，会直接改变 nums 本身，并且都返回 None。sorted(nums) 是内置函数，返回一个排好序的新列表，不会修改原来的 nums。'
    },

    /* ch08 · 字典与计数 */
    {
      id: 'ch08-q1', ch: 'ch08', kp: 'ch08-2', tier: 1, type: 'mcq', difficulty: 1,
      tags: ['dict'],
      stem: '已知 <code>d = {"a": 1}</code>，执行 <code>d.get("x")</code> 会得到什么？',
      options: [
        { text: '<code>None</code>', correct: true },
        { text: '抛出 <code>KeyError</code>' },
        { text: '<code>0</code>' },
        { text: '空字符串' }
      ],
      explain: 'get 在键不存在时不会报错，而是返回 None；如果提供了第二个参数，就返回那个默认值。直接写 d["x"] 才会抛出 KeyError。'
    },
    {
      id: 'ch08-q2', ch: 'ch08', kp: 'ch08-2', tier: 2, type: 'mcq', difficulty: 2,
      tags: ['dict'],
      stem: '执行下面的代码后，<code>d["a"]</code> 是多少？<br><code>d = {"a": 1}</code><br><code>d.setdefault("a", 99)</code>',
      options: [
        { text: '<code>1</code>', correct: true },
        { text: '<code>99</code>' },
        { text: '<code>None</code>' },
        { text: '会抛出 <code>KeyError</code>' }
      ],
      explain: 'setdefault 先检查键是否存在：存在就直接返回原来的值，不会用新值覆盖。因为 "a" 已经存在，所以 d["a"] 仍然是 1，99 不会被写入。'
    },
    {
      id: 'ch08-q3', ch: 'ch08', kp: 'ch08-4', tier: 2, type: 'mcq', difficulty: 2,
      tags: ['dict'],
      stem: '计数时常用 <code>counts[word] = counts.get(word, 0) + 1</code>，其中 <code>get(word, 0)</code> 的作用是什么？',
      options: [
        { text: '键存在时返回它的值，不存在时返回 0', correct: true },
        { text: '删除 word 这个键' },
        { text: '把 word 的值设为 0' },
        { text: '键不存在时抛出 <code>KeyError</code>' }
      ],
      explain: 'get(word, 0) 在字典里查找 word：找到就返回当前计数，找不到就返回默认值 0。这样第一次遇到某个单词时也能从 0 加 1，不会因为键不存在而报错。'
    },
    {
      id: 'ch08-q4', ch: 'ch08', kp: 'ch08-2', tier: 1, type: 'predict', difficulty: 1,
      tags: ['dict'], codeTitle: 'Python',
      stem: '阅读下面的程序，逐行写出它的输出。',
      code: `d = {"a": 1, "b": 2}
print(d["a"])
print(d.get("c", 0))
print(len(d))`,
      answer: `1
0
2`,
      explain: 'd["a"] 直接取出键 a 对应的值 1。get("c", 0) 在键 c 不存在时返回默认值 0。len(d) 统计字典中键值对的数量，原来有 a、b 两个，所以是 2。'
    },
    {
      id: 'ch08-q5', ch: 'ch08', kp: 'ch08-4', tier: 2, type: 'predict', difficulty: 2,
      tags: ['dict'], codeTitle: 'Python',
      stem: '阅读下面的程序，逐行写出它的输出。',
      code: `counts = {}
for ch in "banana":
    counts[ch] = counts.get(ch, 0) + 1
print(counts["a"])
print(counts["n"])
print(len(counts))`,
      answer: `3
2
3`,
      explain: '循环遍历 banana 的每个字符，用字典累计出现次数：b 出现 1 次，a 出现 3 次，n 出现 2 次。字典里一共有 b、a、n 三个键，所以 len(counts) 是 3。'
    },
    {
      id: 'ch08-q6', ch: 'ch08', kp: 'ch08-2', tier: 2, type: 'predict', difficulty: 2,
      tags: ['dict'], codeTitle: 'Python',
      stem: '阅读下面的程序，逐行写出它的输出。',
      code: `d = {"x": 1}
d.setdefault("x", 10)
d.setdefault("y", 20)
print(d["x"])
print(d["y"])
print(len(d))`,
      answer: `1
20
2`,
      explain: '第一次 setdefault 的键 x 已经存在，所以保留原值 1，不会改成 10。第二次的键 y 不存在，于是插入 y: 20。最终字典有 x、y 两个键，长度是 2。'
    },
    {
      id: 'ch08-q7', ch: 'ch08', kp: 'ch08-3', tier: 1, type: 'fill', difficulty: 1,
      tags: ['dict'],
      stem: '要同时遍历字典的键和值，应写 <code>for k, v in d.____()</code>：',
      answer: 'items',
      accept: ['items'],
      explain: 'd.items() 返回由 (键, 值) 组成的视图，配合 for k, v 可以直接解包。只写 d 或 d.keys() 只能拿到键，d.values() 只能拿到值。'
    },
    {
      id: 'ch08-q8', ch: 'ch08', kp: 'ch08-2', tier: 1, type: 'fill', difficulty: 1,
      tags: ['dict'],
      stem: '<code>{"a": 1}.get("b", 0)</code> 的值是 ____。',
      answer: '0',
      accept: ['0'],
      explain: '字典里只有键 a，没有键 b，所以 get 返回调用时给出的默认值 0。如果省略第二个参数，键不存在时会返回 None。'
    },
    {
      id: 'ch08-q9', ch: 'ch08', kp: 'ch08-1', tier: 2, type: 'multi', difficulty: 2,
      tags: ['set'],
      stem: '（多选）关于字典与集合，下列哪些说法正确？',
      options: [
        { text: '<code>set([1, 2, 2, 3])</code> 会得到 3 个元素', correct: true },
        { text: '列表不能直接作为字典的键', correct: true },
        { text: '集合可以用 <code>s[0]</code> 按下标访问' },
        { text: '<code>set("banana")</code> 会得到 6 个元素' }
      ],
      explain: '集合会自动去重，所以 [1, 2, 2, 3] 变成 3 个元素；列表是可变的、不可哈希的，不能作为字典的键。集合是无序的，不支持用下标访问；set("banana") 只保留 b、a、n 三个不同字符。'
    },

    /* ch09 · 嵌套结构、排序与综合项目 */
    {
      id: 'ch09-q1', ch: 'ch09', kp: 'ch09-3', tier: 2, type: 'mcq', difficulty: 2,
      tags: ['sort'],
      stem: '执行下面的代码后，<code>students[0]["name"]</code> 是什么？<br><code>students = [{"name": "Ada", "score": 90}, {"name": "Bob", "score": 75}]</code><br><code>students.sort(key=lambda s: s["score"])</code>',
      options: [
        { text: '<code>"Bob"</code>', correct: true },
        { text: '<code>"Ada"</code>' },
        { text: '会报错' },
        { text: '按名字排序，结果不确定' }
      ],
      explain: 'key=lambda s: s["score"] 告诉 sort：比较时取每条记录的 score 字段。默认升序排列，Bob 的 75 小于 Ada 的 90，所以 Bob 排在前面，students[0]["name"] 是 "Bob"。'
    },
    {
      id: 'ch09-q2', ch: 'ch09', kp: 'ch09-4', tier: 2, type: 'mcq', difficulty: 2,
      tags: ['search'],
      stem: '使用二分查找之前，对数据有什么硬性要求？',
      options: [
        { text: '数据必须已经有序', correct: true },
        { text: '数据必须全部是字符串' },
        { text: '数据长度必须是偶数' },
        { text: '必须写成递归函数' }
      ],
      explain: '二分查找每次用中间元素判断目标在左半还是右半，前提是数据有序；否则「往左」或「往右」的判断不成立。二分查找可以用循环写，也可以用递归写，与元素类型和长度奇偶无关。'
    },
    {
      id: 'ch09-q3', ch: 'ch09', kp: 'ch09-5', tier: 2, type: 'mcq', difficulty: 2,
      tags: ['complexity'],
      stem: '用一个循环从头到尾扫描 <code>n</code> 个元素一次，时间复杂度通常记作什么？',
      options: [
        { text: '<code>O(n)</code>', correct: true },
        { text: '<code>O(1)</code>' },
        { text: '<code>O(log n)</code>' },
        { text: '<code>O(n^2)</code>' }
      ],
      explain: '循环执行次数与元素个数 n 成正比，所以是 O(n)。O(1) 表示操作次数与 n 无关，O(log n) 通常来自每次把范围减半的二分查找，O(n^2) 则常见于双层嵌套循环。'
    },
    {
      id: 'ch09-q4', ch: 'ch09', kp: 'ch09-1', tier: 2, type: 'predict', difficulty: 2,
      tags: ['nested'], codeTitle: 'Python',
      stem: '阅读下面的程序，写出它打印的结果。',
      code: `records = [
    {"name": "Ada", "score": 90},
    {"name": "Bob", "score": 75},
    {"name": "Cy", "score": 85}
]
names = [r["name"] for r in records if r["score"] >= 85]
print(names)`,
      answer: `['Ada', 'Cy']`,
      explain: '列表推导式遍历 records 中的每条记录，只保留 score 大于等于 85 的记录，并取出它们的 name。Ada 的 90 和 Cy 的 85 满足条件，Bob 的 75 被过滤掉，所以结果是 ["Ada", "Cy"]。'
    },
    {
      id: 'ch09-q5', ch: 'ch09', kp: 'ch09-3', tier: 3, type: 'predict', difficulty: 3,
      tags: ['sort'], codeTitle: 'Python',
      stem: '阅读下面的程序，逐行写出它打印的名字。',
      code: `students = [
    {"name": "Ada", "score": 90},
    {"name": "Bob", "score": 75},
    {"name": "Cy", "score": 90}
]
students.sort(key=lambda s: (-s["score"], s["name"]))
for s in students:
    print(s["name"])`,
      answer: `Ada
Cy
Bob`,
      explain: 'key 返回一个元组：第一个元素是负的分数，所以分数越高排得越前；分数相同时比较第二个元素 name，按字母升序。Ada 和 Cy 都是 90，Ada 在前；Bob 的 75 最低，排在最后。'
    },
    {
      id: 'ch09-q6', ch: 'ch09', kp: 'ch09-1', tier: 3, type: 'predict', difficulty: 3,
      tags: ['nested'], codeTitle: 'Python',
      stem: '阅读下面的程序，写出它打印的结果。',
      code: `data = {"a": [1, 2], "b": [3]}
total = 0
for values in data.values():
    for v in values:
        total += v
print(total)`,
      answer: `6`,
      explain: 'data.values() 依次给出两个列表 [1, 2] 和 [3]。外层循环取出列表，内层循环把列表里的每个数累加到 total，1 + 2 + 3 = 6，所以打印 6。'
    },
    {
      id: 'ch09-q7', ch: 'ch09', kp: 'ch09-4', tier: 4, type: 'predict', difficulty: 3,
      tags: ['search'], codeTitle: 'Python',
      stem: '阅读下面的二分查找程序，写出它打印的结果。',
      code: `nums = [10, 20, 30, 40, 50]
target = 30
lo, hi = 0, len(nums) - 1
found = -1
while lo <= hi:
    mid = (lo + hi) // 2
    if nums[mid] == target:
        found = mid
        break
    elif nums[mid] < target:
        lo = mid + 1
    else:
        hi = mid - 1
print(found)`,
      answer: `2`,
      explain: '初始 lo=0、hi=4，mid=(0+4)//2=2，nums[2] 正好是 30，命中目标后把 found 设为 2 并 break。因此最后打印的是下标 2。'
    },
    {
      id: 'ch09-q8', ch: 'ch09', kp: 'ch09-5', tier: 2, type: 'fill', difficulty: 2,
      tags: ['complexity'],
      stem: '在有序数据上进行二分查找，时间复杂度是 <code>O(____)</code>。',
      answer: 'log n',
      accept: ['log n', 'logn', 'O(log n)', 'O(logn)'],
      explain: '二分查找每比较一次就把搜索范围缩小一半，最多需要 log₂n 次比较，所以复杂度是 O(log n)。它比逐个扫描的 O(n) 快得多，但前提是数据已经有序。'
    },
    {
      id: 'ch09-q9', ch: 'ch09', kp: 'ch09-3', tier: 3, type: 'multi', difficulty: 3,
      tags: ['sort'],
      stem: '（多选）关于排序与查找，下列哪些说法正确？',
      options: [
        { text: '<code>sorted(nums)</code> 返回新列表，不修改原列表', correct: true },
        { text: '<code>nums.sort()</code> 原地排序，返回 <code>None</code>', correct: true },
        { text: '<code>key=lambda x: x[1]</code> 表示按第二个元素排序', correct: true },
        { text: '二分查找可以直接用于无序列表' }
      ],
      explain: 'sorted 是内置函数，返回排好序的新列表；list.sort 是原地方法，返回 None。key 函数返回的值决定排序依据，x[1] 就是第二个元素。二分查找必须建立在有序数据上，无序列表不能直接使用。'
    }

  ] };
  var G = (typeof globalThis !== 'undefined') ? globalThis : (typeof window !== 'undefined') ? window : this;
  var C = G && G.CSC;
  if (C && typeof C.registerQuizPack === 'function') {
    try { C._quizPack = PACK; } catch (e) {}
    C.registerQuizPack(PACK);
  }
})();
