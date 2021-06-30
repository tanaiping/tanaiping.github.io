var amapFile = require('../../utils/amap-wx.js');
var config = require('../../utils/config.js');
const app = getApp();
const baseUrl = app.globalData.baseUrl;
const util = require('../../utils/util.js') //util.getDistance(lat1, lng1, _this.data.lat2, _this.data.lng2)
Page({
  data: {
    tips: [
    //   {adcode: "440304",
    //   address: "莲花路1120号",
    //   city: [],
    //   distance: "10.6km",
    //   district: "广东省深圳市福田区",
    //   id: "B02F3006F9",
    //   location: "114.049074,22.556296",
    //   name: "北京大学深圳医院",
    //   typecode: "090101",
    // },
    ],
    cityList:[],
    keywords:'',
    cityIndex:0,
    distance:0,
    lat1:'', //自己位置经度
    lng1:'',//自己位置纬度
    lat2:'',//查找的位置的经度
    lng2:'',//查找的位置的纬度
    
  },
  onLoad: function(e){
    this.getLocation();
    this.getCityList();
  },
  getLocation(){
    const _this = this;
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success (res) {
        console.log(res)
        const lat1 = res.latitude;
        const lng1 = res.longitude;
        //const distance = util.getDistance(lat1, lng1, _this.data.lat2, _this.data.lng2); 
        _this.setData({
          lat1:lat1,
          lng1:lng1
        })
      }
     })
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
    const url = '../station/station?latitude=' + obj.lat +"&longitude="+obj.lng;
    wx.redirectTo({
      url: url
    })
  },
 

})