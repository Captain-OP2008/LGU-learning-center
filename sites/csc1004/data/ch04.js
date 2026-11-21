/* =====================================================================
 * data/ch04.js · 第 04 章：继承、多态与接口（Inheritance, Polymorphism & Interfaces）
 * 职责：从「复制粘贴两个几乎一样的类」讲到继承：IS-A、extends、super 与构造器链、
 *       重写与 @Override、单/多级/层次继承、为什么不支持多继承（菱形歧义）、
 *       HAS-A 聚合、interface 契约、多态与动态派发、向上转型、instanceof、final。
 * 依据：CSC1004 lecture2（Java Inheritance）+ Tutorial 5 的类设计延续。
 * 内容块 schema 见 _dev/CONTRACT.md §4–§5；代码均可在站内引擎运行。
 * ===================================================================== */
CSC.registerChapter({
  id: 'ch04',
  num: '04',
  title: '继承、多态与接口',
  en: 'Inheritance, Polymorphism & Interfaces',
  goals: [
    '能用 extends 写出 IS-A 继承，并分清父类与子类的职责',
    '能用 super(...) 与 super.m() 调用父类构造器与方法，说清构造器链顺序',
    '能用 @Override 正确重写方法，并区分重写与重载',
    '能用 interface + implements 定义契约，并用父类引用调用子类实现（多态）',
    '能用 instanceof 安全向下转型，并说出 final 的三种用法'
  ],
  kp: [
    { id: 'ch04-1', title: '继承与 IS-A 关系' },
    { id: 'ch04-2', title: 'super 与构造器链' },
    { id: 'ch04-3', title: '方法重写与 @Override' },
    { id: 'ch04-4', title: '三种继承形态与多继承限制' },
    { id: 'ch04-5', title: 'HAS-A 聚合' },
    { id: 'ch04-6', title: 'interface 与 implements' },
    { id: 'ch04-7', title: '多态与动态派发' },
    { id: 'ch04-8', title: '向上转型、instanceof 与 final' }
  ],
  blocks: [

    /* ------------------------------------------------------------------ 开篇 */
    { t: 'callout', kind: 'why', html:
      '写 Gomoku 时，人类玩家和 AI 玩家各写一个类，落子流程几乎一样，只有「下一步下哪」不同；' +
      '写 Chat Zoom 时，服务器和客户端都要读消息、发消息，代码又抄了一遍。' +
      '复制粘贴能跑，但改一处就要改两处，漏一处就出 bug。<br>' +
      '讲义给出的解法是<b>继承（inheritance）</b>：让一个类<b>获得</b>另一个类的属性与行为，再只写自己独有的部分。' +
      '这一章从 IS-A 讲到多态与接口——它们是 Java 项目里出现频率最高的四个关键字（<code>extends</code>、' +
      '<code>super</code>、<code>@Override</code>、<code>implements</code>）背后的全部道理。'
    },

    { t: 'p', lead: true, html: '先看一个最小继承：<code>Dog</code> 什么都没写，就自动拥有了 <code>Animal</code> 的吃饭能力。' },

    { t: 'code', caption: 'InheritDemo.java · Dog extends Animal：继承 eat()，重写 speak()', run: true, code:
`public class InheritDemo {
    public static void main(String[] args) {
        Dog d = new Dog("Wang");
        d.eat();        // 继承自 Animal，一行没写
        d.speak();      // 重写后的版本
        System.out.println(d.getName());
    }
}

class Animal {
    private String name;

    Animal(String name) {
        this.name = name;
    }

    String getName() { return name; }

    void eat() {
        System.out.println(getName() + " is eating");
    }

    void speak() {
        System.out.println("...");
    }
}

class Dog extends Animal {
    Dog(String name) {
        super(name);        // 调用父类构造器
    }

    @Override
    void speak() {          // 重写：同名同参
        System.out.println(getName() + " barks");
    }
}
` },

    { t: 'p', html:
      '<code>Dog</code> 拥有 <code>eat()</code>、<code>speak()</code>、<code>getName()</code> 三个方法，其中两个直接继承自 ' +
      '<code>Animal</code>，只有 <code>speak()</code> 被重写。这就是继承的两大好处：<b>复用（reusability）</b>——父类的方法不用重写；' +
      '<b>扩展（addition）</b>——子类可以加自己的方法。父类 <code>Animal</code> 是<b>超类（superclass）</b>，' +
      '<code>Dog</code> 是<b>子类（subclass）</b>，两者是 <b>IS-A</b> 关系：一只狗<b>是</b>一种动物。'
    },

    { t: 'terms', cols: 2, items: [
      { en: 'inheritance', zh: '继承', html: '子类获得父类字段与方法，用 <code>extends</code> 声明。' },
      { en: 'superclass', zh: '父类/超类', html: '被继承的类；也叫 base class、parent class。' },
      { en: 'subclass', zh: '子类', html: '继承别人的类；也叫 derived class、child class。' },
      { en: 'override', zh: '重写', html: '子类提供与父类同名同参的新实现，用 <code>@Override</code> 标注。' },
      { en: 'polymorphism', zh: '多态', html: '同一个父类引用，运行时调用到不同子类的实现。' },
      { en: 'interface', zh: '接口', html: '一组抽象方法的契约，类用 <code>implements</code> 承诺实现。' }
    ] },

    /* ------------------------------------------------------------------ 一、IS-A */
    { t: 'h', text: '一、继承与 IS-A 关系', id: 'ch04-1' },

    { t: 'p', html:
      '讲义的定义：继承让一个对象<b>获得父类对象的全部属性与行为</b>，本质是「在已有类之上创建新类」。' +
      '关键字 <code>extends</code> 表示「扩展自」：<code>class Dog extends Animal</code> 读作「Dog 是一种 Animal」。' +
      '判断该不该用继承，就问一句 <b>IS-A</b>：狗是一种动物（成立，可以继承）；汽车是一种引擎（不成立，那是 HAS-A，用聚合）。' +
      '继承带来复用与扩展两个好处，也带来强耦合：父类改签名，所有子类跟着受影响，所以继承层级不要做太深。'
    },

    { t: 'table',
      head: ['术语', '讲义里的定义', '对应代码'],
      rows: [
        ['Class', 'a group of objects which have common properties，是模板', '<code>class Animal</code>'],
        ['Subclass', 'inherits the other class，也叫 derived class / child class', '<code>class Dog extends Animal</code>'],
        ['Superclass', 'the class from where a subclass inherits，也叫 base class', '<code>Animal</code>']
      ],
      caption: '三个必背术语：子类继承父类，父类提供可复用的字段与方法' },

    /* ------------------------------------------------------------------ 二、super */
    { t: 'h', text: '二、super 与构造器链', id: 'ch04-2' },

    { t: 'p', html:
      '<b>super</b> 有两个用法：<code>super(...)</code> 调用父类构造器，<code>super.方法()</code> 调用父类版本的方法。' +
      '规则很重要：<b>子类构造器一定会先执行父类构造器</b>；你不写 <code>super(...)</code>，编译器会自动插入 <code>super()</code>（无参）。' +
      '所以如果父类只写了带参构造器、没有无参构造器，子类就必须显式写 <code>super(参数)</code>，否则编译报错。' +
      '执行顺序是从最顶层父类往下一层层构造，最后才轮到子类自己的构造器体。'
    },

    { t: 'code', caption: 'CtorOrder.java · 构造器链：Animal() → Dog() → BabyDog(...)', run: true, code:
`public class CtorOrder {
    public static void main(String[] args) {
        new BabyDog("Wang", 2);
    }
}

class Animal {
    Animal() {
        System.out.println("1 Animal()");
    }
}

class Dog extends Animal {
    Dog() {
        super();                    // 可省略，编译器会自动加
        System.out.println("2 Dog()");
    }
}

class BabyDog extends Dog {
    BabyDog(String name, int age) {
        super();                    // 先构造父类 Dog
        System.out.println("3 BabyDog(" + name + ", " + age + ")");
    }
}
` },

    { t: 'p', html:
      '输出固定是三行、由外到内：先 <code>Animal()</code>，再 <code>Dog()</code>，最后 <code>BabyDog(...)</code>。' +
      '理解这条链，才能解释项目里的经典 bug：父类构造器里调用了一个被子类重写的方法，此时子类字段还没初始化，方法读到默认值 ' +
      '<code>null</code> / <code>0</code>，于是空指针。规则：<b>构造器里别调用可被重写的方法</b>。'
    },

    /* ------------------------------------------------------------------ 三、重写 */
    { t: 'h', text: '三、方法重写与 @Override', id: 'ch04-3' },

    { t: 'p', html:
      '<b>重写（override）</b>是子类给出与父类<b>同名、同参数、同返回类型（或协变）</b>的新实现。' +
      '它和<b>重载（overload）</b>是两件事：重载在同一个类里靠参数区分，重写发生在父子类之间、签名必须一致。' +
      '<b>@Override</b> 是注解，不是语法要求，但强烈建议写：它让编译器帮你检查「是不是真的覆盖了父类方法」，' +
      '参数写错、名字拼错都会直接报错——否则你以为重写了，实际只是新增了一个方法，多态时仍会调到父类版本。' +
      '重写时访问权限不能收窄（父类 public，子类不能改成 private），也不能重写 <code>final</code> 方法。'
    },

    { t: 'compare', left: {
      title: '重载（overload）',
      html: '同一个类里，<b>方法名相同、参数不同</b>；编译器按实参决定调哪个。与返回值无关。'
    }, right: {
      title: '重写（override）',
      html: '子类对父类方法<b>同名同参</b>重新实现；运行时按对象实际类型决定调哪个（多态）。'
    } },

    { t: 'callout', kind: 'warn', title: '@Override 写错反而更危险', html:
      '如果签名不小心写错（比如父类是 <code>speak()</code>，子类写成 <code>speak(int)</code>），没写 <code>@Override</code> 时它只是<b>重载</b>，代码照常编译；' +
      '一旦通过父类引用调用 <code>speak()</code>，执行的是父类那份实现——现象就是「我明明重写了，怎么没生效」。加上 <code>@Override</code>，编译器会立刻报错。'
    },

    /* ------------------------------------------------------------------ 四、三种形态 */
    { t: 'h', text: '四、三种继承形态与多继承限制', id: 'ch04-4' },

    { t: 'p', html:
      '讲义把 Java 支持的继承分成三类：<b>单继承（single）</b>——一个类继承另一个类；' +
      '<b>多级继承（multilevel）</b>——继承链，如 <code>BabyDog → Dog → Animal</code>；' +
      '<b>层次继承（hierarchical）</b>——多个类继承同一个父类，如 <code>Dog</code> 与 <code>Cat</code> 都继承 <code>Animal</code>。' +
      '三种形态在实际项目里常常同时出现：<code>GomokuGame</code> 可以有一个 <code>Player</code> 父类，派生出 <code>HumanPlayer</code> 与 <code>AiPlayer</code>（层次），' +
      '而它们又都继承自更通用的 <code>Entity</code>（多级）。'
    },

    { t: 'codegroup', tabs: [
      { label: '单继承', run: true, code:
`class Animal {
    void eat() { System.out.println("eating..."); }
}

class Dog extends Animal {
    void bark() { System.out.println("barking..."); }
}

public class SingleDemo {
    public static void main(String[] args) {
        Dog d = new Dog();
        d.bark();
        d.eat();
    }
}
` },
      { label: '多级继承', run: true, code:
`class Animal {
    void eat() { System.out.println("eating..."); }
}

class Dog extends Animal {
    void bark() { System.out.println("barking..."); }
}

class BabyDog extends Dog {
    void weep() { System.out.println("weeping..."); }
}

public class MultiLevelDemo {
    public static void main(String[] args) {
        BabyDog b = new BabyDog();
        b.weep();
        b.bark();
        b.eat();
    }
}
` },
      { label: '层次继承', run: true, code:
`class Animal {
    void eat() { System.out.println("eating..."); }
}

class Dog extends Animal {
    void bark() { System.out.println("barking..."); }
}

class Cat extends Animal {
    void meow() { System.out.println("meowing..."); }
}

public class HierarchicalDemo {
    public static void main(String[] args) {
        new Dog().eat();
        new Dog().bark();
        new Cat().eat();
        new Cat().meow();
    }
}
` }
    ] },

    { t: 'p', html:
      'Java <b>不支持多继承</b>（一个类同时继承两个类），也不支持混合继承（hybrid）。原因讲义讲得很清楚：' +
      '假设 <code>C</code> 同时继承 <code>A</code> 和 <code>B</code>，而 A、B 都有一个同名方法，' +
      '从 C 的对象调用这个方法时，编译器无法确定该用 A 的版本还是 B 的版本——这就是<b>菱形歧义（diamond ambiguity）</b>。' +
      'Java 的选择是：类只能单继承，但<b>接口可以多实现</b>；接口只有抽象方法、没有方法体，实现由类自己提供，所以不存在歧义。'
    },

    { t: 'callout', kind: 'warn', title: '继承不是越多越好', html:
      '层级越深，子类「继承来的东西」越多，越难说清一个对象到底能做什么；父类一改，所有子类跟着遭殃。' +
      '项目里的实用标准：<b>is-a 关系明确、确实要复用行为</b>才继承；只是「用到了另一个对象」就改用聚合（HAS-A）。' +
      '三层以上的继承链，先想想能不能用组合或接口替代。'
    },

    /* ------------------------------------------------------------------ 五、HAS-A */
    { t: 'h', text: '五、HAS-A 聚合', id: 'ch04-5' },

    { t: 'p', html:
      '<b>聚合（aggregation）</b>是「一个类持有另一个类的对象引用」，表示 <b>HAS-A</b> 关系，目的是复用代码。' +
      '讲义的例子：<code>Circle</code> 有一个 <code>Point</code> 作为圆心——圆<b>不是</b>点，圆<b>有</b>一个点。' +
      '写法就是在字段里放另一个类的引用，构造器里接收它。' +
      '这个模式在项目里到处都是：<code>GomokuGame</code> HAS-A <code>Board</code>，<code>ClientHandler</code> HAS-A <code>Socket</code>，' +
      '<code>SnakeGame</code> HAS-A 一组食物坐标。'
    },

    { t: 'code', caption: 'AggregationDemo.java · Circle HAS-A Point：圆有圆心，不是圆心', run: true, code:
`public class AggregationDemo {
    public static void main(String[] args) {
        Point center = new Point(0, 0);
        Circle c = new Circle(center, 5);
        System.out.println(c.area());                    // 78.5
        System.out.println(c.getCenter().x + "," + c.getCenter().y);
    }
}

class Point {
    int x;
    int y;

    Point(int x, int y) {
        this.x = x;
        this.y = y;
    }
}

class Circle {
    private Point center;      // HAS-A：持有点的引用
    private double radius;

    Circle(Point center, double radius) {
        this.center = center;
        this.radius = radius;
    }

    Point getCenter() { return center; }
    double area() { return 3.14 * radius * radius; }
}
` },

    { t: 'compare', left: {
      title: 'IS-A → 继承',
      html: '「狗是一种动物」「圆是一种形状」——子类是父类的一种，用 <code>extends</code>，自动获得父类行为。'
    }, right: {
      title: 'HAS-A → 聚合',
      html: '「圆有一个圆心」「游戏有一个棋盘」——一个对象持有另一个对象，用字段引用，只复用被持有的对象。'
    } },

    /* ------------------------------------------------------------------ 六、interface */
    { t: 'h', text: '六、interface 与 implements', id: 'ch04-6' },

    { t: 'p', html:
      '<b>接口（interface）</b>是 Java 实现抽象的方式：里面只有<b>抽象方法</b>的声明，没有方法体；' +
      '一个类用 <code>implements</code> 承诺实现这些方法。讲义原文：<b>There can be only abstract methods in the Java interface, not the method body</b>。' +
      '接口定义的是<b>契约（contract）</b>：只要实现了 <code>Shape</code>，调用者就能确定它一定有 <code>area()</code> 与 <code>name()</code>，' +
      '不用关心背后是矩形还是圆。' +
      '接口的方法默认是 <code>public</code>，实现类必须写 <code>public</code>（不能收窄权限）；接口不能被 <code>new</code>，只能被实现。' +
      '关键优势：<b>一个类可以实现多个接口</b>，于是「单继承 + 多接口」补齐了多继承的能力。'
    },

    { t: 'code', caption: 'InterfaceDemo.java · Shape 是契约，Rectangle 承诺实现', run: true, code:
`public class InterfaceDemo {
    public static void main(String[] args) {
        Shape s = new Rectangle(3, 4);     // 接口引用指向实现类对象
        System.out.println(s.name() + " area=" + s.area());
        System.out.println(s instanceof Shape);
    }
}

interface Shape {
    double area();       // 只有声明，没有方法体

    String name();
}

class Rectangle implements Shape {
    private double w;
    private double h;

    Rectangle(double w, double h) {
        this.w = w;
        this.h = h;
    }

    public double area() { return w * h; }

    public String name() { return "Rectangle"; }
}
` },

    { t: 'code', caption: 'MultiInterfaceDemo.java · 一个类可以实现多个接口', run: true, code:
`public class MultiInterfaceDemo {
    public static void main(String[] args) {
        Duck d = new Duck();
        d.swim();
        d.fly();

        Swimmer s = d;      // 可以按任意接口类型使用
        s.swim();
    }
}

interface Swimmer {
    void swim();
}

interface Flyer {
    void fly();
}

class Duck implements Swimmer, Flyer {
    public void swim() { System.out.println("duck swims"); }

    public void fly() { System.out.println("duck flies"); }
}
` },

    { t: 'p', html:
      '项目里接口最常见的用法是「同一套操作、不同实现」：<code>Chat Zoom</code> 可以定义 <code>MessageSender</code> 接口，' +
      '服务器端和客户端各自实现；<code>Gomoku</code> 可以定义 <code>Player</code> 接口（<code>nextMove()</code>），' +
      '人类玩家读鼠标、AI 玩家算分数，棋盘代码完全不用改。'
    },

    /* ------------------------------------------------------------------ 七、多态 */
    { t: 'h', text: '七、多态与动态派发', id: 'ch04-7' },

    { t: 'p', html:
      '<b>多态（polymorphism）</b>指同一个父类引用，运行时调用到不同子类的实现。它成立需要三个条件：' +
      '① 有继承或接口实现；② 子类重写了父类方法；③ <b>父类引用指向子类对象</b>。' +
      '调用 <code>a.speak()</code> 时，编译器只检查 <code>Animal</code> 有没有 <code>speak()</code>，' +
      '真正执行哪个版本由<b>运行时对象的实际类型</b>决定，这叫<b>动态派发（dynamic dispatch）</b>。' +
      '这就是为什么项目里常写 <code>Animal[] zoo</code> 或 <code>Shape[] shapes</code>——一个数组装不同子类，循环一遍自动各干各的。'
    },

    { t: 'code', caption: 'PolyDemo.java · 父类数组装三种子类，循环调用各自重写的方法', run: true, code:
`public class PolyDemo {
    public static void main(String[] args) {
        Animal[] zoo = new Animal[3];
        zoo[0] = new Dog("D");
        zoo[1] = new Cat("C");
        zoo[2] = new BabyDog("B", 1);

        for (int i = 0; i < zoo.length; i++) {
            zoo[i].speak();     // 动态派发：看实际对象类型
        }
    }
}

class Animal {
    String name;

    Animal(String name) { this.name = name; }

    void speak() { System.out.println(name + " makes a sound"); }
}

class Dog extends Animal {
    Dog(String name) { super(name); }
    void speak() { System.out.println(name + " barks"); }
}

class Cat extends Animal {
    Cat(String name) { super(name); }
    void speak() { System.out.println(name + " meows"); }
}

class BabyDog extends Dog {
    BabyDog(String name, int age) { super(name); }
    void speak() { System.out.println(name + " yaps"); }
}
` },

    { t: 'p', html:
      '注意两点：① 父类引用只能调用<b>父类声明过的方法</b>，<code>zoo[i].fetch()</code> 编译不过，因为 <code>Animal</code> 没有 <code>fetch()</code>；' +
      '② 字段<b>不参与</b>多态——通过父类引用访问字段，拿到的是父类那份（同名时容易被坑，所以别用同名字段）。' +
      '多态的价值是「面向父类编程」：新增一种 <code>Animal</code> 子类，上面的循环一行都不用改。'
    },

    /* ------------------------------------------------------------------ 八、转型与 final */
    { t: 'h', text: '八、向上转型、instanceof 与 final', id: 'ch04-8' },

    { t: 'p', html:
      '<b>向上转型（upcasting）</b>是子类对象赋给父类引用，自动发生、永远安全：<code>Animal a = new Dog("D");</code>。' +
      '<b>向下转型（downcasting）</b>是父类引用转回子类，必须显式写 <code>(Dog) a</code>；如果实际对象不是 <code>Dog</code>，运行时抛 ' +
      '<code>ClassCastException</code>。所以转之前先用 <b><code>instanceof</code></b> 判断：<code>if (a instanceof Dog) { Dog d = (Dog) a; ... }</code>。' +
      '<b>final</b> 有三种用法：修饰变量——值不能再改（常量）；修饰方法——子类不能重写；修饰类——不能被继承（如 <code>String</code>）。'
    },

    { t: 'code', caption: 'CastDemo.java · instanceof 判断后再向下转型，避免 ClassCastException', run: true, code:
`public class CastDemo {
    public static void main(String[] args) {
        Animal a = new Dog("D");            // 向上转型：自动
        System.out.println(a instanceof Dog);   // true
        System.out.println(a instanceof Cat);   // false

        if (a instanceof Dog) {             // 先判断，再转
            Dog d = (Dog) a;
            d.fetch();
        }

        Animal c = new Cat("C");
        if (!(c instanceof Dog)) {
            System.out.println("not a dog");
        }
    }
}

class Animal {
    String name;
    Animal(String name) { this.name = name; }
    void speak() { System.out.println(name + " sound"); }
}

class Dog extends Animal {
    Dog(String name) { super(name); }
    void speak() { System.out.println(name + " barks"); }
    void fetch() { System.out.println(name + " fetches"); }
}

class Cat extends Animal {
    Cat(String name) { super(name); }
    void speak() { System.out.println(name + " meows"); }
}
` },

    { t: 'callout', kind: 'tip', title: '项目里的选择：extends 还是 implements', html:
      '<b>要复用已有实现</b>（父类里已经有写好的方法）→ 用 <code>extends</code>；' +
      '<b>只约定能力、不共享实现</b>（人类玩家与 AI 玩家各自实现 <code>nextMove()</code>）→ 用 <code>interface</code>。' +
      'Java 单继承的限制，正好逼着你把「共享实现」和「共享契约」分开，代码反而更清楚。'
    },

    /* ------------------------------------------------------------------ 交互 */
    { t: 'p', html: '下面两个实验台分别演示「方法查找顺序」与「多态派发」，动手点几下比读代码直观：' },

    { t: 'lab', id: 'inherit' },

    { t: 'lab', id: 'polymorph' },

    { t: 'p', html: '再用两道题巩固继承与接口的规则：' },

    { t: 'quiz', qid: 'ch04-q1' },

    { t: 'quiz', qid: 'ch04-q2' },

    /* ------------------------------------------------------------------ 章末 */
    { t: 'keypoint', items: [
      { title: 'IS-A', html: '<code>extends</code> 表示子类「是一种」父类；复用父类行为、扩展自己的方法。' },
      { title: 'super', html: '<code>super(...)</code> 调父类构造器（必须是第一句，且子类构造器一定先构造父类）；<code>super.m()</code> 调父类方法。' },
      { title: '重写', html: '子类同名同参重新实现，用 <code>@Override</code> 让编译器把关；与「同类重载」完全不同。' },
      { title: '三种形态', html: '单继承、多级继承、层次继承；Java 不支持多继承，因为菱形歧义。' },
      { title: 'HAS-A', html: '聚合 = 字段里持有另一个对象；圆 HAS-A 点、游戏 HAS-A 棋盘。' },
      { title: '接口', html: '只有抽象方法的契约，<code>implements</code> 实现；一个类可实现多个接口。' },
      { title: '多态', html: '父类引用指向子类对象，运行时按实际类型动态派发；只能调用父类声明过的方法。' },
      { title: '转型与 final', html: '向上转型自动；向下转型先 <code>instanceof</code>；<code>final</code> 修饰变量/方法/类。' }
    ] },

    { t: 'checklist', id: 'ch04', items: [
      '我能判断两个类之间是 IS-A 还是 HAS-A，并选择 extends 或聚合',
      '我能写出带 super(name) 的子类构造器，并说出构造器链的执行顺序',
      '我能用 @Override 重写方法，并解释漏写 @Override 时签名写错会怎样',
      '我能画出一个单继承、一个多级继承、一个层次继承的例子',
      '我能解释 Java 不支持多继承的原因（菱形歧义）',
      '我能用 interface 定义契约，让两个类各自实现，并用接口数组统一调用',
      '我能说出多态成立的三条件，并解释动态派发',
      '我能用 instanceof 安全向下转型，并说出 final 的三种用法'
    ] },

    { t: 'callout', kind: 'exam', title: '考试怎么考这一章', html:
      '继承与多态是期末简答与读代码题的绝对重点：' +
      '① <b>构造器链</b>——给三层继承问输出顺序，或问「子类构造器第一句是什么」（<code>super(...)</code>；不写则自动 <code>super()</code>）。' +
      '② <b>重写规则</b>——「返回类型必须完全相同」错，允许协变；「访问权限可以收窄」错；「private / static / final 方法不能被重写」。' +
      '③ <b>多态输出题</b>——父类引用调用重写方法，问实际执行哪个版本（看 new 的是什么）。' +
      '④ <b>多继承</b>——「Java 支持一个类继承多个类」错；「一个类可以实现多个接口」对。' +
      '⑤ <b>instanceof</b>——问向下转型不判断会不会抛异常（会抛 <code>ClassCastException</code>）。' +
      '⑥ <b>接口</b>——「接口可以有方法体」错（按课程定义），「接口不能被实例化」对。'
    },

    { t: 'callout', kind: 'ai', title: 'AI 时代这样学', html:
      'AI 写继承体系很快，但容易过度设计。好用法：① 把两个「几乎一样」的类贴给 AI，问「哪些方法该提到父类」，再判断它的抽取是否合理；' +
      '② 让它出「这段代码输出什么」的多态题（父类引用指向子类、构造器链），先自己做，再让它解析每一步；' +
      '③ 问它「为什么 Java 不支持多继承、接口为什么能多实现」，答不出菱形歧义说明只背了结论；' +
      '④ 让它审查你的继承层级：超过三层、父类有几十个方法时，它会建议改用组合——这个建议通常是对的。' +
      '自己验证：画出对象实际类型、手动推一遍动态派发，再看运行结果对不对。'
    }

  ]
});
