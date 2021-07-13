// pages/orderDetail/orderDetail.js
const app = getApp();
const baseUrl = app.globalData.baseUrl;
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderNo:'',
    uid:1,
    status:[
      {
        typeIcon:'../images/icon_pop1.png',
        name:'支付成功'
      },
      {
        typeIcon:'../images/icon_pop4.png',
        name:'支付中'
      },
      {
        typeIcon:'../images/icon_pop2.png',
        name:'支付失败'
      },
      {
        typeIcon:'../images/icon_pop1.png',
        name:'退款成功'
      },
      {
        typeIcon:'../images/icon_pop4.png',
        name:'退款中'
      },
      {
        typeIcon:'../images/icon_pop2.png',
        name:'退款失败'
      },

    ],
    orderData:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const _this = this;
    _this.setData({
      orderNo:options.orderNo
    });
    util.login(baseUrl).then(function(res){
      let uid = wx.getStorageSync('uid');
      _this.setData({
        uid:uid
      })
      _this.getOrderDetail();
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getOrderDetail(){
    const _this = this;
    wx.request({
      url: baseUrl+ '/v1/oil/order/detail', //仅为示例，并非真实的接口地址
      data: {
        "orderNo": _this.data.orderNo,
        "uid": _this.data.uid
      },
      method:'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        // console.log(res.data)
        if(res.data.resultCode == 0){
          _this.setData({
            orderData:res.data.data
          })
        }else{
          util.showMsg(res.data.resultMsg,'none',2000)
        }
      },
      fail (res) {
        console.log(res);
      }
    })
  },
  phoneCall(e){
    util.comTackPhone(e.currentTarget.dataset.phone)
 },
})