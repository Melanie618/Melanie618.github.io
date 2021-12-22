---
title: Hook总结
date: 2020-12-27 18:38:08
tags: 
  - react

categories: 
  - React
---

# **Hook 的简介**

*Hook* 是React16.8的新增特性。它可以让你在不缩写class的情况下使用state以及其他的React特性。

*Hook* 是一些可以让你在函数组件里“钩入” React state 及生命周期等特性的函数。*Hook* 不能在 class 组件中使用 —— 这使得你不使用 class 也能使用 React。

### **没有破坏性改动**

*Hook* 是：

- **完全可选的。**无需重写任何已有代码就可以在一些组建中尝试 *Hook*。
- **100%向后兼容。**
- **现在可用。**

**没有计划从React中移除class。** *Hook* 为已知React概念提供了更直接的API：props，state，context，refs以及生命周期。



# **Hook 的使用**

*Hook* 是向下兼容的。

## 📌**State Hook**

```javascript
import React, { useState } from 'react';

function Example() {
  // 声明一个新的叫做 "count" 的 state 变量  
  const [count, setCount] = useState(0);
  return (

    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>

  );
}
```

在这里，`usestate` 就是一个 *Hook* 。通过在函数组件里调用它来给组件添加一些内部 state。React 会在重复渲染时保留这个 state。`useState` 会返回一对值：**当前**状态和一个让你更新它的函数，你可以在事件处理函数中或其他一些地方调用这个函数。它类似 class 组件的 `this.setState`，但是它不会把新的 state 和旧的 state 进行合并。

`useState` 唯一的参数就是初始 state。在上面的例子中，我们的计数器是从零开始的，所以初始 state 就是 `0`。值得注意的是，不同于 `this.state`，这里的 state 不一定要是一个对象 —— 如果你有需要，它也可以是。这个初始 state 参数只有在第一次渲染时会被用到。

#### 声明多个 state 变量

你可以在一个组件中多次使用 State Hook:

```javascript
function ExampleWithManyStates() {
  // 声明多个 state 变量！
  const [age, setAge] = useState(42);
  const [fruit, setFruit] = useState('banana');
  const [todos, setTodos] = useState([{ text: 'Learn Hooks' }]);
  // ...
}
```

数组解构的语法让我们在调用 `useState` 时可以给 state 变量取不同的名字。当然，这些名字并不是 `useState` API 的一部分。React 假设当你多次调用 `useState` 的时候，你能保证每次渲染时它们的调用顺序是不变的。后面我们会再次解释它是如何工作的以及在什么场景下使用。



## ⚡️ Effect Hook

`useEffect` 就是一个 Effect Hook，给函数组件增加了操作副作用的能力。它跟 class 组件中的 `componentDidMount`、`componentDidUpdate` 和 `componentWillUnmount` 具有相同的用途，只不过被合并成了一个 API。

下面这个组件在 React 更新 DOM 后会设置一个页面标题：

```javascript
import React, { useState, useEffect } from 'react';
function Example() {
  const [count, setCount] = useState(0);

  // 相当于 componentDidMount 和 componentDidUpdate:  
  useEffect(() => {    // 使用浏览器的 API 更新页面标题    
      document.title = `You clicked ${count} times`; 
  });
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

跟 `useState` 一样，你可以在组件中多次使用 `useEffect`

# ✌️ **Hook 的规则**

Hook 就是 JavaScript 函数，但是使用它们会有两个额外的规则：

- 只能在**函数最外层**调用 Hook。不要在循环、条件判断或者子函数中调用。
- 只能在 **React 的函数组件**中调用 Hook。不要在其他 JavaScript 函数中调用。

