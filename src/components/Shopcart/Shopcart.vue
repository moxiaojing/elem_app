<template>
  <div class="shopcart">
    <div class="content" @click="toggleList">
      <div class="con_left">
        <div class="logo_wrapper">
          <div class="logo" :class="{'highlight':totalCount > 0}">
            <i class="icon-shopping_cart" :class="{'highlight':totalCount > 0}"></i>
          </div>
          <div class="num" v-show="totalCount > 0">{{totalCount}}</div>
        </div>
        <div class="price" :class="{'highlight':totalPrice > 0}">
          ￥{{totalPrice}}元
        </div>
        <div class="desc">另需配送费￥{{deliveryPrice}}</div>
      </div>
      <div class="con_right" @click.stop.prevent="pay">
        <div class="minPriceDesc" :class="isEnough">{{payDesc}}</div>
      </div>
    </div>
    <div class="ball_container">
      <transition-group name="drop" @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter">
        <div class="ball" v-for="(ball,index) in balls" :key="index" v-show="ball.show">
          <span class="inner inner_hook icon-remove_circle_outline"></span>
        </div>
      </transition-group>
    </div>
    <transition name="fold">
      <div class="shopCart_list" v-show="listShow">
        <div class="list_header">
          <h1 class="title">购物车</h1>
          <span class="empty" @click="empty">清空</span>
        </div>
        <div class="list_content" ref="listContent">
          <ul>
            <li class="food" v-for="(food,index) in selectFoods" :key="index">
              <span class="name">{{food.name}}</span>
              <div class="price">
                <span>{{food.price*food.count}}</span>
              </div>
              <div class="cartControl_wrapper">
                <v-cartControl :foodItem="food"></v-cartControl>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </transition>
    <transition name="maskMove">
      <div class="mask" v-show="listShow" @click.stop.prevent="hideList"></div>
    </transition>
    <div class="payMethods_wrapper" v-show="payMethodsShow">
      <div class="payMethods_contener">
        <div class="head">
          <h2 class="title">请选择支付方式</h2>
        </div>
        <div class="payMethods_list">
          <ul>
            <li class="payMethods">
              <input type="radio">
              <i class="ico"></i>
              <span class="info">微信支付</span>
            </li>
            <li class="payMethods">
              <input type="radio">
              <i class="ico">
                <img src="" alt="">
              </i>
              <span class="info">支付宝</span>
            </li>
            <li class="payMethods">
              <input type="radio">
              <i class="ico">
                <img src="" alt="">
              </i>
              <span class="info">信用卡支付</span>
            </li>
            <li class="payMethods">
              <input type="radio">
              <i class="ico">
                <img src="" alt="">
              </i>
              <span class="info">网上银行</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="back">
        <div class="backBtn" @click="back">返回上一页</div>
      </div>
    </div>
  </div>
</template>

<script text="text/ecmascript6">
import BScroll from 'better-scroll';
import cartControl from 'components/CartControl/CartControl';

export default {
  name: 'Shopcart',
  props: {
    deliveryPrice: {
      type: Number,
      default: 0
    },
    minPrice: {
      type: Number,
      default: 0
    },
    selectFoods: {// 选中的food
      type: Array,
      default() {
        return [
          {
            price: 20,
            count: 2
          }
        ];
      }
    }
  },
  components: {
    'v-cartControl': cartControl
  },
  data() {
    return {
      balls: [// 定义多个对象，表示页面中做多同时运动的小球
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        }
      ],
      dropBalls: [], // 下落的小球
      fold: true, // 标记折叠或展开的状态,true表示折叠
      payMethodsShow: false// 支付页面默认不显示
    };
  },
  created() {
    // 获取按钮组件的点击的元素，用在drop方法里
    this.$root.eventHub.$on('cart.add', this.drop);
  },
  computed: {
    totalPrice() { // 计算总价格
      let total = 0;
      this.selectFoods.forEach((item) => {
        total += item.price * item.count;
      });
      return total;
    },
    totalCount() { // 计算总数量
      let count = 0;
      this.selectFoods.forEach((item) => {
        count += item.count;
      });
      return count;
    },
    payDesc() { // 改变结算状态内容
      if (this.totalPrice === 0) {
        return `￥${this.minPrice}元起送`;
      } else if (this.totalPrice < this.minPrice) {
        let differPrice = this.minPrice - this.totalPrice;
        return `还差${differPrice}元起送`;
      } else if (this.totalPrice >= this.minPrice) {
        return '去结算';
      }
    },
    isEnough() { // 切换结算样式className
      if (this.totalPrice < this.minPrice) {
        return 'not-enough';
      } else {
        return 'enough';
      }
    },
    listShow() { // 判断是否展开详情页
      if (!this.totalCount) {
        this.fold = true;// 折叠状态
        return false;
      };
      let show = !this.fold;
      if (show) {
        this.$nextTick(() => {
          if (!this.scroll) { // 页面滚动
            this.scroll = new BScroll(this.$refs.listContent, {
              click: true
            });
          } else {
            this.scroll.refresh();// 刷新
          }
        });
      }
      return show;
    }
  },
  methods: {
    drop(ele) {
      // console.log(ele);// 获取到点击的那个添加按钮
      for (let i = 0; i < this.balls.length; i++) {
        let ball = this.balls[i];
        if (!ball.show) {
          ball.show = true; // 表示可以有下落动画
          ball.el = ele;
          this.dropBalls.push(ball);
          return; // 跳出循环
        }
      }
    },
    beforeEnter(ele) { // 下落小球的下落之前的运动函数钩子
      let len = this.balls.length;
      while (len--) {
        let ball = this.balls[len];
        if (ball.show) {
          let rect = ball.el.getBoundingClientRect(); // 小球盒模型
          let x = rect.left - 32; // 小球距离购物车图标的位置
          let y = -(window.innerHeight - rect.top - 22);
          ele.style.display = '';
          ele.style.webkitTransform = `translate3d(0,${y}px,0)`;
          ele.style.transform = `translate3d(0,${y}px,0)`;
          let inner = ele.getElementsByClassName('inner_hook')[0];
          inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
          inner.style.transform = `translate3d(${x}px,0,0)`;
        }
      }
    },
    enter(ele) { // 下落小球的下落时的运动函数钩子
      ele.offsetHeight; // 触发浏览器重绘，offsetWidth、offsetTop等方法都可以触发
      this.$nextTick(() => { // 改回运动初始状态
        ele.style.webkitTransform = 'translate3d(0, 0, 0)';
        ele.style.transform = 'translate3d(0,0,0)';
        let inner = ele.getElementsByClassName('inner_hook')[0];
        inner.style.webkitTransform = 'translate3d(0,0,0)';
        inner.style.transform = 'translate3d(0,0,0)';
      });
    },
    afterEnter(ele) { // 下落小球的下落之后的运动函数钩子
      let ball = this.dropBalls.shift();
      if (ball) {
        ball.show = false;
        ele.style.display = 'none';
      }
    },
    toggleList() { // 显示和隐藏
      if (!this.totalCount) { // 表示购物车没有商品
        return;
      };
      this.fold = !this.fold;
    },
    hideList() {
      this.fold = true;
    },
    empty() { // 清空
      this.selectFoods.forEach((food) => {
        food.count = 0;
      });
    },
    pay() { // 结算
      if (this.totalPrice === 0) {
        return;
      };
      this.payMethodsShow = true;
      // 此处应该跳转支付方式
    },
    back() {
      this.payMethodsShow = false;
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">

@import '../../common/stylus/mixin.styl';

.shopcart
  position:fixed
  left:0
  bottom:0
  width:100%
  height:48px
  z-index:50
  .content
    display:flex
    background:#141d27
    color:rgba(255,255,255,0.4)
    .con_left
      flex:1
      font-size:0
      .logo_wrapper
        display:inline-block
        position:relative
        top:-10px
        margin:0 12px
        padding:6px
        vertical-align :top
        width:56px
        height:56px
        box-sizing:border-box
        border-radius:50%
        background:#141d27
        .logo
          width:100%
          height:100%
          border-radius:50%
          text-align:center
          background:#2b343c
          &.highlight
            background:rgb(0,160,220)
          .icon-shopping_cart
            font-size:24px
            color:#80858a
            line-height:48px
            &.highlight
              color:rgb(255,255,255)
        .num
          position:absolute
          right:0
          top:0
          width:24px
          height:16px
          line-height:16px
          text-align:center
          border-radius:16px
          font-size:9px
          font-weight:700
          color:#fff
          background:rgb(240,20,20)
          box-shadow:0 4px 8px 0 rgba(0,0,0,0.4)
      .price
        display:inline-block
        vertical-align:top
        padding-right:12px
        margin-top:12px
        line-height:24px                
        font-size:16px
        font-weight:700
        box-sizing:border-box
        border-right:1px solid rgba(255,255,255,0.1)
        &.highlight
          color:rgb(255,255,255)
      .desc
        display:inline-block
        vertical-align:top
        height:100%
        margin:12px 0 0 12px
        // margin-left:12px
        line-height:24px 
        font-size:12px
        box-sizing:border-box
    .con_right
      flex:0 0 105px
      width:105px
      text-align:center
      .minPriceDesc
        font-size:12px
        font-weight:700
        line-height:48px
        &.not-enough
          background:#2b333b
        &.enough
          background:#00b43c
          color:#fff
  .ball_container
    .ball
      position:fixed
      left:32px
      bottom:22px
      color:#fff
      &.drop-enter,&.drop-enter-active
        transition all 0.4s cubic-bezier(0.49,-0.29,0.75,0.41)
        .inner
          display:inline-block
          width:16px
          height:16px
          border-radius:50%
          background:rgb(0,160,220)
          transition:all 0.4s linear
  .shopCart_list
    position:absolute
    left:0
    top:0
    z-index:-1
    width:100%
    transform:translate3d(0,-100%,0)
    &.fold-enter-active,&.fold-leave-active
      transition:all 0.5s;
    &.fold-leave-active
      transform:translate3d(0,-100%,0)      
    &.fold-enter,&.fold-leave-active
      transform:translate3d(0,0,0)
    .list_header
      height:40px
      line-height:40px
      padding:0 18px
      background:#f3f5f7;
      border-bottom:1px solid rgba(7,17,27,0.1) 
      .title
        float:left
        font-size:14px        
      .empty
        float:right
        font-size:12px
        color:rgb(0,160,220)
    .list_content
      padding:0 18px
      max-height:217px
      background:#fff
      overflow:hidden
     .food
      position:relative 
      padding:12px 0
      line-height:24px
      box-sizing:border-box
      border-1px(rgba(7,17,27,0.1))
      .name
        font-size:14px
        color:rgb(7,17,27)
      .price
        position:absolute
        right:90px
        bottom:12px
        font-size:14px
        font-weight:700
        color:rgb(240,20,20)
        margin-left:6px
        padding:0 12px
      .cartControl_wrapper
        position:absolute
        right:0
        top:6px
  .mask
    width:100%
    height:100%
    position:fixed
    left:0
    top:0
    background:rgba(7,17,27,0.6)
    filter:blur(10px)
    backdrop-filter:blur(10px)
    z-index:-2
    &.maskMove-enter-active,&.maskMove-leave-active
      transition:all 0.5s;
    &.maskMove-enter
      opacity:1
    &.maskMove-leave-active
      opacity:0
  .payMethods_wrapper
    position:fixed
    left:0
    top:0
    z-index:100
    width:100%
    height:100%
    .payMethods_contener
      width:100%
      height:100%
      background:#fff
      padding:30px
      box-sizing:border-box
      .head
        height:50px
        line-height:50px
        border-1px(rgba(7,17,27,0.1))
        .title
          font-size:18px
          font-weight:700
          color:#666
      .payMethods_list
        padding:20px 0
        .payMethods
          font-size:16px
          line-height:26px
          padding:10px 0
    .back
      position:fixed
      bottom:50px
      width:100%
      height:50px
      text-align:center
      box-sizing:border-box
      .backBtn
        width:120px
        height:50px
        line-height:50px
        background:#aaa;
        color:#fff;
        margin:0 auto
</style>
