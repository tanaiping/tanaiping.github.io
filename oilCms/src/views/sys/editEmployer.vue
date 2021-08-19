<template>
  <div class="content" style="width: 500px">
    <el-form :model="employee"  ref="ruleForm" label-width="100px">
      <el-form-item label="员工姓名：" >
       <el-input v-model="employee.nickName" autoComplete="off" autocomplete="new-password"></el-input>
       </el-form-item>
       <el-form-item label="员工职位：" >
        <el-input v-model="employee.position" autoComplete="off" autocomplete="new-password"></el-input>
        </el-form-item>
       <el-form-item label="员工账号：" autoComplete="off" autocomplete="new-password">
          <label>{{employee.userName}}</label>
        </el-form-item>
       <el-form-item label="账号密码：" >
        <el-input type="password" v-model="employee.password" autoComplete="off" autocomplete="new-password"></el-input>
        </el-form-item>
        <el-form-item label="">
         <el-button type="primary" @click="editEmployee('ruleForm')">保存</el-button>
         <el-button @click="back">取消</el-button>
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
      _this.pageNo = _this.$route.query.pageNo
      _this.id = _this.$route.query.id
      _this.getListData(_this.pageNo);
    },
    methods:{
        getListData(pageNo) {
          const _this = this;
          const token = localStorage.getItem('token');
          const formData = {
            userId:_this.id
          }
          // console.log(formData)
          _this.$axios.get(Login.getEmployeeInfo+"?userId="+_this.id,{headers: {'Content-Type': 'application/json','token':token}})
            .then((res) => {
              // console.log(res)
              if (res.data.resultCode == 0) {
                if(res.data.data){
                   _this.employee = res.data.data;
                }
              }else if(res.data.resultCode == 3){
                localStorage.removeItem("token");
                localStorage.removeItem("userName");
                localStorage.removeItem("pwd1");
                _this.$router.push('/login');
              }else{
                // _this.$message(res.data.resultMsg);
                _this.$alert(res.data.resultMsg, '温馨提示', {
                  confirmButtonText: '确定',
                   type: 'error',
                  callback: action => {
                  }
                });
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
                       // _this.$message('信息修改成功~');
                       // setTimeout(function(){
                       //   _this.$router.push({name:'employerList'})//
                       // },1000)
                       _this.$alert('信息修改成功~', '温馨提示', {
                           confirmButtonText: '确定',
                            type: 'success',
                           callback: action => {
                             _this.$router.push({name:'employerList'})//
                           }
                         });

                    }else if(res.data.resultCode == 3){
                      localStorage.removeItem("token");
                      localStorage.removeItem("userName");
                      localStorage.removeItem("pwd1");
                      _this.$router.push('/login');
                    }else{
                      // _this.$message(res.data.resultMsg);
                      _this.$alert(res.data.resultMsg, '温馨提示', {
                        confirmButtonText: '确定',
                         type: 'error',
                        callback: action => {
                        }
                      });
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
        back() {
          this.$router.go(-1);
        }
    }
  }
</script>

<style scoped>

</style>
