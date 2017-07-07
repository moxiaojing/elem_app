import Vue from 'vue';
import Router from 'vue-router';
import Resource from 'vue-resource';
import Header from '@/components/header/Header';
import Seller from '@/components/Seller/Seller';
import Goods from '@/components/Goods/Goods';
import Ratings from '@/components/Ratings/Ratings';

// 定义路由插件
Vue.use(Router);

// 定义ajax获取数据的插件Resourse
Vue.use(Resource);

// 定义每个路由对应一个组件
let router = new Router({ // 创建 router 实例，然后传 `routes` 配置
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      redirect: '/Goods',
      name: 'Goods',
      component: Goods
    },
    {
      path: '/Goods',
      name: 'Goods',
      component: Goods
    },
    {
      path: '/Header',
      name: 'Header',
      component: Header
    },
    {
      path: '/Seller',
      name: 'Seller',
      component: Seller
    },
    {
      path: '/Ratings',
      name: 'Ratings',
      component: Ratings
    }
  ]
});
export default router;
// router.push('Goods');// 相当于应用一进来就显示goods的内容
// router.push方法就是用来动态导航到不同的链接的。它会向history栈添加一个新的记录，点击<router-link :to="...">等同于调用router.push(...)。
