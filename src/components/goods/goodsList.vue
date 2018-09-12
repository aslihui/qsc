<template>
  <div id="app">
    <!-- 图片轮播 -->
    <yd-slider autoplay="3000">
      <yd-slider-item v-for="(item, key) in images"  :key="key" :data-goodsId="item.id" @click.native="toGoodsInfo">
          <img id="goods" :src="item.url">
      </yd-slider-item>
    </yd-slider>
    <!-- <yd-flexbox direction="vertical">
      <yd-flexbox-item>
        <img >
      </yd-flexbox-item>
    </yd-flexbox> -->
    <yd-list theme="1" slot="list">
      <yd-list-item v-for="(item, key) in dataList" :key="key" @click.native="goGoodsInfo" :data-goodsId="item.id">
        <img slot="img" v-lazy="item.faceImg">
        <span slot="title">{{item.name}}</span>
        <yd-list-other slot="other">
          <div>
            <span class="list-price">
              <em class="icon iconfont icon-jifen"></em>{{item.score}}</span>
          </div>
        </yd-list-other>
      </yd-list-item>
    </yd-list>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      dataList: [],
      images: [
        {
          id: 5,
          url: require("../../assets/image/USB/banner.jpg")
        },
        {
          id: 1,
          url: require("../../assets/image/bolster/banner.jpg")
        },
        // {
        //   id: 6,
        //   url: require("../../assets/image/tea/tea720x300.jpg")
        // }
       ]
    };
  },
  methods: {
    goGoodsInfo(event) {
      var goodsId;
      if (event.target.getAttribute("data-goodsId")) {
        goodsId = event.target.getAttribute("data-goodsId");
        // console.log(goodsId);
      } else {
        goodsId = $(event.target)
          .parents(".yd-list-item")
          .attr("data-goodsId");
        // console.log(goodsId);
      }
      this.$router.push({ path: "/goodsInfo", query: { id: goodsId } });
    },
    toGoodsInfo () {
      var goodsId;
      if (event.target.getAttribute("data-goodsId")) {
        goodsId = event.target.getAttribute("data-goodsId");
        // console.log(goodsId);
      } else {
        goodsId = $(event.target)
          .parents(".yd-slider-item")
          .attr("data-goodsId");
        // console.log(goodsId);
      }
      this.$router.push({ path: "/goodsInfo", query: { id: goodsId } });
    },
    getGoodsData() {
      const url = `/product/list`;

      this.$axios({
        url,
        method: "get"
      }).then(Response => {
        this.dataList = Response.data.data;
        // console.log(this.dataList);
      });
    }
  },
  created() {
    this.getGoodsData();
  }
};
</script>

<style scoped>

</style>

<style>
.yd-list-theme1 .yd-list-item .yd-list-title {
  font-size: 15px;
}
.yd-list-other {
  font-size: 15px;
  color: #464f80;
}
.yd-list-other .list-price em {
  margin-right: 5px;
}
</style>


