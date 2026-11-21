/* =====================================================================
 * data/ch08.js · 第 08 章：字典与计数
 * 职责：讲清"键值映射"这个数据模型，练熟 get / in / items / 增删改，
 *       用字符计数、词频、分组、嵌套字典、排序输出完成一批真实任务。
 * 内容块 schema 见项目说明；示例均按 Python 3 语法书写。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch08',
  num: '08',
  title: '字典与计数',
  en: 'Dictionaries & Counting',
  goals: [
    '能说清字典的"键 → 值"模型，并知道键必须不可变',
    '能用 <code>in</code> 与 <code>get</code> 安全地取值，避免 KeyError',
    '能用 <code>keys / values / items</code> 遍历字典并做统计',
    '能用字典写出计数与分组模式，解决词频与按类别统计一类问题',
    '能把字典按值排序输出，并用字典表替代长串 if / elif'
  ],
  kp: [
    { id: 'ch08-1', title: '字典：用键查值' },
    { id: 'ch08-2', title: '取值、增删改与 get' },
    { id: 'ch08-3', title: '遍历：keys / values / items' },
    { id: 'ch08-4', title: '计数模式：字典最常用的姿势' },
    { id: 'ch08-5', title: '分组与嵌套字典' },
    { id: 'ch08-6', title: '排序输出与分派表' }
  ],
  blocks: [

    { t: 'callout', kind: 'why', html:
      '列表用"第几个"找元素，可当你拿到的是"某个名字"时，按位置找就太笨了：' +
      '查一个人的成绩，难道要遍历整个列表逐个比较？' +
      '字典解决的正是这个问题——<b>按"键"直接找到"值"</b>，' +
      '代价是键必须唯一、必须不可变。' +
      '词频统计、按类别分组、配置项、缓存、命令分派……这些看起来毫不相干的场景，' +
      '底层都是同一个字典模型。这一章把字典练熟，你就能少写一大半循环。'
    },

    { t: 'p', lead: true, html:
      '字典（dict）存的是<b>键值对</b>：每个键对应一个值，键在字典里唯一。' +
      '你可以把它想成"一本查号簿"：报名字（键），直接翻到对应的号码（值）。' +
      '和列表相比，字典不关心顺序（Python 3.7 起会保留插入顺序，但不要依赖它做业务逻辑），' +
      '只关心"这个键在不在、它的值是多少"。'
    },

    { t: 'h', text: '一、字典：用键查值', id: 'ch08-1' },

    { t: 'p', html:
      '字典用花括号写，元素是 <code>键: 值</code> 的形式，键值之间用逗号隔开。' +
      '键一般是字符串或数字，<b>必须是不可变类型</b>——字符串、数字、元组可以，' +
      '列表不行。值可以是任何东西：数字、字符串、列表，甚至另一个字典。'
    },

    { t: 'code', lang: 'python', caption: '创建、取值、判断存在', code:
`scores = {'林一': 88, '王二': 75, '张三': 92}

print(scores['林一'])        # 88：用键取值
print(len(scores))           # 3：键值对的数量
print('王二' in scores)      # True：判断键是否存在
print(75 in scores)          # False：75 是值，不是键

# 值可以是任意类型
student = {
    'name': '李四',
    'scores': [88, 92, 75],
    'active': True,
}
print(student['scores'][1])  # 92：先取列表，再取下标
` },

    { t: 'table', head: ['对比项', '列表 list', '字典 dict'], rows: [
      ['存什么', '一串元素，按位置排', '一堆键值对，按键索引'],
      ['怎么找', '按位置 <code>a[0]</code>', '按键 <code>d[\'name\']</code>'],
      ['查找速度', '要逐个比较，O(n)', '直接定位，平均 O(1)'],
      ['键 / 下标要求', '下标必须是整数', '键必须不可变且唯一'],
      ['典型用途', '有顺序的一批数据', '按名字/index 查值、计数、分组']
    ], caption: '一句话记：列表管"顺序"，字典管"对应"。' },

    { t: 'callout', kind: 'warn', title: '键不存在就是 KeyError', html:
      '<code>d[\'不存在的键\']</code> 不会返回 <code>None</code>，而是直接抛 ' +
      '<code>KeyError</code>，程序停下。' +
      '所以取值前要么先用 <code>in</code> 判断，要么用 <code>get</code> 提供默认值。' +
      '另外，<code>d[75]</code> 和 <code>d[\'75\']</code> 是两个完全不同的键——' +
      '数字和字符串不会自动转换。'
    },

    { t: 'h', text: '二、取值、增删改与 get', id: 'ch08-2' },

    { t: 'p', html:
      '字典的修改非常直观：<b>给一个已存在的键赋值就是修改，给一个新键赋值就是新增</b>，' +
      '同一个方括号语法同时承担两件事。删除用 <code>del</code> 或 <code>pop</code>；' +
      '要安全取值，用 <code>get(键, 默认值)</code>——键不存在时返回默认值，不会报错。'
    },

    { t: 'code', lang: 'python', caption: '增、删、改、查的完整操作', code:
`scores = {'林一': 88, '王二': 75}

scores['张三'] = 92           # 新键 → 新增
scores['林一'] = 90           # 已有键 → 修改
print(scores)

removed = scores.pop('王二')  # 删除并返回值
print(removed, scores)        # 75 {'林一': 90, '张三': 92}

# 安全取值：不存在时给默认值
print(scores.get('李四'))        # None
print(scores.get('李四', 0))     # 0
print(scores.get('张三', 0))     # 92

# 注意：get 不能区分"键不存在"和"键存在但值是 None"
print(scores.get('李四', 0) == 0)   # True
print('李四' in scores)             # False：用 in 判断才可靠

# del 按下标删除，键不存在会抛 KeyError
del scores['张三']
print(scores)                 # {'林一': 90}
` },

    { t: 'table', head: ['操作', '写法', '键不存在时', '返回值'], rows: [
      ['取值', '<code>d[k]</code>', '<b>KeyError</b>', '值'],
      ['取值带默认', '<code>d.get(k, default)</code>', '返回 default', '值或默认值'],
      ['判断', '<code>k in d</code>', '返回 False', '布尔值'],
      ['新增 / 修改', '<code>d[k] = v</code>', '自动新增', '<code>None</code>（语句，无返回）'],
      ['删除', '<code>del d[k]</code>', '<b>KeyError</b>', '无'],
      ['删除并取值', '<code>d.pop(k, default)</code>', '返回 default', '被删掉的值'],
      ['批量更新', '<code>d.update(other)</code>', '自动新增', '<code>None</code>']
    ], caption: '本表是字典操作的"最小必要集"，建议逐个敲一遍。' },

    { t: 'callout', kind: 'tip', title: '什么时候用 get', html:
      '只要你是"<b>不确定键在不在</b>"的情况下取值，就用 <code>get</code>。' +
      '计数、累加、收集这类场景几乎都会用到：' +
      '<code>d[k] = d.get(k, 0) + 1</code> 是字典里出镜率最高的一行代码。' +
      '而当你<b>明确希望缺失就报错</b>时（比如读取必需的配置项），反而应该用 <code>d[k]</code>，' +
      '让错误尽早暴露。'
    },

    { t: 'h', text: '三、遍历：keys / values / items', id: 'ch08-3' },

    { t: 'p', html:
      '直接 <code>for k in d</code> 遍历的是<b>键</b>。' +
      '要遍历值用 <code>d.values()</code>，要同时拿键和值用 <code>d.items()</code>——' +
      '后者返回 <code>(键, 值)</code> 元组，配合元组解包就是 <code>for k, v in d.items()</code>。' +
      '统计类任务几乎都用 items。'
    },

    { t: 'code', lang: 'python', caption: '三种遍历方式', code:
`scores = {'林一': 88, '王二': 75, '张三': 92}

for name in scores:                 # 默认遍历键
    print(name)

for score in scores.values():
    print(score)

for name, score in scores.items():  # 最常用
    print(f'{name} 考了 {score} 分')

print(sum(scores.values()))              # 255：对值做聚合
print(sum(scores.values()) / len(scores))  # 85.0
` },

    { t: 'callout', kind: 'warn', title: '遍历时不能改字典大小', html:
      '在 <code>for k in d:</code> 循环里新增或删除键，会抛 ' +
      '<code>RuntimeError: dictionary changed size during iteration</code>。' +
      '正确做法是：先把键复制成列表再遍历（<code>for k in list(d):</code>），' +
      '或者先收集要删的键，循环结束后统一删。'
    },

    { t: 'code', lang: 'python', caption: '删除字典中值小于 80 的项', code:
`scores = {'林一': 88, '王二': 75, '张三': 92, '赵四': 60}

# 错误写法：会抛 RuntimeError
# for name in scores:
#     if scores[name] < 80:
#         del scores[name]

# 正确 1：用 list() 复制键再遍历
for name in list(scores):
    if scores[name] < 80:
        del scores[name]
print(scores)      # {'林一': 88, '张三': 92}

# 正确 2：生成新字典
scores2 = {'林一': 88, '王二': 75, '张三': 92, '赵四': 60}
kept = {name: score for name, score in scores2.items() if score >= 80}
print(kept)        # {'林一': 88, '张三': 92}
` },

    { t: 'h', text: '四、计数模式：字典最常用的姿势', id: 'ch08-4' },

    { t: 'p', html:
      '计数是字典最经典的应用：<b>把"出现过的元素"当键，把"出现次数"当值</b>。' +
      '每遇到一个元素，就"查一下当前计数，加一，再存回去"。' +
      '这个模式只有三步：初始化字典、遍历数据、用 <code>get(元素, 0) + 1</code> 累加。' +
      '换成任何"元素"都成立：单词、字符、成绩、日期、错误码。'
    },

    { t: 'code', lang: 'python', caption: '字符计数：先把模式跑通', code:
`text = 'hello world'
counts = {}

for ch in text:
    if ch == ' ':
        continue                    # 跳过空格
    counts[ch] = counts.get(ch, 0) + 1

print(counts)
print(counts['l'])                  # 3
print(counts.get('z', 0))           # 0：没出现过的字符

# 按次数从高到低排序输出
for ch, n in sorted(counts.items(), key=lambda kv: (-kv[1], kv[0])):
    print(ch, n)
` },

    { t: 'p', html:
      '同样的模式换到词频上。注意 <code>text.split()</code> 已经按空白切好了单词，' +
      '再统一转小写、去掉标点，就得到一份干净的词表。' +
      '<code>sorted</code> 的 <code>key</code> 返回 <code>(-次数, 单词)</code> 元组，' +
      '意思是"次数多的在前；次数相同则按单词字典序"，这是报表输出的标准写法。'
    },

    { t: 'code', lang: 'python', caption: '词频统计 + 排序输出', code:
`sentence = 'the quick brown fox jumps over the lazy dog the end'
words = sentence.split()

freq = {}
for w in words:
    freq[w] = freq.get(w, 0) + 1

print(freq['the'])                   # 3
print(len(freq))                     # 9：不同单词的个数

for word, n in sorted(freq.items(), key=lambda kv: (-kv[1], kv[0])):
    print(f'{word:<6} {n}')
` },

    { t: 'callout', kind: 'note', title: '标准库里还有 Counter', html:
      'Python 的 <code>collections.Counter</code> 把上面的模式封装成了一行：' +
      '<code>Counter(words).most_common(3)</code> 直接给出前三名。' +
      '本课坚持先手写，是因为<b>手写才能看清"计数 = 查一次、加一、存回去"</b>；' +
      '理解之后再用 Counter，才知道它替你省了什么。' +
      '另外在数据量很大时，Counter 的速度也更好。'
    },

    { t: 'h', text: '五、分组与嵌套字典', id: 'ch08-5' },

    { t: 'p', html:
      '计数的升级版是<b>分组</b>：把一堆元素按某个规则归到不同的抽屉里，' +
      '每个抽屉里装一组元素。键是"分组的依据"，值是"这个组里的元素列表"。' +
      '实现上依然是"键不存在就初始化空列表，然后 append"，只是值从数字变成了列表。'
    },

    { t: 'code', lang: 'python', caption: '按姓氏首字分组：字典套列表', code:
`names = ['林一', '王二', '张三', '李四', '赵四', '王五']

groups = {}
for name in names:
    first = name[0]                 # 用第一个字当分组依据
    if first not in groups:
        groups[first] = []          # 第一次见到这个键：先建空列表
    groups[first].append(name)

print(groups)
print(groups['王'])                 # ['王二', '王五']

for first, members in groups.items():
    print(f'{first}: {len(members)} 人，{", ".join(members)}')
` },

    { t: 'p', html:
      '分组也可以用 <code>setdefault</code> 简化：' +
      '<code>groups.setdefault(first, []).append(name)</code>，' +
      '一行完成"没有就建、有就取"。但可读性见仁见智，' +
      '初学时先把 if 判断写清楚，等完全理解了再用简写。'
    },

    { t: 'h', lvl: 3, text: '嵌套字典：记录里的记录', id: 'ch08-5-1' },

    { t: 'p', html:
      '当一条记录有多个字段时，用"字典套字典"最自然：外层键是人名，' +
      '内层字典装各科成绩。访问时连续用两个方括号：' +
      '<code>students[\'林一\'][\'数学\']</code>。' +
      '注意任何一层键写错都会 <code>KeyError</code>，所以嵌套结构里 ' +
      '<code>get</code> 和 <code>in</code> 要一层层用。'
    },

    { t: 'code', lang: 'python', caption: '嵌套字典：按学生 + 科目查分', code:
`students = {
    '林一': {'语文': 88, '数学': 92},
    '王二': {'语文': 70, '数学': 65},
    '张三': {'语文': 95, '数学': 88},
}

print(students['林一']['数学'])          # 92
print('林一' in students)                # True
print('物理' in students['林一'])        # False：内层也要判断

# 计算每个人的总分
for name, subjects in students.items():
    total = sum(subjects.values())
    print(f'{name}: 总分 {total}，平均 {total / len(subjects):.1f}')

# 安全地读一个可能不存在的字段
lin = students.get('林一', {})
print(lin.get('物理', '未选修'))         # 未选修
` },

    { t: 'h', text: '六、排序输出与分派表', id: 'ch08-6' },

    { t: 'p', html:
      '字典本身没有"排序"的概念——它的核心是映射，不是顺序。' +
      '要按值排序输出，标准做法是把它转成 <code>items()</code> 的列表，' +
      '再用 <code>sorted(..., key=...)</code> 排。' +
      '<code>key</code> 收到的是 <code>(键, 值)</code> 元组：按值排就写 <code>kv[1]</code>，' +
      '按键排就写 <code>kv[0]</code>。'
    },

    { t: 'code', lang: 'python', caption: '按值排序的三种写法', code:
`freq = {'apple': 3, 'banana': 5, 'fig': 2, 'kiwi': 5}

# 按值从大到小（同值不保证顺序）
top = sorted(freq.items(), key=lambda kv: kv[1], reverse=True)
print(top)

# 按值降序、同值按键升序
top2 = sorted(freq.items(), key=lambda kv: (-kv[1], kv[0]))
print(top2)

# 只要值最大的那一项
best = max(freq.items(), key=lambda kv: kv[1])
print(best)                          # ('banana', 5) 或 ('kiwi', 5)，取决于遍历顺序

# 按 key 排序
print(sorted(freq))                  # 只排键
print(sorted(freq.items()))          # 按 (键, 值) 元组比较
` },

    { t: 'table', head: ['目标', '写法'], rows: [
      ['按键升序', '<code>sorted(d)</code> 或 <code>sorted(d.items())</code>'],
      ['按值升序', '<code>sorted(d.items(), key=lambda kv: kv[1])</code>'],
      ['按值降序', '<code>sorted(d.items(), key=lambda kv: kv[1], reverse=True)</code>'],
      ['值降序 + 键升序', '<code>sorted(d.items(), key=lambda kv: (-kv[1], kv[0]))</code>'],
      ['取最大值项', '<code>max(d.items(), key=lambda kv: kv[1])</code>'],
      ['转成列表', '<code>list(d.items())</code>，元素是元组']
    ], caption: '排序字典的通用公式：items() + key，记住这一条就够用。' },

    { t: 'h', lvl: 3, text: '用字典替代长串 if / elif', id: 'ch08-6-1' },

    { t: 'p', html:
      '当一段代码出现"同一个变量、连续十几条 if / elif / else"时，' +
      '通常说明你在手动实现一张映射表。把它写成字典，' +
      '代码从"二十行分支"变成"一行查表"，而且新增分支不用改函数体。' +
      '这是把数据（映射关系）和逻辑（调用方式）分开的典型例子。'
    },

    { t: 'p', html:
      '注意：字典分派适用于"输入 → 输出"或"输入 → 函数"的稳定映射；' +
      '如果分支里包含复杂的条件组合（<code>and</code>、<code>or</code>、范围判断），' +
      '强行塞进字典反而更难看。判断标准很简单：' +
      '<b>能用"输入值"直接当键，就用字典；否则老老实实写 if。</b>'
    },

    { t: 'code', lang: 'python', caption: 'if / elif 长链 → 分派字典', code:
`# 原写法：每加一档就要加一个分支
def describe_bad(level):
    if level == 1:
        return '低'
    elif level == 2:
        return '中'
    elif level == 3:
        return '高'
    else:
        return '未知'

# 字典写法：映射是数据，查表是逻辑
LEVELS = {1: '低', 2: '中', 3: '高'}

def describe(level):
    return LEVELS.get(level, '未知')

print(describe_bad(2), describe(2))     # 中 中
print(describe(9))                       # 未知

# 更进一步：值可以放函数
def add(a, b):
    return a + b

def sub(a, b):
    return a - b

OPS = {'+': add, '-': sub, '*': lambda a, b: a * b}

print(OPS['+'](3, 4))    # 7
print(OPS['*'](3, 4))    # 12
print(OPS.get('/', '不支持该运算'))   # 不支持该运算
` },

    { t: 'callout', kind: 'ai', title: 'AI 时代这样学', html:
      'AI 能在三秒内写出词频统计，但它不会提醒你"<b>键可能不存在，用 get</b>"' +
      '"<b>遍历时不能改字典</b>"这些边界。' +
      '建议让 AI 写一版，然后自己逐条检查：计数初始值哪来的？空输入会怎样？' +
      '同频时排序稳定吗？<b>把边界问清楚，比抄一份能跑的代码有用得多。</b>'
    },

    { t: 'terms', items: [
      { en: 'dict', zh: '字典', html: '键值对的集合，用 <code>{键: 值}</code> 书写。' },
      { en: 'key / value', zh: '键 / 值', html: '键是查找的索引，必须不可变且唯一；值可以是任何对象。' },
      { en: 'KeyError', zh: '键错误', html: '用不存在的键取 <code>d[k]</code> 时抛出的异常。' },
      { en: 'get', zh: '带默认值的取值', html: '<code>d.get(k, default)</code>，键不存在时返回默认值。' },
      { en: 'items', zh: '键值对视图', html: '<code>d.items()</code> 返回 <code>(键, 值)</code> 序列，用于同时遍历。' },
      { en: 'dispatch table', zh: '分派表', html: '用字典把"输入"映射到"处理函数或结果"，替代长串 if。' }
    ] },

    { t: 'steps', items: [
      { title: '先决定"什么当键"', html: '能唯一标识一条记录、且不可变的字段才适合当键，比如名字、编号、单词本身。' },
      { title: '不确定存在就用 get', html: '计数写成 <code>d[k] = d.get(k, 0) + 1</code>；要区分"不存在"和"值为 None"时用 <code>in</code>。' },
      { title: '遍历需要键值就 items', html: '<code>for k, v in d.items()</code>；不要在循环里增删键。' },
      { title: '要排序先 items', html: '<code>sorted(d.items(), key=lambda kv: kv[1])</code>，按值排序的标准公式。' }
    ] },

    { t: 'keypoint', items: [
      { title: '字典是映射，不是序列', html: '用键直接查值，平均 O(1)；列表按位置查，O(n)。' },
      { title: '键必须不可变且唯一', html: '字符串、数字、元组可以当键；列表不行。数字 <code>75</code> 和字符串 <code>\'75\'</code> 是两个键。' },
      { title: '取值优先用 get', html: '<code>d[k]</code> 缺键就 KeyError；<code>d.get(k, default)</code> 给默认值。' },
      { title: '计数是一个固定模式', html: '<code>d[k] = d.get(k, 0) + 1</code>，换成单词、字符、日期都成立。' },
      { title: '分组是计数的升级版', html: '值从数字换成列表：先判断键在不在，不在就建空列表，再 append。' },
      { title: '排序要转 items', html: '<code>sorted(d.items(), key=lambda kv: kv[1])</code>；字典本身不提供按值顺序。' },
      { title: '映射关系用字典表达', html: '长串 if / elif 若能用"输入值当键"，就该改成字典分派表。' }
    ] },

    { t: 'checklist', id: 'ch08', items: [
      '我能创建字典，用 <code>d[k]</code> 取值，并说出什么类型能当键',
      '我能用 <code>in</code> 和 <code>get</code> 避免 KeyError，并解释二者的区别',
      '我能写出 <code>for k, v in d.items()</code> 并做求和、计数',
      '我能手写字符计数和词频统计，并按次数排序输出',
      '我能把一组名字按键分组，构造"字典套列表"',
      '我能读写"字典套字典"的结构，并安全地取嵌套字段',
      '我知道遍历时不能增删字典，会先把键复制成列表',
      '我能把一段 if / elif 长链改写成字典分派'
    ] }
  ]
});
