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
 .flex-search .el-input{
   margin-bottom: 20px;
 }
 .flex-search .el-select .el-input
 {
   margin-bottom: 0;
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
  .form-static-tips2{
    color: #606266;
    margin-left: 10px;
  }
  .ellipsis{
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .el-dialog__body{
    padding-bottom: 0;
  }
</style>
