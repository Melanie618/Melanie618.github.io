---
title: Jest-vue单元测试 $route报错
date: 2022-03-23 17:40:04
tags: 
  - jest
  - vue

categories: 
  - Jest
---
在使用 `jest` 进行单元测试时，含有 `$route` 的页面会出现报错
# 获取路由信息
直接获取路由相关信息返回
```javascript
{"fullPath": "/", "hash": "", "matched": [], "meta": {}, "name": null, "params": {}, "path": "/", "query": {}}
```

# 通过mock设置$route
相关解决方法通过 `mock` 设置 `$route`
```javascript
import VueRouter from 'vue-router'
import { createLocalVue, mount } from '@vue/test-utils'
import Home from './Home.vue'

describe('Home', () => {
  it('get route name', () => {
    const wrapper = mount(Home, {
      mocks: {
        $route: {
          name: 'Home'
        }
      }
    })
    expect(wrapper.vm.$route.name).toBe('Home')
  })
})
```
报错提示 `could not overwrite property $route, this is usually caused by a plugin that has added the property as a read-only value`

# localVue
根据官方文档[vue-test-utils](https://v1.test-utils.vuejs.org/zh/api/options.html#localvue)中的 `localVue` 配置路由相关信息
```javascript
import { createLocalVue, mount } from '@vue/test-utils'
import VueRouter from 'vue-router'
import Home from './Home.vue'

const localVue = createLocalVue()
localVue.use(VueRouter)

const routes = [{
    path: '/',
    name: 'Home',
    children: [{
      path: 'dashboard',
      name: 'dashboard'
    }]
  }]

const router = new VueRouter({
  routes
})

describe('Home', () => {
  it('get route name', () => {
    const wrapper = mount(Component, {
      localVue,
      router
    })
    expect(wrapper.vm.$route.name).toBe('Home')
  })
})
```
此时 `wrapper.vm.$route` 的返回值是
```javascript
{"fullPath": "/", "hash": "", "matched": [], "meta": {}, "name": null, "params": {}, "path": "/", "query": {}}
```

# 解决
先来看一下路由的导航守卫
```javascript
router.beforeEach((to, from) => {
  console.log(from)
})
```
在导航守卫中，刷新页面后打印的 `from` 的值与上面的返回值相同。于是我尝试先通过路由跳转至需要获取 `$route` 的页面再去进行判断：
```javascript
import { createLocalVue, mount } from '@vue/test-utils'
import VueRouter from 'vue-router'
import Home from './Home.vue'

const localVue = createLocalVue()
localVue.use(VueRouter)

const routes = [{
    path: '/',
    name: 'Home',
    children: [{
      path: 'dashboard',
      name: 'dashboard'
    }]
  }]

const router = new VueRouter({
  routes
})

describe('Home', () => {
  const wrapper = mount(Component, {
    localVue,
    router
  })
  it('get route name', () => {
    router.push({ name: 'Home' })
    expect(wrapper.vm.$route.name).toBe('Home')
  })
})
```

此时 `wrapper.vm.$route` 的返回值是
```javascript
{"fullPath": "/", "hash": "", "matched": [{"beforeEnter": undefined, "components": {"default": undefined}, "instances": {}, "matchAs": undefined, "meta": {}, "name": "Home", "parent": undefined, "path": "", "props": {}, "redirect": undefined, "regex": /^(?:\/(?=$))?$/i}], "meta": {}, "name": "Home", "params": {}, "path": "/", "query": {}}
```
测试成功！
![ohhhhh](https://cdn.jsdelivr.net/gh/Melanie618/CDN@v1.1/images/Jest/oh.gif)