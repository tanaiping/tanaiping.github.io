<template>
  <div class="match-rule">
    <div v-for="(item,i) in newData" :key="i" class="labels-box">
      <el-form-item label="标签权重:">
        <el-select v-model="item.weight1" placeholder="请输入规则类型" style="width: 60px;">
          <el-option label="=" value='1'></el-option>
          <el-option label=">=" value='2'></el-option>
          <el-option label="<=" value='3'></el-option>
          <el-option label=">" value='4'></el-option>
          <el-option label="<" value='5'></el-option>
        </el-select>
        <el-input v-model="item.weight2" type="number"  placeholder="请输入标签权重" style="width: 355px;"></el-input>
        <el-button @click="addContent(i)">添加匹配内容</el-button>
      </el-form-item>
      <div v-if="item.content.length>0">
        <el-form-item label="推送内容:" v-for="(con,x) in item.content" :key="x">
          <el-select v-model="con.type" placeholder="推送内容" style="width: 160px;">
            <el-option label="包含标签内容" value='1'></el-option>
            <el-option label="不含标签内容" value='2'></el-option>
            <el-option label="指定标签内容" value='3'></el-option>
          </el-select>
          <el-input v-model="con.percent" type="number"  placeholder="请输入内容比例" style="width: 255px;"></el-input>
          <el-button @click="delContent(i,x)"><i class="el-icon-minus"></i>删除</el-button>

        </el-form-item>
      </div>
    </div>
  </div>
</template>

<script>
  export default{
   name:'matchrule',
   props:['items'],
   data() {
       return {
         newData:{}
       };
   },
   created(){
     this.newData = this.items;
     console.log(this.newData)
   },
   methods:{
     addContent:function(index){
        this.newData[index].content.push({type:'1',percent:''});
     },
     delContent:function(x,y){
       console.log(y);
       this.newData[x].content.splice(y,1);
     }
   }
 }
</script>

<style>
</style>
