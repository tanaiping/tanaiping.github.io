<template>
  <div class="content">
    <div class="flex">
        <el-input v-model="name" placeholder="请输入网点名称" class="filter-input mr10"></el-input>
        <el-select v-model="value" placeholder="请选择" class="mr10">
            <el-option label="普通停车场" value="1"></el-option>
            <el-option label="室内停车场" value="2"></el-option>
            <el-option label="路内停车场" value="3"></el-option>
        </el-select>
         <el-input v-model="address" placeholder="请输入详细地址" class="filter-input mr10"></el-input>
       <!-- <el-date-picker
              v-model="value1"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期" class="mr10">
            </el-date-picker> -->
        <el-button  icon="el-icon-refresh">重置</el-button>
        <el-button type="primary"  icon="el-icon-search">搜索</el-button>
    </div>
    <div class="flex" style="padding: 20px 0;">
      <el-button  type="primary" icon="el-icon-plus" @click="add">新增</el-button>
      <el-button type="success" icon="el-icon-edit" disabled>修改</el-button>
      <el-button type="warning" icon="el-icon-download">导出</el-button>
    </div>
    <!-- 过虑条件  end-->
    <!-- 标题  end-->
    <div>
      <el-table
          :data="contentData"
          stripe
          type="selection"
          :row-key='getRowKey'
          style="width: 100%">
          <el-table-column type="selection"  :reserve-selection="true" width="55"> </el-table-column>
          <el-table-column
          prop="id"
          label="网点编号">
          </el-table-column>
          <el-table-column
          prop="name"
            label="网点名称">
          </el-table-column>
          <el-table-column
          prop="feeRuleType"
          label="网点类型">
          </el-table-column>
          <el-table-column
          prop="type"
            label="计费类型">
            </el-table-column>
            <el-table-column
            prop="capacity"
            label="网点容量">
            </el-table-column>
            <el-table-column
            prop="delFlag"
              label="剩余泊位">
            </el-table-column>
            <el-table-column
            prop="perFee"
            label="停车费(次)">
            </el-table-column>
            <el-table-column
            prop="noEnterPass"
              label="无入场事件是否放行">
            </el-table-column>
            <el-table-column
            prop="useBlackList"
            label="是否使用黑名单">
            </el-table-column>
            <el-table-column
            prop="addr"
              label="详细地址">
            </el-table-column>

          <el-table-column label="操作" width="200px">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleShow(scope.$index, scope.row)" >二维码</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleEdit(scope.$index, scope.row)">修改</el-button>
            </template>
          </el-table-column>
        </el-table>
    </div>

      <!-- 表格  end-->
      <div class="page">
          <Page :pageSize="pageSize" :cur="curPage" :total="total" @pageChange="changeCurPage"/>
       </div>

      <el-dialog
        title="包月二维码"
        :visible.sync="dialogVisible"
        width="400px"
        :before-close="handleClose">
        <img src="../../assets/code.png" alt="">
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="修改停车网点"
        :visible.sync="dialogVisible1"
        width="600px"
        :before-close="handleClose">
         <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
           <el-form-item label="网点名称" prop="name" label-width="150px">
             <el-input v-model="ruleForm.name"></el-input>
           </el-form-item>
           <el-form-item label="网点类型" prop="region" label-width="150px">
             <el-select v-model="ruleForm.feeRuleType" placeholder="请选择网点类型">
               <el-option label="室内停车场" value="1"></el-option>
               <el-option label="普通停车场" value="2"></el-option>
               <el-option label="路内停车场" value="3"></el-option>
             </el-select>
           </el-form-item>
           <el-form-item label="计费类型" prop="region" label-width="150px">
             <el-select v-model="ruleForm.type" placeholder="请选择计费类型">
               <el-option label="室内停车场" value="1"></el-option>
               <el-option label="普通停车场" value="2"></el-option>
               <el-option label="路内停车场" value="3"></el-option>
             </el-select>
           </el-form-item>
           <el-form-item label="网点容量" prop="name" label-width="150px">
             <el-input v-model="ruleForm.capacity"></el-input>
           </el-form-item>
           <el-form-item label="剩余泊位" prop="name" label-width="150px">
             <el-input v-model="ruleForm.delFlag"></el-input>
           </el-form-item>
           <el-form-item label="停车费(元/次)" prop="name" label-width="150px">
             <el-input v-model="ruleForm.perFee"></el-input>
           </el-form-item>
           <el-form-item label="无入场事件是否放行" prop="region" label-width="150px">
             <el-select v-model="ruleForm.noEnterPass" placeholder="请选择是否放行">
               <el-option label="不放行" value="1"></el-option>
               <el-option label="放行" value="2"></el-option>
             </el-select>
           </el-form-item>
           <el-form-item label="是否使用黑名单" prop="region" label-width="150px">
             <el-select v-model="ruleForm.useBlackList" placeholder="请选择是否使用">
               <el-option label="不使用" value="1"></el-option>
               <el-option label="使用" value="2"></el-option>
             </el-select>
           </el-form-item>
           <el-form-item label="详细地址" prop="name" label-width="150px">
             <el-input v-model="ruleForm.addr"></el-input>
           </el-form-item>
           <el-form-item label="经度" prop="name" label-width="150px">
             <el-input v-model="ruleForm.longitude"></el-input>
           </el-form-item>
           <el-form-item label="纬度" prop="name" label-width="150px">
             <el-input v-model="ruleForm.latitude"></el-input>
           </el-form-item>
         </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible1 = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible1 = false">确 定</el-button>
        </span>
      </el-dialog>
  </div>

</template>

<script>
 import {Park} from '@/config/url'
import Page from '@/components/page'

  export default{
    components:{
      Page,
    },
    data(){
      return{
        name:'',
        value:'1',
        address:'',
        dialogVisible: false,
        dialogVisible1: false,
        contentData: [],
        "pageSize":10,
        curPage:1,
        total:0,
        ruleForm:{
        }
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
        const _this = this;
        _this.contentData.forEach(function(item,index){
          if(item.id == row.id){
            _this.ruleForm = item;
          }
        })
        _this.dialogVisible1 = true
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
        _this.$axios.post(Park.list, formData)
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
