<template>
  <div class="content">
    <div class="flex">
        <el-input v-model="name" placeholder="请输入车牌号" class="filter-input mr10"></el-input>
        <el-select v-model="value1" placeholder="请选择是否装卡" class="mr10">
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="2"></el-option>
        </el-select>
         <el-date-picker
            v-model="value2"
            type="daterange"
            range-separator="至"
            start-placeholder="装卡开始日期"
            end-placeholder="装卡结束日期" class="mr10">
          </el-date-picker>
        <el-input v-model="name2" placeholder="请输入装卡用户" class="filter-input mr10"></el-input>
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
          prop="carId"
            label="carId">
          </el-table-column>
          <el-table-column
          prop="installStatus"
          label="安装状态">
          </el-table-column>
          <el-table-column
              prop="writeCarStatus"
                label="是否写卡">
          </el-table-column>
          <el-table-column
              prop="installTime"
                label="装卡时间">
          </el-table-column>
          <el-table-column
              prop="installUser"
                label="装卡用户">
          </el-table-column>
          <el-table-column
              prop="installAddr"
                label="装卡地址">
          </el-table-column>
          <el-table-column
              prop="rfid"
                label="rfid">
          </el-table-column>
          <el-table-column
              prop="createTime"
                label="创建时间">
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
        value1:'',
        value2:'',
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
      handleShow(index, row) {
        console.log(index, row);
        this.dialogVisible = true
      },
      handleEdit(index, row) {
        console.log(index, row);
        this.ruleForm = {
          no:'fsdf',
          num:'1',
          rfid:'2',
          isActive:'1',
          type1:'2',
          color:'2',
          brand:'1',
          status:'是',
          desc:'刘三 15425644875',
        }
        this.dialogVisible1 = true
      },
      handleClose(done) {
        done();
      },
      add(){
         this.ruleForm = {};
        this.dialogVisible1 = true
      },
       getListData() {
         const _this = this
         const formData = {}
         _this.$axios.get(Car.record, formData)
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
