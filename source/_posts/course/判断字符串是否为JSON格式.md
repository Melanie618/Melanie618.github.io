---
title: 判断字符串是否为 JSON 格式
# author: 不以by
date: 2021-11-22 14:48:14
tags: 
  - JavaScript
  - 不以by小经验

categories: 
  - JavaScript
---
在字符串使用中数据可能是 JSON 字符串，也可能是普通字符串，而这个时候需要进行判断，当为 JSON 字符串时需要进行转换才能使用
当字符串不是 JSON 格式时，直接使用 `JSON.parse()` 进行转换会导致报错 `Uncaught SyntaxError: Unexpected token a in JSON at position 0`,所以需要判断字符串是否为JSON格式，再根据返回的结果转换

## 解决方案
```js
isJSON(str) {
  if (typeof str === 'string') {
    try {
      var obj = JSON.parse(str)
      if(typeof obj == 'object' && obj ){
      return true
      }else{
        return false
      }
    } catch(e) {
      return false
    }
  }
}
```

相关文档：https://www.cnblogs.com/lanleiming/p/7096973.html