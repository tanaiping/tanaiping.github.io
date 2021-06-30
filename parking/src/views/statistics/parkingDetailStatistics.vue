<template>
  <div class="content">
    <div class="flex">
      <el-select v-model="place2" placeholder="请选择网点" class="mr10">
          <el-option label="市民中心" value="1"></el-option>
          <el-option label="县府路" value="2"></el-option>
          <el-option label="睡佛寺" value="3"></el-option>
      </el-select>
        <el-select v-model="place1" placeholder="请选择片区" class="mr10">
            <el-option label="南屏路北段(老政务中心)" value="1"></el-option>
            <el-option label="南屏路北段(南屏路)" value="2"></el-option>
            <el-option label="南屏路北段(竹苑小区)" value="3"></el-option>
        </el-select>
        <el-input v-model="name1" placeholder="请输入车牌号" class="filter-input mr10"></el-input>
        <el-select v-model="status" placeholder="请选择支付状态" class="mr10">
            <el-option label="已支付" value="1"></el-option>
            <el-option label="待支付" value="2"></el-option>
        </el-select>
         <el-date-picker
               v-model="date1"
               type="daterange"
               range-separator="至"
               start-placeholder="开始日期"
               end-placeholder="结束日期" class="mr10">
             </el-date-picker>
        <el-button  icon="el-icon-refresh">重置</el-button>
        <el-button type="primary"  icon="el-icon-search">搜索</el-button>
        <el-button type="warning" icon="el-icon-download" disabled>导出</el-button>
    </div>
    <!-- 过虑条件  end-->
    <!-- 标题  end-->
    <div class="mt20">
      <el-table
          :data="contentData"
          stripe
          style="width: 100%">
          <el-table-column
          prop="id"
          label="编号">
          </el-table-column>
          <el-table-column
          prop="driveInTime"
            label="入场时间">
          </el-table-column>
          <el-table-column
          prop="driveOutTime"
            label="离场时间">
          </el-table-column>
          <el-table-column
          prop="parkingLotName"
          label="停车网点">
          </el-table-column>
          <el-table-column
              prop="parkingSpace"
                label="停车泊位">
          </el-table-column>
          <el-table-column
              prop="couponPayAmout"
                label="停车费额">
          </el-table-column>
          <el-table-column
              prop="payAmout"
                label="已付金额">
          </el-table-column>
          <el-table-column
              prop="plate"
                label="车牌号码">
          </el-table-column>
          <el-table-column
              prop="parkType"
                label="停车类型">
          </el-table-column>
          <el-table-column
              prop="rfid"
                label="RFID编号">
          </el-table-column>
          <el-table-column
              prop="remark"
                label="备注">
          </el-table-column>
          <el-table-column label="操作" width="100px">
            -
            <!-- <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)" >二维码</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">修改</el-button>
            </template> -->
          </el-table-column>
        </el-table>
    </div>

      <!-- 表格  end-->
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
        name1:'',
        place1:'',
        place2:'',
        date1:'',
        status:'',
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
        _this.dialogVisible1 = true
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
        _this.$axios.get(Statistics.parkingDetailStatistics, formData)
          .then((res) => {
            console.log(res)
            if (res.data.code == 200) {
              this.total = res.data.total;
              console.log(res.data.rows);
              this.contentData = res.data.rows;
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
