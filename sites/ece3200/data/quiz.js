/* =====================================================================
 * quiz.js · ECE3200 分章题库
 * 结构：{ items:[{ id, ch, kp, tier, type, difficulty, tags, stem,
 *                  options?, answer?, accept?, code?, codeTitle?, explain }] }
 * 题型：mcq / tf / fill / multi / predict
 * 覆盖：ch00–ch07，每章 7 题，共 56 题
 * ===================================================================== */
(function () {
  'use strict';

  var PACK = {
    items: [
      /* ---------------- ch00 课程地图 ---------------- */
      {
        id: 'ch00-q1', ch: 'ch00', kp: 'ch00-2', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '本站八章的组织顺序，下面哪条描述最准确？',
        options: [
          { text: '先学美术与建模，再学编程，最后做关卡' },
          { text: '课程全景与 Unity 模型 → 玩法与 MDA → Unity/C# 基础 → 物理 → 2D 与 2.5D → 3D 世界 → UI 与反馈 → 3D 进阶与交付', correct: true },
          { text: '先做期末项目，再回头补理论' },
          { text: '按考试题型排序：选择题 → 简答题 → 编程题' }
        ],
        explain: '八章是一条递进链：先建立「这门课在解决什么问题」的地图（ch00），再谈玩法与体验（ch01）；有了设计意图才谈实现，于是进入 Unity 与 C#（ch02）、物理（ch03）、2D 与 2.5D（ch04）、3D 世界（ch05）；系统能跑之后补 UI 与反馈（ch06），最后收束到性能、打包与演示（ch07）。顺序是「意图 → 手段 → 打磨 → 交付」。'
      },
      {
        id: 'ch00-q2', ch: 'ch00', kp: 'ch00-6', tier: 1, type: 'tf', difficulty: 1,
        tags: ['tool'],
        stem: 'Unity 工程里的 Assets 目录应当整体纳入版本管理，包括自动生成的 Library 与 Temp 目录。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: 'Library、Temp、Logs、obj 都是 Unity 自动生成的缓存，纳入版本管理会让仓库膨胀、冲突不断，而且换机器后本来就会重建。应当只提交 Assets、ProjectSettings、Packages 以及正确的 .gitignore。Assets 内部的 .meta 文件则必须提交，否则 GUID 会变、引用会丢。'
      },
      {
        id: 'ch00-q3', ch: 'ch00', kp: 'ch00-3', tier: 1, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '本站把课程内容归成三条主线，下面哪些属于这三条？（多选）',
        options: [
          { text: '规则：游戏系统的机制与判定', correct: true },
          { text: '实现：用 Unity 与 C# 把规则跑起来', correct: true },
          { text: '体验：玩家实际感受到的节奏与反馈', correct: true },
          { text: '发行：商店上架与市场推广' },
          { text: '硬件：显卡驱动与主机移植' }
        ],
        explain: '三条主线是规则、实现、体验：规则回答「怎么判定输赢」，实现回答「怎么让它跑起来」，体验回答「玩家感觉如何」。发行与硬件不在本课范围。三条主线互相牵制——规则设计得再妙，实现不了也白搭；实现得再稳，体验不好也没人玩。'
      },
      {
        id: 'ch00-q4', ch: 'ch00', kp: 'ch00-4', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '关于 Unity 的 GameObject–Component 模型，下面哪句最准确？',
        options: [
          { text: 'GameObject 是场景里的「容器」，自身几乎没有行为；行为由挂在上面的 Component 提供' , correct: true },
          { text: 'GameObject 就是脚本，脚本就是 GameObject' },
          { text: '一个 GameObject 只能挂一个 Component' },
          { text: 'Component 必须继承 MonoBehaviour 才能存在' }
        ],
        explain: 'GameObject 是空容器，只提供名字、标签、层与变换；Transform、Renderer、Collider、自定义脚本都是 Component。行为来自组件的组合，所以同一个对象可以既是「会移动的」又是「会受伤的」。一个对象可以挂任意多个组件，但同一类型的某些组件（如 Transform）只能有一个。'
      },
      {
        id: 'ch00-q5', ch: 'ch00', kp: 'ch00-5', tier: 1, type: 'fill', difficulty: 2,
        tags: ['concept'],
        stem: '从空场景做出「能操控、能胜利、能失败」的最小可玩闭环，本站把它概括为三个环节：输入 → ① → 反馈。①处应填什么？',
        answer: '规则判定',
        accept: ['规则', '判定', '规则判定', '状态更新'],
        explain: '最小闭环是「输入 → 规则判定 → 反馈」。玩家按键（输入），系统按规则改变状态（判定：碰到金币就加分、血量归零就失败），再通过画面与声音把结果告诉玩家（反馈）。缺少判定，输入与反馈之间就没有因果；缺少反馈，玩家不知道自己的操作有没有生效。'
      },
      {
        id: 'ch00-q6', ch: 'ch00', kp: 'ch00-7', tier: 2, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: '本课的 Lab 与作业是彼此独立的练习，做不做都不影响期末项目。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: 'Lab 是按周推进的技术台阶：每个 Lab 练的正是期末项目要用的那一块（场景搭建、物理、2D、3D、UI）。跳过 Lab 直接做项目，通常会在某个具体机制上卡住，然后把时间耗在补基础上。正确做法是把 Lab 的产物直接留作项目的零件。'
      },
      {
        id: 'ch00-q7', ch: 'ch00', kp: 'ch00-8', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '学完一章后，最有效的下一步是什么？',
        options: [
          { text: '立刻看下一章的视频' },
          { text: '合上正文做自检清单，再挑一个里程碑动手实现', correct: true },
          { text: '把本章代码原样抄一遍' },
          { text: '只背术语表里的英文缩写' }
        ],
        explain: '自检清单能暴露「以为懂了其实说不清」的地方，动手实现则把这些点变成能跑通的代码。抄代码不产生理解，跳过自检会把漏洞带到后面章节。判断是否真懂的标准是：能不能不看资料，向别人解释这段机制为什么这样设计。'
      },

      /* ---------------- ch01 游戏与玩法 ---------------- */
      {
        id: 'ch01-q1', ch: 'ch01', kp: 'ch01-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '下面哪一组是本站所说的「游戏四要素」？',
        options: [
          { text: '目标、规则、挑战、反馈', correct: true },
          { text: '画面、音乐、剧情、角色' },
          { text: '引擎、脚本、资源、平台' },
          { text: '玩家、手柄、屏幕、网络' }
        ],
        explain: '四要素是目标（玩家要达成什么）、规则（允许与禁止什么）、挑战（阻力从哪来）、反馈（结果如何被告知）。画面与音乐属于表现层，能增强体验但不是游戏成立的必要条件——围棋没有画面也一样是游戏。用四要素检查自己的原型，缺哪一项就补哪一项。'
      },
      {
        id: 'ch01-q2', ch: 'ch01', kp: 'ch01-2', tier: 1, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: 'MDA 框架中的「机制（Mechanics）」指的是玩家在游玩时实际产生的行为模式。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: 'MDA 三层是 Mechanics（规则与数据）、Dynamics（规则运行时产生的动态行为）、Aesthetics（玩家体验到的感受）。「玩家实际产生的行为模式」是 Dynamics，不是 Mechanics。设计师从机制入手、玩家从体验入手，两者在动态层相遇——这正是调试体验时要顺着动态往回找机制的原因。'
      },
      {
        id: 'ch01-q3', ch: 'ch01', kp: 'ch01-4', tier: 2, type: 'multi', difficulty: 2,
        tags: ['design'],
        stem: '下面哪些做法能让一个选择变得「有意义」？（多选）',
        options: [
          { text: '不同选项带来可感知的后果差异', correct: true },
          { text: '选项之间存在取舍，不能全都拿到', correct: true },
          { text: '玩家在做选择前能获得判断所需的信息', correct: true },
          { text: '选项的结果完全随机，玩家无法预测' },
          { text: '正确选项只有一个，选错就重来' }
        ],
        explain: '有意义的选择要满足三条：后果可感知、存在取舍、信息足以判断。完全随机让选择退化成赌博，玩家不会为「运气」负责；只有一个正确答案且选错就重来，则是把选择变成了考试。好的选择往往没有标准答案，只有适合当前局势的权衡。'
      },
      {
        id: 'ch01-q4', ch: 'ch01', kp: 'ch01-5', tier: 2, type: 'predict', difficulty: 2,
        tags: ['code'],
        code: 'public class LivesRule : MonoBehaviour\n{\n    public int lives = 3;\n    public event System.Action<int> OnLivesChanged;\n\n    public void LoseLife()\n    {\n        lives--;\n        OnLivesChanged?.Invoke(lives);\n        if (lives <= 0) Debug.Log("Game Over");\n    }\n}',
        stem: '调用一次 LoseLife() 之后，控制台会输出什么？',
        answer: 'Game Over',
        accept: ['Game Over', 'game over'],
        explain: '初始 lives = 3，减一后为 2，不满足 lives <= 0，所以只触发事件、不打印 Game Over。要触发需要连续调用三次。这里的关键设计是「规则」与「表现」分离：LivesRule 只负责改数字并广播，UI 通过订阅 OnLivesChanged 自行更新，规则不需要知道界面的存在。'
      },
      {
        id: 'ch01-q5', ch: 'ch01', kp: 'ch01-7', tier: 1, type: 'fill', difficulty: 2,
        tags: ['design'],
        stem: '本站把难度拆成三种类型：执行难度、决策难度与 ① 难度。①处应填什么？',
        answer: '知识',
        accept: ['知识', '认知', 'knowledge'],
        explain: '执行难度考验手速与精度（跳跃时机），决策难度考验判断（先打谁、走哪条路），知识难度考验理解（不知道这个敌人怕火）。三者要分开调：手速型玩家怕执行难度，策略型玩家怕决策难度，新手最怕知识难度。混在一起调，往往越调越糟。'
      },
      {
        id: 'ch01-q6', ch: 'ch01', kp: 'ch01-6', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['design'],
        stem: '按自我决定理论，下面哪一组是支撑内在动机的三种心理需求？',
        options: [
          { text: '自主、胜任、归属', correct: true },
          { text: '奖励、排名、惩罚' },
          { text: '画面、音效、剧情' },
          { text: '难度、时长、价格' }
        ],
        explain: '自主（我的选择有影响）、胜任（我能变强）、归属（我与他人有连接）是内在动机的三根支柱。积分与排行榜属于外在奖励，短期有效但可能挤走内在动机——玩家会为了奖励而玩，奖励一撤就散。设计时先问「这三根支柱哪根最弱」。'
      },
      {
        id: 'ch01-q7', ch: 'ch01', kp: 'ch01-8', tier: 2, type: 'tf', difficulty: 2,
        tags: ['design'],
        stem: '纸面原型阶段就应当把美术资源做到接近成品，否则试玩者无法判断好不好玩。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '纸面原型的目的恰恰是剥离美术，只看规则与决策是否成立。方块与圆圈足够表达「谁在哪里、能做什么」。过早投入美术有两个坏处：一是时间成本高，二是漂亮的外表会掩盖机制的空洞，试玩者不好意思说「不好玩」。先验证规则，再投资表现。'
      },

      /* ---------------- ch02 Unity 与 C# ---------------- */
      {
        id: 'ch02-q1', ch: 'ch02', kp: 'ch02-3', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '一个 MonoBehaviour 从被加载到第一帧更新，下面哪个顺序是正确的？',
        options: [
          { text: 'Awake → OnEnable → Start → Update', correct: true },
          { text: 'Start → Awake → Update → OnEnable' },
          { text: 'Update → Start → Awake → OnEnable' },
          { text: 'OnEnable → Start → Awake → Update' }
        ],
        explain: 'Awake 在对象实例化时调用（无论是否启用），用于建立自身引用；OnEnable 在启用时调用，用于订阅事件；Start 在第一帧 Update 之前调用一次，用于依赖其他对象已初始化的逻辑；Update 每帧调用。把「找别的对象」写在 Awake 里，常因对方尚未初始化而拿到 null。'
      },
      {
        id: 'ch02-q2', ch: 'ch02', kp: 'ch02-5', tier: 1, type: 'tf', difficulty: 1,
        tags: ['concept'],
        stem: '物理相关的计算（如给刚体施加力）应当放在 FixedUpdate 里，而不是 Update 里。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: 'FixedUpdate 按固定时间步长调用，与物理引擎的模拟步长一致；Update 的间隔随帧率波动。在 Update 里施加力，帧率一抖，力的累积量就变了，表现为「同样的操作，有时跳得高有时跳得低」。移动非物理对象（相机、UI）则用 Update，因为那需要跟随渲染帧。'
      },
      {
        id: 'ch02-q3', ch: 'ch02', kp: 'ch02-2', tier: 1, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '下面哪些是 Unity 中组件之间通信的常见方式？（多选）',
        options: [
          { text: '在 Inspector 里拖引用，直接调用对方的方法', correct: true },
          { text: '用事件（event / Action）让发送方与接收方解耦', correct: true },
          { text: '用 SendMessage 按方法名调用', correct: true },
          { text: '用全局静态变量随意读写' },
          { text: '用 UnityEvent 在 Inspector 里连线' , correct: true }
        ],
        explain: '拖引用最直接但耦合强；事件解耦最好，适合「一对多」广播；UnityEvent 让策划也能连线；SendMessage 靠字符串反射，性能差且改名就断，只适合临时调试。全局静态变量不是通信机制，它只是让所有代码都能改同一份数据，调试时会变成噩梦。'
      },
      {
        id: 'ch02-q4', ch: 'ch02', kp: 'ch02-7', tier: 2, type: 'fill', difficulty: 2,
        tags: ['code'],
        stem: '在 C# 协程中，要暂停执行 0.5 秒，应写 yield return new ______(0.5f); 空白处填哪个类名？',
        answer: 'WaitForSeconds',
        accept: ['WaitForSeconds', 'waitforseconds'],
        explain: 'WaitForSeconds 让协程等待指定秒数（受 timeScale 影响），WaitForSecondsRealtime 则忽略 timeScale，适合暂停菜单里的动画。协程的本质是编译器生成的状态机，yield 处保存现场、下一帧或条件满足后恢复，所以它能用同步写法表达多步流程。'
      },
      {
        id: 'ch02-q5', ch: 'ch02', kp: 'ch02-6', tier: 2, type: 'predict', difficulty: 2,
        tags: ['code'],
        code: 'void Update()\n{\n    float h = Input.GetAxis("Horizontal");\n    rb.velocity = new Vector3(h * speed, 0f, 0f);\n}',
        stem: '角色跳跃后（处于空中）执行这段代码，会出现什么现象？',
        answer: '角色在空中垂直速度被清零，跳跃被打断、直接水平平移',
        accept: ['垂直速度被清零', '跳跃被打断', '不掉落也不上升', '卡在空中'],
        explain: '每帧都新建一个 y 为 0 的速度向量覆盖 rigidbody.velocity，等于把重力累积起来的垂直速度抹掉。表现是跳到一半突然停住、缓慢平移，落地也变得不自然。正确写法是保留 y 分量：rb.velocity = new Vector3(h * speed, rb.velocity.y, 0f)。'
      },
      {
        id: 'ch02-q6', ch: 'ch02', kp: 'ch02-4', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: 'Inspector 里给脚本的 public 字段拖了一个预制体，运行时这个引用却变成 None，最可能的原因是？',
        options: [
          { text: '该字段没有标 [SerializeField]，或对象是运行时动态生成的而预制体引用没被保留', correct: true },
          { text: '预制体引用会随帧丢失，需要在 Update 里重新赋值' },
          { text: 'public 字段不能被序列化，必须改成 static' },
          { text: 'Unity 不支持引用预制体，只能引用场景对象' }
        ],
        explain: 'public 字段可以被序列化，static 字段反而不会被序列化、也不会显示在 Inspector 里。真实排查顺序是：确认字段可见（public 或 [SerializeField]）、确认引用保存在预制体而不是场景实例上、确认运行时没有被代码覆盖成 null。'
      },
      {
        id: 'ch02-q7', ch: 'ch02', kp: 'ch02-1', tier: 2, type: 'tf', difficulty: 2,
        tags: ['tool'],
        stem: '修改场景中的预制体实例后，如果想让所有实例一起变化，应当点击 Inspector 里的 Overrides → Apply All。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '预制体实例对属性的改动默认是「覆盖（override）」，只影响当前实例。Apply All 把这些覆盖写回预制体资产，所有实例随之更新。反过来 Revert 丢弃覆盖。团队协作时要特别注意：不确定的覆盖不要随手 Apply，会污染其他人的场景。'
      },

      /* ---------------- ch03 物理引擎 ---------------- */
      {
        id: 'ch03-q1', ch: 'ch03', kp: 'ch03-4', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '要让两个物体「碰到就消失」但不产生弹开，碰撞体上应该怎么设置？',
        options: [
          { text: '把 Collider 的 Is Trigger 勾上，用 OnTriggerEnter 处理' , correct: true },
          { text: '保持普通碰撞体，用 OnCollisionEnter 处理' },
          { text: '把 Rigidbody 的 Is Kinematic 勾上，用 OnCollisionStay 处理' },
          { text: '把两个物体的 Layer 设为 Ignore Raycast' }
        ],
        explain: '触发器（Trigger）只检测重叠、不产生物理响应，正合「碰到就消失」。普通碰撞体会解算冲量，玩家会被弹开；Is Kinematic 只影响刚体是否受物理驱动，与是否弹开无关。注意：触发器事件要生效，两个物体中至少一个要有 Rigidbody。'
      },
      {
        id: 'ch03-q2', ch: 'ch03', kp: 'ch03-5', tier: 1, type: 'tf', difficulty: 1,
        tags: ['concept'],
        stem: '想让一个平台以匀速来回移动并且能可靠地推动玩家，用 MovePosition 比直接改 transform.position 更合适。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: 'MovePosition 在物理步内移动刚体，引擎能正确计算与其他刚体的接触与摩擦，玩家站在上面会被带着走。直接改 transform.position 相当于瞬移，物理引擎不知道「平台推了玩家」，玩家会穿模或原地打滑。移动碰撞体时还应优先选 Kinematic 刚体 + MovePosition。'
      },
      {
        id: 'ch03-q3', ch: 'ch03', kp: 'ch03-6', tier: 2, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '下面哪些任务适合用射线（Raycast）完成？（多选）',
        options: [
          { text: '检测角色脚下是否着地', correct: true },
          { text: '从相机发射射线做点击拾取', correct: true },
          { text: '射击游戏的命中判定', correct: true },
          { text: '计算两个物体之间的重力大小' },
          { text: '让刚体自动绕开障碍物' }
        ],
        explain: '射线回答的是「从这个点朝这个方向，第一个碰到的是什么」。着地检测、鼠标拾取、射击命中都是这个形状的问题。重力由刚体与物理材质决定，绕开障碍是导航（NavMesh）或转向行为的工作，它们不是「一条线打过去」的问题。'
      },
      {
        id: 'ch03-q4', ch: 'ch03', kp: 'ch03-6', tier: 2, type: 'predict', difficulty: 2,
        tags: ['code'],
        code: 'bool CanJump()\n{\n    bool grounded = Physics.Raycast(transform.position, Vector3.down, 1.1f);\n    return grounded;\n}',
        stem: '角色胶囊体高度为 2、中心在 transform.position，这段着地检测有什么问题？',
        answer: '射线起点在胶囊中心，向下 1.1 米仍可能没到脚底，站着也检测不到地面',
        accept: ['起点在中心', '距离不够', '射线从中心出发', '检测不到地面'],
        explain: '胶囊中心到脚底是 1 米，射线长度 1.1 米看似够，但这是从中心出发的理想情况；一旦角色略微离地、胶囊有 skin width、或者地面有坡度，就会出现「站着却判定不在地面」。稳妥写法是从脚底略上方出发，长度略大于余量，并用 LayerMask 排除角色自身。'
      },
      {
        id: 'ch03-q5', ch: 'ch03', kp: 'ch03-3', tier: 1, type: 'fill', difficulty: 2,
        tags: ['concept'],
        stem: 'Unity 用 ______ 矩阵决定哪些层的物体之间会发生碰撞，从而避免不必要的碰撞计算。',
        answer: 'Layer Collision',
        accept: ['Layer Collision', '层碰撞', '碰撞矩阵', 'Layer'],
        explain: 'Layer Collision Matrix（层碰撞矩阵）在 Physics 设置里，勾选表示两层之间会碰撞。把「子弹」与「子弹」之间的勾去掉，成百上千颗子弹就互不检测；把「玩家」与「装饰物」的勾去掉，能省掉大量无意义回调。这是性价比最高的物理优化之一。'
      },
      {
        id: 'ch03-q6', ch: 'ch03', kp: 'ch03-7', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['debug'],
        stem: '角色高速移动时会穿过薄墙，最不可能的原因是下面哪一项？',
        options: [
          { text: '墙没有 Collider' },
          { text: '角色用 transform.position 直接位移，且速度过快' },
          { text: '碰撞检测模式设为 Discrete，单帧位移超过墙厚' },
          { text: '墙的材质颜色太深，看起来像穿过去了', correct: true }
        ],
        explain: '穿墙（tunneling）的三个真实原因是：没有碰撞体、用位移绕过了物理、离散检测在单帧跨过了薄物体。颜色不参与物理计算。修法依次是补碰撞体、改用 Rigidbody 移动、把检测模式改成 Continuous 或加厚墙体。先排查前两条，再动检测模式。'
      },
      {
        id: 'ch03-q7', ch: 'ch03', kp: 'ch03-2', tier: 2, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: '两个物体从同一高度落下，质量大的那个会先着地。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '在忽略空气阻力的情况下，重力加速度与质量无关，两者同时着地。Unity 默认不使用空气阻力（Drag 为 0 时），所以质量不影响下落时间。质量影响的是碰撞时的动量与冲量——推箱子时更重的箱子更难推动，而不是落得更快。'
      },

      /* ---------------- ch04 2D 与 2.5D ---------------- */
      {
        id: 'ch04-q1', ch: 'ch04', kp: 'ch04-2', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '正交相机的 Size 设为 5，屏幕高 1080 像素，则画面纵向能看到多少世界单位？',
        options: [
          { text: '5', correct: false },
          { text: '10', correct: true },
          { text: '2.5' },
          { text: '取决于分辨率' }
        ],
        explain: '正交相机的 Size 是「可见高度的一半」，所以纵向可见 2 × 5 = 10 个世界单位，与分辨率无关——这正是像素游戏喜欢正交相机的原因。分辨率只影响每个世界单位占多少像素。纵向确定后，横向可见范围由宽高比推出。'
      },
      {
        id: 'ch04-q2', ch: 'ch04', kp: 'ch04-1', tier: 1, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: '2D 游戏里两个精灵谁画在前面，由 Sorting Layer 与 Order in Layer 决定，而不是由 Z 坐标决定。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: 'Sprite Renderer 用 Sorting Layer（层的先后）与 Order in Layer（同层内的序号）排序，Z 坐标在 2D 渲染中基本不参与。这带来一个好处：可以自由摆放 Z 而不用担心遮挡；也带来一个坑：忘了设 Order，背景会盖住角色。用 Sorting Layer 区分「背景 / 场景 / 角色 / 前景 / UI」是最省心的做法。'
      },
      {
        id: 'ch04-q3', ch: 'ch04', kp: 'ch04-5', tier: 2, type: 'multi', difficulty: 2,
        tags: ['design'],
        stem: '下面哪些属于本站讲的 2.5D 实现路线？（多选）',
        options: [
          { text: '2D 玩法 + 3D 场景（如横版卷轴配立体背景）', correct: true },
          { text: '3D 玩法 + 固定 2D 视角（如斜 45° 俯视）', correct: true },
          { text: '2D 精灵放在 3D 空间里，靠透视产生纵深', correct: true },
          { text: '用两台相机分别渲染左右眼做 VR' },
          { text: '把 3D 模型烘焙成序列帧再当 2D 用' }
        ],
        explain: '三条路线分别是「2D 玩法 + 3D 表现」「3D 玩法 + 2D 视角」「2D 资产 + 3D 空间」。它们的共同点是玩法判定在一个平面上，视觉上却有纵深。VR 是立体渲染，序列帧烘焙是美术流程，都不是 2.5D 的空间方案。选路线时先问「判定在几个轴上」。'
      },
      {
        id: 'ch04-q4', ch: 'ch04', kp: 'ch04-3', tier: 2, type: 'predict', difficulty: 2,
        tags: ['code'],
        code: 'float fallMultiplier = 2.2f;\nif (rb.velocity.y < 0)\n    rb.velocity += Vector2.up * Physics2D.gravity.y * (fallMultiplier - 1f) * Time.deltaTime;',
        stem: '这段代码让角色下落时的行为发生了什么变化？',
        answer: '下落加速度变大，角色落得更快、跳跃手感更利落',
        accept: ['下落更快', '下落加速度变大', '落得更快', '增加下落重力'],
        explain: '只在 velocity.y < 0（正在下落）时给速度叠加额外的向下加速度，等于把下落阶段的重力放大 2.2 倍，上升阶段不变。这是平台跳跃游戏调手感的经典手法：上升轻盈、下落干脆，避免「飘」的感觉。如果同时还想让短按跳得更低，再对上升阶段做一次速度截断。'
      },
      {
        id: 'ch04-q5', ch: 'ch04', kp: 'ch04-7', tier: 1, type: 'fill', difficulty: 2,
        tags: ['design'],
        stem: '本站把一段好的关卡节奏拆成三个段落：教学、①、考验。①处应填什么？',
        answer: '变化',
        accept: ['变化', '发展', '变奏'],
        explain: '教学段安全地介绍新机制，变化段在同一机制上增加组合或压力，考验段把玩家刚学会的东西推到极限。缺教学，玩家会卡住；缺变化，会腻；缺考验，没有成就感。三段不必等长，但顺序不能乱——先教再变最后考。'
      },
      {
        id: 'ch04-q6', ch: 'ch04', kp: 'ch04-6', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '视差滚动（parallax）的核心原理是什么？',
        options: [
          { text: '不同距离的层以不同速度跟随相机移动，制造纵深错觉' , correct: true },
          { text: '把所有背景层锁定在屏幕上不动' },
          { text: '用模糊程度表示距离' },
          { text: '让背景层随机抖动' }
        ],
        explain: '近处的物体移动快、远处的移动慢，人眼据此判断距离。实现上给每层一个 0–1 的系数：层位置 = 相机位置 × 系数（再叠加原始偏移），系数越小越远。要注意层不能无限平移，循环背景要在边界处无缝拼接。'
      },
      {
        id: 'ch04-q7', ch: 'ch04', kp: 'ch04-4', tier: 2, type: 'tf', difficulty: 2,
        tags: ['tool'],
        stem: '用 Tilemap 拼好关卡后，还需要给 Tilemap 添加 Tilemap Collider 2D 与 Composite Collider 2D，角色才能站在上面。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: 'Tilemap 只是渲染与数据，本身不参与物理。加上 Tilemap Collider 2D 才有碰撞形状；再用 Composite Collider 2D 把成百上千个格子合并成少数几个多边形，能显著减少碰撞计算并消除「格子接缝处卡角」。记得同时给 Rigidbody 2D 设 Static。'
      },

      /* ---------------- ch05 3D 世界 ---------------- */
      {
        id: 'ch05-q1', ch: 'ch05', kp: 'ch05-1', tier: 1, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: '子物体的 transform.position 与 localPosition 在什么情况下数值相同？',
        options: [
          { text: '父物体位于世界原点且无旋转、无缩放时', correct: true },
          { text: '任何时候都相同' },
          { text: '只有子物体是预制体时' },
          { text: '只有父物体是静态物体时' }
        ],
        explain: 'position 是世界坐标，localPosition 是相对父物体的坐标。父物体在原点、旋转为单位旋转、缩放为 1 时，两者一致。一旦父物体旋转 90°，子物体的局部「前方」在世界里就指向别处——这是「本地坐标」最容易出错的地方，也是所有相对移动必须用 TransformPoint / InverseTransformPoint 的原因。'
      },
      {
        id: 'ch05-q2', ch: 'ch05', kp: 'ch05-3', tier: 2, type: 'tf', difficulty: 2,
        tags: ['concept'],
        stem: '欧拉角适合在面板上读数与调试，四元数适合在代码里做插值与累积旋转。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '欧拉角直观、可读，但存在万向节死锁（两个轴重合时丢失一个自由度）与插值不自然的问题。四元数没有死锁、可以平滑插值（Slerp / RotateTowards），但不直观。实践是：Inspector 里看欧拉角，代码里用 Quaternion；只有需要把角度暴露给动画曲线或 UI 时才转成欧拉角。'
      },
      {
        id: 'ch05-q3', ch: 'ch05', kp: 'ch05-5', tier: 2, type: 'multi', difficulty: 2,
        tags: ['concept'],
        stem: '关于实时灯光与烘焙灯光，下面哪些说法正确？（多选）',
        options: [
          { text: '烘焙光把光照信息预先算进光照贴图，运行时不产生实时开销', correct: true },
          { text: '实时方向光能产生动态阴影，但开销随阴影距离与分辨率上升', correct: true },
          { text: '混合光（Mixed）既能烘焙间接光，也能对动态物体投影', correct: true },
          { text: '把场景所有灯都设为实时，性能一定更好' },
          { text: '烘焙光可以照亮运行中动态生成的物体' }
        ],
        explain: '烘焙光便宜但静态，不会照亮后来生成的物体；实时光灵活但贵；混合光取两者之间，是室内场景的常用选择。全实时的问题在于每盏灯都要参与逐像素计算与阴影渲染，灯一多帧率就崩。判断标准是「这盏灯需要照亮会动的东西吗」。'
      },
      {
        id: 'ch05-q4', ch: 'ch05', kp: 'ch05-3', tier: 2, type: 'predict', difficulty: 2,
        tags: ['code'],
        code: 'Vector3 dir = target.position - transform.position;\nQuaternion look = Quaternion.LookRotation(dir);\ntransform.rotation = Quaternion.RotateTowards(transform.rotation, look, turnSpeed * Time.deltaTime);',
        stem: '这段代码让炮塔产生什么行为？',
        answer: '炮塔以有限速度转向目标，而不是瞬间对准',
        accept: ['缓慢转向目标', '平滑转向', '以固定角速度转向', '不会瞬间对准'],
        explain: 'LookRotation 算出「朝向目标」的目标旋转，RotateTowards 每帧最多转 turnSpeed × deltaTime 度，所以是匀速逼近而非瞬移。若直接用 transform.rotation = look，炮塔会瞬间对准，看起来像贴图翻转。还要注意 dir 接近零向量时 LookRotation 会报警，需要先判断距离。'
      },
      {
        id: 'ch05-q5', ch: 'ch05', kp: 'ch05-4', tier: 1, type: 'fill', difficulty: 2,
        tags: ['concept'],
        stem: '透视相机中，______ 决定纵向视野的张角，值越大画面越广、物体显得越远。',
        answer: 'FOV',
        accept: ['FOV', 'field of view', '视场角', '视野'],
        explain: 'FOV（Field of View）是纵向视场角。FOV 大（如 90°）视野广、透视畸变强，适合高速或恐怖游戏；FOV 小（如 40°）压缩空间、主体突出，适合叙事。改 FOV 要同时考虑 Near/Far 裁剪面与晕动症，第一人称通常给 60–75° 并允许玩家调整。'
      },
      {
        id: 'ch05-q6', ch: 'ch05', kp: 'ch05-6', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['concept'],
        stem: 'PBR 材质里，Metallic 与 Smoothness 分别控制什么？',
        options: [
          { text: 'Metallic 控制「像金属还是像绝缘体」，Smoothness 控制高光锐利程度（粗糙度的反面）', correct: true },
          { text: 'Metallic 控制亮度，Smoothness 控制颜色' },
          { text: 'Metallic 控制透明度，Smoothness 控制法线强度' },
          { text: '两者都只影响阴影' }
        ],
        explain: '金属把反射光染色、几乎没有漫反射；绝缘体有漫反射、高光偏白。Smoothness 越高，微观表面越平整，高光越小越亮；越低则高光散开。调材质时先定「这是不是金属」，再定「表面多光滑」，最后才调颜色——顺序反了会一直觉得「哪里不对」。'
      },
      {
        id: 'ch05-q7', ch: 'ch05', kp: 'ch05-8', tier: 2, type: 'tf', difficulty: 2,
        tags: ['perf'],
        stem: '减少 draw call 的有效手段之一是让多个物体共享同一材质，从而被合批（batching）渲染。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '合批的前提是「用同一个材质、在同一批次里」。材质不同就得切换渲染状态，draw call 随之上升。实践手段包括：共用图集（atlas）、用 MaterialPropertyBlock 改单个物体的参数而不是复制材质、把静态环境标记为 Static 让引擎做静态合批。注意合批省的是一次提交的开销，顶点数并不会因此变少。'
      },

      /* ---------------- ch06 UI、音效与反馈 ---------------- */
      {
        id: 'ch06-q1', ch: 'ch06', kp: 'ch06-2', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['concept'],
        stem: '要让 UI 随屏幕大小自动缩放、同时保持设计比例，Canvas 上应当怎么设置？',
        options: [
          { text: 'Render Mode 设为 Screen Space - Overlay，Canvas Scaler 用 Scale With Screen Size' , correct: true },
          { text: 'Render Mode 设为 World Space，手动改 RectTransform' },
          { text: '把 Canvas 的 Scale 设为 0' },
          { text: '每个控件单独写脚本按像素改大小' }
        ],
        explain: 'Screen Space - Overlay 让 UI 始终绘制在屏幕最上层；Scale With Screen Size 根据参考分辨率等比缩放，宽高比变化时再由 Match 参数决定偏向宽还是高。World Space 适合血条、铭牌这类「属于场景」的 UI，不适合主界面。'
      },
      {
        id: 'ch06-q2', ch: 'ch06', kp: 'ch06-4', tier: 1, type: 'tf', difficulty: 2,
        tags: ['code'],
        stem: '暂停游戏时把 Time.timeScale 设为 0，所有协程里的 WaitForSeconds 也会一起停住。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: 'WaitForSeconds 使用缩放时间，timeScale = 0 时它永远等不到；WaitForSecondsRealtime 用的是真实时间，不受影响。所以暂停菜单自身的动画要用 Realtime 版本，否则菜单会「僵住」。同样，Update 里用 Time.deltaTime 的逻辑也会停，需要区分「该暂停的」与「不该暂停的」。'
      },
      {
        id: 'ch06-q3', ch: 'ch06', kp: 'ch06-6', tier: 2, type: 'multi', difficulty: 2,
        tags: ['design'],
        stem: '下面哪些属于提升「打击感」的常见手段？（多选）',
        options: [
          { text: '命中瞬间短暂停顿（hit stop）', correct: true },
          { text: '相机轻微震动', correct: true },
          { text: '受击方闪白或闪红', correct: true },
          { text: '降低整体帧率让动作更「重」' },
          { text: '命中时叠加粒子与音效' , correct: true }
        ],
        explain: '打击感来自「多通道同时给反馈」：视觉（闪白、粒子、震屏）、听觉（音效）、时间（hit stop）。降帧只会让操作变糊，不会变重。hit stop 通常 0.03–0.08 秒，太长会让操作觉得粘滞；震屏幅度要小、衰减要快，否则玩家会晕。'
      },
      {
        id: 'ch06-q4', ch: 'ch06', kp: 'ch06-3', tier: 2, type: 'predict', difficulty: 2,
        tags: ['code'],
        code: 'IEnumerator DrainRoutine()\n{\n    yield return new WaitForSeconds(0.4f);\n    while (fill.fillAmount > target)\n    {\n        fill.fillAmount -= speed * Time.deltaTime;\n        yield return null;\n    }\n}',
        stem: '这段血条表现代码的意图是什么？',
        answer: '让血条延迟 0.4 秒后缓慢下降，形成「先掉一截、再慢慢追」的延迟条效果',
        accept: ['延迟掉血', '缓慢下降', '双条血条效果', '延迟 0.4 秒'],
        explain: '先等 0.4 秒（让玩家看清刚掉了多少），再用每帧递减的方式把填充量慢慢追到目标值。这种「主条瞬间掉、副条延迟追」的双层血条能同时表达「当前血量」与「刚刚损失了多少」，比单条更有信息量。注意循环里要用 Time.deltaTime，且暂停时 timeScale 会影响它。'
      },
      {
        id: 'ch06-q5', ch: 'ch06', kp: 'ch06-5', tier: 1, type: 'fill', difficulty: 2,
        tags: ['code'],
        stem: '把 0–1 的线性音量滑杆转成分贝，常用公式是 volume = 20 × ______(sliderValue)。空白处填哪个数学函数？',
        answer: 'Log10',
        accept: ['Log10', 'log10', 'Mathf.Log10'],
        explain: '人耳对响度的感知接近对数，所以音量滑杆 0.5 并不等于「一半响」。20 × log10(v) 把线性值转成 dB：v = 1 时为 0 dB，v = 0.5 时约 -6 dB，v = 0 时为负无穷（需要单独处理成静音）。Audio Mixer 的 Volume 参数正是以 dB 为单位。'
      },
      {
        id: 'ch06-q6', ch: 'ch06', kp: 'ch06-7', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['design'],
        stem: '下面哪项最不属于「无障碍设计」的范畴？',
        options: [
          { text: '给关键音效配字幕与视觉提示' },
          { text: '允许重映射按键、调整灵敏度' },
          { text: '提供色盲友好的配色与形状区分' },
          { text: '把所有文字字号统一调小以显得精致', correct: true }
        ],
        explain: '无障碍是「让更多人能玩」：听觉（字幕、视觉提示）、运动（重映射、灵敏度、长按改单击）、视觉（色盲配色、字号、对比度）、认知（清晰的目标提示）。把字号调小恰恰相反。无障碍改动往往也让所有玩家受益，比如字幕与按键重映射。'
      },
      {
        id: 'ch06-q7', ch: 'ch06', kp: 'ch06-1', tier: 2, type: 'tf', difficulty: 2,
        tags: ['design'],
        stem: '反馈越强烈越好，把命中特效做到最大能让玩家最清楚地感知到攻击生效。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '反馈的三要素是信息、时机、强度，其中强度要「匹配事件的重要性」。小命中配大爆炸，会让玩家分不清哪次攻击更重要，长时间还会疲劳；真正的重击反而没有余量可用。做法是分级：普通命中轻、暴击中、击杀重，让强度成为信息的一部分。'
      },

      /* ---------------- ch07 3D 进阶与交付 ---------------- */
      {
        id: 'ch07-q1', ch: 'ch07', kp: 'ch07-1', tier: 1, type: 'mcq', difficulty: 1,
        tags: ['process'],
        stem: '按本站的四阶段划分，判断项目是否进入「打磨」阶段的标志是什么？',
        options: [
          { text: '核心循环已通过三人试玩，有完整流程，且没有再加大型系统' , correct: true },
          { text: '美术资源已经全部换成正式素材' },
          { text: '代码行数超过一万行' },
          { text: '已经开始写演示文稿' }
        ],
        explain: '打磨阶段的前提是「功能冻结」：循环成立、流程闭环、系统不再增删，剩下的工作才是修 bug、补反馈、调手感。没有冻结就开始打磨，等于一边装修一边改户型。判断标准不是素材或代码量，而是「还会不会加新系统」。'
      },
      {
        id: 'ch07-q2', ch: 'ch07', kp: 'ch07-2', tier: 2, type: 'tf', difficulty: 2,
        tags: ['code'],
        stem: '把攻击命中判定挂在动画事件上，比在按键瞬间判定更能保证画面与判定同步。',
        options: [
          { text: '正确', correct: true },
          { text: '错误' }
        ],
        explain: '按键到刀挥出之间有前摇，按键瞬间判定会出现「还没碰到就掉血」；动画事件在挥击的合适帧触发，判定与画面同步。代价是判定时机受动画长度约束，改动作就要重挂事件。做法是把事件挂在「武器到达最远处」的那一帧，并用 Gizmo 画出判定范围方便调。'
      },
      {
        id: 'ch07-q3', ch: 'ch07', kp: 'ch07-5', tier: 2, type: 'multi', difficulty: 2,
        tags: ['perf'],
        stem: '下面哪些是学生项目中最常见的性能问题？（多选）',
        options: [
          { text: '子弹、飘字频繁 Instantiate / Destroy 造成 GC 峰值', correct: true },
          { text: '每帧拼接字符串更新 UI 文本', correct: true },
          { text: '材质种类过多导致无法合批', correct: true },
          { text: '场景里放了太多空物体' },
          { text: '脚本文件名与类名不一致' }
        ],
        explain: '前三条直接消耗 CPU 与内存：实例化产生垃圾、字符串拼接产生垃圾、材质切换增加 draw call。空物体本身几乎不耗时（只是编辑器里碍眼），文件名与类名不一致只是编译错误或找不到脚本，不是运行时性能问题。优化要按 Profiler 的实测排序，不要凭感觉。'
      },
      {
        id: 'ch07-q4', ch: 'ch07', kp: 'ch07-3', tier: 2, type: 'predict', difficulty: 2,
        tags: ['code'],
        code: 'if (agent.velocity.sqrMagnitude < 0.01f && agent.remainingDistance > 1f)\n    stuckTimer += Time.deltaTime;\nelse\n    stuckTimer = 0f;\n\nif (stuckTimer > 1.5f) { agent.ResetPath(); stuckTimer = 0f; }',
        stem: '这段代码解决的是什么问题？',
        answer: '敌人在有目标的情况下卡住不动，持续 1.5 秒后重新寻路',
        accept: ['卡住', '卡住恢复', '重新寻路', '原地抖动'],
        explain: '两个条件同时成立才计时：速度接近 0（没在动）且剩余距离大于 1（确实还没到）。持续 1.5 秒就 ResetPath，让 agent 重新规划路径。这是 NavMesh 项目最常见的「保险丝」——不解决根因（导航网格有缝、障碍物摆放不当），但能避免敌人永远卡在门框上。'
      },
      {
        id: 'ch07-q5', ch: 'ch07', kp: 'ch07-3', tier: 1, type: 'fill', difficulty: 1,
        tags: ['concept'],
        stem: 'Unity 中让角色自动绕开障碍寻路的技术叫 ______（填英文缩写或全称）。',
        answer: 'NavMesh',
        accept: ['NavMesh', 'navmesh', 'Navigation Mesh', '导航网格'],
        explain: 'NavMesh（Navigation Mesh）是烘焙出来的可行走网格，NavMeshAgent 在其上寻路。它只解决「怎么绕过去」，不解决「要不要过去」——巡逻、追击、放弃这些决策仍要自己写。烘焙时要检查坡度、台阶高度与代理半径，否则会出现「看着能走却走不过去」的缝。'
      },
      {
        id: 'ch07-q6', ch: 'ch07', kp: 'ch07-6', tier: 2, type: 'mcq', difficulty: 2,
        tags: ['tool'],
        stem: '打包后运行，场景里的材质全部变成粉紫色，最可能的原因是？',
        options: [
          { text: '材质使用的 Shader 没有被打进包（丢失或未包含在 Always Included 列表）', correct: true },
          { text: '显卡驱动太新' },
          { text: '场景灯光没有烘焙' },
          { text: '打包时选了 Release 而不是 Debug' }
        ],
        explain: '粉紫是 Unity 的「shader 丢失」占位色：运行时找不到对应 shader，就用错误材质渲染。常见于自定义 shader 只在编辑器里被引用、没进打包列表。修法是把 shader 加入 Graphics 设置的 Always Included Shaders，或让材质在打包资源里被显式引用。'
      },
      {
        id: 'ch07-q7', ch: 'ch07', kp: 'ch07-7', tier: 2, type: 'tf', difficulty: 2,
        tags: ['process'],
        stem: '试玩时最有效的做法是一边看玩家玩一边解释设计意图，避免他误解。',
        options: [
          { text: '正确' },
          { text: '错误', correct: true }
        ],
        explain: '解释会污染数据：玩家一旦知道「这里该怎么走」，你就再也看不到他原本会卡在哪。正确做法是读一遍操作说明后闭嘴，只记录停顿、误操作与表情，等玩完再问具体问题（「刚才那扇门你知道怎么开吗」）。想验证「提示是否足够」，就必须忍住不提示。'
      }
    ]
  };

  CSC._quizPack = PACK;
  CSC.registerQuizPack(PACK);
})();
