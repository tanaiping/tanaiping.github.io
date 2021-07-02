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
      path: '*',
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
      redirect: '/station',
      meta:{
        title:'首页'
      },
      component: () => import('@/views/home'),
      children:[
        {
          name: 'station',
          path: '/station',
          redirect: '/stationList',
          meta:{
            title:'油站管理'
          },
          component: () => import('@/views/station/index'),
          children:[
            {
              name: 'stationList',
              path: '/stationList',
              meta:{
                title:'油站管理'
              },
              component: () => import('@/views/station/stationList')
            },
            {
              name: 'stationDetail',
              path: '/stationDetail',
              meta:{
                title:'油站详情'
              },
              component: () => import('@/views/station/stationDetail')
            }
          ]
        },
        {
          name: 'price',
          path: '/price',
          redirect: '/priceList',
          meta:{
            title:'价格管理'
          },
          component: () => import('@/views/price/index'),
          children:[
            {
              name: 'priceList',
              path: '/priceList',
              meta:{
                title:'价格管理'
              },
              component: () => import('@/views/price/priceList')
            },
            {
              name: 'changePriceSingle',
              path: '/changePriceSingle',
              meta:{
                title:'修改售价'
              },
              component: () => import('@/views/price/changePriceSingle')
            },
            {
              name: 'changePriceMul',
              path: '/changePriceMul',
              meta:{
                title:'批量改价'
              },
              component: () => import('@/views/price/changePriceMul')
            }
          ]
        },
        {
          name: 'order',
          path: '/order',
          redirect: '/orderList',
          meta:{
            title:'订单管理'
          },
          component: () => import('@/views/order/index'),
          children:[
            {
              name: 'orderList',
              path: '/orderList',
              meta:{
                title:'订单管理'
              },
              component: () => import('@/views/order/orderList')
            },
            {
              name: 'orderDetail',
              path: '/orderDetail',
              meta:{
                title:'订单详情'
              },
              component: () => import('@/views/order/orderDetail')
            }
          ]
        },
        {
          name: 'statistics',
          path: '/statistics',
          redirect: '/statisticsList',
          meta:{
            title:'数据统计'
          },
          component: () => import('@/views/statistics/index'),
          children:[
            {
              name: 'statisticsList',
              path: '/statisticsList',
              meta:{
                title:'数据统计'
              },
              component: () => import('@/views/statistics/statisticsList')
            },
          ]
        },
        {
          name: 'user',
          path: '/user',
          redirect: '/userList',
          meta:{
            title:'用户管理'
          },
          component: () => import('@/views/user/index'),
          children:[
            {
              name: 'userList',
              path: '/userList',
              meta:{
                title:'用户管理'
              },
              component: () => import('@/views/user/userList')
            },
          ]
        },
        {
          name: 'sys',
          path: '/sys',
          redirect: '/employerList',
          meta:{
            title:'系统管理'
          },
          component: () => import('@/views/sys/index'),
          children:[
            {
              name: 'employerList',
              path: '/employerList',
              meta:{
                title:'员工管理'
              },
              component: () => import('@/views/sys/employerList')
            },
            {
              name: 'addEmployer',
              path: '/addEmployer',
              meta:{
                title:'员工管理'
              },
              component: () => import('@/views/sys/addEmployer')
            },
            {
              name: 'editEmployer',
              path: '/editEmployer',
              meta:{
                title:'员工管理'
              },
              component: () => import('@/views/sys/editEmployer')
            }
          ]
        }
      ]
    }

  ]

const router = new Router({
  base: '/oilCms/', //配置base属性，声明路由根目录
  mode: 'history',
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
    let token = localStorage.getItem('token');
    if(token === null || token === ''){
      document.title = '登录';
      next('/login');
    }else {
      next();
    }
  }

});

export default router
