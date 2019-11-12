# 相关设计

## 特色
- 数据库连接池
- token身份验证


### 访问权限设计
> 请求过滤：  浏览器用户登陆发放token，对于没有token的请求直接pass，回复403
> token密钥为配置文件配置信息 + 日期为密钥
### 反爬虫设计



###  verify  /  all







# 后台接口

- 后台总体设计
  - `/v` 路径下的所有请求需要验证用户登陆信息（配置文件开启的情况下）
  - `/a` 为不需要验证随便请求的路径 
  - `/v/get` 为资源请求路径
  - `/v/post` 为资源上传路径


## 接口

#### `/a/login`
- type 
  - post
- argument
  - userName （用户名）
  - userPasswd （用户密码）
  - verifystr （验证码）
- return
  - token


#### `/v/get/nail/:fileName`
- type
  - get
- argument
  - fileName：动态参数自动从路径中截取
- return
  - type:bin 
  - data:图片数据


#### `/v/get/hd/:fileName/:fSize`
- type
  - get
- argument
  - fileName: 动态参数，自动从路径中获取，文件大小
  - fSize: 动态路由，自动从路径中获取参数，文件的大小，如果为假值则返回缩略图
- return
  - type:bin
  - data:图片数据


#### `/v/get/image/new/:begin/:len`
- type
    - get
- argument
  - begin: 动态参数，自动从路径中获取，
  - len: 每次获取的数量，1-300
- return
  - type:json
  - data:图片的信息









