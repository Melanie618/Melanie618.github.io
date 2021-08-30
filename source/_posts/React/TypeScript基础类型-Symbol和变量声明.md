---
title: TypeScript 基础类型,Symbol和变量声明
author: 不以by
email: promiseyou_dear@163.com
date: 2020-12-29 14:33:00
tags: 
  - React
  - TypeScript

categories: 
  - React
  - TypeScript
---

# 基本类型

为了让程序有价值，我们需要能够处理最简单的数据单元：数字，字符串，结构体，布尔值等。 TypeScript支持与JavaScript几乎相同的数据类型，此外还提供了实用的枚举类型方便我们使用。

## 1.布尔值

最基本的数据类型就是简单的true/false，在JavaScript和TypeScript里叫做`boolean`

```typescript
let isDone: boolean = false;
```

## 2.数字

和JavaScript一样，TypeScript 里的所有数字都是浮点数。这些浮点数的类型是 `number`。 除了支持十进制和十六进制字面量。

```typescript
let decLiteral: number = 6;
let hexLiteral: number = 0xf00d;
let binaryLiteral: number = 0b1010;
let octalLiteral: number = 0o744;
```

## 3.字符串

JavaScript的另一项基本操作是处理网页或服务器端的文本数据。和其他语言一样使用string表示文本数据类型。可以使用双引号( " )或单引号( ' )表示字符串。

```typescript
let name: string = "bob";
name = "smith";
```

还可以使用模板字符串，它可以定义多行文本和内嵌表达式。这种字符串是被反引号包围( ` ),并且以${ expr }这种形式嵌入表达式。

```typescript
let name: string = `Gene`;
let age: number = 37;
let sentence: string = `Hello, my name is ${name},
    I'll be ${ age + 1 } years old next month.`;
```

与下面定义`sentence`的方式效果相同：

```typescript
let sentence: string = "Hello, my name is " + name + ".\n\n" +
    "I'll be " + (age + 1) + " years old next month.";
```

## 4.数组

TypeScript像JavaScript一样可以操作数组元素。有两种方式可以定义数组。

​	(1) 在元素类型后面接上 `[ ]`，表示此类型元素组成的一个数组



```typescript
let list: number[] = [1, 2, 3];
```

​	(2) 使用数组泛型，`Array<元素类型>`:

```typescript
let list: Array<number> = [1, 2, 3]
```

## 5.元组 Tuple

元组类型允许表示一个已知元素数量和类型的数组，各元素的类型不必相同。比如，可以定义一对值分别为`string`和`number`类型的元组。

```typescript
// Declare a tuple type
let x: [string, number];
// Initialize it
x = ['hello', 10]; // OK
// Initialize it incorrectly
x = [10, 'hello']; // Error
```

当访问一个已知索引的元素，会得到正确的类型：

```typescript
console.log(x[0].substr(1)); // OK
console.log(x[1].substr(1)); // Error, 'number' does not have 'substr'
```

当访问一个越界的元素，会使用联合类型替代：

```typescript
x[3] = 'world'; // OK, 字符串可以赋值给(string | number)类型

console.log(x[5].toString()); // OK, 'string' 和 'number' 都有 toString

x[6] = true; // Error, 布尔不是(string | number)类型
```

## 6.枚举

`enum`类型是对JavaScript标准数据类型的一个补充。使用枚举类型可以为一组数值赋予友好的名字。

```typescript
enum Color{Red, Green, Blue}
let c: Color = Color.Green;
```

默认情况下，从0开始为元素编号。也可以手动指定成员的数值。

```typescript
enum Color{Red = 1, Green, Blue}
let c: Color = Color.Green;
```

此时元素编号从1开始。

也可以全部采用手动赋值：

```typescript
enum Color{Red = 1, Green = 2, Blue = 3}
let c: Color = Color.Green;
```

枚举类型提供的一个便利是你可以由枚举的值得到它的名字。 例如，我们知道数值为2，但是不确定它映射到Color里的哪个名字，我们可以查找相应的名字：

```typescript
enum Color {Red = 1, Green, Blue}
let colorName: string = Color[2]; // 显示'Green'因为上面代码里它的值是2
```

## 7. Any

有时候，我们会想要为那些在编程阶段还不清楚类型的变量指定一个类型。 这些值可能来自于动态的内容，比如来自用户输入或第三方代码库。 这种情况下，我们不希望类型检查器对这些值进行检查而是直接让它们通过编译阶段的检查。 那么我们可以使用 `any`类型来标记这些变量：

```typescript
let notSure: any = 4;
notSure = "maybe a string instead";
notSure = false; // okay, definitely a boolean
```

在对现有代码进行改写的时候，`any`类型是十分有用的，它允许你在编译时可选择地包含或移除类型检查。 你可能认为 `Object`有相似的作用，就像它在其它语言中那样。 但是 `Object`类型的变量只是允许你给它赋任意值 - 但是却不能够在它上面调用任意的方法，即便它真的有这些方法：

```typescript
let notSure: any = 4;
notSure.ifItExists(); // okay, ifItExists might exist at runtime
notSure.toFixed(); // okay, toFixed exists (but the compiler doesn't check)

let prettySure: Object = 4;
prettySure.toFixed(); // Error: Property 'toFixed' doesn't exist on type 'Object'.
```

当你只知道一部分数据的类型时，`any`类型也是有用的。 比如，你有一个数组，它包含了不同的类型的数据：

```typescript
let list: any[] = [1, true, "free"];

list[1] = 100;
```

## 8. Void

某种程度上来说，`void`类型像是与`any`类型相反，它表示没有任何类型。 当一个函数没有返回值时，你通常会见到其返回值类型是 `void`：

```typescript
function warnUser(): void {
    console.log("This is my warning message");
}
```

声明一个`void`类型的变量没有什么大用，因为你只能为它赋予`undefined`和`null`：

```typescript
let unusable: void = undefined;
```

## 9. Null 和 Undefined

TypeScript 里，`undefined`和`null`两者各自有自己的类型分别叫做`undefined`和`null`。 和 `void`相似，它们的本身的类型用处不是很大：

```typescript
// Not much else we can assign to these variables!
let u: undefined = undefined;
let n: null = null;
```

默认情况下`null`和`undefined`是所有类型的子类型。 就是说你可以把 `null`和`undefined`赋值给`number`类型的变量。

当指定了`--strictNullChecks`标记，`null`和`undefined`只能赋值给`void`和它们各自。 这能避免 *很多*常见的问题。 也许在某处你想传入一个 `string`或`null`或`undefined`，你可以使用联合类型`string | null | undefined`。 再次说明，稍后我们会介绍联合类型。

## 10. Never

`never`类型表示的是那些永不存在的值的类型。 例如， `never`类型是那些总是会抛出异常或根本就不会有返回值的函数表达式或箭头函数表达式的返回值类型； 变量也可能是 `never`类型，当它们被永不为真的类型保护所约束时。

`never`类型是任何类型的子类型，也可以赋值给任何类型；然而，*没有*类型是`never`的子类型或可以赋值给`never`类型（除了`never`本身之外）。 即使 `any`也不可以赋值给`never`。

```typescript
// 返回never的函数必须存在无法达到的终点
function error(message: string): never {
    throw new Error(message);
}

// 推断的返回值类型为never
function fail() {
    return error("Something failed");
}

// 返回never的函数必须存在无法达到的终点
function infiniteLoop(): never {
    while (true) {
    }
}
```

## 11. Object

`object`表示非原始类型，也就是除`number`，`string`，`boolean`，`symbol`，`null`或`undefined`之外的类型。

使用`object`类型，就可以更好的表示像`Object.create`这样的 API 。

```typescript
declare function create(o: object | null): void;

create({ prop: 0 }); // OK
create(null); // OK

create(42); // Error
create("string"); // Error
create(false); // Error
create(undefined); // Error
```

## 12.类型断言

有时候你会比 TypeScript 更了解某个值的详细信息。 通常这会发生在你清楚地知道一个实体具有比它现有类型更确切的类型。

类型断言好比其它语言里的类型转换，但是不进行特殊的数据检查和解构。 它没有运行时的影响，只是在编译阶段起作用。 TypeScript 会假设你，程序员，已经进行了必须的检查。

类型断言有两种形式。

​	(1)  “尖括号形式”

```typescript
let someValue: any = "this is a string";

let strLength: number = (<string>someValue).length;
```

​	(2) `as`语法

```typescript
let someValue: any = "this is a string";

let strLength: number = (someValue as string).length;
```

两种形式是等价的。但当你在 TypeScript 里使用 JSX 时，只有 `as`语法断言是被允许的。

# 变量声明

`let`和`const`是JavaScript里相对较新的变量声明方式。  `let`在很多方面与`var`是相似的，但是可以避免在JavaScript里常见的一些问题。 `const`是对`let`的一个增强，它能阻止对一个变量再次赋值。

## 1. `var` 声明

```typescript
var a = 10;
```

也可以在函数内部定义变量：

```typescript
function f() {
    var message = "Hello, world!";

    return message;
}
```

也可以在其它函数内部访问相同的变量。

```typescript
function f() {
    var a = 10;
    return function g() {
        var b = a + 1;
        return b;
    }
}

var g = f();
g(); // returns 11;
```

`g`可以获取到`f`函数里定义的`a`变量。 每当 `g`被调用时，它都可以访问到`f`里的`a`变量。 即使当 `g`在`f`已经执行完后才被调用，它仍然可以访问及修改`a`。

```typescript
function f() {
    var a = 1;

    a = 2;
    var b = g();
    a = 3;

    return b;

    function g() {
        return a;
    }
}

f(); // return 2
```

### 作用域规则

`var`声明的作用域。

```typescript
function f(shouldInitialize: boolean) {
    if (shouldInitialize) {
        var x = 10;
    }

    return x;
}

f(true);  // return '10'
f(false); // return 'undefined'
```

变量 `x`是定义在*`if`语句里面*，但是我们却可以在语句的外面访问它。 这是因为 `var`声明可以在包含它的函数，模块，命名空间或全局作用域内部任何位置被访问，包含它的代码块对此没有什么影响。 有些人称此为* `var`作用域*或*函数作用域*。 函数参数也使用函数作用域。

这些作用域规则可能会引发一些错误。 其中之一就是，多次声明同一个变量并不会报错：

```typescript
function sumMatrix(matrix: number[][]) {
    var sum = 0;
    for (var i = 0; i < matrix.length; i++) {
        var currentRow = matrix[i];
        for (var i = 0; i < currentRow.length; i++) {
            sum += currentRow[i];
        }
    }

    return sum;
}
```

问题：里层的`for`循环会覆盖变量`i`，因为所有`i`都引用相同的函数作用域内的变量。这些问题可能在代码审查时漏掉，引发无穷的麻烦。

### 捕获变量怪异之处

```typescript
for (var i = 0; i < 10; i++) {
    setTimeout(function() { console.log(i); }, 100 * i);
}
```

`setTimeout`会在若干毫秒的延时后执行一个函数

返回的结果是：

```typescript
10
10
10
10
10
10
10
10
10
10
```

> 传给`setTimeout`的每一个函数表达式实际上都引用了相同作用域里的同一个`i`。



## 2.`let` 声明

除了名字不同外， `let`与`var`的写法一致。

```typescript
let hello = "Hello!";
```

### 块作用域

当用`let`声明一个变量，它使用的是*词法作用域*或*块作用域*。 不同于使用 `var`声明的变量那样可以在包含它们的函数外访问，块作用域变量在包含它们的块或`for`循环之外是不能访问的。

```typescript
function f(input: boolean) {
    let a = 100;

    if (input) {
        // Still okay to reference 'a'
        let b = a + 1;
        return b;
    }

    // Error: 'b' doesn't exist here
    return b;
}
```

这里定义了2个变量`a`和`b`。 `a`的作用域是`f`函数体内，而`b`的作用域是`if`语句块里。

在`catch`语句里声明的变量也具有同样的作用域规则。

```typescript
try {
    throw "oh no!";
}
catch (e) {
    console.log("Oh well.");
}

// Error: 'e' doesn't exist here
console.log(e);
```

拥有块级作用域的变量的另一个特点是，它们不能在被声明之前读或写。 虽然这些变量始终“存在”于它们的作用域里，但在直到声明它的代码之前的区域都属于 *暂时性死区*。

```typescript
a++; // illegal to use 'a' before it's declared;
let a;
```

我们仍然可以在一个拥有块作用域变量被声明前*获取*它。 只是我们不能在变量声明前去调用那个函数。

```typescript
function foo() {
    // okay to capture 'a'
    return a;
}

// 不能在'a'被声明前调用'foo'
// 运行时应该抛出错误
foo();

let a;
```

### 重定义及屏蔽

使用`var`声明时，它不在乎你声明多少次；你只会得到1个。

```typescript
function f(x) {
    var x;
    var x;

    if (true) {
        var x;
    }
}
```

在上面的例子里，所有`x`的声明实际上都引用一个*相同*的`x`，并且这是完全有效的代码。 这经常会成为bug的来源。 但 `let`声明不允许重复声明。

```typescript
let x = 10;
let x = 20; // 错误，不能在1个作用域里多次声明`x`
```

并不是要求两个均是块级作用域的声明 TypeScript 才会给出一个错误的警告。

```typescript
function f(x) {
    let x = 100; // error: interferes with parameter declaration
}

function g() {
    let x = 100;
    var x = 100; // error: can't have both declarations of 'x'
}
```

块级作用域变量需要在不同的块里声明。

```typescript
function f(condition, x) {
    if (condition) {
        let x = 100;
        return x;
    }

    return x;
}

f(false, 0); // returns 0
f(true, 0);  // returns 100
```

### 块级作用域变量的获取

每次进入一个作用域时，它创建了一个变量的 *环境*。 就算作用域内代码已经执行完毕，这个环境与其捕获的变量依然存在。

```typescript
let unusable: void = undefined;function theCityThatAlwaysSleeps() {
    let getCity;

    if (true) {
        let city = "Seattle";
        getCity = function() {
            return city;
        }
    }

    return getCity();
}
```

因为我们已经在`city`的环境里获取到了`city`，所以就算`if`语句执行结束后我们仍然可以访问它。

当`let`声明出现在循环体里时拥有完全不同的行为。 不仅是在循环里引入了一个新的变量环境，而是针对 *每次迭代*都会创建这样一个新作用域。

```typescript
for (let i = 0; i < 10 ; i++) {
    setTimeout(function() {console.log(i); }, 100 * i);
}
```

此时的输出结果是：

```typescript
0
1
2
3
4
5
6
7
8
9
```

## 3.`const` 声明

`const` 声明是声明变量的另一种方式。

```typescript
const numLivesForCat = 9;
```

与`let`声明相似，但它们被赋值后不能再改变。它们拥有与 `let`相同的作用域规则，但是不能对它们重新赋值。

```typescript
const numLivesForCat = 9;
const kitty = {
    name: "Aurora",
    numLives: numLivesForCat,
}

// Error
kitty = {
    name: "Danielle",
    numLives: numLivesForCat
};

// all "okay"
kitty.name = "Rory";
kitty.name = "Kitty";
kitty.name = "Cat";
kitty.numLives--;
```

`const`变量的内部状态是可修改的。

```typescript
let unusable: void = undefined;
```

## 4.解构

### 数组解构

```typescript
let input = [1, 2];
let [first, second] = input;
console.log(first); // outputs 1
console.log(second); // outputs 2
```

可以在数组里使用`...`语法进行解构：

```typescript
let [first, ...rest] = [1, 2, 3, 4];
console.log(first); // outputs 1
console.log(rest); // outputs [ 2, 3, 4 ]
```

### 对象解构

```typescript
let o = {
    a: "foo",
    b: 12,
    c: "bar"
};
let { a, b } = o;
```

可以在对象里使用`...`语法创建剩余变量：

```typescript
let { a, ...passthrough } = o;
let total = passthrough.b + passthrough.c.length;
```

#### 属性重命名

可以给属性以不同的名字：

```typescript
let { a: newName1, b: newName2 } = o;
```

可以将 `a: newName1` 读做 "`a` 作为 `newName1`"。 

```typescript
let newName1 = o.a;
let newName2 = o.b;
```

这里的冒号*不是*指示类型的。 如果你想指定它的类型， 仍然需要在其后写上完整的模式。

```typescript
let {a, b}: {a: string, b: number} = o;
```

#### 默认值

默认值可以让你在属性为 undefined 时使用缺省值：

```typescript
function keepWholeObject(wholeObject: { a: string, b?: number }) {
    let { a, b = 1001 } = wholeObject;
}
```

即使 `b` 为 undefined ， `keepWholeObject` 函数的变量 `wholeObject` 的属性 `a` 和 `b` 都会有值。

#### 函数声明

解构也能用于函数声明。

```typescript
type C = { a: string, b?: number }
function f({ a, b }: C): void {
    // ...
}
```

#### 展开

展开操作符正与解构相反。 它允许你将一个数组展开为另一个数组，或将一个对象展开为另一个对象。 

```typescript
let first = [1, 2];
let second = [3, 4];
let bothPlus = [0, ...first, ...second, 5];
```

这会令`bothPlus`的值为`[0, 1, 2, 3, 4, 5]`。 展开操作创建了 `first`和`second`的一份浅拷贝。 它们不会被展开操作所改变。

也可以展开对象：

```typescript
let defaults = { food: "spicy", price: "$$", ambiance: "noisy" };
let search = { ...defaults, food: "rich" };
```

`search`的值为`{ food: "rich", price: "$$", ambiance: "noisy" }`。 

```typescript
let defaults = { food: "spicy", price: "$$", ambiance: "noisy" };
let search = { food: "rich", ...defaults };
```

defaults`里的`food`属性会重写`food: "rich"。

# Symbols

`symbol`是一种新的原生类型，就像`number`和`string`一样。

`symbol`类型的值是通过`Symbol`构造函数创建的。

```typescript
let sym1 = Symbol();

let sym2 = Symbol("key"); // 可选的字符串key
```

Symbols是不可改变且唯一的。

```typescript
let sym2 = Symbol("key");
let sym3 = Symbol("key");

sym2 === sym3; // false, symbols是唯一的
```

像字符串一样，symbols也可以被用做对象属性的键。

```typescript
let sym = Symbol();

let obj = {
    [sym]: "value"
};

console.log(obj[sym]); // "value"
```

Symbols也可以与计算出的属性名声明相结合来声明对象的属性和类成员。

```typescript
const getClassNameSymbol = Symbol();

class C {
    [getClassNameSymbol](){
       return "C";
    }
}

let c = new C();
let className = c[getClassNameSymbol](); // "C"
```

除了用户定义的symbols，还有一些已经众所周知的内置symbols。 内置symbols用来表示语言内部的行为。

symbols的列表：

## `Symbol.hasInstance`

方法，会被`instanceof`运算符调用。构造器对象用来识别一个对象是否是其实例。

## `Symbol.isConcatSpreadable`

布尔值，表示当在一个对象上调用`Array.prototype.concat`时，这个对象的数组元素是否可展开。

## `Symbol.iterator`

方法，被`for-of`语句调用。返回对象的默认迭代器。

## `Symbol.match`

方法，被`String.prototype.match`调用。正则表达式用来匹配字符串。

## `Symbol.replace`

方法，被`String.prototype.replace`调用。正则表达式用来替换字符串中匹配的子串。

## `Symbol.search`

方法，被`String.prototype.search`调用。正则表达式返回被匹配部分在字符串中的索引。

## `Symbol.species`

函数值，为一个构造函数。用来创建派生对象。

## `Symbol.split`

方法，被`String.prototype.split`调用。正则表达式来用分割字符串。

## `Symbol.toPrimitive`

方法，被`ToPrimitive`抽象操作调用。把对象转换为相应的原始值。

## `Symbol.toStringTag`

方法，被内置方法`Object.prototype.toString`调用。返回创建对象时默认的字符串描述。

## `Symbol.unscopables`

对象，它自己拥有的属性会被`with`作用域排除在外。