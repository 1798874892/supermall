<template>
  <div id="cart">
      <nav-bar class="nav-bar">
        <div slot="center">购物车({{cartLength}})</div>
      </nav-bar>

        <cart-list class="cart-list" :cart-list="cartList"/>

      <cart-bottom-bar/>
  </div>
</template>

<script>
  import NavBar from 'components/common/navbar/NavBar'
  import CartList from './childComps/CartList'
  import CartBottomBar from './childComps/CartBottomBar'



  export default {
    name: "Cart",
    components: {
      NavBar,
      CartList,
      CartBottomBar
    },
    computed: {
      cartLength() {
        return this.$store.getters.cartLength
      },
      cartList() {
        return this.$store.getters.cartList
      }
    }
  }
</script>

<style scoped>
  #cart {
    height: 100vh;
    
  }

  .nav-bar {
    background-color: var(--color-tint);
    font-weight: 700;
    color: #fff;
    
  }

  .cart-list {
    position: absolute;
    top: 44px;
    bottom: 49px;
    width: 100%;
    overflow: hidden;
  }

</style>
