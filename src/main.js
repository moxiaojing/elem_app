// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';

// 全局引用
import 'common/stylus/index.styl';

// 开启debug模式
Vue.config.debug = true;

// 关闭生产模式下给出的提示
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  // el: '#app',
  router,
  template: '<App/>',
  components: {
    App
  },
  data: {
    eventHub: new Vue() // 给data添加一个 名字为eventHub 的空vue对象,用来传输非父子组件的数据
  }
}).$mount('#app'); // 手动挂载，#app
