<template>
  <div class="content">
    <div class="flex-search" id="searchBox">
      <el-form ref="form"  label-width="80px" @keyup.enter.native="search">
        <el-input v-model="nickName" placeholder="请输入员工姓名" class="filter-input mr10"></el-input>
        <el-input v-model="userName" placeholder="请输入员工账号" class="filter-input mr10"></el-input>
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
        <el-button type="error"  icon="el-icon-plus" @click="add">新增员工</el-button>
      </el-form>
    </div>
    <!-- 过虑条件  end-->
    <div class="mt20" :style="{'height':tabH+'px','overflow':'auto'}">
      <el-table
          :data="employeeList"
          :height="tabH"
          stripe
          style="width: 100%">
          <el-table-column align="center" width="50px"
          label="编号">
          <template slot-scope="scope">
            {{ (scope.$index+1)+(curPage-1)*pageSize}}
          </template>
          </el-table-column>
            <el-table-column align="center"
            prop="nickName"
              label="员工姓名">
            </el-table-column>
            <el-table-column align="center"
            prop="position"
            label="员工职位">
            </el-table-column>
            <el-table-column align="center"
                prop="userName"
                  label="员工账号">
            </el-table-column>
            <el-table-column align="center"
                prop="password"
                  label="员工密码">
            </el-table-column>
            <el-table-column align="center"
                prop="createTime"
                  label="注册时间">
            </el-table-column>
            <el-table-column align="center"
                prop="statusName"
                  label="状态">
            </el-table-column>
            <el-table-column label="操作" width="250px" align="center">
              <template slot-scope="scope">

                <el-button v-if="scope.row.status == 0"
                  size="mini"
                  @click="handleStatus(scope.$index, scope.row,1)" >禁用</el-button>
                <el-button v-if="scope.row.status == 1"
                  size="mini"
                  @click="handleStatus(scope.$index, scope.row,0)" >启用</el-button>
                  <el-button
                    size="mini"
                    @click="handleEdit(scope.$index, scope.row)" >编辑</el-button>
                    <el-button v-if="scope.row.status == 1"
                      size="mini"
                      @click="handleStatus(scope.$index, scope.row,2)" >删除</el-button>
              </template>
            </el-table-column>
        </el-table>
    </div>

      <!-- 表格  end-->
      <div class="page">
          <Page :pageSize="pageSize" :cur="curPage" :total="total" @pageChange="changeCurPage"/>
       </div>

       <el-dialog
        :title=title
        :visible.sync="dialogVisible1"
        width="400px"
        :before-close="handleClose">
         {{dialogTxt}}
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible1 = false">取 消</el-button>
          <el-button type="primary" @click="changeStatus">确 定</el-button>
        </span>
      </el-dialog>

  </div>

</template>

<script>
  import {Login} from '@/config/url'
import Page from '@/components/page'
  export default{
    components:{
      Page,
    },
    data(){
      return{
        nickName:'',
        userName:'',
        dateRange:[],
        title:'禁用确认',
        dialogVisible1:false,
        employeeList: [],
        pageSize:10,
        curPage:1,
        total:0,
        status:'',
        id:'',
        dialogTxt:'是否启用该账号',//禁用后不可用，该账号无法使用  是否启用该账号  是否删除，删除后将不存在？
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
        let tabH = clientH - 60 - 20 - searchH - 20 - 52;
        _this.tabH = tabH;
      },
      search(){
        const _this = this;
        _this.curPage = 1;
        _this.getListData(_this.curPage);
      },
      resetForm(){
        this.userName = ''
        this.nickName = ''
        this.dateRange = ''
      },
      changeCurPage(p){
         const _this = this;
        _this.curPage = p;
        _this.getListData(_this.curPage);
      },
      handleEdit(index, row) {
        console.log(index, row);
        const _this = this;
         _this.$router.push({name:'editEmployer',"query":{'id':row.id,'pageNo':_this.curPage}})//
      },
      handleStatus(index, row,type) {
        console.log(index, row);
        const _this = this;
        _this.status = type;
        _this.id = row.id;
        if(type == 0){//启用
          this.title = '启用确认'
          this.dialogTxt = '是否启用该账号'
        }else if(type == 2){//删除
          this.title = '删除确认'
          this.dialogTxt = '是否删除，删除后将不存在？'
        }else{
          this.title = '禁用确认'
          this.dialogTxt = '禁用后不可用，该账号无法使用'
        }
        this.dialogVisible1 = true
      },
      handleClose(done) {
        done();
      },
      add(){
         this.$router.push({name:'addEmployer'})
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
          userName:_this.userName,
          nickName:_this.nickName,
          startTime:startTime,
          endTime:endTime,
          pageNo:pageNo
        }
        _this.$axios.post(Login.employeeList, JSON.stringify(formData),{headers: {'Content-Type': 'application/json','token':token}})
          .then((res) => {
            // console.log(res)
            if (res.data.resultCode == 0) {
              if(res.data.data.data){
                _this.employeeList = res.data.data.data;
              }else{
                _this.employeeList = [];
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
      changeStatus(){//
        const _this = this;
        const token = localStorage.getItem('token');
        const formData ={
          id:_this.id,
          status:_this.status
        }
         _this.$axios.post(Login.switchEmployeeStatue, JSON.stringify(formData),{headers: {'Content-Type': 'application/json','token':token}})
           .then((res) => {
             // console.log(res)
             if (res.data.resultCode == 0) {
               _this.dialogVisible1 = false;
               setTimeout(function(){
                 let msgTxt = '';
                 switch(_this.status){
                   case 0: msgTxt = '启用'; break;
                   case 1: msgTxt = '禁用'; break;
                   case 2: msgTxt = '删除'; break;
                 }
                 _this.$alert(msgTxt+'成功', '提示', {
                     confirmButtonText: '确定',
                      type: 'success',
                     callback: action => {
                       _this.getListData(_this.curPage);
                     }
                   });
               },200)



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
      }
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
