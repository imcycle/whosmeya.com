# CSS命名规范 - BEM

CSS 命名规范推荐使用 BEM 命名规范。

## 规范

BEM的意思就是块（block）、元素（element）、修饰符（modifier）,是由Yandex团队提出的一种前端命名方法论。这种巧妙的命名方法让你的CSS类对其他开发者来说更加透明而且更有意义。BEM命名约定更加严格，而且包含更多的信息，它们用于一个团队开发一个耗时的大项目。

BEM的命名规矩很容易记：block-name__element-name--modifier-name，也就是模块名 + 元素名 + 修饰器名。

```
.block{}
.block__element{}
.block--modifier{}
```

* .block 代表了更高级别的抽象或组件。
* .block__element 代表.block的后代，用于形成一个完整的.block的整体。
* .block--modifier 代表.block的不同状态或不同版本。

## 示例

### .block__element 示例

<img style="width: 700px;" src="https://img2020.cnblogs.com/blog/1141466/202012/1141466-20201228151820843-610187406.png" />

代码中 function 和 news 是更具体的块。className 整理后如下：

```
c-help
  c-help__header
    c-help__title
  c-help__content
    c-help__function
      c-help__page
      function__block
      function__item
      function__title
      function__datetime
    c-help__right
      c-help__news
        c-help__page
        news__block
        news__items
        news__index
        news__info
        news__title
        news__datetime
```

style层级代码如下

<img style="width: 350px;" src="https://img2020.cnblogs.com/blog/1141466/202012/1141466-20201228151845631-2092353113.png" />

.function__block 等名称虽然通用，但是加了层级后，就只能在 c-help 组件中使用，避免了污染全局。

### .block--modifier 示例

modifier 代表.block的不同状态或不同版本,也就是修饰器。

<img style="width: 600px;" src="https://img2020.cnblogs.com/blog/1141466/202012/1141466-20201228151851973-1762694019.png" />

参考
* [CSS命名规范——BEM思想（非常赞的规范）](https://blog.csdn.net/chenmoquan/article/details/17095465/) 

<br />

[whosmeya.com](https://www.whosmeya.com/)
