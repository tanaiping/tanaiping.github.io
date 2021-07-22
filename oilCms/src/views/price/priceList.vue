<template>
  <div class="content">
      <div class="flex-search" id="searchBox">
        <el-form ref="form" label-width="80px"  @keyup.enter.native="search">
          <el-select v-model="type" placeholder="请选择油站类型" class="mr10">
            <el-option label="全部" value='-1'></el-option>
            <el-option label="中石油" value='1'></el-option>
            <el-option label="中石化" value='2'></el-option>
            <el-option label="中海油" value='3'></el-option>
            <el-option label="壳牌" value='4'></el-option>
            <el-option label="道达尔" value='5'></el-option>
            <el-option label="BP" value='6'></el-option>
            <el-option label="其他" value='100'></el-option>
            <el-option label="未知" value='0'></el-option>
          </el-select>
          <el-input v-model="province" placeholder="请输入省份" class="filter-input mr10"></el-input>
          <el-input v-model="city" placeholder="城市" class="filter-input mr10"></el-input>
          <el-input v-model="stationName" placeholder="请输入油站名称" class="filter-input mr10"></el-input>
          <el-input v-model="address" placeholder="请输入油站地址" class="filter-input mr10"></el-input>
          <el-button  icon="el-icon-refresh" @click="resetForm">重置</el-button>
          <el-button type="primary"  icon="el-icon-search" @click="search">查询</el-button>
        </el-form>
      </div>

      <!-- 过虑条件  end-->
      <!-- 标题  end-->
      <div class="mt20">
        <div class="flex-end"><el-button type="success" @click="changeChecked">批量改价</el-button></div>
        <div :style="{'height':tabH+'px','overflow':'auto'}">
          <el-table
              :data="contentData"
              :height="tabH"
              stripe
              type="selection"
              @selection-change="selectionLineChangeHandle"
              @row-click="handleRowClick"
              ref="handSelectTest_multipleTable"
              :row-key='getRowKey'
              style="width: 100%">
              <el-table-column type="selection" align="center" :reserve-selection="true" width="50"> </el-table-column>
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
              prop="type"
              label="油站类型">
              </el-table-column>
              <el-table-column align="center"
              prop="province"
              label="省份">
              </el-table-column>
              <el-table-column align="center"
              prop="city"
              label="城市">
              </el-table-column>
              <el-table-column align="center"
              prop="station_name"
              label="油站名称">
              </el-table-column>
              <el-table-column
              prop="address" align="center"
              label="油站地址">
              </el-table-column>
              <el-table-column align="center"
              label="油号">
              <template slot-scope="scope">
                 <div v-for="(item,index) in scope.row.oilInfoList" :key="item.id">{{item.oil_no}}#</div>
              </template>
              </el-table-column>
              <el-table-column align="center"
              label="发改委价">
              <template slot-scope="scope">
                 <div v-for="(item,index) in scope.row.oilInfoList" :key="item.id">￥{{item.official_price==''?'--':item.official_price}}</div>
              </template>
              </el-table-column>
              <el-table-column align="center"
              label="挂牌价">
              <template slot-scope="scope">
                 <div v-for="(item,index) in scope.row.oilInfoList" :key="item.id">￥{{item.list_price==''?'--':item.list_price}}</div>
              </template>
              </el-table-column>
              <el-table-column align="center"
              label="协议价">
              <template slot-scope="scope">
                 <div v-for="(item,index) in scope.row.oilInfoList" :key="item.id">￥{{item.contract_price==''?'--':item.contract_price}}</div>
              </template>
              </el-table-column>
              <el-table-column align="center"
              label="售价">
              <template slot-scope="scope">
                 <div v-for="(item,index) in scope.row.oilInfoList" :key="item.id">￥{{item.sale_price==''?'--':item.sale_price}}</div>
              </template>
              </el-table-column>
              <el-table-column label="操作" width="100px" align="center">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    @click.stop="handlechange(scope.$index, scope.row)" >修改单价</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
      </div>

        <!-- 表格  end-->
        <div class="page">
            <Page :pageSize="pageSize" :cur="curPage" :total="total" @pageChange="changeCurPage"/>
         </div>

  </div>

</template>

<script>
import {Price} from '@/config/url'
import Page from '@/components/page'
  export default{
    components:{
      Page,
    },
    data(){
      return{
        type:'',
        province:'',
        city:'',
        stationName:'',
        address:'',
        contentData: [],
        "pageSize":10,
        curPage:1,
        total:0,
        stationIdList:[],
        tabH:0
      }

    },
    mounted(){
      const _this = this;
      _this.$nextTick(() => {
          _this.getTabH();
      });
      window.onresize = () => {
         return (() => {
           _this.getTabH();
         })()
       }
      _this.getListData(_this.curPage);
    },
    methods:{
      getTabH(){
        const _this = this;
        let clientH = document.body.clientHeight || document.documentElement.clientHeight;
        let searchH = document.getElementById("searchBox").offsetHeight;
        let tabH = clientH - 60 - 20 - searchH -20 - 40 - 52;
        _this.tabH = tabH;
      },
      search(){
        const _this = this;
        _this.curPage = 1;
        _this.getListData(_this.curPage);
      },
      resetForm(){
        this.type = '';
        this.province = '';
        this.city = '';
        this.stationName = '';
        this.address = '';
      },
      changeCurPage(p){
         const _this = this;
        _this.curPage = p;
        // console.log(_this.curPage);
         _this.getListData(_this.curPage);
      },
      handlechange(index, row) {
        this.$router.push({name:'changePriceSingle',"query":{'stationId':row.stationId}})
      },
      selectionLineChangeHandle (val) {
             this.stationIdList = val
             console.log(this.stationIdList)
      },
      handleRowClick(row, column, event) {
          this.$refs.handSelectTest_multipleTable.toggleRowSelection(row);
      },
      getRowKey(row){
             return row.id;
        },
      getListData(pageNo) {
        const _this = this;
        const token = localStorage.getItem('token');
        const formData = {
          type:_this.type==-1?'':_this.type,
          address:_this.address,
          station_name:_this.stationName,
          pageNo:pageNo,
          city:_this.city,
          province:_this.province
        }
        console.log(formData)
        _this.$axios.post(Price.list, JSON.stringify(formData),{headers: {'Content-Type': 'application/json','token':token}})
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
      changeChecked(){//批量改价
        const _this = this;
        let stationStr = [];
        this.stationIdList.forEach(function(item,index){
            stationStr.push({stationId:item.stationId,"station_name":item.station_name})
        })
         stationStr = JSON.stringify(stationStr);
        _this.$router.push({name:'changePriceMul',"params":{'stationObj':stationStr}})
      },

    }
  }
</script>

<style scoped>
</style>
