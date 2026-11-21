/* =====================================================================
 * data/projects.js · 项目实战数据
 * 职责：为「项目实战」列表与详情页提供 4 个离线项目：目标、里程碑、
 *       提示与参考实现。所有代码均为 Python 3 标准库，读者在本地运行。
 * 说明：不依赖在线判分；starter 是能跑但功能不全的骨架，solution 完整。
 * ===================================================================== */
(function () {
  'use strict';

  CSC.registerProjects([

    {
      id: 'gradebook',
      title: '成绩统计器',
      en: 'Gradebook',
      tagline: '把一学期成绩变成一张会说话的排名表',
      level: '入门',
      minutes: 100,
      chapters: ['ch03', 'ch07', 'ch08', 'ch09'],
      goals: [
        '用「列表套字典」组织多名学生与多门科目的成绩',
        '熟练使用 sum / max / min / len 与 f-string 完成统计和格式化',
        '写出按总分排序的 key 函数，并处理同分与并列名次',
        '用 csv 模块读入成绩表，缺文件时回退到内置样例'
      ],
      intro: '期末到了，老师手里有一叠成绩单：每个人三门课，想知道总分、平均分、班级排名，还想看及格率和分数段分布。这个项目从内置的几条记录起步，逐步做出一个能直接运行的成绩统计器，最后升级成读 CSV 的版本。',
      milestones: [
        {
          n: 1,
          title: '成绩记录与个人统计',
          tasks: [
            '用列表套字典保存 6 名学生、每人 3 门课的成绩',
            '写 avg_score(scores) 函数，返回一门课字典的平均分',
            '遍历学生，打印姓名、总分与平均分（保留 1 位小数）'
          ],
          starter: `
students = [
    {'name': '林小满', 'scores': {'语文': 88, '数学': 95, '英语': 79}},
    {'name': '周子墨', 'scores': {'语文': 72, '数学': 68, '英语': 91}},
    {'name': '陈一诺', 'scores': {'语文': 59, '数学': 83, '英语': 64}},
    {'name': '苏晚晴', 'scores': {'语文': 96, '数学': 91, '英语': 88}},
    {'name': '赵启明', 'scores': {'语文': 45, '数学': 52, '英语': 58}},
    {'name': '顾星河', 'scores': {'语文': 81, '数学': 77, '英语': 85}},
]


def avg_score(scores):
    # TODO: 用 sum(scores.values()) / len(scores) 返回平均分
    return 0


for student in students:
    total = sum(student['scores'].values())
    avg = avg_score(student['scores'])
    # TODO: 让 avg 真正算出来，并按「姓名 总分 平均分」打印
    print(student['name'], '总分', total, '平均分', avg)

print('提示：把 avg_score 补完整，再把输出改成 f-string。')
`.trim(),
          hints: [
            '分数存在 student["scores"] 这个字典里，用 .values() 一次取出全部分数。',
            'f-string 的格式说明写在冒号后：{avg:.1f} 表示保留一位小数。'
          ],
          solution: `
students = [
    {'name': '林小满', 'scores': {'语文': 88, '数学': 95, '英语': 79}},
    {'name': '周子墨', 'scores': {'语文': 72, '数学': 68, '英语': 91}},
    {'name': '陈一诺', 'scores': {'语文': 59, '数学': 83, '英语': 64}},
    {'name': '苏晚晴', 'scores': {'语文': 96, '数学': 91, '英语': 88}},
    {'name': '赵启明', 'scores': {'语文': 45, '数学': 52, '英语': 58}},
    {'name': '顾星河', 'scores': {'语文': 81, '数学': 77, '英语': 85}},
]


def avg_score(scores):
    """返回一门课成绩字典的平均分。"""
    return sum(scores.values()) / len(scores)


print(f"{'姓名':<6}{'总分':>6}{'平均分':>8}")
print('-' * 22)
for student in students:
    total = sum(student['scores'].values())
    avg = avg_score(student['scores'])
    print(f"{student['name']:<6}{total:>6}{avg:>8.1f}")
`.trim(),
          explain: '先把「一条记录」的形状定下来，后面所有统计都只是遍历这个形状。常见错误是把总分写死成三个科目相加，一旦增加科目就要改代码；用 sum(scores.values()) 才对。另一个易错点是把平均分四舍五入后再参与后续计算，应该保留原始 float，只在输出时格式化。'
        },
        {
          n: 2,
          title: '班级统计：均分、极值与及格率',
          tasks: [
            '把所有分数摊平成一个列表，计算班级总分与总平均',
            '求总分最高/最低的学生；定义「平均分 >= 60 为及格」，算及格率',
            '按平均分划分 90+、80–89、70–79、60–69、<60 五档并计数'
          ],
          starter: `
students = [
    {'name': '林小满', 'scores': {'语文': 88, '数学': 95, '英语': 79}},
    {'name': '周子墨', 'scores': {'语文': 72, '数学': 68, '英语': 91}},
    {'name': '陈一诺', 'scores': {'语文': 59, '数学': 83, '英语': 64}},
    {'name': '苏晚晴', 'scores': {'语文': 96, '数学': 91, '英语': 88}},
    {'name': '赵启明', 'scores': {'语文': 45, '数学': 52, '英语': 58}},
    {'name': '顾星河', 'scores': {'语文': 81, '数学': 77, '英语': 85}},
]


def avg_score(scores):
    return sum(scores.values()) / len(scores)


def total_of(student):
    return sum(student['scores'].values())


all_scores = [score for student in students for score in student['scores'].values()]
class_avg = sum(all_scores) / len(all_scores)
best = max(students, key=total_of)
worst = min(students, key=total_of)

print(f'班级平均分：{class_avg:.2f}')
print(f'总分最高：{best["name"]}（{total_of(best)} 分）')
print(f'总分最低：{worst["name"]}（{total_of(worst)} 分）')

# TODO: 统计及格人数（平均分 >= 60）
# TODO: 用字典统计 90+ / 80–89 / 70–79 / 60–69 / <60 五档人数
print('及格率与分数段分布待完成')
`.trim(),
          hints: [
            '先把所有分数摊平成一个列表，再用 len 求个数。',
            '多分支计数用 if/elif/elif/else，注意边界：90 分应落在「90 及以上」。'
          ],
          solution: `
students = [
    {'name': '林小满', 'scores': {'语文': 88, '数学': 95, '英语': 79}},
    {'name': '周子墨', 'scores': {'语文': 72, '数学': 68, '英语': 91}},
    {'name': '陈一诺', 'scores': {'语文': 59, '数学': 83, '英语': 64}},
    {'name': '苏晚晴', 'scores': {'语文': 96, '数学': 91, '英语': 88}},
    {'name': '赵启明', 'scores': {'语文': 45, '数学': 52, '英语': 58}},
    {'name': '顾星河', 'scores': {'语文': 81, '数学': 77, '英语': 85}},
]


def avg_score(scores):
    return sum(scores.values()) / len(scores)


def total_of(student):
    return sum(student['scores'].values())


all_scores = [score for student in students for score in student['scores'].values()]
class_avg = sum(all_scores) / len(all_scores)
best = max(students, key=total_of)
worst = min(students, key=total_of)

pass_count = 0
buckets = {'90 及以上': 0, '80–89': 0, '70–79': 0, '60–69': 0, '60 以下': 0}

for student in students:
    avg = avg_score(student['scores'])
    if avg >= 60:
        pass_count += 1
    if avg >= 90:
        buckets['90 及以上'] += 1
    elif avg >= 80:
        buckets['80–89'] += 1
    elif avg >= 70:
        buckets['70–79'] += 1
    elif avg >= 60:
        buckets['60–69'] += 1
    else:
        buckets['60 以下'] += 1

print(f'参与统计的分数：{len(all_scores)} 个')
print(f'班级平均分：{class_avg:.2f}')
print(f'总分最高：{best["name"]}（{total_of(best)} 分）')
print(f'总分最低：{worst["name"]}（{total_of(worst)} 分）')
print(f'及格人数（平均分≥60）：{pass_count} / {len(students)}（{pass_count / len(students) * 100:.1f}%）')
print('分数段分布（按个人平均分）：')
for label, count in buckets.items():
    print(f'  {label:<8}{count} 人')
`.trim(),
          explain: '「及格」必须先定义清楚：这里按平均分 >= 60 判定，而不是「每科都及格」。分数段统计用 elif 链保证一个人只进一个桶；如果把所有 if 并列，90 分以上的人会同时进入多个桶。最后输出百分比时再乘 100，统计过程保持整数。'
        },
        {
          n: 3,
          title: '排名表：排序、名次与对齐',
          tasks: [
            '为每位学生算出 total 与 avg，放进新的 results 列表',
            '用 sorted(..., key=lambda item: ...) 按总分降序；同分按姓名升序',
            '处理并列名次（总分相同名次相同），打印完整榜单'
          ],
          starter: `
students = [
    {'name': '林小满', 'scores': {'语文': 88, '数学': 95, '英语': 79}},
    {'name': '周子墨', 'scores': {'语文': 72, '数学': 68, '英语': 91}},
    {'name': '陈一诺', 'scores': {'语文': 59, '数学': 83, '英语': 64}},
    {'name': '苏晚晴', 'scores': {'语文': 96, '数学': 91, '英语': 88}},
    {'name': '赵启明', 'scores': {'语文': 45, '数学': 52, '英语': 58}},
    {'name': '顾星河', 'scores': {'语文': 81, '数学': 77, '英语': 85}},
]

results = []
for student in students:
    total = sum(student['scores'].values())
    results.append({
        'name': student['name'],
        'total': total,
        'avg': total / len(student['scores']),
    })

ordered = sorted(results, key=lambda item: item['total'], reverse=True)
for position, item in enumerate(ordered, start=1):
    print(position, item['name'], item['total'], f"{item['avg']:.1f}")

# TODO：让同分学生共用名次，并按姓名决定先后。
print('提示：同分时要共用名次；同分内部再按姓名排序。')
`.trim(),
          hints: [
            'sorted 的 key 返回元组时，会按元组顺序比较：(-总分, 姓名)。',
            '并列名次的关键是记住「上一个总分」和「当前名次」，不要直接用 enumerate 的序号。'
          ],
          solution: `
students = [
    {'name': '林小满', 'scores': {'语文': 88, '数学': 95, '英语': 79}},
    {'name': '周子墨', 'scores': {'语文': 72, '数学': 68, '英语': 91}},
    {'name': '陈一诺', 'scores': {'语文': 59, '数学': 83, '英语': 64}},
    {'name': '苏晚晴', 'scores': {'语文': 96, '数学': 91, '英语': 88}},
    {'name': '赵启明', 'scores': {'语文': 45, '数学': 52, '英语': 58}},
    {'name': '顾星河', 'scores': {'语文': 81, '数学': 77, '英语': 85}},
]


def build_results(students):
    results = []
    for student in students:
        total = sum(student['scores'].values())
        results.append({
            'name': student['name'],
            'total': total,
            'avg': total / len(student['scores']),
        })
    return results


def rank_results(results):
    ordered = sorted(results, key=lambda item: (-item['total'], item['name']))
    rank = 0
    last_total = None
    for position, item in enumerate(ordered, start=1):
        if item['total'] != last_total:
            rank = position
            last_total = item['total']
        item['rank'] = rank
    return ordered


results = rank_results(build_results(students))
print(f"{'名次':<4}{'姓名':<6}{'总分':>6}{'平均分':>8}")
print('-' * 26)
for item in results:
    print(f"{item['rank']:<4}{item['name']:<6}{item['total']:>6}{item['avg']:>8.1f}")

average_total = sum(item['total'] for item in results) / len(results)
print(f'班级平均总分：{average_total:.1f}')
`.trim(),
          explain: '排序和名次是两件事：sorted 只负责顺序，名次要在有序列表上再扫一遍。用 -item["total"] 把降序和姓名升序合并进一个 key，避免排序后再手工调整。并列名次采用「竞赛排名」：1、1、3，而不是 1、1、2；如果业务要后者，改一行即可。'
        },
        {
          n: 4,
          title: '升级：从 CSV 读成绩',
          tasks: [
            '内置一段 CSV 文本（表头 + 6 行），用 csv.reader 解析',
            '若同目录存在 scores.csv 就优先读文件，否则用内置文本',
            '把解析结果交给排序逻辑，输出 Top 3 与班级均分'
          ],
          starter: `
import csv
import io

CSV_TEXT = """姓名,语文,数学,英语
林小满,88,95,79
周子墨,72,68,91
陈一诺,59,83,64
苏晚晴,96,91,88
赵启明,45,52,58
顾星河,81,77,85
"""

rows = list(csv.reader(io.StringIO(CSV_TEXT)))
print('表头：', rows[0])
print('数据行数：', len(rows) - 1)
for row in rows[1:4]:
    print(row)

# TODO: 跳过表头，把每一行变成 {'name': ..., 'scores': {...}}
# TODO: 计算总分并排序，输出前三名
print('解析与排名待完成')
`.trim(),
          hints: [
            'csv.reader 接受任何可迭代的行，io.StringIO(CSV_TEXT) 可以把字符串当成文件。',
            '用 utf-8-sig 读文件，能自动去掉 Windows 记事本可能写入的 BOM。'
          ],
          solution: `
import csv
import io
import os

CSV_TEXT = """姓名,语文,数学,英语
林小满,88,95,79
周子墨,72,68,91
陈一诺,59,83,64
苏晚晴,96,91,88
赵启明,45,52,58
顾星河,81,77,85
"""


def load_students(path='scores.csv'):
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8-sig') as f:
            rows = list(csv.reader(f))
        source = path
    else:
        rows = list(csv.reader(io.StringIO(CSV_TEXT)))
        source = '内置样例'

    header = rows[0]
    students = []
    for line_no, row in enumerate(rows[1:], start=2):
        if not row or not row[0].strip():
            continue
        if len(row) != len(header):
            print(f'第 {line_no} 行列数不对，已跳过')
            continue
        scores = {}
        bad_row = False
        for index in range(1, len(header)):
            try:
                scores[header[index]] = int(row[index])
            except ValueError:
                bad_row = True
        if bad_row:
            print(f'第 {line_no} 行有非数字成绩，已跳过')
            continue
        students.append({'name': row[0].strip(), 'scores': scores})

    print(f'数据来源：{source}，共 {len(students)} 条记录')
    return students


def total_of(student):
    return sum(student['scores'].values())


def main():
    students = load_students()
    if not students:
        print('没有可统计的成绩。')
        return

    ordered = sorted(students, key=lambda s: (-total_of(s), s['name']))
    all_scores = [score for s in students for score in s['scores'].values()]
    print(f'班级平均分：{sum(all_scores) / len(all_scores):.2f}')
    print('总分前三名：')
    for position, student in enumerate(ordered[:3], start=1):
        print(f'  {position}. {student["name"]}  总分 {total_of(student)}')


if __name__ == '__main__':
    main()
`.trim(),
          explain: '这一版把「数据来源」和「统计逻辑」解耦：load_students 只负责把 CSV 变成统一的字典列表，后面的排序和输出不用关心数据来自文件还是字符串。常见错误是忘记跳过表头，或者把整行当一个字段；csv.reader 已经处理了逗号和引号，不要再用 split(",")。真实 CSV 还可能有空行、缺列和脏数字，所以读入时要逐行校验。'
        }
      ],
      extension: [
        '增加「按科目排名」，并给每科输出前三名',
        '支持加权总分：语文、数学、英语按不同权重计算',
        '把统计结果写成 grades_report.txt，包含表头与生成日期'
      ],
      solutionNote: '参考实现把「读取 → 清洗 → 统计 → 排序 → 输出」拆成独立函数，便于单独测试；所有数据都来自内置样例或本地 CSV，不依赖网络。'
    },

    {
      id: 'text-analysis',
      title: '文本分析器',
      en: 'Text Analyzer',
      tagline: '让一段文字交出词频、句长与主题词',
      level: '入门',
      minutes: 90,
      chapters: ['ch04', 'ch06', 'ch07', 'ch08'],
      goals: [
        '用 lower / translate / split 把原始文本清洗成单词列表',
        '用字典和 Counter 两种方式统计词频，并按次数排序取 Top N',
        '计算平均词长、句子数与词汇丰富度，并说清每个指标的口径',
        '用 f-string 输出带对齐和分隔线的文本报告'
      ],
      intro: '一段文字里藏着很多可以量化的信息：哪些词反复出现、句子有多长、词汇有多丰富。这个项目从内置短文或本地 article.txt 读入文本，先清洗成单词，再统计词频、平均词长与句子数，最后生成一份带停用词过滤的主题词报告。',
      milestones: [
        {
          n: 1,
          title: '读入文本，清洗成单词列表',
          tasks: [
            '写 load_text(path)，优先读同目录的 article.txt，不存在时回退到内置短文',
            '用 lower() 统一大小写，用 string.punctuation 去掉标点',
            '按空白切分成单词列表，打印前 20 个词、字符数与单词总数'
          ],
          starter: `
SAMPLE_TEXT = """The observatory opens before sunrise. A small team checks every instrument, records the temperature, and waits for the first light. Good data is quiet work: measure, record, compare, repeat. When the sky is clear, the telescope follows one star for hours. When clouds arrive, the team reads the notes from earlier nights. Every number has a story, but only a careful reader can find it. Practice turns a curious beginner into a patient observer, and patience turns a long night into a useful result."""

text = SAMPLE_TEXT
words = text.lower().split()

print('文本字符数：', len(text))
print('单词总数：', len(words))
print('前 20 个词：')
print(' '.join(words[:20]))
# TODO：把 text 清洗成没有标点的小写单词列表。
print('提示：标点还粘在单词上，试着用 translate 去掉它们。')
`.trim(),
          hints: [
            'os.path.exists 可以判断文件在不在，注意相对路径是「当前工作目录」而不是脚本所在目录。',
            'str.maketrans("", "", string.punctuation) 生成一张「删掉这些字符」的转换表，translate 一次完成。'
          ],
          solution: `
import os
import string

SAMPLE_TEXT = """The observatory opens before sunrise. A small team checks every instrument, records the temperature, and waits for the first light. Good data is quiet work: measure, record, compare, repeat. When the sky is clear, the telescope follows one star for hours. When clouds arrive, the team reads the notes from earlier nights. Every number has a story, but only a careful reader can find it. Practice turns a curious beginner into a patient observer, and patience turns a long night into a useful result."""


def load_text(path='article.txt'):
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            return f.read()
    return SAMPLE_TEXT


def clean_words(text):
    lowered = text.lower()
    table = str.maketrans('', '', string.punctuation)
    return lowered.translate(table).split()


if __name__ == '__main__':
    text = load_text()
    words = clean_words(text)
    print('文本字符数：', len(text))
    print('单词总数：', len(words))
    print('前 20 个词：')
    print(' '.join(words[:20]))
`.trim(),
          explain: '清洗的目标不是「把文本变好看」，而是让同一个词只有一种写法：The 和 the、story. 和 story 必须合并。translate 比一连串 replace 更快，也更不容易漏掉标点。注意它会把 don’t 变成 dont；如果要做严肃的文本分析，得先决定缩写怎么处理。'
        },
        {
          n: 2,
          title: '词频统计与 Top N',
          tasks: [
            '先用普通字典手动计数：counts[word] = counts.get(word, 0) + 1',
            '再用 collections.Counter 重写，比较两种写法的结果',
            '按「次数降序、单词升序」排序，打印 Top 10 对齐表'
          ],
          starter: `
import string
from collections import Counter

SAMPLE_TEXT = """The observatory opens before sunrise. A small team checks every instrument, records the temperature, and waits for the first light. Good data is quiet work: measure, record, compare, repeat. When the sky is clear, the telescope follows one star for hours. When clouds arrive, the team reads the notes from earlier nights. Every number has a story, but only a careful reader can find it. Practice turns a curious beginner into a patient observer, and patience turns a long night into a useful result."""


def clean_words(text):
    lowered = text.lower()
    table = str.maketrans('', '', string.punctuation)
    return lowered.translate(table).split()


words = clean_words(SAMPLE_TEXT)
counts = {}
for word in words:
    counts[word] = counts.get(word, 0) + 1

print('不同单词数：', len(counts))
for word in list(counts)[:5]:
    print(word, counts[word])

# TODO：按次数降序、单词升序排序，输出前 10 名。
print('提示：还没排序，先把 (单词, 次数) 按次数排好再取前十。')
`.trim(),
          hints: [
            'Counter 是 dict 的子类，most_common 很方便，但自己写一次 sorted 更能理解排序 key。',
            'key=lambda item: (-item[1], item[0]) 里 item 是 (单词, 次数) 元组。'
          ],
          solution: `
import os
import string
from collections import Counter

SAMPLE_TEXT = """The observatory opens before sunrise. A small team checks every instrument, records the temperature, and waits for the first light. Good data is quiet work: measure, record, compare, repeat. When the sky is clear, the telescope follows one star for hours. When clouds arrive, the team reads the notes from earlier nights. Every number has a story, but only a careful reader can find it. Practice turns a curious beginner into a patient observer, and patience turns a long night into a useful result."""


def load_text(path='article.txt'):
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            return f.read()
    return SAMPLE_TEXT


def clean_words(text):
    lowered = text.lower()
    table = str.maketrans('', '', string.punctuation)
    return lowered.translate(table).split()


def top_words(words, count=10):
    manual = {}
    for word in words:
        manual[word] = manual.get(word, 0) + 1

    counter = Counter(words)
    if manual != dict(counter):
        print('两种计数结果不一致，请检查。')

    ordered = sorted(counter.items(), key=lambda item: (-item[1], item[0]))
    return ordered[:count]


if __name__ == '__main__':
    words = clean_words(load_text())
    print(f'不同单词数：{len(set(words))}')
    print(f"{'排名':<4}{'单词':<16}{'次数':>4}")
    print('-' * 28)
    for position, (word, count) in enumerate(top_words(words), start=1):
        print(f'{position:<4}{word:<16}{count:>4}')
`.trim(),
          explain: '词频统计的难点不在计数，而在排序规则：次数相同的词必须有稳定的第二排序键，否则每次运行顺序可能不同。Counter 与手写字典的结果应该完全一致，可以用 == 验证。Top N 只影响展示，不要为了取前几名就把完整词频丢掉。'
        },
        {
          n: 3,
          title: '平均词长、句子数与最长词',
          tasks: [
            '计算平均词长：所有单词字母总数 / 单词数，保留两位小数',
            '按 . ! ? 三个终止符切句并计数，说明这是简化口径',
            '找出最长单词；长度并列时按字母序取第一个'
          ],
          starter: `
import string

SAMPLE_TEXT = """The observatory opens before sunrise. A small team checks every instrument, records the temperature, and waits for the first light. Good data is quiet work: measure, record, compare, repeat. When the sky is clear, the telescope follows one star for hours. When clouds arrive, the team reads the notes from earlier nights. Every number has a story, but only a careful reader can find it. Practice turns a curious beginner into a patient observer, and patience turns a long night into a useful result."""


def clean_words(text):
    lowered = text.lower()
    table = str.maketrans('', '', string.punctuation)
    return lowered.translate(table).split()


words = clean_words(SAMPLE_TEXT)
average = sum(len(word) for word in words) / len(words)
longest = max(words, key=len)

print(f'单词总数：{len(words)}')
print(f'平均词长：{average:.2f} 个字符')
print(f'最长单词：{longest}（{len(longest)} 个字符）')
# TODO：按 . ! ? 切句，并统计句子数。
print('句子数统计待完成')
`.trim(),
          hints: [
            '平均词长只统计清洗后的单词，标点已经不在里面了。',
            '切句可以先 replace 掉 ! 和 ?，再按 . split，最后过滤空串。'
          ],
          solution: `
import os
import string

SAMPLE_TEXT = """The observatory opens before sunrise. A small team checks every instrument, records the temperature, and waits for the first light. Good data is quiet work: measure, record, compare, repeat. When the sky is clear, the telescope follows one star for hours. When clouds arrive, the team reads the notes from earlier nights. Every number has a story, but only a careful reader can find it. Practice turns a curious beginner into a patient observer, and patience turns a long night into a useful result."""


def load_text(path='article.txt'):
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            return f.read()
    return SAMPLE_TEXT


def clean_words(text):
    lowered = text.lower()
    table = str.maketrans('', '', string.punctuation)
    return lowered.translate(table).split()


def split_sentences(text):
    normalized = text.replace('!', '.').replace('?', '.')
    parts = normalized.split('.')
    return [part.strip() for part in parts if part.strip()]


def longest_word(words):
    ordered = sorted(words, key=lambda word: (-len(word), word))
    return ordered[0]


if __name__ == '__main__':
    text = load_text()
    words = clean_words(text)
    sentences = split_sentences(text)
    average = sum(len(word) for word in words) / len(words)
    longest = longest_word(words)

    print(f'单词总数：{len(words)}')
    print(f'平均词长：{average:.2f} 个字符')
    print(f'句子数：{len(sentences)}')
    print(f'最长单词：{longest}（{len(longest)} 个字符）')
    print(f'平均每句单词数：{len(words) / len(sentences):.1f}')
`.trim(),
          explain: '平均词长和句子数都是「口径」问题：按字符还是按字母、缩写里的点算不算句号，都会改变结果。示例采用最简单的小学口径，并在注释里写清楚，读者才知道数字是怎么来的。最长单词并列时用 (-长度, 单词) 排序，能保证结果稳定。'
        },
        {
          n: 4,
          title: '汇总报告与停用词',
          tasks: [
            '定义 STOP_WORDS，过滤后统计主题词 Top 8',
            '计算词汇丰富度：不同词数 / 总词数',
            '用分隔线、居中和固定列宽打印完整报告（含 # 柱状条）'
          ],
          starter: `
import string
from collections import Counter

SAMPLE_TEXT = """The observatory opens before sunrise. A small team checks every instrument, records the temperature, and waits for the first light. Good data is quiet work: measure, record, compare, repeat. When the sky is clear, the telescope follows one star for hours. When clouds arrive, the team reads the notes from earlier nights. Every number has a story, but only a careful reader can find it. Practice turns a curious beginner into a patient observer, and patience turns a long night into a useful result."""


def clean_words(text):
    lowered = text.lower()
    table = str.maketrans('', '', string.punctuation)
    return lowered.translate(table).split()


words = clean_words(SAMPLE_TEXT)
counts = Counter(words)
ordered = sorted(counts.items(), key=lambda item: (-item[1], item[0]))[:5]

print('单词总数：', len(words))
print('不同单词数：', len(counts))
for position, (word, count) in enumerate(ordered, start=1):
    print(f'{position}. {word:<12}{count:>3}  {"#" * count}')

# TODO：过滤停用词，并计算词汇丰富度。
print('提示：先过滤 the / a / and 等停用词，再计算词汇丰富度。')
`.trim(),
          hints: [
            '停用词表不用很长，先放 the / a / and / of / to 这类高频功能词就能看到效果。',
            '词汇丰富度 = len(set(words)) / len(words)，它和文本长度强相关，不能直接比较长短不同的文本。'
          ],
          solution: `
import os
import string
from collections import Counter

SAMPLE_TEXT = """The observatory opens before sunrise. A small team checks every instrument, records the temperature, and waits for the first light. Good data is quiet work: measure, record, compare, repeat. When the sky is clear, the telescope follows one star for hours. When clouds arrive, the team reads the notes from earlier nights. Every number has a story, but only a careful reader can find it. Practice turns a curious beginner into a patient observer, and patience turns a long night into a useful result."""

STOP_WORDS = {
    'a', 'an', 'and', 'are', 'as', 'at', 'be', 'but', 'by', 'can',
    'every', 'for', 'from', 'has', 'in', 'into', 'is', 'it', 'its',
    'of', 'on', 'only', 'or', 'that', 'the', 'their', 'this', 'to',
    'was', 'when', 'with',
}


def load_text(path='article.txt'):
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            return f.read()
    return SAMPLE_TEXT


def clean_words(text):
    lowered = text.lower()
    table = str.maketrans('', '', string.punctuation)
    return lowered.translate(table).split()


def split_sentences(text):
    normalized = text.replace('!', '.').replace('?', '.')
    parts = normalized.split('.')
    return [part.strip() for part in parts if part.strip()]


def build_report(text, words, sentences, top_n=8):
    content = [word for word in words if word not in STOP_WORDS]
    counts = Counter(content)
    ordered = sorted(counts.items(), key=lambda item: (-item[1], item[0]))[:top_n]
    unique = len(set(words))
    richness = unique / len(words) * 100
    average = sum(len(word) for word in words) / len(words)

    line = '=' * 52
    print(line)
    print('文本分析报告'.center(48))
    print(line)
    print(f'字符数：{len(text):>10}    单词数：{len(words)}')
    print(f'句子数：{len(sentences):>10}    平均词长：{average:.2f}')
    print(f'不同词数：{unique:>8}    整体词汇丰富度：{richness:.1f}%')
    print(f'停用词：{len(words) - len(content)} 个词次已忽略')
    print('-' * 52)
    print(f'主题词 Top {top_n}：')
    for position, (word, count) in enumerate(ordered, start=1):
        bar = '#' * count
        print(f'{position:>2}. {word:<14}{count:>3}  {bar}')
    print(line)


if __name__ == '__main__':
    text = load_text()
    words = clean_words(text)
    sentences = split_sentences(text)
    build_report(text, words, sentences)
`.trim(),
          explain: '报告是给人看的，所以顺序很重要：先给总量，再给比率，最后给主题词和柱状条。柱状条直接用 # 重复次数，次数差距大时会太长，可以按最大值缩放。停用词表是一种价值判断，换一个语料就要重新检查，不能把它当成「标准答案」。注意「整体词汇丰富度」统计的是全部词，停用词只影响下面的主题词排行。'
        }
      ],
      extension: [
        '支持中文文本：按标点切句，并用相邻汉字两两组合的手写小实验观察分词的必要性',
        '加入「每段平均句数」与「读起来要几分钟」的估算',
        '把报告写成 analysis.txt，并让 Top N 与停用词表从命令行参数读取'
      ],
      solutionNote: '参考实现把加载、清洗、切句、统计与报告分成小函数，每个函数都可以单独运行和替换；文本来源既可以是内置短文，也可以是同目录的 article.txt。'
    },

    {
      id: 'contacts',
      title: '联系人簿（JSON 持久化）',
      en: 'Contacts Book',
      tagline: '把通讯录存成 JSON，关掉程序也不丢',
      level: '进阶',
      minutes: 130,
      chapters: ['ch04', 'ch07', 'ch08', 'ch09'],
      goals: [
        '用列表套字典保存联系人，并用 max(id) + 1 生成递增的 id',
        '把增、删、改、查拆成独立函数，让每个函数只做一件事',
        '用 json.load / json.dump 与 with open 完成读写和容错',
        '用 try / except / finally 处理文件不存在与退出保存'
      ],
      intro: '通讯录是「增删改查 + 持久化」的经典小项目：数据在内存里是一个列表，每条记录是一个字典；程序启动时从 contacts.json 读回，退出前再写回去。做完它，你就有了一个能长期使用的小工具，也理解了「内存中的对象」和「磁盘上的文件」之间的边界。',
      milestones: [
        {
          n: 1,
          title: '内存里的联系人：增、改、删',
          tasks: [
            '设计联系人字典的字段：id / name / phone / group',
            '实现 next_id、add_contact、find_by_id、update_phone、remove_contact',
            '用内置的三条记录演示新增、改电话、删除，并打印每次结果'
          ],
          starter: `
contacts = [
    {'id': 1, 'name': '林小满', 'phone': '13800000001', 'group': '同学'},
    {'id': 2, 'name': '周子墨', 'phone': '13800000002', 'group': '同事'},
    {'id': 3, 'name': '苏晚晴', 'phone': '13800000003', 'group': '家人'},
]


def next_id(contacts):
    if not contacts:
        return 1
    return max(contact['id'] for contact in contacts) + 1


def add_contact(contacts, name, phone, group='未分组'):
    contact = {
        'id': next_id(contacts),
        'name': name,
        'phone': phone,
        'group': group,
    }
    contacts.append(contact)
    return contact


# TODO: 写 find_by_id / update_phone / remove_contact
def update_phone(contacts, contact_id, new_phone):
    return False


def remove_contact(contacts, contact_id):
    return False


add_contact(contacts, '吴桐', '13800000004', '同学')
print('新增后共', len(contacts), '条')
print('更新与删除待完成')
`.trim(),
          hints: [
            'id 不要用 len(contacts) + 1：删过记录后会撞号；用 max(id) + 1 或单独维护计数器。',
            'update 和 delete 都先调用 find_by_id，找不到时返回 False，而不是抛异常。'
          ],
          solution: `
contacts = [
    {'id': 1, 'name': '林小满', 'phone': '13800000001', 'group': '同学'},
    {'id': 2, 'name': '周子墨', 'phone': '13800000002', 'group': '同事'},
    {'id': 3, 'name': '苏晚晴', 'phone': '13800000003', 'group': '家人'},
]


def next_id(contacts):
    if not contacts:
        return 1
    return max(contact['id'] for contact in contacts) + 1


def add_contact(contacts, name, phone, group='未分组'):
    contact = {
        'id': next_id(contacts),
        'name': name,
        'phone': phone,
        'group': group,
    }
    contacts.append(contact)
    return contact


def find_by_id(contacts, contact_id):
    for contact in contacts:
        if contact['id'] == contact_id:
            return contact
    return None


def update_phone(contacts, contact_id, new_phone):
    contact = find_by_id(contacts, contact_id)
    if contact is None:
        return False
    contact['phone'] = new_phone
    return True


def remove_contact(contacts, contact_id):
    contact = find_by_id(contacts, contact_id)
    if contact is None:
        return False
    contacts.remove(contact)
    return True


def show(contacts):
    for contact in contacts:
        print(f"{contact['id']:>2} | {contact['name']:<4} | {contact['phone']} | {contact['group']}")


show(contacts)
print('--- 新增吴桐 ---')
add_contact(contacts, '吴桐', '13800000004', '同学')
print('--- 修改 2 号的电话 ---')
update_phone(contacts, 2, '13900000002')
print('--- 删除 3 号 ---')
remove_contact(contacts, 3)
show(contacts)
`.trim(),
          explain: '列表负责顺序，字典负责字段，id 负责稳定引用——这三者分开，代码才不会被姓名重名或排序打乱。add_contact 返回新记录，调用者可以立刻打印或继续修改。删除时不要一边遍历一边 del，先用 find_by_id 找到对象，再 contacts.remove。'
        },
        {
          n: 2,
          title: '查找、筛选与分组统计',
          tasks: [
            '实现 search：同时匹配姓名、电话与分组（英文不区分大小写）',
            '实现 filter_group：按分组取出联系人列表',
            '用字典统计每个分组的人数，并按「分组、姓名」排序输出'
          ],
          starter: `
contacts = [
    {'id': 1, 'name': '林小满', 'phone': '13800000001', 'group': '同学'},
    {'id': 2, 'name': '周子墨', 'phone': '13800000002', 'group': '同事'},
    {'id': 3, 'name': '苏晚晴', 'phone': '13800000003', 'group': '家人'},
    {'id': 4, 'name': '吴桐', 'phone': '13800000004', 'group': '同学'},
    {'id': 5, 'name': '顾星河', 'phone': '13800000005', 'group': '同事'},
]


def search(contacts, keyword):
    hits = []
    for contact in contacts:
        if keyword in contact['name']:
            hits.append(contact)
    return hits


print('搜索「林」：', [contact['name'] for contact in search(contacts, '林')])
# TODO: 同时匹配电话与分组，并把关键词转小写
# TODO: 按分组筛选并统计每组人数
print('分组筛选与统计待完成')
`.trim(),
          hints: [
            '把关键字统一 lower()，电话保持原样，分组也 lower()，这样英文分组不区分大小写。',
            '分组统计就是「以分组名为键、人数为值」的字典计数，和词频统计是同一个套路。'
          ],
          solution: `
contacts = [
    {'id': 1, 'name': '林小满', 'phone': '13800000001', 'group': '同学'},
    {'id': 2, 'name': '周子墨', 'phone': '13800000002', 'group': '同事'},
    {'id': 3, 'name': '苏晚晴', 'phone': '13800000003', 'group': '家人'},
    {'id': 4, 'name': '吴桐', 'phone': '13800000004', 'group': '同学'},
    {'id': 5, 'name': '顾星河', 'phone': '13800000005', 'group': '同事'},
]


def search(contacts, keyword):
    keyword = keyword.strip().lower()
    if not keyword:
        return list(contacts)
    hits = []
    for contact in contacts:
        if (keyword in contact['name'].lower()
                or keyword in contact['phone']
                or keyword in contact['group'].lower()):
            hits.append(contact)
    return hits


def filter_group(contacts, group):
    return [contact for contact in contacts if contact['group'] == group]


def group_summary(contacts):
    summary = {}
    for contact in contacts:
        group = contact['group']
        summary[group] = summary.get(group, 0) + 1
    return summary


print('--- 全部联系人（按分组、姓名排序）---')
for contact in sorted(contacts, key=lambda c: (c['group'], c['name'])):
    print(f"{contact['group']:<4}{contact['name']:<6}{contact['phone']}")

print('--- 搜索「林」---')
for contact in search(contacts, '林'):
    print(f"{contact['name']}（{contact['group']}）{contact['phone']}")

print('--- 同学 ---')
for contact in filter_group(contacts, '同学'):
    print(f"{contact['name']}  {contact['phone']}")

print('--- 分组统计 ---')
summary = group_summary(contacts)
for group in sorted(summary):
    print(f'{group}：{summary[group]} 人')
`.trim(),
          explain: '搜索要明确「搜哪些字段」：姓名、电话、分组。示例用子串匹配，所以「林」能命中「林小满」；如果要精确匹配，把 in 改成 ==。分组统计用 dict.get 的默认值，避免先判断键是否存在。输出前排序，能让每次运行的结果稳定。'
        },
        {
          n: 3,
          title: 'JSON 读与写：第一次持久化',
          tasks: [
            '实现 load_contacts：文件不存在时返回空列表，JSON 损坏时给提示',
            '实现 save_contacts：ensure_ascii=False、indent=2、UTF-8',
            '做一次「写盘 → 重新读取」的往返验证，打印读回的联系人'
          ],
          starter: `
import json

DATA_FILE = 'contacts.json'
SAMPLE_CONTACTS = [
    {'id': 1, 'name': '林小满', 'phone': '13800000001', 'group': '同学'},
    {'id': 2, 'name': '周子墨', 'phone': '13800000002', 'group': '同事'},
    {'id': 3, 'name': '苏晚晴', 'phone': '13800000003', 'group': '家人'},
]


def load_contacts(path=DATA_FILE):
    # TODO: with open + json.load；捕获 FileNotFoundError 与 JSONDecodeError
    return []


def save_contacts(contacts, path=DATA_FILE):
    try:
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(contacts, f, ensure_ascii=False, indent=2)
    except OSError as exc:
        print(f'写入 {path} 失败：{exc}')
        return False
    print(f'已写入 {path}：{len(contacts)} 条记录')
    return True


contacts = load_contacts()
print('读取到', len(contacts), '条记录')
if not contacts:
    contacts = SAMPLE_CONTACTS
    print('使用示例数据。')
save_contacts(contacts)
print('重新读取待完成')
`.trim(),
          hints: [
            'json.load 直接读文件对象，json.dump 直接写文件对象，不要先 read() 成字符串再 loads。',
            'FileNotFoundError 是「第一次运行」的正常情况，不是错误；JSONDecodeError 才说明文件被写坏了。'
          ],
          solution: `
import json

DATA_FILE = 'contacts.json'
SAMPLE_CONTACTS = [
    {'id': 1, 'name': '林小满', 'phone': '13800000001', 'group': '同学'},
    {'id': 2, 'name': '周子墨', 'phone': '13800000002', 'group': '同事'},
    {'id': 3, 'name': '苏晚晴', 'phone': '13800000003', 'group': '家人'},
]


def load_contacts(path=DATA_FILE):
    try:
        with open(path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except FileNotFoundError:
        print(f'没有找到 {path}，从空通讯录开始。')
        return []
    except json.JSONDecodeError as exc:
        print(f'{path} 不是合法 JSON：{exc}')
        return []
    if not isinstance(data, list):
        print(f'{path} 的顶层不是列表，已忽略。')
        return []
    return data


def save_contacts(contacts, path=DATA_FILE):
    try:
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(contacts, f, ensure_ascii=False, indent=2)
    except OSError as exc:
        print(f'写入 {path} 失败：{exc}')
        return False
    print(f'已写入 {path}：{len(contacts)} 条记录')
    return True


def main():
    contacts = load_contacts()
    if not contacts:
        contacts = [dict(contact) for contact in SAMPLE_CONTACTS]
        print('使用示例数据。')
    if not save_contacts(contacts):
        return
    reloaded = load_contacts()
    print(f'重新读取：{len(reloaded)} 条记录')
    for contact in reloaded:
        print(f"{contact['name']}  {contact['group']}  {contact['phone']}")


if __name__ == '__main__':
    main()
`.trim(),
          explain: '持久化的核心是「读进来要能变成原来的结构，写出去要能再读回来」。ensure_ascii=False 让中文按原样保存，indent=2 让文件可读；如果不加 encoding="utf-8"，在部分 Windows 环境会按 GBK 写文件。捕获异常时不要只写 except:，要分别处理「文件不存在」和「JSON 损坏」。'
        },
        {
          n: 4,
          title: '整合：启动加载、批量操作、退出写回',
          tasks: [
            '加入手机号校验（11 位数字）与重复号码检查',
            '用 apply_command 分派 add / update / delete 三类命令',
            '启动时加载，finally 中保存，并按分组输出最终通讯录'
          ],
          starter: `
import json

DATA_FILE = 'contacts.json'
SAMPLE_CONTACTS = [
    {'id': 1, 'name': '林小满', 'phone': '13800000001', 'group': '同学'},
    {'id': 2, 'name': '周子墨', 'phone': '13800000002', 'group': '同事'},
    {'id': 3, 'name': '苏晚晴', 'phone': '13800000003', 'group': '家人'},
]


def next_id(contacts):
    if not contacts:
        return 1
    return max(contact['id'] for contact in contacts) + 1


def add_contact(contacts, name, phone, group='未分组'):
    contact = {
        'id': next_id(contacts),
        'name': name,
        'phone': phone,
        'group': group,
    }
    contacts.append(contact)
    return contact


def load_contacts(path=DATA_FILE):
    try:
        with open(path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except FileNotFoundError:
        return []
    except json.JSONDecodeError:
        print('数据文件损坏，已按空通讯录处理。')
        return []
    return data if isinstance(data, list) else []


def save_contacts(contacts, path=DATA_FILE):
    try:
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(contacts, f, ensure_ascii=False, indent=2)
    except OSError as exc:
        print(f'写入 {path} 失败：{exc}')
        return False
    print(f'已写入 {path}：{len(contacts)} 条记录')
    return True


contacts = load_contacts()
if not contacts:
    contacts = [dict(contact) for contact in SAMPLE_CONTACTS]
    print('使用示例通讯录。')

add_contact(contacts, '吴桐', '13900000004', '同学')
save_contacts(contacts)
print('总人数：', len(contacts))
# TODO：补上 update / delete 分派、手机号校验和 finally 写回。
print('提示：补上 update / delete 分派、手机号校验和 finally 写回。')
`.trim(),
          hints: [
            '把每条命令写成元组，用 action 字符串分派，比一长串 if input() 更好测试。',
            '把 save_contacts 放在 finally 里，即使中途某条命令抛异常，也能把已完成的修改写回。'
          ],
          solution: `
import json

DATA_FILE = 'contacts.json'
SAMPLE_CONTACTS = [
    {'id': 1, 'name': '林小满', 'phone': '13800000001', 'group': '同学'},
    {'id': 2, 'name': '周子墨', 'phone': '13800000002', 'group': '同事'},
    {'id': 3, 'name': '苏晚晴', 'phone': '13800000003', 'group': '家人'},
]


def next_id(contacts):
    if not contacts:
        return 1
    return max(contact['id'] for contact in contacts) + 1


def valid_phone(phone):
    return len(phone) == 11 and phone.isdigit()


def add_contact(contacts, name, phone, group='未分组'):
    name = name.strip()
    phone = phone.strip()
    if not name or not valid_phone(phone):
        return None
    for contact in contacts:
        if contact['phone'] == phone:
            return None
    contact = {
        'id': next_id(contacts),
        'name': name,
        'phone': phone,
        'group': group,
    }
    contacts.append(contact)
    return contact


def find_by_id(contacts, contact_id):
    for contact in contacts:
        if contact['id'] == contact_id:
            return contact
    return None


def update_phone(contacts, contact_id, new_phone):
    contact = find_by_id(contacts, contact_id)
    new_phone = new_phone.strip()
    if contact is None or not valid_phone(new_phone):
        return False
    for other in contacts:
        if other is not contact and other['phone'] == new_phone:
            return False
    contact['phone'] = new_phone
    return True


def remove_contact(contacts, contact_id):
    contact = find_by_id(contacts, contact_id)
    if contact is None:
        return False
    contacts.remove(contact)
    return True


def search(contacts, keyword):
    keyword = keyword.strip().lower()
    if not keyword:
        return list(contacts)
    return [
        contact for contact in contacts
        if (keyword in contact['name'].lower()
            or keyword in contact['phone']
            or keyword in contact['group'].lower())
    ]


def group_summary(contacts):
    summary = {}
    for contact in contacts:
        group = contact['group']
        summary[group] = summary.get(group, 0) + 1
    return summary


def load_contacts(path=DATA_FILE):
    try:
        with open(path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except FileNotFoundError:
        print(f'没有找到 {path}，从示例通讯录开始。')
        return []
    except json.JSONDecodeError as exc:
        print(f'{path} 不是合法 JSON：{exc}')
        return []
    if not isinstance(data, list):
        print(f'{path} 的顶层不是列表，已忽略。')
        return []
    return data


def save_contacts(contacts, path=DATA_FILE):
    try:
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(contacts, f, ensure_ascii=False, indent=2)
    except OSError as exc:
        print(f'写入 {path} 失败：{exc}')
        return False
    print(f'已写入 {path}：{len(contacts)} 条记录')
    return True


def apply_command(contacts, command):
    action = command[0]
    if action == 'add':
        contact = add_contact(contacts, command[1], command[2], command[3])
        if contact is None:
            print(f'新增失败：{command[1]}（手机号无效或已存在）')
        else:
            print(f'新增成功：{contact["name"]}（id={contact["id"]}）')
    elif action == 'update':
        if update_phone(contacts, command[1], command[2]):
            print(f'更新成功：id={command[1]}')
        else:
            print(f'更新失败：没有 id={command[1]} 或号码无效')
    elif action == 'delete':
        if remove_contact(contacts, command[1]):
            print(f'删除成功：id={command[1]}')
        else:
            print(f'删除失败：没有 id={command[1]}')
    else:
        print('未知命令：', action)


def main():
    contacts = load_contacts()
    if not contacts:
        contacts = [dict(contact) for contact in SAMPLE_CONTACTS]
    commands = [
        ('add', '吴桐', '13900000004', '同学'),
        ('add', '顾星河', '13900000005', '同事'),
        ('update', 2, '13700000002'),
        ('delete', 3),
        ('add', '重复号码', '13900000004', '同学'),
    ]

    try:
        for command in commands:
            apply_command(contacts, command)
    finally:
        save_contacts(contacts)

    print('--- 退出前的通讯录 ---')
    for contact in sorted(contacts, key=lambda c: (c['group'], c['name'])):
        print(f"{contact['id']:>2} | {contact['name']:<4} | {contact['phone']} | {contact['group']}")

    print('--- 分组统计 ---')
    summary = group_summary(contacts)
    for group in sorted(summary):
        print(f'{group}：{summary[group]} 人')

    print('--- 搜索「139」---')
    for contact in search(contacts, '139'):
        print(f"{contact['name']}  {contact['phone']}")


if __name__ == '__main__':
    main()
`.trim(),
          explain: '这一版的重点是「整合」而不是新语法：加载、校验、分派、输出、保存各占一个函数，主流程只剩十几行。手机号重复检查放在 add_contact 里，所有入口都会受益；如果放在菜单里，换一个入口就会漏。finally 保证退出时写回，但写入本身仍可能失败，所以 save_contacts 里还要捕获 OSError。'
        }
      ],
      extension: [
        '增加交互式菜单：while True + input()，支持 list / add / find / del / quit',
        '给联系人加 birthday 字段，启动时提醒 30 天内过生日的人',
        '把 JSON 导出成 CSV，方便用表格软件打开'
      ],
      solutionNote: '参考实现用 contacts.json 保存数据，第一次运行会自动写入示例记录；再次运行会读回上次的结果，因此输出会随操作历史变化，这是持久化程序的正常表现。'
    },

    {
      id: 'csv-report',
      title: 'CSV 报表生成器',
      en: 'CSV Report',
      tagline: '把流水账变成带柱状图的品类报表',
      level: '综合',
      minutes: 150,
      chapters: ['ch06', 'ch07', 'ch08', 'ch09'],
      goals: [
        '用 csv 模块解析带表头的数据，并做 int / float 类型转换',
        '以品类为键聚合数量与金额，按金额降序排列',
        '计算占比并用 f-string 对齐输出文本报表',
        '用 # 画横向柱状图，并把报表写入 report.txt'
      ],
      intro: '一份销售流水只有日期、品类、商品、数量、单价五列，直接看很难回答「哪个品类最赚钱」。这个项目把内置 CSV 解析成记录，按品类汇总金额与数量，算出占比，画出字符柱状图，最后生成一份可以存档的 report.txt。',
      milestones: [
        {
          n: 1,
          title: '解析 CSV：从文本到记录',
          tasks: [
            '用 csv.reader 与 io.StringIO 读入内置 CSV，跳过表头',
            '校验列数，把数量转 int、单价转 float，算出每行金额',
            '打印逐行明细、明细行数与总金额'
          ],
          starter: `
import csv
import io

SALES_CSV = """日期,品类,商品,数量,单价
2026-03-01,图书,Python 编程导论,12,59.00
2026-03-01,图书,算法图解,8,45.50
2026-03-02,文具,机械键盘,5,299.00
2026-03-02,文具,笔记本,30,12.80
2026-03-03,数码,降噪耳机,4,399.00
2026-03-03,数码,移动硬盘,6,329.00
2026-03-04,图书,Python 编程导论,6,59.00
2026-03-04,文具,中性笔,50,3.50
2026-03-05,数码,USB-C 扩展坞,7,189.00
2026-03-05,图书,算法图解,10,45.50
"""

lines = SALES_CSV.strip().splitlines()
print('表头：', lines[0])
print('明细行数：', len(lines) - 1)
for line in lines[1:4]:
    print(line.split(','))

# TODO：用 csv 模块解析，并把数量和单价转成数字。
print('提示：把数量转成 int、单价转成 float，再算每一行的金额。')
`.trim(),
          hints: [
            'csv.reader 返回的是字符串列表，数量与单价要自己转 int / float。',
            '先校验 len(row) 再解包，能避免脏数据触发「not enough values to unpack」。'
          ],
          solution: `
import csv
import io

SALES_CSV = """日期,品类,商品,数量,单价
2026-03-01,图书,Python 编程导论,12,59.00
2026-03-01,图书,算法图解,8,45.50
2026-03-02,文具,机械键盘,5,299.00
2026-03-02,文具,笔记本,30,12.80
2026-03-03,数码,降噪耳机,4,399.00
2026-03-03,数码,移动硬盘,6,329.00
2026-03-04,图书,Python 编程导论,6,59.00
2026-03-04,文具,中性笔,50,3.50
2026-03-05,数码,USB-C 扩展坞,7,189.00
2026-03-05,图书,算法图解,10,45.50
"""


def parse_rows(text=SALES_CSV):
    reader = csv.reader(io.StringIO(text))
    header = next(reader)
    rows = []
    for line_no, row in enumerate(reader, start=2):
        if not row or not any(cell.strip() for cell in row):
            continue
        if len(row) != 5:
            print(f'第 {line_no} 行列数不是 5，已跳过')
            continue
        date, category, product, qty_text, price_text = row
        try:
            qty = int(qty_text)
            price = float(price_text)
        except ValueError:
            print(f'第 {line_no} 行数量或单价不是数字，已跳过')
            continue
        rows.append({
            'date': date,
            'category': category,
            'product': product,
            'qty': qty,
            'price': price,
            'amount': qty * price,
        })
    return rows


if __name__ == '__main__':
    rows = parse_rows()
    total = sum(row['amount'] for row in rows)
    for row in rows:
        print(f"{row['date']}  {row['category']:<4}{row['product']:<16}"
              f"{row['qty']:>3} × {row['price']:>7.2f} = {row['amount']:>9.2f}")
    print(f'明细行数：{len(rows)}')
    print(f'合计金额：{total:.2f}')
`.trim(),
          explain: 'CSV 是文本，不是表格：读进来全是字符串，金额要自己乘。用 csv 模块而不是 split(",")，是因为商品名里可能出现逗号或引号。解析时逐行校验，坏行跳过并打印行号，比让整个程序崩掉更适合处理真实数据。'
        },
        {
          n: 2,
          title: '按品类聚合金额与数量',
          tasks: [
            '用字典把同一品类的数量、金额、订单数累加到一起',
            '按金额从高到低排序，打印每个品类的汇总',
            '输出总数量与总金额，和明细行数交叉核对'
          ],
          starter: `
SALES_CSV = """日期,品类,商品,数量,单价
2026-03-01,图书,Python 编程导论,12,59.00
2026-03-01,图书,算法图解,8,45.50
2026-03-02,文具,机械键盘,5,299.00
2026-03-02,文具,笔记本,30,12.80
2026-03-03,数码,降噪耳机,4,399.00
2026-03-03,数码,移动硬盘,6,329.00
2026-03-04,图书,Python 编程导论,6,59.00
2026-03-04,文具,中性笔,50,3.50
2026-03-05,数码,USB-C 扩展坞,7,189.00
2026-03-05,图书,算法图解,10,45.50
"""

rows = []
for line in SALES_CSV.strip().splitlines()[1:]:
    parts = line.split(',')
    rows.append({
        'category': parts[1],
        'qty': int(parts[3]),
        'price': float(parts[4]),
    })

counts = {}
for row in rows:
    category = row['category']
    counts[category] = counts.get(category, 0) + 1

for category, count in counts.items():
    print(f'{category}：{count} 笔')

# TODO：按品类累加数量与金额，再按金额降序排列。
print('提示：把每行的 qty * price 累加进金额，再按金额排序。')
`.trim(),
          hints: [
            '聚合前先想清楚「键是什么」：这里品类是键，数量、金额、订单数是值。',
            '金额有小数，累加时用 0.0 初始化；输出时再用 :.2f 格式化。'
          ],
          solution: `
import csv
import io

SALES_CSV = """日期,品类,商品,数量,单价
2026-03-01,图书,Python 编程导论,12,59.00
2026-03-01,图书,算法图解,8,45.50
2026-03-02,文具,机械键盘,5,299.00
2026-03-02,文具,笔记本,30,12.80
2026-03-03,数码,降噪耳机,4,399.00
2026-03-03,数码,移动硬盘,6,329.00
2026-03-04,图书,Python 编程导论,6,59.00
2026-03-04,文具,中性笔,50,3.50
2026-03-05,数码,USB-C 扩展坞,7,189.00
2026-03-05,图书,算法图解,10,45.50
"""


def parse_rows(text=SALES_CSV):
    reader = csv.reader(io.StringIO(text))
    next(reader)
    rows = []
    for row in reader:
        if not row or len(row) != 5:
            continue
        rows.append({
            'date': row[0],
            'category': row[1],
            'product': row[2],
            'qty': int(row[3]),
            'price': float(row[4]),
            'amount': int(row[3]) * float(row[4]),
        })
    return rows


def summarize(rows):
    stats = {}
    for row in rows:
        category = row['category']
        if category not in stats:
            stats[category] = {'qty': 0, 'amount': 0.0, 'orders': 0}
        stats[category]['qty'] += row['qty']
        stats[category]['amount'] += row['amount']
        stats[category]['orders'] += 1
    return stats


if __name__ == '__main__':
    rows = parse_rows()
    stats = summarize(rows)
    ordered = sorted(stats.items(), key=lambda pair: pair[1]['amount'], reverse=True)

    print(f'{"品类":<6}{"数量":>6}{"金额":>12}{"订单数":>8}')
    print('-' * 34)
    for category, item in ordered:
        print(f'{category:<6}{item["qty"]:>6}{item["amount"]:>12.2f}{item["orders"]:>8}')

    total_qty = sum(item['qty'] for item in stats.values())
    total_amount = sum(item['amount'] for item in stats.values())
    print(f'总数量：{total_qty}    总金额：{total_amount:.2f}')
`.trim(),
          explain: '聚合的本质是「按某个字段分组，对另一些字段求和」。用 dict.setdefault 或先判断键是否存在，都能避免 KeyError。排序时对 stats.items() 排序，key 取 item[1]["amount"]，不要对字典本身排序。金额累加会出现浮点误差，展示时四舍五入即可，不要用 == 比较两个金额。'
        },
        {
          n: 3,
          title: '占比、对齐与报表正文',
          tasks: [
            '先算 total_amount，再计算每个品类的金额占比',
            '用固定列宽和分隔线拼出报表的表头、数据行与合计行',
            '把报表放进 build_report(rows) 返回的字符串列表，便于复用'
          ],
          starter: `
SALES_CSV = """日期,品类,商品,数量,单价
2026-03-01,图书,Python 编程导论,12,59.00
2026-03-01,图书,算法图解,8,45.50
2026-03-02,文具,机械键盘,5,299.00
2026-03-02,文具,笔记本,30,12.80
2026-03-03,数码,降噪耳机,4,399.00
2026-03-03,数码,移动硬盘,6,329.00
2026-03-04,图书,Python 编程导论,6,59.00
2026-03-04,文具,中性笔,50,3.50
2026-03-05,数码,USB-C 扩展坞,7,189.00
2026-03-05,图书,算法图解,10,45.50
"""

rows = []
for line in SALES_CSV.strip().splitlines()[1:]:
    parts = line.split(',')
    rows.append({
        'category': parts[1],
        'qty': int(parts[3]),
        'amount': int(parts[3]) * float(parts[4]),
    })

stats = {}
for row in rows:
    category = row['category']
    stats[category] = stats.get(category, 0) + row['amount']

for category, amount in stats.items():
    print(f'{category}：{amount:.2f} 元')

# TODO：先算总金额，再为每个品类计算占比。
print('提示：先求总金额，再用 amount / total * 100 算占比。')
`.trim(),
          hints: [
            '先算 total_amount，再用 amount / total_amount * 100 得到占比。',
            '表头和数据行用同一组宽度，才能让数字列对齐；中文列宽和英文不同，必要时手动补空格。'
          ],
          solution: `
import csv
import io

SALES_CSV = """日期,品类,商品,数量,单价
2026-03-01,图书,Python 编程导论,12,59.00
2026-03-01,图书,算法图解,8,45.50
2026-03-02,文具,机械键盘,5,299.00
2026-03-02,文具,笔记本,30,12.80
2026-03-03,数码,降噪耳机,4,399.00
2026-03-03,数码,移动硬盘,6,329.00
2026-03-04,图书,Python 编程导论,6,59.00
2026-03-04,文具,中性笔,50,3.50
2026-03-05,数码,USB-C 扩展坞,7,189.00
2026-03-05,图书,算法图解,10,45.50
"""


def parse_rows(text=SALES_CSV):
    reader = csv.reader(io.StringIO(text))
    next(reader)
    rows = []
    for row in reader:
        if not row or len(row) != 5:
            continue
        qty = int(row[3])
        price = float(row[4])
        rows.append({
            'category': row[1],
            'qty': qty,
            'price': price,
            'amount': qty * price,
        })
    return rows


def summarize(rows):
    stats = {}
    for row in rows:
        category = row['category']
        if category not in stats:
            stats[category] = {'qty': 0, 'amount': 0.0, 'orders': 0}
        stats[category]['qty'] += row['qty']
        stats[category]['amount'] += row['amount']
        stats[category]['orders'] += 1
    return stats


def build_report(rows):
    stats = summarize(rows)
    total_qty = sum(item['qty'] for item in stats.values())
    total_amount = sum(item['amount'] for item in stats.values())
    ordered = sorted(stats.items(), key=lambda pair: pair[1]['amount'], reverse=True)

    lines = []
    lines.append('=' * 54)
    lines.append('销售品类汇总报表'.center(50))
    lines.append('=' * 54)
    lines.append(f'{"品类":<6}{"数量":>6}{"金额":>12}{"占比":>9}')
    lines.append('-' * 54)
    for category, item in ordered:
        share = item['amount'] / total_amount * 100 if total_amount else 0.0
        lines.append(f'{category:<6}{item["qty"]:>6}{item["amount"]:>12.2f}{share:>8.1f}%')
    lines.append('-' * 54)
    lines.append(f'{"合计":<6}{total_qty:>6}{total_amount:>12.2f}{100.0:>8.1f}%')
    lines.append('=' * 54)
    return lines


if __name__ == '__main__':
    for line in build_report(parse_rows()):
        print(line)
`.trim(),
          explain: '报表的可读性来自「稳定的列宽 + 清晰的合计行」。f-string 的 < 左对齐、> 右对齐只按字符数计算，中文字符的显示宽度是 2，所以中英混排时可能看起来差一点；本项目的品类都是两个汉字，影响不大。占比保留一位小数，合计固定写 100.0%，避免四舍五入后三行加起来不是 100。'
        },
        {
          n: 4,
          title: '字符柱状图与写回 report.txt',
          tasks: [
            '按「当前金额 / 最大金额 × 最大宽度」计算每行 # 的数量',
            '把柱状条接在占比后面，生成最终报表',
            '用 with open(..., "w", encoding="utf-8") 写回 report.txt，并处理 OSError'
          ],
          starter: `
SALES_CSV = """日期,品类,商品,数量,单价
2026-03-01,图书,Python 编程导论,12,59.00
2026-03-01,图书,算法图解,8,45.50
2026-03-02,文具,机械键盘,5,299.00
2026-03-02,文具,笔记本,30,12.80
2026-03-03,数码,降噪耳机,4,399.00
2026-03-03,数码,移动硬盘,6,329.00
2026-03-04,图书,Python 编程导论,6,59.00
2026-03-04,文具,中性笔,50,3.50
2026-03-05,数码,USB-C 扩展坞,7,189.00
2026-03-05,图书,算法图解,10,45.50
"""

stats = {}
for line in SALES_CSV.strip().splitlines()[1:]:
    parts = line.split(',')
    category = parts[1]
    amount = int(parts[3]) * float(parts[4])
    stats[category] = stats.get(category, 0.0) + amount

for category, amount in stats.items():
    fill = 20
    print(f'{category:<4}{amount:>9.2f}  {"#" * fill}')

# TODO：把固定的柱长 20 改成「当前金额 / 最大金额 × 20」。
# TODO：把占比与柱状条拼进报表，并写入 report.txt。
print('提示：现在每条柱一样长；按最大金额缩放后，才能看出差距。')
`.trim(),
          hints: [
            '柱长按「当前金额 / 最大金额 × 最大宽度」缩放，最大值至少给 1 个 #。',
            '写文件时用 with open(..., "w", encoding="utf-8")，逐行 print(..., file=f) 可以自动加换行。'
          ],
          solution: `
import csv
import io

SALES_CSV = """日期,品类,商品,数量,单价
2026-03-01,图书,Python 编程导论,12,59.00
2026-03-01,图书,算法图解,8,45.50
2026-03-02,文具,机械键盘,5,299.00
2026-03-02,文具,笔记本,30,12.80
2026-03-03,数码,降噪耳机,4,399.00
2026-03-03,数码,移动硬盘,6,329.00
2026-03-04,图书,Python 编程导论,6,59.00
2026-03-04,文具,中性笔,50,3.50
2026-03-05,数码,USB-C 扩展坞,7,189.00
2026-03-05,图书,算法图解,10,45.50
"""


def parse_rows(text=SALES_CSV):
    reader = csv.reader(io.StringIO(text))
    next(reader)
    rows = []
    for row in reader:
        if not row or len(row) != 5:
            continue
        qty = int(row[3])
        price = float(row[4])
        rows.append({
            'category': row[1],
            'qty': qty,
            'price': price,
            'amount': qty * price,
        })
    return rows


def summarize(rows):
    stats = {}
    for row in rows:
        category = row['category']
        if category not in stats:
            stats[category] = {'qty': 0, 'amount': 0.0, 'orders': 0}
        stats[category]['qty'] += row['qty']
        stats[category]['amount'] += row['amount']
        stats[category]['orders'] += 1
    return stats


def build_report(rows, bar_width=24):
    stats = summarize(rows)
    total_qty = sum(item['qty'] for item in stats.values())
    total_amount = sum(item['amount'] for item in stats.values())
    max_amount = max((item['amount'] for item in stats.values()), default=0.0)
    ordered = sorted(stats.items(), key=lambda pair: pair[1]['amount'], reverse=True)

    lines = []
    lines.append('=' * 62)
    lines.append('销售品类汇总报表'.center(58))
    lines.append('=' * 62)
    lines.append(f'{"品类":<6}{"数量":>6}{"金额":>12}{"占比":>9}  金额分布')
    lines.append('-' * 62)
    for category, item in ordered:
        share = item['amount'] / total_amount * 100 if total_amount else 0.0
        fill = round(item['amount'] / max_amount * bar_width) if max_amount else 0
        if item['amount'] > 0 and fill == 0:
            fill = 1
        bar = '#' * fill
        lines.append(f'{category:<6}{item["qty"]:>6}{item["amount"]:>12.2f}{share:>8.1f}%  {bar}')
    lines.append('-' * 62)
    lines.append(f'{"合计":<6}{total_qty:>6}{total_amount:>12.2f}{100.0:>8.1f}%')
    lines.append('=' * 62)
    return lines


def write_report(lines, path='report.txt'):
    try:
        with open(path, 'w', encoding='utf-8') as f:
            for line in lines:
                print(line, file=f)
    except OSError as exc:
        print(f'写入 {path} 失败：{exc}')
        return False
    return True


if __name__ == '__main__':
    lines = build_report(parse_rows())
    for line in lines:
        print(line)
    if write_report(lines):
        print('报表已写入 report.txt')
`.trim(),
          explain: '柱状图是「用字符长度编码数值」，所以必须按最大值缩放，否则金额一大就会画出几百个 #。写文件时不要用 "w" 之外的模式，也不要忘记 encoding="utf-8"，否则中文在 Windows 上可能变成乱码。捕获 OSError 后仍把报表打印到屏幕，保证程序不会因为磁盘问题而一无所获。'
        }
      ],
      extension: [
        '支持从命令行接收 CSV 路径：python report.py sales.csv',
        '增加「按月份汇总」和「环比增长」两列',
        '把字符柱状图换成 SVG 柱状图（只用字符串拼 SVG 标签）'
      ],
      solutionNote: '参考实现内置一份 10 行销售数据，运行后会在当前目录生成 report.txt；如果目录不可写，程序会打印错误并保留屏幕输出。'
    }
  ]);
})();
