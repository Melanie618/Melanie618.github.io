---
title: vue循环中key的作用
date: 2021-01-12 09:40:22
tags: 
  - vue

categories: 
  - Vue
---

# key

- **预期**：`number | string | boolean (2.4.2 新增) | symbol (2.5.12 新增)`

`key` 的特殊 attribute 主要用在 Vue 的虚拟 DOM 算法，在新旧 nodes 对比时辨识 VNodes。如果不使用 key，Vue 会使用一种最大限度减少动态元素并且尽可能的尝试就地修改/复用相同类型元素的算法。而使用 key 时，它会基于 key 的变化重新排列元素顺序，并且会移除 key 不存在的元素。

有相同父元素的子元素必须有**独特的 key**。重复的 key 会造成渲染错误。

最常见的是结合 `v-for` 使用：

```JavaScript
<ul>
  <li v-for="item in items" :key="item.id">...</li>
</ul>
```

它也可以用于强制替换元素/组件而不是重复使用它。当你遇到如下场景时它可能会很有用：

- 完整地触发组件的生命周期钩子
- 触发过渡

```javascript
<transition>
    <span :key="text">{{text}}</span>
</transition>
```

当`text`发生改变时，`<span>`总是会被替换而不是被修改，因此会引发过渡。