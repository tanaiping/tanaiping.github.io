<template>
  <div class="content">
      <div class="flex">
          <el-select v-model="value" filterable placeholder="请输入或选择停车场" class="mr10">
              <el-option label="竹都大厦B区" value="1"></el-option>
              <el-option label="县府路" value="2"></el-option>
              <el-option label="沿江码头" value="3"></el-option>
            </el-select>
          <el-button type="primary"  icon="el-icon-search">搜索</el-button>
      </div>
      <div class="flex" style="padding: 20px 0;">
        <el-button  type="primary" icon="el-icon-plus" @click="add">新增</el-button>
        <el-button type="success" icon="el-icon-edit" disabled>修改</el-button>
        <el-button   icon="el-icon-delete" disabled>删除</el-button>
        <el-button type="info" icon="el-icon-upload2" disabled>导入</el-button>
        <el-button type="warning" icon="el-icon-download" disabled>导出</el-button>
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
            label="泊位编号">
            </el-table-column>
            <el-table-column
            prop="code"
              label="泊位ID">
            </el-table-column>
            <el-table-column
            prop="status"
            label="状态">
            </el-table-column>
            <el-table-column label="操作" width="300px">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handleShow(scope.$index, scope.row)" >设备</el-button>
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
           title="警告"
           :visible.sync="dialogVisible1"
           width="400px"
           :before-close="handleClose">
            是否确认删除泊位编号为"{{id}}"的数据项?
           <span slot="footer" class="dialog-footer">
             <el-button @click="dialogVisible1 = false">取 消</el-button>
             <el-button type="primary" @click="dialogVisible1 = false">确 定</el-button>
           </span>
         </el-dialog>

         <el-dialog
           :title="title"
           :visible.sync="dialogVisible2"
           width="600px"
           :before-close="handleClose">
            <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
              <el-form-item label="泊位编号" prop="name" >
                <el-input v-model="ruleForm.code" placeholder="请输入泊位编号"></el-input>
              </el-form-item>
              <el-form-item label="经度" prop="name" >
                <el-input v-model="ruleForm.longitude" placeholder="请输入经度">
                  <el-button slot="append" icon="el-icon-location"></el-button>
                 </el-input>
              </el-form-item>
              <el-form-item label="纬度" prop="name" >
                <el-input v-model="ruleForm.latitude" placeholder="请输入纬度"><el-button slot="append" icon="el-icon-location"></el-button></el-input>
              </el-form-item>
              <el-form-item label="状态" prop="name" >
                <el-input v-model="ruleForm.status" placeholder="请输入"></el-input>
              </el-form-item>
            </el-form>

           <span slot="footer" class="dialog-footer">
             <el-button @click="dialogVisible2 = false">取 消</el-button>
             <el-button type="primary" @click="dialogVisible2 = false">确 定</el-button>
           </span>
         </el-dialog>

         <el-dialog
           :title="code"
           :visible.sync="dialogVisible3"
           width="85%"
           :before-close="handleClose">

            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                <el-tab-pane label="已绑定设备" name="first">
                  <el-form :inline="true" :model="formInline" class="demo-form-inline">
                    <el-form-item label="设备编号">
                      <el-input v-model="formInline.user" placeholder="请输入设备编号"></el-input>
                    </el-form-item>
                    <el-form-item label="epc">
                      <el-input v-model="formInline.user" placeholder="请输入epc"></el-input>
                    </el-form-item>
                    <el-form-item label="IMEI">
                      <el-input v-model="formInline.user" placeholder="请输入IMEI"></el-input>
                    </el-form-item>
                    <el-form-item label="设备类型">
                      <el-select v-model="formInline.region" placeholder="请选择设备类型">
                        <el-option label="喇叭" value="1"></el-option>
                        <el-option label="道闸" value="2"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item>
                      <el-button  icon="el-icon-refresh">重置</el-button>
                      <el-button type="primary"  icon="el-icon-search">搜索</el-button>
                      <el-button  type="success" icon="el-icon-close" disabled>取消绑定</el-button>
                    </el-form-item>
                  </el-form>
                  <el-table
                      :data="contentData2"
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
                      prop="code"
                        label="IMEI">
                      </el-table-column>
                      <el-table-column
                      prop="code"
                        label="设备类型">
                      </el-table-column>
                      <el-table-column
                      prop="status"
                      label="状态">
                      </el-table-column>
                      <el-table-column
                      prop="status"
                      label="生产厂家">
                      </el-table-column>
                      <el-table-column
                      prop="status"
                      label="设备型号">
                      </el-table-column>
                      <el-table-column
                      prop="status"
                      label="epc">
                      </el-table-column>
                      <el-table-column
                      prop="status"
                      label="采购日期">
                      </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="未绑定设备" name="second">
                  <el-form :inline="true" :model="formInline" class="demo-form-inline">
                    <el-form-item label="设备编号">
                      <el-input v-model="formInline.user" placeholder="请输入设备编号"></el-input>
                    </el-form-item>
                    <el-form-item label="epc">
                      <el-input v-model="formInline.user" placeholder="请输入epc"></el-input>
                    </el-form-item>
                    <el-form-item label="IMEI">
                      <el-input v-model="formInline.user" placeholder="请输入IMEI"></el-input>
                    </el-form-item>
                    <el-form-item label="设备类型">
                      <el-select v-model="formInline.region" placeholder="请选择设备类型">
                        <el-option label="喇叭" value="1"></el-option>
                        <el-option label="道闸" value="2"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item>
                      <el-button  icon="el-icon-refresh">重置</el-button>
                      <el-button type="primary"  icon="el-icon-search">搜索</el-button>
                      <el-button  type="success" icon="el-icon-check" disabled>取消绑定</el-button>
                    </el-form-item>
                  </el-form>
                  <el-table
                      :data="contentData2"
                      stripe
                      type="selection"
                      :row-key='getRowKey'
                      style="width: 100%">
                      <el-table-column type="selection"  :reserve-selection="true" width="55"> </el-table-column>
                      <el-table-column
                      prop="code"
                      label="设备编号">
                      </el-table-column>
                      <el-table-column
                      prop="mei"
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
                      prop="factory"
                      label="生产厂家">
                      </el-table-column>
                      <el-table-column
                      prop="model"
                      label="设备型号">
                      </el-table-column>
                      <el-table-column
                      prop="epc"
                      label="epc">
                      </el-table-column>
                      <el-table-column
                      prop="createTime"
                      label="采购日期">
                      </el-table-column>
                    </el-table>
                </el-tab-pane>
              </el-tabs>

           <span slot="footer" class="dialog-footer">
             <el-button @click="dialogVisible3 = false">取 消</el-button>
             <el-button type="primary" @click="dialogVisible3 = false">确 定</el-button>
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
        value:'',
        id:'',
        activeName:'first',
        dialogVisible1:false,
        dialogVisible2:false,
        dialogVisible3:false,
        title:'添加泊位',
        contentData: [],
        contentData2: [],
        "pageSize":10,
        curPage:1,
        total:0,
        ruleForm:{},
        formInline:{},
        code:'00',
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
        this.code = '泊位'+row.code;
        this.dialogVisible3 = true
      },
      handleEdit(index, row) {
        console.log(index, row);
        const _this = this;
        this.title="编辑泊位"
        _this.contentData.forEach(function(item,index){
          if(item.id == row.id){
            _this.ruleForm = item;
          }
        })
        _this.dialogVisible2 = true
      },
      handleDel(index, row) {
        console.log(index, row);
        const _this = this;
        this.id =row.id;
        _this.dialogVisible1 = true
      },
      handleClose(done) {
        done();
      },
      add(){
        this.ruleForm = {};
        this.title="添加泊位";
        this.dialogVisible2 = true
      },
      getRowKey(row){
             return row.id;
        },
      getListData() {
        const _this = this
        const formData = {}
        _this.$axios.post(Park.plcaceM, formData)
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
      handleClick(tab, event) {
        console.log(tab, event);
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
