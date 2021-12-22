---
title: vue-keep-alive组件
date: 2021-01-29 20:21:26
tags: 
  - vue
  - keep-alive

categories: 
  - Vue
---

# 原理

`keep-alive`是`Vue`提供的一个抽象组件，主要用于保留组件状态或避免重新渲染。

<keep-alive> 包裹动态组件时，会缓存不活动的组件实例，而不是销毁它们。它自身不会渲染一个 DOM 元素，也不会出现在父组件链中。

# **关于keep-alive**

**1. 基本使用**

```html
<keep-alive>
  <component :is="view"></component>
</keep-alive>

<!-- 也可以根据条件判断： -->
<keep-alive>
  <comp-a v-if="a > 1"></comp-a>
  <comp-b v-else></comp-b>
</keep-alive>
<!-- 这个时候触发两个组件切换时，组件内的数据和状态都会得到保存，如果有input输入框，输入框内容会保留 -->
```

**2. 有条件缓存**

keep-alive提供了include、exclude、max三个参数，前两个允许组件有条件的进行缓存，两者都可以接受字符串、正则、数组形式；max表示最多可以缓存多少个组件，接受一个number类型。

```html
<keep-alive include="a,b">
  <component :is="view"></component>
</keep-alive>
<!-- 此时只有a、b两个组件会触发keep-alive，此处的名字是组件内部name对应名字，如果name不存在，会查找父组件里components里注册的名字，如果也不存在则不会匹配。
正则和数组方法同上，但是需要用v-bind:include=''方式。 -->

<keep-alive :max="10">
  <component :is="view"></component>
</keep-alive>
```



# 生命周期钩子

生命钩子 keep-alive提供了两个生命钩子，分别是 `activated` 与 `deactivated` 。

因为keep-alive会将组件保存在内存中，并不会销毁以及重新创建，所以不会重新调用组件的created等方法，需要用 `activated` 与 `deactivated` 这两个生命钩子来得知当前组件是否处于活动状态。