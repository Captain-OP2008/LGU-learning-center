/* =====================================================================
 * projects.js · ECE3200 实战项目
 * 结构：{ id, title, en, tagline, level, minutes, chapters, goals, intro,
 *         milestones:[{ n, title, tasks, starter, hints, solution }] }
 * 三个项目由易到难，全部用 Unity + C#，分别对应 2D、3D 与期末交付。
 * ===================================================================== */
(function () {
  'use strict';

  CSC.registerProjects([

    /* ================================================================ P1 */
    {
      id: 'P1',
      title: '2D 平台跳跃垂直切片',
      en: 'PLATFORMER SLICE',
      tagline: '一个角色、一段关卡、三种反馈——把「跳起来舒服」做成可验证的最小作品。',
      level: '入门',
      minutes: 180,
      chapters: ['ch02', 'ch03', 'ch04', 'ch06'],
      goals: [
        '能写出帧率无关的平台跳跃控制，并说清每个参数对手感的影响',
        '能用射线与触发器实现着地、受伤、收集三类判定',
        '能用相机跟随、粒子与音效把操作结果清楚地告诉玩家',
        '能在一个可打包的工程里组织场景、预制体与脚本'
      ],
      intro: '平台跳跃是检验「手感」最直接的体裁：跳跃高度差 0.2 米、下落加速度差 20%，玩家的感受就完全不同。' +
        '这个项目不追求关卡数量，而是要求你把「按下去到角色响应」这条链上的每一环都调到位：输入采样、' +
        '重力曲线、土狼时间、相机跟随、落地反馈。做完之后，第 4 章那张参数表会变成你手上的具体数字。',
      milestones: [
        {
          n: 1,
          title: '角色控制与手感',
          tasks: [
            '在空场景里搭一个 20×10 的灰盒关卡（用 Sprite 方块即可），放一个玩家角色与若干平台。',
            '实现水平移动与跳跃：水平用加速度逼近目标速度，跳跃用初速度 + 重力，落地时清零垂直速度。',
            '加入土狼时间（离开平台后 0.1 秒内仍可跳）与跳跃缓冲（落地前 0.1 秒按跳会在落地瞬间生效）。',
            '把重力拆成上升与下落两段：下落时乘以 2.2，短按跳时提前截断上升速度。',
            '用 SerializeField 暴露速度、跳跃高度、重力倍率，边调边记录三组「舒服 / 太飘 / 太沉」的参数。'
          ],
          starter: `using UnityEngine;

[RequireComponent(typeof(Rigidbody2D))]
public class Platformer2D : MonoBehaviour
{
    [SerializeField] float moveSpeed = 7f;
    [SerializeField] float jumpVelocity = 13f;
    [SerializeField] float fallMultiplier = 2.2f;

    Rigidbody2D rb;
    float moveInput;

    void Awake() { rb = GetComponent<Rigidbody2D>(); }

    void Update()
    {
        moveInput = Input.GetAxisRaw("Horizontal");
        if (Input.GetButtonDown("Jump")) Jump();
    }

    void FixedUpdate()
    {
        rb.velocity = new Vector2(moveInput * moveSpeed, rb.velocity.y);

        // 下落阶段加重力，手感更利落
        if (rb.velocity.y < 0)
            rb.velocity += Vector2.up * Physics2D.gravity.y * (fallMultiplier - 1f) * Time.fixedDeltaTime;
    }

    void Jump()
    {
        rb.velocity = new Vector2(rb.velocity.x, jumpVelocity);
    }
}`,
          hints: [
            '为什么下落加速要乘 (fallMultiplier - 1)？因为重力本身已经在每帧生效，这里只补「额外」的那部分，否则会叠加成 3.2 倍。',
            '不要用 transform.Translate 移动带 Rigidbody2D 的角色，那会绕过物理检测，撞墙会抖动甚至穿墙。',
            '土狼时间用一个倒计时变量：离开地面时设为 0.1，每帧减去 deltaTime，跳跃时检查它是否大于 0。'
          ],
          solution: `using UnityEngine;

[RequireComponent(typeof(Rigidbody2D))]
public class Platformer2D : MonoBehaviour
{
    [SerializeField] float moveSpeed = 7f;
    [SerializeField] float jumpVelocity = 13f;
    [SerializeField] float fallMultiplier = 2.2f;
    [SerializeField] float coyoteTime = 0.1f;
    [SerializeField] float jumpBuffer = 0.1f;
    [SerializeField] Transform groundCheck;
    [SerializeField] LayerMask groundMask;

    Rigidbody2D rb;
    float moveInput;
    float coyoteTimer;
    float bufferTimer;
    bool grounded;

    void Awake() { rb = GetComponent<Rigidbody2D>(); }

    void Update()
    {
        moveInput = Input.GetAxisRaw("Horizontal");
        bufferTimer = Input.GetButtonDown("Jump") ? jumpBuffer : bufferTimer - Time.deltaTime;
        coyoteTimer = grounded ? coyoteTime : coyoteTimer - Time.deltaTime;

        if (bufferTimer > 0f && coyoteTimer > 0f)
        {
            rb.velocity = new Vector2(rb.velocity.x, jumpVelocity);
            bufferTimer = 0f;
            coyoteTimer = 0f;
        }
    }

    void FixedUpdate()
    {
        grounded = Physics2D.OverlapCircle(groundCheck.position, 0.15f, groundMask);
        rb.velocity = new Vector2(moveInput * moveSpeed, rb.velocity.y);

        if (rb.velocity.y < 0)
            rb.velocity += Vector2.up * Physics2D.gravity.y * (fallMultiplier - 1f) * Time.fixedDeltaTime;
    }
}`
        },
        {
          n: 2,
          title: '关卡、危险物与收集',
          tasks: [
            '用 Tilemap 拼出一段 60 秒可通关的关卡，包含教学、变化、考验三个段落。',
            '加一类会移动的平台（Kinematic 刚体 + MovePosition），确保玩家站上去会被带着走。',
            '加尖刺与掉落死亡：碰到尖刺受伤，掉出关卡边界直接重生到检查点。',
            '加 5 个收集物，用触发器实现，拾取后播放音效并更新 UI 计数。',
            '给 Tilemap 加 Composite Collider 2D，检查角色走过格子接缝时不会被卡住。'
          ],
          starter: `using UnityEngine;

public class Pickup : MonoBehaviour
{
    [SerializeField] AudioClip clip;
    [SerializeField] int value = 1;

    void OnTriggerEnter2D(Collider2D other)
    {
        if (!other.CompareTag("Player")) return;
        // 这里留了缺口：加分、播音效、销毁自己，由你补全
    }
}`,
          hints: [
            '触发器要生效，两个物体中至少一个要有 Rigidbody2D。玩家已有刚体，收集物保持静态即可。',
            '移动平台用 MovePosition 而不是 transform.position，玩家才会被「推着走」而不是穿过去。',
            'Composite Collider 需要和 Tilemap Collider 一起用，并把 Rigidbody 设为 Static；否则合并不生效。'
          ],
          solution: `using UnityEngine;

public class Pickup : MonoBehaviour
{
    [SerializeField] AudioClip clip;
    [SerializeField] int value = 1;
    [SerializeField] GameState state;

    void OnTriggerEnter2D(Collider2D other)
    {
        if (!other.CompareTag("Player")) return;
        state.AddScore(value);
        AudioSource.PlayClipAtPoint(clip, transform.position);
        Destroy(gameObject);
    }
}

// 移动平台
public class MovingPlatform : MonoBehaviour
{
    [SerializeField] Vector3 offset = new Vector3(4f, 0f, 0f);
    [SerializeField] float speed = 1.5f;

    Vector3 start;
    Rigidbody2D rb;

    void Awake() { start = transform.position; rb = GetComponent<Rigidbody2D>(); }

    void FixedUpdate()
    {
        Vector3 target = start + offset * Mathf.Sin(Time.time * speed);
        rb.MovePosition(target);
    }
}`
        },
        {
          n: 3,
          title: '反馈、相机与打包',
          tasks: [
            '写一个带前瞻与边界的相机跟随：玩家转向时镜头略微前移，到关卡边缘时停住。',
            '加落地尘土、受伤闪红、拾取飘字三类反馈，强度按事件重要性分级。',
            '加一个显示血量与收集数的 HUD，用 Canvas Scaler 适配 16:9 与 4:3。',
            '打一个 Windows 包，在另一台电脑上试玩，记录三个卡点或困惑点。',
            '按试玩记录改一处，再找一个人验证改动是否生效。'
          ],
          starter: `using UnityEngine;

public class CameraFollow2D : MonoBehaviour
{
    [SerializeField] Transform target;
    [SerializeField] float smoothTime = 0.2f;
    [SerializeField] Vector2 offset = new Vector2(0f, 1f);

    Vector3 velocity;

    void LateUpdate()
    {
        Vector3 desired = target.position + (Vector3)offset;
        transform.position = Vector3.SmoothDamp(transform.position, desired, ref velocity, smoothTime);
    }
}`,
          hints: [
            '相机跟随放 LateUpdate，保证在角色移动之后执行，否则画面会抖一帧。',
            '边界限制不要写死数字，用关卡包围盒（Bounds）算：把相机中心 clamp 在「包围盒缩小半个视口」的范围内。',
            '飘字用对象池，别每次拾取都 Instantiate，连续吃金币时会明显掉帧。'
          ],
          solution: `using UnityEngine;

public class CameraFollow2D : MonoBehaviour
{
    [SerializeField] Transform target;
    [SerializeField] float smoothTime = 0.2f;
    [SerializeField] Vector2 offset = new Vector2(0f, 1f);
    [SerializeField] Bounds levelBounds;

    Camera cam;
    Vector3 velocity;

    void Awake() { cam = GetComponent<Camera>(); }

    void LateUpdate()
    {
        float halfH = cam.orthographicSize;
        float halfW = halfH * cam.aspect;

        Vector3 desired = target.position + (Vector3)offset;
        desired.x = Mathf.Clamp(desired.x, levelBounds.min.x + halfW, levelBounds.max.x - halfW);
        desired.y = Mathf.Clamp(desired.y, levelBounds.min.y + halfH, levelBounds.max.y - halfH);
        desired.z = transform.position.z;

        transform.position = Vector3.SmoothDamp(transform.position, desired, ref velocity, smoothTime);
    }
}`
        }
      ]
    },

    /* ================================================================ P2 */
    {
      id: 'P2',
      title: '3D 潜行收集原型',
      en: 'STEALTH PROTOTYPE',
      tagline: '第三人称相机、巡逻敌人、可交互门——把 3D 空间里的「看见与被看见」做出来。',
      level: '进阶',
      minutes: 300,
      chapters: ['ch03', 'ch05', 'ch06', 'ch07'],
      goals: [
        '能搭出可用的第三人称相机，并处理遮挡与边界',
        '能用 NavMesh 实现巡逻、发现、追击、放弃四种状态',
        '能用触发器与 UI 把「被发现」这件事清楚地传达给玩家',
        '能定位并修复一个真实的性能或物理问题'
      ],
      intro: '3D 空间的核心问题是「玩家看不见自己身后」，所以相机与敌人的感知必须一起设计。' +
        '这个项目要求你做出一个 5 分钟可通关的小关卡：躲开巡逻敌人、拿到三件物品、从出口离开。' +
        '重点不是内容量，而是「敌人发现你」与「你发现敌人」这两件事是否清晰、是否公平。',
      milestones: [
        {
          n: 1,
          title: '第三人称移动与相机',
          tasks: [
            '用 CharacterController 实现相机相对移动：W 永远朝相机前方走，而不是世界 Z 轴。',
            '实现鼠标控制的环绕相机，限制俯仰角在 -30° 到 60° 之间，避免翻转。',
            '用 Linecast 检测相机与角色之间的墙，被遮挡时把相机拉近，而不是穿墙。',
            '加一个「锁定敌人」的按键，按下后相机与角色朝向同时对准目标。',
            '在斜坡与台阶上测试移动，记录角色是否抖动或悬空，并调整 Controller 的 Slope Limit 与 Step Offset。'
          ],
          starter: `using UnityEngine;

[RequireComponent(typeof(CharacterController))]
public class ThirdPersonController : MonoBehaviour
{
    [SerializeField] float speed = 6f;
    [SerializeField] float turnSmooth = 0.1f;
    [SerializeField] Transform cam;

    CharacterController cc;
    float turnVelocity;

    void Awake() { cc = GetComponent<CharacterController>(); }

    void Update()
    {
        float h = Input.GetAxisRaw("Horizontal");
        float v = Input.GetAxisRaw("Vertical");
        Vector3 dir = new Vector3(h, 0f, v).normalized;

        if (dir.magnitude >= 0.1f)
        {
            float targetAngle = Mathf.Atan2(dir.x, dir.z) * Mathf.Rad2Deg + cam.eulerAngles.y;
            float angle = Mathf.SmoothDampAngle(transform.eulerAngles.y, targetAngle, ref turnVelocity, turnSmooth);
            transform.rotation = Quaternion.Euler(0f, angle, 0f);
            cc.Move(Quaternion.Euler(0f, targetAngle, 0f) * Vector3.forward * speed * Time.deltaTime);
        }
    }
}`,
          hints: [
            '为什么要加 cam.eulerAngles.y？因为输入是相对屏幕的：相机转向后，「前」的方向也变了。',
            'CharacterController.Move 已经处理了碰撞，不要再叠加 Rigidbody，两者同时用会互相打架。',
            '相机避墙用 Physics.Linecast 从角色头部打到相机位置，命中就把相机放到命中点前方一点。'
          ],
          solution: `using UnityEngine;

[RequireComponent(typeof(CharacterController))]
public class ThirdPersonController : MonoBehaviour
{
    [SerializeField] float speed = 6f;
    [SerializeField] float turnSmooth = 0.1f;
    [SerializeField] Transform cam;
    [SerializeField] float gravity = -20f;

    CharacterController cc;
    float turnVelocity;
    float verticalVelocity;

    void Awake() { cc = GetComponent<CharacterController>(); }

    void Update()
    {
        float h = Input.GetAxisRaw("Horizontal");
        float v = Input.GetAxisRaw("Vertical");
        Vector3 dir = new Vector3(h, 0f, v).normalized;

        if (dir.magnitude >= 0.1f)
        {
            float targetAngle = Mathf.Atan2(dir.x, dir.z) * Mathf.Rad2Deg + cam.eulerAngles.y;
            float angle = Mathf.SmoothDampAngle(transform.eulerAngles.y, targetAngle, ref turnVelocity, turnSmooth);
            transform.rotation = Quaternion.Euler(0f, angle, 0f);
            cc.Move(Quaternion.Euler(0f, targetAngle, 0f) * Vector3.forward * speed * Time.deltaTime);
        }

        verticalVelocity = cc.isGrounded ? -2f : verticalVelocity + gravity * Time.deltaTime;
        cc.Move(Vector3.up * verticalVelocity * Time.deltaTime);
    }
}`
        },
        {
          n: 2,
          title: '巡逻敌人与感知',
          tasks: [
            '烘焙 NavMesh，放 2–3 个敌人，每个敌人在 3 个路点之间巡逻。',
            '实现视野检测：距离内且在视线角度内才算「看见」，中间有墙则不算。',
            '实现四状态迁移：巡逻 → 追击 → 攻击/搜索 → 放弃回巡逻。',
            '加「最后已知位置」：玩家脱离视野后，敌人先去最后看到的位置搜索几秒再放弃。',
            '处理卡住：速度接近 0 且仍有目标时，1.5 秒后 ResetPath。'
          ],
          starter: `using UnityEngine;
using UnityEngine.AI;

[RequireComponent(typeof(NavMeshAgent))]
public class Sentry : MonoBehaviour
{
    [SerializeField] Transform[] waypoints;
    [SerializeField] float sightRange = 10f;
    [SerializeField] float sightAngle = 60f;
    [SerializeField] LayerMask obstacleMask;

    NavMeshAgent agent;
    int index;

    void Awake() { agent = GetComponent<NavMeshAgent>(); }

    bool CanSeePlayer()
    {
        Vector3 to = PlayerRef.Position - transform.position;
        if (to.magnitude > sightRange) return false;
        if (Vector3.Angle(transform.forward, to) > sightAngle) return false;
        return !Physics.Raycast(transform.position + Vector3.up, to.normalized, to.magnitude, obstacleMask);
    }
}`,
          hints: [
            'Vector3.Angle 返回的是无符号夹角，正好适合做视野锥；sightAngle 写 60 表示左右各 60°。',
            '射线要从敌人眼睛高度出发（+Vector3.up），从脚底打会被地面挡住。',
            '搜索状态不要立刻回巡逻：给 3 秒「四处看」的时间，玩家才有紧张感与脱身机会。'
          ],
          solution: `using UnityEngine;
using UnityEngine.AI;

[RequireComponent(typeof(NavMeshAgent))]
public class Sentry : MonoBehaviour
{
    enum State { Patrol, Chase, Search }

    [SerializeField] Transform[] waypoints;
    [SerializeField] float sightRange = 10f;
    [SerializeField] float sightAngle = 60f;
    [SerializeField] LayerMask obstacleMask;
    [SerializeField] float searchTime = 3f;

    NavMeshAgent agent;
    State state = State.Patrol;
    int index;
    float searchTimer;
    Vector3 lastKnown;

    void Awake() { agent = GetComponent<NavMeshAgent>(); }

    void Update()
    {
        bool seen = CanSeePlayer();
        if (seen) { lastKnown = PlayerRef.Position; state = State.Chase; }

        switch (state)
        {
            case State.Patrol:
                if (!agent.pathPending && agent.remainingDistance < 0.5f)
                    index = (index + 1) % waypoints.Length;
                agent.SetDestination(waypoints[index].position);
                break;

            case State.Chase:
                agent.SetDestination(lastKnown);
                if (!seen && agent.remainingDistance < 0.8f)
                {
                    state = State.Search;
                    searchTimer = searchTime;
                }
                break;

            case State.Search:
                searchTimer -= Time.deltaTime;
                transform.Rotate(0f, 90f * Time.deltaTime, 0f);
                if (searchTimer <= 0f) state = State.Patrol;
                break;
        }
    }

    bool CanSeePlayer()
    {
        Vector3 eye = transform.position + Vector3.up;
        Vector3 to = PlayerRef.Position - eye;
        if (to.magnitude > sightRange) return false;
        if (Vector3.Angle(transform.forward, to) > sightAngle) return false;
        return !Physics.Raycast(eye, to.normalized, to.magnitude, obstacleMask);
    }
}`
        },
        {
          n: 3,
          title: '交互、UI 与打磨',
          tasks: [
            '做一扇需要按 E 打开的门，靠近时显示提示，打开后播放动画与音效。',
            '加「被发现」的 UI 提示与音效，让玩家在三秒内知道自己暴露了。',
            '加一个简单的任务栏：显示剩余收集物数量与出口是否开启。',
            '用 Profiler 看一次场景，找出一个瓶颈（阴影距离、材质数量或某段 Update），修掉它。',
            '打通一遍完整流程，记录时长与卡点，按记录调整敌人视野或巡逻路线。'
          ],
          starter: `using UnityEngine;

public class Interactable : MonoBehaviour
{
    [SerializeField] string prompt = "按 E 开门";

    public virtual void Interact() { }

    void OnTriggerEnter(Collider other)
    {
        if (other.CompareTag("Player")) HUD.ShowPrompt(prompt);
    }

    void OnTriggerExit(Collider other)
    {
        if (other.CompareTag("Player")) HUD.HidePrompt();
    }
}`,
          hints: [
            '交互检测别用每帧射线，触发器 + 一个「当前可交互对象」引用更省也更好维护。',
            '门的动画用 Animator 参数控制，不要直接改 transform.rotation，否则会和碰撞体不同步。',
            'UI 提示要能被打断：玩家离开范围、打开菜单、被发现时都要清掉，否则会一直挂在屏幕上。'
          ],
          solution: `using UnityEngine;

public class Door : Interactable
{
    [SerializeField] Animator anim;
    [SerializeField] AudioSource sfx;
    bool open;

    public override void Interact()
    {
        open = !open;
        anim.SetBool("Open", open);
        sfx.Play();
    }
}

// HUD 侧
public class HUD : MonoBehaviour
{
    static HUD instance;
    [SerializeField] GameObject promptRoot;
    [SerializeField] TMPro.TMP_Text promptText;

    void Awake() { instance = this; }

    public static void ShowPrompt(string text)
    {
        instance.promptText.text = text;
        instance.promptRoot.SetActive(true);
    }

    public static void HidePrompt() => instance.promptRoot.SetActive(false);
}`
        }
      ]
    },

    /* ================================================================ P3 */
    {
      id: 'P3',
      title: '期末项目：从灰盒到可交付',
      en: 'SHIP IT',
      tagline: '把一个想法推过四道门：可玩、完整、打磨、交付。',
      level: '挑战',
      minutes: 600,
      chapters: ['ch01', 'ch06', 'ch07'],
      goals: [
        '能把一个模糊的想法收敛成一句话核心循环，并用灰盒验证',
        '能按四阶段安排时间，在截止前留出打包与演示的余量',
        '能用试玩数据而不是直觉判断「改哪里」',
        '能产出一个可在别人电脑上运行、并有五分钟演示的成品'
      ],
      intro: '这个项目没有规定题材，只规定交付标准：别人能自己下载、自己玩懂、自己玩完，而你能在五分钟内' +
        '讲清「做了什么、为什么这样做、哪里没做好」。听起来简单，但每年都有大量项目卡在最后一步——' +
        '不是因为做得不好，而是因为从来没打过包、从来没让别人玩过、从来没彩排过演示。' +
        '把这三个「从来没」变成「做过一次」，就是本项目的全部意义。',
      milestones: [
        {
          n: 1,
          title: '核心循环与灰盒验证',
          tasks: [
            '用一句话写出核心循环：玩家为了 ______，需要 ______，失败会 ______。',
            '只用灰盒（方块、胶囊、纯色）搭出可玩关卡，不导入任何美术资源。',
            '实现最小闭环：输入、规则判定、反馈各至少一处，确保能赢也能输。',
            '找三个没看过项目的人试玩五分钟，不给提示，记录他们卡住的位置。',
            '根据记录改一处，再找一个人验证；如果三人中有两人能自己完成一次循环，进入下一阶段。'
          ],
          starter: `// 核心循环骨架：把「状态机」写成三个方法，先让流程跑通再谈表现
using UnityEngine;

public class GameLoop : MonoBehaviour
{
    public enum Phase { Ready, Playing, Win, Lose }

    public Phase phase = Phase.Ready;

    public void StartRun()
    {
        phase = Phase.Playing;
        // 重置分数、生命、敌人与玩家位置
    }

    public void Win()
    {
        if (phase != Phase.Playing) return;
        phase = Phase.Win;
        // 播放结算、记录最高分
    }

    public void Lose()
    {
        if (phase != Phase.Playing) return;
        phase = Phase.Lose;
        // 播放失败、提供重试
    }
}`,
          hints: [
            '「一句话核心循环」写不出来，通常说明玩法还没想清楚，不是文案问题。',
            '灰盒阶段不要做 UI 美化，用 Debug.Log 或最简单的 Text 足够验证流程。',
            '三人试玩时你只负责看和记，不要提示、不要解释——一解释，数据就废了。'
          ],
          solution: `using UnityEngine;
using UnityEngine.SceneManagement;

public class GameLoop : MonoBehaviour
{
    public enum Phase { Ready, Playing, Win, Lose }

    [SerializeField] int targetScore = 10;
    [SerializeField] PlayerHealth player;

    public Phase phase = Phase.Ready;
    int score;

    void Start() { StartRun(); }

    public void StartRun()
    {
        score = 0;
        phase = Phase.Playing;
        player.ResetHealth();
    }

    public void AddScore(int v)
    {
        if (phase != Phase.Playing) return;
        score += v;
        if (score >= targetScore) Win();
    }

    public void Win()
    {
        if (phase != Phase.Playing) return;
        phase = Phase.Win;
        Debug.Log("WIN");
    }

    public void Lose()
    {
        if (phase != Phase.Playing) return;
        phase = Phase.Lose;
        Debug.Log("LOSE");
    }

    public void Restart() => SceneManager.LoadScene(SceneManager.GetActiveScene().buildIndex);
}`
        },
        {
          n: 2,
          title: '系统完整与内容填充',
          tasks: [
            '补齐流程：主菜单 → 关卡 → 结算 → 重试或返回，场景切换不丢状态。',
            '实现检查点：记录位置、血量与已收集物，死亡后正确恢复（包括重置该区域敌人）。',
            '加暂停菜单与设置（音量、灵敏度），确认暂停时该停的停、不该停的继续。',
            '把关键反馈补齐：受伤、得分、胜负各至少两种通道（视觉 + 听觉）。',
            '功能冻结：写下「不再新增系统」的日期，之后只修 bug 与调手感。'
          ],
          starter: `using UnityEngine;

public class Checkpoint : MonoBehaviour
{
    [SerializeField] Transform spawnPoint;

    void OnTriggerEnter(Collider other)
    {
        if (!other.CompareTag("Player")) return;
        GameState.Instance.SetCheckpoint(spawnPoint.position, other.transform.rotation);
    }
}

public class GameState : MonoBehaviour
{
    public static GameState Instance { get; private set; }

    public Vector3 SpawnPosition { get; private set; }
    public Quaternion SpawnRotation { get; private set; }

    void Awake()
    {
        if (Instance != null && Instance != this) { Destroy(gameObject); return; }
        Instance = this;
        DontDestroyOnLoad(gameObject);
    }

    public void SetCheckpoint(Vector3 pos, Quaternion rot)
    {
        SpawnPosition = pos;
        SpawnRotation = rot;
    }
}`,
          hints: [
            'DontDestroyOnLoad 的对象回到主菜单时要重置状态，否则「新游戏」会带着上一局的分数。',
            '检查点不要存 Transform 引用（场景一重载就失效），存坐标与朝向的数值。',
            '暂停用 Time.timeScale = 0，但菜单动画与音频要用 unscaledDeltaTime 或 Realtime 版本。'
          ],
          solution: `using UnityEngine;
using UnityEngine.SceneManagement;

public class GameState : MonoBehaviour
{
    public static GameState Instance { get; private set; }

    public Vector3 SpawnPosition { get; private set; }
    public Quaternion SpawnRotation { get; private set; }
    public int Score { get; private set; }

    void Awake()
    {
        if (Instance != null && Instance != this) { Destroy(gameObject); return; }
        Instance = this;
        DontDestroyOnLoad(gameObject);
    }

    public void SetCheckpoint(Vector3 pos, Quaternion rot)
    {
        SpawnPosition = pos;
        SpawnRotation = rot;
    }

    public void AddScore(int v) => Score += v;

    public void ResetRun()
    {
        Score = 0;
        SpawnPosition = Vector3.zero;
        SpawnRotation = Quaternion.identity;
        Time.timeScale = 1f;
        SceneManager.LoadScene(0);
    }
}`
        },
        {
          n: 3,
          title: '打磨、打包与演示',
          tasks: [
            '按「阻塞性 bug → 手感 → 视觉」的顺序清理问题清单，每修一类就找人验证一次。',
            '跑一次 Profiler，把 GC Alloc 与 draw call 各压到一个可接受的水平，并记录改动前后数字。',
            '打一个 Windows 包，发给一位同学，让他在自己电脑上解压、运行、玩三分钟。',
            '准备五分钟演示：一句话介绍、实机演示、设计决策、不足与下一步，并彩排两次。',
            '写一页作品集文档：一句话介绍、三张截图、核心机制、你负责的部分、可玩链接。'
          ],
          starter: `# 交付检查表（复制到自己的工程根目录，逐项打勾）
- [ ] 所有场景已加入 Build Settings，0 号场景是主菜单
- [ ] 产品名、图标、默认分辨率已设置
- [ ] 无编译错误与红色报错
- [ ] 打包后材质没有变粉（shader 未丢失）
- [ ] 音量、画质、键位设置能保存并在重启后生效
- [ ] 从主菜单到通关一遍无阻塞
- [ ] 在另一台电脑上运行成功
- [ ] 演示彩排两次，时长控制在 5 分钟内`,
          hints: [
            '打包越早越好：第一次打包暴露的问题往往需要改工程设置，不是改代码。',
            '演示时准备一个「安全存档」或跳关键，现场卡住能立刻救场。',
            '作品集里的「我负责的部分」要具体：不是「负责关卡」，而是「设计并实现 3 个教学关卡」。'
          ],
          solution: `# 五分钟演示脚本（可直接照着练）
0:00–0:30  一句话：这是一个「潜行 + 收集」的小关卡，玩家要在不被发现的前提下拿走三件物品。
0:30–3:30  实机演示：从关卡中段开始（跳过教学），展示一次被发现、一次成功脱身、一次通关。
3:30–4:30  设计决策：为什么敌人视野是 60°、为什么给 3 秒搜索时间、试玩后把巡逻路线改短的原因。
4:30–5:00  不足与下一步：性能在多人同屏时下降、关卡引导不够；下一步做动态难度与提示系统。
`
        }
      ]
    }
  ]);
})();
