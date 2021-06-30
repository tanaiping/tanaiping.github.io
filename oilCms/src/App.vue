<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #333;
  height: 100%;
}
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
.mt20{
  margin-top: 20px;
}
.mr20{
  margin-right: 20px;
}
.mr10{
  margin-right: 10px;
}
.filter-box{
  display: flex;
  justify-content: space-between;
  height: 40px;
  line-height: 40px;
  padding: 20px;
  border-bottom: 1px solid #ccc;
}
.filter-input{
  width: 200px;
}
.el-breadcrumb__separator{
    color: #657492;
 }
 .flex-end{
   display: flex;
   justify-content: flex-end;
 }
 .flex-between{
   display: flex;
   justify-content: space-between;
 }
 .flex{
   display: flex;
 }
 .flex-search{
  display: flex;
  flex-wrap: wrap;
 }
 .flex-search .el-input,.flex-search .el-select{
   margin-bottom: 20px;
   height: 40px;
 }
 .flex-search .el-button{
   height: 40px;
   line-height: 40px;
   padding: 0 20px;
  }
  .title-com{
    font-size: 20px;
    color: #000;
    line-height: 50px;
  }
  .form-static-tips{
    color: #f56c6c;
    margin-left: 10px;
  }
</style>
