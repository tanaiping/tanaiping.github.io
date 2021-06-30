<template>
  <div class="content">
    <div class="flex">
        <el-select v-model="place2" placeholder="请选择网点" class="mr10">
            <el-option label="市民中心" value="1"></el-option>
            <el-option label="县府路" value="2"></el-option>
            <el-option label="睡佛寺" value="3"></el-option>
        </el-select>
          <el-select v-model="place1" placeholder="请选择片区" class="mr10">
              <el-option label="南屏路北段(老政务中心)" value="1"></el-option>
              <el-option label="南屏路北段(南屏路)" value="2"></el-option>
              <el-option label="南屏路北段(竹苑小区)" value="3"></el-option>
          </el-select>
        <el-button  icon="el-icon-refresh">重置</el-button>
        <el-button type="primary"  icon="el-icon-search">搜索</el-button>
    </div>
    <!-- 过虑条件  end-->
    <!-- 标题  end-->
    <div class="mt20">
      <div class="card-flex">
        <div class="car-card" v-for="item in items">
          <div class="con">
            <el-card class="box-card" >
              <div slot="header" class="clearfix">
                <span  :class="!item.carNo?'nocar':'hascar'">{{!item.carNo?'空闲泊位':item.carNo}}</span>
                <el-button v-if="item.carNo" style="float: right; padding: 3px 0" type="text" @click="dialogVisible=true">进行标记离场</el-button>
              </div>
              <div class="info">
                <ul>
                  <li>停车类型:{{item.parkType}}</li>
                  <li>进入时间:{{item.enterTime}}</li>
                  <li>停车时长:{{item.parkingTime}}</li>
                  <li>泊位编号【{{item.parkingOrderId}}】</li>
                </ul>
              </div>
            </el-card>
          </div>
        </div>
      </div>

      <!-- 表格  end-->
      <div class="page">
          <Page :pageSize="pageSize" :cur="curPage" :total="total" @pageChange="changeCurPage"/>
       </div>
    </div>

    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="400px"
      :before-close="handleClose">
      此操作将该订单改为异常订单, 是否继续?
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
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
        place1:'',
        place2:'',
        dialogVisible: false,
        items:[],
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
      handleClose(done) {
        done();
          // this.$confirm('确认关闭？')
          //   .then(_ => {
          //     done();
          //   })
          //   .catch(_ => {});
        },
        getListData() {
          const _this = this
          const formData = {}
          _this.$axios.get(Statistics.parkingCarStatistics, formData)
            .then((res) => {
              console.log(res)
              if (res.data.code == 200) {
                this.total = res.data.total;
                console.log(res.data.rows);
                this.items = res.data.rows;
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
  .car-card{
    width: 25%;
  }
  .car-card .con{
    padding: 20px;
  }
  .nocar{
    background: #607d8b;
    color: #FFF;
    padding: 3px 15px;
    border-radius: 3px;
  }
  .hascar{
    background: #1240b8;
    color: #FFF;
    padding: 3px 15px;
    border-radius: 3px;
  }
  .card-flex{
    display: flex;
    flex-wrap: wrap;
  }
  .el-card__body{
    padding: 10px 20px;
  }
  .info ul{list-style-type:none;padding: 0;margin:0;}
  .info li{height: 30px;line-height: 30px; white-space: nowrap;overflow: hidden;text-overflow: ellipsis;}
</style>
