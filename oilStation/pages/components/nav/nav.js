// components/navbar/index.js
const App = getApp();

Component({
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {
    pageName:String,
    showNav:{
      type:Boolean,
      value:true
    },
    showHome: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
   
  },
  lifetimes: {
    attached: function () {
      console.log("====nav=====")
      console.log("====navTop====="+App.globalData.navHeight)
      console.log("====navTop====="+App.globalData.navTop)
      console.log("====navTop====="+App.globalData.windowHeight)
      this.setData({
        navHeight: App.globalData.navHeight,
        navTop: App.globalData.navTop,
        windowHeight: App.globalData.windowHeight
      })
     }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //回退
    _navBack: function () {
        wx.navigateBack({
          delta: 1
        })      
    },
    //回主页
    _toIndex: function () {
      wx.reLaunch({
        url: '../../pages/index/index'
      })
    },
  }
})