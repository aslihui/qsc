import Vue from 'vue'
import Vuex from 'vuex'
import { addLocalGoodsInfo, getLocalGoodsInfo } from '../common/goodsLocalStorageTool';

Vue.use(Vuex)

const state = {
    buyGoodsInfo: {}
}

// 定义所需的 mutations
const mutations = {
    addGoodsInfo(state, buyGoodsInfo) {
        addLocalGoodsInfo(buyGoodsInfo)
    },
    getGoodsInfo(state) {
        state.buyGoodsInfo = getLocalGoodsInfo()
    }
}

// 创建 store 实例
export default new Vuex.Store({
    state,
    mutations
})