<template>
  <div class="cartcontrol">
    <transition name="move">
      <div class="cart_decrease" v-show="foodItem.count>0" @click.stop.prevent="decreaseCart($event)">
        <span class="inner icon-remove_circle_outline"></span>
      </div>
    </transition>    
    <div class="cart_count" v-show="foodItem.count>0">{{foodItem.count}}</div>
    <div class="cart_add icon-add_circle" @click.stop.prevent="addCart($event)"></div>
  </div>
</template>

<script type="text/ecmascript6">

import Vue from 'vue';

export default {
  name: 'cartControl',
  props: {
    foodItem: {
      type: Object
    }
  },
  methods: {
    decreaseCart(event){// 减少数量
      if(!event._constructed){// 阻止pc端点击后执行两次
        return;
      }
      if (this.foodItem.count) {
        this.foodItem.count--;
      }
    },
    addCart(event) {// 增加数量
      if(!event._constructed){// 阻止pc端点击后执行两次
        return;
      }
      if (!this.foodItem.count) {
        Vue.set(this.foodItem,"count",1)
      } else {
        this.foodItem.count++;
      }
      // console.log(this.$root.eventHub);// 定义的新的公共实例eventHub，归按钮组件和购物车组件公用，传输数据
      this.$root.eventHub.$emit('cart.add', event.target); // 传输点击的目标元素
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">

.cartcontrol
  font-size:0
  .cart_decrease
    display:inline-block
    padding:6px
    transition:all 0.4s linear
    .inner
      display:inline-block
      font-size:24px
      line-height:24px
      color:rgb(0,160,220)
      transition:all 0.4s linear
    &.move-enter-active
      opacity:1      
      transform:translate3d(0,0,0)// 硬件加速，动画更流畅
      .inner
        transform:rotate(0)
    &.move-enter,&.move-leave-to
      opacity:0
      transform:translate3d(24px,0,0)
      .inner
        transform:rotate(180deg)
  .cart_count
    display:inline-block
    vertical-align:top
    font-size:10px
    line-height:24px
    padding:6px
    color:rgb(147,153,159)
  .cart_add
    display:inline-block
    padding:6px
    font-size:24px
    line-height:24px
    color:rgb(0,160,220)
</style>

