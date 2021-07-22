// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    let menuButtonObject = wx.getMenuButtonBoundingClientRect();
    wx.getSystemInfo({
      success: res => {
        let statusBarHeight = res.statusBarHeight,
          navTop = menuButtonObject.top,//胶囊按钮与顶部的距离
          navHeight = statusBarHeight + menuButtonObject.height + (menuButtonObject.top - statusBarHeight)*2;//导航高度
        this.globalData.navHeight = navHeight;
        this.globalData.navTop = navTop;
        this.globalData.windowHeight = res.windowHeight;
      },
      fail(err) {
        console.log(err);
      }
    })
  },
  globalData: {
    // baseUrl: 'http://192.168.1.118:5566'  //yf
    // baseUrl: 'http://192.168.1.147:5566'  //lm
    // baseUrl: 'http://192.168.201.153:5566' //
    // baseUrl: 'https://cj.sljoy.cn'  //ceshi
    baseUrl: 'https://api.wextone.com',  //online
    
  }
})
