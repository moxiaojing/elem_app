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
