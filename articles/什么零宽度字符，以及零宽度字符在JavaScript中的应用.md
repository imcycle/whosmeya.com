# 什么零宽度字符，以及零宽度字符在JavaScript中的应用

先来看一段奇怪代码

<img style="width: 600px;" src="https://img2020.cnblogs.com/blog/1141466/202005/1141466-20200504212755693-548426355.png" />

上图的字符串中，只看到了3个字符，打印出的length却是10。因为这个字符串中隐藏了7个不可见零宽度字符。

<br />

## 什么是零宽度字符

一种不可打印的Unicode字符, 在浏览器等环境不可见, 但是真是存在, 获取字符串长度时也会占位置, 表示某一种控制功能的字符.

### 常见的零宽字符有哪些

```txt
零宽空格（zero-width space, ZWSP）用于可能需要换行处。
    Unicode: U+200B  HTML: &#8203;
零宽不连字 (zero-width non-joiner，ZWNJ)放在电子文本的两个字符之间，抑制本来会发生的连字，而是以这两个字符原本的字形来绘制。
    Unicode: U+200C  HTML: &#8204;
零宽连字（zero-width joiner，ZWJ）是一个控制字符，放在某些需要复杂排版语言（如阿拉伯语、印地语）的两个字符之间，使得这两个本不会发生连字的字符产生了连字效果。
    Unicode: U+200D  HTML: &#8205;
左至右符号（Left-to-right mark，LRM）是一种控制字符，用于计算机的双向文稿排版中。
    Unicode: U+200E  HTML: &lrm; &#x200E; 或&#8206;
右至左符号（Right-to-left mark，RLM）是一种控制字符，用于计算机的双向文稿排版中。
    Unicode: U+200F  HTML: &rlm; &#x200F; 或&#8207;
字节顺序标记（byte-order mark，BOM）常被用来当做标示文件是以UTF-8、UTF-16或UTF-32编码的标记。
    Unicode: U+FEFF
```

<br />

## 零宽度字符在JavaScript的应用

* 数据防爬
    将零宽度字符插入文本中,干扰关键字匹配。爬虫得到的带有零宽度字符的数据会影响他们的分析，但不会影响用户的阅读数据。
* 信息传递
    将自定义组合的零宽度字符插入文本中，用户复制后会携带不可见信息，达到传递作用。

### 使用零宽度字符加密解密

信息加密解密的思路是, 把字符串转成二进制0和1, 并用空格把字符隔开, 然后用三种零宽表示0、1、空格, 然后用第四种零宽字符拼起来; 解密反向操作即可.

代码如下:

```js
// str -> 零宽字符
function strToZeroWidth(str) {
  return str
    .split('')
    .map(char => char.charCodeAt(0).toString(2)) // 1 0 空格
    .join(' ')
    .split('')
    .map(binaryNum => {
      if (binaryNum === '1') {
        return '​'; // &#8203;
      } else if (binaryNum === '0') {
        return '‌'; // &#8204;
      } else {
        return '‍'; // &#8205;
      }
    })
    .join('‎') // &#8206;
}

// 零宽字符 -> str
function zeroWidthToStr(zeroWidthStr) {
  return zeroWidthStr
    .split('‎') // &#8206;
    .map(char => {
      if (char === '​') { // &#8203;
        return '1';
      } else if (char === '‌') { // &#8204;
        return '0';
      } else { // &#8205;
        return ' ';
      }
    })
    .join('')
    .split(' ')
    .map(binaryNum => String.fromCharCode(parseInt(binaryNum, 2)))
    .join('')
}
```

使用:

<img style="width: 600px;" src="https://user-gold-cdn.xitu.io/2020/2/18/17058ce7d000a2fa?w=1236&h=394&f=png&s=55588" />

### 过滤零宽度字符

excel表格 中经常出现零宽字符 \u202c \u202d, 上传后解析或复制到 input 就会有问题,

例如复制 <code>"‭176xxxx1115‬"</code> 到控制台获取 length 是 13 而不是 11, 实际字符串首尾都被 excel 添加了零宽字符 <code>"\u202d176xxxx1115\u202c"</code>.

所以在 excel表格 中获取到的数据一般需要先过滤.

```js
str.replace(/[\u200b-\u200f\uFEFF\u202a-\u202e]/g, "");
```

### 提取零宽度字符

如果用 零宽字符 加密信息后插入了文本中, 解密时需要先吧 零宽字符 提取出来.

```js
str.replace(/[^\u200b-\u200f\uFEFF\u202a-\u202e]/g, "");
```

&emsp;

[whosmeya.com](https://www.whosmeya.com/)
