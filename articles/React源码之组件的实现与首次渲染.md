# React源码之组件的实现与首次渲染

react: v15.0.0

本文讲 组件如何编译 以及 ReactDOM.render 的渲染过程。

<br />

## babel 的编译

babel 将 React JSX 编译成 JavaScript.

在 babel 官网写一段 JSX 代码编译结果如图：

<img style="width: 900px;" src="https://img2020.cnblogs.com/blog/1141466/202007/1141466-20200701110510613-275226880.png" />

每个标签的创建都调用了 React.createElement.

<br />

## 源码中的两种数据结构

贯穿源码，常见的两种数据结构，有助于快速阅读源码。

### ReactElement

<img style="width: 700px;" src="https://img2020.cnblogs.com/blog/1141466/202007/1141466-20200701223118807-1667124983.png" />

结构如下：

```js
{
  $$typeof  // ReactElement标识符
  type      // 组件
  key
  ref
  props     // 组件属性和children
}
```

是 React.createElement 的返回值。

### ReactComponent

ReactComponent 这个名字有点奇怪。

<img style="width: 550px;" src="https://img2020.cnblogs.com/blog/1141466/202007/1141466-20200701225856992-909218791.png" />

结构如下：

```js
{
  _currentElement    // ReactElement
  ...

  // 原型链上的方法
  mountComponent,    // 组件初次加载调用
  updateComponent,   // 组件更新调用
  unmountComponent,  // 组件卸载调用
}
```

是 ReactCompositeComponent 的 instance 类型。其余三种构造函数 ReactDOMComponent、ReactDOMTextComponent、ReactEmptyComponent 的实例结构与其相似。

<br />

## React.createElement

React.createElement 实际执行的是 ReactElement.createElement。

ReactElement.createElement 接收三个参数：

* type: string | Component
* config: 标签上的属性
* ...children: children元素集合

重点关注 type 和 props。

<img style="width: 750px;" src="https://img2020.cnblogs.com/blog/1141466/202007/1141466-20200701112819125-1454911396.png" />

然后看 ReactElement 方法，只是做了赋值动作。

<img style="width: 600px;" src="https://img2020.cnblogs.com/blog/1141466/202007/1141466-20200701113450513-1728092157.png" />

综上，我们写的代码编译后是这样的：

```js
class C extends React.Component {
  render() {
    return {
      type: "div",
      props: {
        children: this.props.value,
      },
    };
  }
}

class App extends React.Component {
  render() {
    return {
      type: "div",
      props: {
        children: [
          {
            type: "span",
            props: {
              children: "aaapppppp",
            },
          },
          "123",
          {
            type: C,
            props: {
              value: "ccc",
            },
          },
        ]
      },
    };
  }
}

ReactDOM.render(
  {
    type: App,
    props: {},
  },
  document.getElementById("root")
);
```

<br />

## ReactDOM.render

先来看下 ReactDOM.render 源码的执行过程

<img style="width: 600px;" src="https://img2020.cnblogs.com/blog/1141466/202007/1141466-20200701165005557-100283254.png" />

<br />

### instantiateReactComponent

在 _renderNewRootComponent 方法中，调用了 instantiateReactComponent，生成了的实例结构类似于 ReactComponent。

instantiateReactComponent 的参数是 node，node 的其中一种格式就是 ReactElement。

根据 node & node.type 的类型，会执行不同的方法生成实例

* ReactCompositeComponent
* ReactDOMComponent
* ReactDOMTextComponent
* ReactEmptyComponent

简化如下

```js
var instantiateReactComponent = function (node) {
  if (node === null || node === false) {
    return new ReactEmptyComponent(node);
  } else if (typeof node === 'object') {
    if (node.type === 'string') {
      return new ReactDOMComponent(node);
    } else {
      return new ReactCompositeComponent(node);
    }
  } else if (typeof node === 'string' || typeof node === 'number') {
    return new ReactDOMTextComponent(node);
  }
}
```

通过四种方式实例化后的对象基本相似

```js
var instance = {
  _currentElement: node,
  _rootNodeID: null,
  ...
}
instance.__proto__ = {
  mountComponent,
  updateComponent,
  unmountComponent,
}
```

四种 mountComponent 简化如下

#### ReactCompositeComponent

```js
mountComponent: function () {
  // 创建当前组件的实例
  this._instance = new this._currentElement.type();

  // 调用组件的 render 方法，得到组件的 renderedElement
  renderedElement = this._instance.render();

  // 调用 instantiateReactComponent,  得到 renderedElement 的实例化 ReactComponent
  this._renderedComponent = instantiateReactComponent(renderedElement);

  // 调用 ReactComponent.mountComponent
  return this._renderedComponent.mountComponent();
}
```

#### ReactDOMComponent

react 源码中，插入 container 前使用 ownerDocument、DOMLazyTree 创建和存放节点，此处为了方便理解，使用 document.createElement 模拟。

```js
mountComponent: function () {
  var { type, props } = this._currentElement;

  var element = document.createElement(type);

  if (props.children) {
    var childrenMarkups = props.children.map(function (node) {
      var instance = instantiateReactComponent(node);
      return instance.mountComponent();
    })

    element.appendChild(childrenMarkups)
  }

  return element;
}
```

#### ReactDOMTextComponent

```js
mountComponent: function () {
  return this._currentElement;
}
```

#### ReactEmptyComponent

```js
mountComponent: function () {
  return null;
}
```

<br />

### ReactDOM.render 简化

简化如下：

```js
ReactDOM.render = function (nextElement, container) {
  var nextWrappedElement = ReactElement(
    TopLevelWrapper,
    null,
    null,
    null,
    null,
    null,
    nextElement
  );

  var componentInstance = instantiateReactComponent(nextElement);

  var markup = componentInstance.mountComponent;

  container.innerHTML = markup;
}
```

<br />

## 总结

1. babel 将 JSX 语法编译成 React.createElement 形式。
2. 源码中用到了两个重要的数据结构
    * ReactElement
    * ReactComponent
3. React.createElement 将我们写的组件处理成 ReactElement 结构。
4. ReactDOM.render 传入 ReactElement 和 container, 渲染流程如下
    * 在 ReactElement 外套一层，生成新的 ReactElement
    * 实例化 ReactElement：var instance = instantiateReactComponent(ReactElement)
    * 递归生成 markup：var markup = instance.mountComponent()
    * 将 markup 插入 container：container.innerHTML = markup

<br />

[whosmeya.com](https://www.whosmeya.com/)