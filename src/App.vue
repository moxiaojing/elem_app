<template>
  <div>
    <v-header :seller="seller"></v-header>
    <ul class="tab border-1px">
      <li class="tab_item">
        <router-link to="/Goods">商品</router-link>
      </li>
      <li class="tab_item">
        <router-link to="/Ratings">评论</router-link>
      </li>
      <li class="tab_item">
        <router-link to="/Seller">商家</router-link>
      </li>
    </ul>
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>

<script>

import Header from 'components/header/Header';
import { urlParse } from 'common/js/tools.js';
const ERR_OK = 0;

export default {
  name: 'app',
  data() {
    return {
      seller: {
        id: (() => {
          let queryParam = urlParse();// 后端数据的url地址
          // console.log(queryParam);
          return queryParam.id;
        })()
      }
    };
  },
  created() {
    this.$http.get('/api/seller?id=' + this.seller.id).then((response) => {
      response = response.body;// 获取数据，object类型
      // console.log(response);
      // 判断是不是成功拿到了数据
      if (response.erron === ERR_OK) {
        // 成功获取到数据，之后子组件header使用props接收数据，header组件进行渲染
        // this.seller = response.data;// 直接赋值会id丢失，this.seller.id=undefind
        this.seller = Object.assign({}, this.seller, response.data); // 对象合并
        // console.log(this.seller.id);
      }
    });
  },
  components: {
    'v-header': Header
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">

  @import './common/stylus/mixin.styl'

  .tab
    display:flex
    width:100%
    height:40px
    line-height:40px
    border-1px(rgba(7,17,27,0.1))
    .tab_item
      flex:1
      text-align: center
      & > a
        display:block
        font-size:14px
        color:rgb(77,85,93)
        &.active
          color:rgb(240,20,20)
    
</style>
