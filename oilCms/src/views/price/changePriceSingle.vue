<template>
  <div class="content">
    <div class="title-com">油站信息</div>
    <el-form :model="ruleForm" label-width="100px" ref="ruleForm" :rules="ruleForm.dataRules">
      <el-form-item label="油站名称" prop="name">
        <label >{{ruleForm.params.station_name}}</label>
      </el-form-item>
      <el-form-item label="油站地址" prop="name">
        <label >{{ruleForm.params.address}}</label>
      </el-form-item>

      <div class="title-com">油品信息</div>
        <el-table
            :data="ruleForm.params.oilInfoList"
            stripe
            style="width: 600px">
            <el-table-column
            prop="oil_no"
            label="油号">
            </el-table-column>
            <el-table-column
            prop="official_price"
              label="发改委价">
            </el-table-column>
            <el-table-column
            prop="list_price"
            label="挂牌价">
            </el-table-column>
            <el-table-column
            prop="contract_price"
              label="协议价">
              </el-table-column>
           <!-- <el-table-column label="售价" width="200px">
              <template slot-scope="scope">
                   <el-form-item  :prop="'params.' + scope.$index + '.sale_price'"
                   :rules="ruleForm.dataRules.sale_price" label-width="0px">
                      <el-input  v-model="scope.row.sale_price===''?scope.row.sale_price = scope.row.list_price:scope.row.sale_price" placeholder="售价" :data-i="scope.row.list_price"></el-input>
                    </el-form-item>
              </template>
            </el-table-column> -->
            <el-table-column
                label="售价"
                min-width="200px">
                <template slot-scope="scope">
                    <el-form-item label-width="0px"
                        :prop="'params.oilInfoList.' + scope.$index + '.sale_price'"
                        :rules="ruleForm.dataRules.sale_price" style="margin-bottom: 0;">
                        <el-input  v-model="scope.row.sale_price" placeholder="售价" :data-i="scope.row.list_price"></el-input>
                    </el-form-item>
                </template>
            </el-table-column>
          </el-table>
        <el-form-item label="">
          <div class="mt20">
            <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
            <el-button @click="goback">取 消</el-button>
          </div>
        </el-form-item>


    </el-form>
  </div>

</template>

<script>
 import {Price} from '@/config/url'
  export default{
    data(){
      // 自定义校验规则
      var salePrice = (rule, value, callback) => {
        // rule 对应使用salePrice自定义验证的 对象
        // value 对应使用salePrice自定义验证的 数值
        // callback 回调函数
        // console.log(rule)
        // console.log(event.target.dataset.i)
        if (value == null || String(value).trim() === "") {
          callback(new Error("不能为空"));
        } else if (value> event.target.dataset.i) {
          callback(new Error("请修改售价，售价≤挂牌价"));
        }else if (value<0) {
          callback(new Error("请修改售价，售价必须为正数"));
        }else {
          callback();
        }
      };
      return{
        stationId:'',
        ruleForm:{
          params:{},
          dataRules:{
            'sale_price':[
              { validator: salePrice, trigger: 'blur' },
            ],
          }
        },
//         rules:{
//
//         }
      }

    },
    mounted(){
      this.stationId = this.$route.query.stationId;
      // console.log(this.stationId)
      this.getDetailData();
    },
    methods:{
      getDetailData() {
        const _this = this;
        const token = localStorage.getItem('token');
        // const formData = {
        //   stationId:_this.stationId
        // }
        _this.$axios.get(Price.detail+"?stationId="+_this.stationId,{headers: {'Content-Type': 'application/json','token':token}})
          .then((res) => {
            // console.log(res)
            if (res.data.resultCode == 0) {
              _this.ruleForm.params = res.data.data;
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
      submitForm(ruleForm){
        const _this = this;
        const token = localStorage.getItem('token');

        this.$refs[ruleForm].validate((valid) => {  //开启校验
          if (valid) {   // 如果校验通过，请求接口，允许提交表单
              const str = _this.ruleForm.params.oilInfoList;
              let isflag = false;
              const newArr = JSON.parse(JSON.stringify(str));
              newArr.forEach(function(item,index){
                if(parseFloat(item.list_price) <parseFloat(item.sale_price)){
                  // console.log(item.list_price)
                  // console.log(item.sale_price)
                  isflag =  true;
                }else{
                  _this.$delete(item,'official_price')
                  _this.$delete(item,'list_price')
                  _this.$delete(item,'contract_price')
                }
              })
              if(isflag){
                // _this.$message('请修改售价，售价≤挂牌价');
                _this.$alert('请修改售价，售价≤挂牌价', '温馨提示', {
                  confirmButtonText: '确定',
                   type: 'error',
                  callback: action => {
                  }
                });
                return false;
              }
              const formData = {
                stationId:_this.stationId,
                oilInfoList:newArr
              }
              _this.$axios.post(Price.reviseOilPrice, JSON.stringify(formData),{headers: {'Content-Type': 'application/json','token':token}})
                .then((res) => {
                  // console.log(res)
                  if (res.data.resultCode == 0) {
                    // _this.$message('改价成功');
                    // setTimeout(function(){_this.$router.go(-1);},1000)
                    _this.$alert('改价成功', '温馨提示', {
                      confirmButtonText: '确定',
                       type: 'success',
                      callback: action => {
                        _this.$router.go(-1);
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
      goback(){
        this.$router.go(-1);//返回上一层
      }

    }
  }
</script>

<style scoped>
</style>
