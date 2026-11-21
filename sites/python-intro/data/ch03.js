/* =====================================================================
 * data/ch03.js · 第 03 章：条件与循环
 * 职责：从布尔表达式出发，讲清 if / elif / else 与嵌套分支、while、
 *       for + range、累加器模式、嵌套循环、break / continue 与 while True。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch03',
  num: '03',
  title: '条件与循环',
  en: 'Conditionals & Loops',
  goals: [
    '能写出各种比较与逻辑表达式，并解释短路求值的效果',
    '能用 if / elif / else 表达多路分支，并知道分支顺序为什么重要',
    '能用 while 写出带正确更新的循环，并识别死循环',
    '能用 for + range 完成计数、求和、遍历等重复任务',
    '能组合累加器、嵌套循环与 break / continue 解决小问题'
  ],
  kp: [
    { id: 'ch03-1', title: '布尔表达式与比较' },
    { id: 'ch03-2', title: '逻辑运算与短路求值' },
    { id: 'ch03-3', title: 'if / elif / else 与嵌套' },
    { id: 'ch03-4', title: 'while 循环与三要素' },
    { id: 'ch03-5', title: 'for 与 range' },
    { id: 'ch03-6', title: '累加器、嵌套循环与 break / continue' }
  ],
  blocks: [

    { t: 'callout', kind: 'why', html:
      '到上一章为止，程序都只有一条路：从第一行走到最后一行，走完就结束。' +
      '但真实问题里全是"<b>如果</b>分数够就及格，<b>否则</b>不及格"和"<b>重复</b>做这件事一百次"。' +
      '这一章给程序装上两种控制结构：<b>分支</b>让程序会选路，<b>循环</b>让程序会重复。' +
      '后面所有算法——求和、统计、查找、遍历图像——骨架都是它们。'
    },

    { t: 'p', lead: true, html:
      '分支和循环都建立在一个很小的东西上：<b>布尔表达式</b>，也就是一个能回答"是 / 否"的表达式。' +
      '先把这个"闸门"弄清楚，剩下的只是把它放在哪里、重复几次的问题。'
    },

    { t: 'h', text: '一、布尔表达式与比较', id: 'ch03-1' },

    { t: 'p', html:
      '第 2 章见过 <code>bool</code> 类型，它只有两个值：<code>True</code> 和 <code>False</code>。' +
      '比较两个值会得到一个 <code>bool</code>。比较运算符有六个：' +
      '<code>==</code>（相等）、<code>!=</code>（不等）、<code>&gt;</code>、<code>&lt;</code>、' +
      '<code>&gt;=</code>、<code>&lt;=</code>。注意"相等"是两个等号，一个等号是赋值。'
    },

    { t: 'code', lang: 'python', caption: '比较的结果就是 True / False', code:
`x = 7

print(x > 5)          # True
print(x == 7)         # True：注意是两个等号
print(x != 7)         # False
print(3 <= x <= 10)   # True：链式比较，等价于 3 <= x and x <= 10
print('apple' < 'banana')   # True：字符串按字典序比较
print('Python' == 'python') # False：大小写不同就不相等
` },

    { t: 'p', html:
      '链式比较是 Python 一个很好用的特性：<code>3 &lt;= x &lt;= 10</code> ' +
      '读起来和数学写法一样，不要写成 <code>3 &lt;= x and x &lt;= 10</code> 以外的奇怪形式' +
      '（比如 <code>3 &lt;= x &lt;= 10</code> 是合法的，但 <code>3 &lt;= x &gt;= 10</code> 的意思并不是你以为的那样）。' +
      '字符串比较按字符编码逐个比，所以大小写会影响结果。'
    },

    { t: 'callout', kind: 'warn', title: '= 与 == 是两个完全不同的东西', html:
      '<code>x = 5</code> 是赋值：让名字 <code>x</code> 指向 5，没有真假。' +
      '<code>x == 5</code> 是比较：问"x 等于 5 吗"，得到 <code>True</code> 或 <code>False</code>。' +
      '在 <code>if</code> 里手滑写成 <code>if x = 5:</code> 会直接报语法错误；' +
      '更隐蔽的是把比较结果丢掉，程序照常运行但逻辑全错。'
    },

    { t: 'code', lang: 'python', caption: '浮点数仍然不能用 == 直接比较', code:
`a = 0.1 + 0.2
b = 0.3

print(a == b)                 # False
print(abs(a - b) < 1e-9)      # True：看差值是否小到可以忽略
` },

    { t: 'h', text: '二、逻辑运算与短路求值', id: 'ch03-2' },

    { t: 'p', html:
      '单个比较只能问一件事，真实条件往往是几件事的组合。Python 用三个关键字连接：' +
      '<code>and</code>（都成立才为真）、<code>or</code>（有一个成立就为真）、' +
      '<code>not</code>（取反）。注意不是 <code>&amp;&amp;</code> 和 <code>||</code>，' +
      '那两个符号在 Python 里做的是完全不同的位运算。'
    },

    { t: 'table', head: ['a', 'b', 'a and b', 'a or b', 'not a'], rows: [
      ['<code>True</code>', '<code>True</code>', '<code>True</code>', '<code>True</code>', '<code>False</code>'],
      ['<code>True</code>', '<code>False</code>', '<code>False</code>', '<code>True</code>', '<code>False</code>'],
      ['<code>False</code>', '<code>True</code>', '<code>False</code>', '<code>True</code>', '<code>True</code>'],
      ['<code>False</code>', '<code>False</code>', '<code>False</code>', '<code>False</code>', '<code>True</code>']
    ] },

    { t: 'code', lang: 'python', caption: '组合条件', code:
`age = 20
has_ticket = True

print(age >= 18 and has_ticket)   # True：两个条件都成立
print(age < 18 or has_ticket)     # True：有一个成立就够
print(not has_ticket)             # False

# 等价写法：3 <= x <= 10 就是两个比较用 and 连起来
x = 7
print(x >= 3 and x <= 10)         # True
` },

    { t: 'p', html:
      '这里有一个很重要的细节：<b>短路求值</b>。计算 <code>a and b</code> 时，' +
      '如果 <code>a</code> 已经是假，整个结果必然为假，Python 就<b>不再计算</b> <code>b</code>；' +
      '<code>a or b</code> 在 <code>a</code> 为真时同样不再计算右边。' +
      '这不只是性能优化，它能用来避免错误：把"检查条件"放在前面，' +
      '把"可能出错的操作"放在后面。'
    },

    { t: 'code', lang: 'python', caption: '短路：右边根本没被执行', code:
`count = 0

# 先判断 count != 0，左边为假时右边不会计算，所以不会除零
print(count != 0 and 10 / count > 2)     # False

# 如果顺序反过来，就会先算除法，直接 ZeroDivisionError
# print(10 / count > 2 and count != 0)

name = ''
print(name or '匿名用户')                 # 匿名用户：左边为"假"，取右边
` },

    { t: 'p', html:
      '顺便记一下"真假"的判断标准：<code>0</code>、<code>0.0</code>、空字符串 ' +
      '<code>&#39;&#39;</code>、<code>None</code>、空容器都被当作假，其它值都是真。' +
      '所以 <code>bool(&#39;0&#39;)</code> 是 <code>True</code>——非空字符串不管内容是什么都为真。'
    },

    { t: 'callout', kind: 'tip', title: '用 and / or 改写嵌套判断', html:
      '看到一层套一层的 <code>if</code>，先问自己：这两个条件能不能用 <code>and</code> 合并？' +
      '它们是不是"满足任一即可"的关系、能用 <code>or</code> 合并？' +
      '把嵌套压平，代码会短一半，也更容易检查边界。'
    },

    { t: 'h', text: '三、if / elif / else 与嵌套', id: 'ch03-3' },

    { t: 'p', html:
      '<code>if</code> 的语法是：<code>if</code> + 条件 + <b>冒号</b>，下一行开始缩进，' +
      '写条件成立时要执行的语句。想处理"否则"就加 <code>else:</code>；' +
      '想处理多档情况就加若干 <code>elif 条件:</code>。' +
      'Python 会<b>从上到下</b>检查，命中第一个成立的分支后执行它，然后跳过整个结构剩下的部分。'
    },

    { t: 'code', lang: 'python', caption: '多路分支：成绩等级', code:
`score = 86

if score >= 90:
    grade = 'A'
elif score >= 80:
    grade = 'B'
elif score >= 70:
    grade = 'C'
elif score >= 60:
    grade = 'D'
else:
    grade = 'F'

print(f'成绩 {score}，等级 {grade}')     # 成绩 86，等级 B
` },

    { t: 'p', html:
      '上面这段能正确工作，靠的正是"从上到下、命中即停"。' +
      '假如把 <code>score >= 60</code> 挪到最前面，那么所有及格的人都会得到 D，' +
      '因为 86 也满足"大于等于 60"，后面的分支永远不会被检查。' +
      '<b>多路分支的顺序不是随意的，它本身就在编码逻辑。</b>'
    },

    { t: 'compare', left: {
      title: '条件范围互相覆盖', html: '先写宽的条件（<code>score &gt;= 60</code>），' +
        '再写窄的（<code>score &gt;= 90</code>）。所有及格分数都在第一个分支被截走，' +
        '后面的 A、B 永远不会出现。'
    }, right: {
      title: '从窄到宽，或从高到低', html: '先判断最严格的那一档，' +
        '剩下的情况才交给下一档。这样每个分支都只覆盖"还没被前面拿走"的区间。'
    } },

    { t: 'p', html:
      '分支还可以嵌套：在某个分支内部再写 <code>if</code>。嵌套本身不复杂，' +
      '但要小心"这个 else 到底属于哪个 if"——Python 靠缩进判断，' +
      '所以每个 <code>else</code> 都和它缩进相同的那个 <code>if</code> 配对。'
    },

    { t: 'code', lang: 'python', caption: '嵌套分支：成人票 / 学生票', code:
`age = 16
is_member = True

if age >= 18:
    print('成人票')
else:
    if is_member:
        print('学生会员票')
    else:
        print('学生票')

# 上面这段可以压平成 elif，效果完全相同，但更好读：
# if age >= 18:
#     print('成人票')
# elif is_member:
#     print('学生会员票')
# else:
#     print('学生票')
` },

    { t: 'code', lang: 'python', caption: '三种最常见的 if 写法错误', code:
`# 错误 1：漏了冒号
# if score >= 60
#     print('及格')

# 错误 2：用了别的语言的逻辑符号
# if score >= 60 && score < 70:

# 错误 3：把比较写成了赋值
# if score = 60:
` },

    { t: 'callout', kind: 'warn', title: '条件里只写变量名，是在问"它真吗"', html:
      '写法 <code>if is_member:</code> 完全合法，它的意思是"如果 is_member 这个值为真"。' +
      '但如果写成 <code>if is_member == True:</code> 就啰嗦了；写成 ' +
      '<code>if is_member = True:</code> 则是语法错误。' +
      '判断布尔变量时直接用名字，判断数值或文本时用比较。'
    },

    { t: 'h', text: '四、while 循环与三要素', id: 'ch03-4' },

    { t: 'p', html:
      '<code>while</code> 的意思是"<b>只要</b>条件成立，就<b>反复</b>执行下面的块"。' +
      '写对 while 只有三个要素：<b>初始值</b>（进入循环前先设定）、' +
      '<b>条件</b>（什么时候继续）、<b>更新</b>（每轮让变量朝条件变化的方向走）。' +
      '三要素缺一个，循环要么一次都不执行，要么永远不结束。'
    },

    { t: 'flow', dir: 'v', nodes: [
      { title: '初始化变量', desc: '进入循环前：n = 5', kind: 'proc' },
      { title: '判断条件', desc: 'n > 0 吗？', kind: 'decide' },
      { title: '执行循环体', desc: 'print(n)，做这一轮的事', kind: 'proc' },
      { title: '更新变量', desc: 'n = n - 1，让条件有机会变假', kind: 'proc' }
    ] },

    { t: 'code', lang: 'python', caption: '倒计时：三要素齐全的 while', code:
`n = 5
while n > 0:
    print(n)
    n = n - 1          # 更新：没有这一行，循环永远不会结束
print('发射！')

# 输出：5 4 3 2 1（各占一行），最后一行 发射！
` },

    { t: 'p', html:
      'while 擅长"事先不知道要转几圈"的问题。比如要把一个整数的每一位拆出来，' +
      '你不知道它有几位，只知道"只要还有数位就继续"。'
    },

    { t: 'code', lang: 'python', caption: '逐位拆分：数位之和', code:
`n = 9875
total = 0

while n > 0:
    total = total + n % 10     # n % 10 取出最后一位
    n = n // 10                # n // 10 去掉最后一位

print(total)                   # 9 + 8 + 7 + 5 = 29
` },

    { t: 'callout', kind: 'warn', title: '死循环的判断与自救', html:
      '程序卡住不动，几乎总是 while 的<b>条件永远为真</b>。最常见的原因是忘了写更新，' +
      '或者更新方向反了（条件要求变小，你却每轮加一）。' +
      '在终端里按 <code>Ctrl + C</code> 可以中断；调试时先在循环体第一行打印变量，' +
      '看它到底有没有在变。'
    },

    { t: 'code', lang: 'python', caption: '两种典型死循环（不要真的运行）', code:
`# 1) 忘记更新：n 一直是 5，条件永远成立
# n = 5
# while n > 0:
#     print(n)

# 2) 更新方向反了：n 越来越大，永远大于 0
# n = 5
# while n > 0:
#     print(n)
#     n = n + 1
` },

    { t: 'h', text: '五、for 与 range', id: 'ch03-5' },

    { t: 'p', html:
      '当重复次数是确定的，或者需要"依次访问一串数"时，用 <code>for</code> 比 while 更省心：' +
      '初始化、条件、更新三件事都由它替你管好。' +
      '<code>range()</code> 用来生成一串整数，最大的特点是<b>不包含结束值</b>：' +
      '<code>range(5)</code> 是 0、1、2、3、4，不含 5。'
    },

    { t: 'table', head: ['写法', '生成的整数', '典型用途'], rows: [
      ['<code>range(5)</code>', '0, 1, 2, 3, 4', '重复 5 次，下标从 0 开始'],
      ['<code>range(1, 6)</code>', '1, 2, 3, 4, 5', '从 1 数到 5'],
      ['<code>range(0, 10, 2)</code>', '0, 2, 4, 6, 8', '步长为 2'],
      ['<code>range(5, 0, -1)</code>', '5, 4, 3, 2, 1', '倒着数'],
      ['<code>range(0)</code>', '空', '一次都不执行']
    ] },

    { t: 'code', lang: 'python', caption: '计数与求和', code:
`for i in range(5):
    print(i)              # 0 1 2 3 4，各占一行

total = 0
for i in range(1, 101):
    total = total + i
print(total)              # 5050：1 加到 100
` },

    { t: 'p', html:
      '这里有个必须记牢的对应关系：<b>"重复 n 次"写 <code>range(n)</code>，i 取 0 到 n-1</b>；' +
      '<b>"从 1 数到 n"写 <code>range(1, n + 1)</code></b>。' +
      '写成 <code>range(1, n)</code> 会少算最后一个数，这就是最经典的 off-by-one（差一）错误，' +
      '求和的答案会悄悄少掉 n。'
    },

    { t: 'code', lang: 'python', caption: '证明 range 不含结束值', code:
`print(list(range(1, 5)))      # [1, 2, 3, 4]：没有 5
print(list(range(5)))         # [0, 1, 2, 3, 4]

print(list(range(10, 0, -3))) # [10, 7, 4, 1]
` },

    { t: 'p', html:
      '这里的 <code>list(...)</code> 只是把 range 生成的整数一次性展开显示，方便核对边界；' +
      '列表本身第 7 章才会正式讲，现在不用深究。'
    },

    { t: 'callout', kind: 'warn', title: '差一错误不会报错，只会算错', html:
      '循环范围写错时，程序不会抛异常，它只是"安静地少做一次"或"多做一次"。' +
      '所以写完循环一定要问：<b>第一轮的值是什么？最后一轮的值是什么？总共几轮？</b>' +
      '拿 n = 3 这种小数据手工数一遍，比盯着代码看五分钟有效。'
    },

    { t: 'h', text: '六、累加器、嵌套循环与 break / continue', id: 'ch03-6' },

    { t: 'p', html:
      '循环本身只是"重复"，真正让它有用的是在循环里<b>积累结果</b>。' +
      '最常见的三种累加器模式：<b>求和</b>（<code>total = total + x</code>）、' +
      '<b>计数</b>（<code>count = count + 1</code>）、<b>累乘</b>（<code>result = result * x</code>）。' +
      '它们的共同点是：循环开始前先给变量一个"单位元"，循环里更新它，循环结束后使用它。'
    },

    { t: 'code', lang: 'python', caption: '三种累加器', code:
`# 1) 求和：1 到 10
total = 0
for i in range(1, 11):
    total += i
print(total)          # 55

# 2) 计数：1 到 10 里有几个偶数
count = 0
for i in range(1, 11):
    if i % 2 == 0:
        count += 1
print(count)          # 5

# 3) 累乘：计算 6 的阶乘
result = 1
for i in range(1, 7):
    result *= i
print(result)         # 720
` },

    { t: 'p', html:
      '循环里还可以再放循环，叫<b>嵌套循环</b>。外层每走一步，内层都要完整走一圈，' +
      '所以总执行次数是两者相乘。这是后面处理表格、图像、二维数据的基础。'
    },

    { t: 'code', lang: 'python', caption: '嵌套循环：打印一个数字三角形', code:
`for i in range(1, 6):          # 外层：第几行
    for j in range(1, i + 1):  # 内层：这一行打印几个数
        print(j, end=' ')      # end=' ' 表示用空格代替换行（参数，第 4 章细讲）
    print()                    # 这一行打完了，换行

# 输出：
# 1
# 1 2
# 1 2 3
# 1 2 3 4
# 1 2 3 4 5
` },

    { t: 'h', text: '提前结束：break 与 continue', lvl: 3 },

    { t: 'p', html:
      '有时循环不用跑完就该停。两个关键字分工明确：<b><code>break</code></b> 立刻跳出' +
      '整个循环；<b><code>continue</code></b> 只结束当前这一轮，跳过剩下的语句，' +
      '直接进入下一轮。它们都只影响<b>最内层</b>的那个循环。'
    },

    { t: 'code', lang: 'python', caption: 'break 与 continue 的区别', code:
`for i in range(1, 11):
    if i == 6:
        break                 # 到 6 就整体结束，后面 7~10 不再执行
    print(i, end=' ')
print()                       # 1 2 3 4 5

for i in range(1, 11):
    if i % 2 == 0:
        continue              # 偶数跳过本轮剩余部分，直接下一轮
    print(i, end=' ')
print()                       # 1 3 5 7 9
` },

    { t: 'code', lang: 'python', caption: 'while True + break：先做事，再决定停不停', code:
`while True:
    text = input('输入内容（输入 quit 结束）：')
    if text == 'quit':
        break
    print('你输入了：', text)

print('程序结束')
` },

    { t: 'p', html:
      '<code>while True</code> 配上 <code>break</code> 是"至少执行一次、退出条件在中间"的常用写法，' +
      '比硬凑一个条件变量更清楚。但一定要保证存在能走到 break 的路径，' +
      '否则就退化成死循环。'
    },

    { t: 'p', html:
      '把这一章的东西合起来，可以写出一些小而有用的程序。下面是"判断质数"：' +
      '质数是大于 1、且只能被 1 和它本身整除的整数，所以只要试除 2 到 n-1。'
    },

    { t: 'code', lang: 'python', caption: '综合：判断质数', code:
`n = 97
is_prime = True

for i in range(2, n):
    if n % i == 0:        # 找到一个能整除 n 的数
        is_prime = False
        break             # 已经能判定不是质数，不必再试

if is_prime:
    print(n, '是质数')
else:
    print(n, '不是质数')

# 输出：97 是质数
` },

    { t: 'table', head: ['场景', '优先选择', '理由'], rows: [
      ['重复固定次数', '<code>for</code> + <code>range</code>', '计数变量自动管理，不会忘记更新'],
      ['依次访问一串值', '<code>for</code>', '不用关心下标，读到最后一个自动停'],
      ['次数未知，靠条件退出', '<code>while</code>', '条件直接写成退出条件'],
      ['至少执行一次', '<code>while True</code> + <code>break</code>', '退出判断放在循环体中间'],
      ['提前找到就停', '<code>for</code> + <code>break</code>', '命中即退出，不浪费后续轮次']
    ] },

    { t: 'callout', kind: 'tip', title: '循环写不出来时，先用小数据手动走一遍', html:
      '拿 n = 3 或 <code>range(1, 4)</code> 这样的最小输入，在纸上写出每一轮各变量的值，' +
      '通常走两三轮就能发现：初始值放错位置、更新写漏、边界多算一次。' +
      '这比反复运行碰运气快得多。'
    },

    { t: 'keypoint', items: [
      { title: '布尔表达式', html: '比较得到 True / False；<code>==</code> 是比较，<code>=</code> 是赋值。' },
      { title: 'and / or / not', html: '短路求值：左边能定结果时右边不计算，可以用来保护可能出错的操作。' },
      { title: '分支顺序', html: '<code>if / elif / else</code> 命中即停，条件范围不能互相覆盖。' },
      { title: 'while 三要素', html: '初始值、条件、更新；少一个就可能死循环或一次都不执行。' },
      { title: 'range 不含结束值', html: '"重复 n 次"用 <code>range(n)</code>，"1 到 n"用 <code>range(1, n+1)</code>。' },
      { title: '累加器与跳转', html: '循环外初始化、循环内更新、循环后用；<code>break</code> 跳出，<code>continue</code> 跳过本轮。' }
    ] },

    { t: 'checklist', id: 'ch03', items: [
      '我能解释 <code>3 <= x <= 10</code> 与 <code>x == 5</code> 分别得到什么',
      '我能说出 <code>count != 0 and 10 / count > 2</code> 为什么不会除零',
      '我能写出按分数分五档的 if / elif / else，并说明顺序为什么重要',
      '我能指出一段 while 循环缺少哪个要素，并知道怎么改',
      '我能用 for + range 求 1 到 100 的和、并说明 range 的取值边界',
      '我能区分 break 与 continue 的效果',
      '我能用嵌套循环打印一个直角三角形数字图案',
      '我能用累加器 + 分支 + break 写出判断质数的小程序'
    ] }
  ]
});
