# JavaScript设计模式学习

学习《JavaScript设计模式与开发实践》。

* <a href="#Singleton">单例模式</a>
* <a href="#Strategy">策略模式</a>
* <a href="#Proxy">代理模式</a>
* <a href="#Iterator">迭代器模式</a>
* <a href="#Observer">发布-订阅模式</a>
* <a href="#Command">命令模式</a>
* <a href="#Composite">组合模式</a>
* <a href="#Template">模板方法模式</a>
* <a href="#Flyweight">享元模式</a>
* <a href="#ChainOfResponsibility">职责链模式</a>
* <a href="#Mediator">中介者模式</a>
* <a href="#Decorator">装饰者模式</a>
* <a href="#State">状态模式</a>
* <a href="#Adapter">适配器模式</a>

## <span id="Singleton">单例模式</span>

保证一个类仅有一个实例，并提供一个全局访问点。

```js
// 构造函数
var Singleton = function (name) {
  this.name = name;
}
Singleton.prototype.getName = function () {
  alert(this.name);
}

// 方案1 绑定到构造函数上
Singleton.instance = null;
Singleton.getInstance = function (name) {
  if (!this.instance) {
    this.instance = new Singleton(name);
  }
  return this.instance;
}

// 方案2 闭包
Singleton.getInstance = (function () {
  var instance = null;
  return function (name) {
    if (!instance) {
      instance = new Singleton(name);
    }
    return instance;
  }
})()
```

### 惰性单例

需要的时候才创建对象实例

```js
var getSingle = function (fn) {
  var result;
  return function () {
    return result || (result = fn.apply(this, arguments));
  }
}
```

例如一个Modal弹框，页面加载时不需要创建，按钮点击后才会被创建。以后再点击按钮不需要创建新的Modal。

```js
var createModal = function () {
  var div = document.createElement('div');
  div.style.display = 'none';
  document.body.append(div);
  return div;
}

createSingleModal = getSingle(createModal);

btn.click = function () {
  var modal = createSingleModal();
  modal.style.display = 'block';
}
```

<br />

## <span id="Strategy">策略模式</span>

定义一系列算法，把它们一个个封装起来，并且使它们可以互相替换。在实际开发中，我们通常会把算法的含义扩散开来，使用策略模式也可以用来封装一系列目标一致的‘业务规则’。

例如计算年终奖：

```js
var strategies = {
  "S": function (salary) {
    return salary * 4;
  },
  "A": function (salary) {
    return salary * 3;
  },
  "B": function (salary) {
    return salary * 2;
  },
}
var calculateBonus = function (level, salary) {
  return strategies[level](salary);
}

calculateBonus('S', 20000);  // 80000
calculateBonus('A', 10000);  // 30000
```

<br />

## <span id="Proxy">代理模式</span>

顾名思义，代理。

虚拟代理吧一些开销很大的对象，延迟到真正需要他的时候才去创建。

虚拟代理实现图片预加载

```js
var myImage = (function () {
  var imgNode = document.createElement('img');
  document.body.append(imgNode);

  return function (src) {
    imgNode.src = src;
  }
})()

// 代理 myImage，实现预加载
var proxyImage = (function () {
  var img = new Image();

  img.onload = function () {
    myImage(this.src);
  }

  return function (src) {
    myImage('./loading.gif');
    img.src = src;
  }
})()

proxyImage('http://xxx.10M.png');

```

JavaScript 开发中最常用的是虚拟代理和缓存代理。

<br />

## <span id="Iterator">迭代器模式</span>

实现迭代器(内部迭代器)

```js
var each = function (arr, callback) {
  for (var i = 0; i < arr.length; i++) {
    if (callback.call(arr[i], arr[i], i) === false) {
      break;
    }
  }
}

each([1, 2, 3, 4, 5], function (item, index) {
  if (index > 3) {
    return false;
  }
  console.log(item, index);
})
```

外部迭代器

```js
var Iterator = function (obj) {
  var current = 0;
  var next = function () {
    current += 1;
  };

  var isDone = function () {
    return current >= obj.length;
  };

  var getCurrItem = function () {
    return obj[current];
  };

  return {
    next: next,
    isDone: isDone,
    getCurrItem: getCurrItem,
    length: obj.length,
  }
}
```

<br />

## <span id="Observer">发布-订阅模式</span>

定义对象间的一种一对多的依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都将得到通知。

```js
var event = {
  clientList: {},
  listen: function (key, fn) {
    if (!clientList[key]) {
      clientList[key] = [];
    }

    clientList[key].push(fn);
  },
  trigger: function () {
    var key = Array.prototype.shift.apply(arguments),
      fns = this.clientList[key];

    if (!fns || fns.length === 0) {
      return false;
    }

    for (var i = 0; i < fns.length; i++) {
      fns[i].apply(this, arguments);
    }
  },
  remove: function (key, fn) {
    var fns = this.clientList[key];

    if (!fns || fns.length === 0) {
      return false;
    }

    if (!fn) {
      this.clientList = [];
    } else {
      for (var i = 0; i < fns.length; i++) {
        if (fn === fns[i]) {
          fns.splice(i, 1);
        }
      }
    }

  },
}
```

DOM事件也是发布-订阅模式。

<br />

## <span id="Command">命令模式</span>

命令模式把代码封装成命令，目的解藕。

命令模式有 接收者receiver，执行方法execute；execute 去执行 receiver.xxx()。

```js
var setCommand = function (button, command) {
  button.onClick = function () {
    command.execute();
  }
}

var MenuBar = {
  refresh: function () {
    console.log('刷新菜单')
  }
}

var RefreshMenuBarCommand = function (receiver) {
  this.receiver = receiver;
}

RefreshMenuBarCommand.prototype.execute = function () {
  this.receiver.refresh();
}

var refreshMenuBarCommand = new RefreshMenuBarCommand(MenuBar);

setCommand(btn, refreshMenuBarCommand);
```

JavaScript 中的命令模式未必要使用面向对象:

```js
var setCommand = function (button, command) {
  button.onClick = function () {
    command.execute();
  }
}

var MenuBar = {
  refresh: function () {
    console.log('刷新菜单');
  }
}

var RefreshMenuBarCommand = function (receiver) {
  return {
    execute: function () {
      receiver.refresh();
    }
  }
}

var refreshMenuBarCommand = RefreshMenuBarCommand(MenuBar);

setCommand(btn, refreshMenuBarCommand);

```

JavaScript 中命令模式还可以不需要接收者：

```js
var refreshMenuBarCommand = {
  execute: function () {
    console.log('刷新菜单');
  }
};
```

这样看起来代码结构和策略模式非常相近，但他们的意图不同，策略模式的策略对象的目标总是一致的，命令模式的目标更具散发性，命令模式还可以完成撤销，排队等功能。

<br />

## <span id="Composite">组合模式</span>

组合模式中有两个名词：组合对象，叶对象。

结构如图

<img style="width: 400px;" src="https://img2020.cnblogs.com/blog/1141466/202005/1141466-20200523201739299-1337580236.png" />

组合模式的例子-扫描文件夹

```js
// Folder
var Folder = function (name) {
  this.name = name;
  this.parent = null;
  this.files = [];
};

Folder.prototype.add = function (file) {
  file.parent = this;
  this.files.push(file);
};

Folder.prototype.remove = function () {
  if (!this.parent) {
    return;
  }

  for (var files = this.parent.files, i = 0; i < files.length; i++) {
    var file = files[i];
    if (file === this) {
      files.splice(i, 1);
      break;
    }
  }
};

Folder.prototype.scan = function () {
  console.log('开始扫描文件夹：' + this.name);
  for (var i = 0; i < this.files.length; i++) {
    var file = this.files[i];
    file.scan();
  }
};

// File
var File = function (name) {
  this.name = name;
  this.parent = null;
};

File.prototype.add = function () {
  throw new Error('文件夹下面不能在添加文件');
};

Folder.prototype.remove = function () {
  if (!this.parent) {
    return;
  }

  for (var files = this.parent.files, i = 0; i < files.length; i++) {
    var file = files[i];
    if (file === this) {
      files.splice(i, 1);
      break;
    }
  }
};

File.prototype.scan = function () {
  console.log('开始扫描文件：' + this.name);
};

// 测试
var folder = new Folder('学习资料');
var folder1 = new Folder('JavaScript');
folder1.add(new File('JavaScript设计模式与开发实践'));
folder.add(folder1);
folder.add(new File('深入浅出Node.js'));

console.log('第一次扫描');
folder.scan();


folder1.remove();
console.log('第二次扫描');
folder.scan();
```

<br />

## <span id="Template">模板方法模式</span>

<br />

## <span id="Flyweight">享元模式</span>

享元模式是一种用于性能优化的模式，核心是运用共享技术来有效支持大量细粒度的对象。

__内部状态__ 储存于共享对象内部，而 __外部状态__ 储存于共享对象的外部，在必要时被传入共享对象来组装成一个完整的对象。

上传文件的例子

下面代码同时选择 2000 个文件时，会 new 2000 个 upload 对象。

```js
var id = 0;

window.startUpload = function (uploadType, files) {  // uploadType 区分是控件还是 flash
  for (var i = 0; i < files.length; i++) {
    var file = files[i];
    var uploadObj = new Upload(uploadType, file.fileName, file.fileSize);
    uploadObj.init(id++);
  }
};

var Upload = function (uploadType, fileName, fileSize) {
  this.uploadType = uploadType;
  this.fileName = fileName;
  this.fileSize = fileSize;
  this.dom = null;
};

Upload.prototype.init = function (id) {
  var that = this;
  this.id = id;
  this.dom = document.createElement('div');
  this.dom.innerHTML = '<span>文件名称：' + this.fileName + '，文件大小：' + this.fileSize + '</span>' + '<button class="delFile">删除</button>';
  this.dom.querySelector('.delFile').onclick = function () {
    that.delFile();
  }
  document.body.appendChild(this.dom);
};

Upload.prototype.delFile = function () {
  if (this.fileSize < 3000) {
    return this.dom.parentNode.removeChild(this.dom);
  }

  if (window.confirm('确定删除该文件吗？' + this.fileName)) {
    return this.dom.parentNode.removeChild(this.dom);
  }
};

// 上传
startUpload('plugin', [
  { fileName: '1.txt', fileSize: 1000 },
  { fileName: '2.txt', fileSize: 3000 },
  { fileName: '3.txt', fileSize: 5000 },
]);
startUpload('flash', [
  { fileName: '4.txt', fileSize: 1000 },
  { fileName: '5.txt', fileSize: 3000 },
  { fileName: '6.txt', fileSize: 5000 },
]);
```

享元模式重构文件上传

```js
var Upload = function (uploadType) {
  this.uploadType = uploadType;
};

Upload.prototype.delFile = function (id) {
  uploadManager.setExternalState(id, this);

  if (this.fileSize < 3000) {
    return this.dom.parentNode.removeChild(this.dom);
  }

  if (window.confirm('确定删除该文件吗？' + this.fileName)) {
    return this.dom.parentNode.removeChild(this.dom);
  }
};

var UploadFactory = (function () {
  var createdFlyWeightObjs = {};

  return {
    create: function (uploadType) {
      if (createdFlyWeightObjs[uploadType]) {
        return createdFlyWeightObjs[uploadType];
      }

      return createdFlyWeightObjs[uploadType] = new Upload(uploadType);
    }
  }
})();

var uploadManager = (function () {
  var uploadDatabase = {};

  return {
    add: function (id, uploadType, fileName, fileSize) {
      var flyWeightObj = UploadFactory.create(uploadType);

      var dom = document.createElement('div');
      dom.innerHTML = '<span>文件名称：' + fileName + '，文件大小：' + fileSize + '</span>' + '<button class="delFile">删除</button>';

      dom.querySelector('.delFile').onclick = function () {
        flyWeightObj.delFile(id);
      };

      document.body.appendChild(dom);

      uploadDatabase[id] = {
        fileName: fileName,
        fileSize: fileSize,
        dom: dom,
      };

      return flyWeightObj;
    },
    setExternalState: function (id, flyWeightObj) {
      var uploadData = uploadDatabase[id];
      for (var key in uploadData) {
        flyWeightObj[key] = uploadData[key];
      }
    }
  }
})();

var id = 0;

window.startUpload = function (uploadType, files) {
  for (var i = 0; i < files.length; i++) {
    var file = files[i];
    var uploadObj = uploadManager.add(++this.id, uploadType, file.fileName, file.fileSize);
  }
};

// 上传
startUpload('plugin', [
  { fileName: '1.txt', fileSize: 1000 },
  { fileName: '2.txt', fileSize: 3000 },
  { fileName: '3.txt', fileSize: 5000 },
]);
startUpload('flash', [
  { fileName: '4.txt', fileSize: 1000 },
  { fileName: '5.txt', fileSize: 3000 },
  { fileName: '6.txt', fileSize: 5000 },
]);
```

享元模式重构后，无论上传多少次，Upload 对象（内部状态）的数量一直是 2。

<br />

## <span id="ChainOfResponsibility">职责链模式</span>

<br />

## <span id="Mediator">中介者模式</span>

<br />

## <span id="Decorator">装饰者模式</span>

<br />

## <span id="State">状态模式</span>

<br />

## <span id="Adapter">适配器模式</span>

<br />
