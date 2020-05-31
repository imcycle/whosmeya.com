# 从 React 架构开始讲解 useState、useEffect 编程设计

随着前端开发复杂度增加，原生开发模式显得越来越笨重，前端框架也层出不穷。

## MVC 和 MVVM

### MVC

MVC是模型(model)－视图(view)－控制器(controller)的缩写，一种软件设计典范，用一种业务逻辑、数据、界面显示分离的方法组织代码，将业务逻辑聚集到一个部件里面，在改进和个性化定制界面及用户交互的同时，不需要重新编写业务逻辑。MVC被独特的发展起来用于映射传统的输入、处理和输出功能在一个逻辑的图形化用户界面的结构中。

* Model（模型）：数据。
* View（视图）：用户界面。
* Controller（控制器）：业务逻辑。

<img style="width: 400px;" src="https://img2020.cnblogs.com/blog/1141466/202005/1141466-20200531164710921-1448368413.png" />

### MVVM

MVVM是Model-View-ViewModel的简写。它本质上就是MVC 的改进版。MVVM 就是将其中的View 的状态和行为抽象化，让我们将视图 UI 和业务逻辑分开。

采用双向绑定（data-binding）：View的变动，自动反映在 ViewModel，反之亦然。

<img style="width: 400px;" src="https://img2020.cnblogs.com/blog/1141466/202005/1141466-20200531171754251-253387413.png" />

<br />

## React Component class编程

React 是一个 用于构建用户界面的 JavaScript 库，注重于 View 层。

React Component 并没有严格的M，V区分，只是模糊的定义了几块内容：

* state： 数据存放
* render： 用户界面
* setState | forceUpdate： 渲染用户界面

所以我们的代码逻辑是这样的：

1. 定义state
2. 根据state编写render
3. render中加入事件，修改state，且渲染用户界面

以上1，2两步完成后，我们就不再需要关心render，因为render依赖state，我们只需要关心如何修改state，然后需渲染时，setState | forceUpdate就可以了。

生命周期 componentDidMount 也是很重要的，它再组件完成后只执行一次, 可以用于请求数据，然后设置state。

渲染页面（setState）：state -> view。

书写思路清晰的代码，要清晰的知道数据的流向，我们这样设计。

* 初始化阶段：框架自动渲染一次 -> componentDidMount -> 手动渲染
* 用户操作：操作 -> 修改state -> 手动渲染

总结：写好render和state对应的规则后，只需要专心与如何修改state，然后执行渲染即可。

### 例子：列表请求

请求与请求参数的分离也是代码清晰程度的重要一部分。

setState最重要的还有第二个参数，是设置成功后的回调函数。React的state可以让我们专心开发某一块，例如我们写一个列表

```js
state = {
  page: 1,
  dataList: null,
}

// 请求列表
fetchDataList = () => {
  const { page } = this.state;
  let data = '通过page参数请求得到的数据';  // 通过请求得到数据
  this.setState({ dataList: data });
}

// 翻页
handlePageChange = (page) => {
  this.setState({ page }, this.fetchDataList);
}
```

写一个请求方法，请求得到的参数完全从state中获取，得到数据后会setState渲染页面，所以我们只需要专心致志于设置state，在回调中发送请求。这样，一切都看起来那么清晰。

### 特殊使用

由于 state 是引用类型，所以我们可以使用 this.state.xx = xx 来修改数据，React 官方并不推荐此种修改方式，因为此方法并没有渲染页面，并不能直接的感受到数据的变化。

了解了 React 渲染机制后，只要清晰我们再做什么，也可以使用此种方法修改数据，并且大量能减少代码量。

例如：页面上有两个按钮，一个按钮记录此按钮点击次数，另一个按钮点击后，才会显示第一个按钮的点击次数。

使用常规setState方式，需要两个变量计数。

```js
state = {
  clickCount: 0;
  viewCount: 0;
}

btn1Click = () => {
  this.setState({clickCount: this.state.clickCount +1 });
}

btn2Click = () => {
  this.setState({viewCount: this.state.clickCount });
}

render() {
  return <div>{this.state.viewCount}</div>
}
```

如果使用隐士赋值，只需要一个变量，并且再需要渲染的时候手动渲染。

```js
state = {
  count: 0;
}

btn1Click: () => {
  this.state.count++;
}

btn2Click: () => {
  this.forceUpdate(); // 强制渲染 相当于 this.setState({})
}

render() {
  return <div>{this.state.viewCount}</div>
}
```

当然，这种方式要在对 React 渲染机制清晰后再使用。

这就体现了React的灵活性，按需渲染。

<br />

## React Hooks 函数式编程

React 16.7推出了 React Hooks 函数式编程。不用传统的类方式，写法大有不同。

首先看渲染机制，Component方式，渲染后，只执行了render方法，类里面的其他方法不会执行。而 React Hooks 函数式编程 每次渲染，都会把整个函数执行一遍，并提供了一个数据存放地 useState。

### useState

```js
// 声明一个叫 "count" 的 state 变量
const [count, setCount] = useState(0);
```

setCount 用来设置 count 并且渲染页面，且只有这一种渲染方式，这就意味着，我们不能像 Component 那样灵活的按需渲染了。

### useEffect

```js
useEffect(function () {
  // do sth..
}, [])
```

useEffect 第一个参数是一个函数，满足条件后会触发。第二个参数是个数组，如果是个空数组则只执行一次第一个参数函数（相当于componentDidMount），如果里面放变量，执行一次后，以后每次渲染后就监听变量有没有改变，如果改变就执行第一个函数。

### 与 class 方式的对比

对比 React.Component 和 React Hooks，它们都有存放数据的state，通过state渲染页面的render，和手动渲染的方法setState或者setXXX。

不同的是，React.Component有setState成功后的回调，React Hooks没有。

例如使用 React Hooks 执行下面代码

```js
setCount(2);
console.log(count);
```

count拿到的总是设置前的值。

### useState、useEffect代码设计

看到知乎上一句话：先做什么再做什么这种callback的写法是倾向于命令式,而使用hooks编写代码则更倾向于声明式.你不需要去指定你要的动作发生的时机, 而是声明一个条件或者依赖来让React来决定正确的执行时间点。

所以我们要转变思路，不要去控制何时渲染页面，因为每一次set都会渲染页面，需要的是在useEffect里写条件，让React自己决定渲染。

如请求改造如下

```js
const [page, setPage] = useEffect(1);          // 请求参数 page
const [pageSize, setPageSize] = useEffect(20); // 请求参数 pageSize
const [type, setType] = useEffect(1);          // 请求参数 type
const [dataList, setDataList] = useEffect(1);  // 请求得到的数据

useEffect(function () {
  fetchDataList();
}, [page, pageSize, type]);

const fetchDataList = function () {
  let data = '通过page pageSize type请求到的数据';
  setDataList(data);
}
```

组件第一次执行或者page，pageSize，type改变，就会请求数据，然后set新数据渲染页面。

上面代码基本上满足了我们需要，然后在极端情况下，即使请求参数改变，也不需要发请求。对此我们需要另外设置一个变量控制是否发请求。

```js
const [sendRequest, setSendRequest] = useEffect(0);  // 控制发请求

useEffect(function () {
  fetchDataList();
}, [sendRequest]);

const handlePageChange = (page) => {
  setPage(page);
  setSendRequest(Math.random());
}
```

但是这种写法还是运用了命令式，违背了React Hooks本意，不推荐。推荐规则写在useEffect中。

<br />

## 渲染优化

不管是 class 方式还是函数式编程，都需要关心一个问题：合理渲染。

class 方式在每次 setState 或者 forceUpdate 都会执行render函数渲染。

函数式编程方式 在useState中每次set新数据后，就会重新执行整个函数并渲染。

React 重要特征是，一般情况下，父组件渲染，子组件也会渲染。所以在顶层容器中，要合理渲染，尽可能的抽成更小的组件，防止不必要的渲染。

class 方式中，state只放与rander有关的变量，无关的可以放在class外，减少setState的使用。函数式编程一样，和return无关的变量可以放在函数外。

<br />

[whosmeya.com](https://www.whosmeya.com/)
