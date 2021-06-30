
// const baseUrl = "http://192.168.1.118:7788" //玉芳
const baseUrl = "http://192.168.201.153:7788"  // ceshi
// const baseUrl = "http://192.168.1.147:7788" //liming

export const Login = {
    login: baseUrl + "/sys/account/admin/login",
    logout: baseUrl + '/sys/account/logout',
    editPwd: baseUrl + '/sys/account/editPwd.ajax',
    addEmployee: baseUrl + '/sys/account/addEmployee',
    editEmployee: baseUrl + '/sys/account/editEmployee',
    employeeList: baseUrl + '/sys/account/employeeList',
    switchEmployeeStatue: baseUrl + '/sys/account/switchEmployeeStatue',
}
export const User = {
    userInfoCount: baseUrl + '/sys/account/userInfoCount',
    userInfoList: baseUrl + '/sys/account/userInfoList',
}

export const Station = {
    stationList: baseUrl + "/sys/oil/getOilStationList",
    stationDetail: baseUrl + '/sys/oil/getOilStationDetail',

}
export const Price = {
    list: baseUrl + "/sys/oil/getList",
    batchReviseOilPrice: baseUrl + '/sys/oil/batchReviseOilPrice',//批量改价
    detail: baseUrl + '/sys/oil/getOilInfoDetail',
    reviseOilPrice: baseUrl + '/sys/oil/reviseOilPrice',
}
export const Statistics = {
    orderList: baseUrl + "/sys/orderReport/orderList",
    getCityList: baseUrl + '/sys/getCityList',
    exportOrderList: baseUrl + '/sys/orderReport/exportOrderList',
}
export const Order = {
    orderList: baseUrl + "/sys/oil/getOrderList",
    getDetail: baseUrl + '/sys/oil/getOrderDetail',
    exportOrderList: baseUrl + '/sys/oil/exportOrderList',
    cancelOrder: baseUrl + '/sys/oil/cancelOrder',


}