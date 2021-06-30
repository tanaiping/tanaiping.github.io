import Vue from 'vue'
import Router from 'vue-router'

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
Vue.use(Router)

const routes = [
    {
      path: '/',
      redirect: '/login',
    },
    {
      name: 'login',
      path: '/login',
      meta:{
        title:'登录'
      },
      component: () => import('@/views/login')
    },
    {
      name: 'home',
      path: '/home',
      redirect: '/index',
      meta:{
        title:'首页'
      },
      component: () => import('@/views/home'),
      children:[
        {
          name: 'index',
          path: '/index',
          meta:{
            title:'首页'
          },
          component: () => import('@/views/index/index'),
        },
        {
          name: 'netIndex',
          path: '/netManagent/index',
          redirect: '/netManagent/parkNet',
          meta:{
            title:'停车网点管理'
          },
          component: () => import('@/views/netManagent/index'),
          children:[
            {
              name: 'parkNet',
              path: '/netManagent/parkNet',
              meta:{
                title:'停车网点'
              },
              component: () => import('@/views/netManagent/parkNet')
            },
            {
              name: 'contentLabel',
              path: '/netManagent/placeM',
              meta:{
                title:'泊位管理'
              },
              component: () => import('@/views/netManagent/placeM')
            }
          ]
        },
        {
          name: 'carIndex',
          path: '/car/index',
          redirect: '/car/carList',
          meta:{
            title:'车辆管理'
          },
          component: () => import('@/views/car/index'),
          children:[
            {
              name: 'carList',
              path: '/car/carList',
              meta:{
                title:'车辆列表'
              },
              component: () => import('@/views/car/carList')
            },
            {
              name: 'carInfo',
              path: '/car/carInfo',
              meta:{
                title:'车辆装卡'
              },
              component: () => import('@/views/car/carInfo')
            },
            {
              name: 'personVerify',
              path: '/car/personVerify',
              meta:{
                title:'车辆人员审核'
              },
              component: () => import('@/views/car/personVerify')
            },
            {
              name: 'applyLabel',
              path: '/car/applyLabel',
              meta:{
                title:'申请标签'
              },
              component: () => import('@/views/car/applyLabel')
            },
            {
              name: 'personVerify2',
              path: '/car/personVerify2',
              meta:{
                title:'车辆人员复核'
              },
              component: () => import('@/views/car/personVerify2')
            },
            {
              name: 'record',
              path: '/car/record',
              meta:{
                title:'装卡记录'
              },
              component: () => import('@/views/car/record')
            },
          ]
        },
        {
          name: 'chargeIndex',
          path: '/charge/index',
          redirect: '/charge/setting',
          meta:{
            title:'停车收费管理'
          },
          component: () => import('@/views/charge/index'),
          children:[
            {
              name: 'setting',
              path: '/charge/setting',
              meta:{
                title:'自助包月设置'
              },
              component: () => import('@/views/charge/setting')
            },
            {
              name: 'monthly',
              path: '/charge/monthly',
              meta:{
                title:'车辆包月续费'
              },
              component: () => import('@/views/charge/monthly')
            },
            {
              name: 'monthlyRegister',
              path: '/charge/monthlyRegister',
              meta:{
                title:'业务办理查询'
              },
              component: () => import('@/views/charge/monthlyRegister')
            },
            {
              name: 'transfer',
              path: '/charge/transfer',
              meta:{
                title:'包月转账确认'
              },
              component: () => import('@/views/charge/transfer')
            },
            {
              name: 'orderManager',
              path: '/charge/orderManager',
              meta:{
                title:'泊车订单管理'
              },
              component: () => import('@/views/charge/orderManager')
            }
          ]
        },
        {
          name: 'statisticsIndex',
          path: '/statistics/index',
          redirect: '/statistics/parkingDetailStatistics',
          meta:{
            title:'查询统计'
          },
          component: () => import('@/views/statistics/index'),
          children:[
            {
              name: 'parkingDetailStatistics',
              path: '/statistics/parkingDetailStatistics',
              meta:{
                title:'停车明细查询'
              },
              component: () => import('@/views/statistics/parkingDetailStatistics')
            },
            {
              name: 'parkingCarStatistics',
              path: '/statistics/parkingCarStatistics',
              meta:{
                title:'场内车辆看板'
              },
              component: () => import('@/views/statistics/parkingCarStatistics')
            },
            {
              name: 'monthCarStatistics',
              path: '/statistics/monthCarStatistics',
              meta:{
                title:'包月车辆看板'
              },
              component: () => import('@/views/statistics/monthCarStatistics')
            },
            {
              name: 'statstic',
              path: '/statistics/statstic',
              meta:{
                title:'停车流量统计'
              },
              component: () => import('@/views/statistics/statstic')
            },
            {
              name: 'parkingEventStatistics',
              path: '/statistics/parkingEventStatistics',
              meta:{
                title:'事件明细查询'
              },
              component: () => import('@/views/statistics/parkingEventStatistics')
            },

            {
              name: 'parkingLotLoadRateStatistics',
              path: '/statistics/parkingLotLoadRateStatistics',
              meta:{
                title:'网点周转率统计'
              },
              component: () => import('@/views/statistics/parkingLotLoadRateStatistics')
            },
            {
              name: 'incomeTotal',
              path: '/statistics/incomeTotal',
              meta:{
                title:'收入汇总报表'
              },
              component: () => import('@/views/statistics/incomeTotal')
            },
            {
              name: 'parkingLotLoadFactorStatistics',
              path: '/statistics/parkingLotLoadFactorStatistics',
              meta:{
                title:'泊位负载率统计'
              },
              component: () => import('@/views/statistics/parkingLotLoadFactorStatistics')
            },
            {
              name: 'orderSum',
              path: '/statistics/orderSum',
              meta:{
                title:'泊车订单统计'
              },
              component: () => import('@/views/statistics/orderSum')
            },
            {
              name: 'orderPay',
              path: '/statistics/orderPay',
              meta:{
                title:'泊车支付查询'
              },
              component: () => import('@/views/statistics/orderPay')
            }
          ]
        },
        {
          name: 'deviceIndex',
          path: '/device/index',
          redirect: '/device/device',
          meta:{
            title:'设备管理'
          },
          component: () => import('@/views/device/index'),
          children:[
            {
              name: 'device',
              path: '/device/device',
              meta:{
                title:'设备列表'
              },
              component: () => import('@/views/device/device')
            },
            {
              name: 'pda',
              path: '/device/pda',
              meta:{
                title:'pda管理'
              },
              component: () => import('@/views/device/pda')
            }
          ]
        },
        {
          name: 'feeIndex',
          path: '/fee/index',
          redirect: '/fee/feeRuleGroup',
          meta:{
            title:'费用管理'
          },
          component: () => import('@/views/fee/index'),
          children:[
            {
              name: 'feeRuleGroup',
              path: '/fee/feeRuleGroup',
              meta:{
                title:'计费规则维护'
              },
              component: () => import('@/views/fee/feeRuleGroup')
            }
          ]
        },
      ]
    }

  ]

const router = new Router({
  routes,
})

router.beforeEach((to, from, next) => {
const title = to.meta && to.meta.title;
  if (title) {
    document.title = title;
  }
  if(to.path ==='/login'){
      next();
  }else {
    let token = localStorage.getItem('userName');
    if(token === null || token === ''){
      document.title = '登录';
      next('/login');
    }else {
      next();
    }
  }

});

export default router
