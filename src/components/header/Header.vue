<template>
    <div class="header">
        <div class="content_wrapper">
            <div class="avatar">
                <img :src="seller.avatar" with="64" height="64">
            </div>
            <div class="content">
                <div class="title">
                    <span class="brand"></span>
                    <span class="name">{{seller.name}}</span>
                </div>
                <div class="description">
                    {{seller.description}}/{{seller.deliveryTime}}分钟送达
                </div>
                <div v-if="seller.supports" class="support">
                    <!--<span class="icon" :class="classMap[seller.supports[0].type]"></span>-->
                    <v-iconClassMap :iconType="seller.supports[0].type"></v-iconClassMap>
                    <span class="text">
                        {{seller.supports[0].description}}
                    </span>
                </div>
            </div>
            <div class="support_count" v-if="seller.supports" @click="showDetail">
                <span class="count">{{seller.supports.length}}个</span>
                <i class="icon-keyboard_arrow_right"></i>
            </div>
        </div>
        <div class="bulletin_wrapper" @click="showDetail">
            <span class="bulletin_title"></span>
            <span class="bulletin_text">{{seller.bulletin}}</span>
            <i class="icon-keyboard_arrow_right"></i>
        </div>
        <div class="head_bg">
            <img :src="seller.avatar" width="100%" height="100%">
        </div>
        <transition name="fade">
            <div v-show="detailShow" class="detail">
                <div class="detail_wrapper clearfix">
                    <div class="detail_main">
                        <h1 class="name">{{seller.name}}</h1>
                        <div class="star_wrapper">
                            <v-star :size="48" :score="seller.score"></v-star>
                        </div>
                        <div class="title">
                            <div class="line"></div>
                            <div class="text">优惠信息</div>
                            <div class="line"></div>
                        </div>
                        <ul class="supports" v-if="seller.supports">
                            <li class="support_item" v-for="(supportItem,index) in seller.supports" :key="index">
                                <!--<span class="icon" :class="classMap[supportItem.type]"></span>-->
                                <v-iconClassMap :iconType="supportItem.type"></v-iconClassMap>
                                <span class="text">{{supportItem.description}}</span>
                            </li>
                        </ul>
                        <div class="title">
                            <div class="line"></div>
                            <div class="text">商家公告</div>
                            <div class="line"></div>
                        </div>
                        <div class="bulletin">
                            <p class="content">{{seller.bulletin}}</p>
                        </div>
                    </div>
                </div>
                <div class="detail_close" v-on:click="closeDetail">
                    <i class="icon-close"></i>
                </div>
            </div>
        </transition>
    </div>
</template>

<script type='text/ecmascript6'>

import Star from 'components/Star/Star';
import iconClassMap from 'components/iconClassMap/iconClassMap';

export default {
    name: 'Header',
    props: {
        seller: {
            type: Object
        }
    },
    components: { // 注册子组件
        'v-star': Star,
        'v-iconClassMap': iconClassMap
    },
    data() {
        return {
            detailShow: false
        };
    },
    // created(){
    //     // 定义一个数组，代表不同的icon[减，折，特，票，保],有序排列，index代表type
    //     this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
    // },
    methods: {
        showDetail() {
            this.detailShow = true;
        },
        closeDetail() {
            this.detailShow = false;
        }
    }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">

@import '../../common/stylus/mixin.styl'

.header
    color:#fff
    background:rgba(7,17,27,0.5)
    position:relative
    overflow:hidden
    .content_wrapper
        padding:24px 12px 18px 24px
        font-size:0
        position:relative
        .avatar
            display:inline-block
            img
                border-radius:2px
        .content
            display:inline-block
            margin-left:16px
            .title
                margin:2px 0 8px 0
                .brand
                    display:inline-block
                    width:30px
                    height:18px
                    vertical-align:top
                    bg-img('brand')
                    background-size:30px 18px
                    background-repeat:no-repeat
                .name
                    margin-left:6px
                    line-height:18px
                    font-size:16px
                    font-weight:bold
            .description
                line-height:12px
                margin-bottom:10px
                font-size:12px
                font-weight:200
            .support
                .icon
                    margin-right:2px
                    &.decrease
                        bg-img('decrease_1')
                    &.discount
                        bg-img('discount_1')
                    &.guarantee
                        bg-img('guarantee_1')
                    &.invoice
                        bg-img('invoice_1')
                    &.special
                        bg-img('special_1')
                .text
                    line-height:12px
                    font-size:10px
        .support_count
            position:absolute
            right:12px
            bottom:14px
            padding:0 8px
            height:24px
            line-height:24px
            text-align:center
            border-radius:14px
            background:rgba(0,0,0,0.2)
            .count
                font-size:10px
            .icon-keyboard_arrow_right
                font-size:10px
                margin-left:2px
                line-height:24px
    .bulletin_wrapper
        height:28px
        line-height:28px
        padding:0 28px 0 28px
        white-space:nowrap
        overflow:hidden
        text-overflow:ellipsis
        position:relative
        background:rgba(7,17,27,0.2)
        .bulletin_title
            display:inline-block
            width:22px
            height:12px
            bg-img:("bulletin")
            background-size:22px 12px
            background-repeat:no-repeat
            
        .bulletin_text
            font-size:10px
            margin:0 4px
            vertical-align:top
        .icon-keyboard_arrow_right
            position:absolute
            font-size:10px
            right:12px
            line-height:30px
    .head_bg
        position:absolute
        width:100%
        height:100%
        left:0
        top:0
        z-index:-1
        filter:blur(10px)//图片模糊
    .detail
        position:fixed
        top:0
        left:0
        z-index:100
        width:100%
        height:100%
        overflow:auto
        background:rgba(7,17,27,0.8)
        -webkit-backdrop-filter:blur(10px) // 兼容iphone系统
        &.fade-enter-active,&.fade-leave-active{
            transition: 0.5s            
        }
        &.fade-enter
            opacity:0 
            background:rgba(7,17,27,0) 
        &.fade-leave
            opacity:1
            background:rgba(7,17,27,0.8) 
        .detail_wrapper
            min-height:100%
            width:100%
            .detail_main
                margin-top:64px
                padding-bottom:64px
                .name
                    line-height:16px
                    text-align:center
                    font-size:16px
                    font-weight:700
                .star_wrapper
                    margin-top:16px
                    padding:2px 0
                    text-align:center
                .title
                    display:flex
                    width:80%
                    margin:30px auto 24px auto
                    .line
                        flex:1
                        position:relative
                        top:-6px
                        border-bottom:1px solid rgba(255,255,255,0.2)
                    .text
                        padding:0 12px
                        font-size:14px
                .supports
                    width:80%
                    margin:0 auto
                    .support_item
                        padding:0 12px
                        margin-bottom:12px
                        font-size:0
                        &:last-child
                            margin-bottom:0
                        .icon
                            width:16px
                            height:16px
                            margin-right:16px
                            background-repeat:no-repeat
                            &.decrease
                                bg-img("decrease_2")
                            &.discount
                                bg-img("discount_2")
                            &.invoice
                                bg-img("invoice_2")
                            &.special
                                bg-img("special_2")
                            &.guarantee
                                bg-img("guarantee_2")
                        .text
                            line-height:16px
                            font-size:12px
                .bulletin
                    margin:0 auto
                    width:80%
                    .content
                        padding:0 12px
                        line-height:24px
                        font-size:12px
        .detail_close
            position:relative
            width:32px
            height:32px
            margin:-64px auto 0 auto
            font-size:32px
            clear:both            
</style>
