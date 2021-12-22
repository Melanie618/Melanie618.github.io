---
title: 组件动态渲染
date: 2021-11-22 11:29:40
tags: 
  - vue

categories: 
  - 不以by小经验
  - vue
---
目前有一个需求是：通过接口获取组件位置并进行渲染，位置是固定的，但模块可能会不同，
将目录 dir 下的组件渲染到 index.vue 上，常规做法是在 index.vue 中直接引入注册
目录结构：
├─ dir
    ├─ comp1.vue
    ├─ comp2.vue
    └─ ...
└─ index.vue

```js
import comp1 from './dir/comp1.vue'
import comp2 from './dir/comp2.vue'
...
export default {
  components: {
    comp1,
    comp2
    ...
  }
}
```

如果组件多可以通过或者获取文件名来进行组件注册
```js
const sections = {}
const files = require.context('./dir', true, /\.vue$/)
files.keys().forEach(key => {
  const component = files(key).default
  sections[component.name] = component
})
export default {
  components: {
    ...sections
  }
}
```

将组件渲染到页面上，可以通过动态遍历进行动态注册并渲染

## 解决方案
通过 <component :is="app"> 进行动态渲染：
```vue
<template>
  <div>
    <!-- 通过循环渲染，在 :is="" 中进行判断，例如判断 id， 如果没有符合的值 is 的值就为空，页面上就不会展示组件  -->
    <component :is="item.id === 1 ? item.component : ''" v-for="item in comps"></component>
  </div>
</template>

<script>
export default {
  data () {
    return {
      comps: []
    }
  },
  methods: {
    getComps() {
      const data = '接口返回的数据'
      data.forEach(item => {
        this.comps.push({ id: item.id, component: item.component }) // [{ id: 1, component: 'comps1' }, { id: 2, component: 'comps2' }... ]
      })
    }
  }
}
</script>
```

相关文档：https://zhuanlan.zhihu.com/p/35535469