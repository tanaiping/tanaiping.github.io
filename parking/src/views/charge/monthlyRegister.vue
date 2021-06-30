<template>
  <div class="content">
    <div class="flex-search">
        <el-input v-model="name" placeholder="请输入车牌号" class="filter-input mr10"></el-input>
        <el-select v-model="place" placeholder="请选择网点" class="mr10">
            <el-option label="南屏西苑" value="1"></el-option>
            <el-option label="市民中心" value="2"></el-option>
            <el-option label="江南中医院" value="3"></el-option>
        </el-select>
        <el-select v-model="type" placeholder="请选择支付方式" class="mr10">
            <el-option label="现金" value="1"></el-option>
            <el-option label="微信" value="2"></el-option>
            <el-option label="支付宝" value="3"></el-option>
            <el-option label="优惠券" value="4"></el-option>
            <el-option label="转账" value="5"></el-option>
        </el-select>
        <el-select v-model="status" placeholder="请选择支付状态" class="mr10">
            <el-option label="已支付" value="1"></el-option>
            <el-option label="待支付" value="2"></el-option>
        </el-select>
        <el-select v-model="type1" placeholder="请选择业务类型" class="mr10">
            <el-option label="包月登录" value="1"></el-option>
            <el-option label="包月续费" value="2"></el-option>
            <el-option label="包月共享" value="3"></el-option>
            <el-option label="终止包月" value="4"></el-option>
        </el-select>
         <el-input v-model="num" placeholder="请输入业务流水号" class="filter-input mr10"></el-input>
         <el-select v-model="type2" placeholder="请选择办理渠道" class="mr10">
             <el-option label="大厅办理" value="1"></el-option>
             <el-option label="自助办理" value="2"></el-option>
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
          label="序号">
          </el-table-column>
          <el-table-column
          prop="code"
            label="业务流水号">
          </el-table-column>
          <el-table-column
          prop="businessTypeNum"
          label="业务类型">
          </el-table-column>
          <el-table-column
          prop="carNo"
            label="车牌号码">
            </el-table-column>
            <el-table-column
            prop="parkingName"
            label="网点">
            </el-table-column>
            <el-table-column
            prop="spaceCode"
              label="泊位">
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
            prop="delFlag"
              label="状态">
            </el-table-column>
            <el-table-column
              prop="person"
                label="办理人员">
             </el-table-column>
            <el-table-column
                prop="createTime"
                  label="办理日期">
            </el-table-column>
            <el-table-column
                prop="channel"
                  label="办理渠道">
            </el-table-column>
            <el-table-column
                prop="remark"
                  label="备注">
            </el-table-column>
          <el-table-column label="操作" width="100px">
            <template slot-scope="scope">
              -
              <!-- <el-button
                size="mini"
                type="danger"
                @click="handleEdit(scope.$index, scope.row)">修改</el-button> -->
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
        type:'',
        type1:'',
        type2:'',
        num:'',
        place:'',
        status:'',
        no:'',
        date1:'',
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
        _this.$axios.get(Charge.monthlyRegister, formData)
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
