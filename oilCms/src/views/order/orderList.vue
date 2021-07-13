<template>
  <div class="content">
    <div class="flex">
      <el-form ref="form" label-width="80px" @keyup.enter.native="search">
        <el-input v-model="orderNo" placeholder="请输入订单号" class="filter-input mr10"></el-input>
        <el-input v-model="stationName" placeholder="请输入油站名称" class="filter-input mr10"></el-input>
        <el-input v-model="source" placeholder="请输入渠道名称" class="filter-input mr10"></el-input>
        <el-input v-model="phone" placeholder="请输入手机号" class="filter-input mr10"></el-input>
        <el-date-picker
              v-model="createTime"
              type="datetime"
              placeholder="付款时间" class="mr10">
            </el-date-picker>
        <el-button  icon="el-icon-refresh" @click="resetForm">重置</el-button>
        <el-button type="primary"  icon="el-icon-search" @click="search">查询</el-button>
        <el-button type="warning" icon="el-icon-download" @click="exportTable">导出表格</el-button>
      </el-form>
    </div>
    <!-- <div class="flex" style="padding: 20px 0;">
      <el-button  type="primary" icon="el-icon-plus" @click="add">新增</el-button>
      <el-button type="success" icon="el-icon-edit" disabled>修改</el-button>
      <el-button   icon="el-icon-delete" disabled>删除</el-button>
      <el-button type="info" icon="el-icon-upload2" disabled>导入</el-button>
      <el-button type="warning" icon="el-icon-download" disabled>导出</el-button>
    </div> -->
    <!-- 过虑条件  end-->
    <!-- 标题  end-->
    <div class="mt20">
      <el-table
          :data="contentData"
          stripe
          style="width: 100%">
          <el-table-column
          label="编号">
          <template slot-scope="scope">
            {{ (scope.$index+1)+(curPage-1)*pageSize}}
          </template>
          </el-table-column>
          <el-table-column
          prop="source"
            label="渠道名称">
          </el-table-column>
          <el-table-column
          prop="order_code"
          width="100px"
          label="渠道订单号">
          </el-table-column>
          <el-table-column
          prop="orderNo"
            label="订单号">
            </el-table-column>
            <el-table-column
            prop="station_name"
            label="油站名称">
            </el-table-column>
            <el-table-column
            prop="phone"
              label="手机号">
            </el-table-column>
            <el-table-column
            prop="oil_no"
              label="油号">
            </el-table-column>
            <el-table-column
            prop="gun_no"
              label="油枪">
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
            <el-table-column
            prop="sale_price"
              label="售价">
            </el-table-column>
            <el-table-column
            prop="total_amount"
              label="加油金额">
            </el-table-column>
            <el-table-column
            prop="liters"
              label="加油量">
            </el-table-column>
            <el-table-column
            prop="service_fee_amount"
              label="服务费">
            </el-table-column>
            <el-table-column
            prop="discount_amount"
              label="优惠金额">
            </el-table-column>
            <el-table-column
            prop="pay_amount"
              label="实付款">
            </el-table-column>
            <el-table-column
            prop="contract_amount"
              label="协议金额">
            </el-table-column>
            <el-table-column
              label="状态">
              <template slot-scope="scope">
                {{ status[scope.row.status-1]}}
              </template>
            </el-table-column>
            <el-table-column
            prop="payTime"
              label="付款时间">
            </el-table-column>
            <el-table-column
            prop="refuntMsg"
              label="退款原因">
            </el-table-column>

          <el-table-column label="操作" width="200px">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleDetail(scope.$index, scope.row)">查看详情</el-button>
                <el-button v-if="scope.row.status == 1"
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
          <el-form-item label="退款原因" prop="reson">
            <el-input type="textarea" v-model="refund.reson"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible1 = false">取 消</el-button>
          <el-button type="primary" @click="cancelRefund(1)">确 定</el-button>
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
          <el-button type="primary" @click="cancelRefund(4)">确 定</el-button>
        </span>
      </el-dialog>

  </div>

</template>

<script>
 import {Order} from '@/config/url'
import Page from '@/components/page'
import orderDetail from '@/components/orderDetail'
  export default{
    components:{
      Page,
      orderDetail
    },
    data(){
      return{
        status:['支付成功','支付中','支付失败','退款成功','退款中','退款失败'],
        orderNo:'',
        title:'标记退款',
        phone:'',
        source:'',
        stationName:'',
        createTime:'',
        dialogVisible1: false,
        dialogVisible2: false,
        contentData: [],
        contentData2: {},
        "pageSize":10,
        curPage:1,
        total:0,
        refund:{
          reason:''
        },
      }

    },
    mounted(){
      const _this = this;
      this.getListData(_this.curPage);
    },
    methods:{
      search(){
        const _this = this;
        _this.getListData(_this.curPage);
      },
      resetForm(){
        this.phone = '';
        this.source = '';
        this.createTime = '';
        this.orderNo = '';
        this.statioName = '';
      },
      changeCurPage(p){
        const _this = this;
        this.curPage = p;
        // console.log(this.curPage);
        _this.getListData(_this.curPage);
      },
      handleDetail(index, row) {
        // console.log(index, row);
        const _this = this;
         _this.$router.push({name:'orderDetail',"params":{'orderNo':row.orderNo}})

      },
      handleRefund(index, row) {
        // console.log(index, row);
        const _this = this;
        if(row.status == 1){ //退款
          _this.contentData.forEach(function(item,index){
            if(item.orderId == row.orderId){
              _this.contentData2 = item;
            }
          })
          this.title="标记退款"
          this.dialogVisible1 = true
        }else{

          this.title="取消退款"
          this.dialogVisible2 = true
        }

      },
      cancelRefund(status){
        const _this = this;
        const token = localStorage.getItem('token');
        const formData = {
          orderNo:_this.orderNo,
          reason:_this.refund.reason,
          status:status,
        }
        _this.$axios.post(Order.cancelOrder, JSON.stringify(formData),{headers: {'Content-Type': 'application/json','token':token}})
          .then((res) => {
            console.log(res)
            if (res.data.resultCode == 0) {
              if(status == 1){
                _this.dialogVisible1 = false
              }else{
                _this.dialogVisible2 = false
              }

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
        done();
      },
      getListData(pageNo) {
        const _this = this;
        const token = localStorage.getItem('token');
        const formData = {
          pageNo:pageNo,
          source:_this.source,
          orderNo:_this.orderNo,
          phone:_this.phone,
          statio_name:_this.stationName,
          createTime:_this.createTime,
        }
        _this.$axios.post(Order.orderList, JSON.stringify(formData),{headers: {'Content-Type': 'application/json','token':token}})
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
              _this.$message(res.data.resultMsg);
            }
          })
          .catch((error) => {
            window.console.log(error);
          })
      },
      exportTable(){
        const _this = this;
        const token = localStorage.getItem('token');
        const formData = {
          pageNo:_this.curPage,
          source:_this.source,
          orderNo:_this.orderNo,
          phone:_this.phone,
          statio_name:_this.stationName,
          createTime:_this.createTime,
        }
        _this.$axios.post(Order.exportOrderList, JSON.stringify(formData),{headers: {'Content-Type': 'application/json','token':token}})
          .then((res) => {
            // console.log(res)
            if (res.data.resultCode == 0) {
              window.open(res.data.data)
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
    }
  }
</script>

<style scoped>
</style>
