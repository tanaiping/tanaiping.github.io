<template>
  <div class="content">
    <div class="flex-search">
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
    </div>
    <!-- 过虑条件  end-->
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
            label="头像" width="100">
            <template slot-scope="scope">
              <img :src="scope.row.headimgurl" alt="" class="tx">
            </template>
          </el-table-column>
            <el-table-column
            prop="nickName"
              label="昵称">
            </el-table-column>
            <el-table-column
            prop="mobile"
            label="绑定的手机号">
            </el-table-column>
            <el-table-column
                  label="性别">
              <template slot-scope="scope">
                {{scope.row.sex==1?'男':'女'}}
              </template>
            </el-table-column>
            <el-table-column
                prop="province"
                  label="省市">
            </el-table-column>
            <el-table-column
                prop="firstOrderTime"
                  label="首单时间">
            </el-table-column>
            <el-table-column
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
       "pageSize":10,
       curPage:1,
       total:0,
        txImg:require('@/assets/login-background.jpg')
      }

    },
    mounted(){
      const _this = this;
      _this.getListData(_this.curPage);
      _this.getUserCount();
    },
    methods:{
      search(){
        const _this = this;
        _this.getListData(_this.curPage);
      },
      resetForm(){
        this.mobile = ''
        this.nickName = ''
        this.dateRange = ''
      },
      changeCurPage(p){
        this.curPage = p;
        console.log(this.curPage);
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
              _this.$message(res.data.resultMsg);
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
            console.log(res)
            if (res.data.resultCode == 0) {
              _this.contentData = res.data.data.data;
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
