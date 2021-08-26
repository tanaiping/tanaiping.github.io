var docEle = document.documentElement, //获取html元素
event = "onorientationchange" in window ? "orientationchange" : "resize", //判断是屏幕旋转还是resize;
fn = function () {
    var width = docEle.clientWidth;
    if (width > 750) {
        docEle.style.fontSize = "100px";
    } else {
        width && (docEle.style.fontSize = 100 * (width / 750) + "px"); //设置html的fontSize，随着event的改变而改变。
    }
};
window.addEventListener(event, fn, false);
document.addEventListener("DOMContentLoaded", fn, false);
window.onresize = function () {
    fn();
};