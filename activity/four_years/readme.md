#  20190306
#  author : yerongtao

##  base.css为基础样式，每一个html都应该引入base.css


##  修改图片情况

1、 bg_main.png   
首页背景图，宽度750，高度无规定。活动规则距离页面顶部450，所以主题图应该大于450

2、btn_prize.png   btn_rules.png
我的奖品和活动规则按钮，150*50

3、box_main.png
抽奖框背景图，700*900

4、bg_prize.png    bg_rules.png
我的奖品和活动规则页面背景图，750*1206


##  修改颜色情况

1、CSS 文件里面

.page{} 
设置背景颜色 - background: #ed93a7;

.bg-main,.bg-prize,.bg-rules,.bg-detail{} 
设置背景图 -  background: #ed93a7 url(../images/bg_main.png) no-repeat top center / 100%;

.notice{} 
设置滚动信息的背景颜色 - background: #fbdde1;

.luck table tr td{} 
设置8个奖品框的背景颜色 - background: #fee9e9;

.luck table tr td.active{} 
设置8个奖品框的active边框颜色 - border-color: #d0415b;

.luck table tr td.cjBtn 
设置【立即抽奖】按钮的图标 -  background: url(../images/btn_draw.png) no-repeat center /contain;