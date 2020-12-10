<template>
   <div id="detail">
       <detail-nav-bar ref="nav" class="detail-nav" @titleClick="titleClick"/>
       <scroll class="content"
        ref="scroll" 
        :probe-type="3" 
        @scroll="contentScroll">
            <detail-swiper :top-images="topImages"/>
            <detail-base-info :goods="goods"/>
            <detail-shop-info :shop="shop"/>
            <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
            <detail-param-info ref="param" :param-info="paramInfo"/>
            <detail-comment-info ref="comment" :comment-info="commentInfo"/>
            <!-- <detail-recommend-info ref="recommend" :recommend-list="recommendList"/> -->
            <goods-list ref="recommend" :goodsList="recommends"/>
       </scroll>
        <detail-bottom-bar @addToCart="addToCart"/>
        <back-top @click.native="backClick" v-show="showBackTop"/>
   </div>
</template>

<script>
import DetailNavBar from './childComps/DetailNavBar'
import DetailSwiper from './childComps/DetailSwiper'
import DetailBaseInfo from './childComps/DetailBaseInfo'
import DetailShopInfo from './childComps/DetailShopInfo'
import DetailGoodsInfo from './childComps/DetailGoodsInfo'
import DetailParamInfo from './childComps/DetailParamInfo'
import DetailCommentInfo from './childComps/DetailCommentInfo'
import DetailRecommendInfo from './childComps/DetailRecommendInfo'
import DetailBottomBar from './childComps/DetailBottomBar'

import Scroll from 'components/common/scroll/Scroll'
import GoodsList from 'components/content/goods/GoodsList'

import {getDetail, Goods, Shop, GoodsParam, getRecommend} from "network/detail"
import {debounce} from 'common/utils'
import {itemListenerMixin, backTopMixin} from 'common/mixin'
import {BACKTOP_DISTANCE} from 'common/const'

export default {
    name: "Detail",
    components: {
        DetailNavBar,
        DetailSwiper,
        DetailShopInfo,
        DetailBaseInfo,
        DetailGoodsInfo,
        DetailParamInfo,
        DetailCommentInfo,
        DetailRecommendInfo,
        DetailBottomBar,
        GoodsList,
        Scroll
    },
    mixins: [itemListenerMixin, backTopMixin],
    data() {
        return {
            iid: null,
            topImages: [],
            goods: {},
            shop: {},
            detailInfo: {},
            paramInfo: {},
            commentInfo: {},
            recommends: [],
            themeTopYs: [],
            getThemeTopY: null,
            currentIndex: 0
        }
    },
    created() {
        this.iid = this.$route.params.iid

        getDetail(this.iid).then(res => {
            const data = res.result
            this.topImages = res.result.itemInfo.topImages

            this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)
            this.shop = new Shop(data.shopInfo)
            this.detailInfo = data.detailInfo
            this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)
            if(data.rate.list) {
                this.commentInfo = data.rate.list[0]
            }

        })

        getRecommend().then(res => {
            this.recommends = res.data.list
        }) 

        this.getThemeTopY = debounce(() => {
            this.themeTopYs = []
            this.themeTopYs.push(0)
            this.themeTopYs.push(this.$refs.param.$el.offsetTop)
            this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
            this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
            this.themeTopYs.push(Number.MAX_VALUE)
        }, 100)
    },
    // updated() {
        
    // },
    methods: {
        imageLoad() {
            this.$refs.scroll.refresh()
            this.getThemeTopY()
        },
        titleClick(index) {
            this.$refs.scroll.scrollTo(0, -this.themeTopYs[index] + 49, 200)
        },
        contentScroll(position) {
            const positionY = -position.y
            let length = this.themeTopYs.length
            for(let i = 0; i < length - 1; i++) {
                if(this.currentIndex !== i && (positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1])){
                    this.currentIndex = i
                    this.$refs.nav.currentIndex = this.currentIndex
                }
            }

            this.showBackTop = position.y < -BACKTOP_DISTANCE
        },
        addToCart() {
            const product = {}
            product.image = this.topImages[0]
            product.title = this.goods.title
            product.desc = this.goods.desc
            product.price = this.goods.realPrice
            product.iid = this.iid

            this.$store.commit('addCart', product)
            
        }
    },
    destoryed() {
        this.$bus.$off('itemImgLoad', this.itemImgListener)
    }
}
</script>

<style scoped>
    #detail {
        position: relative;
        z-index: 9;
        background-color: #fff;
        height: 100vh;
    }

    .detail-nav {
        position: relative;
        z-index: 9;
        background-color: #fff;
    }

    .content {
        height: calc(100% - 44px);
    }
</style>