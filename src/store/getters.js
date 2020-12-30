export default {
    cartList(state) {
        return state.cartList
    },
    cartLength(state, getters) {
        return getters.cartList.length
    }
}