// pages/components/stationList.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    stationData:Array,
    latitude:Number,
    longitude:Number,
    oil_no:Number,
    len:Number
  },

  /**
   * 组件的初始数据
   */
  data: {
  },
  /**
   * 组件的方法列表
   */
  methods: {
   
    openMap(e) {
      console.log(e)
      const _this = this;
      const obj = e.currentTarget.dataset;
      const latitude =parseFloat(obj.latitude)
      const longitude = parseFloat(obj.longitude)
      console.log(latitude)
      console.log(longitude)
      wx.openLocation({
        latitude:latitude, // 纬度，范围为-90~90，负数表示南纬 
        longitude: longitude, // 经度，范围为-180~180，负数表示西经 
        scale: 14, // 缩放比例
        name: obj.stationname,
        address:obj.address,
        success: function (r) {
          // console.log(r)
        }
      })
    },
    addOil(e) {
      const _this = this;
      const obj = e.currentTarget.dataset;
      const latitude =_this.properties.latitude
      const longitude = _this.properties.longitude
      const id =  obj.id;
      const oil_no = _this.properties.oil_no;
      wx.navigateTo({
        url: '../orderSubmit/orderSubmit?id='+id+"&oil_no="+oil_no+"&latitude="+latitude+"&longitude="+longitude
      })
    },

  }
})
