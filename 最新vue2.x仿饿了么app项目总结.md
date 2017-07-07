# 最新vue2.x仿饿了么app项目总结

标签（空格分隔）： vue

---
##前言
仿饿了么app是基于vue2.x最新实战项目，用到的技术栈

    vue2 + vue-router2 + vue-cli2 + vue-resource + stylus + flex + eslint + webpack2 
页面相对简单，所以没有用到vuex， 它更适合对复杂的单页面进行状态管理
###实现功能：
```
•	Goods、Ratings、Seller组件视图均可上下滚动
•	商品页 点击左侧menu，右侧list对应跳转到相应位置
•	点击list查看商品详情页，父子组件的通信
•	评论内容够可以筛选查看
•	购物车组件，包括添加删除商品及动效，购物控件与购物车组件之间非父子组件通信，点击购物车图标，展示选择的商品列表
•	商家实景图片可以左右滑动 
•	loaclStorage缓存商家信息（id、name）
```

项目地址：https://github.com/moxiaojing/elem_app

*如果觉得对您有帮助，您可以在右上角给我个star支持一下，谢谢！*

##1-项目结构分析：

    common/---- 文件夹存放的是通用的css和fonts
    components/----文件夹用来存放我们的 Vue 组件
    router/----文件夹存放的是vue-router相关配置（linkActiveClass,routes注册组件路由）
    build/----文件是 webpack 的打包编译配置文件
    config/----文件夹存放的是一些配置项，比如我们服务器访问的端口配置等
    dist/----该文件夹一开始是不存在，在我们的项目经过 build 之后才会产出
    prod.server.js----该文件是测试是模拟的服务器配置，用来运行dist里面的文件，在config/index.js中,build对象中添加一条端口设置port：9000，
    App.vue----根组件，所有的子组件都将在这里被引用，eventHub空实例是用来组件间通信的中央数据总线作用，主要连接购买控件和购物车组件之间的数据通信
    index.html----整个项目的入口文件，将会引用我们的根组件 App.vue
    main.js----入口文件的 js 逻辑，在 webpack 打包之后将被注入到 index.html 中

##2-各组件之间的关系：
```
├──APP.vue
  │  ├──Header.vue--头部组件
  │  │  ├──iconClassMap--图标组件（减，折，特，票，保）
  │  │  ├──Star.vue--星星评分组件
  │  ├──Goods.vue--商品组件
  │  │  ├──iconClassMap--图标组件（减，折，特，票，保）
  │  │  ├──Shopcart.vue--购物车组件,包括小球飞入购物车动画,使用this.\$root.eventHub.\$on('cart.add', this.drop)接收，并给drop方法使用
  │  │  ├──CartControl.vue--购买控件--选中数量返回给父组件goods，goods响应后，重新计算选中数量，并用this.\$root.eventHub.\$emit（'name',event.target）将数据发送给购物车组件，
  │  │  ├──Foodinfo.vue--商品详情页
  │  │  │  ├──RatingSelect.vue--评价内容筛选组件    
  │  ├──Ratings.vue--评论组件
  │  │  ├──RatingSelect.vue--评价内容筛选组件
  │  ├──Seller.vue--商家组件
  │  │  ├──iconClassMap--图标组件（减，折，特，票，保）

独立组件
  ├──iconClassMap--图标组件（减，折，特，票，保）
  ├──split.vue--关于分割线组件
  ├──RatingSelect.vue--评价内容筛选组件
```

##3-开发过程问题汇总：

###3-1、better-scroll插件在移动端使用时需要设置click：true，否则移动端滑动无效

###3-2、分开设置css样式：
图标icon.css--文字图标样式，通过icommon.io网站 将svg图片转成文字图标样式
公共base.css--处理设备像素比的一些样式,针对border-1px问题，不同设备像素比，显示的线条粗细不同
工具mixin.css--设置border-1px样式和背景样式

###3-3、sticky-footer布局

header组件的详情页采用sticky-footer布局，主要特点是如果内容不够长，页脚部分也会贴在视窗底部，内容足够长，就会将页脚推到内容底部，父级position:fixed,内容设为padding-bottom:64px，页脚相对定位，margin-top:-64px

###3-4、要求宽度自适应的布局，
采用flex布局,父级display:fixed,子元素flex:放大倍数，缩小倍数，基准值

###3-5、背景模糊效果
` filter：blur(10px)`,注意，所有在内的子元素也会模糊，包括文字，所以采用定位布局，背景单独占用一个层，ios有一个设置`backdrop-filter:blur(10px)`，只会模糊背景,但不支持android

###3-6、transition过渡

在购买控件中使用transition过渡效果，实现添加减少按钮的动效，和小球飞入购物车的动效（模仿贝塞尔曲线的效果）

vue2.x里面定义了transition过渡状态，
name - string, 用于自动生成 CSS 过渡类名。

    例如：name: 'fade' 将自动拓展为.fade-enter，.fade-enter-active等。默认类名为 "v"
    
    fade-enter
    fade-enter-active
    fade-leave
    fade-leave-active
                
包括transition过渡的钩子函数

    before-enter
    before-leave
    before-appear
    enter
    leave
    appear
    after-enter
    after-leave
    after-appear
    enter-cancelled
    leave-cancelled (v-show only)
    appear-cancelled

详情请查看[vue2.x-transition详解][1]


###3-7、seller组件：

####3-7-1问题一：seller页面中商品商家实景图片横向滚动
解决方案：每个li要display：inline-block，因为width不会自动撑开父级ul，所以需要计算ul的width，**（每一张图片的width+margin）*图片数量-一个margin**，因为最后一张图片没有margin
同时new BScroll里面要设置`scrollX: true,eventPassthrough: 'vertical',// 滚动方向横向`

####3-7-2问题二：打开seller页面，无法滚动
问题分析：出现这种现象是因为better-scroll插件是严格基于DOM的，数据是采用异步传输的，页面刚打开，DOM并没有被渲染，所以，要确保DOM渲染了，才能使用better-scroll，
解决方案：用到`mounted`钩子函数，同时搭配`this.$nextTick()`

####3-7-3问题三：在seller页面，刷新后，无法滚动
问题分析：出现这种情况是因为mounted函数在整个生命周期中只会只行一次
解决方案：使用watch方法监控数据变化，并执行滚动函数 `this._initScroll();this._initPicScroll();`

###3-8、缓存数据
使用window.localStorage保存和设置缓存信息，封装在store.js文件内
```
//将页面信息保存到localStorage里
export function saveToLocal(id, key, value) {
  let store = window.localStorage._store_; // 新定义一个key值_store_，存放要保存的数据对象
  // _store_ {
  //   store[id]: {
  //     key: value
  //   }
  // }
  if (!store) {
    store = {};
    store[id] = {};
  } else {
    store = JSON.parse(store); // String格式--> json格式
    if (!store[id]) {
      store[id] = {};
    }
  }
  store[id][key] = value;
  window.localStorage._store_ = JSON.stringify(store); // 将json格式转成String格式，存放到window.localStorage._store中
}



//将localStorage信息设置到页面中
export function loadFromLocal(id, key, defaults) {
  let store = window.localStorage._store_;
  if (!store) { // 一开始是没有的，因为没有点击事件，所以显示默认数据
    return defaults;
  }
  store = JSON.parse(store)[id]; // 将json格式-->String格式
  // console.log(store); // {"isFavorite":true}
  if (!store) {
    return defaults;
  }
  let ret = store[key];
  return ret || defaults;
}

```

###3-9、解析url，得到商家信息，包括id，name，在获取数据时，直接赋值，商家的id或name会被丢掉
使用window.localStorage.search获取url地址，并进行解析 
封装在tools.js文件内

```
/**
 * http://localhost:8080/#/Seller
 *  https://h5.ele.me/shop/#id=151667422
 * ?id=1234&name=zpxf
 */
 
/////////方法一：
export function urlParse() {
  let url = window.location.search;
  let obj = {};
  let reg = /[?&][^?&]+=[^?&]+/g;
  let arr = url.match(reg);
  // ['?id=12345', '&a=b']
  if (arr) {
    arr.forEach((item) => {
      let tempArr = item.substring(1).split('=');
      // 因为tempArr是url中的参数，所以要用decode进行转化
      let key = decodeURIComponent(tempArr[0]);
      let val = decodeURIComponent(tempArr[1]);
      obj[key] = val;
    });
  }
  return obj;
};

/////////方法二：
export function urlParse() {
  let urlArr = window.location.search.substr(1).split('&'); // 截取掉?,并以&分开，存入数组
  // console.log(urlArr); // ["id=1234", "name=zpxf"]
  let obj = {};
  if (urlArr) {
    urlArr.forEach((item) => {
      let arr = item.split('='); // 每一项用=分开存入数组,arr[0]=key,arr[1]=value
      // console.log(arr); // [id,1234] [name,zpxf]
      let key = decodeURIComponent(arr[0]); // 对url解码
      let val = decodeURIComponent(arr[1]);
      obj[key] = val;
    });
  }
  // console.log(obj); // {id: "1234", name: "zpxf"}
  return obj;
};

```

我们需要将得到的id和name带到数据中，实际上在获取数据的时候，并没有带着id和name，这时就要用到es6语法中`Object.assign()`,官方解释为：*可以把任意多个的源对象自身的可枚举属性拷贝给目标对象，然后返回目标对象。*

```
this.seller = Object.assign({}, this.seller, response.data);

//即将vm.seller属性和请求返回数据对象合并到空对象，然后赋值给vm.seller,这里加上this.seller即提供了一种可扩展的机制，倘若原来的属性中有预定义的其他属性。
```


###3-10、goods,ratings,seller组件之间切换时会重新渲染
解决方案：在app.vue内使用`keep-alive`，保留各组件状态，避免重新渲染

```
<keep-alive>
    <router-view :seller="seller"></router-view>
</keep-alive>
```

##4-项目总结

###4-1、vue-router
使用`<router-link>`组件完成导航，`<router-link>`默认会被渲染成一个 `<a>` 标签，但必须使用`to`属性，指定连接
```
 <!-- 导航 -->
<router-link to="/home">home</router-link>
<router-link to="/about">about</router-link>

<!-- 路由出口 组件渲染容器 -->
<router-view></router-view>

```

```
import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Resource);
// 定义每个路由对应一个组件
let router = new Router({ // 创建 router 实例，然后传 `routes` 配置
  linkActiveClass: 'active',
  routes: [{
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
      path: '/Goods',
      name: 'Goods',
      component: Goods
    },
    {
      path: '/Ratings',
      name: 'Ratings',
      component: Ratings
    }
  ]
});
export default router;
router.push('goods');// 相当于页面初始化，显示goods的内容

// 挂载
new Vue({
  el: '#app',
  template: '<App/>',
  router: router,
  components: { App }
});

//或者另一种挂载
new Vue({
  template: '<App/>',
  router: router,
  components: { App }
}).$mount(#app);//手动挂载，#app
```
 
###4-2、vue-resource
通过 `this.$http.get`来定义通过vue实例来发送get请求，然后通过`then`后面的回调函数将请求成功的数据接收，通过状态码来判断是否成功以及复制给vue的数据对象。由于这里是用的mock数据（模拟后台数据），所以用的模拟状态码。

同时，这里省略了`errorcallback`的定义，正常开发中需要进行定义，甚至可以利用vue-resource的`inteceptor`进行体验优化，比如定义请求时的loading动画界面。在vue中即可以提取出loading组件。

```
const ERR_OK = 0;//表示没有错误信息，即获取数据成功
this.$http.get('/api/seller').then((response) => {
  response = response.body;
  if (response.errno === ERR_OK) {
    this.seller = Object.assign({}, this.seller, response.data);
  }
});
```
###4-3、Object.assign(target, source1, source2);
这是es6的语法，用于对象合并，将源对象（source）的所有可枚举属性，复制到目标对象（target）。

    Object.assign方法的第一个参数是目标对象，后面的参数都是源对象。

注意，如果目标对象与源对象有同名属性，或多个源对象有同名属性，则后面的属性会覆盖前面的属性。

```
var target = { a: 1, b: 1 };

var source1 = { b: 2, c: 2 };
var source2 = { c: 3 };

Object.assign(target, source1, source2);
target // {a:1, b:2, c:3}

```

另外需要注意的是`Object.assign()`方法只会拷贝源对象自身的并且可枚举的属性到目标身上。也就意味着继承属性和不可枚举属性是不能拷贝的，而且拷贝是对象的属性的引用而不是对象本身。

###4-4、组件间通讯
vue是组件式开发，所以组件间通讯是必不可少的。vue提供了一种方式，即在子组件定义props来传递父组件的数据对象。
```
// 父组件
<v-header :seller="seller"></v-header>

// 子组件 header.vue
props: {
  seller: {
    type: Object
  }
}
```
如果是子组件想传递数据给父组件，需要派发自定义事件，使用$emit派发，
父组件使用`v-on`接收监控（v-on可以简写成@）
```

// 子组件 RatingSelect.vue，派发自定义事件isContent，将this.onlyContent数据传给父级

this.$emit('isContent', this.onlyContent);
this.$emit('selRatings', this.selectType);

// 父组件 foodInfo.vue 在子组件的模板标签里，使用v-on监控isContent传过来的数据

<v-ratingselect :ratings="food.ratings" :select-type="selectType" :only-content="onlyContent" :desc="desc" @selRatings="filterRatings" @isContent="iscontent"></v-ratingselect>

```
非父子组件之间通信，vue官方锐减使用vueX，但是这里相较简单，所以采用的是利用给一个空实例eventHub，作为两个组件的中央数据总线，使用`this.$root.eventHub.$emit`来派发自定义事件，使用`this.$root.eventHub.$on`来监控
这里特别说明`$root`，官方解释：表示当前组建树的根实例，如果根实例没有父实例，次实例将会是自己
```
//main.js
new Vue({
  // el: '#app',
  router,
  template: '<App/>',
  components: {
    App
  },
  data: {
    eventHub: new Vue() // 给data添加一个 名字为eventHub 的空vue实例,用来传输非父子组件的数据
  }
}).$mount('#app'); // 手动挂载，#app



//foodInfo.vue组件派发自定义事件cart.add，传递信息event.target
this.$root.eventHub.$emit('cart.add', event.target); // 传输点击的目标元素


//Shopcart.vue组件监控cart.add
created() {
    // 获取按钮组件的点击的元素，用在drop方法里
    this.$root.eventHub.$on('cart.add', this.drop);
},
methods:{
    drop(element){
        //to do ...
    }
}
```

###4-5、组件提取管理

    将相同样式或功能的区块单独提出来，作为一个组件。
    
另外组件中用到的图片等资源就近维护，即可以考虑在组件文件夹中新建images文件夹。

抽离组件遵循原则：
*要尽量遵循单一职责原则，复用性更高，不要设置额外的margin等影响布局的东西*

##5-css预处理器--stylus
全局安装，安装之前你需要你安装 nodejs 

    $ npm install stylus -g
index.styl是stylus文件的入口文件，里面使用@import 引入各种styl文件

```
@import './mixin.styl'
@import './base.styl'
@import './icon.styl'
```
在入口文件main.js中全局引用index.styl
```
import 'common/stylus/index.styl';
```

```
// 使用stylus可以快速且保证兼容的实现border-1px：
//mixin.styl

border-1px($color)
    position:relative
    &:after
        content:''
        display:block
        position:absolute
        left:0
        bottom:0
        width:100%
        border:1px solid $color
@media(-webkit-min-device-pixel-ratio:1.5),(min-device-pixel-ratio:1.5)
    .border-1px
        &::after
            -webkit-transform:scaleY(0.7)
            transform:scaleY(0.7)
@media(-webkit-min-device-pixel-ratio:2),(min-device-pixel-ratio:2)
    .border-1px
        &::after
            -webkit-transform:scaleY(0.5)
            transform:scaleY(0.5)        
        
```

##6-打开app应用，默认显示goods内容
想要达到这种目的，有两种方法，一种是利用重定向，另一种是利用vue-router的导航式编程。
###6-1、重定向
```
//在router的index.js文件中设置，要多写一个对象，指向目标组件
routes: [
    {
      path: '/',
      redirect: '/Goods',// 重定向
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
```
###6-2、导航式编程
```
router.push('/Goods');
```

##7-关于eslint
`eslint` 是一个js代码风格检查器，配合vue-cli脚手架中的热更新，可以很方便的定位和提示错误。在公司多人协作开发时可以确保代码风格保持一致，可以很方便的阅读他人的代码。

刚使用时，会不太习惯，但是坚持下来，自己写的代码越来越整齐规范，越来越漂亮，自己会有很大的满足感。对自己，对他人都是一件非常有益的事！

##8-关于其他
##8-1、vue2相较vue1有很多地方改动
比如

>*  `v-for`的书写格式，多出：key值，而且必须写
>*  transition书写格式不在是在元素标签上写，而是作为一个标签`<transition></transition>`将目标元素包起来,过渡状态变为4种状态
>*  v-el 和 v-ref 都弃用，改为使用`ref`属性为元素或组件添加标记，通过`$refs`获取

具体详细内容，请参看官网[从vue1.x迁移][2]

##8-2、项目运行
```
克隆项目到本地
git clone https://github.com/JerryYgh/m-eleme.git

安装依赖
npm install

本地开发，开启服务器，浏览器访问http://localhost:8080
npm run dev

构建生产
npm run build

运行打包文件
node prod.server.js 

会看到 Listening at http://localhost:9000 在浏览器中打开即可

```

##8-3、手机测试网页技巧

  将localhost换成自己的ip，Windows在命令行执行ipconfig查看，mac执行ifconfig查看。

  然后复制地址栏地址，进入[草料二维码][3]，然后生成二维码，然后用手机扫一扫就可以查看了，前提是，你手机和电脑必须在同一个局域网。
  
##9-学习参考

 - vue2.0官网： https://vuefe.cn/v2/guide/
 - webpack1免费视频课程，戳这里：http://www.imooc.com/learn/802
 - webpack1向webpack2升级：https://webpack.js.org/guides/migrating/
 - better-scroll插件使用：https://github.com/ustbhuangyi/better-scroll
 - stylus： http://www.zhangxinxu.com/jq/stylus/
 - ES6: http://es6.ruanyifeng.com/
 - Sticky footers http://www.w3cplus.com/css3/css-secrets/sticky-footers.html
 - Flex弹性布局: http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html?utm_source=tuicool
 - localStorage本地存储: http://www.cnblogs.com/st-leslie/p/5617130.html


  [1]: http://cn.vuejs.org/v2/api/#transition
  [2]: http://cn.vuejs.org/v2/guide/migration.html
  [3]: http://cli.im/