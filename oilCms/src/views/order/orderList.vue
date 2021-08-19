<template>
  <div class="content">
    <div class="flex-search" id="searchBox">
      <el-form ref="form" label-width="80px" @keyup.enter.native="search">
        <el-input v-model="phone" placeholder="请输入手机号" class="filter-input mr10"></el-input>
        <el-input v-model="orderNo" placeholder="请输入订单号" class="filter-input mr10"></el-input>
        <el-input v-model="stationName" placeholder="请输入油站名称" class="filter-input mr10"></el-input>
        <el-input v-model="source" placeholder="请输入渠道名称" class="filter-input mr10"></el-input>
        
        <el-date-picker
              v-model="dateRange"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期" class="mr10">
            </el-date-picker>
        <el-select v-model="status_v" placeholder="请选择订单状态" class="mr10">
          <el-option label="全部" value='-1'></el-option>
          <el-option label="支付成功" value='1'></el-option>
          <el-option label="下单成功" value='8'></el-option>
          <el-option label="下单失败" value='9'></el-option>
          <el-option label="已退款" value='4'></el-option>
          <el-option label="申请退款" value='10'></el-option>
        </el-select>
        <el-button  icon="el-icon-refresh" @click="resetForm">重置</el-button>
        <el-button type="primary"  icon="el-icon-search" @click="search">查询</el-button>

      </el-form>
    </div>
    <!-- <div class="flex" style="padding: 20px 0;">
      <el-button  type="primary" icon="el-icon-plus" @click="add">新增</el-button>
      <el-button type="success" icon="el-icon-edit" disabled>修改</el-button>
      <el-button   icon="el-icon-delete" disabled>删除</el-button>
      <el-button type="info" icon="el-icon-upload2" disabled>导入</el-button>
      <el-button type="error" icon="el-icon-download" disabled>导出</el-button>
    </div> -->
    <!-- 过虑条件  end-->
    <!-- 标题  end-->
    <div class="flex-end mt20">
      <el-button type="primary" icon="el-icon-download" @click="exportTable">导出表格</el-button>
    </div>
    <div :style="{'height':tabH+'px','overflow':'auto'}">
      <el-table
          :data="contentData"
          stripe
          :height="tabH"
          ref="tableList"
          style="width: 100%">
          <el-table-column align="center"
          width="50px"
          label="编号">
          <template slot-scope="scope">
            {{ (scope.$index+1)+(curPage-1)*pageSize}}
          </template>
          </el-table-column>
          <el-table-column align="center"
          prop="source"
            label="渠道名称">
          </el-table-column>
          <el-table-column align="center"
          prop="order_code"
          width="110px"
          label="渠道订单号">
          </el-table-column>
          <el-table-column  width="110px" align="center"
          prop="orderNo"
            label="订单号">
            </el-table-column>
            <el-table-column  width="100px" align="center"
            label="油站名称">
            <template slot-scope="scope">
              <div class="ellipsis">{{scope.row.station_name}}</div>
            </template>
            </el-table-column>
            <el-table-column width="110px" align="center"
            prop="phone"
              label="手机号">
            </el-table-column>
            <el-table-column width="50px" align="center"
              label="油号">
              <template slot-scope="scope">
                {{scope.row.oil_no}}#
              </template>
            </el-table-column>
            <el-table-column width="50px" align="center"
            prop="gun_no"
              label="油枪">
            </el-table-column>
            <el-table-column align="center"
              label="发改委价">
              <template slot-scope="scope">
                ￥{{!scope.row.official_price?'0.00':scope.row.official_price}}
              </template>
            </el-table-column>
            <el-table-column align="center" width="70px"
              label="挂牌价">
              <template slot-scope="scope">
                ￥{{!scope.row.list_price?'0.00':scope.row.list_price}}
              </template>
            </el-table-column>
            <el-table-column align="center" width="65px"
              label="售价">
              <template slot-scope="scope">
                ￥{{!scope.row.sale_price?'0.00':scope.row.sale_price}}
              </template>
            </el-table-column>
            <el-table-column align="center" width="70px"
              label="协议价">
              <template slot-scope="scope">
                ￥{{!scope.row.contract_price?'0.00':scope.row.contract_price}}
              </template>
            </el-table-column>
            
            <el-table-column align="center"
              label="加油金额">
              <template slot-scope="scope">
                ￥{{!scope.row.total_amount?'0.00':scope.row.total_amount}}
              </template>
            </el-table-column>
            <el-table-column
            prop="liters" align="center" width="70px"
              label="加油量">
            </el-table-column>
            <el-table-column  align="center" width="70px"
              label="服务费">
              <template slot-scope="scope">
                ￥{{!scope.row.service_fee_amount?'0.00':scope.row.service_fee_amount}}
              </template>
            </el-table-column>
            <el-table-column  align="center"
              label="优惠金额">
              <template slot-scope="scope">
                ￥{{!scope.row.discount_amount?'0.00':scope.row.discount_amount}}
              </template>
            </el-table-column>
            <el-table-column  align="center" width="70px"
              label="实付款">
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
              label="状态">
              <template slot-scope="scope">
                {{ status[scope.row.status-1]}}
              </template>
            </el-table-column>
            <el-table-column align="center" width="95px"
            prop="payTime"
              label="付款时间">
            </el-table-column>
            <el-table-column align="center" width="110px"
              label="退款原因">
              <template slot-scope="scope">
                <div class="ellipsis">{{scope.row.refuntMsg}}</div>
              </template>
            </el-table-column>

          <el-table-column label="操作" width="200px" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleDetail(scope.$index, scope.row)">查看详情</el-button>
                <el-button v-if="scope.row.status == 10||scope.row.status == 9"
                  size="mini"
                  type="primary"
                  @click="handleRefund(scope.$index, scope.row)">标记退款</el-button>
                <el-button v-if="scope.row.status == 4"
                  size="mini"
                  type="primary"
                  @click="handleRefund(scope.$index, scope.row)">取消退款</el-button>
            </template>
          </el-table-column>
        </el-table>
    </div>

      <!-- 表格  end-->
      <div class="page">
          <Page :pageSize="pageSize" :cur="curPage" :total="total" @pageChange="changeCurPage"/>
       </div>

      <el-dialog
        :title="title"
        :visible.sync="dialogVisible1"
        width="40%"
        :before-close="handleClose">
        <orderDetail :detailData = "contentData2"></orderDetail>
        <el-form :model="refund" label-width="100px" class="demo-ruleForm">
          <el-form-item label="退款原因：" prop="reson">
            <el-input type="textarea" v-model="refund.reason"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible1 = false">取 消</el-button>
          <el-button type="primary" @click="cancelRefund(4)">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog
        :title="title"
        :visible.sync="dialogVisible2"
        width="400px"
        :before-close="handleClose">
        取消标记退款，订单状态还是已付款
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible2 = false">取 消</el-button>
          <el-button type="primary" @click="cancelRefund(10)">确 定</el-button>
        </span>
      </el-dialog>

  </div>

</template>

<script>
 import {Order} from '@/config/url'
 import {reservedDecimal} from '@/config/public'
import Page from '@/components/page'
import orderDetail from '@/components/orderDetail'
  export default{
    components:{
      Page,
      orderDetail
    },
    data(){
      return{
        scroll:0,
        status:['支付成功','支付中','支付失败','退款成功','退款中','退款失败','支付超时','下单成功','下单失败','申请退款'],
        status_v:'',
        orderNo:'',
        title:'标记退款',
        phone:'',
        source:'',
        stationName:'',
        dateRange:'',
        dialogVisible1: false,
        dialogVisible2: false,
        contentData: [],
        contentData2: {},
        curOrderNo:'',
        "pageSize":10,
        curPage:1,
        total:0,
        refund:{
          reason:''
        },
        tabH:0
      }

    },
    //路由守卫
    beforeRouteEnter:(to,from,next)=>{
        //从详情跳转
        if (from.path == '/orderDetail') {
           to.meta.keepAlive = true;
        }else{
          to.meta.keepAlive = false;
        }
        next()
    },
    mounted(){
      const _this = this;
      _this.phone = _this.$route.query.phone;
      _this.$nextTick(() => {
          _this.getTabH();
          setTimeout(function(){
            _this.$refs.tableList.bodyWrapper.scrollTop = parseFloat(sessionStorage.getItem('his_scroll'));
            sessionStorage.clear();
            _this.$route.meta.keepAlive = false
          },20)
      });
      window.onresize = () => {
         return (() => {
           _this.getTabH();
         })()
       }
      if(_this.$route.meta.keepAlive){
        _this.getSessionInfo()
      }else{
         _this.getListData(_this.curPage);
      }
    },
    methods:{
      getTabH(){
        const _this = this;
        let clientH = document.body.clientHeight || document.documentElement.clientHeight;
        let searchH = document.getElementById("searchBox").offsetHeight;
        let tabH = clientH - 60 - 20 - searchH -20 - 52 -40;
        _this.tabH = tabH;
      },
      search(){
        const _this = this;
        _this.curPage = 1;
        _this.getListData(_this.curPage);
      },
      resetForm(){
        this.phone = '';
        this.source = '';
        this.dateRange = '';
        this.orderNo = '';
        this.stationName = '';
        this.status_v = '';
      },
      changeCurPage(p){
        const _this = this;
        this.curPage = p;
        this.$refs.tableList.bodyWrapper.scrollTop = 0;
        _this.getListData(_this.curPage);
      },
      handleDetail(index, row) {
        // console.log(index, row);
        const _this = this;
        _this.saveInfo();
         _this.$router.push({name:'orderDetail',"query":{'orderNo':row.orderNo}})

      },
      handleRefund(index, row) {
        // console.log(index, row);
        const _this = this;
        if(row.status == 10||row.status == 9){ //退款
          _this.contentData.forEach(function(item,index){
            if(item.orderNo == row.orderNo){
              _this.contentData2 = item;
               _this.curOrderNo = row.orderNo
            }
          })
          this.title="标记退款"
          this.dialogVisible1 = true
        }else{
          _this.contentData.forEach(function(item,index){
            if(item.orderNo == row.orderNo){
               _this.curOrderNo = row.orderNo
            }
          })
          this.title="取消退款"
          this.dialogVisible2 = true
        }


      },
      cancelRefund(status){
        const _this = this;
        const token = localStorage.getItem('token');
        const formData = {
          orderNo:_this.curOrderNo,
          reason:_this.refund.reason,
          status:status,
        }
        _this.$axios.post(Order.cancelOrder, JSON.stringify(formData),{headers: {'Content-Type': 'application/json','token':token}})
          .then((res) => {
            // console.log(res)
            if (res.data.resultCode == 0) {
              // console.log(status)
              if(status == 4){
                 // _this.$message('标记退款成功');
                _this.dialogVisible1 = false;
                _this.refund.reason = '';
                _this.$alert('标记退款成功', '温馨温馨提示', {
                    confirmButtonText: '确定',
                     type: 'success',
                    callback: action => {
                    }
                  });
              }else{
                 // _this.$message('取消退款成功');
                _this.dialogVisible2 = false
                _this.$alert('取消退款成功', '温馨温馨提示', {
                    confirmButtonText: '确定',
                     type: 'success',
                    callback: action => {
                    }
                  });
              }

              _this.getListData(_this.curPage);
            }else if(res.data.resultCode == 3){
              localStorage.removeItem("token");
              localStorage.removeItem("userName");
              localStorage.removeItem("pwd1");
              _this.$router.push('/login');
            }else{
              // _this.$message(res.data.resultMsg);
              _this.$alert(res.data.resultMsg, '温馨温馨提示', {
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
      handleClose(done) {
        done();
      },
      getListData(pageNo) {
        const _this = this;
        const token = localStorage.getItem('token');
        const dateRange = _this.dateRange;
        let startTime = '';
        let endTime = '';
        if(dateRange.length>0){
          startTime = dateRange[0]
          endTime = dateRange[1]
        }
        const formData = {
          pageNo:pageNo,
          source:_this.source,
          orderNo:_this.orderNo,
          phone:_this.phone,
          station_name:_this.stationName,
          startTime:startTime,
          endTime:endTime,
          status:_this.status_v
        }
        _this.$axios.post(Order.orderList, JSON.stringify(formData),{headers: {'Content-Type': 'application/json','token':token}})
          .then((res) => {
            // console.log(res)
            if (res.data.resultCode == 0) {

              if(res.data.data.data){
                let obj = res.data.data.data;
                // obj.forEach(function(item,i){
                //   item.liters = reservedDecimal((item.total_amount/item.sale_price),4);//加油量
                //   item.discount_amount = reservedDecimal(item.liters*(item.list_price-item.sale_price),2);//优惠金额
                //   item.pay_amount = reservedDecimal((item.total_amount-item.discount_amount),2)//实付金额
                //   item.contract_amount = reservedDecimal(item.liters*item.contract_price,2);//协议金额
                // })
                _this.contentData = obj;
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
              _this.$alert(res.data.resultMsg, '温馨温馨提示', {
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
      exportTable(){
        const _this = this;
        const token = localStorage.getItem('token');
        const dateRange = _this.dateRange;
        let startTime = '';
        let endTime = '';
        if(dateRange.length>0){
          startTime = dateRange[0]
          endTime = dateRange[1]
        }
        const formData = {
          pageNo:_this.curPage,
          source:_this.source,
          orderNo:_this.orderNo,
          phone:_this.phone,
          statio_name:_this.stationName,
          startTime:startTime,
          endTime:endTime,
        }
        _this.$axios.post(Order.exportOrderList, JSON.stringify(formData),{headers: {'Content-Type': 'application/json','token':token}})
          .then((res) => {
            console.log(res.data.data)
            if (res.data.resultCode == 0) {
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
      saveInfo(){
        const _this = this;
        let scroll = this.$refs.tableList.bodyWrapper.scrollTop;
        const dateRange = _this.dateRange;
        let startTime = '';
        let endTime = '';
        if(dateRange.length>0){
          startTime = dateRange[0]
          endTime = dateRange[1]
        }
        let params = {
          source:_this.source,
          orderNo:_this.orderNo,
          phone:_this.phone,
          stationName:_this.stationName,
          startTime:startTime,
          endTime:endTime,
          status_v:_this.status_v
        }
        sessionStorage.setItem('his_scroll',scroll)
        sessionStorage.setItem('his_page',_this.curPage);
        sessionStorage.setItem('his_data',JSON.stringify(_this.contentData));
        sessionStorage.setItem('his_params',JSON.stringify(params));
        sessionStorage.setItem('his_total',_this.total);
        sessionStorage.setItem('his_pageSize',_this.pageSize);
      },
      getSessionInfo(){
        const _this = this;
        _this.curPage = parseInt(sessionStorage.getItem('his_page'));
        _this.total = parseInt(sessionStorage.getItem('his_total'));
        _this.pageSize = parseInt(sessionStorage.getItem('his_pageSize'));
        _this.contentData =JSON.parse(sessionStorage.getItem('his_data'));
        let params = JSON.parse(sessionStorage.getItem('his_params'));
        _this.source = params.source
        _this.orderNo = params.orderNo
        _this.stationName = params.stationName
        _this.phone = params.phone
        _this.status_v = params.status_v

        if(params.startTime == ''||params.endTime == ''){
          _this.dateRange = '';
        }else{
          let dateRange = [];
          dateRange[0] = params.startTime
          dateRange[1] = params.endTime
          _this.dateRange = dateRange;
        }
      },
    }
  }
</script>

<style scoped>
</style>
