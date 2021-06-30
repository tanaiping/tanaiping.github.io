<template>
  <div class="content">
    <div class="flex-search">
        <el-input v-model="name1" placeholder="请输入设备编号" class="filter-input mr10"></el-input>
        <el-select v-model="value1" placeholder="请选择设备类型" class="mr10">
            <el-option label="LED屏" value="1"></el-option>
            <el-option label="视频监控" value="2"></el-option>
            <el-option label="rfid识别器" value="3"></el-option>
            <el-option label="泊位标签" value="4"></el-option>
        </el-select>
        <el-select v-model="value2" placeholder="请选择状态" class="mr10">
            <el-option label="正常" value="1"></el-option>
            <el-option label="异常" value="2"></el-option>
            <el-option label="停用" value="3"></el-option>
        </el-select>
        <el-select v-model="value3" placeholder="请选择是否在线" class="mr10">
            <el-option label="在线" value="1"></el-option>
            <el-option label="离线" value="2"></el-option>
        </el-select>
        <el-input v-model="name2" placeholder="请输入生产厂家" class="filter-input mr10"></el-input>
        <el-input v-model="name3" placeholder="请输入设备型号" class="filter-input mr10"></el-input>
        <el-input v-model="name4" placeholder="请输入EPC" class="filter-input mr10"></el-input>
        <el-input v-model="name5" placeholder="请输入EMEI" class="filter-input mr10"></el-input>
        <el-select v-model="value3" placeholder="请选择网点" class="mr10">
            <el-option label="县府路" value="1"></el-option>
            <el-option label="南屏西苑" value="2"></el-option>
        </el-select>
        <el-button  icon="el-icon-refresh">重置</el-button>
        <el-button type="primary"  icon="el-icon-search">搜索</el-button>
    </div>
    <!-- 过虑条件  end-->
    <div class="flex" style="padding: 20px 0;">
      <el-button  type="primary" icon="el-icon-plus" @click="add">新增</el-button>
      <el-button type="success" icon="el-icon-edit" disabled>修改</el-button>
      <el-button   icon="el-icon-delete" disabled>删除</el-button>
      <el-button type="info" icon="el-icon-upload2" disabled>导入</el-button>
      <el-button type="warning" icon="el-icon-download" disabled>导出</el-button>
    </div>
    <!-- 标题  end-->
    <div class="mt20">
      <el-table
          :data="contentData"
          stripe
          type="selection"
          :row-key='getRowKey'
          style="width: 100%">
          <el-table-column type="selection"  :reserve-selection="true" width="55"> </el-table-column>
          <el-table-column
          prop="id"
          label="设备编号">
          </el-table-column>
          <el-table-column
          prop="imei"
            label="IMEI">
          </el-table-column>
            <el-table-column
            prop="type"
              label="设备类型">
            </el-table-column>
            <el-table-column
            prop="status"
            label="状态">
            </el-table-column>
            <el-table-column
                prop="lastActiveTime"
                  label="最后活跃时间">
            </el-table-column>
            <el-table-column
                prop="batteryInfo"
                  label="电量电压">
            </el-table-column>
            <el-table-column
                prop="offline"
                  label="是否离线">
            </el-table-column>
            <el-table-column
                prop="parkingLot"
                  label="网点">
            </el-table-column>
            <el-table-column
                prop="isp"
                  label="泊位">
            </el-table-column>
            <el-table-column
                prop="parkingDoor"
                  label="出入口">
            </el-table-column>
            <el-table-column
                prop="epc"
                  label="User区">
            </el-table-column>
            <el-table-column
                prop="epc"
                  label="Epc区">
            </el-table-column>
            <el-table-column
                prop="purchaseDate"
                  label="采购日期">
            </el-table-column>
            <el-table-column label="操作" width="200px">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handleEdit(scope.$index, scope.row)" >修改</el-button>
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
         :visible.sync="dialogVisible"
         width="600px"
         :before-close="handleClose">
          <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="设备编号" prop="name" >
              <el-input v-model="ruleForm.id"></el-input>
            </el-form-item>
            <el-form-item label="IMEI" prop="name" >
              <el-input v-model="ruleForm.imei"></el-input>
            </el-form-item>
            <el-form-item label="设备类型" prop="region" >
              <el-select v-model="ruleForm.type" placeholder="请选择设备类型">
                <el-option label="喇叭" value="1"></el-option>
                <el-option label="道闸" value="2"></el-option>
                <el-option label="LED屏" value="3"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="生产厂家" prop="name" >
              <el-input v-model="ruleForm.factory"></el-input>
            </el-form-item>
            <el-form-item label="设备型号" prop="name" >
              <el-input v-model="ruleForm.model"></el-input>
            </el-form-item>
            <el-form-item label="采购日期" prop="name" >
              <el-date-picker
                    v-model="ruleForm.purchaseDate"
                    type="date"
                    placeholder="采购日期">
                  </el-date-picker>
            </el-form-item>

            <el-form-item label="EPC" prop="name" >
              <el-input v-model="ruleForm.epc"></el-input>
            </el-form-item>
            <el-form-item label="User" prop="name" >
              <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="name" >
              <el-radio v-model="ruleForm.status" label="0">备选项</el-radio>
              <el-radio v-model="ruleForm.status" label="1">备选项</el-radio>
              <el-radio v-model="ruleForm.status" label="2">备选项</el-radio>
            </el-form-item>
          </el-form>

         <span slot="footer" class="dialog-footer">
           <el-button @click="dialogVisible = false">取 消</el-button>
           <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
         </span>
       </el-dialog>

       <el-dialog
         title="提示"
         :visible.sync="dialogVisible1"
         width="400px"
         :before-close="handleClose">
         是否确认删除设备管理编号为"{{id}}"的数据项?
         <span slot="footer" class="dialog-footer">
           <el-button @click="dialogVisible1 = false">取 消</el-button>
           <el-button type="primary" @click="dialogVisible1 = false">确 定</el-button>
         </span>
       </el-dialog>
  </div>

</template>

<script>
  import {Device} from '@/config/url'
import Page from '@/components/page'
  export default{
    components:{
      Page,
    },
    data(){
      return{
        name1:'',
        name2:'',
        name3:'',
        name4:'',
        name5:'',
        value1:'',
        value2:'',
        value3:'',
        dialogVisible: false,
        dialogVisible1: false,
        title:'添加设备管理',
       contentData: [],
       "pageSize":10,
       curPage:1,
       total:0,
        ruleForm:{},
        id:0,
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
        this.title="修改设备管理"
        this.dialogVisible = true
      },
      handleDel(index, row) {
        console.log(index, row);
        this.id = row.id;
        this.dialogVisible1 = true
      },
      handleClose(done) {
        done();
      },
      add(){
         this.ruleForm = {};
         this.title="添加设备管理"
        this.dialogVisible = true
      },
      getRowKey(row){
             return row.id;
        },
      getListData() {
        const _this = this
        const formData = {}
        _this.$axios.get(Device.device, formData)
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
