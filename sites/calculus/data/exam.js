/* =====================================================================
 * data/exam.js · Calculus I 模拟卷（两套）
 * 对齐：CUHK-Shenzhen · Calculus I · AY2026-27 Term 1 · L10
 *       教材 Thomas' Calculus 14e (SI)；真实考核：Quizzes 25% / Midterm 25% / Final 40%
 *
 *  A 卷「期中模拟」：10 题 / 100 分 / 120 分钟
 *    覆盖 §2.1–5.1；分值分布：Ch2 极限与连续 20 · Ch3 导数 30 ·
 *    Ch4 导数的应用 30 · §5.1 面积估算 10 · 概念与证明 10
 *    题型：判断 8 + 选择 21 + 填空 65 + 简答/证明 6
 *
 *  B 卷「期末模拟」：12 题 / 100 分 / 150 分钟
 *    覆盖 §5.2–8.8 + §16.1–16.4；分值分布：Ch5 定积分与 FTC 20 ·
 *    Ch6 定积分应用 15 · Ch7 超越函数 15 · Ch8 积分技术 25 ·
 *    Ch16 一阶微分方程 15 · 概念与证明 10
 *    题型：判断 4 + 选择 6 + 填空 80 + 简答/证明 10
 *
 * 结构：{ id, title, style, subtitle, date, minutes, totalScore, summary,
 *         instructions, questions:[…] }
 *       question.parts[] 是判分单位：kind = choice | tf | fill | keywords
 *       （choice/tf 用 options[].correct 标记；fill 用 answer/accept；
 *        keywords 按 keywords[] 命中比例给部分分）
 * 注入：CSC.registerExam({...})；另挂 CSC._exams 供引擎加载时读取
 * 备注：模拟卷引擎会在「开始作答 / 交卷 / 重做」时就地重绘 DOM（不经过
 *       app.js 的 setContent），因此文末的 MathBridge 监听 #content 的结构
 *       变化，把动态插入的公式重新交给 MathJax 排版。
 * ===================================================================== */
(function () {
  'use strict';

  /* ================================================================ A 卷 */
  var A = {
    id: 'mat1001-midterm',
    title: '期中模拟',
    style: 'A · MIDTERM',
    subtitle: 'CUHK-Shenzhen Calculus I · AY2026-27 Term 1 (L10) · 闭卷限时模拟',
    date: '期中范围 §2.1–5.1 · Thomas 14e (SI)',
    minutes: 120,
    totalScore: 100,
    summary: '按真实期中权重配分的 A 卷：<b>Ch2 极限与连续 20 分</b> · <b>Ch3 导数 30 分</b> · <b>Ch4 导数的应用 30 分</b> · <b>§5.1 面积估算 10 分</b> · <b>概念与证明 10 分</b>。题目偏重定义与概念的严谨使用（极限存在 vs 连续、导数定义、中值定理的条件），而不是机械套公式。',
    instructions: [
      '闭卷、限时 <b>120 分钟</b>，满分 100 分。点击「开始作答」后计时立即开始，刷新页面不会停止计时。',
      '数学公式全部用 <code>$...$</code>（行内）或 <code>$$...$$</code>（独立）书写；题目中的公式由 MathJax 渲染。',
      '填空题只填<b>最终结果</b>，请写<b>精确值</b>（如 <code>3/2</code>、<code>-9/4</code>、<code>\\frac{3}{2}</code>），不要写四舍五入的小数。',
      '选择题、判断题直接点选；简答/证明题按关键步骤给部分分，请分步写清楚（写出定理名称、等式和结论）。',
      '交卷后可以查看逐题解析与参考答案，成绩保存在本地浏览器，可反复重做。'
    ],
    questions: [
      /* ---------------- Q1 · Ch2 概念判断（tf 8 分） ---------------- */
      {
        no: 1, points: 8, type: '概念判断',
        intro: '判断下列说法是否正确。本卷只按判断结果计分，但考试时请用定义或定理说明理由（理由见解析）。',
        parts: [
          {
            label: '(a)', points: 2, kind: 'tf',
            prompt: '若 $\\lim_{x\\to c}f(x)=L$，则 $f$ 必须在 $x=c$ 处有定义。',
            options: [{ text: 'True (T)' }, { text: 'False (F)', correct: true }],
            explain: '错。<b>极限只关心 $x\\to c$（即 $x\\neq c$）时函数值的变化趋势</b>，与 $f(c)$ 是否存在无关。反例：$f(x)=\\frac{x^2-1}{x-1}$ 在 $x=1$ 处无定义，但 $\\lim_{x\\to1}f(x)=\\lim_{x\\to1}(x+1)=2$。易错点：把「极限存在」与「连续」混为一谈——连续要求 $f(c)$ 有定义、极限存在、且 $\\lim_{x\\to c}f(x)=f(c)$ 三者同时成立。'
          },
          {
            label: '(b)', points: 2, kind: 'tf',
            prompt: '若 $f$ 在 $x=c$ 处连续且 $f(c)&gt;0$，则存在 $\\delta&gt;0$，使得当 $|x-c|&lt;\\delta$ 时恒有 $f(x)&gt;0$。',
            options: [{ text: 'True (T)', correct: true }, { text: 'False (F)' }],
            explain: '对。这是连续性的<b>保号性</b>。取 $\\varepsilon=\\frac{f(c)}2&gt;0$，由连续性存在 $\\delta&gt;0$，使 $0&lt;|x-c|&lt;\\delta$ 时 $|f(x)-f(c)|&lt;\\frac{f(c)}2$，于是 $f(x)&gt;f(c)-\\frac{f(c)}2=\\frac{f(c)}2&gt;0$。易错点：前提 $f(c)\\neq0$ 不能省；若 $f(c)=0$（如 $f(x)=x$ 在 $c=0$），函数会在 $c$ 两侧变号。'
          },
          {
            label: '(c)', points: 2, kind: 'tf',
            prompt: '若 $f$ 在 $x=c$ 处有可去间断点，则 $\\lim_{x\\to c}f(x)$ 存在。',
            options: [{ text: 'True (T)', correct: true }, { text: 'False (F)' }],
            explain: '对。<b>可去间断点的定义</b>就是：$\\lim_{x\\to c}f(x)$ 存在，但不等于 $f(c)$（或 $f(c)$ 无定义）。例：$f(x)=\\frac{\\sin x}{x}\\ (x\\neq0)$，$f(0)=0$，此时 $\\lim_{x\\to0}f(x)=1\\neq f(0)$，$x=0$ 是可去间断点。对比：跳跃间断点是左右极限都存在但不相等，整体极限不存在。'
          },
          {
            label: '(d)', points: 2, kind: 'tf',
            prompt: '若 $f$ 在 $[a,b]$ 上连续且 $f(a)f(b)&lt;0$，则方程 $f(x)=0$ 在 $(a,b)$ 内恰有一个实根。',
            options: [{ text: 'True (T)' }, { text: 'False (F)', correct: true }],
            explain: '错。<b>介值定理只保证「至少一个」根，不能保证「恰有一个」</b>。反例：$f(x)=x^3-x$ 在 $[-2,2]$ 上连续，$f(-2)=-6&lt;0$、$f(2)=6&gt;0$，但区间内有三个根 $x=-1,0,1$。要得到唯一性还需要单调性（例如 $f\'(x)&gt;0$ 在 $(a,b)$ 上恒成立），这正是第 4 章中值定理与单调性讨论的内容。'
          }
        ]
      },

      /* ---------------- Q2 · Ch2 极限计算（choice 4 + fill 8） ---------------- */
      {
        no: 2, points: 12, type: '极限计算',
        intro: '计算下列极限。注意 $x\\to\\infty$ 与 $x\\to-\\infty$ 时 $\\sqrt{x^2}=|x|$ 的符号差异。',
        parts: [
          {
            label: '(a)', points: 4, kind: 'choice',
            prompt: '$\\lim_{x\\to0}\\frac{\\tan x-\\sin x}{x^3}=$',
            options: [
              { text: '$\\frac12$', correct: true },
              { text: '$\\frac16$' },
              { text: '$\\frac13$' },
              { text: '$0$' }
            ],
            explain: '答案 $\\frac12$。<b>方法一（三角变形）</b>：$\\tan x-\\sin x=\\sin x\\left(\\frac1{\\cos x}-1\\right)=\\sin x\\cdot\\frac{1-\\cos x}{\\cos x}$，于是原式 $=\\frac{\\sin x}{x}\\cdot\\frac{1-\\cos x}{x^2}\\cdot\\frac1{\\cos x}\\to 1\\cdot\\frac12\\cdot1=\\frac12$。<b>方法二（泰勒）</b>：$\\tan x=x+\\frac{x^3}3+\\cdots$，$\\sin x=x-\\frac{x^3}6+\\cdots$，相减得 $\\frac{x^3}2$。易错点：把 $\\tan x-\\sin x$ 拆成 $x-x=0$ 再用等价无穷小分别替换——加减法中不能随意做等价替换（会丢阶）。'
          },
          {
            label: '(b)', points: 4, kind: 'fill',
            prompt: '$\\lim_{x\\to\\infty}\\left(\\sqrt{x^2+3x}-x\\right)=$',
            answer: '3/2',
            accept: ['3/2', '1.5', '\\frac{3}{2}', '1.50'],
            placeholder: '填精确值，如 3/2',
            explain: '答案 $\\frac32$。有理化：$$\\sqrt{x^2+3x}-x=\\frac{(x^2+3x)-x^2}{\\sqrt{x^2+3x}+x}=\\frac{3x}{x\\sqrt{1+\\frac3x}+x}=\\frac{3}{\\sqrt{1+\\frac3x}+1}\\to\\frac32.$$ 易错点：直接写 $\\sqrt{x^2+3x}\\approx x$ 会得到 0，丢掉了 $\\frac{3x}{2x}$ 这一阶信息；这类「$\\infty-\\infty$」型必须有理化、通分或提取主项。'
          },
          {
            label: '(c)', points: 4, kind: 'fill',
            prompt: '$\\lim_{x\\to-\\infty}\\frac{\\sqrt{x^2+x}}{x}=$',
            answer: '-1',
            accept: ['-1', '−1', '− 1', '-1.0'],
            placeholder: '填精确值',
            explain: '答案 $-1$。关键在于 $x&lt;0$ 时 $\\sqrt{x^2}=|x|=-x$：$$\\sqrt{x^2+x}=\\sqrt{x^2\\left(1+\\frac1x\\right)}=|x|\\sqrt{1+\\frac1x}=-x\\sqrt{1+\\frac1x},$$ 除以 $x$ 得 $-\\sqrt{1+\\frac1x}\\to-1$。易错点：误写成 $+1$（默认 $\\sqrt{x^2}=x$）；$x\\to-\\infty$ 时绝对值开方必须带负号，这是极限题最常见的符号陷阱。'
          }
        ]
      },

      /* ---------------- Q3 · Ch3 导数定义（fill 6 + choice 6） ---------------- */
      {
        no: 3, points: 12, type: '导数定义',
        intro: '本题研究「导数存在但导函数不连续」这一经典现象。设 $$g(x)=\\begin{cases}x^2\\sin\\frac1x, &amp; x\\neq0,\\\\[2pt] 0, &amp; x=0.\\end{cases}$$',
        parts: [
          {
            label: '(a)', points: 6, kind: 'fill',
            prompt: '用<b>导数的定义</b>计算 $g\'(0)$（提示：写出差商并用夹逼定理）。',
            answer: '0',
            accept: ['0', '0.0'],
            placeholder: '填数值',
            explain: '答案 $0$。$$g\'(0)=\\lim_{h\\to0}\\frac{g(h)-g(0)}{h}=\\lim_{h\\to0}\\frac{h^2\\sin\\frac1h}{h}=\\lim_{h\\to0}h\\sin\\frac1h=0,$$ 因为 $0\\le\\left|h\\sin\\frac1h\\right|\\le|h|\\to0$（夹逼定理）。易错点：直接对 $x^2\\sin\\frac1x$ 求导再代 $x=0$——求导公式只在 $x\\neq0$ 成立，分段点处<b>必须回到导数定义</b>。'
          },
          {
            label: '(b)', points: 6, kind: 'choice',
            prompt: '关于 $g\'$ 在 $x=0$ 处的连续性，正确的结论是：',
            options: [
              { text: '$g\'$ 在 $x=0$ 处连续' },
              { text: '$g\'$ 在 $x=0$ 处存在，但在 $x=0$ 处不连续', correct: true },
              { text: '$g\'$ 在 $x=0$ 处不存在' },
              { text: '$g\'$ 在 $x=0$ 处连续当且仅当 $g\'(0)=1$' }
            ],
            explain: '答案 B。对 $x\\neq0$ 用乘积法则与链式法则：$$g\'(x)=2x\\sin\\frac1x+x^2\\cos\\frac1x\\cdot\\left(-\\frac1{x^2}\\right)=2x\\sin\\frac1x-\\cos\\frac1x.$$ 当 $x\\to0$ 时 $2x\\sin\\frac1x\\to0$，但 $\\cos\\frac1x$ 在 $-1$ 与 $1$ 之间无限次振荡、没有极限，所以 $\\lim_{x\\to0}g\'(x)$ 不存在，$g\'$ 在 $0$ 处不连续。结论：<b>函数可导，导函数不一定连续</b>；这也是分段函数在分段点「不能直接套求导公式」的原因。'
          }
        ]
      },

      /* ---------------- Q4 · Ch3 求导技术（fill 10） ---------------- */
      {
        no: 4, points: 10, type: '求导技术',
        intro: '计算下列导数（隐函数求导与商法则/链式法则）。',
        parts: [
          {
            label: '(a)', points: 5, kind: 'fill',
            prompt: '曲线 $x^3+y^3=6xy$（笛卡尔叶形线）在点 $(3,3)$ 处的切线斜率 $\\frac{dy}{dx}=$',
            answer: '-1',
            accept: ['-1', '−1', '-1.0', '− 1'],
            placeholder: '填数值',
            explain: '答案 $-1$。两边对 $x$ 求导（把 $y$ 看成 $x$ 的函数）：$$3x^2+3y^2y\'=6y+6xy\',$$ 解出 $$y\'=\\frac{6y-3x^2}{3y^2-6x}=\\frac{2y-x^2}{y^2-2x}.$$ 代入 $(3,3)$：$y\'=\\frac{6-9}{9-6}=-1$。（先验证 $(3,3)$ 在曲线上：$27+27=54=6\\cdot3\\cdot3$ ✓。）易错点：忘记 $y^3$ 求导时要乘 $y\'$，或把 $6xy$ 的导数漏写成 $6y$。'
          },
          {
            label: '(b)', points: 5, kind: 'fill',
            prompt: '设 $f(x)=\\frac{\\sin 3x}{1+x^2}$，则 $f\'(0)=$',
            answer: '3',
            accept: ['3', '3.0'],
            placeholder: '填数值',
            explain: '答案 $3$。商法则：$$f\'(x)=\\frac{3\\cos 3x\\,(1+x^2)-\\sin 3x\\cdot 2x}{(1+x^2)^2}.$$ 代入 $x=0$：$f\'(0)=\\frac{3\\cdot1\\cdot1-0}{1^2}=3$。易错点：$\\sin 3x$ 求导时漏乘内层因子 3（链式法则）；$1+x^2$ 的导数 $2x$ 在 $x=0$ 处为 0，所以第二项整块消失。'
          }
        ]
      },

      /* ---------------- Q5 · Ch3 相关变化率与线性化（fill 4 + choice 4） ---------------- */
      {
        no: 5, points: 8, type: '变化率与线性化',
        intro: '§3.8 相关变化率与 §3.9 线性化。',
        parts: [
          {
            label: '(a)', points: 4, kind: 'fill',
            prompt: '一架长 $10$ ft 的梯子斜靠在竖直墙面上。当梯子底端离墙 $6$ ft 时，底端以 $2$ ft/s 的速度沿地面向外滑动。此时梯子顶端沿墙面<b>下滑的速度</b>为（填大小，正数）',
            answer: '3/2',
            accept: ['3/2', '1.5', '\\frac{3}{2}', '1.50'],
            placeholder: '填精确值，如 3/2',
            explain: '答案 $\\frac32$ ft/s。设底端到墙距离为 $x$、顶端高度为 $y$，则 $x^2+y^2=10^2$。$x=6$ 时 $y=\\sqrt{100-36}=8$。两边对时间 $t$ 求导：$2x\\dot x+2y\\dot y=0$，故 $\\dot y=-\\frac{x\\dot x}{y}=-\\frac{6\\cdot2}{8}=-\\frac32$，负号表示高度在减小，下滑速度大小为 $\\frac32$ ft/s。易错点：先代 $x=6$ 再求导（会丢掉 $x,y$ 的联动关系）；或忘记负号的含义。'
          },
          {
            label: '(b)', points: 4, kind: 'choice',
            prompt: '用线性化（线性近似）估计 $\\sqrt[3]{27.5}$，下列结果最接近的是：',
            options: [
              { text: '$3+\\frac1{54}$', correct: true },
              { text: '$3+\\frac1{18}$' },
              { text: '$3+\\frac1{27}$' },
              { text: '$3+\\frac1{6}$' }
            ],
            explain: '答案 A。取 $f(x)=x^{1/3}$、$a=27$：$f(27)=3$，$f\'(x)=\\frac13x^{-2/3}$，$f\'(27)=\\frac13\\cdot\\frac19=\\frac1{27}$。于是 $$L(x)=f(a)+f\'(a)(x-a)=3+\\frac1{27}(x-27),\\qquad L(27.5)=3+\\frac{0.5}{27}=3+\\frac1{54}\\approx3.0185.$$ 易错点：把 $f\'(27)=\\frac1{27}$ 当答案，忘记乘以 $\\Delta x=0.5$；实际增量是 $\\frac12\\cdot\\frac1{27}=\\frac1{54}$。'
          }
        ]
      },

      /* ---------------- Q6 · Ch4 中值定理与最值（choice 4 + fill 6） ---------------- */
      {
        no: 6, points: 10, type: '中值定理与最值',
        intro: '§4.1–4.3：极值、中值定理与单调性。',
        parts: [
          {
            label: '(a)', points: 4, kind: 'choice',
            prompt: '对函数 $f(x)=\\frac1x$ 在区间 $[-1,1]$ 上，拉格朗日中值定理（MVT）能否使用？',
            options: [
              { text: '不能，因为 $f$ 在 $[-1,1]$ 上不连续（在 $x=0$ 处无定义），定理条件不满足', correct: true },
              { text: '能，因为 $f$ 在 $(-1,1)$ 上可导' },
              { text: '能，因为 $f(-1)=f(1)$' },
              { text: '不能，因为 $f\'$ 在 $(-1,1)$ 内恒不为零' }
            ],
            explain: '答案 A。MVT 需要 $f$ 在<b>闭区间</b> $[a,b]$ 上连续、在<b>开区间</b> $(a,b)$ 内可导；$\\frac1x$ 在 $x=0$ 无定义，闭区间上不连续，前提不成立。反过来说：若硬套公式，$\\frac{f(1)-f(-1)}{2}=\\frac{1-(-1)}2=1$，而 $f\'(x)=-\\frac1{x^2}&lt;0$ 在 $(-1,1)\\setminus\\{0\\}$ 上恒成立，方程 $f\'(c)=1$ 无解——这正是定理条件不满足的体现。易错点：只检查「可导」而忽略「闭区间连续」。'
          },
          {
            label: '(b)', points: 3, kind: 'fill',
            prompt: '设 $f(x)=x^2-2x$。MVT 在区间 $[0,3]$ 上保证的中间点 $c=$',
            answer: '3/2',
            accept: ['3/2', '1.5', '\\frac{3}{2}', '1.50'],
            placeholder: '填精确值',
            explain: '答案 $\\frac32$。割线斜率 $\\frac{f(3)-f(0)}{3-0}=\\frac{3-0}{3}=1$；又 $f\'(x)=2x-2$，令 $2c-2=1$ 得 $c=\\frac32\\in(0,3)$ ✓。易错点：把 $c$ 算成区间中点或端点；忘记检验 $c$ 是否落在开区间内。'
          },
          {
            label: '(c)', points: 3, kind: 'fill',
            prompt: '函数 $f(x)=x+\\frac4x$（$x&gt;0$）的最小值为',
            answer: '4',
            accept: ['4', '4.0'],
            placeholder: '填数值',
            explain: '答案 $4$。<b>方法一（求导）</b>：$f\'(x)=1-\\frac4{x^2}=0\\Rightarrow x=2$（$x&gt;0$）；$f\'\'(2)=\\frac8{2^3}=1&gt;0$，故 $x=2$ 是极小值点，也是最小值点，$f(2)=2+2=4$。<b>方法二（AM-GM）</b>：$x+\\frac4x\\ge2\\sqrt{x\\cdot\\frac4x}=4$，等号当且仅当 $x=2$。易错点：忽略定义域 $x&gt;0$；或忘记检查 $x\\to0^+$、$x\\to\\infty$ 时 $f\\to\\infty$（否则不能断言最小值）。'
          }
        ]
      },

      /* ---------------- Q7 · Ch4 图像分析（fill 10） ---------------- */
      {
        no: 7, points: 10, type: '图像分析',
        intro: '§4.4：凹凸性、拐点与渐近线。',
        parts: [
          {
            label: '(a)', points: 5, kind: 'fill',
            prompt: '曲线 $y=x^3-3x^2+2$ 的拐点的横坐标 $x=$',
            answer: '1',
            accept: ['1', '1.0'],
            placeholder: '填数值',
            explain: '答案 $x=1$。$y\'=3x^2-6x$，$y\'\'=6x-6$。令 $y\'\'=0$ 得 $x=1$；且 $x&lt;1$ 时 $y\'\'&lt;0$（上凸 / concave down），$x&gt;1$ 时 $y\'\'&gt;0$（下凸 / concave up），凹凸性改变，故 $x=1$ 是拐点横坐标（拐点为 $(1,0)$）。易错点：把 $y\'=0$ 的点 $x=0,2$（极值点）误当作拐点；拐点看的是 $y\'\'$ 变号，不是 $y\'=0$。'
          },
          {
            label: '(b)', points: 5, kind: 'fill',
            prompt: '曲线 $y=\\frac{3x^2+5}{x^2-4}$ 的水平渐近线为 $y=$',
            answer: '3',
            accept: ['3', '3.0', 'y=3', 'y = 3'],
            placeholder: '填数值 y=… 中的数',
            explain: '答案 $y=3$。$$\\lim_{x\\to\\pm\\infty}\\frac{3x^2+5}{x^2-4}=\\lim_{x\\to\\pm\\infty}\\frac{3+5/x^2}{1-4/x^2}=3,$$ 故水平渐近线为 $y=3$。另注意分母零点 $x=\\pm2$ 处分子 $=17\\neq0$，故 $x=\\pm2$ 是竖直渐近线。易错点：只比较一次项系数；或漏看分母零点处的竖直渐近线。'
          }
        ]
      },

      /* ---------------- Q8 · Ch4 洛必达与最优化（fill 10） ---------------- */
      {
        no: 8, points: 10, type: '洛必达与最优化',
        intro: '§4.5 洛必达法则与 §4.6 应用最优化。',
        parts: [
          {
            label: '(a)', points: 5, kind: 'fill',
            prompt: '$\\lim_{x\\to0}\\left(\\frac1{x^2}-\\frac1{x\\sin x}\\right)=$',
            answer: '-1/6',
            accept: ['-1/6', '−1/6', '\\frac{-1}{6}', '-\\frac{1}{6}', '−\\frac{1}{6}'],
            placeholder: '填精确值，如 -1/6',
            explain: '答案 $-\\frac16$。<b>先通分</b>：$\\frac1{x^2}-\\frac1{x\\sin x}=\\frac{\\sin x-x}{x^2\\sin x}$，这是 $\\frac00$ 型。<b>泰勒</b>：$\\sin x-x=-\\frac{x^3}6+\\frac{x^5}{120}-\\cdots$，$x^2\\sin x=x^3+\\cdots$，故极限 $=\\lim\\frac{-x^3/6+\\cdots}{x^3+\\cdots}=-\\frac16$。<b>洛必达</b>：原式 $\\to\\frac{\\cos x-1}{2x\\sin x+x^2\\cos x}\\to\\frac{-x^2/2}{3x^2}=-\\frac16$。易错点：把 $\\frac1{x^2}-\\frac1{x\\sin x}$ 直接当作 $\\frac1{x^2}-\\frac1{x^2}=0$——两项各自发散，必须先通分。'
          },
          {
            label: '(b)', points: 5, kind: 'fill',
            prompt: '把矩形的一边放在直径为 $4$ 的半圆的直径上、另外两个顶点落在半圆上，求该矩形的最大面积。',
            answer: '4',
            accept: ['4', '4.0'],
            placeholder: '填数值',
            explain: '答案 $4$。设矩形在直径上的半宽为 $x$（$0&lt;x&lt;2$），高 $h=\\sqrt{4-x^2}$，面积 $A(x)=2x\\sqrt{4-x^2}$。最大化 $A^2=4x^2(4-x^2)$：令 $u=x^2$，$4u(4-u)$ 在 $u=2$ 取最大，$A^2_{\\max}=4\\cdot2\\cdot2=16$，故 $A_{\\max}=4$。求导法：$A\'(x)=\\frac{8-4x^2}{\\sqrt{4-x^2}}=0\\Rightarrow x=\\sqrt2$，$A(\\sqrt2)=2\\sqrt2\\cdot\\sqrt2=4$。易错点：把「半宽 $x$」与「整条底边 $2x$」搞混；或忘记检查端点 $x\\to0,2$ 时面积趋于 0。'
          }
        ]
      },

      /* ---------------- Q9 · §5.1 面积估算（fill 7 + choice 3） ---------------- */
      {
        no: 9, points: 10, type: '面积估算',
        intro: '§5.1：有限和、右端点和与面积。设 $f(x)=x^2$，在 $[0,2]$ 上把区间 $n$ 等分，$\\Delta x=\\frac2n$，$c_k$ 取第 $k$ 个子区间的右端点，$R_n=\\sum_{k=1}^{n}f(c_k)\\Delta x$。',
        parts: [
          {
            label: '(a)', points: 4, kind: 'fill',
            prompt: '取 $n=4$，求右端点和 $R_4=$',
            answer: '15/4',
            accept: ['15/4', '3.75', '\\frac{15}{4}'],
            placeholder: '填精确值，如 15/4',
            explain: '答案 $\\frac{15}4=3.75$。$\\Delta x=\\frac{2-0}4=\\frac12$，右端点 $c_k=\\frac k2$（$k=1,2,3,4$）：$$R_4=\\sum_{k=1}^4\\left(\\frac k2\\right)^2\\cdot\\frac12=\\frac12\\left(\\frac14+1+\\frac94+4\\right)=\\frac12\\cdot\\frac{15}2=\\frac{15}4.$$ 易错点：右端点从 $k=1$ 开始（不是 $k=0$）；$\\Delta x$ 别漏乘；$c_k=\\frac k2$ 而不是 $k$。'
          },
          {
            label: '(b)', points: 3, kind: 'fill',
            prompt: '求极限 $\\lim_{n\\to\\infty}R_n=$',
            answer: '8/3',
            accept: ['8/3', '\\frac{8}{3}'],
            placeholder: '填精确值，如 8/3',
            explain: '答案 $\\frac83$。$$R_n=\\sum_{k=1}^n\\left(\\frac{2k}n\\right)^2\\frac2n=\\frac8{n^3}\\sum_{k=1}^nk^2=\\frac8{n^3}\\cdot\\frac{n(n+1)(2n+1)}6=\\frac{4(n+1)(2n+1)}{3n^2}\\to\\frac83.$$ 这个极限就是曲线 $y=x^2$ 在 $[0,2]$ 上与 $x$ 轴围成的面积（下一节会把它记作 $\\int_0^2x^2\\,dx$）。易错点：$\\sum k^2$ 公式记错；或以为答案还依赖 $n$。'
          },
          {
            label: '(c)', points: 3, kind: 'choice',
            prompt: '设 $f$ 在 $[a,b]$ 上连续且单调递增，$L_n$、$R_n$ 分别为 $n$ 等分的左、右端点和，$A$ 为曲线下方区域的面积。下列关系正确的是：',
            options: [
              { text: '$L_n\\le A\\le R_n$', correct: true },
              { text: '$R_n\\le A\\le L_n$' },
              { text: '$L_n=R_n$ 对一切 $n$ 成立' },
              { text: '$A\\le L_n\\le R_n$' }
            ],
            explain: '答案 A。递增函数在每个子区间 $[x_{k-1},x_k]$ 上，左端点给出最小值、右端点给出最大值，因此 $$f(x_{k-1})\\Delta x\\le\\int_{x_{k-1}}^{x_k}f(x)\\,dx\\le f(x_k)\\Delta x.$$ 对 $k$ 求和即得 $L_n\\le A\\le R_n$（递减函数不等号反向）。易错点：只记住「左端点偏小、右端点偏大」，却没把它与面积被夹住的关系联系起来；对递减函数，$R_n$ 才是下界。'
          }
        ]
      },

      /* ---------------- Q10 · 概念与证明（fill 4 + keywords 6） ---------------- */
      {
        no: 10, points: 10, type: '概念与证明',
        intro: '设函数 $f$ 在 $[0,2]$ 上连续、在 $(0,2)$ 内可导，且 $f(0)=1$，对一切 $x\\in(0,2)$ 有 $f\'(x)\\le3$。',
        parts: [
          {
            label: '(a)', points: 4, kind: 'fill',
            prompt: '$f(2)$ 的最大可能值为',
            answer: '7',
            accept: ['7', '7.0'],
            placeholder: '填数值',
            explain: '答案 $7$。由 MVT，存在 $c\\in(0,2)$ 使 $f(2)-f(0)=f\'(c)(2-0)\\le3\\cdot2=6$，故 $f(2)\\le1+6=7$；而 $f(x)=1+3x$ 满足全部条件且 $f(2)=7$，所以最大值能取到。易错点：只写出不等式却忘了验证「等号可达到」。'
          },
          {
            label: '(b)', points: 6, kind: 'keywords',
            prompt: '证明（a）的结论：写出完整推理，说明为什么 $f(2)$ 不可能超过 7，以及等号何时成立。（按关键步骤给分）',
            keywords: [
              ['中值定理', 'MVT', '拉格朗日', '均值定理'],
              ['f(2)-f(0)', 'f(2)−f(0)'],
              ['f\'(c)', 'f′(c)'],
              ['≤3', '<=3'],
              ['≤7', '<=7', '最大值为7', '最大可能值为7']
            ],
            answer: '由拉格朗日中值定理，存在 $c\\in(0,2)$ 使得 $f(2)-f(0)=f\'(c)\\,(2-0)$。又 $f\'(c)\\le3$，故 $f(2)-1\\le3\\cdot2=6$，即 $f(2)\\le7$。当 $f\'(x)\\equiv3$（例如 $f(x)=1+3x$）时等号成立，故最大可能值为 7。',
            placeholder: '写出完整证明：用了什么定理、等式是什么、结论如何得到',
            explain: '评分要点：① 指出在 $[0,2]$ 上对 $f$ 使用拉格朗日中值定理（MVT）；② 写出等式 $f(2)-f(0)=f\'(c)(2-0)$；③ 用题设 $f\'(c)\\le3$ 得 $f(2)-1\\le6$；④ 得 $f(2)\\le7$；⑤ 说明等号可取（$f(x)=1+3x$），故最大值是 7。易错点：用「$f$ 增得快所以最多……」的直觉代替 MVT；或忽略定理条件（闭区间连续、开区间可导）。'
          }
        ]
      }
    ]
  };

  /* ================================================================ B 卷 */
  var B = {
    id: 'mat1001-final',
    title: '期末模拟',
    style: 'B · FINAL',
    subtitle: 'CUHK-Shenzhen Calculus I · AY2026-27 Term 1 (L10) · 闭卷限时模拟',
    date: '期末范围 §5.2–8.8 + §16.1–16.4 · Thomas 14e (SI)',
    minutes: 150,
    totalScore: 100,
    summary: '按真实期末权重配分的 B 卷：<b>Ch5 定积分与 FTC 20 分</b> · <b>Ch6 定积分应用 15 分</b> · <b>Ch7 超越函数 15 分</b> · <b>Ch8 积分技术 25 分</b> · <b>Ch16 一阶微分方程 15 分</b> · <b>概念与证明 10 分</b>。计算量按真题标准配置：换元换限、分部积分、三角积分、三角代换、部分分式、反常积分、可分离变量与积分因子都会考到。',
    instructions: [
      '闭卷、限时 <b>150 分钟</b>，满分 100 分。点击「开始作答」后计时立即开始，刷新页面不会停止计时。',
      '数学公式全部用 <code>$...$</code>（行内）或 <code>$$...$$</code>（独立）书写；题目中的公式由 MathJax 渲染。',
      '填空题只填<b>最终结果</b>，请写<b>精确值</b>（如 <code>9/4</code>、<code>64/15</code>、<code>8/3</code>、<code>\\pi/2</code>），不要写四舍五入的小数。',
      '积分题请写出换元/分部积分的关键步骤；应用题（面积、体积）请先画图或写出积分表达式再计算。',
      '证明题按关键步骤给分，请写出使用的定理名称与关键等式。交卷后可查看逐题解析。'
    ],
    questions: [
      /* ---------------- Q1 · Ch5 定积分计算与性质（fill 8 + tf 4） ---------------- */
      {
        no: 1, points: 12, type: '定积分计算',
        intro: '§5.2–5.4：定积分的计算与基本性质。',
        parts: [
          {
            label: '(a)', points: 4, kind: 'fill',
            prompt: '计算 $\\int_{-1}^{2}\\left(x^3-4x\\right)dx=$',
            answer: '-9/4',
            accept: ['-9/4', '−9/4', '-2.25', '−2.25', '-\\frac{9}{4}', '−\\frac{9}{4}'],
            placeholder: '填精确值，如 -9/4',
            explain: '答案 $-\\frac94$。原函数 $F(x)=\\frac{x^4}4-2x^2$：$F(2)=4-8=-4$，$F(-1)=\\frac14-2=-\\frac74$，故积分 $=F(2)-F(-1)=-4+\\frac74=-\\frac94$。分项验证：$\\int_{-1}^{2}x^3dx=\\frac{x^4}4\\Big|_{-1}^{2}=\\frac{16-1}4=\\frac{15}4$，$\\int_{-1}^{2}4x\\,dx=2x^2\\Big|_{-1}^{2}=2(4-1)=6$，合计 $\\frac{15}4-6=-\\frac94$ ✓。易错点：写成 $F(a)-F(b)$；或负号、$(-1)^4$ 处理出错。'
          },
          {
            label: '(b)', points: 4, kind: 'fill',
            prompt: '计算 $\\int_0^1x\\sqrt{1-x^2}\\,dx=$',
            answer: '1/3',
            accept: ['1/3', '\\frac{1}{3}'],
            placeholder: '填精确值，如 1/3',
            explain: '答案 $\\frac13$。换元 $u=1-x^2$，$du=-2x\\,dx$；$x=0\\to u=1$，$x=1\\to u=0$。$$\\int_0^1x\\sqrt{1-x^2}\\,dx=\\int_1^0\\sqrt u\\left(-\\frac12du\\right)=\\frac12\\int_0^1u^{1/2}du=\\frac12\\cdot\\frac23=\\frac13.$$ 易错点：换元后忘记换积分限（或忘记 $du$ 的负号，导致上下限方向错误）；$\\int u^{1/2}du=\\frac23u^{3/2}$ 别写成 $\\frac12u^{3/2}$。'
          },
          {
            label: '(c)', points: 2, kind: 'tf',
            prompt: '若 $f$ 是 $[-a,a]$ 上的连续奇函数，则 $\\int_{-a}^{a}f(x)\\,dx=0$。',
            options: [{ text: 'True (T)', correct: true }, { text: 'False (F)' }],
            explain: '对。奇函数满足 $f(-x)=-f(x)$，在对称区间上两半的积分互相抵消：$\\int_{-a}^{0}f(x)dx=-\\int_0^{a}f(x)dx$。对偶结论：连续偶函数有 $\\int_{-a}^{a}f=2\\int_0^{a}f$。这两个结论能大幅简化对称区间上的定积分计算。'
          },
          {
            label: '(d)', points: 2, kind: 'tf',
            prompt: '若 $\\int_a^bf(x)\\,dx=0$（$a&lt;b$），则必有 $f(x)=0$ 对一切 $x\\in[a,b]$ 成立。',
            options: [{ text: 'True (T)' }, { text: 'False (F)', correct: true }],
            explain: '错。定积分是<b>带符号的面积</b>，正负部分可以抵消。反例：$f(x)=x$ 在 $[-1,1]$ 上积分为 0，但 $f$ 不恒为零。只有当 $f\\ge0$ 且连续时，积分等于 0 才能推出 $f\\equiv0$（见本卷 Q12 的证明）。易错点：把「面积代数和为零」误当成「函数恒为零」。'
          }
        ]
      },

      /* ---------------- Q2 · Ch5 FTC 与平均值（fill 8） ---------------- */
      {
        no: 2, points: 8, type: '微积分基本定理',
        intro: '§5.3–5.4：微积分基本定理（FTC）与积分平均值。',
        parts: [
          {
            label: '(a)', points: 4, kind: 'fill',
            prompt: '设 $F(x)=\\int_1^{x^2}\\left(t^2+1\\right)dt$，求 $F\'(1)=$',
            answer: '4',
            accept: ['4', '4.0'],
            placeholder: '填数值',
            explain: '答案 $4$。由 FTC-1 与链式法则：$F\'(x)=f(x^2)\\cdot(x^2)\'=(x^4+1)\\cdot2x$。所以 $F\'(1)=(1+1)\\cdot2=4$。易错点：忘记乘内层导数 $2x$；或直接代 $t=1$ 得 $t^2+1=2$（把「被积函数在自变量处的值」与「上限处的复合值」搞混）。'
          },
          {
            label: '(b)', points: 4, kind: 'fill',
            prompt: '求 $f(x)=x^2$ 在区间 $[0,3]$ 上的平均值 $\\frac1{3-0}\\int_0^3f(x)\\,dx=$',
            answer: '3',
            accept: ['3', '3.0'],
            placeholder: '填数值',
            explain: '答案 $3$。$$\\frac13\\int_0^3x^2dx=\\frac13\\cdot\\frac{x^3}3\\Big|_0^3=\\frac13\\cdot9=3.$$ 积分平均值定理保证存在 $c\\in[0,3]$ 使 $f(c)=3$，即 $c=\\sqrt3$（这也提供一个 MVT for integrals 的直观例子）。易错点：忘记除以区间长度 3。'
          }
        ]
      },

      /* ---------------- Q3 · Ch6 面积（choice 3 + fill 5） ---------------- */
      {
        no: 3, points: 8, type: '曲线间面积',
        intro: '§6.1：曲线间的面积。',
        parts: [
          {
            label: '(a)', points: 3, kind: 'choice',
            prompt: '曲线 $y=x^3$ 与 $y=x$ 围成两块封闭图形。它们的总面积 $A$ 等于下列哪个积分？',
            options: [
              { text: '$2\\int_0^1(x-x^3)\\,dx$', correct: true },
              { text: '$\\int_0^1(x^3-x)\\,dx$' },
              { text: '$2\\int_0^1(x^3-x)\\,dx$' },
              { text: '$\\int_{-1}^{1}(x^3-x)\\,dx$' }
            ],
            explain: '答案 A。交点：$x^3=x\\Rightarrow x(x^2-1)=0\\Rightarrow x=-1,0,1$，共两块图形。由对称性两块面积相等，且在 $[0,1]$ 上 $x\\ge x^3$，故 $A=2\\int_0^1(x-x^3)dx$。易错点：选 D——$\\int_{-1}^{1}(x^3-x)dx=0$（奇函数在对称区间上积分为零），得到的是带符号的「净面积」，而不是面积。面积必须取 $\\int|f-g|$。'
          },
          {
            label: '(b)', points: 5, kind: 'fill',
            prompt: '求（a）中的总面积 $A=$',
            answer: '1/2',
            accept: ['1/2', '0.5', '\\frac{1}{2}'],
            placeholder: '填精确值，如 1/2',
            explain: '答案 $\\frac12$。$$2\\int_0^1(x-x^3)dx=2\\left[\\frac{x^2}2-\\frac{x^4}4\\right]_0^1=2\\left(\\frac12-\\frac14\\right)=2\\cdot\\frac14=\\frac12.$$ 易错点：只算一块（得 $\\frac14$）忘记乘 2；或被积函数写成 $x^3-x$ 得负数。'
          }
        ]
      },

      /* ---------------- Q4 · Ch6 体积（choice 3 + fill 4） ---------------- */
      {
        no: 4, points: 7, type: '旋转体体积',
        intro: '§6.3：绕坐标轴旋转的体积（垫圈法）。',
        parts: [
          {
            label: '(a)', points: 3, kind: 'choice',
            prompt: '由 $y=x^2$ 与 $y=2x$ 围成的区域绕 $x$ 轴旋转一周。所得旋转体体积 $V$ 等于下列哪个积分？',
            options: [
              { text: '$\\pi\\int_0^2\\left(4x^2-x^4\\right)dx$', correct: true },
              { text: '$\\pi\\int_0^2\\left(x^4-4x^2\\right)dx$' },
              { text: '$\\pi\\int_0^2\\left(2x-x^2\\right)^2dx$' },
              { text: '$\\pi\\int_0^2\\left(4x^2+x^4\\right)dx$' }
            ],
            explain: '答案 A。交点：$x^2=2x\\Rightarrow x=0,2$，且在 $[0,2]$ 上 $2x\\ge x^2$。绕 $x$ 轴旋转时外半径 $R(x)=2x$、内半径 $r(x)=x^2$（都是「到 $x$ 轴的距离」），垫圈法：$$V=\\pi\\int_0^2\\left[R(x)^2-r(x)^2\\right]dx=\\pi\\int_0^2\\left(4x^2-x^4\\right)dx.$$ 易错点：选 C——把半径写成「两函数之差 $2x-x^2$」，正确做法是<b>半径的平方之差</b>；两曲线都在 $x$ 轴同侧，不能用 $\\pi\\int(f-g)^2$。'
          },
          {
            label: '(b)', points: 4, kind: 'fill',
            prompt: '该旋转体的体积可写成 $V=k\\pi$，求 $k=$',
            answer: '64/15',
            accept: ['64/15', '\\frac{64}{15}'],
            placeholder: '填精确值，如 64/15',
            explain: '答案 $\\frac{64}{15}$。$$\\int_0^2\\left(4x^2-x^4\\right)dx=\\left[\\frac{4x^3}3-\\frac{x^5}5\\right]_0^2=\\frac{32}3-\\frac{32}5=32\\left(\\frac13-\\frac15\\right)=\\frac{64}{15}.$$ 故 $V=\\frac{64}{15}\\pi$，$k=\\frac{64}{15}$。易错点：$2^5=32$ 别算成 25；通分 $\\frac{32}{3}-\\frac{32}{5}=\\frac{160-96}{15}=\\frac{64}{15}$。'
          }
        ]
      },

      /* ---------------- Q5 · Ch7 超越函数求导（fill 8） ---------------- */
      {
        no: 5, points: 8, type: '超越函数求导',
        intro: '§7.2–7.3、§7.6：指数函数、对数函数与反三角函数的导数。',
        parts: [
          {
            label: '(a)', points: 4, kind: 'fill',
            prompt: '设 $f(x)=\\frac{e^x}{1+e^x}$，求 $f\'(0)=$',
            answer: '1/4',
            accept: ['1/4', '0.25', '\\frac{1}{4}'],
            placeholder: '填精确值，如 1/4',
            explain: '答案 $\\frac14$。商法则：$$f\'(x)=\\frac{e^x(1+e^x)-e^x\\cdot e^x}{(1+e^x)^2}=\\frac{e^x}{(1+e^x)^2}.$$ 代入 $x=0$：$f\'(0)=\\frac1{(1+1)^2}=\\frac14$。另解：$f(x)=1-\\frac1{1+e^x}$，求导得 $\\frac{e^x}{(1+e^x)^2}$。易错点：把 $f\'(0)$ 直接写成 $\\frac{f(0)}{1+f(0)}=\\frac12$；注意分母是平方。'
          },
          {
            label: '(b)', points: 4, kind: 'fill',
            prompt: '设 $g(x)=\\arcsin(2x)$，求 $g\'(0)=$',
            answer: '2',
            accept: ['2', '2.0'],
            placeholder: '填数值',
            explain: '答案 $2$。$\\frac{d}{dx}\\arcsin u=\\frac{u\'}{\\sqrt{1-u^2}}$，取 $u=2x$：$$g\'(x)=\\frac{2}{\\sqrt{1-4x^2}},\\qquad g\'(0)=2.$$ 易错点：漏乘内层因子 2；或把 $\\arcsin$ 的导数写成 $\\frac1{\\sqrt{1-x^2}}$ 后忘记把 $x$ 换成 $2x$。'
          }
        ]
      },

      /* ---------------- Q6 · Ch7 对数积分与洛必达（fill 7） ---------------- */
      {
        no: 6, points: 7, type: '对数与极限',
        intro: '§7.1–7.2、§7.5：$\\ln x$ 的积分表示与指数型极限。',
        parts: [
          {
            label: '(a)', points: 4, kind: 'fill',
            prompt: '计算 $\\int_1^{e^2}\\frac{dx}{x}=$',
            answer: '2',
            accept: ['2', '2.0'],
            placeholder: '填数值',
            explain: '答案 $2$。因为 $\\frac{d}{dx}\\ln x=\\frac1x$（$x&gt;0$），所以 $\\int_1^{e^2}\\frac{dx}x=\\ln x\\Big|_1^{e^2}=\\ln(e^2)-\\ln1=2-0=2$。这也是教材用积分定义 $\\ln x=\\int_1^x\\frac{dt}{t}$ 的直接体现。易错点：把 $\\ln(e^2)$ 算成 $\\ln^2e$ 或其他值；$\\ln1=0$。'
          },
          {
            label: '(b)', points: 3, kind: 'fill',
            prompt: '计算 $\\lim_{x\\to0}\\frac{e^{2x}-1}{\\sin x}=$',
            answer: '2',
            accept: ['2', '2.0'],
            placeholder: '填数值',
            explain: '答案 $2$。这是 $\\frac00$ 型，用洛必达：$\\lim_{x\\to0}\\frac{2e^{2x}}{\\cos x}=\\frac{2}{1}=2$。也可用等价无穷小：$e^{2x}-1\\sim2x$，$\\sin x\\sim x$，比值 $\\to2$。易错点：对 $e^{2x}$ 求导时漏乘 2。'
          }
        ]
      },

      /* ---------------- Q7 · Ch8 分部积分与换元（fill 9） ---------------- */
      {
        no: 7, points: 9, type: '分部积分与换元',
        intro: '§8.1–8.2：换元法与分部积分。',
        parts: [
          {
            label: '(a)', points: 4, kind: 'fill',
            prompt: '计算 $\\int_1^e\\ln x\\,dx=$',
            answer: '1',
            accept: ['1', '1.0'],
            placeholder: '填数值',
            explain: '答案 $1$。分部积分：取 $u=\\ln x$、$dv=dx$，则 $du=\\frac{dx}x$、$v=x$，$$\\int\\ln x\\,dx=x\\ln x-\\int x\\cdot\\frac1x\\,dx=x\\ln x-x+C.$$ 故 $\\left[x\\ln x-x\\right]_1^e=(e\\cdot1-e)-(0-1)=1$。易错点：把 $\\ln x$ 的原函数写成 $\\frac{(\\ln x)^2}2$（那是 $\\int\\frac{\\ln x}{x}dx$）；或用 $u=1$、$dv=\\ln x\\,dx$（方向反了）。'
          },
          {
            label: '(b)', points: 5, kind: 'fill',
            prompt: '计算 $\\int_0^1x^2\\left(x^3+1\\right)^5dx=$',
            answer: '7/2',
            accept: ['7/2', '3.5', '\\frac{7}{2}'],
            placeholder: '填精确值，如 7/2',
            explain: '答案 $\\frac72$。换元 $u=x^3+1$，$du=3x^2dx$；$x=0\\to u=1$，$x=1\\to u=2$。$$\\int_0^1x^2(x^3+1)^5dx=\\frac13\\int_1^2u^5du=\\frac13\\cdot\\frac{u^6}6\\Big|_1^2=\\frac{64-1}{18}=\\frac{63}{18}=\\frac72.$$ 易错点：漏乘 $\\frac13$；或把 $\\frac13\\cdot\\frac{63}6$ 约分错（$=\\frac{21}6=\\frac72$）。'
          }
        ]
      },

      /* ---------------- Q8 · Ch8 三角积分与三角代换（fill 9） ---------------- */
      {
        no: 8, points: 9, type: '三角积分',
        intro: '§8.3–8.4：三角函数的积分与三角代换。',
        parts: [
          {
            label: '(a)', points: 4, kind: 'fill',
            prompt: '计算 $\\int_0^{\\pi/2}\\sin^3x\\,dx=$',
            answer: '2/3',
            accept: ['2/3', '\\frac{2}{3}'],
            placeholder: '填精确值，如 2/3',
            explain: '答案 $\\frac23$。奇数幂先拆出一个 $\\sin x$：$\\sin^3x=\\sin x\\,(1-\\cos^2x)$，令 $u=\\cos x$（$du=-\\sin x\\,dx$）：$$\\int_0^{\\pi/2}\\sin^3x\\,dx=\\int_1^0(1-u^2)(-du)=\\int_0^1(1-u^2)du=\\left[u-\\frac{u^3}3\\right]_0^1=\\frac23.$$ 易错点：正弦奇次幂应拆出 $\\sin x$ 凑 $du$，不要错误地套用偶次幂的半角公式。'
          },
          {
            label: '(b)', points: 5, kind: 'fill',
            prompt: '用三角代换（或几何意义）计算 $\\int_{-1}^{1}\\sqrt{1-x^2}\\,dx$。若该积分等于 $k\\pi$，求 $k=$',
            answer: '1/2',
            accept: ['1/2', '0.5', '\\frac{1}{2}'],
            placeholder: '填精确值，如 1/2',
            explain: '答案 $k=\\frac12$。令 $x=\\sin\\theta$，$dx=\\cos\\theta\\,d\\theta$，$\\theta$ 从 $-\\frac\\pi2$ 到 $\\frac\\pi2$：$$\\int_{-\\pi/2}^{\\pi/2}\\cos^2\\theta\\,d\\theta=\\int_{-\\pi/2}^{\\pi/2}\\frac{1+\\cos2\\theta}{2}d\\theta=\\frac1{2}\\cdot\\pi=\\frac\\pi2,$$ 故 $k=\\frac12$。几何上，它正是单位上半圆的面积 $\\frac12\\pi\\cdot1^2=\\frac\\pi2$。易错点：代换后忘记换限；$\\cos^2\\theta$ 的半角公式用错。'
          }
        ]
      },

      /* ---------------- Q9 · Ch8 反常积分与部分分式（fill 7） ---------------- */
      {
        no: 9, points: 7, type: '反常积分与部分分式',
        intro: '§8.5、§8.8：部分分式与反常积分。',
        parts: [
          {
            label: '(a)', points: 3, kind: 'fill',
            prompt: '计算反常积分 $\\int_0^{\\infty}e^{-2x}\\,dx=$',
            answer: '1/2',
            accept: ['1/2', '0.5', '\\frac{1}{2}'],
            placeholder: '填精确值，如 1/2',
            explain: '答案 $\\frac12$。按定义：$$\\int_0^{\\infty}e^{-2x}dx=\\lim_{b\\to\\infty}\\int_0^be^{-2x}dx=\\lim_{b\\to\\infty}\\left[-\\frac12e^{-2x}\\right]_0^b=\\lim_{b\\to\\infty}\\frac12\\left(1-e^{-2b}\\right)=\\frac12.$$ 易错点：把 $\\int_0^{\\infty}e^{-x}dx=1$ 生搬硬套（指数系数 2 必须除）；或忘记取极限直接写「上限代入为 0」。'
          },
          {
            label: '(b)', points: 4, kind: 'fill',
            prompt: '将 $\\frac{3x+5}{(x+1)(x+2)}$ 分解为 $\\frac{A}{x+1}+\\frac{B}{x+2}$，求 $A+B=$',
            answer: '3',
            accept: ['3', '3.0'],
            placeholder: '填数值',
            explain: '答案 $A+B=3$。去分母：$3x+5=A(x+2)+B(x+1)$。令 $x=-1$：$2=A$；令 $x=-2$：$-1=-B\\Rightarrow B=1$。故 $A+B=3$。验算：$\\frac2{x+1}+\\frac1{x+2}=\\frac{2(x+2)+(x+1)}{(x+1)(x+2)}=\\frac{3x+5}{(x+1)(x+2)}$ ✓。易错点：只求出 $A$ 或 $B$ 而漏掉另一个；代入 $x=-1$ 时符号算错。'
          }
        ]
      },

      /* ---------------- Q10 · Ch16 可分离变量方程（fill 9） ---------------- */
      {
        no: 10, points: 9, type: '可分离变量方程',
        intro: '§16.1–16.2：可分离变量的一阶微分方程与初值问题。',
        parts: [
          {
            label: '(a)', points: 4, kind: 'fill',
            prompt: '解初值问题 $\\frac{dy}{dx}=y^2$，$y(0)=\\frac12$，求 $y(1)=$',
            answer: '1',
            accept: ['1', '1.0'],
            placeholder: '填数值',
            explain: '答案 $y(1)=1$。分离变量：$y^{-2}dy=dx\\Rightarrow-\\frac1y=x+C$。由 $y(0)=\\frac12$ 得 $C=-2$，于是 $-\\frac1y=x-2$，即 $y=\\frac1{2-x}$（解在 $x&lt;2$ 上有效）。所以 $y(1)=\\frac1{1}=1$。易错点：分离变量时忽略 $y\\neq0$；$C$ 的符号算错（$-\\frac1y=x+C$ 中 $C=-2$ 而不是 2）。'
          },
          {
            label: '(b)', points: 5, kind: 'fill',
            prompt: '解初值问题 $\\frac{dy}{dx}=\\frac{x}{y}$，$y(0)=2$，求 $y(\\sqrt5)=$',
            answer: '3',
            accept: ['3', '3.0'],
            placeholder: '填数值',
            explain: '答案 $y(\\sqrt5)=3$。分离变量：$y\\,dy=x\\,dx\\Rightarrow\\frac{y^2}2=\\frac{x^2}2+C$，即 $y^2=x^2+C_1$。由 $y(0)=2$ 得 $C_1=4$，故 $y^2=x^2+4$。当 $x=\\sqrt5$ 时 $y^2=9$；因为初值 $y(0)=2&gt;0$，解在附近保持为正，取 $y=3$。易错点：开方时符号选择（不能取 $-3$）；把 $\\int y\\,dy$ 写成 $y^2$ 而漏掉 $\\frac12$。'
          }
        ]
      },

      /* ---------------- Q11 · Ch16 一阶线性方程（fill 6） ---------------- */
      {
        no: 11, points: 6, type: '一阶线性方程',
        intro: '§16.3：一阶线性微分方程与积分因子。',
        parts: [
          {
            label: '', points: 6, kind: 'fill',
            prompt: '解初值问题 $y\'+2y=e^{-x}$，$y(0)=1$，求 $y(\\ln2)=$',
            answer: '1/2',
            accept: ['1/2', '0.5', '\\frac{1}{2}'],
            placeholder: '填精确值，如 1/2',
            explain: '答案 $\\frac12$。积分因子 $\\mu(x)=e^{\\int2\\,dx}=e^{2x}$。两边乘 $\\mu$：$(e^{2x}y)\'=e^{2x}\\cdot e^{-x}=e^{x}$，积分得 $e^{2x}y=e^x+C$，即 $y=e^{-x}+Ce^{-2x}$。代入 $y(0)=1$：$1=1+C\\Rightarrow C=0$，故 $y=e^{-x}$（它就是特解，恰好抵消了齐次项）。于是 $y(\\ln2)=e^{-\\ln2}=\\frac12$。易错点：积分因子写成 $e^{\\int(-2)dx}$（注意方程标准形为 $y\'+P(x)y=Q(x)$，$P=2$）；算出 $C=0$ 后不敢下结论。'
          }
        ]
      },

      /* ---------------- Q12 · 概念与证明（keywords 10） ---------------- */
      {
        no: 12, points: 10, type: '概念与证明',
        intro: '证明题（按关键步骤给分）。设 $f$ 在 $[0,1]$ 上连续，且对每个 $x\\in[0,1]$ 都有 $$\\int_0^xf(t)\\,dt=\\int_x^1f(t)\\,dt.$$',
        parts: [
          {
            label: '', points: 10, kind: 'keywords',
            prompt: '证明：$f(x)=0$ 对一切 $x\\in[0,1]$ 成立。请写出使用的定理、两边求导的结果与关键等式。',
            keywords: [
              ['微积分基本定理', 'FTC', 'fundamental theorem', '牛顿-莱布尼茨', '变上限', '变上限积分求导'],
              ['求导', '微分', '两边', '两侧', '导数'],
              ['-f(x)', '−f(x)', '负的f(x)'],
              ['f(x)=-f(x)', 'f(x) = -f(x)', 'f(x)=−f(x)', '2f(x)=0', 'f(x)+f(x)=0'],
              ['f(x)=0', 'f(x) = 0', '恒为0', '恒等于0', '恒等于零', '零函数']
            ],
            answer: '由微积分基本定理，左边对 $x$ 求导得 $f(x)$；右边先写成 $-\\int_1^xf(t)dt$，对 $x$ 求导得 $-f(x)$。于是 $f(x)=-f(x)$，即 $2f(x)=0$，故对一切 $x\\in[0,1]$ 都有 $f(x)=0$。',
            placeholder: '写出完整证明：对等式两边求导、左边与右边分别等于什么、如何收尾',
            explain: '评分要点：① 对等式两边关于 $x$ 求导；② 左边由 FTC-1（变上限积分求导）得 $f(x)$；③ 右边利用 $\\int_x^1f=-\\int_1^xf$，求导得 $-f(x)$；④ 得到关键等式 $f(x)=-f(x)$，即 $2f(x)=0$；⑤ 结论 $f(x)\\equiv0$。易错点：右边直接求导得 $f(x)$（漏负号，这是本题唯一的陷阱）；或只代 $x=0,1$ 求出两个数值等式就下结论——$\\int_0^1f=0$ 本身推不出 $f\\equiv0$。'
          }
        ]
      }
    ]
  };

  /* ---------------------------------------------------------------- 注册 */
  var LIST = [A, B];
  function inject() {
    var C = window.CSC;
    if (!C || typeof C.registerExam !== 'function') return false;
    try { C._exams = LIST; } catch (e) {}
    LIST.forEach(function (exam) { C.registerExam(exam); });
    return true;
  }
  if (!inject()) {
    /* 极少数情况下数据脚本先于框架注入：挂到全局，稍后补注册（只注册一次） */
    window.__CALC_EXAM_PACK__ = LIST;
    var tries = 0;
    var timer = setInterval(function () {
      if (inject()) { clearInterval(timer); return; }
      if (++tries > 120) clearInterval(timer);
    }, 50);
  }

  /* ---------------------------------------------------------------- 样式补丁
   * assets/app.css 的 `.qzFb svg { width:14px; height:14px }` 原本是给判分卡头部
   * 的 ✓ / ✗ 图标用的，但它同时命中了 .qzFbBody 里 MathJax 生成的 <svg>，会把
   * 成绩页「逐题解析」中的公式压成 14px 的小图标。assets/ 不归本文件维护，
   * 因此这里只针对 #/exam 视图（html[data-view="exam"]）还原公式 SVG 的尺寸：
   * 优先级更高、且不触碰头部图标与其他页面。
   * TODO(Lead)：建议把 app.css 的 `.qzFb svg` 收窄为 `.qzFbHead svg`（quiz 页解析
   * 的公式同样会被压小），根因修复后本补丁可直接删除。 */
  function patchExamMathCss() {
    if (!document.getElementById('examMathCssPatch')) {
      var st = document.createElement('style');
      st.id = 'examMathCssPatch';
      st.textContent = 'html[data-view="exam"] .qzFb mjx-container > svg{width:auto;height:auto;max-width:100%;}';
      (document.head || document.documentElement).appendChild(st);
    }
  }
  patchExamMathCss();

  /* ---------------------------------------------------------------- 动态排版桥接
   * 模拟卷引擎在「开始作答 / 继续作答 / 交卷 / 重做本卷」时会直接重绘 DOM，
   * 不经过 app.js 的 setContent，因此这些新插入的 LaTeX 不会自动交给 MathJax。
   * 这里监听 #content 的结构变化：一旦发现新节点里还有未排版的 $...$，
   * 就排队调用 CSC.math.finish 重新排版（只在 #/exam 路由下生效）。 */
  function installMathBridge() {
    if (typeof window.MutationObserver !== 'function') return;
    var math = window.CSC_MATH;
    if (!math || typeof math.finish !== 'function') { setTimeout(installMathBridge, 150); return; }

    var timer = null;
    var busy = false;

    function rawMathIn(node) {
      if (!node) return false;
      if (node.nodeType === 3) return (node.nodeValue || '').indexOf('$') >= 0;
      if (node.nodeType !== 1) return false;
      if (node.tagName === 'MJX-CONTAINER' || node.tagName === 'SCRIPT' || node.tagName === 'STYLE') return false;
      if (node.closest && node.closest('mjx-container')) return false;
      return (node.textContent || '').indexOf('$') >= 0;
    }
    function contentHasRawMath() {
      var host = document.getElementById('content');
      return !!(host && (host.textContent || '').indexOf('$') >= 0);
    }
    function flush() {
      if (busy) return;
      var host = document.getElementById('content');
      if (!host || !contentHasRawMath()) return;
      if (!math.isReady()) { math.schedule(host); return; }
      busy = true;
      var done = function () { busy = false; };
      try { Promise.resolve(math.finish(host)).then(done, done); }
      catch (e) { busy = false; }
    }
    function queue() {
      if (timer) clearTimeout(timer);
      timer = setTimeout(function () { timer = null; flush(); }, 80);
    }

    var observer = new MutationObserver(function (records) {
      if (busy) return;
      if (String(location.hash || '').indexOf('#/exam') !== 0) return;
      for (var i = 0; i < records.length; i++) {
        var added = records[i].addedNodes;
        for (var j = 0; j < added.length; j++) {
          if (rawMathIn(added[j])) { queue(); return; }
        }
      }
    });
    (function attach() {
      var host = document.getElementById('content');
      if (!host) { setTimeout(attach, 150); return; }
      observer.observe(host, { childList: true, subtree: true });
    })();
  }
  installMathBridge();
})();
