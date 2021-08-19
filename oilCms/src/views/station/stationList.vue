<template>
  <div class="content">
    <div class="flex-search" id="searchBox">
      <el-form ref="form" label-width="80px" @keyup.enter.native="search">
        <el-input v-model="stationId" placeholder="油站ID" class="filter-input mr10"></el-input>
        <el-input v-model="province" placeholder="请输入省份" class="filter-input mr10"></el-input>
        <!-- <el-input v-model="city" placeholder="请选择城市" class="filter-input mr10"></el-input> -->
        <el-select v-model="city" placeholder="请选择城市" class="mr10">
            <el-option
              v-for="(item,i) in options"
              :key="item.city"
              :label="item.city"
              :value="item.city">
            </el-option>
          </el-select>
        <el-input v-model="stationName" placeholder="请输入油站名称" class="filter-input mr10"></el-input>
        <el-button  icon="el-icon-refresh" @click="resetForm">重置</el-button>
        <el-button type="primary"  icon="el-icon-search" @click="search">查询</el-button>
      </el-form>
    </div>
    <!-- 标题  end-->
    <div class="mt20" :style="{'height':tabH+'px','overflow':'auto'}">
      <el-table
          :data="contentData"
          :height="tabH"
          stripe
          ref="tableList"
          style="width: 100%">
          <el-table-column align="center" width="50px"
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
          label="油站logo">
          <template slot-scope="scope">
            <img :src="scope.row.logo" alt="" class="table-logo">
          </template>
          </el-table-column>
          <el-table-column align="center"
          prop="stationId"
            label="油站ID">
          </el-table-column>
          <el-table-column align="center"
          prop="station_name"
            label="油站名称">
          </el-table-column>
          <el-table-column align="center"
          prop="type"
          label="油站类型">
          </el-table-column>
          <el-table-column align="center"
          prop="city"
            label="城市">
            </el-table-column>
            <el-table-column
            prop="address" align="center"
            label="油站地址">
            </el-table-column>
            <el-table-column
            prop="oilName" align="center"
              label="合作的油品">
            </el-table-column>
            <el-table-column align="center"
            prop="phone"
            label="油站电话">
            <template slot-scope="scope">
              {{!scope.row.phone?'-':scope.row.phone}}
            </template>
            </el-table-column>

          <el-table-column label="操作" width="100px" align="center">
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
    <div class="page page-box">
        <Page :pageSize="pageSize" :cur="curPage" :total="total" @pageChange="changeCurPage"/>
    </div>

  </div>

</template>

<script>
 import {Station,Statistics} from '@/config/url'
import Page from '@/components/page'
  export default{
    components:{
      Page,
    },
    data(){
      return{
        stationId:'',
        province:'',
        stationName:'',
        city:'',
        options:[],
        contentData: [],
        "pageSize":10,
        curPage:1,
        total:0,
        tabH:0,
      }

    },
    //路由守卫
    beforeRouteEnter:(to,from,next)=>{
        //从详情跳转
        if (from.path == '/stationDetail') {
           to.meta.keepAlive = true;
        }else{
          to.meta.keepAlive = false;
        }
        next()
    },
    mounted(){
      const _this = this;

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
       _this.getCityList();


    },
    methods:{
      getTabH(){
        const _this = this;
        let clientH = document.body.clientHeight || document.documentElement.clientHeight;
        let searchH = document.getElementById("searchBox").offsetHeight;
        let tabH = clientH - 60 - 20 - searchH -20 - 52;
        _this.tabH = tabH;
      },
      search(){
        const _this = this;
        _this.curPage = 1;
        _this.getListData(_this.curPage);
      },
      resetForm(){
        this.stationName = ''
        this.stationId = ''
        this.province = ''
        this.city = ''
      },
      changeCurPage(p){
         const _this = this;
        _this.curPage = p;
        this.$refs.tableList.bodyWrapper.scrollTop = 0;
        _this.getListData(_this.curPage);
      },
      handleDetail(index, row) {
        // console.log(index, row);
        const _this = this;
        _this.saveInfo();
        _this.$router.push({name:'stationDetail',"query":{'stationId':row.stationId}})
      },
      getListData(pageNo) {
        const _this = this;
        const token = localStorage.getItem('token');
        const formData = {
          stationId:_this.stationId,
          province:_this.province,
          city:_this.city=='全部'?'':_this.city,
          station_name:_this.stationName,
          pageNo:pageNo,
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
        let params = {
          stationId:_this.stationId,
          province:_this.province,
          city:_this.city,
          station_name:_this.stationName,
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
        _this.stationId = params.stationId
        _this.province = params.province
        _this.city = params.city
        _this.stationName = params.stationName
      },
      getCityList(){
        const _this = this;
        const token = localStorage.getItem('token');
        const formData = {}
        _this.$axios.post(Statistics.getCityList, JSON.stringify(formData),{headers: {'Content-Type': 'application/json','token':token}})
          .then((res) => {
            // console.log(res)
            if (res.data.resultCode == 0) {
              let list = res.data.data
              _this.options = [{'city':'全部'},...list];
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
    }
  }
</script>

<style scoped>
.table-logo{
  width: 40px;
  border-radius: 20px;
  height: 40px;
}
</style>
