<template>
  <div class="content">
    <div class="flex">
        <el-select v-model="value1" placeholder="请选择停车场" class="mr10">
            <el-option label="全部" value="0"></el-option>
            <el-option label="县府路" value="1"></el-option>
            <el-option label="沿江码头" value="2"></el-option>
        </el-select>
        <el-select v-model="value2" placeholder="请选择分类" class="mr10">
            <el-option label="全部" value="0"></el-option>
            <el-option label="月卡" value="1"></el-option>
            <el-option label="季卡" value="2"></el-option>
            <el-option label="半年卡" value="3"></el-option>
            <el-option label="年卡" value="4"></el-option>
        </el-select>
        <el-button  icon="el-icon-refresh">重置</el-button>
        <el-button type="primary"  icon="el-icon-search">搜索</el-button>
    </div>
    <!-- 过虑条件  end-->
    <div class="flex" style="padding: 20px 0;">
      <el-button  type="primary" icon="el-icon-plus" @click="add">新增</el-button>
      <el-button type="success" icon="el-icon-edit" disabled>修改</el-button>
      <el-button icon="el-icon-delete" disabled>删除</el-button>
      <el-button type="warning" icon="el-icon-download">导出</el-button>
    </div>
    <!-- 标题  end-->
    <div class="">
      <el-table
          :data="contentData"
          stripe
          :row-key='getRowKey'
          type="selection"
          style="width: 100%">
          <el-table-column type="selection"  :reserve-selection="true" width="55"> </el-table-column>
          <el-table-column
          prop="id"
          label="id">
          </el-table-column>
          <el-table-column
          prop="parkingLotName"
            label="停车场">
          </el-table-column>
            <el-table-column
            prop="classification"
              label="分类">
            </el-table-column>
            <el-table-column
            prop="amount"
            label="金额">
            </el-table-column>
            <el-table-column
                prop="remake"
                  label="备注">
            </el-table-column>
            <el-table-column label="操作" width="200px">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handleEdit(scope.$index, scope.row)" >修改金额</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDel(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
        </el-table>
    </div>

      <!-- 表格  end-->
      <div class="page">
          <Page :pageSize="pageSize" :cur="curPage" :total="total" @pageChange="changeCurPage"/>
       </div>

      <el-dialog
        :title="title"
        :visible.sync="dialogVisible1"
        width="500px"
        :before-close="handleClose">
         <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
           <el-form-item label="停车场" prop="name" label-width="150px">
            <el-select v-model="ruleForm.parkingLotName" placeholder="请选择停车场" :disabled="istrue">
                <el-option label="县府路" value="1"></el-option>
                <el-option label="沿江码头" value="2"></el-option>
              </el-select>
            </el-form-item>
           <el-form-item label="分类" prop="region" label-width="150px">
             <el-select v-model="ruleForm.classification" placeholder="请选择分类" :disabled="istrue">
               <el-option label="年卡" value="1"></el-option>
               <el-option label="月卡" value="2"></el-option>
               <el-option label="季卡" value="3"></el-option>
             </el-select>
           </el-form-item>
           <el-form-item label="金额" prop="amount" label-width="150px">
             <el-input v-model="ruleForm.amount"></el-input>
           </el-form-item>
           <el-form-item label="备注" prop="remake" label-width="150px">
             <el-input  type="textarea" v-model="ruleForm.place"></el-input>
           </el-form-item>
         </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible1 = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible1 = false">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog
        title="警告"
        :visible.sync="dialogVisible2"
        width="400px"
        :before-close="handleClose">
        是否确认删除包月设置编号为"{{id}}"的数据项?
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible2 = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible2 = false">确 定</el-button>
        </span>
      </el-dialog>

  </div>

</template>

<script>
import {Charge} from '@/config/url'
import Page from '@/components/page'
  export default{
    components:{
      Page,
    },
    data(){
      return{
        value1:'',
        value2:'',
        dialogVisible1: false,
        dialogVisible2: false,
        istrue:false,
        title:'添加包月设置',
        contentData: [],
        "pageSize":10,
        curPage:1,
        total:0,
        ruleForm:{},
        id:''
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
      handleEdit(index, row) {
        console.log(index, row);
        const _this = this;
        _this.contentData.forEach(function(item,index){
          if(item.id == row.id){
            _this.ruleForm = item;
          }
        })
        _this.title="修改包月设置";
        _this.istrue = true;
        _this.dialogVisible1 = true
      },
      handleDel(index, row) {
        console.log(index, row);
        this.id = row.id;
        this.dialogVisible2 = true
      },
      handleClose(done) {
        done();
      },
      add(){
         this.ruleForm = {};
         this.title="添加包月设置";
         this.istrue = false;
        this.dialogVisible1 = true
      },
      getRowKey(row){
             return row.id;
        },
      getListData() {
        const _this = this
        const formData = {}
        _this.$axios.get(Charge.setting, formData)
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
