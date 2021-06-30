<template>
  <div class="content" style="width: 500px">
    <el-form :model="employee" label-width="100px" :rules="rules" ref="ruleForm">
      <el-form-item label="员工姓名" prop="nickName">
       <el-input v-model="employee.nickName"></el-input>
       </el-form-item>
       <el-form-item label="员工职位" prop="position" >
        <el-input v-model="employee.position"></el-input>
        </el-form-item>
       <el-form-item label="员工账号" prop="userName" >
         <el-input v-model="employee.userName"></el-input>
        </el-form-item>
       <el-form-item label="账号密码" prop="password" >
        <el-input type="password" v-model="employee.password"></el-input>
        </el-form-item>
        <el-form-item label="">
         <el-button type="primary" @click="addEmployee('ruleForm')">保存</el-button>
         <el-button @click="resetForm('ruleForm')">重置</el-button>
         </el-form-item>
    </el-form>

  </div>

</template>

<script>
import {Login} from '@/config/url'
  export default{
    data(){
      return{
        employee:{
          nickName:'',
          position:'',
          userName:'',
          password:''
        },
        rules:{
          nickName:[{required:true,message:'请输入员工姓名',trigger:'blur'}],
          position:[{required:true,message:'请输入员工职位',trigger:'blur'}],
          userName:[{required:true,message:'请输入员工账号',trigger:'blur'}],
          password:[{required:true,message:'请输入员工密码',trigger:'blur'}]
        }
      }
    },
    mounted(){
    },
    methods:{
        addEmployee(ruleForm) {
          const _this = this
          const token = localStorage.getItem("token");

          this.$refs[ruleForm].validate((valid) => {  //开启校验
            if (valid) {   // 如果校验通过，请求接口，允许提交表单
                const formData = _this.employee;
                _this.$axios.post(Login.addEmployee, JSON.stringify(formData),{headers: {'Content-Type': 'application/json','token':token}})
                  .then((res) => {
                    // console.log(res)
                    if (res.data.resultCode == 0) {
                       _this.$message('新增账户成功~');
                       // _this.employee = {};
                       setTimeout(function(){
                         _this.$router.push({name:'employerList'})
                       },1000)
                    }else if(res.data.resultCode == 3){
                      localStorage.removeItem("token");
                      localStorage.removeItem("userName");
                      localStorage.removeItem("pwd1");
                      _this.$router.push('/login');
                    }else{
                      _this.$message(res.data.resultMsg);
                    }
                  })
                  .catch((error) => {
                    window.console.log(error);
                  })

            } else {   //校验不通过
              return false;
            }
          });

        },
        resetForm(formName) {
          this.$nextTick(function() {
            this.$refs[formName].resetFields();
           })
        }

    }
  }
</script>

<style scoped>

</style>
