---
title: 从运行镜像到部署版本
# author: 不以by
date: 2021-09-03 17:38:08
tags: 
  - 不以by小经验

categories: 
  - 不以by小经验
---

# 提交代码
首先要把写好的代码提交到远程
我用的是 sourceTree，
好处大概就是：可以查看都修改了哪些代码，commit 中的文字可以加空格，可以随时取消 commit
坏处是：合并代码如果有冲突会报错，解决方法网上都有，但我都试了都没效果，我的解决方法就是删掉代码库重新 clone 一个
```c#
// 可以先用 git status 查看修改了哪些代码
git add .
git commit -m ''
git push
```

// 这些大家都知道，就不多说了，不知道可以去看我的另一篇博客

[git指令]: https://melanie618.github.io/2020/07/08/git/git%E6%8C%87%E4%BB%A4/


# 运行镜像
这里用的是阿里云的 codeUp，进入你的代码仓库，找到流水线
找到相应的流水线，点进去在右上角有运行按钮，点击后选择分支，填写备注，然后点击运行

# 部署
镜像运行结束后就可以部署了
```shell
ssh root@这里写域名
just4linux // 密码
ls // 查看当前目录
cd compose // 切换目录
mack pull // 拉镜像
make fe_src_frontend/make fe_src_manager
```