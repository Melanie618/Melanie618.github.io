---
title: Cherry-Markdown api
# author: 不以by
date: 2022-01-06 14:16:49
tags: 
  - vue
  - 不以by小经验
  - cherry-markdown

categories: 
  - Vue
  - Cherry-Markdown
---

# Cherry API
-----

## serMarkdown(val:string)
-----
设置内容。cherry-markdown除了在初始化时绑定value设置内容，还可以通过 `serMarkdown()` 设置内容

```js
this.cherryInstance.serMarkdown('设置内容')
```

## insert(content:string)
-----
在光标处或者指定行+偏移量插入内容

> insert(`content`, `isSelect`, `anchor`, `focus`)

- `content` 被插入的文本
- `isSelect` 是否选中刚插入的内容，默认 false，不选中
- `anchor` [x, y] 代表 x + 1 行，y + 1 字符偏移量，默认 false 会从光标处插入
- `focus` 保持编辑器处于 focus 状态，默认 true，选中编辑器（用户可以继续输入）

```js
this.cherryInstance.insert("在光标处插入内容")
this.cherryInstance.insert("在第二行插入内容，并选中插入的内容", true, [1,0])
```

## getMarkdown()
-----
获取markdown内容。cherry-markdown无法使用 watch 监听 value 变化，可以通过 `getMarkdown()` 来获取value值

```js
this.cherryInstance.getMarkdown()
```

## getHtml()
-----
获取渲染后的html内容。返回值为html字符串

```js
this.cherryInstance.getHtml()
```

## export(type:string)
-----
导出预览区域的内容，`type：{'pdf'|'img'}`

```js
// 导出pdf格式
this.cherryInstance.export()
// 导出长图格式
this.cherryInstance.export('img')
```

## switchModel(model:string)
-----
切换模式：`{'edit&preview'|'editOnly'|'previewOnly'}`。

```js
// 双栏编辑模式
this.cherryInstance.switchModel('edit&preview')
// 纯编辑模式
this.cherryInstance.switchModel('editOnly')
// 只读模式
this.cherryInstance.switchModel('previewOnly')
```

## getToc()
-----
获取由标题组成的目录

```js
this.cherryInstance.getToc()
```

## getCodeMirror()
-----
获取左侧编辑器实例

```js
this.cherryInstance.getCodeMirror()
```

## getPreviewer()
-----
获取右侧预览区对象实例

```js
this.cherryInstance.getPreviewer()
```

# Cherry.engine API
-----

## engine.makeHtml(markdown:string)
-----
将markdown字符串渲染成Html

```js
this.cherryInstance.engine.makeHtml('This is `inline code`')
```

## engine.makeMarkdown(html:string)
-----
将html字符串渲染成markdown

```js
var html = `<p>This is <code>inline code</code></p>`
this.cherryInstance.engine.makeMarkdown(html)
```

# Cherry.toolbar.toolbarHandlers API
-----

## toolbar.toolbarHandlers.bold()
-----
向cherry编辑器中插入加粗语法

```js
this.cherryInstance.toolbar.toolbarHandlers.bold()
```

## toolbar.toolbarHandlers.italic()
-----
向cherry编辑器中插入斜体语法

```js
this.cherryInstance.toolbar.toolbarHandlers.italic()
```

## toolbar.toolbarHandlers.header(level:int)
-----
向cherry编辑器中插入标题语法

```js
this.cherryInstance.toolbar.toolbarHandlers.header(1)
this.cherryInstance.toolbar.toolbarHandlers.header(2)
this.cherryInstance.toolbar.toolbarHandlers.header(4)
```

## toolbar.toolbarHandlers.strikethrough()
-----
向cherry编辑器中插入删除线语法

```js
this.cherryInstance.toolbar.toolbarHandlers.strikethrough()
```

## toolbar.toolbarHandlers.list(type:string)
-----
向cherry编辑器中插入有序、无序列表或者checklist语法

| level |   效果    |
| :---: | :-------: |
|  '1'  |  ol 列表  |
|  '2'  |  ul 列表  |
|  '3'  | checklist |

```js
// 有序列表
this.cherryInstance.toolbar.toolbarHandlers.list(1)
// 无序列表
this.cherryInstance.toolbar.toolbarHandlers.list('2')
// checklist
this.cherryInstance.toolbar.toolbarHandlers.list(3)
```

## toolbar.toolbarHandlers.insert(type:string)
-----
向cherry编辑器中插入特定语法

|          type          |                         效果                          |
| :--------------------: | :---------------------------------------------------: |
|          'hr'          |                        删除线                         |
|          'br'          |                       强制换行                        |
|         'code'         |                        代码块                         |
|       'formula'        |                       行内公式                        |
|      'checklist'       |                        检查项                         |
|         'toc'          |                         目录                          |
|         'link'         |                        超链接                         |
|        'image'         |                         图片                          |
|        'video'         |                         视频                          |
|        'audio'         |                         音频                          |
|     'normal-table'     |                   插入3行5列的表格                    |
| 'normal-table-row*col' | 如 `normal-table-2*4` 插入2行(包含表头是3行)4列的表格 |

```js
// 插入 3 * 4 的表格
this.cherryInstance.toolbar.toolbarHandlers.insert('normal-table-3*4')
// 插入 checklist
this.cherryInstance.toolbar.toolbarHandlers.insert('checklist')
```

## toolbar.toolbarHandlers.graph(type:string)
-----
向cherry编辑器中插入画图语法

|  id  |  效果  |
| :--: | :----: |
| '1'  | 流程图 |
| '2'  | 时序图 |
| '3'  | 状态图 |
| '4'  |  类图  |
| '5'  |  饼图  |
| '6'  | 甘特图 |

```js
// 插入流程图
this.cherryInstance.toolbar.toolbarHandlers.graph(1)
// 插入时序图
this.cherryInstance.toolbar.toolbarHandlers.graph('2')
// 插入类图
this.cherryInstance.toolbar.toolbarHandlers.graph(4)
```