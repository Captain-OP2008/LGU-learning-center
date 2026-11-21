/* =====================================================================
 * data/adv-py.js · 进阶轨道 · Python 进阶（课程之外的深入学习）
 *
 * 4 个小节：模块与包 / 装饰器与生成器 / NumPy 与数据处理 / 用 AI 写 Python 项目
 * 说明：Python 代码站内引擎不可执行，全部 run:false；内容以「看得懂、用得上」为准。
 * 注册：CSC.registerAdvanced([...])（schema 见 _dev/CONTRACT.md §7.9；
 *       另补了 app.js 已支持的展示字段 tagline / intro / goals / prereq / level /
 *       minutes / checklist / keypoint / finish，以及每节的 en / minutes）
 * 作者模块：content-ml
 * ===================================================================== */

CSC.registerAdvanced([{
  id: 'adv-py',
  title: 'Python 进阶',
  en: 'ADVANCED PYTHON',
  part: 'ADVANCED',
  icon: 'code',
  blurb: '把课程里的 Python 补成「工程里能用的 Python」：模块与包、装饰器与生成器、NumPy 数据运算，以及用 AI 写项目的正确姿势。',
  tagline: '从「会写脚本」到「会组织项目」：模块、装饰器、NumPy 与 AI 协作的四块拼图',
  level: '进阶',
  minutes: 90,
  prereq: ['ch15', 'ch16'],
  intro: '<p>主课程教你用 Python 写出能运行的程序；这一篇补上「真实项目」需要的四块：'
    + '<b>模块与包</b>（代码怎么拆、环境怎么隔离）、<b>装饰器与生成器</b>（两个最常被考、也最常被用的进阶语法）、'
    + '<b>NumPy</b>（数据运算的地基，也是 PyTorch 张量的前身）、<b>AI 协作</b>（怎么让 AI 写代码而不被它带偏）。</p>'
    + '<p>读完再看第 19 章的 PyTorch 项目，你会发现它并不神秘：不过是把这几块拼在一起。</p>',
  goals: [
    '能解释一个 .py 文件为什么既是模块、也能直接运行，并说清 if __name__ == "__main__" 的作用',
    '能写出一个装饰器与一个生成器，并指出各自最容易写错的一行',
    '能用 ndarray 完成整块运算，并解释广播为什么让形状 bug 变得隐蔽',
    '能把需求拆成可测试的小任务，用 AI 生成代码并用测试与 review 清单验收'
  ],
  sections: [

    /* ---------------------------------------------------------------- S1 模块与包 */
    {
      id: 'adv-py-1',
      title: '模块与包：import、__name__ 与环境',
      en: 'MODULES & PACKAGES',
      minutes: 20,
      html: '一个 .py 文件就是模块，一个目录加上 __init__.py 就是包；把代码拆开再拼起来，靠的是 import 与环境隔离。',
      blocks: [
        { t: 'h', text: 'import 与 __name__' },
        { t: 'p', html:
          `Python 里「一个文件 = 一个<b>模块（module）</b>」，一个目录加上 <code>__init__.py</code> 就是<b>包（package）</b>。你写几百行的项目时，把 main / model / train 拆成不同文件、再用 import 拼起来，靠的就是这套机制。<br>
          先看四种最常见的 import 写法——它们的区别只有两个：名字进不进当前命名空间、调用时要加不加前缀。` },
        { t: 'code', lang: 'python', run: false, caption: '四种常见 import 写法（Python，本站引擎不执行）', code:
`# 四种常见 import
import math                      # 整包导入：调用时写 math.sqrt
from math import sqrt            # 只导入一个名字：直接写 sqrt
import numpy as np               # 起别名：写 np.array
from model import Net, train     # 从自己写的模块导入

# from math import *            # 不推荐：把一堆名字塞进当前命名空间` },
        { t: 'p', html:
          `项目里推荐「import 模块，再用模块.名字」：一眼能看出函数来自哪里，也不会和本地变量重名。<code>__name__</code> 是 Python 发给每个模块的「身份标签」：文件被<b>直接运行</b>时它是 <code>"__main__"</code>，被别的文件 import 时它是模块名。所以 <code>if __name__ == "__main__":</code> 里的代码只在「当脚本跑」时执行——这就是「可执行」与「可复用」放在同一个文件里的标准写法。` },
        { t: 'code', lang: 'python', run: false, caption: 'calc.py：既可以被 import，也可以直接运行', code:
`# calc.py —— 既可被 import，也可直接运行
def add(a, b):
    return a + b

if __name__ == "__main__":      # 只有 python calc.py 时才执行
    print(add(2, 3))            # 输出 5

# 别的文件里：import calc 之后不会打印 5
# 想调用就写 calc.add(1, 2)` },
        { t: 'h', text: '包、venv 与 conda' },
        { t: 'p', html:
          `模块多了就要有<b>包（package）</b>：把相关的 .py 放进一个目录，再加一个 <code>__init__.py</code>（可以是空文件）。目录名就是包名，文件路径就是「包.模块」路径。<br>
          项目里两种写法都常见：绝对导入 <code>from model.layers import Net</code>（从项目根目录算起，推荐）、相对导入 <code>from .layers import Net</code>（从当前包算起）。混用最容易出现「明明文件就在旁边，import 却找不到」——本质是运行脚本时的工作目录不同，Python 搜索模块的起点也不同。` },
        { t: 'p', html:
          `环境隔离有两套主流工具：<b>venv</b> 是 Python 自带的，<b>conda</b> 则连 Python 版本一起管。命令都很短，关键是「建完之后要激活」，否则装的包仍然进错地方。` },
        { t: 'code', lang: 'python', run: false, caption: 'venv 与 conda 的常用命令（命令行示意）', code:
`# venv：在项目目录里建环境
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install requests

# conda：连 Python 版本一起管
conda create -n csc1004 python=3.10
conda activate csc1004
conda list                         # 看这个环境里装了什么` },
        { t: 'table',
          head: ['对比项', 'venv', 'conda'],
          rows: [
            ['来源', 'Python 自带', '需要安装 MiniConda / Anaconda'],
            ['管什么', '只隔离第三方包', '连 Python 版本一起管'],
            ['适合场景', '单个小项目', '要切换 Python 版本、装机器学习库']
          ],
          caption: '课程推荐 conda：机器学习项目的 Python 版本与 GPU 库版本强绑定，一起管省事' },
        { t: 'p', html:
          `环境搞定后还有两个常见坑。第一，<b>文件重名</b>：把自己的文件命名成 <code>random.py</code> 或 <code>math.py</code>，import 时会 import 到你自己，标准库反而找不到了。第二，<b>循环导入</b>：a.py 顶部 import b，b.py 顶部又 import a，两边都还没定义完就互相调用，程序会卡在 <code>ImportError</code> 上。解法是把公共部分抽到第三个模块，或把 import 挪进函数里（用到时再导入）。` },
        { t: 'p', html:
          `最后别忘了把依赖写进 <code>requirements.txt</code>（<code>pip freeze &gt; requirements.txt</code>）：别人拿到你的项目，一条 <code>pip install -r requirements.txt</code> 就能复现环境。这一步是「在我电脑上能跑」和「在哪都能跑」的分界线。` },
        { t: 'callout', kind: 'tip', html:
          `判断当前环境对不对，只看两行输出：<code>which python</code>（Windows 用 <code>where python</code>）指向哪个解释器、<code>pip list</code> 里有没有你装过的包。环境问题 90% 都能这样暴露出来。` }
      ]
    },

    /* ---------------------------------------------------------------- S2 装饰器与生成器 */
    {
      id: 'adv-py-2',
      title: '装饰器与生成器：给函数套壳、让函数暂停',
      en: 'DECORATORS & GENERATORS',
      minutes: 20,
      html: '装饰器在不改函数代码的前提下加行为；生成器让函数可以「中途暂停」。两者都是 Python 里最常用的进阶语法。',
      blocks: [
        { t: 'h', text: '装饰器：不改代码加行为' },
        { t: 'p', html:
          `<b>装饰器（decorator）</b>是「不改函数代码、给它套一层行为」的语法。<code>@decorator</code> 只是语法糖：把下面的函数对象传给 decorator，再把返回值赋回同名变量。所以装饰器函数必须返回一个「可调用对象」。` },
        { t: 'code', lang: 'python', run: false, caption: 'timer 装饰器：不修改函数体，就能统计耗时', code:
`import time

def timer(func):
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)     # 调用原函数
        print(f"{func.__name__} 用时 {time.time() - start:.4f}s")
        return result                      # 原函数的返回值必须传出去
    return wrapper

@timer
def slow_add(a, b):
    time.sleep(0.1)
    return a + b

slow_add(1, 2)      # 先打印用时，返回 3` },
        { t: 'p', html:
          `装饰器的价值在于「横切关注点」：日志、计时、权限检查、结果缓存，这些逻辑每个函数都要写一遍，用装饰器可以一次写好、到处贴。标准库里的 <code>@property</code> 让方法可以像属性一样访问、<code>@staticmethod</code> 把方法变成普通函数，它们都是装饰器；<code>functools.wraps</code> 则用来保留原函数的名字和文档字符串，写工具函数时最好加上。` },
        { t: 'h', text: '生成器：yield 与生成器表达式' },
        { t: 'p', html:
          `三个关键点：① <code>wrapper</code> 用 <code>*args, **kwargs</code> 接住任意参数；② 一定要 <code>return result</code>，否则原函数返回值丢了；③ 返回的是 <code>wrapper</code> 而不是 <code>wrapper()</code>——套的是函数对象，不是调用结果。<br>
          <b>生成器（generator）</b>是另一种「改变函数行为」的机制：函数里出现 <code>yield</code> 就变成生成器，调用时不执行函数体，只返回一个可迭代对象；每 <code>next()</code> 一次才往下走一步。` },
        { t: 'code', lang: 'python', run: false, caption: 'countdown 生成器：yield 交出一个值后暂停，下一次从暂停处继续', code:
`def countdown(n):
    while n > 0:
        yield n          # 暂停在这里，把 n 交出去
        n -= 1

for x in countdown(3):
    print(x)             # 3 2 1

g = countdown(2)
print(next(g))           # 2：执行到第一个 yield 就停
print(next(g))           # 1
# print(next(g))         # 再取就 StopIteration` },
        { t: 'p', html:
          `生成器还有简写：圆括号的<b>生成器表达式</b> <code>(x * x for x in range(5))</code>，和列表推导式只差括号，但它不一次建好列表，而是边算边给。读大文件时常用「生成器管道」：一行行读、一行行处理、一行行汇总，内存里始终只有一行。` },
        { t: 'p', html:
          `区别一句话：普通函数 <code>return</code> 一次就结束；<code>yield</code> 可以多次「交出一个值再继续」。生成器适合读大文件、产出长序列——不会一次把所有结果算进内存。考试不要求你写复杂装饰器，但要看懂 <code>@staticmethod</code>、<code>@property</code> 这些内置装饰器在做什么。` },
        { t: 'p', html:
          `什么时候别用：装饰器叠太多层会让调用栈难读、调试变难；生成器不能重复遍历，也不能直接取长度（要 <code>len(list(g))</code> 就得先转成列表）。知道代价，才知道该不该用。` },
        { t: 'callout', kind: 'warn', html:
          `装饰器最大的坑是忘记返回函数对象：如果 <code>timer</code> 忘了 <code>return wrapper</code>，<code>slow_add</code> 会变成 <code>None</code>，调用时直接 <code>TypeError</code>。生成器的坑是重复遍历：同一个生成器对象只能消费一次，第二次 for 会「空掉」。` }
      ]
    },

    /* ---------------------------------------------------------------- S3 NumPy */
    {
      id: 'adv-py-3',
      title: 'NumPy 与数据处理基础',
      en: 'NUMPY BASICS',
      minutes: 25,
      html: 'ndarray 是一块连续内存里的同类型数字；整块运算 + 广播，让「一行顶一个循环」成为常态。',
      blocks: [
        { t: 'h', text: 'ndarray：形状、切片与广播' },
        { t: 'p', html:
          `NumPy 是 Python 科学计算的底座（PyTorch 的张量就长得很像它）。核心是 <b>ndarray</b>：一块连续内存里的同类型数字，支持整个数组一起算，而不是用 for 一个个算。` },
        { t: 'code', lang: 'python', run: false, caption: 'ndarray 的创建与 shape / dtype', code:
`import numpy as np

a = np.array([1, 2, 3, 4])
print(a.shape, a.dtype)      # (4,) int64
b = np.zeros((2, 3))         # 2×3 全零矩阵
c = np.arange(0, 10, 2)      # [0 2 4 6 8]
print(b.shape, c.shape)` },
        { t: 'p', html:
          `ndarray 的取值方式和 list 类似但更强：<code>a[0]</code> 按位置取、<code>a[1:3]</code> 切片、<code>a[a &gt; 2]</code> 用布尔条件筛出满足条件的元素。二维数组用 <code>b[0, 1]</code> 或 <code>b[0][1]</code>；还有 <code>axis</code> 参数：<code>b.sum(axis=0)</code> 是「按列求和」，<code>axis=1</code> 是「按行求和」——axis 指的是「被压掉的那一维」。` },
        { t: 'p', html:
          `<b>广播（broadcasting）</b>是 NumPy 最省事也最容易出错的能力：形状不同的数组会自动「对齐」后再算。规则可简化成一句：从最后一维往前比，长度相等或其中一个是 1 就能算，否则报错。` },
        { t: 'code', lang: 'python', run: false, caption: '广播：形状 (2,3) 与 (3,)、(2,1) 分别相加', code:
`import numpy as np

a = np.array([[1, 2, 3],
              [4, 5, 6]])       # 形状 (2, 3)
b = np.array([10, 20, 30])      # 形状 (3,)
print(a + b)                    # 每一行都加上 [10 20 30]

c = np.array([[1], [2]])        # 形状 (2, 1)
print(a + c)                    # 每一列分别加 1、加 2` },
        { t: 'p', html:
          `矩阵运算里还要注意 <code>dtype</code>：默认整数是 int64、浮点是 float64；深度学习和图形计算常显式指定 <code>float32</code>，省一半内存、跑得更快。整数数组做除法会得到浮点数组，<code>reshape</code> 会改变形状——这些「看不见的类型转换」是数据 bug 的常见来源。` },
        { t: 'h', text: '从 list 到向量化' },
        { t: 'p', html:
          `为什么要用它：同样「每个元素乘 2 再加 1」，list 要写循环，NumPy 一行搞定；而且底层是 C，快一个数量级。下面这段把两种写法放在一起。` },
        { t: 'code', lang: 'python', run: false, caption: '同一个运算：Python list 循环 vs NumPy 整块运算', code:
`import numpy as np

xs = list(range(1000000))
ys = [x * 2 + 1 for x in xs]      # 纯 Python：循环 + 新列表

arr = np.arange(1000000)
ys2 = arr * 2 + 1                 # NumPy：整块运算，不写循环
print(len(ys), ys2.shape)` },
        { t: 'p', html:
          `常用函数顺手记几个：<code>np.mean / np.std</code> 求均值与标准差、<code>np.dot</code> 或 <code>@</code> 做矩阵乘法、<code>np.concatenate</code> 拼数组、<code>np.where</code> 做条件替换。它们都是一次对整个数组生效，不要用 for 包起来——数据和计算分离，才是「向量化」的思维方式。` },
        { t: 'p', html:
          `真实的数据处理流程通常是四步：读数据（CSV / Excel / 数据库）→ 清洗（缺失值、重复行、类型转换）→ 计算（筛选、分组、统计）→ 输出（表格、图、文件）。前两步常用 <b>pandas</b>（DataFrame 底层就是 ndarray），后两步用 NumPy 的整块运算。先想清楚每一步的输入输出是「几行几列」，代码就不会写成一大坨 for 循环。` },
        { t: 'p', html:
          `再强调一次最常见的形状 bug：<code>np.array([1, 2, 3])</code> 是 (3,)，<code>np.array([[1], [2], [3]])</code> 才是 (3, 1)。前者能被当成一行、后者是一列，广播结果完全不同；先打印 <code>.shape</code>，比盯着结果猜快得多。` },
        { t: 'callout', kind: 'tip', html:
          `数据处理的第一条纪律：先看 <code>shape</code> 和 <code>dtype</code>，再算。绝大多数 NumPy 报错都源于「我以为它是 (n, 1)，实际是 (n,)」——形状对了，计算才可能对。` }
      ]
    },

    /* ---------------------------------------------------------------- S4 AI 写项目 */
    {
      id: 'adv-py-4',
      title: '用 AI 写 Python 项目的正确姿势',
      en: 'AI-ASSISTED PYTHON',
      minutes: 20,
      html: 'AI 的产出质量取决于你给的输入：需求拆得越细、样例越具体，代码越可验证。',
      blocks: [
        { t: 'h', text: '把需求变成可验证的任务' },
        { t: 'p', html:
          `用 AI 写 Python 项目，效率高不高取决于你给的输入。把一句话需求扔给它，得到的是一份「看起来能跑」的代码；把需求拆成小任务、配上样例输入输出，它才能给你<b>可验证</b>的代码。` },
        { t: 'steps', items: [
          { title: '需求拆解', html: '把功能拆成 5–10 个可单独验证的小任务（读文件、清洗、计算、输出），每个都写清输入与输出。' },
          { title: '先要骨架，再要实现', html: '让它先给函数签名 + docstring + TODO，你确认接口合理后，再逐个填实现。' },
          { title: '写测试再写代码', html: '每个函数至少一个样例输入输出，用 <code>assert</code> 固定住；之后 AI 每次改代码，先跑测试。' },
          { title: '小步提交', html: '一次只让它改一个函数，改完立刻运行；不要一次贴 500 行让它「顺便重构」。' },
          { title: '人工 review', html: '核对 API 是否真实存在、边界条件（空列表 / 0 / None）、异常有没有被偷偷吞掉。' }
        ] },
        { t: 'p', html:
          `把上面五步落成一句提示词模板：<b>「用 Python 实现 &lt;函数名&gt;，输入是 &lt;类型与形状&gt;，输出是 &lt;类型与约定&gt;，边界情况包括 &lt;空 / 0 / 负数&gt;；先给函数签名和 3 个测试用例，我确认后再写实现。」</b> 这句比「帮我写个数据处理程序」有用得多——它把验收标准提前说清楚了。` },
        { t: 'code', lang: 'python', run: false, caption: '先把期望行为写成测试：pytest 与 assert', code:
`# test_stats.py —— 先把期望行为固定下来
from stats import mean, normalize

def test_mean_basic():
    assert mean([1, 2, 3]) == 2

def test_mean_empty():
    assert mean([]) == 0        # 空列表的约定：返回 0

def test_normalize():
    assert normalize([2, 4]) == [0.0, 1.0]

# 运行：pytest -q` },
        { t: 'h', text: '测试、review 与幻觉 API' },
        { t: 'p', html:
          `review 时按清单过一遍：① 函数名与参数是否和需求一致；② 有没有处理空值、0、负数的边界；③ 异常是「处理」还是「吞掉」；④ 复杂度过高的循环能不能换成 NumPy；⑤ 依赖是否写进 <code>requirements.txt</code>。<br>
          还有一类错误只在 AI 代码里高频出现：<b>编造 API</b>。它会把 Keras 的 <code>fit()</code> 安到 PyTorch 上，或者造一个库里根本没有的方法名。` },
        { t: 'code', lang: 'python', run: false, caption: 'AI 常编造的「API」：这些方法在对应库里并不存在', code:
`# 下面这些调用在真实库里都不成立
import pandas as pd
df = pd.DataFrame({"a": [1, 2]})
df.drop_duplicates_by("a")     # ✗ 没有这个方法
df.remove_na_rows()            # ✗ 正确写法是 df.dropna()

import torch
model.fit(train_loader)        # ✗ PyTorch 没有 fit()（Keras 才有）` },
        { t: 'p', html:
          `还有一条经验：<b>让 AI 改现有代码，比让它从零写更可靠</b>。先自己搭出能跑的骨架，再把「这里报错了 / 这里结果不对」连同完整报错和输入一起发给它，让它只改一处。一次让它重写全部，你会失去「哪一步是好的」的判断力。` },
        { t: 'callout', kind: 'warn', html:
          `AI 写的代码最常见的三个问题：编造不存在的 API、把异常整个 <code>try/except</code> 吞掉、边界条件写错还自带「测试通过」的自信。对策只有一个：每个函数都有可运行的样例，跑一遍再相信它。` }
      ]
    }

  ],
  checklist: { id: 'adv-py', items: [
    '我能说出 import、from ... import、as 三种写法的区别',
    '我能解释 __name__ 在「直接运行」与「被 import」时的不同取值',
    '我能用 venv 或 conda 建环境，并说出为什么不能把库装进 base 环境',
    '我能手写一个计时装饰器，并说明为什么必须 return wrapper',
    '我能用 yield 写出生成器，并解释它和 return 的区别',
    '我能用 NumPy 整块运算替代 for 循环，并会先检查 shape / dtype',
    '我能为一个 AI 生成的函数写出 assert 测试，并按 review 清单检查边界'
  ] },
  keypoint: { items: [
    { title: '模块与包', html: '一个文件 = 一个模块，目录 + <code>__init__.py</code> = 一个包；import 只管路径与命名空间。' },
    { title: '环境隔离', html: 'venv / conda + requirements.txt，是「在哪都能跑」的前提。' },
    { title: '装饰器', html: '<code>@</code> 只是把函数传给装饰器并重新赋值；wrapper 必须返回原函数的结果。' },
    { title: '生成器', html: '<code>yield</code> 让函数暂停并交出一个值；生成器对象只能消费一次。' },
    { title: 'NumPy', html: 'ndarray + 广播 + 整块运算；先看 shape / dtype 再算，形状错是数据 bug 的第一来源。' },
    { title: '用 AI', html: '需求拆小 + 先写测试 + 人工 review API 是否真实、边界是否处理。' }
  ] },
  finish: '学完这一篇，你已经补齐了课程 Python 项目的「工程外围」：会拆模块、会管环境、会写测试。下一步回到第 19 章，把这些习惯带进那个 PyTorch 项目——先跑通读配置，再逐步加模型与训练循环。'
}]);
