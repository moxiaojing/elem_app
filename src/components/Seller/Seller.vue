<template>
  <div class="seller" ref="sellerWrapper">
    <div class="seller_content">
      <div class="overview">
        <h1 class="title">{{seller.name}}</h1>
        <div class="desc border-1px">
          <v-star :size="36" :score="seller.score"></v-star>
          <span class="text">({{seller.ratingCount}})</span>
          <span class="text">月售{{seller.sellCount}}单</span>
        </div>
        <ul class="remark">
          <li class="block">
            <h2 class="text">起送价</h2>
            <div class="content">
              <span class="stress">{{seller.minPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2 class="text">商家配送</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2 class="text">平均配送时间</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryTime}}</span>分钟
            </div>
          </li>
        </ul>
        <!--<div class="favorite" @click="isFavorite=!isFavorite">
                  <span class="icon-favorite" :class="{'active':isFavorite}"></span>
                  <span class="text">{{this.isFavorite ? '已收藏' : '收藏'}}</span>
                </div>-->
        <div class="favorite" @click="torggleFacorite">
          <span class="icon-favorite" :class="{'active':isFavorite}"></span>
          <span class="text">{{favoriteText}}</span>
        </div>
      </div>
      <v-split></v-split>
      <div class="bulletin_wrapper">
        <h1 class="title">公告与活动</h1>
        <p class="text border-1px">{{seller.bulletin}}</p>
        <ul class="supports_wrapper">
          <li class="supports_item border-1px" v-for="(supportItem,index) in seller.supports" :key="index">
            <v-iconClassMap :iconType="supportItem.type"></v-iconClassMap>
            <span class="description">{{supportItem.description}}</span>
          </li>
        </ul>
      </div>
      <v-split></v-split>
      <div class="pics">
        <h1 class="title">商家实景</h1>
        <div class="pic_wrapper" ref="picsWrapper">
          <ul class="pic_list" ref="piclist">
            <li class="pic_item" v-for="(picItem,index) in seller.pics" :key="index">
              <img class="pic" width="120" height="90" :src="picItem" alt="">
            </li>
          </ul>
        </div>
      </div>
      <v-split></v-split>
      <div class="infos_wrapper">
        <h1 class="title border-1px">商家信息</h1>
        <ul class="infos_list">
          <li class="infos_item border-1px" v-for="(item,index) in seller.infos" :key="index">
            <span class="text">{{item}}</span>
          </li>
        </ul>
      </div>
    </div>
    <!--<v-shopcart :deliveryPrice="seller.deliveryPrice" :minPrice="seller.minPrice"></v-shopcart>-->
  </div>
</template>

<script type='text/ecmascript6'>

import BScroll from 'better-scroll';
import Star from 'components/Star/Star';
import Split from 'components/Split/Split';
import iconClassMap from 'components/iconClassMap/iconClassMap';
import Shopcart from 'components/Shopcart/Shopcart';
import { saveToLocal, loadFromLocal } from 'common/js/store.js';
const ERR_OK = 0;
export default {
  name: 'Seller',
  props: {
    seller: {
      type: Object
    }
  },
  components: {
    'v-star': Star,
    'v-split': Split,
    'v-shopcart': Shopcart,
    'v-iconClassMap': iconClassMap
  },
  data() {
    return {
      isFavorite: (() => {
        return loadFromLocal(this.seller.id, 'isFavorite', false);
      })()
    }
  },
  watch: {
    'seller'() { // 监控props里面的seller数据变化
      this.$nextTick(() => {
        // console.log(this.seller);
        this._initScroll();
        this._initPicScroll();
      })
    }
  },
  mounted() { // DOM已经准备好,只会执行一次，此页面刷新后，就没有this.seller了
    this.$nextTick(() => {
      // console.log(this.seller);
      this._initScroll();
      this._initPicScroll();
    })
  },
  methods: {
    _initScroll() {
      if (!this.scroll) {
        this.scroll = new BScroll(this.$refs.sellerWrapper, {
          click: true
        })
      } else {
        this.scroll.refresh();
      }
    },
    _initPicScroll() {
      if (this.seller.pics) {
        let picW = 120;
        let margin = 6;
        let w = (picW + margin) * this.seller.pics.length - margin;
        this.$refs.piclist.style.width = w + "px";
        this.$nextTick(() => {
          if (!this.picScroll) {
            this.picScroll = new BScroll(this.$refs.picsWrapper, {
              scrollX: true,
              eventPassthrough: 'vertical',// 滚动方向横向
              click: true
            })
          } else {
            this.pics.refresh();
          }
        })
      }
    },
    torggleFacorite(event) {
      if (!event._constructed) {
        return
      }
      this.isFavorite = !this.isFavorite;
      // 将状态缓存到localstorage
      saveToLocal(this.seller.id, 'isFavorite', this.isFavorite);

    }
  },
  computed: {
    favoriteText() {
      return this.isFavorite ? '已收藏' : '收藏';
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">

@import '../../common/stylus/mixin.styl';

.seller
  position:absolute
  left:0
  top:174px
  width:100%
  bottom:0
  overflow:hidden
  .overview
    padding:0 18px
    position:relative
    .title
      font-size:14px
      line-height:14px
      color:rgb(7,17,27)
      padding:18px 0 8px 0
    .desc
      padding-bottom:18px
      border-1px(rgba(7,17,27,0.1))
      font-size:0
      .star
        display:inline-block
        margin-right:8px
        vertical-align:top
      .text
        display:inline-block
        font-size:10px
        line-height:18px
        color:rgb(77,85,93)
        margin-right:12px
        vertical-align:top
    .remark
      padding:18px 0
      display:flex
      .block
        flex:3
        border-right:1px solid rgba(7,17,27,0.1)
        text-align:center
        &:last-child
          border-right:none
        .text
          font-size:10px
          line-height:10px
          color:rgb(147,153,159)
        .content
            margin-top:4px
            font-size:10px
            line-height:24px
            color:rgb(7,17,27)
          .stress
            font-size:24px
            font-weight:200
    .favorite
      position:absolute
      right:18px
      top:18px
      width:40px
      .icon-favorite
        display:block
        margin-bottom:4px
        font-size:24px
        line-height:24px
        color:#d4d6d9
        text-align:center
        &.active
          color:rgb(240,20,20)
      .text 
        display:block
        font-size:10px
        line-height:10px
        color:rgb(77,85,93)
        text-align:center     
  .bulletin_wrapper
    padding:0 18px
    .title
      font-size:14px
      line-height:14px
      color:rgb(7,17,27)
      padding:18px 0 8px 0
    .text
      padding:0 12px 16px 12px
      font-size:12px 
      line-height:24px
      font-weight:200
      color:rgb(240,20,20)
      border-1px(rgba(7,17,27,0.1))
      &:last-child
        border-none()
  .supports_wrapper
    .supports_item
      border-1px(rgba(7,17,27,0.1))
      padding:16px 12px
      .icon
        width:16px
        height:16px
        vertical-align:top
      .description
        font-size:12px
        line-height:16px
        font-weight:200
        color:rgb(7,17,27)
        vertical-align:top
  .pics
    padding:18px
    .title
      font-size:14px
      line-height:14px
      color:rgb(7,17,27)
      padding-bottom:12px
    .pic_wrapper
      width:100%
      overflow:hidden
      white-space:nowrap
      .pic_list
        font-size:0
        .pic_item
          display:inline-block
          margin-right:6px
          width:120px
          height:90px
          &:last-child
            margin:0
  .infos_wrapper
    padding:18px
    .title
      font-size:14px
      line-height:14px
      color:rgb(7,17,27)
      padding-bottom:12px
      border-1px(rgba(7,17,27,0.1))
    .infos_item
      padding:16px 12px
      border-1px(rgba(7,17,27,0.1))
      &.last-child
        border-none()
      .text
        line-height:16px
        
</style>
