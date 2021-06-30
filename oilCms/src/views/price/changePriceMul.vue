<template>
  <div class="content">
    <el-form label-width="100px" :rules="rules" ref="ruleForm" :model="ruleForm">
      <el-form-item label="油站名称">
        <el-button  type="primary" @click="checkStation">选择油站</el-button>
      </el-form-item>
      <el-form-item label="">
        <div v-if="ruleForm.stationObj.length>0" class="tagslist">
          <el-tag
            v-for="tag in ruleForm.stationObj"
            :key="tag.stationId"
            closable
            effect="plain"
            @close="closeTag(tag.stationId)"
            >
            {{tag.station_name}}
          </el-tag>
        </div>
      </el-form-item>
      <el-form-item label="价格调整">
        <el-radio v-model="ruleForm.type" label="1">调低</el-radio>
        <el-radio v-model="ruleForm.type" label="2">调高</el-radio>
        <label class="form-static-tips">价格调低：售价=协议价*(1-调整百分比)</label>
      </el-form-item>
      <el-form-item label="调整百分比" prop="percent">
        <el-input placeholder="请输入内容" v-model="ruleForm.percent" style="width: 300px;">
            <template slot="append">%</template>
          </el-input>
        <label class="form-static-tips">限制条件：售价不能大于挂牌价；若售价大于挂牌价，则等于挂牌价</label>
      </el-form-item>
      <el-form-item label="">
        <div class="mt20">
          <el-button type="primary" @click="saveModify('ruleForm')">确认</el-button>
          <el-button @click="goback">取 消</el-button>
        </div>
      </el-form-item>

    </el-form>

      <el-dialog
        title="选择油站"
        :visible.sync="dialogVisible1"
        width="60%"
        :before-close="handleClose">
         <div class="flex">
             <el-input v-model="province" placeholder="请输入省份" class="filter-input mr10"></el-input>
             <el-input v-model="city" placeholder="城市" class="filter-input mr10"></el-input>
             <el-input v-model="stationName" placeholder="请输入油站名称" class="filter-input mr10"></el-input>
             <el-input v-model="address" placeholder="请输入油站地址" class="filter-input mr10"></el-input>
             <el-button  icon="el-icon-refresh" @click="resetForm">重置</el-button>
             <el-button type="primary"  icon="el-icon-search" @click="search">查询</el-button>
         </div>
         <el-table
             :data="contentData"
             stripe
             type="selection"
             @selection-change="selectionLineChangeHandle"
             :row-key='getRowKey'
             style="width: 100%">
             <el-table-column type="selection"  :reserve-selection="true" width="55"> </el-table-column>
             <el-table-column
             label="编号">
             <template slot-scope="scope">
               {{ (scope.$index+1)+(curPage-1)*pageSize}}
             </template>
             </el-table-column>
             <el-table-column
             prop="source"
               label="渠道名称">
             </el-table-column>
             </el-table-column>
             <el-table-column
             prop="type"
             label="油站类型">
             </el-table-column>
             <el-table-column
             prop="province"
             label="省份">
             </el-table-column>
             <el-table-column
             prop="city"
             label="城市">
             </el-table-column>
             <el-table-column
             prop="station_name"
             label="油站名称">
             </el-table-column>
             <el-table-column
             prop="address"
             label="油站地址">
             </el-table-column>
             <el-table-column
             label="油号">
             <template slot-scope="scope">
                <div v-for="(item,index) in scope.row.oilInfoList" :key="index">#{{item.oil_no}}</div>
             </template>
             </el-table-column>
             <el-table-column
             label="发改委价">
             <template slot-scope="scope">
                <div v-for="(item,index) in scope.row.oilInfoList" :key="index">￥{{item.official_price}}</div>
             </template>
             </el-table-column>
             <el-table-column
             label="挂牌价">
             <template slot-scope="scope">
                <div v-for="(item,index) in scope.row.oilInfoList" :key="index">￥{{item.list_price}}</div>
             </template>
             </el-table-column>
             <el-table-column
             label="协议价">
             <template slot-scope="scope">
                <div v-for="(item,index) in scope.row.oilInfoList" :key="index">￥{{item.contract_price}}</div>
             </template>
             </el-table-column>
             <el-table-column
             label="售价">
             <template slot-scope="scope">
                <div v-for="(item,index) in scope.row.oilInfoList" :key="index">￥{{item.sale_price}}</div>
             </template>
             </el-table-column>
           </el-table>
          <div class="page">
              <Page :pageSize="pageSize" :cur="curPage" :total="total" @pageChange="changeCurPage"/>
           </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible1 = false">取 消</el-button>
          <el-button type="primary" @click="saveChecked">确 定</el-button>
        </span>
      </el-dialog>
  </div>

</template>

<script>
 import {Price} from '@/config/url'
import Page from '@/components/page'

  export default{
    components:{
      Page,
    },
    data(){
      // 自定义校验规则
      var percents = (rule, value, callback) => {
        // rule 对应使用salePrice自定义验证的 对象
        // value 对应使用salePrice自定义验证的 数值
        // callback 回调函数
         const reg = /^(\d+)(.\d{0,2})?$/;
        if (value == null || String(value).trim() === "") {
          callback(new Error("不能为空"));
        }else if (!reg.test(value)) {
          callback(new Error("只能输入数值，最多两位小数"));
        }else {
          callback();
        }
      };

      return{
        ruleForm:{
          stationObj:{},
          type:'2',
          percent:'',
        },
        province:'',
        city:'',
        address:'',
        stationName:'',
        dialogVisible1: false,
        contentData: [],
        "pageSize":10,
        curPage:1,
        total:0,
        stationIdList:[],
        rules:{
          percent:[
            { validator: percents, trigger: 'blur' },
          ],
        }
      }

    },
    mounted(){
      //this.getListData();
      const _this = this;
      let str = this.$route.params.stationObj;
      if(str||str === ''){
        this.ruleForm.stationObj = eval("(" + str + ")");
      }else{
         this.ruleForm.stationObj = '';
      }
      console.log(this.ruleForm.stationObj)
      this.listPage = this.$route.params.pageNo
      //this.initStation()
      _this.getListData(_this.curPage)
    },
    methods:{
      search(){
        const _this = this;
        _this.getListData(_this.curPage);
      },
      resetForm(){
        this.ruleForm.type = '';
        this.province = '';
        this.city = '';
        this.statioName = '';
        this.address = '';
      },
      changeCurPage(p){
         const _this = this;
        this.curPage = p;
        console.log(this.curPage);
        _this.getListData(_this.curPage)
      },
      saveChecked() {
         const _this = this;
         _this.ruleForm.stationObj = [];
        _this.stationIdList.forEach(function(item,index){
          _this.ruleForm.stationObj.push({stationId:item.stationId,"station_name":item.station_name})
        })
        _this.dialogVisible1 = false;
      },
      closeTag(stationId){
        const _this = this;
        _this.ruleForm.stationObj.forEach(function(item,index){
           if(item.stationId == stationId){
             _this.ruleForm.stationObj.splice(index, 1);
           }
        })
      },
      handleClose(done) {
        done();
      },
      checkStation(){
         const _this = this;
        this.dialogVisible1 = true
      },
      selectionLineChangeHandle (val) {
           this.stationIdList = val
           console.log(this.stationIdList)
      },
      getRowKey(row){
             return row.id;
        },
      getListData(pageNo) {
          const _this = this;
          const token = localStorage.getItem('token');
          const formData = {
            type:'',
            address:_this.address,
            station_name:_this.statioName,
            pageNo:pageNo,
            city:_this.city,
            province:_this.province
          }
          _this.$axios.post(Price.list, JSON.stringify(formData),{headers: {'Content-Type': 'application/json','token':token}})
            .then((res) => {
              console.log(res)
              if (res.data.resultCode == 0) {
                _this.contentData = res.data.data.data;
                _this.total = res.data.data.total
                _this.pageSize = res.data.data.limit
                _this.curPage = res.data.data.pageNo
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
      },
      saveModify(ruleForm){
        const _this = this;
        const token = localStorage.getItem('token');

        this.$refs[ruleForm].validate((valid) => {  //开启校验
          if (valid) {   // 如果校验通过，请求接口，允许提交表单
              let stationIds = [];
              if(_this.ruleForm.stationObj.length>0){
                _this.ruleForm.stationObj.forEach(function(item,index){
                  stationIds.push(item.stationId)
                });
                stationIds  = stationIds.join(",")
              }else{
                _this.$message('请选择油站')
                return false;
              }

              const formData = {
                percent:_this.ruleForm.percent,
                type:_this.ruleForm.type,
                stationIds:stationIds
              }
              _this.$axios.post(Price.batchReviseOilPrice, JSON.stringify(formData),{headers: {'Content-Type': 'application/json','token':token}})
                .then((res) => {
                  console.log(res)
                  if (res.data.resultCode == 0) {
                    _this.$message('改价成功');
                    setTimeout(function(){_this.$router.go(-1);},1000)
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

          } else {   //校验不通过
            return false;
          }
        });
      },
      goback(){
        this.$router.go(-1);//返回上一层
      }

    }
  }
</script>

<style scoped>
.tagslist .el-tag{
  margin: 0 10px 10px 0;
}
</style>
