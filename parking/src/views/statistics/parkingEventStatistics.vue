<template>
  <div class="content">
    <div class="flex">
        <el-date-picker
          v-model="value1"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期" class="mr10">
        </el-date-picker>
        <el-select v-model="value2" placeholder="请选择网点" class="mr10">
            <el-option label="市民中心" value="1"></el-option>
            <el-option label="县府路" value="2"></el-option>
            <el-option label="睡佛寺" value="3"></el-option>
        </el-select>
        <el-input v-model="name1" placeholder="请输入车牌号" class="filter-input mr10"></el-input>
        <el-input v-model="name2" placeholder="请输入泊位号" class="filter-input mr10"></el-input>
        <el-input v-model="name3" placeholder="请输入订单编号" class="filter-input mr10"></el-input>
        <el-input v-model="name4" placeholder="请输入操作员" class="filter-input mr10"></el-input>
        <el-button  icon="el-icon-refresh">重置</el-button>
        <el-button type="primary"  icon="el-icon-search">搜索</el-button>
    </div>
    <!-- 过虑条件  end-->
    <!-- 标题  end-->
    <div class="mt20">
      <el-table
          :data="contentData"
          stripe
          type="selection"
           :row-key='getRowKey'
          style="width: 100%">
          <el-table-column type="selection"  :reserve-selection="true" width="55"> </el-table-column>
          <el-table-column
          prop="id"
          label="编号">
          </el-table-column>
          <el-table-column
          prop="plate"
            label="车牌号码">
          </el-table-column>
          <el-table-column
          prop="rfid"
          label="RFID号">
          </el-table-column>
          <el-table-column
          prop="rfid"
            label="车辆类型">
            </el-table-column>
            <el-table-column
            prop="eventCode"
            label="事件编码">
            </el-table-column>
            <el-table-column
            prop="deviceCode"
              label="设备编号">
            </el-table-column>
            <el-table-column
            prop="parkingLotName"
              label="停车网点">
            </el-table-column>
            <el-table-column
            prop="parkingDoorName"
            label="出入口">
            </el-table-column>
            <el-table-column
            prop="parkingSpaceName"
              label="停车泊位">
            </el-table-column>
            <el-table-column
              prop="eventType"
                label="事件类型">
             </el-table-column>
            <el-table-column
              prop="eventTime"
                label="事件时间">
             </el-table-column>
             <el-table-column
               prop="createBy"
                 label="操作员">
              </el-table-column>
              <el-table-column
                prop="orderId"
                  label="图片">
               </el-table-column>
               <el-table-column
                 prop="orderNum"
                   label="订单编号">
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
        name2:'',
        name3:'',
        name4:'',
        value1:'',
        value2:'',
        contentData: [],
        "pageSize":10,
        curPage:1,
        total:0,
        ruleForm:{}
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
        this.ruleForm = {
          type1:'1',
          type2:'1',
          vin:'',
        }
        this.dialogVisible1 = true
      },
      handleClose(done) {
        done();
      },
      getRowKey(row){
             return row.id;
        },
      getListData() {
        const _this = this
        const formData = {}
        _this.$axios.get(Statistics.parkingEventStatistics, formData)
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
