/* =====================================================================
 * data/ch09.js · 第 09 章：嵌套结构、排序与综合项目
 * 职责：把列表与字典组合成真实的数据形状，讲清多层遍历、按 key 排序、
 *       线性与二分查找和复杂度直觉，最后用一份销售数据完成综合项目。
 * 内容块 schema 见项目说明；示例均按 Python 3 语法书写。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch09',
  num: '09',
  title: '嵌套结构、排序与综合项目',
  en: 'Nested Structures, Sorting & Project',
  goals: [
    '能根据数据形状选择"列表套字典"或"字典套列表"，并写出多层遍历',
    '能用 <code>key=lambda</code> 完成单字段与多字段排序',
    '能实现线性查找与二分查找，并说清它们各自的前提与代价',
    '能用大 O 记号估计算法在数据量变大时的表现',
    '能独立完成"读入 → 统计 → 排序 → 输出报告"的完整程序'
  ],
  kp: [
    { id: 'ch09-1', title: '嵌套结构：列表套字典与字典套列表' },
    { id: 'ch09-2', title: '多层遍历：从"记录"里取字段' },
    { id: 'ch09-3', title: '按 key 排序与多字段排序' },
    { id: 'ch09-4', title: '线性查找与二分查找' },
    { id: 'ch09-5', title: '复杂度直觉：n 变大了会怎样' },
    { id: 'ch09-6', title: '综合项目：从数据到报告' }
  ],
  blocks: [

    { t: 'callout', kind: 'why', html:
      '单层的列表和字典解决不了真实数据：一条成绩记录有姓名、科目、分数好几个字段，' +
      '一学期有几百条记录，每个科目下面又有一串学生。' +
      '真实数据的形状是<b>嵌套</b>的，程序的结构必须跟着数据的形状走。' +
      '这一章把前两章的容器组合起来，再加上排序与查找这两个"每天都要用"的工具，' +
      '最后完整做一个小项目——<b>到这里，你已经具备写一个有用程序的全套零件。</b>'
    },

    { t: 'p', lead: true, html:
      '这一章不再引入全新的语法，重点在<b>组合</b>：' +
      '列表给你顺序，字典给你字段名，排序给你秩序，查找给你速度。' +
      '把这些东西按数据的形状摆好，就是数据处理的全部功力。' +
      '章末的综合项目会把它们串成一条完整流水线，请务必亲手跑一遍。'
    },

    { t: 'h', text: '一、嵌套结构：列表套字典与字典套列表', id: 'ch09-1' },

    { t: 'p', html:
      '一条记录如果有多个字段，用字典装最自然：' +
      '<code>{\'name\': \'林一\', \'subject\': \'语文\', \'score\': 88}</code>。' +
      '一批记录就放进列表：<code>[记录1, 记录2, ...]</code>。' +
      '这就得到最常见的形状——<b>列表套字典</b>：外层管顺序，内层管字段。' +
      '读起来像一张表：列表是行，字典是列名。'
    },

    { t: 'code', lang: 'python', caption: '列表套字典：一张成绩表', code:
`records = [
    {'name': '林一', 'subject': '语文', 'score': 88},
    {'name': '林一', 'subject': '数学', 'score': 92},
    {'name': '王二', 'subject': '语文', 'score': 70},
    {'name': '王二', 'subject': '数学', 'score': 65},
    {'name': '张三', 'subject': '语文', 'score': 95},
]

print(len(records))                 # 5 条记录
print(records[0]['name'])           # 林一：先按下标取记录，再按字段取值
print(records[0]['score'])          # 88

# 遍历一条记录的所有字段
for key, value in records[0].items():
    print(f'{key} = {value}')
` },

    { t: 'p', html:
      '如果访问方式反过来——"给我语文这一科的所有人"，那么更好的形状是' +
      '<b>字典套列表</b>：外层键是科目，值是这个科目的记录列表。' +
      '选哪种形状取决于<b>你最常怎么问问题</b>：' +
      '按顺序处理全部记录，就用列表套字典；按某个字段分组查询，就用字典套列表。' +
      '两者可以互相转换，转换的代价通常可以接受。'
    },

    { t: 'code', lang: 'python', caption: '字典套列表：按科目分组', code:
`records = [
    {'name': '林一', 'subject': '语文', 'score': 88},
    {'name': '林一', 'subject': '数学', 'score': 92},
    {'name': '王二', 'subject': '语文', 'score': 70},
    {'name': '王二', 'subject': '数学', 'score': 65},
    {'name': '张三', 'subject': '语文', 'score': 95},
]

by_subject = {}
for r in records:
    subject = r['subject']
    if subject not in by_subject:
        by_subject[subject] = []
    by_subject[subject].append(r)

print(by_subject.keys())            # dict_keys(['语文', '数学'])
print(len(by_subject['语文']))      # 3
print(by_subject['数学'][0]['name'])  # 林一

# 每个科目的平均分
for subject, rows in by_subject.items():
    avg = sum(r['score'] for r in rows) / len(rows)
    print(f'{subject}: 平均 {avg:.1f}')
` },

    { t: 'table', head: ['形状', '写法', '适合回答', '不适合回答'], rows: [
      ['列表套字典', '<code>[{\'name\': ..., \'score\': ...}, ...]</code>', '按顺序遍历、排序、输出整张表', '"某科目有哪些人"要扫描全表'],
      ['字典套列表', '<code>{\'语文\': [记录, ...], ...}</code>', '按类别取出一组记录', '按 id 找单条记录要遍历组内'],
      ['字典套字典', '<code>{\'林一\': {\'语文\': 88, ...}}</code>', '按两级键精确查值', '遍历所有记录、排序'],
      ['列表套列表', '<code>[[姓名, 分数], ...]</code>', '位置固定的短记录、矩阵', '字段一多就记不清第几列是什么']
    ], caption: '没有"最好"的形状，只有"最常问的问题"决定形状。' },

    { t: 'callout', kind: 'warn', title: '深层访问要逐层来', html:
      '<code>records[0][\'score\']</code> 里任何一层写错都会报错：' +
      '下标越界是 <code>IndexError</code>，字段名写错是 <code>KeyError</code>。' +
      '在嵌套结构里，<b>先用 print 把中间层打印出来</b>再往下写，' +
      '比对着错误信息猜要快得多。'
    },

    { t: 'h', text: '二、多层遍历：从"记录"里取字段', id: 'ch09-2' },

    { t: 'p', html:
      '嵌套结构的遍历没有新语法，只有"循环里再套循环"或者"循环里再遍历字典"。' +
      '关键在于<b>提前想清楚每一层代表什么</b>：外层是记录，内层是字段；' +
      '或者外层是分组，内层是组内元素。' +
      '写之前用一句话说出每个循环变量的含义，说不清就先别写。'
    },

    { t: 'code', lang: 'python', caption: '多层遍历：按学生汇总各科', code:
`records = [
    {'name': '林一', 'subject': '语文', 'score': 88},
    {'name': '林一', 'subject': '数学', 'score': 92},
    {'name': '王二', 'subject': '语文', 'score': 70},
    {'name': '王二', 'subject': '数学', 'score': 65},
    {'name': '张三', 'subject': '语文', 'score': 95},
]

# 外层遍历记录；用字典把"同一个人"的成绩攒起来
totals = {}
for r in records:
    name = r['name']
    if name not in totals:
        totals[name] = {'total': 0, 'count': 0}
    totals[name]['total'] += r['score']
    totals[name]['count'] += 1

for name, info in totals.items():
    avg = info['total'] / info['count']
    print(f'{name}: 总分 {info["total"]}，平均 {avg:.1f}')
` },

    { t: 'p', html:
      '注意上面这段代码同时用了两种嵌套：<code>totals</code> 是<b>字典套字典</b>，' +
      '遍历它的时候用 <code>for name, info in totals.items()</code>。' +
      '而 <code>records</code> 是<b>列表套字典</b>，遍历时用 <code>for r in records</code>。' +
      '同一段程序里出现两三种容器形状是正常的，关键是每层的"含义"要清楚。' +
      '如果觉得 <code>if name not in totals</code> 啰嗦，可以用 ' +
      '<code>totals.setdefault(name, {\'total\': 0, \'count\': 0})</code> 一行初始化，' +
      '但可读性上先写清楚更稳妥。'
    },

    { t: 'h', text: '三、按 key 排序与多字段排序', id: 'ch09-3' },

    { t: 'p', html:
      '列表套字典的排序，核心是告诉 <code>sorted</code>：' +
      '<b>拿字典里的哪个字段来比较</b>。这就要用到 <code>key</code> 参数。' +
      '<code>key</code> 接收一个函数，<code>sorted</code> 会对每个元素调用它，' +
      '用返回值来比较。<code>lambda r: r[\'score\']</code> 就是"取这条记录的 score 字段"。'
    },

    { t: 'code', lang: 'python', caption: '按字段排序：升序、降序、多字段', code:
`records = [
    {'name': '林一', 'subject': '语文', 'score': 88},
    {'name': '王二', 'subject': '语文', 'score': 70},
    {'name': '张三', 'subject': '语文', 'score': 95},
    {'name': '李四', 'subject': '语文', 'score': 88},
]

# 按分数升序
asc = sorted(records, key=lambda r: r['score'])
print([r['name'] for r in asc])       # ['王二', '林一', '李四', '张三']

# 按分数降序
desc = sorted(records, key=lambda r: r['score'], reverse=True)
print([r['name'] for r in desc])

# 多字段：先按分数降序，同分按名字升序
by_score_then_name = sorted(records, key=lambda r: (-r['score'], r['name']))
for r in by_score_then_name:
    print(r['name'], r['score'])
` },

    { t: 'p', html:
      '多字段排序的写法是<b>让 lambda 返回元组</b>：Python 会按元组的分量依次比较，' +
      '第一个分量相同才比第二个。升序用正数，降序在数字前加负号。' +
      '字符串也能排序（按字典序），但数字和字符串混在一起会抛 ' +
      '<code>TypeError</code>，所以排序前要保证字段类型一致。' +
      '元组里也可以放多个字符串、甚至 <code>len()</code> 之类的计算结果。'
    },

    { t: 'code', lang: 'python', caption: '按计算结果排序：总分、长度', code:
`people = [
    {'name': '林一', 'chinese': 88, 'math': 92},
    {'name': '王二', 'chinese': 70, 'math': 65},
    {'name': '张三', 'chinese': 95, 'math': 88},
]

# 按总分排序：key 里现算
ranked = sorted(people, key=lambda p: p['chinese'] + p['math'], reverse=True)
for p in ranked:
    print(p['name'], p['chinese'] + p['math'])

# 按姓名字符串长度排序
words = ['kiwi', 'fig', 'banana', 'apple']
print(sorted(words, key=len))              # 短的在前面
print(sorted(words, key=lambda w: (len(w), w)))   # 同长按字典序
` },

    { t: 'table', head: ['需求', 'key 写法'], rows: [
      ['按某字段升序', '<code>key=lambda r: r[\'score\']</code>'],
      ['按某字段降序', '<code>key=lambda r: r[\'score\'], reverse=True</code>'],
      ['先降后升（多字段）', '<code>key=lambda r: (-r[\'score\'], r[\'name\'])</code>'],
      ['按计算值', '<code>key=lambda p: p[\'chinese\'] + p[\'math\']</code>'],
      ['按字符串长度', '<code>key=len</code>'],
      ['按长度再按字典序', '<code>key=lambda w: (len(w), w)</code>']
    ], caption: '排序模板不需要背，认准"key 返回什么，就按什么排"。' },

    { t: 'callout', kind: 'warn', title: '排序前先检查数据', html:
      '列表里混着数字和字符串时，<code>sorted</code> 会在比较的瞬间抛 ' +
      '<code>TypeError: \'<\' not supported between instances of \'str\' and \'int\'</code>。' +
      '如果字段可能来自 CSV（<b>一定是字符串</b>），要先 <code>int()</code> / <code>float()</code> 转换再排序，' +
      '否则会按字典序排：<code>\'100\'</code> 排在 <code>\'20\'</code> 前面。'
    },

    { t: 'h', text: '四、线性查找与二分查找', id: 'ch09-4' },

    { t: 'p', html:
      '查找就是"在一个集合里找某个值"。最直接的办法是把元素从头看到尾，' +
      '这叫<b>线性查找</b>：最好情况第一个就中，最坏情况要看完 n 个，平均 n/2 次，' +
      '复杂度记作 O(n)。它<b>不需要数据有序</b>，这是它最大的优点。'
    },

    { t: 'code', lang: 'python', caption: '线性查找：逐个比较', code:
`records = [
    {'name': '林一', 'score': 88},
    {'name': '王二', 'score': 70},
    {'name': '张三', 'score': 95},
]

def find_by_name(records, target):
    """返回下标；找不到返回 -1。"""
    for i, r in enumerate(records):
        if r['name'] == target:
            return i
    return -1

print(find_by_name(records, '张三'))     # 2
print(find_by_name(records, '李四'))     # -1
` },

    { t: 'p', html:
      '如果数据已经<b>排好序</b>，就可以用更聪明的方法：每次看中间那个元素，' +
      '比目标大就去左半边找，比目标小就去右半边找，一次排除一半。' +
      '这叫<b>二分查找</b>。n 个元素最多比较 <code>log2(n)</code> 次：' +
      '100 万条数据只要 20 次左右，而线性查找平均要 50 万次。' +
      '代价是<b>必须先排序</b>，而且只能在"按下标随机访问"的结构上用——列表可以，链表不行。'
    },

    { t: 'code', lang: 'python', caption: '二分查找：每次砍掉一半', code:
`def binary_search(nums, target):
    """在已排序的列表里找 target，返回下标；找不到返回 -1。"""
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = (lo + hi) // 2          # 中间位置，整数除法
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            lo = mid + 1              # 目标在右半边
        else:
            hi = mid - 1              # 目标在左半边
    return -1

sorted_nums = [1, 3, 5, 7, 9, 11, 13]
print(binary_search(sorted_nums, 7))     # 3
print(binary_search(sorted_nums, 8))     # -1
print(binary_search(sorted_nums, 1))     # 0
print(binary_search(sorted_nums, 13))    # 6
` },

    { t: 'compare', left: {
      title: '线性查找 O(n)', html:
        '从第一个看到最后一个，不要求有序，实现最直接。' +
        '数据量小、或者只查一两次时，它是正确选择；' +
        '<code>list.index()</code> 和 <code>in</code> 本质上就是线性查找。'
    }, right: {
      title: '二分查找 O(log n)', html:
        '<b>必须先排序</b>；每次比较排除一半，数据量大时快得惊人。' +
        '注意边界：<code>lo &lt;= hi</code> 这个等号不能省，' +
        '<code>mid = (lo + hi) // 2</code> 必须用整数除法。'
    } },

    { t: 'h', text: '五、复杂度直觉：n 变大了会怎样', id: 'ch09-5' },

    { t: 'p', html:
      '复杂度不是考试概念，而是判断"这段代码能不能用"的工具。' +
      '你不需要精确计算常数，只需要知道<b>数据量翻倍时，时间大概会怎么变</b>。' +
      '下面这张表把常见复杂度和实际数字放在一起，' +
      '看一眼就知道为什么"在 100 万条数据里循环套循环"是个灾难。'
    },

    { t: 'table', head: ['复杂度', '含义', 'n = 1,000', 'n = 1,000,000', '典型例子'], rows: [
      ['O(1)', '常数时间，与 n 无关', '1', '1', '字典按键取值、<code>len()</code>'],
      ['O(log n)', '每次砍一半', '约 10', '约 20', '二分查找'],
      ['O(n)', '线性，逐个处理', '1,000', '1,000,000', '遍历列表、<code>sum()</code>、线性查找'],
      ['O(n log n)', '排序的标准代价', '约 10,000', '约 20,000,000', '<code>sorted()</code>、<code>sort()</code>'],
      ['O(n²)', '双重循环', '1,000,000', '10¹²（不可接受）', '两两比较、冒泡排序'],
      ['O(2ⁿ)', '指数爆炸', '≈10³⁰⁰', '天文数字', '暴力枚举所有子集']
    ], caption: '同样叫"跑得动"，n 从 1000 涨到 100 万，差距是几百万倍。' },

    { t: 'p', html:
      '两个实用结论。第一，<b>循环里套循环要警惕</b>：' +
      '如果有 n 条记录、每条又要和 n 条比较，就是 O(n²)，n 一大立刻不可用。' +
      '第二，<b>用字典把 O(n) 的查找变成 O(1)</b>：' +
      '先把数据建成"键 → 值"的字典，再查就不用每次遍历。' +
      '这是"用空间换时间"最常见的做法。'
    },

    { t: 'code', lang: 'python', caption: '同一个需求：线性查找 vs 建字典', code:
`records = [
    {'id': 1001, 'name': '林一'},
    {'id': 1002, 'name': '王二'},
    {'id': 1003, 'name': '张三'},
]

# 每次查都要遍历：查 m 次是 O(m * n)
def find_slow(records, target_id):
    for r in records:
        if r['id'] == target_id:
            return r['name']
    return None

# 一次建索引，之后每次查 O(1)
index = {r['id']: r['name'] for r in records}
print(index[1002])               # 王二
print(index.get(9999, '不存在'))  # 不存在

print(find_slow(records, 1003))  # 张三
` },

    { t: 'callout', kind: 'note', title: '先写对，再优化', html:
      '在 n 只有几十、几百的时候，所有写法都"够快"，读得懂比跑得快重要。' +
      '<b>先保证逻辑正确，再用复杂度判断要不要换方法</b>。' +
      '过早优化是另一种浪费：把简单代码改成难懂的高手写法，' +
      '在数据量不大时毫无收益，却让以后所有维护都变难。'
    },

    { t: 'h', text: '六、综合项目：从数据到报告', id: 'ch09-6' },

    { t: 'p', html:
      '现在做一次完整练习。<b>任务</b>：拿到一份销售明细 CSV，' +
      '按品类汇总销售额与销量，按销售额从高到低生成一份报告，写入文件。' +
      '程序分五步：造数据 → 读入解析 → 汇总 → 排序格式化 → 写出文件。' +
      '每一步都只做一件事，出了问题能立刻定位在哪一步。'
    },

    { t: 'h', lvl: 3, text: '第一步：准备数据文件', id: 'ch09-6-1' },

    { t: 'p', html:
      '真实项目里数据来自系统导出，这里先自己造一份，' +
      '顺便复习第 7 章的写文件。注意 <code>\'w\'</code> 会覆盖，' +
      '每行末尾要换行。'
    },

    { t: 'code', lang: 'python', caption: '生成 sales.csv', code:
`lines = [
    '日期,品类,商品,单价,数量',
    '11-01,水果,苹果,5.5,10',
    '11-01,蔬菜,白菜,2.0,20',
    '11-02,水果,香蕉,4.0,15',
    '11-02,零食,薯片,8.5,6',
    '11-03,蔬菜,土豆,3.0,12',
    '11-03,水果,苹果,5.5,8',
]

with open('sales.csv', 'w', encoding='utf-8') as f:
    for line in lines:
        f.write(line + '\\n')

print('sales.csv 已生成')
` },

    { t: 'h', lvl: 3, text: '第二步：读入并解析成 list 套 dict', id: 'ch09-6-2' },

    { t: 'p', html:
      '把每一行变成一个字典，整张表就是一个列表。' +
      '这一步要处理三件事：跳过表头、<code>strip</code> 去空白、' +
      '<b>把单价转 float、数量转 int</b>（CSV 读出来全是字符串）。' +
      '解析后先打印第一条，确认字段对应正确，再往下写。'
    },

    { t: 'code', lang: 'python', caption: '读入销售数据', code:
`records = []

with open('sales.csv', encoding='utf-8') as f:
    header = f.readline().strip().split(',')   # 表头：先读完丢掉
    print('表头:', header)
    for line in f:
        parts = line.strip().split(',')
        if len(parts) != 5:
            continue                            # 防御：列数不对就跳过
        records.append({
            'date': parts[0],
            'category': parts[1],
            'item': parts[2],
            'price': float(parts[3]),
            'qty': int(parts[4]),
        })

print(len(records))                      # 6 条明细
print(records[0])
` },

    { t: 'h', lvl: 3, text: '第三步：按品类汇总', id: 'ch09-6-3' },

    { t: 'p', html:
      '汇总就是"分组 + 累加"：键是品类，值是"销售额 + 销量"的小字典。' +
      '每读一条明细，就把它加到对应品类上。' +
      '这里同时用到第 8 章的计数模式和第 9 章的嵌套字典。'
    },

    { t: 'code', lang: 'python', caption: '按品类累加销售额与销量', code:
`summary = {}

for r in records:
    category = r['category']
    amount = r['price'] * r['qty']

    if category not in summary:
        summary[category] = {'amount': 0.0, 'qty': 0}

    summary[category]['amount'] += amount
    summary[category]['qty'] += r['qty']

for category, s in summary.items():
    print(category, s)
` },

    { t: 'h', lvl: 3, text: '第四步：排序并生成报告', id: 'ch09-6-4' },

    { t: 'p', html:
      '最后一步把汇总结果按销售额从高到低排序，格式化成一张对齐的表。' +
      '排序仍然用 <code>sorted(d.items(), key=...)</code>——' +
      '因为值是字典，所以 <code>key</code> 要写成 <code>kv[1][\'amount\']</code>。' +
      '注意报告里的"占比"要先算总销售额，再逐行求百分比。'
    },

    { t: 'code', lang: 'python', caption: '排序 + 格式化报告', code:
`total_amount = sum(s['amount'] for s in summary.values())
print(f'总销售额: {total_amount:.1f}')

rows = sorted(summary.items(), key=lambda kv: -kv[1]['amount'])

report_lines = []
report_lines.append('===== 销售汇总报告 =====')
report_lines.append(f'{"品类":<6}{"销售额":>10}{"销量":>8}{"占比":>8}')
report_lines.append('-' * 34)

for category, s in rows:
    share = s['amount'] / total_amount * 100
    report_lines.append(
        f'{category:<6}{s["amount"]:>10.1f}{s["qty"]:>8}{share:>7.1f}%'
    )

report = '\\n'.join(report_lines)
print(report)
` },

    { t: 'h', lvl: 3, text: '第五步：写入报告文件', id: 'ch09-6-5' },

    { t: 'p', html:
      '把报告写回文件，程序才算"留下了成果"。' +
      '用 <code>\'w\'</code> 模式写出；写完后可以再读回来确认，' +
      '这就是"程序跑完检查输出"的习惯。' +
      '整个项目到这里就完整了：<b>数据进来、结果出去，中间全是可控的步骤。</b>'
    },

    { t: 'code', lang: 'python', caption: '写出 report.txt 并读回验证', code:
`with open('report.txt', 'w', encoding='utf-8') as f:
    f.write(report)

with open('report.txt', encoding='utf-8') as f:
    print(f.read())

# 小结：项目里用到的全部零件
print('容器:', 'list / dict')
print('流程:', '读文件 -> 解析 -> 汇总 -> 排序 -> 输出')
print('算法:', '遍历、计数、分组、排序')
` },

    { t: 'callout', kind: 'tip', title: '把它拆成函数', html:
      '上面五步写在一个脚本里是对的，但当程序变长，应该把每一步包成函数：' +
      '<code>load_records(path)</code>、<code>summarize(records)</code>、' +
      '<code>render_report(summary)</code>、<code>main()</code>。' +
      '这样每一步都能单独测试，也方便替换数据源——' +
      '<b>这就是第 4 章"把大问题拆成小问题"在真实项目里的样子。</b>'
    },

    { t: 'terms', items: [
      { en: 'nested structure', zh: '嵌套结构', html: '容器里装容器，如列表装字典、字典装列表。形状由最常问的问题决定。' },
      { en: 'key function', zh: '排序键函数', html: '<code>sorted(key=...)</code> 收到的函数，返回用来比较的值。' },
      { en: 'linear search', zh: '线性查找', html: '逐个比较，O(n)；不要求有序。' },
      { en: 'binary search', zh: '二分查找', html: '每次砍一半，O(log n)；<b>前提是数据有序</b>。' },
      { en: 'time complexity', zh: '时间复杂度', html: '描述运行时间随数据量增长的量级，用大 O 记号表示。' },
      { en: 'pipeline', zh: '流水线', html: '把任务拆成"读入 → 处理 → 输出"等独立步骤依次执行。' }
    ] },

    { t: 'steps', items: [
      { title: '先画数据形状', html: '问自己"一条记录有哪些字段""一批记录怎么放"，先定 list 套 dict 还是 dict 套 list。' },
      { title: '解析后立刻验证', html: '读入数据后先 <code>print(len(records))</code> 和 <code>print(records[0])</code>，字段对不对一眼可见。' },
      { title: '汇总单独一段', html: '汇总逻辑和读文件分开写，出错时能判断是数据问题还是统计问题。' },
      { title: '排序输出再写文件', html: '<code>sorted</code> 排好、格式化成字符串、最后一次性写文件；不要在拼字符串的过程中改数据。' }
    ] },

    { t: 'keypoint', items: [
      { title: '数据结构跟着问题走', html: '按顺序处理用"列表套字典"，按类别取用"字典套列表"，按两级键查用"字典套字典"。' },
      { title: '嵌套遍历要分层想', html: '外层是记录/分组，内层是字段/组内元素；循环变量的含义要能用一句话说清。' },
      { title: '排序全靠 key', html: '<code>key=lambda r: r[\'score\']</code> 单字段；<code>key=lambda r: (-r[\'score\'], r[\'name\'])</code> 多字段。' },
      { title: '查找分两种', html: '线性查找 O(n) 不要求有序；二分查找 O(log n) 要求有序且能随机访问。' },
      { title: '复杂度决定可不可行', html: 'n 从 1000 到 100 万，O(n²) 从"能等"变成"等不起"；用字典把查找降到 O(1)。' },
      { title: '项目 = 流水线', html: '造/读数据 → 解析 → 汇总 → 排序格式化 → 写文件；每步独立、可验证。' }
    ] },

    { t: 'checklist', id: 'ch09', items: [
      '我能根据"最常问的问题"选择列表套字典或字典套列表',
      '我能写多层遍历，从一个 list 套 dict 里按字段汇总数据',
      '我能用 <code>key=lambda</code> 按字段排序，并实现"分数降序、姓名升序"',
      '我能手写线性查找和二分查找，并说清二分查找的前提',
      '我能用大 O 估计一段代码在 100 万条数据下是否可行',
      '我能独立完成"读 CSV → 解析 → 汇总 → 排序 → 写报告"的完整程序',
      '我知道项目应该拆成函数，每一步都能单独验证'
    ] }
  ]
});
