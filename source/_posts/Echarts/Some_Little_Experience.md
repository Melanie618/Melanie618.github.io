---
title: 使用Echarts时遇到的问题
date: 2021-08-30 13:50:19
tags:
  - Echarts
  - 小教程
categories:
  - 不以by小经验
  - Echarts
---

# 在使用 Echarts 图表时可能会遇到的问题
## 数据未重置
问题描述：
1. 我的数据改变了，但我的图表上还有之前的内容
2. 我使用地图组件做了动态攻击线，但每隔一段时间重新请求数据后，动态线出现重影
原因：
刷新得重新初始化表格，而不只是重新绑定数据，不然之前的最后一条数据会遗留下来
解决：

查看API，发现通过 myChart.clear() 这个方法可以解决问题，是最简单的。
在 myChart.setOption(option) 之前使用这个方法。

相关文档：
https://q.cnblogs.com/q/79521/


## 图表宽高问题
问题描述：
父级盒子隐藏后，图表宽高会消失或变成默认值
原因：
Echarts 图表是根据你定义的div 的样式来确定图表的大小，当图表隐藏时，Echarts会找不到div的宽和高，再次显示时它会给自己一个非常小的默认宽高值，所以在隐藏显示后会发现它变得非常非常的小，或者消失

解决：
1. 通过设置 `rem` 或者 `px` 固定宽高
2. 把 `v-show` 换成 `v-if` 就可以了
3. 在完成绘画Echarts后添加代码： `$(window).resize(myChart.resize)`
4. 在图表要显示的地方添加代码： `$(window).trigger('resize')`