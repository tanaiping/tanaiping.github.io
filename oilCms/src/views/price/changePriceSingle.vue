<template>
  <div class="content">
    <div class="title-com">油站信息</div>
    <el-form :model="ruleForm" label-width="100px">
      <el-form-item label="油站名称" prop="name">
        <label >{{ruleForm.station_name}}</label>
      </el-form-item>
      <el-form-item label="油站地址" prop="name">
        <label >{{ruleForm.address}}</label>
      </el-form-item>
    </el-form>
      <div class="title-com">油品信息</div>
        <el-table
            :data="ruleForm.oilInfoList"
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
            <el-table-column label="售价" width="200px">
              <template slot-scope="scope">
                <el-form :model="scope.row" ref="ruleForm" :rules="rules" label-width="0px">
                   <el-form-item label="" prop="sale_price">
                      <el-input  v-model="scope.row.sale_price===''?scope.row.list_price:scope.row.sale_price" placeholder="售价" :data-i="scope.row.list_price"></el-input>
                    </el-form-item>
                </el-form>
              </template>
            </el-table-column>
          </el-table>
      <div class="mt20">
        <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
        <el-button @click="goback">取 消</el-button>
      </div>


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
        console.log(rule)
        console.log(event.target.dataset.i)
        if (value == null || String(value).trim() === "") {
          callback(new Error("不能为空"));
        } else if (value> event.target.dataset.i) {
          callback(new Error("请修改售价，售价≤挂牌价111"));
        }else if (value<0) {
          callback(new Error("请修改售价，售价必须为正数"));
        }else {
          callback();
        }
      };
      return{
        stationId:'',
        ruleForm:{
          "address": "南山区1南新路 1040 号",
          "oilInfoList": [
            {
              "infoId": "1",
              "oil_no": "2",
              "official_price": "5.23",
              "list_price": "5.523",
              "contract_price": "5.223",
              "sale_price": "5.85"
            },
            {
              "infoId": "1",
              "oil_no": "3",
              "official_price": "5.23",
              "list_price": "8.223",
              "contract_price": "5.223",
              "sale_price": "5.85"
            }
          ],
          "station_name": "高新园站加油站"
        },
        rules:{
          sale_price:[
            { validator: salePrice, trigger: 'blur' },
          ],
        }
      }

    },
    mounted(){
      this.stationId = this.$route.params.stationId;
      console.log(this.stationId)
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
            console.log(res)
            if (res.data.resultCode == 0) {
              _this.ruleForm = res.data.data;
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
      submitForm(ruleForm){
        const _this = this;
        const token = localStorage.getItem('token');

        this.$refs[ruleForm].validate((valid) => {  //开启校验
          if (valid) {   // 如果校验通过，请求接口，允许提交表单
              const str = _this.ruleForm.oilInfoList;
              let isflag = false;
              const newArr = JSON.parse(JSON.stringify(str));
              newArr.forEach(function(item,index){
                if(parseFloat(item.list_price) <parseFloat(item.sale_price)){
                  console.log(item.list_price)
                  console.log(item.sale_price)
                  _this.$message(item.list_price+'请修改售价，售价≤挂牌价==='+item.sale_price);
                  isflag =  true;
                }else{
                  _this.$delete(item,'official_price')
                  _this.$delete(item,'list_price')
                  _this.$delete(item,'contract_price')
                }
              })
              if(isflag){
                _this.$message('请修改售价，售价≤挂牌价');
                return false;
              }
              const formData = {
                stationId:_this.stationId,
                oilInfoList:newArr
              }
              _this.$axios.post(Price.reviseOilPrice, JSON.stringify(formData),{headers: {'Content-Type': 'application/json','token':token}})
                .then((res) => {
                  console.log(res)
                  if (res.data.resultCode == 0) {
                    _this.$message('改价成功');
                    setTimeout(function(){_this.$router.go(-1);},1000)
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
      goback(){
        this.$router.go(-1);//返回上一层
      }

    }
  }
</script>

<style scoped>
</style>
