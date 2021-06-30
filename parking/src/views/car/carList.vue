<template>
  <div class="content">
    <div class="flex">
        <el-input v-model="name" placeholder="请输入车牌号" class="filter-input mr10"></el-input>
        <el-input v-model="name2" placeholder="请输入RFID号" class="filter-input mr10"></el-input>
        <el-select v-model="value1" placeholder="请选择停车类型" class="mr10">
            <el-option label="请选择停车类型" value="-1"></el-option>
            <el-option label="包月" value="1"></el-option>
            <el-option label="临停" value="2"></el-option>
        </el-select>
        <el-select v-model="value2" placeholder="请选择装卡状态" class="mr10">
            <el-option label="请选择装卡状态" value="-1"></el-option>
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="2"></el-option>
        </el-select>
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
          @selection-change="handleSelectionChange"
          style="width: 100%">
          <el-table-column type="selection"  :reserve-selection="true" width="55"> </el-table-column>
          <el-table-column
          prop="id"
          label="编号">
          </el-table-column>
          <el-table-column
          prop="carNo"
            label="车牌号">
          </el-table-column>
          <el-table-column
          prop="carLicenseNo"
          label="车牌识别号">
          </el-table-column>
          <el-table-column
          prop="rfid"
            label="RFID是否激活">
            </el-table-column>
            <el-table-column
            prop="parkType"
            label="停车类型">
            </el-table-column>
            <el-table-column
            prop="carType"
              label="车辆类型">
            </el-table-column>
            <el-table-column
            prop="carColor"
            label="车辆颜色">
            </el-table-column>
            <el-table-column
            prop="carBrand"
              label="车辆品牌">
            </el-table-column>
            <el-table-column
            prop="rfidInstall"
            label="装卡状态">
            </el-table-column>
            <el-table-column
            prop="note"
              label="备注">
            </el-table-column>

          <el-table-column label="操作" width="100px">
            <template slot-scope="scope">
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
        title="修改车辆信息"
        :visible.sync="dialogVisible1"
        width="500px"
        :before-close="handleClose">
         <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
           <el-form-item label="车牌号" prop="name" label-width="150px">
             <el-input v-model="ruleForm.carNo"></el-input>
           </el-form-item>
           <el-form-item label="车辆识别号" prop="name" label-width="150px">
             <el-input v-model="ruleForm.carLicenseNo"></el-input>
           </el-form-item>
           <el-form-item label="RFID号" prop="name" label-width="150px">
             <el-input v-model="ruleForm.rfid"></el-input>
           </el-form-item>
           <el-form-item label="RFID是否激活" prop="region" label-width="150px">
             <el-select v-model="ruleForm.rfidActive" placeholder="请选择是否激活">
               <el-option label="已激活" value="T"></el-option>
               <el-option label="未激活" value="2"></el-option>
             </el-select>
           </el-form-item>
           <el-form-item label="车辆类型" prop="region" label-width="150px">
             <el-select v-model="ruleForm.parkType" placeholder="请选择车辆类型">
               <el-option label="轿车" value="1"></el-option>
               <el-option label="中型以上货车" value="2"></el-option>
               <el-option label="大型客车" value="3"></el-option>
               <el-option label="中小型客车" value="4"></el-option>
               <el-option label="轻微型客车" value="5"></el-option>
               <el-option label="机动三轮车" value="6"></el-option>
               <el-option label="摩托车" value="7"></el-option>
               <el-option label="免费" value="8"></el-option>
             </el-select>
           </el-form-item>
           <el-form-item label="车辆颜色" prop="region" label-width="150px">
             <el-select v-model="ruleForm.carColor" placeholder="请选择车辆颜色">
               <el-option label="红色" value="1"></el-option>
               <el-option label="蓝色" value="2"></el-option>
               <el-option label="绿色" value="3"></el-option>
               <el-option label="银色" value="4"></el-option>
               <el-option label="黑色" value="5"></el-option>
             </el-select>
           </el-form-item>
           <el-form-item label="车辆品牌" prop="region" label-width="150px">
             <el-select v-model="ruleForm.carBrand" placeholder="请选择车辆品牌">
               <el-option label="大众" value="1"></el-option>
               <el-option label="本田" value="2"></el-option>
               <el-option label="丰田" value="3"></el-option>
             </el-select>
           </el-form-item>
           <el-form-item label="装卡状态" prop="name" label-width="150px">
             <el-input v-model="ruleForm.monthlyStatus"></el-input>
           </el-form-item>
           <el-form-item label="备注" prop="name" label-width="150px">
             <el-input v-model="ruleForm.note"></el-input>
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
        ruleForm:{
        },
        multipleSelection:'',
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
      handleSelectionChange(val){
        // console.log(val);
         //this.multipleSelection = val;
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
        _this.$axios.get(Car.carList, formData)
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
