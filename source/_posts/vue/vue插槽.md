---
title: vue插槽
author: 不以by
email: promiseyou_dear@163.com
date: 2021-01-29 19:52:53
tags: 
  - Vue
  - slot

categories: 
  - Vue

---

# slot插槽

**作用：** 为了让组件更加具有扩展性。抽取共性，保留不同为插槽，让其他组件可以传递自己想展示的标签到预留插槽。

# 插槽的基本使用

1. 在组件中定义一个`<slot></slot>`标签即可
2. 如果插槽内具有共性的东西较多，可在插槽内设置默认值，当没有在插槽传入值时显示默认值
3. 如果有多个值，同时放入到组件中进行替换时，一起作为替换元素

## 1. 匿名插槽


```html
<div id="app">
	<mainview></mainview>
</div>
    
<!-- 组件模板 -->
<template id="view">
	<div>
		<slot>
			<button type="button">插槽默认值</button>
        </slot>
    </div>
</template>
    
<script type="text/javascript">
    var app = new Vue({
        el: "#app",
        components:{
            // view注册为一个局部组件
            mainview: {
                template: "#view"
            }
        }
    })
</script>
```
运行这段代码，组件会渲染<slot></slot>插槽里的默认内容。想要覆盖默认内容，只需要在组件中插入你需要显示的内容即可：

```html
<mainview>
	<button type="button" style="color: #42B983;">
		修改插槽
	</button>
</mainview>
```

修改之后，渲染的内容就会变成了我们在 `mainview` 中定义的内容。

这就是插槽 `<slot>` 一个基本使用，还是比较好理解的。

## 2. 具名插槽

假设我们要做一个博客页面，这个页面分为三个部分头部`header`, 内容`main`，底部`footer`，这三个模块我们都通过插槽来实现。

```html
<div id="app">
	<!-- 引用插槽 -->
	<base-layout>
		<template v-slot:header>
          <h1>这是头部header插槽内容</h1>
        </template>
        
        <template v-slot:default>
          <p>这是默认插槽的内容</p>
        </template>
        
        <template v-slot:footer>
          <p style="color: red;">这是footer插槽内容</p>
        </template>
        
      </base-layout>
</div>
    
<!-- 定义组件间模板 -->
<template id="layout">
    <div>
        <header>
            <!-- 定义具名插槽 -->
            <slot name="header"></slot>
        </header>
        <main>
            <slot></slot>
        </main>
        <footer>
            <slot name="footer"></slot>
        </footer>
    </div>
</template>

<script type="text/javascript">
    var app = new Vue({
        el: "#app",
        components:{
            // 局部注册组件
            BaseLayout: {
                template: "#layout"
            }
        }
    })
</script>
```

在layout组件中定义了三个插槽，其中header和footer通过slot的name属性制定了插槽的名称，main用一个默认插槽填充，其中header和footer两个具名插槽会精确地匹配 name传入相应的插槽，任何没有被包裹在带有 `v-slot` 的 `<template>` 中的内容都会被视为默认插槽的内容。

**`v-slot` 只能添加在 `<template>` 上** ，并且可以缩写为一个`#`，即把参数之前的所有内容 (`v-slot:`) 替换为字符 `#`。例如 `v-slot:header` 可以被重写为 `#header`：

## 3. 作用域插槽

作用域插槽就是在子组件预定义一个区块，之后想插入什么右父组件决定。

```html
<div id="app">
    <!-- 引入组件 -->
    <current-user></current-user>
</div>

<!-- 定义CurrentUser组件模板 -->
<template id="account">
    <div>
        <slot v-bind:user="user">
            {{ user.LastName }}
        </slot>
    </div>
</template>

<script type="text/javascript">
    var app = new Vue({
        el: "#app",
        components:{
            CurrentUser: {
                template:"#account",
                data:function(){
                    return {
                        user: {
                            fristName: "刘",
                            lastName: "德华"
                        }
                    }
                },
            }
        }
    })
</script>
```

首先我们定义了一个 `<current-user>` 的组件，这个组件的模板中定义了一个默认插槽并设置了一个初始值 `{{ user.lastName }}`，运行这段代码会看到如期渲染除了组建中传入的 `lastName` 的值，如果这个名字不让显示了，只让显示一个姓就行了，但是要在父组件中调用子组件的 frstName 覆盖掉插槽默认传入的 lastName 要怎么做呢？这时候就是作用域插槽出场的时候了！

首先，我们必须把子组件的user作为slot的元素属性通过v-bind绑定上去才可以，这个绑定在 `<slot>` 元素上的 属性 （user）被称为**插槽 prop**。

```html
<slot v-bind:user="user">
	{{ user.lastName }}
</slot>
```

在父级作用域中，我们可以使用带值的 `v-slot` 来定义我们提供的插槽 prop 的名字：

```html
<div id="app">
	<current-user>
		<template v-slot:default="slotProps">
          {{ slotProps.user.fristName }}
        </template>    
	</current-user>
</div>
```

**如果当我们提供的组件模板中有且仅有一个默认插槽时**，组件的标签可以被当做插槽的模板使用，**但是，默认插槽的缩写语法不能和具名插槽混用，因为它会导致作用域不明确！**

```HTML
<current-user>
    <!-- 简写 -->
	<template v-slot="slotProps">
		{{ slotProps.user.fristName }}
	</template>    
</current-user>
```

