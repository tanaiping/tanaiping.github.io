// pages/station/station.js
const app = getApp();
const baseUrl = app.globalData.baseUrl;
const util = require('../../utils/util.js') //util.getDistance(lat1, lng1, _this.data.lat2, _this.data.lng2)
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tipsTop:110,
    pageNo:1,
    isMapmodel: false,// ==false 列表模式  ==true 地图模式
    screenH:0,
    selectOilData: ['92','95','98','0'],//下拉列表的数据
    index_oil: 0,//选择的下拉列表下标
    showCheck:0, // 0不显示  1 显示 油号  2 显示离我最近
    selectTypeData: ['离我最近','低价优先'],//下拉列表的数据
    index_type: 0,//选择的下拉列表下标
    stationData:[],
    longitude: "",
    latitude: "",
    c_lat:'',// 默认第一个油站为地图中间点
    c_lng:'',// 默认第一个油站为地图中间点
    ishidden:true,
    markers:[],
    keywords:'',
    selectMarketId:0,
  circles:[{
    "latitude": "",
    "longitude": "",
    color: '#007BFF4D',//007BFF4D
    fillColor:'#007BFF4D',//#007BFF4D
    radius: 6000,
    strokeWidth: 0
  }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const _this = this;
    let  lat = 'circles[0].latitude'
    let  lgt = 'circles[0].longitude'
    _this.setData({
      screenH: wx.getSystemInfoSync().windowHeight,
      latitude:options.latitude,
      longitude:options.longitude,
      [lat]:options.latitude,
      [lgt]:options.longitude,
      keywords:options.keywords
     });
    _this.getStation();

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
    // wx.reLaunch({
    //   url: '../index/index'
    // })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    const _this = this;
    // _this.getStation()
   // wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    const _this = this;
    // _this.getStation()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  selectMarket(selectMarketId){
    let newMap = this.data.markers;
    let newStation = {};
    const _this = this;
    newMap.forEach(function(item,idx){
      // console.log(idx)
      if(idx == selectMarketId){
        item.iconPath = '../images/maptips_checked.png';
        item.label.color = "#FFF";
      }else{
        item.iconPath = '../images/maptips.png';
        item.label.color = "#333";
      }
    })
    let selectedIndex = 0;
    _this.data.stationData.forEach(function(item,idx){
      if(idx == selectMarketId){
        selectedIndex = idx;
      }
    })

    this.setData({
      markers:newMap,
      selectMarketId:selectedIndex,
    });
    // console.log(_this.data.selectMarketId)
    // console.log(_this.data.markers)
    // console.log(_this.data.c_lat)
    // console.log(_this.data.c_lng)
  },
  markertap(e){ //点击图片的标记
    // console.log(e.detail.markerId)
    // console.log(e);
    this.setData({
      selectMarketId:e.detail.markerId,
    });
    this.selectMarket(e.detail.markerId)
  },
  openMap(e) {
    const _this = this;
    const obj = e.currentTarget.dataset;
    const latitude =parseFloat(obj.latitude)
    const longitude = parseFloat(obj.longitude)
    // console.log(latitude)
    // console.log(longitude)
    wx.openLocation({
      latitude: latitude, // 纬度，范围为-90~90，负数表示南纬  传入字符串 就打不开地图
      longitude: longitude, // 经度，范围为-180~180，负数表示西经
      scale: 14, // 缩放比例
      name: obj.stationname,
      address:obj.address,
      success: function (r) {
        // console.log(r)
      }
    })

  },
  goUserOrder() {
    wx.navigateTo({
      url: '../order/order'
    })
  },
  toSearch() {
    wx.navigateTo({
      url: '../search/search'
    })
  },
  addOil(e) {
    const _this = this;
    const obj = e.currentTarget.dataset;
    const latitude =_this.data.latitude
    const longitude = _this.data.longitude
    const id =  obj.id;
    const oil_no = _this.data.selectOilData[_this.data.index_oil];

   
    wx.navigateTo({
      url: '../orderSubmit/orderSubmit?id='+id+"&oil_no="+oil_no+"&latitude="+latitude+"&longitude="+longitude
    })
  },
  showFilterBox(e){
    let  type = e.currentTarget.dataset.type;
    let tipsTop = 181;
    if(this.data.showCheck == type){
      type = 0;
      tipsTop = 110;
    }
    this.setData({
      showCheck: type,
      tipsTop:tipsTop
    })
  },
  bindChangeOil: function(e) {//切换油号
    const _this = this;
    _this.setData({
      index_oil: e.currentTarget.dataset.index,
      showCheck: 0,
      tipsTop:110,
      pageNo:1,
    })
    _this.getStation();
  },
  bindChangeType: function(e) {//切换类型
    const _this = this;
    _this.setData({
      index_type: e.currentTarget.dataset.index,
      showCheck: 0,
      tipsTop:110,
      pageNo:1,
    })
    _this.getStation();
  },
  switchModel(){ //切换模式
    const _this = this;
    _this.setData({
      isMapmodel: !this.data.isMapmodel
    })
  },
  getStation() {
    const _this = this;
    wx.showLoading({
      title: '加载中',
    })
      wx.request({
        url: baseUrl+'/v1/oil/getStationList', //仅为示例，并非真实的接口地址
        data: {
          "latitude": _this.data.latitude,
          "longitude": _this.data.longitude,
          "oil_no": _this.data.selectOilData[_this.data.index_oil],
          "type": _this.data.index_type+1,
          "pageNo":_this.data.pageNo,
          "allType":2
        },
        method:'POST',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success (res) {
          // console.log(res.data)
          if(res.data.resultCode == 0){
              let markerList = [];
              let newObj = [];
              if(res.data.data){
                res.data.data.forEach(function(item,index){ 
                  let obj = {
                    "id": index, //item.id
                    "longitude":item.longitude,
                    "latitude": item.latitude,
                    "iconPath":'../images/maptips.png',
                    "width":116,
                    "height":62,
                    "zIndex":index*10,
                    "label":{
                    "content":'¥'+item.sale_price,
                    "color":'#333',
                    "fontSize":'30rpx',
                    "display":'ALWAYS',
                    'anchorX':'-15',
                    "anchorY":'-46',
                    'textAlign':'right',
                    }
                  }
                  if(index == 0){//默认第一个选中
                    obj.iconPath = '../images/maptips_checked.png';
                    obj.label.color = "#FFF";
                    
                    _this.setData({
                      c_lat:item.latitude,
                      c_lng:item.longitude,
                    })
                  }
                  markerList.push(obj);

                  const list_price = item.list_price;
                  const sale_price = item.sale_price;
                  let discount_price = list_price - sale_price;
                  discount_price = discount_price.toFixed(2);
                  let discount_total = 0;
                  if(list_price != 0 &&discount_price != 0){
                    discount_total = util.reservedDecimal((200/list_price),4)*discount_price
                  }
                  discount_total = util.reservedDecimal(discount_total,2)

                  item.dis_price = discount_total;
                  let dis = item.list_price - item.sale_price
                  item.dis = dis.toFixed(2)
                  newObj.push(item);
                })
              }
              _this.setData({
                stationData:newObj,
                markers:markerList,
                selectMarketId:0,
                pageNo:_this.data.pageNo+1
              })
          }else{
            util.showMsg(res.data.resultMsg,'none',2000)
          }
          _this.setData({
            ishidden:false,
          });
          wx.hideLoading();
        },
        fail (res) {
          console.log(res);
        }
      })
      _this.selectMarket(_this.data.selectMarketId); //地图模式 默认选中第一个
  },
  moveTolocation:function(e){
      var mapCtx = wx.createMapContext("map");
      mapCtx.moveToLocation();
  },
  fff:function(e){
    console.log(e)
      return false;
  }
})