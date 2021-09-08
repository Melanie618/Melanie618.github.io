---
title: super关键字
date: 2021-01-11 16:12:28
tags: 
  - ECMAScript
  - JavaScript
  - Promise

categories: 
  - ECMAScript
---

`super`关键字既可以当作函数使用，也可以当做对象使用。

# 在函数中使用super

当`super`作为函数调用时，代表父类的构造函数。ES6要求，子类的构造函数必须执行一次`super`函数。

```javascript
class A {}

class B extends A {
    constructor() {
        super();
    }
}
```

子类`B`的构造函数之中的`super()`，代表调用父类的构造函数。这是必须的，否则 JavaScript 引擎会报错。

`super`虽然代表了父类`A`的构造函数，但是返回的是子类`B`的实例，即`super`内部的`this`指的是`B`的实例，因此`super()`在这里相当于`A.prototype.constructor.call(this)`。

```javascript
class A {
  constructor() {
    console.log(new.target.name);
  }
}
class B extends A {
  constructor() {
    super();
  }
}
new A() // A
new B() // B
```

`new.target`指向当前正在执行的函数。在`super()`执行时，它指向的是子类`B`的构造函数，而不是父类`A`的构造函数。也就是说，`super()`内部的`this`指向的是`B`。

作为函数时，`super()`只能用在子类的构造函数之中，用在其他地方就会报错。

```javascript
class A {}

class B extends A {
  m() {
    super(); // 报错
  }
}
```

# 在对象中使用super

`super`作为对象时，在普通方法中，指向父类的原型对象；在静态方法中指向父类。

```JavaScript
class A {
    p() {
        return 2
    }
}

class B extends A {
    constructor() {
        super()
        console.log(super.p()) // 2
    }
}

let b = new B()
```

子类`B`当中的`super.p()`，就是将`super`当作一个对象使用。这时，`super`在普通方法之中，指向`A.prototype`，所以`super.p()`就相当于`A.prototype.p()`。

由于`super`指向父类的原型对象，所以定义在父类实例上的方法或属性，是无法通过`super`调用的。

```javascript
class A {
  constructor() {
    this.p = 2;
  }
}

class B extends A {
  get m() {
    return super.p;
  }
}

let b = new B();
b.m // undefined
```

`p`是父类`A`实例的属性，`super.p`就引用不到它。

如果属性定义在父类的原型对象上，`super`就可以取到。

```javascript
class A {}
A.prototype.x = 2;

class B extends A {
  constructor() {
    super();
    console.log(super.x) // 2
  }
}

let b = new B();
```

属性`x`是定义在`A.prototype`上面的，所以`super.x`可以取到它的值。

ES6 规定，在子类普通方法中通过`super`调用父类的方法时，方法内部的`this`指向当前的子类实例。

```javascript
class A {
  constructor() {
    this.x = 1;
  }
}

class B extends A {
  constructor() {
    super();
    this.x = 2;
    super.x = 3;
    console.log(super.x); // undefined
    console.log(this.x); // 3
  }
}

let b = new B();
```

`super.x`赋值为`3`，这时等同于对`this.x`赋值为`3`。而当读取`super.x`的时候，读的是`A.prototype.x`，所以返回`undefined`。

如果`super`作为对象，用在静态方法之中，这时`super`将指向父类，而不是父类的原型对象。

```javascript
class Parent {
  static myMethod(msg) {
    console.log('static', msg);
  }
  myMethod(msg) {
    console.log('instance', msg);
  }
}

class Child extends Parent {
  static myMethod(msg) {
    super.myMethod(msg);
  }
  myMethod(msg) {
    super.myMethod(msg);
  }
}

Child.myMethod(1); // static 1

var child = new Child();
child.myMethod(2); // instance 2
```

`super`在静态方法之中指向父类，在普通方法之中指向父类的原型对象。

在子类的静态方法中通过`super`调用父类的方法时，方法内部的`this`指向当前的子类，而不是子类的实例。

```javascript
class A {
  constructor() {
    this.x = 1;
  }
  static print() {
    console.log(this.x);
  }
}

class B extends A {
  constructor() {
    super();
    this.x = 2;
  }
  static m() {
    super.print();
  }
}

B.x = 3;
B.m() // 3
```

静态方法`B.m`里面，`super.print`指向父类的静态方法。这个方法里面的`this`指向的是`B`，而不是`B`的实例。

使用`super`的时候，必须显式指定是作为函数、还是作为对象使用，否则会报错。

```javascript
class A {}

class B extends A {
  constructor() {
    super();
    console.log(super); // 报错
  }
}
```

`console.log(super)`当中的`super`，无法看出是作为函数使用，还是作为对象使用，所以 JavaScript 引擎解析代码的时候就会报错。这时，如果能清晰地表明`super`的数据类型，就不会报错。

```javascript
class A {}

class B extends A {
  constructor() {
    super();
    console.log(super.valueOf() instanceof B); // true
  }
}

let b = new B();
```

`super.valueOf()`表明`super`是一个对象，因此就不会报错。同时，由于`super`使得`this`指向`B`的实例，所以`super.valueOf()`返回的是一个`B`的实例。

由于对象总是继承其他对象的，所以可以在任意一个对象中，使用`super`关键字。

```javascript
var obj = {
  toString() {
    return "MyObject: " + super.toString();
  }
};

obj.toString(); // MyObject: [object Object]
```