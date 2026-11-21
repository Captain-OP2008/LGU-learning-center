/* =====================================================================
 * data/ch16.js · 第 16 章：Python 类与继承
 * 职责：把 Java 的类、this、继承、异常四块知识映射到 Python——class 与
 *       实例化、__init__、self、类属性 vs 实例属性、私有属性 name mangling、
 *       __str__、改/删属性、class Student(Person) 与 super()、方法重写、
 *       isinstance、try/except/else/finally、random 与 import。
 * 对外 API：CSC.registerChapter({...})（block schema 见 _dev/CONTRACT.md §4–§5）
 * 注意：Python 无法在站内引擎执行，本章所有代码块 run:false。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch16',
  num: '16',
  title: 'Python 类与继承',
  en: 'Python Classes & Inheritance',
  goals: [
    '能定义 class、用 __init__ 初始化实例，并说清 self 在方法里到底指谁',
    '能区分类属性与实例属性，说明私有属性 __name 的 name mangling 机制',
    '能实现 __str__、修改与删除属性及对象，并解释 del 的两种用法',
    '能用 class Student(Person) 与 super().__init__ 完成继承，并重写父类方法',
    '能用 try/except/else/finally 处理异常，用 import random 与 randint 生成随机数'
  ],
  kp: [
    { id: 'ch16-1', title: 'class 定义与实例化' },
    { id: 'ch16-2', title: '__init__ 与 self' },
    { id: 'ch16-3', title: '类属性 vs 实例属性' },
    { id: 'ch16-4', title: '私有属性与 name mangling' },
    { id: 'ch16-5', title: '__str__ 与属性的增删' },
    { id: 'ch16-6', title: '继承与 super()' },
    { id: 'ch16-7', title: '方法重写与 isinstance' },
    { id: 'ch16-8', title: 'try/except 与 random 模块' }
  ],
  blocks: [

    /* ---------------------------------------------------------------- 开篇 */
    { t: 'callout', kind: 'why', html:
      '第 18 章的贪吃蛇第一行就是 <code>class SnakeGame(tk.Tk):</code>——一个继承自 Tkinter 主窗口的类；' +
      '每个按键回调的第一个参数是 <code>self</code>，食物位置由 <code>random</code> 生成。没有这一章，项目代码一行都读不懂。<br>' +
      '好消息是：类、对象、继承、异常这些概念你在 Java 里已经学过，这里要换的只是写法。'
    },

    { t: 'p', lead: true, html:
      'Python 是面向对象语言，几乎一切都是对象。它的类语法比 Java 少一半：没有访问修饰符、没有接口、没有 <code>@Override</code>；' +
      '但有一件事必须多写——<b>每个方法的第一个参数都要显式写出 <code>self</code></b>。抓住这一点，整章就通了。'
    },

    /* ---------------------------------------------------------------- 一 */
    { t: 'h', text: '一、class 定义与实例化', id: 'ch16-1' },

    { t: 'p', html:
      '用 <code>class</code> 关键字定义<b>类（class）</b>，类像一张蓝图；用类名加括号创建<b>实例（instance）</b>，也叫对象（object）。' +
      '讲义的第一个例子只有两行：<code>class MyClass:</code> 下面缩进写 <code>x = 5</code>，然后 <code>p1 = MyClass()</code> 创建对象，' +
      '<code>print(p1.x)</code> 打印 5。注意类名首字母大写，类体靠缩进，没有花括号。'
    },

    { t: 'code', lang: 'python', run: false, caption: 'myclass.py · 最简单的类，以及带 __init__ 的类', code:
`class MyClass:
    x = 5

p1 = MyClass()        # 实例化：创建对象
print(p1.x)           # 5


class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

p2 = Person("John", 36)
print(p2.name)        # John
print(p2.age)         # 36
`
    },

    { t: 'p', html:
      '<b>__init__</b> 是构造方法（constructor）：创建对象时自动执行，用来给属性赋初值，相当于 Java 的构造器。' +
      '名字前后各两个下划线，这是 Python 的"魔术方法"约定。它在 <code>Person("John", 36)</code> 执行时被调用，' +
      '但你看不到显式调用——解释器替你做了。'
    },

    /* ---------------------------------------------------------------- 二 */
    { t: 'h', text: '二、self 是什么', id: 'ch16-2' },

    { t: 'p', html:
      '<b>self</b> 是当前实例的引用，作用与 Java 的 <code>this</code> 完全相同：<code>self.name</code> 就是"这个对象自己的 name"。' +
      '差别只有一处：Java 的 <code>this</code> 由编译器自动提供，Python 要求你把 <code>self</code> 写在方法参数表的第一位。' +
      '调用 <code>p1.myfunc()</code> 时，Python 自动把 <code>p1</code> 传给 <code>self</code>，所以你调用时不用写它。'
    },

    { t: 'code', lang: 'python', run: false, caption: 'person_method.py · 方法里的 self 指向调用它的那个对象', code:
`class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def myfunc(self):
        print("Hello my name is " + self.name)

p1 = Person("John", 36)
p1.myfunc()      # Hello my name is John
`
    },

    { t: 'compare', left: {
      title: '漏掉 self：调用时报 TypeError',
      code:
`def greet():
    print(self.name)

# p.greet()  → TypeError: greet() takes 0
# positional arguments but 1 was given`
    }, right: {
      title: '第一个参数写 self：正常执行',
      code:
`def greet(self):
    print(self.name)

# p.greet()  → John`
    } },

    { t: 'callout', kind: 'warn', title: 'self 的三个常见坑', html:
      '① 方法定义忘写 <code>self</code>，调用时会报 <code>TypeError: myfunc() takes 0 positional arguments but 1 was given</code>——' +
      '那个"多出来的 1"就是实例本身；② 写成 <code>def __init__(self)</code> 但忘了 <code>self.x = x</code>，属性根本没被创建；' +
      '③ <code>__init__</code> 前后各是<b>两个</b>下划线，只写一个就成了普通方法，创建对象时不会自动执行。'
    },

    /* ---------------------------------------------------------------- 三 */
    { t: 'h', text: '三、类属性 vs 实例属性', id: 'ch16-3' },

    { t: 'p', html:
      '直接写在类体里、不在任何方法中的变量是<b>类属性（class attribute）</b>，所有实例共享一份；' +
      '在方法里用 <code>self.x = ...</code> 创建的是<b>实例属性（instance attribute）</b>，每个对象各有一份。' +
      'Tutorial 8 的 <code>people</code> 类就把 <code>name</code>、<code>age</code>、<code>__weight</code> 先写成类属性，再在 <code>__init__</code> 里覆盖成实例属性。'
    },

    { t: 'code', lang: 'python', run: false, caption: 'attr.py · 类属性共享，实例属性各自独立', code:
`class Person:
    kind = "human"          # 类属性：所有实例共享

    def __init__(self, name):
        self.name = name    # 实例属性：每个对象一份

p1 = Person("John")
p2 = Person("Mike")

print(Person.kind)   # human：用类名访问
print(p1.kind)       # human：实例也能读到类属性
print(p1.name, p2.name)   # John Mike

p1.name = "Johnny"        # 只改 p1 自己的实例属性
print(p1.name, p2.name)   # Johnny Mike
`
    },

    { t: 'callout', kind: 'warn', title: '可变的类属性是"共享陷阱"', html:
      '如果类属性写成 <code>items = []</code>，那么所有实例读到的都是<b>同一个列表</b>：<code>p1.items.append(1)</code> 之后 <code>p2.items</code> 里也会出现 1。' +
      '需要每个对象独立的数据，一律在 <code>__init__</code> 里写 <code>self.items = []</code>。' +
      '第 18 章的 <code>self.snake</code> 就是这样创建的——不能写成类属性。'
    },

    /* ---------------------------------------------------------------- 四 */
    { t: 'h', text: '四、私有属性与 name mangling', id: 'ch16-4' },

    { t: 'p', html:
      '属性名以两个下划线开头（<code>self.__deposit</code>）表示<b>私有属性（private attribute）</b>，类外不能直接访问：' +
      '<code>p1.__deposit</code> 会抛 <code>AttributeError</code>，而通过类自己的方法 <code>p1.print_deposit()</code> 是可以的。' +
      '背后机制叫名字改写（<b>name mangling</b>）：Python 把 <code>__deposit</code> 悄悄改名成 <code>_Person__deposit</code>，' +
      '所以"私有"只是防误用，不是真正安全。'
    },

    { t: 'code', lang: 'python', run: false, caption: 'private.py · __deposit 只能通过类自己的方法访问', code:
`class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age
        self.__deposit = 1000       # name mangling 后叫 _Person__deposit

    def print_deposit(self):
        print("The deposit is", self.__deposit)

p1 = Person("John", 36)
p1.print_deposit()      # The deposit is 1000
# p1.__deposit          AttributeError
# p1.__deposit = 0      只是新建了一个普通属性，并没有改到私有的那个
`
    },

    { t: 'p', html:
      '和 Java 的 <code>private</code> 比：Java 的 private 由编译器和 JVM 强制执行，外部代码根本编译不过；' +
      'Python 的私有只是改名约定，你写 <code>p1._Person__deposit</code> 依然能访问。' +
      '考试里常问"<code>p1.__deposit</code> 能否访问"，标准答案是<b>不能直接访问，会 AttributeError</b>。'
    },

    /* ---------------------------------------------------------------- 五 */
    { t: 'h', text: '五、__str__ 与属性的增删', id: 'ch16-5' },

    { t: 'p', html:
      '<b>__str__</b> 控制对象被 <code>print</code> 时输出什么：不写它，打印出来是 <code>&lt;__main__.Person object at 0x...&gt;</code>；' +
      '写了它，<code>print(p1)</code> 就输出你返回的字符串。它对应 Java 的 <code>toString()</code>。' +
      '属性可以随时改：<code>p1.age = 40</code>；也可以用 <code>del p1.age</code> 删掉某个属性、<code>del p1</code> 删掉整个对象。'
    },

    { t: 'code', lang: 'python', run: false, caption: 'str_del.py · __str__、改属性、删属性、删对象', code:
`class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def __str__(self):
        return f"{self.name}({self.age})"

p1 = Person("John", 36)
print(p1)          # John(36)

p1.age = 40        # 改属性
print(p1)          # John(40)

del p1.age         # 删属性：之后 p1.age 会 AttributeError
del p1             # 删对象：变量 p1 本身也不存在了
`
    },

    { t: 'callout', kind: 'warn', title: 'del 之后不能再碰它', html:
      '<code>del p1.age</code> 只删属性，对象还在，<code>p1.name</code> 仍可读；<code>del p1</code> 删的是变量名指向的对象引用，' +
      '之后再写 <code>print(p1)</code> 会抛 <code>NameError</code>。判断题常把这两行放在一起，问"删属性会不会删对象"——不会。'
    },

    /* ---------------------------------------------------------------- 六 */
    { t: 'h', text: '六、继承与 super()', id: 'ch16-6' },

    { t: 'p', html:
      '<b>继承（inheritance）</b>让子类自动拥有父类的属性与方法。被继承的类叫父类（parent class）或基类（base class），' +
      '继承者叫子类（child class）或派生类（derived class）。Python 的写法是把父类放进 <code>class</code> 后面的括号：' +
      '<code>class Student(Person):</code>，对应 Java 的 <code>extends Person</code>。' +
      '子类要写自己的 <code>__init__</code> 时，必须先调 <code>super().__init__(...)</code> 把父类的初始化做完。'
    },

    { t: 'code', lang: 'python', run: false, caption: 'inherit.py · Student 继承 Person，super() 初始化父类', code:
`class Person:
    def __init__(self, fname, lname):
        self.firstname = fname
        self.lastname = lname

    def printname(self):
        print(self.firstname, self.lastname)


class Student(Person):
    def __init__(self, fname, lname):
        super().__init__(fname, lname)      # 先让父类把名字存好
        self.graduationyear = 2019          # 再补子类自己的属性

    def welcome(self):
        print("Welcome", self.firstname, self.lastname, self.graduationyear)


x = Person("John", "Doe")
x.printname()               # John Doe

s = Student("Mike", "Olsen")
s.printname()               # Mike Olsen：父类方法直接继承
s.welcome()                 # Welcome Mike Olsen 2019
`
    },

    { t: 'callout', kind: 'warn', title: '漏掉 super().__init__ 的后果', html:
      '子类写了 <code>__init__</code> 却不调用 <code>super().__init__(...)</code>，父类那部分属性就<b>完全不会被创建</b>，' +
      '后面访问 <code>self.firstname</code> 直接 <code>AttributeError</code>。' +
      '另外 <code>super()</code> 后面不加 <code>self</code>；Tutorial 8 里还有旧写法 <code>people.__init__(self, n, a, w)</code>，两种都能用，课程讲义推荐 <code>super()</code>。'
    },

    /* ---------------------------------------------------------------- 七 */
    { t: 'h', text: '七、方法重写与 isinstance', id: 'ch16-7' },

    { t: 'p', html:
      '子类定义一个与父类同名的方法，就叫<b>方法重写（method overriding）</b>：调用时按对象的实际类型选方法，' +
      '和 Java 的多态一样。Java 要写 <code>@Override</code> 注解让编译器检查，Python 什么注解都不用——同名的写法本身就是重写。' +
      '<code>isinstance(对象, 类)</code> 判断一个对象是不是某个类（含其子类）的实例，对应 Java 的 <code>instanceof</code>。'
    },

    { t: 'code', lang: 'python', run: false, caption: 'override.py · 子类重写 speak，isinstance 判断归属', code:
`class people:
    def speak(self):
        print("I am a person")

class student(people):
    def speak(self):            # 重写父类方法
        print("I am a student")

p = people()
s = student()

p.speak()                       # I am a person
s.speak()                       # I am a student

print(isinstance(s, student))   # True
print(isinstance(s, people))    # True：子类实例也是父类的一个实例
print(isinstance(p, student))   # False
`
    },

    { t: 'p', html:
      '继承还带来两个"免写"的好处：父类的方法子类不用重写就能用（上面 <code>printname</code> 就是），' +
      '子类也可以在自己的方法里用 <code>super().方法名()</code> 调用父类被重写掉的版本。' +
      '判断继承关系是否成立，只问一句"子类 IS-A 父类吗"——Student IS-A Person 成立，SnakeGame IS-A Tk 也成立。'
    },

    /* ---------------------------------------------------------------- 八 */
    { t: 'h', text: '八、try/except 与 random 模块', id: 'ch16-8' },

    { t: 'p', html:
      '<b>异常（exception）</b>是程序运行时出的错。Python 用 <code>try</code> 包住可能出错的代码，用 <code>except</code> 捕获并处理；' +
      '<code>else</code> 在没有异常时执行，<code>finally</code> 无论成功失败都执行（用来关文件、释放资源最合适）。' +
      '四块的分工是本章最容易被填空题盯上的地方。'
    },

    { t: 'table',
      head: ['块', '什么时候执行', '典型用途'],
      rows: [
        ['<code>try</code>', '总是先执行，里面放可能出错的代码', '读文件、类型转换、除零'],
        ['<code>except</code>', 'try 里抛异常时执行', '打印错误提示、给默认值'],
        ['<code>else</code>', 'try 里没有异常时执行', '成功后的后续处理'],
        ['<code>finally</code>', '无论有没有异常都执行', '关文件 <code>f.close()</code>、清理']
      ],
      caption: '课程示例：open 文件写入放在 try，出错走 except，最后 finally 关文件' },

    { t: 'code', lang: 'python', run: false, caption: 'except.py · try / except / else / finally 四块齐全', code:
`try:
    n = int(input("Please input a number: "))
    print(100 / n)
except ValueError:
    print("That is not a number")
except ZeroDivisionError:
    print("Cannot divide by zero")
else:
    print("Everything went fine")
finally:
    print("Done, no matter what happened")
`
    },

    { t: 'p', html:
      '课程讲义里的例子更贴近项目：<code>f = open("demofile.txt")</code> 放进 try，<code>f.write(...)</code> 出错走 <code>except</code> 打印提示，' +
      '<code>finally</code> 里 <code>f.close()</code>。讲义用的是不带类型的 <code>except:</code>，它会捕获所有异常；' +
      '自己写代码时更推荐写具体类型（如上例），免得把真正的 bug 也吞掉。'
    },

    { t: 'p', html:
      '最后是 <b>random</b> 模块（module）：Python 用 <code>import 模块名</code> 引入标准库，之后用 <code>random.randint(a, b)</code> 生成随机整数。' +
      '注意 randint 的区间是<b>两端都包含</b>的，<code>random.randint(0, 10)</code> 可能得到 0 或 10。' +
      '讲义明确写了它的用途：<b>生成贪吃蛇里食物的位置</b>——第 18 章的 <code>create_food</code> 就是用它把格子坐标随机抽出来。'
    },

    { t: 'code', lang: 'python', run: false, caption: 'rand.py · import random 与 randint 两端都包含', code:
`import random

r1 = random.randint(0, 10)
print("Random number between 0 and 10 is", r1)

# 也可以只导入需要的函数
from random import randint
print(randint(0, 10))
`
    },

    { t: 'p', html:
      '三种导入写法要分清：<code>import random</code> 后用 <code>random.randint</code>；<code>from random import randint</code> 后直接写 <code>randint</code>；' +
      '<code>from tkinter import *</code> 把整个模块的名字全导进来（第 17 章会见到）。前两种更安全，第三种写起来最短。'
    },

    /* ---------------------------------------------------------------- 交互 */
    { t: 'p', html:
      '下面的实验台把 <code>__init__</code>、<code>self</code>、私有属性与 <code>super()</code> 的调用过程画出来：' +
      '创建对象时哪一行在跑、<code>self</code> 指向谁、子类初始化时父类如何被调用。'
    },

    { t: 'lab', id: 'pyclass' },

    { t: 'quiz', qid: 'ch16-q1' },
    { t: 'quiz', qid: 'ch16-q2' },
    { t: 'quiz', qid: 'ch16-q3' },

    /* ---------------------------------------------------------------- 收尾 */
    { t: 'keypoint', items: [
      { title: '类与实例', html: '<code>class MyClass:</code> 定义蓝图，<code>MyClass()</code> 创建对象；类名首字母大写，类体靠缩进。' },
      { title: 'self', html: '当前实例的引用，等于 Java 的 <code>this</code>，但必须写在方法第一个参数；调用时由解释器自动传入。' },
      { title: '两种属性', html: '类属性全实例共享；<code>self.x</code> 是实例属性，每个对象一份；可变数据放 <code>__init__</code>。' },
      { title: '私有属性', html: '<code>__deposit</code> 外部不能直接访问，会被 name mangling 改名成 <code>_Person__deposit</code>。' },
      { title: '__str__ 与 del', html: '<code>__str__</code> 决定 <code>print(对象)</code> 的输出，等于 Java 的 toString；<code>del</code> 可删属性或对象。' },
      { title: '继承', html: '<code>class Student(Person):</code>；子类写 <code>__init__</code> 必须 <code>super().__init__(...)</code>。' },
      { title: '重写与异常', html: '同名方法即重写，<code>isinstance</code> 判断类型；异常四块 try/except/else/finally；<code>randint(a, b)</code> 两端都包含。' }
    ] },

    { t: 'checklist', id: 'ch16', items: [
      '我能写出一个带 __init__ 的类并创建两个互不影响的实例',
      '我能解释 self 指向谁，以及为什么调用方法时不用传它',
      '我能说出类属性与实例属性的区别，并说明可变类属性的共享陷阱',
      '我知道 p1.__deposit 为什么不能直接访问，以及 _Person__deposit 是什么',
      '我能用 __str__ 让 print(对象) 输出想要的内容，并区分 del 属性与 del 对象',
      '我能写出 class Student(Person)，并用 super().__init__ 初始化父类部分',
      '我能说明子类重写方法与 Java @Override 的差别，会用 isinstance 判断类型',
      '我能说出 try/except/else/finally 四块各自什么时候执行',
      '我能用 import random 与 randint(a, b) 生成指定范围内的随机整数'
    ] },

    { t: 'callout', kind: 'exam', title: '这一章在考试里怎么考', html:
      '本章是 Python 简答题的主力，四类必刷：<br>' +
      '① <b>读代码写输出</b>：给一个带 <code>__init__</code>、子类与 <code>__str__</code> 的类，问 <code>print</code> 结果——注意 <code>self</code> 与属性名是否一致；<br>' +
      '② <b>填空</b>：补 <code>self</code>、<code>__init__</code>、<code>super().__init__(...)</code> 里缺的部分；<br>' +
      '③ <b>判断</b>：常考"私有属性在类外完全不能访问""子类实例也是父类实例""<code>__str__</code> 不写也能打印对象"；<br>' +
      '④ <b>简答</b>：解释 <code>self</code> 的作用、类属性与实例属性的区别、name mangling 是什么。<br>' +
      '<b>答题动作</b>：看到类先找 <code>__init__</code>，列出每个属性的创建位置；看到继承先看有没有 <code>super().__init__</code>。'
    },

    { t: 'callout', kind: 'ai', title: 'AI 时代这样学', html:
      '让 AI 做<b>对照教练</b>：① 给它一段 Java 类，要求翻译成 Python，并逐条解释 <code>this</code> 怎么变成 <code>self</code>、<code>@Override</code> 为什么消失；' +
      '② 把 SnakeGame 的 <code>__init__</code> 贴给它，让它标出每个 <code>self.x</code> 属于实例属性还是类属性；' +
      '③ 让它出 5 道"这个访问会不会报错"的判断题，你判断后再让它解释。<br>' +
      'AI 常错的点：把 <code>super().__init__()</code> 写成 <code>super().__init__(self)</code>、漏掉 <code>self</code> 参数、把私有属性说成"完全安全"。'
    }

  ]
});
