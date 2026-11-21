/* =====================================================================
 * data/ch04.js · 第 04 章：函数与分解
 * 职责：讲清 def、参数与返回值、提前返回、局部变量与作用域、
 *       docstring / 默认参数 / 前后置条件，以及自顶向下的分解方法。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch04',
  num: '04',
  title: '函数与分解',
  en: 'Functions & Decomposition',
  goals: [
    '能写出带参数和返回值的函数，并区分"定义"与"调用"',
    '能解释有 return 与只 print 的函数在用途上有什么本质差别',
    '能用提前返回把特殊情况挡在主逻辑之外',
    '能判断一个变量属于哪个作用域，并通过返回值而不是全局变量传递结果',
    '能把一个中等规模的程序拆成若干个职责单一的函数'
  ],
  kp: [
    { id: 'ch04-1', title: '函数：给一段逻辑起名字' },
    { id: 'ch04-2', title: '参数与返回值' },
    { id: 'ch04-3', title: 'return 与提前返回' },
    { id: 'ch04-4', title: '局部变量与作用域' },
    { id: 'ch04-5', title: 'docstring、默认参数与契约' },
    { id: 'ch04-6', title: '调用栈与自顶向下分解' }
  ],
  blocks: [

    { t: 'callout', kind: 'why', html:
      '前三章的程序都是"一口气写到底"：一行接一行，越来越长。问题一变复杂，' +
      '这种写法就会同时失去三样东西——<b>读得懂</b>（一段代码在干什么要靠猜）、' +
      '<b>改得动</b>（牵一发动全身）、<b>测得清</b>（错了不知道是哪一段的锅）。' +
      '函数是控制复杂度的基本工具：它把一段逻辑<b>打包、命名、隔离、复用</b>。' +
      '这一章的动作是"写函数"，但真正的目标是"用函数思考"。'
    },

    { t: 'p', lead: true, html:
      '函数的价值不在于"少写几行"，而在于<b>给逻辑起一个名字</b>。' +
      '名字一旦起好，你就可以在更高的层次上思考：主流程里只需要看见"算面积""算运费"，' +
      '而不必每次都被乘法和除法拖进细节。'
    },

    { t: 'h', text: '一、函数：给一段逻辑起名字', id: 'ch04-1' },

    { t: 'p', html:
      '<code>def</code> 是 define 的缩写，用来<b>定义</b>一个函数。结构是：' +
      '<code>def</code> + 函数名 + 圆括号里的参数 + <b>冒号</b>，下面是缩进的函数体。' +
      '定义本身<b>不会执行</b>函数体，它只是把这段代码"登记"到一个名字下面；' +
      '真正执行发生在<b>调用</b>时：写 <code>函数名(实参)</code>。'
    },

    { t: 'code', lang: 'python', caption: '定义、调用、返回一个值', code:
`def circle_area(radius):
    """返回半径为 radius 的圆面积。"""
    return 3.14159 * radius * radius


print(f'{circle_area(2):.2f}')     # 12.57
print(f'{circle_area(5):.2f}')     # 78.54
` },

    { t: 'p', html:
      '这段代码里有三个新东西。<code>radius</code> 是<b>形参</b>，是函数内部使用的名字；' +
      '调用时写进去的 <code>2</code> 和 <code>5</code> 是<b>实参</b>，是真正传进去的值；' +
      '<code>return</code> 把算出来的结果<b>交回给调用处</b>，所以 ' +
      '<code>circle_area(2)</code> 整体可以当成一个值，放进 f-string 里使用。'
    },

    { t: 'callout', kind: 'note', title: '定义不等于执行', html:
      '把 <code>def</code> 块写完并保存，程序什么也不会打印——函数体只是被登记了。' +
      '文件里可以有没人调用的函数，它不会产生任何效果。' +
      '这也意味着<b>函数写错了，只要没被调用过，就暂时不会暴露</b>；' +
      '所以每写完一个函数，立刻用几组数据调用它看看结果，比全部写完后一起跑高效得多。'
    },

    { t: 'h', text: '二、参数与返回值', id: 'ch04-2' },

    { t: 'p', html:
      '参数让函数"同一段逻辑处理不同数据"，返回值让函数"把结果交出去"。' +
      '两者合起来，函数才成为一个可以组合的零件。下面先看只有参数、没有返回值的版本。'
    },

    { t: 'code', lang: 'python', caption: '有参数、但只负责打印的函数', code:
`def greet(name):
    print(f'你好，{name}！')


greet('小明')       # 你好，小明！
greet('小红')       # 你好，小红！
` },

    { t: 'p', html:
      '多个参数按<b>位置</b>一一对应：调用时第一个实参给第一个形参，第二个给第二个。' +
      '所以顺序写反了不会报错，只会算出一个奇怪的数——这也是函数要起好参数名的原因。'
    },

    { t: 'code', lang: 'python', caption: '两个参数：位置决定谁是谁', code:
`def rectangle_area(width, height):
    return width * height


print(rectangle_area(3, 4))     # 12：3 给 width，4 给 height
print(rectangle_area(4, 3))     # 12：乘法交换，结果一样
print(rectangle_area(5, 2))     # 10
` },

    { t: 'p', html:
      '接下来是本课最重要的一组对比：<b>打印</b>和<b>返回</b>不是一回事。' +
      '打印是把值送到屏幕，函数本身仍然"什么也没交出去"；' +
      '返回是把值交回调用处，可以继续参与计算、存进变量、传给另一个函数。'
    },

    { t: 'code', lang: 'python', caption: '打印 vs 返回：同一件事的两种写法', code:
`def area_print(w, h):
    print(w * h)              # 只打印，没有 return


def area_return(w, h):
    return w * h              # 把结果交回去


x = area_print(3, 4)          # 屏幕显示 12
print(x)                      # None：函数没有返回值

y = area_return(3, 4)         # 屏幕什么都不显示
print(y)                      # 12
print(y * 2)                  # 24：结果还能继续算
` },

    { t: 'table', head: ['函数结束的方式', '调用处拿到什么', '能用它做什么'], rows: [
      ['<code>return 值</code>', '那个值', '参与计算、存进变量、再作为实参传给下一个函数'],
      ['<code>return</code>（后面不写值）', '<code>None</code>', '只能判断"有没有结果"，不能当数字用'],
      ['函数体执行完，没有 return', '<code>None</code>', '通常说明这个函数只负责打印或修改数据']
    ] },

    { t: 'compare', left: {
      title: '用 print 当结果', html: '函数往屏幕输出一个数字，看起来"成功了"，' +
        '但调用处拿到的是 <code>None</code>。之后一旦把它当数字用，就会报 ' +
        '<code>TypeError</code>，而错误地点离真正的原因很远。'
    }, right: {
      title: '用 return 交结果', html: '函数安静地返回一个值，调用处想打印就打印、' +
        '想继续算就继续算、想存起来就存起来。<b>能做决定的是调用者，不是函数。</b>'
    } },

    { t: 'callout', kind: 'warn', title: '忘记写 return 是最隐蔽的 bug 之一', html:
      '函数里把结果算出来、打印出来，却忘了 <code>return</code>，它返回的就是 ' +
      '<code>None</code>。现象常常是几步之后才报 "<code>NoneType</code> 不支持某个运算"，' +
      '新手会去改报错那一行，其实问题在几行之前。' +
      '<b>排查方法：先把函数调用的返回值打印出来看一眼。</b>'
    },

    { t: 'h', text: '三、return 与提前返回', id: 'ch04-3' },

    { t: 'p', html:
      '<code>return</code> 有两个作用：把值交回去，以及<b>立刻结束整个函数</b>。' +
      '它后面的语句不会再执行。利用这一点，可以把"特殊情况"挡在函数开头，' +
      '主逻辑留在最外层——这种写法叫<b>提前返回</b>（也叫卫语句）。'
    },

    { t: 'code', lang: 'python', caption: '提前返回：不合法就不往下走', code:
`def classify(score):
    if score < 0 or score > 100:
        return '无效分数'        # 特殊情况在这里就结束

    if score >= 90:
        return 'A'
    if score >= 80:
        return 'B'
    if score >= 60:
        return '及格'
    return '不及格'


print(classify(95))     # A
print(classify(72))     # 及格
print(classify(120))    # 无效分数
` },

    { t: 'p', html:
      '另一种常见用法是"出错时返回一个空值，让调用者自己决定怎么办"。' +
      '注意这不代表可以随便返回 <code>None</code>：调用者必须知道这个约定，' +
      '所以下一节会讲怎么把它写进文档。'
    },

    { t: 'code', lang: 'python', caption: '提前返回处理异常输入', code:
`def safe_divide(a, b):
    if b == 0:
        return None           # 除数为 0：不计算，直接交回 None
    return a / b


print(safe_divide(10, 2))     # 5.0
print(safe_divide(10, 0))     # None
` },

    { t: 'callout', kind: 'tip', title: '把嵌套"压平"', html:
      '嵌套三层的 <code>if</code> 读起来很累，而且每一层都要在脑子里记住"现在满足哪些条件"。' +
      '把不满足条件的情况在函数开头用 <code>return</code> 打掉，主逻辑就只剩一层缩进。' +
      '这条技巧对任何函数都适用：<b>先排除异常，再处理正常。</b>'
    },

    { t: 'h', text: '四、局部变量与作用域', id: 'ch04-4' },

    { t: 'p', html:
      '函数内部创建的名字（包括参数）都是<b>局部变量</b>，它们只在函数执行期间存在，' +
      '函数一返回就消失。不同函数里的同名变量互不干扰，函数里也看不见外面定义的名字' +
      '——除非你显式把它当参数传进去。'
    },

    { t: 'code', lang: 'python', caption: '局部变量：出了函数就不存在', code:
`def double(n):
    result = n * 2          # result 是局部变量
    return result


x = double(5)
print(x)                    # 10

# print(result)             # NameError：result 只在函数内部存在
` },

    { t: 'code', lang: 'python', caption: '两个同名的 x 互不影响', code:
`x = 10                      # 这是一个全局变量


def f():
    x = 999                 # 这是 f 内部的局部变量，和上面的 x 无关
    return x


print(f())                  # 999
print(x)                    # 10：外面的 x 没有被改动
` },

    { t: 'p', html:
      '那函数怎么"改变外面的世界"？答案是：<b>通过返回值</b>。' +
      '把新值交回去，由调用者决定要不要更新外部变量。这样数据流向是清楚的：' +
      '进函数的是参数，出函数的是返回值，中间发生的事不留下隐藏的副作用。'
    },

    { t: 'code', lang: 'python', caption: '用返回值更新外部变量', code:
`def add_one(n):
    return n + 1


count = 0
count = add_one(count)      # 把结果接回来，再赋给 count
print(count)                # 1
` },

    { t: 'callout', kind: 'warn', title: '本课的约定：不靠全局变量传结果', html:
      'Python 允许在函数里读写全局变量，但本课不这么写。' +
      '依赖全局变量的函数像一个"黑箱"：你不知道它读了哪些外部数据、又偷偷改了哪些，' +
      '复用时处处踩雷。约定是：<b>参数进，返回值出，中间不碰外部变量。</b>' +
      '（第 7 章会看到列表这类数据可以被函数原地修改，那是另一回事。）'
    },

    { t: 'h', text: '五、docstring、默认参数与契约', id: 'ch04-5' },

    { t: 'p', html:
      '函数是写给别人（包括三个月后的自己）用的。别人只看调用处，不会去读函数体，' +
      '所以必须有<b>文档字符串</b>（docstring）：写在函数体第一行的三引号字符串，' +
      '说明这个函数做什么、参数含义、返回什么。'
    },

    { t: 'code', lang: 'python', caption: 'docstring 与默认参数', code:
`def paint_cost(width, height, price_per_sqm=80):
    """计算刷墙费用。

    width, height：墙的宽和高，单位米
    price_per_sqm：每平方米单价，默认 80 元
    返回：总费用（元），保留两位小数
    """
    area = width * height
    return round(area * price_per_sqm, 2)


print(paint_cost(3, 4))          # 960：单价用默认值 80
print(paint_cost(3, 4, 120))     # 1440：单价显式传 120
` },

    { t: 'p', html:
      '<b>默认参数</b>让常见情况不用重复写值：调用时省略就取默认值。' +
      '规则只有一条硬性的——<b>带默认值的参数必须放在不带默认值的参数后面</b>，' +
      '否则 Python 无法判断省略的实参到底补给谁。'
    },

    { t: 'code', lang: 'python', caption: '默认参数的顺序规则', code:
`def f(a, b=1):
    return a + b


print(f(10))       # 11：b 用默认值
print(f(10, 5))    # 15：b 显式传入

# 下面这种写法是语法错误：有默认值的参数跑到了前面
# def g(a=1, b):
#     return a + b
` },

    { t: 'h', text: '前置条件与后置条件', lvl: 3 },

    { t: 'p', html:
      '把函数看成一份<b>契约</b>：调用者承诺满足<b>前置条件</b>，函数承诺实现<b>后置条件</b>。' +
      '前置条件写不清，调用者就会乱传数据；后置条件写不清，函数内部怎么改都可能出问题。' +
      '契约最应该写进 docstring，而不是靠口头约定。'
    },

    { t: 'table', head: ['契约项', '含义', '例子'], rows: [
      ['前置条件', '调用前必须为真；通常由调用者保证，或由函数显式检查', '<code>average(a, b)</code> 要求 a、b 都是数字'],
      ['后置条件', '函数正常返回时保证成立的事', '返回 <code>(a + b) / 2</code>，类型为 float'],
      ['异常约定', '什么情况下不返回正常值，而是返回 None 或抛异常', '<code>safe_divide(a, 0)</code> 返回 <code>None</code>']
    ] },

    { t: 'code', lang: 'python', caption: '把契约写进 docstring', code:
`def average(a, b):
    """返回 a 和 b 的平均值。

    前置条件：a、b 都是 int 或 float
    后置条件：返回 (a + b) / 2，结果类型为 float
    """
    return (a + b) / 2


print(average(80, 90))       # 85.0
` },

    { t: 'callout', kind: 'tip', title: '先想清楚契约，再写函数体', html:
      '动手写 <code>def</code> 之前，先用一句话回答三个问题：' +
      '<b>它拿到什么？它交回什么？什么情况下它做不到？</b>' +
      '这三个答案就是参数、返回值和异常处理。想不清楚，说明这段逻辑还没拆干净。'
    },

    { t: 'h', text: '六、调用栈与自顶向下分解', id: 'ch04-6' },

    { t: 'p', html:
      '函数里可以调用别的函数，于是形成一条<b>调用链</b>。每进入一个函数，Python 就在' +
      '<b>调用栈</b>上压一层，记住"我是从哪里来的、等一下回到哪里去"；函数返回时弹掉这一层。' +
      '报错时那一长串 <code>Traceback</code>，显示的就是当时栈里剩下的层次。'
    },

    { t: 'code', lang: 'python', caption: '三层调用：main → sum_of_squares → square', code:
`def square(n):
    return n * n


def sum_of_squares(a, b):
    return square(a) + square(b)


def main():
    result = sum_of_squares(3, 4)
    print(result)               # 25


main()
` },

    { t: 'flow', dir: 'v', nodes: [
      { title: 'main()', desc: '调用 sum_of_squares(3, 4)', kind: 'proc' },
      { title: 'sum_of_squares(3, 4)', desc: '调用 square(3) 和 square(4)', kind: 'proc' },
      { title: 'square(3) → 9', desc: '返回，弹出这一层', kind: 'proc' },
      { title: 'square(4) → 16', desc: '返回，弹出这一层', kind: 'proc' },
      { title: '9 + 16 = 25', desc: '回到 main，打印结果', kind: 'decide' }
    ] },

    { t: 'p', html:
      '读 traceback 的正确姿势是<b>从下往上</b>：最下面一行说错误是什么，' +
      '它上面一行说错误发生在哪个函数、哪一行；再往上是"谁调用了它"。' +
      '这样你能很快判断问题出在"被调用的函数内部"，还是"调用者传错了数据"。'
    },

    { t: 'p', html:
      '有了函数，就可以用<b>自顶向下分解</b>的方法写程序：先写主流程，' +
      '把每个"做什么"替换成一个函数名，再逐个实现。先骨架、后血肉。'
    },

    { t: 'steps', items: [
      { title: '先写主流程', html: '用几行接近自然语言的代码写出整体步骤：读入数据 → 计算 → 输出。' },
      { title: '每个动词变成一个函数名', html: '<code>read_weight()</code>、' +
        '<code>shipping_fee()</code>、<code>total_cost()</code>、<code>main()</code>。' +
        '此时函数体可以先空着或写一句 <code>pass</code>。' },
      { title: '逐个实现，逐个验证', html: '每写完一个函数，立刻用几组数据调用它，确认前置条件和后置条件都对。' },
      { title: '回头调整接口', html: '实现时发现参数不够用、返回值不合适，就回来改主流程。主流程本来就是草稿。' }
    ] },

    { t: 'code', lang: 'python', caption: '综合：分解成四个函数的运费计算程序', code:
`def read_number(prompt):
    """显示提示语，读入一行并转换成 float 返回。"""
    text = input(prompt)
    return float(text)


def shipping_fee(weight):
    """按重量计算运费：首重 1 公斤 10 元，超出部分每公斤 5 元。

    前置条件：weight >= 0
    后置条件：返回不小于 10 的 float
    """
    if weight <= 1:
        return 10.0
    return 10.0 + (weight - 1) * 5


def total_cost(weight, price):
    """商品价 + 运费。"""
    return price + shipping_fee(weight)


def main():
    weight = read_number('重量（kg）：')
    price = read_number('商品价格：')

    fee = shipping_fee(weight)
    total = total_cost(weight, price)

    print(f'商品 {price:.2f} 元，运费 {fee:.2f} 元，合计 {total:.2f} 元')


main()
` },

    { t: 'p', html:
      '注意 <code>main()</code> 不是 Python 的语法规定，而是一种约定：' +
      '它把"程序从哪里开始"变成一个可以一眼找到的位置。' +
      '读代码的人先看 <code>main</code> 里的五行动词，就理解了整体，' +
      '需要细节时再跳进对应的函数。'
    },

    { t: 'compare', left: {
      title: '一个巨型函数', html: '两百行从头写到尾：读输入、算运费、判折扣、拼字符串全混在一起。' +
        '改一处要看完整段，测试只能整段跑，报错时也不知道是哪件事出了问题。'
    }, right: {
      title: '若干小函数', html: '每个函数只做一件事，名字就是说明书；' +
        '可以单独调用、单独验证、单独替换。<b>复杂度被关进了函数内部，不再泄漏到主流程。</b>'
    } },

    { t: 'callout', kind: 'tip', title: '拆分到多小才合适', html:
      '经验规则：一个函数只做<b>一件事</b>，能在一屏内读完，名字里不需要出现"和"字。' +
      '如果发现函数名要用 <code>and</code>、<code>然后</code> 才能说清，通常就该再拆一次。' +
      '但也不必拆得粉碎——三个只有一行的函数如果从不被复用，合并回去反而更清楚。'
    },

    { t: 'keypoint', items: [
      { title: '定义与调用', html: '<code>def</code> 只是登记函数体，调用时才执行；实参按位置对应形参。' },
      { title: '返回而不是打印', html: '函数用 <code>return</code> 把结果交给调用者；没有 return 就返回 <code>None</code>。' },
      { title: '提前返回', html: '<code>return</code> 会立刻结束函数；用它在开头排除异常情况，能把嵌套压平。' },
      { title: '作用域', html: '函数内的名字是局部变量；函数通过参数拿数据，通过返回值交结果。' },
      { title: '契约', html: 'docstring 写清前置条件、后置条件与异常约定；默认参数必须放在参数列表末尾。' },
      { title: '分解', html: '自顶向下：先写主流程，再把每个动词实现成函数；调用栈模型帮助读懂 traceback。' }
    ] },

    { t: 'checklist', id: 'ch04', items: [
      '我能写出一个带两个参数、一个返回值的函数并正确调用它',
      '我能解释为什么"只 print 不 return"的函数不能参与后续计算',
      '我能把一段嵌套的条件判断改写成提前返回的写法',
      '我能说出函数内部的变量在函数返回后发生了什么',
      '我能给函数写一段包含前置条件与后置条件的 docstring',
      '我能说明默认参数为什么必须放在参数列表后面',
      '我能画出一次三层函数调用的过程，并从下往上读懂 traceback',
      '我能把一个 30 行左右的程序拆成 3 到 4 个职责单一的函数'
    ] }
  ]
});
