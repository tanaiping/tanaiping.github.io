<template>
  <div class="menu">
    <el-menu-item :index="item.url + ''" v-if="!item.child">
      <span slot="title" >{{item.name}}</span>
    </el-menu-item>
    <el-submenu :index="item.url + ''" v-else>
      <template slot="title">
        <span>{{item.name}}</span>
      </template>
      <MenuItem v-for="v in item.child" :key = "v.url" :item="v"/>  <!-- 递归  根据name来  自己调自己  -->
    </el-submenu>
  </div>
</template>

<script>
  export default {
    name:'MenuItem',
    data(){
        return {}
    },
    props:['item'],
    methods:{
    }
 }

</script>

<style>
</style>
