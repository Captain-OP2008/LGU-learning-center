/* =====================================================================
 * ch00.js · 第 0 章「课程地图：游戏设计在解决什么问题」
 * 职责：给整门课画一张地图——游戏设计的问题、七章依赖、Unity 工具链与本站用法。
 * 依据：ECE3200 课程介绍（Lec0 Course Intro）、Lecture 01 Intro Games 与 Lab 1 讲义。
 * schema：CSC.registerChapter({ id, num, title, en, goals, kp, blocks })
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch00',
  num: '00',
  title: '课程地图：游戏设计在解决什么问题',
  en: 'COURSE MAP',
  goals: [
    '说清「游戏设计」研究的是规则、玩家与体验三者的关系，而不是单纯地写代码',
    '画出七章从「玩」到「可交付原型」的依赖链，指出哪三章是动手做游戏的前提',
    '在自己的电脑上装好 Unity Hub 与编辑器，新建并跑通一个 3D 工程',
    '解释 Unity 的 GameObject–Component 模型与 C# 脚本的生命周期顺序',
    '按「读正文 → 做 Lab → 刷题 → 改项目」四条线排出一学期可执行的学习节奏'
  ],
  kp: [
    { id: 'ch00-1', title: '这门课到底在教什么' },
    { id: 'ch00-2', title: '七章地图与依赖关系' },
    { id: 'ch00-3', title: '三条主线：规则、实现、体验' },
    { id: 'ch00-4', title: 'Unity 的 GameObject–Component 模型' },
    { id: 'ch00-5', title: '从空场景到可玩的最小闭环' },
    { id: 'ch00-6', title: '工具链与工程目录约定' },
    { id: 'ch00-7', title: '考核方式与 Lab 节奏' },
    { id: 'ch00-8', title: '教材、资料库与本站用法' }
  ],
  blocks: [
    { t: 'callout', kind: 'why', title: '为什么先读这一章', html: '很多人对游戏设计的第一印象是「会写代码就能做游戏」。真做起来才发现：代码只决定<b>能不能跑</b>，设计才决定<b>好不好玩</b>。一个跳跃手感糟糕的平台游戏，物理参数完全正确也没人愿意玩；一个画面粗糙的纸面原型，规则对了就能让人连玩十局。这门课要训练的是后者——<b>用规则和反馈去构造体验</b>，而 Unity 与 C# 只是把体验交付出去的工具。先把地图摊开，你才知道每学一个组件是在为哪种体验服务。' },

    { t: 'p', lead: true, html: 'ECE3200 的课程资料里同时躺着三类东西：讲「游戏是什么」的理论幻灯片（Lecture 01 Intro Games、Lecture 11 Life Is a Game）、讲「怎么在 Unity 里做出来」的八次 Lab 讲义、以及三次作业与期末项目指南。这三类东西不是并列的，而是一条链：<b>先想清楚玩家要经历什么，再决定用什么机制实现，最后用引擎把机制跑起来</b>。本站的七章就按这条链重排。' },

    { t: 'h', lvl: 2, text: '一、这门课到底在教什么', id: 'ch00-1' },

    { t: 'p', html: '先看一个具体差别。同样是「做一个能跳的平台游戏」，一种做法是打开 Unity，给角色加 <code>Rigidbody</code>，调重力，试到能跳为止；另一种做法是先问三个问题：<b>玩家按跳跃键之后，希望感觉到什么？</b>（轻盈还是厚重）<b>跳跃能解决什么问题？</b>（越过障碍、够到平台、躲避攻击）<b>如果跳失败了，玩家知道为什么吗？</b>（跳早了、跳晚了、还是距离不够）。第二种做法会先画一张跳跃高度与按键时长的曲线，再去调物理参数。这门课要你养成的是第二种习惯。' },

    { t: 'p', html: '所以课程内容可以概括成一句话：<b>先定义体验，再设计规则，最后实现并验证。</b>理论部分给你词汇（玩法、机制、动态、体验、魔法圈），Lab 部分给你实现手段（场景、组件、物理、UI、音效），作业与项目逼你把两者接起来。考试里的理论题考的是概念辨析，Lab 与项目考的是能不能把概念变成可运行的东西，两边都不能偏。' },

    { t: 'table', head: ['这门课会做', '这门课不做'], rows: [
      ['设计并实现一个可玩的小游戏原型（2D / 2.5D / 3D）', '从零写一个自研引擎或渲染器'],
      ['用 MDA、核心循环、难度曲线等框架分析一款商业游戏', '写一份几百页的完整游戏设计文档'],
      ['用 Unity 完成场景搭建、脚本、物理、UI、音效的基本闭环', '把 Unity 的每一个 API 背下来'],
      ['做纸面原型与可玩性测试，按反馈改规则', '追求美术品质达到商业发行标准'],
      ['用 C# 写出结构清楚、可维护的组件脚本', '研究 C# 语言规范的全部细节'],
      ['在期末项目中按时交付一个能演示的版本', '做一个上线运营的完整商业产品']
    ], caption: '目标是「能设计、能实现、能验证」，不是「能背 API」' },

    { t: 'callout', kind: 'tip', title: '判断自己是否学懂的标准', html: '给你一个自己做过的小游戏，你能否回答四个问题：<b>核心循环是什么？玩家每 30 秒在做什么决定？失败时玩家得到了什么信息？如果把某一个机制删掉，体验会怎么变？</b>四个都答得出，说明你在做设计；只答得出「用了哪些组件」，说明你还在做配置。' },

    { t: 'h', lvl: 2, text: '二、七章地图与依赖关系', id: 'ch00-2' },

    { t: 'p', html: '七章不是七个孤立的话题，而是一条从「理解玩」到「交付原型」的链路。下面这张表既是目录，也是你卡住时该回来看的地图。' },

    { t: 'table', head: ['章', '主题', '核心问题', '为后面哪一章铺路'], rows: [
      ['01', '游戏与玩法', '什么是游戏？规则、玩家与体验之间是什么关系？', '全部章节的设计判断标准'],
      ['02', 'Unity 与 C# 入门', '场景、对象、组件、脚本各自负责什么？脚本什么时候被调用？', 'ch03 物理脚本、ch04 相机控制、ch06 UI 逻辑'],
      ['03', '物理引擎', '刚体为什么会穿墙？碰撞与触发有什么区别？射线能做什么？', 'ch04 角色移动、ch05 3D 交互、ch07 战斗判定'],
      ['04', '2D 与 2.5D 关卡', '精灵怎么排序？正交相机怎么构图？关卡难度怎么排？', 'ch07 关卡与节奏设计'],
      ['05', '3D 世界', '三维空间里位置、旋转、缩放怎么算？光照与材质如何影响可读性？', 'ch07 场景搭建与性能'],
      ['06', 'UI、音效与反馈', '玩家怎么知道发生了什么？界面与声音怎样强化反馈？', 'ch07 成品打磨'],
      ['07', '3D 进阶与交付', '动画、导航、优化、打包，怎样把原型变成能演示的成品？', '期末项目与作品集']
    ], caption: 'Part II（01–02）打基础，Part III（03–05）学实现，Part IV（06–07）做整合' },

    { t: 'p', html: '依赖关系有两条硬约束。第一，<b>没有第 02 章的组件模型，后面所有 Lab 都只能照抄步骤</b>：你不知道脚本挂在哪里、<code>Update</code> 与 <code>FixedUpdate</code> 为什么分开、引用为什么会在 Inspector 里丢失。第二，<b>没有第 03 章的物理概念，第 04、05 章的角色控制就是玄学</b>：角色抖动、穿墙、跳不上台阶，九成原因在碰撞体与刚体设置，而不是代码逻辑。其余章节可以按兴趣调整顺序，但 01 → 02 → 03 建议按顺序读。' },

    { t: 'p', html: '时间上给个参考：每章正文约 20–25KB，正常阅读加跟着敲代码需要 90–120 分钟；章末自检 15 分钟；题库 7 题按每题 3 分钟算约 20 分钟。一周推进一章、留出两天做 Lab，七章正好一个学期。如果只想应付考试，至少把 ch01–ch03 与 ch06 读透，ch04、ch05、ch07 抓住结论与常见错误。' },

    { t: 'h', lvl: 2, text: '三、三条主线：规则、实现、体验', id: 'ch00-3' },

    { t: 'p', html: '七章内容可以压成三条主线。做项目卡住时，先判断自己缺的是哪一条，再回对应章补，比从头重读高效得多。' },

    { t: 'steps', items: [
      { title: '主线一 · 规则与玩法（ch01、ch04）', html: '关心「玩家能做什么决定、这些决定有什么后果」。核心动作：写出核心循环，列出资源与风险，画出难度曲线。规则不清，后面做得再漂亮也只是演示。' },
      { title: '主线二 · 实现与系统（ch02、ch03、ch05）', html: '关心「怎样让规则在引擎里稳定运行」。核心动作：拆组件、定生命周期、调物理参数、搭三维场景。系统不稳，玩家会把设计问题误认为 bug。' },
      { title: '主线三 · 反馈与交付（ch06、ch07）', html: '关心「玩家是否读懂了系统，成品能否交付」。核心动作：加界面提示、加音效与动效、做性能优化、打包与试玩。反馈缺失，再好的机制也没人发现。' }
    ] },

    { t: 'p', html: '三条主线在考核里对应三类题：<b>概念辨析</b>（主线一，如「机制与动态的区别」）、<b>读代码/改参数</b>（主线二，如「这段脚本为什么在 <code>FixedUpdate</code> 里改速度」）、<b>设计分析</b>（主线三，如「给这个关卡提三条改进建议并说明依据」）。三类都要练，只背概念会在 Lab 上卡住，只做 Lab 会在理论题上丢分。' },

    { t: 'compare', left: { title: '先实现，再想设计', html: '打开引擎就搭场景，看到什么加什么，做到一半发现「不好玩」，于是不断加特效掩盖。结果是工期拖长、代码越改越乱，最后交不出可演示的版本。' }, right: { title: '先纸面，再实现', html: '用纸笔或卡片把核心循环走一遍：玩家做什么、系统给什么反馈、失败会怎样。规则能在纸上玩通，再进引擎实现。这样每一行代码都在服务一个已经验证过的决定。' } },

    { t: 'p', html: '纸面原型不代表可以跳过实现。它的意思是：<b>每个机制都要先回答「它制造了什么决定」</b>。加一个二段跳，是因为「有些平台单跳够不到，玩家需要一次空中决策」；加一个冷却时间，是因为「同一招连发会让战斗没有取舍」。说不出它制造了什么决定，这个机制大概率只是装饰。' },

    { t: 'h', lvl: 2, text: '四、Unity 的 GameObject–Component 模型', id: 'ch00-4' },

    { t: 'p', html: 'Unity 的世界里没有「类继承树」，只有<b>对象加组件</b>。场景里的每个东西都是一个 <code>GameObject</code>（游戏对象），它本身几乎什么都不做，只提供一个容器；真正赋予它能力的是挂在它身上的 <code>Component</code>（组件）：<code>Transform</code> 决定位置，<code>MeshRenderer</code> 决定长什么样，<code>Rigidbody</code> 决定受不受重力，<code>Collider</code> 决定能不能被撞到，你自己写的 C# 脚本也是组件。' },

    { t: 'p', html: '这套模型的好处是组合优于继承：想要一个「会发光、会响、会追人」的敌人，不需要写一个继承三层基类的 <code>Enemy</code>，而是给同一个对象挂上 <code>Light</code>、<code>AudioSource</code>、<code>NavMeshAgent</code> 与自定义的 <code>ChaseAI</code>。坏处是依赖关系藏在 Inspector 里——脚本引用了哪个对象、哪个预制体，代码里看不出来，所以工程规范格外重要。' },

    { t: 'code', lang: 'csharp', caption: '一个最小脚本：看清生命周期方法的顺序', code: `using UnityEngine;

public class Spinner : MonoBehaviour
{
    public float degreesPerSecond = 90f;

    // 对象被创建后、第一帧之前调用一次；用来拿引用、做初始化
    void Awake()
    {
        Debug.Log("Awake: " + name);
    }

    // 每次组件被启用时调用；禁用再启用会再次调用
    void OnEnable()
    {
        Debug.Log("OnEnable");
    }

    // 每帧调用，间隔不固定；放输入、相机、动画等不需要物理精度的逻辑
    void Update()
    {
        transform.Rotate(0f, degreesPerSecond * Time.deltaTime, 0f);
    }

    // 固定时间步调用，默认 0.02 秒一次；物理相关必须放这里
    void FixedUpdate()
    {
        // 例如给刚体施加力
    }
}` },

    { t: 'table', head: ['组件', '负责什么', '常见误用'], rows: [
      ['<code>Transform</code>', '位置、旋转、缩放，以及父子层级', '在物理对象上用 <code>transform.position</code> 直接改位置，导致穿模'],
      ['<code>Rigidbody</code>', '把对象交给物理系统：重力、力、碰撞响应', '给静态场景物件挂刚体，浪费性能还会自己滑动'],
      ['<code>Collider</code>', '定义碰撞形状，决定「什么算撞上」', '形状和模型差太远，出现看不见的碰撞或穿过去'],
      ['<code>MonoBehaviour</code>', '脚本基类，提供生命周期与 Inspector 序列化', '初始化写在 <code>Start</code> 却依赖另一脚本 <code>Awake</code> 的结果'],
      ['<code>Camera</code>', '把三维世界投影到屏幕', '场景里有多个相机同时启用，画面互相覆盖']
    ], caption: '先问「这件事该由哪个组件负责」，再写代码' },

    { t: 'h', lvl: 2, text: '五、从空场景到可玩的最小闭环', id: 'ch00-5' },

    { t: 'p', html: '抽象地讲「做游戏」很空。第一周你真正要打通的是这样一条链：<b>新建场景 → 放一个地面 → 放一个玩家 → 让玩家能动 → 让玩家能碰到目标 → 碰到之后有反馈</b>。这条链打通，后面所有 Lab 都只是往里面加东西。' },

    { t: 'steps', items: [
      { title: '第一步 · 建工程', html: '用 Unity Hub 新建 3D 工程（URP 或 Built-in 均可，跟课程 Lab 保持一致）。工程名用英文，路径不要含中文与空格，避免打包时出现路径错误。' },
      { title: '第二步 · 搭静态场景', html: '用 <code>GameObject &gt; 3D Object &gt; Plane</code> 做地面，放几个 <code>Cube</code> 做墙。静态物体不要挂 <code>Rigidbody</code>，它们只需要 <code>Collider</code>。' },
      { title: '第三步 · 放玩家', html: '用一个 <code>Capsule</code> 当玩家代表，挂上 <code>Rigidbody</code> 与 <code>CapsuleCollider</code>，把刚体的 <code>Freeze Rotation</code> 勾上，防止它被撞倒。' },
      { title: '第四步 · 写移动脚本', html: '在 <code>Update</code> 里读 <code>Input.GetAxis</code>，在 <code>FixedUpdate</code> 里用 <code>rb.MovePosition</code> 或 <code>AddForce</code> 移动。不要在 <code>Update</code> 里直接改 <code>transform.position</code> 去推物理对象。' },
      { title: '第五步 · 加目标与反馈', html: '放一个触发器区域，玩家进入时 <code>OnTriggerEnter</code> 触发，改变一个计数并在 Console 或 UI 文本上显示。反馈必须在 0.1 秒内出现，否则玩家感受不到因果。' }
    ] },

    { t: 'code', lang: 'csharp', caption: '最小移动与触发器反馈', code: `using UnityEngine;

[RequireComponent(typeof(Rigidbody))]
public class PlayerMove : MonoBehaviour
{
    public float speed = 6f;
    public int score = 0;

    Rigidbody rb;

    void Awake()
    {
        rb = GetComponent<Rigidbody>();
    }

    void FixedUpdate()
    {
        float h = Input.GetAxis("Horizontal");
        float v = Input.GetAxis("Vertical");
        Vector3 dir = new Vector3(h, 0f, v).normalized;
        rb.MovePosition(rb.position + dir * speed * Time.fixedDeltaTime);
    }

    void OnTriggerEnter(Collider other)
    {
        if (other.CompareTag("Pickup"))
        {
            score++;
            Debug.Log("得分：" + score);
            other.gameObject.SetActive(false);
        }
    }
}` },

    { t: 'p', html: '注意两个细节。第一，<code>MovePosition</code> 要配合 <code>Time.fixedDeltaTime</code>，因为它作用于物理步；写成 <code>Time.deltaTime</code> 在低帧率下会变慢。第二，<code>OnTriggerEnter</code> 生效的前提是「至少一方有刚体，且至少一方勾了 <code>Is Trigger</code>」，两个条件缺一个都不会触发——这是 Lab 里最常见的「代码没错但没反应」。' },

    { t: 'callout', kind: 'warn', title: '新手最常踩的四个坑', html: '<b>坑一：脚本没挂到对象上。</b>代码写在文件里不会自动运行，必须拖到 Inspector 的组件列表。<br><b>坑二：引用为空。</b><code>public GameObject target;</code> 忘了在 Inspector 里拖，运行时报 <code>NullReferenceException</code>。<br><b>坑三：改了预制体却没保存。</b>在场景里改实例不会影响预制体，反过来要拖回或点 <code>Apply</code>。<br><b>坑四：误以为 <code>Start</code> 一定早于别的脚本。</b>脚本间初始化顺序不确定，跨脚本依赖放到 <code>Awake</code> 拿引用、<code>Start</code> 用引用，或显式配置 Script Execution Order。' },

    { t: 'h', lvl: 2, text: '六、工具链与工程目录约定', id: 'ch00-6' },

    { t: 'p', html: '课程 Lab 全部在 Unity 里完成，版本以当学期 Lab 讲义标注为准（近年为 Unity 2021 LTS 及以上）。同一个工程被不同版本打开会触发资源升级，升级后旧版本打不开，所以<b>组内统一版本</b>是第一条纪律。版本管理用 Git，但只提交源码与 <code>Assets/</code>、<code>ProjectSettings/</code>、<code>Packages/</code>，不要提交 <code>Library/</code>、<code>Temp/</code>、<code>Logs/</code>、<code>obj/</code>。' },

    { t: 'code', lang: 'text', caption: '推荐的 Assets 目录结构（Lab 与期末项目通用）', code: `Assets/
  Art/            模型、贴图、材质、动画
  Audio/          音乐与音效
  Prefabs/        可复用对象（玩家、敌人、道具、UI 面板）
  Scenes/         每个关卡一个场景，另有一个 Boot 场景
  Scripts/
    Core/         游戏管理器、存档、事件
    Player/       玩家控制与状态
    Enemies/      敌人 AI
    UI/           界面逻辑
  Settings/       渲染管线、输入、质量设置` },

    { t: 'table', head: ['工具', '用途', '本课要求'], rows: [
      ['Unity Hub + Editor', '工程管理与编辑器', '装 LTS 版本，与 Lab 讲义一致'],
      ['Visual Studio / Rider', '写 C#、断点调试', '能附加到 Unity 进程调试'],
      ['Git + GitHub / GitLab', '版本管理、组内协作', '提交时忽略 Library 与 Temp'],
      ['Unity Profiler', '看帧率、GC、Draw Call', 'ch07 优化时必用'],
      ['纸笔 / 白板 / 卡片', '纸面原型与规则推演', '每个项目第一步都用']
    ], caption: '工具不是越多越好，能把「改—跑—看—记」循环走顺就够了' },

    { t: 'p', html: '调试顺序建议固定成三步：<b>先看 Console 的第一条报错</b>（后面的多半是连锁反应）、<b>再定位到脚本与行号</b>（双击报错会跳到对应行）、<b>最后用 <code>Debug.Log</code> 或断点确认假设</b>。Unity 的报错经常指向引擎内部，真正的错误往往在你自己的脚本调用处，学会读堆栈比背 API 有用。' },

    { t: 'h', lvl: 2, text: '七、考核方式与 Lab 节奏', id: 'ch00-7' },

    { t: 'p', html: '本课的成绩通常由 Lab 与作业、期中小测（理论）、期末项目与演示构成。比例每学期会调整，但结构稳定：<b>平时分看的是「有没有真的动手做出来」，期末看的是「能不能讲清设计决策」</b>。两条线都不能靠考前突击。' },

    { t: 'table', head: ['环节', '大致占比', '怎么准备'], rows: [
      ['Lab 出席与当堂完成', '10–20%', '提前读当次 Lab 讲义，把上一节的工程打开热身'],
      ['Assignment 1–3', '20–30%', '独立完成，提交前按清单自测：能跑、无报错、有说明'],
      ['期中小测（理论）', '15–25%', '覆盖 ch01、ch06 的概念与课堂讨论，简答题要能举例'],
      ['期末项目', '30–40%', '按 Final Project Guidance 的里程碑推进，留两周做打磨与试玩'],
      ['课堂参与与试玩反馈', '5–10%', '给同学的作品写具体反馈：哪一刻困惑、哪一刻无聊']
    ], caption: '占比以当学期 syllabus 为准；上表用于安排投入优先级' },

    { t: 'p', html: '一周的节奏可以这样排：周一读一章正文并跑通示例；周三做当周 Lab，把踩到的坑记进笔记；周五推进项目的一个里程碑；周日花 20 分钟用速查表复述本周概念，并给同学的作品试玩十分钟。累计约 5–6 小时，比考前通宵两天有效得多。' },

    { t: 'callout', kind: 'ai', title: 'AI 时代怎么用本站', html: '可以让 AI 解释报错、生成测试用例、帮你把设计想法拆成机制清单，但<b>不要让它替你写完整项目</b>。有效的用法是：先自己写出能跑的版本，再让 AI 指出「哪里耦合过重、哪个状态没有反馈、哪个参数可能让玩家困惑」，然后逐条验证。演示与答辩是口头的，理解只能长在你自己脑子里。' },

    { t: 'h', lvl: 2, text: '八、教材、资料库与本站用法', id: 'ch00-8' },

    { t: 'p', html: '课程的阅读材料以讲义为主：<code>Lecture 01 Intro Games</code> 建立「游戏是什么」的基本框架，<code>fundamentals of game design</code> 提供较系统的设计词汇，<code>Lecture 11 Life Is a Game</code> 把游戏机制放到现实决策里讨论。实现部分全部看 Lab 1–8 的讲义与 Guidance：Lab 1 是 Unity 与 C# 入门，Lab 2 讲物理引擎，Lab 3–5 做 2D 与 2.5D，Lab 7–8 做 3D，Lab 6 与 Additional Sound 补 UI 与音效。' },

    { t: 'p', html: '本站不复制讲义，而是按七章重新组织例子、对比与自检；讲义、作业、考试样卷与素材包都在资料库页，链接指向本机 <code>CUHKSZ course/ECE3200/</code> 下的原始文件。用法建议：<b>正文用来建立结构，Lab 用来练手，题库用来自查，项目用来整合</b>。读正文时把不理解的词记下来，去术语表与速查表对照；做 Lab 卡住时先回对应章看「常见错误」，九成问题那里有答案。' },

    { t: 'terms', items: [
      { en: 'game design', zh: '游戏设计', html: '设计规则、系统与反馈，使玩家在其中有意义地做决定并产生体验的实践活动。' },
      { en: 'gameplay', zh: '玩法', html: '玩家与规则交互的整个过程，包含选择、执行、结果与再选择。' },
      { en: 'mechanic', zh: '机制', html: '一条可执行的最小规则，例如「按下空格跳起 2 米」「碰到金币加 1 分」。' },
      { en: 'dynamics', zh: '动态', html: '机制在玩家实际操作中涌现出的行为模式，例如「玩家会一直贴墙走以跳过敌人」。' },
      { en: 'core loop', zh: '核心循环', html: '玩家反复执行的那组动作：观察 → 决策 → 操作 → 得到反馈 → 再观察。' },
      { en: 'GameObject', zh: '游戏对象', html: 'Unity 场景中的基本容器，本身不做任何事，能力全部来自挂载的组件。' },
      { en: 'component', zh: '组件', html: '挂在游戏对象上的功能模块，如 Transform、Rigidbody、Collider 与自定义脚本。' },
      { en: 'prefab', zh: '预制体', html: '可复用的对象模板；改预制体会同步到所有实例，是批量维护关卡物件的手段。' }
    ] },

    { t: 'quiz', qid: 'ch00-q1' },
    { t: 'quiz', qid: 'ch00-q2' },
    { t: 'quiz', qid: 'ch00-q3' },

    { t: 'keypoint', items: [
      { title: '设计先于实现', html: '先定义玩家要经历的体验与要做的决定，再选组件与参数；反过来做，只会得到一堆能跑但不好玩的功能。' },
      { title: '01 → 02 → 03 是硬依赖', html: '玩法框架决定判断标准，组件模型决定代码怎么写，物理概念决定角色为什么抖。' },
      { title: 'GameObject 是容器，组件才是能力', html: '组合优于继承；依赖关系藏在 Inspector 里，所以目录规范与命名比想象中重要。' },
      { title: '生命周期决定了代码放哪里', html: '<code>Awake</code> 拿引用、<code>Start</code> 用引用、<code>Update</code> 做每帧逻辑、<code>FixedUpdate</code> 做物理。' },
      { title: '最小闭环是全课的缩影', html: '场景 → 玩家 → 移动 → 碰撞 → 反馈，五步打通，后面所有 Lab 都是往这条链上加东西。' }
    ] },

    { t: 'checklist', id: 'ch00', items: [
      '我能用一句话说清「游戏设计」与「游戏编程」的区别',
      '我能不看目录写出七章的顺序，并说出 ch01–ch03 为什么不能跳',
      '我在自己的电脑上装好 Unity，并成功新建、保存、运行了一个 3D 场景',
      '我能解释 GameObject 与 Component 的关系，并各举三个例子',
      '我能说出 <code>Awake</code>、<code>Start</code>、<code>Update</code>、<code>FixedUpdate</code> 的调用时机与适用场景',
      '我做出了一个能用键盘移动、碰到物体会打印得分的最小场景',
      '我知道触发器生效需要哪两个条件，并能说出缺一个会怎样',
      '我知道工程里哪些目录不该提交到 Git，为什么',
      '我知道本课成绩由哪几部分组成，并给自己排了一周的学习时间',
      '我知道资料库在哪里，能说出至少三份最该先看的文件'
    ] },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html: '本章依据 ECE3200 课程介绍（Lec0 Course Intro）、Lecture 01 Intro Games、Lab 1 讲义与 Final Project Guidance 组织；七章划分对应课程讲义的主题顺序（游戏理论 → Unity 入门 → 物理 → 2D/2.5D → 3D → UI 与音效 → 综合交付），并省略了与本站重复的编辑器菜单细节。考核占比为课程 syllabus 的常见区间，具体以当学期通知为准。若你的 Lab 编号与本站章节对应不同，按主题检索即可，不影响后续学习。' }
  ]
});
