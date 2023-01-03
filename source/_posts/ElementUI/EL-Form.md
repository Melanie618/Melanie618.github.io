---
title: el-form表单校验
# author: 不以by
date: 2021-12-22 16:12:07
tags: 
  - vue
  - ElementUI
  - 不以by小经验

categories: 
  - Vue
  - ElementUI
---
Form 组件提供了表单验证的功能，只需要通过 rules 属性传入约定的验证规则，并将 Form-Item 的 prop 属性设置为需校验的字段名即可。校验规则参见 [async-validator](https://github.com/yiminghe/async-validator)
# 表单验证
在data中定义表单验证规则的对象数组rules（可以单独编写验证器函数），并直接绑定到表单标签的rules参数中。
```vue
<template>
  <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
    <el-form-item label="产品名称" prop="name">
      <el-input type="name" v-model="ruleForm.name"></el-input>
    </el-form-item>
    <el-form-item label="产品描述" prop="desc">
      <el-input type="desc" v-model="ruleForm.desc" autocomplete="off"></el-input>
    </el-form-item>
  </el-form>
</template>
<script>
  export default {
    data() {
      return {
        ruleForm: {
          name: '',
          desc: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入产品名称"', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          desc: [{ required: true, message: '请填写产品描述', trigger: 'blur' }]
        }
      }
    }
  }
</script>
```

# 自定义校验规则
validator是单个表单域格式验证的验证器，一般是需要比较复杂的格式验证的时候才会用。如果是非空验证、数据类型验证或者正则表达式能处理的，都可以直接通过rules的type/Pattern等相关参数直接配置就好了。 
```vue
<template>
  <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
    <el-form-item label="密码" prop="password">
      <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="确认密码" prop="checkPass">
      <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
    </el-form-item>
  </el-form>
</template>
<script>
  export default {
    data() {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'))
        } else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass')
          }
          callback();
        }
      }
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.ruleForm.password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      return {
        ruleForm: {
          password: '',
          checkPass: ''
        },
        rules: {
          password: [{ validator: validatePass, trigger: 'blur' }],
          checkPass: [{ validator: validatePass2, trigger: 'blur' }]
        }
      }
    }
  }
</script>
```

# 动态表单校验
对于单个表单域，可以直接对表单域的rules参数进行配置，来实现格式验证，这种方法一般比较适用于格式验证比较简单的情况。如果需要进行验证的字段比较多，或者验证规则比较复杂，那么最好使用对整个表单进行验证的方式。
对表单域进行校验时，`prop` 的内容与 `v-model` 的内容要一一对应才能校验成功。
```vue
<template>
  <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="100px" class="demo-dynamic">
    <el-form-item 
      label="邮箱"
      prop="email"
      :rules="[
        { required: true, message: '请输入邮箱地址', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
      ]"
    >
      <el-input v-model="dynamicValidateForm.email"></el-input>
    </el-form-item>
    <el-form-item
      v-for="(domain, index) in dynamicValidateForm.domains" :label="'域名' + index" :key="domain.key" 
      :prop="'domains.' + index + '.value'" 
      :rules="{
        required: true, message: '域名不能为空', trigger: 'blur'
      }"
    >
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
    }
  }
</script>
```