---
title: 表单循环渲染动态数据
# author: 不以by
date: 2021-09-26 16:18:08
tags: 
  - vue
  - ElementUI
  - 动态数据
  - 循环渲染

categories: 
  - 不以by小经验
---

不知道大家在写项目的时候有没有遇到过这个需求：
“我要把返回的元素都放在表单里，点修改可以一起修改，不用一个一个去点修改”
是的，我遇到了

经过我多次尝试，以及查阅各种资料后，终于完美解决了这个需求（不知道大神看来完不完美，反正我觉得很完美）


首先我们要在data中定义参数

## 在data中定义参数
如果设置 `temp: []` 获取数据时直接 push 的话会导致 v-model 不能实时渲染，
这是因为 Vue 无法检测 property 的添加或移除。由于 Vue 会在初始化实例时对 property 执行 getter/setter 转化，所以 property 必须在 data 对象上存在才能让 Vue 将它转换为响应式的。

如果你想在对象中添加对象也是可以的，但是会出现 v-model 没绑定的状态，具体原理我也不知

如果直接设置
```js
temp: [
  { id: '', value: ''},
  { id: '', value: ''}
]
```
会报这个错`"Invalid prop: type check failed for prop "model". Expected Object, got Array"`

因为在 el-form 上绑定了 `:model="temp"`,而它只能传递一个对象，所以我们可以将 temp 设置为一个对象，在对象内添加数组，就是这样：
```js
temp: {
  formData: [
    { id: '', value: ''},
    { id: '', value: ''}
  ]
}
```
这样引入就不会报错了

## 获取参数
定义完参数就该获取参数值了，可以通过获取列表的进行 push，一般接口返回的数据都是数组格式的，可以将接口返回的值进行 forEach 循环，再将需要的值通过 this.temp.formData.push 添加
```js
getList() {
  getList().then(response => {
    const list = response.response
    list.forEach(item => {
      this.temp.formData.push({
        key: item.key,
        name: item.name,
        uuid: item.uuid,
        value: item.value
      })
    })
  })
}
```

## 页面渲染
获取了参数后，可以通过 v-for 循环进行动态渲染，需要注意的点是 prop 的写法，需要与 v-model 使用的属性名相对应，而且要与 rules 相同，可以将 rules 写在行内，但要注意把 el-form 上的 :rules="rules" 去掉

```html
<el-form ref="dataForm" :model="temp" label-position="right" label-width="170px" style="margin:0 50px;" :close-on-click-modal="false">
  <el-form-item v-for="(item, index) in temp.formData" :key="index" :label="item.name" :prop="'formData.'+index+'.value'" :rules="{required:true,message:'请输入'+item.name+'的值内容',trigger:'blur'}">
    <el-input v-model="item.value" />
  </el-form-item>
</el-form>
```

这里使用了 prop 的链式写法
因为 formData 是一个数组，'formData.'+index+'.value' 相当于 'formData[' + index + '].value'，关键在于 prop 传递的是一个字符串
以上这两种方式传值最终都是转换成了 formData.0.value 字符串，这是一个字符串，而不是通过 formData.0 来取 formData 数组的第一个元素

如果在过程中经常遇到 `Error in mounted hook : Error:please transfer a valid prop path to form item` 这个问题，那就去检查一下是不是 prop 和 v-model 是不是匹配的


## 动态增减表单项
官方文档：https://element.eleme.cn/#/zh-CN/component/form
添加一个点击事件就好了
```html
<el-button @click="handleAdd">新增</el-button>
```
```js
handleAdd() {
  this.temp.formData.push({
    key: '',
    name: '',
    uuid: '',
    value: ''
  })
}
```