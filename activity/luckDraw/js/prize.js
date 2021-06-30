$(function () {
	openNfygApp();
    getUserPirze();
    $("#my-prize-list").on("click", ".btn-prize", function () {
        if (isApp) {
            if ($(this).hasClass("disabled")) {
                return
            } else {
                $(this).addClass("disabled");
                var obj = $(this);
                var type = parseInt(obj.attr("data-type"));
                var id = obj.attr("data-id");
                var prizeId = obj.attr("data-prizeId");
                var isReceive = obj.attr("data-isReceive");
                if (obj.hasClass("prize-get-yes")) {
                    return
                }
                switch (type) {
                    case 2:
                    case 3:
                    case 5:
                    case 6:
                        window.location.href = "./prizeMsg.html?prizeId=" + prizeId + "&prizeType=" + type + "&id=" + id;
                        obj.removeClass("disabled");
                        break;
                    case 7:
                        receivePoint(id, obj);
                        break;
                    case 1:
                        receiveRedPacket(id, obj);
                        break;
                    default:
                        break
                }
            }
        } else {
            // nfyg.otherCommon.promptShow('请前往花生地铁APP领取奖品');
			openNfygApp()
        }
    })
	
	// 关闭弹窗页面
	$(".btn-close, .popup-bg, .btn-gold-add").on("click", function () {
	    $(".popup, .win, .fail, .login, .wechat-share,.wechat-open,.btn-close").hide();
	});
});

function getUserPirze() {
	//var _mobile = sessionStorage.getItem("$mobile");
    nfyg.otherCommon.getDatanormal("post", apiurl.lists, "json", {
        "tel": mobile
    }, true, function (data) {
        console.log(data);
        if (data.code == 1) {
            var html = "";
            if (data.myPrizeList.length <= 0) {
                $(".no-prize").show();
                $("#my-prize-list").hide()
				$(".list-tips").html('')
            } else {
                $.each(data.myPrizeList, function (i, item) {
                    var isReceive = item.isReceive;
                    var type = item.type;
                    var className = "",
                        textName = "";
                    if (type == 2 || type == 3 || type == 5 || type == 6) {
                        className = "prize-see";
                        textName = "查看"
                    } else {
                        className = "prize-get";
                        textName = "领取";
                        if (isReceive == 1) {
                            className = "prize-get-yes";
                            textName = "已领取"
                        }
                    }
                    html += "<li>";
                    html += '<img src="' + item.prizeImg + '" alt="奖品" class="prize-img">';
                    html += '<div class="prize-info">';
                    html += '<p class="title">' + item.prizeName + "</p>";
                    html += '<p class="tips"><span>' + item.addTime + "</span></p>";
                    html += "</div>";
                    html += '<a href="JavaScript:;" class="btn-prize type-' + type + " " + className + '" data-type="' + type + '" data-id="' + item.id + '" data-prizeId="' + item.prizeId + '" data-isReceive="' + isReceive + '">' + textName + "</a>";
                    html += "</li>"
                });
                $("#my-prize-list").append(html);
				$(".list-tips").html('花生地铁App，左上角"我的"－"我的卡券"：查看我的奖品')
            }
        } else {
            $(".no-prize").show()
        }
    })
}

function receiveRedPacket(id, obj) {
    nfyg.otherCommon.getDatanormal("post", apiurl.receivePrize, "json", {
        "userId": userId,
        "id": id,
        "tel": mobile
    }, true, function (data) {
        console.log(data);
        if (data.code == 1) {
            nfyg.otherCommon.promptShow("红包领取成功，可前往钱包查看~");
            obj.attr("data-isReceive", "1");
            obj.removeClass("prize-get").addClass("prize-get-yes");
            obj.html("已领取")
        } else {
            nfyg.otherCommon.promptShow(data.msg)
        }
        obj.removeClass("disabled")
    })
}

function receivePoint(id, obj) {
    nfyg.otherCommon.getDatanormal("post", apiurl.receiveGold, "json", {
        "userId": userId,
        "id": id,
        "tel": mobile
    }, true, function (data) {
        console.log(data);
        if (data.code == 1) {
            nfyg.otherCommon.promptShow("金币领取成功~");
            obj.attr("data-isReceive", "1");
            obj.removeClass("prize-get").addClass("prize-get-yes");
            obj.html("已领取")
        } else {
            nfyg.otherCommon.promptShow(data.msg)
        }
        obj.removeClass("disabled")
    })
	
	
};