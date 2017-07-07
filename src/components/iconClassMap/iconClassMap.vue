<template>
  <span class="icon" :class="classMap[iconType]">
  </span>
</template>

<script type='text/ecmascript6'>
export default {
  name: 'iconClassMap',
  props: {
    iconType: {
      type: Number
    }
  },
  created() {
    // 定义一个数组，代表不同的icon[减，折，特，票，保],有序排列，index代表type
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">

@import '../../common/stylus/mixin.styl'

.icon
  display:inline-block
  width:12px
  height:12px
  background-size:100% 100%
  background-repeat:no-repeat
  vertical-align:top
  &.decrease
      bg-img("decrease_4")
  &.discount
      bg-img("discount_4")
  &.invoice
      bg-img("invoice_4")
  &.special
      bg-img("special_4")
  &.guarantee
      bg-img("guarantee_4")
</style>
