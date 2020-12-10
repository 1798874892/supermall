<template>
   <div id="home" class="wrapper">
     <nav-bar class="home-nav"><div slot="center">购物车</div></nav-bar>
      <tab-control ref="tabControl1" 
                    :titles="['流行', '新款', '精选']" 
                    @tabClick="tabClick"
                    class="tab-control" v-show="isTabFixed"/>
      <scroll class="content" 
              ref="scroll"
              :probe-type="3"
              @scroll="contentScroll"
              :pull-up-load="true"
              @pullingUp="loadMore">
          <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"/>
          <recommend-view :recommends="recommends"/>
          <feature-view/>
          <tab-control ref="tabControl2" 
                      :titles="['流行', '新款', '精选']" 
                      @tabClick="tabClick" />
          <goods-list :goods-list="showGoodsList" />
      </scroll>
      <back-top @click.native="backClick" v-show="showBackTop"/>
   </div>
</template>

<script>

import HomeSwiper from './childComps/HomeSwiper'
import RecommendView from './childComps/RecommendView'
import FeatureView from './childComps/FeatureView'

import NavBar from 'components/common/navbar/NavBar';
import TabControl from 'components/content/tabControl/TabControl'
import GoodsList from 'components/content/goods/GoodsList'
import Scroll from 'components/common/scroll/Scroll'
import BackTop from 'components/content/backTop/BackTop'

import { getHomeMultidata, getHomeData, RECOMMEND, BANNER } from 'network/home'
import {NEW, POP, SELL, BACKTOP_DISTANCE} from "@/common/const";
import {debounce} from 'common/utils'
import {itemListenerMixin} from 'common/mixin'


export default {
  name: "Home",
  components: {
    HomeSwiper,
    RecommendView,
    FeatureView,
    NavBar,
    TabControl,
    GoodsList,
    Scroll,
    BackTop
  },
  mixin: [itemListenerMixin],
  data() {
    return {
      banners: [],
      recommends: [],
      goodsList: {
        'pop': {page: 1, list: []},
        'new': {page: 1, list: []},
        'sell': {page: 1, list: []}
      },
      currentType: POP,
      showBackTop: false,
      tabOffsetTop: 0,
      isTabFixed: false,
      saveY: 0
    }
  },
  computed: {
    showGoodsList() {
      return this.goodsList[this.currentType].list
    }
  },
  destroyed() {
    console.log('home destroyed');
  },
  activated() {
    this.$refs.scroll.refresh()
    this.$refs.scroll.scrollTo(0, this.saveY, 0)       
  },
  deactivated() {
    this.saveY = this.$refs.scroll.getScrollY()
  },
  created() {
    console.log('创建Home');
    this.getMultiData()

    this.getHomeProducts(POP)
    this.getHomeProducts(NEW)
    this.getHomeProducts(SELL)
  },
  mounted() {
    const refresh = debounce(this.$refs.scroll.refresh, 50)
     this.$bus.$on('itemImageLoad', () => {
      refresh()
    })
  },
  methods: {
    // 事件监听相关方法

    tabClick(index) {
      switch(index) {
        case 0:
          this.currentType = POP;
          break
        case 1:
          this.currentType = NEW;
          break
        case 2:
          this.currentType = SELL;
          break
      }
      this.$refs.tabControl1.currentIndex = index;
      this.$refs.tabControl2.currentIndex = index;
    },
    backClick() {
      this.$refs.scroll.scrollTo(0, 0)
    },
    contentScroll(position) {
        this.showBackTop = position.y < -BACKTOP_DISTANCE
        this.isTabFixed = position.y < -this.tabOffsetTop
      },
    loadMore() {
        this.getHomeProducts(this.currentType)
      },
      swiperImageLoad() {
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
      },

    //  网络请求相关方法
    getMultiData() {
      getHomeMultidata().then(res => {
      this.banners = res.data[BANNER].list
      this.recommends = res.data[RECOMMEND].list
      })
    },
    getHomeProducts(type) {
      getHomeData(type, this.goodsList[type].page).then(res => {
        const goodsList = res.data.list;
        this.goodsList[type].list.push(...goodsList)
        this.goodsList[type].page += 1

        this.$refs.scroll.finishPullUp()
      })
    }
  }
}
</script>

<style scoped>
  #home {
    /* padding-top: 44px; */
    height: 100vh;
    position: relative;
  }

  .home-nav {
    background-color: var(--color-tint);
    color: #fff;

    /* position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 9; */
  }

  .content {
    overflow: hidden;

    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
    
  }

  .tab-control {
    position: relative;
    z-index: 9;
  }

  /* .back-top {
        position: fixed;
        right: 10px;
        bottom: 60px;
    } */

  /* .fixed {
      position: fixed;
      top: 44px;
      left: 0;
      right: 0;
    }  */

    
</style>