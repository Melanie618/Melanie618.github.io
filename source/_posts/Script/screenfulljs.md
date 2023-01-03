---
title: screenfull全屏
date: 2022-03-09 11:13:54
tags: 
  - vue

categories: 
  - Vue
---
# 在 vue 中使用 screenfull.js 全屏插件
首先使用 npm 下载 screenfull.js 插件
```js
npm install --save screenfull
```

在需要用到的组件中引入
```javascript
import screenfull from 'screenfull'
```

定义一个全屏点击事件

```vue
<template>
  <button class="el-icon-full-screen" @click="clickFullscreen">点击全屏</button>
</template>

<script>
import screenfull from 'screenfull'
export default {
  name: 'Screenfull',
  data() {
    return {
      isclick: false // 当 isclick 为false时，为非全屏状态 为true时，为全屏状态
    }
  },
  mounted() {
    // 点击 ESC 退出全屏状态
    const self = this // 如果不定义 this 使用时会报错
    window.addEventListener('resize', function() {
      if (!self.checkFull()) {
        if (self.isclick) {
          self.isFullscreen = false
          self.isclick = !self.isclick
          self.$emit('onChange', false)
        } else {
          self.isFullscreen = false
          self.isclick = !self.isclick
          self.$emit('onChange', false)
        }
      }
    })
  },
  methods() {
    clickFullscreen() {
      this.isclick = !this.isclick
      screenfull.toggle()
      this.isFullscreen = true
      if (this.isclick) { // isclick 为true 控制为全屏
        this.$emit('onChange', true)
      } else { // isclick 为false 控制为非全屏
        this.$emit('onChange', false)
      }
    },
    checkFull() {
      var isFull = document.webkitIsFullScreen // 点击进入全屏状态时为 true， 退出全屏状态时为 false
      return isFull
    }
  }
}
</script>
```

