/* =====================================================================
 * data/ch15.js · 第 15 章：Python 基础
 * 职责：课程后半学期换 Python 的第一站——Python vs Java、缩进、变量与
 *       type()/转换、list 全套操作、if/elif 与逻辑运算、真值测试、f-string、
 *       PyCharm 工作流，为 ch16 的类与 ch17–ch18 的 Tkinter 项目铺路。
 * 对外 API：CSC.registerChapter({...})（block schema 见 _dev/CONTRACT.md §4–§5）
 * 注意：Python 无法在站内引擎执行，本章所有代码块 run:false。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch15',
  num: '15',
  title: 'Python 基础',
  en: 'Python Basics',
  goals: [
    '能对比 Python 与 Java 在类型检查、执行方式与适用场景上的差别，并说出各自擅长什么',
    '能写出缩进正确的 Python 程序，用 type() 判断类型、用 str()/int()/float() 完成转换',
    '能创建 list，用正负索引、切片与 in 取数据，用 append/insert/remove/del 增删改',
    '能用 for 与 while 两种方式遍历 list，分清加号拼接与 extend 原地扩展',
    '能用 if/elif/else 与 and/or/not 写分支，解释 0、空串、空 list 为什么为 False，并用 f-string 输出'
  ],
  kp: [
    { id: 'ch15-1', title: 'Python vs Java：两种语言的分工' },
    { id: 'ch15-2', title: '缩进即语法（indentation）' },
    { id: 'ch15-3', title: '变量、type() 与类型转换' },
    { id: 'ch15-4', title: '列表 list：创建、索引与切片' },
    { id: 'ch15-5', title: 'list 的增删改与三种遍历' },
    { id: 'ch15-6', title: 'if/elif/else 与 and/or/not' },
    { id: 'ch15-7', title: '真值测试：什么算 False' },
    { id: 'ch15-8', title: 'f-string、字典与 PyCharm 工作流' }
  ],
  blocks: [

    /* ---------------------------------------------------------------- 开篇 */
    { t: 'callout', kind: 'why', html:
      '前 14 章都在写 Java。从第 9 讲起课程整块换成 Python，第三个项目——Tkinter 版贪吃蛇——就用 Python 写，占总评 20%，' +
      '期末考里两种语言还会互相挖坑。这一章先把语法骨架铺完：缩进、变量、list、分支、f-string，后面三章再叠类、GUI 与游戏循环。'
    },

    { t: 'p', lead: true, html:
      '已经会 Java 的人学 Python，最大的风险不是"看不懂"，而是"以为看懂了"：语法省略太多，容易把"能跑"当成"懂了"。' +
      '对策是固定的——每见到一个新写法，先问一句"Java 里对应什么"。'
    },

    /* ---------------------------------------------------------------- 一 */
    { t: 'h', text: '一、Python vs Java：同一件事的两种写法', id: 'ch15-1' },

    { t: 'p', html:
      '课程讲义用两句话概括分工：Java 以强类型（strong typing）与性能见长，是大型企业级应用的常见选择；' +
      'Python 以简洁（simplicity）与可读性（readability）见长，适合快速开发与数据分析。实现层面还有两条差别：' +
      'Java 是静态类型（statically typed），先编译（compile）成字节码再交给 JVM 执行；' +
      'Python 是动态类型（dynamically typed），由解释器（interpreter）逐行执行。'
    },

    { t: 'terms', cols: 2, items: [
      { en: 'strong typing', zh: '强类型', html: '类型规则严格，不允许随意当另一种类型用。' },
      { en: 'statically typed', zh: '静态类型', html: '编译期检查类型；<code>int</code> 变量装不下字符串。' },
      { en: 'dynamically typed', zh: '动态类型', html: '类型跟着值走；<code>x</code> 可以先装 5 再装字符串。' },
      { en: 'interpreter', zh: '解释器', html: '逐行执行代码，没有独立的编译步骤。' }
    ] },

    { t: 'codegroup', tabs: [
      {
        label: 'Java · HelloLoop.java',
        run: false,
        code:
`public class HelloLoop {
    public static void main(String[] args) {
        int[] numbers = {10, 15, 22, 33, 42};
        int total = 0;

        for (int n : numbers) {
            total = total + n;
        }

        System.out.println("total = " + total);   // total = 122
    }
}
`
      },
      {
        label: 'Python · hello_loop.py',
        run: false,
        code:
`numbers = [10, 15, 22, 33, 42]
total = 0

for n in numbers:
    total = total + n

print("total =", total)   # total = 122
`
      }
    ] },

    { t: 'p', html:
      '并排看：Java 的类声明、<code>main</code> 签名、类型、花括号、分号一样不少，Python 只剩 5 行。' +
      '差别不在能做什么，而在要写多少样板代码（boilerplate）——类型、块边界与语句结束符，全被缩进和解释器接管了。'
    },

    { t: 'compare', left: {
      title: '把 Java 习惯直接搬进 Python',
      html: '花括号、分号、类型声明一起写：<code>if (x &gt; 5) { print(x); }</code><br>' +
        'Python 不认花括号分块，这一行会直接 <code>SyntaxError</code>。'
    }, right: {
      title: 'Python 的写法',
      html: '冒号 + 缩进 + 不写类型：<code>if x &gt; 5:</code> 之后换行、空 4 格写 <code>print(x)</code>。<br>' +
        '两种语言的"块"概念一样，只是记号不同。'
    } },

    { t: 'callout', kind: 'warn', title: 'Python 不是"随便写"', html:
      '省略的是声明和括号，不是规则：Python 大小写敏感（<code>True</code> 不是 <code>true</code>），冒号、缩进、引号都不能省。' +
      '把花括号习惯直接搬过来，最常见的报错是 <code>SyntaxError</code> 与 <code>IndentationError</code>。'
    },

    /* ---------------------------------------------------------------- 二 */
    { t: 'h', text: '二、缩进即语法', id: 'ch15-2' },

    { t: 'p', html:
      '缩进（indentation）指代码行开头的空格，课程推荐 4 个空格，也就是一个 <kbd>Tab</kbd>。' +
      'Python 用它表示从属关系：属于同一块的语句必须缩进同样多。这是 Python 唯一的分块方式——没有花括号，也没有 <code>end</code>。'
    },

    { t: 'code', lang: 'python', run: false, caption: 'indent.py · 缩进决定"谁属于谁"', code:
`if 5 > 2:
    print("Five is greater than two!")
    print("这两行都在 if 块里")

for i in range(3):
    print("round", i)
    if i == 1:
        print("i equals 1")     # 在更里层的 if 块里
`
    },

    { t: 'p', html:
      '归属全靠行首空格：<code>print("round", i)</code> 在 for 块里，<code>print("i equals 1")</code> 又在 if 块里。' +
      '把最后一行往回挪一格，含义就从"i 等于 1 时打印"变成"循环结束后打印"——程序照样跑，输出却变了。'
    },

    { t: 'callout', kind: 'warn', title: '缩进错误分两种，第二种更危险', html:
      '① <b>IndentationError</b>：该缩进没缩进，或同一块缩进量不一致，解释器直接拒绝运行；' +
      '② <b>逻辑错误</b>：缩进量合法但层级写错，程序照跑、结果全错。<br>' +
      '对策：全文件统一 4 个空格，不要混用 Tab；PyCharm 会把 Tab 显示成一条箭头。'
    },

    /* ---------------------------------------------------------------- 三 */
    { t: 'h', text: '三、变量、type() 与类型转换', id: 'ch15-3' },

    { t: 'p', html:
      '变量（variable）在赋值时被创建：<code>x = 5</code> 之后才有 <code>x</code>，不必先写类型。' +
      '类型记在值上——5 是 <code>int</code>，3.14 是 <code>float</code>，<code>"hi"</code> 是 <code>str</code>。' +
      '查类型用 <code>type()</code>；主动改类型就把类型名当函数调用：<code>str()</code>、<code>int()</code>、<code>float()</code>，这叫类型转换（casting）。'
    },

    { t: 'code', lang: 'python', run: false, caption: 'casting.py · type() 查类型，三个函数做转换', code:
`x = str(3)      # x 是字符串 '3'
y = int(3)      # y 是整数 3
z = float(3)    # z 是浮点数 3.0

print(type(x))  # <class 'str'>
print(type(y))  # <class 'int'>
print(type(z))  # <class 'float'>

n = int("42")      # 字符串转整数
f = float("3.5")   # 字符串转浮点
s = str(3.14)      # 数字转字符串

print(n + 1)       # 43
print(f * 2)       # 7.0
print(s + "!")     # 3.14!
print(int(3.9))    # 3：向零截断，不是四舍五入
# print(int("3.5"))  会抛 ValueError：字符串里不是整数
`
    },

    { t: 'p', html:
      '两个细节爱挖坑：<code>int()</code> 向零截断，<code>int(3.9)</code> 得 3；<code>int("3.5")</code> 抛 <code>ValueError</code>。' +
      '字符串与数字之间没有隐式转换，<code>"3" + 3</code> 一定抛 <code>TypeError</code>，这一点 Python 比 Java 更严格。'
    },

    { t: 'p', html:
      '另外两个必会的小语法：<b>注释用 <code>#</code> 开头</b>，解释器把 <code>#</code> 到行尾全部当注释（Java 用 <code>//</code> 与 <code>/* */</code>）；' +
      '语句结尾不用分号，一行写一条语句即可，写成 Java 那样加分号也不会报错，但不推荐。'
    },

    { t: 'table',
      head: ['想做的事', 'Java 写法', 'Python 写法'],
      rows: [
        ['声明并赋值整数', '<code>int x = 5;</code>', '<code>x = 5</code>'],
        ['查看类型', '编译期已确定', '<code>type(x)</code>'],
        ['转成字符串', '<code>String.valueOf(x)</code>', '<code>str(x)</code>'],
        ['字符串转整数', '<code>Integer.parseInt("42")</code>', '<code>int("42")</code>'],
        ['字符串转浮点', '<code>Double.parseDouble("3.5")</code>', '<code>float("3.5")</code>'],
        ['整数转浮点', '<code>(double) 3</code>', '<code>float(3)</code>']
      ],
      caption: '差别在于：Java 把类型写在变量上，Python 把类型记在值上' },

    /* ---------------------------------------------------------------- 四 */
    { t: 'h', text: '四、列表 list：创建、索引与切片', id: 'ch15-4' },

    { t: 'p', html:
      '列表（list）把多个值装进一个变量，用方括号创建。它有序、可修改、长度可变，元素类型也不必一致——' +
      '<code>["abc", 34, True]</code> 是合法列表。Java 里最接近的是 <code>ArrayList</code>，但 list 是内置的，不用 <code>import</code> 也不用 <code>new</code>。'
    },

    { t: 'code', lang: 'python', run: false, caption: 'list_basic.py · 创建、索引、切片、in、改值', code:
`thislist = ["apple", "banana", "cherry"]
print(thislist)          # ['apple', 'banana', 'cherry']
print(len(thislist))     # 3

mixed = ["abc", 34, True, 40.2, "male"]   # 一个 list 可以混装不同类型
print(mixed[1])          # 34
print(thislist[-1])      # cherry：负索引从末尾数

longer = ["apple", "banana", "cherry", "orange", "kiwi", "melon", "mango"]
print(longer[2:5])       # ['cherry', 'orange', 'kiwi']：含 2 不含 5

if "apple" in thislist:
    print("Yes, apple is in the fruits list")

thislist[1] = "blackcurrant"    # 改值
print(thislist)                 # ['apple', 'blackcurrant', 'cherry']
`
    },

    { t: 'p', html:
      '索引（index）从 0 开始，负索引从末尾数：<code>-1</code> 是最后一个。切片（slicing）<code>thislist[2:5]</code> 取 2、3、4，' +
      '左闭右开——和 Java 的 <code>substring(2, 5)</code> 一样含头不含尾。用 <code>in</code> 判断存在，越界访问抛 <code>IndexError</code>。'
    },

    /* ---------------------------------------------------------------- 五 */
    { t: 'h', text: '五、list 的增删改与三种遍历', id: 'ch15-5' },

    { t: 'p', html:
      '增删改就那几个方法，但每个删除依据不同，混用是选择题的高频陷阱。下面先走一遍增删改与两种拼接，再用三种方式遍历。'
    },

    { t: 'code', lang: 'python', run: false, caption: 'list_methods.py · 追加、插入、删除、拼接', code:
`thislist = ["apple", "banana", "cherry"]

thislist.append("orange")       # 末尾追加
print(thislist)                 # ['apple', 'banana', 'cherry', 'orange']

thislist.insert(1, "kiwi")      # 插到下标 1，原元素后移
print(thislist)                 # ['apple', 'kiwi', 'banana', 'cherry', 'orange']

thislist.remove("banana")       # 按值删第一个匹配项
print(thislist)                 # ['apple', 'kiwi', 'cherry', 'orange']

del thislist[1]                 # 按下标删
print(thislist)                 # ['apple', 'cherry', 'orange']

list1 = ["a", "b", "c"]
list2 = [1, 2, 3]
list3 = list1 + list2           # 生成新列表，list1 不变
print(list3)                    # ['a', 'b', 'c', 1, 2, 3]
print(list1)                    # ['a', 'b', 'c']

list1.extend(list2)             # 原地扩展 list1
print(list1)                    # ['a', 'b', 'c', 1, 2, 3]
`
    },

    { t: 'code', lang: 'python', run: false, caption: 'list_loop.py · 三种遍历，课程材料都出现过', code:
`thislist = ["apple", "banana", "cherry"]

for i in range(len(thislist)):      # 用下标遍历
    print(thislist[i])

i = 0
while i < len(thislist):            # 用 while 遍历
    print(thislist[i])
    i = i + 1

for value in thislist:              # 直接取值遍历，最 Python
    print(value)
`
    },

    { t: 'table',
      head: ['操作', '写法', '说明'],
      rows: [
        ['末尾添加', '<code>append(x)</code>', '原地修改，返回 None'],
        ['指定位置插入', '<code>insert(1, x)</code>', '插到下标 1，原元素后移'],
        ['按值删除', '<code>remove(x)</code>', '删第一个匹配；没有会抛 ValueError'],
        ['按下标删除', '<code>del thislist[1]</code>', '直接删位置'],
        ['拼接成新列表', '<code>list1 + list2</code>', '两边原列表都不变'],
        ['原地扩展', '<code>list1.extend(list2)</code>', 'list1 变长，list2 不变'],
        ['长度 / 是否存在', '<code>len()</code> / <code>in</code>', '元素个数 / True 或 False']
      ],
      caption: '题目问"执行完 list1 是什么"时，先看这行有没有等号接收结果' },

    { t: 'callout', kind: 'warn', title: '三个删除 / 拼接陷阱', html:
      '<code>remove(x)</code> 按值删，找不到抛 <code>ValueError</code>；<code>del thislist[1]</code> 按位置删，位置写错就删错人；' +
      '<code>list3 = list1 + list2</code> 生成新列表，而 <code>list1.extend(list2)</code> 原地修改。' +
      '判断题常把这三行放在一起，问谁改变了原列表。'
    },

    /* ---------------------------------------------------------------- 六 */
    { t: 'h', text: '六、if/elif/else 与 and/or/not', id: 'ch15-6' },

    { t: 'p', html:
      '关键字是 <code>if</code>、<code>elif</code>、<code>else</code>。和 Java 比三点差别：条件后加冒号、多分支用 <code>elif</code>、' +
      '块靠缩进不靠花括号。比较运算符相同，逻辑组合用 <code>and</code>、<code>or</code>、<code>not</code>。'
    },

    { t: 'code', lang: 'python', run: false, caption: 'branch.py · if/elif/else 与三种逻辑运算', code:
`a = 200
b = 33
c = 500

if b > a:
    print("b is greater than a")
elif a == b:
    print("a and b are equal")
else:
    print("a is greater than b")          # 输出这一行

if a > b and c > a:
    print("Both conditions are True")

if a > b or a > c:
    print("At least one condition is True")

if not a > b:
    print("a is NOT greater than b")      # 不会打印
`
    },

    { t: 'p', html:
      '命中一个分支就跳出整条链，所以 <code>elif</code> 的顺序决定谁先被检查。逻辑运算符从左到右求值：' +
      '<code>and</code> 遇假就停、<code>or</code> 遇真就停，这叫短路求值（short-circuit evaluation）。' +
      '它不只是优化：<code>if thislist and thislist[0] == "apple":</code> 正是靠短路避免空列表取下标。'
    },

    { t: 'callout', kind: 'warn', title: 'if 的三条硬规则', html:
      '① 条件后必须有冒号；② <code>elif</code> 必须连写，<code>else if</code> 会 <code>SyntaxError</code>；③ 块内至少一行、缩进统一。<br>' +
      '另外 <code>=</code> 是赋值、<code>==</code> 才是比较，写在 <code>if</code> 里直接报错，不会像 C 那样静默成真。'
    },

    /* ---------------------------------------------------------------- 七 */
    { t: 'h', text: '七、真值测试：什么算 False', id: 'ch15-7' },

    { t: 'p', html:
      'Python 的 <code>if</code> 不要求条件是布尔值，任何值都会被翻译成真或假，这叫真值测试（truth value testing）。' +
      '讲义原话：Almost any value is evaluated to True if it has some sort of content, except 0, empty strings and other data structures。'
    },

    { t: 'table',
      head: ['值', 'bool(...) 结果', '说明'],
      rows: [
        ['<code>0</code>、<code>0.0</code>', '<code>False</code>', '数值零'],
        ['<code>""</code>', '<code>False</code>', '空字符串'],
        ['<code>[]</code>、<code>()</code>、<code>{}</code>', '<code>False</code>', '空容器'],
        ['<code>None</code>', '<code>False</code>', '空值，相当于 Java 的 null'],
        ['<code>"abc"</code>、<code>123</code>、<code>["apple"]</code>', '<code>True</code>', '有内容']
      ],
      caption: '布尔值只有 True / False 两种，首字母必须大写' },

    { t: 'p', html:
      '所以 <code>if thislist:</code> 等价于 <code>if len(thislist) &gt; 0:</code>。判断题常把 <code>bool([])</code> 和 <code>bool([0])</code> 放在一起：' +
      '前者 False，后者 True，因为后者里面确实装了一个元素 0。'
    },

    /* ---------------------------------------------------------------- 八 */
    { t: 'h', text: '八、f-string、字典与 PyCharm 工作流', id: 'ch15-8' },

    { t: 'p', html:
      'f-string（格式化字符串字面量）在字符串前加 <code>f</code>，花括号里的内容求值后替换进去。' +
      '它比 Java 的 <code>+</code> 拼接更短，比 <code>"%d" % x</code> 更好读：变量、表达式、字典取值都能直接写进花括号。'
    },

    { t: 'code', lang: 'python', run: false, caption: 'fstring.py · 变量、表达式、字典取值与格式说明符', code:
`name = "Tushar"
age = 23
print(f"Hello, My name is {name} and I am {age} years old.")

english = 78
maths = 56
hindi = 85
print(f"Ram got total marks {english + maths + hindi} out of 300")

Geek = {"Id": 112, "Name": "Harsh"}
print(f"Id of {Geek['Name']} is {Geek['Id']}")

score = 87.456
print(f"score = {score:.1f}")    # 87.5：保留 1 位小数
print(f"[{name:>10}]")           # 右对齐到 10 个字符宽
`
    },

    { t: 'p', html:
      '花括号里还能写表达式，如 <code>{english + maths + hindi}</code>；冒号后是格式说明符（format specifier），' +
      '<code>{score:.1f}</code> 保留一位小数。字典（dictionary）是键值对（key-value pair）的集合，' +
      '写法 <code>{"Id": 112, "Name": "Harsh"}</code>，用键取值正好塞进花括号；第 18 章会用字典做方向映射。'
    },

    { t: 'p', html:
      '最后是讲义里的综合示例：一个列表、一个循环、一个 if-else、两个结果列表，把本章零件装在一起。先预测输出，再看解释。'
    },

    { t: 'code', lang: 'python', run: false, caption: 'example.py · 讲义综合示例：按能否被 5 整除分组', code:
`numbers = [10, 15, 22, 33, 42, 55, 61, 70, 81, 90]
divisor = 5
divisible_by_divisor, not_divisible_by_divisor = [], []

for number in numbers:
    if number % divisor == 0:
        divisible_by_divisor.append(number)
    else:
        not_divisible_by_divisor.append(number)

print("Numbers divisible:", divisible_by_divisor)
print("Numbers not divisible:", not_divisible_by_divisor)
`
    },

    { t: 'p', html:
      '注意三处：<code>divisible_by_divisor, not_divisible_by_divisor = [], []</code> 是元组拆包（tuple unpacking），' +
      '一行给两个变量各赋一个空列表；<code>%</code> 判断整除；两个 <code>append</code> 分别把数送进两个列表。' +
      '输出里 list 自带的方括号和引号是 <code>print</code> 的默认表示，不是字符串拼接。'
    },

    { t: 'p', html:
      '课程用 PyCharm 写 Python，步骤和 IntelliJ IDEA 很像：<code>New Project</code> 选解释器（interpreter）→ 新建 <code>.py</code> 文件 → 右键 <code>Run</code>。' +
      'Python 不需要 <code>public static void main</code>，顶格语句就是入口；工程习惯上会写 <code>if __name__ == "__main__":</code>，第 18 章的 <code>SnakeGame</code> 正是用它。'
    },

    /* ---------------------------------------------------------------- 交互 */
    { t: 'p', html:
      '下面的实验台是 Java 与 Python 的语法对照：选一个维度，看同一个程序在两种语言里怎么落地。先在心里翻译一遍，再点开对照。'
    },

    { t: 'lab', id: 'pyjava' },

    { t: 'quiz', qid: 'ch15-q1' },
    { t: 'quiz', qid: 'ch15-q2' },
    { t: 'quiz', qid: 'ch15-q3' },

    /* ---------------------------------------------------------------- 收尾 */
    { t: 'keypoint', items: [
      { title: '两种语言', html: 'Java 静态类型 + 编译执行，强类型与性能见长；Python 动态类型 + 解释执行，简洁与可读性见长。' },
      { title: '缩进', html: '4 个空格表示从属关系；错误分 IndentationError（跑不起来）与逻辑错误（结果错）。' },
      { title: '变量与类型', html: '赋值即创建；<code>type()</code> 查类型；<code>str()</code>/<code>int()</code>/<code>float()</code> 转换；<code>int()</code> 向零截断。' },
      { title: 'list 取数据', html: '索引从 0，负索引从末尾，切片左闭右开，<code>in</code> 判断存在，越界抛 IndexError。' },
      { title: 'list 增删', html: '<code>append</code>/<code>insert</code> 增，<code>remove</code> 按值删，<code>del</code> 按位置删；加号生成新列表，<code>extend</code> 原地扩展。' },
      { title: '分支与真值', html: '<code>if/elif/else</code> 要冒号与缩进；<code>and/or/not</code> 短路；0、空串、空容器、<code>None</code> 为 False。' },
      { title: 'f-string', html: '花括号里可写变量与表达式；<code>:.1f</code> 控制小数位；字典用键取值。' }
    ] },

    { t: 'checklist', id: 'ch15', items: [
      '我能说出 Java 与 Python 在类型检查、执行方式上的两条核心差别',
      '我能解释为什么缩进不是排版而是语法，并说出两种缩进错误的区别',
      '我能用 type() 说出一个值的类型，并用 str()/int()/float() 完成转换',
      '我知道 int(3.9) 是 3，int("3.5") 会抛 ValueError',
      '我能写出 list 的创建、正负索引、[2:5] 切片与 in 判断',
      '我能说出 remove 与 del、加号拼接与 extend 的区别',
      '我能用 for value in、range(len(...))、while 三种方式遍历 list',
      '我能用 if/elif/else 与 and/or/not 写多分支，并解释短路求值',
      '我能列举至少四种在 Python 里为 False 的值，并说明 [0] 为什么是 True',
      '我能用 f-string 输出变量、表达式与保留小数位的格式化结果'
    ] },

    { t: 'callout', kind: 'exam', title: '这一章在考试里怎么考', html:
      'Python 部分以读代码、填空、判断为主，本章高频四类：<br>' +
      '① <b>问输出</b>：缩进层级、切片边界、<code>int()</code> 截断；<br>' +
      '② <b>判断题</b>：常放"Python 变量不需要声明所以没有类型""<code>int("3.5")</code> 得 3"这类半真半假的句子；<br>' +
      '③ <b>填空题</b>：填 <code>elif</code>、<code>append</code>、<code>extend</code>、<code>type</code> 等关键字；<br>' +
      '④ <b>简答题</b>：用 Python 重写一段 Java，评分看缩进、方法名与类型转换，不看花括号。<br>' +
      '<b>答题动作</b>：把 Java 的类型声明都当要删掉的东西，把每个花括号翻译成一层缩进。'
    },

    { t: 'callout', kind: 'ai', title: 'AI 时代这样学', html:
      '让 AI 当<b>双向翻译器</b>：① 把 Java 代码丢给它，要求逐行译成 Python 并标出语法差异；② 反过来让它译回 Java，检查有没有漏类型声明；' +
      '③ 让它出 5 道预测输出题，你先答、它给理由、你在本机验证。<br>' +
      '它在 Python 上最常错的是缩进层级与切片边界，凡是它给的代码，先在本机跑通再抄。'
    }

  ]
});
