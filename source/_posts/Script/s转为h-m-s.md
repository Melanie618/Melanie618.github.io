---
title: 秒转化成 时分秒
date: 2022-04-11 14:09:45
tags: 
  - JavaScript

categories: 
  - JavaScript
---

```js
//秒转化成 时分秒
function secondToDate(result) {
  var h = Math.floor(result / 3600);
  var m = Math.floor((result / 60 % 60));
  var s = Math.floor((result % 60));
  return result = h + "小时" + m + "分钟" + s + "秒";
}
```