/* =====================================================================
 * data/ch17.js · 第 17 章：Python GUI · Tkinter
 * 职责：讲清 Tkinter 的定位与四步骨架、核心控件、pack/grid/place 三种几何
 *       管理、Canvas 绘图方法、bind 事件绑定、after/destroy 调度，并解释
 *       为什么不能用 while + time.sleep() 替代 after()。
 * 对外 API：CSC.registerChapter({...}）（block schema 见 _dev/CONTRACT.md §4–§5）
 * 注意：Python 无法在站内引擎执行，本章所有代码块 run:false。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch17',
  num: '17',
  title: 'Python GUI：Tkinter',
  en: 'Python GUI · Tkinter',
  goals: [
    '能说出 Tkinter 的三个特点，并写出 root → 控件 → 布局 → mainloop 的四步骨架',
    '能用 Label/Button/Entry/Text/Frame/Canvas 搭出一个可交互的小界面',
    '能分清 pack/grid/place 的适用场景，并用 row/column/side 摆出想要的位置',
    '能用 Canvas 的绘图方法画出矩形、线与文字，并用 coords/itemconfig/delete 修改',
    '能用 bind 处理键盘与鼠标事件，用 after 做定时任务、用 destroy 关闭窗口'
  ],
  kp: [
    { id: 'ch17-1', title: 'Tkinter 定位与第一个窗口' },
    { id: 'ch17-2', title: '四步骨架与 mainloop' },
    { id: 'ch17-3', title: '核心控件：Label/Button/Entry/Text/Frame' },
    { id: 'ch17-4', title: '三种几何管理：pack/grid/place' },
    { id: 'ch17-5', title: 'Canvas 绘图方法' },
    { id: 'ch17-6', title: '事件绑定 bind 与 event 对象' },
    { id: 'ch17-7', title: 'after 与 destroy' },
    { id: 'ch17-8', title: '为什么不能用 while + sleep' }
  ],
  blocks: [

    /* ---------------------------------------------------------------- 开篇 */
    { t: 'callout', kind: 'why', html:
      '第 18 章贪吃蛇的每一帧画面——黑色画布、绿色的蛇、红色的食物、"Game Over" 文字——都是 Tkinter 画出来的。' +
      '它的 <code>setup_ui</code>、<code>update_ui</code>、<code>bind</code>、<code>after</code> 全部是本章内容。' +
      '更现实的是：Python 项目占总评 20%，评分第一条就是"界面能不能正常显示和操作"，Tkinter 是绕不过去的。<br>' +
      '好消息是它<b>内置在标准库里</b>，不用装任何第三方包，几行代码就能出窗口。'
    },

    { t: 'p', lead: true, html:
      '命令行程序的节奏是"输入 → 计算 → 输出 → 结束"；GUI 程序的节奏是<b>事件驱动（event-driven）</b>：窗口一直开着，' +
      '用户点哪里、按哪个键，就触发哪段代码。理解这个节奏转换，是学 Tkinter 的第一道关。'
    },

    /* ---------------------------------------------------------------- 一 */
    { t: 'h', text: '一、Tkinter 定位与第一个窗口', id: 'ch17-1' },

    { t: 'p', html:
      '<b>Tkinter</b> 是 Python 内置的图形用户界面（GUI，graphical user interface）模块，课程讲义列了三个特点：' +
      '简单易用（simple and easy to work with）、无需安装（no installation）、面向对象接口（object-oriented interface）。' +
      '最小程序只有四行：<code>from tkinter import *</code> 导入、<code>root = Tk()</code> 创建主窗口、设置标题与尺寸、最后 <code>root.mainloop()</code> 进入事件循环。'
    },

    { t: 'code', lang: 'python', run: false, caption: 'window.py · 最小的 Tkinter 窗口', code:
`import tkinter as tk

window = tk.Tk()
window.title("my window")
window.geometry("500x500")
window.mainloop()
`
    },

    { t: 'p', html:
      '<code>geometry("500x500")</code> 里的 x 是小写字母 x，格式是<b>宽 x 高</b>，单位像素；写成 <code>"500,500"</code> 或 <code>"500*500"</code> 都不认。' +
      '<code>resizable(False, False)</code> 可以禁止拖动改变窗口大小，Snake 项目就用了它，防止画布尺寸与 <code>self.width</code> 对不上。'
    },

    /* ---------------------------------------------------------------- 二 */
    { t: 'h', text: '二、四步骨架与 mainloop', id: 'ch17-2' },

    { t: 'p', html:
      '课程讲义把 Tkinter 程序拆成四步：① 创建 root window；② 在 root 里创建 frame 并调用几何方法（如 <code>pack()</code>）；' +
      '③ 在 frame 里创建 button 等控件；④ 调用事件循环 <code>mainloop()</code>。下面就是讲义里的示例项目。'
    },

    { t: 'steps', items: [
      { title: '创建根窗口', html: '<code>root = Tk()</code>（或 <code>tk.Tk()</code>）：整个界面的最外层容器。' },
      { title: '创建 Frame 并布局', html: '<code>frame = Frame(root)</code> 之后必须 <code>frame.pack()</code>，否则它不会显示。' },
      { title: '在容器里放控件', html: '<code>button = Button(frame, text="Geek")</code>，再 <code>button.pack()</code>。' },
      { title: '进入事件循环', html: '<code>root.mainloop()</code>：窗口保持显示，等待并分发事件，直到窗口被关闭。' }
    ] },

    { t: 'code', lang: 'python', run: false, caption: 'skeleton.py · 讲义四步：root → frame → button → mainloop', code:
`from tkinter import *

root = Tk()
frame = Frame(root)
frame.pack()

button = Button(frame, text="Geek")
button.pack()

root.mainloop()
`
    },

    { t: 'p', html:
      '<code>mainloop()</code> 是一个<b>事件循环（event loop）</b>：它不断从系统取事件（鼠标、键盘、重绘请求），分发给对应控件，再回到等待。' +
      '它不返回，直到窗口关闭；所以 <code>mainloop()</code> 之后写的代码要等关窗才执行，启动逻辑必须放在它之前，或写成事件回调。' +
      'Snake 的 <code>__init__</code> 里先调 <code>self.start_game()</code>、再由外部 <code>game.mainloop()</code> 接管，正是这个道理。'
    },

    /* ---------------------------------------------------------------- 三 */
    { t: 'h', text: '三、核心控件：Label/Button/Entry/Text/Frame', id: 'ch17-3' },

    { t: 'p', html:
      '<b>控件（widget）</b>是界面上的元件：显示文字的 Label、可点击的 Button、单行输入的 Entry、多行文本的 Text、' +
      '用来分组的 Frame、用来绘图的 Canvas。每个控件创建时第一个参数是父容器，后面是属性；创建完必须调用布局方法才会出现。'
    },

    { t: 'table',
      head: ['控件', '用途', '常用属性 / 方法'],
      rows: [
        ['<code>Label</code>', '显示一行文字或图片', '<code>text</code>、<code>textvariable</code>、<code>bg</code>、<code>font</code>'],
        ['<code>Button</code>', '按钮，点击触发回调', '<code>text</code>、<code>command</code>、<code>width</code>、<code>height</code>'],
        ['<code>Entry</code>', '单行输入框', '<code>get()</code> 取值；<code>show="*"</code> 变密码框'],
        ['<code>Text</code>', '多行文本编辑区', '<code>insert(index, s)</code>、<code>get(...)</code>'],
        ['<code>Frame</code>', '容器，用来分组与布局', '<code>relief</code>、<code>bd</code>、<code>padx</code>、<code>pady</code>'],
        ['<code>Canvas</code>', '画布，可画图形与文字', '<code>width</code>、<code>height</code>、<code>bg</code>、绘图方法'],
        ['<code>messagebox</code>', '弹出提示/询问对话框', '<code>showinfo</code>、<code>showerror</code>、<code>askyesno</code>']
      ],
      caption: '前六种是课程 Tutorial 8 的重点；messagebox 是最常用的补充控件' },

    { t: 'p', html:
      '弹出提示用 <b>messagebox</b>：<code>from tkinter import messagebox</code> 之后，<code>messagebox.showinfo("提示", "保存成功")</code> 弹信息框，' +
      '<code>showerror</code> 弹错误框，<code>askyesno</code> 弹确认框并返回 <code>True</code> / <code>False</code>。' +
      '它是独立子模块，不能只靠 <code>import tkinter as tk</code> 就用到。'
    },
    { t: 'code', lang: 'python', run: false, caption: 'widgets.py · Label + StringVar + Button 回调 + Entry/Text 取值', code:
`import tkinter as tk

window = tk.Tk()
window.title("Mywindow")
window.geometry("200x200")

on_hit = False
var = tk.StringVar()
var.set("welcome")

def hit_me():
    global on_hit
    if on_hit == False:
        on_hit = True
        var.set("You hit me!")
    else:
        on_hit = False
        var.set("")

label = tk.Label(window, textvariable=var)
label.pack()
button = tk.Button(window, text="hello", width=15, height=2, command=hit_me)
button.pack()

entry = tk.Entry(window)
entry.pack()

def insert_point():
    var2 = entry.get()
    text.insert("insert", var2)

tk.Button(window, text="insert point", command=insert_point).pack()
text = tk.Text(window, height=2)
text.pack()

window.mainloop()
`
    },

    { t: 'callout', kind: 'warn', title: '回调函数的两个坑', html:
      '① <code>command=hit_me</code> 后面<b>不能加括号</b>：写成 <code>command=hit_me()</code> 会在创建按钮时立刻执行一次，' +
      '之后点击反而什么都不发生；② 通过 <code>bind</code> 绑定的回调必须接收一个 <code>event</code> 参数（写法是 <code>def f(event):</code>），' +
      '而 <code>command</code> 的回调不带参数——这两种绑法混了就会报 <code>TypeError</code>。'
    },

    /* ---------------------------------------------------------------- 四 */
    { t: 'h', text: '四、三种几何管理：pack/grid/place', id: 'ch17-4' },

    { t: 'p', html:
      '创建控件不等于把它显示出来，必须调用<b>几何管理（geometry management）</b>方法。三种方式各有分工：' +
      '<code>pack()</code> 按行或列依次堆放，最简单；<code>grid()</code> 把父容器看成二维表格，用行号列号定位，最适合表单；' +
      '<code>place()</code> 允许显式指定坐标与尺寸，可以写绝对像素，也可以写相对比例。'
    },

    { t: 'table',
      head: ['方法', '关键参数', '适用场景'],
      rows: [
        ['<code>pack()</code>', '<code>side</code>（TOP/BOTTOM/LEFT/RIGHT）、<code>fill</code>（X/Y/BOTH）、<code>expand</code>、<code>padx/pady</code>', '简单堆叠：按钮排一排、Frame 铺满窗口'],
        ['<code>grid()</code>', '<code>row</code>/<code>column</code>、<code>sticky</code>（n/s/e/w）、<code>rowspan/columnspan</code>、<code>padx/pady</code>', '表单对齐：Label 与 Entry 成行成列'],
        ['<code>place()</code>', '<code>x</code>/<code>y</code>（绝对像素）、<code>relx</code>/<code>rely</code>（0~1 相对）、<code>width/height</code>', '精确定位：浮层、角落小按钮']
      ],
      caption: '三者选一个：简单用 pack，对齐用 grid，要坐标用 place' },

    { t: 'compare', left: {
      title: '用 pack 硬排表单',
      html: '要靠一层层 <code>Frame</code> 嵌套模拟出两列，改一列就要重排全部；行与行的对齐也很难保证。' +
        '<code>pack</code> 擅长"按顺序堆"，不擅长"对齐坐标"。'
    }, right: {
      title: '用 grid 摆表格',
      html: 'Label 与 Entry 各占一格：<code>row</code> / <code>column</code> 直接对应位置，' +
        '<code>sticky</code> 控制贴边，<code>padx</code> / <code>pady</code> 控制间距。表单类界面首选。'
    } },

    { t: 'code', lang: 'python', run: false, caption: 'layout.py · grid 表单，以及 place 的绝对定位', code:
`import tkinter as tk

root = tk.Tk()
root.title("Login")

tk.Label(root, text="User").grid(row=0, column=0, padx=5, pady=5)
tk.Entry(root).grid(row=0, column=1, padx=5, pady=5)

tk.Label(root, text="Password").grid(row=1, column=0, padx=5, pady=5)
tk.Entry(root, show="*").grid(row=1, column=1, padx=5, pady=5)

tk.Button(root, text="Login").grid(row=2, column=0, columnspan=2, pady=5)

# place：直接给坐标，适合做浮在角落的小按钮
tk.Button(root, text="?").place(x=10, y=10, width=30, height=30)

root.mainloop()
`
    },

    { t: 'callout', kind: 'warn', title: 'pack 与 grid 不能混用', html:
      '同一个父容器里，<b>pack 与 grid 不能同时使用</b>：Tkinter 会一直等待窗口 resize 才能算清布局，界面直接卡住不动。' +
      '正确做法是用 <code>Frame</code> 分区——顶部 Frame 用 pack、表单 Frame 用 grid，不同父容器各用各的，互不干扰。' +
      'Snake 只在 <code>__init__</code> 里用了 <code>pack</code>，所以没踩到这个坑。'
    },

    /* ---------------------------------------------------------------- 五 */
    { t: 'h', text: '五、Canvas 绘图方法', id: 'ch17-5' },

    { t: 'p', html:
      '<b>Canvas</b> 是画布控件，构造时给 <code>root</code>、<code>height</code>、<code>width</code>、<code>bg</code>、<code>bd</code> 等参数。' +
      '每个绘图方法都返回一个<b>图形编号（item id）</b>，之后用这个编号就能移动、改色或删除图形。' +
      '坐标原点是画布<b>左上角</b>，x 向右增大、y 向下增大。'
    },

    { t: 'table',
      head: ['方法', '作用', '参数要点'],
      rows: [
        ['<code>create_line(x1, y1, x2, y2)</code>', '画线段', '<code>fill</code> 颜色、<code>dash</code> 虚线'],
        ['<code>create_rectangle(x1, y1, x2, y2)</code>', '画矩形', '两个对角点：左上与右下'],
        ['<code>create_oval(x1, y1, x2, y2)</code>', '画椭圆/圆', '外接矩形的对角点'],
        ['<code>create_arc(x1, y1, x2, y2, start=, extent=)</code>', '画扇形/圆弧', '<code>start</code> 起始角、<code>extent</code> 张角'],
        ['<code>create_text(x, y, text=)</code>', '写文字', '<code>fill</code>、<code>font</code>'],
        ['<code>create_polygon(...)</code>', '画多边形', '依次给出各顶点坐标'],
        ['<code>delete(item)</code>', '删图形', '<code>delete("all")</code> 清空画布'],
        ['<code>itemconfig(item, fill=)</code>', '改属性', '按编号改颜色等'],
        ['<code>coords(item, ...)</code>', '移位置/改形状', '按编号重设坐标']
      ],
      caption: '前六个负责画，后三个负责改与删；Snake 每帧都靠 delete("all") 清屏重画' },

    { t: 'code', lang: 'python', run: false, caption: 'canvas.py · 画线、画矩形、改色、移动、删除、写文字', code:
`import tkinter as tk

root = tk.Tk()
w = tk.Canvas(root, width=200, height=100)
w.pack()

line1 = w.create_line(0, 50, 200, 50, fill="yellow")
line2 = w.create_line(100, 0, 100, 100, fill="red", dash=(4, 4))
rect1 = w.create_rectangle(50, 25, 150, 75, fill="blue")

w.coords(line1, 0, 25, 200, 25)      # 把线挪到 y=25
w.itemconfig(rect1, fill="red")      # 把矩形改成红色
w.delete(line2)                      # 删掉一条线
w.create_text(100, 50, text="Python")

root.mainloop()
`
    },

    { t: 'p', html:
      '讲义里还给了把一组坐标画成蛇的写法：<code>for x, y in snake:</code> 之后用 <code>create_rectangle(x, y, x + cell_size, y + cell_size, fill="green")</code>。' +
      '注意矩形参数是左上角与右下角两个点，所以右下角要写成 <code>x + cell_size</code>、<code>y + cell_size</code>——' +
      '第 18 章的 <code>update_ui</code> 就是这几行。'
    },

    /* ---------------------------------------------------------------- 六 */
    { t: 'h', text: '六、事件绑定 bind 与 event 对象', id: 'ch17-6' },

    { t: 'p', html:
      '<b>事件绑定（event binding）</b>用 <code>控件.bind(事件字符串, 回调函数)</code> 把用户操作和函数连起来。' +
      '回调函数接收一个 <code>event</code> 对象，里面有这次事件的细节：键盘事件用 <code>event.keysym</code> 拿到键名（如 <code>"Left"</code>、<code>"Up"</code>），' +
      '鼠标事件用 <code>event.x</code>、<code>event.y</code> 拿到点击位置。绑定可以加在某个控件上，也可以加在 <code>root</code> 上监听整个窗口。'
    },

    { t: 'table',
      head: ['事件字符串', '触发时机', '常用字段'],
      rows: [
        ['<code>&lt;KeyPress&gt;</code> 或 <code>&lt;Key&gt;</code>', '按下任意键', '<code>event.keysym</code>、<code>event.char</code>'],
        ['<code>&lt;Button-1&gt;</code>', '鼠标左键单击', '<code>event.x</code>、<code>event.y</code>'],
        ['<code>&lt;Double-1&gt;</code>', '鼠标左键双击', '<code>event.x</code>、<code>event.y</code>'],
        ['<code>&lt;B1-Motion&gt;</code>', '按住左键拖动', '<code>event.x</code>、<code>event.y</code>'],
        ['<code>&lt;Enter&gt;</code>', '鼠标进入控件', '<code>event.x</code>、<code>event.y</code>']
      ],
      caption: '课程讲义特别区分了 <code>&lt;Double 1&gt;</code> / <code>&lt;Double-Button-1&gt;</code>（只左键）与 <code>&lt;Double-Button&gt;</code>（左右键都算）' },

    { t: 'code', lang: 'python', run: false, caption: 'events.py · 键盘方向键与鼠标拖动画点', code:
`import tkinter as tk

root = tk.Tk()
root.geometry("400x200")

def key_press(event):
    if event.keysym in ["Left", "Right", "Up", "Down"]:
        direction = event.keysym
        print(direction, "is pressed")

root.bind("<KeyPress>", key_press)      # 监听整个窗口的按键

w = tk.Canvas(root, width=400, height=160)
w.pack()

def paint(event):
    x1, y1 = (event.x - 1), (event.y - 1)
    x2, y2 = (event.x + 1), (event.y + 1)
    w.create_oval(x1, y1, x2, y2, fill="red")

w.bind("<B1-Motion>", paint)            # 按住左键拖动时画小红点

root.mainloop()
`
    },

    { t: 'callout', kind: 'warn', title: 'bind 与 command 别混', html:
      '<code>Button(command=fn)</code> 的回调<b>不带参数</b>，点一下就执行；<code>bind("&lt;Button-1&gt;", fn)</code> 的回调<b>必须带一个 event 参数</b>，' +
      '因为 Tkinter 要把点击坐标等信息传进来。给 <code>command</code> 传带 <code>event</code> 的函数，点击时会因为"少参数"报错；' +
      '反过来给 <code>bind</code> 传无参函数，触发时会报"多了参数"。'
    },

    /* ---------------------------------------------------------------- 七 */
    { t: 'h', text: '七、after 与 destroy', id: 'ch17-7' },

    { t: 'p', html:
      '<code>after(parent, ms, function)</code> 是 Tkinter 的定时器：在 <code>ms</code> 毫秒之后执行一次指定函数，' +
      '它既可以直接挂在 <code>root</code> 上，也可以挂在任意控件上。<code>destroy()</code> 是通用方法，用来销毁控件；' +
      '对 <code>root</code> 调用就关闭整个窗口。下面这段 5 秒后自动关窗，是讲义里的示例。'
    },

    { t: 'code', lang: 'python', run: false, caption: 'after_destroy.py · 5 秒后自动关闭窗口', code:
`from tkinter import Tk, mainloop, TOP
from tkinter.ttk import Button
from time import time

root = Tk()
button = Button(root, text="Geeks")
button.pack(side=TOP, pady=5)
print("Running...")

start = time()
root.after(5000, root.destroy)     # 5000 毫秒后执行 root.destroy
mainloop()
end = time()
print("Destroyed after %d seconds" % (end - start))
`
    },

    { t: 'p', html:
      '注意 <code>mainloop()</code> 是<b>阻塞</b>的：程序停在这行等事件，直到 <code>root.destroy()</code> 把窗口销毁，它才返回，' +
      '后面的 <code>end = time()</code> 与打印才会执行。这也解释了为什么窗口程序"看起来一直在运行"——它真的卡在事件循环里。'
    },

    /* ---------------------------------------------------------------- 八 */
    { t: 'h', text: '八、为什么不能用 while + sleep 替代 after', id: 'ch17-8' },

    { t: 'p', html:
      '贪吃蛇需要"每隔一段时间动一格"。直觉写法是 <code>while True:</code> 里移动一次、<code>time.sleep(0.1)</code> 一下——' +
      '这会让窗口<b>完全冻结</b>。原因写在讲义里：Tkinter 的 GUI 运行在<b>单线程</b>里，<code>mainloop()</code> 负责处理用户交互、绘制界面、分发事件；' +
      '你用一个 while 循环占住这个线程，事件循环就永远轮不到执行，界面不刷新、按键也没反应。'
    },

    { t: 'compare', left: {
      title: 'while + time.sleep()：堵住事件循环',
      html: '<code>while True:</code> 一直占着主线程 → <code>mainloop()</code> 无法取事件 → 窗口假死；' +
        '<code>sleep</code> 期间同样不处理任何事件。<br>' +
        '<b>结果</b>：画面不动、按键丢失、关窗卡住。'
    }, right: {
      title: 'after()：把控制权还给事件循环',
      html: '调度"100ms 后执行一次"，随即返回主循环；这 100ms 里 Tkinter 照常处理按键与重绘，' +
        '时间到了再调用你的函数，函数里再 <code>after</code> 一次，形成循环。<br>' +
        '<b>结果</b>：界面流畅、响应正常。'
    } },

    { t: 'code', lang: 'python', run: false, caption: 'after_loop.py · 用 after 自调度形成动画循环（讲义示例）', code:
`def update_ui():
    snake = [(snake[0][0] + cell_size, snake[0][1])] + snake[:-1]
    canvas.delete("all")
    for x, y in snake:
        canvas.create_rectangle(x, y, x + cell_size, y + cell_size, fill="green")
    root.after(500, update_ui)      # 500ms 后调用自己，形成循环

root.after(500, update_ui)          # 启动第一次
root.mainloop()
`
    },

    { t: 'p', html:
      '这个"函数末尾再调度自己一次"的模式，就是第 18 章 <code>run_game</code> 的骨架：' +
      '<code>move_snake()</code> 之后 <code>self.after(100, self.run_game)</code>。' +
      '注意 <code>after</code> 只负责"到点调用"，它不会替你保存状态——蛇的坐标必须存在 <code>self.snake</code> 里，' +
      '每帧靠 <code>delete("all")</code> 清屏、再按最新坐标重画。'
    },

    /* ---------------------------------------------------------------- 交互 */
    { t: 'p', html:
      '下面的实验台把三种几何管理并排放：改一下 <code>side</code>、<code>row</code>、<code>x/y</code> 参数，看控件位置怎么变。' +
      '先猜再改，比直接记参数有效。'
    },

    { t: 'lab', id: 'tkinter' },

    { t: 'quiz', qid: 'ch17-q1' },
    { t: 'quiz', qid: 'ch17-q2' },
    { t: 'quiz', qid: 'ch17-q3' },

    /* ---------------------------------------------------------------- 收尾 */
    { t: 'keypoint', items: [
      { title: 'Tkinter 定位', html: 'Python 内置 GUI 模块：简单、无需安装、面向对象；<code>from tkinter import *</code> 或 <code>import tkinter as tk</code>。' },
      { title: '四步骨架', html: '<code>Tk()</code> 建根窗口 → <code>Frame</code> 与布局 → 放控件 → <code>mainloop()</code> 进入事件循环。' },
      { title: '控件', html: 'Label 显示、Button 触发命令、Entry 单行输入、Text 多行、Frame 分组、Canvas 绘图；创建后必须布局才显示。' },
      { title: '几何管理', html: '<code>pack</code> 按行列堆、<code>grid</code> 按表格摆、<code>place</code> 按坐标放；同一父容器不要混用 pack 与 grid。' },
      { title: 'Canvas', html: '<code>create_line/rectangle/oval/arc/text/polygon</code> 画，<code>coords/itemconfig/delete</code> 改与删；原点在左上角。' },
      { title: '事件', html: '<code>bind("&lt;KeyPress&gt;", fn)</code> 的回调必须带 event；<code>event.keysym/x/y</code>；command 回调不带参数。' },
      { title: 'after 与 destroy', html: '<code>after(ms, fn)</code> 定时调度、<code>destroy()</code> 关窗；用 after 自调度代替 while + sleep，避免卡死事件循环。' }
    ] },

    { t: 'checklist', id: 'ch17', items: [
      '我能写出最小 Tkinter 窗口，并说出 geometry 里宽高的写法',
      '我能背出 root → Frame → 控件 → mainloop 四步骨架，并解释 mainloop 在做什么',
      '我能用 Label/Button/Entry/Text 做一个"点击按钮改文字"的小界面',
      '我能说出 pack、grid、place 各自的适用场景与关键参数',
      '我知道为什么不能在同一个父容器里混用 pack 与 grid，以及怎么用 Frame 绕开',
      '我能用 Canvas 画出线、矩形、椭圆、文字，并用 coords/itemconfig/delete 修改',
      '我能写出 bind 的键盘与鼠标回调，并区分 command 与 bind 的参数差异',
      '我能用 after 做定时任务、用 destroy 关闭窗口，并解释 mainloop 为什么阻塞',
      '我能解释为什么 while + time.sleep() 会让窗口冻结，after 为什么不会'
    ] },

    { t: 'callout', kind: 'exam', title: '这一章在考试里怎么考', html:
      'Tkinter 在期末考里通常以<b>简答与代码填空</b>出现，因为它是 Python 项目的核心：<br>' +
      '① <b>填空</b>：补 <code>mainloop()</code>、<code>pack()</code>、<code>create_rectangle</code>、<code>after</code>、<code>bind</code> 等关键字；<br>' +
      '② <b>判断</b>：常考"控件创建后会自动显示""pack 和 grid 可以混用""<code>after</code> 会阻塞事件循环"这类说法；<br>' +
      '③ <b>简答</b>：为什么不能用 <code>while</code> + <code>time.sleep()</code> 替代 <code>after()</code>——标准答案是阻塞单线程的事件循环，界面无响应；<br>' +
      '④ <b>编程</b>：给一个 Canvas 与坐标要求，写出重画蛇身的循环。<br>' +
      '<b>答题动作</b>：凡是问"界面为什么不动"，先想主线程有没有被占用；凡是问"控件为什么不显示"，先想有没有调用布局方法。'
    },

    { t: 'callout', kind: 'ai', title: 'AI 时代这样学', html:
      'Tkinter 的 API 又多又碎，AI 特别适合当<b>查表助手</b>：① 让它列出"画一个红色矩形并 1 秒后变蓝"的最小代码，你跑通后再让它解释每个参数；' +
      '② 把 Snake 的 <code>update_ui</code> 贴给它，问"如果想让蛇头变色，改哪一行"；③ 让它出 10 道"这段代码哪里会报错"的题，重点看 command/bind 的回调参数。<br>' +
      'AI 常犯的错：混用 <code>pack</code> 与 <code>grid</code>、给 <code>command</code> 加括号、<code>geometry</code> 写成 <code>"500,500"</code>。' +
      '凡是它给的界面代码，必须真跑一次、看到窗口再算学会。'
    }

  ]
});
