<template>
  <div class="content">
    <div style="width: 360px;">
      <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="车牌号" prop="name" label-width="150px">
          <el-input v-model="ruleForm.no"></el-input>
        </el-form-item>
        <el-form-item label="车辆识别号" prop="name" label-width="150px">
          <el-input v-model="ruleForm.num"></el-input>
        </el-form-item>
        <el-form-item label="RFID号" prop="name" label-width="150px">
          <el-input v-model="ruleForm.rfid"></el-input>
        </el-form-item>
        <el-form-item label="RFID是否激活" prop="region" label-width="150px">
          <el-select v-model="ruleForm.isActive" placeholder="请选择是否激活">
            <el-option label="已激活" value="1"></el-option>
            <el-option label="未激活" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车辆类型" prop="region" label-width="150px">
          <el-select v-model="ruleForm.type1" placeholder="请选择车辆类型">
            <el-option label="轿车" value="1"></el-option>
            <el-option label="中型以上货车" value="2"></el-option>
            <el-option label="大型客车" value="3"></el-option>
            <el-option label="中小型客车" value="4"></el-option>
            <el-option label="轻微型客车" value="5"></el-option>
            <el-option label="机动三轮车" value="6"></el-option>
            <el-option label="摩托车" value="7"></el-option>
            <el-option label="免费" value="8"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车辆颜色" prop="region" label-width="150px">
          <el-select v-model="ruleForm.color" placeholder="请选择车辆颜色">
            <el-option label="红色" value="1"></el-option>
            <el-option label="蓝色" value="2"></el-option>
            <el-option label="绿色" value="3"></el-option>
            <el-option label="银色" value="4"></el-option>
            <el-option label="黑色" value="5"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车辆品牌" prop="region" label-width="150px">
          <el-select v-model="ruleForm.brand" placeholder="请选择车辆品牌">
            <el-option label="大众" value="1"></el-option>
            <el-option label="本田" value="2"></el-option>
            <el-option label="丰田" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="装卡状态" prop="name" label-width="150px">
          <el-input v-model="ruleForm.status"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="name" label-width="150px">
          <el-input v-model="ruleForm.desc"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button icon="el-icon-refresh">重置</el-button>
            <el-button type="primary" icon="el-icon-search" @click="onSubmit">提交</el-button>
          </el-form-item>
      </el-form>
    </div>

  </div>

</template>

<script>
  export default{
    data(){
      return{
        ruleForm:{
        }
      }

    },
    methods:{
      onSubmit(){
        console.log("提交成功")
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
