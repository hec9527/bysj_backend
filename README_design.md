# 相关设计

## 特色

- 数据库连接池
- token 身份验证

### 访问权限设计

> 请求过滤： 浏览器用户登陆发放 token，对于没有 token 的请求直接 pass，回复 403
> token 密钥为配置文件配置信息 + 日期为密钥

### 反爬虫设计

### verify / all

## 后台接口

- 后台总体设计
  - `/v` 路径下的所有请求需要验证用户登陆信息（配置文件开启的情况下）
  - `/a` 为不需要验证随便请求的路径
  - `/v/get` 为资源请求路径
  - `/v/post` 为资源上传路径

## 接口

### `/a/login`

- type
  - post
- argument
  - userName （用户名）
  - userPasswd （用户密码）
  - verifystr （验证码）
- return
  - token

### `/v/get/nail/:fileName`

- type
  - get
- argument
  - fileName：动态参数自动从路径中截取
- return
  - type:bin
  - data:图片数据

### `/v/get/hd/:fileName/:fSize`

- type
  - get
- argument
  - fileName: 动态参数，自动从路径中获取，文件大小
  - fSize: 动态路由，自动从路径中获取参数，文件的大小，如果为假值则返回缩略图
- return
  - type:bin
  - data:图片数据

### `/v/get/assets/image/new/:begin/:len`

- type
  - get
- argument
  - begin: 动态参数，自动从路径中获取，
  - len: 每次获取的数量，1-300
- return
  - type:json
  - data:图片的信息

### `/a/get/home/keyworld`

- type
  - get
- argument
  - kw: 关键字
  - count: 切片偏移
  - len：分页长度
- return

```js
return {
    code: 0,  // 状态码 0 正常  1 完结
    msg: 'ok', // 状态信息/错误信息
    len: 30,  // 返回数据长度
    total: 18000,  // 总计
    data:[{},{}]  // 数据载荷
}
```

### `/a/get/imageCategory`

- type
  - get
- argument
  - 无
- return

```js
return {
    code: 0,   // 返回状态
    msg: "ok",  // 返回信息
    len: 18,  // 数据长度
    data:[...]  // 数据有效荷载
}
```
