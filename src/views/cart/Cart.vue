<template>
  <div id="cart">
      <nav-bar class="nav-bar">
        <div slot="center">购物车({{cartLength}})</div>
      </nav-bar>

      <cart-list class="cart-list" :cart-list="cartList"/>
  </div>
</template>

<script>
  import NavBar from 'components/common/navbar/NavBar'
  import CartList from './childComps/CartList'

  export default {
    name: "Cart",
    components: {
      NavBar,
      CartList
    },
    computed: {
      cartLength() {
        return this.$store.getters.length
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
  }
</style>
