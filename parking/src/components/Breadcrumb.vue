<template>
    <div class="breadcrumb" id="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item  v-for="(item,i) in lists" :to="{ path: item.path }" :key="i">{{item.meta.title}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
</template>

<script>
export default {
  name:'breadcrumb',
  data(){
    return {
      lists:[]
    }
  },
  created(){
    this.lists = this.$route.matched
  },
  watch: {
    $route: function (newVal, oldVal) {
      if (newVal != oldVal) {
        this.lists =newVal.matched
      }
    }
  },
}
</script>

<style scoped>
  .breadcrumb{
    padding: 20px 0;
  }
</style>
