# 基于 Fetch 的请求封装

原生 fetch 请求失败后（如无网络）状态会变成 reject 走 .catch 。绝大多数情况下业务场景只需要给个 toast 等简单处理。每个请求都 .catch 会显得格外繁琐，并且如果不 .catch, .then 里面的后续处理不会触发，可能会导致逻辑中断。

基于上述情况，可以封装公共请求方法处理异常情况，返回固定格式 { code, data, massage }, 只需在 .then 里面获取数据并处理。

## 目标

1. 保留 fetch 语法不变
2. 返回 promise，且状态一定变成 resolve，返回固定数据格式 { code, data, message }
3. 给 url 动态添加域名
4. 默认失败弹出 toast，且提供开关
5. 默认请求中 loading，且提供开关

## 实现

实现如下

```ts
/**
 * 返回 Promise({ code, data, message});
 */

import { message } from 'antd';
import { dispatch } from '../index';
import { startLoading, endLoading } from '../store/globalSlice';

// 在 config/env.js 中设置
export const origin = process.env.ORIGIN;

interface MyInit extends RequestInit {
  noToastError?: boolean; // 默认false
  noLoading?: boolean; // 默认false
}

// 请求返回统一格式
export class Response {
  code: number;
  data: any;
  message: string | null;
  constructor(code: number, data: any, message: string | null) {
    this.code = code;
    this.data = data;
    this.message = message;
  }
}

export default (input: RequestInfo, myInit?: MyInit) => {
  const init: MyInit = myInit || {};

  // url 动态添加 origin
  if (typeof input === 'string') {
    if (!/https?:\/\//.test(input)) {
      input = origin + input;
    }
  }

  // 开始 loading
  if (!init?.noLoading) {
    dispatch(startLoading());
  }

  // 请求
  return fetch(input, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...init,
  })
    .then((resp) => {
      // code 不为 2xx
      if (!/^2\d{2}$/.test(String(resp.status))) {
        return new Response(resp.status, null, null);
      }

      return resp
        .json()
        .then((json) => {
          // toast错误信息
          if (json.code !== 0) {
            message.error(json.message);
          }

          // 退出登陆
          if (json.code === 20001) {
            // logout();
            // window.location.pathname = '/login';
          }

          // 请求成功的数据
          return json;
        })
        .catch((err) => {
          // 不是 json 格式
          return new Response(999998, null, 'data is not json.');
        });
    })
    .catch((err) => {
      // 请求发送失败
      message.error('您的网络可能不通，请确认后重试');
      return new Response(999999, null, err);
    })
    .finally(() => {
      // 结束 loading
      if (!init?.noLoading) {
        dispatch(endLoading());
      }
    });
};

```

目前只完成了对 json 数据的处理。

其中 loading 部分用了 redux 和 @reduxjs/toolkit，用一个变量记录当前请求个数，控制实际 loading 开始和结束，实现如下：

```ts
let count = 0;
export const startLoading = () => (dispatch: any) => {
  if (count === 0) {
    dispatch(setLoding(true));
  }
  count++;
};
export const endLoading = () => (dispatch: any) => {
  count--;
  if (count === 0) {
    dispatch(setLoding(false));
  }
};
```

## 使用

```js
import myfetch from './myfetch.ts';

myfetch('/xxx/xxx')
  .then(res => console.log(res))

myfetch('https://www.xxx.com/xxx/xxx')
  .then(res => console.log(res))

myfetch('/xxx/xxx', {
  methods: 'POST',
  body: JSON.stringify({}),
})
  .then(res => console.log(res))

myfetch('/xxx/xxx', {
  methods: 'POST',
  body: JSON.stringify({}),
  noToastError: true,
  noLoading: true,
})
  .then(res => console.log(res))
```

<br />

[whosmeya.com](https://www.whosmeya.com/)
