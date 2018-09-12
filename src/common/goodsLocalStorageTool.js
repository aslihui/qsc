
const key = 'goods'

/**
 * 获取购买的商品信息
 */
export const getLocalGoodsInfo = () => {
    const localgoodsInfo = JSON.parse(localStorage.getItem((key) || "{}"))
    return localgoodsInfo;
}

/**
 * 保存购买的商品信息到本地
 */
export const addLocalGoodsInfo = (goodsInfo) => {
    localStorage.setItem(key,JSON.stringify(goodsInfo));
}