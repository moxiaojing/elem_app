<template>
  <div class="RatingSelect">
    <div class="rating_type border-1px">
      <span class="block positive" :class="{'active':selectType===2}" @click="select(2,$event)">{{desc.all}}
        <span class="count">{{ratings.length}}</span>
      </span>
      <span class="block positive" :class="{'active':selectType===0}" @click="select(0,$event)">{{desc.positive}}
        <span class="count">{{positives.length}}</span>
      </span>
      <span class="block negative" :class="{'active':selectType===1}" @click="select(1,$event)">{{desc.negative}}
        <span class="count">{{negatives.length}}</span>
      </span>
    </div>
    <div class="switch" :class="{'on':onlyContent}" @click="toggleContent">
      <span class="icon-check_circle"></span>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script text="text/ecmascript6">

const POSITIVE = 0;
const NEGATIVE = 1;
const ALL = 2;

export default {
  name: 'RatingSelect',
  data() { // 自身定义的数据
    return {
      selectType: { // 选择type
        type: Number,
        default: ALL
      },
      onlyContent: {
        type: Boolean,
        default: false
      }
    };
  },
  props: { // 由父级传入的数据
    ratings: {
      type: Array,
      default() {
        return [];
      }
    },
    desc: {
      type: Object,
      default() {
        return {
          all: '全部',
          positive: '满意',
          negative: '不满意'
        };
      }
    }
  },
  computed: {
    positives() {
      return this.ratings.filter((item) => {
        return item.rateType === POSITIVE;
      });
    },
    negatives() {
      return this.ratings.filter((item) => {
        return item.rateType === NEGATIVE;
      });
    }
  },
  methods: {
    select(type, event) {
      if (!event._constructed) {
        return;
      }
      this.selectType = type;
      // 自定义事件，并想父级传输数据
      this.$emit('selRatings', this.selectType);
    },
    toggleContent(event) {
      if (!event._constructed) {
        return;
      }
      this.onlyContent = !this.onlyContent;
      // 自定义事件，并想父级传输数据
      this.$emit('isContent', this.onlyContent);
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">

@import '../../common/stylus/mixin.styl'

.RatingSelect
  .rating_type
    padding:18px 0
    margin:0 18px
    font-size:0
    border-1px(rgba(7,17,27,0.1))
    .block
      display:inline-block
      padding:8px 12px
      margin-right:8px
      border-radius:1px
      color:rgb(77,85,93)
      font-size:12px
      line-height:24px
      &.active
        color:#fff
      .count
        margin-left:2px
        font-size:8px
        line-height:16px
      &.positive
        background:rgba(0,160,220,0.2)
        &.active
          background:rgb(0,160,220)
      &.negative
        background:rgba(77,85,93,0.2)
        &.active
          background:rgb(77,85,93)
  .switch
    padding:12px 18px
    line-height:24px
    color:rgb(147,153,159)
    border-bottom:1px solid rgba(7,17,27,0.1)
    &.on
      .icon-check_circle
        color:#00c850
    .icon-check_circle
      margin-right:4px
      font-size:24px
    .text
      font-size:12px
      vertical-align:top
  .no_rating
    padding:16px 0
    font-size:12px
    line-height:24px
    color:rgb(147,153,159)
</style>

