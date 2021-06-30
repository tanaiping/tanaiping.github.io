<template>
  <div class="content">
    <div class="flex">
        <el-input v-model="name" placeholder="请输入名称" class="filter-input mr10"></el-input>
        <el-button  icon="el-icon-refresh">重置</el-button>
        <el-button type="primary"  icon="el-icon-search">搜索</el-button>
    </div>
    <div class="flex" style="padding: 20px 0;">
      <el-button  type="primary" icon="el-icon-plus" @click="add">新建</el-button>
      <el-button type="success" icon="el-icon-document-copy" disabled>复制</el-button>
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
          label="编号">
          </el-table-column>
          <el-table-column
          prop="name"
            label="名称">
          </el-table-column>
          <el-table-column
          prop="startFreeMin"
          label="不收费时间">
          </el-table-column>
          <el-table-column
          prop="newenergyStartFreeMin"
            label="新能源不收费时间">
            </el-table-column>
            <el-table-column
            prop="firstPriceTimeHour"
            label="起步价">
            </el-table-column>
            <el-table-column
            prop="remark"
              label="备注">
            </el-table-column>

          <el-table-column label="操作" width="300px">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleDetail(scope.$index, scope.row)">规则明细</el-button>
                <el-button
                  size="mini"
                  type="primary"
                  @click="handleEdit(scope.$index, scope.row)">修改</el-button>
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
         <el-form :model="ruleForm" ref="ruleForm" label-width="150px" class="demo-ruleForm">
           <el-form-item label="名称" prop="name" >
             <el-input v-model="ruleForm.name"></el-input>
           </el-form-item>
           <el-form-item label="不收费时间" prop="name" >
            <el-input placeholder="请输入不收费时间" v-model="ruleForm.startFreeMin">
                 <template slot="append">分钟</template>
            </el-input>
           </el-form-item>
           <el-form-item label="新能源不收费时间" prop="name" >
            <el-input placeholder="请输入新能源不收费时间" v-model="ruleForm.newenergyStartFreeMin">
                 <template slot="append">分钟</template>
            </el-input>
           </el-form-item>
           <el-form-item label="起步价时间" prop="name" >
            <el-input placeholder="请输入不收费时间" v-model="ruleForm.firstPriceTimeHour">
                 <template slot="append">小时</template>
            </el-input>
           </el-form-item>
           <el-form-item label="备注" prop="name" >
             <el-input v-model="ruleForm.remark" type="textarea"></el-input>
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
        是否确认删除计费规则信息编号为"{{id}}"的数据项?
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible2 = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible2 = false">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog
        title="计费规则明细"
        :visible.sync="dialogVisible3"
        width="80%"
        :before-close="handleClose">
         <el-table
             :data="contentData2"
             stripe
             type="selection"
             :row-key='getRowKey'
             style="width: 100%">
             <el-table-column type="selection"  :reserve-selection="true" width="55"> </el-table-column>
             <el-table-column
             prop="carType"
             label="车辆类型">
             </el-table-column>
             <el-table-column
             prop="everytime"
               label="起步价格">
             </el-table-column>
             <el-table-column
             prop="temporary"
             label="每小时价格">
             </el-table-column>
             <el-table-column
             prop="daytime"
               label="白天停车(次/元)">
               </el-table-column>
               <el-table-column
               prop="night"
               label="夜间停车(次/元)">
               </el-table-column>
               <el-table-column
               prop="day"
                 label="整天停车(次/元)">
               </el-table-column>

             <el-table-column label="操作" width="300px">
               <template slot-scope="scope">
                   <el-button
                     size="mini"
                     type="primary"
                     @click="handleEdit2(scope.$index, scope.row)">修改</el-button>
                     <el-button
                       size="mini"
                       type="danger"
                       @click="handleDel2(scope.$index, scope.row)">删除</el-button>
               </template>
             </el-table-column>
           </el-table>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible3 = false">取 消</el-button>
          <el-button type="primary" @click="addRule">添加规则</el-button>
        </span>
      </el-dialog>

      <el-dialog
        title="警告"
        :visible.sync="dialogVisible4"
        width="400px"
        :before-close="handleClose">
        是否确认删除计费规则编号为"{{id}}"的数据项?
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible4 = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible4 = false">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog
        :title="title2"
        :visible.sync="dialogVisible5"
        width="500px"
        :before-close="handleClose">
         <el-form :model="ruleForm2" ref="ruleForm" label-width="150px" class="demo-ruleForm">

           <el-form-item label="车辆类型" prop="name" >
             <el-select v-model="ruleForm2.parkingLotType" placeholder="请选择车辆类型">
                 <el-option label="轿车" value="1"></el-option>
                 <el-option label="大型客车" value="2"></el-option>
                 <el-option label="中小型客车" value="3"></el-option>
                 <el-option label="轻微型客车" value="4"></el-option>
             </el-select>
           </el-form-item>
           <el-form-item label="起步价格" prop="name" >
             <el-input v-model="ruleForm2.everytime"></el-input>
           </el-form-item>
           <el-form-item label="每小时价格" prop="name" >
             <el-input v-model="ruleForm2.temporary"></el-input>
           </el-form-item>
           <el-form-item label="白天停车(次/元)" prop="name" >
             <el-input v-model="ruleForm2.daytime"></el-input>
           </el-form-item>
           <el-form-item label="夜间停车(次/元)" prop="name" >
             <el-input v-model="ruleForm2.night"></el-input>
           </el-form-item>
           <el-form-item label="整天停车(次/元)" prop="name" >
             <el-input v-model="ruleForm2.day"></el-input>
           </el-form-item>
         </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible5 = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible5 = false">确 定</el-button>
        </span>
      </el-dialog>
  </div>

</template>

<script>
 import {Fee} from '@/config/url'
import Page from '@/components/page'
  export default{
    components:{
      Page,
    },
    data(){
      return{
        name:'',
        title:'添加规则计费信息',
        title2:'添加计费规则',
        dialogVisible1: false,
        dialogVisible2: false,
        dialogVisible3: false,
        dialogVisible4: false,
        dialogVisible5: false,
        contentData: [],
        contentData2: [],
        "pageSize":10,
        curPage:1,
        total:0,
        id:0,
        ruleForm:{
        },
        ruleForm2:{
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
      handleDetail(index, row) {
        console.log(index, row);
        this.getFeerule();
        this.dialogVisible3 = true

      },
      handleEdit(index, row) {
        console.log(index, row);
        const _this = this;
        _this.contentData.forEach(function(item,index){
          if(item.id == row.id){
            _this.ruleForm = item;
          }
        })
        this.title="修改规则计费信息"
        this.dialogVisible1 = true
      },
      handleEdit2(index, row) {
        console.log(index, row);
        const _this = this;
        _this.contentData2.forEach(function(item,index){
          if(item.id == row.id){
            _this.ruleForm2 = item;
          }
        })
        this.title2="修改计费规则"
        this.dialogVisible5 = true
      },
      handleDel(index, row) {
        console.log(index, row);
        this.id = row.id;
        this.dialogVisible2 = true
      },
      handleDel2(index, row) {
        console.log(index, row);
        this.id = row.id;
        this.dialogVisible4 = true
      },
      handleClose(done) {
        done();
      },
      add(){
         this.ruleForm = {};
         this.title="添加规则计费信息"
        this.dialogVisible1 = true
      },
      addRule(){
        this.ruleForm2 = {};
        this.title2="添加计费规则"
        this.dialogVisible5 = true
      },
      getRowKey(row){
             return row.id;
        },
      getListData() {
        const _this = this
        const formData = {}
        _this.$axios.get(Fee.feeRuleGroup, formData)
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
      getFeerule(){
        const _this = this
        const formData = {}
        _this.$axios.get(Fee.feerule, formData)
          .then((res) => {
            console.log(res)
            if (res.data.code == 200) {
              this.total = res.data.total;
              console.log(res.data.rows);
              this.contentData2 = res.data.rows;
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
