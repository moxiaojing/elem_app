<template>
    <div class="goods">
        <div class="menu_wrapper" ref="menuWrapper">
            <ul>
                <li class="menu_item" v-for="(item,index) in goods" :key="index" :class="{'current':currentIndex===index}" @click="selectMenu(index,$event)">
                    <span class="text border-1px">
                        <!--<span class="icon" v-show="item.type>0" :class="classMap[item.type]"></span>-->
                        <v-iconClassMap v-show="item.type > 0" :iconType="item.type"></v-iconClassMap>
                        {{item.name}}
                    </span>
                </li>
            </ul>
        </div>
        <div class="foods_wrapper" ref="foodWrapper">
            <ul>
                <li class="foods_list foods_list_hook" v-for="(item,index) in goods" :key="index">
                    <h1 class="title">{{item.name}}</h1>
                    <ul>
                        <li v-for="(food,index) in item.foods" class="foods_item border-1px" :key="index" @click="selectFood(food,$event)">
                            <div class="icon">
                                <img :src="food.icon" width="57" height="57">
                            </div>
                            <div class="content">
                                <h2 class="name">{{food.name}}</h2>
                                <p class="desc">{{food.description}}</p>
                                <div class="extra">
                                    <span class="count">月售{{food.sellCount}}份</span>
                                    <span>好评率{{food.rating ? food.rating : 0}}%</span>
                                </div>
                                <div class="price">
                                    <span class="now">￥{{food.price}}</span>
                                    <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                                </div>
                                <div class="cartControl_wrapper">
                                    <v-cartControl :foodItem="food"></v-cartControl>
                                </div>
                            </div>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
        <v-shopcart :deliveryPrice="seller.deliveryPrice" :minPrice="seller.minPrice" :selectFoods="selectFoods"></v-shopcart>
        <v-foodinfo :food="selectedFood" ref="foodinfo"></v-foodinfo>
    </div>
</template>

<script type='text/ecmascript6'>

import BScroll from 'better-scroll';
import Shopcart from 'components/Shopcart/Shopcart';
import cartControl from 'components/CartControl/CartControl';
import Foodinfo from 'components/Foodinfo/Foodinfo';
import iconClassMap from 'components/iconClassMap/iconClassMap';

const ERR_OK = 0;
// const eventHub = new Vue();
export default {
    name: 'Goods',
    props: {
        seller: {
            type: Object
        }
    },
    components: {
        'v-shopcart': Shopcart,
        'v-cartControl': cartControl,
        'v-foodinfo': Foodinfo,
        'v-iconClassMap': iconClassMap
    },
    data() {
        return {
            goods: [],
            listHeight: [],// 存放每一个list的高度
            scrollY: 0, // 页面滚动距离
            selectedFood: {}
        };
    },
    created() {
        // 定义一个数组，代表不同的icon[减，折，特，票，保]
        // this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
        this.$http.get('/api/goods').then(function (response) {
            response = response.body;// 获取数据对象
            if (response.erron === ERR_OK) {
                this.goods = response.data;
                // console.log(this.goods);
                //
                this.$nextTick(() => {
                    this._initScroll();
                    this._calculateHeight();
                });
            }
        })
    },
    computed: {
        currentIndex() {// 当前list的index，对应menu-item的index
            for (let i = 0; i < this.listHeight.length; i++) {// 循环list的位置，
                let currentHeight = this.listHeight[i];
                let nextHeight = this.listHeight[i + 1];
                if (!nextHeight || (this.scrollY >= currentHeight && this.scrollY < nextHeight)) {
                    // console.log(i);
                    return i;
                }
            }
            return 0;
        },
        selectFoods() {// 选中foods
            let foods = [];// 存放选中foods的数组
            this.goods.forEach((item) => {
                item.foods.forEach((food) => {// 找到所有选中foods
                    if (food.count) {
                        foods.push(food);
                    };
                });
            });
            return foods;
        }
    },
    methods: {
        _initScroll() {// 页面滑动
            this.menuScroll = new BScroll(this.$refs.menuWrapper, {
                click: true // better-scroll会阻止默认事件，自己派生点击事件,所以pc端会执行两次，包括原生点击触发
            })
            this.foodScroll = new BScroll(this.$refs.foodWrapper, {
                click: true,
                probeType: 3// 实时监测滚动位置
            })
            this.foodScroll.on("scroll", (pos) => {
                this.scrollY = Math.abs(Math.round(pos.y));// 将位置四舍五入后取绝对值
                // console.log(this.scrollY);
            })
        },
        _calculateHeight() {//滚动右侧foodScroll，影响左侧menu
            //获取list
            let foodList = this.$refs.foodWrapper.getElementsByClassName("foods_list_hook");
            let height = 0;
            this.listHeight.push(height);
            for (let i = 0; i < foodList.length; i++) {
                let item = foodList[i];
                height += item.clientHeight;
                this.listHeight.push(height);// list的距离父级顶部的高度存放到数组里，相当于是position.top值
            }
            // console.log(this.listHeight);
        },
        selectMenu(index, event) {// 点击左侧menu，影响右侧foods，event就是事件对象
            if (!event._constructed) {//_constructed是better-scroll事件对象属性，原生事件没有在这个属性,所以不执行下面的函数,也就是说阻止pc端的点击事件
                return;
            }
            let foodList = this.$refs.foodWrapper.getElementsByClassName("foods_list_hook");
            let foodli = foodList[index];// 点击menu后，对应的foodlist[index]
            this.foodScroll.scrollToElement(foodli, 300);// 300ms滚动到对应的foodlist位置
        },
        selectFood(food, event) {
            if (!event._constructed) {//_constructed是better-scroll事件对象属性，原生事件没有在这个属性,所以不执行下面的函数
                return;
            }
            this.selectedFood = food;
            this.$refs.foodinfo.initShow();// 获取foodinfo组件的show方法
            // console.log(food);
        }
    }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">

@import '../../common/stylus/mixin.styl'

.goods
    display:flex
    position:absolute
    top:174px
    bottom:48px
    width:100%
    overflow:hidden
    .menu_wrapper
        flex:0 0 80px
        width:80px
        background:#f3f5f7
        .menu_item
            display:table // 垂直水平居中
            height:54px
            width:56px
            padding:0 12px
            line-height:14px
            margin:0 auto
            &.current
                margin-top:-1px
                z-index:10
                background:#fff
                .text
                    border-none()
            .icon
                margin-right:2px
                &.decrease
                    bg-img("decrease_3")
                &.discount
                    bg-img("discount_3")
                &.invoice
                    bg-img("invoice_3")
                &.special
                    bg-img("special_3")
                &.guarantee
                    bg-img("guarantee_3")
            .text
                display:table-cell
                vertical-align:middle
                font-size:12px
                border-1px(rgba(7,17,27,0.1))
    .foods_wrapper
        flex:1
        .title 
            padding-left:14px
            height:26px
            line-height:26px
            border-left:2px solid #d9dde1
            font-size:12px
            color:rgb(147,153,159)
            background:#f3f5f7 
        .foods_item
            display:flex
            margin:18px 18px 0 18px
            padding-bottom:18px
            border-1px(rgba(7,17,27,0.1))
            &:last-child
                border-none()
            .icon
                flex:0 0 57px
                margin:10px
            .content
                flex:1
                .name
                    font-size:14px
                    line-height:14px
                    height:14px
                    margin:2px 0 8px 0
                    color:rgb(7,17,27)
                .desc,.extra
                    line-height:10px
                    font-size:10px
                    color:rgb(147,153,159)
                .desc
                    line-height:12px
                    margin-bottom:8px
                .extra
                    .count
                        margin-right:12px                    
                .price
                    line-height:24px
                    font-weight:700px
                    .now,.old
                        line-height:24px
                        margin-right:0px
                    .now
                        font-size:14px
                        font-weight:700px
                        color:rgb(240,20,20)
                    .old
                        font-size:10px
                        color:rgb(147,153,159)
                        text-decoration:line-through
                .cartControl_wrapper
                    position:absolute
                    right:0
                    bottom:12px
</style>
