/* =====================================================================
 * data/ch05.js · 第 05 章：图像与二维循环
 * 职责：把图像看成"像素组成的二维网格"，用双层循环遍历、读取、修改像素，
 *       再用灰度化 / 反色 / 二值化 / 镜像 / 缩放 / 区域统计把概念跑通。
 * 内容块 schema 见项目说明；示例均按 Python 3 语法书写。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch05',
  num: '05',
  title: '图像与二维循环',
  en: 'Images & Nested Loops',
  goals: [
    '能说清像素、坐标 (x, y) 与二维列表下标 <code>img[y][x]</code> 的对应关系',
    '能用嵌套 for 循环遍历任意尺寸的图像，并写出"按行输出"的代码',
    '能读写单个像素，并解释 RGB 三个通道各自控制什么',
    '能独立写出灰度化、反色、二值化、镜像、缩放这类逐像素算法',
    '能把图像变成数字：平均颜色、区域统计、亮度分布'
  ],
  kp: [
    { id: 'ch05-1', title: '像素、坐标与二维网格' },
    { id: 'ch05-2', title: '双层循环：一行一行地遍历' },
    { id: 'ch05-3', title: '颜色：RGB 三个通道' },
    { id: 'ch05-4', title: '读像素、写像素、封装成函数' },
    { id: 'ch05-5', title: '逐像素滤镜：灰度、反色、二值化' },
    { id: 'ch05-6', title: '镜像、缩放与区域统计' }
  ],
  blocks: [

    { t: 'callout', kind: 'why', html:
      '只学过一个 for 循环，你会觉得"循环"就是从头到尾走一遍列表。' +
      '但真实世界的数据常常是<b>二维</b>的：一张图、一个棋盘、一张成绩表、一块屏幕。' +
      '处理二维数据的标准手法是<b>嵌套循环</b>——外层走行，内层走列。' +
      '这一章用"图像"当载体，把这个手法练到不用想就能写出来。' +
      '更要紧的是：图像里绝大多数算法长得完全一样（遍历所有像素 → 算出新颜色 → 写回去），' +
      '掌握这个模板，你就能自己造滤镜，而不是背滤镜。'
    },

    { t: 'p', lead: true, html:
      '一张图像在程序里从来不是"一张图"，而是一个巨大的数字表格：' +
      '<b>宽 × 高 个格子，每个格子里放一个颜色</b>。把这张表想成二维数组，' +
      '图像处理就退化成了最基础的操作：遍历、读取、计算、写回。' +
      '这一章不依赖任何图形界面，像素就是普通的数据。'
    },

    { t: 'h', text: '一、像素、坐标与二维网格', id: 'ch05-1' },

    { t: 'p', html:
      '图像的最小单位叫<b>像素</b>（pixel）。一个像素没有面积，只有一个颜色。' +
      '一张 1920×1080 的屏幕，就是 1920 列 × 1080 行 个像素排成的矩形。' +
      '要定位其中一个，需要两个数：<code>x</code> 表示第几列（向右增大），' +
      '<code>y</code> 表示第几行（<b>向下</b>增大）。'
    },

    { t: 'p', html:
      '注意 <code>y</code> 的方向和数学课本上的坐标系<b>正好相反</b>：屏幕的左上角是 (0, 0)，' +
      '越往下 <code>y</code> 越大。这不是故意刁难，因为图像在内存里是一行接一行存的，' +
      '第一行就是 <code>y = 0</code>。'
    },

    { t: 'code', lang: 'python', caption: '一张 4 列 3 行的小图像：每个元素是一个颜色', code:
`# 外层列表有 3 个元素，每个元素是一行；每行有 4 个像素
img = [
    [(10, 20, 30),    (40, 200, 90),   (250, 250, 250), (200, 30, 40)],
    [(20, 20, 20),    (90, 160, 220),  (150, 150, 150), (5, 5, 5)],
    [(240, 240, 100), (30, 90, 30),    (100, 100, 100), (255, 255, 255)],
]

print(len(img))        # 3  → 行数，也就是高度 height
print(len(img[0]))     # 4  → 每行几个像素，也就是宽度 width
print(img[0][0])       # (10, 20, 30)   左上角
print(img[2][3])       # (255, 255, 255) 右下角
` },

    { t: 'p', html:
      '这里有一个必须一开始就刻进肌肉记忆的约定：<b>外层下标是行，内层下标是列</b>，' +
      '所以坐标 (x, y) 要写成 <code>img[y][x]</code>，<b>x 在后、y 在前</b>。' +
      '初学者最容易写成 <code>img[x][y]</code>——如果图像是正方形（宽 = 高），' +
      '这样写<b>不会报错</b>，只会静默地取到完全不相干的像素，' +
      '于是滤镜的效果看上去"怪怪的"，却查不出原因。'
    },

    { t: 'callout', kind: 'warn', title: '方图陷阱', html:
      '一张 100×100 的图像，<code>img[x][y]</code> 和 <code>img[y][x]</code> 都不会越界，' +
      '所以错误可以被隐藏很久。而一旦图像变成 100×50，同样的代码就会随机抛 ' +
      '<code>IndexError</code>。防御办法只有一个：<b>永远写成 img[y][x]</b>，' +
      '并在拿到图像时先打印 <code>len(img)</code> 与 <code>len(img[0])</code> 确认哪个是宽。'
    },

    { t: 'table', head: ['概念', '常用记号', '在代码里', '含义'], rows: [
      ['宽度', '<code>w</code> / width', '<code>len(img[0])</code>', '一行有几个像素，也就是 x 的取值范围是 0 ~ w-1'],
      ['高度', '<code>h</code> / height', '<code>len(img)</code>', '一共有几行，y 的取值范围是 0 ~ h-1'],
      ['坐标', '<code>(x, y)</code>', '<code>img[y][x]</code>', 'x 是列（左右），y 是行（上下）'],
      ['合法本范围', '—', '<code>0 &lt;= x &lt; w</code>, <code>0 &lt;= y &lt; h</code>', '越界立刻 IndexError，不会自动裁剪']
    ], caption: '尺寸与坐标的对应关系。先确认 w / h，再写循环。' },

    { t: 'h', text: '二、双层循环：一行一行地遍历', id: 'ch05-2' },

    { t: 'p', html:
      '遍历整张图像的标准骨架是两层 <code>for</code>：外层走 <code>y</code>，' +
      '内层走 <code>x</code>。写熟了以后你会形成条件反射，看到"处理所有像素"就自动写出这四行。'
    },

    { t: 'code', lang: 'python', caption: '遍历所有像素：外层 y，内层 x', code:
`for y in range(len(img)):
    for x in range(len(img[0])):
        r, g, b = img[y][x]
        print(f'({x}, {y}) -> ({r}, {g}, {b})')
` },

    { t: 'p', html:
      '为什么外层必须是 <code>y</code>？两个原因。第一，<b>读起来和图像一致</b>：' +
      '程序按行扫描，一行处理完再下一行，心里想的顺序和代码顺序对得上。' +
      '第二，很多算法需要<b>按行组织输出</b>，比如逐行打印、逐行保存文件，' +
      '此时外层是行、内层是列，天然就能攒出一整行。反过来（外层 x、内层 y）在数学上也能遍历全部像素，' +
      '但顺序变成"一列一列竖着走"，凡是"按行"的操作都要额外处理。'
    },

    { t: 'h', lvl: 3, text: '字符画：没有屏幕时怎么看图', id: 'ch05-2-1' },

    { t: 'p', html:
      '下面这段代码把图像"打印"出来。<b>在没有图形界面的环境里，这是观察图像最有效的手段</b>：' +
      '把亮度映射成不同字符，暗的地方是空格，亮的地方是 <code>@</code>，' +
      '一眼就能看出形状对不对。'
    },

    { t: 'code', lang: 'python', caption: 'to_ascii：把图像按亮度画成字符画', code:
`CHARS = ' .:-=+*#%@'    # 从最暗到最亮，共 10 个字符

def to_ascii(img):
    """按行打印图像：每个像素换成一个代表亮度的字符。"""
    for y in range(len(img)):
        line = ''
        for x in range(len(img[0])):
            r, g, b = img[y][x]
            brightness = (r + g + b) // 3          # 0 ~ 255
            index = brightness * (len(CHARS) - 1) // 255
            line += CHARS[index]
        print(line)

to_ascii(img)
` },

    { t: 'p', html:
      '注意 <code>brightness * 9 // 255</code> 这个映射：它把 0~255 的亮度<b>等比例压缩</b>到 0~9 的下标。' +
      '这里必须用整数除法 <code>//</code>，因为字符串下标只能是整数；' +
      '如果写成 <code>/</code>，会得到 <code>3.14</code> 这样的浮点数，' +
      '然后 <code>CHARS[3.14]</code> 直接抛 <code>TypeError</code>。' +
      '这种"数值范围 → 数组下标"的映射在后续章节会反复出现。'
    },

    { t: 'compare', left: {
      title: '下标写反（方图不报错）', html:
        '<code>img[x][y]</code>：x 是列、y 是行，但先取了列。' +
        '在 100×100 的图上不报错，在 100×50 的图上越界；' +
        '更糟的是滤镜结果看似正常却整体错位。'
    }, right: {
      title: '固定"先行后列"', html:
        '<code>img[y][x]</code>：外层遍历 <code>y</code>，内层遍历 <code>x</code>。' +
        '写的时候默念一遍"第 y 行第 x 列"，比记任何口诀都可靠。'
    } },

    { t: 'callout', kind: 'tip', title: '给变量起能自证的名字', html:
      '如果下标顺序让你不安，可以把循环变量直接命名成 <code>row</code> 和 <code>col</code>：' +
      '<code>for row in range(h): for col in range(w): img[row][col]</code>。' +
      '名字本身就是文档，<b>读代码的人（包括三天后的你）不需要再推理下标顺序</b>。'
    },

    { t: 'h', text: '三、颜色：RGB 三个通道', id: 'ch05-3' },

    { t: 'p', html:
      '一个像素的颜色由三个分量组成：红 <code>R</code>、绿 <code>G</code>、蓝 <code>B</code>，' +
      '每个分量是 <b>0 到 255 的整数</b>（正好一个字节，8 位）。' +
      '三种光按不同强度叠加，就能配出屏幕上看到的颜色。' +
      '在 Python 里最自然的表示是一个三元组：<code>(255, 0, 0)</code> 是纯红。'
    },

    { t: 'table', head: ['颜色', '(R, G, B)', '说明'], rows: [
      ['黑', '(0, 0, 0)', '三个通道都没有光'],
      ['白', '(255, 255, 255)', '三个通道都拉满'],
      ['红 / 绿 / 蓝', '(255, 0, 0) / (0, 255, 0) / (0, 0, 255)', '只开一个通道'],
      ['灰', '(128, 128, 128)', '<b>三个通道相等</b>的颜色都是灰色；0 是黑，255 是白'],
      ['天蓝', '(110, 170, 255)', '蓝最多、绿不少、红较少'],
      ['草绿', '(60, 160, 80)', '绿占主导，红蓝都低']
    ], caption: '记住一条：三通道相等 → 灰度；三通道都大 → 亮。' },

    { t: 'p', html:
      '把三通道加起来平均，得到的是"RGB 平均亮度"。但人眼对三种颜色的敏感程度不一样：' +
      '<b>对绿色最敏感，对蓝色最不敏感</b>。所以视觉上的"亮"要用加权平均，' +
      '这也是所有灰度算法的标准做法。'
    },

    { t: 'code', lang: 'python', caption: '通道拆分与感知亮度', code:
`SKY = (110, 170, 255)     # 天蓝
GRASS = (60, 160, 80)     # 草绿

r, g, b = SKY             # 元组解包：一次拿到三个通道
print(r, g, b)            # 110 170 255

def luminance(color):
    """人眼感知的亮度：绿权重最高，蓝权重最低。"""
    r, g, b = color
    return int(0.299 * r + 0.587 * g + 0.114 * b)

print(luminance(SKY))     # 158
print(luminance(GRASS))   # 122
print((110 + 170 + 255) // 3)   # 178：单纯平均会高估天空的亮
` },

    { t: 'p', html:
      '这两个数字很能说明问题：草绿的三通道平均只有 100，但感知亮度 122，' +
      '看起来比平均值更亮；天蓝平均 178，感知亮度却只有 158。' +
      '<b>人眼看到的东西，和三个数字的算术平均并不一致</b>。' +
      '这也是为什么做灰度图时不能偷懒用 <code>(r+g+b)//3</code>。'
    },

    { t: 'callout', kind: 'note', title: '0~255 是约定，不是物理定律', html:
      '图像库内部也可能用 0.0~1.0 的浮点数表示颜色（深度学习里很常见），' +
      '或者用 0~65535。本课统一用最常见的 8 位整数表示。' +
      '不管底层用什么表示，<b>“颜色是一个固定长度的向量”</b>这个模型不变。'
    },

    { t: 'h', text: '四、读像素、写像素、封装成函数', id: 'ch05-4' },

    { t: 'p', html:
      '有了二维列表，读懂一个像素就是一次下标访问，写一个像素就是一次赋值。' +
      '虽然可以直接写 <code>img[y][x] = ...</code>，但本课建议一开始就把这两个动作' +
      '包成 <code>get_pixel</code> / <code>set_pixel</code> 两个函数。原因有三个：' +
      '读代码时语义清楚；将来换图像库只需改这两个函数；边界检查有地方放。'
    },

    { t: 'code', lang: 'python', caption: '四个小工具：新建、读、写、遍历范围', code:
`def make_image(w, h, color=(0, 0, 0)):
    """新建一张宽 w、高 h、纯色的图像。注意这里用列表推导式。"""
    return [[color for _ in range(w)] for _ in range(h)]

def get_pixel(img, x, y):
    """读取 (x, y) 处的颜色。x 是列，y 是行。"""
    return img[y][x]

def set_pixel(img, x, y, color):
    """把 (x, y) 处改成 color，原地修改，没有返回值。"""
    img[y][x] = color

def size_of(img):
    """返回 (宽, 高)，帮我们少写几次 len。"""
    return len(img[0]), len(img)

canvas = make_image(6, 4, (255, 255, 255))
print(size_of(canvas))        # (6, 4)
` },

    { t: 'h', lvl: 3, text: '为什么不是 [[color] * w] * h', id: 'ch05-4-1' },

    { t: 'p', html:
      '<code>make_image</code> 里的列表推导式值得多看两眼：外层 ' +
      '<code>[[...] for _ in range(h)]</code> 生成 h 行，每行再生成 w 个像素。' +
      '<b>必须逐行新建列表</b>；如果写成 <code>[[color] * w] * h</code>，' +
      '就会得到 h 个指向<b>同一个列表</b>的引用，改一个像素、整列跟着变。' +
      '这个坑在第 7 章讲列表别名时会正式拆解。'
    },

    { t: 'code', lang: 'python', caption: '用 set_pixel 画棋盘：坐标相加判断奇偶', code:
`def draw_board(size, light, dark):
    """画 size x size 的棋盘格：x + y 是偶数用亮色，奇数用暗色。"""
    board = make_image(size, size)
    for y in range(size):
        for x in range(size):
            if (x + y) % 2 == 0:
                set_pixel(board, x, y, light)
            else:
                set_pixel(board, x, y, dark)
    return board

board = draw_board(8, (250, 250, 250), (20, 20, 20))
to_ascii(board)      # 亮暗交替，一眼可验证
` },

    { t: 'callout', kind: 'tip', title: '算法的价值在函数，不在库', html:
      '真实的图像库（比如 Pillow）提供 <code>img.getpixel((x, y))</code>、' +
      '<code>img.putpixel((x, y), color)</code>、<code>img.width</code>、<code>img.height</code>，' +
      '名字和职责跟我们上面这四个函数几乎一一对应。' +
      '<b>把"读、写、尺寸"三件事抽干净，后面每个滤镜都只依赖这套接口</b>，' +
      '换成真库时算法一行都不用改。'
    },

    { t: 'h', text: '五、逐像素滤镜：灰度、反色、二值化', id: 'ch05-5' },

    { t: 'p', html:
      '现在到了这一章的核心：<b>所有逐像素滤镜共享同一个模板</b>。' +
      '模板只有四步——新建一张同尺寸的空图、双层循环遍历每个坐标、' +
      '根据源图像素算出新颜色、把新颜色写进新图。' +
      '学会这一个模板，灰度、反色、二值化、复古滤镜、边缘检测都只是"中间那一步的公式不同"。'
    },

    { t: 'flow', dir: 'v', nodes: [
      { title: '新建同尺寸输出图', desc: 'out = make_image(w, h)', kind: 'proc' },
      { title: '双层循环遍历坐标', desc: 'for y ... for x ...', kind: 'proc' },
      { title: '读源像素，算新颜色', desc: 'r, g, b = get_pixel(img, x, y)', kind: 'proc' },
      { title: '写入输出图', desc: 'set_pixel(out, x, y, new_color)', kind: 'proc' },
      { title: '返回新图', desc: '原图保持不变', kind: 'decide' }
    ] },

    { t: 'h', lvl: 3, text: '滤镜的通用骨架', id: 'ch05-5-1' },

    { t: 'p', html:
      '第一个滤镜是<b>灰度化</b>。它把每个像素的三通道替换成同一个亮度值，' +
      '于是彩色照片就变成了黑白照片。注意写法：<b>读旧图、写新图</b>，' +
      '而不是读一格改一格。'
    },

    { t: 'code', lang: 'python', caption: '灰度化：只改中间那一步的公式', code:
`def to_gray(img):
    """返回一张新的灰度图，原图不变。"""
    w, h = size_of(img)
    out = make_image(w, h)
    for y in range(h):
        for x in range(w):
            v = luminance(get_pixel(img, x, y))     # 加权亮度
            set_pixel(out, x, y, (v, v, v))         # 三通道相同 = 灰色
    return out

gray = to_gray(img)
to_ascii(gray)
` },

    { t: 'p', html:
      '第二个滤镜是<b>反色</b>：每个通道取 <code>255 - v</code>。' +
      '黑变白、白变黑，用来做夜览模式或者负片效果。它的公式简单到几乎不需要解释，' +
      '但正好用来检验"模板是否记住了"——如果你能不看上面的代码直接写出来，就说明模板已经内化。'
    },

    { t: 'code', lang: 'python', caption: '反色：255 - v', code:
`def invert(img):
    """返回反色后的新图。"""
    w, h = size_of(img)
    out = make_image(w, h)
    for y in range(h):
        for x in range(w):
            r, g, b = get_pixel(img, x, y)
            set_pixel(out, x, y, (255 - r, 255 - g, 255 - b))
    return out

to_ascii(invert(img))
` },

    { t: 'p', html:
      '第三个滤镜是<b>二值化</b>：设定一个阈值 <code>limit</code>，' +
      '亮度超过它变纯白，否则变纯黑。二值图只有两种颜色，' +
      '是文档扫描、文字识别前最常见的一步预处理——它把"连续的亮度"变成了"简单的是非判断"。'
    },

    { t: 'code', lang: 'python', caption: '二值化：阈值决定哪些像素留下', code:
`def threshold(img, limit=128):
    """亮度 >= limit 的像素变白，其余变黑。limit 是可选参数。"""
    w, h = size_of(img)
    out = make_image(w, h)
    for y in range(h):
        for x in range(w):
            if luminance(get_pixel(img, x, y)) >= limit:
                set_pixel(out, x, y, (255, 255, 255))
            else:
                set_pixel(out, x, y, (0, 0, 0))
    return out

to_ascii(threshold(img, 100))
` },

    { t: 'table', head: ['滤镜', '对每个像素做', '输入 → 输出', '原图需要吗'], rows: [
      ['灰度化', '<code>(v, v, v)</code>，v 是加权亮度', '彩色 → 黑白', '需要，只读'],
      ['反色', '<code>(255-r, 255-g, 255-b)</code>', '任意 → 负片', '需要，只读'],
      ['二值化', '<code>v >= limit ? 白 : 黑</code>', '任意 → 纯黑白', '需要，只读'],
      ['提亮', '<code>min(255, v + 40)</code>', '偏暗 → 更亮', '需要，只读']
    ], caption: '同一模板，只有"算新颜色"这一步不同。' },

    { t: 'callout', kind: 'warn', title: '为什么坚持"写新图"', html:
      '如果直接在原图上改，比如反色，读 (x,y) 写 (x,y)，逻辑上勉强成立；' +
      '但一旦新颜色依赖<b>别的坐标</b>（镜像、模糊、缩放），原地修改就会污染还没读的数据。' +
      '统一规定"<b>输入只读，输出新建</b>"，可以让你不必为每个滤镜单独分析依赖关系，' +
      '这是用一点点内存换掉一整类 bug。'
    },

    { t: 'h', text: '六、镜像、缩放与区域统计', id: 'ch05-6' },

    { t: 'p', html:
      '几何变换和滤镜的区别在于：<b>它不改变颜色，而是改变"输出坐标到输入坐标的映射"</b>。' +
      '输出的 (x, y) 应该去输入的哪个位置取像素？这个问题一旦回答清楚，代码就是模板的变体。'
    },

    { t: 'p', html:
      '水平镜像的答案是：输出第 x 个像素，取输入第 <code>w - 1 - x</code> 个像素。' +
      '因为最左边 (x=0) 应该取最右边 (x=w-1)，正好反过来。'
    },

    { t: 'code', lang: 'python', caption: '水平镜像：坐标映射，不是颜色运算', code:
`def mirror(img):
    """左右翻转，返回新图。"""
    w, h = size_of(img)
    out = make_image(w, h)
    for y in range(h):
        for x in range(w):
            src_x = w - 1 - x          # 输出的 x 对应输入的 w-1-x
            set_pixel(out, x, y, get_pixel(img, src_x, y))
    return out

to_ascii(img)
print('--- 镜像后 ---')
to_ascii(mirror(img))
` },

    { t: 'callout', kind: 'warn', title: '原地镜像会翻两次', html:
      '如果你不新建 out，而是直接在原图上 <code>set_pixel(img, x, y, img[y][w-1-x])</code>，' +
      '那么在左侧交换完之前，右侧的像素已经被改成别的值了。' +
      '最终结果往往看起来"根本没变"或者"花掉了"。' +
      '<b>凡是新值要读别的坐标，就必须用输出图。</b>'
    },

    { t: 'h', lvl: 3, text: '缩放：最近邻与降采样', id: 'ch05-6-1' },

    { t: 'p', html:
      '放大图像最省事的办法是<b>最近邻</b>：每个原像素复制成一块 <code>factor × factor</code> 的方块。' +
      '输出图的 (x, y) 应该去哪取？答案是 <code>(x // factor, y // factor)</code>。' +
      '整数除法在这里正好实现了"每 factor 个像素共用同一个源"。'
    },

    { t: 'code', lang: 'python', caption: '最近邻放大：每个像素复制成方块', code:
`def scale_up(img, factor):
    """把图像放大 factor 倍。返回新图。"""
    w, h = size_of(img)
    out = make_image(w * factor, h * factor)
    for y in range(h * factor):
        for x in range(w * factor):
            src_x = x // factor          # 连续 factor 个 x 落到同一个源像素
            src_y = y // factor
            set_pixel(out, x, y, get_pixel(img, src_x, src_y))
    return out

big = scale_up(img, 2)
print(size_of(big))       # 宽高各翻倍
to_ascii(big)
` },

    { t: 'p', html:
      '缩小则是反过来：输出图更小，每个输出像素从原图里"挑"一个代表，' +
      '或者把一块区域的颜色<b>平均</b>起来（这就叫降采样）。' +
      '最近邻缩小会丢掉细节，产生锯齿；平均缩小更平滑，代价是计算量变大。' +
      '这两种取舍在图像处理里非常典型：<b>简单快速 vs 平滑准确</b>。'
    },

    { t: 'p', html:
      '图像不仅能"变样子"，还能"变成数字"。最后一组工具做<b>区域统计</b>：' +
      '算整张图的平均颜色，或者只算某个矩形区域的平均颜色。' +
      '这两段代码是后面"判断一张图偏什么色调""检测某块区域是否异常"的基础。'
    },

    { t: 'code', lang: 'python', caption: '平均颜色与区域平均', code:
`def average_color(img, x0=0, y0=0, x1=None, y1=None):
    """算 [x0, x1) x [y0, y1) 区域的平均颜色；默认整张图。

    参数后面的 = 表示默认值；x1/y1 传 None 表示"一直取到边界"。
    """
    w, h = size_of(img)
    if x1 is None:
        x1 = w
    if y1 is None:
        y1 = h

    total_r = total_g = total_b = 0
    count = 0
    for y in range(y0, y1):
        for x in range(x0, x1):
            r, g, b = get_pixel(img, x, y)
            total_r += r
            total_g += g
            total_b += b
            count += 1

    if count == 0:
        return (0, 0, 0)            # 空区域，避免除以 0
    return (total_r // count, total_g // count, total_b // count)

print(average_color(img))               # 整图平均色
print(average_color(img, 0, 0, 2, 2))   # 左上角 2x2 的平均色
` },

    { t: 'p', html:
      '注意 <code>average_color</code> 的两个设计细节。一是用 <b>四个坐标 + 默认值</b>，' +
      '不传参数时算整图，传了就只算区域；二是 <code>count == 0</code> 的提前返回，' +
      '防止空区域触发 <code>ZeroDivisionError</code>。' +
      '这种"<b>边界先处理，主逻辑后写</b>"的习惯，比聪明更重要。'
    },

    { t: 'table', head: ['操作', '每个像素的代价', '整图总代价', '说明'], rows: [
      ['读 / 写一个像素', 'O(1)', 'O(w×h)', '下标访问，常数时间'],
      ['灰度 / 反色 / 二值化', 'O(1)', 'O(w×h)', '每个像素只访问一次'],
      ['镜像', 'O(1)', 'O(w×h)', '只换了读取坐标'],
      ['放大 factor 倍', 'O(1)', 'O((w×factor)×(h×factor))', '输出像素数量变了，总工作量按面积增长'],
      ['平均颜色（单区域）', 'O(1)', 'O(区域面积)', '遍历区域，累加三个通道']
    ], caption: '逐像素算法都是线性的：像素数翻倍，时间大致翻倍。' },

    { t: 'terms', items: [
      { en: 'pixel', zh: '像素', html: '图像的最小单位，只有一个颜色。' },
      { en: 'channel', zh: '通道', html: '颜色的一个分量。RGB 图像有红、绿、蓝三个通道，各 0~255。' },
      { en: 'grayscale', zh: '灰度', html: '三个通道取值相同的图像，也就是黑白图。' },
      { en: 'nested loop', zh: '嵌套循环', html: '循环里套循环。处理二维数据时，外层走行、内层走列。' },
      { en: 'mapping', zh: '坐标映射', html: '几何变换算的是"输出坐标该去输入哪里取"，不是颜色。' },
      { en: 'downsampling', zh: '降采样', html: '缩小图像时把一块区域合并成一个像素，常用平均值。' }
    ] },

    { t: 'steps', items: [
      { title: '先确认尺寸', html: '写 <code>w, h = size_of(img)</code>，不要凭感觉写 <code>len(img)</code>。' },
      { title: '再写双层骨架', html: '外层 <code>for y in range(h)</code>，内层 <code>for x in range(w)</code>，先打印坐标验证。' },
      { title: '想清楚公式', html: '问自己：新颜色依赖源图的哪个坐标？输入只读，输出新建。' },
      { title: '最后用字符画验证', html: '用 <code>to_ascii</code> 看一眼结构对不对，再谈效果好不好。' }
    ] },

    { t: 'keypoint', items: [
      { title: '图像 = 二维网格', html: '宽 × 高 个像素，<code>img[y][x]</code>，x 是列、y 是行，y 向下增大。' },
      { title: '遍历用双层循环', html: '外层 y、内层 x；按行处理符合直觉，也方便逐行组织和输出。' },
      { title: '颜色是三通道', html: '每个像素是 (R, G, B)，各 0~255；三通道相等就是灰度。' },
      { title: '滤镜 = 同一模板换公式', html: '新建输出图 → 双层遍历 → 算新颜色 → 写回；输入只读，输出新建。' },
      { title: '几何变换 = 坐标映射', html: '镜像、缩放改的是"输出 (x,y) 从输入哪取"，不是颜色运算。' },
      { title: '图像也能变成数字', html: '平均颜色、区域统计把图像压缩成几个可比较的数，是后续分析的基础。' }
    ] },

    { t: 'checklist', id: 'ch05', items: [
      '我能说出 <code>img[y][x]</code> 里 x 和 y 分别代表什么，以及为什么不是 <code>img[x][y]</code>',
      '我能不看笔记写出遍历整张图像的双层循环',
      '我能解释 RGB 三个通道，并说出灰度图的特征',
      '我能独立写出灰度化、反色、二值化三个滤镜',
      '我知道为什么镜像不能原地做，并会用输出图实现',
      '我能算出整张图和某个矩形区域的平均颜色'
    ] }
  ]
});
