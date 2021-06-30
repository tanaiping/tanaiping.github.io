<template>
  <div class="content">
    <div class="flex">
        <el-select v-model="value1" placeholder="请选择停车网点" class="mr10">
            <el-option label="南屏西苑" value="1"></el-option>
            <el-option label="县府路" value="2"></el-option>
        </el-select>
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
        value1:'1',
        dialogVisible1: false,
        placeList:[],
        data1:[]

      }

    },
    mounted(){
      this.getListData();
      //this.drawLine();
    },
    methods:{
      getListData() {
        const _this = this
        const formData = {}
        _this.$axios.get(Statistics.parkingLotLoadFactorStatistics, formData)
          .then((res) => {
            console.log(res)
            if (res.data.code == 200) {
              _this.total = res.data.total;
              console.log(res.data.rows);
              _this.contentData = res.data.rows;
              _this.contentData.forEach(function(item,index){
                _this.placeList.push(item.parkingLotName)
                _this.data1.push(item.loadRate)
              })
              _this.drawLine();
            }
          })
          .catch((error) => {
            window.console.log(error);
          })
      },
    drawLine(){
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('myChart'));
        //let placeList = ['县府路','南屏西苑','新湖路','南山大道','维也纳','天漫','科技园','腾讯大道','高新南七','三亚','院古'];
        let _this = this;
        // 绘制图表
        myChart.setOption({
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
                        data: _this.placeList,
                        axisLabel: {
                                     interval:0,
                                     rotate:270
                                   }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        axisLabel: {
                            show: true,
                            interval: 'auto',
                            formatter: '{value} %'
                            },
                        show: true
                    }
                ],
                series: [
                    {
                        type: 'bar',
                        smooth: true,
                        emphasis: {
                            focus: 'series'
                        },
                        data: _this.data1//[30 ,50, 70, 80, 100, 100, 100,44,56,34,67]
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
