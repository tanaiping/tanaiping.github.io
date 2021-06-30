
const parkUrl = "http://106.75.36.221:8000/stage-api"

// 商品模块接口
export const Park = {
    list: parkUrl + "/parking/parkingLot/list",
    plcaceM: parkUrl + '/parking/parkingSpace/list',

}

export const Car = {
    carList: parkUrl + "/parking/car/list", //500 不通
    audit1: parkUrl +'/parking/user/car/list', //人员审核
    audit2: parkUrl + '/parking/user/car/re/check/list', //复核
    listApply: parkUrl + '/parking/car/listApply', //复核
    record: parkUrl + '/parking/user/car/install/list', //复核
}
export const Charge = {
    setting: parkUrl + "/parking/setting/list",
    monthly: parkUrl + "/monthly/list",
    monthlyRegister: parkUrl + "/monthlyRegister/query",
    transfer: parkUrl + "/monthly/transferList",
    orderManager: parkUrl + "/parking/statistics/queryOrderSumDetail",
}

export const Statistics = {
    parkingDetailStatistics: parkUrl + "/parking/statistics/getParkingDetail",
    parkingCarStatistics: parkUrl + "/parking/statistics/parkingCarStatistics",
    monthCarStatistics: parkUrl + "/parking/statistics/monthCarStatistics",
    statstic: parkUrl + "/parking/statistic/list/allOrderStastic",
    parkingEventStatistics: parkUrl + "/parking/statistics/getParkingEvent",
    parkingLotLoadRateStatistics: parkUrl + "/parking/statistics/getLoadRateByTime",
    incomeTotal: parkUrl + "/parking/income/total",
    parkingLotLoadFactorStatistics: parkUrl + "/parking/statistics/getParkingLoadFactor",
    orderSum: parkUrl + "/parking/statistics/queryOrderSum",
    orderPay: parkUrl + "/parking/statistics/queryOrderPay",

}

export const Device = {
    device: parkUrl + "/parking/device/list",
    pda: parkUrl + "/parking/device/pdalist",
}
export const Fee = {
    feeRuleGroup: parkUrl + "/parking/feeRuleGroup/list",
    feerule: parkUrl + "/parking/feerule/list",

}
