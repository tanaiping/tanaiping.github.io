<template>
  <div class="content">
    <div style="width: 360px;">
      <orderDetail :detailData = "contentData"></orderDetail>
    </div>

  </div>

</template>

<script>
   import {Order} from '@/config/url'
  import orderDetail from '@/components/orderDetail'
  export default{
    data(){
      return{
        contentData:{},
        orderId:''
      }

    },
    components:{
      orderDetail
    },
    mounted(){
      this.orderNo = this.$route.params.orderNo;
      this.getOrderDetail()
    },
    methods:{
      getOrderDetail(){
        const _this = this;
        const token = localStorage.getItem('token');
        // const formData = {
        //   orderNo:_this.orderNo,
        // }
        _this.$axios.get(Order.getDetail+"?orderNo="+_this.orderNo,{headers: {'Content-Type': 'application/json','token':token}})
          .then((res) => {
            // console.log(res)
            if (res.data.resultCode == 0) {
              _this.contentData = res.data.data;
            }else if(res.data.resultCode == 3){
              localStorage.removeItem("token");
              localStorage.removeItem("userName");
              localStorage.removeItem("pwd1");
              _this.$router.push('/login');
            }else{
              _this.$message(res.data.resultMsg);
            }
          })
          .catch((error) => {
            window.console.log(error);
          })
      }
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
