---
title: JavaScript数据类型
author: 不以by
email: promiseyou_dear@163.com
date: 2020-12-20 19:23:08
tags: 
  - JavaScript

categories: 
  - JavaScript
---

# JavaScript 数据类型

1. 字符串类型
2. 数值类型
3. 布尔值类型
4. undefined类型
5. null类型



### 一、字符串类型

用于存储和处理文本

字符串可以存储一系列字符，字符串可以是插入到引号中的任何字符。可以使用单引号或双引号

```javascript
var str = "This is a string"；
var str = 'This is a string';
```

![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)

可以使用下标来访问字符串中的每个字符,字符串的下标从0开始

```javascript
console.log(str[8]); // a
```

![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)

字符串中可以使用引号，但不能与字符串的引号相同

```javascript
var answer = "It's alright";
var answer = "He is called 'Johnny'";
var answer = 'He is called "Johnny"';
```

![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)

**字符串长度：**

字符串可以使用length来获取长度

```javascript
var txt = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
console.log(txt.length); // 26
```

![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)

**特殊字符：**

| 代码 | 用处          |
| ---- | ------------- |
| \n   | 换行          |
| \t   | tab（制表符） |
| \r   | 回车          |
| \b   | 退格符        |
| \f   | 换页符        |

















### 二、数值类型

JavaScript只有一种数值类型，使用时是否使用小数点都可以

```javascript
var x1 = 34.00;     // 带小数点
var x2 = 34;        // 不带小数点
```

![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)

超大或超小的数值可以用科学计数法来写：

```javascript
var y = 123e5;      // 12300000
var z = 123e-5;     // 0.00123
```

![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)



### 三、布尔类型

布尔值只有两个值：true 或 false。

布尔值经常用在条件测试中。

```javascript
var x = true;
var y = false;
```

![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)



### 四、undefined类型、null类型

undefined 属性用于存放 JavaScript 的 undefined 值。

无法使用 for/in 循环来枚举 undefined 属性，也不能用 delete 运算符来删除它。

undefined 不是常量，可以把它设置为其他值。

当尝试读取不存在的对象属性时也会返回 undefined。

只能用 === 运算来测试某个值是否是未定义的，因为 == 运算符认为 undefined 值等价于 null。

null 表示无值，而 undefined 表示一个未声明的变量，或已声明但没有赋值的变量，或一个并不存在的对象属性。

null为空



### 五、== 和 ===

**区别：**

使用==判断是否相等时，会先将两个数据转为同一类型再进行比较。如果两个值类型不同，也有可能相等



==： 

1. Number类型与boolean类型，比较前先将Boolean转换为数值。
2. Number类型与字符串类型，比较前先将字符串转换为数值
3. Number类型与undefined类型，结果为 false
4. Number类型与null类型，结果为 false
5. 如果两个都是字符串，比较字符序列
6. 如果两个都是对象，比较的是对象的引用地址
7. null == undefined //true
8. NaN与任何值（包括NaN）比较结果都为false

===：

1. 如果两个值类型相同，再进行三个等号(===)的比较，如果类型不同，就一定不相等
2. 如果两个都是数值，并且是同一个值，那么相等；如果其中至少一个是NaN，那么不相等。（判断一个值是否是NaN，只能使用isNaN( ) 来判断）
3. 如果两个都是字符串，每个位置的字符都一样，那么相等，否则不相等。
4. 如果两个值都是true，或是false，那么相等
5. 如果两个值都引用同一个对象或是函数，那么相等，否则不相等
6. 如果两个值都是null，或是undefined，那么相等



[] === [] //false

undefined === undefined //true

[] == []  //false

undefined == undefined //true