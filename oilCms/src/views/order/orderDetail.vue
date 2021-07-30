<template>
  <div class="content">
    <div :style="{'width': '360px','height':conH+'px','overflow':'auto','width':'100%'}">
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
        orderId:'',
        conH:0
      }

    },
    components:{
      orderDetail
    },
    mounted(){
      const _this = this;
      _this.orderNo = _this.$route.query.orderNo;
      _this.$nextTick(() => {
          _this.getConH();
      });
      window.onresize = () => {
         return (() => {
           _this.getConH();
         })()
       }
      _this.getOrderDetail()
    },
    methods:{
      getConH(){
        const _this = this;
        let clientH = document.body.clientHeight || document.documentElement.clientHeight;
        let conH = clientH - 60 - 20;
        _this.conH = conH;
      },
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
