---
title: this指向和改变方法
author: 不以by
email: promiseyou_dear@163.com
date: 2021-01-14 18:31:13
tags: 
  - JavaScript
  - Window 对象

categories: 
  - JavaScript
---

> this是JavaScript语言的一个关键字。

它代表函数运行时自动生成的一个内部对象，只能在函数内部使用。

```javascript
function test() {
	this.x = 1;
}
```

随着函数使用的场合不同， `this `的值会发生变化。但有一个总的原则： `this` 就是函数运行时所在的环境对象（是调用函数的那个对象）。

# this的指向

1.如果是一般函数，`this` 指向全局对象window

```javascript
var x = 1 ;
function test() {
    console.log(this.x);
}
test(); // 1
```

2.对象方法中调用，`this` 指向调用该方法的对象

```javascript
function test() {
    console.log(this.x);
}
var obj = {};
obj.x = 1;
obj.m = test;

obj.m(); // 1
```

3.作为构造函数调用，`this` 指向创建出来的实例

```javascript
var x = 2;
function test() {
    this.x = 1;
}

var obj = new test();
obj.x; // 2
```

4.在严格模式下，`this` 指向undefined

```javascript
function test() {
    "use strict";
    console.log(this)
}

test(); // udnefined
```

5.通过事件绑定的方法，`this` 指向绑定事件的对象

```html
<body>
    <button id="btn">click</button>
</body>
<script>
	var oBtn = document.getElementById("btn");
    oBtn.onclick = function() {
        console.log(this); // <button id="btn">click</button>
    }
</script>
```

6.定时器函数， `this` 指向 `window`

```javascript
setInterval(function() {
    console.log(this); // window
}, 1000)
```



# 改变this指向的方法

**1. call() 方法、apply() 方法、bind() 方法**

共同点： 第一个参数为 `this` 指向改变后的指向。若第一参数为null/undefined，this默认指向window

**call(无数个参数)**

- 第一个参数： 改变 `this` 指向
- 第二个参数： 实参

```javascript
var Person = {};
function fn(a, b, c){
    console.log(this, a + b + c);
}

fn(1, 2, 3); // window
fn.call(Person, 1, 2, 3); // Person
```

**apply(两个参数) **

- 第一个参数： 改变 `this` 指向
- 第二个参数： 数组（里面为实参）

```javascript
var Person = {};
function fn(a, b, c){
    console.log(this, a + b + c);
}

fn(1, 2, 3); // window
fn.apply(Person, [1, 2, 3]); // Person
```

**bind(无数个参数) **

- 第一个参数： 改变 `this` 指向
- 第二个参数： 实参

```javascript
var Person = {};
function fn(a, b, c){
    console.log(this, a + b + c);
}

fn(1, 2, 3); // window
fn.bind(Person, 1, 2, 3)(); // Person
```

