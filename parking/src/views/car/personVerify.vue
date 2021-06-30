<template>
  <div class="content">
    <div class="flex">
        <el-input v-model="name" placeholder="请输入车牌号" class="filter-input mr10"></el-input>
        <el-input v-model="name2" placeholder="请输入车辆vin码" class="filter-input mr10"></el-input>
        <el-select v-model="value1" placeholder="请选择是否审核通过" class="mr10">
            <el-option label="待审核" value="1"></el-option>
            <el-option label="已通过" value="2"></el-option>
            <el-option label="未通过" value="2"></el-option>
        </el-select>
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
          label="ID">
          </el-table-column>
          <el-table-column
          prop="carNo"
            label="车牌号">
          </el-table-column>
          <el-table-column
          prop="vin"
          label="车辆VIN码">
          </el-table-column>
          <el-table-column
          prop="engine"
            label="发动机号码">
            </el-table-column>
            <el-table-column
            prop="createBy"
            label="行码证图片">
            </el-table-column>
            <el-table-column
            prop="phone"
              label="用户手机号">
            </el-table-column>
            <el-table-column
            prop="status"
            label="审核是否通过">
            </el-table-column>
            <el-table-column
            prop="name"
              label="装卡联系人">
            </el-table-column>
            <el-table-column
            prop="phone"
            label="装卡人手机号">
            </el-table-column>
            <el-table-column
            prop="reason"
              label="装卡人地址">
            </el-table-column>
            <el-table-column
              prop="isCheck"
                label="装卡审核">
             </el-table-column>
            <el-table-column
                prop="isCheck"
                  label="是否装卡">
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
 import {Car} from '@/config/url'
import Page from '@/components/page'
  export default{
    components:{
      Page,
    },
    data(){
      return{
        name:'',
        name2:'',
        value1:'1',
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
        _this.$axios.get(Car.audit1, formData)
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
