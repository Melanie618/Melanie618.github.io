---
title: 浏览器存储cookies、session、sessionStorage和localStorage解释及区别
author: 不以by
email: promiseyou_dear@163.com
date: 2020-12-22 19:34:01
tags: 
  - JavaScript
  - Http
  - session
  - cookie
  - 浏览器机制

categories: 
  - Http
---

![img](https://img-blog.csdnimg.cn/20201222191802658.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L01lbGFuaWVfd3U=,size_16,color_FFFFFF,t_70)![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)

## 一、cookie，session

浏览器的缓存机制提供了可以将用户数据存储在客户端上的方式，可以利用cookie,session等跟服务端进行数据交互。

cookie和session都是用来跟踪浏览器用户的身份的方式

### **区别：**

**1.保存方式**

cookie保存在浏览器端

session保存在服务器端

**2.使用方法**

cookie机制：如果不在浏览器中设置过期时间，cookie被保存在内存中，生命周期随浏览器的关闭而结束，这种cookie简称会话cookie。如果在浏览器中设置了cookie的过期时间，cookie被保存在硬盘中，关闭浏览器后，cookie数据仍然存在，直到过期时间结束才消失。

session机制：当服务器收到请求需要创建session对象时，首先会检查客户端请求中是否包含sessionid。如果有sessionid，服务器将根据该id返回对应session对象。如果客户端请求中没有sessionid，服务器会创建新的session对象，并把sessionid在本次响应中返回给客户端。

**3、存储内容：**

cookie只能保存字符串类型，以文本的方式。

session通过类似与Hashtable的数据结构来保存，能支持任何类型的对象(session中可含有多个对象)

**4、存储的大小：**

cookie：单个cookie保存的数据不能超过4kb。

session大小没有限制。

**5、安全性：**

cookie：针对cookie所存在的攻击：Cookie欺骗，Cookie截获；session的安全性大于cookie。

**6、应用场景：**

cookie：（1）判断用户是否登陆过网站，以便下次登录时能够实现自动登录（或者记住密码）。如果我们删除cookie，则每次登录必须从新填写登录的相关信息。

　　　　（2）保存上次登录的时间等信息。

　　　　（3）保存上次查看的页面

　　　　（4）浏览计数

session：Session用于保存每个用户的专用信息，变量的值保存在服务器端，通过SessionID来区分不同的客户。

　　   （1）网上商城中的购物车

　　   （2）保存用户登录信息

　　   （3）将某些数据放入session中，供同一用户的不同页面使用

　　   （4）防止用户非法登录

7、缺点：

cookie：（1）大小受限

　　　　（2）用户可以操作（禁用）cookie，使功能受限

　　　　（3）安全性较低

　　　　（4）有些状态不可能保存在客户端。

　　　　（5）每次访问都要传送cookie给服务器，浪费带宽。

　　　　（6）cookie数据有路径（path）的概念，可以限制cookie只属于某个路径下。

session：（1）Session保存的东西越多，就越占用服务器内存，对于用户在线人数较多的网站，服务器的内存压力会比较大。

　　　　 （2）依赖于cookie（sessionID保存在cookie），如果禁用cookie，则要使用URL重写，不安全

　　　　 （3）创建Session变量有很大的随意性，可随时调用，不需要开发者做精确地处理，所以，过度使用session变量将会导致代码不可读而且不好维护。



## 二、SessionStorage，LocalStorage

SessionStorage,LocalStorage和cookie这三者都可以被用来在浏览器端存储数据，而且都是字符串类型的键值对。 区别在于前两者属于WebStorage，创建它们的目的便于客户端存储数据。

Web Storage存储机制是对HTML4中cookie存储机制的一个改善。由于cookie存储机制有很多缺点，HTML5不再使用它，转而使用改良后的Web Storage存储机制。



## sessionStorage：

将数据保存在session对象中。所谓session，是指用户在浏览某个网站时，从进入网站到浏览器关闭所经过的这段时间，也就是用户浏览这个网站所花费的时间。session对象可以用来保存在这段时间内所要求保存的任何数据。

## localStorage：

将数据保存在客户端本地中，即使浏览器被关闭了，该数据仍然存在，下次打开浏览器访问网站时仍然可以继续使用。



**目标：**

1、提供一种在cookie之外存储会话数据的路径。

2、提供一种存储大量可以跨会话存在的数据的机制。



### **区别：**

sessionStorage为临时保存，而localStorage为永久保存。

**1、生命周期：**

　　　localStorage:localStorage的生命周期是永久的，关闭页面或浏览器之后localStorage中的数据也不会消失。localStorage除非主动删除数据，否则数据永远不会消失。

　　　sessionStorage的生命周期是在仅在当前会话下有效。sessionStorage引入了一个“浏览器窗口”的概念，sessionStorage是在同源的窗口中始终存在的数据。只要这个浏览器窗口没有关闭，即使刷新页面或者进入同源另一个页面，数据依然存在。但是sessionStorage在关闭了浏览器窗口后就会被销毁。同时独立的打开同一个窗口同一个页面，sessionStorage也是不一样的。

**2、存储大小：**localStorage和sessionStorage的存储数据大小一般都是：5MB

**3、存储位置：**localStorage和sessionStorage都保存在客户端，不与服务器进行交互通信。

**4、存储内容类型：**localStorage和sessionStorage只能存储字符串类型，对于复杂的对象可以使用ECMAScript提供的JSON对象的stringify和parse来处理

**5、获取方式：**localStorage：window.localStorage;；sessionStorage：window.sessionStorage;。**6、应用场景：**localStoragese：常用于长期登录（+判断用户是否已登录），适合长期保存在本地的数据。sessionStorage：敏感账号一次性登录；



### 优点：

**存储空间更大：**cookie为4KB，而WebStorage是5MB；

**节省网络流量：**WebStorage不会传送到服务器，存储在本地的数据可以直接获取，也不会像cookie一样美词请求都会传送到服务器，所以减少了客户端和服务器端的交互，节省了网络流量；

**快速显示：**有的数据存储在WebStorage上，再加上浏览器本身的缓存。获取数据时可以从本地获取会比从服务器端获取快得多，所以速度更快；

**安全性：**WebStorage不会随着HTTP header发送到服务器端，所以安全性相对于cookie来说比较高一些，不会担心截获，但是仍然存在伪造问题；