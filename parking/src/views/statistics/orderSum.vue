<template>
  <div class="content">
    <div class="flex-search">

        <el-select v-model="value1" placeholder="请选择片区" class="mr10">
            <el-option label="老政务中心" value="1"></el-option>
            <el-option label="竹苑小区" value="2"></el-option>
            <el-option label="商业街" value="3"></el-option>
            <el-option label="南屏咯" value="4"></el-option>
        </el-select>
        <el-select v-model="value2" placeholder="请选择网点" class="mr10">
            <el-option label="县府路" value="1"></el-option>
            <el-option label="南屏西苑" value="2"></el-option>
        </el-select>
        <el-input v-model="name1" placeholder="请输入车牌号" class="filter-input mr10"></el-input>
        <el-radio v-model="radio" label="1">全部</el-radio>
        <el-radio v-model="radio" label="2">已缴</el-radio>
        <el-radio v-model="radio" label="3">欠缴</el-radio>
        <el-date-picker
              v-model="date1"
              type="datetimerange"
              range-separator="至"
              start-placeholder="停泊开始日期"
              end-placeholder="停泊结束日期" class="mr10">
         </el-date-picker>
        <el-button  icon="el-icon-refresh">重置</el-button>
        <el-button type="primary"  icon="el-icon-search">搜索</el-button>
        <el-button   icon="el-icon-download">导出</el-button>
    </div>
    <!-- 过虑条件  end-->
    <!-- 标题  end-->
    <div class="mt20">
      <el-table
          :data="contentData"
          stripe
          style="width: 100%">
          <el-table-column
          label="序号">
          <template slot-scope="scope">
            {{ scope.$index+1}}
          </template>
          </el-table-column>
          <el-table-column
          prop="carNo"
            label="车牌号码">
          </el-table-column>
            <el-table-column
            prop="rfid"
              label="RFID卡号">
            </el-table-column>
            <el-table-column
            prop="rfid"
            label="车辆联系人">
            </el-table-column>
            <el-table-column
                prop="spaceCount"
                  label="泊车次数">
            </el-table-column>
            <el-table-column
                prop="balanceAmount"
                  label="泊车计费金额">
            </el-table-column>
            <el-table-column
                prop="paidAmount"
                  label="已缴金额">
            </el-table-column>
            <el-table-column
                prop="totalAmount"
                  label="欠缴金额">
            </el-table-column>
            <el-table-column
                prop="balanceRate"
                  label="逃单率">
            </el-table-column>
        </el-table>
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
      Page
    },
    data(){
      return{
        name1:'',
        value1:'',
        value2:'',
        date1:'',
        radio:'1',
        dialogVisible1: false,
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
      getListData() {
        const _this = this
        const formData = {}
        _this.$axios.get(Statistics.orderSum, formData)
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
  .el-radio{
    line-height: 40px;
  }
</style>
