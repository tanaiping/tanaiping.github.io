var amapFile = require('../../utils/amap-wx.js');
var config = require('../../utils/config.js');
const app = getApp();
const baseUrl = app.globalData.baseUrl;
const util = require('../../utils/util.js') //util.getDistance(lat1, lng1, _this.data.lat2, _this.data.lng2)
Page({
  data: {
    tips: [],
    cityList:[],
    keywords:'',
    cityIndex:0,
    distance:0,
    lat1:'', //自己位置经度
    lng1:'',//自己位置纬度
    lat2:'',//查找的位置的经度
    lng2:'',//查找的位置的纬度
    ishidden:true
  },
  onLoad: function(e){
    // this.getLocation();
    wx.showLoading({
      title: '定位中',
    })
    const _this = this;
    this.getCityList();
    util.getLocation.then(function(res){
      _this.setData({
        lat1:res.latitude,
        lng1:res.longitude
     });
      let key = config.Config.key;
      let myAmapFun = new amapFile.AMapWX({key:key});
      myAmapFun.getRegeo({
        success: function(data){
          //成功回调
          // console.log(_this.data.cityList)
          const curCity = data[0].regeocodeData.addressComponent.city
          // console.log(curCity)
          _this.data.cityList.forEach(function(item,index){
            if(curCity.includes(item)){
              _this.setData({
                cityIndex:index,
             });
            }
          })
          _this.setData({
            ishidden:false,
         });
          wx.hideLoading();
        },
        fail: function(info){
          //失败回调
          _this.setData({
            cityIndex:0,
            ishidden:false,
         });
          console.log(info)
        }
      })

   });
  },
  getCityList(){
    const _this = this;
    wx.request({
      url: baseUrl+'/v1/oil/getCityList', //仅为示例，并非真实的接口地址
      data: '',
      method:'get',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log(res.data.data)
        if(res.data.resultCode == 0){
          _this.setData({
            cityList:res.data.data
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
  clearKeys(){
    this.setData({
      keywords:'',
    })
  },
  goBack(){
    wx.navigateBack({
      delta: 1
    })
  },
  bindPickerChangeCity: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      cityIndex: e.detail.value
    })
  },
  bindInput: function(e){
    var that = this;
    var keywords = e.detail.value; 
    var key = config.Config.key;
    var myAmapFun = new amapFile.AMapWX({key: key});
    myAmapFun.getInputtips({
      keywords: keywords,
      location: '',
      city: that.data.cityList[that.data.cityIndex],
      success: function(data){
        console.log(data);
        if(data && data.tips){
          let newTips = data.tips //data.tips;
         
          newTips.forEach(function(item,idex){
            // console.log( typeof item.location)
            if(JSON.stringify(item.location) === '[]'){
              item.lat='';
              item.lng='';
              return;//有些数据没有location 返回的是[]
            } 
            const lng2 = item.location.split(",")[0]
            const lat2 = item.location.split(",")[1]
           item.distance = util.computedDistance(util.getDistance(that.data.lat1,that.data.lng1,lat2,lng2));
           item.lat=lat2;
           item.lng=lng2;
          })
          that.setData({
            tips: newTips//data.tips
          });
          console.log(that.data.tips)
          
        }
      }
    })
  },
  bindSearch: function(e){
    console.log(e)
    const obj = e.currentTarget.dataset;
    const keywords = obj.keywords; //这个字段暂不用  
    const url = '../station/station?latitude=' + obj.lat +"&longitude="+obj.lng+"&keywords="+keywords;
    wx.redirectTo({
      url: url
    })
  },
 

})