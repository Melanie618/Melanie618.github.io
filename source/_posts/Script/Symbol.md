---
title: Symbol
date: 2020-12-11 20:10:31
tags: 
  - ECMAScript

categories: 
  - ECMAScript
---

JavaScript7种数据类型：

1. undefined
2. null
3. 布尔值(Boolean)
4. 字符串(String)
5. 数值(Number)
6. 对象(Object)
7. Symbol



### 1. 为什么ES6要引入Symbol？

ES5的对象属性名都是字符串，容易引起属性名冲突，而Symbol保证每个属性名都是独一无二的，从根本上防止属性名冲突。

```javascript
let s = Symbol();

typeof s // "symbol"
```

![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)

以上代码中，s是一个独一无二的值，typeof判断的结果是s是Symbol数据类型，而不是其他类型

```javascript
let s1 = Symbol('foo'); let s2 = Symbol('bar');

s1 // Symbol(foo) s2 // Symbol(bar)

s1.toString() // "Symbol(foo)" s2.toString() // "Symbol(bar)"
```

![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)

以上代码中s1与s2是两个Symbol值，如果不加参数，则输出都是Symbol()，不利于区分，有了参数，相当于为他们添加了描述，便于区分。

1. 当Symbol的参数是一个对象时，就会调用toString方法，转为字符串后生成一个Symbol值。
2. Symbol函数的参数只是对当前Symbol值的描述，因此相同参数的Symbol函数的返回值不相等。
3. Symbol值不能与其他类型的值进行运算，会报错
4. Symbol值可以显示为字符串
5. Symbol值也可以转为布尔值，但不能转为数值



### 2.Symbol.prototype.description

创建Symbol是可以添加一个描述

```javascript
const sym = Symbol('foo') //sym的描述就是字符串foo
```

![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)

但读取这个描述要将Symbol显示转为字符串

```javascript
const sym = Symbol('foo')

String(sym)

sym.toString()
```

![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)

ES2019提供了一个实例属性description，直接返回Symbol描述

```javascript
const sym = Symbol('foo')

sym.description // "foo"
```

![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)



### 3.Symbol作为属性名

由于Symbol值都是不相等的，所以Symbol值可以作为标识符，用于对象属性名，可以保证不会出现同名属性

```javascript
let mySymbol = Symbol()

//第一种写法

let a = {};

a[mySymbol] = 'Hello!';

//第二种写法

let a = {[mySymbol]: 'Hello!'}

//第三种写法

let a = {};

Object.defineProperty(a, mySymbol, {value: 'Hello!'})

// 以上写法结果相同

a[mySymbol] // "Hello!"
```

![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)

以上通过中括号结构和Object.defineProperty，将对象的属性名指定为一个Symbol值



Symbol值作为对象属性名是，不能点运算符

因为点运算符后面总是字符串，所以不会读取Symbol值所代指的值，导致属性名实际上是一个字符串，而不是Symbol值

在对象内部使用Symbol值定义属性时，Symbol值必须放在中括号中，如果不放在中括号中，该属性的键名就是字符串，而不是Symbol值。

Symbol类型还可以用于定义一组常量，保证这组常量的值都是不相等的

**Symbol值作为属性名时，该属性是公开属性，不是私有属性**



### 4.属性名的遍历

Symbol作为属性名遍历对象时，该属性不会出现在for...in、for...of循环中，也不会被Object.keys()、Object.getOwnPropertyNames()、JSON.stringify()返回。

但它也不是私有属性，有一个Object.getOwnPropertySymbols()方法可以获取指定对向所有Symbol属性名，该方法返回一个数组，成员是当前对象所有用作属性名的Symbol值。



### 5.Symbol.for(), Symbol.ketFor()

当我们希望使用同一个Symbol值，Symbol.for()方法可以做到。他接受一个字符串作为参数，然后搜索有没有以该参数作为名称的Symbol值，有则返回这个Symbol值，没有则新建一个以该字符串为名称的Symbol值，并注册到全局。



### **6.内置Symbol值**

除了定义自己使用的Symbol值以外，ES6还提供了11个内置Symbol值，指向语言内部使用方法。



**1、 Symbol.hasInstance**

对象的Symbol.hasInstance属性，指向一个内部方法。当期他对象使用Instanceof运算符，判断是否为该对象的实例时，会调用这个方法。



**2、Symbol.isConcatSpreadable**

对象的Symbol.isConcatSpreadable属性等于一个布尔值，表示该对象用于Array.prototype.concat()时，是否可以展开。



**3、Symbol.species**

对象的Symbol.species属性，指向一个构造函数。创建衍生对象时，会使用该属性。



**4、Symbol.match**

对象的Symbol.match属性，指向一个函数。当执行str.match(myObject)时，如果该属性存在，会调用它，返回该方法的返回值。



**5、Symbol.replace**

对象的Symbol.replace属性，指向一个方法，当该对象被String.prototype.replace方法调用时，会返回该方法的返回值。



**6、Symbol.search**

对象的Symbol.search属性，指向一个方法，当该对象被String.prototype.search方法调用时，会返回该方法的返回值



**7、 Symbol.split**

对象的Symbol.split属性，指向一个方法，当该对象被String.prototype.split方法调用时，会返回该方法的返回值。



**8、Symbol.iterator**

对象的Symbol.iterator属性，指向该对象的默认遍历器方法。



**9、 Symbol.toPrimitive**

对象的Symbol.toPrimitive属性，指向一个方法。该对象被转为原始类型的值时，会调用这个方法，返回该对象对应的原始类型值。



**10、 Symbol.toStringTag**

对象的Symbol.toStringTag属性，指向一个方法。在该对象上面调用Object.prototype.toString方法时，如果这个属性存在，它的返回值会出现在toString方法返回的字符串之中，表示对象的类型。



**11、 Symbol.unscopables**

对象的Symbol.unscopables属性，指向一个对象。该对象指定了使用with关键字时，哪些属性会被with环境排除。