<template>
  <div class="content">
    <div class="flex">
        <el-button type="primary"  icon="el-icon-refresh">刷新</el-button>
    </div>
    <!-- 过虑条件  end-->
    <!-- 标题  end-->
    <div class="mt20">
      <el-table
          :data="contentData"
          stripe
          :row-key='getRowKey'
          type="selection"
          style="width: 100%">
          <el-table-column type="selection"  :reserve-selection="true" width="55"> </el-table-column>
          <el-table-column
          prop="deviceCode"
          label="设备编号">
          </el-table-column>
          <el-table-column
          prop="userId"
            label="用户编号">
          </el-table-column>
          <el-table-column
          prop="nickName"
          label="用户名称">
          </el-table-column>
          <el-table-column
          prop="phoneNum"
            label="PDA电话号码">
            </el-table-column>
            <el-table-column
            prop="version"
            label="PDA版本号">
            </el-table-column>
            <el-table-column
            prop="status"
              label="状态">
            </el-table-column>
        </el-table>
    </div>


  </div>

</template>

<script>
  import {Device} from '@/config/url'
import Page from '@/components/page'
  export default{
    components:{
      Page,
    },
    data(){
      return{
        contentData: [],
      }

    },
    mounted(){
      this.getListData();
    },
    methods:{
      changeCurPage(p){
        this.curPage = p;
        console.log(this.curPage);
      },
      getRowKey(row){
             return row.id;
        },
      getListData() {
        const _this = this
        const formData = {}
        _this.$axios.get(Device.pda, formData)
          .then((res) => {
            console.log(res)
            if (res.data.code == 200) {
              console.log(res.data.data);
              this.contentData = res.data.data;
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
