# JavaScript设计模式学习

《JavaScript设计模式与开发实践》14种设计模式学习笔记。

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

当直接访问本体不方便或者不符合需要时，为这个本体提供一个替代者。

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

迭代器模式是指提供一种方法顺序访问一个聚合对象中的各个元素，而又不需要暴露该对象的内部表示。

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

模板方法模式是一种只需使用继承就可以实现的非常简单的模式。

模板方法模式由两部分结构组成，第一部分是抽象父类，第二部分是具体的实现子类。

假如我们有一些平行的子类，各个子类之间有一些相同的行为，也有一些不同的行为。如果 相同和不同的行为都混合在各个子类的实现中，说明这些相同的行为会在各个子类中重复出现。 但实际上，相同的行为可以被搬移到另外一个单一的地方，模板方法模式就是为解决这个问题而 生的。在模板方法模式中，子类实现中的相同部分被上移到父类中，而将不同的部分留待子类来 实现。这也很好地体现了泛化的思想。

例子：咖啡与茶

先泡一杯咖啡

1. 把水煮沸
2. 用沸水冲泡咖啡
3. 把咖啡倒进杯子
4. 加糖和牛奶

```js
var Coffee = function () { };
Coffee.prototype.boilWater = function () {
  console.log('把水煮沸');
};
Coffee.prototype.brewCoffeeGriends = function () {
  console.log('用沸水冲泡咖啡');
};
Coffee.prototype.pourInCup = function () {
  console.log('把咖啡倒进杯子');
};
Coffee.prototype.addSugarAndMilk = function () {
  console.log('加糖和牛奶');
};
Coffee.prototype.init = function () {
  this.boilWater();
  this.brewCoffeeGriends();
  this.pourInCup();
  this.addSugarAndMilk();
};
var coffee = new Coffee();
coffee.init();
```

泡一壶茶

1. 把水煮沸
2. 用沸水浸泡茶叶
3. 把茶水倒进杯子
4. 加柠檬

```js
var Tea = function () { };
Tea.prototype.boilWater = function () {
  console.log('把水煮沸');
};
Tea.prototype.steepTeaBag = function () {
  console.log('用沸水浸泡茶叶');
};
Tea.prototype.pourInCup = function () {
  console.log('把茶水倒进杯子');
};
Tea.prototype.addLemon = function () {
  console.log('加柠檬');
};
Tea.prototype.init = function () {
  this.boilWater();
  this.steepTeaBag();
  this.pourInCup();
  this.addLemon();
};
var tea = new Tea();
tea.init();
```

分离出共同点

1. 把水煮沸
2. 用沸水冲泡饮料
3. 把饮料倒进杯子
4. 加调料

```js
var Beverage = function () { };
Beverage.prototype.boilWater = function () {
  console.log('把水煮沸');
};
Beverage.prototype.brew = function () { };  // 空方法，应该由子类重写
Beverage.prototype.pourInCup = function () { };  // 空方法，应该由子类重写
Beverage.prototype.addCondiments = function () { };  // 空方法，应该由子类重写
Beverage.prototype.init = function () {
  this.boilWater();
  this.brew();
  this.pourInCup();
  this.addCondiments();
};
```

创建Coffee子类

```js
var Coffee = function () { };
Coffee.prototype = new Beverage();
Coffee.prototype.brew = function () {
  console.log('用沸水冲泡咖啡');
};
Coffee.prototype.pourInCup = function () {
  console.log('把咖啡倒进杯子');
};
Coffee.prototype.addCondiments = function () {
  console.log('加糖和牛奶');
};
var coffee = new Coffee();
coffee.init();
```

创建Tea子类

```js
var Tea = function () { };
Tea.prototype = new Beverage();
Tea.prototype.brew = function () {
  console.log('用沸水浸泡茶叶');
};
Tea.prototype.pourInCup = function () {
  console.log('把茶倒进杯子');
};
Tea.prototype.addCondiments = function () {
  console.log('加柠檬');
};
var tea = new Tea();
tea.init();
```

Beverage.prototype.init 被称为模板方法的原因是，该方法中封装了子类的算法框架，它作 为一个算法的模板，指导子类以何种顺序去执行哪些方法。在 Beverage.prototype.init 方法中， 算法内的每一个步骤都清楚地展示在我们眼前。

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

使多个对象都有机会处理请求，从而避免请求的发送者和接收者之间的耦合关系，将这些对象连成一条链，并沿着这条链传递该请求，直到有一个对象处理它为止。

```js
var order500 = function (orderType, pay, stock) {
  if (orderType === 1 && pay === true) {
    console.log('500 元定金预购，得到 100 优惠券');
  } else {
    return 'nextSuccessor';
  }
};

var order200 = function (orderType, pay, stock) {
  if (orderType === 2 && pay === true) {
    console.log('200 元定金预购，得到 50 优惠券');
  } else {
    return 'nextSuccessor';
  }
};

var orderNormal = function (orderType, pay, stock) {
  if (stock > 0) {
    console.log('普通购买，无优惠券');
  } else {
    console.log('手机库存不足');
  }
};

var Chain = function (fn) {
  this.fn = fn;
  this.successor = null;
};
Chain.prototype.setNextSuccessor = function (successor) {
  return this.successor = successor;
};

Chain.prototype.passRequest = function () {
  var ret = this.fn.apply(this, arguments);
  if (ret === 'nextSuccessor') {
    return this.successor && this.successor.passRequest.apply(this.successor, arguments);
  }
  return ret;
};

var chainOrder500 = new Chain(order500);
var chainOrder200 = new Chain(order200);
var chainOrderNormal = new Chain(orderNormal);

chainOrder500.setNextSuccessor(chainOrder200);
chainOrder200.setNextSuccessor(chainOrderNormal);

// 使用
chainOrder500.passRequest(1, true, 500); // 输出:500 元定金预购，得到 100 优惠券
chainOrder500.passRequest(2, true, 500); // 输出:200 元定金预购，得到 50 优惠券
chainOrder500.passRequest(3, true, 500); // 输出:普通购买，无优惠券
chainOrder500.passRequest(1, false, 0);  // 输出:手机库存不足
```

用 AOP 实现指责链

```js
Function.prototype.after = function (fn) {
  var self = this;
  return function () {
    var ret = self.apply(this, arguments);
    if (ret === 'nextSuccessor') {
      return fn.apply(this, arguments);
    }

    return ret;
  }
};

var order = order500.after(order200).after(orderNormal);

order(1, true, 500);   // 输出:500 元定金预购，得到 100 优惠券
order(2, true, 500);   // 输出:200 元定金预购，得到 50 优惠券
order(1, false, 500);  // 输出:普通购买，无优惠券
```

<br />

## <span id="Mediator">中介者模式</span>

中介者模式的作用就是解除对象与对象之间的紧耦合关系。增加一个中介者对象后，所有的 相关对象都通过中介者对象来通信，而不是互相引用，所以当一个对象发生改变时，只需要通知 中介者对象即可。

<img style="width: 280px;" src="https://img2020.cnblogs.com/blog/1141466/202005/1141466-20200527005405247-1973717765.png" />

变成了

<img style="width: 280px;" src="https://img2020.cnblogs.com/blog/1141466/202005/1141466-20200527005513149-976250136.png">
<br />

## <span id="Decorator">装饰者模式</span>

为对象动态加入行为。装饰者模式经常会形成一条长长的装饰链。

面向对象装饰者模式

```js
// 原始的飞机类
var Plane = function () { }
Plane.prototype.fire = function () {
  console.log('发射普通子弹');
};

// 接下来增加两个装饰类，分别是导弹和原子弹:
var MissileDecorator = function (plane) {
  this.plane = plane;
};
MissileDecorator.prototype.fire = function () {
  this.plane.fire();
  console.log('发射导弹');
};
var AtomDecorator = function (plane) {
  this.plane = plane;
};
AtomDecorator.prototype.fire = function () {
  this.plane.fire();
  console.log('发射原子弹');
};

// 运行
var plane = new Plane();
plane = new MissileDecorator(plane);
plane = new AtomDecorator(plane);
plane.fire();
// 分别输出: 发射普通子弹、发射导弹、发射原子弹
```

JavaScript 装饰者模式

```js
var plane = {
  fire: function () {
    console.log('发射普通子弹');
  }
};

var missileDecorator = function () {
  console.log('发射导弹');
};

var atomDecorator = function () {
  console.log('发射原子弹');
};

var fire1 = plane.fire;
plane.fire = function () {
  fire1();
  missileDecorator();
};

var fire2 = plane.fire;
plane.fire = function () {
  fire2();
  atomDecorator();
};

plane.fire();
// 分别输出: 发射普通子弹、发射导弹、发射原子弹
```

<br />

## <span id="State">状态模式</span>

状态模式的关键是区分事物内部的状态，事物内部状态的改变往往会带来事物的行为改变。

例子：电灯的 弱光、强光、关灯 切换。

```js
// OffLightState:
var OffLightState = function (light) {
  this.light = light;
};
OffLightState.prototype.buttonWasPressed = function () {
  console.log('弱光'); // offLightState 对应的行为
  this.light.setState(this.light.weakLightState);  // 切换状态到 weakLightState
};

// WeakLightState:
var WeakLightState = function (light) {
  this.light = light;
};
WeakLightState.prototype.buttonWasPressed = function () {
  console.log('强光'); // weakLightState 对应的行为
  this.light.setState(this.light.strongLightState);  // 切换状态到 strongLightState
};

// StrongLightState:
var StrongLightState = function (light) {
  this.light = light;
};
StrongLightState.prototype.buttonWasPressed = function () {
  console.log('关灯'); // strongLightState 对应的行为
  this.light.setState(this.light.offLightState);  // 切换状态到 offLightState
};

var Light = function () {
  this.offLightState = new OffLightState(this);
  this.weakLightState = new WeakLightState(this);
  this.strongLightState = new StrongLightState(this);
  this.button = null;
};

Light.prototype.init = function () {
  var button = document.createElement('button'),
    self = this;

  this.button = document.body.appendChild(button);
  this.button.innerHTML = '开关';

  this.currState = this.offLightState; // 设置当前状态

  this.button.onclick = function () {
    self.currState.buttonWasPressed();
  }
};

Light.prototype.setState = function (newState) {
  this.currState = newState;
};

var light = new Light();
light.init();
```

<br />

## <span id="Adapter">适配器模式</span>

适配器模式的作用是解决两个软件实体间的接口不兼容的问题。

```js
var googleMap = {
  show: function () {
    console.log('开始渲染谷歌地图');
  }
};
var baiduMap = {
  display: function () {
    console.log('开始渲染百度地图');
  }
};

// 添加百度地图适配器
var baiduMapAdapter = {
  show: function () {
    return baiduMap.display();
  }
};

renderMap(googleMap);  // 输出:开始渲染谷歌地图
renderMap(baiduMapAdapter);  // 输出:开始渲染百度地图
```

<br />

## 总结

* <a href="#Singleton">单例模式</a>：保证一个类仅有一个实例，并提供一个访问它的全局访问点。
* <a href="#Strategy">策略模式</a>：封装一系列目标一致的‘业务规则’。
* <a href="#Proxy">代理模式</a>：当直接访问本体不方便或者不符合需要时，为这个本体提供一个替代者。
* <a href="#Iterator">迭代器模式</a>：迭代器模式是指提供一种方法顺序访问一个聚合对象中的各个元素，而又不需要暴露该对象的内部表示。
* <a href="#Observer">发布-订阅模式</a>：定义对象间的一种一对多的依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都将得到通知。
* <a href="#Command">命令模式</a>：代码封装成命令，目的解藕。
* <a href="#Composite">组合模式</a>：组合对象-叶对象结构。
* <a href="#Template">模板方法模式</a>：抽象父类，具体的实现子类。
* <a href="#Flyweight">享元模式</a>：一种用于性能优化的模式，核心是运用共享技术来有效支持大量细粒度的对象。
* <a href="#ChainOfResponsibility">职责链模式</a>：使多个对象都有机会处理请求，当前不能解决则抛给下一个。
* <a href="#Mediator">中介者模式</a>：解除对象与对象之间的紧耦合关系，使多对多变成了一对多。
* <a href="#Decorator">装饰者模式</a>：为对象动态加入行为。装饰者模式经常会形成一条长长的装饰链。
* <a href="#State">状态模式</a>：状态改变，行为改变。
* <a href="#Adapter">适配器模式</a>：解决两个软件实体间的接口不兼容的问题。

<br />

[whosmeya.com](https://www.whosmeya.com/)
