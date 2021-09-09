---
title: git指令
date: 2020-07-08 19:20:32
tags: 
  - git

categories: 
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

## 删除分支
### 删除本地分支
在删除分支的时候,我们会使用 `git branch --delete dev` 来执行.有时还会通过缩写 `git branch -d dev` 来代替.使用中我们发现还有 `git branch -D dev` 的写法,他们有什么区别呢?

-d是--delete的缩写,在使用--delete删除分支时,该分支必须完全和它的上游分支merge完成,如果没有上游分支,必须要和HEAD完全merge
-D是--delete --force的缩写,这样写可以在不检查merge状态的情况下删除分支

--force简写-f,作用是将当前branch重置到初始点,如果不使用--force的话,git分支无法修改一个已经存在的分支.

### 删除远程分支

指令 `git push origin --delete branch` ,该指令也会删除追踪分支

![删除追踪分支和远程分支](https://upload-images.jianshu.io/upload_images/2291019-be805782391aac42.png?imageMogr2/auto-orient/strip|imageView2/2/w/576/format/webp)

### 删除追踪分支

通过指令 `git branch --delete --remotes <remote>/<branch>` ,可以删除追踪分支,该操作并没有真正删除远程分支,而是删除的本地分支和远程分支的关联关系,即追踪分支.

![删除追踪分支](https://upload-images.jianshu.io/upload_images/2291019-128d34afe0613ba3.png?imageMogr2/auto-orient/strip|imageView2/2/w/576/format/webp)

通过命令行 `git push origin --delete branch` 会删除远程分支和追踪分支,不需要单独删除追踪分支,但是如果通过网页对远程分支进行删除,追踪分支是不会被删除的.

在git版本1.6.6之后,可以通过 `git fetch origin --prune` 或它的简写 `git fetch origin -p` 来单独删除追踪分支