---
title: Vue Test Utils 使用 setValue 赋值失败
date: 2022-03-25 15:06:04
tags: 
  - jest
  - Vue-Test-Utils

categories: 
  - Jest
---
## Vue Test Utils 使用 setValue 赋值失败
-----
Login.vue
```vue
<template>
  <div>
    <el-input ref="loginForm.username" v-model="username" type="text" />
    <el-input ref="password" v-model="password" type="loginForm.password" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      }
    }
  }
}
</script>
```

### 失败例子
#### setValue()
如文档中所述，如果是输入元素，其值可以在数据中体现如下。
但是，当我在像上面这样的自定义组件上运行此代码时，我收到一个错误：`wrapper.setValue() cannot be called on this elemen`
```javascript
import { shallowMount } from '@vue/test-utils'
import Login from '@/views/Login.vue'

const wrapper = shallowMount(Login)

describe('设置input内容', () => {
  test('测试', async () => {
    const textInput = wrapper.find('[type="text"]')

    expect(textInput.exists()).toBe(true) // true

    await textInput.setValue('admin')
    // 报错：wrapper.setValue() cannot be called on this elemen

    expect(wrapper.vm.loginForm.username).toBe('admin')
  })
})
```
#### element.value = value
按文档所说：`textInput.setValue(value)` 是接下来这段代码的别名，这样写虽然没有报错，但并未给 `textInput` 复制成功
```javascript
import { shallowMount } from '@vue/test-utils'
import Login from '@/views/Login.vue'

const wrapper = shallowMount(Login)

describe('设置input内容', () => {
  test('测试', () => {
    const textInput = wrapper.find('[type="text"]')

    textInput.element.value = 'admin'

    expect(wrapper.vm.loginForm.username).toBe('admin')
    // wrapper.vm.loginForm.username： ""
  })
})
```

### 解决方案
-----
通过触发输入事件，可以在数据中反映输入值并对其进行测试。
```javascript
import { shallowMount } from '@vue/test-utils'
import Login from '@/views/Login.vue'

const wrapper = shallowMount(Login)

describe('设置input内容', () => {
  test('测试', () => {
    const textInput = wrapper.find('[type="text"]')
    // const textInput = wrapper.find({ ref: 'username' })
    textInput.vm.$emit('input', 'admin')

    expect(wrapper.vm.test).toBe('admin')
  })
})
```

*注意：无论你使用哪种方式获取 `testInput` 元素，在触发输入事件时都要加上 `input`，否则会导致赋值失败

参考文档：https://qiita.com/AtsushiEsashika/items/9a9f29fd11dd75f0508f