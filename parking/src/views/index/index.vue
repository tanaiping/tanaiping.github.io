<template>
  <div id="index">
    <div class="index-head">
      <div class="data-elem" v-for="item in datas">
        <img :src="item.imgUrl" alt="">
        <div class="data">
          <div class="t1">{{item.txt}}</div>
          <div class="t2" :style="{color:item.color}">{{item.num}}</div>
        </div>
      </div>
    </div>
    <div style="background: #fff;padding: 20px;">
      <div id="myChart" :style="{width: '100%', height: '500px',marginTop:'20px'}"></div>
    </div>
  </div>
</template>

<script>

  export default {
    name: "index",
    data(){
      return {
        datas:[
          {
            imgUrl:require("@/assets/index_1.png"),
            txt:'待审核',
            num:'1858',
            color:"red"
          },
          {
            imgUrl:require("@/assets/index_2.png"),
            txt:'服务车辆',
            num:'5258',
            color:"#333",
          },
          {
            imgUrl:require("@/assets/index_3.png"),
            txt:'离线设备',
            num:'3652',
            color:"red"
          }
        ]
      }
    },
    mounted(){
      this.drawLine();
    },
    methods:{
    drawLine(){
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('myChart'));
        let lastDays = [];
        for (let i = 0; i < 7; i++) {
                const time = new Date(new Date().setDate(new Date().getDate() + i - 7));
                const year = time.getFullYear();
                let month = time.getMonth() + 1;
                month = (month+"").slice(-2);
                let strDate = time.getDate()+"";
                strDate = strDate.slice(-2);
                var str = year+"-"+month+"-"+strDate
                lastDays.push(str);
              }
         console.log(lastDays)
        // 绘制图表
        myChart.setOption({
             title: {
                  text: '全部网点停车流量统计',
              },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                legend: {
                    data: ['临停', '包月']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        data: lastDays
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: '临停',
                        type: 'bar',
                        emphasis: {
                            focus: 'series'
                        },
                        data: [320, 332, 301, 334, 390, 330, 320]
                    },
                    {
                        name: '包月',
                        type: 'bar',
                        stack: '广告',
                        emphasis: {
                            focus: 'series'
                        },
                        data: [120, 132, 101, 134, 90, 230, 210]
                    }
                ]
            });
      },
      

    }
  };
</script>

<style scoped>
  .index-head{
    padding: 30px 0;
    display: flex;
    flex-direction: row;
  }
  .data-elem{
    background: #FFF;
    width: 380px;
    height: 90px;
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-right: 20px;
  }
  .t1{
    line-height: 30px;
    font-size: 20px;
  }
  .t2{
    font-size: 30px;
    line-height: 30px;
  }
</style>
