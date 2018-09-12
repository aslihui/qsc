<template>
  <div id="app">
    <div id="addSite" @click="goaddSite" v-if="!stie">
      <i class="iconfont icon-tianjia add"></i>
      <span class="text">新增收货地址</span>
    </div>
    <div id="site" v-if="stie" @click="editSite">
      <div class="userInfo">
        <span class="userName">{{ name }}</span>
        <span class="userPhone" ref="userPhone">{{ phone }}</span>
        <em class="userStie">{{ region }}
          <i class="userLocation" ref="userLocation">{{ location }}</i>
        </em>
      </div>
      <div class="rightArrow">
        <i class="iconfont icon-iconfonticonfonti2copycopy"></i>
      </div>
    </div>
    <div id="orderList" v-if="title" class="clearfix">
      <div class="left">
        <img :src="goodsUrl" alt="">
      </div>
      <div class="select">
        <span class="title">{{title}}</span>
        <span class="size">{{size}}</span>
        <span class="price">
          <i>￥</i>
          <em>{{price}}</em>
        </span>
        <span class="count">
          <yd-spinner :longpress="false" v-model="number" width="100px" height="35px"></yd-spinner>
        </span>
      </div>
    </div>
    <div id="payment">
      <div class="information clearfix">
        <div class="theFreight">
          <div>
            <span>运费：</span>
            <em>
              <i>￥</i>0.00</em>
          </div>
          <span class="price">
            <span>合计：</span>
            <em>
              <i>￥</i>{{ price * number }}.00</em>
          </span>
        </div>
        <yd-button class="btn" @click.native="payment">提交订单</yd-button>
      </div>
      <!-- <button class="btn"  @click="payment">提交订单</button> -->
      <yd-popup v-model="show" position="bottom" height="50%">
        <div class="top">
          <span class="text">支付</span>
          <i class="icon iconfont icon-guanbi" @click="shutDown"></i>
        </div>
        <div class="payInformation">
          <div class="money">
            <i>￥</i>
            <span>{{ price * number }}.00</span>
          </div>
          <div class="pay-label orderNo clearfix">
            <span>订单编号：</span>
            <div>{{this.no}}</div>
          </div>
          <div class="pay-label payWay clearfix">
            <span class="txt">支付方式：</span>
            <div class="select">
              <div>
                <i class="icon iconfont icon-zhifubao"></i>
                <span>支付宝支付</span>
              </div>
            </div>
          </div>
          <div class="payBtn" @click="paySuccess">
            <div>
              <span>立即支付</span>
            </div>
          </div>
        </div>
      </yd-popup>
    </div>
  </div>
</template>

<script>
import store from "../../vuex/store";

export default {
  data() {
    return {
      goodsUrl: "", // 商品的图片
      title: "", // 商品的标题
      price: "", // 商品的价格
      size: "", // 商品的规格
      number: undefined, // 选择的数量
      stie: false, // 判断显示添加地址或显示地址信息
      name: "", // 收货人姓名
      phone: "", // 收货人联系电话
      province: "", // 所在省份
      city: "", // 所在市区
      area: "", // 所在县城
      location: "", // 所在地址详细信息
      show: false, // 支付方式下弹框状态
      region: "",
      no: undefined,
      paystate: false,
      value2: ""
    };
  },
  methods: {
    goaddSite() {
      this.$router.push({
        path: "/addSite",
        query: { id: this.$route.query.id }
      });
    },
    paySuccess() {
      // 生产环境
      const url = `http://fz.qjr.szqqkj.cn/site/validate/pay/getAlipayURL/${this.no}&${this.price}`;
      // 测试环境
      // const url = `http://127.0.0.1:8899/site/validate/pay/getAlipayURL/${this.no}&${this.price}`;

      this.$axios({
        url,
        method: "get"
      }).then(response => {
        // console.log(response);
        window.location.href = response.data;
      });

      // this.$router.push({ path: '/orderList' })
    },
    getGoodsInfo() {
      // 把local strong的值赋值给buyGoodsInfo
      this.$store.commit("getGoodsInfo");

      let data = this.$store.state.buyGoodsInfo;
      this.title = data.title;
      this.price = data.price;
      this.size = data.size;
      this.number = data.number;

      const url = `/product/detail?id=${this.$route.query.id}`;

      this.$axios({
        url,
        method: "get"
      }).then(response => {
        this.goodsUrl = response.data.data.faceImg;
      });
    },
    upSiteData() {
      var data = [];

      const url = `/user/receive/address/list`;

      this.$axios({
        url,
        method: "get"
      }).then(response => {
        data = response.data.data;
        for (let i = 0; i < data.length; i++) {
          const element = data[i];
          if (element.isDefault) {
            if (!(element == {})) {
              this.name = element.receivePerson;
              this.phone = element.receiveTell;
              this.province = element.province;
              this.city = element.city;
              this.area = element.area;
              this.stie = true;
              this.region = `${element.province}${element.city}${element.area}`;
              this.location = element.detail;

              // this.region = element.site.replace(/\s+/g, "");
            }
          }
        }
      });
    },
    editSite() {
      this.$router.push({
        path: "/management",
        query: { id: this.$route.query.id }
      });
    },
    payment() {
      const url = `/order/create`;

      const data = {
        order: {
          receivePerson: this.name,
          receiveAddress: `${this.province} ${this.city} ${this.area} ${
            this.location
          }`,
          receiveTell: this.phone,
          province: this.province,
          city: this.city,
          area: this.area,
        },
        orderProducts: [
          {
            productId: parseInt(this.$route.query.id),
            num: parseInt(this.number),
            productSpec: this.size
          }
        ]
      };

      //本地变量no 订单号
      if (this.stie) {
        if (!this.no) {
          //如果订单号no没有值，则执行创建订单
          this.$axios({
            url,
            method: "post",
            data: data
          }).then(response => {
            if (response.data.status == 1) {
              this.no = response.data.data + ""; //如果创建订单成功，将返回的订单号赋值给本地变量no， 用于避免重复提交创建订单
              this.show = true; //创建订单成功后 弹窗支付
            } else {
              this.$dialog.toast({
                mes: '系统异常，请稍后再试！',
                timeout: 2000
              });
            }
          })
          .catch(error => {
            this.$dialog.toast({
              mes: '系统异常，请稍后再试！',
              timeout: 2000
            });
          });
        } else {
          this.show = true; //如果订单号no有值，说明已经创建订单 直接弹出 支付窗口
        }
      } else {
        this.$router.push({ path: "/addSite" });
      }
    },
    shutDown() {
      this.show = false;
    }
  },
  created() {
    this.getGoodsInfo();
    this.upSiteData();
  },
  watch: {
    number() {
      let goodsInfo = {
        title: this.title,
        price: this.price,
        number: this.number,
        size: this.size
      };
      this.$store.commit("addGoodsInfo", goodsInfo);
    },
    userStie() {
      let userStieInfo = {
        name: this.name,
        phone: this.phone,
        stie: this.region,
        location: this.location
      };
      this.$store.commit("addUserStie", userStieInfo);
      this.stie = true;
    }
  },
  beforeDestroy() {
    this.no = undefined;
  }
};
</script>

<style scoped>
#app {
  background-color: rgb(255, 255, 255);
  height: 100%;
  position: fixed;
  width: 100%;
}

#site {
  height: 80px;
  position: relative;
  font-size: 15px;
  padding: 10px;
  background-color: #eeeeee;
}
#site .userInfo {
  width: 70%;
}
#site .userName {
  margin-right: 5px;
}
#site .userStie {
  position: absolute;
  padding-right: 26px;
  left: 3%;
  top: 42%;
}
#site .rightArrow i {
  float: right;
  font-size: 20px;
  color: #ccc;
  line-height: 2px;
}

#addSite {
  text-align: center;
  position: relative;
  color: #8a888a;
  padding: 20px;
  background-color: #eeeeee;
}
#addSite .add {
  font-size: 20px;
  color: #464f80;
  margin-right: 8px;
  vertical-align: middle;
}
#addSite .text {
  font-size: 16px;
  display: inline-block;
  height: 100%;
  vertical-align: middle;
}

#orderList {
  /* height: 150px; */
  background-color: #fff;
  border-bottom: 1px solid #cccccc;
}
#orderList .left {
  width: 30%;
  padding: 10px;
  float: left;
}
#orderList .left img {
  display: block;
  width: 100%;
  float: left;
}
#orderList .select {
  float: right;
  width: 70%;
  padding: 14px;
}
#orderList .select .title {
  font-size: 13px;
}
#orderList .select .size {
  display: block;
  color: #8a888a;
  font-size: 14px;
  margin-top: 5px;
}
#orderList .select .price {
  color: #464f80;
  font-size: 15px;
  display: inline-block;
  margin-top: 10px;
}
#orderList .select .count {
  float: right;
}

#payment {
  position: fixed;
  width: 100%;
  bottom: 0;
  z-index: 999;
}
#payment .information .theFreight {
  width: 44%;
  padding: 5px 12.5px 0 12.5px;
  font-size: 12px;
  float: left;
}
#payment .information .price {
  color: #464f80;
  display: block;
  font-size: 13px;
  margin-top: 2px;
}
#payment .btn {
  margin: 0 auto;
  color: #fff;
  font-size: 20px;
  height: 100%;
  width: 50%;
  float: right;
  padding: 10px;
  background-color: #3a3d4e;
}
#payment .yd-popup .top {
  text-align: center;
  position: relative;
  border-bottom: 1px solid #ccc;
  text-align: center;
}
#payment .yd-popup .top .text {
  height: 100%;
  display: inline-block;
  font-size: 25px;
}
#payment .yd-popup .top .icon {
  font-size: 25px;
  position: absolute;
  right: 15px;
}

#payment .payInformation .money {
  width: 100%;
  text-align: center;
  padding: 20px 0 10px 0;
  font-size: 30px;
  color: #d91616;
}
#payment .payInformation .orderNo,
#payment .payInformation .payWay {
  width: 100%;
  padding: 0px 20px;
  font-size: 18px;
  position: relative;
}
#payment .payInformation .orderNo span,
#payment .payInformation .payWay .txt {
  font-size: 20px;
  padding-bottom: 5px;
  float: left;
  color: #999999;
}
#payment .payInformation .orderNo em {
  float: left;
}

#payment .payInformation .payBtn {
  width: 100%;
  color: #fff;
  text-align: center;
  position: absolute;
  bottom: 0;
  width: 100%;
}
#payment .payInformation .payBtn div {
  display: block;
  width: 100%;
  padding: 2%;
}
#payment .payInformation .payBtn div span {
  background-color: #3a3d4e;
  width: 100%;
  display: block;
  border-radius: 12px;
  padding: 10px;
  margin: 0 auto;
  color: #fff;
  font-size: 20px;
}
#payment .payInformation .payWay .select {
  float: right;
}
#payment .payInformation .payWay .select .icon {
  font-size: 20px;
}
#payment .payInformation .payWay .select .icon-qiandai {
  color: #464f80;
}
#payment .payInformation .payWay .select .icon-weixin1 {
  color: #3cb034;
}
#payment .payInformation .payWay .select .icon-zhifubao {
  color: #00aaee;
}
#payment .payInformation .pay-label > span {
  width: 100px;
}

#payment .payInformation .pay-label > div {
  width: calc(100% - 100px);
  float: right;
  text-align: right;
}
</style>



