---
title: webpack中loader的使用方法
author: 不以by
email: promiseyou_dear@163.com
date: 2021-01-18 19:05:12
tags: 
  - webpack
  - loader

categories: 
---

# loader

`loader` 用于对模块的源代码进行转换。 `loader` 可以使你在 `import` 或“加载”模块是预处理文件。loader 可以将文件从不同的语言转换为 JavaScript。

## 安装

首先安装相对应的 loader：

```
npm install --save-dev css-loader
npm install --save-dev ts-loader
```

然后指示 webpack 对每个 `.css` 使用 `css-loader`，以及对所有 `.ts` 文件使用 `ts-loader`：

**webpack.config.js**

```javascript
module.exports = {
  module: {
    rules: [
      { test: /\.css$/, use: 'css-loader' },
      { test: /\.ts$/, use: 'ts-loader' }
    ]
  }
};
```

## 使用 loader

在你的应用程序中，有三种使用 loader 的方式：

- 配置（推荐）：在 **webpack.config.js** 文件中指定 loader。
- 内联：在每个 `import` 语句中显式指定 loader。

### 配置[Configuration]

`module.rules` 允许你在 webpack 配置中指定多个 loader。 这是展示 loader 的一种简明方式，并且有助于使代码变得简洁。同时让你对各个 loader 有个全局概览：

```javascript
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              modules: true
            }
          }
        ]
      }
    ]
  }
```

### 内联

可以在 `import` 语句或任何等效于 "import" 的方式中指定 loader。使用 `!` 将资源中的 loader 分开。分开的每个部分都相对于当前目录解析。

```js
import Styles from 'style-loader!css-loader?modules!./styles.css';
```

通过前置所有规则及使用 `!`，可以对应覆盖到配置中的任意 loader。

> *尽可能使用* `module.rules`*，因为这样可以减少源码中的代码量，并且可以在出错时，更快地调试和定位 loader 中的问题。*

## loader 特性

- loader 支持链式传递。能够对资源使用流水线(pipeline)。一组链式的 loader 将按照相反的顺序执行。loader 链中的第一个 loader 返回值给下一个 loader。在最后一个 loader，返回 webpack 所预期的 JavaScript。
- loader 可以是同步的，也可以是异步的。
- loader 运行在 Node.js 中，并且能够执行任何可能的操作。
- loader 接收查询参数。用于对 loader 传递配置。
- loader 也能够使用 `options` 对象进行配置。
- 除了使用 `package.json` 常见的 `main` 属性，还可以将普通的 npm 模块导出为 loader，做法是在 `package.json` 里定义一个 `loader` 字段。
- 插件( plugin )可以为 loader 带来更多特性。
- loader 能够产生额外的任意文件。

loader 通过（loader）预处理函数，为 JavaScript 生态系统提供了更多能力。

## 解析 loader

loader 遵循标准的模块解析。多数情况下，loader 将从模块路径（通常将模块路径认为是 `npm install`, `node_modules`）解析。

loader 模块需要导出为一个函数，并且使用 Node.js 兼容的 JavaScript 编写。通常使用 npm 进行管理，但是也可以将自定义 loader 作为应用程序中的文件。按照约定，loader 通常被命名为 `xxx-loader`（例如 `json-loader`）。