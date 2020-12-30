import {
  ADD_COUNTER,
  ADD_TO_CART
} from './mutation-types'

const mutations = {
  [ADD_TO_CART](state,payload){
    state.cartList.push(payload);
  },
  [ADD_COUNTER](state, payload){
      payload.checked = true
      payload.count ++ ;
  },
    addCart(state, info) {
      console.log(info);
      // 1.查看是否添加过
      const oldInfo = state.cartList.find(item => item.iid === info.iid)
      // 2.+1或者新添加
      if (oldInfo) {
        oldInfo.count += 1
      } else {
        info.count = 1
        info.checked = true
        state.cartList.push(info)
      }
      
    }
  }
  
  export default mutations
  
  