---
title: Cherry-Markdown在vue中使用
# author: 不以by
date: 2022-01-05 10:48:54
tags: 
  - vue
  - 不以by小经验
  - cherry-markdown

categories: 
  - Vue
  - Cherry-Markdown
---

# Cherry Markdown Editor
------

## 介绍

------

Cherry Markdown Editor 是一款 Javascript Markdown 编辑器，具有开箱即用、轻量简洁、易于扩展等特点. 它可以运行在浏览器或服务端(NodeJs)。

开发者可以使用非常简单的方式调用并实例化Cherry Markdown编辑器，实例化的编辑器默认支持大部分常用的markdown语法（如标题、目录、流程图、公式等）。

当 Cherry Markdown 编辑器支持的语法不满足开发者需求时，可以快速的进行二次开发或功能扩展。同时，CherryMarkdown编辑器应该由纯JavaScript实现，不应该依赖angular、vue、react等框架技术，框架只提供容器环境即可。

## 安装

------
通过 yarn
```
yarn add cherry-markdown
```
通过 npm
```
npm install cherry-markdown --save
```

## Quick start

-----
```vue
<template>
  <div id="markdown1" ref="markdown1" />
</template>
<script>
import Cherry from 'cherry-markdown'
export default {
  name: 'Cherry',
  data() {
    return {
      editor: null
    }
  },
  mounted() {
    // Cherry实例化要在dom元素挂载完成后进行，此时Cherry实例会在 div#maekdown1 内展示
    this.init()
  },
  methods: {
    init() {
      this.cherryInstance = new Cherry({
        id: 'markdown1',
        value: '# welcome to cherry editor!'
      })
    }
  }
}
</script>
```
![cherry-markdown]()

## 基础配置

```js
this.cherryInstance = new Cherry({
  id: 'markdown1',
  value: '# welcome to cherry editor!',
  editor: {
    theme: 'default'
  },
  toolbars: {
    theme: 'light',
    toolbar: ['bold', 'italic', 'underline', 'strikethrough', '|', 'color', 'header', '|', 'list', { insert: ['image', 'link', 'br', 'formula', 'toc', 'table', 'line-table', 'bar-table', 'word'] }, 'settings'],
    bubble: ['bold', 'italic', 'underline', 'strikethrough', 'sub', 'sup', '|', 'size', 'color'],
    float: ['h1', 'h2', 'h3', '|', 'checklist', 'quote', 'quickTable', 'code'],
    customMenu: []
  }
  engine: {
    syntax: {
      table: {
        enableChart: false,
        externals: [ 'echarts' ]
      },
    },
    customSyntax: {}
  },
  externals: {},
  fileUpload(file, callback) {
    // api.post(file).then(url => {
    //   callback(url)
    // })
  }
})
```
[详细配置]()

## 使用多个
在一个页面上要调用多个 cherry-markdown 组件时，可以通过props设置 cherry-markdown 的id，根据id进行显示，并设置ref来获取相对应的数据
```vue
<template>
  <CherryMarkdown v-model="value1" :editor-type="'markdown1'" ref="headerChild1" />
  <CherryMarkdown v-model="value2" :editor-type="'markdown2'" ref="headerChild2" />
  <CherryMarkdown v-model="value3" :editor-type="'markdown3'" ref="headerChild3" />
  <button @click="handleClick">确定</button>
</template>

<script>
export default {
  methods: {
    handleClick() {
      console.log(this.$refs.headerChild1.editor.getMarkdown()) // 这里的 editor 是 cherry-markdown 中定义的变量
      console.log(this.$refs.headerChild2.editor.getMarkdown())
      console.log(this.$refs.headerChild3.editor.getMarkdown())
    }
  }
}
</script>

<!-- Cherry-Markdown 页面 -->

<template>
  <div :id="editorType" :ref="editorType" />
</template>

<script>
import Cherry from 'cherry-markdown'
export default {
  name: 'Cherry',
  props: {
    value: {
      type: String,
      default: ''
    },
    editorType: {
      type: String,
      str: '',
      default: 'markdown1'
    }
  },
  data() {
    return {
      editor: null
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.editor = new Cherry({
        id: this.editorType,
        value: this.value,
        editor: { theme: 'default', height: '400px' },
        toolbars: {
          theme: 'light',
          toolbar: ['bold', 'italic', 'underline', 'strikethrough', '|', 'color', 'header', '|', 'list', { insert: ['image', 'link', 'hr', 'br', 'code', 'formula', 'toc', 'table', 'line-table', 'bar-table', 'word'] }, 'settings'],
          bubble: ['bold', 'italic', 'underline', 'strikethrough', 'sub', 'sup', '|', 'size', 'color'],
          float: ['h1', 'h2', 'h3', '|', 'checklist', 'quote', 'quickTable', 'code'],
          customMenu: []
        },
        engine: {
          syntax: {
            list: {
              listNested: true
            },
            table: {
              enableChart: false,
              externals: ['echarts']
            },
            codeBlock: {
              customRenderer: {}
            }
          },
          customSyntax: {}
        },
        externals: {},
        fileUpload(file, callback) {}
      })
      this.editor.setMarkdown(this.editor.engine.makeMarkdown(this.value))
    }
  }
}
</script>
```

