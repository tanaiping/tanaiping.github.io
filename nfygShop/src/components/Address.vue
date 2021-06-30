<template>
  <div class="address">
    <div class="user"
         @click="checkAddress">
      <h5 class="user-name">
        <div v-show="address.isDefault"
             class="check"></div>{{address.rname}}<span>{{address.rmobile}}</span>
      </h5>
      <div class="user-add">{{regionName + ' ' + address.addressExt}}</div>
    </div>
    <div class="icon">
      <div class="i edit"
           @click="editThisAddress"></div>
      <div class="i del"
           @click="delThisAddress"></div>
    </div>
  </div>
</template>

<script>
// import {
//     GoodsUrl
// } from '../config/url'
import RegionList from '../assets/js/regionList'
export default {
  name: '',
  props: ['address'],
  data () {
    return {
      regionName: ''
    }
  },
  mounted () {
    this.getRegionName(this.address.regionId)
  },
  methods: {
    getRegionName (id) {
      RegionList.data.forEach(item => {
        if (item.regionId == id) {
          //window.console.log("item.regionName = " + item.regionName)
          this.regionName = item.regionName + ' ' + this.regionName
          if (item.regionLevel != 1) {
            this.getRegionName(item.parentregionId)
          }
        }
      })
    },
    // 选择地址
    checkAddress () {
      if (this.$route.query.fromType == "order") {
        this.$cookies.set("checkAddress", this.address.addressId)
        this.$router.go(-1)
      }
    },
    // 删除地址
    delThisAddress () {
      this.$emit("update", this.address.addressId)
    },
    // 编辑地址
    editThisAddress () {
      this.$router.push({
        name: 'addressedit',
        query: {
          editType: 2,
          editFrom: 'list',
          addressId: this.address.addressId
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.address {
  display: flex;
  padding: 0.3rem;
  border-bottom: solid 1px #e5e5e5;
  background: #fff;
}

.user {
  min-width: 5.2rem;

  .check {
    display: inline-block;
    width: 0.44rem;
    height: 0.44rem;
    background: url("../assets/icon_sprites.png") no-repeat center / 0.44rem
      1.32rem;
    background-position: -0 -0.88rem;
  }

  .user-name {
    font-size: 0.3rem;

    span {
      margin-left: 0.3rem;
    }
  }

  .user-add {
    margin-top: 0.15rem;
    font-size: 0.28rem;
    color: #666;
  }
}

.icon {
  display: flex;
  margin: auto;
  margin-right: 0;

  .i {
    margin: auto;
    margin-left: 0.4rem;
    width: 0.44rem;
    height: 0.44rem;
    background: url("../assets/icon_sprites.png") no-repeat center / 0.44rem
      1.32rem;
  }

  .edit {
    background-position: -0 -0.44rem;
  }

  .del {
    background-position: -0 -0;
  }
}
</style>