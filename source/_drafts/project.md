---
title: 项目经验
# author: 不以by
date: 2021-09-03 17:38:08
tags: 
  - Vue
  - 项目

categories: 
  - 不以by小经验
  - 项目
  - 2.0.3
---
# 项目中遇到的问题及解决方法
除了遇到的问题，还有一些相关的功能方法类的总结

Array.prototype.includes()
https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/includes


JavaScript数组去重（12种方法，史上最全）
https://segmentfault.com/a/1190000016418021


数组对象同名value相加，删除同名项
```js
recursion(mock_data) {
  const newArray = []
  mock_data.map((item, index) => {
    if (newArray.find(ite => {
      return ite.name === item.name
    })) {
      // newArray[index].value = newArray[index].value + item.value
      newArray.map(newItem => {
        if (newItem.name === item.name) {
          newItem.value = (Number(newItem.value) + Number(item.value)).toString()
        }
      })
    } else if (item.name === '最新漏洞') {
      const obj1 = {}
      obj1.name = item.name
      obj1.value = item.value
      newArray.push(obj1)
    } else {
      if (Array.isArray(item.value)) {
        const obj1 = {}
        obj1.name = item.name
        obj1.value = this.recursion(item.value)
        newArray.push(obj1)
      } else {
        const obj1 = {}
        obj1.name = item.name
        obj1.value = (item.value).toString()
        newArray.push(obj1)
      }
    }
  })
  return newArray
}
```



数组对象同名删除名字
```js
const duplicate = {}
pointData.map(item => {
  if (duplicate.hasOwnProperty(item.name)) {
    item.name = ''
  } else {
    duplicate[item.name] = item.name
  }
  return pointData
})
```



项目经验
第一要解决的问题就是   理解需求  这个没有捷径，多接触多做重点要 多总结
第二对需求实现的评估，达到一个状态 “看完需求能立马想到怎么实现”
第三 时间评估，这个是最难的，因为你能把控的东西太少了，合理的前提下更从容一些