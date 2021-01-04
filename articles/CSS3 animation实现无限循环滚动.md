# CSS3 animation 实现无限循环滚动

内容区域重复一份，使用 animation 平移，平移结束后瞬间切回原始状态。达到无线循环滚动的效果。

## 预览

[在线预览](https://www.whosmeya.com/toys/animation-infinite-rolling/index.html)

## 实现

```html
<div class="father">
  <div class="son">
    <div>123</div>
    <div>123</div>
    <div>123</div>
    <div>123</div>
    <div>123</div>
  </div>
  <div class="son">
    <div>123</div>
    <div>123</div>
    <div>123</div>
    <div>123</div>
    <div>123</div>
  </div>
</div>
```

```css
@keyframes rowup {
  0% {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }

  100% {
    -webkit-transform: translate3d(0, -120px, 0);
    transform: translate3d(0, -120px, 0);
  }
}

.father {
  height: 120px;
  overflow: hidden;
  border: 1px solid #000;
}

.son {
  height: 120px;
  border: 1px solid #000;
  box-sizing: border-box;

  -webkit-animation: 2s rowup linear infinite normal;
  animation: 2s rowup linear infinite normal;
}
```

<br />

[whosmeya.com](https://www.whosmeya.com/)
