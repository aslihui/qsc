<template>
  <div id="app">
    <div id="editStie" v-for="item in stieInfo" :key="item.id" :data-id="item.id">
      <div class="user clearfix" @click="modification">
        <div class="clearfix">
          <span class="name">{{ item.receivePerson }}</span>
          <span class="phone">{{ item.receiveTell }}</span>
        </div>
        <div class="detailed">{{ item.province }}{{ item.city }}{{ item.area }}{{ item.detail }}</div>
      </div>
      <div class="theEditor clearfix">
        <div class="default" :class="item.isDefault ? 'active' : ''" @click="changeDf">
          <i class="icon iconfont icon-queren"></i>
          <span v-if="item.isDefault">默认地址</span>
          <span v-if="!item.isDefault">设为默认</span>
        </div>
        <div class="remove" @click="del">
          <i class="icon iconfont icon-shanchu"></i>
          <span>删除</span>
        </div>
        <div class="Modify" @click="editStie">
          <i class="icon iconfont icon-bianjiedit26"></i>
          <span>编辑</span>
        </div>
      </div>
    </div>
    <div v-if="this.stieInfo.length === 0">
      <div class="lack">
        <img src="../../assets/image/lack/lackSite.png" alt="">
        <span>亲，你还没有地址哦~</span>
        <div class="btn" @click="goLocation">新增地址</div>
      </div>
    </div>
    <div v-if="this.stieInfo.length !== 0" id="addSite" @click="goLocation">
      <button class="btn">新增地址</button>
    </div>
  </div>
</template>

<script>
import store from "../../vuex/store";

export default {
  data() {
    return {
      stieInfo: []
    };
  },
  methods: {
    getData() {
      const url = `/user/receive/address/list`;
      // const token = this.$route.query.token;
      this.$axios({
        url,
        method: "get"
        // data: token
      }).then(response => {
        if (response.data.status === 1) {
          console.log(response.data.data);
          this.stieInfo = response.data.data;
        }
      });
    },
    modification(event) {
      var stieId;
      if (event.target.getAttribute("data-id")) {
        stieId = event.target.getAttribute("data-id");
      } else {
        stieId = $(event.target)
          .parents("#editStie")
          .attr("data-id");
      }

      const parameter = {
        id: parseInt(stieId)
      };
      const url = `/user/receive/address/modify/default`;

      this.$axios({
        url,
        method: "post",
        data: parameter,
        transformRequest: [
          function(data) {
            let ret = "";
            for (let it in data) {
              ret +=
                encodeURIComponent(it) +
                "=" +
                encodeURIComponent(data[it]) +
                "&";
            }
            return ret;
          }
        ]
      }).then(response => {
        if (response.data.status === 1) {
          this.$router.push({
            path: "/order",
            query: { id: this.$route.query.id }
          });
        }
      });
    },
    editStie(event) {
      var stieId;
      if (event.target.getAttribute("data-id")) {
        stieId = event.target.getAttribute("data-id");
      } else {
        stieId = $(event.target)
          .parents("#editStie")
          .attr("data-id");
      }
      this.$router.push({ path: "/editStie", query: { id: stieId } });
    },
    goLocation() {
      this.$router.push({
        path: "/addSite",
        query: { id: this.$route.query.id }
      });
    },
    changeDf() {
      var stieId;
      if (event.target.getAttribute("data-id")) {
        stieId = event.target.getAttribute("data-id");
      } else {
        stieId = $(event.target)
          .parents("#editStie")
          .attr("data-id");
      }

      const parameter = {
        id: parseInt(stieId)
      };
      const url = `/user/receive/address/modify/default`;

      this.$axios({
        url,
        method: "post",
        data: parameter,
        transformRequest: [
          function(data) {
            let ret = "";
            for (let it in data) {
              ret +=
                encodeURIComponent(it) +
                "=" +
                encodeURIComponent(data[it]) +
                "&";
            }
            return ret;
          }
        ]
      }).then(response => {
        if (response.data.status === 1) {
          this.getData();
        }
      });
    },
    del(event) {
      this.$dialog.confirm({
        title: "删除地址",
        mes: "确认删除该收货地址？",
        opts: () => {
          var stieId;
          console.log(event);
          if (event.target.getAttribute("data-id")) {
            stieId = event.target.getAttribute("data-id");
          } else {
            stieId = $(event.target)
              .parents("#editStie")
              .attr("data-id");
          }
          const url = `/user/receive/address/del?id=${stieId}`;
          this.$axios({
            url,
            method: "get"
          }).then(response => {
            if (response.data.status === 1) {
              this.$dialog.toast({
                mes: "删除成功",
                timeout: 1000
              });
              this.getData();
            } else {
              this.$dialog.toast({
                mes: "删除失败，请稍后再试",
                timeout: 1000
              });
            }
          });
        }
      });
    }
  },
  created() {
    this.getData();
  }
};
</script>

<style scoped>
#app {
  padding-bottom: 50px;
}
#top {
  width: 100%;
  height: 50px;
  background-color: #ffffff;
  position: fixed;
  z-index: 9999;
  border-bottom: 1px solid #dddddd;
  top: 0;
}
#top .rollback {
  color: #000000;
  font-size: 17px;
  line-height: 50px;
  height: 100%;
  float: left;
  padding: 0 15px;
}
#top .title {
  font-size: 20px;
  color: #000000;
  text-align: center;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: block;
  line-height: 50px;
}
#top .share {
  position: absolute;
  right: 15px;
  font-size: 30px;
  color: #fff;
  z-index: 999;
  line-height: 50px;
}

#editStie {
  padding: 10px 0 0 10px;
  background-color: #fff;
  border-bottom: 1px solid #eeeeee;
  position: relative;
  z-index: 999;
  margin-bottom: 10px;
}
#editStie .user {
  border-bottom: 1px solid #dddddd;
  width: 100%;
  font-size: 18px;
}
#editStie .user .name {
  float: left;
}
#editStie .user .phone {
  float: right;
  margin-right: 150px;
}
#editStie .user .detailed {
  margin: 4px 0;
  font-size: 16px;
}
#editStie .theEditor {
  padding: 5px 0;
}
#editStie .theEditor .default {
  float: left;
}
#editStie .theEditor .Modify,
#editStie .theEditor .remove {
  float: right;
}
#editStie .theEditor .remove {
  margin-left: 10px;
  margin-right: 10px;
}
#editStie .theEditor .default .icon-queren,
#editStie .theEditor .Modify .icon-bianjiedit26,
#editStie .theEditor .remove .icon-shanchu {
  font-size: 20px;
  vertical-align: middle;
}
#editStie .theEditor .default span,
#editStie .theEditor .Modify span,
#editStie .theEditor .remove span {
  vertical-align: middle;
  margin-left: 2px;
  font-size: 15px;
}

#addSite {
  position: fixed;
  bottom: 0px;
  background-color: #3a3d4e;
  width: 100%;
  z-index: 999;
}
#addSite .btn {
  padding: 10px;
  display: block;
  margin: 0 auto;
  color: #fff;
  font-size: 20px;
}
.active {
  color: #f14938;
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
</style>


