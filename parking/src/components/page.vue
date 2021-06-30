<template>
  <div id="pagitation">
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page.sync="curPage"
      :page-size="pageSize"
      layout="total, prev, pager, next"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
  export default{
    props:{
      "pageSize":{
        type:Number,
        required:true
      },
      cur:{
        type:Number,
        required:true
      },
      total:{
        type:Number,
        required:true
      }
    },
    data(){
      return{
        curPage:1,
      }

    },
    methods:{
        handleCurrentChange(val) {
          this.$emit("pageChange",val)
        }
    },
    mounted() {
      this.curPage = this.cur;
    }

  }
</script>

<style>
</style>
