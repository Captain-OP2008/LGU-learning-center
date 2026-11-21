/* =====================================================================
 * 计算机科学与 Java 编程导论 · 学习站 · Java 子集解释器（engine.js）
 * 职责：把一段 Java 源码在浏览器里解释执行 —— 词法 → 语法 → AST 树遍历求值。
 *       提供「一次运行」「单步会话」「语法检查」三种能力，并产出内存快照
 *       （栈帧 + 堆对象 + 当前行），供 editor.js 画变量表 / 调用栈 / 内存图。
 * 对外 API：window.CSC.java = { version, run, session, parse, keywords, builtinDocs }
 * 约束：纯逻辑，不依赖 DOM（只在文件末尾注册到 window.CSC）；不用 eval 执行用户代码。
 * 作者模块：engine-dev
 * ===================================================================== */
(function () {
  'use strict';

  var ENGINE_VERSION = '1.0';

  /* ==================================================================
   * 0. 关键字 / 类型表 / 错误工厂
   * ================================================================== */

  /* Java 关键字全集（含 true/false/null，它们按字面量处理，但仍需参与高亮） */
  var KEYWORDS = ('abstract assert boolean break byte case catch char class const continue default do double else enum '
    + 'extends final finally float for goto if implements import instanceof int interface long native new package private '
    + 'protected public return short static strictfp super switch synchronized this throw throws transient try void '
    + 'volatile while true false null var record').split(' ');

  var KW_SET = Object.create(null);
  KEYWORDS.forEach(function (k) { KW_SET[k] = true; });

  /* 八种基本类型 + void：解析类型时要单独认，不能当成类名 */
  var BASIC_TYPE = { boolean: 1, byte: 1, short: 1, int: 1, long: 1, float: 1, double: 1, char: 1, void: 1 };

  /* 内置库类名：用于 casts 歧义判断、静态方法分发、编辑器提示 */
  var LIB_CLASS = {
    System: 1, Math: 1, String: 1, Integer: 1, Double: 1, Character: 1, Boolean: 1, Long: 1,
    Object: 1, Scanner: 1, Arrays: 1, ArrayList: 1, List: 1, Collections: 1, StringBuilder: 1,
    Number: 1, Comparable: 1, Iterable: 1, Exception: 1, RuntimeException: 1, Thread: 1
  };

  /** 任何"给用户看的"失败都装进这个结构，一路 throw 到顶层再转成 RunResult.error */
  function jerr(stage, type, message, line, hint) {
    return { __javaError: true, stage: stage, type: type, message: message, line: line || 0, hint: hint || '' };
  }

  /** 运行时异常（消息模仿 java.lang.*Exception 的原文） */
  function javaEx(cls, message, hint) {
    return jerr('runtime', 'java.lang.' + cls, message, 0, hint || '');
  }

  /** 语法错误：message 里给中英混合线索，hint 给"怎么改" */
  function syntaxErr(message, line, hint) {
    return jerr('compile', 'SyntaxError', message, line, hint || '');
  }

  function typeErr(message, line, hint) {
    return jerr('compile', 'TypeMismatch', message, line, hint || '');
  }

  /* ==================================================================
   * 1. 词法分析（Lexer）
   *    输出 token：{ t:'id'|'kw'|'num'|'str'|'char'|'op'|'eof', v, line, numType?, raw? }
   *    为什么单独一层：语法分析的报错要指向"哪一行的哪个符号"，必须有行号；
   *    而且字符串转义（\n \t \" \uXXXX）只该在一个地方处理。
   * ================================================================== */

  function isDigit(c) { return c >= '0' && c <= '9'; }
  function isHex(c) { return isDigit(c) || (c >= 'a' && c <= 'f') || (c >= 'A' && c <= 'F'); }
  function isIdStart(c) {
    if (!c) return false;
    if ((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c === '_' || c === '$') return true;
    /* Java 允许 Unicode 标识符（中文变量名合法），这里用码点近似判断 */
    return c.charCodeAt(0) > 127 && !/\s/.test(c);
  }
  function isIdPart(c) { return isIdStart(c) || isDigit(c); }

  /* 操作符按"最长优先"匹配：>>> = 4 字符，>>= << = 3 字符，后面的 2 字符先于 1 字符 */
  var OPS = [
    '>>>=',
    '>>=', '<<=', '>>>', '...',
    '==', '!=', '<=', '>=', '&&', '||', '++', '--', '+=', '-=', '*=', '/=', '%=', '&=', '|=', '^=', '<<', '>>', '->',
    '{', '}', '(', ')', '[', ']', ';', ',', '.', ':', '=', '+', '-', '*', '/', '%', '!', '~', '&', '|', '^', '<', '>', '?', '@'
  ];

  /* 字符串/字符字面量里的转义表 */
  var ESCAPES = { n: '\n', t: '\t', r: '\r', b: '\b', f: '\f', '\\': '\\', '"': '"', "'": "'", '0': '\0' };

  /**
   * 扫一个字符串或字符字面量（i 指向开引号，返回 { value, next, line }）
   * 为什么不用正则：需要正确处理 \" 与行号，还要给非法转义报精确行号。
   */
  function scanQuoted(src, i, quote, startLine) {
    var n = src.length, out = '', j = i + 1, line = startLine;
    while (j < n) {
      var c = src[j];
      if (c === '\n') {
        throw syntaxErr('字符串/字符字面量没有闭合（第 ' + startLine + ' 行开始）',
          startLine, quote === '"' ? '检查这一行末尾是否漏写了收尾的双引号 "' : "字符字面量要用单引号，如 'a'");
      }
      if (c === quote) return { value: out, next: j + 1, line: line };
      if (c === '\\') {
        var e = src[j + 1];
        if (e === undefined) break;
        if (e === 'u') {
          var hex = src.substr(j + 2, 4);
          if (!/^[0-9a-fA-F]{4}$/.test(hex)) {
            throw syntaxErr('非法的 Unicode 转义：\\u' + hex, line, '正确写法形如 \\u0041（四位十六进制）');
          }
          out += String.fromCharCode(parseInt(hex, 16));
          j += 6;
          continue;
        }
        if (Object.prototype.hasOwnProperty.call(ESCAPES, e)) { out += ESCAPES[e]; j += 2; continue; }
        throw syntaxErr("非法的转义字符：\\" + e, line,
          '可用的转义：\\n 换行、\\t 制表、\\\\ 反斜杠、\\" 双引号、\\\' 单引号');
      }
      out += c;
      j++;
    }
    throw syntaxErr('字符串/字符字面量没有闭合（第 ' + startLine + ' 行开始）', startLine,
      '检查是否漏写了收尾的引号');
  }

  /** 源码 → token 数组。任何词法错误都带行号和中文修复建议 */
  function tokenize(src) {
    var toks = [];
    var i = 0, n = src.length, line = 1;

    while (i < n) {
      var c = src[i], c2 = src[i + 1];
      /* --- 空白与换行 --- */
      if (c === '\n') { line++; i++; continue; }
      if (c === ' ' || c === '\t' || c === '\r' || c === '\f' || c === '\v') { i++; continue; }

      /* --- 注释：// 与 /* ... *\/ --- */
      if (c === '/' && c2 === '/') {
        while (i < n && src[i] !== '\n') i++;
        continue;
      }
      if (c === '/' && c2 === '*') {
        var close = src.indexOf('*/', i + 2);
        if (close < 0) {
          throw syntaxErr('块注释没有闭合：缺少 */', line, '从第 ' + line + ' 行的 /* 开始，需要以 */ 结束');
        }
        for (var k = i; k < close; k++) if (src[k] === '\n') line++;
        i = close + 2;
        continue;
      }

      /* --- 字符串字面量 --- */
      if (c === '"') {
        /* Java 15+ 文本块 """..."""：本站不支持，给出明确提示而不是奇怪的语法错 */
        if (src.substr(i, 3) === '"""') {
          throw syntaxErr('不支持文本块（text block）"""..."；请改用普通字符串 + \\n', line,
            '把多行文本写成 "第一行\\n第二行"');
        }
        var s = scanQuoted(src, i, '"', line);
        toks.push({ t: 'str', v: s.value, line: line });
        i = s.next;
        continue;
      }

      /* --- 字符字面量 --- */
      if (c === "'") {
        var ch = scanQuoted(src, i, "'", line);
        if (ch.value.length !== 1) {
          throw syntaxErr('字符字面量只能包含一个字符，实际是 ' + ch.value.length + ' 个',
            line, "要表示多个字符请用双引号字符串，如 \"ab\"");
        }
        toks.push({ t: 'char', v: ch.value, line: line });
        i = ch.next;
        continue;
      }

      /* --- 数字字面量：0x/0b、小数、科学计数、下划线分隔、L/F/D 后缀 --- */
      if (isDigit(c) || (c === '.' && isDigit(c2 || ''))) {
        var j = i, numType = 'int', isFloat = false;
        if (c === '0' && (c2 === 'x' || c2 === 'X')) {
          j = i + 2;
          while (j < n && (isHex(src[j]) || src[j] === '_')) j++;
          if (j === i + 2) throw syntaxErr('0x 后面缺少十六进制数字', line, '例如 0x1F 表示 31');
          toks.push({ t: 'num', v: parseInt(src.slice(i + 2, j).replace(/_/g, ''), 16), line: line, numType: 'int' });
          i = j;
          continue;
        }
        if (c === '0' && (c2 === 'b' || c2 === 'B')) {
          j = i + 2;
          while (j < n && (src[j] === '0' || src[j] === '1' || src[j] === '_')) j++;
          if (j === i + 2) throw syntaxErr('0b 后面缺少二进制数字', line, '例如 0b1010 表示 10');
          toks.push({ t: 'num', v: parseInt(src.slice(i + 2, j).replace(/_/g, ''), 2), line: line, numType: 'int' });
          i = j;
          continue;
        }
        /* --- 八进制：以 0 开头的纯整数（Java 规则 010 = 8；08 / 09 非法） --- */
        if (c === '0' && isDigit(c2 || '')) {
          j = i + 1;
          while (j < n && (isDigit(src[j]) || src[j] === '_')) j++;
          var octRaw = src.slice(i, j).replace(/_/g, '');
          if (!/^0[0-7]+$/.test(octRaw)) {
            throw syntaxErr('非法的八进制字面量：' + octRaw, line,
              '八进制只能出现数字 0-7；想写十进制 8 请去掉前导 0（写 8 而不是 08）');
          }
          var octType = 'int';
          if (j < n && (src[j] === 'l' || src[j] === 'L')) { octType = 'long'; j++; }
          toks.push({ t: 'num', v: parseInt(octRaw.slice(1), 8), line: line, numType: octType, raw: octRaw });
          i = j;
          continue;
        }
        while (j < n && (isDigit(src[j]) || src[j] === '_')) j++;
        if (j < n && src[j] === '.' && isDigit(src[j + 1] || '')) {
          isFloat = true; j++;
          while (j < n && (isDigit(src[j]) || src[j] === '_')) j++;
        } else if (j < n && src[j] === '.' && !isIdStart(src[j + 1] || '') && src[j + 1] !== '.') {
          isFloat = true; j++;   /* "1." 也是合法 double */
        }
        if (j < n && (src[j] === 'e' || src[j] === 'E')) {
          var k2 = j + 1;
          if (src[k2] === '+' || src[k2] === '-') k2++;
          if (isDigit(src[k2] || '')) {
            isFloat = true;
            j = k2;
            while (j < n && (isDigit(src[j]) || src[j] === '_')) j++;
          }
        }
        if (j < n && /[fFdDlL]/.test(src[j])) {
          var suffix = src[j].toLowerCase();
          if (suffix === 'f') { numType = 'float'; isFloat = true; }
          else if (suffix === 'd') { numType = 'double'; isFloat = true; }
          else { numType = 'long'; if (isFloat) throw syntaxErr('小数不能加 L 后缀', line, 'L 只能用于 long 整数，如 100L'); }
          j++;
        } else {
          numType = isFloat ? 'double' : 'int';
        }
        var raw = src.slice(i, j).replace(/_/g, '');
        var val = parseFloat(raw);
        /* 整数字面量超出 int 范围时宽容地当 long 处理（真实 javac 会报错，教学场景不值得卡住学生） */
        if (numType === 'int' && val > 2147483647) numType = 'long';
        toks.push({ t: 'num', v: val, line: line, numType: numType, raw: raw });
        i = j;
        continue;
      }

      /* --- 标识符 / 关键字 --- */
      if (isIdStart(c)) {
        var j2 = i + 1;
        while (j2 < n && isIdPart(src[j2])) j2++;
        var word = src.slice(i, j2);
        toks.push({ t: KW_SET[word] ? 'kw' : 'id', v: word, line: line });
        i = j2;
        continue;
      }

      /* --- 运算符 / 分隔符 --- */
      var matched = null;
      for (var oi = 0; oi < OPS.length; oi++) {
        var op = OPS[oi];
        if (src.substr(i, op.length) === op) { matched = op; break; }
      }
      if (matched) {
        toks.push({ t: 'op', v: matched, line: line });
        i += matched.length;
        continue;
      }

      throw syntaxErr("无法识别的字符 '" + c + "'", line,
        '检查是否混入了全角符号（如中文的；，（））——Java 只认半角符号');
    }

    toks.push({ t: 'eof', v: '<文件结束>', line: line });
    return toks;
  }

  /* ==================================================================
   * 2. 语法分析（递归下降）
   *    AST 节点统一用 { k:'节点名', line, ... } 表示。
   *    设计取舍：不建符号表、不做类型检查，语法层只保证"结构合法"，
   *    这样 engine.js 保持一层解释器的简单性（类型问题在求值时给友好报错）。
   * ================================================================== */

  /** 预扫描出所有类名：cast 歧义（(Point) p vs (a) + b）和变量声明判断都要用 */
  function collectDeclaredTypes(toks) {
    var names = Object.create(null);
    for (var i = 0; i < toks.length; i++) {
      if (toks[i].t === 'kw' && (toks[i].v === 'class' || toks[i].v === 'interface' || toks[i].v === 'enum')) {
        var nt = toks[i + 1];
        if (nt && nt.t === 'id') names[nt.v] = true;
      }
    }
    return names;
  }

  function Parser(toks, src) {
    this.toks = toks;
    this.src = src;
    this.pos = 0;
    this.typeNames = collectDeclaredTypes(toks);
    this.className = '';        /* 正在解析的类名（判断构造器用） */
    this.sawClass = false;
  }

  /* ---- token 读取小工具 ---- */
  Parser.prototype.peek = function (k) { return this.toks[Math.min(this.pos + (k || 0), this.toks.length - 1)]; };
  Parser.prototype.take = function () {
    var t = this.toks[this.pos];
    if (this.pos < this.toks.length - 1) this.pos++;
    return t;
  };
  Parser.prototype.isOp = function (v) { var t = this.peek(); return t.t === 'op' && t.v === v; };
  Parser.prototype.isKw = function (v) { var t = this.peek(); return t.t === 'kw' && t.v === v; };
  Parser.prototype.isId = function (v) { var t = this.peek(); return t.t === 'id' && (v === undefined || t.v === v); };

  /** 期望某个运算符，否则抛出带语境的友好错误 */
  Parser.prototype.expectOp = function (v, where, hint) {
    var t = this.peek();
    if (t.t === 'op' && t.v === v) { this.pos++; return t; }
    var got = t.t === 'eof' ? '文件结束' : "'" + t.v + "'";
    throw syntaxErr('这里需要 ' + v + '，但遇到了 ' + got + (where ? '（' + where + '）' : ''),
      t.line, hint || ('检查 ' + v + ' 是否漏写或位置不对'));
  };

  Parser.prototype.expectKw = function (v, where) {
    var t = this.peek();
    if (t.t === 'kw' && t.v === v) { this.pos++; return t; }
    throw syntaxErr('这里需要关键字 ' + v + '，但遇到了 \'' + t.v + '\'' + (where ? '（' + where + '）' : ''), t.line);
  };

  Parser.prototype.expectId = function (what) {
    var t = this.peek();
    if (t.t === 'id') { this.pos++; return t; }
    throw syntaxErr('这里需要一个' + (what || '名字') + '，但遇到了 \'' + t.v + '\'',
      t.line, '标识符只能由字母、数字、下划线组成，且不能以数字开头');
  };

  /* ---- 类型解析：int、String、ArrayList<Integer>、int[][] ---- */
  /** 只解析"基础类型名 + 泛型"，不处理 []（new 表达式需要自己处理方括号） */
  Parser.prototype.parseBaseType = function () {
    var t = this.peek();
    var name;
    if (t.t === 'kw' && BASIC_TYPE[t.v]) { name = t.v; this.pos++; }
    else if (t.t === 'id') {
      name = t.v; this.pos++;
      /* 限定名 java.util.ArrayList：只保留最后一段参与运行时查找 */
      while (this.isOp('.')) {
        this.pos++;
        var seg = this.expectId('类名');
        name = seg.v;
      }
    } else {
      throw syntaxErr('这里需要一个类型名，但遇到了 \'' + t.v + '\'', t.line,
        '类型可以是 int / double / char / boolean / String / 你自己定义的类名');
    }
    var typeArgs = null;
    if (this.isOp('<')) typeArgs = this.skipTypeArgs();
    return { name: name, dims: 0, typeArgs: typeArgs, line: t.line };
  };

  Parser.prototype.parseType = function () {
    var type = this.parseBaseType();
    while (this.isOp('[')) {
      this.pos++;
      this.expectOp(']', '数组维度', '数组类型的写法是 类型[]，方括号里不能放数字');
      type.dims++;
    }
    return type;
  };

  /** 跳过泛型参数（<Integer> / <> / <String, List<Integer>>），只记下顶层类型名 */
  Parser.prototype.skipTypeArgs = function () {
    var depth = 0, first = null;
    this.expectOp('<', '泛型参数');
    depth = 1;
    while (depth > 0) {
      var t = this.peek();
      if (t.t === 'eof') throw syntaxErr('泛型参数没有闭合：缺少 >', t.line, '检查 <> 是否配对');
      if (t.t === 'op' && t.v === '<') depth++;
      else if (t.t === 'op' && t.v === '>') depth--;
      else if (t.t === 'op' && t.v === '>>') {
        /* 嵌套泛型 Foo<Bar<Baz>> 会被词法整体扫成 >>，这里按两层 > 处理 */
        depth -= 2;
      } else if (depth === 1 && t.t === 'id' && !first) first = t.v;
      if (depth > 0) this.pos++;
    }
    this.pos++;  /* 吃掉收尾的 > 或 >> */
    return { raw: first };
  };

  /** 当前位置是否看起来像"类型 变量名"（区分语句是变量声明还是表达式） */
  Parser.prototype.looksLikeVarDecl = function () {
    var i = this.pos;
    var t0 = this.toks[i];
    if (t0.t === 'kw' && (BASIC_TYPE[t0.v] || t0.v === 'var')) return true;
    if (t0.t !== 'id') return false;
    if (!this.typeNames[t0.v] && !LIB_CLASS[t0.v]) {
      /* 未知类型名也允许，只要形状是 "id id" 或 "id<...> id"，让运行时给"找不到符号"的报错 */
    }
    i++;
    /* 限定类型名 java.util.ArrayList<String> list：跳过 . 后面的每一段 */
    while (this.toks[i] && this.toks[i].t === 'op' && this.toks[i].v === '.') {
      if (!this.toks[i + 1] || this.toks[i + 1].t !== 'id') return false;
      i += 2;
    }
    var t = this.toks[i];
    if (t && t.t === 'op' && t.v === '<') {
      /* 跳过泛型：从 < 开始按尖括号配对走到 > 之后 */
      var depth = 0;
      for (; i < this.toks.length; i++) {
        var tt = this.toks[i];
        if (tt.t === 'eof') return false;
        if (tt.t === 'op' && tt.v === '<') { depth++; continue; }
        if (tt.t === 'op' && tt.v === '>') { depth--; if (depth === 0) { i++; break; } continue; }
        if (tt.t === 'op' && tt.v === '>>') { depth -= 2; if (depth <= 0) { i++; break; } continue; }
      }
      t = this.toks[i];
    }
    while (t && t.t === 'op' && t.v === '[') {
      var t2 = this.toks[i + 1];
      if (!t2 || t2.t !== 'op' || t2.v !== ']') return false;
      i += 2;
      t = this.toks[i];
    }
    if (t && t.t === 'op' && t.v === '...') {
      i++;
      t = this.toks[i];
    }
    return !!(t && t.t === 'id');
  };

  /* ---- 入口：整个编译单元 ---- */
  Parser.prototype.parseProgram = function () {
    var classes = [];
    while (this.peek().t !== 'eof') {
      var t = this.peek();
      if (t.t === 'kw' && t.v === 'package') { this.skipToSemicolon(); continue; }
      if (t.t === 'kw' && t.v === 'import') { this.skipImport(); continue; }
      if (t.t === 'op' && t.v === ';') { this.pos++; continue; }
      if (t.t === 'op' && t.v === '@') { this.skipAnnotation(); continue; }
      if (t.t === 'kw' && (t.v === 'class' || t.v === 'interface' || t.v === 'enum')) {
        classes.push(this.parseClass([]));
        continue;
      }
      /* 允许修饰符出现在 class 前：public / final / abstract */
      if (t.t === 'kw' && /^(public|private|protected|static|final|abstract|strictfp)$/.test(t.v)) {
        var mods = this.parseModifiers();
        if (this.peek().t === 'kw' && this.peek().v === 'class') {
          classes.push(this.parseClass(mods));
          continue;
        }
        throw syntaxErr('这里需要 class 声明', this.peek().line, '一个 .java 文件里只能写类/接口声明');
      }
      /* 兜底：整段代码是"裸语句"（没有 class），当成 main 方法体 —— 方便内容侧写小片段 */
      if (!this.sawClass && classes.length === 0) {
        var body = this.parseBlockLikeFragment();
        classes.push({
          k: 'ClassDecl', name: 'Main', mods: ['public'], superName: null, interfaces: [],
          members: [{
            k: 'MethodDecl', name: 'main', retType: { name: 'void', dims: 0 }, params: [], mods: ['public', 'static'],
            body: body, line: body.line
          }], line: body.line, synthetic: true
        });
        break;
      }
      throw syntaxErr('无法理解的顶层内容：\'' + t.v + '\'', t.line, '检查花括号是否配对');
    }
    if (classes.length === 0) {
      throw syntaxErr('这个文件里没有任何 class 声明', 1, '一个 Java 程序至少需要一个 class');
    }
    return { k: 'Program', classes: classes };
  };

  Parser.prototype.skipToSemicolon = function () {
    while (this.peek().t !== 'eof' && !this.isOp(';')) this.pos++;
    if (this.isOp(';')) this.pos++;
  };

  Parser.prototype.skipImport = function () {
    /* import java.util.*; 里的 * 在 token 流里是 op('*')，直接跳到分号即可 */
    while (this.peek().t !== 'eof' && !this.isOp(';')) this.pos++;
    if (this.isOp(';')) this.pos++;
  };

  /** 跳过注解 @Override / @SuppressWarnings("unchecked")：解释器不需要它们 */
  Parser.prototype.skipAnnotation = function () {
    this.expectOp('@', '注解');
    this.expectId('注解名');
    while (this.isOp('.')) { this.pos++; this.expectId('注解名'); }
    if (this.isOp('(')) {
      var depth = 0;
      do {
        var t = this.take();
        if (t.t === 'eof') throw syntaxErr('注解的括号没有闭合', t.line);
        if (t.t === 'op' && t.v === '(') depth++;
        if (t.t === 'op' && t.v === ')') depth--;
      } while (depth > 0);
    }
  };

  var MODIFIERS = {
    public: 1, private: 1, protected: 1, static: 1, final: 1, abstract: 1, native: 1,
    synchronized: 1, transient: 1, volatile: 1, strictfp: 1, default: 1
  };

  Parser.prototype.parseModifiers = function () {
    var mods = [];
    for (;;) {
      var t = this.peek();
      if (t.t === 'kw' && MODIFIERS[t.v]) { mods.push(t.v); this.pos++; continue; }
      if (t.t === 'op' && t.v === '@') { this.skipAnnotation(); continue; }
      break;
    }
    return mods;
  };

  /** 类 / 接口声明 */
  Parser.prototype.parseClass = function (mods) {
    var startTok = this.peek();
    var isIface = startTok.t === 'kw' && startTok.v === 'interface';
    var isEnum = startTok.t === 'kw' && startTok.v === 'enum';
    if (isEnum) {
      throw syntaxErr('本站引擎不支持 enum 枚举类型', startTok.line, '可以用 static final int 常量代替，或问我（engine）加支持');
    }
    this.pos++;                       /* class / interface */
    var nameTok = this.expectId('类名');
    var prevClass = this.className;
    this.className = nameTok.v;
    this.sawClass = true;

    var superName = null, interfaces = [];
    if (this.isKw('extends')) {
      this.pos++;
      var sup = this.expectId('父类名');
      if (isIface) interfaces.push(sup.v);   /* 接口继承接口：当 implements 处理即可 */
      else superName = sup.v;
      while (this.isOp(',')) { this.pos++; interfaces.push(this.expectId('接口名').v); }
    }
    if (this.isKw('implements')) {
      this.pos++;
      interfaces.push(this.expectId('接口名').v);
      while (this.isOp(',')) { this.pos++; interfaces.push(this.expectId('接口名').v); }
    }

    this.expectOp('{', '类体开始处', '检查类名后面是否漏了 {');
    var members = [];
    while (!this.isOp('}')) {
      if (this.peek().t === 'eof') {
        throw syntaxErr('类 ' + nameTok.v + ' 没有闭合：缺少 }', nameTok.line, '检查花括号是否配对');
      }
      /* 分号结尾的空成员（如接口里多写的 ;） */
      if (this.isOp(';')) { this.pos++; continue; }
      var m = this.parseMember(nameTok.v, isIface);
      if (m) members.push(m);
    }
    this.expectOp('}', '类体结束处');
    var cls = {
      k: 'ClassDecl', name: nameTok.v, mods: mods || [], isInterface: isIface,
      superName: superName, interfaces: interfaces, members: members, line: startTok.line
    };
    this.className = prevClass;
    return cls;
  };

  /** 类成员：构造器 / 方法 / 字段 / 静态初始化块 */
  Parser.prototype.parseMember = function (clsName, isIface) {
    var startLine = this.peek().line;
    var mods = this.parseModifiers();

    /* 静态初始化块：static { ... } */
    if (this.isKw('static') || (this.isOp('{') && !isIface)) {
      /* 已把 static 吃进 mods；这里是 static { 或实例初始化块 { */
    }
    if (this.isOp('{')) {
      var blk = this.parseBlock();
      return { k: 'InitBlock', body: blk, mods: mods, line: startLine };
    }

    /* 泛型方法声明：public <T> T foo(...) —— 跳过类型参数 */
    if (this.isOp('<')) { this.skipTypeArgs(); }

    /* 构造器：ClassName ( ... ) { ... } —— 没有返回类型 */
    if (this.isId(clsName) && this.peek(1).t === 'op' && this.peek(1).v === '(') {
      var ctorName = this.take();
      var ctorParams = this.parseParams();
      if (this.isKw('throws')) this.skipThrows();
      var ctorBody = this.parseBlock();
      return {
        k: 'CtorDecl', name: ctorName.v, params: ctorParams, mods: mods,
        body: ctorBody, line: startLine
      };
    }

    /* 方法或字段：先解析类型 */
    var type = this.parseType();
    var nameTok = this.expectId('成员名');
    if (this.isOp('(')) {
      var params = this.parseParams();
      if (this.isKw('throws')) this.skipThrows();
      var body = null;
      if (this.isOp('{')) body = this.parseBlock();
      else this.expectOp(';', '抽象方法声明末尾', '没有方法体的方法（抽象方法）必须以分号结束');
      return {
        k: 'MethodDecl', name: nameTok.v, retType: type, params: params, mods: mods,
        body: body, line: startLine, abstractNoBody: body === null
      };
    }

    /* 字段声明：允许一行声明多个 int a = 1, b, c = 3; */
    var decls = [];
    for (;;) {
      var fname = nameTok;
      var extraDims = 0;
      while (this.isOp('[')) {
        this.pos++; this.expectOp(']', '数组维度', '例如 int[] a');
        extraDims++;
      }
      var init = null;
      if (this.isOp('=')) { this.pos++; init = this.parseVarInit(); }
      decls.push({ name: fname.v, dims: extraDims, init: init, line: fname.line });
      if (this.isOp(',')) { this.pos++; nameTok = this.expectId('字段名'); continue; }
      break;
    }
    this.expectOp(';', '字段声明末尾', '字段声明后面要写分号，例如 int count = 0;');
    return { k: 'FieldDecl', type: type, decls: decls, mods: mods, line: startLine };
  };

  Parser.prototype.skipThrows = function () {
    this.expectKw('throws');
    this.expectId('异常类名');
    while (this.isOp(',')) { this.pos++; this.expectId('异常类名'); }
  };

  Parser.prototype.parseParams = function () {
    this.expectOp('(', '参数列表');
    var params = [];
    if (this.isOp(')')) { this.pos++; return params; }
    for (;;) {
      var mods = this.parseModifiers();   /* final 参数 */
      var type = this.parseType();
      var varargs = false;
      if (this.isOp('...')) {              /* String... args 可变参数 */
        this.pos++;
        varargs = true;
        type.dims++;
      }
      var nameTok = this.expectId('参数名');
      params.push({ name: nameTok.v, type: type, mods: mods, varargs: varargs, line: nameTok.line });
      if (this.isOp(',')) { this.pos++; continue; }
      break;
    }
    this.expectOp(')', '参数列表末尾', '检查参数之间是否漏了逗号，或括号是否配对');
    return params;
  };

  /** 字段/局部变量的初始化部分：可能是数组初始化 {1,2,3} */
  Parser.prototype.parseVarInit = function () {
    if (this.isOp('{')) return this.parseArrayInit();
    return this.parseExpr();
  };

  Parser.prototype.parseArrayInit = function () {
    var startTok = this.expectOp('{', '数组初始化', '数组字面量形如 {1, 2, 3}');
    var items = [];
    while (!this.isOp('}')) {
      if (this.peek().t === 'eof') throw syntaxErr('数组初始化没有闭合：缺少 }', startTok.line);
      items.push(this.parseVarInit());
      if (this.isOp(',')) { this.pos++; continue; }
      break;
    }
    this.expectOp('}', '数组初始化末尾');
    return { k: 'ArrayInit', items: items, line: startTok.line };
  };

  /* ---- 语句 ---- */
  Parser.prototype.parseBlock = function () {
    var startTok = this.expectOp('{', '代码块开始处', '检查是否漏写了 {');
    var stmts = [];
    while (!this.isOp('}')) {
      if (this.peek().t === 'eof') {
        throw syntaxErr('代码块没有闭合：缺少 }（从第 ' + startTok.line + ' 行的 { 开始）',
          startTok.line, '检查花括号 { } 是否成对');
      }
      var s = this.parseStmt();
      if (s) stmts.push(s);
    }
    this.expectOp('}', '代码块结束处');
    return { k: 'Block', stmts: stmts, line: startTok.line };
  };

  /** 裸语句片段（没有 class 的代码）→ 合成 main 方法体 */
  Parser.prototype.parseBlockLikeFragment = function () {
    var stmts = [];
    var line = this.peek().line;
    while (this.peek().t !== 'eof') {
      var s = this.parseStmt();
      if (s) stmts.push(s);
    }
    return { k: 'Block', stmts: stmts, line: line };
  };

  Parser.prototype.parseStmt = function () {
    var t = this.peek();
    var line = t.line;

    if (t.t === 'op' && t.v === '{') return this.parseBlock();
    if (t.t === 'op' && t.v === ';') { this.pos++; return { k: 'Empty', line: line }; }
    if (t.t === 'kw') {
      switch (t.v) {
        case 'if': return this.parseIf();
        case 'while': return this.parseWhile();
        case 'do': return this.parseDoWhile();
        case 'for': return this.parseFor();
        case 'return': {
          this.pos++;
          var val = this.isOp(';') ? null : this.parseExpr();
          this.expectOp(';', 'return 语句末尾', 'return 后面要么直接分号（void 方法），要么一个表达式加分号');
          return { k: 'Return', value: val, line: line };
        }
        case 'break': {
          this.pos++;
          var label = null;
          if (this.peek().t === 'id') label = this.take().v;
          this.expectOp(';', 'break 语句末尾');
          return { k: 'Break', label: label, line: line };
        }
        case 'continue': {
          this.pos++;
          var label2 = null;
          if (this.peek().t === 'id') label2 = this.take().v;
          this.expectOp(';', 'continue 语句末尾');
          return { k: 'Continue', label: label2, line: line };
        }
        case 'switch': return this.parseSwitch();
        case 'try': case 'catch': case 'finally':
          throw syntaxErr('本站引擎暂不支持 try / catch / finally 异常处理语句', line,
            '可以用 if 判断避免出错（例如先检查下标是否越界），或改用其他示例');
        case 'throw':
          throw syntaxErr('本站引擎暂不支持 throw 语句', line, '异常由引擎自动抛出（越界、空指针、除以零等）');
        case 'synchronized': case 'assert':
          throw syntaxErr('本站引擎不支持 ' + t.v + ' 语句', line);
        case 'class': case 'interface':
          throw syntaxErr('不能在方法里定义类（内部类）', line, '把类声明移到方法外面');
        default:
          break;
      }
    }
    /* 标签语句 label: stmt（用于带标签的 break/continue） */
    if (t.t === 'id' && this.peek(1).t === 'op' && this.peek(1).v === ':') {
      this.pos += 2;
      var inner = this.parseStmt();
      return { k: 'Labeled', label: t.v, body: inner, line: line };
    }
    /* 局部变量前的 final：final int k = 3;（修饰符本身不参与执行） */
    if (t.t === 'kw' && t.v === 'final') {
      this.pos++;
      return this.parseVarDeclStmt();
    }
    if (this.looksLikeVarDecl()) return this.parseVarDeclStmt();
    /* 表达式语句 */
    var startTok = this.peek();
    var expr = this.parseExpr();
    var semi = this.expectOp(';', '语句末尾',
      'Java 中每条语句都必须以分号 ; 结束（这一行是第 ' + startTok.line + ' 行开始的语句）');
    return { k: 'ExprStmt', expr: expr, line: startTok.line, semiLine: semi.line };
  };

  Parser.prototype.parseVarDeclStmt = function () {
    var type = this.parseType();
    var decls = [];
    for (;;) {
      var nameTok = this.expectId('变量名');
      /* 注意：type.dims 已经在类型里了，这里只数"变量名后面"的额外方括号（int a[] 写法） */
      var extraDims = 0;
      while (this.isOp('[')) { this.pos++; this.expectOp(']', '数组维度'); extraDims++; }
      var init = null;
      if (this.isOp('=')) { this.pos++; init = this.parseVarInit(); }
      decls.push({ name: nameTok.v, dims: extraDims, init: init, line: nameTok.line });
      if (this.isOp(',')) { this.pos++; continue; }
      break;
    }
    var semi = this.expectOp(';', '变量声明末尾', '变量声明后面要写分号，例如 int x = 1;');
    return { k: 'VarDecl', type: type, decls: decls, line: type.line, semiLine: semi.line };
  };

  Parser.prototype.parseIf = function () {
    var line = this.expectKw('if').line;
    this.expectOp('(', "if 条件", "if 后面必须跟括号，例如 if (x > 0)");
    var cond = this.parseExpr();
    this.expectOp(')', 'if 条件末尾', '检查条件表达式后面的右括号');
    var then = this.parseStmt();
    var alt = null;
    if (this.isKw('else')) { this.pos++; alt = this.parseStmt(); }
    return { k: 'If', cond: cond, then: then, alt: alt, line: line };
  };

  Parser.prototype.parseWhile = function () {
    var line = this.expectKw('while').line;
    this.expectOp('(', 'while 条件', 'while 后面必须跟括号，例如 while (i < 10)');
    var cond = this.parseExpr();
    this.expectOp(')', 'while 条件末尾');
    var body = this.parseStmt();
    return { k: 'While', cond: cond, body: body, line: line };
  };

  Parser.prototype.parseDoWhile = function () {
    var line = this.expectKw('do').line;
    var body = this.parseStmt();
    this.expectKw('while', 'do-while 的结尾', "do { ... } while (条件); 的 while 不能省");
    this.expectOp('(', 'do-while 条件');
    var cond = this.parseExpr();
    this.expectOp(')', 'do-while 条件末尾');
    this.expectOp(';', 'do-while 语句末尾', 'do-while 的结尾要写分号：while (cond);');
    return { k: 'DoWhile', cond: cond, body: body, line: line };
  };

  Parser.prototype.parseFor = function () {
    var line = this.expectKw('for').line;
    this.expectOp('(', "for 语句", 'for 后面必须跟括号，例如 for (int i = 0; i < 3; i++)');
    var save = this.pos;

    /* 先尝试增强 for：for (String s : list) */
    if (!this.isOp(';') && this.looksLikeVarDecl()) {
      try {
        var vt = this.parseType();
        if (this.peek().t === 'id') {
          var nameTok = this.take();
          if (this.isOp(':')) {
            this.pos++;
            var iter = this.parseExpr();
            this.expectOp(')', '增强 for 的末尾', '增强 for 的写法：for (类型 变量 : 数组或集合)');
            var body = this.parseStmt();
            return { k: 'ForEach', type: vt, name: nameTok.v, iter: iter, body: body, line: line };
          }
        }
      } catch (e) {
        if (!e || !e.__javaError) throw e;
      }
      this.pos = save;
    }

    var init = null;
    if (!this.isOp(';')) {
      if (this.looksLikeVarDecl()) init = this.parseVarDeclStmt();
      else {
        var initExprs = this.parseExprList();
        this.expectOp(';', 'for 的初始化部分后面', 'for (初始化; 条件; 更新) 三段之间用分号隔开');
        init = { k: 'ExprList', exprs: initExprs, line: line };
      }
    } else {
      this.expectOp(';', 'for 的初始化部分后面');
    }
    var cond = null;
    if (!this.isOp(';')) cond = this.parseExpr();
    this.expectOp(';', 'for 的条件部分后面', 'for (初始化; 条件; 更新) 三段之间用分号隔开');
    var update = null;
    if (!this.isOp(')')) update = { k: 'ExprList', exprs: this.parseExprList(), line: line };
    this.expectOp(')', 'for 的末尾', '检查 for 括号是否配对');
    var body2 = this.parseStmt();
    return { k: 'For', init: init, cond: cond, update: update, body: body2, line: line };
  };

  Parser.prototype.parseSwitch = function () {
    var line = this.expectKw('switch').line;
    this.expectOp('(', 'switch 条件', 'switch (表达式) { case ... }');
    var subject = this.parseExpr();
    this.expectOp(')', 'switch 条件末尾');
    this.expectOp('{', 'switch 语句体', 'switch 后面必须用 { } 包住 case');
    var cases = [];
    var current = null;
    while (!this.isOp('}')) {
      var t = this.peek();
      if (t.t === 'eof') throw syntaxErr('switch 没有闭合：缺少 }', line);
      if (t.t === 'kw' && t.v === 'case') {
        this.pos++;
        var test = this.parseExpr();
        this.expectOp(':', 'case 标签后面', 'case 值的后面是冒号，不是分号');
        current = { test: test, stmts: [], line: t.line, isDefault: false };
        cases.push(current);
        continue;
      }
      if (t.t === 'kw' && t.v === 'default') {
        this.pos++;
        this.expectOp(':', 'default 标签后面');
        current = { test: null, stmts: [], line: t.line, isDefault: true };
        cases.push(current);
        continue;
      }
      if (!current) throw syntaxErr('switch 里第一条必须先是 case 或 default 标签', t.line);
      var st = this.parseStmt();
      if (st) current.stmts.push(st);
    }
    this.expectOp('}', 'switch 语句体末尾');
    return { k: 'Switch', subject: subject, cases: cases, line: line };
  };

  /* ---- 表达式（Java 优先级，从低到高）---- */
  Parser.prototype.parseExprList = function () {
    var list = [this.parseExpr()];
    while (this.isOp(',')) { this.pos++; list.push(this.parseExpr()); }
    return list;
  };

  Parser.prototype.parseExpr = function () {
    return this.parseAssign();
  };

  /* 赋值：右结合，a = b = 3 合法 */
  Parser.prototype.parseAssign = function () {
    var left = this.parseConditional();
    var t = this.peek();
    if (t.t === 'op' && /^(=|\+=|-=|\*=|\/=|%=|&=|\|=|\^=|<<=|>>=|>>>=)$/.test(t.v)) {
      this.pos++;
      var right = this.parseAssign();
      return { k: 'Assign', op: t.v, target: left, value: right, line: t.line };
    }
    return left;
  };

  Parser.prototype.parseConditional = function () {
    var cond = this.parseBinary(1);
    if (this.isOp('?')) {
      var q = this.take();
      var thenExpr = this.parseAssign();
      this.expectOp(':', '三元运算符 ? :', '三元表达式的写法是 条件 ? 值1 : 值2');
      var elseExpr = this.parseAssign();
      return { k: 'Cond', cond: cond, thenExpr: thenExpr, elseExpr: elseExpr, line: q.line };
    }
    return cond;
  };

  /* 二元运算的优先级表：数字越大越"紧" */
  var BIN_PREC = {
    '||': 1, '&&': 2, '|': 3, '^': 4, '&': 5,
    '==': 6, '!=': 6,
    '<': 7, '>': 7, '<=': 7, '>=': 7, instanceof: 7,
    '<<': 8, '>>': 8, '>>>': 8,
    '+': 9, '-': 9,
    '*': 10, '/': 10, '%': 10
  };

  Parser.prototype.parseBinary = function (minPrec) {
    var left = this.parseUnary();
    for (;;) {
      var t = this.peek();
      var op = null;
      if (t.t === 'op' && BIN_PREC[t.v]) op = t.v;
      else if (t.t === 'kw' && t.v === 'instanceof') op = 'instanceof';
      if (!op) break;
      var prec = BIN_PREC[op];
      if (prec < minPrec) break;
      this.pos++;
      if (op === 'instanceof') {
        var type = this.parseType();
        left = { k: 'InstanceOf', expr: left, type: type, line: t.line };
        continue;
      }
      var right = this.parseBinary(prec + 1);
      /* 编译期常量折叠：两个字符串字面量相加（"h" + "i"）在 Java 里是常量表达式，
         结果直接进字符串池，所以 "h" + "i" == "hi" 为 true。
         只折叠"两边都是字符串字面量"的情况：变量 + 变量属于运行时拼接，会 new 出新对象，
         不能折叠，否则会让学生误以为 s1 + s2 == "ab" 也成立。 */
      if (op === '+' && left.k === 'Literal' && left.litType === 'String' &&
          right.k === 'Literal' && right.litType === 'String') {
        left = { k: 'Literal', litType: 'String', value: left.value + right.value, line: t.line };
        continue;
      }
      left = { k: 'Binary', op: op, l: left, r: right, line: t.line };
    }
    return left;
  };

  Parser.prototype.parseUnary = function () {
    var t = this.peek();
    if (t.t === 'op') {
      if (t.v === '+' || t.v === '-' || t.v === '!' || t.v === '~') {
        this.pos++;
        var e = this.parseUnary();
        return { k: 'Unary', op: t.v, expr: e, line: t.line };
      }
      if (t.v === '++' || t.v === '--') {
        this.pos++;
        var target = this.parseUnary();
        return { k: 'Update', op: t.v, prefix: true, target: target, line: t.line };
      }
      /* cast：(int) x、(double) n、(Point) obj、(int[]) arr */
      if (t.v === '(' && this.looksLikeCast()) {
        this.pos++;
        var castType = this.parseType();
        this.expectOp(')', '强制类型转换', '转换的写法是 (类型) 表达式，例如 (int) 3.9');
        var operand = this.parseUnary();
        return { k: 'Cast', type: castType, expr: operand, line: t.line };
      }
    }
    return this.parsePostfix();
  };

  /** 判断当前 '(' 是强制转换还是普通括号表达式：(int) x 是转换，(a) + b 是括号 */
  Parser.prototype.looksLikeCast = function () {
    var i = this.pos + 1;
    var t = this.toks[i];
    if (!t) return false;
    var isBasic = t.t === 'kw' && BASIC_TYPE[t.v] && t.v !== 'void';
    if (!isBasic) {
      if (t.t !== 'id') return false;
      if (!this.typeNames[t.v] && !LIB_CLASS[t.v]) return false;
    }
    i++;
    if (!isBasic) {
      while (this.toks[i] && this.toks[i].t === 'op' && this.toks[i].v === '.') i += 2;
      var tg = this.toks[i];
      if (tg && tg.t === 'op' && tg.v === '<') {
        var depth = 0;
        for (; i < this.toks.length; i++) {
          var tt = this.toks[i];
          if (tt.t === 'eof') return false;
          if (tt.t === 'op' && tt.v === '<') { depth++; continue; }
          if (tt.t === 'op' && tt.v === '>') { depth--; if (depth === 0) { i++; break; } continue; }
          if (tt.t === 'op' && tt.v === '>>') { depth -= 2; if (depth <= 0) { i++; break; } continue; }
        }
      }
    }
    var t3 = this.toks[i];
    while (t3 && t3.t === 'op' && t3.v === '[') {
      if (!this.toks[i + 1] || this.toks[i + 1].t !== 'op' || this.toks[i + 1].v !== ']') return false;
      i += 2;
      t3 = this.toks[i];
    }
    if (!t3 || t3.t !== 'op' || t3.v !== ')') return false;
    var after = this.toks[i + 1];
    if (!after) return false;
    /* ')' 后面紧跟这些符号时，说明这是一个括号表达式而不是强制转换 */
    if (after.t === 'op' && [';', '=', ',', ':', '?', '}', '{', ']', ')'].indexOf(after.v) >= 0) return false;
    return true;
  };

  Parser.prototype.parsePostfix = function () {
    var node = this.parsePrimary();
    for (;;) {
      var t = this.peek();
      if (t.t === 'op' && t.v === '.') {
        this.pos++;
        var nameTok = this.peek();
        if (nameTok.t !== 'id') {
          throw syntaxErr("'.' 后面需要一个字段名或方法名，但遇到了 '" + nameTok.v + "'", nameTok.line);
        }
        this.pos++;
        if (this.isOp('(')) {
          var args = this.parseArgs();
          node = { k: 'Call', obj: node, name: nameTok.v, args: args, line: nameTok.line };
        } else {
          node = { k: 'Member', obj: node, name: nameTok.v, line: nameTok.line };
        }
        continue;
      }
      if (t.t === 'op' && t.v === '[') {
        this.pos++;
        var idx = this.parseExpr();
        this.expectOp(']', '数组下标', '取数组元素的写法是 arr[下标]');
        node = { k: 'Index', array: node, index: idx, line: t.line };
        continue;
      }
      if (t.t === 'op' && (t.v === '++' || t.v === '--')) {
        this.pos++;
        node = { k: 'Update', op: t.v, prefix: false, target: node, line: t.line };
        continue;
      }
      break;
    }
    return node;
  };

  Parser.prototype.parseArgs = function () {
    this.expectOp('(', '参数列表', '方法调用的写法是 方法名(参数, ...)');
    var args = [];
    if (this.isOp(')')) { this.pos++; return args; }
    for (;;) {
      args.push(this.parseExpr());
      if (this.isOp(',')) { this.pos++; continue; }
      break;
    }
    this.expectOp(')', '参数列表末尾', '检查方法的括号是否配对，参数之间用逗号隔开');
    return args;
  };

  Parser.prototype.parsePrimary = function () {
    var t = this.peek();
    var line = t.line;

    if (t.t === 'num') {
      this.pos++;
      return {
        k: 'Literal', litType: t.numType,
        value: t.numType === 'int' ? (t.v | 0) : t.v, line: line, raw: t.raw
      };
    }
    if (t.t === 'str') { this.pos++; return { k: 'Literal', litType: 'String', value: t.v, line: line, raw: JSON.stringify(t.v) }; }
    if (t.t === 'char') { this.pos++; return { k: 'Literal', litType: 'char', value: t.v, line: line, raw: "'" + t.v + "'" }; }
    if (t.t === 'kw') {
      if (t.v === 'true') { this.pos++; return { k: 'Literal', litType: 'boolean', value: true, line: line, raw: 'true' }; }
      if (t.v === 'false') { this.pos++; return { k: 'Literal', litType: 'boolean', value: false, line: line, raw: 'false' }; }
      if (t.v === 'null') { this.pos++; return { k: 'Literal', litType: 'null', value: null, line: line, raw: 'null' }; }
      if (t.v === 'this') {
        this.pos++;
        if (this.isOp('(')) return { k: 'ThisCall', args: this.parseArgs(), line: line };
        return { k: 'This', line: line };
      }
      if (t.v === 'super') {
        this.pos++;
        if (this.isOp('(')) return { k: 'SuperCall', args: this.parseArgs(), line: line };
        return { k: 'Super', line: line };
      }
      if (t.v === 'new') return this.parseNew();
      throw syntaxErr("表达式里不能出现关键字 '" + t.v + "'", line,
        '检查是否把关键字当成了变量名，或语句结构写错了');
    }
    if (t.t === 'op' && t.v === '(') {
      this.pos++;
      var inner = this.parseExpr();
      this.expectOp(')', '括号表达式末尾', '检查左右括号是否配对');
      return { k: 'Paren', expr: inner, line: line };
    }
    if (t.t === 'id') {
      this.pos++;
      if (this.isOp('(')) {
        return { k: 'Call', obj: null, name: t.v, args: this.parseArgs(), line: line };
      }
      return { k: 'Ident', name: t.v, line: line };
    }
    if (t.t === 'eof') {
      throw syntaxErr('代码在这里意外结束了（第 ' + line + ' 行）', line,
        '检查是否漏写了闭括号 } 或分号 ;');
    }
    throw syntaxErr("这里需要一个表达式，但遇到了 '" + t.v + "'", line,
      '表达式可以是变量、字面量、运算或方法调用');
  };

  Parser.prototype.parseNew = function () {
    var line = this.expectKw('new').line;
    /* 注意：这里不能用 parseType（它会吃掉 []），数组的方括号必须留给下面解析维度 */
    var type = this.parseBaseType();
    if (this.isOp('[')) {
      var dimsExpr = [];
      while (this.isOp('[')) {
        this.pos++;
        if (this.isOp(']')) { this.pos++; dimsExpr.push(null); continue; }
        dimsExpr.push(this.parseExpr());
        this.expectOp(']', '数组维度', 'new int[5] 的方括号里要写下标上限');
      }
      var init = null;
      if (this.isOp('{')) init = this.parseArrayInit();
      return { k: 'NewArray', type: type, dims: dimsExpr, init: init, line: line };
    }
    /* new int[n][] 这种写法里，后续维度已在上面的 while 里处理完 */
    var args = this.parseArgs();
    /* 匿名内部类 new Runnable() { ... }：不支持，给明确提示 */
    if (this.isOp('{')) {
      throw syntaxErr('本站引擎不支持匿名内部类（new 类名() { ... }）', line, '先定义一个具名的类，再用 new 创建它');
    }
    return { k: 'NewObject', type: type, args: args, line: line };
  };

  /* ==================================================================
   * 3. 语法分析入口：parseToAst
   * ================================================================== */

  function parseToAst(src) {
    var toks = tokenize(src || '');
    var parser = new Parser(toks, src || '');
    var program = parser.parseProgram();
    return { program: program, tokens: toks };
  }

  /* ==================================================================
   * 4. 运行时值模型
   *    每个运行时值都是 { type, value } 的盒子，而不是裸 JS 值。
   *    为什么：Java 的 int / long / double / char 在 JS 里都是 number，
   *    不单独记类型就没法正确实现"整除截断、1.0 打印成 1.0、char 参与算术"。
   *    引用类型统一是 { type:'ref', ref:'#1' }，指向堆表里的对象。
   * ================================================================== */

  var NULL_VAL = { type: 'null', value: null };

  function V_INT(n) { return { type: 'int', value: n | 0 }; }
  function V_LONG(n, sat) { return { type: 'long', value: Math.trunc(n), sat: sat || '' }; }
  function V_DOUBLE(n) { return { type: 'double', value: +n }; }
  function V_FLOAT(n) { return { type: 'float', value: +n }; }
  function V_CHAR(code) { return { type: 'char', value: code & 0xffff }; }
  function V_BOOL(b) { return { type: 'boolean', value: !!b }; }
  function V_REF(id) { return { type: 'ref', ref: id }; }

  var FLOAT_TYPES = { double: 1, float: 1 };
  var INT_TYPES = { int: 1, long: 1, char: 1, short: 1, byte: 1 };

  function isNumericVal(v) {
    return v.type === 'int' || v.type === 'long' || v.type === 'double' || v.type === 'float' || v.type === 'char';
  }
  function isIntegralVal(v) { return v.type === 'int' || v.type === 'long' || v.type === 'char'; }
  function numOf(v) { return v.value; }
  function charStr(v) { return String.fromCharCode(v.value); }

  /** Java 的 double 打印规则（与 Double.toString 对齐）：
   *    - 0.001 <= |x| < 1e7：定点写法，整数值补 ".0"（3 → "3.0"）
   *    - 其余（含 0.0001、1e7、1e20）：科学计数 "1.23456789E8"，指数不带 +、不补零
   *    - -0.0 要保留符号；NaN / Infinity / -Infinity 原样
   */
  function doubleStr(n) {
    if (typeof n !== 'number') return String(n);
    if (n !== n) return 'NaN';
    if (n === Infinity) return 'Infinity';
    if (n === -Infinity) return '-Infinity';
    if (n === 0) return 1 / n === -Infinity ? '-0.0' : '0.0';
    var abs = Math.abs(n);
    if (abs >= 1e-3 && abs < 1e7) {
      var s = String(n);
      if (s.indexOf('.') < 0 && s.indexOf('e') < 0 && s.indexOf('E') < 0) s += '.0';
      return s;
    }
    /* 科学计数：取最短可回读的尾数，再按 Java 规则补 ".0" 与指数 */
    var e = n.toExponential();
    var parts = e.split('e');
    var mant = parts[0];
    if (mant.indexOf('.') < 0) mant += '.0';
    return mant + 'E' + parseInt(parts[1], 10);
  }
  function floatStr(n) { return doubleStr(n); }

  function booleanStr(b) { return b ? 'true' : 'false'; }

  /** 值的显示文本（用于变量表 / 内存图 / 输出） */
  function displayOf(v) {
    switch (v.type) {
      case 'int': case 'long':
        if (v.type === 'long' && v.sat === 'max') return '9223372036854775807';
        if (v.type === 'long' && v.sat === 'min') return '-9223372036854775808';
        return String(v.value);
      case 'double': return doubleStr(v.value);
      case 'float': return floatStr(v.value);
      case 'char': return charStr(v);
      case 'boolean': return booleanStr(v.value);
      case 'String': return '"' + v.value + '"';
      case 'null': return 'null';
      case 'ref': return v.ref;
      default: return String(v.value);
    }
  }

  /** 把「声明类型字符串」拆成 { name, dims } */
  function splitType(t) {
    var dims = 0;
    while (t.length > 2 && t.slice(-2) === '[]') { t = t.slice(0, -2); dims++; }
    return { name: t, dims: dims };
  }
  function joinType(typeNode, extraDims) {
    var s = typeNode.name;
    for (var i = 0; i < (typeNode.dims || 0) + (extraDims || 0); i++) s += '[]';
    return s;
  }

  /** 取类型字符串里的类名（字段解析只需要类名；数组去掉 []，基本类型返回 null） */
  function classTypeOf(typeStr) {
    if (!typeStr) return null;
    var s = String(typeStr).replace(/(\[\])+$/, '');
    if (/^(int|long|double|float|char|boolean|byte|short|void)$/.test(s)) return null;
    return s;
  }

  /* ==================================================================
   * 5. 堆（Heap）与对象分配
   *    为什么要有堆表：内存图必须能画出"两个变量指向同一个数组"的别名关系，
   *    所以引用必须是一个 id，而不是 JS 对象引用本身。
   * ================================================================== */

  function Machine(opts) {
    this.opts = opts || {};
    /* 默认限额：关掉快照后普通程序跑得快，步数上限放到 100 万，避免把正常算法误判成死循环；
       死循环仍由 2 秒超时兜底（见 _dev/engine-tests 组 12） */
    this.maxSteps = this.opts.maxSteps > 0 ? this.opts.maxSteps : 1000000;
    this.timeoutMs = this.opts.timeoutMs > 0 ? this.opts.timeoutMs : 2000;
    this.maxDepth = this.opts.maxDepth > 0 ? this.opts.maxDepth : 1000;
    this.stdinText = typeof this.opts.stdin === 'string' ? this.opts.stdin : '';

    this.output = '';
    this.steps = 0;
    this.line = 0;
    this.frames = [];
    this.heap = Object.create(null);
    this.heapSeq = 0;
    this.frameUid = 0;
    this.strSeq = 0;
    this.stringPool = Object.create(null);
    this.statics = Object.create(null);
    this.staticsReady = Object.create(null);
    this.scannerPos = 0;          /* 所有 Scanner 共享同一条输入流（System.in 只有一份） */
    this.silent = 0;              /* >0 时执行不产快照（静态初始化等工作噪音用） */
    /* run() 只关心输出，不需要逐语句快照：关掉后普通程序快 3~20 倍（见 _dev/engine-tests 性能回归） */
    this.collectSnapshots = this.opts.snapshots !== false;
    this.done = false;
    this.error = null;
    this.program = null;
    this.classes = Object.create(null);
    this.startTime = 0;
    this._prevPrint = Object.create(null);
    this._prevLine = 0;
  }

  /* ---- 字符串：字面量进常量池（保证 "a" == "a" 为 true），new String 不进池 ---- */
  Machine.prototype.internString = function (s) {
    if (this.stringPool[s]) return this.stringPool[s];
    var v = { type: 'String', value: s, sid: ++this.strSeq };
    this.stringPool[s] = v;
    return v;
  };
  Machine.prototype.newString = function (s) {
    return { type: 'String', value: String(s), sid: ++this.strSeq };
  };

  /* ---- 堆分配 ---- */
  Machine.prototype.alloc = function (kind, typeName, classChain) {
    var id = '#' + (++this.heapSeq);
    var obj = {
      id: id,
      kind: kind,                 /* 'array' | 'object' | 'list' | 'map' | 'set' */
      type: typeName,
      classChain: classChain || [],
      elements: null,
      entries: null,
      fields: null,
      fieldOrder: null
    };
    if (kind === 'array') {
      obj.elements = [];
      obj.elemType = typeName.slice(0, -2) || 'int';
    } else if (kind === 'list' || kind === 'set') {
      obj.elements = [];
      obj.elemType = 'Object';
    } else if (kind === 'map') {
      obj.entries = [];
    } else {
      obj.fields = Object.create(null);
      obj.fieldOrder = [];
    }
    this.heap[id] = obj;
    return obj;
  };

  /* ---- 集合工厂（ArrayList / HashMap / HashSet 都用堆对象表示，方便内存图展示） ---- */
  Machine.prototype.makeList = function () {
    return V_REF(this.alloc('list', 'ArrayList', ['ArrayList', 'List', 'Collection', 'Object']).id);
  };
  Machine.prototype.makeMap = function () {
    return V_REF(this.alloc('map', 'HashMap', ['HashMap', 'Map', 'Object']).id);
  };
  Machine.prototype.makeSet = function () {
    return V_REF(this.alloc('set', 'HashSet', ['HashSet', 'Set', 'Collection', 'Object']).id);
  };

  Machine.prototype.getRef = function (ref) { return this.heap[ref] || null; };

  /** 从引用值安全地取对象；null 引用时抛出与 Java 相同的 NPE 消息 */
  Machine.prototype.deref = function (v, what) {
    if (v.type === 'null') {
      throw javaEx('NullPointerException', 'Cannot invoke "' + (what || 'method') + '" because the reference is null',
        '变量是 null，说明它还没有指向任何对象：先用 new 创建对象，再调用方法/字段');
    }
    if (v.type !== 'ref') return null;
    var o = this.heap[v.ref];
    if (!o) throw javaEx('NullPointerException', '引用 ' + v.ref + ' 已失效', '');
    return o;
  };

  /** 把堆对象的标识成 "Point@1a2b3c" 风格（Java 默认 toString 的形式） */
  Machine.prototype.objectHash = function (obj) {
    var n = 0;
    for (var i = 1; i < obj.id.length; i++) n = (n * 31 + obj.id.charCodeAt(i)) | 0;
    return (n >>> 0).toString(16);
  };

  /* ==================================================================
   * 6. 类元数据：继承链、字段表、方法查找
   * ================================================================== */

  Machine.prototype.prepare = function (program) {
    this.program = program;
    var classes = this.classes = Object.create(null);
    for (var i = 0; i < program.classes.length; i++) {
      var c = program.classes[i];
      if (classes[c.name]) {
        throw jerr('compile', 'DuplicateClass', '类 ' + c.name + ' 重复定义', c.line, '同一个类名只能出现一次');
      }
      classes[c.name] = c;
    }
    if (!classes.Object) {
      classes.Object = { k: 'ClassDecl', name: 'Object', mods: [], superName: null, interfaces: [], members: [], line: 0 };
    }
    /* 顺手检查继承关系里的死循环（A extends B, B extends A） */
    var names = Object.keys(classes);
    for (var j = 0; j < names.length; j++) this.ancestorsOf(names[j]);
  };

  Machine.prototype.getClass = function (name) { return this.classes[name] || null; };

  /** 继承链（自己在前、Object 在后），同时检测循环继承 */
  Machine.prototype.ancestorsOf = function (name) {
    var chain = [];
    var cur = name;
    var guard = 0;
    while (cur) {
      if (chain.indexOf(cur) >= 0) {
        throw jerr('compile', 'InheritanceCycle', '类的继承关系出现了循环：' + chain.join(' → ') + ' → ' + cur, 0,
          '检查 extends 的方向，子类不能反过来继承自己的子类');
      }
      chain.push(cur);
      var c = this.classes[cur];
      if (!c) break;
      cur = c.superName || null;
      if (++guard > 200) break;
    }
    if (chain.indexOf('Object') < 0) chain.push('Object');
    return chain;
  };

  /** 对象可被赋值/instanceof 判断的全部类型名（类 + 所有接口，含父类实现的接口） */
  Machine.prototype.allTypesOf = function (name) {
    var out = [];
    var chain = this.ancestorsOf(name);
    for (var i = 0; i < chain.length; i++) {
      var c = this.classes[chain[i]];
      if (!c) continue;
      out.push(c.name);
      var list = (c.interfaces || []).slice();
      while (list.length) {
        var iface = list.shift();
        if (out.indexOf(iface) < 0) out.push(iface);
        var ic = this.classes[iface];
        if (ic) list = list.concat((ic.interfaces || []));
      }
    }
    return out;
  };

  /** 沿继承链收集字段声明（父类字段在前，用于内存图展示顺序） */
  Machine.prototype.fieldsOf = function (clsName) {
    var chain = this.ancestorsOf(clsName).slice().reverse();
    var out = [];
    for (var i = 0; i < chain.length; i++) {
      var c = this.classes[chain[i]];
      if (!c) continue;
      for (var m = 0; m < c.members.length; m++) {
        var mem = c.members[m];
        if (mem.k !== 'FieldDecl') continue;
        for (var d = 0; d < mem.decls.length; d++) {
          out.push({
            owner: c.name, name: mem.decls[d].name, type: joinType(mem.type, mem.decls[d].dims),
            init: mem.decls[d].init, mods: mem.mods, line: mem.decls[d].line
          });
        }
      }
    }
    return out;
  };

  Machine.prototype.findField = function (clsName, fieldName) {
    var fields = this.fieldsOf(clsName);
    for (var i = fields.length - 1; i >= 0; i--) if (fields[i].name === fieldName) return fields[i];
    return null;
  };

  /**
   * 推断表达式的"编译期声明类型"，用于字段访问（字段看声明类型）。
   * 只覆盖课程里会出现的简单形态：变量、this、super、括号、强转、new、字段链；
   * 方法调用的返回类型不追踪（返回 null → 退回按实际类型解析，保持宽松）。
   */
  Machine.prototype.typeOfExpr = function (node) {
    if (!node) return null;
    switch (node.k) {
      case 'Ident': {
        var slot = this.lookupVar(node.name);
        return slot ? slot.type : null;
      }
      case 'This': {
        var f = this.curFrame();
        return f ? f.cls : null;
      }
      case 'Super': {
        var f2 = this.curFrame();
        var c = f2 && this.classes[f2.cls];
        return c ? (c.superName || 'Object') : null;
      }
      case 'Paren': return this.typeOfExpr(node.expr);
      case 'Cast': return joinType(node.type, 0);
      case 'NewObject': return node.type;
      case 'NewArray': {
        var t = node.type;
        for (var i = 0; i < node.dims.length; i++) t += '[]';
        return t;
      }
      case 'Member': {
        var bt = classTypeOf(this.typeOfExpr(node.obj));
        if (!bt) return null;
        var m = this.findField(bt, node.name);
        return m ? m.type : null;
      }
      default: return null;
    }
  };

  /** 收集某个名字的全部方法候选（本类 → 父类 → 接口 default 方法），保留顺序信息 */
  Machine.prototype.findMethodCandidates = function (clsName, name) {
    var out = [];
    var chain = this.ancestorsOf(clsName);
    for (var i = 0; i < chain.length; i++) {
      var c = this.classes[chain[i]];
      if (!c) continue;
      for (var m = 0; m < c.members.length; m++) {
        var mem = c.members[m];
        if (mem.k === 'MethodDecl' && mem.name === name) out.push({ method: mem, owner: c, order: i });
      }
    }
    var all = this.allTypesOf(clsName);
    for (var j = 0; j < all.length; j++) {
      var ic = this.classes[all[j]];
      if (!ic || !ic.isInterface) continue;
      for (var k = 0; k < ic.members.length; k++) {
        var im = ic.members[k];
        if (im.k === 'MethodDecl' && im.name === name) out.push({ method: im, owner: ic, order: 50 + j });
      }
    }
    return out;
  };

  /**
   * 实参对形参的"匹配得分"：完全相同 5 分，可隐式提升 2~4 分，
   * 子类→父类按继承距离降分；返回 -1 表示不能赋值。
   * 重载决议就是靠这个分数选最合适的那个方法（否则 max(3.5,2.5) 会错配成 max(int,int)）。
   */
  Machine.prototype.assignScore = function (formalType, val) {
    if (!val) return -1;
    var f = splitType(formalType);
    var vt = val.type;

    if (f.dims > 0) {
      if (vt === 'null') return 2;
      if (vt !== 'ref') return -1;
      var ao = this.heap[val.ref];
      if (!ao) return -1;
      if (ao.kind !== 'array') return -1;
      return 4;
    }

    switch (f.name) {
      case 'int':
        if (vt === 'int') return 5;
        if (vt === 'char') return 4;
        return -1;
      case 'long':
        if (vt === 'long') return 5;
        if (vt === 'int') return 4;
        if (vt === 'char') return 3;
        return -1;
      case 'double': case 'float':
        if (vt === 'double' || vt === 'float') return 5;
        if (vt === 'long') return 3;
        if (vt === 'int' || vt === 'char') return 2;
        return -1;
      case 'byte': case 'short':
        if (vt === 'int') return 3;
        if (vt === 'char') return 2;
        return -1;
      case 'char':
        return vt === 'char' ? 5 : -1;
      case 'boolean':
        return vt === 'boolean' ? 5 : -1;
      default: break;
    }

    /* 引用类型 */
    if (vt === 'null') return 2;
    if (f.name === 'String') return vt === 'String' ? 5 : -1;
    if (vt === 'String') {
      if (f.name === 'CharSequence') return 3;
      if (f.name === 'Object') return 2;
      return -1;
    }
    if (vt !== 'ref') return -1;
    var obj = this.heap[val.ref];
    if (!obj) return -1;
    var idx = obj.classChain.indexOf(f.name);
    if (idx < 0) return -1;
    return Math.max(1, 4 - idx);
  };

  /** 一组实参对一组形参的总分；-1 表示不匹配 */
  Machine.prototype.matchScore = function (params, args) {
    var score = 0;
    for (var i = 0; i < params.length; i++) {
      var p = params[i];
      var pt = joinType(p.type, 0);
      if (p.varargs) {
        var elemType = pt.slice(0, -2);
        for (var k = i; k < args.length; k++) {
          var sv = this.assignScore(elemType, args[k]);
          if (sv < 0) return -1;
          score += sv * 0.5;
        }
        return score;
      }
      if (i >= args.length) return -1;
      var s = this.assignScore(pt, args[i]);
      if (s < 0) return -1;
      score += s;
    }
    return args.length === params.length ? score : -1;
  };

  /**
   * 按名字 + 实参找方法：先按个数筛，再按 assignScore 选最匹配的重载。
   * argVals 可以传实参数组（推荐）或纯个数（仅用于无参场景，如 toString）。
   */
  Machine.prototype.findMethod = function (clsName, name, argVals) {
    var args = Array.isArray(argVals) ? argVals : null;
    var argc = args ? args.length : (argVals || 0);
    var cands = this.findMethodCandidates(clsName, name);
    var best = null, bestScore = -1, bestOrder = 1e9;
    for (var i = 0; i < cands.length; i++) {
      var cd = cands[i];
      if (!this.paramsMatch(cd.method.params, argc)) continue;
      var score = 1;
      if (args) {
        score = this.matchScore(cd.method.params, args);
        if (score < 0) continue;
      }
      /* 分数高者优先；同分时继承链更近的优先（子类覆盖父类） */
      if (score > bestScore || (score === bestScore && cd.order < bestOrder)) {
        best = cd; bestScore = score; bestOrder = cd.order;
      }
    }
    return best;
  };

  Machine.prototype.paramsMatch = function (params, argc) {
    for (var i = 0; i < params.length; i++) {
      if (params[i].varargs) return argc >= params.length - 1;
    }
    return params.length === argc;
  };

  Machine.prototype.findCtor = function (clsName, argVals) {
    var c = this.classes[clsName];
    if (!c) return null;
    var args = Array.isArray(argVals) ? argVals : null;
    var argc = args ? args.length : (argVals || 0);
    var best = null, bestScore = -1;
    for (var m = 0; m < c.members.length; m++) {
      var mem = c.members[m];
      if (mem.k !== 'CtorDecl') continue;
      if (!this.paramsMatch(mem.params, argc)) continue;
      var score = 1;
      if (args) {
        score = this.matchScore(mem.params, args);
        if (score < 0) continue;
      }
      if (score > bestScore) { best = mem; bestScore = score; }
    }
    return best;
  };

  Machine.prototype.hasCtor = function (clsName) {
    var c = this.classes[clsName];
    if (!c) return false;
    for (var m = 0; m < c.members.length; m++) if (c.members[m].k === 'CtorDecl') return true;
    return false;
  };

  /* ---- 帧与作用域 ---- */
  Machine.prototype.newFrame = function (name, clsName, thisVal, methodDecl) {
    var frame = {
      uid: ++this.frameUid,
      name: name,
      cls: clsName,
      line: methodDecl ? methodDecl.line : 0,
      scopes: [{ vars: Object.create(null), order: [] }],
      thisVal: thisVal || null,
      method: methodDecl || null,
      isCtor: false,
      callLine: methodDecl ? methodDecl.line : 0
    };
    this.frames.push(frame);
    return frame;
  };
  Machine.prototype.popFrame = function () { this.frames.pop(); };
  Machine.prototype.curFrame = function () { return this.frames[this.frames.length - 1]; };
  Machine.prototype.pushScope = function () {
    var f = this.curFrame();
    if (f) f.scopes.push({ vars: Object.create(null), order: [] });
  };
  Machine.prototype.popScope = function () {
    var f = this.curFrame();
    if (f && f.scopes.length > 1) f.scopes.pop();
  };

  Machine.prototype.declareVar = function (name, declType, val, line) {
    var f = this.curFrame();
    var scope = f.scopes[f.scopes.length - 1];
    if (scope.vars[name]) {
      throw typeErr('变量 ' + name + ' 已经在同一作用域里声明过了', line, '换一个变量名，或直接赋值而不是重新声明');
    }
    scope.vars[name] = { type: declType, val: val, line: line };
    scope.order.push(name);
  };

  Machine.prototype.lookupVar = function (name) {
    var f = this.curFrame();
    if (f) {
      for (var i = f.scopes.length - 1; i >= 0; i--) {
        if (f.scopes[i].vars[name]) return f.scopes[i].vars[name];
      }
      /* Java 允许在实例方法里用裸名字访问本对象的字段（等价于 this.name）。
         这里返回一个"代理槽"，写回时用 __obj/__field 定位到堆对象。
         字段按"方法所在类"（f.cls，即声明类型）解析：父类方法里的 v 永远是父类那份，
         即使实际对象是子类、子类又隐藏了同名字段。 */
      if (f.thisVal && f.thisVal.type === 'ref') {
        var obj = this.heap[f.thisVal.ref];
        if (obj && obj.fields) {
          var meta = this.findField(f.cls || obj.type, name);
          if (meta && (meta.mods || []).indexOf('static') < 0) {
            var fkey = meta.owner + '.' + name;
            if (Object.prototype.hasOwnProperty.call(obj.fields, fkey)) {
              return { type: meta.type, val: obj.fields[fkey], line: 0, __obj: obj, __field: fkey };
            }
          }
        }
      }
      /* 类内部的静态字段也可以裸名字访问 */
      if (f.cls) {
        var chain = this.ancestorsOf(f.cls);
        for (var c = 0; c < chain.length; c++) {
          var st = this.statics[chain[c]];
          if (st && st[name]) return st[name];
        }
      }
    }
    return null;
  };

  Machine.prototype.setVar = function (name, val) {
    var f = this.curFrame();
    if (f) {
      for (var i = f.scopes.length - 1; i >= 0; i--) {
        if (f.scopes[i].vars[name]) { f.scopes[i].vars[name].val = val; return true; }
      }
      if (f.thisVal && f.thisVal.type === 'ref') {
        var obj = this.heap[f.thisVal.ref];
        if (obj && obj.fields) {
          var meta = this.findField(f.cls || obj.type, name);
          if (meta && (meta.mods || []).indexOf('static') < 0) {
            var fkey = meta.owner + '.' + name;
            if (Object.prototype.hasOwnProperty.call(obj.fields, fkey)) {
              obj.fields[fkey] = val;
              return true;
            }
          }
        }
      }
      if (f.cls) {
        var chain = this.ancestorsOf(f.cls);
        for (var c = 0; c < chain.length; c++) {
          var st = this.statics[chain[c]];
          if (st && st[name]) { st[name].val = val; return true; }
        }
      }
    }
    return false;
  };

  /* ---- 默认值与类型转换 ---- */
  function defaultValForType(typeStr) {
    var t = splitType(typeStr);
    if (t.dims > 0) return NULL_VAL;
    switch (t.name) {
      case 'int': return V_INT(0);
      case 'long': return V_LONG(0);
      case 'double': return V_DOUBLE(0);
      case 'float': return V_FLOAT(0);
      case 'char': return V_CHAR(0);
      case 'byte': case 'short': return V_INT(0);
      case 'boolean': return V_BOOL(false);
      default: return NULL_VAL;
    }
  }

  /** 窄化到 int 时按 Java 规则截断小数；超出范围则饱和（Java 的 (int) 行为） */
  function narrowToInt(n) {
    if (n !== n) return 0;
    if (n >= 2147483647) return 2147483647;
    if (n <= -2147483648) return -2147483648;
    return Math.trunc(n);
  }

  /* long 的可表示范围：JS number 在 2^63 附近只能存成 2^63，用 sat 标记保证打印与 Java 一致 */
  var LONG_MAX = 9.223372036854776e18;
  function narrowToLong(n) {
    if (n !== n) return V_LONG(0);
    if (n >= LONG_MAX) return V_LONG(LONG_MAX, 'max');
    if (n <= -LONG_MAX) return V_LONG(-LONG_MAX, 'min');
    return V_LONG(Math.trunc(n));
  }

  /** int 的 32 位回绕（用于复合赋值 / 窄化转换） */
  function wrapInt(n) { return n | 0; }

  /** 单个字符的数值（Character.digit 的近似）；非法返回 -1 */
  function charDigit(ch) {
    if (ch >= '0' && ch <= '9') return ch.charCodeAt(0) - 48;
    if (ch >= 'a' && ch <= 'z') return ch.charCodeAt(0) - 87;
    if (ch >= 'A' && ch <= 'Z') return ch.charCodeAt(0) - 55;
    return -1;
  }

  /**
   * 把值转换成声明类型要求的类型。
   * 这里同时承担"赋值兼容性检查"：不能隐式窄化（int x = 3.5 报错），
   * 因为学生考试里最常错的就是这个，引擎必须和 javac 一样严格。
   */
  Machine.prototype.coerceDecl = function (declType, val, line, forAssign) {
    var t = splitType(declType);
    var vt = val.type;

    if (t.dims > 0) {
      if (vt === 'null') return val;
      if (vt !== 'ref') throw typeErr('不兼容的类型：' + vt + ' 不能赋给 ' + declType, line,
        '数组变量需要用 new 创建或用数组字面量 {…} 赋值');
      var obj = this.heap[val.ref];
      if (obj && obj.kind !== 'array') throw typeErr('不兼容的类型：' + obj.type + ' 不是数组', line, '');
      return val;
    }

    switch (t.name) {
      case 'boolean':
        if (vt === 'boolean') return val;
        throw typeErr('不兼容的类型：' + vt + ' 不能赋给 boolean', line,
          '条件表达式的结果必须是 boolean（Java 不像 C 那样用数字代替 true/false）');
      case 'int':
        if (vt === 'int') return val;
        if (vt === 'char') return V_INT(val.value);
        /* 复合赋值（x += y / x++）等价于 x = (int)(x + y)：允许隐式收窄 */
        if (forAssign && isNumericVal(val)) return V_INT(narrowToInt(val.value));
        throw typeErr('不兼容的类型：' + vt + ' 不能自动转成 int', line,
          vt === 'double' || vt === 'float' ? '需要强制类型转换 (int) x（会丢掉小数部分）' : '需要强制类型转换');
      case 'long':
        if (vt === 'long') return val;
        if (vt === 'int' || vt === 'char') return V_LONG(val.value);
        if (forAssign && isNumericVal(val)) return narrowToLong(val.value);
        throw typeErr('不兼容的类型：' + vt + ' 不能自动转成 long', line, '需要强制类型转换 (long) x');
      case 'double':
        if (vt === 'double') return val;
        if (vt === 'int' || vt === 'long' || vt === 'char' || vt === 'float') return V_DOUBLE(val.value);
        throw typeErr('不兼容的类型：' + vt + ' 不能转成 double', line);
      case 'float':
        if (vt === 'float') return val;
        if (vt === 'int' || vt === 'long' || vt === 'char' || vt === 'double') return V_FLOAT(val.value);
        if (forAssign && isNumericVal(val)) return V_FLOAT(val.value);
        throw typeErr('不兼容的类型：' + vt + ' 不能转成 float', line);
      case 'char':
        if (vt === 'char') return val;
        if (vt === 'int') return V_CHAR(val.value & 0xffff);
        if (forAssign && isNumericVal(val)) return V_CHAR(narrowToInt(val.value) & 0xffff);
        throw typeErr('不兼容的类型：' + vt + ' 不能转成 char', line, "字符要用单引号，如 'a'");
      case 'byte':
        if (forAssign && isNumericVal(val)) {
          var nb0 = narrowToInt(val.value);
          return V_INT((nb0 << 24) >> 24);      /* Java 的复合赋值 / 自增：截断到 8 位 */
        }
        if (vt === 'int' || vt === 'char') {
          var nb = val.value;
          if (nb < -128 || nb > 127) {
            throw typeErr('不兼容的类型：' + nb + ' 超出 byte 的范围（-128 ~ 127）', line,
              'byte 只有 8 位；要截断请写 (byte) 强制转换');
          }
          return V_INT(nb);
        }
        throw typeErr('不兼容的类型：' + vt + ' 不能赋给 byte', line, '');
      case 'short':
        if (forAssign && isNumericVal(val)) {
          var ns0 = narrowToInt(val.value);
          return V_INT((ns0 << 16) >> 16);      /* Java 的复合赋值 / 自增：截断到 16 位 */
        }
        if (vt === 'int' || vt === 'char') {
          var ns = val.value;
          if (ns < -32768 || ns > 32767) {
            throw typeErr('不兼容的类型：' + ns + ' 超出 short 的范围（-32768 ~ 32767）', line,
              'short 只有 16 位；要截断请写 (short) 强制转换');
          }
          return V_INT(ns);
        }
        throw typeErr('不兼容的类型：' + vt + ' 不能赋给 short', line, '');
      default: break;
    }

    /* ---- 引用类型 ---- */
    if (vt === 'null') return val;
    if (t.name === 'String') {
      if (vt === 'String') return val;
      if (vt === 'null') return val;
      throw typeErr('不兼容的类型：' + vt + ' 不能赋给 String', line,
        '需要的是字符串，可以写 String.valueOf(x) 或 "" + x');
    }
    if (t.name === 'Object') {
      if (vt === 'ref' || vt === 'String') return val;
      throw typeErr('不兼容的类型：基本类型 ' + vt + ' 不能直接赋给 Object', line,
        '本站暂不支持自动装箱（autoboxing），请用 Integer.valueOf(x) 之类显式包装');
    }
    if (vt !== 'ref') {
      throw typeErr('不兼容的类型：' + vt + ' 不能赋给 ' + declType, line,
        '基本类型和对象类型不能直接互转');
    }
    var target = this.heap[val.ref];
    if (!target) throw typeErr('不兼容的类型：引用 ' + val.ref + ' 已失效', line);
    if (target.classChain.indexOf(t.name) >= 0) return val;
    throw typeErr('不兼容的类型：' + target.type + ' 不能赋给 ' + declType, line,
      '子类对象可以赋给父类引用（向上转型），反过来需要强制类型转换');
  };

  /* ==================================================================
   * 7. 单步执行骨架
   *    每个语句执行前 yield 一个内存快照 —— 这就实现了"语句级单步"。
   *    为什么用 generator 而不是回调/事件：yield 让"暂停/继续"和调用栈
   *    天然对应，递归方法调用进入/返回时帧的增删完全自动。
   * ================================================================== */

  /** 每执行一条语句前调用：计步、检查死循环、产出快照 */
  Machine.prototype.step = function* (line) {
    this.line = line;
    this.steps++;
    if (this.steps > this.maxSteps) {
      throw jerr('runtime', 'ExecutionLimit',
        '执行步数超过上限（' + this.maxSteps + ' 步），程序可能陷入了死循环', line,
        '检查 while / for 的条件是否最终会变成 false，或循环变量有没有更新');
    }
    if ((this.steps & 127) === 0 && Date.now() - this.startTime > this.timeoutMs) {
      throw jerr('runtime', 'RuntimeTimeout',
        '执行时间超过上限（' + this.timeoutMs + 'ms），程序可能太慢或陷入死循环', line,
        '减少循环次数，或检查递归/循环的终止条件');
    }
    if (this.silent > 0 || !this.collectSnapshots) return;
    yield this.snapshot();
  };

  /** 执行一个语句块；遇到 break/continue/return 时把信号原样向上传 */
  Machine.prototype.execBlock = function* (block) {
    if (!block) return null;
    this.pushScope();
    try {
      for (var i = 0; i < block.stmts.length; i++) {
        var sig = yield* this.execStmt(block.stmts[i]);
        if (sig) return sig;
      }
      return null;
    } finally {
      this.popScope();
    }
  };

  /** 执行单条语句。返回 null 表示继续，否则返回控制流信号
   *  loopLabel：本循环自己的标签（由 Labeled 传入），用于判断 "continue outer" 是否该由本层消化
   */
  Machine.prototype.execStmt = function* (stmt, loopLabel) {
    if (!stmt) return null;
    switch (stmt.k) {
      case 'Empty':
        return null;

      case 'Block':
        return yield* this.execBlock(stmt);

      case 'VarDecl':
        yield* this.step(stmt.line);
        yield* this.execVarDecl(stmt);
        return null;

      case 'ExprStmt':
        yield* this.step(stmt.line);
        yield* this.evalExpr(stmt.expr);
        return null;

      case 'If': {
        yield* this.step(stmt.line);
        var cond = yield* this.evalExpr(stmt.cond);
        if (this.truthy(cond, stmt.line, 'if 的条件')) {
          if (stmt.then) return yield* this.execStmt(stmt.then);
        } else if (stmt.alt) {
          return yield* this.execStmt(stmt.alt);
        }
        return null;
      }

      case 'While': {
        yield* this.step(stmt.line);
        for (var guard = 0; ; guard++) {
          var c = yield* this.evalExpr(stmt.cond);
          if (!this.truthy(c, stmt.line, 'while 的条件')) break;
          var sig = yield* this.execStmt(stmt.body);
          if (sig) {
            if (sig.kind === 'break') { if (sig.label) return sig; break; }
            /* continue：没有标签、或标签就是本循环 → 继续下一轮；否则交给外层 */
            if (sig.kind === 'continue') { if (sig.label && sig.label !== loopLabel) return sig; }
            else return sig;
          }
          yield* this.step(stmt.line);
        }
        return null;
      }

      case 'DoWhile': {
        yield* this.step(stmt.line);
        for (;;) {
          var sig2 = yield* this.execStmt(stmt.body);
          if (sig2) {
            if (sig2.kind === 'break') { if (sig2.label) return sig2; break; }
            if (sig2.kind === 'continue') { if (sig2.label && sig2.label !== loopLabel) return sig2; }
            else return sig2;
          }
          var c2 = yield* this.evalExpr(stmt.cond);
          if (!this.truthy(c2, stmt.line, 'do-while 的条件')) break;
          yield* this.step(stmt.line);
        }
        return null;
      }

      case 'For': {
        this.pushScope();
        try {
          if (stmt.init) {
            if (stmt.init.k === 'VarDecl') yield* this.execVarDecl(stmt.init);
            else yield* this.evalExprList(stmt.init.exprs);
          }
          yield* this.step(stmt.line);
          for (;;) {
            if (stmt.cond) {
              var c3 = yield* this.evalExpr(stmt.cond);
              if (!this.truthy(c3, stmt.line, 'for 的条件')) break;
            }
            var sig3 = yield* this.execStmt(stmt.body);
            if (sig3) {
              if (sig3.kind === 'break') { if (sig3.label) return sig3; break; }
              if (sig3.kind === 'continue') { if (sig3.label && sig3.label !== loopLabel) return sig3; }
              else return sig3;
            }
            if (stmt.update) yield* this.evalExprList(stmt.update.exprs);
            yield* this.step(stmt.line);
          }
        } finally {
          this.popScope();
        }
        return null;
      }

      case 'ForEach': {
        var iterVal = yield* this.evalExpr(stmt.iter);
        var items = this.iterateOver(iterVal, stmt.line, stmt.iter);
        yield* this.step(stmt.line);
        this.pushScope();
        try {
          var declType = joinType(stmt.type, 0);
          this.declareVar(stmt.name, declType, defaultValForType(declType), stmt.line);
          for (var idx = 0; idx < items.length; idx++) {
            var elem = items[idx];
            var coerced = this.coerceDecl(declType, elem, stmt.line);
            this.setVar(stmt.name, coerced);
            var sig4 = yield* this.execStmt(stmt.body);
            if (sig4) {
              if (sig4.kind === 'break') { if (sig4.label) return sig4; break; }
              if (sig4.kind === 'continue') { if (sig4.label && sig4.label !== loopLabel) return sig4; }
              else return sig4;
            }
            yield* this.step(stmt.line);
          }
        } finally {
          this.popScope();
        }
        return null;
      }

      case 'Switch': {
        yield* this.step(stmt.line);
        var subj = yield* this.evalExpr(stmt.subject);
        var startIdx = -1, defIdx = -1;
        for (var ci = 0; ci < stmt.cases.length; ci++) {
          var cs = stmt.cases[ci];
          if (cs.isDefault) { defIdx = ci; continue; }
          var tv = yield* this.evalExpr(cs.test);
          if (this.valueEquals(subj, tv)) { startIdx = ci; break; }
        }
        if (startIdx < 0) startIdx = defIdx;
        if (startIdx < 0) return null;
        for (var cj = startIdx; cj < stmt.cases.length; cj++) {
          var body = stmt.cases[cj].stmts;
          for (var bk = 0; bk < body.length; bk++) {
            var sig5 = yield* this.execStmt(body[bk]);
            if (sig5) {
              if (sig5.kind === 'break') {
                if (sig5.label) return sig5;
                return null;
              }
              return sig5;
            }
          }
        }
        return null;
      }

      case 'Return': {
        yield* this.step(stmt.line);
        var rv = stmt.value ? yield* this.evalExpr(stmt.value) : { type: 'void', value: null };
        return { kind: 'return', value: rv };
      }

      case 'Break':
        yield* this.step(stmt.line);
        return { kind: 'break', label: stmt.label || null };

      case 'Continue':
        yield* this.step(stmt.line);
        return { kind: 'continue', label: stmt.label || null };

      case 'Labeled': {
        /* 把标签传给（可能是循环的）子语句：continue label 应该由该循环自己消化 */
        var sig6 = yield* this.execStmt(stmt.body, stmt.label);
        if (sig6 && (sig6.kind === 'break' || sig6.kind === 'continue') && sig6.label === stmt.label) return null;
        return sig6;
      }

      case 'InitBlock':
        /* 实例初始化块在构造对象时统一执行，走到这里说明是类体顶层，跳过 */
        return null;

      default:
        throw jerr('runtime', 'InternalError', '未知语句类型：' + stmt.k, stmt.line, '这多半是引擎的 bug');
    }
  };

  /** 变量声明语句（可带数组初始化 {…}） */
  Machine.prototype.execVarDecl = function* (stmt) {
    for (var i = 0; i < stmt.decls.length; i++) {
      var d = stmt.decls[i];
      var declType = joinType(stmt.type, d.dims);
      var val;
      if (d.init && d.init.k === 'ArrayInit') {
        val = yield* this.buildArrayFromInit(declType, d.init);
      } else if (d.init) {
        val = yield* this.evalExpr(d.init);
        val = this.coerceDecl(declType, val, d.line);
      } else {
        val = defaultValForType(declType);
      }
      this.declareVar(d.name, declType, val, d.line);
    }
  };

  Machine.prototype.evalExprList = function* (exprs) {
    var last = NULL_VAL;
    for (var i = 0; i < exprs.length; i++) last = yield* this.evalExpr(exprs[i]);
    return last;
  };

  /** 增强 for 的迭代源：数组或 ArrayList */
  Machine.prototype.iterateOver = function (v, line, node) {
    if (v.type === 'null') {
      throw javaEx('NullPointerException', '增强 for 的迭代对象是 null', '遍历之前先确保数组/集合已经创建并赋值');
    }
    if (v.type !== 'ref') {
      throw typeErr('增强 for 只能遍历数组或 ArrayList，不能遍历 ' + v.type, line, '数组用 int[] a = new int[3]; 集合用 ArrayList');
    }
    var obj = this.heap[v.ref];
    if (!obj) throw javaEx('NullPointerException', '引用已失效', '');
    if (obj.kind === 'array' || obj.kind === 'list' || obj.kind === 'set') return obj.elements.slice();
    if (obj.kind === 'map') {
      throw typeErr('HashMap 不能直接用于增强 for', line,
        '遍历 map 的键写成 for (String k : map.keySet())，遍历值用 map.values()');
    }
    throw typeErr('增强 for 不能遍历 ' + obj.type, line, '只支持数组、ArrayList、HashSet');
  };

  /** 数组字面量 {1,2,3} / {{1,2},{3,4}} → 堆对象 */
  Machine.prototype.buildArrayFromInit = function* (declType, init) {
    var t = splitType(declType);
    var elemType = t.dims > 1 ? (t.name + Array(t.dims).join('[]')) : t.name;
    var obj = this.alloc('array', declType);
    for (var i = 0; i < init.items.length; i++) {
      var itemNode = init.items[i];
      var val;
      if (itemNode.k === 'ArrayInit') {
        if (t.dims < 2) throw typeErr('数组初始化嵌套层级和声明类型不匹配', init.line, '二维数组要写成 {{1,2},{3,4}}');
        val = yield* this.buildArrayFromInit(elemType, itemNode);
      } else {
        val = yield* this.evalExpr(itemNode);
        val = this.coerceDecl(elemType, val, init.line);
      }
      obj.elements.push(val);
    }
    return V_REF(obj.id);
  };

  /** Java 的布尔转换：只有 boolean 能当条件用 */
  Machine.prototype.truthy = function (v, line, what) {
    if (v.type === 'boolean') return v.value;
    throw typeErr((what || '条件') + '必须是 boolean，实际是 ' + v.type, line,
      'Java 里不能用数字当条件，要写成 x != 0 而不是 x');
  };

  /** Java 的 == 语义：基本类型比值，引用类型比"是不是同一个对象" */
  Machine.prototype.valueEquals = function (a, b) {
    if (a.type === 'String' || b.type === 'String') {
      if (a.type !== b.type) return false;
      return a.sid === b.sid;      /* 字符串是引用类型，== 比身份；内容比较用 equals */
    }
    if (a.type === 'null' || b.type === 'null') return a.type === 'null' && b.type === 'null';
    if (a.type === 'ref' || b.type === 'ref') {
      if (a.type !== 'ref' || b.type !== 'ref') return false;
      return a.ref === b.ref;
    }
    if (isNumericVal(a) && isNumericVal(b)) return a.value === b.value;
    if (a.type === 'boolean' && b.type === 'boolean') return a.value === b.value;
    return false;
  };

  function rep(s, n) { var r = ''; for (var i = 0; i < n; i++) r += s; return r; }

  /**
   * Java String.split 的宽松实现：支持课程常见正则（","、" +"、"[0-9]"、"\\s+"、"\\."、"|" 等）。
   * 关键点：
   *   - limit > 0：最多 limit 段（最后一段收下剩余内容）；limit == 1 直接返回整串
   *   - limit == 0：去掉末尾空串；limit < 0：保留末尾空串
   *   - 正则写错/用了本站不支持的语法时显式报错，绝不静默按字面量切
   */
  function javaSplit(str, sep, limit, line) {
    if (sep === '') {
      var chars = [];
      for (var ci = 0; ci < str.length; ci++) chars.push(str.charAt(ci));
      return chars;
    }
    var re;
    try {
      re = new RegExp(sep, 'g');
    } catch (e) {
      throw jerr('runtime', 'UnsupportedRegex',
        '本站的 String.split 暂不支持这个正则：' + sep, line,
        '可以用普通分隔符（如 ","）、空格类 " +"、字符类 "[0-9]"、转义点 "\\\\."');
    }
    if (limit === 1) return [str];
    var out = [], last = 0, m;
    while ((m = re.exec(str)) !== null) {
      if (m[0] === '') { re.lastIndex++; continue; }   /* 零宽匹配防死循环 */
      out.push(str.slice(last, m.index));
      last = m.index + m[0].length;
      if (limit > 0 && out.length === limit - 1) break;
    }
    out.push(str.slice(last));
    if (limit === 0) { while (out.length > 0 && out[out.length - 1] === '') out.pop(); }
    return out;
  }

  /* ==================================================================
   * 8. 表达式求值
   *    全部写成 generator：因为表达式里可能调用用户方法，
   *    而方法体执行需要 yield 出单步快照。
   * ================================================================== */

  Machine.prototype.write = function (s) { this.output += s; };

  Machine.prototype.evalExpr = function* (node) {
    if (!node) return NULL_VAL;
    switch (node.k) {
      case 'Literal': {
        switch (node.litType) {
          case 'int': return V_INT(node.value);
          case 'long': return V_LONG(node.value);
          case 'double': return V_DOUBLE(node.value);
          case 'float': return V_FLOAT(node.value);
          case 'char': return V_CHAR(node.value.charCodeAt(0));
          case 'boolean': return V_BOOL(node.value);
          case 'String': return this.internString(node.value);
          case 'null': return NULL_VAL;
          default: return NULL_VAL;
        }
      }

      case 'Paren': return yield* this.evalExpr(node.expr);

      case 'Ident': {
        var slot = this.lookupVar(node.name);
        if (slot) return slot.val;
        if (this.classes[node.name]) {
          /* 类名当值用（C.field / C.m()）→ 触发该类的静态初始化（JVM 惰性语义） */
          if (!this.staticsReady[node.name]) yield* this.ensureStatics(node.name);
          return { type: 'classref', value: node.name };
        }
        if (LIB_CLASS[node.name]) return { type: 'classref', value: node.name };
        throw jerr('compile', 'CannotFindSymbol', '找不到符号: 变量 ' + node.name, node.line,
          '检查拼写（区分大小写），或先声明这个变量：int ' + node.name + ' = 0;');
      }

      case 'This': {
        var f = this.curFrame();
        if (!f || !f.thisVal) {
          throw jerr('compile', 'ThisInStatic', '不能在静态方法里使用 this', node.line,
            'static 方法属于类本身，没有 this（它不知道"哪个对象"）；去掉 static，或用类名.方法名调用');
        }
        return f.thisVal;
      }

      case 'Member': return yield* this.evalMember(node);
      case 'Index': return yield* this.evalIndex(node);
      case 'Call': return yield* this.evalCall(node);
      case 'NewObject': {
        var args = yield* this.evalArgs(node.args);
        return yield* this.construct(joinType(node.type, 0), args, node.line);
      }
      case 'NewArray': return yield* this.evalNewArray(node);
      case 'Binary': return yield* this.evalBinary(node);
      case 'Unary': return yield* this.evalUnary(node);
      case 'Assign': return yield* this.evalAssign(node);
      case 'Update': return yield* this.evalUpdate(node);
      case 'Cond': {
        var c = yield* this.evalExpr(node.cond);
        if (this.truthy(c, node.line, '三元表达式 ? : 的条件')) return yield* this.evalExpr(node.thenExpr);
        return yield* this.evalExpr(node.elseExpr);
      }
      case 'Cast': return yield* this.evalCast(node);
      case 'InstanceOf': {
        var v = yield* this.evalExpr(node.expr);
        return V_BOOL(this.instanceOf(v, joinType(node.type, 0)));
      }
      case 'ArrayInit':
        throw typeErr('数组字面量 {…} 只能用在声明或 new 的时候', node.line,
          '写法：int[] a = {1, 2, 3}; 或 int[] a = new int[]{1, 2, 3};');
      case 'ThisCall': case 'SuperCall':
        throw jerr('compile', 'MisplacedCtorCall', '(this(...) / super(...)) 只能写在构造器的第一行', node.line,
          '构造器之间的调用必须放在最前面');
      default:
        throw jerr('runtime', 'InternalError', '未知表达式类型：' + node.k, node.line, '这多半是引擎的 bug');
    }
  };

  Machine.prototype.evalArgs = function* (nodes) {
    var out = [];
    for (var i = 0; i < nodes.length; i++) out.push(yield* this.evalExpr(nodes[i]));
    return out;
  };

  /** 把 Member 链拼成限定名：java.util.Arrays → "java.util.Arrays" */
  function qualifiedNameOf(node) {
    if (!node) return null;
    if (node.k === 'Ident') return node.name;
    if (node.k === 'Paren') return qualifiedNameOf(node.expr);
    if (node.k === 'Member') {
      var base = qualifiedNameOf(node.obj);
      return base ? base + '.' + node.name : null;
    }
    return null;
  }

  Machine.prototype.evalMember = function* (node) {
    /* 限定类名写法：java.util.Arrays.toString(...) / java.util.ArrayList 等 */
    var qn = qualifiedNameOf(node);
    if (qn && qn.indexOf('.') >= 0) {
      var parts = qn.split('.');
      var last = parts[parts.length - 1];
      if ((LIB_CLASS[last] || this.classes[last]) && !this.lookupVar(parts[0])) {
        if (this.classes[last] && !this.staticsReady[last]) yield* this.ensureStatics(last);
        return { type: 'classref', value: last };
      }
    }
    if (node.obj.k === 'Super') {
      var f = this.curFrame();
      var superName = (this.classes[f.cls] || {}).superName || 'Object';
      var fieldMeta = this.findField(superName, node.name);
      if (!fieldMeta) throw jerr('compile', 'CannotFindSymbol', '父类里找不到字段 ' + node.name, node.line, '');
      var obj0 = this.deref(f.thisVal, 'field');
      var fkeySuper = fieldMeta.owner + '.' + node.name;
      return Object.prototype.hasOwnProperty.call(obj0.fields, fkeySuper)
        ? obj0.fields[fkeySuper] : defaultValForType(fieldMeta.type);
    }
    var obj = yield* this.evalExpr(node.obj);
    if (obj.type === 'classref' && this.classes[obj.value] && !this.staticsReady[obj.value]) {
      yield* this.ensureStatics(obj.value);
    }
    /* 字段访问按"变量的声明类型"解析（Base b = new Child(); b.v 取 Base.v），
       方法调用仍然按实际类型虚分派——这是 Java 里字段隐藏 vs 方法重写的关键区别 */
    return this.memberOf(obj, node.name, node.line, this.typeOfExpr(node.obj));
  };

  Machine.prototype.memberOf = function (obj, name, line, declType) {
    if (obj.type === 'classref') {
      if (obj.value === 'System') {
        if (name === 'out') return { type: 'sysout' };
        if (name === 'err') return { type: 'sysout' };
        if (name === 'in') return { type: 'sysin' };
      }
      if (name === 'getSimpleName' || name === 'getName') return obj;  /* obj.getClass() 之后的方法 */
      return this.staticField(obj.value, name, line);
    }
    if (obj.type === 'null') {
      throw javaEx('NullPointerException', 'Cannot read field "' + name + '" because the reference is null',
        '变量是 null，还没有指向任何对象：先用 new 创建对象');
    }
    if (obj.type === 'String') {
      throw jerr('compile', 'CannotFindSymbol', 'String 没有字段 ' + name, line,
        '取长度用 s.length()，取字符用 s.charAt(i)，比较内容用 s.equals(t)');
    }
    if (obj.type === 'ref') {
      var o = this.heap[obj.ref];
      if (!o) throw javaEx('NullPointerException', '引用已失效', '');
      if (o.kind === 'array') {
        if (name === 'length') return V_INT(o.elements.length);
        throw jerr('compile', 'CannotFindSymbol', '数组没有字段 ' + name + '（数组只有 length）', line,
          '取长度写 arr.length（注意：不是 length()，没有括号）');
      }
      if (o.kind === 'list') {
        throw jerr('compile', 'CannotFindSymbol', 'ArrayList 没有字段 ' + name, line,
          '集合用方法：list.size()、list.get(i)（不是 list.length）');
      }
      if (o.fields) {
        /* 先按声明类型找字段（声明类型没有该字段时再退回实际类型，保持宽松） */
        var declCls = classTypeOf(declType) || o.type;
        var meta = this.findField(declCls, name) || this.findField(o.type, name);
        if (meta) {
          if ((meta.mods || []).indexOf('static') >= 0) {
            /* Java 允许通过实例访问 static 字段（编译期只是警告），值属于类 */
            var sf = this.findStaticField(o.type, name);
            if (sf) return sf.val;
          } else {
            var fkey = meta.owner + '.' + name;
            if (Object.prototype.hasOwnProperty.call(o.fields, fkey)) return o.fields[fkey];
            return defaultValForType(meta.type);
          }
        }
      }
      throw jerr('compile', 'CannotFindSymbol',
        '找不到符号: 类 ' + o.type + ' 里没有字段 ' + name, line,
        '检查字段名拼写（区分大小写），或确认它是 private（private 字段不能在类外访问）');
    }
    throw jerr('compile', 'CannotFindSymbol', '不能读取 ' + obj.type + ' 的字段 ' + name, line);
  };

  Machine.prototype.staticField = function (clsName, name, line) {
    if (clsName === 'Math') {
      if (name === 'PI') return V_DOUBLE(Math.PI);
      if (name === 'E') return V_DOUBLE(Math.E);
    }
    if (clsName === 'Integer') {
      if (name === 'MAX_VALUE') return V_INT(2147483647);
      if (name === 'MIN_VALUE') return V_INT(-2147483648);
    }
    if (clsName === 'Long') {
      if (name === 'MAX_VALUE') return V_LONG(9007199254740991);
      if (name === 'MIN_VALUE') return V_LONG(-9007199254740991);
    }
    if (clsName === 'Double') {
      if (name === 'MAX_VALUE') return V_DOUBLE(Number.MAX_VALUE);
      if (name === 'MIN_VALUE') return V_DOUBLE(Number.MIN_VALUE);
      if (name === 'NaN') return V_DOUBLE(NaN);
      if (name === 'POSITIVE_INFINITY') return V_DOUBLE(Infinity);
      if (name === 'NEGATIVE_INFINITY') return V_DOUBLE(-Infinity);
    }
    if (clsName === 'Boolean') {
      if (name === 'TRUE') return V_BOOL(true);
      if (name === 'FALSE') return V_BOOL(false);
    }
    if (clsName === 'Character') {
      if (name === 'MAX_VALUE') return V_CHAR(65535);
      if (name === 'MIN_VALUE') return V_CHAR(0);
    }
    var st = this.statics[clsName];
    if (st && st[name]) return st[name].val;
    throw jerr('compile', 'CannotFindSymbol', clsName + ' 里找不到静态字段 ' + name, line,
      '检查拼写；常量通常是大写，如 Integer.MAX_VALUE');
  };

  /** 沿继承链找 static 字段（"通过实例访问 static 成员"用：a.s 等价于 C.s） */
  Machine.prototype.findStaticField = function (clsName, name) {
    var chain = this.ancestorsOf(clsName);
    for (var i = 0; i < chain.length; i++) {
      var st = this.statics[chain[i]];
      if (st && st[name]) return st[name];
    }
    return null;
  };

  Machine.prototype.evalIndex = function* (node) {
    var arr = yield* this.evalExpr(node.array);
    var idxv = yield* this.evalExpr(node.index);
    return this.readElement(arr, idxv, node.line);
  };

  Machine.prototype.readElement = function (arr, idxv, line) {
    if (!isIntegralVal(idxv)) {
      throw typeErr('数组下标必须是整数，实际是 ' + idxv.type, line,
        '下标要写成 int，例如 arr[0]、arr[i+1]');
    }
    var idx = numOf(idxv);
    if (arr.type === 'null') {
      throw javaEx('NullPointerException', 'Cannot load from array because the array is null',
        '数组变量是 null：先用 new 创建数组，或者检查方法有没有把数组传进来');
    }
    if (arr.type === 'String') {
      throw typeErr('String 不能用 [] 取字符', line, '字符串用 charAt(i)，例如 s.charAt(0)');
    }
    if (arr.type !== 'ref') {
      throw typeErr(arr.type + ' 不能用 [] 访问', line);
    }
    var o = this.heap[arr.ref];
    if (!o) throw javaEx('NullPointerException', '引用已失效', '');
    if (o.kind === 'list') {
      throw typeErr('ArrayList 不能用 [] 访问', line, '用 list.get(i)；数组才用 arr[i]');
    }
    if (o.kind !== 'array') {
      throw typeErr(o.type + ' 不是数组，不能用 [] 访问', line);
    }
    if (idx < 0 || idx >= o.elements.length) {
      throw javaEx('ArrayIndexOutOfBoundsException',
        'Index ' + idx + ' out of bounds for length ' + o.elements.length,
        '下标从 0 开始，合法范围是 0 到 ' + (o.elements.length - 1)
        + (idx === o.elements.length ? '；注意循环条件别写成 i <= arr.length（应该是 i < arr.length）' : ''));
    }
    return o.elements[idx];
  };

  /* ---- 二元运算 ---- */
  Machine.prototype.evalBinary = function* (node) {
    var op = node.op;
    if (op === '&&') {
      var lv = yield* this.evalExpr(node.l);
      if (!this.truthy(lv, node.line, '&& 的左边')) return V_BOOL(false);
      var rv = yield* this.evalExpr(node.r);
      return V_BOOL(this.truthy(rv, node.line, '&& 的右边'));
    }
    if (op === '||') {
      var lv2 = yield* this.evalExpr(node.l);
      if (this.truthy(lv2, node.line, '|| 的左边')) return V_BOOL(true);
      var rv2 = yield* this.evalExpr(node.r);
      return V_BOOL(this.truthy(rv2, node.line, '|| 的右边'));
    }
    var a = yield* this.evalExpr(node.l);
    var b = yield* this.evalExpr(node.r);
    return yield* this.binaryOp(op, a, b, node.line);
  };

  function promoteType(a, b) {
    if (a === 'double' || b === 'double' || a === 'float' || b === 'float') return 'double';
    if (a === 'long' || b === 'long') return 'long';
    return 'int';
  }

  Machine.prototype.binaryOp = function* (op, a, b, line) {
    if (op === '+') {
      if (a.type === 'String' || b.type === 'String') {
        var sa = yield* this.javaToString(a);
        var sb = yield* this.javaToString(b);
        return this.newString(sa + sb);
      }
    }
    if (op === '==' || op === '!=') {
      var eq = this.valueEquals(a, b);
      return V_BOOL(op === '==' ? eq : !eq);
    }
    if (op === '<' || op === '<=' || op === '>' || op === '>=') {
      if (!isNumericVal(a) || !isNumericVal(b)) {
        throw typeErr('运算符 ' + op + ' 只能比较数字', line,
          '比较字符串内容要用 s1.compareTo(s2) 或 s1.equals(s2)');
      }
      var x = numOf(a), y = numOf(b);
      switch (op) {
        case '<': return V_BOOL(x < y);
        case '<=': return V_BOOL(x <= y);
        case '>': return V_BOOL(x > y);
        default: return V_BOOL(x >= y);
      }
    }
    if (op === '&' || op === '|' || op === '^') {
      if (a.type === 'boolean' && b.type === 'boolean') {
        if (op === '&') return V_BOOL(a.value && b.value);
        if (op === '|') return V_BOOL(a.value || b.value);
        return V_BOOL(a.value !== b.value);
      }
      if (!isIntegralVal(a) || !isIntegralVal(b)) {
        throw typeErr('位运算 ' + op + ' 需要整数或 boolean', line);
      }
      var l = a.type === 'long' ? 'long' : 'int';
      var xi = numOf(a), yi = numOf(b);
      if (op === '&') return l === 'long' ? V_LONG(xi & yi) : V_INT(xi & yi);
      if (op === '|') return l === 'long' ? V_LONG(xi | yi) : V_INT(xi | yi);
      return l === 'long' ? V_LONG(xi ^ yi) : V_INT(xi ^ yi);
    }
    if (op === '<<' || op === '>>' || op === '>>>') {
      if (!isIntegralVal(a) || !isIntegralVal(b)) {
        throw typeErr('移位运算需要整数', line);
      }
      var isLong = a.type === 'long';
      var xm = numOf(a) | 0, ym = numOf(b) & 31;
      var r;
      if (op === '<<') r = xm << ym;
      else if (op === '>>') r = xm >> ym;
      else r = (xm >>> ym) | 0;
      return isLong ? V_LONG(r) : V_INT(r);
    }
    if (op === '+' || op === '-' || op === '*' || op === '/' || op === '%') {
      if (!isNumericVal(a) || !isNumericVal(b)) {
        throw typeErr('运算符 ' + op + ' 不能用于 ' + a.type + ' 和 ' + b.type, line,
          op === '+' ? '字符串拼接需要至少一边是字符串，例如 "x = " + x' : '检查操作数类型是否匹配');
      }
      return this.arith(op, a, b, line);
    }
    throw jerr('runtime', 'InternalError', '未知运算符 ' + op, line, '');
  };

  /** 数值运算：int 溢出回绕、int/int 整除、double 除零得 Infinity */
  Machine.prototype.arith = function (op, a, b, line) {
    var pt = promoteType(a.type, b.type);
    if (pt === 'double') {
      var xd = +numOf(a), yd = +numOf(b);
      switch (op) {
        case '+': return V_DOUBLE(xd + yd);
        case '-': return V_DOUBLE(xd - yd);
        case '*': return V_DOUBLE(xd * yd);
        case '/': return V_DOUBLE(xd / yd);
        default: return V_DOUBLE(xd % yd);
      }
    }
    if (pt === 'long') {
      var xl = Math.trunc(numOf(a)), yl = Math.trunc(numOf(b));
      if ((op === '/' || op === '%') && yl === 0) {
        throw javaEx('ArithmeticException', '/ by zero', '整数除以 0 在 Java 里会抛异常；如果除数可能是 0，先用 if 判断');
      }
      switch (op) {
        case '+': return V_LONG(xl + yl);
        case '-': return V_LONG(xl - yl);
        case '*': return V_LONG(xl * yl);
        case '/': return V_LONG(Math.trunc(xl / yl));
        default: return V_LONG(xl % yl);
      }
    }
    var x = numOf(a) | 0, y = numOf(b) | 0;
    if ((op === '/' || op === '%') && y === 0) {
      throw javaEx('ArithmeticException', '/ by zero',
        '整数除以 0 会抛异常；如果除数是变量，先用 if (y != 0) 判断');
    }
    switch (op) {
      case '+': return V_INT(x + y);
      case '-': return V_INT(x - y);
      case '*': return V_INT(Math.imul(x, y));
      case '/': return V_INT(Math.trunc(x / y));
      default: return V_INT(x % y);
    }
  };

  /* ---- 一元运算 ---- */
  Machine.prototype.evalUnary = function* (node) {
    var v = yield* this.evalExpr(node.expr);
    switch (node.op) {
      case '!':
        if (v.type !== 'boolean') throw typeErr('! 只能用于 boolean，实际是 ' + v.type, node.line);
        return V_BOOL(!v.value);
      case '+':
        if (!isNumericVal(v)) throw typeErr('一元 + 需要数字', node.line);
        return v.type === 'char' ? V_INT(v.value) : v;
      case '-':
        if (!isNumericVal(v)) throw typeErr('一元 - 需要数字', node.line);
        if (v.type === 'int' || v.type === 'char') return V_INT(-(v.value | 0));
        if (v.type === 'long') return V_LONG(-v.value);
        if (v.type === 'float') return V_FLOAT(-v.value);
        return V_DOUBLE(-v.value);
      case '~':
        if (!isIntegralVal(v)) throw typeErr('~ 需要整数', node.line);
        return v.type === 'long' ? V_LONG(~v.value) : V_INT(~(v.value | 0));
      default:
        throw jerr('runtime', 'InternalError', '未知一元运算符 ' + node.op, node.line, '');
    }
  };

  /* ---- 赋值 / 自增自减 ---- */
  Machine.prototype.evalAssign = function* (node) {
    var target = node.target;
    var op = node.op;

    if (target.k === 'Ident') {
      var slot = this.lookupVar(target.name);
      if (!slot) {
        throw jerr('compile', 'CannotFindSymbol', '找不到符号: 变量 ' + target.name, node.line,
          '变量必须先声明再赋值，例如 int ' + target.name + ' = 0;');
      }
      var val;
      if (op === '=') {
        val = yield* this.evalExpr(node.value);
      } else {
        var rhs = yield* this.evalExpr(node.value);
        val = yield* this.binaryOp(op.slice(0, -1), slot.val, rhs, node.line);
      }
      val = this.coerceDecl(slot.type, val, node.line, op !== '=');
      if (slot.__obj) slot.__obj.fields[slot.__field] = val;   /* 隐式 this.field = ... */
      else slot.val = val;
      return val;
    }

    if (target.k === 'Member') {
      var objVal = yield* this.evalExpr(target.obj);
      if (objVal.type === 'classref') {
        if (this.classes[objVal.value] && !this.staticsReady[objVal.value]) yield* this.ensureStatics(objVal.value);
        var st = this.statics[objVal.value];
        if (!st || !st[target.name]) {
          throw jerr('compile', 'CannotFindSymbol', objVal.value + ' 里找不到静态字段 ' + target.name, target.line, '');
        }
        var v2;
        if (op === '=') v2 = yield* this.evalExpr(node.value);
        else {
          var sv = yield* this.evalExpr(node.value);
          v2 = yield* this.binaryOp(op.slice(0, -1), st[target.name].val, sv, node.line);
        }
        st[target.name].val = this.coerceDecl(st[target.name].type, v2, node.line, op !== '=');
        return st[target.name].val;
      }
      var o = this.deref(objVal, 'field ' + target.name);
      var declCls2 = classTypeOf(this.typeOfExpr(target.obj)) || o.type;
      var meta = this.findField(declCls2, target.name) || this.findField(o.type, target.name);
      if (!meta) {
        throw jerr('compile', 'CannotFindSymbol', '类 ' + o.type + ' 里没有字段 ' + target.name, target.line,
          '检查字段名拼写（区分大小写）');
      }
      var oldVal, writeField;
      if ((meta.mods || []).indexOf('static') >= 0) {
        /* a.staticField = ... 改的是类字段，不是给 a 新增实例字段 */
        var sfA = this.findStaticField(o.type, target.name);
        if (!sfA) {
          throw jerr('compile', 'CannotFindSymbol', o.type + ' 里找不到静态字段 ' + target.name, target.line, '');
        }
        oldVal = sfA.val;
        writeField = function (v) { sfA.val = v; };
      } else {
        var fkeyA = meta.owner + '.' + target.name;
        oldVal = Object.prototype.hasOwnProperty.call(o.fields, fkeyA)
          ? o.fields[fkeyA] : defaultValForType(meta.type);
        writeField = function (v) { o.fields[fkeyA] = v; };
      }
      var nv;
      if (op === '=') nv = yield* this.evalExpr(node.value);
      else {
        var r = yield* this.evalExpr(node.value);
        nv = yield* this.binaryOp(op.slice(0, -1), oldVal, r, node.line);
      }
      nv = this.coerceDecl(meta.type, nv, node.line, op !== '=');
      writeField(nv);
      return nv;
    }

    if (target.k === 'Index') {
      var arr = yield* this.evalExpr(target.array);
      var idxv = yield* this.evalExpr(target.index);
      var old = this.readElement(arr, idxv, target.line);
      var obj = this.deref(arr, 'array');
      var elemType = obj.elemType || 'int';
      var newVal;
      if (op === '=') newVal = yield* this.evalExpr(node.value);
      else {
        var rr = yield* this.evalExpr(node.value);
        newVal = yield* this.binaryOp(op.slice(0, -1), old, rr, node.line);
      }
      newVal = this.coerceDecl(elemType, newVal, node.line, op !== '=');
      obj.elements[numOf(idxv)] = newVal;
      return newVal;
    }

    throw jerr('compile', 'InvalidAssignment', '不能给这个表达式赋值（左边必须是变量、字段或数组元素）', node.line,
      '把 = 换成 == 才是比较哦');
  };

  /** 读取赋值目标当前值（++ / -- 用） */
  Machine.prototype.readTarget = function* (target) {
    if (target.k === 'Ident') {
      var slot = this.lookupVar(target.name);
      if (!slot) throw jerr('compile', 'CannotFindSymbol', '找不到符号: 变量 ' + target.name, target.line, '');
      if (slot.__obj) {
        var fobj = slot.__obj, fname = slot.__field;
        return {
          val: fobj.fields[fname], type: slot.type,
          write: function (v) { fobj.fields[fname] = v; }
        };
      }
      return { val: slot.val, type: slot.type, write: function (v) { slot.val = v; } };
    }
    if (target.k === 'Member') {
      var objVal = yield* this.evalExpr(target.obj);
      /* 静态字段：Class.field++ / --（必须走 statics 表，不能 deref 一个 classref） */
      if (objVal.type === 'classref') {
        if (this.classes[objVal.value] && !this.staticsReady[objVal.value]) yield* this.ensureStatics(objVal.value);
        var st = this.statics[objVal.value];
        if (!st || !st[target.name]) {
          throw jerr('compile', 'CannotFindSymbol', objVal.value + ' 里找不到静态字段 ' + target.name, target.line, '');
        }
        var fld = st[target.name];
        return {
          val: fld.val, type: fld.type,
          write: function (v) { fld.val = v; }
        };
      }
      var o = this.deref(objVal, 'field');
      var declCls3 = classTypeOf(this.typeOfExpr(target.obj)) || o.type;
      var meta = this.findField(declCls3, target.name) || this.findField(o.type, target.name);
      if (!meta) throw jerr('compile', 'CannotFindSymbol', '类 ' + o.type + ' 里没有字段 ' + target.name, target.line, '');
      if ((meta.mods || []).indexOf('static') >= 0) {
        var sfR = this.findStaticField(o.type, target.name);
        if (!sfR) throw jerr('compile', 'CannotFindSymbol', o.type + ' 里找不到静态字段 ' + target.name, target.line, '');
        return { val: sfR.val, type: meta.type, write: function (v) { sfR.val = v; } };
      }
      var fkeyR = meta.owner + '.' + target.name;
      return {
        val: Object.prototype.hasOwnProperty.call(o.fields, fkeyR)
          ? o.fields[fkeyR] : defaultValForType(meta.type),
        type: meta.type,
        write: function (v) { o.fields[fkeyR] = v; }
      };
    }
    if (target.k === 'Index') {
      var arr = yield* this.evalExpr(target.array);
      var idxv = yield* this.evalExpr(target.index);
      var old = this.readElement(arr, idxv, target.line);
      var obj2 = this.deref(arr, 'array');
      return {
        val: old, type: obj2.elemType || 'int',
        write: function (v) { obj2.elements[numOf(idxv)] = v; }
      };
    }
    throw jerr('compile', 'InvalidAssignment', '++ / -- 只能用于变量、字段或数组元素', target.line, '');
  };

  Machine.prototype.evalUpdate = function* (node) {
    var info = yield* this.readTarget(node.target);
    if (!isNumericVal(info.val)) {
      throw typeErr('++ / -- 只能用于数字', node.line, '布尔值和字符串不能自增');
    }
    var one = (info.val.type === 'double' || info.val.type === 'float') ? V_DOUBLE(1) : V_INT(1);
    var nv = yield* this.binaryOp(node.op === '++' ? '+' : '-', info.val, one, node.line);
    nv = this.coerceDecl(info.type, nv, node.line, true);
    info.write(nv);
    return node.prefix ? nv : info.val;
  };

  /* ---- 强制类型转换 ---- */
  Machine.prototype.evalCast = function* (node) {
    var v = yield* this.evalExpr(node.expr);
    var targetType = joinType(node.type, 0);
    var t = splitType(targetType);

    if (t.dims > 0) {
      if (v.type === 'null') return v;
      if (v.type !== 'ref') throw typeErr('不兼容的类型：' + v.type + ' 不能转成 ' + targetType, node.line, '');
      var o = this.heap[v.ref];
      if (o && o.classChain.indexOf(t.name) >= 0) return v;
      throw javaEx('ClassCastException',
        'class ' + (o ? o.type : '?') + ' cannot be cast to class ' + targetType,
        '只有对象真的是这个类型（或它的子类）时才能强转；先用 instanceof 判断');
    }

    switch (t.name) {
      case 'boolean':
        if (v.type === 'boolean') return v;
        throw typeErr('boolean 只能由 boolean 转换而来', node.line, '');
      case 'int':
        if (!isNumericVal(v)) throw typeErr(v.type + ' 不能转成 int', node.line, '');
        return V_INT(narrowToInt(v.value));
      case 'long':
        if (!isNumericVal(v)) throw typeErr(v.type + ' 不能转成 long', node.line, '');
        return narrowToLong(v.value);
      case 'double':
        if (!isNumericVal(v)) throw typeErr(v.type + ' 不能转成 double', node.line, '');
        return V_DOUBLE(v.value);
      case 'float':
        if (!isNumericVal(v)) throw typeErr(v.type + ' 不能转成 float', node.line, '');
        return V_FLOAT(v.value);
      case 'char':
        if (!isNumericVal(v)) throw typeErr(v.type + ' 不能转成 char', node.line, '');
        return V_CHAR(narrowToInt(v.value) & 0xffff);
      case 'byte':
        if (!isNumericVal(v)) throw typeErr(v.type + ' 不能转成 byte', node.line, '');
        return V_INT((narrowToInt(v.value) << 24) >> 24);    /* 截断到 8 位并保留符号 */
      case 'short':
        if (!isNumericVal(v)) throw typeErr(v.type + ' 不能转成 short', node.line, '');
        return V_INT((narrowToInt(v.value) << 16) >> 16);    /* 截断到 16 位并保留符号 */
      default: break;
    }

    if (v.type === 'null') return v;
    if (v.type === 'String') {
      if (t.name === 'String' || t.name === 'Object' || t.name === 'CharSequence') return v;
      throw javaEx('ClassCastException', 'class java.lang.String cannot be cast to class ' + t.name,
        '字符串不能强转成 ' + t.name + '；用 Integer.parseInt(s) 把文本转成数字');
    }
    if (v.type !== 'ref') {
      throw typeErr('不兼容的类型：' + v.type + ' 不能转成 ' + t.name, node.line, '');
    }
    var obj = this.heap[v.ref];
    if (obj && obj.classChain.indexOf(t.name) >= 0) return v;
    throw javaEx('ClassCastException',
      'class ' + (obj ? obj.type : '?') + ' cannot be cast to class ' + t.name,
      '先用 instanceof 判断对象真实类型，再强转');
  };

  Machine.prototype.instanceOf = function (v, typeStr) {
    var t = splitType(typeStr);
    if (v.type === 'null') return false;
    if (t.dims > 0) {
      return v.type === 'ref' && this.heap[v.ref] && this.heap[v.ref].kind === 'array';
    }
    if (v.type === 'String') return t.name === 'String' || t.name === 'Object' || t.name === 'CharSequence';
    if (v.type !== 'ref') return false;
    var o = this.heap[v.ref];
    if (!o) return false;
    return o.classChain.indexOf(t.name) >= 0;
  };

  /* ---- 对象与数组创建 ---- */
  Machine.prototype.evalNewArray = function* (node) {
    var totalDims = node.dims.length + (node.type.dims || 0);
    return yield* this.allocArrayLevel(node.type.name, totalDims, node.dims, 0, node.init, node.line);
  };

  Machine.prototype.allocArrayLevel = function* (baseName, totalDims, dims, level, init, line) {
    var arrayType = baseName + rep('[]', totalDims - level);
    if (dims[level] === null || dims[level] === undefined) {
      if (init) return yield* this.buildArrayFromInit(arrayType, init);
      /* new int[3][]：外层长度已给、内层留空 → 元素为 null（Java 的锯齿数组） */
      return NULL_VAL;
    }
    var nv = yield* this.evalExpr(dims[level]);
    if (!isIntegralVal(nv)) throw typeErr('数组长度必须是整数', line, '例如 new int[5]');
    var n = numOf(nv);
    if (n < 0) {
      throw javaEx('NegativeArraySizeException', String(n), '数组长度不能是负数');
    }
    var obj = this.alloc('array', arrayType);
    var elemType = baseName + rep('[]', totalDims - level - 1);
    if (level === dims.length - 1) {
      var dv = defaultValForType(elemType);
      for (var i = 0; i < n; i++) obj.elements.push(dv);
    } else {
      for (var j = 0; j < n; j++) {
        obj.elements.push(yield* this.allocArrayLevel(baseName, totalDims, dims, level + 1, null, line));
      }
    }
    return V_REF(obj.id);
  };

  /* ==================================================================
   * 9. 方法调用 / 对象构造 / 静态初始化
   * ================================================================== */

  Machine.prototype.evalCall = function* (node) {
    /* super.m(...)：从父类开始找实现 */
    if (node.obj && node.obj.k === 'Super') {
      var f0 = this.curFrame();
      var supName = (this.classes[f0.cls] || {}).superName || 'Object';
      var args0 = yield* this.evalArgs(node.args);
      var found0 = this.findMethod(supName, node.name, args0);
      if (!found0) {
        throw jerr('compile', 'CannotFindSymbol', '父类 ' + supName + ' 里找不到方法 ' + node.name, node.line, '');
      }
      return yield* this.callUserMethod(found0.owner, found0.method, args0, f0.thisVal, node.line);
    }
    var args = yield* this.evalArgs(node.args);
    if (!node.obj) return yield* this.callBare(node.name, args, node.line);
    var obj = yield* this.evalExpr(node.obj);
    return yield* this.callOn(obj, node.name, args, node.line);
  };

  /** 裸方法调用：等价于 this.方法(...)，要按对象的"实际类型"动态派发 */
  Machine.prototype.callBare = function* (name, args, line) {
    var f = this.curFrame();
    if (f && f.cls) {
      var startCls = f.cls;
      /* 关键：在实例方法里，裸调用按运行时类型找实现，而不是按声明类型找抽象方法 */
      if (f.thisVal && f.thisVal.type === 'ref') {
        var thisObj = this.heap[f.thisVal.ref];
        if (thisObj) startCls = thisObj.type;
      }
      var found = this.findMethod(startCls, name, args);
      if (found) return yield* this.callUserMethod(found.owner, found.method, args, f.thisVal || NULL_VAL, line);
    }
    var builtin = yield* this.tryBuiltinStatic(null, name, args, line);
    if (builtin) return builtin;
    throw jerr('compile', 'CannotFindSymbol',
      '找不到符号: 方法 ' + name + '(' + args.length + ' 个参数)', line,
      '检查方法名拼写（区分大小写），或确认这个方法是在哪个类里定义的');
  };

  Machine.prototype.callOn = function* (obj, name, args, line) {
    if (obj.type === 'sysout') return yield* this.sysoutCall(name, args, line);
    if (obj.type === 'classref') return yield* this.callStatic(obj.value, name, args, line);
    if (obj.type === 'null') {
      throw javaEx('NullPointerException',
        'Cannot invoke "' + name + '()" because the reference is null',
        '变量是 null，还没有指向任何对象：先 new 出对象，再调用方法');
    }
    if (obj.type === 'String') return this.stringMethod(obj, name, args, line);
    if (obj.type !== 'ref') {
      throw typeErr(obj.type + ' 没有方法 ' + name, line, '');
    }
    var o = this.heap[obj.ref];
    if (!o) throw javaEx('NullPointerException', '引用已失效', '');
    if (o.kind === 'list') return yield* this.listMethod(o, name, args, line);
    if (o.kind === 'map') return yield* this.mapMethod(o, name, args, line);
    if (o.kind === 'set') return yield* this.setMethod(o, name, args, line);
    if (o.kind === 'array') {
      /* 数组也继承 Object：equals（比引用）、hashCode、toString（[I@hash）、getClass 都可用 */
      if (name === 'equals' && args.length === 1) return V_BOOL(this.valueEquals(obj, args[0]));
      if (name === 'hashCode' && args.length === 0) return V_INT(parseInt(this.objectHash(o), 16) | 0);
      if (name === 'toString' && args.length === 0) return this.newString(this.arrayToStringDefault(o));
      if (name === 'getClass' && args.length === 0) return { type: 'classref', value: o.type };
      /* 数组的 clone()：复制出一个新数组（一维基本类型是深拷贝；
         多维时只复制外层引用，内层行仍共享——正好是教材要讲的浅拷贝语义） */
      if (name === 'clone' && args.length === 0) {
        var copyArr = this.alloc('array', o.type, (o.classChain || []).slice());
        copyArr.elemType = o.elemType;
        copyArr.elements = o.elements.slice();
        return V_REF(copyArr.id);
      }
      throw jerr('compile', 'CannotFindSymbol', '数组没有方法 ' + name + '()', line,
        '数组只有 length 属性：arr.length；想按内容比较/打印用 Arrays.equals(arr1, arr2) / Arrays.toString(arr)');
    }
    if (o.type === 'Scanner') return this.scannerMethod(o, name, args, line);

    /* 用户类方法（含继承 + 动态派发：按对象实际类型开始找） */
    var found = this.findMethod(o.type, name, args);
    if (found) return yield* this.callUserMethod(found.owner, found.method, args, obj, line);

    /* Object 的内置方法兜底 */
    if (name === 'equals' && args.length === 1) return V_BOOL(this.valueEquals(obj, args[0]));
    if (name === 'hashCode' && args.length === 0) return V_INT(parseInt(this.objectHash(o), 16) | 0);
    if (name === 'toString' && args.length === 0) return this.newString(o.type + '@' + this.objectHash(o));
    if (name === 'getClass' && args.length === 0) return { type: 'classref', value: o.type };

    throw jerr('compile', 'CannotFindSymbol',
      '类 ' + o.type + ' 里找不到方法 ' + name + '(' + args.length + ' 个参数)', line,
      '检查方法名拼写（区分大小写），以及参数个数/类型是否匹配');
  };

  /** 调用用户类方法：压一帧 → 绑参数 → 执行方法体 → 弹帧 */
  Machine.prototype.callUserMethod = function* (ownerCls, method, argVals, thisVal, line) {
    if (this.frames.length >= this.maxDepth) {
      throw javaEx('StackOverflowError', '调用栈深度超过 ' + this.maxDepth + '（递归太深或没有终止条件）',
        '每个递归方法都必须有 base case（不再递归的分支），并确保它一定会被执行到');
    }
    var frame = this.newFrame(method.name, ownerCls.name, thisVal, method);
    frame.callLine = line;
    try {
      this.bindParams(frame, method.params, argVals, line);
      if (!method.body) {
        throw javaEx('AbstractMethodError', ownerCls.name + '.' + method.name + '() 没有方法体（抽象方法）',
          '抽象方法必须在子类里实现');
      }
      var sig = yield* this.execBlock(method.body);
      var ret = { type: 'void', value: null };
      if (sig && sig.kind === 'return') ret = sig.value;
      return this.coerceReturn(method.retType, ret, line);
    } finally {
      this.popFrame();
    }
  };

  Machine.prototype.bindParams = function (frame, params, argVals, line) {
    var scope = frame.scopes[0];
    for (var i = 0; i < params.length; i++) {
      var p = params[i];
      var ptype = joinType(p.type, 0);
      if (p.varargs) {
        var rest = argVals.slice(i);
        var arr = this.alloc('array', ptype);
        var et = ptype.slice(0, -2);
        for (var k = 0; k < rest.length; k++) arr.elements.push(this.coerceDecl(et, rest[k], line));
        var v = V_REF(arr.id);
        scope.vars[p.name] = { type: ptype, val: v, line: p.line };
        scope.order.push(p.name);
        return;
      }
      var av = argVals[i] === undefined ? NULL_VAL : argVals[i];
      var cv = this.coerceDecl(ptype, av, line);
      scope.vars[p.name] = { type: ptype, val: cv, line: p.line };
      scope.order.push(p.name);
    }
  };

  Machine.prototype.coerceReturn = function (retTypeNode, val, line) {
    var rt = joinType(retTypeNode, 0);
    if (rt === 'void') return { type: 'void', value: null };
    if (val.type === 'void') {
      throw typeErr('这个方法声明了返回值 ' + rt + '，但执行了没有返回值的 return', line,
        '把 return; 改成 return 一个 ' + rt + ' 类型的值');
    }
    return this.coerceDecl(rt, val, line);
  };

  /* ---- 对象构造 ---- */
  Machine.prototype.construct = function* (clsName, argVals, line) {
    /* 用户类：第一次 new 时触发该类的静态初始化 */
    if (this.classes[clsName] && !this.staticsReady[clsName]) yield* this.ensureStatics(clsName);
    /* 内置类：String / Scanner 不是用户定义的类，单独处理 */
    if (clsName === 'String') {
      if (argVals.length === 0) return this.newString('');
      var s0 = argVals[0];
      if (s0.type === 'ref') {
        var so = this.heap[s0.ref];
        if (so && so.kind === 'array' && so.elemType === 'char') {
          var cs = '';
          for (var si = 0; si < so.elements.length; si++) cs += charStr(so.elements[si]);
          return this.newString(cs);   /* new String(char[]) */
        }
      }
      return this.newString(yield* this.javaToString(s0));
    }
    if (clsName === 'Scanner') return this.makeScanner();
    if (clsName === 'ArrayList' || clsName === 'LinkedList') return this.makeList();
    if (clsName === 'HashMap') return this.makeMap();
    if (clsName === 'HashSet') return this.makeSet();

    var cls = this.classes[clsName];
    if (!cls) {
      throw jerr('compile', 'CannotFindSymbol', '找不到符号: 类 ' + clsName, line,
        '检查类名拼写（区分大小写），或确认这个类已经定义在同一个文件里');
    }
    if (cls.isInterface) {
      throw jerr('compile', 'InstantiateInterface', '不能实例化接口 ' + clsName, line,
        '接口只是"约定"，要用 implements 它的具体类来 new');
    }
    if ((cls.mods || []).indexOf('abstract') >= 0) {
      throw jerr('compile', 'InstantiateAbstract', clsName + ' 是抽象类（abstract），不能直接 new', line,
        'new 它的具体子类，例如 new Dog(...)；抽象类是用来被继承的');
    }

    var obj = this.alloc('object', clsName, this.allTypesOf(clsName));
    var fields = this.fieldsOf(clsName);
    for (var i = 0; i < fields.length; i++) {
      /* static 字段属于类，不属于对象实例，不能塞进 obj.fields（否则会遮蔽静态字段读写） */
      if ((fields[i].mods || []).indexOf('static') >= 0) continue;
      /* 字段按"声明它的类"分开存（key = 类名.字段名）：
         子类隐藏父类同名字段时两份值都要保留，读哪份由变量的声明类型决定 */
      var fkey0 = fields[i].owner + '.' + fields[i].name;
      obj.fields[fkey0] = defaultValForType(fields[i].type);
      if (obj.fieldOrder.indexOf(fkey0) < 0) obj.fieldOrder.push(fkey0);
    }
    yield* this.initInstanceFields(clsName, obj, V_REF(obj.id));
    yield* this.runCtor(clsName, obj, argVals, line, V_REF(obj.id));
    return V_REF(obj.id);
  };

  /** 字段初始化与实例初始化块（父类先） */
  Machine.prototype.initInstanceFields = function* (clsName, obj, thisVal) {
    var chain = this.ancestorsOf(clsName).slice().reverse();
    var savedSilent = this.silent;
    this.silent++;
    var frame = this.newFrame(clsName, clsName, thisVal, null);
    try {
      for (var c = 0; c < chain.length; c++) {
        var cls = this.classes[chain[c]];
        if (!cls) continue;
        for (var m = 0; m < cls.members.length; m++) {
          var mem = cls.members[m];
          if (mem.k === 'FieldDecl') {
            if ((mem.mods || []).indexOf('static') >= 0) continue;
            for (var d = 0; d < mem.decls.length; d++) {
              var fd = mem.decls[d];
              var ftype = joinType(mem.type, fd.dims);
              var val = defaultValForType(ftype);
              if (fd.init) {
                if (fd.init.k === 'ArrayInit') val = yield* this.buildArrayFromInit(ftype, fd.init);
                else val = this.coerceDecl(ftype, yield* this.evalExpr(fd.init), fd.line);
              }
              obj.fields[chain[c] + '.' + fd.name] = val;
            }
          } else if (mem.k === 'InitBlock' && (mem.mods || []).indexOf('static') < 0) {
            yield* this.execBlock(mem.body);
          }
        }
      }
    } finally {
      this.popFrame();
      this.silent = savedSilent;
    }
  };

  /** 执行构造器；super(...) / this(...) 在方法体第一条语句时特殊处理 */
  Machine.prototype.runCtor = function* (clsName, obj, argVals, line, thisVal, skipFields) {
    var ctor = this.findCtor(clsName, argVals);
    var cls = this.classes[clsName] || { mods: [], superName: null, members: [] };
    if (!ctor) {
      if (this.hasCtor(clsName)) {
        throw jerr('compile', 'NoSuchConstructor',
          '类 ' + clsName + ' 里找不到匹配的构造器（需要 ' + argVals.length + ' 个参数）', line,
          '检查 new ' + clsName + '(...) 里的参数个数和类型是否和构造器一致');
      }
      /* 没有显式构造器：用默认无参构造器，并隐式调用父类无参构造器 */
      var sup = cls.superName;
      if (sup && this.hasCtor(sup)) yield* this.runCtor(sup, obj, [], line, thisVal, true);
      return;
    }
    var frame = this.newFrame(ctor.name, clsName, thisVal, ctor);
    frame.isCtor = true;
    frame.callLine = line;
    try {
      this.bindParams(frame, ctor.params, argVals, line);
      var body = ctor.body;
      if (!body) return;
      var first = body.stmts[0];
      /* this(...)：委托给本类另一个构造器 */
      if (first && first.k === 'ExprStmt' && first.expr.k === 'ThisCall') {
        var thisArgs = yield* this.evalArgs(first.expr.args);
        yield* this.runCtor(clsName, obj, thisArgs, line, thisVal, true);
        /* this(...) 只是"委托"，返回后还要继续执行本构造器剩下的语句
           （例如 Animal() { this("animal"); print("A0"); } 必须先 A1 再 A0） */
        yield* this.execBlock({ k: 'Block', stmts: body.stmts.slice(1), line: body.line });
        return;
      }
      /* super(...)：先执行父类构造器体（它自己的帧压在上面），再执行本类剩余语句 */
      if (first && first.k === 'ExprStmt' && first.expr.k === 'SuperCall') {
        var superArgs = yield* this.evalArgs(first.expr.args);
        if (cls.superName) yield* this.runCtor(cls.superName, obj, superArgs, line, thisVal, true);
        yield* this.execBlock({ k: 'Block', stmts: body.stmts.slice(1), line: body.line });
        return;
      }
      /* 隐式 super() */
      if (cls.superName && this.hasCtor(cls.superName)) {
        yield* this.runCtor(cls.superName, obj, [], line, thisVal, true);
      }
      yield* this.execBlock(body);
    } finally {
      this.popFrame();
    }
  };

  /* ---- 静态初始化 ---- */
  Machine.prototype.ensureStatics = function* (clsName) {
    if (this.staticsReady[clsName]) return;
    this.staticsReady[clsName] = true;
    var cls = this.classes[clsName];
    if (!cls) return;
    if (cls.superName) yield* this.ensureStatics(cls.superName);
    var table = this.statics[clsName] = Object.create(null);
    var savedSilent = this.silent;
    this.silent++;
    var frame = this.newFrame('<clinit>', clsName, null, null);
    try {
      for (var m = 0; m < cls.members.length; m++) {
        var mem = cls.members[m];
        if (mem.k === 'FieldDecl' && (mem.mods || []).indexOf('static') >= 0) {
          for (var d = 0; d < mem.decls.length; d++) {
            var fd = mem.decls[d];
            var ftype = joinType(mem.type, fd.dims);
            var val = defaultValForType(ftype);
            if (fd.init) {
              if (fd.init.k === 'ArrayInit') val = yield* this.buildArrayFromInit(ftype, fd.init);
              else val = this.coerceDecl(ftype, yield* this.evalExpr(fd.init), fd.line);
            }
            table[fd.name] = { type: ftype, val: val, line: fd.line };
          }
        } else if (mem.k === 'InitBlock' && (mem.mods || []).indexOf('static') >= 0) {
          yield* this.execBlock(mem.body);
        }
      }
    } finally {
      this.popFrame();
      this.silent = savedSilent;
    }
  };

  /* ---- 程序入口 ---- */
  Machine.prototype.findMainEntry = function () {
    var names = Object.keys(this.classes);
    for (var i = 0; i < names.length; i++) {
      var cls = this.classes[names[i]];
      if (!cls || cls.name === 'Object') continue;
      for (var m = 0; m < cls.members.length; m++) {
        var mem = cls.members[m];
        if (mem.k !== 'MethodDecl' || mem.name !== 'main') continue;
        if (mem.params.length !== 1) continue;
        return { cls: cls, method: mem };
      }
    }
    return null;
  };

  Machine.prototype.buildArgsArray = function (argsList) {
    var arr = this.alloc('array', 'String[]');
    for (var i = 0; i < (argsList || []).length; i++) {
      arr.elements.push(this.internString(String(argsList[i])));
    }
    return V_REF(arr.id);
  };

  /** 整个程序的主循环：找出 main → 执行。所有异常在这里收口 */
  Machine.prototype.execute = function* () {
    this.startTime = Date.now();
    this._prevPrint = null;
    try {
      yield* this.ensureStatics('Object');
      var entry = this.findMainEntry();
      if (!entry) {
        throw jerr('compile', 'NoMainMethod',
          '找不到 main 方法：程序需要一个 public static void main(String[] args) 作为入口', 1,
          '检查 main 的签名是否写全（public static void main），注意大小写：是 main 不是 Main');
      }
      /* JVM 语义：main 所在类先初始化；其它类等真正用到（new / 静态字段 / 静态方法）才初始化。
         这样"未使用的类 static 块不执行"、"main 先于 static 块"都与真实 JDK 一致。 */
      yield* this.ensureStatics(entry.cls.name);
      var argsArr = this.buildArgsArray(this.opts.args || []);
      var frame = this.newFrame('main', entry.cls.name, null, entry.method);
      frame.callLine = entry.method.line;
      try {
        this.bindParams(frame, entry.method.params, [argsArr], entry.method.line);
        yield* this.execBlock(entry.method.body);
      } finally {
        this.popFrame();
      }
    } catch (e) {
      this.error = this.normalizeThrown(e);
    }
    this.done = true;
  };

  Machine.prototype.normalizeThrown = function (e) {
    if (e && e.__javaError) {
      if (!e.line) e.line = this.line || 1;
      return e;
    }
    /* JS 引擎的调用栈先爆掉时，也要翻译成 Java 的 StackOverflowError（教学一致性） */
    if (e && (e instanceof RangeError || /call stack|Maximum call stack/i.test(e.message || ''))) {
      return jerr('runtime', 'java.lang.StackOverflowError',
        '调用栈溢出（递归太深或没有终止条件）', this.line || 1,
        '每个递归方法都必须有 base case（不再递归的分支），并确保它一定会被执行到');
    }
    return jerr('runtime', 'InternalError',
      '引擎内部错误：' + (e && e.message ? e.message : String(e)), this.line || 1,
      '这是引擎的 bug（不是你代码的问题），请把这段代码发给老师');
  };

  /* ==================================================================
   * 10. Java 内置库（java.lang / java.util 的常用子集）
   *     全部用 JS 实现，用户代码不能"看到"JS；错误消息模仿 Java 原文。
   * ================================================================== */

  function toIndexArg(args, i, line) {
    var v = args[i];
    if (!v || !isIntegralVal(v)) throw typeErr('这里需要一个 int 下标', line, '');
    return numOf(v);
  }
  function toIntArg(args, i, line) {
    var v = args[i];
    if (!v) throw typeErr('缺少参数', line, '');
    if (isIntegralVal(v)) return numOf(v);
    if (v.type === 'double' || v.type === 'float') return Math.trunc(v.value);
    throw typeErr('参数需要是数字，实际是 ' + v.type, line, '');
  }

  /** 把任意值转成 Java 的 toString 字符串（对象会调用用户重写的 toString） */
  Machine.prototype.javaToString = function* (v) {
    if (!v) return 'null';
    switch (v.type) {
      case 'String': return v.value;
      case 'null': return 'null';
      case 'char': return charStr(v);
      case 'boolean': return booleanStr(v.value);
      case 'double': return doubleStr(v.value);
      case 'float': return floatStr(v.value);
      case 'int': case 'long':
        if (v.type === 'long' && v.sat === 'max') return '9223372036854775807';
        if (v.type === 'long' && v.sat === 'min') return '-9223372036854775808';
        return String(v.value);
      case 'ref': {
        var o = this.heap[v.ref];
        if (!o) return 'null';
        if (o.kind === 'list') return yield* this.listToString(o);
        if (o.kind === 'set') return this.setToString(o);
        if (o.kind === 'map') return this.mapToString(o);
        if (o.kind === 'array') return this.arrayToStringDefault(o);
        var found = this.findMethod(o.type, 'toString', 0);
        if (found) {
          var ret = yield* this.callUserMethod(found.owner, found.method, [], v, 0);
          return ret.type === 'String' ? ret.value : displayOf(ret);
        }
        return o.type + '@' + this.objectHash(o);
      }
      default: return displayOf(v);
    }
  };

  /** 数组的默认 toString：[I@1a2b3c（故意"乱码"，提醒学生用 Arrays.toString） */
  Machine.prototype.arrayToStringDefault = function (o) {
    var code = { int: 'I', long: 'J', double: 'D', float: 'F', char: 'C', boolean: 'Z', byte: 'B', short: 'S' };
    var elem = o.elemType || 'int';
    var dims = 0, base = elem;
    while (base.length > 2 && base.slice(-2) === '[]') { base = base.slice(0, -2); dims++; }
    var desc;
    if (base === 'String') desc = 'Ljava/lang/String;';
    else if (LIB_CLASS[base] && code[base] === undefined) desc = 'L' + base + ';';
    else desc = code[base] || ('L' + base + ';');
    return '[' + rep('[', dims) + desc + '@' + this.objectHash(o);
  };

  /** 数组元素用于打印的文本（String 不带引号，char 显示字符） */
  Machine.prototype.elemText = function (e, elemType) {
    if (!e) return 'null';
    if (e.type === 'String') return e.value;
    if (e.type === 'char') return charStr(e);
    if (e.type === 'ref') {
      var o = this.heap[e.ref];
      if (o && o.kind === 'array') return this.arrayToStringDefault(o);
      if (o) return o.type + '@' + this.objectHash(o);
      return 'null';
    }
    return displayOf(e);
  };

  /** Arrays.toString 的实现 */
  Machine.prototype.arrayContents = function (o) {
    var parts = [];
    for (var i = 0; i < o.elements.length; i++) parts.push(this.elemText(o.elements[i], o.elemType));
    return '[' + parts.join(', ') + ']';
  };

  Machine.prototype.listToString = function* (o) {
    var parts = [];
    for (var i = 0; i < o.elements.length; i++) parts.push(yield* this.javaToString(o.elements[i]));
    return '[' + parts.join(', ') + ']';
  };

  /* ---- System.out.print / println / printf ---- */
  Machine.prototype.sysoutCall = function* (name, args, line) {
    if (name === 'print' || name === 'println') {
      var s = '';
      if (args.length > 0) {
        var v = args[0];
        if (v.type === 'ref') {
          var o = this.heap[v.ref];
          if (o && o.kind === 'array' && o.elemType === 'char') {
            /* Java 特例：println(char[]) 打印字符内容而不是地址 */
            for (var i = 0; i < o.elements.length; i++) s += charStr(o.elements[i]);
          } else s = yield* this.javaToString(v);
        } else s = yield* this.javaToString(v);
      }
      this.write(name === 'println' ? s + '\n' : s);
      return { type: 'void', value: null };
    }
    if (name === 'printf' || name === 'format') {
      if (args.length < 1) {
        throw jerr('compile', 'MissingFormat', 'System.out.printf 至少需要一个格式化字符串', line,
          '例如 System.out.printf("%d%n", x);');
      }
      var fmt = yield* this.javaToString(args[0]);
      this.write(yield* this.formatString(fmt, args.slice(1), line));
      return { type: 'void', value: null };
    }
    throw jerr('compile', 'CannotFindSymbol', 'System.out 没有方法 ' + name + '()', line,
      '可用：print(...)、println(...)、printf(格式, ...)');
  };

  /** printf / String.format 的格式化引擎：支持 %d %s %f %e %c %b %x %o %n %% 与宽度/精度/对齐 */
  Machine.prototype.formatString = function* (fmt, args, line) {
    var out = '', ai = 0, i = 0;
    while (i < fmt.length) {
      var ch = fmt[i];
      if (ch !== '%') { out += ch; i++; continue; }
      i++;
      if (i >= fmt.length) throw jerr('runtime', 'java.util.UnknownFormatConversionException',
        '格式字符串以 % 结尾', line, '想输出百分号请写 %%');
      if (fmt[i] === '%') { out += '%'; i++; continue; }
      if (fmt[i] === 'n') { out += '\n'; i++; continue; }
      var flags = '', width = null, prec = null;
      while (i < fmt.length && '-+ 0,#'.indexOf(fmt[i]) >= 0) { flags += fmt[i]; i++; }
      var w = '';
      while (i < fmt.length && fmt[i] >= '0' && fmt[i] <= '9') { w += fmt[i]; i++; }
      if (w) width = parseInt(w, 10);
      if (fmt[i] === '.') {
        i++;
        var pd = '';
        while (i < fmt.length && fmt[i] >= '0' && fmt[i] <= '9') { pd += fmt[i]; i++; }
        prec = pd ? parseInt(pd, 10) : 0;
      }
      var conv = fmt[i] || '';
      i++;
      var arg = args[ai++];
      if (!arg) {
        throw jerr('runtime', 'java.util.MissingFormatArgumentException',
          '格式化字符串里的 %' + conv + ' 没有对应的参数', line, '检查引号里的 % 是否写多了，或参数是否漏传');
      }
      var body;
      switch (conv) {
        case 'd': case 'o': case 'x': case 'X': {
          if (!isNumericVal(arg)) {
            throw jerr('runtime', 'java.util.IllegalFormatConversionException',
              '%' + conv + ' 需要整数参数，但给的是 ' + arg.type, line,
              '%d 只能配 int/long；打印小数用 %f，打印文本用 %s');
          }
          var n = Math.trunc(numOf(arg));
          if (conv === 'd') body = String(n);
          else if (conv === 'o') body = (n < 0 ? (n >>> 0) : n).toString(8);
          else body = (n < 0 ? (n >>> 0) : n).toString(16);
          if (conv === 'X') body = body.toUpperCase();
          if (flags.indexOf('+') >= 0 && !(n < 0)) body = '+' + body;
          body = padFormat(body, width, flags, true);
          break;
        }
        case 'f': case 'e': case 'E': case 'g': {
          if (!isNumericVal(arg)) {
            throw jerr('runtime', 'java.util.IllegalFormatConversionException',
              '%' + conv + ' 需要数字参数，但给的是 ' + arg.type, line, '数字才能用 %f');
          }
          var d = +numOf(arg);
          var p = prec === null ? 6 : prec;
          if (conv === 'f') body = d.toFixed(Math.min(20, p));
          else {
            body = d.toExponential(Math.min(20, p));
            /* Java 的 %e 指数至少两位：1.234568e+04（JS 只给 e+4） */
            body = body.replace(/e([+-])(\d)$/, 'e$10$2');
            if (conv === 'E') body = body.toUpperCase();
          }
          if (flags.indexOf('+') >= 0 && d >= 0) body = '+' + body;
          body = padFormat(body, width, flags, true);
          break;
        }
        case 'c': {
          if (arg.type === 'char') body = charStr(arg);
          else if (isIntegralVal(arg)) body = String.fromCharCode(numOf(arg) & 0xffff);
          else throw jerr('runtime', 'java.util.IllegalFormatConversionException',
            '%c 需要 char 或 int，但给的是 ' + arg.type, line, "字符用单引号，如 'A'");
          body = padFormat(body, width, flags, false);
          break;
        }
        case 'b': {
          var bv = arg.type === 'boolean' ? arg.value : (arg.type === 'null' ? false : true);
          body = booleanStr(bv);
          body = padFormat(body, width, flags, false);
          break;
        }
        case 's': case 'S': {
          var sv = yield* this.javaToString(arg);
          if (conv === 'S') sv = sv.toUpperCase();
          body = padFormat(sv, width, flags, false);
          break;
        }
        default:
          throw jerr('runtime', 'java.util.UnknownFormatConversionException',
            '不支持的格式符 %' + conv, line,
            '本站支持：%d 整数、%s 文本、%f/%.2f 小数、%c 字符、%b 布尔、%x 十六进制、%n 换行、%% 百分号');
      }
      out += body;
    }
    return out;
  };

  /** 按宽度/对齐/补零填充格式化结果 */
  function padFormat(body, width, flags, numeric) {
    if (!width || body.length >= width) return body;
    var pad = width - body.length;
    var fill = '';
    while (fill.length < pad) fill += ' ';
    if (flags.indexOf('-') >= 0) return body + fill;
    if (numeric && flags.indexOf('0') >= 0) {
      var zero = '';
      while (zero.length < pad) zero += '0';
      var sign = '';
      if (body[0] === '-' || body[0] === '+') { sign = body[0]; body = body.slice(1); }
      return sign + zero + body;
    }
    return fill + body;
  }

  /* ---- String 实例方法 ---- */
  Machine.prototype.stringMethod = function (v, name, args, line) {
    var s = v.value;
    function needStr(idx) {
      var a = args[idx];
      if (!a || a.type !== 'String') {
        throw typeErr('方法 ' + name + ' 需要 String 参数', line, '字符串参数要用双引号，例如 s.indexOf("ab")');
      }
      return a.value;
    }
    function needInt(idx) { return toIndexArg(args, idx, line); }
    var idx;

    switch (name) {
      case 'length': return V_INT(s.length);
      case 'isEmpty': return V_BOOL(s.length === 0);
      case 'charAt': {
        idx = needInt(0);
        if (idx < 0 || idx >= s.length) {
          throw javaEx('StringIndexOutOfBoundsException', 'String index out of range: ' + idx,
            '字符串下标从 0 开始，"' + s + '" 的长度是 ' + s.length);
        }
        return V_CHAR(s.charCodeAt(idx));
      }
      case 'substring': {
        var begin = needInt(0);
        var end = args.length > 1 ? needInt(1) : s.length;
        if (begin < 0 || end > s.length || begin > end) {
          throw javaEx('StringIndexOutOfBoundsException', 'begin ' + begin + ', end ' + end + ', length ' + s.length,
            'substring(begin, end) 取的是 [begin, end) 左闭右开区间，end 不能超过长度');
        }
        return this.internString(s.substring(begin, end));
      }
      case 'equals': return V_BOOL(args[0] && args[0].type === 'String' && args[0].value === s);
      case 'equalsIgnoreCase': return V_BOOL(args[0] && args[0].type === 'String' && args[0].value.toLowerCase() === s.toLowerCase());
      case 'toUpperCase': return this.internString(s.toUpperCase());
      case 'toLowerCase': return this.internString(s.toLowerCase());
      case 'trim': return this.internString(s.trim());
      case 'strip': return this.internString(s.trim());
      case 'contains': return V_BOOL(s.indexOf(needStr(0)) >= 0);
      case 'indexOf': {
        var needle = (args[0] && args[0].type === 'char') ? charStr(args[0]) : needStr(0);
        var from = args.length > 1 ? needInt(1) : 0;
        return V_INT(s.indexOf(needle, from));
      }
      case 'lastIndexOf': {
        var needle2 = (args[0] && args[0].type === 'char') ? charStr(args[0]) : needStr(0);
        return V_INT(s.lastIndexOf(needle2));
      }
      case 'startsWith': {
        var prefix = args[0] && args[0].type === 'String' ? args[0].value : needStr(0);
        return V_BOOL(s.slice(0, prefix.length) === prefix);
      }
      case 'endsWith': {
        var suffix = args[0] && args[0].type === 'String' ? args[0].value : needStr(0);
        return V_BOOL(s.slice(s.length - suffix.length) === suffix);
      }
      case 'compareTo': {
        var t = needStr(0);
        var n = Math.min(s.length, t.length);
        for (var i = 0; i < n; i++) {
          if (s.charCodeAt(i) !== t.charCodeAt(i)) return V_INT(s.charCodeAt(i) - t.charCodeAt(i));
        }
        return V_INT(s.length - t.length);
      }
      case 'concat': return this.internString(s + needStr(0));
      case 'replace': {
        var from2, to2;
        if (args[0] && args[0].type === 'char' && args[1] && args[1].type === 'char') {
          from2 = charStr(args[0]); to2 = charStr(args[1]);
        } else {
          from2 = needStr(0); to2 = needStr(1);
        }
        if (from2 === '') return this.internString(s);
        return this.internString(s.split(from2).join(to2));
      }
      case 'replaceAll': {
        /* 教学场景一般传普通字符串，这里退化为普通替换（不做正则） */
        var f3 = needStr(0), t3 = needStr(1);
        if (f3 === '') return this.internString(s);
        return this.internString(s.split(f3).join(t3));
      }
      case 'split': {
        var sep = args[0] && args[0].type === 'char' ? charStr(args[0]) : needStr(0);
        var limit = args.length > 1 ? needInt(1) : 0;
        var parts = javaSplit(s, sep, limit, line);
        var arr = this.alloc('array', 'String[]');
        for (var p = 0; p < parts.length; p++) arr.elements.push(this.internString(parts[p]));
        return V_REF(arr.id);
      }
      case 'toCharArray': {
        var ca = this.alloc('array', 'char[]');
        for (var k = 0; k < s.length; k++) ca.elements.push(V_CHAR(s.charCodeAt(k)));
        return V_REF(ca.id);
      }
      case 'toString': return v;
      case 'hashCode': {
        var h = 0;
        for (var hh = 0; hh < s.length; hh++) h = (Math.imul(h, 31) + s.charCodeAt(hh)) | 0;
        return V_INT(h);
      }
      case 'isBlank': return V_BOOL(s.trim().length === 0);
      default:
        throw jerr('compile', 'CannotFindSymbol', 'String 没有方法 ' + name + '()', line,
          '常用方法：length() charAt(i) substring(a,b) equals(s) indexOf(s) toUpperCase() trim() split(s) contains(s)');
    }
  };

  /* ---- ArrayList 方法 ---- */
  Machine.prototype.listMethod = function* (o, name, args, line) {
    var len = o.elements.length;
    switch (name) {
      case 'add':
        if (args.length === 1) { o.elements.push(args[0]); return V_BOOL(true); }
        if (args.length === 2) {
          var idx = toIndexArg(args, 0, line);
          if (idx < 0 || idx > len) {
            throw javaEx('IndexOutOfBoundsException', 'Index: ' + idx + ', Size: ' + len, 'add(i, x) 的 i 必须在 0..size() 之间');
          }
          o.elements.splice(idx, 0, args[1]);
          return { type: 'void', value: null };
        }
        throw typeErr('add 需要 1 个或 2 个参数', line, 'list.add(x) 或 list.add(i, x)');
      case 'get': {
        var gi = toIndexArg(args, 0, line);
        if (gi < 0 || gi >= len) throw javaEx('IndexOutOfBoundsException', 'Index: ' + gi + ', Size: ' + len, '下标从 0 开始');
        return o.elements[gi];
      }
      case 'size': return V_INT(len);
      case 'isEmpty': return V_BOOL(len === 0);
      case 'set': {
        var si = toIndexArg(args, 0, line);
        if (si < 0 || si >= len) throw javaEx('IndexOutOfBoundsException', 'Index: ' + si + ', Size: ' + len, '');
        var old = o.elements[si];
        o.elements[si] = args[1] || NULL_VAL;
        return old;
      }
      case 'remove':
        if (args[0] && isIntegralVal(args[0])) {
          var ri = numOf(args[0]);
          if (ri < 0 || ri >= len) throw javaEx('IndexOutOfBoundsException', 'Index: ' + ri + ', Size: ' + len, '');
          return o.elements.splice(ri, 1)[0];
        }
        for (var mi = 0; mi < len; mi++) {
          if (this.valueEquals(o.elements[mi], args[0])) { o.elements.splice(mi, 1); return V_BOOL(true); }
        }
        return V_BOOL(false);
      case 'contains':
        for (var ci = 0; ci < len; ci++) if (this.valueEquals(o.elements[ci], args[0])) return V_BOOL(true);
        return V_BOOL(false);
      case 'indexOf':
        for (var ii = 0; ii < len; ii++) if (this.valueEquals(o.elements[ii], args[0])) return V_INT(ii);
        return V_INT(-1);
      case 'lastIndexOf':
        for (var li = len - 1; li >= 0; li--) if (this.valueEquals(o.elements[li], args[0])) return V_INT(li);
        return V_INT(-1);
      case 'clear': o.elements.length = 0; return { type: 'void', value: null };
      case 'equals': {
        var other = args[0] && args[0].type === 'ref' ? this.heap[args[0].ref] : null;
        if (!other || other.kind !== 'list' || other.elements.length !== o.elements.length) return V_BOOL(false);
        for (var ei = 0; ei < o.elements.length; ei++) {
          if (!this.valueEquals(o.elements[ei], other.elements[ei])) return V_BOOL(false);
        }
        return V_BOOL(true);
      }
      case 'toString': return this.newString(yield* this.listToString(o));
      default:
        throw jerr('compile', 'CannotFindSymbol', 'ArrayList 没有方法 ' + name + '()', line,
          '常用方法：add(x) add(i,x) get(i) set(i,x) size() remove(i) contains(x) indexOf(x) isEmpty() clear()');
    }
  };

  /* ---- HashMap 方法 ---- */
  Machine.prototype.mapFindKey = function (o, key) {
    for (var i = 0; i < o.entries.length; i++) {
      if (this.valueEquals(o.entries[i].key, key)) return i;
    }
    return -1;
  };

  Machine.prototype.mapMethod = function* (o, name, args, line) {
    var idx;
    switch (name) {
      case 'put': {
        idx = this.mapFindKey(o, args[0]);
        if (idx >= 0) {
          var old = o.entries[idx].val;
          o.entries[idx].val = args[1] || NULL_VAL;
          return old;
        }
        o.entries.push({ key: args[0] || NULL_VAL, val: args[1] || NULL_VAL });
        return NULL_VAL;
      }
      case 'get': {
        idx = this.mapFindKey(o, args[0]);
        return idx >= 0 ? o.entries[idx].val : NULL_VAL;
      }
      case 'getOrDefault': {
        idx = this.mapFindKey(o, args[0]);
        return idx >= 0 ? o.entries[idx].val : (args[1] || NULL_VAL);
      }
      case 'containsKey':
        return V_BOOL(this.mapFindKey(o, args[0]) >= 0);
      case 'containsValue': {
        for (var vi = 0; vi < o.entries.length; vi++) {
          if (this.valueEquals(o.entries[vi].val, args[0])) return V_BOOL(true);
        }
        return V_BOOL(false);
      }
      case 'size': return V_INT(o.entries.length);
      case 'isEmpty': return V_BOOL(o.entries.length === 0);
      case 'remove': {
        idx = this.mapFindKey(o, args[0]);
        if (idx < 0) return NULL_VAL;
        var removed = o.entries[idx].val;
        o.entries.splice(idx, 1);
        return removed;
      }
      case 'clear': o.entries.length = 0; return { type: 'void', value: null };
      case 'equals': {
        var mo = args[0] && args[0].type === 'ref' ? this.heap[args[0].ref] : null;
        if (!mo || mo.kind !== 'map' || mo.entries.length !== o.entries.length) return V_BOOL(false);
        for (var q = 0; q < o.entries.length; q++) {
          var mj = this.mapFindKey(mo, o.entries[q].key);
          if (mj < 0 || !this.valueEquals(o.entries[q].val, mo.entries[mj].val)) return V_BOOL(false);
        }
        return V_BOOL(true);
      }
      case 'keySet': {
        var so = this.alloc('set', 'HashSet', ['HashSet', 'Set', 'Object']);
        for (var ki = 0; ki < o.entries.length; ki++) so.elements.push(o.entries[ki].key);
        return V_REF(so.id);
      }
      case 'values': {
        var lo = this.alloc('list', 'ArrayList', ['ArrayList', 'List', 'Object']);
        for (var li = 0; li < o.entries.length; li++) lo.elements.push(o.entries[li].val);
        return V_REF(lo.id);
      }
      case 'toString': return this.newString(this.mapToString(o));
      default:
        throw jerr('compile', 'CannotFindSymbol', 'HashMap 没有方法 ' + name + '()', line,
          '常用：put(k,v) get(k) containsKey(k) size() remove(k) isEmpty() clear() keySet() values()');
    }
  };

  /* ---- HashSet 方法 ---- */
  Machine.prototype.setHas = function (o, v) {
    for (var i = 0; i < o.elements.length; i++) if (this.valueEquals(o.elements[i], v)) return i;
    return -1;
  };

  Machine.prototype.setMethod = function* (o, name, args, line) {
    switch (name) {
      case 'add': {
        if (this.setHas(o, args[0]) >= 0) return V_BOOL(false);
        o.elements.push(args[0] || NULL_VAL);
        return V_BOOL(true);
      }
      case 'contains': return V_BOOL(this.setHas(o, args[0]) >= 0);
      case 'size': return V_INT(o.elements.length);
      case 'isEmpty': return V_BOOL(o.elements.length === 0);
      case 'remove': {
        var idx = this.setHas(o, args[0]);
        if (idx < 0) return V_BOOL(false);
        o.elements.splice(idx, 1);
        return V_BOOL(true);
      }
      case 'clear': o.elements.length = 0; return { type: 'void', value: null };
      case 'equals': {
        var so2 = args[0] && args[0].type === 'ref' ? this.heap[args[0].ref] : null;
        if (!so2 || so2.kind !== 'set' || so2.elements.length !== o.elements.length) return V_BOOL(false);
        for (var sj = 0; sj < o.elements.length; sj++) {
          if (this.setHas(so2, o.elements[sj]) < 0) return V_BOOL(false);
        }
        return V_BOOL(true);
      }
      case 'toString': return this.newString(this.setToString(o));
      default:
        throw jerr('compile', 'CannotFindSymbol', 'HashSet 没有方法 ' + name + '()', line,
          '常用：add(x) contains(x) size() remove(x) isEmpty() clear()');
    }
  };

  /* ---- 集合的文本形式 ---- */
  Machine.prototype.setToString = function (o) {
    var parts = [];
    for (var i = 0; i < o.elements.length; i++) parts.push(this.elemText(o.elements[i]));
    return '[' + parts.join(', ') + ']';
  };
  Machine.prototype.mapToString = function (o) {
    var parts = [];
    for (var i = 0; i < o.entries.length; i++) {
      parts.push(this.elemText(o.entries[i].key) + '=' + this.elemText(o.entries[i].val));
    }
    return '{' + parts.join(', ') + '}';
  };

  /* ---- Scanner（从 opts.stdin 读，模拟 System.in） ---- */
  Machine.prototype.makeScanner = function () {
    var obj = this.alloc('object', 'Scanner', ['Scanner', 'Object']);
    obj.fieldOrder = [];
    return V_REF(obj.id);
  };

  Machine.prototype.scannerHasNext = function () {
    var s = this.stdinText, p = this.scannerPos;
    while (p < s.length && /\s/.test(s[p])) p++;
    return p < s.length;
  };
  Machine.prototype.scannerNextToken = function () {
    var s = this.stdinText, p = this.scannerPos;
    while (p < s.length && /\s/.test(s[p])) p++;
    var start = p;
    while (p < s.length && !/\s/.test(s[p])) p++;
    this.scannerPos = p;
    return s.slice(start, p);
  };
  Machine.prototype.scannerNextLine = function () {
    var s = this.stdinText, p = this.scannerPos;
    var end = s.indexOf('\n', p);
    if (end < 0) end = s.length;
    var line = s.slice(p, end);
    /* 兼容 Windows 换行 */
    if (line.charAt(line.length - 1) === '\r') line = line.slice(0, -1);
    this.scannerPos = Math.min(s.length, end + 1);
    return line;
  };

  Machine.prototype.scannerMethod = function (o, name, args, line) {
    switch (name) {
      case 'next': return this.internString(this.scannerNextToken());
      case 'nextLine': return this.internString(this.scannerNextLine());
      case 'hasNext': return V_BOOL(this.scannerHasNext());
      case 'hasNextInt': {
        var save = this.scannerPos;
        var tok = this.scannerNextToken();
        this.scannerPos = save;
        return V_BOOL(/^[+-]?\d+$/.test(tok));
      }
      case 'nextInt': {
        var tok = this.scannerNextToken();
        if (!/^[+-]?\d+$/.test(tok)) {
          throw jerr('runtime', 'java.util.InputMismatchException',
            'For input string: "' + tok + '"', line,
            'Scanner.nextInt() 只能读整数；输入里有文字或小数会导致这个异常。检查 opts.stdin 的内容');
        }
        return V_INT(parseInt(tok, 10));
      }
      case 'nextLong': {
        var tok2 = this.scannerNextToken();
        if (!/^[+-]?\d+$/.test(tok2)) {
          throw jerr('runtime', 'java.util.InputMismatchException', 'For input string: "' + tok2 + '"', line, '');
        }
        return V_LONG(parseInt(tok2, 10));
      }
      case 'nextDouble': {
        var tok3 = this.scannerNextToken();
        if (!/^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/.test(tok3)) {
          throw jerr('runtime', 'java.util.InputMismatchException', 'For input string: "' + tok3 + '"', line,
            'Scanner.nextDouble() 读的是小数，输入里要有数字');
        }
        return V_DOUBLE(parseFloat(tok3));
      }
      case 'nextBoolean': {
        var tok4 = this.scannerNextToken().toLowerCase();
        if (tok4 !== 'true' && tok4 !== 'false') {
          throw jerr('runtime', 'java.util.InputMismatchException', 'For input string: "' + tok4 + '"', line, '');
        }
        return V_BOOL(tok4 === 'true');
      }
      case 'close': return { type: 'void', value: null };
      default:
        throw jerr('compile', 'CannotFindSymbol', 'Scanner 没有方法 ' + name + '()', line,
          '常用：nextInt() nextDouble() next() nextLine() hasNext()');
    }
  };

  /* ---- System / Math / 包装类 / Arrays 的静态方法 ---- */
  Machine.prototype.callStatic = function* (clsName, name, args, line) {
    /* 用户自己的类：静态方法（第一次用到才跑该类的 static 初始化） */
    var cls = this.classes[clsName];
    if (cls) {
      if (!this.staticsReady[clsName]) yield* this.ensureStatics(clsName);
      if (name === 'getSimpleName' || name === 'getName') return this.newString(clsName);
      var found = this.findMethod(clsName, name, args);
      if (found) return yield* this.callUserMethod(found.owner, found.method, args, NULL_VAL, line);
    }
    var builtin = yield* this.tryBuiltinStatic(clsName, name, args, line);
    if (builtin) return builtin;
    throw jerr('compile', 'CannotFindSymbol', clsName + ' 里找不到静态方法 ' + name + '(' + args.length + ' 个参数)', line,
      '检查方法名拼写和参数个数');
  };

  Machine.prototype.tryBuiltinStatic = function* (clsName, name, args, line) {
    /* System.arraycopy / currentTimeMillis */
    if (clsName === 'System' || clsName === null) {
      if (name === 'arraycopy' && args.length === 5) {
        var src = this.deref(args[0], 'arraycopy');
        var srcPos = toIntArg(args, 1, line);
        var dest = this.deref(args[2], 'arraycopy');
        var destPos = toIntArg(args, 3, line);
        var len = toIntArg(args, 4, line);
        if (!src.elements || !dest.elements) throw typeErr('arraycopy 的参数必须是数组', line, '');
        if (srcPos < 0 || destPos < 0 || len < 0 || srcPos + len > src.elements.length || destPos + len > dest.elements.length) {
          throw javaEx('ArrayIndexOutOfBoundsException', 'arraycopy 参数越界', 'srcPos/destPos/length 之和不能超过数组长度');
        }
        for (var i = 0; i < len; i++) dest.elements[destPos + i] = src.elements[srcPos + i];
        return { type: 'void', value: null };
      }
      if (name === 'currentTimeMillis') return V_LONG(Date.now());
      if (name === 'exit') throw javaEx('SecurityException', '本站不支持 System.exit()', '直接结束 main 方法即可');
    }

    /* Math */
    if (clsName === 'Math') {
      var a0 = args[0], a1 = args[1];
      function numAt(i) {
        var v = args[i];
        if (!v || !isNumericVal(v)) throw typeErr('Math.' + name + ' 需要数字参数', line, '');
        return v;
      }
      function asDouble(v) { return +v.value; }
      switch (name) {
        case 'abs': {
          var v0 = numAt(0);
          if (v0.type === 'int') return V_INT(Math.abs(v0.value | 0));
          if (v0.type === 'long') return V_LONG(Math.abs(v0.value));
          if (v0.type === 'float') return V_FLOAT(Math.abs(v0.value));
          if (v0.type === 'char') return V_INT(Math.abs(v0.value));
          return V_DOUBLE(Math.abs(v0.value));
        }
        case 'max': case 'min': {
          var x = numAt(0), y = numAt(1);
          var pt = promoteType(x.type, y.type);
          var r = name === 'max' ? Math.max(x.value, y.value) : Math.min(x.value, y.value);
          if (pt === 'double') return V_DOUBLE(r);
          if (pt === 'long') return V_LONG(r);
          return V_INT(r);
        }
        case 'pow': return V_DOUBLE(Math.pow(asDouble(numAt(0)), asDouble(numAt(1))));
        case 'sqrt': return V_DOUBLE(Math.sqrt(asDouble(numAt(0))));
        case 'cbrt': return V_DOUBLE(Math.cbrt(asDouble(numAt(0))));
        case 'random': return V_DOUBLE(Math.random());
        case 'floor': return V_DOUBLE(Math.floor(asDouble(numAt(0))));
        case 'ceil': return V_DOUBLE(Math.ceil(asDouble(numAt(0))));
        case 'round': {
          var vr = numAt(0);
          /* Java：float 版返回 int（饱和），double 版返回 long（饱和） */
          if (vr.type === 'float') return V_INT(narrowToInt(Math.round(vr.value)));
          return narrowToLong(Math.round(vr.value));
        }
        case 'sin': return V_DOUBLE(Math.sin(asDouble(numAt(0))));
        case 'cos': return V_DOUBLE(Math.cos(asDouble(numAt(0))));
        case 'tan': return V_DOUBLE(Math.tan(asDouble(numAt(0))));
        case 'log': return V_DOUBLE(Math.log(asDouble(numAt(0))));
        case 'log10': return V_DOUBLE(Math.log10(asDouble(numAt(0))));
        case 'exp': return V_DOUBLE(Math.exp(asDouble(numAt(0))));
        case 'toRadians': return V_DOUBLE(asDouble(numAt(0)) * Math.PI / 180);
        case 'toDegrees': return V_DOUBLE(asDouble(numAt(0)) * 180 / Math.PI);
        case 'hypot': return V_DOUBLE(Math.hypot(asDouble(numAt(0)), asDouble(numAt(1))));
        case 'signum': return V_DOUBLE(Math.sign(asDouble(numAt(0))));
        default: break;
      }
    }

    /* Integer / Long / Double / Character / Boolean 包装类 */
    if (clsName === 'Integer' || clsName === 'Long') {
      var isLong = clsName === 'Long';
      if (name === 'parseInt' || name === 'parseLong') {
        var str = args[0];
        if (!str || str.type !== 'String') throw typeErr(clsName + '.' + name + ' 需要 String 参数', line, '例如 Integer.parseInt("42")');
        var radix = args.length > 1 ? toIntArg(args, 1, line) : 10;
        var rawStr = str.value;
        var fmtErr = jerr('runtime', 'NumberFormatException', 'For input string: "' + rawStr + '"', line,
          '文本要全是数字才能转成整数（"12" 可以，"12a"、" 12"、"12.5" 都不行），且不能超出 int 范围');
        if (radix < 2 || radix > 36) {
          throw jerr('runtime', 'NumberFormatException', 'radix ' + radix + ' out of range', line, '进制只能是 2~36');
        }
        var mm = /^([+-]?)([0-9a-zA-Z]+)$/.exec(rawStr);
        if (!mm) throw fmtErr;
        var digits = mm[2], absVal = 0, digitOk = true;
        for (var di = 0; di < digits.length; di++) {
          var dv = charDigit(digits.charAt(di));
          if (dv < 0 || dv >= radix) { digitOk = false; break; }
          absVal = absVal * radix + dv;
        }
        if (!digitOk || !isFinite(absVal)) throw fmtErr;
        var parsed = mm[1] === '-' ? -absVal : absVal;
        if (isLong) {
          if (parsed >= LONG_MAX || parsed <= -LONG_MAX) throw fmtErr;
          return narrowToLong(parsed);
        }
        if (parsed > 2147483647 || parsed < -2147483648) throw fmtErr;
        return V_INT(parsed);
      }
      if (name === 'toString') {
        var nv = args[0];
        if (!nv || !isNumericVal(nv)) throw typeErr(clsName + '.toString 需要数字参数', line, '');
        var base = args.length > 1 ? toIntArg(args, 1, line) : 10;
        var num = Math.trunc(nv.value);
        return this.internString(base === 10 ? String(num) : num.toString(base));
      }
      if (name === 'valueOf') return args[0] || V_INT(0);
      if (name === 'compare') return V_INT(numOf(args[0]) - numOf(args[1]));
      if (name === 'max') return V_INT(Math.max(numOf(args[0]), numOf(args[1])));
      if (name === 'min') return V_INT(Math.min(numOf(args[0]), numOf(args[1])));
      if (name === 'toBinaryString') return this.internString((numOf(args[0]) | 0).toString(2));
      if (name === 'toHexString') return this.internString((numOf(args[0]) >>> 0).toString(16));
      if (name === 'bitCount') {
        var xb = numOf(args[0]) | 0, cnt = 0;
        while (xb) { cnt += xb & 1; xb >>>= 1; }
        return V_INT(cnt);
      }
    }
    if (clsName === 'Double') {
      if (name === 'parseDouble') {
        var ds = args[0];
        if (!ds || ds.type !== 'String') throw typeErr('Double.parseDouble 需要 String 参数', line, '例如 Double.parseDouble("3.14")');
        var dv = parseFloat(ds.value);
        if (isNaN(dv) && ds.value.trim() !== 'NaN') {
          throw jerr('runtime', 'NumberFormatException', 'For input string: "' + ds.value + '"', line,
            '文本要能解析成小数，例如 "3.14"');
        }
        return V_DOUBLE(dv);
      }
      if (name === 'valueOf') return args[0] ? V_DOUBLE(args[0].value) : V_DOUBLE(0);
      if (name === 'toString') return this.internString(doubleStr(args[0] ? args[0].value : NaN));
      if (name === 'isNaN') return V_BOOL(args[0] && args[0].value !== args[0].value);
      if (name === 'isInfinite') return V_BOOL(args[0] && !isFinite(args[0].value));
    }
    if (clsName === 'Character') {
      var cv = args[0];
      function charCode(v) {
        if (!v) throw typeErr('Character 方法需要 char 参数', line, '');
        if (v.type === 'char') return v.value;
        if (v.type === 'int') return v.value;
        throw typeErr('Character 方法需要 char，实际是 ' + v.type, line, "字符用单引号，如 'a'");
      }
      switch (name) {
        case 'isDigit': return V_BOOL(/[0-9]/.test(String.fromCharCode(charCode(cv))));
        case 'isLetter': return V_BOOL(/[A-Za-z]/.test(String.fromCharCode(charCode(cv))));
        case 'isLetterOrDigit': return V_BOOL(/[A-Za-z0-9]/.test(String.fromCharCode(charCode(cv))));
        case 'isUpperCase': {
          var cu = String.fromCharCode(charCode(cv));
          return V_BOOL(cu >= 'A' && cu <= 'Z');
        }
        case 'isLowerCase': {
          var cl = String.fromCharCode(charCode(cv));
          return V_BOOL(cl >= 'a' && cl <= 'z');
        }
        case 'isWhitespace': return V_BOOL(/\s/.test(String.fromCharCode(charCode(cv))));
        case 'toUpperCase': return V_CHAR(String.fromCharCode(charCode(cv)).toUpperCase().charCodeAt(0));
        case 'toLowerCase': return V_CHAR(String.fromCharCode(charCode(cv)).toLowerCase().charCodeAt(0));
        case 'getNumericValue': {
          var ch = String.fromCharCode(charCode(cv));
          return V_INT(/[0-9]/.test(ch) ? parseInt(ch, 10) : (/[A-Za-z]/.test(ch) ? ch.toUpperCase().charCodeAt(0) - 55 : -1));
        }
        case 'toString': return this.internString(String.fromCharCode(charCode(cv)));
        default: break;
      }
    }
    if (clsName === 'Boolean') {
      if (name === 'parseBoolean') return V_BOOL(args[0] && String(args[0].value).toLowerCase() === 'true');
      if (name === 'toString') return this.internString(args[0] ? booleanStr(!!args[0].value) : 'false');
      if (name === 'valueOf') return V_BOOL(args[0] && args[0].value === true);
    }

    /* String 静态方法 */
    if (clsName === 'String') {
      if (name === 'valueOf') {
        var v = args[0] || NULL_VAL;
        if (v.type === 'ref') {
          var o2 = this.heap[v.ref];
          if (o2 && o2.kind === 'array' && o2.elemType === 'char') {
            /* Java 还有 valueOf(char[] data, int offset, int count) 重载 */
            var off2 = 0, cnt2 = o2.elements.length;
            if (args.length >= 3) {
              off2 = toIntArg(args, 1, line);
              cnt2 = toIntArg(args, 2, line);
              if (off2 < 0 || cnt2 < 0 || off2 + cnt2 > o2.elements.length) {
                throw javaEx('StringIndexOutOfBoundsException', 'offset ' + off2 + ', count ' + cnt2 + ', length ' + o2.elements.length, '');
              }
            }
            var cs = '';
            for (var ci2 = off2; ci2 < off2 + cnt2; ci2++) cs += charStr(o2.elements[ci2]);
            return this.internString(cs);
          }
        }
        return this.internString(yield* this.javaToString(v));
      }
      if (name === 'format') {
        var f2 = args[0] && args[0].type === 'String' ? args[0].value : '';
        return this.newString(yield* this.formatString(f2, args.slice(1), line));
      }
      if (name === 'join') {
        var delim = args[0] && args[0].type === 'String' ? args[0].value : '';
        var listVal = args[1];
        var parts = [];
        if (listVal && listVal.type === 'ref') {
          var lo = this.heap[listVal.ref];
          if (lo && lo.elements) {
            for (var lj = 0; lj < lo.elements.length; lj++) parts.push(yield* this.javaToString(lo.elements[lj]));
          }
        } else if (args.length > 1) {
          for (var ak = 1; ak < args.length; ak++) parts.push(yield* this.javaToString(args[ak]));
        }
        return this.internString(parts.join(delim));
      }
    }

    /* Arrays */
    if (clsName === 'Arrays') {
      var arrVal = args[0];
      var arrObj = null;
      if (arrVal && arrVal.type === 'ref') arrObj = this.heap[arrVal.ref];
      if (name === 'toString') {
        if (!arrObj || arrObj.kind !== 'array') throw typeErr('Arrays.toString 需要数组参数', line, '例如 Arrays.toString(arr)');
        return this.internString(this.arrayContents(arrObj));
      }
      if (name === 'deepToString') {
        if (!arrObj || arrObj.kind !== 'array') throw typeErr('Arrays.deepToString 需要数组参数', line, '');
        var self = this;
        function deep(o) {
          if (!o || o.kind !== 'array') return 'null';
          var ps = [];
          for (var i2 = 0; i2 < o.elements.length; i2++) {
            var e = o.elements[i2];
            if (e && e.type === 'ref') {
              var io = self.heap[e.ref];
              if (io && io.kind === 'array') { ps.push(deep(io)); continue; }
            }
            ps.push(self.elemText(e, o.elemType));
          }
          return '[' + ps.join(', ') + ']';
        }
        return this.internString(deep(arrObj));
      }
      if (name === 'sort') {
        if (!arrObj || arrObj.kind !== 'array') throw typeErr('Arrays.sort 需要数组参数', line, '');
        var elems = arrObj.elements;
        elems.sort(function (a, b) {
          if (a.type === 'String' && b.type === 'String') return a.value < b.value ? -1 : (a.value > b.value ? 1 : 0);
          if (a.type === 'char' && b.type === 'char') return a.value - b.value;
          return (a.value || 0) - (b.value || 0);
        });
        return { type: 'void', value: null };
      }
      if (name === 'fill') {
        if (!arrObj || arrObj.kind !== 'array') throw typeErr('Arrays.fill 需要数组参数', line, '');
        var fillVal = args[1] || NULL_VAL;
        for (var fi = 0; fi < arrObj.elements.length; fi++) arrObj.elements[fi] = fillVal;
        return { type: 'void', value: null };
      }
      if (name === 'copyOf') {
        if (!arrObj || arrObj.kind !== 'array') throw typeErr('Arrays.copyOf 需要数组参数', line, '');
        var newLen = toIntArg(args, 1, line);
        if (newLen < 0) throw javaEx('NegativeArraySizeException', String(newLen), '');
        var copy = this.alloc('array', arrObj.type);
        for (var cj = 0; cj < newLen; cj++) {
          copy.elements.push(cj < arrObj.elements.length ? arrObj.elements[cj] : defaultValForType(arrObj.elemType));
        }
        return V_REF(copy.id);
      }
      if (name === 'copyOfRange') {
        /* Arrays.copyOfRange(a, from, to)：左闭右开；to 超过长度时补默认值 */
        if (!arrObj || arrObj.kind !== 'array') throw typeErr('Arrays.copyOfRange 需要数组参数', line, '');
        var fromI = toIntArg(args, 1, line);
        var toI = toIntArg(args, 2, line);
        var rangeCopy = this.alloc('array', arrObj.type);
        for (var ri = fromI; ri < toI; ri++) {
          rangeCopy.elements.push(ri >= 0 && ri < arrObj.elements.length
            ? arrObj.elements[ri] : defaultValForType(arrObj.elemType));
        }
        return V_REF(rangeCopy.id);
      }
      if (name === 'equals') {
        var oa = args[0] && this.heap[args[0].ref];
        var ob = args[1] && this.heap[args[1].ref];
        if (!oa || !ob || !oa.elements || !ob.elements) return V_BOOL(false);
        if (oa.elements.length !== ob.elements.length) return V_BOOL(false);
        for (var ei = 0; ei < oa.elements.length; ei++) {
          if (!this.valueEquals(oa.elements[ei], ob.elements[ei])) return V_BOOL(false);
        }
        return V_BOOL(true);
      }
      if (name === 'binarySearch') {
        if (!arrObj || !arrObj.elements) throw typeErr('Arrays.binarySearch 需要数组参数', line, '');
        var key = args[1];
        var lo = 0, hi = arrObj.elements.length - 1, res = -1;
        while (lo <= hi) {
          var mid = (lo + hi) >> 1;
          var cmp = (arrObj.elements[mid].value > key.value) ? 1 : (arrObj.elements[mid].value < key.value ? -1 : 0);
          if (cmp === 0) { res = mid; break; }
          if (cmp < 0) lo = mid + 1; else hi = mid - 1;
        }
        return V_INT(res < 0 ? -(lo + 1) : res);
      }
    }

    /* Collections（ArrayList 排序/反转） */
    if (clsName === 'Collections') {
      var lv = args[0] && args[0].type === 'ref' ? this.heap[args[0].ref] : null;
      if (!lv || lv.kind !== 'list') throw typeErr('Collections.' + name + ' 需要 ArrayList 参数', line, '');
      if (name === 'sort') {
        lv.elements.sort(function (a, b) {
          if (a.type === 'String' && b.type === 'String') return a.value < b.value ? -1 : (a.value > b.value ? 1 : 0);
          return (a.value || 0) - (b.value || 0);
        });
        return { type: 'void', value: null };
      }
      if (name === 'reverse') { lv.elements.reverse(); return { type: 'void', value: null }; }
      if (name === 'shuffle') {
        for (var si = lv.elements.length - 1; si > 0; si--) {
          var sj = Math.floor(Math.random() * (si + 1));
          var tmp = lv.elements[si]; lv.elements[si] = lv.elements[sj]; lv.elements[sj] = tmp;
        }
        return { type: 'void', value: null };
      }
      if (name === 'max' || name === 'min') {
        if (!lv.elements.length) throw javaEx('NoSuchElementException', '集合是空的', '');
        var best = lv.elements[0];
        for (var bi = 1; bi < lv.elements.length; bi++) {
          var cmp2 = best.value > lv.elements[bi].value;
          if (name === 'max' ? !cmp2 : cmp2) best = lv.elements[bi];
        }
        return best;
      }
    }

    return null;
  };

  /* ==================================================================
   * 11. 内存快照（Snapshot）
   *     每步给出：当前行 + 所有栈帧的局部变量 + 可达堆对象 + 目前输出。
   *     额外算 changed 标记，编辑器就能把"刚刚变化的值"高亮出来。
   * ================================================================== */

  Machine.prototype.fingerprint = function (val) {
    if (!val) return '?';
    if (val.type === 'ref') return 'r' + val.ref;
    if (val.type === 'String') return 'S' + val.value;
    if (val.type === 'null') return 'null';
    return val.type + ':' + val.value;
  };

  Machine.prototype.exportValue = function (val) {
    if (!val) return { type: 'null', value: null, display: 'null' };
    if (val.type === 'ref') return { type: 'ref', ref: val.ref, display: val.ref };
    var out = { type: val.type, display: displayOf(val) };
    if (val.type === 'String') out.value = val.value;
    else if (val.type === 'char') { out.value = val.value; out.char = charStr(val); }
    else out.value = val.value;
    return out;
  };

  Machine.prototype.collectRef = function (val, into) {
    if (val && val.type === 'ref' && val.ref) into[val.ref] = true;
  };

  Machine.prototype.snapshot = function () {
    var prev = this._prevPrint;
    var curPrint = Object.create(null);
    var framesOut = [];
    var reachable = Object.create(null);
    var i, j;

    for (i = 0; i < this.frames.length; i++) {
      var f = this.frames[i];
      /* 合并作用域链（外层 → 内层，内层同名变量覆盖外层） */
      var ordered = [];
      var merged = Object.create(null);
      for (var s = 0; s < f.scopes.length; s++) {
        var sc = f.scopes[s];
        for (var oi = 0; oi < sc.order.length; oi++) {
          var nm = sc.order[oi];
          if (!merged[nm]) ordered.push(nm);
          merged[nm] = sc.vars[nm];
        }
      }
      var locals = {};
      var localOrder = [];
      for (j = 0; j < ordered.length; j++) {
        var name = ordered[j];
        var item = merged[name];
        if (!item) continue;
        var key = 'f' + f.uid + '.' + name;
        var fp = this.fingerprint(item.val);
        curPrint[key] = fp;
        var vOut = this.exportValue(item.val);
        vOut.decl = item.type;
        vOut.changed = !!(prev && prev[key] !== undefined && prev[key] !== fp);
        locals[name] = vOut;
        localOrder.push(name);
        this.collectRef(item.val, reachable);
      }
      var frameOut = {
        id: f.uid, name: f.name, cls: f.cls, line: f.line,
        locals: locals, localOrder: localOrder, callLine: f.callLine,
        isCtor: !!f.isCtor
      };
      if (f.thisVal) {
        frameOut.thisRef = f.thisVal.ref || null;
        this.collectRef(f.thisVal, reachable);
      }
      framesOut.push(frameOut);
    }

    /* 静态字段里的引用也算根 */
    for (var cn in this.statics) {
      var table = this.statics[cn];
      for (var fn in table) this.collectRef(table[fn].val, reachable);
    }

    /* 可达性传递：反复扫已标记对象，直到没有新对象 */
    var grew = true;
    while (grew) {
      grew = false;
      var keys = Object.keys(reachable);
      for (var ki = 0; ki < keys.length; ki++) {
        var obj0 = this.heap[keys[ki]];
        if (!obj0) continue;
        var refs = [];
        if (obj0.elements) { for (j = 0; j < obj0.elements.length; j++) refs.push(obj0.elements[j]); }
        if (obj0.entries) {
          for (j = 0; j < obj0.entries.length; j++) { refs.push(obj0.entries[j].key); refs.push(obj0.entries[j].val); }
        }
        if (obj0.fields) { for (var fk in obj0.fields) refs.push(obj0.fields[fk]); }
        for (var ri = 0; ri < refs.length; ri++) {
          var rv = refs[ri];
          if (rv && rv.type === 'ref' && rv.ref && !reachable[rv.ref]) { reachable[rv.ref] = true; grew = true; }
        }
      }
    }

    /* 导出堆对象（只导出可达的，避免显示一堆垃圾对象） */
    var heapOut = [];
    var heapIds = Object.keys(reachable).sort(function (a, b) {
      return parseInt(a.slice(1), 10) - parseInt(b.slice(1), 10);
    });
    for (i = 0; i < heapIds.length; i++) {
      var id = heapIds[i];
      var o = this.heap[id];
      if (!o) continue;
      var ho = { id: o.id, kind: o.kind, type: o.type, classChain: o.classChain };
      if (o.kind === 'array' || o.kind === 'list' || o.kind === 'set') {
        ho.elements = [];
        ho.elemType = o.elemType;
        for (j = 0; j < o.elements.length; j++) {
          var ek = o.id + '[' + j + ']';
          var efp = this.fingerprint(o.elements[j]);
          curPrint[ek] = efp;
          var ev = this.exportValue(o.elements[j]);
          ev.changed = !!(prev && prev[ek] !== undefined && prev[ek] !== efp);
          ho.elements.push(ev);
        }
      } else if (o.kind === 'map') {
        ho.entries = [];
        for (j = 0; j < o.entries.length; j++) {
          var mkKey = o.id + '{' + j + '}k';
          var mvKey = o.id + '{' + j + '}v';
          var kfp = this.fingerprint(o.entries[j].key);
          var vfp = this.fingerprint(o.entries[j].val);
          curPrint[mkKey] = kfp;
          curPrint[mvKey] = vfp;
          var kOut = this.exportValue(o.entries[j].key);
          var vOut2 = this.exportValue(o.entries[j].val);
          kOut.changed = !!(prev && prev[mkKey] !== undefined && prev[mkKey] !== kfp);
          vOut2.changed = !!(prev && prev[mvKey] !== undefined && prev[mvKey] !== vfp);
          ho.entries.push({ key: kOut, val: vOut2 });
        }
      } else {
        ho.fields = {};
        ho.fieldOrder = [];
        var seen = Object.create(null);
        var order = (o.fieldOrder && o.fieldOrder.length) ? o.fieldOrder : Object.keys(o.fields);
        for (j = 0; j < order.length; j++) {
          var fStorage = order[j];
          if (!Object.prototype.hasOwnProperty.call(o.fields, fStorage)) continue;
          /* 存储 key 是 "声明类.字段名"，展示时只显示字段名；被隐藏的同名字段用全名区分 */
          var fName = fStorage.indexOf('.') >= 0 ? fStorage.slice(fStorage.indexOf('.') + 1) : fStorage;
          if (seen[fName]) fName = fStorage;
          if (seen[fName]) continue;
          seen[fName] = true;
          var fKey = o.id + '.' + fStorage;
          var fFp = this.fingerprint(o.fields[fStorage]);
          curPrint[fKey] = fFp;
          var fv = this.exportValue(o.fields[fStorage]);
          fv.changed = !!(prev && prev[fKey] !== undefined && prev[fKey] !== fFp);
          ho.fields[fName] = fv;
          ho.fieldOrder.push(fName);
        }
      }
      heapOut.push(ho);
    }

    this._prevPrint = curPrint;
    this._prevLine = this.line;

    /* 静态字段单独导出：学生要能单步看到 static 计数器（OOP 章节的核心教具） */
    var staticsOut = [];
    for (var scn in this.statics) {
      var stable = this.statics[scn];
      for (var sfn in stable) {
        var sf = stable[sfn];
        var sKey = 's' + scn + '.' + sfn;
        var sFp = this.fingerprint(sf.val);
        var sv2 = this.exportValue(sf.val);
        sv2.cls = scn;
        sv2.name = sfn;
        sv2.decl = sf.type;
        sv2.changed = !!(prev && prev[sKey] !== undefined && prev[sKey] !== sFp);
        curPrint[sKey] = sFp;
        staticsOut.push(sv2);
      }
    }

    var snap = {
      line: this.line,
      frames: framesOut,
      heap: heapOut,
      statics: staticsOut,
      output: this.output,
      stackTop: Math.max(0, this.frames.length - 1),
      callDepth: this.frames.length,
      phase: this.done ? 'done' : 'stmt',
      steps: this.steps
    };
    if (this.collectTrace && this.trace.length < 20000) this.trace.push(snap);
    return snap;
  };

  /* ==================================================================
   * 12. 对外 API：run / session / parse
   * ================================================================== */

  /** 把内部异常对象转成 CONTRACT 要求的 error 结构（补一段 Java 风格的完整文本） */
  function errorOut(e) {
    if (!e || !e.__javaError) {
      e = jerr('runtime', 'InternalError', '引擎内部错误：' + (e && e.message ? e.message : String(e)),
        1, '这是引擎的 bug（不是你代码的问题）');
    }
    var line = e.line || 1;
    var text;
    if (e.stage === 'runtime') {
      text = 'Exception in thread "main" ' + e.type + (e.message ? ': ' + e.message : '') + '\n\tat line ' + line;
    } else {
      text = '编译错误（第 ' + line + ' 行）' + (e.type ? ' · ' + e.type : '') + '：' + e.message;
    }
    return {
      stage: e.stage,
      type: e.type,
      message: e.message,
      line: line,
      hint: e.hint || '',
      text: text
    };
  }

  function emptySnapshot() {
    return { line: 0, frames: [], heap: [], statics: [], output: '', stackTop: 0, callDepth: 0, phase: 'stmt', steps: 0 };
  }

  function makeResult(machine, err) {
    return {
      ok: !err,
      output: machine ? machine.output : '',
      error: err ? errorOut(err) : null,
      steps: machine ? machine.steps : 0
    };
  }

  /** 会话工厂：创建时先做词法/语法分析，之后每次 step() 推进一步 */
  function createSession(source, opts) {
    opts = opts || {};
    var state = {
      source: String(source == null ? '' : source),
      opts: opts,
      machine: null,
      gen: null,
      finished: false,
      result: null,
      lastSnap: null
    };

    function boot() {
      try {
        var parsed = parseToAst(state.source);
        state.machine = new Machine(opts);
        state.machine.prepare(parsed.program);
        if (opts.trace) { state.machine.collectTrace = true; state.machine.trace = []; }
        state.gen = state.machine.execute();
        state.finished = false;
        state.result = null;
        state.lastSnap = null;
      } catch (e) {
        state.finished = true;
        state.result = {
          ok: false,
          output: '',
          error: errorOut(e),
          steps: 0
        };
      }
    }
    boot();

    var session = {
      /** 推进一步：{ done:false, snapshot } 或 { done:true, result } */
      step: function () {
        if (state.finished) return { done: true, result: state.result };
        var r = state.gen.next();
        if (r.done) {
          state.finished = true;
          state.result = makeResult(state.machine, state.machine.error);
          if (state.machine.collectTrace) state.result.trace = state.machine.trace;
          return { done: true, result: state.result };
        }
        state.lastSnap = r.value;
        return { done: false, snapshot: r.value };
      },
      /** 一路执行到结束（死循环保护在引擎内部） */
      runAll: function () {
        var guard = 0;
        while (!state.finished) {
          var r = session.step();
          if (r.done) return r.result;
          if (++guard > 5000000) break;
        }
        return state.result;
      },
      /** 回到“还没开始执行”的状态（用于再次运行 / 重置单步） */
      reset: function () { boot(); },
      /** 最近一次快照（还没 step 过时给一个空快照） */
      snapshot: function () { return state.lastSnap || emptySnapshot(); },
      currentLine: function () { return state.lastSnap ? state.lastSnap.line : 0; },
      /** 供编辑器读取：当前是否已经结束 */
      isDone: function () { return state.finished; }
    };
    return session;
  }

  function runSource(source, opts) {
    opts = opts || {};
    /* 一次性运行默认不生成快照（单步会话才需要）；trace 模式保持原行为 */
    var runOpts = {};
    for (var k in opts) { if (Object.prototype.hasOwnProperty.call(opts, k)) runOpts[k] = opts[k]; }
    if (!opts.trace && opts.snapshots !== true) runOpts.snapshots = false;
    var session = createSession(source, runOpts);
    var result = session.runAll();
    if (opts.trace) {
      if (!result.trace) result.trace = [];
    }
    return result;
  }

  function parseSource(source) {
    try {
      parseToAst(String(source == null ? '' : source));
      return { ok: true, error: null };
    } catch (e) {
      return { ok: false, error: errorOut(e) };
    }
  }

  /* 内置方法速查（编辑器里的提示用） */
  var BUILTIN_DOCS = {
    'System.out.println': '打印参数并换行；无参数时输出一个空行',
    'System.out.print': '打印参数，不换行',
    'System.out.printf': '按格式打印：%d 整数、%s 文本、%f 小数、%n 换行',
    'Math.abs': '绝对值（int 返回 int，double 返回 double）',
    'Math.max': '两个数里较大的一个',
    'Math.min': '两个数里较小的一个',
    'Math.pow': 'a 的 b 次方，返回 double',
    'Math.sqrt': '平方根，返回 double',
    'Math.random': '返回 [0, 1) 之间的随机 double',
    'Math.round': '四舍五入到整数',
    'String.length': '字符串长度 s.length()',
    'String.charAt': '取第 i 个字符 s.charAt(i)',
    'String.substring': '截取 [begin, end) 子串',
    'String.equals': '比较字符串内容（不要用 ==）',
    'String.indexOf': '子串第一次出现的位置，找不到返回 -1',
    'Integer.parseInt': '把字符串转成 int',
    'Integer.toString': '把 int 转成字符串',
    'Arrays.toString': '把数组打印成 [1, 2, 3]',
    'Arrays.sort': '对数组原地排序',
    'ArrayList.add': '往列表末尾添加元素',
    'ArrayList.get': '取第 i 个元素',
    'ArrayList.size': '列表里有多少个元素',
    'Scanner.nextInt': '读取下一个整数',
    'Scanner.nextLine': '读取一整行文本'
  };

  var api = {
    version: ENGINE_VERSION,
    run: runSource,
    session: createSession,
    parse: parseSource,
    keywords: KEYWORDS.slice(),
    builtinDocs: BUILTIN_DOCS,
    /* 词法结果也暴露出来：编辑器可以做 token 级高亮 */
    tokenize: function (src) {
      try { return { ok: true, tokens: tokenize(String(src == null ? '' : src)) }; }
      catch (e) { return { ok: false, error: errorOut(e), tokens: [] }; }
    }
  };

  /* 注册到全局（浏览器）与 CommonJS（Node 自测） */
  if (typeof window !== 'undefined' && window.CSC) {
    window.CSC.java = api;
    if (window.CSC.bus && window.CSC.bus.emit) window.CSC.bus.emit('engine:ready', api);
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})();
