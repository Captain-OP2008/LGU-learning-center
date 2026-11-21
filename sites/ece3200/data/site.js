/* =====================================================================
 * site.js · 站点配置（window.CSC_SITE）
 * 所有展示文案集中在这里；换课程只需改本文件与 data/ 下的章节文件。
 * ===================================================================== */
window.CSC_SITE = {
  id: 'ece3200',
  short: 'ECE3200',
  name: '游戏设计',
  en: 'Game Design',
  dept: '电子与信息工程',
  lang: 'cpp',
  langLabel: 'Unity / C#',

  /* 首页启动终端 */
  mode: 'STATIC · 阅读型',
  bootHead: 'ECE3200 // OBSERVATORY',
  bootLog: [
    '> mounting course partition ... ECE3200',
    '> loading 8 modules ...',
    '> calibrating glossary & quiz bank ...',
    '> all systems nominal. welcome aboard.'
  ],

  /* 首页主视觉文案 */
  tagline: '把「好不好玩」拆成可以设计、可以验证的东西。',
  missionEn: 'ECE3200 · 8 MODULES',
  missionTitle: '从一条规则开始<br><em>做出可玩的游戏</em>',
  lede: '从游戏四要素与 MDA 讲到 Unity 与 C#、物理、2D/2.5D、3D 世界、UI 反馈，最后收束到打包与演示：每章都有概念、对比表、C# 示例、常见错误与自检清单。',
  searchPlaceholder: 'QUERY // 搜索本站章节、术语与题目',

  /* 资料库（path 相对 "CUHKSZ course" 目录，由 tools/check-content.js 校验存在性） */
  resBase: '../../resources/ECE3200/',
  resources: {
    note: '资料来自 CUHKSZ ECE3200 课程站点；Unity 工程类压缩包解压后用 Unity Hub 打开，注意引擎版本与讲义一致。',
    groups: [
      { name: '课程讲义与阅读', note: '按周推进的主线材料；先看讲义，再对照本站对应章节。', items: [
        { title: 'Lec 0 · 课程介绍', path: '学习资料/ECE3200_Lec0_CourseIntro.pptx', kind: 'pptx', note: '课程安排、考核方式与工具链' },
        { title: 'Lecture 01 · 游戏入门', path: '学习资料/ECE3200_Lecture_01_IntroGames.pptx', kind: 'pptx', note: '游戏四要素、MDA 与核心循环' },
        { title: 'Lecture 11 · Life Is A Game', path: '学习资料/ECE3200_Lecture_11_LifeIsAGame.pptx', kind: 'pptx', note: '从游戏设计看现实决策与激励' },
        { title: 'Fundamentals of Game Design', path: '学习资料/ECE3200_fundamentals_of_game_design_4_pdf_free.pdf', kind: 'pdf', note: '教材节选：玩法、挑战与玩家体验' },
        { title: 'New Guidance 1.0', path: '学习资料/ECE3200_New_guidance_1_0.pdf', kind: 'pdf', note: '课程更新说明与项目要求变更' }
      ] },
      { name: 'Lab 讲义与工程素材', note: '每个 Lab 对应一次上机；.zip 是现成工程或素材包，解压后直接导入。', items: [
        { title: 'Lab 1 · Unity 与 C# 入门', path: '作业习题/ECE3200_ppt_Lab1_Intro_to_Unity_and_C#.pptx', kind: 'pptx', note: '编辑器界面、GameObject 与第一个脚本' },
        { title: 'Lab 2 · 物理引擎', path: '作业习题/ECE3200_ppt_Lab2_Introduction_to_Unity_Physical_Engine.pptx', kind: 'pptx', note: '刚体、碰撞体与物理材质' },
        { title: 'Lab 2 · 实验指引', path: '作业习题/ECE3200_Lab2_Guidance.pdf', kind: 'pdf', note: '逐步操作与提交要求' },
        { title: 'Lab 3 · 实验指引', path: '作业习题/ECE3200_Lab3_Guidance.pdf', kind: 'pdf', note: '场景搭建与脚本交互' },
        { title: 'Lab 3 · RPG 素材包', path: '作业习题/ECE3200_Assets_Lab3_Assets_for_RPG.zip', kind: 'zip', note: '角色、地块与道具素材' },
        { title: 'Lab 4 · 实验指引', path: '作业习题/ECE3200_Lab4_Guidance.pdf', kind: 'pdf', note: '2D 场景、精灵与相机' },
        { title: 'Lab 5 · 2.5D 设计（二）', path: '作业习题/ECE3200_ppt_Lab5_Introduction_to_2_5D_game_design_Part2.pptx', kind: 'pptx', note: '2.5D 的三条实现路线' },
        { title: 'Lab 5 · 实验指引', path: '作业习题/ECE3200_Lab5_Guidance.pdf', kind: 'pdf', note: '纵深、视差与关卡拼装' },
        { title: 'Lab 6 · 实验指引', path: '作业习题/ECE3200_Lab6_Guidance.pdf', kind: 'pdf', note: 'UI、音效与反馈接入' },
        { title: 'Lab 7 · 3D 游戏设计', path: '作业习题/ECE3200_ppt_Lab7_Introduction_to_3D_game_design.pptx', kind: 'pptx', note: '变换、相机、光照与材质' },
        { title: 'Lab 7 · 实验指引（下）', path: '作业习题/ECE3200_Lab7_Guidance_Part_2.pdf', kind: 'pdf', note: '3D 关卡与第三人称相机' },
        { title: 'Lab 8 · 3D 设计（三）', path: '作业习题/ECE3200_ppt_Lab8_Introduction_to_3D_game_design_part_3.pptx', kind: 'pptx', note: '动画、AI 与交付' },
        { title: 'Lab 8 · 实验指引（三）', path: '作业习题/ECE3200_Lab8_Guidance_Part_3_20251119.pdf', kind: 'pdf', note: 'NavMesh、动画事件与打包' },
        { title: '预制体与网格素材', path: '学习资料/ECE3200_Prefabs_withmesh.zip', kind: 'zip', note: '可复用的预制体与网格' },
        { title: 'FPS 素材包', path: '学习资料/ECE3200_assets_FPSGamePack.zip', kind: 'zip', note: '第一人称关卡素材与武器模型' },
        { title: '音效素材包', path: '学习资料/ECE3200_Additional_Sound.zip', kind: 'zip', note: '打击、环境与 UI 音效' }
      ] },
      { name: '作业与期末项目', note: '三次作业对应三个技术台阶；期末项目以 Final Project Guidance 为准。', items: [
        { title: 'Assignment 1', path: '作业习题/ECE3200_Assignment_1.pdf', kind: 'pdf', note: '玩法分析或小型原型的第一份作业' },
        { title: 'Assignment 2', path: '作业习题/ECE3200_Assignment_2.pdf', kind: 'pdf', note: '关卡设计与机制实现' },
        { title: 'Assignment 3', path: '作业习题/ECE3200_Assignment_3_20251119.pdf', kind: 'pdf', note: '3D 场景与交互的综合作业' },
        { title: 'Final Project Guidance', path: '考试资料/ECE3200_Final_Project_Guidance.pdf', kind: 'pdf', note: '期末项目的范围、里程碑与评分点' }
      ] },
      { name: '考试资料', note: 'Midterm 为理论测试；补考卷题型相同，范围以当学期通知为准。', items: [
        { title: 'Midterm 理论测试', path: '考试资料/ECE3200_Midterm_Exam_Theory_Test.docx', kind: 'docx', note: '期中题型与范围参考' },
        { title: 'Midterm 补考卷', path: '考试资料/ECE3200_Midterm_Exam_Theory_Test_MAKEUP.docx', kind: 'docx', note: '补考版本，可用于加练' }
      ] }
    ]
  },

  /* 关于页的信息行 */
  aboutLines: [
    ['课程', '游戏设计（Game Design），CUHKSZ ECE3200'],
    ['来源', 'CUHKSZ ECE3200 讲义、Lab 指引、作业与考试资料'],
    ['结构', '8 章正文 · 56 题题库 · 模拟卷 · 3 个实战项目 · 资料库'],
    ['建议', '第 0 章先建地图；ch02 与 ch03 务必动手写脚本、调物理参数，只看讲义学不会手感。']
  ],

  /* 速查表：tabs 结构 [{ label, blocks:[...] }] */
  cheat: [
    { label: 'Unity 生命周期', blocks: [
      { t: 'table', head: ['回调', '时机', '典型用途', '坑'], rows: [
        ['<code>Awake</code>', '对象实例化时，无论是否启用', '建立自身引用、初始化字段', '此时其他对象可能尚未初始化'],
        ['<code>OnEnable</code>', '每次启用时', '订阅事件、注册到管理器', '必须与 <code>OnDisable</code> 成对'],
        ['<code>Start</code>', '第一帧 <code>Update</code> 之前一次', '依赖其他对象已就绪的逻辑', '只在启用后执行一次'],
        ['<code>FixedUpdate</code>', '固定步长（默认 0.02 秒）', '刚体、力、<code>MovePosition</code>', '不要在这里读输入'],
        ['<code>Update</code>', '每帧', '输入、计时、非物理移动', '间隔随帧率变化'],
        ['<code>LateUpdate</code>', '所有 <code>Update</code> 之后', '相机跟随、UI 朝向', '放这里才不会抖一帧'],
        ['<code>OnDisable</code>', '禁用或销毁时', '退订事件、归还对象池', '漏掉会留下空引用回调'],
        ['<code>OnDestroy</code>', '销毁时', '释放非托管资源', '场景切换也会触发']
      ], caption: '记法：建立自身 → 接入场景 → 依赖他人 → 每帧逻辑 → 收尾' },
      { t: 'callout', kind: 'tip', title: '一个安全的初始化顺序', html: '在 <code>Awake</code> 里 <code>GetComponent</code> 拿自己的组件，在 <code>OnEnable</code> 里订阅事件，在 <code>Start</code> 里找场景中的其他对象并读取数据。把「找别人」放进 <code>Awake</code>，是空引用异常最常见的来源。' }
    ] },

    { label: 'C# 与输入', blocks: [
      { t: 'table', head: ['需求', '写法', '说明'], rows: [
        ['水平轴', '<code>Input.GetAxisRaw("Horizontal")</code>', '<code>Raw</code> 不做了平滑，适合平台跳跃'],
        ['平滑轴', '<code>Input.GetAxis("Horizontal")</code>', '自带插值，适合驾驶或相机'],
        ['按下 / 抬起', '<code>GetButtonDown</code> / <code>GetButtonUp</code>', '只在那一帧为真'],
        ['鼠标位置', '<code>Camera.main.ScreenToWorldPoint(Input.mousePosition)</code>', '2D 要把 z 设为相机到平面的距离'],
        ['帧率无关', '<code>value * Time.deltaTime</code>', '移动、计时都要乘'],
        ['固定步长', '<code>Time.fixedDeltaTime</code>', '只在 <code>FixedUpdate</code> 里用'],
        ['协程等待', '<code>yield return new WaitForSeconds(t)</code>', '受 <code>timeScale</code> 影响'],
        ['缓存查找', '<code>static readonly int Hash = Animator.StringToHash("Speed")</code>', '避免每帧算字符串哈希']
      ], caption: '输入读在 <code>Update</code>，物理写在 <code>FixedUpdate</code>，二者不要混' },
      { t: 'code', lang: 'csharp', caption: '帧率无关的移动骨架', code: 'void Update()\n{\n    float h = Input.GetAxisRaw("Horizontal");\n    Vector3 dir = new Vector3(h, 0f, 0f);\n    transform.position += dir * speed * Time.deltaTime;\n}\n\nvoid FixedUpdate()\n{\n    // 物理移动：保留 y，避免抹掉重力速度\n    rb.velocity = new Vector2(moveInput * speed, rb.velocity.y);\n}' }
    ] },

    { label: '物理与碰撞', blocks: [
      { t: 'table', head: ['任务', '接口', '要点'], rows: [
        ['碰撞回调', '<code>OnCollisionEnter(Collision c)</code>', '需要双方都有碰撞体，至少一方有刚体'],
        ['触发回调', '<code>OnTriggerEnter(Collider other)</code>', '勾选 <code>Is Trigger</code>，不产生物理响应'],
        ['地面检测', '<code>Physics.Raycast(origin, Vector3.down, dist, mask)</code>', '从脚底略上方出发，排除自身层'],
        ['范围检测', '<code>Physics.OverlapSphere(pos, r, mask)</code>', '适合近战命中与拾取'],
        ['移动平台', '<code>rb.MovePosition(target)</code>', 'Kinematic 刚体 + <code>FixedUpdate</code>'],
        ['连续碰撞', '<code>CollisionDetectionMode.Continuous</code>', '防高速穿墙，开销更高'],
        ['层过滤', '<code>LayerMask.GetMask("Enemy")</code>', '比运行时字符串比较便宜'],
        ['忽略碰撞', '<code>Physics.IgnoreCollision(a, b)</code>', '临时穿透，如翻滚无敌']
      ], caption: '触发器要生效，两个物体中至少一个必须有 <code>Rigidbody</code>' },
      { t: 'compare', left: { title: '直接改 position', html: '瞬移，物理引擎不知道你「移动过」，会穿模、推不动别人、平台带不动玩家。只适合相机、UI、纯视觉对象。' }, right: { title: 'Rigidbody 移动', html: '<code>velocity</code> 或 <code>MovePosition</code> 在物理步内移动，接触、摩擦、推动都正确。角色与平台一律选这条。' } },
      { t: 'callout', kind: 'warn', title: '两个最常见的物理 bug', html: '穿墙：速度过快 + 离散检测，改用 <code>Continuous</code> 或加厚墙体。抖动：在 <code>Update</code> 里改刚体，改到 <code>FixedUpdate</code> 并把插值（Interpolate）打开。' }
    ] },

    { label: 'UI 与反馈', blocks: [
      { t: 'table', head: ['需求', '设置', '说明'], rows: [
        ['屏幕自适应', 'Canvas Scaler → <code>Scale With Screen Size</code>', '参考分辨率 1920×1080，Match 0.5'],
        ['世界空间 UI', 'Render Mode → <code>World Space</code>', '血条、铭牌用，需面向相机'],
        ['暂停', '<code>Time.timeScale = 0</code>', '菜单动画用 <code>unscaledDeltaTime</code>'],
        ['音量转 dB', '<code>20 * Mathf.Log10(v)</code>', 'v = 0 要单独静音'],
        ['按钮事件', '<code>onClick.AddListener(...)</code>', '场景销毁前记得移除'],
        ['文字更新', '只在数值变化时赋值', '每帧拼接字符串会产生 GC'],
        ['层级', 'Sorting Order / Canvas Sort Order', 'UI 永远画在最上层'],
        ['安全区', '<code>Screen.safeArea</code>', '刘海屏与圆角屏必做']
      ], caption: '反馈三要素：信息、时机、强度；强度要匹配事件重要性' },
      { t: 'callout', kind: 'tip', title: '打击感三件套', html: '命中瞬间 hit stop 0.03–0.08 秒、相机小幅快速衰减的震动、受击方短促闪白，再叠一层粒子与音效。四者同时给，比任何一项拉满都有效。' }
    ] }
  ]
};
