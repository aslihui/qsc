<template>
  <div id="app">
    <yd-infinitescroll :callback="loadList" ref="infinitescrollDemo">
      <div id="list" class="list" v-for="(item, index) in orderListData" :key="index" slot="list" @click.stop="goPay" :data-no="item.no">
        <div class="order">
          <span class="orderText">订单编号：</span>
          <span class="orderNo">{{ item.no }}</span>
          <span class="state" v-if="item.state === 0" style="color:#d91616;">待支付</span>
          <span class="state" v-if="item.state === 1" style="color:#3b6bcc;">待发货</span>
          <span class="state" v-if="item.state === 3" style="color:#d91616;">待收货</span>
          <span class="state" v-if="item.state === 4" style="color:#3b6bcc;">已取消</span>
          <span class="state" v-if="item.state === 5" style="color:green;">已完成</span>
          <div class="shoping clearfix">
            <img :src="item.products[0].faceImg" alt="">
            <div>
              <span class="title">{{ item.products[0].name }}</span><br>
              <span class="rmb">￥</span>
              <span class="no">{{ item.products[0].price }}</span><br>
              <span style="color:#999;font-size:15px">X{{ item.products[0].num }}</span>
            </div>
          </div>
        </div>
        <div class="operation clearfix">
          <div>
            <span>收货地址：</span>
            <span>{{ item.receiveAddress }}</span>
          </div>
          <div class="price">
            <span class="remNo">{{ item.products[0].amount }}</span>
            <em>￥</em>
            <span>合计：</span>
          </div>
          <div class="theEditor" v-if="item.state === 0">
            <yd-button type="hollow" style="padding: 0.2rem 0.5rem; font-size: 15px;" :data-no="item.no" @click.native="removeOrder">删除订单</yd-button>
            <yd-button type="danger" style="padding: 0.2rem 0.5rem; font-size: 15px;" id="nowPay" @click.native="payShow" :data-price="item.products[0].amount" :data-num="item.products[0].num" :data-no="item.no">立即付款</yd-button>
          </div>
          <div class="theEditor" v-if="item.state === 3">
            <yd-button type="danger" style="padding: 0.2rem 0.5rem; font-size: 15px;" id="confirmGoods" @click.native="confirmGoods" :data-price="item.products[0].amount" :data-num="item.products[0].num" :data-no="item.no">确认收货</yd-button>
          </div>
        </div>
      </div>

      <!-- 数据全部加载完毕显示 -->
      <span slot="doneTip">亲，没有更多数据了哦~~~</span>

      <!-- 加载中提示，不指定，将显示默认加载中图标 -->
      <img slot="loadingTip" src="http://static.ydcss.com/uploads/ydui/loading/loading10.svg" />
    </yd-infinitescroll>
    <div v-if="this.orderListData.length === 0">
      <div class="lack">
        <img src="../../assets/image/lack/lackOrder.png" alt="">
        <span>亲，你还没有订单哦~</span>
        <div class="btn" @click="goStore">逛逛巧商城</div>
      </div>
    </div>
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
</template>

<script>
export default {
  data() {
    return {
      orderListData: [],
      orderNo: "", // 订单号
      pageNum: 1, // 记录页码
      pageSize: 5, // 记录页容量
      show: false, // 支付方式下弹框状态
      price: "", // 记录商品单价
      number: "", // 记录商品数量
      no: "" // 记录订单单号
    };
  },
  methods: {
  	removeAllSpace(str) {
      return str.replace(/\s+/g, "");
   },
    getData() {
      this.pageNum = 1;
      const url = `/order/list?pageNum=${this.pageNum}&pageSize=${this.pageSize}`;
      this.$axios({
        url,
        method: "get"
      }).then(response => {
        
        this.orderListData = response.data.data;
           console.log(this.orderListData);
//      for (let i = 0; i < this.orderListData.length; i++) {
//        // 去除返回地址所有空格
//        this.orderListData[i].receiveAddress = removeAllSpace(
//          this.orderListData[i].receiveAddress
//        );
//      }
      });
    },
    removeOrder(event) {
      event.cancelBubble = true; // 阻止事件冒泡
      // 点击删除订单
      this.$dialog.confirm({
        title: "删除订单",
        mes: "确认删除该订单？",
        opts: () => {
          const orderNo = event.target.getAttribute("data-no");
          const url = `/order/pay/cancel?orderNo=${orderNo}`;
          this.$axios({
            url,
            method: "get"
          }).then(response => {
            console.log(response);
            if (response.status === 200) {
              this.$dialog.toast({
                mes: '删除成功！',
                timeout: 1000,
                callback: () => {
                  this.getData();
                }
              });
            } else {
              this.$dialog.toast({
                mes: '删除失败！',
                timeout: 1000,
                callback: () => {
                  this.getData();
                }
              });
            }
          })
          // this.$dialog.toast({ mes: "删除订单失败！", timeout: 1000 });
        }
      });
    },
    goPay(event) {
      event.cancelBubble = true; // 阻止事件冒泡
      const orderNo = $(event.target).parents('#list').data('no');
      // 点击详情
      this.$router.push({
        path: `/payInfo`,
        query: { orderNo : orderNo }
      });
    },
    goStore() {
      this.$router.push({
        path: "/"
      });
    },
    //点击 确认收货
    confirmGoods(event) {
      event.cancelBubble = true; // 阻止事件冒泡
       
      this.$dialog.confirm({
        title: "确认收货",
        mes: "确定收货吗？",
        opts: () => {
          const orderNo = event.target.getAttribute("data-no");
          const url = `/order/taked?orderNo=${orderNo}`;
          this.$axios({
            url,
            method: "get"
          }).then(response => {
            console.log(response);
            if (response.status === 200) {
              this.$dialog.toast({
                mes: '操作成功！',
                timeout: 1000,
                callback: () => {
                  this.getData();
                }
              });
            } else {
              this.$dialog.toast({
                mes: '操作失败！',
                timeout: 1000,
                callback: () => {
                  this.getData();
                }
              });
            }
          })
        }
      });
    },
    loadList() {
      const url = `/order/list?pageNum=${++this.pageNum}&pageSize=${this.pageSize}`;
      this.$axios({
        url,
        method: "get"
      }).then(response => {
        // console.log(response.data.data)
        const _list = response.data.data;

        this.orderListData = [...this.orderListData,..._list];

        if (_list.length < this.pageSize) {
          /* 所有数据加载完毕 */
          this.$refs.infinitescrollDemo.$emit("ydui.infinitescroll.loadedDone");
          return;
        }

        /* 单次请求数据完毕 */
        this.$refs.infinitescrollDemo.$emit("ydui.infinitescroll.finishLoad");
      });
    },
    payShow (event) { // 点击立即支付，弹出支付窗口
      event.cancelBubble = true;
      this.price = event.target.getAttribute("data-price");
      this.number = event.target.getAttribute("data-num");
      this.no = event.target.getAttribute("data-no");
      this.show = true;
    },
    shutDown () { // 点击关闭按钮，关闭支付窗口
      this.show = false;
    },
    paySuccess () { // 选择支付方式，进行支付
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
    }
  },
  created() {
    this.getData();
  }
};
</script>

<style scoped>
.list {
  border-bottom: 1px solid #dddddd;
  background-color: #fff;
  padding: 10px 0 10px 10px;
  font-size: 18px;
  margin-bottom: 10px;
}
.list .order {
  border-bottom: 1px solid #ddd;
}
.list .order .state {
  float: right;
  margin-right: 12px;
}
.list .order .shoping {
  margin-top: 10px;
}
.list .order .shoping img {
  width: 30%;
  float: left;
}
.list .order .shoping div {
  float: right;
  width: 70%;
  padding: 5px 0 0 10px;
}
.list .order .shoping div .rmb,
.list .order .shoping div .no {
  color: red;
}

.list .operation {
  padding: 10px 10px 10px 0px;
  color: #999999;
  position: relative;
  font-size: 15px;
}
.list .operation .price {
  float: right;
  width: 100%;
  margin-top: 15px;
  color: #000;
}
.list .operation .price em,
.list .operation .price span,
.list .operation .price .remNo {
  color: red;
  float: right;
}
.list .operation .price span {
  color: #000;
}
.list .operation .theEditor {
  float: right;
  margin-top: 10px;
}

.lack {
  text-align: center;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
.lack img {
  width: 80%;
}
.lack span {
  color: #999999;
  font-size: 18px;
  display: block;
}
.lack .btn {
  color: #999999;
  width: 50%;
  padding: 10px;
  font-size: 18px;
  border: 1px solid #999999;
  margin: 0 auto;
  border-radius: 45px;
  margin-top: 30px;
  margin-bottom: 60px;
}

.top {
  text-align: center;
  position: relative;
  border-bottom: 1px solid #ccc;
  text-align: center;
}
.yd-popup .top .text {
  height: 100%;
  display: inline-block;
  font-size: 25px;
}
.yd-popup .top .icon {
  font-size: 25px;
  position: absolute;
  right: 15px;
}

.payInformation .money {
  width: 100%;
  text-align: center;
  padding: 20px 0 10px 0;
  font-size: 30px;
  color: #d91616;
}
.payInformation .orderNo,
.payInformation .payWay {
  width: 100%;
  padding: 0px 20px;
  font-size: 18px;
  position: relative;
}
.payInformation .orderNo span,
.payInformation .payWay .txt {
  font-size: 20px;
  padding-bottom: 5px;
  float: left;
  color: #999999;
}
.payInformation .orderNo em {
  float: left;
}

.payInformation .payBtn {
  width: 100%;
  color: #fff;
  text-align: center;
  position: absolute;
  bottom: 0;
  width: 100%;
}
.payInformation .payBtn div {
  display: block;
  width: 100%;
  padding: 2%;
}
.payInformation .payBtn div span {
  background-color: #3a3d4e;
  width: 100%;
  display: block;
  border-radius: 12px;
  padding: 10px;
  margin: 0 auto;
  color: #fff;
  font-size: 20px;
}
.payInformation .payWay .select {
  float: right;
}
.payInformation .payWay .select .icon {
  font-size: 20px;
}
.payInformation .payWay .select .icon-qiandai {
  color: #464f80;
}
.payInformation .payWay .select .icon-weixin1 {
  color: #3cb034;
}
.payInformation .payWay .select .icon-zhifubao {
  color: #00aaee;
}
.payInformation .pay-label > span {
  width: 100px;
}

.payInformation .pay-label > div {
  width: calc(100% - 100px);
  float: right;
  text-align: right;
}
</style>
<style>
.yd-btn {
  height: 1rem;
  padding: 0 0.4rem;
}
</style>

<style>
.yd-list-donetip {
  font-size: .44rem;
}
</style>



