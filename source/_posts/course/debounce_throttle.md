---
title: 防抖节流封装
# author: 不以by
date: 2021-09-02 17:38:08
tags: 
  - 防抖节流
  - debounce
  - throttle
  - 不以by小经验

categories: 
---
# 防抖节流
### 防抖 debounce
一定时间内仅执行一次，如果未到截止时间再次触发，则重新计算（也就是说如果一直不停的触发，那么这个函数一直不会执行，直到停止触发并且到了时间才会被执行）
应用场景：登录点击

### 节流 throttle
一定时间内仅执行一次，如果未到截止时间再次触发，则触发不会生效（也就是说如果一直不停的触发，也只会每固定时间间隔执行一次，在时间范围内无法触发事件）
应用场景：搜索框输入即时搜索

##
首先在 src/utils 文件夹下创建 utils.js 文件

## 代码
```js
/* 防抖节流函数 */
let timeout = null // 创建一个标记用来存放定时器的返回值
let canRun = true

// 防抖,用于搜索框搜索
export function debounce(fn) {
  return function() {
    clearTimeout(timeout) // 每当用户输入的时候把前一个 setTimeout clear 掉
    timeout = setTimeout(() => { // 然后又创建一个新的 setTimeout, 这样就能保证输入字符后的 interval 间隔内如果还有字符输入的话，就不会执行 fn 函数
      fn.apply(this, arguments)
    }, 1500)
  }
}

// 节流,用于提交
export function throttle(fn) {
  return function() {
    if (!canRun) return
    canRun = false
    setTimeout(function() {
      fn.apply(this, arguments)
      canRun = true
    }, 100)
  }
}
// 调用方法
```

在 main.js 全局引入

```js
import * as utils from '../common/utils.js';
Vue.use(utils) // 引用这个utils
Vue.prototype.$utils = utils // 全局请求方法
```


调用方法
```vue
this.$utils.throttle(() => {
  // 代码块
})()
```

##
参考文档：
https://blog.csdn.net/abuanden/article/details/115499301
https://blog.csdn.net/Yu_Jian_Qt/article/details/107835536