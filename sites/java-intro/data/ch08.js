/* =====================================================================
 * data/ch08.js · 第 08 章：继承、多态与抽象类
 * 职责：extends / super / 重写与重载 / 动态派发 / 向上向下转型 /
 *       抽象类 / 接口 / 模板方法 / 继承 vs 组合的设计取舍 / 两个完整案例
 * 对外 API：CSC.registerChapter({...})（block schema 见 _dev/CONTRACT.md §4–§5）
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch08',
  num: '08',
  title: '继承、多态与抽象类',
  en: 'Inheritance, Polymorphism & Abstract Classes',
  goals: [
    '能用 extends 建立继承关系，正确使用 super(...) 与 super.method()，说出构造器执行顺序',
    '能重写父类方法并用 @Override 标注，区分重写与重载',
    '能解释动态派发：编译看左边、运行看右边，并预测输出',
    '能用抽象类规定子类契约，用接口表达跨类族的能力',
    '能用向上/向下转型与 instanceof 安全地处理对象数组',
    '能判断什么时候该用继承、什么时候该用组合，并说出理由'
  ],
  kp: [
    { id: 'ch08-1', title: '继承 extends 与 super' },
    { id: 'ch08-2', title: '方法重写与 @Override' },
    { id: 'ch08-3', title: '多态与动态派发' },
    { id: 'ch08-4', title: '向上转型与 instanceof' },
    { id: 'ch08-5', title: '抽象类与抽象方法' },
    { id: 'ch08-6', title: '接口初探' },
    { id: 'ch08-7', title: '模板方法' },
    { id: 'ch08-8', title: '继承 vs 组合的设计取舍' }
  ],
  blocks: [

    /* ---------------------------------------------------------------- 开篇 */
    { t: 'callout', kind: 'why', html:
      '先看下面这段程序：三种动物，靠 <code>if / else</code> 加 <code>instanceof</code> 判断类型，再决定打印什么。' +
      '它能跑、输出也对，但结构很脆：新增一种 <code>Bird</code>，就要回头改 <code>speak()</code>；' +
      '如果程序里还有 <code>feed()</code>、<code>move()</code> 好几个分派点，每加一种动物就要改好几处，' +
      '漏掉任何一处就是 bug。<br>' +
      '这一章的两件武器解决它：<b>继承（inheritance）</b>把共同部分上提、复用代码；' +
      '<b>多态（polymorphism）</b>让调用方只认父类，新增子类时一行都不用改。' +
      '最后用<b>抽象类</b>与<b>接口</b>把"子类必须实现什么"变成编译器的强制约束。'
    },

    { t: 'p', lead: true, html:
      '继承解决"重复"，多态解决"选择"。学会这两件事，你写的就不再是一堆方法，而是一套能生长的结构。'
    },

    { t: 'code', caption: 'SwitchPain.java —— 用类型判断做分派：能跑，但每加一种类型都要改这里', code: `class Animal {
    private String name;

    Animal(String name) { this.name = name; }
    String getName() { return name; }
}

class Dog extends Animal {
    Dog(String name) { super(name); }
}

class Cat extends Animal {
    Cat(String name) { super(name); }
}

public class SwitchPain {
    // 每种动物一个分支：新增类型就要回来改这里
    static void speak(Animal a) {
        if (a instanceof Dog) {
            System.out.println(a.getName() + " barks");
        } else if (a instanceof Cat) {
            System.out.println(a.getName() + " meows");
        } else {
            System.out.println(a.getName() + " makes a sound");
        }
    }

    public static void main(String[] args) {
        Animal[] zoo = { new Dog("Rex"), new Cat("Tom"), new Animal("Ghost") };
        for (Animal a : zoo) {
            speak(a);
        }
    }
}
` },

    { t: 'p', html:
      '仔细看 <code>speak()</code>：它必须知道所有子类的存在，每加一种动物就要多一个分支。' +
      '更糟的是行为分散在调用方，而不是跟随类型——<code>Dog</code> 怎么叫，写在 <code>SwitchPain</code> 里，' +
      '而不是写在 <code>Dog</code> 自己身上。' +
      '继承的第一个作用就是让行为回到类型内部：<code>Dog</code> 自己声明 <code>speak()</code>，' +
      '调用方只写 <code>a.speak()</code>，不需要知道 <code>a</code> 到底是什么。'
    },

    { t: 'p', html:
      '本章路线：先建立继承关系并搞清楚 <code>super</code> 与构造顺序（一），再学重写与 <code>@Override</code>（二）；' +
      '接着是本章的核心机制——多态与动态派发（三），以及配套的转型与<code>instanceof</code>（四）；' +
      '然后用抽象类（五）和接口（六）规定契约，用模板方法（七）把流程固定下来；' +
      '最后讨论"继承 vs 组合"这个设计取舍（八），并用三个调试实录和两个完整案例收束。'
    },

    /* ---------------------------------------------------------------- 一 */
    { t: 'h', text: '一、继承：extends 与 super', id: 'ch08-1' },

    { t: 'p', html:
      '<code>class Dog extends Animal</code> 读作 <b>Dog is-a Animal</b>（狗是一种动物）。' +
      '被继承的类叫<b>父类（superclass）</b>，继承的类叫<b>子类（subclass）</b>。' +
      '子类自动获得父类可访问的字段和方法，并且可以增加自己的内容或改写父类的行为。' +
      '所有类最终都继承自 <code>Object</code>（<code>toString</code>、<code>equals</code> 就来自那里）。'
    },

    { t: 'svg', maxW: 640, caption: '继承是 is-a 层次：Object 是根，Animal 是共同部分，Dog 与 Cat 各自补充。', html:
`<svg viewBox="0 0 660 300" role="img" aria-label="继承层次图">
  <rect x="240" y="20" width="180" height="44" rx="6" fill="var(--surface2)" stroke="var(--line2)"/>
  <text x="330" y="47" font-size="12" text-anchor="middle" fill="var(--text2)">Object</text>
  <rect x="240" y="92" width="180" height="60" rx="6" fill="var(--bg2)" stroke="var(--accent)"/>
  <text x="330" y="116" font-size="13" text-anchor="middle" fill="var(--accent)">Animal</text>
  <text x="330" y="138" font-size="11" text-anchor="middle" fill="var(--text3)">name / getName / speak</text>
  <rect x="80" y="192" width="160" height="56" rx="6" fill="var(--bg2)" stroke="var(--accent2)"/>
  <text x="160" y="216" font-size="13" text-anchor="middle" fill="var(--accent2)">Dog</text>
  <text x="160" y="236" font-size="11" text-anchor="middle" fill="var(--text3)">speak → barks</text>
  <rect x="420" y="192" width="160" height="56" rx="6" fill="var(--bg2)" stroke="var(--accent2)"/>
  <text x="500" y="216" font-size="13" text-anchor="middle" fill="var(--accent2)">Cat</text>
  <text x="500" y="236" font-size="11" text-anchor="middle" fill="var(--text3)">speak → meows</text>
  <line x1="330" y1="64" x2="330" y2="86" stroke="var(--line2)" stroke-width="1.4"/>
  <line x1="300" y1="152" x2="200" y2="186" stroke="var(--line2)" stroke-width="1.4"/>
  <line x1="360" y1="152" x2="460" y2="186" stroke="var(--line2)" stroke-width="1.4"/>
  <text x="20" y="276" font-size="12" fill="var(--text2)">子类继承父类的成员，并可以重写方法；is-a 关系是继承成立的前提。</text>
</svg>`
    },

    { t: 'code', caption: 'AnimalDemo.java —— 子类构造器第一行调用 super', code: `class Animal {
    private String name;

    Animal(String name) {
        this.name = name;
    }

    String getName() { return name; }

    void speak() {
        System.out.println(getName() + " makes a sound");
    }
}

class Dog extends Animal {
    Dog(String name) {
        super(name);              // 调用父类构造器，必须是第一条语句
    }

    @Override
    void speak() {
        System.out.println(getName() + " barks");
        super.speak();            // 还能调用父类版本
    }
}

public class AnimalDemo {
    public static void main(String[] args) {
        Dog d = new Dog("Rex");
        d.speak();
    }
}
` },

    { t: 'p', html:
      '继承有两层意义，别只看到第一层：<b>复用</b>——子类不用重写 <code>getName()</code> 就得到了它；' +
      '<b>替换</b>——子类可以给 <code>speak()</code> 换一份实现，而调用方不用改。' +
      '只想要复用时，继承往往不是好选择（后面第八节会讲）；只有在"子类确实是一种父类、且需要被当成父类使用"时，' +
      '继承的两层意义才同时成立。'
    },

    { t: 'p', html:
      '<code>Dog</code> 的构造器第一行是 <code>super(name)</code>：把名字交给父类去保存，' +
      '因为 <code>name</code> 是父类的私有字段，子类不能直接赋值。' +
      '调用 <code>d.speak()</code> 时执行的是 <code>Dog</code> 的版本（先打印 barks），' +
      '而其中的 <code>super.speak()</code> 又调用了父类版本——重写不等于父类的实现消失了。'
    },

    { t: 'code', caption: 'ConstructorChain.java —— 构造器执行顺序：先父后子', code: `class A {
    private int x = 10;                  // 字段初始化：在本类构造器体执行之前完成

    A() {
        System.out.println("A() x=" + x);
    }
}

class B extends A {
    private int y = 20;                  // 子类字段初始化：要等 super() 返回之后

    B() {
        super();                         // 第一条语句：先把父类那部分建好
        System.out.println("B() y=" + y);
    }
}

public class ConstructorChain {
    public static void main(String[] args) {
        B b = new B();
        System.out.println("done");
    }
}
` },

    { t: 'callout', kind: 'warn', title: '构造器不继承，执行顺序是"先父后子"', html:
      '子类构造器的第一条语句必须是 <code>super(...)</code>；不写，编译器会自动插入无参的 <code>super()</code>。' +
      '如果父类<b>只</b>提供了带参构造器，子类就必须显式写 <code>super(args)</code>，否则编译错误。' +
      '创建子类对象时：父类字段初始化 → 父类构造器 → 子类字段初始化 → 子类构造器。' +
      '这也是为什么在构造器里调用可重写方法是危险的设计——那时子类字段可能还没初始化。'
    },

    { t: 'keypoint', items: [
      { title: '检查点 · is-a', html: '能判断一段继承关系是否符合 is-a；能写出 <code>class B extends A</code> 并调用 <code>super(...)</code>。' },
      { title: '检查点 · 顺序', html: '能说出创建子类对象时字段初始化与两个构造器的执行顺序。' }
    ] },

    /* ---------------------------------------------------------------- 二 */
    { t: 'h', text: '二、方法重写与 @Override', id: 'ch08-2' },

    { t: 'p', html:
      '子类写一个与父类<b>同名、同参数列表、同返回类型</b>（或更具体的子类型）的方法，叫<b>重写（override）</b>。' +
      '重写之后，通过子类对象调用得到子类版本；想同时执行父类版本，用 <code>super.方法名()</code>。' +
      '<code>@Override</code> 注解不是语法必需，但它让编译器帮你检查签名——拼错字母会立刻报错，' +
      '而不是悄悄变成"另一个新方法"，这是本章第 2 个调试实录的坑。'
    },

    { t: 'table',
      head: ['', '重载 overload（ch06）', '重写 override（本章）'],
      rows: [
        ['位置', '同一个类里（或子类新增不同签名）', '子类重写父类的方法'],
        ['要求', '方法名相同，参数列表不同', '方法名、参数列表、返回类型都兼容'],
        ['决定时机', '<b>编译期</b>按实参挑选', '<b>运行期</b>按对象真实类型挑选'],
        ['关键词', '没有', '<code>@Override</code>（建议总是写）']
      ],
      caption: '这两个概念是选择题的固定考点，务必分清"编译期"与"运行期"' },

    { t: 'code', caption: 'OverrideRules.java —— 重写、重载、静态方法隐藏同时出现', code: `class Base {
    void hello() { System.out.println("Base.hello"); }

    void hello(String who) {                 // 重载：参数不同
        System.out.println("Base.hello " + who);
    }

    static void info() { System.out.println("Base.info"); }
}

class Derived extends Base {
    @Override
    void hello() {                           // 重写：签名完全相同
        System.out.println("Derived.hello");
    }

    void hello(int n) {                      // 这是重载，不是重写
        System.out.println("Derived.hello int " + n);
    }

    static void info() {                     // 静态方法被隐藏，不参与动态派发
        System.out.println("Derived.info");
    }
}

public class OverrideRules {
    public static void main(String[] args) {
        Base b = new Derived();              // 向上转型
        b.hello();                           // Derived.hello：按对象真实类型派发
        b.hello("Bob");                      // Base.hello Bob：重载按声明类型 Base 选

        Derived d = new Derived();
        d.hello("Bob");                      // Base.hello Bob：Derived 没重写带参版本
        d.hello(3);                          // Derived.hello int 3

        Base.info();                         // Base.info：静态方法看声明类型
        Derived.info();                      // Derived.info
    }
}
` },

    { t: 'p', html:
      '输出六行，每一行都能对应一条规则。① <code>b.hello()</code> 打印 <code>Derived.hello</code>：' +
      '<code>hello()</code> 被重写，运行期按真实类型 <code>Derived</code> 派发。' +
      '② <code>b.hello("Bob")</code> 打印 <code>Base.hello Bob</code>：<code>Derived</code> 没有重写带参版本，' +
      '重载在编译期就按声明类型 <code>Base</code> 选定了方法。' +
      '③ <code>d.hello(3)</code> 打印子类的新重载——参数列表不同就是新方法，不是重写。' +
      '④ <code>Base.info()</code> 与 <code>Derived.info()</code> 各打各的：静态方法按声明类型调用，' +
      '子类的静态方法只是<b>隐藏</b>了父类版本，不参与动态派发。'
    },

    { t: 'compare', left: {
      title: '重载 overload：同一个类里的多个版本',
      html: '方法名相同、<b>参数列表不同</b>（类型、个数或顺序）。调用哪个版本在<b>编译期</b>就由实参类型决定，与返回值无关。',
      code: 'max(3, 7);              // 挑 max(int, int)\nmax(1.5, 2.5);          // 挑 max(double, double)\nmax(1, 2, 3);           // 挑三参数版本'
    }, right: {
      title: '重写 override：子类替换父类的实现',
      html: '方法名、参数列表、返回类型都兼容。执行哪个版本在<b>运行期</b>由对象真实类型决定——这就是多态。',
      code: 'Animal a = new Dog("Rex");\na.speak();              // 运行期派发：执行 Dog 的 speak'
    } },

    { t: 'callout', kind: 'warn', title: '@Override 是免费的签名检查', html:
      '只有返回类型不同<b>不构成重载</b>，会报"方法已定义"；而重写时把参数写错一个字符，就变成了重载而不是重写。' +
      '<code>@Override</code> 会在编译期核对父类是否真有这个方法，写错立刻报错。' +
      '另外两条边界：<code>private</code> 方法不能重写（子类看不见）；<code>static</code> 方法不能被重写，只能被隐藏。' +
      '重写时访问权限不能变严（父类 public，子类不能改成 private）。'
    },

    { t: 'keypoint', items: [
      { title: '检查点 · 重写 vs 重载', html: '能看签名判断是重写还是重载，并说出分别在编译期还是运行期决定。' },
      { title: '检查点 · @Override', html: '能解释这个注解为什么值得写，以及它能抓住哪类错误。' }
    ] },

    /* ---------------------------------------------------------------- 三 */
    { t: 'h', text: '三、多态：一个调用点，多种行为', id: 'ch08-3' },

    { t: 'p', html:
      '<b>多态（polymorphism）</b>：父类引用可以指向子类对象（这叫<b>向上转型（upcasting）</b>，自动且安全），' +
      '调用被重写的方法时，实际执行哪个版本由<b>运行时对象的真实类型</b>决定，而不是由变量的声明类型决定。' +
      '这个机制叫<b>动态派发（dynamic dispatch）</b>。' +
      '为什么这样设计：调用方写 <code>speak(Animal a)</code> 就够了，不需要知道具体是哪只动物；' +
      '以后新增任何 <code>Animal</code> 子类，这个方法一行都不用改——变化被隔离在新增的类里。'
    },

    { t: 'svg', maxW: 660, caption: '动态派发：变量 a 的声明类型是 Animal（决定"能调什么"），真实对象是 Dog（决定"执行哪份实现"）。', html:
`<svg viewBox="0 0 680 290" role="img" aria-label="编译看左边 运行看右边">
  <defs>
    <marker id="ch08-arw1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
      <path d="M0,0 L10,5 L0,10 z" fill="var(--accent2)"/>
    </marker>
  </defs>
  <rect x="24" y="40" width="230" height="70" rx="8" fill="var(--bg2)" stroke="var(--accent)"/>
  <text x="40" y="66" font-size="11" fill="var(--text3)">编译期（左边）</text>
  <text x="40" y="92" font-size="13" fill="var(--text2)">Animal a</text>
  <text x="40" y="114" font-size="11" fill="var(--text3)">Animal 里必须有 speak()</text>

  <rect x="24" y="150" width="230" height="70" rx="8" fill="var(--bg2)" stroke="var(--accent2)"/>
  <text x="40" y="176" font-size="11" fill="var(--text3)">运行期（右边）</text>
  <text x="40" y="202" font-size="13" fill="var(--text2)">a → new Dog("Rex")</text>
  <text x="40" y="224" font-size="11" fill="var(--text3)">真实类型 Dog</text>

  <line x1="150" y1="110" x2="150" y2="146" stroke="var(--accent2)" stroke-width="1.5" marker-end="url(#ch08-arw1)"/>

  <rect x="330" y="36" width="160" height="60" rx="6" fill="var(--surface2)" stroke="var(--line2)"/>
  <text x="410" y="60" font-size="12" text-anchor="middle" fill="var(--text2)">Animal.speak()</text>
  <text x="410" y="82" font-size="10" text-anchor="middle" fill="var(--text3)">makes a sound</text>
  <rect x="330" y="140" width="160" height="60" rx="6" fill="var(--surface2)" stroke="var(--accent2)"/>
  <text x="410" y="164" font-size="12" text-anchor="middle" fill="var(--accent2)">Dog.speak()</text>
  <text x="410" y="186" font-size="10" text-anchor="middle" fill="var(--text3)">barks ← 实际执行</text>

  <path d="M254 185 C 290 185, 300 170, 326 170" fill="none" stroke="var(--accent2)" stroke-width="1.8" marker-end="url(#ch08-arw1)"/>
  <text x="530" y="100" font-size="12" fill="var(--text2)">编译看左边：</text>
  <text x="530" y="120" font-size="11" fill="var(--text3)">能不能调用这个方</text>
  <text x="530" y="138" font-size="11" fill="var(--text3)">法，由声明类型决定</text>
  <text x="530" y="176" font-size="12" fill="var(--text2)">运行看右边：</text>
  <text x="530" y="196" font-size="11" fill="var(--text3)">执行哪份实现，由</text>
  <text x="530" y="214" font-size="11" fill="var(--text3)">真实对象决定</text>
  <text x="24" y="264" font-size="12" fill="var(--text2)">同一个 a.speak() 调用点，因为 a 指向的对象不同，执行的方法体不同。</text>
</svg>`
    },

    { t: 'code', caption: 'Dispatch.java —— 点「单步」，看三次调用进入不同的方法体', trace: true, code: `class Animal {
    private String name;
    Animal(String name) { this.name = name; }
    String getName() { return name; }
    void speak() { System.out.println(getName() + " makes a sound"); }
}

class Dog extends Animal {
    Dog(String name) { super(name); }
    @Override
    void speak() { System.out.println(getName() + " barks"); }
}

class Cat extends Animal {
    Cat(String name) { super(name); }
    @Override
    void speak() { System.out.println(getName() + " meows"); }
}

public class Dispatch {
    static void speak(Animal a) {
        a.speak();          // 编译看 Animal，运行看真实对象
    }

    public static void main(String[] args) {
        speak(new Dog("Rex"));
        speak(new Cat("Tom"));
        speak(new Animal("Ghost"));
    }
}
` },

    { t: 'callout', kind: 'tip', title: '一句话记住多态', html:
      '<b>编译看左边，运行看右边。</b>左边的声明类型决定"能不能调用这个方法"（父类里必须有），' +
      '右边的对象类型决定"实际执行哪个实现"。单步时你会看到：三次都先进入 <code>speak(Animal)</code>，' +
      '但下一行跳进的 <code>speak</code> 方法体不同——Dog、Cat、Animal 各一份。'
    },

    { t: 'p', html:
      '多态带来的不只是少写几个 <code>if</code>，而是<b>可替换性（substitutability）</b>：' +
      '一段按 <code>Animal</code> 写的代码，可以接受任何合格的子类，不需要修改。' +
      '这正是第 10 章集合、第 11 章排序能通吃各种类型的基础——' +
      '排序方法只要求元素能比较大小（<code>Comparable</code> 接口），不关心它到底是什么类。' +
      '反过来说，如果你的代码里到处是 <code>instanceof</code> 分支，通常说明"该写成方法的地方写成了判断"：' +
      '把差异交给子类的重写方法，比在调用方枚举类型更耐改。'
    },

    { t: 'keypoint', items: [
      { title: '检查点 · 一句话', html: '能解释"编译看左边、运行看右边"，并预测三次 <code>speak</code> 调用的输出。' },
      { title: '检查点 · 好处', html: '能说出多态为什么让"新增子类不用改调用方"。' }
    ] },

    /* ---------------------------------------------------------------- 四 */
    { t: 'h', text: '四、向上转型与 instanceof', id: 'ch08-4' },

    { t: 'p', html:
      '把子类对象赋给父类变量是<b>向上转型（upcasting）</b>，自动完成、永远安全。' +
      '反过来把父类引用转回子类是<b>向下转型（downcasting）</b>，必须显式强转，而且在运行时检查：' +
      '类型不匹配会抛 <code>ClassCastException</code>。标准做法是先用 <code>instanceof</code> 判断，再强转。' +
      '为什么需要它：多态让父类引用"只看得到父类的方法"，想调用子类独有方法时，必须先确认并转型。'
    },

    { t: 'code', caption: 'Casting.java —— instanceof 判断后再向下转型', code: `class Animal {
    private String name;
    Animal(String name) { this.name = name; }
    String getName() { return name; }
    void speak() { System.out.println(getName() + " makes a sound"); }
}

class Dog extends Animal {
    Dog(String name) { super(name); }
    @Override
    void speak() { System.out.println(getName() + " barks"); }
    void fetch() { System.out.println(getName() + " fetches the ball"); }
}

class Cat extends Animal {
    Cat(String name) { super(name); }
    @Override
    void speak() { System.out.println(getName() + " meows"); }
}

public class Casting {
    static void play(Animal a) {
        a.speak();
        if (a instanceof Dog) {
            Dog d = (Dog) a;      // 确认过才向下转型
            d.fetch();
        } else {
            System.out.println(a.getName() + " ignores you");
        }
    }

    public static void main(String[] args) {
        play(new Dog("Rex"));
        play(new Cat("Tom"));
    }
}
` },

    { t: 'callout', kind: 'warn', title: '父类引用调不到子类独有方法', html:
      '<code>Animal a = new Dog("Rex"); a.fetch();</code> 编译失败——<code>Animal</code> 里没有 <code>fetch</code>。' +
      '编译期只按声明类型检查方法是否存在。这不是 bug，而是多态的代价：想要子类能力，就得 <code>instanceof</code> + 强转。' +
      '另外 <code>a instanceof Dog</code> 在 <code>a</code> 为 <code>null</code> 时返回 <code>false</code>，不会抛空指针。'
    },

    { t: 'keypoint', items: [
      { title: '检查点 · 转型方向', html: '能说出哪边自动、哪边必须强转，以及类型不匹配时抛什么异常。' },
      { title: '检查点 · 安全模式', html: '能写出 <code>if (a instanceof Dog) { Dog d = (Dog) a; ... }</code> 的标准模板。' }
    ] },

    /* ---------------------------------------------------------------- 五 */
    { t: 'h', text: '五、抽象类：只规定，不实现', id: 'ch08-5' },

    { t: 'p', html:
      '前面用过的父类 <code>Animal</code> 的 <code>speak</code> 实现其实很尴尬：' +
      '"动物发出声音"这种默认实现对谁都不准确，但子类忘了重写也不会报错。' +
      '<b>抽象类（abstract class）</b>用 <code>abstract</code> 标记：<b>不能 new</b>，只能被继承；' +
      '<b>抽象方法（abstract method）</b>只写签名、不写方法体，子类<b>必须</b>实现，否则子类也得声明成抽象类。' +
      '这就是"为什么这样设计"：把"必须实现"从口头约定变成<b>编译器的强制约束</b>，同时避免一个被误用的默认实现。'
    },

    { t: 'code', caption: 'ShapeDemo.java —— 抽象类 + 对象数组 + 动态派发', code: `abstract class Shape {
    private String name;

    Shape(String name) { this.name = name; }
    String getName() { return name; }

    abstract double area();       // 只有签名，没有方法体

    public String toString() {
        return name + " area=" + String.format("%.2f", area());
    }
}

class Circle extends Shape {
    private double r;
    Circle(double r) { super("circle"); this.r = r; }
    @Override
    double area() { return Math.PI * r * r; }
}

class Rectangle extends Shape {
    private double w;
    private double h;
    Rectangle(double w, double h) { super("rect"); this.w = w; this.h = h; }
    @Override
    double area() { return w * h; }
}

public class ShapeDemo {
    public static void main(String[] args) {
        Shape[] shapes = { new Circle(1.5), new Rectangle(2, 3) };
        double total = 0;
        for (Shape s : shapes) {
            System.out.println(s);    // toString 里调用 area()，也是动态派发
            total += s.area();
        }
        System.out.printf("total = %.2f%n", total);
    }
}
` },

    { t: 'code', caption: 'AbstractTrap.java —— 两处故意的编译错误（实例化抽象类、子类漏实现）', code: `abstract class Shape {
    abstract double area();          // 只规定，不实现
}

class Square extends Shape {
    private double side;

    Square(double side) { this.side = side; }

    // 这里没写 area()：Square 必须声明为 abstract，否则编译错误
}

public class AbstractTrap {
    public static void main(String[] args) {
        Shape s = new Shape();       // 编译错误：抽象类不能实例化
        System.out.println(s.area());
    }
}
` },

    { t: 'callout', kind: 'warn', title: 'abstract 的三条规则', html:
      '① 抽象类<b>不能实例化</b>（<code>new Shape(...)</code> 编译错误）；② 抽象类<b>可以有构造器</b>（供子类 ' +
      '<code>super</code> 调用）和普通方法、字段；③ <code>abstract</code> 与 <code>final</code> 互斥——' +
      'final 禁止继承，abstract 要求必须被继承。子类若没实现全部抽象方法，自己也得声明为 abstract。' +
      '抽象类里也可以有"已实现的方法"，比如 <code>Shape</code> 的 <code>toString</code>，它们照常继承。'
    },

    { t: 'p', html:
      '抽象类和"普通的父类"只差一件事：<b>敢不敢让子类漏实现</b>。普通父类给一个默认实现，子类不重写也能跑，' +
      '出了错往往要等运行时才发现；抽象类把"必须实现"交给编译器，漏一天都编译不过。' +
      '所以只要父类的某个行为"没有合理默认值"，就应该把它声明成抽象方法，而不是写一个勉强能用的实现。' +
      '这个判断在考试的设计题里也常考：给一个类名和几个行为，问哪些方法该抽象。'
    },

    { t: 'keypoint', items: [
      { title: '检查点 · 能不能 new', html: '看到 <code>new</code> 抽象类或子类漏实现抽象方法，能立刻指出编译错误。' },
      { title: '检查点 · 为什么', html: '能说出抽象类相对"默认实现"的优势：强制子类实现，避免误用父类默认行为。' }
    ] },

    /* ---------------------------------------------------------------- 六 */
    { t: 'h', text: '六、接口：能力契约', id: 'ch08-6' },

    { t: 'p', html:
      '<b>接口（interface）</b>是比抽象类更纯粹的"契约"：只规定必须提供哪些方法，不保存实例状态。' +
      '类用 <code>implements</code> 声明实现接口，实现的方法必须都是 <code>public</code>（接口方法默认就是 public abstract）。' +
      '为什么需要它：Java 的类只能 <code>extends</code> 一个父类，但可以 <code>implements</code> 多个接口。' +
      '当一种能力要跨越不同的类族（钢琴和鼓不是同一种乐器族系，但都能演奏），就抽成接口。' +
      '标准库里 <code>Comparable</code>、<code>List</code> 都是接口。'
    },

    { t: 'code', caption: 'InterfaceDemo.java —— 不同类族共享一种能力', code: `interface Playable {
    void play();                  // 接口方法默认是 public abstract
}

class Piano implements Playable {
    public void play() { System.out.println("piano: ding"); }
}

class Drum implements Playable {
    public void play() { System.out.println("drum: boom"); }
}

public class InterfaceDemo {
    static void perform(Playable p) {
        p.play();                 // 面向接口编程，不关心具体类
    }

    public static void main(String[] args) {
        perform(new Piano());
        perform(new Drum());
    }
}
` },

    { t: 'table',
      head: ['', '抽象类 abstract class', '接口 interface'],
      rows: [
        ['表达', 'is-a：是一类东西', 'can-do：具备一种能力'],
        ['状态', '可以有字段、构造器、部分实现', '不保存实例状态（只有常量）'],
        ['继承数量', '一个类只能 extends 一个', '一个类可以 implements 多个'],
        ['什么时候用', '共享代码 + 共同状态', '跨类族共享能力、规定契约']
      ],
      caption: '两者都能实现多态；现代 Java 里"优先接口、少用继承"是常见风格' },

    { t: 'p', html:
      '这也是一个设计取舍：<b>抽象类表达"是什么"，接口表达"能做什么"</b>。' +
      '如果几个类共享字段和已实现的逻辑，用抽象类；如果只是共享一组能力、且这些类本来没有亲缘关系，用接口。' +
      '接口的代价是：它不能帮你保存状态，所有实现都得自己写；好处是一个类能同时具备多种能力，' +
      '而且调用方只依赖接口，替换实现时不用改代码。'
    },

    { t: 'keypoint', items: [
      { title: '检查点 · implements', html: '能把一个类声明为实现接口，并把接口方法写成 <code>public</code>。' },
      { title: '检查点 · 选型', html: '能给一个场景选抽象类或接口，并说出理由。' }
    ] },

    /* ---------------------------------------------------------------- 七 */
    { t: 'h', text: '七、模板方法：父类定流程，子类填细节', id: 'ch08-7' },

    { t: 'p', html:
      '<b>模板方法（template method）</b>是继承的经典用法：父类把算法的<b>骨架</b>写死' +
      '（通常声明为 <code>final</code>，防止子类改顺序），把可变的步骤留成<b>抽象方法</b>，子类只填那一格。' +
      '为什么这样设计：流程不变、细节易变——把不变的部分固定下来，把变化的部分隔离到一个点，' +
      '新增一种实现只需再写一个子类。'
    },

    { t: 'code', caption: 'TemplateDemo.java —— final 骨架 + 抽象步骤', code: `abstract class Worker {
    private String name;

    Worker(String name) { this.name = name; }
    String getName() { return name; }

    abstract void work();               // 可变步骤：交给子类

    final void dailyRoutine() {         // 骨架固定，子类不能改
        System.out.println(getName() + " clocks in");
        work();
        System.out.println(getName() + " clocks out");
    }
}

class Programmer extends Worker {
    Programmer(String name) { super(name); }
    @Override
    void work() { System.out.println("  writes code"); }
}

class Designer extends Worker {
    Designer(String name) { super(name); }
    @Override
    void work() { System.out.println("  draws mockups"); }
}

public class TemplateDemo {
    public static void main(String[] args) {
        Worker a = new Programmer("Alice");
        Worker b = new Designer("Bob");
        a.dailyRoutine();
        b.dailyRoutine();
    }
}
` },

    { t: 'p', html:
      '模板方法的取舍在于"控制权"：父类掌握流程，子类只被允许填一个洞。' +
      '这能防止子类把顺序搞乱，也意味着流程一改，所有子类都受影响——这正是继承耦合的体现。' +
      '如果流程本身也要允许替换，模板方法就不合适了，应该把流程也变成可注入的对象（组合）。' +
      '第 11 章的排序、第 10 章的集合遍历都用到了这个思路：算法框架固定，比较规则由你提供。'
    },

    { t: 'keypoint', items: [
      { title: '检查点 · 骨架', html: '能写出"final 方法 + abstract 步骤"的模板方法，并说出 <code>final</code> 的作用。' },
      { title: '检查点 · 代价', html: '能说出模板方法把什么固定了、什么留给子类，以及它的耦合代价。' }
    ] },

    /* ---------------------------------------------------------------- 八 */
    { t: 'h', text: '八、继承 vs 组合：设计取舍', id: 'ch08-8' },

    { t: 'p', html:
      '继承是<b>强耦合</b>：子类依赖父类的实现细节，父类一改，所有子类都可能受影响，层次越深越难懂。' +
      '而且继承关系在编译期就固定了，运行期不能换。判断标准是 is-a：<b>Dog is-a Animal</b> 可以继承；' +
      '但 <b>Car is-a Engine</b> 显然错了——车是"有"一个引擎（<b>has-a</b>），应该用<b>组合（composition）</b>：' +
      '把另一个对象作为字段。'
    },

    { t: 'code', caption: 'CompositionDemo.java —— has-a 用组合', code: `class Engine {
    void start() { System.out.println("engine starts"); }
}

class Car {
    private Engine engine;        // has-a：组合，而不是 extends Engine

    Car() {
        this.engine = new Engine();
    }

    void start() {
        engine.start();
        System.out.println("car is ready");
    }
}

public class CompositionDemo {
    public static void main(String[] args) {
        Car c = new Car();
        c.start();
    }
}
` },

    { t: 'p', html:
      '<b>什么情况不该用继承？</b>① 只是想复用父类的代码，但两者并不是同一种东西；' +
      '② 父类的实现细节可能变化，子类却依赖了它们（"脆弱的基类"问题）；' +
      '③ 需要运行期切换行为——继承做不到，组合可以；' +
      '④ 需要同时具备多种能力——单继承满足不了，应该用接口。' +
      '经典反例：让 <code>Stack</code> 继承 <code>ArrayList</code>，会白得 <code>add</code>、<code>remove</code> 等方法，' +
      '栈"只能从顶进出"的语义瞬间被破坏。正确做法是组合：内部持有 list，只暴露 push/pop。'
    },

    { t: 'p', html:
      '工程上常用的原则是<b>组合优先（favor composition over inheritance）</b>：先问"has-a 能不能解决"，' +
      '确实需要 is-a 且父类为继承设计过（有文档、有钩子方法），再考虑 extends。' +
      '本课程里继承主要用于表达"确实是一类东西"的层次（形状、员工），而"可变的能力"用接口 + 组合表达。' +
      '这条取舍没有绝对对错，关键是能说出理由：<b>依赖的是"是一种"还是"有一个"</b>。'
    },

    { t: 'keypoint', items: [
      { title: '检查点 · is-a vs has-a', html: '能判断一个设计该用继承还是组合，并举出一个"错用继承"的反例。' },
      { title: '检查点 · 理由', html: '能说出继承的耦合代价，以及组合在运行期替换上的优势。' }
    ] },

    /* ---------------------------------------------------------------- 调试 */
    { t: 'h', text: '九、调试实录：三个真实 bug' },

    { t: 'p', html:
      '继承相关的 bug 有两类：一类编译不过（漏 <code>super</code>、抽象方法没实现），好查；' +
      '另一类能跑但输出不对，多半是"以为会调父类版本"或"以为会动态派发"。后者按三步法走：' +
      '<b>① 写下期望输出；② 标出每个对象的真实类型；③ 检查方法签名是否真的构成重写</b>。'
    },

    { t: 'steps', items: [
      { title: '症状：输出少了/多了一行', html: '先确认期望的每一行分别由谁负责打印，别急着改代码。' },
      { title: '定位：核对签名与真实类型', html: '在重写方法里打印一句标记，看它到底有没有被执行；参数列表差一个字符就不是重写。' },
      { title: '修复：@Override + super', html: '补上 <code>@Override</code> 让编译器检查；需要保留父类逻辑就显式调用 <code>super.m()</code>。' }
    ] },

    { t: 'h', lvl: 3, text: '案例 1：重写时漏了 super，父类那半句消失了' },

    { t: 'p', html:
      '<code>Dog.speak()</code> 只打印 <code>Rex barks</code>，少了父类的 <code>Rex makes a sound</code>。' +
      '程序员的本意是"在父类基础上补一句"，但重写是<b>完全替换</b>，不是叠加。' +
      '修复：在子类方法里先调 <code>super.speak()</code>，再打印自己的内容。'
    },

    { t: 'h', lvl: 3, text: '案例 2：想重写却写成重载，父类版本仍然执行' },

    { t: 'p', html:
      '<code>Cat</code> 里写的是 <code>void speak(String suffix)</code>，参数列表和父类的 <code>speak()</code> 不同，' +
      '于是它只是一个新重载，不是重写。用 <code>Animal</code> 引用调用 <code>tom.speak()</code> 时，' +
      '执行的仍是父类版本，输出 <code>Tom makes a sound</code>。' +
      '修复：签名改回 <code>void speak()</code> 并加 <code>@Override</code>，编译器会立刻确认它确实重写了父类方法。'
    },

    { t: 'h', lvl: 3, text: '案例 3：类型判断写错，该走的分支被跳过' },

    { t: 'p', html:
      '<code>playBad</code> 里判断的是 <code>a instanceof Cat</code>，把 Dog 归到了"忽略"分支，' +
      '所以打印 <code>Rex ignores you</code>，而不是执行 <code>fetch()</code>。' +
      '修复：判断改成 <code>a instanceof Dog</code>，并在强转前完成判断——顺序错了要么编译不过，要么运行时抛 ' +
      '<code>ClassCastException</code>。'
    },

    { t: 'code', caption: 'InheritDebug.java —— 三个 bug 的表现与修复对照', code: `// 三个"能编译、输出不对"的继承 bug
class Animal {
    private String name;

    Animal(String name) { this.name = name; }
    String getName() { return name; }

    void speak() {
        System.out.println(name + " makes a sound");
    }
}

class Dog extends Animal {
    Dog(String name) { super(name); }

    @Override
    void speak() {
        // bug 1：想"在父类基础上加一行"，却完全替换了父类实现
        System.out.println(getName() + " barks");
    }

    void fetch() { System.out.println(getName() + " fetches the ball"); }
}

class Cat extends Animal {
    Cat(String name) { super(name); }

    // bug 2：想重写 speak()，签名却写成带参数 → 变成了重载，父类版本仍会执行
    void speak(String suffix) {
        System.out.println(getName() + " meows" + suffix);
    }
}

public class InheritDebug {
    // bug 3：类型判断写错，真正该走的 Dog 分支被跳过
    static void playBad(Animal a) {
        a.speak();
        if (a instanceof Cat) {
            System.out.println("  " + a.getName() + " is a cat");
        } else {
            System.out.println("  " + a.getName() + " ignores you");   // 狗反而被忽略
        }
    }

    // 修复：先判断 Dog 再转型，其余情况当作"不配合"
    static void playGood(Animal a) {
        a.speak();
        if (a instanceof Dog) {
            Dog d = (Dog) a;
            d.fetch();
        } else {
            System.out.println("  " + a.getName() + " ignores you");
        }
    }

    public static void main(String[] args) {
        Animal rex = new Dog("Rex");
        Animal tom = new Cat("Tom");

        playBad(rex);       // Rex barks + Rex ignores you（错，应该是 fetch）
        playGood(rex);      // Rex barks + Rex fetches the ball
        playGood(tom);      // Tom makes a sound + Tom ignores you（bug 2：meows 没执行）
    }
}
` },

    { t: 'keypoint', items: [
      { title: '检查点 · 三个 bug', html: '能说出每个 bug 属于"漏 super"、"假重写"还是"类型判断错"。' },
      { title: '检查点 · 流程', html: '遇到输出少一行/多一行，会先确认方法到底有没有被派发到。' }
    ] },

    /* ---------------------------------------------------------------- 案例 A */
    { t: 'h', text: '十、完整案例 A：工资单', id: 'ch08-9' },

    { t: 'p', html:
      '下面这份工资单把本章几乎全部概念用在一处：抽象类 <code>Employee</code> 规定契约、两个子类给出不同算法、' +
      '第三个子类额外实现 <code>Taxable</code> 接口、父类的 <code>line()</code> 是模板方法，' +
      '<code>main</code> 里用 <code>Employee[]</code> + 增强 for 做多态调用。' +
      '读之前先预测：<code>total</code> 是多少？哪几个员工需要交税？'
    },

    { t: 'code', caption: 'Payroll.java —— 抽象类 + 子类 + 接口 + 模板方法 + 多态数组', code: `abstract class Employee {
    private static int nextId = 1;           // 共享计数器
    private final String name;
    private final int id;

    Employee(String name) {
        this.name = name;
        this.id = nextId;
        nextId++;
    }

    String getName() { return name; }

    abstract double monthlyPay();            // 子类必须实现

    String role() { return "employee"; }     // 默认实现，子类可重写

    final String line() {                    // 模板方法：骨架固定
        return String.format("#%d %-7s %-10s %8.2f", id, name, role(), monthlyPay());
    }

    static int headcount() { return nextId - 1; }
}

class Salaried extends Employee {
    private final double salary;

    Salaried(String name, double salary) {
        super(name);
        this.salary = salary;
    }

    @Override
    double monthlyPay() { return salary; }

    @Override
    String role() { return "salaried"; }
}

class Hourly extends Employee {
    private final double rate;
    private final int hours;

    Hourly(String name, double rate, int hours) {
        super(name);
        this.rate = rate;
        this.hours = hours;
    }

    @Override
    double monthlyPay() { return rate * hours; }

    @Override
    String role() { return "hourly"; }
}

interface Taxable {
    double tax();                            // 接口方法默认 public abstract
}

class Contractor extends Employee implements Taxable {
    private final double contract;

    Contractor(String name, double contract) {
        super(name);
        this.contract = contract;
    }

    @Override
    double monthlyPay() { return contract; }

    @Override
    String role() { return "contractor"; }

    public double tax() { return contract * 0.1; }
}

public class Payroll {
    public static void main(String[] args) {
        Employee[] staff = new Employee[3];
        staff[0] = new Salaried("Alice", 8000);
        staff[1] = new Hourly("Bob", 50, 120);
        staff[2] = new Contractor("Carol", 6000);

        double total = 0;
        for (Employee e : staff) {
            System.out.println(e.line());     // 模板方法里调用多态的 monthlyPay
            total += e.monthlyPay();
        }
        System.out.printf("total = %.2f%n", total);

        for (Employee e : staff) {            // 只对"可纳税"的员工收税
            if (e instanceof Taxable) {
                Taxable t = (Taxable) e;
                System.out.printf("%s tax = %.2f%n", e.getName(), t.tax());
            }
        }
        System.out.println("headcount = " + Employee.headcount());
    }
}
` },

    { t: 'p', html:
      '输出六行，每行都能对上一条设计。① <code>line()</code> 是父类的 <code>final</code> 方法，流程（编号、姓名、角色、金额）固定，' +
      '但 <code>monthlyPay()</code> 是抽象方法，运行期派发到三个不同实现——这就是模板方法 + 多态的组合。' +
      '② <code>role()</code> 有默认实现，两个子类重写、一个用默认值，展示"可重写"与"必须实现"的区别。' +
      '③ 只有 <code>Contractor</code> 实现了 <code>Taxable</code>，所以收税循环用 <code>instanceof Taxable</code> ' +
      '筛出它再向下转型——接口让"跨类族的能力"可以这样查询。' +
      '④ <code>headcount()</code> 是 static 方法，读写的是共享计数器，与对象数量保持一致。'
    },

    /* ---------------------------------------------------------------- 案例 B */
    { t: 'h', text: '十一、完整案例 B：组合优于继承', id: 'ch08-10' },

    { t: 'p', html:
      '第二个案例是第一个案例的反面：这里<b>没有继承</b>，<code>Car</code> 通过持有 <code>Engine</code> 接口来获得动力，' +
      '于是换引擎只改一个字段，不新增子类。这就是"组合 + 接口"的写法：把变化的部分（引擎）抽成接口，' +
      '把不变的部分（车）与它组合起来。'
    },

    { t: 'code', caption: 'ComboDemo.java —— 运行期替换实现：组合 + 面向接口', code: `interface Engine {
    void start();                    // 能力契约：能启动
}

class ElectricEngine implements Engine {
    public void start() { System.out.println("electric motor hums"); }
}

class PetrolEngine implements Engine {
    public void start() { System.out.println("petrol engine roars"); }
}

class Car {
    private final String model;
    private Engine engine;           // 组合：has-a，而且面向接口

    Car(String model, Engine engine) {
        this.model = model;
        this.engine = engine;
    }

    void swapEngine(Engine engine) { // 组合的好处：运行期可替换
        this.engine = engine;
    }

    void start() {
        System.out.print(model + ": ");
        engine.start();
    }
}

public class ComboDemo {
    public static void main(String[] args) {
        Car c = new Car("Model S", new ElectricEngine());
        c.start();
        c.swapEngine(new PetrolEngine());   // 换引擎不改 Car 的代码
        c.start();

        Car d = new Car("Mini", new PetrolEngine());
        d.start();
    }
}
` },

    { t: 'p', html:
      '输出三行：电动车、换引擎后的同一辆车、汽油车。<code>swapEngine</code> 一行代码就完成了"换动力"，' +
      '而 <code>Car</code> 完全不需要知道 <code>ElectricEngine</code> 或 <code>PetrolEngine</code> 的存在。' +
      '如果用继承，<code>ElectricCar extends Car</code> 与 <code>PetrolCar extends Car</code> 会在编译期把动力锁死，' +
      '想换只能再造对象——这就是设计取舍里"组合在运行期可替换"的具体含义。' +
      '注意这里仍然用到了多态：<code>engine.start()</code> 是接口调用，运行期派发到具体引擎，' +
      '所以"组合 + 接口"并不是抛弃多态，而是把多态用在更合适的地方。'
    },

    /* ---------------------------------------------------------------- 收尾 */
    { t: 'h', text: '教材对照：§3.3 设计数据类型', id: 'ch08-book' },

{ t: 'table',
      head: ['设计原则', '教材的理由', '站内对应'],
      rows: [
        ['封装：字段 private', '客户端只依赖 API，实现可以整体替换——教材用 Complex 的笛卡尔/极坐标两种实现演示同一个 API', '本章「继承 vs 组合」；第 07 章「封装」'],
        ['不可变：字段 final', '值对象可以安全共享、能当符号表的键；改值返回新对象，不原地改', '第 07 章「不可变对象」；第 09 章的 equals'],
        ['接口：先定契约', '一个调用点适配多种实现——教材用 Function 接口 + plot/integrate 演示', '本章「接口」「模板方法」']
      ],
      caption: '教材的表述：设计数据类型是「为客户端服务」，不是「把字段装进类里」'
    },

{ t: 'code', caption: 'Vec2.java —— 教材「不可变值类型」：final 字段，plus / scale 都返回新对象', code:
`class Vec2 {
    private final double x, y;
    Vec2(double x, double y) { this.x = x; this.y = y; }
    Vec2 plus(Vec2 b) { return new Vec2(x + b.x, y + b.y); }
    Vec2 scale(double k) { return new Vec2(k * x, k * y); }
    public String toString() { return "(" + x + ", " + y + ")"; }
}

public class Q {
    public static void main(String[] args) {
        Vec2 v = new Vec2(1, 2);
        Vec2 w = v.plus(new Vec2(3, 4)).scale(2);
        System.out.println(v + " " + w);
        System.out.println(v == w);
    }
}
` },

    { t: 'p', html:
      "教材 §3.3 的开头一句很重：<b>能创建数据类型，每个程序员就成了语言设计者</b>。但设计不是先写类，而是先写客户端代码，从「用起来顺不顺」倒推 API。教材给出三条落地机制——封装、不可变、继承与接口，并点名两个坑：接口太宽、依赖内部表示。<br><br>教材的设计三问可以直接套到作业里：① <b>客户端需要哪些操作</b>？先写三行调用代码，写不顺就改 API。② <b>对象状态允不允许外部改</b>？会改就要 setter 加校验，不会改就 final。③ <b>变化应该返回新对象还是原地改</b>？值语义（复数、向量、日期）返回新对象，实体（账户、名单）原地改。<br><br>输出 <code>(1.0, 2.0) (8.0, 12.0)</code> 和 <code>false</code>。注意 <code>v</code> 从头到尾没变，<code>plus</code>、<code>scale</code> 每次都 <code>new</code> 一个结果——这就是不可变值类型，和 <code>String</code> 的行为一致。教材强调：不可变对象<b>天生线程安全、可以放心共享</b>，代价是频繁修改时会产生很多临时对象。<br><br>最后记住教材对「设计」的定义：<b>决定 API 和实现，并保证两者可以独立演化</b>。本章后面的继承、接口、组合，都是让「换实现不动客户端」这句话落地的手段。<br><br>教材 §3.3 末尾用「日期类」练习收束：<code>Date</code> 的 <code>month</code>、<code>day</code>、<code>year</code> 全 private，提供 <code>month()</code>、<code>day()</code>、<code>year()</code>、<code>isLeapYear()</code>、<code>nextDay()</code>、<code>toString()</code>；<code>nextDay()</code> 返回新的 <code>Date</code> 而不改原对象，这样「昨天的记录」不会被今天的操作悄悄改掉。教材把这种设计叫「不可变值类型 + 纯函数式更新」，和第 07 章的 <code>Song</code> 是同一个思路。<br><br>教材还特别强调：不可变类型一旦构造完就不能再改，所有「修改」都返回新对象；这让你可以放心把对象传给别的代码，不必担心被偷偷改掉。代价是每次修改都要新建对象，频繁修改的场景要权衡。"
    },

    { t: 'callout', kind: 'note', title: '教材的一个反例：接口太宽', html:
      "教材警告「宽接口」：方法越多，实现和维护成本越高，客户端还容易依赖细节。它给的原则是「provide to clients the methods they need and no others」。但接口也不能窄到让客户端绕过 API 直接摸字段——那是另一个极端。分寸感来自「客户端代码写起来是否自然」。<br><br>只有当子类「是一种」父类、并且能替换父类出现在任何客户端代码里（里氏替换）时才用 <code>extends</code>；只是想复用几个方法，用组合或静态工具类。教材把「为了省代码而继承」列为最常见的继承误用，因为父类一改，所有子类都被迫跟着改。"
    },

    { t: 'h', text: '即时练习' },

    { t: 'quiz', qid: 'ch08-q1' },
    { t: 'quiz', qid: 'ch08-q2' },
    { t: 'quiz', qid: 'ch08-q3' },

    { t: 'p', html: '想看清动态派发的每一步，打开「执行流程」实验台逐句执行；想画继承层次，`oop` 实验台能帮你把"参数 → 字段"的过程可视化。' },

    { t: 'lab', id: 'oop' },
    { t: 'lab', id: 'trace' },

    { t: 'callout', kind: 'exam', title: '这一章在考试里怎么考', html:
      'M2 卷面上这一章分量很重，四类题必刷：<br>' +
      '① <b>读程序问输出（M2 Q4，10 分）</b>：给一段抽象父类 + 两个子类 + 对象数组的代码，问四行输出；' +
      '第二小问直接问"循环里的 <code>s.area()</code> 是编译期还是运行期决定，解释原因"——标准答案是"运行期，动态派发，' +
      '看对象的真实类型"。<br>' +
      '② <b>选择题（M2 Q1）</b>：关于继承、抽象类、接口的说法判断，常考"抽象类能否有构造器""接口能否有多个实现"。<br>' +
      '③ <b>构造顺序题</b>：给父子构造器加打印，问输出顺序；记住"父字段 → 父构造器 → 子字段 → 子构造器"。<br>' +
      '④ <b>设计题</b>：给场景选继承、组合还是接口——is-a 用继承、has-a 用组合、跨类族能力用接口。<br>' +
      '<b>看到题先做什么</b>：给每个对象标真实类型（Dog / Cat / …），再逐行判断每个调用是"编译期按声明类型选"还是' +
      '"运行期按真实类型派发"。把重载（编译期）与重写（运行期）分开标，答案基本不会错。'
    },

    { t: 'keypoint', items: [
      { title: '继承', html: '<code>extends</code> 表达 is-a；子类构造器第一条语句 <code>super(...)</code>；执行顺序先父后子。' },
      { title: '重写', html: '子类同名、同参数、同返回类型地改写父类方法；<code>@Override</code> 让编译器检查；<code>super.m()</code> 调父类版本。' },
      { title: '重载 vs 重写', html: '重载按参数列表在编译期选；重写按真实类型在运行期派发；静态方法只隐藏、不重写。' },
      { title: '多态', html: '父类引用指向子类对象，动态派发：<b>编译看左边，运行看右边</b>。' },
      { title: '转型', html: '向上转型自动安全；向下转型要显式强转，先用 <code>instanceof</code> 判断。' },
      { title: '抽象类', html: '不能 new、可有构造器与部分实现；抽象方法强制子类实现。' },
      { title: '接口', html: '能力契约，不保存状态；一个类可 implements 多个，方法必须 public。' },
      { title: '设计', html: 'is-a 用继承、has-a 用组合；模板方法 = final 骨架 + abstract 步骤；优先接口与组合。' }
    ] },

    { t: 'checklist', id: 'ch08', items: [
      '我能写出一个父类和子类，并在子类构造器里正确调用 super(...)',
      '我能说出创建子类对象时父/子字段与构造器的执行顺序',
      '我能重写父类方法，用 @Override 标注，并用 super 调用父类版本',
      '我能区分重载与重写，并说出各自在编译期还是运行期决定',
      '我能解释为什么"编译看左边、运行看右边"',
      '我能判断一行父类引用调用子类方法的代码能否编译',
      '我能用 instanceof + 强转安全地向下转型',
      '我能说出抽象类与接口的三点区别和各自适用场景',
      '我能写出"final 骨架 + abstract 步骤"的模板方法',
      '我能判断一段设计该用继承还是组合，并说出理由'
    ] },

    { t: 'p', html:
      '<b>延伸阅读</b>：教材 Sedgewick《Computer Science: An Interdisciplinary Approach》第 3.3 节（Designing Data Types）' +
      '与第 3.4 节（Object-Oriented Programming）讲继承、接口与多态；站内第 09 章从内存角度讲引用与动态派发，' +
      '第 10 章的集合框架、第 11 章的 <code>Comparable</code> 排序都是本章接口思想的直接应用。' +
      '想练手可以到 <a href="#/quiz/ch08">题库 · ch08</a> 按章节筛选，或用首页的随机挑战抽题。'
    },

    { t: 'callout', kind: 'ai', title: 'AI 时代这样学', html:
      '这一章的代码让 AI 生成很容易看花眼，有效的练法是<b>让它出题、你来判断</b>：' +
      '① 让 AI 给一段多层继承 + 重写 + 重载的代码，问"输出是什么""哪一行不能编译"，你先写答案再跑本站验证；' +
      '② 给它一个真实场景，问"该用继承还是组合？"，让它先答，你再从 is-a / has-a、耦合、运行期替换三个角度反驳；' +
      '③ 让它解释"为什么静态方法不能重写"，再追问"那子类同名静态方法算什么"——答不上来说明它没分清隐藏与重写。<br>' +
      'AI 最爱错的是重载/重写与构造顺序，凡是涉及"编译期/运行期"的判断，都要自己用代码验证。'
    },

    { t: 'callout', kind: 'note', title: '覆盖范围与依据', html:
      '覆盖范围：继承、多态与抽象类：extends/super、重写与 @Override、动态派发、转型与 instanceof、抽象类、接口、模板方法、继承 vs 组合。<br>依据：Course Outline v5 的 Inheritance, Polymorphism, Abstract Classes 部分；Sedgewick §3.2–3.3。本站为个人整理的学习材料，与课程要求冲突时以老师和课程大纲为准；代码均在真实 JDK 上校验过。' }

  ]
});