<template>
  <div id="app">
    <div id="slideshow">
      <yd-slider autoplay="3500">
        <yd-slider-item v-for="item in goodsInfo.lbt" :key="item.id">
          <a href="javascript:;">
            <img :src="item.url" style="height:375px;">
          </a>
        </yd-slider-item>
      </yd-slider>
    </div>
    <div id="introduce">
      <span class="title" ref="title">{{title}}</span>
      <div class="price">
        <div class="option">
          <em class="rmb">￥</em>
          <span ref="price" class="newPrice">{{price}}.00</span>
        </div>
        <div class="prohibition">
          <em class="icon iconfont icon-jifen rmb"></em>
          <span ref="price" class="newPrice">{{score}}</span>
        </div>
        <!-- <div>
          <em class="icon iconfont icon-jifen rmb"></em>
          <span ref="price" class="newPrice">{{score}}.00</span>
          <span class="rmb">+</span>
          <em class="rmb">￥</em>
          <span ref="price" class="newPrice">{{price}}.00</span>
        </div> -->
      </div>
    </div>
    <div id="specification">
      <yd-accordion>
        <yd-accordion-item open>
          <div slot="title" class="accordionTitle">选择：{{size}} x {{number}}</div>
          <div slot="txt" style="right: 40px;position: absolute;color: #666666;">库存：{{ this.stock }}</div>
          <div>
            <div class="type" v-for="item in goodsInfo.specType" :key="item.id">
              <div class="weight">
                <span>{{ item.name }}</span>
              </div>
              <div class="label">
                <button v-for="(el, i) in item.options" :key="el.id" v-bind:class="{ 'active': i == 0 }" class="number" ref="addactive" @click="addClass">{{el.value}}</button>
              </div>
            </div>
            <div class="quantity">
              <span class="count">数量</span>
              <yd-spinner :longpress="false" v-model="number" width="120px" height="35px"></yd-spinner>
            </div>
          </div>
        </yd-accordion-item>
      </yd-accordion>
    </div>
    <div id="goodsDetails">
      <img :src="goodsInfo.goodsInfoUrl" alt="">
    </div>
    <div id="buyNow" @click="goOrder" v-if="!(this.stock == 0)">
      <button class="buyBt">立即购买</button>
      <!-- <a href="#" class="buyBt">立即购买</a> -->
    </div>
    <div id="buyNow" v-if="this.stock == 0">
      <button class="buyBt" style="background-color: #666;">暂时缺货</button>
      <!-- <a href="#" class="buyBt">立即购买</a> -->
    </div>
  </div>
</template>

<script>
import store from "../../vuex/store";

var goodsInfos = [
  {
    id: "1",
    oldPrice: 98.0,
    repertory: 20,
    specType: [
      {
        name: "颜色",
        options: [{ value: "黑色" }]
      },
      {
        name: "尺寸",
        options: [{ value: "50*50cm" }]
      }
    ],
    lbt: [
      { url: require("../../assets/image/bolster/carousel1.png") },
      { url: require("../../assets/image/bolster/carousel2.png") },
      { url: require("../../assets/image/bolster/carousel3.png") }
    ],
    goodsInfoUrl: require("../../assets/image/bolster/goodInfo.jpg")
  },
  {
    id: "2",
    oldPrice: 388.0,
    repertory: 20,
    specType: [
      {
        name: "酒精度",
        options: [{ value: "53%" }]
      }
    ],
    lbt: [
      { url: require("../../assets/image/liquor/carousel1.png") },
      { url: require("../../assets/image/liquor/carousel2.png") },
      { url: require("../../assets/image/liquor/carousel3.png") }
    ],
    goodsInfoUrl: require("../../assets/image/liquor/goodInfo.jpg")
  },
  {
    id: "3",
    oldPrice: 228.0,
    repertory: 20,
    specType: [
      {
        name: "尺码",
        options: [
          { value: "S" },
          { value: "M" },
          { value: "L" },
          { value: "XL" }
        ]
      }
    ],
    lbt: [
      { url: require("../../assets/image/T-shirt/carousel1.png") },
      { url: require("../../assets/image/T-shirt/carousel2.png") },
      { url: require("../../assets/image/T-shirt/carousel3.png") }
    ],
    goodsInfoUrl: require("../../assets/image/T-shirt/goodInfo.jpg")
  },
  {
    id: "4",
    oldPrice: 19999,
    repertory: "缺货",
    specType: [
      {
        name: "尺寸",
        options: [{ value: "65寸" }]
      }
    ],
    lbt: [
      { url: require("../../assets/image/capacity/carousel1.png") },
      { url: require("../../assets/image/capacity/carousel2.png") },
      { url: require("../../assets/image/capacity/carousel3.png") }
    ],
    goodsInfoUrl: require("../../assets/image/capacity/goodInfo.jpg")
  },
  {
    id: "5",
    oldPrice: 88.0,
    repertory: 20,
    specType: [
      {
        name: "内存",
        options: [{ value: "16G" }, { value: "32G" }]
      }
    ],
    lbt: [
      { url: require("../../assets/image/USB/carousel1.jpg") },
      { url: require("../../assets/image/USB/carousel2.jpg") },
      { url: require("../../assets/image/USB/carousel3.jpg") },
      { url: require("../../assets/image/USB/carousel4.jpg") }
    ],
    goodsInfoUrl: require("../../assets/image/USB/goodInfo.jpg")
  },
  {
    id: "6",
    oldPrice: 236.0,
    repertory: "缺货",
    specType: [
      {
        name: "颜色",
        options: [{ value: "黑白组合" }]
      }
    ],
    lbt: [
      { url: require("../../assets/image/tea/tea01.png") },
      { url: require("../../assets/image/tea/tea02.png") },
      { url: require("../../assets/image/tea/tea03.png") },
      { url: require("../../assets/image/tea/tea04.png") }
    ],
    goodsInfoUrl: require("../../assets/image/tea/tea.jpg")
  }
];

function getGoods(id) {
  for (var i in goodsInfos) {
    if (goodsInfos[i].id === id) return goodsInfos[i];
  }
}

export default {
  data() {
    return {
      goodsInfo: {},
      number: 1, // 记录商品的数量
      size: "", // 记录商品的规格
      title: "", // 记录商品的标题
      price: "", // 记录商品的价格
      score: "", // 记录商品所需要的积分
      stock: "", // 记录商品库存
      remaining: 47
    };
  },
  methods: {
    addClass(even) {
      $(even.target)
        .addClass("active")
        .siblings()
        .removeClass("active");
      this.getSize();
    },
    getData() {
      const url = `/product/detail?id=${this.$route.query.id}`;

      this.$axios({
        url,
        method: "get"
      }).then(response => {
        const data = response.data.data;
        this.title = data.name;
        this.price = data.price;
        this.score = data.score;
        this.stock = data.stock;
      });

      this.goodsInfo = getGoods(this.$route.query.id);
    },
    getSize() {
      setTimeout(() => {
        // 获取商品的规格
        for (let i = 0; i < $(this.$refs.addactive).length; i++) {
          if ($(this.$refs.addactive)[i].classList.contains("active")) {
            this.size = $(this.$refs.addactive)[i].innerHTML;
          }
        }
        // console.log(this.size);
        if (this.size === "32G") {
          this.price = "68";
        } else if (this.size === "16G") {
          this.price = "48";
        }
      }, 0);
    },
    goOrder() {
      // 获取商品的标题、价格
      let goodsInfo = {
        title: this.title,
        price: this.price,
        number: this.number,
        size: this.size
      };
      // 把goodsInfo存到localStorage
      this.$store.commit("addGoodsInfo", goodsInfo);
      this.$router.push({
        path: "/order",
        query: { id: this.$route.query.id }
      });
    },
    // 与localStrong的数据同步
    upGoodsData() {
      if (!(this.$store.state.buyGoodsInfo == {})) {
        let data = this.$store.state.buyGoodsInfo;
        this.size = data.size;
        this.number = data.number;

        setTimeout(() => {
          for (let i = 0; i < $(this.$refs.addactive).length; i++) {
            if ($(this.$refs.addactive)[i].innerHTML === this.size) {
              $($(this.$refs.addactive)[i])
                .addClass("active")
                .siblings()
                .removeClass("active");
            }
          }
        }, 0);
      }
    }
  },
  created() {
    this.upGoodsData();
    this.getData();
    this.getSize();
  }
};
</script>

<style scoped>
#app {
  padding-bottom: 46px;
}

#slideshow {
  position: relative;
  margin-bottom: 3px;
}

#introduce {
  background-color: #fff;
  padding: 10px;
  position: relative;
  margin-bottom: 10px;
}

#introduce .title {
  font-size: 18px;
}

#introduce .price .option {
  border: 1px solid #464f80;
  border-radius: 5px;
  display: inline-block;
  padding: 0 5px;
  margin: 5px 10px 5px 0px;
}
#introduce .price .prohibition {
  border-radius: 5px;
  display: inline-block;
  padding: 0 5px;
  margin: 5px 10px 5px 0px;
}

#introduce .price .rmb,
#introduce .price .option .newPrice {
  line-height: 30px;
  display: inline-block;
  color: #464f80;
  font-size: 16px;
}

#introduce .sales {
  font-size: 16px;
  top: 60px;
  color: #dddddd;
}

#introduce .inventory {
  color: #8a888a;
  font-size: 15px;
  border-top: 1px solid #ccc;
  position: absolute;
  height: 46px;
  width: 100%;
  bottom: 0px;
  left: 0px;
}
#introduce .inventory .pinkage {
  float: left;
  line-height: 46px;
  margin-left: 22px;
}
#introduce .inventory .right {
  float: right;
  line-height: 46px;
  margin-right: 14px;
}

#specification {
  background-color: #fff;
  padding: 5px;
  color: #000;
  font-size: 15px;
  position: relative;
  color: #8a888a;
  margin-bottom: 10px;
}
#specification .accordionTitle {
  font-size: 15px;
  float: left;
  color: #666666;
}
#specification .type {
  padding: 10px 20px;
}
#specification .weight {
  line-height: 40px;
  width: 50px;
  float: left;
}
#specification .label {
  margin-left: 50px;
}
#specification .label .number {
  display: inline-block;
  /* border: 1px solid #000; */
  border-radius: 10%;
  width: 60px;
  height: 30px;
  background-color: #ccc;
  margin: 5px;
  font-size: 12px;
}
#specification .label .active {
  background-color: #464f80;
  color: #ffffff;
}
#specification .quantity {
  padding: 20px 20px;
}
#specification .quantity .count {
  float: left;
  line-height: 35px;
  /* text-align: center; */
}
#specification .quantity .yd-spinner {
  display: block;
  margin-left: 50px;
}

#goodsDetails {
  width: 100%;
  background-color: #fff;
}
#goodsDetails .text {
  padding: 8px;
  font-size: 15px;
}

#buyNow {
  position: fixed;
  bottom: 0px;
  background-color: #3a3d4e;
  width: 100%;
  z-index: 999;
}
#buyNow .buyBt {
  padding: 10px;
  width: 100%;
  text-align: center;
  display: block;
  margin: 0 auto;
  color: #fff;
  display: block;
  font-size: 20px;
}
</style>

