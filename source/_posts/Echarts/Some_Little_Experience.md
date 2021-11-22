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
当父级盒子宽高设置为100%，图表宽度变成100%
也有另一种情况，通过 display 来展示父级盒子是否展示，当父级盒子重新打开之后，图表宽高会变为0
原因：
Echarts 图表是根据你定义的div 的样式来确定图表的大小，当图表隐藏时，Echarts会找不到div的宽和高，再次显示时它会给自己一个非常小的默认宽高值，所以在隐藏显示后会发现它变得非常非常的小，或者消失

解决：
``` vue
<template>
  <div id="chart" ref="chart" class="chart" />
</template>
<script>
export default {
  methods: {
    getChartWH() {
      this.chart = this.$echarts.init(document.getElementById('chart')) // 获取父级盒子
      this.chartWidth = this.$refs['chart'].clientWidth // 通过ref获取宽高
      this.chartHeight = this.$refs['chart'].clientHeight
      window.addEventListener('resize', () => { // 通过 addEventListener 监听变化
        this.chart.resize() // 当父级盒子宽高变化时，重新渲染图表大小
      })
    }
  }
}
</script>
```

如果你需要多个图表进行切换，只需要封装一下就可以多次调用了

``` vue
<template>
  <div v-if="cur === 0" id="chart" ref="chart" class="chart" />
  <div v-elseif="cur === 1" id="chart1" ref="chart1" class="chart" />
  <div v-elseif="cur === 2" id="chart2" ref="chart2" class="chart" />
</template>
<script>
export default {
  methods: {
    getChartWH(chart) {
      this.chartWidth = this.$refs[chart].clientWidth // 通过ref获取宽高
      this.chartHeight = this.$refs[chart].clientHeight
      window.addEventListener('resize', () => { // 通过 addEventListener 监听变化
        this.chart.resize() // 当父级盒子宽高变化时，重新渲染图表大小
      })
    },
    getData() {
      this.chart = this.$echarts.init(document.getElementById('chart'))
      this.getChartWH('chart') // 调用方法时将传递的值替换一下就可以了
      this.chart.setOption(this.option)
    }
  }
}
</script>
```
这里需要注意的是调用 `getChartWH` 方法要在 dom 元素渲染成功后，否则会找不到
