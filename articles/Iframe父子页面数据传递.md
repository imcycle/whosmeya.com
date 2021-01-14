# Iframe 父子页面数据传递

## 发送消息

```js
otherWindow.postMessage(message, targetOrigin, [transfer]);
```

|字段|说明|
|-|-|
|otherWindow|其他窗口的引用|
|message|将要发送到其他 window的数据|
|targetOrigin|通过窗口的origin属性来指定哪些窗口能接收到消息事件，其值可以是字符串"*"（表示无限制）或者一个URI。|
|transfer|可选，是一串和message 同时传递的 Transferable 对象|

<br />

## 监听消息

```js
window.addEventListener("message", receiveMessage, false);
```

接收的消息属性有：

|字段|说明|
|-|-|
|data|从其他 window 中传递过来的对象|
|origin|调用 postMessage 时消息发送方窗口的 origin|
|source|对发送消息的窗口对象的引用|

<br />

## 安全问题

* 发送消息要设置具体的 targetOrigin ，防止消息被第三方截获（例如控制台手动修改接收方 iframe 的 src 为第三方，在第三方页面内做监听，获取到消息。）
* 接收其他网站的message，请始终使用origin和source属性验证发件人的身份

<br />

## 实现

### 父页面

```js
// 监听消息
window.addEventListener('message', function (event) {
  // 判断消息来源
  if (event.origin !== 'xxx') {
    return;
  }
  console.log(event.data)
}, false);

// 给子页面发送消息
document.getElementById('myIframe').contentWindow.postMessage({ message: '父页面传来的消息' }, 'https://xxx.com:8888');
```

### 子页面

```js
// 监听消息
window.addEventListener('message', function (event) {
  // 判断消息来源
  if (event.origin !== 'xxx') {
    return;
  }
  console.log(event.data)
}, false);

// 给父页面发送消息
window.parent.postMessage({ message: '子页面发来的消息' }, 'https://xxx.com:8888')
```

<br />

[whosmeya.com](https://www.whosmeya.com/)
