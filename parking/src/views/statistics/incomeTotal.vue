<template>
  <div class="content">
    <div class="flex">
        <el-date-picker
              v-model="value1"
              type="month"
              placeholder="统计时间" class="mr10">
            </el-date-picker>
        <el-button  icon="el-icon-refresh">重置</el-button>
        <el-button type="primary"  icon="el-icon-search">搜索</el-button>
    </div>
    <div class="flex" style="padding: 20px 0;">
      <el-button type="warning" icon="el-icon-download">导出</el-button>
    </div>
    <!-- 过虑条件  end-->
    <!-- 标题  end-->
    <div class="mt20">
        <el-table
            :data="contentData"
            show-summary
            style="width: 100%">
            <el-table-column
              prop="lotName"
              label="停车网点"
              width="100">
            </el-table-column>
            <el-table-column
              prop="lotType"
              label="网点类型"
              width="100">
            </el-table-column>
            <el-table-column label="临停收入(元)">
              <el-table-column
                prop="tempReceivablesAmount"
                label="应收款"
                width="100">
              </el-table-column>
              <el-table-column
                prop="tempActualAmount"
                label="实收款"
                width="100">
              </el-table-column>
              <el-table-column
                prop="tempMissAmount"
                label="漏收款"
                width="100">
              </el-table-column>
              <el-table-column
                prop="tempFillAmount"
                label="补交款"
                width="100">
              </el-table-column>
              <el-table-column
                prop="tempRefundAmount"
                label="退款"
                width="100">
              </el-table-column>
              <el-table-column
                prop="tempFeeAmount"
                label="手续费"
                width="100">
              </el-table-column>
              <el-table-column
                prop="tempCouponAmount"
                label="优惠券"
                width="100">
              </el-table-column>
            </el-table-column>
            <el-table-column label="包月收入(元)">
              <el-table-column
                prop="receivablesAmount"
                label="应收金额"
                width="100">
              </el-table-column>
              <el-table-column label="当月总额收入">
                <el-table-column
                  prop="actualAmount"
                  label="当月实收"
                  width="100">
                </el-table-column>
                <el-table-column
                  prop="shareAmount"
                  label="往月结算"
                  width="100">
                </el-table-column>
              </el-table-column>
              <el-table-column
                prop="miss"
                label="漏收"
                width="100">
              </el-table-column>
              <el-table-column
                prop="supply"
                label="补缴"
                width="120">
              </el-table-column>
              <el-table-column
                prop="advanceAmount"
                label="预收金额"
                width="100">
              </el-table-column>
              <el-table-column
                prop="advanceBalance"
                label="预收池"
                width="100">
              </el-table-column>
              <el-table-column
                prop="feeAmount"
                label="手续费"
                width="100">
              </el-table-column>
              <el-table-column
                prop="refundAmount"
                label="退款"
                width="100">
              </el-table-column>
            </el-table-column>
          </el-table>
    </div>

  </div>

</template>

<script>
  import {Statistics} from '@/config/url'
  export default{
    data(){
      return{
        value1:'',
        contentData: [],
        "pageSize":10,
          curPage:1,
          total:0,
      }

    },
    mounted(){
      this.getListData();
    },
    methods:{
      changeCurPage(p){
        this.curPage = p;
        console.log(this.curPage);
      },
      handleShow(index, row) {
        console.log(index, row);
        this.dialogVisible = true
      },
      handleEdit(index, row) {
        console.log(index, row);
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
        add(){
           this.ruleForm = {};
          this.dialogVisible1 = true
        },
        getListData() {
          const _this = this
          const formData = {}
          _this.$axios.get(Statistics.incomeTotal, formData)
            .then((res) => {
              console.log(res)
              if (res.data.code == 200) {
                this.total = res.data.total;
                console.log(res.data.data);
                this.contentData = res.data.data;
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
  .page-title{
    display: flex;
    justify-content: space-between;
    padding: 20px;
    height: 40px;
    line-height: 40px;
    background-color: #c1c4c7;
  }
  .page{
    display: flex;
    justify-content: flex-end;
    padding: 10px;
  }
</style>
