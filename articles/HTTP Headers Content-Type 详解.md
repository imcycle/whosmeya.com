# HTTP Headers Content-Type 详解

Content-Type 实体头部用于指示资源的 MIME 类型 media type 。

## 语法

```
Content-Type: text/html; charset=utf-8
Content-Type: multipart/form-data; boundary=something
```

|参数|说明|
|-|-|
|media-type|资源或数据的 MIME type |
|charset|字符编码标准|
|boundary|boundary|

### 常见 media-type

* text/plain
* application/json
* application/x-www-form-urlencoded
* multipart/form-data

## 几种请求设置 Content-Type 的方式

### XMLHttpRequest

```js
var xmlhttp = new XMLHttpRequest();
xmlhttp.open('POST', 'https://xxx.xxx.com/xxx', true);
xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
xmlhttp.send('a=1&b=2');
```

```js
var xmlhttp = new XMLHttpRequest();
xmlhttp.open('POST', 'https://xxx.xxx.com/xxx', true);
xmlhttp.setRequestHeader('Content-Type', 'application/json');
xmlhttp.send(JSON.stringify({ a: 1, b: 1 }));
```

### JQuery.ajax

```js
$.ajax({
  type: 'post',
  url: 'https://xxx.xxx.com/xxx',
  contentType: 'application/x-www-form-urlencoded',
  data: { a: 1, b: 1 }, // ajax 会自动转成 a=1&b=2
  success: function () { },
})
```

```js
$.ajax({
  type: 'post',
  url: 'https://xxx.xxx.com/xxx',
  contentType: 'application/json',
  data: JSON.stringify({ a: 1, b: 1 }),
  success: function () { },
})
```

JQuery.ajax 本质是封装 XMLHttpRequest , contentType 即 content-type , 默认 application/x-www-form-urlencoded 。

#### 注意

* data 如果不是 string , 会使用 jQuery.param 转换成 = & 拼接的 search 格式，然后用 xml.send 方法发送。 
* dataType 预期服务器返回的数据类型。会通过下面对象转换后插入 accept。

```js
accepts: {
	"*": allTypes,
	text: "text/plain",
	html: "text/html",
	xml: "application/xml, text/xml",
	json: "application/json, text/javascript"
},
```

### Fetch

```js
fetch('https://xxx.xxx.com/xxx', {
  method: 'post',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: 'a=1&b=2',
})
```

```js
fetch('https://xxx.xxx.com/xxx', {
  method: 'post',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ a: 1, b: 1 }),
})
```

## 三种数据传输方式

### Query String Parameters

从问号 (?) 开始的 URL（查询部分）。

<img style="width: 500px;" src="https://img2020.cnblogs.com/blog/1141466/202102/1141466-20210219141801720-1610016767.png" />

### Form Data

application/x-www-form-urlencoded

<img style="width: 500px;" src="https://img2020.cnblogs.com/blog/1141466/202102/1141466-20210219141630139-1070442357.png" />

### Request Payload

application/json

<img style="width: 500px;" src="https://img2020.cnblogs.com/blog/1141466/202102/1141466-20210219141546352-1571307972.png" />
