// pages/orderSubmit/orderSubmit.js
const app = getApp();
const baseUrl = app.globalData.baseUrl;
const util = require('../../utils/util.js') 
let that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid:'',
    deviceSN:'',
    id:'',
    oil_no:'',
    latitude: "", //用户经纬度
    longitude: "",//用户经纬度
    lat2:'',
    lng2:'',
    priceList:{
      sale_price:'',
      list_price:'',
      official_price:'',
    },
    discount_price:'',//单价优惠
    sale_price:'',
    list_price:'',
    selectOilData: [],//下拉列表的数据
    index_oil: 0,//选择的下拉列表下标
    selectOilData2: [],//下拉列表的数据
    index_oil2: 0,//选择的下拉列表下标
    selectGunData: [],//下拉列表的数据
    index_gun: 0,//选择的下拉列表下标
    isShow:false,
    history_oil:0,
    history_gun:0,
    inputPrice:'',//输入金额
    amountPrice:'', //合计
    dis_price:0, //优惠总金额
    liters:0,
    totalList:[200,300],
    curprice:-1, // 默认没有快速选择价格（200，300）
    placeholder:'请选油枪，再输入金额',
    stationData:{},
    isdisableDistance:false,
    isdisabledInput:true,
    isLogin:false
  },
  
   /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    that = this;
    const _this = this;
    let uid = wx.getStorageSync('uid');
    let deviceSN ='';
    if(options.deviceSN){
      deviceSN = options.deviceSN
    }else{
      deviceSN = _this.data.deviceSN
    }
    
    _this.setData({
      id:options.id,
      oil_no:options.oil_no,
      latitude:options.latitude,
      longitude:options.longitude,
      uid:uid,
      deviceSN:deviceSN,
    })
    _this.getDetail();
    _this.initGunList(_this.data.oil_no) 

    util.login(baseUrl).then(function(res){
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
    })
    
  },
  getPhoneNumber (e) {
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      const _this =this;
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
  getDetail(){
    const _this = this;
    wx.request({
      url: baseUrl+'/v1/oil/wzStationDeatil', //仅为示例，并非真实的接口地址
      data: {
        "latitude": _this.data.latitude,
        "longitude": _this.data.longitude,
        "oil_no": _this.data.oil_no,
        "id": _this.data.id,
      },
      method:'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        // console.log(res.data)
        if(res.data.resultCode == 0){
          _this.setData({
            stationData:res.data.data,
            list_price:res.data.data.list_price,
            lat2:res.data.data.latitude,
            lng2:res.data.data.longitude,
            ['priceList.sale_price']:res.data.data.sale_price,
            ['priceList.list_price']:res.data.data.list_price,
            ['priceList.official_price']:res.data.data.official_price,
            selectOilData:res.data.data.oilNoList,
            selectOilData2:res.data.data.oilNoList
          })
          res.data.data.oilNoList.forEach(function(item,idx){
            if(item == _this.data.oil_no){
              _this.setData({
                index_oil:idx,
                index_oil2:idx
              })
            }
          })
          // console.log(_this.data.stationData)
        }else{
          util.showMsg(res.data.resultMsg,'none',2000)
        }
      },
      fail (res) {
        console.log(res);
      }
    })
  },
  initGunList(oil_no){
    const _this = this;
    wx.request({
      url: baseUrl+'/v1/oil/queryOilGunnoByOilno', //仅为示例，并非真实的接口地址
      data: {
        "oil_no": oil_no,
        "stationId": _this.data.id
      },
      method:'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        // console.log(res.data.data)
        const obj = res.data.data;
        if(res.data.resultCode == 0){
          const newArr = res.data.data.gunList;
          newArr.unshift('请选择油枪号')
         let dis = obj.list_price - obj.sale_price
          dis = dis.toFixed(2);
          console.log(dis)
          _this.setData({
            selectGunData:newArr,
            discount_price:dis?dis:0,
            list_price:obj.list_price?obj.list_price:0,
            sale_price:obj.sale_price?obj.sale_price:0,
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
  inputClick(){
    const _this = this;
    if(_this.data.placeholder == '请选油枪，再输入金额'){
      wx.showToast({
        title: '请先选择油枪油号',
        icon: 'none',
        duration: 2000
      })
    }
  },
  changePrice(e){
    // console.log(e.detail.value);
    console.log("xxx")
    const _this = this;
    let  idx = -1;
    let money = e.detail.value;
    money = money.replace("￥",'');
    let x = money.indexOf(".")//获取小数点的位置
    let count = 0;
    if(x != -1){
      count = money.slice(x+1).length
    }
    if(money>8000){
      money =8000
    }
    if(count>2) money = util.reservedDecimal(money,2);
    _this.setData({ 
      inputPrice :money
    })
    _this.data.totalList.forEach(function(item,index){
      if(money == item){
        idx = index
      }
    })
    // console.log(idx)
    _this.setData({  //匹配 如果输入框的值 是否等于 快速选择的价格
      curprice :idx
    })
    _this.couputedDisPrice();
   
  },
  couputedDisPrice(){
    console.log("couputed")
    const _this = this;
    const list_price = _this.data.list_price;
    const discount_price = _this.data.discount_price;
    
    const  inputPrice = _this.data.inputPrice==''?0:_this.data.inputPrice
    const liters = util.reservedDecimal((inputPrice/list_price),4);
    let discount_total = 0;
    if(list_price != 0 &&discount_price != 0){
      discount_total = liters*discount_price
    }

    discount_total = util.reservedDecimal(discount_total,2);
    let amountPrice = inputPrice - discount_total;
    amountPrice = util.reservedDecimal(amountPrice,2);
    
     
    _this.setData({
      dis_price: discount_total,
      amountPrice:amountPrice,
      liters:liters
    })
  },
  bindPickerChangeOil: function(e) { //切换油号 展示相应的价格
    const _this = this;
    if(_this.data.index_oil2 == e.detail.value) return;
    _this.setData({
      index_oil2: e.detail.value,
      isdisabledInput: true,
      inputPrice:'',
      curprice:-1,
      index_gun:0,
      placeholder:'请选油枪，再输入金额'
    })
    const oil_no = _this.data.selectOilData2[_this.data.index_oil2]
    _this.initGunList(oil_no)
    _this.getStationPrice(oil_no, _this.data.id).then(function(res){
      _this.couputedDisPrice();
    });
    
    
    
  },
   getStationPrice : (oil_no,id) =>{
    return new Promise(function(resolve,reject){
      const _this = that;
      wx.request({
        url: baseUrl+'/v1/oil/getStationPrice', //仅为示例，并非真实的接口地址
        data: {
          "oil_no": oil_no,
          "stationId": id,
        },
        method:'POST',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success (res) {
          // console.log(res.data.data)
          if(res.data.resultCode == 0){
            _this.setData({
              ['priceList.sale_price']:res.data.data.sale_price,
              ['priceList.list_price']:res.data.data.list_price,
              ['priceList.official_price']:res.data.data.official_price,
            })
            resolve(res.data.data);//uid
          }else{
            util.showMsg(res.data.resultMsg,'none',2000)
          }
        },
        fail (res) {
          console.log(res);
        }
      })

    });
  },
  // getStationPrice(oil_no,id){
  //   const _this = this;
  //   wx.request({
  //     url: baseUrl+'/v1/oil/getStationPrice', //仅为示例，并非真实的接口地址
  //     data: {
  //       "oil_no": oil_no,
  //       "stationId": id,
  //     },
  //     method:'POST',
  //     header: {
  //       'content-type': 'application/json' // 默认值
  //     },
  //     success (res) {
  //       // console.log(res.data.data)
  //       if(res.data.resultCode == 0){
  //         _this.setData({
  //           ['priceList.sale_price']:res.data.data.sale_price,
  //           ['priceList.list_price']:res.data.data.list_price,
  //           ['priceList.official_price']:res.data.data.official_price,
  //         })
  //       }else{
  //         util.showMsg(res.data.resultMsg,'none',2000)
  //       }
  //     },
  //     fail (res) {
  //       console.log(res);
  //     }
  //   })
  // },
  showSelectPop(){
    const _this = this;
    _this.setData({
      isShow: true,
      history_oil:_this.data.index_oil2,
      history_gun:_this.data.index_gun
    })
  },
  hideSelectPop(e){
    const type = e.currentTarget.dataset.type // 0取消  1 确认
    const _this = this;
    if(type == 0){
      _this.setData({
        index_oil2:_this.data.history_oil,
        index_gun:_this.data.history_gun
      })
    }
    if(_this.data.index_gun == 0){
      _this.setData({
        isdisabledInput: true,
        isShow: false,
        inputPrice:'',
        curprice:-1,
        placeholder:'请选油枪，再输入金额'
      })
    }else{
      _this.setData({
        isdisabledInput: false,
        isShow: false,
        placeholder:'请输入加油金额'
      })
      // if(_this.data.inputPrice == ''){
      //   _this.setData({
      //     inputPrice:'200',
      //     curprice:0
      //   })
      // }
    }
   
    const oil_no = _this.data.selectOilData2[_this.data.index_oil2]
    _this.initGunList(oil_no);
    _this.getStationPrice(oil_no, _this.data.id).then(function(res){
      _this.couputedDisPrice();
    });
    console.log(_this.data)
  },
  changeOil: function(e) {
    const _this = this;
    // console.log( e.currentTarget.dataset.index)
    if(_this.data.index_oil2 == e.currentTarget.dataset.index) return
    this.setData({
      index_oil2: e.currentTarget.dataset.index,
      index_gun:0
    })
    const oil_no = _this.data.selectOilData2[_this.data.index_oil2]
    _this.initGunList(oil_no);
    _this.getStationPrice(oil_no,_this.data.id)
  },
  changeGun: function(e) {
    // console.log( e.currentTarget.dataset.index)
    if(this.data.index_gun == e.currentTarget.dataset.index){
      this.setData({
        index_gun: 0,
      })
    }else{
      this.setData({
        index_gun: e.currentTarget.dataset.index
      })
    }
    
  },
  openMap(e) {
    const _this = this;
    const latitude = parseFloat(_this.data.lat2) //lat2
    const longitude = parseFloat(_this.data.lng2) //lng2
    const obj = e.currentTarget.dataset
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
  phoneCall(e){
     util.comTackPhone(e.currentTarget.dataset.phone)
  },
  checkPrice(e){
    // console.log(e)
    const _this = this;
    // console.log(e.currentTarget.dataset.price)
    if(_this.data.isdisabledInput == false){
      _this.setData({
        inputPrice:e.currentTarget.dataset.price,
        curprice:e.currentTarget.dataset.idx
      })
      _this.couputedDisPrice();
    }

    
  },
  pay(e){//支付
    const _this = this;
    if(_this.data.amountPrice==0||_this.data.isLogin==false||_this.data.amountPrice=='') return;
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success (res) {
        // console.log(res)
        const lat1 = res.latitude;
        const lng1 = res.longitude;
        const distance = util.getDistance(lat1, lng1, _this.data.lat2, _this.data.lng2); //(39.928712, 116.393345, 39.928722, 116.393853)//
        // console.log(distance)
        if(distance>2000){//2公里
          _this.setData({
            isdisableDistance:true
          })
          return false;
        }else{
          _this.setData({
            isdisableDistance:false
          })
          _this.commit();

        }
      }
     })
    
  },
  hidePop(){
    this.setData({
      isdisableDistance:false
    })
  },
  commit(){
    const _this = this;
    const deviceSN = _this.data.deviceSN;
    const gun_no = _this.data.selectGunData[_this.data.index_gun];
    const oil_no = _this.data.selectOilData2[_this.data.index_oil2];
    const total_amount = _this.data.inputPrice*100;
    const phone = wx.getStorageSync('phone');
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: baseUrl+'/v1/oil/order/commit', //仅为示例，并非真实的接口地址
      data: {
        "gun_no": gun_no,
        "oil_no": oil_no,
        "deviceSN":deviceSN,
        "stationId": _this.data.id,
        "total_amount": total_amount,
        "uid": _this.data.uid,
        "payType":3,
        "discount_amount":_this.data.dis_price*100,
        "pay_amount":_this.data.amountPrice*100,
        "liters":_this.data.liters
      },
      method:'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        // console.log(res.data.data)
        if(res.data.resultCode == 0){
          if(res.data.data){
            // let [prepayId,timeStamp,pay_amount,nonceStr,sub_openid,paySign,orderNo,sign_type,timeout] = res.data.data;
            _this.wxPay(res.data.data.prepayId,res.data.data.timeStamp,res.data.data.pay_amount,res.data.data.nonceStr,res.data.data.sub_openid,res.data.data.paySign,res.data.data.orderNo,res.data.data.sign_type)
            // wxPay(money,nonce_str,sub_openid,sign)
          }else{
            util.showMsg('下单失败，请重新下单','none',2000)
          }
         
        }else{
          // console.log(res);
          let msgStr = res.data.resultMsg;
          if( msgStr.indexOf('余额不足')>-1|| msgStr.indexOf('不是合作商户，请与喂车工作人员联系')>-1){
            wx.navigateTo({
              url: '../orderLose/orderLose'
            })
            return false;
          }
          util.showMsg(res.data.resultMsg,'none',2000)
        }
        wx.hideLoading();
      },
      fail (res) {
        console.log(res);
      }
    })
  },
  wxPay(prepayId,timeStamp,money,nonce_str,sub_openid,sign,orderNo,signType){
    const _this = this;
    const appId='wxb1bec7d809e7cf40';
    wx.requestPayment(
      {
      "timeStamp":timeStamp,
      "nonceStr": nonce_str,
      "package": "prepay_id="+prepayId,
      "signType": signType,
      "paySign": sign,
      "success":function(res){
        console.log(res)
        console.log("支付成功")
        wx.navigateTo({
          url: '../orderDetail/orderDetail?orderNo='+orderNo
        })
      },
      "fail":function(res){
        console.log(res)
        console.log("支付失败")
      },
      "complete":function(res){
        console.log(res)
        console.log("支付完成")
      }
      })

  },
  
})