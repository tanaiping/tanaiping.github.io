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
             <el-menu-item index="/ad/list">列表</el-menu-item>
              <el-menu-item index="/ad/add">新增</el-menu-item>
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
            url:"/priceList",
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
            url:"/userList",
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
      this.defaultActive = this.$route.path
    },
    methods: {
    }
  }
</script>

<style scoped>

</style>
