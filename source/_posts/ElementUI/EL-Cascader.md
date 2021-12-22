---
title: el-cascader点击文字选中
# author: 不以by
date: 2021-12-10 16:13:55
tags: 
  - vue
  - ElementUI
  - 不以by小经验

categories: 
  - vue
  - ElementUI
---
## 多选模式
```html
<el-cascader
  v-model="data"
  :options="options"
  :props="{ multiple: true }"
  filterable
/>
```

```css
.el-cascader-panel .el-checkbox {
  width: 100%;
  height: 100%;
  z-index: 10;
  position: absolute;
}
.el-cascader-node__label{
  margin-left: 10px;
}
/* 这个样式针对IE有用，不考虑IE的可以不用管*/
.el-cascader-panel .el-cascader-node__postfix {
  top: 10px;
}
```

## 单选模式
```css
.el-cascader-panel .el-radio {
  width: 100%;
  height: 100%;
  z-index: 10;
  position: absolute;
  top: 10px;
  right: 10px;
}

.el-cascader-panel .el-radio__input {
  visibility: hidden;
}

.el-cascader-panel .el-cascader-node__postfix {
  top: 10px;
}
```