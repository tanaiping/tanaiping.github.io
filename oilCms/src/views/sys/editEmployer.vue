<template>
  <div class="content" style="width: 500px">
    <el-form :model="employee" ref="ruleForm" label-width="100px">
      <el-form-item label="员工姓名" >
       <el-input v-model="employee.nickName"></el-input>
       </el-form-item>
       <el-form-item label="员工职位" >
        <el-input v-model="employee.position"></el-input>
        </el-form-item>
       <el-form-item label="员工账号" >
          <label>{{employee.userName}}</label>
        </el-form-item>
       <el-form-item label="账号密码" >
        <el-input type="password" v-model="employee.password"></el-input>
        </el-form-item>
        <el-form-item label="">
         <el-button type="primary" @click="editEmployee('ruleForm')">保存</el-button>
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
        employee:{},
        pageNo:1,
        id:'',
      }
    },
    mounted(){
      const _this = this;
      _this.pageNo = _this.$route.params.pageNo
      _this.id = _this.$route.params.id
      _this.getListData(_this.pageNo);
    },
    methods:{
        getListData(pageNo) {
          const _this = this;
          const token = localStorage.getItem('token');
          const formData = {
            userName:'',
            nickName:'',
            startTime:'',
            endTime:'',
            pageNo:pageNo
          }
          _this.$axios.post(Login.employeeList, JSON.stringify(formData),{headers: {'Content-Type': 'application/json','token':token}})
            .then((res) => {
              console.log(res)
              if (res.data.resultCode == 0) {
                res.data.data.data.forEach(function(item,index){
                  if(item.id == _this.id){
                    _this.employee = item;
                  }
                })
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
        },
        editEmployee(ruleForm) {
          const _this = this
          const token = localStorage.getItem("token");

          this.$refs[ruleForm].validate((valid) => {  //开启校验
            if (valid) {   // 如果校验通过，请求接口，允许提交表单
                const formData = _this.employee;
                _this.$axios.post(Login.editEmployee, JSON.stringify(formData),{headers: {'Content-Type': 'application/json','token':token}})
                  .then((res) => {
                    // console.log(res)
                    if (res.data.resultCode == 0) {
                       _this.$message('信息修改成功~');
                       setTimeout(function(){
                         _this.$router.push({name:'employerList'})//
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
