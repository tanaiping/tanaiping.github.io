<template>
  <div class="content">
    <div :style="{'width': '100%','height':conH+'px','overflow':'auto','width':'100%'}">
      <el-form ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="注释：">
          <label >油站价格是会变动的，价格变动后接口根据获取的协议价和涨幅比例，以及挂牌价自动生成默认的销售价格~</label>
        </el-form-item>
        <el-form-item label="适用油站：">
          <label >所有油站</label>
        </el-form-item>
        <el-form-item label="售价公式：">
          <label >售价=协议价（1+涨幅比例）</label>
        </el-form-item>
        <el-form-item label="价格校验：">
          <label style="color: #F56C6C;">售价不能大于挂牌价；若售价大于挂牌价，则售价等于挂牌价</label>
        </el-form-item>
        <el-form-item label="涨幅比例：">
          <el-input v-model="val1" placeholder="请输入内容" class="percent-w" disabled><template slot="append">%</template></el-input>
          <el-button type="primary"  icon="el-icon-edit" @click="showPriceDialog">修改</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-dialog
      title="变理涨幅比例"
      :visible.sync="dialogVisible1"
      width="400px"
      :before-close="handleClose">
       <el-form :model="obj" label-width="100px" :rules ="rules" ref="ruleForm">
         <el-form-item label="涨幅比例：" prop="percent">
          <el-input type="text" v-model="obj.percent" placeholder="请输入涨幅比例" class="percent-w"></el-input>
          </el-form-item>
       </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="editPrice('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>

  </div>

</template>

<script>
  import {Price} from '@/config/url'
  export default{
    data(){
      var validatePercent = (rule, value, callback) => {
         if (value === '') {
           callback(new Error('请输入涨幅比例'));
         } else {
           let reg = /^100$|^(\d|[1-9]\d)(\.\d{1,2})*$/
           if(reg.test(value) == false){
             callback(new Error('只能输0-100的数值，最多2位小数'));
           }else{
             callback();
           }

         }
       };

      return{
        val1:0,
        val2:0,
        conH:0,
        dialogVisible1:false,
        obj:{
          percent:'',
        },
        rules:{
          percent:[{ validator: validatePercent, trigger: 'blur' }],
        }
      }

    },
    mounted(){
      const _this = this;
      _this.$nextTick(() => {
          _this.getConH();
      });
      window.onresize = () => {
         return (() => {
           _this.getConH();
         })()
       }
      _this.getOilRate();
    },
    methods:{
      getConH(){
        const _this = this;
        let clientH = document.body.clientHeight || document.documentElement.clientHeight;
        let conH = clientH - 60 - 20;
        _this.conH = conH;
      },
      getOilRate() {
        const _this = this;
        const token = localStorage.getItem('token');
        // const formData = {
        //   stationId:_this.stationId
        // }
        _this.$axios.get(Price.getOilRate,{headers: {'Content-Type': 'application/json','token':token}})
          .then((res) => {
            console.log(res)
            if (res.data.resultCode == 0) {
              _this.val1 = res.data.data;
              _this.obj.percent = res.data.data;
               // console.log(_this.ruleForm)
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
      showPriceDialog(){
        this.dialogVisible1 = true;
      },
      editPrice(ruleForm){
        const _this = this;
        const token = localStorage.getItem("token")

        this.$refs[ruleForm].validate((valid) => {  //开启校验
          if (valid) {   // 如果校验通过，请求接口，允许提交表单

              _this.$axios.get(Price.updateOilRate+"?oilRate="+_this.obj.percent,{headers: {'Content-Type': 'application/json','token':token}})
                .then((res) => {
                  //console.log(res)
                  if (res.data.resultCode == 0) {
                    _this.dialogVisible1 = false;
                     // _this.$message('密码设置成功~');
                     _this.$alert('涨幅比例修改成功~', '温馨提示', {
                         confirmButtonText: '确定',
                          type: 'success',
                         callback: action => {
                           _this.val1 = _this.obj.percent;
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
      handleClose(done) {
        done();
      },
    }
  }
</script>

<style scoped>
  .percent-w{
    width: 200px;
  }
</style>
