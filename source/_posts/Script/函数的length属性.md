---
title: 函数的length属性
date: 2021-01-05 19:15:07
tags: 
    - JavaScript
    - Array

categories: 
    - JavaScript
---

# 函数的length属性

**函数的length** 属性即函数的形参个数。

| Function.length 属性的属性特性： |       |
| -------------------------------- | ----- |
| writerable                       | false |
| enumerable                       | false |
| configurable                     | true  |

length 是函数对象的一个属性值，指**该函数有多少个必须要传入的参数，即形参的个数。** **形参的数量不包括剩余参数个数，仅包括第一个具有默认值之前的参数个数。** 与之对比的是， `arguments.length` 是函数被调用时实际传参的个数。

# ` Function` 构造器的属性

`Function` 构造器本身也是个Function。它的 **`length` 属性值为 1** 。该属性 Writable: `false`, Enumerable: `false`, Configurable: `true`。

```javascript
	//1. Function构造器的属性的length为1
    console.log(Function.length); // 1    
	console.log(function(a){}.length); // 1
    console.log(function(a,b,c){}.length); // 3

    /*2.如果函数内部是通过arguments调用参数，而没有实际定义参数的话,length 只会的得到 0。*/
    function test1(){
        console.log(arguments.length);
    }
    console.log(test1.length); //0
    test1(1,2); // 2
```
# ES6的函数length属性

ES6指定了默认值以后，**函数的length属性，将返回没有指定默认值的参数个数。**也就是说，指定了默认值后，length属性将失真。下面代码中，length属性的返回值，等于函数的参数个数减去指定了默认值的参数个数。

这时因为length属性的含义是，该函数预期传入的参数个数。**某个参数指定默认值以后，预期传入的参数个数就不包括这个参数了。**

```javascript
console.log((function (a){}).length); // 1
console.log((function (a = 5){}).length); // 0
console.log((function(a, b, c = 5){}).length); // 2

/* 同时，这里的rest参数也不会计入length属性。*/ 
console.log((function(...args){}).length); // 0

/*如果设置了默认值的参数不是尾参数，那么length属性也不再计入后面的参数了*/ 
(function(a = 0, b, c){}).length; // 0
(function(a, b = 1, c){}).length; // 1
```

