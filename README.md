# 开发日志

> 很调皮的开发日志，记录以下自己的开发历程

## Project setup

```shell
npm install
```

### Compiles and hot-reloads for development

```shell
npm run dev
```

## 2019-10-14

- 毕业设计立项，`new folder`
- 虽然还没确定自主命题是否被选上，但是可以先着手开发了
- hello world 走一个

## 2019-10-15

- 写了hello world就不知道干啥了
- 先写数据库嘛（采用docker）
- 先安装docker

``` shell
docker run  -p 3306:3306 --name mymysql -v "D:\mysql\conf":"/etc/mysql/conf.d" -v "D:\mysql\logs":"/logs" -v "D:\mysql\data":"/var/lib/mysql" -e MYSQL_ROOT_PASSWORD=123456 -d mysql:latest -C utf8 --collation-server=utf8_bin b8fd9553f1f0
```

- -p 3306:3306：将容器的 3306 端口映射到主机的 3306 端口。
- -v D:\mysql\conf:/etc/mysql/conf.d：将主机当前目录下的 conf/my.cnf 挂载到容器的 /etc/mysql/my.cnf。
- -v D:\mysql\logs:/logs：将主机当前目录下的 logs 目录挂载到容器的 /logs。
- -v D:\mysql\data:/var/lib/mysql ：将主机当前目录下的data目录挂载到容器的 /var/lib/mysql 。
- -e MYSQL_ROOT_PASSWORD=123456：初始化 root 用户的密码。

## 2019-10-16

- 最近找工作 不知道什么情况   工作好难找哦！！！
- 今天又不知道写点啥
- 新增了两个后台文件，通过拆分了后台的路由表为  `/a`   `/v` 分支

## 2019-10-17

- 想想还是先写前端好一点，毕竟所有的需求都是围绕前端的界面来制定的，前端界面完成了，后端需要的API以及功能也就基本确定了
- 使用@Vue/cli工具创建Vue项目
- 难  受    。。。。。。        后端代码弄丢了     全部   全部   全部    shift  没有提交

## 2019-11-5

- 难搞哦，之前提交的申请竟然说我这网站没特色，满满的特色欸    再多点我真的做不完了
- 一周多没做这个了   难搞

## 2019-11-8

- 零星时间随便写点

## 2019-11-11

- 今天下午又写了几个API，但是数据库的很多东西都搞忘了，做起来比较麻烦，比如说：该死的外键

## 2019-11-13

- 寝室断水、断网了。难搞，现在毕业设计也不好写了，很多需要网的都做不了
- node-schedule  设置定时任务的工具包

## 2020-5-4

- 终于接近尾声了
- 毕业设计最后一个提交，封仓库了！！！！！
