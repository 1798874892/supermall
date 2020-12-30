<template>
       <nav-bar>
           <div slot="left" class="back" @click="backClick">
               <img src="~assets/img/common/back.svg" alt="">
           </div>
           <div slot="center" class="titles">
               <div v-for="(item, index) in titles"
               :key="index"
                class="title-item"
                :class="{active: currentIndex === index}"
                @click="titleClick(index)">{{item}}
                </div>
           </div>
        </nav-bar>
</template>

<script>
import NavBar from 'components/common/navbar/NavBar'
export default {
    name: "DetailNavBar",
    components: {
        NavBar
    },
    data() {
        return {
            titles: ['商品', '参数', '评论', '推荐'],
            currentIndex: 0
        }
    },
    methods: {
        titleClick(index) {
            this.currentIndex = index
            this.$emit('titleClick', index, 500)
        },
        backClick() {
            this.$router.go(-1)
        }
    }
}
</script>

<style scoped>
    .titles {
        display: flex;
        padding: 0 20px;
        font-size: 14px;
    }

    .title-item {
        flex: 1;
    }

    .active {
        color: var(--color-high-text);
    }

    .back img{
        width: 24px;
        height: 24px;
        vertical-align: middle;
        margin-top: 12px;
    }
</style>