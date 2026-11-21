/* =====================================================================
 * data/ch07.js · 第 07 章：列表与文件
 * 职责：从"一个值"走到"一批值"：list 的增删改查、遍历聚合、排序、
 *       别名与拷贝，最后用文件读写把数据持久化并做批量处理。
 * 内容块 schema 见项目说明；示例均按 Python 3 语法书写。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch07',
  num: '07',
  title: '列表与文件',
  en: 'Lists & Files',
  goals: [
    '能创建、索引、切片列表，并用 <code>append / insert / remove / pop</code> 增删元素',
    '能用循环、<code>sum / min / max / len</code> 完成一批数据的聚合',
    '能区分 <code>sort</code> 与 <code>sorted</code>，并正确使用 <code>key</code>',
    '能解释"变量是引用"，知道别名、拷贝和浅拷贝的差别',
    '能用 <code>with open</code> 读写文本文件，并逐行解析、批量处理数据'
  ],
  kp: [
    { id: 'ch07-1', title: '列表：有序、可变、什么都能装' },
    { id: 'ch07-2', title: '增删改查：四个最常用的动作' },
    { id: 'ch07-3', title: '遍历与聚合：把一批数变成一个数' },
    { id: 'ch07-4', title: 'sort 与 sorted：排序的两个入口' },
    { id: 'ch07-5', title: '别名、拷贝与浅拷贝' },
    { id: 'ch07-6', title: '文件读写与批量处理' }
  ],
  blocks: [

    { t: 'callout', kind: 'why', html:
      '前六章处理的基本都是"一个值"：一个数、一段字符串、一个像素。' +
      '但真实任务是"<b>一批</b>"：一学期所有成绩、日志里所有错误、一张表的所有行。' +
      '列表和文件，就是"一批数据"的最小组合——<b>内存里用列表装，磁盘上用文件存</b>。' +
      '统计、排序、去重、生成报表，这四件事占了数据处理工作的绝大部分，' +
      '而它们全都建立在这一章的两个东西上。'
    },

    { t: 'p', lead: true, html:
      '列表（list）是 Python 里最常用的容器：<b>有序、可变、可以装任意类型</b>。' +
      '有序意味着能按下标访问，可变意味着能增删改，能装任意类型意味着它什么都能凑合。' +
      '这一章先把列表的操作练熟，再把它和文件接起来，形成"读入 → 处理 → 写回"的完整闭环。'
    },

    { t: 'h', text: '一、列表：有序、可变、什么都能装', id: 'ch07-1' },

    { t: 'p', html:
      '列表用方括号写，元素之间用逗号隔开。它和字符串一样是<b>序列</b>：' +
      '索引从 0 开始、可以用负索引、可以切片，规则完全一样。' +
      '但列表多了一个字符串没有的能力：<b>可以原地修改</b>。'
    },

    { t: 'code', lang: 'python', caption: '列表的基本形态：索引、切片、长度', code:
`nums = [3, 1, 4, 1, 5, 9, 2, 6]

print(nums[0])       # 3
print(nums[-1])      # 6
print(nums[1:4])     # [1, 4, 1]：切片仍然左闭右开
print(len(nums))     # 8
print(max(nums))     # 9

# 列表可变：字符串不能这样写
nums[0] = 100
print(nums)          # [100, 1, 4, 1, 5, 9, 2, 6]

# 可以装不同类型（能做，但不推荐，除非确实是"记录"）
mixed = ['林一', 88, 92.5, True, [1, 2]]
print(mixed[0], mixed[3], mixed[4])
` },

    { t: 'table', head: ['对比项', '字符串 str', '列表 list'], rows: [
      ['有序', '是，字符有顺序', '是，元素有顺序'],
      ['索引 / 切片', '支持，规则相同', '支持，规则相同'],
      ['可原地修改', '<b>不可以</b>（不可变）', '<b>可以</b>（可变）'],
      ['元素类型', '只能是字符', '任意类型，甚至可以嵌套列表'],
      ['常用操作', '查找、切分、大小写', '增删、排序、聚合']
    ], caption: '先记住"序列规则通用、可变性不同"，后面的细节都能推出来。' },

    { t: 'callout', kind: 'note', title: '空列表与字面量陷阱', html:
      '空列表写成 <code>[]</code>。<code>list()</code> 还能把其他可迭代对象转成列表，' +
      '比如 <code>list(&#39;abc&#39;)</code> 得到 <code>[&#39;a&#39;, &#39;b&#39;, &#39;c&#39;]</code>。' +
      '另外注意：<code>[0] * 3</code> 得到 <code>[0, 0, 0]</code> 没问题，' +
      '但 <code>[[0] * 3] * 2</code> 会得到一个"两行共用同一行"的假矩阵，' +
      '这个坑在第五节会正式拆解。'
    },

    { t: 'h', text: '二、增删改查：四个最常用的动作', id: 'ch07-2' },

    { t: 'p', html:
      '列表的日常操作可以归成四类：<b>加</b>（append / insert / extend）、' +
      '<b>删</b>（remove / pop / del / clear）、<b>改</b>（下标赋值）、' +
      '<b>查</b>（in、index、count）。' +
      '重点是弄清每个方法<b>按什么定位</b>：按值还是按下标，以及<b>返回什么</b>。'
    },

    { t: 'code', lang: 'python', caption: '增删改查全家桶', code:
`fruits = ['apple', 'banana', 'orange']

fruits.append('pear')            # 末尾追加
fruits.insert(1, 'blueberry')    # 在下标 1 处插入，后面的元素后移
fruits.extend(['fig', 'kiwi'])   # 把另一个列表的元素逐个追加
print(fruits)

fruits.remove('banana')          # 按"值"删除第一个匹配项
last = fruits.pop()              # 按"下标"删除，默认末尾；返回被删的元素
first = fruits.pop(0)
print(last, first)
print(fruits)

print('apple' in fruits)         # 查：是否存在
print(fruits.index('orange'))    # 查：第一次出现的下标
print(fruits.count('pear'))      # 查：出现次数

fruits[0] = 'PEAR'               # 改：下标赋值
del fruits[1]                    # del 按下标删除，不返回
print(fruits)
` },

    { t: 'table', head: ['操作', '写法', '按什么定位', '返回值'], rows: [
      ['末尾追加', '<code>a.append(x)</code>', '—', '<code>None</code>'],
      ['插入', '<code>a.insert(i, x)</code>', '下标 i', '<code>None</code>'],
      ['按值删除', '<code>a.remove(x)</code>', '值（第一个匹配）', '<code>None</code>；找不到抛 ValueError'],
      ['按下标删除', '<code>a.pop(i)</code>', '下标（默认末尾）', '被删掉的元素'],
      ['按下标删除（运算符）', '<code>del a[i]</code>', '下标', '无'],
      ['查找下标', '<code>a.index(x)</code>', '值', '下标；找不到抛 ValueError'],
      ['计数', '<code>a.count(x)</code>', '值', '出现次数']
    ], caption: '记住一个规律：原地修改的方法一般返回 None，查询类方法返回值。' },

    { t: 'callout', kind: 'warn', title: 'remove(x) 和 pop(i) 别混', html:
      '<code>remove</code> 的参数是<b>值</b>，<code>pop</code> 的参数是<b>下标</b>。' +
      '在数字列表里这两者常常看起来"都能用"，于是出现诡异 bug：' +
      '<code>[10, 20, 30].remove(2)</code> 会抛 <code>ValueError</code>（没有值 2），' +
      '而 <code>[10, 20, 30].pop(2)</code> 删掉的是 30。' +
      '另外 <code>pop</code> 在空列表上删除会抛 <code>IndexError</code>，删之前先判空。'
    },

    { t: 'h', lvl: 3, text: '边遍历边删除的坑', id: 'ch07-2-1' },

    { t: 'p', html:
      '如果你在 <code>for x in a</code> 循环里删除元素，列表长度会变，' +
      '而循环内部的下标还在往前走，结果就是<b>有些元素被跳过</b>。' +
      '正确做法是"先生成新列表"或"倒着删"，不要一边走一边砍。'
    },

    { t: 'code', lang: 'python', caption: '删除所有小于 60 的分数：三种写法', code:
`scores = [88, 45, 92, 30, 75, 55]

# 错误：边遍历边 remove，会漏掉元素
bad = [88, 45, 92, 30, 75, 55]
for s in bad:
    if s < 60:
        bad.remove(s)
print(bad)              # [88, 92, 30, 75]：30 被漏掉了

# 正确 1：生成新列表
good = []
for s in scores:
    if s >= 60:
        good.append(s)
print(good)             # [88, 92, 75]

# 正确 2：倒着删
good2 = [88, 45, 92, 30, 75, 55]
for i in range(len(good2) - 1, -1, -1):
    if good2[i] < 60:
        good2.pop(i)
print(good2)            # [88, 92, 75]
` },

    { t: 'h', text: '三、遍历与聚合：把一批数变成一个数', id: 'ch07-3' },

    { t: 'p', html:
      '聚合就是把多个值合成一个值：求和、平均值、最大最小、计数。' +
      'Python 内置了 <code>sum</code>、<code>min</code>、<code>max</code>、<code>len</code>，' +
      '能用就先用；它们比自己写的循环更快、更不容易错。' +
      '但你必须会手写累加，因为真实需求往往不是简单求和，而是"符合条件的求和"。'
    },

    { t: 'code', lang: 'python', caption: '聚合：内置函数与手写循环', code:
`scores = [88, 92, 75, 60, 100]

print(sum(scores))                  # 415
print(len(scores))                  # 5
print(sum(scores) / len(scores))    # 83.0
print(min(scores), max(scores))     # 60 100

# 手写累加：理解 sum 在做什么
total = 0
for s in scores:
    total += s
print(total)                        # 415

# 带条件的聚合：及格分之和
total_pass = 0
count_pass = 0
for s in scores:
    if s >= 80:
        total_pass += s
        count_pass += 1
print(total_pass, count_pass)       # 280 3
print(total_pass / count_pass)      # 93.33...
` },

    { t: 'p', html:
      '遍历时如果需要<b>位置</b>，用 <code>enumerate</code>；' +
      '如果同时要遍历两个列表，用 <code>zip</code>。' +
      '这两个函数能避免大量 <code>range(len(a))</code> 的下标写法，' +
      '下标写法一旦有一处差一，就会越界或错位。'
    },

    { t: 'code', lang: 'python', caption: 'enumerate 与 zip', code:
`names = ['林一', '王二', '张三']
scores = [88, 75, 92]

for i, name in enumerate(names):
    print(i, name)

for name, score in zip(names, scores):
    print(f'{name}: {score}')

# 组合起来：只打印及格的
for name, score in zip(names, scores):
    if score >= 80:
        print(f'{name} 及格（{score}）')
` },

    { t: 'h', text: '四、sort 与 sorted：排序的两个入口', id: 'ch07-4' },

    { t: 'p', html:
      '排序有两个入口，区别只有一句话：' +
      '<b><code>list.sort()</code> 原地排序、返回 None；' +
      '<code>sorted(list)</code> 返回新列表、原列表不动。</b>' +
      '需要保留原顺序时用 <code>sorted</code>，确定不再需要原顺序时用 <code>sort</code>。' +
      '两者都支持 <code>reverse=True</code> 和 <code>key=</code> 参数。'
    },

    { t: 'code', lang: 'python', caption: 'sort / sorted / key / reverse', code:
`scores = [88, 92, 75, 60, 100]

new_list = sorted(scores)        # 返回新列表
print(new_list)                  # [60, 75, 88, 92, 100]
print(scores)                    # [88, 92, 75, 60, 100] 原列表不变

scores.sort()                    # 原地排序
print(scores)                    # [60, 75, 88, 92, 100]

scores.sort(reverse=True)
print(scores)                    # [100, 92, 88, 75, 60]

words = ['kiwi', 'banana', 'fig', 'apple']
print(sorted(words))                    # 按字典序
print(sorted(words, key=len))           # 按长度：['fig', 'kiwi', 'apple', 'banana']
` },

    { t: 'table', head: ['对比项', '<code>a.sort()</code>', '<code>sorted(a)</code>'], rows: [
      ['改谁', '原地改 a', '不改 a，返回新列表'],
      ['返回值', '<b>None</b>', '排好序的新列表'],
      ['能否用于表达式', '不能', '能，如 <code>sorted(a)[0]</code>'],
      ['典型用途', '不再需要原顺序', '需要同时保留原顺序和新顺序'],
      ['参数', 'reverse / key', 'reverse / key']
    ], caption: '最常见的 bug 是写成 <code>a = a.sort()</code>，结果 a 变成 None。' },

    { t: 'callout', kind: 'warn', title: 'a = a.sort() 把列表变成 None', html:
      '<code>sort</code> 原地排序后返回 <code>None</code>。' +
      '写成 <code>a = a.sort()</code> 之后，<code>a</code> 就指向 <code>None</code> 了，' +
      '下一行再 <code>len(a)</code> 立刻 <code>TypeError</code>。' +
      '正确写法只有两种：<code>a.sort()</code>（不接返回值），' +
      '或者 <code>a = sorted(a)</code>。'
    },

    { t: 'h', text: '五、别名、拷贝与浅拷贝', id: 'ch07-5' },

    { t: 'p', html:
      '这一节解释一个几乎所有初学者都会踩的坑。' +
      '在 Python 里，变量名不是"盒子"，而是<b>贴在对象上的标签</b>。' +
      '<code>b = a</code> 不是"把 a 的内容复制一份给 b"，而是"给同一个列表再贴一个标签 b"。' +
      '所以通过 b 修改列表，a 看到的也会变。'
    },

    { t: 'code', lang: 'python', caption: '别名：两个名字，一个列表', code:
`a = [1, 2, 3]
b = a                 # 别名，不是拷贝
b.append(4)

print(a)              # [1, 2, 3, 4]
print(b)              # [1, 2, 3, 4]
print(a is b)         # True：是同一个对象
print(a == b)         # True：内容也相同

# 真正的拷贝：切片、copy()、list()
c = a[:]
c.append(5)
print(a)              # [1, 2, 3, 4]：a 没变
print(c)              # [1, 2, 3, 4, 5]
print(a is c)         # False
` },

    { t: 'table', head: ['写法', '类型', '改新列表会影响旧列表吗', '判断'], rows: [
      ['<code>b = a</code>', '别名（引用同一个对象）', '<b>会</b>', '<code>a is b</code> 为 True'],
      ['<code>b = a[:]</code>', '浅拷贝', '外层不会', '<code>a is b</code> 为 False'],
      ['<code>b = a.copy()</code>', '浅拷贝', '外层不会', '同上'],
      ['<code>b = list(a)</code>', '浅拷贝', '外层不会', '同上'],
      ['<code>copy.deepcopy(a)</code>', '深拷贝', '完全不会', '需要 import copy']
    ], caption: '浅拷贝只复制"最外层"，内层元素仍然共享。' },

    { t: 'h', lvl: 3, text: '嵌套列表的浅拷贝陷阱', id: 'ch07-5-1' },

    { t: 'p', html:
      '当列表里装的是<b>列表</b>时，"浅"这个字的威力就显现出来了：' +
      '<code>.copy()</code> 只复制了外层容器，内层那些列表还是同一批对象。' +
      '所以要复制一个二维表，必须逐行复制，或者用 <code>copy.deepcopy</code>。'
    },

    { t: 'code', lang: 'python', caption: '浅拷贝只拷一层：二维表的经典 bug', code:
`matrix = [[1, 2], [3, 4]]
clone = matrix.copy()        # 只复制最外层

clone[0][0] = 99             # 改的是内层列表
print(matrix)                # [[99, 2], [3, 4]]：原表也被改了！
print(clone)                 # [[99, 2], [3, 4]]

# 正确 1：逐行复制
clone2 = [row[:] for row in matrix]
clone2[0][0] = 7
print(matrix)                # [[99, 2], [3, 4]]：不变
print(clone2)                # [[7, 2], [3, 4]]

# 正确 2：深拷贝
import copy
clone3 = copy.deepcopy(matrix)
clone3[1][1] = 0
print(matrix)                # [[99, 2], [3, 4]]
` },

    { t: 'p', html:
      '顺带解释第 5 章留下的那个坑：<code>[[0] * 3] * 2</code> 得到的两行，' +
      '其实是<b>同一个列表</b>被引用了两次。所以改一行，两行一起变。' +
      '正确写法是用列表推导式逐行新建：<code>[[0] * 3 for _ in range(2)]</code>。'
    },

    { t: 'code', lang: 'python', caption: '创建二维表的两种写法', code:
`bad = [[0] * 3] * 2
bad[0][1] = 1
print(bad)      # [[0, 1, 0], [0, 1, 0]]：两行都变了

good = [[0] * 3 for _ in range(2)]
good[0][1] = 1
print(good)     # [[0, 1, 0], [0, 0, 0]]：只改第一行
` },

    { t: 'h', text: '六、文件读写与批量处理', id: 'ch07-6' },

    { t: 'p', html:
      '程序一结束，内存里的列表就没了。要把结果留下来，必须写进文件；' +
      '要处理真实数据，必须从文件读进来。' +
      'Python 读写文本文件的标准写法是 <code>with open(...) as f:</code>——' +
      '<b>with 保证文件在离开代码块时自动关闭</b>，即使中间抛异常也不漏。' +
      '另外一个必须养成的习惯：<b>永远显式写 encoding=\'utf-8\'</b>，' +
      '否则在 Windows 上默认编码不同，中文字符轻则乱码、重则直接抛解码错误。'
    },

    { t: 'code', lang: 'python', caption: '写文件：先造一份数据', code:
`# 'w' = 覆盖写：文件不存在则新建，存在则清空重写
with open('scores.txt', 'w', encoding='utf-8') as f:
    f.write('林一,88,92\\n')
    f.write('王二,70,65\\n')
    f.write('张三,95,88\\n')
    f.write('赵四,58,72\\n')

print('写入完成')
` },

    { t: 'code', lang: 'python', caption: '读文件：一次全读 vs 逐行读', code:
`# 一次读全部内容，返回一个字符串
with open('scores.txt', encoding='utf-8') as f:
    text = f.read()
print(repr(text[:20]))        # 前 20 个字符，含换行符

# 逐行读：内存友好，适合大文件
with open('scores.txt', encoding='utf-8') as f:
    for line in f:
        line = line.strip()   # 去掉行尾的换行符和首尾空白
        if not line:
            continue          # 跳过空行
        print(line)

# 读成列表：每行一个字符串（行尾带换行符）
with open('scores.txt', encoding='utf-8') as f:
    lines = f.readlines()
print(len(lines))             # 4
print(lines[0])               # '林一,88,92\\n'
` },

    { t: 'p', html:
      '逐行读的 <code>for line in f</code> 是最推荐的写法：一次只加载一行，' +
      '十万行、一百万行都不会撑爆内存。' +
      '注意每行末尾的换行符 <code>\\n</code> 会原样保留，所以解析前几乎总要 <code>strip()</code>；' +
      '而 <code>strip()</code> 同时也去掉了行首尾的空格，' +
      '这对 CSV 里 "<code>88, 92</code>" 这种带空格的写法正好是需要的。'
    },

    { t: 'h', lvl: 3, text: '批量处理一份成绩单', id: 'ch07-6-1' },

    { t: 'p', html:
      '现在把前面所有零件装起来：读文件 → 逐行 <code>split</code> → 类型转换 → ' +
      '存进列表 → 聚合并排序 → 输出。' +
      '这就是数据处理最典型的"一条流水线"，第 9 章的综合项目也是同样的骨架。'
    },

    { t: 'code', lang: 'python', caption: '读入 → 统计 → 排序 → 输出', code:
`records = []                     # 每个元素是 [姓名, 语文, 数学]

with open('scores.txt', encoding='utf-8') as f:
    for line in f:
        parts = line.strip().split(',')
        if len(parts) != 3:      # 防御：坏数据直接跳过
            continue
        name = parts[0]
        chinese = int(parts[1])
        math = int(parts[2])
        records.append([name, chinese, math])

print(records)

# 统计总分与平均分
totals = []
for r in records:
    totals.append(r[1] + r[2])

print('总分:', sum(totals))
print('平均:', sum(totals) / len(totals))
print('最高:', max(totals), '最低:', min(totals))

# 按总分从高到低排序，输出名次
ranking = sorted(records, key=lambda r: r[1] + r[2], reverse=True)
for i, r in enumerate(ranking, start=1):
    print(f'第 {i} 名：{r[0]}，总分 {r[1] + r[2]}')
` },

    { t: 'callout', kind: 'warn', title: '文件不存在会抛 FileNotFoundError', html:
      '读取一个不存在的文件时，<code>open</code> 直接抛 <code>FileNotFoundError</code>，' +
      '程序停止。稳妥的写法是提前判断 <code>os.path.exists(path)</code>，' +
      '或者用 <code>try / except</code> 包住读取逻辑（异常处理下一章演示用法）。' +
      '另外注意：<b>相对路径是相对于"运行程序时的工作目录"</b>，' +
      '不是相对于 .py 文件所在目录。在别的目录下运行，就会找不到文件。'
    },

    { t: 'h', lvl: 3, text: '追加模式与文件覆写风险', id: 'ch07-6-2' },

    { t: 'p', html:
      '<code>open(path, \'w\')</code> 会<b>清空</b>原文件，哪怕你只是想加一行。' +
      '要追加内容，必须用 <code>\'a\'</code> 模式。' +
      '这是新手毁掉数据最常见的方式：跑第二次实验，第一次的结果没了。' +
      '写重要数据前，先备份或者先确认模式。'
    },

    { t: 'code', lang: 'python', caption: "'a' 追加，'w' 覆盖", code:
`# 'a' = append：保留原内容，在末尾追加
with open('scores.txt', 'a', encoding='utf-8') as f:
    f.write('王五,77,80\\n')

with open('scores.txt', encoding='utf-8') as f:
    print(len(f.readlines()))     # 5 行

# 'w' = write：会清空！
# with open('scores.txt', 'w', encoding='utf-8') as f:
#     f.write('只剩这一行\\n')
print('演示结束')
` },

    { t: 'terms', items: [
      { en: 'list', zh: '列表', html: '有序可变的容器，用方括号书写，索引规则与字符串相同。' },
      { en: 'in-place', zh: '原地操作', html: '直接修改对象本身，通常返回 <code>None</code>，如 <code>append</code>、<code>sort</code>。' },
      { en: 'alias', zh: '别名', html: '两个变量指向同一个对象。通过任一个修改，另一个都能看到。' },
      { en: 'shallow copy', zh: '浅拷贝', html: '只复制最外层容器，内层元素仍然共享，如 <code>a[:]</code>。' },
      { en: 'deep copy', zh: '深拷贝', html: '递归复制所有层，<code>copy.deepcopy</code>，代价更高。' },
      { en: 'with', zh: '上下文管理器', html: '<code>with open(...) as f:</code>，离开代码块自动关闭文件。' }
    ] },

    { t: 'steps', items: [
      { title: '先想清数据的形状', html: '是"一列数"还是"一组记录"？一列数用列表；带多个字段的记录用 <code>[姓名, 分数]</code> 这种小列表，或者第 8 章的字典。' },
      { title: '读写都套 with', html: '<code>with open(path, encoding=\'utf-8\') as f:</code>，不手动 close。' },
      { title: '逐行解析先防御', html: '<code>strip()</code>，判空行，检查 <code>len(parts)</code>，再转换类型。' },
      { title: '统计与排序分开写', html: '先把记录读进列表，再单独做聚合并 <code>sorted</code>，不要一边读一边算，出错时难定位。' }
    ] },

    { t: 'keypoint', items: [
      { title: '列表是有序可变的序列', html: '索引、负索引、切片规则和字符串一样；不同点是能原地修改。' },
      { title: '增删按"值"还是按"下标"', html: '<code>append / insert</code> 是加，<code>remove</code> 按值删、<code>pop / del</code> 按下标删。' },
      { title: '聚合优先用内置函数', html: '<code>sum / min / max / len</code> 更快更安全；复杂条件才手写累加。' },
      { title: 'sort 原地，sorted 新建', html: '<code>a.sort()</code> 返回 None；<code>sorted(a)</code> 返回新列表，两者都支持 <code>key</code> 与 <code>reverse</code>。' },
      { title: '赋值是贴标签，不是复制', html: '<code>b = a</code> 是别名；复制用 <code>a[:]</code> / <code>a.copy()</code>；嵌套结构要逐层复制或深拷贝。' },
      { title: '文件读写用 with', html: '显式 <code>encoding=\'utf-8\'</code>；<code>\'w\'</code> 会清空，追加用 <code>\'a\'</code>；逐行读最省内存。' }
    ] },

    { t: 'checklist', id: 'ch07', items: [
      '我能创建列表，并用索引、负索引、切片取出元素',
      '我能说出 <code>append / insert / remove / pop</code> 的区别，包括返回值和定位方式',
      '我能用手写循环求"及格分的平均分"',
      '我能解释 <code>sort</code> 与 <code>sorted</code> 的区别，并避免 <code>a = a.sort()</code>',
      '我能说清 <code>b = a</code>、<code>b = a[:]</code>、<code>copy.deepcopy(a)</code> 三者的差别',
      '我能用 <code>with open</code> 写文件、读文件、逐行处理并统计',
      '我知道 <code>\'w\'</code> 会清空文件，追加要用 <code>\'a\'</code>'
    ] }
  ]
});
