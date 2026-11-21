/* =====================================================================
 * ch04.js · 第 4 章「数论与同余」
 * 职责：把整数上的除法、gcd、同余、模逆讲到能算、能证、能用在密码与哈希上。
 * 承接：第 02 章的构造性与唯一性证明模板（带余除法、模逆、CRT 都用得上）。
 * 依据：Rosen《离散数学及其应用》第 4 章（数论与密码学）；
 *       CLRS 第 31 章（数论算法）；CUHKSZ CSC3001 大纲第 6–7 周。
 * schema：CSC.registerChapter({ id, num, title, en, goals, kp, blocks })
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch04',
  num: '04',
  title: '数论与同余',
  en: 'NUMBER THEORY AND CONGRUENCE',
  goals: [
    '写出带余除法的商与余数，并解释为什么要求 0 ≤ r &lt; b 才能保证唯一',
    '用欧几里得算法求最大公约数，并用扩展算法把 gcd 写成贝祖形式的线性组合',
    '判断线性同余方程 ax ≡ b (mod m) 是否有解，求出全部解，并用扩展欧几里得算法求模逆',
    '用中国剩余定理合并一组同余方程，并说明两两互素的模数为什么保证了唯一解',
    '陈述并套用费马小定理与欧拉定理做模幂计算，并说明费马检验为什么不能证明素数',
    '解释 RSA 的加密解密为什么互为逆运算，以及哈希表长度取素数能减少碰撞的原因'
  ],
  kp: [
    { id: 'ch04-1', title: '整除与带余除法' },
    { id: 'ch04-2', title: '最大公约数与欧几里得算法' },
    { id: 'ch04-3', title: '线性同余方程与模逆' },
    { id: 'ch04-4', title: '模运算规则与中国剩余定理' },
    { id: 'ch04-5', title: '费马小定理与欧拉定理' },
    { id: 'ch04-6', title: '数论在密码与哈希中的用途' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '为什么离散数学要花两周讲余数', html: '你每天都在用这一章：<code>hash % 1024</code> 决定键落在哪个桶，HTTPS 握手背后的 RSA 靠模幂运算，<code>git</code> 的提交号靠多项式哈希取模，ISBN 的最后一位校验码是一个模 11 的同余式。<br>更重要的原因是它的<b>证明风格</b>：带余除法是「存在性与唯一性」的模板，欧几里得算法是「构造性证明 + 终止性论证」的模板，中国剩余定理是「分而治之」的模板。这三个模板会反复出现在整门课里，比结论本身更值钱。' },

    { t: 'p', lead: true, html: '这一章从「整数能不能被另一个整数整除」出发，一路走到 RSA。路径是：整除 → 带余除法 → gcd 与欧几里得算法 → 线性同余方程与模逆 → 中国剩余定理 → 费马与欧拉定理 → 密码与哈希。每一步都只用到前一步，最后一节的每一个结论都能在前五节找到出处。' },

    { t: 'h', lvl: 2, text: '一、整除与带余除法', id: 'ch04-1' },

    { t: 'p', html: '整除（divisibility）的定义：设 <code>a, b ∈ Z</code> 且 <code>a ≠ 0</code>，若存在整数 k 使 <code>b = a·k</code>，就说 a 整除 b，记作 <code>a | b</code>，并称 a 是 b 的因子。例：<code>3 | 21</code>（k = 7）、<code>3 | −21</code>（k = −7）、<code>7 | 0</code>（k = 0）、<code>4 ∤ 10</code>（10/4 不是整数）。定义里那句 <code>a ≠ 0</code> 不是多余的：若允许 a = 0，则 <code>0 | b</code> 意味着存在 k 使 <code>b = 0·k = 0</code>，只有 b = 0 时成立，而 <code>0 | 0</code> 又会因为「任何 k 都行」而失去唯一性，索性把 0 排除在除数之外。' },

    { t: 'p', html: '整除是第 03 章意义上的偏序（在正整数上）：自反（<code>a | a</code>）、反对称（<code>a | b</code> 且 <code>b | a</code> 则 <code>a = b</code>，在正整数范围内）、传递（<code>a | b</code>、<code>b | c</code> 则 <code>a | c</code>）。它还有一条线性组合性质：若 <code>a | b</code> 且 <code>a | c</code>，则对任意整数 m, n 有 <code>a | (mb + nc)</code>。代入验证：<code>a | b</code> 给 b = a·k<sub>1</sub>，<code>a | c</code> 给 c = a·k<sub>2</sub>，于是 <code>mb + nc = a(mk<sub>1</sub> + nk<sub>2</sub>)</code>，括号里是整数，证毕。这条性质是后面贝祖等式与欧几里得算法的发动机。' },

    { t: 'p', html: '带余除法（division algorithm）是整章的地基：对任意整数 a 与正整数 b，<b>存在且唯一</b>的一对整数 q, r 满足 <code>a = bq + r</code> 且 <code>0 ≤ r &lt; b</code>。q 叫商，r 叫余数，记作 <code>a mod b</code>。存在性用良序性构造：考虑集合 <code>{a − bk : k ∈ Z 且 a − bk ≥ 0}</code>，它非空（b 取足够小即可），取其中最小的元素作 r，可验证 r &lt; b，否则 r − b 会更小，矛盾。' },

    { t: 'p', html: '唯一性靠 <code>0 ≤ r &lt; b</code> 这个区间。反例最有说服力：取 a = −17、b = 5，<br><code>−17 = 5 × (−4) + 3</code>，r = 3 落在 [0, 5)；<br><code>−17 = 5 × (−3) + (−2)</code>，r = −2 越界；<br><code>−17 = 5 × (−5) + 8</code>，r = 8 也越界。<br>三种写法数值上都成立，但只有第一种满足区间约束。换成约束 <code>−b &lt; r ≤ 0</code> 也能得到唯一解，只是解不同（r = −2）。所以<b>唯一性不是除法自带的，是区间约束换来的</b>；丢掉这个约束，商和余数就都失去意义。' },

    { t: 'table', head: ['语言 / 场景', '−17 mod 5 的结果', '取整方式', '后果'], rows: [
      ['数学定义', '3', 'r 落在 [0, b)', '唯一、可用于同余'],
      ['C / Java / Go 的 %', '−2', '商向零截断', '负数键哈希得到负下标'],
      ['Python 的 %', '3', '商向下取整', '与数学定义一致'],
      ['哈希表实现', '必须先规范化', '—', '先加 b 再取模：((h % m) + m) % m']
    ], caption: '同一个符号 % 在不同语言里含义不同；写哈希或下标运算前先确认余数区间' },

    { t: 'p', html: '余数的一个漂亮用途是整除判定。因为 10 ≡ 1 (mod 9)，所以 <code>10<sup>k</sup> ≡ 1</code>，一个数除以 9 的余数等于它各位数字之和除以 9 的余数：<code>1234 = 1 + 2 + 3 + 4 = 10 ≡ 1 (mod 9)</code>，而 1234 ÷ 9 = 137 余 1，对上了。同理 10 ≡ −1 (mod 11)，所以 11 的判定用交错和：<code>1234 → 4 − 3 + 2 − 1 = 2</code>，1234 ÷ 11 = 112 余 2，也对上了。把「判定规则」还原成同余式，就不必背了。' },

    { t: 'quiz', qid: 'ch04-q1' },

    { t: 'h', lvl: 2, text: '二、最大公约数与欧几里得算法', id: 'ch04-2' },

    { t: 'p', html: '公约数里最大的那个叫最大公约数（greatest common divisor），记 <code>gcd(a, b)</code>。它一定存在，因为 a 的因子只有有限个，公共因子集有限且非空（至少含 1）。例：<code>gcd(252, 105) = 21</code>。直接分解质因数也行：252 = 2<sup>2</sup> × 3<sup>2</sup> × 7，105 = 3 × 5 × 7，公共部分是 3 × 7 = 21。但分解大整数很难——RSA 的安全性正建立在这一点上——所以实际算法必须绕开分解。' },

    { t: 'p', html: '欧几里得算法（Euclidean algorithm）只用一条等式：<code>gcd(a, b) = gcd(b, a mod b)</code>，边界是 <code>gcd(a, 0) = a</code>。理由是「a 与 b 的公共因子」和「b 与 r 的公共因子」是同一个集合：设 <code>a = bq + r</code>，若 d | a 且 d | b，则由线性组合性质 <code>d | (a − bq) = r</code>；反之若 d | b 且 d | r，则 <code>d | (bq + r) = a</code>。两个集合相等，最大元自然相等。' },

    { t: 'steps', items: [
      { title: '第一步：252 = 2 × 105 + 42', html: '把 252 对 105 做带余除法，余数 42。' },
      { title: '第二步：105 = 2 × 42 + 21', html: '把 105 对 42 做带余除法，余数 21。' },
      { title: '第三步：42 = 2 × 21 + 0', html: '余数为 0，此时除数 21 就是 gcd。' },
      { title: '结论', html: 'gcd(252, 105) = 21，三次除法，没做任何质因数分解。' }
    ] },

    { t: 'p', html: '把过程倒着写回去，就得到<b>扩展欧几里得算法</b>（extended Euclidean algorithm）的产物——贝祖等式（Bézout identity）：存在整数 s, t 使 <code>gcd(a, b) = as + bt</code>。对上面的例子：<code>21 = 105 − 2 × 42</code>，而 <code>42 = 252 − 2 × 105</code>，代入得 <code>21 = 105 − 2(252 − 2 × 105) = 5 × 105 − 2 × 252</code>。所以 s = −2、t = 5。这两个系数不是装饰品：下一节求模逆时，它们就是答案。' },

    { t: 'p', html: '算法有多快？看最坏情况。取相邻斐波那契数 <code>gcd(89, 55)</code>：89 = 1×55+34，55 = 1×34+21，34 = 1×21+13，21 = 1×13+8，13 = 1×8+5，8 = 1×5+3，5 = 1×3+2，3 = 1×2+1，2 = 2×1+0，一共 9 次除法。每一商都是 1，余数掉得最慢，所以斐波那契相邻项是欧几里得算法的最坏输入。拉梅定理（Lamé）给出上界：除法次数不超过 b 的十进制位数的 5 倍，即 <code>O(log b)</code>。这就是为什么求 gcd 在密码学里可以放心地对 2048 位整数调用。' },

    { t: 'p', html: '两个整数互素（coprime）指 <code>gcd(a, b) = 1</code>，等价于贝祖等式里 1 能写成它们的整系数线性组合。互素有一条关键引理：<b>若 <code>a | bc</code> 且 <code>gcd(a, b) = 1</code>，则 <code>a | c</code></b>。证明用贝祖：有 <code>1 = as + bt</code>，两边乘 c 得 <code>c = acs + bct</code>，两项都被 a 整除（第二项因为 a | bc），所以 a | c。反例说明互素不能省：<code>4 | 6 × 2</code>，但 <code>4 ∤ 6</code> 也 <code>4 ∤ 2</code>。' },

    { t: 'callout', kind: 'warn', title: '常见错误：用 gcd 的余数当答案', html: '<b>错误说法：</b><code>gcd(252, 105) = 42</code>，因为第一步的余数是 42。<br><b>为什么错：</b>算法在递归，每一步只是把问题换成等价的更小问题，「当前的余数」不是最终答案。42 甚至不是 105 的因子（105 ÷ 42 余 21）。<br><b>正确说法：</b>一直做到余数为 0，取<b>最后一个非零余数</b>（也就是最后一个除数）。252 → 105 → 42 → 21 → 0，答案是 21。' },

    { t: 'h', lvl: 2, text: '三、线性同余方程与模逆', id: 'ch04-3' },

    { t: 'p', html: '同余（congruence）的定义：<code>a ≡ b (mod m)</code> 当且仅当 <code>m | (a − b)</code>，其中 m 是正整数。等价说法是「a 与 b 除以 m 的余数相同」。例：<code>17 ≡ 2 (mod 5)</code>，因为 17 − 2 = 15 被 5 整除；<code>−3 ≡ 4 (mod 7)</code>，因为 −3 − 4 = −7。同余是第 03 章的等价关系：自反、对称、传递，等价类就是余数相同的那些数，整个 Z 被切成 m 个类。' },

    { t: 'p', html: '同余式可以像等式一样加、减、乘：若 <code>a ≡ b</code> 且 <code>c ≡ d (mod m)</code>，则 <code>a + c ≡ b + d</code>、<code>ac ≡ bd (mod m)</code>。但<b>除法不行</b>。最简单的反例：<code>2 × 2 ≡ 2 × 4 (mod 4)</code> 成立（4 ≡ 8），两边消去 2 却得到 <code>2 ≡ 4 (mod 4)</code>，假。原因是 2 与模数 4 不互素，没有逆元可乘。' },

    { t: 'p', html: '线性同余方程 <code>ax ≡ b (mod m)</code> 的可解性有完整判据：设 <code>d = gcd(a, m)</code>，则方程有解当且仅当 <code>d | b</code>；有解时，在 <code>0 ≤ x &lt; m</code> 范围内恰有 d 个解。理由：方程等价于「存在整数 k 与 y 使 <code>ax + my = b</code>」，左边总能被 d 整除，所以 b 必须也能；反过来若 <code>d | b</code>，把贝祖等式 <code>d = as + mt</code> 两边乘 <code>b/d</code> 就构造出一个解。' },

    { t: 'p', html: '算一个具体例子：<code>6x ≡ 9 (mod 15)</code>。这里 <code>d = gcd(6, 15) = 3</code>，而 <code>3 | 9</code>，所以有解且恰有 3 个。两边同除以 3，模数也除以 3：<code>2x ≡ 3 (mod 5)</code>。2 在模 5 下的逆是 3（2 × 3 = 6 ≡ 1），两边乘 3 得 <code>x ≡ 9 ≡ 4 (mod 5)</code>。于是模 15 下三个解是 <code>4, 9, 14</code>。逐个验：6 × 4 = 24 ≡ 9；6 × 9 = 54 ≡ 9（54 − 9 = 45）；6 × 14 = 84 ≡ 9（84 − 9 = 75 = 5 × 15）。三个都对。' },

    { t: 'p', html: '当 <code>gcd(a, m) = 1</code> 时解唯一，这个唯一的乘数叫 a 的模逆（modular inverse），记 <code>a<sup>−1</sup></code>，满足 <code>a · a<sup>−1</sup> ≡ 1 (mod m)</code>。求法就是扩展欧几里得：解 <code>as + mt = 1</code>，则 <code>s</code> 就是逆。求 <code>17<sup>−1</sup> mod 43</code>：43 = 2×17+9，17 = 1×9+8，9 = 1×8+1；回代得 1 = 9 − 8 = 9 − (17 − 9) = 2×9 − 17 = 2(43 − 2×17) − 17 = 2×43 − 5×17。所以 <code>−5 × 17 ≡ 1</code>，逆是 <code>−5 ≡ 38</code>。验证：17 × 38 = 646 = 43 × 15 + 1，余数确实是 1。' },

    { t: 'p', html: '有了逆元，「除法」就有了定义：<code>ax ≡ b (mod m)</code> 且 <code>gcd(a, m) = 1</code> 时，<code>x ≡ a<sup>−1</sup>b (mod m)</code>。消去律也随之成立：<code>ac ≡ bc</code> 且 <code>gcd(c, m) = 1</code>，两边乘 <code>c<sup>−1</sup></code> 得 <code>a ≡ b</code>。注意两个前提都不能丢：<code>gcd(c, m) = 1</code> 保证逆存在，而同余式两边的相等关系才允许同乘。' },

    { t: 'quiz', qid: 'ch04-q2' },

    { t: 'h', lvl: 2, text: '四、模运算规则与中国剩余定理', id: 'ch04-4' },

    { t: 'p', html: '模运算的加乘规则可以放心使用：<code>((a mod m) + (b mod m)) mod m = (a + b) mod m</code>，乘法同理。这让大数计算可以先降规模再相乘。计算 <code>3<sup>13</sup> mod 7</code> 用反复平方（repeated squaring）：13 的二进制是 1101，<code>3<sup>2</sup> = 9 ≡ 2</code>，<code>3<sup>4</sup> ≡ 2<sup>2</sup> = 4</code>，<code>3<sup>8</sup> ≡ 4<sup>2</sup> = 16 ≡ 2</code>；于是 <code>3<sup>13</sup> = 3<sup>8</sup> · 3<sup>4</sup> · 3<sup>1</sup> ≡ 2 × 4 × 3 = 24 ≡ 3 (mod 7)</code>。13 次乘法被压到 3 次平方加 2 次乘法，指数再大也只是 <code>O(log n)</code> 次运算。' },

    { t: 'p', html: '有一条规则看起来很像对的，其实是错的：<b>指数不能对模数取模</b>。有人算 <code>3<sup>13</sup> mod 7</code> 时把指数 13 化成 <code>13 mod 7 = 6</code>，得 <code>3<sup>6</sup> = 729 ≡ 1</code>，与正确答案 3 不符。正确做法是让指数对 <code>φ(7) = 6</code> 取模（费马小定理，下一节），13 ≡ 1 (mod 6) 给出 <code>3<sup>13</sup> ≡ 3<sup>1</sup> = 3</code>，这才对。两个 6 长得一样，来源完全不同：一个是被除数的模，一个是指数的周期。' },

    { t: 'p', html: '中国剩余定理（Chinese remainder theorem, CRT）处理方程组。若 <code>m<sub>1</sub>, …, m<sub>k</sub></code> 两两互素，则同余组 <code>x ≡ a<sub>i</sub> (mod m<sub>i</sub>)</code> 在模 <code>M = m<sub>1</sub>m<sub>2</sub>…m<sub>k</sub></code> 下有唯一解。例：解 <code>x ≡ 2 (mod 3)</code>、<code>x ≡ 3 (mod 5)</code>、<code>x ≡ 2 (mod 7)</code>。取 M = 105，构造 <code>M<sub>1</sub> = 35</code>、<code>M<sub>2</sub> = 21</code>、<code>M<sub>3</sub> = 15</code>，分别求它们在各自模数下的逆：35 ≡ 2 (mod 3)，逆为 2；21 ≡ 1 (mod 5)，逆为 1；15 ≡ 1 (mod 7)，逆为 1。于是 <code>x = 2 × 35 × 2 + 3 × 21 × 1 + 2 × 15 × 1 = 140 + 63 + 30 = 233 ≡ 23 (mod 105)</code>。' },

    { t: 'p', html: '验证一下 23：23 mod 3 = 2，23 mod 5 = 3，23 mod 7 = 2，三条全中。为什么唯一？设 x、y 都是解，则每个 <code>m<sub>i</sub></code> 都整除 <code>x − y</code>；因为模数两两互素，它们的乘积 M 也整除 <code>x − y</code>，所以 <code>x ≡ y (mod M)</code>。<b>互素正是为了这一步</b>：若两个模数有公因子，各自整除只能推出最小公倍数整除，推不出乘积整除。模数不互素时会出现两种结局，都不是 CRT 的形式。第一种是无解：<code>x ≡ 0 (mod 4)</code> 要求 x 是偶数，<code>x ≡ 1 (mod 6)</code> 要求 x 是奇数，两条不可能同时成立。第二种是解变少：<code>x ≡ 1 (mod 4)</code> 与 <code>x ≡ 3 (mod 6)</code>，9 满足两条，21 也满足，它们模 <code>lcm(4, 6) = 12</code> 同余，所以解在模 12 下唯一，而不是在模 24 下唯一。用 CRT 之前先算 gcd，这一步不能省。' },

    { t: 'p', html: 'CRT 的工程价值在「拆开算」。一个大模数 M 上的运算，可以拆成几个小模数上并行计算，再拼回来。RSA 解密时把模数 n = pq 拆成 p、q 两个小模数分别做模幂，速度约为原来的四分之一（因为模幂代价随位长超线性增长）；分布式系统中的唯一 ID 也常用「多个小模数下的余数向量」表示，每个分片只存一段。' },

    { t: 'h', lvl: 2, text: '五、费马小定理与欧拉定理', id: 'ch04-5' },

    { t: 'p', html: '欧拉函数（Euler totient function）<code>φ(m)</code> 数的是 <code>1 ≤ a ≤ m</code> 中与 m 互素的整数个数。<code>φ(12) = 4</code>，因为 1、5、7、11 与 12 互素；<code>φ(10) = 4</code>（1、3、7、9）；<code>φ(p) = p − 1</code> 对素数 p 成立，因为除 p 本身外全都与它互素。若 <code>m = pq</code> 是两个不同素数之积，则 <code>φ(m) = (p−1)(q−1)</code>，这是 RSA 里算 φ(n) 的公式。' },

    { t: 'p', html: '欧拉定理（Euler theorem）：若 <code>gcd(a, m) = 1</code>，则 <code>a<sup>φ(m)</sup> ≡ 1 (mod m)</code>。证明的核心是「乘 a 是一个置换」：取模 m 的既约剩余系 <code>R = {r<sub>1</sub>, …, r<sub>φ(m)</sub>}</code>（与 m 互素的那些余数），把每个元素乘 a 得到 <code>aR</code>。因为 a 与 m 互素，乘法不改变「是否与 m 互素」，所以 aR 里每个元素仍互素；又因为 a 有逆，乘法是单射，φ(m) 个元素互不相同，于是 aR 仍是同一个集合，只是顺序变了。两边所有元素相乘：<code>a<sup>φ(m)</sup> · ∏r<sub>i</sub> ≡ ∏r<sub>i</sub></code>，而 ∏r<sub>i</sub> 与 m 互素、可约去，得 <code>a<sup>φ(m)</sup> ≡ 1</code>。费马小定理（Fermat little theorem）是 <code>m = p</code> 的特例：p 为素数且 p ∤ a 时 <code>a<sup>p−1</sup> ≡ 1 (mod p)</code>。' },

    { t: 'p', html: '用它算幂：求 <code>3<sup>100</sup> mod 10</code>。gcd(3, 10) = 1，φ(10) = 4，所以 <code>3<sup>4</sup> ≡ 81 ≡ 1 (mod 10)</code>。100 = 4 × 25，于是 <code>3<sup>100</sup> = (3<sup>4</sup>)<sup>25</sup> ≡ 1<sup>25</sup> = 1 (mod 10)</code>。答案是个位数字 1，与直接算 3<sup>100</sup> 个位循环 3, 9, 7, 1 的结论一致。' },

    { t: 'p', html: '反过来用它检验素数：<b>费马检验</b>（Fermat test）随机取 a，检查 <code>a<sup>n−1</sup> ≡ 1 (mod n)</code> 是否成立；不成立则 n 一定合数（这是确定性的），成立则 n 可能是素数。为什么不能反过来推？因为存在<b>费马伪素数</b>（Fermat pseudoprime）：<code>341 = 11 × 31</code> 是合数，但 <code>2<sup>340</sup> ≡ 1 (mod 341)</code>。所以「过了一次费马检验」不等于「是素数」，只能提供概率证据。' },

    { t: 'table', head: ['定理', '条件', '结论', '典型用途'], rows: [
      ['费马小定理', 'p 素数，p ∤ a', 'a<sup>p−1</sup> ≡ 1 (mod p)', '快速模幂、素性检验的必要条件'],
      ['欧拉定理', 'gcd(a, m) = 1', 'a<sup>φ(m)</sup> ≡ 1 (mod m)', 'RSA 解密正确性、降指数'],
      ['推广形式', 'p 素数，任意 a', 'a<sup>p</sup> ≡ a (mod p)', '包含 a ≡ 0 的情形'],
      ['反面事实', 'n = 341 合数', '2<sup>340</sup> ≡ 1 (mod 341)', '单次费马检验不能证明素数']
    ], caption: '条件栏里的 gcd 与「p 素数」都不能省：a 与 m 不互素时 a<sup>φ(m)</sup> 不再必为 1' },

    { t: 'callout', kind: 'warn', title: '常见错误：把费马检验当素性证明', html: '<b>错误说法：</b>「2<sup>340</sup> mod 341 = 1，所以 341 是素数。」<br><b>为什么错：</b>费马小定理只说「素数必有此性质」，没说「有此性质必是素数」。这是一个必要条件的误用（把 P → Q 当成了 Q → P，正好是第 01 章的重点）。341 = 11 × 31 直接分解就能看出是合数。<br><b>正确说法：</b>检验失败则必是合数；检验通过只能说「没被抓到」。实际用 Miller–Rabin 换多个底数重复检验，把误判概率压到可忽略。' },

    { t: 'quiz', qid: 'ch04-q3' },

    { t: 'h', lvl: 2, text: '六、数论在密码与哈希中的用途', id: 'ch04-6' },

    { t: 'p', html: 'RSA 把前面所有零件串起来。选两个素数 p、q（真实场景各 1024 位以上），令 <code>n = pq</code>、<code>φ(n) = (p−1)(q−1)</code>；选 <code>e</code> 与 φ(n) 互素，再求 <code>d ≡ e<sup>−1</sup> (mod φ(n))</code>。公钥是 (n, e)，私钥是 (n, d)。加密 <code>c ≡ m<sup>e</sup> (mod n)</code>，解密 <code>m ≡ c<sup>d</sup> (mod n)</code>。' },

    { t: 'p', html: '玩具尺寸算一遍：p = 3、q = 11，<code>n = 33</code>，<code>φ(33) = 2 × 10 = 20</code>；取 e = 3（gcd(3,20) = 1），解 3d ≡ 1 (mod 20) 得 d = 7（3 × 7 = 21 ≡ 1）。明文 m = 5：密文 <code>c = 5<sup>3</sup> = 125 ≡ 26 (mod 33)</code>（125 − 99 = 26）。解密：<code>26<sup>7</sup> mod 33</code>。用反复平方：26 ≡ −7，<code>26<sup>2</sup> ≡ 49 ≡ 16</code>，<code>26<sup>4</sup> ≡ 256 ≡ 25</code>，于是 <code>26<sup>7</sup> = 26<sup>4</sup> · 26<sup>2</sup> · 26 ≡ 25 × 16 × 26 = 10400</code>；10400 = 33 × 315 + 5，余数 5，明文回来了。' },

    { t: 'p', html: '为什么必然回来？因为 <code>ed = 1 + kφ(n)</code>，所以 <code>m<sup>ed</sup> = m · (m<sup>φ(n)</sup>)<sup>k</sup> ≡ m · 1<sup>k</sup> = m (mod n)</code>，这一步用的正是欧拉定理。安全性来自另一头：公钥里有 n，只要能把 n 分解成 p、q 就能算出 φ(n) 与 d；目前没有已知的多项式时间分解算法，所以密钥够长就安全。注意这是「没有已知算法」，不是「已证明不可能」——密码学的安全性总是这种有条件的形式。' },

    { t: 'p', html: '哈希表里取模的讲究更接地气。表长 m 若取 2 的幂（比如 1024），<code>h mod 1024</code> 只保留 h 的低 10 位，高位完全浪费。若所有键都是 4 的倍数，<code>4, 12, 20, 28</code> 在 m = 8 时全落在 4 号桶，退化成链表；换成 m = 11，它们分别落在 4、1、9、6 号桶，冲突立刻散开。这就是「表长取素数」的实际理由：素数表长让低位重复的模式也被打散，而不是只在少数桶里堆积。' },

    { t: 'p', html: 'ISBN-10 的校验位是 CRT 之外另一个模运算的漂亮应用。10 位数字 <code>d<sub>1</sub>…d<sub>10</sub></code> 合法当且仅当 <code>Σ i·d<sub>i</sub> ≡ 0 (mod 11)</code>。它能检出全部单数字错误：改第 i 位为 d′，和的变化是 <code>i(d′ − d)</code>，因为 11 是素数且 <code>1 ≤ i ≤ 10</code>、<code>|d′ − d| ≤ 9</code>，两个因子都不被 11 整除，乘积也就不被 11 整除，校验和必然改变。它还能检出相邻换位：交换 i 与 i+1 位，和变化 <code>(d<sub>i+1</sub> − d<sub>i</sub>)</code> 的符号乘以 1，而数字差不为 0 且绝对值小于 11，同样被抓到。选 11 而不选 10，正是因为 10 是合数，会让某些错误恰好抵消。' },

    { t: 'terms', items: [
      { en: 'divisibility', zh: '整除', html: 'a | b 表示存在整数 k 使 b = ak；除数不能为 0，是整数上的偏序关系。' },
      { en: 'division algorithm', zh: '带余除法', html: 'a = bq + r 且 0 ≤ r &lt; b；区间约束保证 q、r 唯一，也决定了编程语言里负数取模的差异。' },
      { en: 'greatest common divisor', zh: '最大公约数', html: '公共因子中最大的一个，记 gcd(a, b)；欧几里得算法用 gcd(a,b) = gcd(b, a mod b) 快速求出。' },
      { en: 'Bézout identity', zh: '贝祖等式', html: 'gcd(a, b) = as + bt，系数由扩展欧几里得算法回代得到，是求模逆的工具。' },
      { en: 'modular inverse', zh: '模逆', html: '满足 a·a<sup>−1</sup> ≡ 1 (mod m) 的数，存在当且仅当 gcd(a, m) = 1。' },
      { en: 'Chinese remainder theorem', zh: '中国剩余定理', html: '模数两两互素时，一组同余方程在模它们的乘积下有唯一解，可分开计算再合并。' },
      { en: 'Euler totient function', zh: '欧拉函数', html: 'φ(m) 是与 m 互素的 1 到 m 之间整数的个数；φ(p) = p − 1，φ(pq) = (p−1)(q−1)。' }
    ] },

    { t: 'keypoint', items: [
      { title: '余数区间决定唯一性', html: 'a = bq + r 只有加上 0 ≤ r &lt; b 才有唯一解；−17 对 5 的数学余数是 3，不是 C 语言给出的 −2。' },
      { title: 'gcd 靠等式传递', html: 'gcd(a,b) = gcd(b, a mod b)，因为两对数的公共因子集合完全相同；最后非零余数即答案。' },
      { title: '贝祖等式给出逆元', html: '把 1 = as + mt 里的 s 取模 m，就得到 a 的模逆；这正是扩展欧几里得算法的用途。' },
      { title: 'ax ≡ b (mod m) 先算 gcd', html: 'gcd(a,m) 必须整除 b 才有解；有解时解数为 gcd(a,m)，其余解在模 m 下均匀分布。' },
      { title: '指数不能对模数取模', html: '3<sup>13</sup> mod 7 要按二进制反复平方算，或按费马把指数对 p−1 取模，不能对 7 取模。' },
      { title: '费马检验只是必要条件', html: '341 = 11 × 31 满足 2<sup>340</sup> ≡ 1，所以通过一次检验不能宣称是素数。' },
      { title: 'RSA 的正确性来自欧拉定理', html: 'ed ≡ 1 (mod φ(n)) 使 m<sup>ed</sup> ≡ m；安全性来自大整数分解目前没有高效算法。' }
    ] },

    { t: 'checklist', id: 'ch04', items: [
      '我能对负被除数写出满足 0 ≤ r &lt; b 的商与余数，并解释另外两种写法为什么不合定义',
      '我能说出 C 语言与 Python 对负数取模结果不同的原因，以及写哈希时该怎么兜底',
      '我能用欧几里得算法手算 gcd(252, 105)，并数出用了多少次除法',
      '我能用扩展欧几里得算法把 gcd 写成贝祖等式，并读出两个系数',
      '我能判断 6x ≡ 9 (mod 15) 有几个解，并把它们全部列出来',
      '我能用扩展欧几里得算法求 17<sup>−1</sup> mod 43，并用乘法验证结果',
      '我能解三条模数两两互素的同余方程，并说明唯一性用到了哪条性质',
      '我能用反复平方算 3<sup>13</sup> mod 7，并说出为什么不能把指数对 7 取模',
      '我能复述 RSA 的密钥生成与加解密过程，并指出欧拉定理用在哪一步',
      '我能解释哈希表长度取素数为什么比取 2 的幂冲突更少'
    ] },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章依据 CUHKSZ CSC3001 教学大纲第 6–7 周，以及 Rosen《离散数学及其应用》第 4 章（整除、同余、中国剩余定理、费马小定理、密码学）；CLRS《算法导论》第 31 章给出欧几里得算法与模幂的算法复杂度分析，可作对照。本章覆盖整除与带余除法、gcd 与欧几里得算法、线性同余方程与模逆、模运算规则与中国剩余定理、费马小定理与欧拉定理、密码与哈希中的应用六块。没有展开的内容包括：素性检验的完整算法（Miller–Rabin 的判定细节）、大整数分解算法（二次筛、数域筛）、以及离散对数与椭圆曲线密码；这些在密码学专门课程里展开。若只记三件事：带余除法的唯一性靠区间，模逆靠扩展欧几里得，RSA 的正确性靠欧拉定理。' }
  ]
});
