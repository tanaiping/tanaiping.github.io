<template>
  <div class="content">
      <div class="flex-search" id="searchBox">
        <el-form ref="form" label-width="80px"  @keyup.enter.native="search">
          <el-input v-model="stationName" placeholder="请输入油站名称" class="filter-input mr10"></el-input>
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
          <!-- <el-input v-model="city" placeholder="请选择城市" class="filter-input mr10"></el-input> -->
          <el-select v-model="city" placeholder="请选择城市" class="mr10">
              <el-option
                v-for="(item,i) in options"
                :key="item.city"
                :label="item.city"
                :value="item.city">
              </el-option>
            </el-select>
          <!-- <el-input v-model="address" placeholder="请输入油站地址" class="filter-input mr10"></el-input> -->
          <el-button  icon="el-icon-refresh" @click="resetForm">重置</el-button>
          <el-button type="primary"  icon="el-icon-search" @click="search">查询</el-button>
        </el-form>
      </div>

      <!-- 过虑条件  end-->
      <!-- 标题  end-->
      <div class="mt20">
        <div class="flex-end">
          <el-button type="primary" @click="changeChecked">批量改价</el-button>
          <el-tooltip class="item" effect="dark" placement="bottom">
            <el-button type="text">名词释义<i class="el-icon-question"></i></el-button>
            <div slot="content">
              <ul class="tipslist">
              	<li v-for="(item,i) in tips"  :key="i">
                  <div class="t1">{{item.title}}</div>
                  <div class="t2">{{item.name}}</div>
                </li>
              </ul>
            </div>
          </el-tooltip>
        </div>
        <div :style="{'height':tabH+'px','overflow':'auto'}">
          <el-table
              :data="contentData"
              :height="tabH"
              stripe
              type="selection"
              @selection-change="selectionLineChangeHandle"
              @row-click="handleRowClick"
              ref="tableList"
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
              prop="station_name"
              label="油站名称">
              </el-table-column>
              <el-table-column
              prop="address" align="center"
              label="油站地址">
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
              label="油号">
              <template slot-scope="scope">
                 <div v-for="(item,index) in scope.row.oilInfoList" :key="item.id">{{item.oil_no}}#</div>
              </template>
              </el-table-column>
              <el-table-column align="center"
              label="发改委价">
              <template slot-scope="scope">
                 <div v-for="(item,index) in scope.row.oilInfoList" :key="item.id">￥{{!item.official_price?'0.00':item.official_price}}</div>
              </template>
              </el-table-column>
              <el-table-column align="center"
              label="挂牌价">
              <template slot-scope="scope">
                 <div v-for="(item,index) in scope.row.oilInfoList" :key="item.id">￥{{!item.list_price?'0.00':item.list_price}}</div>
              </template>
              </el-table-column>
              <el-table-column align="center"
              label="协议价">
              <template slot-scope="scope">
                 <div v-for="(item,index) in scope.row.oilInfoList" :key="item.id">￥{{!item.contract_price?'0.00':item.contract_price}}</div>
              </template>
              </el-table-column>
              <el-table-column align="center"
              label="售价">
              <template slot-scope="scope">
                 <div v-for="(item,index) in scope.row.oilInfoList" :key="item.id">￥{{!item.sale_price?'0.00':item.sale_price}}</div>
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
import {Price,Statistics} from '@/config/url'
import Page from '@/components/page'
  export default{
    components:{
      Page,
    },
    data(){
      return{
        tips:[
          {
            title:'①发改委价',
            name:'俗称：指导价，国家制定的指导价格'
          },
          {
            title:'②挂牌价',
            name:'又称：油站价，油站的实际销售价格'
          },
          {
            title:'③协议价',
            name:'又称：结算价，喂车给我们的成本结算价'
          },
          {
            title:'④售价',
            name:'又称：智行价，微智行对外的销售价格'
          },
        ],
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
        tabH:0,
        options:[]
      }

    },
    //路由守卫
    beforeRouteEnter:(to,from,next)=>{
        //从详情跳转
        if (from.path == '/changePriceSingle'||from.path =='/changePriceMul') {
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
         this.$refs.tableList.bodyWrapper.scrollTop = 0;
        _this.curPage = p;
        // console.log(_this.curPage);
         _this.getListData(_this.curPage);
      },
      handlechange(index, row) {
        this.saveInfo()
        this.$router.push({name:'changePriceSingle',"query":{'stationId':row.stationId}})
      },
      selectionLineChangeHandle (val) {
             this.stationIdList = val
             // console.log(this.stationIdList)
      },
      handleRowClick(row, column, event) {
          this.$refs.tableList.toggleRowSelection(row);
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
          city:_this.city=='全部'?'':_this.city,
          province:_this.province
        }
        // console.log(formData)
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
        _this.saveInfo()

         stationStr = JSON.stringify(stationStr);
        _this.$router.push({name:'changePriceMul',"params":{'stationObj':stationStr}})
      },
      saveInfo(){
        const _this = this;
        let scroll = this.$refs.tableList.bodyWrapper.scrollTop;
        let params = {
          type:_this.type,
          address:_this.address,
          stationName:_this.stationName,
          city:_this.city,
          province:_this.province
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
        _this.type = params.type
        _this.address = params.address
        _this.stationName = params.stationName
        _this.city = params.city
        _this.province = params.province
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
  .tipslist{
    list-style: none;
    padding: 0;
    margin: 0;
    padding: 20px 20px 0 20px;
  }
  .tipslist li{
    margin-bottom: 20px;
  }
   .tipslist li .t1{
     color: #FFF;
     font-size: 14px;
   }
   .tipslist li .t2{
     color: #999;
     font-size: 12px;
     line-height: 22px;
   }
</style>
