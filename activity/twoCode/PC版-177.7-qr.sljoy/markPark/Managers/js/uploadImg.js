
layui.use(['jquery','element','upload'], function(){
  var element = layui.element
    ,$ = layui.$  //重点之处。 引入jquery
    ,upload = layui.upload

  //上传图 单张
    upload.render({ //允许上传的文件后缀
      elem: '#upload_file_banner1,reupload_file_banner1'
      ,url: basePath+'/sys/upload/img'
      ,headers: {token: token}
      ,accept: 'images' //普通文件
      ,exts: 'jpg|png|gif|bmp|jpeg'
      ,size: 2048  //kb
      ,auto:false
      , choose: function(obj) {
          obj.preview(function(index, file, result) {
            var img = new Image();
            img.onload = function() {
              console.log('choose poster', img.width, img.height);

              // obj.upload(index, file);
              // if ('750' == img.width && '320' == img.height) {
                //$('.detail_logo').attr('src', result).removeClass('default'); //图片链接（base64）不支持ie8
                obj.upload(index, file);
              // } else {
              //   layer.msg('图片尺寸必须为： 750px x 320px', {icon: 5});
              // }
            };
            img.src = result;
          });
        }
      ,before: function(obj){ 
        layer.load();
      }
      ,done: function(data){
        layer.closeAll('loading');
        //console.log(data);
        if(data.resultCode==0){
           $("#upload_file_banner1").parents(".banner-wrap").siblings('.detail_logo').attr('src', data.data.url).removeClass('default'); //图片链接（base64）不支持ie8
           $("#upload_file_banner1").parents(".banner-uploadbox").addClass("has");
        }else if(data.resultCode==3){
            localStorage.removeItem('role');
            localStorage.removeItem('token');
            top.location.href="/cms/login.html?"+Math.random();
        }else{
          layer.closeAll('loading');
          // layer.alert('上传失败，请重试！');
          layer.msg(data.resultMsg, {icon: 5});
        }
      }
    });

    //上传图  多张
    upload.render({ //允许上传的文件后缀
      elem: '#upload_legal_banners'
      ,url: basePath+'/sys/upload/img'
      ,headers: {token: token}
      ,accept: 'images' //普通文件
      ,exts: 'jpg|png|gif|bmp|jpeg'
      ,size: 2048  //kb
      ,auto:false
      ,multiple:true
      ,number:5
      , choose: function(obj) {
          obj.preview(function(index, file, result) {
            var img = new Image();
            img.onload = function() {
              console.log('choose poster', img.width, img.height);
              // obj.upload(index, file);
              // if ('750' == img.width && '312' == img.height) {
                obj.upload(index, file);
              // } else {
              //   layer.msg('图片尺寸必须为： 750px x 312px', {icon: 5});
              // }
            };
            img.src = result;
          });
        }
      ,before: function(obj){ 
        layer.load();
      }
      ,done: function(data){
        layer.closeAll('loading');

        console.log(data);
        if(data.resultCode==0){
           // $('.detail_logo').attr('src', data.data.url).removeClass('default'); //图片链接（base64）不支持ie8
           var isflag=false;
            $(".upload-banner-img").each(function(x){
              if($(this).hasClass("default")){
                $("#upload_legal_banner"+(x+1)).parents(".banner-wrap").siblings('.upload-banner-img').attr('src', data.data.url).removeClass('default'); //图片链接（base64）不支持ie8
                $("#upload_legal_banner"+(x+1)).parents(".banner-uploadbox").addClass("has");
                isflag = true;
                return false;
              }
            })
            if(isflag ==false){
              layer.msg('最多上传5张，请删除后重新上传', {icon: 5});
            }
           
        }else if(data.resultCode==3){
            localStorage.removeItem('role');
            localStorage.removeItem('token');
            top.location.href="/cms/login.html?"+Math.random();
        }else{
          layer.closeAll('loading');
          // layer.alert('上传失败，请重试！');
          layer.msg(data.resultMsg, {icon: 5});
        }
      }
    });
	

    

});
    