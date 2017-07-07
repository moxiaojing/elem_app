var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')//开发和运行的配置文件所共享的,
var HtmlWebpackPlugin = require('html-webpack-plugin')//提供操作HTML文件的一个插件
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

// add hot-reload related code to entry chunks
//热加载功能模块,代码改动,浏览器不刷新实现代码功能
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

module.exports = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: '#cheap-module-eval-source-map',//开发时方便我们做源码调试
  plugins: [//定义的一些插件
    new webpack.DefinePlugin({//把源码中的 process.env 字符串替换为 config.dev.env
      'process.env': config.dev.env
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',//编译后生成的html文件名 
      template: 'index.html',
      inject: true //打包过程中输出的js或者css文件路径会自动添加到这个 HTML 文件里
    }),
    new FriendlyErrorsPlugin()
  ]
})
