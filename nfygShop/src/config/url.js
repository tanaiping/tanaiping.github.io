// 3.70  环境    一般使用
// const cmsUrl2 = "http://192.168.3.70:5566"
// 外网ip
// const cmsUrl2 = "http://120.197.100.98:15566"

//李明
// const cmsUrl2 = "http://192.168.1.147:5566"

//李惠春
// const cmsUrl2 = "http://192.168.1.173:5566"
//线上
const cmsUrl2 = "https://vip.wifi8.com"

// 商品模块接口
export const GoodsUrl = {
    bannerList: cmsUrl2 + "/v1/goods/bannerList",
    activityList: cmsUrl2 + "/v1/goods/activityList",
    addressList: cmsUrl2 + "/v1/goods/addressList",
    addressModify: cmsUrl2 + "/v1/goods/addressModify",
    goodsDetail: cmsUrl2 + "/v1/goods/detail",
    goodsCommit: cmsUrl2 + "/v1/goods/order/commit", //商品提交订单
    goodsOrderList: cmsUrl2 + "/v1/goods/order/list", //商品订单列表
    goodsOrderDetail: cmsUrl2 + "/v1/goods/order/detail", //商品订单详情
    goodsOrderDelete: cmsUrl2 + "/v1/goods/order/modify", //商品订单操作 取消/完成/删除\
    goodsLogisticDetail: cmsUrl2 + "/v1/goods/logisticDetail", //物流详情列表查询
    goodsBuyAgain: cmsUrl2 + "/v1/goods/buy/again", //商品再次购买
}
// 权益模块接口
export const RightUrl = {
    hotIndex: cmsUrl2 + "/v1/right/index",
    moreIndex: cmsUrl2 + "/v1/right/more",
    rightList: cmsUrl2 + "/v1/right/list",
    rightDetail: cmsUrl2 + "/v1/right/detail",
    rightCommit: cmsUrl2 + "/v1/right/order/commit",
    rightOrderDetail: cmsUrl2 + "/v1/right/order/detail",
    rightOrderDelete: cmsUrl2 + "/v1/right/order/delete"
}
// 卡券模块接口
export const CouponUrl = {
    couponList: cmsUrl2 + "/v1/coupon/list",
    couponDetail: cmsUrl2 + "/v1/coupon/detail",
    couponCommit: cmsUrl2 + "/v1/coupon/order/commit",
    couponOrderList: cmsUrl2 + "/v1/coupon/order/list",
    couponOrderDetail: cmsUrl2 + "/v1/coupon/order/detail",
    couponOrderDelete: cmsUrl2 + "/v1/coupon/order/delete",
    couponOrderCancel: cmsUrl2 + "/v1/coupon/pay/cancel",
    couponBuyAgain: cmsUrl2 + "/v1/coupon/buy/again",
}

// 充值模块接口
export const ChargeUrl = {
    chargeList: cmsUrl2 + "/v1/charge/icons",
    chargeDetail: cmsUrl2 + "/v1/charge/detail",
    chargeCommit: cmsUrl2 + "/v1/charge/order/commit",
    chargeAll: cmsUrl2 + "/v1/charge/all",
    chargeOrderList: cmsUrl2 + "/v1/charge/order/list",
    chargeOrderDetail: cmsUrl2 + "/v1/charge/order/detail",
    chargeOrderDelete: cmsUrl2 + "/v1/charge/order/delete",
    chargeOrderCancel: cmsUrl2 + "/v1/charge/pay/cancel",
    chargeNotice: cmsUrl2 + "/v1/charge/pay/wx/notify",
}

// 用户模块接口
export const UserUrl = {
    authLogin: cmsUrl2 + "/v1/user/auth/login",
    login: cmsUrl2 + "/v1/user/login",
    getCode: cmsUrl2 + "/v1/user/getVerifyCode",
    applyCardOrder: cmsUrl2 + "/v1/user/applyCardOrderV2",
    payCard: cmsUrl2 + "/v1/user/payCard",
    payCardQuery: cmsUrl2 + "/v1/user/payCard/query",
    // 用户信息
    getUserInfo: cmsUrl2 + "/v1/user/getUserInfo",
    detailShare: cmsUrl2 + "/v1/user/sharePage",
    detailCurrency: cmsUrl2 + "/v1/user/currencyDetail/list",
    detailSave: cmsUrl2 + "/v1/user/buySaveLog/list",
    // 微信授权绑定
    weChatBind: cmsUrl2 + "/v1/user/weChatBind",
    // 激活花花卡
    activateCard: cmsUrl2 + "/v1/user/activateCard",
    // 提现页面
    cashPage: cmsUrl2 + "/v1/user/cashPage",
    // 提现明细列表
    cashDetail: cmsUrl2 + "/v1/user/cashDetail/list",
    // 身份认证
    cardAuth: cmsUrl2 + "/v1/user/cardAuth",
    //用户余额提现 
    balanceCash: cmsUrl2 + "/v1/user/balanceCash"
}