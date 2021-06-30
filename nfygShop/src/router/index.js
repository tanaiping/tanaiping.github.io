import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const routes = [{
    path: '*',
    redirect: '/home'
  },
  {
    name: 'home',
    path: '/home',
    component: () => import('../views/Home'),
    meta: {
      title: '首页',
      navType: '1',
      keepAlive: true
    }
  },
  {
    name: 'login',
    path: '/login',
    component: () => import('../views/MyHome/Login'),
    meta: {
      title: '登录',
      navType: '1'
    }
  },
  {
    name: 'couponpage',
    path: '/couponpage',
    component: () => import('../views/CouponPage'),
    meta: {
      title: '花生权益'
    }
  },
  {
    name: 'rightpage',
    path: '/rightpage',
    component: () => import('../views/RightPage'),
    meta: {
      title: '权益特惠'
    }
  },
  {
    name: 'rightpagemore',
    path: '/rightpagemore',
    component: () => import('../views/RightPageMore'),
    meta: {
      title: '权益列表'
    }
  },
  {
    name: 'special',
    path: '/special',
    component: () => import('../views/Special'),
    meta: {
      title: '花花专区'
    }
  },
  {
    name: 'detailgoods',
    path: '/detailgoods',
    component: () => import('../views/Detail/DetailGoods'),
    meta: {
      title: '商品详情',
      navType: '2'
    }
  },
  {
    name: 'detailright',
    path: '/detailright',
    component: () => import('../views/Detail/DetailRight'),
    meta: {
      title: '权益详情',
      navType: '2'
    }
  },
  {
    name: 'detailcoupon',
    path: '/detailcoupon',
    component: () => import('../views/Detail/DetailCoupon'),
    meta: {
      title: '权益详情',
      navType: '2'
    }
  },
  {
    name: 'detailcharge',
    path: '/detailcharge',
    component: () => import('../views/Detail/DetailCharge'),
    meta: {
      title: '直充详情',
      navType: '2'
    }
  },
  {
    name: 'ordercoupon',
    path: '/ordercoupon',
    component: () => import('../views/Order/OrderCoupon'),
    meta: {
      title: '填写订单'
    }
  },
  {
    name: 'ordercharge',
    path: '/ordercharge',
    component: () => import('../views/Order/OrderCharge'),
    meta: {
      title: '确认订单'
    }
  },
  {
    name: 'chargelist',
    path: '/chargelist',
    component: () => import('../views/ChargeList'),
    meta: {
      title: '直充品牌列表'
    }
  },
  {
    name: 'orderright',
    path: '/orderright',
    component: () => import('../views/Order/OrderRight'),
    meta: {
      title: '填写订单'
    }
  },
  {
    name: 'ordergoods',
    path: '/ordergoods',
    component: () => import('../views/Order/OrderGoods'),
    meta: {
      title: '填写订单'
    }
  },
  {
    name: 'addressedit',
    path: '/addressedit',
    component: () => import('../views/AddressEdit'),
    meta: {
      title: '新建地址'
    }
  },
  {
    name: 'addresslist',
    path: '/addresslist',
    component: () => import('../views/AddressList'),
    meta: {
      title: '收货地址'
    }
  },
  {
    name: 'paysuccess',
    path: '/paysuccess',
    component: () => import('../views/PaySuccess'),
    meta: {
      title: '支付结果',
      navType: '3'
    }
  },
  {
    name: 'myhome',
    path: '/myhome',
    component: () => import('../views/MyHome/MyHome'),
    meta: {
      title: '花花会员'
    }
  },
  {
    name: 'homebranch',
    path: '/homebranch',
    component: () => import('../views/MyHome/HomeBranch'),
    meta: {
      title: '花花会员'
    }
  },
  {
    name: 'hsrules',
    path: '/hsrules',
    component: () => import('../views/MyHome/HuashengRules'),
    meta: {
      title: '花花币规则'
    }
  },
  {
    name: 'myorder',
    path: '/myorder',
    component: () => import('../views/MyOrder/MyOrder'),
    meta: {
      title: '我的订单'
    }
  },
  {
    name: 'myorderlist',
    path: '/myorderlist',
    component: () => import('../views/MyOrder/MyOrderList'),
    meta: {
      title: '我的订单列表'
    }
  },
  {
    name: 'mydetailgoods',
    path: '/mydetailgoods',
    component: () => import('../views/MyOrder/MyOrderDetailGoods'),
    meta: {
      title: '订单详情'
    }
  },
  {
    name: 'mydetailright',
    path: '/mydetailright',
    component: () => import('../views/MyOrder/MyOrderDetailRight'),
    meta: {
      title: '订单详情'
    }
  },
  {
    name: 'mydetailcoupon',
    path: '/mydetailcoupon',
    component: () => import('../views/MyOrder/MyOrderDetailCoupon'),
    meta: {
      title: '订单详情'
    }
  },
  {
    name: 'mydetailcharge',
    path: '/mydetailcharge',
    component: () => import('../views/MyOrder/MyOrderDetailCharge'),
    meta: {
      title: '订单详情'
    }
  },
  {
    name: 'invitation',
    path: '/invitation',
    component: () => import('../views/Invited/Invitation'),
    meta: {
      title: '分享赚钱'
    }
  },
  {
    name: 'beInvited',
    path: '/beInvited',
    component: () => import('../views/Invited/BeInvited'),
    meta: {
      title: '免费办理花花卡'
    }
  },
  {
    name: 'activation',
    path: '/activation',
    component: () => import('../views/activation/activation.vue'),
    meta: {
      title: '激活页面'
    }
  },
  {
    name: 'actsuccess',
    path: '/actsuccess',
    component: () => import('../views/activation/actSuccess.vue'),
    meta: {
      title: '激活页面'
    }
  },
  {
    name: 'perfectinfo',
    path: '/perfectinfo',
    component: () => import('../views/Invited/perfectInfo.vue'),
    meta: {
      title: '填写信息'
    }
  },
  {
    name: 'pay',
    path: '/pay',
    component: () => import('../views/Invited/Pay.vue'),
    meta: {
      title: '确认订单'
    }
  },
  {
    name: 'cardsuccess',
    path: '/cardsuccess',
    component: () => import('../views/Invited/cardSuccess.vue'),
    meta: {
      title: '买卡结果'
    }
  },
  {
    name: 'equity',
    path: '/equity',
    component: () => import('../views/equity.vue'),
    meta: {
      title: '花花权益'
    }
  },
  {
    name: 'cash',
    path: '/cash',
    component: () => import('../views/Cash/Cash.vue'),
    meta: {
      title: '提现',
      navRightType: 'cash'
    }
  },
  {
    name: 'cashsuccess',
    path: '/cashsuccess',
    component: () => import('../views/Cash/CashSuccess.vue'),
    meta: {
      title: '提现'
    }
  },
  {
    name: 'cashlist',
    path: '/cashlist',
    component: () => import('../views/Cash/CashList.vue'),
    meta: {
      title: '提现明细'
    }
  },
  {
    name: 'cashbind',
    path: '/cashbind',
    component: () => import('../views/Cash/CashBind.vue'),
    meta: {
      title: '验证身份信息'
    }
  },
  {
    name: 'mycourtesycard',
    path: '/mycourtesycard',
    component: () => import('../views/CourtesyCard/MyCourtesyCard.vue'),
    meta: {
      title: '我的优惠券'
    }
  }
];

// add route path
routes.forEach(route => {
  route.path = route.path || '/' + (route.name || '');
});

// const router = new Router({
//   routes
// });
const router = new Router({
  base: '/uploads/wifi/AppH5/nfygShop/', //配置base属性，声明路由根目录	
  mode: 'history',
  routes
});

router.beforeEach((to, from, next) => {
  const title = to.meta && to.meta.title;
  if (title) {
    document.title = title;
  }
  next();
});

export {
  router
};