<template>
  <div class="content">
    <div style="width: 360px;">
      <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="渠道名称">
          <label >{{ruleForm.source}}</label>
        </el-form-item>
        <el-form-item label="油站ID">
          <label >{{ruleForm.station_id}}</label>
        </el-form-item>
        <el-form-item label="油站名称">
          <label >{{ruleForm.station_name}}</label>
        </el-form-item>
        <el-form-item label="油站logo">
         <img :src="ruleForm.logo" alt="" style="width: 100px;">
        </el-form-item>
        <el-form-item label="油站类型">
          <label >{{ruleForm.type}}</label>
        </el-form-item>
        <el-form-item label="油站省份" >
          <label >{{ruleForm.province}}</label>
        </el-form-item>
        <el-form-item label="城市" >
          <label >{{ruleForm.city}}</label>
        </el-form-item>
        <el-form-item label="区域" >
           <label >{{ruleForm.district}}</label>
        </el-form-item>
        <el-form-item label="油站地址" >
           <label >{{ruleForm.address}}</label>
        </el-form-item>
        <el-form-item label="油站经纬度">
           <label >{{ruleForm.latitude}},{{ruleForm.longitude}}</label>
        </el-form-item>
        <el-form-item label="油站电话">
           <label >{{ruleForm.phone}}</label>
        </el-form-item>
      </el-form>
    </div>

  </div>

</template>

<script>
  import {Station} from '@/config/url'
  export default{
    data(){
      return{
        ruleForm:{},
        stationId:'',
      }

    },
    mounted(){
      const _this = this;
      _this.stationId = _this.$route.query.stationId;
      _this.getDetailData();
    },
    methods:{
      getDetailData() {
        const _this = this;
        const token = localStorage.getItem('token');
        // const formData = {
        //   stationId:_this.stationId
        // }
        _this.$axios.get(Station.stationDetail+"?stationId="+_this.stationId,{headers: {'Content-Type': 'application/json','token':token}})
          .then((res) => {
            console.log(res)
            if (res.data.resultCode == 0) {
              _this.ruleForm = res.data.data;
               console.log(_this.ruleForm)
            }else if(res.data.resultCode == 3){
              localStorage.removeItem("token");
              localStorage.removeItem("userName");
              localStorage.removeItem("pwd1");
              _this.$router.push('/login');
            }else{
              // _this.$message(res.data.resultMsg);
              _this.$alert(res.data.resultMsg, '温馨提示', {
                confirmButtonText: '确定',
                 type: 'error',
                callback: action => {
                }
              });
            }
          })
          .catch((error) => {
            window.console.log(error);
          })
      },
    }
  }
</script>

<style scoped>

</style>
