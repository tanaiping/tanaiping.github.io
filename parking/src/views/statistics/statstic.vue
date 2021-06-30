<template>
  <div class="content">
    <div class="flex">
        <el-select v-model="value1" placeholder="请选择停车网点" class="mr10">
            <el-option label="建设路" value="1"></el-option>
            <el-option label="明生路" value="2"></el-option>
        </el-select>
        <el-select v-model="value2" placeholder="请选择统计类型" class="mr10">
            <el-option label="日期" value="1"></el-option>
            <el-option label="按周" value="2"></el-option>
            <el-option label="按月份" value="3"></el-option>
        </el-select>
        <el-date-picker
              v-model="value3"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期" class="mr10">
            </el-date-picker>
        <el-button  icon="el-icon-refresh">重置</el-button>
        <el-button type="primary"  icon="el-icon-search">搜索</el-button>
    </div>
    <!-- 过虑条件  end-->
    <!-- 标题  end-->
    <div class="mt20" style="padding: 20px;">
        <div id="myChart" :style="{width: '100%', height: '500px',marginTop:'20px'}"></div>
    </div>

  </div>

</template>

<script>
   import {Statistics} from '@/config/url'
  export default{
    data(){
      return{
        value1:'',
        value2:'',
        value3:'',
      }

    },
    mounted(){
      this.getListData();
      this.drawLine();
    },
    methods:{
      getListData() {
        const _this = this
        const formData = {}
        _this.$axios.get(Statistics.statstic, formData)
          .then((res) => {
            console.log(res)
            if (res.data.code == 200) {
              this.total = res.data.total;
              console.log(res.data.rows);
              this.contentData = res.data.rows;
            }
          })
          .catch((error) => {
            window.console.log(error);
          })
      },
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
                  text: '单个网点停车流量统计',
              },
                tooltip: {
                    trigger: 'axis',
                    formatter:'{b}:{c}',
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
                        type: 'line',
                        smooth: true,
                        emphasis: {
                            focus: 'series'
                        },
                        data: [320, 332, 301, 334, 390, 330, 320]
                    },
                    {
                        name: '包月',
                        type: 'line',
                        smooth: true,
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
  }
</script>

<style scoped>
</style>
