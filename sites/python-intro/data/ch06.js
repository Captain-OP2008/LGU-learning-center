/* =====================================================================
 * data/ch06.js · 第 06 章：字符串与切片
 * 职责：把字符串当作"字符组成的序列"，讲清索引、负索引、切片、遍历、
 *       常用方法与不可变性，最后用回文、CSV 解析、反转几个小任务收口。
 * 内容块 schema 见项目说明；示例均按 Python 3 语法书写。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch06',
  num: '06',
  title: '字符串与切片',
  en: 'Strings & Slicing',
  goals: [
    '能说清索引从 0 开始的含义，并用遍历、<code>len</code>、<code>in</code> 做字符统计',
    '能用切片 <code>s[a:b]</code> 与步长取出任意子串',
    '能用 <code>strip / lower / replace / find</code> 清洗脏文本',
    '能用 <code>split</code> 与 <code>join</code> 在字符串和列表之间来回转换',
    '能解释"字符串不可变"意味着什么，并写出回文判断'
  ],
  kp: [
    { id: 'ch06-1', title: '字符串是序列：索引从 0 开始' },
    { id: 'ch06-2', title: '切片 s[a:b] 与步长' },
    { id: 'ch06-3', title: '遍历、len 与 in' },
    { id: 'ch06-4', title: '常用方法：清洗与查找' },
    { id: 'ch06-5', title: 'split 与 join：字符串 ↔ 列表' },
    { id: 'ch06-6', title: '不可变性与重建：回文与反转' }
  ],
  blocks: [

    { t: 'callout', kind: 'why', html:
      '程序里最脏、最杂、最容易出错的数据是<b>文本</b>：用户输入、日志、配置文件、CSV、' +
      '网页内容。它们全都以字符串的形式进来，全都需要清洗、切分、判断。' +
      '字符串同时也是你接触的<b>第一个"序列"</b>——学会用索引和切片访问它，' +
      '这套操作会原封不动地迁移到下一章的列表上。' +
      '换句话说：这一章学的不是"字符串函数大全"，而是<b>序列思维</b>。'
    },

    { t: 'p', lead: true, html:
      '在 Python 里，字符串不是"一个整体"，而是<b>一串按顺序排好的字符</b>。' +
      '既然有顺序，就可以问"第 0 个是谁""第 2 到第 5 个是谁""从后往前数第 1 个是谁"。' +
      '这一章把这些问法变成精确的代码，并顺手把文本清洗的常用工具过一遍。'
    },

    { t: 'h', text: '一、字符串是序列：索引从 0 开始', id: 'ch06-1' },

    { t: 'p', html:
      '序列的意思很朴素：每个字符有一个位置编号，而且顺序固定。' +
      'Python 的编号从 <b>0</b> 开始，所以第一个字符是 <code>s[0]</code>，' +
      '最后一个字符是 <code>s[len(s) - 1]</code>。' +
      '方括号里的数字叫<b>下标</b>或<b>索引</b>。'
    },

    { t: 'code', lang: 'python', caption: '索引：从 0 数到 len(s)-1', code:
`s = 'Python'

print(s[0])        # P
print(s[1])        # y
print(s[5])        # n，也就是最后一个
print(len(s))      # 6
print(s[len(s) - 1])   # n，最笨但最不容易错的写法

# 越界：下标必须是 0 ~ len(s)-1
# print(s[6])      # IndexError: string index out of range
print(len('中文'))        # 2：Python 3 的 len 按"字符"数，不是字节数
` },

    { t: 'table', head: ['表达式', '结果', '说明'], rows: [
      ['<code>s = \'Python\'</code>', '<code>\'Python\'</code>', '6 个字符，下标 0~5'],
      ['<code>s[0]</code>', '<code>\'P\'</code>', '第一个字符'],
      ['<code>s[5]</code>', '<code>\'n\'</code>', '最后一个字符 = s[len(s)-1]'],
      ['<code>len(s)</code>', '<code>6</code>', '字符个数，不是"最大下标"（最大下标是 5）'],
      ['<code>s[6]</code>', '报错', 'IndexError：越界不会被自动裁剪']
    ], caption: '最容易犯的错：把 len(s) 当成最后一个下标。' },

    { t: 'callout', kind: 'warn', title: 'off-by-one：差一错误', html:
      '下标范围是 <b>0 到 len-1</b>，共 len 个。' +
      '写循环时要么用 <code>for i in range(len(s))</code>（i 取 0~len-1，安全），' +
      '要么直接用 <code>for ch in s</code> 遍历字符本身。' +
      '不要手写 <code>range(1, len(s))</code> 又忘了补 0，也不要写到 <code>len(s)</code>。' +
      '所有序列（字符串、列表、元组）的规则完全一致。'
    },

    { t: 'h', text: '二、切片 s[a:b] 与步长', id: 'ch06-2' },

    { t: 'p', html:
      '要"从第 2 个取到第 5 个"这样一个片段，不需要写循环，' +
      'Python 提供了<b>切片</b>：<code>s[a:b]</code> 表示从下标 <code>a</code> 开始，' +
      '到下标 <code>b</code> <b>之前</b>结束。' +
      '这个"左闭右开"的约定是全文最重要的一句话：<b>包含 a，不包含 b</b>。' +
      '好处是 <code>s[2:5]</code> 的长度正好是 <code>5 - 2 = 3</code>，' +
      '而且相邻切片 <code>s[0:2]</code> 与 <code>s[2:4]</code> 能严丝合缝拼起来。'
    },

    { t: 'code', lang: 'python', caption: '切片：左闭右开，省略端点表示"到头"', code:
`s = 'Python'

print(s[1:4])     # yth    下标 1、2、3，不含 4
print(s[:3])      # Pyt    省略起点 = 从 0 开始
print(s[3:])      # hon    省略终点 = 一直到末尾
print(s[:])       # Python 整份复制
print(s[2:2])     # 空字符串：起点等于终点
print(s[4:1])     # 空字符串：起点在终点右边，不会报错
` },

    { t: 'table', head: ['写法', '含义', "'Python' 的结果"], rows: [
      ['<code>s[a:b]</code>', '从 a 到 b 之前', '<code>s[1:4]</code> → <code>yth</code>'],
      ['<code>s[:b]</code>', '从开头到 b 之前', '<code>s[:3]</code> → <code>Pyt</code>'],
      ['<code>s[a:]</code>', '从 a 到末尾', '<code>s[3:]</code> → <code>hon</code>'],
      ['<code>s[:]</code>', '整份复制', '<code>Python</code>'],
      ['<code>s[a:b:step]</code>', '按 step 间隔取', '<code>s[::2]</code> → <code>Pto</code>'],
      ['<code>s[::-1]</code>', '步长为负 = 反向', '<code>nohtyP</code>']
    ], caption: '六个常用切片形式，建议亲手跑一遍再记。' },

    { t: 'p', html:
      '切片和索引有一个重要区别：<b>切片越界不会报错</b>。' +
      '<code>s[2:100]</code> 会老老实实返回从 2 到末尾的部分；' +
      '而 <code>s[100]</code> 直接抛 <code>IndexError</code>。' +
      '这个设计很实用：你不需要先判断字符串够不够长就能安全地取前 10 个字符。'
    },

    { t: 'code', lang: 'python', caption: '切片越界是安全的，单点索引不是', code:
`s = 'Python'

print(s[2:100])    # thon：越界部分被截掉
print(s[-100:2])   # Py：负得过头也被截掉
# print(s[100])    # IndexError：单点索引必须严格在范围内

# 负索引在切片里同样有效：-1 是最后一个
print(s[-3:])      # hon
print(s[:-3])      # Pyt
` },

    { t: 'h', lvl: 3, text: '步长与反向切片', id: 'ch06-2-1' },

    { t: 'p', html:
      '切片的第三个参数是<b>步长</b>：每隔几个字符取一个。默认是 1。' +
      '步长为 2 就取"第 0、2、4…个"，步长为 <code>-1</code> 就表示<b>从后往前</b>，' +
      '这也是 Python 里反转字符串最简洁的写法。' +
      '要注意：步长为负时，起点的默认值变成末尾、终点的默认值变成开头，所以 ' +
      '<code>s[::-1]</code> 就是"从末尾到开头"的完整反转。'
    },

    { t: 'code', lang: 'python', caption: '步长的三种用法', code:
`s = 'abcdefg'

print(s[::2])      # aceg    隔一个取一个
print(s[1::2])     # bdf     从 1 开始隔一个取一个
print(s[::-1])     # gfedcba 反转
print(s[5:1:-1])   # fed     从 5 倒着走到 2（不含 1）

# 常见组合：去掉首尾、隔位取出、反转
print(s[1:-1])     # bcdef
print(s[::-2])     # geca
` },

    { t: 'callout', kind: 'tip', title: '切片是"复制"，不是"视图"', html:
      '<code>s[:]</code> 看起来什么都没做，其实返回了一个<b>新的字符串对象</b>。' +
      '因为字符串不可变，切片复制很便宜，也不会影响原串。' +
      '等到下一章讲列表时要注意：列表切片同样是复制，但列表内容可变，' +
      '"切片拿到的是副本"这个事实会直接决定你改的是谁。'
    },

    { t: 'h', text: '三、遍历、len 与 in', id: 'ch06-3' },

    { t: 'p', html:
      '既然字符串是序列，就有两种遍历方式：<b>直接遍历字符</b>，' +
      '或者<b>遍历下标再取字符</b>。绝大多数时候前者更好——更短、更清楚、也不容易差一。' +
      '只有需要"同时知道位置和字符"时，才用 <code>enumerate</code> 或下标。'
    },

    { t: 'code', lang: 'python', caption: '三种遍历写法', code:
`word = 'loop'

# 1) 只要字符：首选
for ch in word:
    print(ch)

# 2) 只要下标
for i in range(len(word)):
    print(i, word[i])

# 3) 位置和字符都要：enumerate
for i, ch in enumerate(word):
    print(f'第 {i} 个字符是 {ch}')
` },

    { t: 'p', html:
      '字符串统计类任务几乎都是"遍历 + 累加"：初始化一个计数器，' +
      '遍历每个字符，符合条件的就加一。<code>in</code> 运算符让你不必写循环就能判断子串是否存在，' +
      '它检查的是"连续的一段"，不是"零散的字符凑齐"。'
    },

    { t: 'code', lang: 'python', caption: '字符统计与子串判断', code:
`VOWELS = 'aeiou'
text = 'Programming is fun'

count = 0
for ch in text.lower():        # 先统一小写，避免漏掉大写元音
    if ch in VOWELS:
        count += 1
print(count)                   # 5

print('gram' in text)          # True：连续子串
print('grm' in text)           # False：字符都在，但不连续

print(text.startswith('Program'))   # True
print(text.endswith('fun'))         # True
print(text.count('m'))              # 2
` },

    { t: 'callout', kind: 'warn', title: 'in 判断的是子串，不是字符集合', html:
      '<code>\'abc\' in s</code> 找的是<b>连续出现</b>的 abc。' +
      '如果你想判断"a、b、c 是否都出现过"，要分别判断或用 <code>set</code>。' +
      '另外注意 <code>in</code> 对大小写敏感，<code>\'a\' in \'ABC\'</code> 是 <code>False</code>，' +
      '清洗文本时先 <code>lower()</code> 再判断。'
    },

    { t: 'h', text: '四、常用方法：清洗与查找', id: 'ch06-4' },

    { t: 'p', html:
      '字符串对象自带一批方法（method），调用形式是 <code>s.方法名(参数)</code>。' +
      '它们<b>不会修改 s 本身</b>，而是返回一个处理后的新字符串——' +
      '这一点的原因下一节讲不可变性时会解释。先记住最常用的几个：'
    },

    { t: 'table', head: ['方法', '作用', '例子', '结果'], rows: [
      ['<code>lower()</code> / <code>upper()</code>', '全部转小写 / 大写', '<code>\'AbC\'.lower()</code>', '<code>\'abc\'</code>'],
      ['<code>strip()</code>', '去掉首尾空白', '<code>\'  hi \'.strip()</code>', '<code>\'hi\'</code>'],
      ['<code>replace(a, b)</code>', '把 a 换成 b', '<code>\'a-b\'.replace(\'-\', \'+\')</code>', '<code>\'a+b\'</code>'],
      ['<code>find(x)</code>', 'x 第一次出现的下标', '<code>\'hello\'.find(\'ll\')</code>', '<code>2</code>'],
      ['<code>find(x)</code> 找不到', '返回 -1，不报错', '<code>\'hello\'.find(\'z\')</code>', '<code>-1</code>'],
      ['<code>count(x)</code>', 'x 出现的次数', '<code>\'banana\'.count(\'a\')</code>', '<code>3</code>'],
      ['<code>isalpha()</code> / <code>isdigit()</code>', '是否全是字母 / 数字', '<code>\'123\'.isdigit()</code>', '<code>True</code>']
    ], caption: '方法调用不改原串，结果必须接住（赋值给变量或直接用）。' },

    { t: 'code', lang: 'python', caption: '清洗一行用户输入', code:
`raw = '   Alice@Example.COM   '

email = raw.strip()              # 去掉首尾空格
email = email.lower()            # 统一小写
print(email)                     # alice@example.com

# 链式调用：每一步都返回新字符串，所以可以一直点下去
email2 = raw.strip().lower()
print(email2)                    # alice@example.com

# find 找不到返回 -1，所以判断要用 != -1
pos = email.find('@')
print(pos)                       # 5
if pos != -1:
    name = email[:pos]
    domain = email[pos + 1:]
    print(name, domain)          # alice example.com
` },

    { t: 'callout', kind: 'warn', title: 'find 返回 -1，不是 None，也不报错', html:
      '用 <code>find</code> 时最常见的 bug 是写 <code>if s.find(x):</code>——' +
      '如果 x 正好在下标 0 处，返回值 0 会被当成"假"，判断失败。' +
      '正确写法是 <code>if s.find(x) != -1:</code>，或者干脆用 ' +
      '<code>if x in s:</code>。后者可读性更好，只有在需要下标时才用 find。'
    },

    { t: 'h', text: '五、split 与 join：字符串 ↔ 列表', id: 'ch06-5' },

    { t: 'p', html:
      '真实文本处理里，字符串和列表必须能互相转换：读进来是一行字符串，' +
      '处理时要拆成字段，输出时又要拼回去。<code>split</code> 负责拆，' +
      '<code>join</code> 负责拼。' +
      '注意 <code>split()</code> 不带参数和 <code>split(\' \')</code> 的区别，' +
      '这是新手最常踩的坑之一。'
    },

    { t: 'code', lang: 'python', caption: 'split：按分隔符拆成列表', code:
`line = '  a   b  c '

print(line.split())        # ['a', 'b', 'c'] 不带参数：按任意空白切，丢弃空串
print(line.split(' '))     # ['', '', 'a', '', '', 'b', '', 'c', '']

csv = '林一,88,92'
print(csv.split(','))      # ['林一', '88', '92']

# 指定最大切分次数：只切前 2 个逗号
print('a,b,c,d'.split(',', 2))   # ['a', 'b', 'c,d']
` },

    { t: 'p', html:
      '<code>split()</code> 不带参数时按<b>任意长度的空白</b>切分，并自动丢掉首尾空串，' +
      '所以处理从文件里读出来的行时几乎总是用它；' +
      '带参数的 <code>split(\' \')</code> 严格按"一个空格"切，连续空格会产生空字符串。' +
      '搞不清区别时，先打印一下 <code>len(parts)</code>。'
    },

    { t: 'h', lvl: 3, text: '解析一行 CSV', id: 'ch06-5-1' },

    { t: 'p', html:
      '把 <code>split</code> 和 <code>strip</code> 组合起来，就能解析一行 CSV。' +
      '这里必须处理两个防御点：<b>字段数量可能不对</b>（脏数据）、' +
      '<b>数字字段还是字符串</b>（要做类型转换，否则后面加法会变成字符串拼接）。'
    },

    { t: 'code', lang: 'python', caption: '解析 CSV 行：拆分、去空白、转类型', code:
`def parse_row(line):
    """'姓名, 语文, 数学' -> (姓名, 语文分数, 数学分数)；格式不对返回 None。"""
    parts = line.split(',')
    if len(parts) != 3:
        return None                    # 防御：列数不对就别硬解析
    name = parts[0].strip()
    chinese = int(parts[1].strip())
    math = int(parts[2].strip())
    return (name, chinese, math)

print(parse_row('林一, 88, 92'))     # ('林一', 88, 92)
print(parse_row('坏数据, 88'))        # None
print(parse_row('王二, 70, 65'))     # ('王二', 70, 65)
` },

    { t: 'p', html:
      '<code>join</code> 是 <code>split</code> 的逆操作：把一个字符串列表用某个连接符拼成一个字符串。' +
      '注意调用方向——是<b>连接符</b>在调 <code>join</code>，' +
      '参数是列表：<code>\', \'.join(parts)</code>。' +
      '很多人会写成 <code>parts.join(\', \')</code>，这是错的，因为列表没有 join 方法。'
    },

    { t: 'code', lang: 'python', caption: 'join：列表拼回字符串', code:
`names = ['林一', '王二', '张三']

print(', '.join(names))          # 林一, 王二, 张三
print(' | '.join(names))         # 林一 | 王二 | 张三
print(''.join(names))            # 林一王二张三
print('-'.join(['2026', '11', '09']))   # 2026-11-09

# split 与 join 正好互逆（前提是没有连续分隔符）
s = 'a,b,c'
print(','.join(s.split(',')))    # a,b,c
` },

    { t: 'callout', kind: 'note', title: 'join 还能顺手处理类型', html:
      '<code>join</code> 要求列表里全是字符串。碰到数字列表要先转换：' +
      '<code>\',\'.join(str(n) for n in [1, 2, 3])</code>。' +
      '这里用到了生成器表达式，先当作"批量 str() 的简写"即可，' +
      '第 7 章讲列表推导式时会正式展开。'
    },

    { t: 'h', text: '六、不可变性与重建：回文与反转', id: 'ch06-6' },

    { t: 'p', html:
      '字符串是<b>不可变</b>（immutable）的：创建之后，它包含的字符一个都不能改。' +
      '所以 <code>s[0] = \'H\'</code> 会直接抛 <code>TypeError</code>。' +
      '这看起来是个限制，但不可变带来了两个好处：字符串可以安全地共享和当作字典的键，' +
      '而且你永远不用担心中间某处把字符串改坏了。' +
      '要做"修改"，只能<b>基于原串造一个新串</b>。'
    },

    { t: 'code', lang: 'python', caption: '不可变：所有"修改"都是造新串', code:
`s = 'hello'

# s[0] = 'H'            # TypeError: 'str' object does not support item assignment

# 正确做法：用切片和拼接造一个新字符串
s2 = 'H' + s[1:]        # 首字母大写
print(s, s2)            # hello Hello：原串没变

s3 = s.replace('l', 'L')
print(s, s3)            # hello heLLo：replace 也返回新串

# 重复：* 也是造新串
print('ab' * 3)         # ababab
` },

    { t: 'p', html:
      '既然不能原地改，那么"反转一个字符串"就只能构造新串。两种写法：' +
      '用切片 <code>s[::-1]</code>（最 Pythonic），' +
      '或者从末尾往前遍历、用 <code>+=</code> 累加（最能体现"重建"的过程）。' +
      '以此为基础，回文判断只需要一行：正着读和反着读是否相同。'
    },

    { t: 'code', lang: 'python', caption: '反转的两种写法', code:
`s = 'Python'

def reverse_slice(s):
    return s[::-1]

def reverse_loop(s):
    out = ''                      # 从空串开始累积
    for i in range(len(s) - 1, -1, -1):
        out += s[i]               # 每次 += 都产生一个新字符串
    return out

print(reverse_slice(s))    # nohtyP
print(reverse_loop(s))     # nohtyP
` },

    { t: 'h', lvl: 3, text: '回文的三种写法', id: 'ch06-6-1' },

    { t: 'p', html:
      '回文是"正着读反着读一样"的字符串，比如 <code>level</code>、' +
      '<code>Racecar</code>、<code>A man a plan a canal Panama</code>。' +
      '难度不在算法，而在<b>规则要定义清楚</b>：大小写算不算？空格和标点算不算？' +
      '先把文本规范化（normalize），再比较，代码才可靠。'
    },

    { t: 'code', lang: 'python', caption: '回文判断：先规范化，再比较', code:
`def normalize(s):
    """统一小写，并去掉空格。真实场景还可以去标点。"""
    return s.lower().replace(' ', '')

def is_palindrome(s):
    t = normalize(s)
    return t == t[::-1]

print(is_palindrome('level'))                       # True
print(is_palindrome('Racecar'))                     # True
print(is_palindrome('A man a plan a canal Panama')) # True
print(is_palindrome('Python'))                      # False

# 也可以用双指针从两头往中间比，不用造反转串
def is_palindrome_two_pointers(s):
    t = normalize(s)
    i, j = 0, len(t) - 1
    while i < j:
        if t[i] != t[j]:
            return False
        i += 1
        j -= 1
    return True

print(is_palindrome_two_pointers('level'))          # True
` },

    { t: 'table', head: ['写法', '代码', '优点', '缺点'], rows: [
      ['切片反转', '<code>s == s[::-1]</code>', '最短、最快', '会多复制一份字符串'],
      ['双指针', '从两端向中间比', '不复制、可提前退出', '代码稍长'],
      ['循环重建', '<code>for i in range(len(s)-1, -1, -1)</code>', '最能体现"不可变"的机制', '<code>+=</code> 拼接在大文本上很慢']
    ], caption: '三种写法都能用；读别人代码时要认得出它们是一回事。' },

    { t: 'h', lvl: 3, text: '拼接大量字符串要用 join', id: 'ch06-6-2' },

    { t: 'p', html:
      '因为字符串不可变，每次 <code>+=</code> 都要<b>新建一个字符串并复制已有内容</b>。' +
      '循环 n 次、每次复制的成本是当前长度，总成本大约是 O(n²)。' +
      '数据量小的时候感觉不出来，一旦是几万行的日志，<code>+=</code> 会慢得离谱。' +
      '正确的做法是先用列表收集片段，最后用 <code>join</code> 一次拼成。'
    },

    { t: 'code', lang: 'python', caption: '两种拼接方式的对比', code:
`words = ['Python', 'is', 'fun']

# 慢写法：每次 += 都复制一遍
result = ''
for w in words:
    result += w + ' '
print(result.strip())

# 快写法：列表收集 + join 一次拼接
result2 = ' '.join(words)
print(result2)

# 处理数字列表时先转字符串
numbers = [1, 2, 3]
print(','.join(str(n) for n in numbers))   # 1,2,3
` },

    { t: 'callout', kind: 'ai', title: 'AI 时代这样学', html:
      'AI 一秒钟就能写出回文判断和 CSV 解析，但它不会替你建立"<b>字符串是序列、' +
      '切片左闭右开、修改就是复制</b>"这三个直觉。' +
      '建议的用法：先自己写一版，再把 AI 的版本逐行对照，' +
      '重点问"它为什么用 <code>s[::-1]</code> 而不是循环""它为什么先 normalize"。' +
      '把差异讲清楚，才算真的学会。'
    },

    { t: 'terms', items: [
      { en: 'index', zh: '下标 / 索引', html: '字符在序列中的位置编号，从 0 开始。' },
      { en: 'slice', zh: '切片', html: '<code>s[a:b]</code>，左闭右开地取一段；越界不报错。' },
      { en: 'immutable', zh: '不可变', html: '创建后内容不能修改。字符串、元组不可变，列表可变。' },
      { en: 'method', zh: '方法', html: '绑在对象上的函数，用 <code>s.方法名()</code> 调用，返回新值。' },
      { en: 'whitespace', zh: '空白', html: '空格、制表符、换行等不可见字符；常用 <code>strip()</code> 清理。' },
      { en: 'delimiter', zh: '分隔符', html: '<code>split</code> 与 <code>join</code> 用来切分和连接的分界字符，如逗号。' }
    ] },

    { t: 'compare', left: {
      title: '字符串处理常见错法', html:
        '<code>if s.find(x):</code>（0 被当成假）；' +
        '<code>parts.join(\',\')</code>（列表没有 join）；' +
        '用 <code>s[i] = \'x\'</code> 改字符串；' +
        '用 <code>range(len(s)+1)</code> 遍历导致越界。'
    }, right: {
      title: '正确写法', html:
        '<code>if x in s:</code> 或 <code>find(x) != -1</code>；' +
        '<code>\',\'.join(parts)</code>；' +
        '<code>s = s[:i] + \'x\' + s[i+1:]</code>；' +
        '<code>for ch in s</code> 直接遍历字符。'
    } },

    { t: 'steps', items: [
      { title: '先想清楚"要整体还是要片段"', html: '整体比较用 <code>==</code>、<code>in</code>；片段用切片；单个位置用索引。' },
      { title: '切片先定左右边界', html: '写 <code>s[a:b]</code> 前先用注释标出 a、b 各指向哪个字符，避免差一。' },
      { title: '清洗顺序固定', html: '先 <code>strip()</code> 去首尾，再 <code>lower()</code> 统一大小写，最后拆分或查找。' },
      { title: '结果一定要接住', html: '字符串方法返回新值，<code>s.strip()</code> 单独写一行等于什么都没做。' }
    ] },

    { t: 'keypoint', items: [
      { title: '字符串 = 字符序列', html: '下标从 0 开始，最后一个下标是 <code>len(s)-1</code>；负索引从末尾数。' },
      { title: '切片左闭右开', html: '<code>s[a:b]</code> 含 a 不含 b；省略端点表示到头；越界安全。' },
      { title: '步长是第三个参数', html: '<code>s[::2]</code> 隔位取，<code>s[::-1]</code> 反转。' },
      { title: '遍历优先用 for ch in s', html: '需要位置时才用 <code>enumerate</code> 或下标，避免差一错误。' },
      { title: 'split / join 是一对', html: '拆分得到列表，连接由分隔符调用 <code>join</code>；<code>split()</code> 与 <code>split(\' \')</code> 行为不同。' },
      { title: '字符串不可变', html: '任何"修改"都是造新串；大量拼接用列表 + <code>join</code>，不要循环 <code>+=</code>。' }
    ] },

    { t: 'checklist', id: 'ch06', items: [
      '我能说出 <code>\'Python\'[3]</code> 和 <code>\'Python\'[-2]</code> 分别是什么',
      '我能写出 <code>s[1:4]</code>、<code>s[:3]</code>、<code>s[3:]</code>、<code>s[::-1]</code> 的结果',
      '我能解释为什么 <code>s[100]</code> 报错而 <code>s[2:100]</code> 不报错',
      '我能用 <code>strip / lower / replace / find</code> 清洗一行输入',
      '我能把 CSV 行拆成字段，也能把字段列表拼回一行',
      '我能解释"字符串不可变"，并写出回文判断',
      '我知道循环里 <code>+=</code> 拼接字符串慢，应该用 <code>join</code>'
    ] }
  ]
});
