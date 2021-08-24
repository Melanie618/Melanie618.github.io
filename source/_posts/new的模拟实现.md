---
title: new的模拟实现
author: 不以by
email: promiseyou_dear@163.com
date: 2021-01-13 18:40:17
tags: JavaScript
categories: JavaScript
---

# new

> **`new` 运算符**创建一个用户定义的对象类型的实例或具有构造函数的内置对象的实例。

可以对已定义的对象添加新的属性。例如，给 `car1` 添加一个新的属性 `color`，并给这个属性赋值 "`black`"，但这不会影响任何其他对象。要将新属性添加到相同类型的所有对象，则必须将该属性添加到 `Car` 对象类型的定义中。

也可以使用 `Function.prototype` 属性将共享属性添加到以前定义的对象类型。这定义了一个由该函数创建的所有对象共享的属性，而不仅仅是对象类型的其中一个实例。

```javascript
function Car() {}
car1 = new Car();
car2 = new Car();

console.log(car1.color);    // undefined

Car.prototype.color = "original color";
console.log(car1.color);    // original color

car1.color = 'black';
console.log(car1.color);   // black

console.log(car1.__proto__.color) //original color
console.log(car2.__proto__.color) //original color
console.log(car1.color)  // black
console.log(car2.color) // original color
```

> 如果你没有使用 `new` 运算符， **构造函数会像其他的常规函数一样被调用，** 并*不会创建一个对象**。***在这种情况下， `this` 的指向也是不一样的。

# 对象类型和对象实例

假设你要创建一个汽车的对象类型。你希望这个类型叫做car，这个类型具备make, model, year等属性

```javascript
function Car(make, model, year) {
   this.make = make;
   this.model = model;
   this.year = year;
}

// 创建一个 mycar 的对象，并给他的属性指定值
var mycar = new Car("Eagle", "Talon TSi", 1993);

console.log(carl.make); // Eagle
console.log(carl.model); // Talon TSi
console.log(carl.year); // 1993

// 可以通过调用 new 来创建任意个汽车对象
var kenscar = new Car("Nissan", "300ZX", 1992);

console.log(carl.make); // Nissan
console.log(carl.model); // 300ZX
console.log(carl.year); // 1992
```

# 对象属性为其他对象

假设你定义了一个对象叫做 `person`：

```javascript
function Person(name, age, sex) {
   this.name = name;
   this.age = age;
   this.sex = sex;
}

// 实例化两个新的 person 对象
var rand = new Person("Rand McNally", 33, "M");
var ken = new Person("Ken Jones", 39, "M");

// 重写 car 的定义，添加一个值为 person 对象的 owner 属性
function Car(make, model, year, owner) {
   this.make = make;
   this.model = model;
   this.year = year;
   this.owner = owner;
}

// 实例化新的对象
var car1 = new Car("Eagle", "Talon TSi", 1993, rand);
var car2 = new Car("Nissan", "300ZX", 1992, ken);

// 创建对象时，并没有传字符串或数字给owner，而是传了对象 rand 和 ken 。可以通过 car2.owner.name来获取
car2.owner.name
```