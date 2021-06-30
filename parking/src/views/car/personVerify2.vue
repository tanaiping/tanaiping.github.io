<template>
  <div class="content">
    <div class="flex">
        <el-input v-model="name" placeholder="请输入车牌号" class="filter-input mr10"></el-input>
        <el-input v-model="name2" placeholder="请输入车辆vin码" class="filter-input mr10"></el-input>
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
          prop="vin"
          label="车辆VIN码">
          </el-table-column>
          <el-table-column
          prop="engine"
            label="发动机号码">
            </el-table-column>
            <el-table-column
            prop="engine"
            label="行码证图片">
            </el-table-column>
            <el-table-column
            prop="phone"
              label="用户手机号">
            </el-table-column>
            <el-table-column
            prop="name"
              label="装卡联系人">
            </el-table-column>
            <el-table-column
            prop="phone"
            label="装卡人手机号">
            </el-table-column>
            <el-table-column
            prop="createBy"
              label="装卡人地址">
            </el-table-column>
            <el-table-column
              prop="createBy"
                label="装卡审核">
             </el-table-column>

          <el-table-column label="操作" width="100px">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="danger"
                @click="handleEdit(scope.$index, scope.row)">复核</el-button>
            </template>
          </el-table-column>
        </el-table>
    </div>

      <!-- 表格  end-->
      <div class="page">
          <Page :pageSize="pageSize" :cur="curPage" :total="total" @pageChange="changeCurPage"/>
       </div>

       <el-dialog
         title="审核"
         :visible.sync="dialogVisible1"
         width="700px"
         :before-close="handleClose">
         <div class="flex">
           <img :src="img01" alt="" style=" width: 50%;">
           <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
             <el-form-item label="车辆类型" prop="region" label-width="150px">
               <el-select v-model="ruleForm.type1" placeholder="请选择车辆类型" disabled>
                 <el-option label="轿车" value="1"></el-option>
                 <el-option label="大型货车" value="2"></el-option>
                 <el-option label="中小型货车" value="3"></el-option>
               </el-select>
             </el-form-item>
             <el-form-item label="车辆性质" prop="region" label-width="150px">
               <el-select v-model="ruleForm.type2" placeholder="请选择车辆性质" disabled>
                 <el-option label="非营运" value="1"></el-option>
                 <el-option label="营运" value="2"></el-option>
               </el-select>
             </el-form-item>
             <el-form-item label="车辆VIN码" prop="name" placeholder="请输入车辆VIN码" label-width="150px">
               <el-input v-model="ruleForm.vin"></el-input>
             </el-form-item>
           </el-form>
         </div>


         <span slot="footer" class="dialog-footer">
           <el-button @click="dialogVisible1 = false">取 消</el-button>
           <el-button type="primary" @click="dialogVisible1 = false">确 定</el-button>
         </span>
       </el-dialog>
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
        dialogVisible1: false,
        img01:require('@/assets/img01.png'),
        contentData: [],
        "pageSize":10,
        curPage:1,
        total:0,
        ruleForm:{}
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
          type1:'1',
          type2:'1',
          vin:'',
        }
        this.dialogVisible1 = true
      },
      handleClose(done) {
        done();
      },
      getListData() {
        const _this = this
        const formData = {}
        _this.$axios.get(Car.audit2, formData)
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
