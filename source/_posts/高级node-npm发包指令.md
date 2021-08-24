---
title: 高级node-npm发包指令
author: 不以by
email: promiseyou_dear@163.com
date: 2020-11-09 11:00:51
tags: node-npm
categories: 
---

# 准备工作

1. npm地址必须是官网的，更改地址：**npm config set registry https://registry.npmjs.org**
2. 初始化仓库： **npm init**
3. 登录：**npm login**



### 发布

1. 发布：**npm publish**



### 更新包

1. 修改版本号 **version**字段
2. 再次发布： **npm publish**



### 删除包

1. 删除： **npm unpublish 包名 --force**



### 注意事项

1. 注册时：
   1. 密码不能太简单，不能与用户名相同
   2. 激活邮箱
2. 发布时：
   1. 登录不成功
   2. 包名不能重复
   3. 重复发包要修改版本号
   4. 删除的包24小时内不能重复发布



### 初始化包

1. **package name:** (day01) 不要使用day01 重名率太高
2. **version:** (1.0.0)默认，小更新修改bug在最后+1，更新功能在中间+1，大变动在第一个+1
3. **description:** 描述文件
4. **entry point:** (idnex.js) 出口文件
5. **test command:** 测试代码
6. **git repository:** git 仓库命令
7. **keywords:** 关键词
8. **author:** 创建人
9. **license:** (ISC) 默认
10. **Is this OK?** (yes) yes