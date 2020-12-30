<template>
   <div id="detail">
       <detail-nav-bar ref="nav" class="detail-nav" @titleClick="titleClick"/>
       <scroll class="content"
        ref="scroll" 
        :probe-type="3"
        :data="[topImages, goods, shop, detailInfo, paramInfo, commentInfo, recommends]" 
        @scroll="contentScroll">
            <detail-swiper ref="base" :top-images="topImages"/>
            <detail-base-info :goods="goods"/>
            <detail-shop-info :shop="shop"/>
            <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
            <detail-param-info ref="param" :param-info="paramInfo"/>
            <detail-comment-info ref="comment" :comment-info="commentInfo"/>
            <goods-list ref="recommend" :goodsList="recommends"/>
       </scroll>
        <detail-bottom-bar @addCart="addCart"/>
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
        Scroll,
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
            currentIndex: 0,
        }
    },
    created() {
        // 1.获取iid
        this.iid = this.$route.params.iid

        // 2.请求数据
        getDetail(this.iid).then(res => {
            // 2.1.获取结果
            const data = res.result
            // 2.2.获取顶部信息
            this.topImages = res.result.itemInfo.topImages
            // 2.3.获取商品信息
            this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)
            // 2.4.获取店铺信息
            this.shop = new Shop(data.shopInfo)
            // 2.5.获取商品信息
            this.detailInfo = data.detailInfo
            // 2.6.保存参数信息
            this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)
            // 2.7.保存评论信息
            if(data.rate.list) {
                this.commentInfo = data.rate.list[0]
            }

        }).catch(err=>{
                console.log('发生错误');
            });

        getRecommend().then(res => {
            this.recommends = res.data.list
        }) 

        
    },
    updated() {
        this.getThemeTopY = debounce(() => {
            this.themeTopYs = []
            this.themeTopYs.push(0)
            this.themeTopYs.push(this.$refs.param.$el.offsetTop)
            this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
            this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
            this.themeTopYs.push(Number.MAX_VALUE)
        }, 100)
    },
    methods: {
        imageLoad() {
            this.$refs.scorll && this.$refs.scroll.refresh()
            this.getThemeTopY()
        },
        titleClick(index) {
            this.$refs.scroll.refresh()
            this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 200)
        },
        contentScroll(position) {
            let positionY = -position.y
            let length = this.themeTopYs.length
            for(let i = 0; i < length - 1; i++) {
                if(this.currentIndex !== i && (positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1])){
                    this.currentIndex = i
                    this.$refs.nav.currentIndex = this.currentIndex
                }
            }
            // 监听backTop的显示
            this.showBackTop = Math.abs(position.y) > BACKTOP_DISTANCE
        },
        addCart() {
            // 创建对象
            const product = {}
            // 对象信息
            product.image = this.topImages[0]
            product.title = this.goods.title
            product.desc = this.goods.desc
            product.price = this.goods.realPrice
            product.iid = this.iid

            // this.addCart(product).then(res => {
            //     this.$toast.show(res, 2000)
            // })

            // 添加到Store中
            this.$store.dispatch('addCart', product).then(res => {
                this.$toast.show(res, 2000)
            })
            
        }
    },
    destoryed() {
        // 取消详情页推荐商品事件总线的监听，与首页商品列表区分开
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
        padding-top: 10px;
        height: calc(100% - 44px);
    }
</style>