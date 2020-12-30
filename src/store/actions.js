import {
    ADD_COUNTER,
    ADD_TO_CART
} from './mutation-types'

export default {
    addCart({state, commit}, payload) {
        return new Promise((resolve, reject) => {
            let oldProduct = state.cartList.find(item => item.iid === payload.iid)
            if(oldProduct) {
                commit(ADD_COUNTER, oldProduct)
                resolve('当前的商品数量+1')
            }else {
                payload.count = 1
                payload.checked = false
                commit(ADD_TO_CART, payload)
                resolve('添加了新的商品')
            }
        })
    }
}