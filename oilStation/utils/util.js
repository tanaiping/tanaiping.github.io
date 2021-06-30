
const getDistance = (la1, lo1, la2, lo2) => { //计算两点距离 （经 纬 经 纬) (lo1, la1, lo2, la2)
   console.log(la1+"---"+lo1+"---"+la2+"---"+lo2)
  var La1 = la1 * Math.PI / 180.0;
  var La2 = la2 * Math.PI / 180.0;
  var La3 = La1 - La2;
  var Lb3 = lo1 * Math.PI / 180.0 - lo2 * Math.PI / 180.0;
  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(La3 / 2), 2) + Math.cos(La1) * Math.cos(La2) * Math.pow(Math.sin(Lb3 / 2), 2)));
  s = s * 6378.137;//地球半径
  s = Math.round(s * 10000) / 10000;
  //计算出来的是KM
  // s = s.toFixed(1) //保留两位小数
  // console.log("计算结果",s);
  return s*1000; //调用 return的距离单位为m
}

const computedDistance = distance => {
  // console.log(distance +"====")
  let dis = '';
  if(distance<1000){
    dis = distance.toFixed(1) + 'm';
  }else{
    dis = distance/1000;
    dis = dis.toFixed(1);
    dis = dis + 'km';
  }
  return dis
}


const getLocation = new Promise(function(resolve,reject){ //获取你当前位置
  wx.getLocation({
    type: 'gcj02', //返回可以用于wx.openLocation的经纬度
    success (res) {
      console.log(res)
      // const lat1 = res.latitude;
      // const lng1 = res.longitude;
      // return res;
      resolve(res);
    }
   })
});

const login = (baseUrl) =>{
  return new Promise(function(resolve,reject){ //登录
    console.log(baseUrl)
      wx.login({
        success (res) {
          if (res.code) {
            const _this = this;
            let uid = wx.getStorageSync('uid');
            if(!uid){
              wx.request({
                url: baseUrl+'/v1/user/miniprogramBind', //仅为示例，并非真实的接口地址
                data: {
                  "code": res.code,
                },
                method:'POST',
                header: {
                  'content-type': 'application/json' // 默认值
                },
                success (res) {
                  console.log(res.data)
                  if(res.data.resultCode == 0){
                    wx.setStorageSync('openId', res.data.data.miniOpenid)
                    wx.setStorageSync('uid', res.data.data.uid)
                    wx.setStorageSync('session_key', res.data.data.session_key)
                    resolve(res.data.data);//uid
                  }else{
                    showMsg(res.data.resultMsg,'none',2000)
                  }
                },
                fail (res) {
                  console.log(res);
                }
              })
            }else{
              resolve(uid);
            }
  
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      })
  });
}
  

const showMsg = (msg,icon,times) => {//公共的错误提示
  wx.showToast({
    title: msg,
    icon: icon,
    duration: times
  })
}

function reservedDecimal(val, digit) {
  return Number(val).toFixed(digit);
}
const comTackPhone = (phone) =>{ 拨打电话
  wx.makePhoneCall({
    phoneNumber: phone //仅为示例，并非真实的电话号码
  })
}


module.exports = {
  getDistance,
  computedDistance,
  getLocation,
  showMsg,
  login,
  reservedDecimal,
  comTackPhone
}
