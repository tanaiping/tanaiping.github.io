<template>
  <div class="content">
    <div class="flex">
        <el-input v-model="name" placeholder="请输入车牌号" class="filter-input mr10"></el-input>
        <el-select v-model="place" placeholder="请选择网点" class="mr10">
            <el-option label="南屏西苑" value="1"></el-option>
            <el-option label="市民中心" value="2"></el-option>
            <el-option label="江南中医院" value="3"></el-option>
        </el-select>
        <el-select v-model="status" placeholder="请选择支付状态" class="mr10">
            <el-option label="已支付" value="1"></el-option>
            <el-option label="待支付" value="2"></el-option>
        </el-select>
        <el-date-picker
              v-model="date1"
              type="daterange"
              range-separator="至"
              start-placeholder="办理开始日期"
              end-placeholder="办理结束日期" class="mr10">
            </el-date-picker>
        <el-button  icon="el-icon-refresh">重置</el-button>
        <el-button type="primary"  icon="el-icon-search">搜索</el-button>
    </div>
    <!-- 过虑条件  end-->
    <!-- 标题  end-->
    <div class="mt20">
      <el-table
          :data="contentData"
          stripe
          :row-key='getRowKey'
         type="selection"
         style="width: 100%">
         <el-table-column type="selection"  :reserve-selection="true" width="55"> </el-table-column>
          <el-table-column
          prop="id"
          label="序号">
          </el-table-column>
          <el-table-column
          prop="carNo"
            label="车牌号码">
          </el-table-column>
          <el-table-column
          prop="parkingName"
          label="停车网点">
          </el-table-column>
          <el-table-column
          prop="parkingLotId"
            label="泊位号">
            </el-table-column>
            <el-table-column
            prop="dateFrom"
            label="有效期起">
            </el-table-column>
            <el-table-column
            prop="dateTo"
              label="有效期止">
            </el-table-column>
            <el-table-column
            prop="amount"
              label="金额">
            </el-table-column>
            <el-table-column
            prop="payStatus"
            label="支付状态">
            </el-table-column>
            <el-table-column
            prop="payTime"
              label="支付时间">
            </el-table-column>
            <el-table-column
              prop="createTime"
                label="办理时间">
             </el-table-column>
            <el-table-column
              prop="phone"
                label="联系电话">
             </el-table-column>
          <el-table-column label="操作" width="100px">
            <template slot-scope="scope">
              -
              <!-- <el-button
                size="mini"
                type="danger"
                @click="handleEdit(scope.$index, scope.row)">复核</el-button> -->
            </template>
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
import {Charge} from '@/config/url'
import Page from '@/components/page'
  export default{
    components:{
      Page,
    },
    data(){
      return{
        name:'',
        status:'',
        type1:'',
        place:'',
        date1:'',
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
      getRowKey(row){
             return row.id;
        },
      getListData() {
        const _this = this
        const formData = {}
        _this.$axios.get(Charge.transfer, formData)
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
