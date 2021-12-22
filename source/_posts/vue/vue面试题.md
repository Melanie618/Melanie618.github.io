---
title: vue面试题
date: 2021-01-28 18:33:21
tags: 
  - vue

categories: 
  - vue
---

# 1. history模式，页面返回404，如何解决？

history是html5的新增api，它的功能是修改地址栏但是不向服务器发送真实请求。如果页面返回404，说明发送了请求到服务器端，但是服务器端对该请求没有做处理，解决方案就是服务器端对于这类请求重定向到某个页面即可。

   

# 2. commonjs规范

  node应用由模块组成，采用的commonjs模块规范。每一个文件就是一个模块，拥有自己独立的作用域，变量，以及方法等，对其他的模块都不可见。CommonJS规范规定，每个模块内部，module变量代表当前模块。这个变量是一个对象，它的exports属性（即module.exports）是对外的接口。加载某个模块，其实是加载该模块的module.exports属性。require方法用于加载模块。

## CommonJS模块的特点

所有代码都运行在模块作用域，不会污染全局作用域。

模块可以多次加载，但是只会在第一次加载时运行一次，然后运行结果就被缓存了，以后再加载，就直接读取缓存结果。要想让模块再次运行，必须清除缓存。

模块加载的顺序，按照其在代码中出现的顺序。

## module对象

module.exports属性表示当前模块对外输出的接口，其他文件加载该模块，实际上就是读取module.exports变量。

## require命令

基本用法  require命令用于加载模块文件，相当于读入并执行一个js文件，然后返回该模块的exports对象，没有发现指定模块，则就会报错。



# 3. vue指令以及作用

在模板中可以通过指令直接访问data和methods中的属性方法

**1. 分类：** 指令可以写在标签上(`<span 指令></span>`)或写在标签中间(`<span>指令</span>`)

**2. 插值：** 可以再`{{}}`中写js表达式 (一个普通变量、函数调用、逻辑表达式、三目运算...)，写在开标签和闭合标签中间

**3. 指令：**

- **v-text：** 与`{{}}`含义相同

- **v-html：** 插入字符串，解析 html

- **v-show：** 根据表达式的值，**切换元素的display的值**

- **v-if：** 根据表达式**有条件渲染元素**

  **v-show 处理的是频繁切换显示与隐藏的dom，反之则 v-if**

- **v-else-if**

- **v-else**

- **v-for：** 基于源数据多次渲染元素或模板块

- **v-bind：** 动态绑定html属性

  语法：**(1) v-bind:属性名="属性值"**

    	 **(2) :属性名="属性值"****

- **v-on:** 事件监听

  语法：**(1) v-on事件名="函数名"**

        **(2)@事件名="函数名"**

  修饰符：

  **.stop** -调用event.stopPropagation( ) 

  **.prevent** -调用event.preventDefault( ) 

  **.capture** -添加事件侦听器时使用capture模式

  **.self** -只当事件是从侦听器绑定的元素本身触发时才触发回调

  **.{keyCode | keyAlias}** -只当事件是从特定键触发时才触发回调

  **.native** -监听组件根元素的原生事件

  **.once** -只触发—次回调.left -(2.2.0)只当点击鼠标左键时触发

  **.right** -(2.2.0)只当点击鼠标右键时触发

  **.middle** -(2.2.0)只当点击鼠标中键时触发

  **.passive** -(2.3.0)以{ passive: true }模式添加侦听器

- **v-model：** 在表单控件或者组件上双向绑定

  语法： **(1) v-model="变量名"**

  修饰符：

  **.lazy** - 取代 `input` 监听 `change` 事件

  **.number** - 输入字符串转为有效的数字

  **.trim** - 输入首尾空格过滤



# 4. `EventBus`

## 简介：

​	`EventBus` 又称为事件总线。在 vue 中可以使用 `EventBus` 来作为沟通桥梁的概念，就像是所有组件共用相同的事件中心，可以向该中心注册发送事件或接收事件，所以组件都可以上下平行地通知其他组件，但也就是太方便所以若使用不慎，就会造成难以维护的灾难，因此才需要更完善的 vuex 作为状态管理中心，将通知的概念上升到共享状态层次。

## 使用：

​	首先在main.js中输入 var bus=new Vue() Vue.prototype.$bus=bus 然后 在a组件中输入this.$bus.$emit('自定义事件名'，"参数") 然后在接收参数的b组件中输入this.$bus.$on('自定义事件名','参数')



# 5. vue-router 的原理 (history、hash)

## vue-router是什么？

实现更新视图但不重新加载页面。url与页面一一对应

**路由跳转两种方式**

1. 声明式：通过<router-link></router-link>组件进行跳转，<router-view />显示。

2. 编程式：通过路由实例进行跳转： this.$router

   this.$router.push("url")

   this.$router.push({path: 'url'})

   this.$router.push({name: 'routeName', params: {id: 1}})

   this.$router.push({psth: 'url', query: {id: 1}})

   **注意： params与path不能同时出现 **

## hash模式

1. 形如： localhost:8080/#/home/index
2. 原理： #后面 hash 值的变化，并不会导致浏览器向服务器发送请求，也不会刷新页面。每次 hash 值发生变化，会触发 `hashchange` 这个事件，可以通过监听 `hashchange` 事件得知 hash 值发生了哪些变化，并更新页面部分内容。
3. 缺点： 兼容性不好，部分低版本IE浏览器无 `hashchange` 这个事件。

## history 模式

1. 形如： localhost:8080/home/index
2. 原理，因为 html5 的发布，多了两个api， `pushState()` 和 `replaceState()` 。通过这两个api (1)可以改变 url 地址且不发送请求，(2)不仅可以读取历史记录栈，还可以对浏览器历史记录栈进行更改。
3. 缺点： 怕刷新，刷新会向后端发送请求。