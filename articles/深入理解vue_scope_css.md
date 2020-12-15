# 深入理解 Vue Scope CSS 以及深度作用选择器

当 style 标签有 [scoped](https://vue-loader.vuejs.org/zh/guide/scoped-css.html) 属性时，它的 CSS 只作用于当前组件中的元素。编译后代码如下：

```vue
<style>
.example[data-v-f3f3eg9] {
  color: red;
}
</style>

<template>
  <div class="example" data-v-f3f3eg9>hi</div>
</template>
```

原理是使用 css 的属性选择器，在标签上设置了 data-v-xxx 属性，然后 .classname[data-v-xxx] 找到对应样式。

<br />

## 子组件

使用 scoped 后，父组件的样式将不会渗透到子组件中。不过一个子组件的根节点会同时受其父组件的 scoped CSS 和子组件的 scoped CSS 的影响。这样设计是为了让父组件可以从布局的角度出发，调整其子组件根元素的样式。

<img style="width: 450px;" src="https://img2020.cnblogs.com/blog/1141466/202012/1141466-20201215131512430-1659780441.png" />

编译后 classname 添加了当前组件的选择器，导致组件内获取不到样式。

<br />

## 深度作用选择器

使用 lang="scss" 的嵌套语法编译结果：

<img style="width: 750px;" src="https://img2020.cnblogs.com/blog/1141466/202012/1141466-20201209214424958-997665358.png" />

如果你希望 scoped 样式中的一个选择器能够作用得“更深”，例如影响子组件，你可以使用 >>> /deep/ ::v-deep 操作符，scope 会添加到操作符的上一个节点，这样下层就能获取到样式。

<br />

[whosmeya.com](https://www.whosmeya.com/)
