// index.js
// 获取应用实例
const app = getApp();
const baseUrl = app.globalData.baseUrl;
const util = require('../../utils/util.js') //util.getDistance(lat1, lng1, _this.data.lat2, _this.data.lng2)
Page({
  data: {
    rechargeCnt:0,
    amount_price:0,
    discount_price:0,
    latitude:0, // 用户的经纬度
    longitude:0, //用户的经纬度
    phone:'',
    stationData:[
    ],
    ishidden:true,
    isLogin:false,
    isload:false
  },
  // 事件处理函数
  toOrderList() {
    wx.navigateTo({
      url: '../order/order',
    })
  },
  toAllStionList() {
    const _this = this;
    wx.navigateTo({
      url: '../station/station?latitude=' + _this.data.latitude +"&longitude="+_this.data.longitude,
    })
  },
  getPhoneNumber (e) {
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      const _this =this;
      // console.log(e.detail.errMsg)
      // console.log(e.detail.iv)
      // console.log(e.detail.encryptedData)
      // console.log(baseUrl);
      wx.removeStorageSync('openId')
      wx.removeStorageSync('uid')
      wx.removeStorageSync('phone')
      wx.removeStorageSync('session_key')

      util.login(baseUrl).then(function(res){
        const uid = wx.getStorageSync('uid');
        const session_key = wx.getStorageSync('session_key');
        _this.setData({
          uid:uid
        })
        if(e.detail.encryptedData){
          wx.request({
            url: baseUrl+'/v1/user/getUserMobile', //仅为示例，并非真实的接口地址
            data: {
                "encrypted": e.detail.encryptedData,
                "iv": e.detail.iv,
                "session_key": session_key,
                "uid":uid
            },
            method:'POST',
            header: {
              'content-type': 'application/json' // 默认值
            },
            success (res) {
              // console.log(res.data)
              if(res.data.resultCode == 0){
                wx.setStorageSync('phone', res.data.data)
                _this.setData({
                  isLogin:true
                })
              }else{
                util.showMsg(res.data.resultMsg,'none',2000)
              }
            },
            fail (res) {
              console.log(res);
            }
          })
          
        }
      })
    }
  },
  onLoad() {
    const _this = this;
    console.log("load")
    util.login(baseUrl).then(function(res){
      let uid = wx.getStorageSync('uid');
      _this.setData({
        uid:uid
      })
      let phone = wx.getStorageSync('phone');
      // console.log(phone)
      if(phone){
        _this.setData({
          phone:phone,
          isLogin:true
        });
      }else{
        _this.setData({
          phone:'',
          isLogin:false
        });
      }
      _this.rechargeInfo();
    })
    util.getLocation.then(function(res){
       _this.setData({
        latitude:res.latitude,
        longitude:res.longitude
      });
      _this.getStation();
    });
    
    _this.setData({
      isload:true
    });


    
    // console.log(_this.data.isLogin)
    
  },
  onShow(){
    if(!this.data.isload){
      this.onLoad();
    }
   
  },
  onHide(){
    this.setData({
      isload:false
    });
  },
  getStation() {
    const _this = this;
    wx.request({
      url: baseUrl+'/v1/oil/getStationList', //仅为示例，并非真实的接口地址
      data: {
        "latitude":_this.data.latitude,
        "longitude": _this.data.longitude,
        // "latitude": 22.601521,
        // "longitude": 113.847456,
        "oil_no": 92,
        "type": 1,
        "pageNo":1,
      },
      method:'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        // console.log(res.data)
        if(res.data.resultCode == 0){
            if(res.data.data){
              res.data.data.forEach(function(item,i){
                let dis = item.official_price - item.sale_price
                  item.dis = dis.toFixed(2)
              })
              _this.setData({
                stationData:res.data.data
              })
            }
            
        }else{
          util.showMsg(res.data.resultMsg,'none',2000)
        }
        _this.setData({
          ishidden:false,
        });

      },
      fail (res) {
        console.log(res);
      }
    })
  },
  rechargeInfo() {
    const _this = this;
    wx.request({
      url: baseUrl+'/v1/oil/queryRechargeInfo', //仅为示例，并非真实的接口地址
      data: {
        "uid": _this.data.uid,
      },
      method:'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        // console.log(res.data)
        if(res.data.resultCode == 0){
          let amount_price = 0;
          res.data.data.amount_price==null?(amount_price = 0):(amount_price = res.data.data.amount_price);
          if(amount_price != 0){
            amount_price = util.reservedDecimal(amount_price,2);
          }
            _this.setData({
              rechargeCnt:res.data.data.rechargeCnt,
              amount_price: amount_price,
              discount_price:res.data.data.discount_price,
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
  otherMin(){
    wx.navigateToMiniProgram({
      appId: 'wxe7faadbd87ff4d96',
      path: '',
      extraData: {},
      envVersion: 'release',//
      success(res) {
        // 打开成功
      }
    })
  }
  
})
