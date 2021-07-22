<template>
  <div class="content">
    <div class="flex-search" id="searchBox">
      <el-form ref="form"  label-width="80px" @keyup.enter.native="search">
        <label class="mr10 lab-t">昨日新增({{yesAdd}})</label>
        <label class="mr10 lab-t">累计用户({{totalUser}})</label>
        <el-input v-model="mobile" placeholder="请输入手机号" class="filter-input mr10"></el-input>
        <el-input v-model="nickName" placeholder="请输入昵称" class="filter-input mr10"></el-input>
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
          :data="contentData"
          :height="tabH"
          stripe
          style="width: 100%">
          <el-table-column align="center" width="50"
          label="编号">
          <template slot-scope="scope">
            {{ (scope.$index+1)+(curPage-1)*pageSize}}
          </template>
          </el-table-column>
          <el-table-column align="center"
            label="头像" width="100">
            <template slot-scope="scope">
              <img :src="!scope.row.headimgurl?defaultTx:scope.row.headimgurl" alt="" class="tx">
            </template>
          </el-table-column>
            <el-table-column align="center"
            prop="nickName"
              label="昵称">
              <template slot-scope="scope">
                {{!scope.row.nickName?'-':scope.row.nickName}}
              </template>
            </el-table-column>
            <el-table-column align="center"
            label="绑定的手机号">
            <template slot-scope="scope">
              {{!scope.row.mobile?'尚未绑定':scope.row.mobile}}
            </template>
            </el-table-column>
            <el-table-column align="center"
                  label="性别">
              <template slot-scope="scope">
                {{!scope.row.sex?'-':(scope.row.sex==1)?'男':'女'}}
              </template>
            </el-table-column>
            <el-table-column align="center"
                prop="province"
                  label="省市">
                  <template slot-scope="scope">
                    {{!scope.row.province?'-':scope.row.province}}
                  </template>
            </el-table-column>
            <el-table-column align="center"
                prop="channelName"
                  label="渠道名称">
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
        yesAdd:'',
        totalUser:'',
        mobile:'',
        nickName:'',
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
        this.mobile = ''
        this.nickName = ''
        this.dateRange = ''
      },
      changeCurPage(p){
        const _this = this;
        _this.curPage = p;
        _this.getListData(_this.curPage);
      },
      getUserCount(){
        const _this = this;
        const token = localStorage.getItem('token');
        const formData = {}
        _this.$axios.post(User.userInfoCount, JSON.stringify(formData),{headers: {'Content-Type': 'application/json','token':token}})
          .then((res) => {
            console.log(res)
            if (res.data.resultCode == 0) {
              _this.totalUser = res.data.data.totalUser
              _this.yesAdd = res.data.data.yesAdd
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
          mobile:_this.mobile,
          nickName:_this.nickName,
          startTime:startTime,
          endTime:endTime,
          pageNo:pageNo
        }
        _this.$axios.post(User.userInfoList, JSON.stringify(formData),{headers: {'Content-Type': 'application/json','token':token}})
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
