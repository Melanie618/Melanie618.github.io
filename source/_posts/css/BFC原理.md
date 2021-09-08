---
title: BFC原理
date: 2020-12-13 19:25:56
tags: 
  - css
  - BFC

---

## 一、BFC是什么？

   BFC(Block formatting context)直译为“块级格式化上下文”。它是一个独立渲染的区域，只有Block-level box参与，它规定了内部的Block-level box如何布局，并且与这个区域毫不相干。

###   Box：CSS布局的基本单位

   Box是CSS布局的对象和基本单位，就是一个页面由很多个Box组成。元素的类型和display属性决定了这个Box类型。不同类型的Box会参与不同的Formatting Context（决定如何渲染文档的容器），因此Box内的元素会以不同的方式渲染。

- block-level box:display属性为block，list-item,table的元素，会生成Block-level box。并参与block formatting context
- inline-level box:display属性为inline，inline-box,inline-table的元素，会生成inline-level box。并参与inlineformatting context

###   Formatting Context

   Formatting Context是W3C CSS2.1规范中的一个概念。它是页面中的一块渲染区域，并且有一套渲染规则，它决定了其子元素将如何定位，以及和其它元素的关系和相互作用。最常见的Formatting Context有Block formatting context (简称BFC)和 Inline formatting context (简称IFC)。

###   BFC布局规则：

1. 内部的Box会在垂直方向，一个接一个地放置。
2. Box垂直方向的距离由margin决定。属于同一个BFC的两个相邻Box的margin会发生重叠
3. 每个元素的margin box的左边， 与包含块border box的左边相接触(对于从左往右的格式化，否则相反)。即使存在浮动也是如此。
4. BFC的区域不会与float box重叠。
5. BFC就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。反之也如此。
6. 计算BFC的高度时，浮动元素也参与计算



## 二、哪些元素会生成BFC?

1. 根元素
2. float属性不为none
3. position为absolute或fixed
4. display为inline-block, table-cell, table-caption, flex, inline-flex
5. overflow不为visible



## 三、BFC的作用及原理

1. **自适应两栏布局**

   代码：

```html
<style>
    body {
        width: 300px;
        position: relative;
    }
 
    .aside {
        width: 100px;
        height: 150px;
        float: left;
        background: #f66;
    }
 
    .main {
        height: 200px;
        background: #fcc;
    }
</style>
<body>
    <div class="aside"></div>
    <div class="main"></div>
</body>
```

![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)

   页面：

   ![img](https://img-blog.csdnimg.cn/img_convert/7faa738eb41327ae222e4ca9ade269cb.png)![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)

   根据`BFC`布局规则第3条：

> 每个元素的margin box的左边， 与包含块border box的左边相接触(对于从左往右的格式化，否则相反)。即使存在浮动也是如此。

   因此，虽然存在浮动的元素aslide，但main的左边依然会与包含块的左边相接触。

　 根据`BFC`布局规则第四条：

> `BFC`的区域不会与`float box`重叠。

　 可以通过通过触发main生成`BFC`， 来实现自适应两栏布局。

```css
.main {
    overflow: hidden;
}
```

![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)

　 当触发main生成`BFC`后，这个新的`BFC`不会与浮动的aside重叠。因此会根据包含块的宽度，和aside的宽度，自动变窄。效果如下：

　 ![img](https://img-blog.csdnimg.cn/img_convert/c46ea5c07957aca72d48c27b48bd4e3a.png)![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)



　 2. **自适应两栏布局**

　 代码：

```html
<style>
    .par {
        border: 5px solid #fcc;
        width: 300px;
    }
 
    .child {
        border: 5px solid #f66;
        width:100px;
        height: 100px;
        float: left;
    }
</style>
<body>
    <div class="par">
        <div class="child"></div>
        <div class="child"></div>
    </div>
</body>
```

![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)

　 页面：

　 ![img](https://img-blog.csdnimg.cn/img_convert/f10763ac20a6f46917c2f7617aac692c.png)![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)

　 根据`BFC`布局规则第六条：

> 计算`BFC`的高度时，浮动元素也参与计算

　 为达到清除内部浮动，我们可以触发par生成`BFC`，那么par在计算高度时，par内部的浮动元素child也会参与计算。

　 代码：

```css
.par {
    overflow: hidden;
}
```

![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)

　 效果如下：

　 ![img](https://img-blog.csdnimg.cn/img_convert/eddbef9df19df3df732d1ded9c9c902a.png)![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)



　 3. **防止垂直 margin 重叠**

　 代码：

```html
<style>
    p {
        color: #f55;
        background: #fcc;
        width: 200px;
        line-height: 100px;
        text-align:center;
        margin: 100px;
    }
</style>
<body>
    <p>Haha</p>
    <p>Hehe</p>
</body>
```

![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)

　 页面：

　 ![img](https://img-blog.csdnimg.cn/img_convert/13aea01d5ee36c3caeb789cd80cfadcd.png)![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)

　 两个p之间的距离为100px，发送了margin重叠。
　 根据BFC布局规则第二条：

> `Box`垂直方向的距离由margin决定。属于同一个`BFC`的两个相邻`Box`的margin会发生重叠

　 我们可以在p外面包裹一层容器，并触发该容器生成一个`BFC`。那么两个P便不属于同一个`BFC`，就不会发生margin重叠了。

　 代码：

```html
<style>
    .wrap {
        overflow: hidden;
    }
    p {
        color: #f55;
        background: #fcc;
        width: 200px;
        line-height: 100px;
        text-align:center;
        margin: 100px;
    }
</style>
<body>
    <p>Haha</p>
    <div class="wrap">
        <p>Hehe</p>
    </div>
</body>
```

![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)

　 效果如下:

　 ![img](https://img-blog.csdnimg.cn/img_convert/78cd862f248208dfd6446f9f780ff309.png)![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)



## 四、总结

　 以上的几个例子都体现了`BFC`布局规则第五条：

> `BFC`就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。反之也如此。

　 因为`BFC`内部的元素和外部的元素绝对不会互相影响，因此， 当`BFC`外部存在浮动时，它不应该影响`BFC`内部Box的布局，`BFC`会通过变窄，而不与浮动有重叠。同样的，当`BFC`内部有浮动时，为了不影响外部元素的布局，`BFC`计算高度时会包括浮动的高度。避免margin重叠也是这样的一个道理。