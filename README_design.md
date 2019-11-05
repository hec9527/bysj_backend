# 相关设计

### 访问权限设计
> 请求过滤：  浏览器用户登陆发放token，对于没有token的请求直接pass，回复403
> token密钥为配置文件配置信息 + 日期为密钥
### 反爬虫设计



### 







# 后台接口

- 后台总体设计
  - `/v` 路径下的所有请求需要验证用户登陆信息（配置文件开启的情况下）
  - `/a` 为不需要验证随便请求的路径 
  - `/v/s/g` 为资源请求路径
  - `/v/s/p` 为资源上传路径


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













