// vue.config.js
module.exports = {
    // publicPath: "./",
    // publicPath: "https://cmsfile.wifi8.com/uploads/wifi/AppH5/nfygShop/",
    lintOnSave: false,
    publicPath: process.env.NODE_ENV === 'production' ? '/uploads/wifi/AppH5/nfygShop/' : '/uploads/wifi/AppH5/nfygShop/',
    productionSourceMap: false,
    // configureWebpack: config => {
    //     if (process.env.NODE_ENV === 'production') {
    //         // 为生产环境修改配置...
    //     } else {
    //         // 为开发环境修改配置...
    //     }
    // }
}