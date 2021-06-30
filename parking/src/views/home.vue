<template>
  <div id="home">
    <el-container style="height: 100%;">
      <el-aside width="200px">
        <div class="logo">智能停车</div>
        <Menu />
      </el-aside>
      <el-container>
        <el-header>
          <div class="flex-between">
            <Breadcrumb />
            <!-- <el-button type="primary" style="margin-top: 10px; height: 40px;">退出</el-button> -->
          </div>

        </el-header>
        <el-main>
          <router-view />
        </el-main>
        <!-- <el-footer>Footer</el-footer> -->
      </el-container>
    </el-container>
  </div>
</template>

<script>
  import Menu from '@/components/Menu'
  import Breadcrumb from '@/components/Breadcrumb'
export default {
  name: "home",
  components:{
    Menu,
    Breadcrumb,
  }
};
</script>

<style>
.logo{
  font-size: 26px;
  letter-spacing: 10px;
  text-align: center;
  line-height: 60px;
}
.flex-between{
  display: flex;
  justify-content: space-between;

}
#home{
  height: 100%;
}
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  line-height: 80px;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  padding:20px;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
</style>
