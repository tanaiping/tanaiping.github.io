
layui.use(['jquery','element','upload'], function(){
  var element = layui.element
    ,$ = layui.$  //重点之处。 引入jquery
    ,upload = layui.upload

  //上传券详情logo 单张
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
              if ('750' == img.width && '320' == img.height) {
                //$('.detail_logo').attr('src', result).removeClass('default'); //图片链接（base64）不支持ie8
                obj.upload(index, file);
              } else {
                layer.msg('图片尺寸必须为： 750px x 320px', {icon: 5});
              }
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

    upload.render({ //允许上传的文件后缀
      elem: '#upload_file_banner2'
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
              if ('750' == img.width && '320' == img.height) {
                //$('.detail_logo').attr('src', result).removeClass('default'); //图片链接（base64）不支持ie8
                obj.upload(index, file);
              } else {
                layer.msg('图片尺寸必须为： 750px x 320px', {icon: 5});
              }
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
           $("#upload_file_banner2").parents(".banner-wrap").siblings('.detail_logo').attr('src', data.data.url).removeClass('default'); //图片链接（base64）不支持ie8
           $("#upload_file_banner2").parents(".banner-uploadbox").addClass("has");
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

    upload.render({ //允许上传的文件后缀
      elem: '#upload_file_banner3'
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
              if ('750' == img.width && '320' == img.height) {
                //$('.detail_logo').attr('src', result).removeClass('default'); //图片链接（base64）不支持ie8
                obj.upload(index, file);
              } else {
                layer.msg('图片尺寸必须为： 750px x 320px', {icon: 5});
              }
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
           $("#upload_file_banner3").parents(".banner-wrap").siblings('.detail_logo').attr('src', data.data.url).removeClass('default'); //图片链接（base64）不支持ie8
           $("#upload_file_banner3").parents(".banner-uploadbox").addClass("has");
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

    upload.render({ //允许上传的文件后缀
      elem: '#upload_file_banner4'
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
              if ('750' == img.width && '320' == img.height) {
                //$('.detail_logo').attr('src', result).removeClass('default'); //图片链接（base64）不支持ie8
                obj.upload(index, file);
              } else {
                layer.msg('图片尺寸必须为： 750px x 320px', {icon: 5});
              }
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
           $("#upload_file_banner4").parents(".banner-wrap").siblings('.detail_logo').attr('src', data.data.url).removeClass('default'); //图片链接（base64）不支持ie8
           $("#upload_file_banner4").parents(".banner-uploadbox").addClass("has");
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

    upload.render({ //允许上传的文件后缀
      elem: '#upload_file_banner5'
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
              if ('750' == img.width && '320' == img.height) {
                //$('.detail_logo').attr('src', result).removeClass('default'); //图片链接（base64）不支持ie8
                obj.upload(index, file);
              } else {
                layer.msg('图片尺寸必须为： 750px x 320px', {icon: 5});
              }
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
           $("#upload_file_banner5").parents(".banner-wrap").siblings('.detail_logo').attr('src', data.data.url).removeClass('default'); //图片链接（base64）不支持ie8
           $("#upload_file_banner5").parents(".banner-uploadbox").addClass("has");
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


    //上传券详情logo  多张
    upload.render({ //允许上传的文件后缀
      elem: '#upload_file_detail_more'
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
              if ('750' == img.width && '320' == img.height) {
                //$('.detail_logo').attr('src', result).removeClass('default'); //图片链接（base64）不支持ie8
                //index = parseInt(index.substring(index.length-1));
                //$("#upload_file_banner"+(index+1)).parents(".banner-wrap").siblings('.detail_logo').attr('src', result).removeClass('default'); //图片链接（base64）不支持ie8
                //$("#upload_file_banner"+(index+1)).parents(".banner-uploadbox").addClass("has");

                
                obj.upload(index, file);

              } else {
                layer.msg('图片尺寸必须为： 750px x 320px', {icon: 5});
              }
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
            $(".detail_logo").each(function(x){
              if($(this).hasClass("default")){
                $("#upload_file_banner"+(x+1)).parents(".banner-wrap").siblings('.detail_logo').attr('src', data.data.url).removeClass('default'); //图片链接（base64）不支持ie8
                $("#upload_file_banner"+(x+1)).parents(".banner-uploadbox").addClass("has");
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

   

    

    //上传券列表logo
    upload.render({ //允许上传的文件后缀
      elem: '#upload_file_list'
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
              if ('144' == img.width && '144' == img.height) {
                //$('.list_logo').attr('src', result).removeClass('default'); //图片链接（base64）不支持ie8
                obj.upload(index, file);
              } else {
                layer.msg('图片尺寸必须为： 144px x 144px', {icon: 5});
              }
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
        	 $('.list_logo').attr('src', data.data.url).removeClass('default'); //图片链接（base64）不支持ie8
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


    upload.render({ //允许上传的文件后缀
      elem: '#banner_logo'
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
              if ('650' == img.width && '204' == img.height) {
                //$('.list_logo').attr('src', result).removeClass('default'); //图片链接（base64）不支持ie8
                obj.upload(index, file);
              } else {
                layer.msg('图片尺寸必须为： 650px x 204px', {icon: 5});
              }
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
           $('.banner-logo').attr('src', data.data.url).removeClass('default'); //图片链接（base64）不支持ie8
           $(".banner-logo").parents(".top-uploadbox").addClass("has");
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
    