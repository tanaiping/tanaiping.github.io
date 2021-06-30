<template>
  <div class="menu">
    <el-menu
          :default-active="this.$route.path"
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
            name:"首页",
            url:"/index"
          },
          {
            name:"停车网点管理",
            url:"/netManagent",
            child:[
              {
                name:"停车网点",
                url:"/netManagent/parkNet",
              },
              {
                name:"泊位管理",
                url:"/netManagent/placeM",
              }
            ]
          },
          {
            name:"车辆管理",
            url:"/car",
            child:[
              {
                name:"车辆列表",
                url:"/car/carList",
              },
              {
                name:"车辆装卡",
                url:"/car/carInfo",
              },
              {
                name:"车辆人员审核",
                url:'/car/personVerify'
              },
              {
                name:"车辆人员复核",
                url:'/car/personVerify2'
              },
              {
                name:"申请标签",
                url:'/car/applyLabel'
              },
              {
                name:"装卡记录",
                url:'/car/record'
              },
            ]
          },
          {
            name:"停车收费管理",
            url:"/charge",
            child:[
              {
                name:"自助包月设置",
                url:"/charge/setting",
              },
              {
                name:"车辆包月续费",
                url:"/charge/monthly",
              },
              {
                name:"业务办理查询",
                url:'/charge/monthlyRegister'
              },
              {
                name:"包月转账确认",
                url:'/charge/transfer'
              },
              {
                name:"泊车订单管理",
                url:'/charge/orderManager'
              }
            ]
          },
          {
            name:"查询统计",
            url:"/statistics",
            child:[
              {
                name:"停车明细查询",
                url:"/statistics/parkingDetailStatistics",
              },
              {
                name:"场内车辆看板",
                url:"/statistics/parkingCarStatistics",
              },
              {
                name:"包月车辆看板",
                url:'/statistics/monthCarStatistics'
              },
              {
                name:"停车流量统计",
                url:'/statistics/statstic'
              },
              {
                name:"事件明细查询",
                url:'/statistics/parkingEventStatistics'
              },
              {
                name:"网点周转率统计",
                url:"/statistics/parkingLotLoadRateStatistics",
              },
              {
                name:"收入汇总报表",
                url:"/statistics/incomeTotal",
              },
              {
                name:"泊位负载率统计",
                url:'/statistics/parkingLotLoadFactorStatistics'
              },
              {
                name:"泊车订单统计",
                url:'/statistics/orderSum'
              },
              {
                name:"泊车支付查询",
                url:'/statistics/orderPay'
              }
            ]
          },
          {
            name:"设备管理",
            url:"/device",
            child:[
              {
                name:"设备列表",
                url:"/device/device",
              },
              {
                name:"pda管理",
                url:"/device/pda",
              }
            ]
          },
          {
            name:"费用管理",
            url:"/fee",
            child:[
              {
                name:"计费规则维护",
                url:"/fee/feeRuleGroup",
              }
            ]
          },
        ]
      };
    },
    components:{
      MenuItem,
    },
    methods: {
    }
  }
</script>

<style scoped>

</style>
