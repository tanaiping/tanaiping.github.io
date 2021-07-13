<template>
  <div class="content">
    <div class="flex">
      <el-form ref="form" label-width="80px" @keyup.enter.native="search">
        <el-input v-model="statioName" placeholder="请输入油站名称" class="filter-input mr10"></el-input>
        <el-input v-model="address" placeholder="请输入油站地址" class="filter-input mr10"></el-input>
        <el-input v-model="phone" placeholder="请输入油站电话" class="filter-input mr10"></el-input>
        <el-button  icon="el-icon-refresh" @click="resetForm">重置</el-button>
        <el-button type="primary"  icon="el-icon-search" @click="search">查询</el-button>
      </el-form>
    </div>
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
          prop="type"
          label="油站类型">
          </el-table-column>
          <el-table-column
          prop="city"
            label="城市">
            </el-table-column>
            <el-table-column
            label="油站logo">
            <template slot-scope="scope">
              <img :src="scope.row.logo" alt="" class="table-logo">
            </template>
            </el-table-column>
            <el-table-column
            prop="station_name"
              label="油站名称">
            </el-table-column>
            <el-table-column
            prop="address"
            label="油站地址">
            </el-table-column>
            <el-table-column
            prop="oilName"
              label="合作的油品">
            </el-table-column>
            <el-table-column
            prop="phone"
            label="油站电话">
            </el-table-column>

          <el-table-column label="操作" width="100px">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="handleDetail(scope.$index, scope.row)">查看详情</el-button>
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
 import {Station} from '@/config/url'
import Page from '@/components/page'
  export default{
    components:{
      Page,
    },
    data(){
      return{
        statioName:'',
        phone:'',
        address:'',
        contentData: [],
        "pageSize":10,
        curPage:1,
        total:0,
      }

    },
    mounted(){
      const _this = this;
      _this.getListData(_this.curPage);
    },
    methods:{
      search(){
        const _this = this;
        _this.getListData(_this.curPage);
      },
      resetForm(){
        this.phone = ''
        this.address = ''
        this.statioName = ''
      },
      changeCurPage(p){
         const _this = this;
        _this.curPage = p;
        // console.log(_this.curPage);
        _this.getListData(_this.curPage);
      },
      handleDetail(index, row) {
        // console.log(index, row);
        const _this = this;
        _this.$router.push({name:'stationDetail',"params":{'stationId':row.stationId}})
      },
      getListData(pageNo) {
        const _this = this;
        const token = localStorage.getItem('token');
        const formData = {
          phone:_this.phone,
          address:_this.address,
          station_name:_this.statioName,
          pageNo:pageNo
        }
        _this.$axios.post(Station.stationList, JSON.stringify(formData),{headers: {'Content-Type': 'application/json','token':token}})
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
    }
  }
</script>

<style scoped>
.table-logo{
  width: 40px;
}
</style>
