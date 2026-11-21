/* =====================================================================
 * data/ch18.js · 第 18 章：项目三 · Snake 贪吃蛇
 * 职责：把 Part VI 的 Python 语法、类与继承、Tkinter 全部落到一个完整项目——
 *       需求解读、游戏循环设计、class SnakeGame(tk.Tk) 的 __init__ 逐行、
 *       start_game/setup_ui/run_game/update_ui 循环链、方向锁、move_snake 的
 *       移动与碰撞、create_food 重抽、game_over 收尾与两种食物的扩展。
 * 对外 API：CSC.registerChapter({...}）（block schema 见 _dev/CONTRACT.md §4–§5）
 * 注意：Python 无法在站内引擎执行，本章所有代码块 run:false。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch18',
  num: '18',
  title: '项目三：Snake 贪吃蛇',
  en: 'Project III · Snake',
  goals: [
    '能复述 Snake 项目的基本功能、三种结束条件与六个进阶方向',
    '能画出 SnakeGame 的类结构与游戏循环链，说清每个方法在哪一步被调用',
    '能手写 __init__、setup_ui、update_ui、change_direction、move_snake、create_food、game_over 七个方法',
    '能解释方向锁为什么必要、碰撞检测为什么放在 move_snake 里、after(100, run_game) 如何形成循环',
    '能把基础版扩展出两种食物（长度 +1 / +2）、分数与更完整的结束处理'
  ],
  kp: [
    { id: 'ch18-1', title: '项目需求与结束条件' },
    { id: 'ch18-2', title: '游戏循环设计：after 链' },
    { id: 'ch18-3', title: '__init__ 逐行：状态与画布' },
    { id: 'ch18-4', title: 'start_game 与 setup_ui' },
    { id: 'ch18-5', title: 'update_ui：每帧清屏重画' },
    { id: 'ch18-6', title: 'change_direction：方向锁' },
    { id: 'ch18-7', title: 'move_snake：移动、吃食物与碰撞' },
    { id: 'ch18-8', title: 'create_food、game_over 与进阶扩展' }
  ],
  blocks: [

    /* ---------------------------------------------------------------- 开篇 */
    { t: 'callout', kind: 'why', html:
      '这是三个项目里的最后一个，也是唯一用 Python 写的：<b>占总评 20%</b>。' +
      '它不像 Chat Zoom 要处理网络、不像 Gomoku 要判四方向连子，它的难点在<b>把前面学的每一块拼起来</b>——' +
      '类与继承（<code>class SnakeGame(tk.Tk)</code>）、Tkinter 控件与 Canvas、事件绑定、<code>after</code> 循环、随机数、列表操作。<br>' +
      '这一章按"需求 → 循环 → 初始化 → 画 → 控制 → 判定"的顺序拆解代码，目标是让你合上教程也能自己写出来。'
    },

    { t: 'p', lead: true, html:
      '贪吃蛇只有三个动作：<b>蛇往前走、玩家改方向、吃到食物长大</b>。所有复杂度都来自规则细节：' +
      '什么时候算撞墙、什么时候算撞自己、吃到食物的那一帧要不要留尾巴。先把规则想清楚，代码只占一半工作量。'
    },

    /* ---------------------------------------------------------------- 一 */
    { t: 'h', text: '一、需求与验收标准', id: 'ch18-1' },

    { t: 'p', html:
      '课程 Tutorial 8 把需求写得很明确。基本功能四条：玩家控制蛇吃尽可能多的食物，吃得越多蛇越长；' +
      '蛇以固定速度持续前进，玩家用方向键控制方向；食物随机出现在棋盘上，蛇吃到后长度与分数增加，新食物换一个位置出现；' +
      '<b>食物分两种，每次让蛇的长度增加 1 或 2 个单位</b>。'
    },

    { t: 'table',
      head: ['类别', '要求'],
      rows: [
        ['基本功能', '蛇持续前进；方向可控；随机食物；吃到变长；两种食物分别 +1 / +2'],
        ['结束条件 ①', '蛇撞到游戏区域边界（撞墙）'],
        ['结束条件 ②', '蛇头撞到自己的身体（撞自己）'],
        ['结束条件 ③', '蛇达到最大长度 8 单位（通关式结束）'],
        ['进阶功能', '不同食物效果、障碍物、分数显示、多关卡、动态变速、开始菜单']
      ],
      caption: '基础功能决定及格线，进阶功能决定分数上限；先做完整基础版，再挑一两个进阶项' },

    { t: 'p', html:
      '进阶项里最容易加、收益也最高的是<b>分数</b>与<b>两种食物的视觉区分</b>——只要在 Canvas 上多画一个数字、换一种颜色，' +
      '不需要改游戏循环。障碍物与多关卡会改动碰撞判定，动态速度只要改 <code>after</code> 的毫秒数，' +
      '开始菜单则要在 <code>start_game</code> 前面加一个状态。建议顺序：基础版跑通 → 分数 → 两种食物 → 变速 → 菜单 → 障碍。'
    },

    { t: 'flow', nodes: [
      { title: '创建 game = SnakeGame()', desc: '__init__ 初始化状态', kind: 'start' },
      { title: 'start_game()', desc: 'pack 布局 → setup_ui', kind: 'proc' },
      { title: 'setup_ui()', desc: 'update_ui() 先画一帧，再 bind 键盘', kind: 'proc' },
      { title: 'run_game()', desc: '每 100ms 调一次', kind: 'proc' },
      { title: 'move_snake()', desc: '算新头 → 判墙 → 判自己 → 判吃食物', kind: 'proc' },
      { title: '结束了吗？', desc: '撞墙 / 撞自己 / 满长', kind: 'decide' },
      { title: 'update_ui() → after(100, run_game)', desc: '清屏重画，再调度下一帧', kind: 'proc' },
      { title: 'game_over()', desc: 'create_text + unbind + 停止循环', kind: 'end' }
    ] },

    /* ---------------------------------------------------------------- 二 */
    { t: 'h', text: '二、游戏循环设计：一条 after 链', id: 'ch18-2' },

    { t: 'p', html:
      '游戏是"重复做同一件事"，但不能用 <code>while True</code>——第 17 章解释过，那会堵死 Tkinter 的事件循环，窗口直接假死。' +
      '正确做法是用 <code>after</code> 把下一帧"预约"出去：<code>run_game</code> 里调一次 <code>move_snake</code>，' +
      '再用 <code>self.after(100, self.run_game)</code> 约定 100 毫秒后再跑自己。每帧只做一小步，做完立刻把控制权还给 <code>mainloop</code>。' +
      '调用链是：<code>start_game</code> → <code>setup_ui</code> → <code>run_game</code> → <code>move_snake</code> + <code>after</code> → 下一帧。'
    },

    { t: 'code', lang: 'python', run: false, caption: 'run_game.py · 一帧做一件事，再预约下一帧', code:
`def run_game(self):
    if not self.is_running:      # 游戏结束后不再调度，链条自然断开
        return
    self.move_snake()
    self.after(100, self.run_game)
`
    },

    { t: 'callout', kind: 'warn', title: 'after 链不会自己停', html:
      '课程示例里 <code>run_game</code> 只有两行，游戏结束后 <code>after</code> 仍会继续调用——蛇继续动、Game Over 文字上还会叠新画面。' +
      '实战要给类加一个 <code>self.is_running</code> 开关：<code>__init__</code> 里设 <code>True</code>，<code>game_over</code> 里设 <code>False</code>，' +
      '每帧开头检查一次。这是"示例代码"与"能交的项目"之间最常见的一步差距。'
    },

    /* ---------------------------------------------------------------- 三 */
    { t: 'h', text: '三、__init__ 逐行：状态与画布', id: 'ch18-3' },

    { t: 'p', html:
      '<code>SnakeGame</code> 继承 <code>tk.Tk</code>，所以它<b>本身就是一个主窗口</b>。' +
      '第一行 <code>super().__init__()</code> 必须最先调用——它把 Tk 窗口初始化好，后面的 <code>title</code>、<code>geometry</code> 才有对象可用。' +
      '接着把所有游戏状态挂到 <code>self</code> 上：尺寸、格子大小、方向、蛇身坐标、食物、分数、运行开关。' +
      '最后创建 <code>Frame</code> 与 <code>Canvas</code>，并调用 <code>start_game()</code>。'
    },

    { t: 'code', lang: 'python', run: false, caption: 'snake_init.py · __init__ 的完整结构（带注释）', code:
`import tkinter as tk
import random


class SnakeGame(tk.Tk):
    def __init__(self):
        super().__init__()                      # 先初始化 Tk 窗口
        self.title("Snake Game")
        self.geometry("800x800")
        self.resizable(False, False)

        self.width = 800                        # 棋盘宽（像素）
        self.height = 800                       # 棋盘高（像素）
        self.cell_size = 20                     # 每格 20px → 40 × 40 格
        self.snake_direction = "Right"          # 初始方向
        self.snake = [(100, 100), (80, 100), (60, 100)]   # 第 0 个是蛇头
        self.food = self.create_food()
        self.score = 0
        self.max_length = 8                     # 课设要求：最长 8 节
        self.is_running = True                  # 本站加的开关，见上一节

        self.game_frame = tk.Frame(self)
        self.canvas = tk.Canvas(self.game_frame, bg="black",
                                width=self.width, height=self.height)
        self.start_game()                       # 布局 + 挂事件，尚未进入循环
`
    },

    { t: 'callout', kind: 'warn', title: '__init__ 里的四个易错点', html:
      '① 每个属性前都要写 <code>self.</code>，写成 <code>snake = [...]</code> 只是局部变量，下一帧就找不到；' +
      '② <code>super().__init__()</code> 必须在最前面，漏了会报 <code>RuntimeError</code>；' +
      '③ 坐标必须是 <code>cell_size</code> 的整数倍，否则蛇与食物对不齐，永远吃不到；' +
      '④ <code>__init__</code> 里不要调 <code>mainloop()</code>——它是入口，属于文件末尾的启动代码。'
    },

    { t: 'p', html:
      '关于 <code>max_length = 8</code>：讲义写的是 reaches its maximum length (8 units)，最常见理解是 8 节（初始 3 节，吃到第 5 个食物结束）。' +
      '不同实现可能把 unit 理解成"增长单位"，写报告时把假设写明，以课程与助教说明为准。'
    },

    /* ---------------------------------------------------------------- 四 */
    { t: 'h', text: '四、start_game 与 setup_ui', id: 'ch18-4' },

    { t: 'p', html:
      '<code>start_game</code> 只做三件事：把 <code>game_frame</code> 铺满窗口、把 <code>canvas</code> 放进 frame、调用 <code>setup_ui</code>。' +
      '<code>pack(fill="both", expand=True)</code> 让 Frame 在两个方向都撑满，窗口才不会露出灰边。' +
      '<code>setup_ui</code> 则先 <code>update_ui()</code> 画出初始画面，再用 <code>bind("&lt;KeyPress&gt;", self.change_direction)</code> 挂上键盘监听。'
    },

    { t: 'code', lang: 'python', run: false, caption: 'start_setup.py · 布局与"先画一帧、再绑事件"', code:
`def start_game(self):
    self.game_frame.pack(fill="both", expand=True)
    self.canvas.pack()
    self.setup_ui()

def setup_ui(self):
    self.update_ui()                            # 先把初始画面画出来
    self.bind("<KeyPress>", self.change_direction)
`
    },

    { t: 'p', html:
      '顺序很重要：<b>先 update_ui，再 bind</b>。这样窗口一打开就能看到蛇和食物，而不是黑屏等到第一次按键。' +
      '另外 <code>bind</code> 是绑在 <code>self</code>（整个窗口）上的，所以焦点在哪都能收到按键——' +
      'Snake 没有输入框，这一点不会冲突；如果界面里有 <code>Entry</code>，就要小心按键被它抢走。'
    },

    /* ---------------------------------------------------------------- 五 */
    { t: 'h', text: '五、update_ui：每帧清屏重画', id: 'ch18-5' },

    { t: 'p', html:
      'Tkinter 的 Canvas 没有"移动图形"的便捷接口，最稳的做法是<b>每帧全清、按最新坐标重画</b>：' +
      '<code>canvas.delete("all")</code> 清空画布，再遍历 <code>self.snake</code> 画绿方块，最后画食物与分数。' +
      '这样就不需要维护"哪个图形编号对应哪节蛇"，坐标即真相。'
    },

    { t: 'code', lang: 'python', run: false, caption: 'update_ui.py · delete("all") + 按坐标重画', code:
`def update_ui(self):
    self.canvas.delete("all")

    # 食物画在蛇下面，蛇头压上去更好看
    fx, fy = self.food
    self.canvas.create_rectangle(fx, fy, fx + self.cell_size, fy + self.cell_size,
                                 fill="red")

    for x, y in self.snake:
        self.canvas.create_rectangle(x, y, x + self.cell_size,
                                     y + self.cell_size, fill="green")

    self.canvas.create_text(10, 10, anchor="nw",
                            text=f"Score: {self.score}", fill="white")
`
    },

    { t: 'callout', kind: 'tip', title: '重画的开销可以忽略', html:
      '画布 800×800、每格 20px，一共 40×40 = 1600 格，但每帧真正画的只有蛇的几节 + 1 个食物，' +
      '几十个矩形的开销远低于刷新一帧的上限。<b>不要</b>为了"优化"去画 1600 个背景格子，也不要去追踪图形编号——' +
      '<code>delete("all")</code> + 重画是课程项目里性价比最高的写法。'
    },

    /* ---------------------------------------------------------------- 六 */
    { t: 'h', text: '六、change_direction：方向锁', id: 'ch18-6' },

    { t: 'p', html:
      '<code>change_direction</code> 是键盘回调，参数是 Tkinter 传进来的 <code>event</code>。' +
      '它做两件事：过滤掉非方向键，然后<b>禁止 180 度掉头</b>——如果蛇当前向右，按左键必须被忽略。' +
      '实现方式是一张"相反方向"字典：把当前方向映射成它对面那个方向，新方向恰好等于它就不改。'
    },

    { t: 'code', lang: 'python', run: false, caption: 'change_direction.py · 过滤方向键 + 禁止掉头', code:
`def change_direction(self, event):
    opposite_directions = {"Left": "Right", "Right": "Left",
                           "Up": "Down", "Down": "Up"}

    if event.keysym in ["Left", "Right", "Up", "Down"]:
        # 新方向不能是当前方向的反方向，否则蛇会立刻撞上自己的脖子
        if event.keysym != opposite_directions[self.snake_direction]:
            self.snake_direction = event.keysym
`
    },

    { t: 'p', html:
      '为什么必须有这把锁：蛇向右走，按左键后下一帧新头会落在脖子那一格，本来必死；更糟的是有些实现里' +
      '"右手按上、左手按下"这类连按会让蛇在 100ms 内连续转向，导致自撞。方向锁只改 <code>self.snake_direction</code> 这个字符串，' +
      '不动坐标——坐标统一由 <code>move_snake</code> 算，职责分得干净。'
    },

    /* ---------------------------------------------------------------- 七 */
    { t: 'h', text: '七、move_snake：移动、吃食物与碰撞', id: 'ch18-7' },

    { t: 'p', html:
      '<code>move_snake</code> 是整个项目的心脏，一帧里要按固定顺序做五件事：' +
      '① 按当前方向算出<b>新蛇头</b>；② 判撞墙与撞自己；③ 判是否吃到食物；④ 接上新头，吃到就保留尾巴（变长）、没吃到就丢掉尾巴（长度不变）；' +
      '⑤ 判是否达到最大长度，最后调用 <code>update_ui</code>。顺序错一步，判定就会 bug。'
    },

    { t: 'steps', items: [
      { title: '算出新蛇头', html: '取 <code>self.snake[0]</code>，按方向加/减一个 <code>cell_size</code>，得到 <code>new_head</code>。' },
      { title: '判撞墙', html: '<code>new_head[0] &lt; 0</code> 或 <code>&gt;= self.width</code>（y 同理）→ 结束。注意是 <code>&gt;=</code> 不是 <code>&gt;</code>。' },
      { title: '判撞自己', html: '<code>new_head in self.snake[:-1]</code>：尾巴这一格本帧会空出来，可以用。' },
      { title: '接上新头、处理尾巴', html: '吃到食物：<code>[new_head] + self.snake</code>（不截尾，变长）；没吃到：<code>[new_head] + self.snake[:-1]</code>。' },
      { title: '判满长、重画', html: '<code>len(self.snake) &gt;= self.max_length</code> → 结束；否则 <code>self.update_ui()</code>。' }
    ] },

    { t: 'code', lang: 'python', run: false, caption: 'move_snake.py · 完整一帧：算头 → 判负 → 吃 → 长/截尾 → 判满', code:
`def move_snake(self):
    head_x, head_y = self.snake[0]
    if self.snake_direction == "Left":
        head_x -= self.cell_size
    elif self.snake_direction == "Right":
        head_x += self.cell_size
    elif self.snake_direction == "Up":
        head_y -= self.cell_size
    elif self.snake_direction == "Down":
        head_y += self.cell_size
    new_head = (head_x, head_y)

    # 1) 撞墙
    if (new_head[0] < 0 or new_head[0] >= self.width or
            new_head[1] < 0 or new_head[1] >= self.height):
        self.game_over()
        return

    # 2) 撞自己（不含尾巴，因为它马上会让出位置）
    if new_head in self.snake[:-1]:
        self.game_over()
        return

    # 3) 吃食物：保留尾巴 = 变长，并在别处重新生成食物
    if new_head == self.food:
        self.snake = [new_head] + self.snake
        self.score += 1
        self.food = self.create_food()
    else:
        self.snake = [new_head] + self.snake[:-1]

    # 4) 满长结束
    if len(self.snake) >= self.max_length:
        self.game_over()
        return

    self.update_ui()
`
    },

    { t: 'compare', left: {
      title: '吃到食物也截尾',
      html: '长度不变，蛇永远长不大；<code>self.food</code> 也不会换位置，下一帧还在同一个格子上继续"吃"。<br>' +
        '典型症状：分数涨了，蛇还是一样短。'
    }, right: {
      title: '吃到食物不截尾',
      html: '新头进、旧尾巴留，长度从 L 变成 L+1；随后立刻 <code>self.food = self.create_food()</code> 换位置。<br>' +
        '这才是 <code>[new_head] + self.snake</code> 与 <code>[new_head] + self.snake[:-1]</code> 的分工。'
    } },

    { t: 'p', html:
      '三个细节决定这段代码对错：其一，<b>吃食物的时序</b>——先判断 <code>new_head == self.food</code>，再决定截不截尾，' +
      '如果先截尾再判断，蛇吃到食物也长不大；其二，<b>碰撞检测必须放在 move_snake 里</b>，因为只有这里知道新头在哪，' +
      '<code>run_game</code> 只负责调度、<code>update_ui</code> 只负责画；其三，<b>判墙用 <code>&gt;=</code></b>，' +
      'x 的范围是 0 到 width−cell_size，等于 width 已经出界。'
    },

    { t: 'p', html:
      '补一句与讲义的差异：讲义骨架里的撞自己判定写的是 <code>new_head in self.snake[1:]</code>，它把尾巴也算成障碍（更保守）；' +
      '本文用 <code>snake[:-1]</code> 允许"追尾"，两种写法都能通过基本规则，理解"尾巴这一格特殊在哪"比背哪一行重要。'
    },

    /* ---------------------------------------------------------------- 八 */
    { t: 'h', text: '八、create_food、game_over 与进阶扩展', id: 'ch18-8' },

    { t: 'p', html:
      '<code>create_food</code> 要保证新食物<b>不落在蛇身上</b>：用 <code>while True</code> 反复随机抽，抽到合法坐标就 <code>return</code>。' +
      '坐标算法是 <code>random.randint(0, (尺寸 // cell_size) - 1) * cell_size</code>——先在格子编号里抽整数，再乘回像素，' +
      '这样食物一定与蛇对齐。讲义用了 <code>//</code> 整除；两个 <code>randint</code> 上界都要减 1，否则可能抽出 width 本身、越出画布。'
    },

    { t: 'code', lang: 'python', run: false, caption: 'create_gameover.py · 重抽食物 + 居中结束文字 + 解绑键盘', code:
`def create_food(self):
    while True:
        x = random.randint(0, (self.width // self.cell_size) - 1) * self.cell_size
        y = random.randint(0, (self.height // self.cell_size) - 1) * self.cell_size
        food = (x, y)
        if food not in self.snake:
            return food

def game_over(self):
    self.is_running = False
    self.canvas.create_text(self.width // 2, self.height // 2,
                            text="Game Over", fill="white",
                            font=("TkDefaultFont", 24))
    self.unbind("<KeyPress>")          # 结束后不再响应方向键
`
    },

    { t: 'p', html:
      '两种食物怎么扩：给食物加一个"价值"，<b>1 分食物长 1 格、2 分食物长 2 格</b>。' +
      '最稳的做法不是一次塞两节坐标（会让两节重叠、位置错乱），而是加一个<b>待长格数</b>计数器：吃到食物时把价值累加进 <code>pending_growth</code>，' +
      '之后每帧先接新头，只有计数器大于 0 才保留尾巴并减一。这样 2 分食物会分两帧长完，蛇身始终连续。'
    },

    { t: 'code', lang: 'python', run: false, caption: 'two_food.py · 两种食物的三处改动（__init__ / create_food / 吃食物分支）', code:
`# 1) __init__ 里加两个状态
self.food_value = 1        # 当前食物值 1 或 2
self.pending_growth = 0    # 还欠几格没长

# 2) create_food 里随机决定食物类型
def create_food(self):
    self.food_value = random.choice([1, 2])   # 1 分普通，2 分奖励
    while True:
        x = random.randint(0, (self.width // self.cell_size) - 1) * self.cell_size
        y = random.randint(0, (self.height // self.cell_size) - 1) * self.cell_size
        food = (x, y)
        if food not in self.snake:
            return food

# 3) move_snake 的"吃食物"分支改成：
if new_head == self.food:
    self.score += self.food_value
    self.pending_growth += self.food_value
    self.food = self.create_food()

self.snake = [new_head] + self.snake
if self.pending_growth > 0:
    self.pending_growth -= 1        # 本帧不缩尾巴 = 长一格
else:
    self.snake = self.snake[:-1]
`
    },

    { t: 'p', html:
      '剩下几个进阶项各改一处：<b>不同食物效果</b>——在 <code>update_ui</code> 里按 <code>food_value</code> 换颜色（红 / 金）；' +
      '<b>分数</b>——上面已经加了，画在左上角即可；<b>动态速度</b>——把 <code>self.after(100, self.run_game)</code> 的 100 改成变量' +
      '<code>self.speed</code>，每吃 5 个减 10；<b>障碍物</b>——在 <code>__init__</code> 里存一个障碍坐标列表，' +
      '在 move_snake 里判 <code>new_head in self.obstacles</code>；<b>开始菜单</b>——在 <code>start_game</code> 前加一个覆盖全屏的 Frame，' +
      '点"开始"再销毁它。改动都落在已有的方法上，不需要新框架。'
    },

    { t: 'p', html:
      '最后是调试顺序，照着走能省几小时：先让<b>蛇能自己动</b>（run_game + move_snake）；再让<b>食物出现并显示</b>；' +
      '再验证<b>吃到食物会变长、食物会换位置</b>；再验证<b>三种结束条件</b>；最后才做分数与美化。' +
      '如果蛇一动就报 <code>NameError</code>，检查属性有没有漏 <code>self.</code>；如果蛇画出来但不动，检查 <code>after</code> 有没有被调用；' +
      '如果按键没反应，检查 <code>bind</code> 绑的是不是 <code>self</code>、回调有没有 <code>event</code> 参数。'
    },

    /* ---------------------------------------------------------------- 交互 */
    { t: 'p', html:
      '下面的实验台是贪吃蛇的可玩版（Tkinter Canvas 风格在浏览器里重画）：先玩两局体会规则，再对照本章的七个方法看每一帧在做什么。'
    },

    { t: 'lab', id: 'snake' },

    { t: 'quiz', qid: 'ch18-q1' },
    { t: 'quiz', qid: 'ch18-q2' },
    { t: 'quiz', qid: 'ch18-q3' },

    /* ---------------------------------------------------------------- 收尾 */
    { t: 'keypoint', items: [
      { title: '需求三条结束', html: '撞墙、撞自己、达到最大长度 8 单位；食物两种，长度 +1 / +2。' },
      { title: '循环链', html: '<code>start_game → setup_ui → run_game → move_snake + after(100, run_game)</code>，用 after 而不是 while。' },
      { title: '__init__', html: '<code>super().__init__()</code> 最先；width/height/cell_size 定棋盘；<code>self.snake</code> 第 0 个是头，坐标必须是 cell_size 倍数。' },
      { title: 'setup_ui', html: '<code>pack(fill="both", expand=True)</code> 布局；先 <code>update_ui()</code> 再 <code>bind("&lt;KeyPress&gt;")</code>。' },
      { title: 'update_ui', html: '<code>delete("all")</code> 后按坐标重画蛇、食物、分数；不必追踪图形编号。' },
      { title: '方向锁', html: '用 <code>opposite_directions</code> 字典拦掉 180 度掉头；<code>event.keysym</code> 取键名。' },
      { title: 'move_snake', html: '算新头 → 判墙（用 <code>&gt;=</code>）→ 判 <code>new_head in snake[:-1]</code> → 吃到则不截尾 → 判满长。' },
      { title: '食物与结束', html: '<code>create_food</code> 用 while 重抽直到不在蛇身；<code>game_over</code> 画文字、解绑键盘、关掉 is_running。' }
    ] },

    { t: 'checklist', id: 'ch18', items: [
      '我能复述基本功能、三种结束条件，并说出至少四个进阶方向',
      '我能画出 start_game → setup_ui → run_game → move_snake 的循环链',
      '我能解释为什么用 after 而不是 while，以及 after 链为什么需要 is_running 开关',
      '我能默写 __init__ 的主要属性，并说出起始三节坐标与方向',
      '我能说出 width/height/cell_size 三者的关系，以及坐标为什么必须是 cell_size 的倍数',
      '我能解释 update_ui 每帧 delete("all") 重画的做法与好处',
      '我能写出 change_direction 并解释方向锁为什么必要',
      '我能按正确顺序写出 move_snake，并说清吃到与没吃到时尾巴的区别',
      '我知道撞墙判定为什么用 >=、撞自己为什么用 snake[:-1]',
      '我能写出 create_food 的重抽逻辑与 game_over 的三步收尾，并说明两种食物怎么扩'
    ] },

    { t: 'callout', kind: 'exam', title: '这一章在考试里怎么考', html:
      'Snake 是 Python 部分最可能出<b>简答与编程题</b>的章节，因为它是唯一完整的项目代码：<br>' +
      '① <b>填空</b>：补 <code>super().__init__()</code>、<code>self.after(100, self.run_game)</code>、<code>snake[:-1]</code>、' +
      '<code>delete("all")</code>、<code>opposite_directions</code> 这些关键行；<br>' +
      '② <b>判断</b>：常考"游戏循环应该用 while True""吃到食物时应该截尾""撞墙判定用 &gt; 就够了"；<br>' +
      '③ <b>简答</b>：解释方向锁的必要性、碰撞检测为什么放在 move_snake、update_ui 为什么每帧全清重画；<br>' +
      '④ <b>编程</b>：给一段缺方法的类，要求补 <code>create_food</code> 或 <code>move_snake</code>。<br>' +
      '<b>答题动作</b>：写 move_snake 先在草稿上列出五步顺序，再落代码；写坐标先算 <code>random.randint(0, (width // cell_size) - 1) * cell_size</code> 的上下界。'
    },

    { t: 'callout', kind: 'ai', title: 'AI 时代这样学', html:
      '项目允许用 AI，但期末考不许——所以这一章的正确用法是<b>让 AI 当审稿人，而不是代写</b>：' +
      '① 先自己写七个方法，再把代码贴给 AI，问"这段 move_snake 里，吃到食物的时序对不对、有没有漏判"；' +
      '② 让它针对你的代码出 5 个边界用例（撞左上角、吃到食物瞬间撞墙、2 分食物连续吃），你逐个手算并跑一遍；' +
      '③ 让它解释 <code>snake[:-1]</code> 在你的碰撞判定里为什么合理，再让它给出反例检验。<br>' +
      'AI 在项目里最常漏的是：<code>after</code> 链停不下来、食物可能生成在蛇身上、撞墙边界差一格、满长判定漏掉。' +
      '凡是它改的代码，必须自己跑一遍完整对局再接受。'
    }

  ]
});
