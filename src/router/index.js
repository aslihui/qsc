import Vue from 'vue'
import Router from 'vue-router'

const goodsList = resolve => require(['@/components/goods/goodsList'], resolve);
const goodsInfo = resolve => require(['@/components/goods/goodsInfo'], resolve);
const order = resolve => require(['@/components/order/order'], resolve);
const location = resolve => require(['@/components/location/location'], resolve);
const management = resolve => require(['@/components/location/management'], resolve);
const editStie = resolve => require(['@/components/location/editStie'], resolve);
const orderList = resolve => require(['@/components/order/orderList'], resolve);
const payInfo = resolve => require(['@/components/pay/payInfo'], resolve);

Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      component:goodsList,
      meta: {
        title: '巧商城'
      }
    },
    {
      path: '/goodsinfo',
      component: goodsInfo,
      meta: {
        title: '商品详情'
      }
    },
    {
      path: '/order',
      component: order,
      meta: {
        title: '确认订单'
      }
    },
    {
      path:  '/addSite',
      component: location,
      meta: {
        title: '新增地址'
      }
    },
    {
      path: '/management',
      component: management,
      meta: {
        title: '管理收货地址'
      }
    },
    {
      path: '/editStie',
      component: editStie,
      meta: {
        title: '修改地址'
      }
    },
    {
      path: '/orderList',
      component: orderList,
      meta: {
        title: '我的订单'
      }
    },
    {
      path: '/payInfo',
      component: payInfo,
      meta: {
        title: '立即支付'
      }
    },
    {
      path: "*",
      component: goodsList
    }
  ]
})
