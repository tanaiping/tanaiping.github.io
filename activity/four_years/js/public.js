!(function (doc, win) {
  var docEle = doc.documentElement, //获取html元素
    event = "onorientationchange" in window ? "orientationchange" : "resize", //判断是屏幕旋转还是resize;
    fn = function () {
      var width = docEle.clientWidth;
      if (width > 750) {
        docEle.style.fontSize = "100px";
      } else {
        width && (docEle.style.fontSize = 100 * (width / 750) + "px"); //设置html的fontSize，随着event的改变而改变。
      }
    };
  win.addEventListener(event, fn, false);
  doc.addEventListener("DOMContentLoaded", fn, false);
  win.onresize = function () {
    fn();
  };
})(document, window);

function promptShow(msg) {
$('#prompt').children('em').html(msg);
$('#prompt').show();
window.setTimeout(function () {
  $('#prompt').hide();
}, 2500);
}
