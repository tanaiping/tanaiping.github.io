'use strict'
module.exports = {
  NODE_ENV: '"production"',
  publicPath: "/oilCms/", //打包后部署在一个子路径上http:xxx/test/
  productionSourceMap: false,
//   devServer: {
//       // proxy: "http://xxxx.com", //测试或正式环境域名和端口号
// 
//       // history模式下的url会请求到服务器端，但是服务器端并没有这一个资源文件，就会返回404，所以需要配置这一项
//       historyApiFallback: {
//           index: '/index.html' //与output的publicPath
//       },
//   },
}
