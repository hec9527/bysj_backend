/**
 * @author     hc
 * @time       2019-10-18
 * @change     2020-4-14
 * 配置文件
 *    1， 配置应用程序的各项属性
 *    2， 配置文件更新的时候服务器应该重启
 *    3， 守护线程在配置文件更新之后应该重启服务器
 */

const path = require('path');

module.exports = {
    // ==========================   基本文件路径    ==============================
    // 配置文件路径
    configPath: __filename,
    // 日志文件路径
    logPath: path.join(__dirname, '../logs/access.log'),
    // 静态资源文件路径
    staticPath: path.join(__dirname, '../assets'),
    // 图片资源文件夹
    imagePath: path.join(__dirname, ''),

    // =========================    全局属性   =================================
    // jsonWebToken验证
    jwtSecret: 'tutuwallpaper',
    // 开启请求过滤
    enableVerify: true,
    // 服务器地址
    serveHost: '127.0.0.1',
    // 服务器端口
    servePort: 8008,

    // ===========================  数据库     ==================================
    // 数据库主机
    dbHost: '127.0.0.1',
    // 数据库使用的端口
    dbPort: 3306,
    // 数据库登陆用户名
    dbUser: 'root',
    // 数据库用户密码
    dbPasswd: '123abc!@#',
    // 使用的数据库的名字
    dbDatabase: 'bysj',
    // 数据库连接池数量
    dbPool: 30,
    // 数据库连接超时设置
    dbTimeOut: 60,

    // ===========================  腾讯AI开放平台接入  ===========================
    // 接入应用名称
    appName: '牛牛壁纸',
    // 接入应用ID
    appId: '2125601142',
    // 接入应用的Key标识
    appKey: 'C95rQqvgJEBWwYJ2',
    // 接入文档地址
    // https://ai.qq.com/doc/imagetag.shtml
    // 接入应用图片识别接口
    appAPI: 'https://api.ai.qq.com/fcgi-bin/image/image_tag',

    // ===========================  QQ互联接入平台  ===========================
    // https://connect.qq.com/manage.html#/
    // TODO 配置QQ互联平台接入

    // ===========================  微信互联接入平台  ===========================
    // https://open.weixin.qq.com/cgi-bin/index?t=home/index&lang=zh_CN
    // TODO 配置微信互联平台接入
};
