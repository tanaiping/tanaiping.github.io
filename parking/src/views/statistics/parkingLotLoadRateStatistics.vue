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
            <el-option label="按季度" value="4"></el-option>
            <el-option label="按年度" value="5"></el-option>
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
  export default{
    data(){
      return{
        value1:'',
        value2:'',
        value3:'',
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
         //console.log(lastDays)
        // 绘制图表
        myChart.setOption({
             title: {
                  text: '周转率统计',
              },
                tooltip: {
                    trigger: 'axis',
                    formatter:'{b}:{c}',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
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
                        type: 'line',
                        smooth: true,
                        stack: '广告',
                        emphasis: {
                            focus: 'series'
                        },
                        data: [1.56, 1.32, 1.01, 1.34, 0.9, 2.30, 2.10]
                    }
                ]
            });
      },

    }
  }
</script>

<style scoped>
  .page-title{
    display: flex;
    justify-content: space-between;
    padding: 20px;
    height: 40px;
    line-height: 40px;
    background-color: #c1c4c7;
  }
  .page{
    display: flex;
    justify-content: flex-end;
    padding: 10px;
  }
</style>
