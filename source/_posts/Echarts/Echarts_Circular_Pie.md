---
title: 环形图/圆角环形图
date: 2021-08-30 13:50:19
tags:
  - Echarts
  - 小教程
categories:
  - 不以by小教程
  - Echarts
  - 饼图使用
aplayer: true
---

由于在项目中需要对数据进行可视化，也就是用图表展示，常用的图表插件有echarts，highcharts，这里选择了比较大众化的echarts。

所有的数据都是动态获取的，由前端向后台请求。当然请求数据肯定不会放在图表组件中，而是放在了外部。所以可以封装成组件，使用时向图表传递数据。

### 安装 echarts 依赖

```javascript
npm install echarts -S

// 或者使用淘宝的镜像

npm install -g cnpm --registry=https://registry.npm.taobao.org
cnpm install echarts -S
```

### 创建图表

首先需要全局引入
在 main.js 中

```javascript
// 引入 echarts
import echarts from 'echarts'
Vue.prototype.$echarts = echarts
```

创建组件 echarts.vue

```vue
<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
export default {
    name: 'hello',
    data () {
      return {
        msg: 'Welcome to Your Vue.js App'
      }
    },
    mounted() {
        this.PieChart()
    },
	methods: {
    PieChart() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById('myChart'))
      // 绘制图表
      myChart.setOption({
        title: { text: '在Vue中使用echarts' },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '5%',
          left: 'center'
        },
        series: [{
          name: '访问来源',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '40',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: [
            {value: 1048, name: '搜索引擎'},
            {value: 735, name: '直接访问'},
            {value: 580, name: '邮件营销'},
            {value: 484, name: '联盟广告'},
            {value: 300, name: '视频广告'}
          ]
        }]
      })
    }
  }
}
</script>
```

![pie](/images/Echarts/pie.jpg)
