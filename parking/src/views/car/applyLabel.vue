<template>
  <div class="content">
    <div class="flex">
        <el-input v-model="name" placeholder="请输入车牌号" class="filter-input mr10"></el-input>
        <el-input v-model="name2" placeholder="请输入手机号" class="filter-input mr10"></el-input>
        <el-select v-model="value1" placeholder="请选择是否装卡" class="mr10">
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="2"></el-option>
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
          :row-key='getRowKey'
          type="selection"
          style="width: 100%">
          <el-table-column type="selection"  :reserve-selection="true" width="55"> </el-table-column>
          <el-table-column
          prop="id"
          label="ID">
          </el-table-column>
          <el-table-column
          prop="plate"
            label="车牌号">
          </el-table-column>
            <el-table-column
            prop="mobile"
              label="手机号码">
            </el-table-column>
            <el-table-column
            prop="rfid"
            label="RFID号">
            </el-table-column>
            <el-table-column
                prop="rfidInstall"
                  label="是否装卡">
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
        getRowKey(row){
               return row.id;
          },
        getListData() {
          const _this = this
          const formData = {}
          _this.$axios.get(Car.listApply, formData)
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
