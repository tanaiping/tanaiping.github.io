// pages/order/order.js
const app = getApp();
const baseUrl = app.globalData.baseUrl;
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ishidden:true,
    selectIndex:0,
    uid:1,
    type:-1,
    lastOrderId:'',
    menuList:['全部','已付款','已退款'],
    status:['支付成功','支付中','支付失败','退款成功','退款中','退款失败'],
    orderList:[
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const _this = this;
    util.login(baseUrl).then(function(res){
      let uid = wx.getStorageSync('uid');
      _this.setData({
        uid:uid
      })
      _this.orderList(true);
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
    this.orderList(false)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.orderList(false)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  changeMenu(e){
    const _this = this;
    let type = -1;
    if(e.currentTarget.dataset.index == 0){
      type = -1
    }else if(e.currentTarget.dataset.index == 1){
      type = 1
    }else if(e.currentTarget.dataset.index == 2){
      type = 4
    }
    if(_this.data.selectIndex == e.currentTarget.dataset.index) return;
    this.setData({
      selectIndex:e.currentTarget.dataset.index,
      type:type
    })
    _this.orderList(true);

  },
  goOrderDetail(e){
    wx.navigateTo({
      url: '../orderDetail/orderDetail?orderNo='+e.currentTarget.dataset.orderno
    })
  },
  orderList(isFirst){
   
    const _this = this;
    if(isFirst){
      _this.setData({
        orderList:[], 
        lastOrderId:'',
        ishidden:true,
      })
    }
    wx.request({
      url: baseUrl+ '/v1/oil/order/list', //仅为示例，并非真实的接口地址
      data: {
        "lastOrderId": _this.data.lastOrderId,
        "type": _this.data.type,
        "uid": _this.data.uid
      },
      method:'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log(res.data)
        if(res.data.resultCode == 0){
          let oridata = _this.data.orderList;
          let obj = res.data.data;
          let lastOrderId = '';
          if(obj){
            lastOrderId = obj[obj.length-1].orderNo
          }else{
            obj = [];
          }
          console.log(oridata)
          console.log(obj)
          let arr = [...oridata,...obj]
          _this.setData({
            orderList:arr, //res.data.data
            lastOrderId:lastOrderId
          })
          
        }else{
          util.showMsg(res.data.resultMsg,'none',2000)
        }
        _this.setData({
          ishidden:false
        })
      },
      fail (res) {
        console.log(res);
      }
    })
  }
})