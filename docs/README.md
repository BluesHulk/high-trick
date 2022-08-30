# 模块说明

- [http](#http)
- [utils](#utils)

## http

本项目使用的是 `@silen/http`

先介绍 `http` 的使用方法
```js
import { http } from '@silen/http'

export function getLightTypes(params) {
  return http({
    url: '/common/device-type',
    method: 'GET',
    params
  });
}
```

该模块暴露的其余的方法如下

- `fetch` 是 `get` 方式的请求
- `post` 是 `post` 方式的请求
- `deletes` 是 `delete` 方式的请求
- `head` 是 `head` 方式的请求
- `put` 是 `put` 方式的请求
- `patch` 是 `patch` 方式的请求
- `axios` 是 `axios` 原始的对象，未作封装

请求参数与[axios文档](https://www.kancloud.cn/yunye/axios/234845)保持一致的

常用请求用法
```js
// get类型的
fetch('/your/path', { a: 1 }).then(res => {
  console.log(res);
});

// delete
deletes('/your/path', { a: 1 }).then(res => {
  console.log(res);
});

// post
post('/your/path', { a: 1 }).then(res => {
  console.log(res);
});
```

当然，这些方法在每个组件内部都可以使用，使用方式如下
```js
// 使用http方法

this.$$http({
  url: '/your/path'
});

// 等价于
this.$$fetch('/your/path', params = {}).then(res => {
  console.log(res);
});

// post
this.$$post('/your/path', data = {}).then(res => {
  console.log(res);
})
```

**注意**
- 没有封装 `request` 方法，这是axios内部会调用的方法
- `fetch`、`post`、`deletes`、`head`、`put`、`patch`方法都是基于 `http` 进行的封装

>如果遇到第三方的请求对接，请求方式有区别的，可以修改http请求的配置，或者直接使用原来的axios


## utils

暴露的模块方法：

方法名| 例子
---|--- 
getStyle | `getStyle(document.getElementById('app'), 'height')` 得到 ·`'20px'` 
setStyle | `setStyle(document.getElementById('app'), { height: '20px' })`
setFontSize | `setFontSize(屏幕宽度与设计稿尺寸的比例, once)`， `once` 为 `true` 表示只会设置一次字体的尺寸
isFunction | `isFunction(functionName)`
extend | `extend(a = {}, b = {}, label = '')` 将 `b` 对象里的属性copy到 `a` 对象上，`label` 是为 copy 到 `a` 对象上的属性添加名称前缀
extendClassDefault | `extendClassDefault(a = {}, b = {}, label = '')` 大致同上，区别在于，将 `default` 属性拷贝到 `a` 对象上
extendClass | `extendClass(a = {}, b, writable, label = '')` 为 `a` 对象添加类（即参数 `b`），因为类本质就是 `function` 类型，`writable` 为 `false` 表示不可以修改，label 添加的前缀名称
extendClasses | `extendClasses(a = {}, b, writable, label = '')` 是对上面的一个方法的进行二次改进，处理的是数组类型，区别在于第二个参数为数组类型，用法 `utils.extendClasses(Vue.prototype, [Storage, AnimationType, ProxyForm], false, '$$');`
def | `def(obj, key: string, val: any, writable: boolean, enumerable: boolean)` 一般不会用这个方法
getEmptyObject | `getEmptyObject()` 不需要任何参数
arrayLikeToObject | `arrayLikeToObject({0: 'a', 2: 'b', length: 4})` 得到 `["a", undefined, "b", undefined]`
isObject | `isObject(obj)` 判断参数是否为对象类型
getRndStr | `getRndStr(len, charSet = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789')` 从指定的字符串里获取随机的字符串，例子，`getRndStr(5)`、`getRndStr(5, 1451245)`
getUniqueString | `getUniqueString(length)` 获取指定长度的不重复的字符串
getRndNumber | `getRndNumber(min, max, exact)` 获取随机数，例，`getRndNumber(1, 8, 4)`得到`"1.3786"`，`getRndNumber(1, 8)` 得到 `4`
rgba | `rgba(alpha = 1)` 获取随机的rgba颜色
hex | `hex()` 无参数
