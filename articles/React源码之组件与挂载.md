# React源码之组件与挂载

React: v15.0.0

<br />

## babel 的编译

babel 将 React JSX 编译成 JavaScript.

在 babel 官网写一段 JSX 代码编译结果如图：

<img style="width: 900px;" src="https://img2020.cnblogs.com/blog/1141466/202007/1141466-20200701110510613-275226880.png" />

每个标签的创建都调用了 React.createElement.

<br />

## React.createElement 生成 ReactElement

ReactElement 是一个类型，它的结构是 { type, props, key, ... }.

ReactDOM.render 方法的第一个参数，也就是我们根组件 App 编译后就是这种类型。

<img style="width: 900px;" src="https://img2020.cnblogs.com/blog/1141466/202007/1141466-20200701151748102-493150869.png" />

### React.createElement

React.createElement 实际执行的是 ReactElement.createElement。

ReactElement.createElement 接收三个参数：

* type: string | Component
* config: 标签上的属性
* ...children: children元素集合

重点关注 type 和 props。

<img style="width: 900px;" src="https://img2020.cnblogs.com/blog/1141466/202007/1141466-20200701112819125-1454911396.png" />

然后看 ReactElement，只是做了赋值动作。

<img style="width: 900px;" src="https://img2020.cnblogs.com/blog/1141466/202007/1141466-20200701113450513-1728092157.png" />

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

## ReactDOM.render 渲染 ReactElement

先来看下 ReactDOM.render 的流程

<img style="width: 600px;" src="https://img2020.cnblogs.com/blog/1141466/202007/1141466-20200701165005557-100283254.png" />

<br />

### instantiateReactComponent 生成 ReactComponent

在 _renderNewRootComponent 方法中，调用了 instantiateReactComponent，生成了 ReactComponent 类型的数据，这是 React 中的第二个类型。

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

四种 mountComponent 大概如下

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

### ReactDOM.render 简化版

ReactDOM.render 简化后如下：

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

源码中有两个重要的数据结构

* ReactElement
* ReactComponent
