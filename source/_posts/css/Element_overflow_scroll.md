---
title: 元素高度超出父级高度滚动展示
date: 2021-11-22 10:22:40
tags: 
  - css

categories: 
  - 不以by小经验
  - css
---

# 元素渲染展示
元素循环渲染到页面上，例如有如下数据：
```js
const list = [
  { title: '我是标题1', content: '我是标题1的内容' },
  { title: '我是标题2', content: '我是标题2的内容' },
  { title: '我是标题3', content: '我是标题3的内容' },
  { title: '我是标题4', content: '我是标题4的内容' },
  { title: '我是标题5', content: '我是标题5的内容' },
  { title: '我是标题6', content: '我是标题6的内容' },
  { title: '我是标题7', content: '我是标题7的内容' },
  { title: '我是标题8', content: '我是标题8的内容' },
  { title: '我是标题9', content: '我是标题9的内容' },
  { title: '我是标题10', content: '我是标题10的内容' },
]
```
通过循环渲染到页面上

```vue
<template>
  <div class="marquee-view">
    <ul class="marquee">
      <li class="row" v-for="(item, i) in list" :key="i">
        <p class="col">{{ item.title }}</p><p class="col">{{ item.content }}</p>
      </li>
    </ul>
  </div>
</template>

<style>
.marquee-view {
  margin: 0 auto;
  margin-top: 5%;
  width: 800px;
  height: 300px;
  overflow: hidden;
  border: 1px solid #ccc;
}

.marquee {
  background: none;
  display: block;
}

.row {
  width: 100%;
  line-height: 1.05;
  padding: 10px;
  color: #61a8ff;
  font-size: 16px;
  display: flex;
  justify-content: space-between;
}

.row:hover {
  background: rgba(255, 255, 255, 0.1);
}

.row .col {
  width: 50%;
  text-align: center;
}
</style>
```

![元素展示](https://github.com/Melanie618/Blog_Image/blob/main/images/css/scroll1.jpg?raw=true)

现在就是这个样子的，很明显有一个元素被隐藏掉了，而我们需要让所有元素都展示出来，这个时候有两种解决方式：
1. 调整父盒子高度，让元素展示出来
![调整父盒子高度](https://github.com/Melanie618/Blog_Image/blob/main/images/css/height-change.png?raw=true)
1. 让子级盒子内的元素滚动展示

# 元素滚动
这里是通过 css3 动画来实现元素滚动的
```css
@keyframes row {
  0% {}
  100% {
    transform: translateY(-50%);
  }
}

/* 调用动画 */
.marquee {
  /* //infinite永久调用动画 */
  animation: row 15s linear 1s infinite;
}


/*鼠标划入 停止动画  */
.marquee:hover {
  animation-play-state: paused;
}
```

说到这里顺便提一下 `animation` 的属性

|            值               |                  描述                    |
| :-------------------------: | :--------------------------------------: |
|      `animation-name`       |  规定需要绑定到选择器的 keyframe 名称。  |
|    `animation-duration`     | 规定完成动画所花费的时间，以秒或毫秒计。 |
| `animation-timing-function` |           规定动画的速度曲线。           |
|      `animation-delay`      |        规定在动画开始之前的延迟。        |
| `animation-iteration-count` |         规定动画应该播放的次数。         |
|    `animation-direction`    |      规定是否应该轮流反向播放动画。      |

语法：
```css
  animation: name duration timing-function delay iteration-count direction;
```

来看一下效果吧：
![滚动](https://github.com/Melanie618/Blog_Image/blob/main/images/css/scroll.gif?raw=true)

# 根据父级盒子高度滚动
通过上图又可以发现两个问题：
1. css3 动画会一直滚动，如果子级元素高度没有超过父级盒子高度想要不滚动怎么办
2. 这样滚动数据会空出一段，不好看，想要超出父级高度后让数据实现无缝循环展示

所以我们需要判断子级高度是否超出了父级盒子

```vue
<template>
  <div ref="marquee" class="marquee-view">
    <table ref="stop" class="marquee">
      <tr v-for="(item, i) in list" :key="i" class="row">
        <th class="col">{{ item.name }}</th>
        <th class="col">{{ item.value }}</th>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  methods: {
    getHeight() {
      this.Height = this.$refs.marquee.offsetHeight // 获取父级高度
      if (this.list.length * 30 > this.Height) { // this.list存放数据，当数据条数 * 展示的高度 超出父级高度
        this.list = this.list.concat(this.list)  // 叠加数据
      } else {
        this.$refs.stop.className = 'marquee stop' // 暂停滚动
      }
    }
  }
}
</script>

<style>
.marquee.stop {
  animation-play-state: paused;
}
</style>
```
来看一下效果
![无缝滚动](https://github.com/Melanie618/Blog_Image/blob/main/images/css/seamless_scrolling.gif?raw=true)