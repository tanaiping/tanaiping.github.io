<template>
  <div class="content">
    <div class="flex-search">
        <el-select v-model="value1" placeholder="请选择片区" class="mr10">
            <el-option label="老政务中心" value="1"></el-option>
            <el-option label="竹苑小区" value="2"></el-option>
            <el-option label="商业街" value="3"></el-option>
            <el-option label="南屏咯" value="4"></el-option>
        </el-select>
        <el-select v-model="value2" placeholder="请选择网点" class="mr10">
            <el-option label="县府路" value="1"></el-option>
            <el-option label="南屏西苑" value="2"></el-option>
        </el-select>
        <el-input v-model="name1" placeholder="请输入车牌号" class="filter-input mr10"></el-input>
        <el-input v-model="name2" placeholder="请输入泊位号" class="filter-input mr10"></el-input>
        <el-select v-model="value3" placeholder="请选择支付方式" class="mr10">
            <el-option label="微信" value="1"></el-option>
            <el-option label="支付宝" value="2"></el-option>
            <el-option label="现金" value="3"></el-option>
            <el-option label="转账" value="4"></el-option>
            <el-option label="优惠券" value="5"></el-option>
        </el-select>
        <el-select v-model="value4" placeholder="请选择是否退款" class="mr10">
            <el-option label="否" value="1"></el-option>
            <el-option label="是" value="2"></el-option>
        </el-select>
        <el-date-picker
              v-model="date1"
              type="datetimerange"
              range-separator="至"
              start-placeholder="支付开始日期"
              end-placeholder="支付结束日期" class="mr10">
            </el-date-picker>
        <el-button  icon="el-icon-refresh">重置</el-button>
        <el-button type="primary"  icon="el-icon-search">搜索</el-button>
        <el-button  icon="el-icon-download">导出</el-button>
    </div>
    <!-- 过虑条件  end-->
    <!-- 标题  end-->
    <div class="mt20">
      <el-table
          :data="contentData"
          stripe
          style="width: 100%">
          <el-table-column
          label="序号">
          <template slot-scope="scope">
            {{ scope.$index+1}}
          </template>
          </el-table-column>
          <el-table-column
          prop="orderId"
            label="订单编号">
          </el-table-column>
            <el-table-column
            prop="carNo"
              label="车牌号码">
            </el-table-column>
            <el-table-column
            prop="parkingLotName"
            label="网点">
            </el-table-column>
            <el-table-column
                prop="spaceCode"
                  label="泊位号">
            </el-table-column>
            <el-table-column
                prop="payAmount"
                  label="付款金额">
            </el-table-column>
            <el-table-column
                prop="fee"
                  label="手续费">
            </el-table-column>
            <el-table-column
                prop="payOrderNum"
                  label="付款方式">
            </el-table-column>
            <el-table-column
                prop="payTime"
                  label="付款时间">
            </el-table-column>
            <el-table-column
                prop="remark"
                  label="备注">
            </el-table-column>
            <el-table-column label="操作" width="100px">
              -
              <!-- <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handleEdit(scope.$index, scope.row)" >二维码</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)">修改</el-button>
              </template> -->
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
    import {Statistics} from '@/config/url'
import Page from '@/components/page'
  export default{
    components:{
      Page,
    },
    data(){
      return{
        name1:'',
        name2:'',
        value1:'',
        value2:'',
        value3:'',
        value4:'',
        date1:'',
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
        getListData() {
          const _this = this
          const formData = {}
          _this.$axios.get(Statistics.orderPay, formData)
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
