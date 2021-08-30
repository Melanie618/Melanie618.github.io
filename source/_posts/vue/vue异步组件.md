---
title: vue异步组件
author: 不以by
email: promiseyou_dear@163.com
date: 2021-01-29 20:37:08
tags: 
  - Vue

categories: 
  - Vue

---

# 异步组件三种方式

1. 普通函数异步组件

```javascript
Vue.component('aa', function(resolve, reject) {
    setTimeout(function() {
        resolve({
            template: '<div><p>{{aa}}<span>{{bb}}</span></p></div>',
            data() {
                return {
                    aa: '欢迎',
                    bb: 'Vue'
                }
            }
        })
    }, 1000)
})
```

2. Promise 异步组件

```javascript
Vue.component('aa', () => import('./aa.js') )
```

3. 高级异步组件

```javascript
const aa = () => ({
    // 需要加载的组件。应当是一个 Promise
    component: import('./aa.vue'),
    // 加载中应当渲染的组件
    loading: LoadingComp,
    // 出错时渲染的组件
    error: ErrorComp,
    // 渲染加载中组件前的等待时间。默认：200ms。
    delay: 200,
    // 最长等待时间。超出此时间则渲染错误组件。默认：Infinity
    timeout: 3000
})
Vue.component('aa', aa)
```

从以上示例中可以看到，通过`Vue.component`注册的组件不再是一个对象，而是一个函数，这个函数也不是组件构造函数，是一个工厂函数。这个工厂函数有两个参数`resolve`函数和`reject`函数，其是 Vue 内部定义的，在这个工厂函数中有个异步函数，当异步函数执行成功后调用`resolve`函数，其参数就是异步组件的对象。

# 源码分析

组件的使用，要先在`vm._render`过程中执行`vnode = createComponent(Ctor, data, context, children, tag)`生成`vnode`，其中参数`Ctor`可以是函数或对象，从`createComponent`方法开始介绍异步组件是如何使用。

## `createComponent`

```javascript
function createComponent(Ctor, data, context, children, tag) {
    if (isUndef(Ctor)) {
        return
    }
    var baseCtor = context.$options._base;
    if (isObject(Ctor)) {
        Ctor = baseCtor.extend(Ctor);
    }
    if (typeof Ctor !== 'function') {
        return
    }
    // async component
    var asyncFactory;
    if (isUndef(Ctor.cid)) {
        asyncFactory = Ctor;
        Ctor = resolveAsyncComponent(asyncFactory, baseCtor);
        if (Ctor === undefined) {
            return createAsyncPlaceholder(asyncFactory, data, context, children, tag)
        }
    }
    data = data || {};
    resolveConstructorOptions(Ctor);
    installComponentHooks(data);
    var name = Ctor.options.name || tag;
    var vnode = new VNode(
        ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
        data, undefined, undefined, undefined, context, {
            Ctor: Ctor,
            tag: tag,
            children: children
        },
        asyncFactory
    );
    return vnode
}
```

当参数`Ctor`值的类型是函数时，不会执行`Ctor = baseCtor.extend(Ctor)`。

因为在 Vue 中是调用`Vue.extend`方法来创建继承 Vue 的组件构造函数。在`Vue.extend`中会执行`Sub.cid = cid++`给组件构造函数的`cid`属性赋值。

```javascript
var cid = 1;
Vue.extend = function(extendOptions) {
    var Sub = function VueComponent(options) {
        this._init(options);
    };
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.cid = cid++;
    return Sub
}
```

所以可以用`isUndef(Ctor.cid)`来判断`Ctor`是不是一个组件构造函数，若不是执行`Ctor = resolveAsyncComponent(asyncFactory, baseCtor)`进入异步组件使用的逻辑。

## `resolveAsyncComponent`

```javascript
function resolveAsyncComponent(factory, baseCtor) {
    if (isTrue(factory.error) && isDef(factory.errorComp)) {
        return factory.errorComp
    }
    if (isDef(factory.resolved)) {
        return factory.resolved
    }
    var owner = currentRenderingInstance;
    if (owner && isDef(factory.owners) && factory.owners.indexOf(owner) === -1) {
        factory.owners.push(owner);
    }
    if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
        return factory.loadingComp
    }
    if (owner && !isDef(factory.owners)) {
        var owners = factory.owners = [owner];
        var sync = true;
        var timerLoading = null;
        var timerTimeout = null;
        (owner).$on('hook:destroyed', function() {
            return remove(owners, owner);
        });
        var forceRender = function(renderCompleted) {
            for (var i = 0, l = owners.length; i < l; i++) {
                (owners[i]).$forceUpdate();
            }
            if (renderCompleted) {
                owners.length = 0;
                if (timerLoading !== null) {
                    clearTimeout(timerLoading);
                    timerLoading = null;
                }
                if (timerTimeout !== null) {
                    clearTimeout(timerTimeout);
                    timerTimeout = null;
                }
            }
        };
        var resolve = once(function(res) {
            factory.resolved = ensureCtor(res, baseCtor);
            if (!sync) {
                forceRender(true);
            } else {
                owners.length = 0;
            }
        });
        var reject = once(function(reason) {
            warn(
                "Failed to resolve async component: " + (String(factory)) +
                (reason ? ("\nReason: " + reason) : '')
            );
            if (isDef(factory.errorComp)) {
                factory.error = true;
                forceRender(true);
            }
        });
        var res = factory(resolve, reject);
        if (isObject(res)) {
            if (isPromise(res)) {
                if (isUndef(factory.resolved)) {
                    res.then(resolve, reject);
                }
            } else if (isPromise(res.component)) {
                res.component.then(resolve, reject);

                if (isDef(res.error)) {
                    factory.errorComp = ensureCtor(res.error, baseCtor);
                }
                if (isDef(res.loading)) {
                    factory.loadingComp = ensureCtor(res.loading, baseCtor);
                    if (res.delay === 0) {
                        factory.loading = true;
                    } else {
                        timerLoading = setTimeout(function() {
                            timerLoading = null;
                            if (isUndef(factory.resolved) && isUndef(factory.error)) {
                                factory.loading = true;
                                forceRender(false);
                            }
                        }, res.delay || 200);
                    }
                }
                if (isDef(res.timeout)) {
                    timerTimeout = setTimeout(function() {
                        timerTimeout = null;
                        if (isUndef(factory.resolved)) {
                            reject(
                                "timeout (" + (res.timeout) + "ms)"
                            );
                        }
                    }, res.timeout);
                }
            }
        }
        sync = false;
        return factory.loading ? factory.loadingComp : factory.resolved
    }
}

```

`resolveAsyncComponent`函数，是个高阶函数，主要对注册异步组件时，传入不同的工厂函数进行处理，内部定义了工厂函数的参数`resolve`函数和`reject`函数，并调用了工厂函数，成功执行`resolve`函数，失败执行`reject`函数，最后返回组件构造函数或 undefined。

异步组件和同步组件的注册原理是一样，只是异步组件的使用原理跟同步组件是不一样的。

# 异步组件的使用原理

## 1. 普通函数异步组件

```javascript
Vue.component('aa', function(resolve, reject) {
    setTimeout(function() {
        resolve({
            template: '<div><p>{{aa}}<span>{{bb}}</span></p></div>',
            data() {
                return {
                    aa: '欢迎',
                    bb: 'Vue'
                }
            }
        })
    }, 1000)
})
```

`resolveAsyncComponent(factory, baseCtor)`，参数`factory`的值就是上面`Vue.component`的第二参数，参数`baseCtor`是 Vue 构造函数。

```javascript
function resolveAsyncComponent(factory, baseCtor) {
    if (isDef(factory.resolved)) {
        return factory.resolved
    }
    var owner = currentRenderingInstance;
    if (owner && isDef(factory.owners) && factory.owners.indexOf(owner) === -1) {
        factory.owners.push(owner);
    }
    if (owner && !isDef(factory.owners)) {
        var owners = factory.owners = [owner];
        var sync = true;
        (owner).$on('hook:destroyed', function() {
            return remove(owners, owner);
        });
        var forceRender = function(renderCompleted) {
            for (var i = 0, l = owners.length; i < l; i++) {
                (owners[i]).$forceUpdate();
            }
            if (renderCompleted) {
                owners.length = 0;
            }
        };
        var resolve = once(function(res) {
            factory.resolved = ensureCtor(res, baseCtor);
            if (!sync) {
                forceRender(true);
            } else {
                owners.length = 0;
            }
        });
        var reject = once(function(reason) {
            warn(
                "Failed to resolve async component: " + (String(factory)) +
                (reason ? ("\nReason: " + reason) : '')
            );
        });
        var res = factory(resolve, reject);
        sync = false;
        return factory.loading ? factory.loadingComp : factory.resolved
    }
}
```

在 `resolveAsyncComponent` 函数中，内部定义了三个函数 `forceRender`、`resolve`、`reject`。其中 `resolve` 和 `reject` 函数是用 `once` 函数包装。

```javascript
function once(fn) {
    var called = false;
    return function() {
        if (!called) {
            called = true;
            fn.apply(this, arguments);
        }
    }
}
```

`once` 函数是个高阶函数，巧妙利用闭包和 `called` 变量，保证所包装的函数只执行一次。也就是确保 `resolve` 和 `reject` 函数只执行一次。

因为在 `resolveAsyncComponent` 函数中最后执行 `return factory.loading ? factory.loadingComp : factory.resolved`，返回 `factory.resolved`。

`factory.resolved` 定义在`resolve`函数中。

```javascript
var resolve = once(function(res) {
    factory.resolved = ensureCtor(res, baseCtor);
    if (!sync) {
        forceRender(true);
    } else {
        owners.length = 0;
    }
})
```

执行 `ensureCtor(res, baseCtor)` 后赋值给 `factory.resolved` ，来看一下 `ensureCtor `方法。

```javascript
function ensureCtor(comp, base) {
    if (
        comp.__esModule ||
        (hasSymbol && comp[Symbol.toStringTag] === 'Module')
    ) {
        comp = comp.default;
    }
    return isObject(comp) ?
        base.extend(comp) :
        comp
}
```

参数`base`为 Vue 构造函数，那么最后执行`return isObject(comp) ? base.extend(comp) : comp`，如果参数`comp`是个对象，执行`base.extend(comp)`，也就是执行`Vue.extend(comp)`生成一个继承 Vue 的构造函数。

参数`comp`是通过`resolve`函数的参数`res`传参的。回到`resolveAsyncComponent`方法中，有执行`var res = factory(resolve, reject)`这段代码，`factory`是通过`Vue.component`的第二参数传参的，值如下所示。

```javascript
function(resolve, reject) {
    setTimeout(function() {
        resolve({
            template: '<div><p>{{aa}}<span>{{bb}}</span></p></div>',
            data() {
                return {
                    aa: '欢迎',
                    bb: 'Vue'
                }
            }
        })
    }, 1000)
}
```

其中`resolve`就是`resolveAsyncComponent`函数内部定义的`resolve`函数。那么参数`comp`的值如下所示，是个组件的选项对象。

```javascript
{
    template: '<div><p>{{aa}}<span>{{bb}}</span></p></div>',
    data() {
        return {
            aa: '欢迎',
            bb: 'Vue'
        }
    }
}
```

这样执行`ensureCtor(res, baseCtor)`会得到一个组件构造函数，那么`factory.resolved`的值为一个组件构造函数。

再回到`createComponent`方法中，看这段代码

```javascript
Ctor = resolveAsyncComponent(asyncFactory, baseCtor);
if (Ctor === undefined) {
    return createAsyncPlaceholder(asyncFactory, data, context, children, tag)
}
```

执行`resolveAsyncComponent`方法后返回一个组件构造函数赋值给`Ctor`。就这么结束了吗。当然不是了，不知你有没有注意到在`Vue.component`定义的第二参数中，`resolve(//...)`外层还有一个`setTimeout`定时器，是个异步任务。JavaScript 是单线程的，异步任务要等所有同步任务都执行完才能执行。故此时`resolveAsyncComponent`方法中的`resolve`函数是不执行，`factory.resolved`应该为 undefined 。那么`Ctor`为 undefined ，要执行`return createAsyncPlaceholder(asyncFactory, data, context, children, tag)`。`createAsyncPlaceholder`方法是用来创建一个注释节点`vnode`作为占位符。

```javascript
function createAsyncPlaceholder(factory, data, context, children, tag) {
    var node = createEmptyVNode();
    node.asyncFactory = factory;
    node.asyncMeta = {
        data: data,
        context: context,
        children: children,
        tag: tag
    };
    return node
}
```

此时`createComponent`方法生成的一个注释节点`vnode`，而不是一个组件`vnode`，那组件要怎么渲染，不着急，再回到`resolveAsyncComponent`方法中，在 return 之前执行`sync = false`，在1000ms后`resolve`函数执行，会执行`forceRender(true)`，来看一下`forceRender`函数。

```javascript
var resolve = once(function(res) {
    factory.resolved = ensureCtor(res, baseCtor);
    if (!sync) {
        forceRender(true);
    } else {
        owners.length = 0;
    }
})
var owner = currentRenderingInstance;
if (owner && isDef(factory.owners) && factory.owners.indexOf(owner) === -1) {
    factory.owners.push(owner);
}
if (owner && !isDef(factory.owners)) {
    var owners = factory.owners = [owner];
    var forceRender = function(renderCompleted) {
        for (var i = 0, l = owners.length; i < l; i++) {
            (owners[i]).$forceUpdate();
        }
        if (renderCompleted) {
            owners.length = 0;
        }
    };
}
```

`currentRenderingInstance`是使用异步组件的当前 Vue 实例，赋值给`owner`。

如果同一个异步组件在很多个地方局部注册。这样要重复执行很多次相同的`resolve`函数。所以在这里做了个优化。

异步组件是以一个工厂函数`factory`来定义组件，在`factory`定义一个属性`owners`，来存储使用异步组件的当前 Vue 实例，也就是调用`factory`函数的上下文环境。

若`owner`有值和`factory.owners`不存在，则说明`factory`函数是第一次执行。若`owner`有值和`factory.owners`有值，则说明`factory`函数已经执行过了。执行`factory.owners.indexOf(owner) === -1`判断`factory.owners`中有没有当前 Vue 实例，若没有，则把当前 Vue 实例添加到`factory.owners`中。

回到`forceRender`函数中，执行`(owners[i]).$forceUpdate()`相当执行`vm.$forceUpdate()`这个实例方法。这是因为异步组件加载过程中是没有数据发生变化的，所以要通过执行`vm.$forceUpdate()`迫使 Vue 实例重新渲染一次。

```javascript
Vue.prototype.$forceUpdate = function() {
    var vm = this;
    if (vm._watcher) {
        vm._watcher.update();
    }
}
```

执行`vm._watcher.update()`相当执行`mountComponent`方法中的`vm._update(vm._render(), hydrating)`，在执行`vm._render()`过程中调用`createComponent`方法又执行到以下逻辑。

```javascript
// async component
var asyncFactory;
if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor;
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor);
    if (Ctor === undefined) {
        return createAsyncPlaceholder(asyncFactory, data, context, children, tag)
    }
}
```

再次执行`resolveAsyncComponent(asyncFactory, baseCtor)`时，1000ms已过，故异步组件注册的工厂函数`factory`中的`resolve`函数已经执行完毕，故`factory.resolved`有值，直接返回`factory.resolved`。

```javascript
function resolveAsyncComponent(factory, baseCtor) {
    if (isDef(factory.resolved)) {
        return factory.resolved
    }
}
```

## 2. Promise 异步组件

```javascript
Vue.component('aa', () => import('./aa.js') )
```

`resolveAsyncComponent(factory, baseCtor)`，参数`baseCtor`是 Vue 构造函数。参数`factory`的值就是上面`Vue.component`的第二参数，返回值是`import('./aa.js')`，它是一个 Promise 对象。整理一下代码，跟此场景无关的代码都去掉。

```javascript
function resolveAsyncComponent(factory, baseCtor) {
    if (isDef(factory.resolved)) {
        return factory.resolved
    }
    var owner = currentRenderingInstance;
    if (owner && isDef(factory.owners) && factory.owners.indexOf(owner) === -1) {
        factory.owners.push(owner);
    }
    if (owner && !isDef(factory.owners)) {
        var owners = factory.owners = [owner];
        var sync = true;
        (owner).$on('hook:destroyed', function() {
            return remove(owners, owner);
        });
        var forceRender = function(renderCompleted) {
            for (var i = 0, l = owners.length; i < l; i++) {
                (owners[i]).$forceUpdate();
            }
            if (renderCompleted) {
                owners.length = 0;
            }
        };
        var resolve = once(function(res) {
            factory.resolved = ensureCtor(res, baseCtor);
            if (!sync) {
                forceRender(true);
            } else {
                owners.length = 0;
            }
        });
        var reject = once(function(reason) {
            warn(
                "Failed to resolve async component: " + (String(factory)) +
                (reason ? ("\nReason: " + reason) : '')
            );
            if (isDef(factory.errorComp)) {
                factory.error = true;
                forceRender(true);
            }
        });
        var res = factory(resolve, reject);
        if (isObject(res)) {
            if (isPromise(res)) {
                if (isUndef(factory.resolved)) {
                    res.then(resolve, reject);
                }
            }
        }
        sync = false;
        return factory.loading ? factory.loadingComp : factory.resolved
    }
}
```

因为在此场景中工厂函数`factory`的返回值是一个 Promise 对象，所以满足`isObject(res)`和`isPromise(res)`的条件，执行以下逻辑

```javascript
if (isUndef(factory.resolved)) {
    res.then(resolve, reject);
}
```

因为返回的是 Promise 对象，其实例方法`then`的参数是两个的函数`resolve`和`reject`。当执行成功会执行`resolve`函数，当执行失败会调用`reject`函数。

所以这里巧妙地执行`res.then(resolve, reject)`，当执行成功后会掉`resolve`函数，而这个`resolve`函数，是`resolveAsyncComponent`函数中自定义的。接下来的逻辑就和普通函数异步组件一模一样。

## 3. 高级异步组件

在高级异步组件中，可定义异步组件加载中展示的组件和加载失败展示的组件，对用户更友好。

```javascript
const aa = () => ({
    // 需要加载的组件。应当是一个 Promise
    component: import('./aa.vue'),
    // 加载中展示的组件
    loading: LoadingComp,
    // 加载失败展示的组件
    error: ErrorComp,
    // 渲染加载中组件前的等待时间。默认：200ms。
    delay: 200,
    // 最长等待时间。超出此时间则渲染错误组件。默认：Infinity
    timeout: 3000
})
Vue.component('aa', aa)
```

`resolveAsyncComponent(factory, baseCtor)`，参数`baseCtor`是 Vue 构造函数。参数`factory`的值就是上面`Vue.component`的第二参数，返回值是一个对象。整理一下代码，跟此场景无关的代码都去掉。

```javascript
function resolveAsyncComponent(factory, baseCtor) {
    if (isTrue(factory.error) && isDef(factory.errorComp)) {
        return factory.errorComp
    }
    if (isDef(factory.resolved)) {
        return factory.resolved
    }
    var owner = currentRenderingInstance;
    if (owner && isDef(factory.owners) && factory.owners.indexOf(owner) === -1) {
        factory.owners.push(owner);
    }
    if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
        return factory.loadingComp
    }
    if (owner && !isDef(factory.owners)) {
        var owners = factory.owners = [owner];
        var sync = true;
        var timerLoading = null;
        var timerTimeout = null;
        (owner).$on('hook:destroyed', function() {
            return remove(owners, owner);
        });

        var forceRender = function(renderCompleted) {
            for (var i = 0, l = owners.length; i < l; i++) {
                (owners[i]).$forceUpdate();
            }

            if (renderCompleted) {
                owners.length = 0;
                if (timerLoading !== null) {
                    clearTimeout(timerLoading);
                    timerLoading = null;
                }
                if (timerTimeout !== null) {
                    clearTimeout(timerTimeout);
                    timerTimeout = null;
                }
            }
        };

        var resolve = once(function(res) {
            factory.resolved = ensureCtor(res, baseCtor);
            if (!sync) {
                forceRender(true);
            } else {
                owners.length = 0;
            }
        });

        var reject = once(function(reason) {
            warn(
                "Failed to resolve async component: " + (String(factory)) +
                (reason ? ("\nReason: " + reason) : '')
            );
            if (isDef(factory.errorComp)) {
                factory.error = true;
                forceRender(true);
            }
        });

        var res = factory(resolve, reject);

        if (isObject(res)) {
            if (isPromise(res.component)) {
                res.component.then(resolve, reject);
                if (isDef(res.error)) {
                    factory.errorComp = ensureCtor(res.error, baseCtor);
                }
                if (isDef(res.loading)) {
                    factory.loadingComp = ensureCtor(res.loading, baseCtor);
                    if (res.delay === 0) {
                        factory.loading = true;
                    } else {
                        timerLoading = setTimeout(function() {
                            timerLoading = null;
                            if (isUndef(factory.resolved) && isUndef(factory.error)) {
                                factory.loading = true;
                                forceRender(false);
                            }
                        }, res.delay || 200);
                    }
                }

                if (isDef(res.timeout)) {
                    timerTimeout = setTimeout(function() {
                        timerTimeout = null;
                        if (isUndef(factory.resolved)) {
                            reject(
                                "timeout (" + (res.timeout) + "ms)"
                            );
                        }
                    }, res.timeout);
                }
            }
        }

        sync = false;
        return factory.loading ? factory.loadingComp : factory.resolved
    }
}
```

因为在此场景中工厂函数`factory`的返回值是一个对象`res`，

若其中`res.component`属性是一个 Promise 对象，执行`res.component.then(resolve, reject)`。

若`res.error`有值，执行`factory.errorComp = ensureCtor(res.error, baseCtor)`，把加载失败展示的组件转换成组件构造函数赋值给`factory.errorComp`。

若`res.loading`有值，执行`factory.loadingComp = ensureCtor(res.loading, baseCtor)`，把加载中展示的组件转换成组件构造函数赋值给`factory.loadingComp`。

若`res.delay`的值为 0 ，则说明要直接展示加载中的组件，把`factory.loading`设置为 true 。

若`res.delay`的值不为 0 ，则说明要经过一段`delay`时间的延迟才展示加载中的组件，用 setTimeout 定时器在经过一段`delay`时间的延迟，在异步组件没有加载成功或者失败的情况下把`factory.loading`设置为 true ，并执行`forceRender(false)`，触发组件更新的 patch 过程渲染出加载中展示的组件。

若`res.timeout`有值，用 setTimeout 定时器在在超出`res.timeout`后异步组件还未加载完成，报错一个超时的错误。

最后如果加载中组件构造函数`factory.loading`有值返回`factory.loading`，就不必调用`createAsyncPlaceholder`方法创建注释节点来作为占位节点，直接用加载中展示的组件生成的 DOM 节点来作为占位节点。

异步组件是在组件更新的 patch 过程才渲染的，会再调用`resolveAsyncComponent`方法。

```javascript
if (isTrue(factory.error) && isDef(factory.errorComp)) {
    return factory.errorComp
}
if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
    return factory.loadingComp
}
```

若`factory.error`为true且加载失败组件构造函数`factory.errorComp`存在，返回`factory.errorComp`。

若`factory.loading`为true且加载中组件构造函数`factory.loadingComp`存在，返回`factory.loadingComp`。

异步组件加载成功返回`factory.resolved`，接下来的逻辑就和普通函数异步组件一模一样。

最后在介绍一下异步组件加载失败时处理，其会调用自定义的`reject`函数，若`factory.errorComp`，把`factory.error`置为true。然后执行`forceRender(true)`，此时其参数为true，在强制重新渲染中可以把加载中和加载超时中的定时器清空。

# 总结

Vue 的异步组件有 3 种实现方式，其中高级异步组件实现了loading、resolve、reject、timeout 4 种状态。异步组件实现的本质是 2 次渲染，除了`delay`为 0 的高级异步组件第一次直接渲染成 loading 组件外，其它都是第一次渲染生成一个注释节点，当异步加载组件成功后，执行`resolve`函数，在其中调用`forceRender`函数强制重新渲染，第二次调用`resolveAsyncComponent`函数，返回真正的组件构造函数`factory.resolved`，再通过组件更新的 patch 过程就能渲染出异步组件了。