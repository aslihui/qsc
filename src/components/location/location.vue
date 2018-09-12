<template>
  <div id="app">
    <div id="menu">
      <yd-cell-group>
        <yd-cell-item>
          <span slot="left">收货人</span>
          <yd-input required slot="right" ref="name" v-model="name" :debug="true" regex="/^[\u4E00-\u9FA5A-Za-z]+$/" placeholder="请输入收货人姓名"></yd-input>
        </yd-cell-item>
        <yd-cell-item>
          <span slot="left">手机号码</span>
          <yd-input required max="11" slot="right" ref="phone" v-model="phone" regex="mobile" placeholder="请输入收货人号码"></yd-input>
        </yd-cell-item>
        <yd-cell-item arrow>
          <span slot="left">所在地区</span>
          <input readonlyunselectable="on" ref="site" slot="right" type="text" @click.stop="show1 = true" v-model="site" readonly placeholder="请选择收货地址">
        </yd-cell-item>
        <yd-cityselect v-model="show1" :callback="result1" :items="district"></yd-cityselect>
        <yd-cell-item>
          <span slot="left">详细地址</span>
          <yd-input required slot="right" ref="location" v-model="location" :debug="true" placeholder="请输入您的详细地址"></yd-input>
        </yd-cell-item>
        <yd-cell-item>
            <span slot="left">邮编</span>
            <yd-input required slot="right" ref="postcode" v-model="postcode" :debug="true" placeholder="请输入您的邮编"></yd-input>
        </yd-cell-item>
      </yd-cell-group>
    </div>
    <div id="save" @click="saveStie">
      <button class="btn">保存</button>
    </div>
  </div>
</template>

<script>
import District from "ydui-district/dist/jd_province_city_area_id";

export default {
  data() {
    return {
      name: "", // 收货人姓名
      phone: "", // 收货人联系电话
      province: "", // 所在省份
      city: "", // 所在市区
      area: "", // 所在县城
      site: "", // 省+市+县城
      location: "", // 所在地址详细信息
      show1: false,
      postcode: "", //邮编
      district: District
    };
  },
  methods: {
    result1(ret) {
      this.province = ret.itemName1;
      this.city = ret.itemName2;
      this.area = ret.itemName3;
      this.site = this.province + " " + this.city + " " + this.area;
    },
    saveStie(event) {
      const PurchaserObj = {
        receivePerson: this.name,
        receiveTell: this.phone,
        province: this.province,
        city: this.city,
        area: this.area,
        detail: this.location,
        postcode: this.postcode
        
      };

      // 判断姓名是否填写正确
      if (!this.$refs.name.valid) {
        if (this.$refs.name.errorCode === "NOT_NULL") {
          this.$dialog.toast({
            mes: "姓名不能为空",
            timeout: 1500
          });
        }
        if (this.$refs.name.errorCode === "NOT_REGEX_RULE") {
          this.$dialog.toast({
            mes: "姓名格式有误，请重新输入",
            timeout: 1500
          });
        }
        return;
      }
      // 判断电话是否填写正确
      if (!this.$refs.phone.valid) {
        if (this.$refs.phone.errorCode === "NOT_NULL") {
          this.$dialog.toast({
            mes: "手机号码不能为空",
            timeout: 1500
          });
        }
        if (this.$refs.phone.errorCode === "NOT_REGEX_RULE") {
          this.$dialog.toast({
            mes: "请您输入正确的手机号码",
            timeout: 1500
          });
        }
        return;
      }
      // 判断选择地区不能为空
      if (!$(this.$refs.site).val()) {
        this.$dialog.toast({
          mes: "请选择您所在的地区",
          timeout: 1500
        });
        return;
      }
      // 判断详细地址不能为空
      if (!this.$refs.location.valid) {
        if (this.$refs.location.errorCode === "NOT_NULL") {
          this.$dialog.toast({
            mes: "详细地址不能为空",
            timeout: 1500
          });
        }
        return;
      }
      // 判断邮编不能为空不能为空
      if (!this.$refs.postcode.valid) {
        if (this.$refs.postcode.errorCode === "NOT_NULL") {
          this.$dialog.toast({
            mes: "邮编不能为空",
            timeout: 1500
          });
        }
        return;
      }
      // 发送POST请求，将用户信息存入到数据库
      const url = `/user/receive/address/add`;

      this.$axios({
        url,
        method: "post",
        data: PurchaserObj,
        transformRequest: [
          function(data) {
            let ret = "";
            for (let it in data) {
              ret += encodeURIComponent(it) + "=" + encodeURIComponent(data[it]) + "&";
            }
            return ret;
          }
        ]
      }).then(response => {
        if (response.data.status === 1) {
          // this.$router.push({ path: "/order" });
          this.$router.push({
            path: '/management',
            query: { id: this.$route.query.id }
          });
        } else {
          this.$dialog.toast({
            mes: response.data.message,
            timeout: 1500
          });
        }
      });
    }
  }
};
</script>

<style scoped>
#app {
  padding-bottom: 50px;
}

#menu span {
  font-size: 16px;
  margin-right: 12px;
}
#menu span:first-child {
  margin-right: 20px;
}
#menu input {
  font-size: 0.4rem;
  outline: none;
}
#menu .yd-cell .yd-cell-item {
  height: 60px;
}

#save {
  position: fixed;
  width: 100%;
  bottom: 0;
  text-align: center;
  padding: 10px;
  background-color: #3a3d4e;
  z-index: 999;
}
#save .btn {
  display: block;
  margin: 0 auto;
  color: #fff;
  width: 100%;
  font-size: 20px;
}
</style>

