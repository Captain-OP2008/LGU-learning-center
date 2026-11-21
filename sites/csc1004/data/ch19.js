/* =====================================================================
 * data/ch19.js · 第 19 章：Python 项目与机器学习入门
 * 职责：真实 Python 项目结构（入口 / 命令行参数 / YAML 配置）、三大组件
 *       （环境管理器 / 机器学习库 / 语言）、PyTorch 五步流程
 *       （读配置 → 定义网络 → run → train → test）、关键概念与学生落地建议。
 * 依据：lecture12（Python Project + PyTorch MNIST）+ lecture10/11 的类与模块复习。
 * 注意：Python 代码站内引擎不可执行，全部 run:false。
 * 对外 API：CSC.registerChapter({...})（schema 见 _dev/CONTRACT.md §4–§5）
 * 作者模块：content-ml
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch19',
  num: '19',
  title: 'Python 项目与机器学习入门',
  en: 'ML Project with PyTorch',
  goals: [
    '能说出一个机器学习项目的三大组件（环境管理器 / 机器学习库 / 编程语言）以及各自负责什么',
    '能按「读配置 → 定义网络 → run() → train() → test()」五步读懂一个 PyTorch MNIST 项目',
    '能解释 model.train() 与 model.eval()、with torch.no_grad() 各自的作用，以及为什么 test 不需要梯度',
    '能用训练集 / 测试集、epoch、batch、loss、梯度、过拟合这些词描述一次训练到底发生了什么',
    '能从一个空目录搭出「读配置 + 打印参数」的最小骨架，再逐步加模型与训练循环'
  ],
  kp: [
    { id: 'ch19-1', title: '一个真实 Python 项目长什么样' },
    { id: 'ch19-2', title: '三大组件：环境管理器 / 机器学习库 / 编程语言' },
    { id: 'ch19-3', title: '五步流程总览（Step I–V）' },
    { id: 'ch19-4', title: 'Step II：用 nn.Module 定义网络' },
    { id: 'ch19-5', title: 'Step III：run() 主流程' },
    { id: 'ch19-6', title: 'Step IV–V：train() 与 test()' },
    { id: 'ch19-7', title: '关键概念讲人话：epoch / batch / loss / 梯度 / 过拟合' },
    { id: 'ch19-8', title: '和前面内容的连接 + 学生项目落地建议' }
  ],
  blocks: [

    /* ------------------------------------------------------------------ 开篇 */
    { t: 'callout', kind: 'why', html:
      `这是 Part VI 的最后一章，也是课程 Python 部分的终点：前几章你写的是「看得见结果」的程序——Tkinter 窗口、贪吃蛇；这一章第一次进入<b>机器学习（machine learning）</b>项目：程序不再完全按你写的 if/else 办事，而是从数据里「学」出规则。<br>
      课程最后一个项目是 PyTorch 手写数字识别：读一份配置、定义一个<b>神经网络（neural network）</b>、写 train/test 循环，让它在 MNIST 上跑出准确率。本章把这 12 页讲义拆成你能复现的流程。` },

    { t: 'p', lead: true, html:
      `别被「机器学习」吓住：这一章 90% 的代码是固定套路，真正要你设计的只有网络结构和几个<b>超参数（hyperparameter）</b>。先按「能跑通」走一遍。` },

    /* ------------------------------------------------------------------ 一、项目结构 */
    { t: 'h', text: '一、一个真实 Python 项目长什么样', id: 'ch19-1' },

    { t: 'p', html:
      `先纠正一个想象：项目<b>不是一个 main.py 从头写到尾</b>，而是一组分工明确的文件。典型目录如下（文件名因项目而异）。` },

    { t: 'code', lang: 'python', run: false, caption: '项目目录结构（示意）：入口、配置、模型、训练、数据各就各位', code:
`mnist_project/
├── main.py              # 程序入口：读命令行参数 → 读配置 → 交给 run()
├── config/
│   └── mnist.yaml       # 超参数都写在这里：batch_size、epochs、lr……
├── model.py             # 定义网络：class Net(nn.Module) 的 __init__ 与 forward
├── run.py               # run()：设备、数据、模型、优化器、epochs 循环
├── train.py             # train() / test()：训练与评估循环
└── data/                # 第一次运行时自动下载的 MNIST 数据` },

    { t: 'p', html:
      `两个细节决定它像不像专业项目。第一，<code>if __name__ == "__main__":</code> 表示只有文件被直接运行（<code>python main.py</code>）才执行下面代码，被 import 时不执行——这样里面的函数才能复用。<br>
      第二，参数从命令行来：<code>python main.py ./config/mnist.yaml</code>，三段分别是解释器、入口文件、<b>命令行参数（command-line argument）</b>。main.py 用 <code>sys.argv</code> 读路径，再把 YAML 读成字典。` },

    { t: 'code', lang: 'python', run: false, caption: 'main.py · Step I：读参数 → 读配置 → 进入 run()', code:
`# main.py —— 入口：读参数 → 读配置 → 交给 run()
import sys
import yaml
from run import run

def read_args():
    if len(sys.argv) < 2:
        raise ValueError("用法: python main.py ./config/mnist.yaml")
    return sys.argv[1]              # 例如 "./config/mnist.yaml"

def load_config(path):
    with open(path, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)    # YAML → Python 的 dict

def main():
    arg = read_args()               # 1) 读参数
    config = load_config(arg)       # 2) 读配置
    print("配置:", arg)
    print("超参数:", config)
    run(config)                     # 3) 开跑

if __name__ == "__main__":
    main()` },

    { t: 'p', html:
      `YAML 是「键: 值」的纯文本，缩进表示层级，价值是「改实验参数不用改代码」。讲义命令里写的是 <code>./config/minist.yaml</code>（MNIST 的常见笔误），文件名无所谓，关键是路径与文件真实位置一致。` },

    { t: 'code', lang: 'python', run: false, caption: 'config/mnist.yaml · 超参数与代码分离，实验时只改这里', code:
`# config/mnist.yaml —— 超参数写在这里
batch_size: 64          # 一次喂给网络多少张图
test_batch_size: 1000   # 测试时一次看多少张
epochs: 5               # 整个训练集要过几遍
lr: 1.0                 # 学习率：优化器每步迈多大
log_interval: 20        # 每多少个 batch 打印一次进度` },

    { t: 'callout', kind: 'note', html:
      `讲义 Step I–V 的代码以截图为主，本章按主干 API 补成可读骨架：调用顺序与讲义一致，文件名和层数可能不同。读代码时盯住「哪一步在做什么」。` },

    /* ------------------------------------------------------------------ 二、三大组件 */
    { t: 'h', text: '二、三大组件：环境管理器 / 机器学习库 / 编程语言', id: 'ch19-2' },

    { t: 'p', html:
      `讲义把项目拆成三个组件（component），每层解决一类问题。理解分层比记住任何一行代码都重要。` },

    { t: 'table',
      head: ['组件', '课程示例', '负责什么', '少了它会怎样'],
      rows: [
        ['<b>环境管理器</b>（environment manager）', 'MiniConda', '隔离 Python 版本与第三方库：一个项目一套环境', '装 A 项目的库把 B 项目搞崩；出现「在我电脑上能跑」'],
        ['<b>机器学习库</b>（machine learning library）', 'PyTorch、scikit-learn', '提供张量、自动求导、网络层、优化器等现成 API', '每一行数学都要自己写，还要手推梯度'],
        ['<b>编程语言</b>（programming language）', 'Python', '写 I/O 与流程：读参数、读配置、拼路径、组织 run/train/test', '流程没有地方安放，库和算法串不起来']
      ],
      caption: '三层各管一件事：conda 管「在哪跑」，PyTorch 管「用什么算」，Python 管「怎么组织」' },

    { t: 'p', html:
      `一句话记住：<b>conda 管环境，PyTorch 管数学，Python 管流程</b>。三者分开最大好处是可替换：换机器只换环境，换模型只换网络，流程代码基本不动——这也是讲义把装环境当第一步的原因。` },

    { t: 'callout', kind: 'warn', title: '新手第一个大坑：环境装错地方', html:
      `不要把库直接装进 base 环境或系统 Python。顺序是：<code>conda create -n csc1004 python=3.10</code> 建独立环境，<code>conda activate csc1004</code> 激活，再装 PyTorch。<br>
      否则会出现「明明装了 torch，import 还是报错」——多半是终端激活的不是你以为的环境。用 <code>conda env list</code> 和 <code>which python</code>（Windows 用 <code>where python</code>）确认。` },

    /* ------------------------------------------------------------------ 三、五步流程 */
    { t: 'h', text: '三、五步流程总览（Step I–V）', id: 'ch19-3' },

    { t: 'flow', dir: 'v', nodes: [
      { title: 'Step I · 读配置', desc: 'read_args → load_config → run', kind: 'start' },
      { title: 'Step II · 定义网络', desc: 'Net(nn.Module)：定义层 + 接线', kind: 'proc' },
      { title: 'Step III · run() 主流程', desc: '设备 → 数据 → 模型 → epochs 循环', kind: 'proc' },
      { title: 'Step IV · train()', desc: '前向 → loss → backward → step', kind: 'proc' },
      { title: 'Step V · test()', desc: 'eval() + no_grad：只评估', kind: 'end' }
    ] },

    { t: 'p', html:
      `五步是一条固定数据流：main.py 把配置递进去（Step I）→ 网络决定长什么样（Step II）→ run() 装配设备、数据、模型、优化器（Step III）→ 每个 epoch 先把<b>训练集（training set）</b>学一遍（Step IV），再用<b>测试集（test set）</b>考一遍（Step V）。训练集完整过一遍就叫一个<b>轮次（epoch）</b>。` },

    /* ------------------------------------------------------------------ 四、定义网络 */
    { t: 'h', text: '四、Step II：用 nn.Module 定义网络', id: 'ch19-4' },

    { t: 'p', html:
      `网络就是一个继承了 <code>nn.Module</code> 的类。<code>nn.Module</code> 是 PyTorch 的父类模板，和第 16 章 <code>class Student(Person)</code> 同一机制：它替你管理参数、支持 <code>.to(device)</code> 与 <code>.train()/.eval()</code>。<br>
      你只需填两件事：<code>__init__</code> 里定义层（买零件），<code>forward(self, x)</code> 里把输入一层层连到输出（接线）。x 是「一个 batch 的数据」，不是一张图。` },

    { t: 'code', lang: 'python', run: false, caption: 'model.py · Step II：__init__ 定义层，forward 把 x 连到输出', code:
`# model.py —— 只做一件事：定义网络结构
import torch.nn as nn
import torch.nn.functional as F

class Net(nn.Module):
    def __init__(self):
        super().__init__()                  # 先让父类把该建的都建好
        self.fc1 = nn.Linear(28 * 28, 128)  # 输入：28×28 的图摊成 784 个数
        self.fc2 = nn.Linear(128, 64)
        self.fc3 = nn.Linear(64, 10)        # 输出：0–9 十个类别

    def forward(self, x):
        x = x.view(-1, 28 * 28)             # 摊平：一批图 → 一批 784 维向量
        x = F.relu(self.fc1(x))             # 784 → 128，再过激活函数
        x = F.relu(self.fc2(x))             # 128 → 64
        return F.log_softmax(self.fc3(x), dim=1)   # 10 个类别的对数概率

net = Net()
print(net)                                  # 打印结构，先确认层没写错` },

    { t: 'p', html:
      `读法：<code>nn.Linear(28 * 28, 128)</code> 是「784 个输入 → 128 个输出」的全连接层；<code>view(-1, 28 * 28)</code> 把每张图摊平（-1 表示这一维让 PyTorch 自己算）；<code>log_softmax</code> 输出对数概率，正好配 <code>F.nll_loss</code>。<br>
      语法复习：调用 <code>model(data)</code> 时 PyTorch 自动去调 <code>forward(data)</code>——<code>__call__</code> 这类双下划线方法让对象像函数一样被调用，和 <code>__init__</code> 是同一族。` },

    /* ------------------------------------------------------------------ 五、run() */
    { t: 'h', text: '五、Step III：run() 主流程', id: 'ch19-5' },

    { t: 'p', html:
      `run() 是总装车间，按讲义分四段：设设备 → 下数据 → 建模型和优化器 → 按 epochs 循环。先看前两段。` },

    { t: 'code', lang: 'python', run: false, caption: 'run.py（上）· Part I 设备 + Part II 下载数据、装进 DataLoader', code:
`# run.py（上）—— Step III Part I–II：设备与数据
import torch
from torch.utils.data import DataLoader
from torchvision import datasets, transforms
from model import Net

def run(config):
    # Part I：挑设备。没有 GPU 就退回 CPU，代码不用改
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print("使用设备:", device)

    # Part II：下载 MNIST，包成 DataLoader
    tf = transforms.Compose([transforms.ToTensor()])
    train_set = datasets.MNIST("./data", train=True,  download=True, transform=tf)
    test_set  = datasets.MNIST("./data", train=False, download=True, transform=tf)
    train_loader = DataLoader(train_set, batch_size=config["batch_size"], shuffle=True)
    test_loader  = DataLoader(test_set,  batch_size=config["test_batch_size"])` },

    { t: 'p', html:
      `<code>torch.device("cuda" if torch.cuda.is_available() else "cpu")</code>：有 NVIDIA 显卡就走 <b>CUDA</b>，没有就退回 CPU。CUDA 是显卡上的并行计算平台（讲义原话：parallel computing platform and application programming interface），训练会快很多；没显卡也能跑通，只是慢——别把「跑得慢」当代码错。<code>model.to(device)</code> 与 <code>data.to(device)</code> 必须指向同一设备。` },

    { t: 'code', lang: 'python', run: false, caption: 'run.py（下）· Part III 模型与优化器 + Part IV 按 epochs 训练与测试', code:
`# run.py（下）—— Step III Part III–IV：模型、优化器、epochs 循环
    # Part III：建模型与优化器
    model = Net().to(device)                     # 初始化网络并搬到设备上
    optimizer = torch.optim.Adadelta(model.parameters(), lr=config["lr"])

    # Part IV：把训练集过 config["epochs"] 遍，每遍都 train + test
    for epoch in range(1, config["epochs"] + 1):
        train(config, model, device, train_loader, optimizer, epoch)
        test(config, model, device, test_loader)` },

    { t: 'p', html:
      `顺序要点：<code>model = Net().to(device)</code> 必须在 optimizer 之前，因为优化器要接管模型的参数（<code>model.parameters()</code>）；train/test 都在 epoch 循环里，每个 epoch 先学一遍、再考一遍。epochs 来自配置，想多练几轮改 YAML 即可。<code>config["batch_size"]</code> 是对字典取键，等于 Java 的 <code>map.get("batch_size")</code>。` },

    /* ------------------------------------------------------------------ 六、train/test */
    { t: 'h', text: '六、Step IV–V：train() 与 test()', id: 'ch19-6' },

    { t: 'p', html:
      `train() 是本章最核心的 20 行：一个<b>批（batch）</b>走一次「前向传播（forward pass）→ 算损失（loss）→ 反向传播（backpropagation）→ 更新参数」。讲义的关键动作是：<code>model.train()</code>、<code>output = model(data)</code>、<code>loss = F.nll_loss(output, target)</code>、<code>loss.backward()</code>、<code>optimizer.step()</code>。实际代码还多一行 <code>optimizer.zero_grad()</code>（清空上一批梯度）——漏了它会累加。` },

    { t: 'code', lang: 'python', run: false, caption: 'train.py · Step IV：一个 batch 的四步，四步之后参数就被改了一次', code:
`# train.py —— Step IV：训练一个 batch
import torch.nn.functional as F

def train(config, model, device, train_loader, optimizer, epoch):
    model.train()                          # 切到训练模式
    for batch_idx, (data, target) in enumerate(train_loader):
        data, target = data.to(device), target.to(device)
        optimizer.zero_grad()              # 清空上一批的梯度（模板必备）
        output = model(data)               # 1) 前向：输入 → 预测
        loss = F.nll_loss(output, target)  # 2) 算损失：和标准答案差多少
        loss.backward()                    # 3) 反向传播：算出每个参数的梯度
        optimizer.step()                   # 4) 优化器按梯度更新参数
        if batch_idx % config["log_interval"] == 0:
            print(f"epoch {epoch} [{batch_idx * len(data)}/{len(train_loader.dataset)}]"
                  f"  loss={loss.item():.4f}")` },

    { t: 'p', html:
      `逐行翻译：<code>model(data)</code> 是预测；<code>F.nll_loss</code> 把预测和标准答案比出一个数（损失）；<code>loss.backward()</code> 从 loss 倒着算出每个参数的<b>梯度（gradient）</b>；<code>optimizer.step()</code> 按梯度和<b>学习率（learning rate）</b>把参数挪一小步。四步合起来，就是模型「从错误中学习」一次。` },

    { t: 'code', lang: 'python', run: false, caption: 'test.py · Step V：只做前向、只统计准确率，参数一个都不改', code:
`# test.py —— Step V：评估
import torch
import torch.nn.functional as F

def test(config, model, device, test_loader):
    model.eval()                           # 切到评估模式
    test_loss = 0
    correct = 0
    with torch.no_grad():                 # 这一块里不记录梯度
        for data, target in test_loader:
            data, target = data.to(device), target.to(device)
            output = model(data)           # 只前向，不 backward
            test_loss += F.nll_loss(output, target, reduction="sum").item()
            pred = output.argmax(dim=1)    # 概率最大的那一类
            correct += pred.eq(target).sum().item()
    n = len(test_loader.dataset)
    print(f"测试集: 平均 loss={test_loss / n:.4f}, 准确率={100. * correct / n:.2f}%")` },

    { t: 'compare', left: {
      title: 'train() · 训练：要学，所以要梯度',
      html: '切 <code>model.train()</code>；每个 batch 都 zero_grad → 前向 → loss → backward → step。参数每批都会变。',
      code: `model.train()
optimizer.zero_grad()
output = model(data)
loss = F.nll_loss(output, target)
loss.backward()
optimizer.step()        # 参数被更新`
    }, right: {
      title: 'test() · 评估：只考，不改参数',
      html: '切 <code>model.eval()</code>，用 <code>with torch.no_grad()</code> 关梯度记录；只前向、统计准确率。',
      code: `model.eval()
with torch.no_grad():
    output = model(data)
    pred = output.argmax(dim=1)
# 没有 backward / step`
    } },

    { t: 'p', html:
      `<code>with torch.no_grad():</code> 的意思是「这一块不记录梯度」。测试只做前向、只统计准确率，不需要 backward，关掉梯度记录能省显存、省时间；<code>model.eval()</code> 则把网络切到评估模式——有些层在训练和评估时行为不同（例如 Dropout 训练时随机丢弃），忘记切换会让测试结果忽高忽低。<br>
      口诀：<b>要更新参数 → train() 模式 + 开梯度；只做评估 → eval() 模式 + no_grad</b>。` },

    /* ------------------------------------------------------------------ 七、关键概念 */
    { t: 'h', text: '七、关键概念讲人话', id: 'ch19-7' },

    { t: 'p', html:
      `把这些词连起来，就是一次训练的全景：训练集切成一个个 batch，每个 batch 前向算 loss、反向算梯度、优化器更新参数；整个训练集过一遍叫一个 epoch。` },

    { t: 'terms', cols: 2, items: [
      { en: 'training set', zh: '训练集', html: '用来学习的样本；MNIST 里 <code>train=True</code> 的 60000 张带标签图片。' },
      { en: 'test set', zh: '测试集', html: '只用来打分，训练时不许偷看；<code>train=False</code> 的 10000 张。' },
      { en: 'epoch', zh: '轮次', html: '把训练集完整过一遍；<code>epochs: 5</code> 就是过 5 遍。' },
      { en: 'batch', zh: '批', html: '一次喂给网络的样本数；<code>batch_size: 64</code> 一次看 64 张图。' },
      { en: 'loss', zh: '损失', html: '一个数，衡量预测与标准答案的差距；训练目标就是让它变小。' },
      { en: 'gradient', zh: '梯度', html: 'loss 对参数的「敏感度」，指示参数往哪边挪能让 loss 降。' },
      { en: 'backpropagation', zh: '反向传播', html: '从 loss 倒着算每个参数梯度；<code>loss.backward()</code> 在做它。' },
      { en: 'optimizer', zh: '优化器', html: '拿梯度改参数；<code>step()</code> 迈一步，学习率决定步子大小。' }
    ] },

    { t: 'p', html:
      `最需要警惕的是<b>过拟合（overfitting）</b>：训练 loss 一路降、测试 loss 先降后升、测试准确率不再涨——模型在「背训练样本」而不是学规律。对策：减少 epochs、增加数据、简化模型、早停（early stopping）。反过来训练 loss 都降不下去是欠拟合（underfitting），该加容量而不是减容量。` },

    { t: 'callout', kind: 'warn', title: '测试集不是调参工具', html:
      `反复根据测试集结果调超参数，测试集就成了「第二训练集」，分数虚高、真实效果没变好。严格做法是三分：训练集学参数、<b>验证集（validation set）</b>选超参数、测试集只在最后用一次。本课程项目简化成 train/test 两套，但要知道这个区别。` },

    { t: 'callout', kind: 'warn', title: '三个最常忘的模板动作', html:
      `① 忘了 <code>optimizer.zero_grad()</code>：梯度跨批累加，loss 乱跳；<br>
      ② 忘了 <code>model.train()</code> / <code>model.eval()</code> 切换：Dropout 等层行为不对；<br>
      ③ 忘了 <code>.to(device)</code>：模型在 GPU、数据在 CPU（或反过来），直接报设备不匹配。` },

    /* ------------------------------------------------------------------ 八、连接与落地 */
    { t: 'h', text: '八、和前面内容的连接 + 学生项目落地建议', id: 'ch19-8' },

    { t: 'p', html:
      `为什么先让你用 Python 写游戏（Tkinter 贪吃蛇），最后才进 AI 项目？因为两者共享同一套骨架：<code>main</code> / <code>run</code> 是主循环，<code>train</code>/<code>test</code> 是每次 tick 的处理，config 是初始化参数。区别只在「对错怎么知道」：游戏里蛇撞墙一眼就看见；模型里对错只能靠 loss 和测试集数字间接判断——所以这章要求你读懂每一条 print。` },

    { t: 'p', html:
      `<code>random</code> 和 <code>torch</code> 常被混淆：<code>random</code> 是标准库，一次给你<b>一个</b>随机数（放食物、洗牌）；<code>torch</code> 是 PyTorch 的<b>张量（tensor）</b>库，一次给你<b>一整块</b>可并行、能自动求导的数字。游戏用 random，模型初始化权重用 <code>torch.randn</code>；别把 Python list 直接喂给模型——模型要 tensor。` },

    { t: 'compare', left: {
      title: 'random：一次一个数，服务游戏逻辑',
      html: '标准库，返回普通 int / float；适合放食物、洗牌、随机抽题。和 PyTorch 无关。',
      code: `import random
food = (random.randint(0, 19) * 20,
        random.randint(0, 19) * 20)`
    }, right: {
      title: 'torch：整块张量，服务模型计算',
      html: '张量（tensor）可以放 GPU、自动求导；网络的权重、输入数据、梯度都是 tensor。',
      code: `import torch
x = torch.randn(2, 3)   # 2×3 的随机矩阵
print(x.shape, x.dtype)`
    } },

    { t: 'steps', items: [
      { title: '第 1 步：只跑通「读配置 + 打印参数」', html: 'main.py 只留 <code>read_args</code> → <code>load_config</code> → <code>print</code>，先不 import torch。确认 <code>python main.py ./config/mnist.yaml</code> 能打出 YAML 内容——先清掉路径、环境、参数三类错误。' },
      { title: '第 2 步：加模型，不进训练循环', html: '写 <code>Net</code>，用 <code>torch.randn(1, 1, 28, 28)</code> 造一个假 batch 做一次前向，打印输出形状，确认是 <code>[1, 10]</code>。' },
      { title: '第 3 步：加训练循环，先小规模验证', html: '先 1 个 epoch、小 batch，打印 loss；确认前几个 batch 的 loss 总体在降，再放开 epochs 与 batch_size。' },
      { title: '第 4 步：流程正确后才调参', html: '调 epochs、lr、网络宽度时一次只改一个变量，把「超参数 → 测试准确率」记成一张表。' }
    ] },

    { t: 'lab', id: 'mlnet' },

    /* ------------------------------------------------------------------ 即时练习 */
    { t: 'h', text: '即时练习' },

    { t: 'quiz', qid: 'ch19-q1' },
    { t: 'quiz', qid: 'ch19-q2' },
    { t: 'quiz', qid: 'ch19-q3' },

    /* ------------------------------------------------------------------ 章末 */
    { t: 'keypoint', items: [
      { title: '三大组件', html: '环境管理器（MiniConda）管「在哪跑」，机器学习库（PyTorch）管「怎么算」，Python 管「怎么组织」。' },
      { title: '入口与配置', html: '<code>python main.py ./config/mnist.yaml</code> + <code>if __name__ == "__main__":</code>；超参数放 YAML。' },
      { title: '网络', html: '<code>class Net(nn.Module)</code>：<code>__init__</code> 定义层，<code>forward</code> 把输入连到输出；<code>model(data)</code> 自动调 forward。' },
      { title: 'run()', html: '设 device → DataLoader → <code>Net().to(device)</code> → 优化器 → 按 epochs 循环 train/test。' },
      { title: 'train()', html: '前向 → <code>F.nll_loss</code> → <code>loss.backward()</code> → <code>optimizer.step()</code>；别忘 <code>zero_grad()</code>。' },
      { title: 'test()', html: '<code>model.eval()</code> + <code>with torch.no_grad()</code>：只前向、只统计准确率，不改参数。' },
      { title: '关键概念', html: 'epoch 是过一遍训练集，batch 是一次喂多少，loss 衡量差距，梯度指示方向，过拟合是训练好测试差。' },
      { title: '落地节奏', html: '先「读配置 + 打印参数」→ 再加模型 → 最后加训练循环；流程跑通前不要调参。' }
    ] },

    { t: 'checklist', id: 'ch19', items: [
      '我能说出一个机器学习项目的三大组件，以及每个组件负责什么',
      '我能解释 python main.py ./config/mnist.yaml 中每一段的含义',
      '我能说出 if __name__ == "__main__": 的作用，以及为什么入口动作要放在它里面',
      '我能写出 class Net(nn.Module) 的 __init__ 与 forward，并说清 model(data) 为什么等于调用 forward',
      '我能按顺序写出 run() 的四段：设备、数据、模型与优化器、epochs 循环',
      '我能默写 train() 的五个关键动作，并解释 zero_grad() 为什么不能漏',
      '我能解释 test() 为什么要 model.eval() 和 with torch.no_grad()',
      '我能用人话解释训练集/测试集、epoch、batch、loss、梯度、反向传播、优化器、过拟合',
      '我能说出过拟合的信号与四种对策，以及为什么不能用测试集反复调参',
      '我能从空目录搭出「读配置 + 打印参数」的最小骨架，再逐步加模型与训练循环'
    ] },

    { t: 'callout', kind: 'exam', title: '这一章在考试里怎么考', html:
      `<b>Final 里 Python 项目题以概念与代码顺序为主，四种题型都可能出现：</b><br>
      ① <b>选择题 / 判断题</b>：三大组件各是什么、PyTorch 属于哪一层；<code>model.train()</code> 与 <code>model.eval()</code> 的区别；测试要不要 <code>backward()</code>；epoch 与 batch 的定义。<br>
      ② <b>填空题</b>：给 train() 挖空填 <code>model.train()</code>、<code>F.nll_loss</code>、<code>loss.backward()</code>、<code>optimizer.step()</code>；给 test() 挖空填 <code>model.eval()</code>、<code>torch.no_grad()</code>。<br>
      ③ <b>读代码写作用 / 找错</b>：问 <code>data.to(device)</code> 为什么必须写，或指出「测试时还调用 optimizer.step()」这类错误。<br>
      ④ <b>简答</b>：模板——「train() 先 <code>model.train()</code>，每个 batch 做前向、算 loss、backward 求梯度、optimizer 更新；test() 用 <code>model.eval()</code> 并关梯度，只前向并统计准确率。」<br>
      <b>提醒</b>：英文卷上 API 名要拼对（<code>model.eval()</code>、<code>torch.no_grad()</code>、<code>loss.backward()</code>），填空里拼错等于没写。` },

    { t: 'callout', kind: 'ai', title: 'AI 时代这样学', html:
      `这章代码最长、API 最多，AI 最能帮上忙，也最容易把你带偏。有效用法：<br>
      ① <b>让它逐行解释</b>「<code>loss.backward()</code> 到底改了什么」，再去 PyTorch 官方文档核对 API 名与参数；<br>
      ② <b>让它画数据流</b>：data → model → output → loss → gradient → 参数，你再到代码里逐个找到对应行；<br>
      ③ <b>让它审查训练循环</b>：问「有没有漏 zero_grad、eval/train 切换、to(device)」——这是 AI 最擅长的模板检查；<br>
      ④ <b>别让它把整个项目写完再抄</b>：先自己写「读配置 + 打印参数」骨架，再让 AI review。要验证两件事：<b>API 是否真实存在</b>（AI 常编出 <code>model.fit()</code> 这种 PyTorch 没有的方法）、<b>每条 print 是否和预期一致</b>。` }

  ]
});
