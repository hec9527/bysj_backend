# 爬虫模块

- 爬虫模块负责从网上爬取资源，然后由后端模块调用，并且提供简单的 API

- 爬虫模块主要用到 requrests 库

- 模块暴露的接口使用 nodejs 方便后端调用

## 依赖

- 生成依赖文件

```shell
  pip3 freeze > requirements.txt
```

- 安装依赖文件

```shell
  pip3 install -r requirements.txt
```

## 相关文档

| 文档         | 地址                                             |
| ------------ | ------------------------------------------------ |
| 腾讯智能识图 | `https://ai.qq.com/console/capability/detail/12` |

## 自动格式化pyhon文本

`yapf -i -r [文件夹名]`
