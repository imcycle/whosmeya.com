# Canvas图片处理

## 前言

__图片处理__ 在前端业务中并不陌生。例如手机自带相机拍出的照片通常好几兆，但如果只是用作头像就显然太大，需要 __图片压缩__ 后再上传服务器；再例如前段时间比较火的迎国庆换头像，就用到了 __图片与图片的合成__。本文将介绍前端常见的 Canvas 图片处理方法。

&emsp;

## 日常用到的图片处理方式都有哪些

前端日常业务的图片处理大概分为以下几种：

* 图片缩放
* 图片剪裁
* 图片与图片的合成
* 图片插入画笔（手写签名）
* 图片插入文字

__图片缩放__，__图片剪裁__，__图片与图片的合成__ 主要用了 <code>drawImage</code> 方法；  
__图片插入画笔__ 主要用了 Canvas-路径；  
__图片插入文字__ 主要用了 <code>fillText</code> 方法。

&emsp;

## 图片处理相关的 Canvas 技术

### CanvasRenderingContext2D.drawImage()

在画布上绘制图像、画布或视频。

```js
void ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
```

|参数|描述|
|-|-|
|image|规定要使用的图像、画布或视频。|
|sx|可选。开始剪切的 x 坐标位置。|
|sy|可选。开始剪切的 y 坐标位置。|
|sWidth|可选。被剪切图像的宽度|
|sHeight|可选。被剪切图像的高度。|
|dx|在画布上放置图像的 x 坐标位置。|
|dy|在画布上放置图像的 y 坐标位置。|
|dWidth|可选。要使用的图像的宽度。（伸展或缩小图像）|
|dHeight|可选。要使用的图像的高度。（伸展或缩小图像）|

&emsp;

### CanvasRenderingContext2D.fillText()

fillText() 方法在画布上绘制填色的文本。文本的默认颜色是黑色。

```js
void ctx.fillText(text, x, y [, maxWidth]);
```

|参数|描述|
|-|-|
|text|规定在画布上输出的文本。|
|x|开始绘制文本的 x 坐标位置（相对于画布）。|
|y|开始绘制文本的 y 坐标位置（相对于画布）。|
|maxWidth|可选。允许的最大文本宽度，以像素计。|

&emsp;

## 技术点讲解

### 图片缩放

```js
void ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
```

sx, sy, dx, dy 设置为 0；  
sWidth, sHeight 设置为图片宽长；  
dWidth, dHeight 设置为画布宽长；  
等比例图片缩放：根据 image 的长宽，等比例调成画布的长宽；  
不等比图片例缩放：任意的调整画布的长宽；

&emsp;

### 图片剪裁

```js
void ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
```

sx, sy, sWidth, sHeight 取其中一部分填充到画布上。

&emsp;

### 图片与图片的合成

使用多次<code>drawImage</code>会把多张图片绘制到一张画布。

__注意：__ 因为本地图片和用户图片和成会有跨域问题 所以需要添加属性 crossOrigin 为 anonymous

&emsp;

### 图片插入画笔（手写签名）

利用鼠标事件操纵 Canvas 画出路线。

1. ctx.beginPath(); // 开始
2. ctx.moveTo(e.offsetX, e.offsetY); // 设置起点
3. ctx.lineTo(e.offsetX, e.offsetY); // 移动到当前点
4. ctx.stroke(); // 绘制
5. ctx.closePath(); // 结束

事件流程：  

* mousedown 执行 1 2；  
* mousemove 执行 3 4；  
* mouseout 或 mouseup 时移除 mousemove，执行 5。

&emsp;

### 图片插入文字

```js
void ctx.fillText(text, x, y [, maxWidth]);
```

```js
var canvas = document.createElement('canvas');
canvas.width = uploadImg.width;
canvas.height = uploadImg.height;
var ctx = canvas.getContext('2d');
ctx.drawImage(uploadImg, 0, 0, canvas.width, canvas.height);  // 图片画进画布
ctx.fillStyle = "#f00"; // 设置字体颜色
ctx.font = "14px Arial";  // 设置字体大小，字体样式
ctx.fillText("我是一段文字", 10, 10);  // 插入
```

&emsp;

## 实战栗子

### 迎国庆换头像

是将用户上传的图片和本地头像框子图片合成，用到了图片缩放，图片剪裁，图片和图片的合成。

[在线演示](https://www.whosmeya.com/toys/avatar-add-frame/index.html)； [Github地址](https://github.com/whosMeya/tool/tree/master/tools/avatar-add-frame)

实现思路是

1. 新建画布；
2. 用 <code>new Image()</code> 把头像框图片处理到缓存；
3. 用户上传头像，用 <code>FileReader</code> 读出图片资源，然后用 <code>new Image()</code> 放至缓存；
4. 计算用户上传头像的中间区域， 计算坐标和长宽（取正方形）；
5. 将 用户头像 Image 用 drawImage 绘制到画布（用算好的坐标取中间区域正方形）；
6. 将 头像框 Image 用 drawImage 绘制到画布；
7. 把画布导出为图片。

头像框图片：

```js
var imgFrame = new Image();  // 头像框图
imgFrame.setAttribute("crossOrigin", 'anonymous');
imgFrame.src = imgTopPathList[imgTopPathIndex];
```

用户上传图片：

```js
// 用户上传图
var img = new Image();
// 读文件
var reader = new FileReader();
reader.onload = function (event) {
    img.src = event.target.result;
}
// input onchange
input.onchange = function (event) {
    reader.readAsDataURL(event.target.files[0]);
}
```

计算中间区域坐标（取最大中间区域）：

```js
var iw = img.width;   // 用户上传图片宽
var ih = img.height;  // 用户上传图片高
if (!iw || !ih) return;
var r = w / h;        // 目标图片宽高比

// 计算裁剪
var sx, sy, sWidth, sHeight;
if (iw / ih > r) {
sHeight = ih;
sWidth = sHeight * r;
} else {
sWidth = iw;
sHeight = sWidth / r;
}
sx = (iw - sWidth) / 2;
sy = (ih - sHeight) / 2;
```

合成：

```js
const [w, h, s] = [150, 150, 3];  // 生成图片宽,  生成图片高,  生成图片放大倍数

var canvas = document.createElement('canvas');
canvas.width = w * s;
canvas.height = h * s;
var ctx = canvas.getContext('2d');
ctx.fillStyle = '#ffffff';  // canvas 背景颜色
ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, w * s, h * s);  // canvas添加用户图
ctx.drawImage(imgTop, 0, 0, w * s, h * s);  // canvas添加头像框图

var src = canvas.toDataURL("image/png");
// src 拿到的就是合成图片的url
```

&emsp;

### 图片添加文字

上传图片，输入文字，可调整文字大小、样式、颜色、坐标。

[在线演示](https://www.whosmeya.com/toys/image-add-word/index.html); [Github地址](https://github.com/whosMeya/tool/tree/master/tools/image-add-word)

&emsp;

### 图片编辑

模仿微信截图，上传图片后，可在图片上插入矩形（开发中）、插入画笔、插入文字。

[在线演示](https://www.whosmeya.com/toys/image-edit/index.html); [Github地址](https://github.com/whosMeya/tool/tree/master/tools/image-edit)

&emsp;

&emsp;

whosmeya.
