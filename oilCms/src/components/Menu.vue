<template>
  <div class="menu">
    <el-menu
          :default-active="defaultActive"
          router
          :unique-opened="true"
          class="el-menu-vertical-demo">

          <!-- <el-menu-item index="/welcome">
            <i class="el-icon-document"></i>
            <span slot="title">首页</span>
          </el-menu-item>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>广告</span>
            </template>
             <el-menu-item index="/ad/list"><span slot="title">首页</span></el-menu-item>
              <el-menu-item index="/ad/add"><span slot="title">首页</span></el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>数据</span>
            </template>
             <el-menu-item index="/data/business">商户数据</el-menu-item>
              <el-menu-item index="/data/manage">管理员数据</el-menu-item>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>报表</span>
            </template>
             <el-menu-item index="/statisc/busList">商户报表</el-menu-item>
              <el-menu-item index="/statisc/mList">管理员报表</el-menu-item>
          </el-submenu> -->




        <MenuItem v-for="v in items" :key = "v.url" :item="v" />
       </el-menu>
  </div>
</template>

<script>
  import MenuItem from '@/components/MenuItem'
  export default {
    data() {
      return {
        items:[
          {
            name:"油站管理",
            url:"/stationList",
          },
          {
            name:"价格管理",
            url:"2",
            child:[
              {
                name:"价格信息",
                url:"/priceList",
              },
              {
                name:"默认价格",
                url:"/priceUpdate",
              }
            ]
          },
          {
            name:"订单管理",
            url:"/orderList",
          },
          {
            name:"数据统计",
            url:"/statisticsList",
          },
          {
            name:"用户管理",
            url:"4",
            child:[
              {
                name:"用户信息",
                url:"/userList",
              },
              {
                name:"设备信息",
                url:"/deviceList",
              }
            ]
          },
          {
            name:"系统管理",
            url:"/employerList",
          },
        ],
        defaultActive:''
      };
    },
    components:{
      MenuItem,
    },
    created(){
      let path = this.$route.path;
      let sessionPath = sessionStorage.getItem('path');
      let isflag = false;
      for(let item of this.items){
        if(path == item.url) isflag = true;
      }
      if(!isflag){
        path = sessionPath;
      }
      this.defaultActive = path;

    },
    methods: {
    },
    watch:{
      $route: function (to, from) {
        const _this = this;
        if (to != from) {
            if(!to.query.isChangeMenu){
              if(to.meta.top){
                _this.defaultActive = to.path;
                sessionStorage.setItem("path", to.path);
              }else{
                _this.defaultActive = from.path;
                sessionStorage.setItem("path", from.path);
              }

            }else{
               _this.defaultActive = to.path;
               sessionStorage.setItem("path", to.path);
            }
        }
      }

    }
  }
</script>

<style scoped>

</style>
