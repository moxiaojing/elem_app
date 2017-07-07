import Vue from 'vue';

Vue.filter('formatDate', function (value, fmt) {
  let date = new Date(value);
  let obj = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S': date.getMilliseconds() // 毫秒
  };
  // 匹配年
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  // 匹配月日 时 分 秒等
  for (let item in obj) {
    if (new RegExp('(' + item + ')').test(fmt)) {
      let str = '' + obj[item];
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : (('00' + str).substr(str.length)));
    }
  }
  return fmt;
});

