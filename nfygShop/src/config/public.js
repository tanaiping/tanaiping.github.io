export const regFenToYuan = (fen) => {
    let num = fen;
    num = fen * 0.01;
    num += '';
    let reg = num.indexOf('.') > -1 ? /(\d{1,3})(?=(?:\d{3})+\.)/g : /(\d{1,3})(?=(?:\d{3})+$)/g;
    num = num.replace(reg, '$1');
    num = toDecimal2(num)
    return num
}
export const toDecimal2 = (x) => {
    let f = parseFloat(x);
    if (isNaN(f)) {
        return false;
    }
    let f1 = Math.round(x * 100) / 100;
    let s = f1.toString();
    let rs = s.indexOf('.');
    if (rs < 0) {
        rs = s.length;
        s += '.';
    }
    while (s.length <= rs + 2) {
        s += '0';
    }
    return s;
}

export const onlineService = () => {
    // window.NTKF.im_openInPageChat('kf_9500_1578019276868')
    const name = "shopUserInfo"
    const reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    const arr = document.cookie.match(reg)
    // const shopUserInfo = ""
    const shopUserInfo = arr ? JSON.parse(unescape(decodeURI(arr[2]))) : ""
    window.console.log("请求客服");
    window.console.log(shopUserInfo);
    const nickName = shopUserInfo ? shopUserInfo.nickName : "";
    const phone = shopUserInfo ? shopUserInfo.uid : ""
    window.location.href = "https://im.7x24cc.com/phone_webChat.html?accountId=N000000017802&chatId=b9b9967b-d6da-48c5-8836-a4bc483ef798" + "&visitorId=" + phone + "&nickName=" + nickName + "&phone=" + phone
}

export const getRandomNumber = (start, end, n) => {
    let arr = [];
    for (let i = 0; i < n; i++) {
        let number = Math.floor(Math.random() * (end - start + 1) + start);
        if (arr.indexOf(number) < 0) {
            arr.push(number)
        } else {
            i--
        }
    }
    return arr
}