---
title: prop链式写法
# author: 不以by
date: 2021-09-26 16:36:37
tags: 
  - vue
  - ElementUI
  - 不以by小经验

categories: 
  - Vue
  - ElementUI
---
```vue
<template>
  <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="100px" class="demo-dynamic">
    <el-form-item
      prop="email"
      label="邮箱"
      :rules="[
        { required: true, message: '请输入邮箱地址', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
      ]"
    >
      <el-input v-model="dynamicValidateForm.email"></el-input>
    </el-form-item>
    <el-form-item
      v-for="(domain, index) in dynamicValidateForm.domains"
      :label="'域名' + index"
      :key="domain.key"
      :prop="'domains.' + index + '.value'"
      :rules="{
        required: true, message: '域名不能为空', trigger: 'blur'
      }"
    >
      <el-input v-model="domain.value"></el-input><el-button @click.prevent="removeDomain(domain)">删除</el-button>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('dynamicValidateForm')">提交</el-button>
      <el-button @click="addDomain">新增域名</el-button>
      <el-button @click="resetForm('dynamicValidateForm')">重置</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
  export default {
    data() {
      return {
        dynamicValidateForm: {
          domains: [{
            value: ''
          }],
          email: ''
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      removeDomain(item) {
        var index = this.dynamicValidateForm.domains.indexOf(item)
        if (index !== -1) {
          this.dynamicValidateForm.domains.splice(index, 1)
        }
      },
      addDomain() {
        this.dynamicValidateForm.domains.push({
          value: '',
          key: Date.now()
        });
      }
    }
  }
</script>
```

其中动态表单校验中用到了 `:prop="'domains.'+index+'.value'"` 而 `domains` 是一个数组.常规来说这么写相当于是 `domains.1.value` 的写法，但这种写法肯定是有问题的。没看源码不是很理解这样的链式操作。

感觉 `:prop="'domains.'+index+'.value'"` 这种写法错误的,会换成 `:prop="'domains['+index+'].value'"` 这种写法, 其实看了源码之后才明白这两种写法都是正确的.
1. prop 接收的数据类型是 String
2. `:prop="'domains.'+index+'.value'"` 和 `:prop="'domains['+index+'].value'"` 这两种传值最终都是转换成了 `domains.0.value` 字符串，这是一个字符串 而不是通过 `domains.0` 来取 `domains` 数组的第一个元素
浮上部分源码
![](https://cdn.jsdelivr.net/gh/Melanie618/CDN@v1.0/images/ElementUI/El-Form/1502856-20181010162553209-120878951.png?raw=true)
![](https://cdn.jsdelivr.net/gh/Melanie618/CDN@v1.0/images/ElementUI/El-Form/1502856-20181010162743794-1203877402.png?raw=true)
![](https://cdn.jsdelivr.net/gh/Melanie618/CDN@v1.0/images/ElementUI/El-Form/1502856-20181010162700061-1335666674.png?raw=true)