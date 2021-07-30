<template>
  <div id="pagitation">
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page.sync="curPage"
      :page-size="pageSize"
      layout="total, prev, pager, next,jumper"
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
      const _this = this;
      let p = parseInt(sessionStorage.getItem('his_page'));
      p?(_this.curPage = p):(_this.curPage = _this.cur);
    }

  }
</script>

<style>
</style>
