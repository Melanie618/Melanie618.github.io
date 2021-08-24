---
title: Promise对象
author: 不以by
email: promiseyou_dear@163.com
date: 2020-12-15 19:28:30
tags: Promise
categories: ES6
---

## 一、Promise 的含义

Promise是抽象异步处理对象以及对其进行各种操作的组件。



**Promise 对象的两个特点:**

1、对象的状态不受外界影响。Promise 对象代表一个异步操作，有三种状态：

- pending: 初始状态，不是成功或失败状态。
- fulfilled: 意味着操作成功完成。
- rejected: 意味着操作失败。

只有异步操作的结果，可以决定当前是哪一种状态，任何其他操作都无法改变这个状态。

2、一旦状态改变，就不会再变，任何时候都可以得到这个结果。



**Promise对象的优缺点**

优点：可以将异步操作以同步操作的流程表达出来，避免了层层嵌套的回调函数。

缺点：

- 无法取消 Promise，一旦新建它就会立即执行，无法中途取消。
- 如果不设置回调函数，Promise 内部抛出的错误，不会反应到外部。
- 当处于 Pending 状态时，无法得知目前进展到哪一个阶段



## 二、Promise 创建

```javascript
const promise = new Promise(function(resolve, reject) {
  // ... some code

  if (/* 异步操作成功 调用resolve */){
    resolve(value);
  } else {
    /* 异步操作失败 调用reject */
    reject(error);
  }
});
```

![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)

Promise构造函数接受一个函数作为参数，该函数的两个参数分别是resolve和reject。在回调中执行一些操作（例如异步），如果一切都正常，则调用 resolve，否则调用 reject。



## 三、Promise.prototype.then()

Promise 实例具有`then`方法，`then`方法是定义在原型对象`Promise.prototype`上的。它的作用是为 Promise 实例添加状态改变时的回调函数。

```javascript
const p1 = new Promise(function cb(resolve, reject) {
    setTimeout(() => {
        console.log('欢迎')
        resolve()
    }, 3000)
})
p1.then(_ => {
    setTimeout(() => {
        console.log('谢谢光临')
    }, 2000)
})
```

![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)



## 四、Promise.prototype.catch()

`Promise.prototype.catch()`方法用于指定发生错误时的回调函数。

```javascript
const p1 = new Promise(function cb(resolve, reject) {
    setTimeout(() => {
        console.log('欢迎')
        reject()
    }, 3000)
})
p1.then(_ => {
    setTimeout(() => {
        console.log('谢谢光临')
    }, 2000)
}).catch(_ => {
    console.log('出错了')
})
```

![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)

当promise抛出一个错误，就被`catch()`方法指定的回调函数捕获。

如果 Promise 状态已经变成`resolved`，再抛出错误是无效的。



## 五、总结

Promise对象解决回调地狱层层嵌套的问题。

通过`then`方法分别制定`resolved`状态和`rejected`状态的回调函数。