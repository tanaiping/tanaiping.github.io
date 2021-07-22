<template>
  <div id="home">
    <el-container style="height: 100%;">
      <el-aside width="200px">
        <div class="logo">微智行加油</div>
        <Menu />
      </el-aside>
      <el-container>
        <el-header>
          <div class="flex-between">
            <Breadcrumb />
            <div class="flex-end">
              <label class=" btn-sys mr10" @click="dialogVisible1 = true"><i class="el-icon-edit"></i>修改密码</label>
              <label class="btn-sys"  @click="dialogVisible2 = true"><i class="el-icon-user-solid"></i>退出</label>
            </div>
            <!-- <el-button type="primary" style="margin-top: 10px; height: 40px;">退出</el-button> -->
          </div>

        </el-header>
        <el-main style="overflow: hidden;">
          <router-view />
        </el-main>
        <!-- <el-footer>Footer</el-footer> -->
      </el-container>
    </el-container>

    <el-dialog
      title="修改密码"
      :visible.sync="dialogVisible1"
      width="400px"
      :before-close="handleClose">
       <el-form :model="password" label-width="100px" :rules ="rules" ref="ruleForm">
         <el-form-item label="原密码"   prop="pwd1">
          <el-input type="password" v-model="password.pwd1" placeholder="请输入原密码"></el-input>
          </el-form-item>
          <el-form-item label="新密码"  prop="pwd2" >
           <el-input type="password" v-model="password.pwd2" placeholder="请输入新密码"></el-input>
           </el-form-item>
          <el-form-item label="确认新密码"  prop="pwd3" >
            <el-input type="password" v-model="password.pwd3" placeholder="请输入确认新密码"></el-input>
           </el-form-item>
       </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="editPwd('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="提示"
      :visible.sync="dialogVisible2"
      width="30%"
      :before-close="handleClose">
      <span>确认退出登录？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="exit">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import {Login} from '@/config/url'
  import Menu from '@/components/Menu'
  import Breadcrumb from '@/components/Breadcrumb'
  export default {
    name: "home",
    components:{
      Menu,
      Breadcrumb,
    },
    data(){
       var validatePwd1 = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请输入原密码'));
          } else {
            const orginPwd = localStorage.getItem("pwd1");
            if (this.password.pwd1 !== orginPwd) {
              callback(new Error('原密码不正确'));
            }else{
              callback();
            }

          }
        };
        var validatePwd2 = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请输入新密码'));
          } else if (value === this.password.pwd1) {
            callback(new Error('新密码应与原密码不一样'));
          } else {
            callback();
          }
        };
        var validatePwd3 = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请输入确认新密码'));
          } else if (value !== this.password.pwd2) {
            callback(new Error('两次输入的新密码不一致'));
          } else {
            callback();
          }
        };
      return{
        dialogVisible1:false,
        dialogVisible2:false,
        password:{
          pwd1:'',
          pwd2:'',
          pwd3:''
        },
        rules:{
          pwd1:[{ validator: validatePwd1, trigger: 'blur' }],
          pwd2:[{ validator: validatePwd2, trigger: 'blur' }],
          pwd3:[{ validator: validatePwd3, trigger: 'blur' }],
        }
      }
    },
    mounted(){

    },
    methods:{
        editPwd(ruleForm){
          const _this = this;
          const token = localStorage.getItem("token")
          const userName = localStorage.getItem("userName")

          this.$refs[ruleForm].validate((valid) => {  //开启校验
            if (valid) {   // 如果校验通过，请求接口，允许提交表单
                const formData = {
                  userName:userName,
                  password:_this.password.pwd3
                };
                _this.$axios.post(Login.editPwd, JSON.stringify(formData),{headers: {'Content-Type': 'application/json','token':token}})
                  .then((res) => {
                    //console.log(res)
                    if (res.data.resultCode == 0) {
                      _this.dialogVisible1 = false;
                       // _this.$message('密码设置成功~');
                       _this.$alert('密码设置成功~', '温馨提示', {
                           confirmButtonText: '确定',
                            type: 'success',
                           callback: action => {
                             localStorage.removeItem("token");
                             localStorage.removeItem("userName");
                             localStorage.removeItem("pwd1");
                             _this.$router.push('/login');
                           }
                         });
                       // setTimeout(function(){
                       //   localStorage.removeItem("token");
                       //   localStorage.removeItem("userName");
                       //   localStorage.removeItem("pwd1");
                       //   _this.$router.push('/login');
                       // },1000)
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
        exit(){
          const token = localStorage.getItem("token")
          const _this = this;
          const formData = {};
          _this.$axios.get(Login.logout,{headers: {'Content-Type': 'application/json','token':token}})
            .then((res) => {
              // console.log(res)
              if (res.data.resultCode == 0) {
                localStorage.removeItem("token");
                localStorage.removeItem("userName");
                localStorage.removeItem("pwd1");
                _this.$router.push('/login');
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
        handleClose(done) {
          console.log(done)
          done();
        },
     }
  };
</script>

<style>
.logo{
  font-size: 26px;
  letter-spacing: 10px;
  text-align: center;
  line-height: 60px;
}
.flex-between{
  display: flex;
  justify-content: space-between;

}
#home{
  height: 100%;
}
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  padding:20px;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
.btn-sys{
  line-height: 60px;
  color: #09524b;
  cursor: pointer;
}
</style>
