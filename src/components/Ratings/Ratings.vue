<template>
    <div class="ratings" ref="ratingsContent">
        <div class="ratings_content">
            <div class="overview">
                <div class="overview_left">
                    <h1 class="foodScore">{{seller.foodScore}}</h1>
                    <div class="title">综合平分</div>
                    <div class="rankRate">高于周边商家{{seller.rankRate}}%</div>
                </div>
                <div class="overview_right">
                    <div class="score_wrapper">
                        <span class="title">服务态度</span>
                        <v-star :size="36" :score="seller.score"></v-star>
                        <span class="score">{{seller.score}}</span>
                    </div>
                    <div class="score_wrapper">
                        <span class="title">服务态度</span>
                        <v-star :size="36" :score="seller.score"></v-star>
                        <span class="score">{{seller.score}}</span>
                    </div>
                    <div class="delivery_wrapper">
                        <span class="title">送达时间</span>
                        <span class="deliveryTime">{{seller.deliveryTime}}分钟</span>
                    </div>
                </div>
            </div>
            <v-split></v-split>
            <v-ratingselect :ratings="ratings" :select-type="selectType" :only-content="onlyContent" :desc="desc" @selRatings="filterRatings" @isContent="isContent"></v-ratingselect>
            <div class="ratings_wrapper">
                <ul>
                    <li class="ratings_item" v-for="(ratingItem,index) in ratings" :key="index" v-show="needShowList(ratingItem.rateType,ratingItem.text)">
                        <div class="avatar">
                            <img :src="ratingItem.avatar" width="28" height="28">
                        </div>
                        <div class="content">
                            <div class="username">{{ratingItem.username}}</div>
                            <div class="star_wrapper">
                                <v-star :size="24" :score="ratingItem.score"></v-star>
                                <span class="deliveryTime" v-show="ratingItem.deliveryTime">{{ratingItem.deliveryTime}}分钟送达</span>
                            </div>
                            <p class="text">{{ratingItem.text}}</p>
                            <div class="recommend_wrapper">
                                <i class="icon-thumb_up"></i>
                                <span class="text" v-for="(recommendItem,index) in ratingItem.recommend" :key="index" v-show="ratingItem.recommend && ratingItem.recommend.length">{{recommendItem}}</span>
                            </div>
                            <div class="rating_time">{{ratingItem.rateTime | formatDate('yyyy-MM-dd hh:mm')}}</div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script type='text/ecmascript6'>

import 'common/js/formatdate.js';
import BScroll from 'better-scroll';
import Star from 'components/Star/Star';
import Split from 'components/Split/Split';
import RatingSelect from 'components/RatingSelect/RatingSelect';

const ERROR_OK = 0;
const ALL = 2;

export default {
    name: 'Ratings',
    props: {
        seller: {
            type: Object
        }
    },
    data() {
        return {
            ratings: [],
            selectType: ALL, // 评论type按钮的样式，使用常量切换
            onlyContent: true, // 只看有内容的评论
            desc: {
                all: '全部',
                positive: '满意',
                negative: '不满意'
            }
        }
    },
    created() { // 请求后端数据
        this.$http.get('/api/ratings').then((response) => {
            response = response.body;
            if (response.erron === ERROR_OK) {
                this.ratings = response.data;
                this.$nextTick(() => {
                    this._initScroll();
                });
            }
        });
    },
    components: {
        'v-star': Star, // 注册子组件
        'v-split': Split,
        'v-ratingselect': RatingSelect
    },
    methods: {
        _initScroll() { // 初始化
            this.scroll = new BScroll(this.$refs.ratingsContent, {
                click: true
            })
        },
        isContent(bl) {
            this.onlyContent = bl;
            this.$nextTick(() => {
                this.scroll.refresh();
            });
        },
        filterRatings(type) {
            this.selectType = type;
            this.$nextTick(() => {
                this.scroll.refresh();
            });
        },
        needShowList(type, text) {
            if (this.onlyContent && !text) { // 只要有内容的评论
                return false;
            }
            if (this.selectType === ALL) { // 显示所有评论
                return true;
            } else {
                return this.selectType === type;
            }
        }
    }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">

.ratings
    position:fixed
    top:174px
    left:0
    bottom:0
    width:100%
    overflow:hidden
    .overview
        display:flex
        padding:18px 0
        .overview_left
            flex:0 0 137px 
            padding-bottom:6px
            width:137px
            text-align:center
            border-right:1px solid rgba(7,17,27,0.1)
            @media only screen and (max-width:320px)//适配320px以下小屏
                flex:0 0 120px
                width:120px
            .foodScore
                font-size:24px
                color:rgb(255,153,0)
                line-height:28px
            .title
                font-size:12px
                line-height:12px
                color:rgb(7,17,27)
                margin-bottom:8px
            .rankRate
                font-size:10px
                line-height:10px
                color:rgb(147,153,159)
        .overview_right
            flex:1
            padding:6px 0 0 24px
            font-size:0
            @media only screen and (max-width:320px)//适配320px以下小屏
                padding:6px
            .score_wrapper
                margin-bottom:8px
                .title
                    font-size:12px
                    display:inline-block
                    line-height:18px
                .star
                    display:inline-block
                    padding:0 12px
                    vertical-align:top
                    @media only screen and (max-width:320px)//适配320px以下小屏
                        padding:0 6px
                .score
                    display:inline-block
                    font-size:12px
                    line-height:18px
                    color:rgb(255,153,0)
            .delivery_wrapper
                margin-bottom:6px
                font-size:0
                .title
                    font-size:12px
                    line-height:18px
                    padding-right:12px
                .deliveryTime
                    font-size:12px
                    line-height:18px
                    color:rgb(147,153,159)
    .ratings_wrapper
        .ratings_item
            padding:18px
            display:flex
            .avatar
                flex:0 0 28px
                width:28px
                margin-right:12px
                img
                    border-radius:50%
        .content
            flex:1
            position:relative
            .username
                padding-bottom:8px
                font-size:10px
                line-height:12px
                color:rgb(7,17,27)            
            .star_wrapper
                font-size:0
                padding-bottom:6px
                .star
                    display:inline-block
                    vertical-align:top
                    margin-right:6px
                .deliveryTime
                    display:inline-block
                    vertical-align:top
                    font-size:10px
                    font-weight:200
                    line-height:12px
                    color:rgb(147,153,159)
            .text
                font-size:12px
                line-height:18px
                color:rgb(7,17,27) 
                padding-bottom:8px 
            .recommend_wrapper
                width:100%
                font-size:0
                .icon-thumb_up
                    display:inline-block
                    font-size:12px
                    line-height:16px
                    color:rgb(0,160,220)
                    margin:0 8px 6px 0
                .text
                    display:inline-block
                    width:70px
                    box-sizing:border-box
                    margin-right:8px
                    padding:0 6px
                    border:1px solid rgba(7,17,27,0.1)
                    border-radius:1px
                    background:#fff
                    text-align:center
                    overflow:hidden
                    text-overflow:ellipsis
                    white-space:nowrap
                    font-size:9px
                    line-height:16px
                    color:rgb(147,153,159)
            .rating_time
                position:absolute
                right:0
                top:0
                display:inline-block
                font-size:10px
                font-weight:200
                line-height:12px
                color:rgb(147,153,159)

</style>
