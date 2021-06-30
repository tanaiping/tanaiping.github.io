<template>
  <div class="invitation bg-public">
    <div class="head">
      <img :src="require('@/assets/title_invitation.png')" class="title" alt="">
      <div class="btn-rules" @click="isRulesPopup = true"></div>
    </div>
    <van-row class="info">
      <van-col span="8">
        <p class="line-1"><span class="number">{{inviData.num}}</span>人</p>
        <p class="line-2">办理人数</p>
      </van-col>
      <van-col span="8">
        <p class="line-1"><span class="number">{{inviData.rewardAmount}}</span>元</p>
        <p class="line-2">现金奖励</p>
      </van-col>
      <van-col span="8">
        <p class="line-3" @click="onClickToCash">立即提现</p>
        <!-- <router-link class="line-3" :to="{name: 'cash'}">立即提现</router-link> -->
      </van-col>
    </van-row>
    <div class="btn-invited btn-share pulse" @click="onClickToShare">立即分享赚现金</div>
    <van-tabs v-model="active" animated class="list" color="#FE7A2B" title-active-color="#FE7A2B" background="#FFF7D2"
      line-width="30" @click="onClickTabs">
      <van-tab title="分享排行榜">
        <van-cell-group :border='false'>
          <div class="row" v-for="(item, i) in cardRankingList" :key="i">
            <div class="left">
              <span class="number">{{i + 1}}</span>
              <img class="head-img"
                :src="item.headUrl || 'https://cmsfile.wifi8.com/uploads/wifi/AppH5/api/nfyg_head_girl.png'" alt="">
              <span class="nick-name">{{item.nickName}}</span>
            </div>
            <div class="right">
              <p class="value">奖金：<span>{{item.amount}}元</span></p>
              <p class="time">邀请人数：{{item.cnt}}人</p>
            </div>
          </div>
          <NfygEmpth v-if="isNfygEmpth1" type="save" :style="{padding: '0.5rem',margin: 'auto'}" text="一大波数据正在赶来~" />
        </van-cell-group>
      </van-tab>
      <van-tab title="我的收益">
        <van-cell-group :border='false'>
          <div class="row" v-for="(item, i) in inviteUserList" :key="i">
            <div :class="item.status == 2 ? 'left refund' : 'left'">
              <span class="number">{{i + 1}}</span>
              <img class="head-img"
                :src="item.headUrl || 'https://cmsfile.wifi8.com/uploads/wifi/AppH5/api/nfyg_head_girl.png'" alt="">
              <span class="nick-name">{{item.nickName}}</span>
            </div>
            <div class="right">
              <p :class="item.status == 2 ? 'value refund' : 'value'">奖金：<span>{{item.amount}}元</span></p>
              <p class="time">邀请日期：{{item.createTime.substring(0,10)}}</p>
              <p class="time">{{item.status == 2 ? "该用户已退款" : (item.status == 1 ? "已生效" : "待生效")}}</p>
            </div>
            <img v-if="item.status == 2" :src="require('@/assets/status_0.png')" alt="" class="icon-refund">
          </div>
          <NfygEmpth v-if="isNfygEmpth2" type="save" :style="{padding: '0.5rem',margin: 'auto'}" text="你还没有邀请奖励~" />
        </van-cell-group>
      </van-tab>
    </van-tabs>
    <!-- 活动规则弹窗 -->
    <van-popup v-model="isRulesPopup" closeable class="popup-public popup-rules" :style="{width: '6rem', top: '55%'}">
      <h4>活动规则</h4>
      <div class="line">
        <p>一、 如何分享赚钱</p>
        <p>1、点击活动页面【立即分享赚现金】按钮，分享活动至好友或朋友圈</p>
        <p>2、好友通过你分享的链接成功办理花花卡，您即可获得现金奖品。每邀1人得5元，上不封顶。</p>
        <p>注：若邀请好友期间申请退款，已发放的现金奖励将相应扣除，请知悉。</p>
      </div>
      <div class="line">
        <p>二、 如何提现</p>
        <p>现金奖励10元及以上可提现1次，将于1~3个工作日到账。</p>
      </div>
      <div class="line">
        <p>三、 特别说明</p>
        <p>1、恶意刷单等作弊行为将被取消活动资格并冻结相应现金奖励</p>
        <p>2、花生地铁可在法律允许的范围内对本规则进行适当变更或调整，相关变更或调整将公布在活动页面上，或以页面消息、公告等合适方式及时通知。</p>
        <p>3、本活动与苹果公司无关</p>
      </div>
    </van-popup>
    <!-- 选择分享方式弹窗 -->
    <van-popup v-model="isWayPopup" class="popup-public popup-way">
      <h4>选择分享方式</h4>
      <van-row class="way">
        <van-col span="8" @click="onClickToMakeImg">
          <img :src="require('@/assets/way_01.png')" alt="">
          <p>生成海报</p>
        </van-col>
        <van-col span="8" @click="onClickToLink">
          <img :src="require('@/assets/way_02.png')" alt="">
          <p>生成链接</p>
        </van-col>
        <van-col span="8" @click="onClickToInvitation">
          <img :src="require('@/assets/way_03.png')" alt="">
          <p>直接分享</p>
        </van-col>
      </van-row>
      <div class="btn-invited btn-close" @click="onClickCancelWay">关闭</div>
    </van-popup>
    <!-- 生成专属链接 -->
    <van-popup v-model="isLinkPopup" class="popup-public popup-link">
      <h4>专属链接</h4>
      <p class="text">{{linkData[linkIndex]}}</p>
      <p class="change" @click="onClickToChangeLink">换一个<img class="refresh" :src="require('@/assets/icon_refresh.png')"
          alt=""></p>
      <div class="button">
        <button class="cancel" @click="onClickToCancelLink">取消</button>
        <button class="copy" id="link-copy" :data-clipboard-text="inviLink" @click="onClickToCopyLink">复制</button>
      </div>
    </van-popup>
    <!-- 生成海报 -->
    <van-popup v-model="isImgPopup" class="popup-public popup-img" :style="{top: '55%'}">
      <div class="imageWrapper" ref="imageWrapper">
        <img class="beInvited_img" :src="require('@/assets/beInvited_0' + imgPopupQrcode + '.png')" />
        <div :class="'qrcode qrcode-' + imgPopupQrcode" id="qrcode"></div>
        <!-- <slot></slot> -->
      </div>
      <div class="btn-invited btn-share" @click="onClickToHtml2canvas">分享图片</div>
      <img class="html-2-img" :src="dataHtml2canvas" />
    </van-popup>
  </div>
</template>

<script>
  const _czc = window._czc || []
  import {
    UserUrl
  } from '../../config/url'

  import NfygEmpth from '../../components/NfygEmpty'

  import {
    browser,
    openSharePanel,
    scriptShareImg,
    getUserInfo,
    pushToLoginView
  } from '../../server/nfygCommon'

  import Clipboard from 'clipboard'
  import html2canvas from 'html2canvas'
  import QRCode from "qrcodejs2"

  export default {
    name: '',
    data() {
      return {
        shopUserInfo: "",
        active: 0,
        isRulesPopup: false,
        isWayPopup: false,
        isLinkPopup: false,
        isImgPopup: false,
        imgPopupQrcode: 1,
        inviData: {},
        cardRankingList: [],
        inviteUserList: [],
        isNfygEmpth1: false,
        isNfygEmpth2: false,
        linkData: [
          "天降外卖红包啦， 最高领31元红包！ 用这张花花卡， 还可天天领外卖红包，优惠不断， 点此免费办理 + 链接",
          "爱了！用这张卡，星巴克7折起，麦当劳饮品3.6折，肯德基8折起等。再也不用担心下午茶超支了，点此即可免费办理+链接",
          "抢！视频会员周卡1分。还有爱奇艺会员4折起，腾讯、优酷5折起等等特权，一张花花卡即可搞定。点此免费办理+链接",
          "送你一张省钱王卡！10元花出20元的价值，一年可节省5000元100项折扣特权，覆盖生活方方面面，点此即可办理+链接",
          "100项城市生活特权送给你！视频会员周卡1分抢，麦当劳饮品3.6折起，腾讯、优酷5折起，肯德基早餐6折，星巴克7折，网易云音乐黑胶VIP6.6折等等特权，点此即可免费办理+链接"
        ],
        linkIndex: this.getRandomNumber(0, 4, 1),
        inviLink: "",
        dataHtml2canvas: "",
        isQrcode: false
      }
    },
    mounted() {
      const shopUserInfo = this.$cookies.get("shopUserInfo")
      this.shopUserInfo = shopUserInfo
      this.inviLink = "https://cmsfile.wifi8.com/uploads/wifi/AppH5/nfygShop/beInvited?inviteUid=" + this
        .shopUserInfo.uid + "&nickName=" + encodeURIComponent(this.shopUserInfo.nickName)
      this.getDataList()
    },
    methods: {
      // 立即分享赚现金
      onClickToShare() {
        _czc.push(['_trackEvent', 'appencourage_06', '点击', '分享赚钱页-立即分享赚现金']);
        this.isWayPopup = true
      },
      // 立即提现
      onClickToCash() {
        _czc.push(['_trackEvent', 'appencourage_04', '点击', '分享赚钱页-立即提现']);
        this.$router.push({
          name: "cash"
        })
      },
      // 选择 - 生成海报方式
      onClickToMakeImg() {
        _czc.push(['_trackEvent', 'appencourage_07', '点击', '分享赚钱页-选择分享方式-生成海报']);
        this.isWayPopup = false;
        this.isImgPopup = true
        this.imgPopupQrcode = this.getRandomNumber(1, 4, 1)
        this.dataHtml2canvas = ""
        if (!this.isQrcode) {
          this.$nextTick(function () {
            this.createQRCode();
          })
        }
      },
      //  生成二维码
      createQRCode() {
        let _this = this;
        new QRCode('qrcode', {
          class: "code",
          width: 100,
          height: 100, // 高度
          opacity: 0,
          text: _this.inviLink, // 二维码内容
          render: 'canvas', // 设置渲染方式（有两种方式 table和canvas，默认是canvas）
          // background: '#f0f',   // 背景色
          // foreground: '#ff0'    // 前景色
        })
        _this.isQrcode = true
      },
      // 生成海报-分享图片
      onClickToHtml2canvas() {
        _czc.push(['_trackEvent', 'appencourage_11', '点击', '分享赚钱页-生成海报-分享图片']);
        let nfygUserInfo = JSON.parse(getUserInfo())
        if (browser.isNfyg && !nfygUserInfo.userId) {
          pushToLoginView()
        }
        html2canvas(this.$refs.imageWrapper, {
            backgroundColor: null,
            scale: 2
          }).then((canvas) => {
            let dataHtml2canvas = canvas.toDataURL("image/png");
            this.dataHtml2canvas = dataHtml2canvas;
            // 发送请求
            if (browser.isNfyg) {
              const _this = this
              let formData = JSON.stringify({
                "picture": dataHtml2canvas,
                "userId": nfygUserInfo.userId,
                "type": "nfygShop"
              })
              _this.$axios.post("https://cmsapi.wifi8.com/v2/pic/uploadType", formData)
                .then((res) => {
                  if (res.status === 200) {
                    const shareImgUrl = 'https://cmsfile.wifi8.com/' + res.data.data.url
                    scriptShareImg(1, shareImgUrl, 2)
                  }
                })
            } else {
              this.$toast("长按保存图片！")
            }
          })
          .catch((error) => {
            window.console.error(error);
          })
      },
      // 选择 - 生成链接方式
      onClickToLink() {
        _czc.push(['_trackEvent', 'appencourage_08', '点击', '分享赚钱页-选择分享方式-生成链接']);
        this.isWayPopup = false
        this.isLinkPopup = true
      },
      // 生成链接-换一个
      onClickToChangeLink() {
        _czc.push(['_trackEvent', 'appencourage_16', '点击', '分享赚钱页-生成链接-换一个']);
        this.linkIndex = this.getRandomNumber(0, 4, 1)
      },
      // 生成链接-复制
      onClickToCopyLink() {
        _czc.push(['_trackEvent', 'appencourage_14', '点击', '分享赚钱页-生成链接-复制']);
        let clipboard = new Clipboard('#link-copy');
        clipboard.on('success', () => {
          this.$toast("复制成功")
          window.location.href = "weixin://"
          // 释放内存
          clipboard.destroy()
        })
        clipboard.on('error', () => {
          this.$toast("该浏览器不支持自动复制")
          // 不支持复制
          // 释放内存
          clipboard.destroy()
        })
      },
      // 生成链接-取消
      onClickToCancelLink() {
        _czc.push(['_trackEvent', 'appencourage_15', '点击', '分享赚钱页-生成链接-取消']);
        this.isLinkPopup = false
      },
      // 选择 - 直接打开微信分享
      onClickToInvitation() {
        _czc.push(['_trackEvent', 'appencourage_09', '点击', '分享赚钱页-选择分享方式-直接分享']);
        const inviData = {
          url: this.inviLink,
          img: "https://cmsfile.wifi8.com/uploads/wifi/AppH5/nfygShop/img/share_invitation.png",
          title: "100项城市生活特权送给你！",
          text: "视频会员周卡1分抢，当劳饮品3.6折起，腾讯、优酷5折起，肯德基早餐6折，星巴克7折，网易云音乐黑胶VIP6.6折等等特权，点此即可免费办理>"
        }
        if (browser.isNfyg) {
          openSharePanel(inviData.url, inviData.img, inviData.title, inviData.text)
        } else if (browser.weixin) {
          this.$toast("微信 --- 暂时不支持花生地铁APP以外分享")
        } else {
          this.$toast("暂时不支持花生地铁APP以外分享")
        }
      },
      // 获取基础数据
      getDataList() {
        const _this = this
        const formData = {
          "uid": this.shopUserInfo.uid,
        }
        _this.$axios.post(UserUrl.detailShare, formData)
          .then((res) => {
            // window.console.log(res);
            if (res.data.resultCode == 0) {
              _this.inviData = res.data.data
              _this.cardRankingList = res.data.data.cardRankingList
              _this.inviteUserList = res.data.data.inviteUserList
              if (_this.cardRankingList.length > 0) {
                _this.isNfygEmpth1 = false
              } else {
                _this.isNfygEmpth1 = true
              }
              if (_this.inviteUserList.length > 0) {
                _this.isNfygEmpth2 = false
              } else {
                _this.isNfygEmpth2 = true
              }
            }
          })
          .catch((error) => {
            window.console.log(error);
          })
      },
      // 获取随机数
      getRandomNumber(start, end, n) {
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
      },
      // 切换tab
      onClickTabs(name) {
        if (name == 0) {
          _czc.push(['_trackEvent', 'appencourage_02', '点击', '分享赚钱页-分享排行榜']);
        } else {
          _czc.push(['_trackEvent', 'appencourage_03', '点击', '分享赚钱页-我的收益']);
        }
      },
      // 关闭
      onClickCancelWay() {
        _czc.push(['_trackEvent', 'appencourage_10', '点击', '分享赚钱页-选择分享方式-关闭']);
        this.isWayPopup = false
      }
    },
    components: {
      NfygEmpth
    }
  }
</script>

<style lang="less" scoped>
  .invitation {
    background: #ffad2f url(../../assets/bg_invitation.png) no-repeat center top / 100%;

    .head {
      .title {
        width: 7.17rem;
        margin: auto;
        margin-top: 0.94rem;
        margin-left: 0.2rem;
      }

      .btn-rules {
        position: absolute;
        top: 0.2rem;
        right: 0;
        width: 1.49rem;
        height: 0.5rem;
        background: url(../../assets/btn_invitation.png) no-repeat center /contain;
      }
    }

    .info {
      display: flex;
      width: 6.3rem;
      margin: auto;
      margin-top: 3.68rem;
      text-align: center;
      font-size: 0.26rem;
      color: #333;

      .van-col {
        background: #FFF7D2;
        border-radius: 0.1rem;
        padding: 0.3rem 0;
        margin: 0 0.15rem;

        .line-1 {
          color: #FE7A2B;

          .number {
            font-size: 0.46rem;
          }
        }

        .line-3 {
          font-size: 0.3rem;
          font-weight: bold;
          color: #FE7A2B;
          line-height: 1rem;
        }
      }
    }

    .btn-share {
      margin: auto;
      margin-top: 0.4rem;
    }

    .list {
      width: 6.9rem;
      margin: auto;
      margin-top: 0.6rem;
      border-radius: 0.1rem 0.1rem 0 0;
      overflow: hidden;

      .van-cell-group {
        min-height: 3.2rem;
      }
    }
  }

  .row {
    position: relative;
    display: flex;
    padding: 0.2rem 0.3rem;
    border-bottom: solid 1px #eee;
    background: #fff;

    .left {
      margin: auto;
      margin-left: 0;

      .number {
        font-size: 0.2rem;
      }

      .head-img {
        width: 0.68rem;
        height: 0.68rem;
        border-radius: 50%;
        margin: auto;
        margin-left: 0.1rem;
      }

      .nick-name {
        font-size: 0.26rem;
        margin: auto;
        margin-left: 0.1rem;
      }
    }

    .left.refund {
      color: #999;
    }

    .right {
      margin: auto;
      margin-right: 0;
      font-size: 0.26rem;
      color: #999;
      text-align: right;

      .value {
        color: #333;

        span {
          // margin-left: 0.15rem;
          color: #FE7A2B;
          font-weight: bold;
        }
      }

      .value.refund {
        color: #999;
      }
    }

    .icon-refund {
      position: absolute;
      width: 2.24rem;
      right: 0.7rem;
      top: 0.3rem;
    }
  }

  .popup-rules {
    text-align: left;
    padding: 0.3rem;

    h4 {
      margin-bottom: 0.2rem;
      text-align: center;
      font-size: 0.32rem;
      color: #333
    }

    .line {
      margin-top: 0.2rem;
    }

    p {
      font-size: 0.28rem;
      color: #333;
    }
  }

  .popup-way {
    .way {
      display: flex;
      padding: 0.5rem 0.3rem;
      font-size: 0.26rem;
      color: #333;

      img {
        width: 1rem;
        height: 1rem;
        margin-bottom: 0.2rem;
      }
    }

    .btn-close {
      margin: auto;
      margin-bottom: 0.4rem;
      width: 2.8rem;
      height: 0.62rem;
      line-height: 0.62rem;
      font-size: 0.26rem;
    }
  }

  .popup-link {
    .text {
      margin: 0.3rem;
      padding: 0.3rem 0.2rem;
      font-size: 0.26rem;
      color: #916B3A;
      background: #FFF7D2;
      border-radius: 0.1rem;
    }

    .change {
      color: #999;
      font-size: 0.24rem;
      margin-top: 0.24rem;

      .refresh {
        width: 0.35rem;
        height: 0.35rem;
        margin-left: 0.15rem;
      }
    }

    .button {
      .copy {
        color: #916B3A;
      }
    }

  }

  .popup-img {
    padding: 0;
    background: none;

    .qrcode {
      canvas {
        opacity: 0;
      }
    }

    .qrcode-1 {
      width: 1.68rem;
      height: 1.68rem;
      margin: auto;
      left: 0.8rem;
      top: 6.8rem;
      position: absolute;
      border: solid 2px #fff;
      overflow: hidden;
    }

    .qrcode-2 {
      width: 1.85rem;
      height: 1.85rem;
      margin: auto;
      left: 0;
      right: 0;
      top: 4.5rem;
      position: absolute;
      border: solid 2px #fff;
      overflow: hidden;
    }

    .qrcode-3 {
      width: 1.68rem;
      height: 1.68rem;
      margin: auto;
      left: 0.58rem;
      top: 6.8rem;
      position: absolute;
      border: solid 2px #fff;
      overflow: hidden;
    }

    .qrcode-4 {
      width: 1.68rem;
      height: 1.68rem;
      margin: auto;
      left: 0.5rem;
      top: 6.8rem;
      position: absolute;
      border: solid 2px #fff;
      overflow: hidden;
    }

    .btn-share {
      width: 4.8rem;
      margin: auto;
      margin-top: 0.25rem;
    }

    .html-2-img {
      position: absolute;
      margin: auto;
      left: 0;
      right: 0;
      top: 0;
      z-index: 999;
      opacity: 0.01;
    }
  }
</style>