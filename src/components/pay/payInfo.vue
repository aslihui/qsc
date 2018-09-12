<template>
  <div id="app">
    <div id="top">
      <div class="status">
        <span v-if="this.payInfoData.state === 0">待付款</span>
        <span v-if="this.payInfoData.state === 1">待发货</span>
        <span v-if="this.payInfoData.state === 3">已发货</span>
        <span v-if="this.payInfoData.state === 4">已取消</span>
        <span v-if="this.payInfoData.state === 5">已完成</span>
      </div>
      <!-- <div class="stie clearfix">
        <i class="icon iconfont icon-wuliu"></i>
        <div class="stieInfo">
          <div>
            <span>
              广东省深圳市龙华区已收件
            </span>
          </div>
          <div class="time">
            <span>2018年4月11日</span>
            &nbsp;&nbsp;
            <span>15 : 13</span>
          </div>
        </div>
        <i class="icon iconfont icon-iconfonticonfonti2copycopy"></i>
      </div> -->
      <div class="userInfo clearfix">
        <div class="stieInfo">
          <div>
            <span>
              收货人：
            </span>
            <span>
              {{ this.payInfoData.receivePerson }}
            </span>&nbsp;&nbsp;
            <span>
              {{ this.payInfoData.receiveTell }}
            </span>
          </div>
          <div class="time" style="font-size: 12px;">
            <span>收货地址：</span>
            <span>{{ this.payInfoData.receiveAddress }}</span>
          </div>
        </div>
      </div>
    </div>
    <div id="main">
      <div class="shopInfo clearfix" v-for="(item, index) in payInfoData.products" :key="index">
        <div class="imgBox">
          <img :src="item.faceImg" alt="">
        </div>
        <div class="shop">
          <div class="title">
            <span>{{item.name}}</span>
          </div>
          <div class="size">
            <span>
              {{item.productSpec}}
            </span>
          </div>
        </div>
        <div class="price">
          <div>￥{{item.price}}.00</div>
          <div class="num">x{{item.num}}</div>
        </div>
      </div>
    </div>
    <div id="orderInfo">
      <div class="clearfix mtb10">
        <span class="left">订单编号</span>
        <span class="right">{{this.payInfoData.no}}</span>
      </div>
      <div class="clearfix mtb10">
        <span class="left">运费</span>
        <span class="right">包邮</span>
      </div>
      <div class="clearfix mtb10">
        <span class="left">订单金额</span>
        <span class="right">￥{{this.payInfoData.orderAmount}}.00</span>
      </div>
      <!-- <div class="clearfix mtb10">
        <span class="left">下单时间</span>
        <span class="right">{{this.payInfoData.orderAmount}}</span>
      </div> -->
    </div>
    <yd-button v-if="this.payInfoData.state === 0" type="hollow" color="#464f80" class="right mr10" style="padding: 0.2rem 0.5rem; font-size: 15px;border-color: #464f80" @click.native="nowPay" id="nowPay">立即付款</yd-button>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        payInfoData: {},
        no: undefined,
        price: ""
      }
    },
    methods: {
      getData() {
        const orderNo = this.$route.query.orderNo;
        const url = `/order/info?orderNo=${orderNo}`;
        this.$axios({
          url,
          method: "get"
        }).then(response => {
          this.payInfoData = response.data.data;
          this.no = response.data.data.no;
          this.price = response.data.data.orderAmount;
        });
      },
      nowPay () {
        // 生产环境
        //const url = `http://fz.qjr.szqqkj.cn/site/validate/pay/getAlipayURL/${this.no}&${this.price}`;
        // 测试环境
        const url = `http://192.168.11.127:2222/site/validate/pay/getAlipayURL/${this.no}&${this.price}`;

        this.$axios({
          url,
          method: "get"
        }).then(response => {
          // console.log(response);
          window.location.href = response.data;
        });
      }
    },
    created () {
      this.getData();
    }
  }
</script>

<style scoped>
#app {
  height: 100%;
  background-color: #fff;
}
#top {
  background-color: #464f80;
  color: #ffffff;
  padding: 15px;
  font-size: 16px;
  /* height: 30%; */
}
#top .status {
  display: block;
  padding-top: 10px;
}
#top .stie {
  margin: 25px 0;
}
#top .stie .icon-wuliu {
  float: left;
  font-size: 30px;
  margin-right: 10px;
  line-height: 50px;
}
#top .stie .stieInfo {
  float: left;
}
#top .stie .icon-iconfonticonfonti2copycopy {
  float: right;
  line-height: 50px;
  font-size: 25px;
}

#top .userInfo {
  margin-top: 20px;
}
#top .userInfo .icon-location {
  float: left;
  font-size: 15px;
  margin-right: 10px;
  line-height: 50px;
}
#top .userInfo .stieInfo {
  float: left;
}

#main {
  padding: 10px;
  background-color: #fff;
}
#main .shopInfo {
  border-bottom: 1px solid #cccccc;
}
#main .shopInfo .imgBox {
  float: left;
  width: 30%;
}
#main .shopInfo .shop {
  float: left;
  padding: 5px;
}
#main .shopInfo .shop .title {
  color: #333333;
  font-weight: bold;
  font-size: 17px;
}
#main .shopInfo .shop .size {
  color: #666666;
  font-size: 15px;
}
#main .shopInfo .price {
  float: right;
  padding: 5px;
  font-size: 15px;
  color: #464f80;
}
#main .shopInfo .price .num {
  text-align: right;
}

#orderInfo {
  font-size: 17px;
  padding: 10px;
  color: #666666;
}
</style>

