/* =====================================================================
 * data/ch01.js · 第 01 章：第一个 Python 程序
 * 职责：从一次函数调用开始，讲清 print、字符串字面量、表达式求值、
 *       注释、变量初识、命名规范、缩进与代码块，以及程序从写到跑的过程。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch01',
  num: '01',
  title: '第一个 Python 程序',
  en: 'First Program',
  goals: [
    '能说出函数调用、参数、语句、表达式这四个词各指什么',
    '能用 print 输出字符串、数字和多项内容，并解释引号与转义的作用',
    '能按优先级心算简单表达式的值，并知道括号如何改变求值顺序',
    '能写出带注释、命名规范、缩进正确的 Python 程序',
    '能描述一段代码从保存到出现输出（或报错）的完整过程'
  ],
  kp: [
    { id: 'ch01-1', title: '函数调用：请 Python 替你做事' },
    { id: 'ch01-2', title: 'print 与字符串字面量' },
    { id: 'ch01-3', title: '表达式与求值顺序' },
    { id: 'ch01-4', title: '注释、变量与命名' },
    { id: 'ch01-5', title: '缩进与代码块' },
    { id: 'ch01-6', title: '程序的生命周期' }
  ],
  blocks: [

    { t: 'callout', kind: 'why', html:
      '这一章要写的程序小得可怜：让屏幕上出现一句话。但就在这几行里，' +
      '藏着后面 9 章反复出现的全部基本零件——<b>函数调用</b>、<b>参数</b>、' +
      '<b>表达式</b>、<b>语句</b>、<b>注释</b>、<b>缩进</b>、<b>报错</b>。' +
      '先把这些零件的名字和边界弄清楚，后面学循环、函数、列表时，' +
      '才不会出现"每个字都认识、连起来看不懂"的状态。'
    },

    { t: 'p', lead: true, html:
      '先看一个完整的、能跑的程序。它只有一行，却已经完成了一次真正的"对话"：' +
      '你对 Python 说"把这句话打印出来"，它照做，然后屏幕上出现了结果。'
    },

    { t: 'code', lang: 'python', caption: 'hello.py · 本课的第一个程序', code:
`# 文件名叫 hello.py
print('Hello, Python!')
` },

    { t: 'p', html:
      '把这一行拆开看，只有三个部分。<code>print</code> 是一个<b>函数名</b>，' +
      '一对圆括号表示"我要调用它"，括号里的 <code>&#39;Hello, Python!&#39;</code> ' +
      '是这次调用交给它的<b>参数</b>。运行后屏幕上出现的并不包含引号——' +
      '引号只是告诉 Python "这是一段文本"的边界，本身不输出。'
    },

    { t: 'h', text: '一、函数调用：请 Python 替你做事', id: 'ch01-1' },

    { t: 'p', html:
      '写程序的大部分时间，你都在做同一件事：<b>把别人已经写好、起好了名字的一段代码叫过来用</b>。' +
      '这个动作就叫<b>函数调用</b>，写法固定为 <code>函数名(参数, 参数, ...)</code>。' +
      '你可以把它想成点菜：先报菜名（函数名），再提要求（参数），厨房（函数内部）怎么做你不用管，' +
      '只要知道端上来的是什么。'
    },

    { t: 'code', lang: 'python', caption: '几种最基础的调用形态', code:
`print()                  # 参数为空：只输出一个换行，等于空一行
print('你好')             # 一个字符串参数
print(123)               # 一个数字参数，注意这里没有引号
print('答案：', 42)        # 两个参数用逗号隔开，输出时默认用空格分隔
` },

    { t: 'p', html:
      '参数不一定是"写死的值"，也可以是一段能算出结果的表达式。' +
      '<code>print(2 + 3)</code> 的执行顺序是：先把 <code>2 + 3</code> 算成 <code>5</code>，' +
      '再把 <code>5</code> 交给 <code>print</code> 输出。也就是说，<b>参数会先被求值，然后才发生调用</b>。'
    },

    { t: 'p', html:
      '再强调一次措辞上的区别，这是后面读代码时最常用的判断：' +
      '<b>定义</b>一个函数是"写菜谱"，只在文件里留下一段说明；' +
      '<b>调用</b>一个函数才真的"下单做菜"，会产生实际效果。这一章里你写的每一行 ' +
      '<code>print(...)</code> 都是调用，没有定义。'
    },

    { t: 'terms', items: [
      { en: 'function', zh: '函数', html: '一段有名字、可以被反复调用的代码，例如 <code>print</code>。' },
      { en: 'call', zh: '调用', html: '写下 <code>函数名(参数)</code> 让函数真正执行的动作。' },
      { en: 'argument', zh: '参数（实参）', html: '调用时括号里交给函数的具体值或表达式。' },
      { en: 'statement', zh: '语句', html: '程序里的一"句"，例如一次函数调用、一次赋值。' },
      { en: 'expression', zh: '表达式', html: '能算出唯一一个值的写法，例如 <code>2 + 3</code>、<code>print</code> 的某个参数。' }
    ] },

    { t: 'callout', kind: 'note', title: '调用也会产出一个值', html:
      '现在只需要记住：单独写一行的 <code>print(...)</code> 是一条<b>语句</b>，作用是产生输出。' +
      '但函数调用本身也能算出一个值，所以它可以出现在更大的表达式里，比如 ' +
      '<code>print(len(&#39;abc&#39;))</code> 会先算出 <code>3</code>，再打印它。' +
      '返回值这件事第 4 章会正式讲，这里先留个印象。'
    },

    { t: 'h', text: '二、print 与字符串字面量', id: 'ch01-2' },

    { t: 'p', html:
      '被引号括起来的一段文本，叫<b>字符串字面量</b>（string literal）。' +
      '"字面量"的意思是：它的值就是写出来的样子，不需要再计算。' +
      'Python 里单引号和双引号完全等价，用哪一种只看内容里有没有引号。'
    },

    { t: 'code', lang: 'python', caption: '单引号与双引号', code:
`print('Python')
print("Python")            # 与上一行输出完全相同

print('他说："你好"')       # 外层单引号，里面可以放心用双引号
print("It's a book")       # 外层双引号，里面可以放心用单引号
` },

    { t: 'p', html:
      '如果一段文本里既有单引号又有双引号，或者你想在文本里"换行""加制表位"，' +
      '就要用到<b>转义</b>：用反斜杠 <code>\\</code> 加上一个字符，表示一个不可见或有特殊含义的字符。'
    },

    { t: 'code', lang: 'python', caption: '常用转义序列', code:
`print('第一行\\n第二行')          # \\n 表示换行
print('姓名\\t年龄')              # \\t 表示一个制表位
print('路径：C:\\\\Users\\\\me')       # \\\\ 表示一个反斜杠本身
print('他说：\\'你好\\'')            # \\' 表示字符串内容里的单引号
` },

    { t: 'table', head: ['写法', '含义', '结果示例'], rows: [
      ['<code>\\n</code>', '换行符', '<code>a\\nb</code> 输出成两行'],
      ['<code>\\t</code>', '制表符（横向跳格）', '<code>a\\tb</code> 中间隔开一段'],
      ['<code>\\\\</code>', '一个反斜杠本身', 'Windows 路径必须这样写'],
      ['<code>\\&#39;</code>', '字符串内容里的单引号', '外层是单引号时才需要'],
      ['<code>\\&quot;</code>', '字符串内容里的双引号', '外层是双引号时才需要']
    ] },

    { t: 'callout', kind: 'warn', title: '新手最常遇见的第一个报错', html:
      '<code>SyntaxError: unterminated string literal</code> 的意思是"字符串没有结束"。' +
      '原因通常是引号不成对：开引号用了单引号，闭引号写成双引号，或者干脆漏了一个。' +
      '还有一种更隐蔽：中文输入法打出的全角引号看起来几乎一样，但 Python 只把半角引号当字符串边界。' +
      '<b>遇到这类报错，先数引号。</b>'
    },

    { t: 'h', text: '三、表达式与求值顺序', id: 'ch01-3' },

    { t: 'p', html:
      '<b>表达式</b>是"能算出一个值"的写法。<b>求值</b>就是按语言的规则把它算出来。' +
      'Python 的算术优先级和数学课基本一致：括号最优先，其次是幂运算，再是乘、除、整除、取余，' +
      '最后是加、减；同一优先级从左往右算。'
    },

    { t: 'code', lang: 'python', caption: '优先级与括号', code:
`print(2 + 3 * 4)        # 14：先算乘法，再加
print((2 + 3) * 4)      # 20：括号改变顺序
print(10 - 4 - 3)       # 3：同级从左往右
print(2 ** 3 ** 2)      # 512：幂运算从右往左结合，等于 2 ** 9
print(-3 ** 2)          # -9：先算幂，再取负号
` },

    { t: 'p', html:
      '注意最后两行，它们解释了一个常见误解：幂运算 <code>**</code> 比一元负号更"粘"。' +
      '<code>-3 ** 2</code> 不是 <code>(-3) ** 2</code>，所以结果是负的。' +
      '如果你想要后者，必须自己加括号：<code>(-3) ** 2</code>。' +
      '<b>拿不准优先级时，加括号永远不丢人。</b>'
    },

    { t: 'p', html:
      '表达式和语句是两类东西，混淆它们会导致"我明明写了算式，为什么屏幕没反应"。'
    },

    { t: 'table', head: ['写法', '属于什么', '实际发生了什么'], rows: [
      ['<code>2 + 3</code>', '表达式', '算出 <code>5</code>，但结果被丢掉了，屏幕不显示'],
      ['<code>print(2 + 3)</code>', '语句（内含表达式）', '先算出 <code>5</code>，再输出到屏幕'],
      ['<code>total = 2 + 3</code>', '赋值语句', '算出 <code>5</code>，存进变量 <code>total</code>，屏幕不显示']
    ] },

    { t: 'callout', kind: 'tip', title: '交互模式为什么"会自动显示"', html:
      '在交互式解释器里直接敲 <code>2 + 3</code>，会看到 <code>5</code>；' +
      '但把同样一行写进 <code>.py</code> 文件运行，什么都不会发生。' +
      '这不是语言行为不一致，而是<b>交互模式额外提供了"回显最后一个表达式的值"的功能</b>。' +
      '文件里想要看见结果，必须自己调用 <code>print</code>。'
    },

    { t: 'h', text: '四、注释、变量与命名', id: 'ch01-4' },

    { t: 'p', html:
      '<b>注释</b>是给人看的说明，用 <code>#</code> 开头，从 <code>#</code> 到行尾都会被 Python 完全忽略。' +
      '好的注释解释"为什么这么做"，而不是把代码翻译一遍——' +
      '<code># 把 12 赋给 price</code> 是废话，<code># 单价按含税价写死，下一版会改成读配置</code> 才有信息量。'
    },

    { t: 'code', lang: 'python', caption: '注释与变量：一个算总价的小程序', code:
`# 计算总价：单价 × 数量
price = 12          # 单价（元）
count = 3           # 数量
total = price * count

print(total)        # 输出 36
` },

    { t: 'p', html:
      '这里的 <code>price = 12</code> 就是<b>变量</b>：给一个值起个名字，之后用名字代替这个值。' +
      '等号 <code>=</code> 在这里不是数学里的"相等"，而是<b>赋值</b>——' +
      '右边先算出一个值，然后把这个值绑定到左边的名字上。所以 <code>score = score + 10</code> ' +
      '在程序里完全合法：先算 <code>score + 10</code>，再把结果存回 <code>score</code>。'
    },

    { t: 'code', lang: 'python', caption: '重新赋值：旧值会被覆盖', code:
`score = 60
print(score)        # 60

score = 90          # 同一个名字，换成新值
print(score)        # 90：60 不再保留，也没有"历史记录"
` },

    { t: 'p', html:
      '变量的名字不是随便起的，Python 对合法名字有硬性规定，社区还有一套命名约定。'
    },

    { t: 'table', head: ['规则', '例子', '说明'], rows: [
      ['只能由字母、数字、下划线组成', '<code>user_name</code>', '不能有空格、连字符、小数点'],
      ['不能以数字开头', '<code>score1</code> 可以，<code>1score</code> 不行', '数字只能在中间或末尾'],
      ['区分大小写', '<code>Score</code> 与 <code>score</code> 是两个名字', '大小写写错是最难发现的 bug 之一'],
      ['不能用关键字', '<code>if</code>、<code>for</code>、<code>class</code>、<code>True</code> 都被语言占用', '报 SyntaxError'],
      ['约定用小写加下划线', '<code>student_count</code>', '这种风格叫 snake_case']
    ] },

    { t: 'callout', kind: 'warn', title: '别用内置函数名当变量名', html:
      '把变量命名为 <code>print</code>、<code>input</code>、<code>sum</code>、<code>type</code>，' +
      '一开始能跑，但从此以后你就<b>再也调用不了同名函数</b>了——名字被你的值遮住了。' +
      '更麻烦的是报错信息会变得莫名其妙。内置名字一律避开。'
    },

    { t: 'compare', left: {
      title: '难读的命名', html: '用 <code>a</code>、<code>b</code>、<code>x1</code>、<code>tmp</code> ' +
        '表示单价、数量、总价；过两天自己回来也看不懂每个值是什么。'
    }, right: {
      title: '会说话的命名', html: '用 <code>price</code>、<code>count</code>、<code>total</code>；' +
        '读代码时名字本身就在解释逻辑，注释可以少写一半。'
    } },

    { t: 'h', text: '五、缩进与代码块', id: 'ch01-5' },

    { t: 'p', html:
      '这是 Python 与很多语言最不一样的地方：<b>缩进不是排版，而是语法</b>。' +
      '一个冒号 <code>:</code> 结尾的行，表示"下面要开始一个代码块"，' +
      '紧跟其后、缩进量相同的若干行属于这个块；一旦某行退回原来的缩进，这个块就结束了。'
    },

    { t: 'code', lang: 'python', caption: '缩进决定"谁属于谁"（if 的细节第 3 章讲）', code:
`age = 20

if age >= 18:
    print('可以入场')       # 这两行缩进相同，都在 if 里面
    print('请出示证件')

print('流程结束')           # 顶格：不在 if 里，不管条件成立与否都会执行
` },

    { t: 'p', html:
      '同样是这三行打印，把最后一行的缩进改掉，程序的含义就完全变了。' +
      '这就是为什么说"缩进错了，程序即使能跑，逻辑也可能全错"。' +
      '本课的约定是<b>一级缩进用 4 个空格</b>，并且整个文件统一，绝不混用 Tab。'
    },

    { t: 'code', lang: 'python', caption: '三种典型的缩进错误', code:
`# 错误 1：冒号后面应该有缩进块，这里却顶格了
if True:
print('没有缩进')

# 错误 2：同一块内两行缩进量不一致
if True:
    print('第一行')
     print('第二行')      # 多了一个空格

# 错误 3：混用 Tab 和空格
# 屏幕上看不出差别，解释器会报 TabError
` },

    { t: 'callout', kind: 'tip', title: '读缩进的三个习惯', html:
      '第一，缩进只增不减地一层层加，每层都是 4 个空格；' +
      '第二，看到 <code>:</code> 就往下找缩进块；' +
      '第三，报 <code>IndentationError</code> 时，先看它指出的行号<b>和上一行</b>，' +
      '因为问题常常是上一行的缩进先错了。'
    },

    { t: 'h', text: '六、程序的生命周期', id: 'ch01-6' },

    { t: 'p', html:
      '写代码不是"写"这个动作本身，而是一个闭环：写下来、保存、交给解释器、看结果、再改。' +
      '任何一个环节出错，表现出来都像"程序有问题"，但排查的位置完全不同。'
    },

    { t: 'flow', dir: 'v', nodes: [
      { title: '在编辑器里写代码', desc: '保存成 hello.py，注意扩展名', kind: 'proc' },
      { title: '在终端运行', desc: 'python hello.py（Windows 也可能是 py hello.py）', kind: 'proc' },
      { title: '解释器逐行执行', desc: '读到第几行就做到第几行', kind: 'proc' },
      { title: '看到输出或报错', desc: '屏幕上的内容就是你唯一的证据', kind: 'decide' }
    ] },

    { t: 'code', lang: 'python', caption: 'sum.py · 完整走一遍生命周期', code:
`# 一个完整的小程序：算总价，再算找零
name = '笔记本'
price = 12
count = 3
paid = 100

total = price * count
change = paid - total

print(name, '总价', total, '元')
print('找零', change, '元')

# 屏幕输出：
# 笔记本 总价 36 元
# 找零 64 元
` },

    { t: 'p', html:
      '运行之前先做四项检查，能省掉一大半"玄学报错"。'
    },

    { t: 'steps', items: [
      { title: '保存了吗', html: '编辑器标签页上的小圆点或星号消失，才说明内容写进了磁盘。没保存等于没改。' },
      { title: '文件名和扩展名对吗', html: '<code>hello.py</code> 不是 <code>hello.py.txt</code>。' +
        'Windows 默认隐藏已知扩展名，最容易在这里栽跟头。' },
      { title: '终端目录对吗', html: '终端当前路径必须和文件所在目录一致，否则会报"找不到文件"。' +
        '不确定就用绝对路径运行。' },
      { title: '报错读最后一行', html: '先看错误类型与说明，再看它提到的行号，只改那一行附近。' }
    ] },

    { t: 'callout', kind: 'warn', title: '三种"看起来像程序坏了"的情况', html:
      '<b>提示 can&#39;t open file</b>：路径或文件名不对，不是 Python 代码的问题；' +
      '<b>运行后没有任何输出</b>：文件没保存，或者你运行的是另一个同名文件；' +
      '<b>SyntaxError 指着一行奇怪的代码</b>：真正的错误常常在上一行，比如括号或引号没闭合。' +
      '先分清楚"环境问题"和"代码问题"，再动手改。'
    },

    { t: 'p', html:
      '第一次运行自己写的代码，十有八九看到的不是输出，而是一段以 <code>Traceback</code> 开头的报错。' +
      '它一点也不神秘：最后一行是<b>错误类型和说明</b>，倒数第二行给出<b>文件名与行号</b>，' +
      '再往上是"谁调用了谁"。初学阶段只需要看最后两行。'
    },

    { t: 'code', lang: 'python', caption: '典型运行时错误：名字拼错了', code:
`name = '小明'
print(nmae)          # 变量名少写了一个字母

# 运行后屏幕上的报错（节选）：
# Traceback (most recent call last):
#   File "hello.py", line 2, in <module>
#     print(nmae)
# NameError: name 'nmae' is not defined
` },

    { t: 'p', html:
      '<code>NameError: name &#39;nmae&#39; is not defined</code> 翻译过来是"这个名字没有定义"。' +
      '它几乎总是两种情况：变量名<b>拼错</b>，或者变量<b>还没赋值就被使用</b>。' +
      '顺着行号改回 <code>name</code>，程序立刻恢复正常。' +
      '注意它<b>不是</b>语法错误——Python 会把整段代码读完，跑到这一行才失败。'
    },

    { t: 'keypoint', items: [
      { title: '函数调用', html: '写法是 <code>函数名(参数)</code>；参数先求值，再把结果交给函数。' },
      { title: 'print 与字符串', html: '<code>print</code> 输出的是引号之间的内容，引号本身不显示；单双引号等价。' },
      { title: '表达式与语句', html: '表达式算出值，语句才产生动作或效果；文件里想看到值，必须显式 print。' },
      { title: '变量与命名', html: '<code>=</code> 是赋值；名字要用小写加下划线，避开关键字和内置函数名。' },
      { title: '缩进是语法', html: '冒号开启代码块，缩进量相同的行属于同一块；一级缩进统一用 4 个空格。' },
      { title: '生命周期', html: '写 → 保存 → 运行 → 看输出或读报错 → 修改，是一个必须亲手走完的闭环。' }
    ] },

    { t: 'checklist', id: 'ch01', items: [
      '我能说出 <code>print(&#39;hi&#39;)</code> 里哪部分是函数名、哪部分是参数',
      '我能解释为什么字符串的引号不会打印出来',
      '我能心算 <code>2 + 3 * 4</code> 和 <code>(2 + 3) * 4</code> 的差别',
      '我能用 <code>\\n</code> 让一段输出分成两行',
      '我能给变量起一个合法且读得懂的名字',
      '我能说出 Python 里缩进和普通排版有什么本质区别',
      '我能在本机成功运行一个自己写的 .py 文件，并看懂它最简单的报错'
    ] }
  ]
});
