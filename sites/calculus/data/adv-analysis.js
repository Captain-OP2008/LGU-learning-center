/* ============================================================================
 * 微积分学习站 · 进阶学习轨道 · 主题 01
 * data/adv-analysis.js
 *
 * 主题：分析基础（把 ε-δ 讲透）
 * 依赖：CSC.registerAdvanced（assets/app.js），复用主课程 block 渲染器
 * 结构：5 小节 / 135 个内容块 / 约 9500 汉字
 *
 * 说明：进阶页不会挂载 lab / quiz 组件（renderAdvDetail 不调用 hydrateLabs /
 * hydrateQuiz），所以本文件只用静态 block：h / p / list / tex / steps /
 * example / theorem / formula / table / callout / compare / keypoint / checklist。
 * ========================================================================== */
CSC.registerAdvanced({
  id: 'adv-analysis',
  order: 1,
  title: '分析基础',
  en: 'ANALYSIS FOUNDATIONS',
  tagline: '把「无限接近」变成可验算的句子',
  level: '进阶',
  minutes: 90,
  prereq: ['ch02', 'ch03'],

  intro: '<p>主课程第 2 章把极限讲到了「能用来算」的程度：你会代入、会因式分解、会用夹逼，也照着模板写过几个 $\\varepsilon$-$\\delta$ 证明。可合上书，多半还有一个没散掉的疑问：这个定义为什么长这样？那些 $\\varepsilon$ 和 $\\delta$（两个希腊字母，读作艾普西龙和德尔塔，下一节会逐个解释它们管什么），究竟在回答什么问题？</p>'
    + '<p>这一篇不教新公式，只把「严格」这两个字拆开给你看。我们先回到芝诺悖论，看「无限接近」这句话到底缺了什么；再把 $\\varepsilon$-$\\delta$ 读成一场两个人玩的游戏，让你知道每个符号在游戏里干什么；然后完整写三个证明，学会先倒推、再正写；最后往后退一步，看连续、一致连续和实数完备性——也就是「极限为什么一定存在」。</p>'
    + '<p>读它不需要额外的前置知识，只需要你愿意在「我知道怎么做题」之外，再问一句「凭什么可以这样做」。第 3 章的导数定义、第 5 章的积分定义，后面都会回到这里来取地基。</p>',

  goals: [
    '你能用自己的话说明「无限接近」为什么不等于「要多近有多近」，并举出一个反例。',
    '你能把 ε-δ 定义拆成「挑战者给 ε、应战者找 δ」的回合，并说清每个符号的含义。',
    '你能对线性、二次、倒数三类函数，独立写出完整的 ε-δ 证明。',
    '你能区分连续与一致连续，并说清闭区间上为什么两者重合、实数完备性又补上了哪块地基。'
  ],

  sections: [
    /* ==================================================================
     * S1
     * ================================================================== */
    {
      id: 'adv-analysis-s1',
      title: '为什么需要 ε-δ：从「无限接近」到「要多近有多近」',
      en: 'WHY EPSILON-DELTA',
      minutes: 18,
      blocks: [
        { t: 'callout', kind: 'why', title: '这一节要解决什么问题', html: '主课程第 2 章已经给了 $\\varepsilon$-$\\delta$ 定义，也带你证过几个极限。可你可能还有个疙瘩：为什么非要绕这么大一圈？「无限接近」四个字，平时说话完全够用，数学家为什么不肯将就？这一节把这个问题摊开：不是他们爱抬杠，而是这句话本身有歧义，遇到芝诺悖论和「图像连续」这类问题时，它给不出可检验的答案。' },

        { t: 'p', html: '先从一个两千多年前的悖论说起。芝诺说，你从 A 走到 B，要先走一半；剩下的一半，再走一半；再剩下的一半，再走一半……这样分下去，永远有事要做，所以你永远走不到 B。可现实里你明明走得到。问题出在哪？' },

        { t: 'p', html: '直觉的回答是「无限步可以走完」。但这句话需要解释：无限多个正数加起来，怎么可能是一个有限的数？微积分的回答是：不看「加完」那一刻，看「加了很多项之后」离目标还有多远。' },

        { t: 'tex', tex: 'S_n=\\frac12+\\frac14+\\cdots+\\frac1{2^n}=1-\\frac1{2^n}' },

        { t: 'p', html: '这里 $S_n$ 是前 $n$ 步走过的总路程，$n$ 是步数，$\\frac1{2^n}$ 是「还剩多少没走」。你每多走一步，剩下的部分就减半。无论 $n$ 多大，$S_n$ 都小于 1；但 $n$ 越大，它离 1 越近。于是我们说 $S_n$ 的极限是 1，而不是「加到了 1」。' },

        { t: 'p', html: '注意这句话里的关键：我们没有真的做完无限步。我们做的是——对任何一个正数 $\\eta$（读作 eta，表示「你允许的差距」），都能找到一个步数 $N$，使得 $n\\gt N$ 之后，剩下的路程 $\\frac1{2^n}$ 小于 $\\eta$。这就把「无限步」换成了「有限步之后，误差任意小」。极限不是一次动作，是一句承诺：你给我误差，我给出步数。' },

        { t: 'callout', kind: 'note', title: '这一步为什么合法', html: '有人会问：既然每一步都还没到 1，凭什么说极限是 1？因为极限说的不是「某一项等于 1」，而是「这些项可以任意接近 1」。$S_n=1$ 永远不成立，但 $\\lvert S_n-1\\rvert=\\frac1{2^n}$ 可以小于任何预先给定的正数。极限研究的是「趋向」，不是「到达」。' },

        { t: 'p', html: '现在看第二个麻烦：「越来越接近」这句话，其实不唯一。数列 $a_n=\\frac1n$，也就是 $1,\\frac12,\\frac13,\\ldots$，它越来越接近 0，这没问题。可它也越来越接近 $-1$ 吗？算距离：$\\lvert a_n-(-1)\\rvert=1+\\frac1n$。$n$ 变大时，这个距离从 2 降到 1，确实在变小。按「越来越接近」的字面意思，$-1$ 也合格。' },

        { t: 'p', html: '这就说明「越来越接近」不能当定义用。它只说了「距离在减小」，没说「能减到多小」。$\\frac1n$ 到 $-1$ 的距离最小只能到 1，再也下不去；而到 0 的距离可以小于 $0.1$、小于 $0.001$、小于任何正数。真正的区别在这里：<b>不是「能不能更近」，而是「能不能要它多近就多近」</b>。' },

        { t: 'callout', kind: 'tip', title: '先想一想', html: '如果「越来越接近」不够，那该补上哪一句，才能把 $-1$ 这种「假候选」排除掉？先自己说一句，再往下看。' },

        { t: 'p', html: '补的那句是：「对任意给定的误差，都能做到。」把这句话写成式子，就是主课程 2.3 节的那个定义。也就是说，$\\varepsilon$-$\\delta$ 不是数学家为了严谨而发明的装饰，它是把「要多近有多近」这句大白话，翻译成一句可以逐条核对的话。' },

        { t: 'p', html: '还剩一个困惑：连续。你被告知「连续就是图像一笔画得下来，中间没有洞」。这个说法画图时很好用，但它依赖眼睛。如果图像画不出来呢？比如 $f(x)=x\\sin\\frac1x$ 在 0 附近，你根本画不清楚它有没有洞。' },

        { t: 'p', html: '更麻烦的是，「没有洞」到底是什么意思？放大十倍没有洞，放大一百倍呢？「没有洞」是一个关于所有缩放级别的断言，眼睛验不完。$\\varepsilon$-$\\delta$ 把它换成：<b>输入的改动足够小，输出的改动就足够小</b>。而「足够小」的标准，仍然由别人先给。这就是连续性的严格版本，第 4 节会展开。' },

        { t: 'p', html: '这两件事听起来抽象，其实你在第 2 章已经碰过。算 $\\lim_{x\\to2}x^2=4$ 时，你写「当 $x$ 靠近 2，$x^2$ 靠近 4」。可要是有人追问「靠近 2 是靠近到多少」，你答不上来。$\\varepsilon$-$\\delta$ 就是逼你把这句话补完：他给 $0.01$ 的误差，你得说出 $x$ 该落在多宽的范围里。答得出，极限成立；答不出，这句话就只是感觉。' },

        { t: 'p', html: '把这两件事放在一起看：芝诺问的是「无限过程怎么结束」，连续问的是「靠近怎么控制」。两个问题看起来不相干，其实都要同一个工具——把「无限」换成「任意小」。谁给这个「任意小」定标准？不是数学家，是提问的人。这就是下一节那个游戏的由来。' },

        { t: 'p', html: '顺便说一句历史。牛顿和莱布尼茨算出了导数、积分，用的是一种叫「无穷小」（infinitesimal）的量：它比 0 大，又比任何正数小。这个说法算起来极好用，但逻辑上站不住——它到底是什么？贝克莱主教当时就嘲笑它是「消失量的鬼魂」。直到 19 世纪，柯西（Cauchy）和魏尔斯特拉斯（Weierstrass）把「无穷小」换成了「任意小的误差」，微积分才有了不靠直觉的地基。你今天学的 $\\varepsilon$-$\\delta$，就是那块地基的接口。' },

        { t: 'p', html: '这也解释了为什么课本要先讲极限、再讲导数。导数是「差商的极限」，如果极限本身还是一句感觉，导数就只是「感觉出来的斜率」。先把极限钉死，后面的定义才有地方落脚。' },

        { t: 'p', html: '所以这一篇要干三件事。第一，把 $\\varepsilon$-$\\delta$ 定义拆成一场「你出题、我作答」的游戏，让你知道每个符号在游戏里扮演谁。第二，带你完整写三个证明，学会「先倒推找 $\\delta$，再正着写证明」。第三，往后退一步，看连续、一致连续和实数完备性——也就是「极限为什么一定存在」。' },

        { t: 'keypoint', items: [
          { title: '「越来越近」不够用', html: '它只说明距离在减小，没说明能减到多小。$a_n=\\frac1n$ 同时「接近」0 和 $-1$，所以这句话选不出唯一的候选值。' },
          { title: '极限是一句承诺', html: '极限不说「到达」，说「任给误差，都能做到」。有限步之后误差任意小，无限过程就被绕开了。' },
          { title: 'ε-δ 是翻译', html: '把「要多近有多近」翻译成可逐条核对的句子。它解决的不是计算问题，是「凭什么」的问题。' }
        ] }
      ]
    },

    /* ==================================================================
     * S2
     * ================================================================== */
    {
      id: 'adv-analysis-s2',
      title: 'ε-δ 是一盘量化游戏：你出 ε，我找 δ',
      en: 'THE QUANTIFIER GAME',
      minutes: 22,
      blocks: [
        { t: 'callout', kind: 'why', title: '这一节要解决什么问题', html: '定义只有一行，可每个符号都在给你派活。很多人背下了式子，却不知道谁先动、谁后动。这一节把定义读成一场两个人玩的游戏：对方出难题，你交答案。读完再看式子，你会知道每一步该干什么。' },

        { t: 'tex', tex: '\\forall\\,\\varepsilon\\gt0,\\ \\exists\\,\\delta\\gt0:\\quad 0\\lt\\lvert x-c\\rvert\\lt\\delta\\ \\Longrightarrow\\ \\lvert f(x)-L\\rvert\\lt\\varepsilon' },

        { t: 'p', html: '先别急着看符号。这句话的白话版只有一句：<b>不管你把误差标准定得多小，我都能在 $c$ 附近找到一个范围，让范围内的函数值都落在 $L$ 的误差之内。</b>下面把这句话拆成一场游戏。' },

        { t: 'p', html: '先不解释符号，先讲游戏规则。有两个人：一个叫「挑战者」，一个叫「应战者」。挑战者负责挑毛病，应战者负责给范围。挑战者说：「我要函数值和 $L$ 的差距小于 $\\varepsilon$。」应战者不能讨价还价，只能回答：「只要 $x$ 落在 $c$ 附近 $\\delta$ 以内（且 $x\\ne c$），就能满足你。」' },

        { t: 'p', html: '如果应战者对任何 $\\varepsilon\\gt0$ 都能给出对应的 $\\delta$，应战者赢，我们就说极限是 $L$。如果存在某个 $\\varepsilon$，应战者怎么都找不到 $\\delta$，挑战者赢，极限就不是 $L$。定义里的 $\\forall$ 和 $\\exists$，就是这两个人的回合标记。' },

        { t: 'table', head: ['符号', '读法', '游戏里的角色', '一句话'], rows: [
          ['$\\varepsilon$', 'epsilon', '挑战者', '你允许的误差，正数，想多小就多小'],
          ['$\\delta$', 'delta', '应战者', '你交出的活动范围，通常依赖 $\\varepsilon$'],
          ['$0\\lt\\lvert x-c\\rvert\\lt\\delta$', '—', '出题条件', '$x$ 在 $c$ 附近 $\\delta$ 内，但不等于 $c$'],
          ['$\\lvert f(x)-L\\rvert\\lt\\varepsilon$', '—', '判分标准', '$f(x)$ 落在 $L$ 的 $\\varepsilon$ 邻域内'],
          ['$\\forall$', '对任意', '挑战者的回合', '对方先出招'],
          ['$\\exists$', '存在', '应战者的回合', '你后手应对']
        ] },

        { t: 'p', html: '逐个说。$\\varepsilon$ 读作「艾普西龙」，是希腊字母，在这里代表误差上限。它不是「很小的数」，而是「任意给定的正数」——可以是 $0.1$，也可以是 $0.000001$，甚至可以是 $100$。定义要求你对所有正数都作答，所以你不能挑好对付的。' },

        { t: 'p', html: '把游戏走一遍。挑战者出 $\\varepsilon=0.01$，应战者交 $\\delta=0.002$；挑战者不满足，改出 $\\varepsilon=0.0001$，应战者交 $\\delta=0.00002$。只要应战者每次都接得住，挑战者就永远赢不了。极限成立的意思，不是「某一回合赢了」，而是「无论挑战者出多少回合，应战者都有答案」。' },

        { t: 'p', html: '$\\delta$ 读作「德尔塔」，代表你给出的 $x$ 的活动半径。$\\delta=0.01$ 的意思是「$x$ 与 $c$ 的距离小于 $0.01$」。注意 $\\delta$ 是你找的，不是别人给的；而且它通常随着 $\\varepsilon$ 变小而变小。' },

        { t: 'p', html: '$0\\lt\\lvert x-c\\rvert\\lt\\delta$ 这一串要拆开读。$\\lvert x-c\\rvert$ 是 $x$ 与 $c$ 的距离；$\\lvert x-c\\rvert\\lt\\delta$ 是「$x$ 落在以 $c$ 为中心、半径为 $\\delta$ 的开区间里」。前面那个 $0\\lt$ 是「$x$ 不等于 $c$」。两件事合起来：$x$ 可以任意靠近 $c$，但就是不许等于 $c$。' },

        { t: 'p', html: '$\\lvert f(x)-L\\rvert\\lt\\varepsilon$ 是判分标准。$\\lvert f(x)-L\\rvert$ 是函数值与候选极限 $L$ 的距离，也就是误差。这句话说：误差小于挑战者给的上限。' },

        { t: 'p', html: '把四个符号连起来，白话版是：<b>不管你把误差标准定得多苛刻，我总能圈出 $c$ 附近的一个范围；只要 $x$ 在这个范围里（且不等于 $c$），函数值与 $L$ 的差就小于你定的标准。</b>' },

        { t: 'p', html: '还有一个细节：定义里的 $\\delta$ 是开区间的半径，不是闭区间。$0\\lt\\lvert x-c\\rvert\\lt\\delta$ 用的是严格小于号。如果换成 $\\le\\delta$，范围里就多出边界点；边界点上的误差可能正好等于 $\\varepsilon$，而定义要求严格小于。差一个等号，证明就可能过不去。' },

        { t: 'p', html: '这里有个最容易忽略的细节：$\\delta$ 只能依赖 $\\varepsilon$ 和点 $c$，不能依赖具体的 $x$。为什么？因为 $\\delta$ 是先承诺的范围，然后才轮到「对范围内每个 $x$」检查。如果你写「取 $\\delta=\\varepsilon/\\lvert x+2\\rvert$」，等于说「等你告诉我 $x$ 是多少，我再决定范围」，那是耍赖：范围必须提前给出，并且对范围内所有 $x$ 同时有效。' },

        { t: 'p', html: '量词的顺序也不能换。定义是 $\\forall\\varepsilon\\,\\exists\\delta$：先有误差，后有范围。如果换成 $\\exists\\delta\\,\\forall\\varepsilon$，意思就变成「存在一个固定的 $\\delta$，对一切误差标准都管用」。这几乎不可能：只要 $\\delta$ 定死，取一个很小的 $\\varepsilon$，$c$ 附近那个范围内就必须处处有 $f(x)=L$。换句话说，除非函数在 $c$ 的某个去心邻域里恒等于 $L$，否则这个顺序不可能成立。第 4 节讲一致连续时，你会看到这个顺序正是「连续」和「一致连续」的分水岭。' },

        { t: 'p', html: '现在用两个具体函数练「找 $\\delta$」。先看 $f(x)=x^2$ 在 $c=2$ 处，候选极限 $L=4$。要控制的是 $\\lvert x^2-4\\rvert$。因式分解：$\\lvert x^2-4\\rvert=\\lvert x-2\\rvert\\cdot\\lvert x+2\\rvert$。' },

        { t: 'p', html: '多出来的 $\\lvert x+2\\rvert$ 随 $x$ 变，不能当常数。办法是「圈地」：先规定 $\\delta\\le1$，这样 $x$ 被关在 $(1,3)$ 里，$\\lvert x+2\\rvert$ 最大不超过 5。于是 $\\lvert x^2-4\\rvert\\le5\\lvert x-2\\rvert$。要它小于 $\\varepsilon$，只要 $\\lvert x-2\\rvert\\lt\\varepsilon/5$。两个要求同时满足，取 $\\delta=\\min\\{1,\\varepsilon/5\\}$。这里的 $\\min$ 读作「取两者中较小的那个」：$\\varepsilon$ 大时用 1，$\\varepsilon$ 小时用 $\\varepsilon/5$。' },

        { t: 'steps', items: [
          { title: '把误差拆成 |x−c| 乘一个因子', html: '把 $\\lvert f(x)-L\\rvert$ 化成「$\\lvert x-c\\rvert$ 乘以某个东西」的样子。因式分解、通分、有理化，都是干这件事。' },
          { title: '圈一块地，把因子压成常数', html: '先规定 $\\delta\\le1$（或别的方便的数），把 $x$ 限制在 $c$ 附近的一个有界区间里，估计因子的上界 $K$。' },
          { title: '用 ε 定范围', html: '现在误差不超过 $K\\lvert x-c\\rvert$。要它小于 $\\varepsilon$，只需 $\\lvert x-c\\rvert\\lt\\varepsilon/K$。' },
          { title: '取两个要求中较小的', html: '令 $\\delta=\\min\\{1,\\varepsilon/K\\}$。这样「圈地」和「达标」同时成立，缺一个都不行。' }
        ] },

        { t: 'p', html: '验算一下。取 $\\varepsilon=0.1$，则 $\\delta=\\min\\{1,0.02\\}=0.02$。当 $0\\lt\\lvert x-2\\rvert\\lt0.02$ 时，$x\\in(1.98,2.02)$，$\\lvert x+2\\rvert\\lt4.02\\lt5$，于是 $\\lvert x^2-4\\rvert\\lt5\\times0.02=0.1$，达标。' },

        { t: 'table', head: ['$\\varepsilon$', '$\\delta=\\min\\{1,\\varepsilon/5\\}$', '用到的上界', '结果'], rows: [
          ['$0.1$', '$0.02$', '$\\lvert x+2\\rvert\\lt5$', '误差 $\\lt0.1$'],
          ['$0.01$', '$0.002$', '$\\lvert x+2\\rvert\\lt5$', '误差 $\\lt0.01$'],
          ['$0.0001$', '$0.00002$', '$\\lvert x+2\\rvert\\lt5$', '误差 $\\lt0.0001$'],
          ['$100$', '$1$', '$\\lvert x+2\\rvert\\lt5$', '误差 $\\lt5\\lt100$']
        ], caption: '同一个 δ 公式，对大 ε 和小 ε 都要成立。最后一行说明：ε 很大时，「圈地」那一项接管，δ 不必再缩小。' },

        { t: 'p', html: '再看 $f(x)=\\frac1x$ 在 $c=2$ 处，$L=\\frac12$。误差是 $\\lvert\\frac1x-\\frac12\\rvert=\\frac{\\lvert 2-x\\rvert}{2\\lvert x\\rvert}$。分子给出 $\\lvert x-2\\rvert$，分母里的 $\\lvert x\\rvert$ 又是个麻烦因子。' },

        { t: 'p', html: '圈地：要求 $\\delta\\le1$，则 $x\\in(1,3)$，$\\lvert x\\rvert\\gt1$，所以 $\\frac1{2\\lvert x\\rvert}\\lt\\frac12$。误差 $\\lt\\frac{\\lvert x-2\\rvert}{2}$。要它小于 $\\varepsilon$，只需 $\\lvert x-2\\rvert\\lt2\\varepsilon$。取 $\\delta=\\min\\{1,2\\varepsilon\\}$。' },

        { t: 'p', html: '这两个例子套路一样：<b>把误差拆成「$\\lvert x-c\\rvert$ 乘一个有上界的因子」，圈地给因子找上界，再让 $\\lvert x-c\\rvert$ 足够小。</b>第 3 节会把它们写成正式证明。' },

        { t: 'p', html: '最后解释那个 $0\\lt$。为什么不许 $x=c$？因为极限要描述的是「$x$ 靠近 $c$ 时函数怎么走」，而 $c$ 点本身可以完全不管。举两个例子。$f(x)=\\frac{x^2-1}{x-1}$ 在 $x=1$ 处没有定义，但 $x\\ne1$ 时可以约分成 $x+1$，$x\\to1$ 时趋于 2。如果定义要求 $x=c$，这个极限根本无从谈起。' },

        { t: 'p', html: '第二个例子更极端：定义 $f(x)=0$（$x\\ne0$），$f(0)=100$。$x\\to0$ 时函数值一直是 0，极限当然是 0，可函数值 $f(0)=100$。极限和函数值可以毫无关系。这正是「可去间断点」能存在的原因：极限在，值不对，补上值就连续了。' },

        { t: 'callout', kind: 'warn', title: '三个常见写法', html: '第一，把 $\\delta$ 写成依赖 $x$；第二，忘记 $0\\lt\\lvert x-c\\rvert$，把 $x=c$ 也算进去；第三，以为 $\\delta$ 必须取最大。三条都不是定义的要求。$\\delta$ 只要存在一个就够，取小了也正确。' },

        { t: 'p', html: '还有一件事：$\\delta$ 不必最优。如果 $\\delta=0.01$ 能行，那么 $\\delta=0.001$ 也一定行，因为范围更小、条件更强。定义只问「存不存在」，不问「最大是多少」。这一点让证明轻松很多：你不需要精确解出不等式，只要找到一个够用的范围。' },

        { t: 'keypoint', items: [
          { title: '定义是一场游戏', html: '挑战者给 $\\varepsilon$，应战者给 $\\delta$。对每个 $\\varepsilon$ 都能给出 $\\delta$，极限才成立。' },
          { title: 'δ 的依赖', html: '只能依赖 $\\varepsilon$ 和 $c$，不能依赖 $x$。量词顺序换不得。' },
          { title: '找 δ 的套路', html: '拆出 $\\lvert x-c\\rvert$，圈地压住多余因子，再取 $\\min$。' }
        ] }
      ]
    },

    /* ==================================================================
     * S3
     * ================================================================== */
    {
      id: 'adv-analysis-s3',
      title: '用 ε-δ 证明极限：先倒推，再正着写',
      en: 'PROOFS IN EPSILON-DELTA',
      minutes: 24,
      blocks: [
        { t: 'callout', kind: 'why', title: '这一节要解决什么问题', html: '会找 $\\delta$ 只是草稿。答卷上的证明有固定写法：先「任给 $\\varepsilon\\gt0$」，再「取 $\\delta=\\ldots$」，然后「当 $0\\lt\\ldots$ 时」，最后把误差一路推到小于 $\\varepsilon$。这一节给三个完整模板：线性、二次、倒数。每个都先倒推，再正写。' },

        { t: 'p', html: '先说清楚两种写法为什么要分开。找 $\\delta$ 的时候，你可以从「我要 $\\lvert f(x)-L\\rvert\\lt\\varepsilon$」出发，一路解出「$\\lvert x-c\\rvert\\lt$ 某个数」。这一步叫分析，是草稿，允许乱。但正式证明不能这么写，因为正式证明的起点必须是已知条件，不能把结论当条件用。' },

        { t: 'p', html: '逻辑上，你要证的是「若 $0\\lt\\lvert x-c\\rvert\\lt\\delta$，则 $\\lvert f(x)-L\\rvert\\lt\\varepsilon$」。这是一个「若 P 则 Q」的命题。证明它，要从 P 出发推到 Q。如果你从 Q 出发推到 P，那叫逆推，只说明你的 $\\delta$ 可能选对了，不构成证明。' },

        { t: 'p', html: '举个荒唐的例子。假设你要证「所有奇数都是偶数」。你写：设 $n$ 是偶数，则 $n=2k$，所以 $n$ 是偶数。每一步都对，可你证的是「偶数都是偶数」，原命题根本没碰。从结论出发的推导就是这样：结论被你当成了前提，真正要证的蕴含关系被绕过去了。' },

        { t: 'table', head: ['阶段', '起点', '目的', '写进答卷吗'], rows: [
          ['草稿（倒推）', '$\\lvert f(x)-L\\rvert\\lt\\varepsilon$', '解出 $\\lvert x-c\\rvert$ 的上界，找到 $\\delta$ 的候选', '不写。它是草稿纸上的事。'],
          ['证明（正推）', '$0\\lt\\lvert x-c\\rvert\\lt\\delta$', '用放缩推出 $\\lvert f(x)-L\\rvert\\lt\\varepsilon$', '写。这才是证明。']
        ], caption: '同一个 $\\delta$，在两个阶段里的角色不同：草稿里它是未知数，证明里它是已经选定的答案。' },

        { t: 'p', html: '记住一个句式：<b>任给 $\\varepsilon\\gt0$，取 $\\delta=\\ldots$。当 $0\\lt\\lvert x-c\\rvert\\lt\\delta$ 时，有 …… $\\lt\\varepsilon$。证毕。</b>下面三个例子都套它。' },

        { t: 'h', lvl: 4, text: '例一：线性函数 $f(x)=ax+b$' },

        { t: 'p', html: '先倒推。目标是 $\\lvert(ax+b)-(ac+b)\\rvert\\lt\\varepsilon$。化简：$\\lvert a(x-c)\\rvert=\\lvert a\\rvert\\lvert x-c\\rvert$。要让这个小于 $\\varepsilon$，只需 $\\lvert x-c\\rvert\\lt\\varepsilon/\\lvert a\\rvert$。所以 $\\delta=\\varepsilon/\\lvert a\\rvert$。' },

        { t: 'p', html: '这里 $\\lvert a\\rvert$ 是 $a$ 的绝对值：$a$ 可能是负数，而距离不能是负数。如果 $a=0$，函数是常数 $b$，误差恒为 0，任何 $\\delta$ 都行。' },

        { t: 'steps', items: [
          { title: '任给 $\\varepsilon\\gt0$', html: '证明从这里开始。$\\varepsilon$ 是任意正数，后面不能给它赋一个具体值。' },
          { title: '取 δ=ε/|a|', html: '因为 $a\\ne0$，$\\lvert a\\rvert\\gt0$，所以 $\\delta\\gt0$，这个取值合法。' },
          { title: '假设 $0\\lt\\lvert x-c\\rvert\\lt\\delta$', html: '这是定义的前件。下面只用这个假设和已知事实，不用结论。' },
          { title: '估计误差', html: '$\\lvert(ax+b)-(ac+b)\\rvert=\\lvert a(x-c)\\rvert=\\lvert a\\rvert\\lvert x-c\\rvert\\lt\\lvert a\\rvert\\delta=\\lvert a\\rvert\\cdot\\frac{\\varepsilon}{\\lvert a\\rvert}=\\varepsilon$。' },
          { title: '收尾', html: '误差小于 $\\varepsilon$，定义的条件全部满足，所以 $\\lim_{x\\to c}(ax+b)=ac+b$。' }
        ] },

        { t: 'p', html: '点评：这个证明短，因为它没有多余因子。误差正好是 $\\lvert a\\rvert$ 乘 $\\lvert x-c\\rvert$，一个常数乘一个受控量。后面两个例子难，就难在因子里还有 $x$。记住这个对比：线性函数是一步到位，二次和倒数是先圈地、再达标。' },

        { t: 'p', html: '如果 $a$ 是负数，比如 $a=-3$，那么 $\\lvert a\\rvert=3$，$\\delta=\\varepsilon/3$。不要写成 $\\delta=\\varepsilon/a$：$\\varepsilon/a$ 是负数，不能当半径。绝对值在这里不是装饰，它保证 $\\delta\\gt0$。' },

        { t: 'h', lvl: 4, text: '例二：二次函数 $f(x)=x^2$，在任意点 $c$' },

        { t: 'p', html: '这次不固定 $c=2$，而是对任意 $c$ 证。目标：$\\lvert x^2-c^2\\rvert=\\lvert x-c\\rvert\\lvert x+c\\rvert\\lt\\varepsilon$。麻烦在于 $\\lvert x+c\\rvert$ 会随 $x$ 变大。' },

        { t: 'p', html: '圈地。规定 $\\delta\\le1$，则 $\\lvert x-c\\rvert\\lt1$。由三角不等式，$\\lvert x\\rvert=\\lvert(x-c)+c\\rvert\\le\\lvert x-c\\rvert+\\lvert c\\rvert\\lt\\lvert c\\rvert+1$。于是 $\\lvert x+c\\rvert\\le\\lvert x\\rvert+\\lvert c\\rvert\\lt2\\lvert c\\rvert+1$。' },

        { t: 'p', html: '误差 $\\lt(2\\lvert c\\rvert+1)\\lvert x-c\\rvert$。要它小于 $\\varepsilon$，只需 $\\lvert x-c\\rvert\\lt\\varepsilon/(2\\lvert c\\rvert+1)$。取 $\\delta=\\min\\{1,\\ \\varepsilon/(2\\lvert c\\rvert+1)\\}$。' },

        { t: 'steps', items: [
          { title: '任给 $\\varepsilon\\gt0$', html: '同样从任意正数开始。注意接下来的 $\\delta$ 可以依赖 $c$，因为 $c$ 是题目给定的点。' },
          { title: '取 δ=min{1, ε/(2|c|+1)}', html: '括号里两个数都是正的，所以 $\\delta\\gt0$。' },
          { title: '假设 $0\\lt\\lvert x-c\\rvert\\lt\\delta$', html: '由 $\\delta\\le1$ 得 $\\lvert x-c\\rvert\\lt1$，从而 $\\lvert x\\rvert\\lt\\lvert c\\rvert+1$。' },
          { title: '估计因子', html: '$\\lvert x+c\\rvert\\le\\lvert x\\rvert+\\lvert c\\rvert\\lt2\\lvert c\\rvert+1$。这一步把会变的因子压成了常数。' },
          { title: '估计误差', html: '$\\lvert x^2-c^2\\rvert=\\lvert x-c\\rvert\\lvert x+c\\rvert\\lt\\delta(2\\lvert c\\rvert+1)\\le\\varepsilon$。' },
          { title: '收尾', html: '得到 $\\lvert x^2-c^2\\rvert\\lt\\varepsilon$，故 $\\lim_{x\\to c}x^2=c^2$。' }
        ] },

        { t: 'p', html: '检查 $c=0$ 的情形。公式给 $\\delta=\\min\\{1,\\varepsilon\\}$。这能用吗？当 $\\lvert x\\rvert\\lt\\min\\{1,\\varepsilon\\}$ 时，$\\lvert x^2\\rvert=\\lvert x\\rvert^2$。若 $\\varepsilon\\lt1$，则 $\\lvert x\\rvert\\lt\\varepsilon$，平方后小于 $\\varepsilon^2\\lt\\varepsilon$；若 $\\varepsilon\\ge1$，则 $\\lvert x\\rvert\\lt1$，平方后小于 $1\\le\\varepsilon$。所以能用，只是不够漂亮。' },

        { t: 'p', html: '更漂亮的取法是 $\\delta=\\sqrt{\\varepsilon}$：$\\lvert x\\rvert\\lt\\sqrt{\\varepsilon}$ 直接给出 $\\lvert x^2\\rvert\\lt\\varepsilon$。这说明一件事：<b>同一个极限可以有很多种 $\\delta$，证明只要求你交出一个。</b>用 $\\min$ 套路得到的不一定最优，但足够。' },

        { t: 'p', html: '你可能会问：既然 $\\lvert x^2-c^2\\rvert\\lt\\varepsilon$ 在 $c\\gt0$ 时可以解成 $\\sqrt{c^2-\\varepsilon}\\lt x\\lt\\sqrt{c^2+\\varepsilon}$，为什么不直接取端点到 $c$ 的距离？可以，但要处理 $c^2-\\varepsilon\\lt0$ 的情形，还要保证根号里非负。$\\min$ 加放缩的办法更笨，却对所有 $\\varepsilon$ 一视同仁，不用分情况讨论。' },

        { t: 'h', lvl: 4, text: '例三：倒数 $f(x)=1/x$，在 $c\\ne0$' },

        { t: 'p', html: '目标：$\\lvert\\frac1x-\\frac1c\\rvert=\\frac{\\lvert c-x\\rvert}{\\lvert x\\rvert\\lvert c\\rvert}=\\frac{\\lvert x-c\\rvert}{\\lvert x\\rvert\\lvert c\\rvert}$。分母有 $\\lvert x\\rvert$，而 $x$ 靠近 $c$，所以 $\\lvert x\\rvert$ 靠近 $\\lvert c\\rvert$。只要 $x$ 别靠近 0，分母就有正的下界。' },

        { t: 'p', html: '圈地。要求 $\\delta\\le\\lvert c\\rvert/2$。则 $\\lvert x-c\\rvert\\lt\\lvert c\\rvert/2$，于是 $\\lvert x\\rvert\\gt\\lvert c\\rvert/2$。画个数轴就明白：$x$ 落在 $c$ 两侧半个 $\\lvert c\\rvert$ 内，离 0 至少还有一半。分母 $\\lvert x\\rvert\\lvert c\\rvert\\gt\\lvert c\\rvert^2/2$，所以分式 $\\lt2\\lvert x-c\\rvert/\\lvert c\\rvert^2$。' },

        { t: 'p', html: '要它小于 $\\varepsilon$，只需 $\\lvert x-c\\rvert\\lt\\varepsilon\\lvert c\\rvert^2/2$。取 $\\delta=\\min\\{\\lvert c\\rvert/2,\\ \\varepsilon\\lvert c\\rvert^2/2\\}$。' },

        { t: 'steps', items: [
          { title: '任给 $\\varepsilon\\gt0$', html: '起点和前两例一样。' },
          { title: '取 δ=min{|c|/2, ε|c|²/2}', html: '两个数都是正的（$c\\ne0$），所以 $\\delta\\gt0$。' },
          { title: '假设 $0\\lt\\lvert x-c\\rvert\\lt\\delta$', html: '由 $\\delta\\le\\lvert c\\rvert/2$ 得 $\\lvert x\\rvert\\gt\\lvert c\\rvert/2$。' },
          { title: '放缩分母', html: '$\\lvert x\\rvert\\lvert c\\rvert\\gt\\lvert c\\rvert^2/2$，所以 $\\frac1{\\lvert x\\rvert\\lvert c\\rvert}\\lt\\frac2{\\lvert c\\rvert^2}$。' },
          { title: '估计误差', html: '$\\lvert\\frac1x-\\frac1c\\rvert=\\frac{\\lvert x-c\\rvert}{\\lvert x\\rvert\\lvert c\\rvert}\\lt\\frac{2\\delta}{\\lvert c\\rvert^2}\\le\\varepsilon$。' },
          { title: '收尾', html: '故 $\\lim_{x\\to c}\\frac1x=\\frac1c$。' }
        ] },

        { t: 'p', html: '为什么不能取 $c=0$？因为 $\\frac1x$ 在 0 处没有定义，而且 $x$ 靠近 0 时函数值无界。定义要求 $f$ 在 $c$ 的某个去心邻域上有定义，0 不满足这个前提。' },

        { t: 'p', html: '为什么圈地取 $\\lvert c\\rvert/2$，不取 $\\lvert c\\rvert$？如果只要求 $\\lvert x-c\\rvert\\lt\\lvert c\\rvert$，$x$ 可能落在 0 附近。比如 $c=2$，$x=0.1$ 仍在 $(0,4)$ 里，分母 $\\lvert x\\rvert$ 可以任意小，放缩就失效。取一半，等于把 0 明确挡在外面。这个「留一半」的习惯，在估计分母时很好用。' },

        { t: 'p', html: '三个证明放在一起看，骨架完全一样：任给 $\\varepsilon$，取 $\\delta$，假设范围，放缩，收尾。差别只在怎么放缩。你以后遇到新函数，要做的第一件事不是套公式，而是问：$\\lvert f(x)-L\\rvert$ 能不能拆出一个 $\\lvert x-c\\rvert$，剩下的部分能不能在 $c$ 附近找到上界？' },

        { t: 'p', html: '拿 $f(x)=\\sqrt{x}$ 在 $c\\gt0$ 处练手。有理化：$\\lvert\\sqrt{x}-\\sqrt{c}\\rvert=\\frac{\\lvert x-c\\rvert}{\\sqrt{x}+\\sqrt{c}}$。分母有下界 $\\sqrt{c}$，所以取 $\\delta=\\min\\{c/2,\\ \\varepsilon\\sqrt{c}\\}$ 就够：$c/2$ 保证 $x\\gt0$，$\\varepsilon\\sqrt{c}$ 保证误差达标。套路还是那四步，只是「拆因子」换成了有理化。' },

        { t: 'p', html: '写完证明后，用三句话自查：第一，$\\delta$ 是不是只含 $\\varepsilon$ 和 $c$？第二，有没有真的用上 $\\delta$ 的两个上界？第三，最后的误差是不是严格小于 $\\varepsilon$，而不是小于等于？三句都过，证明才算闭合。' },

        { t: 'callout', kind: 'warn', title: '逻辑方向别写反', html: '正式证明里不要出现「要使 $\\lvert f(x)-L\\rvert\\lt\\varepsilon$，只需……」这种句子。它读起来像在解题，逻辑上却是从结论出发。可以把它留在草稿里；正式证明只写「取 $\\delta=\\ldots$，当……时，有……$\\lt\\varepsilon$」。' },

        { t: 'p', html: '还有一个细节：$\\delta$ 取 $\\min$ 之后，证明里要分别用两个上界。$\\delta\\le1$（或 $\\delta\\le\\lvert c\\rvert/2$）用来保证放缩合法，$\\delta\\le\\varepsilon/K$ 用来保证最终误差。少用哪一个，链条都会断。主课程 2.3 节讲过这一点，这里再强调一次，因为它是写证明时最常漏掉的一步。' },

        { t: 'formula', items: [
          { name: '线性函数 $ax+b$', tex: '\\delta=\\frac{\\varepsilon}{\\lvert a\\rvert}\\qquad(a\\ne0)' },
          { name: '二次函数 $x^2$ 在 $c$ 处', tex: '\\delta=\\min\\left\\{1,\\ \\frac{\\varepsilon}{2\\lvert c\\rvert+1}\\right\\}' },
          { name: '倒数 $1/x$ 在 $c\\ne0$ 处', tex: '\\delta=\\min\\left\\{\\frac{\\lvert c\\rvert}{2},\\ \\frac{\\varepsilon\\lvert c\\rvert^2}{2}\\right\\}' },
          { name: '通用句式', tex: '\\forall\\varepsilon\\gt0\\ \\exists\\delta\\gt0:\\ 0\\lt\\lvert x-c\\rvert\\lt\\delta\\Rightarrow\\lvert f(x)-L\\rvert\\lt\\varepsilon' }
        ] },

        { t: 'keypoint', items: [
          { title: '两段式', html: '草稿倒推找 $\\delta$，正式证明正推验证。方向不能混：草稿可以从结论出发，证明不能。' },
          { title: '固定句式', html: '任给 $\\varepsilon\\gt0$，取 $\\delta=\\ldots$，当 $0\\lt\\lvert x-c\\rvert\\lt\\delta$ 时，有……$\\lt\\varepsilon$。' },
          { title: 'min 的两个作用', html: '一个保证放缩合法（把因子压成常数），一个保证误差达标。两个上界都要在证明里用上。' }
        ] }
      ]
    },

    /* ==================================================================
     * S4
     * ================================================================== */
    {
      id: 'adv-analysis-s4',
      title: '连续与一致连续：一个 δ 能管多大一片',
      en: 'CONTINUITY VS UNIFORM CONTINUITY',
      minutes: 22,
      blocks: [
        { t: 'callout', kind: 'why', title: '这一节要解决什么问题', html: '连续是逐点的：每个点有自己的 $\\delta$。可有些问题需要「一个 $\\delta$ 管全区」，比如把区间切得足够细，使每一小段上函数值的变化都小于给定标准。这两种连续不是一回事。这一节把它们分开，并说明闭区间为什么特殊。' },

        { t: 'p', html: '先回忆连续的定义。$f$ 在 $c$ 处连续，意思是 $\\lim_{x\\to c}f(x)=f(c)$。写成 $\\varepsilon$-$\\delta$：对任意 $\\varepsilon\\gt0$，存在 $\\delta\\gt0$，使得当 $\\lvert x-c\\rvert\\lt\\delta$ 时，$\\lvert f(x)-f(c)\\rvert\\lt\\varepsilon$。这里 $I$ 表示函数所在的区间。注意定义里没有 $0\\lt$，因为 $x=c$ 时两边都是 0，自动成立。' },

        { t: 'tex', tex: '\\forall c\\in I\\ \\forall\\varepsilon\\gt0\\ \\exists\\delta\\gt0:\\ \\lvert x-c\\rvert\\lt\\delta\\Rightarrow\\lvert f(x)-f(c)\\rvert\\lt\\varepsilon' },

        { t: 'p', html: '白话：先指定点，再给误差，然后找一个只对这个点有效的范围。$\\delta$ 可以依赖 $c$。$c$ 不同，$\\delta$ 可以不同。这很自然：函数在陡的地方要圈小一点，在平的地方可以圈大一点。' },

        { t: 'callout', kind: 'tip', title: '先想一想', html: '如果把定义里的 $\\forall c$ 和 $\\exists\\delta$ 交换位置，得到的句子是更强还是更弱？先猜一下，再看下面的答案。' },

        { t: 'p', html: '一致连续（uniform continuity）把「先指定点」这一步拿掉了。' },

        { t: 'tex', tex: '\\forall\\varepsilon\\gt0\\ \\exists\\delta\\gt0\\ \\forall x,y\\in I:\\ \\lvert x-y\\rvert\\lt\\delta\\Rightarrow\\lvert f(x)-f(y)\\rvert\\lt\\varepsilon' },

        { t: 'p', html: '白话：只给误差，就要交出一个对整段区间都有效的范围。一个 $\\delta$ 管所有点对。你不能再看着 $c$ 调范围了。' },

        { t: 'p', html: '这个交换看起来只是符号搬家，实际是把「每个点各自为战」换成了「全区间统一指挥」。量词顺序一变，要求立刻变强：原来允许 $\\delta$ 随 $c$ 变，现在不许了。' },

        { t: 'table', head: ['对比项', '连续', '一致连续'], rows: [
          ['$\\delta$ 依赖谁', '可以依赖 $c$ 和 $\\varepsilon$', '只能依赖 $\\varepsilon$'],
          ['量词顺序', '$\\forall c\\,\\forall\\varepsilon\\,\\exists\\delta$', '$\\forall\\varepsilon\\,\\exists\\delta\\,\\forall x\\forall y$'],
          ['图像直觉', '每一点附近都能控制', '全区间用同一把尺子'],
          ['典型例子', '$\\frac1x$ 在 $(0,1)$ 上', '$x^2$ 在 $[0,1]$ 上']
        ] },

        { t: 'p', html: '这两个定义的差别只在量词顺序，可差别是本质的。连续是「每个点都有自己的 $\\delta$」，一致连续是「存在一个 $\\delta$ 对所有点通用」。前者允许 $\\delta$ 随着点跑而越来越小；后者要求 $\\delta$ 有一个统一的正的下界。换句话说，连续是局部性质，一致连续是整体性质。' },

        { t: 'p', html: '用数字感受一下。对 $f(x)=x^2$ 在 $[0,1]$ 上，取 $\\varepsilon=0.1$，$\\delta=0.05$ 就能管住所有点对。对 $\\frac1x$ 在 $(0,1)$ 上，同样是 $\\varepsilon=0.1$：在 $c=1$ 处 $\\delta\\approx0.05$ 就够，在 $c=0.01$ 处 $\\delta\\approx0.000005$ 才够。一个数字管不了全区间。' },

        { t: 'p', html: '看 $f(x)=\\frac1x$ 在 $(0,1)$ 上。它在每一点都连续：给定 $c\\in(0,1)$ 和 $\\varepsilon$，取 $\\delta=\\min\\{c/2,\\ \\varepsilon c^2/2\\}$ 就行，这是上一节的模板。但这个 $\\delta$ 里有 $c$。$c$ 越小，$\\delta$ 越小；当 $c\\to0^+$ 时，$\\delta$ 可以小到任意小。' },

        { t: 'p', html: '它不一致连续。取 $\\varepsilon=1$。假设有人交出一个 $\\delta\\gt0$。选足够大的整数 $n$，使 $\\frac1n-\\frac1{n+1}=\\frac1{n(n+1)}\\lt\\delta$。令 $x=\\frac1n$，$y=\\frac1{n+1}$。这两点距离小于 $\\delta$，可函数值差是 $\\lvert n-(n+1)\\rvert=1$，不小于 $\\varepsilon=1$。所以这个 $\\delta$ 失效。因为 $\\delta$ 是任取的，所以不存在通用的 $\\delta$。' },

        { t: 'p', html: '图像上看得更清楚。$\\frac1x$ 在靠近 0 的地方越来越陡。你想让函数值的变化小于 $0.1$，在 $x=1$ 附近只需要挪 $0.1$ 左右；在 $x=0.01$ 附近只能挪 $0.0001$ 左右。越靠近 0，允许的挪动越小，没有下限。所以找不到一个「对全区间都够用」的范围。' },

        { t: 'p', html: '再看 $f(x)=x^2$ 在 $[0,1]$ 上。这次有统一的范围。误差 $\\lvert x^2-y^2\\rvert=\\lvert x+y\\rvert\\lvert x-y\\rvert$。因为 $x,y\\in[0,1]$，所以 $\\lvert x+y\\rvert\\le2$。于是 $\\lvert x^2-y^2\\rvert\\le2\\lvert x-y\\rvert$。取 $\\delta=\\varepsilon/2$，只要 $\\lvert x-y\\rvert\\lt\\delta$，误差就小于 $\\varepsilon$。这个 $\\delta$ 只依赖 $\\varepsilon$，不依赖 $x,y$。' },

        { t: 'p', html: '同样的 $x^2$，换到 $(0,\\infty)$ 上就不一致连续了。因为 $\\lvert x+y\\rvert$ 没有上界。取 $x=n$，$y=n+\\frac1n$，距离是 $\\frac1n$，可以任意小；但函数值差是 $(n+\\frac1n)^2-n^2=2+\\frac1{n^2}$，始终大于 2。取 $\\varepsilon=1$，无论 $\\delta$ 多小，都能找到这样一对点。' },

        { t: 'callout', kind: 'warn', title: '有界还不够', html: '你可能会想：$\\frac1x$ 在 $(0,1)$ 上不一致连续，是因为它无界。那换个有界的：$\\sin\\frac1x$ 在 $(0,1)$ 上有界、连续，但也不一致连续。靠近 0 时振荡越来越快，任意小的距离里函数值差可以接近 2。所以「有界加连续」仍然不够。关键不是有界，是区间既闭又有界。' },

        { t: 'p', html: '为什么闭区间 $[a,b]$ 上连续就一定一致连续？直觉是这样：假设不一致连续，那么存在一个 $\\varepsilon_0\\gt0$，使得无论 $\\delta$ 取多小，都能找到一对点 $x_n,y_n$，距离小于 $\\frac1n$，函数值差却不小于 $\\varepsilon_0$。' },

        { t: 'p', html: '现在用闭区间的性质。$x_n$ 是 $[a,b]$ 里的数列，有界，所以它有一个子列收敛到某个 $p\\in[a,b]$。这条性质叫波尔查诺–魏尔斯特拉斯定理，这里只报名字，不展开。因为 $y_n$ 与 $x_n$ 的距离趋于 0，对应的 $y_n$ 子列也收敛到同一个 $p$。' },

        { t: 'p', html: '但 $f$ 在 $p$ 处连续。连续的定义说：只要两点都足够靠近 $p$，它们的函数值就足够接近。取对应 $\\varepsilon_0$ 的那个 $\\delta$，当 $n$ 足够大时，$x_n,y_n$ 都落在 $p$ 的 $\\delta$ 邻域里，于是 $\\lvert f(x_n)-f(y_n)\\rvert\\lt\\varepsilon_0$，和「不小于 $\\varepsilon_0$」矛盾。' },

        { t: 'p', html: '这个证明的关键有两处：一是闭区间保证子列不会跑出区间。如果区间是开的，极限点可能正好是端点，比如 $\\frac1x$ 的 0。二是连续性在极限点处给出控制。开区间少了第一处，所以结论不成立。' },

        { t: 'p', html: '换成开区间或半开区间，结论就可能失效。不过要注意：$f(x)=x$ 在 $(0,1)$ 上其实一致连续，取 $\\delta=\\varepsilon$ 即可。这说明「开」本身不是问题，问题在于端点附近会不会失控。$\\frac1x$ 在 $(0,1)$ 上失控，$\\sin\\frac1x$ 在 $(0,1]$ 上也失控。判断时要看具体函数在端点附近的行为，不能只看区间的开闭。' },

        { t: 'p', html: '还有一个在有界区间上很好用的刻画：一致连续的函数一定把柯西列映成柯西列；反过来，在有界区间上，如果连续函数把每一条柯西列都映成柯西列，它就必须一致连续。证明「不一致连续」时可以只用前半句的反面：找一条柯西列，它的像不是柯西列。$\\frac1x$ 就是例子：$\\frac1n$ 是柯西列，但 $f(\\frac1n)=n$ 不是。' },

        { t: 'p', html: '一致连续有什么用？它保证「分段逼近」是可行的。如果要把 $[a,b]$ 切成很多小段，并在每段上用简单的值代替函数，你需要「只要段足够短，每段上的函数值变化都小于 $\\varepsilon$」。这正是一致连续提供的保证。$\\frac1x$ 在 $(0,1)$ 上做不到：靠近 0 的那一段无论切多短，函数值都能从天到地。数值积分、黎曼和、函数逼近，背后都站着这个性质。' },

        { t: 'p', html: '再补一句区分。连续是局部性质：它只谈一个点附近。一致连续是整体性质：它谈整段区间上所有点对的统一控制。同一个函数可以在开区间上连续但不一致连续，也可以在闭区间上两者都成立。判断的关键，是看区间有没有把「变陡的地方」关在外面。' },

        { t: 'keypoint', items: [
          { title: '连续是逐点的', html: '$\\delta$ 可以依赖 $c$。点不同，允许的范围可以不同。' },
          { title: '一致连续是统一的', html: '一个 $\\delta$ 管全区，量词顺序是 $\\forall\\varepsilon\\,\\exists\\delta\\,\\forall x\\forall y$。' },
          { title: '闭区间定理', html: '$[a,b]$ 上连续一定一致连续；开区间可能失效，因为极限点可能跑到端点外。' }
        ] }
      ]
    },

    /* ==================================================================
     * S5
     * ================================================================== */
    {
      id: 'adv-analysis-s5',
      title: '实数完备性：极限为什么一定存在',
      en: 'COMPLETENESS OF THE REALS',
      minutes: 24,
      blocks: [
        { t: 'callout', kind: 'why', title: '这一节要解决什么问题', html: '前面所有证明都有一个共同的前提：极限存在。我们证明 $\\lim_{x\\to c}x^2=c^2$ 时，是先把 $c^2$ 写在纸上，再验证它。可如果连「极限是什么数」都不知道呢？比如 $\\sqrt2$，它是某个数列的极限，可它本身是不是「存在」？这一节说：实数轴没有洞，所以极限有地方可去。' },

        { t: 'p', html: '先看一个具体的数列。用二分法逼近 $\\sqrt2$。$1^2=1\\lt2$，$2^2=4\\gt2$，所以根在 1 和 2 之间。取中点 $1.5$，$1.5^2=2.25\\gt2$，根在 1 和 1.5 之间。再取 $1.25$，$1.25^2=1.5625\\lt2$，根在 1.25 和 1.5 之间。一直做下去。' },

        { t: 'p', html: '每一步都把区间长度减半。第 $n$ 步后，区间长度是 $\\frac1{2^n}$。我们得到两个数列：左端点 $a_n$ 递增，右端点 $b_n$ 递减，且 $b_n-a_n=\\frac1{2^n}\\to0$。如果极限存在，两列只能收敛到同一个数，那个数的平方只能是 2。' },

        { t: 'p', html: '问题是：这个数在不在我们允许的数系里？如果只许用有理数，答案是不在。$\\sqrt2$ 不是有理数。古希腊人早就证过：若 $\\sqrt2=p/q$ 且 $p,q$ 互素，则 $p^2=2q^2$，所以 $p$ 是偶数；设 $p=2r$，代回去得 $q^2=2r^2$，$q$ 也是偶数，和互素矛盾。于是这个数列在有理数系里「想收敛，却没地方落」。' },

        { t: 'p', html: '实数系就是把这些洞补上。补的方法不止一种，这里只说结论：实数满足<b>完备性</b>——任何有上界的非空集合都有上确界；等价地，任何柯西数列都收敛；等价地，单调有界数列必收敛。这三句话可以互相推出，你用哪一句当公理都行。' },

        { t: 'p', html: '这三句话里，「有上确界」最像公理，「单调有界」最好用，「柯西列」最好检验。做题时用哪一句，取决于你手上有什么：有单调性就用第二句，只知道项与项越来越近就用第三句。' },

        { t: 'p', html: '先解释上确界（supremum）。一个数集 $S$ 的上界，是「不小于 $S$ 中每个数」的数。上确界是最小的那个上界，记作 $\\sup S$。它不一定是集合里的元素。' },

        { t: 'p', html: '比如 $S=\\{1-\\frac1n:n=1,2,\\ldots\\}$，它的元素是 $0,\\frac12,\\frac23,\\frac34,\\ldots$。上界有 $1$、$2$、$100$，最小的是 $1$，所以 $\\sup S=1$。但 $1$ 不在 $S$ 里，$S$ 没有最大值。' },

        { t: 'p', html: '有上确界和「有最大值」是两件事。上面的 $S$ 有上确界 1，没有最大值；集合 $\\{1\\}$ 既有上确界也有最大值。上确界只要求「最小上界」，不要求「属于集合」。这个区分在分析里极其重要。' },

        { t: 'p', html: '为什么「有上界就有上确界」能表示「没有洞」？把数轴想成一排点。如果有洞，洞左边的所有数构成一个集合，它有上界（洞右边的数都比它大），却没有最小上界，因为洞把「最小」那个位置空出来了。实数公理就是宣布：这种空位不存在。' },

        { t: 'p', html: '现在看有理数系的洞。令 $S=\\{x\\in\\mathbb{Q}:x^2\\lt2\\}$，其中 $\\mathbb{Q}$ 表示有理数集。在有理数里，$S$ 有上界，比如 2，但它没有有理数上确界。任何一个候选 $r$ 都不行：如果 $r^2\\lt2$，可以找到更大的有理数还在 $S$ 里；如果 $r^2\\gt2$，可以找到更小的有理数也是上界。只有在实数里，才有 $\\sup S=\\sqrt2$。' },

        { t: 'p', html: '注意，这不是「还没找到」，是「真的没有」。你可以把有理数轴想成一张筛子，$\\sqrt2$ 那个位置是个孔，所有有理数都绕开它。无论你把候选值取得多接近，它总在孔的一边，不可能正好卡住「最小上界」的位置。' },

        { t: 'p', html: '这就是为什么「极限存在」不是白给的。数列 $1,1.4,1.41,1.414,\\ldots$（逐步截断 $\\sqrt2$ 的小数）每一项都是有理数，它「应该」收敛到 $\\sqrt2$，可在有理数系里没有极限。实数系把 $\\sqrt2$ 放进去，这个数列才收敛。' },

        { t: 'theorem', name: '单调有界定理', zh: 'Monotone Convergence Theorem', rows: [
          { k: '白话', html: '一直往上爬、又撞不到天花板的数列，一定停在某个高度。' },
          { k: '条件', html: '数列 $\\{a_n\\}$ 单调递增（$a_{n+1}\\ge a_n$），且有上界（存在 $M$，使所有 $a_n\\le M$）。' },
          { k: '结论', html: '数列收敛，且 $\\lim_{n\\to\\infty}a_n=\\sup\\{a_n\\}$。' },
          { k: '怎么用', html: '先证单调、再证有界，极限就存在；然后对递推式两边取极限，解出极限值。注意顺序：先证存在，再求值。' }
        ] },

        { t: 'p', html: '为什么它需要完备性？因为极限正是那个上确界。上确界存在，极限才存在；上确界不存在，数列就没有落脚点。有理数系里，$1,1.4,1.41,\\ldots$ 单调有界，却不收敛，它缺的正是 $\\sqrt2$ 这个上确界。' },

        { t: 'steps', items: [
          { title: '设定数列', html: '$a_1=\\sqrt2$，$a_{n+1}=\\sqrt{2+a_n}$。先算几项：$a_1\\approx1.414$，$a_2=\\sqrt{3.414}\\approx1.848$，$a_3\\approx1.961$，看起来在往上爬。' },
          { title: '证明有上界 2', html: '用归纳法。$a_1=\\sqrt2\\lt2$。若 $a_n\\lt2$，则 $a_{n+1}=\\sqrt{2+a_n}\\lt\\sqrt4=2$。所以所有项都小于 2。' },
          { title: '证明单调递增', html: '比较平方：$a_{n+1}^2-a_n^2=(2+a_n)-a_n^2=(2-a_n)(1+a_n)$。因为 $0\\lt a_n\\lt2$，这个乘积为正，所以 $a_{n+1}\\gt a_n$。' },
          { title: '引用定理', html: '数列单调递增且有上界，所以极限 $L$ 存在，且 $L\\le2$。' },
          { title: '求值', html: '对 $a_{n+1}=\\sqrt{2+a_n}$ 两边取极限。左边趋于 $L$，右边根号是连续函数，可以把极限搬进去：$L=\\sqrt{2+L}$。平方得 $L^2=2+L$，即 $(L-2)(L+1)=0$。$L$ 是正数，所以 $L=2$。' }
        ] },

        { t: 'p', html: '注意第 5 步的合法性。为什么可以把极限搬进根号？因为根号在 $2+L$ 处连续，而连续函数的极限可以交换（主课程 2.5 节的 Th10）。这不是随手写的，是有依据的。' },

        { t: 'p', html: '还要注意第 4 步和第 5 步的顺序。必须先证明 $L$ 存在，才能设它等于 $L$ 并解方程。如果极限不存在，你解出来的 $L$ 只是一个形式上的数，什么也没说明。很多同学一上来就「设极限为 $L$，两边取极限」，这是把结论当前提。' },

        { t: 'p', html: '再看一个更一般的说法：柯西收敛准则。数列 $\\{a_n\\}$ 收敛，当且仅当对任意 $\\varepsilon\\gt0$，存在 $N$，使得 $m,n\\gt N$ 时 $\\lvert a_m-a_n\\rvert\\lt\\varepsilon$。好处是：它不用先知道极限是多少，就能判断收敛不收敛。在实数系里，「柯西列必收敛」和「有上确界」等价；在有理数系里，柯西列可能没有极限。' },

        { t: 'tex', tex: '\\forall\\varepsilon\\gt0\\ \\exists N:\\ m,n\\gt N\\Rightarrow\\lvert a_m-a_n\\rvert\\lt\\varepsilon' },

        { t: 'p', html: '白话：数列的尾巴自己越来越挤，挤到任意小的范围里。如果数轴没有洞，这样一条尾巴一定挤向某个点；如果有洞，它可能挤向一个不存在的点，比如 $\\sqrt2$。' },

        { t: 'p', html: '为什么说这是微积分的最后一块地基？回头看这一路。导数的定义是一个极限（第 3 章），定积分是一个极限（第 5 章），泰勒级数的收敛是一个极限，甚至介值定理「连续函数取遍中间值」也要用到实数的完备性。所有这些「极限存在」的断言，最后都落在实数没有洞这件事上。' },

        { t: 'p', html: '你以后会反复遇到同一种句式：「因为数列单调有界，所以极限存在。」这不是套话，而是完备性在替你担保。没有这条担保，后面所有「设极限为 $L$」的推导都悬在空中。' },

        { t: 'p', html: '但你不必会构造实数。三种常见的构造——戴德金分割、柯西列等价类、十进制小数——都只是「证明这块地基存在」的技术活。学微积分的人只要会用地基：知道单调有界定理能用，知道上确界存在，知道闭区间上连续函数有最大值最小值。构造的细节留给实分析课。' },

        { t: 'p', html: '最后留一个提醒。完备性保证「极限有地方去」，但不保证「每个数列都收敛」。$1,-1,1,-1,\\ldots$ 有界，却不收敛，因为它不单调，也不满足柯西准则（相邻项距离恒为 2）。完备性说的是「该收敛的都能收敛」，不是「所有数列都收敛」。这两句话差别很大。' },

        { t: 'formula', items: [
          { name: '极限的 ε-δ 定义', tex: '\\forall\\varepsilon\\gt0\\ \\exists\\delta\\gt0:\\ 0\\lt\\lvert x-c\\rvert\\lt\\delta\\Rightarrow\\lvert f(x)-L\\rvert\\lt\\varepsilon' },
          { name: '一致连续', tex: '\\forall\\varepsilon\\gt0\\ \\exists\\delta\\gt0:\\ \\lvert x-y\\rvert\\lt\\delta\\Rightarrow\\lvert f(x)-f(y)\\rvert\\lt\\varepsilon' },
          { name: '单调有界定理', tex: 'a_{n+1}\\ge a_n,\\ a_n\\le M\\ \\Rightarrow\\ \\exists L=\\lim_{n\\to\\infty}a_n=\\sup\\{a_n\\}' },
          { name: '柯西收敛准则', tex: '\\forall\\varepsilon\\gt0\\ \\exists N:\\ m,n\\gt N\\Rightarrow\\lvert a_m-a_n\\rvert\\lt\\varepsilon' },
          { name: '上确界', tex: '\\sup S=\\min\\{M:\\ M\\ge s\\ \\text{for every}\\ s\\in S\\}' }
        ] },

        { t: 'keypoint', items: [
          { title: '完备性', html: '实数没有洞：有上界的集合有上确界，单调有界数列收敛，柯西列收敛。三句话等价。' },
          { title: '先存在，后求值', html: '用单调有界先证极限存在，再对递推式取极限解方程。顺序反了，解出来的数没有意义。' },
          { title: '上确界不是最大值', html: '上确界是最小上界，可以不属于集合。$\\sup\\{1-\\frac1n:n\\ge1\\}=1$，但集合里没有 1。' }
        ] }
      ]
    }
  ],

  checklist: { id: 'adv-analysis-check', items: [
    '你能用自己的话说清「无限接近」为什么不够，并举出一个「同时接近两个数」的例子吗？',
    '拿到 ε-δ 定义，你能指出哪个符号是挑战者给的、哪个是你找的，以及为什么 δ 不能依赖 x 吗？',
    '给你一个具体的 $f$、$c$、$L$，你能先倒推、再正着写出完整的 δ 证明吗？',
    '你能说清连续与一致连续在量词顺序上的差别，并各举一个例子吗？',
    '你能解释为什么 $1/x$ 在 $(0,1)$ 上连续但不一致连续，而 $x^2$ 在 $[0,1]$ 上一致连续吗？',
    '你能说明单调有界定理为什么依赖实数完备性，并复述「先证存在、再求值」的步骤吗？'
  ] },

  keypoint: { items: [
    { title: '极限是承诺', html: '任给误差，都能找到范围。极限不是「到达」，是「要多近有多近」。' },
    { title: '定义是游戏', html: '$\\varepsilon$ 是对方出的题，$\\delta$ 是你的答案。$\\delta$ 只依赖 $\\varepsilon$ 与 $c$，量词顺序不能换。' },
    { title: '证明分两段', html: '草稿倒推找 $\\delta$，正式证明正推验证。从结论出发的推导只是草稿，不是证明。' },
    { title: '连续分两种', html: '逐点连续每点一个 $\\delta$；一致连续一个 $\\delta$ 管全区。闭区间把两者接上。' },
    { title: '完备性是地基', html: '实数没有洞，所以单调有界的数列有极限可去。先证存在，再求值。' }
  ] },

  finish: '<p>读到这里，你不必记住每个证明的细节，但要记住三件事：极限是一句「你给误差、我给范围」的承诺；证明要分草稿和正文两段写；实数没有洞，所以极限有地方可去。</p>'
    + '<p>建议你合上页面，拿一张白纸，把线性、二次、倒数三个证明各默写一遍。写完再回主课程 2.3 节看那个定义，你会发现它变短了——不是字变少了，而是每个符号后面都站着一句你能解释的话。之后再去读第 3 章的导数定义，那个 $\\lim_{h\\to0}$ 就不再是一个符号，而是一台你已经拆开看过的机器。</p>'
});
