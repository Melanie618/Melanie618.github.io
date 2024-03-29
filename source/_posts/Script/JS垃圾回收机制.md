---
title: JS垃圾回收机制
date: 2021-01-20 17:01:14
tags: 
  - JavaScript

categories: 
  - JavaScript
---

# 1. 概述

Js 的垃圾回收机制是为了以防内存泄漏，内存泄漏的含义就是当已经不需要某块内存时这块内存还存在着，垃圾回收机制就是间歇的不定期的寻找到不再使用的变量，并释放掉它们所指向的内存。

在 Js 中，Js 的执行环境会负责管理代码执行过程中使用的内存。

# 2. 变量的生命周期

当一个变量的生命周期结束之后它所指向的内存就应该被释放。JS有两种变量，全局变量和在函数中产生的局部变量。局部变量的生命周期在函数执行过后就结束了，此时便可将它引用的内存释放（即垃圾回收），但全局变量生命周期会持续到浏览器关闭页面。

# 3. Js 垃圾回收方式

Js执行环境中的垃圾回收器怎样才能检测哪块内存可以被回收有两种方式：标记清除（mark and sweep）、引用计数(reference counting)。

## (1) 标记清除(mark and sweep)

大部分浏览器以此方式进行垃圾回收，当变量进入执行环境（函数中声明变量）的时候，垃圾回收器将其标记为“进入环境”，当变量离开环境的时候（函数执行结束）将其标记为“离开环境”，在离开环境之后还有的变量则是需要被删除的变量。标记方式不定，可以是某个特殊位的反转或维护一个列表等。

垃圾收集器给内存中的所有变量都加上标记，然后**去掉环境中的变量以及被环境中的变量引用的变量的标记**。在此之后再被加上的标记的变量即为需要回收的变量，因为环境中的变量已经无法访问到这些变量。

## (2) 引用计数(reference counting)

这种方式常常会引起内存泄漏，低版本的IE使用这种方式。机制就是跟踪一个值的引用次数，当声明一个变量并将一个引用类型赋值给该变量时该值引用次数加1，当这个变量指向其他一个时该值的引用次数便减一。当该值引用次数为0时就会被回收。

该方式会引起内存泄漏的原因是它不能解决循环引用的问题：

```javascript
function sample(){
    var a={};
    var b={};
    a.prop = b;
    b.prop = a;
}
```

这种情况下每次调用sample()函数，a和b的引用计数都是2，会使这部分内存永远不会被释放，即内存泄漏。

> 低版本IE中有一部分对象并不是原生 JS 对象。例如，其 BOM和DOM中的对象就是使用C++以COM(Component Object Model)对象的形式实现的，而COM对象的垃圾收集机制采用的就是引用计数策略。
>
> **因此即使IE的 js引擎是用的标记清除来实现的，但是 js访问COM对象如BOM,DOM还是基于引用计数的策略的**，也就是说只要在IE中设计到COM对象，也就会存在循环引用的问题。

当一个DOM元素和一个原生的js对象之间的循环引用时：

```javascript
var ele = document.getElementById("eleId");
var obj = {};
obj.property = ele;
ele.property = obj;
```

添加 obj.property = null;ele.property = null;即可解除原生JS对象与DOM元素之间的连接。

当闭包中创建循环引用时：

```javascript
window.onload = function outerFunction(){
    var obj= document.getElementById("eleId");
    obj.onclick = function innerfunction(){
        console.log(obj.id);
    }
}
```

上面这个代码创建了一个作为obj元素处理程序的闭包，而这个闭包则又创建了一个循环引用。obj引用了document.getElementById("element")，而document.getElementById("ele　　Id")的onclick方法会引用包括 obj 以内的外部环境中的变量，所谓“外部环境”包括了包含函数的整个活动对象，所以一定会包括 obj（即使闭包没有对 obj 进行直接的引用，例如上文程序中没有 obj.id 出现，包含函数的活动对象（obj）中也依旧会保存一个引用）。

可以改成下面这个：

```javascript
window.onload = function outerFunction(){
    var obj= document.getElementById("element");
    var id = obj.id;//将obj副本保存于变量id中，则不会使obj元素处理程序的闭包创建循环引用
    obj.onclick = function innerfunction(){
        console.log(id);
    }
    ele = null;//手动断开 obj 对 document.getElemengById("element")的引用
}
```