---
title: git指令
author: 不以by
email: promiseyou_dear@163.com
date: 2020-07-08 19:20:32
tags: git
categories: git
---

## 在项目仓库创建自己的分支，并将本地项目推送到远程仓库
**1.拉取远程仓库到本地文件夹中**

```
git clone https://gitee.com/......
```

**2.进入拉取的文件夹**

```
cd ...
```

**3.创建自己的分支**

```
git checkout -b 'master'
```

**4.推送分支到gitee上**

```
git push origin master
```

## 添加（删除）文件，推送到远程
**1.拉取文件**

```
git pull origin master
```

**2.将文件推送到缓存区**

```
git add .
git add 文件名 // 二选一
```

**3.将文件推送到本地库中**

```
git commit -m '新添加的文件描述'
```

**4.推送到远程**

```
git push origin master
git push -f origin master // 强制推送，特殊情况无法提交时使用
```