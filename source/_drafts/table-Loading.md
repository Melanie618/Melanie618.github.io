---
title: 表格按钮添加loading
# author: 不以by
date: 2022-02-22 15:00:22
tags: 
  - 不以by小经验

categories: 
---

获取到数据后通过 `forEach` 循环添加 `loading` 会出现两种情况
1. 所有按钮都出现了 `loading`
2. `loading` 未生效

解决办法：
通过 `for in` 进行添加，再点击按钮操作 `btnLoading` 就可以啦
```vue
<template>
  <el-table-column
    label="操作"
    fixed="right"
    width="240"
  >
    <template slot-scope="{row}">
      <el-button type="primary" icon="el-icon-view seeMore" :loading="row.btnLoading" @click="clickSeeMore(row)">查看</el-button>
    </template>
  </el-table-column>
</template>
```
```js
for (cont i in data) {
  data[i].btnLoading = false
}

clickSeeMore(row) {
  row.btnLoading = ture
  ...
  row.btnLoading = false
}
```