var path = require('path')
var utils = require('./utils')
var config = require('../config')
var vueLoaderConfig = require('./vue-loader.conf')

function resolve (dir) {//定义了当前项目的根目录
  return path.join(__dirname, '..', dir)
}

//webpack的一些基本配置
module.exports = {
  entry: {//表示webpack编译的入口文件
    app: './src/main.js'
  },
  output: {
    path: config.build.assetsRoot,//设置文件的路径,对应config.js文件的index.js里面的build内的assetsRoot
    filename: '[name].js',
    //表示请求的静态资源的绝对路径,对应config.js文件的build内的assetsPublicPath
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {// resolve 的配置是针对 require 或者 import 请求的文件的相关配置
    extensions: ['.js', '.vue', '.json'],//在请求的模块中自动补全文件的后缀
    alias: {//提供一些别名,在require中通过别名来缩短字符串的长度
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),//代表从src目录开始
      'routes$': path.resolve(__dirname, '../src/router/index.js'),
      'src': path.resolve(__dirname, '../src'),
      'assets': path.resolve(__dirname, '../src/assets'),
      'components': path.resolve(__dirname, '../src/components'),
      'common': path.resolve(__dirname, '../src/common'),
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [resolve('src'), resolve('test')],
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  }
}
