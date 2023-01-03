---
title: codeMirror封装
# author: 不以by
date: 2022-12-19 11:09:05
tags: 
  - codeMirror
  - 不以by小经验

categories: 
---
# vue2使用 codeMirror
vue3的版本叫vue-codemirror，vue2的版本叫codemirror。
使用 vue2 得指定版本号，不指定就是默认最新，版本6以上都是vue3的版本，引入使用会报错。
## 安装 codeMirror
我这里使用的5.46.0版本的，vue2.7，如果各位小伙伴5.46.0的版本不支持就安装5以下版本吧
```js
yarn add codemirror@5.46.0
// or npm install codemirror@5.46.0
```

## 封装 codeMirror 组件
主题请参考官网CodeMirror: Theme Demo，注意：使用主题前记得引入哦（主题位置有注释）
```vue
<template>
  <div class="common-editor">
    <textarea ref="textarea" v-model="value"></textarea>
  </div>
</template>
 
<script>
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/darcula.css' // codeMirror 主题
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/addon/hint/show-hint.js'
import 'codemirror/addon/hint/show-hint'
import 'codemirror/addon/hint/javascript-hint'
import 'codemirror/addon/hint/sql-hint'
import 'codemirror/mode/javascript/javascript'
// 以下为 codeMirror 支持的语言，下面只展示了一部分，各位小伙伴可以自行添加
import 'codemirror/mode/markdown/markdown'
import 'codemirror/mode/sql/sql'
import 'codemirror/mode/php/php'
import 'codemirror/mode/python/python'
import 'codemirror/mode/shell/shell'
import 'codemirror/mode/powershell/powershell'
import 'codemirror/mode/yaml/yaml.js'
 
const CodeMirror = require('codemirror/lib/codemirror')
 
export default {
  name: 'CodeMirror',
  props: {
    value: {
      type: String,
      default: ''
    },
    language: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      CommonEditor: false,
      code: '',
      coder: null,
      mode: 'javascript',
      theme: 'default',
      modes: [
        { value: 'javascript', label: 'Javascript' },
        { value: 'x-java', label: 'Java' },
        { value: 'x-python', label: 'Python' },
        { value: 'x-sql', label: 'SQL' },
        { value: 'x-shell', label: 'Shell' },
        { value: 'x-powershell', label: 'PowerShell' },
        { value: 'x-php', label: 'PHP' },
        { value: 'x-yaml', label: 'Yaml' }
      ],

      coderOptions: {
        line: true,
        mode: 'yaml', // json数据高亮
        theme: 'darcula', // 设置主题 记得引入对应主题才有显示   import 'codemirror/theme/blackboard.css'
        tabSize: 1,
        readOnly: '',
        lineNumbers: true, // 显示行号
        cursorHeight: 0.8, // 光标高度，默认是1
        autoCloseBrackets: true,
        matchBrackets: true, // 括号匹配
        lineWrapping: 'wrap', // 文字过长时，是换行(wrap)还是滚动(scroll),默认是滚动
        showCursorWhenSelecting: true, // 文本选中时显示光标
        smartIndent: true, // 智能缩进
        completeSingle: false // 当匹配只有一项的时候是否自动补全
      }
    }
  },
  watch: {
    language: {
      handler(language) {
        this.getCoder().then(() => {
          // 尝试从父容器获取语法类型
          if (language) {
            // 获取具体的语法类型对象
            const modeObj = this.getLanguage(language)
            // 判断父容器传入的语法是否被支持
            if (modeObj) {
              this.mode = modeObj.label
              this.coder.setOption('mode', `text/${modeObj.value}`)
            }
          }
        })
      },
      immediate: true
    }
  },
  mounted() {
    // 初始化
    this.initialize()
  },
  methods: {
    // 初始化
    initialize() {
      // 初始化编辑器实例，传入需要被实例化的文本域对象和默认配置
      this.coder = CodeMirror.fromTextArea(
        this.$refs.textarea,
        this.coderOptions
      )
      this.coder.on('inputRead', () => {
        this.coder.showHint()
      })
      // 编辑器赋值
      if (this.value || this.code) {
        this.setCodeContent(this.value || this.code)
      } else {
        this.coder.setValue('')
      }
      // 支持双向绑定
      this.coder.on('change', (coder) => {
        this.code = coder.getValue()
        if (this.$emit) {
          this.$emit('input', this.code)
        }
      })
    },
    setCodeContent(val) {
      setTimeout(() => {
        if (!val) {
          this.coder.setValue('')
        } else {
          this.coder.setValue(val)
        }
      }, 300)
    },
    getCoder() {
      const that = this
      return new Promise((resolve) => {
        (function get() {
          if (that.coder) {
            resolve(that.coder)
          } else {
            setTimeout(get, 10)
          }
        })()
      })
    },
    getLanguage(language) {
      // 在支持的语法类型列表中寻找传入的语法类型
      return this.modes.find((mode) => {
        // 所有的值都忽略大小写，方便比较
        const currentLanguage = language.toLowerCase()
        const currentLabel = mode.label.toLowerCase()
        const currentValue = mode.value.toLowerCase()
 
        // 由于真实值可能不规范，例如 java 的真实值是 x-java ，所以讲 value 和 label 同时和传入语法进行比较
        return (
          currentLabel === currentLanguage || currentValue === currentLanguage
        )
      })
    },
    changeMode(val) {
      // 修改编辑器的语法配置
      this.coder.setOption('mode', `text/${val}`)
      // 获取修改后的语法
      const label = this.getLanguage(val).label.toLowerCase()
      // 允许父容器通过以下函数监听当前的语法值
      this.$emit('language-change', label)
    }
  }
}
</script>
<style lang="less">
.common-editor {
  width: 100%;
  height: 100%;
  .CodeMirror {
    // color: #ccc;
    direction: ltr;
    line-height: 20px;
    width: 100%;
    height: 100%;
    // background-color: #000;
  }
 
  .CodeMirror-hints {
    z-index: 9999 !important;
  }
  .custom-class .CodeMirror {
    width: 100%;
  }
}
.CodeMirror-hints {
  z-index: 1000;
}
</style>
```


## 使用
```vue
<template>
  <div>
    <code-mirror
      :value="codeContent.codetext"
      language="sql"
      @input="changeTextarea"
      style="height:80vh"
    ></code-mirror>
  </div>
</template>
 
 
<script>
import CodeMirror from '@/components/codeMirror.vue'
 
export default {
  components: { CodeMirror },
  data() {
    return {
      codeContent: {
        codetext: 'select * from Data'
      }
    }
  },
  methods: {
    // codeMirror 双向绑定
    changeTextarea(val) {
      this.codeContent.codetext = val
    }
  }
}
</script>
```



