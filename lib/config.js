/**
 * @author     hc
 * @time       2019-10-18
 * @change     2019-10-18
 * 配置文件
 *    1， 配置应用程序的各项属性
 *    2， 配置文件更新的时候服务器应该重启
 *    3， 守护线程在配置文件更新之后应该重启服务器
 */

const path = require("path");

module.exports = {
  // ==========================   基本文件路径    ==============================
  // 配置文件路径
  configPath: __filename,
  // 日志文件路径
  logPath: path.join(__dirname, "../logs/access.log"),
  // 静态资源文件路径
  staticPath: path.join(__dirname, "../assets"),
  // 图片资源文件夹
  imagePath: path.join(__dirname, ""),


  // =========================    全局属性   =================================
  // jsonWebToken验证
  jwtSecret: "tutuwallpaper",
  // 开启请求过滤
  enableVerify: true,
  // 服务器地址
  serveHost: '127.0.0.1',
  // 服务器端口
  servePort: 80,



  // ===========================  数据库     ==================================
  // 数据库主机
  dbHost: "127.0.0.1",
  // 数据库使用的端口
  dbPort: 3306,
  // 数据库登陆用户名
  dbUser: 'root',
  // 数据库用户密码
  dbPasswd: "123456",
  // 使用的数据库的名字
  dbDatabase: "bysj",
  // 数据库连接池数量
  dbPool: 10,
  // 数据库连接超时设置
  dbTimeOut: 30,










}