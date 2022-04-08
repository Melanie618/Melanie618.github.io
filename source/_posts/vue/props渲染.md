---
title: vue父组件异步传值，子组件获取props并渲染
date: 2022-04-08 10:40:04
tags: 
  - vue

categories: 
  - Vue
---
# 问题
昨天在写需求时遇到一个问题，父组件异步获取数据传递给子组件，子组件通过props获取监听不到内容
如图：需要给这个组件传值并渲染
![需求](https://cdn.jsdelivr.net/gh/Melanie618/CDN@v1.1/images/vue/MVVM.png?raw=true)
因为并不是一个接口获取值得，所以定义了一个对象 `PanelTotal`
```js
data() {
  return {
    PanelTotal: {
      first: {},
      second: {},
      third: {},
      fourth: {}
    }
  }
}
```

但在子组件却监听不到数据，为此我尝试了多种方法：
1. 将 `PanelTotal` 中的值改为数组格式
2. 将 `PanelTotal` 中的单独列出
3. ......

无一例外都失败了

# 解决方案
按照以上方法尝试过后心情很烦躁，于是出去走走放松了一下，此时我想到一个新思路，单独查找了**Vue 中 props监听变化的几种方式**，终于找到了解决方法：
深度监听的引用类型中，通过计算属性得到引用类型的内部某个字段，再使用侦听器监听该字段的变化
```js
props: {
  chartData: {
    type: Object,
    default() {
      return {}
    }
  }
},
computed: {
  first() {
    return this.chartData.first
  },
  second() {
    return this.chartData.second
  },
  third() {
    return this.chartData.third
  },
  fourth() {
    return this.chartData.fourth
  }
}
```
这样就解决了！
注意：因为在dom元素中设置了 `v-if` 判断，所以 `PanelTotal` 中的值要设置为 `{}` 格式，否则可能会导致元素移位哦
