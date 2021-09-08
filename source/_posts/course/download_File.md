---
title: 下载文件
# author: 不以by
date: 2021-09-03 17:38:08
tags: 
  - 下载文件
  - JavaScript
  - File

categories: 
  - 不以by小经验
  - File
---

## 静态文件下载
### 第1种：使用 a 标签下载
html中的a标签自带静态下载
```html
<a download="aaa.txt" href="./data-mock/aaa.txt"></a>
```
download 中的内容是要下载的文件名
href 中的路径要根据 index.html 来写，否则可能会提示： 失败未发现文件


### 第2种：创建一个点击事件
```vue
<template>
  <div class="help-center" name="downloadFile" @click="downloadClick">下载模板</div>
</template>

<script>
export default {
  methods: {
    downloadClick() {
      var link = document.createElement('a')
      link.setAttribute('download', '')
      link.href = './模板.zip'
      link.click()
    }
  }
}
</script>

```

## 从后端获取接口下载


```vue
<template>
<el-button type="warning" size="mini" @click="handleExport(row)">下载文件</el-button>
</template>

<script>
export default {
  methods: {
    handleExport(row) {
      // 根据接口需要添加 id
      fetch(`/api/${row.id}/download`, {
        headers: { 'TOKEN': token, 'Content-Type': 'application/x-www-form-urlencoded' }
        // 设置请求头和 token
      }).then(v => {
        // 通过 blob() 读取返回的数据，并进行判断
        v.blob().then(val => {
          // 判断返回的值中 type 属性是否能找到 'text/html' 或 'text/plain'，具体返回什么需要根据下载的文件判断，火狐浏览器和谷歌浏览器返回的值不同
          if (val.type.indexOf('text/html') !== -1 || val.type.indexOf('text/plain') !== -1) {
            // 返回值不等于 -1 说明查找到了，创建一个 a 标签，下载方法同 静态下载中的 a 标签
            var a = document.createElement('a')
            a.download = '下载文件.' + type
            a.href = URL.createObjectURL(val)
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
          } else {
            // 下载失败提示
            this.$message({
              title: 'Error',
              message: '下载失败',
              type: 'error',
              duration: 2000
            })
          }
        })
      })
    }
  }
}
</script>
```
参考文档：
静态下载 https://blog.csdn.net/github_39096247/article/details/108365018
获取接口 https://www.cnblogs.com/ldlx-mars/p/10647091.html
