/* =====================================================================
 * data/ch02.js · 第 02 章：变量、表达式与类型
 * 职责：建立"值 → 类型 → 运算 → 转换"这条主线：int/float/str/bool、
 *       算术运算符与优先级、/ // % 的区别、类型转换、f-string、input。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch02',
  num: '02',
  title: '变量、表达式与类型',
  en: 'Variables, Expressions & Types',
  goals: [
    '能解释变量是"名字绑定到值"而不是"装东西的盒子"',
    '能说出 int / float / str / bool 四种类型的特点与典型字面量',
    '能区分 /、//、% 的结果与用途，并按优先级心算表达式',
    '能用 int()、float()、str() 完成显式类型转换',
    '能用 f-string 格式化输出，并用 input() 写一个完整的小程序'
  ],
  kp: [
    { id: 'ch02-1', title: '变量：名字、值与重新赋值' },
    { id: 'ch02-2', title: '四种基本类型' },
    { id: 'ch02-3', title: '算术运算符与优先级' },
    { id: 'ch02-4', title: '除法三兄弟：/、//、%' },
    { id: 'ch02-5', title: '类型转换与 f-string' },
    { id: 'ch02-6', title: 'input 与常见类型错误' }
  ],
  blocks: [

    { t: 'callout', kind: 'why', html:
      '上一章的变量只是"给值起个名字"。但程序里的每个值都有<b>类型</b>，' +
      '类型决定了这个值能做什么、不能做什么。同样是 <code>+</code>，两个整数相加是算术，' +
      '两个字符串相加是拼接；同样写 <code>/</code>，有人得到 <code>3.5</code>，有人以为得到 <code>3</code>。' +
      '这一章把"值—类型—运算—转换"这条线一次讲清，后面每一章都会用到它。'
    },

    { t: 'p', lead: true, html:
      '一段程序里其实只有三种东西：<b>数据</b>（值）、数据的<b>类型</b>、对数据做的<b>操作</b>。' +
      '变量的作用只是给数据贴一个方便引用的标签。搞清这三者的关系，' +
      '你就能提前预测一行代码的结果，而不是靠运行一遍碰运气。'
    },

    { t: 'h', text: '一、变量：名字、值与重新赋值', id: 'ch02-1' },

    { t: 'p', html:
      '很多教材把变量比作"盒子"，把值放进盒子里。这个比喻在 Python 里会误导你。' +
      '更准确的说法是：变量是一个<b>名字</b>，赋值语句 <code>name = value</code> 做的事是' +
      '"让这个名字指向右边算出来的那个值"。名字可以改指向别的值，原来的值并不因此被销毁。'
    },

    { t: 'code', lang: 'python', caption: '重新赋值改的是"指向"，不是原来的值', code:
`x = 10
y = x            # 让 y 也指向 10 这个值
x = 20           # x 改指向 20

print(x)         # 20
print(y)         # 10：y 一直指向原来的 10，没有被改动

a, b = 1, 2      # 一次性给两个名字赋值
a, b = b, a      # 交换两个变量的值（右侧先整体求值）
print(a, b)      # 2 1
` },

    { t: 'p', html:
      '最后一行交换之所以成立，是因为<b>赋值号右边先整体求值</b>：先得到 <code>(2, 1)</code>，' +
      '再分别绑定给 <code>a</code> 和 <code>b</code>。如果按"先算 a = b，再算 b = a"去理解，' +
      '就会得出两个都是 2 的错误结论。'
    },

    { t: 'callout', kind: 'note', title: '变量本身没有类型', html:
      'Python 不要求你声明变量类型，同一个名字可以先指向整数、再指向字符串：' +
      '<code>x = 1</code> 之后写 <code>x = &#39;hello&#39;</code> 完全合法。' +
      '类型属于<b>值</b>，不属于名字。所以判断一个变量"是什么类型"，要看它当前指向的值。'
    },

    { t: 'h', text: '二、四种基本类型', id: 'ch02-2' },

    { t: 'p', html:
      '本课先用到的类型有四种。写代码时它会决定两件关键的事：<b>能进行哪些运算</b>、' +
      '<b>结果显示成什么样</b>。用内置函数 <code>type()</code> 可以随时查看一个值的类型。'
    },

    { t: 'code', lang: 'python', caption: '用 type() 看类型，顺便认识几种字面量', code:
`print(type(42))          # <class 'int'>
print(type(3.14))        # <class 'float'>
print(type('42'))        # <class 'str'>：有引号就是字符串
print(type(True))        # <class 'bool'>

print(1_000_000)         # 1000000：下划线只是方便人读
print(1.5e3)             # 1500.0：科学计数法，等价于 1.5 × 10³
print(2.0)               # 2.0：有小数点就是 float，不是 int
` },

    { t: 'table', head: ['类型', '含义', '字面量例子', '本课会用到的操作'], rows: [
      ['<code>int</code>', '整数，没有大小上限', '<code>42</code>、<code>-7</code>、<code>0</code>', '加减乘、整除、取余、幂'],
      ['<code>float</code>', '浮点数（带小数的数）', '<code>3.14</code>、<code>2.0</code>、<code>1.5e3</code>', '四则运算；可能有舍入误差'],
      ['<code>str</code>', '文本（字符串）', '<code>&#39;hi&#39;</code>、<code>&quot;42&quot;</code>', '拼接、重复、比较（第 6 章展开）'],
      ['<code>bool</code>', '真或假，只有两个值', '<code>True</code>、<code>False</code>', '条件判断（第 3 章展开）']
    ] },

    { t: 'p', html:
      '为什么必须分清类型？因为同一个符号在不同类型上的行为完全不同。下面的输出会让第一次见到的人愣一下：'
    },

    { t: 'code', lang: 'python', caption: '同一个运算符，不同类型不同含义', code:
`print(2 + 3)        # 5：整数相加
print('2' + '3')    # 23：字符串拼接，不是算数
print('2' * 3)      # 222：字符串重复三次
print([1, 2] * 2)   # 第 7 章会看到：列表也能重复
` },

    { t: 'p', html:
      '最后一行现在看不懂没关系，它只是预告"重复"这个操作不专属于字符串。' +
      '真正要记住的是：<b>运算符的含义由类型决定</b>，而两个类型不兼容时，Python 宁可报错也不猜。'
    },

    { t: 'code', lang: 'python', caption: '类型不兼容：直接报错，不做隐式猜测', code:
`# 下面这行会报 TypeError
# print('2' + 3)

# TypeError: can only concatenate str (not "int") to str
# 读法：str 只能和 str 拼接，不能和 int 拼
` },

    { t: 'callout', kind: 'tip', title: '读 TypeError 的方法', html:
      '先看最后一行提到的<b>运算符</b>（这里是 <code>+</code>）和<b>双方类型</b>，' +
      '再看左边是哪种类型。Python 的报错不会告诉你怎么改，但它会准确告诉你' +
      '"这两个值不能这样组合"。改法只有两种：换运算，或者先把其中一方转成兼容的类型。'
    },

    { t: 'h', text: '三、算术运算符与优先级', id: 'ch02-3' },

    { t: 'p', html:
      'Python 的算术运算符和数学课几乎一样，只有两处需要特别注意：整除写成 <code>//</code>、' +
      '幂写成 <code>**</code>，没有 <code>^</code>。<code>^</code> 在 Python 里是位运算，' +
      '用在整数上会得到一个完全无关的结果——这是从别的语言转过来的同学最常见的坑。'
    },

    { t: 'table', head: ['运算符', '含义', '例子与结果'], rows: [
      ['<code>+</code>', '加；在 str 上是拼接', '<code>2 + 3</code> → <code>5</code>'],
      ['<code>-</code>', '减', '<code>5 - 2</code> → <code>3</code>'],
      ['<code>*</code>', '乘；在 str 上是重复', '<code>2 * 3</code> → <code>6</code>'],
      ['<code>/</code>', '真除法，结果一定是 float', '<code>7 / 2</code> → <code>3.5</code>'],
      ['<code>//</code>', '整除（向下取整）', '<code>7 // 2</code> → <code>3</code>'],
      ['<code>%</code>', '取余数', '<code>7 % 2</code> → <code>1</code>'],
      ['<code>**</code>', '幂运算', '<code>2 ** 10</code> → <code>1024</code>']
    ] },

    { t: 'p', html:
      '优先级从高到低：<b>括号 → 幂运算 → 一元正负号 → 乘、除、整除、取余 → 加、减</b>。' +
      '同一优先级从左往右算，唯一的例外是幂运算，它从右往左结合。' +
      '按这个顺序读表达式，你能在运行之前就报出结果。'
    },

    { t: 'code', lang: 'python', caption: '按优先级读表达式', code:
`print(2 + 3 * 4)          # 14：先乘后加
print((2 + 3) * 4)        # 20：括号先算
print(2 ** 3 ** 2)        # 512：右结合，等价于 2 ** 9
print(-2 ** 2)            # -4：先算幂，再加负号
print(10 % 4 + 10 // 4)   # 4：先算 % 和 //，再算 +
print((10 + 2) * (3 - 1)) # 24：括号里各自先算
` },

    { t: 'callout', kind: 'tip', title: '优先级记不住怎么办', html:
      '记住三个就够了：<b>括号最优先</b>、<b>乘除类高于加减类</b>、<b>幂高于一切（除括号）且从右往左</b>。' +
      '读到复杂表达式时，用括号把"你想让它先算的部分"写出来，代码更清楚，也永远不会算错顺序。'
    },

    { t: 'h', text: '四、除法三兄弟：/、//、%', id: 'ch02-4' },

    { t: 'p', html:
      '这是初学者最容易混的一组。<code>/</code> 永远是"真除法"，哪怕正好除尽也返回 ' +
      '<code>float</code>；<code>//</code> 是整除，结果向下取整；<code>%</code> 取余数，' +
      '而且余数的符号跟着除数走。'
    },

    { t: 'code', lang: 'python', caption: '三种除法的结果对比', code:
`print(6 / 2)        # 3.0 —— 注意是 float，不是 int
print(7 / 2)        # 3.5
print(7 // 2)       # 3   —— 向下取整
print(-7 // 2)      # -4  —— 向下取整，不是向零截断
print(7 % 2)        # 1
print(-7 % 2)       # 1   —— 余数符号与除数 2 一致
print(7 % -2)       # -1  —— 除数是负数，余数也是负数
` },

    { t: 'p', html:
      '如果只处理正数，可以把 <code>//</code> 理解成"取整数部分"。一旦出现负数，' +
      '"向下取整"和"向零截断"就分道扬镳了：<code>-7 // 2</code> 是 <code>-4</code> 而不是 ' +
      '<code>-3</code>，因为 -4 才是"不超过 -3.5 的最大整数"。'
    },

    { t: 'code', lang: 'python', caption: '典型用途：把秒数拆成时、分、秒', code:
`total_seconds = 3672

hours = total_seconds // 3600            # 3672 里有 1 个 3600
rest = total_seconds % 3600              # 剩下 72 秒
minutes = rest // 60                     # 72 里有 1 个 60
seconds = rest % 60                      # 剩下 12 秒

print(f'{hours} 小时 {minutes} 分 {seconds} 秒')   # 1 小时 1 分 12 秒
` },

    { t: 'p', html:
      '<code>%</code> 的另一个高频用途是判断整除关系：<code>n % 2 == 0</code> 说明 n 是偶数，' +
      '<code>n % 3 == 0</code> 说明 n 能被 3 整除。第 3 章会用它写分支。'
    },

    { t: 'callout', kind: 'warn', title: '浮点数不能用 == 直接比较', html:
      '<code>0.1 + 0.2</code> 的结果是 <code>0.30000000000000004</code>，' +
      '所以 <code>0.1 + 0.2 == 0.3</code> 是 <code>False</code>。<b>这不是 Python 的 bug</b>，' +
      '而是二进制无法精确表示 0.1 这类分数导致的，所有采用同一浮点标准的语言都一样。' +
      '正确做法是比较差值：<code>abs(a - b) &lt; 1e-9</code>。'
    },

    { t: 'code', lang: 'python', caption: '浮点误差与两种应对方式', code:
`print(0.1 + 0.2)              # 0.30000000000000004
print(0.1 + 0.2 == 0.3)       # False

a = 0.1 + 0.2
b = 0.3
print(abs(a - b) < 1e-9)      # True：差值足够小就认为相等

# 涉及金额时更稳妥的做法：全部换成"分"用整数算
price_cents = 1999            # 19.99 元
count = 3
total_cents = price_cents * count
print(f'总价：{total_cents / 100:.2f} 元')    # 59.97 元
` },

    { t: 'h', text: '五、类型转换与 f-string', id: 'ch02-5' },

    { t: 'p', html:
      '有时候你手里是字符串 <code>&#39;42&#39;</code>，但需要的是整数 <code>42</code>。' +
      '这时要<b>显式转换</b>，用的是和类型同名的三个函数：<code>int()</code>、<code>float()</code>、' +
      '<code>str()</code>。Python 只做你要求的转换，从不偷偷替你转——这正是它比其他语言少很多玄学 bug 的原因。'
    },

    { t: 'code', lang: 'python', caption: '三种转换函数', code:
`print(int('42'))         # 42
print(int('  42  '))     # 42：两端空白会被忽略
print(float('3.5'))      # 3.5
print(float('42'))       # 42.0
print(str(42))           # '42'
print(int(3.99))         # 3：向零截断，不四舍五入
print(round(3.99))       # 4：这才是四舍五入
print(int(True))         # 1
print(bool(0), bool(1))  # False True
` },

    { t: 'code', lang: 'python', caption: '转换失败会抛 ValueError', code:
`print(int(float('3.5')))   # 3：先转 float 再转 int

# 下面两行都会报 ValueError
# int('3.5')    ValueError: invalid literal for int() with base 10: '3.5'
# int('abc')    ValueError: invalid literal for int() with base 10: 'abc'
` },

    { t: 'callout', kind: 'warn', title: 'int() 只认整数格式的字符串', html:
      '想让 <code>&#39;3.5&#39;</code> 变成整数，必须先 <code>float()</code> 再 <code>int()</code>。' +
      '反过来，<code>str(3.5)</code> 得到 <code>&#39;3.5&#39;</code> 是安全的。' +
      '另外注意 <code>bool(&#39;&#39;)</code> 是 <code>False</code>，但 ' +
      '<code>bool(&#39;0&#39;)</code> 是 <code>True</code>——非空字符串都是真，' +
      '"看起来像 0"的字符串也是真。'
    },

    { t: 'p', html:
      '把值变成想要的样子只是第一步，输出还得排得好看。' +
      '<b>f-string</b> 是现在最推荐的格式化方式：字符串前加 <code>f</code>，' +
      '花括号里直接写变量或表达式，运行时会被替换成值；冒号后面还能写格式说明。' +
      '比起用 <code>+</code> 拼接，它不用反复调用 <code>str()</code>，也不会数错空格。'
    },

    { t: 'code', lang: 'python', caption: 'f-string：嵌入表达式 + 控制格式', code:
`name = '小明'
age = 18
score = 92.456

# 老写法：拼接前必须自己把数字转成字符串
print('我叫' + name + '，今年' + str(age) + '岁')

# f-string：变量直接写进花括号
print(f'我叫{name}，今年{age}岁')
print(f'明年就 {age + 1} 岁了')        # 花括号里可以写表达式

print(f'成绩：{score:.1f}')            # 92.5：保留一位小数
print(f'成绩：{score:.2f}')            # 92.46
print(f'价格：{1234567:,}')            # 1,234,567：千分位
print(f'占比：{0.256:.1%}')            # 25.6%
` },

    { t: 'table', head: ['格式写法', '作用', '输出示例'], rows: [
      ['<code>{x:.2f}</code>', '保留两位小数', '<code>{3.14159:.2f}</code> → <code>3.14</code>'],
      ['<code>{x:,}</code>', '千分位分隔', '<code>{1234567:,}</code> → <code>1,234,567</code>'],
      ['<code>{x:.1%}</code>', '按百分比显示，保留一位小数', '<code>{0.256:.1%}</code> → <code>25.6%</code>'],
      ['<code>{x:&gt;8}</code>', '右对齐，总宽度 8', '<code>{&quot;hi&quot;:&gt;8}</code> → <code>      hi</code>'],
      ['<code>{x:08.2f}</code>', '不足 8 位补 0', '<code>{3.5:08.2f}</code> → <code>00003.50</code>']
    ] },

    { t: 'compare', left: {
      title: '用 + 拼接', html: '每一步都要保证两边都是字符串，数字要手动 <code>str()</code>；' +
        '空格容易多一个少一个；表达式一长，加号连成一片，很难看出最终输出是什么。'
    }, right: {
      title: '用 f-string', html: '变量、表达式、格式说明都写在原位置，' +
        '读代码时"看到什么就是什么"；数字要几位小数、要不要千分位，一个冒号就解决。'
    } },

    { t: 'h', text: '六、input 与常见类型错误', id: 'ch02-6' },

    { t: 'p', html:
      '<code>input()</code> 会暂停程序，等用户在键盘上敲一行并回车，然后把这行内容作为' +
      '<b>字符串</b>返回。不管用户敲的是 <code>18</code> 还是 <code>abc</code>，' +
      '拿到的永远是 <code>str</code>——这是初学阶段最高频的 bug 来源。'
    },

    { t: 'code', lang: 'python', caption: 'input.py：读入并使用', code:
`name = input('请输入姓名：')
age = int(input('请输入年龄：'))      # 读进来是字符串，必须转换

print(f'你好，{name}！明年你 {age + 1} 岁。')

# 运行时的屏幕内容（冒号后面是用户敲的）：
# 请输入姓名：小明
# 请输入年龄：18
# 你好，小明！明年你 19 岁。
` },

    { t: 'code', lang: 'python', caption: '漏掉转换就是 TypeError', code:
`# 错误示范
age = input('年龄：')          # 用户输入 18，但 age 是字符串 '18'
print(age + 1)                # TypeError: can only concatenate str (not "int") to str

# 正确写法
age = int(input('年龄：'))
print(age + 1)                # 19
` },

    { t: 'p', html:
      '把这一章的所有零件拼起来，就是一个真正的小程序：读入数据、做计算、按格式输出。'
    },

    { t: 'code', lang: 'python', caption: 'average.py：读入三门成绩，输出总分与平均分', code:
`s1 = float(input('第 1 门成绩：'))
s2 = float(input('第 2 门成绩：'))
s3 = float(input('第 3 门成绩：'))

total = s1 + s2 + s3
average = total / 3

print(f'总分：{total:.1f}')
print(f'平均分：{average:.2f}')
` },

    { t: 'table', head: ['报错信息（节选）', '原因', '解法'], rows: [
      ['<code>TypeError: can only concatenate str ...</code>', '字符串和数字直接用 <code>+</code> 相连', '用 <code>str()</code> 转换，或改用 f-string'],
      ['<code>TypeError: unsupported operand type(s) ...</code>', '两种类型不能做这个运算', '统一类型后再算'],
      ['<code>ValueError: invalid literal for int() ...</code>', '<code>int()</code> 收到了非整数格式的字符串', '先 <code>float()</code>，或校验输入'],
      ['<code>NameError: name ... is not defined</code>', '名字拼错，或还没赋值就使用', '检查拼写与赋值顺序']
    ] },

    { t: 'callout', kind: 'warn', title: '真实程序不能信任输入', html:
      '用户可能什么都不输入，可能输入字母，<code>int()</code> 会直接抛 ' +
      '<code>ValueError</code> 让程序崩掉。这一章先保证"正常输入能跑通"；' +
      '等学完第 3 章的条件判断，你就能用 <code>if</code> 检查输入，' +
      '写出"输错也不崩"的版本。'
    },

    { t: 'keypoint', items: [
      { title: '变量是名字', html: '赋值是让名字指向一个值；重新赋值只改指向，不影响别的名字。' },
      { title: '类型属于值', html: '同一个名字可以先后指向不同类型的值；用 <code>type()</code> 查看当前类型。' },
      { title: '运算符看类型', html: '<code>+</code> 在 str 上是拼接，<code>*</code> 在 str 上是重复；不兼容就报 TypeError。' },
      { title: '除法三兄弟', html: '<code>/</code> 必得 float，<code>//</code> 向下取整，<code>%</code> 取余且符号跟除数。' },
      { title: '显式转换', html: '<code>int()</code> / <code>float()</code> / <code>str()</code>；<code>int(&#39;3.5&#39;)</code> 会报 ValueError。' },
      { title: '输入与输出', html: '<code>input()</code> 永远返回 str；f-string 负责把结果排成想要的样子。' }
    ] },

    { t: 'checklist', id: 'ch02', items: [
      '我能解释 <code>x = 20</code> 之后另一个指向旧值的变量为什么不变',
      '我能说出 int、float、str、bool 各一个典型字面量',
      '我能心算 <code>-7 // 2</code>、<code>-7 % 2</code>、<code>2 ** 3 ** 2</code> 的结果',
      '我知道 <code>0.1 + 0.2 == 0.3</code> 为什么是 False，并知道怎么正确比较',
      '我能把字符串 <code>&#39;3.5&#39;</code> 转成整数 3',
      '我能用 f-string 输出保留两位小数的数字和带千分位的价格',
      '我能写一个读入两个数并输出平均值的小程序，且知道漏掉 int() 会报什么错'
    ] }
  ]
});
