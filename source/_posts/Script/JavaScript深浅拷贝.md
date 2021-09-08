---
title: JavaScript深浅拷贝
date: 2020-12-16 19:29:21
tags: 
  - JavaScript

categories: 
  - JavaScript
---

**前提：拷贝是针对对象的操作，当想复制一个对象时，才存在深浅拷贝之分**



## 一、浅拷贝

> 仅仅是复制了引用，彼此之间的操作会互相影响

1.**Object.assign()**

对象只有一层是使用，当对象嵌套对象时，深层的对象无法被拷贝到

2.**lodash的clone方法**

\3. **...操作符**

```javascript
let obj1 = { name: 'Kobe', address:{x:100,y:100}}
let obj2= {... obj1}
obj1.address.x = 200;
obj1.name = 'wade'
console.log('obj2',obj2) // obj2 { name: 'Kobe', address: { x: 200, y: 100 } }
```

![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)

4.**Array.prototype.concat**

```javascript
let arr = [1, 3, {
    username: 'kobe'
    }];
let arr2 = arr.concat();    
arr2[2].username = 'wade';
console.log(arr);
```

![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)

5.**Array.prototype.slice**

```javascript
let arr = [1, 3, {
    username: ' kobe'
    }];
let arr3 = arr.slice();
arr3[2].username = 'wade'
console.log(arr); // [ 1, 3, { username: 'wade' } ]
```

![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)



## 二、深拷贝

> 深拷贝会另外创造一个一模一样的对象，新旧对象不共享内存，因此修改其中的一个对象不会改到另一个对象。

1.**JSON.parse(JSON.stringify())**

可以处理数组和对象的深拷贝，但是不能处理函数和正则，因为这两者基于这两个函数处理后得到的结果不再是正则/函数

缺点：

1. 会忽略undefined

1. 会忽略symbol
2. 不能序列化函数
3. 不能解决循环引用的对象

2.**lodash的cloneDeep函数**

3.**jQuery.extend函数**

4.**Messagechannel**

如果所拷贝的对象含有内置对象，但不包含函数，可以使用。可以拷贝undefined和循环引用的对象