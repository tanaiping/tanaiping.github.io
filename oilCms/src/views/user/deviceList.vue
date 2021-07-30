<template>
  <div class="content">
    <div class="flex-search" id="searchBox">
      <el-form ref="form"  label-width="80px" @keyup.enter.native="search">
        <label class="mr10 lab-t">昨日新增({{yesCnt}})</label>
        <label class="mr10 lab-t">累计设备({{deviceCnt}})</label>
        <label class="mr10 lab-t">今日在线设备({{todatyCnt}})</label>
        <el-input v-model="deviceSN" placeholder="请输入设备标识符" class="filter-input mr10"></el-input>
        <el-date-picker
              v-model="dateRange"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期" class="mr10">
            </el-date-picker>
        <el-button  icon="el-icon-refresh" @click="resetForm">重置</el-button>
        <el-button type="primary"  icon="el-icon-search" @click="search">搜索</el-button>
      </el-form>
    </div>
    <!-- 过虑条件  end-->
    <div class="mt20" :style="{'height':tabH+'px','overflow':'auto'}">
      <el-table
          :data="contentData2"
          :height="tabH"
          stripe
          ref="tableList"
          style="width: 100%">
          <el-table-column align="center" width="50"
          label="编号">
          <template slot-scope="scope">
            {{ (scope.$index+1)+(curPage-1)*pageSize}}
          </template>
          </el-table-column>
            <el-table-column align="center"
              label="设备标识符">
              <template slot-scope="scope">
                {{!scope.row.deviceSN?'-':scope.row.deviceSN}}
              </template>
            </el-table-column>
            <el-table-column align="center"
            label="品牌名称">
            <template slot-scope="scope">
              {{!scope.row.channelName?'-':scope.row.channelName}}
            </template>
            </el-table-column>
            <el-table-column align="center"
             prop="phone"
                  label="关联的手机号">
                  <template slot-scope="scope">
                    {{!scope.row.phone?'-':scope.row.phone}}
                  </template>
            </el-table-column>
            <el-table-column align="center"
                prop="orderCnt"
                  label="订单数">
            </el-table-column>
            <el-table-column align="center"
                prop="orderPrice"
                  label="订单金额">
                  <template slot-scope="scope">
                    ￥{{!scope.row.orderPrice?'0.00':scope.row.orderPrice}}
                  </template>
            </el-table-column>
            <el-table-column align="center"
                  label="首单时间">
                  <template slot-scope="scope">
                    {{!scope.row.firstOrderTime?'尚未下单':scope.row.firstOrderTime}}
                  </template>
            </el-table-column>
            <el-table-column align="center"
                prop="createTime"
                  label="注册时间">
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
  import {User} from '@/config/url'
import Page from '@/components/page'
  export default{
    components:{
      Page,
    },
    data(){
      return{
        deviceCnt: 0,
        todatyCnt: 0,
        yesCnt: 0,
        deviceSN:'',
        dateRange:'',
        contentData: [],
        pageSize:10,
        curPage:1,
        total:0,
        defaultTx:require('@/assets/default_tx.png'),
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
      _this.getUserCount();
    },
    computed:{
      contentData2:function(){
        let arr = [];
        // console.log(this.contentData)
        for(let item of this.contentData){
            if(item.phone){
              let str = item.phone;
               str = str.split(',');
               str = str.join("/");
              item.phone = str;
            }
           arr.push(item);
        }
        return arr;
      }
    },
    methods:{
      getTabH(){
        const _this = this;
        let clientH = document.body.clientHeight || document.documentElement.clientHeight;
        let searchH = document.getElementById("searchBox").offsetHeight;
        let tabH = clientH - 60 - 20 - searchH - 20 - 52;
        _this.tabH = tabH;
      },
      search(){
        const _this = this;
        _this.curPage = 1;
        _this.getListData(_this.curPage);
      },
      resetForm(){
        this.deviceSN = ''
        this.dateRange = ''
      },
      changeCurPage(p){
        const _this = this;
        _this.curPage = p;
        this.$refs.tableList.bodyWrapper.scrollTop = 0;
        _this.getListData(_this.curPage);
      },
      getUserCount(){
        const _this = this;
        const token = localStorage.getItem('token');
        const formData = {}
        _this.$axios.get(User.deviceActive, {headers: {'Content-Type': 'application/json','token':token}})
          .then((res) => {
            // console.log(res)
            if (res.data.resultCode == 0) {
              _this.deviceCnt = res.data.data.deviceCnt
              _this.todatyCnt = res.data.data.todatyCnt
              _this.yesCnt = res.data.data.yesCnt
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
      getListData(pageNo) {
        const _this = this;
        const token = localStorage.getItem('token');
        const dateRange = _this.dateRange;
        let startTime = '';
        let endTime = '';
        if(dateRange.length>0){
          startTime = dateRange[0]
          endTime = dateRange[1]
        }
        const formData = {
          deviceSN:_this.deviceSN,
          startTime:startTime,
          endTime:endTime,
          pageNo:pageNo
        }
        _this.$axios.post(User.deviceList, JSON.stringify(formData),{headers: {'Content-Type': 'application/json','token':token}})
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
    }
  }
</script>

<style scoped>
.lab-t{
  line-height: 40px;
  color: #f56c6c;
  display: inline-block;
}
.tx{
  width: 40px;
  height: 40px;
  overflow: hidden;
  border-radius: 20px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
}
</style>
