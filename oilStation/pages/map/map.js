// pages/map/map.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    "longitude": "111.62852107566833",
    "latitude": "26.42142999357519",
    markers:[
    {
      "id": 1,
      "name": "永州市中心医院",
      "longitude": "111.62852107566833",
      "latitude": "26.42142999357519",
      "iconPath":'../images/location.png',
      "width":32,
      "height":32
    },
    {
      "id": 2,
      "name": "永州市中医院",
      "longitude": "111.5972679762268",
      "latitude": "26.44470581245983",
      "iconPath": '../images/location.png',

    }
  ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  }
})