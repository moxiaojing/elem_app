// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',//解析器，使用babel-eslint
  parserOptions: {
    sourceType: 'module'//类型是module，因为使用了ECMAScript模块
  },
  env: {
    browser: true,//预定义全局变量，浏览器环境
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: 'standard',//扩展，可以通过字符串和数组来扩展规则
  // required to lint *.vue files
  plugins: [
    'html'//插件，此插件用于识别文件中的js代码，没有MIME类型标识没有script标签也可以识别到，因此拿来识别.vue文件中的js代码
  ],
  // add your custom rules here
  'rules': {//这里写相关规则
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    "semi": [2, "always"], // 语句强制分号结尾,
    "no-trailing-spaces": 1,// 一行结束后面不要有空格
    "eol-last":0,// 忽略文件以换行符结束
    "space-before-function-paren":0,// 忽略函数()前面的空格
    "indent": 0 // 忽略缩进风格
    
  }
}
