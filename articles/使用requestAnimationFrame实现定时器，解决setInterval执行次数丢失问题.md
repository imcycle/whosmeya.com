# 使用 requestAnimationFrame 实现定时器，解决 setInterval 执行次数丢失问题

来看这样一个场景：使用 setInterval 定时器倒计时，突然来了一个长达三秒的任务，定时器会有一次不准，两次丢失回调，导致少两次计算时间。

```js
// 在控制台上输入下面四行
var second = 0
setInterval(function() {
  console.log(`setInterval ${++second}`, new Date().getTime())
}, 1000)

// 几秒之后输入下面代码
function sleep(ms) {
  const end = new Date().getTime() + ms
  console.log('sleep start')
  while (new Date().getTime() < end) {}
  console.log('sleep end')
}
sleep(3000)
```

<img style="width: 600px;" src="https://img2020.cnblogs.com/blog/1141466/202012/1141466-20201214200707796-1727771621.png" />

如图所示，少两次回调的执行。

<br />

## requestAnimationFrame 实现定时器

requestAnimationFrame 传入一个回调函数，该回调函数会在浏览器下一次重绘之前执行，详情查看MDN文档 [window.requestAnimationFrame](https://developer.mozilla.org/zh-CN/docs/Web/API/window/requestAnimationFrame)

```js
/**
 * 设置精度定时器
 * @param {function} 回调函数
 * @param {number}   延迟时间
 * @return {number}  定时器ID
 */
function setIntervalPrecision(callback, delay) {
  // 生成并记录定时器ID
  let obj = window.interValPrecisionObj || (window.interValPrecisionObj = { num: 0 })
  obj.num++
  obj['n' + obj.num] = true
  var intervalId = obj.num
  // 开始时间
  var startTime = +new Date()
  // 已执行次数
  var count = 0
  // 延迟时间
  delay = delay || 0


  ;(function loop() {
    // 定时器被清除，则终止
    if (!obj['n' + intervalId]) return

    // 满足条件执行回调
    if (+new Date() > startTime + delay * (count + 1)) {
      count++
      callback(count)
    }

    requestAnimationFrame(loop)
  })()

  return intervalId
}

/**
 * 清除精度定时器
 * @param {number} 定时器ID
 */
function clearIntervalPrecision(intervalId) {
  if (window.interValPrecisionObj) {
    delete window.interValPrecisionObj['n' + intervalId]
  }
}
```

<br />

## 测试

```js
// 在控制台上输入下面四行
setIntervalPrecision(function(val) {
  console.log(`setIntervalPrecision ${val}`, new Date().getTime())
}, 1000)

// 几秒之后输入下面代码
function sleep(ms) {
  const end = new Date().getTime() + ms
  console.log('sleep start')
  while (new Date().getTime() < end) {}
  console.log('sleep end')
}
sleep(3000)
```

<img style="width: 600px;" src="https://img2020.cnblogs.com/blog/1141466/202012/1141466-20201214201551894-312811661.png" />

任务阻塞结束后，会瞬间执行阻塞期间需要执行次数的回调，虽然倒计时页面会卡三秒（js特性），但实际剩余秒数不会出错。

<br />

[whosmeya.com](https://www.whosmeya.com/)
