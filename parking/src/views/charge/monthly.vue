<template>
  <div class="content">
    <div class="flex">
        <el-input v-model="name" placeholder="请输入车牌号" class="filter-input mr10"></el-input>
        <el-select v-model="value1" placeholder="请选择网点" class="mr10">
            <el-option label="县政府停车场" value="1"></el-option>
            <el-option label="江安会客厅" value="2"></el-option>
        </el-select>
        <el-input v-model="name2" placeholder="请输入泊位号" class="filter-input mr10"></el-input>
         <el-checkbox-group v-model="type" style="line-height: 40px;margin-right: 10px;">
              <el-checkbox label="包月有效期内" name="type">
              </el-checkbox>
        </el-checkbox-group>
        <el-button  icon="el-icon-refresh">重置</el-button>
        <el-button type="primary"  icon="el-icon-search">搜索</el-button>
    </div>
    <!-- 过虑条件  end-->
    <div class="flex" style="padding: 20px 0;">
      <el-button  type="primary" icon="el-icon-plus" @click="add">包月登记</el-button>
    </div>
    <!-- 标题  end-->
    <div>
      <el-table
          :data="contentData"
          stripe
           :row-key='getRowKey'
         type="selection"
         style="width: 100%">
         <el-table-column type="selection"  :reserve-selection="true" width="55"> </el-table-column>
          <el-table-column
          prop="id"
          label="序号">
          </el-table-column>
          <el-table-column
          prop="carNo"
            label="车牌号码">
          </el-table-column>
          <el-table-column
          prop="rfid"
            label="RFID卡号">
          </el-table-column>
          <el-table-column
          prop="parkingLotName"
          label="包月网点">
          </el-table-column>
          <el-table-column
              prop="parkingSpaceCode"
                label="包月泊位">
          </el-table-column>
          <el-table-column
              prop="dateFrom"
                label="有效期起">
          </el-table-column>
          <el-table-column
              prop="dateTo"
                label="有效期止">
          </el-table-column>
          <el-table-column
              prop="shareCars"
                label="共享车辆">
          </el-table-column>
          <el-table-column
              prop="status"
                label="状态">
          </el-table-column>
          <el-table-column
              prop="phoneNum"
                label="联系电话">
          </el-table-column>
          <el-table-column label="操作" width="360px">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)" >包月续费</el-button>
              <el-button
                size="mini"
                @click="handleEdit2(scope.$index, scope.row)" >添加包月共享车辆</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDel(scope.$index, scope.row)">终止包月</el-button>
            </template>
          </el-table-column>
        </el-table>
    </div>

      <!-- 表格  end-->
      <div class="page">
          <Page :pageSize="pageSize" :cur="curPage" :total="total" @pageChange="changeCurPage"/>
       </div>

       <el-dialog
         title="车辆包月登记"
         :visible.sync="dialogVisible1"
         width="750px"
         :before-close="handleClose">
         <div class="flex">
           <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
             <el-form-item label="车牌号"  label-width="100px">
              <el-input v-model="ruleForm.carNo"></el-input>
              </el-form-item>
              <el-form-item label="RFID号"  label-width="100px">
               <el-input v-model="ruleForm.rfid" disabled></el-input>
               </el-form-item>
              <el-form-item label="包月月数"  label-width="100px">
               <el-input v-model="ruleForm.total"></el-input>
               </el-form-item>
              <el-form-item label="包月日期"  label-width="100px">
               <el-date-picker
                 v-model="value1"
                 type="date"
                 placeholder="选择日期">
               </el-date-picker>
              </el-form-item>
             <el-form-item label="网点" label-width="100px">
               <el-select v-model="ruleForm.type" placeholder="请选择网点">
                 <el-option label="县政府" value="1"></el-option>
                 <el-option label="南屏西苑" value="2"></el-option>
                 <el-option label="市民中心" value="3"></el-option>
               </el-select>
             </el-form-item>
              <el-form-item label="收费金额"  label-width="100px">
               <el-input v-model="ruleForm.total"></el-input>
               </el-form-item>
           </el-form>
           <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
             <el-form-item label="行驶证"  label-width="100px">
               <div style="background: #999; width: 200px;height: 164px;"></div>
             </el-form-item>
              <el-form-item label="至"  label-width="100px">
               <el-date-picker
                 v-model="value1"
                 type="date"
                 placeholder="选择日期">
               </el-date-picker>
              </el-form-item>
              <el-form-item label="泊位"  label-width="100px">
                <el-select v-model="ruleForm.type" placeholder="请选择泊位">
                  <el-option label="无数据" value="1"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="电话"  label-width="100px">
               <el-input v-model="ruleForm.total"></el-input>
               </el-form-item>
           </el-form>
         </div>
         <span slot="footer" class="dialog-footer">
           <el-button type="primary" @click="dialogVisible1 = false">保存</el-button>
           <el-button type="primary" disabled>现金支付</el-button>
           <el-button type="primary" disabled>扫码支付</el-button>
           <el-button type="primary" disabled>转账支付</el-button>
           <el-button type="primary" disabled>打印单据</el-button>
           <el-button @click="dialogVisible1 = false">取 消</el-button>
         </span>
       </el-dialog>

       <el-dialog
         title="包月续费"
         :visible.sync="dialogVisible4"
         width="750px"
         :before-close="handleClose">
         <div class="flex">
           <el-form :model="ruleForm2" ref="ruleForm" label-width="120px" class="demo-ruleForm">
             <el-form-item label="车牌号" >
              <el-input v-model="ruleForm2.carNo"></el-input>
              </el-form-item>
              <el-form-item label="当前包月日期" >
               <el-input v-model="ruleForm2.dateFrom"></el-input>
               </el-form-item>
              <el-form-item label="网点" >
               <el-input v-model="ruleForm2.parkingLotName"></el-input>
               </el-form-item>
               <el-form-item label="包月月数(个月)" >
                <el-input v-model="ruleForm2.num"></el-input>
                </el-form-item>
              <el-form-item label=" 包月日期">
               <el-date-picker
                 v-model="ruleForm2.dateTo"
                 type="date"
                 placeholder="选择日期">
               </el-date-picker>
              </el-form-item>
              <el-form-item label="收费金额">
               <el-input v-model="ruleForm2.money"></el-input>
               </el-form-item>
           </el-form>
           <el-form :model="ruleForm2" ref="ruleForm" label-width="120px" class="demo-ruleForm">
             <el-form-item label="RFID卡号" >
              <el-input v-model="ruleForm2.rfid"></el-input>
              </el-form-item>
              <el-form-item label="至" >
               <el-date-picker
                 v-model="ruleForm2.dateFrom"
                 type="date"
                 placeholder="选择日期">
               </el-date-picker>
              </el-form-item>
              <el-form-item label="泊位">
                <el-input v-model="ruleForm2.parkingSpaceCode" disabled></el-input>
              </el-form-item>
              <el-form-item style="height:40px" >
              </el-form-item>
              <el-form-item label="至" >
               <el-date-picker
                 v-model="ruleForm2.dateTo"
                 type="date"
                 placeholder="选择日期">
               </el-date-picker>
              </el-form-item>
              <el-form-item label="联系电话" >
               <el-input v-model="ruleForm2.phoneNum"></el-input>
               </el-form-item>
           </el-form>
         </div>
         <span slot="footer" class="dialog-footer">
           <el-button type="primary" @click="dialogVisible4 = false">保存</el-button>
           <el-button type="primary" disabled>现金支付</el-button>
           <el-button type="primary" disabled>扫码支付</el-button>
           <el-button type="primary" disabled>转账支付</el-button>
           <el-button type="primary" disabled>打印单据</el-button>
           <el-button @click="dialogVisible4 = false">取 消</el-button>
         </span>
       </el-dialog>

       <el-dialog
         title="添加包月共享车辆"
         :visible.sync="dialogVisible2"
         width="600px"
         :before-close="handleClose">
         <el-form :model="ruleForm3" ref="ruleForm" label-width="100px" class="demo-ruleForm">
           <el-form-item label="车牌号" >
            <el-input v-model="ruleForm3.carNo" disabled></el-input>
            </el-form-item>
            <el-form-item label="当前包月日期" >
              <el-col :span="11">
                  <el-input v-model="ruleForm3.dateFrom" disabled></el-input>
               </el-col>
               <el-col class="line" :span="2">-</el-col>
               <el-col :span="11">
                  <el-input v-model="ruleForm3.dateTo" disabled></el-input>
               </el-col>
             </el-form-item>
            <el-form-item label="泊位">
              <el-col :span="11">
                  <el-input v-model="ruleForm3.parkingLotName" disabled></el-input>
               </el-col>
               <el-col class="line" :span="2">-</el-col>
               <el-col :span="11">
                  <el-input v-model="ruleForm3.parkingSpaceCode" disabled></el-input>
               </el-col>
             </el-form-item>
            <el-form-item label="联系电话">
             <el-input v-model="ruleForm3.phoneNum" disabled></el-input>
             </el-form-item>
            <el-form-item label="当前共享车辆">
            </el-form-item>
           <el-form-item label="共享车辆">
             <el-input v-model="ruleForm3.shareCars" style="width: 180px;"></el-input>
             <el-button>添加</el-button>
           </el-form-item>
         </el-form>
         <span slot="footer" class="dialog-footer">
           <el-button type="primary" @click="dialogVisible2 = false">保存</el-button>
           <el-button type="primary" disabled>打印单据</el-button>
           <el-button @click="dialogVisible2 = false">取 消</el-button>
         </span>
       </el-dialog>

  <el-dialog
    title="添加终止包月"
    :visible.sync="dialogVisible3"
    width="80%"
    :before-close="handleClose">
    <el-form :model="monthData" ref="ruleForm" :inline='true' label-width="130px" class="demo-form-inline">
      <div class="car-no"></div>
      <div class="tab-title">包月信息</div>
      <el-form-item label="有效期起" >
          <el-input v-model="monthData.st1" disabled></el-input>
       </el-form-item>
       <el-form-item label="有效期止" >
           <el-input v-model="monthData.st2" disabled></el-input>
       </el-form-item>
      <el-form-item label="网点泊位" >
          <el-input v-model="monthData.place" disabled></el-input>
       </el-form-item>
       <el-form-item label="金额" >
           <el-input v-model="monthData.money" disabled></el-input>
      </el-form-item>
       <div class="tab-title">支付信息</div>
       <el-table
           :data="monthData.payList"
           stripe
          type="selection"
          style="width: 100%">
          <el-table-column type="selection"  :reserve-selection="true" width="55"> </el-table-column>
           <el-table-column
           prop="no"
           label="编号">
           </el-table-column>
           <el-table-column
           prop="pay1"
             label="金额(元)">
           </el-table-column>
           <el-table-column
           prop="pay2"
             label="手续费(元)">
           </el-table-column>
           <el-table-column
           prop="type"
           label="支付方式">
           </el-table-column>
           <el-table-column
               prop="status"
                 label="支付状态">
           </el-table-column>
           <el-table-column
               prop="payTime"
                 label="支付时间">
           </el-table-column>
           <el-table-column
               prop="payNo"
                 label="支付业务单号">
           </el-table-column>
           <el-table-column
               prop="desc"
                 label="备注">
           </el-table-column>
         </el-table>
        <div class="tab-title">退款信息</div>
       <el-form-item label="修改后有效期起" >
           <el-date-picker
                 v-model="monthData.st1"
                 type="date"
                 placeholder="选择日期">
               </el-date-picker>
        </el-form-item>
        <el-form-item label="修改后有效期止" >
            <el-date-picker
                  v-model="monthData.st2"
                  type="date"
                  placeholder="选择日期">
                </el-date-picker>
        </el-form-item>
        <el-form-item label="退款金额" >
            <el-input v-model="monthData.money" ></el-input>
       </el-form-item>
       <el-form-item label="备注" >
           <el-input type="textarea" v-model="monthData.desc"></el-input>
        </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogVisible3 = false">终止包月</el-button>
      <el-button @click="dialogVisible3 = false">取 消</el-button>
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
        name:'',
        name2:'',
        value1:'',
        value2:'',
        type:'',
        dialogVisible1: false,
        dialogVisible2: false,
        dialogVisible3: false,
        dialogVisible4:false,
       contentData: [],
       "pageSize":10,
       curPage:1,
       total:0,
        ruleForm:{},
        ruleForm2:{},
        ruleForm3:{},
        monthData:{
          carInfo:'川QA957X',
          st1:'2021-05-25',
          st2:'2021-07-24',
          place:'南屏西苑302',
          money:'300',
          desc:'',
          payList:[{
            no:'1',
            pay1:'200',
            pay2:'1.2',
            type:'微信',
            status:'已支付',
            payTime:'2021-05-24 14:47:23',
            payNo:'74e872ac8bad40689b59c9502c6e1c0e'
          }]

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
      handleEdit(index, row) {
        console.log(index, row);
        const _this = this;
        _this.contentData.forEach(function(item,index){
          if(item.id == row.id){
            _this.ruleForm2 = item;
          }
        })
        _this.dialogVisible4 = true
      },
      handleEdit2(index, row) {
        console.log(index, row);
        const _this = this;
        _this.contentData.forEach(function(item,index){
          if(item.id == row.id){
            _this.ruleForm3 = item;
          }
        })
        _this.dialogVisible2 = true
      },
      handleDel(index, row) {
        console.log(index, row);
        const _this = this;
        _this.contentData.forEach(function(item,index){
          if(item.id == row.id){
            _this.ruleForm = item;
          }
        })
        this.dialogVisible3 = true
      },

      handleClose(done) {
        done();
          // this.$confirm('确认关闭？')
          //   .then(_ => {
          //     done();
          //   })
          //   .catch(_ => {});
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
          _this.$axios.get(Charge.monthly, formData)
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
  .line{text-align: center;}
  .car-no{
    text-align: center;
    font-size: 24px;
    line-height: 40px;
  }
  .tab-title{
    border-bottom: 1px solid #ccc;
    margin: 10px 0;
    padding: 3px 0;
  }
</style>
