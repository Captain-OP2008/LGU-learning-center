/* =====================================================================
 * ch05.js · 第 5 章「函数依赖与范式」
 * 职责：从冗余导致的三类异常出发，用函数依赖与属性闭包判定候选键，
 *       求最小覆盖，讲清 BCNF 与 3NF 的分解算法与取舍。
 * 依据：CSC3170 讲义 Functional Dependencies & Normalization 部分（Part 12–14）。
 * schema：CSC.registerChapter({ id, num, title, en, goals, kp, blocks })
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch05',
  num: '05',
  title: '函数依赖与范式',
  en: 'FUNCTIONAL DEPENDENCIES & NORMAL FORMS',
  goals: [
    '用插入、删除、更新三类异常说明「表设计不好」到底会坏在哪里',
    '写出函数依赖并用 Armstrong 公理推导新的依赖，判断一组依赖是否等价',
    '用属性闭包算法求出全部候选键，并识别「什么都不在右部」的属性必须进键',
    '把依赖集化简成最小覆盖，并用它做 BCNF 与 3NF 分解',
    '判断一次分解是否无损连接、是否保持依赖，并在范式与查询性能之间做有理由的取舍'
  ],
  kp: [
    { id: 'ch05-1', title: '冗余与三类异常' },
    { id: 'ch05-2', title: '函数依赖与 Armstrong 公理' },
    { id: 'ch05-3', title: '属性闭包与候选键求解' },
    { id: 'ch05-4', title: '最小覆盖：把依赖集化简' },
    { id: 'ch05-5', title: 'BCNF：每个决定因素都是超键' },
    { id: 'ch05-6', title: '3NF：保持依赖的折中' },
    { id: 'ch05-7', title: '无损连接判定与反范式的工程权衡' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '为什么要有「范式」这套理论', html: '范式（normal form）不是学院派的美学标准，它对应三类能直接造成事故的问题：<b>同一个事实存了两份，改一份忘了另一份</b>（更新异常）；<b>删掉最后一条记录，顺带删掉了唯一的事实</b>（删除异常）；<b>想插入一个事实，却被迫填一堆还不存在的值</b>（插入异常）。这一章给你一套可执行的判定与分解流程，让你在看到一张表时能说出「它坏在哪里、该拆成几张、拆完会不会丢信息」。' },

    { t: 'p', lead: true, html: '第 1 章讲 ER 转换时提过「一对多不要塞进一张表」，那只是经验。这一章把它变成<b>可证明的算法</b>：用函数依赖描述「什么决定什么」，用闭包求候选键，用最小覆盖做分解，最后用无损连接与依赖保持两个判据验收。整个过程是机械的，考试与工程都靠它。' },

    { t: 'h', lvl: 2, text: '一、冗余与三类异常', id: 'ch05-1' },

    { t: 'p', html: '先看一张「什么都放一起」的表：<code>grade_sheet(sid, sname, dept, dept_head, cid, ctitle, grade)</code>。它把学生信息、系主任、课程名、成绩全部塞在一张表里。看起来方便——查一个学生的全部信息不用连接——但它违反了一条基本原则：<b>一行只能描述一个事实</b>。这里一行同时描述了「学生属于哪个系」「系主任是谁」「课程叫什么」「某人某课得了多少分」四件事。' },

    { t: 'p', html: '后果立刻出现。<b>更新异常（update anomaly）</b>：计算机系换了系主任，要改这张表里该系所有学生的所有选课行；漏改一行，数据库里就同时存在两个系主任。<b>删除异常（delete anomaly）</b>：某学生退掉全部课程，删掉他的选课行，顺带把「他是计算机系学生」这个事实也删了。<b>插入异常（insert anomaly）</b>：新开一门课还没人选，无法插入——<code>sid</code> 是主键的一部分，不能为空。' },

    { t: 'table', caption: '一张未规范化的表：三类异常各自的具体表现', head: ['异常', '触发动作', '后果', '损失的信息'], rows: [
      ['更新', '改系主任姓名', '同一事实存了 N 份，容易只改一部分', '一致性'],
      ['删除', '删掉学生最后一条选课', '连带丢失学生与院系归属', '无关的事实'],
      ['插入', '新开一门无人选的课', '主键含 sid，无法插入', '合法的事实'],
      ['空间', '同一学生选 6 门课', '姓名与系名重复 6 次', '存储与缓存效率']
    ] },

    { t: 'p', html: '注意第四行——冗余本身也是问题，但它是<b>最不重要的那个</b>。存储便宜，真正致命的是前三类：它们会让数据库<b>说出自相矛盾的话</b>。范式理论的全部目标就是消除这三类异常，代价是查询要多做几次连接。' },

    { t: 'h', lvl: 2, text: '二、函数依赖与 Armstrong 公理', id: 'ch05-2' },

    { t: 'p', html: '<b>函数依赖（functional dependency, FD）</b>写作 <code>X → Y</code>，含义是：在该关系的任何合法实例中，<b>任意两个元组只要在 X 上的取值相同，在 Y 上的取值也必然相同</b>。例如 <code>sid → sname</code>：学号定了，姓名就定了。反过来不成立：同名不同人很常见。' },

    { t: 'p', html: '判断一条 FD 是否成立，要问「这两个属性之间是否存在<b>语义上的</b>决定关系」，而不是「现在这张表里恰好没有反例」。样本数据只能<b>否证</b>依赖，永远不能证明它。这是本章最容易失分的地方：给你一张小表让你「找出所有 FD」，正确答案往往是「只能确定这几条，其余无法从数据推出」。' },

    { t: 'p', html: 'Armstrong 公理是三条推理规则，它们<b>完备且可靠</b>：由一组 FD 用这三条能推出的，恰好是所有逻辑蕴含的 FD。<b>自反律</b>：若 Y ⊆ X，则 X → Y（平凡依赖）。<b>增广律</b>：若 X → Y，则 XZ → YZ。<b>传递律</b>：若 X → Y 且 Y → Z，则 X → Z。常用的三条导出规则——并（X→Y, X→Z ⇒ X→YZ）、分解（X→YZ ⇒ X→Y）、伪传递（X→Y, WY→Z ⇒ WX→Z）——都可以由公理推出，直接用即可。' },

    { t: 'p', html: '还有两个概念要分清。<b>平凡依赖</b>：右部是左部子集，如 <code>sid, cid → sid</code>，恒成立、没有信息量，求最小覆盖时要删掉。<b>完全/部分函数依赖</b>：若 X → Y 但存在 X 的真子集 X&#39; 也能决定 Y，则 Y <b>部分依赖</b>于 X；否则是<b>完全依赖</b>。部分依赖是 2NF 要消灭的对象，而 2NF 只是通向 3NF 的中间站，所以课程通常直接讲 3NF 与 BCNF。' },

    { t: 'h', lvl: 2, text: '三、属性闭包与候选键求解', id: 'ch05-3' },

    { t: 'p', html: '<b>属性闭包（attribute closure）X⁺</b> 是从 X 出发，反复用给定 FD 往右推，能推出的全部属性集合。算法很机械：把 X⁺ 初始化为 X；扫一遍所有 FD，只要左部 ⊆ X⁺，就把右部并进 X⁺；重复直到不再增长。' },

    { t: 'steps', items: [
      { title: '第一步：把属性分类', html: '看每条 FD 的左右部。<b>从不出现在右部</b>的属性必须出现在每个候选键里；<b>从不出现在左部</b>的属性不可能由别人推出，也必须在键里。' },
      { title: '第二步：从「必含属性」出发求闭包', html: '设必含集为 X，算 X⁺。若 X⁺ 覆盖全部属性，X 就是唯一的候选键，结束。' },
      { title: '第三步：逐个添加剩余属性', html: '若 X⁺ 不全，把剩余属性逐个加入 X 再求闭包，覆盖全部的即为超键。' },
      { title: '第四步：检验极小性', html: '对每个超键，逐个去掉一个属性重求闭包；若仍覆盖全部，则它不是候选键。' }
    ] },

    { t: 'p', html: '拿上面的例子练一遍。设 <code>R(sid, sname, dept, dept_head, cid, grade)</code>，FD 为：<code>sid → sname, dept</code>；<code>dept → dept_head</code>；<code>sid, cid → grade</code>。先分类：<code>cid</code> 从不在右部，<code>grade</code> 只在右部——所以 <code>sid</code> 与 <code>cid</code> 都必须在键里（<code>sid</code> 是左部常客但从未被决定，也要进键）。从 <code>{sid, cid}</code> 求闭包：由 <code>sid → sname, dept</code> 得 <code>sname, dept</code>；由 <code>dept → dept_head</code> 得 <code>dept_head</code>；由 <code>sid, cid → grade</code> 得 <code>grade</code>。全了，所以候选键是 <code>{sid, cid}</code>，且唯一。' },

    { t: 'code', lang: 'text', caption: '闭包算法的过程记录：一眼看出候选键', code: `R(sid, sname, dept, dept_head, cid, grade)
F = { sid -> sname, dept
      dept -> dept_head
      sid, cid -> grade }

X = {sid, cid}
X+ = {sid, cid}
  sid -> sname, dept      => {sid, cid, sname, dept}
  dept -> dept_head       => {sid, cid, sname, dept, dept_head}
  sid, cid -> grade       => 全部 6 个属性  => {sid, cid} 是超键
去掉 sid: {cid}+ = {cid}      不全  => 极小
去掉 cid: {sid}+  = {sid,sname,dept,dept_head} 无 grade => 极小
结论：唯一候选键 (sid, cid)` },

    { t: 'p', html: '注意 <code>{sid}</code> 的闭包只差 <code>cid</code> 与 <code>grade</code>，这也说明 <code>grade</code> 对 <code>{sid, cid}</code> 是<b>完全依赖</b>——两列缺一不可。而 <code>sname</code>、<code>dept</code> 只依赖 <code>sid</code>，对 <code>{sid, cid}</code> 是<b>部分依赖</b>。只要看到部分依赖，这张表就在 2NF 之下，必须拆。' },

    { t: 'h', lvl: 2, text: '四、最小覆盖：把依赖集化简', id: 'ch05-4' },

    { t: 'p', html: '<b>最小覆盖（minimal cover / canonical cover）</b>是与原依赖集等价、且满足三个条件的最小集合：每条 FD 的右部只有一个属性；左部没有多余属性；没有多余的 FD（去掉任何一条都会改变闭包）。它是 3NF 合成算法的输入，考试里常单独考一步。' },

    { t: 'p', html: '化简分三步，顺序不能颠倒。<b>第一步，右部单一化</b>：<code>X → AB</code> 拆成 <code>X → A</code> 与 <code>X → B</code>。<b>第二步，删左部冗余属性</b>：对 <code>XA → B</code>，若把 <code>X</code> 换成 <code>XA</code> 的真子集后仍能推出 <code>B</code>（用剩余 FD 求闭包验证），就删掉 <code>A</code>。<b>第三步，删冗余 FD</b>：尝试去掉某条 FD，若它在剩余集合下的闭包仍与原集合相同，就永久删掉。' },

    { t: 'code', lang: 'text', caption: '最小覆盖三步走：从 5 条化简到 2 条', code: `F = { A -> BC,  B -> C,  A -> B,  AB -> C }

第一步 右部单一化
  A -> B,  A -> C,  B -> C,  A -> B,  AB -> C
  去重后：A -> B,  A -> C,  B -> C,  AB -> C

第二步 删左部冗余
  看 AB -> C：只留 A 时 A+ = {A,B,C} 含 C，故删 B  => A -> C
  此时与已有的 A -> C 重复，删掉一条

第三步 删冗余 FD
  A -> C 能否由 A -> B, B -> C 推出？能（传递律）=> 删除
结果：A -> B,  B -> C` },

    { t: 'p', html: '最小覆盖不唯一——删除顺序不同可能得到不同但等价的集合。这不影响正确性，因为 3NF 合成只要求「用某一个最小覆盖」，不同答案可能给出不同的表结构但都满足 3NF。考试若要求唯一答案，题目通常会指定化简顺序。' },

    { t: 'h', lvl: 2, text: '五、BCNF：每个决定因素都是超键', id: 'ch05-5' },

    { t: 'p', html: '<b>BCNF（Boyce-Codd normal form）</b>的定义只有一句：对每条非平凡 FD <code>X → Y</code>，<b>X 必须是超键</b>。换句话说，任何能「决定别人」的属性组，本身必须能唯一确定整行。这个定义非常强，它直接排除了所有部分依赖与传递依赖。' },

    { t: 'p', html: '判定方法：先求全部候选键，再逐条检查 FD 的左部是否包含某个候选键。上面的例子中 <code>dept → dept_head</code> 的左部 <code>dept</code> 不是超键（一个系有很多学生），所以那张表<b>不在 BCNF</b>。' },

    { t: 'p', html: 'BCNF 分解算法是递归的：找到一条违反的 FD <code>X → Y</code>（<code>X</code> 不是超键），把 <code>R</code> 拆成 <code>R1 = X ∪ Y</code> 与 <code>R2 = R − Y</code>（<code>X</code> 保留在两边作为连接属性），对 <code>R1</code>、<code>R2</code> 递归检查直到都满足 BCNF。<b>这个算法保证无损连接，但不保证保持依赖</b>——这就是 BCNF 的代价。' },

    { t: 'code', lang: 'text', caption: 'BCNF 分解：一次拆成三张表', code: `R(sid, sname, dept, dept_head, cid, grade)
候选键 (sid, cid)；违反的 FD：dept -> dept_head（dept 不是超键）

第 1 次分解  R1 = {dept, dept_head}          R2 = {sid, sname, dept, cid, grade}
第 2 次分解  在 R2 中 sid -> sname, dept 违反（sid 不是 R2 的超键）
             R21 = {sid, sname, dept}         R22 = {sid, cid, grade}
第 3 次检查  R21 中 sid -> sname, dept，sid 是键，OK
             R22 中 sid, cid -> grade，{sid,cid} 是键，OK

结果三张表：dept(dept, dept_head) / student(sid, sname, dept) / enroll(sid, cid, grade)` },

    { t: 'p', html: '检查结果：拆完以后，改系主任只需改 <code>dept</code> 表一行；删掉学生的所有选课只影响 <code>enroll</code>，学生与院系归属还在；新开一门无人选的课可以直接插入 <code>course</code> 表。三类异常全部消失——<b>这就是范式的实际收益，不是抽象的美感</b>。' },

    { t: 'h', lvl: 2, text: '六、3NF：保持依赖的折中', id: 'ch05-6' },

    { t: 'p', html: '某些依赖集在 BCNF 下<b>无法保持依赖</b>。经典反例：<code>R(student, course, teacher)</code>，约束是「每个学生每门课只有一位老师」与「每位老师只教一门课」，即 <code>{student, course} → teacher</code> 与 <code>teacher → course</code>。候选键是 <code>{student, course}</code> 与 <code>{student, teacher}</code>。<code>teacher → course</code> 的左部不是超键，违反 BCNF。' },

    { t: 'p', html: '强行分解只能得到 <code>{student, teacher}</code> 与 <code>{teacher, course}</code>，而原来的 <code>{student, course} → teacher</code> 变成跨表的约束，任何一张单表都无法表达它——<b>依赖丢了</b>，只能靠触发器或应用逻辑补，而这正是 ch04 说过的「弱化」方案。' },

    { t: 'p', html: '3NF 放宽了条件来换回依赖保持：对每条非平凡 FD <code>X → Y</code>，要么 <code>X</code> 是超键，要么 <b>Y 的每个属性都属于某个候选键</b>（这类属性叫主属性）。上面例子里 <code>course</code> 是候选键 <code>{student, course}</code> 的成员，属主属性，于是整个关系直接满足 3NF，不必分解。<b>一句话记住差别：3NF 允许「主属性」被非超键决定，BCNF 一律不允许</b>。' },

    { t: 'table', caption: 'BCNF 与 3NF：两个判据的取舍', head: ['维度', 'BCNF', '3NF'], rows: [
      ['条件', '每条非平凡 FD 的左部都是超键', '左部是超键，或右部全是主属性'],
      ['冗余', '最少，理论最优', '可能残留少量冗余'],
      ['无损连接', '分解算法保证', '合成算法保证'],
      ['保持依赖', '不保证，可能需要触发器补', '保证，每个 FD 都落在某张表里'],
      ['实践选择', '默认目标', '当 BCNF 会丢依赖时的退路']
    ] },

    { t: 'p', html: '3NF 的<b>合成算法</b>比 BCNF 的分解算法更机械：先求最小覆盖，然后<b>为每条 FD 建一张表</b>（表结构就是 <code>X ∪ Y</code>），最后若没有任何一张表包含候选键，就<b>额外加一张只含候选键的表</b>。这三步保证无损连接且保持依赖，结果是 3NF。加候选键表那一步不能漏，否则可能连「同一行」都无法区分。' },

    { t: 'h', lvl: 2, text: '七、无损连接判定与反范式的工程权衡', id: 'ch05-7' },

    { t: 'p', html: '分解必须满足两个性质才算合格。<b>无损连接（lossless join）</b>：把拆开的表自然连接回来，必须<b>恰好</b>得到原表，不多不少。判定定理很短：把 <code>R</code> 分解为 <code>R1</code> 与 <code>R2</code>，若 <code>R1 ∩ R2 → R1</code> 或 <code>R1 ∩ R2 → R2</code> 成立，则分解无损。<b>依赖保持（dependency preservation）</b>：原依赖集里的每条 FD，都能由分解后各表上的 FD 联合推出。' },

    { t: 'p', html: '「无损」这个词容易误解：它不是说「数据不丢」，而是说「连接后<b>不产生多余的行</b>」。有损分解的典型症状是连接后行数变多——把 <code>(sid, sname, dept)</code> 拆成 <code>(sid, sname)</code> 与 <code>(sname, dept)</code>，一旦有同名不同系的学生，连接就会造出并不存在的组合。<b>连接属性必须是原表的超键或包含它</b>，这就是判定定理的直观含义。' },

    { t: 'p', html: '最后必须说清工程现实：<b>范式不是越高越好</b>。完全规范化的 schema 查一条报表要连接七八张表，代价可能高到不可接受。真实系统里的常见做法是<b>分层</b>：<b>OLTP 主库严格 3NF/BCNF</b>，保证写入正确；<b>报表与分析层用星型模式（star schema）</b>，把维度表故意冗余成宽表，甚至预聚合成物化视图，用空间换查询速度。这叫<b>反范式（denormalization）</b>——注意它是「<b>先规范化，再有意地、有理由地退化</b>」，不是「一开始就懒得拆」。两者的区别在于：前者知道冗余在哪、由谁负责保持一致；后者只是把三类异常留在了系统里。' },

    { t: 'p', html: '考试里最容易失分的不是算法本身，而是<b>没有先把 FD 清单写全</b>。给一道「求 R 的最高范式」的题，正确的顺序是：<b>①</b> 把题目里的每句话翻译成一条 FD（「每个学生属于一个系」就是 <code>sid → dept</code>）；<b>②</b> 用属性闭包求出全部候选键，写清楚推导过程；<b>③</b> 逐条检查 FD 的左部是不是超键——全是则是 BCNF，否则找出违反的那条；<b>④</b> 若不是 BCNF，再看是否只有「左部为候选键的一部分、右部为主属性」这类可容忍的违反，是则 3NF；<b>⑤</b> 最后才动手分解。跳过第 ② 步直接凭直觉拆表，几乎一定会漏掉一个候选键，或者拆出有损的连接。' },

    { t: 'p', html: 'BCNF 与 3NF 之间还有一个更隐蔽的层次，叫<b>第四范式（4NF）</b>，它处理的是<b>多值依赖（multivalued dependency）</b>而不是函数依赖。典型例子：一个教师可以教多门课，也可以参加多个项目，这两个「多」彼此独立。若把它们放进同一张 <code>teach(tid, cid, pid)</code> 表，为了保持所有组合，教 3 门课、参加 2 个项目的老师就必须写 3×2 = 6 行——这既不是插入异常也不是更新异常，而是<b>组合爆炸式的冗余</b>。判据很直接：<code>tid ↠ cid</code> 成立而 <code>tid → cid</code> 不成立，说明该表存在多值依赖；只要把 <code>(tid, cid)</code> 与 <code>(tid, pid)</code> 拆成两张表，冗余立刻消失，且分解是无损的。4NF 的要求是：每条非平凡多值依赖的左部都必须是超键。这一层在实际项目中很少单独考，但「独立的多值属性不要塞进一张表」这条直觉，正是从这里来的。' },

    { t: 'terms', items: [
      { en: 'functional dependency', zh: '函数依赖', html: 'X → Y：X 相同则 Y 必相同；只能由语义判定，数据只能否证。' },
      { en: "Armstrong's axioms", zh: 'Armstrong 公理', html: '自反、增广、传递三条，完备且可靠，可推出并、分解、伪传递。' },
      { en: 'attribute closure', zh: '属性闭包', html: 'X⁺ 是从 X 用 FD 能推出的全部属性，覆盖全表即为超键。' },
      { en: 'minimal cover', zh: '最小覆盖', html: '右部单一、左部无冗余、无多余 FD 的等价依赖集，3NF 合成的输入。' },
      { en: 'BCNF', zh: 'BCNF', html: '每条非平凡 FD 的左部都是超键；分解保证无损但不保证保持依赖。' },
      { en: '3NF', zh: '第三范式', html: '左部是超键或右部全为主属性；合成算法同时保证无损与保持依赖。' },
      { en: 'lossless join', zh: '无损连接', html: '连接回来恰好等于原表；判据是 R1 ∩ R2 → R1 或 → R2。' },
      { en: 'denormalization', zh: '反范式', html: '先规范化、再有理由地退化，用于报表层以空间换查询速度。' }
    ] },

    { t: 'quiz', qid: 'ch05-q1' },
    { t: 'quiz', qid: 'ch05-q2' },
    { t: 'quiz', qid: 'ch05-q3' },

    { t: 'keypoint', items: [
      { title: '三类异常才是范式的动机', html: '更新异常丢一致性、删除异常丢无关事实、插入异常阻止合法事实入库；冗余只是最轻的那个。' },
      { title: 'FD 靠语义判定，数据只能否证', html: '小样本表里没有反例，不代表依赖成立；考试看到「根据数据找 FD」要警惕。' },
      { title: '闭包求键，先分类再验证极小', html: '从不出现在右部的属性必须进键；闭包覆盖全表即超键，逐个去属性检验极小性。' },
      { title: '最小覆盖三步不可换序', html: '右部单一化 → 删左部冗余 → 删冗余 FD；结果不唯一但都等价。' },
      { title: 'BCNF 强但可能丢依赖', html: '分解算法保证无损，teacher → course 这类反例必须退到 3NF 才能保持依赖。' },
      { title: '反范式要先规范化再退化', html: 'OLTP 用 3NF/BCNF，报表层用星型与物化视图；区别在于是否知道冗余由谁维护。' }
    ] },

    { t: 'checklist', id: 'ch05', items: [
      '我能用一张具体的宽表说明更新异常、删除异常、插入异常各自怎么发生',
      '我能判断一条 FD 是否平凡，并说明为什么平凡依赖在最小覆盖里要删掉',
      '我能用 Armstrong 公理推出并、分解、伪传递三条规则',
      '我能对给定 R 与 FD 集求属性闭包，并据此找出全部候选键',
      '我能说出「从不出现在右部的属性必须进键」的理由',
      '我能把一组 FD 化简成最小覆盖，并复述三步的顺序与原因',
      '我能检查一个关系是否满足 BCNF，并写出分解后的表结构',
      '我能解释 BCNF 为什么可能丢依赖，并说出 3NF 的放宽条件',
      '我能用 R1 ∩ R2 → R1 判定分解是否无损，并说明反范式与「懒得拆」的区别'
    ] },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章依据 CSC3170 讲义 Functional Dependencies and Normalization 部分（Part 12–14）组织，覆盖三类异常、函数依赖与 Armstrong 公理、属性闭包与候选键、最小覆盖、BCNF 与 3NF 的判定与分解、无损连接与依赖保持、反范式实践。<b>范围说明</b>：多值依赖与 4NF 只在此提及名称，未展开判定算法；2NF 作为 3NF 的中间概念一句话带过，因为消除部分依赖已包含在 3NF 与 BCNF 的条件里。示例中的分解结果不是唯一解，凡按算法逐步推导得到的等价结果均可接受；考试若要求唯一答案，题目会指定化简顺序。' }
  ]
});
