<template>
  <scroll>
    <div v-if="cartList.length">
      <cart-list-item v-for="item in cartList" :key="item.iid" :item-info="item"></cart-list-item>
    </div>
    <div v-else class="empty-cart">
      <p>购物车是空的^.^</p>
      <p>不妨去逛逛吧……</p>
      <p @click="goHome">去逛逛</p>
    </div>
  </scroll>
</template>

<script>
  import Scroll from 'components/common/scroll/Scroll'
  import CartListItem from './CartListItem'

	export default {
		name: "CartList",
    components: {
		  Scroll, CartListItem
    },
    props: {
	    cartList: {
		  type: Array,
        default() {
		      return []
        }
      }
    },
    methods: {
      goHome() {
        this.$router.replace('/home')
      }
    }
	}
</script>

<style scoped>
.empty-cart {
    padding-top: 50px;
    text-align: center;
}
.empty-cart p:nth-child(3){
    margin: 20px auto;
    width: 80px;
    padding: 4px 12px;
    background: #f3f3f3;
    border-radius: 10px;
    border: 1px solid rgba(0,0,0, .3);
    background-color: pink;
}
</style>
