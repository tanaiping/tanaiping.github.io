<template>
  <div class="content">
    <div class="flex-search" id="searchBox">
        <el-date-picker
              v-model="dateRange"
              type="daterange"
               value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期" class="mr10">
            </el-date-picker>
        <el-select v-model="citys" multiple placeholder="请选择" class="mr10">
            <el-option
              v-for="(item,i) in options"
              :key="item.city"
              :label="item.city"
              :value="item.city">
            </el-option>
          </el-select>
        <el-button  icon="el-icon-refresh" @click="resetForm">重置</el-button>
        <el-button type="primary"  icon="el-icon-search" @click="search">查询</el-button>

    </div>
    <!-- 过虑条件  end-->
    <!-- 标题  end-->
    <div class="mt20">
      <div class="flex-end">
        <el-button type="primary" icon="el-icon-download" @click="downTable" >下载表格</el-button>
        <el-tooltip class="item" effect="dark" placement="bottom">
          <el-button type="text">名词释义<i class="el-icon-question"></i></el-button>
          <div slot="content">
            <ul class="tipslist">
            	<li v-for="(item,i) in tips"  :key="i">
                <div class="t1">{{item.title}}</div>
                <div class="t2">{{item.name}}</div>
              </li>
            </ul>
          </div>
        </el-tooltip>
      </div>
      <div :style="{'height':tabH+'px','overflow':'auto'}">
        <el-table
            :data="contentData"
            :height="tabH"
            stripe
            ref="tableList"
            style="width: 100%">
            <el-table-column align="center" width="120"
              prop="reportTime"
              label="日期">
            </el-table-column>
            <el-table-column align="center"
              prop="userCnt"
              label="支付用户数">
            </el-table-column>
            <el-table-column align="center"
              prop="orderCnt"
              label="支付订单数">
            </el-table-column>
            <el-table-column align="center"
              prop="refuntCnt"
              label="退款订单">
            </el-table-column>
            <el-table-column align="center"
              prop="newUserCnt"
              label="支付新用户">
            </el-table-column>
            <el-table-column align="center"
              prop="newOrderCnt"
              label="新用户订单">
            </el-table-column>
            <el-table-column align="center"
              prop="liters"
              label="交易升数">
            </el-table-column>
            <el-table-column align="center"
              label="交易金额">
              <template slot-scope="scope">
                ￥{{!scope.row.pay_amount?'0.00':scope.row.pay_amount}}
              </template>
            </el-table-column>
            <el-table-column align="center"
              label="协议金额">
              <template slot-scope="scope">
                ￥{{!scope.row.contract_amount?'0.00':scope.row.contract_amount}}
              </template>
            </el-table-column>
            <el-table-column align="center"
              label="盈利">
              <template slot-scope="scope">
                ￥{{!scope.row.discount_amount?'0.00':scope.row.discount_amount}}
              </template>
            </el-table-column>
          </el-table>
        </div>
    </div>

      <div class="page">
          <Page :pageSize="pageSize" :cur="curPage" :total="total" @pageChange="changeCurPage"/>
       </div>

  </div>

</template>

<script>
  import {Statistics} from '@/config/url'
  import Page from '@/components/page'
  export default{
    components:{
      Page,
    },
    data(){
      return{
        dateRange:'',
        citys:[],
        contentData: [],
        options:[],
        pageSize:10,
        curPage:1,
        total:0,
        tips:[
          {
            title:'支付用户数',
            name:'当日成功付款的用户数'
          },
          {
            title:'支付订单数',
            name:'当日已付款的订单数'
          },
          {
            title:'退款订单',
            name:'当日退款的订单数'
          },
          {
            title:'支付新用户',
            name:'当日首次付款下单的用户数'
          },
          {
            title:'新用户订单',
            name:'当日首次付款下单的订单数'
          },
          {
            title:'交易升数',
            name:'当日已付款加油订单的加油量总和'
          },
          {
            title:'交易金额',
            name:'当日已付款订单的交易金额总和'
          },
          {
            title:'协议金额',
            name:'当日下单成功订单的协议金额总和'
          },
          {
            title:'盈利',
            name:'当日下单成功订单的盈利综合（盈利=交易金额-协议金额）'
          },
        ],
        tabH:0
      }

    },
    mounted(){
      const _this = this;
      _this.$nextTick(() => {
          _this.getTabH();
      });
      window.onresize = () => {
         return (() => {
           _this.getTabH();
         })()
       }
      this.getCityList();
      this.getListData(_this.curPage);
    },
    methods:{
      getTabH(){
        const _this = this;
        let clientH = document.body.clientHeight || document.documentElement.clientHeight;
        let searchH = document.getElementById("searchBox").offsetHeight;
        let tabH = clientH - 60 - 20 - searchH - 20 -40 - 52;
        _this.tabH = tabH;
      },
      search(){
        const _this = this;
        _this.curPage = 1;
        _this.getListData(_this.curPage);
      },
      resetForm(){
        this.citys = '';
        this.dateRange = '';
      },
      changeCurPage(p){
        const _this = this;
        this.curPage = p;
        this.$refs.tableList.bodyWrapper.scrollTop = 0;
        _this.getListData(_this.curPage);
      },
      handleShow(index, row) {
        // console.log(index, row);
        this.dialogVisible = true
      },
      handleEdit(index, row) {
        // console.log(index, row);
        const _this = this;
        _this.contentData.forEach(function(item,index){
          if(item.id == row.id){
            _this.ruleForm = item;
          }
        })
        this.dialogVisible1 = true
      },
      handleClose(done) {
        done();
      },
      getListData(pageNo) {
        const _this = this;
        const token = localStorage.getItem('token');
        let startTime ='',endTime = '';
        let citys = '';
        if(_this.dateRange!==''){
        startTime = _this.dateRange[0]
        endTime = _this.dateRange[1]
        }
        if(_this.citys.length>0){
          citys = _this.citys.join(",")
        }
        const formData = {
          pageNo:pageNo,
          startTime:startTime,
          endTime:endTime,
          citys:citys

        }
        _this.$axios.post(Statistics.orderList, JSON.stringify(formData),{headers: {'Content-Type': 'application/json','token':token}})
          .then((res) => {
            // console.log(res)
            if (res.data.resultCode == 0) {
              if(res.data.data.data){
                _this.contentData = res.data.data.data;
              }else{
                _this.contentData = [];
              }
              _this.total = res.data.data.total
              _this.pageSize = res.data.data.limit
              _this.curPage = res.data.data.pageNo
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
      getCityList(){
        const _this = this;
        const token = localStorage.getItem('token');
        const formData = {}
        _this.$axios.post(Statistics.getCityList, JSON.stringify(formData),{headers: {'Content-Type': 'application/json','token':token}})
          .then((res) => {
            // console.log(res)
            if (res.data.resultCode == 0) {
              _this.options = res.data.data;
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
      downTable(){
        const _this = this;
        const token = localStorage.getItem('token');
        let startTime ='',endTime = '';
        let citys = '';
        if(_this.dateRange!==''){
        startTime = _this.dateRange[0]
        endTime = _this.dateRange[1]
        }
        if(_this.citys.length>0){
          citys = _this.citys.join(",")
        }
        const formData = {
          pageNo:_this.curPage,
          startTime:startTime,
          endTime:endTime,
          citys:citys

        }
        _this.$axios.post(Statistics.exportOrderList, JSON.stringify(formData),{headers: {'Content-Type': 'application/json','token':token}})
          .then((res) => {
            // console.log(res.data.data)
            if (res.data.resultCode == 0) {
                // window.open(res.data.data);
                window.open(res.data.data,"_blank");
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
    }
  }
</script>

<style scoped>
  .tipslist{
    list-style: none;
    padding: 0;
    margin: 0;
    padding: 20px 20px 0 20px;
  }
  .tipslist li{
    margin-bottom: 20px;
  }
   .tipslist li .t1{
     color: #FFF;
     font-size: 14px;
   }
   .tipslist li .t2{
     color: #999;
     font-size: 12px;
     line-height: 22px;
   }
</style>
