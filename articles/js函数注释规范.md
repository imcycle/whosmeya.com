# js函数注释规范

|常用符号|说明|用法|
|-|-|-|
|@param|参数|@param {type} name|
|@return|返回值|@return {type}|

```js
/**
 * 测试
 * @param {number} num
 * @return {void}
 */
function test(num) {
  console.log(num);
}
```

```js
/**
 * Enqueue a callback that will be executed after all the pending updates
 * have processed.
 *
 * @param {ReactClass} publicInstance The instance to use as `this` context.
 * @param {?function} callback Called after state is updated.
 * @param {string} callerName Name of the calling function in the public API.
 * @internal
 */
enqueueCallback: function(publicInstance, callback, callerName) {
  ReactUpdateQueue.validateCallback(callback, callerName);
  var internalInstance = getInternalInstanceReadyForUpdate(publicInstance);
  ...
}
```

```js
/**
 * Checks whether or not this composite component is mounted.
 * @param {ReactClass} publicInstance The instance we want to test.
 * @return {boolean} True if mounted, false otherwise.
 * @protected
 * @final
 */
isMounted: function(publicInstance) {
  ...
}
```

```js
/**
 * Generates root tag markup then recurses. This method has side effects and
 * is not idempotent.
 *
 * @internal
 * @param {ReactReconcileTransaction|ReactServerRenderingTransaction} transaction
 * @param {?ReactDOMComponent} the containing DOM component instance
 * @param {?object} info about the native container
 * @param {object} context
 * @return {string} The computed markup.
 */
mountComponent: function(
  transaction,
  nativeParent,
  nativeContainerInfo,
  context
) {
  this._rootNodeID = globalIdCounter++;
  this._domID = nativeContainerInfo._idCounter++;
  this._nativeParent = nativeParent;
  this._nativeContainerInfo = nativeContainerInfo;
  ...
}
```

```txt
其他
@api: 提供给第三方使用的接口
@author: 标明作者
@param: 参数
@return: 返回值
@todo: 待办
@version: 版本号
@inheritdoc: 文档继承
@property: 类属性
@property-read: 只读属性
@property-write: 只写属性
@const: 常量
@deprecated: 过期方法
@example: 示例
@final: 标识类是终态, 禁止派生
@global: 指明引用的全局变量
@static: 标识类、方法、属性是静态的
@ignore: 忽略
@internal: 限内部使用
@license: 协议
@link: 链接,引用文档等
@see: 与 link 类似, 可以访问内部方法或类
@method: 方法
@package: 命名空间
@since: 从指定版本开始的变动
@throws: 抛出异常
@uses: 使用
@var: 变量
@copyright: 版权声明
```

<br />

[whosmeya.com](https://www.whosmeya.com/)
