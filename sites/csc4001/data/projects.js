/* =====================================================================
 * projects.js · CSC4001 实战项目
 * 结构：{ id, title, en, tagline, level, minutes, chapters, goals, intro,
 *         milestones:[{ n, title, tasks, starter, hints, solution }] }
 * 三个项目由易到难：CFG + 到达定值 → 符号执行小引擎 → 测试约简与定位。
 * 语言不限，示例用 Python 3（标准库即可），也可用 Java/JavaScript 重写。
 * ===================================================================== */
(function () {
  'use strict';

  CSC.registerProjects([

    /* ================================================================ P1 */
    {
      id: 'P1',
      title: '控制流图与到达定值分析器',
      en: 'CFG & REACHING DEFS',
      tagline: '把一段三地址码切成基本块、连成 CFG，再用 worklist 算到达定值。',
      level: '入门',
      minutes: 150,
      chapters: ['ch01', 'ch02', 'ch03', 'ch04'],
      goals: [
        '能把带标号的三地址码切分成基本块，并按跳转关系建立 CFG',
        '能实现前向 may 分析的传递函数与汇合运算，算出每个块入口/出口的到达定值',
        '能用 worklist 替代「每轮扫全部块」，并解释它为什么不改变不动点',
        '能对结果做一次手工验算，说明哪条定值被 kill、哪条经哪条路径到达'
      ],
      intro: '这个项目没有任何外部依赖：输入是一段文本形式的三地址码，输出是基本块划分、CFG 边表，以及每个块入口的到达定值集合。' +
        '它把 ch01 的「leader 规则」、ch02 的「gen/kill 与并集」、ch04 的「worklist」串成一条可运行的流水线。' +
        '做完之后，你会真正理解为什么「到达定值取并集」，而不是背公式。',
      milestones: [
        {
          n: 1,
          title: '切基本块、连 CFG',
          tasks: [
            '定义输入格式：每行一条指令，可带标号（如 L1:），跳转写作 goto L2 / if x > 0 goto L3。先写一个 8–12 行的示例程序。',
            '扫描所有指令，标出 leader：第一条指令、每个跳转目标、每条跳转指令的下一条。',
            '按 leader 把指令序列切成基本块，块内保持原顺序；给每个块分配 id（B1、B2…）。',
            '为每个块连边：末尾是 goto 就连目标块；是条件跳转就连目标块与下一块；是 return 就不连；否则连顺序下一块。',
            '打印块号、指令列表与边表，人工对照示例程序检查：循环是否有回边、if 是否有两个出口。'
          ],
          starter: `# 输入示例（存在 sample.tac）
# L1: x = 1
#     if p goto L2
#     x = 3
#     goto L3
# L2: x = 2
# L3: y = x + 1
#     return y

def parse(lines):
    """返回 [(label, instr)]，label 可为 None。"""
    out = []
    for raw in lines:
        line = raw.strip()
        if not line or line.startswith('#'):
            continue
        label = None
        if ':' in line:
            label, line = line.split(':', 1)
            label, line = label.strip(), line.strip()
        out.append((label, line))
    return out

def leaders(instrs):
    """返回 leader 下标的集合。"""
    lead = {0}
    # TODO: 你的实现——跳转目标、跳转下一条
    return lead

def build_blocks(instrs):
    """返回 [{'id': 'B1', 'instrs': [...], 'succ': [...]}]。"""
    # TODO: 你的实现
    return []`,
          hints: [
            '先把「跳转目标」收集成一个 label → 下标的字典，再判断每条跳转的下一条是否越界；return 之后的代码不应有顺序边。',
            '条件跳转的行可能形如 if x > 0 goto L3，先用 split() 找 goto 与目标，不要把条件表达式当成目标。',
            '块内最后一条如果是 goto/if/return，记得它是终结指令；块内出现跳转说明切块切错了。'
          ],
          solution: `def leaders(instrs):
    labels = {}
    for i, (lab, _) in enumerate(instrs):
        if lab:
            labels[lab] = i
    lead = {0}
    for i, (_, ins) in enumerate(instrs):
        if ins.startswith('goto ') or ' goto ' in ins:
            target = ins.split('goto', 1)[1].strip()
            lead.add(labels[target])
            if i + 1 < len(instrs):
                lead.add(i + 1)
    return lead

def build_blocks(instrs):
    lead = sorted(leaders(instrs))
    blocks = []
    for k, start in enumerate(lead):
        end = lead[k + 1] if k + 1 < len(lead) else len(instrs)
        body = [ins for _, ins in instrs[start:end]]
        blocks.append({'id': 'B%d' % (k + 1), 'instrs': body, 'succ': []})
    # 连边：按块的最后一条指令判断
    for b in blocks:
        last = b['instrs'][-1]
        if last.startswith('return'):
            continue
        if last.startswith('goto '):
            b['succ'].append(label_to_block(last.split('goto', 1)[1].strip()))
        elif ' goto ' in last:
            b['succ'].append(label_to_block(last.split('goto', 1)[1].strip()))
            b['succ'].append(next_block(b))
        else:
            b['succ'].append(next_block(b))
    return blocks`
        },
        {
          n: 2,
          title: 'worklist 算到达定值',
          tasks: [
            '为每条指令提取 gen 与 kill：赋值 x = ... 生成「该指令的定值」，kill 掉所有对 x 的旧定值；其他指令 gen/kill 为空。',
            '按块合并 gen/kill：块内先出现的定值可能被后面的赋值 kill，注意顺序（先并 gen，再减去后续 kill）。',
            '实现 worklist：初始化所有块 OUT = gen（入口块 IN = ∅），把入口块入队；每次取出块，重算 IN = 前驱 OUT 的并集，OUT = gen ∪ (IN − kill)，若 OUT 变化则把后继入队。',
            '输出每个块的 IN/OUT，并用示例程序手工验算：循环体入口是否包含循环前的定值，循环内的重新定值是否 kill 了它。',
            '统计迭代次数，与「每轮扫所有块」的朴素算法对比，说明 worklist 省在哪里。'
          ],
          starter: `def transfer(block, IN):
    OUT = set(block['gen']) | (IN - set(block['kill']))
    return OUT

def reaching_defs(blocks):
    for b in blocks:
        b['IN'] = set()
        b['OUT'] = set(b['gen'])
    work = [blocks[0]]
    while work:
        b = work.pop(0)
        new_in = set()
        for p in preds(b):
            new_in |= p['OUT']
        new_out = transfer(b, new_in)
        if new_out != b['OUT']:
            b['OUT'] = new_out
            b['IN'] = new_in
            work.extend(b['succ'])
    return blocks`,
          hints: [
            '块的 gen 不能简单地把每条指令的 gen 并起来：如果块内先 x=1 后 x=2，x=1 在块出口已经不可用，应从 gen 中删掉。正确做法是顺序模拟，或记下「块内最后一次定值」。',
            'kill 是「块内所有定值的变量」对应到全程序所有定值的集合；不要只 kill 本块内的旧定值。',
            '循环里 worklist 可能多次处理同一个块；只要 OUT 单调增长且格有限，就一定会停。用迭代计数验证这一点。'
          ],
          solution: `def block_gen_kill(block, all_defs):
    gen, kill = set(), set()
    for ins in block['instrs']:
        if '=' in ins and not ins.startswith('if'):
            var = ins.split('=', 1)[0].strip()
            # 删除本块之前对同一变量的 gen
            gen = {d for d in gen if def_var(d) != var}
            gen.add(ins)
            kill |= {d for d in all_defs if def_var(d) == var and d != ins}
    return gen, kill

def reaching_defs(blocks):
    all_defs = [ins for b in blocks for ins in b['instrs'] if is_def(ins)]
    for b in blocks:
        b['gen'], b['kill'] = block_gen_kill(b, all_defs)
        b['IN'], b['OUT'] = set(), set(b['gen'])
    work = list(blocks)
    while work:
        b = work.pop(0)
        new_in = set().union(*[p['OUT'] for p in preds(b)]) if preds(b) else set()
        new_out = b['gen'] | (new_in - b['kill'])
        if new_out != b['OUT'] or new_in != b['IN']:
            b['IN'], b['OUT'] = new_in, new_out
            work.extend(b['succ'])
    return blocks`
        }
      ]
    },

    /* ================================================================ P2 */
    {
      id: 'P2',
      title: '符号执行小引擎 SymLite',
      en: 'SYMLITE',
      tagline: '用符号值跑一个只有整数与 if 的小语言，收集路径条件、报告除零反例。',
      level: '中级',
      minutes: 200,
      chapters: ['ch04', 'ch05'],
      goals: [
        '能把一个简单命令语言解析成 AST，并为每条路径维护符号状态与路径条件',
        '能实现分支分叉与路径条件合取，输出每条路径的 PC 与终止状态',
        '能对「除数可能为零」生成具体反例，或说明为什么无法判定',
        '能解释路径数量如何随分支增长，并实现至少一种剪枝或限界'
      ],
      intro: 'SymLite 不接 SMT 求解器，只处理整数常量、变量、加减乘与比较，因此可以用「区间/枚举小范围」代替真正的求解。' +
        '目标不是做一个能用的工具，而是把 ch05 的符号状态、路径条件、分支分叉、反例生成亲手实现一遍。' +
        '当你看到路径数从 2 变 4 再变 8，就会明白「路径爆炸」不是形容词。',
      milestones: [
        {
          n: 1,
          title: '解析与符号状态',
          tasks: [
            '定义语法：stmt ::= var = expr | if expr cmp expr { stmts } else { stmts } | assert(expr) | return expr；expr 支持整数、变量、+ - *。',
            '写递归下降解析器，产出 AST；为每个输入变量分配符号名（x0、x1…），其余变量用符号表达式表示。',
            '实现 eval(expr, state)：变量查 state，运算构造新的符号表达式（不要急着求值）。',
            '执行直线代码，打印每条路径结束时的 state 与 PC；先只测没有分支的程序，确认表达式构造正确。',
            '加一个 assert(y >= 0) 的例子，手工确认「PC ⇒ assert」在两条路径上都成立。'
          ],
          starter: `# AST 用元组表示：
# ('num', 3), ('var', 'x'), ('bin', '+', a, b)
# ('assign', 'y', expr), ('if', cond, then_stmts, else_stmts)
# ('assert', expr), ('return', expr)

class State:
    def __init__(self):
        self.env = {}      # 变量 -> 符号表达式
        self.pc = []       # 路径条件，字符串或结构化条件

    def copy(self):
        s = State()
        s.env = dict(self.env)
        s.pc = list(self.pc)
        return s

def eval_expr(e, st):
    if e[0] == 'num':
        return e[1]
    if e[0] == 'var':
        return st.env.get(e[1], e[1])
    if e[0] == 'bin':
        return ('bin', e[1], eval_expr(e[2], st), eval_expr(e[3], st))
    raise ValueError(e)`,
          hints: [
            '符号表达式不要用字符串拼接：字符串难以化简，也无法判断两个表达式是否相同。用嵌套元组/类，后续可以加 simplifier。',
            'if 的条件要先 eval 成符号表达式，再分别与 cond、neg(cond) 合取；不要在这一步求值，否则就退化成具体执行了。',
            '变量在赋值前要先查 env；未初始化的变量应报错，而不是默认成 0——后者会掩盖真实缺陷。'
          ],
          solution: `def eval_expr(e, st):
    if e[0] == 'num':
        return ('num', e[1])
    if e[0] == 'var':
        if e[1] not in st.env:
            raise ValueError('uninitialized: ' + e[1])
        return st.env[e[1]]
    if e[0] == 'bin':
        a, b = eval_expr(e[2], st), eval_expr(e[3], st)
        # 常量折叠：两个 num 直接算
        if a[0] == 'num' and b[0] == 'num':
            return ('num', apply_op(e[1], a[1], b[1]))
        return ('bin', e[1], a, b)

def exec_stmts(stmts, st, paths):
    for s in stmts:
        if s[0] == 'assign':
            st.env[s[1]] = eval_expr(s[2], st)
        elif s[0] == 'assert':
            paths.append(('assert', st.copy(), eval_expr(s[1], st)))
        elif s[0] == 'if':
            cond = eval_expr(s[1], st)
            t = st.copy(); t.pc.append(cond)
            e = st.copy(); e.pc.append(('not', cond))
            exec_stmts(s[2], t, paths)
            exec_stmts(s[3], e, paths)`
        },
        {
          n: 2,
          title: '路径探索与反例',
          tasks: [
            '实现一个「小范围具体化求解器」：对 PC 中的变量在其取值范围内枚举（如 -5..5），找一个满足所有条件的赋值。',
            '对每条路径检查 assert：若存在赋值使 PC 为真、断言为假，报告反例；若枚举完仍找不到，报告「在范围内未发现反例」，不要声称证明。',
            '加除零检查：遇到除法时若除数可能为 0（小范围枚举能找到），生成具体输入；把反例打印成「x=…, y=…」。',
            '对分支做限界：最多探索 K 条路径或深度 D，超出时报告「已截断」，并统计被截断的路径数。',
            '用三个程序测试：无分支、两层 if、带循环（手动展开 2 次），比较路径数与截断情况。'
          ],
          starter: `def concretize(pc, dom=range(-5, 6)):
    """枚举变量取值，返回第一个满足 PC 的赋值，或 None。"""
    vars_ = collect_vars(pc)
    # TODO: 笛卡尔积枚举；变量多时剪枝
    return None

def check_path(path, dom=range(-5, 6)):
    kind, st, expr = path
    # TODO: 找满足 st.pc 且让 expr 为假/零的赋值
    return None`,
          hints: [
            '变量多于 3 个时笛卡尔积会爆炸；先用区间传播把每个变量的范围缩小，再枚举，或者只枚举 PC 中出现的变量。',
            '「枚举不到反例」只说明在给定范围内没有，不是证明。报告里必须写清范围与路径是否被截断。',
            '循环要先做有限展开（比如把 while 展开 2 次），否则符号执行不会终止；展开次数与截断策略要在报告里说明。'
          ],
          solution: `def concretize(pc, dom=range(-5, 6)):
    vars_ = sorted(collect_vars(pc))
    for values in itertools.product(dom, repeat=len(vars_)):
        env = dict(zip(vars_, values))
        if all(eval_bool(c, env) for c in pc):
            return env
    return None

def check_path(path, dom=range(-5, 6)):
    kind, st, expr = path
    # 找 PC 为真、断言为假的赋值
    vars_ = sorted(collect_vars(st.pc + [expr]))
    for values in itertools.product(dom, repeat=len(vars_)):
        env = dict(zip(vars_, values))
        if all(eval_bool(c, env) for c in st.pc) and not eval_bool(expr, env):
            return env
    return None  # 范围内未发现反例，不等于证明`
        }
      ]
    },

    /* ================================================================ P3 */
    {
      id: 'P3',
      title: '测试约简与缺陷定位流水线',
      en: 'REDUCE & LOCALIZE',
      tagline: '从覆盖矩阵出发：ddmin 缩小失败输入，Ochiai 排可疑语句，最后写一份可复现的报告。',
      level: '综合',
      minutes: 240,
      chapters: ['ch06', 'ch07'],
      goals: [
        '能采集测试的通过/失败与语句覆盖，构造 ef/ep/nf/np 计数矩阵',
        '能实现 ddmin（或简化的 delta debugging），把失败输入缩到 1-minimal',
        '能用 Ochiai 排序可疑语句，并用 Exam score 评估定位效果',
        '能写一份包含复现步骤、可疑列表、验证方案与局限的缺陷报告'
      ],
      intro: '这个项目模拟真实团队的处理流程：拿到一个失败测试与一堆通过测试，先缩小输入，再定位可疑代码，最后给出修复与验证建议。' +
        '你可以用一个自己写的小程序（含 3–5 个已知 bug）作为被测对象，也可以构造一个「模拟覆盖矩阵」——重点是走通流程，而不是工具多强。' +
        '报告要能让另一个人照着复现，这是本项目最重要的交付物。',
      milestones: [
        {
          n: 1,
          title: '覆盖矩阵与 ddmin',
          tasks: [
            '准备被测程序与 6–10 个测试（至少 1 个失败），给每条可执行语句编号；用打印/插桩或手工记录每个测试覆盖的语句集合。',
            '构造矩阵：行是语句，列是测试，格子里是 0/1；另外记录每个测试的通过/失败。',
            '实现 ddmin：输入是一个失败输入（字符或片段列表）与一个「仍然失败」的判定函数，输出 1-minimal 的失败输入；打印每次划分与删除决策。',
            '用 ddmin 缩小失败输入，记录缩小前后的长度与测试次数；若失败不具单调性（删掉某段后不再失败），在报告里说明。',
            '验证 ddmin 的输出：删掉任意单个片段后，失败确实不再出现。'
          ],
          starter: `def ddmin(items, fails):
    """items: 片段列表；fails: 接受子列表、返回是否仍失败。"""
    n = 2
    while len(items) >= 2:
        chunks = split(items, n)
        reduced = False
        for chunk in chunks:
            if fails(chunk):
                items = chunk
                n = 2
                reduced = True
                break
            complement = [x for x in items if x not in chunk]
            if fails(complement):
                items = complement
                n = max(n - 1, 2)
                reduced = True
                break
        if not reduced:
            if n >= len(items):
                break
            n = min(n * 2, len(items))
    return items`,
          hints: [
            '先试「单份」再试「补集」：单份失败说明失败条件集中在这一份，直接缩；补集失败说明删掉这一份不影响失败。',
            '用列表下标而不是值来判断片段，避免重复值导致补集算错；split 要尽量均分，最后一份可以短。',
            'fails 函数要每次重新跑被测程序，不能缓存「上次失败」的结论；ddmin 的正确性依赖每次真实判定。'
          ],
          solution: `def ddmin(items, fails):
    n = 2
    while len(items) >= 2:
        chunks = [items[i::n] for i in range(n)]
        reduced = False
        for chunk in chunks:
            if fails(chunk):
                items, n, reduced = chunk, 2, True
                break
            comp = [x for x in items if x not in chunk]
            if comp and fails(comp):
                items, n, reduced = comp, max(n - 1, 2), True
                break
        if not reduced:
            if n >= len(items):
                break
            n = min(n * 2, len(items))
    return items  # 1-minimal：删任何一个片段都不再失败`
        },
        {
          n: 2,
          title: 'Ochiai 定位与评估',
          tasks: [
            '从覆盖矩阵统计每条语句的 ef、ep、nf、np；注意「覆盖」是测试执行到该语句，不是「该语句在源码中出现」。',
            '实现 Ochiai 公式并按可疑度降序排序；并列时按语句编号升序，保证结果可复现。',
            '计算 Exam score：真正缺陷语句在排序中的位置（从 1 开始）；若前 5 名没有缺陷，记录实际名次。',
            '换用 Tarantula 或 Jaccard 再排一次，比较两者在前 5 名上的差异，并解释差异来源。',
            '输出一张表：排名、语句、ef、ep、Ochiai、是否真正缺陷；把结果写进报告。'
          ],
          starter: `import math

def ochiai(ef, ep, total_failed):
    denom = math.sqrt(total_failed * (ef + ep))
    return ef / denom if denom else 0.0

def rank(matrix, failed):
    """matrix: {stmt: set(test_id)}；failed: set(test_id)。"""
    total_failed = len(failed)
    rows = []
    for stmt, tests in matrix.items():
        ef = len(tests & failed)
        ep = len(tests - failed)
        rows.append((stmt, ef, ep, ochiai(ef, ep, total_failed)))
    rows.sort(key=lambda r: (-r[3], r[0]))
    return rows`,
          hints: [
            'total_failed 是失败测试总数，不是「覆盖该语句的失败测试数」；Ochiai 的分母用 total_failed × (ef+ep)，不要漏乘。',
            '若某条语句没有被任何失败测试覆盖（ef=0），Ochiai 为 0；它仍可能出现在列表底部，不要提前过滤，否则 Exam score 会失真。',
            '评估时要用「已知缺陷语句」作为 ground truth；如果你自己写的被测程序没有标注缺陷，先标注再跑，避免事后挑一个「看起来像」的。'
          ],
          solution: `def ochiai(ef, ep, total_failed):
    denom = math.sqrt(total_failed * (ef + ep))
    return ef / denom if denom else 0.0

def rank(matrix, failed, truth):
    total_failed = len(failed)
    rows = []
    for stmt, tests in matrix.items():
        ef = len(tests & failed)
        ep = len(tests - failed)
        rows.append({'stmt': stmt, 'ef': ef, 'ep': ep,
                     'score': ochiai(ef, ep, total_failed),
                     'bug': stmt in truth})
    rows.sort(key=lambda r: (-r['score'], r['stmt']))
    for i, r in enumerate(rows, 1):
        r['exam'] = i if r['bug'] else None
    return rows`
        },
        {
          n: 3,
          title: '报告与验证方案',
          tasks: [
            '写一份 1–2 页的报告：环境与版本、失败现象、缩小后的输入、覆盖矩阵摘要、可疑度前 5 名、Exam score。',
            '给出修复建议：改哪一行、为什么这样改能修根因而不是绕开症状；附上补丁 diff。',
            '设计验证方案：原失败用例、边界用例、全量回归，以及至少一种「防过拟合」检查（留出测试或变异测试）。',
            '列出至少两条局限：覆盖采集方式、测试数量、失败单调性、Ochiai 假设等，说明结论在什么范围内可信。',
            '让一位同学按报告复现；记录他卡住的步骤，据此改进报告。'
          ],
          starter: `# report.md 骨架
## 1. 现象与复现
- 命令：
- 期望：
- 实际：

## 2. 输入缩小
- 原始长度：
- ddmin 后：
- 测试次数：

## 3. 定位
| 排名 | 语句 | ef | ep | Ochiai | 缺陷？ |
|---|---|---|---|---|---|

## 4. 修复与验证
- 补丁：
- 验证：

## 5. 局限`,
          hints: [
            '报告里每个数字都要能追溯：覆盖矩阵、ef/ep、Ochiai 值至少给一个手算校验，避免公式抄错。',
            '「修复建议」要区分症状与根因：如果只加一个 if 让测试变绿，要在报告里说明这是缓解而非根治。',
            '验证方案里的「留出测试」不能参与定位与补丁生成，否则防过拟合就失去意义；在报告里写清哪些测试被留出。'
          ],
          solution: `# 报告的核心不是格式，而是可复现：
# 1) 每条命令都能直接粘贴运行；
# 2) 每个数字都有来源（矩阵/公式/手算）；
# 3) 修复建议指明根因，验证方案覆盖失败、边界、回归与防过拟合；
# 4) 局限写清楚：测试少、覆盖靠插桩、ddmin 假设单调性、Ochiai 只利用覆盖。
# 满足这四点，即使工具很简单，报告也是合格的。`
        }
      ]
    }
  ]);
})();
