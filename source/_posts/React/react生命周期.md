---
title: react生命周期
date: 2020-12-18 19:31:09
tags: 
  - react

categories: 
  - React
---

## react生命周期：

生命周期函数是自动执行的，具体某个生命周期想干什么，需要我们自己去写



## react组件的生命周期过程

![img](https://img-blog.csdnimg.cn/img_convert/376b440b163aa510e17258a6a0213b31.png)![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)

### 常用生命周期：

1.constructor（构造函数）

2.getDerive的StateFromProps

```javascript
static getDerivedStateFromProps(props, state)
```

![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)

 getDerive的StateFromProp会在render方法前调用，并且在初始挂在及后续更新时都会被调用，它应返回一个对象来更新state，如果返回null则不返回任何值。

state的值在任何时候都取决于props。

3.shouldComponentUpdate

```javascript
shouldComponentUpdate(nextProps,nextState)
```

![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)

根据shouldComponentUpdate()的返回值，判断react组件的输出是否受当前state或props更改的影响。默认行为是state每次发生变化组件都回重新渲染。大部分情况下，应遵循默认行为。

当props或state发生变化时，shouldComponentUpdate()会在渲染执行前被调用。首次渲染或使用forceUpdate()时不会调用该方法。

4.render： 当render被调用时，会检查this.props和this.state的变化并返回虚拟dom。

5.getSnapshotBeforeUpdate

```javascript
getSnapshotBeforeUpdate(prevProps,prevState)
```

![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)

getSnapshotBeforeUpdate()在最近一次渲染输出前调用。它使组件能在发生改变前从dom捕获一些信息。此生命周期的任何返回值将作为参数传递给componentDidUpdate()。

6.componentDidMount

```javascript
componentDidMount()
```

![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)

componentDidMount()会在组件挂载后立即调用。此处是实例化请求的好地方

可以在componentDidMount()里**直接调用setState()。**它将触发额外渲染，但此渲染发生在浏览器更新屏幕之前。保证了即使在render()两次调用的情况下，用户也不会看到中间状态。谨慎使用该模式，因为它可能会导致性能问题。

7.componentDidMount

```
componentDidUpdate(prevProps, prevState, snapshot)
```

![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)

componentDidMount()会在更新后被立即调用。首次渲染不会执行此方法。

也可以在componentDidMount()中**直接调用setState()**,但请注意**它必须被包裹在一个条件语句中**，否则会在导致死循环。

8.componentWillUnmount

```
componentWillUnmount()
```

![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)

 componentWillUnmount()会在组件卸载及销毁之前直接调用。此方法中执行必要的清理操作，例如：清理timer，取消网络请求或清除在componentDidMount()中创建的订阅等。

componentWillUnmount()中**不应调用setState()**，因为该组件将永远不会重新渲染，组件实例卸载后，将永远不会挂载它。