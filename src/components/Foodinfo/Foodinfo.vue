<template>
  <transition name="move">
    <div v-show="showFlag" class="foodInfo" ref="foodInfo">
      <div class="food_content">
        <div class="img_header">
          <img class="img" :src="food.image" alt="">
          <div class="back" @click="hide">
            <i class="icon-arrow_lift"></i>
          </div>
        </div>
        <div class="content">
          <div class="title">{{food.name}}</div>
          <div class="extra">
            <span class="count">月售{{food.sellCount}}份</span>
            <span>好评率{{food.rating}}%</span>
          </div>
          <div class="price">
            <span class="now">￥{{food.price}}</span>
            <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
          </div>
          <div class="caraControl_wrapper">
            <v-cartControl :foodItem="food"></v-cartControl>
          </div>
          <transition name="addCartMove">
            <div class="addCartShop" @click="addFirst($event)" v-show="!food.count || food.count===0">加入购物车</div>
          </transition>
        </div>
        <v-split v-show="food.info"></v-split>
        <div class="info" v-show="food.info">
          <h1 class="title">商品信息</h1>
          <p class="text">{{food.info}}</p>
        </div>
        <v-split v-show="food.info"></v-split>
        <div class="rating">
          <h1 class="title">商品评价</h1>
          <v-ratingselect :ratings="food.ratings" :select-type="selectType" :only-content="onlyContent" :desc="desc" @selRatings="filterRatings" @isContent="isContent"></v-ratingselect>
          <div class="ratings_wrapper">
            <ul v-show="food.ratings && food.ratings.length">
              <li class="ratings_item border-1px" v-for="(ratingItem,index) in food.ratings" :key="index" v-show="needShowList(ratingItem.rateType,ratingItem.text)">
                <div class="rating_time">{{ratingItem.rateTime | formatDate('yyyy-MM-dd hh:mm')}}</div>
                <div class="user">
                  <span class="name">{{ratingItem.username}}</span>
                  <img class="avatar" :src="ratingItem.avatar" width="12" height="12">
                </div>
                <p class="text">
                  <i class="icon" :class="{'icon-thumb_up':ratingItem.rateType===0,'icon-thumb_down':ratingItem.rateType===1}"></i>
                  <span>{{ratingItem.text}}</span>
                </p>
              </li>
            </ul>
            <div class="no_ratings" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script text="text/ecmascript6">

import 'common/js/formatdate.js';
import BScroll from 'better-scroll';
import Vue from 'vue';
import cartControl from 'components/CartControl/CartControl';
import Split from 'components/Split/Split';
import RatingSelect from 'components/RatingSelect/RatingSelect';

const ALL = 2;
export default {
  name: 'Foodinfo',
  props: {
    food: {
      type: Object
    },
    ratings: []
  },
  data() {
    return {
      showFlag: false,
      selectType: ALL, // 评论type按钮的样式，使用常量切换
      onlyContent: false, // 只看有内容的评论
      desc: {
        all: '全部',
        positive: '推荐',
        negative: '吐槽'
      }
    };
  },
  components: {
    'v-cartControl': cartControl,
    'v-split': Split,
    'v-ratingselect': RatingSelect
  },
  methods: {
    initShow() {
      this.showFlag = true;
      // 初始化显示状态
      this.selectType = ALL;
      this.onlyContent = false;

      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.foodInfo, {
            click: true
          });
        } else {
          this.scroll.refresh();
        }
      });
    },
    hide() {
      this.showFlag = false;
    },
    addFirst(event) { // 添加商品到购物车
      if (!event._constructed) { // 阻止pc端点击后执行两次
        return;
      }
      Vue.set(this.food, 'count', 1);
      this.$root.eventHub.$emit('cart.add', event.target); // 传输点击的目标元素
    },
    isContent(bl) { // 获取子组件点击事件传递过爱的数据
      this.onlyContent = bl;
      this.$nextTick(() => {
        this.scroll.refresh();
      });
    },
    filterRatings(type) { // 获取子组件点击事件传递过来的数据
      this.selectType = type;
      this.$nextTick(() => {
        this.scroll.refresh();
      });
    },
    needShowList(type, text) { // 筛选需要展示的评价
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
@import '../../common/stylus/mixin.styl'
.foodInfo
  position:fixed
  left:0
  top:0
  bottom:48px
  z-index:30
  width:100%
  background:#fff
  transition:all 0.3s
  &.move-enter-active
    transform:translate3d(0,0,0)
  &.move-enter,&.move-leave-to
    transform:translate3d(100%,0,0)
  .img_header
    position:relative
    width:100%
    height:0
    padding-top:100%
    .img
      position:absolute
      top:0
      left:0
      width:100%
      height:100%
    .back
      position:fixed
      left:0
      top:10px
      .icon-arrow_lift
        display:block
        padding:10px
        font-size:20px
        color:#fff
  .content
    position:relative
    padding:18px
    .title
      font-size:14px
      line-height:14px
      margin-bottom:8px
      font-weight:700
      color:rgb(7,17,27)
    .extra
      margin-bottom:18px
      line-height:10px
      height:10px
      font-size:10px
      color:rgb(147,153,159)
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
  .caraControl_wrapper
    position:absolute
    right:12px
    bottom:12px
  .addCartShop
    position:absolute
    right:18px
    bottom:18px
    z-index:10
    padding:0 12px
    text-align:center
    line-height:24px
    height:24px
    font-size:10px
    color:#fff
    background:rgb(0,160,220)
    border-radius:12px
    box-sizing:border-box
    transition:all 0.2s
    &.addCartMove-enter-active
      opacity:1
    &.addCartMove-enter,&.addCartMove-leave-to
      opacity:0
  .info
    padding:18px
    .title
      line-height:14px
      margin-bottom:16px
      font-size:14px
      font-weight:700
      color:rgb(7,17,27)
    .text
      color:rgb(77,85,93)
      line-height:24px
      font-size:12px
      font-weight:200
      padding:0 8px
  .rating 
    padding-top:18px
    .title
      line-height:14px
      margin-left:18px
      font-size:14px
      font-weight:700
      color:rgb(7,17,27)
    .ratings_wrapper
      padding:0 18px
      .ratings_item
        position:relative
        padding:16px 0
        border-1px(rgba(7,17,27,0.1))
        font-size:0
        .rating_time
          display:inline-block
          position:absolute
          left:0
          top:16px
          font-size:10px
          line-height:12px
          color:rgb(147,153,159)
        .user
          display:inline-block
          position:absolute
          right:0
          top:16px
          line-height:12px
          font-size:10px
          color:rgb(147,153,159)
          .name
            font-size:10px
            line-height:12px
            color:rgb(147,153,159)
            vertical-align:top
          .avatar
            width:12px
            height:12px
            border-radius:50%
            vertical-align:top
        .text
          font-size:12px
          line-height:24px
          color:rgb(7,17,27)
          margin-top:18px
          .icon
            margin-right:4px
            &.icon-thumb_up
              color:rgb(0,160,220)
</style>
