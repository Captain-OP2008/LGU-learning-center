/* C 语言学习中心 · 项目实战数据
 * 每个 starter/solution 都是可独立编译的 C99 代码；
 * 渲染器读取 CSC.registerProjects 注册的数组。
 */
(function () {
  'use strict';

  CSC.registerProjects([
  {
    id: "wordfreq",
    title: "词频统计",
    en: "Word Frequency",
    tagline: "统计文本里出现最多的单词",
    level: "入门",
    minutes: 150,
    chapters: ["ch04", "ch05", "ch06"],
    goals: ["用 fgets 逐行读取文件，正确统计行数、字符数与最长行", "用 strtok 切词、tolower 归一化，把单词安全存入结构体数组", "用 qsort 的比较函数实现词频降序、同频字典序", "加入停用词与最小长度过滤，输出可解释的统计结果"],
    intro: "从一个纯文本文件出发，统计每个单词出现的次数，并按次数从高到低打印 Top N。项目经过「读文件 → 切词 → 排序 → 过滤」四步，最终得到一个类似 wc 加词频分析的小工具。",
    milestones: [
      {
        n: 1,
        title: "读取文件",
        tasks: ["以 \"r\" 打开文件；失败时说明原因并返回非 0", "用 fgets 逐行读取，统计行数、总字符数与最长行长度", "去掉行尾换行符后再比较长度，处理最后一行没有换行符的情况"],
        starter: String.raw`/* wordfreq · M1 起步：打开文件、逐行读取，补全统计逻辑
 * 编译：gcc -std=c99 -Wall -Wextra wf1_start.c -o wf1
 */
#include <stdio.h>
#include <string.h>

#define INPUT_PATH "input.txt"
#define MAX_LINE   1024

int main(void) {
    FILE *fp = fopen(INPUT_PATH, "r");
    if (fp == NULL) {
        fprintf(stderr, "打不开 %s：请先在程序目录创建这个文本文件。\n", INPUT_PATH);
        return 1;
    }

    char line[MAX_LINE];
    char longest[MAX_LINE] = "";
    long lines = 0;
    long chars = 0;
    size_t longest_len = 0;

    while (fgets(line, sizeof line, fp) != NULL) {
        size_t len = strlen(line);
        (void)len;   /* TODO 1：去掉行尾 '\n' / '\r'，得到有效长度 */

        /* TODO 2：lines 加一，chars 累加有效长度 */

        /* TODO 3：若 len 大于 longest_len，更新 longest 与 longest_len */

        (void)line;
    }

    /* TODO 4：检查 ferror(fp)，并在 fclose 后打印统计结果 */

    fclose(fp);
    printf("行数：%ld\n", lines);
    printf("字符数（不含换行）：%ld\n", chars);
    printf("最长行：%ld 字符\n", (long)longest_len);
    if (longest[0] != '\0') {
        printf("内容：%s\n", longest);
    }
    return 0;
}
`,
        hints: ["fgets(buf, sizeof buf, fp) 最多读 sizeof buf - 1 个字符，返回 NULL 表示读完或出错", "strlen 统计的是字节数；行尾的换行符要单独减掉", "最长行长度用 size_t 或 int 保存，初值 0"],
        solution: String.raw`/* wordfreq · M1：逐行读取文件，统计行数、字符数与最长行
 * 编译：gcc -std=c99 -Wall -Wextra wf1_sol.c -o wf1
 * 运行：先在同一目录准备 input.txt，再执行 ./wf1
 */
#include <stdio.h>
#include <string.h>

#define INPUT_PATH "input.txt"
#define MAX_LINE   1024

int main(void) {
    FILE *fp = fopen(INPUT_PATH, "r");
    if (fp == NULL) {
        fprintf(stderr, "打不开 %s：请先在程序目录创建这个文本文件。\n", INPUT_PATH);
        return 1;
    }

    char line[MAX_LINE];
    char longest[MAX_LINE] = "";
    long lines = 0;
    long chars = 0;
    size_t longest_len = 0;

    while (fgets(line, sizeof line, fp) != NULL) {
        size_t len = strlen(line);

        /* 去掉行尾换行；Windows 文本可能残留 '\r' */
        while (len > 0 && (line[len - 1] == '\n' || line[len - 1] == '\r')) {
            line[--len] = '\0';
        }

        lines++;
        chars += (long)len;
        if (len > longest_len) {
            longest_len = len;
            memcpy(longest, line, len + 1);   /* 连 '\0' 一起复制 */
        }
    }

    if (ferror(fp)) {
        fprintf(stderr, "读取 %s 时发生错误。\n", INPUT_PATH);
        fclose(fp);
        return 1;
    }
    if (fclose(fp) != 0) {
        fprintf(stderr, "关闭 %s 失败。\n", INPUT_PATH);
        return 1;
    }

    printf("文件：%s\n", INPUT_PATH);
    printf("行数：%ld\n", lines);
    printf("字符数（不含换行）：%ld\n", chars);
    printf("最长行：%ld 字符\n", (long)longest_len);
    if (longest_len > 0) {
        printf("内容：%s\n", longest);
    }
    return 0;
}
`,
        explain: "fgets 会把换行符一起读进来，所以「字符数」要决定是否把换行算进去；参考实现统一在去掉换行后统计。文件打开失败必须尽早返回，否则后续 fgets 会解引用空指针。"
      },
      {
        n: 2,
        title: "切词与归一化",
        tasks: ["用 strtok 以空格、制表符、换行和常见标点为分隔符切出单词", "对每个字符调用 tolower，参数先转成 unsigned char", "把单词复制进 words[][MAX_WORD] 之前检查长度与总词数，超限就跳过"],
        starter: String.raw`/* wordfreq · M2 起步：切词、转小写、存入二维字符数组
 * 编译：gcc -std=c99 -Wall -Wextra wf2_start.c -o wf2
 */
#include <ctype.h>
#include <stdio.h>
#include <string.h>

#define INPUT_PATH "input.txt"
#define MAX_LINE   1024
#define MAX_WORDS  4096
#define MAX_WORD   64
#define SHOW       12

static const char *const DELIMS = " \t\r\n.,;:!?\"'()[]{}<>/|@#$%^&*+=~";

/* TODO 1：把 tok 截断到 MAX_WORD-1，逐字符 tolower，写入 words[count]，
 *         补 '\0'，返回 count + 1；表满或空串时原样返回 count */
static int store_word(char words[][MAX_WORD], int count, const char *tok) {
    (void)words;
    (void)tok;
    return count;
}

int main(void) {
    FILE *fp = fopen(INPUT_PATH, "r");
    if (fp == NULL) {
        fprintf(stderr, "打不开 %s：请先在程序目录创建这个文本文件。\n", INPUT_PATH);
        return 1;
    }

    static char words[MAX_WORDS][MAX_WORD];
    char line[MAX_LINE];
    int count = 0;

    while (fgets(line, sizeof line, fp) != NULL) {
        char *tok = strtok(line, DELIMS);

        while (tok != NULL) {
            /* TODO 2：用 store_word 收集当前 token */
            count = store_word(words, count, tok);

            /* TODO 3：继续取下一个 token（注意传 NULL） */
            tok = strtok(NULL, DELIMS);
        }
    }
    fclose(fp);

    printf("共收集 %d 个词（词表上限 %d）\n", count, MAX_WORDS);
    if (count == 0) {
        printf("文件里没有找到任何单词（或 TODO 还没完成）。\n");
        return 0;
    }
    printf("前 %d 个词：\n", SHOW);
    for (int i = 0; i < count && i < SHOW; i++) {
        printf("%2d. %s\n", i + 1, words[i]);
    }
    return 0;
}
`,
        hints: ["strtok 会修改原字符串，并且连续分隔符只算一个", "tolower 的参数是 int，传负的 char 是未定义行为，先转 unsigned char", "复制用 strncpy 后手动补终止符，或者用 snprintf"],
        solution: String.raw`/* wordfreq · M2：按空白与标点切词，统一转小写后收集
 * 编译：gcc -std=c99 -Wall -Wextra wf2_sol.c -o wf2
 */
#include <ctype.h>
#include <stdio.h>
#include <string.h>

#define INPUT_PATH "input.txt"
#define MAX_LINE   1024
#define MAX_WORDS  4096
#define MAX_WORD   64
#define SHOW       12

/* 分隔符：空白 + 常见英文标点。strtok 会跳过连续的多个分隔符 */
static const char *const DELIMS = " \t\r\n.,;:!?\"'()[]{}<>/|@#$%^&*+=~";

/* 把一个词转成小写后存入表；返回新的词数 */
static int store_word(char words[][MAX_WORD], int count, const char *tok) {
    size_t len = strlen(tok);

    if (len == 0) {
        return count;
    }
    if (len >= MAX_WORD) {
        len = MAX_WORD - 1;          /* 超长词截断，保证还有 '\0' 的位置 */
    }
    if (count >= MAX_WORDS) {
        return count;                /* 表满，丢弃 */
    }

    for (size_t i = 0; i < len; i++) {
        words[count][i] = (char)tolower((unsigned char)tok[i]);
    }
    words[count][len] = '\0';
    return count + 1;
}

int main(void) {
    FILE *fp = fopen(INPUT_PATH, "r");
    if (fp == NULL) {
        fprintf(stderr, "打不开 %s：请先在程序目录创建这个文本文件。\n", INPUT_PATH);
        return 1;
    }

    /* 4096 × 64 字节约 256 KB，放在静态区，避免占满栈 */
    static char words[MAX_WORDS][MAX_WORD];
    char line[MAX_LINE];
    int count = 0;
    int dropped = 0;

    while (fgets(line, sizeof line, fp) != NULL) {
        char *tok = strtok(line, DELIMS);

        while (tok != NULL) {
            int before = count;
            count = store_word(words, count, tok);
            if (count == before) {
                dropped++;
            }
            tok = strtok(NULL, DELIMS);
        }
    }

    if (ferror(fp)) {
        fprintf(stderr, "读取 %s 时发生错误。\n", INPUT_PATH);
        fclose(fp);
        return 1;
    }
    if (fclose(fp) != 0) {
        fprintf(stderr, "关闭 %s 失败。\n", INPUT_PATH);
        return 1;
    }

    printf("共收集 %d 个词（词表上限 %d）\n", count, MAX_WORDS);
    if (dropped > 0) {
        printf("因词表已满被丢弃：%d 个\n", dropped);
    }
    if (count == 0) {
        printf("文件里没有找到任何单词。\n");
        return 0;
    }

    printf("前 %d 个词：\n", SHOW);
    for (int i = 0; i < count && i < SHOW; i++) {
        printf("%2d. %s\n", i + 1, words[i]);
    }
    return 0;
}
`,
        explain: "切词时把标点当分隔符，英文缩写和数字会被拆开，这是本项目的简化假设。tolower 只能处理 ASCII，对 UTF-8 中文不会改变字节，但也不会破坏字符串。"
      },
      {
        n: 3,
        title: "按词频排序",
        tasks: ["定义 WordCount { char word[MAX_WORD]; int count; }，边读边合并相同单词", "写 qsort 比较函数：先按 count 降序，count 相同按 strcmp 升序", "只输出前 N 名，并打印每词占比"],
        starter: String.raw`/* wordfreq · M3 起步：结构体计数表 + qsort，补全合并与排序
 * 编译：gcc -std=c99 -Wall -Wextra wf3_start.c -o wf3
 */
#include <ctype.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define INPUT_PATH  "input.txt"
#define MAX_LINE    1024
#define MAX_WORD    64
#define MAX_UNIQUE  2048
#define TOP_N       10

static const char *const DELIMS = " \t\r\n.,;:!?\"'()[]{}<>/@#$%^&*+=~";

typedef struct {
    char word[MAX_WORD];
    int  count;
} WordCount;

/* TODO 1：次数降序；次数相同按 strcmp 升序。
 *         注意不要用 a->count - b->count（可能溢出） */
static int cmp_count_desc(const void *pa, const void *pb) {
    (void)pa;
    (void)pb;
    return 0;
}

/* TODO 2：线性查找；找到返回下标，找不到返回 -1 */
static int find_word(const WordCount *tab, int n, const char *word) {
    (void)tab;
    (void)n;
    (void)word;
    return -1;
}

/* TODO 3：已存在则 count++；否则追加到 tab[n]（strncpy + 补 '\0'），
 *         返回新的不同词数；表满时原样返回 n */
static int add_word(WordCount *tab, int n, const char *word) {
    (void)tab;
    (void)n;
    (void)word;
    return n;
}

int main(void) {
    FILE *fp = fopen(INPUT_PATH, "r");
    if (fp == NULL) {
        fprintf(stderr, "打不开 %s：请先在程序目录创建这个文本文件。\n", INPUT_PATH);
        return 1;
    }

    static WordCount tab[MAX_UNIQUE];
    char line[MAX_LINE];
    char word[MAX_WORD];
    int unique = 0;
    int total = 0;

    while (fgets(line, sizeof line, fp) != NULL) {
        char *tok = strtok(line, DELIMS);

        while (tok != NULL) {
            size_t len = strlen(tok);

            if (len >= MAX_WORD) {
                len = MAX_WORD - 1;
            }
            for (size_t i = 0; i < len; i++) {
                word[i] = (char)tolower((unsigned char)tok[i]);
            }
            word[len] = '\0';

            if (len > 0) {
                total++;
                unique = add_word(tab, unique, word);
            }
            tok = strtok(NULL, DELIMS);
        }
    }
    fclose(fp);

    /* TODO 4：调用 qsort，再打印 total / unique 与 Top N */
    printf("总词数：%d\n", total);
    printf("不同词：%d\n", unique);
    printf("\nTop %d：\n", TOP_N);
    int show = (unique < TOP_N) ? unique : TOP_N;
    for (int i = 0; i < show; i++) {
        printf("%2d. %-18s %d\n", i + 1, tab[i].word, tab[i].count);
    }
    return 0;
}
`,
        hints: ["比较函数返回 int，不要用 a->count - b->count，可能溢出", "qsort 的比较函数签名是 int (*)(const void *, const void *)", "Top N 的 N 用 min(N, 不同词数) 限制"],
        solution: String.raw`/* wordfreq · M3：去重计数 + qsort 排序 + 输出 Top N
 * 编译：gcc -std=c99 -Wall -Wextra wf3_sol.c -o wf3
 */
#include <ctype.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define INPUT_PATH  "input.txt"
#define MAX_LINE    1024
#define MAX_WORD    64
#define MAX_UNIQUE  2048
#define TOP_N       10

static const char *const DELIMS = " \t\r\n.,;:!?\"'()[]{}<>/@#$%^&*+=~";

typedef struct {
    char word[MAX_WORD];
    int  count;
} WordCount;

/* 比较函数：次数从大到小；次数相同按字母升序 */
static int cmp_count_desc(const void *pa, const void *pb) {
    const WordCount *a = (const WordCount *)pa;
    const WordCount *b = (const WordCount *)pb;

    if (a->count != b->count) {
        return (a->count < b->count) ? 1 : -1;   /* 避免直接相减溢出 */
    }
    return strcmp(a->word, b->word);
}

/* 在表里找词；找到返回下标，找不到返回 -1 */
static int find_word(const WordCount *tab, int n, const char *word) {
    for (int i = 0; i < n; i++) {
        if (strcmp(tab[i].word, word) == 0) {
            return i;
        }
    }
    return -1;
}

/* 登记一个已经小写化的词；返回新的不同词数 */
static int add_word(WordCount *tab, int n, const char *word) {
    int idx = find_word(tab, n, word);

    if (idx >= 0) {
        tab[idx].count++;
        return n;
    }
    if (n >= MAX_UNIQUE) {
        return n;                      /* 表满：丢弃新词 */
    }
    strncpy(tab[n].word, word, MAX_WORD - 1);
    tab[n].word[MAX_WORD - 1] = '\0';
    tab[n].count = 1;
    return n + 1;
}

int main(void) {
    FILE *fp = fopen(INPUT_PATH, "r");
    if (fp == NULL) {
        fprintf(stderr, "打不开 %s：请先在程序目录创建这个文本文件。\n", INPUT_PATH);
        return 1;
    }

    static WordCount tab[MAX_UNIQUE];
    char line[MAX_LINE];
    char word[MAX_WORD];
    int unique = 0;
    int total = 0;

    while (fgets(line, sizeof line, fp) != NULL) {
        char *tok = strtok(line, DELIMS);

        while (tok != NULL) {
            size_t len = strlen(tok);

            if (len >= MAX_WORD) {
                len = MAX_WORD - 1;
            }
            for (size_t i = 0; i < len; i++) {
                word[i] = (char)tolower((unsigned char)tok[i]);
            }
            word[len] = '\0';

            if (len > 0) {
                total++;
                unique = add_word(tab, unique, word);
            }
            tok = strtok(NULL, DELIMS);
        }
    }

    if (ferror(fp)) {
        fprintf(stderr, "读取 %s 时发生错误。\n", INPUT_PATH);
        fclose(fp);
        return 1;
    }
    if (fclose(fp) != 0) {
        fprintf(stderr, "关闭 %s 失败。\n", INPUT_PATH);
        return 1;
    }

    qsort(tab, (size_t)unique, sizeof tab[0], cmp_count_desc);

    printf("总词数：%d\n", total);
    printf("不同词：%d\n", unique);
    printf("\nTop %d（次数降序，同次数按字母升序）：\n", TOP_N);
    int show = (unique < TOP_N) ? unique : TOP_N;
    for (int i = 0; i < show; i++) {
        printf("%2d. %-18s %d\n", i + 1, tab[i].word, tab[i].count);
    }
    return 0;
}
`,
        explain: "把「收集」和「排序」分开，逻辑最清楚。相同词频时用 strcmp 决定顺序，输出才稳定、可重复。"
      },
      {
        n: 4,
        title: "停用词与长度过滤",
        tasks: ["准备一个小型停用词表（the、a、is、of 等），比较前先转小写", "只保留长度大于等于 3 的单词，统计被过滤掉的数量", "输出过滤前后总数、不同词数，确认数字能对上"],
        starter: String.raw`/* wordfreq · M4 起步：过滤短词与停用词，再统计 Top N
 * 编译：gcc -std=c99 -Wall -Wextra wf4_start.c -o wf4
 */
#include <ctype.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define INPUT_PATH  "input.txt"
#define MAX_LINE    1024
#define MAX_WORD    64
#define MAX_UNIQUE  2048
#define TOP_N       10
#define MIN_LEN     3

static const char *const DELIMS = " \t\r\n.,;:!?\"'()[]{}<>/@#$%^&*+=~";
static const char *const STOP_WORDS[] = {
    "the", "a", "an", "and", "or", "is", "are", "was", "were",
    "of", "to", "in", "on", "for", "it", "this", "that", "with",
    "as", "at", "by", "be", "from"
};
#define STOP_COUNT (sizeof STOP_WORDS / sizeof STOP_WORDS[0])

typedef struct {
    char word[MAX_WORD];
    int  count;
} WordCount;

static int cmp_count_desc(const void *pa, const void *pb) {
    const WordCount *a = (const WordCount *)pa;
    const WordCount *b = (const WordCount *)pb;

    if (a->count != b->count) {
        return (a->count < b->count) ? 1 : -1;
    }
    return strcmp(a->word, b->word);
}

static size_t normalize(const char *tok, char out[MAX_WORD]) {
    size_t len = strlen(tok);

    if (len >= MAX_WORD) {
        len = MAX_WORD - 1;
    }
    for (size_t i = 0; i < len; i++) {
        out[i] = (char)tolower((unsigned char)tok[i]);
    }
    out[len] = '\0';
    return len;
}

/* TODO 1：遍历 STOP_WORDS，命中返回 1，否则 0 */
static int is_stopword(const char *word) {
    (void)word;
    return 0;
}

static int find_word(const WordCount *tab, int n, const char *word) {
    for (int i = 0; i < n; i++) {
        if (strcmp(tab[i].word, word) == 0) {
            return i;
        }
    }
    return -1;
}

/* TODO 2：找到就 count++；否则追加（strncpy 后补 '\0'），返回新的 n */
static int add_word(WordCount *tab, int n, const char *word) {
    (void)tab;
    (void)n;
    (void)word;
    return n;
}

int main(void) {
    FILE *fp = fopen(INPUT_PATH, "r");
    if (fp == NULL) {
        fprintf(stderr, "打不开 %s：请先在程序目录创建这个文本文件。\n", INPUT_PATH);
        return 1;
    }

    static WordCount tab[MAX_UNIQUE];
    char line[MAX_LINE];
    char word[MAX_WORD];
    int unique = 0;
    int total = 0;
    int kept = 0;
    int short_skipped = 0;
    int stop_skipped = 0;

    while (fgets(line, sizeof line, fp) != NULL) {
        char *tok = strtok(line, DELIMS);

        while (tok != NULL) {
            size_t len = normalize(tok, word);

            if (len > 0) {
                total++;
                /* TODO 3：len < MIN_LEN 记入 short_skipped；
                 *         is_stopword 记入 stop_skipped；
                 *         否则 kept++ 并登记到 tab */
                (void)short_skipped;
                (void)stop_skipped;
                (void)kept;
                unique = add_word(tab, unique, word);
            }
            tok = strtok(NULL, DELIMS);
        }
    }
    fclose(fp);

    qsort(tab, (size_t)unique, sizeof tab[0], cmp_count_desc);

    /* TODO 4：补全报告输出 */
    printf("=== 词频报告：%s ===\n", INPUT_PATH);
    printf("总词数：%d\n", total);
    printf("不同词：%d\n", unique);
    printf("\nTop %d：\n", TOP_N);
    int show = (unique < TOP_N) ? unique : TOP_N;
    for (int i = 0; i < show; i++) {
        printf("%2d. %-18s %d\n", i + 1, tab[i].word, tab[i].count);
    }
    return 0;
}
`,
        hints: ["过滤要发生在合并计数之前，否则 counts 会被污染", "用 strlen 判断长度；UTF-8 下一个汉字通常占 3 字节", "把「总词数、短词、停用词、参与统计」分别计数，便于核对"],
        solution: String.raw`/* wordfreq · M4：在计数基础上过滤停用词与短词，输出最终报告
 * 编译：gcc -std=c99 -Wall -Wextra wf4_sol.c -o wf4
 */
#include <ctype.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define INPUT_PATH  "input.txt"
#define MAX_LINE    1024
#define MAX_WORD    64
#define MAX_UNIQUE  2048
#define TOP_N       10
#define MIN_LEN     3

static const char *const DELIMS = " \t\r\n.,;:!?\"'()[]{}<>/@#$%^&*+=~";

/* 高频虚词：统计词频时通常没有信息量 */
static const char *const STOP_WORDS[] = {
    "the", "a", "an", "and", "or", "is", "are", "was", "were",
    "of", "to", "in", "on", "for", "it", "this", "that", "with",
    "as", "at", "by", "be", "from"
};
#define STOP_COUNT (sizeof STOP_WORDS / sizeof STOP_WORDS[0])

typedef struct {
    char word[MAX_WORD];
    int  count;
} WordCount;

static int cmp_count_desc(const void *pa, const void *pb) {
    const WordCount *a = (const WordCount *)pa;
    const WordCount *b = (const WordCount *)pb;

    if (a->count != b->count) {
        return (a->count < b->count) ? 1 : -1;
    }
    return strcmp(a->word, b->word);
}

/* 把 token 转小写写入 out，返回长度（超长则截断） */
static size_t normalize(const char *tok, char out[MAX_WORD]) {
    size_t len = strlen(tok);

    if (len >= MAX_WORD) {
        len = MAX_WORD - 1;
    }
    for (size_t i = 0; i < len; i++) {
        out[i] = (char)tolower((unsigned char)tok[i]);
    }
    out[len] = '\0';
    return len;
}

static int is_stopword(const char *word) {
    for (size_t i = 0; i < STOP_COUNT; i++) {
        if (strcmp(word, STOP_WORDS[i]) == 0) {
            return 1;
        }
    }
    return 0;
}

static int find_word(const WordCount *tab, int n, const char *word) {
    for (int i = 0; i < n; i++) {
        if (strcmp(tab[i].word, word) == 0) {
            return i;
        }
    }
    return -1;
}

static int add_word(WordCount *tab, int n, const char *word) {
    int idx = find_word(tab, n, word);

    if (idx >= 0) {
        tab[idx].count++;
        return n;
    }
    if (n >= MAX_UNIQUE) {
        return n;
    }
    strncpy(tab[n].word, word, MAX_WORD - 1);
    tab[n].word[MAX_WORD - 1] = '\0';
    tab[n].count = 1;
    return n + 1;
}

int main(void) {
    FILE *fp = fopen(INPUT_PATH, "r");
    if (fp == NULL) {
        fprintf(stderr, "打不开 %s：请先在程序目录创建这个文本文件。\n", INPUT_PATH);
        return 1;
    }

    static WordCount tab[MAX_UNIQUE];
    char line[MAX_LINE];
    char word[MAX_WORD];
    int unique = 0;
    int total = 0;
    int kept = 0;
    int short_skipped = 0;
    int stop_skipped = 0;

    while (fgets(line, sizeof line, fp) != NULL) {
        char *tok = strtok(line, DELIMS);

        while (tok != NULL) {
            size_t len = normalize(tok, word);

            if (len > 0) {
                total++;
                if (len < MIN_LEN) {
                    short_skipped++;
                } else if (is_stopword(word)) {
                    stop_skipped++;
                } else {
                    kept++;
                    unique = add_word(tab, unique, word);
                }
            }
            tok = strtok(NULL, DELIMS);
        }
    }

    if (ferror(fp)) {
        fprintf(stderr, "读取 %s 时发生错误。\n", INPUT_PATH);
        fclose(fp);
        return 1;
    }
    if (fclose(fp) != 0) {
        fprintf(stderr, "关闭 %s 失败。\n", INPUT_PATH);
        return 1;
    }

    qsort(tab, (size_t)unique, sizeof tab[0], cmp_count_desc);

    printf("=== 词频报告：%s ===\n", INPUT_PATH);
    printf("总词数      ：%d\n", total);
    printf("过短丢弃    ：%d（长度 < %d）\n", short_skipped, MIN_LEN);
    printf("停用词丢弃  ：%d\n", stop_skipped);
    printf("参与统计    ：%d\n", kept);
    printf("不同词      ：%d\n", unique);

    printf("\nTop %d：\n", TOP_N);
    int show = (unique < TOP_N) ? unique : TOP_N;
    for (int i = 0; i < show; i++) {
        printf("%2d. %-18s %d\n", i + 1, tab[i].word, tab[i].count);
    }
    if (show == 0) {
        printf("（没有满足条件的词）\n");
    }
    return 0;
}
`,
        explain: "停用词和长度过滤会显著改变排名，先明确规则再实现。参考实现把过滤放在收集阶段，并保留各项计数，方便验证没有漏词或重复计数。"
      }
    ],
    extension: ["支持从标准输入读取（cat file | ./wordfreq），把文件名参数化", "用哈希表替代线性合并，降低大文件下的 O(n²) 开销", "输出 JSON 或 CSV，便于交给其他脚本继续分析"],
    solutionNote: "参考实现用固定上限的数组换取简单性：MAX_WORDS 4096、MAX_WORD 64；真实工具应改为动态数组或哈希表。"
  },
  {
    id: "dynarray",
    title: "动态数组与字符串",
    en: "Dynamic Array & String",
    tagline: "亲手实现会扩容的数组和字符串",
    level: "进阶",
    minutes: 180,
    chapters: ["ch04", "ch05", "ch06"],
    goals: ["实现 IntArray 的 init/push/resize/free，容量按 2 倍增长", "用临时指针接收 realloc，失败时保留原内存并返回错误", "实现 String 的 reserve/set/append，维护 len 与 cap 的不变式", "用人工检查或 ASan 确认每次 malloc 都有对应的 free"],
    intro: "手写一个可增长的 int 数组和一个简化 String，练习 malloc/realloc/free 的所有权与失败路径。最终用它们解析一行 CSV 数字，并生成统计报告。",
    milestones: [
      {
        n: 1,
        title: "可增长的 int 数组",
        tasks: ["定义 IntArray { int *data; size_t size; size_t cap; }", "实现 ia_reserve：容量不够时按 4、8、16… 翻倍，用 realloc 的临时指针接收", "实现 ia_push 与 ia_free；free 后把指针置 NULL、size/cap 清零"],
        starter: String.raw`/* dynarray · M1 起步：实现容量翻倍与 push
 * 编译：gcc -std=c99 -Wall -Wextra da1_start.c -o da1
 */
#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int   *data;
    size_t size;
    size_t cap;
} IntArray;

/* TODO 1：need <= cap 直接返回 1；否则按 4、8、16… 翻倍，
 *         用 realloc 的临时指针接收结果，失败时返回 0 且不改 a。 */
static int ia_reserve(IntArray *a, size_t need) {
    (void)a;
    (void)need;
    return 0;
}

static int ia_init(IntArray *a, size_t cap) {
    if (a == NULL) {
        return 0;
    }
    a->data = NULL;
    a->size = 0;
    a->cap = 0;
    if (cap == 0) {
        return 1;               /* 容量 0 合法，push 时再分配 */
    }
    return ia_reserve(a, cap);
}

/* TODO 2：空间不够先 reserve；写入后 size++；失败返回 0 */
static int ia_push(IntArray *a, int value) {
    (void)a;
    (void)value;
    return 0;
}

static void ia_free(IntArray *a) {
    if (a == NULL) {
        return;
    }
    free(a->data);
    a->data = NULL;
    a->size = 0;
    a->cap = 0;
}

int main(void) {
    IntArray a;
    if (!ia_init(&a, 0)) {
        fprintf(stderr, "初始化失败：TODO 1 还没完成。\n");
        return 1;
    }

    int ok = 1;
    for (int i = 0; i < 10 && ok; i++) {
        ok = ia_push(&a, i * i);
    }

    printf("size = %zu, cap = %zu\n", a.size, a.cap);
    printf("插入%s\n", ok ? "成功" : "失败（TODO 2 还没完成）");

    ia_free(&a);
    return 0;
}
`,
        hints: ["realloc 失败返回 NULL，原内存仍然有效，不能直接赋给 a->data", "翻倍前检查 cap > SIZE_MAX / 2，避免溢出", "size 表示已用元素数，cap 表示已分配容量，两者不要混"],
        solution: String.raw`/* dynarray · M1：可增长 int 数组的 init / push / free
 * 编译：gcc -std=c99 -Wall -Wextra da1_sol.c -o da1
 */
#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int   *data;
    size_t size;   /* 已用元素个数 */
    size_t cap;    /* 已分配容量 */
} IntArray;

/* 保证容量至少为 need；成功返回 1，失败返回 0 且数组保持原状 */
static int ia_reserve(IntArray *a, size_t need) {
    if (a == NULL) {
        return 0;
    }
    if (need <= a->cap) {
        return 1;
    }

    size_t newcap = (a->cap > 0) ? a->cap : 4;
    while (newcap < need) {
        if (newcap > ((size_t)-1) / 2) {   /* 翻倍会溢出，直接取 need */
            newcap = need;
            break;
        }
        newcap *= 2;
    }
    if (newcap > ((size_t)-1) / sizeof *a->data) {
        return 0;                          /* 字节数溢出 */
    }

    int *tmp = (int *)realloc(a->data, newcap * sizeof *a->data);
    if (tmp == NULL) {
        return 0;                          /* 原指针仍然有效 */
    }
    a->data = tmp;
    a->cap = newcap;
    return 1;
}

static int ia_init(IntArray *a, size_t cap) {
    if (a == NULL) {
        return 0;
    }
    a->data = NULL;
    a->size = 0;
    a->cap = 0;
    return ia_reserve(a, cap);
}

static int ia_push(IntArray *a, int value) {
    if (a == NULL) {
        return 0;
    }
    if (a->size == a->cap && !ia_reserve(a, a->size + 1)) {
        return 0;
    }
    a->data[a->size] = value;
    a->size++;
    return 1;
}

static void ia_free(IntArray *a) {
    if (a == NULL) {
        return;
    }
    free(a->data);
    a->data = NULL;
    a->size = 0;
    a->cap = 0;
}

int main(void) {
    IntArray a;
    if (!ia_init(&a, 0)) {
        fprintf(stderr, "初始化失败：内存不足。\n");
        return 1;
    }

    for (int i = 0; i < 10; i++) {
        if (!ia_push(&a, i * i)) {
            fprintf(stderr, "第 %d 个元素插入失败。\n", i);
            ia_free(&a);
            return 1;
        }
    }

    printf("size = %zu, cap = %zu\n", a.size, a.cap);
    for (size_t i = 0; i < a.size; i++) {
        printf("%s%d", (i == 0) ? "" : " ", a.data[i]);
    }
    printf("\n");

    ia_free(&a);
    printf("释放后：data=%s, size=%zu, cap=%zu\n",
           (a.data == NULL) ? "NULL" : "非 NULL", a.size, a.cap);
    return 0;
}
`,
        explain: "realloc 的经典错误是 a->data = realloc(a->data, ...)，失败后原指针丢失。参考实现先用 tmp 接收，成功后再赋值。容量从 0 开始时，第一次 push 要能自动分配。"
      },
      {
        n: 2,
        title: "resize、访问与求和",
        tasks: ["实现 ia_resize：扩大时把新增元素置 0，缩小时只改 size", "实现 ia_get / ia_pop，下标越界或数组为空时返回失败", "实现 ia_sum，用 long long 累加，避免 int 溢出"],
        starter: String.raw`/* dynarray · M2 起步：给已有数组加上 resize / get / pop / sum
 * 编译：gcc -std=c99 -Wall -Wextra da2_start.c -o da2
 */
#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int   *data;
    size_t size;
    size_t cap;
} IntArray;

static int ia_reserve(IntArray *a, size_t need) {
    if (a == NULL) {
        return 0;
    }
    if (need <= a->cap) {
        return 1;
    }
    size_t newcap = (a->cap > 0) ? a->cap : 4;
    while (newcap < need) {
        if (newcap > ((size_t)-1) / 2) {
            newcap = need;
            break;
        }
        newcap *= 2;
    }
    if (newcap > ((size_t)-1) / sizeof *a->data) {
        return 0;
    }
    int *tmp = (int *)realloc(a->data, newcap * sizeof *a->data);
    if (tmp == NULL) {
        return 0;
    }
    a->data = tmp;
    a->cap = newcap;
    return 1;
}

static int ia_init(IntArray *a, size_t cap) {
    if (a == NULL) {
        return 0;
    }
    a->data = NULL;
    a->size = 0;
    a->cap = 0;
    return ia_reserve(a, cap);
}

static int ia_push(IntArray *a, int value) {
    if (a == NULL) {
        return 0;
    }
    if (a->size == a->cap && !ia_reserve(a, a->size + 1)) {
        return 0;
    }
    a->data[a->size] = value;
    a->size++;
    return 1;
}

/* TODO 1：newsize > size 时先 reserve，再用 fill 填满新增位置；
 *         失败返回 0 且不改 size；成功更新 size 返回 1。 */
static int ia_resize(IntArray *a, size_t newsize, int fill) {
    (void)a;
    (void)newsize;
    (void)fill;
    return 0;
}

/* TODO 2：idx 越界或指针为空返回 0，否则通过 out 带回元素并返回 1 */
static int ia_get(const IntArray *a, size_t idx, int *out) {
    (void)a;
    (void)idx;
    (void)out;
    return 0;
}

/* TODO 3：空数组返回 0；否则 size--，通过 out 带回被移除的元素 */
static int ia_pop(IntArray *a, int *out) {
    (void)a;
    (void)out;
    return 0;
}

/* TODO 4：用 long long 累加，避免 int 溢出；结果写入 *out */
static int ia_sum(const IntArray *a, long long *out) {
    (void)a;
    (void)out;
    return 0;
}

static void ia_print(const char *label, const IntArray *a) {
    printf("%s: [", label);
    for (size_t i = 0; i < a->size; i++) {
        printf("%s%d", (i == 0) ? "" : ", ", a->data[i]);
    }
    printf("]  size=%zu cap=%zu\n", a->size, a->cap);
}

static void ia_free(IntArray *a) {
    if (a == NULL) {
        return;
    }
    free(a->data);
    a->data = NULL;
    a->size = 0;
    a->cap = 0;
}

int main(void) {
    IntArray a;
    if (!ia_init(&a, 2)) {
        fprintf(stderr, "初始化失败。\n");
        return 1;
    }

    ia_push(&a, 1);
    ia_push(&a, 2);
    ia_print("初始", &a);

    if (!ia_resize(&a, 6, -1)) {
        printf("扩容返回 0（TODO 1 未完成，或内存不足）。\n");
    } else {
        ia_print("扩到 6", &a);
    }

    int v = 0;
    if (ia_get(&a, 2, &v)) {
        printf("a[2] = %d\n", v);
    } else {
        printf("a[2] 读取失败（TODO 2 未完成）。\n");
    }

    if (ia_pop(&a, &v)) {
        printf("pop = %d\n", v);
    } else {
        printf("pop 失败（TODO 3 未完成，或数组为空）。\n");
    }

    long long sum = 0;
    if (ia_sum(&a, &sum)) {
        printf("sum = %lld\n", sum);
    } else {
        printf("求和失败（TODO 4 未完成）。\n");
    }

    ia_free(&a);
    return 0;
}
`,
        hints: ["resize 可能需要 reserve，先保证容量再改 size", "pop 空数组是错误，不要返回未初始化的值", "sum 的返回类型用 long long，printf 用 %lld"],
        solution: String.raw`/* dynarray · M2：扩容/缩容、越界检查、弹出与求和
 * 编译：gcc -std=c99 -Wall -Wextra da2_sol.c -o da2
 */
#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int   *data;
    size_t size;
    size_t cap;
} IntArray;

static int ia_reserve(IntArray *a, size_t need) {
    if (a == NULL) {
        return 0;
    }
    if (need <= a->cap) {
        return 1;
    }

    size_t newcap = (a->cap > 0) ? a->cap : 4;
    while (newcap < need) {
        if (newcap > ((size_t)-1) / 2) {
            newcap = need;
            break;
        }
        newcap *= 2;
    }
    if (newcap > ((size_t)-1) / sizeof *a->data) {
        return 0;
    }

    int *tmp = (int *)realloc(a->data, newcap * sizeof *a->data);
    if (tmp == NULL) {
        return 0;
    }
    a->data = tmp;
    a->cap = newcap;
    return 1;
}

static int ia_init(IntArray *a, size_t cap) {
    if (a == NULL) {
        return 0;
    }
    a->data = NULL;
    a->size = 0;
    a->cap = 0;
    return ia_reserve(a, cap);
}

static int ia_push(IntArray *a, int value) {
    if (a == NULL) {
        return 0;
    }
    if (a->size == a->cap && !ia_reserve(a, a->size + 1)) {
        return 0;
    }
    a->data[a->size] = value;
    a->size++;
    return 1;
}

/* 调整 size：变大用 fill 填充新位置，变小直接截断；失败时原数组不变 */
static int ia_resize(IntArray *a, size_t newsize, int fill) {
    if (a == NULL) {
        return 0;
    }
    if (newsize > a->size) {
        if (!ia_reserve(a, newsize)) {
            return 0;
        }
        for (size_t i = a->size; i < newsize; i++) {
            a->data[i] = fill;
        }
    }
    a->size = newsize;
    return 1;
}

static int ia_get(const IntArray *a, size_t idx, int *out) {
    if (a == NULL || out == NULL || idx >= a->size) {
        return 0;
    }
    *out = a->data[idx];
    return 1;
}

static int ia_pop(IntArray *a, int *out) {
    if (a == NULL || out == NULL || a->size == 0) {
        return 0;
    }
    a->size--;
    *out = a->data[a->size];
    return 1;
}

static int ia_sum(const IntArray *a, long long *out) {
    long long total = 0;

    if (a == NULL || out == NULL) {
        return 0;
    }
    for (size_t i = 0; i < a->size; i++) {
        total += a->data[i];
    }
    *out = total;
    return 1;
}

static void ia_print(const char *label, const IntArray *a) {
    printf("%s: [", label);
    for (size_t i = 0; i < a->size; i++) {
        printf("%s%d", (i == 0) ? "" : ", ", a->data[i]);
    }
    printf("]  size=%zu cap=%zu\n", a->size, a->cap);
}

static void ia_free(IntArray *a) {
    if (a == NULL) {
        return;
    }
    free(a->data);
    a->data = NULL;
    a->size = 0;
    a->cap = 0;
}

int main(void) {
    IntArray a;
    if (!ia_init(&a, 2)) {
        fprintf(stderr, "初始化失败。\n");
        return 1;
    }

    ia_push(&a, 1);
    ia_push(&a, 2);
    ia_print("初始", &a);

    if (!ia_resize(&a, 6, -1)) {
        fprintf(stderr, "扩容失败，数组保持不变。\n");
        ia_free(&a);
        return 1;
    }
    ia_print("扩到 6", &a);

    int v = 0;
    if (ia_get(&a, 2, &v)) {
        printf("a[2] = %d\n", v);
    }
    if (!ia_get(&a, 99, &v)) {
        printf("a[99] 越界，读取被拒绝。\n");
    }

    if (ia_pop(&a, &v)) {
        printf("pop = %d\n", v);
    }
    ia_print("pop 后", &a);

    if (!ia_resize(&a, 3, 0)) {
        fprintf(stderr, "缩容失败。\n");
        ia_free(&a);
        return 1;
    }
    ia_print("缩到 3", &a);

    long long sum = 0;
    ia_sum(&a, &sum);
    printf("sum = %lld\n", sum);

    ia_free(&a);
    return 0;
}
`,
        explain: "resize 扩大时把新元素清零，避免后续读到未初始化内存。get/pop 的边界检查是 API 的一部分，调用者不应该靠「我知道不会越界」来省略。"
      },
      {
        n: 3,
        title: "简化 String",
        tasks: ["定义 String { char *data; size_t len; size_t cap; }", "实现 str_create / str_reserve / str_set / str_append / str_append_char / str_free", "保证 data 始终以终止符结尾，len 不包含结尾的终止符"],
        starter: String.raw`/* dynarray · M3 起步：实现 String 的 reserve / set / append
 * 编译：gcc -std=c99 -Wall -Wextra da3_start.c -o da3
 */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
    char  *data;
    size_t len;
    size_t cap;
} String;

/* TODO 1：need <= cap 直接成功；否则从 16 开始翻倍，
 *         用临时指针接 realloc 结果，失败返回 0 且不改 s。 */
static int str_reserve(String *s, size_t need) {
    (void)s;
    (void)need;
    return 0;
}

/* TODO 2：reserve(len+1)，memcpy 连 '\0' 一起复制，更新 len */
static int str_set(String *s, const char *text) {
    (void)s;
    (void)text;
    return 0;
}

static int str_init(String *s, const char *text) {
    if (s == NULL) {
        return 0;
    }
    s->data = NULL;
    s->len = 0;
    s->cap = 0;
    return str_set(s, text);
}

/* TODO 3：先 reserve(len + add + 1)，再把 text（含 '\0'）接到末尾 */
static int str_append(String *s, const char *text) {
    (void)s;
    (void)text;
    return 0;
}

/* TODO 4：reserve(len + 2)，写入字符并补新的 '\0' */
static int str_append_char(String *s, char c) {
    (void)s;
    (void)c;
    return 0;
}

static void str_free(String *s) {
    if (s == NULL) {
        return;
    }
    free(s->data);
    s->data = NULL;
    s->len = 0;
    s->cap = 0;
}

int main(void) {
    String s;

    if (!str_init(&s, "C")) {
        printf("初始化失败：TODO 1/2 还没完成。\n");
        return 0;
    }

    if (!str_append(&s, "99") || !str_append_char(&s, '!')) {
        printf("追加失败：TODO 3/4 还没完成。\n");
        str_free(&s);
        return 0;
    }

    printf("内容：%s\n", s.data);
    printf("len = %zu, cap = %zu\n", s.len, s.cap);

    str_free(&s);
    return 0;
}
`,
        hints: ["reserve 只增不减；需要的最小容量是 len + add + 1", "str_set 要先 reserve 再 memcpy，不要忘了结尾的终止符", "append_char 可以复用 append，也可以直接写"],
        solution: String.raw`/* dynarray · M3：可增长字符串 String 的创建、追加与释放
 * 编译：gcc -std=c99 -Wall -Wextra da3_sol.c -o da3
 */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
    char  *data;   /* 始终以 '\0' 结尾 */
    size_t len;    /* 不含 '\0' 的字节数 */
    size_t cap;    /* 缓冲区字节数，含 '\0' */
} String;

/* 保证 cap >= need（need 把结尾 '\0' 算在内） */
static int str_reserve(String *s, size_t need) {
    if (s == NULL) {
        return 0;
    }
    if (need <= s->cap) {
        return 1;
    }

    size_t newcap = (s->cap > 0) ? s->cap : 16;
    while (newcap < need) {
        if (newcap > ((size_t)-1) / 2) {
            newcap = need;
            break;
        }
        newcap *= 2;
    }

    char *tmp = (char *)realloc(s->data, newcap);
    if (tmp == NULL) {
        return 0;
    }
    s->data = tmp;
    s->cap = newcap;
    return 1;
}

static int str_set(String *s, const char *text) {
    size_t len;

    if (s == NULL || text == NULL) {
        return 0;
    }
    len = strlen(text);
    if (!str_reserve(s, len + 1)) {
        return 0;
    }
    memcpy(s->data, text, len + 1);
    s->len = len;
    return 1;
}

static int str_init(String *s, const char *text) {
    if (s == NULL) {
        return 0;
    }
    s->data = NULL;
    s->len = 0;
    s->cap = 0;
    return str_set(s, text);
}

/* 注意：text 不能指向 s->data 本身（realloc 后旧地址可能失效） */
static int str_append(String *s, const char *text) {
    size_t add;
    size_t need;

    if (s == NULL || text == NULL) {
        return 0;
    }
    add = strlen(text);
    if (add > (size_t)-1 - s->len - 1) {
        return 0;
    }
    need = s->len + add + 1;
    if (!str_reserve(s, need)) {
        return 0;
    }
    memcpy(s->data + s->len, text, add + 1);
    s->len += add;
    return 1;
}

static int str_append_char(String *s, char c) {
    if (s == NULL) {
        return 0;
    }
    if (!str_reserve(s, s->len + 2)) {
        return 0;
    }
    s->data[s->len] = c;
    s->len++;
    s->data[s->len] = '\0';
    return 1;
}

static void str_free(String *s) {
    if (s == NULL) {
        return;
    }
    free(s->data);
    s->data = NULL;
    s->len = 0;
    s->cap = 0;
}

int main(void) {
    String s;

    if (!str_init(&s, "C")) {
        fprintf(stderr, "字符串初始化失败。\n");
        return 1;
    }
    if (!str_append(&s, "99") ||
        !str_append(&s, " 动态字符串") ||
        !str_append_char(&s, '!')) {
        fprintf(stderr, "追加失败。\n");
        str_free(&s);
        return 1;
    }

    printf("内容：%s\n", s.data);
    printf("len = %zu 字节, cap = %zu 字节\n", s.len, s.cap);
    printf("strlen = %zu（与 len 一致）\n", strlen(s.data));

    str_free(&s);
    printf("释放后：data=%s, len=%zu, cap=%zu\n",
           (s.data == NULL) ? "NULL" : "非 NULL", s.len, s.cap);
    return 0;
}
`,
        explain: "String 的核心不变式是 cap >= len + 1 且 data[len] == 0。每次修改前先 reserve，修改后手动收尾，就不会出现「差一个字节」的越界。"
      },
      {
        n: 4,
        title: "CSV 解析与报告",
        tasks: ["用 fgets 读一行 CSV，如 \"3,1,4,1,5,9,2,6\"", "用 strtok 逐个 strtol 成 int，push 进 IntArray；跳过非法字段并计数", "用 String 拼接报告：元素个数、总和、最小值、最大值，最后释放所有内存"],
        starter: String.raw`/* dynarray · M4 起步：CSV → IntArray → String 报告
 * 编译：gcc -std=c99 -Wall -Wextra da4_start.c -o da4
 */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
    int   *data;
    size_t size;
    size_t cap;
} IntArray;

typedef struct {
    char  *data;
    size_t len;
    size_t cap;
} String;

static int ia_reserve(IntArray *a, size_t need) {
    if (a == NULL) {
        return 0;
    }
    if (need <= a->cap) {
        return 1;
    }
    size_t newcap = (a->cap > 0) ? a->cap : 4;
    while (newcap < need) {
        if (newcap > ((size_t)-1) / 2) {
            newcap = need;
            break;
        }
        newcap *= 2;
    }
    if (newcap > ((size_t)-1) / sizeof *a->data) {
        return 0;
    }
    int *tmp = (int *)realloc(a->data, newcap * sizeof *a->data);
    if (tmp == NULL) {
        return 0;
    }
    a->data = tmp;
    a->cap = newcap;
    return 1;
}

static int ia_init(IntArray *a, size_t cap) {
    if (a == NULL) {
        return 0;
    }
    a->data = NULL;
    a->size = 0;
    a->cap = 0;
    return ia_reserve(a, cap);
}

static int ia_push(IntArray *a, int value) {
    if (a == NULL) {
        return 0;
    }
    if (a->size == a->cap && !ia_reserve(a, a->size + 1)) {
        return 0;
    }
    a->data[a->size] = value;
    a->size++;
    return 1;
}

static int ia_sum(const IntArray *a, long long *out) {
    long long total = 0;

    if (a == NULL || out == NULL) {
        return 0;
    }
    for (size_t i = 0; i < a->size; i++) {
        total += a->data[i];
    }
    *out = total;
    return 1;
}

static void ia_free(IntArray *a) {
    if (a == NULL) {
        return;
    }
    free(a->data);
    a->data = NULL;
    a->size = 0;
    a->cap = 0;
}

static int str_reserve(String *s, size_t need) {
    if (s == NULL) {
        return 0;
    }
    if (need <= s->cap) {
        return 1;
    }
    size_t newcap = (s->cap > 0) ? s->cap : 16;
    while (newcap < need) {
        if (newcap > ((size_t)-1) / 2) {
            newcap = need;
            break;
        }
        newcap *= 2;
    }
    char *tmp = (char *)realloc(s->data, newcap);
    if (tmp == NULL) {
        return 0;
    }
    s->data = tmp;
    s->cap = newcap;
    return 1;
}

static int str_init(String *s, const char *text) {
    size_t len;

    if (s == NULL || text == NULL) {
        return 0;
    }
    s->data = NULL;
    s->len = 0;
    s->cap = 0;
    len = strlen(text);
    if (!str_reserve(s, len + 1)) {
        return 0;
    }
    memcpy(s->data, text, len + 1);
    s->len = len;
    return 1;
}

static int str_append(String *s, const char *text) {
    size_t add;
    size_t need;

    if (s == NULL || text == NULL) {
        return 0;
    }
    add = strlen(text);
    if (s->len > (size_t)-1 - add - 1) {
        return 0;
    }
    need = s->len + add + 1;
    if (!str_reserve(s, need)) {
        return 0;
    }
    memcpy(s->data + s->len, text, add + 1);
    s->len += add;
    return 1;
}

static void str_free(String *s) {
    if (s == NULL) {
        return;
    }
    free(s->data);
    s->data = NULL;
    s->len = 0;
    s->cap = 0;
}

/* TODO 1：循环跳过空格；用 strtol 读整数并 ia_push；
 *         逗号继续，字符串结束退出；其他情况返回 0。 */
static int parse_csv(const char *csv, IntArray *a) {
    (void)csv;
    (void)a;
    return 0;
}

/* TODO 2：求 sum/min/max，用 snprintf 写入缓冲区，再 str_append 到 out */
static int build_report(const IntArray *a, String *out) {
    (void)a;
    (void)out;
    return 0;
}

int main(void) {
    const char *csv = "3, 1, 4, 1, 5, 9, 2, 6";
    IntArray nums;
    String report;

    if (!ia_init(&nums, 0)) {
        fprintf(stderr, "数组初始化失败。\n");
        return 1;
    }
    if (!parse_csv(csv, &nums)) {
        printf("解析失败：TODO 1 还没完成（或 CSV 非法）。\n");
        ia_free(&nums);
        return 0;
    }
    if (!str_init(&report, "CSV: ")) {
        fprintf(stderr, "报告初始化失败。\n");
        ia_free(&nums);
        return 1;
    }
    if (!str_append(&report, csv) || !str_append(&report, "\n") ||
        !build_report(&nums, &report)) {
        printf("报告拼接失败：TODO 2 还没完成。\n");
        str_free(&report);
        ia_free(&nums);
        return 0;
    }

    printf("%s", report.data);
    str_free(&report);
    ia_free(&nums);
    return 0;
}
`,
        hints: ["strtok 会修改缓冲区，想保留原行就先复制一份", "strtol 的 endptr 可以判断字段是否真的解析成功", "任何一步失败都要跳到清理标签，避免泄漏"],
        solution: String.raw`/* dynarray · M4：把 CSV 整数解析进 IntArray，再用 String 生成报告
 * 编译：gcc -std=c99 -Wall -Wextra da4_sol.c -o da4
 */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
    int   *data;
    size_t size;
    size_t cap;
} IntArray;

typedef struct {
    char  *data;
    size_t len;
    size_t cap;
} String;

static int ia_reserve(IntArray *a, size_t need) {
    if (a == NULL) {
        return 0;
    }
    if (need <= a->cap) {
        return 1;
    }
    size_t newcap = (a->cap > 0) ? a->cap : 4;
    while (newcap < need) {
        if (newcap > ((size_t)-1) / 2) {
            newcap = need;
            break;
        }
        newcap *= 2;
    }
    if (newcap > ((size_t)-1) / sizeof *a->data) {
        return 0;
    }
    int *tmp = (int *)realloc(a->data, newcap * sizeof *a->data);
    if (tmp == NULL) {
        return 0;
    }
    a->data = tmp;
    a->cap = newcap;
    return 1;
}

static int ia_init(IntArray *a, size_t cap) {
    if (a == NULL) {
        return 0;
    }
    a->data = NULL;
    a->size = 0;
    a->cap = 0;
    return ia_reserve(a, cap);
}

static int ia_push(IntArray *a, int value) {
    if (a == NULL) {
        return 0;
    }
    if (a->size == a->cap && !ia_reserve(a, a->size + 1)) {
        return 0;
    }
    a->data[a->size] = value;
    a->size++;
    return 1;
}

static int ia_sum(const IntArray *a, long long *out) {
    long long total = 0;

    if (a == NULL || out == NULL) {
        return 0;
    }
    for (size_t i = 0; i < a->size; i++) {
        total += a->data[i];
    }
    *out = total;
    return 1;
}

static void ia_free(IntArray *a) {
    if (a == NULL) {
        return;
    }
    free(a->data);
    a->data = NULL;
    a->size = 0;
    a->cap = 0;
}

static int str_reserve(String *s, size_t need) {
    if (s == NULL) {
        return 0;
    }
    if (need <= s->cap) {
        return 1;
    }
    size_t newcap = (s->cap > 0) ? s->cap : 16;
    while (newcap < need) {
        if (newcap > ((size_t)-1) / 2) {
            newcap = need;
            break;
        }
        newcap *= 2;
    }
    char *tmp = (char *)realloc(s->data, newcap);
    if (tmp == NULL) {
        return 0;
    }
    s->data = tmp;
    s->cap = newcap;
    return 1;
}

static int str_init(String *s, const char *text) {
    size_t len;

    if (s == NULL || text == NULL) {
        return 0;
    }
    s->data = NULL;
    s->len = 0;
    s->cap = 0;
    len = strlen(text);
    if (!str_reserve(s, len + 1)) {
        return 0;
    }
    memcpy(s->data, text, len + 1);
    s->len = len;
    return 1;
}

static int str_append(String *s, const char *text) {
    size_t add;
    size_t need;

    if (s == NULL || text == NULL) {
        return 0;
    }
    add = strlen(text);
    if (s->len > (size_t)-1 - add - 1) {
        return 0;
    }
    need = s->len + add + 1;
    if (!str_reserve(s, need)) {
        return 0;
    }
    memcpy(s->data + s->len, text, add + 1);
    s->len += add;
    return 1;
}

static void str_free(String *s) {
    if (s == NULL) {
        return;
    }
    free(s->data);
    s->data = NULL;
    s->len = 0;
    s->cap = 0;
}

/* 解析 "3, 1, 4" 这类十进制整数列表；允许空格与末尾逗号，其他字符报错 */
static int parse_csv(const char *csv, IntArray *a) {
    const char *p = csv;

    if (csv == NULL || a == NULL) {
        return 0;
    }
    for (;;) {
        while (*p == ' ' || *p == '\t') {
            p++;
        }
        if (*p == '\0') {
            break;
        }
        if (*p == ',') {
            return 0;                  /* 空字段 */
        }

        char *end = NULL;
        long v = strtol(p, &end, 10);
        if (end == p) {
            return 0;
        }
        /* long 在 Windows 是 32 位、Linux 是 64 位，这里统一按 int 范围检查 */
        if (v < -2147483647L - 1L || v > 2147483647L) {
            return 0;
        }
        if (!ia_push(a, (int)v)) {
            return 0;
        }

        p = end;
        while (*p == ' ' || *p == '\t') {
            p++;
        }
        if (*p == ',') {
            p++;
            continue;
        }
        if (*p == '\0') {
            break;
        }
        return 0;                      /* 数字后面跟着非法字符 */
    }
    return 1;
}

static int build_report(const IntArray *a, String *out) {
    char buf[160];
    long long sum = 0;

    if (a == NULL || out == NULL || !ia_sum(a, &sum)) {
        return 0;
    }

    if (a->size == 0) {
        snprintf(buf, sizeof buf, "元素个数：0\n总和：0\n最小/最大：无\n");
        return str_append(out, buf);
    }

    int min = a->data[0];
    int max = a->data[0];
    for (size_t i = 1; i < a->size; i++) {
        if (a->data[i] < min) {
            min = a->data[i];
        }
        if (a->data[i] > max) {
            max = a->data[i];
        }
    }

    snprintf(buf, sizeof buf,
             "元素个数：%zu\n总和：%lld\n最小：%d\n最大：%d\n",
             a->size, sum, min, max);
    return str_append(out, buf);
}

int main(void) {
    const char *csv = "3, 1, 4, 1, 5, 9, 2, 6";
    IntArray nums;
    String report;

    if (!ia_init(&nums, 0)) {
        fprintf(stderr, "数组初始化失败。\n");
        return 1;
    }
    if (!parse_csv(csv, &nums)) {
        fprintf(stderr, "CSV 解析失败：%s\n", csv);
        ia_free(&nums);
        return 1;
    }
    if (!str_init(&report, "CSV: ")) {
        fprintf(stderr, "报告初始化失败。\n");
        ia_free(&nums);
        return 1;
    }
    if (!str_append(&report, csv) || !str_append(&report, "\n") ||
        !build_report(&nums, &report)) {
        fprintf(stderr, "报告拼接失败。\n");
        str_free(&report);
        ia_free(&nums);
        return 1;
    }

    printf("解析后的数组：");
    for (size_t i = 0; i < nums.size; i++) {
        printf("%s%d", (i == 0) ? "" : ", ", nums.data[i]);
    }
    printf("\n\n%s", report.data);
    printf("(报告共 %zu 字节)\n", report.len);

    str_free(&report);
    ia_free(&nums);
    return 0;
}
`,
        explain: "这是前三个里程碑的合练：动态数组负责收集，String 负责输出，错误路径负责释放。参考实现用 goto cleanup 统一收尾，是 C 里常见的写法。"
      }
    ],
    extension: ["把 IntArray 改成 void * + elem_size 的泛型版本", "增加 ia_map / ia_filter，用函数指针传入操作", "实现 shrink_to_fit，并在缩容失败时保持原数组可用"],
    solutionNote: "参考实现把容量增长封装在 reserve 中，push/append 只关心 size/len；所有失败路径都保证原对象仍可 free。"
  },
  {
    id: "contacts",
    title: "通讯录文件存储",
    en: "Contacts on Disk",
    tagline: "把结构体数组安全地存进文件",
    level: "综合",
    minutes: 210,
    chapters: ["ch04", "ch05", "ch06"],
    goals: ["定义 Contact 结构体，用 strncpy 加手动补终止符处理字符串边界", "实现新增/查找/删除，删除时用 memmove 保持数组连续", "用 fread/fwrite 持久化，校验魔数、条数与每条记录", "把以上功能整合进 fgets 菜单，退出或 EOF 时保存"],
    intro: "做一个命令行通讯录：启动时从 contacts.dat 读取，支持新增、查找、删除、列出，退出时写回。文件采用「魔数 + 条数 + 定长记录」的二进制格式。",
    milestones: [
      {
        n: 1,
        title: "结构体与内存通讯录",
        tasks: ["定义 Contact { name[32], phone[16], group[16] } 与 MAX_CONTACTS", "实现 copy_field：strncpy 最多复制 cap-1 字节，再手动补终止符", "实现 add_contact（返回新条数或 -1）与 list_contacts"],
        starter: String.raw`/* contacts · M1 起步：补全 copy_field 与 add_contact
 * 编译：gcc -std=c99 -Wall -Wextra ct1_start.c -o ct1
 */
#include <stdio.h>
#include <string.h>

#define MAX_CONTACTS 100
#define NAME_LEN     32
#define PHONE_LEN    16
#define GROUP_LEN    16

typedef struct {
    char name[NAME_LEN];
    char phone[PHONE_LEN];
    char group[GROUP_LEN];
} Contact;

/* TODO 1：最多复制 cap-1 个字符，并保证 dst[cap-1] == '\0' */
static void copy_field(char *dst, size_t cap, const char *src) {
    (void)dst;
    (void)cap;
    (void)src;
}

/* TODO 2：检查 count 上限与 name 非空；把三个字段复制进 book[count]，
 *         成功返回 count + 1，失败返回 -1。 */
static int add_contact(Contact *book, int count, const char *name,
                       const char *phone, const char *group) {
    (void)book;
    (void)name;
    (void)phone;
    (void)group;
    return count;
}

static void list_contacts(const Contact *book, int count) {
    if (count == 0) {
        printf("（通讯录为空）\n");
        return;
    }
    printf("共 %d 条：\n", count);
    for (int i = 0; i < count; i++) {
        printf("%2d. %s | %s | %s\n",
               i + 1, book[i].name, book[i].phone, book[i].group);
    }
}

int main(void) {
    Contact book[MAX_CONTACTS];
    int count = 0;

    count = add_contact(book, count, "Li Lei", "13800000001", "同学");
    if (count < 0) {
        fprintf(stderr, "添加失败（TODO 未完成或参数非法）。\n");
        return 1;
    }
    count = add_contact(book, count, "Han Meimei", "13800000002", "同学");
    if (count < 0) {
        fprintf(stderr, "添加失败（TODO 未完成或参数非法）。\n");
        return 1;
    }

    printf("通讯录共 %d 条（TODO 未完成时为 0）：\n\n", count);
    list_contacts(book, count);
    return 0;
}
`,
        hints: ["strncpy(dst, src, n) 在 src 长度大于等于 n 时不会补终止符", "结构体数组传参要连同 count 一起传，或者用指针加长度", "表满时返回错误，不要写 book[MAX_CONTACTS]"],
        solution: String.raw`/* contacts · M1：定义 Contact，完成内存中的新增与列出
 * 编译：gcc -std=c99 -Wall -Wextra ct1_sol.c -o ct1
 */
#include <stdio.h>
#include <string.h>

#define MAX_CONTACTS 100
#define NAME_LEN     32
#define PHONE_LEN    16
#define GROUP_LEN    16

typedef struct {
    char name[NAME_LEN];
    char phone[PHONE_LEN];
    char group[GROUP_LEN];
} Contact;

/* strncpy 不保证补 '\0'：最多复制 cap-1 个字符，再手动收尾 */
static void copy_field(char *dst, size_t cap, const char *src) {
    strncpy(dst, src, cap - 1);
    dst[cap - 1] = '\0';
}

/* 成功返回新的条数；姓名空或表满返回 -1 */
static int add_contact(Contact *book, int count, const char *name,
                       const char *phone, const char *group) {
    if (book == NULL || count < 0 || count >= MAX_CONTACTS) {
        return -1;
    }
    if (name == NULL || name[0] == '\0') {
        return -1;
    }
    copy_field(book[count].name, NAME_LEN, name);
    copy_field(book[count].phone, PHONE_LEN, phone);
    copy_field(book[count].group, GROUP_LEN, group);
    return count + 1;
}

static void list_contacts(const Contact *book, int count) {
    if (count == 0) {
        printf("（通讯录为空）\n");
        return;
    }
    printf("共 %d 条：\n", count);
    for (int i = 0; i < count; i++) {
        printf("%2d. %s | %s | %s\n",
               i + 1, book[i].name, book[i].phone, book[i].group);
    }
}

int main(void) {
    Contact book[MAX_CONTACTS];
    int count = 0;

    count = add_contact(book, count, "Li Lei", "13800000001", "同学");
    if (count < 0) {
        fprintf(stderr, "添加 Li Lei 失败。\n");
        return 1;
    }
    count = add_contact(book, count, "Han Meimei", "13800000002", "同学");
    if (count < 0) {
        fprintf(stderr, "添加 Han Meimei 失败。\n");
        return 1;
    }
    count = add_contact(book, count, "Wang Fang", "010-88886666", "家人");
    if (count < 0) {
        fprintf(stderr, "添加 Wang Fang 失败。\n");
        return 1;
    }

    list_contacts(book, count);
    return 0;
}
`,
        explain: "字符串边界是通讯录最容易出错的地方：姓名刚好 31 字节时，strncpy 不会写终止符，必须手动补。add_contact 用「返回新条数」把成功和失败分开，调用者不会忘记更新 count。"
      },
      {
        n: 2,
        title: "查找与删除",
        tasks: ["实现 find_by_name，用 strcmp 逐条比较，返回下标或 -1", "实现 remove_at，用 memmove 把 idx 之后的元素前移一格", "实现 remove_by_name，找不到时条数不变"],
        starter: String.raw`/* contacts · M2 起步：补全 find_by_name 与 remove_by_name
 * 编译：gcc -std=c99 -Wall -Wextra ct2_start.c -o ct2
 */
#include <stdio.h>
#include <string.h>

#define MAX_CONTACTS 100
#define NAME_LEN     32
#define PHONE_LEN    16
#define GROUP_LEN    16

typedef struct {
    char name[NAME_LEN];
    char phone[PHONE_LEN];
    char group[GROUP_LEN];
} Contact;

static void copy_field(char *dst, size_t cap, const char *src) {
    strncpy(dst, src, cap - 1);
    dst[cap - 1] = '\0';
}

static int add_contact(Contact *book, int count, const char *name,
                       const char *phone, const char *group) {
    if (book == NULL || count < 0 || count >= MAX_CONTACTS ||
        name == NULL || name[0] == '\0') {
        return -1;
    }
    copy_field(book[count].name, NAME_LEN, name);
    copy_field(book[count].phone, PHONE_LEN, phone);
    copy_field(book[count].group, GROUP_LEN, group);
    return count + 1;
}

/* TODO 1：strcmp 逐条比较，命中返回下标，否则返回 -1 */
static int find_by_name(const Contact *book, int count, const char *name) {
    (void)book;
    (void)count;
    (void)name;
    return -1;
}

/* TODO 2：把 idx 之后的元素用 memmove 整体前移一格，返回 count - 1 */
static int remove_at(Contact *book, int count, int idx) {
    (void)book;
    (void)count;
    (void)idx;
    return count;
}

/* TODO 3：先 find_by_name；找不到原样返回 count，找到就调用 remove_at */
static int remove_by_name(Contact *book, int count, const char *name) {
    (void)book;
    (void)count;
    (void)name;
    return count;
}

static void print_one(const Contact *c) {
    printf("%s | %s | %s\n", c->name, c->phone, c->group);
}

static void list_contacts(const Contact *book, int count) {
    if (count == 0) {
        printf("（通讯录为空）\n");
        return;
    }
    printf("共 %d 条：\n", count);
    for (int i = 0; i < count; i++) {
        printf("%2d. ", i + 1);
        print_one(&book[i]);
    }
}

int main(void) {
    Contact book[MAX_CONTACTS];
    int count = 0;

    count = add_contact(book, count, "Li Lei", "13800000001", "同学");
    count = add_contact(book, count, "Han Meimei", "13800000002", "同学");
    count = add_contact(book, count, "Wang Fang", "010-88886666", "家人");

    int idx = find_by_name(book, count, "Han Meimei");
    if (idx >= 0) {
        printf("找到 Han Meimei（下标 %d）：", idx);
        print_one(&book[idx]);
    } else {
        printf("查找失败：TODO 1 还没完成。\n");
    }

    int before = count;
    count = remove_by_name(book, count, "Han Meimei");
    printf("删除 Han Meimei：%d -> %d 条%s\n",
           before, count, (count == before) ? "（TODO 2/3 未完成）" : "");

    list_contacts(book, count);
    return 0;
}
`,
        hints: ["删除后把最后一个槽位 memset 清零，调试时更干净", "memmove 允许源和目标重叠，memcpy 不保证", "删除不存在的联系人不能把 count 减 1"],
        solution: String.raw`/* contacts · M2：按姓名查找、删除（后续元素前移）
 * 编译：gcc -std=c99 -Wall -Wextra ct2_sol.c -o ct2
 */
#include <stdio.h>
#include <string.h>

#define MAX_CONTACTS 100
#define NAME_LEN     32
#define PHONE_LEN    16
#define GROUP_LEN    16

typedef struct {
    char name[NAME_LEN];
    char phone[PHONE_LEN];
    char group[GROUP_LEN];
} Contact;

static void copy_field(char *dst, size_t cap, const char *src) {
    strncpy(dst, src, cap - 1);
    dst[cap - 1] = '\0';
}

static int add_contact(Contact *book, int count, const char *name,
                       const char *phone, const char *group) {
    if (book == NULL || count < 0 || count >= MAX_CONTACTS ||
        name == NULL || name[0] == '\0') {
        return -1;
    }
    copy_field(book[count].name, NAME_LEN, name);
    copy_field(book[count].phone, PHONE_LEN, phone);
    copy_field(book[count].group, GROUP_LEN, group);
    return count + 1;
}

/* 找到返回下标；找不到返回 -1 */
static int find_by_name(const Contact *book, int count, const char *name) {
    if (book == NULL || name == NULL) {
        return -1;
    }
    for (int i = 0; i < count; i++) {
        if (strcmp(book[i].name, name) == 0) {
            return i;
        }
    }
    return -1;
}

/* 删除下标 idx 的元素：把后面的元素整体前移一格，返回新的条数 */
static int remove_at(Contact *book, int count, int idx) {
    if (book == NULL || idx < 0 || idx >= count) {
        return count;
    }
    memmove(&book[idx], &book[idx + 1],
            (size_t)(count - idx - 1) * sizeof book[0]);
    memset(&book[count - 1], 0, sizeof book[0]);   /* 清掉重复的尾部记录 */
    return count - 1;
}

/* 按姓名删除；找不到时条数不变 */
static int remove_by_name(Contact *book, int count, const char *name) {
    int idx = find_by_name(book, count, name);

    if (idx < 0) {
        return count;
    }
    return remove_at(book, count, idx);
}

static void print_one(const Contact *c) {
    printf("%s | %s | %s\n", c->name, c->phone, c->group);
}

static void list_contacts(const Contact *book, int count) {
    if (count == 0) {
        printf("（通讯录为空）\n");
        return;
    }
    printf("共 %d 条：\n", count);
    for (int i = 0; i < count; i++) {
        printf("%2d. ", i + 1);
        print_one(&book[i]);
    }
}

int main(void) {
    Contact book[MAX_CONTACTS];
    int count = 0;

    count = add_contact(book, count, "Li Lei", "13800000001", "同学");
    count = add_contact(book, count, "Han Meimei", "13800000002", "同学");
    count = add_contact(book, count, "Wang Fang", "010-88886666", "家人");
    count = add_contact(book, count, "Zhao Min", "13900000003", "同事");

    int idx = find_by_name(book, count, "Han Meimei");
    if (idx >= 0) {
        printf("找到 Han Meimei（下标 %d）：", idx);
        print_one(&book[idx]);
    }

    if (find_by_name(book, count, "Nobody") < 0) {
        printf("没有找到 Nobody，符合预期。\n");
    }

    int before = count;
    count = remove_by_name(book, count, "Han Meimei");
    printf("\n删除 Han Meimei：%d -> %d 条\n\n", before, count);

    count = remove_by_name(book, count, "Nobody");
    printf("删除不存在的 Nobody 后仍是 %d 条。\n\n", count);

    list_contacts(book, count);
    return 0;
}
`,
        explain: "数组删除的代价是 O(n) 的元素搬移，这是连续存储的取舍。memmove 的第三个参数是字节数，别写成元素个数。"
      },
      {
        n: 3,
        title: "二进制保存与读取",
        tasks: ["定义文件格式：4 字节魔数 \"CTCT\" + unsigned int 条数 + 定长 Contact 记录", "实现 save_contacts：以 \"wb\" 打开，逐段 fwrite 并检查返回值", "实现 load_contacts：文件不存在返回 0，魔数/条数/记录不完整返回 -1"],
        starter: String.raw`/* contacts · M3 起步：补全 save_contacts 与 load_contacts
 * 编译：gcc -std=c99 -Wall -Wextra ct3_start.c -o ct3
 */
#include <stdio.h>
#include <string.h>

#define MAX_CONTACTS 100
#define NAME_LEN     32
#define PHONE_LEN    16
#define GROUP_LEN    16
#define DATA_FILE    "contacts.dat"

typedef struct {
    char name[NAME_LEN];
    char phone[PHONE_LEN];
    char group[GROUP_LEN];
} Contact;

static const char MAGIC[4] = { 'C', 'T', 'C', 'T' };

static void copy_field(char *dst, size_t cap, const char *src) {
    strncpy(dst, src, cap - 1);
    dst[cap - 1] = '\0';
}

static int add_contact(Contact *book, int count, const char *name,
                       const char *phone, const char *group) {
    if (book == NULL || count < 0 || count >= MAX_CONTACTS ||
        name == NULL || name[0] == '\0') {
        return -1;
    }
    copy_field(book[count].name, NAME_LEN, name);
    copy_field(book[count].phone, PHONE_LEN, phone);
    copy_field(book[count].group, GROUP_LEN, group);
    return count + 1;
}

static void list_contacts(const Contact *book, int count) {
    if (count == 0) {
        printf("（通讯录为空）\n");
        return;
    }
    printf("共 %d 条：\n", count);
    for (int i = 0; i < count; i++) {
        printf("%2d. %s | %s | %s\n",
               i + 1, book[i].name, book[i].phone, book[i].group);
    }
}

/* TODO 1：以 "wb" 打开；依次写 MAGIC、条数、count 条记录；
 *         每一步都检查返回值，失败返回 0，成功返回 1。 */
static int save_contacts(const char *path, const Contact *book, int count) {
    (void)path;
    (void)book;
    (void)count;
    return 0;
}

/* TODO 2：以 "rb" 打开；文件不存在返回 0；校验魔数、条数（不得超过 max）、
 *         记录区完整；成功把条数写入 *count 并返回 1，否则返回 -1。 */
static int load_contacts(const char *path, Contact *book, int max, int *count) {
    (void)path;
    (void)book;
    (void)max;
    (void)count;
    return 0;
}

int main(void) {
    Contact book[MAX_CONTACTS];
    int count = 0;
    int st;

    st = load_contacts(DATA_FILE, book, MAX_CONTACTS, &count);
    printf("load_contacts = %d（TODO 完成前恒为 0）\n", st);

    count = add_contact(book, count, "Li Lei", "13800000001", "同学");
    count = add_contact(book, count, "Han Meimei", "13800000002", "同学");
    list_contacts(book, count);

    if (save_contacts(DATA_FILE, book, count)) {
        printf("已保存到 %s\n", DATA_FILE);
    } else {
        printf("保存失败：save_contacts 还是 TODO。\n");
    }
    return 0;
}
`,
        hints: ["fwrite 的返回值是成功写出的「项数」，不是字节数", "读取条数后先检查 n <= max，再分配或读取，防止坏文件越界", "读取后把每个字符串的最后一个字节置 0，防御损坏文件"],
        solution: String.raw`/* contacts · M3：二进制文件读写（魔数 + 条数头 + 记录区）
 * 编译：gcc -std=c99 -Wall -Wextra ct3_sol.c -o ct3
 */
#include <stdio.h>
#include <string.h>

#define MAX_CONTACTS 100
#define NAME_LEN     32
#define PHONE_LEN    16
#define GROUP_LEN    16
#define DATA_FILE    "contacts.dat"

typedef struct {
    char name[NAME_LEN];
    char phone[PHONE_LEN];
    char group[GROUP_LEN];
} Contact;

static const char MAGIC[4] = { 'C', 'T', 'C', 'T' };

static void copy_field(char *dst, size_t cap, const char *src) {
    strncpy(dst, src, cap - 1);
    dst[cap - 1] = '\0';
}

static int add_contact(Contact *book, int count, const char *name,
                       const char *phone, const char *group) {
    if (book == NULL || count < 0 || count >= MAX_CONTACTS ||
        name == NULL || name[0] == '\0') {
        return -1;
    }
    copy_field(book[count].name, NAME_LEN, name);
    copy_field(book[count].phone, PHONE_LEN, phone);
    copy_field(book[count].group, GROUP_LEN, group);
    return count + 1;
}

static void list_contacts(const Contact *book, int count) {
    if (count == 0) {
        printf("（通讯录为空）\n");
        return;
    }
    printf("共 %d 条：\n", count);
    for (int i = 0; i < count; i++) {
        printf("%2d. %s | %s | %s\n",
               i + 1, book[i].name, book[i].phone, book[i].group);
    }
}

/* 成功返回 1，失败返回 0。格式：4 字节魔数 + unsigned int 条数 + 记录区 */
static int save_contacts(const char *path, const Contact *book, int count) {
    FILE *fp;
    unsigned int n;
    int ok = 1;

    if (path == NULL || book == NULL || count < 0) {
        return 0;
    }
    fp = fopen(path, "wb");
    if (fp == NULL) {
        return 0;
    }
    if (fwrite(MAGIC, 1, sizeof MAGIC, fp) != sizeof MAGIC) {
        ok = 0;
    }
    n = (unsigned int)count;
    if (ok && fwrite(&n, sizeof n, 1, fp) != 1) {
        ok = 0;
    }
    if (ok && n > 0 && fwrite(book, sizeof book[0], n, fp) != n) {
        ok = 0;
    }
    if (fclose(fp) != 0) {
        ok = 0;
    }
    return ok;
}

/* 返回 1 读入成功；0 文件不存在（视为空通讯录）；-1 文件损坏或读失败 */
static int load_contacts(const char *path, Contact *book, int max, int *count) {
    FILE *fp;
    char magic[4];
    unsigned int n;

    if (path == NULL || book == NULL || count == NULL || max < 0) {
        return -1;
    }
    *count = 0;
    fp = fopen(path, "rb");
    if (fp == NULL) {
        return 0;
    }
    if (fread(magic, 1, sizeof magic, fp) != sizeof magic ||
        memcmp(magic, MAGIC, sizeof magic) != 0) {
        fclose(fp);
        return -1;
    }
    if (fread(&n, sizeof n, 1, fp) != 1 || n > (unsigned int)max) {
        fclose(fp);
        return -1;
    }
    if (n > 0 && fread(book, sizeof book[0], n, fp) != n) {
        fclose(fp);
        return -1;
    }
    /* 防御损坏文件：保证每个字符串都以 '\0' 结尾 */
    for (unsigned int i = 0; i < n; i++) {
        book[i].name[NAME_LEN - 1] = '\0';
        book[i].phone[PHONE_LEN - 1] = '\0';
        book[i].group[GROUP_LEN - 1] = '\0';
    }
    *count = (int)n;
    if (fclose(fp) != 0) {
        *count = 0;
        return -1;
    }
    return 1;
}

int main(void) {
    Contact book[MAX_CONTACTS];
    int count = 0;
    int st;

    remove(DATA_FILE);                       /* 从干净状态开始演示 */

    st = load_contacts(DATA_FILE, book, MAX_CONTACTS, &count);
    printf("1) 不存在的文件：load = %d, count = %d（期望 0, 0）\n\n", st, count);

    count = add_contact(book, count, "Li Lei", "13800000001", "同学");
    count = add_contact(book, count, "Han Meimei", "13800000002", "同学");
    count = add_contact(book, count, "Wang Fang", "010-88886666", "家人");

    if (!save_contacts(DATA_FILE, book, count)) {
        fprintf(stderr, "保存失败：%s\n", DATA_FILE);
        return 1;
    }
    printf("2) 已保存 %d 条到 %s\n\n", count, DATA_FILE);

    memset(book, 0, sizeof book);
    count = 0;
    st = load_contacts(DATA_FILE, book, MAX_CONTACTS, &count);
    printf("3) 重新读取：load = %d, count = %d（期望 1, 3）\n", st, count);
    list_contacts(book, count);

    {
        FILE *bad = fopen("bad.dat", "wb");
        if (bad != NULL) {
            fputs("NOPE", bad);
            fclose(bad);
            st = load_contacts("bad.dat", book, MAX_CONTACTS, &count);
            printf("\n4) 坏文件：load = %d（期望 -1）\n", st);
            remove("bad.dat");
        }
    }
    return 0;
}
`,
        explain: "二进制格式没有自描述能力，所以要靠魔数识别文件类型、靠条数知道记录区长度。参考实现按字段分别写头，避免结构体填充带来的平台差异；记录区仍是定长结构，换编译器前要确认 sizeof。"
      },
      {
        n: 4,
        title: "菜单与完整流程",
        tasks: ["用 fgets 读菜单选项，strtol 转换，非法输入提示后重试", "实现新增/查找/删除/列出四个分支，新增时校验姓名非空、电话格式、是否重名", "启动时 load，退出（选项 5 或 EOF）时 save；保存失败返回非 0"],
        starter: String.raw`/* contacts · M4 起步：菜单骨架已搭好，补全 valid_phone 与三个菜单动作
 * 编译：gcc -std=c99 -Wall -Wextra ct4_start.c -o ct4
 * 运行：./ct4，按菜单输入；输入 5 或 Ctrl+D / Ctrl+Z 保存退出
 */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>

#define MAX_CONTACTS 100
#define NAME_LEN     32
#define PHONE_LEN    16
#define GROUP_LEN    16
#define DATA_FILE    "contacts.dat"

typedef struct {
    char name[NAME_LEN];
    char phone[PHONE_LEN];
    char group[GROUP_LEN];
} Contact;

static const char MAGIC[4] = { 'C', 'T', 'C', 'T' };

static void copy_field(char *dst, size_t cap, const char *src) {
    strncpy(dst, src, cap - 1);
    dst[cap - 1] = '\0';
}

static int add_contact(Contact *book, int count, const char *name,
                       const char *phone, const char *group) {
    if (book == NULL || count < 0 || count >= MAX_CONTACTS ||
        name == NULL || name[0] == '\0') {
        return -1;
    }
    copy_field(book[count].name, NAME_LEN, name);
    copy_field(book[count].phone, PHONE_LEN, phone);
    copy_field(book[count].group, GROUP_LEN, group);
    return count + 1;
}

static int find_by_name(const Contact *book, int count, const char *name) {
    if (book == NULL || name == NULL) {
        return -1;
    }
    for (int i = 0; i < count; i++) {
        if (strcmp(book[i].name, name) == 0) {
            return i;
        }
    }
    return -1;
}

static int remove_by_name(Contact *book, int count, const char *name) {
    int idx = find_by_name(book, count, name);

    if (idx < 0) {
        return count;
    }
    memmove(&book[idx], &book[idx + 1],
            (size_t)(count - idx - 1) * sizeof book[0]);
    memset(&book[count - 1], 0, sizeof book[0]);
    return count - 1;
}

static void print_one(const Contact *c) {
    printf("%s | %s | %s\n", c->name, c->phone, c->group);
}

static void list_contacts(const Contact *book, int count) {
    if (count == 0) {
        printf("（通讯录为空）\n");
        return;
    }
    printf("共 %d 条：\n", count);
    for (int i = 0; i < count; i++) {
        printf("%2d. ", i + 1);
        print_one(&book[i]);
    }
}

/* TODO 1：只允许数字、'-'、'+'、空格；数字至少 5 个才返回 1 */
static int valid_phone(const char *s) {
    (void)s;
    return 0;
}

/* 读一行；返回 0 表示 EOF。超长时截断并丢弃本行剩余字符，避免污染下一次输入 */
static int read_line(char *buf, size_t cap) {
    size_t len;
    int ch;

    if (fgets(buf, (int)cap, stdin) == NULL) {
        buf[0] = '\0';
        return 0;
    }
    len = strlen(buf);
    if (len > 0 && buf[len - 1] != '\n') {
        while ((ch = getchar()) != '\n' && ch != EOF) {
            /* 丢弃超长部分 */
        }
    } else {
        while (len > 0 && (buf[len - 1] == '\n' || buf[len - 1] == '\r')) {
            buf[--len] = '\0';
        }
    }
    return 1;
}

static int parse_choice(const char *s) {
    char *end = NULL;
    long v = strtol(s, &end, 10);

    if (end == s || v < 1 || v > 5) {
        return 0;
    }
    return (int)v;
}

static int save_contacts(const char *path, const Contact *book, int count) {
    FILE *fp;
    unsigned int n;
    int ok = 1;

    if (path == NULL || book == NULL || count < 0) {
        return 0;
    }
    fp = fopen(path, "wb");
    if (fp == NULL) {
        return 0;
    }
    if (fwrite(MAGIC, 1, sizeof MAGIC, fp) != sizeof MAGIC) {
        ok = 0;
    }
    n = (unsigned int)count;
    if (ok && fwrite(&n, sizeof n, 1, fp) != 1) {
        ok = 0;
    }
    if (ok && n > 0 && fwrite(book, sizeof book[0], n, fp) != n) {
        ok = 0;
    }
    if (fclose(fp) != 0) {
        ok = 0;
    }
    return ok;
}

static int load_contacts(const char *path, Contact *book, int max, int *count) {
    FILE *fp;
    char magic[4];
    unsigned int n;

    if (path == NULL || book == NULL || count == NULL || max < 0) {
        return -1;
    }
    *count = 0;
    fp = fopen(path, "rb");
    if (fp == NULL) {
        return 0;
    }
    if (fread(magic, 1, sizeof magic, fp) != sizeof magic ||
        memcmp(magic, MAGIC, sizeof magic) != 0) {
        fclose(fp);
        return -1;
    }
    if (fread(&n, sizeof n, 1, fp) != 1 || n > (unsigned int)max) {
        fclose(fp);
        return -1;
    }
    if (n > 0 && fread(book, sizeof book[0], n, fp) != n) {
        fclose(fp);
        return -1;
    }
    for (unsigned int i = 0; i < n; i++) {
        book[i].name[NAME_LEN - 1] = '\0';
        book[i].phone[PHONE_LEN - 1] = '\0';
        book[i].group[GROUP_LEN - 1] = '\0';
    }
    *count = (int)n;
    if (fclose(fp) != 0) {
        *count = 0;
        return -1;
    }
    return 1;
}

/* TODO 2：依次读姓名、电话、分组；校验非空/重复/电话格式；
 *         空分组填 "其他"；add_contact 成功后更新 *count。 */
static void menu_add(Contact *book, int *count) {
    (void)book;
    (void)count;
    printf("TODO：menu_add 尚未实现。\n");
}

/* TODO 3：读姓名，find_by_name，找到则打印该条，否则提示未找到。 */
static void menu_find(const Contact *book, int count) {
    (void)book;
    (void)count;
    printf("TODO：menu_find 尚未实现。\n");
}

/* TODO 4：读姓名，记录删除前的条数，调用 remove_by_name；
 *         条数没变说明没找到，变了说明删除成功。 */
static void menu_delete(Contact *book, int *count) {
    (void)book;
    (void)count;
    printf("TODO：menu_delete 尚未实现。\n");
}

int main(void) {
    Contact book[MAX_CONTACTS];
    int count = 0;
    int st;
    char line[32];

    st = load_contacts(DATA_FILE, book, MAX_CONTACTS, &count);
    if (st < 0) {
        fprintf(stderr, "警告：%s 已损坏，按空通讯录启动。\n", DATA_FILE);
        count = 0;
    } else if (st == 0) {
        printf("提示：%s 不存在，将新建通讯录。\n", DATA_FILE);
    } else {
        printf("已从 %s 读取 %d 条联系人。\n", DATA_FILE, count);
    }

    for (;;) {
        printf("\n===== 通讯录（%d 条）=====\n", count);
        printf("1. 新增   2. 查找   3. 删除   4. 列出   5. 保存并退出\n");
        printf("请选择：");
        fflush(stdout);
        if (fgets(line, sizeof line, stdin) == NULL) {
            printf("\n输入结束，保存后退出。\n");
            break;
        }
        switch (parse_choice(line)) {
        case 1:
            menu_add(book, &count);
            break;
        case 2:
            menu_find(book, count);
            break;
        case 3:
            menu_delete(book, &count);
            break;
        case 4:
            list_contacts(book, count);
            break;
        case 5:
            printf("保存并退出。\n");
            goto done;
        default:
            printf("无效选项，请输入 1-5。\n");
            break;
        }
    }

done:
    if (!save_contacts(DATA_FILE, book, count)) {
        fprintf(stderr, "保存失败：%s\n", DATA_FILE);
        return 1;
    }
    printf("已保存 %d 条到 %s。\n", count, DATA_FILE);
    return 0;
}
`,
        hints: ["fgets 会保留换行符，读完后把结尾的换行符和回车符去掉", "scanf 和 fgets 混用会留下换行符，本项目统一用 fgets", "电话校验只做基本检查：数字至少 5 位，允许 - + 空格"],
        solution: String.raw`/* contacts · M4：整合为带菜单的通讯录程序（启动读取，退出保存）
 * 编译：gcc -std=c99 -Wall -Wextra ct4_sol.c -o ct4
 * 运行：./ct4，按菜单输入；输入 5 或 Ctrl+D / Ctrl+Z 保存退出
 */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>

#define MAX_CONTACTS 100
#define NAME_LEN     32
#define PHONE_LEN    16
#define GROUP_LEN    16
#define DATA_FILE    "contacts.dat"

typedef struct {
    char name[NAME_LEN];
    char phone[PHONE_LEN];
    char group[GROUP_LEN];
} Contact;

static const char MAGIC[4] = { 'C', 'T', 'C', 'T' };

static void copy_field(char *dst, size_t cap, const char *src) {
    strncpy(dst, src, cap - 1);
    dst[cap - 1] = '\0';
}

static int add_contact(Contact *book, int count, const char *name,
                       const char *phone, const char *group) {
    if (book == NULL || count < 0 || count >= MAX_CONTACTS ||
        name == NULL || name[0] == '\0') {
        return -1;
    }
    copy_field(book[count].name, NAME_LEN, name);
    copy_field(book[count].phone, PHONE_LEN, phone);
    copy_field(book[count].group, GROUP_LEN, group);
    return count + 1;
}

static int find_by_name(const Contact *book, int count, const char *name) {
    if (book == NULL || name == NULL) {
        return -1;
    }
    for (int i = 0; i < count; i++) {
        if (strcmp(book[i].name, name) == 0) {
            return i;
        }
    }
    return -1;
}

static int remove_by_name(Contact *book, int count, const char *name) {
    int idx = find_by_name(book, count, name);

    if (idx < 0) {
        return count;
    }
    memmove(&book[idx], &book[idx + 1],
            (size_t)(count - idx - 1) * sizeof book[0]);
    memset(&book[count - 1], 0, sizeof book[0]);
    return count - 1;
}

static void print_one(const Contact *c) {
    printf("%s | %s | %s\n", c->name, c->phone, c->group);
}

static void list_contacts(const Contact *book, int count) {
    if (count == 0) {
        printf("（通讯录为空）\n");
        return;
    }
    printf("共 %d 条：\n", count);
    for (int i = 0; i < count; i++) {
        printf("%2d. ", i + 1);
        print_one(&book[i]);
    }
}

static int valid_phone(const char *s) {
    int digits = 0;

    if (s == NULL || s[0] == '\0') {
        return 0;
    }
    for (; *s != '\0'; s++) {
        unsigned char c = (unsigned char)*s;
        if (isdigit(c)) {
            digits++;
        } else if (c != '-' && c != '+' && c != ' ') {
            return 0;
        }
    }
    return digits >= 5;
}

/* 读一行；返回 0 表示 EOF。超长时截断并丢弃本行剩余字符，避免污染下一次输入 */
static int read_line(char *buf, size_t cap) {
    size_t len;
    int ch;

    if (fgets(buf, (int)cap, stdin) == NULL) {
        buf[0] = '\0';
        return 0;
    }
    len = strlen(buf);
    if (len > 0 && buf[len - 1] != '\n') {
        while ((ch = getchar()) != '\n' && ch != EOF) {
            /* 丢弃超长部分 */
        }
    } else {
        while (len > 0 && (buf[len - 1] == '\n' || buf[len - 1] == '\r')) {
            buf[--len] = '\0';
        }
    }
    return 1;
}

static int parse_choice(const char *s) {
    char *end = NULL;
    long v = strtol(s, &end, 10);

    if (end == s || v < 1 || v > 5) {
        return 0;
    }
    return (int)v;
}

static int save_contacts(const char *path, const Contact *book, int count) {
    FILE *fp;
    unsigned int n;
    int ok = 1;

    if (path == NULL || book == NULL || count < 0) {
        return 0;
    }
    fp = fopen(path, "wb");
    if (fp == NULL) {
        return 0;
    }
    if (fwrite(MAGIC, 1, sizeof MAGIC, fp) != sizeof MAGIC) {
        ok = 0;
    }
    n = (unsigned int)count;
    if (ok && fwrite(&n, sizeof n, 1, fp) != 1) {
        ok = 0;
    }
    if (ok && n > 0 && fwrite(book, sizeof book[0], n, fp) != n) {
        ok = 0;
    }
    if (fclose(fp) != 0) {
        ok = 0;
    }
    return ok;
}

static int load_contacts(const char *path, Contact *book, int max, int *count) {
    FILE *fp;
    char magic[4];
    unsigned int n;

    if (path == NULL || book == NULL || count == NULL || max < 0) {
        return -1;
    }
    *count = 0;
    fp = fopen(path, "rb");
    if (fp == NULL) {
        return 0;
    }
    if (fread(magic, 1, sizeof magic, fp) != sizeof magic ||
        memcmp(magic, MAGIC, sizeof magic) != 0) {
        fclose(fp);
        return -1;
    }
    if (fread(&n, sizeof n, 1, fp) != 1 || n > (unsigned int)max) {
        fclose(fp);
        return -1;
    }
    if (n > 0 && fread(book, sizeof book[0], n, fp) != n) {
        fclose(fp);
        return -1;
    }
    for (unsigned int i = 0; i < n; i++) {
        book[i].name[NAME_LEN - 1] = '\0';
        book[i].phone[PHONE_LEN - 1] = '\0';
        book[i].group[GROUP_LEN - 1] = '\0';
    }
    *count = (int)n;
    if (fclose(fp) != 0) {
        *count = 0;
        return -1;
    }
    return 1;
}

static void menu_add(Contact *book, int *count) {
    char name[NAME_LEN];
    char phone[PHONE_LEN];
    char group[GROUP_LEN];
    int n;

    printf("姓名：");
    if (!read_line(name, sizeof name) || name[0] == '\0') {
        printf("姓名不能为空。\n");
        return;
    }
    if (find_by_name(book, *count, name) >= 0) {
        printf("已存在同名联系人：%s\n", name);
        return;
    }
    printf("电话（至少 5 位数字，可含 - + 空格）：");
    if (!read_line(phone, sizeof phone) || !valid_phone(phone)) {
        printf("电话格式不合法。\n");
        return;
    }
    printf("分组（直接回车 = 其他）：");
    if (!read_line(group, sizeof group)) {
        return;
    }
    if (group[0] == '\0') {
        copy_field(group, sizeof group, "其他");
    }

    n = add_contact(book, *count, name, phone, group);
    if (n < 0) {
        printf("添加失败：通讯录已满（最多 %d 条）。\n", MAX_CONTACTS);
        return;
    }
    *count = n;
    printf("已添加 %s。\n", name);
}

static void menu_find(const Contact *book, int count) {
    char name[NAME_LEN];
    int idx;

    printf("要查找的姓名：");
    if (!read_line(name, sizeof name) || name[0] == '\0') {
        printf("姓名不能为空。\n");
        return;
    }
    idx = find_by_name(book, count, name);
    if (idx < 0) {
        printf("未找到 %s。\n", name);
        return;
    }
    print_one(&book[idx]);
}

static void menu_delete(Contact *book, int *count) {
    char name[NAME_LEN];
    int before;

    printf("要删除的姓名：");
    if (!read_line(name, sizeof name) || name[0] == '\0') {
        printf("姓名不能为空。\n");
        return;
    }
    before = *count;
    *count = remove_by_name(book, *count, name);
    if (*count == before) {
        printf("未找到 %s，未删除任何记录。\n", name);
    } else {
        printf("已删除 %s。\n", name);
    }
}

int main(void) {
    Contact book[MAX_CONTACTS];
    int count = 0;
    int st;
    char line[32];

    st = load_contacts(DATA_FILE, book, MAX_CONTACTS, &count);
    if (st < 0) {
        fprintf(stderr, "警告：%s 已损坏，按空通讯录启动。\n", DATA_FILE);
        count = 0;
    } else if (st == 0) {
        printf("提示：%s 不存在，将新建通讯录。\n", DATA_FILE);
    } else {
        printf("已从 %s 读取 %d 条联系人。\n", DATA_FILE, count);
    }

    for (;;) {
        printf("\n===== 通讯录（%d 条）=====\n", count);
        printf("1. 新增   2. 查找   3. 删除   4. 列出   5. 保存并退出\n");
        printf("请选择：");
        fflush(stdout);
        if (fgets(line, sizeof line, stdin) == NULL) {
            printf("\n输入结束，保存后退出。\n");
            break;
        }
        switch (parse_choice(line)) {
        case 1:
            menu_add(book, &count);
            break;
        case 2:
            menu_find(book, count);
            break;
        case 3:
            menu_delete(book, &count);
            break;
        case 4:
            list_contacts(book, count);
            break;
        case 5:
            printf("保存并退出。\n");
            goto done;
        default:
            printf("无效选项，请输入 1-5。\n");
            break;
        }
    }

done:
    if (!save_contacts(DATA_FILE, book, count)) {
        fprintf(stderr, "保存失败：%s\n", DATA_FILE);
        return 1;
    }
    printf("已保存 %d 条到 %s。\n", count, DATA_FILE);
    return 0;
}
`,
        explain: "菜单程序的重点是「每个输入都当作不可信」：空姓名、超长字段、重复联系人、坏文件都要有明确提示。退出路径统一走保存，EOF 也要保存，避免管道输入时丢数据。"
      }
    ],
    extension: ["增加修改联系人、按分组筛选与分页显示", "改用 CSV/JSON 文本格式，便于跨平台和人工编辑", "加入模糊搜索（strstr）与导入/导出"],
    solutionNote: "参考实现把内存操作与文件格式分开：M1–M2 只管数组，M3 只管字节流，M4 只负责交互；这样每层的错误都能单独定位。"
  },
  {
    id: "bittools",
    title: "位运算工具",
    en: "Bit Toolkit",
    tagline: "用掩码和移位看清每一个二进制位",
    level: "进阶",
    minutes: 150,
    chapters: ["ch02", "ch03"],
    goals: ["用 uint32_t 与 1u << n 构造掩码，打印 32 位二进制", "实现置位/清位/翻转/测试，处理 0..31 之外的位号", "实现 popcount、2 的幂判断与循环左移，避免移位未定义行为", "用八进制权限值解析 owner/group/other 的 rwx"],
    intro: "用一组小工具把 32 位整数拆开看：打印二进制、置位/清位/翻转、数 1 的个数、判断 2 的幂、循环左移，最后解析 Unix 的 rwx 权限。",
    milestones: [
      {
        n: 1,
        title: "二进制打印与位测试",
        tasks: ["实现 print_binary：从第 31 位到第 0 位打印 0/1，每 8 位加空格", "实现 bit_test(x, n)，n 越界时返回 0", "在 main 中验证 0、1、0x80000000、0xF0F0F0F0 的输出"],
        starter: String.raw`/* bittools · M1 起步：补全 print_binary 与 bit_test
 * 编译：gcc -std=c99 -Wall -Wextra bt1_start.c -o bt1
 */
#include <stdio.h>
#include <stdint.h>

/* TODO 1：for (int i = 31; i >= 0; i--)，用 (x >> i) & 1u 取位；
 *         每打印 8 位补一个空格，最后换行。 */
static void print_binary(uint32_t x) {
    (void)x;
    printf("TODO：print_binary 尚未实现\n");
}

/* TODO 2：先检查 n 在 0..31；返回 (x & (1u << n)) != 0 的结果。 */
static int bit_test(uint32_t x, int n) {
    (void)x;
    (void)n;
    return 0;
}

int main(void) {
    uint32_t values[4] = { 0u, 1u, 0x80000000u, 0xF0F0F0F0u };

    for (int i = 0; i < 4; i++) {
        printf("0x%08lX  ", (unsigned long)values[i]);
        print_binary(values[i]);
    }

    printf("\nbit_test(0x80000000, 31) = %d（期望 1）\n",
           bit_test(0x80000000u, 31));
    printf("bit_test(0xF0F0F0F0, 4)  = %d（期望 1）\n",
           bit_test(0xF0F0F0F0u, 4));
    return 0;
}
`,
        hints: ["用 (x >> i) & 1u 取第 i 位，i 从 31 递减到 0", "1u 是无符号字面量，避免 1 << 31 的有符号溢出", "putchar 的参数是 int，但只传字符常量即可"],
        solution: String.raw`/* bittools · M1：打印 32 位二进制与位测试
 * 编译：gcc -std=c99 -Wall -Wextra bt1_sol.c -o bt1
 */
#include <stdio.h>
#include <stdint.h>

/* 从最高位到最低位打印 32 个 0/1，每 8 位插入一个空格 */
static void print_binary(uint32_t x) {
    for (int i = 31; i >= 0; i--) {
        putchar(((x >> i) & 1u) ? '1' : '0');
        if (i > 0 && i % 8 == 0) {
            putchar(' ');
        }
    }
    putchar('\n');
}

/* n 必须在 0..31；越界返回 0，避免移位未定义行为 */
static int bit_test(uint32_t x, int n) {
    if (n < 0 || n >= 32) {
        return 0;
    }
    return (x & (1u << n)) != 0;
}

int main(void) {
    uint32_t values[4] = { 0u, 1u, 0x80000000u, 0xF0F0F0F0u };

    for (int i = 0; i < 4; i++) {
        printf("0x%08lX  ", (unsigned long)values[i]);
        print_binary(values[i]);
    }

    printf("\nbit_test(0x80000000, 31) = %d（期望 1）\n",
           bit_test(0x80000000u, 31));
    printf("bit_test(0x80000000, 30) = %d（期望 0）\n",
           bit_test(0x80000000u, 30));
    printf("bit_test(0xF0F0F0F0, 4)  = %d（期望 1）\n",
           bit_test(0xF0F0F0F0u, 4));
    printf("bit_test(1, -1)          = %d（期望 0，越界保护）\n",
           bit_test(1u, -1));
    return 0;
}
`,
        explain: "打印顺序必须从高位到低位，否则人读起来是反的。位号 0 是最低位，位号 31 是最高位，这个约定贯穿整个项目。"
      },
      {
        n: 2,
        title: "置位、清位、翻转",
        tasks: ["实现 set_bit：x | (1u << n)", "实现 clear_bit：x & ~(1u << n)", "实现 toggle_bit：x ^ (1u << n)；三个函数都要处理 n 越界"],
        starter: String.raw`/* bittools · M2 起步：补全 set_bit / clear_bit / toggle_bit
 * 编译：gcc -std=c99 -Wall -Wextra bt2_start.c -o bt2
 */
#include <stdio.h>
#include <stdint.h>

static void print_binary(uint32_t x) {
    for (int i = 31; i >= 0; i--) {
        putchar(((x >> i) & 1u) ? '1' : '0');
        if (i > 0 && i % 8 == 0) {
            putchar(' ');
        }
    }
    putchar('\n');
}

static void print_hex(uint32_t x) {
    printf("0x%08lX\n", (unsigned long)x);
}

static int valid_bit(int n) {
    return n >= 0 && n < 32;
}

/* TODO 1：x | (1u << n)；n 越界时原样返回 x */
static uint32_t set_bit(uint32_t x, int n) {
    (void)n;
    return x;
}

/* TODO 2：x & ~(1u << n)；n 越界时原样返回 x */
static uint32_t clear_bit(uint32_t x, int n) {
    (void)n;
    return x;
}

/* TODO 3：x ^ (1u << n)；n 越界时原样返回 x */
static uint32_t toggle_bit(uint32_t x, int n) {
    (void)n;
    return x;
}

int main(void) {
    uint32_t x = 0u;

    x = set_bit(x, 0);
    x = set_bit(x, 3);
    x = set_bit(x, 7);
    printf("置位 0/3/7（TODO 完成前为 0）：");
    print_hex(x);
    print_binary(x);

    x = clear_bit(x, 3);
    x = toggle_bit(x, 7);
    printf("清 3、翻转 7：");
    print_hex(x);
    print_binary(x);
    return 0;
}
`,
        hints: ["~(1u << n) 的高位全是 1，所以 x 要用无符号类型", "越界时原样返回 x，调用者可以用返回值判断是否生效", "用 %08lX 打印 8 位十六进制，uint32_t 先转 unsigned long"],
        solution: String.raw`/* bittools · M2：置位、清位、翻转位
 * 编译：gcc -std=c99 -Wall -Wextra bt2_sol.c -o bt2
 */
#include <stdio.h>
#include <stdint.h>

static void print_binary(uint32_t x) {
    for (int i = 31; i >= 0; i--) {
        putchar(((x >> i) & 1u) ? '1' : '0');
        if (i > 0 && i % 8 == 0) {
            putchar(' ');
        }
    }
    putchar('\n');
}

static void print_hex(uint32_t x) {
    printf("0x%08lX\n", (unsigned long)x);
}

static int valid_bit(int n) {
    return n >= 0 && n < 32;
}

static uint32_t set_bit(uint32_t x, int n) {
    if (!valid_bit(n)) {
        return x;
    }
    return x | (1u << n);
}

static uint32_t clear_bit(uint32_t x, int n) {
    if (!valid_bit(n)) {
        return x;
    }
    return x & ~(1u << n);
}

static uint32_t toggle_bit(uint32_t x, int n) {
    if (!valid_bit(n)) {
        return x;
    }
    return x ^ (1u << n);
}

int main(void) {
    uint32_t x = 0u;

    x = set_bit(x, 0);
    x = set_bit(x, 3);
    x = set_bit(x, 7);
    printf("置位 0/3/7：");
    print_hex(x);
    print_binary(x);

    x = clear_bit(x, 3);
    printf("清掉第 3 位：");
    print_hex(x);
    print_binary(x);

    x = toggle_bit(x, 7);
    x = toggle_bit(x, 0);
    printf("翻转第 7、0 位：");
    print_hex(x);
    print_binary(x);

    printf("越界 set_bit(0, 32) = 0x%08lX（应保持 0）\n",
           (unsigned long)set_bit(0u, 32));
    return 0;
}
`,
        explain: "置位用 OR、清位用 AND NOT、翻转用 XOR，这是掩码操作的三件套。清位时最容易忘记取反，写成 x & (1u << n) 会得到只保留该位的结果。"
      },
      {
        n: 3,
        title: "popcount、2 的幂与循环左移",
        tasks: ["实现 popcount：循环 x &= x - 1u，统计消掉 1 的次数", "实现 is_power_of_two：x 非 0 且 (x & (x - 1u)) == 0", "实现 rotl32：先 n %= 32，n 为 0 时直接返回，否则左右拼合"],
        starter: String.raw`/* bittools · M3 起步：补全 popcount / is_power_of_two / rotl32
 * 编译：gcc -std=c99 -Wall -Wextra bt3_start.c -o bt3
 */
#include <stdio.h>
#include <stdint.h>

/* TODO 1：循环 x &= x - 1u 直到 x 为 0，统计循环次数 */
static int popcount(uint32_t x) {
    (void)x;
    return 0;
}

/* TODO 2：x 非 0 且 (x & (x - 1u)) == 0 */
static int is_power_of_two(uint32_t x) {
    (void)x;
    return 0;
}

/* TODO 3：n %= 32；n 为 0 直接返回 x；否则 (x << n) | (x >> (32 - n)) */
static uint32_t rotl32(uint32_t x, unsigned n) {
    (void)n;
    return x;
}

int main(void) {
    uint32_t samples[5] = { 0u, 1u, 0xF0F0F0F0u, 0xFFFFFFFFu, 0x80000001u };

    printf("popcount（TODO 完成前全为 0）：\n");
    for (int i = 0; i < 5; i++) {
        printf("  0x%08lX -> %d\n", (unsigned long)samples[i], popcount(samples[i]));
    }

    printf("\nis_power_of_two（TODO 完成前全为 否）：\n");
    for (int i = 0; i < 5; i++) {
        printf("  0x%08lX -> %s\n",
               (unsigned long)samples[i],
               is_power_of_two(samples[i]) ? "是" : "否");
    }

    printf("\nrotl32(0x80000001, 1) = 0x%08lX（期望 0x00000003）\n",
           (unsigned long)rotl32(0x80000001u, 1u));
    return 0;
}
`,
        hints: ["x - 1u 在 x 为 0 时会下溢，但循环条件已经排除了 0", "判断 2 的幂不要用循环除以 2，位运算一行就够", "移位次数等于或大于 32 是未定义行为，必须先取模并处理 0"],
        solution: String.raw`/* bittools · M3：popcount、2 的幂判断、循环左移
 * 编译：gcc -std=c99 -Wall -Wextra bt3_sol.c -o bt3
 */
#include <stdio.h>
#include <stdint.h>

/* Brian Kernighan 法：每轮消掉最低位的 1 */
static int popcount(uint32_t x) {
    int n = 0;

    while (x != 0u) {
        x &= x - 1u;
        n++;
    }
    return n;
}

static int is_power_of_two(uint32_t x) {
    return x != 0u && (x & (x - 1u)) == 0u;
}

/* 循环左移；先取模，n == 0 时直接返回，避免移位 32 位的未定义行为 */
static uint32_t rotl32(uint32_t x, unsigned n) {
    n %= 32u;
    if (n == 0u) {
        return x;
    }
    return (x << n) | (x >> (32u - n));
}

int main(void) {
    uint32_t samples[5] = { 0u, 1u, 0xF0F0F0F0u, 0xFFFFFFFFu, 0x80000001u };

    printf("popcount:\n");
    for (int i = 0; i < 5; i++) {
        printf("  0x%08lX -> %d\n", (unsigned long)samples[i], popcount(samples[i]));
    }

    printf("\nis_power_of_two:\n");
    for (int i = 0; i < 5; i++) {
        printf("  0x%08lX -> %s\n",
               (unsigned long)samples[i],
               is_power_of_two(samples[i]) ? "是" : "否");
    }
    printf("  1024 -> %s（期望 是）\n", is_power_of_two(1024u) ? "是" : "否");
    printf("  6    -> %s（期望 否）\n", is_power_of_two(6u) ? "是" : "否");

    printf("\nrotl32:\n");
    printf("  0x80000001 左移 1 位 -> 0x%08lX（期望 0x00000003）\n",
           (unsigned long)rotl32(0x80000001u, 1u));
    printf("  0x12345678 左移 0 位 -> 0x%08lX（期望原值）\n",
           (unsigned long)rotl32(0x12345678u, 0u));
    printf("  0x12345678 左移 32 位 -> 0x%08lX（期望原值）\n",
           (unsigned long)rotl32(0x12345678u, 32u));
    return 0;
}
`,
        explain: "x & (x - 1) 会消掉最低位的 1，这个技巧同时用于 popcount 和 2 的幂判断。循环左移与普通左移的区别是：移出去的高位会补到低端。"
      },
      {
        n: 4,
        title: "rwx 权限解析",
        tasks: ["读入八进制权限值（如 754），用 %o 或 strtoul(..., 8) 解析", "实现 print_permissions，按 owner/group/other 三组输出 rwx 或 -", "实现 has_perm/add_perm/remove_perm，用掩码 0400/0040/0004 等操作"],
        starter: String.raw`/* bittools · M4 起步：补全权限解析与修改
 * 编译：gcc -std=c99 -Wall -Wextra bt4_start.c -o bt4
 */
#include <stdio.h>
#include <stdint.h>

/* TODO 1：对 owner/group/other 三组，各打印 r/w/x 或 '-'。
 *         提示：mask = 1u << (shift + (2 - b))，shift 依次为 6、3、0。 */
static void print_permissions(unsigned mode) {
    (void)mode;
    printf("TODO\n");
}

/* TODO 2：(mode & mask) == mask 时返回 1 */
static int has_perm(unsigned mode, unsigned mask) {
    (void)mode;
    (void)mask;
    return 0;
}

/* TODO 3：mode | mask */
static unsigned add_perm(unsigned mode, unsigned mask) {
    (void)mask;
    return mode;
}

/* TODO 4：mode & ~mask */
static unsigned remove_perm(unsigned mode, unsigned mask) {
    (void)mask;
    return mode;
}

int main(void) {
    unsigned mode = 0754u;

    printf("示例 mode %03o -> ", mode);
    print_permissions(mode);

    printf("owner 可读？%s\n", has_perm(mode, 0400u) ? "是" : "否");
    printf("group 可写？%s\n", has_perm(mode, 0020u) ? "是" : "否");

    mode = add_perm(mode, 0002u);
    printf("给 other 加写权限：%03o -> ", mode);
    print_permissions(mode);

    mode = remove_perm(mode, 0002u);
    printf("再移除 other 写权限：%03o -> ", mode);
    print_permissions(mode);
    return 0;
}
`,
        hints: ["权限位：owner r=0400 w=0200 x=0100，group 右移 3 位，other 再右移 3 位", "用八进制字面量写掩码，比十六进制更直观", "scanf(\"%o\", &mode) 读八进制；mode 用 unsigned"],
        solution: String.raw`/* bittools · M4：按位解析与修改 rwx 权限
 * 编译：gcc -std=c99 -Wall -Wextra bt4_sol.c -o bt4
 * 运行：./bt4，输入八进制权限（例如 754）
 */
#include <stdio.h>
#include <stdint.h>

/* mode 的低 9 位：owner rwx = 8/7/6，group = 5/4/3，other = 2/1/0 */
static void print_permissions(unsigned mode) {
    static const char letters[3] = { 'r', 'w', 'x' };

    for (int shift = 6; shift >= 0; shift -= 3) {
        for (int b = 0; b < 3; b++) {
            unsigned mask = 1u << (shift + (2 - b));
            putchar((mode & mask) ? letters[b] : '-');
        }
    }
    putchar('\n');
}

/* mask 中的位全部为 1 才算拥有该权限 */
static int has_perm(unsigned mode, unsigned mask) {
    return (mode & mask) == mask;
}

static unsigned add_perm(unsigned mode, unsigned mask) {
    return mode | mask;
}

static unsigned remove_perm(unsigned mode, unsigned mask) {
    return mode & ~mask;
}

int main(void) {
    unsigned mode = 0u;

    printf("输入八进制权限（如 754 或 0754）：");
    fflush(stdout);
    if (scanf("%o", &mode) != 1) {
        fprintf(stderr, "输入无效：需要一个八进制数。\n");
        return 1;
    }
    mode &= 0777u;                      /* 只保留 rwx 九位 */

    printf("mode %03o -> ", mode);
    print_permissions(mode);

    printf("owner 可读？%s\n", has_perm(mode, 0400u) ? "是" : "否");
    printf("group 可写？%s\n", has_perm(mode, 0020u) ? "是" : "否");
    printf("other 可执行？%s\n", has_perm(mode, 0001u) ? "是" : "否");

    mode = add_perm(mode, 0002u);
    printf("\n给 other 加写权限：%03o -> ", mode);
    print_permissions(mode);

    mode = remove_perm(mode, 0002u);
    printf("再移除 other 写权限：%03o -> ", mode);
    print_permissions(mode);
    return 0;
}
`,
        explain: "rwx 权限是位掩码的典型应用：三位一组，每组从高到低是 r、w、x。打印时用 shift=6、3、0 定位每组，再用 1u << (shift + 2 - b) 取位。"
      }
    ],
    extension: ["用函数指针数组实现 set/clear/toggle/test 命令分发", "扩展到 uint64_t，支持任意位宽", "增加汉明距离、格雷码、位反转等练习"],
    solutionNote: "参考实现统一用 uint32_t 和 1u 移位，所有位号先做范围检查；M4 的权限掩码用八进制字面量，和 chmod 的写法一致。"
  }
  ]);
})();
