---
title: vue组件通信的八种方式
author: 不以by
email: promiseyou_dear@163.com
date: 2021-01-09 17:31:18
tags: 
  - Vue

categories: 
  - Vue
---

对于 vue 来说，组件是 vue 最强大的功能之一，而组件实例的作用域是互相独立的，这些组件之间数据无法相互引用，所以组件之间的消息传递是非常重要的。

## 1. props 和 $emit

父组件通过 props 向子组件传递数据，子组件通过$emit触发事件向父组件传递数据

```javascript
vue.component('parent', {
    template: `
		<div>
			<p>this is parent component!</p>
			<child :message="message" @getChildData="getChildData"></child>
		</div>
	`,
    data() {
        return {
            message: 'hello'
        }
    },
    methods: {
        // 执行子组件触发的事件
        getChildData(val) {
            console.log(val)
        }
    }
})
vue.component('child', {
    data() {
        return {
            myMessage: this.message
        }
    },
    template: `
		<div>
			<input type="text" v-model="myMessage" @input="passData(myMessage)" />
		</div>
	`,
    props: ['message'], // 得到父组件传递过来的数据
    methods: {
        passData(val) {
            // 触发父组件中的事件
            this.$emit('getChildData', val)
        }
    }
})
var app = new Vue({
    el: '#app',
    template: `
		<div>
			<parent></parent>
		</div>
	`
})
```

## 2.  $attrs 和 $listeners

如果父组件A下面有子组件B，组件B下面有组件C,这时组件A想传递数据给组件C，如果通过上一种方法让组件A通过prop传递消息给组件B，组件B在通过prop传递消息给组件C；要是组件A和组件C之间有更多的组件，那采用这种方式就很复杂了。

**Vue 2.4**开始提供了 $attrs 和 $listeners 来解决这个问题，能够让组件A之间传递消息给组件C。

```javascript
vue.component('A', {
    template: `
		<div>
			<p>this is parent component!</p>
			<B :messagec="messagec" :message="message" @getCData="getCData" @getChildData="getChildData(message)"></B>
		</div>
	`,
    data() {
        return {
            message: 'hello'
            messagec:'hello c' //传递给C组件的数据
        }
    },
    methods: {
        // 执行组件B触发的事件
        getChildData(val) {
            console.log('这是来自B组件的数据')
        }
        // 执行组件C触发的事件
        getCData(val){
       		console.log("这是来自C组件的数据：" + val)
    	}
    }
})
vue.component('B', {
    data() {
        return {
            myMessage: this.message
        }
    },
    template: `
		<div>
			<input type="text" v-model="myMessage" @input="passData(myMessage)" />
			<!-- C组件中能直接触发getCData的原因在于B组件调用C组件时使用v-on绑定了$listeners属性 -->
            <!-- 通过v-bind 绑定$attrs属性，C组件可以直接获取到A组件中传递下来的props(除了B组件中props声明的) -->
			<C v-bind="$attrs" v-on="$listeners"></C>
		</div>
	`,
    props: ['message'], // 得到组件A传递过来的数据
    methods: {
        passData(val) {
            // 触发组件A中的事件
            this.$emit('getChildData', val)
        }
    }
})
vue.component('C', {
    template: `
		<div>
			<input type="text" v-model="$attrs.messagec" @input="passData($attrs.messagec)"/>
		</div>
	`,
    methods: {
        passData(val) {
            // 触发组件A中的事件
            this.$emit('getCData', val)
        }
    }
})
var app = new Vue({
    el: '#app',
    template: `
		<div>
			<A></A>
		</div>
	`
})
```

## 3.中央事件总线

以上两种方式都是父子组件进行传参，当两个组件不是父子关系时，使用中央事件总线进行传参。通过bus.$emit触发事件，bus.$on监听触发的事件。

```javascript
vue.component('brother1', {
    data() {
        return {
            myMessage: 'hello brother1'
        }
    },
    template: `
		<div>
			<p>this is brother1 component!</p>
			<input type="text" v-model="myMessage" @input="passData(myMessage)" />
		</div>
	`,
    methods: {
        // 执行子组件触发的事件
        passData(val) {
            // 触发全局事件globalEvent
            bus.$emit('globalevent', val)
        }
    }
})
vue.component('brother2', {
    template: `
		<div>
            <p>this is brother2 compoent!</p>
            <p>brother1传递过来的数据：{{brotherMessage}}</p>
        </div>
	`,
    data() {
        return {
            myMessage: 'hello brother2'
            brotherMessage: ''
        }
    },
    methods: {
        // 绑定全局事件globalEvent
        bus.$on('globalEvent', (val) => {
    		this.brotherMessage = val
		})
    }
})
// 中央事件总线
var bus = new Vue()
var app = new Vue({
    el: '#app',
    template: `
		<div>
			<brother1></brother1>
			<brother2></brother2>
		</div>
	`
})
```

## 4. provide 和 inject

父组件通过provide提供变量，子组件通过inject注入变量。不论子组件有多深，只要调用了inject那么就可以注入provider中的数据。而不是局限于只能从当前父组件的prop属性来获取数据，只要在父组件的生命周期内，子组件都可以调用。

```javascript
Vue.component('parent',{
        template:`
            <div>
                <p>this is parent compoent!</p>
                <child></child>
            </div>
        `,
        provide:{
            for:'test'
        },
        data(){
            return {
                message:'hello'
            }
        }
    })
    vue.component('parent', {
    template: `
		<div>
			<p>this is parent component!</p>
			<child></child>
		</div>
	`,
    provide: {
        for: 'test'
    }
    data() {
        return {
            message: 'hello'
        }
    }
})
vue.component('child', {
    inject: ['for'], // 获取父组件传递过来的数据
    data() {
        return {
            myMessage: this.for
        }
    },
    template: `
		<div>
			<input type="text" v-model="myMessage" />
		</div>
	`
})
var app = new Vue({
    el: '#app',
    template: `
		<div>
			<parent></parent>
		</div>
	`
})
```

## 5. v-model

父组件通过v-model传递值给子组件时，会自动传递一个value的prop属性，在子组件中通过this.$emit(‘input’,val)自动修改v-model绑定的值

```javascript
vue.component('parent', {
    template: `
		<div>
			<p>this is parent component!</p>
			<p>{{message}}</p>
			<child v-model="message"></child>
		</div>
	`,
    data() {
        return {
            message: 'hello'
        }
    }
})
vue.component('child', {
    props: {
        value:String // v-model会自动传递一个字段为value的prop属性
    }
    data() {
        return {
            myMessage: this.value
        }
    },
    methods: {
        changeValue() {
            this.$emit('input', this.myMessage); // 通过如此调用可改变父组件上v-model绑定的值
        }
    },
    template: `
		<div>
			<input type="text" v-model="myMessage" @change="changeValue" />
		</div>
	`
})
var app = new Vue({
    el: '#app',
    template: `
		<div>
			<parent></parent>
		</div>
	`
})
```

## 6. $parent 和 $children

```javascript
vue.component('parent', {
    template: `
		<div>
			<p>this is parent component!</p>
			<button @click="changeChildVal">test</button>
			<child></child>
		</div>
	`,
    methods: {
        changeChildVal() {
            this.$children[0].myMessage = 'hello'
        }
    },
    data() {
        return {
            message: 'hello'
        }
    }
})
vue.component('child', {
    props: {
        value: String
    }
    data() {
        return {
            myMessage: this.value
        }
    },
    methods: {
        changeValue() {
            this.$parent.message = this.myMessage
        }
    },
    template: `
		<div>
			<input type="text" v-model="myMessage" @change="changeValue" />
		</div>
	`
})
var app = new Vue({
    el: '#app',
    template: `
		<div>
			<parent></parent>
		</div>
	`
})
```

## 7. broadcast 和 dispatch

broadcast是向特定的父组件，触发事件，dispatch是向特定的子组件触发事件，本质上这种方式还是on和emit的封装，但在一些基础组件中却很实用。

```javascript
function broadcast(componentName, eventName, params) {
    this.$children.forEach(child => {
        var name = child.$options.componentName;
        
        if (name === componentName) {
            child.$emit.apply(child, [enevtName].concat(params));
        } else {
            broadcast.apply(child, [componentName, eventName].concat(params));
        }
    })
}
export default {
    methods: {
        dispatch(componentName, eentName, params) {
            var parent = this.$parent;
            var name = parent.$options.componentName;
            while (parent && (!name || name !== componentName)) {
                parent = parent.$parent
                
                if (parent) {
                    name = parent.$options.componentName
                }
            }
            if (parent) {
                parent.$emit.apply(parent, [eventName].concat(params))
            }
        },
        broadcast(componentName, eventName, params) {
      		broadcast.call(this, componentName, eventName, params)
        }
    }
}
```

## 8. vuex 处理组件之间的数据交互

如果业务逻辑复杂，很多组件之间需要同时处理一些公共的数据，这个时候才有上面这一些方法可能不利于项目的维护，vuex的做法就是将这一些公共的数据抽离出来，然后其他组件就可以对这个公共数据进行读写操作，这样达到了解耦的目的。