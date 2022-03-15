---
title: css3 animation动画
date: 2022-03-15 10:14:55
tags:
  - css3

categories: 
---
# css3判断animation动画是否完成，完成后暂停展示底部，然后重新开始
## 判断animation动画是否完成
1. 用计时器，设定一个和动画时长一样的time，time事件结束去执行这个函数。
```javascript
setTimeout(() => {
  ...
}, time)
```
2. 监听 `-webkit-animation` 动画结束事件
  开始事件：`webkitAnimationStart`
  结束事件：`webkitAnimationEnd`
  重复运动事件：`webkitAnimationIteration`

```javascript
Animation.addEventListener('webkitAnimationStart', function() { // 动画开始时事件 
  console.log('动画开始啦') // 动画开始时，控制台输出1 
}, false)
Animation.addEventListener('webkitAnimationEnd', function() { // 动画结束时的事件 
  console.log('动画结束啦') // 动画结束时，控制台输出2 
}, false)
Animation.addEventListener('webkitAnimationIteration', function() { // 动画重复运动时的事件 
  console.log('动画循环一次啦') // 每一次循环动作完成时，控制台输出3 
}, false)
```

*注意：在监听事件中，this指向会被改变，可以在外面定义 `const _this = this`

## 动画完成后暂停展示底部内容
在设置动画时通过设置 `animation-fill-mode` 属性来暂停
```css
.animation {
  animation: mymove 10s linear 1 2s;
  animation-fill-mode: forwards;
}
```

## 重新开始动画
如果要重新开始动画，加载一个相同的动画，不同名字，就可以达到重新开始动画的效果。
```css
@keyframes mymove {
  0% {}
  100% {
    transform: translateY(-50%);
  }
}
@keyframes mymove1 {
  0% {}
  100% {
    transform: translateY(-50%);
  }
}
.animation {
  animation: mymove 10s linear 1 2s;
}
.reset {
  animation: mymove1 10s linear 1 2s;
}
```
