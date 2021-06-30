<template>
  <div class="content">
    <div class="flex">
        <el-select v-model="place2" placeholder="请选择网点" class="mr10">
            <el-option label="市民中心" value="1"></el-option>
            <el-option label="县府路" value="2"></el-option>
            <el-option label="睡佛寺" value="3"></el-option>
        </el-select>
        <el-date-picker
              v-model="value1"
              type="date"
              placeholder="日期" class="mr10">
            </el-date-picker>
        <el-select v-model="place1" placeholder="请选择包月状态" class="mr10">
            <el-option label="空闲" value="1"></el-option>
            <el-option label="已包月" value="2"></el-option>
        </el-select>
        <el-select v-model="status" placeholder="请选择挂牌状态" class="mr10">
            <el-option label="已挂牌" value="1"></el-option>
            <el-option label="未挂牌" value="2"></el-option>
        </el-select>
        <el-input v-model="name1" placeholder="请输入泊位编号" class="filter-input mr10"></el-input>
        <el-input v-model="name2" placeholder="请输入车牌号码" class="filter-input mr10"></el-input>
        <el-button  icon="el-icon-refresh">重置</el-button>
        <el-button type="primary"  icon="el-icon-search">搜索</el-button>
        <el-button type="warning" icon="el-icon-download" disabled>导出</el-button>
    </div>
    <!-- 过虑条件  end-->
    <!-- 标题  end-->
    <div class="mt20">
      <div class="card-flex">
        <div class="car-card" v-for="(item,i) in items">
          <div class="con">
            <el-card class="box-card" >
              <div slot="header" class="clearfix">
                <span  class="hascar">{{item.id}}</span>
              </div>
              <div class="info">
                <ul>
                 <li>车牌号码:{{item.carNo}}</li>
                 <li>有效期起:{{item.dateFrom}}</li>
                 <li>有效期止:{{item.dateTo}}</li>
                 <li>车主姓名:{{item.username}}</li>
                 <li>联系电话:{{item.phone}}</li>
                 <li>RFID卡号:{{item.rfid}}</li>
                 <li>是否挂牌:{{item.listed}}</li>
                </ul>
              </div>
            </el-card>
          </div>

        </div>

      </div>

        <div class="page">
            <Page :pageSize="pageSize" :cur="curPage" :total="total" @pageChange="changeCurPage"/>
         </div>
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
        place1:'',
        place2:'',
        name1:'',
        name2:'',
        status:'',
        value1:'',
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

      getListData() {
        const _this = this
        const formData = {}
        _this.$axios.get(Statistics.monthCarStatistics, formData)
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
